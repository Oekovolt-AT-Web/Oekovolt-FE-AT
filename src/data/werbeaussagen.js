// src/data/werbeaussagen.js
//
// Belegakte / Register der Werbeaussagen (UWG § 2: irreführende Geschäftspraktiken; Alleinstellungs-
// und Spitzenstellungsbehauptungen nur mit Beleg). Jede werbliche Aussage, die auf der Website
// erscheint, braucht hier einen Eintrag – mit Beleg, Quelle, Stand und der Person, die freigegeben hat.
//
// Felder je Eintrag:
//   id              kurz, klein, Bindestriche
//   text            die Aussage, wie sie (sinngemäß) auf der Website steht
//   fundstellen[]   Dateien unter src/, in denen die Aussage stehen darf (relativ zum Projekt)
//   beleg           Was den Beleg erbringt (Dokument, Register, Urkunde) – null = kein Beleg
//   quelle          Wo der Beleg liegt (URL oder Pfad) – "" = liegt nicht vor
//   stand           Datum der letzten Prüfung (JJJJ-MM-TT)
//   freigegeben_von Person/Rolle, die die Aussage freigegeben hat – "" = niemand
//   art             "eigen" (eigene Aussage) | "fremdzitat" (Zitat/Aussage Dritter, braucht deren Freigabe)
//   freigegeben     Schalter: true = darf erscheinen; false = Standard AUS (Aussage bleibt verborgen)
//
// Prüfung: scripts/werbeaussagen.test.mjs durchsucht src/app, src/components, src/data und src/content
// nach Spitzenstellungs- und Umweltbegriffen. Eine Fundstelle ist erlaubt, wenn sie hier mit
// freigegeben:true und der Datei in fundstellen[] steht. Der Altbestand ist in
// scripts/werbeaussagen.baseline.json erfasst; der Test schlägt nur bei NEUEN Fundstellen fehl.
//
// Entscheidungen des Inhabers (05.10.2026, Auswahldialog): TOP 3, Meisterbetrieb-Siegel, eigener
// Parkregler und Kundenlogo im Hero-Video → KEIN Beleg genannt → Schalter AUS. Salzburg AG → neutral
// sachlich (Gesellschafterin), Werbeformulierungen AUS bis schriftliche Erlaubnis und Anwaltsfreigabe.

export const WERBEAUSSAGEN_STAND = "2026-10-11";

