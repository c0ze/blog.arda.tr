---
title: 'Introducing Skriv.ist: A web-based ebook reading and management app'
date: '2026-02-16'
excerpt: >-
  Skriv.ist is a web EPUB reader focused on simple setup, cross-device sync, and
  a comfortable reading experience.
tags:
  - ebook
  - product
  - webapp
keywords: 'skrivist, epub reader, ebook manager, pwa reader, cross-device sync'
description: >-
  Introducing Skriv.ist, a web-based EPUB reader and library manager with home
  screen install, cloud sync, reading themes, and ambient sounds.
author: Arda Karaduman
image: /images/og/2026-02-16-introducing-skriv-ist-ebook-reading-management-app.png
draft: false
---

Over the years I used lots of e readers. From the first kindles, to nooks, kobo at times to obscure MARS readers, Pocketbook, and finally a Boox Page. I also used lots of epub reading apps on android. There are some good ones, but I never found something that satisfied all my needs. When I settled on one, they disappeared from the store and was never heard of again. Others were either too barebones, or too over engineered, or locked to single ecosystem etc.

[Skriv.ist](https://skriv.ist) is my dream epub reader. It is built for readers who want a clean EPUB experience without dealing with heavy installs or fragmented libraries. You just upload your book and you are ready to go. Your progress is saved whatever device you login from.

The goal is simple: make reading and managing ebooks easy across devices, while keeping the app fast, flexible, and enjoyable to use.

## Why Skriv.ist

[![Skriv.ist App](/images/skrivist.png)](https://app.skriv.ist)

Most ebook workflows are either locked into a single platform or require too much setup.

Skriv.ist takes a web-first approach:

- No traditional app install. Just open it in your browser and add it to your home screen.
- Works across iOS, Android, and desktop.
- Keeps your library and progress in sync.

## Current Features

Right now, Skriv.ist already covers the core reading flow:

- No app store install required. Add to home screen and use it like an app.
- Cross-device EPUB sync across iOS, Android, and PC.
- Library sync support for up to 10 books.
- Multiple reading themes: Light, Dark, Sepia, and ePaper mode.
- Integrated ambient sounds for longer reading sessions.
- Free public domain books included for testing and exploration.

## What is coming next

There are still quite a bit of features I intend to add. Some of these are already working in dev build, but need some tweak before release. The roadmap looks like this:

- Calibre integration.
- Text-to-Speech (TTS), with both free and paid options.
- Custom TTS server support.
- OPDS support.

Some of these features will be behind a paywall, cause I need to be able to pay for the servers. There are lots of good quality light weight TTS services coming out recently, so it is a good time for open source TTS. TSS feature will be a paid feature, but I will allow people to run their own TTS server if they so desire. I will publish an API spec which skrivist expects so you can run your own TTS and connect skrivist to it. 

## What will not be coming

PDFs. Trying to read PDFs on mobile usually leads to frustration, so I will not be pursuing that goal. If you need to consume lots of PDFs, you are better off with a dedicated reader anyway.

ADs. I hate ads. Last thing you want on your reading app is distraction. The contract is simple, you can download and use skrivist with its free features. If you want to unlock paid features, you pay for them. No middle ground, to diluted experience, no compromise. 

No lock in. You can download your books and your data anytime. Currently we require a google account to login. This is necessary for the infra we are working with. But that's it. No tracking, no telemetry, no data selling. 

## Closing

Skriv.ist is still evolving, but the foundation is in place: fast web access, synced reading, and a focused user experience. Just you, and your books.

If you read across multiple devices and want a simpler EPUB workflow, this project is made for you.
