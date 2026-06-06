---
title: "Grep Thyself: Cataloging a 25-Year Career"
date: "2026-06-06"
excerpt: "I went sifting through my old company repos, pointed an AI at every one of them, and had it catalog who-did-what into Reliquary — honestly. It turned into an audit of fifteen years of my own code. Twenty-five if you count the academy. Here's what reading yourself back actually feels like."
tags: ["ai", "dev", "career", "retro"]
keywords: "career retrospective, code archaeology, git blame, honest attribution, AI code audit, Reliquary, mem0, portfolio, resume, legacy code, technical growth, 25 year career"
description: "I had Claude Code audit every repo from every company I've worked at — honest authorship, code quality, secrets scans — and catalog them into Reliquary, my self-hosted AI memory. A retrospective on fifteen years of code (twenty-five with the academy), the one flaw that ran through all of it, and using AI to read back a career I mostly wrote before AI existed."
author: "Arda Karaduman"
image: "/images/og/2026-06-06-grep-thyself-cataloging-a-25-year-career.webp"
draft: false
---

A few weeks ago I [went digging through some old archives and tripped over my 2004 dissertation](/blog/2026-05-22-running-quantum-computer-simulation-using-mpi-revising-my-old-dissertation-thesis). That rabbit hole ended with me rewriting a quantum simulator I'd left half-finished for twenty-two years. I assumed that was the archaeology done.

It wasn't. The same dig turned up something bigger and more uncomfortable: the repos from every company I've ever worked at. Fifteen years of them, sitting in a `legacy/` folder like sediment, most of it untouched since the day I walked out of each job.

My honest first reaction was: I don't actually know what's in here anymore. I could give you the company names and roughly what each place did, but the actual *work* — which parts were mine, what I built versus what I merely touched, whether any of it was good — had gone soft in my memory. So before it rots on a disk somewhere, I decided to catalog it. To register what I'd actually done.

## The method

I didn't want a vibey summary. I wanted an audit. So I pointed Claude Code at each repo, one company at a time, with a fixed brief:

- **Whose work is this, really?** `git shortlog`, per-directory blame, cross-referenced against my old commit emails. Solo, lead, co-lead, or "I contributed three files to someone else's project" — graded honestly, because a CV built on overclaiming is one that dies in the first technical interview.
- **Is it any good?** Read the actual code, not the README. Concurrency, security, error handling, tests.
- **What could ship?** A secrets scan, plus a pass for genuinely generic, non-proprietary pieces worth open-sourcing.

Every repo became a note in [Reliquary](/blog/2026-06-03-introducing-reliquary-one-memory-for-every-ai), my self-hosted memory server — one "room" per company, a note per project, each with a ready-to-paste CV bullet and a brutally honest *how did I do* section. Then I had it write a synthesis across the whole pile.

The tally: **8 companies, around 63 repos, 2012 to 2026.** And since I'd already exhumed the dissertation, I bolted the academy onto the front — the 2004 bachelor's, then a master's (and a PhD I started but didn't finish) at Keio. Twenty-five years, if you count from the first time I wrote code somebody graded.

## Reading yourself back

Here's the part I wasn't ready for. Put fifteen years of your own code in a row, hand it to a tireless and slightly pedantic reviewer, and patterns fall out that you simply cannot see from inside the current repo.

The flattering one first: I clearly *learned*. My earliest repos have AWS keys committed straight into git — the real, throw-your-coffee-across-the-room kind of mistake. A few years on, that's HashiCorp Vault. A few years after that, SOPS and short-lived CI tokens. There's a data race in an old Go daemon that I evidently went back to school on, because the very next Go service I wrote uses channel-owned state and runs `go test -race` in CI like it had something to prove. You can watch yourself grow up, commit by commit.

There was one genuinely uncanny moment. The audit praised a 2015 pipeline of mine — cross-compiling Go for ARM, building Debian packages, shipping them to a fleet of devices through an S3 apt repo — as "advanced for its era." Which was nice, right up until I remembered I'd [blogged that exact setup back in 2015](/blog/2015-10-03-using-s3-as-a-deb-repository). My present-day AI reviewer and my 2015 self, agreeing across eleven years. Hello again.

But the *un*flattering pattern is the one that taught me something. Across **twenty years** — from the 2004 dissertation to last year's code — the same flaw keeps surfacing. My notes ended up naming it: **"right idea, enforcement has a hole."** A replay-window check that's computed and then never actually returned on failure. A signature verified but never wired in. The correct instinct, with the last screw left untightened. Again and again, across languages and decades.

What got me is that it never tracked with seniority. Some of my *earliest* code is, in spots, more rigorous than my mid-career stuff. The conclusion fell out with almost insulting clarity: this was never a knowledge gap. I always knew what the right thing was. What I lacked — consistently, for two decades — was a tireless second pair of eyes to catch the one place I forgot to finish.

Which is the punchline, isn't it. The thing I was missing is the exact thing I was now using to find it. I had an AI read twenty years of code I wrote *before AI existed* and tell me, kindly, that I'd have been fine all along if I'd just had an AI. There's a control-group purity to those pre-2023 repos that I find genuinely funny.

And I'll spare myself nothing. My own one-line review of my very first job is on record: *I didn't know what I was doing, but I learned a lot.* The repos concur — the code is junior, the security is worse, and I owned an alarming amount of production infrastructure for someone that green. Wouldn't trade it.

## What it's actually for

This wasn't pure navel-gazing. I'm rebuilding my résumé site straight on top of the Reliquary corpus — the same data [pointed at a different problem](/blog/2025-11-23-ai-resume-bot). Every project already carries a fact-checked, honestly-attributed bullet, so the résumé more or less writes itself, and it can't lie — the attribution work is already baked into the notes.

But the résumé is the side effect. The real thing I walked away with was the read-back. Almost nobody sits and looks at the whole arc; we just live inside today's repo, fighting today's bug. Laid end to end, mine turned out to be one long story — hardware, to distributed systems, to whatever this AI-plumbing era is — with a single stubborn flaw running through the middle like a watermark, finally closing now that the second reviewer exists.

Go grep yourself. Just budget for the feelings.
