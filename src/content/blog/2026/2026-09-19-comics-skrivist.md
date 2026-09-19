---
title: "comics.skriv.ist: panel-by-panel comics in the browser, and the classifier that did nothing"
date: "2026-09-19"
excerpt: "I set out to build guided-view comic reading on top of a new decision model. I ended up shipping a reader that runs entirely in your browser, and deleting the model it was designed around after measuring that it answered the same thing nineteen times in a row."
tags: ["ai", "dev", "webgpu", "onnx", "comics", "skrivist"]
keywords: "guided view comics, panel detection, onnxruntime-web, browser inference, yolo manga109, jev typesafe, local first, comics.skriv.ist"
description: "How I built comics.skriv.ist — guided-view comic reading entirely in the browser with no server — and why the decision model the project was designed around got measured and removed."
author: "Arda Karaduman"
image: "/images/og/2026-09-19-comics-skrivist.png"
draft: false
---

Kindle has a feature called Guided View. Instead of showing you a whole comic
page on a phone screen the size of a playing card, it walks you through the
page one panel at a time. It is genuinely the only way to read comics on a
phone. It is also, as far as my own library is concerned, unavailable — my
comics live in a Kavita instance on my NAS, and Kavita shows you whole pages.

So: build it. And there was a nice hook. A lab called TypeSafe had just
released **Jev**, a "System One model" that does not generate text at all. You
hand it some state and a set of typed questions, and it hands back typed
answers with calibrated probabilities. Fast, absurdly cheap, and exactly the
shape of "look at this comic page and tell me where the panels are."

Except it is not that shape at all, and finding out why took the whole project.

## The first thing I got wrong

Jev cannot look at a comic page. It takes text or structured fields; TypeSafe's
own docs tell you to convert images to something textual before sending them.
And it returns choices, scores and booleans — never coordinates.

Panel detection needs bounding boxes. That is a *detection* problem, not a
classification one. No amount of prompt shaping gets rectangles out of a model
that cannot emit rectangles.

Fine. Relocate it. Real object detection would find the boxes, and Jev would
make the decisions *around* the boxes: is this page a grid or something
ragged, is it half of a double-page spread, does this book read left-to-right
or right-to-left, and how much should we trust this segmentation? Structured
state in, typed decision out. Still a good fit, I thought.

Hold that thought for about two thousand words.

## The parts that worked

Detection turned out to be the easy half. The first model I picked was a
YOLOv12x fine-tuned on western comics. It was fine. Then I benchmarked it
against a nano model trained on **Manga109-s**, and the nano model won on
every axis at once:

| | YOLOv12x (western) | yolo26n (Manga109-s) |
|---|---|---|
| exact panel counts | 7 / 11 | **10 / 11** |
| pages cut cleanly | 11 / 36 | **16 / 36** |
| inference | 469 ms | **37 ms** |
| weights | ~120 MB | **15 MB** |

It is trained on manga and it beats the western-trained model *on western
comics*. Dataset size and annotation quality beat domain match, at least here.
That swap alone fixed three of the four failure modes I had catalogued.

Ordering the panels was more interesting. My first attempt banded boxes into
rows and sorted each row — which works right up until a page has a tall panel
spanning two rows, at which point that panel overlaps every row and the whole
structure collapses. A real Solomon Kane page caught it: the reader went
top-left, top-right, then the *lower* right panel before the upper one.

The fix is a **recursive X-Y cut**: split the page at gutters that run clear
across it, horizontally first, then vertically, and recurse. If a block cuts on
neither axis, the boxes overlap, any order is a guess, and the honest move is
to show the whole page instead. That last clause matters more than it sounds.

## Two rounds of being wrong in public

I ran every change past Grok as a review gate, through
[tincan](/blog/2026-07-03-introducing-tincan-two-cans-and-a-string-for-ai-agents).
Three passes, ten defects. **Three of the ten were introduced by my own
fixes**, and those were the interesting ones, because each was plausible,
tested, and wrong for a reason that lived in a different file.

The best of them: to handle a book whose reading direction changed, I made the
client throw away the stale cached page and ask the detector to redo it. Except
the detector's cache-hit path returned the stored document unchanged — so it
handed back the same stale file, the client accepted it, the wrong order played
anyway, *and* it woke a sleeping desktop on every single page of the chapter.
My fix was strictly worse than the bug. Grok found it in pass two.

