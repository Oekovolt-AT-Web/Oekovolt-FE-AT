// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const augsburg = {
  name: "Augsburg",
  bundesland: "Bayern",
  seoTitel: "Photovoltaik Augsburg: nach der Solarförderung, swa Netze | Ökovolt",
  beschreibung:
    "Photovoltaik in Augsburg: was nach dem Ende des städtischen Solarförderprogramms bleibt, Anmeldung bei swa Netze, Stufenmodell für Solar im Ensemble Altstadt und standortgenauer Ertrag – 39 km von Türkheim.",
  eyebrow: "Photovoltaik in Augsburg",
  titel: "Augsburg nach der Solarförderung –",
  akzent: "warum sich das Dach trotzdem rechnet.",
  lead: "Über 1.560 Augsburger Haushalte haben das städtische Solarförderprogramm genutzt, im Dezember 2025 ist es ausgelaufen. Für die Wirtschaftlichkeit Ihrer Anlage war der Zuschuss nie der größte Posten – der Eigenverbrauch ist es.",
  einleitungTitel: "Was sich in Augsburg geändert hat – und was bleibt",
  einleitung: [
    "Die Stadt Augsburg hat von 2023 bis 2025 Photovoltaik, Solarthermie und Balkonkraftwerke mit insgesamt 500.000 € gefördert. Das Programm endete wie geplant am 15. Dezember 2025, eine Fortsetzung ist laut Stadt nicht absehbar. Geblieben ist die Solaroffensive: kostenfreie, unabhängige Beratung des Umweltamts, ein Online-SolardachCheck und das städtische Solardachflächenkataster.",
    "Netzbetreiber ist die swa Netze GmbH der Stadtwerke Augsburg. Die Anmeldung läuft digital über das Einspeiserportal und darf nur vom Elektrofachbetrieb eingereicht werden – bei Anlagen über 25 kWp mit einem zusätzlichen Formular zum Einspeisemanagement.",
    "Von Türkheim sind es 39 Kilometer bis in die Augsburger Innenstadt. In Mering, keine 15 Kilometer südöstlich, haben wir eine Ost-West-Anlage auf einem Flachdach gebaut – eine Bauform, die auch in Augsburgs Gewerbe- und Mehrfamilienhausbestand häufig passt.",
  ],
  schwerpunkte: [
    {
      titel: "Altstadt: das Augsburger Stufenmodell",
      text: "Im Ensemble Altstadt beurteilt die Stadt Solaranlagen gestuft: Auf nicht einsehbaren Flächen können herkömmliche Module zulässig sein, auf öffentlich einsehbaren Flächen nur integrierte Lösungen wie Indach- oder farbige Module. Die denkmalrechtliche Erlaubnis beantragen wir mit Ihnen.",
    },
    {
      titel: "Ohne Zuschuss: Eigenverbrauch planen",
      text: "Ohne städtische Förderung zählt jede selbst genutzte Kilowattstunde doppelt. Speicher, Wallbox oder Wärmepumpe legen wir so aus, dass möglichst viel Solarstrom im Haus bleibt – das bringt über 20 Jahre mehr als jeder Einmalzuschuss.",
    },
    {
      titel: "Größere Anlagen über 25 kWp",
      text: "Für Mehrfamilienhäuser und Gewerbe verlangt swa Netze ab 25 kWp zusätzliche Angaben zum Einspeisemanagement. Mieterstrom-Lösungen bieten die Stadtwerke für Geschäftskunden an – wir planen die Anlage passend dazu.",
    },
  ],
  faq: [
    {
      q: "Gibt es in Augsburg 2026 noch eine Förderung für Photovoltaik?",
      a: "Das städtische Solarförderprogramm ist am 15. Dezember 2025 wie geplant ausgelaufen; eine Fortsetzung ist laut Stadt nicht absehbar. Bayern hat derzeit kein Landesprogramm. Es bleiben Bundesmittel wie der KfW-Kredit 270, der Nullsteuersatz auf Anlage und Speicher sowie die kostenfreie Beratung der Solaroffensive.",
    },
    {
      q: "Darf ich im Augsburger Ensemble Altstadt Solarmodule montieren?",
      a: "Mit denkmalrechtlicher Erlaubnis und nach dem städtischen Stufenmodell: Auf nicht einsehbaren Flächen können übliche Anlagen möglich sein, auf öffentlich einsehbaren Flächen nur gestalterisch integrierte, bei Einzeldenkmälern nur denkmalverträgliche Anlagen.",
    },
    {
      q: "Wie melde ich eine PV-Anlage in Augsburg an?",
      a: "Beim Netzbetreiber swa Netze über das digitale Einspeiserportal – laut swa Netze ausschließlich durch den Elektrofachbetrieb. Das übernehmen wir, ebenso die Registrierung im Marktstammdatenregister.",
    },
    {
      q: "Wie viel Solarstrom erzeugt ein Dach in Augsburg?",
      a: "PVGIS simuliert für ein Süddach mit 35° in Augsburg rund 1.130 kWh je kWp im Jahr, knapp 2 % weniger als in Türkheim. In Angeboten rechnen wir bewusst vorsichtiger und berücksichtigen Verschattung und Dachneigung.",
    },
  ],
  cta: {
    titel: "Augsburg ist für uns um die Ecke.",
    text: "Vor-Ort-Termin mit Blick auf Dach, Zählerschrank und Ensemble-Lage – danach ein Angebot, das ohne Zuschuss funktioniert.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "swa Netze GmbH",
      hinweis: "Netzbetreiber der Stadtwerke Augsburg; Anmeldung nur durch den Fachbetrieb über das Einspeiserportal.",
      anmeldung_url: "https://www.swa-netze.de/sparten/strom/einspeisung",
      url: "https://www.swa-netze.de/sparten/strom/einspeisung",
    },
    solarkataster: [{ name: "Solardachflächenkataster Augsburg", traeger: "Stadt Augsburg", url: "https://www.augsburg.de/umwelt-soziales/umwelt/energiewende/solarenergie" }],
    foerderprogramme: [
      {
        name: "Augsburger Solarförderprogramm 2023–2025",
        traeger: "Stadt Augsburg",
        gegenstand: "PV, Solarthermie, Balkonkraftwerke",
        status: "beendet zum 15.12.2025, Fortsetzung laut Stadt nicht absehbar",
        url: "https://www.augsburg.de/umwelt-soziales/umwelt/klima-energie/solaroffensive-augsburg/solarfoerderprogramm",
      },
    ],
    klimaziel: { text: "Klimaneutrale Stadtverwaltung bis 2035; für die Gesamtstadt Blue-City-Klimaschutzprogramm (2022) auf Basis eines CO2-Restbudgets.", url: "https://www.augsburg.de/fileadmin/user_upload/umwelt_soziales/umwelt/umweltschutz/klimaschutzberichte/download/Klimaschutzbericht_2024.pdf" },
    schneelastzone: { zone: "1a", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    gelaendehoehe_m: { wert: 489, url: "https://www.augsburg.de/fileadmin/user_upload/buergerservice_rathaus/rathaus/statisiken_und_geodaten/statistiken/kompakt/daten_fakten_zahlen_2012.pdf" },
    ortsbild: [
      {
        text: "Ensemble Altstadt Augsburg: Solaranlagen nach Stufenmodell – nicht einsehbare Flächen ggf. herkömmlich, öffentlich einsehbare nur integriert (Indach, farbige Module); denkmalrechtliche Erlaubnis erforderlich.",
        url: "https://www.augsburg.de/buergerservice-rathaus/wohnen-und-bauen/denkmalschutz/",
      },
    ],
    besonderheiten: [{ text: "Solarkonzept der Stadt (Stadtrat 24.02.2011) mit Flächeneinstufung – Grundlage des heutigen Solardachflächenkatasters.", url: "https://www.augsburg.de/buergerservice-rathaus/stadtplanung/stadtentwicklung/fachkonzepte/solarkonzept" }],
    energieberatung: { name: "Solaroffensive Augsburg (Umweltamt) – kostenfreie, unabhängige Solarberatung", url: "https://www.augsburg.de/umwelt-soziales/umwelt/klima-energie/solaroffensive-augsburg" },
  },
};

export default augsburg;
