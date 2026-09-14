// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const friedrichshafen = {
  name: "Friedrichshafen",
  bundesland: "Baden-Württemberg",
  seoTitel: "Photovoltaik Friedrichshafen: höchster Ertrag am Bodensee | Ökovolt",
  beschreibung:
    "Photovoltaik in Friedrichshafen: der höchste simulierte Solarertrag in unserem Einzugsgebiet, Häfler Klimafonds für Speicher und Fassaden-PV, erste Agri-PV-Anlage der Stadt, Stadtwerk am See als Netzbetreiber.",
  eyebrow: "Photovoltaik in Friedrichshafen",
  titel: "Am Bodensee scheint mehr Sonne –",
  akzent: "Friedrichshafen führt unsere Ertragsliste an.",
  lead: "Von allen Städten, für die wir Standortdaten aufbereitet haben, simuliert PVGIS in Friedrichshafen den höchsten Jahresertrag. Dazu kommen ein städtischer Klimafonds und eine Region, in der Photovoltaik auf Dach und Weide gleichermaßen wächst.",
  einleitungTitel: "Seeklima, Klimafonds und die erste Agri-PV",
  einleitung: [
    "Mit rund 1.170 kWh je kWp für ein Süddach mit 35° liegt Friedrichshafen gut 2 % über unserem Firmensitz Türkheim und vor allen anderen Städten in unserem Einzugsgebiet. Auch Ost-West-Dächer kommen hier auf fast 1.000 kWh je kWp. Die Schneelast ist mit Zone 1 niedrig.",
    "Die Stadt finanziert Klimaschutz über den Häfler Klimafonds. Das Förderprogramm unterstützt Eigenstromspeicher mit 1.500 € pauschal, Fassaden-Photovoltaik mit 500 € je kWp und Balkonkraftwerke – das Budget für 2026 ist allerdings bereits ausgeschöpft. Bis 2040 will Friedrichshafen klimaneutral sein.",
    "Mit 98 Kilometern Luftlinie gehört Friedrichshafen gerade noch zu unserem regionalen Einzugsgebiet, im nahen Ravensburg haben wir bereits eine Flachdachanlage gebaut. In Schnetzenhausen entsteht gerade die erste Agri-PV-Anlage der Stadt – mit Galloway-Rindern unter den Modulen.",
  ],
  schwerpunkte: [
    {
      titel: "Ost-West lohnt sich hier besonders",
      text: "Wo schon Ost-West-Dächer fast 1.000 kWh je kWp erreichen, ist die Frage nicht, ob sich Photovoltaik lohnt, sondern wie viel vom Tag Sie abdecken. Ost-West verteilt den Ertrag gleichmäßiger – ideal für Haushalte mit hohem Tagesverbrauch.",
    },
    {
      titel: "Speicher und Fassade für 2027 vormerken",
      text: "Der Häfler Klimafonds hat Speicher und Fassaden-PV zuletzt großzügig gefördert, Inhaber der Häfler Karte bekommen den doppelten Satz. Wer 2027 plant, sollte den Neustart des Programms im Blick behalten.",
    },
    {
      titel: "Landwirtschaft: Agri-PV am Bodensee",
      text: "Das Projekt in Schnetzenhausen zeigt, dass Weide und Solarstrom zusammenpassen. Für landwirtschaftliche Betriebe rund um Friedrichshafen planen wir Hofdächer und Agri-PV nach DIN SPEC 91434.",
    },
  ],
  faq: [
    {
      q: "Wie viel Strom erzeugt eine PV-Anlage in Friedrichshafen?",
      a: "PVGIS simuliert für ein Süddach mit 35° rund 1.170 kWh je kWp im Jahr, für Ost-West-Dächer mit 15° rund 970 kWh. Das ist der höchste Wert unter den Städten in unserem Einzugsgebiet. In Angeboten rechnen wir vorsichtiger und mit der Verschattung Ihres Dachs.",
    },
    {
      q: "Welche Förderung gibt es in Friedrichshafen?",
      a: "Das städtische Förderprogramm Klimaschutz (Häfler Klimafonds) fördert Eigenstromspeicher (1.500 € pauschal), Fassaden-PV (500 €/kWp, max. 5.000 €) und Balkonkraftwerke. Laut Stadt ist das Budget 2026 ausgeschöpft; Anträge sind erst wieder mit neuen Mitteln möglich.",
    },
    {
      q: "Wer ist Netzbetreiber in Friedrichshafen?",
      a: "Die Stadtwerk am See GmbH & Co. KG. Jede PV-Anlage ist unabhängig von der Größe anzumelden, eingespeist wird erst nach Einbau des Zweirichtungszählers. Die Anmeldung übernehmen wir.",
    },
    {
      q: "Wo gibt es in Friedrichshafen neutrale PV-Beratung?",
      a: "Über 40 ehrenamtliche PV-Scouts im Bodenseekreis beraten kostenlos, geschult von der Energieagentur. Einen ersten Überblick liefert der Solaratlas Bodenseekreis.",
    },
  ],
  cta: {
    titel: "Bodensee-Sonne auf Ihr Dach.",
    text: "Vor-Ort-Termin mit Prüfung von Dach, Zählerschrank und Ausrichtung – und ein Angebot, das den Standortvorteil ehrlich einrechnet.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "Stadtwerk am See GmbH & Co. KG",
      hinweis: "Verteilnetzbetreiber u. a. für Friedrichshafen; jede PV-Anlage anmeldepflichtig.",
      anmeldung_url: "https://www.stadtwerk-am-see.de/erzeugungsanlage",
      url: "https://www.stadtwerk-am-see.de/de/Netz1/Stromnetz/Netzzugang-Entgelte/Datenblatt-SWSee-Netzbetreiber-Strom.pdf",
    },
    solarkataster: [
      { name: "Solaratlas Bodenseekreis", traeger: "Bodenseekreis mit Energieagentur", url: "https://www.energieagentur-ravensburg.de/privathaushalte/solarenergie/solaratlas-bodenseekreis.html" },
      { name: "Energieatlas Baden-Württemberg – Dachflächen", traeger: "Land (LUBW)", url: "https://www.energieatlas-bw.de/sonne/dachflachen" },
    ],
    foerderprogramme: [
      {
        name: "Förderprogramm Klimaschutz (Häfler Klimafonds)",
        traeger: "Stadt Friedrichshafen",
        gegenstand: "Eigenstromspeicher, Fassaden-PV, Balkonkraftwerke",
        konditionen: "Speicher 1.500 € pauschal; Fassaden-PV 500 €/kWp, max. 5.000 €; Balkon 50 %, max. 300 €",
        status: "Budget 2026 ausgeschöpft",
        url: "https://www.friedrichshafen.de/buerger-stadt/planen-bauen-umwelt/umwelt-klimaschutz/module-foerderprogramm-klimaschutz/",
      },
    ],
    klimaziel: { text: "Klimaneutral bis 2040 (Maßnahmenplan „Friedrichshafen klimaneutral 2040“).", url: "https://www.friedrichshafen.de/buerger-stadt/planen-bauen-umwelt/umwelt-klimaschutz/energie-klima/" },
    schneelastzone: { zone: "1", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    gelaendehoehe_m: { wert: 404, url: "https://www.friedrichshafen.de/buerger-stadt/die-stadt/zahlen-daten-fakten/" },
    besonderheiten: [
      { text: "Erste Agri-PV-Anlage der Stadt in Schnetzenhausen: über 1 MW mit Beweidung durch Galloway-Rinder, Fertigstellung für Oktober 2026 geplant.", url: "https://www.friedrichshafen.de/buerger-stadt/planen-bauen-umwelt/umwelt-klimaschutz/detailseite/nachrichten/erste-agri-pv-anlage-entsteht-in-schnetzenhausen/" },
      { text: "Über 40 ehrenamtliche PV-Scouts im Bodenseekreis beraten kostenlos.", url: "https://www.friedrichshafen.de/buerger-stadt/planen-bauen-umwelt/umwelt-klimaschutz/energie-klima/beratung-foerderung-klimaschutzprogramme/" },
    ],
    energieberatung: { name: "Energieagentur Bodenseekreis", url: "https://www.friedrichshafen.de/buerger-stadt/planen-bauen-umwelt/umwelt-klimaschutz/energie-klima/beratung-foerderung-klimaschutzprogramme/" },
  },
};

export default friedrichshafen;
