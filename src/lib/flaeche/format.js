// src/lib/flaeche/format.js
//
// Zahlformat für den Flächen-Check ohne Intl/toLocaleString: Server und Browser
// liefern so garantiert denselben Text (keine Hydration-Unterschiede).
// Tausenderpunkt wie zahlText() in src/data/kennzahlen.js, Dezimalkomma.

/**
 * @param {number} n
 * @param {number} [stellen=0] Nachkommastellen
 * @returns {string} z. B. 12.345,6
 */
export function zahl(n, stellen = 0) {
  if (!Number.isFinite(n)) return "–";
  const faktor = 10 ** stellen;
  const gerundet = Math.round(Math.abs(n) * faktor) / faktor;
  const [ganz, rest = ""] = gerundet.toFixed(stellen).split(".");
  const mitPunkt = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const vorzeichen = n < 0 && gerundet !== 0 ? "−" : "";
  return `${vorzeichen}${mitPunkt}${stellen > 0 ? `,${rest}` : ""}`;
}

/** Euro-Betrag ohne Nachkommastellen, auf `schritt` gerundet (Standard 100 €). */
export function euro(n, schritt = 100) {
  if (!Number.isFinite(n)) return "–";
  return `${zahl(Math.round(n / schritt) * schritt)} €`;
}

/** Hektar mit sinnvoller Genauigkeit (unter 10 ha eine Nachkommastelle). */
export function hektar(n) {
  if (!Number.isFinite(n)) return "–";
  return `${zahl(n, n < 10 && Math.round(n) !== n ? 1 : 0)} ha`;
}
