import { T, MONO_ADVANCE } from './tokens.mjs';

// XML'e güvenli metin — & < > ve tırnaklar kaçırılır.
export const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

export const n = (v) => Number(v.toFixed(3));

// ── Ortak <defs> parçaları ───────────────────────────────────────────────────

export function defsCommon(id) {
  return `
    <linearGradient id="${id}-bg" x1="0" y1="0" x2=".35" y2="1">
      <stop stop-color="${T.ink2}"/><stop offset=".55" stop-color="${T.ink}"/><stop offset="1" stop-color="#020407"/>
    </linearGradient>
    <pattern id="${id}-grid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="${T.accentSoft}" stroke-opacity=".045" stroke-width="1"/>
    </pattern>
    <radialGradient id="${id}-vig" cx=".5" cy=".45" r=".78">
      <stop stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </radialGradient>
    <filter id="${id}-glow" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="3.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="${id}-soft" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>`;
}

// Yavaşça yer değiştiren iki bulanık ışık kütlesi — "aurora" derinliği verir.
export function auroraLayer(id, w, h) {
  return `
  <g filter="url(#${id}-soft)" opacity=".5">
    <ellipse cx="${n(w * 0.24)}" cy="${n(h * 0.22)}" rx="230" ry="140" fill="${T.accentDeep}" opacity=".55">
      <animate attributeName="cx" values="${n(w*0.24)};${n(w*0.34)};${n(w*0.24)}" dur="19s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".55;.28;.55" dur="19s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="${n(w * 0.78)}" cy="${n(h * 0.74)}" rx="260" ry="150" fill="${T.accentInk}" opacity=".8">
      <animate attributeName="cx" values="${n(w*0.78)};${n(w*0.68)};${n(w*0.78)}" dur="23s" repeatCount="indefinite"/>
    </ellipse>
  </g>`;
}

// Kartın üstünden geçen ince tarama çizgisi (CRT hissi, çok düşük opaklık).
export function scanline(w, h, dur = 7) {
  return `
  <rect x="0" y="-2" width="${w}" height="1.5" fill="${T.accentSoft}" opacity=".10">
    <animate attributeName="y" values="-2;${h + 2}" dur="${dur}s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0;.16;.05;0" dur="${dur}s" repeatCount="indefinite"/>
  </rect>`;
}

// Kenarda yürüyen kesik çizgi + üzerinde koşan parlak segment.
export function marchingBorder(w, h, r) {
  const perim = 2 * (w - 3 + h - 3);
  return `
  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none"
        stroke="${T.line2}" stroke-width="1.4"/>
  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none"
        stroke="${T.accent}" stroke-width="1.6" stroke-linecap="round"
        stroke-dasharray="150 ${n(perim - 150)}" opacity=".85">
    <animate attributeName="stroke-dashoffset" values="0;${n(-perim)}" dur="14s" repeatCount="indefinite"/>
  </rect>`;
}

// Nefes alan durum noktası.
export function pulseDot(cx, cy, r, fill, dur = 2.4) {
  return `
  <g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity=".28">
      <animate attributeName="r" values="${r};${n(r * 3.2)};${r}" dur="${dur}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values=".38;0;.38" dur="${dur}s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>
  </g>`;
}

// ── Daktilo animasyonu ───────────────────────────────────────────────────────
// SMIL'de metin uzunluğu animasyonu yok; bu yüzden metni sabit bırakıp
// üstündeki clip dikdörtgeninin genişliğini karakter karakter (discrete)
// büyütüyoruz. İmleç de aynı adımlarla ilerliyor.

export function typewriter({ id, phrases, x, y, fontSize = 15, fill = T.text,
                             typeMs = 52, holdMs = 2200, eraseMs = 20, gapMs = 260 }) {
  const cw = fontSize * MONO_ADVANCE;
  let t = 500;
  const segs = phrases.map((p) => {
    const len = [...p].length;
    const t0 = t, t1 = t0 + len * typeMs, t2 = t1 + holdMs, t3 = t2 + len * eraseMs;
    t = t3 + gapMs;
    return { p, len, t0, t1, t2, t3 };
  });
  const TOTAL = t + 300;
  const k = (ms) => Math.min(1, Math.max(0, ms / TOTAL)).toFixed(5);

  const clips = [];
  const nodes = [];

  segs.forEach((s, i) => {
    const vals = [], kts = [];
    const push = (v, ms) => { vals.push(n(v)); kts.push(k(ms)); };
    push(0, 0);
    for (let c = 0; c <= s.len; c++) push(c * cw, s.t0 + c * typeMs);
    push(s.len * cw, s.t2);
    for (let c = s.len; c >= 0; c--) push(c * cw, s.t2 + (s.len - c) * eraseMs);
    push(0, TOTAL);

    const V = vals.join(';'), K = kts.join(';');
    // Taban width: animasyon çalışmazsa (bazı gömücüler dondurur) ilk cümle
    // tam görünsün, diğerleri 0 kalsın ki üst üste binmesinler.
    clips.push(`<clipPath id="${id}-c${i}"><rect x="${x}" y="${y - fontSize}" height="${n(fontSize * 1.5)}" width="${i === 0 ? n(s.len * cw) : 0}">
      <animate attributeName="width" values="${V}" keyTimes="${K}" dur="${TOTAL}ms" calcMode="discrete" repeatCount="indefinite"/>
    </rect></clipPath>`);

    nodes.push(`
    <g clip-path="url(#${id}-c${i})">
      <text x="${x}" y="${y}" fill="${fill}" font-family="${T.mono}" font-size="${fontSize}"
            font-weight="600" xml:space="preserve">${esc(s.p)}</text>
    </g>
    <rect x="${x}" y="${n(y - fontSize + 2)}" width="${n(cw * 0.85)}" height="${n(fontSize + 2)}" fill="${T.accent}" opacity="0">
      <animate attributeName="x" values="${V}" keyTimes="${K}" dur="${TOTAL}ms" calcMode="discrete"
               additive="sum" repeatCount="indefinite"/>
      <animate attributeName="opacity"
               values="0;0;.9;.9;0;0"
               keyTimes="0;${k(Math.max(0, s.t0 - 60))};${k(s.t0)};${k(s.t3)};${k(s.t3 + 60)};1"
               dur="${TOTAL}ms" repeatCount="indefinite"/>
    </rect>`);
  });

  // İmleç x'i additive="sum" ile taban x üzerine eklenir.
  return {
    defs: clips.join('\n'),
    body: nodes.join('\n'),
    total: TOTAL,
  };
}

// Küçük etiket rozeti (metrik çipi).
export function chip({ x, y, w, h = 46, label, value, accent = false }) {
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${T.panel}" stroke="${accent ? T.accentDeep : T.line}" stroke-width="1"/>
    <rect x="${x}" y="${y}" width="3" height="${h}" rx="1.5" fill="${accent ? T.accent : T.line2}"/>
    <text x="${x + 16}" y="${y + 19}" fill="${T.textFaint}" font-family="${T.mono}" font-size="10" font-weight="700" letter-spacing="1.6">${esc(label)}</text>
    <text x="${x + 16}" y="${y + 36}" fill="${accent ? T.accentSoft : T.text}" font-family="${T.sans}" font-size="15" font-weight="700" letter-spacing=".2">${esc(value)}</text>
  </g>`;
}

export function svgOpen(w, h, title, desc, id = 'x') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-t ${id}-d" preserveAspectRatio="xMidYMid meet">
  <title id="${id}-t">${esc(title)}</title>
  <desc id="${id}-d">${esc(desc)}</desc>`;
}
