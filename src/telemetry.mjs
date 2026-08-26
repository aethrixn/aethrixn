import { T } from './tokens.mjs';
import { defsCommon, auroraLayer, scanline, marchingBorder, pulseDot, svgOpen, esc, n } from './lib.mjs';

// ── Düzenlenebilir içerik ────────────────────────────────────────────────────
// DİKKAT: Bu kart bilinçli olarak SAYISAL İDDİA İÇERMEZ.
// Gerçek rakamlar README'deki canlı GitHub kartlarından gelir; burada
// uydurulmuş bir sayı bulunmaz.
export const TELEMETRY = {
  focusWords: ['AI SYSTEMS', 'PRODUCT', 'INTERFACE', 'RESEARCH'],
  ticker: ['AI PRODUCT ENGINEERING', 'DESIGN SYSTEMS', 'AGENTIC WORKFLOWS',
           'FULL-STACK ARCHITECTURE', 'OPEN SOURCE', 'INTERACTION MODELS',
           'MOBILE SURFACES', 'DATA BOUNDARIES'],
};

const W = 1200, H = 300, R = 26;
const PY = 70, PH = 152;

function panel(x, w, label, right, inner) {
  return `
  <g>
    <rect x="${x}" y="${PY}" width="${w}" height="${PH}" rx="16" fill="${T.panel}" stroke="${T.line}"/>
    <text x="${x + 18}" y="${PY + 24}" fill="${T.textDim}" font-family="${T.mono}" font-size="10" font-weight="800" letter-spacing="2">${esc(label)}</text>
    ${right ? `<text x="${x + w - 18}" y="${PY + 24}" text-anchor="end" fill="${T.accent}" font-family="${T.mono}" font-size="10" font-weight="800" letter-spacing="1.4">${esc(right)}</text>` : ''}
    <line x1="${x + 18}" y1="${PY + 34}" x2="${x + w - 18}" y2="${PY + 34}" stroke="${T.line}" stroke-width="1"/>
    ${inner}
  </g>`;
}

// A — sürekli dalgalanan aktivite histogramı
function histogram(x, w) {
  const bars = 26, pad = 20, bw = 8;
  const gap = (w - pad * 2 - bars * bw) / (bars - 1);
  const base = PY + PH - 24, maxH = 78;
  let out = '';
  for (let i = 0; i < bars; i++) {
    const bx = n(x + pad + i * (bw + gap));
    const a = 12 + ((i * 37) % 61), b = 12 + ((i * 53) % 71), c = 10 + ((i * 29) % 47);
    const hs = [a, b, c, a].map((v) => n((v / 71) * maxH + 6));
    const dur = n(2.6 + (i % 5) * 0.42);
    const hot = i > bars - 5;
    out += `<rect x="${bx}" y="${n(base - hs[0])}" width="${bw}" height="${hs[0]}" rx="3" fill="${hot ? T.accent : T.accentDeep}" opacity="${hot ? '.95' : '.8'}">
      <animate attributeName="height" values="${hs.join(';')}" dur="${dur}s" repeatCount="indefinite" begin="${n(-i * 0.13)}s"/>
      <animate attributeName="y" values="${hs.map((v) => n(base - v)).join(';')}" dur="${dur}s" repeatCount="indefinite" begin="${n(-i * 0.13)}s"/>
    </rect>`;
  }
  out += `<line x1="${x + pad}" y1="${base + 5}" x2="${n(x + w - pad)}" y2="${base + 5}" stroke="${T.line2}" stroke-width="1"/>`;
  return out;
}

