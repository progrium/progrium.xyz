---
title: Use Mac APIs and build Mac apps with Go
layout: blog.njk
date: "2021-02-02"
description: An Objective-C bridge for Go with bindings to common Mac APIs
tags: go, showdev, productivity, mac
cover_image: https://dev-to-uploads.s3.amazonaws.com/i/taz8oozj2j3ab9ujso2g.png
---

If you work with Apple devices and you're a Go programmer, or are thinking about learning Go, we just got some new powers that are pretty cool. Today I'm releasing an alpha of [macdriver](https://github.com/progrium/macdriver), an Objective-C bridge for Go with bindings to common Mac APIs.

[![macdriver logo](https://github.com/progrium/macdriver/raw/main/macdriver.gif)](https://github.com/progrium/macdriver)

Those that were paying attention to my last post about [Large Type in 80 lines of Go](https://dev.to/progrium/large-type-legacy-celebrated-in-80-line-go-program-1mob) might have already found macdriver. The largetype program is one of the example projects for macdriver.

![largetype screenshot](https://camo.githubusercontent.com/707db8e6d47c31ed90f0a65aeea1b805c718b1c18a2cd61b94e1ebb932b091af/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4571616f4f324d584941454a4e4b323f666f726d61743d6a7067266e616d653d6c61726765)

Another example in the macdriver repo is this little menu bar extra (aka systray or status icon) that gives you a Pomodoro timer. This little program is *also* [less than 80 lines of Go](https://github.com/progrium/macdriver/blob/main/examples/pomodoro/main.go) using macdriver.

![pomodoro screenshot](https://github.com/progrium/macdriver/raw/main/examples/pomodoro/pomodoro.gif?raw=true)

Lastly, if you've been playing with the Go 1.16 beta, or can wait for its imminent release, there is also an example that gives you a full screen webview with a transparent background, letting you draw overlays and such on your screen using web tech. Twitch streamers might be into that one. Pretty cool, yea?

## Years in the making

The motivation for macdriver was just making applications in Go that use Mac system APIs like Cocoa for making GUI apps. That said, most of my work now uses web tech for user interfaces, a la Electron.  

Last year I started an alternative Electron stack in Go using the [webview](https://github.com/webview/webview) project, which uses your platform's native browser engine and makes a window with a webview. While absolutely simple and cross platform, the project has not been prioritizing any platform specific functionality. 

On top of this, if you want to also make a little menu applet like the Pomodoro timer in the same program (not... uncommon), you can find another standalone cross platform Go library for systray stuff, but these one-off libraries often suffer from being incomplete APIs. More importantly they are not composable! You can't use the systray library with the webview library because they both presume to own the main Cocoa thread. 

So as usual, I was frustrated there wasn't a broader thought out, more general solution. What do I do if I wanted to use some other Mac API? Wait for another incomplete, non-composable project? No, we build our own future here. 

I've actually been working on this (and so many other things) for a few years. I even found an [Objective-C bridge for Go](https://github.com/mkrautz/objc) by a Danish fellow named Mikkel from *2013*, except... it didn't work.

This whole thing *should* be straightforward. The [Objective-C runtime](https://developer.apple.com/documentation/objectivec/objective-c_runtime) is actually a C library called libobjc. So in theory you should be able to use cgo to call libobjc and work with Objective-C objects from Go like any other C library. 

Unfortunately, the method calling functions in libobjc, to be generic to any method call, are variadic (takes arbitrary number of arguments). Cgo doesn't support variadic function calls! So Mikkel did an [assembly hack](https://github.com/mkrautz/variadic) to make nearly any variadic C function callable. Amazing! But since 2013, changes to the Go runtime broke this and he had long since moved on to other projects. 

With some determination I got the variadic hack working again. I even forgot I posted about this [on dev.to in 2018](https://dev.to/progrium/start-of-an-objective-c-bridge-in-go-ep9). There were still more things to figure out, but I shelved it until early last year when I needed to solve this webview and systray composability problem. I brought in the abandoned objc bridge package, the variadic package I fixed, and started making native Go wrappers for some of the more common Mac APIs. The result was macdriver!

## Benefits

Now you can make fast, machine native binaries in Go that do Mac things. And I don't just mean make MacOS apps. There are a lot of APIs that just open up new possibilities. For example, I'm excited to use the Core ML APIs for working with the Neural Engine on the new M1 devices. 

Another benefit is just being able to quickly make Mac apps using the Go build toolchain. No more Xcode! Just `go build`. 

## What Next

I'm excited to see what people do with macdriver. There's lots more information on using it in [the README](https://github.com/progrium/macdriver), but I am still working on docs. At this point it should mostly be self explanatory, but feel free to ask questions in [the forum](https://github.com/progrium/macdriver/discussions). 

If you're interested in exploring new possibilities with me, I've been meaning to try using macdriver for an Apple Watch app. There was an iOS proof of concept in the original bridge package by Mikkel, but I haven't tried it. Assuming it works (which may involve Xcode or other developer tools), it seems plausible it would also work for the Apple Watch or even... the Apple TV. 

Thanks for reading, have fun, and [consider sponsoring my work](https://github.com/sponsors/progrium)!