// src/data/unternehmen.js
//
// Unternehmensdaten für www.oekovolt.com – aus Sicht der österreichischen
// Gesellschaft Ökovolt Solartechnik GmbH (Ostermiething, FN 375708m).
//
// QUELLEN: Registerangaben der AT-Gesellschaft kommen aus src/lib/site.js
// (FIRMA, verifiziert über Firmenbuch / WKO Firmen A–Z / FirmenABC) und werden
// hier NICHT abgetippt. Die Registerangaben der deutschen Gesellschaft stammen
// aus dem Impressum von oekovolt.de bzw. dem Handelsregister. Rollen,
// Beteiligungsquoten und Erzähltext stammen aus der Unternehmenskommunikation.
//
// GESELLSCHAFTER (AT, Stand Firmenbuch 09/2026): Andreas Wegscheider 51 %,
// Salzburg AG für Energie, Verkehr und Telekommunikation 49 % – seit 2021.
// Auf der österreichischen Website ist die Salzburg AG AKTUELL
// Gesellschafterin. Die deutsche Datei (oekovolt.de) spricht von einem
// Ausscheiden 2025 – das gilt für diese Website NICHT. Vor jeder Änderung den
// aktuellen Firmenbuchstand prüfen und die Angaben in src/lib/site.js pflegen.
//
// GESELLSCHAFTSRECHTLICH: Die Ökovolt Solartechnik GmbH ist keine
// Tochtergesellschaft der deutschen GmbH (die Anteile halten Andreas
// Wegscheider und die Salzburg AG). Die deutsche GmbH heißt deshalb überall
// „Schwestergesellschaft“ und „Stammhaus der Gruppe“ (Ursprung, Standards, Marke) –
// nie „Muttergesellschaft“ (gleiche Sprachregelung wie Schema in layout.js, llms.txt, /presse).
//
// PFLEGE: `STAND` dokumentiert den Redaktionsstand und wird ausgewiesen.

import { FIRMA, SCHWESTER, SOLENSA } from "@/lib/site";
import { kz } from "@/data/kennzahlen";

export const STAND = "2026-09-28";

/** Kurzprofil für den Einstieg. */
export const PROFIL = {
  kopf: "Seit 2012 in Österreich",
  titel: "Photovoltaik aus Ostermiething – für ganz Österreich",
  lead:
    "Die Ökovolt Solartechnik GmbH plant, errichtet und betreut seit 2012 Photovoltaikanlagen in Österreich – aus Ostermiething im Innviertel, direkt an der Salzach, für Gewerbe, Industrie, Landwirtschaft und öffentliche Hand in allen neun Bundesländern. Dahinter steht eine Gruppe, die Andreas Wegscheider und Susanne Messmer 2010 in Türkheim gegründet haben. Ihre Entscheidung von damals gilt bis heute: Wir planen nicht nur, wir bauen selbst. Und wir betreiben, was wir bauen.",
};

/** Schlusssatz des Kapitels. */
export const CLAIM = "ÖKOVOLT. Wir bauen, was wir selbst betreiben würden.";

/**
 * Kennzahlen für den "Heute"-Abschnitt – nur belegte Werte.
 * PLATZHALTER: Projekt- und Mitarbeiterzahlen liegen nicht freigegeben vor und
 * bleiben deshalb `null`; die Komponente blendet null-Werte aus.
 */
export const HEUTE = [
  { wert: "seit 2012", label: "Photovoltaik-Errichter in Österreich" },
  // Gesamtzahlen laut Ökovolt Österreich, siehe src/data/kennzahlen.js
  { wert: `${kz("leistung")} kWp`, label: "installierte Leistung" },
  { wert: "9", label: "Bundesländer im Einzugsgebiet" },
  { wert: kz("anlagen"), label: "PV-Kraftwerke errichtet" },
  { wert: null, label: "Fachleute in Ostermiething" },
];

/**
 * Markenangaben – NUR ausfüllen, wenn eine Eintragung vorliegt, die für
 * Österreich gilt (Österreichisches Patentamt, EUIPO oder IR mit Benennung AT).
 * Inhaberin der Marken- und Websiterechte ist die deutsche Gesellschaft
 * (SCHWESTER in src/lib/site.js). Solange `nummer` null ist, rendert die
 * Komponente weder Registernummer noch ®.
 */
