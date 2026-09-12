// src/data/photovoltaik-seite.js
//
// Zusatzinhalte für /dienstleistungen/photovoltaik.
//
// Warum: "Photovoltaik Allgäu" hat laut SISTRIX einen CPC von 12 € – der
// höchste Wert aller analysierten Keywords – und die Suchergebnisse bestehen
// nur aus lokalen Anbietern. Die Seite hatte aber keinen einzigen Abschnitt
// mit Regionalbezug. Alle Orte unten sind durch echte Referenzprojekte unter
// /referenzen/projekte belegt; nichts davon ist erfunden.

export const REGION_ORTE = [
  { ort: "Türkheim", anzahl: 5, href: "/referenzen/projekte/tuerkheim", hinweis: "Firmensitz" },
  { ort: "Bad Wörishofen", anzahl: 6, href: "/referenzen/projekte/bad-woerishofen" },
  { ort: "Buchloe", anzahl: 5, href: "/referenzen/projekte/buchloe" },
  { ort: "Mindelheim", anzahl: 2, href: "/referenzen/projekte/mindelheim-1" },
  { ort: "Betzigau", anzahl: 1, href: "/referenzen/projekte/betzigau-landwirtschaft" },
  { ort: "Mering", anzahl: 1, href: "/referenzen/projekte/mering-flachdach-ost-west" },
];

export const PV_FAQ = [
  {
    frage: "Wie lange dauert es von der Anfrage bis zur fertigen PV-Anlage?",
    antwort:
      "Die Montage selbst ist bei einem Einfamilienhaus meist in ein bis zwei Tagen erledigt. Rechnen Sie vom Erstgespräch bis zur Inbetriebnahme mit einigen Wochen – der größte Zeitfaktor ist in der Regel nicht die Montage, sondern die Terminierung und die Abstimmung mit dem Netzbetreiber.",
  },
  {
    frage: "Brauche ich für eine Photovoltaikanlage eine Baugenehmigung?",
    antwort:
      "Dachanlagen auf Wohngebäuden sind in den meisten Bundesländern genehmigungsfrei. Ausnahmen gibt es bei Denkmalschutz, in Ensembles und bei bestimmten Bebauungsplänen. Wir klären das vor der Planung für Ihr konkretes Grundstück.",
  },
  {
    frage: "Welche Anlagengröße passt zu meinem Haus?",
    antwort:
      "Als Faustregel gilt rund 1 kWp je 1.000 kWh Jahresverbrauch. Entscheidend sind aber auch Dachfläche, Ausrichtung und ob in den nächsten Jahren eine Wärmepumpe oder ein E-Auto dazukommt. Im Solarrechner können Sie verschiedene Größen durchspielen.",
  },
  {
    frage: "Übernimmt Ökovolt auch die Anmeldung beim Netzbetreiber?",
    antwort:
      "Ja. Netzanmeldung, Eintrag ins Marktstammdatenregister und Inbetriebnahmeprotokoll gehören bei uns zum Leistungsumfang. Sie müssen sich um keinen der Behördengänge selbst kümmern.",
  },
  {
    frage: "Lohnt sich eine PV-Anlage im Allgäu überhaupt?",
    antwort:
      "Gerade hier. Südbayern und das Allgäu liegen mit rund 950–1.050 kWh Ertrag je kWp deutlich über dem Bundesdurchschnitt. Über die Laufzeit einer Anlage wiegt dieser Standortvorteil mehr als die meisten Förderprogramme.",
  },
  {
    frage: "Was passiert, wenn an der Anlage etwas nicht stimmt?",
    antwort:
      "Mit Ökosys überwachen wir Ihre Anlage laufend und erkennen Leistungsabfälle, bevor sie Ihnen auffallen. Für Wartung und Störungen ist unser eigenes Serviceteam zuständig – kein Subunternehmer, den Sie erst suchen müssen.",
  },
];
