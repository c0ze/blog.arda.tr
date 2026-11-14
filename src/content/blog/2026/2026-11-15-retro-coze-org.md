---
title: "RETRO yayında: nefes almayan yazarlarla aylık bir dergi"
date: "2026-11-15"
excerpt: "retro.coze.org, bugünün oyunlarını, metal albümlerini, donanımını ve yapay zekâsını doksanların Türk bilgisayar dergilerinin üslubuyla anlatan aylık bir dergi. İki sayı çıktı, 79 yazı. Editoryal ve köşe benden, gerisini ev imzalarıyla yapay zekâ yazıyor. Nasıl yazdığını ve neleri yazmasına izin vermediğimi anlatıyorum."
tags: ["retro", "dergi", "ai", "agents", "claude", "gaming", "metal", "turkish"]
keywords: "retro.coze.org, retro dergi, türkçe oyun dergisi, yapay zekâ ile yazılan dergi, oyun incelemeleri, metal albüm incelemeleri, türk bilgisayar dergileri, 64'ler, commodore dergisi, amiga dünyası, claude opus, ev imzaları, dergi.coze.org"
description: "retro.coze.org nasıl çalışıyor: günlük haber özetlerinden aylık bir sayıya, eski Türk dergilerinin arşivinden çıkarılan ev sesleri, yayın çizgisini koruyan denetimler, PDF/EPUB baskılar ve mobil uygulama."
author: "Arda Karaduman"
image: "/images/og/2026-11-15-retro-coze-org.png"
lang: "tr"
draft: false
---

Merhaba millet.

Bir süredir oyun basınını okuyamıyorum. Okuduğum yazıların bir kısmı kılık değiştirmiş reklam,
bir kısmı tıklama uğruna yerden yere vurma. Dil ayrı bir dert: kısa, düz, herkese yaranmaya
çalışırken kimseye bir şey söylemeyen cümleler. Ben oyun yazısını 64'ler'den, Commodore'dan, Amiga
Dünyası'ndan öğrendim. O dergilerin yazarları okurla konuşur, hükmünü savunur, "bence" demekten
çekinmezdi.

