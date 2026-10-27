---
title: "MÜJDE! Commodore ve Amiga Dergileri Geri Döndü: dergi.coze.org Yayında!"
date: "2026-10-27"
excerpt: "Commodore, 64'ler, Amiga Dünyası, Amiga Dergisi, MegAmiga ve C64 Türkiye... 177 sayı, 11.833 sayfa, reklamsız, aranabilir ve yapay zekâ ajanlarına açık. İki günde nasıl yaptık, nerede takıldık, nasıl kurtardık: hepsi bu sayıda!"
tags: ["retro", "commodore", "amiga", "ocr", "mcp", "ai"]
keywords: "türk retro bilgisayar dergileri, commodore dergisi, 64'ler dergisi, amiga dünyası, amiga dergisi, megamiga, c64 türkiye, dergi arşivi, ocr, tesseract türkçe, mcp sunucusu, dergi.coze.org"
description: "Türk retro bilgisayar dergilerinin reklamsız, aranabilir arşivi dergi.coze.org nasıl yapıldı: tarama seçimi, Türkçe OCR, reklam ayıklama, yazım düzeltme, C64 programları ve herkese açık MCP sunucusu."
author: "Arda Karaduman"
image: "/images/og/2026-10-27-dergi-coze-org.png"
lang: "tr"
draft: false
---

**Sevgili okurlar, merhaba!**

