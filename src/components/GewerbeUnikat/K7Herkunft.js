"use client";

// src/components/GewerbeUnikat/K7Herkunft.js
//
// K7 · Herkunft der Anlagengröße für den Chip „aus Kapitel 03“ und „Werte aus Kapitel 02–03 übernehmen“.
//
// Im Steckbrief teilen sich K3, K6, K7 (und die Eingabe in K8) das Feld `kwp`. Nach einer Eingabe im Pult
// stünde dort der eigene K7-Wert – der Chip zeigte dann „aus Kapitel 03: 300 kWp“ statt 280 (QA K7).
// K3 schreibt kWp IMMER zusammen mit Eigenverbrauch und Autarkie, und nur K3 schreibt diese beiden. Ändert
// sich das Paar, ist sb.kwp in diesem Moment der Wert aus Kapitel 03 – genau dann wird er gemerkt.
//
// Der Haken läuft in K7Insel ab dem Hydrieren (sieht also jede K3-Eingabe, auch lange bevor die Bühne lädt)
// und merkt sich den Wert für die Sitzung (sessionStorage, nur Komfort: nach dem Neuladen bleibt die Herkunft
// richtig, auch wenn K6/K7 das Feld inzwischen überschrieben haben). Fällt der Speicher aus, gilt der Wert ab
// der nächsten K3-Eingabe. null = Kapitel 03 wurde noch nicht bedient (K7 nimmt dann die Modell-Empfehlung).

import { useSteckbrief } from "./_steckbrief.js";

const MERK = "ov-gewerbe-k7-k3kwp";
/** undefined = noch nicht gelesen · null = nichts gemerkt · { sig, kwp } */
let merk;

function gemerkt() {
  if (merk !== undefined) return merk;
  merk = null;
  try {
    const m = JSON.parse(window.sessionStorage.getItem(MERK) || "null");
    if (m && typeof m.sig === "string" && Number.isFinite(m.kwp)) merk = { sig: m.sig, kwp: m.kwp };
  } catch {
    // privates Fenster / gesperrt
  }
  return merk;
}

/**
 * kWp aus Kapitel 03 oder null. Idempotent (gleicher Zustand → gleiches Ergebnis), deshalb als Selektor im
 * Rendern zulässig; gemerkt wird nur bei einer neuen K3-Signatur.
 */
export function k3KwpAus(s) {
  if (typeof window === "undefined") return null;
  if (!s.bausteine.includes("k3") || s.evQuote == null || !Number.isFinite(s.kwp)) return null;
  const sig = `${s.evQuote}|${s.autarkie}`;
  const m = gemerkt();
  if (m && m.sig === sig) return m.kwp;
  merk = { sig, kwp: s.kwp };
  try {
    window.sessionStorage.setItem(MERK, JSON.stringify(merk));
  } catch {
    // nur Komfort
  }
  return s.kwp;
}

/** Anlagengröße, die Kapitel 03 zuletzt gesetzt hat (null = noch keine). */
export function useK3Kwp() {
  return useSteckbrief(k3KwpAus);
}
