// src/data/oemag.js
//
// Einspeise-Marktdaten Österreich für /einspeisung-gewerbe – jede Zahl mit Quelle und Abrufdatum.
// Reine Daten ohne Imports (auch mit node in scripts/einspeisung.test.mjs lesbar).
//
// PFLEGE (monatlich, Anfang des Folgemonats):
//   1. https://www.oem-ag.at/marktpreis öffnen, neuen Monatswert PV („Photovoltaik und andere
//      Energieträger (außer Windkraft)“) samt Kommentar in OEMAG_MONATE ergänzen.
//   2. Referenzmarktwert PV aus der E-Control-Tabelle (REFERENZMARKTWERT_PV) nachtragen.
//   3. Quartalsende: neuen Quartalsmarktpreis der E-Control in QUARTALSPREISE eintragen.
//   4. STAND.geprueftAm auf das Prüfdatum setzen – sonst warnt die Seite nach 35 Tagen.
//   Keine automatisierten Abrufe von Versorger-Preisblättern oder Tarifkalkulatoren.
//
// Geprüft am 30.09.2026:
//   - OeMAG Marktpreis-Seite (Tabelle 2026, Kommentar je Monat, Ausgleichsenergie, Vertragsregeln)
//   - OeMAG Marktpreise_2024.pdf und Marktpreise_2025.pdf (Tabellen je Monat mit Kommentar)
//   - E-Control „Aktueller Marktpreis“ (Q4/2026 = 152,82 €/MWh, berechnet mit EEX-Settlements
//     22.–28.09.2026, Stand 29.09.2026) und Marktpreis-Archiv
//   - E-Control Referenzmarktwert_Entwicklung.xlsx (§ 13 EAG, Monatswerte PV ab 2022)
//   - Land OÖ, Photovoltaik-Leitfaden (Stand Juni 2026), Abschnitt Marktprämie; EAG-Abwicklungsstelle
//     Meldung zur 2. Ausschreibung 2026

export const STAND = { geprueftAm: "2026-09-30", label: "30.09.2026" };

/** Nach so vielen Tagen ohne Prüfung zeigt die Seite eine Warnung. */
export const FRISCHE_GRENZE_TAGE = 35;

export const NAECHSTE_VEROEFFENTLICHUNG = {
  was: "OeMAG-Marktpreis für September 2026",
  wann: "Anfang Oktober 2026",
  hinweis: "Die OeMAG veröffentlicht den Monatswert jeweils zu Beginn des Folgemonats.",
};

