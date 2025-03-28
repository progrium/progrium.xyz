---
title: "State of Tractor 2025"
date: "2025-04-01"
tags: devlog
---

Hey everybody, welcome to 2025! Belated as it may be. For the past 5 years I've
been heads down on an epic journey to find new and better (read: simpler) ways
to build software. Three years ago I posted a [kind of thesis video][1] for this
work and gave the journey a name: Tractor. Today I want to share a progress report.

Tractor is not a single project, but a growing toolkit and developing philosophy
around building software. However, documenting the specifics of this has not been
an immediate priority. The vision is so big and abstract that just writing about it, 
especially so early, seemed less efficient (and less fun) than just building.
Plus, for me it feels impossible to talk about new ideas without being able to
reference tangible examples and let people process them interactively.

This year seems to be a turning point. I have enough building blocks that they
are starting to come together in interesting ways. I've also collected a bunch of
bite sized developer tips along the way. For these reasons, I've decided to start
posting publicly more. Hold me to it! 

## Process and Aims

Like all of my work, I'm driven by an interactive process of idealized design, 
speculative primitive disaggregation, and bottom-up exploration. There is an
evolving vision of how making software could be, which is reified into an imaginary
toolset and paradigm. This is then broken down into the fewest primitives needed
to build that toolset and paradigm. Each primitive is imagined and validated against
two criteria: how easily it enables the vision, and how many *other* possibilities
it enables.

Put succinctly: I'm collecting and building powerful software primitives and 
design patterns that will enable the future of software and computing. 

If people don't do this, nothing changes. In fact, by default, things get worse.
In this case, the "future" is a stand-in for "something better", which I understand
is quite relative and is a good reason I should write some kind of manifesto. In
the meantime, here are a few ideas I'm aiming for:

* Minimize the number of steps to get to *any* software from 0
* Remain polyglot, the answer is not one langugage
* Align with emerging technologies that matter (ie CRDTs not blockchain)
* Be a platform for many visions, the answer is not one vision
* Close gap between builder and user of software with live malleability
* Explore malleability through virtualization of development tools
* Bridge worlds and simplify, the answer is not one perspective/paradigm
* Start with plumbing, build bottom-up (after idealizing top-down)

This is a long journey, but it should pay dividends for everyone.

## 2024 in Review

Last year we got a lot done. We had some important releases, solved some hard
problems, and started the process of getting feedback from peers on key technologies
now that they've been baking a few years. 

### Wanix

Wanix started around October 2023 as a standalone experiment that would be 
[fun to talk about][2]. The experiment showed promise, so I collaborated with a 
friend to explore further. About this time last year, we put out a [0.2 release][3]
and got to [show it off at WASM I/O][4].

Wanix started as an homage to early Unix, seeing what fewest elements are needed
to build a general purpose computing environment capable of self-hosting its own
development. Except this time, starting in the browser and building around
WebAssembly. 

By the 0.2 release, Wanix was a good demo, but not terribly useful. It was also
somewhat impractical being a 60MB asset for the web, and not easy to get running
locally for development. However, a few things I think it validated:

* WebAssembly is exciting, but still quite early
* A CRDT-based multiuser filesystem is compelling, even if "slow"
* It's a lot of work recreating a Unixy userland

I also came away convinced Plan 9 was onto something, but disappointed this
iteration of Wanix wasn't able to capture that magic. I was also a bit bummed
I wasn't able to get VSCode to run in Wanix, as it would have greatly improved
the UX of using Wanix as a development environment.

### DarwinKit

DarwinKit is an ambitious yet boring project to make Apple APIs usable in Go.
After deciding Electron was not going to be the answer in Tractor for cross-platform
webview apps, I started a cross-platform library in Go focusing more on the 
desktop APIs exposed by Electron. This meant working with Apple APIs, and at the
time there were no Go bindings.

The desktop API library only needed a few basic Apple APIs, but the challenge of making 
high-quality, idiomatic bindings for *every* Apple API (one of the largest API 
surface areas, rouhgly 1/4 the size of AWS) was compelling. It would have to be automated.
If we could do it for Apple, we could do it for any API, which would come in handy
in the future. 

Back in 2023, I re-wrote the whole system, getting us an order of magnitude more coverage,
from maybe 150 symbols represented to over 30k symbols. Still far from total
coverage, but enough that it seemed possible someday. Not only was this a rewrite,
but a rename, so it was initially released as a preview to give time for people to
prepare for a new repository name and backwards incompatible API.

In July 2024, we finally released [DarwinKit 0.5][5]. 
Other than Wanix, DarwinKit has been the only project since 2020
to find a regular trickle of organic discovery. This is somewhat annoying because
it's also at the bottom of one of the deepest Tractor yak shaves and does not
contribute much to the development of the system. Though I have found it useful in
developing techniques to generate these kinds of bindings, which I [documented in 
this talk][6]. 

### Manifold

Manifold is one of the key technologies of the Tractor system, providing a sort
of universal structure to assemble software systems on. As such, it's been allowed
the most time to cook. It's been re-written at least 5 times by now and I went 
into it knowing that would probably be necessary.

Last October it was finally demonstrated publicly at [SPLASH][7] 
(previously known as OOPSLA). Unfortunately, trying to pack so much into a 20
minute talk probably left most people confused. I did get kudos from a 
Smalltalker for making Go more like Smalltalk. 

It was a one-day workshop packed with dense talks and demos. By my slot my brain
was nearly fried, so it was also not one of my best performances. The win, though,
was just getting it out there, and I've been able to have some good conversations
about it since. 

### New Apptron

