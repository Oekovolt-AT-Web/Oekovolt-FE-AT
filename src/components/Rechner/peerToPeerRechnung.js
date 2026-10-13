// src/components/Rechner/peerToPeerRechnung.js
//
// Peer-to-Peer-Rechner (Österreich) – reine Funktionen ohne React, per Node prüfbar
// (scripts/peer-to-peer.test.mjs). Relative Imports, damit der Test ohne Alias läuft.
//
// Rechtsrahmen (Stand 11.10.2026):
//  - Peer-to-Peer-Vertrag: § 6 Z 124 ElWG (Verkauf oder Schenkung erneuerbarer Elektrizität
//    zwischen Marktteilnehmern mit vorab festgelegten Bedingungen für die automatische Abwicklung);
//    Teilnahme „zusätzlich zum bestehenden Liefervertrag“ (§ 68 ElWG, in Kraft seit 01.10.2026).
//  - Netzentgelt-Abschläge für P2P im Nahebereich erst nach Verordnung der E-Control (§ 70 ElWG);
//    bis dahin KEIN Abschlag – deshalb nur Eingabefeld, Standard 0. Keine erfundenen Sätze.
//  - Lieferantenpflichten (§ 69 ElWG): laut Koordinationsstelle für Energiegemeinschaften bei
//    Haushaltskunden mit Erzeugungsanlagen über 30 kW, bei sonstigen aktiven Kunden über 100 kW.
//  - Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag entfallen nur in der EEG (§ 75 Abs. 5 EAG),
//    nicht bei P2P – daher hier nicht als Vorteil gerechnet.
//  - Alternative des Erzeugers: OeMAG-Marktpreis (src/data/oemag.js, Monatswerte PV).
//
// Vereinfachung: Die geteilte Menge ist der Anteil des Überschusses, der in derselben Viertelstunde
// beim Abnehmer verbraucht wird (Gleichzeitigkeit). Netzentgelte, Abgaben und Umsatzsteuer des
// Abnehmers bleiben unverändert, weil der P2P-Bezug zusätzlich zum Liefervertrag läuft.

import { OEMAG_MONATE, STAND as OEMAG_STAND } from "../../data/oemag.js";

export const STAND = OEMAG_STAND;

const letzte = (n) => OEMAG_MONATE.slice(-n);
const mittel = (liste) => (liste.length ? liste.reduce((a, m) => a + m.ct, 0) / liste.length : 0);
const rund = (x, stellen = 2) => Math.round(x * 10 ** stellen) / 10 ** stellen;

const letzterMonat = OEMAG_MONATE[OEMAG_MONATE.length - 1];
const jahr2025 = OEMAG_MONATE.filter((m) => m.monat.startsWith("2025-"));

/** Referenzwerte für „was der Erzeuger sonst bekäme“ – alle aus src/data/oemag.js. */
export const OEMAG_REFERENZEN = [
  { id: "mittel12", label: "OeMAG-Mittel 12 Monate", sub: `${letzte(12)[0].monat} bis ${letzterMonat.monat}`, ct: rund(mittel(letzte(12)), 3) },
  { id: "letzter", label: "Letzter OeMAG-Monat", sub: letzterMonat.monat, ct: letzterMonat.ct },
  { id: "jahr2025", label: "OeMAG-Mittel 2025", sub: "Jänner bis Dezember", ct: rund(mittel(jahr2025), 3) },
];

export const P2P_ANNAHMEN = {
  energiepreisCt: 14, // Energiepreis des Lieferanten netto, ct/kWh – Rechenannahme wie im Energiegemeinschafts-Rechner
  gleichzeitigkeit: 0.6, // Richtwert: Anteil des Überschusses, der zeitgleich beim Abnehmer verbraucht wird
  netzentgeltAbschlagCt: 0, // erst nach Verordnung der E-Control (§ 70 ElWG) – nur Eingabe
  lieferantenpflichtKw: { haushalt: 30, sonst: 100 }, // § 69 ElWG laut Koordinationsstelle für Energiegemeinschaften
  ustSatz: 0.2,
};

