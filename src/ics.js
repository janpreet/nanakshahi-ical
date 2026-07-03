// ICS feed generation. Confirmed (pinned) and estimated (computed) entries are
// visibly distinguished: estimated titles carry a "≈" prefix and every event's
// description states its provenance (Jantri page vs computed rule).
import { createEvents } from 'ics';
import { addDays } from './bikrami.js';

function ymd(iso) { return iso.split('-').map(Number); }

const CATEGORY_LABEL = { gurpurab: 'Gurpurab', historical: 'Itihasik Dihada', bhagat: 'Bhagat Sahiban', civil: 'Sarkari/Civil' };

export function buildIcsEvents(engine, nsYears, { dailyDates = true } = {}) {
  const out = [];
  for (const nsYear of nsYears) {
    const year = engine.buildYear(nsYear);
    const est = year.status === 'estimated';

    for (const ev of year.events) {
      const estEv = ev.status === 'estimated';
      const title = `${estEv ? '≈ ' : ''}${ev.en}`;
      const desc = [
        ev.pa,
        `${ev.ns ?? ''} · Nanakshahi ${nsYear}`.trim(),
        CATEGORY_LABEL[ev.category] ?? ev.category,
        estEv
          ? `ESTIMATED (computed, not yet confirmed by a published Jantri${ev.confidence === 'plus-minus-1-day' ? '; this event can shift by one day' : ''}) — ${ev.detail}`
          : `Confirmed: ${ev.detail}`,
      ].filter(Boolean).join('\\n');
      out.push({
        uid: `${ev.id}-${nsYear}${ev.id === 'override' ? '-' + ev.date : ''}@nanakshahi-ical`,
        title,
        description: desc,
        start: ymd(ev.date),
        end: ymd(addDays(ev.date, ev.span ?? 1)),
        transp: 'TRANSPARENT',
      });
    }

    for (const m of year.months) {
      out.push({
        uid: `sangrand-${m.name}-${nsYear}@nanakshahi-ical`,
        title: `${est ? '≈ ' : ''}Sangrand — 1 ${m.name} ${nsYear}`,
        description: `Start of ${m.name} (${m.days} days)${est ? ' — ESTIMATED (computed sankranti)' : ''}`,
        start: ymd(m.start), end: ymd(addDays(m.start, 1)), transp: 'TRANSPARENT',
      });
    }

    const lunarEst = year.lunar.status === 'estimated';
    for (const d of year.lunar.massia) {
      out.push({
        uid: `massia-${d}@nanakshahi-ical`, title: `${lunarEst ? '≈ ' : ''}Massia`,
        description: lunarEst ? 'ESTIMATED (computed amavasya at Amritsar sunrise)' : 'Confirmed: Jantri massia day',
        start: ymd(d), end: ymd(addDays(d, 1)), transp: 'TRANSPARENT',
      });
    }
    for (const d of year.lunar.purnmashi) {
      out.push({
        uid: `purnmashi-${d}@nanakshahi-ical`, title: `${lunarEst ? '≈ ' : ''}Purnmashi`,
        description: lunarEst ? 'ESTIMATED (computed purnima at Amritsar sunrise)' : 'Confirmed: Jantri purnmashi day',
        start: ymd(d), end: ymd(addDays(d, 1)), transp: 'TRANSPARENT',
      });
    }

    if (dailyDates) {
      for (const m of year.months) {
        for (let day = 1; day <= m.days; day++) {
          const g = addDays(m.start, day - 1);
          out.push({
            uid: `nsdate-${g}@nanakshahi-ical`,
            title: `${est ? '≈ ' : ''}${day} ${m.name} ${nsYear}`,
            start: ymd(g), end: ymd(addDays(g, 1)), transp: 'TRANSPARENT',
          });
        }
      }
    }
  }
  return out;
}

export function generateIcs(engine, nsYears, opts) {
  const { error, value } = createEvents(buildIcsEvents(engine, nsYears, opts), {
    calName: 'Nanakshahi Calendar (Jantri)',
    productId: 'nanakshahi-ical',
  });
  if (error) throw error;
  return value;
}
