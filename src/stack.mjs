import { T } from './tokens.mjs';
import { svgOpen, defsCommon, esc, n } from './lib.mjs';

// ── Düzenlenebilir içerik ────────────────────────────────────────────────────
export const ROWS = [
  ['TYPESCRIPT', 'REACT', 'NEXT.JS', 'TAILWIND', 'NODE.JS', 'FLUTTER', 'DART'],
  ['PYTHON', 'POSTGRESQL', 'SUPABASE', 'DOCKER', 'FIGMA', 'AI AGENTS', 'DESIGN SYSTEMS'],
];

const W = 1200, H = 132, FS = 12.5, CW = FS * 0.6, PH = 38;

// Mono yazı tipi kullanıldığı için genişlik karakterden hesaplanabiliyor.
const pillW = (label) => n(label.length * CW + 44);

function pill(x, y, label, accent) {
  const w = pillW(label);
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${PH}" rx="${PH / 2}" fill="${T.panel}" stroke="${accent ? T.accentDeep : T.line}"/>
    <circle cx="${n(x + 18)}" cy="${n(y + PH / 2)}" r="3" fill="${accent ? T.accent : T.line2}"/>
    <text x="${n(x + 30)}" y="${n(y + PH / 2 + 4)}" fill="${accent ? T.accentSoft : T.textDim}" font-family="${T.mono}" font-size="${FS}" font-weight="700" letter-spacing="0">${esc(label)}</text>
  </g>`;
}

function row(items, y, dur, reverse) {
  const gap = 12;
  const unit = items.reduce((a, s) => a + pillW(s) + gap, 0);
  const reps = Math.ceil((W * 2) / unit) + 1;
  let inner = '', x = 0;
  for (let r = 0; r < reps; r++) {
    items.forEach((s, i) => {
      inner += pill(n(x), y, s, (r + i) % 4 === 0);
      x += pillW(s) + gap;
    });
  }
  const from = reverse ? `${n(-unit)} 0` : '0 0';
  const to   = reverse ? '0 0' : `${n(-unit)} 0`;
  return `<g>${inner}
    <animateTransform attributeName="transform" type="translate" from="${from}" to="${to}" dur="${dur}s" repeatCount="indefinite"/>
  </g>`;
}

export function buildStack() {
  return `${svgOpen(W, H, 'AETHRIXN stack marquee',
    'Two rows of technology pills scrolling in opposite directions behind a soft edge fade.', 'st')}
  <defs>
    ${defsCommon('st')}
    <clipPath id="st-frame"><rect width="${W}" height="${H}" rx="20"/></clipPath>
    <linearGradient id="st-fadeg" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#000"/><stop offset=".13" stop-color="#fff"/><stop offset=".87" stop-color="#fff"/><stop offset="1" stop-color="#000"/>
    </linearGradient>
    <mask id="st-fade"><rect width="${W}" height="${H}" fill="url(#st-fadeg)"/></mask>
  </defs>
  <g clip-path="url(#st-frame)">
    <rect width="${W}" height="${H}" fill="url(#st-bg)"/>
    <rect width="${W}" height="${H}" fill="url(#st-grid)"/>
    <g mask="url(#st-fade)">
      ${row(ROWS[0], 22, 34, false)}
      ${row(ROWS[1], 72, 42, true)}
    </g>
    <rect width="${W}" height="${H}" fill="url(#st-vig)" opacity=".3"/>
  </g>
  <rect x=".75" y=".75" width="${W - 1.5}" height="${H - 1.5}" rx="19.25" fill="none" stroke="${T.line}" stroke-width="1.5"/>
</svg>`;
}
