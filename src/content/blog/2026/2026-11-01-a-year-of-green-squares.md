---
title: "Retrospective 2026: A Year of Green Squares"
date: "2026-11-01"
excerpt: "In October 2025 I pushed 7 commits to GitHub. In October 2026 I pushed 5,613. Same day job, same evenings. Month by month, what I built, and the model release or IDE that lines up with every jump in the graph."
tags: ["retrospective", "ai", "claude", "codex", "gemini", "gamedev", "gand", "open-source"]
keywords: "github contribution graph, 2026 retrospective, ai coding productivity, claude code, claude opus 5.5, claude fable 5, gpt-6 astra, gemini antigravity, openai codex, gand games, heliobane, commit, farstrand, skrivist, vigil today, armarium, solo developer"
description: "A month-by-month retrospective of 15,498 commits in a year: what I built, which AI models and IDEs each jump in my GitHub graph lines up with, and what actually shipped."
author: "Arda Karaduman"
image: "/images/og/2026-11-01-a-year-of-green-squares.png"
draft: false
---

In October 2025 I pushed 7 commits to GitHub. In October 2026 I pushed 5,613. My day
job didn't change and my evenings didn't get longer. What changed was the tools.

The contribution graph says 19,069 for the year. Most of it sits in the last two
months, and almost every jump lines up with a model release or a new IDE. This post goes month by month: what I built, and what was going
on in AI tooling when I built it.

A note on the numbers. Monthly commit counts come from GitHub's commit search on my
account, so they only count default branches. They add up to 15,498 commits across
170 repos; pull requests, reviews and issues make up the rest.

<figure>
  <svg viewBox="0 0 720 300" width="100%" role="img" aria-labelledby="gs-title" style="display:block;max-width:760px;height:auto"><title id="gs-title">Commits per month, November 2025 to October 2026, with model releases marked</title><line x1="138.3" y1="38" x2="138.3" y2="247.0" style="stroke:var(--fg-2);stroke-width:1;stroke-dasharray:2 3"/><text x="141.3" y="34" style="fill:var(--fg-2);font:12px var(--mono)">Antigravity</text><line x1="267.1" y1="52" x2="267.1" y2="238.0" style="stroke:var(--fg-2);stroke-width:1;stroke-dasharray:2 3"/><text x="270.1" y="48" style="fill:var(--fg-2);font:12px var(--mono)">Opus 4.6</text><line x1="473.3" y1="38" x2="473.3" y2="211.4" style="stroke:var(--fg-2);stroke-width:1;stroke-dasharray:2 3"/><text x="476.3" y="34" style="fill:var(--fg-2);font:12px var(--mono)">Fable 5</text><line x1="510.0" y1="52" x2="510.0" y2="164.6" style="stroke:var(--fg-2);stroke-width:1;stroke-dasharray:2 3"/><text x="513.0" y="48" style="fill:var(--fg-2);font:12px var(--mono)">Fable back</text><line x1="645.0" y1="38" x2="645.0" y2="115.0" style="stroke:var(--fg-2);stroke-width:1;stroke-dasharray:2 3"/><text x="648.0" y="34" style="fill:var(--fg-2);font:12px var(--mono)">Opus 5.5</text><rect x="120" y="267.0" width="30" height="3.0" style="fill:var(--fg-2);fill-opacity:.45"><title>November 2025: 83 commits</title></rect><text x="135" y="261.0" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">83</text><text x="135" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Nov</text><rect x="170" y="264.2" width="30" height="5.8" style="fill:var(--fg-2);fill-opacity:.45"><title>December 2025: 162 commits</title></rect><text x="185" y="258.2" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">162</text><text x="185" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Dec</text><rect x="220" y="266.8" width="30" height="3.2" style="fill:var(--fg-2);fill-opacity:.45"><title>January 2026: 90 commits</title></rect><text x="235" y="260.8" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">90</text><text x="235" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Jan</text><rect x="270" y="258.0" width="30" height="12.0" style="fill:var(--fg-2);fill-opacity:.45"><title>February 2026: 336 commits</title></rect><text x="285" y="252.0" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">336</text><text x="285" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Feb</text><rect x="320" y="265.4" width="30" height="4.6" style="fill:var(--fg-2);fill-opacity:.45"><title>March 2026: 128 commits</title></rect><text x="335" y="259.4" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">128</text><text x="335" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Mar</text><rect x="370" y="265.5" width="30" height="4.5" style="fill:var(--fg-2);fill-opacity:.45"><title>April 2026: 127 commits</title></rect><text x="385" y="259.5" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">127</text><text x="385" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Apr</text><rect x="420" y="237.4" width="30" height="32.6" style="fill:var(--fg-2);fill-opacity:.45"><title>May 2026: 914 commits</title></rect><text x="435" y="231.4" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">914</text><text x="435" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">May</text><rect x="470" y="231.4" width="30" height="38.6" style="fill:var(--fg-2);fill-opacity:.45"><title>June 2026: 1,083 commits</title></rect><text x="485" y="225.4" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">1,083</text><text x="485" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Jun</text><rect x="520" y="184.6" width="30" height="85.4" style="fill:var(--fg-2);fill-opacity:.45"><title>July 2026: 2,398 commits</title></rect><text x="535" y="178.6" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">2,398</text><text x="535" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Jul</text><rect x="570" y="242.4" width="30" height="27.6" style="fill:var(--fg-2);fill-opacity:.45"><title>August 2026: 774 commits</title></rect><text x="585" y="236.4" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">774</text><text x="585" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Aug</text><rect x="620" y="135.0" width="30" height="135.0" style="fill:var(--fg-2);fill-opacity:.45"><title>September 2026: 3,790 commits</title></rect><text x="635" y="129.0" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">3,790</text><text x="635" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Sep</text><rect x="670" y="70.0" width="30" height="200.0" style="fill:var(--signal)"><title>October 2026: 5,613 commits</title></rect><text x="685" y="64.0" text-anchor="middle" style="fill:var(--fg);font:12px var(--mono)">5,613</text><text x="685" y="288" text-anchor="middle" style="fill:var(--fg-2);font:12px var(--mono)">Oct</text><line x1="110" y1="270" x2="710" y2="270" style="stroke:var(--rule);stroke-width:1"/></svg>
  <figcaption>Commits per month, Nov 2025 to Oct 2026: 83 in November, 5,613 in October, 15,498 in twelve months. The dashed lines are model releases.</figcaption>
