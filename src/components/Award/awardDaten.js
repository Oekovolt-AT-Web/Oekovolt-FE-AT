// src/components/Award/awardDaten.js
//
// Inhalte des Ökovolt PV Award – gemeinsam genutzt von /pv-award (Seite),
// dem Einreichungsformular (Client) und /api/award (Server-Validierung).
//
// STATUS: Konzept/Vorschlag. Termine, Preise und Jury-Besetzung sind noch nicht
// fixiert. Solange `TERMINE.fix` false ist, zeigt die Seite keine Daten und
// gibt KEIN Event-Schema aus. Jury-Mitglieder erst nach Zusage namentlich nennen.

export const AWARD_NAME = "Ökovolt PV Award";
export const AWARD_THEMA = "PV Award – Einreichung";
export const AWARD_JAHR = 2027;

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
    text: "Indach, Fassade, Carport oder Chalet in Schneelastzone: Anlagen, die gestalterisch überzeugen und alpinen Bedingungen standhalten.",
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
  "Mit der Einreichung willigen Teilnehmende ein, dass Name, Projektbeschreibung, Fotos und Kennzahlen im Rahmen des Awards veröffentlicht werden dürfen (Website, Social Media, Presse). Die Einwilligung kann bis zur Jurysitzung widerrufen werden.",
  "Die Teilnahme ist kostenlos und unabhängig von künftigen Aufträgen. Mitarbeiter:innen von Ökovolt und der Jury sind nicht teilnahmeberechtigt.",
  "Die Entscheidung der Jury ist endgültig; der Rechtsweg ist ausgeschlossen. Die vollständigen Teilnahmebedingungen werden mit den Terminen veröffentlicht.",
];

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
