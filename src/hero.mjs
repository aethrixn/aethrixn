import fs from 'node:fs/promises';
import { T } from './tokens.mjs';
import { esc, svgOpen } from './lib.mjs';

// Tek odaklı profil kahramanı. Metni değiştirmek için yalnızca bu blok yeterli.
export const HERO = {
  eyebrow: 'MIRZA ŞİMŞEK · PRODUCT BUILDER',
  wordmark: 'AETHRIXN',
  statement: 'I build useful AI products—',
  statementAccent: 'from interface to infrastructure.',
  meta: 'MANAGEMENT INFORMATION SYSTEMS · CODIONX · TÜRKİYE',
  rail: 'BUILDARY · RESEARCH AGENTS · INTERFACES · OPEN SOURCE · SHIPPED · ',
};

const DESKTOP = {
  width: 1200,
  height: 460,
  wordmark: { x: 58, y: 184, size: 92, spacing: 3 },
  eyebrow: { x: 62, y: 66 },
  statement: { x: 62, y: 246, secondY: 282, size: 25 },
  meta: { x: 62, y: 340 },
  figure: { x: 842, y: -12, width: 300, height: 404 },
  halo: { cx: 996, cy: 220, rx: 182, ry: 192 },
  railY: 398,
  railHeight: 62,
  railSize: 18,
  railSpan: 1060,
  label: 'desktop',
};

const MOBILE = {
  width: 720,
  height: 720,
  wordmark: { x: 42, y: 153, size: 76, spacing: 2 },
  eyebrow: { x: 44, y: 57 },
  statement: { x: 44, y: 212, secondY: 248, size: 25 },
  meta: { x: 44, y: 302 },
  figure: { x: 352, y: 272, width: 310, height: 417 },
  halo: { cx: 506, cy: 494, rx: 180, ry: 190 },
  railY: 658,
  railHeight: 62,
  railSize: 17,
  railSpan: 1060,
  label: 'mobile',
};

function railText(layout) {
  const y = layout.railY + 39;
  const copies = [0, layout.railSpan, layout.railSpan * 2]
    .map((x) => `<text x="${x}" y="${y}" class="rail-text">${esc(HERO.rail)}</text>`)
    .join('');

  return `<g class="rail" aria-hidden="true">
    <rect x="0" y="${layout.railY}" width="${layout.width}" height="${layout.railHeight}" fill="${T.accent}"/>
    <g class="rail-track">${copies}</g>
  </g>`;
}

