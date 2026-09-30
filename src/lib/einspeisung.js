// src/lib/einspeisung.js
//
// Reine Rechenfunktionen für /einspeisung-gewerbe (OeMAG-Marktpreis, Korridor, Erlös pro Jahr,
// Datenfrische). Ohne React und ohne Pfad-Aliase, damit sie mit node testbar sind
// (scripts/einspeisung.test.mjs). Zahlen kommen aus src/data/oemag.js.
//
// Formatierung bewusst ohne Intl/toLocaleString: gleiche Ausgabe auf Server und im Browser
// (keine Hydration-Unterschiede), Tausenderpunkt über zahlText aus src/data/kennzahlen.js.

import { zahlText } from "../data/kennzahlen.js";
import {
  AUSGLEICHSENERGIE_PV,
  FRISCHE_GRENZE_TAGE,
  OEMAG_MONATE,
  OEMAG_REGELN,
  PV_PROFIL,
  QUARTALSPREISE,
  REFERENZMARKTWERT_PV,
} from "../data/oemag.js";

const MONATE_LANG = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const MONATE_KURZ = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

// ---------------------------------------------------------------- Formatierung

/** Dezimalzahl mit Komma und Tausenderpunkt: dezimal(1234.5, 1) -> "1.234,5" */
export function dezimal(wert, stellen = 0) {
  if (!Number.isFinite(wert)) return "–";
  const fest = Math.abs(wert).toFixed(stellen);
  const [ganz, rest] = fest.split(".");
  const vorzeichen = wert < 0 && Number(fest) !== 0 ? "−" : "";
  return `${vorzeichen}${zahlText(ganz)}${rest ? `,${rest}` : ""}`;
}

/** ct/kWh mit drei Nachkommastellen wie bei der OeMAG: 8.997 -> "8,997" */
export const ctText = (wert, stellen = 3) => dezimal(wert, stellen);

/** Euro gerundet mit Tausenderpunkt: 12345.6 -> "12.346 €" */
export const euroText = (wert) => `${dezimal(Math.round(wert), 0)} €`;

/** "2026-08" -> "August 2026" bzw. kurz "Aug 26" */
export function monatLabel(iso, kurz = false) {
  const [j, m] = String(iso).split("-").map(Number);
  if (!j || !m || m < 1 || m > 12) return String(iso);
  return kurz ? `${MONATE_KURZ[m - 1]} ${String(j).slice(2)}` : `${MONATE_LANG[m - 1]} ${j}`;
}

/** ISO-Datum "2026-09-30" -> "30.09.2026" */
export function datumText(iso) {
  const [j, m, t] = String(iso).split("-");
  return t && m && j ? `${t}.${m}.${j}` : String(iso);
}

// ---------------------------------------------------------------- Korridor nach § 41 ÖSG 2012

/** "2026-08" -> "2026-Q3" */
export function quartalVon(monatIso) {
  const [j, m] = String(monatIso).split("-").map(Number);
  return `${j}-Q${Math.ceil(m / 3)}`;
}

/**
 * Unter- und Obergrenze des OeMAG-Monatswerts für einen Monat:
 * Untergrenze = 60 % des Quartalsmarktpreises − Ausgleichsenergie, Obergrenze = 100 % − Ausgleichsenergie.
 * Rückgabe null, wenn der Quartalspreis (noch) nicht bekannt ist.
 */
export function korridorFuer(monatIso, quartale = QUARTALSPREISE, abzug = AUSGLEICHSENERGIE_PV) {
  const q = quartale.find((x) => x.quartal === quartalVon(monatIso));
  if (!q) return null;
  const jahr = Number(String(monatIso).slice(0, 4));
  const ae = abzug[jahr] ?? 0;
  return { quartal: q.quartal, quartalCt: q.ct, abzug: ae, unter: 0.6 * q.ct - ae, ober: q.ct - ae };
}

