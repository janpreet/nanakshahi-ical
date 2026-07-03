// Layered calendar engine.
// Resolution order for anything: user override > pinned Jantri data > astronomical computation.
// Everything computed (not pinned) is tagged status:"estimated" and carries its rule;
// events with no reliable rule are simply absent in unpinned years (never guessed).
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Bikrami, MONTHS, addDays } from './bikrami.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function readJSON(p) { return JSON.parse(readFileSync(p, 'utf8')); }

export class Engine {
  constructor(dataDir = join(ROOT, 'data')) {
    this.calibration = readJSON(join(dataDir, 'calibration.json'));
    this.catalog = readJSON(join(dataDir, 'events.json')).events;
    this.catalogById = new Map(this.catalog.map(e => [e.id, e]));
    this.pinned = new Map();
    const pinnedDir = join(dataDir, 'pinned');
    if (existsSync(pinnedDir)) {
      for (const f of readdirSync(pinnedDir)) {
        const m = f.match(/^ns(\d+)\.json$/);
        if (m) this.pinned.set(parseInt(m[1], 10), readJSON(join(pinnedDir, f)));
      }
    }
    this.overrides = existsSync(join(dataDir, 'overrides.json'))
      ? readJSON(join(dataDir, 'overrides.json'))
      : { add: [], hide: [], rename: {} };
    this.bikrami = new Bikrami(this.calibration);
    this._yearCache = new Map();
  }

  // ---- solar year table -------------------------------------------------
  yearTable(nsYear) {
    if (this._yearCache.has(nsYear)) return this._yearCache.get(nsYear);
    const pin = this.pinned.get(nsYear);
    let sangrands, nextChet, status, source;
    if (pin) {
      sangrands = pin.sangrands; nextChet = pin.nextChet;
      status = 'confirmed'; source = pin.source;
      if (!nextChet) nextChet = this.bikrami.computeSangrands(nsYear)._nextChet;
    } else {
      const c = this.bikrami.computeSangrands(nsYear);
      nextChet = c._nextChet; delete c._nextChet;
      sangrands = c; status = 'estimated';
      source = 'computed: drik sidereal sankranti (see data/calibration.json)';
    }
    const months = MONTHS.map((name, i) => {
      const start = sangrands[name];
      const end = i < 11 ? sangrands[MONTHS[i + 1]] : nextChet;
      const days = Math.round((Date.parse(end) - Date.parse(start)) / 86400000);
      return { name, start, days };
    });
    const table = { nsYear, status, source, sangrands, nextChet, months };
    this._yearCache.set(nsYear, table);
    return table;
  }

  gregorianToNs(iso, table) {
    for (let i = table.months.length - 1; i >= 0; i--) {
      const m = table.months[i];
      if (iso >= m.start) {
        const day = Math.round((Date.parse(iso) - Date.parse(m.start)) / 86400000) + 1;
        return { month: m.name, day, label: `${day} ${m.name}` };
      }
    }
    return null;
  }

  nsToGregorian(month, day, table) {
    const m = table.months.find(mm => mm.name === month);
    if (!m || day > m.days) return null; // e.g. 32 Sawan only exists in some years
    return addDays(m.start, day - 1);
  }

  // ---- lunar days (massia / purnmashi) -----------------------------------
  lunarDays(nsYear) {
    const table = this.yearTable(nsYear);
    const pin = this.pinned.get(nsYear);
    if (pin?.massia && pin?.purnmashi) {
      return { status: 'confirmed', massia: pin.massia, purnmashi: pin.purnmashi };
    }
    const chet1 = table.sangrands.Chet;
    return {
      status: 'estimated',
      massia: this.bikrami.lunarDaysInRange(chet1, table.nextChet, 30),
      purnmashi: this.bikrami.lunarDaysInRange(chet1, table.nextChet, 15),
    };
  }

