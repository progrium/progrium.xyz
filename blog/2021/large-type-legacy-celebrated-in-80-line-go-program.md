---
title: Large Type legacy celebrated in 80 line Go program
layout: blog.njk
date: "2021-01-15"
description: A tiny, standalone largetype command-line utility
tags: go, showdev, productivity, programming,
cover_image: https://camo.githubusercontent.com/707db8e6d47c31ed90f0a65aeea1b805c718b1c18a2cd61b94e1ebb932b091af/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4571616f4f324d584941454a4e4b323f666f726d61743d6a7067266e616d653d6c61726765
---

There is a little known feature in the MacOS Contacts app where if you right-click a phone number, you get a Large Type option. Large Type fills your screen with the phone number in the largest font size possible, allowing you or anybody else to easily see the number from far away. Nifty!

![Old OS X Large Type](https://dev-to-uploads.s3.amazonaws.com/i/f33yege5cr9zjdl9wgnj.jpg)

As far as I know, this feature has been in every version of OS X since its release back in 2000. Contacts was known as Address Book back then. The builtin calculator also had a Large Type view, but it seems it has since been removed. The feature might even exist in NeXTSTEP apps. 

Presumably inspired by OS X Address Book, Large Type was also added to the legendary [Quicksilver](https://qsapp.com/) app launcher from the mid-2000's. Now, using Quicksilver, you could quickly type or paste in *any* text and display it in Large Type. More nifty!

![Quicksilver Large Type](https://dev-to-uploads.s3.amazonaws.com/i/rquufwhmpocuca5ljk6a.png)

Since I was involved in the SHDH hacker parties, this feature got a lot of use as a way to share a piece of information across a noisy, crowded room. Many users of Quicksilver also had a shell script that would run AppleScript to get Quicksilver to display text from the command line. Now it could be scripted! 

It became the most memorable feature of my Quicksilver experience.

Large Type has the same sort of charm as the `say` command. It's nifty, maybe unnecessary, but really simple, there when you need it, and is kind of just a cool thing to play around with and show off. 

The feature almost died with Quicksilver. Unsurprisingly, the modern Quicksilver equivalent, Alfred, also has Large Type. Except. I don't really want Alfred or Quicksilver installed just for Large Type now. It would be nice to have a standalone utility!

Thanks to a project I'm sharing in a couple weeks, I basically achieved perfection for such a utility. A standalone `largetype` command, in a single native code binary smaller than 4MB. And in under 80 lines of Go code:

![largetype screenshot](https://camo.githubusercontent.com/707db8e6d47c31ed90f0a65aeea1b805c718b1c18a2cd61b94e1ebb932b091af/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4571616f4f324d584941454a4e4b323f666f726d61743d6a7067266e616d653d6c61726765)

{% gist https://gist.github.com/progrium/cb967815b3ed21a77e65a4ad9b1dbdf6 file=largetype.go %}


### Building
*Note: For now, Apple Silicon users need to be [set up for x86 mode](https://gist.github.com/progrium/b286cd8c82ce0825b2eb3b0b3a0720a0)*

First, [download Go](https://golang.org/dl/) or `brew install go`. Then, put `largetype.go` in a directory called `largetype` and from there run:
```
$ go mod init largetype
$ go build
```
This will make you a 4MB binary called `largetype`. Now you can run it:
```
$ ./largetype "Hello world"
```