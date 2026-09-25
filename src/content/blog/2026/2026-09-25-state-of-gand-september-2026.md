---
title: "State of Gand, September 2026: fewer things, each paying its own way"
date: "2026-09-25"
excerpt: "A quarter of cutting, merging and pausing. The vigil.* apps stay free and Vigil Pro pays for the AI access, Skrivist splits into three products, FableSpun is paused, and SUDONE is on Android."
tags: ["status", "product", "ai", "mcp"]
keywords: "gand, state of gand, vigil pro, vigil today, vigil.wiki, vigil quest, vigil.directory, mcp server, skrivist, skrivist cloud, comics.skriv.ist, fablespun, sudone, indie studio"
description: "The September 2026 state of Gand: Vigil Pro as one subscription for AI-assistant access across the vigil.* apps, Skrivist split into two free readers and a paid Cloud plan, FableSpun paused, and SUDONE live on Android."
author: "Arda Karaduman"
image: "/images/og/2026-09-25-state-of-gand-september-2026.png"
draft: false
---

In June I put up a [tour of everything Gand makes](https://vigil.directory/gand/announcements/state-of-gand).
Gand is my one-person studio, and the tour was long. That was part of the
problem.

This is the follow-up, and it is a different kind of post. It covers fewer
products and asks each of them one question: how does it pay for itself?

Building has never been the hard part. I can build things in my sleep, and
judging by some of the commit timestamps, I sometimes do. The hard part is
getting small, careful tools in front of the people who need them. So this
quarter I cut, merged and paused until every remaining product had one job,
one way to earn its keep and one next step.

## The short version

- **The vigil.\* family is the main bet.** The apps stay free. One new
  subscription, **Vigil Pro**, lets your AI assistant work across Vigil Today,
  vigil.wiki and Vigil Quest.
- **Skrivist becomes three products:** two free readers that need no account,
  and one paid Cloud plan.
- **FableSpun is paused.**
- **SUDONE is live on Android**, with iOS next.

## The vigil.\* family

This is a set of small apps that share one account at
[vigil.center](https://vigil.center/). Every one of them is also an MCP server,
so an AI assistant such as Claude can read and act in it for you. That started
back in May as [an MCP server bolted onto Vigil Today](/blog/2026-05-28-vigil-today-now-tracks-inventory-and-talks-to-your-chatbot).
It has since become the organising principle of the whole family.

- [Vigil Today](https://vigil.today/): reminders and habits that drift from
  green to red as their moment approaches. [It's where this all
  started](/blog/2026-02-27-introducing-vigil-today).
- [vigil.wiki](https://vigil.wiki/): notes with backlinks, and one-click
  publishing.
- [Vigil Quest](https://vigil.quest/): long goals broken into milestones.
- [vigil.directory](https://vigil.directory/): the public face, where published
  notes live. The original of this post lives there.
- [vigil.computer](https://vigil.computer/): private AI that runs in your
  browser. It is on hold while I focus on the rest.

**What changed:** the web apps are free and stay free. The thing that actually
costs money is AI access at scale, so that is what I now charge for.
**Vigil Pro** is one subscription, bought once at
[vigil.center/pro](https://vigil.center/pro), that turns on AI-assistant (MCP)
access for Vigil Today, vigil.wiki and Vigil Quest together. It costs **$4.99 a
month or $39 a year**, with a 14-day free trial. It replaces the separate
per-app prices I had before, which were a pricing model only their author could
love, and it rolls out to each app over the coming weeks.

**Next:** getting the vigil connectors listed where people actually look for
them: the Claude and ChatGPT app directories, and the public MCP registry. An
MCP server nobody can find is just an API with extra steps.

## Skrivist

[Skrivist started](/blog/2026-02-16-introducing-skriv-ist-ebook-reading-management-app)
as one web app for reading and listening to your ebooks. It is becoming three
products, split by who they are for:

- [Skrivist Books](https://books.skriv.ist/): free, runs entirely in your
  browser, and needs no account. Read your EPUBs offline, browse OPDS catalogs
  and your Calibre library, and keep notes.
- [Skrivist Comics](https://comics.skriv.ist/): free and local too, for comics
  and OPDS libraries. [I wrote about building it last
  week](/blog/2026-09-19-comics-skrivist), including the part where I measured
  the model it was designed around and then deleted it.
- **Skrivist Cloud:** $4.90 a month with a 7-day free trial, for people who
  want their library synced across devices, read aloud, and fed from Calibre.

Most readers need nothing more than the free apps, and they get them without
handing over an email address. Cloud is being rebuilt around the new design
and will open when it is ready. [skriv.ist](https://skriv.ist/) has the
details.

## FableSpun: paused

[FableSpun](https://fable.tr/) spins illustrated, narrated stories from a
"series bible" of characters and worlds. It grew out of
[FableCast](/blog/2026-02-11-introducing-fablecast-fable-tales-as-imagined-by-ai)
and the [story creation studio](/blog/2026-02-15-creating-a-llm-powered-story-creation-studio)
behind it, and it ran a weekly multilingual library for young children.

I have paused it. Selling AI-generated products to children carries a
regulatory and moral responsibility that a one-person studio should not take on
lightly, and I would rather stop than do it halfway. The kids' edition no
longer takes new sign-ups.

The story engine itself is good, though. When there is time, I want to point
it at adults, for example graded story series for people learning a language.
There is no date for that yet, and I am not going to invent one here.

## SUDONE

[SUDONE](https://sudone.jp/) is a barcode scanner for shoppers in Japan. Scan a
product in a store, see what Rakuten and Yahoo! Shopping charge for it, and get
a straight answer: buy it here, or buy it online. There is no account to
create. [The June launch post](/blog/2026-06-20-introducing-sudone-barcode-price-check)
has the architecture, and the saga of the static IP.

It is on Google Play today, and iOS follows as soon as my App Store setup is
complete. Before I spend anything on promotion, I want to measure which prices
people actually act on. After that I am exploring a "restock at home" feature:
a price watch for the things you buy again and again.

## What's next

1. Vigil Pro rolls out across Vigil Today, vigil.wiki and Vigil Quest, followed
   by directory listings.
2. Skrivist Cloud gets rebuilt around the three-product split.
3. SUDONE reaches iOS and starts measuring what shoppers use.
4. FableSpun stays parked until I can give it proper attention.

Fewer things, done properly, each able to pay its own way. That's the state of
Gand in September 2026.

The original version of this post was drafted with an AI assistant through
vigil.wiki's MCP connector, reviewed, and published to vigil.directory the same
way. Eating my own dog food, for once, with a knife and fork.
