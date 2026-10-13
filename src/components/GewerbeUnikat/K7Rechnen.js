// src/components/GewerbeUnikat/K7Rechnen.js
//
// K7 · Rechenkern des Pults (Rechenweg live) – REIN, ohne React: Server-Hülle (Startzustand im SSR) und
// Client-Bühne (K7Pult) rechnen mit denselben Funktionen, deshalb stimmen SSR-Tabelle und Live-Tabelle
// im Startzustand Zeichen für Zeichen überein.
//
//  - pultStart()        Annahmen des Rechenbeispiels (BEISPIEL aus ./_beispiel.js), IFB-Satz nach Datum
//  - pultRechnen()      rechenweg() mit Netz-Arbeitspreis und Netzverlust aus der Netztabelle (netzpreise)
//  - PRUEFUNGEN         Einwand-Prüfstand: was ein Einwand am Pult verstellt (Faktoren aus STRESSTEST)
//  - k7Kodieren/-Lesen  Pult-Zustand als Query-Parameter „k7“ (Rückkehr über das Lead-Gate, geteilte Links)
//
// Rundung wie die bisherige Beispieltabelle: €/Jahr auf 10 €, IFB-Wirkung auf 100 €, Jahre auf 0,1.

import { preisProKwp } from "@/data/solarrechner";
import { STRESSTEST } from "@/lib/rechner/gewerbepv";
import { BEISPIEL, rechenweg } from "./_beispiel.js";
import { zahl } from "./_tokens.js";

/** Reglergrenzen (Konzept K7). */
export const GRENZEN = {
  kwp: { min: 100, max: 1000, schritt: 5 },
  ertragKwhKwp: { min: 850, max: 1200, schritt: 5 },
  evQuote: { min: 0.4, max: 0.95, schritt: 0.01 },
  energieCt: { min: 6, max: 25, schritt: 0.1 },
  ueberschussCt: { min: 0, max: 12, schritt: 0.1 },
  investKwp: { min: 500, max: 1200, schritt: 10 },
  eagKwp: { min: 0, max: 120, schritt: 5 },
  warte: { min: 0, max: 24, schritt: 1 },
};

/** Elektrizitätsabgabe für Unternehmen 2026 (befristet) bzw. regulär, ct/kWh. */
export const ABGABE = { befristet: 0.82, regulaer: 1.5 };

/** Öko-IFB: Übergabe bis 31.12.2026 bzw. ab 2027. */
export const IFB_SATZ = { bis2026: BEISPIEL.ifbSatz, ab2027: BEISPIEL.ifbSatzDanach };

/** Startwerte des Stundenmodells – identisch mit STECKBRIEF_START in ./_steckbrief.js (Server darf es nicht importieren). */
export const MODELL_START = { dachart: "ost-west", ortId: "linz", verbrauchKwh: 884000, schichten: 2 };

const klemmen = (v, g) => Math.min(g.max, Math.max(g.min, v));
const r2 = (v) => Math.round(v * 100) / 100;

/** Annahmen des Rechenbeispiels; ifbAktiv = istIfbAktiv(jetzt) (nach 2026: 15 %). */
export function pultStart(ifbAktiv = true) {
  return {
    kwp: BEISPIEL.kwp,
    ertragKwhKwp: BEISPIEL.ertragKwhKwp,
    evQuote: BEISPIEL.evQuote,
    energieCt: BEISPIEL.energieCt,
    abgabeCt: BEISPIEL.abgabeCt,
    ueberschussCt: BEISPIEL.ueberschussCt,
    investKwp: BEISPIEL.investKwp,
    eagKwp: BEISPIEL.eagKwp,
    ifbSatz: ifbAktiv ? IFB_SATZ.bis2026 : IFB_SATZ.ab2027,
    bereich: BEISPIEL.bereich,
    ne: BEISPIEL.ne,
  };
}

/** Netz-Arbeitspreis und Netzverlust (ct/kWh) aus der Netztabelle der Hülle (netzpreise je Bereich/NE). */
export function netzWerte(netz, bereich, ne) {
  const b = netz?.[bereich];
  const n = b?.ne?.[ne];
  if (!n) return { ap: BEISPIEL.netzApCt, nv: BEISPIEL.netzverlustCt, label: "Oberösterreich", betreiber: "Netz Oberösterreich" };
  return { ap: n.ap, nv: n.nv, label: b.label, betreiber: b.betreiber };
}