export const MARKE = {
  amt: null, // "ÖPA" | "EUIPO" | "WIPO"
  form: null, // "Wortmarke" | "Wort-/Bildmarke"
  nummer: null,
  inhaber: SCHWESTER.name,
  jahr: null,
};

/** "Betreiber aus Überzeugung" – das eigentliche Unterscheidungsmerkmal. */
export const HALTUNG = {
  kopf: "Betreiber aus Überzeugung",
  titel: "Wir kennen Anlagen nicht nur vom Bau",
  absaetze: [
    "Was Ökovolt von Anfang an unterscheidet: Die Gründer betreiben seit 2012 eigene Solarparks – bis heute. Wer selbst Betreiber ist, plant anders.",
    "Deshalb wissen wir nicht nur, wie man eine Anlage baut, sondern wie sie sich über zehn, zwölf, fünfzehn Jahre verhält: Ertrag, Wartung, Wechselrichtertausch, Netzbetreiber, Vermarktung. Diese Erfahrung steckt in jeder Anlage, die wir heute für Unternehmen, Landwirtschaft und Gemeinden in Österreich errichten.",
  ],
};

/**
 * Der rote Faden: Türkheim ist Stammhaus der Gruppe, Ostermiething die
 * österreichische Gesellschaft mit denselben Prozessen.
 */
export const URSPRUNG = {
  kopf: "Österreich und Deutschland",
  titel: "Ein Stammhaus, eine Schwester – ein Verbund",
  absaetze: [
    `Die ${SCHWESTER.name} in ${SCHWESTER.ort} (Deutschland, seit 2010) ist das Stammhaus der Gruppe und rechtlich eine Schwestergesellschaft: Dort werden die technischen Standards gesetzt, nach denen gebaut wird, und dort liegen die Rechte an der Marke Ökovolt und an dieser Website.`,
    `Mit diesem Know-how entstand 2012 die österreichische Gesellschaft, die ${FIRMA.name} in ${FIRMA.ort} – mit denselben Prozessen und derselben Qualitätslatte. Gesellschaftsrechtlich ist sie eigenständig: Gesellschafter sind Gründer und Geschäftsführer ${FIRMA.geschaeftsfuehrer} und die Salzburg AG.`,
    "Beide Gesellschaften arbeiten eng verzahnt: Zentraleinkauf, gemeinsame Planungsdienstleistungen und eine gemeinsame EDV-Infrastruktur. In Österreich kommen eigene Systeme für den Netzanschluss dazu – Parkregler, Fernwartung und SCADA.",
  ],
  kennzahlen: [
    { wert: "2010", label: "Stammhaus in Türkheim" },
    { wert: "2012", label: "Gesellschaft in Österreich" },
    { wert: "Zentral", label: "Einkauf, Planung und EDV im Verbund" },
  ],
};

