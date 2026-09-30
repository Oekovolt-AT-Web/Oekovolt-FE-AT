// src/lib/prognose/modell.js
//
// PV-Ertragsmodell für die stündliche Prognose (/pv-prognose) – reine Funktionen, im Browser
// gerechnet, damit Änderungen an kWp, Neigung oder Ausrichtung KEINE neue Wetterabfrage auslösen.
//
// Kette je Stunde:
//   Globalstrahlung horizontal (GHI, Stundenmittel aus GeoSphere C-LAEF)
//   → Aufteilung in Direkt- und Diffusstrahlung (Erbs, Klein & Duffie 1982)
//   → Transposition auf die Modulebene: isotrop (Liu & Jordan 1963) oder Hay-Davies (1980)
//   → Modultemperatur (Ross-Modell, Koeffizient je Montageart)
//   → DC-Leistung mit Temperaturkoeffizient, pauschale Systemverluste, Begrenzung auf kWp.
//
// Alle Kennwerte sind Richtwerte (siehe ANNAHMEN). Das Modell ersetzt keine Anlagensimulation;
// Verschattung, Schnee auf den Modulen, Verschmutzung und Abregelung sind nicht enthalten.

import { intervallGeometrie } from "./sonne.js";

const RAD = Math.PI / 180;

/**
 * Richtwerte des Modells. Quellen:
 *  - Systemverluste 14 %: Standardwert von PVGIS (JRC) – derselbe Wert wie im Standort-Check.
 *  - Temperaturkoeffizient −0,35 %/K: typischer Wert kristalliner Module laut Datenblättern
 *    (Spanne etwa −0,26 bis −0,40 %/K) – Richtwert, im Datenblatt Ihres Moduls nachsehen.
 *  - Ross-Koeffizienten (K·m²/W): Skoplaki & Palyvos (2009), Renewable Energy 34, S. 23–29,
 *    Tabelle der Montagearten („free standing“ 0,0208 · „flat on roof“ 0,026 ·
 *    „sloped roof, not so well cooled“ 0,0342).
 *  - Albedo 0,2: üblicher Standardwert für Gras/Dachflächen ohne Schnee.
 */
export const ANNAHMEN = {
  verluste: 0.14,
  tempKoeff: -0.0035,
  albedo: 0.2,
  ross: { frei: 0.0208, aufdach: 0.026, integriert: 0.0342 },
  modell: "hay-davies",
};

/** Diffusanteil kd = DHI/GHI in Abhängigkeit vom Klarheitsindex kt (Erbs, Klein & Duffie 1982). */
export function erbsDiffusanteil(kt) {
  if (!(kt > 0)) return 1;
  if (kt <= 0.22) return 1 - 0.09 * kt;
  if (kt <= 0.8) return 0.9511 - 0.1604 * kt + 4.388 * kt ** 2 - 16.638 * kt ** 3 + 12.336 * kt ** 4;
  return 0.165;
}

/**
 * Teilt die horizontale Globalstrahlung in Diffus- und Direktanteil.
 * g0h: extraterrestrische Einstrahlung auf die Horizontale (Intervallmittel), cosZ: Mittel des cos(Zenit).
 * Bei sehr tiefem Sonnenstand (mittlere Sonnenhöhe unter ca. 3°) wird alles als diffus behandelt,
 * weil der Klarheitsindex dort nicht mehr aussagekräftig ist.
 */
export function aufteilen({ ghi, g0h, cosZ }) {
  if (!(ghi > 0)) return { dhi: 0, bhi: 0, kt: 0 };
  if (!(g0h > 0) || !(cosZ > 0.05)) return { dhi: ghi, bhi: 0, kt: 0 };
  const kt = Math.min(ghi / g0h, 1);
  const dhi = Math.min(ghi, ghi * erbsDiffusanteil(kt));
  return { dhi, bhi: Math.max(0, ghi - dhi), kt };
}

/**
 * Einstrahlung auf die Modulebene (W/m²).
 * modell: "isotrop" (Liu & Jordan) oder "hay-davies" (Zirkumsolaranteil über den Anisotropie-Index Ai = Bh / G0h).
 * Rückgabe: { gesamt, direkt, diffus, boden }
 */
export function transposition({ ghi, dhi, bhi, rb, g0h, neigung, albedo = ANNAHMEN.albedo, modell = ANNAHMEN.modell }) {
  if (!(ghi > 0)) return { gesamt: 0, direkt: 0, diffus: 0, boden: 0 };
  const cb = Math.cos(neigung * RAD);
  const himmel = (1 + cb) / 2;
  const direkt = Math.max(0, bhi * rb);
  let diffus;
  if (modell === "isotrop") {
    diffus = dhi * himmel;
  } else {
    const ai = g0h > 0 ? Math.min(Math.max(bhi / g0h, 0), 1) : 0;
    diffus = dhi * (ai * rb + (1 - ai) * himmel);
  }
  const boden = ghi * albedo * ((1 - cb) / 2);
  return { gesamt: direkt + diffus + boden, direkt, diffus, boden };
}

