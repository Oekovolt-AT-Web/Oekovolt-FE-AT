// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const heilbronn = {
  name: "Heilbronn",
  bundesland: "Baden-Württemberg",
  seoTitel: "Photovoltaik Heilbronn: PV-Pflicht, NHF-Netz & Ertrag | Ökovolt",
  beschreibung:
    "Photovoltaik in Heilbronn: Landes-PV-Pflicht bei Neubau und Dachsanierung, Anmeldung bei der NHF Netzgesellschaft, neutrale Beratung durch Energieagentur und Bürgersolarberatung, standortgenauer Ertrag am Neckar.",
  eyebrow: "Photovoltaik in Heilbronn",
  titel: "Heilbronn setzt auf die Dächer –",
  akzent: "und auf seine Bürger.",
  lead: "Die Hälfte der Solaranlagen in Heilbronn gehört Privatleuten. Bis 2035 will die Stadt drei Viertel ihres Dachpotenzials erschließen – wer neu baut oder sein Dach saniert, ist nach Landesrecht ohnehin zur Photovoltaik verpflichtet.",
  einleitungTitel: "Pflicht, Potenzial und ein Netz mit eigener Geschichte",
  einleitung: [
    "Heilbronn hat sich 2023 per Gemeinderatsbeschluss vorgenommen, bis 2035 treibhausgasneutral zu werden. Beim Solarstrom ist das Ziel konkret: 75 % des im Energieatlas Baden-Württemberg ausgewiesenen Dachpotenzials sollen bis dahin belegt sein. Über 3.000 Anlagen gehören bereits Privatpersonen.",
    "In Baden-Württemberg gilt bei Neubauten und grundlegenden Dachsanierungen eine gesetzliche Photovoltaikpflicht, auf die auch die Stadt hinweist. Für Kulturdenkmale gibt es Sonderregeln. Wir prüfen, welche Pflichtfläche für Ihr Vorhaben gilt, und legen die Anlage so aus, dass sie mehr als nur die Pflicht erfüllt.",
    "Das Stromnetz in Heilbronn betreibt die NHF Netzgesellschaft Heilbronn-Franken, die es von der ZEAG gepachtet hat. Eine kommunale PV-Förderung gibt es derzeit nicht – dafür ungewöhnlich viel unabhängige Beratung.",
  ],
  schwerpunkte: [
    {
      titel: "PV-Pflicht bei Dachsanierung einplanen",
      text: "Wer in Heilbronn das Dach grundlegend saniert, muss nach Landesrecht Photovoltaik installieren. Sinnvoll ist, Dachdecker und PV-Montage in einem Zeitplan zu koordinieren – das spart Gerüst und Doppelarbeit.",
    },
    {
      titel: "Zwei neutrale Beratungsangebote",
      text: "Die Energieagentur Heilbronn berät Privatleute aus dem Stadtkreis kostenfrei, die ehrenamtliche Bürgersolarberatung hilft zusätzlich beim Angebotsvergleich. Wir begrüßen es, wenn Kunden unsere Planung dort gegenprüfen lassen.",
    },
    {
      titel: "Niedrige Lage, milde Winter",
      text: "Mit 157 m am Marktplatz liegt Heilbronn tief im Neckartal. Die Schneelast ist moderat, der Dezember bringt laut PVGIS-Simulation rund 36 kWh je kWp – im Sommer holt die Anlage das deutlich wieder herein.",
    },
  ],
  faq: [
    {
      q: "Muss ich in Heilbronn eine Photovoltaikanlage bauen?",
      a: "Bei Neubauten und grundlegenden Dachsanierungen gilt in Baden-Württemberg eine gesetzliche PV-Pflicht; die Stadt Heilbronn weist darauf hin und nennt Sonderregeln für Kulturdenkmale. Welche Fläche konkret belegt werden muss, hängt vom Gebäude ab – das prüfen wir im Angebot.",
    },
    {
      q: "Gibt es in Heilbronn eine Förderung für PV oder Speicher?",
      a: "Ein aktuelles städtisches Förderprogramm für Photovoltaik, Speicher oder Balkonkraftwerke haben wir nicht gefunden (Stand September 2026). Das Land fördert über das zinsverbilligte L-Bank-Darlehen, dazu kommen Bundesmittel wie der KfW-Kredit 270.",
    },
    {
      q: "Wer ist in Heilbronn Netzbetreiber?",
      a: "Die NHF Netzgesellschaft Heilbronn-Franken mbH. Sie hat das Stromnetz der ZEAG Energie AG gepachtet; Erzeugungsanlagen werden bei der NHF angemeldet. Das übernehmen wir für Sie.",
    },
    {
      q: "Kann ich mich in Heilbronn an Bürgersolaranlagen beteiligen?",
      a: "Ja. Die 2013 von ZEAG und Stadt gegründete BürgerEnergiegenossenschaft Heilbronn ist Mehrheitseigentümerin einer Gesellschaft, die über 60 PV-Anlagen betreibt. Für die eigene Anlage auf dem Dach ist das keine Alternative, aber eine gute Ergänzung für Mieter.",
    },
  ],
  cta: {
    titel: "Neubau oder Dachsanierung in Heilbronn? Wir planen die PV-Pflicht gleich mit.",
    text: "Erstberatung per Video, Unterlagen per Smartphone, Vor-Ort-Termin zur Aufnahme – und ein Angebot, das Pflicht und Wirtschaftlichkeit verbindet.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "NHF Netzgesellschaft Heilbronn-Franken mbH",
      hinweis: "Betreibt das von der ZEAG gepachtete Stromnetz in Heilbronn.",
      anmeldung_url: "https://www.n-hf.de/einspeisung/strom/erzeugungsanlagen-am-nieder-und-mittelspannungsnetz.html",
      url: "https://www.n-hf.de/netznutzung/strom/marktpartnerinformationen.html",
    },
    solarkataster: [{ name: "Energieatlas Baden-Württemberg – Solarpotenzial auf Dachflächen", traeger: "Land (LUBW), von der Stadt verlinkt", url: "https://www.energieatlas-bw.de/sonne/dachflachen/solarpotenzial-auf-dachflachen" }],
    foerderprogramme: [],
    klimaziel: { text: "Treibhausgasneutral bis 2035 (Gemeinderat 30.01.2023); 75 % des Dach-PV-Potenzials bis 2035.", url: "https://www.heilbronn.de/umwelt-mobilitaet/klima-klimaschutz/klimaschutz-masterplan.html" },
    schneelastzone: { zone: "2", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    gelaendehoehe_m: { wert: 157, url: "https://www.heilbronn.de/leben/heilbronn-entdecken/heilbronn-in-zahlen/bevoelkerung-und-gebietheilbronn-in-zahlen.html" },
    besonderheiten: [
      { text: "Auf kommunalen Dächern laufen rund 60 Anlagen mit 3,5 MW, teils gemeinsam mit den Energiegenossenschaften EnerGeno und Bürgerenergiegenossenschaft Heilbronn (Stand 11/2024).", url: "https://www.heilbronn.de/umwelt-mobilitaet/energie/solarenergie-photovoltaik/photovoltaik-auf-kommunalen-daechern.html" },
      { text: "Bürgersolarberatung Heilbronn: ehrenamtlich, kostenlos und unabhängig, u. a. mit Angebotsvergleich und Wirtschaftlichkeitsrechnung.", url: "https://www.heilbronn.de/umwelt-mobilitaet/energie/solarenergie-photovoltaik/solarstrom-fuer-die-buergerschaft/buergersolarberatung-heilbronn.html" },
    ],
    energieberatung: { name: "Energieagentur Heilbronn GmbH (kostenfreie Erstberatung für Privatpersonen im Stadtkreis)", url: "https://www.energieagentur-heilbronn.de/" },
  },
};

export default heilbronn;
