---
title: "Twenty-Two Agents, and the Lead Is Gone"
date: "2026-10-12"
excerpt: "Two days ago Sonnet 5.5 had won every blind pass of my agent evaluation. Then Haiku 5.5 came out, I found $18 of forgotten OpenRouter credit, and the field doubled to twenty-two. Sonnet's lead shrank pass by pass until Opus edged past it by 0.01."
tags: ["ai", "agents", "evaluation", "dev"]
keywords: "ai agent evaluation, coding agent benchmark, haiku 5.5, opus 5.5, sonnet 5.5, qwen 3.8 max, hy4 preview, step-5 preview, nemotron 3 ultra, kimi k3, glm-5.3, deepseek v4 pro, mistral large 4, gemini 3.1 pro, openrouter, opencode, blind grading"
description: "A follow-up to my eleven-model agent evaluation: Haiku 5.5, two Gemini models and eight OpenRouter models join, the field grows to twenty-two, and the top three end up in a statistical tie."
author: "Arda Karaduman"
image: "/images/og/2026-10-12-twenty-two-agents-and-the-lead-is-gone.png"
draft: false
---

Two days ago I wrote up [eleven agents on thirteen tasks, graded
blind](/blog/2026-10-10-eleven-agents-thirteen-tasks-graded-blind). Sonnet 5.5 had
come first in every pass, and I said that on this evidence it was the default.

That held for three more passes. Then it didn't.

## How eleven became twenty-two

The day after that post, Haiku 5.5 came out, and I thought it deserved its place in
the table. Then Gemini, since agy was right there. Then I wanted Kimi, but my
subscription had expired, and I remembered I had $18 of OpenRouter credit sitting
unused. OpenRouter has Kimi K3. It also has a lot of other things. One thing led to
another, the way it does:

- **Haiku 5.5**, through the Claude Code CLI, headless, on xhigh.
- **Gemini 3.1 Pro and Gemini 3.8 Flash**, through the Antigravity CLI, on High.
- **Kimi K3, DeepSeek V4 Pro, GLM-5.3 and Mistral Large 4**, through opencode on
  OpenRouter, on `high`.
- **Qwen 3.8 Max, Nemotron 3 Ultra, Step-5 preview and HY4 preview**, the same way,
  after a $10 top-up.

Same thirteen tasks, same rules. Every model started from a fresh copy of the
templates with no history. Every task got its own fresh session and, for agy and
opencode, its own empty `HOME`, so no memory, skills or instructions leaked in. And
after each batch, the whole field was graded blind again: a 12-way pass, then 14,
18 and finally 22.

## The new table

| # | Model | Harness | Avg / task |
|---|---|---|---|
| 1 | **Opus 5.5** | Claude Code (cloud) | **9.38** |
| 2 | Sonnet 5.5 | Claude Code (cloud) | 9.37 |
| 3 | Fable 5.1 | Claude Code (cloud) | 9.33 |
| 4 | Grok 4.7 (12 tasks) | Grok CLI | 8.92 |
| 5 | Haiku 5.5 | Claude Code CLI | 8.69 |
| 5 | GPT-6.1 Sol | Codex CLI | 8.69 |
| 5 | GPT-6 Astra | Codex CLI | 8.69 |
| 8 | Qwen 3.8 Max | opencode + OpenRouter | 8.35 |
| 9 | HY4 preview | opencode + OpenRouter | 8.27 |
| 10 | Step-5 preview | opencode + OpenRouter | 7.96 |
| 11 | GLM-5.3 | opencode + OpenRouter | 7.81 |
| 12 | muse | tincan | 7.79 |
| 13 | MiniMax M3.1 Flash | mcode | 7.73 |
| 14 | mimo | tincan | 7.58 |
| 14 | GPT-6 Luna | Codex CLI | 7.58 |
| 16 | Kimi K3 | opencode + OpenRouter | 7.37 |
| 17 | DeepSeek V4 Pro | opencode + OpenRouter | 6.58 |
| 18 | Mistral Large 4 | opencode + OpenRouter | 6.42 |
| 19 | Gemini 3.8 Flash | Antigravity CLI | 6.37 |
| 20 | MiniMax M3 | mcode | 6.31 |
| 20 | Gemini 3.1 Pro | Antigravity CLI | 6.31 |
| 22 | Nemotron 3 Ultra | opencode + OpenRouter | 5.06 |