/** Rechenweg mit den Pult-Annahmen (Netzwerte nur lesbar aus der Netztabelle). */
export function pultRechnen(p, netz) {
  const n = netzWerte(netz, p.bereich, p.ne);
  const r = rechenweg({
    kwp: p.kwp,
    ertragKwhKwp: p.ertragKwhKwp,
    evQuote: p.evQuote,
    energieCt: p.energieCt,
    netzApCt: n.ap,
    netzverlustCt: n.nv,
    abgabeCt: p.abgabeCt,
    ueberschussCt: p.ueberschussCt,
    investKwp: p.investKwp,
    eagKwp: p.eagKwp,
    ifbSatz: p.ifbSatz,
  });
  // Rechenfakt beim IFB-Segment: 22 % gegenüber 15 % – unabhängig davon, welcher Satz gewählt ist
  const fakt = rechenweg({ ...r.eingaben, ifbSatz: IFB_SATZ.bis2026, ifbSatzDanach: IFB_SATZ.ab2027 }).ifbDifferenz;
  return { ...r, netz: n, ifbFakt: fakt };
}

/** Richtwert Marktstatistik (€/kWp netto, schlüsselfertig) für eine Anlagengröße. */
export const richtwertInvest = (kwp) => Math.round(preisProKwp(kwp, "gewerbe"));

/** Felder des Pults, die von den Annahmen des Rechenbeispiels abweichen. */
export function abweichungen(p, start) {
  const out = new Set();
  for (const k of Object.keys(start)) {
    const a = p[k];
    const b = start[k];
    if (typeof a === "number" && typeof b === "number" ? Math.abs(a - b) > 1e-9 : a !== b) out.add(k);
  }
  // Netz zählt als ein Feld
  if (out.has("bereich") || out.has("ne")) out.add("netz");
  return out;
}

// ---------------------------------------------------------------------------------------------------
// Einwand-Prüfstand (Daten der Einwände aus src/data/einwaende.js – Texte reicht die Hülle herein)
// ---------------------------------------------------------------------------------------------------

const K = STRESSTEST.konservativ;

/** Reihenfolge der Chips und was ein Einwand am Pult verstellt. */
export const PRUEFUNGEN = [
  {
    id: "strompreise",
    chip: "Strompreise fallen wieder",
    felder: ["energieCt", "ueberschussCt"],
    was: `Energiepreis und Überschusserlös × ${zahl(K.strompreisFaktor, 1)} (−${zahl((1 - K.strompreisFaktor) * 100)} %, wie der konservative Fall im Stresstest)`,
    anwenden: (p) => ({ ...p, energieCt: r2(p.energieCt * K.strompreisFaktor), ueberschussCt: r2(p.ueberschussCt * K.strompreisFaktor) }),
  },
  {
    id: "foerderung-unsicher",
    chip: "Die Förderung ist unsicher",
    felder: ["eagKwp"],
    was: "EAG-Investitionszuschuss auf 0 € – gerechnet ganz ohne Förderzuschlag",
    anwenden: (p) => ({ ...p, eagKwp: 0 }),
  },
  {
    id: "zu-teuer",
    chip: "Zu teuer",
    felder: ["investKwp"],
    was: "Investition auf den Richtwert der Marktstatistik für diese Anlagengröße",
    anwenden: (p) => ({ ...p, investKwp: klemmen(richtwertInvest(p.kwp), GRENZEN.investKwp) }),
  },
  {
    id: "amortisation",
    chip: "Die Amortisation ist zu lang",
    felder: ["ertragKwhKwp"],
    was: `Spezifischer Ertrag × ${zahl(K.ertragFaktor, 1)} (−${zahl((1 - K.ertragFaktor) * 100)} %: schwächere Jahre, Verschmutzung, Ausfälle)`,
    anwenden: (p) => ({ ...p, ertragKwhKwp: klemmen(Math.round(p.ertragKwhKwp * K.ertragFaktor), GRENZEN.ertragKwhKwp) }),
  },
  {
    id: "technik-warten",
    chip: "Wir warten auf bessere Technik",
    felder: ["warte"],
    warte: 12,
    was: "Entscheidung zwölf Monate später – so viel Jahresüberschuss entgeht in dieser Zeit",
    anwenden: (p) => p,
  },
];