</figure>

## November 2025: the Antigravity moment

**83 commits.** On November 18, Google shipped Gemini 3 Pro and Antigravity, an
agent-first IDE in free public preview. It ran Claude Sonnet 4.5 next to Gemini, and
Opus 4.5 showed up six days later. Overnight I had a frontier Claude model in an IDE,
through Google. (I wrote about it at the time, in
[Antigravity blues](/blog/2025-11-30-antigravity-blues).)

The split in the month is hard to miss. From November 1 to 17 I made 29 commits,
mostly housekeeping on the band site [pagan.tr](https://pagan.tr). From November 18 to
30 I made 54.

- **[ai.arda.tr](https://ai.arda.tr)** ([repo](https://github.com/c0ze/ai.arda.tr),
  from Nov 23): a [chat bot that answers questions about me](/blog/2025-11-23-ai-resume-bot),
  built and hardened (CORS, an XSS fix) in a week.
- **domino**, **tankfury** and **hackerman** all started on November 28, my busiest
  day of the month at 20 commits. Three small games in one day, each with Windows
  builds and sound effects by the weekend. All three are shelved now. They were too
  basic to ship; their job was to show me what AI-driven development could do.
- **apps-sdk** ([repo](https://github.com/c0ze/apps-sdk)): a quick try at OpenAI's
  new Apps SDK.

I wasn't more productive per hour. Starting a project just stopped being expensive, so
I started three on a Friday.

## December 2025: Christmas on a Gemini quota

**162 commits across 16 repos.** On December 5 Google raised Antigravity's limits, with
quotas refreshing every five hours, and that carried the month. My repos filled up with `GEMINI.md` files and `conductor(plan)`
commits, which is what Gemini-driven planning looks like from the outside.

December 26 was my biggest day until May: 72 commits, almost all on **domino**. That's
a deck-builder where I wired up boss blinds, a deck viewer and a reward system over the
holiday.

December also planted seeds. Projects that turned into real products later all got
their first commit this month:

- **[StudsUp](https://studs-up.gand.games/)** (Dec 1): the game that went into Steam
  Next Fest in October.
- **sudone-backend** (Dec 3): Amazon, Rakuten and scraper price APIs plus a Flutter
  app. It shipped as [Sudone](https://sudone.jp/).
- **[skrivist.app](https://skriv.ist)** (Dec 7) and **[gand.tr](https://gand.tr)**
  (Dec 7): the writing app and the label site.
- **fablecast** (Dec 14): audio EPUB generation for multilingual stories. It became
  Fable Spun, which I later shelved (more on that below).
- **git-roast** ([repo](https://github.com/c0ze/git-roast), Dec 2):
  [roasts your diffs](/blog/2025-12-03-introducing-roast), with local model support and
  streaming.

GPT-5.2 shipped on December 11, and I started using ChatGPT on the side. In December it
was a side tool. It mattered more in the spring.

## January 2026: Claude, directly

**90 commits.** A quiet month on the graph, and the month I stopped borrowing Claude
through Google. I started using Claude directly on January 20. Claude Cowork had landed as a research preview that same month.

You can see the switch in the repos. On January 21, the next day,
skrivist.app got its Flutter mobile foundation, and a `.claude/settings.local.json`
turned up in it and had to be untracked.

The rest of January was about the music:

- **Lyrics-Video-Generator** ([repo](https://github.com/c0ze/Lyrics-Video-Generator),
  Jan 27): a Remotion lyric video for The 7th Shadow's "I Yearn".
- **blog.arda.tr** (this site, Jan 29): migrated to Astro, first post on
  [Anti-Nativity](/blog/2026-01-29-the-7th-shadow-update-anti-nativity).
- **music-rip**: [lyric scrapers](/blog/2026-01-18-scraping-lyrics-and-syncing-them-via-whisper)
  and metadata tooling for my library.
- New music sections on [arda.tr](https://arda.tr) and [pagan.tr](https://pagan.tr).

## February 2026: the 4.6 month

**336 commits across 23 repos**, nearly four times January. February was the most
crowded release month of the year:

- Feb 2: OpenAI's Codex app on macOS.
- Feb 5: Claude Opus 4.6 and GPT-5.3-Codex, on the same day.
- Feb 17: Claude Sonnet 4.6.

What that bought:

- **[skrivist.app](/blog/2026-02-16-introducing-skriv-ist-ebook-reading-management-app)**
  (82 commits): a TTS service, membership gating, OPDS support and account settings.
  It went from a prototype to something with accounts and paid tiers.
- **[fablecast](/blog/2026-02-11-introducing-fablecast-fable-tales-as-imagined-by-ai)**
  and **fablecast.kids** (70 between them): the multilingual story generator, with
  image-continuity prompts and per-language TTS.
- **shop.pagan.tr** (34, from Feb 7): a [merch shop for the band](/blog/2026-02-07-pagan-shop-is-live),
  deployed to Google Compute Engine.
- **[story-engine-studio](/blog/2026-02-15-creating-a-llm-powered-story-creation-studio)**
  (14): one commit is literally titled "use sonnet 4.6 single-pass story generation".
- **[slop-machine](/blog/2026-02-23-introducing-slop-machine)** (28, from Feb 22): the
  automated story pipeline. Its own log has "migrate to Vertex AI Gemini API and
  remove Claude".
- **[vigil.today](https://vigil.today)** (27, from Feb 25): the
  [routines app](/blog/2026-02-27-introducing-vigil-today), with push notifications
  working by the end of the month.
- **skrivist.tools** (8, from Feb 18): the Calibre plugin and TTS API docs, public
  from the start.

## March 2026: Google changes the deal

**128 commits.** On March 11 Google moved Antigravity onto AI credits. Users reported
quotas that now refreshed weekly instead of every five hours, and one
developer measured their usable tokens dropping by more than 30x. The free lunch from
November was over.

The graph flattened, and the work moved toward OpenAI: GPT-5.4 shipped
on March 5, the Codex app reached Windows on March 4, and Codex plugins arrived on
March 25. My commits started saying "Consolidate repo guidance into AGENTS".

- **slop-machine** (27): a rate-limit-aware retry with exponential backoff for Gemini.
- **[kids.fable.tr](https://kids.fable.tr)** and **[spun.fable.tr](https://spun.fable.tr)**
  (from Mar 18): the Fable sites, on Firebase.
- **Lyrics-Video-Generator**: Pagan visuals at 60fps, plus
  [lyrics-sync](https://lyrics-sync.arda.tr) for time-synced lyric files.
- Plus steady work on arda.tr, the blog, vigil.today and shop.pagan.tr.

## April 2026: rewrites, not features

**127 commits.** April had big news and a flat graph. Anthropic showed Claude Mythos
Preview to a handful of partners on April 7, shipped Opus 4.7 on the 16th and Claude
Design on the 17th. OpenAI shipped GPT-5.5 on the 23rd.

The work was mostly language migration. When a model can port a site in an afternoon,
you start doing rewrites you'd never justify by hand:

- **ReScript everywhere** (Apr 1–8): arda.tr, pagan.tr, fable.tr and kids.fable.tr
  all [rewritten from React JSX to ReScript](/blog/2026-04-01-rescript-vs-gleam-is-it-worth-to-write-your-frontend-in-a-typesafe-functional-language).
- **ai.arda.tr** [moved to a Gleam stack](/blog/2026-04-06-migrating-an-ai-chatbot-to-gleam-stack)
  with a shared, compile-time API contract.
- **skrivist.app** (65): integration smoke tests, admin entitlement toggles, and the
  Calibre plugin split out into its own repo.
- **agents-mem0** (from Apr 11): a [mem0 corpus](/blog/2026-04-11-enhancing-local-ai-with-quantized-kv-cache-and-mem0)
  with MCP endpoints and an OAuth shim, the groundwork for Reliquary.
- **super-lig** and **local-ai**: a [Süper Lig data atlas](/blog/2026-04-18-making-a-football-analytics-site)
  ([super-lig.arda.tr](https://super-lig.arda.tr), [repo](https://github.com/c0ze/super-lig))
  and [browser-based AI agents](/blog/2026-04-23-made-a-web-app-to-test-edge-ai)
  ([local-ai.arda.tr](https://local-ai.arda.tr), [repo](https://github.com/c0ze/local-ai)),
  both side projects of a side project.

## May 2026: Claude, every day

**914 commits**, seven times April. From May 4 Claude was my main tool, every day: Opus 4.7,
a month old by then, and Opus 4.8 from May 28.

May is where the graph changes shape. In March and April my median day had one to
three commits. In May there wasn't a single day without commits, and the median day
had 23.

- **[vigil.today](https://vigil.today)** (262, starting May 4): the first commit is
  dated May 4, my first day of that. It got cross-device sync, an MCP server and a
  Polar.sh paywall ([more here](/blog/2026-05-28-vigil-today-now-tracks-inventory-and-talks-to-your-chatbot)).
- **[vigil.wiki](https://vigil.wiki)** (169, from May 12): my notes app, with markdown
  and zip imports.
- **dissertation-thesis** ([repo](https://github.com/c0ze/dissertation-thesis), 128,
  from May 21): my 2004 undergraduate thesis on quantum computer simulation,
  [rebuilt](/blog/2026-05-22-running-quantum-computer-simulation-using-mpi-revising-my-old-dissertation-thesis)
  in Python, C and Go, Shor's algorithm included. Twenty-two years late. My 2008
  [master's thesis](https://github.com/c0ze/masters-thesis) went public the same month.
- **[vigil.center](https://vigil.center/)**, **[vigil.directory](https://vigil.directory/)**,
  **[vigil.computer](https://vigil.computer/)** (all from May 29): a shared identity hub
  with satellite sites.
- Remotion promo videos for Skrivist and Vigil Today, a
  [music-video upscaler](https://github.com/c0ze/music-video-upscaler), and boss waves
  for tankfury.

May 11 was the peak at 95 commits. CodeRabbit started showing up in commit messages
too. With this much code coming in, I needed a second reviewer that wasn't me.

## June 2026: three days of Fable

**1,083 commits across 44 repos**, and almost all of them before the 12th. Claude
Fable 5 launched on June 9, the day of the Code with Claude Tokyo livestream I'd signed
up for. On June 10 I made 236 commits, my biggest day of the year up to then. On June 12
Anthropic cut off access to the Mythos-class models, Fable included, to comply with a
Commerce Department order.

The graph shows it plainly. June 1 to 11 averaged about 70 commits a day. June 12 to 30
averaged about 15.

What got built in those first eleven days:

- **tsl-go** ([repo](https://github.com/c0ze/tsl-go), 385, from June 7): a
  [Go port](/blog/2026-06-11-saving-the-slimy-lichmummy) of the roguelike The Slimy
  Lich Mummy, with a [web build](https://tsl.coze.org), truecolour tiles, spells and a
  full dungeon map.
- **reliquary** ([repo](https://github.com/c0ze/reliquary), 38, from June 2): the mem0
  server renamed and turned into a [proper MCP memory tool](/blog/2026-06-03-introducing-reliquary-one-memory-for-every-ai).
  agents-mem0 was cut down to a data vault.
- **sudone-backend** (55): scraper hardening and an evaluation tool for the scan corpus.
- **spun.fable.tr** and **kids.fable.tr** (83): CJK-aware word timing for Japanese
  read-along, plus accessibility fixes.
- **blog.arda.tr** (40): the Ink & Ledger redesign, plus the Reliquary post.

The second half of June went to the music.
**[anti-nativity.arda.tr](https://anti-nativity.arda.tr)**
([repo](https://github.com/c0ze/anti-nativity.arda.tr), from June 21) is the album site
with a player and voice-tagged lyrics. The Lyrics-Video-Generator got Veo hero clips for
the *Anti-Nativity* video. June 21 had 78 commits, the one busy day after the cutoff. I
also started [zork](https://github.com/c0ze/zork),
[AI-enhanced Zork games](/blog/2026-06-18-zork-illuminated). Sonnet 5 arrived on June 30.

## July 2026: access restored, four games at once

**2,398 commits across 47 repos**, more than May and June combined. Anthropic restored
Fable access on July 1. I made 73 commits on July 2, and July 11 was 305.

OpenAI shipped GPT-5.6 on July 9 and folded Codex into the ChatGPT desktop app. You can
see Codex all over the log: 226 July commit messages mention it, mostly as a reviewer
("Fix 5 Codex findings on the helm rework", "Codex P1"). Grok shows up 20 times in the
same role.

The games came in parallel:

- **hexwarren** (546, from Jul 5): a hex-map campaign game with long hunts and a full
  end-to-end test harness.
- **commit** (443, from Jul 11): a Godot 4 game with minigames and a balance model. Its
  site [commit.gand.tr](https://commit.gand.tr/) and
  [press kit](https://commit.gand.tr/public/press-kit/) (13 languages) followed on
  Jul 19.
- **wizards_of_khoth** (313, from Jul 10): turn-based spells and combat in Electron,
  with a play harness.
- **[StudsUp](https://studs-up.gand.games/)** (133): the football game from December
  came back with pitch invaders and a juice pass.
- **pirates** (88), plus big updates to **hackerman** and **tankfury**, the November
  games.

Outside games, skrivist.app got 160 commits, and **OneStarReview** (62) started:
[AI-made short films](/blog/2026-07-09-i-gave-history-one-star) with Seedance 2 video
and an ElevenLabs Music score. Smaller public pieces started too:
[tincan](/blog/2026-07-03-introducing-tincan-two-cans-and-a-string-for-ai-agents)
(message passing between coding agents),
[gage.coze.org](/blog/2026-07-22-introducing-gage-chess-on-x-with-no-api) (board games
with friends online) and a [Chrome video download extension](https://github.com/c0ze/chrome-dl-extension).
Opus 5 landed on July 24, mid-sprint.

## August 2026: shipping is a different job

**774 commits, but across 77 repos**, the widest spread of the year. Commits fell to a third of July, and the work changed with it: August went to
store listings, privacy pages and release builds. It was also the month the games got a
home of their own: [gand.games](https://gand.games/) had its first commit on August 11.

- **commit** (226): a big content pass, mobile layout fixes and a desktop-preview mode.
  Its translation repo, commit-i18n, grew past 1,600 strings.
- **skrivist-mobile** (62, from Aug 3), **mobile.kids.fable.tr** and **sudone-app**:
  Android release builds, Google Play's 16 KB page-size requirement, CI for Android
  tests.
- **[skriv.ist](https://skriv.ist)**, **[gand.tr](https://gand.tr)** and
  **[commit.gand.tr](https://commit.gand.tr/)**: privacy, terms and support pages for
  app store review, plus an `llms.txt`.
- **skrivist.app** (21): a release-readiness audit covering security headers, payment
  gating and i18n.
- Desktop tooling: [omarchy-themes](/blog/2026-08-23-ten-omarchy-themes), desktop themes
  built from the Commit!!!, gand.tr and pagan.tr palettes, and
  [aur-ai-review](https://github.com/c0ze/aur-ai-review), an AI check on AUR package
  changes before they build.

Codex kept reviewing: it appears in 59 commit messages, and Claude in 26. The projects
from December started turning into things you can install.

## September 2026: Opus 5.5 and the Gand lineup

**3,790 commits across 110 repos.** The month splits on one date. The first three weeks ran
on Fable 5.1 (out September 1) and GPT-6 Astra (September 3), busy but normal: 993
commits, about 47 a day.

Then Opus 5.5 shipped on September 22, Claude Code made it the default, and it took
over from Fable 5.1 and Astra for most of my work. Sonnet 5.5 followed on September 28. From September 22 to 30 I made 2,797 commits. September 24 had 603 and
September 25 had 680, the biggest day of the year until October.

That last week is when most of the [Gand Games lineup](/blog/2026-09-25-heliobane-and-the-games-of-gand)
came into being. These are the first commits in my history for each:

- **HELIOBANE** ([site](https://heliobane.gand.games/), Sep 24, 208 commits in seven
  days): a shmup with World 2 bosses by the end of the month. It went into Steam Next
  Fest in October.
- **Farstrand** ([site](https://farstrand.gand.games/), Sep 25, 210): the HELIOBANE
  follow-up, an Axiom Verge-style metroidvania.
- **heliobane-amiga** (Sep 27, 112): the [Amiga port](https://coze.itch.io/heliobane-amiga),
  with music written in my own [cozy-tracker](/blog/2026-07-12-introducing-cozy-tracker)
  as a 4-channel MOD.
- **Broomline** and **Loopwright** (Sep 29), plus **heliobane-mobile** the same day.

Alongside them, other new repos that month: **pharmakon** (360, a brewing sim),
**moonwyrm** (324, a dragon arena game), **cozy-daw** (303, a DAW you can drive over
MCP), **sublime-engine** (200, the engine behind
[The Sublime Engine](https://sublimeengine.gand.games/), an Ottoman point-and-click
adventure), **aldith** (164, the tarot roguelike [Aldith](https://aldith.gand.games/)),
**tincan** ([repo](https://github.com/c0ze/tincan), 126, MCP messaging between my
machines over Tailscale) and **mass-fraction-amiga** (128). Even the commit messages
changed voice. They read like sentences now: "Never perch a dragon where the recall rule
would call it home."

A few public side projects came out of September too:
[Rutile](https://github.com/c0ze/Rutile) and [RustOnRails](https://github.com/c0ze/RustOnRails),
which compile Rails apps written in a Ruby subset to Rust;
[tenioha](/blog/2026-09-14-introducing-tenioha-meaning-lives-in-the-particles), a
functional language with typed Japanese particle calls; the first commits of
[armarium](https://github.com/c0ze/armarium); and
[agent-evaluation](/blog/2026-10-10-eleven-agents-thirteen-tasks-graded-blind), where I
blind-graded eleven coding agents on thirteen tasks.

## October 2026: Next Fest on Opus 5.5

**5,613 commits across 105 repos**, the biggest month of the year. Almost all of it
went into the games. Steam Next Fest ran from October 19 to 26 with demos of HELIOBANE
and Studs Up.

October 12 was the biggest day of the year: 708 commits. Most of the month went into
the Gand lineup, not new projects:

- **The Amiga ports**: heliobane-amiga (506), farstrand-amiga (395, from Oct 7),
  mass-fraction-amiga (214) and a minus40-amiga. HELIOBANE's
  [X68000 port](/blog/2026-10-31-heliobane-on-the-sharp-x68000) started on October 24
  and was out on itch.io on the 29th.
- **gandard** (481, from Oct 8): my own engine, with a design spec, an audit and
  libopenmpt for music.
- **[Farstrand](https://farstrand.gand.games/)** (467) and **Broomline** (380):
  controls remapping, boss routes, and text in English, Turkish and Japanese.
- **[HELIOBANE](https://heliobane.gand.games/)** (243) and **heliobane-mobile** (197):
  the demo builds for Next Fest, a training run localized into seven languages, phone
  menus.
- **skrivist-native** (287, from Oct 4): the pivoted Skrivist,
  [clean EPUB and comics readers](/blog/2026-09-19-comics-skrivist) for iOS and Android
  that sync with Armarium.
- **cozy-daw** (298) and **cozy-tracker** (170): my music tools, with example songs for
  the games.

In public: [armarium](https://github.com/c0ze/armarium) (26), the library server behind
Skrivist, now live at [armarium.skriv.ist](https://armarium.skriv.ist/);
[books.skriv.ist](https://books.skriv.ist/); the
[agent-evaluation results](https://c0ze.github.io/agent-evaluation/); and
[king.arda.tr](https://king.arda.tr), the Turkish card game King.

Codex appears in 610 October commit messages, almost always as a review round ("Codex
round 2", "Codex's whole-branch review"). By now the log has a settled pattern: Claude
writes, Codex checks, and Grok gives a third opinion.

The last five days of October averaged 92 commits a day, half the rate of October 5 to 26. I still spent them on new things:
[dergi.coze.org](/blog/2026-10-27-dergi-coze-org), an OCR'd, searchable archive of old
Turkish computer magazines; [tracker.coze.org](https://tracker.coze.org), the public
site for cozy-tracker; and [retro.coze.org](https://retro.coze.org).

## Gand Games: a division of its own

In August I split the games out of Gand into their own label,
[Gand Games](https://gand.games/). Its site got its first commit on August 11, and by
the end of October it listed eleven titles. [Gand](https://gand.tr) is still a
one-person studio in Tokyo. Gand Games is the games arm, next to the software side:
[Skriv.ist](https://skriv.ist), [Vigil Today](https://vigil.today) and
[SUDONE](https://sudone.jp/).

The roster as of today:

| Game | Status | What it is |
|---|---|---|
| [HELIOBANE](https://heliobane.gand.games/) | Out on Steam, Epic, Android, Amiga and X68000 | A vertical shoot 'em up: a sun-killer gunship flying through infected planets. |
| [COMMIT!!!](https://commit.gand.tr/) | Out on Steam, Android and iOS | A software-career life sim: rent, job stress and a legacy codebase. |
| [MASS FRACTION](https://coze.itch.io/mass-fraction) | Out on itch.io (free Act I demo); Amiga port in progress | Hard sci-fi strategy: running a post-war space launch program. |
| [G-COPY](https://g-copy.gand.games/) | Free in the browser | A disk-copying business sim styled after a classic Amiga copier. |
| [STUDS UP! WIN UGLY](https://studs-up.gand.games/) | Steam demo; full release in a few weeks | A five-a-side football brawler where goals win matches and teeth pay the bills. |
| [FARSTRAND](https://farstrand.gand.games/) | Steam demo and Amiga demo | A sci-fi metroidvania where you freeze creatures into platforms and grow bridges. |
| [ALDITH](https://aldith.gand.games/) | In development | A tarot roguelike: a reader's year of trials with eight Lords. |
| [INTERSECTION 17](https://intersection17.gand.games/) | In development | A bureaucracy sim about running a traffic crossing in a fictional socialist city. |
| [THE SUBLIME ENGINE](https://sublimeengine.gand.games/) | In development | A point-and-click adventure in an alternate 1930s Ottoman Empire. |
| Orbound and Hexwarren | In the lab | Not announced yet. |

The November experiments (domino, tankfury and hackerman) never made the roster.

## What shipped and what didn't

Five products shipped, two more have demos out, one pivoted, and five got shelved.
Commit counts don't tell you any of that, so here it is plainly.

| Project | Where it is | What happened |
|---|---|---|
| [HELIOBANE](https://heliobane.gand.games/) | Shipped on [Steam](https://store.steampowered.com/app/5328670/), [Epic](https://store.epicgames.com/p/heliobane-ad6470) and [Google Play](https://play.google.com/store/apps/details?id=games.gand.heliobane). [Amiga](https://coze.itch.io/heliobane-amiga) and [X68000](https://coze.itch.io/heliobane-x68000) ports on itch.io. iOS was rejected. | My project with the most traction right now. |
| [Commit!!!](https://commit.gand.tr/) | Shipped on [Steam](https://store.steampowered.com/app/4994630/), [Google Play](https://play.google.com/store/apps/details?id=tr.gand.commit) and the [App Store](https://apps.apple.com/app/id6818084996). | Got good traction during the programming fest. |
| [Mass Fraction](https://coze.itch.io/mass-fraction) and [G-COPY](https://g-copy.gand.games/) | Shipped: Mass Fraction on itch.io, G-COPY free in the browser. | The quieter Gand Games releases. |
| [Sudone](https://sudone.jp/) | Shipped on [iOS](https://apps.apple.com/jp/app/id6816408447) and [Android](https://play.google.com/store/apps/details?id=jp.sudone.app). | Not much traction, but I haven't really pushed it yet. |
| [Studs Up!](https://studs-up.gand.games/) | [Demo](https://store.steampowered.com/app/5281630/) on Steam. Full release in a few weeks. | Was in Next Fest in October. [Wishlist it](https://store.steampowered.com/app/5281580/). |
| [Farstrand](https://farstrand.gand.games/) | Demo out on [Steam](https://store.steampowered.com/app/5461390/), plus an [Amiga demo](https://coze.itch.io/farstrand-amiga). | Not much traction. It may be a hard game to get into. I still think it's a good game, and I'm going to finish it. |
| [Skrivist](https://skriv.ist) | Pivoted to clean EPUB and comics readers, including [books.skriv.ist](https://books.skriv.ist/), that sync with a self-hosted [Armarium](https://armarium.skriv.ist/). | I imagined an ebook reader with built-in TTS, sold as a service. Then TTS got so good that nobody would pay for that. The new version is fully serverless, so it costs me nothing to run, whether it sells or not. |
| Fable Spun (was Fablecast) | Abandoned. Sample stories are still up at [kids.fable.tr](https://kids.fable.tr). | The story pipeline works flawlessly. I decided that selling AI-generated stories aimed at children was a no-go. |
| [OneStarReview](/blog/2026-07-09-i-gave-history-one-star) | Paused. | My Chloe vs History knockoff. I was late to the party, and it cost more than I expected. It's fun to make, so an occasional video may still appear when I find cheaper video generation. |
| domino, tankfury, hackerman | Shelved. | Too basic to ship. They were November experiments in what AI-driven development could do, and they did that job. |

## Open source

A lot of this year is public. These are the repos I'd point people to first.

| Project | What it is | Live |
|---|---|---|
| [armarium](https://github.com/c0ze/armarium) | A small self-hosted library server for comics and ebooks: folders and Calibre libraries over OPDS, a JSON API and a web reader. Skrivist's readers sync with it. | [armarium.skriv.ist](https://armarium.skriv.ist/) |
| books.skriv.ist | A local-only EPUB and PDF reader with OPDS and an offline PWA. No accounts, no cloud library. | [books.skriv.ist](https://books.skriv.ist/) |
| [reliquary](https://github.com/c0ze/reliquary) | Qdrant-backed agent memory over MCP. | |
| [tincan](https://github.com/c0ze/tincan) | Message passing between coding agents, across my machines over Tailscale. | |
| [agent-evaluation](https://github.com/c0ze/agent-evaluation) | Eleven coding agents, thirteen tasks, blind-graded in September and October. | [results](https://c0ze.github.io/agent-evaluation/) |
| [Rutile](https://github.com/c0ze/Rutile) and [RustOnRails](https://github.com/c0ze/RustOnRails) | Compile Rails apps written in a Ruby subset to Rust, plus the Rails API surface they compile against. | |
| [tenioha](https://github.com/c0ze/tenioha) | A functional programming language with typed Japanese particle calls, checked effects and lexical closures. | [docs](https://c0ze.github.io/tenioha/) |
| [tsl-go](https://github.com/c0ze/tsl-go) | A Go port of the roguelike The Slimy Lich Mummy. | [tsl.coze.org](https://tsl.coze.org) |
| [super-lig](https://github.com/c0ze/super-lig) | A Süper Lig data atlas: fixtures, standings, scorers and match history. | [super-lig.arda.tr](https://super-lig.arda.tr) |
| [dergi.coze.org](https://github.com/c0ze/dergi.coze.org) | An archive of Turkish retro computer magazines (Commodore 64, Amiga and more), OCR'd and searchable. | [dergi.coze.org](https://dergi.coze.org/) |
| [king](https://github.com/c0ze/king) | King, the Turkish trick-taking card game. | [king.arda.tr](https://king.arda.tr) |
| [dissertation-thesis](https://github.com/c0ze/dissertation-thesis) | My 2004 thesis on quantum computer simulation, rebuilt for 2026. My [2008 Keio master's thesis](https://github.com/c0ze/masters-thesis) is up too. | |
| [Lyrics-Video-Generator](https://github.com/c0ze/Lyrics-Video-Generator) and [lyrics-sync](https://github.com/c0ze/lyrics-sync) | Lyric videos with Remotion, and a tool to make time-synced lyric files. | [lyrics-sync.arda.tr](https://lyrics-sync.arda.tr) |
| [aur-ai-review](https://github.com/c0ze/aur-ai-review) | AI review of AUR package changes before paru builds them, plus a pacman hook denylist. | |
| [omarchy-themes](https://github.com/c0ze/omarchy-themes) | Omarchy desktop themes taken from the palettes of Commit!!!, gand.tr and pagan.tr. | |
| [frame](https://github.com/c0ze/frame) | A native Linux image viewer with a carousel, photo enhancements and safe copy exports. | |

## What the year adds up to

Almost every big move in my graph has a release page next to it. The rises came with
Antigravity in November, the 4.6 models in February, Opus 4.7 in May, Fable in June and
July, and Opus 5.5 in late September. The biggest drops came when access went away:
Google moving Antigravity to credits in March, and the Fable cutoff on June 12.

Two caveats. First, a commit in October isn't the same unit as a commit in November.
Agents commit small and often, and a lot of October is review rounds. Second, the count
doesn't show what shipped; the tables above do. For scale: in the first ten months of
2025 I made 55 commits.

I didn't get faster. The cost of trying something fell to nearly nothing, and every
time it fell further, I tried more things.

## Sources

- Google launches Gemini 3 and Antigravity (ITPro)
- New Antigravity rate limits for Pro and Ultra subscribers (Google)
- Users protest as Google Antigravity price floats upward (The Register)
- Claude (language model) (Wikipedia)
- Anthropic Claude timeline (GitHub)
- OpenAI GPT model release timeline
- Codex timeline (ScriptByAI)
- AI release timeline, July–October 2026 (TensorFeed): Sonnet 5.5 and Claude Code's
  Opus 5.5 default
- Steam Next Fest: October 2026 (PocketGamer.biz)

Commit counts: GitHub commit search for author [c0ze](https://github.com/c0ze).
