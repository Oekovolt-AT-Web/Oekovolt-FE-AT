// Serverseitiges Laden der Referenzprojekte – gemeinsame Quelle für /referenzen/projekte,
// die Detailseiten, die Referenzkarte, die Regionalseiten (und Startseite/Sitemap).
//
// Führende Quelle ist das Backoffice (oekovolt_app.website_api.projekte.get_projekte / get_projekt).
// Liefert es keine Projekte (nicht konfiguriert, Fehler, leere Liste), greift der statische
// Stand aus src/data/projekte.js – damit die bisherigen Projekt-URLs nie ins Leere laufen.
// Liefert die API mindestens ein Projekt, gilt ausschließlich die API.
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { PROJEKTE } from "@/data/projekte";
import { normalisiereApiProjekt } from "./projektDaten";

export const PROJEKTE_API = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekte`;
export const PROJEKT_API = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekt`;

const summeKwp = (liste) => liste.reduce((s, p) => s + (Number(p?.leistung) || 0), 0);

function statischeListe() {
  return { projekte: PROJEKTE, anzahl: PROJEKTE.length, summe_kwp: summeKwp(PROJEKTE), quelle: "statisch" };
}

/**
 * Projektliste in API-Form (Einträge wie get_projekte):
 * { projekte: [...], anzahl, summe_kwp, quelle: "api" | "statisch" }
 */
export async function ladeProjektListe() {
  if (!isApiConfigured()) return statischeListe();
  try {
    const res = await fetch(PROJEKTE_API, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`Projects API returned ${res.status}`);
      return statischeListe();
    }
    const data = await res.json();
    const msg = data?.message;
    const roh = Array.isArray(msg) ? msg : (msg?.projekte ?? msg?.projects ?? msg?.data);
    const projekte = Array.isArray(roh) ? roh.filter((p) => p && typeof p === "object") : [];
    if (!projekte.length) return statischeListe();
    return {
      projekte,
      anzahl: Number(msg?.anzahl) || projekte.length,
      summe_kwp: Number(msg?.summe_kwp) || summeKwp(projekte),
      quelle: "api",
    };
  } catch (error) {
    console.error("Error fetching projects list:", error);
    return statischeListe();
  }
}

/** Nur die Einträge in API-Form (projekt_name, projekt_website_name, leistung, bild_url, …) */
export async function ladeProjekteRoh() {
  return (await ladeProjektListe()).projekte;
}

/** Fertig normalisierte Projekte (Format wie normalisiereProjekt, Slug = projektSlug, z. B. „mindelheim-2“) */
export async function ladeProjekte() {
  return (await ladeProjekteRoh()).map(normalisiereApiProjekt).filter((p) => p.slug);
}

/**
 * Ein Projekt in API-Form (wie get_projekt, inkl. bilder[]) über projekt_website_name.
 * Kommt die Liste aus der API, wird get_projekt gefragt (null bei Fehler – der Aufrufer nimmt
 * dann den Listeneintrag). Kommt die Liste aus src/data/projekte.js, der Eintrag von dort.
 */
export async function ladeProjektRoh(websiteName) {
  if (!websiteName) return null;
  const liste = await ladeProjektListe();
  if (liste.quelle !== "api") return liste.projekte.find((p) => p.projekt_website_name === websiteName) || null;
  try {
    const res = await fetch(`${PROJEKT_API}?projekt_website_name=${encodeURIComponent(websiteName)}`, {
      method: "GET",
      headers: getApiHeaders(),
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    const p = (await res.json())?.message;
    return p && typeof p === "object" && p.projekt_website_name ? p : null;
  } catch (error) {
    console.error("Error fetching projekt:", error);
    return null;
  }
}
