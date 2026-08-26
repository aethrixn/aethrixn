import fs from 'node:fs/promises';
import { T } from './tokens.mjs';
import { defsCommon, scanline, marchingBorder, pulseDot, svgOpen, esc, n } from './lib.mjs';

// ── Düzenlenebilir içerik ────────────────────────────────────────────────────
export const SIGNATURE = {
  label: 'SIGNATURE',
  lines: ['I don’t collect demos.', 'I build the system behind the demo.'],
  caption: 'PERSONAL SIGNATURE PIECE · CHARACTER REFERENCE, RE-GRADED FOR THIS PALETTE',
  // Aizen katmanının yeri ve boyu. Karakteri büyütmek/küçültmek için burayı değiştir.
  figure: { x: 812, y: -8, w: 340, h: 457 },
};

const W = 1200, H = 420, R = 26;

export async function buildSignature(baseUrl) {
  const plate = await fs.readFile(new URL('../assets/hero-clean-plate.webp', baseUrl));
  const figure = await fs.readFile(new URL('../assets/aizen-reference-lossless.webp', baseUrl));
  const f = SIGNATURE.figure;

  return `${svgOpen(W, H, 'AETHRIXN signature plate',
    'A cool-graded architectural plate with the personal character reference composited on the right, a manifesto line on the left and slow ambient motion.', 'sg')}
  <defs>
    ${defsCommon('sg')}
    <clipPath id="sg-frame"><rect width="${W}" height="${H}" rx="${R}"/></clipPath>
    <!-- Fotoğrafı doygunluktan arındırıp soğuk (aether) tona çeken duotone matrisi.
         intercept kullanılmıyor; şeffaf kenarlarda hâle oluşmasın diye. -->
    <filter id="sg-grade" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
      <feColorMatrix type="matrix" values="
        0.153 0.515 0.052 0 0
        0.187 0.629 0.064 0 0
        0.234 0.787 0.079 0 0
        0     0     0     1 0"/>
    </filter>
    <filter id="sg-figure" color-interpolation-filters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
      <!-- Önce soğuk duotone, sonra gama eğrisi: matris parlaklığı yükselttiği için
           orta tonları geri bastırıp yüz/kumaş detayını kurtarıyoruz.
           gamma seçildi çünkü 0'ı 0'da bırakır — saydam kenarda hâle yapmaz. -->
      <feColorMatrix type="matrix" values="
        0.148 0.487 0.050 0 0
        0.173 0.578 0.059 0 0
        0.211 0.706 0.072 0 0
        0     0     0     1 0"/>
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude="1" exponent="1.35" offset="0"/>
        <feFuncG type="gamma" amplitude="1" exponent="1.32" offset="0"/>
        <feFuncB type="gamma" amplitude="1" exponent="1.22" offset="0"/>
      </feComponentTransfer>
    </filter>
    <filter id="sg-rim" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="46"/></filter>
    <linearGradient id="sg-shade" x1="0" y1="0" x2=".6" y2="1">
      <stop stop-color="#02050A" stop-opacity=".88"/><stop offset=".5" stop-color="#02050A" stop-opacity=".42"/><stop offset="1" stop-color="#02050A" stop-opacity=".72"/>
    </linearGradient>
    <linearGradient id="sg-rule" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${T.accent}"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <g clip-path="url(#sg-frame)">
    <rect width="${W}" height="${H}" fill="${T.ink}"/>

    <!-- Zemin: temiz plaka, yavaş kayan parallax -->
    <g filter="url(#sg-grade)">
      <image href="data:image/webp;base64,${plate.toString('base64')}" x="-16" y="-6" width="1232" height="438" preserveAspectRatio="xMidYMid slice" opacity=".92">
        <animate attributeName="x" values="-16;-34;-16" dur="26s" repeatCount="indefinite"/>
        <animate attributeName="width" values="1232;1264;1232" dur="26s" repeatCount="indefinite"/>
      </image>
    </g>
    <rect width="${W}" height="${H}" fill="url(#sg-shade)"/>

    <!-- Figürün arkasındaki soğuk rim ışığı -->
    <ellipse cx="${n(f.x + f.w / 2)}" cy="238" rx="150" ry="180" fill="${T.accentDeep}" opacity=".55" filter="url(#sg-rim)">
      <animate attributeName="opacity" values=".55;.32;.55" dur="9s" repeatCount="indefinite"/>
    </ellipse>

    <!-- Aizen katmanı -->
    <g filter="url(#sg-figure)">
      <image href="data:image/webp;base64,${figure.toString('base64')}" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" preserveAspectRatio="xMidYMid meet">
        <animate attributeName="x" values="${f.x};${f.x + 5};${f.x}" dur="11s" repeatCount="indefinite"/>
        <animate attributeName="y" values="${f.y};${f.y + 4};${f.y}" dur="11s" repeatCount="indefinite"/>
      </image>
    </g>

    <rect width="${W}" height="${H}" fill="url(#sg-grid)"/>

    <!-- Sol dikey etiket -->
    <g>
      <rect x="46" y="120" width="2" height="180" fill="${T.accentDeep}"/>
      <rect x="46" y="120" width="2" height="52" fill="${T.accent}">
        <animate attributeName="y" values="120;248;120" dur="7s" repeatCount="indefinite"/>
      </rect>
      <text transform="translate(38 300) rotate(-90)" fill="${T.textFaint}" font-family="${T.mono}" font-size="10" font-weight="800" letter-spacing="5">${esc(SIGNATURE.label)}</text>
    </g>

    <!-- Manifesto -->
    <g>
      <text x="86" y="180" fill="${T.text}" font-family="${T.sans}" font-size="34" font-weight="800" letter-spacing="-.2">${esc(SIGNATURE.lines[0])}</text>
      <text x="86" y="224" fill="${T.accentSoft}" font-family="${T.sans}" font-size="34" font-weight="800" letter-spacing="-.2">${esc(SIGNATURE.lines[1])}</text>
      <rect x="86" y="252" width="300" height="1.6" fill="url(#sg-rule)">
        <animate attributeName="width" values="0;300;300" keyTimes="0;.3;1" dur="8s" repeatCount="indefinite"/>
      </rect>
      <text x="86" y="278" fill="${T.textFaint}" font-family="${T.mono}" font-size="10.5" font-weight="600" letter-spacing="1.6">${esc(SIGNATURE.caption)}</text>
    </g>

    ${pulseDot(50, 372, 3, T.accent, 2.2)}
    <text x="66" y="376" fill="${T.textDim}" font-family="${T.mono}" font-size="11" font-weight="700" letter-spacing="2">AETHRIXN // ATELIER</text>

    <rect width="${W}" height="${H}" fill="url(#sg-vig)"/>
    ${scanline(W, H, 11)}
  </g>
  ${marchingBorder(W, H, R)}
</svg>`;
}
