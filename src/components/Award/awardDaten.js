// src/components/Award/awardDaten.js
//
// Inhalte des Ökovolt PV Award – gemeinsam genutzt von /pv-award (Seite),
// dem Einreichungsformular (Client) und /api/award (Server-Validierung).
//
// STATUS: Konzept/Vorschlag (AWARD_STATUS). Termine, Preise und Jury-Besetzung sind noch
// nicht fixiert. Solange `TERMINE.fix` false ist bzw. der Award im Konzeptstatus steht,
// zeigt die Seite keine Daten und gibt KEIN Event-Schema aus. Jury-Mitglieder erst nach
// Zusage namentlich nennen.
//
// RECHT (Welle A07): Der Award ist ein Unternehmenspreis der Ökovolt Solartechnik GmbH für
// ihre Kundinnen und Kunden – keine unabhängige Auszeichnung, kein Gütezeichen. Das steht
// als Kennzeichnung auf der Seite und im Formular. Keine Klausel „Rechtsweg ausgeschlossen“;
// die Einwilligung in die Veröffentlichung ist eine eigene, optionale Checkbox (ohne sie
// wird anonym bewertet).

export const AWARD_NAME = "Ökovolt PV Award";
export const AWARD_THEMA = "PV Award – Einreichung";
export const AWARD_JAHR = 2027;

/** "konzept" | "aktiv" – im Konzeptstatus kein Event-Schema und Hinweis auf der Seite. */
export const AWARD_STATUS = "konzept";

/** Pflicht-Kennzeichnung auf der Seite, im Formular und in Mitteilungen. */
export const AWARD_KENNZEICHNUNG = "Unternehmenspreis der Ökovolt Solartechnik GmbH für ihre Kundinnen und Kunden";

/** Ersetzt die frühere Klausel „Rechtsweg ausgeschlossen“. */
export const JURY_KLAUSEL = "Die Jury entscheidet nach den veröffentlichten Kriterien; ein Anspruch auf Auszeichnung besteht nicht.";

/** Erst auf true setzen, wenn Einreichschluss und Verleihung feststehen. */
export const TERMINE = {
  fix: false,
  einreichungBis: null, // "2027-03-31"
  verleihung: null, // { datum: "2027-06-15", ort: "…" }
};

export const KATEGORIEN = [
  {
    id: "gewerbe",
    icon: "Factory",
    titel: "Gewerbe & Industrie",
    text: "Hallen, Produktion, Logistik und Handel: Anlagen, die nach Lastgang geplant sind, einen hohen Eigenverbrauch erreichen und Energiekosten planbar machen.",
  },
  {
    id: "landwirtschaft",
    icon: "Tractor",
    titel: "Landwirtschaft & Agri-PV",
    text: "Stall- und Hallendächer, Agri-PV über Kulturen oder Weiden: Doppelte Nutzung der Fläche und Strom für Kühlung, Melkstand oder Trocknung.",
  },
  {
    id: "gemeinde",
    icon: "Landmark",
    titel: "Gemeinde & öffentliche Hand",
    text: "Schulen, Bauhöfe, Kläranlagen, Feuerwehrhäuser: Projekte, die Budgets entlasten und Bürgerinnen und Bürger sichtbar beteiligen.",
  },
  {
    id: "tourismus",
    icon: "Hotel",
    titel: "Tourismus & Hotellerie",
    text: "Hotels, Bergbahnen, Thermen und Gastronomie: Photovoltaik als Teil des Gästeerlebnisses und der Nachhaltigkeitsstrategie.",
  },
  {
    id: "innovation",
    icon: "BatteryCharging",
    titel: "Innovation: Speicher & Sektorkopplung",
    text: "PV mit Gewerbespeicher, Wärmepumpe, E-Flotte oder Lastmanagement – Systeme, die Erzeugung und Verbrauch intelligent verbinden.",
  },
  {
    id: "architektur",
    icon: "Mountain",
    titel: "Architektur & alpine Chalets",
    text: "Indach, Fassade, Carport oder Chalet in schneereicher Lage: Anlagen, die gestalterisch überzeugen und alpinen Bedingungen standhalten.",
  },
  {
    id: "energiegemeinschaft",
    icon: "Share2",
    titel: "Energiegemeinschaft des Jahres",
    text: "Erneuerbare-Energie-Gemeinschaften (EEG), Bürgerenergiegemeinschaften und gemeinschaftliche Erzeugungsanlagen mit Vorbildwirkung für die Region.",
  },
];

export const KATEGORIE_TITEL = KATEGORIEN.map((k) => k.titel);

