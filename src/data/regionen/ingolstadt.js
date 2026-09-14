// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const ingolstadt = {
  name: "Ingolstadt",
  bundesland: "Bayern",
  seoTitel: "Photovoltaik Ingolstadt: SWI Netze, Sommerertrag & Kataster | Ökovolt",
  beschreibung:
    "Photovoltaik in Ingolstadt: Netzverträglichkeitsprüfung bei SWI Netze ab 7 kW, städtisches Solar- und Gründachkataster, Förderservice der Stadtwerke und einer der stärksten Juni-Erträge in unserem Einzugsgebiet.",
  eyebrow: "Photovoltaik in Ingolstadt",
  titel: "Ingolstadt will bis 2035 klimaneutral sein –",
  akzent: "die Dächer sind der schnellste Weg.",
  lead: "Das städtische Solarförderprogramm ist 2024 ausgelaufen, das Klimaziel ist geblieben. In Ingolstadt kommt es jetzt auf eine Anlage an, die ohne Zuschuss funktioniert – und auf eine saubere Netzanmeldung.",
  einleitungTitel: "Donau, Sommersonne und ein Netzbetreiber mit klaren Regeln",
  einleitung: [
    "Ingolstadt hat 2022 beschlossen, bis 2035 klimaneutral zu werden – 15 Jahre früher als zuvor geplant. Die Stadtwerke-Tochter SWI Stadtenergie belegt dafür städtische Dächer mit Photovoltaik; bis 2030 sollen es 3.000 bis 5.000 kWp werden.",
    "Für private Anlagen gibt es aktuell keinen städtischen Zuschuss mehr: Das 2023 beschlossene Solarförderprogramm war nur bis Ende 2024 beantragbar. Die Stadtwerke Ingolstadt bieten stattdessen eine Förderdatenbank und helfen bei Anträgen zu Bundes- und sonstigen Programmen.",
    "Die Donauebene bringt einen ausgeprägten Sommer: Für Juni simuliert PVGIS in Ingolstadt 135 kWh je kWp und damit einen der höchsten Monatswerte in unserem Gebiet, im Dezember sind es 35. Eine Anlage mit Speicher, Wallbox oder Klimatisierung nutzt dieses Profil am besten.",
  ],
  schwerpunkte: [
    {
      titel: "Netzverträglichkeitsprüfung ab 7 kW",
      text: "SWI Netze prüft bei Anlagen über 7 kW Wechselrichterleistung die Netzverträglichkeit, bevor angeschlossen wird. Wir stellen die Anfrage früh, damit Montage und Inbetriebsetzung nahtlos ineinandergreifen.",
    },
    {
      titel: "Sommerstrom sinnvoll nutzen",
      text: "Wo der Juni so stark ist, entscheidet der Eigenverbrauch über die Rendite. E-Auto-Laden am Tag, ein passend dimensionierter Speicher und eine Wärmepumpe mit Warmwasser-Überschussbetrieb holen den Sommerstrom ins Haus.",
    },
    {
      titel: "Altstadt-Ensemble",
      text: "Für das Ensemble Altstadt Ingolstadt gilt die denkmalrechtliche Erlaubnispflicht, wenn das Erscheinungsbild betroffen ist. Die Planungshinweise im städtischen Kataster weisen darauf hin, dass auch Nachbargebäude eines Denkmals betroffen sein können.",
    },
  ],
  faq: [
    {
      q: "Gibt es in Ingolstadt noch Förderung für Photovoltaik?",
      a: "Das städtische Solarförderprogramm war nur bis einschließlich 2024 beantragbar. Ein neues kommunales Programm haben wir nicht gefunden (Stand September 2026). Die Stadtwerke Ingolstadt unterstützen mit Förderdatenbank und Förderservice bei bestehenden Programmen.",
    },
    {
      q: "Wie läuft die Netzanmeldung in Ingolstadt?",
      a: "Über das Installateur-Portal der Stadtwerke Ingolstadt Netze. Bei Anlagen über 7 kW Wechselrichternennleistung führt SWI Netze vorab eine Netzverträglichkeitsprüfung durch. Anmeldung und Inbetriebsetzung übernehmen wir als Fachbetrieb.",
    },
    {
      q: "Wie finde ich heraus, ob mein Dach in Ingolstadt geeignet ist?",
      a: "Das Solar- und Gründachpotenzialkataster der Stadt zeigt die Eignung und enthält Planungshinweise, auch zum Denkmalschutz. Beim Vor-Ort-Termin prüfen wir zusätzlich Statik, Zählerschrank und Verschattung.",
    },
    {
      q: "Wie viel Strom erzeugt eine 10-kWp-Anlage in Ingolstadt?",
      a: "Für ein Süddach mit 35° simuliert PVGIS rund 11.200 kWh im Jahr. In Angeboten setzen wir vorsichtiger an und rechnen mit Ihrer Dachneigung und Ausrichtung.",
    },
  ],
  cta: {
    titel: "Ihr Dach in Ingolstadt – ohne Zuschuss wirtschaftlich.",
    text: "Vor-Ort-Termin, Netzverträglichkeitsanfrage bei SWI Netze und ein Angebot mit ehrlicher Eigenverbrauchsrechnung.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "Stadtwerke Ingolstadt Netze GmbH (SWI Netze)",
      hinweis: "Netzverträglichkeitsprüfung bei Anlagen über 7 kW; Anmeldung über das Installateur-Portal.",
      anmeldung_url: "https://swi-netze.de/strom/stromeinspeisung/",
      url: "https://swi-netze.de/unternehmen/versorgungsgebiet/",
    },
    solarkataster: [{ name: "Solar- und Gründachpotenzialkataster Ingolstadt", traeger: "Stadt Ingolstadt", url: "https://www.solare-stadt.de/ingolstadt/" }],
    foerderprogramme: [],
    klimaziel: { text: "Klimaneutral bis 2035 (Integriertes Klimaschutzkonzept, Stadtrat 02.06.2022); Stadtverwaltung bis 2030.", url: "https://ingolstadt.de/klimaschutzkonzept" },
    schneelastzone: { zone: "1a", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    ortsbild: [{ text: "Ensemble „Altstadt Ingolstadt“: denkmalrechtliche Erlaubnis nötig, wenn das Erscheinungsbild betroffen ist; laut Kataster-Planungshinweisen kann der Schutz auch Nachbargebäude betreffen.", url: "https://www.solare-stadt.de/ingolstadt/Planungshinweise" }],
    besonderheiten: [
      { text: "Städtisches Solarförderprogramm (2023) war nur bis einschließlich 2024 beantragbar.", url: "https://nachhaltigkeitsagenda-ingolstadt.de/neues-solarfoerderprogramm-fuer-ingolstadt/" },
      { text: "SWI Stadtenergie belegt städtische Dächer mit PV; Ziel 3.000–5.000 kWp bis 2030.", url: "https://nachhaltigkeitsagenda-ingolstadt.de/meilensteil-auf-dem-weg-zur-klimaneutralitaet/" },
      { text: "Förderservice der Stadtwerke Ingolstadt: Datenbank und Hilfe bei Anträgen zu bestehenden Programmen.", url: "https://sw-i.de/bauen-wohnen/foerdermittel/" },
    ],
    energieberatung: { name: "VerbraucherService Bayern, Kupferstraße 24, Ingolstadt (kostenlos)", url: "https://www.ingolstadt.de/Rathaus/Aktuelles/Meldungs-Archiv/Energieberatung-F%C3%B6rdermittel.php?object=tx%2C2789.5.1&ModID=7&FID=465.3221.1&NavID=2789.737&La=1" },
  },
};

export default ingolstadt;
