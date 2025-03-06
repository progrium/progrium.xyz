---
title: Customize your computer screen with HTML and JavaScript
date: "2021-03-30"
description: A local webpage screen overlay for customizing your computing experience
tags: webdev, showdev, go, mac
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jeiicqa55tq1g0nxat0o.png
---
Anybody that knows how to mess around with HTML can now mess around with their desktop computing experience. [Topframe](https://github.com/progrium/topframe) is an open source tool that lets you customize your desktop screen using HTML/CSS/JavaScript. 

It started as a demo for [macdriver](https://github.com/progrium/macdriver), but over the last week or so I've been making a standalone version. 90% of that time was playing around with it while trying to make demos.

![Topframe Demo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hbmx3sbht0l74w74ofud.gif)

Could this bring back the computing aesthetic of personalized MySpace pages and Geocities sites all over again? No?? ...maybe? Well, either way, I'm happy to share a tool for people to *experiment* once again. 

**Topframe is a fullscreen overlay that displays a special webpage served from your home directory.** Editing the page source and hitting save will magically update your screen with nearly anything you can do in the browser. 

![Topframe Hello World](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v9pygiayoxsv3ci59bvk.gif)

Yes, it has [Tailwind](https://tailwindcss.com/) built-in, as well as trusty old [jQuery](https://jquery.com/). However, you can drop anything you want in the topframe directory to use. Or hotlink, why not? This isn't WEBSCALE, it's just on your computer. Your *personal* computer. 

## Getting Started with Topframe

Topframe is still very early. The whole project is less than [400 lines](https://github.com/progrium/topframe/blob/main/topframe.go) of Go. You'll also need a Mac, but it'll be cross-platform by 1.0.

Refer to the [README](https://github.com/progrium/topframe#getting-started) for more details, but installing with [Homebrew](https://brew.sh/) is as easy as:
```
$ brew install progrium/taps/topframe
```
Then you can just run `topframe` and it'll run the overlay webpage with some crazy demo content. SOrry. The important thing to notice is the new menu bar icon 🔲 and menu:

![Topframe Menu](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kxed8nj4ktfynaff35mv.png)

This is where you actually control Topframe, but there's not much to it. You can enable/disable (hide), make it interactive (by default mouse events just pass through), and quickly get to the source directory. 

Clicking Show Source and opening the `index.html` file with your favorite editor, you can just wipe out all that garbage I put on your screen. HOWEVER, you can also look through it and see what you can find before blowing it away. There might be some cool ideas or features tucked away in there.

## What could this be used for?

As the demo attempts to communicate, there is a LOT you can do with Topframe. For those streaming on Twitch ([like me](https://www.twitch.tv/progrium)), you can use this as an alternative to doing overlays in OBS. Or, with some resourcefulness, you could make skins for all your windows. If anybody remembers the OS X Dashboard that they removed, you could make your own (better) version of that.

![OS X Dashboard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jvv2dlnt0jugia6whsli.png)

Or you could make some kind of screen Tamagotchi like Dogz from the 90s:

![Dogz on Windows 3.1](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jj0wr32fwo4ob857qe8a.jpeg)

The only real limit is ... [yourself](https://www.zombo.com/).

## What Next

Again, this is an early project, but it's also a mostly contributor-driven project. I'm going to keep focusing on tools to make stuff *like* this (including what'll make it cross-platform), so it'll be up to you all to really make this a real thing. For example, it could probably really use a global keyboard shortcut to toggle hiding or interactivity.

If you have questions, I'm watching the [GitHub discussions](https://github.com/progrium/topframe/discussions) so feel free to post there. Otherwise, have fun and consider [sponsoring my work](https://github.com/sponsors/progrium)!