Disketlerin tozunu silin, joystick'leri takın, çünkü bu sayıda size çok özel bir
haberimiz var. Commodore'u, 64'ler'i, Amiga Dünyası'nı hatırlıyor musunuz? Sayfalarında
oyun hileleri, makine dili dersleri ve uzun uzun program dökümleri olan o dergileri?
Şimdi hepsi tek bir adreste: **[dergi.coze.org](https://dergi.coze.org/)**!

Yıllardır bu dergilerin taramaları NAS'ımda, rar dosyalarının içinde, dağınık
klasörlerde uyuyordu. Bir sabah oturdum ve dedim ki: bunlara yeniden hayat verelim.
İki gün sonra elimde reklamsız, sayfa sayfa okunabilen, içinde arama yapılabilen ve
yapay zekâ asistanlarına bile açık bir arşiv vardı. Nasıl mı? Anlatalım!

> **BU SAYIDA**<br>
> ◆ Rakamlarla dergi.coze.org ◆ Taramadan yazıya: mutfakta neler oldu? ◆ OCR yarışması
> ◆ Reklam avı ◆ C64 programları yeniden RUN! ◆ Kaça patladı? ◆ Ajanlara özel: MCP
> ◆ Gelecek sayıda ◆ Aranan sayılar

## Rakamlarla dergi.coze.org

| Dergi | Yıllar | Sayı |
|---|---|---|
| Commodore | 1986–1992 | 79 |
| 64'ler | 1988–1992 | 43 |
| Amiga Dünyası | 1990–1992 | 31 |
| Amiga Dergisi | 1993–1994 | 9 |
| MegAmiga | 1995 | 7 |
| C64 Türkiye | 2002–2005 | 8 |

**Toplam:** 177 sayı, 11.833 sayfa, 2.974 yazı, 212 yazar, 733 oyun ve 23 çalışan C64
programı. Fena değil, değil mi?

Sitede neler var, kısaca sayalım:

- **Okuyucu:** her sayıyı sayfa sayfa okuyun. Geniş ekranda iki sayfa yan yana, tıpkı
  dergiyi elinizde tutar gibi açılıyor. Çift sayfalık reklamlar bile basıldığı gibi!
- **Temalar:** açık, sepya ya da koyu. Gece yarısı okumaları için koyu tema şart.
- **Reklamsız yazılar:** her yazının temiz, düz metin hâli var. Yanında asıl sayfa bir tık
  uzakta.
- **Arama:** "sayi" yazın, "sayı" da bulunsun. Ama asıl sihir anlam aramasında:
  "assembler" diye arayın, "makine dili" yazıları da gelsin!
- **Yazarlar, oyunlar, konular:** her yazarın bütün dergilerdeki yazıları tek sayfada.
  Turrican'ın C64 ve Amiga sürümleri ayrı ayrı.

## Mutfaktan: Taramadan Yazıya

Bilgisayar için taranmış bir dergi sayfası sadece bir resimdir. O resimden okunabilir,
aranabilir ve reklamsız bir yazı çıkarmak için her sayı uzun bir yoldan geçti. Ağır işi
yerel araçlar ve küçük, ucuz modeller yaptı. Kodu ise benim gözetimimde Claude Code
yazdı. Adım adım gidelim.

### 1. En iyi taramayı bulmak

Çoğu sayının birden fazla taraması var: PDF, CBR, DjVu, JPG klasörü... Her sayı için önce
sayfası en eksiksiz olan, sonra en keskin olan seçildi. İlk sürpriz de burada çıktı: indirdiğim
yeni Commodore arşivini temel almıştım, ama NAS'taki eski taramalar 40 kadar sayıda **çok**
daha iyiydi. Commodore 42'nin indirdiğim kopyası 1000 piksel genişliğindeydi, NAS'takiyse
3213!

Bir de tuzaklar var:

- **Çift görünen sayfalar.** 64'ler'in bazı sayılarında taramacı iki sayfayı tek bir resim
  olarak saklamış, PDF'in her sayfası o resmin yarısını gösteriyor. OCR resmin tamamını
  okuyunca her yazı iki kere çıktı! Artık yalnızca görünen yarı kesilip okunuyor.
- **Eski OCR katmanları.** Bazı PDF'lerin içinde Acrobat'ın yıllar önce yaptığı kötü bir OCR
  katmanı varmış. Program bunları "dijital PDF" sanıp o metni kullanmıştı. Hepsi yakalandı
  ve baştan okundu.
- **Amiga Dünyası sürprizi.** Elimizdeki sayıların çoğu taranmış dergi değil, ABBYY FineReader
  ile yeniden dizilmiş sürümler çıktı. Metin onlardan geliyor; gerçek taraması olan 16, 21 ve
  25–31. sayılarda tarama kullanıldı.

### 2. OCR yarışması!

Hangi OCR programı Türkçeyi en iyi okur? Bunu bulmak için üç yarışmacıyı Commodore
sayfalarında karşılaştırdık. Puan, okunan kelimelerin yüzde kaçının gerçek Türkçe kelime
olduğu:

| Yarışmacı | Bilinen kelime | Sayfa başına süre |
|---|---|---|
| Surya 2 | %92,2 | ~120 saniye |
| Tesseract 5 (Türkçe) | %91,1 | 2,6 saniye |
| Apple Vision | %89,4 | ~1 saniye |

Kazanan Surya gibi görünüyor, değil mi? Ama bu hızla bütün arşiv **dört hafta** sürecekti!
Tesseract neredeyse onun kadar iyi ve kırk kat hızlı. İşi o aldı.

Apple Vision da boş durmadı: süslü başlıkları o okuyor. Tesseract "THE PATRICIAN" başlığını
"T FE CIAN" diye okumuştu. Taranmış Amiga sayılarındaki büyük yazılar Vision'la yeniden
okundu ve Amiga Dergisi'nde bulunan yazı sayısı 90'dan 184'e çıktı!

### 3. Reklam avı

Bu işin kahramanı TypeSafe'in **JEV** modeli. Tam bir dil modeli değil: çok hızlı, çok ucuz
bir sınıflandırıcı. Her sayfanın resmini ve okunan metin bloklarını gönderiyoruz. JEV de her
blok için yazı mı, reklam mı, sayfa numarası mı, resim altı mı, program dökümü mü
olduğuna karar veriyor.

Commodore'un 75. sayısında dokuz tam sayfa reklamın dokuzunu da buldu, hiçbir yazı sayfasına
"reklam" demedi. Bütün Commodore arşivi, yani 79 sayı ve 5.351 sayfa, **2,12 dolara** mal oldu!

Altın kural şu: bir blok ancak model en az %60 eminse atılıyor. Bir yazıdan paragraf
kaybetmek, metinde fazladan bir satır kalmasından çok daha kötü.

Bir de komik anımız var: 64'ler'in tam ortasında JEV "kredin bitti" dedi. 43 sayının 27'si
işlenmiş, gerisi sırada bekliyordu. Kredi yüklendi, kaldığı yerden devam etti. Neyse ki her
adım kaldığı yerden sürebiliyor.

### 4. Yazıları bir araya getirmek

Bir yazının nerede başlayıp nerede bittiğini bulmak, işin en zor kısmı oldu. En büyük
yardımcımız derginin kendi **içindekiler** sayfası. İçindekilerde geçmeyen bir başlık,
model çok emin değilse ara başlık sayılıyor. Yol boyunca çözülen dertlerden birkaçı:

- **Bozuk karakterler.** C64 Türkiye'nin bir sayısında "ı ş ğ" yerine "ý þ ð" çıkıyordu.
  Eski bir yazı tipi kodlaması meselesi; düzeltildi.
- **WordArt başlıklar!** 2000'lerin başında popüler olan o gösterişli başlıklar PDF'in içinde
  resim şeritleri olarak saklanmış. Tesseract üçünden hiçbirini okuyamadı, Apple Vision üçünü
  de okudu.
- **Kaybolan süs harfi.** Paragraf başındaki kocaman süs harfleri ayrı bir parça gibi
  görünüyor. Yerlerine kondu; ama taranmış sayfalarda OCR bazen hâlâ kaçırıyor ("u yazıya").
- **Her sayfanın tepesindeki etiketler.** "GRAFİK", "TANITIM", "MÜZİK" gibi bölüm etiketleri
  artık yeni yazı başlatmıyor.

### 5. Yazım hatalarına savaş

OCR'dan çıkan metinde hata bol: "ı" yerine "i", "rn" yerine "m", satır sonunda bölünmüş
kelimeler... Bunları Google'ın Gemini 3.1 Flash Lite modeline düzelttirdik. Ama sıkı
kurallarla! Model cümle yazamaz, kısaltamaz, ekleme yapamaz. Bir düzeltme metnin %20'sinden
fazlasını değiştiriyor ya da uzunluğunu %15'ten fazla oynatıyorsa reddediliyor ve özgün
metin kalıyor.

Sonuç: yaklaşık 91 bin parçanın 43 bininde düzeltme yapıldı, 3 bine yakın düzeltme
reddedildi. Program dökümlerine hiç dokunulmadı. Satır sonunda bölünmüş "oy-namışınızdır"
gibi kelimeler birleşiyor, ama "GHOST-BUSTERS" tiresini koruyor.

## C64 Programları Yeniden RUN!

Bu kısım benim favorim. C64 Türkiye'nin sayfalarında makine dili programları
**CHECKSUMMER** kontrol toplamlarıyla basılmış. O zamanlar bunları satır satır elle
yazardınız, bir rakamı yanlış yazınca da program çalışmazdı.

Kontrol toplamının formülünü CHECKSUMMER'ın kendi kaynak kodundan bulduk. OCR'dan çıkan her
satır bu formülle doğrulandı. Sonuç: tamamı doğrulanmış **23 program**! Her biri VICE
emülatöründe çalıştırılıp ekran görüntüsü alındı. Sitede sayının ve yazının yanında
indirilebilir .prg dosyası olarak duruyor. LOAD, RUN, keyfinize bakın!

## Kaça Patladı?

Merak ettiğinizi biliyorum. Bütün sayıları işlemek, modeller ve bulut kullanımı dahil
**yaklaşık 12 dolar** tuttu. Sitenin aylık maliyeti ise 1 doların altında: site statik
dosyalardan oluşuyor, aramanın kelime kısmı tarayıcınızda çalışıyor, sunucu ise yalnızca
kullanıldığında ayağa kalkıyor.

Yine de bütçe alarmlarını kurduk, ne olur ne olmaz!

## Taramalar Nerede?

Sitede sayfaları okuyabilirsiniz, ama taramaların kendisi indirilemiyor. Bu bilinçli bir karar.
Sayfa resimleri yalnızca sitenin kendi sayfalarında açılıyor; başka bir siteye gömülmeye
kalkarsanız gelmiyor.

Taramaların en iyi kopyaları temizlendi, eğrilikleri düzeltildi, içlerine aranabilir bir
metin katmanı eklendi ve soğuk depoya kaldırıldı. Kaynak dosyalara ihtiyacınız olursa
contact@coze.org adresine yazmanız yeterli.

## Ajanlara Özel: MCP!

Ve finalde sürprizimiz! Arşiv, MCP destekleyen yapay zekâ asistanlarına (Claude, ChatGPT,
Cursor...) doğrudan bağlanabiliyor. Asistanınız arşivde arama yapıp yazıları okuyabiliyor;
dergilere, sayılara, yazarlara, oyunlara ve konulara bakabiliyor. On bir araç var, hepsi
yalnızca okuyor ve giriş gerekmiyor. Claude Code için tek satır yeterli:

```bash
claude mcp add --transport http dergi https://dergi.coze.org/mcp
```

Ajanlarım için [NAS'ıma kurduğum kütüphanenin](/blog/2026-10-26-wikipedia-stack-overflow-and-the-amiga-hrm-on-my-nas)
yanında bu da artık bir raf. "1989'da Turrican hakkında kim ne yazmış?" diye sorun, asistanınız
dergiyi açıp okusun.

Bir de küçük bir sürpriz: "Hakkında" sayfasında **Claude'un değerlendirmesi** var. Bütün
derlemi baştan sona işleyen Claude, her dergi için kendi karnesini yazdı: hangi dergi neye
iyi, tarama ne kadar temiz, OCR ne kadar güvenilir. Okumanızı tavsiye ederim!

## Hâlâ Dertli Olanlar

Dürüst olalım, her şey kusursuz değil:

- Bazı yazılar komşusuyla birleşmiş ya da ikiye bölünmüş, özellikle başlığı resim gibi dizilmiş
  oyun tanıtımlarında.
- Süslü başlıkların bir kısmı hâlâ tuhaf okunuyor ("Hannibal" yerine "HANNRA").
- 64'ler'deki yazılarda imza çoğunlukla yok, yani yazarların çoğu yazar sayfalarında görünmüyor.
- Yazım düzeltmesi arada bir doğru kelimeyi de "düzeltebiliyor". Ama asıl sayfa hep yanında.

Bir hata görürseniz yazının adresiyle birlikte yazın, düzeltelim!

## Gelecek Sayıda

Raflar büyüyor! Sırada iki yeni dergi ve iki yeni koleksiyon var. **Matematik Dünyası**
"bilim" rafında, **Laneth** ise "metal" rafında yer alacak. Laneth'i hatırlayanlar
[Retrojen yazımda](/blog/2013-05-26-enter-retrojen) adını görmüştür. Ardından Eğitimde
Bilgisayar ve birkaç Commodore ve Amiga dergisi daha geliyor. Kodun tamamı da açık:
[github.com/c0ze/dergi.coze.org](https://github.com/c0ze/dergi.coze.org).

> **ARANAN SAYILAR!**<br>
> Elinizde bu sayılar varsa lütfen bize ulaşın:<br>
> **64'ler:** 24, 25, 36, 44, 46, 47, 48, 49, 50<br>
> **Amiga Dergisi:** 6, 7, 9<br>
> Tarayıcıya koyun, gönderin, arşive girsin!

Bir sonraki sayıda görüşmek üzere. Bol disketli, bol joystick'li günler!

*Arda*
