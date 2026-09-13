// Kleine Formatierungshelfer für die Förderseiten (server- und clientfähig).

/** "2026-09-12" -> "12. September 2026" */
export function datumLang(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" });
}

/** "2026-09-12" -> "09/2026" */
export function datumKurz(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/**
 * Förderhöhe für knappe Darstellungen (Karte, Chips) verdichten:
 * "100 €/kWp, maximal 1.500 € je Gebäude" -> "100 €/kWp"
 * "laufendes Programm, Konditionen bei der Stadt erfragen" -> "auf Anfrage"
 */
export function hoeheKurz(hoehe = "") {
  if (/erfragen|anfrage/i.test(hoehe)) return "auf Anfrage";
  const teil = hoehe.split(/,|\bzusätzlich\b|\bje nach\b|\bbei\b/)[0].trim();
  return teil.length > 26 ? `${teil.slice(0, 24).trim()}…` : teil;
}

/** Text auf eine Meta-Description kürzen (an Wortgrenze). */
export function kuerzen(text = "", max = 158) {
  const t = String(text).replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, t.lastIndexOf(" ", max - 1)).replace(/[,;:–-]$/, "")} …`;
}
