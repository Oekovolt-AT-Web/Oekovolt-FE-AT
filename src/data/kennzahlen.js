// src/data/kennzahlen.js
//
// Unternehmenskennzahlen von Ökovolt Österreich – EINE Quelle für Startseite, Presse und Referenzen.
// Angabe der Geschäftsführung (Bestätigung im Chat am 30.09.2026: Zahlen betreffen nur Ökovolt Österreich;
// Gesamtleistung 510 MW laut Auftraggeber, zuvor 340 MW).
// Werbliche Aussagen (UWG): regelmäßig auf Aktualität und Belegbarkeit prüfen und STAND nachziehen.
// Nicht zu verwechseln mit der Summe der online dokumentierten Referenzprojekte (src/data/projekte.js).

export const KENNZAHLEN_STAND = "2026-09-30";

// Zeitraum der CO₂-Einsparung ist offen („pro Jahr“ oder „bisher insgesamt“) – bis zur Klärung neutral.
// Sobald bekannt, hier eintragen, z. B. "pro Jahr" → erscheint automatisch in allen Beschriftungen.
export const CO2_ZEITRAUM = "";

export const KENNZAHLEN = [
  { id: "anlagen", zahl: 5000, suffix: "", label: "PV-Kraftwerke errichtet" },
  { id: "leistung", zahl: 510000, suffix: " kWp", label: "installierte Leistung" },
  { id: "co2", zahl: 112000, suffix: " t", label: `CO₂-Einsparung${CO2_ZEITRAUM ? ` ${CO2_ZEITRAUM}` : ""}` },
];

export const KENNZAHLEN_HINWEIS = "Angaben Ökovolt Österreich";

/**
 * Zahl mit Tausenderpunkt und Dezimalkomma, unabhängig von der Laufzeitumgebung
 * (kein Intl → keine Hydration-Unterschiede). 1234.5 → „1.234,5“ (Befund tests-02).
 */
export const zahlText = (n) => {
  const [ganz, dez] = String(n).split(".");
  const g = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dez ? `${g},${dez}` : g;
};

/** Formatierter Wert einer Kennzahl, z. B. kz("leistung") → "510.000" (ohne Einheit). */
export const kz = (id) => zahlText(KENNZAHLEN.find((k) => k.id === id)?.zahl ?? "");

/** Ein Satz für Fließtexte und llms.txt. */
export const KENNZAHLEN_SATZ = `${kz("anlagen")} PV-Kraftwerke errichtet, ${kz("leistung")} kWp installierte Leistung, ${kz("co2")} t CO₂-Einsparung${CO2_ZEITRAUM ? ` ${CO2_ZEITRAUM}` : ""}`;
