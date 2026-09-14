// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const erlangen = {
  name: "Erlangen",
  bundesland: "Bayern",
  seoTitel: "Photovoltaik Erlangen: ESTW-Netz, Klimaziel 2030 & Ertrag | Ökovolt",
  beschreibung:
    "Photovoltaik in Erlangen: warum sich Solar trotz des niedrigsten Ertrags in unserem Gebiet rechnet, neues Installateurportal der ESTW seit April 2026, Mieterstrom der Stadtwerke, kostenlose städtische Energieberatung.",
  eyebrow: "Photovoltaik in Erlangen",
  titel: "Erlangen will vor 2030 klimaneutral sein –",
  akzent: "ehrlich gerechnet, lohnt sich jedes Dach.",
  lead: "Unter allen Städten in unserem Einzugsgebiet simuliert PVGIS in Erlangen den niedrigsten Solarertrag. Gleichzeitig hat sich Erlangen das früheste Klimaziel aller Städte in unserem Gebiet gesetzt. Beides zusammen ist ein gutes Argument für eine Anlage, die konsequent auf Eigenverbrauch ausgelegt ist.",
  einleitungTitel: "Weniger Sonne als im Allgäu – mehr Grund, genau zu planen",
  einleitung: [
    "Rund 1.070 kWh je kWp simuliert PVGIS für ein Süddach mit 35° in Erlangen, etwa 7 % weniger als an unserem Firmensitz Türkheim. Für die Wirtschaftlichkeit ist der Unterschied kleiner, als er klingt: Eine selbst genutzte Kilowattstunde spart den vollen Strompreis, egal wie viel Sonne der Standort hat. Entscheidend ist, dass Anlage, Speicher und Verbraucher zusammenpassen.",
    "Der Stadtrat hat 2020 mit dem „Fahrplan Klima-Aufbruch“ das Ziel beschlossen, Klimaneutralität vor 2030 zu erreichen und das CO2-Restbudget als Steuerungsgröße zu nutzen. Ein eigenes städtisches PV-Förderprogramm gibt es derzeit nicht, die Stadt verweist auf Bund und Freistaat – dafür berät das Umweltamt kostenlos, auch vor Ort und mit dem Klimamobil.",
    "Netzbetreiber sind die Erlanger Stadtwerke. Seit dem 1. April 2026 werden neue Erzeugungsanlagen über ein neues Installateurportal angemeldet. Die ESTW betreiben selbst 85 PV-Anlagen im Stadtgebiet, darunter Mieterstromprojekte.",
  ],
  schwerpunkte: [
    {
      titel: "Eigenverbrauch statt Maximalfläche",
      text: "Bei etwas geringerer Einstrahlung wiegt jede eingespeiste Kilowattstunde wirtschaftlich weniger. Wir dimensionieren Anlage und Speicher nach Ihrem Lastprofil und rechnen Wallbox oder Wärmepumpe von Anfang an mit.",
    },
    {
      titel: "Mehrfamilienhaus: Mieterstrom ist erprobt",
      text: "Mit dem Projekt in der Goeschelstraße haben die ESTW 2020 ihr erstes Mieterstromprojekt gestartet. Für Eigentümergemeinschaften planen wir Anlage und Messkonzept für Mieterstrom oder gemeinschaftliche Gebäudeversorgung.",
    },
    {
      titel: "Denkmal: früh nachfragen",
      text: "Auf denkmalgeschützten Gebäuden sind Solaranlagen laut Planungshinweisen des Solarkatasters nur ausnahmsweise mit Erlaubnis möglich, der Schutz kann auch Nachbargebäude betreffen. Die städtische Energieberatung hat dafür eine eigene Ansprechstelle.",
    },
  ],
  faq: [
    {
      q: "Lohnt sich Photovoltaik in Erlangen trotz weniger Sonne?",
      a: "Ja, wenn die Anlage auf den Eigenverbrauch ausgelegt ist. PVGIS simuliert rund 1.070 kWh je kWp im Jahr – etwa 7 % weniger als im Allgäu. Der Wert einer selbst genutzten Kilowattstunde hängt aber vom Strompreis ab, nicht von der Einstrahlung.",
    },
    {
      q: "Gibt es in Erlangen eine städtische Förderung für PV?",
      a: "Ein eigenes städtisches PV-Förderprogramm haben wir nicht gefunden; die Stadt verweist auf Programme von Bund und Freistaat (Stand September 2026). Kostenlos ist die unabhängige Energieberatung des Umweltamts, telefonisch, im Amt oder bei Ihnen vor Ort.",
    },
    {
      q: "Wie melde ich eine PV-Anlage in Erlangen an?",
      a: "Bei den Erlanger Stadtwerken als Netzbetreiber, seit 1. April 2026 über das neue Installateurportal. Die Anmeldung erfolgt durch den Elektrofachbetrieb – das übernehmen wir.",
    },
    {
      q: "Wo sehe ich, ob mein Dach in Erlangen geeignet ist?",
      a: "Im Solarpotenzialkataster, das die Stadt gemeinsam mit dem Landkreis Erlangen-Höchstadt betreibt. Die Planungshinweise dort enthalten auch Hinweise zum Denkmalschutz.",
    },
  ],
  cta: {
    titel: "Eine Anlage für Erlangen – gerechnet, nicht geschätzt.",
    text: "Erstberatung per Video, Unterlagen per Smartphone, Vor-Ort-Aufnahme und ein Angebot mit ehrlicher Eigenverbrauchsrechnung.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "Erlanger Stadtwerke AG (ESTW), Netze",
      hinweis: "Stromnetzgebiet entspricht der Stadtfläche; seit 01.04.2026 neues Installateurportal.",
      anmeldung_url: "https://netze.estw.de/de/Installateure/Strom/",
      url: "https://netze.estw.de/de/Stromnetz/Netzstrukturdaten/",
    },
    solarkataster: [{ name: "Solarpotenzialkataster Erlangen", traeger: "Stadt Erlangen mit Landkreis Erlangen-Höchstadt", url: "https://www.solare-stadt.de/erlangen/" }],
    foerderprogramme: [],
    klimaziel: { text: "Klimaneutralität vor 2030 („Fahrplan Klima-Aufbruch“, Stadtrat November 2020).", url: "https://erlangen.de/uwao-api/faila/files/bypath/Dokumente/PDF-Formulare/31_Umweltamt/fahrplan_klima-aufbruch_-_kurzbericht.pdf" },
    schneelastzone: { zone: "1", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    ortsbild: [{ text: "Auf Denkmälern Solaranlagen nur ausnahmsweise mit Erlaubnis; der Schutz kann auch Nachbargebäude betreffen. Untere Denkmalbehörde vor der Planung kontaktieren.", url: "https://www.solare-stadt.de/erlangen/Planungshinweise" }],
    besonderheiten: [
      { text: "ESTW betreiben 85 PV-Anlagen mit rund 1.755 kWp im Stadtgebiet, darunter Mieterstromprojekte (erstes 2020, Goeschelstraße).", url: "https://www.estw.de/de/Die-ESTW/Energiewende/Photovoltaik/Mieterstromprojekte/Mieterstromprojekte.html" },
      { text: "Kommunaler Wärmeplan seit Januar 2026: Weg zu einer fossilfreien Wärmeversorgung 2040.", url: "https://erlangen.de/aktuelles/energieberatung" },
    ],
    energieberatung: { name: "Städtische Energieberatung (Umweltamt) – kostenfrei, auch vor Ort und mit dem Klimamobil", url: "https://erlangen.de/aktuelles/energieberatung" },
  },
};

export default erlangen;
