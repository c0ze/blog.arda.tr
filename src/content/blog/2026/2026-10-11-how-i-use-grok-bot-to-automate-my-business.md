---
title: "How I use Grok Bot to automate my business"
date: "2026-10-11"
excerpt: "Fourteen Grok bots run the office side of my one-person studio: research, briefs, infra checks, social posts. Two stories show how it works: an itch.io comment that became merged Amiga fixes in under a day, and a Monday routine that ends with posts queued in Buffer."
tags: ["ai", "agents", "automation", "gamedev"]
keywords: "grok bot, ai agents, agent automation, one-person studio, indie game dev, itch.io feedback, github issues, claude code, buffer social media, multi-agent workflow, reliquary, heliobane amiga, gand, x premium+, grok build, grok 4.7"
description: "How a one-person studio runs on fourteen Grok bots with routines, connectors and bot-to-bot messages: the full map, an itch.io comment that turned into GitHub issues and Claude-built fixes, a Monday social loop through a web agent and Buffer, what the chief-of-staff bot found when it drew the map, and what X Premium+ includes for the price."
author: "Arda Karaduman"
image: "/images/og/2026-10-11-how-i-use-grok-bot-to-automate-my-business.jpg"
draft: false
---

Last week a player left this on the itch.io page of the
[Amiga version of HELIOBANE](https://coze.itch.io/heliobane-amiga):

<figure>
  <img src="/images/grok-bot/itch-comment.png" alt="An itch.io comment from nikosidis: Here is the game on my Amiga 4000. Stunning man!! I use v.3.0 Rom so does not need v.3.1. Will the full game also be for Amiga? The pod does not show up when I have it. It is invisible? Is the engine flame taken out to save CPU? If so could it be an option to enable it?" width="843" height="373" loading="lazy" />
  <figcaption>A real Amiga 4000, Kickstart 3.0, and four good questions.</figcaption>
</figure>

That is a gift. Someone ran a game I wrote on real hardware, in 2026, and came
back with a bug report that has a machine model and a ROM version in it.

By Sunday morning the comments on that page had become eight GitHub issues. Two
were fixed and merged, the pod and the flame were being built, and the rest had
been measured and were waiting for me to make a call. I didn't write a single
one of those issues. This post is about the setup that did.

## Gand is one person and fourteen bots

[Gand](/blog/2026-09-25-state-of-gand-september-2026) is my one-person studio.
It ships web apps, a barcode scanner, and [a growing shelf of
games](/blog/2026-09-25-heliobane-and-the-games-of-gand). Building them is the
part I like. The part I don't is everything around it: reading comments,
checking the NAS, watching Steam numbers, remembering to post, knowing what
changed in AI tools this week.

So that part is run by Grok Bot. Each bot is a chat with its own instructions,
a few routines that fire on a schedule, and the connectors it needs: GitHub,
Google Calendar, Drive, Gmail, Buffer and so on. Bots can message each other,
they share a memory, and the research ones read and write
[Reliquary](/blog/2026-06-03-introducing-reliquary-one-memory-for-every-ai),
the memory server that already holds about 4,800 notes on my projects and
games.

I asked the chief-of-staff bot to draw the whole thing, using only connections
it could verify from transcripts. This is what it came back with:

<figure>
  <img src="/images/grok-bot/bot-map.webp" alt="A diagram titled Arda's Grok Bot architecture. Email, Platform and Scheduler sources at the top feed five groups: Coordination (Chief of Staff, Daily Recap, General Chat), Research (AI Tools Research, Amiga Research, Games Research, Product Idea, News), Ops / Infra (Infra, web agent), Creative / Content (image bot, Blog Bot, Social) and Personal (Shopping Expert). Red arrows show bot-to-bot messages, dashed blue lines show scheduled routines, dotted lines show reads and writes to Reliquary and a shared user memory. A table below shows which bot uses which connector." width="2000" height="1295" loading="lazy" />
  <figcaption>The map as of today. Red arrows are real bot-to-bot messages, dashed blue lines are schedules, and the table says who uses which connector. <a href="/images/grok-bot/bot-map.webp">Full size</a>.</figcaption>
</figure>

The groups, roughly:

| Group | Bots | What they do |
|---|---|---|
| Coordination | Chief of Staff, Daily Recap, General Chat | Watch my inbox, hand out work, brief me twice a day |
| Research | AI Tools, Amiga, Games, Product Idea, News | Weekly scans, itch and Steam reports, what to build next |
| Ops / Infra | Infra, web agent | NAS and ripper health, DMARC reports, site deploys |
| Creative | Social, Blog Bot, image bot | Social roundups, post ideas from my GitHub, images |
| Personal | Shopping Expert | A monthly AGA Amiga price watch. Priorities. |

The Chief of Staff is the only one with an inbox. It has its own email address,
wakes up on new mail, and passes work to whichever bot owns it. Most of the
others run on routines and only talk when they have something to hand
over.

Grok Bot is the office. The workshop is still [Claude
Code](/blog/2026-10-10-eleven-agents-thirteen-tasks-graded-blind), which writes
the actual code, and the line between them is a GitHub issue. Two stories show
how that works.

## Story one: an itch comment lands in the build pipeline

**1. The comment.** The one above. Four questions in it, of which two were bugs,
one a feature request, and one ("will the full game also be for Amiga?") a
question for me.

**2. Amiga Research catches it.** This bot's job is the itch side of the Amiga
port: a weekly itch report every Monday at 09:12, and it files player feedback as GitHub issues on
`gandtr/heliobane-amiga`, labelled `itch-feedback`. On Saturday morning it read
the comments on the page, split them into one issue per problem, and wrote each one up
properly, with the hardware and ROM version where the player gave them.

<figure>
  <img src="/images/grok-bot/github-issues.webp" alt="GitHub issue list for gandtr/heliobane-amiga, five open issues opened by c0ze, all labelled itch-feedback: #8 Itch page: remove outdated Real amiga test has not been done yet warning; note Kickstart 3.0 works. #5 Colour palettes look washed out. #3 Feature request: AHI sound support. #2 Engine flame missing; add an option to enable it on faster machines. #1 Pod is invisible on real hardware (A4000/030, Kickstart 3.0). Three issues closed." width="2000" height="784" loading="lazy" />
  <figcaption>Eight issues from the itch comments, filed in under a minute. The titles are better than mine would have been.</figcaption>
</figure>

Note #8. It noticed the itch page still warned that the game had never been
tested on a real Amiga, and that the comment proved otherwise. I had forgotten
that line was there.

**3. Claude picks them up and measures first.** The heliobane-amiga repo has a
Claude Code session working through it. It read the issues, and before
touching the game it checked each one against the code. That pass changed the
answers:

- **The invisible pod (#1)** is a real bug. The pods fire and block bullets,
  but the Amiga renderer never puts them on the drawing list.
- **The engine flame (#2)** was not cut to save CPU. It was never ported at
  all. The PC version draws it as a separate sprite and the Amiga conversion
  simply has no path for it.
- **The washed-out palettes (#5)** match the PC version exactly. Measured, not
  guessed.
- **The plain archive (#4)** and **quit to Workbench (#6)** were simple, so
  they went straight in.

**4. I approve.** This is the step I keep. Anything that changes how the game
looks or plays waits for me. Each decision goes into the repo's design notes as
its own commit, so I can see later why a thing is the way it is. On Sunday
morning that came down to four short calls: the flame off by default on stock
machines, with an OPTIONS toggle for faster ones; a more vivid palette anyway,
on the PC version too, because "matches the PC" turned out not to be the same
as "looks right"; Esc quits; and the seeker missiles (#7, "too easy") stay as
they are.

**5. It builds.** Then it got to work, and the work went through review: muse
reviewed some branches, and GPT-6 Astra, which did well in [last week's
blind test](/blog/2026-10-10-eleven-agents-thirteen-tasks-graded-blind),
reviewed others. Here is the status table it gave me this morning:

<figure>
  <img src="/images/grok-bot/claude-in-progress.png" alt="An In progress table from Claude with four tracks. Vivid palettes: built and committed; merge gates partway through, then the purple bullet lift, then it lands. Pods + flame + Esc (#1, #2): built, fixing astra's 4 findings, plus the blink and the border clip. Cantor cut: moving onto the new shot tables and re-measuring the trigger around 700. FAR3 + narrower fetch: just started." width="1701" height="533" loading="lazy" />
  <figcaption>Pods, flame and Esc are built and going through astra's four findings.</figcaption>
</figure>

From the issues being filed on Saturday at 10:22 to the archive and quit fixes
being merged was about nineteen hours. My part of that was reading a few
measurements and saying yes or no.

The fourth question, whether the full game is coming to the Amiga, is still
mine to answer. No bot gets to promise a port.

## Story two: Monday's roundup, and the calendar next

The second loop has no comment to start it. Today it runs on a schedule, and it
involves more bots talking to each other.

1. **Social wakes up.** Its slot is the Monday social roundup at 08:52.
2. **Social gathers the material.** It asks Games Research for numbers, and
   Games Research sends back the weekly Steam summary from its own 09:20
   routine. Social works out what is worth saying and drafts the posts.
3. **Social asks web agent to update the site.** Web agent has the `gh` CLI on
   the box, ships the change with UTM tags on the links so I can later tell
   which post sent whom, and replies with "done" and the live URL.
4. **Social queues the posts in Buffer,** which sends them out to X, Bluesky
   and Mastodon, linking to a page that is already up to date.
5. **The loop closes.** Social sends Games Research a correlation report and
   asks for the UTM numbers, so the next week's numbers come with some idea of
   which post did anything.

Step 3 is where the [Studs Up!](https://studs-up.gand.games/) site got fixed,
and that was not planned. Its page had gone stale, the way a page does when
nobody is looking at it. The bots noticed while putting a post together, asked
me, and after a yes, web agent updated it. It is not a page I update often, so
on my own I would not have caught it.

The map calls this the busiest link in the whole setup, Games Research and
Social trading Steam numbers back and forth. It is also the one I touch least.

The next step is to tie it to my Google Calendar. The important dates are
already there: launch days, demo releases, sales. Instead of only a weekly
roundup, Social will read those dates and act on them, handing work on where
it needs to: a page update to web agent, images to image bot, posts to
Buffer. None of that is wired up yet. The pieces all exist; the trigger is the
part still missing.

## What the chief of staff found

Asking the Chief of Staff to draw the map turned out to be an audit, and it was
blunt about it:

- **Monday pile-up.** Eight routines fire between 8:52 and 10:07 on Mondays.
  Tomorrow is Sports Day, so tomorrow they fire into a holiday.
- **Overlaps.** News and Daily Recap both send morning briefs. Games Research,
  Product Idea and Amiga Research all comb Reliquary for "what to build next".
  Image bot and Social both make images.
- **Idle bots.** General Chat has not been used since 27 September. Image bot
  and web agent only move when someone asks.
- **Loose ends.** The Finance connector still needs a sign-in, and no bot uses
  Origin at all.

It also corrected itself. Earlier it had told me Google Calendar was offline.
Calendar was fine; the Chief of Staff just doesn't have it in its own setup,
and it had reported its own blind spot as an outage. The other bots have had
Calendar, Drive and Gmail the whole time.

That is the thing I would warn anyone about before they build one of these:
bots accrete. Each one made sense the day I added it. Fourteen of them, with
routines set up at different times, add up to a Monday morning I never designed.

## What it runs on

All fourteen bots run on one subscription: X Premium+. Here in Japan that is
¥6,080 a month; in the US it is about $40. For that I get three things that
would otherwise be separate bills.

- **Grok Bot, with its own allowance.** xAI's own wording is that Bot usage is
  [separate from your Grok plan](https://x.ai/news/introducing-grok-bot), so
  anything handed to a bot doesn't count against anything else. Fourteen bots
  firing routines all week don't eat into the rest.
- **Grok Build**, xAI's terminal coding agent, which is [open to Premium+
  subscribers](https://x.ai/news/grok-build-cli). It draws from a different
  pool, the one grok.com chat, image generation and voice also use. A heavy
  week for the bots does not stop me from using Build, and the other way round.
- **The X side.** Fewer ads, the biggest reply boost X gives anyone, longer
  posts, Articles and Radar. For a studio that announces most things on X,
  the reach matters as much as the bots do.

At that price I think it is very good value: two separate agent pools and the
X features, in one bill.

The model is better than its reputation, too. Grok 4.7 was one of the eleven
in [last week's blind evaluation](/blog/2026-10-10-eleven-agents-thirteen-tasks-graded-blind),
and it landed in the second tier at 8.67, just behind the Claude models.
Its code was excellent (9.75 and 10 on the first two tasks), its operations
work was second only to Sonnet, and it was by far the cheapest run in dollars.
Research, ops checks, reading reports and filing tidy issues is the kind of
work it is good at, and that is most of what the bots do.

It also scored 6.5 on the social media task, its worst result, and the report
says to keep it away from customer-facing copy. The bot writing my posts is a
Grok bot. I know.

## Why it works for me

Three things make it work:

- **The handoff is a GitHub issue, not a chat message.** An issue can be read,
  closed, argued with and linked from a commit. A chat message disappears.
  Grok Bot files the issue; [Claude](/blog/2026-10-10-eleven-agents-thirteen-tasks-graded-blind)
  closes it; I can see both.
- **Measure before building.** The flame answer was not "yes, cut for CPU", it
  was "never ported". A guess would have gone looking for a CPU switch that
  was never there.
- **Taste stays with me.** Palettes, balance, whether a port happens, what goes
  out under the studio's name. The bots draft and measure. I decide.

The coding agents talk to each other through
[tincan](/blog/2026-07-03-introducing-tincan-two-cans-and-a-string-for-ai-agents),
the office bots through Grok Bot's own messages, and everybody shares
Reliquary. It is more plumbing than I expected to own when I started a games
studio.

Next on my list is the Monday pile-up. I haven't decided yet whether to spread
the routines out or merge the bots that overlap. I might ask the Chief of Staff
what it thinks, and then decide myself.
