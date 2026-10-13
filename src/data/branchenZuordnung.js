// src/data/branchenZuordnung.js
//
// Zuordnung Projekt-Slug → Zielgruppe für die Branchen-Referenzen (Welle A, Paket A03).
//
// Die Zuordnung wird NICHT von Hand gepflegt, sondern ausschließlich abgeleitet aus
//   1. KUNDEN[slug].branche (src/data/kunden.js – Branche laut Website des Kunden) und
//   2. REFERENZ_KUNDEN (src/data/hero.js – Branchenliste der Startseite, nur für Slugs ohne
//      Eintrag in kunden.js; z. B. fs-agrar-gmbh).
// Die Regeln unten sind Wortlisten je Zielgruppe; die erste Regel, die auf den Branchentext passt,
// gewinnt. Was keine Regel trifft oder in UNKLAR steht, wird nicht zugeordnet – nichts wird geraten.
//
// Zielgruppen ohne belegtes Projekt bleiben leer: „gemeinde“ (kein Gemeindeprojekt belegt) und
// „freiflaeche“ (keine Freiflächenanlage in der Referenzliste). Sie werden erst gefüllt, wenn ein
// Projekt mit entsprechender Branche in kunden.js steht.
//
// Kundennamen: Ohne freigabe.name === true (Schema aus A07) zeigen die Branchen-Referenzen keinen
// Firmennamen, sondern Branche und Ort – siehe NAMEN_OHNE_FREIGABE (Entscheidung des Inhabers offen).

import { KUNDEN } from "./kunden.js";
// REFERENZ_KUNDEN trägt den Slug immer; REFERENZ_UNTERNEHMEN (öffentliche Sicht) nur mit Namensfreigabe.
import { REFERENZ_KUNDEN } from "./hero.js";

const REFERENZ_UNTERNEHMEN = REFERENZ_KUNDEN;

export const ZIELGRUPPEN_IDS = ["industrie", "handel-logistik", "autohaus", "tourismus", "lebensmittel-agrar", "gemeinde", "freiflaeche"];

/** Lesbare Bezeichnung je Zielgruppe (für Überschriften und Tests). */
export const ZIELGRUPPEN_LABEL = {
  industrie: "Industrie und produzierendes Gewerbe",
  "handel-logistik": "Handel und Logistik",
  autohaus: "Autohäuser",
  tourismus: "Hotellerie und Tourismus",
  "lebensmittel-agrar": "Lebensmittel und Landtechnik",
  gemeinde: "Gemeinden",
  freiflaeche: "Freiflächenanlagen",
};

/**
 * Darf der Firmenname ohne freigabe.name gezeigt werden? Standard: nein (Hinweis Orchestrator
 * 11.10.2026: Kundennamen ohne Freigabe ausblenden, Entscheidung des Inhabers steht aus).
 */
export const NAMEN_OHNE_FREIGABE = false;

/**
 * Slugs, deren Branche keine eindeutige Zielgruppe ergibt – bewusst nicht zugeordnet.
 * fuschl-am-see-betriebs-gmbh: „Seebad und Gastronomie“ – Gemeindebetrieb oder Tourismus? Klärung offen (Notiz A03).
 */
export const UNKLAR = ["fuschl-am-see-betriebs-gmbh"];

/**
 * Regeln: Wortliste je Zielgruppe, Reihenfolge = Vorrang. Geprüft wird gegen
 * KUNDEN[slug].branche (Kleinschreibung). Beispiele je Regel im Kommentar.
 */
export const REGELN = [
  // „Autohaus und Werkstätte (Ford-Partner)“ – vier Ford-Autohäuser
  { zielgruppe: "autohaus", woerter: ["autohaus"] },
  // „Hotellerie“ (Sporthotel Brixen), „Campingplatz“ (Campingwelt Brixen)
  { zielgruppe: "tourismus", woerter: ["hotellerie", "hotel", "campingplatz"] },
  // „Käserei (Heumilchkäse)“, „Fleischhandel“, „Lebensmittelgroßhandel …“, „Gemeinschaftsverpflegung …“, „Landtechnik …“
  { zielgruppe: "lebensmittel-agrar", woerter: ["lebensmittel", "fleisch", "käserei", "gemeinschaftsverpflegung", "landtechnik", "landwirtschaft"] },
  // „Pharmagroßhandel“, „Fachhandel für Handwerk und Industrie“, „Spedition und Logistik“, „Baumärkte und Baustoffhandel“
  { zielgruppe: "handel-logistik", woerter: ["handel", "spedition", "logistik", "baumärkte"] },
  // produzierende Betriebe: Verpackungen, Metall, Holz, Dämmstoffe, Kunststoff, Maschinenbau, Baustoffe …
  {
    zielgruppe: "industrie",
    woerter: [
      "industrie", "verpackung", "technik", "maschinen", "stahl", "metall", "holz", "säge", "beton", "dämmstoff", "kunststoff",
      "baustoffe", "granulat", "naturstein", "keramik", "aluminium", "präzision", "parkett", "fenster", "galvano", "chemikalien",
      "glas", "feuerfest", "innenausstattung", "karten", "papiermaschinen", "zerspanung", "pellets",
    ],
  },
];

