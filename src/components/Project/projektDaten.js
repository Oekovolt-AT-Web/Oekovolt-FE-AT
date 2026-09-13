// Aufbereitung der Projektdaten aus dem Backoffice (doctype "Projekte").
// Reine Funktionen – nutzbar in Server- und Client-Komponenten.
// Es wird nichts erfunden: Kategorien und Kennzahlen werden ausschließlich
// aus den Feldern title, leistung, jahr, typ, ort und bild_anhagen abgeleitet.

import { generateSlug } from "@/lib/slugify";

export const FALLBACK_BILD = "/Images/Referenzen/Projekte-1.jpg";

export const bildUrl = (pfad, fallback = FALLBACK_BILD) => (pfad ? `/api/image?path=${pfad}` : fallback);

/** "314,505 kWp" -> 314.505 */
export function parseKwp(leistung) {
  if (leistung == null) return null;
  if (typeof leistung === "number") return leistung;
  const roh = String(leistung).replace(/kwp/i, "").trim();
  // Tausenderpunkte entfernen, Dezimalkomma in Punkt wandeln
  const zahl = Number(roh.replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  return Number.isFinite(zahl) && zahl > 0 ? zahl : null;
}

export function fmtKwp(kwp, stellen) {
  if (kwp == null) return "";
  const d = stellen ?? (kwp >= 100 ? 0 : 1);
  return kwp.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function fmtZahl(n, stellen = 0) {
  return Number(n || 0).toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
}

/** Objektart aus dem Freitextfeld "typ" */
export function segmentVon(typ = "") {
  const t = typ.toLowerCase();
  if (t.includes("landwirtschaft")) return "Landwirtschaft";
  if (t.includes("gewerbe")) return "Gewerbe";
  if (t.includes("privat") || t.includes("einfamilienhaus")) return "Einfamilienhaus";
  return null;
}

/** Dach-/Montageart aus dem Freitextfeld "typ" (mehrere möglich) */
export function dachartenVon(typ = "") {
  const t = typ.toLowerCase();
  const arten = [];
  if (t.includes("flachdach") || t.includes("flachach")) arten.push("Flachdach");
  if (t.includes("ziegel") || t.includes("satteldach")) arten.push("Ziegel-/Satteldach");
  if (t.includes("trapez") || t.includes("blech") || t.includes("sandwich")) arten.push("Trapez-/Blechdach");
  if (t.includes("fassade")) arten.push("Fassade");
  return arten;
}

export function groessenklasse(kwp) {
  if (kwp == null) return null;
  if (kwp <= 15) return "bis 15 kWp";
  if (kwp <= 50) return "15–50 kWp";
  return "über 50 kWp";
}

export const GROESSEN = ["bis 15 kWp", "15–50 kWp", "über 50 kWp"];

/** Ort: Feld "ort", sonst aus dem Titel ("Bad Wörishofen 3" -> "Bad Wörishofen") */
export function ortVon(p) {
  if (p?.ort) return String(p.ort).trim();
  const titel = String(p?.title || p?.name || "");
  return titel
    .replace(/\(.*?\)/g, "")
    .split(/\s[–-]\s/)[0]
    .replace(/\b(Einfamilienhaus|Gewerbe|Flachdach|Ziegeldach|Satteldach|Trapezblech|Ost\/West)\b.*$/i, "")
    .replace(/\s+\d+$/, "")
    .trim();
}

const OESTERREICH = ["salzburg", "vorarlberg", "innsbruck", "lustenau", "lochau", "wallgau-at"];
export function landVon(ort = "") {
  return OESTERREICH.includes(ort.toLowerCase()) ? "Österreich" : "Deutschland";
}

export function bilderVon(p) {
  const gesehen = new Set();
  return (p?.bild_anhagen || [])
    .map((b) => b?.bild_anhagen)
    .filter((pfad) => pfad && !gesehen.has(pfad) && gesehen.add(pfad));
}

/** Einheitliches Projektobjekt für alle Ansichten */
export function normalisiereProjekt(p) {
  const titel = p?.title || p?.name || "";
  const kwp = parseKwp(p?.leistung);
  const typ = p?.typ ? String(p.typ).replace(/Flachach/g, "Flachdach").trim() : "";
  const bilder = bilderVon(p);
  const ort = ortVon(p);
  return {
    slug: generateSlug(titel),
    titel,
    kwp,
    leistungText: kwp != null ? `${fmtKwp(kwp, kwp % 1 === 0 ? 0 : undefined)} kWp` : p?.leistung || "",
    jahr: p?.jahr ? Number(p.jahr) : null,
    typ,
    typTeile: typ ? typ.split("/").map((s) => s.trim()).filter(Boolean) : [],
    ort,
    land: landVon(ort),
    segment: segmentVon(typ),
    dacharten: dachartenVon(typ),
    groesse: groessenklasse(kwp),
    bilder,
    bild: bildUrl(bilder[0]),
    modified: p?.modified || null,
  };
}

/**
 * Kennzahlen über eine Projektliste. Doppelt gepflegte Einträge (gleicher Ort,
 * gleiche Leistung, gleiches Jahr) zählen für die Leistungssumme nur einmal.
 */
export function kennzahlen(projekte) {
  const eindeutig = new Map();
  for (const p of projekte) {
    if (p.kwp == null) continue;
    eindeutig.set(`${p.ort}|${p.kwp}|${p.jahr}`, p);
  }
  const summeKwp = [...eindeutig.values()].reduce((s, p) => s + p.kwp, 0);
  const jahre = projekte.map((p) => p.jahr).filter(Boolean);
  const mitKwp = projekte.filter((p) => p.kwp != null);
  const groesste = mitKwp.reduce((a, b) => (!a || b.kwp > a.kwp ? b : a), null);
  const kleinste = mitKwp.reduce((a, b) => (!a || b.kwp < a.kwp ? b : a), null);
  const orte = new Set(projekte.map((p) => p.ort).filter(Boolean));
  return {
    anzahl: projekte.length,
    summeKwp,
    groesste,
    kleinste,
    orte: orte.size,
    ersteJahr: jahre.length ? Math.min(...jahre) : null,
    letzteJahr: jahre.length ? Math.max(...jahre) : null,
  };
}

/** Zählt Werte (auch Arrays) und sortiert absteigend */
export function zaehle(projekte, feld) {
  const m = new Map();
  for (const p of projekte) {
    const werte = Array.isArray(p[feld]) ? p[feld] : [p[feld]];
    for (const w of werte) if (w) m.set(w, (m.get(w) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

/** Überschlägiger Jahresertrag – Orientierung Süddeutschland */
export const ERTRAG_JE_KWP = 1000; // kWh je kWp und Jahr (Allgäu/Oberschwaben, gute Ausrichtung ~950–1.150)
export const HAUSHALT_KWH = 4000; // Jahresverbrauch eines 3–4-Personen-Haushalts
