// src/lib/prognose/auswertung.js
//
// Auswertung der stündlichen PV-Prognose: Tagessummen und „Goldene Stunden“ in Verbindung mit den
// Day-Ahead-Preisen der Gebotszone AT (Quelle: src/lib/energy.js, Energy-Charts bzw. aWATTar).
// Reine Funktionen – Test: scripts/prognose.test.mjs

import { wienZeit } from "./format.js";

const STUNDE = 3600000;

/** Viertelstunden- oder Stundenpreise ({ t, eurMwh }) zu Stundenmitteln je Stundenbeginn (ms). */
export function preiseJeStunde(punkte = []) {
  const summen = new Map();
  for (const p of punkte) {
    if (!Number.isFinite(p?.t) || !Number.isFinite(p?.eurMwh)) continue;
    const beginn = Math.floor(p.t / STUNDE) * STUNDE;
    const e = summen.get(beginn) || { s: 0, n: 0 };
    e.s += p.eurMwh;
    e.n += 1;
    summen.set(beginn, e);
  }
  return [...summen.entries()].sort((a, b) => a[0] - b[0]).map(([t, e]) => ({ t, eurMwh: e.s / e.n }));
}

/** Tagessummen (Wiener Kalendertag) aus der Stundenprognose: kWh gesamt, Band, Spitze. */
export function tagesSummen(stunden = []) {
  const tage = new Map();
  for (const s of stunden) {
    const { datum } = wienZeit(s.beginn);
    const t = tage.get(datum) || { datum, ersteStunde: s.beginn, letzteStunde: s.beginn, kwh: 0, kwhP10: 0, kwhP90: 0, mitBand: true, spitzeKw: 0, spitzeUm: null, stunden: 0 };
    t.kwh += s.kw;
    if (Number.isFinite(s.kwP10) && Number.isFinite(s.kwP90)) {
      t.kwhP10 += s.kwP10;
      t.kwhP90 += s.kwP90;
    } else {
      t.mitBand = false;
    }
    if (s.kw > t.spitzeKw) {
      t.spitzeKw = s.kw;
      t.spitzeUm = s.beginn;
    }
    t.letzteStunde = s.beginn;
    t.stunden += 1;
    tage.set(datum, t);
  }
  return [...tage.values()].map((t) => (t.mitBand ? t : { ...t, kwhP10: null, kwhP90: null }));
}

/**
 * Goldene Stunden je Tag: Stunden mit mindestens `mindestAnteil` der Tagesspitze an Sonnenstrom –
 * daraus die `anzahl` Stunden mit dem niedrigsten Börsenpreis. Dann bringt Einspeisen am wenigsten
 * und selbst Verbrauchen (Maschinen, Kühlung, Laden, Wärmepumpe, Speicher) am meisten.
 * Ohne Preis (Day-Ahead für den Tag noch nicht veröffentlicht) zählt nur die Sonnenstrom-Menge.
 *
 * stunden: Ergebnis von prognoseRechnen ({ beginn, ende, kw }), preise: [{ t (Stundenbeginn), eurMwh }]
 * Rückgabe: [{ datum, mitPreis, spitzeKw, stunden: [{ beginn, ende, kw, eurMwh|null }] }]
 */
export function goldeneStunden({ stunden = [], preise = [], anzahl = 3, mindestAnteil = 0.6, mindestKw = 0 }) {
  const preisVon = new Map(preise.map((p) => [p.t, p.eurMwh]));
  const nachTag = new Map();
  for (const s of stunden) {
    const { datum } = wienZeit(s.beginn);
    if (!nachTag.has(datum)) nachTag.set(datum, []);
    nachTag.get(datum).push(s);
  }
  const ergebnis = [];
  for (const [datum, liste] of nachTag) {
    const spitzeKw = Math.max(0, ...liste.map((s) => s.kw));
    if (!(spitzeKw > mindestKw)) {
      ergebnis.push({ datum, mitPreis: false, spitzeKw, stunden: [] });
      continue;
    }
    const kandidaten = liste
      .filter((s) => s.kw > 0 && s.kw >= mindestAnteil * spitzeKw)
      .map((s) => ({ beginn: s.beginn, ende: s.ende, kw: s.kw, eurMwh: preisVon.has(s.beginn) ? preisVon.get(s.beginn) : null }));
    const mitPreis = kandidaten.length > 0 && kandidaten.every((k) => Number.isFinite(k.eurMwh));
    const sortiert = [...kandidaten].sort((a, b) => (mitPreis ? a.eurMwh - b.eurMwh || b.kw - a.kw : b.kw - a.kw));
    const auswahl = sortiert.slice(0, anzahl).sort((a, b) => a.beginn - b.beginn);
    ergebnis.push({ datum, mitPreis, spitzeKw, stunden: auswahl });
  }
  return ergebnis;
}

/** Grober Rahmen um Österreich (identisch mit dem Standort-Check). */
export const OESTERREICH_RAHMEN = { latMin: 46.35, latMax: 49.05, lonMin: 9.5, lonMax: 17.2 };

export const imRahmen = (lat, lon, r = OESTERREICH_RAHMEN) => lat >= r.latMin && lat <= r.latMax && lon >= r.lonMin && lon <= r.lonMax;

/** Achsenteilung mit „runden“ Schritten (1, 2, 2,5, 5, 10 · 10ⁿ). */
export function achse(lo, hi, ziel = 5) {
  if (!(hi > lo)) hi = lo + 1;
  const roh = (hi - lo) / ziel;
  const mag = 10 ** Math.floor(Math.log10(roh));
  const schritt = [1, 2, 2.5, 5, 10].map((f) => f * mag).find((s) => s >= roh) || 10 * mag;
  const von = Math.floor(lo / schritt) * schritt;
  const bis = Math.ceil(hi / schritt) * schritt;
  const ticks = [];
  for (let v = von; v <= bis + schritt / 2; v += schritt) ticks.push(Math.round(v * 1000) / 1000);
  return { von, bis, ticks, schritt };
}

/** Rasterzelle für Cache und Abfrage: Mittelpunkt der Zelle mit Kantenlänge `grad`. */
export function zelle(lat, lon, grad = 0.05) {
  const i = Math.floor(lat / grad);
  const j = Math.floor(lon / grad);
  const runden = (x) => Math.round(x * 10000) / 10000;
  return { schluessel: `${grad}:${i}:${j}`, lat: runden((i + 0.5) * grad), lon: runden((j + 0.5) * grad), grad };
}
