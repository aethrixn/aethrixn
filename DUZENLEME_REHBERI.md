# AETHRIXN profil paketi — V3

Bu paket `github.com/aethrixn` profil README'sini üretir. V3 bilinçli olarak tek odaklıdır: bir anime hero, kısa profil metni, seçili işler ve canlı katkı yılanı.

## En kısa yol

```bash
node build.mjs
node preview-readme.mjs
```

Sonra `preview-readme.html` dosyasını tarayıcıda aç.

## Dosya haritası

| Dosya | Görevi |
| --- | --- |
| `README.md` | Profilde görünen metinler ve bağlantılar. |
| `src/hero.mjs` | Masaüstü ve mobil hero kompozisyonu, metinler ve animasyon. |
| `src/tokens.mjs` | Turkuaz renk ailesi ve temel tipografi değerleri. |
| `assets/aizen-reference-lossless.webp` | Hero içinde kullanılan şeffaf karakter kaynağı. |
| `assets/hero.svg` | Üretilen masaüstü hero. Elle düzenleme. |
| `assets/hero-mobile.svg` | Üretilen mobil hero. Elle düzenleme. |
| `.github/workflows/snake.yml` | Turkuaz katkı yılanını her gece yeniler. |
| `CREDITS.md` | Uyarlanan MIT lisanslı tekniklerin ve karakter kaynağının atıfları. |

## Metni değiştirmek

Hero metinleri `src/hero.mjs` başındaki `HERO` nesnesindedir. Uzun profil metni ve proje listesi `README.md` içindedir.

## Rengi değiştirmek

Ana vurgu `src/tokens.mjs` içindeki `accent: '#00EAD0'` satırıdır. Katkı yılanının renkleri ayrıca `.github/workflows/snake.yml` içinde URL-encoded biçimde tutulur.

## Karakteri konumlandırmak

`src/hero.mjs` içindeki `DESKTOP.figure` ve `MOBILE.figure` değerlerini değiştir:

- `x` ve `y`: konum
- `width` ve `height`: boyut

Her değişiklikten sonra `node build.mjs` çalıştır.

## Neden iki hero var?

GitHub README içindeki `<picture>` etiketi ekran genişliğine göre masaüstü veya mobil SVG'yi seçer. Böylece karakter telefonda metnin üzerine düşmez. Her iki SVG de JavaScript kullanmadan kendi içinde hareket eder ve `prefers-reduced-motion` açıkken animasyonu kapatır.
