---
title: "Turning VS Code into a Product Framework"
html_title: "Turning VS Code into a <br />Product Framework"
date: "2025-06-30"
tags: devlog, tractor, apptron
comment_url: https://github.com/progrium/progrium.xyz/discussions/2
cover_image: https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fw273llqfnzo9kfrgv2k5.jpeg
---
Visual Studio Code is no longer just a developer tool. It’s now a highly malleable and embeddable product platform. Looking at it beyond a code editor, it's actually a general-purpose application shell with a familiar UI, plugin system, command framework, and cross-platform runtime. Recently it's been used as the platform for several major AI products, but more quietly it's also been used for much more, from cloud IDEs to domain-specific editors and internal dev tools.

In this series of posts, I’ll show how I’ve been turning VS Code into a reusable module; something you can embed, extend, and ship as part of your own product.

## Why VS Code as a Platform?

I never thought the developer ecosystem would embrace a single editor as much as it has VS Code. Its dominance as a general-purpose coding environment is undeniable. This popularity and familiarity is one reason to build on it, but there are other attributes that make it a solid building block:

* **Generalized Design:** It was designed not just as an editor, but as an integrated environment for various tools involved in the development workflow and beyond.
* **Highly Extensible:** Its extension API allows for deep customization, from minor modifications to total transformations, even into non-code oriented tooling.
* **MIT License:** The permissive MIT license means you can freely adapt and distribute it, provided you don't call it VS Code. The open source project is officially called "Code - OSS"

Given its intended purpose is for software development, you might think this limits it to being a framework for devtools and code adjacent domains. Really, though, you can disable and rip all of that out and still have a great shell for applications that use the same general shape of its user interface. It might not be a fit for all products, but any application built around tabbed views, user-customizable sidebars, and is advanced enough to need a command palette would be a good candidate.

Even then, having integrated code editing abilities might be more of a benefit for non-development applications than you might think. Any professional knowledge tool these days needs some level of integration and extensibility. Imagine giving power users the ability to build these in-app. An embedded VS Code could just be used for this mode of your application. Imagine a game that comes with its own modding environment. Development environments are incredibly intricate systems to build, so having the most familiar of them that you can embed in your application is a huge win.  

However, there is another argument that some kind of development environment might be worth including in your application, if not building on top of one directly.

## Embracing the Future of AI Agents

Rather obnoxiously, AI is everywhere. For the foreseeable future, we are going to be working with more and more AI. But also for the foreseeable future, **code will remain significantly cheaper to run than AI**. 

Luckily, AI is pretty good at writing code. To me, this points to an eventuality where most AI agents will be automating with code rather than direct control. This is great for a lot of reasons, which I can get into another time if people are interested. For now I just want to point out that any application or system that involves agentic AI will likely need a development environment and editor as a sort of "admin backend" for a behind-the-scenes code generating agent. 

As of right now, the leading AI co-development environment, regardless of model or coding agent technology, is VS Code. So if you're interested in building agentic AI products or involving code generating agentic AI in your product, it might be worth thinking about how you can embed an environment like VS Code in your product. 

## Maybe Avoid Forking VS Code

Let's say you're in on using the VS Code open source project in your product. Your first thought might be to fork it, essentially adopting it wholesale. After all, that's what Cursor and Windsurf did! Well here are some quick stats that might be good to know about the VS Code project:

* **Massive Codebase:** Currently it contains 1.3 million lines of TypeScript. This is comparable to the codebase of Grand Theft Auto III.
* **Extensive Dependencies:** Right now I count over 900 dependencies, which is a lot even for your average already-too-many-dependencies Node.js project.
* **Bloated Project Size:** After a full `npm install`, the project directory expands to a hefty 2.6GB. Not sure what all of that is, but almost 1 gig of that is `node_modules`.

This is what you'd be inheriting and you haven't even started your application. On a high-end machine like my M3 Max, it takes around 30 minutes just to build the frontend. It takes 50 minutes on GitHub Actions. Why? I don't know, but maybe this is partly why they're porting the TypeScript compiler to Go.

Maybe you're just one person, like me, and this already seems overwhelming. Even for a small team, such a large and complex codebase and all those dependencies is rather prohibitive. Or maybe your team isn't interested in working with TypeScript, let alone 1.3 million lines of it. Or maybe, like me, you'd like to avoid Node.js and all those dependencies like the plague. 