// B — kendini çizen sinyal eğrisi
function sparkline(x, w) {
  const pad = 20, top = PY + 52, h = 76;
  const pts = [42, 58, 36, 64, 48, 76, 55, 88, 62, 96, 70, 84, 92, 74, 100];
  const step = (w - pad * 2) / (pts.length - 1);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${n(x + pad + i * step)} ${n(top + h - (p / 100) * h)}`).join(' ');
  const area = `${d} L${n(x + pad + (pts.length - 1) * step)} ${n(top + h)} L${n(x + pad)} ${n(top + h)} Z`;
  return `
  <g>
    ${[0, 1, 2, 3].map((i) => `<line x1="${x + pad}" y1="${n(top + (h / 3) * i)}" x2="${n(x + w - pad)}" y2="${n(top + (h / 3) * i)}" stroke="${T.line}" stroke-width="1" opacity=".7"/>`).join('')}
    <path d="${area}" fill="url(#tm-area)" opacity=".9"><animate attributeName="opacity" values="0;.9;.9;0" keyTimes="0;.35;.9;1" dur="9s" repeatCount="indefinite"/></path>
    <path id="tm-spark" d="${d}" fill="none" stroke="${T.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          stroke-dasharray="1200" stroke-dashoffset="0">
      <animate attributeName="stroke-dashoffset" values="1200;0;0;1200" keyTimes="0;.35;.9;1" dur="9s" repeatCount="indefinite"/>
    </path>
    <g filter="url(#tm-glow)">
      <circle r="4" fill="${T.accentSoft}">
        <animateMotion dur="9s" keyPoints="0;1;1;0" keyTimes="0;.35;.9;1" calcMode="linear" repeatCount="indefinite"><mpath href="#tm-spark"/></animateMotion>
      </circle>
    </g>
  </g>`;
}

// C — dolan halka ölçek + dönen odak kelimeleri
function gauge(x, w) {
  const cx = n(x + w / 2), cy = PY + 96, r = 42;
  const C = n(2 * Math.PI * r);
  const words = TELEMETRY.focusWords;
  const each = 1 / words.length;
  return `
  <g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${T.line}" stroke-width="7"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${T.accent}" stroke-width="7" stroke-linecap="round"
            stroke-dasharray="${C}" stroke-dashoffset="${n(C * 0.12)}" transform="rotate(-90 ${cx} ${cy})">
      <animate attributeName="stroke-dashoffset" values="${C};${n(C * 0.12)};${n(C * 0.12)};${C}" keyTimes="0;.3;.85;1" dur="8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${cx}" cy="${cy}" r="${r + 13}" fill="none" stroke="${T.accentDeep}" stroke-width="1" stroke-dasharray="3 9">
      <animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="30s" repeatCount="indefinite"/>
    </circle>
    ${words.map((wd, i) => {
      const inAt = i * each, outAt = i * each + each - 0.03, fade = 0.025;
      const kt = [0, Math.max(0, inAt - 0.0001), n(inAt + fade), n(outAt), n(outAt + fade), 1];
      return `<text x="${cx}" y="${cy + 4}" text-anchor="middle" fill="${T.accentSoft}" font-family="${T.mono}" font-size="12" font-weight="800" letter-spacing="1.2" opacity="${i === 0 ? 1 : 0}">${esc(wd)}
      <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${kt.join(';')}" dur="12s" repeatCount="indefinite"/></text>`;
    }).join('')}
  </g>`;
}

// Alt şerit — sonsuz kayan yazı
function ticker() {
  const items = TELEMETRY.ticker;
  const line = items.map((i) => `◇  ${i}`).join('    ');
  const CWD = 12 * 0.6;
  const unit = n((line.length + 4) * CWD);
  const text = (dx) => `<text x="${dx}" y="${H - 34}" fill="${T.textFaint}" font-family="${T.mono}" font-size="12" font-weight="700" letter-spacing="0" xml:space="preserve">${esc(line + '    ')}</text>`;
  const reps = Math.ceil(W / unit) + 2;
  let inner = '';
  for (let i = 0; i < reps; i++) inner += text(n(i * unit));
  return `
  <g mask="url(#tm-fade)">
    <g>${inner}
      <animateTransform attributeName="transform" type="translate" from="0 0" to="${n(-unit)} 0" dur="${n(unit / 34)}s" repeatCount="indefinite"/>
    </g>
  </g>`;
}

export function buildTelemetry() {
  return `${svgOpen(W, H, 'AETHRIXN live telemetry',
    'Animated telemetry strip: a shifting activity histogram, a self-drawing signal curve, a filling focus gauge and a scrolling ticker of focus areas. No numeric claims are made here.', 'tm')}
  <defs>
    ${defsCommon('tm')}
    <clipPath id="tm-frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>
    <linearGradient id="tm-area" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="${T.accent}" stop-opacity=".28"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="tm-fadeg" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#000"/><stop offset=".06" stop-color="#fff"/><stop offset=".94" stop-color="#fff"/><stop offset="1" stop-color="#000"/>
    </linearGradient>
    <mask id="tm-fade"><rect width="${W}" height="${H}" fill="url(#tm-fadeg)"/></mask>
  </defs>

  <g clip-path="url(#tm-frame)">
    <rect width="${W}" height="${H}" fill="url(#tm-bg)"/>
    ${auroraLayer('tm', W, H)}
    <rect width="${W}" height="${H}" fill="url(#tm-grid)"/>

    <text x="40" y="46" fill="${T.textDim}" font-family="${T.mono}" font-size="12" font-weight="800" letter-spacing="3">LIVE TELEMETRY</text>
    <line x1="216" y1="41" x2="1030" y2="41" stroke="${T.line}" stroke-width="1"/>
    ${pulseDot(1048, 41, 3, T.accent, 1.6)}
    <text x="1160" y="46" text-anchor="end" fill="${T.textFaint}" font-family="${T.mono}" font-size="11" font-weight="700" letter-spacing="2">STREAMING</text>

    ${panel(32, 372, 'ACTIVITY', 'ROLLING', histogram(32, 372))}
    ${panel(428, 372, 'SIGNAL', 'TRACE', sparkline(428, 372))}
    ${panel(832, 336, 'FOCUS', 'CYCLE', gauge(832, 336))}

    ${ticker()}

    <rect width="${W}" height="${H}" fill="url(#tm-vig)"/>
    ${scanline(W, H, 8)}
  </g>
  ${marchingBorder(W, H, R)}
</svg>`;
}
