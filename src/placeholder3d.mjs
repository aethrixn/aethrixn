import { T } from './tokens.mjs';
import { defsCommon, marchingBorder, pulseDot, scanline, svgOpen, esc, n } from './lib.mjs';

// 3B katkı alanı ilk GitHub Actions çalışmasına kadar üretilmez.
// Bu yer tutucu, o ana kadar profilde kırık görsel çıkmasını engeller;
// Action çalıştığında aynı dosya adının üzerine yazar.
const W = 1200, H = 360, R = 26;

// Gerçek katkı takvimi geometrisi: 53 hafta x 7 gün.
// Hafif skewY ile 3B'ye göz kırpar; hücreler dalga hâlinde parlar.
function calendarGrid() {
  const cols = 53, rows = 7, cell = 15, gap = 5;
  let out = '';
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const lvl = (c * 5 + r * 11 + ((c * r) % 7)) % 5;
      const fill = ['#101822', T.accentInk, T.accentDeep, '#177E9B', T.accent][lvl];
      const base = [0.30, 0.42, 0.55, 0.70, 0.90][lvl];
      out += `<rect x="${n(c * (cell + gap))}" y="${n(r * (cell + gap))}" width="${cell}" height="${cell}" rx="3" fill="${fill}" opacity="${n(base * 0.45)}">
        <animate attributeName="opacity" values="${n(base * 0.45)};${base};${n(base * 0.45)}" dur="5.2s" begin="${n(-(c * 0.09 + r * 0.05))}s" repeatCount="indefinite"/>
      </rect>`;
    }
  }
  const gw = cols * (cell + gap) - gap;
  return `<g transform="translate(${n((W - gw) / 2)} 168) skewY(-4)">${out}</g>`;
}

export function buildPlaceholder3d() {
  return `${svgOpen(W, H, 'Contribution field — awaiting first generation',
    'Placeholder shown until the GitHub Action generates the real 3D contribution field.', 'p3')}
  <defs>
    ${defsCommon('p3')}
    <clipPath id="p3-frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>
  </defs>
  <g clip-path="url(#p3-frame)">
    <rect width="${W}" height="${H}" fill="url(#p3-bg)"/>
    <rect width="${W}" height="${H}" fill="url(#p3-grid)"/>
    ${calendarGrid()}
    <rect width="${W}" height="${H}" fill="url(#p3-vig)"/>
    ${pulseDot(44, 43, 3.4, T.accent, 1.8)}
    <text x="62" y="48" fill="${T.textDim}" font-family="${T.mono}" font-size="12" font-weight="800" letter-spacing="3">3D CONTRIBUTION FIELD</text>
    <text x="1160" y="48" text-anchor="end" fill="${T.accent}" font-family="${T.mono}" font-size="11" font-weight="800" letter-spacing="2">AWAITING FIRST BUILD</text>
    <text x="62" y="316" fill="${T.textFaint}" font-family="${T.mono}" font-size="11" font-weight="600" letter-spacing="1.4">${esc('Run the “Generate 3D contribution field” workflow once — this placeholder is then replaced automatically.')}</text>
    ${scanline(W, H, 9)}
  </g>
  ${marchingBorder(W, H, R)}
</svg>`;
}
