---
title: "Mass Fraction: a love letter to Deuteros, in sixteen colours"
date: "2026-09-29"
excerpt: "Mass Fraction is out on itch.io: hard science fiction space-industry strategy at 640×512 in sixteen colours, and my love letter to Deuteros and Millennium 2.2. Build a space program under a shell of debris, train people who can die, and stay off the registry of machines that remove anything unregistered."
tags: ["gamedev", "retro", "godot", "ai"]
keywords: "mass fraction, itch.io, deuteros, millennium 2.2, amiga, amiga strategy game, space management game, space industry strategy, hard science fiction game, rocket equation, delta-v, 16 colours, pixel art, godot 4, gand, the harrow, the lid, kessler syndrome"
description: "Mass Fraction, a hard science fiction space-industry strategy game on itch.io, drawn at Amiga PAL hi-res in sixteen colours: what it owes Deuteros and Millennium 2.2, how it plays, screenshots, the trailer, and how it was made."
author: "Arda Karaduman"
image: "/images/og/2026-09-29-mass-fraction.png"
draft: false
---

Yesterday I put a game on itch.io, and it is not part of [the Heliobane
trilogy](/blog/2026-09-25-heliobane-and-the-games-of-gand). That one was a
shmup and its sequels. This one is slower, colder, and much more interested
in spreadsheets.