/** Modultemperatur nach Ross: T_Modul = T_Luft + k · G_Modul. */
export function modulTemperatur(tLuft, gModul, k = ANNAHMEN.ross.aufdach) {
  return tLuft + k * Math.max(0, gModul);
}

/**
 * Mittlere AC-Leistung (kW) im Intervall.
 * P = kWp · G/1000 · (1 + γ · (T_Modul − 25 °C)) · (1 − Verluste), begrenzt auf `grenzeKw` (Standard: kWp).
 */
export function leistungKw({ gModul, tModul, kwp, tempKoeff = ANNAHMEN.tempKoeff, verluste = ANNAHMEN.verluste, grenzeKw }) {
  if (!(gModul > 0) || !(kwp > 0)) return 0;
  const faktorTemp = Math.max(0, 1 + tempKoeff * (tModul - 25));
  const p = kwp * (gModul / 1000) * faktorTemp * (1 - verluste);
  return Math.min(p, grenzeKw ?? kwp);
}

/** Azimut in PVGIS-Konvention (0 = Süd, −90 = Ost, 90 = West) → Grad von Nord im Uhrzeigersinn. */
export const azimutVonNord = (pvgisAzimut) => (((180 + pvgisAzimut) % 360) + 360) % 360;

/** Modulflächen einer Anlage: Ost-West wird als zwei Hälften gerechnet. */
export function teilflaechen({ kwp, neigung, azimut }) {
  if (azimut === "ost-west") {
    return [
      { kwp: kwp / 2, neigung, azimut: -90 },
      { kwp: kwp / 2, neigung, azimut: 90 },
    ];
  }
  return [{ kwp, neigung, azimut: Number(azimut) || 0 }];
}

/**
 * Leistung einer Anlage für ein Stundenintervall bei gegebener Globalstrahlung und Lufttemperatur.
 * anlage: { kwp, neigung, azimut (PVGIS-Konvention oder "ost-west"), montage, verluste, tempKoeff, albedo, modell }
 */
export function stundeRechnen({ vonMs, bisMs, lat, lon, ghi, tLuft, anlage }) {
  const a = { ...ANNAHMEN, montage: "aufdach", ...anlage };
  const k = ANNAHMEN.ross[a.montage] ?? ANNAHMEN.ross.aufdach;
  let kw = 0;
  let gModulGewichtet = 0;
  let tModulGewichtet = 0;
  const flaechen = teilflaechen(a);
  for (const f of flaechen) {
    const geo = intervallGeometrie({ vonMs, bisMs, lat, lon, neigung: f.neigung, flaechenAzimut: azimutVonNord(f.azimut) });
    const { dhi, bhi } = aufteilen({ ghi, g0h: geo.g0h, cosZ: geo.cosZ });
    const { gesamt } = transposition({ ghi, dhi, bhi, rb: geo.rb, g0h: geo.g0h, neigung: f.neigung, albedo: a.albedo, modell: a.modell });
    const tModul = modulTemperatur(Number.isFinite(tLuft) ? tLuft : 15, gesamt, k);
    kw += leistungKw({ gModul: gesamt, tModul, kwp: f.kwp, tempKoeff: a.tempKoeff, verluste: a.verluste });
    gModulGewichtet += gesamt * (f.kwp / a.kwp);
    tModulGewichtet += tModul * (f.kwp / a.kwp);
  }
  return { kw, gModul: gModulGewichtet, tModul: tModulGewichtet };
}

const STUNDE = 3600000;

/**
 * Prognose über alle Stunden. stunden: [{ ende (ms), ghi, ghiP10?, ghiP90?, t2m }]
 * Die GeoSphere-Werte sind Mittel über die Stunde VOR dem Zeitstempel (dekumuliert) –
 * das Intervall ist daher [ende − 1 h, ende).
 * Rückgabe je Stunde: { beginn, ende, kw, kwP10, kwP90, gModul, tModul, ghi }
 * (kWh je Stunde = mittlere kW · 1 h)
 */
export function prognoseRechnen({ stunden = [], lat, lon, anlage }) {
  return stunden.map((s) => {
    const vonMs = s.ende - STUNDE;
    const basis = { vonMs, bisMs: s.ende, lat, lon, tLuft: s.t2m, anlage };
    const mitte = stundeRechnen({ ...basis, ghi: s.ghi });
    const p10 = Number.isFinite(s.ghiP10) ? stundeRechnen({ ...basis, ghi: s.ghiP10 }).kw : null;
    const p90 = Number.isFinite(s.ghiP90) ? stundeRechnen({ ...basis, ghi: s.ghiP90 }).kw : null;
    return {
      beginn: vonMs,
      ende: s.ende,
      ghi: s.ghi,
      kw: mitte.kw,
      // Band ehrlich aus dem Ensemble (Perzentile 10/90) – der deterministische Lauf kann außerhalb liegen.
      kwP10: p10 == null ? null : Math.min(p10, p90 ?? p10),
      kwP90: p90 == null ? null : Math.max(p90, p10 ?? p90),
      gModul: mitte.gModul,
      tModul: mitte.tModul,
    };
  });
}
