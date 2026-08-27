#!/usr/bin/env node
// AETHRIXN profil varlıklarını yeniden üretir.
//   node build.mjs
// Metinleri değiştirmek için src/ altındaki ilgili dosyanın en üstündeki
// "Düzenlenebilir içerik" bloğuna dokunman yeterli.

import fs from 'node:fs/promises';
import { buildHero } from './src/hero.mjs';

const out = (name) => new URL(`./${name}.svg`, import.meta.url);

const targets = [
  ['assets/hero',        () => buildHero(new URL('./src/', import.meta.url), 'desktop')],
  ['assets/hero-mobile', () => buildHero(new URL('./src/', import.meta.url), 'mobile')],
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
