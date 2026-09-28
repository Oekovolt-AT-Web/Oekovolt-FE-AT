// src/data/stellen.js
//
// Ganzjährig ausgeschriebene Stellen der Ökovolt Solartechnik GmbH
// (Ostermiething, Österreich). Exporte STELLEN, STELLEN_DATUM und BEREICHE
// bleiben namensgleich – genutzt von src/app/sitemap.js,
// src/components/Jobs/jobDaten.js und src/app/uber-uns/jobs/[title]/page.js.
//
// ENTGELTANGABE NACH § 9 ABS 2 GlBG: Jede Stellenanzeige muss das für den
// Arbeitsplatz geltende kollektivvertragliche Mindestentgelt nennen und – falls
// zutreffend – die Bereitschaft zur Überzahlung. Dafür trägt jede Stelle ein
// Feld `kv` mit Vertrag, Einstufung und Mindestbetrag (brutto/Monat, Vollzeit).
//
// WELCHER KOLLEKTIVVERTRAG? Die KV-Zugehörigkeit richtet sich nach der
// Fachorganisation der WKO. Die Ökovolt Solartechnik GmbH ist Mitglied der
// Landesinnung der Elektro-, Gebäude-, Alarm- und Kommunikationstechniker
// (Sparte Gewerbe und Handwerk, siehe src/lib/site.js). Deshalb gelten die
// Kollektivverträge des Gewerbes – NICHT der KV der Elektro- und
// Elektronikindustrie (FEEI), der nur für Industriebetriebe gilt:
//   - Arbeiter:innen: KV für das Eisen- und Metallverarbeitende Gewerbe,
//     Lohnordnung gültig ab 1.1.2026; Geltungsbereich umfasst laut WKO die
//     Bundesinnung der Elektro-, Gebäude-, Alarm- und Kommunikationstechniker.
//   - Angestellte: Gehaltsordnung für die Angestellten im Metallgewerbe
//     (gilt laut WKO auch für die Elektro-, Gebäude-, Alarm- und
//     Kommunikationstechniker), gültig ab 1.1.2026.
// Quellen (abgerufen 28.09.2026):
//   https://www.wko.at/kollektivvertrag/lohnordnung-metallgewerbe-arbeiter-2026
//   https://www.wko.at/kollektivvertrag/information-kollektivvertragsabschluss-metallgewerbe-2026
//   https://www.wko.at/kollektivvertrag/gehaltsordnung-metallgewerbe-angestellte-2026-27
//   GPA-Gehaltstabelle „Mindestgehaltsordnung für die Angestellten im Metallgewerbe, gültig ab 1.1.2026“
// PFLEGE: Die Beträge ändern sich mit jedem KV-Abschluss (nächster: 1.1.2027,
// Facharbeiter-Einstieg dann mind. 3.000 €). KV_STAND und die Beträge unten
// jedes Jahr im Jänner aktualisieren. Einstufungen vor Veröffentlichung mit der
// Lohnverrechnung abstimmen.
//
// VOM UNTERNEHMEN ZU BESTÄTIGEN: Zusatzleistungen in VORTEILE_*, Arbeitszeitmodelle.

export const STELLEN_DATUM = "2026-09-28";

/** Stichtag der eingetragenen KV-Mindestbeträge. */
export const KV_STAND = "2026-01-01";

export const KV = {
  arbeiter: {
    name: "Kollektivvertrag für Arbeiter:innen im Eisen- und Metallverarbeitenden Gewerbe, der auch die Elektro-, Gebäude-, Alarm- und Kommunikationstechniker umfasst",
    kurz: "KV Metallgewerbe / Elektrotechnik – Arbeiter:innen",
    link: "https://www.wko.at/kollektivvertrag/lohnordnung-metallgewerbe-arbeiter-2026",
  },
  angestellte: {
    name: "Kollektivvertrag für Angestellte im Metallgewerbe bzw. in der Elektro-, Gebäude-, Alarm- und Kommunikationstechnik",
    kurz: "KV Metallgewerbe / Elektrotechnik – Angestellte",
    link: "https://www.wko.at/kollektivvertrag/gehaltsordnung-metallgewerbe-angestellte-2026-27",
  },
};

