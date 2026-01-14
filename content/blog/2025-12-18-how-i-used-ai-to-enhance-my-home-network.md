---
title: "How I used AI to enhance my home network"
date: "2025-12-18"
excerpt: ""
tags: ["geek"]
keywords: "AdGuard Home, Tailscale VPN, self-hosted DNS, network ad blocking, home network setup, NAS DNS server, Magic DNS"
description: "Setting up AdGuard Home and Tailscale with AI assistance: self-hosted DNS, network-wide ad blocking, and secure remote access."
---

In this post I will document how I transformed my home network with the help of Gemini.

## Enter Adguard home

For about 3 years I have been using AdGuard on all my devices to block ads. But, I had my reservations about it. This is partly because of AdGuard's "questionable" origins, and partly about the fact that its apps are closed source. It's not really assuring to route your https traffic through a VPN based in Cyprus. Not that the country matters anyway, routing through anywhere is generally not a good idea.

So I confided in Gemini my reservations, and it came to me with the suggestion to use my own DNS on my network, since I already had a NAS. After a setup for about 2-3 hours my DNS was running, and I uninstalled AdGuard from all my devices. It involves configuring DHCP to set local DNS only, and blocking ipv6, because ipv6 tends to sneak in ISP DNS. [AdGuard home](https://github.com/AdguardTeam/AdGuardHome), unlike the AdGuard apps, is open source and community maintained. Also it doesn't do anything with the https traffic, we will come to that later.

This also gave me the option to have nice subdomains for my services within my network, which was a nice bonus. After blocking ad traffic within my network, and using a local DNS, I observed around 30%-40% improvement in my usage. I didn't quantify this, it is just how it feels, but it definitely feels snappier. Not only did I block undesired ad traffic, since my local DNS caches frequent domains, overall traffic was also faster.

But, this works purely within my own network. My phone, when I am outside, can not reach my DNS. So I have to turn it off somehow when I was on mobile network. When I consulted Gemini about this issue, it recommended I use Tailscale.

## Enter Tailscale

[Tailscale](https://tailscale.com/) is kind of a VPN service where you setup your own network and control the traffic within. You can configure it to route all your traffic through it, or just specific traffic. It is also free for personal use. Which kind of blows my mind because it is absolutely powerful.

After setting up Tailscale with my DNS and all devices including my phone, I now have a private VPN with my own DNS where I can block unwanted traffic. And it works wherever I am. There is also niceties like "Magic DNS" where you can access your devices by name. And an airdrop like feature where you can push files across devices. It is very convenient.

So far I had only one issue, regular banking apps worked ok, but when I tried to make a payment, I couldn't get a QR code from the app. There must be something blocking that. I will consult it with Gemini later and try to find a solution.

## Enter Matter

I have a couple of SwitchBot devices at home which I manage through the app. It is fine, but I have been wanting a way to access these from the web as well. It seems the answer to this is [Matter](https://matter.io/). I haven't configured this fully yet, but that will be the next project.

Anyway, so far I am very happy with this setup. And it cost me 0 yen. After ironing out some issues, it will be great.