export const QUELLEN = {
  oemag: { label: "OeMAG – Marktpreis (Monatswerte 2026, Berechnung, Vertragsdauer, Kündigung)", url: "https://www.oem-ag.at/marktpreis", abgerufen: "30.09.2026" },
  oemag2025: { label: "OeMAG – Marktpreise 2025 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/marktpreis/Marktpreise_2025.pdf", abgerufen: "30.09.2026" },
  oemag2024: { label: "OeMAG – Marktpreise 2024 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/marktpreis/Marktpreise_2024.pdf", abgerufen: "30.09.2026" },
  ecAktuell: { label: "E-Control – Aktueller Marktpreis nach § 41 ÖSG 2012 (4. Quartal 2026)", url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis", abgerufen: "30.09.2026" },
  ecArchiv: { label: "E-Control – Marktpreis-Archiv nach § 41 ÖSG 2012", url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis-archiv", abgerufen: "30.09.2026" },
  ecRmw: { label: "E-Control – Referenzmarktwert nach § 13 EAG, Monatswerte (Excel)", url: "https://www.e-control.at/documents/1785851/10823410/Referenzmarktwert_Entwicklung.xlsx", abgerufen: "30.09.2026" },
  ecTarifkalkulator: { label: "E-Control – Tarifkalkulator (Bereich „Strom Einspeisung“)", url: "https://www.e-control.at/tarifkalkulator", abgerufen: "30.09.2026" },
  ecUeberschuss: { label: "E-Control – Eigenverbraucher mit Überschusseinspeisung", url: "https://www.e-control.at/eigenverbraucher-mit-ueberschusseinspeisung", abgerufen: "30.09.2026" },
  eagAusschreibung: { label: "EAG-Abwicklungsstelle – 2. Ausschreibung Marktprämie PV 2026 bezuschlagt (13.07.2026)", url: "https://www.eag-abwicklungsstelle.at/artikel/die-2-ausschreibung-zur-marktpraemie-fuer-pv-anlagen-wurde-mit-10-juli-2026-bezuschlagt/", abgerufen: "30.09.2026" },
  ooeLeitfaden: { label: "Land Oberösterreich – Photovoltaik-Leitfaden, Stand Juni 2026 (Marktprämie, Gebotstermine)", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf", abgerufen: "30.09.2026" },
  oesg: { label: "Ökostromgesetz 2012 (§ 13, § 41) – RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007386", abgerufen: "30.09.2026" },
  eag: { label: "Erneuerbaren-Ausbau-Gesetz (EAG) – RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011619", abgerufen: "30.09.2026" },
  pvgis: { label: "PVGIS v5.3 (EU JRC) – Monatsertrag Ostermiething, Süd 35°", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", abgerufen: "28.09.2026" },
};

/**
 * Grundlage des Monatswerts laut Kommentarspalte der OeMAG:
 *   "day-ahead"   = durchschnittlich mengengewichteter Day-Ahead-Stundenpreis (ab 2026 abzügl. Ausgleichsenergie)
 *   "untergrenze" = 60 % des Marktpreises gemäß § 41 Abs. 1 ÖSG (ab 2026 abzügl. Ausgleichsenergie)
 *   "obergrenze"  = Marktpreis gemäß § 41 Abs. 1 ÖSG (ab 2026 abzügl. Ausgleichsenergie)
 */
export const GRUNDLAGE_TEXT = {
  "day-ahead": "Day-Ahead-Mittel",
  untergrenze: "Untergrenze (60 %)",
  obergrenze: "Obergrenze (100 %)",
};

// OeMAG-Marktpreis Photovoltaik (und andere Energieträger außer Wind), ct/kWh netto.
// 2024: Marktpreise_2024.pdf · 2025: Marktpreise_2025.pdf · 2026: Tabelle auf oem-ag.at/marktpreis
export const OEMAG_MONATE = [
  { monat: "2024-01", ct: 8.137, grundlage: "day-ahead", quelle: "oemag2024" },
  { monat: "2024-02", ct: 6.293, grundlage: "day-ahead", quelle: "oemag2024" },
  { monat: "2024-03", ct: 5.776, grundlage: "untergrenze", quelle: "oemag2024" },
  { monat: "2024-04", ct: 4.655, grundlage: "untergrenze", quelle: "oemag2024" },
  { monat: "2024-05", ct: 4.655, grundlage: "untergrenze", quelle: "oemag2024" },
  { monat: "2024-06", ct: 4.655, grundlage: "untergrenze", quelle: "oemag2024" },
  { monat: "2024-07", ct: 5.339, grundlage: "untergrenze", quelle: "oemag2024" },
  { monat: "2024-08", ct: 5.827, grundlage: "day-ahead", quelle: "oemag2024" },
  { monat: "2024-09", ct: 6.038, grundlage: "day-ahead", quelle: "oemag2024" },
  { monat: "2024-10", ct: 6.867, grundlage: "day-ahead", quelle: "oemag2024" },
  { monat: "2024-11", ct: 8.7, grundlage: "obergrenze", quelle: "oemag2024" },
  { monat: "2024-12", ct: 8.7, grundlage: "obergrenze", quelle: "oemag2024" },
  { monat: "2025-01", ct: 9.73, grundlage: "obergrenze", quelle: "oemag2025" },
  { monat: "2025-02", ct: 9.73, grundlage: "obergrenze", quelle: "oemag2025" },
  { monat: "2025-03", ct: 6.007, grundlage: "day-ahead", quelle: "oemag2025" },
  { monat: "2025-04", ct: 5.855, grundlage: "untergrenze", quelle: "oemag2025" },
  { monat: "2025-05", ct: 5.855, grundlage: "untergrenze", quelle: "oemag2025" },
  { monat: "2025-06", ct: 5.855, grundlage: "untergrenze", quelle: "oemag2025" },
  { monat: "2025-07", ct: 5.965, grundlage: "day-ahead", quelle: "oemag2025" },
  { monat: "2025-08", ct: 5.892, grundlage: "untergrenze", quelle: "oemag2025" },
  { monat: "2025-09", ct: 5.892, grundlage: "untergrenze", quelle: "oemag2025" },
  { monat: "2025-10", ct: 9.008, grundlage: "day-ahead", quelle: "oemag2025" },
  { monat: "2025-11", ct: 9.167, grundlage: "obergrenze", quelle: "oemag2025" },
  { monat: "2025-12", ct: 9.167, grundlage: "obergrenze", quelle: "oemag2025" },
  { monat: "2026-01", ct: 8.842, grundlage: "obergrenze", quelle: "oemag" },
  { monat: "2026-02", ct: 8.457, grundlage: "day-ahead", quelle: "oemag" },
  { monat: "2026-03", ct: 5.72, grundlage: "day-ahead", quelle: "oemag" },
  { monat: "2026-04", ct: 6.772, grundlage: "untergrenze", quelle: "oemag" },
  { monat: "2026-05", ct: 6.772, grundlage: "untergrenze", quelle: "oemag" },
  { monat: "2026-06", ct: 6.772, grundlage: "untergrenze", quelle: "oemag" },
  { monat: "2026-07", ct: 6.146, grundlage: "untergrenze", quelle: "oemag" },
  { monat: "2026-08", ct: 8.997, grundlage: "day-ahead", quelle: "oemag" },
];

// Marktpreis Windkraft 2026 (nur zur Einordnung; ab 2026 anderer Ausgleichsenergie-Abzug)
export const OEMAG_WIND_2026 = { "2026-08": 8.951 };

// Aufwand für Ausgleichsenergie, der vom Marktpreis abgezogen wird (ct/kWh, PV und andere außer Wind).
// 2024 und 2025: kein Abzug (Fußnoten der OeMAG-PDFs). 2026: 0,408 ct PV, 0,454 ct Wind (OeMAG, Basis 2025).
export const AUSGLEICHSENERGIE_PV = { 2024: 0, 2025: 0, 2026: 0.408 };
export const AUSGLEICHSENERGIE_WIND_2026 = 0.454;

// Quartalsmarktpreis nach § 41 Abs. 1 ÖSG 2012 (E-Control), ct/kWh.
// Q4/2026: E-Control „Aktueller Marktpreis“, 152,82 €/MWh (Quelle EEX, 29.09.2026), nach 109,23 €/MWh in Q3/2026.
// Übrige Werte: E-Control Marktpreis-Archiv; jeder Wert ist mit den Unter-/Obergrenzen der OeMAG-Monatswerte
// konsistent (siehe scripts/einspeisung.test.mjs).
export const QUARTALSPREISE = [
  { quartal: "2024-Q1", ct: 9.626 },
  { quartal: "2024-Q2", ct: 7.758 },
  { quartal: "2024-Q3", ct: 8.899 },
  { quartal: "2024-Q4", ct: 8.7 },
  { quartal: "2025-Q1", ct: 9.73 },
  { quartal: "2025-Q2", ct: 9.759 },
  { quartal: "2025-Q3", ct: 9.82 },
  { quartal: "2025-Q4", ct: 9.167 },
  { quartal: "2026-Q1", ct: 9.25 },
  { quartal: "2026-Q2", ct: 11.967 },
  { quartal: "2026-Q3", ct: 10.923 },
  { quartal: "2026-Q4", ct: 15.282, veroeffentlicht: "2026-09-29" },
];

// Referenzmarktwert Photovoltaik nach § 13 EAG (E-Control), ct/kWh – österreichweiter, mit der
// PV-Einspeisung gewichteter Day-Ahead-Marktwert. Grundlage der EAG-Marktprämie; hier als neutraler
// Richtwert für den Markterlös einer Spot-Direktvermarktung vor Entgelt.
export const REFERENZMARKTWERT_PV = [
  { monat: "2024-01", ct: 8.03 },
  { monat: "2024-02", ct: 6.18 },
  { monat: "2024-03", ct: 4.62 },
  { monat: "2024-04", ct: 3.12 },
  { monat: "2024-05", ct: 3.34 },
  { monat: "2024-06", ct: 4.24 },
  { monat: "2024-07", ct: 4.27 },
  { monat: "2024-08", ct: 5.75 },
  { monat: "2024-09", ct: 5.86 },
  { monat: "2024-10", ct: 6.19 },
  { monat: "2024-11", ct: 12.08 },
  { monat: "2024-12", ct: 13.32 },
  { monat: "2025-01", ct: 13.15 },
  { monat: "2025-02", ct: 12.52 },
  { monat: "2025-03", ct: 6.41 },
  { monat: "2025-04", ct: 2.63 },
  { monat: "2025-05", ct: 1.49 },
  { monat: "2025-06", ct: 1.61 },
  { monat: "2025-07", ct: 5.91 },
  { monat: "2025-08", ct: 3.21 },
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
  { monat: "2026-08", ct: 9.42, veroeffentlicht: "2026-09-04" },
];

// Monatlicher PV-Ertrag (kWh/kWp) Ostermiething, Süd 35° – PVGIS v5.3, SARAH3 2005–2023,
// 14 % Systemverluste, mit Horizont (aus src/data/regionen-pvgis.json, abgerufen 28.09.2026).
// Dient als Näherung, wie sich eine Überschussmenge auf die Monate verteilt.
export const PV_PROFIL = {
  monate: [48, 71, 102, 121, 123, 130, 133, 124, 107, 85, 53, 45],
  quelle: "pvgis",
  hinweis: "Erzeugungsprofil als Näherung – der tatsächliche Überschuss liegt je nach Lastgang noch stärker im Sommer.",
};

// Rahmen der OeMAG-Abnahme (oem-ag.at/marktpreis, § 13 Abs. 1 ÖSG 2012)
export const OEMAG_REGELN = {
  grenzeKwp: 500, // Kontrahierungspflicht nur unter 500 kW(p) Engpassleistung
  vertragBis: "31.12.2030",
  mindestMonate: 12,
  kuendigung: "nach 12 Monaten jederzeit schriftlich, 4 Wochen zum Monatsletzten",
  bearbeitung: "2–4 Wochen",
  ausnahmen: [
    "Anlagen mit aufrechtem Fördertarif-Vertrag",
    "Anlagen ab 500 kW Engpassleistung",
    "Misch- und Hybridanlagen sowie Anlagen auf Basis von Tiermehl, Ablauge oder Klärschlamm",
  ],
};

// EAG-Marktprämie Photovoltaik (Land OÖ Leitfaden Juni 2026; EAG-Abwicklungsstelle 13.07.2026)
export const MARKTPRAEMIE = {
  mindestKwp: 10, // „mehr als 10 kWpeak“, neu errichtet oder erweitert
  jahre: 20,
  hoechstpreis2026Ct: 7.77,
  gebotstermine2026: ["17.03.2026", "11.06.2026", "24.09.2026", "10.12.2026"],
  volumenJeTerminKwp: 175000,
  zweiteAusschreibung: { volumenKwp: 179033, bisCt: 6.69, zuschlag: "10.07.2026" },
  freiflaechenAbschlag: 0.25,
};
