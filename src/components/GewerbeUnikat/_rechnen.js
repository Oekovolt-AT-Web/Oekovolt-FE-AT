// src/components/GewerbeUnikat/_rechnen.js
//
// Rechenkern der Unikat-Seite /gewerbe – REIN (ohne React, ohne Browser-APIs), läuft im Web Worker
// (./_lastgang.worker.js), auf dem Server (./_server.js) und in Node-Tests. Nutzt ausschließlich die
// bestehenden Bibliotheken src/lib/lastgang/* (unverändert) und bereitet deren Ergebnisse für die Kapitel
// auf: Raster für den Teppich (Tage × Viertelstunden), Reihen für Simulationen, PV-Profil, Kappungstabelle.
//
// NICHT im Haupt-Bundle importieren (zieht Parser und Analyse mit) – Kapitel bekommen die Daten über
// useGewerbeDaten() aus ./_daten.js. Relative Importe mit Endung, damit Node die Datei ohne Bundler lädt.
//
// Datenherkunft (Pflichtkennzeichnung, siehe KENNZEICHNUNG in ./_tokens.js):
//  - Beispiel: src/lib/lastgang/beispiel.js – SYNTHETISCHER Betrieb (2 Schichten Mo–Fr, Samstagvormittag,
//    Betriebsurlaub August und Jahreswechsel), keine Messdaten.
//  - PV: src/lib/lastgang/pv.js – PVGIS-Monatssummen (src/data/regionen-pvgis.json), Tagesverlauf aus
//    Sonnenstand, Wetter synthetisch.

import { beispielCsv } from "../../lib/lastgang/beispiel.js";
import { dekodiere, leseLastgang } from "../../lib/lastgang/parser.js";
import { analysiere, tagTyp } from "../../lib/lastgang/analyse.js";
import { empfehlung, kurve, pvProfil } from "../../lib/lastgang/pv.js";
import { ersparnisLeistungspreis, schwellenBereich, speicherFuerSchwelle } from "../../lib/lastgang/peak.js";

const MIN = 60000;
const TAG = 86400000;
const tagBeginn = (t) => t - (((t % TAG) + TAG) % TAG);

/** Standort und Ausrichtung des Beispiels (Linz, Ost-West 15° – passt zur Hallen-Annahme in K2). */
export const BEISPIEL_ORT = "linz";
export const BEISPIEL_AUSRICHTUNG = "ostwest";
/** Ziel-Eigenverbrauch für die Größenempfehlung (wie /lastgang-analyse). */
export const ZIEL_EV = 0.8;

let beispielCache = null;
/** Gelesener Beispiel-Lastgang (einmal je Prozess/Worker). */
export function beispielLastgang() {
  if (!beispielCache) beispielCache = leseLastgang(beispielCsv());
  return beispielCache;
}

/** Eigene Datei (ArrayBuffer/Uint8Array) → gelesener Lastgang. Wirft LastgangFehler mit verständlichem Text. */
export function lastgangAusBytes(bytes) {
  return leseLastgang(dekodiere(bytes));
}

/**
 * Last aufbereiten: Kennzahlen + Raster (Tage × Slots) + Reihen.
 * @param {ReturnType<typeof leseLastgang>} lg
 * @param {"beispiel"|"eigen"} quelle
 */