Then the real Kavita API broke four things I had written against documentation:
the port was Synology's DSM rather than Kavita, the API key lived in a table I
was not reading, one endpoint did not exist, and a chapter payload carries no
series ID at all — which mattered because reading direction is a *series*
property, so every manga would have read backwards.

None of that is exotic. It is the ordinary tax on believing documentation over
observation.

## The measurement that killed the premise

By this point Jev had been in the pipeline for days, quietly answering four
questions per page. I had even tested it early and been impressed: given a
perfect synthetic grid it scored 0.87, given a deliberately broken page 0.27,
given five identical stacked boxes 0.07. Clean, monotonic, exactly what you
want from a confidence signal.

Then I ran the whole thing over a full 36-page issue with and without it.

| | pages guided |
|---|---|
| geometry alone | **16 / 19** |
| geometry + Jev | **14 / 19** |

It rescued zero pages and blocked two that cut perfectly cleanly. And the
per-question breakdown is the part I keep thinking about:

- `layout` — answered **`grid`** on all nineteen pages
- `spread` — **never** flagged one, across thirty-six pages
- `direction` — answered **`rtl`** for the manga *and* for the Conan issue
- `confidence` — scored pages the geometry could not cut (0.67, 0.59, 0.66)
  *higher* than clean pages it rejected (0.39, 0.45)

Every single answer is a constant. My early test looked convincing only because
it compared synthetic extremes. Between real pages that all look broadly alike,
there is no signal at all.

The reason is structural, and it is the same thing I had noticed on day one and
then talked myself past. **Jev sees a list of rectangles.** Manga pages and
western pages are both grids of rectangles — the difference is in the artwork.
Whether a box lines up with a drawn panel border is a fact about the *image*.
I had handed a model a set of features that simply do not contain the answers
to the questions I was asking, and then spent days tuning thresholds around its
noise.

So I deleted it. The project got faster, better, and lost its only external
dependency, its API key, and its per-page network round trip. This is not a
knock on Jev, which is a perfectly good classifier being asked to do
photogrammetry. It is a knock on me, for keeping it after the first red flag
because I had already built around it.

## The pivot

Somewhere in there the obvious question arrived: if detection is a 15 MB model
and 37 ms of CPU, why is any of this on a server?

I exported the model to ONNX — 9.3 MB — and tested it in a browser. It worked
first try. And that changes the whole shape of the thing, because the moment
files never leave the machine, an entire category of problem evaporates. No
storing other people's comic scans. No DMCA apparatus. No per-user storage
bill. No payment processor deciding one morning that you are a piracy locker.

There is a licensing angle too, and it is not a footnote. The weights are
Apache-2.0, but the usual runtime — Ultralytics — is **AGPL-3.0**, and AGPL
treats network use as distribution. Running it behind a subscription service
obliges you to hand users your source. Exporting the graph and running it under
`onnxruntime-web` (MIT) sidesteps that entirely: the AGPL tool is a build-time
step, and never ships.

So [comics.skriv.ist](https://comics.skriv.ist) is what I actually built. Drop
in a CBZ, CBR or PDF. It finds the panels in your browser and reads them one at
a time. No account, no upload, no server — once the page and the model are
cached it works with the network off.

| | |
|---|---|
| model download | 9.3 MB, cached after the first book |
| detection, 4 wasm threads | **~95 ms per page** |
| detection, 1 thread | ~253 ms per page |
| a 22-page issue | **~2.1 s** |

And it agrees with the Python detector exactly: 11 of 11 pages on the
adjudicated golden set return identical panel counts.

It is free. I had been sketching a five-dollar subscription with cloud sync,
and the honest version of that business turned out to be "become a liability
warehouse for other people's scans." The local version is a better product
anyway, and it costs me nothing to run, which is a pleasant thing to be able to
say about a web app in 2026.

If the browser-as-runtime idea appeals, I went down the same road with language
models in [made a web app to test edge ai](/blog/2026-04-23-made-a-web-app-to-test-edge-ai)
— different model, identical thesis: ship the weights, let the user's hardware
do the work, keep the backend at zero.

## What I learned

> A model can be fast, cheap, well-calibrated and completely useless, if the
> features you hand it do not contain the answer. Measuring that takes an
> afternoon. Assuming it takes a project.

The other half: I nearly did not run the ablation. Jev had been in the pipeline
so long it had stopped looking like a decision. If you have an LLM sitting in a
pipeline that you have never tried removing, try removing it. Mine was
subtracting.

Now if you will excuse me, I have about four hundred issues of Conan to
re-read, one panel at a time.
