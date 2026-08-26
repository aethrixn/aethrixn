import { T } from './tokens.mjs';
import { svgOpen, n } from './lib.mjs';

const W = 1200, H = 28, Y = 14;

// Bölümler arasına konan, üzerinde ışık koşan ince ayraç.
export function buildDivider() {
  return `${svgOpen(W, H, 'Animated section divider',
    'A hairline rule with a light pulse travelling across it.', 'dv')}
  <defs>
    <linearGradient id="dv-line" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${T.line}" stop-opacity="0"/><stop offset=".12" stop-color="${T.line2}"/>
      <stop offset=".88" stop-color="${T.line2}"/><stop offset="1" stop-color="${T.line}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="dv-pulse" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="${T.accent}" stop-opacity="0"/><stop offset=".5" stop-color="${T.accent}"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/>
    </linearGradient>
    <filter id="dv-glow" x="-50%" y="-400%" width="200%" height="900%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <rect x="0" y="${Y}" width="${W}" height="1" fill="url(#dv-line)"/>
  <rect y="${n(Y - 0.5)}" width="220" height="2" fill="url(#dv-pulse)" filter="url(#dv-glow)" opacity=".9">
    <animate attributeName="x" values="-240;${W}" dur="6s" repeatCount="indefinite"/>
  </rect>
  <rect y="${n(Y - 0.5)}" width="220" height="2" fill="url(#dv-pulse)" opacity=".95">
    <animate attributeName="x" values="-240;${W}" dur="6s" repeatCount="indefinite"/>
  </rect>
  <g fill="${T.accentDeep}">
    <rect x="596" y="${n(Y - 3)}" width="8" height="8" rx="1.6" transform="rotate(45 600 ${Y})"/>
  </g>
</svg>`;
}
