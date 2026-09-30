// src/lib/lastgang/peak.js
//
// Peak-Shaving-Potenzial aus dem gemessenen Lastgang (grobe Speicherauslegung, Richtwert).
//
// Vorgehen:
//  - Zielspitze (Schwelle) wählen. Nötige Entladeleistung = Jahresspitze − Schwelle.
//  - Kleinste nutzbare Kapazität per Simulation über alle Viertelstunden: Der Speicher entlädt,
//    sobald die Last über der Schwelle liegt, und lädt aus dem Netz nach, solange die Last darunter
//    liegt (ohne die Schwelle zu überschreiten). Wirkungsgrad Laden + Entladen 90 %.
//  - Empfohlene Nennkapazität wie im Peak-Shaving-Rechner (src/lib/rechner/peakshaving.js):
//    nutzbare Kapazität × 1,25 Reserve ÷ 0,8 Restkapazität am Lebensende.
//  - Ersparnis Leistungspreis bis Ende 2026: Leistungspreis × Senkung des Mittelwerts der
//    Monatsspitzen (SNE-V 2026). Ab 2027 wird jeder Monat einzeln abgerechnet (ElWG) – die
//    Tarifwerte 2027 stehen noch aus.
// Bewusst NICHT enthalten: Prognosefehler im Echtbetrieb, Mindestladezustand für Notstrom,
// Speicherpreise (hängen stark von Größe und Projekt ab).

import { PS_ANNAHMEN } from "../rechner/peakshaving.js";

export const PEAK_ANNAHMEN = {
  eta: PS_ANNAHMEN.eta,
  reserve: PS_ANNAHMEN.reserve,
  sohEnde: PS_ANNAHMEN.sohEnde,
};

/**
 * Hält ein Speicher mit Kapazität e (kWh, nutzbar) und Leistung p (kW) die Schwelle?
 * @returns {boolean}
 */
export function haeltSchwelle(kw, intervall, schwelle, e, p, eta = PEAK_ANNAHMEN.eta) {
  const dt = intervall / 60;
  let soc = e;
  for (let i = 0; i < kw.length; i++) {
    const l = kw[i];
    if (l > schwelle) {
      const bedarf = (l - schwelle) * dt;
      const ab = Math.min(bedarf, p * dt, soc);
      soc -= ab;
      if (bedarf - ab > 1e-6) return false;
    } else if (soc < e) {
      const rein = Math.min((schwelle - l) * dt, p * dt, (e - soc) / eta);
      soc += rein * eta;
    }
  }
  return true;
}

const aufrunden = (x, schritt) => Math.ceil(x / schritt - 1e-9) * schritt;

/**
 * Speicherbedarf für eine Zielspitze.
 * @param {Float64Array} kw Viertelstunden-Leistung
 * @param {number} intervall Minuten
 * @param {number} schwelle Zielspitze in kW
 */
export function speicherFuerSchwelle(kw, intervall, schwelle) {
  const dt = intervall / 60;
  let spitze = 0;
  let energieUeber = 0;
  let intervalleUeber = 0;
  const tageMitEingriff = new Map();
  const proTag = 1440 / intervall;
  for (let i = 0; i < kw.length; i++) {
    if (kw[i] > spitze) spitze = kw[i];
    if (kw[i] > schwelle) {
      const e = (kw[i] - schwelle) * dt;
      energieUeber += e;
      intervalleUeber++;
      const tag = Math.floor(i / proTag);
      tageMitEingriff.set(tag, (tageMitEingriff.get(tag) || 0) + e);
    }
  }
  const maxTag = Math.max(0, ...tageMitEingriff.values());
  const leistung = Math.max(0, spitze - schwelle);
  if (leistung <= 0) return { moeglich: true, leistungKw: 0, nutzbarKwh: 0, nennKwh: 0, energieUeber: 0, intervalleUeber: 0, tageMitEingriff: 0 };

  // Obergrenze: doppelte Energie des ungünstigsten Tags – braucht der Speicher mehr, müsste er
  // über mehrere Tage entladen, ohne nachzuladen: Die Schwelle liegt dann zu nahe an der Dauerlast.
  let hi = maxTag * 2 + 1;
  if (!haeltSchwelle(kw, intervall, schwelle, hi, leistung)) {
    return { moeglich: false, leistungKw: leistung, nutzbarKwh: NaN, nennKwh: NaN, energieUeber, intervalleUeber, tageMitEingriff: tageMitEingriff.size };
  }
  let lo = 0;
  for (let k = 0; k < 30 && hi - lo > 0.5; k++) {
    const mitte = (lo + hi) / 2;
    if (haeltSchwelle(kw, intervall, schwelle, mitte, leistung)) hi = mitte;
    else lo = mitte;
  }
  const nutzbar = hi;
  const nenn = (nutzbar * PEAK_ANNAHMEN.reserve) / PEAK_ANNAHMEN.sohEnde;
  return {
    moeglich: true,
    leistungKw: aufrunden(leistung, 5),
    nutzbarKwh: nutzbar,
    nennKwh: aufrunden(nenn, nenn < 100 ? 5 : 10),
    energieUeber,
    intervalleUeber,
    tageMitEingriff: tageMitEingriff.size,
  };
}

/**
 * Senkung des Leistungspreises (Mittel der Monatsspitzen) bei Schwelle.
 * @param {{spitzeKw:number, abdeckung:number}[]} monate aus analysiere()
 * @param {number} lpEuroProKwJahr Leistungspreis €/kW und Jahr
 */
export function ersparnisLeistungspreis(monate, schwelle, lpEuroProKwJahr) {
  const basis = monate.filter((m) => m.abdeckung >= 0.5);
  const liste = basis.length ? basis : monate;
  if (!liste.length) return { vorher: NaN, nachher: NaN, senkungKw: 0, euro: 0 };
  const vorher = liste.reduce((s, m) => s + m.spitzeKw, 0) / liste.length;
  const nachher = liste.reduce((s, m) => s + Math.min(m.spitzeKw, schwelle), 0) / liste.length;
  const senkungKw = vorher - nachher;
  return { vorher, nachher, senkungKw, euro: senkungKw * lpEuroProKwJahr };
}

/** Sinnvoller Bereich für die Zielspitze (Regler) */
export function schwellenBereich(analyse) {
  const spitze = analyse.spitze.kw;
  const schritt = spitze > 400 ? 5 : spitze >= 20 ? 1 : 0.1;
  const max = Math.floor(spitze / schritt) * schritt;
  // Untergrenze über der mittleren Last, aber immer unter der Spitze (sehr gleichmäßige Lastgänge)
  const min = Math.min(Math.ceil(Math.max(analyse.mittelKw * 1.15, spitze * 0.5) / schritt) * schritt, max - schritt);
  return {
    min: Math.max(0, min),
    max,
    schritt,
    standard: Math.round((spitze * 0.9) / schritt) * schritt,
  };
}
