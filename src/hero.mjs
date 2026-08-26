import { T } from './tokens.mjs';
import { defsCommon, auroraLayer, scanline, marchingBorder, pulseDot, typewriter, chip, svgOpen, esc, n } from './lib.mjs';

// ── Düzenlenebilir içerik ────────────────────────────────────────────────────
export const HERO = {
  eyebrow: 'MIRZA ŞİMŞEK — PRODUCT ENGINEER @ CODIONX',
  wordmark: 'AETHRIXN',
  subtitle: 'MANAGEMENT INFORMATION SYSTEMS · AI-NATIVE PRODUCTS · FULL-STACK SYSTEMS',
  phrases: [
    'i build the system behind the demo.',
    'ai-native products, shipped end to end.',
    'idea → interface → intelligence → live.',
  ],
  chips: [
    { label: 'ROLE',     value: 'AI PRODUCT BUILDER', accent: true },
    { label: 'FLAGSHIP', value: 'BUILDARY.DEV' },
    { label: 'STACK',    value: 'TS · PYTHON · DART' },
  ],
  status: 'SYSTEM ONLINE — SHIPPING',
  version: 'v2026.8',
  footRight: 'TÜRKİYE · OPEN SOURCE · AI-NATIVE',
};

const W = 1200, H = 420, R = 26;
const CX = 952, CY = 210;          // sağdaki halka sisteminin merkezi
const L = 56;                      // sol kolon

// Merkez etrafında dönen bir grup üretir.
const spin = (dur, dir = 1, inner) => `
  <g>${inner}
    <animateTransform attributeName="transform" type="rotate"
      from="${dir > 0 ? 0 : 360} ${CX} ${CY}" to="${dir > 0 ? 360 : 0} ${CX} ${CY}"
      dur="${dur}s" repeatCount="indefinite"/>
  </g>`;

const ring = (r, stroke, w, dash, opacity = 1) =>
  `<circle cx="${CX}" cy="${CY}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} opacity="${opacity}"/>`;

// Dış halkanın çevresine 48 adet ölçek çizgisi.
function ticks(r, count = 48) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const long = i % 6 === 0;
    const r1 = r, r2 = r + (long ? 10 : 5);
    out += `<line x1="${n(CX + Math.cos(a) * r1)}" y1="${n(CY + Math.sin(a) * r1)}" x2="${n(CX + Math.cos(a) * r2)}" y2="${n(CY + Math.sin(a) * r2)}" stroke="${long ? T.accentDeep : T.line2}" stroke-width="${long ? 1.6 : 1}" opacity="${long ? '.9' : '.5'}"/>`;
  }
  return out;
}

// Ekolayzır — canlı sistem hissi için 7 çubuk.
function equalizer(x, y, bars = 7) {
  let out = '';
  for (let i = 0; i < bars; i++) {
    const h0 = 4 + ((i * 5) % 11);
    const h1 = 6 + ((i * 7) % 17);
    out += `<rect x="${x + i * 6}" y="${y - h0}" width="3" height="${h0}" rx="1.5" fill="${T.accent}" opacity=".8">
      <animate attributeName="height" values="${h0};${h1};${3};${h0}" dur="${(1.1 + i * 0.17).toFixed(2)}s" repeatCount="indefinite"/>
      <animate attributeName="y" values="${y - h0};${y - h1};${y - 3};${y - h0}" dur="${(1.1 + i * 0.17).toFixed(2)}s" repeatCount="indefinite"/>
    </rect>`;
  }
  return out;
}

