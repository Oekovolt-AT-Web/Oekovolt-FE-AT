// src/data/einspeiseverguetung.js
//
// EINZIGE Quelle fuer die Einspeiseverguetungssaetze. Aendert sich halbjaehrlich
// (1. Februar / 1. August, jeweils -1 % Degression nach EEG). Beim naechsten
// Stichtag NUR diese Datei anfassen - Artikel, Tabelle, JSON-LD und der
// "Stand"-Hinweis ziehen sich alles hier raus.
//
// HINWEIS ZUR GENAUIGKEIT: Die Fachquellen runden uneinheitlich. Fuer den
// Zeitraum ab 01.08.2026 nennen photovoltaik.org 7,71 ct, mehrere andere
// (voltaplan, reduco, solaranlage-ratgeber) 7,70 ct fuer Teileinspeisung
// bis 10 kWp. Hier stehen die haeufiger belegten Werte. Die Bundesnetzagentur
// veroeffentlicht die amtlichen Werte unter:
// https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/EEG_Foerderung/start.html
// Vor Veroeffentlichung bitte einmal gegen die BNetzA-Tabelle gegenpruefen.

export const VERGUETUNG = {
  // ISO-Datum, ab dem die Saetze gelten
  gueltigAb: "2026-08-01",
  gueltigBis: "2027-01-31",
  naechsteAnpassung: "2027-02-01",
  // Menschenlesbar fuer die Anzeige
  gueltigAbLabel: "1. August 2026",
  naechsteAnpassungLabel: "1. Februar 2027",
  degressionProHalbjahr: 1, // Prozent
  quelle: {
    name: "Bundesnetzagentur / EEG",
    url: "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/ErneuerbareEnergien/EEG_Foerderung/start.html",
  },

  // Saetze in ct/kWh, gestaffelt nach Anlagenteil
  saetze: [
    {
      klasse: "bis 10 kWp",
      von: 0,
      bis: 10,
      teileinspeisung: 7.7,
      volleinspeisung: 12.22,
    },
    {
      klasse: "10 bis 40 kWp",
      von: 10,
      bis: 40,
      teileinspeisung: 6.66,
      volleinspeisung: 10.24,
    },
    {
      klasse: "40 bis 100 kWp",
      von: 40,
      bis: 100,
      teileinspeisung: 5.44,
      volleinspeisung: 10.24,
    },
  ],

  // Garantiedauer nach EEG
  garantieJahre: 20,
};

/** Deutsche Zahlenformatierung: 7.7 -> "7,70" */
export function ct(value) {
  return value.toFixed(2).replace(".", ",");
}

/** Satz fuer eine Anlagengroesse ermitteln (vereinfacht: erster passender Block) */
export function satzFuer(kwp, art = "teileinspeisung") {
  const treffer =
    VERGUETUNG.saetze.find((s) => kwp > s.von && kwp <= s.bis) ??
    VERGUETUNG.saetze[VERGUETUNG.saetze.length - 1];
  return treffer[art];
}
