// Aufbereitung der Stellenanzeigen – nutzbar in Server- und Client-Komponenten.
// Quelle: src/data/stellen.js (ganzjährige Stellen der Ökovolt Solartechnik GmbH)
// und optional Stellen aus dem Backoffice (doctype "Jobs").
import { generateJobSlug } from "@/lib/slugify";
import { KV, KV_STAND, STELLEN, STELLEN_DATUM } from "@/data/stellen";
import { FIRMA } from "@/lib/site";

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
  geringfuegig: "PART_TIME",
  praktikum: "INTERN",
  lehre: "OTHER",
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

/**
 * Euro-Betrag im österreichischen Format („3.415,01“). Bewusst ohne
 * toLocaleString: Node und Browser setzen für de-AT unterschiedliche
 * Tausendertrennzeichen – das würde bei Client-Komponenten zu
 * Hydration-Abweichungen führen.
 */
export function euro(betrag) {
  const [ganz, dez] = Number(betrag).toFixed(2).split(".");
  return `${ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${dez}`;
}

const kvStandText = () => {
  const [j, m, t] = KV_STAND.split("-");
  return `${Number(t)}.${Number(m)}.${j}`;
};

/**
 * Pflichtangabe nach § 9 Abs 2 GlBG: kollektivvertragliches Mindestentgelt
 * und Bereitschaft zur Überzahlung. Liefert null, wenn die Stelle keine
 * KV-Angabe hat (z. B. Backoffice-Stellen ohne Pflege).
 */
export function entgeltAngabe(kv) {
  if (!kv?.mindest) return null;
  const vertrag = KV[kv.art] || null;
  const betrag = euro(kv.mindest);
  if (kv.lehre) {
    return {
      kurz: `Lehrlingseinkommen ab € ${betrag} brutto/Monat`,
      text: `Es gilt der ${vertrag?.name || "anzuwendende Kollektivvertrag"}. Das Lehrlingseinkommen beträgt laut Kollektivvertrag im 1. Lehrjahr € ${betrag} brutto pro Monat und steigt mit jedem Lehrjahr (Stand ${kvStandText()}).`,
      vertrag,
    };
  }
  return {
    kurz: `ab € ${betrag} brutto/Monat (KV), Überzahlung möglich`,
    text: `Für diese Position gilt der ${vertrag?.name || "anzuwendende Kollektivvertrag"}, Einstufung ${kv.einstufung}. Das kollektivvertragliche Mindestentgelt beträgt € ${betrag} brutto pro Monat auf Vollzeitbasis (Stand ${kvStandText()}). Bereitschaft zur Überzahlung je nach Qualifikation und Erfahrung ist gegeben.`,
    vertrag,
  };
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
    ort: job?.ort || FIRMA.ort,
    gehalt: job?.gehalt || "",
    entgelt: null,
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
  return STELLEN.map((s) => {
    const entgelt = entgeltAngabe(s.kv);
    return {
      slug: s.slug,
      titel: s.titel,
      kurz: s.kurz,
      bereich: s.bereich,
      ort: s.ort,
      arbeitsort: s.arbeitsort,
      gehalt: s.gehalt || entgelt?.kurz || "",
      entgelt,
      kv: s.kv || null,
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
    };
  });
}

/** Backoffice-Stellen + ganzjährige Stellen; bei gleichem Slug gewinnt das Backoffice. */
export function alleStellen(apiJobs = []) {
  const api = apiJobs.map(normalisiereJob).filter((j) => j.slug);
  const slugs = new Set(api.map((j) => j.slug));
  return [...api, ...stellenAusDaten().filter((s) => !slugs.has(s.slug))];
}

const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/** Datum im österreichischen Format („28. September 2026“, „Jänner“ statt „Januar“). */
export const fmtDatum = (d) => {
  if (!d) return "";
  const dt = new Date(String(d).replace(" ", "T"));
  if (Number.isNaN(dt.getTime())) return "";
  return `${String(dt.getDate()).padStart(2, "0")}. ${MONATE[dt.getMonth()]} ${dt.getFullYear()}`;
};

export const BEWERBUNG_MAIL = FIRMA.email;
export const bewerbungsLink = (titel) =>
  `mailto:${BEWERBUNG_MAIL}?subject=${encodeURIComponent(titel ? `Bewerbung: ${titel}` : "Initiativbewerbung")}`;
