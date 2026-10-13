"use client";

// src/components/GewerbeUnikat/_steckbrief.js
//
// Projektsteckbrief der Unikat-Seite /gewerbe: EIN gemeinsamer Zustand für alle Kapitel. Jede Entscheidung,
// die der Besucher beim Ausprobieren trifft (Dachart, kWp, Netzbereich, Deckel …), landet hier und füllt am
// Ende die Anfrage vor (K8) – ohne personenbezogene Daten.
//
// Speicher: nur Komfort. sessionStorage (in try/catch) und der URL-Parameter-Satz (Rückkehr über den
// Bestätigungslink des Lead-Gates bzw. geteilte Links). Fällt beides aus, gilt der Startzustand.
// Kein localStorage, keine Cookies, keine Übertragung an den Server (außer als Query der Anfrage-Links).
//
// Benutzung in Kapiteln:
//   const sb = useSteckbrief();                       // ganzer Zustand (Re-Render bei jeder Änderung)
//   const kwp = useSteckbrief((s) => s.kwp);          // nur ein Feld
//   steckbrief.setze({ kwp: 320, evQuote: 0.78 }, "k3");  // Werte setzen + Kapitel als Baustein zählen
//   steckbrief.erkenntnis("k5-sonne-schlaeft");      // Erkenntnis sammeln (Liste in K8)
//   anfrageUrl(sb) · rechnerUrl(sb) · steckbriefQuery(sb)

import { useSyncExternalStore } from "react";
import { angebotUrl } from "@/lib/rechner/angebot";

const SCHLUESSEL = "ov-gewerbe-steckbrief";

/** Startzustand = Seitenbeispiel bzw. synthetischer Beispielbetrieb. null = „noch nicht festgelegt“. */
export const STECKBRIEF_START = Object.freeze({
  rolle: null, // "gf" | "cfo" | "technik"
  quelle: "beispiel", // "beispiel" | "eigen" (eigener Lastgang nach Gate)
  jahresverbrauchKwh: 884000, // synthetischer Beispielbetrieb (gerundet); eigener Lastgang überschreibt
  schichten: 2,
  // K2 Hallendach
  dachart: "ost-west",
  laengeM: 100,
  breiteM: 60,
  flaecheQm: 6000,
  kwpMax: null,
  ortId: "linz", // Schlüssel aus src/data/regionen-pvgis.json
  // K3 Anlagengröße
  kwp: null, // null → Kapitel nutzen ihren Startwert (K3: Empfehlung aus dem Lastgang, K7: 300 kWp)
  evQuote: null,
  autarkie: null,
  flotte: 0, // E-Transporter, die mittags laden
  // K4 kWh-Wert
  bereich: "ooe", // id aus NETZBEREICHE (src/lib/rechner/peakshaving.js)
  ne: 6,
  energieCt: 11,
  vermiedenCt: null,
  // K5 Leistungspreis
  schwelleKw: null,
  speicherKw: null,
  speicherKwh: null,
  lpErsparnisEuro: null,
  // K6 Netzanschluss
  wrKva: null,
  acSummeKw: null,
  torTyp: null,
  // K7 Wirtschaftlichkeit
  amortisationJahre: null,
  ueberschussJahr: null,
  // K8 Fahrplan
  montagefenster: null, // "schicht" | "wochenende" | "betriebsurlaub"
  // Sammlungen
  erkenntnisse: [], // Kennungen der aufgedeckten Erkenntnisse
  bausteine: [], // Kapitel-Ids, in denen der Besucher etwas übernommen hat
});

// Kurzschlüssel für URL-Query (nur Zahlen/Kennungen, keine personenbezogenen Daten)
const URL_FELDER = [
  ["r", "rolle", "text"],
  ["d", "dachart", "text"],
  ["f", "flaecheQm", "zahl"],
  ["o", "ortId", "text"],
  ["k", "kwp", "zahl"],
  ["fl", "flotte", "zahl"],
  ["b", "bereich", "text"],
  ["ne", "ne", "zahl"],
  ["ap", "energieCt", "zahl"],
  ["s", "schwelleKw", "zahl"],
  ["sp", "speicherKwh", "zahl"],
  ["mf", "montagefenster", "text"],
];
const TEXT_ERLAUBT = /^[a-z0-9-]{1,32}$/;

let zustand = STECKBRIEF_START;
let geladen = false;
const hoerer = new Set();

function melden() {
  for (const h of hoerer) h();
}

function speichern() {
  try {
    window.sessionStorage.setItem(SCHLUESSEL, JSON.stringify(zustand));
  } catch {
    // privates Fenster / gesperrt – Steckbrief gilt dann nur bis zum Neuladen
  }
}

function bereinigen(roh) {
  if (!roh || typeof roh !== "object") return {};
  const out = {};
  for (const [k, v] of Object.entries(roh)) {
    if (!(k in STECKBRIEF_START)) continue;
    if (Array.isArray(STECKBRIEF_START[k])) {
      if (Array.isArray(v)) out[k] = v.filter((x) => typeof x === "string" && TEXT_ERLAUBT.test(x)).slice(0, 40);
    } else {
      const ok = v === null || (typeof v === "number" && Number.isFinite(v)) || (typeof v === "string" && TEXT_ERLAUBT.test(v));
      if (ok) out[k] = v;
    }
  }
  return out;
}

