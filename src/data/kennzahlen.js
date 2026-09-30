// src/data/kennzahlen.js
//
// Unternehmenskennzahlen von Ökovolt Österreich – EINE Quelle für Startseite, Presse und Referenzen.
// Angabe der Geschäftsführung (Bestätigung im Chat am 30.09.2026: Zahlen betreffen nur Ökovolt Österreich;
// Gesamtleistung 510 MW laut Auftraggeber, zuvor 340 MW; Kennzahlen gelten nur zusammen mit KENNZAHLEN_STAND).
// Werbliche Aussagen (UWG): regelmäßig auf Aktualität und Belegbarkeit prüfen und STAND nachziehen.
// Nicht zu verwechseln mit der Summe der online dokumentierten Referenzprojekte (src/data/projekte.js).

export const KENNZAHLEN_STAND = "2026-09-30";

// Zeitraum der CO₂-Einsparung ist offen („pro Jahr“ oder „bisher insgesamt“, SEO-Plan E6/M25).
// Eine CO₂-Zahl ohne Zeitraum ist nicht eindeutig und damit werblich angreifbar (UWG) – deshalb wird
// sie NICHT veröffentlicht, solange CO2_ZEITRAUM leer ist. Sobald der Zeitraum feststeht, hier
// eintragen, z. B. "pro Jahr" → die Kennzahl erscheint automatisch wieder in Startseite, Presse und llms.txt.
export const CO2_ZEITRAUM = "";

/** CO₂-Kennzahl (Angabe Geschäftsführung) – veröffentlicht nur mit Zeitraum. */
export const CO2_KENNZAHL = { id: "co2", zahl: 112000, suffix: " t", label: `CO₂-Einsparung${CO2_ZEITRAUM ? ` ${CO2_ZEITRAUM}` : ""}` };

export const KENNZAHLEN = [
  { id: "anlagen", zahl: 5000, suffix: "", label: "PV-Kraftwerke errichtet" },
  { id: "leistung", zahl: 510000, suffix: " kWp", label: "installierte Leistung" },
  ...(CO2_ZEITRAUM ? [CO2_KENNZAHL] : []),
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
export const KENNZAHLEN_SATZ = `${kz("anlagen")} PV-Kraftwerke errichtet, ${kz("leistung")} kWp installierte Leistung${CO2_ZEITRAUM ? `, ${kz("co2")} t CO₂-Einsparung ${CO2_ZEITRAUM}` : ""}`;
