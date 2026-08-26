import { T } from './tokens.mjs';
import { defsCommon, auroraLayer, scanline, marchingBorder, pulseDot, svgOpen, esc, n } from './lib.mjs';

// ── Düzenlenebilir içerik ────────────────────────────────────────────────────
export const NODES = [
  { key: 'buildary',  x:  56, y: 112, w: 262, title: 'BUILDARY',
    desc: ['Türkiye’s first open-source,', 'AI-native web builder.'],
    status: 'LIVE', flagship: true,  edge: 'right' },
  { key: 'needgo',    x: 882, y: 112, w: 262, title: 'NEEDGO',
    desc: ['Reverse marketplace — buyers', 'post demand, sellers match.'],
    status: 'IN PUBLIC', edge: 'left' },
  { key: 'spatial',   x:  36, y: 384, w: 262, title: 'SPATIAL AI',
    desc: ['Re-imagine a room from one', 'photograph, room to render.'],
    status: 'LAB', edge: 'right' },
  { key: 'commerce',  x: 469, y: 442, w: 262, title: 'VISUAL COMMERCE',
    desc: ['Listing & studio scenes,', 'rebuilt around the subject.'],
    status: 'LAB', edge: 'top' },
  { key: 'research',  x: 902, y: 384, w: 262, title: 'RESEARCH AGENTS',
    desc: ['Evidence-gathering copilots', 'for long-form work.'],
    status: 'LAB', edge: 'left' },
];

const W = 1200, H = 560, R = 26, CH = 96;
const CX = 600, CY = 282, CR = 52;

const STATUS_COLOR = { 'LIVE': T.live, 'IN PUBLIC': T.build, 'LAB': T.lab };

// Kartın kenarındaki bağlantı noktası.
function anchor(nd) {
  if (nd.edge === 'right') return [nd.x + nd.w, nd.y + CH / 2];
  if (nd.edge === 'left')  return [nd.x, nd.y + CH / 2];
  return [nd.x + nd.w / 2, nd.y];              // top
}

// Çekirdekten karta uzanan yumuşak eğri.
function linkPath(nd) {
  const [ax, ay] = anchor(nd);
  const mx = (CX + ax) / 2, my = (CY + ay) / 2;
  const bow = nd.edge === 'top' ? 0 : (ay < CY ? -46 : 46);
  return `M${CX} ${CY} Q${n(mx)} ${n(my + bow)} ${n(ax)} ${n(ay)}`;
}

// Arka plandaki sabit yıldız alanı (deterministik — her derlemede aynı).
function starfield(count = 70) {
  let out = '', seed = 7;
  const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let i = 0; i < count; i++) {
    const x = n(rnd() * W), y = n(rnd() * H), r = n(0.6 + rnd() * 1.3), o = n(0.12 + rnd() * 0.3);
    const dur = n(2.4 + rnd() * 4);
    out += `<circle cx="${x}" cy="${y}" r="${r}" fill="${T.accentSoft}" opacity="${o}">
      <animate attributeName="opacity" values="${o};${n(o * 0.2)};${o}" dur="${dur}s" repeatCount="indefinite"/></circle>`;
  }
  return out;
}

function card(nd, i) {
  const sc = STATUS_COLOR[nd.status] || T.lab;
  const pillW = nd.status.length * 6.8 + 30;
  return `
  <g>
    <rect x="${nd.x}" y="${nd.y}" width="${nd.w}" height="${CH}" rx="14" fill="${T.panel}" stroke="${T.line}" stroke-width="1"/>
    <rect x="${nd.x}" y="${nd.y}" width="${nd.w}" height="${CH}" rx="14" fill="none" stroke="${nd.flagship ? T.accent : T.accentDeep}" stroke-width="1.2" opacity="0">
      <animate attributeName="opacity" values="0;.85;0" dur="9s" begin="${n(i * 1.5)}s" repeatCount="indefinite"/>
    </rect>
    <rect x="${nd.x}" y="${nd.y + 14}" width="3" height="${CH - 28}" rx="1.5" fill="${nd.flagship ? T.accent : T.line2}"/>
    <text x="${nd.x + 20}" y="${nd.y + 32}" fill="${nd.flagship ? T.accentSoft : T.text}" font-family="${T.sans}" font-size="16" font-weight="800" letter-spacing="1.2">${esc(nd.title)}</text>
    ${nd.desc.map((d, j) => `<text x="${nd.x + 20}" y="${nd.y + 58 + j * 16}" fill="${T.textSoft}" font-family="${T.mono}" font-size="11" font-weight="500">${esc(d)}</text>`).join('')}
    <g>
      <rect x="${n(nd.x + nd.w - pillW - 14)}" y="${nd.y + 16}" width="${n(pillW)}" height="18" rx="9" fill="${T.ink}" stroke="${sc}" stroke-opacity=".45"/>
      <circle cx="${n(nd.x + nd.w - pillW - 4)}" cy="${nd.y + 25}" r="2.6" fill="${sc}">
        <animate attributeName="opacity" values="1;.25;1" dur="2.2s" begin="${n(i * 0.4)}s" repeatCount="indefinite"/>
      </circle>
      <text x="${n(nd.x + nd.w - pillW + 6)}" y="${nd.y + 29}" fill="${sc}" font-family="${T.mono}" font-size="9.5" font-weight="800" letter-spacing="1.1">${esc(nd.status)}</text>
    </g>
  </g>`;
}

