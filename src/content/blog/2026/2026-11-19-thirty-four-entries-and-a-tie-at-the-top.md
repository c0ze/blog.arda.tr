---
title: "Thirty-Four Entries, and a Tie at the Top"
date: "2026-11-19"
excerpt: "Eight more entries since the last post, and the top of the table is now a dead heat: Sonnet 5.5 and Fable 5.2 both score 121.5 of 130. Gemini 4 Neon is the best Gemini yet, DeepSeek V4.1 Flash lands two points above V4 Pro, and the released HY4 scores the same as its preview."
tags: ["ai", "agents", "evaluation", "dev"]
keywords: "ai agent evaluation, coding agent benchmark, blind grading, sonnet 5.5, fable 5.2, opus 5.5, gemini 4 neon, gemini 4 hydrogen, antigravity cli, hy4, hy4 flash, deepseek v4.1 flash, codebuddy, tokenhub, gpt-6.2 sol, gpt-6.2 astra, llm comparison, grading noise"
description: "The agent evaluation grows to 34 entries: Gemini 4 Neon through the Antigravity CLI, and HY4, HY4 Flash and DeepSeek V4.1 Flash through Tencent's CodeBuddy, after Fable 5.2, Gemini 4 Hydrogen and the GPT-6.2 models. Sonnet 5.5 and Fable 5.2 tie for first."
author: "Arda Karaduman"
image: "/images/og/2026-11-19-thirty-four-entries-and-a-tie-at-the-top.png"
draft: false
---

In the [last post](/blog/2026-10-17-twenty-six-entries-and-the-lead-came-back) I wrote
that Sonnet 5.5 had led every blind pass since it lost one by 0.01. It led the next
one too. Then Fable 5.2 arrived and took the pass after that by 0.03.

In the newest pass they are tied: **121.5 of 130 each**, 9.35 per task.

I said last time that I had written a headline about 0.01 points of noise. 0.03 is
noise too, so this time the headline is the tie.

## What's new

Eight entries since the last post, in three batches:

- **Fable 5.2** (Claude Code CLI, high) and **Gemini 4 Hydrogen** (Antigravity CLI,
  xhigh) on November 14, which made a 28-way pass.
- **GPT-6.2 Sol** and **GPT-6.2 Astra** (Codex CLI, xhigh), which made it 30-way.
- Today, four more: **Gemini 4 Neon** (Antigravity CLI, high), and the released
  **HY4**, **HY4 Flash** and **DeepSeek V4.1 Flash**, all three through Tencent's
  CodeBuddy on the Tencent Cloud TokenHub plan.

That's 33 models and 34 entries, since HY4 preview ran in two harnesses. DeepSeek V4 Pro
was already on the bench through opencode and OpenRouter, so it wasn't run again.

Every run was blank-slate: a fresh repository from the templates, a fresh session per
task, no personal instructions or memory, and network denied. The transcripts were
audited afterwards, and no network use was found. Then all thirteen tasks were
re-graded blind together, by thirteen Claude Opus 5.5 grader subagents, one per task,
with the submissions behind random letters and names and paths stripped.