export function lastAufbereiten(lg, quelle = "beispiel") {
  const a = analysiere(lg);
  const { tage, slots, werte, max } = a.heat;
  const typ = new Uint8Array(tage.length);
  for (let i = 0; i < tage.length; i++) typ[i] = tagTyp(tage[i]);
  return {
    quelle,
    intervall: lg.intervall,
    n: a.n,
    von: a.von,
    bis: a.bis,
    hochgerechnet: a.hochgerechnet,
    fehlend: a.fehlend,
    jahresverbrauch: a.jahresverbrauch,
    summe: a.summe,
    spitze: a.spitze, // { kw, t } – t = Wanduhrzeit als UTC-ms (new Date(t).getUTC…)
    grundlast: a.grundlast,
    mittelKw: a.mittelKw,
    benutzungsdauer: a.benutzungsdauer,
    lastfaktor: a.lastfaktor,
    anteilFrei: a.anteilFrei,
    mittelMonatsspitze: a.mittelMonatsspitze,
    stundenUeber90: a.stundenUeber(a.spitze.kw * 0.9),
    monate: a.monate, // [{ jahr, monat, kwh, spitzeKw, spitzeT, abdeckung }]
    topSpitzen: a.topSpitzen,
    tagesgang: a.tagesgang, // { slots, werktag[], samstag[], sonntag[], werktagMax[], tage[] }
    wochentage: a.wochentage,
    dauerlinie: a.dauerlinie, // ≤ 241 Stützstellen { anteil, kw }
    raster: {
      tage: Float64Array.from(tage), // Tagesbeginn (Wanduhr, UTC-ms)
      typ, // 0 Werktag, 1 Samstag, 2 Sonn-/Feiertag
      slots,
      last: werte, // Float32Array(tage × slots) kW, NaN = fehlt
      max,
    },
    reihe: { zeiten: lg.zeiten, kwh: lg.kwh, kw: a.kw }, // je Intervall (Float64Array)
  };
}

/**
 * PV-Profil für Ort und Ausrichtung auf den Zeitstempeln des Lastgangs, dazu Empfehlung und Kurve.
 * @param {object} lg gelesener Lastgang
 * @param {object} last Ergebnis von lastAufbereiten
 * @param {object} ort Eintrag aus regionen-pvgis.json (lat, lon, monate_sued35, *_kwh_kwp)
 * @param {string} ortId Schlüssel des Orts
 * @param {"sued"|"ostwest"|"flach"} ausrichtung
 */
export function pvAufbereiten(lg, last, ort, ortId, ausrichtung = BEISPIEL_AUSRICHTUNG) {
  const p = pvProfil(lg, ort, ausrichtung);
  const { slots, tage } = last.raster;
  const zuKw = 60 / lg.intervall;
  const tagIndex = new Map();
  for (let d = 0; d < tage.length; d++) tagIndex.set(tage[d], d);
  const raster = new Float32Array(tage.length * slots);
  for (let i = 0; i < lg.zeiten.length; i++) {
    const t = lg.zeiten[i];
    const b = tagBeginn(t);
    const d = tagIndex.get(b);
    if (d == null) continue;
    const slot = Math.min(slots - 1, Math.floor((t - b) / (lg.intervall * MIN)));
    const v = p.pv[i] * zuKw; // kW je kWp
    const j = d * slots + slot;
    raster[j] = raster[j] > 0 ? (raster[j] + v) / 2 : v;
  }
  const emp = empfehlung(lg.kwh, p.pv, last.jahresverbrauch, p.jahresErtrag, ZIEL_EV);
  // Kurve bis zur dreifachen Empfehlung (mind. 600 kWp, höchstens 3.000 kWp) – reicht für jedes Hallendach im Regler
  const kurveMax = Math.min(3000, Math.max(600, Math.round(emp.kwp * 3)));
  const k = kurve(lg.kwh, p.pv, kurveMax, 60);
  return {
    ortId,
    ausrichtung,
    jahresErtrag: p.jahresErtrag, // kWh/kWp
    monate: p.monate, // kWh/kWp je Monat
    raster, // Float32Array(tage × slots) kW je kWp
    reihe: p.pv, // Float64Array je Intervall: kWh je kWp
    empfehlung: { kwp: emp.kwp, evQuote: emp.ergebnis.evQuote, autarkie: emp.ergebnis.autarkie, begrenzt: emp.begrenzt },
    kurve: k, // [{ kwp, evQuote, autarkie }]
    kurveMax,
  };
}

/**
 * Kappungstabelle für K5 (Deckel ziehen ohne Rechenlast): je Schwelle Speicherbedarf und Senkung des
 * Mittels der Monatsspitzen. € rechnet das Kapitel selbst (Leistungspreis aus K4).
 * Höchstens ~160 Zeilen; Schrittweite wächst mit der Spitze.
 */
