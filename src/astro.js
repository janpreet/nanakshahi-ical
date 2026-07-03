// Low-level astronomy: sidereal sun longitude, sankranti solver, sunrise, tithi.
// All conventions calibrated against the official Nanakshahi Jantri years 549, 557, 558
// (see data/calibration.json and test/).
import * as A from 'astronomy-engine';

const IST_MIN = 330; // UTC+5:30, the Jantri's civil clock

export function toIST(date) { return new Date(date.getTime() + IST_MIN * 60000); }
export function istCivilDate(date) { return toIST(date).toISOString().slice(0, 10); }
export function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function makeObserver(loc) { return new A.Observer(loc.latitude, loc.longitude, loc.elevation ?? 0); }

// Lahiri-type ayanamsa: value at J2000 plus general precession rate (deg)
export function ayanamsa(date, cal) {
  const y = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / (365.25 * 86400000);
  return cal.ayanamsaJ2000 + (cal.ayanamsaRateArcsecPerYear * y + 0.000111 * y * y) / 3600;
}

export function siderealSunLon(date, cal) {
  const lon = A.SunPosition(date).elon; // true ecliptic-of-date longitude
  return ((lon - ayanamsa(date, cal)) % 360 + 360) % 360;
}

// Moment the sun's sidereal longitude crosses `target` deg, searching forward from t0 up to `days`.
export function findSankranti(target, t0, days, cal) {
  const f = (t) => {
    let d = siderealSunLon(t, cal) - target;
    return ((d + 180) % 360 + 360) % 360 - 180;
  };
  let lo = t0, flo = f(lo);
  for (let i = 1; i <= days; i++) {
    const hi = new Date(t0.getTime() + i * 86400000);
    const fhi = f(hi);
    if (flo < 0 && fhi >= 0) {
      let a = lo, b = hi;
      for (let k = 0; k < 60; k++) {
        const m = new Date((a.getTime() + b.getTime()) / 2);
        if (f(m) < 0) a = m; else b = m;
      }
      return new Date((a.getTime() + b.getTime()) / 2);
    }
    lo = hi; flo = fhi;
  }
  return null;
}

export function sunriseUTC(isoIstDay, observer) {
  const t0 = new Date(new Date(isoIstDay + 'T00:00:00Z').getTime() - IST_MIN * 60000);
  const r = A.SearchRiseSet(A.Body.Sun, observer, +1, t0, 1.2);
  return r ? r.date : null;
}

// Tithi index 1..30 at a moment (1-15 sudi, 16-30 vadi; 15 = purnmashi, 30 = massia)
export function tithiAt(date) {
  const sun = A.SunPosition(date).elon;
  const moon = A.EclipticGeoMoon(date).lon;
  const e = ((moon - sun) % 360 + 360) % 360;
  return Math.floor(e / 12) + 1;
}

export function newMoonAfter(t0) { return A.SearchMoonPhase(0, t0, 40).date; }
