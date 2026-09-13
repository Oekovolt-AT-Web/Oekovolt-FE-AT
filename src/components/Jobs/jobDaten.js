// Aufbereitung der Stellenanzeigen (doctype "Jobs") – nutzbar in Server- und Client-Komponenten.
import { generateJobSlug } from "@/lib/slugify";
import { STELLEN, STELLEN_DATUM } from "@/data/stellen";

const ANSTELLUNG = {
  FULL_TIME: "Vollzeit",
  PART_TIME: "Teilzeit",
  CONTRACTOR: "Freiberuflich",
  TEMPORARY: "Befristet",
  INTERN: "Praktikum",
  VOLUNTEER: "Ehrenamt",
  PER_DIEM: "Tageweise",
  OTHER: "Sonstiges",
};

// Rückrichtung für JobPosting-Schema
const SCHEMA_TYP = {
  vollzeit: "FULL_TIME",
  teilzeit: "PART_TIME",
  minijob: "PART_TIME",
  werkstudent: "PART_TIME",
  praktikum: "INTERN",
  ausbildung: "OTHER",
  befristet: "TEMPORARY",
  freiberuflich: "CONTRACTOR",
};

export function anstellungLabel(wert) {
  if (!wert) return "";
  return ANSTELLUNG[String(wert).toUpperCase()] || String(wert);
}

export function anstellungSchema(wert) {
  if (!wert) return "FULL_TIME";
  const w = String(wert);
  if (ANSTELLUNG[w.toUpperCase()]) return w.toUpperCase();
  return SCHEMA_TYP[w.toLowerCase()] || "FULL_TIME";
}

const liste = (feld) =>
  Array.isArray(feld)
    ? feld.map((x) => (typeof x === "string" ? x : x?.beschreibung || x?.option || x?.vorteil || "")).filter(Boolean)
    : typeof feld === "string" && feld.trim()
      ? [feld.trim()]
      : [];

export function normalisiereJob(job) {
  const titel = job?.title || job?.name || "";
  return {
    slug: generateJobSlug(job?.name || job?.title),
    titel,
    ort: job?.ort || "Türkheim",
    gehalt: job?.gehalt || "",
    anstellung: anstellungLabel(job?.employment_type || job?.anstellungsart),
    anstellungSchema: anstellungSchema(job?.employment_type || job?.anstellungsart),
    datum: job?.posted || job?.creation || null,
    beschreibung: job?.beschreibung || job?.description || "",
    firma: job?.firmen_beschreibung || "",
    aufgaben: liste(job?.deine_aufgaben),
    qualifikationen: liste(job?.deine_qualifikationen),
    vorteile: liste(job?.deine_vorteile).length ? liste(job?.deine_vorteile) : liste(job?.vorteile),
    modified: job?.modified || null,
  };
}

/** Ganzjährige Stellen aus src/data/stellen.js im normalisierten Format. */
export function stellenAusDaten() {
  return STELLEN.map((s) => ({
    slug: s.slug,
    titel: s.titel,
    kurz: s.kurz,
    bereich: s.bereich,
    ort: s.ort,
    arbeitsort: s.arbeitsort,
    gehalt: s.gehalt || "",
    anstellung: s.anstellung,
    anstellungSchema: s.anstellungSchema,
    datum: STELLEN_DATUM,
    beschreibung: s.beschreibung,
    firma: "",
    aufgaben: s.aufgaben,
    qualifikationen: s.qualifikationen,
    vorteile: s.vorteile,
    bildung: s.bildung,
    erfahrungMonate: s.erfahrungMonate,
    skills: s.skills,
    modified: STELLEN_DATUM,
    ganzjaehrig: true,
  }));
}

/** Backoffice-Stellen + ganzjährige Stellen; bei gleichem Slug gewinnt das Backoffice. */
export function alleStellen(apiJobs = []) {
  const api = apiJobs.map(normalisiereJob).filter((j) => j.slug);
  const slugs = new Set(api.map((j) => j.slug));
  return [...api, ...stellenAusDaten().filter((s) => !slugs.has(s.slug))];
}

export const fmtDatum = (d) => (d ? new Date(String(d).replace(" ", "T")).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }) : "");

export const BEWERBUNG_MAIL = "office@oekovolt.de";
export const bewerbungsLink = (titel) =>
  `mailto:${BEWERBUNG_MAIL}?subject=${encodeURIComponent(titel ? `Bewerbung: ${titel}` : "Initiativbewerbung")}`;
