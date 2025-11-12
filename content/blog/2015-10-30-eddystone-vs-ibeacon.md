---
layout: post
title: "Eddystone vs iBeacon"
date: "2015-10-30"
comments: true
tags: [dev]
draft: false
---

If you are interested in IoT, you've probably heard of Estimote. They are probably the leading beacon
provider in the IoT field and that's for a good reason. We've had [their dev kit](http://estimote.com/#jump-to-products) for a while,
and had since been using them happily ever since. Their beacons quality is top notch, software frequently
updated, and customer service usually responsive.

As of recently, [Estimote annouced support](http://blog.estimote.com/post/124002171455/estimote-brings-full-compatibility-of-new)
for [Google's Eddystone protocol](https://github.com/google/eddystone), a
beacon broadcast protocol which is a competitor to [iBeacon from Apple](https://developer.apple.com/ibeacon/). I will admit that
I am a pretty much hopeless Google fanboy, since their products tend to give end users more freedom. But this time, we had a
much better, concrete reason to jump ship from iBeacon to Eddystone, _fleet management_.

When iBeacon was launched, fleet management was probably not a very big concern, and Apple probably
left it totally to the app developers, out of the protocols scope. Because of this, iBeacon supports only a simple UUID broadcast scheme.
To get more specific info about the beacon, you need to poll this from the beacon directly. This
is where things get ugly though, because polling information from the beacon also brings security concerns
to the table. While Estimote has a key based security protocol, [it was shown that it could be hacked](http://beekn.net/2014/01/can-estimote-be-hacked/)
and while [Estimote have since updated their security protocol](http://makezine.com/2015/08/28/estimote-fixes-security-problems-with-beacon-firmware/),
beacon polling is still a pretty big security concern. And it is currently the only way to get other information (battery level, temperature, sensor readings etc)
from your beacon, if you're using iBeacon as the broadcast protocol.

And that is where Eddystone steps in. Eddystone supports three packet types, UID, URL, and TLM (which stands for telemetry). UID packet is a iBeacon
type packet which transmits a UID, for providing context information to your app. URL transmits a URL (no surprises there) and its use case
is quite different, please check [Physical Web](https://google.github.io/physical-web/) if you are interested. An eddystone beacon is meant to be
configured to broadcast either one of these two schemes, and in addition to these, it will also transmit a TLM packet, which will contain its
battery level information and any other sensory data. This mitigates the need to poll the beacon, and obviously, the less you connect to it, more secure it is.
Which prompted us to step in and jump ship to Eddystone.

Configuration on Estimote side was a breeze. With just a couple of taps on the official app, our beacons were transmitting Eddystone UIDs.
Configuration on our backend was not so straightforward though. Since Eddystone is relatively new, I couldn't find any decoding libraries
for Go. That's why I had to write [Goodystone](https://github.com/c0ze/goodystone). I also prepared this [bash script](https://gist.github.com/c0ze/0f02d46b82fa375589ba)
to play around and confirm my results. (While I was at it, I also refactored my iBeacon decoding logic to its own repo as well, which became [I Be Gone](https://github.com/c0ze/iBeagon) haha, see what I did there ?)

In the end, this TLM packet really saved the day for us, because it was obvious polling the beacons for this would bring lots of issues. Another day
to thank the big G I guess !
