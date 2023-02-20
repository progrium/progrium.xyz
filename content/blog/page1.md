---
title: This is a title
layout: blog
date: "2023-01-01"
---
Built to maximize versatility, control, and performance, **Recursive** is a five-axis variable font. This enables you to choose from a wide range of predefined styles, or dial in exactly what you want for each of its axes: *Monospace, Casual, Weight, Slant, and Cursive*. Taking full advantage of variable font technology, Recursive offers an unprecedented level of flexibility, all from a single font file.

```go
package main

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha1"
	"flag"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/pkg/errors"

	"github.com/go-ble/ble"
	"github.com/go-ble/ble/darwin"
)

type LockitronLockStatus byte

const (
	UNLOCKED LockitronLockStatus = 0
	LOCKED   LockitronLockStatus = 1
)

var (
	lockOrUnlock LockitronLockStatus

	lockID  = flag.String("id", "", "lockitron peripheral id")
	userKey = flag.String("key", "", "lockitron user access key")

	// zero iv
	zeroIV = make([]byte, 16)

	done = make(chan struct{})
)

////////////////////////////

// do the initial connection handshake (e.g. confirm we have user access key)
func prepareHandshakePayload(reqID, nonce []byte) []byte {
	mac := hmac.New(sha1.New, []byte(*userKey))
	mac.Write(nonce)
	userKeyHMAC := mac.Sum(nil)

	handshake := make([]byte, 4)
	handshake[0] = 0x50     // command = wakeup / authentication?
	handshake[1] = reqID[0] // 16-bit request ID
	handshake[2] = reqID[1]
	handshake[3] = byte(len(userKeyHMAC))
	handshake = append(handshake, userKeyHMAC...)

	crc := getCRC16(handshake)
	handshake = append(handshake, byte((crc>>8)&0xFF), byte(crc&0xFF))
	return handshake
}

// 2-stage payload. internal payload is encrypted with userKey
func prepareLockChangePayload(reqID []byte, unlockLock bool, preprepared ...[]byte) []byte {
	// 13 bytes of randomness, +1 byte for the on/off command
	changeLockCommand := make([]byte, 14, 16)
	if len(preprepared) == 0 {
		rand.Read(changeLockCommand)
		if unlockLock {
			changeLockCommand[5] = 0
		} else {
			changeLockCommand[5] = 1
		}
	} else {
		changeLockCommand = append(changeLockCommand[:0], preprepared[0][:14]...)
	}
	// +2 bytes CRC16 = 16 byte internal payload
	crc := getCRC16(changeLockCommand)
	changeLockCommand = append(changeLockCommand, byte((crc>>8)&0xFF), byte(crc&0xFF))

	// encrypt the internal payload with user key
	cipherCommand := encrypt([]byte(*userKey), changeLockCommand)
	fmt.Printf("before: %x\nafter: %x\n", changeLockCommand, cipherCommand)

	changeLockState := make([]byte, 4, 22)
	rand.Read(changeLockState)
	changeLockState[0] = 0x1c     // command = change lock state
	changeLockState[1] = reqID[0] // requestID
	changeLockState[2] = reqID[1]
	changeLockState[3] = byte(len(changeLockCommand)) // payload count

	// append the internal encrypted payload
	changeLockState = append(changeLockState, cipherCommand...)

	crc = getCRC16(changeLockState)
	changeLockState = append(changeLockState, byte((crc>>8)&0xFF), byte(crc&0xFF))
	return changeLockState
}

func getCRC16(data []byte) uint16 {
	var crc uint16
	for _, d := range data {
		crc = uint16(d) ^ crc
		for i := 0; i < 8; i++ {
			if (crc & 1) == 1 {
				crc = ((crc >> 1) & 0x7FFF) ^ 40961
			} else {
				crc = ((crc >> 1) & 0x7FFF)
			}
		}
	}
	return crc
}

func encrypt(key, payload []byte) []byte {
	aesBlock, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}
	stream := cipher.NewCBCEncrypter(aesBlock, zeroIV)
	result := make([]byte, len(payload))
	stream.CryptBlocks(result, payload)
	return result
}

func main() {
	flag.Parse()
	switch flag.Arg(0) {
	case "lock":
		lockOrUnlock = LOCKED
	case "unlock":
		lockOrUnlock = UNLOCKED
	default:
		log.Fatalln(`last argument should be "lock" or "unlock"`)
	}

	d, err := darwin.NewDevice()
	if err != nil {
		log.Fatalf("Failed to open device, err: %s\n", err)
		return
	}
	ble.SetDefaultDevice(d)

	id := strings.Replace(strings.ToUpper(*lockID), "-", "", -1)
	log.Println("Scanning for", id, "...")
	//ctx := ble.WithSigHandler()
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)

	c, err := ble.Connect(ctx, func(a ble.Advertisement) bool {
		return strings.ToUpper(a.LocalName()) == id
	})
	if err != nil {
		log.Fatal(err)
	}
	log.Println("CONNECTED")

	if _, err := c.ExchangeMTU(23); err != nil {
		log.Fatalf("Failed to set MTU, err: %s\n", err)
	}

	// Discover services
	ss, err := c.DiscoverServices(nil)
	if err != nil {
		log.Fatalf("Failed to discover services, err: %s\n", err)
	}

	toWatch := make(map[string]*ble.Characteristic)
	for _, s := range ss {
		log.Println("SERVICE:", s.UUID)
		if s.UUID.String() != "a1a51a187b7747d291db34a48dcd3de9" {
			continue
		}

		// Discover characteristics
		cs, err := c.DiscoverCharacteristics(nil, s)
		if err != nil {
			log.Printf("Failed to discover characteristics, err: %s\n", err)
			continue
		}

		for _, c := range cs {
			cname := "unknown"
			switch c.UUID.String() {
			case "1a53e10758f747e5a919acc9e05a908b":
				cname = "CLCK"
			case "c2bea3d2ae334e9fabeee05377f8623f":
				cname = "STAT"
			case "26397326157c4364acade7441b43e3fc":
				cname = "CRYP"
			case "562e4701c08e4547a7b0908823260df3": // not readable...
				cname = "CMDS"
			default:
				continue
			}
			log.Println(cname, "==>>", c.UUID)
			toWatch[cname] = c
		}
	}

	if len(toWatch) < 3 {
		log.Fatal(toWatch)
	}
	//////////////////////////

	// read the per-connection nonce
	nonce, err := c.ReadCharacteristic(toWatch["CRYP"])
	if err != nil {
		log.Fatal("initial auth failed:", err)
	}
	log.Printf("got handshake nonce: %x\n", nonce)

	reqIDBytes := make([]byte, 2)
	rand.Read(reqIDBytes)
	handshake := prepareHandshakePayload(reqIDBytes, nonce)
	log.Printf("sending handshake: %x\n", handshake)

	err = c.WriteCharacteristic(toWatch["CMDS"], handshake, true)
	if err != nil {
		log.Fatal("handshake failed:", err)
	}
	time.Sleep(time.Second * 2)

	resp, err := c.ReadCharacteristic(toWatch["CLCK"])
	if err != nil {
		log.Fatal("handshake failed2:", err)
	}
	log.Printf("handshake response: %x\n", resp)

	time.Sleep(time.Second * 2)
	// handshake complete
	/////////////////////

	changeLockState := prepareLockChangePayload(reqIDBytes, lockOrUnlock == UNLOCKED)
	err = c.WriteCharacteristic(toWatch["CMDS"], changeLockState, true)
	if err != nil {
		log.Fatal("lock change failed:", err)
	}

}

func chkErr(err error) {
	switch errors.Cause(err) {
	case nil:
	case context.DeadlineExceeded:
		fmt.Printf("timeout\n")
	case context.Canceled:
		//fmt.Printf("canceled\n")
	default:
		log.Fatalf(err.Error())
	}
}
```