export function buildConstellation() {
  const paths = NODES.map((nd, i) => `<path id="cn-p${i}" d="${linkPath(nd)}"/>`).join('');

  const wires = NODES.map((_, i) => `
    <use href="#cn-p${i}" fill="none" stroke="${T.line2}" stroke-width="1.2" opacity=".75"/>
    <use href="#cn-p${i}" fill="none" stroke="${T.accent}" stroke-width="1.4" stroke-dasharray="26 460" opacity=".8">
      <animate attributeName="stroke-dashoffset" values="0;-486" dur="${n(5 + i * 0.7)}s" repeatCount="indefinite"/>
    </use>`).join('');

  const packets = NODES.map((nd, i) => `
    <g filter="url(#cn-glow)">
      <circle r="${nd.flagship ? 4 : 3}" fill="${nd.flagship ? T.accentSoft : T.accent}">
        <animateMotion dur="${n(4.2 + i * 0.6)}s" repeatCount="indefinite" begin="${n(-i * 1.1)}s"><mpath href="#cn-p${i}"/></animateMotion>
        <animate attributeName="opacity" values="0;1;1;0" dur="${n(4.2 + i * 0.6)}s" repeatCount="indefinite" begin="${n(-i * 1.1)}s"/>
      </circle>
    </g>`).join('');

  return `${svgOpen(W, H, 'AETHRIXN product constellation',
    'Animated map of Buildary, NeedGo, Spatial AI, Visual Commerce and Research Agents orbiting a central core, with data packets travelling along the links.', 'cn')}
  <defs>
    ${defsCommon('cn')}
    <clipPath id="cn-frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>
    <radialGradient id="cn-core" cx=".5" cy=".5" r=".5">
      <stop stop-color="${T.accent}" stop-opacity=".45"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </radialGradient>
    ${paths}
  </defs>

  <g clip-path="url(#cn-frame)">
    <rect width="${W}" height="${H}" fill="url(#cn-bg)"/>
    ${auroraLayer('cn', W, H)}
    <rect width="${W}" height="${H}" fill="url(#cn-grid)"/>
    ${starfield()}

    <!-- Başlık şeridi -->
    <text x="40" y="46" fill="${T.textDim}" font-family="${T.mono}" font-size="12" font-weight="800" letter-spacing="3">PRODUCT CONSTELLATION</text>
    <line x1="248" y1="41" x2="1046" y2="41" stroke="${T.line}" stroke-width="1"/>
    ${pulseDot(1064, 41, 3, T.accent, 2)}
    <text x="1160" y="46" text-anchor="end" fill="${T.textFaint}" font-family="${T.mono}" font-size="11" font-weight="700" letter-spacing="2">LIVE MAP</text>

    ${wires}

    <!-- Çekirdek -->
    <circle cx="${CX}" cy="${CY}" r="140" fill="url(#cn-core)" opacity=".55"/>
    <g>
      <circle cx="${CX}" cy="${CY}" r="${CR + 16}" fill="none" stroke="${T.accentDeep}" stroke-width="1.2" stroke-dasharray="6 10">
        <animateTransform attributeName="transform" type="rotate" from="0 ${CX} ${CY}" to="360 ${CX} ${CY}" dur="36s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${CX}" cy="${CY}" r="${CR}" fill="none" stroke="${T.accent}" stroke-width="1.6" stroke-dasharray="90 240" opacity=".9">
        <animateTransform attributeName="transform" type="rotate" from="360 ${CX} ${CY}" to="0 ${CX} ${CY}" dur="16s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${CX}" cy="${CY}" r="${CR - 12}" fill="${T.panelHi}" stroke="${T.line2}"/>
      <text x="${CX}" y="${CY - 2}" text-anchor="middle" fill="${T.accentSoft}" font-family="${T.sans}" font-size="13" font-weight="900" letter-spacing="1.4">AX</text>
      <text x="${CX}" y="${CY + 13}" text-anchor="middle" fill="${T.textFaint}" font-family="${T.mono}" font-size="7.5" font-weight="700" letter-spacing="1.6">CORE</text>
      <circle cx="${CX}" cy="${CY}" r="${CR}" fill="none" stroke="${T.accent}" stroke-width="1" opacity=".4">
        <animate attributeName="r" values="${CR};150" dur="5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".4;0" dur="5s" repeatCount="indefinite"/>
      </circle>
    </g>

    ${packets}
    ${NODES.map(card).join('')}

    <rect width="${W}" height="${H}" fill="url(#cn-vig)"/>
    ${scanline(W, H, 9)}
  </g>
  ${marchingBorder(W, H, R)}
</svg>`;
}
