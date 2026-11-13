//go:build v0

package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.FileServer(http.Dir(wd)).ServeHTTP(w, r)
	}))

	fmt.Println("serving v0 on http://localhost:8088 ...")
	if err := http.ListenAndServe(":8088", nil); err != nil {
		log.Fatal(err)
	}
}
