---
title: "AI Hot Takes: Understanding Codebases, the Navier-Stokes Scoop, and Paid Doom"
date: "2026-09-09"
excerpt: "Three opinions I will not be taking back: Theo is right about not understanding your codebase, the Navier-Stokes scoop is an ethics problem even if it is not a theft, and some of the AI fear you are reading has an invoice attached."
tags: ["ai", "opinion", "hot-takes"]
keywords: "theo codebase, navier-stokes openai buckmaster alpoge, sabine hossenfelder paid ai doom, ai ethics, vibe coding"
description: "My hot takes on Theo's codebase take, the OpenAI Navier-Stokes drama, and Sabine Hossenfelder's exposé of paid AI doom content."
author: "Arda Karaduman"
image: "/images/ai-hot-takes-og.jpg"
draft: true
---

Three things from the last few weeks of the AI scene that I have opinions
about. You are getting the opinions whether you want them or not.

## Theo is right, and most of the pitchforks did not watch the video

Theo recently posted [Stop Pretending You Understand Your
Codebase](https://www.youtube.com/watch?v=5KvY8CnBB3w) (reacting to Sean
Goedecke's [In defense of not understanding your
codebase](https://www.seangoedecke.com/in-defense-of-not-understanding-your-codebase/)),
and the internet did what the internet does.

I listened to the take, and then to the criticism of the take. I am mostly on
Theo's side, and I think the hornet's nest he poked was mostly
misunderstanding, amplified by the polarizing effect of social media.

As far as I understand, he did not say "you don't need to know ANYTHING about
your codebase, you can just vibe it away" — which is what most of the
criticism alleges he said. No. He explicitly says you need to know the
domains and the compartments of your project, which part does what, and that
you can orchestrate your agents to do the grunt work while you decide on the
overall architecture.

This mostly aligns with my own experience. Gone are the days where you need
to align two APIs end to end by hand and hand-craft the interfaces between
them. Instead, you can sit back and decide which component needs to do what,
and how. How you persist your data and how you expose it. That part is not
going to be vibe-coded away, and it still holds value.

Unfortunately, the internet took the title as "you don't need to know
anything, just tell it what you want it to do" — which is not the case. This
is a common pattern on social media, and it is a polarizing one: people look
for things they want to hate and come out with pitchforks.

Social media is a high-pass filter for discourse. It strips the slow, smooth
baseband of an argument — the caveats, the nuance, the actual content — and
amplifies only the spiky, outrageous edges. A forty-minute video about
partial understanding in large systems goes in; "Theo says understanding
your code is for suckers" comes out. Then everyone reacts to the edge, and
nobody heard the signal.

## The Navier-Stokes scoop

This one is uglier.

As far as I know, the mathematician [Tristan
Buckmaster](https://cims.nyu.edu/~tristanb/statement.pdf) and [Levent
Alpöge](https://x.com/__alpoge__/status/2097206973418611054) — an Anthropic
employee, working in a personal capacity — had been working on a solution for
the better part of a year, using Claude and Codex. OpenAI had wind of it.
They scrambled a team, pointed their latest unreleased model at the problem
with [ten thousand concurrent agents and millions of dollars of
compute](https://openai.com/index/navier-stokes-solution/), and snatched the
result before Tristan and company could finish. [OpenAI's
announcement](https://x.com/OpenAI/status/2097375276384567642) came within
hours of the pair's own release, and [Bubeck's
response](https://x.com/SebastienBubeck/status/2097379411691516310) to the
accusations is its own reading experience.

The problem here is that Tristan and company used Codex to work on the
problem, and they accuse OpenAI of using their prompts and their approach to
crack it.

Unfortunately, I am not sure we will ever be able to determine how much
OpenAI knew of their effort, how much of it they used in their attempt, or
whether their model was trained on Tristan's approach. OpenAI's own statement
says it best, in the way only a legal department can: they did not access
their work, but they "cannot rule out" that de-identified data derived from
their usage helped improve the models. Read that sentence twice.

My take: the novelty here belongs to Tristan and team. OpenAI should have
approached them and offered their latest model to help finish the job,
instead of scrambling their own team and pushing Alpöge off the podium. It
would have been much better publicity — at the end of the day, it was
OpenAI's model that cracked the thing, even though the guy is an Anthropic
employee. "An Anthropic mathematician solved a Millennium problem using our
models" is the best advertisement OpenAI could never buy, and they traded it
for a scoop and a PR fire.

It also brings AI work ethics into question. How can you trust a non-local
model if it is going to be abused this way? Granted, 99% of user chats, I
think, do not involve novel stuff. Personally, I will keep working with
OpenAI models, because there is nothing in my sessions OpenAI would want.
But it is still an ethical question, and we should expect AI companies to
respect the attribution of novel ideas instead of trying to snatch them away.

## Sabine's exposé: some of the doom has an invoice attached

Finally: Sabine Hossenfelder's latest exposé, where she says she was
approached by certain "parties" and offered money to talk badly about AI —
to make doomsday videos about how it will take your jobs, pollute the
planet, and so on. (She declined, and then dug into who else got similar
offers. Worth watching.)

This is concerning because it leaves the public in a difficult state: who
are we going to trust?

The upcoming Anthropic and OpenAI IPOs signal increasing tension with the
existing corporate structure. AI is going to be disruptive, and there are
incumbents who want to stop it from taking over their domains. That is
understandable. But it also means we need to apply a discount when we
encounter fear-mongering about AI development.

For example: today, an Anthropic employee resigned, citing concerns over AI.
How can we trust this individual's judgement if there is a possibility they
are being paid to talk like that? I am not saying they were. I am saying
Sabine's video is the reason the question now has to be asked at all. That
is the actual damage: not that one side is right, but that the signal-to-noise
ratio of the whole conversation just dropped another notch.

Between the high-pass filter of social media and the sponsorship invoices of
both camps, the honest signal is getting hard to hear. Keep your own counsel.