/** Die Menschen hinter dem Unternehmen – nur belegte Personen. */
export const GENERATIONEN = [
  {
    id: "erste",
    kopf: "1. Generation",
    titel: "Die Pioniere",
    einleitung:
      "Lange bevor Photovoltaik Mainstream wurde, haben die beiden Gründer sie zu ihrem Beruf gemacht – aus Überzeugung, nicht wegen einer Förderkulisse.",
    personen: [
      {
        initialen: "AW",
        name: "Andreas Wegscheider",
        rolle: `Gründer · Geschäftsführer der ${FIRMA.name}`,
        schlagzeile: "Pionier der ersten Stunde",
        text:
          "Andreas Wegscheider gehört zu den Pionieren der Photovoltaik im DACH-Raum. Er hat Anlagen geplant und montiert, als Module noch ein Vielfaches kosteten und jede Installation Überzeugungsarbeit war. Als Geschäftsführer und Mehrheitsgesellschafter der österreichischen Gesellschaft verantwortet er das Projektgeschäft in Österreich – mit dem Anspruch, jede Anlage so zu bauen, als stünde sie auf dem eigenen Dach.",
      },
      {
        initialen: "SM",
        name: "Susanne Messmer",
        rolle: "Mitgründerin der Gruppe",
        schlagzeile: "Pionierin der ersten Stunde",
        text:
          "Susanne Messmer steht für strategische Weitsicht und kaufmännische Stärke. Sie hat aus einem Handwerksbetrieb eine Unternehmensgruppe gemacht und die wirtschaftliche Entwicklung über alle Marktzyklen hinweg gesteuert – durch Förderstopps, Preisverfall und Boomjahre.",
      },
    ],
  },
  {
    id: "zweite",
    kopf: "2. Generation",
    titel: "Internet of Energy & Vertrieb",
    einleitung:
      "Seit 2025 führt die nächste Generation die Gruppe mit weiter – mit Digitalisierung auf der einen und gewachsener Vertriebsstärke auf der anderen Seite.",
    personen: [
      {
        initialen: "AM",
        name: "Alexander Messmer",
        rolle: `2. Generation · Digitalisierung & Cyber Security (${SOLENSA.name})`,
        schlagzeile: `Seit 2025 im Verbund: ${SOLENSA.name}`,
        text:
          `Als Sohn von Susanne Messmer tritt Alexander Messmer die zweite Generation an und ergänzt die Gruppe seit 2025 mit seiner Firma ${SOLENSA.name}. Mit Know-how in Digitalisierung, Cyber Security und Softwareentwicklung vernetzt er Energiesysteme unter dem Konzept des Internet of Energy – in Österreich etwa bei Fernwartung und SCADA – und sichert die digitale Infrastruktur der Gruppe ab.`,
        kompetenzen: [
          { icon: "ShieldCheck", titel: "Cyber Security", text: "Schutz digitaler Energieinfrastruktur" },
          { icon: "Code", titel: "Software-Entwicklung", text: "Eigenentwicklungen für IoE" },
          { icon: "Network", titel: "Internet of Energy", text: "Vernetzung aller Energiesysteme" },
        ],
      },
      {
        initialen: "MT",
        name: "Manuel Thaler",
        rolle: "Vertrieb · PV GmbH · Geschäftsführung ÖkoInvest GmbH",
        schlagzeile: "Seit über 10 Jahren Teil der Familie",
        text:
          "Manuel Thaler gehört seit mehr als zehn Jahren zur Ökovolt-Familie. Mit der PV GmbH verantwortet er den Vertrieb der Gruppe, gemeinsam mit Andreas Wegscheider führt er die ÖkoInvest GmbH. Er begleitet Kundinnen und Kunden von der ersten Frage bis zur fertigen Anlage – und kennt Netzbetreiber und Förderlandschaft aus zahlreichen Projekten.",
      },
    ],
  },
];

/**
 * Die Salzburg AG – aktuelle Gesellschafterin der österreichischen
 * Gesellschaft (49 %, seit 2021). Bewusst im Präsens.
 */
export const SALZBURG_AG = {
  zeitraum: "Seit 2021",
  kopf: "Gesellschafterin in Österreich",
  titel: "Die Partnerschaft mit der Salzburg AG",
  text:
    `Seit 2021 ist die Salzburg AG für Energie, Verkehr und Telekommunikation mit 49 % an der ${FIRMA.name} beteiligt; 51 % hält Gründer und Geschäftsführer ${FIRMA.geschaeftsfuehrer}. Die Gesellschaft zählte 2021 bereits zu den TOP 3 der EPC-Errichter Österreichs – genau deshalb kam einer der großen Landesenergieversorger auf sie zu: Die Position war der Grund für den Einstieg, nicht sein Ergebnis. Die Partnerschaft verbindet die Umsetzungsstärke eines spezialisierten Errichters mit dem Zugang zu Liegenschaften und Infrastruktur eines Landesversorgers.`,
  kennzahlen: [
    { wert: "TOP 3", label: "EPC-Errichter – schon vor dem Einstieg" },
    { wert: "49 %", label: "Salzburg AG, seit 2021" },
    { wert: "51 %", label: `${FIRMA.geschaeftsfuehrer}, Gründer und Geschäftsführer` },
  ],
  punkte: [
    "Bereits 2021 unter den TOP 3 der EPC-Errichter (Integrierter Photovoltaik-Contractor) Österreichs",
    "Bevorzugter PV-Errichter des Salzburg AG Konzerns",
    "Zugang zu Liegenschaften und Infrastrukturprojekten eines Landesenergieversorgers",
    "Großprojekte im Bereich Freifläche, Agri-PV und gewerbliche Dachanlagen",
  ],
};

