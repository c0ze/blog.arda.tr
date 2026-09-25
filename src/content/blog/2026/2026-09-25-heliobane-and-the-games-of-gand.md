---
title: "The Heliobane trilogy, and the rest of gand.games"
date: "2026-09-25"
excerpt: "Gand's games now live at gand.games. A quick tour of the shelf, then a longer look at the Heliobane trilogy: a shmup, a metroidvania and a tactics game, set ten years apart, about a hive that eats stars and the people who have to live next to it."
tags: ["gamedev", "retro", "godot", "ai"]
keywords: "heliobane, farstrand, thawline, heliobane trilogy, gand games, gand.games, amiga shmup, metroidvania, into the breach, roguelite tactics, godot 4, umbrine, aurel, ninth light, commit!!!, studs up win ugly, aldith tarot roguelike, intersection 17, the sublime engine, g-copy"
description: "A tour of gand.games and the Heliobane trilogy: HELIOBANE (Amiga-style shmup), FARSTRAND (metroidvania) and THAWLINE (roguelite tactics), their shared lore and how they connect, plus short explainers for COMMIT!!!, Studs Up! Win Ugly, Aldith, Intersection 17, The Sublime Engine and G-COPY."
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

Two more aren't on the shelf yet, and they are most of this post. HELIOBANE
turned out not to be one game. It is the first third of a trilogy.

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
| The question | can one ship kill a sun? | who am I, and what was it all for? | do we feed it? |
| What you do with heat | burn it | freeze it | live with it |

Years count from the Lance: Year 0 is the year a pilot called Wren fires a
weapon into a star. All three share one look, the Amiga one: low resolution,
the same 32-colour master palette, tracker music, digitised speech. All three
are built in Godot 4, and the two sequels target the Steam Deck from day one.

The rest of this section spoils each game's starting point, which also means
it spoils bits of the endings before it. I have kept the big twists out.

### Ten thousand years before

The Umbrine has done this before. About ten thousand years ago it ate a sun
called **Ninth Light**, with its worlds and its people. It hollowed the star,
kept the shell, and stacked the eaten worlds inside it. The people of Ninth
Light left a beacon behind, and it says one thing: *"We fed it. Do not feed
it."*

A **Seed** thrown from Ninth Light crossed the dark to another star, **Aurel**,
and went to sleep in the fire.

### HELIOBANE (Year 0): burn it

Aurel is an old orange star with five inhabited planets and a thousand years of
mining, trade and small wars behind them, run by the **Concord of Aurel**, a
parliament of guild-houses. Nobody looked at the sun. Then **Project SOLACE**
drilled a siphon into it, and the thing asleep in its belly tasted refined
energy for the first time.

The Umbrine doesn't conquer, it grows. In ninety days it took the Tharsis
mining belt, the ocean moon Verdigris and the entire Concord battle fleet,
which it didn't destroy but *wore*, the way a hermit crab wears a shell.

At Solmarch Yards, one ship had spent eleven years under a tarp after
parliament cut its funding. **HB-0 "Heliobane"**: a gunship rated to fly inside
a star's corona and deliver exactly one weapon, the **Solar Lance**, a charge
that can collapse a star. Chief Engineer **Oda Venn** fuelled her, loaded the
Lance and held the dock doors open long enough for her to launch:

> "We built her to kill a star. We never thought we'd have to."

The pilot is **Ilse Varr**, callsign **Wren**: a salvage runner from the Tharsis
belt with two smuggling convictions and the best reflexes in the system.
Sarcastic, frightened, and very, very good. Her guns were never meant for a
war, so she strips better ones off the dead and buys the rest from **Old
Mott**, who flies a patched-up salvage tug called the **Magpie**, turns up
between stages whether you want him to or not, and calls her kiddo. He buys
**Aurum**, the gold-glass residue the Umbrine leaves behind, and sells guns he
*definitely* didn't steal from the Concord armoury.

HELIOBANE is itself built in three acts, fifteen stages, each ending in a
screen-filling **Herald**, the shepherd the Umbrine grows for every world it
takes:

