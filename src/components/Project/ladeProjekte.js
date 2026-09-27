// Serverseitiges Laden der Projektliste – gleiche Quelle wie /referenzen/projekte und die Detailseiten.
// Liefert fertig normalisierte Projekte (Format wie normalisiereProjekt, Slug = projektSlug, z. B. „mindelheim-2“).
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { normalisiereApiProjekt } from "./projektDaten";

export const PROJEKTE_API = `${API_BASE_URL}oekovolt_app.website_api.projekte.get_projekte`;

export async function ladeProjekte() {
  if (!isApiConfigured()) return [];
  try {
    const res = await fetch(PROJEKTE_API, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`Projects API returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    const msg = data?.message;
    const liste = Array.isArray(msg) ? msg : (msg?.projekte ?? msg?.projects ?? msg?.data);
    return (Array.isArray(liste) ? liste : []).map(normalisiereApiProjekt).filter((p) => p.slug);
  } catch (error) {
    console.error("Error fetching projects list:", error);
    return [];
  }
}
