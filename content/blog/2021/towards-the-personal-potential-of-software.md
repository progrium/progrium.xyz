---
title: Towards the Personal Potential of Software
layout: blog
date: "2021-07-05"
description: A midyear review and preview of what's coming.
tags: programming, devlog, software
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wk9bobom7c9nvlao8fqn.jpeg
---

Since starting work under [Progrium Technology Company](http://progrium.com), I've had a single objective: to build a system called Tractor. It's what I've been slowly approaching in my dense 22 year career as an independent programmer. The Tractor System is still hard for me to describe at this stage, but its goal is to make building production-grade personal software systems like building with Legos: fast and fun.

After a difficult year heads-down in 2020, I started posting here in January with the intention of sharing and officially releasing components I've been working on that are building up to Tractor. Besides warming up for when I'd eventually talk about Tractor, I wanted people to see how I make independently useful building blocks towards an ideal. That's a core part of the Tractor philosophy.

Let's review what I've shared so far, and then set up what's coming in the next 6 months.

![MacDriver](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k38vrxqkzvmr9ek72l3i.gif)

The first big release of the year was the [macdriver](https://github.com/progrium/macdriver) project, which got a significant response on Hacker News. It gives us Objective-C and Apple framework bindings for Go, letting you build simple Apple apps entirely from Go. That wasn't possible before, so it was a little exciting, but it was early. The native Go APIs included for commonly used Foundation and Cocoa classes were far from complete. They could still be used if you knew what you were doing, but with an ideal of total coverage of Apple frameworks, that wouldn't be enough. There were also unresolved issues just deciding how to best manage memory and pointers, which I knew would fall on me to figure out and take some time.

Luckily I've since gotten a colleague involved in the company, and he's been helping push [macdriver](https://github.com/progrium/macdriver) towards a real beta. Part of this was made possible by a project I spun out of macdriver and [posted about](https://dev.to/progrium/apple-api-schemas-for-code-generation-and-more-1phj), though again in a very early state. That project was [macschema](https://github.com/progrium/macschema).

With the [macschema](https://github.com/progrium/macschema) toolchain, you can generate API schemas about any Apple framework, class, function, etc based on their documentation and header declarations. This is useful for us in generating framework bindings in macdriver, but it would be useful for any project doing similar work, such as bindings for other languages. This sort of approach will play a big part in how Tractor will integrate with "whatever we want" down the line. 

![topframe](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/plpudhz4v7dponsucy91.gif)

Along the way, I released a few demos for macdriver to make clear the possibilities and provide reference examples. One of them I spun off into a standalone project called [topframe](https://github.com/progrium/topframe), which is also serving as a test bed for how we are doing cross-platform support. More on that in a moment.

![Multiplexing](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c2xo2fuvpkt30kfsrprr.jpeg)

Unrelated to macdriver, I released a protocol called [qmux](https://github.com/progrium/qmux) with [a post](https://dev.to/progrium/the-history-and-future-of-socket-level-multiplexing-1d5n) explaining why this (but really any) muxing protocol, including and especially QUIC, is such a great primitive for network programming. The project came with two implementations, Go and TypeScript, with more on the way. The post about it was the first explainer article I'd done in a while and people liked it. This was important because the idea behind it was really more valuable than the protocol itself, but regardless we still need implementations of it to exist. To show the idea in action, I built a [130 line version of Ngrok](https://github.com/progrium/qmux/tree/main/demos/groktunnel), which turned into [a great post](https://dev.to/progrium/building-your-own-ngrok-in-130-lines-2lif) walking through how it works. 

That brings us to today, half way through 2021. Let's talk about what's coming.

More exciting than qmux is what we built on top of it, which is called *qtalk*. This is my meticulously designed, re-written-several-times network/IPC programming stack. While not *that* different from just JSON-RPC with pluggable codecs, its two unique features are callbacks and streams. Callbacks means its bi-directional, either side can expose or call methods. Just that alone is something rare in existing RPC stacks, but necessary for callbacks. And while streaming RPC is not new, our streams are full virtual connections, so you can stream more RPC results, arbitrary byte streams, or tunnel something else like a database connection. I'll share more about the possibilities when it's released.

So in the second half of 2021, we'll see qtalk, we'll see a major update to macdriver, and then with those two parts we can release *shelldriver*. This is a cross platform API to platform specific resources like windows, dialogs, menus, etc. It's about native GUI shell integration, it's not about having every native UI component. In fact, for app UI it really focuses on windows and webviews, a la Electron. Unlike Electron, it can be used from any language that has a qmux and qtalk implementation. The result should be a simple "Electron but as a library" that you can use from Go and other languages.

![shelldriver](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y7qq2kea7hvdk83ughuk.png)

Once shelldriver is out I will be able to finally start talking about the first *real* piece of the Tractor system: Tractor Toolkit. I hope to have at least a public demo by the end of the year. The Toolkit is already being shown to friends and sponsors. The work I've shared so far is just the tip of the iceberg.

Which reminds me ...

I really, really have to thank my [sponsors](https://github.com/sponsors/progrium). As things are ramping up, I'm starting to work with more people and this is all self funded. Not only does sponsorship support all this open source work, but sponsors get early access to Tractor Toolkit *and* see more of what I'm up to.

Also to you, thanks for reading and following along. I'll be back soon with more releases.

*For more posts like this sent directly to your inbox and to stay on top of what I'm up to, get on the list at [progrium.com](http://progrium.com) ✌️*