Diam volutpat commodo sed egestas egestas fringilla. Ipsum dolor sit amet consectetur adipiscing elit ut aliquam purus. Magna etiam tempor orci eu lobortis elementum nibh tellus. Vivamus arcu felis bibendum ut tristique et. Nisl vel pretium lectus quam id leo in vitae. Odio aenean sed adipiscing diam donec adipiscing tristique risus. Risus commodo viverra maecenas accumsan. Feugiat in fermentum posuere urna nec tincidunt. Fermentum odio eu feugiat pretium nibh. Varius sit amet mattis vulputate enim nulla aliquet porttitor. Tempor nec feugiat nisl pretium fusce. Vitae justo eget magna fermentum. Turpis nunc eget lorem dolor sed viverra ipsum. Iaculis urna id volutpat lacus laoreet non curabitur. Eu sem integer vitae justo eget magna fermentum iaculis. Id aliquet lectus proin nibh nisl. Id velit ut tortor pretium viverra suspendisse. Accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu.

Facilisi etiam dignissim diam quis enim lobortis scelerisque fermentum dui. Enim nec dui nunc mattis enim. Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra. Sociis natoque penatibus et magnis. Ut sem nulla pharetra diam sit amet nisl. Eget est lorem ipsum dolor sit amet consectetur. Sit amet purus gravida quis blandit turpis cursus in. Ornare aenean euismod elementum nisi quis eleifend quam. Id semper risus in hendrerit. Mauris pharetra et ultrices neque ornare. Tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra. Scelerisque fermentum dui faucibus in ornare. Massa eget egestas purus viverra accumsan in. A diam maecenas sed enim ut sem viverra. Ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin.

Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. Non odio euismod lacinia at. At consectetur lorem donec massa sapien. Mi in nulla posuere sollicitudin aliquam ultrices sagittis orci a. Blandit volutpat maecenas volutpat blandit aliquam etiam erat. Nunc eget lorem dolor sed viverra. Ullamcorper malesuada proin libero nunc consequat. Sit amet risus nullam eget. Vitae justo eget magna fermentum. Enim facilisis gravida neque convallis a. Et netus et malesuada fames ac turpis egestas. Et leo duis ut diam quam nulla porttitor. Scelerisque purus semper eget duis at tellus at urna. Dictum at tempor commodo ullamcorper a lacus vestibulum sed arcu. Mi tempus imperdiet nulla malesuada pellentesque. Blandit volutpat maecenas volutpat blandit aliquam etiam erat. Amet consectetur adipiscing elit ut aliquam purus sit. Nullam vehicula ipsum a arcu cursus. Auctor eu augue ut lectus arcu bibendum at.