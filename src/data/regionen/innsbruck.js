// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 6020.

const innsbruck = {
  name: "Innsbruck",
  bundesland: "Tirol",
  land: "tirol",
  bezirk: "Statutarstadt",
  plz: "6020",
  alpin: true,
  beschreibung:
    "Photovoltaik in Innsbruck: höchster PVGIS-Ertrag unserer Standorte, Netzanschluss bei der IKB, Tiroler Bauordnung, Schneelast und Föhn – für Gewerbe und Hotels.",
  titel: "Photovoltaik für Innsbruck –",
  akzent: "viel Sonne im Inntal.",
  lead: "Innsbruck erreicht in der PVGIS-Simulation den höchsten Jahresertrag aller Standorte auf dieser Website. Gewerbe, Hotellerie, Universität, Kliniken und Verwaltung haben hier Verbrauch zur Mittagszeit – und Dächer, die Schnee und Föhn aushalten müssen.",
  einleitungTitel: "Wirtschaftszentrum Westösterreichs",
  einleitung: [
    "Die Landeshauptstadt Tirols hat rund 132.800 Einwohnerinnen und Einwohner; täglich pendeln etwa 34.500 Menschen ein. Innsbruck ist Verwaltungs-, Universitäts-, Kongress- und ganzjähriges Tourismuszentrum mit 1,87 Millionen Nächtigungen (2023/24).",
    "Solarstrom hat hier gute Voraussetzungen: Das Inntal ist inneralpin, der Hochnebel des Alpenvorlands bleibt meist aus, und im Winter reflektiert Schnee zusätzliches Licht. Die hohen Nordkette-Gipfel werfen allerdings Horizontschatten – PVGIS berücksichtigt das, bei Hanglagen rechnen wir zusätzlich mit dem konkreten Horizont.",
    "Netzbetreiberin im Stadtgebiet ist die Innsbrucker Kommunalbetriebe AG (IKB), nicht die landesweite TINETZ. Die IKB informiert eigens über den Netzanschluss von Photovoltaikanlagen für Gewerbekunden, Gemeinden und Mehrparteienhäuser.",
  ],
  schwerpunkte: [
    {
      titel: "Tiroler Bauordnung: 100 m² frei",
      text: "Gebäudeanliegende Anlagen bis 100 m² sind weder anzeige- noch bewilligungspflichtig, größere brauchen eine Bauanzeige. Die Fertigstellung melden wir der Baubehörde mit Standort und Leistung.",
    },
    {
      titel: "Föhn und Schnee",
      text: "Föhnstürme und Schneelast wirken auf dieselbe Unterkonstruktion. Wir bemessen Ballast, Verankerung und Randabstände nach Wind- und Schneelastnorm für den konkreten Standort.",
    },
    {
      titel: "Institutionen und Hotellerie",
      text: "Universität, Kliniken, Verwaltung und Stadthotels haben ganzjährig Tagesverbrauch. Für öffentliche Auftraggeber liefern wir Unterlagen für Vergabeverfahren.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsstandort Innsbruck",
    text: "Innsbruck ist Verwaltungs- und Wirtschaftszentrum sowie kultureller Mittelpunkt Westösterreichs; 2001 zählte die Stadt knapp 8.000 Arbeitsstätten, davon 41 mit mehr als 200 Beschäftigten.",
    punkte: [
      { titel: "Messen", text: "Die Weltleitmesse für Seilbahntechnik Interalpin und die Gastronomie-Fachmesse fafga finden in Innsbruck statt." },
      { titel: "Flughafen", text: "Rund 1.300 Menschen arbeiten in etwa 30 Unternehmen am Flughafen – ein eigener kleiner Gewerbestandort." },
      { titel: "Gewerbegebiet Mühlau/Arzl", text: "Das Gewerbegebiet Mühlau/Arzl ist ein eigener Stadtteil, der sich über zwei Katastralgemeinden erstreckt." },
      { titel: "Tourismus", text: "1,87 Millionen Nächtigungen im Jahr (2023/24) – Stadthotels mit ganzjährigem Betrieb." },
    ],
    url: "https://de.wikipedia.org/wiki/Innsbruck",
    quelle: "Wikipedia: Innsbruck – Wirtschaft",
  },
  anfahrt: "Die schnellste Route führt über das Deutsche Eck und das Unterinntal.",
  schnee: "Neben der Schneelast bemessen wir die Anlage auch für Föhnstürme nach ÖNORM B 1991-1-4.",
  faq: [
    {
      q: "Wer ist in Innsbruck Netzbetreiber für PV-Anlagen?",
      a: "Für die Postleitzahl 6020 nennt der E-Control-Tarifkalkulator die Innsbrucker Kommunalbetriebe AG (IKB). Die IKB hat eigene Informationen zum Netzanschluss von PV-Anlagen für Gewerbe, Gemeinden und Mehrparteienhäuser.",
    },
    {
      q: "Brauche ich in Innsbruck eine Bauanzeige für die PV-Anlage?",
      a: "Bis 100 m² Modulfläche nicht, wenn die Anlage in die Dachfläche integriert oder mit höchstens 30 cm Abstand montiert ist (§ 28 Abs. 3 TBO 2022). Darüber genügt eine Bauanzeige. In jedem Fall ist die Fertigstellung mit Standort und Leistung zu melden (§ 44 Abs. 8 TBO 2022).",
    },
    {
      q: "Warum ist der Solarertrag in Innsbruck so hoch?",
      a: "Das Inntal liegt inneralpin und hat weniger Hochnebel als das Alpenvorland; im Winter kommt Reflexion durch Schnee dazu. In der PVGIS-Simulation erreicht Innsbruck deshalb den höchsten Wert unserer Standorte – Horizontschatten an Hanglagen können ihn im Einzelfall senken.",
    },
  ],
  cta: {
    titel: "Innsbrucker Dach mit viel Sonne?",
    text: "Wir rechnen Ertrag mit Horizont, bemessen für Schnee und Föhn und stellen die Netzanfrage bei der IKB.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Innsbrucker Kommunalbetriebe AG (IKB)",
      kurz: "IKB",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiberin für PLZ 6020.",
      url: "https://www.ikb.at/energie/photovoltaik/netzanschluss",
    },
    ortsbild: [
      {
        text: "In der Altstadt rund um das Goldene Dachl stehen zahlreiche Gebäude unter Denkmalschutz. Für eine PV-Anlage auf einem geschützten Gebäude ist die Bewilligung des Bundesdenkmalamts nötig.",
        url: "https://www.bda.gv.at/",
      },
    ],
  },
};

export default innsbruck;
