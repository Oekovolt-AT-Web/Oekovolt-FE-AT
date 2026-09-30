// src/lib/schneelast/einordnung.js
//
// Anzeige-Logik für die Schneelast-Seiten (/schneelast, /schneelast/[bundesland]):
// Zahlformat, Farbklassen der Karte, Einordnung eines Richtwerts gegen die Modulklassen und
// Grenzwerte je Modulklasse. Reine Funktionen ohne Netzwerk und ohne fs – Browser und Server.
//
// Rechengrundlage sind die vorhandenen Funktionen des Standort-Checks
// (src/lib/standort/berechnung.js: ÖNORM EN 1991-1-3 Dachschneelast, IEC 61215 Prüf-/Bemessungslast,
// γQ = 1,5). Alle Ergebnisse sind Orientierung aus einem RICHTWERT, kein Normwert und keine Statik.

import { GAMMA_Q, MODULKLASSEN, RESERVE_GRENZE, bewerteSchnee, formbeiwertMu1 } from "../standort/berechnung.js";

/** Obergrenze, ab der wir keinen Richtwert ausgeben (Gültigkeit der Normkarte, Modellgüte des Rasters). */
export const MAX_SEEHOEHE = 2000;

/* ------------------------------------------------------------------ Zahlformat */

/**
 * Zahl im österreichischen Format ohne Intl (identisch auf Server und Client):
 * Tausenderpunkt, Dezimalkomma, feste Nachkommastellen. Nicht-Zahlen → „–“.
 */
export function zahl(n, stellen = 0) {
  const w = Number(n);
  if (!Number.isFinite(w)) return "–";
  const text = Math.abs(w).toFixed(stellen);
  const [ganz, rest] = text.split(".");
  const negativ = w < 0 && Number(text) !== 0;
  return `${negativ ? "−" : ""}${ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${rest ? `,${rest}` : ""}`;
}

/** Schneelast mit Einheit, z. B. „1,6 kN/m²“. */
export const kn = (n, stellen = 1) => `${zahl(n, stellen)} kN/m²`;

/** kN/m² → kg/m² (Masse je m², g = 9,81 m/s²) für die Alltagsvorstellung, auf 10 kg gerundet. */
export const kgProM2 = (knWert) => Math.round((Number(knWert) * 1000) / 9.81 / 10) * 10;

/* ------------------------------------------------------------------ Farbklassen der Karte */

/**
 * Klassen der Kartendarstellung (s_k in kN/m², bis ausschließlich „bis“).
 * Sequenzielle Blau-Skala: hell = wenig Schnee, dunkel = viel Schnee.
 */
export const KLASSEN = [
  { bis: 1, label: "unter 1,0", farbe: "#eef5fb" },
  { bis: 1.5, label: "1,0 – 1,5", farbe: "#d3e5f3" },
  { bis: 2, label: "1,5 – 2,0", farbe: "#afcde8" },
  { bis: 3, label: "2,0 – 3,0", farbe: "#84b0d9" },
  { bis: 4.5, label: "3,0 – 4,5", farbe: "#5690c6" },
  { bis: 6, label: "4,5 – 6,0", farbe: "#3570ab" },
  { bis: 10, label: "6,0 – 10", farbe: "#20508a" },
  { bis: Infinity, label: "über 10", farbe: "#12305c" },
];

/** Index der Farbklasse für einen Wert; null für ungültige Werte. */
export function klasseFuer(sk) {
  const w = Number(sk);
  if (!Number.isFinite(w) || w < 0) return null;
  const i = KLASSEN.findIndex((k) => w < k.bis);
  return i === -1 ? KLASSEN.length - 1 : i;
}

