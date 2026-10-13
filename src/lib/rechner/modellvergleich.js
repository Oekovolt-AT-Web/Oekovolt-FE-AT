// src/lib/rechner/modellvergleich.js
//
// Neutraler Modellvergleich für dieselbe Gewerbe-PV-Anlage: Kauf mit Eigenkapital, Kauf mit
// Kredit, Leasing/Mietkauf, Contracting, Dach-PPA und Dachpacht nebeneinander – mit Eingaben
// statt Anbieterwerten (Leasingfaktor, Contracting-/PPA-Preis, Pacht). Kennzahlen je Modell:
// Kapitalwert, Liquidität im Jahr 1, Eigentum am Ende, IFB/AfA beim Eigentümer.
//
// Neutral: Es werden KEINE Anbieter genannt und kein eigenes Contracting-, Leasing- oder
// Pachtangebot behauptet (Entscheidung der Geschäftsführung offen). Alle Konditionen sind
// Beispielwerte, die der Nutzer durch echte Angebote ersetzt. Richtwerte/Orientierung,
// keine Steuer- oder Finanzberatung.
//
// Baut auf finanzierung.js (Energie-Seite, fünf Modelle über 20 Jahre) auf und ergänzt die
// Dachpacht. Reine Funktionen ohne React – node scripts/investition.test.mjs. Stand: 11.10.2026.

import { FINANZIERUNG, rechneFinanzierung, zahl, euro, prozent } from "./finanzierung.js";
import { kapitalwert, STAND_INVESTITION } from "./investition.js";

export { zahl, euro, prozent };

export const STAND_MODELLVERGLEICH = STAND_INVESTITION;

/** Beispielwerte der Dachpacht – kein Marktwert, im Rechner offen und änderbar. */
export const MODELLVERGLEICH = {
  pacht: { eurProKwpJahr: 8, jahre: 20, index: 0 },
};

/**
 * Beschreibende Eigenschaften der sechs Modelle (keine Zahlen, keine Anbieter).
 * eigentumEnde: true = Anlage gehört am Ende des Betrachtungszeitraums dem Betrieb.
 */
export const VERGLEICH_MODELLE = [
  { id: "eigenkapital", name: "Kauf mit Eigenkapital", kurz: "Kauf EK", eigentumEnde: true, eigentum: "Sie – ab Inbetriebnahme", ifbAfa: "Bei Ihnen (Eigentümer)", betrieb: "Sie" },
  { id: "kredit", name: "Kauf mit Kredit", kurz: "Kredit", eigentumEnde: true, eigentum: "Sie – ab Inbetriebnahme, Bank hält ggf. Sicherheiten", ifbAfa: "Bei Ihnen (Eigentümer)", betrieb: "Sie" },
  { id: "leasing", name: "Leasing / Mietkauf", kurz: "Leasing", eigentumEnde: true, eigentum: "Nach der Laufzeit bei Übernahme zum Restwert; beim Mietkauf mit der letzten Rate", ifbAfa: "Meist beim Leasinggeber (wirtschaftlicher Eigentümer); beim Mietkauf in der Regel bei Ihnen – mit der Steuerberatung klären", betrieb: "Meist Sie (Wartungs-/Versicherungspflicht)" },
  { id: "contracting", name: "Contracting", kurz: "Contracting", eigentumEnde: true, eigentum: "Beim Contractor; Übernahme nach der Laufzeit zum vereinbarten Wert", ifbAfa: "Beim Contractor", betrieb: "Contractor" },
  { id: "ppa", name: "Dach-PPA", kurz: "PPA", eigentumEnde: false, eigentum: "Beim Investor – keine Übernahme vorgesehen", ifbAfa: "Beim Investor", betrieb: "Investor" },
  { id: "pacht", name: "Dachpacht", kurz: "Pacht", eigentumEnde: false, eigentum: "Beim Investor – Sie verpachten nur die Fläche", ifbAfa: "Beim Investor; die Pacht ist bei Ihnen Ertrag", betrieb: "Investor" },
];

const zahlOder = (v, std) => (Number.isFinite(Number(v)) && v !== null && v !== "" ? Number(v) : std);

