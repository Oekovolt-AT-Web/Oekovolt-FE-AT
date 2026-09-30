// src/lib/heatmap.js
//
// Gemeinsame Regeln der Klick- und Scroll-Heatmap für Browser (Sammler, Ansicht) und Server (/api/heatmap).
// Datenschutz: nur mit Einwilligung „Statistik“ (siehe components/Statistik/HeatmapSammler.js), keine
// Textinhalte, keine Eingaben, keine Kennungen; das Backoffice speichert nur monatliche Zählwerte.

export const HEATMAP_GERAETE = ["mobil", "tablet", "desktop"];
export const HEATMAP_MAX_KLICKS = 100;
export const HEATMAP_MAX_SEL = 200;
export const HEATMAP_MAX_PFAD = 200;

/** Nie erfassen: Einmal-Tokens (/scan, /fortsetzen), Info-Bildschirme (/tv…), Hinweisgebersystem. */
const AUSGENOMMEN = /^\/(?:(?:scan|fortsetzen)(?:\/|$)|tv|hinweisgebersystem)/i;

/** Pfadsegment, das wie ein Zugangscode aussieht (Groß-/Kleinbuchstaben und Ziffern gemischt oder langer Hex-Wert). */
function tokenSegment(seg) {
  return (seg.length >= 16 && /[A-Z]/.test(seg) && /[a-z]/.test(seg) && /\d/.test(seg)) || /^[0-9a-f]{24,}$/i.test(seg);
}

/** true, wenn für diesen Pfad keine Heatmap-Daten erfasst werden dürfen. */
export function heatmapAusgenommen(pfad) {
  if (typeof pfad !== "string") return true;
  return AUSGENOMMEN.test(pfad) || pfad.split("/").some(tokenSegment);
}

/** Gerätetyp aus der Fensterbreite: mobil (< 768 px), tablet (< 1200 px), sonst desktop. */
export function geraetFuerBreite(breite) {
  if (breite < 768) return "mobil";
  if (breite < 1200) return "tablet";
  return "desktop";
}

/** Relative Position 0..1 auf 0,05 gerundet. */
export function runden05(wert) {
  const v = Math.min(1, Math.max(0, Number(wert) || 0));
  return Number((Math.round(v * 20) / 20).toFixed(2));
}

/** Scrolltiefe 0..100 auf 10 gerundet. */
export function runden10(wert) {
  const v = Math.min(100, Math.max(0, Number(wert) || 0));
  return Math.round(v / 10) * 10;
}

const STEUERZEICHEN = /[\u0000-\u001f\u007f]/;

/** Seitenpfad prüfen: beginnt mit „/“, höchstens 200 Zeichen, ohne Query/Fragment und Steuerzeichen. */
export function pfadGueltig(pfad) {
  return (
    typeof pfad === "string" &&
    pfad.startsWith("/") &&
    pfad.length <= HEATMAP_MAX_PFAD &&
    !/[?#\s<>"'\\]/.test(pfad) &&
    !STEUERZEICHEN.test(pfad)
  );
}

/** CSS-Selektor prüfen (nur Länge und Zeichen – die Gültigkeit prüft erst der Browser der Ansicht). */
export function selektorGueltig(sel) {
  return typeof sel === "string" && sel.length > 0 && sel.length <= HEATMAP_MAX_SEL && !STEUERZEICHEN.test(sel) && !/[<{};]/.test(sel);
}
