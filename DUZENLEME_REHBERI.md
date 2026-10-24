# Profil düzenleme rehberi

Bu repo `github.com/aethrixn` profil sayfasını üretir. Her bölüm `assets/` altında bir SVG kartıdır; görseller kartların içine
WebP olarak gömülüdür. GitHub, `<picture>` ile açık/koyu temaya ve 700 px'ten dar ekrana göre doğru dosyayı seçer.

## Dosya haritası

| Dosya | Görevi |
| --- | --- |
| `README.md` | Kartların sırası, bağlantıları ve erişilebilir alt metinleri. |
| `assets/profile-*.svg` | `git wild.` kapağı, avatar, ad ve düğmeler. |
| `assets/buildary*.svg` | Buildary kartı (iki temada aynı; siyah + lime marka kimliği). |
| `assets/github-*.svg` | "On GitHub" kartı. Elle düzenleme: `scripts/stats.mjs` üretir. |
| `assets/github-stats.json` | Kartın son verisi; betik yeni toplam bundan düşükse kartı değiştirmez. |
| `assets/stack-*.svg` | `under the hood.` sahnesi ve teknoloji ikonları. |
| `assets/also-*.svg` | CodionX ve önceki işler. |
| `assets/contact-*.svg`, `assets/button-*.svg` | İletişim sahnesi, e-posta ve X düğmeleri. |
| `assets/footer*.svg` | `one more commit.` kapanış şeridi. |
| `assets/src/terrarium.webp` | İstatistik kartındaki teraryum; betik bunu gömer. |
| `scripts/stats.mjs` | GitHub verisini çekip istatistik kartını yeniden çizer. |
| `.github/workflows/stats.yml` | Betiği her gece 00:17 UTC'de çalıştırır, değişiklik varsa commit eder. |

## İstatistikler

`GITHUB_TOKEN=... node scripts/stats.mjs` kartı yerelde yeniler. Actions'ın varsayılan token'ı gizli repolardaki katkıları
görmeyebilir; o zaman betik kartı olduğu gibi bırakır. Gizli katkıların da sayılması için repo ayarlarında `read:user`
yetkili bir `PROFILE_STATS_TOKEN` sırrı ekle.

## Profil fotoğrafı ve biyografi

README bunları değiştirmez. Profil fotoğrafı (`github-avatar-2d.png`) ve yan sütundaki biyografi GitHub ayarlarından elle güncellenir.