export const STANDARD = {
  ueberschussKwh: 30000,
  gleichzeitigkeit: P2P_ANNAHMEN.gleichzeitigkeit,
  p2pPreisCt: 10,
  referenz: "mittel12",
  energiepreisCt: P2P_ANNAHMEN.energiepreisCt,
  netzentgeltAbschlagCt: P2P_ANNAHMEN.netzentgeltAbschlagCt,
  anlageKwp: 30,
  erzeugerTyp: "sonst",
};

export const GRENZEN = {
  ueberschussKwh: { min: 1000, max: 500000 },
  gleichzeitigkeit: { min: 0.1, max: 1 },
  p2pPreisCt: { min: 0, max: 30 },
  energiepreisCt: { min: 5, max: 40 },
  netzentgeltAbschlagCt: { min: 0, max: 10 },
  anlageKwp: { min: 1, max: 5000 },
};

const klemme = (v, g) => Math.min(g.max, Math.max(g.min, Number.isFinite(v) ? v : g.min));

export function referenzFuer(id) {
  return OEMAG_REFERENZEN.find((r) => r.id === id) || OEMAG_REFERENZEN[0];
}

/** Lieferantenpflicht nach § 69 ElWG – nur die Schwelle, keine Rechtsberatung. */
export function lieferantenpflicht(anlageKwp, erzeugerTyp = "sonst") {
  const schwelle = erzeugerTyp === "haushalt" ? P2P_ANNAHMEN.lieferantenpflichtKw.haushalt : P2P_ANNAHMEN.lieferantenpflichtKw.sonst;
  const trifft = anlageKwp > schwelle;
  return {
    trifft,
    schwelleKw: schwelle,
    text: trifft
      ? `Anlage über ${schwelle} kW: Laut Koordinationsstelle gelten ab dieser Schwelle Lieferantenpflichten nach § 69 ElWG (Allgemeine Lieferbedingungen, Informationsblatt, Änderungsmitteilung einen Monat vorab, transparente Rechnung, Wahlrecht monatliche oder jährliche Rechnung). Bitte rechtlich prüfen lassen.`
      : `Anlage bis ${schwelle} kW: Die Lieferantenpflichten nach § 69 ElWG greifen laut Koordinationsstelle erst über ${schwelle} kW (${erzeugerTyp === "haushalt" ? "Haushaltskunden" : "sonstige aktive Kunden"}).`,
  };
}

/**
 * Jahresrechnung für einen P2P-Vertrag.
 * Alle Preise netto in ct/kWh, Mengen in kWh/Jahr, Ergebnisse in €/Jahr.
 */
export function rechnePeerToPeer(eingabe = {}) {
  const e = { ...STANDARD, ...eingabe };
  const ueberschussKwh = klemme(e.ueberschussKwh, GRENZEN.ueberschussKwh);
  const gleichzeitigkeit = klemme(e.gleichzeitigkeit, GRENZEN.gleichzeitigkeit);
  const p2pPreisCt = klemme(e.p2pPreisCt, GRENZEN.p2pPreisCt);
  const energiepreisCt = klemme(e.energiepreisCt, GRENZEN.energiepreisCt);
  const netzentgeltAbschlagCt = klemme(e.netzentgeltAbschlagCt, GRENZEN.netzentgeltAbschlagCt);
  const anlageKwp = klemme(e.anlageKwp, GRENZEN.anlageKwp);
  const referenz = referenzFuer(e.referenz);
  const oemagCt = Number.isFinite(e.oemagCt) ? e.oemagCt : referenz.ct;

  const geteilteKwh = ueberschussKwh * gleichzeitigkeit;
  const restKwh = ueberschussKwh - geteilteKwh;

  // Erzeuger
  const erloesOhne = (ueberschussKwh * oemagCt) / 100; // alles an die OeMAG
  const erloesP2p = (geteilteKwh * p2pPreisCt) / 100;
  const erloesRest = (restKwh * oemagCt) / 100;
  const erloesMit = erloesP2p + erloesRest;
  const mehrerloes = erloesMit - erloesOhne; // = geteilteKwh × (p2p − oemag)

  // Abnehmer: zahlt statt Energiepreis des Lieferanten den P2P-Preis; Netzentgelt-Abschlag nur als Eingabe
  const ersparnisEnergie = (geteilteKwh * (energiepreisCt - p2pPreisCt)) / 100;
  const ersparnisNetz = (geteilteKwh * netzentgeltAbschlagCt) / 100;
  const ersparnisAbnehmer = ersparnisEnergie + ersparnisNetz;

  // Fairer Preis: Mitte zwischen OeMAG-Alternative und Energiepreis – beide gewinnen gleich viel je kWh
  const fairerPreisCt = rund((oemagCt + energiepreisCt) / 2, 2);
  const gesamtvorteil = mehrerloes + ersparnisEnergie; // Summe beider Seiten (ohne Netzentgelt-Eingabe)

  return {
    eingaben: { ueberschussKwh, gleichzeitigkeit, p2pPreisCt, energiepreisCt, netzentgeltAbschlagCt, anlageKwp, erzeugerTyp: e.erzeugerTyp, referenz: referenz.id },
    oemagCt,
    referenz,
    geteilteKwh,
    restKwh,
    erloesOhne,
    erloesP2p,
    erloesRest,
    erloesMit,
    mehrerloes,
    ersparnisEnergie,
    ersparnisNetz,
    ersparnisAbnehmer,
    gesamtvorteil,
    fairerPreisCt,
    preisUnterOemag: p2pPreisCt < oemagCt,
    preisUeberEnergiepreis: p2pPreisCt > energiepreisCt,
    lieferantenpflicht: lieferantenpflicht(anlageKwp, e.erzeugerTyp),
  };
}

