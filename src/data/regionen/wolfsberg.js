// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 9400.

const wolfsberg = {
  name: "Wolfsberg",
  bundesland: "Kärnten",
  land: "kaernten",
  bezirk: "Bezirk Wolfsberg (Lavanttal)",
  plz: "9400",
  alpin: false,
  beschreibung:
    "Photovoltaik in Wolfsberg und im Lavanttal: PV für Metallverarbeitung, Maschinenbau, Tubenfertigung und Landwirtschaft – KNG-Kärnten Netz, K-BO, PVGIS.",
  titel: "Photovoltaik für Wolfsberg –",
  akzent: "Metallverarbeitung im Lavanttal.",
  lead: "Wolfsberg ist Bezirkshauptstadt des Lavanttals und Standort vieler kleiner und mittlerer Metallbetriebe. Dazu kommen Maschinenbau, eine Tubenfabrik, Elektro- und Automationstechnik – und eine Landwirtschaft mit großen Dachflächen.",
  einleitungTitel: "Das Lavanttal als Werkstatt",
  einleitung: [
    "Die Stadtgemeinde Wolfsberg hat rund 25.000 Einwohnerinnen und Einwohner und umfasst weite Teile des mittleren Lavanttals. Zwischen 1991 und 2001 wuchs die Zahl der Beschäftigten um rund 26 %, die der Arbeitgeber um 41 % – ein Zeichen für den starken Mittelstand.",
    "Prägend ist die metallverarbeitende Industrie mit vielen kleinen und mittleren Betrieben, dazu Maschinenbau in St. Stefan, eine Tubenfertigung in Kleinedling und ein Metallbau-Unternehmen in Schwemmtratten. Solche Betriebe haben Hallen mittlerer Größe und Verbrauch während der Schichtzeiten.",
    "Das Lavanttal liegt im Süden Österreichs, geschützt von Kor- und Saualpe. Laut PVGIS erzeugt ein Süddach hier rund 8 % mehr als an unserem Firmensitz – bei gleichzeitig hohem Eigenverbrauch in Gewerbe und Landwirtschaft.",
  ],
  schwerpunkte: [
    {
      titel: "Metallbetriebe mit Schichtbetrieb",
      text: "Schweißen, Zerspanen und Lackieren brauchen tagsüber viel Leistung. Wir legen die Anlage auf den Lastgang aus und prüfen, ob ein Speicher Leistungsspitzen glättet.",
    },
    {
      titel: "Landwirtschaft im Lavanttal",
      text: "Obstbau, Tierhaltung und Maschinenhallen bieten große Dachflächen. Auch Agri-PV über Kulturen kann hier sinnvoll sein – wir prüfen Widmung und Förderung.",
    },
    {
      titel: "Einfaches Baurecht",
      text: "In Kärnten sind Anlagen zur Erzeugung erneuerbarer Energie mitteilungspflichtig; eine Baubewilligung braucht es für Dachanlagen nicht.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaft im Raum Wolfsberg",
    text: "Neben Handel und Dienstleistungen ist in Wolfsberg vor allem die metallverarbeitende Industrie mit vielen kleinen und mittleren Betrieben ansässig.",
    punkte: [
      { titel: "Maschinenbau in St. Stefan", text: "Ein Maschinenbauunternehmen sowie ein Elektro- und Automationstechniker haben ihren Standort im Ortsteil St. Stefan." },
      { titel: "Tubenfertigung", text: "In Kleinedling produziert eine Tubenfabrik." },
      { titel: "Metall- und Stahlbau", text: "In Schwemmtratten ist eine Unternehmensgruppe aus dem Metallbereich ansässig." },
    ],
    url: "https://de.wikipedia.org/wiki/Wolfsberg_(K%C3%A4rnten)",
    quelle: "Wikipedia: Wolfsberg (Kärnten) – Wirtschaft",
  },
  anfahrt: "Über die Tauernautobahn A10 und die Südautobahn A2.",
  faq: [
    {
      q: "Wer ist in Wolfsberg Netzbetreiber?",
      a: "Für die Postleitzahl 9400 nennt der E-Control-Tarifkalkulator die KNG-Kärnten Netz GmbH als Verteilnetzbetreiber.",
    },
    {
      q: "Ist Agri-PV im Lavanttal möglich?",
      a: "Grundsätzlich ja. Für Anlagen auf landwirtschaftlichen Flächen sind in Kärnten Widmung und die Kärntner Photovoltaikanlagen-Verordnung maßgeblich. Wir prüfen mit der Gemeinde, ob und wie eine Fläche genutzt werden kann.",
    },
    {
      q: "Wie viel Strom erzeugt eine Hallenanlage mit 200 kWp in Wolfsberg?",
      a: "Rechnerisch rund 247.000 kWh im Jahr bei Südausrichtung mit 35° bzw. rund 201.000 kWh in flacher Ost-West-Aufstellung, laut PVGIS-Simulation. Wie viel davon im Betrieb bleibt, zeigt die Auswertung Ihres Lastgangs.",
    },
  ],
  cta: {
    titel: "Metallbetrieb oder Hof im Lavanttal?",
    text: "Vorplanung mit Ihren Daten, Netzanfrage bei der KNG und Begehung vor dem verbindlichen Angebot.",
  },
  links: [{ href: "/agri-pv", label: "Agri-PV für landwirtschaftliche Flächen" }],
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "KNG-Kärnten Netz GmbH",
      kurz: "KNG-Kärnten Netz",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiber für PLZ 9400.",
      url: "https://kaerntennetz.at/pv.htm",
    },
  },
};

export default wolfsberg;