/** Bewertung – Gewichtung in Prozent, Summe 100. */
export const KRITERIEN = [
  { titel: "Wirtschaftlichkeit & Eigenverbrauch", gewicht: 25, text: "Eigenverbrauchs- bzw. Autarkiegrad, Amortisation, sinnvolle Dimensionierung im Verhältnis zum Lastgang." },
  { titel: "Klimawirkung", gewicht: 20, text: "Vermiedene CO₂-Emissionen pro Jahr, Anteil erneuerbarer Energie am Verbrauch, ersetzte fossile Energieträger." },
  { titel: "Technische Qualität & Betrieb", gewicht: 20, text: "Ausführung, Dokumentation, Brandschutz, Verfügbarkeit und Performance Ratio im laufenden Betrieb." },
  { titel: "Innovation & Systemintegration", gewicht: 15, text: "Speicher, Sektorkopplung, Lastmanagement, Netzdienlichkeit, Energiegemeinschaft oder neue Nutzungskonzepte." },
  { titel: "Gestaltung & Integration", gewicht: 10, text: "Einbindung in Gebäude, Ortsbild und Landschaft; Doppelnutzung von Flächen." },
  { titel: "Vorbildwirkung & Kommunikation", gewicht: 10, text: "Wie Mitarbeitende, Gäste, Bürgerinnen und Bürger oder die Branche vom Projekt erfahren und davon lernen." },
];

export const TEILNAHME = [
  "Teilnahmeberechtigt sind Kundinnen und Kunden der Ökovolt Solartechnik GmbH, deren Anlage von Ökovolt errichtet, erweitert oder betreut wird.",
  "Die Anlage steht in Österreich und ist zum Zeitpunkt der Einreichung in Betrieb.",
  "Einreichen können Anlagenbetreiber:innen oder von ihnen bevollmächtigte Personen; je Anlage ist eine Einreichung möglich, eine Anlage kann nur in einer Kategorie gewinnen.",
  "Die Veröffentlichung von Name, Projektbeschreibung, Fotos und Kennzahlen (Website, Social Media, Presse) ist eine eigene, freiwillige Einwilligung. Ohne sie bewerten wir das Projekt anonym; eine Auszeichnung wird dann ohne Nennung des Betriebs bekannt gegeben. Die Einwilligung kann jederzeit widerrufen werden.",
  "Die Teilnahme ist kostenlos und unabhängig von künftigen Aufträgen. Mitarbeiter:innen von Ökovolt und der Jury sind nicht teilnahmeberechtigt.",
  `${JURY_KLAUSEL} Die vollständigen Teilnahmebedingungen werden mit den Terminen veröffentlicht.`,
  `Der ${AWARD_NAME} ist ein ${AWARD_KENNZEICHNUNG} – keine unabhängige oder staatliche Auszeichnung und kein Gütezeichen. Die Jury wird von Ökovolt berufen.`,
];

export const JURY_HINWEIS = "Die Jury wird von der Ökovolt Solartechnik GmbH berufen; ihre Mitglieder waren an den eingereichten Projekten nicht beteiligt. Die Besetzung veröffentlichen wir gemeinsam mit den Terminen.";

export const JURY = [
  { icon: "Cpu", titel: "Technik", text: "Fachleute für Photovoltaik, Netzanschluss und Betriebsführung bewerten Ausführung und Anlagendaten." },
  { icon: "TrendingUp", titel: "Wirtschaft", text: "Expertise aus Unternehmensführung und Finanzierung bewertet Wirtschaftlichkeit und Übertragbarkeit." },
  { icon: "Sprout", titel: "Nachhaltigkeit", text: "Fachleute für Klimaschutz und Nachhaltigkeitskommunikation bewerten Wirkung und Vorbildfunktion." },
];

export const ZEITPLAN = [
  { titel: "Einreichung", text: "Projekt mit Kennzahlen, Kurzbeschreibung und Fotos einreichen. Die Einreichfrist für 2027 veröffentlichen wir hier." },
  { titel: "Vorprüfung", text: "Wir prüfen die Teilnahmeberechtigung und – mit Ihrer Zustimmung – die Anlagendaten aus Monitoring und Dokumentation und fragen bei Bedarf nach." },
  { titel: "Jurysitzung", text: "Die Fachjury bewertet die nominierten Projekte je Kategorie nach den veröffentlichten Kriterien." },
  { titel: "Verleihung", text: "Preisträger werden zur Verleihung eingeladen und auf oekovolt.com vorgestellt. Termin und Ort folgen." },
];