If Apptron is a familiar name, be prepared to unlearn what it is. Going back to the
Electron-inspired desktop API, it was originally packaged up as a standalone primitive
that could be used a bunch of ways, from any language, and could even be used in
shell scripts. It originally had a name as boring as the technology was, Hostbridge,
but that name turned out to be trademarked. Brainstorming led to Apptron, which was
less descriptive, but definitely more cool, and even sounded like Electron.

With all these projects, I'm not one to push something more than there is signal for 
it. The response to Apptron was lackluster. Maybe because it was sponsor-walled,
or maybe because people had an Electron API at home, but it doesn't matter that
much. I made a great component for Tractor and I knew these early foundational
projects would be hard sells, even just for attention. 

Eventually the code for what was once called Apptron was rolled into a package 
simply called "desktop", freeing up Apptron to be used for something more
deserving of a cool name.

After the Wanix 0.2 release, I went hard on "VSCode in the browser." After 9 
months off and on, I finally had VSCode running in the browser with a full Linux
development environment that was actually usable. I'm not sure how many people
have achieved this. I might be one of the first. Yes, cloud IDEs are a thing, but 
they run the Linux environment, usually Docker, in the cloud. They usually even run
the VSCode backend in the cloud. 

I started to envision a possible product. Not quite "Tractor Studio" but definitely
something resembling it that could iterate towards it. I'll save specifics for later
but we started using the name Apptron for this. In fact, there is a "tech demo"
version online today at [apptron.dev][8]. Check it out!

There's a pretty good story about this side quest that involves some of
these other projects in the next section. Hopefully I'll get to sharing it soon.

### Other projects

Most of these aren't documented yet and will probably come up in future posts, but 
here are some other project repositories and some forks that went up last year:

* [https://github.com/progrium/env86](https://github.com/progrium/env86)
* [https://github.com/progrium/httpfs](https://github.com/progrium/httpfs)
* [https://github.com/progrium/vscode-web](https://github.com/progrium/vscode-web)
* [https://github.com/progrium/go-vscode](https://github.com/progrium/go-vscode)
* [https://github.com/progrium/go-netstack](https://github.com/progrium/go-netstack)
* [https://github.com/progrium/sys-wasm](https://github.com/progrium/sys-wasm)

## 2025 in Preview

This year I plan to write more and share more publicly here on my blog. This
could even include some kind of manifesto or at least an updated thesis. However,
what I have most in my writing queue are just quick helpful bits. Patterns and
conventions I use in my projects. Simple DIY alternatives to using complex tools.
Shorter, more useful posts. 

I'm also trying to be more social. More importantly, I'm trying to get back into
community building. I have my eye on doing in-person events again, but for now
I'm warming up with online events in the Discord or on Twitch. And if you have
any favorite conferences or in-person meetups, coworking groups, or anything like
that, please let me know! I'm mostly back in the SF bay area these days.

In terms of Tractor projects, there are a few important releases coming up. After
that my forward energy will probably go into the new Apptron. However, I'm very 
open to collaborations, especially projects relevant to my roadmap. As an example:

### Taragen

Besides Wanix, over the last few months I've been working with a friend on a
Revolutionary, Extraordinary ... static site generator. No really. Actually,
I'm pretty thrilled about it. It's minimalistic, but extremely capable. It's 
written in Go but uses JSX for templates. I've already ported my website to it.

In fact, planning to blog more is what motivated me to finish it up. I'm that
unsatisfied with existing options. Finally, though! Something I'm making that
will finally be relevant to you. You have a static site, right?

### Wanix

This is pretty big to me. Since the beginning of the year, we've been re-building
Wanix up from scratch. This time, focusing on the Plan 9 architecture, making it
more production ready, and all kinds of exciting things. 

We've made a kind of stream series about it all called [Wanix From Scratch][9]. Every
week we'd do 1 or 2 Twitch streams about 2 hours long. Usually the first hour
going over everything that happened since the last one. Then the second hour we
try to get some work done. There will be 20 days or 20 videos after the final 
DEMO DAY happening live on Twitch [this Wednesday the 2nd at 11am pacific][10]!

Then after that a preview release will be up. Loads to talk about, but I'll save
it for later. I'm very excited, even though it's still just plumbing and most 
people won't see obvious use cases for it, I think something special is going on.

## How to Help

You made it this far. Now you want to, what, stay informed? Join the community?
Spread the word? First, thanks for reading. Second, any kind of participation would 
be huge. 

More posts are coming, so get subscribed here if you want. As I mentioned, we're
doing more events and coworking in the Discord, so feel free to join us there too.

You can also participate on GitHub with any of the fine projects mentioned. Finally,
thanks to my [GitHub Sponsors](https://github.com/sponsors/progrium) as usual, 
and a big thanks to my friends that have been helping out more recently. 



[1]: https://www.youtube.com/watch?v=yKZ15O7zeHY
[2]: https://www.youtube.com/watch?v=KJcd9IckJj8
[3]: https://github.com/tractordev/wanix/releases/tag/v0.2
[4]: https://www.youtube.com/watch?v=cj8FvNM14T4
[5]: https://github.com/progrium/darwinkit/releases/tag/v0.5.0
[6]: https://www.youtube.com/watch?v=wBzHOTOf0wU
[7]: https://2025.splashcon.org/
[8]: https://apptron.dev/
[9]: https://www.youtube.com/playlist?list=PLw1XoTpvjktiMPzIMPawJpJCUr4MCpsU2
[10]: https://www.twitch.tv/progrium/schedule?segmentID=121a6dcb-78a1-4030-a41c-33b3c939c09d