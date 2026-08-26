# AETHRIXN profil paketi — düzenleme rehberi

Bu paket, `github.com/aethrixn` profil README'sini üreten kaynak dosyaların tamamıdır.
Amaç: metni, rengi ve hareketi **elle SVG kurcalamadan** değiştirebilmen.

---

## 0. En kısa yol

```bash
node build.mjs          # bütün SVG'leri yeniden üretir
node preview-readme.mjs # README'yi tarayıcıda görülebilir HTML'e çevirir
```

Sonra `preview-readme.html` dosyasını **kendi tarayıcında** (Safari/Chrome) aç.
Orada animasyonlar gerçek hâliyle oynar.

Sadece varlıkları görmek istersen `preview.html` dosyasını aç; SVG'leri satır içi
gömer, yani renkler ve saydamlık GitHub'daki hâline birebir eşittir.

---

## 1. Dosya haritası

| Dosya | Ne işe yarar |
| --- | --- |
| `README.md` | Profilde görünen metnin tamamı. Çoğu düzenleme burada yapılır. |
| `build.mjs` | Bütün SVG'leri üreten tek komut. |
| `src/tokens.mjs` | **Renk ve tipografi tek kaynağı.** Buradaki bir satır bütün kartları değiştirir. |
| `src/lib.mjs` | Ortak parçalar: ızgara, aurora, tarama çizgisi, kenar animasyonu, daktilo motoru. |
| `src/hero.mjs` | Üstteki büyük kart. Metinler dosyanın başındaki `HERO` nesnesinde. |
| `src/constellation.mjs` | Ürün haritası. Ürünler `NODES` dizisinde. |
| `src/telemetry.mjs` | Telemetri şeridi. Kelimeler `TELEMETRY` nesnesinde. |
| `src/stack.mjs` | Kayan teknoloji şeridi. Liste `ROWS` dizisinde. |
| `src/divider.mjs` | Bölüm arası ince ayraç. |
| `src/signature.mjs` | Aizen'li imza kartı. Konum/boyut `SIGNATURE.figure` içinde. |
| `src/placeholder3d.mjs` | 3B katkı alanı yer tutucusu (aşağıda anlatılıyor). |
| `assets/*.svg` | **Üretilen** dosyalar. Elle düzenleme — `build.mjs` üzerine yazar. |
| `assets/*.webp` | Kaynak görseller: temiz arka plan ve Aizen çizimi. |
| `.github/workflows/` | Gece çalışan iki otomasyon: yılan ve 3B katkı alanı. |
| `profile-3d.json` | 3B katkı alanının renk ayarları. |

---

## 2. Neyi nereden değiştirirsin

**Metin değişikliği** → çoğu zaman yalnızca `README.md`.

**Kart içindeki yazılar** → ilgili `src/*.mjs` dosyasının başındaki
"Düzenlenebilir içerik" bloğu. Örnek, hero'nun daktilo cümleleri:

```js
phrases: [
  'i build the system behind the demo.',
  'ai-native products, shipped end to end.',
  'idea → interface → intelligence → live.',
],
```

**Renk** → `src/tokens.mjs`. Vurgu rengini değiştirmek için tek satır:

```js
accent:     '#39D7FF',   // ana vurgu
accentSoft: '#A8EEFF',   // parlak ton
accentDeep: '#0C4F63',   // koyu ton
```

Vurguyu değiştirirsen **üç yeri daha** güncelle, yoksa palet ikiye bölünür:
1. `README.md` içindeki rozet URL'lerinde geçen `39D7FF` ve `0C4F63`
2. `.github/workflows/snake.yml` içindeki `color_snake` / `color_dots`
3. `profile-3d.json` içindeki `strongColor`, `radarColor`, `contribColors`

**Aizen'in yeri ve boyu** → `src/signature.mjs`:

```js
figure: { x: 812, y: -8, w: 340, h: 457 },
```

