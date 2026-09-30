// src/data/kunden.js
//
// Kundendaten zu den Referenzprojekten – Stand/Quellen je Eintrag. Nur belegte Angaben.
//
// Schlüssel = Projekt-Slug (generateSlug(projekt_name), siehe src/data/projekte.js).
// Recherche am 30.09.2026 auf den offiziellen Websites der Unternehmen (Impressum, „Über uns“).
// - firma: Firmenwortlaut laut Impressum der Kunden-Website (Abweichungen zum Projektnamen sind gewollt).
// - social: nur Profile, die im Kopf-/Fußbereich der offiziellen Website verlinkt sind; sonst null.
// - portraet: in eigenen Worten, ausschließlich aus den eigenen Angaben der Unternehmen (quellen).
// - freigabe: immer false – Zitat und Logo dürfen erst nach Freigabe durch den Kunden gezeigt werden.
//
// Bewusst NICHT aufgenommen (keine eindeutige Zuordnung bzw. keine belegbare Quelle):
//   gs-altotec-gmbh, spar-ingrid-teufelberger, stahl-hacksteiner-metall-gmbh,
//   g-eins-immobilien-gmbh, fs-agrar-gmbh, astral-handelsgesellschaft-gmbh

export const KUNDEN_STAND = "2026-09-30";

const GEPRUEFT = "2026-09-30";

// Alle Netzwerke immer vorhanden (null = kein auf der Website verlinktes Profil).
const social = (profile = {}) => ({
  linkedin: null,
  instagram: null,
  facebook: null,
  youtube: null,
  xing: null,
  tiktok: null,
  x: null,
  ...profile,
});