- **Aurel, inward.** Tharsis Belt (Wren's home, already eaten), the ocean moon
  Verdigris, the dead Concord armada of the Hollow Fleet, the cracked forge
  world of Cinder Crown, and finally the inside of the star, where the
  **Hungering Heart** waits: the hive-queen, a cathedral of black glass around
  a sun-bright eye. Wren fires the Lance. Aurel begins a slow collapse into a
  white dwarf, about a century of it, time enough to evacuate. But the dying
  queen throws one last Seed clear.
- **The Wake, outward.** Wren chases the Seed through the cold outer system,
  past Cold Harbour to the Heliopause, where the light gives up. There the Seed
  takes a **strand**: a road of hive-flesh the Umbrine grew between stars.
  The Magpie can't keep up. *"My tug can't do that speed, kiddo. I'll catch
  up. Somehow."*
- **Umbra, down.** The strand ends at the hollow shell of Ninth Light, where the
  dark was born, and at the **First Mouth**. The Heliobane translates the
  beacon.

What Wren does at the First Mouth lights a **second sun** inside that shell,
and across the dark the Umbrine's roads go cold, one by one. That is where
the next game picks up.

[heliobane.gand.games](https://heliobane.gand.games/) has the trailer, and a
free demo is coming to Steam.

### FARSTRAND (Year 7): freeze it

Cold hive-flesh turns to glass, and a road of glass still carries a ship:
slower than a warm one, but it crosses from one star to the next in weeks.
Aurel has a century left, and nothing the Concord can build crosses the dark
inside a century. So in Year 2 the Concord votes, unanimously for once, to
evacuate by the strands.

Harbourmaster **Ilka Brask**'s yards at Cold Harbour build **rootrunners**,
small survey craft plated with the corona alloy Oda Venn designed for the
Heliobane. Seven surveys go out, each named after a surveying instrument.
Every beacon goes silent at the same place, a tangle of strands between stars
the Survey calls **the Knot**. After Survey Seven, the Concord stops sending
people.

**Hesper Lind** was the cartographer on Survey Seven. She was born on Verdigris,
the moon the Umbrine took in the war. Her craft, the *Plumbline*, came off its
strand wrong and crashed on **Halm**, a cold world around a red dwarf. She
wakes in a cocoon of glass in a forest of glass. Her left arm is gone. In its
place is an arm of black glass veined with gold, and it moves when she tells it
to. She calls it **the Graft**, after the section of the Survey manual about
grafting fruit trees.

The Graft moves heat, and that is the whole game. Umberflesh has three states:
**sunfed** (hot: it glows, grows and eats), **flesh** (warm: it digests) and
**glass** (cold: it keeps whatever it holds exactly as it was). Quench an enemy
into glass and stand on it. Overfeed it and it bursts. Thaw a wall, grow a
bridge, set it hard. Hesper has a survey drone called Bob, shaped like a plumb
bob, whose readout occasionally says `NO.`

Glass forgets nothing, and seven years of cold have left the strands full of
things the hive swallowed and never finished digesting. In a few places,
minds. Hesper calls them **the Worn**: the peoples the hive ate, awake in the
glass. They help her exactly as far as it keeps the strands cold, because cold
is the only reason they exist. One of them is **the Choir**, the people of
Ninth Light. They are still saying the same thing.

The antagonist is **Josef Kell**, commander of Survey One: first through, the
best the Concord had. He died on the strands, the hive grew him back, and he
chose to let it. His plan is not a stupid one. Cold strands are slow; warm
strands are fast. Sink a **Taproot** into the young sun Wren lit, warm every
road, and Aurel's people could be out in ten years instead of a century. The
Worn say it would wake the Umbrine. Kell's answer: *"They fed it and they died.
We'll feed it and we'll live."*

And Old Mott is waiting at the Knot when Hesper gets there. *"Took your time,
kiddo."* He won't say how he got there first.

The echoes are my favourite detail. Glass keeps sound as well as shape, and the
strands are all one piece of glass, so where the Heliobane and the Magpie
passed during the chase, their radio is still in it. Put a hand on a strand
and it plays back. And every survey wreck has the same torn recruitment poster
on its bulkhead: Wren's face, and FLY LIKE WREN. Mott, the first time he sees
one: *"She'd hate that poster, kiddo."*

Farstrand is in development. The first world, Halm, is playable in-house:
22 rooms from the cocoon to the strand's anchor. No public site yet.

### THAWLINE (Year 10): live with it

Hesper's map is what Farstrand is for: a **cold route** from Aurel to Ninth
Light's young sun that never touches a warm strand. Slow, safe, short enough.
Cold Harbour answers it with a fleet. Brask's yards scale the rootrunner up into
**arks** that carry a few thousand people each, and in Year 9 the first wave
leaves.

It comes down inside Ninth Light's shell, on the stacked dead planets of the
**Ossuary of Stars**, under the young sun, and founds a colony: **Venn's
Landing**, named after the engineer who held the doors. The problem is in the
title. The colony needs warmth to survive, and warmth wakes the hive.

Thawline plays like Into the Breach: small boards where every enemy shows its
move a turn ahead, so losing is a mistake you can see, never a dice roll. On
top of that is a base you build between fights, and when the hive raids the
Landing, the buildings you built are the board you defend. A **Wake** meter
tracks how awake the hive is. Every warm tile you leave burning pushes it up.

Each run is one wave of arks, and three peoples fight over what temperature the
board should be:

- **The Yard**: Brask's Cold Harbour crews in rigs plated with Venn alloy. They
  don't care about heat. They hold.
- **The Grafted**: colonists who took Grafts like Hesper's. They tame the
  hive's war-forms and farm its flesh. They want it warm.
- **The Worn**: the Choir and the others, in vessels of cold glass. They want
  everything frozen.

The regions you fight through are the ones Wren flew ten years earlier: the
Ossuary, Dead Light, the Vein, Choirnest. Hesper is there too. When a Landing
falls, she wakes in a cocoon, remembering, in time for the next wave. And some
old acquaintances from Farstrand are still around, making reasonable offers.

Thawline is at the proof-of-concept stage: three boards and the Yard, playable
with a mouse or a pad. No site yet either.

### How the three connect

Each game plants something the next one pays off:

- **The hull was rated for the corona.** It is the premise of the first game,
  and it matters a lot more than it looks like it should in the other two.
- **Mott always arrives first.** He loses the chase at the Heliopause and is
  somehow waiting at the far end. In Farstrand you find out how. He has used a
  cold hollow that runs down the middle of every strand since Year 0, and he
  still won't say how he found it.
- **"We fed it. Do not feed it."** A dead people's warning in HELIOBANE. Kell's
  whole argument in FARSTRAND. The central decision of THAWLINE, where feeding
  it is also how you keep your colonists warm.
- **The second sun.** HELIOBANE lights it. FARSTRAND is a fight over whether to
  drink from it. THAWLINE is set underneath it.
- **Oda Venn.** She builds the ship and dies holding the doors. Her alloy
  plates every rootrunner in FARSTRAND, and the colony in THAWLINE carries her
  name.
- **The Choir.** The people of Ninth Light. In HELIOBANE they are a warning in
  a beacon, in FARSTRAND a voice you hear at the Knot and meet at Ninth Light,
  and in THAWLINE a faction you can play, home at last.

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

Two more are in the lab, **Orbound** and **Hexwarren**, with no site yet. They
get one line each until they earn more.

## One consistent bad idea

gand.games describes the studio as "various genres, one consistent bad idea:
do all of it ourselves." Seven games, one person, zero meetings. The career sim,
the pub brawler, the tarot deck, the traffic post, the Ottoman cipher and the
disk copier each get their turn.

This week, though, it is the trilogy: a pilot, a cartographer and a colony,
ten years of one very bad idea (feeding a star to a hive), and a trader who
calls all of them kiddo. HELIOBANE's demo is coming to Steam first, and
[heliobane.gand.games](https://heliobane.gand.games/) has the rest. The other
two will get their own sites when they have earned them.

Right. Let's go kill a sun.
