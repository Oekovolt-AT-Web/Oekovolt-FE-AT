// src/data/netzbetreiber.js
//
// „PV-Anlage beim Netzbetreiber anmelden“ – Daten für /netzanmeldung,
// /netzanmeldung/[betreiber], /netzanmeldung/zaehlpunkt und die EEG-Tabellen auf
// /energiegemeinschaften. Zehn Verteilernetzbetreiber in allen neun Bundesländern,
// gereiht nach Zählpunkten (E-Control, Smart-Meter-Monitoringbericht 2025, Anhang,
// Berichtsjahr 2024): die fünf größten (Welle 4, Recherche 30.09.2026) plus
// KNG-Kärnten Netz, LINZ NETZ, TINETZ, Netz Burgenland und vorarlberg netz
// (Paket C06, Recherche 11.10.2026).
//
// Recherche ausschließlich an Primärquellen (Websites, Formulare, Preisblätter
// und Bedingungen der Netzbetreiber, E-Control, ElWG-Gesetzestext).
// Alle Texte sind eigene Formulierungen; jede Aussage ist über `quellen` belegt.
// Was nicht offiziell genannt ist (z. B. Bearbeitungsdauer), steht NICHT hier
// oder ist in `offen` als ungeklärt vermerkt.
//
// Felder je Betreiber (C06): energiegemeinschaft { datenfreigabe, formular, nahbereich,
// kontakt, quelle }, p2p { anmeldeweg, quelle }, kleinsterzeugung { text, formular, quelle }.
//
// Neutralität: gleiche Struktur und Reihenfolge (nach Zählpunkten) für alle
// Betreiber, keine Aussagen über bevorzugte oder schnellere Abwicklung.
// Keine Logos der Netzbetreiber.
//
// Bei Änderungen: geprueftAm je Betreiber und STAND anpassen.

export const PFAD = "/netzanmeldung";
export const DRUCK_PFAD = "/netzanmeldung/checkliste";
export const ZAEHLPUNKT_PFAD = "/netzanmeldung/zaehlpunkt";
/** Kapazitäts-Wegweiser aus Paket B06 (Route liegt dort; hier nur der Pfad). */
export const KAPAZITAET_PFAD = "/netzanmeldung/netzkapazitaet";
export const EEG_PFAD = "/energiegemeinschaften";
export const betreiberPfad = (slug) => `${PFAD}/${slug}`;

export const STAND = { iso: "2026-10-11", label: "11.10.2026" };

export const HINWEIS_GEWAEHR = "Angaben ohne Gewähr, maßgeblich sind die Unterlagen des Netzbetreibers.";

// ---------------------------------------------------------------------------
// Offizielle Quellen, die mehrfach vorkommen
// ---------------------------------------------------------------------------