/** Lehrlingseinkommen laut KV Arbeiter:innen, ab 1.1.2026 (brutto/Monat). */
export const LEHRLINGSEINKOMMEN = [
  { lehrjahr: 1, betrag: 1000.0 },
  { lehrjahr: 2, betrag: 1148.75 },
  { lehrjahr: 3, betrag: 1493.38 },
  { lehrjahr: 4, betrag: 2000.0 },
];

const VORTEILE_BASIS = [
  "Anstellung in einem inhabergeführten Unternehmen mit über 15 Jahren Photovoltaik-Erfahrung in der Gruppe",
  "Bezahlung über dem Kollektivvertrag – abhängig von Qualifikation und Erfahrung",
  "Herstellerschulungen und gezielte Weiterbildung",
  "Eigene Leittechnik (Parkregler, Fernwartung, SCADA) statt reiner Fremdsysteme",
  "Kurze Entscheidungswege und echter Gestaltungsspielraum",
];

const VORTEILE_TECHNIK = [
  ...VORTEILE_BASIS.slice(0, 3),
  "Hochwertiges Werkzeug, Messtechnik und persönliche Schutzausrüstung inkl. PSA gegen Absturz",
  "Firmenfahrzeug für Montage- und Serviceeinsätze",
  "Aufwandsentschädigungen (Tag- und Nächtigungsgeld) laut Kollektivvertrag",
  "Kurze Entscheidungswege und echter Gestaltungsspielraum",
];

const VORTEILE_BUERO = [...VORTEILE_BASIS, "Moderner Arbeitsplatz in Ostermiething mit aktueller Planungs- und Simulationssoftware"];

export const BEREICHE = ["Projekt & Planung", "Netz & Leittechnik", "Montage & Service", "Vertrieb & Beratung", "Ausbildung"];

const OSTERMIETHING = "Ostermiething";
const BUNDESWEIT = "Österreich (Montage bundesweit)";

