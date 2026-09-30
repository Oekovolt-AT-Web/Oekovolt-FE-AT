// src/data/netzbetreiber.js
//
// „PV-Anlage beim Netzbetreiber anmelden“ – Daten für /netzanmeldung und
// /netzanmeldung/[betreiber]. Die fünf größten Verteilernetzbetreiber Österreichs
// nach Anzahl der Zählpunkte (E-Control, Smart-Meter-Monitoringbericht 2025,
// Anhang, Berichtsjahr 2024).
//
// Recherche am 30.09.2026 ausschließlich an Primärquellen (Websites, Formulare,
// Preisblätter und Bedingungen der Netzbetreiber, E-Control, ElWG-Gesetzestext).
// Alle Texte sind eigene Formulierungen; jede Aussage ist über `quellen` belegt.
// Was nicht offiziell genannt ist (z. B. Bearbeitungsdauer), steht NICHT hier
// oder ist in `offen` als ungeklärt vermerkt.
//
// Neutralität: gleiche Struktur und Reihenfolge (nach Zählpunkten) für alle
// Betreiber, keine Aussagen über bevorzugte oder schnellere Abwicklung.
// Keine Logos der Netzbetreiber.
//
// Bei Änderungen: GEPRUEFT_AM je Betreiber und STAND anpassen.

export const PFAD = "/netzanmeldung";
export const DRUCK_PFAD = "/netzanmeldung/checkliste";
export const betreiberPfad = (slug) => `${PFAD}/${slug}`;

export const STAND = { iso: "2026-09-30", label: "30.09.2026" };

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
};

// ---------------------------------------------------------------------------
// Auswahl der fünf Betreiber
// ---------------------------------------------------------------------------

/** Zählpunkte je Verteilernetzbetreiber (IME-VO-relevant), Ende 2024 – E-Control, Anhang-Tabelle. */
export const AUSWAHL = {
  text: "Ausgewählt nach der Zahl der Zählpunkte im Netz: Die E-Control weist im Anhang ihres Smart-Meter-Berichts 2025 jeden Verteilernetzbetreiber mit seinen Zählpunkten zum Jahresende 2024 aus. Die fünf größten betreuen zusammen knapp zwei Drittel aller Zählpunkte Österreichs.",
  gesamt: 6737329,
  rangliste: [
    { name: "Wiener Netze", anzahl: 1646935, slug: "wiener-netze" },
    { name: "Netz Niederösterreich", anzahl: 945234, slug: "netz-niederoesterreich" },
    { name: "Netz Oberösterreich", anzahl: 736171, slug: "netz-oberoesterreich" },
    { name: "Energienetze Steiermark", anzahl: 524795, slug: "energienetze-steiermark" },
    { name: "Salzburg Netz", anzahl: 465566, slug: "salzburg-netz" },
    { name: "KNG-Kärnten Netz", anzahl: 341365 },
    { name: "LINZ NETZ", anzahl: 309356 },
    { name: "TINETZ-Tiroler Netze", anzahl: 264135 },
  ],
  quelle: Q.smartMeterBericht,
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
    "Die fünf hier beschriebenen Netzbetreiber nennen den Einspeisezählpunkt schon vor der Errichtung – mit Zusage, Angebot oder Zählpunktbrief (Netz Oberösterreich ausdrücklich für Anlagen bis 20 kWp). Aktiv wird er erst nach Fertigmeldung und Anmeldung durch den Stromabnehmer.",
  ],
  quellen: [Q.torZaehler],
};