export const KUNDEN = {
  "alpla-werke-alwin-lehner-gmbh-co-kg": {
    firma: "ALPLA Werke Alwin Lehner GmbH & Co KG",
    website: "https://www.alpla.com/de",
    social: social({
      linkedin: "https://www.linkedin.com/company/110410/",
      instagram: "https://www.instagram.com/ALPLAGroup/",
      facebook: "https://www.facebook.com/ALPLA-Group-2327667407514858/",
      youtube: "https://www.youtube.com/user/ALPLApackaging",
      xing: "https://www.xing.com/companies/alplawerke-alwinlehnergmbh%26cokg",
      x: "https://twitter.com/ALPLApackaging",
    }),
    branche: "Kunststoffverpackungen",
    ort: "Hard, Vorarlberg",
    portraet:
      "ALPLA entwickelt und produziert Verpackungen aus Kunststoff – vor allem Hohlkörper und Verschlusssysteme – für Getränke, Lebensmittel, Kosmetik, Haushaltspflege und Arzneimittel. Das 1955 von den Brüdern Helmuth und Alwin Lehner gegründete Familienunternehmen hat seinen Hauptsitz in Hard und ist heute in 45 Ländern tätig.",
    quellen: [
      { titel: "Impressum – ALPLA", url: "https://www.alpla.com/de/site-notice" },
      { titel: "Daten & Fakten – ALPLA", url: "https://www.alpla.com/de/unternehmen/daten-fakten" },
      { titel: "Unternehmen – ALPLA", url: "https://www.alpla.com/de/unternehmen" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "aumayr-gmbh": {
    firma: "Aumayr GmbH",
    website: "https://www.aumayr.com/",
    social: social(),
    branche: "Lüftungs- und Metalltechnik",
    ort: "Steyregg, Oberösterreich",
    portraet:
      "Die Aumayr GmbH aus Steyregg ist seit ihrer Gründung auf Lüftungs- und Metalltechnik spezialisiert. Mit rund 230 Mitarbeiterinnen und Mitarbeitern ist das Unternehmen in ganz Österreich und in den Nachbarländern tätig, vor allem im deutschsprachigen Raum.",
    quellen: [
      { titel: "Impressum – Aumayr GmbH", url: "https://www.aumayr.com/impressum/" },
      { titel: "Unternehmen – Aumayr GmbH", url: "https://www.aumayr.com/unternehmen/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "andritz-fabrics-and-rolls-gmbh": {
    firma: "ANDRITZ Fabrics and Rolls GmbH",
    website: "https://www.andritz.com/",
    social: social({
      linkedin: "https://www.linkedin.com/company/andritz/",
      youtube: "https://www.youtube.com/@ANDRITZGROUP",
      x: "https://twitter.com/andritz",
    }),
    branche: "Papiermaschinenbespannungen und Walzentechnik",
    ort: "Gloggnitz, Niederösterreich",
    portraet:
      "Die ANDRITZ Fabrics and Rolls GmbH gehört zum internationalen Technologiekonzern ANDRITZ mit Sitz in Graz. Der Bereich Fabrics and Rolls liefert Bespannungen für Papiermaschinen – etwa Pressfilze und Trockensiebe – sowie Walzenbezüge und Walzenservice und vereint die Erfahrung traditionsreicher Marken wie Huyck, Kufferath, Stowe-Woodward und Weavexx.",
    quellen: [
      { titel: "Fabrics and Rolls – ANDRITZ", url: "https://www.andritz.com/pulp-and-paper-en/global-services/paper-mill-service/fabrics-and-rolls" },
      { titel: "Imprint – ANDRITZ", url: "https://www.andritz.com/group-en/privacy-declaration/imprint" },
      { titel: "Firmen A–Z (WKO) – ANDRITZ Fabrics and Rolls GmbH", url: "https://firmen.wko.at/andritz-fabrics-and-rolls-gmbh-andritz-fabrics-and-rolls-gmbh/nieder%C3%B6sterreich/?firmaid=e1c7ae00-4c57-430a-aafd-683940e44095" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "austria-card-plastikkarten-und-ausweissysteme-gmbh": {
    firma: "AUSTRIA CARD-Plastikkarten und Ausweissysteme Gesellschaft m.b.H.",
    website: "https://www.austriacard.com/",
    social: social({
      linkedin: "https://at.linkedin.com/company/austria-card",
    }),
    branche: "Karten, Identifikations- und Zahlungslösungen",
    ort: "Wien",
    portraet:
      "Die AUSTRIA CARD-Plastikkarten und Ausweissysteme Gesellschaft m.b.H. mit Sitz in Wien gehört zur AUSTRIACARD HOLDINGS AG. Die Gruppe stützt sich auf mehr als 130 Jahre Erfahrung in Informationsmanagement, Druck und Kommunikation und bietet unter anderem Zahlungs- und Identifikationslösungen, Smartcards, Kartenpersonalisierung, Digitalisierung und sicheres Datenmanagement.",
    quellen: [
      { titel: "Imprint – AUSTRIACARD", url: "https://www.austriacard.com/imprint/" },
      { titel: "AUSTRIACARD – Startseite", url: "https://www.austriacard.com/" },
      { titel: "History – AUSTRIACARD", url: "https://www.austriacard.com/company/history/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "br-industrial-automation-gmbh": {
    firma: "B&R Industrial Automation GmbH",
    website: "https://www.br-automation.com/de/",
    social: social({
      linkedin: "https://www.linkedin.com/company/b&r-industrial-automation",
      instagram: "https://www.instagram.com/brautomation/",
      youtube: "https://www.youtube.com/berneckerrainer",
    }),
    branche: "Industrieautomation",
    ort: "Eggelsberg, Oberösterreich",
    portraet:
      "B&R Industrial Automation entwickelt und fertigt Automatisierungstechnik für Maschinen und Fabriken. Das 1979 von Erwin Bernecker und Josef Rainer gegründete Unternehmen hat seinen Hauptsitz in Eggelsberg und ist heute das weltweite Zentrum für Maschinen- und Fabrikautomation innerhalb des ABB-Konzerns.",
    quellen: [
      { titel: "Über uns – B&R", url: "https://www.br-automation.com/de/ueber-uns/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "dmh-dichtungs-maschinenhandel-gmbh-sampo-gmbh": {
    firma: "DMH Dichtungs- und Maschinenhandel GmbH",
    website: "https://www.dmh-seals.com/",
    social: social({
      linkedin: "https://www.linkedin.com/company/dmh-seals/",
      youtube: "https://www.youtube.com/channel/UClvET3XGtigbvK2PnLx1wjg",
    }),
    branche: "Dichtungstechnik und Maschinen für die Dichtungsfertigung",
    ort: "Traboch, Steiermark",
    portraet:
      "Die DMH Dichtungs- und Maschinenhandel GmbH im Industriepark West in Traboch bietet Dichtungen, Halbzeuge, Bauteile sowie Maschinen für die Dichtungsfertigung an. Seit Oktober 2025 gehört die DMH-Gruppe zur Freudenberg-Gruppe; das operative Geschäft läuft unverändert weiter. Im selben Industriepark entwickelt und fertigt die Sampo GmbH Werkstoffe und Spritzgussteile aus thermoplastischem Polyurethan (TPU).",
    quellen: [
      { titel: "Imprint – DMH", url: "https://www.dmh-seals.com/en/imprint" },
      { titel: "Unternehmen – DMH", url: "https://www.dmh-seals.com/de/unternehmen" },
      { titel: "Sampo GmbH – Startseite", url: "https://sampo.at/" },
      { titel: "Impressum – Sampo GmbH", url: "https://sampo.at/impressum/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "f-list-gmbh": {
    firma: "F. LIST GMBH",
    website: "https://f-list.at/",
    social: social({
      linkedin: "https://at.linkedin.com/company/f-list-gmbh",
      instagram: "https://www.instagram.com/flist_interiors/",
      facebook: "https://www.facebook.com/F.LISTGMBH/",
      youtube: "https://www.youtube.com/channel/UCGbp9kTeqb8qjzpZrMltiZw",
    }),
    branche: "Innenausstattung für Business- und Privatjets sowie Residenzen",
    ort: "Thomasberg, Niederösterreich",
    portraet:
      "F/LIST fertigt hochwertige Innenausstattungen für Business- und Privatjets sowie für Residenzen. Das Familienunternehmen ist als kleine Tischlerei im südlichen Niederösterreich entstanden, wird in dritter Generation geführt und beschäftigt heute mehr als 1.200 Mitarbeiterinnen und Mitarbeiter aus 28 Nationen.",
    quellen: [
      { titel: "Impressum – F/LIST", url: "https://f-list.at/impressum/" },
      { titel: "Über uns – F/LIST", url: "https://f-list.at/ueber-uns/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "haba-beton-johann-bartlechner-gmbh-co-kg": {
    firma: "Johann Bartlechner GmbH & Co. KG (HABA-Beton)",
    website: "https://www.haba-beton.com/at/",
    social: social({
      linkedin: "https://www.linkedin.com/company/haba-beton",
      instagram: "https://www.instagram.com/haba_beton/",
      facebook: "https://www.facebook.com/hababeton/",
      youtube: "https://www.youtube.com/channel/UCVxSAXH1foCIjWTKkMW7Wow",
    }),
    branche: "Betonrohre und Schachtsysteme für den Tiefbau",
    ort: "Nußdorf ob der Traisen, Niederösterreich (Werk)",
    portraet:
      "HABA-Beton ist ein Familienunternehmen aus Oberbayern, das in vierter Generation Rohre, Schachtsysteme, monolithische Behälter und Umwelttechnik aus Beton und Stahlbeton herstellt. Rund 400 Mitarbeiterinnen und Mitarbeiter arbeiten an zehn Produktionsstandorten; in Österreich produziert die Johann Bartlechner GmbH & Co. KG im Werk Nußdorf ob der Traisen.",
    quellen: [
      { titel: "Firmenprofil – HABA-Beton Österreich", url: "https://www.haba-beton.com/at/firmenprofil" },
      { titel: "Standort Nußdorf – HABA-Beton Österreich", url: "https://www.haba-beton.com/at/standorte" },
      { titel: "Impressum – HABA-Beton", url: "https://www.haba-beton.com/at/impressum" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "herba-chemosan-apotheker-ag": {
    firma: "Herba Chemosan Apotheker-AG",
    website: "https://www.herba-chemosan.at/",
    social: social({
      linkedin: "https://at.linkedin.com/company/herba-chemosan-apotheker-ag",
      instagram: "https://www.instagram.com/herba_chemosan/",
      facebook: "https://www.facebook.com/herbachemosan",
    }),
    branche: "Pharmagroßhandel",
    ort: "Wien",
    portraet:
      "Die 1916 gegründete Herba Chemosan Apotheker-AG ist nach eigenen Angaben mit einem Marktanteil von rund 45 % der führende vollsortierte Pharmagroßhändler Österreichs und beliefert mehr als 90 % der heimischen Apotheken. Über sieben Logistikzentren gelangen Arzneimittel und Gesundheitsprodukte von über 1.000 Herstellern täglich in die Apotheken.",
    quellen: [
      { titel: "Unternehmen – Herba Chemosan", url: "https://www.herba-chemosan.at/unternehmen/" },
      { titel: "Impressum – Herba Chemosan", url: "https://www.herba-chemosan.at/impressum/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "herbert-handlos-gmbh-pregarten": {
    firma: "Herbert Handlos Gesellschaft m.b.H.",
    website: "https://www.handlos.at/de/",
    social: social(),
    branche: "Holzindustrie",
    ort: "Tragwein, Oberösterreich (Firmensitz)",
    portraet:
      "Die Herbert Handlos Gesellschaft m.b.H. ist ein Mühlviertler Traditionsbetrieb der Holzindustrie, dessen Geschichte bis 1818 zurückreicht, und verarbeitet den Rohstoff Holz zu Baumaterial. Heute arbeiten mehr als 100 Menschen an drei Standorten; einen Großteil seines Strombedarfs deckt das Unternehmen nach eigenen Angaben mit einer eigenen Photovoltaikanlage.",
    quellen: [
      { titel: "Impressum – Holzindustrie Herbert Handlos", url: "https://www.handlos.at/de/Impressum" },
      { titel: "Geschichte – Holzindustrie Herbert Handlos", url: "https://www.handlos.at/de/unternehmen/geschichte.html" },
      { titel: "Standorte – Holzindustrie Herbert Handlos", url: "https://www.handlos.at/de/unternehmen/standorte.html" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "herbert-handlos-gmbh-summerau": {
    firma: "Herbert Handlos Gesellschaft m.b.H.",
    website: "https://www.handlos.at/de/",
    social: social(),
    branche: "Holzindustrie",
    ort: "Tragwein, Oberösterreich (Firmensitz)",
    portraet:
      "Die Herbert Handlos Gesellschaft m.b.H. ist ein Mühlviertler Traditionsbetrieb der Holzindustrie, dessen Geschichte bis 1818 zurückreicht, und verarbeitet den Rohstoff Holz zu Baumaterial. Heute arbeiten mehr als 100 Menschen an drei Standorten; einen Großteil seines Strombedarfs deckt das Unternehmen nach eigenen Angaben mit einer eigenen Photovoltaikanlage.",
    quellen: [
      { titel: "Impressum – Holzindustrie Herbert Handlos", url: "https://www.handlos.at/de/Impressum" },
      { titel: "Geschichte – Holzindustrie Herbert Handlos", url: "https://www.handlos.at/de/unternehmen/geschichte.html" },
      { titel: "Standorte – Holzindustrie Herbert Handlos", url: "https://www.handlos.at/de/unternehmen/standorte.html" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "holz-reisecker-gmbh": {
    firma: "Holz-Reisecker GmbH & Co. KG",
    website: "https://www.holz-reisecker.at/",
    social: social({
      linkedin: "https://www.linkedin.com/company/holz-reisecker-gmbh-co-kg/",
      instagram: "https://www.instagram.com/holz_reisecker/",
      facebook: "https://www.facebook.com/holzreisecker",
    }),
    branche: "Säge- und Hobelwerk",
    ort: "Roßbach, Oberösterreich",
    portraet:
      "Das 1900 gegründete Sägewerk Reisecker in Roßbach wird in fünfter Generation von der Familie Reisecker geführt. Mit Säge-, Hobel- und KVH-Werk verarbeitet das Unternehmen vor allem Fichte, Tanne und Lärche aus dem Kobernaußerwald und aus Bayern zu Bauholz, Konstruktionsvollholz, Hobelware und Spezialprofilen.",
    quellen: [
      { titel: "Über uns – Holz Reisecker", url: "https://www.holz-reisecker.at/unternehmen/ueber-uns" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "nemetz-fleischhandels-gmbh": {
    firma: "NEMETZ-FLEISCH HandelsgmbH",
    website: "https://www.nemetz-fleisch.at/",
    social: social({
      instagram: "https://www.instagram.com/nemetz.fleisch/",
      facebook: "https://www.facebook.com/nemetzmarkt",
    }),
    branche: "Fleischhandel",
    ort: "Böheimkirchen, Niederösterreich",
    portraet:
      "NEMETZ-FLEISCH aus Böheimkirchen blickt auf eine Geschichte seit 1876 zurück und beliefert Gastronomie und Hotellerie mit Fleisch. Für private Kundinnen und Kunden gibt es zehn NEMETZ-Märkte in Österreich; zur Unternehmenswelt zählen außerdem Hundefutter der Marke NEMETZ-DOGS sowie ein Restaurant und Motels.",
    quellen: [
      { titel: "Impressum – NEMETZ-FLEISCH", url: "https://www.nemetz-fleisch.at/ueber_uns/impressum.html" },
      { titel: "Über uns – NEMETZ-FLEISCH", url: "https://www.nemetz-fleisch.at/ueber_uns/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "neuschmied-holz-gmbh": {
    firma: "Neuschmied Holz GmbH",
    website: "https://www.neuschmied.at/",
    social: social(),
    branche: "Säge- und Hobelwerk",
    ort: "Hopfgarten im Brixental, Tirol",
    portraet:
      "Die Neuschmied Holz GmbH in Hopfgarten ist ein Tiroler Familienbetrieb der Holzverarbeitung mit langer Tradition. Mit einer modernen Kreissägeanlage, zwei Hobellinien und zwölf Trockenkammern verarbeitet das Unternehmen Tiroler Baumstämme zu Schnitt- und Hobelware.",
    quellen: [
      { titel: "Impressum – Neuschmied", url: "https://www.neuschmied.at/impressum/" },
      { titel: "Über uns – Neuschmied", url: "https://www.neuschmied.at/unternehmen/ueber-uns/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "penn-gmbh": {
    firma: "PENN GmbH",
    website: "https://www.penn.at/",
    social: social({
      linkedin: "https://at.linkedin.com/company/penngmbh",
      instagram: "https://www.instagram.com/penngmbh/",
      facebook: "https://www.facebook.com/PennGmbH",
      youtube: "https://www.youtube.com/@penngmbh",
    }),
    branche: "Stahlprodukte und Metallbearbeitung",
    ort: "Senftenberg-Imbach, Niederösterreich",
    portraet:
      "Die PENN GmbH geht auf ein 1859 in Hohenstein gegründetes Stammhaus zurück und hat ihren Sitz in Senftenberg-Imbach. Das mittelständische Unternehmen fertigt Stahlprodukte in Klein- und Mittelserien ebenso wie in hochindustrialisierten Großserien, unter anderem für Automobil-, Bau-, Nutzfahrzeug-, Landwirtschafts- und Bahnbranche, und ist nach ISO 9001, ISO 14001 und IATF 16949 zertifiziert.",
    quellen: [
      { titel: "Impressum – PENN GmbH", url: "https://www.penn.at/impressum" },
      { titel: "Unternehmen – PENN GmbH", url: "https://www.penn.at/unternehmen" },
      { titel: "PENN GmbH – Startseite", url: "https://www.penn.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "saege-hobelwerk-soellinger-gesmbh": {
    firma: "Söllinger GmbH",
    website: "https://www.saegewerk-soellinger.at/",
    social: social(),
    branche: "Säge- und Hobelwerk",
    ort: "Straßwalchen, Salzburg",
    portraet:
      "Das Säge- und Hobelwerk Söllinger in Straßwalchen ist ein regional verwurzeltes Sägewerk, das Stammholz zu Schnitt- und Hobelware für Zimmereien, Architekturbüros und private Bauherren verarbeitet. Nachhaltigkeit, persönliche Beziehungen zu Wäldern und Lieferanten sowie Handschlagqualität prägen nach eigener Darstellung den Betrieb.",
    quellen: [
      { titel: "Impressum – Söllinger Holz", url: "https://www.saegewerk-soellinger.at/impressum/" },
      { titel: "Söllinger Holz – Startseite", url: "https://www.saegewerk-soellinger.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "sp-verpackungen-gmbh": {
    firma: "SP-Verpackungen GmbH",
    website: "https://www.sp-verpackungen.at/",
    social: social({
      instagram: "https://www.instagram.com/spverpackungen/",
      facebook: "https://www.facebook.com/SPVerpackungen/",
      youtube: "https://www.youtube.com/channel/UCZzUi0mWUPvQh2ti7AX8HCQ",
    }),
    branche: "Verpackungen aus Karton und Wellpappe",
    ort: "Nußbach, Oberösterreich",
    portraet:
      "Die SP-Verpackungen GmbH in Nußbach entwickelt und produziert individuelle Verpackungen aus Karton und Wellpappe – von Versand- und E-Commerce-Kartons über Faltschachteln bis zu Thekendisplays – für Industrie, Handel und Onlineshops. 2025 hat das Unternehmen seine Produktion um einen Energiespeicher ergänzt.",
    quellen: [
      { titel: "Impressum – SP-Verpackungen", url: "https://www.sp-verpackungen.at/impressum" },
      { titel: "Über uns – SP-Verpackungen", url: "https://www.sp-verpackungen.at/ueber-uns" },
      { titel: "SP-Verpackungen – Startseite", url: "https://www.sp-verpackungen.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "sporthotel-brixen-gmbh-co-kg": {
    firma: "Sporthotel Brixen Gesmbh & Co KG",
    website: "https://www.vital-sporthotel.at/",
    social: social({
      instagram: "https://www.instagram.com/vital_und_sport_hotel_brixen/",
      facebook: "https://www.facebook.com/vital.sporthotel",
      youtube: "https://www.youtube.com/c/VitalSporthotelBrixen",
    }),
    branche: "Hotellerie",
    ort: "Brixen im Thale, Tirol",
    portraet:
      "Das Vital- & Sporthotel Brixen ist ein Vier-Sterne-Hotel in Brixen im Thale in den Kitzbüheler Alpen. Schwerpunkte sind ein ganzjähriges Tennisangebot mit elf Plätzen, der Wellnessbereich SPA VITAL und Winterurlaub in den nahe gelegenen Skigebieten.",
    quellen: [
      { titel: "Impressum – Vital- & Sporthotel Brixen", url: "https://www.vital-sporthotel.at/de/impressum.php" },
      { titel: "Vital- & Sporthotel Brixen – Startseite", url: "https://www.vital-sporthotel.at/de/index.php" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "stallinger-holding-gmbh": {
    firma: "Stallinger Holding GmbH",
    website: "https://www.stallinger.at/",
    social: social({
      instagram: "https://www.instagram.com/stallinger_holding/",
      facebook: "https://www.facebook.com/profile.php?id=61566023632350",
    }),
    branche: "Holzindustrie, Pellets, Energie und Immobilien",
    ort: "St. Georgen im Attergau, Oberösterreich",
    portraet:
      "Die Stallinger Holding GmbH mit Sitz in St. Georgen im Attergau bündelt Aktivitäten in Holzindustrie, natürlichen Brennstoffen wie Pellets, erneuerbarer Energie und Immobilienprojekten. Das 1699 erstmals urkundlich erwähnte Unternehmen ist in Österreich und international tätig und verbindet nach eigenem Anspruch Ökonomie, Ökologie und Innovation.",
    quellen: [
      { titel: "Impressum – Stallinger Holding", url: "https://www.stallinger.at/impressum" },
      { titel: "Stallinger – Startseite", url: "https://www.stallinger.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "stauss-perlite-gmbh": {
    firma: "Stauss-Perlite GmbH",
    website: "https://www.stauss-perlite.at/",
    social: social(),
    branche: "Mineralische Baustoffe und Dämmstoffe",
    ort: "St. Pölten, Niederösterreich",
    portraet:
      "Die Stauss-Perlite GmbH ist seit rund 100 Jahren in St. Pölten verwurzelt und auf mineralische Baustoffe spezialisiert. Das Angebot reicht von unbrennbaren Dämmstoffen, stauss®-Putzträgern und Fassadensystemen über mineralische Bodenhilfsstoffe und Chemikalienbinder bis zum Anlagenbau; beliefert werden Handel und Industrie vor allem in Österreich, Deutschland und der Schweiz.",
    quellen: [
      { titel: "Impressum – Stauss-Perlite", url: "https://www.stauss-perlite.at/impressum" },
      { titel: "Stauss-Perlite – Startseite", url: "https://www.stauss-perlite.at/" },
      { titel: "Über uns – Stauss-Perlite", url: "https://www.stauss-perlite.at/unternehmen/ueber-uns" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "steinbacher-daemmstoff-gmbh": {
    firma: "Steinbacher Dämmstoff GmbH",
    website: "https://www.steinbacher.at/",
    social: social({
      linkedin: "https://at.linkedin.com/company/steinbacher-daemmstoff-gmbh",
      instagram: "https://www.instagram.com/steinbacher_daemmstoffe/",
      facebook: "https://facebook.com/Steinbacher.Daemmstoffe",
    }),
    branche: "Dämmstoffe",
    ort: "Erpfendorf, Tirol",
    portraet:
      "Die Steinbacher Dämmstoff GmbH ist ein 1962 gegründetes, regional verankertes Familienunternehmen mit Sitz in Erpfendorf. Sie erzeugt unter anderem Dämmstoffe aus Polyurethan- und Polyethylen-Schaum und bietet Lösungen für den Hochbau und die technische Rohrisolierung aus einer Hand.",
    quellen: [
      { titel: "Impressum – Steinbacher", url: "https://www.steinbacher.at/impressum/" },
      { titel: "Unternehmen – Steinbacher", url: "https://www.steinbacher.at/unternehmen/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "thermoplastkreislauf-gmbh": {
    firma: "Thermoplastkreislauf GmbH",
    website: "https://www.windtpk.at/",
    social: social({
      youtube: "https://www.youtube.com/channel/UCBtBu9SQf0SFKJr-RRHSYdg",
    }),
    branche: "Kunststoff-Compoundierung und Regranulate",
    ort: "Traiskirchen, Niederösterreich",
    portraet:
      "Die Thermoplastkreislauf GmbH tritt gemeinsam mit der Wind GmbH unter der Marke WIND TPK auf und hat ihren Standort in Traiskirchen. Das Unternehmen entwickelt individuelle Thermoplaste und stellt Compounds und Regranulate her, die genau auf die Anforderungen der Kundinnen und Kunden abgestimmt sind.",
    quellen: [
      { titel: "Impressum – WIND TPK", url: "https://www.windtpk.at/impressum/" },
      { titel: "Unternehmen – WIND TPK", url: "https://www.windtpk.at/unternehmen/" },
      { titel: "WIND TPK – Startseite", url: "https://www.windtpk.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "tomandl-gattinger-gesellschaft-mbh-cokg": {
    firma: "Tomandl & Gattinger GmbH & Co. KG",
    website: "https://www.toga.at/",
    social: social(),
    branche: "Industrieanlagenbau, Stahl- und Blechbearbeitung",
    ort: "Regau, Oberösterreich",
    portraet:
      "Tomandl & Gattinger aus Regau startete 1978 als Fünf-Mann-Betrieb im Industrie- und Anlagenbau. Heute betreut das Unternehmen Betreiber von Industrieanlagen in Österreich und den Nachbarländern mit Wartung und Reparatur, Beschichtungstechnik und Maschinendiagnose sowie mit Stahl- und Blechbearbeitung vom Einzelstück bis zur Serie.",
    quellen: [
      { titel: "Impressum – Tomandl & Gattinger", url: "https://www.toga.at/impressum.html" },
      { titel: "Unternehmen – Tomandl & Gattinger", url: "https://www.toga.at/unternehmen.html" },
      { titel: "Stahl- und Blechbearbeitung – Tomandl & Gattinger", url: "https://www.toga.at/stahlbearbeitung-blechbearbeitung.html" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "transdanubia-speditionsgesellschaft-mbh-pasching": {
    firma: "TRANSDANUBIA Speditionsgesellschaft m.b.H.",
    website: "https://www.transdanubia.com/",
    social: social(),
    branche: "Spedition und Logistik",
    ort: "Pasching, Oberösterreich (Standort); Firmensitz Guntramsdorf",
    portraet:
      "TRANSDANUBIA wurde 1965 in Wien als Spedition für anspruchsvolle Ferntransporte gegründet und übersiedelte 1971 nach Pasching in Oberösterreich. Seither hat sich das Unternehmen zu einem europäischen Supply-Chain-Spezialisten mit breitem Leistungsportfolio entwickelt, der nach eigenen Angaben auf eine zu 100 % nachhaltige Energieversorgung setzt.",
    quellen: [
      { titel: "Impressum – TRANSDANUBIA", url: "https://www.transdanubia.com/impressum" },
      { titel: "Geschichte – TRANSDANUBIA", url: "https://www.transdanubia.com/unternehmen/geschichte" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "wieser-holz-gmbh": {
    firma: "WIESERHOLZ GmbH",
    website: "https://www.wieserholz.at/wieserholz/",
    social: social(),
    branche: "Paletten, Kisten und Verpackungen aus Holz",
    ort: "Seitenstetten, Niederösterreich",
    portraet:
      "WIESERHOLZ in Seitenstetten produziert Paletten und Verpackungslösungen aus Holz für die Industrie und die internationale Transportwirtschaft. Gefertigt wird individuell auf modernen Fertigungslinien; zum Sortiment zählen außerdem Kisten und Schnittholz.",
    quellen: [
      { titel: "Impressum – WIESERHOLZ", url: "https://www.wieserholz.at/wieserholz/impressum/" },
      { titel: "WIESERHOLZ – Startseite", url: "https://www.wieserholz.at/wieserholz/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "wuerth-handelsgesmbh": {
    firma: "Würth Handelsges.m.b.H.",
    website: "https://www.wuerth.at/",
    social: social({
      linkedin: "https://www.linkedin.com/company/wuerth-oesterreich",
      instagram: "https://www.instagram.com/wuerthaustria",
      facebook: "https://www.facebook.com/wuerth.austria/",
      youtube: "https://www.youtube.com/@wuerthaustria",
      tiktok: "https://www.tiktok.com/@wuerthaustria",
    }),
    branche: "Fachhandel für Handwerk und Industrie",
    ort: "Böheimkirchen, Niederösterreich",
    portraet:
      "Würth Österreich mit Sitz in Böheimkirchen unterstützt Handwerks- und Industriebetriebe – etwa aus Kfz-Gewerbe, Holz- und Metallverarbeitung und Bau – mit Produkten, Services und Lösungen für den professionellen Einsatz. Rund 1.000 Mitarbeitende, davon etwa 500 im Außendienst, und mehr als 80 Würth-Shops sorgen für Nähe zur Kundschaft; am Standort Böheimkirchen ist zudem eine Geothermie-Anlage in Betrieb.",
    quellen: [
      { titel: "Impressum – Würth Österreich", url: "https://www.wuerth.at/impressum/impressum-uebersicht.php" },
      { titel: "Würth in Österreich – Würth Österreich", url: "https://www.wuerth.at/de/wuerth_at/company/das_unternehmen/wuerth_in_oesterreich.php" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "ziegler-stahlbau-gmbh": {
    firma: "ZIEGLER STAHLBAU GmbH",
    website: "https://www.stahlbau.at/de/start/index.asp",
    social: social({
      instagram: "https://www.instagram.com/ziegler_stahlbau/",
      facebook: "https://www.facebook.com/stahlbau",
    }),
    branche: "Stahl- und Metallbau",
    ort: "Salzburg",
    portraet:
      "Ziegler Stahlbau ist ein Salzburger Metallbauunternehmen mit rund einem Jahrhundert Erfahrung in der Metallbearbeitung, das heute in vierter Generation als Familienbetrieb geführt wird. Das Leistungsspektrum umfasst Stahlhallen, Metall- und Stahltreppen, Sonder-Stahlkonstruktionen, Blechzuschnitt und Schlosserarbeiten.",
    quellen: [
      { titel: "Impressum – Ziegler Stahlbau", url: "https://www.stahlbau.at/de/kontakt/index.asp?dat=Impressum" },
      { titel: "Unternehmen – Ziegler Stahlbau", url: "https://www.stahlbau.at/de/unternehmen/index.asp" },
      { titel: "Ziegler Stahlbau – Startseite", url: "https://www.stahlbau.at/de/start/index.asp" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "sunpor-kunststoff-gmbh": {
    firma: "SUNPOR KUNSTSTOFF GmbH",
    website: "https://www.sunpor.at/",
    social: social(),
    branche: "EPS-Granulate (expandierbares Polystyrol)",
    ort: "St. Pölten, Niederösterreich",
    portraet:
      "Die SUNPOR Kunststoff GmbH in St. Pölten stellt EPS-Granulate her, aus denen Verarbeiter Dämmplatten für Gebäude und Verpackungen fertigen. Das Unternehmen gehört zur norwegischen O.N. Sunde AS und setzt sich für eine EPS-Kreislaufwirtschaft ein, unter anderem mit dem Recyclingverfahren CreaSolv®.",
    quellen: [
      { titel: "Impressum – SUNPOR", url: "https://www.sunpor.at/impressum" },
      { titel: "SUNPOR – Startseite", url: "https://www.sunpor.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "stein-co-gmbh": {
    firma: "Stein & Co GmbH",
    website: "https://www.steinundco.com/",
    social: social({
      instagram: "https://www.instagram.com/steinundco_at/",
      facebook: "https://www.facebook.com/Stein-Co-gmbh-1515139885460867/",
      youtube: "https://www.youtube.com/channel/UCewfbsWZgx7HIcrGwe9Ebvw",
    }),
    branche: "Naturstein und Keramik",
    ort: "Ennsdorf, Niederösterreich",
    portraet:
      "Stein & Co mit Sitz in Ennsdorf ist auf Produkte aus Naturstein und Keramik spezialisiert. Das private Unternehmen mit rund 100 Mitarbeiterinnen und Mitarbeitern übernimmt Beschaffung, Lagerung, Kommissionierung und Transport bis zur jeweiligen Bedarfsstelle und erweitert sein Sortiment laufend.",
    quellen: [
      { titel: "Impressum – Stein & Co", url: "https://www.steinundco.com/?seite=impressum" },
      { titel: "Unternehmen – Stein & Co", url: "https://www.steinundco.com/?seite=unternehmen&sprache=de" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "spitzschuh-maschinenbau-gesellschaft-mbh": {
    firma: "Spitzschuh - Maschinenbau - Gesellschaft m.b.H.",
    website: "https://www.spitzschuh.com/de",
    social: social(),
    branche: "Gewindetechnik und Zerspanung",
    ort: "Roitham am Traunfall, Oberösterreich",
    portraet:
      "Spitzschuh Maschinenbau aus Roitham am Traunfall fertigt seit über 40 Jahren metallische Präzisionsteile, vor allem Trapezgewindespindeln, Trapezgewindemuttern und Gewindespindeln mit Sonderprofil. Ergänzt wird das Angebot durch Dreh- und Frästeile, die unter anderem in Antriebstechnik und Maschinenbau zum Einsatz kommen.",
    quellen: [
      { titel: "Impressum – Spitzschuh", url: "https://www.spitzschuh.com/de/impressum" },
      { titel: "Spitzschuh – Startseite", url: "https://www.spitzschuh.com/de" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "hammerer-aluminium-industries-holding-gmbh": {
    firma: "Hammerer Aluminium Industries Holding GmbH",
    website: "https://www.hai-aluminium.com/",
    social: social({
      linkedin: "https://at.linkedin.com/company/hai-hammerer-aluminium-industries-gmbh",
      instagram: "https://instagram.com/hammerer_aluminium_industries/",
      facebook: "https://www.facebook.com/Hammereraluminium",
      youtube: "https://www.youtube.com/channel/UCFhUDEBAJmkA_M8ix9_d13w",
      xing: "https://www.xing.com/companies/hammereraluminiumindustriesgmbh",
    }),
    branche: "Aluminiumverarbeitung (Gießen, Strangpressen, Bearbeitung)",
    ort: "Ranshofen, Oberösterreich",
    portraet:
      "Hammerer Aluminium Industries (HAI) wurde 2007 gegründet und hat seinen Hauptsitz in Ranshofen. Das Familienunternehmen ist in den Bereichen Gießen, Strangpressen und Weiterverarbeitung von Aluminium tätig und beschäftigt an mehreren Standorten in Europa und Südkorea rund 1.800 Menschen.",
    quellen: [
      { titel: "Unternehmen – Hammerer Aluminium Industries", url: "https://www.hai-aluminium.com/unternehmen/" },
      { titel: "Impressum – Hammerer Aluminium Industries", url: "https://www.hai-aluminium.com/impressum/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "gms-gourmet-gmbh": {
    firma: "GMS GOURMET GmbH",
    website: "https://www.gourmet.at/",
    social: social({
      linkedin: "https://www.linkedin.com/company/gms-gourmet-gmbh/",
      instagram: "https://www.instagram.com/gms.gourmet/",
      facebook: "https://www.facebook.com/gourmet.at",
      youtube: "https://www.youtube.com/channel/UCWFfvhQ5EeTcxPP7gk2WnaQ",
      xing: "https://www.xing.com/companies/gmsgourmetgmbh",
    }),
    branche: "Gemeinschaftsverpflegung, Gastronomie und Catering",
    ort: "Wien",
    portraet:
      "GOURMET ist ein österreichisches Unternehmen mit mehr als 50 Jahren Erfahrung in der Gemeinschaftsverpflegung. Aus zwei Frischküchen in Wien und St. Pölten werden Kindergärten, Schulen, Betriebe, Heime und Spitäler versorgt; dazu kommen Betriebsrestaurants, Cafés und Restaurants in Wien und Salzburg sowie Catering unter der Traditionsmarke Gerstner.",
    quellen: [
      { titel: "Das Unternehmen – GOURMET", url: "https://www.gourmet.at/ueber-uns/das-unternehmen" },
      { titel: "Impressum – GOURMET", url: "https://www.gourmet.at/footer/rechtliche-navigation/impressum" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "gerhard-rauch-gmbh": {
    firma: "Gerhard Rauch Ges.m.b.H.",
    website: "https://www.gerhard-rauch.at/de",
    social: social(),
    branche: "Präzisionsteile, Lohnfertigung und Folienstanztechnik",
    ort: "Trasdorf, Niederösterreich",
    portraet:
      "Gerhard Rauch begann 1970 als Einmannbetrieb in Wien mit Profilschleifarbeiten für Werkzeug- und Maschinenbau. Seit 1995 fertigt das Unternehmen zusätzlich am Standort Trasdorf in Niederösterreich mit modernen Fertigungseinrichtungen und legt großen Wert auf die Ausbildung von Lehrlingen.",
    quellen: [
      { titel: "Impressum – Gerhard Rauch", url: "https://www.gerhard-rauch.at/de/impressum" },
      { titel: "Über uns – Gerhard Rauch", url: "https://www.gerhard-rauch.at/de/unternehmen/ueber-uns" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "gebrueder-woerle-gesmbh": {
    firma: "Gebrüder WOERLE Ges.m.b.H",
    website: "https://www.woerle.at/",
    social: social({
      linkedin: "https://www.linkedin.com/company/gebrueder-woerle/",
      instagram: "https://www.instagram.com/woerle1889/",
      facebook: "https://www.facebook.com/woerle1889/",
      youtube: "https://www.youtube.com/channel/UC7uB6Ew914LwFxsxLUX6_aA",
      tiktok: "https://www.tiktok.com/@woerle1889",
    }),
    branche: "Käserei (Heumilchkäse)",
    ort: "Henndorf am Wallersee, Salzburg",
    portraet:
      "Die Gebrüder Woerle Ges.m.b.H in Henndorf erzeugt seit 1889 Käse aus Heumilch aus dem Salzburger Seen- und Mondseeland. Gegründet wurde sie von Johann Baptist Woerle – nach eigenen Angaben als erste Emmentalerkäserei Österreichs –, heute wird das Familienunternehmen in fünfter Generation geführt.",
    quellen: [
      { titel: "Das Unternehmen – WOERLE", url: "https://www.woerle.at/das-unternehmen/" },
      { titel: "Impressum – WOERLE", url: "https://www.woerle.at/impressum/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "gs-georg-stemeseder-gmbh": {
    firma: "G.S. Georg Stemeseder GmbH",
    website: "https://stemeseder.com/",
    social: social({
      facebook: "https://www.facebook.com/StemesederJobs",
    }),
    branche: "Aluminiumsysteme und Haustüren",
    ort: "Hof bei Salzburg",
    portraet:
      "Die G.S. Georg Stemeseder GmbH aus Hof bei Salzburg ist ein inhabergeführtes Familienunternehmen mit jahrzehntelanger Erfahrung im Aluminiumbereich. Unter dem Anspruch „Premium Aluminium Systems“ entwickelt Stemeseder Aluminiumsysteme und Haustüren und setzt dabei auf Qualität, Innovation, kurze Entscheidungswege und Nachhaltigkeit.",
    quellen: [
      { titel: "Impressum – Stemeseder", url: "https://stemeseder.com/impressum/" },
      { titel: "Das Unternehmen – Stemeseder", url: "https://stemeseder.com/stemeseder-das-unternehmen-gruen/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "fuschl-am-see-betriebs-gmbh": {
    firma: "Fuschl am See BetriebsGmbH",
    website: "https://www.fuschlseebad.at/",
    social: social({
      instagram: "https://www.instagram.com/fuschlseebad/",
      facebook: "https://www.facebook.com/profile.php?id=100046788763938",
    }),
    branche: "Seebad und Gastronomie",
    ort: "Fuschl am See, Salzburg",
    portraet:
      "Die Fuschl am See BetriebsGmbH betreibt das Fuschlseebad direkt am Fuschlsee mit Liegewiese, Fitnessbereich und Sauna. Dazu gehören das Restaurant „Das See“ mit Blick auf den See und das Café Flora im Ortszentrum von Fuschl.",
    quellen: [
      { titel: "Impressum – Fuschlseebad", url: "https://www.fuschlseebad.at/impressum" },
      { titel: "Fuschlseebad – Startseite", url: "https://www.fuschlseebad.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "franz-hauer-gmbh-co-kg": {
    firma: "Franz Hauer GmbH & CoKG",
    website: "https://www.hfl.co.at/",
    social: social({
      linkedin: "https://at.linkedin.com/company/franz-hauer-gmbh-cokg",
      instagram: "https://www.instagram.com/hauer_frontlader/",
      facebook: "https://www.facebook.com/franzhauergmbhcokg/",
      youtube: "https://www.youtube.com/channel/UCsAnX_sCxpL4wgAcw3-mGsw",
    }),
    branche: "Landtechnik (Frontlader und Arbeitsgeräte)",
    ort: "Statzendorf, Niederösterreich",
    portraet:
      "Die Franz Hauer GmbH & Co KG in Statzendorf entwickelt und fertigt Frontlader, Arbeitsgeräte, Fronthubwerke und Zubehör für Land- und Forstwirtschaft sowie Kommunen. Aus einer kleinen Schmiede mit 150 m² ist ein international tätiges Unternehmen auf einem 16.000 m² großen Areal gewachsen.",
    quellen: [
      { titel: "Impressum – Hauer", url: "https://www.hfl.co.at/impressum/" },
      { titel: "Geschichte – Hauer", url: "https://www.hfl.co.at/unternehmen/geschichte/" },
      { titel: "Hauer – Startseite", url: "https://www.hfl.co.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "fischer-parkett-gmbh-co-kg": {
    firma: "FISCHER-PARKETT GmbH & Co KG",
    website: "https://www.fischerparkett.com/",
    social: social({
      instagram: "https://www.instagram.com/fischer_parkett/",
      facebook: "https://www.facebook.com/fischerparkett.at/",
    }),
    branche: "Parkettböden",
    ort: "Nußdorf am Haunsberg, Salzburg",
    portraet:
      "FISCHER-PARKETT aus Nußdorf am Haunsberg steht für hochwertige Parkettböden, fachgerechte Montage und Termintreue. Das Leistungsspektrum reicht vom Schleifen einzelner Böden im Wohnbereich über die Restaurierung von Altböden bis zu anspruchsvollen Großprojekten.",
    quellen: [
      { titel: "Impressum – Fischer Parkett", url: "https://www.fischerparkett.com/impressum/" },
      { titel: "Unternehmen – Fischer Parkett", url: "https://www.fischerparkett.com/unternehmen/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "fill-gmbh": {
    firma: "Fill Gesellschaft m.b.H.",
    website: "https://www.fill.co.at/de",
    social: social({
      linkedin: "https://www.linkedin.com/company/fill/",
      instagram: "https://www.instagram.com/fillmaschinenbau/",
      facebook: "https://www.facebook.com/fillmaschinenbau",
      youtube: "https://www.youtube.com/user/fillmaschinenbau",
      tiktok: "https://www.tiktok.com/@fillmaschinenbau",
    }),
    branche: "Maschinen- und Anlagenbau",
    ort: "Gurten, Oberösterreich",
    portraet:
      "Die Fill Gesellschaft m.b.H. in Gurten ist ein Maschinen- und Anlagenbauunternehmen, dessen Geschichte 1966 mit einer kleinen Metallwerkstatt begann und das bis heute von der Unternehmerfamilie Fill geprägt ist. Das Unternehmen entwickelt unter anderem Anlagen für Gieß- und Entkerntechnik, Holzbandsägetechnik sowie Maschinen für die Ski- und Snowboardproduktion und arbeitet für die Automobil- und Luftfahrtindustrie.",
    quellen: [
      { titel: "Impressum – Fill", url: "https://www.fill.co.at/de/impressum" },
      { titel: "History – Fill", url: "https://www.fill.co.at/en/company/discover-the-history-of-fill" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "felbermayer-fenster-tueren-erzeugungs-gmbh": {
    firma: "Felbermayer Fenster und Türen Erzeugungs-GmbH",
    website: "https://www.felbermayerfenster.at/",
    social: social(),
    branche: "Fenster und Türen für den Objektbau",
    ort: "Unterwaltersdorf, Niederösterreich",
    portraet:
      "Felbermayer wurde 1963 als Tischlerei in Klosterneuburg gegründet und ist heute ein Familienunternehmen mit rund 210 Mitarbeiterinnen und Mitarbeitern am Standort Unterwaltersdorf. Gefertigt werden Fenster und Türen aus Holz, Holz-Alu, Kunststoff und Kunststoff-Alu für den Objektbau, ergänzt durch eigene Isolierglasfertigung und Pulverbeschichtung; eine Photovoltaikanlage mit rund 2 MW deckt nach eigenen Angaben einen Großteil des Energiebedarfs der Fertigung.",
    quellen: [
      { titel: "Impressum – Felbermayer Fenster und Türen Erzeugungs-GmbH", url: "https://www.felbermayerfenster.at/kontakt/impressum-erzeugung.html" },
      { titel: "Felbermayer – Startseite", url: "https://www.felbermayerfenster.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "dgt-duscher-galvanotechnik-gmbh": {
    firma: "DGT DUSCHER Galvanotechnik GmbH",
    website: "https://www.galvanoduscher.at/",
    social: social(),
    branche: "Galvanotechnik und Oberflächenveredelung",
    ort: "St. Florian am Inn, Oberösterreich",
    portraet:
      "DGT Duscher Galvanotechnik ist ein unabhängiges, familiengeführtes Unternehmen in dritter Generation mit Sitz in St. Florian am Inn. Seit der Gründung 1949 veredelt der Betrieb Oberflächen mit galvanischen Verfahren, ist nach ISO 9001 und ISO 14001 zertifiziert und erbringt rund 70 % seiner Leistungen für Kunden im Ausland, vor allem in Deutschland, Ungarn, Tschechien, der Slowakei und der Schweiz.",
    quellen: [
      { titel: "Unser Unternehmen – DGT Duscher Galvanotechnik", url: "https://galvanoduscher.at/html/unternehmen.html" },
      { titel: "Impressum – DGT Duscher Galvanotechnik", url: "https://galvanoduscher.at/html/impressum.html" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "destalles-autohandels-und-reparatur-gmbh": {
    firma: "Destalles Autohandels und Reparatur GmbH",
    website: "https://www.ford-destalles-linz.at/",
    social: social(),
    branche: "Autohaus und Werkstätte (Ford-Partner)",
    ort: "Linz, Oberösterreich",
    portraet:
      "Destalles ist Ford-Partner in Linz und bietet Neu- und Gebrauchtwagen, Beratung sowie Service und Reparatur aus einer Hand. Das Team setzt dabei auf langjährige Erfahrung und persönliche Betreuung.",
    quellen: [
      { titel: "Impressum – Destalles", url: "https://www.ford-destalles-linz.at/impressum" },
      { titel: "Destalles – Startseite", url: "https://www.ford-destalles-linz.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "campingwelt-brixen-im-thale": {
    firma: "Camping Brixen GmbH & Co KG",
    website: "https://www.camping-brixen.at/",
    social: social({
      instagram: "https://www.instagram.com/campingwelt_brixen/",
      facebook: "https://www.facebook.com/campingbrixen",
      youtube: "https://www.youtube.com/c/VitalSporthotelBrixen",
    }),
    branche: "Campingplatz",
    ort: "Brixen im Thale, Tirol",
    portraet:
      "Die Campingwelt Brixen liegt in Brixen im Thale in den Kitzbüheler Alpen und bietet auf einem weitläufigen, weitgehend ebenen Gelände Plätze für Kurzaufenthalte sowie für Saison- und Jahresgäste. Im Sommer ist der Platz Ausgangspunkt für Wander- und E-Bike-Touren, im Winter für die SkiWelt Wilder Kaiser – Brixental.",
    quellen: [
      { titel: "Impressum – Campingwelt Brixen", url: "https://www.camping-brixen.at/de/impressum" },
      { titel: "Campingwelt Brixen – Startseite", url: "https://www.camping-brixen.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "braunegger-kg": {
    firma: "Braunegger KG",
    website: "https://www.braunegger.tirol/",
    social: social(),
    branche: "Lebensmittelgroßhandel, Märkte und Kaffeerösterei",
    ort: "Kaltenbach im Zillertal, Tirol",
    portraet:
      "Die Braunegger KG aus Kaltenbach im Zillertal ist seit Generationen Partnerin der heimischen Gastronomie und des Einzelhandels. Die Firmengeschichte begann 1898 mit einem Botendienst per Pferdefuhrwerk; heute gehören Lebensmittelgroßhandel, Märkte und eine eigene Kaffeerösterei dazu, in der Braunegger Kaffee geröstet wird.",
    quellen: [
      { titel: "Impressum – Braunegger", url: "https://www.braunegger.tirol/impressum.html" },
      { titel: "Über uns – Braunegger", url: "https://www.braunegger.tirol/ueber-uns-42.html" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "biomontan-produktions-und-handels-gmbh": {
    firma: "Biomontan Produktions und Handels GmbH",
    website: "https://www.biomontan.at/",
    social: social(),
    branche: "Prozesschemikalien für wasserintensive Industrien",
    ort: "Enns, Oberösterreich",
    portraet:
      "Biomontan mit Sitz in Enns ist ein familiengeführtes oberösterreichisches Unternehmen, das Industriebetriebe seit 1973 bei der Prozessoptimierung unterstützt – vor allem mit Chemikalien für die Papier- und Zellstoffindustrie und die Umwelttechnik. Das Unternehmen ist Teil der SNF Group unter der Führung von SNF Floerger mit Sitz in Frankreich.",
    quellen: [
      { titel: "Über uns – Biomontan", url: "https://www.biomontan.at/ueber-uns/" },
      { titel: "Impressum – Biomontan", url: "https://www.biomontan.at/impressum/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "baumgartner-metallbau-gmbh": {
    firma: "Baumgartner Metallbau GmbH",
    website: "https://bkmetallbau.at/",
    social: social({
      instagram: "https://www.instagram.com/bkmetallbau/",
      facebook: "https://www.facebook.com/bkmetallbau",
    }),
    branche: "Glas-, Stahl- und Leichtmetallbau",
    ort: "Haag am Hausruck, Oberösterreich",
    portraet:
      "BK METALLBAU – die Baumgartner Metallbau GmbH aus Haag am Hausruck – steht seit über 30 Jahren für individuelle Lösungen im Glas-, Stahl- und Leichtmetallbau. Der eigentümergeführte Familienbetrieb beschäftigt rund 30 Mitarbeiterinnen und Mitarbeiter auf einem 10.000 m² großen Firmenareal und bezieht die Wünsche von Bauherren und Architekturbüros bereits in der Planungsphase ein.",
    quellen: [
      { titel: "Impressum – BK Metallbau", url: "https://bkmetallbau.at/impressum/" },
      { titel: "Unternehmen – BK Metallbau", url: "https://bkmetallbau.at/unternehmen/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "baumaerkte-a-sochor-co-gmbh": {
    firma: "Baumärkte A. Sochor & Co GmbH",
    website: "https://www.sochor.at/",
    social: social(),
    branche: "Baumärkte und Baustoffhandel",
    ort: "Wien",
    portraet:
      "Die Baumärkte A. Sochor & Co GmbH gehört zur Unternehmensgruppe Sochor, einem traditionsreichen Familienunternehmen im Baustoffhandel in Wien und Umgebung. Die Gruppe ist seit 1995 Franchisenehmerin von OBI, Gesellschafterin der Kooperation Eurobaustoff und betreibt neben Baumärkten einen Baustoffhandel, einen Fliesenschauraum und ein Logistikzentrum in Achau; zudem ist sie als Great Place To Work® zertifiziert.",
    quellen: [
      { titel: "Unternehmensgruppe – Sochor", url: "https://www.sochor.at/unternehmensgruppe/" },
      { titel: "Impressum – Sochor", url: "https://www.sochor.at/impressum/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "austyrol-daemmstoffe-gmbh": {
    firma: "austyrol Dämmstoffe Ges.m.b.H.",
    website: "https://www.austyrol.at/",
    social: social(),
    branche: "Dämmstoffe aus EPS",
    ort: "Mödling, Niederösterreich",
    portraet:
      "austyrol ist ein Familienbetrieb aus Mödling, der 1986 mit sechs Personen startete und heute 45 bis 50 Mitarbeiterinnen und Mitarbeiter beschäftigt. Produziert werden vor allem Wärmedämmplatten aus expandiertem Polystyrol (EPS) für Gebäude; ergänzend führt das Unternehmen weitere Dämmstoffe wie XPS, PUR/PIR und Vakuumdämmung sowie Produkte für Dachdämmung und Abdichtung.",
    quellen: [
      { titel: "Über uns – austyrol", url: "https://www.austyrol.at/%C3%BCber-uns" },
      { titel: "Impressum – austyrol", url: "https://www.austyrol.at/impressum" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "aug-rath-jun-gmbh": {
    firma: "Aug. Rath jun. GmbH",
    website: "https://www.rath-group.com/",
    social: social({
      linkedin: "https://at.linkedin.com/company/rathgroup",
      instagram: "https://www.instagram.com/rath.group/",
      facebook: "https://www.facebook.com/profile.php?id=61552297610671",
      youtube: "https://www.youtube.com/channel/UCoXktiXj4EfejfEl2djUXEA",
    }),
    branche: "Feuerfeste Werkstoffe",
    ort: "Krummnußbaum, Niederösterreich",
    portraet:
      "Die Aug. Rath jun. GmbH in Krummnußbaum gehört zur RATH-Gruppe, die auf feuerfeste Grundwerkstoffe und Fertigprodukte für Anwendungstemperaturen bis 1.800 °C spezialisiert ist. Das 1891 von August Rath junior gegründete österreichische Unternehmen produziert heute in eigenen Werken in Österreich, Deutschland, Ungarn und den USA.",
    quellen: [
      { titel: "Über uns – RATH Group", url: "https://www.rath-group.com/rath-gruppe/ueber-uns" },
      { titel: "Sales and production locations – RATH Group", url: "https://www.rath-group.com/en/rath-group/sales-and-production-locations" },
      { titel: "Impressum – RATH Group", url: "https://www.rath-group.com/impressum" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "ah-weichselbaumer-gmbh": {
    firma: "Weichselbaumer GmbH",
    website: "https://www.ford-weichselbaumer-pinsdorf.at/",
    social: social(),
    branche: "Autohaus und Werkstätte (Ford-Partner)",
    ort: "Pinsdorf, Oberösterreich",
    portraet:
      "Das Autohaus Weichselbaumer ist Ford-Partner in Pinsdorf und bietet Neu- und Gebrauchtwagen, Beratung sowie Service und Reparatur aus einer Hand. Das Team setzt dabei auf langjährige Erfahrung und persönliche Betreuung.",
    quellen: [
      { titel: "Impressum – Autohaus Weichselbaumer", url: "https://www.ford-weichselbaumer-pinsdorf.at/impressum" },
      { titel: "Autohaus Weichselbaumer – Startseite", url: "https://www.ford-weichselbaumer-pinsdorf.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "ac-auto-vertrieb-und-service-gmbh": {
    firma: "AC Auto Vertrieb und Service GmbH",
    website: "https://www.ford-dornach-linz-dornach.at/",
    social: social(),
    branche: "Autohaus und Werkstätte (Ford-Partner)",
    ort: "Linz-Dornach, Oberösterreich",
    portraet:
      "AC Auto Vertrieb und Service ist Ford-Partner in Linz-Dornach und bietet Neu- und Gebrauchtwagen, Beratung sowie Service und Reparatur aus einer Hand. Das Team setzt dabei auf langjährige Erfahrung und persönliche Betreuung.",
    quellen: [
      { titel: "Impressum – AC Auto Vertrieb und Service", url: "https://www.ford-dornach-linz-dornach.at/impressum" },
      { titel: "AC Auto Vertrieb und Service – Startseite", url: "https://www.ford-dornach-linz-dornach.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },

  "4you-store-gmbh": {
    firma: "4you Store GmbH",
    website: "https://www.ford-4youstore-voecklabruck.at/",
    social: social(),
    branche: "Autohaus und Werkstätte (Ford-Partner)",
    ort: "Vöcklabruck, Oberösterreich",
    portraet:
      "Der 4you Store ist Ford-Partner in Vöcklabruck und bietet Neu- und Gebrauchtwagen, Beratung sowie Service und Reparatur aus einer Hand. Das Team setzt dabei auf langjährige Erfahrung und persönliche Betreuung.",
    quellen: [
      { titel: "Impressum – 4you Store", url: "https://www.ford-4youstore-voecklabruck.at/impressum" },
      { titel: "4you Store – Startseite", url: "https://www.ford-4youstore-voecklabruck.at/" },
    ],
    geprueftAm: GEPRUEFT,
    freigabe: { zitat: false, logo: false },
    zitat: null,
  },
};