/** Branchenbezeichnung der Startseitenliste (hero.js) → Zielgruppe. */
const HERO_BRANCHE = {
  industrie: "industrie",
  holz: "industrie",
  handel: "handel-logistik",
  logistik: "handel-logistik",
  tourismus: "tourismus",
  landwirtschaft: "lebensmittel-agrar",
};

/** Zielgruppe aus einem Branchentext (kunden.js) – null, wenn keine Regel passt. */
export function zielgruppeAusBranche(branche) {
  const text = String(branche || "").toLowerCase();
  if (!text) return null;
  const regel = REGELN.find((r) => r.woerter.some((w) => text.includes(w)));
  return regel ? regel.zielgruppe : null;
}

function ableiten() {
  const map = {};
  for (const [slug, kunde] of Object.entries(KUNDEN)) {
    if (UNKLAR.includes(slug)) continue;
    const zg = zielgruppeAusBranche(kunde?.branche);
    if (zg) map[slug] = zg;
  }
  for (const r of REFERENZ_UNTERNEHMEN) {
    if (!r?.slug || map[r.slug] || UNKLAR.includes(r.slug)) continue;
    const zg = HERO_BRANCHE[String(r.branche || "").toLowerCase()];
    if (zg) map[r.slug] = zg;
  }
  return map;
}

/** Projekt-Slug → Zielgruppe (nur abgeleitete, belegte Einträge). */
export const BRANCHEN_ZUORDNUNG = ableiten();

/**
 * Branche ohne Klammerzusatz: „Autohaus und Werkstätte (Ford-Partner)“ → „Autohaus und Werkstätte“.
 * Eigene Fassung, weil brancheKurz in src/components/Project/projektDaten.js (Regex /s*(.*?)/g)
 * jedes „s“ entfernt (Übergabe in der Notiz A03).
 */
export const brancheOhneKlammer = (branche) =>
  String(branche || "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Neutrale Bezeichnung eines Projekts ohne Namensfreigabe: Branche aus kunden.js, sonst die
 * anonyme Bezeichnung der Startseitenliste (hero.js), sonst das Zielgruppen-Label.
 */
export function anonymeBezeichnung(slug) {
  const branche = brancheOhneKlammer(KUNDEN[slug]?.branche);
  if (branche) return branche;
  const r = REFERENZ_UNTERNEHMEN.find((x) => x.slug === slug);
  if (r?.anonym) return String(r.anonym).trim();
  const zg = BRANCHEN_ZUORDNUNG[slug];
  return (zg && ZIELGRUPPEN_LABEL[zg]) || "Referenzprojekt";
}

// ── Vergröberung ohne Namensfreigabe ─────────────────────────────────────────────────────────
// Branche + genauer Ort + exakte kWp machen einen Betrieb auch ohne Namen wiedererkennbar
// (QA Welle A). Ohne freigabe.name zeigen die Karten deshalb nur das Bundesland und eine
// gerundete Leistung. Ob auch das reicht, entscheidet der Inhaber (Notiz A03).

export const BUNDESLAENDER = ["Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien"];

/** „Hard, Vorarlberg“ → „Vorarlberg“; erstes genanntes Bundesland, sonst „Österreich“ (leer bleibt leer). */
export function regionOhneFreigabe(ort) {
  const text = String(ort || "").trim();
  if (!text) return "";
  let treffer = null;
  for (const land of BUNDESLAENDER) {
    const i = text.indexOf(land);
    if (i >= 0 && (treffer == null || i < treffer.i)) treffer = { land, i };
  }
  return treffer ? treffer.land : "Österreich";
}

/**
 * Gerundete Leistung ohne Namensfreigabe: ab 1 MWp auf 0,5 MWp („rund 2 MWp“), ab 100 kWp auf
 * 50 kWp, darunter auf 10 kWp („rund 80 kWp“). null/ungültig → "".
 */
export function leistungOhneFreigabe(kwp) {
  const n = Number(kwp);
  if (kwp == null || !Number.isFinite(n) || n <= 0) return "";
  if (n >= 975) {
    const mwp = Math.round(n / 500) / 2;
    return `rund ${String(mwp).replace(".", ",")}\u00a0MWp`;
  }
  const schritt = n >= 100 ? 50 : 10;
  const gerundet = Math.max(schritt, Math.round(n / schritt) * schritt);
  return `rund ${gerundet}\u00a0kWp`;
}

/** Zielgruppe eines Projekt-Slugs oder null. */
export const zielgruppeVon = (slug) => BRANCHEN_ZUORDNUNG[slug] || null;

/** Alle Slugs einer Zielgruppe (Reihenfolge wie in kunden.js bzw. hero.js). */
export const slugsFuerZielgruppe = (zielgruppe) => Object.keys(BRANCHEN_ZUORDNUNG).filter((s) => BRANCHEN_ZUORDNUNG[s] === zielgruppe);
