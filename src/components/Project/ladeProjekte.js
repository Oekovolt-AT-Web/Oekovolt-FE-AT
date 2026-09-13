// Serverseitiges Laden der Projektliste (gleiche Quelle wie Sitemap und Detailseiten).
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";

export const PROJEKTE_API = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;

export async function ladeProjekte() {
  if (!isApiConfigured()) return [];
  try {
    const res = await fetch(PROJEKTE_API, { method: "GET", headers: getApiHeaders(), next: { revalidate: 600 } });
    if (!res.ok) {
      console.error(`Projects API returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data?.message) ? data.message : [];
  } catch (error) {
    console.error("Error fetching projects list:", error);
    return [];
  }
}
