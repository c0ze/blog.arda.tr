---
title: "SUDONE をつくった — バーコードで「買う前にネット価格チェック」"
date: "2026-06-20"
excerpt: "店頭で商品のバーコードを読むだけで、楽天・Yahoo!ショッピング・Amazon のネット最安値が約1秒で分かる。SUDONE をつくった理由と、その裏側のアーキテクチャと苦労。"
tags: ["dev", "go", "gcp", "japan", "product"]
keywords: "SUDONE, バーコード 価格比較, JAN 最安値, 楽天 API, Yahooショッピング, Amazon, price comparison japan, barcode scanner, Go, GCP, Cloud SQL, PWA"
description: "店頭で JAN バーコードをスキャンすると、楽天・Yahoo!ショッピング・Amazon のネット価格を即座に比較できるアプリ SUDONE。仕組みと、Go + GCP のアーキテクチャ、静的 IP allowlist や JAN マッチングの苦労まで。日本語と English の両方で。"
author: "Arda Karaduman"
image: "/images/og/2026-06-20-introducing-sudone-barcode-price-check.webp"
lang: "ja"
draft: false
---

> 🇯🇵 日本語の記事です。**English version below ↓**

ビックカメラで4,980円の電動歯ブラシの替えブラシを手に取りながら、頭をよぎる正直な疑問はひとつだけだ。——これ、高く買わされようとしてないか?

スマホを取り出して楽天を開き、「ブラウン オーラルB 替えブラシ」と打ち込むこともできる。——でもカタカナを打ち間違え、8本入りが欲しかったのに4本入りを掴まされ、正しい商品ページにたどり着く頃には熱も冷めていて、結局そのまま買ってしまうか、何も買わずに帰るかのどちらかだ。

この「2分間のもたつき」こそが、SUDONE をつくった理由のすべてだ。

**SUDONE** は、日本向けの「バーコード → ネット価格」アプリだ。商品パッケージの JAN バーコードにスマホをかざすと、約1秒で、その商品がいま楽天・Yahoo!ショッピング・Amazon でいくらなのかを教えてくれる。文字入力なし、商品違いの心配なし、カタカナのスペル地獄なし。スキャンして、見て、決める。

