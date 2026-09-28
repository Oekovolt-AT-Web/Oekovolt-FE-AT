// src/data/einspeiseverguetung.js
//
// EINZIGE Quelle für Einspeise-Erlöse in Österreich (Rechner, Ratgeber, Tabellen,
// JSON-LD). Stand: 29.09.2026.
//
// WICHTIG – Österreich ist NICHT Deutschland:
// Es gibt für neue PV-Anlagen KEINE gesetzlich garantierte, 20 Jahre feste
// Einspeisevergütung wie nach dem deutschen EEG. Überschussstrom wird verkauft an
//   (a) die OeMAG zum Marktpreis (§ 13 Abs. 3 i. V. m. § 41 Abs. 2a ÖSG 2012):
//       monatlich rückwirkend ermittelt = mengengewichtetes Monatsmittel der
//       Day-Ahead-Preise AT, begrenzt auf einen Korridor von 60–100 % des
//       Quartals-Marktpreises der E-Control (§ 41 Abs. 1 ÖSG 2012), seit 2026
//       abzüglich Ausgleichsenergie (PV 0,408 ct/kWh). Nur Anlagen < 500 kWp,
//       Verträge längstens bis 31.12.2030, Kündigung nach 12 Monaten mit 4 Wochen Frist.
//       Quelle: https://www.oem-ag.at/marktpreis (Monatswerte, PDFs 2024/2025)
//   (b) einen Energieversorger/Stromhändler – meist monatlich an einen
//       Referenzmarktwert/ÖSPI gekoppelt, teils fixe Staffeltarife, oft nur für
//       eigene Bezugskunden und bis 25–250 kWp;
//   (c) einen Direktvermarkter (Spotmarkt-Erlös abzüglich Entgelt, Festpreis, PPA).
//
// ABBILDUNG DER DEUTSCHEN FELDER (Exportnamen für alle Importeure kompatibel):
//   saetze[].teileinspeisung  = Rechensatz für Überschusseinspeisung (ct/kWh, netto)
//   saetze[].volleinspeisung  = identisch – Volleinspeisung wird in AT nicht höher vergütet
//   garantieJahre             = 20 = BETRACHTUNGSZEITRAUM der Rechner, KEINE Garantie
//                               (siehe `garantiert: false`, `betrachtungJahre`)
//   degressionProHalbjahr     = 0 (keine gesetzliche Degression in AT)
//   gueltigAb / …Label        = Stand des jüngsten veröffentlichten OeMAG-Monatspreises
//   naechsteAnpassung…        = nächste Veröffentlichung (OeMAG, Anfang Folgemonat)
//   quelle                    = OeMAG-Marktpreis (statt Bundesnetzagentur)
//
// RECHENSATZ (saetze): bewusst vorsichtig, weil der Erlös marktabhängig ist und
// der Rechner ihn 20 Jahre konstant hält. Herleitung (eigene Auswertung):
//   - OeMAG-Monatspreis PV, Sep 2025–Aug 2026, gewichtet mit dem monatlichen
//     PV-Erzeugungsprofil der Rechner: ≈ 7,2 ct/kWh (ungewichtet 7,6 ct/kWh).
//   - Referenzmarktwert PV (E-Control, § 13 EAG), gleicher Zeitraum, gewichtet:
//     ≈ 6,3 ct/kWh; typische Händlerformel (z. B. RMW × 0,85 − 0,54 ct) ≈ 4,8 ct/kWh.
//   - Solar-Capture-Price AT 2025: 49,3 €/MWh = 50 % des Base-Preises
//     (eigene Auswertung Energy-Charts-Daten) – Tendenz fallend bei weiterem PV-Zubau.
//   → bis 500 kWp 6,0 ct/kWh; darüber (keine OeMAG-Abnahme, Direktvermarktung
//     mit Vermarktungsentgelt) 5,5 ct/kWh.