So is it already game over or is there an alternative approach? Well, since I'm also on this path as one developer with just a handful of GitHub sponsors funding this work, I had to find one. Because building an alternative to VS Code from scratch is also not an option for me.

## Towards Another Approach

Thanks to VS Code's extensibility, there's a good chance the majority of what we'd want to change or add, we could do through extensions. This means changes to the codebase could at least be minimized to a few patches, making a full fork potentially unnecessary. We'd still need a build of VS Code we can configure and ideally embed in our application. It turns out there is a little known official option for this, but I'll have to explain some background on how it works.

VS Code is an [Electron](https://www.electronjs.org/) app, which means it's mostly a web frontend that runs inside a webview in a native window. That's essentially a browser window without the chrome that just runs VS Code. What can't run in the webview is run in Node.js outside the webview. Electron provides a framework for this with cross-platform APIs to common native functionality like webview windows, menus, etc. The webview frontend talks to the Node.js backend via RPC and that's generally how most Electron apps work.

For VS Code, what runs outside the webview are subsystems for filesystem and shell access, the ability to run subprocesses for language servers, and extensions themselves that are typically run in a separate Node.js process. This will come up later.

Despite being made to allow an app to be built with web technologies, most Electron apps become quite coupled to Electron and Node.js. When people started building cloud IDEs where Electron didn't make sense and you could just view the frontend in your browser, they couldn't use VS Code because of this coupling. Eventually, thanks to projects like [openvscode-server](https://github.com/gitpod-io/openvscode-server), which patched VS Code to run as a normal web app in a Docker container, VS Code took many of these changes upstream and began to decouple VS Code from Electron.

## VS Code for the Web

This decoupling led to [VS Code for the Web](https://code.visualstudio.com/docs/setup/vscode-web), a build target of VS Code that can run almost entirely in a webview or browser without the Node.js backend. Where openvscode-server decoupled it from Electron, VS Code for the Web even decoupled it from its own Node.js backend. In other words, it's a build of the VS Code editor that's just static files you can serve with any HTTP server.

When compressed into a zip file, **the result is an 18MB artifact that could be deployed or embedded anywhere**. In fact, there is a public deployment of VS Code for the Web at [vscode.dev](https://vscode.dev/), and even a semi-secret version deployed for GitHub. While logged in to GitHub, if you hit period (.) while on any repository, you're taken to that repository opened in an instance of VS Code for the Web. This is different from a GitHub Codespace, which runs a full backend and development environment in the cloud, similar to what you can do with openvscode-server. The reason it's different gets at the core limitations of VS Code for the Web:

* No shell or direct filesystem access
* No extensions that use Node.js APIs

It might be obvious but they both have to do with not having the Node.js backend. One of the major changes they made to support this build target was to make an extension host that runs in-browser using web workers, so extensions can only do what can be done in a browser web worker. Luckily, most of the core extensions have been ported to work in web workers. 

Unfortunately, most third-party extensions are likely to use at least one Node.js module or NPM package. This hurts most for language extensions that typically use Node.js to run an LSP server subprocess. So if you need to support specific third-party extensions, you'll have to fork them and find a way to make them work. Better than forking all of VS Code?

The lack of shell and filesystem are pretty easy to fix because both can be provided by extensions. We can just have a kind of "system extension" that gets a filesystem and shell over WebSocket.

## Embed and Extend

With VS Code for the Web we get an 18MB editor "module" in a single file that we can embed in our apps and then extend with extensions. While it comes with some limitations, I believe it opens up even more possibilities. We could:

* serve it from any CDN or static host for the cloud. 
* use it on the desktop through any webview wrapper like Electron, Tauri, etc. 
* serve it in an application of any language to access via the browser.

It becomes trivial enough to embed as a built-in editor for whatever application you're building. And it's extensible and malleable enough to become any number of different non-code editors, like a DAW for audio, or a CAD tool, or a game engine editor.

In the following posts for this series, we'll build a cross-platform desktop code editor in Go using this approach. Effectively a clone of VS Code that you can use as a foundation for your own application, without all the baggage of building directly on a fork of the VS Code project.
