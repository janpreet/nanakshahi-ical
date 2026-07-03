// Layering, tagging, overrides, ICS.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Engine } from '../src/engine.js';
import { generateIcs } from '../src/ics.js';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const engine = new Engine();

test('pinned year serves the printed date, marked confirmed with source', () => {
  const events = engine.eventsForYear(557);
  const sa = events.find(e => e.id === 'shaheedi-guru-arjan');
  assert.equal(sa.date, '2025-05-30');
  assert.equal(sa.ns, '17 Jeth');
  assert.equal(sa.status, 'confirmed');
  assert.match(sa.detail, /Jantri 557/);
});

test('unpinned year computes events, marked estimated with rule detail', () => {
  const events = engine.eventsForYear(559);
  const gn = events.find(e => e.id === 'parkash-guru-nanak');
  assert.equal(gn.status, 'estimated');
  assert.match(gn.detail, /Katak purnmashi/);
  assert.equal(gn.date, '2027-11-14'); // Kartik purnima 2027
  const vaisakhi = events.find(e => e.id === 'khalsa-sajna-divas');
  assert.equal(vaisakhi.date, '2027-04-14');
});

test('pinned-only events are absent in unpinned years (never guessed)', () => {
  const events = engine.eventsForYear(559);
  for (const id of ['sirjana-akal-takht', 'janam-ajit-singh', 'sees-saskar-guru-tegh-bahadur']) {
    assert.equal(events.find(e => e.id === id), undefined, id);
  }
});

test('one-day-uncertain festivals carry the plus-minus-1-day confidence when estimated', () => {
  const events = engine.eventsForYear(559);
  for (const id of ['bandi-chhor-divas', 'darbar-khalsa-dussehra']) {
    assert.equal(events.find(e => e.id === id)?.confidence, 'plus-minus-1-day', id);
  }
});

test('pinned years reproduce exactly the printed event set', () => {
  for (const [nsYear, pin] of engine.pinned) {
    const events = engine.eventsForYear(nsYear);
    const pinnedIds = Object.keys(pin.events);
    assert.equal(events.length, pinnedIds.length, `NS ${nsYear} count`);
    for (const e of events) {
      assert.equal(e.status, 'confirmed');
      assert.equal(e.date, pin.events[e.id].date, `${e.id} ${nsYear}`);
    }
  }
});

test('gregorian <-> nanakshahi conversion round-trips across a pinned year', () => {
  const table = engine.yearTable(557);
  assert.equal(engine.nsToGregorian('Jeth', 32, table), '2025-06-14'); // 32-day Jeth
  assert.equal(engine.nsToGregorian('Sawan', 32, table), null);       // no 32 Sawan in 557
  assert.deepEqual(engine.gregorianToNs('2025-06-14', table), { month: 'Jeth', day: 32, label: '32 Jeth' });
  assert.deepEqual(engine.gregorianToNs('2026-02-21', table), { month: 'Phagan', day: 10, label: '10 Phagan' });
});

test('user overrides: add, hide, rename', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ns-data-'));
  cpSync(DATA, dir, { recursive: true });
  writeFileSync(join(dir, 'overrides.json'), JSON.stringify({
    add: [{ id: 'my-barsi', en: 'My local barsi', category: 'historical', rule: { type: 'fixedSolar', month: 'Magh', day: 5 } }],
    hide: ['azadi-divas'],
    rename: { 'punjabi-suba-divas': { en: 'Punjabi Suba Day (renamed)' } },
  }));
  const e2 = new Engine(dir);
  const events = e2.eventsForYear(557);
  const mine = events.find(e => e.id === 'my-barsi');
  assert.ok(mine, 'override event added');
  assert.equal(mine.date, '2026-01-18'); // 5 Magh 557
  assert.equal(events.find(e => e.id === 'azadi-divas'), undefined, 'hidden event removed');
  assert.equal(events.find(e => e.id === 'punjabi-suba-divas').en, 'Punjabi Suba Day (renamed)');
});

test('ICS output distinguishes confirmed vs estimated and is valid enough to parse', () => {
  const ics = generateIcs(engine, [557, 559], { dailyDates: false });
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /SUMMARY:Parkash Gurpurab Sri Guru Nanak Dev Sahib Ji/, 'confirmed title has no marker');
  assert.match(ics, /SUMMARY:≈ Parkash Gurpurab Sri Guru Nanak Dev Sahib Ji/, 'estimated title carries ≈');
  const count = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
  assert.ok(count > 200, `expected >200 VEVENTs, got ${count}`);
});
