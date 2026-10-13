// src/components/Forderungen/Steuerlich/elabg.js
//
// Sätze und Pflichtsatz zur Elektrizitätsabgabe – bewusst OHNE "use client",
// damit Server-Seiten (z. B. /forderungen/steuerlich) und der Client-Rechner
// dieselben Werte nutzen. Aus einer "use client"-Datei importiert, wäre die
// Konstante auf dem Server nur ein Client-Referenz-Proxy (QA-Befund C02).
// Quellen: § 4 und § 7 Abs. 16 ElAbgG (BGBl. I Nr. 95/2025), § 4 Abs. 1 SKZG.
// Keine Steuerberatung – Richtwert zur Orientierung.

export const ELABG_SAETZE = {
  regulaer: 1.5, // ct/kWh, § 4 ElAbgG
  betrieb2026: 0.82, // ct/kWh, § 7 Abs. 16 ElAbgG (Lieferungen 2026)
  haushalt2026: 0.1, // ct/kWh, natürliche Personen nach § 4 Abs. 1 Stromkostenzuschussgesetz
};

export const ELABG_SATZ_2027 = "Laut geltendem Recht ab 2027 wieder 1,5 ct/kWh; eine Verlängerung der Senkung wird verhandelt (Stand 29.09.2026)";

/** Ersparnis in € für eine Eigenverbrauchsmenge (kWh) bei einem Satz (ct/kWh). */
export function ersparnis(kwh, satzCt) {
  const k = Number(kwh);
  const s = Number(satzCt);
  if (!Number.isFinite(k) || !Number.isFinite(s) || k <= 0 || s <= 0) return 0;
  return Math.round((k * s) / 100);
}
