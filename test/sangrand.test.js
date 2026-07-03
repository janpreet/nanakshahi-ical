// The computed solar layer must reproduce every pinned sangrand exactly.
// Pinned data is the source of truth; these tests protect the model against
// regressions in astronomy, ayanamsa, or the day-assignment rule.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine.js';
import { MONTHS } from '../src/bikrami.js';

const engine = new Engine();

for (const [nsYear, pin] of engine.pinned) {
  test(`computed sangrands match Jantri ${nsYear} (12/12)`, () => {
    const computed = engine.bikrami.computeSangrands(nsYear);
    for (const m of MONTHS) {
      assert.equal(computed[m], pin.sangrands[m], `${m} ${nsYear}`);
    }
    if (pin.nextChet) assert.equal(computed._nextChet, pin.nextChet, `next Chet after ${nsYear}`);
  });

  test(`month lengths of ${nsYear} sum to a full year`, () => {
    const table = engine.yearTable(nsYear);
    const total = table.months.reduce((s, m) => s + m.days, 0);
    assert.ok(total === 365 || total === 366, `${nsYear} totals ${total}`);
    for (const m of table.months) assert.ok(m.days >= 29 && m.days <= 32, `${m.name} ${nsYear} = ${m.days} days`);
  });
}

test('known month-length quirks are reproduced', () => {
  const t557 = engine.yearTable(557);
  assert.equal(t557.months.find(m => m.name === 'Jeth').days, 32, 'Jeth 557 has 32 days');
  const t558 = engine.yearTable(558);
  assert.equal(t558.months.find(m => m.name === 'Sawan').days, 32, 'Sawan 558 has 32 days');
  assert.equal(t558.months.find(m => m.name === 'Chet').days, 31, 'Chet 558 has 31 days');
});

test('unpinned year table is computed and tagged estimated', () => {
  const t = engine.yearTable(559);
  assert.equal(t.status, 'estimated');
  assert.equal(t.sangrands.Chet, '2027-03-15'); // consistent with 558 poster ending 14 Mar 2027
});