export function kappTabelle(last) {
  const sb = schwellenBereich({ spitze: last.spitze, mittelKw: last.mittelKw });
  const spanne = sb.max - sb.min;
  const schritt = Math.max(sb.schritt, Math.ceil(spanne / 160 / sb.schritt) * sb.schritt);
  const zeilen = [];
  for (let s = sb.max; s >= sb.min - 1e-9; s -= schritt) {
    const schwelle = Math.round(s * 10) / 10;
    const sp = speicherFuerSchwelle(last.reihe.kw, last.intervall, schwelle);
    const er = ersparnisLeistungspreis(last.monate, schwelle, 1);
    zeilen.push({
      schwelle,
      moeglich: sp.moeglich,
      leistungKw: sp.leistungKw,
      nennKwh: sp.nennKwh,
      tage: sp.tageMitEingriff,
      stundenUeber: (sp.intervalleUeber * last.intervall) / 60,
      senkungKw: er.senkungKw, // × Leistungspreis €/kW/Jahr = Ersparnis €/Jahr (bis Ende 2026)
    });
  }
  return { bereich: sb, schritt, zeilen };
}

/**
 * Monatsspitzen des Netzbezugs mit PV (ohne Speicher) – zeigt, wie wenig die PV an der 06:15-Spitze ändert.
 * Läuft auch im Hauptthread (≈ 0,3 ms).
 * @returns {{ spitzen: number[], mittel: number }} 12 Werte (Monat 0–11; fehlende Monate NaN)
 */
export function monatsspitzenMitPv(reihe, pvReihe, kwp, intervall) {
  const zuKw = 60 / intervall;
  const spitzen = new Array(12).fill(NaN);
  for (let i = 0; i < reihe.kw.length; i++) {
    const m = new Date(reihe.zeiten[i]).getUTCMonth();
    const v = Math.max(0, reihe.kw[i] - pvReihe[i] * kwp * zuKw);
    if (!(spitzen[m] >= v)) spitzen[m] = v;
  }
  const gueltig = spitzen.filter(Number.isFinite);
  return { spitzen, mittel: gueltig.reduce((s, v) => s + v, 0) / Math.max(1, gueltig.length) };
}

/**
 * Eine Woche für den Hero-Puls: Last und PV (kW) je Viertelstunde ab Montag `startMs` (Wanduhr-UTC).
 * Standard: Woche ab Mo 16.06.2025 (mit Fronleichnam am Do 19.06. – Feiertag nach ARG § 7).
 */
export function wochenPuls(last, pv, { startMs = Date.UTC(2025, 5, 16), kwp } = {}) {
  const { tage, slots, typ } = last.raster;
  const d0 = tage.indexOf(startMs);
  if (d0 < 0) return null;
  const n = 7 * slots;
  const lastW = new Float32Array(n);
  const pvW = new Float32Array(n);
  const k = kwp ?? pv.empfehlung.kwp;
  for (let d = 0; d < 7; d++) {
    for (let s = 0; s < slots; s++) {
      const j = (d0 + d) * slots + s;
      lastW[d * slots + s] = last.raster.last[j];
      pvW[d * slots + s] = pv.raster[j] * k;
    }
  }
  const tageInfo = Array.from({ length: 7 }, (_, d) => ({ t: tage[d0 + d], typ: typ[d0 + d] }));
  let maxI = 0;
  for (let i = 0; i < n; i++) if (lastW[i] > lastW[maxI]) maxI = i;
  return { slots, kwp: k, last: lastW, pv: pvW, tage: tageInfo, spitze: { i: maxI, kw: lastW[maxI] } };
}

/** Kompakte Kennzahlen (serialisierbar) – für SSR-Text, figcaption und JSON-freie Übergabe an Client-Inseln. */
export function kennzahlen(last, pv) {
  return {
    quelle: last.quelle,
    jahresverbrauch: last.jahresverbrauch,
    spitzeKw: last.spitze.kw,
    spitzeT: last.spitze.t,
    grundlast: last.grundlast,
    benutzungsdauer: last.benutzungsdauer,
    anteilFrei: last.anteilFrei,
    mittelMonatsspitze: last.mittelMonatsspitze,
    stundenUeber90: last.stundenUeber90,
    monate: last.monate.map((m) => ({ monat: m.monat, jahr: m.jahr, kwh: m.kwh, spitzeKw: m.spitzeKw, spitzeT: m.spitzeT })),
    pv: pv
      ? { ortId: pv.ortId, ausrichtung: pv.ausrichtung, jahresErtrag: pv.jahresErtrag, empfehlung: pv.empfehlung }
      : null,
  };
}
