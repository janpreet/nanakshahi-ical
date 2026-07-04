// ICS feed generation. Confirmed (pinned) and estimated (computed) entries are
// visibly distinguished: estimated titles carry a "≈" prefix and every event's
// description states its provenance (Jantri page vs computed rule).
import { createEvents } from 'ics';
import { addDays } from 'nanakshahi-jantri';

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

// Daily Nitnem paath times as floating (timezone-less) events: a DTSTART with
// no TZID/Z suffix renders at that wall-clock time in the device's own
// timezone, so one feed serves every location. Times anchor to the
// population-weighted annual mean of local sunrise/sunset across the major
// Sikh population centres (Punjab, Delhi, Toronto, Vancouver, London,
// California, New York, Melbourne, KL, N. Italy — mean sunrise 06:23, mean
// sunset 18:34): Amritvela = mean sunrise − 3h (Sikh Rehat Maryada, Art. 4),
// Rehraas = mean sunset, Sohila = bedtime convention.
const NITNEM = [
  { id: 'amritvela', title: 'Amritvela', start: [3, 30], duration: { hours: 1 },
    description: 'ਅੰਮ੍ਰਿਤ ਵੇਲਾ — Nitnem\nFixed time: ≈3 hours before mean local sunrise (Sikh Rehat Maryada)' },
  { id: 'rehraas', title: 'Rehraas Sahib', start: [18, 30], duration: { minutes: 30 },
    description: 'ਰਹਿਰਾਸ ਸਾਹਿਬ — evening paath\nFixed time: ≈ mean local sunset' },
  { id: 'sohila', title: 'Sohila Sahib', start: [21, 0], duration: { minutes: 15 },
    description: 'ਕੀਰਤਨ ਸੋਹਿਲਾ — before sleep' },
];

export function generateNitnemIcs() {
  const { error, value } = createEvents(NITNEM.map(p => ({
    uid: `${p.id}@nanakshahi-ical`,
    title: p.title,
    description: p.description,
    start: [2025, 1, 1, ...p.start],
    startInputType: 'local', startOutputType: 'local',
    duration: p.duration,
    recurrenceRule: 'FREQ=DAILY',
    transp: 'TRANSPARENT',
  })), {
    calName: 'Nitnem Paath Times',
    productId: 'nanakshahi-ical',
  });
  if (error) throw error;
  return value;
}

export function generateIcs(engine, nsYears, opts) {
  const { error, value } = createEvents(buildIcsEvents(engine, nsYears, opts), {
    calName: 'Nanakshahi Calendar (Jantri)',
    productId: 'nanakshahi-ical',
  });
  if (error) throw error;
  return value;
}
