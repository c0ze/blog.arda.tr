---
title: "Twenty-Six Entries, and the Lead Came Back"
date: "2026-10-17"
excerpt: "Five days ago I wrote that Sonnet 5.5's lead was gone. One pass later it was back, and it has led every pass since. Meanwhile the field grew to twenty-six: two Muse models from Meta, HY4 in Tencent's own harness, and Gemini 4 Argon through a chat window with no tools at all."
tags: ["ai", "agents", "evaluation", "dev"]
keywords: "ai agent evaluation, coding agent benchmark, blind grading, sonnet 5.5, opus 5.5, fable 5.1, haiku 5.5, muse-wonder-full, muse wonder, meta muse code, gemini 4 argon, hy4 preview, codebuddy, grok 4.7, gpt-6 astra, llm comparison, grading noise"
description: "The agent evaluation grows to 26 entries: muse-wonder-full and muse-wonder via Muse Code, HY4 preview via CodeBuddy, Gemini 4 Argon through the Gemini web chat, and Grok 4.7 completes all 13 tasks. Sonnet 5.5 is back on top."
author: "Arda Karaduman"
image: "/images/og/2026-10-17-twenty-six-entries-and-the-lead-came-back.png"
draft: false
---

Five days ago I wrote [Twenty-Two Agents, and the Lead Is
Gone](/blog/2026-10-12-twenty-two-agents-and-the-lead-is-gone). Opus 5.5 had edged
past Sonnet 5.5 by 0.01, and I said the case for Sonnet as the default had got a lot
weaker.

In the very next pass, Sonnet was back in first place. It has led every pass since.

In the same post I wrote that anything under about 0.3 was noise. I should have
applied that to my own headline.

## What's new

Four new entries, and one that is finally complete:

- **HY4 preview, through CodeBuddy.** Tencent's own coding agent, running the same
  model I had already run through opencode on OpenRouter. Same model, two harnesses.
- **muse-wonder,** through Muse Code on the Mac. This is Meta's Muse family; the
  `muse` in the earlier tables is `muse-spark`.
- **Gemini 4 Argon,** through the Gemini web chat. More on that below, because it is
  a strange one.
- **muse-wonder-full,** the big Muse model, behind a $50 subscription.
- **Grok 4.7** ran out of balance on task 13 in the first round. That task has now
  been re-run, so Grok is finally scored on all thirteen like everyone else.

