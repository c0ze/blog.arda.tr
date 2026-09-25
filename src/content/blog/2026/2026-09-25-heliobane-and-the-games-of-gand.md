---
title: "HELIOBANE, a sun-killer in three acts, and the rest of gand.games"
date: "2026-09-25"
excerpt: "Gand's games now live at gand.games. A quick tour of the shelf, then a longer look at HELIOBANE: an Amiga-style shooter told as a trilogy of worlds, about a salvage runner sent to kill a star, and what crawls out when she does."
tags: ["gamedev", "retro", "godot", "ai"]
keywords: "heliobane, gand games, gand.games, amiga shmup, vertical shoot em up, godot 4, tyrian, xenon 2, umbrine, aurel, commit!!!, studs up win ugly, aldith tarot roguelike, intersection 17, the sublime engine, g-copy, x-copy"
description: "A tour of gand.games: HELIOBANE's three worlds and lore (Aurel, The Wake, Umbra), plus short explainers for COMMIT!!!, Studs Up! Win Ugly, Aldith, Intersection 17, The Sublime Engine and G-COPY."
author: "Arda Karaduman"
image: "/images/og/2026-09-25-heliobane-and-the-games-of-gand.png"
draft: false
---

In [the State of Gand post](/blog/2026-09-25-state-of-gand-september-2026)
I said games were moving to their own corner, and promised more "in a later
update". It is later.

