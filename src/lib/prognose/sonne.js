// src/lib/prognose/sonne.js
//
// Sonnenstand und extraterrestrische Einstrahlung – reine Funktionen ohne Abhängigkeiten,
// im Browser und auf dem Server nutzbar (Test: scripts/prognose.test.mjs).
//
// Sonnenstand nach dem „General Solar Position“-Näherungsverfahren der NOAA Global Monitoring
// Division (Fourier-Reihen nach Spencer 1971 für Deklination und Zeitgleichung). Genauigkeit
// für diese Anwendung ausreichend (Zenitwinkel etwa ±0,5°), Refraktion bleibt unberücksichtigt.
// https://gml.noaa.gov/grad/solcalc/solareqns.PDF

const RAD = Math.PI / 180;

/** Solarkonstante in W/m² (Kopp & Lean 2011, auch von PVGIS und pvlib verwendet). */
export const SOLARKONSTANTE = 1361;

/** Tag im Jahr (1–366) und Stunde (UTC, gebrochen) eines Zeitpunkts in ms. */
function tagUndStunde(ms) {
  const d = new Date(ms);
  const jahresbeginn = Date.UTC(d.getUTCFullYear(), 0, 1);
  const tag = Math.floor((ms - jahresbeginn) / 86400000) + 1;
  const stunde = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
  const jahrTage = d.getUTCFullYear() % 4 === 0 ? 366 : 365;
  return { tag, stunde, jahrTage };
}

/**
 * Sonnenstand für einen Zeitpunkt (ms, UTC) und Ort.
 * Rückgabe: { zenit, hoehe, azimut } in Grad; azimut von Nord im Uhrzeigersinn (Süd = 180°).
 */
export function sonnenstand(ms, lat, lon) {
  const { tag, stunde, jahrTage } = tagUndStunde(ms);
  const g = ((2 * Math.PI) / jahrTage) * (tag - 1 + (stunde - 12) / 24);
  const zeitgleichung =
    229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dekl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g);
  const wahreSonnenzeitMin = stunde * 60 + zeitgleichung + 4 * lon;
  const stundenwinkel = (wahreSonnenzeitMin / 4 - 180) * RAD;
  const phi = lat * RAD;

  const cosZ = Math.sin(phi) * Math.sin(dekl) + Math.cos(phi) * Math.cos(dekl) * Math.cos(stundenwinkel);
  const zenit = Math.acos(Math.max(-1, Math.min(1, cosZ))) / RAD;
  let azimut = Math.atan2(Math.sin(stundenwinkel), Math.cos(stundenwinkel) * Math.sin(phi) - Math.tan(dekl) * Math.cos(phi)) / RAD + 180;
  azimut = ((azimut % 360) + 360) % 360;
  return { zenit, hoehe: 90 - zenit, azimut, deklination: dekl / RAD, zeitgleichung };
}

/** Extraterrestrische Normalbestrahlung (W/m²) am Tag des Zeitpunkts (Abstand Erde–Sonne). */
export function extraterrestrisch(ms) {
  const { tag, jahrTage } = tagUndStunde(ms);
  return SOLARKONSTANTE * (1 + 0.033 * Math.cos((2 * Math.PI * tag) / jahrTage));
}

/** Kosinus des Einfallswinkels auf eine Fläche (Neigung β, Azimut von Nord) bei gegebenem Sonnenstand. */
export function cosEinfall(zenit, sonnenAzimut, neigung, flaechenAzimut) {
  const z = zenit * RAD;
  const b = neigung * RAD;
  return Math.cos(z) * Math.cos(b) + Math.sin(z) * Math.sin(b) * Math.cos((sonnenAzimut - flaechenAzimut) * RAD);
}

/**
 * Mittlere Geometrie über ein Zeitintervall [vonMs, bisMs), in `schritte` Teilschritten abgetastet.
 * Wetterdaten liegen als Stundenmittel vor – ein einzelner Sonnenstand zur Intervallmitte würde bei
 * Sonnenauf- und -untergang große Fehler erzeugen.
 *
 * Rückgabe:
 *  - cosZ:   Mittel von max(0, cos Zenit)          → horizontale Extraterrestrik G0h = I0 · cosZ
 *  - cosT:   Mittel von max(0, cos Einfallswinkel) nur bei Sonne über dem Horizont
 *  - rb:     Umrechnungsfaktor Direktstrahlung horizontal → Modulebene (cosT / cosZ, begrenzt)
 *  - g0h:    mittlere extraterrestrische Einstrahlung auf die Horizontale (W/m²)
 *  - zenitMitte: Zenitwinkel zur Intervallmitte (nur zur Anzeige)
 */
export function intervallGeometrie({ vonMs, bisMs, lat, lon, neigung = 0, flaechenAzimut = 180, schritte = 12 }) {
  let summeZ = 0;
  let summeT = 0;
  const dauer = bisMs - vonMs;
  for (let i = 0; i < schritte; i++) {
    const t = vonMs + ((i + 0.5) / schritte) * dauer;
    const s = sonnenstand(t, lat, lon);
    const cz = Math.cos(s.zenit * RAD);
    if (cz <= 0) continue;
    summeZ += cz;
    summeT += Math.max(0, cosEinfall(s.zenit, s.azimut, neigung, flaechenAzimut));
  }
  const cosZ = summeZ / schritte;
  const cosT = summeT / schritte;
  const rb = cosZ > 1e-4 ? Math.min(cosT / cosZ, 10) : 0;
  const mitte = sonnenstand(vonMs + dauer / 2, lat, lon);
  return { cosZ, cosT, rb, g0h: extraterrestrisch(vonMs + dauer / 2) * cosZ, zenitMitte: mitte.zenit };
}