Geçen ay o dergileri [dergi.coze.org](https://dergi.coze.org/)'da arşivledim
([nasıl yaptığımı buraya yazmıştım](/blog/2026-10-27-dergi-coze-org)). Arşiv bitince aklıma takılan
soru şu oldu: o dergiler bugün yayında olsaydı neye benzerdi? Cevabım
**[RETRO](https://retro.coze.org/)**.

<figure>
  <img src="/images/retro-coze/anasayfa.webp" alt="retro.coze.org ana sayfası: mor üst şerit, gökkuşağı çizgili RETRO logosu, sağda 'Bugünün oyunları, plakları, cihazları ve yapay zekâsı; doksanların dergi sayfalarındaki o sesle. Ayda bir sayı.' yazısı, altta Sayı 02 (Castlevania: Belmont's Curse) ve Sayı 01 (Marvel's Wolverine) kapakları." width="1600" height="1125" loading="lazy" />
  <figcaption>retro.coze.org'un ana sayfası, Gündüz Baskısı temasıyla. Sağ üstteki düğme Gece Baskısı'na geçiriyor.</figcaption>
</figure>

## Ne var bu dergide?

RETRO aylık bir dergi ve konusu bugün: yeni oyunlar, yeni metal albümleri, donanım, yapay zekâ ve
yazılım. "Retro" konunun değil üslubun adı. Milyonuncu kez bir Commodore 64 incelemiyoruz; yeni bir
Castlevania'yı o dergiler nasıl yazardıysa öyle yazıyoruz. Eski sistemler ancak haber olduklarında
giriyor sayfalara: Commodore 64C Ultimate'ın kargoya çıkması ya da Amiga'ya gelen yeni portlar gibi.

Şimdiye kadar iki sayı çıktı:

| Sayı | Kapak | Yazı |
|---|---|---|
| [Sayı 01 · Eylül 2026](https://retro.coze.org/sayi-01/index.html) | Marvel's Wolverine | 31 |
| [Sayı 02 · Ekim 2026](https://retro.coze.org/sayi-02/index.html) | Castlevania: Belmont's Curse | 48 |

Her sayıda oyun, metal, donanım ve yapay zekâ bölümlerinin yanında tefrika bir öykü, ayın haberleri
ve bir rekor tablosu var. Her yazının İngilizce çevirisi de var. Sayılar sitede okunuyor, ayrıca PDF
ve EPUB olarak, Türkçe ve İngilizce ayrı ayrı iniyor. Takip etmek isteyenler için
[RSS](https://retro.coze.org/feed.xml) de var.

## Nefes almayan yazarlar

İlk sayının [editoryalinde](https://retro.coze.org/sayi-01/editoryal.html) "Ben ve nefes almayan
yazarlarım" diye yazmıştım, laf olsun diye yazmadım. Editoryal ve köşem dışındaki her şeyi yapay zekâ
yazıyor, ev imzaları altında. Aksiyon oyunlarını Tetik yazıyor, iki sayının kapağı da onun. Korku ve gizem
Gece Bekçisi'nde, strateji Kurmay'da, macera Pusula'da, RPG'ler Zar Ustası'nda. Metal albümlerini
Kuzgun dinliyor. Donanım Lehim'in, yapay zekâ ve yazılım Bit Ustası'nın, öykü Kâtip'in işi. Haberler
de imzasız, Haber Masası'ndan çıkıyor.

Bu imzalar gerçek kişiler değil, derginin sesleri. Her birinin arkasında, dergi.coze.org arşivindeki
yazılardan Claude'un çıkardığı on bölümlük bir üslup profili var. Profil, o ses için seçilmiş en
fazla 40.000 kelimelik örnek metinden yazılıyor. Hangi yazarlardan çıkarıldığını söylemiyorum, dergi
de söylemiyor. Bu kuralı yalnızca künyeye yazmadım, kodda da var. Yayına giden her yazı, profillerin
dayandığı yazarların adlarına karşı taranıyor: baş harfli, ters yazılmış, aksanı düşmüş ya da araya
görünmez bir karakter girmiş halleri de dahil. Böyle bir isim yakalanırsa site derlemesi duruyor ve
hangi yazıda bulduğunu söylüyor.

Yapay zekâ açıklaması [künyede](https://retro.coze.org/hakkinda.html) duruyor, yazıların içinde ayrıca
bir not yok.

## Bir sayı nasıl çıkıyor?

Ham madde, her gün oyun, metal, donanım ve yapay zekâ haberlerini toplayan bir botun yazdığı günlük
özetler. Ay sonunda `retro` adlı komut satırı aracını çalıştırıyorum:

1. `pool` ayın günlük özetlerinden tekrarları ayıklanmış bir haber havuzu kuruyor. `enrich` her alan
   için web'de arama yapıp botun kaçırdıklarını ekliyor.
2. `candidates` havuzdan aday yazılar öneriyor ve her birine bir ses eşliyor. Hangisinin sayıya
   gireceğine ben karar veriyorum.
3. `research` seçilen her yazının birincil kaynağını bulup haberi doğruluyor. Basın kitini, mağaza
   sayfasını, yama notlarını ve oyuncu yorumlarını topluyor, basın görsellerini kredileriyle indiriyor.
4. `draft` yazıyı eşleşen sesin profiliyle yazıyor, denetimlerden geçiriyor, takılırsa yeniden
   yazdırıyor, sonra İngilizceye çeviriyor. Yazan model Claude Opus 5.5. Sürümü sabitledim ki
   komut satırı aracının varsayılan modeli değiştiğinde seslerin üslubu da değişmesin.
5. `vary` aynı sesin bir sayı içinde tekrarladığı açılışları ve kalıpları bulup yeniden yazıyor.
   Tetik'in bütün yazıları aynı selamla başlamasın diye.
6. `layout` her inceleme için sayfanın planını çıkarıyor (künye, spot, alıntı, görsel altları),
   `links` de resmî sayfaları buluyor.
7. `book` sayının PDF'ini Chrome'la basıyor, EPUB'ını yazıyor. Siteyi Firebase Hosting'e yükleyen
   betik önce neyin değişeceğini gösteriyor ve canlı bir sayfayı, beslemeyi ya da kitabı kaldıracaksa
   duruyor.

Benim onayım olmadan hiçbir şey yayına çıkmıyor. Her yazıyı okuyup onaylıyorum, kapağı da
ben seçiyorum.

Editoryal ve köşe için ayrı bir "yazı masası" var: tarayıcıda açılan küçük bir editör. Yazdığımı
`own` komutu düzeltiyor ve İngilizceye çeviriyor. Düzeltmeleri ben kabul etmeden hiçbiri yayına girmiyor.

## Kurallar kodda

Yayın çizgisini künyeye yazmak kolay, tutturmak zor. O yüzden kuralların çoğunu kodla denetletiyorum.

Yapay zekâ kokan kalıplar Türkçe ve İngilizce iki listede duruyor: "sonuç olarak", "unutulmaz bir
deneyim", "göz kamaştırıcı", "keyifli bir deneyim sunuyor" ve benzerleri. Bunlardan birini kullanan
taslak yeniden yazılıyor.

Oynanmamış bir oyun oynanmış gibi anlatılmıyor. "Bitirdim", "saat oynadım" türünden cümleler ancak
benim oyun notlarım varsa geçebiliyor. Not yoksa hüküm denetlenebilir şeylerden çıkıyor: oyunun kendi
sistemleri, yama notları, Steam'deki oyuncu yorumları. Doğrulanamayan
bilgi işaretleniyor. Castlevania incelemesinin künyesinde fiyatın yanında "DOĞRULANMADI" yazıyor,
çünkü fiyatın kaynağı yayıncı değil SteamDB.

<figure>
  <img src="/images/retro-coze/castlevania.webp" alt="RETRO'da Castlevania: Belmont's Curse kapak incelemesi: solda kemerli çerçevede oyunun ana görseli ve 'Görsel: yayıncı basın kiti' kredisi; sağda başlık, Tetik imzası ve künye kutusu. Künyede makine, geliştirici, yayıncı, tür, fiyat satırları var; 29,99 $ fiyatının yanında DOĞRULANMADI etiketi duruyor." width="1600" height="1125" loading="lazy" />
  <figcaption>İkinci sayının kapak incelemesi. Görselin altında kredisi, künyede doğrulanamayan fiyatın etiketi var.</figcaption>
</figure>

Kendi işlerim puanlanmıyor. Tetik ilk sayıda [Heliobane](https://retro.coze.org/sayi-01/games-heliobane.html)'i
yazdı. Pusula da ikinci sayıda henüz çıkmamış [Farstrand](https://retro.coze.org/sayi-02/games-farstrand.html)'ı
tasarım belgelerinden okuyup yazdı. İkisinde de puan yok, sonda editörün kendi projesi olduğunu
söyleyen tek satırlık bir açıklama var. Puanı arayan denetim rakamı, yazıyla yazılmış sayıyı ve yıldızı
da yakalıyor, iki dilde.

Hiçbir görsel üretilmiyor. Görseller yayıncının, plak şirketinin ya da üreticinin basın kitinden
geliyor, her birinin altında kaynağa giden bir kredi satırı var. Aşırı ideolojileri savunan gruplar
da dergiye girmiyor. Metal sayfaları olan bir dergide bu ayrıca önemli. Engelli grupların listesi
isimleri tireli, bitişik, aksansız ya da Türkçe ek almış halleriyle de yakalıyor. Bunlardan birinin
adı ya da bağlantısı geçen yazı siteye hiç girmiyor.

Proje 28 Ekim'de bir tasarım belgesiyle başladı, kuralların çoğu ilk sayıdan sonra sıkılaştı. Projeyi baştan sona denetlettim, 11 Kasım'da tek
günde 57 commit girdi, neredeyse hepsi denetimin bulduğu açıkları kapatan düzeltmelerdi. Repoda şu an
1.180 test var.

## Benim payım

Editoryal ve köşe, yani "Coze'nin Mahzeni", benden. İkinci sayıda bir de Retro bölümü açtık:
Tetik'le beraber [Bugün AGA için ne yaptın?](https://retro.coze.org/sayi-02/retro-bugun-aga-icin-ne-yaptin.html)
diye sorup ekimde Amiga'ya gelen yeni portları sıraladık. Girişi ben yazdım, oyun notlarını Tetik.

[Mahzende](https://retro.coze.org/sayi-02/kose.html) bu ay Gemini 4 Argon ve Kimi K3.1 Pro hakkındaki
fikrimi yazdım. Bit Ustası da aynı iki modeli inceledi. İki görüş aynı sayıda duruyor, isteyen
karşılaştırsın.

Ekim'in [rekor tablosunda](https://retro.coze.org/sayi-02/rekorlar.html) oyunlarda en yüksek puanı
The Séance of Blake Manor aldı (86), albümlerde Wolves in the Throne Room'un Estuary'si (80).

## Cebe de giriyor

RETRO'nun iOS ve Android uygulaması da hazır. Flutter ile yazıldı, sitenin derlenirken ürettiği statik
JSON API'sini okuyor ve sayıları kendi ekranlarında gösteriyor. Sayıları indirip çevrimdışı
okutuyor. Hesap, reklam ya da izleme kodu yok. Şu an iki mağazada da incelemede, yayına girince
buraya eklerim.

## Gelecek sayıda

Kasım sayısı hazırlanıyor. Okumak için [retro.coze.org](https://retro.coze.org/), RSS'çiler için
[besleme](https://retro.coze.org/feed.xml). Düzeltme, öneri ya da kaldırma isteği olan
contact@coze.org'a yazabilir.

Bayinizden ısrarla isteyiniz.
