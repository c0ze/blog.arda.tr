---
title: "Heliobane on the Sharp X68000: One 68000 Core, Two Machines"
date: "2026-10-31"
excerpt: "Heliobane is out on PC and Android, the Amiga version was already out, and now there is a free X68000 version too. World 1 boots from its own disks, in Japanese, with FM music. A day after release, a player had it running on a real X68000 SUPER, and found a bug my emulators could never show me."
tags: ["retro", "x68000", "amiga", "gamedev", "heliobane", "agents"]
keywords: "heliobane, ヘリオベイン, sharp x68000, x68000 homebrew, x68000 game port, x68000 real hardware, xm6 typeg, 68000 optimization, amiga a1200, shared game core, opm fm music, msm6258 adpcm, mega drive pad x68000, xeij, mame x68000, shmup, itch.io"
description: "Porting the Heliobane shoot 'em up to the Sharp X68000: a self-booting disk with its own loader, World 1 at up to 27.7 fps, FM music and Japanese text, 68000-only speed patches in the core it shares with the Amiga port, and what the first players found on real hardware."
author: "Arda Karaduman"
image: "/images/og/2026-10-31-heliobane-on-the-sharp-x68000.png"
draft: false
---

[HELIOBANE](https://heliobane.gand.games/) is out on PC, on
[Steam](https://store.steampowered.com/app/5328670/), and on Android, on
[Google Play](https://play.google.com/store/apps/details?id=games.gand.heliobane). The
[Epic](https://store.epicgames.com/p/heliobane-ad6470) version is coming soon. The
[Amiga version](https://coze.itch.io/heliobane-amiga) was already out. And now there is a
fourth one, for the **Sharp X68000**:
[ヘリオベイン](https://coze.itch.io/heliobane-x68000), free on itch.io.

The X68000 was Sharp's late-80s machine: a 68000 at 10 MHz, hardware sprites, an FM
sound chip, and arcade ports so good that it's still a legend in Japan. It has the
same CPU family as the Amiga, and that's why this port went so fast. Heliobane's Amiga
port already has a C core that runs the game's simulation, tick for tick the same as
the PC version. The X68000 port uses that same core, and its speed-ups go back into it.

## A disk that boots itself

The game boots from its own disk image, with its own loader. No Human68k (the X68000's
DOS), no resident drivers, and no call into Sharp's ROM after the boot sector hands
over. Every remaining ROM use is listed in a ledger, along with how it will be retired.

I did it this way because of licensing. Sharp's free release of the X68000 software
covers personal use, not bundling the ROMs or the OS with a game. A disk that needs
neither contains only my code.

The target is the common machine: a 68000 at 10 MHz with 2 MB. Everything was measured
on two emulators, headless: MAME's `x68000` driver for automation and XEiJ for
accuracy. Every number in the project's notes names the emulator, the model and the
ROM it was measured on. Until release day, nobody had run it on real hardware.

## Probes first

The first thing that ran on the X68000 wasn't the game. It was a set of probes, each a
tiny self-booting disk that measures one thing: how the machine boots, the timers, the
display modes, how many sprites fit on a line, the FM chip's busy flag, the joystick
after taking the machine over, and reading the floppy without the ROM.

Then the real question: can a 10 MHz 68000 run Heliobane's simulation and draw its
sprites at the display's 55.46 Hz? A bench ran each World 1 stage's real simulation,
with every bullet and enemy on raster-multiplexed sprites. At full rate, stage 1 was
fine (0.4% of frames repeated), but the later stages repeated between 4.5% and 23%. At
half rate, 27.7 fps with two simulation ticks per picture, stage 1 was nearly perfect.
That's the same pacing as the Amiga's 25 fps build, so I said go at half rate.

## What's in it

All of World 1: stages 1–5 with the PC's art, pixel for pixel. The backgrounds are on
the graphic pages, scrolled by the video chip, and every object is on hardware sprites
through a multiplexer. On stage 4 the multiplexer used to drop a few hundred sprites,
until its sprite slots became a ring. Now it drops none, on any stage.

Around the stages there's the opening, a title screen with the chrome logo, Magpie's
shop, three difficulties, Mott's ten-lesson training run, continues, an attract demo,
high scores with name entry, and World 1's ending with its radio voices and its own
song. Scores and key bindings are saved to the boot disk by our own floppy driver.

World 1 needs two disks, even with LZ4 on the art and tables. Disk A boots and holds
stages 1–2, disk B holds stages 3–5. If disk B isn't in the second drive, the game
asks for it, in Japanese.

The port is Japanese only. Every string comes from the PC version's Japanese text,
drawn in the PC's own Japanese pixel fonts, not the ROM's character set: the stage
cards, the Herald's warning, and the radio chatter as subtitles under the Japanese
voice lines. You can play with the keyboard, a 2-button joystick, or a Mega Drive 3- or
6-button pad through a straight adapter, with focus, the Breaker and the weapon swap
on their own buttons.

<figure>
  <img src="/images/heliobane-x68000/world1-shots.webp" alt="Three screenshots of the X68000 port at 2x: stage 1's boss, a mechanical sun-like sphere spraying orange bullets over a purple nebula; Magpie's shop in Japanese, with Mott's portrait and the gun list; and stage 2, Verdigris, with the ship firing upward through green rock." width="1552" height="512" loading="lazy" />
  <figcaption>World 1 on XEiJ: the Quarry Maw, Magpie's shop, and stage 2, Verdigris.</figcaption>
</figure>

## FM drums

The X68000's sound is a Yamaha OPM (eight FM voices) plus a single ADPCM channel. Our
own driver plays the music from a timer. World 1's ten songs come from
[cozy-tracker](/blog/2026-07-12-introducing-cozy-tracker), arranged for the OPM, with
the effects and the Japanese voice lines on ADPCM.

The first version had the drums on ADPCM too. I didn't like them, so they moved to FM,
and the whole mix was set to the PC version's levels, measured, not by ear. The music
ducks under the voice lines.

## Speed, in the shared core

Half rate held for stage 1, but stages 2 and 5 didn't keep up. With the art, HUD and
sound in, they repeated about 21% of their frames. A profiler on the 68000 showed where
the time went, and a lot of it went to things the 68000 doesn't have.

It only multiplies 16 bits by 16, so gcc called a library routine for every 32-bit
product. Some of those came from an innocent exact division by the size of an enemy
struct. Stage 2's boss, the Leviathan, samples points along its own body's trail every
tick, and that search alone was a big share of the frame. Then the fixed-point divides,
and the bullet loops.

The fixes are patches to the shared core, written for the Amiga port's repository: a
68000 `fix_mul`, the bullet loop in 68000 code, a faster hit scan, the trail search
starting from the last gap, single 16-bit multiplies and divides where the values fit.
There are fifteen so far. The first eleven are merged into the Amiga port, and the
other four are waiting for me to apply them there.

Every patch applies only on the plain 68000. On the A1200's 68020, and in the host
build that checks the simulation, the core compiles to exactly the same instructions as
before, and we checked that for every core file. So it's still one codebase, and the
X68000 gets its own path through it.

The first two passes, eleven patches plus drawing fixes in the port itself, did this to
the full game on XEiJ:

| Stage | Repeated frames before | After the second pass |
|---|---|---|
| 1 | 0.6% | 0.5% |
| 2 | 21.3% | **9.9%** |
| 3 | 5.2% | 2.7% |
| 4 | 9.0% | 4.8% |
| 5 | 20.9% | **11.1%** |

Not everything worked. A smarter collision broad phase made things slower: with this few
shots, the bands cost more to build than the scan they replaced, so it was dropped. And
a review caught a real bug in one inline-assembly patch, where gcc was allowed to reuse
an input register. The eleventh patch fixed it.

Three more passes followed: the seekers' target pick, square roots without library
calls, the whole trail sample in 68000 code, two bullets per loop, and the sprite calls.
After the fourth pass, nothing in the profile was over 9%. I could have kept going, but
I chose frame skip instead. A late picture becomes a debt that the next pictures pay in
ticks, up to two extra each. Ticks are never dropped, so a run is still the PC's run.
Stage 5 had run 10.5% behind real time, and with frame skip it's 0.7%. You pay for it
with fewer pictures when the screen is busy: stage 5 averages 24 a second, not 27.7.

One change was gameplay. The Seeker Swarm slowed the later stages to a crawl when I
played them, so the X68000's seekers got the PC's seeker nerf and a dumber steering
rule. Stage 5 with seekers now runs as fast as stage 5 without them.

## The shop took a second to redraw

The stages weren't the only slow part. When I played through, the shop and the score
tally after a boss were laggy. Moving the cursor in the shop meant a full redraw, and
that took nearly a second on XEiJ.

The problem was the text. Every string went through the font renderer one glyph row and
one byte at a time, on each bitplane, and every string was drawn twice, once for its
shadow. Every move redrew the whole screen this way, panels and all.

Now a glyph's column, shift and line address are worked out once and its rows stepped a
line at a time. Screens are composed in RAM and only the changed lines are copied out. A
string is inked once with its shadow, and the shop redraws only the rows the cursor left
and reached. Over two passes, a shop redraw went from nearly a second to under 0.2. The
tally, measured after the first pass, went from 246 ms a step to 9.

## Agents and emulators

Like the Amiga port, most of this was written by Claude sessions running in parallel,
each on its own branch: stages 2–5, sound, speed, the shop, the ending, the Japanese
text, the title, the release paperwork. Codex and muse-wonder-full reviewed them. My
part was the decisions (half rate, frame skip, two disks, Japanese only, the logo) and
the playtests. The shop is there because I died at the first boss and asked where
Magpie was.

What slowed us down most was the emulators. At one point my ThinkPad was running
emulators for around fifteen sessions at once, and the measurements suffered. Now heavy
jobs run one at a time. The sessions' X68000 reference library is on
[my NAS](/blog/2026-10-26-wikipedia-stack-overflow-and-the-amiga-hrm-on-my-nas), as the
`x68000_dev` shelf.

## Release, and a real X68000

Version 1.0 went up on itch.io on October 29. I announced it from
[Gand's X account](https://x.com/gandllc), in Japanese, and asked for real-hardware
testers. Version 1.1 came a day later, with World 1's ending, the shop's sounds, and a
difficulty fix: 1.0 had played every game on Normal, whatever you picked.

The next evening, ＰＩ., the author of XM6 TypeG (the emulator most Japanese X68000
players use), ran it on an X68000 SUPER set to 10 MHz, with a 2-button XE-1 PRO, cleared
stage 1 on Easy, and posted the result on X and in the itch comments. So it works on a
real X68000.

ＰＩ. also saw junk on the title screen, and players on XM6 TypeG saw it too. That was
my bug. The game never cleared sprite RAM at boot, and XEiJ and MAME both start with it
zeroed, so none of my tests could show it. On real hardware and in XM6, the unused
sprite slots showed whatever was in memory. The fix clears all 128 slots before the
display comes on, and our MAME runs now have a "poison" mode that fills sprite RAM with
junk at power-on.

XM6 TypeG is now our third test emulator, running headless under wine. It found one
more: the attract demo waited for the test harness to acknowledge a screenshot. MAME
and XEiJ answer, so every test passed. A real machine doesn't, and the demo stopped
about 18 seconds in.

ＰＩ. also said that "no ROM required" in my announcement was an overstatement, and
that's fair: a real X68000 still boots from its IPL-ROM. I meant no Human68k, and no ROM
files to find for XEiJ. The wording is fixed.

It doesn't run on the X68000 Z yet. One player's Z, on the latest firmware, didn't get
past the boot, and neither did WinX68k's fast build or the WebX68k browser emulator. I'm
still looking into those.

Someone compared it to XENON. Someone else wrote "68新作ｷﾀ━━━━(ﾟ∀ﾟ)━━━━!!" (a new 68
game is here). And one player said that after the free port, they'd go buy the Steam
version.

## Next

Version 1.2, with the sprite RAM fix and the demo fix, goes up in the next few days.
After that, the X68000 Z.

The same 68000 is behind [Farstrand](/blog/2026-09-25-heliobane-and-the-games-of-gand),
the trilogy's metroidvania, which has its first Amiga demo build. Heliobane started as
an Amiga-style shmup on PC. Now it runs on an Amiga, and on the machine Japan was
buying while we were buying Amigas.