/** „#rrggbb“ → [r, g, b] */
export function hexZuRgb(hex) {
  const h = String(hex).replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/* ------------------------------------------------------------------ Modulklassen */

/**
 * Größte Bodenschneelast s_k, bei der eine Modulklasse rechnerisch noch ausreicht.
 * Bemessung: γQ · μ1 · s_k · cos α ≤ auslastung · Bemessungslast des Moduls.
 * auslastung 1 = Grenze „knapp“, RESERVE_GRENZE (0,8) = Grenze „mit Reserve“.
 * Rückgabe in kN/m², Infinity wenn keine Schneelast wirkt (μ1 = 0).
 */
export function skGrenze(bemessungPa, neigung = 30, schneefang = false, auslastung = 1) {
  const mu1 = formbeiwertMu1(neigung, schneefang);
  const cos = Math.cos((Math.max(0, Math.min(90, Number(neigung) || 0)) * Math.PI) / 180);
  const faktor = GAMMA_Q * mu1 * cos;
  if (!(faktor > 0)) return Infinity;
  return (auslastung * Number(bemessungPa)) / 1000 / faktor;
}

/** Grenzwerte aller Modulklassen für eine Dachsituation (für Tabellen). */
export function modulGrenzen(neigung = 30, schneefang = false) {
  return MODULKLASSEN.map((k) => ({
    ...k,
    reserveBis: skGrenze(k.bemessung, neigung, schneefang, RESERVE_GRENZE),
    knappBis: skGrenze(k.bemessung, neigung, schneefang, 1),
  }));
}

const EINORDNUNG = {
  "2400": {
    stufe: "standard",
    titel: "Standardmodule rechnerisch mit Reserve",
    kurz: "Standardmodul",
    text: "Bei üblicher Dachneigung reicht rechnerisch ein Modul mit 2400 Pa Prüflast. Die Unterkonstruktion wird trotzdem nach Herstellerstatik für diesen Wert ausgelegt.",
  },
  "5400": {
    stufe: "erhoeht",
    titel: "Schneelastmodule sinnvoll",
    kurz: "Schneelastmodul",
    text: "Standardmodule mit 2400 Pa Prüflast sind rechnerisch zu knapp. Sinnvoll sind Module mit 5400 Pa Prüflast und eine Unterkonstruktion mit engeren Befestigungsabständen.",
  },
  "8100": {
    stufe: "hoch",
    titel: "Hochlastmodule und Einzelnachweis",
    kurz: "Hochlastmodul",
    text: "Erst Module mit 8100 Pa Prüflast haben rechnerisch Reserve. Solche Lagen brauchen eine Hochlast-Unterkonstruktion und einen statischen Einzelnachweis.",
  },
  sonder: {
    stufe: "sonder",
    titel: "Sonderlösung nötig",
    kurz: "Sonderlösung",
    text: "Selbst Hochlastmodule reichen rechnerisch nicht. Nötig sind eine steilere Neigung, zusätzliche Modulauflager oder andere Sonderlösungen – immer mit Statik.",
  },
};

/**
 * Einordnung eines Richtwerts für ein Referenzdach (Standard: 30° Neigung, ohne Schneefang).
 * Nutzt bewerteSchnee() des Standort-Checks. Rückgabe null bei ungültigem Wert.
 */
export function einordnung(sk, { neigung = 30, schneefang = false } = {}) {
  const b = bewerteSchnee({ sk, neigung, schneefang });
  if (!b) return null;
  const knapp = !b.empfohlen || b.empfohlen.status !== "reserve";
  const key = b.empfohlen ? b.empfohlen.id : "sonder";
  return { ...EINORDNUNG[key], klasse: b.empfohlen, knapp, bewertung: b };
}

/* ------------------------------------------------------------------ Tabellenwerte */

/** Kennzahlen einer Liste von Richtwerten (Einträge mit sk = null werden ignoriert). */
export function spanne(eintraege) {
  const mit = (eintraege || []).filter((e) => Number.isFinite(e?.sk));
  if (mit.length === 0) return null;
  const sortiert = [...mit].sort((a, b) => a.sk - b.sk);
  const mitte = Math.floor(sortiert.length / 2);
  const median = sortiert.length % 2 ? sortiert[mitte].sk : (sortiert[mitte - 1].sk + sortiert[mitte].sk) / 2;
  return { min: sortiert[0], max: sortiert[sortiert.length - 1], median: Math.round(median * 10) / 10, anzahl: mit.length };
}
