---
title: "812 Programs From a 1980s Turkish Magazine, and 682 of Them Run"
date: "2026-11-09"
excerpt: "dergi.coze.org now has the type-in listings from Commodore's Program Döküm Eki, issues 1–78, as .prg files you can run in the browser. Agents read them back from the scans and checked every line against the checksums the magazine printed for its readers. 682 of 812 programs work. This is how, and why the other 130 don't."
tags: ["retro", "c64", "commodore", "dergi", "agents", "ocr", "vice", "turkish"]
keywords: "commodore program döküm eki, commodore dergisi, type-in listings, c64 type-in programs, turkish computer magazine, teleteknik, mde bde checksum, c64 basic listing ocr, machine code listing ocr, vice emulator headless, emulatorjs c64, claude haiku ocr, programming archaeology, dergi.coze.org, 64'ler"
description: "How 812 type-in programs from the Turkish Commodore magazine's listing supplement (1986–1992) were read back from scans by agents, checked against the magazine's own MDE/BDE checksums, run in VICE, and put online. 682 work; the post covers the audit, the near-miss pass and the 130 that still fail."
author: "Arda Karaduman"
image: "/images/og/2026-11-09-812-programs-from-a-1980s-turkish-magazine.png"
draft: false
---

From March 1986, a C64 owner in Turkey who bought *Commodore* magazine got a supplement with
it, the **Program Döküm Eki** (program listing supplement). It was pages of type-in programs:
BASIC listings and rows of machine code in hex, each line ending in a small checksum. You sat
down, typed for an evening, and if every checksum matched, you had a new program.

