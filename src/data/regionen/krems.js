// Recherche: 29.09.2026 – Quellen je Angabe (url). Netzbetreiber: E-Control-Tarifkalkulator, PLZ 3500.

const krems = {
  name: "Krems an der Donau",
  kurzname: "Krems",
  bundesland: "Niederösterreich",
  land: "niederoesterreich",
  bezirk: "Statutarstadt",
  plz: "3500",
  alpin: false,
  beschreibung:
    "Photovoltaik in Krems an der Donau: PV für Stahl, Chemie, Entsorgung, Pharma und Weinbau am Tor zur Wachau – Netz NÖ, Welterbe, Hochwasserschutz, PVGIS-Ertrag.",
  titel: "Photovoltaik für Krems –",
  akzent: "Industrie am Tor zur Wachau.",
  lead: "Krems verbindet Welterbe und Weinbau mit Industrie: Stahlverarbeitung, Chemie, Entsorgung und Tierimpfstoff-Produktion haben hier Werke, der Donauhafen und ein Technopol für medizinische Biotechnologie ergänzen den Standort.",
  einleitungTitel: "Hafen, Lerchenfeld und Wachau",
  einleitung: [
    "Krems an der Donau ist mit rund 25.600 Einwohnerinnen und Einwohnern die fünftgrößte Stadt Niederösterreichs, 70 km westlich von Wien. Der Ausbau des Donauhafens brachte der Stadt eine leistungsfähige Industrie; im Osten, im Stadtteil Lerchenfeld und im Gewerbepark Krems Ost liegen die großen Betriebe.",
    "Zu den größten Industrie- und Gewerbebetrieben gehören Stahlverarbeitung, ein Spezialist für Kunstharze und Feinchemikalien, ein Entsorgungs- und Recyclingunternehmen und ein Hersteller von Impfstoffen für Tiere. Das Technopol Krems bündelt Wirtschaft, Forschung und Ausbildung in der medizinischen Biotechnologie.",
    "Westlich beginnt die Kulturlandschaft Wachau, seit 2000 UNESCO-Welterbe. In der historischen Altstadt und in den Weinbaulagen hat das Landschaftsbild Vorrang; die Industrie- und Gewerbedächer im Osten sind dagegen ideal für große Anlagen. Wegen der Donaulage hat Krems einen mobilen Hochwasserschutz.",
  ],
  schwerpunkte: [
    {
      titel: "Industrie im Osten der Stadt",
      text: "Stahl-, Chemie- und Recyclingbetriebe haben hohe Grundlast und große Hallen. Wir planen Anlagen im dreistelligen kWp-Bereich mit Netzanfrage bei Netz Niederösterreich.",
    },
    {
      titel: "Chemie und Pharma",
      text: "In Ex-Bereichen und bei hohen Brandlasten gelten besondere Regeln für Leitungsführung und Abstände. Wir stimmen das Konzept mit Betriebssicherheit und Feuerwehr ab.",
    },
    {
      titel: "Weingüter und Kellereien",
      text: "Kühlung, Gärsteuerung und Abfüllung fallen in die Sonnenmonate. Im Welterbe-Gebiet planen wir dezent und stimmen uns früh mit Gemeinde und Behörden ab.",
    },
  ],
  wirtschaft: {
    titel: "Industrie- und Hafenstadt Krems",
    text: "Mit dem Ausbau des Kremser Hafens entstand eine moderne und leistungsfähige Industrie; der Hafen hat eine Schleuse, die auch als Hochwasserschutz geschlossen werden kann.",
    punkte: [
      { titel: "Stahl und Chemie", text: "Stahlverarbeitung sowie Kunstharze, Leime, Feinchemikalien, Lackrohstoffe und Flammschutzmittel." },
      { titel: "Entsorgung und Recycling", text: "Ein 1936 gegründetes Unternehmen für Transport, Entsorgung, Kompostierung und Schlackeaufbereitung hat seinen Sitz in Krems." },
      { titel: "Tierimpfstoffe und Biotechnologie", text: "Ein Impfstoffhersteller für Tiere und das Technopol Krems für medizinische Biotechnologie." },
    ],
    url: "https://de.wikipedia.org/wiki/Krems_an_der_Donau",
    quelle: "Wikipedia: Krems an der Donau – Wirtschaft",
  },
  anfahrt: "Über die Westautobahn A1 und die Kremser Schnellstraße S33.",
  faq: [
    {
      q: "Darf man in der Wachau Photovoltaik bauen?",
      a: "Auf Gebäuden grundsätzlich ja: In Niederösterreich ist PV auf Bauwerken nach § 17 Z 14 NÖ Bauordnung bewilligungsfrei, in Schutzzonen und erhaltungswürdigen Altortgebieten aber an einsehbaren Flächen anzeigepflichtig. Im UNESCO-Welterbe Wachau achten Gemeinden besonders auf das Landschaftsbild; Freiflächenanlagen sind dort besonders sorgfältig zu prüfen.",
    },
    {
      q: "Wer ist in Krems Netzbetreiber?",
      a: "Für die Postleitzahl 3500 nennt der E-Control-Tarifkalkulator die Netz Niederösterreich GmbH.",
    },
    {
      q: "Was bedeutet die Donaulage für eine PV-Anlage in Krems?",
      a: "Die Module auf dem Dach sind vom Hochwasser nicht betroffen, wohl aber Technik in tiefliegenden Räumen. Krems hat einen mobilen Hochwasserschutz; trotzdem planen wir Wechselrichter und Speicher in hochwassersicheren Bereichen und prüfen den Standort in HORA.",
    },
  ],
  cta: {
    titel: "Industriebetrieb oder Weingut in Krems?",
    text: "Wir prüfen Dach, Netz und Ortsbild und liefern ein Angebot mit ehrlicher Eigenverbrauchsrechnung.",
  },
  fakten: {
    stand: "2026-09-29",
    netzbetreiber: {
      name: "Netz Niederösterreich GmbH",
      kurz: "Netz NÖ",
      hinweis: "Laut E-Control-Tarifkalkulator Verteilnetzbetreiber für PLZ 3500.",
      url: "https://netz-noe.at/strom/strom-erzeugen-und-speichern",
    },
    ortsbild: [
      {
        text: "Die Kulturlandschaft Wachau mit den Altstädten von Stein und Krems ist seit 2000 UNESCO-Welterbe. Für sichtbare Anlagen in der Altstadt und in Weinbaulagen stimmen wir uns früh mit Gemeinde und Behörden ab.",
        url: "https://whc.unesco.org/en/list/970",
      },
    ],
  },
};

export default krems;
