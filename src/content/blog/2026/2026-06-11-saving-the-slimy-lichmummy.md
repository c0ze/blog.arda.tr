---
title: "Saving the Slimy Lichmummy"
date: "2026-06-11"
excerpt: "A bizarre, underrated roguelike from 2012 was quietly disappearing from the internet — dead links, a site the Internet Archive won't serve. So I ported it to Go, mechanic by mechanic, with the original C as the spec. Full 0.40 parity, native binaries for five platforms, and a WebAssembly build you can play right now at tsl.coze.org."
tags: ["dev", "go", "ai", "retro"]
keywords: "The Slimy Lichmummy, roguelike, Go port, WebAssembly, wasm, Claude, game preservation, Ulf Åström, tcell, TDD, terminal game"
description: "How I ported The Slimy Lichmummy 0.40 from C to idiomatic Go with full feature parity — preserving a disappearing roguelike, restructuring it around a clean engine/front-end seam, and shipping it to the browser via WebAssembly."
author: "Arda Karaduman"
image: "/images/2026-06-11-slimy-lichmummy-go-port.webp"
draft: false
---

There's a Reddit thread that opens like an obituary: *"Where can I download the
Slimy Lichmummy? The links I've found don't work anymore, and the site is
excluded from the Internet Archive."*

Sit with that second part for a moment. Not just dead links — the usual fate of
any hobby project older than a console generation — but a site the Wayback
Machine *won't serve*. The game survives today because the
[ArchiveRL](https://forums.roguetemple.com/index.php?topic=4486.0) project hoards
everything, because [someone mirrored the source to
GitLab](https://gitlab.com/vitaly-zdanevich/the-slimy-lichmummy), and because one
commenter offered to dig through an old hard drive for a zip. That's the whole
chain of custody for a genuinely great game: a community archive, one mirror,
and a stranger's spare drive.

I've [written before](/blog/2026-02-02-ghosts-in-the-silicon-wringing-impossible-art-from-40-year-old-hardware)
about why old software is worth keeping alive, and I've
[resurrected my share of digital corpses](/blog/2026-02-03-digital-necromancy).
This one felt personal. So: **[tsl-go](https://github.com/c0ze/tsl-go)** — a
faithful Go port of The Slimy Lichmummy 0.40, with the original C preserved in
the repo as the reference, native binaries for five platforms, and a
WebAssembly build you can play in your browser right now at
**[tsl.coze.org](https://tsl.coze.org)**.

![A scratchy black-and-white ink illustration of the Slimy Lichmummy howling under a full moon, with red accents and terminal-like ruins.](/images/2026-06-11-slimy-lichmummy-go-port.webp)

## Why this game

The Slimy Lichmummy is Ulf Åström's terminal roguelike, last released as
version 0.40 in September 2012 (the changelog is in the repo, preserved with
everything else). The thread that sent me down this hole called it a
*"bizarre, underrated gem"*. My favorite description came from another
commenter: *"It feels like someone turned Quake 1 into a roguelike."*

That's exactly right, and it's hard to convey how strange that is until you
play it. The dungeon graph runs from a classic stone Dungeon through a
Laboratory and a Communications Hub down to a Drowned City — gothic horror
welded onto dead technology. You'll fight gravelings and chrome angels in the
same session. You read spellbooks that have a 50% chance of biting your hand
instead of teaching you anything. There's a spell whose entire description is
*"has a 50/50 chance of killing either the caster or a target within touch
range"* — and it costs 1 energy point, because of course the house lets you
take that bet cheaply.

And underneath the weirdness, the design is *tight*. Corpses weigh 599 units
against your 400-unit carrying capacity — a single number that kills loot
hoarding dead. Mimics disguise themselves as the random loot of the level
you're on, and the sword swing that discovers one is *wasted*, lost to the
flinch. Water is lethal unless you're blind enough to stumble into it,
levitating over it, or polymorphed into something with fins. This is a game
with opinions, and every opinion is one or two integers in the source.

It deserves better than a zip file on a stranger's spare drive.

## The rule: the C is the spec

The port had one law: **look and play like 0.40**. The entire original
distribution sits untouched in
[`tsl-0.40/`](https://github.com/c0ze/tsl-go/tree/master/tsl-0.40) — and it is
not decoration. Every mechanic started with grepping the C before writing a
line of Go. Not "a haste potion speeds you up" but `HASTE_AMOUNT 30` in
`rules.h`. Not "sleeping skips turns" but the exact loop in `game.c` that
`continue`s past a sleeping creature — which, read carefully, also reveals
that a sleeping creature in 0.40 skips its *drowning* check, an accident of
statement ordering we chose not to reproduce. The messages are the originals,
down to *"Wait! That is a small mimic!"* and the deathspell's magnificent
three-beat *"Death... Yours!"*

Working at that resolution surfaces things no changelog ever recorded. The
hellhound breathes *poison*, not fire — it's right there in `monster.c`, and
now there's a test pinning the surprise. Breath cones narrow back to a point
at the tip because of how the C's swell arithmetic interacts with its loop
counter; the port reproduces the exact triangle. The "slow" status in 0.40
subtracts a vestigial −1 from a speed of 100 — functionally nothing — so the
port keeps the interpretation that actually bites and documents the deviation
in the code.

The strangest discovery: **0.40 ships a graveyard inside itself.** Three named
uniques — Cael'Tzan the Undertaker, Ybznek, Ghrazghaar — have full stat blocks
in the source and *empty spawn cases*. They can never appear. The manual of
camouflage is commented out in the original's own files. So the port runs a
spawnability audit before touching anything: if a 0.40 player can't reach it,
it stays out, verified absent by tests. Faithful means faithful to the game,
not to the dead code. (The dead content is catalogued, though. A hypothetical
0.41 that finally lets Cael'Tzan out of the source code is very much on the
wishlist.)

## Same outside, new bones

Parity on the surface, but internally this is an idiomatic Go program, and the
difference is the whole reason the project ends somewhere interesting instead
of as a transliterated pile of C:

- **An I/O-free engine.** The `game` package never touches a terminal, a file,
  or a clock. Front-ends implement two small interfaces — a `Prompter` that
  supplies player intent and a `Renderer` that draws an immutable `View`
  snapshot. This paid for itself spectacularly at the end: the **WebAssembly
  build required zero engine changes**. The browser front-end is keydown
  events feeding a channel, the engine's blocking loop draining it, and the
  same View rendered as HTML spans instead of terminal cells.
- **Content is data.** Every tile, monster, item, and dungeon level is TOML,
  validated fail-fast at load. The mimic is `mimic = true`; the Lurker's
  tentacle retinue is `retinue_count = 8`. Adding a monster is an edit, not a
  recompile-and-pray.
- **The original dice, exactly.** The C uses a Mersenne Twister; the port
  carries the same generator, bit for bit, with snapshot/restore — so a saved
  game's dice continue *precisely* where they stopped. The save system's
  central test is a fixed-point property: `save(load(save(g)))` must equal
  `save(g)` byte-for-byte on a world salted with every kind of state the game
  has. If any clock, glamour, or pinned recall falls out of the round-trip,
  the suite says so.
- **Strict TDD, fifty-odd increments.** Every feature began as a dated plan
  document citing the C functions it ports, then a failing test, then the
  implementation. Each landed as a reviewed PR — and the review bot earned
  its keep, catching a damage approximation that ran 33% hotter than the C's
  deterministic chain, a save-deletion path that would have failed on
  Windows, and a teleport fizzle that mutated state before failing.
- **CI that means it.** Tests on every push, and a `v*` tag cross-compiles
  standalone, CGO-free executables for Linux, macOS, and Windows — plus the
  wasm build, deployed to GitHub Pages on every merge. Saves in the browser
  live in localStorage under the same rule as everywhere else: resuming
  deletes the save. No scumming. The Lichmummy would not approve of scumming.

Most of this was built in marathon sessions with Claude doing the heavy
lifting while I steered — grounding each increment in the C, arguing with the
review bot, keeping the ledger of what 0.40 actually contains versus what it
merely implies. I've been [skeptical about where AI helps and where it
flatters](/blog/2026-02-03-effects-of-ai-on-productivity); this project is
firmly in the former column. The discipline — C as spec, tests first, audit
the dead code — came from the process. The patience to apply it across
fifty-one pull requests came from the machine.

## Why the new bones matter

The honest answer to "why port it at all, the C still compiles" is that
preservation isn't just keeping bytes runnable. It's keeping a thing *alive* —
forkable, fixable, extensible by people who weren't born when curses was a
reasonable dependency. The C is a single global game state walked by raw
pointers, saved by dumping structs through a pointer table. It works. It is
also where contributions go to die.

The port is eleven small packages with a test suite that pins every behavior
to a citation. Want to add a monster? It's TOML and maybe one behavior
function. Want a new front-end — SDL, a phone, a screen reader? Implement two
interfaces. Want to know why the burden threshold is 400? The constant cites
`rules.h:148`, and the test next to it will fail if you drift. That's what
"saving" a game means to me: not amber, soil.

## Go play it

- **Browser**: [tsl.coze.org](https://tsl.coze.org) — no install, saves in
  localStorage.
- **Native**: standalone binaries for Linux, macOS, and Windows on the
  [releases page](https://github.com/c0ze/tsl-go/releases).
- **Source**: [github.com/c0ze/tsl-go](https://github.com/c0ze/tsl-go) — the
  original C is in-tree, issues and reports welcome. I think it plays fine,
  but the only real test suite for a roguelike is players dying in it.

Quaff the unidentified potion. It's probably fine. It's the Slimy Lichmummy —
it was never fine, and that's why it's worth saving.

And if this one worked — a dead game pulled back through a decade and a
half, mechanic by mechanic, onto every platform including the one in your
pocket — there are other ghosts on the list. Other projects may be incoming.
