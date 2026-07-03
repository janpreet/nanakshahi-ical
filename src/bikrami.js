// Bikrami layer: solar months (sangrands) and lunisolar tithi events, per the
// conventions the official Jantri follows (calibrated in Phase 1, enforced by tests):
//   - sangrand = the sunrise-to-sunrise day (at the configured location) containing the sankranti
//   - lunar month = amanta; the month containing the Mesha sankranti is Chet; a month with
//     no sankranti is adhik (leap) and is skipped for events; labels are purnimanta
//   - event day = the day whose sunrise falls in the target tithi (udaya); a skipped (kshaya)
//     tithi's event lands on the day the tithi actually runs; a repeated (vridhi) tithi
//     takes the first day
import {
  toIST, istCivilDate, addDays, makeObserver,
  findSankranti, sunriseUTC, sunsetUTC, tithiAt, newMoonAfter, moonPhaseAfter,
} from './astro.js';

export const MONTHS = ['Chet', 'Vaisakh', 'Jeth', 'Harh', 'Sawan', 'Bhadon', 'Assu', 'Katak', 'Maghar', 'Poh', 'Magh', 'Phagan'];
// solar month <-> rashi longitude: Chet = Meena (330deg), Vaisakh = Mesha (0), ...
export const MONTH_TARGET_LON = { Chet: 330, Vaisakh: 0, Jeth: 30, Harh: 60, Sawan: 90, Bhadon: 120, Assu: 150, Katak: 180, Maghar: 210, Poh: 240, Magh: 270, Phagan: 300 };
// amanta month containing sankranti of rashi k (0 = Mesha) is MONTHS[k]
const RASHI_TO_AMANTA = MONTHS;

export class Bikrami {
  constructor(calibration) {
    this.cal = calibration;
    this.observer = makeObserver(calibration.location);
    this._tithiCache = new Map();
    this._sunriseCache = new Map();
  }

  sunrise(isoDay) {
    let v = this._sunriseCache.get(isoDay);
    if (v === undefined) { v = sunriseUTC(isoDay, this.observer); this._sunriseCache.set(isoDay, v); }
    return v;
  }

  sunriseTithi(isoDay) {
    let v = this._tithiCache.get(isoDay);
    if (v === undefined) { v = tithiAt(this.sunrise(isoDay)); this._tithiCache.set(isoDay, v); }
    return v;
  }

  // civil day that owns a sankranti moment (sunrise-to-sunrise day)
  sangrandDay(sankranti) {
    let day = istCivilDate(sankranti);
    if (sankranti < this.sunrise(day)) day = addDays(day, -1);
    return day;
  }

  // sankranti moment for a named month near gregorian year `gy` (the year its sangrand falls in)
  sankrantiMoment(month, gy) {
    // approximate Gregorian anchor for each month's sankranti
    const approx = { Chet: [gy, 3, 14], Vaisakh: [gy, 4, 13], Jeth: [gy, 5, 14], Harh: [gy, 6, 15], Sawan: [gy, 7, 16], Bhadon: [gy, 8, 16], Assu: [gy, 9, 16], Katak: [gy, 10, 17], Maghar: [gy, 11, 16], Poh: [gy, 12, 15], Magh: [gy, 1, 14], Phagan: [gy, 2, 12] }[month];
    const t0 = new Date(Date.UTC(approx[0], approx[1] - 1, approx[2]) - 12 * 86400000);
    return findSankranti(MONTH_TARGET_LON[month], t0, 25, this.cal);
  }

  // all 12 sangrand days of Nanakshahi year nsYear, plus next year's Chet sangrand
  computeSangrands(nsYear) {
    const gy = nsYear + this.cal.nsEpochGregorianOffset; // Chet falls in March of gy
    const out = {};
    for (const m of MONTHS) {
      const inYear = (m === 'Magh' || m === 'Phagan') ? gy + 1 : gy;
      out[m] = this.sangrandDay(this.sankrantiMoment(m, inYear));
    }
    out._nextChet = this.sangrandDay(this.sankrantiMoment('Chet', gy + 1));
    return out;
  }

  // amanta lunar months covering [from, from + count new moons], with adhik detection
  amantaMonths(fromDate, count) {
    const key = fromDate.toISOString().slice(0, 10) + ':' + count;
    if (this._amantaCache?.key === key) return this._amantaCache.months;
    const out = [];
    let nmPrev = newMoonAfter(fromDate);
    for (let i = 0; i < count; i++) {
      const nmNext = newMoonAfter(new Date(nmPrev.getTime() + 86400000));
      let rashi = null;
      for (let k = 0; k < 12; k++) {
        const s = findSankranti(k * 30, new Date(nmPrev.getTime() - 3600000), 32, this.cal);
        if (s && s > nmPrev && s <= nmNext) { rashi = k; break; }
      }
      out.push({ start: nmPrev, end: nmNext, adhika: rashi === null, name: rashi === null ? null : RASHI_TO_AMANTA[rashi] });
      nmPrev = nmNext;
    }
    for (let i = 0; i < out.length - 1; i++) if (out[i].adhika) out[i].name = out[i + 1].name;
    this._amantaCache = { key, months: out };
    return out;
  }

