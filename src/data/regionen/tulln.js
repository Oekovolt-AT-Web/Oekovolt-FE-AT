// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 3430.

const tulln = {
  name: "Tulln an der Donau",
  kurzname: "Tulln",
  bundesland: "Niederösterreich",
  land: "niederoesterreich",
  bezirk: "Bezirk Tulln",
  plz: "3430",
  alpin: false,
  beschreibung:
    "Photovoltaik in Tulln an der Donau: PV für Zuckerindustrie, Gärtnereien, Messe, Fahrzeugbau und Agrarbiotechnologie – Netz Niederösterreich, NÖ Bauordnung.",
  titel: "Photovoltaik für Tulln –",
  akzent: "Gartenstadt, Messestadt, Agrarindustrie.",
  lead: "Tulln ist als Gartenstadt bekannt, hat aber auch eine der großen Zuckerfabriken Österreichs mit dem zweitgrößten Zuckersilo Europas, ein überregionales Messegelände und ein Technopol für Agrar- und Umweltbiotechnologie.",
  einleitungTitel: "Zucker, Gärtnereien und Biotechnologie",
  einleitung: [
    "Die Bezirkshauptstadt hat rund 16.800 Einwohnerinnen und Einwohner und ist ein Verkehrsknoten an der Donau. Seit 1937 steht hier eine Zuckerfabrik mit dem zweitgrößten Zuckersilo Europas (rund 70.000 Tonnen) und einem Forschungszentrum des Konzerns.",
    "Am Stadtrand liegen zahlreiche Gärtnereien und Pflanzenzuchtbetriebe – Glashäuser, Kühlräume und Bewässerung mit Strombedarf zur Sonnenzeit. Dazu kommen ein Fahrzeugbauer, Elektro- und Steinmetzbetriebe sowie das Messegelände mit großen Hallendächern.",
    "Das Technopol Tulln und das Interuniversitäre Forschungsinstitut für Agrarbiotechnologie machen Tulln zum Forschungsstandort. Für Photovoltaik bedeutet der Mix aus Landwirtschaft, Industrie und Forschung: viele Dächer, viel Tagesverbrauch – und Möglichkeiten für Agri-PV im Umland.",
  ],
  schwerpunkte: [
    {
      titel: "Gärtnereien und Glashäuser",
      text: "Kühlung, Belüftung und Bewässerung laufen bei Sonne. Auf Nebengebäuden und Lagerhallen planen wir Anlagen mit hohem Eigenverbrauch; Glasdächer selbst bleiben für Licht frei.",
    },
    {
      titel: "Lebensmittelindustrie",
      text: "Verarbeitung mit Kampagnenbetrieb hat saisonale Spitzen. Wir legen die Anlage auf das ganze Jahr aus und prüfen Speicher und Direktvermarktung für Überschüsse.",
    },
    {
      titel: "Messe- und Veranstaltungshallen",
      text: "Große Hallendächer und Parkflächen – ideal für Dachanlagen und Solarcarports mit Ladepunkten für Besucherinnen und Besucher.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaft in Tulln",
    text: "Tulln ist eine bedeutende Geschäftsstadt und mit seinem Messegelände österreichweit bekannt.",
    punkte: [
      { titel: "Zuckerindustrie", text: "Zuckerfabrik seit 1937 mit dem zweitgrößten Zuckersilo Europas und einem Forschungs- und Innovationszentrum." },
      { titel: "Gärtnereien", text: "Viele Gärtnereien und Pflanzenzuchtbetriebe am Stadtrand geben Tulln den Beinamen Gartenstadt." },
      { titel: "Technopol Tulln", text: "Schnittstelle von Wirtschaft, Forschung und Ausbildung in der Agrar- und Umweltbiotechnologie." },
    ],
    url: "https://de.wikipedia.org/wiki/Tulln_an_der_Donau",
    quelle: "Wikipedia: Tulln an der Donau – Wirtschaft",
  },
  anfahrt: "Über die Westautobahn A1.",
  faq: [
    {
      q: "Wer ist in Tulln Netzbetreiber?",
      a: "Für die Postleitzahl 3430 nennt der E-Control-Tarifkalkulator die Netz Niederösterreich GmbH.",
    },
    {
      q: "Ist Agri-PV im Tullnerfeld möglich?",
      a: "Grundsätzlich ja. Für Anlagen im Grünland gelten in Niederösterreich die Photovoltaik-Regeln der Raumordnung; Freiflächenanlagen über 100 kW im Grünland sind nach § 15 NÖ Bauordnung anzuzeigen. Wir prüfen Widmung, Förderung und Bewirtschaftung gemeinsam mit Ihnen.",
    },
    {
      q: "Kann eine Gärtnerei ihren Solarstrom mit Nachbarbetrieben teilen?",
      a: "Ja, über eine Erneuerbare-Energie-Gemeinschaft im Netzgebiet von Netz Niederösterreich. Für Strom, der innerhalb einer lokalen oder regionalen Gemeinschaft fließt, gelten reduzierte Netzentgelte.",
    },
  ],
  cta: {
    titel: "Betrieb im Tullnerfeld?",
    text: "Vom Glashaus bis zur Industriehalle: Wir rechnen mit Ihrem Lastgang und prüfen auch Agri-PV und Energiegemeinschaft.",
  },
  links: [{ href: "/agri-pv", label: "Agri-PV für landwirtschaftliche Flächen" }],
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Netz Niederösterreich GmbH",
      kurz: "Netz NÖ",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiber für PLZ 3430.",
      url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern",
    },
    besonderheiten: [
      {
        text: "Für Photovoltaik im Grünland hat das Land Niederösterreich eigene Regeln der Raumordnung; die Fachabteilung beantwortet häufige Fragen dazu in einem FAQ.",
        url: "https://www.raumordnung-noe.at/fileadmin/root_raumordnung/land/ueberoertliche_raumordnung/FAQs_Photovoltaik_20250523.pdf",
      },
    ],
  },
};

export default tulln;
