// ─────────────────────────────────────────────────────────────────────────────
// AETHRIXN design tokens
// Tek kaynak: renk / tipografi / ölçü burada değişir, bütün SVG'ler uyar.
// ─────────────────────────────────────────────────────────────────────────────

export const T = {
  // Noir zemin katmanları (koyudan açığa)
  ink:       '#04060A',
  ink2:      '#080C12',
  panel:     '#0B1119',
  panelHi:   '#101822',
  line:      '#18222E',
  line2:     '#26343F',

  // Metin katmanları
  text:      '#EAF2F8',
  textDim:   '#93A3B4',
  textSoft:  '#7B8C9D',
  textFaint: '#576674',

  // TEK vurgu rengi (aether) + tonları
  accent:     '#39D7FF',
  accentSoft: '#A8EEFF',
  accentDeep: '#0C4F63',
  accentInk:  '#062A36',

  // Durum renkleri — vurgu ailesinden türetilmiş, palet bozulmasın
  live:  '#39D7FF',
  build: '#7FE3B0',
  lab:   '#8C9BAA',

  // DİKKAT: XML özniteliği çift tırnakla açıldığı için font adlarında
  // TEK tırnak kullanılmalı. Çift tırnak koyarsan SVG bozulur.
  sans: "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif",
  mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",

  W: 1200,
  radius: 26,
};

// Monospace yazı tipleri için ortalama karakter genişliği (em cinsinden).
// Menlo/Consolas/SFMono hepsi ~0.6em ilerler; daktilo animasyonu buna dayanır.
export const MONO_ADVANCE = 0.6;
