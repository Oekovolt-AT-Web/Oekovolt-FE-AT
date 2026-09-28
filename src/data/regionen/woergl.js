// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 6300.

const woergl = {
  name: "Wörgl",
  bundesland: "Tirol",
  land: "tirol",
  bezirk: "Bezirk Kufstein",
  plz: "6300",
  alpin: true,
  beschreibung:
    "Photovoltaik in Wörgl: PV für Logistik am Bahnknoten, Gewerbepark West und Holzindustrie im Unterinntal – Stadtwerke Wörgl oder TINETZ, Hochwasser, Schneelast.",
  titel: "Photovoltaik für Wörgl –",
  akzent: "Verkehrsknoten im Unterinntal.",
  lead: "Wörgl ist seit jeher Verkehrsknoten: Hier treffen Unterinntal und Brixental, Westbahn und Rollende Landstraße aufeinander. Logistik, Gewerbe und Holzindustrie brauchen Strom – und die Stadtwerke Wörgl betreiben ein eigenes Netz.",
  einleitungTitel: "Bahn, Logistik, Gewerbepark West",
  einleitung: [
    "Die Stadt hat rund 14.400 Einwohnerinnen und Einwohner, der Großraum Wörgl etwa 31.000. Tourismus spielt eine geringere Rolle als in den Nachbartälern; prägend sind Handel, Gewerbe und der Güterverkehr.",
    "Im Westen der Stadt liegt der Gewerbepark mit dem Frachtenbahnhof Wörgl Terminal Nord – Stückgutterminal, Hallen, Freiladegleise und eine stark frequentierte Verladestelle der Rollenden Landstraße. Für einen großen holzverarbeitenden Betrieb ist ein weiterer Güterbahnhof in Planung.",
    "Das Wörgler Becken wurde zuletzt beim Hochwasser 2005 überschwemmt. Seither wurde der Schutz verbessert; für Technikräume in Tallage prüfen wir die Gefährdung trotzdem vorab.",
  ],
  schwerpunkte: [
    {
      titel: "Logistikhallen",
      text: "Umschlaghallen und Lager haben große, flache Dächer und Tagesverbrauch für Beleuchtung, Tore und Ladetechnik. Wir legen die Anlage auf die Grundlast aus und planen Ladepunkte für E-Stapler und Fuhrpark mit.",
    },
    {
      titel: "Holzverarbeitung",
      text: "Sägewerke und Holzindustrie haben hohe Lasten und besondere Brandschutzanforderungen. Leitungswege und Abschaltung planen wir nach OVE-Richtlinie R 11-1 mit der Feuerwehr.",
    },
    {
      titel: "Zwei mögliche Netzbetreiber",
      text: "Im Stadtgebiet sind die Stadtwerke Wörgl Netzbetreiber, im Umland die TINETZ. Wir klären die Zuständigkeit über den Zählpunkt und stellen die Netzanfrage.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsraum Wörgl",
    text: "Als Schnittpunkt von Unterinntal und Brixental ist Wörgl seit Urzeiten Verkehrsknoten – mit dem Bau der Eisenbahnen wurde diese Rolle noch stärker.",
    punkte: [
      { titel: "Terminal Nord", text: "Frachtenbahnhof mit Stückgutterminal, Hallen- und Freiladegleisen sowie einer Verladestelle für die Rollende Landstraße beim Gewerbepark West." },
      { titel: "Holzindustrie", text: "Für einen großen holzverarbeitenden Industriebetrieb ist ein eigener Güterbahnhof im ÖBB-Rahmenplan vorgesehen." },
      { titel: "Handel und Gewerbe", text: "Wörgl ist Einkaufs- und Gewerbezentrum für rund 31.000 Menschen im Großraum." },
    ],
    url: "https://de.wikipedia.org/wiki/W%C3%B6rgl",
    quelle: "Wikipedia: Wörgl – Wirtschaft und Verkehr",
  },
  anfahrt: "Über das Deutsche Eck und die Inntalautobahn.",
  faq: [
    {
      q: "Welcher Netzbetreiber ist in Wörgl zuständig?",
      a: "Für die Postleitzahl 6300 nennt der E-Control-Tarifkalkulator zwei Verteilnetzbetreiber: die Stadtwerke Wörgl GmbH und die TINETZ-Tiroler Netze GmbH. Welcher für Ihren Betrieb zuständig ist, steht auf der Stromrechnung beim Zählpunkt.",
    },
    {
      q: "Bieten die Stadtwerke Wörgl eigene Angebote für PV-Überschuss?",
      a: "Ja, die Stadtwerke Wörgl kaufen Überschussstrom aus PV-Anlagen ihrer Stromkunden an und informieren eigens über Photovoltaik für Unternehmen. Welche Abnahme für Sie am günstigsten ist – Stadtwerke, OeMAG oder Direktvermarktung – vergleichen wir im Angebot.",
    },
    {
      q: "Ist eine PV-Anlage im Wörgler Hochwassergebiet sinnvoll?",
      a: "Auf dem Dach ja. Kritisch ist nur Technik im Erdgeschoß: Wechselrichter, Speicher und Verteiler planen wir in erhöhten Räumen und prüfen die Gefährdung vorher in HORA.",
    },
  ],
  cta: {
    titel: "Logistik- oder Gewerbehalle in Wörgl?",
    text: "Wir klären Netzbetreiber und Einspeisekapazität, prüfen Statik und Hochwasserlage und legen die Anlage auf Ihren Verbrauch aus.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Stadtwerke Wörgl GmbH",
      kurz: "Stadtwerke Wörgl",
      hinweis: "Für PLZ 6300 laut E-Control auch TINETZ-Tiroler Netze GmbH – Zuständigkeit je Adresse prüfen.",
      url: "https://www.stww.at/strom/photovoltaik-fuer-ihr-unternehmen/",
    },
    besonderheiten: [
      {
        text: "Das Wörgler Becken wurde beim Hochwasser 2005 vollständig überschwemmt; seither wurde der Hochwasserschutz ausgebaut.",
        url: "https://de.wikipedia.org/wiki/W%C3%B6rgl",
      },
    ],
  },
};

export default woergl;
