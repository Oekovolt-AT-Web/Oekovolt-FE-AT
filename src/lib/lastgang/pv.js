// src/lib/lastgang/pv.js
//
// PV-Simulation auf den Zeitstempeln des Lastgangs und Größenempfehlung für hohen Eigenverbrauch.
//
// Herkunft des PV-Profils (offengelegt auf der Seite):
//  1. Monatssummen: PVGIS v5.3 der EU-Kommission (JRC), Datenbank SARAH3, 14 % Systemverluste,
//     mit Geländehorizont – im Repo unter src/data/regionen-pvgis.json (abgerufen 28.09.2026) für
//     37 Orte in Österreich: Monatswerte Süd/35°, Jahreswerte Süd/35°, Ost-West/15°, Flachdach Süd/10°.
//     https://re.jrc.ec.europa.eu/api/v5_3/PVcalc
//  2. Tagesverlauf je Viertelstunde: Sonnenstand (NOAA-Näherung nach Spencer 1971,
//     https://gml.noaa.gov/grad/solcalc/solareqns.PDF) und ein einfaches Klarhimmel-Modell
//     (Luftmasse nach Kasten & Young 1989, Direktstrahlung nach Meinel) auf die Modulebene.
//  3. Wetter: synthetische, feste Abfolge sonniger, wechselhafter und trüber Tage je Monat
//     (ANNAHME) – nicht das reale Wetter Ihres Messzeitraums. Danach wird jeder Monat exakt auf
//     die PVGIS-Monatssumme skaliert.
// Für Ost-West und Flachdach werden die Monatswerte aus Süd/35° mit dem Verhältnis der
// Klarhimmel-Geometrie je Monat umverteilt und auf den PVGIS-Jahreswert der Ausrichtung normiert.
//
// Die Funktionen bekommen den PVGIS-Ort als Objekt übergeben (kein JSON-Import), damit der
// Code ohne Bundler in Node testbar bleibt.

import { wandZuUtc } from "./parser.js";

const RAD = Math.PI / 180;
const MIN = 60000;

export const PVGIS_QUELLE = {
  name: "PVGIS v5.3 (EU-Kommission, JRC), SARAH3, 14 % Verluste – abgerufen 28.09.2026",
  url: "https://re.jrc.ec.europa.eu/pvg_tools/de/",
};
export const SONNE_QUELLE = { name: "NOAA – General Solar Position Calculations", url: "https://gml.noaa.gov/grad/solcalc/solareqns.PDF" };

export const AUSRICHTUNGEN = [
  { id: "sued", label: "Süd, 35°", kurz: "Süd 35°", flaechen: [{ neigung: 35, azimut: 180, anteil: 1 }], schluessel: "sued35_kwh_kwp" },
  { id: "ostwest", label: "Ost/West, 15°", kurz: "Ost/West 15°", flaechen: [{ neigung: 15, azimut: 90, anteil: 0.5 }, { neigung: 15, azimut: 270, anteil: 0.5 }], schluessel: "ostwest15_kwh_kwp" },
  { id: "flach", label: "Flachdach Süd, 10°", kurz: "Flach 10°", flaechen: [{ neigung: 10, azimut: 180, anteil: 1 }], schluessel: "flach10_kwh_kwp" },
];
export const ausrichtung = (id) => AUSRICHTUNGEN.find((a) => a.id === id) || AUSRICHTUNGEN[0];

/** Sonnenstand (Zenit, Azimut von Nord in Grad) für UTC-ms und Ort */
export function sonnenstand(ms, lat, lon) {
  const d = new Date(ms);
  const jahrBeginn = Date.UTC(d.getUTCFullYear(), 0, 1);
  const tag = Math.floor((ms - jahrBeginn) / 86400000) + 1;
  const stunde = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
  const jahrTage = d.getUTCFullYear() % 4 === 0 ? 366 : 365;
  const g = ((2 * Math.PI) / jahrTage) * (tag - 1 + (stunde - 12) / 24);
  const zg = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dekl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const ha = ((stunde * 60 + zg + 4 * lon) / 4 - 180) * RAD;
  const phi = lat * RAD;
  const cosZ = Math.sin(phi) * Math.sin(dekl) + Math.cos(phi) * Math.cos(dekl) * Math.cos(ha);
  const zenit = Math.acos(Math.max(-1, Math.min(1, cosZ))) / RAD;
  let azimut = Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(phi) - Math.tan(dekl) * Math.cos(phi)) / RAD + 180;
  azimut = ((azimut % 360) + 360) % 360;
  return { zenit, azimut, tag };
}

