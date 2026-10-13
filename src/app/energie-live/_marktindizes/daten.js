// src/app/energie-live/_marktindizes/daten.js
//
// Gemeinsame Daten und Formate der Marktindex-Seiten (B10):
//   /energie-live/speicher-index   – Speicher-Spread-Index
//   /energie-live/solar-marktwert  – Solar-Marktwert (Ökovolt-Schätzung)
// Die JSON-Dateien erzeugt scripts/marktindizes.mjs (manuell, monatlich); Rechenregeln in
// src/lib/marktindizes.js, Test in scripts/marktindizes.test.mjs.

import SPEICHER_JSON from "../../../../data/marktindizes/speicher-spread-index.json";
import SOLAR_JSON from "../../../../data/marktindizes/solar-marktwert.json";
import { REFERENZMARKTWERT_PV, QUELLEN as OEMAG_QUELLEN, STAND as OEMAG_STAND } from "@/data/oemag";
import { csvText, monatKurz, monatLabel, SPALTEN_SOLAR, SPALTEN_SPEICHER, summeLetzte } from "@/lib/marktindizes";

export const SPEICHER_INDEX = SPEICHER_JSON;
export const SOLAR_INDEX = SOLAR_JSON;

export const BASIS_URL = "https://www.oekovolt.com";
export const URL_SPEICHER = `${BASIS_URL}/energie-live/speicher-index`;
export const URL_SOLAR = `${BASIS_URL}/energie-live/solar-marktwert`;
export const CSV_SPEICHER = "/energie-live/speicher-index/speicher-spread-index.csv";
export const CSV_SOLAR = "/energie-live/solar-marktwert/solar-marktwert.csv";

export const LIZENZ_URL = "https://creativecommons.org/licenses/by/4.0/deed.de";
export const SMARD_URL = "https://www.smard.de/home/marktdaten";
export const EC_URL = "https://www.energy-charts.info/?l=de&c=AT";

/** Referenzmarktwert PV der E-Control (ct/kWh) je Monat – amtlicher Vergleichswert aus src/data/oemag.js */
export const RMW_JE_MONAT = Object.fromEntries(REFERENZMARKTWERT_PV.map((r) => [r.monat, r.ct]));
export const RMW_QUELLE = OEMAG_QUELLEN.ecRmw;
export const RMW_STAND = OEMAG_STAND.label;

const zahl = (stellen) => new Intl.NumberFormat("de-AT", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
const Z0 = zahl(0);
const Z1 = zahl(1);
const Z2 = zahl(2);

/** 1.077 € */
export const eur = (n) => (n == null ? "–" : `${Z0.format(n)} €`);
/** 34,76 € */
export const eur2 = (n) => (n == null ? "–" : `${Z2.format(n)} €`);
/** €/MWh → „8,03 ct/kWh“ (ohne Einheit mit einheit=false) */
export const ctAusMwh = (eurMwh, einheit = true) => (eurMwh == null ? "–" : `${Z2.format(eurMwh / 10)}${einheit ? " ct/kWh" : ""}`);
/** ct/kWh-Wert direkt */
export const ctText = (ct, einheit = true) => (ct == null ? "–" : `${Z2.format(ct)}${einheit ? " ct/kWh" : ""}`);
export const zahl0 = (n) => (n == null ? "–" : Z0.format(n));
export const zahl1 = (n) => (n == null ? "–" : Z1.format(n));
export const prozent = (anteil) => (anteil == null ? "–" : `${Z0.format(anteil * 100)} %`);

/** "2026-10-11" → "11.10.2026" */
export const datumText = (iso) => (iso ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : "–");

export { monatKurz, monatLabel, summeLetzte };

/** Pflichtangabe unter jeder Zahl */
export const herkunft = (stand) => `Eigene Berechnung Ökovolt Österreich · Daten: Bundesnetzagentur | SMARD.de (CC BY 4.0) · Stand ${datumText(stand)} · Richtwert/Orientierung`;

/** CSV des Speicher-Spread-Index mit Quellen-, Lizenz- und Standzeilen */
export function speicherCsv() {
  const j = SPEICHER_INDEX;
  return csvText({
    spalten: SPALTEN_SPEICHER,
    zeilen: j.monate,
    kommentare: [
      j.name,
      `Herausgeber: ${j.herausgeber} – ${URL_SPEICHER}`,
      `Lizenz: CC BY 4.0 (${j.lizenzUrl}) – Namensnennung: ${j.attribution}`,
      `Stand: ${j.stand} · Zeitraum ${j.zeitraum.von} bis ${j.zeitraum.bis} · Zeitzone ${j.zeitzone}`,
      `Annahmen: ${j.annahmen.kapazitaetMwh} MWh nutzbar, ${j.annahmen.leistungMw} MW, ${j.annahmen.zyklenProTag} Vollzyklus je Tag, Round-Trip ${Math.round(j.annahmen.roundTrip * 100)} %, perfekte Voraussicht`,
      "Theoretische Obergrenze – ohne Netzentgelte, Abgaben, Degradation, Vermarktungsentgelt. Nicht amtlich, keine Erlöszusage, Richtwert/Orientierung.",
      "Einheiten: Erlös in EUR (netto), Preise in EUR/MWh (Day-Ahead, Gebotszone AT), Datenabdeckung als Anteil 0–1",
    ],
  });
}

/** CSV des Solar-Marktwerts inkl. Referenzmarktwert der E-Control als Vergleichsspalte */
export function solarCsv() {
  const j = SOLAR_INDEX;
  return csvText({
    spalten: SPALTEN_SOLAR,
    zeilen: j.monate.map((m) => ({ ...m, referenzmarktwertCt: RMW_JE_MONAT[m.monat] ?? null })),
    kommentare: [
      j.name,
      `Herausgeber: ${j.herausgeber} – ${URL_SOLAR}`,
      `Lizenz: CC BY 4.0 (${j.lizenzUrl}) – Namensnennung: ${j.attribution}`,
      `Stand: ${j.stand} · Zeitraum ${j.zeitraum.von} bis ${j.zeitraum.bis} · Zeitzone ${j.zeitzone}`,
      `Methode: ${j.methode.formel}; Gewicht: ${j.methode.gewicht}`,
      "Eigene Schätzung von Ökovolt – nicht der amtliche Referenzmarktwert nach § 13 EAG. Richtwert/Orientierung.",
      `Spalte referenzmarktwert_pv_ct_kwh_e_control: amtlicher Wert der E-Control (${RMW_QUELLE.url}, abgerufen ${RMW_QUELLE.abgerufen}) – nur zum Vergleich, nicht Teil der Ökovolt-Lizenz`,
      "Einheiten: EUR/MWh (Day-Ahead, Gebotszone AT, netto), Referenzmarktwert in ct/kWh, Datenabdeckung als Anteil 0–1",
    ],
  });
}