`x` büyürse sağa kayar, `w`/`h` birlikte büyürse karakter büyür.
Oranı bozmamak için `w` ve `h` değerlerini aynı yüzdeyle değiştir
(340/457 ≈ 0.744).

Her değişiklikten sonra: `node build.mjs`

---

## 3. Mekanizmalar — "neden böyle" kısmı

### 3.1 Neden animasyon SVG içine gömülü SMIL/CSS?

- **Bu ne:** Hareket, `<animate>` etiketleriyle SVG dosyasının *içinde* tanımlı.
  Dışarıdan bir JavaScript veya GIF yok.
- **Niye var:** GitHub README'de `<script>` çalışmaz. Markdown'a gömülen HTML
  temizlenir. Geriye yalnızca resim olarak yüklenen SVG'nin kendi
  bildirimsel animasyonu kalır.
- **Olmasaydı ne olurdu:** GIF kullanmak gerekirdi. GIF 256 renkle sınırlıdır,
  bu palette bantlaşma yapar, dosya en az 10 kat büyür ve metin okunmaz hâle gelir.
- **Nasıl çalışıyor:** Tarayıcı SVG'yi resim olarak çözer, içindeki zaman
  çizelgesini kendi işler. `dur` süre, `values` ara değerler, `repeatCount="indefinite"`
  sonsuz döngü demektir.
- **Başka nasıl yapılabilirdi:** (a) GIF/APNG — kalite kaybı; (b) dışarıdan
  bir servisin ürettiği SVG — başkasının sunucusuna bağımlılık; (c) hiç animasyon —
  istenen bu değildi.
- **Bize ne:** Dosyalar senin reponda, kimseye bağımlı değil, metin keskin,
  toplam 700 KB.

### 3.2 Daktilo efekti neden kırpma (clipPath) ile yapıldı?

- **Bu ne:** Yazı baştan sona tam hâlde duruyor; üstündeki görünmez bir
  dikdörtgen karakter karakter genişliyor.
- **Niye var:** SMIL'de "metnin uzunluğunu" canlandıran bir özellik yok.
  Harf harf yazmak için başka bir kaldıraç gerekiyordu.
- **Olmasaydı ne olurdu:** Her ara kare için ayrı `<text>` yazmak gerekirdi —
  35 harflik cümle için 35 etiket, üç cümlede yüzden fazla.
- **Nasıl çalışıyor:** `calcMode="discrete"` sayesinde genişlik yumuşak değil
  **basamak basamak** artıyor; bu da gerçek daktilo hissini veriyor. İmleç aynı
  basamaklarla ilerliyor.
- **Başka nasıl yapılabilirdi:** CSS `steps()` fonksiyonu ile — ama o zaman
  yazı tipi genişliğine daha da bağımlı olurduk.
- **Bize ne:** Tek `<text>` etiketi, temiz dosya, istediğin cümleyi yazıp
  yeniden derlemen yeterli.

### 3.3 Neden tek vurgu rengi?

- **Bu ne:** Bütün palette siyah tonları + **tek** bir camgöbeği (`#39D7FF`).
- **Niye var:** İki veya daha fazla parlak renk kullanınca göz nereye bakacağını
  bilemiyor ve tasarım "ucuz" görünüyor. Tek vurgu, hiyerarşiyi renk üzerinden
  kurmayı zorunlu kılıyor.
- **Olmasaydı ne olurdu:** Mor-camgöbeği gradyanlı, 2019 tarzı bir profil.
- **Nasıl çalışıyor:** Renk yalnızca *dikkat çekilmesi gereken* yerde kullanılıyor:
  aktif durum, canlı veri, yürüyen ışık. Geri kalan her şey griler.
- **Başka nasıl yapılabilirdi:** İki vurgulu bir sistem (biri "canlı", biri "arşiv")
  kurulabilirdi; ama beş kartta beş anlam yönetmek zorlaşırdı.