export const STELLEN = [
  {
    slug: "projektleiter-photovoltaik-gewerbe-industrie",
    titel: "Projektleiter:in Photovoltaik (m/w/d) – Gewerbe, Industrie & Freifläche",
    kurz: "Projektleitung PV Gewerbe",
    bereich: "Projekt & Planung",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: OSTERMIETHING,
    arbeitsort: "Ostermiething (Büro), Baustellen in ganz Österreich",
    bildung: "HTL, FH/TU oder Meisterprüfung Elektrotechnik bzw. vergleichbare technische Ausbildung",
    erfahrungMonate: 36,
    skills: ["Projektleitung", "Photovoltaik ab 100 kWp", "TOR Erzeuger", "ÖVE/ÖNORM E 8101", "Kosten- und Terminsteuerung", "Subunternehmer-Koordination"],
    kv: { art: "angestellte", einstufung: "Verwendungsgruppe IV", mindest: 3415.01 },
    beschreibung:
      "Sie führen PV-Projekte für Betriebe, Landwirtschaft und Gemeinden zum Erfolg – vom Kick-off über Netzzugang und Bauausführung bis zur Inbetriebnahme mit dem Netzbetreiber. Termine, Kosten, Qualität und Arbeitssicherheit liegen in Ihrer Verantwortung.",
    aufgaben: [
      "Gesamtverantwortung für Dach- und Freiflächenanlagen ab rund 100 kWp in ganz Österreich",
      "Termin-, Kosten- und Ressourcensteuerung sowie Nachtragsmanagement",
      "Koordination von eigenen Montageteams, Elektro-Partnerbetrieben, Statik und Gerüstbau",
      "Abstimmung mit Netzbetreibern (Netzzugangsantrag, Anforderungen nach TOR Erzeuger) und Behörden",
      "Arbeitssicherheit nach BauKG und Qualitätssicherung auf der Baustelle",
      "Abnahme, Anlagendokumentation nach ÖVE/ÖNORM EN 62446-1 und Übergabe an den Kunden",
    ],
    qualifikationen: [
      "Abgeschlossene technische Ausbildung (HTL, FH/TU, Meister oder Werkmeister Elektrotechnik) oder gleichwertige Praxis",
      "Mehrjährige Erfahrung in der Leitung von Bau-, Elektro- oder Energieprojekten, gern Photovoltaik",
      "Kenntnisse der ÖVE/ÖNORM E 8101 und der Netzanschlussprozesse in Österreich",
      "Kaufmännisches Verständnis, Organisationstalent und sicheres Auftreten gegenüber Kunden",
      "Führerschein B, Reisebereitschaft innerhalb Österreichs, sehr gute Deutschkenntnisse",
    ],
    vorteile: VORTEILE_BUERO,
  },
  {
    slug: "elektrotechniker-photovoltaik-montage",
    titel: "Elektrotechniker:in / Monteur:in Photovoltaik (m/w/d) – AC-Anschluss, Speicher & Inbetriebnahme",
    kurz: "Elektrotechniker:in PV",
    bereich: "Montage & Service",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: BUNDESWEIT,
    arbeitsort: "Montage in ganz Österreich, Start ab Ostermiething",
    bildung: "Lehrabschluss Elektrotechnik (z. B. Anlagen- und Betriebstechnik, Gebäude- und Infrastrukturtechnik)",
    erfahrungMonate: 24,
    skills: ["AC-Installation", "Wechselrichter", "Batteriespeicher", "ÖVE/ÖNORM E 8101", "Erstprüfung", "Blitz- und Überspannungsschutz"],
    kv: { art: "arbeiter", einstufung: "Lohngruppe 3 (Facharbeiter:in)", mindest: 2948.85 },
    beschreibung:
      "Sie verbinden Generator, Wechselrichter, Speicher und Netz: Sie installieren die AC-Seite gewerblicher PV-Anlagen, bauen Verteiler und Schutzeinrichtungen, prüfen nach ÖVE/ÖNORM E 8101 und nehmen gemeinsam mit Projektleitung und Netzbetreiber in Betrieb.",
    aufgaben: [
      "AC-Installation von Wechselrichtern, Gewerbespeichern und Ladeinfrastruktur",
      "Aufbau von Verteilern, Übergabepunkten und Blitz- bzw. Überspannungsschutz",
      "DC-Verkabelung und Stringmessung gemeinsam mit dem Montageteam",
      "Erstprüfung nach ÖVE/ÖNORM E 8101 und Mitwirkung am Prüfbefund",
      "Inbetriebnahme inkl. Anbindung von Parkregler und Fernwartung",
      "Fotodokumentation und saubere Übergabe an Service und Kunden",
    ],
    qualifikationen: [
      "Lehrabschluss im Lehrberuf Elektrotechnik oder vergleichbar",
      "Berufserfahrung in der Elektroinstallation, gern mit PV, Speichern oder E-Mobilität",
      "Schwindelfreiheit und Bereitschaft zur Arbeit mit PSA gegen Absturz",
      "Selbstständige, sorgfältige Arbeitsweise und Teamgeist",
      "Führerschein B, Bereitschaft zu Montagen in ganz Österreich",
    ],
    vorteile: VORTEILE_TECHNIK,
  },
  {
    slug: "pv-monteur-unterkonstruktion-module",
    titel: "PV-Monteur:in Unterkonstruktion & Module (m/w/d) – Dach und Freifläche",
    kurz: "PV-Monteur:in Mechanik",
    bereich: "Montage & Service",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: BUNDESWEIT,
    arbeitsort: "Montage in ganz Österreich, Start ab Ostermiething",
    bildung: "Lehrabschluss als Dachdecker:in, Spengler:in, Zimmerer:in, Metalltechniker:in oder Montageerfahrung",
    erfahrungMonate: 12,
    skills: ["Unterkonstruktion", "Flachdach", "Freifläche", "Modulmontage", "Absturzsicherung", "Schneelast"],
    kv: { art: "arbeiter", einstufung: "Lohngruppe 5 (qualifizierte:r Arbeitnehmer:in), mit Lehrabschluss höher", mindest: 2627.28 },
    beschreibung:
      "Ein PV-Dach ist nur so gut wie seine Befestigung: Sie montieren Unterkonstruktionen und Module auf Hallen-, Flach- und Steildächern sowie auf Freiflächen – so, dass die Anlage Schnee und Sturm übersteht und das Dach dicht bleibt.",
    aufgaben: [
      "Montage von Unterkonstruktionen auf Trapezblech-, Folien-, Ziegel- und Eternitdächern",
      "Aufbau von Freiflächen- und Agri-PV-Gestellen",
      "Modulmontage nach Belegungsplan und Herstellervorgaben",
      "Einrichtung von Absturzsicherung und Arbeitsschutzmaßnahmen",
      "Qualitätskontrolle, Fotodokumentation und Übergabe an das Elektroteam",
    ],
    qualifikationen: [
      "Lehrabschluss in einem Bau- oder Metallberuf oder Erfahrung in der PV-Montage",
      "Schwindelfreiheit, körperliche Belastbarkeit und hohes Sicherheitsbewusstsein",
      "Unterweisung für PSA gegen Absturz bzw. Bereitschaft, diese zu erwerben",
      "Zuverlässigkeit, Sorgfalt und Teamgeist",
      "Führerschein B (BE von Vorteil)",
    ],
    vorteile: VORTEILE_TECHNIK,
  },
  {
    slug: "netzanschluss-eza-techniker-photovoltaik",
    titel: "Netzanschluss- & EZA-Techniker:in (m/w/d) – TOR Erzeuger, Parkregler & Inbetriebnahme",
    kurz: "Netzanschluss & EZA-Technik",
    bereich: "Netz & Leittechnik",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: OSTERMIETHING,
    arbeitsort: "Ostermiething, Inbetriebnahmen in ganz Österreich",
    bildung: "HTL oder FH Elektrotechnik/Energietechnik bzw. Meisterprüfung mit Netzerfahrung",
    erfahrungMonate: 24,
    skills: ["TOR Erzeuger Typ A/B", "Netzzugang", "Parkregler (EZA-Regler)", "Blindleistung Q(U)/cos φ", "Schutztechnik", "Mittelspannung"],
    kv: { art: "angestellte", einstufung: "Verwendungsgruppe IV", mindest: 3415.01 },
    beschreibung:
      "Ohne Netzanschluss keine Energiewende: Sie verantworten den technischen Weg vom Netzzugangsantrag bis zur Inbetriebnahme – inklusive Parametrierung unseres eigenen Parkreglers nach den Vorgaben der TOR Erzeuger und des jeweiligen Netzbetreibers.",
    aufgaben: [
      "Netzzugangsanträge und technische Abstimmung mit Netzbetreibern in ganz Österreich",
      "Umsetzung der Anforderungen aus TOR Erzeuger (Typ A und B): Wirk- und Blindleistungsregelung, Einspeisebegrenzung, Schutz",
      "Parametrierung und Inbetriebnahme unseres Parkreglers (EZA-Regler) und der Fernwirkanbindung",
      "Nachweise, Konformitätserklärungen und Inbetriebnahmeprotokolle",
      "Mitarbeit bei Anlagen am Mittelspannungsnetz (Netzebene 5/6) gemeinsam mit Partnern",
      "Weiterentwicklung unserer Standards für Netzanschluss und Regelung",
    ],
    qualifikationen: [
      "Technische Ausbildung (HTL, FH, Meister) in Elektro- oder Energietechnik",
      "Erfahrung mit Netzanschluss, Schutz- oder Regelungstechnik, idealerweise bei Erzeugungsanlagen",
      "Kenntnisse der TOR Erzeuger und der Netzebenen in Österreich",
      "Analytische, genaue Arbeitsweise und souveräne Kommunikation mit Netzbetreibern",
      "Führerschein B, sehr gute Deutschkenntnisse",
    ],
    vorteile: VORTEILE_BUERO,
  },
  {
    slug: "scada-leitwarte-techniker-photovoltaik",
    titel: "SCADA- & Leitwarten-Techniker:in (m/w/d) – Fernwartung und Monitoring von PV-Anlagen",
    kurz: "SCADA & Leitwarte",
    bereich: "Netz & Leittechnik",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: OSTERMIETHING,
    arbeitsort: "Ostermiething, anteilig mobiles Arbeiten nach Absprache",
    bildung: "HTL oder FH Elektrotechnik, Mechatronik, Informatik oder Automatisierungstechnik",
    erfahrungMonate: 12,
    skills: ["SCADA", "Fernwartung", "Modbus TCP", "Alarmmanagement", "Performance Ratio", "IT/OT-Sicherheit"],
    kv: { art: "angestellte", einstufung: "Verwendungsgruppe III, je nach Erfahrung höher", mindest: 2727.4 },
    beschreibung:
      "Sie behalten den Anlagenpark im Blick: In unserem eigenen SCADA-System überwachen Sie Erträge, Störungen und Regelbefehle, greifen per Fernwartung ein und machen aus Daten gezielte Serviceeinsätze – in enger Zusammenarbeit mit der Solensa GmbH für IT-Sicherheit.",
    aufgaben: [
      "Überwachung von PV-Anlagen und Speichern im eigenen SCADA-System",
      "Störungsanalyse per Fernwartung und Steuerung von Serviceeinsätzen",
      "Anbindung neuer Anlagen: Datenpunkte, Kommunikation (u. a. Modbus TCP), Alarmregeln",
      "Auswertung von Verfügbarkeit, Performance Ratio und Ertragsabweichungen",
      "Berichte für Betreiber und Mitwirkung an der sicheren Fernzugriffs-Infrastruktur",
    ],
    qualifikationen: [
      "Technische Ausbildung (HTL, FH) oder Lehrabschluss mit Zusatzqualifikation in Automatisierung/IT",
      "Verständnis von Wechselrichtern, Zählern, Netzwerken und Feldbussen",
      "Interesse an Daten und strukturierter Fehlersuche",
      "Bereitschaft zu Rufbereitschaft nach Vereinbarung",
      "Sehr gute Deutsch- und gute Englischkenntnisse",
    ],
    vorteile: VORTEILE_BUERO,
  },
  {
    slug: "servicetechniker-pv-wartung-anlagenpruefung",
    titel: "Servicetechniker:in PV-Wartung & Anlagenprüfung (m/w/d)",
    kurz: "Servicetechnik & Prüfung",
    bereich: "Montage & Service",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: BUNDESWEIT,
    arbeitsort: "Kundenanlagen in ganz Österreich, Start ab Ostermiething",
    bildung: "Lehrabschluss Elektrotechnik, gern mit Werkmeister- oder Meisterausbildung",
    erfahrungMonate: 24,
    skills: ["Wartung", "Wiederkehrende Prüfung", "ÖVE/ÖNORM E 8101", "ÖVE/ÖNORM EN 62446-1", "Kennlinienmessung", "Fehlersuche"],
    kv: { art: "arbeiter", einstufung: "Lohngruppe 3 (Facharbeiter:in), je nach Qualifikation höher", mindest: 2948.85 },
    beschreibung:
      "Sie sorgen dafür, dass Anlagen über Jahrzehnte liefern: Wartung nach Vertrag, wiederkehrende Prüfungen, Kennlinienmessung und Störungsbehebung – vor Ort und in Abstimmung mit unserer Leitwarte.",
    aufgaben: [
      "Wartung von PV-Anlagen, Speichern und Ladeinfrastruktur nach Wartungsvertrag",
      "Wiederkehrende Prüfung nach ÖVE/ÖNORM E 8101 und Prüfungen nach ÖVE/ÖNORM EN 62446-1",
      "I-U-Kennlinien- und Isolationsmessungen, Auswertung und Protokolle",
      "Fehlersuche und Instandsetzung, Wechselrichter- und Komponententausch",
      "Kundeneinweisung und Dokumentation im Serviceportal",
    ],
    qualifikationen: [
      "Lehrabschluss Elektrotechnik; Erfahrung mit Prüf- und Messtechnik",
      "Kenntnisse in PV, Speicher oder Gebäudetechnik",
      "Selbstständige, strukturierte Arbeitsweise und freundliches Auftreten",
      "Führerschein B, Bereitschaft zu Einsätzen in ganz Österreich",
    ],
    vorteile: VORTEILE_TECHNIK,
  },
  {
    slug: "drohnenpilot-thermografie-photovoltaik",
    titel: "Drohnenpilot:in Thermografie (m/w/d) – Inspektion von PV-Anlagen",
    kurz: "Drohnen-Thermografie",
    bereich: "Montage & Service",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: BUNDESWEIT,
    arbeitsort: "Anlagen in ganz Österreich, Auswertung in Ostermiething",
    bildung: "Technische Ausbildung (Lehre, HTL oder FH) mit Drohnen-Kompetenznachweis",
    erfahrungMonate: 12,
    skills: ["Drohnenflug (EU-Kategorie „offen“)", "Infrarot-Thermografie", "IEC 62446-3", "Hotspot-Analyse", "Berichtswesen"],
    kv: { art: "angestellte", einstufung: "Verwendungsgruppe III", mindest: 2727.4 },
    beschreibung:
      "Hotspots, defekte Bypassdioden, Verschmutzung und Stringausfälle erkennen Sie aus der Luft: Sie planen und fliegen Thermografie-Befliegungen von Dach- und Freiflächenanlagen und machen aus den Bildern belastbare Befundberichte.",
    aufgaben: [
      "Flugplanung inkl. Luftraumprüfung und Genehmigungen nach den Vorgaben der Austro Control",
      "Thermografie- und RGB-Befliegungen von Dach- und Freiflächenanlagen",
      "Auswertung nach IEC TS 62446-3 und Erstellung von Befundberichten",
      "Ableitung von Maßnahmen gemeinsam mit Service und Leitwarte",
      "Pflege von Drohne, Kamera und Flugdokumentation",
    ],
    qualifikationen: [
      "EU-Drohnenführerschein (Kompetenznachweis A1/A3, idealerweise A2) oder Bereitschaft, ihn zu erwerben",
      "Kenntnisse in Infrarot-Thermografie; Zertifizierung (z. B. Stufe 1 nach ISO 9712) von Vorteil",
      "Technisches Verständnis für PV-Module, Strings und Wechselrichter",
      "Genauigkeit, Wetter- und Reisebereitschaft, Führerschein B",
    ],
    vorteile: VORTEILE_TECHNIK,
  },
  {
    slug: "elektroplaner-photovoltaik-mittelspannung",
    titel: "Elektroplaner:in (m/w/d) Photovoltaik & Mittelspannung",
    kurz: "Elektroplanung PV",
    bereich: "Projekt & Planung",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: OSTERMIETHING,
    arbeitsort: "Ostermiething (Büro), gelegentliche Baustellentermine",
    bildung: "HTL, FH/TU Elektrotechnik oder Meisterprüfung mit Planungserfahrung",
    erfahrungMonate: 24,
    skills: ["AutoCAD / EPLAN", "Stringplanung", "Kabeldimensionierung", "ÖVE/ÖNORM E 8101", "OVE R 11-1", "Mittelspannung"],
    kv: { art: "angestellte", einstufung: "Verwendungsgruppe IV", mindest: 3415.01 },
    beschreibung:
      "Sie verwandeln Anlagenkonzepte in normgerechte Ausführungsplanung – vom Hallendach mit Gewerbespeicher bis zur Freiflächenanlage mit Trafostation. Ihre Pläne sind Grundlage für Montage, Netzanschluss, Brandschutz und Abnahme.",
    aufgaben: [
      "Strang- und Stringpläne, Übersichts- und Aufbaupläne in AutoCAD oder EPLAN",
      "Dimensionierung von Leitungen, Schutzorganen und Erdung nach ÖVE/ÖNORM E 8101",
      "Brandschutzkonzepte für PV nach OVE R 11-1 in Abstimmung mit Sachverständigen",
      "Planungsunterlagen für Netzzugang und Behörden",
      "Pflege von Planungsstandards und Revisionsunterlagen",
    ],
    qualifikationen: [
      "Technische Ausbildung (HTL, FH/TU, Meister) in Elektrotechnik",
      "Erfahrung in der Elektroplanung, idealerweise Photovoltaik oder Energietechnik",
      "Sicherer Umgang mit AutoCAD oder EPLAN; PV-Simulation (z. B. PV*SOL, PVsyst) von Vorteil",
      "Strukturierte, genaue Arbeitsweise, sehr gute Deutschkenntnisse",
    ],
    vorteile: VORTEILE_BUERO,
  },
  {
    slug: "key-account-manager-photovoltaik-gewerbe",
    titel: "Key Account Manager:in Photovoltaik (m/w/d) – Gewerbe, Industrie & öffentliche Hand",
    kurz: "Vertrieb Gewerbe",
    bereich: "Vertrieb & Beratung",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: OSTERMIETHING,
    arbeitsort: "Ostermiething und Kundentermine in ganz Österreich",
    bildung: "Technische oder kaufmännische Ausbildung (HTL, FH, Uni) mit B2B-Vertriebserfahrung",
    erfahrungMonate: 36,
    skills: ["B2B-Vertrieb", "Lastganganalyse", "Wirtschaftlichkeitsrechnung", "EAG-Förderung", "Ausschreibungen", "CRM"],
    kv: { art: "angestellte", einstufung: "Verwendungsgruppe IV", mindest: 3415.01 },
    beschreibung:
      "Sie gewinnen und begleiten Unternehmen, landwirtschaftliche Betriebe und Gemeinden, die ihre Energieversorgung selbst in die Hand nehmen – mit PV, Speicher und Ladeinfrastruktur, beraten auf Augenhöhe mit Geschäftsführung, Technik und Einkauf.",
    aufgaben: [
      "Akquise und Betreuung von Gewerbe-, Industrie- und Gemeindekunden in Österreich",
      "Bedarfsanalyse auf Basis von Lastgang, Flächen und Netzanschluss gemeinsam mit der Planung",
      "Angebote und Wirtschaftlichkeitsrechnungen inkl. Förderungen (EAG-Investitionszuschuss) und Finanzierung",
      "Begleitung öffentlicher Ausschreibungen nach Bundesvergabegesetz",
      "Verhandlung und Abschluss, Übergabe an die Projektleitung",
    ],
    qualifikationen: [
      "Nachweisbare Erfolge im B2B-Vertrieb technischer Lösungen, idealerweise Energie oder Gebäudetechnik",
      "Technisches Verständnis für PV, Speicher und Netzanschluss in Österreich",
      "Souveränes Auftreten, Verhandlungsstärke und Abschlussorientierung",
      "Führerschein B, Reisebereitschaft, sehr gute Deutschkenntnisse",
    ],
    vorteile: VORTEILE_BUERO,
  },
  {
    slug: "energieberater-gewerbe-landwirtschaft",
    titel: "Energieberater:in (m/w/d) – Gewerbe, Landwirtschaft & Gemeinden",
    kurz: "Energieberatung",
    bereich: "Vertrieb & Beratung",
    anstellungSchema: "FULL_TIME",
    anstellung: "Vollzeit",
    ort: OSTERMIETHING,
    arbeitsort: "Ostermiething und Vor-Ort-Termine in ganz Österreich",
    bildung: "Technische Ausbildung (HTL, FH) oder Energieberater-Ausbildung (z. B. A- und F-Kurs)",
    erfahrungMonate: 24,
    skills: ["Lastganganalyse", "Energieaudit", "Förderungen (EAG, UFI, Länder)", "Energiegemeinschaften", "Wirtschaftlichkeit"],
    kv: { art: "angestellte", einstufung: "Verwendungsgruppe IV", mindest: 3415.01 },
    beschreibung:
      "Sie zeigen Betrieben und Gemeinden, wo ihre Energie hingeht und was sich rechnet: Lastganganalyse, Eigenverbrauch, Speicher, Energiegemeinschaft und Förderungen – verständlich aufbereitet für Geschäftsführung und Gemeinderat.",
    aufgaben: [
      "Analyse von Lastgängen (Viertelstundenwerte) und Energieverbräuchen",
      "Konzepte für PV, Speicher, Lastmanagement und Energiegemeinschaften (EEG, BEG, GEA)",
      "Aufbereitung von Förderungen des Bundes und der Länder",
      "Unterstützung bei Energieaudits und Nachhaltigkeitsberichten",
      "Vorträge und Workshops für Betriebe und Gemeinden",
    ],
    qualifikationen: [
      "Technische Ausbildung oder anerkannte Energieberater-Ausbildung",
      "Erfahrung in Energieberatung, Energiemanagement oder Gebäudetechnik",
      "Sicherer Umgang mit Tabellenkalkulation und Auswertungswerkzeugen",
      "Klare Kommunikation, Führerschein B, sehr gute Deutschkenntnisse",
    ],
    vorteile: VORTEILE_BUERO,
  },
  {
    slug: "lehrling-elektrotechnik",
    titel: "Lehrling Elektrotechnik (m/w/d) – Anlagen- und Betriebstechnik oder Gebäude- und Infrastrukturtechnik",
    kurz: "Lehre Elektrotechnik",
    bereich: "Ausbildung",
    anstellungSchema: "OTHER",
    anstellung: "Lehre",
    ort: OSTERMIETHING,
    arbeitsort: "Ostermiething, Baustellen in der Region, Berufsschule",
    bildung: "Positiver Pflichtschulabschluss",
    erfahrungMonate: 0,
    skills: ["Elektrotechnik", "Photovoltaik", "Messtechnik", "Teamarbeit"],
    kv: { art: "arbeiter", einstufung: "Lehrlingseinkommen 1. Lehrjahr", mindest: 1000.0, lehre: true },
    beschreibung:
      "Starten Sie Ihre Ausbildung dort, wo die Energiewende gebaut wird: Im Lehrberuf Elektrotechnik lernen Sie Installation, Mess- und Prüftechnik – und von Anfang an Photovoltaik, Speicher und moderne Regelungstechnik.",
    aufgaben: [
      "Mitarbeit bei der Installation von PV-Anlagen, Speichern und Verteilern",
      "Grundlagen der Mess-, Prüf- und Schutztechnik",
      "Einblick in Netzanschluss, Parkregler und Fernwartung",
      "Berufsschule und betriebliche Ausbildung nach Ausbildungsplan",
    ],
    qualifikationen: [
      "Positiver Pflichtschulabschluss, Interesse an Technik und Mathematik",
      "Handwerkliches Geschick und Zuverlässigkeit",
      "Keine Höhenangst",
      "Freude an Teamarbeit und am Arbeiten im Freien",
    ],
    vorteile: [
      "Lehrlingseinkommen laut Kollektivvertrag: 1. Lehrjahr € 1.000,00, 2. Lehrjahr € 1.148,75, 3. Lehrjahr € 1.493,38, 4. Lehrjahr € 2.000,00 brutto pro Monat (Stand 1.1.2026)",
      "Ausbildung an echten Gewerbe- und Freiflächenanlagen",
      "Persönliche Betreuung durch erfahrene Fachkräfte",
      "Einblick in unsere eigene Leittechnik: Parkregler, Fernwartung und SCADA",
      "Perspektive auf Übernahme nach erfolgreicher Lehrabschlussprüfung",
    ],
  },
];