// de-DE wie im übrigen Projekt (Tausenderpunkt; de-AT liefert in Node ein schmales Leerzeichen)
const de = (n, stellen = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });

/** CSV-Export (Semikolon, deutsches Dezimalkomma) – für den Export über das Lead-Gate. */
export function csvExport(r, stand = STAND.label) {
  const zeilen = [
    ["Peer-to-Peer-Rechner Ökovolt", `Stand ${stand}`],
    ["Richtwert / Orientierung – keine Rechts- oder Steuerberatung", ""],
    ["", ""],
    ["Eingabe", "Wert"],
    ["Überschuss (kWh/Jahr)", de(r.eingaben.ueberschussKwh)],
    ["Gleichzeitigkeit (%)", de(r.eingaben.gleichzeitigkeit * 100)],
    ["P2P-Preis (ct/kWh netto)", de(r.eingaben.p2pPreisCt, 2)],
    [`OeMAG-Referenz (${r.referenz.label}, ct/kWh)`, de(r.oemagCt, 3)],
    ["Energiepreis Lieferant (ct/kWh netto)", de(r.eingaben.energiepreisCt, 2)],
    ["Netzentgelt-Abschlag (ct/kWh, Eingabe)", de(r.eingaben.netzentgeltAbschlagCt, 2)],
    ["Anlagenleistung (kWp)", de(r.eingaben.anlageKwp)],
    ["", ""],
    ["Ergebnis (€/Jahr)", "Wert"],
    ["Geteilte Menge (kWh)", de(r.geteilteKwh)],
    ["Erlös Erzeuger ohne P2P (alles OeMAG)", de(r.erloesOhne, 2)],
    ["Erlös Erzeuger mit P2P", de(r.erloesMit, 2)],
    ["Mehrerlös Erzeuger", de(r.mehrerloes, 2)],
    ["Ersparnis Abnehmer Energie", de(r.ersparnisEnergie, 2)],
    ["Ersparnis Abnehmer Netzentgelt (Eingabe)", de(r.ersparnisNetz, 2)],
    ["Ersparnis Abnehmer gesamt", de(r.ersparnisAbnehmer, 2)],
    ["Fairer Preis (Mitte, ct/kWh)", de(r.fairerPreisCt, 2)],
    ["Lieferantenpflicht § 69 ElWG", r.lieferantenpflicht.trifft ? `ja (über ${r.lieferantenpflicht.schwelleKw} kW)` : `nein (bis ${r.lieferantenpflicht.schwelleKw} kW)`],
    ["", ""],
    ["Quelle OeMAG", "https://www.oem-ag.at/marktpreis"],
    ["Quelle ElWG", "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91"],
  ];
  return zeilen.map((z) => z.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(";")).join("\r\n");
}