- **Bize ne:** Renk değiştirmek istediğinde tek satır yetiyor.

### 3.4 Neden hazır servis yerine kendi SVG'lerimiz?

- **Bu ne:** Hero, ürün haritası, telemetri, teknoloji şeridi ve ayraç tamamen
  bu pakette üretiliyor.
- **Niye var:** Popüler profil servisleri kapanıyor. Bu paketi hazırlarken
  ölçtüğüm sonuçlar (27 Ağustos 2026):

  | Servis | Durum |
  | --- | --- |
  | `github-readme-stats.vercel.app` | **503 — DEPLOYMENT_PAUSED** |
  | `github-readme-activity-graph.vercel.app` | **402 — DEPLOYMENT_DISABLED** |
  | `github-profile-trophy.vercel.app` | **402 — DEPLOYMENT_DISABLED** |
  | `github-profile-summary-cards.vercel.app` | 200 — çalışıyor |
  | `streak-stats.demolab.com` | 200 — çalışıyor |
  | `readme-typing-svg.demolab.com` | 200 — çalışıyor |
  | `komarev.com/ghpvc` | 200 — çalışıyor |

  İlk üçü, çoğu "en iyi profil" listesinde hâlâ önerilen servisler. Onları
  koysaydık profilinde üç kırık görsel olurdu.
- **Olmasaydı ne olurdu:** Profilin görünümü başkalarının Vercel faturasına
  bağlı olurdu.
- **Nasıl çalışıyor:** Kimlik (hero, harita, imza) senin reponda; yalnızca
  *gerçek sayı* gerektiren kartlar dışarıdan geliyor.
- **Başka nasıl yapılabilirdi:** `github-profile-summary-cards`'ı kendi Vercel
  hesabına kurabilirsin — o zaman dış bağımlılık da biter.
- **Bize ne:** Bir servis daha kapansa profilin **kimliği** bozulmaz;
  yalnızca bir sayı kartı eksilir.

### 3.5 3B katkı alanı yer tutucusu neden var?

`profile-3d-contrib/profile-aethrixn.svg` dosyasını GitHub Actions üretir.
Ama README'yi ilk gönderdiğinde bu dosya **henüz yoktur** ve profilde kırık
görsel çıkar. Bu yüzden pakete aynı isimde, palete uygun, animasyonlu bir
yer tutucu koydum. Action ilk kez çalıştığında üzerine yazar; sen bir şey
yapmazsın.

### 3.6 Neden kart animasyonları kapalı?

`github-profile-summary-cards` servisi `&animation=load` gibi bir parametre
kabul ediyor ve gerçekten güzel görünüyor. **Ama** o animasyon içeriği
`opacity: 0` ile başlatıyor. Animasyonu çalıştırmayan bir görüntüleyicide
kart **tamamen boş** görünüyor — çerçeve var, içerik yok.

Bunu ölçtüm ve doğruladım. Bu yüzden parametreyi kaldırdım: bir animasyonun
kaybolması kabul edilebilir, içeriğin kaybolması değil.

Denemek istersen URL'nin sonuna ekle:
`&animation=load&duration=2.6`

---

## 4. GitHub'a kurulum — sıra önemli

1. Bu klasörün içeriğini `aethrixn/aethrixn` reposunun köküne koy.
2. Gönder (push).
3. **Actions** sekmesine git ve şu iki iş akışını sırayla elle çalıştır:
   - `Generate 3D contribution field` → yer tutucuyu gerçek grafikle değiştirir
   - `Generate contribution signal` → yılanı **yeni** camgöbeği paletiyle üretir
4. Profili yenile.

3. adımı atlarsan: 3B alan yer tutucu kalır (kırık değil, sadece
"AWAITING FIRST BUILD" yazar) ve yılan eski siyah-beyaz paletinde görünür.

---

## 5. Bilinen zayıf noktalar — saklamıyorum