/**
 * Was die österreichische Gesellschaft macht.
 * Leistungsbeschreibung laut Unternehmenskommunikation; Verlinkung auf die
 * jeweiligen Leistungsseiten (Routen aus src/data/navigation.js).
 */
export const ROLLEN_AT = {
  kopf: "Österreich",
  titel: "Was die Ökovolt Solartechnik GmbH macht",
  lead:
    "Die österreichische Gesellschaft ist Errichterin mit eigener Technik: Sie plant, baut, schließt an und betreut Photovoltaikanlagen für Unternehmen, Landwirtschaft und öffentliche Hand – und liefert die Regelungs- und Leittechnik für den Netzanschluss selbst.",
  eintraege: [
    {
      icon: "Building2",
      rolle: "Projektgeschäft",
      name: "Gewerbe, Industrie, Freifläche, Agri-PV",
      text:
        "Dach- und Freiflächenanlagen für Betriebe, Landwirtschaft, Gemeinden und Landesversorger – von der Lastganganalyse über Netzanschluss und Förderansuchen bis zur Inbetriebnahme.",
      href: "/gewerbe",
      hervorgehoben: true,
    },
    {
      icon: "Wrench",
      rolle: "Eigene Technik",
      name: "Parkregler, Fernwartung, SCADA",
      text:
        "Eigener EZA-Regler für die Anforderungen der TOR Erzeuger, eigene Fernwartungssysteme und eigene SCADA-Systeme für Überwachung und Reporting – entwickelt gemeinsam mit Solensa (IT-Security).",
      href: "/technik",
    },
    {
      icon: "ShieldCheck",
      rolle: "Service",
      name: "Wartung, Prüfung, Betrieb",
      text:
        "Wartungsverträge, wiederkehrende Anlagenprüfung, Drohnen-Thermografie, Reinigung, Repowering sowie Beratung zu Versicherung, Finanzierung und Reststromvermarktung.",
      href: "/service/wartung",
    },
    {
      icon: "Network",
      rolle: "Im Verbund",
      name: `Standards und Marke aus ${SCHWESTER.ort}`,
      text:
        `Das Stammhaus ${SCHWESTER.name} setzt die technischen Standards der Gruppe und ist Inhaberin der Marke Ökovolt. Einkauf, Planungsdienstleistungen und EDV laufen gemeinsam.`,
    },
  ],
};

/**
 * Struktur der Unternehmensgruppe (Stand siehe STAND).
 * `ebene`: 0 = Gruppe, 1 = operative Landesgesellschaften, 2 = Beteiligungen.
 * Auf der AT-Website steht die österreichische Gesellschaft zuerst.
 */
export const GRUPPE = [
  { ebene: 0, name: "Ökovolt Gruppe", text: "Familiengeführte Unternehmensgruppe, gegründet 2010" },
  {
    ebene: 1,
    flagge: "AT",
    name: FIRMA.name,
    text: `Österreichische Gesellschaft in ${FIRMA.ort} – Projektgeschäft, eigene Technik und Service. Gesellschafter: ${FIRMA.gesellschafter.map((g) => `${g.name.replace(" für Energie, Verkehr und Telekommunikation", "")} ${g.anteil}`).join(", ")}.`,
    gesellschaft: "at",
  },
  {
    ebene: 1,
    flagge: "DE",
    name: SCHWESTER.name,
    text: "Stammhaus in Türkheim – Standards, Technik, Marken- und Websiterechte; Projektgeschäft in Deutschland",
    gesellschaft: "de",
  },
  {
    ebene: 2,
    name: "ÖkoInvest GmbH",
    anteil: `${FIRMA.name}: 22,60 %`,
    text: "Projektgesellschaft für Freiflächen-PV, Agri-PV, Contracting & PPA. Geschäftsführung: Andreas Wegscheider und Manuel Thaler.",
  },
  {
    ebene: 2,
    name: "GFL – PV-Kraftwerk GmbH",
    anteil: "ÖkoInvest GmbH: 100,00 %",
    text: "Betrieb von PV-Kraftwerken",
  },
  {
    ebene: 2,
    name: "HIL PV Kraftwerk GmbH",
    anteil: "ÖkoInvest GmbH: 50,00 %",
    text: "Gemeinschaftsgesellschaft mit der Prime Energy Solutions GmbH (50 %)",
  },
  {
    ebene: 2,
    name: "PV GmbH",
    anteil: "Beteiligt an der ÖkoInvest GmbH mit 25,80 %",
    text: "Exklusiver Vertriebspartner der Gruppe – autonom agierend (Manuel Thaler)",
  },
  {
    ebene: 2,
    name: SOLENSA.name,
    badge: "Neu seit 2025",
    text: "Digitalisierung, Cyber Security & Internet of Energy (Alexander Messmer)",
  },
];

