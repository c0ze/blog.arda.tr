---
title: "てにをは — 日本語の助詞を関数シグネチャの検査対象とする実験"
date: "2026-09-14"
excerpt: "引数の役割を位置ではなく助詞で決める小さな関数型言語の設計記録。着想は Kip、日本語側の先行事例はなでしこ。トルコ語の格の移植ではないという線をどこに引いたか、0.7.1 時点で何が動いて何が動かないかを述べる。"
tags: ["dev", "ai", "languages", "japan"]
keywords: "てにをは, tenioha, 日本語プログラミング言語, 助詞, Kip, Joomy Korkut, 関数型, なでしこ, Japanese programming language, particles, functional programming, Nadesiko"
description: "てにをはは、日本語の助詞を関数シグネチャの検査対象とする実験的な関数型言語である。設計判断、参照インタプリタの実装、先行事例との関係、および現時点の限界を日本語と English で記録する。"
author: "Arda Karaduman"
image: "/images/og/2026-09-14-introducing-tenioha-meaning-lives-in-the-particles.png"
lang: "ja"
draft: false
---

> 🇯🇵 日本語の記事です。**English version below ↓**

本稿は、日本語の助詞を関数シグネチャの検査対象とする実験的な関数型言語「てにをは」について、設計上の判断と 0.7.1 時点の実装を記録したものである。引数の役割を決めるのは位置ではなく助詞であり、助詞が一意であるかぎり、語順を入れ替えても引数は同じ仮引数に束縛される。