**[Mass Fraction](https://coze.itch.io/mass-fraction)** is a hard science
fiction space-industry strategy game. You run a small, underfunded space
program, and your job is to get mass off the Earth, then people, then an
economy that no longer needs the ground. It is drawn at 640×512 in sixteen
colours, it plays with a mouse, and it is, openly and on purpose, a love
letter to two Amiga games: **Deuteros** and **Millennium 2.2**.

Here is the trailer. The game filmed it itself, which I will come back to.

<div class="aspect-video my-8">
  <iframe
    class="w-full h-full"
    src="https://www.youtube-nocookie.com/embed/r72SmakYjpk"
    title="Mass Fraction trailer"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

## The two games it owes

**Millennium 2.2** (Electric Dreams, 1989) opened with a twenty-trillion-ton
asteroid making the Earth uninhabitable. You ran the surviving Moonbase:
research, mining, solar power, traffic between worlds, and a slow crawl back
to a planet you could live on again, while mutant Martians argued the point.

**Deuteros: The Next Millennium** (Activision, 1991) picked up about eight
centuries later. The Earth was habitable again, but humanity had forgotten
how to get off it. You started with a headquarters full of rooms and a
population pool, trained people as producers, researchers and marines, and
rebuilt a space industry one shuttle, one station and one mining run at a
time. Both were designed by Ian Bird.

What stuck with me was not the plot. It was the shape of the thing. A room
for everything. Research unlocks production, production fills a shuttle, the
shuttle builds a station, the station mines a moon, and at some point you
look up and realise the whole solar system is a logistics problem you
created. Nobody makes these any more. So I did.

The design document puts the lineage in one line: *spirit only, no shared
names, art, text or music.* Everything in Mass Fraction is new. The debt is
in the shape.

## The Lid

In 2188 a nine-day war in low orbit ground the satellites the world ran on
into a shell of fragments. The fragments are still there. They are called
**the Lid**, and for three hundred and twenty-one years everything launched
through them has been cut apart on the way up.

Earth didn't end. It contracted. It is poorer, quieter and smaller, and its
remaining governments share one body, **the Continuance**, whose main work is
managing decline without letting it turn into collapse. In 2506 the
Continuance funded a small program to try again. You are the Director of the
**Office of Second Ascent**: one launch pad on the Guiana coast, a few dozen
staff, and a budget that depends on results. (*Second Ascent*, incidentally,
is about as close to "Deuteros" as I could get in English.)

Above the Lid wait **the Harrow**. More on them below.

## Deuteros, translated

If you played Deuteros, you already know how to play this. The mapping is
almost one to one:

| Deuteros | Mass Fraction |
|---|---|
| A headquarters full of rooms | **The Yard**: launch complex, Works, Laboratory, Academy, Tracking |
| Training personnel | **The Academy**: named people, months of training, a radiation dose ledger each |
| Research, then production | **Laboratory**, then **Works** on Earth, then foundries and yards in space |
| Shuttles to orbit | **Lifters** through the Lid, with a loss risk on every crossing |
| Orbital industrial centres | **Stations** and surface bases, assembled module by module |
| Mining moons, shipping ore | Drills, refineries, tugs and barges. **Propellant is the currency.** |
| The Methanoids | **The Harrow**: human-made, indifferent, procedural |
| Out to the stars | **The Registry**. No faster-than-light anything. |

Real time with pause and three speeds, one tick is one day. F1 to F10 jump
between the ten rooms, but everything works with the mouse, as it should.

## What you actually do

You start on the ground, in the rain.

<figure>
  <img src="/images/mass-fraction/ground-liftoff.png" alt="GROUND: a Lifter lifting off from pad LC-1 at the Yard on the Guiana coast, in the rain, above the facilities panel, the pads, the open orders, and the row of ten room icons." width="1280" height="1024" loading="lazy" />
  <figcaption>GROUND (F2). The Yard, the Guiana coast, a Lifter at T+1.5 s. It is always raining.</figcaption>
</figure>

Every launch has to cross the Lid, and every crossing has a number on it:
the chance a fragment hits your Lifter on the way through. Tracking,
shielding and a better launch window push it down. They never push it to
zero.

<figure>
  <img src="/images/mass-fraction/first-crossing.png" alt="A notice from Brandt, with a dithered portrait: Lifter I cleared the Lid, the risk had been put at 11.6%, 8.0 t reached Tare, no one was aboard, and a first-time note explaining the Lid and crossing risk." width="1280" height="1024" loading="lazy" />
  <figcaption>The first crossing. Every notice is signed by one of the Office's four heads, and says only what they could actually know.</figcaption>
</figure>

The title isn't decoration. The **mass fraction** is the share of a ship's
departure mass that is propellant it will burn, and the Tsiolkovsky rocket
equation is the main interface of the game, not a hidden stat. Every burn
plan shows you the arithmetic: delta-v required, delta-v available,
propellant used, and what is left for the trip home.

<figure>
  <img src="/images/mass-fraction/burn-plan.png" alt="BURN: the burn plan for Tender-H Halyard 1 from Tare to GEO: delta-v required 1.90 km/s, available 6.00 km/s, 15.1 t of propellant used, a mass fraction of 35%, return possible, and Harrow envelope YES in red." width="1280" height="1024" loading="lazy" />
  <figcaption>BURN (F4). 35% of departure mass burned, a return is possible, and the destination is inside the Harrow's envelope. That last line is in red for a reason.</figcaption>
</figure>

The Laboratory turns years into technology, and the Works turns technology
into modules you then have to lift. Nothing is free, and nothing arrives
assembled.

<figure>
  <img src="/images/mass-fraction/laboratory.png" alt="LABORATORY: the Ascent research branch, with Lid Tracking II, Whipple Kits and Deorbit Sails complete, and Lifter II under study at 92%." width="1280" height="1024" loading="lazy" />
  <figcaption>LAB (F5). Six branches, all of them about getting things up and keeping them alive.</figcaption>
</figure>

People are the scarcest resource. Everyone has a name, months of training
and a dose ledger. There is a career limit of 1,000 mSv, and at 800 the
flight surgeon rotates you home. Nobody respawns. The dead are listed on
**the Roll**, and the Roll does not get shorter.

<figure>
  <img src="/images/mass-fraction/roster.png" alt="ROSTER: 22 staff with role, skill, location and radiation dose bars, the Academy with four trainee slots, and people in training." width="1280" height="1024" loading="lazy" />
  <figcaption>ROSTER (F7). 22 on staff, 4 in training, 0 on the Roll. For now.</figcaption>
</figure>

The first station is **Tare**, parked at 9,000 km in the slot between the
radiation belts. Then a depot at L1, ice on the Moon, propellant made where
you need it rather than lifted through the Lid, and on out to Mars and the
Belt. The Moon is the Millennium 2.2 half of the love letter.

<figure>
  <img src="/images/mass-fraction/tare-station.png" alt="SITE: Tare Station, a side-on cutaway of modules at 9,000 km, with power, propellant, supplies, berths and dose rate, and a crew dose ledger." width="1280" height="1024" loading="lazy" />
  <figcaption>SITE (F3). Tare Station, in side-on cutaway, the Deuteros way. Registry: UNREGISTERED.</figcaption>
</figure>

<figure>
  <img src="/images/mass-fraction/sky-cislunar.png" alt="SKY: cislunar space, with Earth inside its speckled ring of debris, Tare station, the GEO ring, the 20,000 km Harrow floor, L1, Cairn and the Moon." width="1280" height="1024" loading="lazy" />
  <figcaption>SKY (F1). Earth in the Lid, Tare in the slot, and the dotted line at 20,000 km that you really want to stay under.</figcaption>
</figure>

## The Harrow

Deuteros had the Methanoids, who turned out to be colonists from the first
game who had declared independence. Mass Fraction has no aliens, but the
opposition is human-made too, in a way.

In 2161 the old Compact launched the Harrow: self-replicating industrial
machines, sent to prepare the solar system for settlers. The settlers never
came. The Harrow kept working. They have built habitats nobody lives in and
kept the air in them at 21 °C for three centuries. And they remove anything
that is not in their registry.

The registry was last updated on 18 March 2188. Everything you build above
20,000 km is, as far as the Harrow are concerned, debris.

<figure>
  <img src="/images/mass-fraction/harrow-tasking.png" alt="A notice from Brandt: tracking has a Harrow clearance unit closing on weather satellite W-1, arriving around 2510-09-04, and nothing that can stop it. Lisk adds that the Harrow remove whatever their registry does not list." width="1280" height="1024" loading="lazy" />
  <figcaption>"We have nothing that can stop it." The first Harrow tasking.</figcaption>
</figure>

They don't hate you, and you can't negotiate with them. They follow a
charter. Their behaviour is procedural and readable, so you can stay under
their floor, keep your activity quiet, and avoid them, at a price. Or you can
go looking for pieces of the registry's root key and find out whether a
machine that follows orders can be given new ones.

The campaign runs in four acts, **The Lid, The Gap, The Dead and The
Harrowed**, and ends with the Broadcast, which has two endings. After that,
Continuance Mode lets you keep going. You lose if the Continuance loses
confidence in you, if Earth's capacity runs out, or if you are left with no
working pad and nobody above the Lid for 180 days.

<figure>
  <img src="/images/mass-fraction/ledger-orders.png" alt="LEDGER: eleven open orders from Varga, Lisk, Brandt and Sollis, and the detail of D-10 Open Sky: get Lid density below 30." width="1280" height="1024" loading="lazy" />
  <figcaption>LEDGER (F8). Your orders, who gave them, and how far along they are. You always know what the next goal is.</figcaption>
</figure>

## Sixteen colours

The look is Amiga PAL hi-res: 640×512, interlaced, in sixteen colours. The
number isn't a mood choice. On the original chipset, hi-res gets you four
bitplanes, and four bitplanes is sixteen colours. HELIOBANE got thirty-two
because it lives in low-res. If you have read [my love letter to what people
still wring out of 1985
silicon](/blog/2026-02-02-ghosts-in-the-silicon-wringing-impossible-art-from-40-year-old-hardware),
you know I consider these limits a feature.

The palette has a law, and it fits in three sentences. **White is theirs.**
Harrow hulls, registry text, everything from before the war. **Cyan is ours.**
The Office's ships, stations and trajectories, and Earth's oceans. **Red is
what it costs.** Alarms, losses, radiation and the Roll. Red never decorates.
Everything else is grey, because everything else is the world.

Gradients are 4×4 ordered Bayer dither, and nothing else. The four
department heads are digitised portraits in greys plus one accent colour.
One of them, Lisk, who runs the Laboratory and reads the Harrow's notices as
law, has my face. I asked. It seemed only fair.

There is no music in space. You get room tone: the rain on the Yard, the hum
of a station, telemetry. Music plays on the title, on GROUND, on the act
cards, and when the Harrow move against the Office. You will learn to dread
that last one.

## How it got made

The design document is dated 26 September. Both itch pages went public on the
28th. It is built in Godot 4, and under the screens is a pure simulation that
runs headless. The test gate has a scripted Director play 24 seeded
campaigns to the year 2545, and every milestone has to hold in enough of
them. It is the least retro part of the game, and the part I'm proudest of.

Claude wrote the code and Codex reviewed it, read-only, over
[tincan](/blog/2026-07-03-introducing-tincan-two-cans-and-a-string-for-ai-agents).
Some changes needed five rounds of rechecks before Codex would pass them, and
one balance fix was rejected outright. I directed, played, and complained
that the notices sounded omniscient, which is why every notice in 0.9.1 is
now signed by a person who could actually know what it says.

And the trailer: the game films it itself. A script drives the game through
Act I, Godot's Movie Maker records it at 50 fps, teleprinter cards cut in
between, and the score is cut to the beats from two of the game's own
pieces. When the game changes, I re-shoot the trailer with one command.

A small aside for the Amiga crowd: a port to a real A1200 is on the bench,
written in C against the bare hardware, at 640×256 to spare your eyes the
interlace flicker. The first screens match the PC version pixel for pixel in
a cycle-exact emulator. No promises yet. But it would be rude not to try.

## Play it

- **[Mass Fraction on itch.io](https://coze.itch.io/mass-fraction)**: $6, for
  Windows, macOS (signed and notarised) and Linux.
- **[The free web demo](https://coze.itch.io/mass-fraction-demo)**: Act I in
  your browser, up to the start of Act II or the end of 2512.

It is version 0.9.1, a playtest build. The whole campaign plays from the
title screen to both endings, and it still has rough edges. If you play it,
keep short notes with the in-game date, for where you got stuck, text that
confused you, and whenever the Harrow felt unfair. I want all of it.

If this looks like your kind of game, [G-COPY](https://g-copy.gand.games/) is
another Amiga homage, free in your browser, and the rest of the shelf lives at
[gand.games](https://gand.games/). The [State of
Gand](/blog/2026-09-25-state-of-gand-september-2026) post explains why the
games moved out of the tools' house.

The Lid has been up there for three hundred and twenty-one years. Somebody
has to go first.