  // day whose sunrise tithi == target, scanning forward from startIso; handles kshaya
  dayOfSunriseTithi(target, startIso, span = 20) {
    let prev = null;
    for (let i = 0; i <= span; i++) {
      const day = addDays(startIso, i);
      const t = this.sunriseTithi(day);
      if (t === target) return { day, kshaya: false };
      if (prev !== null) {
        const passed = (prev < target && t > target) || (prev > 25 && target <= 3 && t > target && t < 10);
        if (passed) return { day: addDays(day, -1), kshaya: true };
      }
      prev = t;
    }
    return null;
  }

  // festival day-window at the configured location
  // pradosh: [sunset, sunset + 96 min] — Diwali-type; aparahna: [sunrise + 3/5·day, sunrise + 4/5·day] — Dussehra-type
  festivalWindow(kind, isoDay) {
    if (kind === 'pradosh') {
      const set = sunsetUTC(isoDay, this.observer);
      return [set, new Date(set.getTime() + 96 * 60000)];
    }
    const rise = this.sunrise(isoDay);
    const set = sunsetUTC(isoDay, this.observer);
    const len = set - rise;
    return [new Date(rise.getTime() + len * 3 / 5), new Date(rise.getTime() + len * 4 / 5)];
  }

  // day on which tithi [spanStart, spanEnd) overlaps the festival window;
  // tiebreak 'earlier' | 'later' when both candidate days qualify (calibrated: the Jantri
  // took the later evening for Diwali 557 and the first day for Dussehra 558)
  festivalDay(spanStart, spanEnd, window, tiebreak) {
    const candidates = [];
    for (let d = istCivilDate(spanStart); d <= istCivilDate(spanEnd); d = addDays(d, 1)) candidates.push(d);
    const hits = candidates.filter(d => {
      const [w0, w1] = this.festivalWindow(window, d);
      return spanStart < w1 && spanEnd > w0;
    });
    if (!hits.length) return istCivilDate(spanEnd); // degenerate; tithi misses the window on both days
    return tiebreak === 'later' ? hits[hits.length - 1] : hits[0];
  }

  // date of "month paksha n" (purnimanta label) given a precomputed amanta month list.
  // opts.window ('pradosh'|'aparahna') switches from the udaya rule to a festival rule.
  lunarEventDay(monthName, paksha, n, months, opts = {}) {
    const m = months.find(mm => !mm.adhika && mm.name === monthName);
    if (!m) return null;
    const nmStartIso = istCivilDate(m.start);
    if (opts.window) {
      let spanStart, spanEnd;
      if (paksha === 'massia') {
        // amavasya ending the vadi paksha at m.start
        spanEnd = m.start;
        spanStart = moonPhaseAfter(348, new Date(m.start.getTime() - 3 * 86400000));
      } else { // sudi n
        spanStart = moonPhaseAfter((n - 1) * 12, m.start);
        spanEnd = moonPhaseAfter(n * 12, spanStart);
      }
      return { day: this.festivalDay(spanStart, spanEnd, opts.window, opts.tiebreak), kshaya: false };
    }
    if (paksha === 'sudi') return this.dayOfSunriseTithi(n, nmStartIso, 20);
    if (paksha === 'purnima') return this.dayOfSunriseTithi(15, nmStartIso, 20);
    if (paksha === 'massia') {
      for (let i = -2; i <= 1; i++) {
        const day = addDays(nmStartIso, i);
        if (this.sunriseTithi(day) === 30) return { day, kshaya: false };
      }
      return { day: nmStartIso, kshaya: true };
    }
    // vadi: Krishna paksha ending at m.start; earliest udaya day wins (vridhi rule)
    for (let i = 18; i >= 0; i--) {
      const day = addDays(nmStartIso, -i);
      if (this.sunriseTithi(day) === n + 15) return { day, kshaya: false };
    }
    for (let i = 18; i >= 0; i--) {
      const day = addDays(nmStartIso, -i);
      const t = this.sunriseTithi(day);
      if (t > n + 15 && t <= 30) {
        const tPrev = this.sunriseTithi(addDays(day, -1));
        if (tPrev !== null && tPrev < n + 15) return { day: addDays(day, -1), kshaya: true };
      }
    }
    return null;
  }

  // massia/purnmashi days falling inside [startIso, endIso)
  lunarDaysInRange(startIso, endIso, tithi) {
    const out = [];
    for (let d = startIso; d < endIso; d = addDays(d, 1)) {
      if (this.sunriseTithi(d) === tithi) out.push(d);
    }
    return out;
  }
}

export { toIST, istCivilDate, addDays };
