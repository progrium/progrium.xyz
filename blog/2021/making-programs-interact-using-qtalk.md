---
title: Making programs interact using qtalk
layout: blog.njk
date: "2021-08-24"
description: qtalk-go is a versatile IPC/RPC library for Go
tags: programming, showdev, go
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t3bazpkc56ju321zlsvk.gif
---

Today I'm releasing a beta of [qtalk-go](https://github.com/progrium/qtalk-go), a versatile IPC/RPC library for Go. I've been using and iterating on it for 5 years to get it as simple and clear as possible. 

```go
// client.go
package main

import (
	"context"
	"log"

	"github.com/progrium/qtalk-go/codec"
	"github.com/progrium/qtalk-go/fn"
	"github.com/progrium/qtalk-go/talk"
)

func main() {
	ctx := context.Background()

	// use talk.Dial to get a client
	client, err := talk.Dial("tcp", "localhost:9999", codec.JSONCodec{})
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()

	// call Upper and print the string return value
	var ret string
	_, err = client.Call(ctx, "Upper", fn.Args{"hello world"}, &ret)
	if err != nil {
		log.Fatal(err)
	}
	log.Println(ret)

	// call Error and expect err to be the returned error
	_, err = client.Call(ctx, "Error", fn.Args{"user error"}, nil)
	log.Println(err)

	// Output:
	// HELLO WORLD
	// remote: user error [/Error]
}

```

qtalk is based on over a decade of building and cataloging approaches, patterns, anti-patterns, and best practices in network programming. My interest goes all the way back to high school when I first started playing with Winsock attempting to make massively multiplayer games. Then as a young web developer, pushing the limits of HTTP, discovering how to stream real-time to the browser years before Websocket was dreamed up. Then further abusing HTTP to model other protocols like DNS and IMAP. I pioneered distributed callbacks with webhooks, which got me working at early Twilio where I started going deep on scalable, highly-available messaging architectures. This led me into distributed systems: discovery, coordination, scheduling, etc. I've seen a lot.

I originally wanted to release qtalk with a paper describing all the significant choices to consider when building a stack like this: message framing, data formats, transports, security mechanisms, protocol flows, queuing, multiplexing, batching, layering, schemas, IDLs, symmetrical vs asymmetrical, stateful vs stateless, TCP vs UDP, etc. It would be a sort of guide for building your own stack. I'd still like to write that at some point, but this post will have to suffice for now.

**qtalk makes no significant claims other than being the most bang for buck in simplicity and versatility.** I've made a full walkthrough of various ways it can be used on the [wiki](https://github.com/progrium/qtalk-go/wiki/Examples), but I'll share a taste here.

Here is the server to the client code from above for you to try. Together they show qtalk being used in the simplest case, traditional RPC:

```go
// server.go
package main

import (
	"fmt"
	"log"
	"net"
	"strings"

	"github.com/progrium/qtalk-go/codec"
	"github.com/progrium/qtalk-go/fn"
	"github.com/progrium/qtalk-go/rpc"
)

type service struct{}

func (svc *service) Upper(s string) string {
	return strings.ToUpper(s)
}

// methods can opt-in to receive the call as last argument.
// also, errors can be returned to be received as remote errors.
func (svc *service) Error(s string, c *rpc.Call) error {
	return fmt.Errorf("%s [%s]", s, c.Selector)
}

func main() {
	// create a tcp listener
	l, err := net.Listen("tcp", "localhost:9999")
	if err != nil {
		log.Fatal(err)
	}

	// setup a server using fn.HandlerFrom to
	// handle methods from the service type
	srv := &rpc.Server{
		Codec:   codec.JSONCodec{},
		Handler: fn.HandlerFrom(new(service)),
	}

	// serve until the listener closes
	srv.Serve(l)
}

```
## Features

Some basic features of qtalk-go are:
* heavily `net/http` inspired API
* pluggable format codecs
* optional reflection handlers for funcs and methods
* works over any `io.ReadWriteCloser`, including STDIO
* easily portable to other languages

The more unique features of qtalk-go I want to talk about are:
* connection multiplexing
* bidirectional calling

## Multiplexing Layer

