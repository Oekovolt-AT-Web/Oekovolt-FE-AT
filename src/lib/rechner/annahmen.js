// src/lib/rechner/annahmen.js
//
// Annahmen aller Rechner unter /rechner (Österreich) an EINER Stelle. Preise und
// Ertragswerte kommen – wo vorhanden – aus dem Solarrechner
// (src/data/solarrechner.js) und der Einspeise-Datei (src/data/einspeiseverguetung.js),
// damit alle Tools dieselben Zahlen verwenden. Recherchestand: September 2026.
// Alles Orientierungswerte, keine Angebote.

import { ANNAHMEN as SOLAR } from "../../data/solarrechner.js";
import { VERGUETUNG } from "../../data/einspeiseverguetung.js";

export const STAND = "September 2026";

export { SOLAR, VERGUETUNG };

/**
 * Anteilig gemischter Einspeise-Rechensatz in ct/kWh (Größenklassen aus
 * VERGUETUNG.saetze; in AT OeMAG-Marktpreis/Einspeisetarife, nicht garantiert).
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
  ertragProKwp: SOLAR.ertragProKwpSued, // kWh/kWp (Österreich, Süd, PVGIS-Mittel vorsichtig gerundet)
  strompreis: SOLAR.strompreis, // €/kWh vermeidbarer Haushalts-Arbeitspreis brutto
  // CO₂ je kWh Netzstrom (Bandlast): mittlere österreichische Stromaufbringung 2024
  // 105,4 g CO₂äqu/kWh – „Innovative Energietechnologien in Österreich –
  // Marktentwicklung 2024“ (BMIMI 06/2025), Kap. 3.2.3 (Basis E-Control, ENFOS).
  co2Strommix: 0.1054,
};

/** Stromspeicher-Rechner */
export const SPEICHER = {
  preisProKwh: SOLAR.speicherPreisProKwh, // € je kWh brutto, gemeinsam mit PV (siehe src/data/solarrechner.js)
  nachruestAufschlag: 1500, // € – eigener Batterie-Wechselrichter + zweiter Montagetermin (Richtwert)
  lebensdauerJahre: 15, // wirtschaftliche Betrachtung (LFP-Speicher, ca. 6.000 Zyklen)
  strompreisSteigerung: SOLAR.strompreisSteigerung ?? 0.02, // wie im Solarrechner
  eAutoVerbrauch: 18, // kWh/100 km an der Wallbox inkl. Ladeverluste
  eAutoLadeanteilZuhause: 0.8, // Rest lädt öffentlich / beim Arbeitgeber
  wpStromKwh: 3500, // Strombedarf einer Wärmepumpe im Einfamilienhaus (typisch 3.000–5.000)
  wirkungsgradJeRichtung: 0.94, // ≈ 88 % Rundlauf-Wirkungsgrad
  nutzbarAnteil: 0.92, // Entladetiefe & Reserve
  maxKwh: 20,
  // Speichermarkt AT 2024: Ø 20 kWh je neuem System, 1,01 kWh je kWp; mittlerer
  // Systempreis 706 €/kWh netto (BMWET/FH Technikum Wien, Marktentwicklung 2024).
  marktDurchschnittKwh: 20,
};

