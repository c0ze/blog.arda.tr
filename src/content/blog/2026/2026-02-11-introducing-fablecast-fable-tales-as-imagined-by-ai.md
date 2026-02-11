---
title: Introducing FableCast. Fable tales as imagined by AI
date: '2026-02-11'
excerpt: >-
  FableCast is an AI-powered children's book engine that writes, illustrates,
  narrates, and translates picture books—fully automated, seven languages, zero
  human artists harmed.
tags:
  - dev
  - ai
  - python
  - gcp
keywords: >-
  fablecast, ai children's books, gemini, imagen, google cloud tts, multilingual
  stories, story generator
description: >-
  How I built FableCast—a fully automated pipeline that generates illustrated,
  narrated children's picture books in seven languages using Gemini, Imagen, and
  Google Cloud TTS.
author: Arda Karaduman
image: /images/og/2026-02-11-introducing-fablecast-fable-tales-as-imagined-by-ai.png
draft: false
---

I am blessed with a daughter. She likes stories about animals, robots, and anything that flies. I like building things with AI. So I built a machine that writes her bedtime stories.

**FableCast** is a fully automated children's book engine. You feed it a character bible, press a button, and it outputs a complete, illustrated, narrated picture book—packaged as a mobile-friendly web app you can tap through like a real storybook. It does this in seven languages.

![FableCast Storybook Illustration](/images/og/2026-02-11-introducing-fablecast-fable-tales-as-imagined-by-ai.png)

## How It Works

The pipeline is a Python orchestration layer that chains three Google Cloud AI services together:

1. **Gemini** writes the story. It receives a "Series Bible"—a JSON config that defines the character, art style, tone, world rules, and supporting cast. From that, it generates a plot outline, page-by-page text, image prompts, and emotional beats. There are seven story structure templates (hero's journey, friendship arc, mystery, etc.) so the output does not feel repetitive.

2. **Imagen** draws the illustrations. Every image prompt is injected with the character's visual anchor description and the series art style to keep things visually consistent across pages. The result is a set of WEBP images—one per page.

3. **Google Cloud TTS** (or Gemini TTS) narrates the story. The audio is batch-normalized for consistent loudness, then transcoded to Opus in WebM containers for mobile-friendly streaming. Text reveals progressively in sync with the audio playback timing.

The output for a single book looks like this:

```
web/{seed}/{language}/{series-slug}/
  ├── index.html
  ├── app.js
  ├── styles.css
  ├── book.json
  ├── images/     (WEBP)
  └── audio/      (WebM/Opus)
```

Each book is a self-contained static web package. No server needed. Upload to a bucket, point a CDN at it, done.

## The Characters

I currently have six series, each with its own bible:

- **Rusty** — A small, round, rusty orange robot who explores the world with wide-eyed curiosity.
- **Captain Barnacles** — A deep-sea explorer whale who sails the seven oceans.
- **Astro-Bun** — A bunny astronaut bouncing across the solar system.
- **Pippa** — A little propeller plane discovering new places.
- **Professor Hoot** — A wise old owl who solves mysteries in the forest.
- **Grug** — A friendly garden creature who tends to plants and learns about nature.

Each character has a fixed visual anchor (so Imagen draws them consistently) and a defined tone. Rusty's stories are heartwarming and curious. Professor Hoot's are cerebral and mysterious. Grug is gentle and earthy.

## Seven Languages, One Pipeline

The engine generates a "master" English book first. Then it automatically translates the text into Turkish, Japanese, Spanish, Portuguese, French, and German—while reusing the same illustrations. Translation uses the Google Cloud Translation API with term constraints from the bible (character names, place names) followed by a Gemini post-editing pass for naturalness.

Each language gets its own TTS narration with native voices. The Japanese version sounds Japanese, not English-with-an-accent.

## The Seeded Pipeline

To manage API quotas and costs, I split generation into stages:

1. **Seed generation** — Text, layout, and image prompts only. No paid API calls.
2. **Image generation** — Calls Imagen for each page illustration.
3. **Audio generation** — Calls TTS for each page narration.
4. **Sanity check** — Validates that every page has its text, image, and audio.

Each seed gets a timestamp ID like `202602110004`. You can re-run individual stages if something fails without regenerating everything from scratch. There is also a Batch API path for bulk runs to keep costs down.

## The Landing Page

The consumer-facing side lives at [fablecast.kids](https://fablecast.kids)—a React SPA with Firebase authentication, Google Sign-In, and a simple two-tier membership:

- **Free** — 6 sample books (one per series), full reading experience with audio. No card required.
- **Member** — Full library access, all series, all languages, new stories weekly. Starts at $4.99/mo.

The twist is the pricing model. Instead of upselling you into higher tiers, the price *decreases* the longer you stay subscribed:

| Phase | Price | When |
| --- | --- | --- |
| 1 | $4.99/mo | Months 1–6 |
| 2 | $3.99/mo | Months 7–12 |
| 3 | $2.99/mo | Months 13–24 |
| 4 | $1.99/mo | Months 25–36 |
| 5 | $0.99/mo | Months 37–60 |
| 6 | Free | After 5 years |

The logic is simple: your kid grows up with the service, the price goes down with them. After five years, it is free forever. This removes the "should I cancel?" friction entirely—you are always heading toward a better deal by staying.

There is also a **Lifetime Membership** for $99—one payment, full access to everything forever, current and future content included.

The landing page has an interactive language demo (switch between 7 languages live), a story carousel with touch swipe, and an onboarding flow that collects the child's preferred language and series selection.

## The Philosophy

The business model is what I call "Broadcast." It is the Netflix model applied to children's books: generate one high-quality story per batch, serve the same content to all subscribers. The value is in *curated quality*, not infinite quantity. Nobody wants a thousand mediocre stories. They want six good ones this week.

Every component—text, illustration, voice—is AI-generated. But the creative direction is human. The bibles, the character designs, the tonal guidelines, the story structure constraints—those are all hand-crafted. The AI is the factory floor. I am the product designer.

## What is Next

The infrastructure is deployed on GCP (Cloud Run Jobs, Cloud Storage, Terraform). The pipeline runs, the books ship, the landing page is live. The next steps are growing the library, tuning the story quality, and eventually adding more characters.

If you have a kid between 3 and 8, give it a look: [fablecast.kids](https://fablecast.kids).