export function buildHero() {
  const tw = typewriter({ id: 'h', phrases: HERO.phrases, x: L + 22, y: 252, fontSize: 15 });

  const chips = HERO.chips.map((c, i) => chip({ x: L + i * 194, y: 288, w: 180, h: 52, ...c })).join('');

  const svg = `${svgOpen(W, H, `${HERO.wordmark} — animated profile hero`,
    'Animated noir hero card: kinetic AETHRIXN wordmark with a light sweep, a rotating aether ring system, a live typewriter line and status telemetry.', 'h')}
  <defs>
    ${defsCommon('h')}
    <clipPath id="h-frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>
    <radialGradient id="h-core" cx=".5" cy=".5" r=".5">
      <stop stop-color="${T.accent}" stop-opacity=".55"/><stop offset=".55" stop-color="${T.accentDeep}" stop-opacity=".25"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="h-radar" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${T.accent}" stop-opacity=".28"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="h-rule" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${T.accent}"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="h-sweep">
      <rect y="70" width="150" height="120" transform="skewX(-16)" x="-320">
        <animate attributeName="x" values="-320;760;760" keyTimes="0;.45;1" dur="7s" repeatCount="indefinite"/>
      </rect>
    </clipPath>
    ${tw.defs}
  </defs>

  <g clip-path="url(#h-frame)">
    <rect width="${W}" height="${H}" fill="url(#h-bg)"/>
    ${auroraLayer('h', W, H)}
    <rect width="${W}" height="${H}" fill="url(#h-grid)"/>

    <!-- Aether halka sistemi -->
    <g>
      <circle cx="${CX}" cy="${CY}" r="205" fill="url(#h-core)"/>
      ${spin(120, 1, ticks(196))}
      ${ring(178, T.line2, 1, '2 10', .8)}
      ${spin(52, -1, ring(142, T.accentDeep, 1.4, '38 16'))}
      ${ring(104, T.line2, 1, '', .7)}
      ${spin(28, 1, ring(66, T.accentDeep, 1.6, '9 8'))}
      ${spin(14, 1, `<circle cx="${CX}" cy="${CY}" r="142" fill="none" stroke="${T.accent}" stroke-width="2" stroke-linecap="round" stroke-dasharray="150 742" opacity=".9"/>`)}
      ${spin(9, 1, `<path d="M${CX} ${CY} L${CX + 178} ${CY - 62} A178 178 0 0 1 ${CX + 178} ${CY + 62} Z" fill="url(#h-radar)"/>`)}

      <!-- Yörüngedeki düğümler -->
      ${spin(19, 1, `<g filter="url(#h-glow)"><circle cx="${CX + 178}" cy="${CY}" r="4" fill="${T.accentSoft}"/></g>`)}
      ${spin(31, -1, `<g filter="url(#h-glow)"><circle cx="${CX + 104}" cy="${CY}" r="3" fill="${T.accent}"/></g>`)}
      ${spin(24, 1, `<circle cx="${CX + 142}" cy="${CY}" r="2.4" fill="${T.textDim}"/>`)}

      <!-- Sonar çekirdeği -->
      <circle cx="${CX}" cy="${CY}" r="30" fill="none" stroke="${T.accent}" stroke-width="1.2" opacity=".5">
        <animate attributeName="r" values="30;190" dur="4.6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".5;0" dur="4.6s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${CX}" cy="${CY}" r="30" fill="none" stroke="${T.accent}" stroke-width="1.2" opacity=".5">
        <animate attributeName="r" values="30;190" dur="4.6s" begin="-2.3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".5;0" dur="4.6s" begin="-2.3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${CX}" cy="${CY}" r="27" fill="${T.panelHi}" stroke="${T.accent}" stroke-width="1.6"/>
      <g filter="url(#h-glow)">
        <circle cx="${CX}" cy="${CY}" r="7" fill="${T.accentSoft}">
          <animate attributeName="r" values="7;9.5;7" dur="2.6s" repeatCount="indefinite"/>
        </circle>
      </g>
      <text x="${CX}" y="${CY + 52}" text-anchor="middle" fill="${T.textFaint}" font-family="${T.mono}" font-size="9.5" font-weight="700" letter-spacing="2.4">CORE</text>
    </g>

    <!-- Sol kolon -->
    <g>
      ${pulseDot(L + 4, 59, 3.4, T.accent)}
      <text x="${L + 20}" y="63" fill="${T.textDim}" font-family="${T.mono}" font-size="11.5" font-weight="700" letter-spacing="2.6">${esc(HERO.eyebrow)}</text>

      <text x="${L + 3}" y="157" fill="${T.accentDeep}" font-family="${T.sans}" font-size="76" font-weight="900" letter-spacing="7" opacity=".55">${esc(HERO.wordmark)}</text>
      <text x="${L}" y="154" fill="${T.text}" font-family="${T.sans}" font-size="76" font-weight="900" letter-spacing="7">${esc(HERO.wordmark)}</text>
      <g clip-path="url(#h-sweep)">
        <text x="${L}" y="154" fill="${T.accent}" font-family="${T.sans}" font-size="76" font-weight="900" letter-spacing="7">${esc(HERO.wordmark)}</text>
      </g>

      <text x="${L}" y="188" fill="${T.textFaint}" font-family="${T.mono}" font-size="11" font-weight="600" letter-spacing="2">${esc(HERO.subtitle)}</text>

      <rect x="${L}" y="210" width="520" height="1.6" fill="url(#h-rule)">
        <animate attributeName="width" values="0;520;520" keyTimes="0;.28;1" dur="7s" repeatCount="indefinite"/>
      </rect>

      <text x="${L}" y="252" fill="${T.accent}" font-family="${T.mono}" font-size="15" font-weight="700">$</text>
      ${tw.body}

      ${chips}

      ${pulseDot(L + 4, 372, 3, T.accent, 1.8)}
      <text x="${L + 20}" y="376" fill="${T.textDim}" font-family="${T.mono}" font-size="11" font-weight="700" letter-spacing="2">${esc(HERO.status)}</text>
      ${equalizer(L + 232, 379)}
    </g>

    <!-- Sağ üst sürüm etiketi -->
    <g>
      <rect x="1040" y="42" width="104" height="26" rx="13" fill="${T.panel}" stroke="${T.line2}"/>
      ${pulseDot(1058, 55, 3, T.accent, 1.6)}
      <text x="1072" y="59" fill="${T.textDim}" font-family="${T.mono}" font-size="10.5" font-weight="700" letter-spacing="1.6">${esc(HERO.version)}</text>
    </g>
    <text x="1144" y="378" text-anchor="end" fill="${T.textFaint}" font-family="${T.mono}" font-size="11" font-weight="700" letter-spacing="2">${esc(HERO.footRight)}</text>

    <rect width="${W}" height="${H}" fill="url(#h-vig)"/>
    ${scanline(W, H, 7)}
  </g>
  ${marchingBorder(W, H, R)}
</svg>`;
  return svg;
}