/**
 * Registerdaten der operativen Gesellschaften – öffentlich abfragbar.
 * AT aus src/lib/site.js (Firmenbuch), DE aus dem Impressum von oekovolt.de.
 */
export const GESELLSCHAFTEN = {
  at: {
    land: FIRMA.land,
    flagge: "AT",
    name: FIRMA.name,
    sitz: `${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}`,
    register: `Firmenbuch ${FIRMA.firmenbuch}`,
    gericht: FIRMA.firmenbuchgericht,
    eingetragen: "16. Februar 2012",
    ustId: FIRMA.uid,
    gisa: FIRMA.gisa,
    website: FIRMA.web,
  },
  de: {
    land: SCHWESTER.land,
    flagge: "DE",
    name: SCHWESTER.name,
    sitz: `${SCHWESTER.strasse}, ${SCHWESTER.plz} ${SCHWESTER.ort}`,
    register: `Handelsregister ${SCHWESTER.register.split(",")[0]}`,
    gericht: SCHWESTER.register.split(",")[1]?.trim() || "Amtsgericht Memmingen",
    eingetragen: "15. April 2010",
    ustId: "DE270816873",
    website: SCHWESTER.web,
  },
};

/**
 * Projekt- und Beteiligungsgesellschaften – im österreichischen Firmenbuch
 * abfragbar. Bewusst ohne Ausschmückung: reine Registerangaben.
 */
export const BETEILIGUNGEN = [
  {
    name: "ÖkoInvest GmbH",
    register: "FN 541505g",
    gericht: "Landesgericht Ried im Innkreis",
    sitz: "Gewerbegebiet 10, 5121 Ostermiething",
    eingetragen: "10. September 2020",
  },
  {
    name: "GFL – PV-Kraftwerk GmbH",
    register: "FN 617005k",
    gericht: "Landesgericht Ried im Innkreis",
    sitz: "Gewerbegebiet 10, 5121 Ostermiething",
    eingetragen: "2023",
  },
  {
    name: "HIL PV Kraftwerk GmbH",
    register: "FN 646495d",
    gericht: "Landesgericht Ried im Innkreis",
    sitz: "Gewerbegebiet 10, 5121 Ostermiething",
  },
];

/**
 * Chronologie – speist die Zeitleiste.
 * `text` ist ein Array: Ereignisse desselben Jahres gehören in EINE Station.
 */