export const WERBEAUSSAGEN = [
  {
    id: "top3-epc-2021",
    text: "TOP 3 der EPC-Errichter Österreichs 2021",
    fundstellen: [],
    beleg: null, // Ranking-Quelle (Branchenstudie, Marktbericht) liegt nicht vor
    quelle: "",
    stand: "2026-10-11",
    freigegeben_von: "",
    art: "eigen",
    freigegeben: false,
  },
  {
    id: "marktfuehrer",
    text: "Marktführer / Nr. 1 / führender PV-Errichter",
    fundstellen: [],
    beleg: null,
    quelle: "",
    stand: "2026-10-11",
    freigegeben_von: "",
    art: "eigen",
    freigegeben: false,
  },
  {
    id: "meisterbetrieb-wko",
    text: "WKO-Gütesiegel Meisterbetrieb (Siegel im Hero)",
    fundstellen: [],
    beleg: null, // Verleihungsurkunde/Gütesiegel-Berechtigung nicht belegt; Mitgliedschaft in Kammer und Innung ist belegt (src/lib/site.js), das Siegel nicht
    quelle: "",
    stand: "2026-10-11",
    freigegeben_von: "",
    art: "eigen",
    freigegeben: false,
  },
  {
    id: "elektrotechnik-staatlich-geprueft",
    text: "Elektrotechnik – staatlich geprüft (Siegel im Hero)",
    fundstellen: [],
    beleg: null,
    quelle: "",
    stand: "2026-10-11",
    freigegeben_von: "",
    art: "eigen",
    freigegeben: false,
  },
  {
    id: "eigener-parkregler",
    text: "Eigener Parkregler / eigene SCADA (Nutzungsrechte an der Entwicklung mit Solensa)",
    fundstellen: [],
    beleg: null, // Rechteklärung mit Solensa offen (PARKREGLER_RECHTE_GEKLAERT in src/data/marke.js)
    quelle: "",
    stand: "2026-10-11",
    freigegeben_von: "",
    art: "eigen",
    freigegeben: false,
  },
  {
    id: "kundenlogo-hero-video",
    text: "Hero-Video mit Werk und Logo eines Industriekunden",
    fundstellen: [],
    beleg: null, // Logo-/Veröffentlichungsfreigabe des Kunden (Referenz Freigabe, A07) liegt nicht vor
    quelle: "",
    stand: "2026-10-11",
    freigegeben_von: "",
    art: "fremdzitat",
    freigegeben: false,
  },
  {
    id: "salzburg-ag-bevorzugter-errichter",
    text: "Bevorzugter PV-Errichter des Salzburg AG Konzerns / Partnerschaft mit der Salzburg AG als Werbeargument",
    fundstellen: [],
    beleg: null, // schriftliche Erlaubnis der Salzburg AG und Anwaltsfreigabe fehlen
    quelle: "",
    stand: "2026-10-11",
    freigegeben_von: "",
    art: "fremdzitat",
    freigegeben: false,
  },
  {
    id: "salzburg-ag-gesellschafterin",
    text: "Gesellschafter: Salzburg AG für Energie, Verkehr und Telekommunikation (49 %) – neutral, ohne Wertung",
    fundstellen: ["src/lib/site.js", "src/components/Impressum/impressum.js", "src/app/uber-uns/page.js", "src/lib/llms.js", "src/data/marke.js", "src/app/presse/page.js"],
    beleg: "Firmenbuch FN 375708m (Landesgericht Ried im Innkreis), WKO Firmen A–Z, FirmenABC",
    quelle: "https://www.firmenabc.at/oekovolt-solartechnik-gmbh_OvcS",
    stand: "2026-09-28",
    freigegeben_von: "Inhaber (05.10.2026: neutral sachlich, Anwalt prüft)",
    art: "eigen",
    freigegeben: true,
  },
  {
    id: "gruender-betreiben",
    text: "Unsere Gründer betreiben seit 2012 selbst Solarparks.",
    fundstellen: ["src/data/marke.js", "src/data/hero.js", "src/data/unternehmen.js", "src/components/Startseite/S05Warum.js", "src/lib/llms.js", "src/app/uber-uns/team/page.js", "src/app/kommunen/page.js", "src/app/freiflaechen-photovoltaik/page.js", "src/app/landwirtschaft/page.js"],
    beleg: "Betreibergesellschaften der Gründer (z. B. Irsingen Solarstrom GmbH & Co. KG, 2013), Unternehmenskommunikation",
    quelle: "docs/AT-BRIEFING.md (Unternehmensfakten 09/2026)",
    stand: "2026-09-30",
    freigegeben_von: "Geschäftsführung Ökovolt Österreich (Briefing 09/2026)",
    art: "eigen",
    freigegeben: true,
  },
  {
    id: "ausstattung-eigene-leute",
    text: "Eigene Montageteams, eigener Lkw, eigene Traktoren.",
    fundstellen: ["src/data/marke.js", "src/data/mannschaft.js", "src/components/Startseite/S05Warum.js"],
    beleg: "Bestätigung des Auftraggebers (src/data/mannschaft.js, Kennzeichnung [AG])",
    quelle: "src/data/mannschaft.js",
    stand: "2026-09-30",
    freigegeben_von: "Auftraggeber",
    art: "eigen",
    freigegeben: true,
  },
  {
    id: "mitglied-pvb-austria",
    text: "Ordentliches Mitglied im Bundesverband Photovoltaic & Battery Austria",
    fundstellen: ["src/lib/site.js", "src/app/uber-uns/page.js", "src/app/presse/page.js", "src/data/marke.js"],
    beleg: "Mitgliederverzeichnis PV&B Austria, Abschnitt „Ordentliche Mitglieder“",
    quelle: "https://pvbaustria.at/mitglieder/",
    stand: "2026-09-30",
    freigegeben_von: "Redaktion (Verzeichnis geprüft 2026-09-30)",
    art: "eigen",
    freigegeben: true,
  },
  {
    id: "kennzahlen-gesamt",
    text: "5.000 PV-Anlagen errichtet, 510.000 kWp installierte Leistung – nur mit „Angaben Ökovolt Österreich · Stand …“",
    fundstellen: ["src/data/kennzahlen.js", "src/data/hero.js", "src/components/Startseite/S01Hero.js", "src/components/Startseite/S05Warum.js", "src/app/presse/page.js", "src/lib/llms.js", "src/data/tvSchauraum.js", "src/data/unternehmen.js"],
    beleg: "Angabe der Geschäftsführung (Chat 30.09.2026) – kein externer Beleg, deshalb immer mit Quellenhinweis und Stand",
    quelle: "src/data/kennzahlen.js (KENNZAHLEN_STAND)",
    stand: "2026-09-30",
    freigegeben_von: "Geschäftsführung Ökovolt Österreich",
    art: "eigen",
    freigegeben: true,
  },
  {
    id: "mwp-2021",
    text: "Allein 2021 rund 30 MWp PV-Leistung errichtet",
    fundstellen: ["src/data/unternehmen.js", "src/lib/llms.js", "src/app/uber-uns/page.js", "src/app/uber-uns/jobs/page.js", "src/app/produkte/photovoltaikanlage/page.js", "src/components/Startseite/S05Warum.js"],
    beleg: "Angabe der Geschäftsführung (docs/AT-BRIEFING.md) – eigene Zahl, keine Rangaussage",
    quelle: "docs/AT-BRIEFING.md",
    stand: "2026-09-30",
    freigegeben_von: "Geschäftsführung Ökovolt Österreich (Briefing 09/2026)",
    art: "eigen",
    freigegeben: true,
  },
];

/** Eintrag nach id – null, wenn unbekannt. */
export const werbeaussage = (id) => WERBEAUSSAGEN.find((w) => w.id === id) || null;

/** Darf die Aussage erscheinen? Nur mit Schalter UND Beleg UND Freigabe (alle drei). */
export const werbeaussageAktiv = (id) => {
  const w = werbeaussage(id);
  return Boolean(w && w.freigegeben === true && w.beleg && w.freigegeben_von);
};

/** Für Tests und Doku: alle Einträge, die derzeit AUS sind. */
export const werbeaussagenAus = () => WERBEAUSSAGEN.filter((w) => !werbeaussageAktiv(w.id));
