#!/usr/bin/env node
// "On GitHub" kartını GitHub'ın GraphQL verisinden yeniden üretir.
//   GITHUB_TOKEN=... node scripts/stats.mjs
// Yazdıkları: assets/github-{light,dark}.svg, assets/github-mobile-{light,dark}.svg, assets/github-stats.json
//
// Token gizli katkıları göremiyorsa toplam önceki kayıttan düşük gelir; o zaman hiçbir şey yazılmaz,
// böylece kart yanlışlıkla küçülmez. Gizli katkılar için PROFILE_STATS_TOKEN (read:user) sırrı kullanılır.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'assets');
const LOGIN = process.env.PROFILE_LOGIN || process.env.GITHUB_REPOSITORY_OWNER || 'aethrixn';
const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) throw new Error('GITHUB_TOKEN gerekli');

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors ?? res.status)}`);
  return json.data;
}

// ── veri ────────────────────────────────────────────────────────────────
const { user } = await gql(`query($login:String!){user(login:$login){createdAt pullRequests(states:MERGED){totalCount}}}`, { login: LOGIN });
const now = new Date();
const days = {};
let commits = 0;
for (let from = new Date(user.createdAt); from < now;) {
  const to = new Date(Math.min(new Date(from).setUTCFullYear(from.getUTCFullYear() + 1), now.getTime()));
  const { user: u } = await gql(`query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){
    contributionsCollection(from:$from,to:$to){totalCommitContributions contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}`,
  { login: LOGIN, from: from.toISOString(), to: to.toISOString() });
  commits += u.contributionsCollection.totalCommitContributions;
  for (const w of u.contributionsCollection.contributionCalendar.weeks) for (const d of w.contributionDays) days[d.date] = d.contributionCount;
  from = to;
}
const today = now.toISOString().slice(0, 10);
const dates = Object.keys(days).filter((d) => d <= today).sort();
let longest = 0, run = 0;
for (const d of dates) { run = days[d] > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
const stats = {
  updated: today,
  since: user.createdAt.slice(0, 10),
  contributions: dates.reduce((s, d) => s + days[d], 0),
  commits,
  mergedPullRequests: user.pullRequests.totalCount,
  longestStreak: longest,
  activeDays: dates.filter((d) => days[d] > 0).length,
  busiestDay: Math.max(...dates.map((d) => days[d])),
};

const statsFile = path.join(ASSETS, 'github-stats.json');
const previous = await fs.readFile(statsFile, 'utf8').then(JSON.parse).catch(() => null);
if (previous && stats.contributions < previous.contributions) {
  console.log(`Atlandı: token ${stats.contributions} katkı görüyor, kayıtlı ${previous.contributions}. Kart değişmedi.`);
  process.exit(0);
}

// ── çizim ───────────────────────────────────────────────────────────────
const SANS = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Inter, 'Segoe UI', Arial, sans-serif`;
const ROUND = `ui-rounded, 'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Nunito', 'Segoe UI', Arial, sans-serif`;
const LIME = '#ccff1c';
const terrarium = `data:image/webp;base64,${(await fs.readFile(path.join(ASSETS, 'src', 'terrarium.webp'))).toString('base64')}`;
const fmt = (n) => n.toLocaleString('en-US');
const month = new Date(stats.since).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const NUMS = [
  [fmt(stats.contributions), 'contributions'],
  [fmt(stats.commits), 'commits'],
  [fmt(stats.mergedPullRequests), 'pull requests merged'],
  [`${stats.longestStreak} days`, 'longest streak'],
];
const theme = (dark) => dark
  ? { card: '#101016', border: '#26262e', ink: '#f5f5f7', mute: '#a1a1aa', faint: '#6e6e78', cells: ['#1a1a22', '#2b3a1a', '#4f7a12', '#8fc416', LIME] }
  : { card: '#ffffff', border: '#e6e3dc', ink: '#1d1d1f', mute: '#5f5f68', faint: '#8e8e96', cells: ['#efece5', '#e2f7a8', '#c3ec4a', '#8fc416', '#4f7a12'] };

function heatmap(t, x0, y0, weeks, cell, gap) {
  const end = new Date(`${today}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - end.getUTCDay() - (weeks - 1) * 7);
  let out = '';
  for (let w = 0; w < weeks; w++) for (let d = 0; d < 7; d++) {
    const dt = new Date(start);
    dt.setUTCDate(start.getUTCDate() + w * 7 + d);
    const key = dt.toISOString().slice(0, 10);
    if (key > today) continue;
    const v = days[key] ?? 0;
    const lvl = v === 0 ? 0 : v < 20 ? 1 : v < 60 ? 2 : v < 150 ? 3 : 4;
    out += `<rect x="${x0 + w * (cell + gap)}" y="${y0 + d * (cell + gap)}" width="${cell}" height="${cell}" rx="${cell * 0.3}" fill="${t.cells[lvl]}"/>`;
  }
  return { body: out, bottom: y0 + 7 * (cell + gap) - gap, right: x0 + weeks * (cell + gap) - gap };
}

function card(dark, mobile) {
  const t = theme(dark);
  const W = mobile ? 640 : 1200, top = mobile ? 150 : 70, P = mobile ? 44 : 64;
  const ts = mobile ? 270 : 400, tx = W - ts - (mobile ? 0 : 30);
  const ty0 = top + (mobile ? 70 : 72);
  const colW = mobile ? (W - 2 * P) / 2 : 300;
  const nums = NUMS.map(([n, l], i) => {
    const x = P + (i % 2) * colW, y = ty0 + 92 + Math.floor(i / 2) * 116;
    return `<text x="${x}" y="${y}" font-family="${ROUND}" font-size="${mobile ? 50 : 56}" font-weight="800" letter-spacing="-1.4" fill="${t.ink}">${n}</text>
      <text x="${x + 2}" y="${y + 34}" font-family="${SANS}" font-size="19" font-weight="500" fill="${t.mute}">${l}</text>`;
  }).join('');
  const hy = ty0 + 92 + 116 + 80;
  const weeks = mobile ? 26 : 53, gap = 4;
  const cell = Math.floor((W - 2 * P - (weeks - 1) * gap) / weeks);
  const hm = heatmap(t, P, hy, weeks, cell, gap);
  const H = hm.bottom + (mobile ? 110 : 90);
  const legend = mobile ? '' : t.cells.map((c, i) => `<rect x="${hm.right - (5 - i) * (cell + gap) + gap}" y="${hm.bottom + 26}" width="${cell}" height="${cell}" rx="${cell * 0.3}" fill="${c}"/>`).join('');
  const extra = `${fmt(stats.activeDays)} active days  ·  ${fmt(stats.busiestDay)} on the busiest day${mobile ? '' : `  ·  updated ${stats.updated}`}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
  <rect x="0.75" y="${top + 0.75}" width="${W - 1.5}" height="${H - top - 1.5}" rx="26" fill="${t.card}" stroke="${t.border}" stroke-width="1.5"/>
  <image href="${terrarium}" x="${tx}" y="0" width="${ts}" height="${ts}"/>
  <text x="${P}" y="${ty0}" font-family="${ROUND}" font-size="32" font-weight="800" letter-spacing="-0.6" fill="${t.ink}">On GitHub</text>
  <text x="${P + (mobile ? 0 : 196)}" y="${mobile ? ty0 + 30 : ty0 - 2}" font-family="${SANS}" font-size="18" font-weight="500" fill="${t.faint}">Since ${month}</text>
  ${nums}${hm.body}${legend}
  <text x="${P}" y="${hm.bottom + 42}" font-family="${SANS}" font-size="17" font-weight="500" fill="${t.mute}">${extra}</text>
</svg>\n`;
}

await fs.writeFile(path.join(ASSETS, 'github-light.svg'), card(false, false));
await fs.writeFile(path.join(ASSETS, 'github-dark.svg'), card(true, false));
await fs.writeFile(path.join(ASSETS, 'github-mobile-light.svg'), card(false, true));
await fs.writeFile(path.join(ASSETS, 'github-mobile-dark.svg'), card(true, true));
await fs.writeFile(statsFile, `${JSON.stringify(stats, null, 2)}\n`);
console.log(`Güncellendi: ${stats.contributions} katkı, ${stats.commits} commit, ${stats.mergedPullRequests} PR, ${stats.longestStreak} gün seri.`);