**5.1 `stats` kartını bilerek koymadım.**
Kartı çalıştırıp baktım, bugünkü verinle şunu gösteriyor:
`Total Commits: 17`, `Total PRs: 0`, `Total Issues: 0`, `Total Stars: 10`,
`4 Public Repos`. Aynı sayfada `profile-details` kartı `2.07k Contributions`
diyor. Yani asıl çalışman özel repolarda ve GitHub bunu saymıyor.

Vitrin profilinde "Total PRs: 0" görmek, işini güçlendirmez, zayıflatır.
İki seçeneğin var:

- **Düzelt:** GitHub → Settings → Public profile → Contribution settings →
  *Include private contributions on my profile* kutusunu işaretle. Sonra kartı
  README'ye şu satırla geri ekle:

  ```html
  <img src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=aethrixn&theme=github_dark&bg_color=0B1119&title_color=39D7FF&text_color=93A3B4&border_color=18222E&icon_color=39D7FF&chart_color=39D7FF&hide_logo=true" alt="Stats" />
  ```

- **Bırak:** Public repo sayın artınca kart kendiliğinden anlamlı hâle gelir.

**5.2 "Türkiye's first open-source, AI-native web builder" iddiası.**
Bu cümle senin eski README'nden geldi, ben doğrulamadım ve doğrulayamam.
"İlk" demek, birinin daha erken bir örnek göstermesiyle çürütülebilecek bir
iddiadır. Sende bunu destekleyen bir tarih/kaynak varsa sorun yok; yoksa
`Türkiye's first` yerine `An open-source, AI-native web builder` demek
aynı gücü verir ve sırtın açıkta kalmaz. Karar senin — ben senin cümleni
değiştirmeden bıraktım.

**5.3 Yazı tipleri gömülü değil.**
Kartlar `Inter` ve `JetBrains Mono` istiyor; GitHub'da resim olarak yüklenen
SVG dış yazı tipi indiremez. Bu yüzden sistem yazı tipine düşüyor
(macOS'ta SF Pro / SF Mono, Windows'ta Segoe UI / Consolas). Görünüm
işletim sistemine göre birkaç piksel oynar. Tam sabitlemek isteseydik
yazıları vektör yola çevirmek gerekirdi — o zaman da metni bir daha
düzenleyemezdin. Bilinçli takas.

**5.4 Animasyon donarsa ne olur.**
Bazı gömülü tarayıcılar ve küçük resim üreticileri SVG animasyonunu
çalıştırmaz. O durumda kartlar **tam ve okunur** kalır; yalnızca şunlar
görünmez: hero'nun daktilo satırı, telemetri eğrisinin çizimi, odak
göstergesinin dolumu. Çerçeve, panel, başlık, çubuklar, halkalar hep yerinde.
Bunu bilerek böyle kurdum.

**5.5 Kanıt seviyeleri.**
- Servis durumları (§3.4 tablosu): **ölçüldü** — 27 Ağustos 2026, HTTP kodları.
- `github-profile-3d-contrib@v0.9.3`: **doğrulandı** — GitHub sürüm API'si.
  (`@v4` yazsaydım iş akışı patlardı; öyle bir sürüm yok.)
- Kartların çıktı boyutları ve renk parametreleri: **ölçüldü** — SVG indirilip
  bakıldı.
- "GitHub'da `<img>` içindeki SMIL animasyonu oynar": **doğrudan ölçemedim.**
  Bu paketi hazırladığım tarayıcı, resim olarak yüklenen SVG'de hem SMIL'i hem
  CSS'i donduruyor. Gerçek Chrome/Safari/Firefox'ta oynadığına dair kanıt
  dolaylı: `readme-typing-svg` gibi yaygın araçlar tam olarak bu yolla çalışıyor.
  **Sen `preview-readme.html`'i kendi tarayıcında açıp bir bak** — bu, konuyu
  kesin olarak kapatır.
