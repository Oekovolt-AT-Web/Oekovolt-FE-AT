// src/lib/rechner/annahmen.js
//
// Annahmen aller Rechner unter /rechner an EINER Stelle. Preise und
// Ertragswerte kommen – wo vorhanden – aus dem Solarrechner
// (src/data/solarrechner.js) und der EEG-Tabelle, damit alle Tools
// dieselben Zahlen verwenden. Recherchestand: September 2026.
// Alles Orientierungswerte, keine Angebote.

import { ANNAHMEN as SOLAR } from "../../data/solarrechner.js";
import { VERGUETUNG } from "../../data/einspeiseverguetung.js";

export const STAND = "September 2026";

export { SOLAR, VERGUETUNG };

/**
 * Anteilig gemischter EEG-Satz in ct/kWh (bis 10 kWp / 10–40 kWp / …).
 * Identisch zu mischSatz() in src/lib/solarrechner.js – hier dupliziert, damit
 * die Rechner-Logik ohne Pfad-Aliase per Node testbar bleibt.
 */
export function satzFuer(kwp, art = "teileinspeisung") {
  if (!(kwp > 0)) return VERGUETUNG.saetze[0][art];
  let summe = 0;
  for (const st of VERGUETUNG.saetze) summe += Math.max(0, Math.min(kwp, st.bis) - st.von) * st[art];
  const letzte = VERGUETUNG.saetze[VERGUETUNG.saetze.length - 1];
  if (kwp > letzte.bis) summe += (kwp - letzte.bis) * letzte[art];
  return Math.round((summe / kwp) * 100) / 100;
}

/** Allgemeine Energie- und Preisannahmen */
export const ALLGEMEIN = {
  ertragProKwp: SOLAR.ertragProKwpSued, // kWh/kWp (Süddeutschland, Süd)
  strompreis: SOLAR.strompreis, // €/kWh Haushaltsstrom (vorsichtiger Mittelwert)
  co2Strommix: 0.38, // kg/kWh – wie im Solarrechner
};

/** Stromspeicher-Rechner */
export const SPEICHER = {
  preisProKwh: SOLAR.speicherPreisProKwh, // € je kWh, gemeinsam mit PV installiert
  nachruestAufschlag: 1500, // € – eigener Batterie-Wechselrichter + zweiter Montagetermin
  lebensdauerJahre: 15, // wirtschaftliche Betrachtung (LFP-Speicher, ca. 6.000 Zyklen)
  strompreisSteigerung: SOLAR.strompreisSteigerung ?? 0.02, // wie im Solarrechner
  eAutoVerbrauch: 18, // kWh/100 km an der Wallbox inkl. Ladeverluste
  eAutoLadeanteilZuhause: 0.8, // Rest lädt öffentlich / beim Arbeitgeber
  wpStromKwh: 3500, // Strombedarf einer Wärmepumpe im Einfamilienhaus (typisch 3.000–5.000)
  wirkungsgradJeRichtung: 0.94, // ≈ 88 % Rundlauf-Wirkungsgrad
  nutzbarAnteil: 0.92, // Entladetiefe & Reserve
  maxKwh: 20,
};

/** Wärmepumpen-Rechner */
export const WAERMEPUMPE = {
  // Nutzwärmebedarf (Heizung + Warmwasser) in kWh je m² Wohnfläche
  standards: [
    { id: "unsaniert", label: "Vor 1978, unsaniert", kurz: "Altbau unsaniert", kwhProQm: 190, jaz: 2.8 },
    { id: "teilsaniert", label: "Vor 1995, teilsaniert", kurz: "Teilsaniert", kwhProQm: 140, jaz: 3.1 },
    { id: "1995", label: "1995–2009", kurz: "1995–2009", kwhProQm: 105, jaz: 3.5 },
    { id: "2010", label: "Ab 2010 / saniert", kurz: "Ab 2010", kwhProQm: 70, jaz: 3.9 },
    { id: "neubau", label: "Neubau / KfW-Effizienzhaus", kurz: "Neubau", kwhProQm: 45, jaz: 4.3 },
  ],
  heizungen: {
    gas: {
      label: "Gas",
      preisStandard: 11.5, // ct/kWh brutto (Neukunden-Schnitt Sept. 2026: ca. 11,4–11,9 ct)
      nutzungsgrad: 0.88, // Brennwertkessel im Bestand
      nebenkosten: 380, // €/Jahr: Grundpreis, Wartung, Schornsteinfeger
      co2: 0.201, // kg CO₂ je kWh Brennstoff
    },
    oel: {
      label: "Heizöl",
      preisStandard: 105, // € je 100 Liter (Sept. 2026: ca. 10,5 ct/kWh)
      kwhJeLiter: 10,
      nutzungsgrad: 0.85,
      nebenkosten: 350, // €/Jahr: Wartung, Schornsteinfeger, Tankprüfung
      co2: 0.266, // kg CO₂ je kWh Brennstoff
    },
  },
  wpTarifCt: 26, // ct/kWh Wärmepumpenstrom bzw. Haushaltsstrom mit § 14a-Reduzierung (Spanne 21–28 ct)
  wpNebenkosten: 150, // €/Jahr Wartung (Luft-Wasser)
  haushaltKwh: 4000, // Haushaltsstrom neben der Wärmepumpe (für die PV-Simulation)
  speicherMitPv: 8, // kWh, wenn "PV mit Speicher" gewählt
  // BEG-Heizungsförderung (KfW 458) – Richtlinie seit 21.07.2026
  foerderung: {
    grundProzent: 30,
    maxProzent: 70,
    kostenDeckelErsteWe: 28000, // förderfähige Kosten für die erste Wohneinheit
    investitionOrientierung: 30000, // Luft-Wasser-WP im Bestand inkl. Installation (Orientierung)
  },
};

/** Wallbox- / E-Auto-Rechner */
export const WALLBOX = {
  kraftstoffe: {
    benzin: { label: "Benzin", fahrzeug: "Benziner", preis: 2.15, verbrauch: 7.0, co2: 2.37 }, // €/l (ADAC-Schnitt Sept. 2026 ca. 2,18 €), l/100 km, kg/l
    diesel: { label: "Diesel", fahrzeug: "Diesel-Pkw", preis: 2.2, verbrauch: 5.8, co2: 2.65 },
  },
  oeffentlichCt: 55, // ct/kWh Mischpreis AC/DC öffentlich
  co2Solar: 0, // kg/kWh im Betrieb
};

/** Formatierungshelfer (de-DE) */
export const fmt = (n, stellen = 0) =>
  Number.isFinite(n) ? n.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen }) : "–";
export const fmtEur = (n) => `${fmt(Math.round(n))} €`;