/** Offengelegte Eingaben je Modell als Liste [label, wert] – für Tabelle und PDF. */
export function eingabenOffen(id, basis, e = {}) {
  const S = FINANZIERUNG;
  const kr = { ...S.kredit, ...(e.kredit || {}) };
  const le = { ...S.leasing, ...(e.leasing || {}) };
  const co = { ...S.contracting, ...(e.contracting || {}) };
  const pp = { ...S.ppa, ...(e.ppa || {}) };
  const pa = { ...MODELLVERGLEICH.pacht, ...(e.pacht || {}) };
  switch (id) {
    case "eigenkapital":
      return [
        ["Investition netto", euro(basis.investition)],
        ["Kalkulationszins", prozent(basis.kalkulationszins, 1)],
      ];
    case "kredit":
      return [
        ["Eigenkapitalanteil", prozent(kr.eigenkapitalAnteil)],
        ["Zins (Beispiel)", prozent(kr.zins, 2)],
        ["Laufzeit", `${zahl(kr.jahre)} Jahre`],
      ];
    case "leasing":
      return [
        ["Leasingfaktor (Beispiel)", `${zahl(le.faktor, 2)} % je Monat`],
        ["Laufzeit", `${zahl(le.jahre)} Jahre`],
        ["Restwert", prozent(le.restwert)],
      ];
    case "contracting":
      return [
        ["Preis je genutzter kWh (Beispiel)", `${zahl(co.preisCt, 1)} ct`],
        ["Indexierung", `${prozent(co.index, 1)} je Jahr`],
        ["Laufzeit · Übernahme", `${zahl(co.jahre)} J. · ${prozent(co.uebernahme)} der Investition`],
      ];
    case "ppa":
      return [
        ["Strompreis (Beispiel)", `${zahl(pp.preisCt, 1)} ct/kWh`],
        ["Indexierung", `${prozent(pp.index, 1)} je Jahr`],
        ["Abnahme", pp.abnahme === "eigenverbrauch" ? "nur Eigenverbrauch" : "gesamte Erzeugung (Take-or-pay)"],
      ];
    case "pacht":
      return [
        ["Pacht (Beispiel)", `${zahl(pa.eurProKwpJahr, 2)} € je kWp und Jahr`],
        ["Indexierung", `${prozent(pa.index, 1)} je Jahr`],
        ["Laufzeit", `${zahl(pa.jahre)} Jahre`],
      ];
    default:
      return [];
  }
}

/**
 * Hauptberechnung: sechs Modelle über 20 Jahre.
 * @param {object} e  wie rechneFinanzierung(); zusätzlich pacht { eurProKwpJahr, jahre, index }
 */
export function rechneModellvergleich(e = {}) {
  const f = rechneFinanzierung(e);
  const kz = f.basis.kalkulationszins;
  const pa = { ...MODELLVERGLEICH.pacht, ...(e.pacht || {}) };
  const pachtJahre = Math.min(Math.max(Math.round(zahlOder(pa.jahre, 20)), 1), f.jahre);
  const pachtSatz = Math.max(zahlOder(pa.eurProKwpJahr, 0), 0);
  const pachtIndex = zahlOder(pa.index, 0);

  // Dachpacht: keine Investition, kein Eigenverbrauch – nur die Pacht, solange der Vertrag läuft.
  // Danach bleibt die Anlage beim Investor (Rückbau oder neuer Vertrag – nicht bewertet).
  const pachtReihe = [{ jahr: 0, netto: 0, kumuliert: 0, nutzen: 0, zahlung: 0, ifb: 0 }];
  let kum = 0;
  for (let t = 1; t <= f.jahre; t++) {
    const netto = t <= pachtJahre ? f.basis.kwp * pachtSatz * Math.pow(1 + pachtIndex, t - 1) : 0;
    kum += netto;
    pachtReihe.push({ jahr: t, netto, kumuliert: kum, nutzen: netto, zahlung: 0, ifb: 0 });
  }

  const beschreibung = (id) => VERGLEICH_MODELLE.find((m) => m.id === id);
  const alsModell = (m, reihe) => {
    const b = beschreibung(m.id);
    const zahlungen = reihe.map((r) => r.netto);
    return {
      ...b,
      farbe: m.farbe,
      strich: m.strich,
      reihe,
      kapitalwert: kapitalwert(zahlungen, kz),
      liquiditaetJahr1: reihe[0].netto + reihe[1].netto,
      summe: reihe[reihe.length - 1].kumuliert,
      eigenkapital: -Math.min(reihe[0].netto, 0),
      maxVorleistung: -Math.min(0, ...reihe.map((r) => r.kumuliert)),
      eingaben: eingabenOffen(m.id, f.basis, e),
    };
  };

  const modelle = [...f.modelle.map((m) => alsModell(m, m.reihe)), alsModell({ id: "pacht", farbe: "#5b6472", strich: "4 3" }, pachtReihe)];

  const maxKw = Math.max(...modelle.map((m) => m.kapitalwert));
  const besteIds = modelle.filter((m) => m.kapitalwert >= maxKw - 1).map((m) => m.id);

  return {
    stand: STAND_MODELLVERGLEICH,
    jahre: f.jahre,
    basis: { ...f.basis, pacht: { eurProKwpJahr: pachtSatz, jahre: pachtJahre, index: pachtIndex, summe: kum } },
    modelle,
    besteIds,
    besterId: besteIds[0],
    hinweise: [
      "Alle Modelle nutzen dieselbe Anlage, denselben Ertrag und dieselbe Eigenverbrauchsquote; verglichen wird, was dem Betrieb gegenüber reinem Netzbezug bleibt.",
      "Leasingfaktor, Zins, Contracting-/PPA-Preis und Pacht sind Beispielwerte – keine Konditionen eines Anbieters. Ersetzen Sie sie durch Ihre Angebote.",
      "Netto, vor Ertragsteuern; nur der Steuereffekt des Investitionsfreibetrags wird beim Kauf im Jahr 1 gezeigt. Bilanz- und Steuerwirkung klärt Ihre Steuerberatung.",
      "Die Dachpacht bewertet nur die Pachteinnahme; Vorzugsstrom-Regelungen oder eine Übernahme nach Vertragsende sind Verhandlungssache und hier nicht enthalten.",
    ],
  };
}
