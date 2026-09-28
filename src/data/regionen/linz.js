// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 4020/4030.

const linz = {
  name: "Linz",
  bundesland: "Oberösterreich",
  land: "oberoesterreich",
  bezirk: "Statutarstadt",
  plz: "4020",
  alpin: false,
  beschreibung:
    "Photovoltaik in Linz für Industrie, Logistik und Gewerbe: Netzanschluss bei LINZ NETZ, Einspeisekapazitäten, Baurecht in OÖ und PVGIS-Ertrag für Ihren Standort.",
  titel: "Photovoltaik für Linz –",
  akzent: "Industriestadt mit großen Dächern.",
  lead: "Linz ist der größte Wirtschaftsstandort im oberösterreichischen Zentralraum. Hallen im Hafen, Produktionsdächer im Osten und Bürogebäude an der Digital Mile bieten Platz für Megawatt-Anlagen – wenn Netz und Statik mitspielen.",
  einleitungTitel: "Zwischen Hafen, Industriegebiet und Digital Mile",
  einleitung: [
    "Rund 190.000 Menschen arbeiten in Linz, fast doppelt so viele, wie Berufstätige in der Stadt wohnen. Das zeigt, wie stark die Landeshauptstadt als Arbeitsplatz- und Industriestandort ist: Stahl, Chemie, Metall- und Papierindustrie im Osten, Logistik und Handel am Donauhafen, dazu eine wachsende IT-Szene.",
    "Für Photovoltaik bedeutet das: sehr große, meist flache Dachflächen und ein hoher Tagesverbrauch, der viel Solarstrom direkt aufnimmt. Entscheidend ist, wie viel Leistung am jeweiligen Netzanschlusspunkt eingespeist werden darf – die Linzer Netzbetreiberin LINZ NETZ veröffentlicht dazu eigene Informationen zu Einspeisekapazitäten.",
    "Wir planen in Linz vorrangig Anlagen auf Gewerbe- und Industriedächern, Parkplatzüberdachungen und Fassaden – mit Eigenverbrauchsanalyse aus dem Lastgang, Speicher für Lastspitzen und einer EZA-Regelung, die mit den Vorgaben des Netzbetreibers zusammenspielt.",
  ],
  schwerpunkte: [
    {
      titel: "Einspeisekapazität früh klären",
      text: "Bei Anlagen im dreistelligen kWp-Bereich entscheidet die Netzebene über Zeitplan und Kosten. Wir stellen die Netzanfrage bei LINZ NETZ vor der Detailplanung und legen die Anlage danach aus – notfalls mit Einspeisebegrenzung und Speicher.",
    },
    {
      titel: "Dächer im Industriegebiet",
      text: "Viele Hallen im Linzer Osten stammen aus unterschiedlichen Bauperioden. Tragreserven, Brandabschnitte und Dachabdichtung prüfen wir vor dem Angebot; bei knapper Statik planen wir mit leichter Ost-West-Aufständerung.",
    },
    {
      titel: "Parkplätze und Carports",
      text: "Photovoltaik auf Parkplätzen ist in Oberösterreich elektrizitätsrechtlich bewilligungsfrei. Solarcarports verbinden Stromerzeugung mit Ladeinfrastruktur für Fuhrpark und Mitarbeitende.",
    },
  ],
  wirtschaft: {
    titel: "Linz: Oberösterreichs Industriezentrum",
    text: "Linz zählt zu den drei stärksten Wirtschaftsräumen Österreichs. An Arbeitstagen pendeln rund 100.000 Berufstätige in die Stadt ein.",
    punkte: [
      { titel: "Industriegebiet Linz-Ost", text: "Zwischen Westbahn und Donau liegt ein geschlossenes Industriegebiet mit Metall-, Papier-, Chemie- und Pharmaindustrie sowie Forschungsbetrieben." },
      { titel: "Donauhafen", text: "Linz besitzt einen von vier österreichischen Donauhäfen – Standort für Logistik, Handel und Produktion mit großen Hallendächern." },
      { titel: "Digital Mile", text: "Entlang der Donau haben sich IT-Unternehmen zur „Digital Mile Linz“ zusammengeschlossen, laut Stadtbeschreibung zehn Kernunternehmen mit rund 4.500 Mitarbeitenden." },
      { titel: "Lebensmittel und Versandhandel", text: "Neben der Schwerindustrie sind Niederlassungen der Lebensmittel- und Versandhandelsbranche prägend – Betriebe mit Kühlung und Dauerlast." },
    ],
    url: "https://de.wikipedia.org/wiki/Linz",
    quelle: "Wikipedia: Linz – Wirtschaft",
  },
  anfahrt: "Die Route führt in der Regel über die Innkreisautobahn A8 und Wels.",
  faq: [
    {
      q: "Welcher Netzbetreiber ist in Linz für PV-Anlagen zuständig?",
      a: "Im Linzer Stadtgebiet ist die LINZ NETZ GmbH Verteilnetzbetreiberin. Für die Postleitzahlen 4020 und 4030 nennt der E-Control-Tarifkalkulator zusätzlich die Netz Oberösterreich GmbH, weil Randlagen in deren Netz liegen. Maßgeblich ist die Zählpunktnummer auf Ihrer Stromrechnung.",
    },
    {
      q: "Wie groß darf eine Dachanlage in Linz ohne Genehmigung sein?",
      a: "Baurechtlich sind PV-Anlagen in Oberösterreich bewilligungs- und anzeigefrei (§ 26 Z 15 Oö. BauO 1994). Elektrizitätsrechtlich sind Anlagen bis 1.000 kW sowie Anlagen auf Dächern und Parkplätzen bewilligungsfrei. Die Grenze setzt in der Praxis meist die Netzkapazität am Anschlusspunkt.",
    },
    {
      q: "Lohnt sich ein Speicher für einen Linzer Gewerbebetrieb?",
      a: "Das hängt vom Lastgang ab. Ein Speicher rechnet sich vor allem, wenn er Leistungsspitzen kappt und damit den Leistungspreis senkt oder wenn die Einspeisung am Netzanschluss begrenzt ist. Wir werten dazu Ihre Viertelstundenwerte aus.",
    },
  ],
  cta: {
    titel: "Ihre Halle in Linz – wir rechnen sie durch.",
    text: "Schicken Sie uns Lastgang und Dachpläne. Wir klären die Einspeisekapazität mit LINZ NETZ und liefern eine Auslegung mit Wirtschaftlichkeitsrechnung.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "LINZ NETZ GmbH",
      kurz: "LINZ NETZ",
      hinweis: "Stadtgebiet Linz; in Randlagen der PLZ 4020/4030 laut E-Control auch Netz Oberösterreich GmbH.",
      url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen",
    },
    besonderheiten: [
      {
        text: "LINZ NETZ informiert auf einer eigenen Seite über freie Einspeisekapazitäten für Erzeugungsanlagen – ein erster Anhaltspunkt, bevor wir die formelle Netzanfrage stellen.",
        url: "https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/erzeugungsanlage_anschliessen/einspeisekapazitaeten",
      },
    ],
  },
};

export default linz;
