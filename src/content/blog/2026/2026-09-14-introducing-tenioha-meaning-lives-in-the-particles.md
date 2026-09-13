---
title: "てにをはをつくった — 助詞が引数の役割を担う関数型言語"
date: "2026-09-14"
excerpt: "Kip はトルコ語の格を型システムの一部にした。日本に住んでいる自分は、同じ発想を「てにをは」で試したかった。一日で言語とインタプリタとプレイグラウンドまで届いた。トルコ語の翻訳ではない。助詞引数が新しいとも言わない。"
tags: ["dev", "ai", "languages", "japan"]
keywords: "てにをは, tenioha, 日本語プログラミング言語, 助詞, Kip, Joomy Korkut, 関数型, なでしこ, Japanese programming language, particles, functional programming, Nadesiko"
description: "てにをはは、日本語の助詞を関数シグネチャの検査対象にする小さな関数型言語。Kip に触発され、トルコ語の格の翻訳ではなく、なでしこの先行を認めたうえで、ブラウザのプレイグラウンドまで出した。日本語と English の両方で。"
author: "Arda Karaduman"
image: "/images/og/2026-09-14-introducing-tenioha-meaning-lives-in-the-particles.png"
lang: "ja"
draft: false
---

> 🇯🇵 日本語の記事です。**English version below ↓**

`subtract(5, 3)` — どちらが被減数か。覚えているしかない。もう飽きた。

だから **てにをは** をつくった。日本語の助詞が、関数シグネチャの検査される一部になる小さな関数型言語。語順を入れ替えても、意味は残る。

```text
(5 から 3 を 引く)
(3 を 5 から 引く)
```

どちらも「5 から 3 を引く」で、結果は `2`。`から` が起点、`を` が引く量。検査するのは助詞と、ただの値の型 — `整数` — であって、「対格の整数」という永続的な身分ではない。同じ値が、ある呼び出しでは `から`、次では `を` を帯びてよい。