👉 PWA として **[web.sudone.jp](https://web.sudone.jp)** で公開中だ(ネイティブアプリも準備中)。

## これが解決すること

ここは慎重に語りたい。この手の製品には、安直で魅力的な「嘘の売り文句」があるからだ——「店はぼったくる、ネットの方が常に安い、スキャンして節約!」。これは事実ではないし、嘘を土台にアプリを作れば、唯一の価値である「信頼」を自ら毒することになる。

目の前の店が本当に得なこともある。送料がかからない、待たなくていい、その場で持って帰れる。SUDONE の役目は「ネットの方が安い」と言うことではない。買うと決める2秒前に、自分で **確かめられる** ようにすることだ——家に帰ってから「同じ箱が楽天で1,500円安かった」と知るのではなく。**買う前に、ネット価格をチェック。** 約束はそれだけで、そしてそれは、表示する数字が信じられる数字であって初めて成立する。

## 仕組み

流れは、良い配管がそうであるように、退屈だ。

1. アプリが **JAN**(日本で売られているほぼすべての商品についている13桁のバーコード)を読み取る。
2. バックエンドが楽天に問い合わせる——まず商品コードでの商品検索、ダメなら楽天市場の商品検索にフォールバック——さらに Yahoo!ショッピング、そして Amazon の検索リンク。
3. その結果をスキャンした商品に突き合わせ、並べ替え、本物の価格と本物の購入リンクの短いリストを返す。

この「突き合わせ(マッチング)」の工程にこそ製品の本質があり、「バーコードを入れたら価格が出る」という響きよりずっと難しい。詳しくは後述する。

## 技術スタック

あえて、奇をてらわない構成にした。

- **API:** Go + Echo
- **データ:** PostgreSQL(価格履歴、スキャン解析、ユーザー投稿の店頭価格)
- **プロバイダ:** 楽天市場 / 商品検索、Yahoo!ショッピング、Amazon(現状はアフィリエイト検索リンク)
- **フロントエンド:** Cloudflare Pages 上の PWA
- **インフラ:** 東京リージョンの GCE VM 1台、Cloud SQL、Cloudflare 経由のレコードの背後に Caddy。デプロイはバージョンタグ起点で、鍵レスの Workload Identity Federation を使った GitHub Actions 経由。

最後のインフラの一段落は、見た目より面白い。なぜなら、これは当初の計画ではなかったからだ。

## 静的 IP をめぐる顛末

SUDONE は最初、自宅のマシンで動いていた——[自宅ネットワークを小さなラボに仕立てた](/blog/2025-12-18-how-i-used-ai-to-enhance-my-home-network)ときと同じ衝動だ。そしてしばらくは、自宅マシンで **十分** だった。

ところが、楽天の API が静的 IP の allowlist(許可リスト)を求めてきた。

家庭用回線の IP は「約束」ではない。ISP が気が向いたときに取り消せる「提案」にすぎない。SUDONE が価格を返せるかどうかが、自宅 IP が一晩でずれたかどうかに左右されるのは嫌だったし、自宅の IP が第三者の許可リストに載っているのはもっと嫌だった。だから全部を GCP に移した——そしてこの移行の全体を駆動したのは、たった一つの地味な要件だった。楽天に渡して二度と気にしなくていい、**固定の送信元 IP** だ。

これは普段の自分の本能とは正反対だ。[サッカー分析サイトをつくった](/blog/2026-04-18-making-a-football-analytics-site)ときは、サーバーを一切動かさなくて済むように、`sql.js` でデータベースを丸ごとブラウザに押し込んだ。あのパターンは大好きだ。だが SUDONE では使えない。価格はライブで、プロバイダの鍵は秘密で、しかもそのうちの一つは固定 IP を見る必要がある。本当にバックエンドを必要とする製品もある。ならば素直にそれを認め、退屈で頑丈な版を作るのが誠実なやり方だ——VM 1台、マネージドな Postgres、その前に静的なフロント、そして git タグひとつで叩けるデプロイ。

[Reliquary](/blog/2026-06-03-introducing-reliquary-one-memory-for-every-ai) を読んだ人には、この形は見覚えがあるはずだ。自分のサービス、その前に本物の公開 HTTPS 経路、エッジの仕事は Cloudflare。気づくといつもここに行き着く。

## 難所:バーコードは「商品」ではない

誰も教えてくれないことがある。JAN が指すのは **物理的な箱** だ。「人間が思い浮かべる商品」を、EC の検索が同意してくれるような綺麗な形で指してはくれない。

6本パックをスキャンすれば、最安ヒットは1本入りかもしれない。1本入りをスキャンすれば、6本パックが出てきて、ポーチ付きのセットも出てきて、そもそも JAN を取り違えて登録している出品者が3人いる。同じ替えブラシが、国内向け SKU と、値段の違う並行輸入版として存在する。「このバーコード」から「実際に同じ物である出品を、本当に効く価格で並べたリスト」へたどり着くこと——これが本当のエンジニアリングであり、サッカーサイトを作ったときに学んだ教訓と同じだ。あのとき、スクレイプした試合データは「ゴールとカードだけ」では決してなかった。構造化された現実のデータは、いつだって、期待したスキーマより散らかっている。

だから SUDONE の多くは、地味なマッチングとランキングのロジックであり、重複スキャンのたびにプロバイダを叩かないためのキャッシュであり、急なアクセス増で楽天の QPS 枠を使い切らないためのスロットリングであり、どの結果を信じるかというゆっくり育つ感覚だ。

そして——どんなローンチ話も「自分で撃った傷」なしには完成しない——あるとき僕はアプリを「改善」しようとして、PWA からバックエンドの CORS 設定が許可していないヘッダーを送らせてしまい、ブラウザが自分自身の preflight を拒否していることに気づくまで、Web 版のスキャンを静かに全部壊していた。最も単純な一行の変更が、最も恥ずかしい障害になる。あの感じ、分かるだろう。

## 気に入っているところ

小さくて、意見がある。アカウント登録の壁もなければ、フィルタ50個のダッシュボードもなく、答えを一つも出さないうちからアプリのインストールをせがむポップアップもない。開いて、スキャンして、数字が出て、決める。インフラはわざと退屈にしてあるので、午前3時に叩き起こされる要素はほとんどない。

それに、価値を持つためには誠実であり続けなければならない——これは設計の制約として心地よい。お金はアフィリエイトリンクから来る(フッターできちんと開示している。日本のステマ規制も、最低限の良識も、それを求めるからだ)。そしてそれが長く成り立つのは、価格が本物で、提案が「これが事実だ、あとは自分で決めてくれ」であるときだけだ。

## 試してみてほしい

公開中だ:**[web.sudone.jp](https://web.sudone.jp)**。バーコードを見つけて、スマホをかざして、目の前の棚が勝っているかどうかを確かめてみてほしい。

次はネイティブアプリと、対応店舗の拡大だ。だが核はもう出来ている——スキャンして、比べて、決める。それは結局、僕が作るものの大半がそうであるように、ひとつの具体的な疑問を摩擦なしに答えてほしいという欲望であり、そしてもう二度とそれを検索ボックスに打ち込みたくない、という拒否なのだ。

---

> 🇬🇧 **English version.**(日本語版は上 ↑)

You're standing in a Bic Camera holding a ¥4,980 electric toothbrush head, and the only honest question in your head is: *am I about to overpay?* You could pull out your phone, open Rakuten, and start typing 「ブラウン オーラルB 替えブラシ」 into a search box — except you'll fat-finger the katakana, get the 4-pack when you wanted the 8-pack, and by the time you've found the right listing the moment has passed and you've either bought it anyway or talked yourself out of buying anything at all.

That two-minute fumble is the entire reason **SUDONE** exists.

SUDONE is a barcode → online-price tool for Japan. Point your phone at the JAN barcode on the box and it tells you — in about a second — what that exact product costs on Rakuten, Yahoo! Shopping and Amazon right now. No typing, no guessing the right variant, no katakana spelling bee. Scan, see, decide.

👉 It's live as a PWA at **[web.sudone.jp](https://web.sudone.jp)** (native apps are coming).

## What it actually solves

Let me be careful about the pitch, because the dishonest version of this product is easy and tempting: *"stores rip you off, the internet is always cheaper, scan to save!"* That isn't true, and building the app around a lie would poison the one thing that makes it useful — trust.

Sometimes the store in front of you genuinely wins. You skip the shipping, you skip the wait, you walk out with the thing. SUDONE's job isn't to tell you the internet is cheaper. It's to let you *check* — in the two seconds before you commit — instead of finding out at home that the same box was ¥1,500 less on Rakuten. **Check the online price before you buy.** That's the whole promise, and it only works if the number it shows you is one you can believe.

## How it works

The flow is boring in the way good plumbing is boring:

1. The app reads the **JAN** — the 13-digit barcode on basically everything sold in Japan.
2. The backend asks Rakuten — first a product-catalog lookup by product code, then an Ichiba item search as a fallback — plus Yahoo! Shopping, plus an Amazon search link.
3. It matches those results back to the thing you scanned, ranks them, and hands back a short list of real prices with real buy links.

The matching step is where the actual product lives, and it's much harder than "barcode in, price out" makes it sound — more on that below.

## The stack

Nothing exotic, on purpose:

- **API:** Go + Echo
- **Data:** PostgreSQL (price history, scan analytics, crowd-submitted shelf prices)
- **Providers:** Rakuten Ichiba / Product Search, Yahoo! Shopping, Amazon (search-link affiliate for now)
- **Frontend:** a PWA on Cloudflare Pages
- **Infra:** a single GCE VM in Tokyo, Cloud SQL, Caddy behind a Cloudflare-proxied record, deployed by version tag through GitHub Actions with keyless Workload Identity Federation

That last block is more interesting than it looks, because it wasn't the original plan.

## The static-IP saga

SUDONE started life on a box in my apartment — the same instinct I wrote about when I [turned my home network into a small lab](/blog/2025-12-18-how-i-used-ai-to-enhance-my-home-network). And for a while, a home box is *fine*.

Then Rakuten's API asked for a static-IP allowlist.

A residential connection's IP is not a promise; it's a suggestion the ISP can revoke whenever it feels like it. I did not want SUDONE's ability to return prices to depend on whether my home IP had drifted overnight, and I *really* didn't want my home address sitting in a third party's allowlist. So the whole thing moved to GCP — and the entire migration was driven by one unglamorous requirement: a **stable egress IP** I could hand to Rakuten and forget about.

That's the opposite of my usual instinct. When I [built a football analytics site](/blog/2026-04-18-making-a-football-analytics-site) I shoved the whole database into the browser with `sql.js` specifically so I'd never have to run a server. I love that pattern. SUDONE can't use it: the prices are live, the provider keys are secret, and one of them needs to see a fixed IP. Some products genuinely need a backend, and the honest move is to admit it and build the boring, durable version — one VM, managed Postgres, a static frontend in front, and a deploy you can trigger with a git tag.

If you've read [Reliquary](/blog/2026-06-03-introducing-reliquary-one-memory-for-every-ai), the shape will be familiar: your own service, a real public HTTPS path in front of it, Cloudflare doing the edge work. I keep ending up here.

## The hard part: a barcode is not a product

Here's the thing nobody tells you. A JAN identifies a *physical box*. It does not identify "the product a human means" in any tidy way that an e-commerce search will agree with.

Scan a 6-pack and the cheapest hit might be a single. Scan the single and you'll find the 6-pack, plus a bundle with a free pouch, plus three sellers who put the wrong JAN in their listing entirely. The same toothbrush head exists as a Japan-domestic SKU and an imported one at a different price. Getting from "this barcode" to "the listings that are actually the same thing, ranked by the price that actually matters" is the real engineering — and it's the same lesson I hit making the football site, where scraped match data was "never just goals and cards." Structured real-world data is always messier than the schema you hoped for.

So a lot of SUDONE is unglamorous matching and ranking logic, a cache so I'm not hammering the providers for every duplicate scan, throttling so a burst doesn't blow through Rakuten's QPS budget, and a slow-grown sense of which results to trust.

And — because no launch story is complete without one self-inflicted wound — at one point I "improved" the app by having the PWA send a platform header the backend's CORS config didn't allow, which quietly broke every web scan until I noticed the browser was rejecting its own preflight. The simplest one-line change, the most embarrassing outage. You know the kind.

## What I like about it

It's small and it has opinions. There's no account wall, no fifty-filter dashboard, no popup begging you to install an app before you've gotten a single answer. You open it, you scan, you get a number, you decide. The infrastructure is deliberately dull, which means there's very little that can wake me up at 3am.

It also has to stay honest to be worth anything, which is a nice constraint to design under. The money comes from affiliate links — disclosed, in the footer, because the Japanese stealth-marketing rules and basic decency both demand it — and that only works long-term if the prices are real and the recommendation is "here's the truth, decide for yourself."

## Try it

It's live: **[web.sudone.jp](https://web.sudone.jp)**. Find a barcode, point your phone at it, and see whether the shelf in front of you is winning or not.

Native apps and wider store coverage are next. But the core is there: scan, compare, decide — which, as with most of the things I build, is really just me wanting one specific question answered without friction, and then refusing to ever type it into a search box again.