export const pruefung = (id) => PRUEFUNGEN.find((x) => x.id === id) || null;

// ---------------------------------------------------------------------------------------------------
// Formate (ohne Intl – Server und Browser identisch)
// ---------------------------------------------------------------------------------------------------

/** Euro auf 10 € gerundet („32.290“). */
export const euro10 = (n) => (Number.isFinite(n) ? zahl(Math.round(n / 10) * 10) : "–");
/** Euro auf 100 € gerundet („10.600“). */
export const euro100 = (n) => (Number.isFinite(n) ? zahl(Math.round(n / 100) * 100) : "–");
/** Jahre mit einer Stelle oder „> 25“. */
export const jahre1 = (n) => (n == null || !Number.isFinite(n) ? "–" : zahl(n, 1));
/** Tausend Euro für Achsen und Direktbeschriftung („857“). */
export const tsd = (n) => zahl(Math.round(n / 1000));
/** Prozent ganzzahlig aus Anteil. */
export const pz = (a) => zahl(a * 100);

/** Kurzform „OÖ · NE 6“ für Chips (Bereichs-Label gekürzt). */
const KURZ = { Oberösterreich: "OÖ", Niederösterreich: "NÖ", Steiermark: "Stmk.", Burgenland: "Bgld.", Vorarlberg: "Vbg.", Kärnten: "Ktn." };
export const netzKurz = (label, ne) => `${KURZ[label] || label} · NE ${ne}`;

// ---------------------------------------------------------------------------------------------------
// Pult-Zustand als Query „k7“ (nur Zahlen und eine Netzbereichs-Kennung, keine personenbezogenen Daten)
// ---------------------------------------------------------------------------------------------------

const K7_FELDER = ["kwp", "ertragKwhKwp", "evQuote", "energieCt", "abgabeCt", "ueberschussCt", "investKwp", "eagKwp", "ifbSatz"];

/** Pult → „300_1050_0.7_11_0.82_6_800_100_0.22_ooe_6_0“ */
export function k7Kodieren(p, warte = 0) {
  return [...K7_FELDER.map((k) => String(Math.round(p[k] * 1000) / 1000)), p.bereich, String(p.ne), String(warte)].join("_");
}

/**
 * Query „k7“ → { p, warte } oder null (streng geprüft: Grenzen, bekannte Netzbereiche, NE 5–7).
 * @param {string} text Wert des Parameters
 * @param {object} netz Netztabelle (Kennungen)
 */
export function k7Lesen(text, netz, start) {
  if (typeof text !== "string" || text.length > 120) return null;
  const teile = text.split("_");
  if (teile.length !== K7_FELDER.length + 3) return null;
  const p = { ...start };
  for (let i = 0; i < K7_FELDER.length; i++) {
    const k = K7_FELDER[i];
    const v = Number(teile[i]);
    if (!Number.isFinite(v)) return null;
    if (k === "abgabeCt") p[k] = Math.abs(v - ABGABE.regulaer) < 1e-6 ? ABGABE.regulaer : ABGABE.befristet;
    else if (k === "ifbSatz") p[k] = Math.abs(v - IFB_SATZ.ab2027) < 1e-6 ? IFB_SATZ.ab2027 : IFB_SATZ.bis2026;
    else p[k] = klemmen(v, GRENZEN[k]);
  }
  const bereich = teile[K7_FELDER.length];
  const ne = Number(teile[K7_FELDER.length + 1]);
  const warte = Number(teile[K7_FELDER.length + 2]);
  if (netz?.[bereich] && [5, 6, 7].includes(ne)) {
    p.bereich = bereich;
    p.ne = ne;
  }
  return { p, warte: Number.isFinite(warte) ? klemmen(Math.round(warte), GRENZEN.warte) : 0 };
}