After each addition, the whole field was re-graded blind again: a 23-way pass, then
24, 25 and finally 26. Everything is on [the results
site](https://c0ze.github.io/agent-evaluation/) and in [the
repo](https://github.com/c0ze/agent-evaluation).

## The table

| # | Model | Harness | Avg / task |
|---|---|---|---|
| 1 | **Sonnet 5.5** | Claude Code (cloud) | **9.38** |
| 2 | Opus 5.5 | Claude Code (cloud) | 9.29 |
| 3 | Fable 5.1 | Claude Code (cloud) | 9.23 |
| 4 | Haiku 5.5 | Claude Code CLI | 8.73 |
| 5 | Grok 4.7 | Grok CLI | 8.71 |
| 6 | GPT-6 Astra | Codex CLI | 8.60 |
| 7 | **muse-wonder-full** | Muse Code | 8.58 |
| 8 | GPT-6.1 Sol | Codex CLI | 8.56 |
| 9 | HY4 preview | opencode + OpenRouter | 8.25 |
| 10 | Qwen 3.8 Max | opencode + OpenRouter | 8.17 |
| 11 | **HY4 preview** | CodeBuddy | 8.13 |
| 11 | **muse-wonder** | Muse Code | 8.13 |
| 13 | MiniMax M3.1 Flash | mcode | 7.92 |
| 14 | Step-5 preview | opencode + OpenRouter | 7.73 |
| 15 | GLM-5.3 | opencode + OpenRouter | 7.67 |
| 16 | mimo | tincan | 7.58 |
| 16 | muse (spark) | tincan | 7.58 |
| 18 | **Gemini 4 Argon** | Gemini web chat, no tools | 7.31 |
| 18 | Kimi K3 | opencode + OpenRouter | 7.31 |
| 20 | GPT-6 Luna | Codex CLI | 7.27 |
| 21 | Mistral Large 4 | opencode + OpenRouter | 6.54 |
| 22 | DeepSeek V4 Pro | opencode + OpenRouter | 6.48 |
| 23 | Gemini 3.1 Pro | Antigravity CLI | 6.46 |
| 24 | Gemini 3.8 Flash | Antigravity CLI | 6.23 |
| 25 | MiniMax M3 | mcode | 6.08 |
| 26 | Nemotron 3 Ultra | opencode + OpenRouter | 4.88 |

## The top three, again

| Pass | Sonnet 5.5 | Opus 5.5 | Fable 5.1 |
|---|---|---|---|
| 22-way (the last post) | 9.37 | **9.38** | 9.33 |
| 23-way (+ HY4 via CodeBuddy) | **9.44** | 9.23 | 9.31 |
| 24-way (+ muse-wonder) | **9.54** | 9.37 | 9.37 |
| 25-way (+ Argon, Grok complete) | **9.48** | 9.35 | 9.19 |
| 26-way (+ muse-wonder-full) | **9.38** | 9.29 | 9.23 |

Sonnet has now come first in every pass but one, and the one it lost was by 0.01. In
this pass it had the best or tied-best score on 7 of the 13 tasks, against Opus's 6.

The honest reading hasn't changed, though: the three of them are within noise of each
other. Between the last two passes, the same submissions moved by 0.42 points per task
on average, and a model's average can move about ±0.4 from one pass to the next with no
steady direction. With twenty-six entries, the report now says only **tier-level**
differences are reliable. Sonnet's run of first places is a pattern; any single gap at
the top is not.

## muse-wonder-full: straight into the second tier

The one I was waiting for. **muse-wonder-full** landed 7th at **8.58**, level with GPT-6
Astra (8.60) and GPT-6.1 Sol (8.56), and in the same tier as Haiku and Grok. Its sibling
muse-wonder is 0.45 behind, and `muse-spark` a full point behind.

What stands out is how even it is: no task below 7.5. Its writing average, 8.81, is the
best outside the top three, level with Haiku. It placed 3rd on the weekly plan and 4th
on the webhook guide and the social posts.

The gain over muse-wonder comes mostly from two tasks where wonder had likely broken its
own work:

- **Infrastructure, 6.0 to 8.0.** muse-wonder dropped every Linux capability from Redis
  and nginx, including the ones their own entrypoints need, so its stack probably never
  starts. The full model hardens it without breaking it.
- **Maintenance, 6.5 to 7.5.** It switched version handling to strict PEP 440, which
  really does change the output for spellings like `1.02`. But it said so everywhere,
  and the package builds.

So the full model's edge looks like fewer serious mistakes, rather than better work
across the board. All thirteen tasks took 31 minutes, two at a time, and used 33% of
one 5-hour subscription window. That works out to about 2.5% of a window per task for
second-tier quality, which is a very good deal if you already pay for Muse.

Well, I had to dish out $50 to get it, and I think it is right along the threshold I
would pay for a secondary model. It is capable, and the limits seem adequate for a
second-opinion model.

## Gemini 4 Argon, through a chat window

I don't have API access to Gemini 4 Argon, because I don't think the Ultra plan you
need for it is worth it at this point. So this run was done the hard way, through the
Gemini app on my Pro plan: Claude drove the Gemini web chat in its own browser pane, one temporary
chat per task. It pasted each task's files into a single message, asked for whole files
back, copied them out, and checked each one with SHA-256. Pacing the run around the
Google AI Pro plan's 5-hour usage windows stretched about an hour of replies over
twenty hours.

That makes Argon the only entry that **could not run anything**: no code, no tests, no
browser. It still scored **7.31**, about a point above Gemini 3.1 Pro and 3.8 Flash
through agy, which had tools. Its editorial page (8.5) and plan (8.25) were good, and
its bug fix was correct.

But it also did something I hadn't seen in this evaluation before. In tasks 01 and
02, its `RESPONSE.md` reports test runs that could not have happened. Task 01 says "All 11
unit tests … pass" for a file that has 13. In task 04 it admits it couldn't execute
anything, then labels ruff "PASS" anyway. The tests do pass when you run them. It just
didn't, and said it did. The evaluations I read about this model mention
hallucinations, and I have now confirmed that in my own tests.

Two more oddities: it reported its own model ID as `gemini-3.1-pro-preview` in every
reply, and two of its weakest tasks are ones that running the code or rereading the
sources would have caught. Its version normaliser changes `1.02.0` to `1.2.0` while
the changelog says output is unchanged, and its social replies invent a support email and a billing adjustment.

So read 7.31 as "Argon plus a tool-less chat", not as Argon in an agent harness.

## Why add more model families at all

What I have found in my experience is that you get the best results when your work is
cross-checked by models from different families. Opus 5.5 is a better model than
GPT-6.1 Sol, but I find more value in having Sol check Opus's code than in having Opus
check its own. Bringing different model families together lets you weigh the work from
different angles, which a group of models from the same family can miss.

In this light, I brought muse-wonder-full into the picture because it is a unique model
family, not because it is an Opus 5.5 killer. I would have liked Argon too, but it
simply hallucinates too much, and the Ultra subscription isn't worth it at this
moment.

## Same model, two harnesses

HY4 preview ran twice: through opencode on OpenRouter, and through Tencent's own
CodeBuddy. In this pass it's 8.25 against 8.13, OpenRouter ahead. In the previous pass
it was the other way round. The gap has now changed sign three times.

CodeBuddy did better on the social posts and the dashboard, and worse on maintenance and
the story. That doesn't show either harness is better. It shows that one run varies a
lot from task to task, and so does the grading. To actually measure a harness effect,
you'd need several runs of the same model in each harness, and this evaluation has one.

## The rest

- **Haiku 5.5** is 4th at 8.73, top of the second tier, still for **$1.74** at API
  prices. Still the value pick.
- **Grok 4.7**, now complete, is 5th at 8.71, with the best or tied-best scores on
  feature building and the bug fix.
- **muse-wonder** is 8.13, strong on the bug fix (9.75), but check its infrastructure
  output before using it.
- **Nemotron 3 Ultra** is still last, about 1.2 points behind the next model, and last
  or tied last on 9 of 13 tasks.

The six tiers, as the report now draws them:

1. **Sonnet, Opus, Fable:** 9.2–9.4.
2. **Haiku, Grok, Astra, muse-wonder-full, Sol:** 8.55–8.75.
3. **HY4 (both harnesses), Qwen 3.8 Max, muse-wonder, MiniMax M3.1 Flash:** 7.9–8.25.
4. **Step-5, GLM-5.3, mimo, muse-spark, Gemini 4 Argon, Kimi K3, GPT-6 Luna:** 7.25–7.75.
5. **Mistral Large 4, DeepSeek V4 Pro, Gemini 3.1 Pro and 3.8 Flash, MiniMax M3:** 6.1–6.55.
6. **Nemotron 3 Ultra:** 4.9.

## So what changed?

Less than the headlines would suggest, which is the point. The top three are still a
tie on paper, Sonnet keeps winning that tie, and the tiers held through four more passes
and four new entries. The new arrivals slotted into the tiers rather than reshuffling
them: muse-wonder-full into the second, HY4 via CodeBuddy and muse-wonder into the
third, Argon into the fourth.

The caveats are the same as before, and they still matter. It's one run per entry. The
graders are Opus 5.5, so four contestants share its family and one is itself. Effort
levels and harnesses differ, and now one entry didn't have a harness at all.

Five days ago I wrote that Sonnet's lead was gone. It wasn't. It was 0.01 points of
noise, and I wrote a headline about it.