/** Lage eines Monatswerts im Korridor: "untergrenze" | "obergrenze" | "day-ahead" (dazwischen). */
export function lageImKorridor(wert, korridor, toleranz = 0.0011) {
  if (!korridor || !Number.isFinite(wert)) return null;
  if (Math.abs(wert - korridor.unter) <= toleranz) return "untergrenze";
  if (Math.abs(wert - korridor.ober) <= toleranz) return "obergrenze";
  return "day-ahead";
}

// ---------------------------------------------------------------- Zeiträume und Mittelwerte

/** Werte eines Zeitraums: "12m" = letzte 12 veröffentlichte Monate, sonst Kalenderjahr ("2025"). */
export function werteImZeitraum(werte, zeitraum = "12m") {
  if (zeitraum === "12m") return werte.slice(-12);
  return werte.filter((w) => w.monat.startsWith(`${zeitraum}-`));
}

/** Einfacher Durchschnitt der Monatswerte (ct/kWh). */
export function mittel(werte) {
  if (!werte.length) return NaN;
  return werte.reduce((s, w) => s + w.ct, 0) / werte.length;
}

/**
 * Mit dem PV-Profil gewichteter Durchschnitt: Sommermonate zählen mehr, weil dann mehr eingespeist wird.
 * profil: 12 Monatsgewichte (Jänner..Dezember), beliebige Einheit.
 */
export function gewichtetesMittel(werte, profil = PV_PROFIL.monate) {
  let summe = 0;
  let gewicht = 0;
  for (const w of werte) {
    const g = profil[Number(w.monat.slice(5, 7)) - 1] ?? 0;
    summe += w.ct * g;
    gewicht += g;
  }
  return gewicht > 0 ? summe / gewicht : NaN;
}

/** Kleinster und größter Monatswert eines Zeitraums. */
export function spanne(werte) {
  if (!werte.length) return { min: null, max: null };
  let min = werte[0];
  let max = werte[0];
  for (const w of werte) {
    if (w.ct < min.ct) min = w;
    if (w.ct > max.ct) max = w;
  }
  return { min, max };
}

/** Anzahl der Monate, in denen eine Korridorgrenze gegriffen hat. */
export function grenzMonate(werte, grundlage) {
  return werte.filter((w) => w.grundlage === grundlage).length;
}

// ---------------------------------------------------------------- Erlös

/** Zahl aus Texteingabe („12.500“, „8,5“) – Tausenderpunkte werden ignoriert, Komma = Dezimal. */
export function zahlAusText(text) {
  const s = String(text ?? "").trim().replace(/\s/g, "");
  if (!s) return NaN;
  const ohnePunkte = /,/.test(s) ? s.replace(/\./g, "").replace(",", ".") : /^\d{1,3}(\.\d{3})+$/.test(s) ? s.replace(/\./g, "") : s;
  const n = Number(ohnePunkte);
  return Number.isFinite(n) ? n : NaN;
}

/**
 * Erlös pro Jahr für eine Überschussmenge.
 * kwh: eingespeiste Menge pro Jahr, ct: Preis in ct/kWh (netto), entgelt: Abzug in ct/kWh (z. B. Vermarktungsentgelt).
 * Rückgabe { eur, ctNetto } – bei ungültiger Eingabe 0.
 */
export function erloesProJahr({ kwh, ct, entgelt = 0 }) {
  const menge = Number(kwh);
  const preis = Number(ct) - Number(entgelt || 0);
  if (!Number.isFinite(menge) || menge <= 0 || !Number.isFinite(preis)) return { eur: 0, ctNetto: Number.isFinite(preis) ? preis : 0 };
  return { eur: (menge * preis) / 100, ctNetto: preis };
}

/** Darf die Anlage an die OeMAG verkaufen? (Engpassleistung unter 500 kWp) */
export const oemagMoeglich = (kwp) => !(Number(kwp) >= OEMAG_REGELN.grenzeKwp);

/**
 * Szenarien „Erlös pro Jahr“ für den Rechner.
 * - oemag: OeMAG-Marktpreis, mit PV-Profil gewichtet, samt Bandbreite (schwächster/stärkster Monat)
 * - spot:  Referenzmarktwert PV (E-Control) gewichtet minus Vermarktungsentgelt – Richtwert Direktvermarktung
 * - eigen: selbst eingegebener Vergleichswert (Angebot eines Versorgers, Direktvermarkters oder PPA)
 */