export async function buildHero(baseUrl, variant = 'desktop') {
  const figure = await fs.readFile(new URL('../assets/aizen-reference-lossless.webp', baseUrl));
  const layout = variant === 'mobile' ? MOBILE : DESKTOP;
  const { width: W, height: H } = layout;
  const f = layout.figure;
  const a = layout.halo;

  return `${svgOpen(W, H, `AETHRIXN — ${layout.label} profile hero`,
    'A minimal black profile cover for Mirza Şimşek with a bright turquoise moving index and an anime character portrait.', `hero-${layout.label}`)}
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#020405"/><stop offset=".62" stop-color="#070A0B"/><stop offset="1" stop-color="#020405"/>
    </linearGradient>
    <linearGradient id="figure-fade" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#020405"/><stop offset=".2" stop-color="#020405" stop-opacity=".22"/><stop offset="1" stop-color="#020405" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${T.accent}" stop-opacity="0"/>
      <stop offset=".5" stop-color="${T.accent}" stop-opacity=".12"/>
      <stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="halo">
      <stop stop-color="${T.accent}" stop-opacity=".20"/>
      <stop offset=".55" stop-color="${T.accent}" stop-opacity=".065"/>
      <stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="duotone" color-interpolation-filters="sRGB" x="-15%" y="-15%" width="130%" height="130%">
      <feColorMatrix type="matrix" values="
        .16 .50 .05 0 0
        .19 .62 .06 0 0
        .20 .67 .07 0 0
        0 0 0 1 0"/>
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude="1" exponent="1.22" offset="0"/>
        <feFuncG type="gamma" amplitude="1" exponent="1.18" offset="0"/>
        <feFuncB type="gamma" amplitude="1" exponent="1.12" offset="0"/>
      </feComponentTransfer>
    </filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30"/>
    </filter>
    <clipPath id="frame"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <clipPath id="portrait-reveal">
      <rect x="${f.x - 28}" y="${f.y}" width="${f.width + 56}" height="${f.height}">
        <animate attributeName="height" from="0" to="${f.height}" dur="1.4s" begin=".15s" fill="freeze"/>
      </rect>
    </clipPath>
  </defs>
  <style>
    .sans { font-family: ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif; }
    .mono { font-family: ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace; }
    .wordmark { animation: title-in .9s cubic-bezier(.2,.8,.2,1) both; }
    .copy { animation: copy-in .85s ease-out .18s both; }
    .figure { transform-box: fill-box; transform-origin: center; animation: figure-in 1.15s cubic-bezier(.2,.8,.2,1) both, float 7s ease-in-out 1.15s infinite; }
    .sheen { animation: sheen 10s ease-in-out infinite; }
    .rail-track { animation: rail 18s linear infinite; }
    .rail-text { font-family: ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif; font-size: ${layout.railSize}px; font-weight: 900; letter-spacing: 3.4px; fill: #001613; white-space: pre; }
    @keyframes title-in { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes copy-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes figure-in { from { opacity: 0; transform: translateY(22px); } to { opacity: .98; transform: translateY(0); } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes sheen { 0%,52% { transform: translateX(-${W * .26}px); opacity: 0; } 62% { opacity: 1; } 82%,100% { transform: translateX(${W * 1.2}px); opacity: 0; } }
    @keyframes rail { from { transform: translateX(0); } to { transform: translateX(-${layout.railSpan}px); } }
    @media (prefers-reduced-motion: reduce) {
      .wordmark,.copy,.figure,.sheen,.rail-track { animation: none !important; }
      .wordmark,.copy,.figure { opacity: 1; transform: none; }
      animate,animateTransform { display: none; }
    }
  </style>

  <g clip-path="url(#frame)">
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect x="0" y="0" width="4" height="${layout.railY}" fill="${T.accent}"/>
    <path d="M0 ${layout.railY - 1}H${W}" stroke="#1B2728"/>

    <g aria-hidden="true">
      <ellipse cx="${a.cx}" cy="${a.cy}" rx="${a.rx}" ry="${a.ry}" fill="url(#halo)" filter="url(#soft)"/>
      <path d="M${a.cx - 112} ${a.cy + 114}L${a.cx + 92} ${a.cy - 160}" stroke="${T.accent}" stroke-opacity=".13"/>
      <path d="M${a.cx - 72} ${a.cy + 150}L${a.cx + 132} ${a.cy - 124}" stroke="#F4F7F8" stroke-opacity=".07"/>
    </g>

    <g class="figure" clip-path="url(#portrait-reveal)" filter="url(#duotone)">
      <image href="data:image/webp;base64,${figure.toString('base64')}" x="${f.x}" y="${f.y}" width="${f.width}" height="${f.height}" preserveAspectRatio="xMidYMid meet"/>
    </g>
    <rect x="${Math.max(0, f.x - 64)}" y="0" width="120" height="${layout.railY}" fill="url(#figure-fade)" opacity=".72"/>

    <g class="sans">
      <text class="copy" x="${layout.eyebrow.x}" y="${layout.eyebrow.y}" fill="${T.accent}" font-size="12" font-weight="800" letter-spacing="3.1">${esc(HERO.eyebrow)}</text>
      <text class="wordmark" x="${layout.wordmark.x}" y="${layout.wordmark.y}" fill="#F4F7F8" font-size="${layout.wordmark.size}" font-weight="900" letter-spacing="${layout.wordmark.spacing}">${esc(HERO.wordmark)}</text>
      <g class="copy" font-size="${layout.statement.size}" font-weight="650">
        <text x="${layout.statement.x}" y="${layout.statement.y}" fill="#E6EBEC">${esc(HERO.statement)}</text>
        <text x="${layout.statement.x}" y="${layout.statement.secondY}" fill="${T.accent}">${esc(HERO.statementAccent)}</text>
      </g>
      <text class="copy mono" x="${layout.meta.x}" y="${layout.meta.y}" fill="#8E9A9E" font-size="11" font-weight="650" letter-spacing="1.8">${esc(HERO.meta)}</text>
    </g>

    <rect class="sheen" x="-${W * .24}" y="0" width="${W * .18}" height="${layout.railY}" fill="url(#sheen)" transform="skewX(-14)"/>
    ${railText(layout)}
    <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="13.5" fill="none" stroke="#20292B"/>
  </g>
</svg>`;
}
