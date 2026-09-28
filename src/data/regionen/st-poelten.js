// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 3100.

const stPoelten = {
  name: "St. Pölten",
  bundesland: "Niederösterreich",
  land: "niederoesterreich",
  bezirk: "Statutarstadt",
  plz: "3100",
  alpin: false,
  beschreibung:
    "Photovoltaik in St. Pölten: PV für Gewerbe, Handel, Verwaltung und Krankenhaus in der Landeshauptstadt – Netz Niederösterreich, NÖ Bauordnung, PVGIS.",
  titel: "Photovoltaik für St. Pölten –",
  akzent: "Landeshauptstadt mit Einpendlern.",
  lead: "In St. Pölten gibt es weit mehr Arbeitsplätze als Erwerbstätige: Rund 60 % der hier Beschäftigten pendeln ein. Landesverwaltung, Krankenhaus, Handel und Gewerbe haben Verbrauch zu Bürozeiten – genau dann, wenn die Sonne scheint.",
  einleitungTitel: "Regierungsviertel, Handel, Gewerbe",
  einleitung: [
    "Die niederösterreichische Landeshauptstadt ist mit rund 60.100 Einwohnerinnen und Einwohnern die größte Stadt des Landes. 2001 arbeiteten hier gut 40.000 Menschen in 2.711 Arbeitsstätten; die drei größten – darunter das Krankenhaus und das Regierungsviertel – beschäftigten jeweils über 1.000 Personen.",
    "Die großen Industriebetriebe der Vergangenheit – Chemiefaser- und Textilwerke – bestehen nicht mehr. Heute prägen Verwaltung, Gesundheit, Handel und ein breiter Mittelstand die Wirtschaft, ergänzt um Produktionsbetriebe.",
    "Baurechtlich ist St. Pölten unkompliziert: Nach § 17 Z 14 NÖ Bauordnung 2014 ist die Anbringung von Photovoltaik auf Bauwerken bewilligungs-, anzeige- und meldefrei – außer in Schutzzonen und erhaltungswürdigen Altortgebieten, wo einsehbare Flächen anzeigepflichtig sind.",
  ],
  schwerpunkte: [
    {
      titel: "Öffentliche Gebäude",
      text: "Verwaltung, Schulen und Krankenhaus verbrauchen tagsüber planbar. Für öffentliche Auftraggeber erstellen wir Unterlagen, die sich in Vergabeverfahren einfügen.",
    },
    {
      titel: "Netzkapazität früh prüfen",
      text: "Netz Niederösterreich veröffentlicht eine Trafokarte für Einspeiser. Wir prüfen damit die Kapazität am nächsten Umspannpunkt, bevor wir die formelle Netzanfrage stellen.",
    },
    {
      titel: "Handel und Mittelstand",
      text: "Fachmärkte und Gewerbehallen mit Kühlung und Beleuchtung nutzen Solarstrom direkt. Parkplatzüberdachungen bringen Ladepunkte für Kundschaft und Fuhrpark.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsstandort St. Pölten",
    text: "2001 pendelten 24.866 Personen – rund 60 % aller in St. Pölten Erwerbstätigen – von außerhalb in die Stadt.",
    punkte: [
      { titel: "Verwaltung und Gesundheit", text: "Regierungsviertel und Krankenhaus zählen zu den drei größten Arbeitsstätten mit jeweils über 1.000 Beschäftigten." },
      { titel: "Produktion und Handel", text: "Sechs der 23 größten Arbeitsstätten (2001) gehören zum Produktionssektor, darunter Zulieferer der Dämmstoffindustrie; dazu Möbelhandel mit Lager und Unternehmenssitz." },
      { titel: "Medien und Dienstleistung", text: "Mehrere Medienunternehmen und zahlreiche Dienstleister haben ihren Sitz in der Landeshauptstadt." },
    ],
    url: "https://de.wikipedia.org/wiki/St._P%C3%B6lten",
    quelle: "Wikipedia: St. Pölten – Wirtschaft",
  },
  anfahrt: "Über die Westautobahn A1.",
  faq: [
    {
      q: "Welcher Netzbetreiber ist in St. Pölten zuständig?",
      a: "Für die Postleitzahl 3100 nennt der E-Control-Tarifkalkulator die Netz Niederösterreich GmbH. Deren Trafokarte für Einspeiser gibt einen ersten Eindruck, wie viel Kapazität im Netz frei ist.",
    },
    {
      q: "Brauche ich in St. Pölten eine Bewilligung für eine PV-Anlage?",
      a: "Auf Bauwerken nicht: § 17 Z 14 NÖ Bauordnung 2014 stellt PV-Anlagen bewilligungs-, anzeige- und meldefrei. In Schutzzonen und erhaltungswürdigen Altortgebieten ist die Anbringung an einsehbaren Flächen anzeigepflichtig; Freiflächen über 100 kW im Grünland sind ebenfalls anzuzeigen.",
    },
    {
      q: "Wie weit ist St. Pölten von Ökovolt entfernt?",
      a: "Rund 250 km Straße über die Westautobahn von unserem Firmensitz in Ostermiething. Die Vorplanung erfolgt mit Ihren Daten, Begehung und Montage vereinbaren wir fix, im Betrieb überwachen wir die Anlage über unsere eigene Fernwartung.",
    },
  ],
  cta: {
    titel: "Projekt in der Landeshauptstadt?",
    text: "Wir prüfen Netzkapazität, Dach und Lastgang und liefern eine Auslegung mit Wirtschaftlichkeitsrechnung.",
  },
  links: [{ href: "/kommunen", label: "PV für Gemeinden und öffentliche Hand" }],
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Netz Niederösterreich GmbH",
      kurz: "Netz NÖ",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiber für PLZ 3100.",
      url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern",
    },
    besonderheiten: [
      {
        text: "Netz Niederösterreich stellt eine Trafokarte für Einspeiser bereit, die freie Kapazitäten an Umspannstellen zeigt – ein erster Anhaltspunkt vor der Netzanfrage.",
        url: "https://netz-noe.at/strom/versorgungsgebiete-und-kapazitaeten/trafokarte-fuer-einspeiser",
      },
    ],
  },
};

export default stPoelten;
