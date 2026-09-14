// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const konstanz = {
  name: "Konstanz",
  bundesland: "Baden-Württemberg",
  seoTitel: "Photovoltaik Konstanz: Altstadt-Solarkataster & Förderung | Ökovolt",
  beschreibung:
    "Photovoltaik in Konstanz: Altstadt-Solarkataster mit roten, gelben und grünen Dachflächen, städtische Förderung für PV mit Wärmepumpe, 300 € der Stadtwerke, aufsuchende PV-Beratung und standortgenauer Ertrag am See.",
  eyebrow: "Photovoltaik in Konstanz",
  titel: "Konstanz kartiert seine Altstadtdächer –",
  akzent: "rot, gelb oder grün für Solar.",
  lead: "Die Konstanzer Altstadt steht als Gesamtanlage unter Denkmalschutz, trotzdem sollen dort Solaranlagen möglich werden. Das Altstadt-Solarkataster zeigt Dach für Dach, wie gut das geht – und außerhalb der Altstadt fördert die Stadt Photovoltaik, wenn gleichzeitig die Heizung erneuert wird.",
  einleitungTitel: "Denkmal und Klimaziel zusammenbringen",
  einleitung: [
    "Rund 500 Kulturdenkmale und 400 erhaltenswerte Gebäude prägen die Konstanzer Altstadt, die seit 1982 als Gesamtanlage geschützt ist. Die Dachlandschaft gilt als wesentliches Schutzmerkmal. Mit dem Altstadt-Solarkataster hat die Stadt alle Dachflächen nach ihrer Bedeutung für Sichtachsen, Straßen- und Platzbilder bewertet und Fallgruppen zugeordnet – rot, gelb oder grün.",
    "Konstanz will bis 2035 weitgehend klimaneutral werden und fördert dafür gezielt Kombinationen: Wer innerhalb von zwölf Monaten vor oder nach dem Umstieg auf eine Wärmepumpe eine PV-Anlage baut, bekommt 1.000 € pro Gebäude, bei weitgehender Dachbelegung oder zusätzlichen Fassaden- und Nordmodulen 2.000 €. Die Stadtwerke Konstanz geben Kunden ihres Ökostromtarifs zusätzlich 300 € je neuer Anlage.",
    "Die Stadtwerke Konstanz sind auch Netzbetreiber. Die Anmeldung empfehlen sie vier bis acht Wochen vor Installationsbeginn – das planen wir in den Zeitplan ein.",
  ],
  schwerpunkte: [
    {
      titel: "Wärmepumpe und PV in einem Projekt",
      text: "Die städtische Förderung setzt voraus, dass Heizungstausch und PV-Anlage innerhalb eines Jahres zusammenkommen. Wir stimmen die Anlagengröße auf den Wärmepumpenstrom ab und beachten die 80-%-Belegung für den höheren Satz.",
    },
    {
      titel: "Altstadt: erst ins Kataster schauen",
      text: "Liegt Ihr Dach in einer grünen oder gelben Fallgruppe, ist eine Solaranlage deutlich realistischer als bei roten Flächen. Wir planen danach Modulart, Farbe und Belegung und bereiten die Abstimmung mit der Denkmalbehörde vor.",
    },
    {
      titel: "Aufsuchende PV-Beratung",
      text: "Im Rahmen der Solaroffensive berät die Energieagentur Kreis Konstanz anbieterunabhängig bei Ihnen vor Ort. Eine gute Grundlage, bevor Sie Angebote einholen – auch unseres.",
    },
  ],
  faq: [
    {
      q: "Kann ich in der Konstanzer Altstadt eine Solaranlage bauen?",
      a: "Die Altstadt ist als Gesamtanlage denkmalgeschützt. Das Altstadt-Solarkataster ordnet alle Dachflächen nach ihrer Bedeutung für das Stadtbild Fallgruppen zu (rot, gelb, grün) und soll Solaranlagen dort ermöglichen, wo das historische Bild nicht wesentlich beeinträchtigt wird. Die denkmalrechtliche Abstimmung bleibt nötig.",
    },
    {
      q: "Welche PV-Förderung gibt es in Konstanz 2026?",
      a: "Die Stadt fördert PV in Kombination mit einer Wärmepumpe (1.000 €, bei mindestens 80 % Dachbelegung oder zusätzlichen Fassaden-/Nordmodulen 2.000 €) und Balkon-PV mit 150 € je Wohneinheit. Die Stadtwerke zahlen Kunden des Tarifs SeeEnergie ÖkostromFairPlus 300 € je neuer Anlage.",
    },
    {
      q: "Wann muss ich meine PV-Anlage in Konstanz anmelden?",
      a: "Die Stadtwerke Konstanz als Netzbetreiber empfehlen die digitale Anmeldung vier bis acht Wochen vor Installationsbeginn. Nach der Inbetriebnahme folgt innerhalb von vier Wochen der Eintrag im Marktstammdatenregister. Beides übernehmen wir.",
    },
    {
      q: "Wie hoch ist der Solarertrag in Konstanz?",
      a: "Für ein Süddach mit 35° simuliert PVGIS rund 1.130 kWh je kWp im Jahr, gut 1 % weniger als in Türkheim. Die Schneelast ist mit Zone 1 gering, was vor allem bei Flachdächern und Aufständerung hilft.",
    },
  ],
  cta: {
    titel: "Konstanz: Wärmepumpe und Solar zusammen gedacht.",
    text: "Erstberatung per Video, Unterlagen per Smartphone, Vor-Ort-Termin – und ein Angebot, das die städtische Kombi-Förderung berücksichtigt.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "Stadtwerke Konstanz GmbH",
      hinweis: "Anmeldung 4–8 Wochen vor Installationsbeginn über das Netzportal.",
      anmeldung_url: "https://www.stadtwerke-konstanz.de/netze/einspeisung/anschluss-pv-anlage/",
      url: "https://www.stadtwerke-konstanz.de/netze/einspeisung/anschluss-pv-anlage/",
    },
    solarkataster: [
      { name: "Altstadt-Solarkataster Konstanz", traeger: "Stadt Konstanz", url: "https://www.konstanz.de/altstadt-solarkataster" },
      { name: "Energieatlas Baden-Württemberg – Dachflächen", traeger: "Land (LUBW)", url: "https://www.energieatlas-bw.de/sonne/dachflachen" },
    ],
    foerderprogramme: [
      {
        name: "Breitenförderung B.3 – PV mit Wärmepumpe",
        traeger: "Stadt Konstanz",
        gegenstand: "PV-Anlage bis 12 Monate vor/nach Heizungstausch auf Wärmepumpe",
        konditionen: "1.000 € je Gebäude, 2.000 € bei ≥ 80 % Dachbelegung oder Fassaden-/Nordmodulen",
        status: "laufend 2026",
        url: "https://www.konstanz.de/stadtwandel/foerderprogramme/breitenfoerderung",
      },
      {
        name: "Breitenförderung B.8 – Balkon-PV",
        traeger: "Stadt Konstanz",
        gegenstand: "Balkon-, Fassaden- oder Nebengebäudeanlagen",
        konditionen: "150 € je Anlage und Wohneinheit",
        status: "laufend 2026",
        url: "https://www.konstanz.de/stadtwandel/foerderprogramme/breitenfoerderung",
      },
      {
        name: "300 € für jede neue PV-Anlage",
        traeger: "Stadtwerke Konstanz (Tarif SeeEnergie ÖkostromFairPlus)",
        gegenstand: "neue PV-Anlage ab 1,5 kW Wechselrichterleistung",
        konditionen: "300 € pauschal",
        status: "laufend",
        url: "https://www.stadtwerke-konstanz.de/blog/300-euro-fuer-jede-neue-pv-anlage/",
      },
    ],
    klimaziel: { text: "Bis 2035 weitgehend klimaneutral (Klimaschutzstrategie, Gemeinderat 25.11.2021).", url: "https://www.konstanz.de/stadtwandel/konzepte+und+chronologie/klimaschutzstrategie" },
    schneelastzone: { zone: "1", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    ortsbild: [
      {
        text: "Altstadt seit 1982 Gesamtanlage nach § 19 DSchG BW (ca. 500 Kulturdenkmale). Das Altstadt-Solarkataster ordnet alle Dächer Fallgruppen rot, gelb, grün zu.",
        url: "https://www.konstanz.de/altstadt-solarkataster",
      },
    ],
    besonderheiten: [
      { text: "32 PV-Anlagen auf städtischen Dächern erzeugen jährlich rund 1,34 Mio. kWh, überwiegend für den Eigenverbrauch der Gebäude.", url: "https://www.konstanz.de/leben+in+konstanz/umwelt/klima+_+energie/photovoltaik-ausbau" },
      { text: "„SeeEnergie Sonnenkraft“: Beteiligungsmodell der Stadtwerke für regionale PV-Projekte.", url: "https://www.stadtwerke-konstanz.de/blog/regionale-energiewende-gemeinsam-in-die-zukunft/" },
    ],
    energieberatung: { name: "Energieagentur Kreis Konstanz – aufsuchende, anbieterunabhängige PV-Beratung", url: "https://www.energieagentur-kreis-konstanz.de/privatpersonen/solaroffensive-privatpersonen/" },
  },
};

export default konstanz;