Everything is on [the results site](https://c0ze.github.io/agent-evaluation/) and in
[the repo](https://github.com/c0ze/agent-evaluation). The full write-up is
`evaluation/REPORT.md`.

## The table

| # | Model | Harness | Avg / task |
|---|---|---|---|
| 1 | **Sonnet 5.5** | Claude Code (cloud) | **9.35** |
| 1 | **Fable 5.2** | Claude Code CLI | **9.35** |
| 3 | Opus 5.5 | Claude Code (cloud) | 9.19 |
| 4 | Fable 5.1 | Claude Code (cloud) | 9.17 |
| 5 | Grok 4.7 | Grok CLI | 8.75 |
| 6 | GPT-6 Astra | Codex CLI | 8.71 |
| 7 | Haiku 5.5 | Claude Code CLI | 8.69 |
| 8 | GPT-6.1 Sol | Codex CLI | 8.62 |
| 8 | **Gemini 4 Neon** | Antigravity CLI | 8.62 |
| 10 | GPT-6.2 Astra | Codex CLI | 8.58 |
| 11 | **DeepSeek V4.1 Flash** | CodeBuddy | 8.46 |
| 12 | muse-wonder-full | Muse Code | 8.42 |
| 13 | Gemini 4 Hydrogen | Antigravity CLI | 8.40 |
| 14 | GPT-6.2 Sol | Codex CLI | 8.35 |
| 15 | Qwen 3.8 Max | opencode + OpenRouter | 8.27 |
| 16 | HY4 preview | opencode + OpenRouter | 8.13 |
| 17 | **HY4** | CodeBuddy | 8.10 |
| 18 | muse-wonder | Muse Code | 8.08 |
| 19 | HY4 preview | CodeBuddy | 8.02 |
| 20 | MiniMax M3.1 Flash | mcode | 7.77 |
| 21 | Step-5 preview | opencode + OpenRouter | 7.75 |
| 22 | mimo | tincan | 7.63 |
| 22 | muse (spark) | tincan | 7.63 |
| 24 | GLM-5.3 | opencode + OpenRouter | 7.58 |
| 25 | GPT-6 Luna | Codex CLI | 7.52 |
| 26 | **HY4 Flash** | CodeBuddy | 7.42 |
| 27 | Kimi K3 | opencode + OpenRouter | 7.38 |
| 28 | Gemini 4 Argon | Gemini web chat, no tools | 7.31 |
| 29 | Mistral Large 4 | opencode + OpenRouter | 6.58 |
| 30 | Gemini 3.1 Pro | Antigravity CLI | 6.40 |
| 31 | DeepSeek V4 Pro | opencode + OpenRouter | 6.38 |
| 32 | Gemini 3.8 Flash | Antigravity CLI | 6.21 |
| 33 | MiniMax M3 | mcode | 6.00 |
| 34 | Nemotron 3 Ultra | opencode + OpenRouter | 4.98 |

## The top, pass by pass

| Pass | Sonnet 5.5 | Fable 5.2 | Opus 5.5 | Fable 5.1 |
|---|---|---|---|---|
| 26-way (the last post) | **9.38** | – | 9.29 | 9.23 |
| 28-way (+ Fable 5.2, Hydrogen) | **9.40** | 9.31 | 9.17 | 9.17 |
| 30-way (+ GPT-6.2 Sol, Astra) | 9.35 | **9.38** | 9.15 | 9.17 |
| 34-way (+ Neon, HY4, HY4 Flash, DeepSeek V4.1 Flash) | **9.35** | **9.35** | 9.19 | 9.17 |

The top tier is now four models within 0.18 of each other, and 0.42 clear of the
second tier. In this pass Fable 5.2 had the best or tied-best score on 5 of the 13
tasks, Sonnet and Opus on 4 each.

Fable 5.2 is 0.18 ahead of Fable 5.1, but they didn't run the same way: 5.2 ran in the
local CLI on high, 5.1 in Claude Code's cloud on extra. So the fair reading is that 5.2
is at least as good on these tasks at a lower effort setting, not that it's better. Its
lowest score on any task was 8.75. It ran in 30 minutes, which would have been $33.66 at
API prices; on the subscription, nothing was charged.

## Gemini 4 Neon: the best Gemini so far

**Gemini 4 Neon** is 8th at **8.62**, level with GPT-6.1 Sol (112.0 of 130 each), in the
second tier and 0.22 above Gemini 4 Hydrogen. It ran on high effort; Hydrogen ran on
xhigh. Neon also used fewer tokens: 447k output and 221k thinking, against Hydrogen's
694k and 466k.

Its strength is frontends. Its frontend average, 9.08, ties Sonnet's for the best in
the whole field. The editorial landing page tied for 1st at 9.5, a print-journal layout
with a metadata masthead and numbered marginal labels. The dashboard came 2nd, the
plant-care app 4th. Its code was good as well: 9.25 on the scheduler, 9.75 on the bug
fix, and an infrastructure task that keeps Postgres read-only with only the
capabilities it needs.

Its weak spots were these:

- **Maintenance (7.5).** Its version normaliser follows PEP 440 strictly, so it rewrites
  ordinary versions like `1.02` and `v1.2.3`, and raises on strings that aren't PEP 440.
  It's documented, but it's still a behaviour change.
- **The short story (7.25, 22nd).** The message from the future turns into a long
  explanatory monologue.
- **The weekly plan (7.75).** It states QA's Friday availability as fact and calls the
  Thursday demo confirmed.

Neon against Hydrogen, 0.22, is within the noise. The step from Gemini 3.x to 4.x isn't:
Gemini 3.1 Pro and 3.8 Flash, run through the same CLI, sit about two points lower. Part
of that may be the newer agy, whose sandbox lets the 4.x models take screenshots of
their own pages. The frontend gap is the biggest one, 8.6–9.1 against about 5.5.

And for comparison with the last post, Gemini 4 Argon, the one I ran through the web
chat without tools, is still 7.31.

## DeepSeek V4.1 Flash: two points above V4 Pro, with a catch

**DeepSeek V4.1 Flash** is 11th at **8.46**, in the second tier and 2.08 above DeepSeek
V4 Pro (6.38). That gap is far beyond the noise, but it doesn't measure the model alone.
V4 Pro ran through opencode on OpenRouter, where a 32k cap per response hurt several
high-effort runs; V4.1 Flash ran through CodeBuddy on TokenHub. This compares two
model-and-harness pairs.

It is very even: nothing below 7.5. Its best tasks were infrastructure (8.75, with a
tagged-release rollback and an honest list of what Compose doesn't do), the short story
(8.75, 5th), incident analysis (8.75) and the plant-care app (8.75, 4th).

The weak ones were maintenance (7.5, its package has no `py-modules`, so the CI install
step fails), the webhook guide (7.75, 20th), which labels invented details as
guarantees, and the dashboard (8.0), which adds five incidents that aren't in
`DATA.json` and sets most of its text at 9 px.

It was also the hungriest entry in the batch: 47.8M input tokens, 46.9M of them cache
reads, and 649k output over 85 session-minutes. Each frontend task took 14 to 21
minutes, with a lot of self-screenshots. To take them, it searched the home directory
for a Playwright install and drove the cached Chromium over its local DevTools port.

## HY4, and HY4 Flash

The released **HY4** is 17th at **8.10**. HY4 preview scores 8.02 through CodeBuddy and
8.13 through OpenRouter, so the release shows no measurable change on these tasks.

It had the best bug fix in the field (10, tied, with 19 tests that kill every mutant),
and strong scores on the webhook guide and incident analysis (8.75 each). Its product
plan (8.5) never purges unsynced data. HY4 Flash's plan, below, can. But its dashboard
(6.75, 24th) keeps the nav rail as a narrow column on mobile and cuts off table columns,
and its social posts (7.25, 26th) invent product facts and include a Bluesky reply of
354 characters. It was also the slowest of the batch, at 125 session-minutes.

**HY4 Flash** is 26th at **7.42**, in the fourth tier and 0.68 below HY4. That's at the
edge of the noise, but it is lower on code, writing and operations alike, so I'd call it
probably weaker rather than certainly.

Its worst was the product plan (5.5, 30th), whose purge by capture age can delete
unsynced work and whose sections contradict each other. Maintenance (5.25) and the
weekly plan (6.5, which splits the two-hour finance block) were also weak. The bug fix
(9.75) and the social posts (8.25) were fine. It was the fastest and lightest of the
four new entries: 42 session-minutes and 252k output tokens.

HY4 preview's two harnesses are still 8.13 (OpenRouter) and 8.02 (CodeBuddy). It's the
same order as last pass, after five sign changes before that. One run per harness can't
tell a harness effect from luck.

## The GPT-6.2 models

Briefly, since they came in between posts: **GPT-6.2 Astra** is 10th at 8.58 and
**GPT-6.2 Sol** 14th at 8.35, both slightly below GPT-6 Astra and GPT-6.1 Sol in the same
pass. That is within the noise, so there's no measurable gain on these tasks. Their code
is as strong (9.25 each). Their consistent weakness is incident analysis, with short
write-ups that leave out the mechanism and contributing factors. They also ran on a
different account, Codex release and isolation method from the earlier GPT runs, which
this design can't separate from the model.

## How the batch went

The CodeBuddy runs went one task at a time, one model after another. Twelve sessions
died on the same TokenHub gateway error, `400 The request is invalid: read body failed`,
in two bursts of about forty minutes. One HY4 Flash session hit it on its second turn
with zero tokens used, so it was on the provider's side, not the model's. Each failed
task was reset to the template and re-run with the identical command. Two of HY4's
tasks needed a second retry. The failed attempts are kept in the repo, and their time
and tokens aren't counted.

Some models also left things running after their session ended: two headless Chrome
processes from one of HY4 Flash's frontend tasks, and a `python3 -m http.server` from one
of HY4's failed attempts. They had to be cleaned up by hand.

CodeBuddy reports $0 for plan usage, and the TokenHub plan's quota couldn't be read from
the machine, so cost for these three is shown as tokens.

## The tiers

1. **Sonnet, Fable 5.2, Opus, Fable 5.1:** 9.15–9.35.
2. **Grok, GPT-6 Astra, Haiku, GPT-6.1 Sol, Gemini 4 Neon, GPT-6.2 Astra, DeepSeek V4.1
   Flash, muse-wonder-full, Gemini 4 Hydrogen, GPT-6.2 Sol:** 8.35–8.75.
3. **Qwen 3.8 Max, HY4 preview (both harnesses), HY4, muse-wonder, MiniMax M3.1 Flash,
   Step-5 preview:** 7.75–8.3.
4. **muse, mimo, GLM-5.3, GPT-6 Luna, HY4 Flash, Kimi K3, Gemini 4 Argon:** 7.3–7.65.
5. **Mistral Large 4, Gemini 3.1 Pro, DeepSeek V4 Pro, Gemini 3.8 Flash, MiniMax M3:**
   6.0–6.6.
6. **Nemotron 3 Ultra:** 4.98, last or tied last on 10 of 13 tasks.

The edges of tiers two, three and four are rough. The gaps between them are 0.08 and
0.12, so a model near an edge can land on either side in another pass.

## What I'm using

For what it's worth, the table matches my own experience with these models.

I haven't tried Gemini 4 Neon myself yet, but it's the most promising of the new
entries, and I'll be moving it into my workflow as far as my plan allows.

HY4 turned out a bit more expensive than it's worth. DeepSeek V4.1 Flash, on the same
TokenHub plan, makes it obsolete either way.

And one that isn't new: lately I've been using MiniMax M3.1 Flash through mcode a lot.
It's 20th here at 7.77, in the third tier. That's very good for a flash model, and the
quota is generous.

## So what changed?

At the top, nothing you can measure. Sonnet's run of first places ended in a tie, and
the tie is the honest result. Below it, the new arrivals slotted into the tiers rather
than reshuffling them: Neon and DeepSeek V4.1 Flash into the second, HY4 into the third
next to its own preview, HY4 Flash into the fourth.

The grading noise is the same size as before. Between the 30-way and 34-way passes, the
same submissions moved 0.41 points per task on average, and 50 of 390 scores moved by a
point or more. Model averages moved 0.08 on average, at most about 0.3. Only differences
above about 0.4 mean anything.

The caveats haven't changed either. It's one run per entry. The graders are Opus 5.5, so
five contestants share its family and one is the same model. Blinding reduces that bias
but doesn't remove it. Effort levels differ, harnesses differ, and the CodeBuddy runs
had permission rules and a transcript audit instead of an OS sandbox.

Last time I wrote a headline about 0.01 points. This time the margin is zero, and that
one I can stand behind.
