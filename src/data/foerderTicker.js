// src/data/foerderTicker.js
//
// Förder-Ticker Österreich: datierte Meldungen zu Förderungen, Fristen und
// Gesetzesänderungen für /forderungen/aktuell, den RSS-Feed /forderungen/aktuell/rss.xml,
// die Status-Tabelle (C02) und die Landesseiten (C08).
//
// Jeder Eintrag: { id (stabil), datum (ISO der amtlichen Meldung bzw. des Abrufs), titel, kurz,
//   text? (eigener Fließtext → NewsArticle-Schema), zielgruppen[], bundesland ("bund" | key),
//   quelle { label, url } – amtlich, vorher abgerufen –, seiten[] (interne Pfade),
//   typ: neu (neues Programm) | frist | korrektur | beschluss | ankuendigung | kennzahl (Marktwert, Index – kein Programm),
//   status: bestaetigt | angekuendigt | zu-pruefen, geprueftAm (ISO) }
//
// Regeln: nur Einträge mit amtlicher Quelle; Zahlen nur, wie sie in der Quelle stehen;
// Angekündigtes bleibt „angekündigt“, bis es verordnet oder kundgemacht ist.
// Pflege: scripts/foerder-monitor.mjs liefert Änderungsentwürfe – veröffentlicht wird nur redaktionell.

export const TICKER_TYPEN = {
  neu: "Neues Programm",
  frist: "Frist",
  korrektur: "Korrektur",
  beschluss: "Beschluss",
  ankuendigung: "Ankündigung",
  kennzahl: "Marktwert/Kennzahl",
};

export const TICKER_STATUS = {
  bestaetigt: "amtlich bestätigt",
  angekuendigt: "angekündigt, nicht beschlossen",
  "zu-pruefen": "zu prüfen",
};

export const TICKER_ZIELGRUPPEN = ["unternehmen", "landwirtschaft", "gemeinde", "privat", "energiegemeinschaft"];

const ALLE = TICKER_ZIELGRUPPEN;
const BETRIEB = ["unternehmen", "landwirtschaft", "gemeinde", "energiegemeinschaft"];
const GEPRUEFT = "2026-10-11";