export const Q = {
  econtrolSuche: { titel: "E-Control – Strom- und Gasnetzbetreiber finden", url: "https://www.e-control.at/konsumenten/strom-und-gasnetzbetreiber-finden" },
  econtrolTarifkalkulator: { titel: "E-Control – Tarifkalkulator (Übersicht Lieferanten und Netzbetreiber)", url: "https://www.e-control.at/tarifkalkulator" },
  smartMeterBericht: {
    titel: "E-Control – Bericht zur Einführung intelligenter Messgeräte 2025 (Berichtsjahr 2024), Anhang",
    url: "https://www.e-control.at/documents/1785851/1811582/20251020-Monitoringbericht-SM-2025.pdf/4ce4b22f-8149-5162-770a-83f132511199?t=1763621630772",
  },
  torZaehler: {
    titel: "E-Control – TOR Stromzähler 1.0, Kapitel 4.1 Zählpunktbezeichnung",
    url: "https://www.e-control.at/documents/1785851/0/TOR_Stromz%C3%A4hler_v1.0.pdf/8b05d9e9-6221-de26-aa67-befa07c63f29?t=1713169467630",
  },
  elwgRis: { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91" },
  elwgKonsolidiert: {
    titel: "ElWG, konsolidierte Fassung vom 07.01.2026 (RIS-Ausdruck, bereitgestellt von Energienetze Steiermark)",
    url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=ElWG_Fassung+vom+07012026.pdf",
  },
  sneEntwurf: { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf" },
  eagCall: { titel: "EAG-Abwicklungsstelle – 3. Fördercall 2026 für Photovoltaik und Speicher", url: "https://www.eag-abwicklungsstelle.at/termin/3-foerdercall-2026-fuer-photovoltaik-und-speicher-kat-a-d/" },
  eagUnterlagen: { titel: "EAG-Abwicklungsstelle – Wichtige Unterlagen für die PV-Antragstellung", url: "https://www.eag-abwicklungsstelle.at/wissen/wichtige-unterlagen-fuer-die-pv-antragstellung/" },
  econtrolNetzanschluss: {
    titel: "E-Control – Jahresbericht 2025 zur Erhebung Netzanschluss (Berichtsjahr 2024), Stand 03.03.2025",
    url: "https://www.e-control.at/documents/1785851/1811582/Erhebung-Netzanschluss-Jahresbericht-2025.pdf/6cfaccdb-a3ea-ffb6-113d-50f0b19ef8cc?t=1741267472553",
  },
  eagMonitoring2026: {
    titel: "E-Control – EAG-Monitoringbericht 2026 (Berichtsjahr 2025), Kapitel 8 Energiegemeinschaften, Tabelle 43",
    url: "https://www.e-control.at/documents/d/guest/ec_eag-monitoringbericht-202-barrierefrei-pdf",
  },
  ebutilities: { titel: "ebUtilities – Registrierung von Bürgerenergiemodellen (Branchenplattform)", url: "https://www.ebutilities.at/registrierung" },
  koordinationsstelle: { titel: "Österreichische Koordinationsstelle für Energiegemeinschaften", url: "https://energiegemeinschaften.gv.at/" },
  koordinationsstelleP2P: { titel: "Koordinationsstelle – Peer-to-Peer-Verträge (Mustervorlagen)", url: "https://energiegemeinschaften.gv.at/peer-to-peer-vertraege/" },
};

// ---------------------------------------------------------------------------
// Auswahl der fünf Betreiber
// ---------------------------------------------------------------------------

/** Zählpunkte je Verteilernetzbetreiber (IME-VO-relevant), Ende 2024 – E-Control, Anhang-Tabelle. */
export const AUSWAHL = {
  text: "Gereiht nach der Zahl der Zählpunkte im Netz: Die E-Control weist im Anhang ihres Smart-Meter-Berichts 2025 jeden Verteilernetzbetreiber mit seinen Zählpunkten zum Jahresende 2024 aus. Die zehn hier beschriebenen Netzbetreiber decken alle neun Bundesländer ab und betreuen zusammen rund 85 % aller Zählpunkte Österreichs; daneben gibt es über hundert kleinere Netzbetreiber, etwa Stadtwerke und Genossenschaften.",
  gesamt: 6737329,
  rangliste: [
    { name: "Wiener Netze", anzahl: 1646935, slug: "wiener-netze" },
    { name: "Netz Niederösterreich", anzahl: 945234, slug: "netz-niederoesterreich" },
    { name: "Netz Oberösterreich", anzahl: 736171, slug: "netz-oberoesterreich" },
    { name: "Energienetze Steiermark", anzahl: 524795, slug: "energienetze-steiermark" },
    { name: "Salzburg Netz", anzahl: 465566, slug: "salzburg-netz" },
    { name: "KNG-Kärnten Netz", anzahl: 341365, slug: "kng-kaernten-netz" },
    { name: "LINZ NETZ", anzahl: 309356, slug: "linz-netz" },
    { name: "TINETZ-Tiroler Netze", anzahl: 264135, slug: "tinetz" },
    { name: "Netz Burgenland", anzahl: 239590, slug: "netz-burgenland" },
    { name: "Vorarlberger Energienetze", anzahl: 234169, slug: "vorarlberg-netz" },
  ],
  quelle: Q.smartMeterBericht,
};

/** Die neun Bundesländer mit den hier beschriebenen Netzbetreibern (Slugs in NETZBETREIBER). */
export const BUNDESLAENDER_NETZ = [
  { land: "Wien", slugs: ["wiener-netze"] },
  { land: "Niederösterreich", slugs: ["netz-niederoesterreich"], hinweis: "Teile des Wiener Umlands versorgt Wiener Netze." },
  { land: "Oberösterreich", slugs: ["netz-oberoesterreich", "linz-netz"], hinweis: "Linz und 82 Umlandgemeinden: LINZ NETZ." },
  { land: "Steiermark", slugs: ["energienetze-steiermark"], hinweis: "Graz: Stromnetz Graz (eigener Netzbetreiber)." },
  { land: "Salzburg", slugs: ["salzburg-netz"] },
  { land: "Kärnten", slugs: ["kng-kaernten-netz"], hinweis: "Klagenfurt: Energie Klagenfurt (eigener Netzbetreiber)." },
  { land: "Tirol", slugs: ["tinetz"], hinweis: "Innsbruck: Innsbrucker Kommunalbetriebe (eigener Netzbetreiber)." },
  { land: "Burgenland", slugs: ["netz-burgenland"], hinweis: "Raum Güssing: Energie Güssing (eigener Netzbetreiber)." },
  { land: "Vorarlberg", slugs: ["vorarlberg-netz"], hinweis: "Feldkirch, Frastanz, Montafon, Kleinwalsertal: eigene Werke." },
];

/**
 * Netzanschluss-Realität nach Bundesland – E-Control, Jahresbericht 2025 zur
 * Erhebung Netzanschluss (Berichtsjahr 2024, 60 Verteilernetzbetreiber).
 * Nur als Orientierung: Die E-Control ordnet die 60 Netzbetreiber je einem
 * Bundesland zu (keine Landesgrenzen) und weist selbst auf schwankende
 * Datenqualität bei der Unterscheidung der Zusagen hin.
 */
export const NETZANSCHLUSS_REALITAET = {
  berichtsjahr: 2024,
  stand: { iso: "2025-03-03", label: "03.03.2025" },
  netzbetreiber: 60,
  antraege: 120188,
  anteilBis20kW: 85.7,
  dauer: [
    { klasse: "0,8 bis 20 kW", tage: 6.6, anteil: "85,7 % der Anträge" },
    { klasse: "20 bis 250 kW", tage: 11.4, anteil: "12,9 % der Anträge" },
    { klasse: "250 kW bis 1 MW", tage: 20.2, anteil: "rund 1 % der Anträge" },
  ],
  spanne: { min: 1, max: 89 },
  betriebTage: 12.1,
  eingeschraenkt: { land: "Oberösterreich", anteil: 54 },
  meisteAntraege: { laender: ["Niederösterreich", "Steiermark"], anzahl: "je rund 28.000" },
  einspeisezaehlpunkteNoe: 15.3,
  erlaeuterung: [
    "tAntrag: Zeit vom vollständigen Antrag bis zur Bestätigung durch den Netzbetreiber.",
    "tBetrieb: Zeit von Fertigstellungsmeldung und Zählpunktanmeldung bis zur Betriebserlaubnis (nur Anlagen bis 20 kW mit Zusage).",
    "Eingeschränkte Zusage: Anschluss mit Leistungsbegrenzung oder Auflagen – kein Nein. Die Genauigkeit dieser Unterscheidung variiert laut E-Control stark zwischen den Netzbetreibern.",
    "Die Dauer der Netzausbaumaßnahmen (tAnschluss) konnte die E-Control wegen unzureichender Datenqualität nicht auswerten.",
  ],
  quelle: Q.econtrolNetzanschluss,
};

/** Kleinsterzeugungsanlagen (Balkonkraftwerke) bis 800 W – gesetzlicher Rahmen und was überall gilt. */
export const KLEINSTERZEUGUNG = {
  grenze: "800 W (0,8 kW) Maximalkapazität je Kundenanlage, in Summe aller Einheiten – ein Speicher zählt mit. Manche Netzbetreiber schreiben 0,8 kVA: gemeint ist die Scheinleistung des Wechselrichters, bei Leistungsfaktor 1 gleich groß",
  punkte: [
    "Anzeigen statt beantragen: Kleinsterzeugungsanlagen werden beim Netzbetreiber gemeldet; einen Netzzugangsvertrag und einen eigenen Einspeisezählpunkt gibt es nur auf Antrag (§§ 6, 77, 98 ElWG).",
    "Frist: Die meisten Netzbetreiber verlangen die Meldung mindestens zwei Wochen vor der Inbetriebnahme – in dieser Zeit prüfen sie den Zähler und tauschen ihn bei Bedarf.",
    "Technik: Konformitätsnachweis einer zertifizierten Prüfstelle für die selbsttätige Netzentkupplung (TOR Erzeuger Typ A), Leistungsfaktor 1; einige Netzbetreiber verlangen eine feste oder berührungssichere Anschlussart.",
    "Keine Vergütung: Rückgespeister Strom wird ohne Abnahmevertrag nicht bezahlt; wer einspeisen und abrechnen will, braucht den regulären Weg mit Einspeisezählpunkt.",
    "Über 800 W – auch durch eine Erweiterung – gilt der normale Netzzugang: Antrag bzw. Anzeige nach § 96 ElWG, Fertigmeldung durch ein konzessioniertes Elektrounternehmen.",
  ],
  quellen: [Q.elwgRis],
};

/**
 * EEG je Bundesland (Netzbereich) – E-Control, EAG-Monitoringbericht 2026,
 * Tabelle 43 „Anzahl und Verteilung der EEGs 2023 bis 2026“, Stichtag 30.06.2026.
 * Manuell gepflegt; die Netzbereiche decken sich nicht 1:1 mit den Bundesländern.
 */
export const EEG_JE_BUNDESLAND = {
  stichtag: { iso: "2026-06-30", label: "30.06.2026" },
  gesamt: 5999,
  beg: 1078,
  gea: 7743,
  zeilen: [
    { land: "Burgenland", eeg: 633 },
    { land: "Kärnten", eeg: 687 },
    { land: "Niederösterreich", eeg: 1400 },
    { land: "Oberösterreich", eeg: 1124 },
    { land: "Salzburg", eeg: 435 },
    { land: "Steiermark", eeg: 586 },
    { land: "Tirol", eeg: 585 },
    { land: "Vorarlberg", eeg: 221 },
    { land: "Wien", eeg: 328 },
  ],
  hinweis: "Zahlen je Netzbereich, nicht je Bundesland: Wiener Netze versorgt etwa auch Teile Niederösterreichs. Zusätzlich gab es zum Stichtag 1.078 Bürgerenergiegemeinschaften und 7.743 gemeinschaftliche Erzeugungsanlagen in Österreich.",
  quelle: Q.eagMonitoring2026,
};

// ---------------------------------------------------------------------------
// Allgemeine Abschnitte
// ---------------------------------------------------------------------------

/** Einspeisezählpunkt – Aufbau laut TOR Stromzähler, Bedeutung für den EAG-Antrag. */
export const ZAEHLPUNKT = {
  aufbau: [
    { teil: "AT", stellen: 2, text: "Landeskennung Österreich" },
    { teil: "Netzbetreibernummer", stellen: 6, text: "vergeben von der Verrechnungsstelle, mit führenden Nullen" },
    { teil: "Postleitzahl", stellen: 5, text: "Gebiet der Zählstelle bei der Erstvergabe" },
    { teil: "Zählpunktnummer", stellen: 20, text: "Großbuchstaben A–Z und Ziffern 0–9" },
  ],
  punkte: [
    "Die Bezeichnung ist 33 Stellen lang und bleibt dem Zählpunkt dauerhaft zugeordnet – auch bei Zählertausch oder Änderung der Postleitzahl.",
    "Einspeisung und Bezug werden über getrennte Zählpunkte abgerechnet. Für den EAG-Antrag zählt ausschließlich der Einspeisezählpunkt.",
    "Die meisten hier beschriebenen Netzbetreiber nennen den Einspeisezählpunkt schon vor der Errichtung – mit Zusage, Angebot, Zählpunktbrief oder Zählpunktinformationsschreiben (Netz Oberösterreich und LINZ NETZ ausdrücklich für Anlagen bis 20 kW). Aktiv wird er erst nach Fertigmeldung und Anmeldung durch den Stromabnehmer.",
    "Die Stellen 3 bis 8 sind die Nummer des Netzbetreibers – damit lässt sich aus einer Zählpunktbezeichnung der zuständige Netzbetreiber ablesen.",
  ],
  quellen: [Q.torZaehler],
};

/** Bezug zum 3. EAG-Fördercall 2026 (08.–22.10.2026). */
export const EAG_BEZUG = {
  titel: "Ohne Einspeisezählpunkt kein EAG-Antrag",
  text: "Für Ticket und Förderantrag im EAG-Fördercall braucht jede Anlage ihren Einspeisezählpunkt (3. Call 2026: Ticketziehung 08.10., Einreichschluss 22.10.2026, 23:59 Uhr). Das Dokument des Netzbetreibers muss Zählpunktinhaber, Anlagenstandort und Netzanschlussleistung zeigen. Der Bezugszählpunkt Ihres Hausanschlusses gilt nicht.",
  punkte: [
    "Netzanmeldung jetzt stellen – bei vollständigen Unterlagen kommen Zählpunkt bzw. Zusage je nach Netzbetreiber nach Minuten bis wenigen Wochen.",
    "Anlage vor dem ersten gültigen Förderantrag nicht in Betrieb nehmen; bestellen und montieren ist erlaubt.",
    "Genehmigungen und Anzeigen nach Landesrecht müssen bei Ticket und Antrag bereits vorliegen.",
  ],
  quellen: [Q.eagCall, Q.eagUnterlagen],
};

/** Allgemeiner Ablauf (gilt sinngemäß bei allen fünf Betreibern; Details je Betreiber). */
export const ABLAUF = [
  { titel: "Netzbetreiber feststellen", text: "Er steht auf der Stromrechnung und steckt in der Zählpunktbezeichnung (Stellen 3–8). Im Zweifel hilft die Netzbetreiber-Übersicht der E-Control." },
  { titel: "Anlage planen", text: "Modul- und Wechselrichterleistung, Speicher, Voll- oder Überschusseinspeisung und gewünschte Einspeiseleistung festlegen. Wechselrichter müssen den TOR Erzeuger entsprechen." },
  { titel: "Netzzugang beantragen", text: "Über das Portal oder Formular des Netzbetreibers – bei mehreren Betreibern stellt der konzessionierte Elektrofachbetrieb den Antrag. Bis 20 kW netzwirksamer Leistung genügt nach § 96 ElWG eine Anzeige." },
  { titel: "Zusage und Einspeisezählpunkt", text: "Der Netzbetreiber prüft die Netzverträglichkeit, legt Anschlusspunkt und Einspeiseleistung fest und teilt den Einspeisezählpunkt mit. Die Zusage ist befristet gültig." },
  { titel: "Stromabnahme vereinbaren", text: "Abnahmevertrag mit einem Stromhändler, der OeMAG oder einer Energiegemeinschaft. Der Abnehmer meldet den Einspeisezählpunkt beim Netzbetreiber an." },
  { titel: "Errichten und fertigmelden", text: "Errichtung durch das befugte Elektrounternehmen, danach Fertigmeldung mit Prüf- und Einstellprotokollen im Portal des Netzbetreibers." },
  { titel: "Freigabe und Inbetriebnahme", text: "Nach Prüfung, gegebenenfalls Zählertausch oder Termin vor Ort erteilt der Netzbetreiber die Freigabe. Erst dann darf eingespeist werden." },
];

/** Checkliste (interaktiv und als Druckversion). */
export const CHECKLISTE = [
  {
    titel: "Vor dem Antrag",
    punkte: [
      { id: "netzbetreiber", titel: "Zuständigen Netzbetreiber kennen", text: "Laut Stromrechnung oder E-Control-Übersicht; nicht der Stromlieferant." },
      { id: "bezug", titel: "Bezugszählpunkt bereitlegen", text: "33 Stellen, beginnt mit AT – bei Überschusseinspeisung gefragt." },
      { id: "grundstueck", titel: "Standortdaten", text: "Anlagenadresse; bei Neubau oder Freifläche Katastralgemeinde und Grundstücksnummer." },
      { id: "eigentuemer", titel: "Zustimmung des Grundeigentümers", text: "Wenn Antragsteller und Eigentümer nicht dieselbe Person sind." },
    ],
  },
  {
    titel: "Technische Angaben",
    punkte: [
      { id: "leistung", titel: "Leistungen festlegen", text: "Modulleistung in kWp, Wechselrichter in kVA, gewünschte netzwirksame Einspeiseleistung." },
      { id: "wechselrichter", titel: "Wechselrichter mit TOR-Nachweis", text: "Konformitätsnachweis für den Netz- und Anlagenschutz (NA-Schutz) laut TOR Erzeuger." },
      { id: "speicher", titel: "Speicherdaten", text: "Leistung in kVA, Kapazität in kWh und Betriebsweise (lädt aus dem Netz oder nur aus PV)." },
      { id: "betriebsart", titel: "Einspeiseart wählen", text: "Überschuss- oder Volleinspeisung – bei Volleinspeisung ist eine eigene Messung nötig." },
    ],
  },
  {
    titel: "Zusage & Förderung",
    punkte: [
      { id: "zaehlpunkt", titel: "Einspeisezählpunkt erhalten", text: "Aus Zusage, Angebot oder Zählpunktbrief – für EAG-Ticket und Förderantrag." },
      { id: "frist", titel: "Gültigkeit der Zusage notieren", text: "Je nach Netzbetreiber 6 bis 12 Monate, teils verlängerbar." },
      { id: "genehmigung", titel: "Genehmigungen nach Landesrecht", text: "Bau- oder elektrizitätsrechtliche Anzeige bzw. Bewilligung vor dem EAG-Antrag." },
      { id: "abnahme", titel: "Abnahmevertrag abschließen", text: "Stromhändler, OeMAG oder Energiegemeinschaft – ohne ihn keine Freigabe bzw. keine Vergütung." },
    ],
  },
  {
    titel: "Fertigstellung",
    punkte: [
      { id: "fertigmeldung", titel: "Fertigmeldung durch das Elektrounternehmen", text: "Im Portal des Netzbetreibers, mit unterschriebenen Unterlagen." },
      { id: "protokolle", titel: "Prüf- und Einstellprotokolle", text: "Erstprüfung, Ländereinstellung Österreich, Blindleistungsverfahren, gegebenenfalls NA-Schutz-Prüfprotokoll." },
      { id: "freigabe", titel: "Freigabe abwarten", text: "Erst nach Freigabe bzw. Betriebserlaubnis des Netzbetreibers einspeisen." },
      { id: "foerderstart", titel: "Förderantrag vor Inbetriebnahme", text: "Beim EAG-Investitionszuschuss muss der erste gültige Antrag vor dem Einschalten eingereicht sein." },
    ],
  },
];

/** ElWG: nur am Gesetzestext belegte Aussagen – und was zum Prüfdatum offen ist. */
export const ELWG = {
  kurz: "Das Elektrizitätswirtschaftsgesetz (BGBl. I Nr. 91/2025) hat das ElWOG 2010 abgelöst. Die meisten Bestimmungen gelten seit dem Tag nach der Kundmachung (§ 188 Abs. 6); einzelne Teile starten gestaffelt.",
  belegt: [
    { titel: "Anzeige bis 20 kW", norm: "§ 96 Abs. 1–4", text: "Erneuerbare Anlagen bis 20 kW netzwirksamer Leistung werden auf Anzeige angeschlossen. Der Verteilernetzbetreiber bestätigt binnen vier Wochen nach vollständiger Anzeige oder lehnt nur aus Sicherheitsgründen bzw. wegen technischer Inkompatibilität ab – äußert er sich nicht, ist anzuschließen." },
    { titel: "Bis 15 kW über den bestehenden Anschluss", norm: "§ 96 Abs. 5", text: "PV bis 15 kW über einen bestehenden Bezugsanschluss darf bis zur vereinbarten Bezugsleistung einspeisen, ohne zusätzliches Netzanschlussentgelt." },
    { titel: "Kleinsterzeugungsanlagen bis 0,8 kW", norm: "§§ 6, 77, 98", text: "Anlagen bis 0,8 kW Maximalkapazität bekommen keinen eigenen Zählpunkt, außer auf Antrag. Anzuzeigen sind sie trotzdem; Details legt eine Verordnung fest, bis dahin gelten die Vorgaben des Netzbetreibers." },
    { titel: "Steuerbarkeit ab 3,68 kW", norm: "§ 76", text: "Neue und wesentlich geänderte Anlagen ab 3,68 kW netzwirksamer Leistung müssen seit 01.06.2026 mit einer Einrichtung zur Steuerbarkeit ausgestattet sein." },
    { titel: "Spitzenkappung bei PV", norm: "§ 101 Abs. 2", text: "Bei neuem oder geändertem Netzzugang darf der Netzbetreiber die netzwirksame Leistung einer PV-Anlage begrenzen – nicht unter 70 % der Modulspitzenleistung." },
    { titel: "Reservierung und Reihung", norm: "§ 99 Abs. 2 und 4", text: "Kapazität lässt sich binnen eines Monats nach der Antwort des Netzbetreibers per Anzahlung für zwölf Monate reservieren. Gereiht wird nach Vorliegen aller Genehmigungen, ohne Genehmigungspflicht nach Antragszeitpunkt." },
  ],
  offen: [
    { titel: "Einheitliche Allgemeine Netzbedingungen", text: "Die E-Control legt sie künftig per Verordnung fest (§ 93) – samt Fristen für Entscheidungen über Netzanschluss und Netzzugang (§ 92 Abs. 2 Z 9). Bis dahin gelten die Bedingungen des jeweiligen Netzbetreibers; ob die Verordnung bereits erlassen ist, konnten wir zum Prüfdatum nicht bestätigen." },
    { titel: "Entgelte ab 2027", text: "Die neuen Systemnutzungsentgelte samt Netzanschlussentgelt treten gestaffelt in Kraft; die konkreten Beträge legt eine Verordnung der E-Control fest. Zum Prüfdatum lag uns dazu nur ein Begutachtungsentwurf vor." },
    { titel: "Referenzanlage für die Spitzenkappung", text: "Details zur Begrenzung legt das Wirtschaftsministerium per Verordnung fest (§ 101 Abs. 7) – noch offen." },
    { titel: "Umsetzung auf den Websites", text: "Mehrere Netzbetreiber weisen darauf hin, dass ihre Unterlagen teils noch auf dem ElWOG 2010 beruhen und überarbeitet werden." },
  ],
  quellen: [Q.elwgRis, Q.elwgKonsolidiert, Q.sneEntwurf],
};

// ---------------------------------------------------------------------------
// Die fünf Netzbetreiber (Reihenfolge nach Zählpunkten)
// ---------------------------------------------------------------------------

export const NETZBETREIBER = [
  // ------------------------------------------------------------------ Wien
  {
    slug: "wiener-netze",
    name: "Wiener Netze GmbH",
    kurz: "Wiener Netze",
    gebiet: "Ganz Wien sowie angrenzende Teile Niederösterreichs und des Burgenlands, etwa rund um Klosterneuburg, Mödling, Baden und Schwechat.",
    bundesland: "Wien",
    zaehlpunkte: 1646935,
    portalUrl: "https://partner.wienernetze.at/",
    portal: { name: "Marktpartnerplattform", imSatz: "Über die Marktpartnerplattform von Wiener Netze", url: "https://partner.wienernetze.at/", fuer: "Elektrofachbetriebe und Planungsbüros reichen die Netzzugangsanfrage ein." },
    weiterePortale: [
      { name: "Einspeisezählpunkt anfragen", url: "https://www.wienernetze.at/einspeisez%C3%A4hlpunktnummer", fuer: "Online-Formular für Kundinnen und Kunden – auch schon in der Planungsphase." },
      { name: "Statusabfrage", url: "https://service.wienernetze.at/#/statusabfrage-public", fuer: "Stand der eigenen PV-Anfrage abrufen." },
      { name: "Kleinsterzeugungsanlage anmelden", url: "https://www.wienernetze.at/kleinsterzeugungsanlage-anmelden", fuer: "Balkonkraftwerk bis 800 W, direkt durch die Kundin oder den Kunden." },
    ],
    wer: "Über 800 W stellt nicht die Kundin oder der Kunde die Anfrage, sondern ein Elektrounternehmen mit Gewerbeberechtigung Elektrotechnik oder ein Planungsbüro. Bearbeitet werden nur vollständige Anfragen.",
    eckdaten: { zaehlpunkt: "vorab anfragbar", zaehlpunktLabel: "Einspeisezählpunkt, online vorab anfragbar", gueltigkeit: "Netzzusage gilt 6 Monate" },
    schritte: [
      { titel: "Anfrage durch den Fachbetrieb", text: "Der Elektrofachbetrieb beantragt den Netzzugang samt Einspeisezählpunkt. Wer eine Förderung plant, gibt schon hier die gewünschte Leistung an." },
      { titel: "Prüfung und Netzzutrittsangebot", text: "Wiener Netze legt zulässige Komponenten und die maximale Einspeiseleistung fest, bietet bei Bedarf eine Netzerweiterung an und schickt das Netzzutrittsangebot." },
      { titel: "Netzzusage („Zulässigkeit“)", text: "Der Fachbetrieb erhält den Nachweis des Netzzugangs mit sechs Monaten Gültigkeit und das Beiblatt zur Fertigmeldung." },
      { titel: "Errichten und fertigmelden", text: "Nach der Montage reicht der Elektrotechniker die elektronische Fertigmeldung mit dem von allen Beteiligten unterschriebenen Beiblatt ein." },
      { titel: "Abnahmevertrag abschließen", text: "Mit einem Stromabnehmer; dabei erhalten Sie den Einspeise-Netznutzungsvertrag, der unterschrieben zurückgeht." },
      { titel: "Prüfung vor Ort und Freigabe", text: "Wiener Netze prüft die Anlage, gibt das Einspeisezählwerk frei, plombiert den Smart Meter und erteilt die Freigabe." },
    ],
    unterlagen: [
      "Datenblatt Eigenerzeugungsanlage (Formular WN-0064): Betreiber, Elektrofirma, Wechselrichtertyp, Wirk- und Scheinleistung, Einspeiseart, NA-Schutz",
      "Inbetriebsetzungsprotokoll mit Schutz-Sollwerten (Teil von WN-0064), unterschrieben von Errichter und Betreiber",
      "Beiblatt zur Fertigmeldung, unterschrieben von allen Beteiligten",
      "Abnahmevertrag und unterschriebener Einspeise-Netznutzungsvertrag",
      "Ab 3,6 kVA dreiphasiger Wechselrichter – einphasig nur mit ausdrücklicher Zustimmung",
    ],
    fristen: [
      { titel: "Netzzusage", text: "gilt sechs Monate" },
      { titel: "Antwort auf Netzzutrittsanträge", text: "laut Verteilernetzbedingungen höchstens 14 Tage für einen konkreten Vorschlag, auf Netzebenen 1–6 ein Monat – Fassung aus 2017, Aktualität nicht bestätigt" },
      { titel: "Zählereinbau", text: "laut Verteilernetzbedingungen 3 Arbeitstage (Standardlastprofil) bzw. 8 Arbeitstage (Lastprofilzähler)" },
      { titel: "Balkonkraftwerk", text: "Betrieb zwei Wochen nach der Anmeldung erlaubt" },
    ],
    kosten: [
      { titel: "Netzzutrittsentgelt", text: "einmalig nach dem Netzzutrittsangebot; einen Pauschalbetrag für PV nennt Wiener Netze nicht" },
      { titel: "Weitere Entgelte", text: "gesetzliche Abgaben fallen nur in bestimmten Fällen an, etwa bei baulichen Maßnahmen" },
      { titel: "Messung", text: "Messentgelte laut Preisblatt (Drehstromzählung 2,18 € pro Monat, Stand 2020)" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Online-Formular direkt durch Sie, Konformitätsnachweis nach TOR Erzeuger bzw. OVE E 8101. Kein Einspeisezählpunkt, keine Vergütung; ein ungeeigneter Zähler wird getauscht." },
      { titel: "Große Anlagen", text: "Wiener Netze veröffentlicht freie Einspeisekapazitäten je Umspannwerk (Stand 08.07.2026, viele Umspannwerke ohne freie Kapazität). Anfragen gehen an den Kundendienst." },
      { titel: "Erweiterung", text: "Jede wesentliche Änderung einer bestehenden Anlage ist meldepflichtig." },
      { titel: "Typ B ab 250 kW", text: "Vorgaben stehen in den TOR-Ausführungsbestimmungen auf der Marktpartnerplattform (nur für Fachbetriebe zugänglich)." },
    ],
    zaehlpunkt: "Der Einspeisezählpunkt lässt sich jederzeit online anfragen – auch in der Planungsphase. Sonst kommt er mit dem Nachweis der Netzzusage bzw. dem Beiblatt zur Fertigmeldung. Wiener Netze weist ausdrücklich darauf hin, dass er für Förderanträge schon im ersten Schritt gebraucht wird.",
    inbetriebnahme: "Elektronische Fertigmeldung durch den Elektrotechniker, danach Prüfung vor Ort, Freigabe des Einspeisezählwerks und Plombierung. Ohne Smart Meter wird bei vollständiger Einreichung und gültigem Abnahmevertrag einer eingebaut.",
    elwg: "Wiener Netze weist darauf hin, dass viele Inhalte der Website noch auf dem ElWOG 2010 beruhen und überarbeitet werden. Zur Anzeige bis 20 kW oder zur Spitzenkappung gibt es dort noch keine eigenen Aussagen.",
    kontakt: [
      { label: "Kundenservice", wert: "050 128-10100", href: "tel:+4350128010100", hinweis: "Mo–Fr 8–17 Uhr" },
      { label: "E-Mail allgemein", wert: "info@wienernetze.at", href: "mailto:info@wienernetze.at" },
      { label: "Große Anlagen", wert: "kundendienst@wienernetze.at", href: "mailto:kundendienst@wienernetze.at" },
      { label: "Für Fachbetriebe", wert: "marktpartner@wienernetze.at", href: "mailto:marktpartner@wienernetze.at" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Jeder teilnehmende Zählpunkt stimmt im Smart Meter-Webportal zu – innerhalb von 30 Werktagen nach der Teilnahmeanfrage, sonst muss der Organisator die Anfrage neu senden. Wer im Webportal registriert ist, bekommt eine E-Mail-Benachrichtigung.",
      formular: { name: "Smart Meter-Webportal", url: "https://www.wienernetze.at/smart-meter-webportal" },
      nahbereich: { name: "Beauskunftungskennzahl abfragen", url: "https://www.wienernetze.at/beauskunftungskennzahl-abfragen" },
      kontakt: { wert: "buergerenergie@wienernetze.at", href: "mailto:buergerenergie@wienernetze.at" },
      quelle: { titel: "Wiener Netze – Bürgerenergie-Modell anmelden", url: "https://www.wienernetze.at/energiegemeinschaft-anmelden" },
    },
    p2p: {
      anmeldeweg: "Registrierung über ebUtilities (Gemeinschafts-ID und EDA-Anbindung), danach registrieren sich alle Beteiligten im Smart Meter-Webportal und stimmen online zu. Voraussetzungen: Erzeugung und Verbrauch im selben Nahebereich, fertiggestellte Anlage mit angemeldetem Abnehmer, Smart Meter mit Viertelstundenwerten (Opt-in) – ein Opt-out muss vorher widerrufen werden.",
      quelle: { titel: "Wiener Netze – Peer-to-Peer", url: "https://www.wienernetze.at/peer-to-peer" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W melden Sie die Anlage selbst über das Online-Formular; Betrieb zwei Wochen nach der Anmeldung. Konformitätsnachweis nach TOR Erzeuger bzw. OVE E 8101, kein Einspeisezählpunkt, keine Vergütung; ein ungeeigneter Zähler wird getauscht.",
      formular: { name: "Kleinsterzeugungsanlage anmelden", url: "https://www.wienernetze.at/kleinsterzeugungsanlage-anmelden" },
      quelle: { titel: "Wiener Netze – Kleinsterzeugungsanlage: Anleitung", url: "https://www.wienernetze.at/kleinsterzeugungsanlage/anleitung" },
    },
    offen: ["Konkrete Bearbeitungsdauer für PV-Anfragen nicht veröffentlicht", "Pflichtunterlagen für Typ-B-Anlagen nur auf der Marktpartnerplattform einsehbar", "Regeln für Speicher nicht öffentlich beschrieben"],
    quellen: [
      { titel: "Wiener Netze – Photovoltaik (Ablauf in fünf Schritten)", url: "https://www.wienernetze.at/photovoltaik" },
      { titel: "Wiener Netze – Einspeisezählpunktnummer anfragen", url: "https://www.wienernetze.at/einspeisez%C3%A4hlpunktnummer" },
      { titel: "Wiener Netze – Marktpartnerplattform", url: "https://partner.wienernetze.at/" },
      { titel: "Wiener Netze – Datenblatt Eigenerzeugungsanlage WN-0064", url: "https://www.wienernetze.at/documents/16405179/20585092/wn_0064-eigenerzeugungsanlagen-datenblatt.pdf" },
      { titel: "Wiener Netze – Info Anschluss dezentraler Erzeugungsanlagen (Fotovoltaik)", url: "https://www.wienernetze.at/documents/16405179/20585092/EX048_Info_Anschluss_dezentrale_Erzeugungsanlagen_Fotovoltaik_v4.pdf" },
      { titel: "Wiener Netze – Allgemeine Bedingungen Strom-Verteilernetz", url: "https://www.wienernetze.at/o/document/ex003_stromverteilernetzbedingungen_v2_bf" },
      { titel: "Wiener Netze – Messentgelte", url: "https://www.wienernetze.at/o/document/xmessleistungsentgelt_bf" },
      { titel: "Wiener Netze – Kleinsterzeugungsanlage: Anleitung", url: "https://www.wienernetze.at/kleinsterzeugungsanlage/anleitung" },
      { titel: "Wiener Netze – Errichtung einer Ökostromanlage, Kapazitäten", url: "https://www.wienernetze.at/errichtung-%C3%B6kostromanlage" },
      { titel: "Wiener Netze – Versorgungsgebiet", url: "https://www.wienernetze.at/verteilernetze" },
      { titel: "Wiener Netze – Kontakt", url: "https://www.wienernetze.at/kontakt" },
    ],
    geprueftAm: "2026-09-30",
    bild: {
      src: "/Images/AT/foerderung/land-wien-donau-city.jpg",
      alt: "Donau City und Reichsbrücke in Wien",
      motiv: "Donau City und Reichsbrücke, Wien",
      urheber: "Hubertl",
      lizenz: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:2014-09-29_-_Reichsbr%C3%BCcke-Donau_City-Sunken_City.jpg",
    },
  },

  // ------------------------------------------------------------------ Niederösterreich
  {
    slug: "netz-niederoesterreich",
    name: "Netz Niederösterreich GmbH",
    kurz: "Netz NÖ",
    gebiet: "Niederösterreich mit acht Regionalstandorten. Gemeinden am Wiener Stadtrand versorgt teils Wiener Netze – ob eine Adresse im Netzgebiet liegt, prüft das Kundenportal.",
    bundesland: "Niederösterreich",
    zaehlpunkte: 945234,
    portalUrl: "https://kundenportal.netz-noe.at/Customer/Request/AddGeneratingPlant",
    portal: { name: "Kundenportal – „Erzeugungsanlage bekanntgeben“", imSatz: "Über das Kundenportal von Netz NÖ mit dem Formular „Erzeugungsanlage bekanntgeben“", url: "https://kundenportal.netz-noe.at/Customer/Request/AddGeneratingPlant", fuer: "Anlage bis oder über 800 W, Neuanlage oder Erweiterung, Einspeiseart und Wechselrichter aus einer Liste." },
    weiterePortale: [
      { name: "Strom Partner Portal", url: "https://netz-noe.at/services/strom-partner-portal", fuer: "Für Elektrounternehmen: Bekanntgabe, Installationsdokument (Fertigmeldung), Prüfung des Netzentkupplungsschutzes." },
      { name: "Trafokarte für Einspeiser", url: "https://netz-noe.at/strom/versorgungsgebiete-und-kapazitaeten/trafokarte-fuer-einspeiser", fuer: "Freie Einspeisekapazität je Trafostation." },
    ],
    wer: "Den Antrag können Sie im Kundenportal selbst stellen und dabei Ihren Elektrofachbetrieb auswählen; die technischen Daten übermittelt der konzessionierte Betrieb. Fertigmeldungen reichen nur Elektrounternehmen über das Strom Partner Portal ein.",
    eckdaten: { zaehlpunkt: "im Vertragsangebot", zaehlpunktLabel: "Einspeisezählpunkt steht im Vertragsangebot", gueltigkeit: "Über 30 kVA 1 Jahr reserviert" },
    schritte: [
      { titel: "Daten übermitteln", text: "Im Kundenportal bzw. durch den Elektrobetrieb. Über 30 kVA folgen Netzverträglichkeits- und Dimensionierungsprüfung." },
      { titel: "Angebot mit Zählpunkt annehmen", text: "Netz NÖ schickt das Angebot für den Netzzugangsvertrag samt Zählpunkt. Bis 30 kVA stimmen Sie digital zu; darüber geht der unterschriebene Vertrag binnen vier Wochen zurück – dann ist die Einspeiseleistung ein Jahr reserviert." },
      { titel: "Anlage errichten", text: "Über 15 kVA Wechselrichterleistung wird der Bezug auf einen leistungsgemessenen Tarif umgestellt." },
      { titel: "Fertigmeldung", text: "Das Elektrounternehmen meldet die Fertigstellung im Strom Partner Portal; die Leistung muss der beantragten entsprechen." },
      { titel: "Abnahmevertrag", text: "Mit einem Stromlieferanten, der den Einspeisezählpunkt bei Netz NÖ anmeldet. Die Daten müssen zum Vertrag passen." },
      { titel: "Betriebserlaubnis", text: "Netz NÖ prüft und schickt die Betriebserlaubnis – über 30 kVA nach gemeinsamer Abnahme vor Ort. Erst dann darf die Anlage laufen." },
    ],
    unterlagen: [
      "Konformitätsnachweis einer zertifizierten Prüfstelle für die selbsttätige Netzentkupplung",
      "Datenblatt des Wechselrichters; optional Einlinienschaltbild und weitere Datenblätter (bis 5 Dateien)",
      "Bei bestehender Anlage die letzten 9 Stellen der Zählpunktnummer",
      "Name des Energieabnehmers",
      "Zustimmungserklärung, wenn Sie nicht Grundeigentümer sind",
      "Vor der Erstinbetriebnahme: Einstell- und Prüfprotokoll des NA-Schutzes mit Einlinienschaltbild (bis 30 kVA genügt die eingebaute Netzentkupplung mit TOR-Nachweisen)",
      "Netzebene 4: zusätzlich Lageplan und Nachweis der Flächenwidmung",
    ],
    fristen: [
      { titel: "Vorschlag zum Netzanschluss", text: "laut Verteilernetzbedingungen binnen 14 Tagen nach vollständigem Antrag, auf Netzebenen 1–6 binnen eines Monats" },
      { titel: "Vertragsrücksendung über 30 kVA", text: "binnen vier Wochen; danach ist die Einspeiseleistung ein Jahr reserviert" },
      { titel: "Inbetriebnahme bei vorhandenem Zähler", text: "binnen zwei Arbeitstagen; Zählereinbau binnen drei, bei Lastprofilzählern binnen acht Arbeitstagen" },
    ],
    kosten: [
      { titel: "Netzzutritt", text: "nach tatsächlichem Aufwand, in der Niederspannung pauschalierbar; bezahlt wird nach Zustimmung zum Vertrag" },
      { titel: "Kleinere Anlagen", text: "ohne Änderung am Hausanschluss fallen laut Netz NÖ meist keine Kosten an" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Meldung im Kundenportal, kein Netzzugangsvertrag. Nach der Bestätigung von Netz NÖ darf die Anlage laufen; ENS-Konformitätsnachweis nach TOR nötig, ohne Abnahmevertrag keine Vergütung." },
      { titel: "Typ B ab 250 kVA", text: "Anlagen zwischen 250 kVA und 35 MVA gelten als Typ B – das Anlagenkonzept ist vorab mit Netz NÖ abzustimmen." },
      { titel: "Netzebenen nach Größe", text: "bis 30 kVA Netzebene 7, bis 500 kVA Netzebene 6, unter 2.500 kVA Netzebene 5, darüber Netzebene 4 mit eigenem Verfahren und vorläufigem Netzanschlusskonzept." },
      { titel: "Speicher und Erweiterung", text: "Laufen im selben Verfahren; neue Anlagenteile erst nach der Betriebserlaubnis in Betrieb nehmen." },
    ],
    zaehlpunkt: "Der Einspeisezählpunkt steht bereits im Angebot bzw. in der Vertragsbestätigung zum Netzzugang – also vor der Errichtung. Netz NÖ nennt diese Unterlage ausdrücklich als Nachweis für Förderanträge. Aktiv wird der Zählpunkt, wenn der Stromabnehmer ihn anmeldet.",
    inbetriebnahme: "Fertigmeldung im Strom Partner Portal durch das Elektrounternehmen, dann Betriebserlaubnis. Eingespeist werden darf nur mit ausdrücklicher Zustimmung von Netz NÖ, geeignetem Zähler und gültigem Abnahmevertrag. Der NA-Schutz ist spätestens alle fünf Jahre wiederkehrend zu prüfen.",
    elwg: "Netz NÖ beschreibt zum ElWG bisher vor allem die Smart-Meter-Änderungen: Zählpunkte mit Erzeugungsanlage oder Speicher werden auf Viertelstundenwerte umgestellt, ein Opt-out ist dort nicht möglich.",
    kontakt: [
      { label: "Service-Telefon", wert: "02236 201-0", href: "tel:+43223620100", hinweis: "Mo–Fr 7–17 Uhr" },
      { label: "Betriebserlaubnis PV", wert: "photovoltaik@netz-noe.at", href: "mailto:photovoltaik@netz-noe.at" },
      { label: "Anlagen über 30 kVA", wert: "info@netz-noe.at", href: "mailto:info@netz-noe.at" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Teilnehmende stimmen dem Beitritt ihres Zählpunkts durch eine Datenfreigabe im persönlichen Smart Meter Portal aktiv zu; ohne Freigabe kann das Modell nicht abgerechnet werden. Eine Frist nennt Netz NÖ nicht.",
      formular: { name: "Smart Meter Portal – Freigaben", url: "https://smartmeter.netz-noe.at/" },
      nahbereich: { name: "Nahbereichsabfrage", url: "https://netz-noe.at/services/nahbereichsabfrage" },
      kontakt: { wert: "energiegemeinschaft@netz-noe.at", href: "mailto:energiegemeinschaft@netz-noe.at" },
      quelle: { titel: "Netz NÖ – Energiegemeinschaften und Bürgerenergiemodelle", url: "https://netz-noe.at/strom/energiegemeinschaften" },
    },
    p2p: {
      anmeldeweg: "Vertragliche Regelung ohne Vereinsgründung; Anmeldung über die Registrierungsseite von ebUtilities, danach Datenfreigabe jedes Zählpunkts im Smart Meter Portal. Der Nahbereich (Zonen 1 bis 7) bestimmt die Netzentgeltreduktion.",
      quelle: { titel: "Netz NÖ – Energiegemeinschaften und Bürgerenergiemodelle", url: "https://netz-noe.at/strom/energiegemeinschaften" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W Meldung im Kundenportal („Erzeugungsanlage bekanntgeben“, Auswahl bis 800 W), kein Netzzugangsvertrag. Nach der Bestätigung von Netz NÖ darf die Anlage laufen; ENS-Konformitätsnachweis nach TOR nötig, ohne Abnahmevertrag keine Vergütung.",
      formular: { name: "Kundenportal – Erzeugungsanlage bekanntgeben", url: "https://kundenportal.netz-noe.at/Customer/Request/AddGeneratingPlant" },
      quelle: { titel: "Netz NÖ – Balkonkraftwerke und Kleinsterzeugungsanlagen", url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern/balkonkraftwerke-oder-kleinsterzeugungsanlagen" },
    },
    offen: ["Konkrete Bearbeitungsdauer der PV-Angebote nicht veröffentlicht", "Eigene Aussagen zu Anzeige bis 20 kW und Spitzenkappung nach ElWG noch nicht vorhanden", "Frist für die Datenfreigabe bei Energiegemeinschaften nicht veröffentlicht"],
    quellen: [
      { titel: "Netz NÖ – Kundenportal: Erzeugungsanlage bekanntgeben", url: "https://kundenportal.netz-noe.at/Customer/Request/AddGeneratingPlant" },
      { titel: "Netz NÖ – Photovoltaik und Haushaltsanlagen bis 30 kVA", url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern/photovoltaik-und-haushaltsanlagen" },
      { titel: "Netz NÖ – Sonnenkraftwerke und Großbatteriespeicher über 30 kVA", url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern/sonnenkraftwerke-und-grossbatteriespeicher" },
      { titel: "Netz NÖ – Größtanlagen in Netzebene 4", url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern/groesstanlagen-in-netzebene-4" },
      { titel: "Netz NÖ – Quick Check PV-Fertigmeldung", url: "https://netz-noe.at/getContentAsset/0152a040-5e37-412e-8ecc-655437ad41c1/0ee16eb8-9692-4f25-b8a4-d007b35915a4/NetzNoe_QuickCheck_PV_Fertigmeldung_Downloadversion_2-Auflage.pdf?language=de" },
      { titel: "Netz NÖ – Strom Partner Portal", url: "https://netz-noe.at/services/strom-partner-portal" },
      { titel: "Netz NÖ – Parallellaufbedingungen B110 (ab 01.01.2025)", url: "https://netz-noe.at/getContentAsset/c98e71c0-abfc-46cf-ba9f-90331edfee4d/0ee16eb8-9692-4f25-b8a4-d007b35915a4/2025-01-15-Parallellaufbedingungen.pdf?language=de" },
      { titel: "Netz NÖ – Allgemeine Verteilernetzbedingungen B101", url: "https://netz-noe.at/getContentAsset/3b2380a7-382a-4280-9909-50d858d58fad/0ee16eb8-9692-4f25-b8a4-d007b35915a4/B101_Allg_Verteilernetzbedingungen_Strom_NetzNO_WCAG.pdf?language=de" },
      { titel: "Netz NÖ – Gültiger Netzzugangsvertrag", url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern/netzzugangsvertrag-guelitiger-netzzugangsvertrag" },
      { titel: "Netz NÖ – Balkonkraftwerke und Kleinsterzeugungsanlagen", url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern/balkonkraftwerke-oder-kleinsterzeugungsanlagen" },
      { titel: "Netz NÖ – ElWG zu Smart Meter", url: "https://netz-noe.at/energiezukunft/elwg-zu-smart-meter" },
      { titel: "Netz NÖ – Kontakt", url: "https://netz-noe.at/kontakt" },
    ],
    geprueftAm: "2026-09-30",
    bild: {
      src: "/Images/AT/foerderung/land-niederoesterreich-wachau-duernstein.jpg",
      alt: "Dürnstein in der Wachau an der Donau, Niederösterreich",
      motiv: "Dürnstein in der Wachau, Niederösterreich",
      urheber: "Uoaei1",
      lizenz: "CC BY-SA 3.0",
      href: "https://commons.wikimedia.org/wiki/File:D%C3%BCrnstein_Panorama_01.JPG",
    },
  },

  // ------------------------------------------------------------------ Oberösterreich
  {
    slug: "netz-oberoesterreich",
    name: "Netz Oberösterreich GmbH",
    kurz: "Netz OÖ",
    gebiet: "Weite Teile Oberösterreichs sowie Teile Salzburgs, der Steiermark und Niederösterreichs. In Linz und Umgebung ist LINZ NETZ zuständig.",
    bundesland: "Oberösterreich",
    zaehlpunkte: 736171,
    portalUrl: "https://meldewesen.netzooe.at/meldewesen/mw/noUser/newRegistration.jsf",
    portal: { name: "Meldewesen (Plattform für Marktpartner)", imSatz: "Über das Meldewesen, die Online-Plattform von Netz OÖ für Marktpartner", url: "https://meldewesen.netzooe.at/meldewesen/mw/noUser/newRegistration.jsf", fuer: "Konzessionierte Elektrotechniker und Planungsbüros stellen den Antrag online für ihre Kundschaft." },
    weiterePortale: [
      { name: "eService-Portal", url: "https://eservice.netzooe.at", fuer: "Für Kundinnen und Kunden: Status verfolgen, Zusage verlängern, Balkonkraftwerk melden, PV-Einspeiseampel." },
      { name: "Planungstool NETTO", url: "https://netto.netzooe.at", fuer: "Freie Kapazitäten für Großanlagen." },
    ],
    wer: "Den Netzzugang beantragt ausschließlich ein konzessionierter Elektrotechniker oder ein Planungsunternehmen – Änderungen am Antrag laufen ebenfalls nur darüber. Sie verfolgen den Status im eService-Portal.",
    eckdaten: { zaehlpunkt: "zu Beginn (bis 20 kWp)", zaehlpunktLabel: "Einspeisezählpunkt bis 20 kWp automatisch zu Beginn", gueltigkeit: "Zusage 12 + 12 Monate" },
    schritte: [
      { titel: "Planen", text: "Ziel und Verbrauch klären, Anlage planen – die PV-Einspeiseampel im eService-Portal zeigt die Lage im Netz." },
      { titel: "Netzzugang beantragen", text: "Der Elektrotechniker stellt den Antrag im Meldewesen. Anlagen bis 20 kWp erhalten sofort eine Grundzusage und automatisch einen Zählpunkt." },
      { titel: "Netzverträglichkeitsprüfung und Zusage", text: "Netz OÖ prüft und schickt die Netzzugangszusage an Elektrotechniker und Kunde. Sie gilt zwölf Monate und lässt sich einmal um zwölf Monate verlängern." },
      { titel: "Liefervertrag und Errichtung", text: "Vor der Errichtung einen Abnahmevertrag mit einem Lieferanten abschließen, den dieser elektronisch bestätigt – bei Volleinspeisung zwei Verträge." },
      { titel: "Inbetriebnahme", text: "Der Fachbetrieb stimmt den Termin ab; ein Netztechniker baut ein Lastschaltgerät für die Wirkleistungsvorgabe ein." },
      { titel: "Vertrag per Post", text: "Den Netzzugangs- und Betriebsführungsvertrag schickt Netz OÖ nach der Inbetriebnahme – das kann bis zu vier Wochen dauern." },
    ],
    unterlagen: [
      "Antrag über den Elektrotechniker im Meldewesen – eine aktuelle öffentliche Unterlagenliste veröffentlicht Netz OÖ nicht",
      "Für die eService-Registrierung: Geschäftspartnernummer, Bezugszählpunkt, 9-stellige Zähler-Inventarnummer, E-Mail-Adresse",
      "Vom Lieferanten elektronisch bestätigter Abnahmevertrag vor der Inbetriebnahme",
      "Großspeicher: Einspeise- und Bezugsleistung sowie Angabe, ob aus dem Netz geladen wird",
    ],
    fristen: [
      { titel: "Prüfung und Zusage", text: "in der Regel wenige Tage, höchstens vier Wochen" },
      { titel: "Bis 20 kWp", text: "sofortige Grundzusage mit Einspeiseleistung 0; die tatsächliche Leistung folgt nach der Detailprüfung" },
      { titel: "Gültigkeit der Zusage", text: "zwölf Monate, einmal um zwölf Monate verlängerbar (frühestens einen Monat vor Ablauf, im eService-Portal)" },
      { titel: "Netzausbau", text: "laut Netz OÖ in der Niederspannung binnen eines Jahres, in der Mittelspannung binnen drei Jahren" },
    ],
    kosten: [
      { titel: "Einspeisen", text: "derzeit ohne Netzgebühr; ab 01.01.2027 laut Netz OÖ 0,05 Cent je kWh ab 20 kW Einspeiseleistung, auch für Bestandsanlagen" },
      { titel: "Netzausbau", text: "Freibetrag 175 € je kVA; darüber hinausgehende Kosten trägt der Verursacher (Rechenhilfe als Beschränkungsrechner)" },
      { titel: "Großanlagen", text: "Kosten für CUXE-Modul und Fernwirkanlage laut aktuellem Preisblatt" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Kein Netzzugangsantrag und kein Einspeisevertrag, aber kostenlose Meldepflicht im eService-Portal; digitaler Zähler nötig, ein Speicher zählt in die 800 W mit." },
      { titel: "Großanlagen ab 100 kW", text: "100–400 kW an einer Trafostation (Netzebene 6), 400 kW–5 MW mit eigener Trafostation (Netzebene 5), darüber Umspannwerk. Ab 100 kVA CUXE-Modul, ab 250 kVA Fernwirkanlage, ab 1.000 kWp Genehmigung des Landes." },
      { titel: "Freiflächen", text: "Antrag erst ab der öffentlichen Auflage der Umwidmung; Anlagen dürfen nicht aufgeteilt oder zeitlich gestaffelt werden." },
      { titel: "Erweiterung und Speicher", text: "Laufen über den Elektrotechniker; bei Zubau an Altanlagen wird ein Lastschaltgerät fällig." },
    ],
    zaehlpunkt: "Anlagen bis 20 kWp erhalten zu Beginn des Prozesses automatisch einen Zählpunkt. Wann größere Anlagen ihn bekommen und wo er angezeigt wird, beschreibt Netz OÖ nicht öffentlich – klären Sie das mit dem Elektrotechniker, der den Antrag stellt.",
    inbetriebnahme: "Termin über den Fachbetrieb, Netztechniker vor Ort mit Einbau des Lastschaltgeräts. Voraussetzung sind die fertige Anlage und ein vom Lieferanten bestätigter Abnahmevertrag.",
    elwg: "Netz OÖ beschreibt beim ElWG vor allem Smart Meter und Viertelstundenwerte sowie die Bürgerenergie-Regeln ab Oktober 2026. Seit Frühjahr 2025 bekommt jede neue PV-Anlage über 3,68 kVA ein Lastschaltgerät.",
    kontakt: [
      { label: "Service", wert: "+43 5 9070", href: "tel:+4359070" },
      { label: "E-Mail", wert: "service@netzooe.at", href: "mailto:service@netzooe.at" },
      { label: "PV-Anfrageformular", wert: "netzooe.at", href: "https://www.netzooe.at/kic/photovoltaik/kundenanfrage" },
      { label: "Für Fachbetriebe", wert: "meldewesen@netzooe.at", href: "mailto:meldewesen@netzooe.at" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Teilnehmende stimmen der Auslesung der Viertelstundenwerte und der Datenfreigabe im eService-Portal ausdrücklich zu; die Kennzahlen für den Nahbereich (Trafostation, Umspannwerk) beschreibt die Seite „Teilnahme-Check“. Eine Frist nennt Netz OÖ nicht.",
      formular: { name: "eService-Portal", url: "https://eservice.netzooe.at/app" },
      nahbereich: { name: "Teilnahme-Check für Energiegemeinschaften", url: "https://www.netzooe.at/themen/energiezukunft/teilnahme-check-fuer-energiegemeinschaften" },
      kontakt: null,
      quelle: { titel: "Netz OÖ – Verbrauchsdaten und Viertelstundenwerte im eService-Portal", url: "https://www.netzooe.at/themen/information/auslesung-viertelstundenwerte" },
    },
    p2p: {
      anmeldeweg: "Netz OÖ verweist für die Bürgerenergie-Regeln ab Oktober 2026 auf das ElWG; einen eigenen Peer-to-Peer-Prozess beschreibt die Website zum Prüfdatum nicht. Registrierung läuft wie bei allen Netzbetreibern über ebUtilities, die Zustimmung der Zählpunkte über das eService-Portal.",
      quelle: { titel: "Netz OÖ – Gesetzliche Änderungen 2026 (ElWG)", url: "https://www.netzooe.at/strom/gesetzliche-aenderungen-2026" },
      offen: true,
    },
    kleinsterzeugung: {
      text: "Bis 800 W kein Netzzugangsantrag und kein Einspeisevertrag, aber kostenlose Meldepflicht im eService-Portal; digitaler Zähler nötig, ein Speicher zählt in die 800 W mit.",
      formular: { name: "eService-Portal – Balkonkraftwerk melden", url: "https://eservice.netzooe.at/app" },
      quelle: { titel: "Netz OÖ – Balkonkraftwerke", url: "https://www.netzooe.at/photovoltaik/balkonkraftwerke" },
    },
    offen: ["Zeitpunkt des Einspeisezählpunkts über 20 kWp nicht öffentlich beschrieben", "Aktuelle Unterlagenliste nicht veröffentlicht (Technische Bedingungen von 2017 teils überholt)", "Ältere FAQ und aktuelle Ablaufseite widersprechen sich beim Termin vor Ort unter 30 kWp", "Peer-to-Peer-Prozess und Kontaktadresse für Energiegemeinschaften nicht öffentlich beschrieben (Seiten werden dynamisch geladen)"],
    quellen: [
      { titel: "Netz OÖ – Schritt 4: Netzzugang beantragen (inkl. FAQ)", url: "https://www.netzooe.at/photovoltaik/sechs-schritte-zur-pv/schritt-4" },
      { titel: "Netz OÖ – Schritt 5: Errichten", url: "https://www.netzooe.at/photovoltaik/sechs-schritte-zur-pv/schritt-5" },
      { titel: "Netz OÖ – Schritt 6: Inbetriebnahme", url: "https://www.netzooe.at/photovoltaik/sechs-schritte-zur-pv/schritt-6" },
      { titel: "Netz OÖ – Plattform für Marktpartner (Meldewesen)", url: "https://www.netzooe.at/themen/online-services/plattform-marktpartner" },
      { titel: "Netz OÖ – eService-Portal", url: "https://www.netzooe.at/strom/service/eservice-portal" },
      { titel: "Netz OÖ – FAQ Anfrageprozess Photovoltaik", url: "https://www.netzooe.at/kic/photovoltaik/anfrage" },
      { titel: "Netz OÖ – Großanlagen und Großspeicher", url: "https://www.netzooe.at/photovoltaik/grossanlagen" },
      { titel: "Netz OÖ – Weg zur PV-Großanlage", url: "https://www.netzooe.at/photovoltaik/grossanlagen/schritt-3-ihr-weg-zur-pv-grossanlage" },
      { titel: "Netz OÖ – Balkonkraftwerke", url: "https://www.netzooe.at/photovoltaik/balkonkraftwerke" },
      { titel: "Netz OÖ – Batteriespeicher", url: "https://www.netzooe.at/strom/hausanschluss/batteriespeicher" },
      { titel: "Netz OÖ – Gesetzliche Änderungen 2026 (ElWG)", url: "https://www.netzooe.at/strom/gesetzliche-aenderungen-2026" },
      { titel: "Netz OÖ – Über uns (Netzgebiet)", url: "https://www.netzooe.at/unternehmen/ueber-uns" },
    ],
    geprueftAm: "2026-09-30",
    bild: {
      src: "/Images/AT/foerderung/land-oberoesterreich-traunsee-traunstein.jpg",
      alt: "Traunstein und Traunsee in Oberösterreich",
      motiv: "Traunstein und Traunsee, Oberösterreich",
      urheber: "Tigerente",
      lizenz: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Traunstein_Karbach_Traunsee_20210313.jpg",
    },
  },

  // ------------------------------------------------------------------ Steiermark
  {
    slug: "energienetze-steiermark",
    name: "Energienetze Steiermark GmbH",
    kurz: "Energienetze Steiermark",
    gebiet: "Steiermark mit rund 10.400 km² Versorgungsgebiet. Graz und Teile des Landes versorgen andere Netzbetreiber, etwa Stromnetz Graz und regionale E-Werke.",
    bundesland: "Steiermark",
    zaehlpunkte: 524795,
    portalUrl: "https://ole.e-netze.at/esp/",
    portal: { name: "Einspeiser-Portal (ESP)", imSatz: "Über das Einspeiser-Portal (ESP) von Energienetze Steiermark", url: "https://ole.e-netze.at/esp/", fuer: "Alle Erzeugungsanlagen, unabhängig von der Größe – Anlagenbetreiber und Errichter können ein Konto anlegen." },
    weiterePortale: [
      { name: "Fertigmeldung PV hochladen", url: "https://portal.e-netze.at/FertigmeldungPV", fuer: "Unterschriebenes Installationsdokument." },
      { name: "Kontaktformular", url: "https://portal.e-netze.at/kontaktformular-extern", fuer: "Fragen zu Erzeugungsanlagen." },
    ],
    wer: "Anlagenbetreiber und Errichter registrieren sich im Einspeiser-Portal – Privatpersonen ebenso wie Firmen und Planungsbüros. Konzessionierte Elektrounternehmen laden ihre Konzession hoch; wer für andere ansucht, braucht eine Vollmacht.",
    eckdaten: { zaehlpunkt: "mit Zählpunktbrief", zaehlpunktLabel: "Einspeisezählpunkt mit dem Zählpunktbrief", gueltigkeit: "Konzept 12 + 12 Monate" },
    schritte: [
      { titel: "Registrieren und Zählpunkt ansuchen", text: "Konto im Einspeiser-Portal anlegen und den Einspeisezählpunkt beantragen. Sie erhalten den Zählpunktbrief – noch keine Netzzusage." },
      { titel: "Netzbeurteilung", text: "Startet automatisch. Das Netzanschlusskonzept nennt den technisch geeigneten Anschlusspunkt und die Betriebsvorgaben; es gilt zwölf Monate und ist einmal um zwölf Monate verlängerbar." },
      { titel: "Errichten", text: "Innerhalb der Gültigkeit. Je nach Netzsituation können Kosten für eine Netzverstärkung anfallen." },
      { titel: "Fertigmeldung", text: "Das konzessionierte Elektrounternehmen füllt das Installationsdokument aus; Errichter und Betreiber unterschreiben, dann wird es hochgeladen." },
      { titel: "Anmeldung durch den Abnehmer", text: "Energienetze Steiermark schickt dem Stromabnehmer einen Belieferungswunsch. Erst mit dessen Anmeldebestätigung darf die Anlage in Betrieb gehen; danach folgt der Netzzugangsvertrag." },
    ],
    unterlagen: [
      "Standort mit Grundstücks- und KG-Nummer, technische Daten, Speicherdaten, Betreiberdaten",
      "Bei Überschusseinspeisung der Bezugszählpunkt – der Anlagenname muss dem Vertragspartner des Bezugs entsprechen",
      "Wechselrichter von der Liste „TOR Erzeuger Typ A“ von Oesterreichs Energie",
      "Über 30 kVA: Prüfprotokoll für die Netzentkupplung",
      "Typ B bis 1.000 kW: unterschriebene Konformitätserklärung; über 1.000 kW zusätzlich Simulationsergebnisse",
      "Freiflächen ab 250 kW: Nachweis der Widmung oder Erklärung der Gemeinde",
      "Gegebenenfalls Vollmacht und Planungsunterlagen",
    ],
    fristen: [
      { titel: "Zählpunktbrief", text: "laut Energienetze Steiermark „zeitnah“, wenn die Daten vollständig sind – eine Frist in Tagen wird nicht genannt" },
      { titel: "Netzanschlusskonzept", text: "gilt zwölf Monate, einmal um zwölf Monate verlängerbar; Erinnerung sechs Monate vor Ablauf" },
    ],
    kosten: [
      { titel: "Netzzutritt", text: "Nach einem OGH-Urteil (1 Ob 85/24t) kein Netzzutrittsentgelt, wenn die Anlage an einen bestehenden Bezugsanschluss kommt und in dessen Kapazität passt; bereits bezahlte Pauschalen werden erstattet" },
      { titel: "Zähler und Steuerung", text: "Einen nötigen Zählertausch zahlt der Netzbetreiber; Kabel und Anpassungen für die Wirkleistungsvorgabe zahlt der Betreiber" },
      { titel: "Fernwirk-Schnittstelle nach TOR", text: "laut Preisblatt einmalig 10.000 bis 20.000 € je Netzebene" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Meldung über das Portal oder per E-Mail mit Formular, keine Fertigmeldung. Auch mit Speicher dürfen 800 W nie überschritten werden; Konformitätsnachweis nötig, keine Vergütung." },
      { titel: "Wirkleistungsvorgabe", text: "Seit 01.12.2024 für PV von 3,68 bis 250 kW verpflichtend: Kabel vom Wechselrichter zum Smart Meter. Ab 3 kW dreiphasiger Betrieb, je Bezugszählpunkt nur eine Überschussanlage." },
      { titel: "Typ B", text: "Bis 1.000 kW Konformitätserklärung, darüber zusätzlich Simulationen (Fault-Ride-Through, Blindstromstützung, LFSM-O). Großkunden erreichen das Key-Account-Team." },
      { titel: "Speicher und Erweiterung", text: "Gelten als wesentliche Änderung: im Portal am bestehenden Einspeisezählpunkt bearbeiten, danach neues Netzanschlusskonzept für die Gesamtanlage." },
    ],
    zaehlpunkt: "Den Einspeisezählpunkt suchen Sie im Einspeiser-Portal an; er kommt mit dem Zählpunktbrief – vor dem Netzanschlusskonzept und vor der Inbetriebnahme – und steht danach in der Portal-Übersicht. Energienetze Steiermark nennt ihn ausdrücklich als Grundlage für Bescheid- und Förderansuchen; eine Netzzusage ist er aber nicht.",
    inbetriebnahme: "Die Fertigmeldung erstellt ein Konto mit Konzession im Portal (Wechselrichter, Module, Schutzkonzept, Speicher, Einstellwerte). Die Freigabe kommt erst nach der Anmeldebestätigung des Stromabnehmers.",
    elwg: "Die ElWG-Seite von Energienetze Steiermark behandelt Smart Meter, Speicher und Peer-to-Peer bzw. Eigenversorgungsanlagen (ab 05.10.2026 im eigenen Netzgebiet, österreichweit geplant ab April 2027).",
    kontakt: [
      { label: "Info-Hotline", wert: "+43 316 90555", href: "tel:+4331690555" },
      { label: "Erzeugungsanlagen", wert: "einspeiser@e-netze.at", href: "mailto:einspeiser@e-netze.at" },
      { label: "Großkunden", wert: "keyaccount@e-netze.at", href: "mailto:keyaccount@e-netze.at" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Zählpunktinhaber bestätigen Teilnahme und Datenfreigabe im Serviceportal (Bereich „Energiedatenfreigabe“); erst nach Zustimmung und Prüfung wird die Teilnahme aktiviert. Alle Zählpunkte brauchen Smart Meter oder Lastprofilzähler. Eine Frist nennt die Seite nicht.",
      formular: { name: "Serviceportal – Energiedatenfreigabe", url: "https://portal.e-netze.at/" },
      nahbereich: { name: "Nahbereichsabfrage (Quick Check)", url: "https://portal.e-netze.at/nahbereich" },
      kontakt: { wert: "energiegemeinschaften@e-netze.at", href: "mailto:energiegemeinschaften@e-netze.at" },
      quelle: { titel: "Energienetze Steiermark – Bürgerenergiemodelle", url: "https://www.e-netze.at/Strom/Energiegemeinschaften/Default.aspx" },
    },
    p2p: {
      anmeldeweg: "Ab 05.10.2026 über den Registrierungsprozess auf ebUtilities (Modelle Peer-to-Peer und Eigenversorgung), vorübergehend nur innerhalb desselben Netzgebiets; österreichweit voraussichtlich ab April 2027. Vergünstigte Netzentgelte dafür erst ab 01.01.2027. Zonenlevel 1, 3, 4 oder 6, Zuordnung nach tatsächlicher Netztopologie.",
      quelle: { titel: "Energienetze Steiermark – Bürgerenergiemodelle", url: "https://www.e-netze.at/Strom/Energiegemeinschaften/Default.aspx" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W Meldung über das Einspeiser-Portal oder per E-Mail mit dem Meldeformular, keine Fertigmeldung. Auch mit Speicher dürfen 800 W nie überschritten werden; Konformitätsnachweis nötig, keine Vergütung.",
      formular: { name: "Meldeformular Kleinsteinspeiseanlagen (PDF)", url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=EN_Kleinsteinspeiseanlagen_Meldeformular.pdf" },
      quelle: { titel: "Energienetze Steiermark – Erzeugungsanlagen", url: "https://www.e-netze.at/Strom/Erzeugungsanlagen/Default.aspx" },
    },
    offen: ["Keine Bearbeitungsdauer in Tagen veröffentlicht", "Erreichbarkeit der Hotline auf zwei Seiten unterschiedlich angegeben", "Genaue Abgrenzung des Netzgebiets nur als Karte verfügbar"],
    quellen: [
      { titel: "Energienetze Steiermark – Erzeugungsanlagen", url: "https://www.e-netze.at/Strom/Erzeugungsanlagen/Default.aspx" },
      { titel: "Energienetze Steiermark – Infoblatt PV-Erzeugungsanlage in 5 Schritten (07/2025)", url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=EN_Infoblatt%20PV_Erzeugungsanlage_Adaption_07_2025_bf.pdf" },
      { titel: "Energienetze Steiermark – Meldeformular Kleinsteinspeiseanlagen", url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=EN_Kleinsteinspeiseanlagen_Meldeformular.pdf" },
      { titel: "Energienetze Steiermark – ESP-Dokumentation: Registrierung", url: "https://ole.e-netze.at/ole-docs/esp_ext/Registrierung/index.html" },
      { titel: "Energienetze Steiermark – ESP-Dokumentation: Anfrage", url: "https://ole.e-netze.at/ole-docs/esp_ext/Anfrage/index.html" },
      { titel: "Energienetze Steiermark – ESP-Dokumentation: Fertigstellungsmeldung", url: "https://ole.e-netze.at/ole-docs/esp_ext/Fertigstellungsmeldung/index.html" },
      { titel: "Energienetze Steiermark – OGH-Urteil zum Netzzutrittsentgelt", url: "https://www.e-netze.at/Unternehmen/News/Detail.aspx?Id=-2083408728" },
      { titel: "Energienetze Steiermark – Preisblatt Strom ab 01.04.2026", url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=EN_Preisblatt_Strom_01042026_Juli-2026_barrierefrei.pdf" },
      { titel: "Energienetze Steiermark – ElWG", url: "https://www.e-netze.at/Strom/ELWG/Default.aspx" },
      { titel: "Energienetze Steiermark – Stromanschluss und Kontakt", url: "https://www.e-netze.at/strom/stromanschluss/Default.aspx" },
      { titel: "Energienetze Steiermark – Unternehmen und Netzdaten", url: "https://www.e-netze.at/Unternehmen/Default.aspx" },
    ],
    geprueftAm: "2026-09-30",
    bild: {
      src: "/Images/AT/foerderung/land-steiermark-weinstrasse.jpg",
      alt: "Weinberge an der Südsteirischen Weinstraße",
      motiv: "Südsteirische Weinstraße, Steiermark",
      urheber: "Simon Legner (User:simon04)",
      lizenz: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:S%C3%BCdsteirische_Weinstra%C3%9Fe_(IMG_20240929_104056).jpg",
    },
  },

  // ------------------------------------------------------------------ Salzburg
  {
    slug: "salzburg-netz",
    name: "Salzburg Netz GmbH",
    kurz: "Salzburg Netz",
    gebiet: "Bundesland Salzburg mit einzelnen ausgesparten Gebieten; Geschäftsstellen für Stadt Salzburg, Flachgau, Tennengau, Pongau, Lungau und Pinzgau.",
    bundesland: "Salzburg",
    zaehlpunkte: 465566,
    portalUrl: "https://portal.salzburgnetz.at",
    portal: { name: "Serviceportal – „Anschlussbestätigung“", imSatz: "Über das Serviceportal von Salzburg Netz (Bereich „Anschlussbestätigung“)", url: "https://portal.salzburgnetz.at", fuer: "Online für Überschusseinspeisung bis 120 kW auf einen bestehenden Verbrauchszähler, im Standard- oder Expertenmodus." },
    weiterePortale: [
      { name: "Online-Meldewesen", url: "https://meldewesen.salzburgnetz.at/meldewesen/", fuer: "Für Elektrounternehmen: Anschlussbestellung und Fertigmeldung." },
      { name: "Datenblatt Photovoltaik", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/service/Strom-Erzeugung_Datenblatt-mit-Wechselrichter.pdf", fuer: "Für Volleinspeisung, über 120 kW und andere Erzeugungsarten – per E-Mail an die zuständige Geschäftsstelle." },
    ],
    wer: "Die Anschlussbestätigung beantragen Sie selbst oder ein beauftragtes konzessioniertes Elektrounternehmen. Anschlussbestellung und Fertigmeldung laufen ausschließlich über das Elektrounternehmen.",
    eckdaten: { zaehlpunkt: "mit Anschlussbestätigung", zaehlpunktLabel: "Einspeisezählpunkt mit der Anschlussbestätigung", gueltigkeit: "Bestätigung gilt 1 Jahr" },
    schritte: [
      { titel: "Daten melden", text: "Im Serviceportal oder mit dem Datenblatt per E-Mail an die Geschäftsstelle." },
      { titel: "Anschlussbestätigung mit Zählpunkt", text: "Nach der Netzberechnung per E-Mail – online kommt die Zählpunktbestätigung meist nach wenigen Minuten. Ist eine Netzverstärkung nötig, folgt ein eigenes Angebot mit Realisierungszeitraum." },
      { titel: "Anschlussbestellung", text: "Der Elektriker bestellt im Online-Meldewesen mit Wechselrichtertyp und Energieabnehmer – spätestens zwei Monate vor der geplanten Inbetriebnahme. Errichtet wird nach der Freigabe." },
      { titel: "Abnehmer wird informiert", text: "Salzburg Netz leitet den Marktprozess an den gewählten Stromabnehmer weiter." },
      { titel: "Fertigmeldung", text: "Das Elektrounternehmen meldet die Fertigstellung im Online-Meldewesen; bei Bedarf folgen Zählertausch und eine stichprobenartige Prüfung." },
      { titel: "Aktivierung und Vertrag", text: "Aktiv wird die Anlage, sobald der Abnehmer die Anmeldung bestätigt hat – vorher eingespeister Strom wird nicht vergütet. Danach folgt der Netzzugangsvertrag Einspeisung." },
    ],
    unterlagen: [
      "Kundennummer und bestehender 33-stelliger Bezugszählpunkt",
      "Einspeiseart und Anlagenadresse; bei Neubau oder Freifläche KG- und Grundstücksnummer",
      "Modulleistung in kWp und Nennscheinleistung des Wechselrichters in kVA; netzwirksame Einspeiseleistung",
      "Speicher: Leistung in kVA, Kapazität in kWh, Betriebskonzept",
      "Wechselrichter von der Liste nach TOR Erzeuger Typ A (Oesterreichs Energie)",
      "Wer die OeMAG als Abnehmer wählt: Abnahmevertrag in der Anschlussbestellung hochladen",
      "Fertigmeldung: Fotos von Hausanschlusskasten, Vorzählerfeld und Zähler, Typenschild des Wechselrichters, Einstellprotokoll (Ländereinstellung AT, Q(U)), gegebenenfalls NA-Schutz-Prüfprotokoll",
    ],
    fristen: [
      { titel: "Bearbeitung", text: "in der Regel wenige Tage, in Spitzenzeiten bis zu vier Wochen; online meist Minuten bis zur Zählpunktbestätigung" },
      { titel: "Anschlussbestellung", text: "spätestens zwei Monate vor der geplanten Inbetriebnahme" },
      { titel: "Gültigkeit", text: "Anschlussbestätigung ein Jahr, per E-Mail verlängerbar (bei anzeigepflichtigen Anlagen höchstens einmal)" },
      { titel: "Typ B", text: "Leitsystemanbindung mindestens sechs Wochen vor Inbetriebnahme bestellen" },
    ],
    kosten: [
      { titel: "Netzzutritt", text: "Nach einem OGH-Urteil nur, wenn konkrete Netzmaßnahmen nötig sind; pauschal bezahlte Beträge werden erstattet. Grundlage ist die netzwirksame Leistung" },
      { titel: "Neuer Anschluss", text: "Pauschalen für Netzebene 7 laut Preisblatt 2026, z. B. ohne Tiefbau 1.565 € bis 15 m (netto)" },
      { titel: "Typ B ab 250 kW", text: "Fernwirkpauschale 10.000 € (Netzebene 6/7), 15.000 € (4/5) bzw. 20.000 € (3), netto" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Meldung im Serviceportal unter „Balkonkraftwerk“. Kein Einspeisezählpunkt, kein Netzzugangs- und Abnahmevertrag, keine Vergütung; ENS-Konformitätsnachweis nötig." },
      { titel: "Typ B ab 250 kW", text: "Anbindung an das Netzleitsystem mit Standard-Steuerschrank ist Pflicht; bei Engpässen kann die Netzleitstelle abregeln." },
      { titel: "Speicher", text: "Werden wie Erzeugungsanlagen gemeldet, online nur mit Überschussanlage bis 120 kW. Ab 5 MW Zusatzunterlagen und Sicherstellung." },
      { titel: "Erweiterung", text: "Gleicher Ablauf; online nur bis 120 kW gesamt. Im Datenblatt nur die zusätzliche Leistung eintragen." },
    ],
    zaehlpunkt: "Der Einspeisezählpunkt wird mit der Anschlussbestätigung vergeben, also vor der Errichtung; online kommt die Zählpunktbestätigung automatisch per E-Mail und steht im Serviceportal. Salzburg Netz nennt diese Bestätigung ausdrücklich als Unterlage für den Förderantrag.",
    inbetriebnahme: "Fertigmeldung durch das Elektrounternehmen im Online-Meldewesen mit Fotos und Einstellprotokoll. Zählertausch, wenn noch kein Smart Meter bzw. Lastprofilzähler verbaut ist; aktiv wird die Anlage nach Bestätigung durch den Abnehmer.",
    elwg: "Salzburg Netz verweist auf das ElWG bisher vor allem formal, etwa im Informationsblatt für Einspeiser und im Preisblatt.",
    kontakt: [
      { label: "Serviceline", wert: "0800 660 661", href: "tel:+43800660661", hinweis: "kostenlos" },
      { label: "Kundenservice", wert: "kundenservice@salzburgnetz.at", href: "mailto:kundenservice@salzburgnetz.at" },
      { label: "Verlängerung Anschlussbestätigung", wert: "einspeiser@salzburgnetz.at", href: "mailto:einspeiser@salzburgnetz.at" },
      { label: "Leitsystem Typ B", wert: "leittechnik.erzeuger@salzburgnetz.at", href: "mailto:leittechnik.erzeuger@salzburgnetz.at" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Im Serviceportal unter „Datenfreigabe“ die offene Anfrage auswählen und auf „Beitreten“ klicken – damit stimmen Sie der Messung im 15-Minuten-Intervall und der Zusatzvereinbarung zum Netzzugangsvertrag zu; Austritt jederzeit über „Austreten“. Smart Meter mit aktivierter Viertelstundenmessung ist Pflicht, ein Opt-out schließt die Teilnahme aus.",
      formular: { name: "Serviceportal – Datenfreigabe (Anleitung PDF)", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/energiegemeinschaften/Anleitung_Beitritt_Energiegemienschaft_Serviceportal.pdf" },
      nahbereich: { name: "Nahebereichsabfrage", url: "https://www.salzburgnetz.at/stromnetz/energiegemeinschaften/nahebereichsabfrage.html" },
      kontakt: { wert: "energiegemeinschaften@salzburgnetz.at", href: "mailto:energiegemeinschaften@salzburgnetz.at" },
      quelle: { titel: "Salzburg Netz – Energiegemeinschaften und Bürgerenergiemodelle", url: "https://www.salzburgnetz.at/stromnetz/energiegemeinschaften.html" },
    },
    p2p: {
      anmeldeweg: "Peer-to-Peer-Vertrag ohne eigene Rechtsperson, zunächst innerhalb des Netzgebiets, österreichweit ab April 2027. Bis 01.01.2027 keine Netzentgeltreduktion, danach je Nahebereichszone. Ein Zählpunkt kann an bis zu fünf Modellen teilnehmen (Teilnahmefaktor in Summe höchstens 100 %); die Zustimmung läuft über die Datenfreigabe im Serviceportal.",
      quelle: { titel: "Salzburg Netz – Energiegemeinschaften und Bürgerenergiemodelle", url: "https://www.salzburgnetz.at/stromnetz/energiegemeinschaften.html" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W Meldung im Serviceportal unter „Balkonkraftwerk“. Kein Einspeisezählpunkt, kein Netzzugangs- und Abnahmevertrag, keine Vergütung; ENS-Konformitätsnachweis nötig.",
      formular: { name: "Serviceportal – Balkonkraftwerk", url: "https://portal.salzburgnetz.at" },
      quelle: { titel: "Salzburg Netz – Balkonkraftwerk anmelden", url: "https://www.salzburgnetz.at/service/netzanschluss-stromerzeuger/anmeldung-aenderung-balkonkraftwerk.html" },
    },
    offen: ["Widerspruch: Website sagt keine Vertragsrücksendung nötig, Datenblatt 08/2026 und FAQ verlangen die unterschriebene Rücksendung", "Messentgelte für Erzeuger nicht geprüft (Preisblatt nicht lesbar)"],
    quellen: [
      { titel: "Salzburg Netz – Netzanschluss neue Erzeugungsanlage", url: "https://www.salzburgnetz.at/service/netzanschluss-stromerzeuger/anschluss-erzeugungsanlage.html" },
      { titel: "Salzburg Netz – FAQ Erzeugung", url: "https://www.salzburgnetz.at/service/faq/erzeugung.html" },
      { titel: "Salzburg Netz – Netzanschluss Stromerzeuger", url: "https://www.salzburgnetz.at/service/netzanschluss-stromerzeuger.html" },
      { titel: "Salzburg Netz – Datenblatt Photovoltaik (08/2026)", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/service/Strom-Erzeugung_Datenblatt-mit-Wechselrichter.pdf" },
      { titel: "Salzburg Netz – Ausfüllhilfe Datenblatt", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/service/Ausfuellhilfe_Datenblatt-Photovoltaikanlage.pdf" },
      { titel: "Salzburg Netz – Vorgaben Netzanschluss und Netzparallelbetrieb", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/stromnetz/Strom-Erzeugung_Vorgaben_Netzanschluss-Netzparallelbetrieb.pdf" },
      { titel: "Salzburg Netz – Pauschalen Netzzutritt 2026", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/netzanschluss/Strom_Pauschalen_Netzzutritt.pdf" },
      { titel: "Salzburg Netz – Rückerstattung Netzzutrittsentgelt", url: "https://www.salzburgnetz.at/ueber-uns/aktuelle-infos/rueckerstattung-netzzutrittsentgelt.html" },
      { titel: "Salzburg Netz – Balkonkraftwerk anmelden", url: "https://www.salzburgnetz.at/service/netzanschluss-stromerzeuger/anmeldung-aenderung-balkonkraftwerk.html" },
      { titel: "Salzburg Netz – Leitsystemanbindung Typ-B-Anlagen", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/stromnetz/Strom_Leitsystemanbindung_TypB-Anlagen.pdf" },
      { titel: "Salzburg Netz – Batteriespeicher", url: "https://www.salzburgnetz.at/service/netzanschluss-stromerzeuger/batteriespeicheranlagen.html" },
      { titel: "Salzburg Netz – Erweiterung einer Erzeugungsanlage", url: "https://www.salzburgnetz.at/service/netzanschluss-stromerzeuger/erweiterung-aenderung-einer-erzeugungsanlage.html" },
      { titel: "Salzburg Netz – Checkliste Fertigstellungsanzeige", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/netzanschluss/Checkliste_Elektriker_Fertigstellungsanzeige.pdf" },
      { titel: "Salzburg Netz – Versorgungsgebiet (Karte)", url: "https://www.salzburgnetz.at/content/dam/salzburgnetz/dokumente/stromnetz/Stromnetz_Versorgungsgebiet.pdf" },
      { titel: "Salzburg Netz – Kontakt", url: "https://www.salzburgnetz.at/service/kontakt.html" },
    ],
    geprueftAm: "2026-09-30",
    bild: {
      src: "/Images/AT/foerderung/land-salzburg-altstadt.jpg",
      alt: "Salzburger Altstadt mit der Festung Hohensalzburg",
      motiv: "Salzburger Altstadt, Salzburg",
      urheber: "Uoaei1",
      lizenz: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Salzburg_Altstadt_Panorama_20230607_01.jpg",
    },
  },

  // ------------------------------------------------------------------ Kärnten
  {
    slug: "kng-kaernten-netz",
    name: "KNG-Kärnten Netz GmbH",
    kurz: "Kärnten Netz",
    gebiet: "Weite Teile Kärntens mit rund 19.000 km Stromnetz und 236.600 Kundinnen und Kunden (Strom und Gas). Eigene Netzbetreiber sind laut E-Control-Liste die Energie Klagenfurt GmbH (Stadt Klagenfurt) und die AAE Wasserkraft.",
    bundesland: "Kärnten",
    zaehlpunkte: 341365,
    portalUrl: "https://services.kaerntennetz.at/meinPortal/Einspeisung",
    portal: { name: "Mein Portal – Anschlussantrag Einspeisung", imSatz: "Über „Mein Portal“ von Kärnten Netz (Anschlussantrag Einspeisung)", url: "https://services.kaerntennetz.at/meinPortal/Einspeisung", fuer: "Kundinnen und Kunden stellen den Antrag selbst oder lassen ihn durch bevollmächtigte Planer oder Elektriker abwickeln; die Netzberechnung ermittelt die mögliche Einspeiseleistung automatisch." },
    weiterePortale: [
      { name: "Dienstleisterportal", url: "https://services.kaerntennetz.at/DLP", fuer: "Für Elektrofachbetriebe, unter anderem Fertigstellungsmeldung." },
      { name: "Postfach in Mein Portal", url: "https://services.kaerntennetz.at/meinPortal/Postfach", fuer: "Netzzugangsvertrag als PDF, Statusmeldungen zum Antrag." },
      { name: "Smart-Meter-Werte", url: "https://services.kaerntennetz.at/meinPortal/Verbrauch?typ=detail", fuer: "Verbrauchsdaten zur Dimensionierung der Anlage." },
    ],
    wer: "Den Anschlussantrag stellen Sie selbst in Mein Portal oder ein bevollmächtigter Anlagenplaner bzw. Elektriker. Die Fertigstellungsmeldung macht der konzessionierte Elektriker im Portal; dazu brauchen Sie einen Abnahmevertrag mit einem Energielieferanten.",
    eckdaten: { zaehlpunkt: "nicht veröffentlicht", zaehlpunktLabel: "Zeitpunkt des Einspeisezählpunkts nicht veröffentlicht", gueltigkeit: "Gültigkeit des Angebots nicht veröffentlicht" },
    schritte: [
      { titel: "Anlage dimensionieren", text: "Verbrauch mit den Smart-Meter-Werten aus Mein Portal prüfen, große Verbraucher wie E-Auto oder Wärmepumpe einplanen. Kärnten Netz empfiehlt eine am Eigenbedarf orientierte Größe." },
      { titel: "Anschlussantrag in Mein Portal", text: "Antrag Einspeisung stellen; die Netzberechnung ermittelt automatisch die maximal mögliche Einspeiseleistung am Anschlusspunkt. Sie werden laufend über den Status informiert." },
      { titel: "Netzzutrittsangebot", text: "Kärnten Netz garantiert eine Einspeiseleistung mindestens in Höhe des erworbenen Strombezugsrechts. Reicht das nicht: alternativer Anschlusspunkt auf eigene Kosten, dynamische Leistungsregelung (etwa auf 70 % der Modulleistung) oder Warten auf Netzausbau." },
      { titel: "Netzzugangsvertrag", text: "Der Vertrag liegt im Postfach von Mein Portal; er weist das Strombezugsrecht aus." },
      { titel: "Errichten und fertigmelden", text: "Nach der Errichtung reicht der konzessionierte Elektriker die Fertigstellungsmeldung im Portal ein – Voraussetzung für die Inbetriebnahme." },
      { titel: "Abnahmevertrag und Inbetriebnahme", text: "Abnahmevertrag mit einem Energielieferanten Ihrer Wahl abschließen; danach kann die Anlage in Betrieb gehen." },
    ],
    unterlagen: [
      "Anschlussantrag in Mein Portal mit Anlagendaten (Modulleistung in kWp, Wechselrichter, gewünschte Einspeiseleistung) – eine öffentliche Unterlagenliste veröffentlicht Kärnten Netz nicht",
      "Fertigstellungsmeldung durch den konzessionierten Elektriker im Portal",
      "Abnahmevertrag mit einem Energielieferanten vor der Inbetriebnahme",
      "Ab 250 kW: Vorgaben laut „Informationen und technische Vorgaben für Erzeugungsanlagen und Energiespeicher“ (TOR SEA, Version 4.0 ab 01.09.2026), unter anderem Fernwirkanbindung nach IEC 60870-5-104",
    ],
    fristen: [
      { titel: "Antwort auf Anträge auf Netzzutritt", text: "laut Allgemeinen Verteilernetzbedingungen innerhalb angemessener, vierzehn Tage nicht überschreitender Frist mit einem konkreten Vorschlag" },
      { titel: "Anfragen und Beschwerden", text: "binnen fünf Arbeitstagen (Allgemeine Verteilernetzbedingungen)" },
      { titel: "Kleinsterzeugungsanlage", text: "spätestens zwei Wochen vor Inbetriebnahme per Anschlussantrag melden" },
      { titel: "Gültigkeit des Netzzutrittsangebots", text: "nicht veröffentlicht" },
    ],
    kosten: [
      { titel: "Netzzutrittsentgelt", text: "einmalig laut Preisblatt Strom 2026; bei einem alternativen Anschlusspunkt trägt der Anschlussnehmer die Kosten der Leitungsverlegung (Verursacherprinzip)" },
      { titel: "Messung", text: "Entgelte für Messleistungen laut Preisblatt Strom 2026 (monatlich je Zählertyp)" },
      { titel: "Netzausbau", text: "Kärnten Netz nennt über eine Milliarde Euro Netzinvestitionen in zehn Jahren; eine Kundenpauschale für PV-Netzausbau ist nicht veröffentlicht" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Anschlussantrag im Kundenportal spätestens zwei Wochen vor Inbetriebnahme. Fest oder über berührungssichere Sondersteckverbindungen anschließen, Entkupplungsstelle mit Konformitätsnachweis, Leistungsfaktor 1; Zählertausch erst im Smart-Meter-Rollout, keine Vergütung." },
      { titel: "Eingeschränkte Einspeiseleistung", text: "Beispiel von Kärnten Netz: 10 kWp Anlage, Strombezugsrecht 3,5 kW, mögliche Einspeiseleistung 6 kW – die Anlage darf voll errichtet werden, die Differenz wird verbraucht, gespeichert oder abgeregelt." },
      { titel: "Typ B ab 250 kW", text: "Kärnten Netz sieht Erzeugungsanlagen und Speicher ab 250 kW als signifikante Netznutzer: Fernwirkanbindung, Betriebserlaubnisverfahren nach TOR Erzeuger mit Prüfprotokollen (Downloads)." },
      { titel: "Speicher", text: "Kärnten Netz empfiehlt Speicher zur Eigenverbrauchsoptimierung; Vorgaben für Energiespeicher stehen in den TOR-SEA-Vorgaben (Datenumfang je Netzebene)." },
    ],
    zaehlpunkt: "Wann Kärnten Netz den Einspeisezählpunkt mitteilt, beschreibt die Website nicht; der Netzzugangsvertrag liegt im Postfach von Mein Portal. Klären Sie den Zeitpunkt vor dem EAG-Antrag mit dem Netzkundenservice oder Ihrem Elektriker.",
    inbetriebnahme: "Fertigstellungsmeldung durch den konzessionierten Elektriker im Portal plus Abnahmevertrag mit einem Energielieferanten – erst dann darf die Anlage in Betrieb gehen.",
    elwg: "Kärnten Netz beschreibt die Bürgerenergiemodelle nach ElWG (ab Oktober 2026, Nahebereiche NB1 bis NB7). Zur Anzeige bis 20 kW oder zur Spitzenkappung gibt es keine eigene Aussage; die technischen Vorgaben (TOR SEA, Version 4.0) gelten ab 01.09.2026.",
    kontakt: [
      { label: "Kontaktcenter", wert: "+43 505 25-6000", href: "tel:+43505256000", hinweis: "Mo–Fr 8–16 Uhr" },
      { label: "Kontaktformular", wert: "kaerntennetz.at/kontakt", href: "https://kaerntennetz.at/kontakt.htm" },
      { label: "Für Fachbetriebe", wert: "Dienstleisterportal", href: "https://services.kaerntennetz.at/DLP/Services.aspx" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Teilnehmende bestätigen die Teilnahme in Mein Portal unter „Freigaben“ und schließen die Zusatzvereinbarung zum Netzzugangsvertrag ab; falls nötig richtet Kärnten Netz die Viertelstundenmessung ein. Die Anmeldung startet der Betreiber bzw. Organisator des Modells.",
      formular: { name: "Mein Portal – Freigaben", url: "https://services.kaerntennetz.at/meinPortal/Login?service=freigaben" },
      nahbereich: { name: "Nahebereichs-IDs NB1–NB7 (netztechnische Zuordnung, keine eigene Abfrage genannt)", url: "https://kaerntennetz.at/energiegemeinschaften.htm" },
      kontakt: { wert: "Kontaktformular", href: "https://kaerntennetz.at/kontakt.htm" },
      quelle: { titel: "Kärnten Netz – Energiegemeinschaften (Bürgerenergiemodelle)", url: "https://kaerntennetz.at/energiegemeinschaften.htm" },
    },
    p2p: {
      anmeldeweg: "Direkte Vereinbarung zwischen Erzeugerinnen und Verbrauchern (ab Oktober 2026). Registrierung auf ebUtilities, Teilnehmende bestätigen in Mein Portal unter „Freigaben“; einen eigenen Peer-to-Peer-Prozess beschreibt Kärnten Netz nicht.",
      quelle: { titel: "Kärnten Netz – Energiegemeinschaften (Bürgerenergiemodelle)", url: "https://kaerntennetz.at/energiegemeinschaften.htm" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W je Kundenanlage: spätestens zwei Wochen vor Inbetriebnahme per Anschlussantrag im Kundenportal melden. Fester Anschluss oder berührungssichere Sondersteckverbindung, selbsttätige Freischaltstelle mit Konformitätsnachweis, Leistungsfaktor 1; Zählertausch erst im Smart-Meter-Rollout, keine Vergütung. Über 800 W: Antrag auf Erweiterung mit Fertigmeldung durch ein konzessioniertes Elektrounternehmen.",
      formular: { name: "Mein Portal – Anschlussantrag", url: "https://services.kaerntennetz.at/meinPortal/Einspeisung" },
      quelle: { titel: "Kärnten Netz – Bedingungen zum erleichterten Netzzutritt von Kleinsterzeugungsanlagen (PDF)", url: "https://kaerntennetz.at/dokumente/Strom/Bedingungen_zum_erleichterten_Netzzutritt_von_Kleinsterzeugungsanlagen.pdf" },
    },
    offen: ["Zeitpunkt des Einspeisezählpunkts nicht veröffentlicht", "Gültigkeit des Netzzutrittsangebots nicht veröffentlicht", "Keine öffentliche Unterlagenliste für den Antrag", "PV-spezifische Netzzutrittspauschale im Preisblatt 2026 nicht eindeutig ausgewiesen"],
    quellen: [
      { titel: "Kärnten Netz – Photovoltaik-Netzanschluss", url: "https://kaerntennetz.at/pv.htm" },
      { titel: "Kärnten Netz – Folder Photovoltaik-Netzanschluss (PDF)", url: "https://kaerntennetz.at/dokumente/Strom/PV/PV_Folder.pdf" },
      { titel: "Kärnten Netz – Bedingungen zum erleichterten Netzzutritt von Kleinsterzeugungsanlagen (PDF)", url: "https://kaerntennetz.at/dokumente/Strom/Bedingungen_zum_erleichterten_Netzzutritt_von_Kleinsterzeugungsanlagen.pdf" },
      { titel: "Kärnten Netz – Allgemeine Bedingungen Verteilernetz Strom (PDF)", url: "https://kaerntennetz.at/dokumente/Strom/AB_Verteilernetz_Strom_KNG.pdf" },
      { titel: "Kärnten Netz – Preisblatt Strom 2026 (PDF)", url: "https://kaerntennetz.at/dokumente/Strom/Preisblatt_Strom_2026.pdf" },
      { titel: "Kärnten Netz – Informationen und technische Vorgaben für Erzeugungsanlagen und Energiespeicher, TOR SEA (PDF)", url: "https://kaerntennetz.at/dokumente/Strom/TOR-Erzeuger/Informationen_und_technische_Vorgaben_fuer_Erzeugungsanlagen_und_Energiespeicher_TOR_SEA.pdf" },
      { titel: "Kärnten Netz – Energiegemeinschaften", url: "https://kaerntennetz.at/energiegemeinschaften.htm" },
      { titel: "Kärnten Netz – Gemeinschaftliche Erzeugungsanlagen", url: "https://kaerntennetz.at/gemeinschaftliche-erzeugungsanlagen-gea.htm" },
      { titel: "Kärnten Netz – Downloads", url: "https://kaerntennetz.at/downloads.htm" },
      { titel: "Kärnten Netz – Über uns (Netzlänge, Kundenzahl)", url: "https://kaerntennetz.at/ueber-uns.htm" },
      { titel: "Kärnten Netz – Kontakt", url: "https://kaerntennetz.at/kontakt.htm" },
    ],
    geprueftAm: "2026-10-11",
    bild: {
      src: "/Images/AT/foerderung/land-kaernten-woerthersee.jpg",
      alt: "Wörthersee mit Maria Wörth und den Karawanken",
      motiv: "Wörthersee, Kärnten",
      urheber: "Johann Jaritz",
      lizenz: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:P%C3%B6rtschach_Halbinselpromenade_W%C3%B6rther_See_mit_Maria_W%C3%B6rth_19112017_2022.jpg",
    },
  },

  // ------------------------------------------------------------------ Linz
  {
    slug: "linz-netz",
    name: "LINZ NETZ GmbH",
    kurz: "LINZ NETZ",
    gebiet: "Stadt Linz und 82 Umlandgemeinden auf 1.646 km² mit rund 313.000 Zähleranlagen und 22.500 Einspeiseranlagen (Stand 30.09.2025). Das übrige Oberösterreich versorgt überwiegend Netz Oberösterreich.",
    bundesland: "Oberösterreich",
    zaehlpunkte: 309356,
    portalUrl: "https://www.linznetz.at/portal/de/home/online_services/marktpartner_services/elektrotechniker",
    portal: { name: "Online-Meldewesen (Marktpartner-Services)", imSatz: "Über das Online-Meldewesen von LINZ NETZ", url: "https://www.linznetz.at/portal/de/home/online_services/marktpartner_services/elektrotechniker", fuer: "Elektrofachunternehmen und Planer stellen Netzzutrittsantrag, Anschlussvereinbarung und Fertigstellungsmeldung." },
    weiterePortale: [
      { name: "Serviceportal", url: "https://www.linznetz.at/portal/de/home/online_services/serviceportal", fuer: "Für Kundinnen und Kunden: Freigaben, Viertelstundenwerte, Nahebereichskennzeichen." },
      { name: "Kleinsterzeugungsanlage melden", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/kleinsterzeugungsanlagen", fuer: "Online-Meldeformular für Balkonkraftwerke bis 800 W." },
      { name: "Einspeisekapazitäten je Umspannwerk", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/einspeisekapazitaeten", fuer: "Gebuchte und verfügbare Kapazität auf Netzebene 4, quartalsweise." },
    ],
    wer: "Den Netzzutrittsantrag stellt das Elektrofachunternehmen bzw. der Planer über das Online-Meldewesen. Sie erhalten das Zählpunktinformationsschreiben, unterschreiben gegebenenfalls das Netzzugangsangebot und schließen den Einspeisevertrag mit einem Lieferanten.",
    eckdaten: { zaehlpunkt: "binnen zwei Wochen", zaehlpunktLabel: "Zählpunktinformationsschreiben binnen zwei Wochen (bis 20 kW)", gueltigkeit: "Zusage 12 Monate (Netzebene 7)" },
    schritte: [
      { titel: "Planung und Netzzutrittsantrag", text: "Das Elektrofachunternehmen plant (Dachfläche, Eigenbedarf, netzwirksame Einspeiseleistung, Speicher) und stellt den Netzzutrittsantrag im Online-Meldewesen." },
      { titel: "Zählpunktinformationsschreiben", text: "Bis 20 kW schickt LINZ NETZ innerhalb von zwei Wochen nach vollständigem Antrag das Schreiben mit den Angaben für Förderantrag und behördliche Anzeige." },
      { titel: "Netzbeurteilung und Zusage", text: "Ergebnis ist die Netzzugangszusage oder ein Angebot mit Leistungsbeschränkung bzw. Netzausbau (im Extremfall Nulleinspeisung). Angebote sind binnen drei Monaten zu unterschreiben; danach ist die Kapazität zwölf Monate reserviert." },
      { titel: "Einspeisevertrag und Anschlussvereinbarung", text: "Einspeisevertrag mit einem Stromlieferanten abschließen und an das Elektrofachunternehmen geben; dieses reicht die Anschlussvereinbarung im Online-Meldewesen ein. LINZ NETZ bestätigt und nennt das Betriebserlaubnisverfahren (vor Ort oder fern)." },
      { titel: "Errichten und fertigmelden", text: "Fertigstellungsmeldung im Online-Meldewesen, bei Ferninbetriebnahme mit Einspeisevertrag und Fotodokumentation. Bis zur Bilanzgruppenzuordnung ist nur Nulleinspeisung für den Eigenbedarf erlaubt." },
      { titel: "Zählpunktanmeldung und Betriebserlaubnis", text: "Der Lieferant meldet den Zählpunkt über die Wechselplattform an; nach Inbetriebsetzung der Messung erteilt LINZ NETZ die endgültige Betriebserlaubnis und schickt Netzzugangsvertrag und Rechnung über das Netzzutrittsentgelt." },
    ],
    unterlagen: [
      "Netzzutrittsantrag: Name, Anschrift und Kontaktdaten, Lage der Anlage, Engpassleistung, netzwirksame Leistung, Modulspitzenleistung bzw. Nennkapazität des Speichers",
      "Über 100 kW zusätzlich Modulbelegungsplan; bei Freiflächen mit Umwidmung die Sammelstellungnahme der Abteilung Raumordnung des Landes OÖ",
      "Volleinspeisung: Vollmacht des Grundstückseigentümers",
      "Fertigstellungsmeldung: Daten des Elektrounternehmens, Fabrikat, Typ und Leistung der Wechselrichter, Zählersicherung, Kopie oder Screenshot des Energieabnahmevertrags, Fotodokumentation bei Ferninbetriebnahme",
      "Prüfprotokoll des Elektrounternehmens – wird für die Förderabwicklung gebraucht",
    ],
    fristen: [
      { titel: "Zählpunktinformationsschreiben", text: "binnen zwei Wochen nach vollständigem Antrag (bis 20 kW); über 20 kW Statusinformationsschreiben mit abweichenden Fristen" },
      { titel: "Netzzugangsangebot", text: "binnen drei Monaten unterschreiben; Reservierung und Gültigkeit zwölf Monate auf Netzebene 7, Verlängerung um zwölf Monate nur vor Ablauf und mit Nachweis der Beauftragung" },
      { titel: "Antwort auf Netzanschlussanträge", text: "laut Allgemeinen Bedingungen innerhalb angemessener, 14 Tage nicht überschreitender Frist; auf Netzebenen 1 bis 6 ein Monat" },
      { titel: "Zähler und Inbetriebnahme", text: "Zählereinbau binnen 3 Arbeitstagen (Standardlastprofil) bzw. 8 Arbeitstagen (Lastprofilzähler), Inbetriebnahme binnen 2 Arbeitstagen nach Vorliegen der Voraussetzungen" },
      { titel: "Balkonkraftwerk", text: "mindestens zwei Wochen vor Inbetriebnahme melden" },
    ],
    kosten: [
      { titel: "Pauschales Netzzutrittsentgelt", text: "10 €/kW bis 20 kW, 15 €/kW von 21 bis 250 kW, 35 €/kW von 251 bis 1.000 kW, 50 €/kW bis 20.000 kW, 70 €/kW darüber (exkl. USt); Mehrkosten über 175 €/kW werden mit Kostenaufstellung gesondert verrechnet" },
      { titel: "PV bis 20 kW am bestehenden Anschluss", text: "kein zusätzliches Netzzutrittsentgelt, Anschluss zu 100 % des vereinbarten Netznutzungsausmaßes (LINZ NETZ zitiert noch § 17a ElWOG 2010)" },
      { titel: "Rechnung", text: "das Netzzutrittsentgelt wird mit der endgültigen Betriebserlaubnis vorgeschrieben" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Online-Meldeformular mindestens zwei Wochen vor Inbetriebnahme; kein Zählpunkt, kein Lieferantenvertrag, keine Vergütung. Schuko-Geräte brauchen CE-Kennzeichnung und Konformitätsnachweis (OVE R25, VDE AR-N 4105 oder DIN VDE V 0124-100)." },
      { titel: "Große Anlagen", text: "LINZ NETZ veröffentlicht gebuchte und verfügbare Kapazität je Umspannwerk (Stand 27.07.2026, quartalsweise) – ohne Anspruch auf ein bestimmtes Umspannwerk; Netzausbau im Hoch- und Mittelspannungsnetz dauert mehrere Jahre. Verlängerungen auf Netzebenen 4 bis 6 per E-Mail an einspeiser@linznetz.at." },
      { titel: "Nulleinspeisung", text: "Bis zum Netzausbau ist eine temporäre Nulleinspeisung möglich; nach Fertigstellung des Ausbaus parametriert das Elektrofachunternehmen um und meldet erneut fertig." },
      { titel: "Speicher und Erweiterung", text: "Speicher zur Eigenbedarfsoptimierung und Umstellung von Voll- auf Überschusseinspeisung laufen über die FAQ-Abläufe; einphasige Erweiterungen dreiphasiger Anlagen werden nicht genehmigt, über 3,68 kW dreiphasig." },
    ],
    zaehlpunkt: "Bis 20 kW schickt LINZ NETZ innerhalb von zwei Wochen nach vollständigem Antrag das Zählpunktinformationsschreiben – es enthält die Angaben für den Förderantrag. Über 20 kW kommt stattdessen ein Statusinformationsschreiben; dort gelten andere Fristen.",
    inbetriebnahme: "Fertigstellungsmeldung im Online-Meldewesen, Zählpunktanmeldung durch den Lieferanten, Inbetriebsetzung der Verrechnungsmessung vor Ort oder per Ferninbetriebnahme. Erst mit der endgültigen Betriebserlaubnis darf eingespeist werden.",
    elwg: "LINZ NETZ setzt die Bürgerenergiemodelle nach § 65 ff ElWG mit Zonenlevel 1 bis 7 und dynamischer Energieaufteilung ab 05.10.2026 um und veröffentlicht Einspeisekapazitäten nach § 99 ElWG. Die Entgeltseite verweist noch auf § 54 ElWOG 2010.",
    kontakt: [
      { label: "Kundenhotline", wert: "0732/3403-9050", href: "tel:+4373234039050", hinweis: "Mo–Do 8–16 Uhr, Fr 8–14:30 Uhr" },
      { label: "E-Mail", wert: "office@linznetz.at", href: "mailto:office@linznetz.at" },
      { label: "Einspeiser Netzebene 4–6", wert: "einspeiser@linznetz.at", href: "mailto:einspeiser@linznetz.at" },
      { label: "Kontaktformular", wert: "linznetz.at", href: "https://www.linznetz.at/portal/start.app?id=7&nav=/de/linz_netz_website/kontakt_netz/kontaktformular_netz/kontaktformular_netz.xhtml&formidapp42=stromnetzFormularPortlet109" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Nach der Registrierung des Zählpunkts durch den Organisator erscheint im Serviceportal eine Freigabeanfrage: Teilnahme bestätigen und den Zusatzbedingungen zum Netzzugangsvertrag elektronisch zustimmen. Ein Zählpunkt kann an bis zu fünf Modellen teilnehmen (Teilnahmefaktor 1 bis 100 %); Viertelstundenwerte lassen sich im Serviceportal aktivieren.",
      formular: { name: "Serviceportal – Freigaben (Benutzerleitfaden PDF)", url: "https://www.linznetz.at//media/linz_netz_website/netz_dokumente/leitfaden-energiegemeinschaften.pdf" },
      nahbereich: { name: "Nahebereichsabfrage (grafischer Versorgungsbereich)", url: "https://www.linznetz.at/portal/de/home/online_services/versorgungsbereichsabfrage/grafischer_versorgungsbereich.html" },
      kontakt: { wert: "office@linznetz.at", href: "mailto:office@linznetz.at" },
      quelle: { titel: "LINZ NETZ – Teilnahme an einem Bürgerenergiemodell", url: "https://www.linznetz.at/portal/de/home/strom/meine_netznutzung_strom/teilnahme_energiegemeinschaft" },
    },
    p2p: {
      anmeldeweg: "Vertrag zwischen mindestens zwei Rechtspersonen, keine Rechtsform nötig, Gewinnabsicht erlaubt. Zonenlevel 3, 4 oder 6 (bei 6 keine Netzentgeltreduktion); Registrierung über ebUtilities, Zustimmung der Zählpunkte im Serviceportal. Netzgebietsübergreifend voraussichtlich ab 05.04.2027.",
      quelle: { titel: "LINZ NETZ – Bürgerenergiemodelle", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/energiegemeinschaften" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W je Anlage: Online-Meldeformular (alternativ E-Mail oder Telefon) mindestens zwei Wochen vor Inbetriebnahme; LINZ NETZ prüft in dieser Zeit den Zähler. Kein Zählpunkt, kein Lieferantenvertrag, keine Vergütung; Einspeisezählpunkt nur auf Antrag. Schuko-Geräte mit CE und Konformitätsnachweis, sonst Festanschluss durch eine Elektrofachkraft. Über 800 W gilt der normale Planungsablauf.",
      formular: { name: "Online-Meldeformular Kleinsterzeugungsanlage", url: "https://www.linznetz.at/portal/start.app?id=7&nav=/de/linz_netz_website/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/kleinsterzeugungsanlagen/formular_kleinsterzeugungsanlage.xhtml&formidapp42=stromnetzFormularPortlet105" },
      quelle: { titel: "LINZ NETZ – Kleinsterzeugungsanlagen", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/kleinsterzeugungsanlagen" },
    },
    offen: ["Fristen für Anlagen über 20 kW (Statusinformationsschreiben) nicht beziffert", "Entgeltseite nennt noch § 54 und § 17a ElWOG 2010 statt ElWG"],
    quellen: [
      { titel: "LINZ NETZ – Erzeugungsanlage anschließen", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen" },
      { titel: "LINZ NETZ – Planungsablauf", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/planungsablauf" },
      { titel: "LINZ NETZ – Netzzugangszusage", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/netzzugangszusage" },
      { titel: "LINZ NETZ – Ablauf Errichtung und Inbetriebnahme", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/ablauf_errichtung_inbetriebnahme" },
      { titel: "LINZ NETZ – Anschlusskosten", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/anschlusskosten" },
      { titel: "LINZ NETZ – Einspeisekapazitäten", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/einspeisekapazitaeten" },
      { titel: "LINZ NETZ – Kleinsterzeugungsanlagen", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/kleinsterzeugungsanlagen" },
      { titel: "LINZ NETZ – Bürgerenergiemodelle", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/energiegemeinschaften" },
      { titel: "LINZ NETZ – Umsetzung eines Bürgerenergiemodells", url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/energiegemeinschaften/umsetzung" },
      { titel: "LINZ NETZ – Teilnahme an einem Bürgerenergiemodell", url: "https://www.linznetz.at/portal/de/home/strom/meine_netznutzung_strom/teilnahme_energiegemeinschaft" },
      { titel: "LINZ NETZ – Allgemeine Bedingungen Strom-Verteilernetz (PDF)", url: "https://www.linznetz.at//media/linz_netz_website/netz_dokumente/AVB-Strom.pdf" },
      { titel: "LINZ NETZ – Unser Stromnetz (Versorgungsgebiet)", url: "https://www.linznetz.at/portal/de/home/ueber_uns/das_stromnetz" },
      { titel: "LINZ NETZ – Kundenservice", url: "https://www.linznetz.at/portal/de/home/ueber_uns/kundenservice" },
    ],
    geprueftAm: "2026-10-11",
    bild: {
      src: "/Images/AT/produkte-regionen/region-oberoesterreich-linz.jpg",
      alt: "Blick vom Pöstlingberg über Linz und das Donautal",
      motiv: "Linz vom Pöstlingberg, Oberösterreich",
      urheber: "Zabia2",
      lizenz: "CC BY-SA 3.0",
      href: "https://commons.wikimedia.org/wiki/File:LinzvomP%C3%B6stlingberg_aus.jpg",
    },
  },

  // ------------------------------------------------------------------ Tirol
  {
    slug: "tinetz",
    name: "TINETZ-Tiroler Netze GmbH",
    kurz: "TINETZ",
    gebiet: "Größter Verteilernetzbetreiber Tirols mit rund 10.730 km² Netzgebiet, davon 1.440 km² besiedelt. Innsbruck versorgen die Innsbrucker Kommunalbetriebe, Reutte die Elektrizitätswerke Reutte, dazu Energie West und weitere Werke.",
    bundesland: "Tirol",
    zaehlpunkte: 264135,
    portalUrl: "https://kundenportal.tinetz.at/",
    portal: { name: "Kundenportal – Netzanschlussantrag PV", imSatz: "Über das Kundenportal von TINETZ (Netzanschlussantrag PV)", url: "https://kundenportal.tinetz.at/", fuer: "Sie oder Ihr Anlagenerrichter stellen den Antrag; Angebot, Upload und Zählpunkt laufen vollständig im Portal." },
    weiterePortale: [
      { name: "Fertigstellungsmeldung (Professionisten-Portal)", url: "https://www.tinetz.at/unsere-leistungen/stromanschluss/fertigstellungsmeldung/", fuer: "Für Fachbetriebe: Fertigstellungsmeldung und Installationsdokument." },
      { name: "Nahbereichsabfrage", url: "https://www.tinetz.at/unsere-leistungen/gemeinsame-energienutzung/nahbereichsabfrage/", fuer: "Bis 20 Zählpunkte gleichzeitig; zeigt Trafostation bzw. Umspannwerk." },
      { name: "Ausgeschöpfte Netze", url: "https://www.tinetz.at/infobereich/erneuerbare-energien/ausgeschoepfte-netze/", fuer: "Netzgebiete ohne freie Einspeisekapazität." },
    ],
    wer: "Die Registrierung im Kundenportal ist Pflicht; den Netzanschlussantrag stellen Sie selbst oder Ihr Anlagenerrichter. Fertigstellungsmeldung und Installationsdokument reicht der Fachbetrieb über das Professionisten-Portal ein.",
    eckdaten: { zaehlpunkt: "im Netzzugangsangebot", zaehlpunktLabel: "Zählpunkt steht im Netzzugangsangebot (beginnt mit AT005)", gueltigkeit: "Gültigkeit des Angebots nicht veröffentlicht" },
    schritte: [
      { titel: "Beratung und Dimensionierung", text: "Der Anlagenerrichter legt Einspeiseleistung (kW) und Einspeiseart fest – Überschuss- oder Gesamteinspeisung." },
      { titel: "Registrierung und Netzanschlussantrag", text: "Im Kundenportal registrieren und den Antrag stellen; maßgeblich sind Modulspitzenleistung (Förderung), Engpassleistung (TOR-Typ) und netzwirksame Leistung (Beurteilung, Netzzutrittsentgelt)." },
      { titel: "Netzzugangsangebot mit Zählpunkt", text: "TINETZ prüft und übermittelt das Angebot samt Zählpunkt im Kundenportal." },
      { titel: "Angebot zeichnen und hochladen", text: "Das gezeichnete Angebot laden Sie im Kundenportal hoch (Anleitung als PDF)." },
      { titel: "Energieliefervertrag", text: "Vertrag mit einem Lieferanten Ihrer Wahl, der die eingespeiste Menge vergütet." },
      { titel: "Fertigstellungsmeldung und Installationsdokument", text: "Nach der Errichtung reicht der Fachbetrieb beides über das Professionisten-Portal ein; das Installationsdokument ist Bestandteil des Netzzugangsvertrags." },
      { titel: "Betriebsfreigabe", text: "Nach erfolgreicher Prüfung erteilt TINETZ die Freigabe – erst dann darf eingespeist werden." },
    ],
    unterlagen: [
      "Netzanschlussantrag im Kundenportal mit Modulspitzenleistung, Engpassleistung und netzwirksamer Leistung (inkl. Speicher)",
      "Gezeichnetes Netzzugangsangebot (Upload im Kundenportal)",
      "Installationsdokument (kommt mit dem Angebot) mit Beilagen: Wechselrichter aus der Liste „TOR Erzeuger Typ A“ von Oesterreichs Energie, bei zentraler Entkupplungsstelle Prüfprotokoll des Netzentkupplungsschutzes, bei Inselbetrieb Hersteller und Type der Umschalteinrichtung",
      "Energieliefervertrag vor der Betriebsfreigabe",
      "Ab 250 kW: Kundeninformation „Errichtung und Betrieb von Erzeugern ab 250 kW“ und fernwirktechnische Anbindung",
    ],
    fristen: [
      { titel: "Gültigkeit des Netzzugangsangebots", text: "nicht veröffentlicht" },
      { titel: "Balkonkraftwerk", text: "Informationsschreiben laut TINETZ „umgehend“ im Kundenportal; erst damit darf die Anlage in Betrieb gehen" },
      { titel: "Wechselrichter", text: "Geräte mit befristeter Zulässigkeit: In-Verkehr-Bringung und Inbetriebnahme innerhalb von sechs Monaten nach Ablauf belegen" },
    ],
    kosten: [
      { titel: "Pauschales Netzzutrittsentgelt für Erzeugungsanlagen", text: "10 €/kW bis 20 kW, 15 €/kW von 21 bis 250 kW, 35 €/kW von 251 bis 1.000 kW, 50 €/kW bis 20.000 kW, 70 €/kW darüber (netto, Preisblatt gültig ab 01.01.2026); Kosten über 175 €/kW werden zusätzlich verrechnet" },
      { titel: "Hausanschluss Netzebene 7", text: "pauschaliertes Netzzutrittsentgelt 1.590 € netto (1.908 € brutto)" },
      { titel: "Bemessung", text: "das Netzzutrittsentgelt richtet sich nach der netzwirksamen Leistung; ohne Pauschalierungsbedingungen nach tatsächlichem Aufwand laut Angebot" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Netzanschlussantrag im Kundenportal mit Einspeiseart „Einspeisung ohne Einspeisevertrag“; nach dem Informationsschreiben darf die Anlage laufen. Kein Abnahmevertrag, keine Vergütung; ein Einspeisezählpunkt nur auf Anfrage „Überschusseinspeisung“." },
      { titel: "Ausgeschöpfte Netze", text: "TINETZ veröffentlicht, in welchen Netzgebieten keine Einspeisekapazität mehr frei ist, dazu seine Qualitätsstandards." },
      { titel: "Typ B ab 250 kW", text: "Eigene Kundeninformation für Anlagen ab 250 kW samt fernwirktechnischer Anbindung von Erzeugungs- und Verbrauchsanlagen." },
      { titel: "Änderung und Erweiterung", text: "Eigener Antragsweg „Änderung PV-Anlage“ im Kundenportal; ändert sich die netzwirksame Leistung, ist eine Erweiterung zu beantragen – auch bei einem zusätzlichen Balkonkraftwerk." },
    ],
    zaehlpunkt: "Der Zählpunkt steht im Netzzugangsangebot, das TINETZ nach der Prüfung im Kundenportal bereitstellt – 33-stellig, beginnend mit AT005. Eine Frist bis zum Angebot nennt TINETZ nicht.",
    inbetriebnahme: "Fertigstellungsmeldung und Installationsdokument durch den Fachbetrieb über das Professionisten-Portal, danach Prüfung und Betriebsfreigabe. TINETZ: „Erst ab diesem Zeitpunkt darf die Photovoltaik-Anlage ins Verteilernetz einspeisen.“",
    elwg: "TINETZ setzt die Bürgerenergiemodelle nach ElWG um: ab 05.10.2026 innerhalb des Netzgebiets, netzübergreifend voraussichtlich ab April 2027. Vergünstigte Netzentgelte für Peer-to-Peer und Eigenversorgung erst mit der SNE-Verordnung ab 01.01.2027.",
    kontakt: [
      { label: "Kundencenter", wert: "+43 50708 190", href: "tel:+4350708190", hinweis: "Mo–Do 7–17 Uhr, Fr 7–12:30 Uhr" },
      { label: "E-Mail", wert: "sc@tinetz.at", href: "mailto:sc@tinetz.at" },
      { label: "Kundenportal", wert: "kundenportal.tinetz.at", href: "https://kundenportal.tinetz.at/" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Jeder Teilnehmende stimmt der Teilnahme im Kundenportal unter „Datenfreigaben“ je Zählpunkt zu; der Organisator registriert das Modell auf ebUtilities und aktiviert die Zählpunkte im EDA-Portal. Viertelstundenwerte (Smart Meter oder Lastprofilzähler) sind Voraussetzung.",
      formular: { name: "Kundenportal – Datenfreigaben", url: "https://kundenportal.tinetz.at/" },
      nahbereich: { name: "Nahbereichsabfrage (bis 20 Zählpunkte, unverbindlich)", url: "https://www.tinetz.at/unsere-leistungen/gemeinsame-energienutzung/nahbereichsabfrage/" },
      kontakt: { wert: "sc@tinetz.at", href: "mailto:sc@tinetz.at" },
      quelle: { titel: "TINETZ – Erneuerbare-Energie-Gemeinschaften", url: "https://www.tinetz.at/unsere-leistungen/gemeinsame-energienutzung/erneuerbare-energie-gemeinschaften/" },
    },
    p2p: {
      anmeldeweg: "Teilnehmende festlegen, P2P-Vertrag schließen (Preis, Abrechnung, Laufzeit), Nahbereichsabfrage für das Zonelevel, Registrierung auf ebUtilities (Betreibervertrag), Zählpunkte im EDA-Portal aktivieren, Zustimmung im Kundenportal unter „Datenfreigaben“. Umsetzbar ab 05.10.2026 lokal, regional und im Netzgebiet; reduzierte Netzentgelte voraussichtlich erst ab 01.01.2027.",
      quelle: { titel: "TINETZ – Peer-to-Peer", url: "https://www.tinetz.at/unsere-leistungen/gemeinsame-energienutzung/peer-to-peer/" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W in Summe: Elektroinstallation durch einen Fachmann prüfen lassen, im Kundenportal registrieren und einen Netzanschlussantrag mit Einspeiseart „Einspeisung ohne Einspeisevertrag“ stellen. Nach dem Informationsschreiben im Kundenportal darf die Anlage in Betrieb gehen. Konformitätsnachweis nach TOR Erzeuger, keine Vergütung; darüber ist ein Antrag auf Netzzugang bzw. Erweiterung nötig.",
      formular: { name: "Kundenportal – Netzanschlussantrag PV", url: "https://kundenportal.tinetz.at/" },
      quelle: { titel: "TINETZ – Balkonkraftwerk", url: "https://www.tinetz.at/unsere-leistungen/photovoltaik/balkonkraftwerk/" },
    },
    offen: ["Gültigkeit des Netzzugangsangebots und Bearbeitungsdauer nicht veröffentlicht", "Direkter Link zum Professionisten-Portal nicht öffentlich"],
    quellen: [
      { titel: "TINETZ – Neue PV-Anlage", url: "https://www.tinetz.at/unsere-leistungen/photovoltaik/neue-pv-anlage/" },
      { titel: "TINETZ – Balkonkraftwerk", url: "https://www.tinetz.at/unsere-leistungen/photovoltaik/balkonkraftwerk/" },
      { titel: "TINETZ – Kundeninformation Anschluss und Parallelbetrieb von Stromerzeugungsanlagen > 800 W und < 250 kW (PDF, 02.06.2026)", url: "https://www.tinetz.at/uploads/tx_bh/154/kundeninformation_anschluss_und_parallelbetrieb_von_erzeugungsanlagen_ab_800_w_kleiner_250_kw.pdf" },
      { titel: "TINETZ – Preisblatt Netzanschlusspauschalen 2026 (PDF)", url: "https://www.tinetz.at/uploads/tx_bh/770/tinetz_preisblatt_netzanschlusspauschalen_2026.pdf" },
      { titel: "TINETZ – Fragen und Antworten", url: "https://www.tinetz.at/infobereich/allgemeines/fragen-und-antworten/" },
      { titel: "TINETZ – Erneuerbare-Energie-Gemeinschaften", url: "https://www.tinetz.at/unsere-leistungen/gemeinsame-energienutzung/erneuerbare-energie-gemeinschaften/" },
      { titel: "TINETZ – Peer-to-Peer", url: "https://www.tinetz.at/unsere-leistungen/gemeinsame-energienutzung/peer-to-peer/" },
      { titel: "TINETZ – Nahbereichsabfrage", url: "https://www.tinetz.at/unsere-leistungen/gemeinsame-energienutzung/nahbereichsabfrage/" },
      { titel: "TINETZ – Überblick gemeinsame Energienutzung", url: "https://www.tinetz.at/infobereich/gemeinsame-energienutzung/ueberblick/" },
      { titel: "TINETZ – Versorgungsgebiet", url: "https://www.tinetz.at/infobereich/allgemeines/versorgungsgebiet/" },
      { titel: "TINETZ – Service und Kontakt", url: "https://www.tinetz.at/service-kontakt/" },
    ],
    geprueftAm: "2026-10-11",
    bild: {
      src: "/Images/AT/foerderung/land-tirol-innsbruck-nordkette.jpg",
      alt: "Innufer in Innsbruck mit der Nordkette",
      motiv: "Innsbruck mit Nordkette, Tirol",
      urheber: "Taxiarchos228",
      lizenz: "Free Art License",
      href: "https://commons.wikimedia.org/wiki/File:Innsbruck_-_Innufer1.jpg",
    },
  },

  // ------------------------------------------------------------------ Burgenland
  {
    slug: "netz-burgenland",
    name: "Netz Burgenland GmbH",
    kurz: "Netz Burgenland",
    gebiet: "Burgenland mit Servicezentren in Eisenstadt, Oberpullendorf, Oberwart, Güssing und Neusiedl am See. Im Raum Güssing ist die Energie Güssing GmbH laut E-Control-Liste eigener Netzbetreiber.",
    bundesland: "Burgenland",
    zaehlpunkte: 239590,
    portalUrl: "https://www.netzburgenland.at/strom/erzeugungsanlagen-bis-20-kva",
    portal: { name: "Digitaler Antrag „Netzzugangsvertrag bis 20 kVA“", imSatz: "Über den digitalen Antrag auf Abschluss eines Netzzugangsvertrags für Erzeugungs- und Speicheranlagen bis 20 kVA", url: "https://www.netzburgenland.at/strom/erzeugungsanlagen-bis-20-kva", fuer: "Anlagenbetreiber und Errichter; über 20 kVA eigener Antrag und fünfphasiger Prozess." },
    weiterePortale: [
      { name: "Netz Kundenportal", url: "https://kundencenter.netzburgenland.at/okc-netz/home.xhtml", fuer: "Kleinsterzeugungsanlage anmelden, Freigaben für Energiegemeinschaften, Zählerumstellung." },
      { name: "Downloadcenter", url: "https://www.netzburgenland.at/downloadcenter/", fuer: "Anträge, Installationsdokument, Checklisten, Tarifblatt, Prozessbeschreibung ab 20 kW." },
      { name: "EEG-Nahbereichsabfrage", url: "https://analytics.netzburgenland.at/eeg-nahbereichsabfrage2", fuer: "Vorab-Check, ob Zählpunkte im selben Nahbereich liegen." },
    ],
    wer: "Bis 20 kVA übermitteln Sie oder Ihr Elektrounternehmen den digitalen Antrag; die Fertigstellung meldet das konzessionierte Elektrounternehmen mit dem Installationsdokument. Über 20 kVA läuft ein eigener Prozess in fünf Phasen mit Reihung nach § 99 Abs. 4 ElWG.",
    eckdaten: { zaehlpunkt: "nicht beschrieben", zaehlpunktLabel: "Zeitpunkt des Einspeisezählpunkts nicht beschrieben", gueltigkeit: "Vertrag bis 20 kVA 24 Monate" },
    schritte: [
      { titel: "Planung und digitaler Antrag", text: "Nach der Planung Antrag bzw. Anzeige für Erzeugungs- und Speicheranlagen bis 20 kVA übermitteln – bei Neuanlagen mit Lageplan." },
      { titel: "Bestätigung zum Netzzugangsvertrag", text: "Netz Burgenland prüft die Netzverträglichkeit nach TOR; mit der schriftlichen Bestätigung tritt der Netzzugangsvertrag in Kraft und nennt das Netzzutrittsentgelt." },
      { titel: "Errichten binnen 24 Monaten", text: "Ohne Installationsdokument wird der Vertrag nach 24 Monaten ersatzlos aufgelöst. Vor der Inbetriebnahme brauchen Sie zwingend einen Energieliefervertrag." },
      { titel: "Installationsdokument", text: "Das konzessionierte Elektrounternehmen bestätigt mit dem Installationsdokument bis 30 kVA die Einhaltung von TOR Erzeuger und Technischen Ausführungsbestimmungen." },
      { titel: "Termin und Betriebserlaubnis", text: "Gemeinsam wird ein Termin festgelegt; nach der schriftlichen Betriebserlaubnis nimmt das Elektrounternehmen die Anlage in Betrieb." },
      { titel: "Über 20 kVA: fünf Phasen", text: "Vorläufiges Anschlusskonzept mit Kostenschätzung, Bestätigung der behördlichen Genehmigungen an netzreihung@netzburgenland.at (Reihung), Netzzugangsvertrag mit Messkonzept, Netzausbau, Betriebserlaubnisverfahren nach TOR." },
    ],
    unterlagen: [
      "Antrag bis 20 kVA: Kundennummer, Anlagenadresse und Grundstücksnummer, Zählernummer, Errichter, Energiequelle, maximale Einspeiseleistung in kVA, prognostizierte Jahresmenge, Betriebsweise (Voll- oder Überschusseinspeisung, GEA/EEG), Engpassleistung, Phasenzahl, ENS, Speicherdaten, geplanter Beginn, voraussichtlicher Energielieferant",
      "Lageplan bei Neuanlagen; bei größeren Freiflächen Nachweis der Eignungszone und Bestätigung der Flächenwidmung durch die Gemeinde",
      "Installationsdokument für Erzeugungs- und Speicheranlagen bis 30 kVA (Fertigmeldung)",
      "Checkliste für Erzeugungsanlagen unter 250 kVA bzw. ab 250 kVA",
      "Über 20 kVA: Antrag Netzzugang Erzeuger/Speicher größer 20 kVA und Bestätigung zum Vorliegen der Genehmigungen nach § 99 Abs. 4 ElWG",
    ],
    fristen: [
      { titel: "Antwort auf vollständigen Netzanschlussantrag", text: "innerhalb von 14 Tagen Abstimmung der weiteren Vorgehensweise (Kundeninformation nach § 82 ElWOG)" },
      { titel: "Netzzugangsvertrag bis 20 kVA", text: "wird nach 24 Monaten ersatzlos aufgelöst, wenn kein Installationsdokument vorliegt" },
      { titel: "Kleinsterzeugungsanlage", text: "mindestens zwei Wochen vor Inbetriebnahme anmelden" },
      { titel: "Über 20 kW", text: "Unterlagen für den Netzzugangsvertrag binnen 12 Monaten ab Aufforderung, sonst verfällt die Reihung; Teilzahlungen 30 %, 40 % und 30 % jeweils binnen 14 Tagen; Netzanschluss spätestens 60 Monate nach Fertigstellung der Netzanlagen nutzen (Nachfrist 6 Monate)" },
      { titel: "Fernwirkschnittstelle", text: "einmalige Online-Funktionsprüfung binnen 12 Monaten nach Betriebserlaubnis (bis 30 Minuten Unterbrechung)" },
    ],
    kosten: [
      { titel: "Netzzutrittsentgelt", text: "pauschal nach Engpassleistung (§ 54 ElWOG); die Höhe steht in der Bestätigung zum Netzzugangsvertrag und wird nach der Betriebserlaubnis vorgeschrieben – Beträge je kW weist das Tarifblatt 2026 nicht gesondert aus" },
      { titel: "Über 20 kW", text: "Teilzahlungen 30 % nach Vertragsunterzeichnung, 40 % vor Baubeginn, 30 % nach Fertigstellung; Rückerstattung nur soweit Aufwände gedeckt sind" },
      { titel: "Alternativer Anschlusspunkt", text: "Netzanschlusskonzept durch Netz Burgenland, wenn der bestehende Anschlusspunkt nicht ausreicht" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Kein Netzzugangsvertrag; Anmeldung im Netz Kundenportal mindestens zwei Wochen vor Inbetriebnahme, technische Vorgaben der TOR Erzeuger einhalten." },
      { titel: "Große Anlagen", text: "Unverbindliche Einspeisekapazitäten je Umspannwerk (Stand 01.10.2026, quartalsweise): gesamt 120 MVA gebucht, 7 MVA verfügbar; Region Nord 0 MVA, Umspannwerk Zurndorf derzeit kein Netzzugang; freie Kapazität im Norden frühestens 2027 nach der 110-kV-Leitung Oberpullendorf–Rotenturm. Eingeschränkter Netzzugang bis zum Ausbau auf Antrag möglich." },
      { titel: "Speichererweiterung", text: "Für bestehende PV bis 20 kVA über den digitalen Antrag „Speichererweiterung“ mit Installationsdokument." },
      { titel: "Zähler", text: "Bei Erzeugungsanlagen ist ein Opt-out am Smart Meter nicht gestattet; nur digitale Zähler mit Konfiguration „Standard“ oder „Opt-In“, bei Volleinspeisung ein zusätzlicher Zähler." },
    ],
    zaehlpunkt: "Wann Netz Burgenland den Einspeisezählpunkt bekannt gibt, steht nicht auf der Website; Zählpunkte beginnen laut EEG-Seite mit AT. Fragen Sie beim Kundenservice nach, bevor Sie den EAG-Antrag stellen.",
    inbetriebnahme: "Gemeinsamer Termin, schriftliche Betriebserlaubnis, Inbetriebnahme durch das konzessionierte Elektrounternehmen – über 20 kVA im Beisein von Netz Burgenland. Vorher muss ein Energieliefervertrag bestehen.",
    elwg: "Der Prozess über 20 kW ist auf das ElWG umgestellt (Reihung nach § 99 Abs. 4, Messkonzepte nach § 111, Version 03.2026); Antragsformulare und Verteilernetzbedingungen verweisen noch auf das ElWOG 2010.",
    kontakt: [
      { label: "Kundentelefon", wert: "0800/888 9001", href: "tel:+438008889001", hinweis: "kostenlos, Mo–Do 8–16 Uhr, Fr 8–12 Uhr" },
      { label: "E-Mail", wert: "info@netzburgenland.at", href: "mailto:info@netzburgenland.at" },
      { label: "Reihung über 20 kW", wert: "netzreihung@netzburgenland.at", href: "mailto:netzreihung@netzburgenland.at" },
      { label: "Kontaktformular", wert: "netzburgenland.at", href: "https://www.netzburgenland.at/kontaktformular/" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Die Gemeinschaft registriert sich auf ebUtilities und meldet die Teilnehmenden über das EDA-Portal an; jede Person gibt die Anmeldung im Netz Kundenportal frei. Zusätzlich braucht es die Zusatzvereinbarung zum Netzzugangsvertrag und die Zustimmung zur Auslesung der Viertelstundenwerte; der Smart Meter muss im Status „Regelbetrieb“ sein.",
      formular: { name: "Netz Kundenportal", url: "https://kundencenter.netzburgenland.at/okc-netz/home.xhtml" },
      nahbereich: { name: "EEG-Nahbereichsabfrage (Tool und Karte)", url: "https://analytics.netzburgenland.at/eeg-nahbereichsabfrage2" },
      kontakt: { wert: "info@netzburgenland.at", href: "mailto:info@netzburgenland.at" },
      quelle: { titel: "Netz Burgenland – Erneuerbare Energie-Gemeinschaften", url: "https://netzburgenland.at/strom/energiegemeinschaft/" },
    },
    p2p: {
      anmeldeweg: "Netz Burgenland beschreibt Peer-to-Peer und Eigenversorgung zum Prüfdatum nicht auf seinen Seiten; die BEG-Seite nennt die Zonenlevel 6 (ein Netzgebiet) und 7 (mehrere Netzgebiete). Anmeldeweg beim Kundenservice erfragen; die Registrierung läuft über ebUtilities.",
      quelle: { titel: "Netz Burgenland – Bürger-Energiegemeinschaften", url: "https://netzburgenland.at/strom/buerger-energiegemeinschaft/" },
      offen: true,
    },
    kleinsterzeugung: {
      text: "Bis 800 W kein Netzzugangsvertrag: Anmeldung im Netz Kundenportal mindestens zwei Wochen vor Inbetriebnahme; dort stehen auch die Bedingungen zum erleichterten Netzzutritt. Technische Vorgaben der TOR Erzeuger einhalten; bei Fragen meldet sich Netz Burgenland.",
      formular: { name: "Netz Kundenportal – Kleinsterzeugungsanlage", url: "https://kundencenter.netzburgenland.at/okc-netz/home.xhtml" },
      quelle: { titel: "Netz Burgenland – Stromeinspeisung (Photovoltaik)", url: "https://www.netzburgenland.at/strom/photovoltaik" },
    },
    offen: ["Zeitpunkt des Einspeisezählpunkts nicht veröffentlicht", "Netzzutrittsentgelt je kW nicht im Tarifblatt ausgewiesen", "Peer-to-Peer- und Eigenversorgungsprozess nicht beschrieben", "Seite „Anmeldung Kleinsterzeugungsanlagen“ ohne Inhalt – Formular nur im Kundenportal"],
    quellen: [
      { titel: "Netz Burgenland – Stromeinspeisung (Photovoltaik)", url: "https://www.netzburgenland.at/strom/photovoltaik" },
      { titel: "Netz Burgenland – Folder Anschluss von Erzeugungs- und Speicheranlagen (PDF, Stand 11/2022)", url: "https://assets.netzburgenland.at/Folder_Erzeugungsanlagen_V11_2022_final_c0aa2f410e.pdf" },
      { titel: "Netz Burgenland – Antrag Netzzugangsvertrag Erzeugungs-/Speicheranlage bis 20 kVA (PDF, V01_2026)", url: "https://assets.netzburgenland.at/NZV_Antrag_und_Anzeige_NZV_Erzeuger_Speicher_bis_20_k_VA_V04_2025_final_2_3689b838b4.pdf" },
      { titel: "Netz Burgenland – Prozessbeschreibung Netzzugang ab 20 kW (PDF, Version 03.2026)", url: "https://assets.netzburgenland.at/Prozess_Netzzugang_Erzeugungs_Verbrauchs_und_Energiespeicheranl_ab_20k_W_20260713_V03_2026_474172e74d.pdf" },
      { titel: "Netz Burgenland – Kundeninformation gemäß § 82 ElWOG (PDF)", url: "https://assets.netzburgenland.at/Kundeninformation_gemaess_82_1_El_WOG_41eaededf3.pdf" },
      { titel: "Netz Burgenland – Tarifblatt Strom gültig ab 01.01.2026 (PDF)", url: "https://assets.netzburgenland.at/Tarifblatt_Strom_gueltig_ab_1_1_2026_ebfae30e42.pdf" },
      { titel: "Netz Burgenland – Downloadcenter", url: "https://www.netzburgenland.at/downloadcenter/" },
      { titel: "Netz Burgenland – Erneuerbare Energie-Gemeinschaften", url: "https://netzburgenland.at/strom/energiegemeinschaft/" },
      { titel: "Netz Burgenland – Gemeinschaftliche Erzeugungsanlagen", url: "https://netzburgenland.at/strom/gemeinschaftliche-erzeugungsanlagen/" },
      { titel: "Netz Burgenland – Bürger-Energiegemeinschaften", url: "https://netzburgenland.at/strom/buerger-energiegemeinschaft/" },
      { titel: "Netz Burgenland – Service und Kontakt", url: "https://www.netzburgenland.at/kontakt" },
    ],
    geprueftAm: "2026-10-11",
    bild: {
      src: "/Images/AT/foerderung/land-burgenland-neusiedler-see.jpg",
      alt: "Neusiedler See bei Rust im Abendlicht",
      motiv: "Neusiedler See bei Rust, Burgenland",
      urheber: "Jakub Hałun",
      lizenz: "CC BY-SA 4.0",
      href: "https://commons.wikimedia.org/wiki/File:Lake_Neusiedl_in_Rust_during_sunset,_20220424_1941_4890.jpg",
    },
  },

  // ------------------------------------------------------------------ Vorarlberg
  {
    slug: "vorarlberg-netz",
    name: "Vorarlberger Energienetze GmbH",
    kurz: "vorarlberg netz",
    gebiet: "Vorarlberg, Sitz in Bregenz. Eigene Netzbetreiber sind laut E-Control-Liste unter anderem die Stadtwerke Feldkirch, die Elektrizitätswerke Frastanz, die Montafonerbahn und die Energieversorgung Kleinwalsertal.",
    bundesland: "Vorarlberg",
    zaehlpunkte: 234169,
    portalUrl: "https://anschluss.vorarlbergnetz.at/",
    portal: { name: "Online-Anschlussanfrage", imSatz: "Über die Online-Anschlussanfrage von vorarlberg netz", url: "https://anschluss.vorarlbergnetz.at/", fuer: "Neue und geänderte Erzeugungsanlagen, ohne Registrierung; Ergebnis ist der Netzzugangsvertrag mit allen Vorgaben." },
    weiterePortale: [
      { name: "Netzpartnerportal", url: "https://partner-portal.vorarlbergnetz.at", fuer: "Für Elektrounternehmen: Fertigstellungsunterlagen hochladen." },
      { name: "Netz-Kundenportal", url: "https://webportal.vorarlbergnetz.at", fuer: "Freigaben für Bürgerenergiemodelle, Vertragsdaten, Zonelevel." },
      { name: "Online-Auskunft EEG", url: "https://energiegemeinschaften.vorarlbergnetz.at/eeg_auskunft/", fuer: "Anschlusssituation der Teilnehmenden prüfen." },
    ],
    wer: "Die Online-Anschlussanfrage stellen Sie oder Ihr Elektrounternehmen; den Netzzugangsvertrag unterschreiben Sie. Die technischen Fertigstellungsunterlagen lädt das Elektrounternehmen im Netzpartnerportal hoch.",
    eckdaten: { zaehlpunkt: "nicht beschrieben", zaehlpunktLabel: "Zeitpunkt des Einspeisezählpunkts nicht beschrieben", gueltigkeit: "Gültigkeit des Vertrags nicht veröffentlicht" },
    schritte: [
      { titel: "Planen nach Richtlinie", text: "Anlage nach der Richtlinie für den Parallelbetrieb und den Technischen Anforderungen planen; Wechselrichter aus der Liste von Oesterreichs Energie, Schemapläne A1 bis A3." },
      { titel: "Online-Anschlussanfrage", text: "Details zur geplanten Anlage über die Online-Anschlussanfrage übermitteln – vorarlberg netz empfiehlt, die Anschlussmöglichkeit früh prüfen zu lassen." },
      { titel: "Netzzugangsvertrag", text: "Bei positiver Beurteilung erhalten Sie den Netzzugangsvertrag mit allen Vorgaben; unterfertigt zurücksenden." },
      { titel: "Errichten", text: "Bei PV-Neuanlagen von 3,68 bis 250 kVA ist ein Netzwerkkabel (CAT7) zwischen Übergabemessung und Wechselrichter für die künftige Wirkleistungsregelung zu verlegen." },
      { titel: "Fertigstellungsunterlagen", text: "Wechselrichter-Report, Datenblatt und Netzanschlussmeldung lädt das Elektrounternehmen im Netzpartnerportal hoch; den Einspeisevertrag dem Netzbetreiber melden." },
      { titel: "Kontrolle und Zählermontage", text: "Nach der Kontrolle durch den Netzbetreiber wird der Zähler montiert – ohne Zähler keine Inbetriebnahme, ohne Energieliefervertrag keine Zählermontage." },
    ],
    unterlagen: [
      "Online-Anschlussanfrage mit Anlagendaten (Leistungsklasse bis 30 kW, 30 bis 250 kW oder ab 250 kW)",
      "Unterfertigter Netzzugangsvertrag",
      "Wechselrichter-Report (Formular je Leistungsklasse) und Datenblatt der Erzeugungsanlage",
      "Netzanschlussmeldung des Elektrounternehmens",
      "Gültiger Einspeisevertrag mit einem Energielieferanten – dem Netzbetreiber zu melden",
      "Ab 30 kVA externer Entkupplungsschutz mit Nachweis; Überschusseinspeisung nur, wenn Erzeuger und Verbraucher dieselbe Person bzw. derselbe Geschäftspartner sind",
    ],
    fristen: [
      { titel: "Anfragen", text: "laut Allgemeinen Verteilernetzbedingungen binnen fünf Arbeitstagen zu beantworten" },
      { titel: "Zähler und Inbetriebnahme", text: "Zählermontage bei Standardlastprofil binnen drei Arbeitstagen nach Abschluss der Voraussetzungen, Inbetriebnahme binnen zwei Arbeitstagen (Allgemeine Verteilernetzbedingungen)" },
      { titel: "Balkonkraftwerk", text: "Inbetriebnahme frühestens zwei Wochen nach der Anmeldung; meldet sich der Netzbetreiber binnen 14 Tagen nicht, darf die Anlage laufen" },
      { titel: "Gültigkeit des Netzzugangsvertrags", text: "für Erzeugungsanlagen nicht veröffentlicht" },
    ],
    kosten: [
      { titel: "Netzzutrittsentgelt für Erzeugungsanlagen", text: "10 €/kW bis 20 kW, 15 €/kW von 21 bis 250 kW, 35 €/kW von 251 bis 1.000 kW, 50 €/kW bis 20.000 kW, 70 €/kW darüber (netto, Preisblatt gültig ab 01.01.2026, nach § 54 ElWOG)" },
      { titel: "Fernwirktechnische Schnittstelle", text: "10.000 € auf Netzebene 6 bis 7, 15.000 € auf 4 bis 5, 20.000 € auf 1 bis 3 (netto, für Wirkleistungsvorgaben Typ B bis D)" },
      { titel: "Hausanschluss", text: "Pauschalen für Erdkabelanschlüsse bis 150 m ab 1.610 € netto; Grabarbeiten gesondert" },
    ],
    sonderfaelle: [
      { titel: "Balkonkraftwerk bis 800 W", text: "Anmeldung beim Netzbetreiber, der den Anschluss zur Kenntnis nimmt; Konformitätsnachweis für die Netzentkupplung (OVE R25, VDE AR-N 4105 oder DIN VDE V 0124-100), kein Abnahmevertrag, Zählereignung prüft vorarlberg netz. Außerbetriebnahme per E-Mail melden." },
      { titel: "PV 30 bis 250 kW", text: "Eigene Leistungsklasse mit Wechselrichter-Report und externem Entkupplungsschutz ab 30 kVA." },
      { titel: "PV ab 250 kW", text: "Eigene Seite mit Report und Entkupplungsschutz; Fernwirkschnittstelle laut Preisblatt." },
      { titel: "Batteriespeicher", text: "Eigene Übersicht und Report für elektrische Batteriespeicher." },
    ],
    zaehlpunkt: "vorarlberg netz beschreibt nicht, wann der Einspeisezählpunkt mitgeteilt wird. Klären Sie den Zeitpunkt vor dem EAG-Antrag mit dem Kundenservice; die Netzbetreibernummer AT006000 steht im Kontaktdatenblatt.",
    inbetriebnahme: "Nach dem Hochladen der Unterlagen und der Kontrolle durch den Netzbetreiber wird der Zähler montiert; vorher darf die Anlage nicht in Betrieb gehen, weil die Einspeisung sonst weder gemessen noch vergütet werden kann.",
    elwg: "vorarlberg netz informiert zum ElWG (in Kraft seit 24.12.2025) vor allem über Smart Meter Plus (Opt-in) und die Bürgerenergiemodelle ab 01.10.2026 (§§ 65 bis 72); Preisblatt und Vertragsunterlagen verweisen noch auf § 54 ElWOG.",
    kontakt: [
      { label: "Kundenservice", wert: "+43 5574 9020-189", href: "tel:+4355749020189", hinweis: "Mo–Fr 7:30–18 Uhr" },
      { label: "E-Mail", wert: "kundenservice@vorarlbergnetz.at", href: "mailto:kundenservice@vorarlbergnetz.at" },
      { label: "Energiegemeinschaften", wert: "+43 5574 9020-185", href: "tel:+4355749020185", hinweis: "Mo–Fr 8–12 Uhr" },
      { label: "E-Mail Energiegemeinschaften", wert: "energiegemeinschaft@vorarlbergnetz.at", href: "mailto:energiegemeinschaft@vorarlbergnetz.at" },
    ],
    energiegemeinschaft: {
      datenfreigabe: "Teilnehmende registrieren sich im Netz-Kundenportal (PIN kommt per Post), nennen dem Betreiber Zählpunkt und Zonelevel aus „Mein Vertrag“ und bestätigen nach der Anmeldung die Teilnahme unter „Freigaben“. Der Betreiber registriert das Modell auf ebUtilities (Betreibervertrag) und erfasst die Zählpunkte im EDA-Portal.",
      formular: { name: "Netz-Kundenportal – Freigaben", url: "https://webportal.vorarlbergnetz.at" },
      nahbereich: { name: "Online-Auskunft EEG", url: "https://energiegemeinschaften.vorarlbergnetz.at/eeg_auskunft/" },
      kontakt: { wert: "energiegemeinschaft@vorarlbergnetz.at", href: "mailto:energiegemeinschaft@vorarlbergnetz.at" },
      quelle: { titel: "vorarlberg netz – Bürgerenergie-Modelle", url: "https://www.vorarlbergnetz.at/buergerenergiemodelle.htm" },
    },
    p2p: {
      anmeldeweg: "Peer-to-Peer zunächst im eigenen Netzgebiet, künftig über weitere Netzgebiete Österreichs. Vereinbarung mit den Teilnehmenden (Mustervorlagen der Koordinationsstelle), Registrierung auf ebUtilities, Zählpunkte im EDA-Portal, Bestätigung der Teilnehmenden im Netz-Kundenportal.",
      quelle: { titel: "vorarlberg netz – Bürgerenergie-Modelle", url: "https://www.vorarlbergnetz.at/buergerenergiemodelle.htm" },
    },
    kleinsterzeugung: {
      text: "Bis 800 W in Summe: Anmeldung beim Netzbetreiber, Inbetriebnahme frühestens zwei Wochen danach (keine Rückmeldung binnen 14 Tagen gilt als Zustimmung). Konformitätsnachweis einer zertifizierten Prüfstelle für die Netzentkupplung, kein Abnahmevertrag, Eignung des Zählers prüft vorarlberg netz; Leistungserhöhung und Außerbetriebnahme sind zu melden.",
      formular: { name: "Online-Anschlussanfrage", url: "https://anschluss.vorarlbergnetz.at/" },
      quelle: { titel: "vorarlberg netz – PV-Anlagen bis 0,8 kW", url: "https://www.vorarlbergnetz.at/pv-anlagengroesse-08kw.htm" },
    },
    offen: ["Zeitpunkt des Einspeisezählpunkts nicht veröffentlicht", "Gültigkeit des Netzzugangsvertrags für Erzeugungsanlagen nicht veröffentlicht", "Bearbeitungsfrist für Erzeugungsanlagen nur in älteren Unterlagen (14 Arbeitstage, 2022), aktuell nicht auffindbar"],
    quellen: [
      { titel: "vorarlberg netz – Erzeugungsanlagen und Netzintegration", url: "https://www.vorarlbergnetz.at/erzeugungsanlagen-netzintegration.htm" },
      { titel: "vorarlberg netz – PV-Anlagen bis 0,8 kW", url: "https://www.vorarlbergnetz.at/pv-anlagengroesse-08kw.htm" },
      { titel: "vorarlberg netz – PV-Anlagen von 0,8 bis 30 kW", url: "https://www.vorarlbergnetz.at/pv-anlagengroesse-08kw-bis-30kw.htm" },
      { titel: "vorarlberg netz – Strom-Netzanschluss", url: "https://www.vorarlbergnetz.at/strom-netzanschluss.htm" },
      { titel: "vorarlberg netz – Preisblatt Netzanschluss- und Montagepauschalen 2026 (PDF)", url: "https://www.vorarlbergnetz.at/media/Preisblatt_Netzzutritt_Strom_2026_veroeffentl.pdf" },
      { titel: "vorarlberg netz – Allgemeine Bedingungen für den Zugang zum Verteilernetz (PDF)", url: "https://www.vorarlbergnetz.at/media/ABVN_Strom_Vbg_Netz.pdf" },
      { titel: "vorarlberg netz – Kontaktdatenblatt (PDF, Netzbetreibernummer AT006000)", url: "https://www.vorarlbergnetz.at/media/Kontaktdatenblatt_vne.pdf" },
      { titel: "vorarlberg netz – Bürgerenergie-Modelle", url: "https://www.vorarlbergnetz.at/buergerenergiemodelle.htm" },
      { titel: "vorarlberg netz – Ansprechpartner Energiegemeinschaften", url: "https://www.vorarlbergnetz.at/ansprechpartner_eeg.htm" },
      { titel: "vorarlberg netz – ElWG", url: "https://www.vorarlbergnetz.at/elwg.htm" },
      { titel: "vorarlberg netz – Kundenservice", url: "https://www.vorarlbergnetz.at/kundenservice.htm" },
    ],
    geprueftAm: "2026-10-11",
    bild: {
      src: "/Images/AT/foerderung/land-vorarlberg-bregenzerwald.jpg",
      alt: "Hügellandschaft im Vorderen Bregenzerwald",
      motiv: "Vorderer Bregenzerwald, Vorarlberg",
      urheber: "Friedrich Böhringer",
      lizenz: "CC BY-SA 3.0 AT",
      href: "https://commons.wikimedia.org/wiki/File:Vorderer_Bregenzerwald_von_M%C3%BCselbach_gesehen.jpg",
    },
  },
];

export const BETREIBER_SLUGS = NETZBETREIBER.map((b) => b.slug);

/** Betreiber eines Bundeslands (für die Übersicht „Netzbetreiber nach Bundesland“). */
export function betreiberFuerBundesland(land) {
  const eintrag = BUNDESLAENDER_NETZ.find((b) => b.land === land);
  return eintrag ? eintrag.slugs.map(betreiberFuerSlug).filter(Boolean) : [];
}

/**
 * EEG-Anmeldewege je Netzbetreiber – Zeilen für die Vergleichstabelle auf
 * /energiegemeinschaften (abgeleitet aus NETZBETREIBER, damit es nur eine Quelle gibt).
 */
export function eegAnmeldewege() {
  return NETZBETREIBER.map((b) => ({
    slug: b.slug,
    kurz: b.kurz,
    bundesland: b.bundesland,
    datenfreigabe: b.energiegemeinschaft?.datenfreigabe || "nicht veröffentlicht",
    formular: b.energiegemeinschaft?.formular || null,
    nahbereich: b.energiegemeinschaft?.nahbereich || null,
    kontakt: b.energiegemeinschaft?.kontakt || null,
    p2p: b.p2p?.anmeldeweg || "nicht veröffentlicht",
    p2pOffen: !!b.p2p?.offen,
    quelle: b.energiegemeinschaft?.quelle || null,
    geprueftAm: b.geprueftAm,
  }));
}

export function betreiberFuerSlug(slug) {
  return NETZBETREIBER.find((b) => b.slug === slug) || null;
}

/** Datum "2026-09-30" -> "30.09.2026" */
export function datumLabel(iso) {
  const [j, m, t] = String(iso).split("-");
  return j && m && t ? `${t}.${m}.${j}` : String(iso);
}

/** FAQ je Betreiber – aus den Daten erzeugt, damit alle Seiten gleich aufgebaut sind. */
export function betreiberFaq(b) {
  return [
    {
      q: `Wo melde ich eine PV-Anlage bei ${b.kurz} an?`,
      a: `${b.portal.imSatz}. ${b.wer}`,
    },
    {
      q: `Wann bekomme ich bei ${b.kurz} den Einspeisezählpunkt?`,
      a: b.zaehlpunkt,
    },
    {
      q: `Wie lange dauert die Netzanmeldung bei ${b.kurz}?`,
      a: `${b.fristen.map((f) => `${f.titel}: ${f.text}`).join(". ")}. Weitere Fristen nennt ${b.kurz} nicht offiziell.`,
    },
    {
      q: `Was kostet die Netzanmeldung einer PV-Anlage bei ${b.kurz}?`,
      a: `${b.kosten.map((k) => `${k.titel}: ${k.text}`).join(". ")}. Die Kosten der Errichtung sind darin nicht enthalten.`,
    },
    {
      q: `Muss ich ein Balkonkraftwerk bei ${b.kurz} anmelden?`,
      a: b.kleinsterzeugung?.text || b.sonderfaelle[0].text,
    },
    {
      q: `Wie gebe ich bei ${b.kurz} meine Daten für eine Energiegemeinschaft frei?`,
      a: b.energiegemeinschaft?.datenfreigabe || `${b.kurz} beschreibt die Datenfreigabe für Energiegemeinschaften nicht öffentlich – fragen Sie beim Netzbetreiber nach.`,
    },
    {
      q: `Wie melde ich bei ${b.kurz} einen Peer-to-Peer-Vertrag an?`,
      a: b.p2p?.anmeldeweg || `${b.kurz} beschreibt den Peer-to-Peer-Anmeldeweg nicht öffentlich.`,
    },
    {
      q: "Reicht der Einspeisezählpunkt für den EAG-Fördercall im Oktober 2026?",
      a: "Für Ticket und Förderantrag ist er Pflicht, zusätzlich müssen die nötigen Genehmigungen und Anzeigen vorliegen. Die Unterlage des Netzbetreibers muss Zählpunktinhaber, Anlagenstandort und Netzanschlussleistung zeigen. Der Bezugszählpunkt gilt nicht.",
    },
  ];
}

/** FAQ für die Übersichtsseite. */
export const FAQ = [
  {
    q: "Wer ist mein Netzbetreiber?",
    a: "Der Netzbetreiber steht auf Ihrer Stromrechnung – er ist nicht Ihr Stromlieferant. Außerdem steckt seine Nummer in Ihrer Zählpunktbezeichnung (Stellen 3 bis 8). Eine vollständige Übersicht aller österreichischen Netzbetreiber mit Kontaktdaten bietet die E-Control über ihren Tarifkalkulator.",
  },
  {
    q: "Brauche ich für jede PV-Anlage eine Netzanmeldung?",
    a: "Ja. Auch Kleinsterzeugungsanlagen bis 0,8 kW (Balkonkraftwerke) sind beim Netzbetreiber zu melden – vereinfacht und ohne eigenen Einspeisezählpunkt. Größere Anlagen brauchen einen Netzzugangsantrag bzw. bis 20 kW netzwirksamer Leistung eine Anzeige nach § 96 ElWG.",
  },
  {
    q: "Wann bekomme ich den Einspeisezählpunkt?",
    a: "Bei den meisten hier beschriebenen Netzbetreibern vor der Errichtung: mit der Zusage, dem Vertragsangebot, einem Zählpunktbrief oder – bei LINZ NETZ bis 20 kW – dem Zählpunktinformationsschreiben binnen zwei Wochen. Wiener Netze bietet zusätzlich eine Anfrage in der Planungsphase an. Kärnten Netz, Netz Burgenland und vorarlberg netz beschreiben den Zeitpunkt nicht öffentlich – dort vorab nachfragen. Aktiv wird der Zählpunkt erst nach Fertigmeldung und Anmeldung durch den Stromabnehmer.",
  },
  {
    q: "Muss ich ein Balkonkraftwerk bis 800 W anmelden?",
    a: "Ja, aber vereinfacht: Kleinsterzeugungsanlagen bis 0,8 kW werden beim Netzbetreiber gemeldet, meist mindestens zwei Wochen vor der Inbetriebnahme; einen Netzzugangsvertrag und einen Einspeisezählpunkt gibt es nur auf Antrag. Nötig ist ein Konformitätsnachweis für die Netzentkupplung, eingespeister Strom wird nicht vergütet. Welches Portal oder Formular gilt, steht auf der Seite des jeweiligen Netzbetreibers.",
  },
  {
    q: "Wie schnell antworten die Netzbetreiber wirklich?",
    a: "Die E-Control erhebt das jährlich bei 60 Verteilernetzbetreibern. Im Berichtsjahr 2024 dauerte es vom vollständigen Antrag bis zur Bestätigung im Schnitt 6,6 Tage bei Anlagen bis 20 kW, 11,4 Tage bis 250 kW und 20,2 Tage bis 1 MW; die längste Antwort lag bei 89 Tagen. Das sind Durchschnittswerte zur Orientierung, keine Zusage für den Einzelfall.",
  },
  {
    q: "Wie lange darf der Netzbetreiber für die Antwort brauchen?",
    a: "Für erneuerbare Anlagen bis 20 kW netzwirksamer Leistung gilt nach § 96 ElWG: Der Netzbetreiber bestätigt binnen vier Wochen nach vollständiger Anzeige oder lehnt begründet ab – sonst ist anzuschließen. Für größere Anlagen gelten die Allgemeinen Netzbedingungen des Netzbetreibers; eine einheitliche Verordnung der E-Control ist im ElWG vorgesehen.",
  },
  {
    q: "Wer stellt den Antrag – ich oder der Elektriker?",
    a: "Das ist je Netzbetreiber verschieden. Bei Wiener Netze, Netz Oberösterreich und LINZ NETZ stellt ihn das Elektrofachunternehmen bzw. der Planer; bei Netz Niederösterreich, Energienetze Steiermark, Salzburg Netz, Kärnten Netz, TINETZ, Netz Burgenland und vorarlberg netz können Sie ihn auch selbst stellen. Die Fertigmeldung macht überall das befugte Elektrounternehmen.",
  },
  {
    q: "Darf ich die Anlage nach der Zusage schon einschalten?",
    a: "Nein. Eingespeist werden darf erst nach Fertigmeldung und Freigabe durch den Netzbetreiber; dazu muss ein Abnahmevertrag bestehen. Wer den EAG-Investitionszuschuss will, darf außerdem erst nach dem ersten gültigen Förderantrag in Betrieb gehen.",
  },
  {
    q: "Was ändert das ElWG an der Netzanmeldung?",
    a: "Es gilt seit dem Tag nach der Kundmachung Ende 2025: Anzeige statt Antrag bis 20 kW mit vier Wochen Frist, PV bis 15 kW über den bestehenden Anschluss ohne zusätzliches Netzanschlussentgelt, Steuerbarkeit ab 3,68 kW und das Recht des Netzbetreibers, PV auf 70 % der Modulleistung zu begrenzen. Offen sind noch Verordnungen, etwa zu einheitlichen Netzbedingungen und zu den Entgelten ab 2027.",
  },
];