  // ---- events -------------------------------------------------------------
  computeRuleDate(rule, nsYear, table) {
    if (rule.type === 'fixedSolar') {
      const date = this.nsToGregorian(rule.month, rule.day, table);
      return date ? { date, detail: `${rule.day} ${rule.month} (fixed solar date)` } : null;
    }
    if (rule.type === 'gregorian') {
      // the occurrence inside [Chet 1, next Chet 1)
      const gy = nsYear + this.calibration.nsEpochGregorianOffset;
      for (const y of [gy, gy + 1]) {
        const date = `${y}-${String(rule.month).padStart(2, '0')}-${String(rule.day).padStart(2, '0')}`;
        if (date >= table.sangrands.Chet && date < table.nextChet) {
          return { date, detail: `fixed Gregorian anniversary (${date.slice(5)})` };
        }
      }
      return null;
    }
    if (rule.type === 'tithi') {
      const paksha = rule.paksha === 'purnima' || rule.paksha === 'massia' ? rule.paksha : rule.paksha;
      // amanta months covering the year, computed once per year
      const monthsKey = `amanta:${nsYear}`;
      if (!this._yearCache.has(monthsKey)) {
        const from = new Date(Date.parse(table.sangrands.Chet) - 65 * 86400000);
        this._yearCache.set(monthsKey, this.bikrami.amantaMonths(from, 16));
      }
      const amanta = this._yearCache.get(monthsKey);
      // candidate occurrences: search list, keep those inside the NS year span
      const hits = [];
      for (let i = 0; i < amanta.length; i++) {
        if (amanta[i].adhika || amanta[i].name !== rule.month) continue;
        const sub = amanta.slice(i);
        const r = this.bikrami.lunarEventDay(rule.month, paksha, rule.n ?? null, sub);
        if (r && r.day >= table.sangrands.Chet && r.day < table.nextChet) hits.push(r);
      }
      if (!hits.length) return null;
      const r = hits[0];
      const tithiName = paksha === 'purnima' ? 'purnmashi' : paksha === 'massia' ? 'massia' : `${paksha} ${rule.n}`;
      return { date: r.day, detail: `${rule.month} ${tithiName} (Bikrami tithi)${r.kshaya ? ', kshaya' : ''}` };
    }
    return null; // pinnedOnly
  }

  eventsForYear(nsYear) {
    const table = this.yearTable(nsYear);
    const pin = this.pinned.get(nsYear);
    const hidden = new Set(this.overrides.hide ?? []);
    const out = [];

    for (const ev of this.catalog) {
      if (hidden.has(ev.id)) continue;
      const rename = this.overrides.rename?.[ev.id] ?? {};
      const base = {
        id: ev.id, en: rename.en ?? ev.en, pa: rename.pa ?? ev.pa,
        category: ev.category, span: ev.rule?.span ?? 1,
      };
      const pinnedEv = pin?.events?.[ev.id];
      if (pinnedEv) {
        out.push({
          ...base, date: pinnedEv.date, ns: pinnedEv.ns, span: pinnedEv.span ?? base.span,
          status: 'confirmed',
          detail: `Jantri ${nsYear}${pinnedEv.src ? ', ' + pinnedEv.src : ''}`,
        });
        continue;
      }
      if (pin && ev.rule.type === 'pinnedOnly') continue; // not printed that year
      if (!pin && ev.rule.type === 'pinnedOnly') continue; // no rule — never guess
      if (pin) continue; // pinned year: only what the Jantri printed (plus overrides)
      const res = this.computeRuleDate(ev.rule, nsYear, table);
      if (!res) continue;
      out.push({
        ...base, date: res.date, ns: this.gregorianToNs(res.date, table)?.label,
        status: 'estimated',
        confidence: ev.confidence === 'est1day' ? 'plus-minus-1-day' : 'normal',
        detail: res.detail,
      });
    }

    // override additions
    for (const add of this.overrides.add ?? []) {
      if (!add || add.id === undefined && add.en === undefined) continue;
      if ((add.id ?? '').startsWith('example-')) continue;
      let date = add.dates?.[String(nsYear)];
      let detail = 'user override';
      if (!date && add.rule) {
        const res = this.computeRuleDate(add.rule, nsYear, table);
        if (res) { date = res.date; detail = `user override, ${res.detail}`; }
      }
      if (!date) continue;
      out.push({
        id: add.id ?? 'override', en: add.en, pa: add.pa, category: add.category ?? 'historical',
        span: add.rule?.span ?? 1, date, ns: this.gregorianToNs(date, table)?.label,
        status: 'confirmed', detail,
      });
    }

    out.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.en.localeCompare(b.en));
    return out;
  }

  buildYear(nsYear) {
    const table = this.yearTable(nsYear);
    return {
      nsYear,
      status: table.status,
      source: table.source,
      months: table.months,
      nextChet: table.nextChet,
      lunar: this.lunarDays(nsYear),
      events: this.eventsForYear(nsYear),
    };
  }
}
