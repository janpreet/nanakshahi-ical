# nanakshahi-ical

[![CI](https://github.com/janpreet/nanakshahi-ical/actions/workflows/ci.yml/badge.svg)](https://github.com/janpreet/nanakshahi-ical/actions/workflows/ci.yml)

Subscribable ICS feed and web calendar for the **official Nanakshahi Jantri** (the printed
calendar published yearly from Amritsar): Gurpurabs, itihasik dihade, bhagat sahiban de dihade,
sangrands, massia and purnmashi.

The calendar engine itself lives in its own reusable package —
**[nanakshahi-jantri](https://github.com/janpreet/nanakshahi-jantri)** (`npm install
nanakshahi-jantri`) — so other apps and use cases can consume the same pinned data and
astronomical model. This repo is the feed/site builder on top of it.

The Jantri in current practice is the Bikrami calendar under Nanakshahi labels: month starts are
true sidereal **sankrantis** (so month lengths change every year — Jeth had 32 days in NS 557, Sawan
has 32 in NS 558), and every Guru parkash / gurgaddi / joti-jot day moves on a **Bikrami tithi**
(e.g. Parkash Guru Nanak Dev Ji = Katak purnmashi). No fixed table of dates can be correct two
years running — so this project doesn't use one.

## Pinned vs estimated — read this before trusting a date

Every date this project emits is one of two kinds, and they are visibly distinguished everywhere
(ICS titles, descriptions, and the web calendar):

- **Confirmed** — the date was extracted from a published Jantri, digit by digit, and carries its
  source page (`data/pinned/ns557.json` etc.). Years currently pinned: **NS 549 (2017-18),
  557 (2025-26), 558 (2026-27)**. These always win.
- **≈ Estimated** — no Jantri has been published for that year yet, so the date comes from the
  astronomical model below. Estimated titles carry a `≈` prefix in the ICS feed and web calendar.
  When the real Jantri appears, pin it (see below) and the confirmed dates replace the estimates.

Two events use festival rules rather than the plain sunrise tithi: **Bandi Chhor Divas (Diwali)**
= amavasya prevailing at pradosh (later evening when both qualify) and **Darbar Khalsa (Dussehra)**
= dashami overlapping aparahna (first day when both qualify) — both calibrated to the Jantri's own
choices across all pinned years, and Diwali additionally cross-checked against independently
published panchang dates for 2018-2023 (6/6). In rare split years panchang authorities can still
disagree by a day, so estimated entries for these two keep a ±1-day note. A few events (e.g.
Sirjana Divas Sri Akal Takht) follow no consistent rule across published years and are emitted
**only** for pinned years, never guessed.

## The computed model (for unpinned years)

Calibrated against every data point of the three pinned years — 36/36 sangrands and 132/132
tithi-event dates exactly:

- **Solar**: drik sidereal sankranti (Lahiri-type ayanamsa, 23.8532° at J2000), assigned to the
  **sunrise-to-sunrise day at Amritsar** containing the sankranti — a sankranti after midnight but
  before sunrise belongs to the previous civil day.
- **Lunar**: sunrise (udaya) tithi at Amritsar; purnimanta month labels over amanta months; the
  amanta month containing the Mesha sankranti is Chet; a month with no sankranti is adhik and is
  skipped; a skipped (kshaya) tithi's event lands on the day the tithi runs; a repeated (vridhi)
  tithi takes the first day.

All parameters live in [`data/calibration.json`](data/calibration.json) — ayanamsa, location,
day-assignment rules — editable without touching code. Per-event rules (tithi / fixed-solar /
fixed-Gregorian / pinned-only) live in [`data/events.json`](data/events.json).

## Using it

```bash
npm install
npm test          # validates the model against every pinned data point
npm run build     # writes docs/nanakshahi.ics and docs/data.json
```

- **Subscribe**: point your calendar app at the published `nanakshahi.ics` (GitHub Pages serves
  `docs/`). The feed covers all pinned years plus the next years as estimates.
- **Web calendar**: `docs/index.html` — month-by-month view with confirmed/estimated badges,
  Punjabi and English names, sangrand/massia/purnmashi per month.
- **Library**: use [nanakshahi-jantri](https://github.com/janpreet/nanakshahi-jantri) directly:

```js
import { Engine } from 'nanakshahi-jantri';
const engine = new Engine();
engine.buildYear(559);            // months, lunar days, events — tagged confirmed/estimated
engine.yearTable(560).sangrands;  // computed sangrand dates
```

## Personal overrides

Copy `data/overrides.sample.json` to `data/overrides.json` (gitignored, purely local — nothing is
ever fetched) to add your own observances, hide events, or rename them. Overrides are applied last,
over both pinned and computed data. This is deliberately a different file from `calibration.json`:
calibration tunes the astronomy, overrides change what appears in *your* calendar.

## Adding next year's Jantri (the yearly refresh)

This is a deliberate 15-minute manual task — no scraping, no pretend automation:

1. Get the new Jantri PDF (or poster) when it's published.
2. Render pages to images (`pdftoppm -png -r 300` — the PDFs have no text layer) and read off the
   12 sangrand dates, massia/purnmashi days, and every event's date.
   **Beware the Gurmukhi numeral look-alikes ੨/੭, ੫/੬/੯, ੮/੯** — verify against the day-grid
   numbers, which are arithmetically forced. Cross-check tithi events against
   `engine.computeRuleDate(...)`: the model has matched the Jantri essentially everywhere, so any
   disagreement is most likely a misread digit.
3. Add `data/pinned/ns<year>.json` in the [nanakshahi-jantri](https://github.com/janpreet/nanakshahi-jantri)
   repo (copy the shape of `ns558.json`), including a `source` note with page references; its tests
   validate the model against the new pinned year. Release it, bump the dependency here.
4. `npm test && npm run build` here — the new year's dates flip from ≈ estimated to confirmed.

## Data provenance

- `sources/Jantri-Nanakshahi-557.pdf` — the NS 557 booklet the 557 data was extracted from.
- NS 558: official 2026-27 wall-poster calendar; NS 549: official 2017-18 wall calendar.
- Extraction method, glyph-verification process, and the full validation tables are documented in
  the Phase 1 report kept alongside the source scans.

## License

MIT
