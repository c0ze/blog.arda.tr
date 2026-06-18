---
title: "Zork, Illuminated"
date: "2026-06-18"
excerpt: "Zork I is, as of last year, one of the most preserved games on Earth — Microsoft open-sourced the original under MIT. So this isn't a rescue. It's the other half of preservation: making a 1980 wall of text lived in again. I gave the Great Underground Empire AI art in four styles, narration in eight voices, region music, and the real Z-machine — all static, in the browser, at zork.coze.org."
tags: ["retro", "ai", "dev"]
keywords: "Zork, Infocom, Z-machine, Parchment, Bocfel, WebAssembly, interactive fiction, text adventure, game preservation, generative art, Nano Banana, Gemini, TTS narration, Suno"
description: "How I turned Zork I into an illustrated, narrated graphic text adventure in the browser: AI scene art in four styles, eight narration voices, region-based music, and the original Z-machine running via Parchment/WASM — fully static."
author: "Arda Karaduman"
image: "/images/og/2026-06-18-zork-illuminated.webp"
draft: false
---

A week ago I [ported a dying roguelike to Go](/blog/2026-06-11-saving-the-slimy-lichmummy) and ended the post with a threat: *other projects may be incoming*. Here's one.

> West of House
> You are standing in an open field west of a white house, with a boarded front door.
> There is a small mailbox here.

If those three lines do something to you, you already know why I built this. They open **Zork I** — 1980, Infocom — and for a certain kind of person they're as load-bearing as the first riff of a song you grew up on. No graphics. No sound. Just a parser, a white house, and the slow certainty that it is pitch black and you are likely to be eaten by a grue.

![A dense pen-and-ink engraving of a boarded-up white house at the edge of a dark forest, a small mailbox in the overgrown field.](/images/2026-06-18-zork-illuminated.webp)

## It's already saved. That's the point.

Here's the twist on the usual preservation story. When I [saved the Slimy Lichmummy](/blog/2026-06-11-saving-the-slimy-lichmummy), the stakes were real — dead links, a site the Wayback Machine refuses to serve, a great game surviving on one mirror and a stranger's spare drive. Zork has the opposite problem. It may be the most preserved game alive. Last November, Microsoft and Activision [open-sourced the original Zork I/II/III under the MIT License](https://opensource.microsoft.com/blog/2025/11/20/preserving-code-that-shaped-generations-zork-i-ii-and-iii-go-open-source/). The story files are mirrored on every shelf of the internet. The bytes are immortal.

So this isn't [digital necromancy](/blog/2026-02-03-digital-necromancy) — the patient is in perfect health. It's the *other* half of preservation, the half I keep circling in posts about [40-year-old hardware](/blog/2026-02-02-ghosts-in-the-silicon-wringing-impossible-art-from-40-year-old-hardware) and abandoned games: keeping a thing *runnable* is not the same as keeping it *lived in*. A 1980 wall of text is flawlessly archived and almost nobody will sit with it for an hour anymore. Preservation as amber, when what you want is soil.

So: illuminate it. Literally. Give the Great Underground Empire eyes and a voice and see if it still breathes.

There's a tension there I wanted to respect. The whole magic of interactive fiction is that *your* imagination does the rendering — the white house looks like your white house. Bolt AI pictures onto that and you risk evicting the reader's imagination and moving a model's in. So the rule was simple: **the text still drives.** The art and the voice accompany the prose the way a score accompanies a scene — there when you enter a room, never narrating your every move, never reading your own typed commands back at you.

## The build

The spine is the part I refused to fake: it runs the **real game**, not a reimplementation. The MIT release ships the compiled Z-machine story file — Release 119, the actual bits — and [Parchment](https://github.com/curiousdannii/parchment), with the Bocfel interpreter compiled to WebAssembly, runs it in the browser. The 1980 parser, the real behavior, no transliteration. Everything else hangs off that black box.

The rest is a pipeline:

- **78 rooms, lifted from the source.** Zork's world lives in ZIL, Infocom's dungeon language. I parsed every room and its description straight out of it — and deduped, so the fifteen identical Maze rooms collapse to a single image. That's not laziness; being unable to tell the rooms apart is the entire point of a maze.
- **Art in four styles.** Each room's text becomes a prompt, and [Gemini's image model](https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image) ("Nano Banana") draws it. The hard problem isn't making 78 pictures — it's making them look like one world when each is generated with no memory of the others. The fix is a *style bible* plus anchor entities: the white house, the brass lantern, the troll, each described once and pinned into every prompt that needs them. Four bibles — ink engraving, retro pixel, painted pulp, cinematic — switchable live, because I couldn't choose.
- **A voice. Eight, actually.** Every scene's narration is pre-baked through a TTS server in eight voices — US, UK, Australian, Canadian, male and female. Switch narrator mid-game and it re-reads the room in the new one. All static files; no API key ever reaches the browser.
- **Music that follows you down.** Region-scored — one mood for the open air, another for the cold dark of the underground, more for peril, for wonder, for the Land of the Dead — [generated in Suno](/blog/2025-11-14-suno-stuff) and crossfaded as you cross between zones.

The trick that stitches it together: *how does a static page know which room you're in*, when the game is a sealed interpreter in an iframe? It eavesdrops. It watches the text scroll past, matches each new line against the 78 room names it knows, and when you arrive somewhere it swaps the picture, the score, and the narrator. The prose announces the room; everything else is listening.

Like the Lichmummy, most of this got built in long sessions with Claude doing the labor while I steered — and like before, [I'll be honest about where that actually helps](/blog/2026-02-03-effects-of-ai-on-productivity). The taste calls were mine: don't smother the reader's imagination, let the text lead. The machine's contribution was patience — including the genuinely stupid afternoon we spent on a bug where the interpreter rendered into a zero-height box and only woke up when you opened the dev tools. (A `ResizeObserver` measuring nothing. The fix is one line. Finding it was not one line.)

## Go play it

It's all static — interpreter, art, audio, and about two hundred lines of glue, sitting on GitHub Pages behind a custom domain:

- **[zork.coze.org/zork1](https://zork.coze.org/zork1)** — pick a style, pick a voice, type `open mailbox`.
- Source: **[github.com/c0ze/zork](https://github.com/c0ze/zork)**.

Open the mailbox. Read the leaflet in a voice you chose, in a field drawn in ink, while something low and lonely plays underneath. It is the same game it was in 1980 — every word, every exit, every grue — but it's *lived in* now. Amber turned back to soil.

Zork II and III are already cloned and waiting; the pipeline doesn't much care which Great Underground Empire it lights up. And there are other ghosts on the list besides. Other projects may be incoming.
