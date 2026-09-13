// src/data/smarthome-seite.js
//
// Zusatzinhalte für /dienstleistungen/smarthome.
//
// Die Seite bestand bisher nur aus Backoffice-Tabs und vier Vorteilskacheln –
// rund 3.200 Pixel ohne Antworten auf die Fragen, die vor einem Speicher- oder
// Wallbox-Kauf tatsächlich gestellt werden. Alle Aussagen unten sind
// allgemeingültige Rahmenbedingungen (MsbG, UStG, EnWG) oder decken sich mit
// den Annahmen des Solarrechners (src/data/solarrechner.js), damit Seite und
// Rechner nichts Widersprüchliches sagen.

/** Weiterführende Links je Backoffice-Tab (Schlüssel = Tab-Titel). */
export const SMARTHOME_TAB_LINKS = {
  Batteriesysteme: { href: "/produkte/stromspeicher", label: "Stromspeicher im Detail" },
  Ladestationen: { href: "/produkte/wallbox", label: "Wallbox im Detail" },
  Notstrombox: { href: "/produkte/smartenergyhome", label: "Zum Smart Energy Home" },
  Smartmeter: { href: "/produkte/smartmeter", label: "Smartmeter im Detail" },
};

/** Typische Autarkiewerte – identisch mit den Annahmen im Solarrechner. */
export const AUTARKIE = { ohneSpeicher: 30, mitSpeicher: 80 };

export const SMARTHOME_FAQ = [
  {
    frage: "Kann ich einen Stromspeicher an meiner bestehenden PV-Anlage nachrüsten?",
    antwort:
      "Ja, in den allermeisten Fällen. Je nach vorhandenem Wechselrichter wird der Speicher entweder direkt über einen Hybrid-Wechselrichter angebunden oder AC-seitig mit eigenem Batterie-Wechselrichter ergänzt. Wir prüfen Ihre Anlage vor Ort und sagen Ihnen, welche Variante technisch und wirtschaftlich passt.",
  },
  {
    frage: "Wie groß sollte mein Stromspeicher sein?",
    antwort:
      "Als Faustregel gilt rund 1 kWh Speicherkapazität je 1.000 kWh Jahresverbrauch – ein Haushalt mit 5.000 kWh liegt also bei etwa 5 kWh. Größer ist nicht automatisch besser: Ein überdimensionierter Speicher wird im Winterhalbjahr selten voll und verlängert die Amortisation. Mit E-Auto oder Wärmepumpe verschiebt sich die Rechnung, deshalb planen wir die Größe immer anhand Ihres tatsächlichen Verbrauchs.",
  },
  {
    frage: "Was ist der Unterschied zwischen Notstrom und Ersatzstrom?",
    antwort:
      "Eine Notstromlösung versorgt bei einem Netzausfall einzelne Steckdosen oder Stromkreise – etwa Kühlschrank, Heizungssteuerung und Router. Eine Ersatzstromlösung versorgt das gesamte Hausnetz, oft auch dreiphasig. Welche Variante möglich ist, hängt vom Wechselrichter und Speicher ab; beides lässt sich bei der Planung berücksichtigen.",
  },
  {
    frage: "Kann meine Wallbox das E-Auto nur mit Solarstrom laden?",
    antwort:
      "Ja, mit sogenanntem PV-Überschussladen. Die Wallbox passt die Ladeleistung laufend an den Strom an, den Ihre Anlage gerade übrig hat. Voraussetzung ist, dass Wallbox und Wechselrichter bzw. Energiemanager miteinander kommunizieren. Weil ein E-Auto einphasig mindestens etwa 1,4 kW und dreiphasig etwa 4,1 kW benötigt, ist eine Wallbox mit automatischer Phasenumschaltung besonders effizient.",
  },
  {
    frage: "Brauche ich ein intelligentes Messsystem (Smartmeter)?",
    antwort:
      "Verpflichtend ist es nach dem Messstellenbetriebsgesetz unter anderem bei einem Jahresverbrauch über 6.000 kWh, bei PV-Anlagen mit mehr als 7 kW Leistung und bei steuerbaren Verbrauchern wie Wallbox oder Wärmepumpe nach § 14a EnWG. Den Einbau übernimmt Ihr Messstellenbetreiber, die jährlichen Kosten sind gesetzlich gedeckelt. Auch ohne Pflicht lohnt es sich, wenn Sie einen dynamischen Stromtarif nutzen möchten.",
  },
  {
    frage: "Gibt es eine Förderung für Stromspeicher?",
    antwort:
      "Einen bundesweiten Zuschuss gibt es derzeit nicht. Speicher, die zusammen mit einer PV-Anlage auf oder an einem Wohngebäude installiert werden, sind aber von der Mehrwertsteuer befreit (0 % Umsatzsteuer). Zusätzlich finanziert der KfW-Kredit 270 auch Speicher, und einzelne Bundesländer und Kommunen haben eigene Programme.",
  },
];
