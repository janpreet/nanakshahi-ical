// The computed lunar layer vs pinned Jantri data:
//  - every printed massia/purnmashi day of 557
//  - every tithi-rule event across all pinned years,
//    with the two documented festival exceptions (Dussehra & Bandi Chhor in 558,
//    where the Jantri follows aparahna/pradosh rules) allowed to differ by exactly 1 day.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine.js';

const engine = new Engine();

// events where the Jantri's printed day may legitimately differ from the udaya-tithi day by 1
const KNOWN_1DAY = new Set(['darbar-khalsa-dussehra@558', 'bandi-chhor-divas@558']);

test('557 printed massia days match computed amavasya (udaya rule)', () => {
  const pin = engine.pinned.get(557);
  for (const d of pin.massia) {
    assert.equal(engine.bikrami.sunriseTithi(d), 30, `massia ${d}`);
  }
});

test('557 printed purnmashi days match computed purnima (udaya + kshaya rule)', () => {
  const pin = engine.pinned.get(557);
  for (const d of pin.purnmashi) {
    const t = engine.bikrami.sunriseTithi(d);
    if (t === 15) continue;
    // kshaya: tithi 15 skipped between sunrises but runs entirely within this day
    // (calibrated case: 2025-12-04)
    const next = engine.bikrami.sunriseTithi(addDaysIso(d, 1));
    assert.ok(t === 14 && next >= 16, `purnmashi ${d}: sunrise tithi ${t}, next ${next}`);
  }
});

function addDaysIso(iso, n) {
  const dd = new Date(iso + 'T00:00:00Z');
  dd.setUTCDate(dd.getUTCDate() + n);
  return dd.toISOString().slice(0, 10);
}

test('every pinned tithi-rule event is reproduced by the computed rule', () => {
  let checked = 0;
  const failures = [];
  for (const ev of engine.catalog) {
    if (ev.rule.type !== 'tithi') continue;
    for (const [nsYear, pin] of engine.pinned) {
      const pinned = pin.events?.[ev.id];
      if (!pinned) continue;
      const table = engine.yearTable(nsYear);
      const res = engine.computeRuleDate(ev.rule, nsYear, table);
      checked++;
      const key = `${ev.id}@${nsYear}`;
      if (!res) { failures.push(`${key}: no computed date (pinned ${pinned.date})`); continue; }
      if (res.date === pinned.date) continue;
      const diff = Math.abs(Date.parse(res.date) - Date.parse(pinned.date)) / 86400000;
      if (KNOWN_1DAY.has(key) && diff === 1) continue;
      failures.push(`${key}: pinned ${pinned.date}, computed ${res.date}`);
    }
  }
  assert.ok(checked >= 120, `expected >=120 event-years, checked ${checked}`);
  assert.deepEqual(failures, []);
});

test('the two festival exceptions really do differ by one day (documents the divergence)', () => {
  const table = engine.yearTable(558);
  for (const id of ['darbar-khalsa-dussehra', 'bandi-chhor-divas']) {
    const ev = engine.catalogById.get(id);
    const pinned = engine.pinned.get(558).events[id];
    const res = engine.computeRuleDate(ev.rule, 558, table);
    const diff = (Date.parse(res.date) - Date.parse(pinned.date)) / 86400000;
    assert.equal(diff, 1, `${id}: Jantri prints the festival-rule day, one before the udaya day`);
    assert.equal(ev.confidence, 'est1day', `${id} must be marked est1day in the catalogue`);
  }
});

test('adhik masa is skipped (558 events around the vadhu Jeth of 2026)', () => {
  const table = engine.yearTable(558);
  const shaheediArjan = engine.computeRuleDate(engine.catalogById.get('shaheedi-guru-arjan').rule, 558, table);
  assert.equal(shaheediArjan.date, '2026-06-18', 'Jeth sudi 4 falls in shuddha Jeth, not adhik Jeth');
  const kabir = engine.computeRuleDate(engine.catalogById.get('janam-bhagat-kabir').rule, 558, table);
  assert.equal(kabir.date, '2026-06-29', 'Jeth purnmashi falls in shuddha Jeth');
});
