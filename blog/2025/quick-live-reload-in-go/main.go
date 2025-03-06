//go:build final

package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
)

func main() {
	wd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rec := httptest.NewRecorder()

		http.FileServer(http.Dir(wd)).ServeHTTP(rec, r)

		w.WriteHeader(rec.Result().StatusCode)
		for key := range rec.Header() {
			w.Header().Add(key, rec.Header().Get(key))
		}

		//bytes.ToLower(rec.Body)

		htmlContent := rec.Body.String()
		headEndIndex := strings.Index(strings.ToLower(htmlContent), "</body>")
		if headEndIndex == -1 {
			w.Write([]byte(htmlContent))
			return
		}
		part1 := htmlContent[:headEndIndex]
		part2 := htmlContent[headEndIndex:]
		w.Write([]byte(part1))
		w.Write([]byte(`<script>(new WebSocket("/.live-reload")).onclose = () => window.location.reload();</script>`))
		w.Write([]byte(part2))

		w.Write(rec.Body.Bytes())
	}))

	fmt.Println("serving on http://localhost:8088 ...")
	if err := http.ListenAndServe(":8088", nil); err != nil {
		log.Fatal(err)
	}
}
