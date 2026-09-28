// src/components/Forderungen/Shared/bund.js
//
// Bundesweite Förder-, Steuer- und Rechtsdaten Österreich für die Förder- und
// Rechtsseiten sowie den Förder-Check. Stand zentral über STAND aus
// @/data/bundeslaender. Jede Angabe mit Quelle; Unsicheres ist mit
// `pruefen: true` markiert.

import { STAND } from "@/data/bundeslaender";

export { STAND };

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
    { nr: 1, zeitraum: "23.04.–11.05.2026", budget: { A: "5 Mio. €", B: "5 Mio. €", C: "15 Mio. €", D: "15 Mio. €" }, summe: "40 Mio. €", status: "abgeschlossen" },
    { nr: 2, zeitraum: "16.06.–30.06.2026", budget: { A: "2 Mio. €", B: "2 Mio. €", C: "4 Mio. €", D: "4 Mio. €" }, summe: "12 Mio. €", status: "abgeschlossen" },
    { nr: 3, zeitraum: "08.10.–22.10.2026", budget: { A: "2 Mio. €", B: "2 Mio. €", C: "2 Mio. €", D: "2 Mio. €" }, summe: "8 Mio. €", status: "nächster Call" },
  ],
  naechsterCall: { zeitraum: "08.10.–22.10.2026", start: "2026-10-08", hinweis: "Ticketziehung für Kategorie A und B am 08.10.2026 um 17 Uhr" },
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
  ],
};

// ---------------------------------------------------------------------------
// EAG-Marktprämie PV (Ausschreibung, EAG-Marktprämienverordnung idF BGBl. II Nr. 13/2026)
// ---------------------------------------------------------------------------

export const MARKTPRAEMIE = {
  text: "Neue oder erweiterte PV-Anlagen über 10 kWp können statt des Investitionszuschusses eine Marktprämie über 20 Jahre erhalten. Sie gleicht die Differenz zwischen dem in der Ausschreibung gebotenen Wert und dem Referenzmarktwert aus.",
  termine: [
    { datum: "17.03.2026", volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "bezuschlagt" },
    { datum: "11.06.2026", volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "bezuschlagt am 10.07.2026, Zuschläge bis 6,69 ct/kWh" },
    { datum: "24.09.2026", volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "Gebotsfrist abgelaufen" },
    { datum: "10.12.2026", volumen: "175.000 kWp", hoechstpreis: "7,77 ct/kWh", status: "nächster Gebotstermin" },
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
    ["Jänner", "8,842"], ["Februar", "8,457"], ["März", "5,720"], ["April", "6,772"], ["Mai", "6,772"], ["Juni", "6,772"], ["Juli", "6,146"], ["August", "8,997"],
  ],
  hinweis: "Der Septemberwert wird Anfang Oktober veröffentlicht. Abzug für Ausgleichsenergie PV 2026: 0,408 ct/kWh.",
  quelle: { label: "OeMAG – Marktpreis", url: "https://www.oem-ag.at/marktpreis" },
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
    status: "Einreichfrist verlängert bis 30.09.2026, 12 Uhr",
    pruefen: true,
    url: "https://www.klimafonds.gv.at/foerderung/energiegemeinschaften-2025/",
  },
  {
    id: "flex",
    name: "Energiemanagement – Flexibilisierung im Verteilnetz",
    traeger: "Klima- und Energiefonds / KPC",
    zielgruppen: ["unternehmen", "gemeinde"],
    themen: ["speicher", "laden", "waermepumpe"],
    hoehe: "Förderhöhe laut Leitfaden",
    was: "automatisierte Energiemanagementsysteme für Betriebe, Gemeinden und Vereine an Netzebene 6/7; 5 Jahre Betriebspflicht",
    status: "Einreichung 23.06.2026 – 15.04.2027",
    pruefen: true,
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
    status: "Einreichung bis 30.09.2026",
    pruefen: true,
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
    max: 1_000_000,
    norm: "§ 11 EStG, § 124b Z 480 EStG (BGBl. I Nr. 79/2025); Öko-IFB-VO BGBl. II Nr. 155/2023",
  },
  gfb: { grund: "15 % des Gewinns bis 33.000 € (max. 4.950 €), ohne Investition", invest: "13 % für Gewinnteile über 33.000 €, insgesamt max. 46.400 € je Jahr", norm: "§ 10 EStG" },
  afa: { nd: 20, degressiv: 30, norm: "§ 7 EStG, EStR 2000; PV-Erlass BMF 30.07.2025" },
  ust: "20 % Umsatzsteuer – der 0-%-Satz für PV bis 35 kWp (§ 28 Abs. 62 UStG) endete mit 31.03.2025 (Altverträge bis 06.03.2025: Lieferung bis 31.12.2025).",
  kleinunternehmer: "55.000 € Bruttoumsatz (§ 6 Abs. 1 Z 27 UStG, seit 01.01.2025), 10 % Toleranz",
  einspeisungPrivat: "Einspeiseerlöse bis 12.500 kWh je Person und Jahr steuerfrei, wenn die Anlage max. 35 kWp Engpass- und 25 kW Anschlussleistung hat (§ 3 Abs. 1 Z 39 EStG)",
  elektrizitaetsabgabe: "Selbst erzeugter und verbrauchter Strom aus Erneuerbaren ist unbegrenzt befreit (§ 2 Abs. 1 Z 4 ElAbgG) – Anzeige beim Finanzamt nötig; Einspeisung ist nicht steuerbar.",
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
    { datum: "24.12.2025", text: "Inkrafttreten der Grundregeln, u. a. Netzanschluss bis 20 kW auf Anzeige (§ 96)" },
    { datum: "01.04.2026", text: "Sozialtarif" },
    { datum: "01.10.2026", text: "Energiegemeinschaften im neuen Regime, Peer-to-Peer-Verträge, Eigenversorgungsanlagen" },
    { datum: "01.01.2027", text: "neue Systemnutzungsentgelte, Infrastrukturbeitrag für Einspeiser (max. 0,05 ct/kWh, Anlagen bis 20 kW befreit), neue EEG-Reduktionssätze" },
  ],
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
