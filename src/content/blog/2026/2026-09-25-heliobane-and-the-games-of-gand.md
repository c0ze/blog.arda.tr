---
title: "The Heliobane trilogy, and the rest of gand.games"
date: "2026-09-25"
excerpt: "Gand's games now live at gand.games. A quick tour of the shelf, then a longer look at the Heliobane trilogy: a shmup, a metroidvania and a tactics game, set ten years apart, about a hive that eats stars and the people who have to live next to it."
tags: ["gamedev", "retro", "godot", "ai"]
keywords: "heliobane, farstrand, thawline, heliobane trilogy, gand games, gand.games, amiga shmup, metroidvania, into the breach, roguelite tactics, godot 4, umbrine, aurel, commit!!!, studs up win ugly, aldith tarot roguelike, intersection 17, the sublime engine, g-copy, moonwyrm, pharmakon"
description: "A tour of gand.games and the Heliobane trilogy: HELIOBANE (Amiga-style shmup), FARSTRAND (metroidvania) and THAWLINE (roguelite tactics), their shared lore and how they connect, plus short explainers for COMMIT!!!, Studs Up! Win Ugly, Aldith, Intersection 17, The Sublime Engine, G-COPY, Moonwyrm and Pharmakon."
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
unreasonable ambition*. There are seven games on the shelf: one out, one a few
weeks away, one free in your browser, and the rest in development.

A few more aren't on the shelf yet, and two of them are most of this post.
HELIOBANE turned out not to be one game. It is the first third of a trilogy.

## The Heliobane trilogy

Three games, one universe, three genres, and one enemy: **the Umbrine**, a
crystalline, half-organic hive that eats stars.

| | HELIOBANE | FARSTRAND | THAWLINE |
|---|---|---|---|
| Genre | vertical shmup | metroidvania | roguelite tactics with base building |
| In the spirit of | Tyrian, Xenon 2 | Axiom Verge | Into the Breach |
| Hero | Wren, a pilot | Hesper Lind, a cartographer | a wave of colonists |
| Scale | one ship | one person | one people |
| When | Year 0 | Year 7 | Year 10 |
| What you do with heat | burn it | freeze it | live with it |

Years count from HELIOBANE. All three share one look, the Amiga one: low
resolution, the same 32-colour master palette, tracker music, digitised
speech. All three are built in Godot 4, and the two sequels target the Steam
Deck from day one.

No spoilers below. Just enough to show the shape of it.

### HELIOBANE (Year 0): burn it

Aurel is an old orange star with five inhabited planets and a thousand years of
mining, trade and small wars behind them. Nobody looked at the sun. Then
**Project SOLACE** drilled a siphon into it, and something asleep in its belly
tasted refined energy for the first time.

That something is the Umbrine. It doesn't conquer, it grows. In ninety days it
took the Tharsis mining belt, the ocean moon Verdigris and the entire Concord
battle fleet, which it didn't destroy but *wore*, the way a hermit crab wears a
shell.

At Solmarch Yards, one ship had spent eleven years under a tarp. **HB-0
"Heliobane"**: a gunship rated to fly inside a star's corona and deliver exactly
one weapon, the **Solar Lance**. Chief Engineer **Oda Venn** fuelled her,
loaded the Lance and held the dock doors open long enough for her to launch:

> "We built her to kill a star. We never thought we'd have to."

The pilot is **Ilse Varr**, callsign **Wren**: a salvage runner from the Tharsis
belt with two smuggling convictions and the best reflexes in the system.
Sarcastic, frightened, and very, very good. Her guns were never meant for a
war, so she strips better ones off the dead and buys the rest from **Old
Mott**, who flies a patched-up salvage tug called the **Magpie**, turns up
between stages whether you want him to or not, and calls her kiddo. He buys
**Aurum**, the gold-glass residue the Umbrine leaves behind, and sells guns he
*definitely* didn't steal from the Concord armoury.

