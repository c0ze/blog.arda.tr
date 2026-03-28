---
title: "Securing VS Code extensions as an attack vector"
date: "2026-03-28"
excerpt: "The LiteLLM supply-chain compromise pushed me to audit my VS Code extensions, remove what I do not use, and replace a few utilities with my own pinned forks."
tags: ["dev", "security", "vscode", "ai"]
keywords: "VS Code extension security, LiteLLM supply chain compromise, Open VSX malware, VSIX audit, pinned extension forks"
description: "How I audited my VS Code extensions after the LiteLLM compromise, removed unnecessary packages, and replaced several utilities with my own pinned forks."
author: "Arda Karaduman"
image: "/images/og/vscode-security.jpg"
draft: false
---

Recently the [LiteLLM supply chain compromise](https://www.trendmicro.com/en_us/research/26/c/inside-litellm-supply-chain-compromise.html) reignited a concern I have had for a while: if poisoned dependencies can sneak into the software I build, then the tools I use to build it deserve the same suspicion.

My own projects were safe, but that is not really the point. The whole point of a supply-chain scare is that you do not wait for the bad outcome before cleaning up the obvious attack surface.

And VS Code extensions are absolutely part of that surface.

The Trend Micro write-up describes how the LiteLLM incident fit into a broader multi-ecosystem campaign spanning developer tooling, package registries, and CI. That was enough to finally push me into doing something I had postponed for too long: a full pass over the extensions sitting inside my editor.

This was not paranoia out of nowhere either. ReversingLabs documented [malicious VS Code extensions hiding malware inside packaged dependencies](https://www.reversinglabs.com/blog/malicious-vs-code-fake-image), including payloads disguised as a PNG. Kaspersky also wrote about [fake Open VSX extensions used to steal cryptocurrency](https://www.kaspersky.com/blog/malicious-extensions-for-cursor-ai/53802/), which matters even more now that AI coding tools and VS Code forks keep leaning on the same extension ecosystem. I already touched on that shared marketplace reality in [Antigravity blues ...](/blog/2025-11-30-antigravity-blues).

## Why extensions deserve scrutiny

Themes are harmless enough. Syntax helpers are usually boring. But many extensions are not just static assets sitting in a folder.

They ship code. They bundle dependencies. They activate on startup. They open webviews. They parse workspace files. They can sit uncomfortably close to shells, tokens, API keys, and whatever sensitive material happens to pass through your editor that week.

In other words, the editor is part of the dependency tree now.

## The audit

The first part of the job was boring, which usually means it was important:

- list everything installed
- separate daily tools from abandoned experiments
- identify publishers I actually trust
- remove packages VS Code already covers well enough
- decide which small utilities are simple enough to own myself

Some choices were straightforward. I kept the extensions that make sense to trust upstream: Codex and Claude, core Microsoft tooling, Docker, GitHub, Red Hat, and the language support I genuinely use.

The questionable layer was everything around that core: themes, viewers, preview helpers, old experiments, and small convenience extensions that had quietly become "installed by inertia." Those are exactly the kind of packages that accumulate until nobody remembers why they are there.

So I started trimming. Unused things went away. Redundant things went away. `Dracula Pro` was easy to drop. Older leftovers from previous extension installs were not worth keeping around. Some utilities simply did not justify the trust they were asking for.

## The part I decided to own

The more interesting move was not just removing extensions. It was taking ownership of the few I still wanted, but no longer wanted to consume as moving targets.

So I forked the tools that felt useful and realistically maintainable:

- a PDF viewer
- a DOCX viewer
- Prettier
- the Taplo-based TOML extension

Then I cleaned those forks up so they were mine in a real sense, not just GitHub bookmarks:

- changed the publisher IDs to my own
- added local packaging scripts for reproducible `.vsix` builds
- documented the workflow in each repo
- built and installed the VSIX files locally
- committed everything into a clean, buildable state

That publisher change matters more than it sounds. If you leave the original extension identity intact, the marketplace can eventually overwrite your "fork" with upstream again. Once the extension is installed under my own publisher and built from my own repo, it stops behaving like an edited copy of somebody else's package and starts behaving like pinned local tooling.

I also wired those forks into my actual workflow instead of treating them like side projects:

- PDF and DOCX files now open with my own local viewers
- Prettier now points to my fork as the default formatter
- TOML files now use my own Taplo-based fork

For CMake, I went in the opposite direction and simplified the story by sticking to Microsoft's maintained `CMake Tools` instead of trying to self-host a problem I do not actually want.

## Why these were good candidates

I am not interested in forking everything. Rebuilding a language server or a large container extension is not a fun hobby, and it is usually not a good use of time.

But small utilities are different.

A PDF or DOCX viewer is contained enough to reason about. Formatter and TOML tooling are a little heavier, but still realistic enough to pin and update on my own schedule. These are good places to practice ownership without signing up to maintain an entire ecosystem.

This also ties into something I wrote a few days ago in [Is 2026 the year of the Linux desktop?](/blog/2026-03-24-is-2026-the-year-of-the-linux). The whole argument there was that inspectable systems become much more useful once you have an AI accomplice helping you audit, patch, and verify what is actually on disk. That logic does not stop at the OS. It applies to the editor too.

## Final state

The goal was never absolute purity. The goal was to shrink the part of my daily environment that can surprise me.

Now the stack is much simpler:

- trusted publishers for the heavy lifting
- my own pinned forks for the small tools I care about
- fewer abandoned, redundant, or mystery packages sitting in the background

That feels like a much saner place to be.

Finally, the VS Code extensions I depend on daily are now coming from known trusted publishers or from my own pinned forks.