export const MEILENSTEINE = [
  {
    jahr: "2010",
    titel: "Der Anfang",
    text: [
      "Andreas Wegscheider und Susanne Messmer gründen die ÖKOVOLT GmbH in Burgau und ziehen wenige Wochen später nach Türkheim im Unterallgäu, wo das Stammhaus der Gruppe bis heute zu Hause ist.",
      "Noch im selben Jahr gründen sie mit der ÖKOVOLT Montage GmbH ihre eigene Montagegesellschaft. Von Beginn an gilt: Planung, Bau und Inbetriebnahme kommen aus einer Hand – mit eigenen Montageteams und einem festen Ansprechpartner.",
    ],
    icon: "Building2",
    hervorgehoben: true,
  },
  {
    jahr: "2012",
    titel: "Nach Österreich – und vom Dach aufs Feld",
    text: [
      `Am 16. Februar 2012 wird die ${FIRMA.name} ins österreichische Firmenbuch eingetragen: Die Gruppe überschreitet die Grenze – mit Sitz in ${FIRMA.ort}, an der Salzach im Innviertel.`,
      "Im selben Jahr gehen die Gründer den nächsten Schritt: Solarparks. Sie bauen sie nicht nur, sie betreiben sie auch selbst – mit einer eigenen Betreibergesellschaft je Park.",
    ],
    icon: "Flag",
    hervorgehoben: true,
  },
  {
    jahr: "2013",
    titel: "Vor der eigenen Haustür",
    text: [
      "Mit der Irsingen Solarstrom GmbH & Co. KG entsteht ein Solarpark direkt in Irsingen, einem Ortsteil von Türkheim. Er zeigt, dass Energiewende auch lokal funktioniert: sauberer Strom, erzeugt dort, wo wir leben und arbeiten.",
    ],
    icon: "Home",
  },
  {
    jahr: "2020",
    titel: "Eine Projektgesellschaft für große Flächen",
    text: [
      "Im September 2020 wird die ÖkoInvest GmbH mit Sitz in Ostermiething eingetragen – die Projektgesellschaft für Freiflächen-PV, Agri-PV, Contracting und PPA, an der die Ökovolt Solartechnik GmbH heute mit 22,60 % beteiligt ist.",
    ],
    icon: "TrendingUp",
  },
  {
    jahr: "2021",
    titel: "30 MWp und ein Landesversorger als Partner",
    text: [
      "Allein 2021 errichtet die Ökovolt Solartechnik GmbH PV-Anlagen mit 30 MWp Leistung und zählt damit zu den TOP 3 der EPC-Errichter Österreichs.",
      "Im selben Jahr beteiligt sich die Salzburg AG, einer der großen österreichischen Landesenergieversorger, mit 49 % an der österreichischen Gesellschaft – eine Partnerschaft, die bis heute besteht. Ökovolt wird bevorzugter PV-Errichter des Salzburg AG Konzerns.",
      "In Deutschland ordnen die Gründer ihre Solarparks neu und bündeln sie in ihrer Beteiligungsgesellschaft; das Stammhaus in Türkheim konzentriert sich seitdem ganz auf Planung, Bau und Inbetriebnahme für Gewerbe, Industrie, Kommunen und Landwirtschaft.",
    ],
    icon: "Network",
    hervorgehoben: true,
  },
  {
    // Bewusst ohne Länderbezug: Der Schweizer Franchisepartner ist seit dem
    // 30.04.2026 in Konkurs. Die Aussage selbst bleibt wahr.
    jahr: "2022",
    titel: "Aus einem Konzept wird ein Franchisesystem",
    text: [
      "Ökovolt öffnet sein Konzept erstmals für Partner und startet ein eigenes Franchisesystem. Unternehmer, die Photovoltaik mit demselben Anspruch umsetzen wollen, arbeiten seitdem unter dem Namen Ökovolt – mit unserem Know-how aus Planung, Bau und über einem Jahrzehnt Anlagenbetrieb.",
    ],
    icon: "Handshake",
  },
  {
    jahr: "2025",
    titel: "Die zweite Generation",
    text: [
      `Alexander Messmer bringt mit der ${SOLENSA.name} Digitalisierung, Cyber Security und Softwareentwicklung in die Gruppe – die Grundlage für Fernwartung, SCADA und das Internet of Energy.`,
    ],
    icon: "Code",
  },
  {
    jahr: "Heute",
    titel: "Aus Ostermiething für ganz Österreich",
    text: [
      "Über 15 Jahre Erfahrung in der Gruppe, seit 2012 in Österreich – für Unternehmen, Landwirtschaft, Gemeinden und Landesversorger in allen neun Bundesländern. Dahinter stehen bis heute dieselben Gründer, die 2010 angefangen haben. Und wir machen weiter: mit eigenen Parkreglern, Fernwartung und SCADA, mit Speichern, Energiegemeinschaften und intelligentem Energiemanagement.",
    ],
    icon: "Sunrise",
    hervorgehoben: true,
  },
];
