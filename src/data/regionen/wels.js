// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 4600.

const wels = {
  name: "Wels",
  bundesland: "Oberösterreich",
  land: "oberoesterreich",
  bezirk: "Statutarstadt",
  plz: "4600",
  alpin: false,
  beschreibung:
    "Photovoltaik in Wels: PV-Anlagen für Industrie, Großhandel und Messebetriebe in der Pernau und am Stadtrand – Netzanschluss bei eww, OÖ-Baurecht, PVGIS-Ertrag.",
  titel: "Photovoltaik für Wels –",
  akzent: "Messe-, Handels- und Industriestadt.",
  lead: "In Wels arbeiten rund 40.000 Menschen in mehr als 4.000 Unternehmen. Viele davon haben das, was eine wirtschaftliche PV-Anlage braucht: große Hallen, Kühlung, Maschinen und einen Stromverbrauch, der tagsüber anfällt.",
  einleitungTitel: "Welser Heide, Pernau und Messegelände",
  einleitung: [
    "Wels ist mit rund 65.800 Einwohnerinnen und Einwohnern die zweitgrößte Stadt Oberösterreichs und seit jeher Verkehrsknoten, Messe- und Industriestadt. Das Industriegebiet liegt in der Pernau: chemische Industrie, Möbelerzeuger, Maschinenbau und Großhandel.",
    "Die flache Welser Heide und die Lage im Alpenvorland bringen solide Erträge; im Winter drückt gelegentlicher Hochnebel die Erzeugung, weshalb wir die Wirtschaftlichkeit mit dem Sommerhalbjahr und dem tatsächlichen Lastgang rechnen – nicht mit Jahressummen allein.",
    "Den Netzanschluss vergibt im Stadtgebiet die eww ag, in Randlagen der Postleitzahl 4600 auch die Netz Oberösterreich GmbH. Wir klären das über die Zählpunktnummer und stellen die Netzanfrage, bevor die Detailplanung beginnt.",
  ],
  schwerpunkte: [
    {
      titel: "Großhandel und Logistik",
      text: "Lager mit Kühlung, Förder- und Lagertechnik laufen tagsüber durch. Wir legen die Anlage auf die Grundlast aus und prüfen, ob ein Speicher Lastspitzen beim Schichtbeginn glättet.",
    },
    {
      titel: "Produktion in der Pernau",
      text: "Bei Chemie- und Maschinenbaubetrieben stehen Brandschutz und Dachabdichtung im Vordergrund. Wir planen Brandabschnitte und Leitungswege nach OVE-Richtlinie R 11-1 und stimmen sie mit der Betriebsfeuerwehr ab.",
    },
    {
      titel: "Messe- und Veranstaltungsflächen",
      text: "Große Freiflächen und Parkplätze eignen sich für Solarcarports mit Ladepunkten – in Oberösterreich auf Parkplätzen elektrizitätsrechtlich bewilligungsfrei.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsstandort Wels",
    text: "Wels hat etwa 40.000 Beschäftigte; täglich pendeln rund 22.600 Menschen in die Stadt ein. Zu den umsatzstärksten Unternehmen mit Sitz in Wels zählen Handel, Mineralöl, Molkerei und Elektronik.",
    punkte: [
      { titel: "Industriegebiet Pernau", text: "Chemische Industrie, Möbelerzeugung, Maschinenbau und diverse Großhändler – das größte zusammenhängende Betriebsgebiet der Stadt." },
      { titel: "Messe Wels", text: "Seit 1993 ein eigenständiges Unternehmen; traditionell Schauplatz für Landwirtschaft, Gewerbe und Industrie aus ganz Österreich." },
      { titel: "Fördertechnik, Oberflächen, Lebensmittel", text: "Hersteller von Lagersystemen, Härteanlagen, Seilen, Lacken und Pulverbeschichtung sowie eine Großbäckerei prägen den Mittelstand." },
    ],
    url: "https://de.wikipedia.org/wiki/Wels_(Stadt)",
    quelle: "Wikipedia: Wels – Wirtschaft",
  },
  anfahrt: "Über Ried im Innkreis und die Innkreisautobahn A8.",
  faq: [
    {
      q: "Wer ist in Wels Netzbetreiber für meine PV-Anlage?",
      a: "Im Welser Stadtgebiet ist die eww ag Verteilnetzbetreiberin. Für die Postleitzahl 4600 nennt der E-Control-Tarifkalkulator zusätzlich die Netz Oberösterreich GmbH. Welche Gesellschaft für Ihren Standort zuständig ist, steht auf Ihrer Stromrechnung beim Zählpunkt.",
    },
    {
      q: "Brauche ich für eine Hallenanlage in Wels ein Genehmigungsverfahren?",
      a: "Baurechtlich nein: PV-Anlagen sind in Oberösterreich bewilligungs- und anzeigefrei, solange Bebauungsplan, Statik und Ortsbild eingehalten sind. Eine Überschusseinspeiser-Anlage ist Teil der gewerblichen Betriebsanlage; eine gewerberechtliche Genehmigung braucht sie laut Land OÖ nur in Sonderfällen, etwa bei Anordnung in Fluchtwegen, explosionsgeschützten Bereichen oder bei Blendung von Nachbarn.",
    },
    {
      q: "Was bringt Photovoltaik einem Welser Handelsbetrieb im Winter?",
      a: "Deutlich weniger als im Sommer: Auf November bis Februar entfällt in Wels nur rund ein Sechstel des Jahresertrags. Wir rechnen deshalb mit Monatswerten und legen die Anlage so aus, dass im Sommer möglichst wenig Überschuss ins Netz geht.",
    },
  ],
  cta: {
    titel: "Ihr Betrieb in Wels – wir planen mit Ihrem Lastgang.",
    text: "Vorplanung aus Lastgang, Plänen und Fotos; danach Begehung und ein Angebot mit ehrlicher Eigenverbrauchsrechnung.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "eww ag",
      kurz: "eww",
      hinweis: "Stadtgebiet Wels; in Randlagen der PLZ 4600 laut E-Control auch Netz Oberösterreich GmbH.",
      url: "https://www.eww.at/",
    },
    besonderheiten: [
      {
        text: "Überschusseinspeiser in Betrieben sind Teil der gewerblichen Betriebsanlage (§ 74 Abs. 1 GewO 1994). Laut PV-Leitfaden 2026 des Landes OÖ besteht im Regelfall keine gewerberechtliche Genehmigungspflicht – Ausnahmen sind Sonderfälle wie Fluchtwege, Ex-Bereiche, Verkehrsbereiche oder Blendung.",
        url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf",
      },
    ],
  },
};

export default wels;