/** Wärmepumpen-Rechner */
export const WAERMEPUMPE = {
  // Nutzwärmebedarf (Heizung + Warmwasser) in kWh je m² Wohnfläche – bauphysikalische
  // Richtwerte je Baualtersklasse, JAZ typischer Luft-Wasser-Wärmepumpen.
  standards: [
    { id: "unsaniert", label: "Vor 1980, unsaniert", kurz: "Altbau unsaniert", kwhProQm: 190, jaz: 2.8 },
    { id: "teilsaniert", label: "Vor 1995, teilsaniert", kurz: "Teilsaniert", kwhProQm: 140, jaz: 3.1 },
    { id: "1995", label: "1995–2009", kurz: "1995–2009", kwhProQm: 105, jaz: 3.5 },
    { id: "2010", label: "Ab 2010 / saniert", kurz: "Ab 2010", kwhProQm: 70, jaz: 3.9 },
    { id: "neubau", label: "Neubau / Niedrigstenergiehaus", kurz: "Neubau", kwhProQm: 45, jaz: 4.3 },
  ],
  heizungen: {
    gas: {
      label: "Erdgas",
      // E-Control Gaspreismonitor 01.09.2026, Haushalt 15.000 kWh, lokale Versorger:
      // 1.573,96 € (TIGAS) bis 2.334,87 € (EVN) Jahresgesamtpreis inkl. Netz,
      // Abgaben und USt ≈ 10,5–15,6 ct/kWh → Standard 12 ct/kWh (mittig, gerundet).
      preisStandard: 12,
      nutzungsgrad: 0.88, // Brennwertkessel im Bestand
      nebenkosten: 250, // €/Jahr: Wartung, Rauchfangkehrer (Netz/Grundpreis stecken im Gesamtpreis)
      co2: 0.201, // kg CO₂ je kWh Brennstoff (Emissionsfaktor Erdgas)
    },
    oel: {
      label: "Heizöl",
      // EU Weekly Oil Bulletin, Österreich, 21.09.2026: Heizöl 1.884,99 €/1.000 l
      // inkl. Steuern; heizoel24.at 29.09.2026: 187,24 €/100 l bei 3.000 l.
      preisStandard: 185, // € je 100 Liter (≈ 18,5 ct/kWh)
      kwhJeLiter: 10,
      nutzungsgrad: 0.85,
      nebenkosten: 300, // €/Jahr: Wartung, Rauchfangkehrer, Tanküberprüfung
      co2: 0.266, // kg CO₂ je kWh Brennstoff
    },
  },
  // Strompreis für die Wärmepumpe = vermeidbarer Haushalts-Arbeitspreis
  // (eigene WP-Tarife mit Zweitzähler sind in AT selten); siehe src/data/solarrechner.js.
  wpTarifCt: Math.round(SOLAR.strompreis * 100),
  wpNebenkosten: 150, // €/Jahr Wartung (Luft-Wasser)
  haushaltKwh: 4000, // Haushaltsstrom neben der Wärmepumpe (für die PV-Simulation)
  speicherMitPv: 8, // kWh, wenn "PV mit Speicher" gewählt
  // CO₂ für Heizungs-Wärmepumpen: heizgradtag-gewichteter Koeffizient der
  // österreichischen Stromgestehung 2024 = 140,4 g CO₂äqu/kWh
  // (Marktentwicklung 2024, Kap. 3.2.3).
  co2Strom: 0.1404,
  // Förderung Österreich: Bundesförderung „Raus aus Öl und Gas“ (KPC) – Budget
  // 2026 im Juli 2026 ausgeschöpft, neue Registrierungen derzeit nicht möglich;
  // für 2027/28 ist ein geringeres Budget angekündigt. Landesförderungen je
  // Bundesland. Daher KEINE Beträge im Rechner (Felder aus der DE-Fassung
  // bleiben mit 0 für Importeure erhalten).
  foerderung: {
    verfuegbar: false,
    hinweis:
      "Die Bundesförderung „Raus aus Öl und Gas“ ist für 2026 ausgeschöpft; neue Registrierungen sind derzeit nicht möglich. Landesförderungen und die Förderung für Betriebe (UFI) laufen getrennt – wir prüfen, was für Sie gilt.",
    grundProzent: 0,
    maxProzent: 0,
    kostenDeckelErsteWe: 0,
    investitionOrientierung: 30000, // Luft-Wasser-WP im Bestand inkl. Installation (Orientierung, Richtwert)
  },
};

/** Wallbox- / E-Auto-Rechner */
export const WALLBOX = {
  // EU Weekly Oil Bulletin (Europäische Kommission), Österreich, Preise inkl.
  // Steuern mit Stichtag 21.09.2026: Euro-Super 95 1.925 €/1.000 l, Diesel 2.238 €/1.000 l.
  kraftstoffe: {
    benzin: { label: "Benzin", fahrzeug: "Benziner", preis: 1.93, verbrauch: 7.0, co2: 2.37 }, // €/l, l/100 km, kg CO₂/l
    diesel: { label: "Diesel", fahrzeug: "Diesel-Pkw", preis: 2.24, verbrauch: 5.8, co2: 2.65 },
  },
  oeffentlichCt: 55, // ct/kWh Mischpreis AC/DC öffentlich (Richtwert ad hoc, stark anbieterabhängig)
  co2Solar: 0, // kg/kWh im Betrieb
};

/** Formatierungshelfer (Zahlformat 1.234,5 wie auf der ganzen Site) */
export const fmt = (n, stellen = 0) =>
  Number.isFinite(n) ? n.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen }) : "–";
export const fmtEur = (n) => `${fmt(Math.round(n))} €`;