export const VERGUETUNG = {
  land: "AT",
  stand: "2026-09",
  // Stand des jüngsten OeMAG-Monatspreises (August 2026, veröffentlicht Anfang September)
  gueltigAb: "2026-09-01",
  gueltigBis: "2026-09-30",
  naechsteAnpassung: "2026-10-01",
  gueltigAbLabel: "September 2026",
  naechsteAnpassungLabel: "Anfang Oktober 2026 (OeMAG-Marktpreis September)",
  degressionProHalbjahr: 0, // DE-Begriff; in AT keine gesetzliche Degression
  quelle: {
    name: "OeMAG – Marktpreis",
    url: "https://www.oem-ag.at/marktpreis",
  },

  // Rechensätze in ct/kWh (netto), anteilig nach Anlagengröße (mischSatz/satzFuer).
  // Drei Klassen bleiben erhalten, weil Importeure saetze[0..2] lesen.
  saetze: [
    {
      klasse: "bis 20 kWp",
      von: 0,
      bis: 20,
      teileinspeisung: 6.0,
      volleinspeisung: 6.0,
      abnehmer: "OeMAG (Marktpreis) oder Energieversorger",
    },
    {
      klasse: "20 bis 500 kWp",
      von: 20,
      bis: 500,
      teileinspeisung: 6.0,
      volleinspeisung: 6.0,
      abnehmer: "OeMAG (Marktpreis, unter 500 kWp), Stromhändler oder Direktvermarkter",
    },
    {
      klasse: "ab 500 kWp",
      von: 500,
      bis: 1000,
      teileinspeisung: 5.5,
      volleinspeisung: 5.5,
      abnehmer: "Direktvermarkter / PPA (keine OeMAG-Abnahme ab 500 kWp)",
    },
  ],

  // 20 Jahre = Betrachtungszeitraum der Rechner, KEINE Garantie (s. o.)
  garantieJahre: 20,
  betrachtungJahre: 20,
  garantiert: false,

  // --- OeMAG-Marktpreis Photovoltaik (ct/kWh, netto) ------------------------
  // Monatswerte: OeMAG, https://www.oem-ag.at/marktpreis (abgerufen 28./29.09.2026;
  // 2024/2025 aus den PDFs Marktpreise_2024.pdf / Marktpreise_2025.pdf).
  // Quartals-Marktpreise § 41 Abs. 1 ÖSG 2012: E-Control Marktpreis-Archiv,
  // gegengeprüft über smartmeter-portal.at (Stand 01.07.2026) und die OeMAG-Grenzwerte.
  marktpreis: {
    aktuell: { zeitraum: "August 2026", ct: 8.997, wind: 8.951 },
    ausgleichsenergieAbzug2026: 0.408, // ct/kWh PV (Wind 0,454), ab 2026
    anlagenGrenzeKwp: 500,
    vertragBis: "2030-12-31",
    monate: [
      { monat: "2025-09", ct: 5.892 },
      { monat: "2025-10", ct: 9.008 },
      { monat: "2025-11", ct: 9.167 },
      { monat: "2025-12", ct: 9.167 },
      { monat: "2026-01", ct: 8.842 },
      { monat: "2026-02", ct: 8.457 },
      { monat: "2026-03", ct: 5.72 },
      { monat: "2026-04", ct: 6.772 },
      { monat: "2026-05", ct: 6.772 },
      { monat: "2026-06", ct: 6.772 },
      { monat: "2026-07", ct: 6.146 },
      { monat: "2026-08", ct: 8.997 },
    ],
    quartale: [
      { quartal: "Q1 2024", ct: 9.626 },
      { quartal: "Q2 2024", ct: 7.758 },
      { quartal: "Q3 2024", ct: 8.899 },
      { quartal: "Q4 2024", ct: 8.7 },
      { quartal: "Q1 2025", ct: 9.73 },
      { quartal: "Q2 2025", ct: 9.759 },
      { quartal: "Q3 2025", ct: 9.82 },
      { quartal: "Q4 2025", ct: 9.167 },
      { quartal: "Q1 2026", ct: 9.25 },
      { quartal: "Q2 2026", ct: 11.967 },
      { quartal: "Q3 2026", ct: 10.923 },
    ],
    quelleQuartale: {
      name: "E-Control – Marktpreis-Archiv (§ 41 ÖSG 2012)",
      url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis-archiv",
    },
  },

  // --- Referenzmarktwert PV (§ 13 EAG, E-Control), ct/kWh ---------------------
  // Quelle: https://www.e-control.at/documents/1785851/10823410/Referenzmarktwert_Entwicklung.xlsx
  referenzmarktwert: [
    { monat: "2025-09", ct: 4.84 },
    { monat: "2025-10", ct: 8.85 },
    { monat: "2025-11", ct: 10.24 },
    { monat: "2025-12", ct: 11.26 },
    { monat: "2026-01", ct: 13.95 },
    { monat: "2026-02", ct: 8.16 },
    { monat: "2026-03", ct: 5.94 },
    { monat: "2026-04", ct: 1.7 },
    { monat: "2026-05", ct: 3.76 },
    { monat: "2026-06", ct: 5.55 },
    { monat: "2026-07", ct: 6.85 },
    { monat: "2026-08", ct: 9.42 },
  ],

  // --- Einspeisetarife der Energieversorger (netto) ---------------------------
  // Tarifvergleiche (stromliste.at, Stand 15.09.2026; Versorger-Tarifblätter
  // 08–09/2026): überwiegend ca. 2–11 ct/kWh; 2026 typisch 4–10 ct/kWh, in
  // sonnenreichen Monaten mit marktgekoppelten Tarifen deutlich darunter.
  tarife: {
    min: 4,
    max: 10,
    stand: "September 2026",
    hinweis:
      "Meist monatlich an Referenzmarktwert oder Strompreisindex gekoppelt, teils fixe Staffeltarife; häufig nur für eigene Bezugskunden und bis 25–250 kWp.",
  },

  // Private Einspeiser: Einkünfte steuerfrei, wenn gleichzeitig ≤ 25 kW
  // Engpassleistung, ≤ 35 kWp Modulleistung und ≤ 12.500 kWh Einspeisung/Jahr
  // (§ 3 Abs. 1 Z 39 EStG). Betriebe versteuern Einspeiseerlöse normal.
  steuerfreiPrivat: { kwMax: 25, kwpMax: 35, kwhMax: 12500 },
};

/** Österreichische/deutsche Zahlenformatierung: 7.7 -> "7,70" */
export function ct(value) {
  return value.toFixed(2).replace(".", ",");
}

/**
 * Rechensatz für eine Anlagengröße (vereinfacht: erster passender Block).
 * Für anteilige Mischung über mehrere Klassen: mischSatz() in src/lib/solarrechner.js.
 */
export function satzFuer(kwp, art = "teileinspeisung") {
  const treffer =
    VERGUETUNG.saetze.find((s) => kwp > s.von && kwp <= s.bis) ??
    VERGUETUNG.saetze[VERGUETUNG.saetze.length - 1];
  return treffer[art];
}

/** Mittelwert der veröffentlichten OeMAG-Monatspreise der letzten n Monate (ct/kWh). */
export function marktpreisMittel(n = 12) {
  const m = VERGUETUNG.marktpreis.monate.slice(-n);
  return m.reduce((a, b) => a + b.ct, 0) / (m.length || 1);
}