function ausUrl() {
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.get("sb") !== "1") return {};
    const out = {};
    for (const [kurz, feld, typ] of URL_FELDER) {
      const v = q.get(kurz);
      if (v == null || v === "") continue;
      if (typ === "zahl") {
        const n = Number(v);
        if (Number.isFinite(n) && n >= 0 && n < 1e8) out[feld] = n;
      } else if (TEXT_ERLAUBT.test(v)) out[feld] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function laden() {
  if (geladen || typeof window === "undefined") return;
  geladen = true;
  let gespeichert = {};
  try {
    gespeichert = bereinigen(JSON.parse(window.sessionStorage.getItem(SCHLUESSEL) || "null"));
  } catch {
    gespeichert = {};
  }
  const url = ausUrl();
  if (Object.keys(gespeichert).length || Object.keys(url).length) {
    zustand = { ...STECKBRIEF_START, ...gespeichert, ...url };
    // nach dem Hydrieren melden (nicht während des Renderns)
    queueMicrotask(melden);
  }
}

function abonnieren(cb) {
  hoerer.add(cb);
  laden();
  return () => hoerer.delete(cb);
}
const lesen = () => zustand;
const lesenServer = () => STECKBRIEF_START;

/** Zustand lesen. Mit selector nur ein Ausschnitt (Rückgabe muss stabil sein: Feld, keine neuen Objekte). */
export function useSteckbrief(selector) {
  const s = useSyncExternalStore(abonnieren, lesen, lesenServer);
  return selector ? selector(s) : s;
}

/** Schreib-Schnittstelle – aus Ereignis-Handlern aufrufen, nie während des Renderns. */
export const steckbrief = {
  /** Felder setzen; kapitel (z. B. "k3") zählt als übernommener Baustein. */
  setze(teil, kapitel) {
    const sauber = bereinigen(teil);
    let bausteine = zustand.bausteine;
    if (kapitel && TEXT_ERLAUBT.test(kapitel) && !bausteine.includes(kapitel)) bausteine = [...bausteine, kapitel];
    zustand = { ...zustand, ...sauber, bausteine };
    speichern();
    melden();
  },
  /** Erkenntnis sammeln (einmalig je Kennung). */
  erkenntnis(id) {
    if (!TEXT_ERLAUBT.test(id) || zustand.erkenntnisse.includes(id)) return;
    zustand = { ...zustand, erkenntnisse: [...zustand.erkenntnisse, id] };
    speichern();
    melden();
  },
  /** Alles zurück auf den Start (Knopf „Steckbrief leeren“ in K8). */
  zuruecksetzen() {
    zustand = STECKBRIEF_START;
    speichern();
    melden();
  },
  lesen,
};

// ---------------------------------------------------------------------------------------------------
// Links mit den Steckbrief-Werten
// ---------------------------------------------------------------------------------------------------

/** Query (ohne „?“) mit sb=1 und allen gesetzten Feldern – für RechnerTeilen (Rückkehr) und Teilen. */
export function steckbriefQuery(s = zustand) {
  const q = new URLSearchParams({ sb: "1" });
  for (const [kurz, feld] of URL_FELDER) {
    const v = s[feld];
    if (v == null || v === "" || v === STECKBRIEF_START[feld]) continue;
    q.set(kurz, typeof v === "number" ? String(Math.round(v * 100) / 100) : v);
  }
  return q.toString();
}

/** Anfrage im Angebots-Konfigurator mit kWp, Verbrauch und Speicher (src/lib/rechner/angebot.js). */
export function anfrageUrl(s = zustand) {
  return angebotUrl({
    objekt: "gewerbe",
    kwp: s.kwp || undefined,
    verbrauch: s.jahresverbrauchKwh || undefined,
    speicher: s.speicherKwh || undefined,
  });
}

/** Gewerbe-PV-Rechner mit den Parametern, die er bereits liest (flaeche, verbrauch in MWh, schichten, dachart, ort). */
export function rechnerUrl(s = zustand) {
  const q = new URLSearchParams();
  if (s.flaecheQm) q.set("flaeche", String(Math.round(s.flaecheQm)));
  if (s.jahresverbrauchKwh) q.set("verbrauch", String(Math.round(s.jahresverbrauchKwh / 1000)));
  if (s.schichten) q.set("schichten", String(s.schichten));
  if (s.dachart) q.set("dachart", s.dachart);
  if (s.ortId) q.set("ort", s.ortId);
  return `/rechner/gewerbe-pv?${q.toString()}`;
}

/** Anzahl übernommener Bausteine (für „4 von 7 Bausteinen“). */
export const bausteinZahl = (s = zustand) => s.bausteine.filter((k) => /^k[1-7]$/.test(k)).length;
export const BAUSTEINE_GESAMT = 7;
