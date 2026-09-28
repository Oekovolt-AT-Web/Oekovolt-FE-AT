// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 9020.

const klagenfurt = {
  name: "Klagenfurt am Wörthersee",
  kurzname: "Klagenfurt",
  bundesland: "Kärnten",
  land: "kaernten",
  bezirk: "Statutarstadt",
  plz: "9020",
  alpin: false,
  beschreibung:
    "Photovoltaik in Klagenfurt: PV für Gewerbe, Technologiepark und Tourismus mit hohem Südalpen-Ertrag – Netz von Energie Klagenfurt, Mitteilung nach K-BO.",
  titel: "Photovoltaik für Klagenfurt –",
  akzent: "Kärntens Wirtschaftszentrum im Süden.",
  lead: "In Klagenfurt sitzen rund ein Fünftel der Kärntner Gewerbe- und Industriebetriebe. Die Landeshauptstadt liegt südlich der Alpen und erreicht in der PVGIS-Simulation deutlich mehr Ertrag als das Alpenvorland.",
  einleitungTitel: "Landeshauptstadt, Technologiepark, Wörthersee",
  einleitung: [
    "Klagenfurt am Wörthersee ist mit rund 105.700 Einwohnerinnen und Einwohnern die größte Stadt Kärntens. 22 % der Kärntner Gewerbebetriebe und 20 % der Industriebetriebe haben hier ihren Standort; die wichtigsten Branchen sind Leuchtmittelindustrie, mittelständischer Handel und Gewerbe sowie der Tourismus.",
    "Neben der Alpen-Adria-Universität liegt der Lakeside Science & Technology Park, mit dem Kärnten Spitzentechnologie ansiedeln will. Auch der Landesenergieversorger hat seinen Konzernsitz in Klagenfurt – Energie ist hier ein Wirtschaftsthema.",
    "Netzbetreiberin im Stadtgebiet ist die Energie Klagenfurt GmbH aus der Gruppe der Stadtwerke Klagenfurt, im Umland die KNG-Kärnten Netz. Ohne Freigabe der Netzbetreiberin darf eine PV-Anlage nicht in Betrieb gehen; den Antrag stellen wir über das Antragsportal der Stadtwerke.",
  ],
  schwerpunkte: [
    {
      titel: "Mitteilung statt Bewilligung",
      text: "Anlagen zur Erzeugung erneuerbarer Energie sind nach § 7 Kärntner Bauordnung mitteilungspflichtig. Die Mitteilung an die Stadt übernehmen wir mit der Planung.",
    },
    {
      titel: "Hoher Ertrag im Klagenfurter Becken",
      text: "Mit rund 1.250 kWh je kWp (Süd, 35°) liegt Klagenfurt laut PVGIS fast 10 % über unserem Firmensitz. Bei hohem Eigenverbrauch verkürzt das die Amortisation spürbar.",
    },
    {
      titel: "Technologie und Handel",
      text: "Labore, Rechenzentren und Handelsflächen verbrauchen tagsüber viel Strom für Kühlung und IT. Wir kombinieren Dach- und Carport-Anlagen mit Speicher und Ladepunkten.",
    },
  ],
  wirtschaft: {
    titel: "Wirtschaftsstandort Klagenfurt",
    text: "2011 zählte Klagenfurt 8.832 Arbeitsstätten mit rund 71.100 Beschäftigten – Kärntens wichtigster Wirtschaftsstandort.",
    punkte: [
      { titel: "Lakeside Science & Technology Park", text: "Technologiepark direkt neben der Universität, für Kooperation von Wirtschaft und Forschung." },
      { titel: "Leuchtmittel und Getränke", text: "Leuchtmittelindustrie sowie ein Fruchtsafthersteller und eine Brauerei gehören zu den bekannten Produzenten." },
      { titel: "Energie und Verwaltung", text: "Konzernsitz des Kärntner Landesenergieversorgers, Landesverwaltung, Gerichte und Hochschulen." },
    ],
    url: "https://de.wikipedia.org/wiki/Klagenfurt_am_W%C3%B6rthersee",
    quelle: "Wikipedia: Klagenfurt am Wörthersee – Wirtschaft",
  },
  anfahrt: "Über die Tauernautobahn A10 und die Südautobahn A2.",
  faq: [
    {
      q: "Wer ist in Klagenfurt Netzbetreiber für PV-Anlagen?",
      a: "Im Stadtgebiet die Energie Klagenfurt GmbH aus der Stadtwerke-Klagenfurt-Gruppe. Für die Postleitzahl 9020 nennt der E-Control-Tarifkalkulator zusätzlich die KNG-Kärnten Netz GmbH. Ohne Freigabe der Netzbetreiberin ist der Betrieb einer PV-Anlage unzulässig.",
    },
    {
      q: "Brauche ich in Kärnten eine Baubewilligung für eine Dachanlage?",
      a: "Nein. Bauliche Anlagen, die erneuerbare Energie erzeugen oder Strom speichern, sind nach § 7 Abs. 1 lit. a Z 20 Kärntner Bauordnung 1996 mitteilungspflichtig. Die Mitteilung an die Baubehörde reicht.",
    },
    {
      q: "Warum ist der PV-Ertrag in Klagenfurt höher als in Linz?",
      a: "Klagenfurt liegt südlich des Alpenhauptkamms und hat im Mittel mehr Sonnenstunden als das Alpenvorland. PVGIS simuliert rund 1.250 kWh je kWp für ein Süddach mit 35° – etwa 10 % mehr als in Linz.",
    },
  ],
  cta: {
    titel: "Betrieb in Klagenfurt? Mehr Sonne, gleiche Sorgfalt.",
    text: "Wir stellen den Netzantrag bei Energie Klagenfurt, übernehmen die Mitteilung an die Stadt und rechnen Ihren Eigenverbrauch.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Energie Klagenfurt GmbH",
      kurz: "Energie Klagenfurt",
      hinweis: "Stadtgebiet (Stadtwerke Klagenfurt Gruppe); für PLZ 9020 laut E-Control auch KNG-Kärnten Netz GmbH.",
      url: "https://www.stw.at/privat/energie/stromnetz/photovoltaikanlagen/",
    },
  },
};

export default klagenfurt;