export function erloesSzenarien({ kwh, kwp, zeitraum = "12m", entgelt = 0, eigenCt = null, oemag = OEMAG_MONATE, rmw = REFERENZMARKTWERT_PV, profil = PV_PROFIL.monate }) {
  const om = werteImZeitraum(oemag, zeitraum);
  const rm = werteImZeitraum(rmw, zeitraum);
  const omCt = gewichtetesMittel(om, profil);
  const rmCt = gewichtetesMittel(rm, profil);
  const { min, max } = spanne(om);
  const moeglich = oemagMoeglich(kwp);

  const szenarien = [
    {
      id: "oemag",
      moeglich,
      ct: omCt,
      eur: erloesProJahr({ kwh, ct: omCt }).eur,
      von: min ? erloesProJahr({ kwh, ct: min.ct }).eur : 0,
      bis: max ? erloesProJahr({ kwh, ct: max.ct }).eur : 0,
      min,
      max,
      monate: om.length,
    },
    {
      id: "spot",
      moeglich: true,
      ct: rmCt - Number(entgelt || 0),
      brutto: rmCt,
      eur: erloesProJahr({ kwh, ct: rmCt, entgelt }).eur,
      monate: rm.length,
    },
  ];
  const eigen = Number(eigenCt);
  if (eigenCt !== null && eigenCt !== "" && Number.isFinite(eigen) && eigen > 0) {
    szenarien.push({ id: "eigen", moeglich: true, ct: eigen, eur: erloesProJahr({ kwh, ct: eigen }).eur });
  }
  return szenarien;
}

// ---------------------------------------------------------------- Datenfrische

/** Kalendertage zwischen Prüfdatum (ISO, Wiener Kalendertag) und jetzt. */
export function tageSeit(iso, jetztMs = Date.now()) {
  const [j, m, t] = String(iso).split("-").map(Number);
  if (!j || !m || !t || !Number.isFinite(jetztMs)) return NaN;
  const start = Date.UTC(j, m - 1, t);
  // Wiener Zeit näherungsweise über festen Versatz (+1 h); ein Tag Unschärfe ist für die Warnung egal.
  const heute = new Date(jetztMs + 3600000);
  const heuteUtc = Date.UTC(heute.getUTCFullYear(), heute.getUTCMonth(), heute.getUTCDate());
  return Math.round((heuteUtc - start) / 86400000);
}

/** { tage, veraltet } – veraltet, sobald mehr als `grenze` Tage seit der Prüfung vergangen sind. */
export function datenFrische(geprueftAm, jetztMs = Date.now(), grenze = FRISCHE_GRENZE_TAGE) {
  const tage = tageSeit(geprueftAm, jetztMs);
  return { tage, veraltet: !Number.isFinite(tage) || tage > grenze, grenze };
}

// ---------------------------------------------------------------- Kennzahlen für die Seite

/** Letzter veröffentlichter Monatswert. */
export const letzterMonat = (werte = OEMAG_MONATE) => werte[werte.length - 1];

/**
 * Korridor des jüngsten veröffentlichten Quartalsmarktpreises (z. B. Q4/2026 für Oktober–Dezember).
 * abzugBekannt = false, wenn für das Jahr noch kein Ausgleichsenergie-Abzug veröffentlicht ist.
 */
export function neuesterKorridor(quartale = QUARTALSPREISE, abzug = AUSGLEICHSENERGIE_PV) {
  const q = quartale[quartale.length - 1];
  const [j, qn] = q.quartal.split("-Q").map(Number);
  const monate = [1, 2, 3].map((i) => `${j}-${String((qn - 1) * 3 + i).padStart(2, "0")}`);
  const k = korridorFuer(monate[0], quartale, abzug);
  return { ...k, monate, jahr: j, nr: qn, veroeffentlicht: q.veroeffentlicht ?? null, abzugBekannt: abzug[j] !== undefined };
}