[gand.games](https://gand.games/) is the new home. Its manifesto fits on a
napkin: no ads, no tracking cookies, one price paid once, and games that get
patched instead of abandoned. Its tagline is more honest: *small games with
unreasonable ambition*. There are seven of them on the shelf now: one out, one
a few weeks away, one free in your browser, and the rest in development.

Most of this post is about one of them, because it has a sun in it and I have
been thinking about nothing else.

## HELIOBANE

[HELIOBANE](https://heliobane.gand.games/) is a vertical shoot 'em up that
looks and sounds like a 1993 Amiga game: 320×256 pixels, 32 colours, tracker
music and bit-crushed digitised speech. Every sprite in the game is drawn from
the same 32-colour palette. If you have read me going on about [what people
still wring out of 1985 silicon](/blog/2026-02-02-ghosts-in-the-silicon-wringing-impossible-art-from-40-year-old-hardware),
you know where this comes from. The lineage is printed right on the fact
sheet: Tyrian 2000, Xenon 2 Megablast, Project-X, Apidya, Battle Squadron.

It only *looks* like 1993, though. Underneath it is Godot 4, a locked 60 frames
a second with no slowdown, a 4×4 pixel hitbox, instant restarts, remappable
keys and proper gamepad support. The nostalgia is in the pixels, not in the
input lag.

It is one game, but it is built as a trilogy: three worlds of five stages each,
each with its own direction of travel. Inward, outward, down.

### The setup

Aurel is an old orange star with five inhabited planets and a thousand years
of mining, trade and small wars behind them. Nobody looked at the sun. Then
**Project SOLACE** drilled a siphon into it, and something in the star's belly
tasted refined energy for the first time.

That something is **the Umbrine**: a crystalline, half-organic hive that eats
fusion. It had been asleep in the fire for ten thousand years, and it woke up
hungry. The Umbrine doesn't conquer, it grows. In ninety days it took the
Tharsis mining belt, the ocean moon Verdigris and the entire Concord battle
fleet, which it didn't destroy but *wore*, the way a hermit crab wears a shell.

At Solmarch Yards, one ship had spent eleven years under a tarp. **HB-0**, a
gunship hardened to fly inside a star's corona and deliver exactly one weapon,
the Solar Lance. The ship that kills suns: Heliobane. Chief Engineer **Oda
Venn** fuelled her, loaded the Lance, and held the dock doors open long enough
for her to launch. Her final log is the line the whole game hangs on:

> "We built her to kill a star. We never thought we'd have to."

The pilot is **Ilse Varr**, callsign **Wren**: a salvage runner from the Tharsis
belt with two smuggling convictions and the best reflexes in the system.
Sarcastic, frightened, and very, very good. Her reply in the trailer, "Right.
Let's go kill a sun," is about as much ceremony as she can manage.

Heliobane was built to deliver a Lance, not fight a war, so her guns are an
afterthought. Wren strips better ones off the dead, and buys the rest from
**Old Mott**, who flies a patched-up salvage tug called the **Magpie**, turns up
between stages whether you want him to or not, and calls her kiddo. He buys
**Aurum**, the gold-glass residue the Umbrine leaves behind when it dies, and
he sells guns he *definitely* didn't steal from the Concord armoury.

### Act one: Aurel, inward to the heart of a star

The first world is a straight line down the gravity well, through everything
the Umbrine has already eaten:

1. **Tharsis Belt**: rust asteroids and mining scaffolds. Wren's home turf,
   already gone. Its Herald, **the Quarry Maw**, is a mining platform turned
   into a mouth.
2. **Verdigris**: the green ocean moon. **Leviathan Choir** is a sea-serpent of
   stitched drones that sings as it dies.
3. **The Hollow Fleet**: the dead Concord armada. **Admiral Husk** is the
   flagship's bridge, still broadcasting orders in the admiral's voice.
4. **Cinder Crown**: a forge world cracked open, and **the Siphon Engine**, the
   SOLACE drill itself, now a living organ pumping sunlight.
5. **Aurel's Corona**: the inside of the star, where **the Hungering Heart**
   waits: the hive-queen, a cathedral of black glass around a sun-bright eye.

Every stage ends in a Herald, because the Umbrine grows one to shepherd each
world it takes. Look at the order: the Umbrine's first victims on the way in,
and the machine that woke it on the way to the core. The act is a tour of
the damage, played backwards from the crime scene to the cause.

### Act two: The Wake, outward after the Seed

Killing a star's heart should be the end credits. It isn't, because something
gets out of the core: **the Seed**. I am not going to spoil what it is here.

So the second act turns around and runs outward, chasing it through the cold
outer system: **Ashfall Drift**, **Halvard's Rings**, **the Stormglass**,
**Cold Harbour** and finally **the Heliopause**, the edge where Aurel's light
gives up.

This is where the game changes its rules, not just its enemies. The Wake is
cold and dark. You find enemies by the light on their rims, your flares double
as lamps, storm winds shove the ship sideways, and the Heliopause scrolls at
three times normal speed. Waiting out there are things like the Ice Shepherd,
the Storm Choir and the Stalwart. You spent act one flying into the brightest
place in the system. Act two takes the light away.

### Act three: Umbra, where the dark was born

Then down, to where it all started. **Umbra** is a dead star, eaten hollow,
which rather suggests Aurel wasn't the Umbrine's first meal. The stages are
**Dead Light**, **the Vein**, **the Ossuary of Stars**, **Choirnest** and **the
First Mouth**.

This is the strangest of the three. The walls drink your beams and grow. The
Vein is an artery that pulses in time with the music. The Ossuary is a
graveyard of worlds with two roads through it, so the route branches. At the
bottom is the First Mouth, the final Herald.

### How the three connect

Read the three names in a row and the plot is already there: Helio-, the
Heliopause, Umbra. The sun, the edge of the sun, and the shadow it came from.
Inward, outward, down.

A couple of threads run through all fifteen stages, and I like them more every
time I look:

- **Mouths.** The very first Herald is a mining platform turned into a mouth.
  The very last one is the First Mouth. The Umbrine is an appetite, and the
  game opens and closes on one.
- **Choirs.** Leviathan Choir sings as it dies in act one, the Storm Choir
  waits in the Stormglass in act two, and in act three you fly into Choirnest
  to meet something called the Cantor. The song gets closer to its source the
  deeper you go.
- **The economy is the lore.** Aurum is what the Umbrine leaves behind, Mott
  buys it, and his guns come out of the armoury of the fleet the Umbrine is
  wearing. You are funding the war with the enemy's own remains.

### Lore you play, not read

The combat system is the same story in mechanical form. The Umbrine grows its
war-forms out of different stuff, so the three damage types matter:

- **Glass** shrugs off bullets and cracks under beams.
- **Sun-fed flesh** drinks beams and fires faster for it.
- **Concord plating**, the stolen fleet, barely notices anything but blast.

Kinetic, beam and blast each have their own guns (eleven in all, five levels
each): two front guns on a rack you swap mid-fight, a rear gun, and two
sidekick pods. Whatever you buy on the Magpie decides how the next stage goes.
Dying costs a single weapon one level, never the whole build.

Then there is heat. Let a bullet pass within 10 pixels of your cockpit without
touching it and you gain a point. Kill something with the damage type it is
weak to and you gain three. At 50 heat you can fire **the Breaker**: a
white-gold column from your nose to the top of the screen. It barely does
damage. What it does is *Breach* everything it touches for six seconds. Hull
plating comes off, sealed cores open, and whatever a thing is made of, it
counts as flesh until the timer runs out.

A ship built to kill a star, reduced to flying close enough to the bullets to
steal their heat. Wren would appreciate that.

### How it got made

HELIOBANE started on 24 September, yesterday, from a one-paragraph brief: a
retro shoot 'em up like the Amiga classics, with Tyrian 2000 and Xenon 2 named
outright. The name, the lore and the design document were all written that
morning.

AI generated some of the game's assets: artwork, voice lines, sound effects,
in-game text and translations. The artwork was edited and fitted to the
32-colour palette. The soundtrack comes from a custom tracker built for
agentic work, written by a model trained on a curated set of public-domain MOD
music; if that sounds familiar, [cozy-tracker](/blog/2026-07-12-introducing-cozy-tracker)
was where I first tried this kind of machine-written tracker music. The whole thing
ships in English, Turkish and Japanese, with voice in all three.

It is in development. The **free demo is coming to Steam** with the opening
stages of World 1, and there is a [press kit](https://heliobane.gand.games/public/press-kit/doc.html)
for anyone who wants the screenshots at their native 320×256.

## The rest of the shelf

Shorter entries, because otherwise this post would need its own trilogy.

**[COMMIT!!!](https://commit.gand.tr/)**: a software-career sim where the legacy
monolith is the final boss. Take the job, ship the commit, dodge the debt, and
try to make rent before the anxiety makes you. Out now on
[Steam](https://store.steampowered.com/app/4994630/) and
[Google Play](https://play.google.com/store/apps/details?id=tr.gand.commit) for
$9.99, in Godot, in 13 languages. I covered the launch [in the last status
update](/blog/2026-09-10-status-update-tincan-v2-reliquary-commit-release), and
its phosphor green has already escaped into [an Omarchy theme](/blog/2026-08-23-ten-omarchy-themes).

**[Studs Up! Win Ugly](https://studs-up.gand.games/)**: a five-a-side football
brawler. Recruit seven misfits, drag The Mincers through a ten-match pub-league
season, and spend your opponents' teeth on the club. Goals win matches, teeth
pay the bills, the referee has his price and the injuries come home with you.
Built in LÖVE2D, out **16 October** on Windows and Linux, and you can
[wishlist it on Steam](https://store.steampowered.com/app/5281580/) now. The
last time I wrote about football it was [a Süper Lig analytics
site](/blog/2026-04-18-making-a-football-analytics-site). This has fewer
spreadsheets and more broken noses.

**[Aldith](https://aldith.gand.games/)**: a tarot roguelike. Aldith was the
Reader of the Wheel: a Lord's season ended when she laid the cards and told him
so. One winter the eight Lords broke her deck across their halls so no ending would
ever be read again, and put her out of the gate with forty pips. She comes
back old, walks the year from Yule to Samhain, and reads for each Lord on his
own terms: the Frozen Lord turns every Cup, the Child hears nothing above five.
Tell him true and his relic trump comes back to her hand. Twenty-four trials,
twenty-two trumps, one deck to make whole.

**[Intersection 17](https://intersection17.gand.games/)**: a traffic-post
bureaucracy sim. You are Sena Ri, marshal of the seventeenth crossing in the
fictional Sunward People's Republic of Soryang. Direct each car where it
signals, salute the pennants without fail, fine the defective, or wave them
through and pocket the difference. Then the second shift: rice, coal, medicine,
and a curfew the alley doesn't keep. Thirty days, several endings, one
permanent record.

**[The Sublime Engine](https://sublimeengine.gand.games/)**: an Ottoman
steampunk point-and-click, set in an alternate 1930s where the Empire never
fell. It reformed, industrialised and won the Great War. You are a Telegraph &
Antiquities clerk handed the wrong parcel at Sirkeci Station, and inside is a
cipher that indexes a machine said to predict revolutions. The bureaucracy is
the puzzle: the stamp needs the form, the form needs the queue number, the
queue number needs the stamp. There is always one way in. Coming in English
and Turkish.

**[G-COPY](https://g-copy.gand.games/)**: a small business sim inside a
classic Amiga disk copier, made as a homage to X-Copy. You start with one
drive, 512 KB of RAM, $40 and three blank disks, buy masters of imaginary games
at the Saturday disk market, and beat copy protection with the right mode and
a well-timed retry. It is free and runs in your browser right now. Anyone who
has spent time around [the retro scene](/blog/2013-05-26-enter-retrojen) will
recognise that copier screen instantly.

Two more are in the lab, **Orbound** and **Hexwarren**, with no site yet. They
get one line each until they earn more.

## One consistent bad idea

gand.games describes the studio as "various genres, one consistent bad idea:
do all of it ourselves." Seven games, one person, zero meetings. The career sim,
the pub brawler, the tarot deck, the traffic post, the Ottoman cipher and the
disk copier each get their turn.

This week, though, it is HELIOBANE: a salvage runner, a stolen gun rack, a
trader who calls her kiddo and a sun that needs killing. The demo is coming to
Steam, and [heliobane.gand.games](https://heliobane.gand.games/) has the rest.

Right. Let's go kill a sun.