- **リポジトリ:** [github.com/c0ze/tenioha](https://github.com/c0ze/tenioha)
- **プレイグラウンド:** [c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/)
- **版:** 0.7.1 — Python 3.11 以上、外部パッケージなし

## きっかけは Kip

発想は自分のものではない。**[Kip](https://kip-dili.github.io/)** は、表層がトルコ語で、型検査がトルコ語の形態論に導かれる静的型付き関数型言語だ。[Joomy Korkut](https://joomy.korkutblech.com/) が Princeton の博士課程にいた頃に始め（[`kip-dili/kip`](https://github.com/kip-dili/kip)、初コミットは 2021 年 1 月）、2026 年の論文がきちんとした出典になる。

> Joomy Korkut, Alperen Keles, and Onur Akdemir. 2026. *Morphosyntactic Programming: Case, Mood, and Type-Directed Disambiguation for Turkish-Like Syntax.*（[PDF](https://joomy.korkutblech.com/papers/kip.pdf)）

Korkut の Princeton 博士号は 2024 年。学位論文は外部関数の検証であって Kip ではない。Kip 論文の所属は Bloomberg。言語の中身はこうだ。格接辞が仮引数を識別するので、格が一意なら引数は動いてよい。形態的なあいまいさは構文解析を通り抜け、型検査で解く。純粋な定義は名詞句、効果のある計算は不定詞で、呼び出しは命令法。

自分は Kip を [`eed6b0ed`](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2) で `~/projects/kip` に clone し、AST、検査器、評価器、fixture を読んだ。ビルドはしていない。この機械に GHC はなかった。一行もコピーしていない。MIT、クレジットは正当に。そして硬い約束：**トルコ語の `Case` 列挙を日本語に移植しない。**

## 日本語は、字形を変えたトルコ語ではない

トルコ語の格は、比較的安定した在庫だ。日本語の助詞はそうではない。`に` は着点にも相手にも時にもなる。`は` は主題であって、`が` の気軽な別名ではない。`たから` の中には `から` の文字がいるが、識別子は一つでなければならない。スペースのない日本語は、普通である。

だから tenioha は、意図して Kip より厳しいところから始めた。

- 助詞はシグネチャに局所的な **出現のラベル**。整数が「対格の整数」になることはない。
- ラベルが異なれば動いてよい。欠け、重複、誤ったラベルはエラー。主格へのフォールバックも、推論された `が` も、黙っての `に`/`へ` 同一視もない。自分で `に|へ` と書いたときだけ。
- 引数は純粋でなければならない。入出力は先に束縛し、それから純粋な引数を並べる。効果は宣言する（`関数` と `手続き`）。敬語に密輸しない。
- 語の境界は明示する。`値 を` は名前と助詞。`値を` は一つの名前。`5から` のような密着は、整数がそこで終わるから許す。`5から3を引く` はプログラムではない。

[なでしこ](https://nadesi.com/) は、すでに日本語の助詞引数も語順の入れ替えも敬語も持っている。それを新しいとは言えない。てにをはの賭けは、小さな関数型の核だ。不変束縛、普通の静的型、代数的データ、クロージャ、網羅的な場合分け、検査される効果。研究上の新規性を主張するなら、まだ書いていない文献調査が要る。この記事では主張しない。

自分はここに住んでいる。この言語を話す。構文は、実際の例と読者の突き返しで決めるべきで、`Abl` を `から` に訳して終わり、ではない。

## プログラムの形

関数は助詞と返り値の型を宣言する。

```text
関数 差 (元: 整数) から (量: 整数) を -> 整数 {
    (元 から 量 を 引く)
}

答え は (3 を 5 から 差)。
((答え を 文字列にする) を 表示する)。
```

別名は明示する。形態解析エンジンも、自動の `ます` もない。

```text
関数 加える (元:整数)に|へ (量:整数)を -> 整数 {
    (元 に 量 を 足す)
}
別名 加えます は 加える。
(((5へ 3を 加えます)を 文字列にする)を 表示する)。
```

これは `8` を出す。`に` と `へ` の両方を渡すのは、機知ではなく重複引数だ。

最初にこれを使いたい相手は、コンパイラの論文ではない。`~/projects/games/commit/commit+++` に置いてあるプログラミングゲームのハードモードだ。小さな語に荷重を持たせて、役割を教える。

## どう着地したか

今朝、リポジトリは README とスケッチだった。今夜には 0.7.1 になっている。

Kip が実際に何をしているかを書き、トルコ語のフォールバックを相続しない日本語の設計を書いた。それから、文法を安く変えられるように、第三者パッケージなしの Python 参照インタプリタ。届いた順はこうだ。

1. **M0** — 型付きの助詞呼び出し、リテラル、検査される I/O、CLI。
2. **M1** — `関数` / `手続き`、不変の `は` 束縛、再帰、遅延する条件。
3. **M2** — 代数的型、明示的なジェネリクス、網羅的マッチ、関数値、モジュール。
4. **0.4–0.7** — レキシカルなクロージャ、入れ子のパターン、密着する助詞境界、明示的な別名と仮引数ごとの選択。
5. **0.7.1** — Claude、Kimi、Grok による監査。深いジェネリック型が Python 3.11 のスタックを壊していた。改行と BOM が嘘をついていた。直して 322 テスト。それから例題とプレイグラウンド。

[c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/) は、同じインタプリタを固定した Pyodide で、使い捨ての worker 上で動かしている。例は 18。Fibonacci、FizzBuzz、素数、ユークリッド、コラッツ。ネイティブテストは 3.11.15 と 3.14.7 で 335 件。公開されている Fibonacci をブラウザで走らせて、`0` から `89` まで出た。

実装の配管は、いつものエージェントサーカスだ。自動ではなかったのは拒否のほうだ。`は` は `が` ではない。敬語は権限ではない。「日本語っぽい」は型規則ではない。

## 正直な限界

できたばかりだ。型推論もない。`の` の投射もない。`て` の連鎖もない。スペースなしの自由な日本語もない。活用エンジンもない。同じシグネチャに `に` が二つあるのは、型で解かず、今は拒否する。信用していないからだ。評価スタックは 1024 呼び出しが上限。これは参照インタプリタであって、コンパイラではない。

本番の日本語プログラミング言語が欲しいなら、なでしこが何年もその場所にいる。形態解析の FFI なしで、助詞が型付き関数型の核を担えるかを見たいなら、プレイグラウンドが議論そのものだ。

意味は助詞の中にある。語順は変わってよい。答えは `2` のまま。

👉 **[github.com/c0ze/tenioha](https://github.com/c0ze/tenioha)** · **[プレイグラウンド](https://c0ze.github.io/tenioha/)**

## 出典

- [Kip](https://kip-dili.github.io/) と [英語チュートリアル](https://github.com/kip-dili/kip/wiki/Tutorial)。
- Korkut, Keles, Akdemir. 2026. [Morphosyntactic Programming](https://joomy.korkutblech.com/papers/kip.pdf)。
- 固定した checkout: [kip-dili/kip@eed6b0ed](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2)。ライセンスは Joomy Korkut、TRmorph は Çağrı Çöltekin。上流のコードはコピーしていない。
- Joomy Korkut、[Princeton 学位論文（2024）](https://joomy.korkutblech.com/papers/dissertation.pdf): *Foreign Function Verification Through Metaprogramming.*
- なでしこの [関数](https://nadesi.com/v3/doc/index.php?文法/関数)、[語順](https://nadesi.com/v3/doc/index.php?文法/語順)、[単語の区切り](https://nadesi.com/v3/doc/index.php?文法/単語の区切り)。
- [TUFS：主題・焦点の助詞](https://www.coelang.tufs.ac.jp/mt/ja/gmod/courses/c02/lesson28/step1/explanation/095.html)。
- 手元のメモ: [docs/RESEARCH.md](https://github.com/c0ze/tenioha/blob/master/docs/RESEARCH.md)、[docs/DESIGN.md](https://github.com/c0ze/tenioha/blob/master/docs/DESIGN.md)。

（このサイトの方針どおり、機械については正直に書く。実装と監査はコーディングエージェントがやった。日本語固有の拒否、Kip を読んだこと、「これは翻訳ではない」という線は自分だ。）

---

> 🇬🇧 **English version.**(日本語版は上 ↑)

`subtract(5, 3)` — which one is the minuend? You have to remember. I got tired of remembering.

So I built **てにをは / tenioha**: a small functional language where Japanese particles are checked parts of the signature. Move the words. Keep the meaning.

```text
(5 から 3 を 引く)
(3 を 5 から 引く)
```

Both calls mean "subtract 3 from 5" and return `2`. `から` marks the starting value; `を` marks the amount. The checker binds by particle and by ordinary type — `整数`, not "accusative integer" as a permanent identity. The same value can wear `から` in one call and `を` in the next.

- **Repo:** [github.com/c0ze/tenioha](https://github.com/c0ze/tenioha)
- **Playground:** [c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/)
- **Version:** 0.7.1 — Python 3.11+, no packages

## The spark was Kip

The idea is not mine. **[Kip](https://kip-dili.github.io/)** is a statically typed functional language whose surface syntax is Turkish and whose type checking is guided by Turkish morphology. [Joomy Korkut](https://joomy.korkutblech.com/) started it as a Princeton PhD student ([`kip-dili/kip`](https://github.com/kip-dili/kip), first commit January 2021). The 2026 paper is the clean citation:

> Joomy Korkut, Alperen Keles, and Onur Akdemir. 2026. *Morphosyntactic Programming: Case, Mood, and Type-Directed Disambiguation for Turkish-Like Syntax.* ([PDF](https://joomy.korkutblech.com/papers/kip.pdf))

Korkut finished the Princeton PhD in 2024 — the dissertation is about verifying foreign functions through metaprogramming, not about Kip — and the Kip paper lists him at Bloomberg. The language is still the thing: case suffixes identify parameters so arguments can move when the cases are unique; morphological ambiguity is carried through parsing and resolved during type checking; pure definitions are noun phrases, effectful ones are infinitives invoked in the imperative.

I cloned Kip at [`eed6b0ed`](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2) into `~/projects/kip` and read the AST, the checker, the evaluator, and the fixtures. I did not build it. This machine had no GHC. I did not copy a line of it. MIT license, credit where it's due, and a hard rule: **do not transplant the `Case` enum into Japanese.**

## Japanese is not Turkish with different glyphs

Turkish case is a fairly stable inventory. Japanese particles are not. `に` can be a target, a recipient, a time. `は` is topic, not a casual stand-in for `が`. `たから` contains the letters of `から` and must stay one identifier. Unrestricted Japanese has no spaces.

So tenioha starts stricter than Kip, on purpose:

- Particles are **labels on an occurrence**, local to a signature. An integer does not become an "accusative integer."
- Distinct labels can move. Missing, repeated, or wrong labels are errors. No nominative fallback, no inferred `が`, no silent `に`/`へ` equivalence unless you write `に|へ` yourself.
- Arguments must be pure. Bind I/O first, then arrange the pure arguments. Effects are declared (`関数` vs `手続き`), not smuggled in through polite speech.
- Word boundaries are explicit. `値 を` is a name plus a particle. `値を` is one name. Compact forms like `5から` are allowed because the integer already ends; `5から3を引く` is not a program.

[なでしこ / Nadesiko](https://nadesi.com/) already has Japanese particle arguments, reordering, and politeness. I cannot pretend those are new. Tenioha's bet is a small functional core: immutable bindings, ordinary static types, algebraic data, closures, exhaustive matches, and checked effects. Establishing research novelty would take a literature review I have not done. This post does not claim it.

I live here. I speak the language. The syntax should be driven by actual examples and reader pushback, not by translating `Abl` into `から` and calling it a day.

## What a program looks like

A function declares its particles and its return type:

```text
関数 差 (元: 整数) から (量: 整数) を -> 整数 {
    (元 から 量 を 引く)
}

答え は (3 を 5 から 差)。
((答え を 文字列にする) を 表示する)。
```

Alternate spellings are explicit. No morphology engine, no automatic `ます`:

```text
関数 加える (元:整数)に|へ (量:整数)を -> 整数 {
    (元 に 量 を 足す)
}
別名 加えます は 加える。
(((5へ 3を 加えます)を 文字列にする)を 表示する)。
```

That prints `8`. Supplying both `に` and `へ` is a duplicate argument, not cleverness.

The first program I actually want this for is not a compiler paper. It's the hard mode of a programming game I have sitting in `~/projects/games/commit/commit+++`. Teach roles by making the little words load-bearing.

## How it ended up

This morning the repo was a README and a sketch. By tonight it is 0.7.1.

I wrote down what Kip actually does, then wrote a Japanese design that refuses to inherit Turkish fallbacks. Then a Python reference interpreter, no third-party packages, because I wanted the grammar to be cheap to change. Milestones, in the order they actually shipped:

1. **M0** — typed particle calls, literals, checked I/O, a CLI.
2. **M1** — `関数` / `手続き`, immutable `は` bindings, recursion, lazy conditionals.
3. **M2** — algebraic types, explicit generics, exhaustive matches, function values, modules.
4. **0.4–0.7** — lexical closures, nested patterns, compact particle boundaries, explicit aliases and per-parameter choices.
5. **0.7.1** — an audit by Claude, Kimi, and Grok. Deep generic types were blowing the Python 3.11 stack. Line endings and BOMs were lying. Fixed, 322 tests, then the examples and playground.

The site at [c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/) runs the same interpreter through pinned Pyodide in a disposable worker. Eighteen examples, including Fibonacci, FizzBuzz, primes, Euclid, Collatz. Native tests: 335 cases on 3.11.15 and 3.14.7. I pointed a browser at the public Fibonacci example and got `0` through `89`.

The plumbing was the usual agent circus. The part that was not automatic was the refusals: `は` is not `が`, honorifics are not permissions, and "feels like Japanese" is not a type rule.

## Honest limits

It is a day old. There is no inference, no `の` projections, no `て` chains, no unrestricted unspaced Japanese, no conjugation engine. Repeated `に` in one signature is rejected instead of being disambiguated by type, because I do not trust that yet. The evaluator stack caps at 1024 calls. This is a reference interpreter, not a compiler.

If you want a production Japanese programming language, Nadesiko has been in that fight for years. If you want to see whether particles can carry a typed functional core without a morphology FFI, the playground is the argument.

Meaning lives in the particles. The order can change. The answer stays `2`.

👉 **[github.com/c0ze/tenioha](https://github.com/c0ze/tenioha)** · **[playground](https://c0ze.github.io/tenioha/)**

## Sources

- [Kip](https://kip-dili.github.io/) and the [English tutorial](https://github.com/kip-dili/kip/wiki/Tutorial).
- Korkut, Keles, Akdemir. 2026. [Morphosyntactic Programming](https://joomy.korkutblech.com/papers/kip.pdf).
- Pinned checkout: [kip-dili/kip@eed6b0ed](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2). License credits Joomy Korkut; TRmorph credits Çağrı Çöltekin. No upstream code was copied.
- Joomy Korkut, [Princeton dissertation (2024)](https://joomy.korkutblech.com/papers/dissertation.pdf): *Foreign Function Verification Through Metaprogramming.*
- Nadesiko manuals on [functions](https://nadesi.com/v3/doc/index.php?文法/関数), [word order](https://nadesi.com/v3/doc/index.php?文法/語順), and [segmentation](https://nadesi.com/v3/doc/index.php?文法/単語の区切り).
- [TUFS: topic/focus particles](https://www.coelang.tufs.ac.jp/mt/ja/gmod/courses/c02/lesson28/step1/explanation/095.html).
- Local notes: [docs/RESEARCH.md](https://github.com/c0ze/tenioha/blob/master/docs/RESEARCH.md), [docs/DESIGN.md](https://github.com/c0ze/tenioha/blob/master/docs/DESIGN.md).

(Full disclosure, since this site has a standing policy of honesty about the machines: coding agents did the implementation and the audits. The Japanese-specific refusals, the Kip reading, and the "this is not a translation" line are mine.)