The game runs in three acts of five stages, each stage ending in a
screen-filling **Herald**, the shepherd the Umbrine grows for every world it
takes. **Aurel** goes inward, through everything the hive has already eaten, to
the heart of the star. **The Wake** goes outward, after something that gets
away, into the cold and the dark. **Umbra** goes down, to where it all
started. I will leave it there.

Here is the trailer:

<video controls playsinline preload="none" crossorigin="anonymous" width="1920" height="1080" poster="https://heliobane.gand.games/public/trailer-poster.jpg" aria-label="HELIOBANE trailer">
  <source src="https://heliobane.gand.games/public/trailer.mp4" type="video/mp4" />
  <track kind="captions" src="https://heliobane.gand.games/public/trailer.en.vtt" srclang="en" label="English" />
  <a href="https://heliobane.gand.games/public/trailer.mp4">HELIOBANE trailer (MP4)</a>
</video>

[heliobane.gand.games](https://heliobane.gand.games/) has the rest, and a free
demo is coming to Steam.

### FARSTRAND (Year 7): freeze it

Seven years on, Aurel's people need a way out, and the only roads between the
stars are ones the Umbrine grew. The Concord calls them **strands**, and sends
survey crews down them. The crews stop reporting back.

**Hesper Lind** is the cartographer on Survey Seven. Her ship comes off its
strand wrong and crashes on **Halm**, a cold world around a red dwarf. She
wakes in a cocoon of glass in a forest of glass. Her left arm is gone. In its
place is an arm of black glass veined with gold, and it moves when she tells it
to. She calls it **the Graft**, after the section of the Survey manual about
grafting fruit trees.

The Graft moves heat, and that is the whole game. The hive's flesh has three
states: **sunfed** (hot: it glows, grows and eats), **flesh** (warm: it
digests) and **glass** (cold: it keeps whatever it holds exactly as it was).
Freeze an enemy and stand on it. Overfeed it and it bursts. Thaw a wall, grow a
bridge, set it hard. Hesper also has a survey drone called Bob, shaped like a
plumb bob, whose readout occasionally says `NO.`

Glass forgets nothing, and the worlds on the strands are full of things the
hive swallowed and never finished digesting. Some of them still talk. Someone
from an earlier survey has a plan, and it is not a stupid one. And a certain
trader is already waiting when she gets where she is going. *"Took your time,
kiddo."* He won't say how he got there first.

My favourite detail: every survey wreck has the same torn recruitment poster on
its bulkhead. Wren's face, and FLY LIKE WREN. Mott, the first time he sees one:
*"She'd hate that poster, kiddo."*

Farstrand is in development. The first world, Halm, is playable in-house. No
public site yet.

### THAWLINE (Year 10): live with it

Three years later, the colonists go. A wave of arks comes down inside the shell
of a dead star, under a young sun, and founds a colony called **Venn's
Landing**. The problem is in the title. The colony needs warmth to survive, and
warmth wakes the hive.

Thawline plays like Into the Breach: small boards where every enemy shows its
move a turn ahead, so losing is a mistake you can see, never a dice roll. On
top of that is a base you build between fights, and when the hive raids the
Landing, the buildings you built are the board you defend. A **Wake** meter
tracks how awake the hive is, and every warm tile you leave burning pushes it
up.

Each run is one wave of arks, and three peoples fight over what temperature the
board should be:

- **The Yard**, dockworkers in armoured rigs. They don't care about heat. They
  hold.
- **The Grafted**, colonists with arms like Hesper's. They tame the hive and
  farm it. They want it warm.
- **The Worn**, who live in cold glass. They want everything frozen.

Thawline is at the proof-of-concept stage: three boards and the Yard, playable
with a mouse or a pad. No site yet either.

### How the three connect

Each game plants something the next one pays off. Without giving any of it
away:

- A ship's hull rating that matters more than it has any right to.
- A trader who always gets there first.
- A warning nobody wants to hear, left by people who didn't listen to it
  either.
- An engineer whose name keeps turning up after she is gone.
- A few voices that carry across all three games, if you know where to listen.

Put together, the trilogy is one idea tried three ways. HELIOBANE burns the
problem. FARSTRAND freezes it. THAWLINE has to live next to it. The scale grows
at every step, from one ship to one person to one people, and the question
shifts from *can we kill it* to *what do we owe it*.

### How it got made

Fast, is the honest answer. HELIOBANE started on 24 September, yesterday, from
a one-paragraph brief: a retro shoot 'em up like the Amiga classics, Tyrian
2000 and Xenon 2 named outright. The name, the lore and the design document
were written that morning. Farstrand's brief was one paragraph too: same
universe, different story, across several planets, should feel like Axiom
Verge, Steam Deck from the start.

Thawline came from a question. With two games sharing a universe, I asked
Claude what genre would make a third one fit. It suggested a colony survival
builder, or Into the Breach-style tactics as a runner-up. I leaned towards the
tactics, but not just fighting the hive: building a base, taming and farming
the hive, and a third, unknown faction, something like StarCraft's three
races, only retro and small. The Worn were already sitting in Farstrand's lore,
and they were perfect for it.

AI generated some of HELIOBANE's assets: artwork, voice lines, sound effects,
in-game text and translations. The artwork was edited and fitted to the
32-colour palette. The soundtrack comes from a custom tracker built for agentic
work, written by a model trained on a curated set of public-domain MOD music;
if that sounds familiar, [cozy-tracker](/blog/2026-07-12-introducing-cozy-tracker)
was where I first tried this kind of machine-written tracker music. The look
itself comes from somewhere older: if you have read me going on about [what
people still wring out of 1985 silicon](/blog/2026-02-02-ghosts-in-the-silicon-wringing-impossible-art-from-40-year-old-hardware),
you know why it had to be 32 colours.

## The rest of the shelf

Shorter entries, because the trilogy already took most of the room.

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

## Not on the shelf yet

Two more are further along than their lack of a website suggests.

**Moonwyrm**: turn-based dragon-keeping strategy with short, lethal, real-time
arena fights, a deliberate cross of two Amiga classics from 1990 and 1991. You
are a Keeper in a tower at the edge of the Pale, a land lit by a moon that is
slowly going dark. In your vault sit the eggs of the Moonwyrm, the mother of
every dragon, and every egg is a life you spend one of two ways: hatch it into
a Moonsworn, a scaled half-human soldier you send out to loot, conquer and die
for you, or raise it as a dragon, bred for its bloodline and milked for the
breath that fuels your alchemy. Three rival Keepers want the same thing you do:
breed an Heir of all four bloodlines and walk it through the Moongate under a
full moon before the moon goes out. A run takes about an hour, and it can
already be won and lost.

**Pharmakon**: run a living apothecary where every patient is a puzzle, every
herb changes with how you prepare it, and the back room slowly turns medicine
into alchemy. People come in with complaints, and "something for a headache"
is an opening statement, not an order ticket: you ask, examine, decide what is
actually wrong, then grow, cut, grind, steep or distil the answer, and find out
later whether it worked. The plants are named after real herbs; every effect in
the game is fiction. It is hand-drawn and playable start to finish, as a
fortnight or a full working month.

## One consistent bad idea

gand.games describes the studio as "various genres, one consistent bad idea:
do all of it ourselves." One person, zero meetings. The career sim, the pub
brawler, the tarot deck, the traffic post, the Ottoman cipher, the disk copier,
the dragon tower and the apothecary each get their turn.

This week, though, it is the trilogy: a pilot, a cartographer and a colony,
ten years of living next door to a hive that eats stars, and a trader who
calls everyone kiddo. HELIOBANE's demo is coming to Steam first, and
[heliobane.gand.games](https://heliobane.gand.games/) has the rest. The other
two will get their own sites when they have earned them.

Right. Let's go kill a sun.
