// src/data/kennzahlen.js
//
// Unternehmenskennzahlen von Ökovolt Österreich – EINE Quelle für Startseite, Presse und Referenzen.
// Angabe der Geschäftsführung (Bestätigung im Chat am 30.09.2026: Zahlen betreffen nur Ökovolt Österreich).
// Werbliche Aussagen (UWG): regelmäßig auf Aktualität und Belegbarkeit prüfen und STAND nachziehen.
// Nicht zu verwechseln mit der Summe der online dokumentierten Referenzprojekte (src/data/projekte.js).

export const KENNZAHLEN_STAND = "2026-09-30";

// Zeitraum der CO₂-Einsparung ist offen („pro Jahr“ oder „bisher insgesamt“) – bis zur Klärung neutral.
// Sobald bekannt, hier eintragen, z. B. "pro Jahr" → erscheint automatisch in allen Beschriftungen.
export const CO2_ZEITRAUM = "";

export const KENNZAHLEN = [
  { id: "anlagen", zahl: 5000, suffix: "", label: "PV-Kraftwerke errichtet" },
  { id: "leistung", zahl: 340000, suffix: " kWp", label: "installierte Leistung" },
  { id: "co2", zahl: 112000, suffix: " t", label: `CO₂-Einsparung${CO2_ZEITRAUM ? ` ${CO2_ZEITRAUM}` : ""}` },
];

export const KENNZAHLEN_HINWEIS = "Angaben Ökovolt Österreich";

/** Zahl mit Tausenderpunkt, unabhängig von der Laufzeitumgebung (kein Intl → keine Hydration-Unterschiede). */
export const zahlText = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** Formatierter Wert einer Kennzahl, z. B. kz("leistung") → "340.000" (ohne Einheit). */
export const kz = (id) => zahlText(KENNZAHLEN.find((k) => k.id === id)?.zahl ?? "");

/** Ein Satz für Fließtexte und llms.txt. */
export const KENNZAHLEN_SATZ = `${kz("anlagen")} PV-Kraftwerke errichtet, ${kz("leistung")} kWp installierte Leistung, ${kz("co2")} t CO₂-Einsparung${CO2_ZEITRAUM ? ` ${CO2_ZEITRAUM}` : ""}`;
