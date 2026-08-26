#!/usr/bin/env node
// AETHRIXN profil varlıklarını yeniden üretir.
//   node build.mjs
// Metinleri değiştirmek için src/ altındaki ilgili dosyanın en üstündeki
// "Düzenlenebilir içerik" bloğuna dokunman yeterli.

import fs from 'node:fs/promises';
import { buildHero } from './src/hero.mjs';
import { buildConstellation } from './src/constellation.mjs';
import { buildTelemetry } from './src/telemetry.mjs';
import { buildStack } from './src/stack.mjs';
import { buildDivider } from './src/divider.mjs';
import { buildSignature } from './src/signature.mjs';
import { buildPlaceholder3d } from './src/placeholder3d.mjs';

const out = (name) => new URL(`./${name}.svg`, import.meta.url);

const targets = [
  ['assets/hero',          () => buildHero()],
  ['assets/constellation', () => buildConstellation()],
  ['assets/telemetry',     () => buildTelemetry()],
  ['assets/stack',         () => buildStack()],
  ['assets/divider',       () => buildDivider()],
  ['assets/signature',     () => buildSignature(new URL('./src/', import.meta.url))],
  // Action ilk kez çalışana kadar profilde kırık görsel olmasın diye:
  ['profile-3d-contrib/profile-aethrixn', () => buildPlaceholder3d()],
];

let total = 0;
for (const [name, fn] of targets) {
  const svg = (await fn()).replace(/[ \t]+$/gm, '');
  await fs.writeFile(out(name), svg);
  const bytes = Buffer.byteLength(svg);
  total += bytes;
  console.log(`  ✓ ${name}.svg  ${(bytes / 1024).toFixed(1)} KB`);
}
console.log(`\nToplam ${(total / 1024).toFixed(1)} KB — bitti.`);
