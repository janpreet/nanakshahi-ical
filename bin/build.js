#!/usr/bin/env node
// Build the distributable artifacts into docs/ (the published site):
//   docs/nanakshahi.ics  — subscribable feed (pinned years + two computed years ahead)
//   docs/data.json       — feed for the web calendar
// Usage: node bin/build.js [--years 557,558,559] [--no-daily]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { Engine } from 'nanakshahi-jantri';
import { generateIcs } from '../src/ics.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const yearsArg = args.find(a => a.startsWith('--years'));
const dailyDates = !args.includes('--no-daily');

const overridesPath = join(ROOT, 'data', 'overrides.json');
const engine = new Engine(existsSync(overridesPath) ? { overrides: overridesPath } : {});

let years;
if (yearsArg) {
  years = yearsArg.split('=')[1].split(',').map(Number);
} else {
  // the current NS year + the next 5 (a Jan/Feb date still belongs to the previous NS year)
  let nowNs = new Date().getUTCFullYear() - engine.calibration.nsEpochGregorianOffset;
  const today = new Date().toISOString().slice(0, 10);
  if (today < engine.yearTable(nowNs).sangrands.Chet) nowNs -= 1;
  years = Array.from({ length: 6 }, (_, i) => nowNs + i);
}

console.log(`Building Nanakshahi calendar for NS years: ${years.join(', ')}`);
const docs = join(ROOT, 'docs');
mkdirSync(docs, { recursive: true });

const payload = { generated: new Date().toISOString(), years: {} };
for (const y of years) {
  const t0 = Date.now();
  payload.years[y] = engine.buildYear(y);
  console.log(`  NS ${y}: ${payload.years[y].status}, ${payload.years[y].events.length} events (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}
writeFileSync(join(docs, 'data.json'), JSON.stringify(payload, null, 1));

const ics = generateIcs(engine, years, { dailyDates });
writeFileSync(join(docs, 'nanakshahi.ics'), ics);
console.log(`Wrote docs/data.json and docs/nanakshahi.ics (${(ics.length / 1024).toFixed(0)} KB)`);