- リポジトリ: [github.com/c0ze/tenioha](https://github.com/c0ze/tenioha)
- プレイグラウンド: [c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/)
- 版: 0.7.1（Python 3.11 以上、外部パッケージなし）

## 1. 問題設定

多くの言語では、引数の意味は位置から決まる。

```python
subtract(5, 3)   # どちらが被減数かは、表記されない
```

てにをはでは、その役割を助詞が担う。

```text
(5 から 3 を 引く)
(3 を 5 から 引く)
```

いずれも「5 から 3 を引く」であり、結果は `2` である。`から` が起点を、`を` が引く量を指す。検査されるのは助詞と、値の通常の型（ここでは `整数`）の二つであって、「対格の整数」のような永続的な格ではない。同じ値が、ある呼び出しでは `から` を、別の呼び出しでは `を` を帯びてよい。

## 2. 先行事例

着想は **[Kip](https://kip-dili.github.io/)** に依る。表層構文がトルコ語で、型検査がトルコ語の形態論に導かれる静的型付き関数型言語である。[Joomy Korkut](https://joomy.korkutblech.com/) が Princeton の博士課程在籍中に開始し（[`kip-dili/kip`](https://github.com/kip-dili/kip)、初コミットは 2021 年 1 月）、2026 年の論文が正式な出典にあたる。

> Joomy Korkut, Alperen Keles, and Onur Akdemir. 2026. *Morphosyntactic Programming: Case, Mood, and Type-Directed Disambiguation for Turkish-Like Syntax.*（[PDF](https://joomy.korkutblech.com/papers/kip.pdf)）

Korkut の博士号取得は 2024 年であり、学位論文の主題は外部関数のメタプログラミングによる検証で、Kip ではない。Kip 論文における所属は Bloomberg である。言語としての要点は三つある。格接辞が仮引数を識別するため、格が一意であれば引数は移動できる。形態的な曖昧性は構文解析をそのまま通過させ、型検査の段階で解消する。純粋な定義は名詞句、効果を伴う計算は不定詞として書き、呼び出しは命令法で行う。

Kip については、[`eed6b0ed`](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2) を `~/projects/kip` に clone し、AST・検査器・評価器・fixture を読んだ。ビルドはしていない。この機械に GHC がなかったためである。コードは一行も複製していない。ライセンスは MIT であり、出典として明記する。そのうえで、トルコ語の `Case` 列挙をそのまま日本語へ移植しないことを設計上の前提に置いた。

日本語側の先行事例として、[なでしこ](https://nadesi.com/) はすでに助詞による引数指定、語順の入れ替え、敬語表現を備えている。これらを新規性として主張することはできない。てにをはが試しているのは、助詞を小さな関数型の核に載せられるかどうかという一点である。研究上の新規性を主張するには文献調査を要するが、それは行っていない。本稿はその主張をしない。

## 3. 日本語に固有の設計判断

トルコ語の格の在庫は比較的安定している。日本語の助詞はそうではない。`に` は着点にも相手にも時点にもなる。`は` は主題を示すのであって、`が` の略式の代替ではない。`たから` は `から` の文字列を含むが、一つの識別子として扱われなければならない。そして通常の日本語には語の区切りがない。

そのため、てにをはは意図的に Kip より制限の強い地点から始めている。

- 助詞はシグネチャ内の**出現に付くラベル**であり、値の永続的な格ではない。整数が「対格の整数」になることはない。
- ラベルが相異なるかぎり、引数は移動できる。欠落・重複・誤りはいずれもエラーである。主格へのフォールバックも、`が` の推論も、`に` と `へ` の暗黙の同一視も行わない。同一視は `に|へ` と明示的に書いた場合にかぎる。
- 引数は純粋な式でなければならない。入出力は先に束縛し、その結果を純粋な引数として渡す。効果は `関数` と `手続き` の区別として宣言するものであり、敬語の水準に紛れ込ませない。
- 語の境界は明示する。`値 を` は名前と助詞、`値を` は一つの名前である。`5から` のような密着は、整数がそこで終わるため許容する。`5から3を引く` は受理しない。

## 4. 言語の概要

関数は仮引数の助詞と返り値の型を宣言する。

```text
関数 差 (元: 整数) から (量: 整数) を -> 整数 {
    (元 から 量 を 引く)
}

答え は (3 を 5 から 差)。
((答え を 文字列にする) を 表示する)。
```

別名と助詞の選択も明示的に書く。形態素解析器も、`ます` の自動生成も持たない。

```text
関数 加える (元:整数)に|へ (量:整数)を -> 整数 {
    (元 に 量 を 足す)
}
別名 加えます は 加える。
(((5へ 3を 加えます)を 文字列にする)を 表示する)。
```

これは `8` を出力する。`に` と `へ` の両方を渡した場合は、重複引数として拒否される。

型検査はファイル全体に対して、いずれの式を実行するよりも前に行われる。たとえば `(3 に 5 に 足す)` は、`に` の重複と `を` の欠落を位置情報付きで報告する。

想定している最初の応用は、`~/projects/games/commit/commit+++` に置いてあるプログラミングゲームの高難度モードである。小さな語に役割を担わせること自体を教材にする、という位置づけになる。

## 5. 実装と経過

作業は 2026 年 9 月 14 日の一日に収まっている。朝の時点で、リポジトリは README と設計スケッチだけだった。

まず Kip が実際に何をしているかを記述し、続いて、トルコ語のフォールバックを継承しない日本語側の設計を書いた。実装は Python の参照インタプリタとした。文法を安く変更できることを優先したため、第三者パッケージは使っていない。到達した順序は次のとおりである。

1. **M0** — 型付きの助詞呼び出し、リテラル、検査される I/O、CLI。
2. **M1** — `関数` と `手続き`、`は` による不変束縛、再帰、遅延評価される条件。
3. **M2** — 代数的データ型、明示的なジェネリクス、網羅的なマッチ、関数値、モジュール。
4. **0.4–0.7** — レキシカルクロージャ、入れ子パターン、密着する助詞境界、明示的な別名と仮引数ごとの助詞選択。
5. **0.7.1** — Claude・Kimi・Grok による監査と、その指摘の修正。深い入れ子のジェネリック型が Python 3.11 の再帰スタックを溢れさせていた。改行コードと BOM の扱いも、文書の記述と一致していなかった。監査終了時点でテストは 322 件。

## 6. 動作確認

現在のテストは 341 件で、3.11.15 と 3.14.3 の双方で通る。例題は 23 本あり、Fibonacci、FizzBuzz、素数、ユークリッドの互除法、コラッツ、九九、べき乗、二進表現、回文数、挿入ソートを含む。

[c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/) は、同じインタプリタを、版を固定した Pyodide 上の使い捨て worker で実行する。公開後にブラウザから Fibonacci の例題を実行し、`0` から `89` までの出力を確認した。

実装と監査の配管はコーディングエージェントが担った。自動化されなかったのは設計上の拒否の判断である。`は` を `が` として扱わないこと、敬語を権限の表現に用いないこと、「日本語らしさ」を型規則の根拠にしないことは、いずれも人手で決めている。

## 7. 限界

実装は一日分の作業である。型推論はない。`の` による投射、`て` による連接、語の区切りのない自由な日本語、活用エンジンのいずれも実装していない。同一シグネチャ内での `に` の重複は、型による曖昧性解消を試みずに拒否する。型で解く方式を現時点では信用していないためである。評価器の活性呼び出しは 1024 で打ち切る。これは参照インタプリタであって、コンパイラではない。

実用的な日本語プログラミング言語を必要とするなら、なでしこが長くその位置にある。助詞が形態素解析器への依存なしに型付きの関数型の核を担えるかどうかを見るのであれば、プレイグラウンドで走っているものが、その検証の対象である。

## 出典

- [Kip](https://kip-dili.github.io/) と [英語チュートリアル](https://github.com/kip-dili/kip/wiki/Tutorial)。
- Korkut, Keles, Akdemir. 2026. [Morphosyntactic Programming](https://joomy.korkutblech.com/papers/kip.pdf)。
- 固定した checkout: [kip-dili/kip@eed6b0ed](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2)。ライセンスは Joomy Korkut、TRmorph は Çağrı Çöltekin。上流のコードは複製していない。
- Joomy Korkut、[Princeton 学位論文（2024）](https://joomy.korkutblech.com/papers/dissertation.pdf): *Foreign Function Verification Through Metaprogramming.*
- なでしこの [関数](https://nadesi.com/v3/doc/index.php?文法/関数)、[語順](https://nadesi.com/v3/doc/index.php?文法/語順)、[単語の区切り](https://nadesi.com/v3/doc/index.php?文法/単語の区切り)。
- [TUFS：主題・焦点の助詞](https://www.coelang.tufs.ac.jp/mt/ja/gmod/courses/c02/lesson28/step1/explanation/095.html)。
- 手元のメモ: [docs/RESEARCH.md](https://github.com/c0ze/tenioha/blob/master/docs/RESEARCH.md)、[docs/DESIGN.md](https://github.com/c0ze/tenioha/blob/master/docs/DESIGN.md)。

（本サイトの方針に従って明記しておく。実装と監査はコーディングエージェントが行った。日本語固有の拒否判断、Kip の読解、そして「これは翻訳ではない」という線引きは筆者による。）

---

> 🇬🇧 **English version.**(日本語版は上 ↑)

This note records the design decisions behind てにをは / tenioha, an experimental
functional language in which Japanese particles are checked parts of a function
signature, together with the state of the implementation at version 0.7.1. An
argument's role is fixed by its particle rather than by its position, so
arguments bind to the same parameters under reordering as long as each particle
is unique.

- Repository: [github.com/c0ze/tenioha](https://github.com/c0ze/tenioha)
- Playground: [c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/)
- Version: 0.7.1 (Python 3.11+, no packages)

## 1. The problem

In most languages an argument's meaning follows from its position:

```python
subtract(5, 3)   # the minuend is not marked; the reader has to remember
```

In tenioha the particle carries that role:

```text
(5 から 3 を 引く)
(3 を 5 から 引く)
```

Both calls mean "subtract 3 from 5" and evaluate to `2`. `から` marks the
starting value and `を` the amount subtracted. Two things are checked: the
particle, and the ordinary type of the value (here `整数`, integer). There is no
permanent case such as "accusative integer"; the same value may wear `から` in
one call and `を` in the next.

## 2. Prior art

The idea comes from **[Kip](https://kip-dili.github.io/)**, a statically typed
functional language whose surface syntax is Turkish and whose type checking is
guided by Turkish morphology. [Joomy Korkut](https://joomy.korkutblech.com/)
started it as a Princeton PhD student ([`kip-dili/kip`](https://github.com/kip-dili/kip),
first commit January 2021); the 2026 paper is the proper citation:

> Joomy Korkut, Alperen Keles, and Onur Akdemir. 2026. *Morphosyntactic Programming: Case, Mood, and Type-Directed Disambiguation for Turkish-Like Syntax.* ([PDF](https://joomy.korkutblech.com/papers/kip.pdf))

Korkut finished the Princeton PhD in 2024; the dissertation is about verifying
foreign functions through metaprogramming, not about Kip, and the Kip paper
lists him at Bloomberg. Three points matter for the language itself. Case
suffixes identify parameters, so arguments may move when the cases are unique.
Morphological ambiguity is carried through parsing and resolved during type
checking. Pure definitions are noun phrases, effectful ones are infinitives, and
calls are imperative.

Kip was cloned at [`eed6b0ed`](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2)
into `~/projects/kip`, and the AST, checker, evaluator, and fixtures were read.
It was not built; this machine had no GHC. No code was copied. The license is
MIT and the credit belongs upstream. The working premise was that the Turkish
`Case` enum would not be transplanted into Japanese.

On the Japanese side, [Nadesiko](https://nadesi.com/) already provides particle
arguments, reordering, and polite forms. None of that can be claimed as new.
What tenioha tests is a narrower question: whether particles can carry a small
functional core. Establishing research novelty would require a literature review
that has not been done, and this note does not claim it.

## 3. Decisions specific to Japanese

The Turkish case inventory is comparatively stable. Japanese particles are not.
`に` can mark a destination, a recipient, or a time. `は` marks topic and is not
an informal substitute for `が`. `たから` contains the characters of `から` yet
must remain a single identifier. And ordinary Japanese has no word boundaries.

Tenioha therefore starts from a more restricted position than Kip, deliberately:

- A particle is a **label on an occurrence** within a signature, not a permanent
  case on a value. An integer does not become an "accusative integer."
- Distinct labels may move. Missing, repeated, and incorrect labels are all
  errors. There is no nominative fallback, no inferred `が`, and no silent
  `に`/`へ` equivalence unless `に|へ` is written explicitly.
- Arguments must be pure expressions. I/O is bound first and its result is passed
  as a pure argument. Effects are declared through the `関数` / `手続き`
  distinction rather than smuggled in through register.
- Word boundaries are explicit. `値 を` is a name plus a particle; `値を` is one
  name. Compact forms such as `5から` are allowed because the integer already
  ends there, while `5から3を引く` is rejected.

## 4. The language

A function declares the particles of its parameters and its return type:

```text
関数 差 (元: 整数) から (量: 整数) を -> 整数 {
    (元 から 量 を 引く)
}

答え は (3 を 5 から 差)。
((答え を 文字列にする) を 表示する)。
```

Alternate names and particle choices are also written out. There is no
morphological analyser and no automatic `ます`:

```text
関数 加える (元:整数)に|へ (量:整数)を -> 整数 {
    (元 に 量 を 足す)
}
別名 加えます は 加える。
(((5へ 3を 加えます)を 文字列にする)を 表示する)。
```

This prints `8`. Supplying both `に` and `へ` is rejected as a duplicate
argument.

Type checking covers the whole file before any expression runs. For instance,
`(3 に 5 に 足す)` reports a repeated `に` and a missing `を`, with a source
location.

The first intended application is the hard mode of a programming game sitting in
`~/projects/games/commit/commit+++`, where making the little words load-bearing is
itself the teaching device.

## 5. Implementation

The work fits inside 14 September 2026. That morning the repository held a
README and a design sketch.

The first step was writing down what Kip actually does, followed by a Japanese
design that inherits none of the Turkish fallbacks. The implementation is a
Python reference interpreter with no third-party packages, chosen so that the
grammar stays cheap to change. The milestones landed in this order:

1. **M0** — typed particle calls, literals, checked I/O, a CLI.
2. **M1** — `関数` / `手続き`, immutable `は` bindings, recursion, lazy
   conditionals.
3. **M2** — algebraic types, explicit generics, exhaustive matches, function
   values, modules.
4. **0.4–0.7** — lexical closures, nested patterns, compact particle boundaries,
   explicit aliases and per-parameter particle choices.
5. **0.7.1** — an audit by Claude, Kimi, and Grok, and the resulting fixes. Deeply
   nested generic types were overflowing the Python 3.11 recursion stack, and the
   handling of line endings and BOMs did not match the documentation. The audit
   closed at 322 tests.

## 6. What was verified

The suite now stands at 341 tests, passing on 3.11.15 and 3.14.3. There are 23
examples, including Fibonacci, FizzBuzz, primes, Euclid's algorithm, Collatz, the
9x9 multiplication table, exponentiation by squaring, binary representation,
palindromic numbers, and insertion sort.

[c0ze.github.io/tenioha](https://c0ze.github.io/tenioha/) runs the same
interpreter through pinned Pyodide in a disposable worker. After publishing, the
Fibonacci example was run from a browser and produced `0` through `89`.

Coding agents did the implementation and audit plumbing. The design refusals were
decided by hand: not treating `は` as `が`, not using honorifics to express
permissions, and not accepting "feels like Japanese" as grounds for a type rule.

## 7. Limitations

The implementation is a day old. There is no inference, no `の` projection, no
`て` chaining, no unrestricted unspaced Japanese, and no conjugation engine. A
repeated `に` within one signature is rejected rather than disambiguated by type,
because that mechanism is not yet trusted here. The evaluator caps at 1024 active
calls. This is a reference interpreter, not a compiler.

For a production Japanese programming language, Nadesiko has held that position
for years. For the narrower question of whether particles can carry a typed
functional core without a morphology FFI, what runs in the playground is the
object under test.

## Sources

- [Kip](https://kip-dili.github.io/) and the [English tutorial](https://github.com/kip-dili/kip/wiki/Tutorial).
- Korkut, Keles, Akdemir. 2026. [Morphosyntactic Programming](https://joomy.korkutblech.com/papers/kip.pdf).
- Pinned checkout: [kip-dili/kip@eed6b0ed](https://github.com/kip-dili/kip/tree/eed6b0ed5ea397f226ed0f7d52ff8d56410ae4d2). License credits Joomy Korkut; TRmorph credits Çağrı Çöltekin. No upstream code was copied.
- Joomy Korkut, [Princeton dissertation (2024)](https://joomy.korkutblech.com/papers/dissertation.pdf): *Foreign Function Verification Through Metaprogramming.*
- Nadesiko manuals on [functions](https://nadesi.com/v3/doc/index.php?文法/関数), [word order](https://nadesi.com/v3/doc/index.php?文法/語順), and [segmentation](https://nadesi.com/v3/doc/index.php?文法/単語の区切り).
- [TUFS: topic/focus particles](https://www.coelang.tufs.ac.jp/mt/ja/gmod/courses/c02/lesson28/step1/explanation/095.html).
- Local notes: [docs/RESEARCH.md](https://github.com/c0ze/tenioha/blob/master/docs/RESEARCH.md), [docs/DESIGN.md](https://github.com/c0ze/tenioha/blob/master/docs/DESIGN.md).

(Stated for the record, in line with this site's policy on machines: coding
agents did the implementation and the audits. The Japanese-specific refusals, the
reading of Kip, and the "this is not a translation" line are mine.)
