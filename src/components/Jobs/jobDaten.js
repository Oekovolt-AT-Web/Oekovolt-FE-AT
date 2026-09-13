// Aufbereitung der Stellenanzeigen (doctype "Jobs") – nutzbar in Server- und Client-Komponenten.
import { generateJobSlug } from "@/lib/slugify";

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

export const fmtDatum = (d) => (d ? new Date(String(d).replace(" ", "T")).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" }) : "");

export const BEWERBUNG_MAIL = "office@oekovolt.de";
export const bewerbungsLink = (titel) =>
  `mailto:${BEWERBUNG_MAIL}?subject=${encodeURIComponent(titel ? `Bewerbung: ${titel}` : "Initiativbewerbung")}`;
