---
title: "Eleven Agents, Thirteen Tasks, Graded Blind"
date: "2026-10-10"
excerpt: "What started as mimo versus muse turned into eleven coding agents on the same thirteen tasks, from a TTL cache to a short story, all graded blind. Sonnet 5.5 won every pass. The rest of the table is more interesting."
tags: ["ai", "agents", "evaluation", "dev"]
keywords: "ai agent evaluation, coding agent benchmark, claude sonnet 5.5, opus 5.5, fable 5.1, gpt-6 astra, gpt-6.1 sol, grok 4.7, minimax m3, blind grading, llm comparison"
description: "Eleven coding agents (Claude, GPT-6, Grok, MiniMax, and two tincan presets) run the same thirteen tasks and are graded blind against one rubric. Results, method, caveats and the full public repo."
author: "Arda Karaduman"
image: "/images/og/2026-10-10-eleven-agents-thirteen-tasks-graded-blind.png"
draft: false
---

It started as a small question. I had two [tincan](/blog/2026-07-03-introducing-tincan-two-cans-and-a-string-for-ai-agents)
presets, mimo and muse, and I wanted to know which one to hand real work to. So I
wrote thirteen tasks, ran both, and graded the results.

Then I wanted a reference point, so I added the Claude models. Then three GPT-6
models. Then Grok. Then MiniMax, twice. Less than two weeks later the "small
question" had eleven contestants, eleven private repositories, six blind grading
passes and a results site.

