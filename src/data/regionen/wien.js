// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 1010/1100/1210/1230.
// SEO-Plan M26/E9 (30.09.2026): /photovoltaik/wien ist die HAUPTSEITE für „Photovoltaik Wien“
// (src/lib/bundesland/auswertung.js → hauptseite("wien")). /photovoltaik-bundesland/wien bleibt als
// Datenseite „Bundesland Wien“ mit eigenem Titel bestehen – 5-Wort-Überschneidung zu dieser Seite
// 0,07 (< 0,35), daher kein 301. Titel hier bewusst unverändert.

const wien = {
  name: "Wien",
  bundesland: "Wien",
  land: "wien",
  bezirk: "Bundeshauptstadt",
  plz: "1010",
  alpin: false,
  beschreibung:
    "Photovoltaik in Wien für Gewerbe, Industrie und Immobilien: bewilligungsfrei nach § 62a BO, Solarpflicht für Neubauten, Wiener Netze, Schutzzonen, PVGIS.",
  titel: "Photovoltaik für Wien –",
  akzent: "Gewerbe, Industrie und Immobilienbestand.",
  lead: "In Wien wird rund ein Viertel der österreichischen Wirtschaftsleistung erbracht. Betriebsgebäude, Büro- und Wohnbestand bieten riesige Dachflächen – und die Bauordnung macht Photovoltaik außerhalb von Schutzzonen bewilligungsfrei, bei Neubauten sogar verpflichtend.",
  einleitungTitel: "Bewilligungsfrei, aber mit Solarpflicht",
  einleitung: [
    "Wien hat mehr als zwei Millionen Einwohnerinnen und Einwohner; 2021 waren rund 1,02 Millionen Menschen hier beschäftigt. Mit einem Bruttoinlandsprodukt von knapp 102 Milliarden Euro (2021) ist die Stadt Österreichs größter Wirtschaftsraum und für viele Konzerne Zentrale für Mittel- und Osteuropa.",
    "Baurechtlich ist Wien für Photovoltaik einfach geworden: Nach § 62a Abs. 1 Z 24a Bauordnung sind PV-Anlagen bewilligungsfrei, solange sie nicht in einer Schutzzone, im Grünland-Schutzgebiet oder in einem Gebiet mit Bausperre liegen. Für Neu- und Zubauten schreibt § 118e Solarleistung vor – bei Nicht-Wohngebäuden mindestens 1 kWp je 100 m² konditionierter Brutto-Grundfläche.",
    "Das Verteilnetz betreibt die Wiener Netze GmbH. Für Mehrparteien- und Bürohäuser bietet sie die gemeinschaftliche Erzeugungsanlage an, mit der Solarstrom vom Dach an mehrere Zählpunkte im Haus verteilt wird – ein Modell, das sich gerade für Immobilienbestand und gemischt genutzte Gewerbeobjekte eignet.",
  ],
  schwerpunkte: [
    {
      titel: "Solarpflicht bei Neubauten",
      text: "Für neue Betriebs- und Bürogebäude planen wir die Pflichtleistung nach § 118e BO gleich mit – und prüfen, ob sich mehr lohnt als das Minimum.",
    },
    {
      titel: "Gemeinschaftliche Erzeugungsanlage",
      text: "Bei Mehrparteien- und Gewerbeobjekten verteilen wir Solarstrom über eine gemeinschaftliche Erzeugungsanlage der Wiener Netze an Mieterinnen, Mieter und Allgemeinflächen.",
    },
    {
      titel: "Schutzzonen und Welterbe",
      text: "In Schutzzonen – dazu zählen große Teile der Inneren Stadt – braucht jede Anlage eine Bewilligung. Wir prüfen den Flächenwidmungs- und Bebauungsplan, bevor wir planen.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsraum Wien",
    text: "Rund ein Viertel der gesamten Wirtschaftsleistung Österreichs wird in Wien erbracht; die Stadt gilt als Drehscheibe für Mittel- und Osteuropa.",
    punkte: [
      { titel: "Konzernzentralen", text: "Zahlreiche internationale Unternehmen steuern ihre Aktivitäten in Mittel- und Osteuropa von Wien aus; dazu kommt Österreichs einzige Wertpapierbörse." },
      { titel: "Industrie in Simmering und Liesing", text: "In früheren Werken in Simmering und Liesing werden heute Spezial- und Militärfahrzeuge gebaut – Beispiele für Wiens verbliebene Großindustrie." },
      { titel: "Dienstleistung und Immobilien", text: "Büro-, Handels- und Wohnbestand machen den größten Teil der Dachflächen aus – mit Tagesverbrauch für Klima, Lüftung und IT." },
    ],
    url: "https://de.wikipedia.org/wiki/Wien",
    quelle: "Wikipedia: Wien – Wirtschaft",
  },
  anfahrt: "Über die Westautobahn A1.",
  faq: [
    {
      q: "Brauche ich in Wien eine Baubewilligung für eine PV-Anlage?",
      a: "Meist nicht. Nach § 62a Abs. 1 Z 24a Bauordnung für Wien sind Photovoltaikanlagen bewilligungsfrei, sofern sie nicht nach § 60 Abs. 1 lit. j bewilligungspflichtig sind – das betrifft Schutzzonen, das Grünland-Schutzgebiet und Gebiete mit Bausperre.",
    },
    {
      q: "Gibt es in Wien eine Solarpflicht für Betriebsgebäude?",
      a: "Ja, für Neubauten und Zubauten. Nach § 118e Abs. 3 Bauordnung für Wien sind bei Nicht-Wohngebäuden mindestens 1 kWp Solarleistung je 100 m² konditionierter Brutto-Grundfläche vorzusehen; bei Wohngebäuden gilt eine eigene Formel.",
    },
    {
      q: "Wer ist in Wien Netzbetreiber?",
      a: "Die Wiener Netze GmbH – der E-Control-Tarifkalkulator nennt sie für die Wiener Postleitzahlen. Sie vergibt auch die Einspeise-Zählpunktnummer, die Sie für das OeMAG-Förderansuchen brauchen.",
    },
  ],
  cta: {
    titel: "Betriebsgebäude oder Immobilienbestand in Wien?",
    text: "Wir prüfen Schutzzone, Statik und Netzanschluss, planen Pflichtleistung oder Gemeinschaftsanlage und rechnen die Wirtschaftlichkeit.",
  },
  links: [{ href: "/gewerbespeicher", label: "Gewerbespeicher" }],
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Wiener Netze GmbH",
      kurz: "Wiener Netze",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiberin für die Wiener Postleitzahlen.",
      url: "https://www.wienernetze.at/photovoltaik",
    },
    ortsbild: [
      {
        text: "Das Historische Zentrum von Wien ist UNESCO-Welterbe. In Schutzzonen ist eine PV-Anlage nach § 60 Abs. 1 lit. j Bauordnung bewilligungspflichtig.",
        url: "https://whc.unesco.org/en/list/1033",
      },
    ],
    klimaziel: {
      text: "Die Stadt Wien hat sich zum Ziel gesetzt, bis 2040 klimaneutral zu werden; der Ausbau von Photovoltaik auf Dächern ist ein zentraler Baustein.",
      url: "https://www.wien.gv.at/klimaschutz",
    },
    besonderheiten: [
      {
        text: "Die Wiener Netze bieten mit der gemeinschaftlichen Erzeugungsanlage ein Modell, um Solarstrom vom Dach auf mehrere Parteien eines Hauses aufzuteilen.",
        url: "https://www.wienernetze.at/gemeinschaftliche-erzeugungsanlage",
      },
    ],
  },
};

export default wien;
