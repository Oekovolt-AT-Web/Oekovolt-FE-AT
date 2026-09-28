// src/data/smarthome-seite.js
//
// Zusatzinhalte für /dienstleistungen/smarthome – Österreich, Stand 09/2026.
// Rechtliche Aussagen: Smart Meter nach ElWG § 54 (Opt-in/Opt-out, kein
// Opt-out bei meldepflichtigen Anlagen), Meldung von Wallbox, Wärmepumpe und
// Speicher beim Netzbetreiber, EAG-Investitionszuschuss für Speicher
// (max. 50 kWh, nur gemeinsam mit PV-Antrag).

/** Weiterführende Links je Baustein (Schlüssel = Tab-Titel). */
export const SMARTHOME_TAB_LINKS = {
  Batteriesysteme: { href: "/produkte/stromspeicher", label: "Stromspeicher im Detail" },
  Ladestationen: { href: "/produkte/wallbox", label: "Wallbox im Detail" },
  Notstrombox: { href: "/service/notstrom", label: "Notstrom & Blackout-Vorsorge" },
  Smartmeter: { href: "/produkte/smartmeter", label: "Smart Meter im Detail" },
};

/** Typische Autarkiewerte – Orientierung, abhängig von Verbrauch und Anlagengröße. */
export const AUTARKIE = { ohneSpeicher: 30, mitSpeicher: 80 };

export const SMARTHOME_FAQ = [
  {
    frage: "Was ist ein Energiemanagementsystem (EMS) im Smarthome?",
    antwort:
      "Ein Energiemanagementsystem ist die Steuerzentrale zwischen Photovoltaik, Stromspeicher, Wallbox, Wärmepumpe und Stromnetz. Es misst laufend, wie viel Strom erzeugt und verbraucht wird, und entscheidet automatisch, welches Gerät wann Energie bekommt – mit dem Ziel, möglichst viel eigenen Solarstrom zu nutzen.",
  },
  {
    frage: "Brauche ich dafür einen Smart Meter?",
    antwort:
      "Den Smart Meter stellt in Österreich immer der Netzbetreiber. Mit PV-Anlage, Wallbox, Wärmepumpe oder Speicher misst er in Viertelstundenwerten; ein Opt-out ist dann nach § 54 ElWG nicht möglich. Für die Regelung im Haus nutzt das Energiemanagement zusätzlich einen Energiezähler am Hausanschluss oder die Kundenschnittstelle des Smart Meters.",
  },
  {
    frage: "Müssen Wallbox, Wärmepumpe und Speicher gemeldet werden?",
    antwort:
      "Ja. Diese Anlagen sind dem Netzbetreiber zu melden; bei größeren Leistungen prüft er den Anschluss. Die Meldung übernimmt unser Elektrotechniker im Rahmen der Installation.",
  },
  {
    frage: "Habe ich mit Speicher bei einem Stromausfall automatisch Strom?",
    antwort:
      "Nur, wenn das System dafür ausgelegt ist. Ein normaler Speicher schaltet sich bei Netzausfall aus Sicherheitsgründen ab. Mit einer Notstrom- oder Ersatzstromlösung trennt sich das Haus vom Netz, und ausgewählte Stromkreise werden aus dem Speicher weiterversorgt.",
  },
  {
    frage: "Gibt es eine Förderung für Stromspeicher?",
    antwort:
      "Auf Bundesebene im Rahmen des EAG-Investitionszuschusses – bis maximal 50 kWh Nettokapazität und nur gemeinsam mit dem Förderantrag für die Photovoltaikanlage. Einzelne Bundesländer fördern zusätzlich. Die Sätze ändern sich je Fördercall; wir prüfen den aktuellen Stand im Angebot.",
  },
  {
    frage: "Lohnt sich ein dynamischer Stromtarif mit Energiemanagement?",
    antwort:
      "Vor allem dann, wenn Sie große, zeitlich flexible Verbraucher haben – ein E-Auto oder eine Wärmepumpe. Das Energiemanagement lässt diese gezielt in Viertelstunden mit niedrigem Day-Ahead-Preis der Gebotszone Österreich laufen. Ob es sich rechnet, hängt vom Verbrauchsprofil ab.",
  },
];