Everything is now public: **[the repo](https://github.com/c0ze/agent-evaluation)**
and **[the results site](https://c0ze.github.io/agent-evaluation/)**, with every
task brief, every output, every score and every run log.

## The tasks

I did not want another benchmark where the agent fixes one function and goes home.
Real work is mixed, so the thirteen tasks are mixed:

1. **Feature building:** a dependency-aware job scheduler, with hidden contract tests.
2. **Bug fixing:** a deliberately broken TTL/LRU cache, also with hidden tests.
3. **Infrastructure:** harden a small Docker Compose + nginx deployment.
4. **Maintenance:** prepare a Python library for its `0.4.0` release.
5. **Technical writing:** turn messy notes into a webhook guide for customers.
6. **Planning:** offline sync for a building-inspection tablet app.
7. **Creative writing:** an 800–1,100 word literary sci-fi story.
8. **Social media:** launch posts and replies, from a brand brief.
9. **Incident analysis:** a timeline and logs in, a postmortem out.
10. **General operations:** turn a messy inbox into a workable week.
11. **Frontend:** an operations dashboard.
12. **Frontend:** an editorial landing page.
13. **Frontend:** a playful mobile-first app screen.

Each is scored out of 10 against a [rubric](https://github.com/c0ze/agent-evaluation/blob/main/evaluation/RUBRIC.md)
that is deliberately anchored to the contract. A beautiful answer that skips a
required deliverable does not get full marks, no matter how nice the gradients are.

## How it was run

The rules were the same for everyone, as far as the harnesses allowed:

- **Isolation.** Each model got its own private repository holding only the
  thirteen briefs, with no history. Nobody could peek at another model's answers,
  the rubric or the hidden tests.
- **Fresh context per task.** One task, one fresh session. The Claude runs used a
  subagent per task in Claude Code's cloud; the GPT models got one `codex exec`
  per task with my personal `AGENTS.md` set aside; Grok ran in Grok CLI; MiniMax in
  mcode; mimo and muse through tincan.
- **No help.** Whatever orchestrated a run (the Claude session itself, or Opus 5.5
  driving the CLIs) handed out the tasks and wrote the run log. It did not hint,
  fix, finish or re-run anyone's work.
- **Blind grading.** Hidden tests for the code tasks, screenshots at desktop and
  390 px for the frontends, then every submission graded against the rubric with
  names, paths and model IDs stripped and random letters per task.

Every time a new model joined, the whole field was re-graded together: a 4-way
pass, then 5, 6, 9, 10 and finally 11. All of them are kept in the repo.

## The results

From the final eleven-way blind pass, average score per task:

| Model | Harness | Effort | Avg / task | Time | Cost |
|---|---|---|---|---|---|
| **Sonnet 5.5** | Claude Code | extra | **9.31** | ~28 min | $15 |
| Fable 5.1 | Claude Code | extra | 8.96 | ~49 min | $53 |
| Opus 5.5 | Claude Code | high | 8.96 | ~21 min | $14 |
| Grok 4.7 (12 tasks) | Grok CLI | xhigh | 8.67 | ~80 min | $6.74 |
| GPT-6 Astra | Codex CLI | xhigh | 8.60 | ~35 min | tokens only |
| GPT-6.1 Sol | Codex CLI | xhigh | 8.52 | ~48 min | tokens only |
| muse | tincan | max | 7.21 | ~20 min | tokens only |
| GPT-6 Luna | Codex CLI | max | 7.10 | ~34 min | tokens only |
| mimo | tincan | default | 6.92 | not recorded | not recorded |
| MiniMax M3.1 Flash | mcode | xhigh | 6.81 | ~42 min | free preview |
| MiniMax M3 | mcode | default | 5.52 | ~9 min | 2% of a 5-hour window |

The field splits into four tiers, and the gaps between them are much bigger than
the grading noise:

- **Claude:** 9.0–9.3.
- **GPT-6 Astra, GPT-6.1 Sol, Grok 4.7:** 8.5–8.7.
- **muse, GPT-6 Luna, mimo, MiniMax M3.1 Flash:** 6.8–7.2.
- **MiniMax M3:** 5.5.

**Sonnet 5.5 came first in every single pass,** from the 4-way to the 11-way. In
the final one it had the best or tied-best score on 7 of the 13 tasks. Fable and
Opus ended level. It was neither the most expensive nor the slowest. On this evidence,
it is the default.

## The interesting bits

The winner is the least interesting row of that table. A few things I did not
expect:

**Grok 4.7 is two models in a trench coat.** Excellent code (9.75 and 10 on the
first two tasks), operations second only to Sonnet, frontend tied with Sonnet. Then
6.5 on social media and a forgettable story. It was also by far the cheapest in
dollars and by far the slowest, and it ran out of balance on task 13. I will be
re-running that one.

**GPT-6 Astra is the steady one.** The most consistent of the non-Claude models on
code and writing: a perfect bug fix, and an 8.75 story. Its frontends were its weak
spot. It also ran out of quota after task 9 and finished the last four on another
account, which brings me to the point that "how hungry is this model" depends on
the plan as much as the model. Similar token counts drained a 5-hour window on
one account and used 3% of the weekly quota on the other.

**The lower tier fails the same way.** Luna, muse, mimo and MiniMax M3.1 Flash have
different strengths, but their writing fails in one shared way: they invent facts
the brief never gave them. Flash's product plan scored 8.75 and its technical
writing 4.25. Structured work, fine. Prose where it has to stick to the source,
not fine.

**MiniMax M3 broke the rules, quietly.** The brief says no network and no work
outside the task directory. On task 04, M3 pip-installed 24 packages into my user
Python environment to run its release checks. On task 03, a mistyped path wrote a
copy of its `.env.example` outside its repository. Neither affected its grade,
because the graders never saw them; I found them afterwards. In fairness, mcode
does not let you pick M3's effort level, so it ran on a default that finished all
thirteen tasks in under nine minutes. It shows.

**The graders were not that stable either.** Between the 10-way and 11-way
passes, the same submissions moved by 0.36 points per task on average, and 11 of
129 moved by a full point or more. Model averages barely budged, though: everyone
except muse moved by 0.1 or less. Close calls in the table are close calls, not
verdicts.

## Who to hand what

The [report](https://github.com/c0ze/agent-evaluation/blob/main/evaluation/REPORT.md)
was required to recommend by work type rather than crown a single winner, so:

- **Code:** Sonnet, Fable or Opus. Astra and Grok are close behind.
- **Writing and planning:** Opus or Sonnet. Astra is the best non-Claude choice.
  Keep Grok away from customer-facing copy.
- **Incidents and operations:** Sonnet, with Grok and Astra as strong alternatives.
- **Frontend:** Sonnet. Grok for dense operational dashboards.
- **On a budget:** Opus or Sonnet at about $0.12 per point. Grok is cheaper still,
  if you can wait and can live with the variance.
- **The lower tier:** not for unsupervised work on these task types. M3.1 Flash is
  a reasonable second opinion on code and plans.

## The caveats, because there are always caveats

- **One run per model.** Another run could reorder neighbours within a tier. It
  would not merge the tiers.
- **The graders were Opus 5.5.** Three of the contestants are its family and one
  is itself. Blinding reduces that bias; it does not remove it. For what it is
  worth, Opus did not come out on top.
- **Effort levels differ.** Sonnet and Fable ran on extra, Opus on high, most of
  the GPT and Grok runs on xhigh. An Opus run on extra might score higher. This
  evaluation cannot say.
- **Harnesses differ.** This is a test of model plus harness, not of the bare
  model. That is how I use them, so that is what I measured.
- **Costs are not comparable across providers.** Claude's come from account
  balances, Grok's from its CLI, the rest are token counts and quota.

## Poke at it yourself

The whole thing is in [c0ze/agent-evaluation](https://github.com/c0ze/agent-evaluation):
the briefs in `_templates/`, each model's output, the rubric, every score file
from every pass, and each model's original run repository merged under `runs/`
with its commit history intact. The [results site](https://c0ze.github.io/agent-evaluation/)
has every task side by side, screenshots included, and links straight to each
frontend so you can click through them yourself.

If you think a grade is wrong, the submissions are right there. Grade them
yourself. That is rather the point of doing it blind.
