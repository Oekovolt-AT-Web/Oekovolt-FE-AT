// Recherche: 14.09.2026 – alle Fakten mit Quelle (siehe fakten.*.url)

const muenchen = {
  name: "München",
  bundesland: "Bayern",
  seoTitel: "Photovoltaik München: Mieterstrom-Förderung, SWM-Netz & Ertrag | Ökovolt",
  beschreibung:
    "Photovoltaik in München: 200 €/kWp für Mieterstrom und bis 60 % Zuschuss zur PV-Planung (FKG), Masterplan Solares München, Denkmal-Stufenmodell, Anmeldung bei SWM Infrastruktur und standortgenauer Ertrag.",
  eyebrow: "Photovoltaik in München",
  titel: "München will 25 % Solarstrom –",
  akzent: "und fördert heute Planung und Mieterstrom.",
  lead: "Die Stadt fördert keine PV-Module mehr, aber genau die Schritte, an denen Münchner Mehrfamilienhäuser oft hängen bleiben: die fachliche Planung und das Mieterstrommodell. Für Hausbesitzer und Eigentümergemeinschaften ist das ein guter Einstieg.",
  einleitungTitel: "Viel Dach, wenig Solar – noch",
  einleitung: [
    "Rund 265 MWp Photovoltaik sind laut Stadt in München installiert, das deckt gut 2 % des Stromverbrauchs. Der Masterplan „Solares München“ zielt langfristig auf 25 % – mit einem Zubau von dauerhaft 100 MWp im Jahr ab etwa 2030. Die Stadtwerke sollen dazu 2026 bis 2028 jährlich 30 MWp beitragen, die Münchner Wohnen 12,5 MWp.",
    "Die direkte Förderung von PV-Anlagen im Programm Klimaneutrale Gebäude endete im Dezember 2024. Geblieben sind zwei Bausteine, die sich vor allem für Mehrfamilienhäuser lohnen: 60 % Zuschuss zu Beratung und Planung (bis 15.000 € ab drei Wohneinheiten) und 200 € je kWp für die PV-Anlage eines umgesetzten Mieterstrommodells. Beide Anträge müssen vor der Auftragsvergabe gestellt werden.",
    "Für Denkmäler hat München ein klares Stufenmodell, für das Olympiadorf sogar einen eigenen PV-Rahmenplan. Netzbetreiber ist SWM Infrastruktur, die Anmeldung läuft über das Netzanschlussportal.",
  ],
  schwerpunkte: [
    {
      titel: "WEG und Mehrfamilienhaus: Mieterstrom mit 200 €/kWp",
      text: "Wir planen Anlage und Messkonzept so, dass das Mieterstrommodell förderfähig ist – und sorgen dafür, dass der Antrag vor der Beauftragung gestellt wird.",
    },
    {
      titel: "Planungszuschuss nutzen",
      text: "Die Stadt übernimmt 60 % des Honorars für PV-Beratung und -Planung. Gerade bei komplexen Dächern, Denkmal oder Gründach lohnt eine saubere Vorplanung, bevor Angebote verglichen werden.",
    },
    {
      titel: "Denkmal: Stufenmodell statt Verbot",
      text: "Auf nicht einsehbaren Flächen sind herkömmliche Anlagen regelmäßig erlaubnisfähig, im Ensemble auf einsehbaren Flächen integrierte Lösungen, am Einzeldenkmal Solarziegel oder -folien. Kirchen, Schlösser und besonders bedeutende Denkmäler bleiben ausgenommen.",
    },
  ],
  faq: [
    {
      q: "Welche Photovoltaik-Förderung gibt es 2026 in München?",
      a: "Im Förderprogramm Klimaneutrale Gebäude: PV-Beratung und -Planung mit 60 % des Honorars (max. 3.000 € bei 1–2 Wohneinheiten, 15.000 € ab 3 Wohneinheiten oder bei Nichtwohngebäuden), Mieterstrom mit 200 € je kWp der zugehörigen PV-Anlage und Stecker-Solargeräte mit 0,40 € je Wp. Die Förderung klassischer PV-Anlagen ist seit 18.12.2024 eingestellt.",
    },
    {
      q: "Darf ich an einem denkmalgeschützten Haus in München Solarmodule anbringen?",
      a: "Mit denkmalrechtlicher Erlaubnis und nach dem städtischen Stufenmodell: Auf nicht öffentlich einsehbaren Flächen sind herkömmliche Anlagen regelmäßig erlaubnisfähig, auf einsehbaren Flächen integrierte Lösungen wie Solarziegel oder dachintegrierte Module. Für das Olympiadorf gilt ein eigener PV-Rahmenplan.",
    },
    {
      q: "Wie melde ich eine PV-Anlage in München an?",
      a: "Beim Netzbetreiber SWM Infrastruktur über das Netzanschlussportal, mit oder ohne Speicher. Steckersolargeräte bis 800 VA werden nur im Marktstammdatenregister gemeldet. Die Anmeldung größerer Anlagen übernehmen wir.",
    },
    {
      q: "Wie viel Ertrag bringt ein Dach in München?",
      a: "Für ein Süddach mit 35° simuliert PVGIS in München rund 1.140 kWh je kWp – knapp 1 % weniger als in Türkheim. Im Winter liegt München mit 47 kWh im Dezember sogar vor den meisten Städten in Franken und Baden-Württemberg.",
    },
  ],
  cta: {
    titel: "Münchner Dach, Münchner Förderung – richtig kombiniert.",
    text: "Vor-Ort-Termin, Planung mit Blick auf Mieterstrom und Denkmal, Förderanträge vor der Beauftragung.",
  },
  fakten: {
    stand: "2026-09-14",
    netzbetreiber: {
      name: "SWM Infrastruktur GmbH & Co. KG",
      hinweis: "Netztochter der Stadtwerke München; Anmeldung über das Netzanschlussportal.",
      anmeldung_url: "https://www.swm-infrastruktur.de/einspeisung/erzeugungsanlage-anmelden/photovoltaikanlage-anmelden",
      url: "https://www.swm-infrastruktur.de/einspeisung/erzeugungsanlage-anmelden/photovoltaikanlage-anmelden",
    },
    solarkataster: [{ name: "Solarpotenzialkarte im GeoPortal München", traeger: "Landeshauptstadt München", url: "http://geoportal.muenchen.de/portal/solarpotenzial/" }],
    foerderprogramme: [
      {
        name: "FKG – Photovoltaikberatung und Mieterstrom",
        traeger: "Landeshauptstadt München",
        gegenstand: "PV-Beratung/-Planung; Mieterstrommodelle inkl. neuer PV-Anlage",
        konditionen: "Beratung 60 %, max. 3.000 € bzw. 15.000 €; Mieterstrom 200 €/kWp; Antrag vor Auftragsvergabe",
        status: "laufend 2026",
        url: "https://stadt.muenchen.de/service/info/sachgebiet-foerderprogramm-klimaneutrale-gebaeude/10414154/",
      },
      {
        name: "FKG – Stecker-Solar-Geräte",
        traeger: "Landeshauptstadt München",
        gegenstand: "Balkonkraftwerke bis 800 Wp je Wohneinheit",
        konditionen: "0,40 €/Wp, max. 50 % der Kosten",
        status: "laufend 2026",
        url: "https://stadt.muenchen.de/service/info/sachgebiet-foerderprogramm-klimaneutrale-gebaeude/10414151/",
      },
      {
        name: "FKG – Förderung von PV-Anlagen",
        traeger: "Landeshauptstadt München",
        gegenstand: "Photovoltaikanlagen",
        status: "eingestellt, Anträge waren bis 18.12.2024 möglich",
        url: "https://stadt.muenchen.de/infos/foerderprogramm-klimaneutrale-gebaeude.html",
      },
    ],
    klimaziel: { text: "Klimaneutral bis 2035; Masterplan „Solares München“: langfristig 25 % des Strombedarfs aus PV im Stadtgebiet.", url: "https://stadt.muenchen.de/infos/solarenergie.html" },
    schneelastzone: { zone: "1a", url: "https://www.dibt.de/fileadmin/dibt-website/Dokumente/Referat/P5/Technische_Bestimmungen/Schneelastzonen_nach_Verwaltungsgrenzen.xlsx" },
    gelaendehoehe_m: { wert: 519, url: "https://www.muenchen.de/sehenswuerdigkeiten/muenchen-zahlen-interessante-fakten-ueber-die-stadt" },
    ortsbild: [
      {
        text: "Stufenmodell für Solar am Denkmal: nicht einsehbar herkömmlich, im Ensemble einsehbar integriert, am Einzeldenkmal z. B. Solarziegel; eigener PV-Rahmenplan für das Olympiadorf.",
        url: "https://stadt.muenchen.de/infos/denkmalschutz-solaranlagen.html",
      },
    ],
    besonderheiten: [
      { text: "Rund 265 MWp PV installiert (gut 2 % des Stromverbrauchs), Zubau 2025 rund 50 MWp.", url: "https://stadt.muenchen.de/infos/solarenergie.html" },
      { text: "Münchner Solarbörse: Dachflächen einstellen und unverbindliche Angebote eingetragener Solarpartner erhalten.", url: "https://stadt.muenchen.de/infos/solarenergie.html" },
    ],
    energieberatung: { name: "Bauzentrum München – kostenfreie, firmenneutrale Beratung zu Solarenergie", url: "https://stadt.muenchen.de/infos/bauzentrum-muenchen.html" },
  },
};

export default muenchen;