export const FOERDER_TICKER = [
  {
    id: "oemag-marktpreis-2026-09",
    datum: "2026-10-11",
    titel: "OeMAG-Marktpreis September 2026: 10,168 ct/kWh",
    kurz: "Der Marktpreis für Photovoltaik und andere Energieträger (außer Wind) liegt im September bei 10,168 ct/kWh – der höchste Monatswert 2026 (August 8,997). Die Werte sind laut OeMAG bereits um den Aufwand für Ausgleichsenergie (0,408 ct/kWh) gekürzt.",
    text: "Der OeMAG-Marktpreis bestimmt, was Einspeiser im Marktprämienmodell und viele Abnahmeverträge als Referenz erhalten. Nach dem Tief im März (5,720 ct/kWh) ist der September mit 10,168 ct/kWh der höchste Wert des Jahres 2026. Für Betriebe mit Überschusseinspeisung lohnt der Blick in den eigenen Abnahmevertrag: Ist die Vergütung an den OeMAG-Marktpreis gekoppelt, wirkt sich der Anstieg direkt auf die Monatsabrechnung aus. Abgerufen am 11.10.2026 auf oem-ag.at/marktpreis; Richtwert, verbindlich ist die Veröffentlichung der OeMAG.",
    zielgruppen: ALLE,
    bundesland: "bund",
    typ: "kennzahl",
    status: "bestaetigt",
    quelle: { label: "OeMAG – Marktpreis (abgerufen 11.10.2026)", url: "https://www.oem-ag.at/marktpreis" },
    seiten: ["/forderungen/bundesfoerderung#marktpraemie", "/service/direktvermarktung", "/ratgeber/einspeiseverguetung-2026"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "bmwet-tickets-2026-10-09",
    datum: "2026-10-09",
    titel: "EAG-Fördercall 3/2026: rund 43.300 Tickets in zehn Minuten",
    kurz: "Laut BMWET wurden am 08.10.2026 ab 17 Uhr nach einer Minute rund 19.600, nach zehn Minuten rund 43.300 Tickets gezogen (2. Call 2026: 24.900). Anträge sind bis 22.10.2026 auch ohne Ticket direkt im EAG-Portal möglich.",
    zielgruppen: ALLE,
    bundesland: "bund",
    typ: "frist",
    status: "bestaetigt",
    quelle: { label: "BMWET – 43.300 Tickets in zehn Minuten (09.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-foerderung-43300-tickets.html" },
    seiten: ["/forderungen/eag-foerdercall", "/forderungen/bundesfoerderung#foerdercalls"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "bmwet-budget-2026-10-08",
    datum: "2026-10-08",
    titel: "Korrektur: Budget des letzten EAG-Fördercalls 2026 auf 38,5 Mio. € aufgestockt",
    kurz: "Statt der ursprünglich geplanten 8 Mio. € stehen laut BMWET 38,5 Mio. € bereit – Restmittel aus früheren Calls, kein neues Geld. Eine Aufteilung auf die Kategorien A–D ist nicht veröffentlicht. Damit umfasst die PV- und Speicherförderung 2026 insgesamt 128,5 Mio. €.",
    text: "Bis zum 07.10.2026 nannten der Förderkalender der Abwicklungsstelle und unsere Seiten je 2 Mio. € pro Kategorie, insgesamt 8 Mio. €. Mit den Pressemeldungen vom 07. und 08.10.2026 hat das BMWET die Aufstockung auf 38,5 Mio. € bekannt gegeben. Wir haben die Summe auf den Seiten zum Fördercall korrigiert; die Kategorienbudgets bleiben als „Plan“ gekennzeichnet, bis die Abwicklungsstelle eine Aufteilung veröffentlicht.",
    zielgruppen: ALLE,
    bundesland: "bund",
    typ: "korrektur",
    status: "bestaetigt",
    quelle: { label: "BMWET – 38,5 Millionen Euro für letzten PV-Fördercall (08.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-f%C3%B6rdercall-schnell.html" },
    seiten: ["/forderungen/eag-foerdercall", "/forderungen/bundesfoerderung#foerdercalls"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "bmwet-call-2026-10-07",
    datum: "2026-10-07",
    titel: "Letzter EAG-PV-Fördercall 2026: 08.–22.10.2026",
    kurz: "Ticketziehung am 08.10.2026 um 17 Uhr, Einreichung bis 22.10.2026. Gefördert werden neue oder erweiterte PV-Anlagen und damit verbundene Speicher. Es ist der letzte Call im bisherigen System.",
    zielgruppen: ALLE,
    bundesland: "bund",
    typ: "frist",
    status: "bestaetigt",
    quelle: { label: "BMWET – Letzter EAG-PV-Fördercall startet am 8. Oktober (07.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/letzter-eag-pv-foerdercall.html" },
    seiten: ["/forderungen/eag-foerdercall", "/forderungen/fristen"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "bmwet-systemfoerderung-2027",
    datum: "2026-10-06",
    titel: "Angekündigt: PV-Förderung ab 2027 wird Systemförderung für Speicher und Steuerung",
    kurz: "Das BMWET kündigt Eckpunkte an: Speichersystembonus statt klassischem PV-Zuschuss, Energiemanagementsystem als Voraussetzung, Wechselrichter aus Europa bei neuen Speichersystemen, laufende Antragstellung nach Fertigstellung statt Fördercalls. Höhe, Kriterien und Zeitplan sind offen; die Novelle braucht eine Zweidrittelmehrheit.",
    text: "Nach den Pressemeldungen vom 06. und 09.10.2026 soll die klassische PV-Investitionsförderung 2027 durch einen Speichersystembonus ersetzt werden – für Speicher an neuen PV-Anlagen und für die Nachrüstung bestehender Anlagen. Ein intelligentes Energiemanagementsystem soll Fördervoraussetzung werden, bei neuen Speichersystemen an neuen PV-Anlagen ein Wechselrichter aus Europa verpflichtend sein; für Nachrüstungen bleibt ein Made-in-Europe-Bonus vorgesehen. Statt Fördercalls ist ein laufendes, antragsbasiertes Modell nach Fertigstellung mit der Schlussrechnung geplant; Projekte aus 2026, die ab 01.11.2026 abgerechnet oder in Betrieb genommen werden, sollen 2027 im neuen System einreichen können. Förderhöhe, technische Kriterien und Budget „werden derzeit abschließend verhandelt“. Nichts davon ist beschlossen – wir übernehmen keine Prozentsätze, bis die Investitionszuschuss-Verordnung vorliegt.",
    zielgruppen: ALLE,
    bundesland: "bund",
    typ: "ankuendigung",
    status: "angekuendigt",
    quelle: { label: "BMWET – PV-Förderung wird Systemförderung für Speicher & intelligente Steuerung (06.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-foerderung-wird-systemfoerderung.html" },
    seiten: ["/forderungen/bundesfoerderung", "/gewerbespeicher"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "elwg-p2p-2026-10-01",
    datum: "2026-10-02",
    titel: "Seit 01.10.2026: Peer-to-Peer-Verträge und Energiegemeinschaften nach ElWG",
    kurz: "Die ElWG-Stufe vom 01.10.2026 ist in Kraft: Strom kann per Peer-to-Peer-Vertrag ohne eigene Rechtsperson direkt geteilt werden, Preis frei vereinbar. Für große Unternehmen gilt eine Grenze von 6 MW Erzeugungsleistung je Zählpunkt, KMU sind ausgenommen.",
    zielgruppen: ALLE,
    bundesland: "bund",
    typ: "beschluss",
    status: "bestaetigt",
    quelle: { label: "BMWET – Peer-to-Peer-Verträge: Strom ab sofort einfacher direkt teilen (02.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/peer-to-peer.html" },
    quellen: [{ label: "Koordinationsstelle Energiegemeinschaften – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/" }],
    seiten: ["/energiegemeinschaften", "/forderungen/richtlinien"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "klimafonds-gemeinsame-energienutzung-2026",
    datum: "2026-10-01",
    titel: "Neu: Klimafonds „Gemeinsame Energienutzung 2026“ – 6,9 Mio. €, Einreichung bis 10.03.2027",
    kurz: "Einreichung 01.10.2026, 12 Uhr bis 10.03.2027, 12 Uhr. Gefördert werden Energiemanagement, Prognose, systemdienliche Maßnahmen, gemeinschaftlich genutzte Speicher (Invest) und F&E-Projekte für alle Organisationsformen gemeinsamer Energienutzung im Nahebereich (§ 70 Abs. 6 ElWG).",
    zielgruppen: ["energiegemeinschaft", "gemeinde", "unternehmen"],
    bundesland: "bund",
    typ: "neu",
    status: "bestaetigt",
    quelle: { label: "Klima- und Energiefonds – Gemeinsame Energienutzung 2026", url: "https://www.klimafonds.gv.at/foerderung/gemeinsame-energienutzung-2026/" },
    seiten: ["/forderungen/bundesfoerderung#kpc", "/energiegemeinschaften", "/forderungen/fristen"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "elektrizitaetsabgabe-2027-offen",
    datum: "2026-09-29",
    titel: "Elektrizitätsabgabe 2027: Verlängerung der Senkung offen",
    kurz: "Die 2026 gesenkte Elektrizitätsabgabe (0,82 ct/kWh, Haushalte 0,1 ct/kWh) läuft mit 31.12.2026 aus. Der Finanzausschuss hat einen Antrag auf Verlängerung am 29.09.2026 vertagt; laut ÖVP und NEOS laufen regierungsinterne Gespräche, offen ist die Gegenfinanzierung von rund 520 Mio. €.",
    zielgruppen: ALLE,
    bundesland: "bund",
    typ: "ankuendigung",
    status: "angekuendigt",
    quelle: { label: "Parlamentskorrespondenz – Finanzausschuss diskutiert Forderungen zur Elektrizitätsabgabe (29.09.2026)", url: "https://www.ots.at/presseaussendung/OTS_20260929_OTS0144/finanzausschuss-diskutiert-forderungen-der-gruenen-zur-elektrizitaetsabgabe-energiekrisenbeitraege-und-dienstwaegen" },
    seiten: ["/forderungen/steuerlich", "/forderungen/fristen"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "kaernten-landesfoerderung-mitte-oktober",
    datum: "2026-09-23",
    titel: "Kärnten: Landesförderung PV – Anträge voraussichtlich ab Mitte Oktober 2026",
    kurz: "Laut LK Kärnten können Förderanträge nach Fertigstellung und Abnahme voraussichtlich ab Mitte Oktober online gestellt werden; die Richtlinie gilt „aus heutiger Sicht noch bis Ende 2026“. Gefördert werden nur nach dem 01.01.2026 realisierte Projekte; bei betrieblichen Anlagen ist die Förderintensität mit 45 % gedeckelt.",
    zielgruppen: ["unternehmen", "landwirtschaft", "gemeinde", "privat"],
    bundesland: "kaernten",
    typ: "ankuendigung",
    status: "angekuendigt",
    quelle: { label: "LK Kärnten – EAG-Investitionszuschuss: letzter Fördercall 2026 (23.09.2026)", url: "https://ktn.lko.at/eag-investitionszuschuss-letzter-f%C3%B6rdercall-2026+2400+4457200" },
    seiten: ["/forderungen/landesforderungen/landesfoerderungen-in-kaernten", "/forderungen/fristen"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "bgbl-62-2026-budgetbegleitgesetz",
    datum: "2026-07-29",
    titel: "Budgetbegleitgesetz 2027–2028 kundgemacht (BGBl. I Nr. 62/2026)",
    kurz: "Kundmachung 29.07.2026, überwiegend in Kraft ab 30.07.2026. Der investitionsbedingte Gewinnfreibetrag wird vorübergehend auf Realinvestitionen eingeschränkt. Laut den Übersichten von USP und BMF keine Änderung bei Investitionsfreibetrag, Elektrizitätsabgabe oder Umsatzsteuer für PV – Details im Gesetzestext prüfen.",
    zielgruppen: ["unternehmen", "landwirtschaft"],
    bundesland: "bund",
    typ: "beschluss",
    status: "bestaetigt",
    quelle: { label: "USP – Veröffentlichung im Bundesgesetzblatt: Budgetbegleitgesetz 2027-2028", url: "https://www.usp.gv.at/aktuelles/gesetzliche-neuerungen/Bundesgesetzblatt/bbg-2027-28.html" },
    quellen: [{ label: "BMF-Rechtsnews – Budgetbegleitgesetz 2027 und 2028, Teil Steuern", url: "https://www.bmf.gv.at/rechtsnews/steuern-rechtsnews/neue-gesetze/2026/budgetbegleitgesetz-2027-und-2028-teil-steuern.html" }],
    seiten: ["/forderungen/steuerlich"],
    geprueftAm: GEPRUEFT,
  },
  {
    id: "steiermark-oekofonds-speicher-2026",
    datum: "2026-06-25",
    titel: "Steiermark: Ökofonds „Innovative Energiespeicher 2026“ – Modul 1 bis 31.10.2026",
    kurz: "Ausschreibung 01.07.2026 bis 31.07.2027, Budget 1 Mio. € (Modul 1: 100.000 €, Modul 2: 900.000 €). Modul 1 (Umsetzungskonzept) bis 31.10.2026, Modul 2 (Umsetzung) bis 31.07.2027. Antragsberechtigt sind juristische Personen, auch Gemeinden und Energiegemeinschaften; Private nicht.",
    zielgruppen: BETRIEB,
    bundesland: "steiermark",
    typ: "neu",
    status: "bestaetigt",
    quelle: { label: "Land Steiermark – Ökofonds Innovative Energiespeicher 2026, Kurzinformation (24.06.2026)", url: "https://www.technik.steiermark.at/cms/dokumente/13017115_161967760/8a73f732/2026-06-24_%C3%96kofonds_Kurzinformation_Energiespeicher%20v1.pdf" },
    seiten: ["/forderungen/landesforderungen/landesfoerderungen-in-steiermark", "/forderungen/fristen", "/gewerbespeicher"],
    geprueftAm: GEPRUEFT,
  },
];

/** Einträge sortiert nach Datum (neueste zuerst), optional gefiltert. */
export function tickerEintraege({ bundesland, zielgruppe, typ, limit } = {}) {
  let liste = FOERDER_TICKER.filter((e) => e.quelle?.url && e.status && e.datum);
  if (bundesland) liste = liste.filter((e) => !e.bundesland || e.bundesland === "bund" || e.bundesland === bundesland);
  if (zielgruppe) liste = liste.filter((e) => !e.zielgruppen?.length || e.zielgruppen.includes(zielgruppe));
  if (typ) liste = liste.filter((e) => e.typ === typ);
  liste = [...liste].sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
  return Number.isFinite(limit) ? liste.slice(0, limit) : liste;
}

/** Datum der neuesten Meldung im Ticker (ISO), Fallback null. */
export function tickerStand() {
  return tickerEintraege({ limit: 1 })[0]?.datum ?? null;
}

/** Pfad der Ticker-Seite mit Anker eines Eintrags. */
export function tickerPfad(id) {
  return id ? `/forderungen/aktuell#${id}` : "/forderungen/aktuell";
}
