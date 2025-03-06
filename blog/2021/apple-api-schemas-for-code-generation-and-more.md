---
title: Apple API schemas for code generation and more
date: "2021-04-16"
description: Why I love API schemas and built a tool to generate schemas from Apple documentation.
tags: programming, showdev, go
cover_image: https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0328ykp728ydnutra7r6.png
---

Schemas are pretty dope. My appreciation for API schemas as a toolmaker comes from a desire to build tools that can integrate with many systems, and open new avenues for people to use APIs.

For most, the use case that comes to mind for API schemas is generating documentation. Translating a machine-readable schema into a human friendly representation is a scalable, automated way to maintain solid reference documentation. Although many systems exist to generate documentation directly from code, having an intermediary representation is useful for other use cases.

Code generation is the other big one. It's common for companies like Google and Amazon to generate client libraries across languages for their many web APIs. Even some libraries for GitHub's API are generated because their API has gotten so big it would be untenable otherwise. This is particularly important in the open source community where maintainer time is a scarce resource. Schemas save a lot of time, but it's still pretty uncommon to find a schema for any given web API.

Even less common are schemas for non-web APIs. In 2016, [Electron started releasing a JSON schema](https://www.electronjs.org/blog/api-docs-json-schema) of all their APIs that allowed me to build a bridge to use Electron APIs from Go. I had that prototype in mind when I started the [macdriver](https://github.com/progrium/macdriver) project that was released a couple months ago. Right now we're manually wrapping Apple framework classes with Go types so you can write native Apple platform applications that look like this:

![macdriver example](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5qspum8s6zvhbnzvw3le.png)

These kinds of bindings used to be more supported by Apple as evidenced by bridgesupport files, which were XML schemas of their APIs. However, they aren't very well supported any longer. Moreover, bridgesupport files were more like headers and didn't provide much in the form of documentation. 

So if we wanted to generate the APIs in macdriver, we could parse Objective-C headers, or maybe try to use what's available in bridgesupport files. But we'd also like to generate human readable descriptions and ideally link to official docs. 

**If schemas are used to generate documentation, there's no reason you can't generate schemas from documentation.**

So I built a tool that could parse Apple documentation into schemas. Since their docs also have the declarations for everything, we don't even need to use header files. The result is a nice JSON document describing their classes and other entities like this:

![macschema output](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0328ykp728ydnutra7r6.png)

From this we can start to automate the generation of wrapper types in macdriver, but as a standalone toolchain, the schemas it produces can be used to write bindings in languages other than Go as well. 

Schemas like this can also be used in developer tooling for all sorts of things like autocompletion, or help create visual programming interfaces. 

Today most "no-code" tools need to support integrations to stay competitive, but they're all writing and maintaining their own integrations. In fact, every application with user programmable integrations can benefit from schemas like this. So I'd like to see more.

If this is interesting, take a look at the tool I built, [macschema](https://github.com/progrium/macschema), which is open source on GitHub. Right now it's just the toolchain, but in theory we could generate schemas for all of Apple's APIs and put them in a repo in such a way that can be updated by a combination of macschema and user contributed patches. I'll let somebody else do that though. 

Thanks for reading, think about schemas more, and consider [sponsoring my work](https://github.com/sponsors/progrium)!
