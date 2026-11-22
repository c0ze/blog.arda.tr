---
title: "The Beast in the Baud, and the Colab Units I Didn't Know I Had"
date: "2026-11-22"
excerpt: "A new music video for The Seventh Shadow: lip-synced singing for the first time, a guitar that plays itself, and a 4K upscale paid for with Google AI Pro's Colab units, which I found out about from a tweet."
tags: ["music", "ai", "video"]
keywords: "the seventh shadow, the beast in the baud, alienation by design, ai music video, lip-sync, minimax h3, mcode, fal, flashvsr, colab, google ai pro, 4k upscale, z-image turbo, qwen edit"
description: "How The Seventh Shadow's video for The Beast in the Baud was made: lip-synced takes on MiniMax H3, shots from local stills on fal, hidden joins, and a 4K upscale on a Colab A100 paid for with Google AI Pro perks."
author: "Arda Karaduman"
image: "/images/og/2026-11-22-the-beast-in-the-baud.png"
draft: false
---

So The Seventh Shadow has a new music video : The Beast in the Baud, track 5 of *Alienation By Design*. It isn't perfect, I know, but I think it's pretty stunning. Have a look first !

<div class="aspect-video my-8">
  <iframe
    class="w-full h-full rounded-lg shadow-lg"
    src="https://www.youtube.com/embed/95v_I6HF3Z8"
    title="The 7th Shadow - The Beast in the Baud"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  ></iframe>
</div>

## A tweet about Google perks

I saw somebody on X posting about the Google AI subscription perks most people dont know about, so I read it and went to look. I have Google AI Pro, and it comes with Colab compute units : 200 a month, each batch expiring 90 days after it arrives. I had never touched them, so about 600 were just sitting there.

What do Colab units actually do ? Well they basically buy GPU time, and an A100 costs about 6.7 units an hour. Which is enough for the step I had always skipped : a real AI upscale to 4K.

## Lip-sync was the real obstacle

My last video back in June, [The Recursion of Ash and Lightning](https://www.youtube.com/watch?v=vF6DKIVDGDM), was a cinematic lyric video. Painted stills from Gemini 3 Pro Image, camera moves and effects in Remotion, and five short Veo clips muted under the song. Nobody sings in it, cause I had no way to make a character sing my vocal.

For a long-form music video that's pretty much the main obstacle. You can only fill five minutes with atmosphere for so long, you need the singer on camera, and her mouth has to match the voice.

So this time the singing comes from MiniMax H3, through mcode on my MiniMax plan. Basically H3 takes reference pictures and a slice of the vocal stem, and mouths it. The takes from mcode came back with the voice at 0 ms offset. The catch is that a take is at most 15 seconds, so a long shot has to be several takes joined together.

The Beast in the Baud ended up with 31 singing takes on H3 and 32 shots without a singer on fal, made from stills I rendered locally with Z-Image Turbo and Qwen Edit on my own GPU.

## Effort levels

The first video I made this way showed the singer with a calm face over a belted line. Lip-sync was right, the effort was wrong.

So for The Beast in the Baud, every sung line got its level measured in dB on the vocal stem, and that level went into the prompt as physical cues on named words : jaw, brows, breath, neck. One line per 6-second take, two or three plain words for her demeanor, where her eyes go, and one simple camera move. Then each take was measured back from face landmarks, checking how far her mouth opens over the hardest part of the line. A good chorus opens 32 to 57%, anything under 10% looks mimed.

It can overshoot too though. One of Talciron's growl takes was little bit over the top, so it stayed in as a half-transparent layer.

## Hiding the joins

Since a take is 15 seconds at most, every join needs a reason to be there. Three tricks did most of the work : the camera passing behind her head, lightning pushing the cut to white, or the cyan cracks in her skin flaring. Where the two pieces didnt line up, a one-second cutaway zooms into a lightning bolt and the new piece opens zoomed on the bolt behind her.

It's better than plain cuts, but still not good enough. You can spot some of them.

## The guitar plays itself

Hands give AI away. I play guitar, so I read the fingering on every shot of Talciron playing, and the front shots were pretty bad, shots from behind weren't much better either. So nobody holds the guitar in the solo : it rises from the lake, hangs in the air, and he plays it from a distance like casting a spell. Worked on the first try !

## The 4K upscale

Underneath, the edit is 768P, which is what H3 renders. The upscale ran FlashVSR+ on a Colab A100, with the video cut into chunks at shot boundaries. That came to about 19 minutes per 30 seconds of footage, a session of just under four hours, and used about 31 Colab units. I wanted it on Colab and not on fal on purpose (the point was to use the free units, not to spend money).

## What it cost

The stills were nothing per image since they were all local, and fal came to about $10 for the shots without a singer. For H3, my MiniMax plan's weekly quota ran out after the first two test takes, so most of the singing was paid from $25 of credits I put on the account. And the upscale took about 31 Colab units, out of the ones I'd been ignoring.

Btw, all of it ran through Claude in the desktop app, with me watching clips and sending notes after each cut.

## What about I Yearn?

Actually, The Beast in the Baud wasnt the first video made like this. That was I Yearn, track 1 of the same album : one night, from the brief at 23:03 to a first final at 06:52, and the first one to get the 4K upscale too. I haven't released it though. Talciron shows up in different gear from shot to shot, the microphone changes, and he plays a couple of different guitars.

The Beast in the Baud came out better cause I could apply what I learned on I Yearn : effort levels, the join tricks, one reference picture for everything that recurs. Anyway, the I Yearn retakes are in progress, so that's next ...
