---
title: "Scraping (my own) health data from a health information app"
date: "2026-01-13"
excerpt: "How I bypassed SSL pinning and split APK restrictions to liberate my medical records from a closed mobile ecosystem."
tags: ["dev"]
keywords: "APK patching, SSL pinning bypass, health data export, Go web scraper, ADB split APK, MITM proxy, goquery, personal data liberation"
description: "Bypassing SSL pinning and split APKs to scrape personal health data: APK patching, MITM interception, and Go scraping."
author: "Arda Karaduman"
---

In an era where companies treat your personal health data as their private property, sometimes you have to reach for the digital scalpel. I recently encountered a "health" app that offered no export function, effectively holding my own medical history hostage behind a mobile WebView. This is the chronicle of how I liberated that data.

## The Objective
The goal was simple: intercept the HTTPS requests made by the mobile application, identify the data structures, and replicate the requests locally to save a structured archive of my records.

## The Obstacles
Modern mobile security is designed to keep you out of your own device. I faced three primary defensive layers:
1. **Certificate Transparency:** The app would only communicate with servers using its own hardcoded certificates.
2. **App Bundles (Split APKs):** The application wasn't a single file, but a distributed set of architecture-specific fragments.
3. **Non-Root Environment:** I needed to maintain the integrity of my device for banking and payment services, ruling out a traditional root-level interception.

## The Operation

### 1. Identifying the Target
Using a DNS-level logger, I identified the API endpoints. However, because the traffic was encrypted (HTTPS), the actual paths and payloads remained invisible. To see the "inside" of the requests, a Man-In-The-Middle (MITM) attack was necessary.

### 2. Needing a "Dark" Build
Since I couldn't force the system to trust my proxy certificate, I had to modify the app itself. I pulled the split APKs from the device via ADB:
- `base.apk` (The logic)
- `split_config.arm64_v8a.apk` (The architecture)
- `split_config.xxhdpi.apk` (The assets)

I bundled these into a single `.apks` file and used a patcher to rewrite the `network_security_config.xml`. This effectively castrated the app's security logic, forcing it to trust user-installed CA certificates.

### 3. Interception and Discovery
Once the patched app was re-installed, I routed its traffic through a proxy. The "high-tech" API turned out to be a series of legacy WebViews returning raw HTML. While disappointing from an engineering perspective, it made scraping trivial.

The URI schemes were particularly revealing:
`app-scheme://window.open?url=https%3a%2f%2fapi.target.net%2fv4%2f...`

## The Extraction Script
I authored a recursive scraper in Go using `goquery`. The logic was straightforward:
- Authenticate using the sniffed session cookies.
- Fetch the master record page.
- Parse the HTML for data labels and values.
- Unescape the nested "detail" URLs and dive into child nodes to extract granular charts and vitals.



## Conclusion
If a service provides no way to export your data, you don't actually own it—you're just renting it. By combining APK patching, ADB, and a bit of Go, I now have a local, structured JSON archive of my health history. 

**Next steps:** - Automating the cron job to keep the local archive in sync.
- Building a functional dashboard to visualize the trends without the bloat of the original app.