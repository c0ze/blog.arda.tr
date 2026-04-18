---
title: "making a football analytics site"
date: "2026-04-18"
excerpt: "I built a static Super Lig analytics site with a Python scraper, an embedded SQLite database, a ReScript frontend, and a mildly annoying GitHub Pages deployment puzzle."
tags: ["dev", "rescript", "data", "football"]
keywords: "super lig analytics, rescript frontend, sqlite in browser, sql.js, transfermarkt scraper, github pages custom domain, football data site"
description: "How I built super-lig.arda.tr: a static Turkish football analytics site powered by a Python scraper, browser-side SQLite, ReScript, and GitHub Actions Pages deployment."
author: "Arda Karaduman"
image: "/images/2026-04-18-making-a-football-analytics-site-og.jpg"
draft: false
---

I wanted a simple site for Turkish football data that did not depend on a backend, did not need a database server, and did not force me into some SaaS dashboard just to answer basic questions about a season. I wanted standings, scorers, team pages, match timelines, and some weird little metrics that are very legible if you watch the league and totally deranged if you do not.

So I built [super-lig.arda.tr](https://super-lig.arda.tr).

It is a static site. The data is scraped ahead of time with Python, written into SQLite, shipped to the browser, and queried client-side through `sql.js`. No API server. No runtime infra. Just HTML, JS, a `.db` file, and a custom domain.

This is the kind of architecture I keep drifting toward. If I can make the browser do the last mile and keep the moving parts low, I will. It is the same instinct that pushed me toward [GitHub Pages for this blog](/blog/2025-11-12-moved-everything-to-github-pages), just pointed at football instead of markdown.

![Super Lig Analytics Site](/images/2026-04-18-making-a-football-analytics-site-og.jpg)

## Why this exists

There are plenty of sports sites already. That was not the point.

The point was to have a site shaped around the questions *I* actually want to ask:

- what did a given season look like in one glance?
- who scored the most?
- what happened minute by minute in a given match?
- how does a team's history look when scoped by season instead of dumped into one endless list?
- and, because Turkish football discourse is incapable of ever being normal, which teams had the most **kollandığı maçlar**?

That last one was the most fun. In English I called it **propped up games**: matches where a team was level or behind, then got a penalty or saw the opponent receive a red card. Petty? Absolutely. Also a surprisingly interesting data point.

## The stack

The shape ended up being:

- **Scraper:** Python
- **Storage:** SQLite
- **Frontend:** ReScript + React + Vite
- **Browser DB:** `sql.js`
- **Hosting:** GitHub Pages
- **Domain/DNS:** Cloudflare + `super-lig.arda.tr`

I had just written about [ReScript vs Gleam for frontend work](/blog/2026-04-01-rescript-vs-gleam-is-it-worth-to-write-your-frontend-in-a-typesafe-functional-language), and this project became a nice real-world confirmation of that verdict. This was exactly the kind of UI where ReScript makes sense: not a gigantic product app, but a real frontend with routing, state, database queries, and enough moving pieces that compile-time guarantees actually help.

The data source is Transfermarkt. The scraper walks season fixture pages, collects match IDs, fetches individual match reports, and stores both the fixtures and timeline events locally. That part sounds simple until you remember that scraped sports data is never really "just goals and cards."

## The annoying parts

The first version was fine until I started wanting better event detail.

The usual issues showed up:

- second yellow cards needed to be treated as red in the UI
- penalty goals needed to be labeled as penalties
- missed penalties needed their own event type
- unplayed future fixtures showing `-:-` needed to be ignored entirely
- and once I wanted `kollandığı maçlar`, I needed richer event state than just "something happened at minute 80"

So the event schema got more serious. Each event now keeps minute labels, stoppage-time parts, subtype/detail text, event ordering, and score snapshots before and after the event. That makes the timeline better, but it also makes derived metrics possible.

That last part matters. If you want to ask whether a team was helped by a red card or penalty while level or behind, you need the running match state. SQL can do a lot, but it is much happier when you give it the actual facts instead of making it reconstruct a whole match from scratch every time.

## What the site actually does

The current site has:

- a dashboard with season archive cards, standings, scorers, and recent matches
- season pages
- team pages scoped by season, with tabs for older seasons
- match pages with a timeline view
- Turkish / English UI toggle
- the `kollandığı maçlar` / `propped up games` drill-down

The match timeline ended up being the feature that made the site feel real rather than theoretical. A scoreline is one thing. A timeline that shows the goals, cards, substitutions, missed penalties, and the general emotional collapse of a match is another.

I also like that the team pages are no longer one giant undifferentiated archive. They default to the latest season, and older seasons live behind tabs. That feels much closer to how people actually think about teams.

## Browser-side SQLite is still a good idea

I know this sounds cursed if you have spent too long around "proper architecture" people, but shipping SQLite to the browser works extremely well for this sort of thing.

The site loads the embedded database, opens it with `sql.js`, and runs local queries for standings, scorers, timelines, and team summaries. That means:

- no backend to deploy
- no API contract to maintain
- no live server to pay for
- one artifact to publish

You trade away truly live data, but I am scraping this periodically anyway, so that is fine. The static approach is a better fit than pretending this needs to be a constantly running service.

## The deployment bug

The site is live now, but that was the last thing to fall into place.

The frontend was already building correctly. The `CNAME` was correct. The custom domain was set in GitHub Pages. The DNS looked close enough to plausible to waste an hour on. And yet visiting the domain gave me the deeply insulting GitHub Pages "there isn't a site here" page.

The problem turned out to be a mismatch in deployment models.

The workflow was publishing static files through a third-party action to a `gh-pages` branch, while GitHub Pages itself was configured for **GitHub Actions** as the source of truth. In other words, the site *was* being built, but not in the way GitHub Pages was expecting to serve it.

The fix was to stop being clever and use the official flow:

- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

Once the workflow matched the Pages configuration, the site came up properly. Cloudflare still got to be mildly annoying, because Cloudflare always wants to remind you that DNS is not a protocol so much as a personality test, but the core issue was the workflow mismatch.

## The part I like most

I like that this is a small site with real opinions.

It is not trying to become a universal football data platform. It does not have fifty filters and an ad stack and ten popups asking me to install an app. It just does a handful of things I care about, and it does them with a stack I enjoy using:

- Python for scraping
- SQLite for storage
- ReScript for the frontend
- GitHub Pages for deployment

That combination feels weirdly durable. There is very little here that can break operationally once the data is built and the artifact is deployed.

And because apparently I cannot stop making projects that revolve around scraping and structuring stubborn data, this now sits nicely next to earlier efforts like [scraping my own health data from a hostile app](/blog/2026-01-13-scraping-my-own-health-data-from-a-health-information-app). Different domain, same impulse: if the data matters, I want it local, queryable, and shaped around my own use case.

## Live site

The site is up at [super-lig.arda.tr](https://super-lig.arda.tr).

It is still the kind of project that will keep growing little teeth over time. There are more views I want, more metrics I want to add, and the data pipeline can always get richer. But the core is there now: scrape, ship, query, browse.

Which is honestly my favorite kind of web app.

PS: __Mayıslar bizimdir...__