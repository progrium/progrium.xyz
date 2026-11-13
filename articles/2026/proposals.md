---
title: "Proposals, Not Milestones"
date: "2026-11-04"
tags: [ai]
---

I've started a new primitive called [hyper9](https://github.com/progrium/hyper9), initially as an experiment to see how far I could push working with coding agents. It's ambitious and exciting, and right now it's in a pretty good place. Though, maybe halfway to a real v0.1 release. Getting to this point with it forced me to finally solve a problem I've had with projects like this for a long time.

For day-to-day work we have todos, milestones, and sprints, and those work fine when we're actively in that mode. But my open source projects with larger arcs, and ideas that need a lot of thought before I can build them (let alone anybody else), have always been missing something. It turns out I already knew what it was: a written proposal process, sometimes called [ADRs](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html). They've been very effective working with coding agents, but also, having coding agents has finally made the process practical for me.

## The usual loop

Working with coding agents, I've settled into a plan-then-implement rhythm. I'll write a rough sketch prompt, then have the LLM turn it into a PLAN that's sort of like a spec. I review it, modify it, and then tell the agent to implement it.

From there it usually drifts out of sync, because there's no formal process. Sometimes when things are roughly done, I'll have the agent convert the PLAN into an updated DESIGN or SPEC that lives with the code, so there's some kind of design documentation and history. Other times I don't even keep the PLAN around. I just make commits and iterate forward.

For most projects so far that's been okay. Many open source projects, and some of my bigger projects usually ask you to "submit an issue before a PR" so there's a chance to talk about the design first. That's a hint at what's missing: a place for the design to be discussed and decided before anyone writes code. Not just initially, but throughout development.

## How hyper9 started

hyper9 began the way most of my projects do lately: chatting with ChatGPT on my phone, notebook in hand. I put the idea together in my head, did research, and validated assumptions. Eventually I said "draft a design doc," and that became the working design document until implementation started.

The project was too big for a single plan, so the doc broke it into milestones. Each milestone was a collection of things. The early ones were small, but they got bigger and bigger. Though, you wouldn't notice it by looking at the words.

I should have seen the problem coming when I started doing "milestone prep." Before taking on M3, I'd ask what needed to happen first. That turned into a planning step of its own, full of unlisted work: set up a test harness, do some prerequisite work, answer some open questions. Once that was done, I could usually turn the milestone over to the agent to implement on its own.

## Stuck in research mode

As the project grew, the milestones I'd defined upfront grew too. Sometimes after prep and planning, the agent would just read files and look things up for 30 minutes. One time I left it for over two hours, and it still hadn't written anything. It was all reading source and researching, which does go into its context and makes for a better implementation.

It was funny, it was like a new junior programmer too afraid to start because they don't feel prepared. Safer to just keep learning.

The real issue was that the milestones were too big. They were one-liners like "M4: this, this, this, and this. Should be able to X." Each of those "this" items probably deserved its own plan.

## Patching the process

This time I did one thing right: I had the agent keep the overall plan, which had become DESIGN, up to date. Whenever planning or implementing a milestone surfaced something that would change or add to the design, the agent updated the doc. It also added a short entry to a Milestone Changelog section, recording what changed and why, grouped by milestone.

That worked, but then dependencies showed up. Dependencies were how the milestones got ordered in the first place, and new discoveries could change that order.

Then I started running work in parallel. A milestone plan would lay out steps, and if one could be done independently, I'd have another agent session take it. They usually touched different files, and occasional overlap was fine. But the DESIGN doc and its changelog became a shared hotspot that every session wanted to edit.

I originally had M0 through M10 milestones. I assumed the early ones would be the hardest, with all the setup and foundation work, and later ones would get easier as "just features." The opposite happened. The project got bigger and more complex, and the later milestones listed a bunch of pretty big things.

So I stopped at M4. It was a good point for validation and demos that showed, yes, this will work. And then I had the agent help me come up with a new process.

## Enter proposals

I've always wanted to run a project on a written proposal system. The idea goes back to internet protocols and RFCs (Requests for Comments). Python has PEPs (Python Enhancement Proposals), and Go has its own proposal process. You get a written record of how an idea evolved: its design and its plan for implementation. You can collect comments and revise before approving and building it. And it lines up neatly with the plan-then-implement loop you already want with coding agents.

So I based hyper9's new process on Go's, with some modifications. Fittingly, the first proposal was for the proposal system itself: [proposals.md](https://github.com/progrium/hyper9/blob/main/design/proposals.md) explains the motivation, how it works, and how we migrated to it. The rules live in the [design README](https://github.com/progrium/hyper9/blob/main/design/README.md).

The short version:

- **No more milestones.** Each piece of work is its own proposal, a Markdown file in `design/` covering design and planning.
- **Dependencies in frontmatter.** Each proposal lists what it `depends` on, along with status and other bookkeeping. The order of work comes from the dependency graph, not a numbered sequence.
- **A clear workflow.** A sketch becomes an initial proposal with open questions. Then there's room for discussion, a final comment period, and formal approval.
- **A tool that knows what's ready.** It reports when a proposal is accepted and all its dependencies are implemented, so it's ready to build. It also validates the graph in CI and regenerates a status table in the project README.
- **GitHub issues for discussion.** Filing a proposal opens an issue for open discussion and tracking. Revisions happen as commits to the doc.
- **DESIGN stays current.** DESIGN.md now describes only what exists. The PR that finishes a proposal updates it.
- **A human signs off.** Agents can help write proposals, but a named person has to direct, review, and sign the work.

The old M0 through M4 became a single "baseline" proposal marked implemented. The remaining milestones were split by feature into separate drafts.

## Why it works

This solves the pre-development design process. It documents the thinking and the original plan, and it keeps the main design doc up to date as a current spec rather than a pile of plans.

It also makes open contributions easier, both for design and for the question "what's ready that I can help with?" And that applies to agents too. I can point an agent at a proposal to flesh it out, challenge it, or at another to implement it. I can point several agents at different proposals without them getting in each other's way on design, prep, and planning. Actual implementation happens in branches when needed.

This setup makes agent assisted human contribution easy, too. You can do the same thing I do: point your coding agent at a proposal, keep a loose eye on what it does, and review what it completes. Though, if you didn't write the proposal, it's probably a good idea to talk through it with the agent to better understand it.

The best part is that the formalisms, the design and customization of this workflow, but more importantly the work of actually following it are suddenly not overwhelming. Agents carry most of that load. A process like this would have felt like bureaucracy for a small project before. Now it's mostly free.

## A real roadmap

hyper9 now has a real roadmap: proposals at various stages, each with a [GitHub issue](https://github.com/progrium/hyper9/issues). Some are ready to start, and some are longer-term ideas still being developed. There are also a few unnumbered sketches in the `design/` directory that don't have issues yet. A table in the project README, kept up to date by a tool, makes it easy to see what's ready to work on.

I can think through a bunch of ideas, load them in as proposals, and let them simmer and develop until I think they're ready to be implemented. It's not quite a software factory, but it definitely feels like an augmented assembly line. One where feel in control of the design, and make better design decisions.
