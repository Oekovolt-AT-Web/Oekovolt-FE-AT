// src/components/Forderungen/Shared/bund.js
//
// Bundesweite Förder-, Steuer- und Rechtsdaten Österreich für die Förder- und
// Rechtsseiten sowie den Förder-Check. Stand zentral über STAND aus
// @/data/bundeslaender. Jede Angabe mit Quelle; Unsicheres ist mit
// `pruefen: true` markiert.

import { STAND } from "@/data/bundeslaender";

export { STAND };

// Datumsfelder (C01): fristIso = Einreichfrist, startIso = Beginn der Einreichung,
// gueltigBisIso = Ende der Laufzeit, geprueftAm = letzte redaktionelle Prüfung.
// Nur übertragene Werte aus den Statustexten – nichts geschätzt. Status zur Laufzeit
// über programmStatus() aus @/lib/programmStatus.
const GEPRUEFT_SOFORTWELLE = STAND.iso; // 2026-09-29
const GEPRUEFT_C01 = "2026-10-11"; // Quellen am 11.10.2026 erneut abgerufen

// ---------------------------------------------------------------------------
// EAG-Investitionszuschuss PV & Speicher (OeMAG / EAG-Förderabwicklungsstelle)
// Rechtsgrundlage: § 56 EAG, EAG-Investitionszuschüsseverordnung-Strom
// (EAG-IZV, BGBl. II Nr. 64/2023 idF BGBl. II Nr. 12/2026).
// ---------------------------------------------------------------------------