Everything is in [the repo](https://github.com/c0ze/agent-evaluation) and on [the
results site](https://c0ze.github.io/agent-evaluation/), which now has all
twenty-two side by side.

## What changed at the top

Here is the top three, pass by pass:

| Pass | Sonnet 5.5 | Fable 5.1 | Opus 5.5 |
|---|---|---|---|
| 11-way (the first post) | **9.31** | 8.96 | 8.96 |
| 12-way (+ Haiku) | **9.42** | 9.21 | 9.19 |
| 14-way (+ Gemini) | **9.38** | 9.25 | 9.19 |
| 18-way (+ 4 OpenRouter) | **9.42** | 9.37 | 9.27 |
| 22-way (+ 4 more) | 9.37 | 9.33 | **9.38** |

Sonnet's lead went from 0.35 to nothing. In the final pass Opus is ahead by 0.01,
which is not a win, it is a rounding error with good PR. Between the last two
passes, the same submissions moved by 0.49 points per task on average, and 42 of
231 moved by a full point or more. Anything under about 0.3 is noise.

So the honest reading is: **Opus, Sonnet and Fable are tied.** Sonnet still had the
best or tied-best score on 7 of the 13 tasks, against Opus's 6. But Opus was also
the fastest and cheapest of the three, 21 minutes and $14 against Sonnet's 28 and
$15, and that was Opus on high while the other two ran on extra. The case for
Sonnet as the obvious default just got a lot weaker.

Why did Opus and Fable catch up? Partly because the grading is comparative within
each task. As more weak submissions arrive, a strong one looks stronger, so nearly
every original model's average drifted up over these passes. MiniMax M3.1 Flash
rose by 0.92 without a single new token of its own. The grader brief was also
rewritten for the 12-way pass, which is a change I should have kept the original
of, and didn't. The *order* is more stable than the numbers, and the order of the
tiers didn't change.

## Haiku 5.5: second tier, for $1.74

Haiku landed exactly level with GPT-6.1 Sol and GPT-6 Astra at 8.69, behind only
the big three Claude models and Grok. It tied first on infrastructure (9.5), and
the report now names it the best writing and planning choice outside the top three.

It ran on my Claude Max subscription, so it cost me nothing extra. At API prices,
Claude Code put the whole run at **$1.74**. For second-tier quality, that is the
cheapest thing in the table.

It wasn't flawless. On the bug-fixing task, Haiku failed one of the hidden tests the
same way MiniMax M3.1 Flash did: an expired cache entry raises, but stays in the
map. And it spent 24 of its 34 minutes on the dashboard task, testing its own page
in headless Firefox.

## The OpenRouter eight

This is the part I didn't plan, and the most interesting part.

**Qwen 3.8 Max** is the best model outside the top two tiers: strong code (8.81),
fail-closed secrets in the infrastructure task, a solid incident analysis. It was
also the most expensive OpenRouter model by far, at $5.44, with some frontend
tasks running over half an hour.

**HY4 preview**, from Tencent, is the surprise. 8.27 overall, the strongest code
of the OpenRouter batch (8.94), one of the few task-04 packages that actually
builds, and it cost **$1.57**. If I were paying per token for open-weights work,
this is where I would start. Its social posts did invent a founder story, though,
and its dashboard invented nine incidents the brief never mentioned.

**Step-5 preview**, from StepFun, is even across task types: a strong feature
build, a distinctive social voice and a polished dashboard, against a weak plan
(6.25) and another package that won't build. Together with HY4, it has a clear edge
over the MiniMax models and mimo, at $2.21.

**Kimi K3** was fast: 13 and a half minutes for all thirteen tasks, faster than I
remember it ever being on Moonshot's own service. Good frontends, weak operations
work, 7.37 overall.

**GLM-5.3** kept the character it showed in its first pass: excellent on the bug
fix and the social posts, weak on maintenance. **DeepSeek V4 Pro** was cheap
($0.43) and thin.

**Nemotron 3 Ultra** is last, alone, 1.25 points below the next model. It was last
on 7 of 13 tasks. Its plant-care page showed "UNDEFINED" and declared "all caught
up" while tasks were still pending. It used about 11k reasoning tokens for all
thirteen tasks combined; the next-lowest OpenRouter model used about 44k. It was
fast and cheap, eight minutes and $0.76, and you get what you pay for. It also
tried `pip install` twice, which the permission rules blocked.

## Gemini, through agy

Both Gemini models ended up in the bottom tier: 6.37 for 3.8 Flash and 6.31 for
3.1 Pro. In fairness, agy's headless sandbox blocked both headless Chrome and
headless Firefox, so neither could screenshot its own pages, and Haiku's sandbox
allowed that. But their non-frontend tasks scored low too, so the harness doesn't
explain all of it. Pro came last on the maintenance task (4.0).

## The harness bit back

Running eight models through opencode on one machine produced its own set of
failures, none of them the models' fault:

- **/tmp filled up.** opencode installs its plugin SDK with npm into every fresh
  `HOME`, about 160 MB each. Sixteen sessions at once, plus leftovers from the
  earlier batch, and the 16 GB tmpfs was gone. Twenty-one tasks had to be reset and
  re-run.
- **The credit ran out.** Qwen's frontend tasks cost up to $1.68 each, far more
  than estimated. The budget guard held the remaining tasks, OpenRouter cut off the
  two running ones with an HTTP 402, and I topped up $10.
- **Some models reasoned themselves to death.** opencode caps each response at
  32,000 tokens. On the frontend tasks, Mistral Large 4 and Qwen 3.8 Max spent the
  whole budget *thinking*, hit the cap, and opencode ended the session before a
  single file was written. Same result on an identical re-run. I had them re-run at
  medium or low effort, which finished, and the graders were told. That is part
  model behaviour and part harness limit, and the scores on those three tasks
  should be read with that in mind.

In total, the OpenRouter runs cost about $22, across both batches, smoke tests and
the lost sessions included.

One more aside. I asked about "Space Bunny Alpha", OpenRouter's stealth model from
a few weeks ago. It's been retired, and the leading guess is that it was MiniMax
M3.1 Flash, which is already in the table. Every other mystery model I asked about
had been retired too. Stealth models are only mysterious until you try to benchmark
them.

## What I take from it

- **The top three are a tie.** Pick on price and speed, and in this run that was
  Opus on high effort.
- **Haiku 5.5 is the value pick** if you have a Claude subscription, or even if you
  don't.
- **HY4 preview is the value pick on OpenRouter,** and Qwen 3.8 Max is better on
  average if you can stomach the bill.
- **Nemotron, DeepSeek, Mistral, Gemini through agy and MiniMax M3** are not for
  unsupervised work on tasks like these.

The caveats from the first post still apply, and some got bigger. It's one run per
model. The graders are Opus 5.5, so four contestants are its family and one is
itself, and it won by 0.01 this time. Effort levels and harnesses differ. And the
OpenRouter models are graded as OpenRouter served them, through opencode.

But the shape of the table held across eleven new models and four new passes, and I
find that more convincing than any single winner. I said Sonnet was the default.
It turns out it was one of three.
