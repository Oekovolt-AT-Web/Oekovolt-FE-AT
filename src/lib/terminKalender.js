// src/lib/terminKalender.js
//
// Kalender aus Frappe (termin.get_kalender) für die Terminbuchung (/termin) und das Rückruf-Widget.
// Umwandlung in Slots für den Browser: src/lib/terminSlots.js
//   kalenderLaden() – nur serverseitig: holt freie und belegte Zeiten einer Terminart.

import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";

const KALENDER_URL = `${API_BASE_URL}oekovolt_app.website_api.termin.get_kalender`;

/** Kalender einer Terminart (z. B. „Telefonische Beratung“) von `von` bis `bis` (YYYY-MM-DD). Nur serverseitig. */
export async function kalenderLaden(terminart, von, bis) {
  if (!isApiConfigured()) return [];
  try {
    const url = `${KALENDER_URL}?terminart=${encodeURIComponent(terminart)}&von=${von}&bis=${bis}`;
    const res = await fetch(url, {
      method: "GET",
      headers: getApiHeaders(),
      cache: "no-store", // freie Zeiten müssen bei jedem Aufruf aktuell sein
    });
    if (!res.ok) {
      console.error(`Kalender API (${terminart}) returned ${res.status}:`, await res.text());
      return [];
    }
    const data = await res.json();
    const tage = Array.isArray(data?.message) ? data.message : [];

    // Nur, was die Komponenten brauchen
    return tage.map((t) => {
      const frei = Array.isArray(t.freie_slots) ? t.freie_slots : [];
      return {
        datum: t.datum, // "2026-09-25"
        label: t.label, // "Fr, 25.9."
        status: t.status, // frei | teilweise | ausgebucht | geschlossen
        frei, // buchbare Zeiten
        belegt: Array.isArray(t.belegte_slots) ? t.belegte_slots : [], // ausgegraut anzeigen
        buchbar: (t.status === "frei" || t.status === "teilweise") && frei.length > 0,
      };
    });
  } catch (error) {
    console.error(`Error fetching Kalender (${terminart}):`, error);
    return [];
  }
}