/** Relative Klarhimmel-Einstrahlung auf die Modulflächen (W/m², nur als Form genutzt) */
export function klarhimmel(zenit, azimut, tag, flaechen) {
  if (zenit >= 89.5) return 0;
  const cosZ = Math.cos(zenit * RAD);
  const am = 1 / (cosZ + 0.50572 * Math.pow(96.07995 - zenit, -1.6364));
  const i0 = 1361 * (1 + 0.033 * Math.cos((2 * Math.PI * tag) / 365));
  const dni = i0 * Math.pow(0.7, Math.pow(am, 0.678));
  const dhi = 0.12 * dni * Math.max(cosZ, 0.05) + 20 * cosZ;
  const ghi = dni * cosZ + dhi;
  let s = 0;
  for (const f of flaechen) {
    const b = f.neigung * RAD;
    const cosT = cosZ * Math.cos(b) + Math.sin(zenit * RAD) * Math.sin(b) * Math.cos((azimut - f.azimut) * RAD);
    s += f.anteil * (dni * Math.max(0, cosT) + (dhi * (1 + Math.cos(b))) / 2 + (0.2 * ghi * (1 - Math.cos(b))) / 2);
  }
  return Math.max(0, s);
}

// Deterministischer Zufall (mulberry32) – gleiche Eingabe, gleiches Ergebnis
function zufall(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 0 = Winter, 1 = Hochsommer (steuert den Anteil sonniger und trüber Tage)
const SOMMER = [0, 0.15, 0.45, 0.7, 0.9, 1, 1, 0.9, 0.6, 0.35, 0.1, 0];

/** Wetterfaktor eines Kalendertags (0–1 relativ zum klaren Himmel), ANNAHME, deterministisch */
export function wetterFaktor(monat, tagImMonat) {
  const r = zufall(7919 * (monat + 1) + tagImMonat * 131);
  r();
  const s = SOMMER[monat];
  const u = r();
  const streu = 0.85 + 0.15 * r();
  const pSonne = 0.22 + 0.25 * s;
  const pTrueb = 0.45 - 0.22 * s;
  if (u < pSonne) return streu;
  if (u < pSonne + pTrueb) return (0.1 + 0.2 * s) * streu;
  return (0.5 + 0.1 * s) * streu;
}

function rohwert(tWand, intervall, ort, flaechen) {
  const mitte = wandZuUtc(tWand) + (intervall / 2) * MIN;
  const { zenit, azimut, tag } = sonnenstand(mitte, ort.lat, ort.lon);
  const d = new Date(tWand);
  return klarhimmel(zenit, azimut, tag, flaechen) * wetterFaktor(d.getUTCMonth(), d.getUTCDate());
}

/** Summe der Rohwerte eines ganzen Kalendermonats (Wanduhr-Raster) */
function monatsRoh(jahr, monat, intervall, ort, flaechen) {
  const von = Date.UTC(jahr, monat, 1);
  const bis = Date.UTC(jahr, monat + 1, 1);
  let s = 0;
  for (let t = von; t < bis; t += intervall * MIN) s += rohwert(t, intervall, ort, flaechen);
  return s;
}

/**
 * Monatliche Erträge (kWh/kWp) einer Ausrichtung am Ort.
 * Süd/35°: PVGIS-Monatswerte direkt; andere: Geometrie-Verhältnis, normiert auf PVGIS-Jahreswert.
 */
export function monatsErtraege(ort, ausrichtungId, jahr = 2025) {
  const a = ausrichtung(ausrichtungId);
  const sued = ort.monate_sued35.slice();
  if (a.id === "sued") return sued;
  const suedFl = AUSRICHTUNGEN[0].flaechen;
  const roh = sued.map((w, m) => w * (monatsRoh(jahr, m, 60, ort, a.flaechen) / monatsRoh(jahr, m, 60, ort, suedFl)));
  const summe = roh.reduce((x, y) => x + y, 0);
  return roh.map((w) => (w / summe) * ort[a.schluessel]);
}

/**
 * PV-Erzeugung für 1 kWp auf jedem Zeitstempel des Lastgangs (kWh je Intervall).
 * @param {{ zeiten: Float64Array, intervall: number }} lg
 * @param {object} ort Eintrag aus regionen-pvgis.json (lat, lon, monate_sued35, *_kwh_kwp)
 * @param {string} ausrichtungId sued | ostwest | flach
 */
export function pvProfil(lg, ort, ausrichtungId = "sued") {
  const { zeiten, intervall } = lg;
  const a = ausrichtung(ausrichtungId);
  const n = zeiten.length;
  const pv = new Float64Array(n);
  for (let i = 0; i < n; i++) pv[i] = rohwert(zeiten[i], intervall, ort, a.flaechen);
  // Skalierung je Kalendermonat auf den PVGIS-Monatswert
  const faktoren = new Map();
  let jahresErtrag = 0;
  const ziel = monatsErtraege(ort, a.id, new Date(zeiten[0]).getUTCFullYear());
  for (let i = 0; i < n; i++) {
    const d = new Date(zeiten[i]);
    const key = d.getUTCFullYear() * 12 + d.getUTCMonth();
    let f = faktoren.get(key);
    if (f === undefined) {
      const roh = monatsRoh(d.getUTCFullYear(), d.getUTCMonth(), intervall, ort, a.flaechen);
      f = roh > 0 ? ziel[d.getUTCMonth()] / roh : 0;
      faktoren.set(key, f);
    }
    pv[i] *= f;
  }
  jahresErtrag = ziel.reduce((x, y) => x + y, 0);
  return { pv, jahresErtrag, monate: ziel };
}

/** Eigenverbrauch einer Anlage mit kwp auf dem Lastgang (Summen über den Messzeitraum) */
export function simuliere(kwh, pv1, kwp) {
  let ev = 0;
  let erzeugt = 0;
  let last = 0;
  for (let i = 0; i < kwh.length; i++) {
    const p = pv1[i] * kwp;
    erzeugt += p;
    last += kwh[i];
    ev += p < kwh[i] ? p : kwh[i];
  }
  return {
    kwp,
    eigenverbrauch: ev,
    erzeugt,
    einspeisung: erzeugt - ev,
    evQuote: erzeugt > 0 ? ev / erzeugt : 1,
    autarkie: last > 0 ? ev / last : 0,
  };
}

/** Auf „runde“ Anlagengrößen abrunden */
export function rundeKwp(kwp) {
  const schritt = kwp < 30 ? 1 : kwp < 200 ? 5 : kwp < 1000 ? 10 : 50;
  return Math.max(schritt, Math.floor(kwp / schritt) * schritt);
}

/**
 * Größte Anlage, deren Eigenverbrauchsanteil noch ≥ zielQuote ist (Halbierungssuche –
 * der Anteil fällt mit wachsender Anlage monoton).
 * @returns {{ kwp, ergebnis, kwpMax, begrenzt }}
 */
export function empfehlung(kwh, pv1, jahresverbrauch, jahresErtrag, zielQuote = 0.8) {
  const kwpMax = Math.max(10, (jahresverbrauch * 1.5) / Math.max(jahresErtrag, 1));
  let lo = 0;
  let hi = kwpMax;
  if (simuliere(kwh, pv1, hi).evQuote >= zielQuote) {
    const kwp = rundeKwp(hi);
    return { kwp, ergebnis: simuliere(kwh, pv1, kwp), kwpMax, begrenzt: true };
  }
  for (let k = 0; k < 40; k++) {
    const mitte = (lo + hi) / 2;
    if (simuliere(kwh, pv1, mitte).evQuote >= zielQuote) lo = mitte;
    else hi = mitte;
    if (hi - lo < 0.2) break;
  }
  const kwp = rundeKwp(Math.max(lo, 1));
  return { kwp, ergebnis: simuliere(kwh, pv1, kwp), kwpMax, begrenzt: false };
}

/** Kurve Eigenverbrauchsanteil und Autarkie über der Anlagengröße (für das Diagramm) */
export function kurve(kwh, pv1, kwpMax, punkte = 36) {
  return Array.from({ length: punkte }, (_, j) => {
    const kwp = (kwpMax * (j + 1)) / punkte;
    const r = simuliere(kwh, pv1, kwp);
    return { kwp, evQuote: r.evQuote, autarkie: r.autarkie };
  });
}
