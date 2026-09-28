// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 2340/2351.

const moedling = {
  name: "Mödling",
  bundesland: "Niederösterreich",
  land: "niederoesterreich",
  bezirk: "Bezirk Mödling",
  plz: "2340",
  alpin: false,
  beschreibung:
    "Photovoltaik in Mödling und Wiener Neudorf: PV für das Industriezentrum NÖ-Süd mit rund 380 Betrieben, Logistik und Handel – Netz NÖ oder Wiener Netze.",
  titel: "Photovoltaik für Mödling –",
  akzent: "und das Industriezentrum NÖ-Süd.",
  lead: "Südlich von Mödling liegt das größte Gewerbegebiet Österreichs: das Industriezentrum Niederösterreich Süd mit rund 280 Hektar, etwa 380 Unternehmen und über 11.000 Beschäftigten. Hallendächer, Logistikflächen und Firmenzentralen – ein Schwerpunkt für Gewerbe-PV.",
  einleitungTitel: "Das größte Gewerbegebiet Österreichs",
  einleitung: [
    "Mödling ist mit rund 20.700 Einwohnerinnen und Einwohnern Bezirkshauptstadt und bildet mit den Nachbargemeinden einen südlichen Arm des Wiener Ballungsraums. Viele Großbetriebe sind aus Mödling in das Industriezentrum NÖ-Süd abgewandert, das größtenteils auf dem Gemeindegebiet von Wiener Neudorf liegt, dazu in Biedermannsdorf, Guntramsdorf und Laxenburg.",
    "Das IZ NÖ-Süd wurde 1962 gegründet und wird heute von ecoplus verwaltet. 2025 waren dort etwa 380 Unternehmen mit über 11.360 Beschäftigten ansässig – jeder fünfte Arbeitsplatz im Bezirk Mödling. Der Standort hat Anschlussbahnen, Frachtenbahnhof und zwei Autobahnabfahrten und ist fast vollständig mit biogener Fernwärme erschlossen.",
    "Beim Stromnetz liegt der Bezirk an der Grenze zweier Netzgebiete: Für die Postleitzahlen 2340 und 2351 nennt die E-Control sowohl die Netz Niederösterreich als auch die Wiener Netze. Welcher Betreiber zuständig ist, entscheidet sich je Standort – wir klären das über die Zählpunktnummer.",
  ],
  schwerpunkte: [
    {
      titel: "Logistik und Großhandel",
      text: "Lagerhallen mit Kühlung, Fördertechnik und Ladeinfrastruktur für E-Flotten verbrauchen tagsüber viel Strom. Große Flachdächer tragen Anlagen im Megawatt-Bereich, wenn Statik und Netz passen.",
    },
    {
      titel: "Firmenzentralen und Büros",
      text: "Klimatisierung und IT laufen parallel zur Solarkurve. Fassaden- und Carport-Anlagen ergänzen das Dach, wenn die Fläche knapp ist.",
    },
    {
      titel: "Zwei Netzgebiete",
      text: "Netz Niederösterreich oder Wiener Netze: Ablauf, Formulare und technische Anforderungen unterscheiden sich. Wir stellen die Netzanfrage beim zuständigen Betreiber.",
    },
  ],
  wirtschaft: {
    titel: "Industriezentrum NÖ-Süd",
    text: "Das IZ NÖ-Süd ist mit rund 280 ha das größte Gewerbegebiet Österreichs und neben der Shopping City Süd einer der größten Wirtschaftsstandorte im Süden Wiens.",
    punkte: [
      { titel: "380 Unternehmen", text: "Etwa 380 nationale und internationale Unternehmen mit über 11.360 Beschäftigten (2025), darunter Logistik, Handel und Industrie." },
      { titel: "Infrastruktur", text: "Anschlussbahnen, Frachtenbahnhof, Zollamt, zwei Autobahnabfahrten und ein Parkhaus für angesiedelte Unternehmen." },
      { titel: "Fernwärme", text: "Fast vollständig mit biogener Fernwärme aus dem Biomasseheizkraftwerk Mödling und einem Biomasseheizwerk im IZ erschlossen." },
    ],
    url: "https://de.wikipedia.org/wiki/Industriezentrum_Nieder%C3%B6sterreich_S%C3%BCd",
    quelle: "Wikipedia: Industriezentrum Niederösterreich Süd",
  },
  anfahrt: "Über die Westautobahn A1 und die Außenring-Autobahn A21.",
  faq: [
    {
      q: "Wer ist im IZ NÖ-Süd und in Mödling Netzbetreiber?",
      a: "Für die Postleitzahlen 2340 (Mödling) und 2351 (Wiener Neudorf) nennt der E-Control-Tarifkalkulator zwei Verteilnetzbetreiber: die Netz Niederösterreich GmbH und die Wiener Netze GmbH. Maßgeblich ist die Zählpunktnummer auf Ihrer Stromrechnung.",
    },
    {
      q: "Brauche ich für eine Hallenanlage im Industriezentrum eine Bewilligung?",
      a: "Baurechtlich nicht: Nach § 17 Z 14 NÖ Bauordnung 2014 ist PV auf Bauwerken bewilligungs-, anzeige- und meldefrei. Ist die Halle Teil einer gewerblichen Betriebsanlage, prüfen wir zusätzlich, ob gewerberechtlich etwas zu melden ist.",
    },
    {
      q: "Lohnt sich PV für eine Logistikhalle mit Fernwärme-Heizung?",
      a: "Ja, wenn tagsüber Strom für Kühlung, Fördertechnik, Beleuchtung oder Ladepunkte gebraucht wird. Die Heizung spielt dafür keine Rolle; entscheidend ist der Stromlastgang, den wir vorab auswerten.",
    },
  ],
  cta: {
    titel: "Halle im Industriezentrum NÖ-Süd?",
    text: "Wir klären den Netzbetreiber, prüfen Statik und Einspeisekapazität und rechnen die Anlage auf Ihren Lastgang.",
  },
  links: [{ href: "/gewerbespeicher", label: "Gewerbespeicher" }],
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Netz Niederösterreich GmbH / Wiener Netze GmbH",
      kurz: "Netz NÖ / Wiener Netze",
      hinweis: "Für PLZ 2340 und 2351 nennt die E-Control beide Netzbetreiber – Zuständigkeit je Standort über die Zählpunktnummer prüfen.",
      url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern",
    },
  },
};

export default moedling;