/** Bezug zum 3. EAG-Fördercall 2026 (08.–22.10.2026). */
export const EAG_BEZUG = {
  titel: "Ohne Einspeisezählpunkt kein Ticket",
  text: "Für die Ticketziehung am 08.10.2026 ab 17 Uhr und den Förderantrag im EAG-Portal braucht jede Anlage ihren Einspeisezählpunkt. Das Dokument des Netzbetreibers muss Zählpunktinhaber, Anlagenstandort und Netzanschlussleistung zeigen. Der Bezugszählpunkt Ihres Hausanschlusses gilt nicht.",
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
      { name: "Kleinsterzeugungsanlage anmelden", url: "https://www.wienernetze.at/kleinsterzeugungsanlage-anmelden", fuer: "Balkonkraftwerk bis 0,8 kVA, direkt durch die Kundin oder den Kunden." },
    ],
    wer: "Über 0,8 kVA stellt nicht die Kundin oder der Kunde die Anfrage, sondern ein Elektrounternehmen mit Gewerbeberechtigung Elektrotechnik oder ein Planungsbüro. Bearbeitet werden nur vollständige Anfragen.",
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
      { titel: "Balkonkraftwerk bis 0,8 kVA", text: "Online-Formular direkt durch Sie, Konformitätsnachweis nach TOR Erzeuger bzw. OVE E 8101. Kein Einspeisezählpunkt, keine Vergütung; ein ungeeigneter Zähler wird getauscht." },
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
      { titel: "Balkonkraftwerk bis 0,8 kVA", text: "Meldung im Kundenportal, kein Netzzugangsvertrag. Nach der Bestätigung von Netz NÖ darf die Anlage laufen; ENS-Konformitätsnachweis nach TOR nötig, ohne Abnahmevertrag keine Vergütung." },
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
    offen: ["Konkrete Bearbeitungsdauer der PV-Angebote nicht veröffentlicht", "Eigene Aussagen zu Anzeige bis 20 kW und Spitzenkappung nach ElWG noch nicht vorhanden"],
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
    offen: ["Zeitpunkt des Einspeisezählpunkts über 20 kWp nicht öffentlich beschrieben", "Aktuelle Unterlagenliste nicht veröffentlicht (Technische Bedingungen von 2017 teils überholt)", "Ältere FAQ und aktuelle Ablaufseite widersprechen sich beim Termin vor Ort unter 30 kWp"],
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
      { titel: "Anlagen bis 0,8 kW", text: "Meldung über das Portal oder per E-Mail mit Formular, keine Fertigmeldung. Auch mit Speicher dürfen 0,8 kW nie überschritten werden; Konformitätsnachweis nötig, keine Vergütung." },
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
];

export const BETREIBER_SLUGS = NETZBETREIBER.map((b) => b.slug);

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
      a: b.sonderfaelle[0].text,
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
    a: "Bei den fünf hier beschriebenen Netzbetreibern vor der Errichtung: mit der Zusage, dem Vertragsangebot oder einem eigenen Zählpunktbrief – bei Netz Oberösterreich ist das ausdrücklich für Anlagen bis 20 kWp beschrieben. Wiener Netze bietet zusätzlich eine Anfrage in der Planungsphase an. Aktiv wird der Zählpunkt erst nach Fertigmeldung und Anmeldung durch den Stromabnehmer.",
  },
  {
    q: "Wie lange darf der Netzbetreiber für die Antwort brauchen?",
    a: "Für erneuerbare Anlagen bis 20 kW netzwirksamer Leistung gilt nach § 96 ElWG: Der Netzbetreiber bestätigt binnen vier Wochen nach vollständiger Anzeige oder lehnt begründet ab – sonst ist anzuschließen. Für größere Anlagen gelten die Allgemeinen Netzbedingungen des Netzbetreibers; eine einheitliche Verordnung der E-Control ist im ElWG vorgesehen.",
  },
  {
    q: "Wer stellt den Antrag – ich oder der Elektriker?",
    a: "Das ist je Netzbetreiber verschieden. Bei Wiener Netze und Netz Oberösterreich stellt ihn nur das Elektrofachunternehmen, bei Netz Niederösterreich, Energienetze Steiermark und Salzburg Netz können Sie ihn auch selbst stellen. Die Fertigmeldung macht überall das befugte Elektrounternehmen.",
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