[dergi.coze.org](https://dergi.coze.org/), my archive of Turkish retro computer magazines
([the first post about it](/blog/2026-10-27-dergi-coze-org) is in Turkish), now has all 78
of those supplements, from March 1986 to 1992. Agents read the listings back from the scans,
checked them line by line against the same checksums, built them into `.prg` files and ran
them in an emulator. **812 programs came out of the listings, and 682 of them run.** Every
one of them is on its issue's page, and the ones that stand alone start in a C64 in your
browser.

<figure>
  <img src="/images/dergi-pde/programs.webp" alt="Six Commodore 64 screens in a grid: TERS EKRAN's upside-down BASIC start screen on blue; PİŞTİ's menu in black with a purple title bar; TAKVİM's grey calendar title box; KARAKTER TEST's character grid with M.SAFA YEPREM's name; BÜYÜK BESTECİ's music menu on grey; Screenwalker 64's coloured squares on a white field with a yellow border." width="2340" height="1112" loading="lazy" />
  <figcaption>Six of the 682, as VICE ran them: TERS EKRAN and PİŞTİ (issue 3, 1986), TAKVİM (5), KARAKTER TEST (29), BÜYÜK BESTECİ and Screenwalker 64 (75, 1992).</figcaption>
</figure>

## The checksums were for the readers

The supplement printed two kinds of listing, each for one of the magazine's own typing
programs. Machine code was for the **MDE** (Makine Dili Editörü): an address, eight bytes and
a checksum byte, like `0841 : A5 02 91 F7 98 49 07 A8 8C`. BASIC was for the **BDE** (BASIC
Dili Editörü): a five-digit line number, the line, and its checksum in angle brackets, like
`00570 IF PEEK(211)>12 THEN ... <139>`. With a checksum on every line, a typo showed up on
the line where you made it, not after an hour of typing.

That's what made this project possible. An OCR'd listing is usually a dead end, because one
wrong character breaks a program and you can't tell which. These listings carry their own
proof. A line that matches its printed checksum was almost certainly read right; a line that
doesn't tells you exactly where to look.

## Reading it back

The pipeline does what the reader did, with agents doing the typing:

1. Each listing page is cut into crops, column by column. **Claude Haiku** reads the crops,
   and the lines that fail their checksum are read again by **Claude Sonnet**.
2. The readings are merged, and every line is checked against its printed checksum. Every
   `GOTO`, `GOSUB` and `THEN` target has to be a line that actually exists in the listing.
3. The lines become a `.prg` (BASIC tokenized, machine code at its printed addresses), and
   the program is run headless in **VICE**: x64sc for the C64, x128 for the C128's BASIC 7.0
   programs, and a Simons' BASIC cartridge for the Simons' BASIC ones. The screen after `RUN`
   is captured and read back.
4. Programs that work and stand alone get a button on the site that starts them in
   [EmulatorJS](https://emulatorjs.org/)'s VICE, in the browser. The Simons' BASIC ones need
   your own cartridge file, which stays in your browser.

The first pass went on the site in batches between November 3 and 4: 206 of 227 programs in
issues 1–20, 81 of 101 in 31–40, 271 of 350 in 41–78. That made 686 working programs.

## Then the count went down

686 was the wrong number. A checksum is one byte, so a random wrong line passes about one
time in 256, and a correction step that tries many fixes will find that one time. An audit
on November 5 went through six programs in detail and found the correction step making wrong
lines pass in two ways: machine-code rows with
two byte errors that cancelled out in the checksum, and fixes that "corrected" the printed
checksum itself to fit the line.

So the merge got stricter. A re-read is accepted only if its checksum is a plausible
misreading of the first reading's (a 3 for an 8, a B for a D), never a rewrite of it. The
rows and lines it now refused were read again from 300-dpi renders of the PDF, and kept only
where two readers agreed. The count went down to **611 of 812**. That was the honest number.

## Near misses

99 of the failing programs failed on only one to three lines. Those got a pass of their own,
one agent per issue, with a written brief. The rules were strict: render the failing line
from the PDF at 600 dpi (up to 3000 for the worst), read it character by character before
looking at the old reading, and accept a change only if the image supports it. The print's
own look-alikes (0/8/B/D, 3/8/9, 5/6/S, 1/7/I, E/F, colon and semicolon) were allowed; a
clearly printed checksum or byte was never touched.

Here is one, from TERS EKRAN ("upside-down screen") in issue 3, May 1986:

<figure>
  <img src="/images/dergi-pde/ters-ekran-rows.webp" alt="Three rows of a dot-matrix machine-code listing, scanned at 300 dpi: 0839 : 02 CA D0 FA 98 49 07 A8 75, then 0841 : A5 02 91 F7 98 49 07 A8 8C, then 0849 : C8 D0 E6 E6 F8 A5 F2 C3 44. The zeros are slashed and several digits are smeared." width="1258" height="178" loading="lazy" />
  <figcaption>TERS EKRAN, PDE 3, page 10. Row 0849 reads "F2 C3" but the printer meant "F8 C9".</figcaption>
</figure>

Row `0849` reads `C8 D0 E6 E6 F8 A5 F2 C3 44`, and no single change makes that pass. At 600
dpi, the "2" in `F2` has a closed lower bowl and a gap in its upper stroke: it's an 8 with a
broken line. And this printer's 9 looks like a 3: one row up, the `49` in row `0841` looks
like `43`, and only `49` passes there. Read as `F8 C9`, the row passes its checksum.
The code agrees: `C3` is an illegal opcode, while `C9` is `CMP`, and the row becomes
`INY / BNE / INC $F8 / LDA $F8 / CMP #$E0`, a loop over the character ROM's pages. The
program reads the character ROM to build an upside-down character set, which is the first
screen in the grid above.

Disassembly was allowed to break a tie only when the image already allowed both readings. A
fix chosen only because the code "makes more sense" doesn't count. Five lines like that
are waiting for me to decide.

The pass fixed 70 of the 99 programs, and none that worked before broke. That took the count
from 611 to 681. One more changed when a listing turned out to be part of a larger program, and the
site says **682** as of today.

## The magazine's own mistakes

Some lines will never pass, because the magazine printed them wrong. A line that is clearly
printed but fails its checksum, or a `GOTO` to a line that the magazine never printed (the
numbers before and after it are on the page, with nothing between), is kept exactly as
printed and noted on the program's page as a misprint. It only counts as working if the
program then runs in VICE without an error.

The supplements have a few habits that the pipeline now knows about:

- Some issues' printers dropped every quote mark and every graphics character inside quotes.
  The quotes are put back where the image shows the gap and the checksum agrees. Box-drawing
  graphics that were dropped are restored in the `.prg` from the checksum, while the listing
  on the site stays as printed.
- C128 listings print some BASIC 7.0 keywords 76 places too low in the token table.
- Corrections printed in a later issue are applied as errata.
- Machine-code rows that were never printed are filled with zeros, so the code after them
  stays at its printed address.

Some bugs are the authors'. MONITOR in issue 11 runs, and the magazine's version has a
bug at `$C517`. That's the program as printed, so that's the program on the site.

Since then, the same pipeline has started on *64'ler*, another C64 magazine of the time,
which writes its listings differently: colours spelled out by name, several control codes
in one bracket, `(CLR)` in parentheses, and `GOTO` targets printed with a leading zero.
There, misprints that a single character fixes are corrected in the `.prg` by their
checksums, and the program page says so.

## The 130 that don't run

130 programs still don't work, and each one says why on its page, under "Sorun bulundu"
(problem found). They are still downloadable. Many have more than one problem, so the rows add up to more
than 130:

| What fails | Programs |
|---|---|
| Lines that fail their checksum | 119 |
| VICE stops with an error | 35 |
| A character no one could read | 20 |
| A jump to a line that isn't in the listing | 18 |
| Machine-code rows missing | 12 |

The causes are mostly the scans: faint print, low-resolution copies, and pages where graphics
inside strings blurred into shapes that no checksum can settle. Some are the printing itself.
The worst run of issues is 51–60, where 58 of 97 programs work. Issues 1–10 and 71–78 are at
94% and 95%. A few failures are big: ANIMAL MATCH in issue 38 fails on dozens of
machine-code rows, and an English dictionary program in the same issue fails on most of its
BASIC lines.

These could go up. A cleaner scan of a bad issue would fix more than another reading pass.
If you still have the paper supplements, I'd like to hear from you.

## Programming archaeology

What I like about this is that the agents had to do the reader's job. In 1986, someone sat
with the supplement open next to the keyboard, typed `0849 : C8 D0 E6...`, and found out
from the checksum when they got a digit wrong. Forty years later, the scan is the only copy
left, the print is smeared, and the checksum is still the thing that decides whether a line
is right. 412 of the programs have every single line verified that way. The other 270 that run
have at least one line the checksums can't vouch for, like a misprint.

Go to [Program Döküm Eki](https://dergi.coze.org/commodore-pde/), pick an issue, and press
the button. TERS EKRAN is
[here](https://dergi.coze.org/commodore-pde/03/ters-ekran/).