export const EAG_IZ = {
  kategorien: [
    { id: "A", leistung: "bis 10 kWp", satz: "150 €/kWp", art: "Fixbetrag", reihung: "nach Eingang (Ticket)" },
    { id: "B", leistung: "über 10 bis 20 kWp", satz: "140 €/kWp", art: "Fixbetrag", reihung: "nach Eingang (Ticket)" },
    { id: "C", leistung: "über 20 bis 100 kWp", satz: "max. 130 €/kWp", art: "Höchstsatz – Gebot", reihung: "nach niedrigstem Förderbedarf je kWp" },
    { id: "D", leistung: "über 100 bis 1.000 kWp", satz: "max. 120 €/kWp", art: "Höchstsatz – Gebot", reihung: "nach niedrigstem Förderbedarf je kWp" },
  ],
  speicher: {
    satz: "150 €/kWh",
    regeln: [
      "nur gemeinsam mit neuer oder erweiterter PV-Anlage",
      "mindestens 0,5 kWh je kWp installierter Modulleistung",
      "gefördert werden höchstens 50 kWh je Anlage",
      "Speicher allein und Erweiterung bestehender Speicher sind nicht förderfähig",
    ],
  },
  calls: [
    { nr: 1, zeitraum: "23.04.–11.05.2026", startIso: "2026-04-23", fristIso: "2026-05-11", geprueftAm: GEPRUEFT_SOFORTWELLE, budget: { A: "5 Mio. €", B: "5 Mio. €", C: "15 Mio. €", D: "15 Mio. €" }, summe: "40 Mio. €", status: "abgeschlossen" },
    { nr: 2, zeitraum: "16.06.–30.06.2026", startIso: "2026-06-16", fristIso: "2026-06-30", geprueftAm: GEPRUEFT_SOFORTWELLE, budget: { A: "2 Mio. €", B: "2 Mio. €", C: "4 Mio. €", D: "4 Mio. €" }, summe: "12 Mio. €", status: "abgeschlossen" },
    // Budget am 07./08.10.2026 vom BMWET auf 38,5 Mio. € aufgestockt (Restmittel früherer Calls);
    // eine Aufteilung auf die Kategorien ist amtlich nicht veröffentlicht – ursprünglicher Plan: je 2 Mio. €.
    { nr: 3, zeitraum: "08.10.–22.10.2026", startIso: "2026-10-08", fristIso: "2026-10-22", geprueftAm: GEPRUEFT_C01, budget: { A: "je 2 Mio. € (Plan)", B: "je 2 Mio. € (Plan)", C: "je 2 Mio. € (Plan)", D: "je 2 Mio. € (Plan)" }, summe: "38,5 Mio. €", summeHinweis: "aufgestockt am 08.10.2026, ursprünglich 8 Mio. €", status: "läuft bis 22.10." },
  ],
  naechsterCall: { zeitraum: "08.10.–22.10.2026", start: "2026-10-08", ende: "2026-10-22", hinweis: "Ticketziehung für Kategorie A und B am 08.10.2026 um 17 Uhr" },
  // BMWET, 09.10.2026: rund 43.300 Tickets in zehn Minuten (Zwischenstand, keine Aussage über Zusagen).
  ticketziehung: { tickets10Min: 43_300, vergleichCall2: 24_900, quelle: { label: "BMWET – 43.300 Tickets in zehn Minuten (09.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-foerderung-43300-tickets.html" } },
  zuschlaege: [
    { titel: "Abschlag 25 %", text: "für PV auf landwirtschaftlich genutzten Flächen oder im Grünland. Entfällt u. a. auf Gebäuden und baulichen Anlagen, auf Deponien, Altlasten, Bergbau-, Infrastruktur- und Militärflächen, künstlichen Gewässern sowie bei Agri-PV mit landwirtschaftlicher Hauptnutzung auf mindestens 75 % der Fläche." },
    { titel: "Innovationszuschlag +30 %", text: "für gebäudeintegrierte und schwimmende PV, Parkplatzüberdachungen ab 10 Stellplätzen (Module bilden das Dach), PV an Lärmschutzwänden und Staumauern sowie Agri-PV mit vertikalen Modulen oder mindestens 2 m Modulunterkante." },
    { titel: "Made in Europe +10 % je Komponente", text: "für Module, Wechselrichter und Speicher mit wesentlichen Fertigungsschritten in Europa – laut Produktliste der Abwicklungsstelle (Anträge ab 23.06.2025)." },
  ],
  obergrenzen: [
    "max. 30 % der förderfähigen Nettokosten (§ 11 EAG-IZV)",
    "mit Innovations- bzw. Europa-Zuschlag max. 65 % (kleine), 55 % (mittlere) bzw. 45 % (große Unternehmen)",
  ],
  freiflaecheAuflagen: "Auf Agrar-, Grünland- und Freiflächen: Modulunterkante mind. 80 cm, Reihenabstand mind. 2 m, Biodiversitätsmaßnahmen, rückstandslos rückbaubar.",
  fristen: [
    { titel: "Antrag", text: "vor der Inbetriebnahme; Bestellung oder Baubeginn davor schaden nicht" },
    { titel: "Genehmigungen", text: "alle nötigen Anzeigen und Genehmigungen müssen beim Antrag in erster Instanz vorliegen" },
    { titel: "Inbetriebnahme", text: "bis 100 kWp binnen 6 Monaten (2× um bis zu 9 Monate verlängerbar), über 100 kWp binnen 12 Monaten (1× um bis zu 12 Monate verlängerbar)" },
    { titel: "Endabrechnung", text: "spätestens 6 Monate nach Ende der Inbetriebnahmefrist (1× um 6 Monate verlängerbar) – sonst verfällt die Förderung" },
  ],
  kombination:
    "Kategorie A, B, C und innovative PV dürfen mit Förderungen von Bund, Land und Gemeinde kombiniert werden – bis zu den beihilferechtlichen Höchstgrenzen. In Kategorie D ist eine Kombination ausgeschlossen. Andere Förderungen sind der Abwicklungsstelle zu melden.",
  fehler: [
    { titel: "Inbetriebnahme vor dem Antrag", text: "Der häufigste und nicht heilbare Fehler: Wer vor dem Förderantrag einschaltet, verliert den Anspruch." },
    { titel: "Genehmigung fehlt beim Antrag", text: "Bau-, naturschutz- oder elektrizitätsrechtliche Anzeigen müssen zum Antragszeitpunkt vorliegen." },
    { titel: "Unterlagen nicht binnen 4 Wochen nachgereicht", text: "Dann gilt der Antrag als zurückgezogen." },
    { titel: "Gebot zu hoch (Kategorie C/D)", text: "Gereiht wird nach Förderbedarf je kWp – wer den Höchstsatz beantragt, landet oft hinter dem Budget." },
    { titel: "Endabrechnung zu spät", text: "Verstreicht die Frist ergebnislos, gilt der Vertrag als aufgelöst." },
    { titel: "Formale Mängel bei Rechnungen", text: "Barzahlung, reine Materialrechnungen ohne Montage durch befugte Unternehmen und Eigenleistungen werden nicht anerkannt." },
    { titel: "Doppelförderung in Kategorie D", text: "Eine zusätzliche Landes- oder Gemeindeförderung ist hier unzulässig und führt zur Rückforderung." },
  ],
  quellen: [
    { label: "EAG-IZV, Fassung vom 19.01.2026 (OeMAG)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf" },
    { label: "EAG-IZV-Novelle 2026, BGBl. II Nr. 12/2026", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/2026-01-16_EAG-IZV-Novelle_2026.pdf" },
    { label: "EAG-Förderabwicklungsstelle – Investitionszuschuss PV & Speicher", url: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
    { label: "Land OÖ – Leitfaden 2026 Photovoltaik (Juni 2026)", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf" },
    { label: "LK Kärnten – letzter Fördercall 2026 (23.09.2026)", url: "https://ktn.lko.at/eag-investitionszuschuss-letzter-f%C3%B6rdercall-2026+2400+4457200" },
    { label: "BMWET – Letzter EAG-PV-Fördercall startet am 8. Oktober (07.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/letzter-eag-pv-foerdercall.html" },
    { label: "BMWET – 38,5 Millionen Euro für letzten PV-Fördercall (08.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-f%C3%B6rdercall-schnell.html" },
  ],
};

/**
 * Angekündigte Neuausrichtung der PV-Förderung ab 2027 (BMWET, 06.–09.10.2026).
 * Status: Eckpunkte, nicht beschlossen – Novelle braucht Zweidrittelmehrheit, Höhe und Kriterien
 * werden „abschließend verhandelt“. Keine Prozentsätze übernehmen, solange nichts verordnet ist.
 */
export const EAG_2027 = {
  status: "angekuendigt",
  stand: GEPRUEFT_C01,
  punkte: [
    "Die klassische PV-Investitionsförderung soll durch einen Speichersystembonus ersetzt werden (neue Speicher an neuen PV-Anlagen und Nachrüstung bestehender Anlagen).",
    "Ein intelligentes Energiemanagementsystem soll Fördervoraussetzung werden.",
    "Bei neuen Speichersystemen an neuen PV-Anlagen soll ein Wechselrichter aus Europa verpflichtend sein; für die Nachrüstung bleibt ein Made-in-Europe-Bonus vorgesehen.",
    "Statt Fördercalls (First come, first served) ein laufendes, antragsbasiertes Modell nach Fertigstellung mit der Schlussrechnung.",
    "Projekte aus 2026, die ab 01.11.2026 abgerechnet oder in Betrieb genommen werden, sollen 2027 im neuen System einreichen können.",
  ],
  offen: "Förderhöhe, technische Kriterien, Budget und Zeitplan der Gesetzesnovelle sind nicht veröffentlicht (Stand 11.10.2026).",
  quellen: [
    { label: "BMWET – PV-Förderung wird Systemförderung für Speicher & intelligente Steuerung (06.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-foerderung-wird-systemfoerderung.html" },
    { label: "BMWET – 43.300 Tickets in zehn Minuten (09.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/pv-foerderung-43300-tickets.html" },
  ],
};

// ---------------------------------------------------------------------------
// EAG-Marktprämie PV (Ausschreibung, EAG-Marktprämienverordnung idF BGBl. II Nr. 13/2026)
// ---------------------------------------------------------------------------

export const MARKTPRAEMIE = {
  text: "Neue oder erweiterte PV-Anlagen über 10 kWp können statt des Investitionszuschusses eine Marktprämie über 20 Jahre erhalten. Sie gleicht die Differenz zwischen dem in der Ausschreibung gebotenen Wert und dem Referenzmarktwert aus.",
  termine: [
    { datum: "17.03.2026", fristIso: "2026-03-17", geprueftAm: GEPRUEFT_SOFORTWELLE, volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "bezuschlagt" },
    { datum: "11.06.2026", fristIso: "2026-06-11", geprueftAm: GEPRUEFT_SOFORTWELLE, volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "bezuschlagt am 10.07.2026, Zuschläge bis 6,69 ct/kWh" },
    { datum: "24.09.2026", fristIso: "2026-09-24", geprueftAm: GEPRUEFT_SOFORTWELLE, volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "Gebotsfrist abgelaufen" },
    // Termin laut Leitfaden Land OÖ (06/2026); im Förderkalender der EAG-Abwicklungsstelle war er am 11.10.2026 nicht eingetragen → pruefen.
    { datum: "10.12.2026", fristIso: "2026-12-10", geprueftAm: GEPRUEFT_C01, pruefen: true, volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "nächster Gebotstermin (laut Leitfaden Land OÖ, bitte prüfen)" },
  ],
  hinweise: [
    "Freiflächen auf landwirtschaftlichen Flächen oder im Grünland: Abschlag 25 % auf den Zuschlagswert",
    "Inbetriebnahme bis 100 kWp binnen 6, darüber binnen 12 Monaten ab Zuschlag",
    "Marktprämie und Investitionszuschuss schließen sich für dieselbe Anlage aus",
  ],
  quellen: [
    { label: "Land OÖ – Leitfaden 2026 (Gebotstermine, Höchstpreis)", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf" },
    { label: "EAG-Abwicklungsstelle – 2. Ausschreibung 2026", url: "https://www.eag-abwicklungsstelle.at/artikel/die-2-ausschreibung-zur-marktpraemie-fuer-pv-anlagen-wurde-mit-10-juli-2026-bezuschlagt/" },
  ],
};

/** OeMAG-Marktpreis PV 2026 in ct/kWh (monatlich im Nachhinein). Quelle: oem-ag.at/marktpreis. */
export const OEMAG_MARKTPREIS = {
  werte: [
    ["Jänner", "8,842"], ["Februar", "8,457"], ["März", "5,720"], ["April", "6,772"], ["Mai", "6,772"], ["Juni", "6,772"], ["Juli", "6,146"], ["August", "8,997"], ["September", "10,168"],
  ],
  hinweis: "Der Oktoberwert wird Anfang November veröffentlicht. Die Tabellenwerte sind laut OeMAG bereits um den Aufwand für Ausgleichsenergie PV 2026 (0,408 ct/kWh) gekürzt.",
  geprueftAm: GEPRUEFT_C01,
  quelle: { label: "OeMAG – Marktpreis (abgerufen 11.10.2026)", url: "https://www.oem-ag.at/marktpreis" },
};

// ---------------------------------------------------------------------------
// KPC / Umweltförderung, Klima- und Energiefonds
// ---------------------------------------------------------------------------

export const KPC_PROGRAMME = [
  {
    id: "insel",
    name: "Stromerzeugung in Insellage",
    traeger: "KPC – Umweltförderung im Inland",
    zielgruppen: ["unternehmen", "landwirtschaft"],
    themen: ["pv-dach", "speicher"],
    hoehe: "30 % der umweltrelevanten Mehrkosten",
    was: "PV und Speicher ohne Netzzugang, z. B. Berghütten und Almen; Mindestinvestition 10.000 €; Zuschläge für hochalpine Lagen",
    status: "Antrag vor der ersten verbindlichen Bestellung",
    geprueftAm: GEPRUEFT_SOFORTWELLE,
    url: "https://www.umweltfoerderung.at/betriebe/stromerzeugung-in-insellage",
  },
  {
    id: "eg-klimafonds",
    name: "Energiegemeinschaften 2025",
    traeger: "Klima- und Energiefonds / KPC",
    zielgruppen: ["energiegemeinschaft"],
    themen: ["pv-dach", "freiflaeche", "speicher"],
    hoehe: "bis 10.000 € je Schwerpunkt",
    was: "für bereits aktive Energiegemeinschaften: Mitgliedergewinnung, Digitalisierung und Steuerung",
    status: "Einreichfrist endete am 30.09.2026, 12 Uhr – Nachfolger: Gemeinsame Energienutzung 2026",
    fristIso: "2026-09-30",
    pruefen: true,
    geprueftAm: GEPRUEFT_C01,
    url: "https://www.klimafonds.gv.at/foerderung/energiegemeinschaften-2025/",
  },
  {
    // Klimafonds, abgerufen 11.10.2026: Einreichzeitraum 01.10.2026 12:00 bis 10.03.2027 12:00, Budget 6.900.000 €,
    // Zielgruppen laut Seite: Unternehmen, Gemeinde, Privat, Forschungseinrichtungen, Sonstige („alle Organisationsformen
    // zur gemeinsamen Energienutzung“); Bedingung: gemeinsame Energienutzung im Nahebereich nach § 70 Abs. 6 Z 1–4 ElWG.
    id: "gemeinsame-energienutzung",
    name: "Gemeinsame Energienutzung und Innovationen für eine optimierte Systemintegration 2026",
    traeger: "Klima- und Energiefonds / KPC (Schwerpunkt 4: FFG)",
    zielgruppen: ["energiegemeinschaft", "gemeinde", "unternehmen"],
    themen: ["pv-dach", "speicher"],
    hoehe: "Budget 6,9 Mio. €; Förderhöhe laut Leitfaden",
    was: "Energiemanagement, Prognose, systemdienliche Maßnahmen, gemeinschaftlich genutzte Speicher (Invest) und F&E-Projekte für Energiegemeinschaften, Peer-to-Peer und andere Formen gemeinsamer Energienutzung",
    status: "Einreichung 01.10.2026, 12 Uhr bis 10.03.2027, 12 Uhr",
    startIso: "2026-10-01",
    fristIso: "2027-03-10",
    geprueftAm: GEPRUEFT_C01,
    url: "https://www.klimafonds.gv.at/foerderung/gemeinsame-energienutzung-2026/",
  },
  {
    id: "flex",
    name: "Energiemanagement – Flexibilisierung im Verteilnetz",
    traeger: "Klima- und Energiefonds / KPC",
    zielgruppen: ["unternehmen", "gemeinde"],
    themen: ["speicher", "laden", "waermepumpe"],
    hoehe: "Förderhöhe laut Leitfaden",
    was: "automatisierte Energiemanagementsysteme für Betriebe, Gemeinden und Vereine an Netzebene 6/7; 5 Jahre Betriebspflicht",
    status: "Einreichung 23.06.2026 – 15.04.2027, 12 Uhr",
    startIso: "2026-06-23",
    fristIso: "2027-04-15",
    geprueftAm: GEPRUEFT_C01, // Frist 15.04.2027 am 11.10.2026 auf klimafonds.gv.at/foerderungen bestätigt
    url: "https://www.klimafonds.gv.at/foerderung/energiemanagement-betriebe-2026/",
  },
  {
    id: "wp-betrieb",
    name: "Wärmepumpe für Betriebe",
    traeger: "KPC – Umweltförderung im Inland",
    zielgruppen: ["unternehmen", "landwirtschaft"],
    themen: ["waermepumpe"],
    hoehe: "Förderhöhe laut Informationsblatt",
    was: "Wärmepumpen unter und ab 100 kW Heizleistung",
    status: "offen – Antrag bis 6 Monate nach Rechnungslegung",
    pruefen: true,
    geprueftAm: GEPRUEFT_SOFORTWELLE,
    url: "https://www.umweltfoerderung.at/betriebe/waermepumpe-100-kw",
  },
  {
    id: "kem",
    name: "Klima- und Energie-Modellregionen (KEM) 2026",
    traeger: "Klima- und Energiefonds",
    zielgruppen: ["gemeinde"],
    themen: ["pv-dach", "freiflaeche", "speicher", "laden", "waermepumpe"],
    hoehe: "laut Ausschreibung",
    was: "Regionen aus mehreren Gemeinden mit Modellregionsmanagement – Umsetzungsprojekte und Investitionsförderungen",
    status: "Einreichung endete am 30.09.2026",
    fristIso: "2026-09-30",
    pruefen: true,
    geprueftAm: GEPRUEFT_SOFORTWELLE,
    url: "https://www.klimafonds.gv.at/foerderungen/",
  },
];

export const KPC_BEENDET = [
  { name: "Photovoltaik in der Land- und Forstwirtschaft (KPC)", ende: "geschlossen seit 16.12.2021", url: "https://www.umweltfoerderung.at/betriebe/photovoltaik-in-der-land-und-forstwirtschaft" },
  { name: "Mittlere Stromspeicher (51–1.000 kWh)", ende: "beendet am 05.11.2024", url: "https://www.umweltfoerderung.at/betriebe/mittlere-stromspeicheranlagen" },
  { name: "Großspeicher ab 1 MWh", ende: "ausgelaufen am 31.03.2025", url: "https://www.umweltfoerderung.at/betriebe/grossspeicher" },
  { name: "E-Ladeinfrastruktur für Betriebe 2025", ende: "wegen ausgeschöpftem Budget vorzeitig beendet", url: "https://www.umweltfoerderung.at/betriebe/e-ladeinfrastruktur-betriebe-2025-eride" },
  { name: "E-Ladeinfrastruktur für Private 2025 (eRide)", ende: "wegen ausgeschöpftem Budget vorzeitig beendet", url: "https://www.umweltfoerderung.at/privatpersonen/e-ladeinfrastruktur-private-2025-eride" },
  { name: "Kesseltausch und Sanierungsbonus 2026 (Private)", ende: "Mittel ausgeschöpft – derzeit keine Antragstellung", url: "https://www.umweltfoerderung.at/privatpersonen/kesseltausch-ein-zweifamilienhaus-und-reihenhaus-2026" },
];

// ---------------------------------------------------------------------------
// Energiegemeinschaften (EAG § 79 ff., ab 01.10.2026 ElWG)
// ---------------------------------------------------------------------------

export const ENERGIEGEMEINSCHAFTEN = {
  formen: [
    { titel: "Erneuerbare-Energie-Gemeinschaft (EEG)", text: "lokal oder regional innerhalb eines Netzbetreibers; Strom, Wärme oder Gas aus erneuerbaren Quellen; reduzierte Netzentgelte" },
    { titel: "Bürgerenergiegemeinschaft (BEG)", text: "österreichweit über mehrere Netzbetreiber; nur Strom, nicht auf Erneuerbare beschränkt; keine Netzentgelt-Reduktion" },
    { titel: "Gemeinschaftliche Erzeugungsanlage (GEA)", text: "mehrere Teilnehmer hinter einem Hausanschluss, etwa im Mehrparteienhaus oder Gewerbepark" },
    { titel: "Neu ab 01.10.2026 (ElWG)", text: "Peer-to-Peer-Verträge ohne eigene Rechtsperson und Eigenversorgungsanlagen über mehrere Standorte; österreichweit über Netzbetreibergrenzen ab etwa April 2027" },
  ],
  netzentgelt: [
    { art: "EEG lokal (Netzebene 6/7)", reduktion: "−57 %" },
    { art: "EEG regional (Netzebene 6/7)", reduktion: "−28 %" },
    { art: "EEG regional (Netzebene 4/5)", reduktion: "−64 %" },
    { art: "Bürgerenergiegemeinschaft", reduktion: "keine" },
  ],
  netzentgeltHinweis: "Reduktion auf den Arbeitspreis des Netznutzungsentgelts, geltend bis 31.12.2026. Ab 01.01.2027 legt die E-Control die Sätze in der neuen Systemnutzungsentgelte-Verordnung fest – zum Prüfdatum noch nicht verordnet.",
  netzentgeltGueltigBisIso: "2026-12-31",
  // BMWET 02.10.2026: Peer-to-Peer-Verträge „ab sofort“ ohne eigene Rechtsperson; Grenze 6 MW je Zählpunkt für große Unternehmen, KMU ausgenommen.
  peerToPeer: {
    startIso: "2026-10-01",
    geprueftAm: GEPRUEFT_C01,
    text: "Seit 01.10.2026 (ElWG §§ 65–72) können Erzeuger und Verbraucher Strom per Peer-to-Peer-Vertrag direkt teilen – ohne Gründung einer Rechtsperson, Preis frei vereinbar. Für große Unternehmen gilt eine Grenze von 6 MW Erzeugungsleistung je Zählpunkt; KMU sind davon nicht betroffen.",
    quelle: { label: "BMWET – Peer-to-Peer-Verträge: Strom ab sofort einfacher direkt teilen (02.10.2026)", url: "https://www.bmwet.gv.at/Presse/AktuellePressemeldungen/peer-to-peer.html" },
  },
  weitere: [
    "Elektrizitätsabgabe: innerhalb der EEG verbrauchter erneuerbarer Strom ist befreit (§ 2 Abs. 1 Z 4 ElAbgG, Anzeige beim Finanzamt)",
    "Erneuerbaren-Förderbeitrag entfällt für EEG-Strom",
    "Gewinnerzielung darf nicht im Vordergrund stehen",
  ],
  quellen: [
    { label: "Koordinationsstelle – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/" },
    { label: "Salzburg Netz – Netzentgelte für EEG", url: "https://www.salzburgnetz.at/stromnetz/energiegemeinschaften/erneuerbare-energie-gemeinschaften.html" },
    { label: "EEG-Ratgeber Steuern & Abgaben 2026", url: "https://energiegemeinschaften.gv.at/wp-content/uploads/sites/19/2023/05/EEG-Ratgeber-Steuern-Abgaben-2026.pdf" },
  ],
};

// ---------------------------------------------------------------------------
// Steuerrecht (Stand 09/2026)
// ---------------------------------------------------------------------------

export const STEUER = {
  ifb: {
    satzTemp: 20,
    satzOekoTemp: 22,
    satzRegulaer: 10,
    satzOekoRegulaer: 15,
    zeitraum: "01.11.2025 bis 31.12.2026",
    startIso: "2025-11-01",
    gueltigBisIso: "2026-12-31",
    geprueftAm: GEPRUEFT_SOFORTWELLE,
    max: 1_000_000,
    norm: "§ 11 EStG, § 124b Z 480 EStG (BGBl. I Nr. 79/2025); Öko-IFB-VO BGBl. II Nr. 155/2023",
  },
  gfb: { grund: "15 % des Gewinns bis 33.000 € (max. 4.950 €), ohne Investition", invest: "13 % für Gewinnteile über 33.000 €, insgesamt max. 46.400 € je Jahr", norm: "§ 10 EStG" },
  afa: { nd: 20, degressiv: 30, norm: "§ 7 EStG, EStR 2000; PV-Erlass BMF 30.07.2025" },
  ust: "20 % Umsatzsteuer – der 0-%-Satz für PV bis 35 kWp (§ 28 Abs. 62 UStG) endete mit 31.03.2025 (Altverträge bis 06.03.2025: Lieferung bis 31.12.2025).",
  kleinunternehmer: "55.000 € Bruttoumsatz (§ 6 Abs. 1 Z 27 UStG, seit 01.01.2025), 10 % Toleranz",
  einspeisungPrivat: "Einspeiseerlöse bis 12.500 kWh je Person und Jahr steuerfrei, wenn die Anlage max. 35 kWp Engpass- und 25 kW Anschlussleistung hat (§ 3 Abs. 1 Z 39 EStG)",
  elektrizitaetsabgabe: "Selbst erzeugter und verbrauchter Strom aus Erneuerbaren ist unbegrenzt befreit (§ 2 Abs. 1 Z 4 ElAbgG) – Anzeige beim Finanzamt nötig; Einspeisung ist nicht steuerbar.",
  // Senkung des Satzes für 2026 (0,82 ct/kWh, Haushalte 0,1 ct/kWh; BGBl. I Nr. 95/2025) läuft mit 31.12.2026 aus.
  // Finanzausschuss 29.09.2026: Antrag auf Verlängerung vertagt, Gespräche „regierungsintern im Gang“ – Stand offen.
  elektrizitaetsabgabe2027: {
    status: "offen",
    gueltigBisIso: "2026-12-31",
    geprueftAm: GEPRUEFT_C01,
    text: "Die gesenkte Elektrizitätsabgabe (0,82 ct/kWh, Haushalte 0,1 ct/kWh) gilt für Vorgänge bis 31.12.2026. Ob sie 2027 verlängert wird, ist offen: Der Finanzausschuss hat einen Verlängerungsantrag am 29.09.2026 vertagt.",
    quelle: { label: "Parlamentskorrespondenz – Finanzausschuss 29.09.2026 (Elektrizitätsabgabe vertagt)", url: "https://www.ots.at/presseaussendung/OTS_20260929_OTS0144/finanzausschuss-diskutiert-forderungen-der-gruenen-zur-elektrizitaetsabgabe-energiekrisenbeitraege-und-dienstwaegen" },
  },
  // Budgetbegleitgesetz 2027-2028, BGBl. I Nr. 62/2026 (kundgemacht 29.07.2026, überwiegend in Kraft ab 30.07.2026):
  // investitionsbedingter Gewinnfreibetrag vorübergehend auf Realinvestitionen eingeschränkt; laut USP- und BMF-Übersicht
  // keine Änderung bei Investitionsfreibetrag, Elektrizitätsabgabe oder Umsatzsteuer für PV.
  budgetbegleitgesetz: {
    bgbl: "BGBl. I Nr. 62/2026",
    kundgemachtIso: "2026-07-29",
    inKraftIso: "2026-07-30",
    geprueftAm: GEPRUEFT_C01,
    text: "Der investitionsbedingte Gewinnfreibetrag wird vorübergehend auf Realinvestitionen eingeschränkt. Investitionsfreibetrag, Elektrizitätsabgabe und Umsatzsteuer für PV sind laut den Übersichten von USP und BMF nicht betroffen – Details im Gesetzestext prüfen.",
    quellen: [
      { label: "USP – Budgetbegleitgesetz 2027-2028 im Bundesgesetzblatt", url: "https://www.usp.gv.at/aktuelles/gesetzliche-neuerungen/Bundesgesetzblatt/bbg-2027-28.html" },
      { label: "BMF-Rechtsnews – Budgetbegleitgesetz 2027 und 2028, Teil Steuern", url: "https://www.bmf.gv.at/rechtsnews/steuern-rechtsnews/neue-gesetze/2026/budgetbegleitgesetz-2027-und-2028-teil-steuern.html" },
    ],
  },
  quellen: [
    { label: "USP – Investitionsfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html" },
    { label: "USP – Gewinnfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/gewinnfreibetrag.html" },
    { label: "BMF – Photovoltaik-Erlass vom 30.07.2025", url: "https://findok.bmf.gv.at/findok/iwg/83/83743/83743.1.pdf" },
    { label: "BMF – Steuersatz für Photovoltaikmodule", url: "https://www.bmf.gv.at/themen/steuern/fuer-unternehmen/umsatzsteuer/informationen/steuersatz-fuer-photovoltaikmodule.html" },
    { label: "USP – Kleinunternehmerregelung", url: "https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/weitere-informationen-zur-umsatzsteuer/weitere-steuertatbestaende-und-befreiungen/kleinunternehmen.html" },
  ],
};

// ---------------------------------------------------------------------------
// Elektrizitätsrecht – ElWG (BGBl. I Nr. 91/2025)
// ---------------------------------------------------------------------------

export const ELWG = {
  kurz: "Das Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025) ersetzt das ElWOG 2010. Beschlossen im Nationalrat am 11.12.2025, im Bundesrat am 17.12.2025, in Kraft seit 24.12.2025 – mit gestaffelten Terminen.",
  termine: [
    { datum: "24.12.2025", iso: "2025-12-24", text: "Inkrafttreten der Grundregeln, u. a. Netzanschluss bis 20 kW auf Anzeige (§ 96)" },
    { datum: "01.04.2026", iso: "2026-04-01", text: "Sozialtarif" },
    { datum: "01.10.2026", iso: "2026-10-01", text: "Energiegemeinschaften im neuen Regime, Peer-to-Peer-Verträge, Eigenversorgungsanlagen" },
    { datum: "01.01.2027", iso: "2027-01-01", text: "neue Systemnutzungsentgelte, Infrastrukturbeitrag für Einspeiser (max. 0,05 ct/kWh, Anlagen bis 20 kW befreit), neue EEG-Reduktionssätze" },
  ],
  geprueftAm: GEPRUEFT_C01,
  punkte: [
    { titel: "Netzanschluss bis 20 kW", text: "Erneuerbare Anlagen bis 20 kW sind auf Anzeige anzuschließen; der Netzbetreiber kann binnen 4 Wochen aus Sicherheitsgründen ablehnen (§ 96 ElWG)." },
    { titel: "Bis 15 kW über bestehenden Anschluss", text: "PV bis 15 kW darf die volle vereinbarte Bezugsleistung für die Einspeisung nutzen – ohne zusätzliches Netzanschlussentgelt." },
    { titel: "Spitzenkappung", text: "Bei neuen oder erweiterten Anlagen darf der Netzbetreiber die Einspeisung auf 70 % der Modulspitzenleistung begrenzen; ausgenommen Anlagen bis 7 kW netzwirksam und unveränderte Bestandsanlagen." },
    { titel: "Steuerbarkeit", text: "Neuanlagen über 3,68 kW müssen steuerbar sein." },
    { titel: "Flexible Netzzugangsverträge", text: "Bei Netzengpässen sind befristete Einspeisebeschränkungen (12–24 Monate je Netzebene) statt Ablehnung möglich." },
    { titel: "Kleinsterzeugungsanlagen", text: "Anlagen unter 800 W (Balkon-PV) sind dem Netzbetreiber nur zu melden (§ 6 Abs. 1 Z 78 ElWG)." },
  ],
  quellen: [
    { label: "RIS – BGBl. I Nr. 91/2025 (ElWG)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html" },
    { label: "Parlament – Günstiger-Strom-Gesetz (312 d.B.)", url: "https://www.parlament.gv.at/gegenstand/XXVIII/I/312" },
    { label: "BMWET – Factsheet Spitzenkappung", url: "https://www.bmwet.gv.at/dam/jcr:260fda60-c745-4861-bdcb-1c1223a4af58/ElWG-Factsheets_Spitzenkappung_final%20final.pdf" },
    { label: "Koordinationsstelle – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/" },
  ],
};

/** Netzzutrittsentgelt für Erzeuger auf Netzebene 3–7 (SNE-V 2018 idF Novelle 2026). */
export const NETZZUTRITT = {
  stufen: [
    { leistung: "bis 20 kW", entgelt: "10 €/kW" },
    { leistung: "21–250 kW", entgelt: "15 €/kW" },
    { leistung: "darüber (gestaffelt)", entgelt: "35, 50 bzw. 70 €/kW" },
  ],
  quelle: { label: "E-Control – SNE-V 2018, Novelle 2026", url: "https://www.e-control.at/documents/1785851/0/SNE+01_25+SNE-V+2018+Novelle+2026+Begutachtung+REK.pdf" },
};