The connection multiplexing layer is based on [qmux](https://github.com/progrium/qmux), a subset of SSH that I've [written about previously](https://dev.to/progrium/the-history-and-future-of-socket-level-multiplexing-1d5n). It was designed to optionally be swapped out with QUIC as needed. Either way, everything in qtalk happens over flow-controlled channels, which can be used like embedded TCP streams. Whatever you do with qtalk, you can also tunnel other connections and protocols on the same connection. 

RPC is just a layer on top, where each call gets its own channel. This makes request/reply correlation simple, streaming call input/output easy, and lets you hijack the call channel to do something else without interrupting other calls. You can start with an RPC call and then let it become a full-duplex bytestream pipe. Imagine a call that provisions a database and then becomes a client connection to it.

## Bidirectional Calling

Bidirectional calling allows both the client and server to make and respond to calls. Decoupling the caller and responder roles from the connection topology lets you implement patterns like the worker pattern, where a worker connects to a coordinator and responds to its calls. 

This also allows for various forms of callbacks in either direction. Not only do callbacks let you build more extensible services, but generally open up more ways for processes to talk to each other. Especially when combined with the other aspects of qtalk. 

Imagine a TCP proxy with an API letting services register a callback whenever a connection comes through, and the callback includes a tee of the client bytestream letting this external service monitor and maybe close the connection when it sees something it doesn't like.

## State Synchronization

State synchronization isn't a feature but a common pattern you can easily implement in a number of ways with qtalk. While many people think about pubsub with messaging, which you can also implement with qtalk, I've learned you usually actually want state synchronization instead. Below is a simple example.

Our server will have a list of usernames connected, which is our state. When a client connects, it calls Join to add its username to the list. This also registers the client to receive a callback passing the list of usernames whenever it changes. The client can then call Leave, or if it disconnects abruptly it will be unregistered with the next update.
```go
// server.go
package main

import (
	"context"
	"log"
	"net"
	"sync"

	"github.com/progrium/qtalk-go/codec"
	"github.com/progrium/qtalk-go/fn"
	"github.com/progrium/qtalk-go/rpc"
)

// State contains a map of usernames to callers,
// which are used as a callback client to that user
type State struct {
	users sync.Map
}

// Users gets a list of usernames from the keys of the sync.Map
func (s *State) Users() (users []string) {
	s.users.Range(func(k, v interface{}) bool {
		users = append(users, k.(string))
		return true
	})
	return
}

// Join adds a username and caller using the injected rpc.Call
// value, then broadcasts the change
func (s *State) Join(username string, c *rpc.Call) {
	s.users.Store(username, c.Caller)
	s.broadcast()
}

// Leave removes the user from the sync.Map and broadcasts
func (s *State) Leave(username string) {
	s.users.Delete(username)
	s.broadcast()
}

// broadcast uses the rpc.Caller values to perform a callback
// with the "state" selector, passing the current list of
// usernames. any callers that return an error are added to
// gone and then removed with Leave
func (s *State) broadcast() {
	users := s.Users()
	var gone []string
	s.users.Range(func(k, v interface{}) bool {
		_, err := v.(rpc.Caller).Call(context.Background(), "state", users, nil)
		if err != nil {
			log.Println(k.(string), err)
			gone = append(gone, k.(string))
		}
	})
	for _, u := range gone {
		s.Leave(u)
	}
}

func main() {
	// create a tcp listener
	l, err := net.Listen("tcp", "localhost:9999")
	if err != nil {
		log.Fatal(err)
	}

	// setup a server using fn.HandlerFrom to
	// handle methods from the state value
	srv := &rpc.Server{
		Codec:   codec.JSONCodec{},
		Handler: fn.HandlerFrom(new(State)),
	}

	// serve until the listener closes
	srv.Serve(l)
}

```
The Call pointer that handlers can receive has a reference to a Caller, which is a client to make calls back to the caller, allowing callbacks. 

Our client is straightforward. After setting up a connection and a handler to receive and display an updated username listing, we call Join with a username, wait for SIGINT, and call Leave before exiting.

```go
// client.go
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"os/signal"

	"github.com/progrium/qtalk-go/codec"
	"github.com/progrium/qtalk-go/fn"
	"github.com/progrium/qtalk-go/rpc"
	"github.com/progrium/qtalk-go/talk"
)

func fatal(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	flag.Parse()

	// establish connection to server
	client, err := talk.Dial("tcp", "localhost:9999", codec.JSONCodec{})
	fatal(err)

	// state callback handler that redraws the user list
	client.Handle("state", rpc.HandlerFunc(func(r rpc.Responder, c *rpc.Call) {
		var users interface{}
		if err := c.Receive(&users); err != nil {
			log.Println(err)
			return
		}
		// the nonsense are terminal escape codes
		// to return to the last line and clear it
		fmt.Println("\u001B[1A\u001B[K", users)
	}))

	// respond to incoming calls
	go client.Respond()

	// call Join passing a username from arguments
	_, err = client.Call(context.Background(), "Join", fn.Args{flag.Arg(0)}, nil)
	fatal(err)

	// wait until we get SIGINT
	ch := make(chan os.Signal)
	signal.Notify(ch, os.Interrupt)
	<-ch

	// call Leave before finishing
	_, err = client.Call(context.Background(), "Leave", fn.Args{flag.Arg(0)}, nil)
	fatal(err)
}

```
See the [Examples wiki page](https://github.com/progrium/qtalk-go/wiki/Examples) for more code examples, including tunnels and proxies, selector routing, and streaming responses.

## Roadmap

I'm trying to get to a 1.0 for [qtalk-go](https://github.com/progrium/qtalk-go), so I'd like more people to use and review its code. I also haven't actually gotten around to [putting in QUIC](https://github.com/progrium/qtalk-go/issues/2) as a usable base layer, which I think should be in a 1.0 release. It's in the name, qtalk was started with QUIC in mind. Not only will QUIC improve performance, resolve head of line blocking, and eventually be native to browsers, but being UDP-based means that hole punching can be used to establish peer-to-peer qtalk connections. I'd like to one day be able to use qtalk directly between machines behind NAT. 

Meanwhile, I'm wrapping up a JavaScript implementation (in TypeScript) to officially release soon. I have the start of a Python implementation I could use help with, and I'd love to have a C# implementation. 

That's it for now. A big thanks to my [sponsors](https://github.com/sponsors/progrium) for making this happen and thanks to you for reading!

---

*For more great posts like this sent directly to your inbox and to find out what all I'm up to, get on the list at [progrium.com](http://progrium.com) ✌️*