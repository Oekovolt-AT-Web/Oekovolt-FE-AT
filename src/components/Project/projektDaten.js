// Aufbereitung der Projektdaten aus dem Backoffice (doctype "Projekte").
// Reine Funktionen – nutzbar in Server- und Client-Komponenten.
// Es wird nichts erfunden: Kategorien und Kennzahlen werden ausschließlich
// aus den Feldern title, leistung, jahr, typ, ort und bild_anhagen abgeleitet.

import { generateSlug } from "@/lib/slugify";

export const FALLBACK_BILD = "/Images/Referenzen/Projekte-1.jpg";

// Frappe-Dateien laufen über den Bild-Proxy; lokale Bilder aus /public (/Images/…) direkt.
export const bildUrl = (pfad, fallback = FALLBACK_BILD) => (!pfad ? fallback : pfad.startsWith("/Images/") ? pfad : `/api/image?path=${pfad}`);

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

// Orte, die das Backoffice ohne Landangabe liefert. Österreichische Orte werden
// erkannt; für alle anderen bleibt das Land offen (null), statt es zu raten.
// Liefert die API ein Feld "land", hat es Vorrang (normalisiereApiProjekt).
const OESTERREICH = ["salzburg", "vorarlberg", "innsbruck", "lustenau", "lochau", "ostermiething", "wien", "linz", "graz", "klagenfurt", "bregenz", "eisenstadt", "st. pölten", "sankt pölten", "wels", "steyr", "braunau am inn", "ried im innkreis", "hallein"];
export function landVon(ort = "") {
  return OESTERREICH.includes(String(ort).toLowerCase()) ? "Österreich" : null;
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
 * URL-Slug eines Projekts der neuen API – aus dem Projektnamen („Mindelheim 2“ → „mindelheim-2“),
 * damit keine Kundennamen in der URL stehen. projekt_website_name („haydu-2“) nur als Rückfall.
 */
export const projektSlug = (p) => generateSlug(p?.projekt_name || "") || p?.projekt_website_name || "";

/**
 * Eintrag der Projekt-API (oekovolt_app.website_api.projekte.get_projekte) ->
 * gleiches Format wie normalisiereProjekt. Slug = projektSlug().
 */
export function normalisiereApiProjekt(p) {
  const basis = normalisiereProjekt(p);
  const bild = p?.bild_url ? encodeURI(p.bild_url) : basis.bild;
  return {
    ...basis,
    slug: projektSlug(p) || basis.slug,
    titel: p?.projekt_name || basis.titel,
    ort: p?.ort || basis.ort,
    land: p?.land || landVon(p?.ort || basis.ort) || basis.land,
    jahr: p?.jahr || basis.jahr,
    segment: p?.objekt || basis.segment,
    dacharten: p?.dach ? [p.dach] : basis.dacharten || [],
    kwp: Number(p?.leistung) || basis.kwp || null,
    leistungText: p?.leistung_label || basis.leistungText,
    bild,
    bilder: bild ? [bild] : basis.bilder || [],
    bildAlt: p?.bild_alt || basis.bildAlt,
  };
}

/**
 * Kennzahlen über eine Projektliste. Doppelt gepflegte Einträge (gleicher Ort – ohne Ort gleicher Slug –,
 * gleiche Leistung, gleiches Jahr) zählen für die Leistungssumme nur einmal.
 */
export function kennzahlen(projekte) {
  const eindeutig = new Map();
  for (const p of projekte) {
    if (p.kwp == null) continue;
    eindeutig.set(`${p.ort || p.slug}|${p.kwp}|${p.jahr}`, p);
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

// ---------------------------------------------------------------------------
// SEO der Projektseiten (M15): feste Daten, Title/Description mit Branche und Ort.
// Branche und Ort kommen nur aus belegten Feldern (Backoffice bzw. src/data/kunden.js);
// fehlen sie, fällt der Title auf Firma und Leistung zurück – nichts wird geraten.
// ---------------------------------------------------------------------------

/** "Tragwein, Oberösterreich (Firmensitz)" -> "Tragwein" */
export function ortKurz(ort = "") {
  return String(ort || "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .split(",")[0]
    .trim();
}

/** "2026-09-30 14:03:11.123" oder "2026-09-30" -> "2026-09-30"; sonst null (kein new Date()) */
export function isoDatum(wert) {
  const m = String(wert || "").match(/^\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
}

const TITEL_ENDE = " | Ökovolt";

/**
 * Title einer Projektseite, höchstens 60 Zeichen: der erste Kandidat, der passt.
 * Branche und Ort beschreiben das Unternehmen (Sitz bzw. Werk laut Quelle), deshalb neutral in Klammern.
 */
export function projektSeitenTitel({ titel, leistungText, branche, ort }) {
  const o = ortKurz(ort);
  const b = brancheKurz(branche);
  const l = String(leistungText || "").trim();
  const kandidaten = [
    l && b && o && `PV ${l}: ${titel} (${b}, ${o})`,
    b && o && `PV-Anlage ${titel} (${b}, ${o})`,
    l && b && `PV ${l}: ${titel} (${b})`,
    b && `PV-Anlage ${titel} (${b})`,
    l && o && `PV ${l}: ${titel}, ${o}`,
    o && `PV-Anlage ${titel}, ${o}`,
    l && `${titel}: ${l} Photovoltaik`,
    l && `${titel}: ${l} PV`,
    `PV-Anlage ${titel}`,
  ].filter(Boolean);
  const passend = kandidaten.find((k) => (k + TITEL_ENDE).length <= 60);
  if (passend) return passend + TITEL_ENDE;
  if ((titel + TITEL_ENDE).length <= 60) return titel + TITEL_ENDE;
  // Sehr lange Firmennamen an einer Wortgrenze kürzen, damit der Title nicht abgeschnitten wird
  const max = 60 - TITEL_ENDE.length - 1;
  const kurz = titel.slice(0, max);
  return `${kurz.slice(0, Math.max(kurz.lastIndexOf(" "), 1)).replace(/[,:;.–-]+$/, "").trim()}…${TITEL_ENDE}`;
}

/** Branche ohne Klammerzusätze: "Autohaus und Werkstätte (Ford-Partner)" -> "Autohaus und Werkstätte" */
export function brancheKurz(branche = "") {
  return String(branche || "")
    .replace(/s*(.*?)/g, "")
    .trim();
}

/**
 * Description einer Projektseite, höchstens 160 Zeichen: Zusatzsätze fallen weg, bevor gekürzt wird
 * (dann an einer Wortgrenze mit „…“).
 */
export function projektBeschreibung({ titel, leistungText, branche, ort, jahr, modul }) {
  const zusatz = [brancheKurz(branche), ortKurz(ort)].filter(Boolean).join(", ");
  const kern = `${titel}${zusatz ? ` (${zusatz})` : ""}: Photovoltaikanlage${leistungText ? ` mit ${leistungText}` : ""} von Ökovolt${jahr ? `, realisiert ${jahr}` : ""}.`;
  const varianten = [
    [kern, modul && `Module: ${modul}.`, "Bilder und Kennzahlen der Referenz."],
    [kern, "Bilder und Kennzahlen der Referenz."],
    [kern, modul && `Module: ${modul}.`],
    [kern],
  ].map((teile) => teile.filter(Boolean).join(" "));
  const passend = varianten.find((t) => t.length <= 160);
  if (passend) return passend;
  const kurz = kern.slice(0, 159);
  return `${kurz.slice(0, kurz.lastIndexOf(" ")).replace(/[,:;.–-]+$/, "")}…`;
}

/**
 * Überschlägiger Jahresertrag – Orientierung Österreich. PVGIS (EU JRC) liefert
 * für Süd 35° in den Landeshauptstädten 1.112–1.352 kWh je kWp; bei gemischter
 * Ausrichtung (Ost-West, Flachdach) liegt der Wert niedriger. Richtwert, kein Messwert.
 */
export const ERTRAG_JE_KWP = 1050; // kWh je kWp und Jahr
export const HAUSHALT_KWH = 3500; // Jahresverbrauch eines Mehrpersonenhaushalts in Österreich (Richtwert)
