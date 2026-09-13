// src/data/verlinkung.js
//
// Kuratierte Querverweise je Seite.
//
// Hintergrund: Eine Crawl-Analyse ergab, dass 16 von 16 geprueften Seiten
// NULL redaktionelle Eingangslinks hatten – erreichbar war jede Seite nur
// ueber das Menue. Damit ist die Site ein Navigationsbaum, kein Linknetz:
// keine Seite gibt einer anderen Relevanz weiter, und fuer Google sind es
// 90 isolierte Einzelseiten.
//
// Die Inhalte kommen aus dem Backoffice, deshalb lassen sich Links nicht in
// den Fliesstext setzen. Diese Liste ist die Alternative: pro Seite zwei bis
// drei THEMATISCH passende Ziele mit sprechendem Ankertext.
//
// Regeln beim Ergaenzen:
//   - Ankertext beschreibt das Ziel, nie "hier" oder "mehr erfahren".
//   - Nur verlinken, was inhaltlich wirklich zusammenhaengt.
//   - Nicht auf die eigene Seite verlinken.

export const QUERVERWEISE = {
  "/dienstleistungen/photovoltaik": [
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp, Kostenaufschlüsselung und laufende Ausgaben." },
    { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Welche Zuschüsse und Programme für Ihren Standort gelten." },
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Anlagen, die wir im Allgäu und in Bayern gebaut haben." },
    { href: "/faqs", titel: "Häufige Fragen", text: "Ertrag, Dauer der Montage, Wartung – kurz beantwortet." },
  ],
  "/dienstleistungen/smarthome": [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Welcher Speicher zu welcher Anlagengröße passt." },
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox installieren", text: "Kosten, Anmeldung und PV-Überschussladen im Überblick." },
    { href: "/produkte/smartenergyhome", titel: "Smart Energy Home", text: "Erzeugung, Speicher und Verbrauch in einem System." },
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Warum Eigenverbrauch heute mehr bringt als Einspeisung." },
  ],

  "/produkte/photovoltaikanlage": [
    { href: "/ratgeber/solaranlage-kosten", titel: "Solaranlage Kosten 2026", text: "Preistabelle nach Anlagengröße und was im Komplettpreis steckt." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher nachrüsten", text: "Warum der Eigenverbrauch über die Wirtschaftlichkeit entscheidet." },
    { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Zuschüsse, die zusätzlich zur EEG-Vergütung möglich sind." },
  ],
  "/produkte/stromspeicher": [
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Warum sich Eigenverbrauch heute mehr lohnt als Einspeisung." },
    { href: "/service/repowering", titel: "Speicher nachrüsten", text: "Was bei einer bestehenden Anlage zu beachten ist." },
    { href: "/produkte/hersteller", titel: "Hersteller im Überblick", text: "BYD, Huawei, Solis und die anderen Marken, die wir verbauen." },
  ],
  "/produkte/warmepumpe": [
    { href: "/produkte/photovoltaikanlage", titel: "PV-Anlage planen", text: "Die Wärmepumpe rechnet sich vor allem mit eigenem Solarstrom." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Deckt den Wärmepumpenbetrieb auch in sonnenarmen Stunden." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "Wie sich die Investition ohne Eigenkapital stemmen lässt." },
  ],
  "/produkte/wallbox": [
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox Installation", text: "Kosten, technische Voraussetzungen und Anmeldung." },
    { href: "/produkte/smartenergyhome", titel: "Überschussladen", text: "Das E-Auto mit dem Strom laden, den das Dach gerade liefert." },
  ],
  "/produkte/smartmeter": [
    { href: "/produkte/smartenergyhome", titel: "Smart Energy Home", text: "Was das Messsystem für die Steuerung im Haus möglich macht." },
    { href: "/service/stromtarif", titel: "Stromtarif", text: "Dynamische Tarife nutzen den Zähler als Grundlage." },
    { href: "/dienstleistungen/smarthome", titel: "Smarthome-Lösungen", text: "Speicher, Wallbox und Messtechnik als ein System gedacht." },
  ],
  "/produkte/smartenergyhome": [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Die Komponente, die den Eigenverbrauch am stärksten hebt." },
    { href: "/produkte/wallbox", titel: "Wallbox", text: "Laden mit Solarüberschuss statt mit Netzstrom." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Autarkie und Amortisation für Ihr Dach durchrechnen." },
  ],
  "/produkte/mieterstrom": [
    { href: "/produkte/photovoltaikanlage", titel: "PV-Anlage fürs Gebäude", text: "Die Anlage, aus der der Mieterstrom kommt." },
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Wie überschüssiger Strom vermarktet wird." },
  ],
  "/produkte/hersteller": [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Welcher Speicher zu welcher Anlagengröße passt." },
    { href: "/produkte/photovoltaikanlage", titel: "PV-Anlage planen", text: "Module, Wechselrichter und Montage aus einer Hand." },
  ],

  "/service/finanzierung": [
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Die Zahlen, die der Finanzierung zugrunde liegen." },
    { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Zuschüsse senken den zu finanzierenden Betrag." },
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe mit PV", text: "Heizung und Solaranlage gemeinsam finanzieren." },
  ],
  "/service/repowering": [
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Was mit der Vergütung passiert, wenn die 20 Jahre ablaufen." },
    { href: "/produkte/stromspeicher", titel: "Speicher nachrüsten", text: "Der größte Hebel bei einer bestehenden Anlage." },
  ],
  "/service/direktvermarktung": [
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Warum die Direktvermarktung ab 2027 an Bedeutung gewinnt." },
    { href: "/produkte/mieterstrom", titel: "Mieterstrom", text: "Solarstrom im Gebäude verkaufen statt einspeisen." },
  ],
  "/service/stromtarif": [
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Voraussetzung für dynamische Stromtarife." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Günstige Stunden speichern, teure überbrücken." },
  ],
  "/service/vorteilswelt": [
    { href: "/service/finanzierung", titel: "Finanzierung", text: "PV-Anlage ohne Eigenkapital realisieren." },
    { href: "/produkte/photovoltaikanlage", titel: "PV-Anlage planen", text: "Von der Auslegung bis zur Inbetriebnahme." },
  ],

  "/referenzen/projekte": [
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik im Allgäu", text: "Wie wir planen, montieren und anmelden." },
    { href: "/referenzen/referenzkarte", titel: "Referenzkarte", text: "Unsere Anlagen auf der Karte." },
    { href: "/service/vorteilswelt", titel: "Empfehlungsprämie", text: "250 € für Sie, wenn Sie Ökovolt weiterempfehlen." },
  ],
  "/referenzen/referenzkarte": [
    { href: "/referenzen/projekte", titel: "Projekte im Detail", text: "Einzelne Anlagen mit Bildern und Eckdaten." },
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik im Allgäu", text: "Der Ablauf von der Beratung bis zur Abnahme." },
  ],

  "/forderungen/landesforderungen": [
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Die bundesweite Vergütung, die zu jeder Landesförderung dazukommt." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "KfW-Kredit und Bankfinanzierung im Zusammenspiel mit Zuschüssen." },
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile", text: "Nullsteuersatz und Einkommensteuerbefreiung." },
  ],
  "/forderungen/steuerlich": [
    { href: "/ratgeber/solaranlage-kosten", titel: "Solaranlage Kosten", text: "Warum die genannten Preise bereits Endpreise sind." },
    { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Zuschüsse zusätzlich zu den Steuervorteilen." },
  ],
  "/forderungen/baurecht": [
    { href: "/forderungen/richtlinien", titel: "Normen & Richtlinien", text: "Die technischen Vorgaben neben dem Baurecht." },
    { href: "/dienstleistungen/photovoltaik", titel: "Planung & Montage", text: "Wir übernehmen Anmeldung und Genehmigungsfragen." },
  ],
  "/forderungen/richtlinien": [
    { href: "/forderungen/baurecht", titel: "Baurecht", text: "Wann eine PV-Anlage genehmigungspflichtig ist." },
    { href: "/dienstleistungen/photovoltaik", titel: "Planung & Montage", text: "Normgerechte Ausführung durch den Fachbetrieb." },
  ],

  "/faqs": [
    { href: "/ratgeber", titel: "Ratgeber", text: "Ausführliche Antworten zu Kosten, Vergütung und Technik." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Ertrag und Amortisation für Ihr Dach berechnen." },
  ],
  "/uber-uns/team": [
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Woran dieses Team gearbeitet hat." },
    { href: "/uber-uns/jobs", titel: "Offene Stellen", text: "Wir suchen Verstärkung im Allgäu." },
  ],
  "/uber-uns/jobs": [
    { href: "/uber-uns/team", titel: "Das Team", text: "Mit wem Sie zusammenarbeiten würden." },
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Die Anlagen, die wir gemeinsam bauen." },
  ],
};

/** Verweise fuer einen Pfad; leeres Array, wenn nichts hinterlegt ist. */
export function querverweiseFuer(pfad) {
  return QUERVERWEISE[pfad] ?? [];
}
