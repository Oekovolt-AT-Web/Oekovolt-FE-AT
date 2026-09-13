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
    { href: "/rechner/dynamischer-stromtarif", titel: "Dynamischer Stromtarif", text: "Lohnt sich Laden in günstigen Stunden?" },
    { href: "/produkte/smartenergyhome", titel: "Smart Energy Home", text: "Erzeugung, Speicher und Verbrauch in einem System." },
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Die Messtechnik, auf der die Steuerung aufsetzt." },
  ],

  "/produkte/photovoltaikanlage": [
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe mit PV", text: "Heizen mit eigenem Solarstrom – Kosten und Förderung." },
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
    { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Heizkosten mit und ohne eigenen Solarstrom vergleichen." },
  ],
  "/produkte/wallbox": [
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox Installation", text: "Kosten, technische Voraussetzungen und Anmeldung." },
    { href: "/rechner/wallbox", titel: "E-Auto-Laderechner", text: "Was Solarladen gegenüber Tanken und Netzstrom spart." },
    { href: "/produkte/smartmeter", titel: "Smart Meter & § 14a", text: "Voraussetzung für den Netzentgelt-Rabatt." },
  ],
  "/produkte/smartmeter": [
    { href: "/energie-live", titel: "Strompreis live", text: "Börsenpreis und Solaranteil viertelstündlich." },
    { href: "/produkte/smartenergyhome", titel: "Smart Energy Home", text: "Was das Messsystem für die Steuerung im Haus möglich macht." },
    { href: "/service/stromtarif", titel: "Stromtarif", text: "Dynamische Tarife nutzen den Zähler als Grundlage." },
    { href: "/dienstleistungen/smarthome", titel: "Smarthome-Lösungen", text: "Speicher, Wallbox und Messtechnik als ein System gedacht." },
  ],
  "/produkte/smartenergyhome": [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Die Komponente, die den Eigenverbrauch am stärksten hebt." },
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Die Messtechnik hinter Tarif und Steuerung." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Autarkie und Amortisation für Ihr Dach durchrechnen." },
  ],
  "/produkte/mieterstrom": [
    { href: "/produkte/smartmeter", titel: "Messkonzept & Smart Meter", text: "Viertelstundenmessung für die Gebäudeversorgung." },
    { href: "/produkte/photovoltaikanlage", titel: "PV-Anlage fürs Gebäude", text: "Die Anlage, aus der der Mieterstrom kommt." },
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Wie überschüssiger Strom vermarktet wird." },
  ],
  "/produkte/stromspeicher/[slug]": [
    { href: "/produkte/hersteller", titel: "Hersteller im Überblick", text: "Alle Marken, die wir verbauen." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Die passende Kapazität für Ihren Verbrauch." },
  ],
  "/produkte/warmepumpe/[slug]": [
    { href: "/produkte/hersteller", titel: "Hersteller im Überblick", text: "Alle Marken, die wir verbauen." },
    { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Heizkosten mit und ohne Solarstrom vergleichen." },
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
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Wie viel ein Speicher an der Altanlage bringt." },
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Was mit der Vergütung passiert, wenn die 20 Jahre ablaufen." },
    { href: "/produkte/stromspeicher", titel: "Speicher nachrüsten", text: "Der größte Hebel bei einer bestehenden Anlage." },
  ],
  "/service/direktvermarktung": [
    { href: "/service/stromtarif", titel: "Börsenpreise verstehen", text: "Warum der Marktwert Solar über den Erlös entscheidet." },
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Warum die Direktvermarktung ab 2027 an Bedeutung gewinnt." },
    { href: "/produkte/mieterstrom", titel: "Mieterstrom", text: "Solarstrom im Gebäude verkaufen statt einspeisen." },
  ],
  "/service/stromtarif": [
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Voraussetzung für dynamische Stromtarife." },
    { href: "/rechner/dynamischer-stromtarif", titel: "Tarif-Rechner mit Live-Preisen", text: "Ob sich ein dynamischer Tarif für Sie lohnt." },
    { href: "/energie-live", titel: "Börsenstrompreis live", text: "Die Preise, nach denen dynamische Tarife abrechnen." },
  ],
  "/service/vorteilswelt": [
    { href: "/angebot", titel: "Selbst Angebot anfragen", text: "Kostenlos und unverbindlich in 2 Minuten." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "PV-Anlage ohne Eigenkapital realisieren." },
    { href: "/produkte/photovoltaikanlage", titel: "PV-Anlage planen", text: "Von der Auslegung bis zur Inbetriebnahme." },
  ],

  "/referenzen/projekte": [
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik im Allgäu", text: "Wie wir planen, montieren und anmelden." },
    { href: "/referenzen/referenzkarte", titel: "Referenzkarte", text: "Unsere Anlagen auf der Karte." },
    { href: "/service/vorteilswelt", titel: "Empfehlungsprämie", text: "250 € für Sie, wenn Sie Ökovolt weiterempfehlen." },
  ],
  "/referenzen/referenzkarte": [
    { href: "/angebot", titel: "Anlage in Ihrer Nähe anfragen", text: "Kostenlose Vor-Ort-Analyse vom Fachbetrieb aus Türkheim." },
    { href: "/referenzen/projekte", titel: "Projekte im Detail", text: "Einzelne Anlagen mit Bildern und Eckdaten." },
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik im Allgäu", text: "Der Ablauf von der Beratung bis zur Abnahme." },
  ],

  "/forderungen/landesforderungen": [
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Die bundesweite Vergütung, die zu jeder Landesförderung dazukommt." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "KfW-Kredit und Bankfinanzierung im Zusammenspiel mit Zuschüssen." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "In 30 Sekunden passende Programme für Ihr Vorhaben finden." },
  ],
  "/forderungen/steuerlich": [
    { href: "/foerdercheck", titel: "Förder-Check", text: "Passende Programme in 30 Sekunden." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Solaranlage Kosten", text: "Warum die genannten Preise bereits Endpreise sind." },
    { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Zuschüsse zusätzlich zu den Steuervorteilen." },
  ],
  "/forderungen/baurecht": [
    { href: "/foerdercheck", titel: "Förder-Check", text: "Passende Programme in 30 Sekunden." },
    { href: "/forderungen/richtlinien", titel: "Normen & Richtlinien", text: "Die technischen Vorgaben neben dem Baurecht." },
    { href: "/dienstleistungen/photovoltaik", titel: "Planung & Montage", text: "Wir übernehmen Anmeldung und Genehmigungsfragen." },
  ],
  "/forderungen/richtlinien": [
    { href: "/foerdercheck", titel: "Förder-Check", text: "Passende Programme in 30 Sekunden." },
    { href: "/forderungen/baurecht", titel: "Baurecht", text: "Wann eine PV-Anlage genehmigungspflichtig ist." },
    { href: "/dienstleistungen/photovoltaik", titel: "Planung & Montage", text: "Normgerechte Ausführung durch den Fachbetrieb." },
  ],

  "/faqs": [
    { href: "/ratgeber", titel: "Ratgeber", text: "Ausführliche Antworten zu Kosten, Vergütung und Technik." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Ertrag und Amortisation für Ihr Dach berechnen." },
  ],
  "/uber-uns/team": [
    { href: "/referenzen/referenzkarte", titel: "Referenzkarte", text: "Wo unser Team schon Anlagen gebaut hat." },
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Woran dieses Team gearbeitet hat." },
    { href: "/uber-uns/jobs", titel: "Offene Stellen", text: "Wir suchen Verstärkung im Allgäu." },
  ],
  "/uber-uns/jobs": [
    { href: "/uber-uns/team", titel: "Das Team", text: "Mit wem Sie zusammenarbeiten würden." },
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Die Anlagen, die wir gemeinsam bauen." },
  ],

  // --- Neue Werkzeuge & Wissen (Redesign 2026) ---
  "/solarrechner": [
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Die wirtschaftlich sinnvolle Speichergröße finden." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Solaranlage Kosten 2026", text: "Woher die Preisannahmen des Rechners stammen." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Zuschüsse, die Ihre Amortisation verkürzen." },
  ],
  "/rechner": [
    { href: "/angebot", titel: "Angebots-Konfigurator", text: "Aus den Rechenwerten eine persönliche Einschätzung machen." },
    { href: "/energie-live", titel: "Strommarkt live", text: "Börsenpreis und Erzeugung in Echtzeit." },
    { href: "/wissen/lexikon", titel: "Photovoltaik-Lexikon", text: "Alle Fachbegriffe der Rechner kurz erklärt." },
  ],
  "/rechner/stromspeicher": [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher von Ökovolt", text: "Systeme, Nachrüstung und Notstromfunktion." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Die ganze Anlage inklusive Ertrag durchrechnen." },
    { href: "/rechner/dynamischer-stromtarif", titel: "Dynamischer Tarif", text: "Speicher mit günstigem Börsenstrom kombinieren." },
  ],
  "/rechner/waermepumpe": [
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe mit PV", text: "Planung und Installation aus einer Hand." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Zuschüsse für den Heizungstausch prüfen." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "Heizung und Solaranlage gemeinsam finanzieren." },
  ],
  "/rechner/wallbox": [
    { href: "/produkte/wallbox", titel: "Wallbox mit Überschussladen", text: "Laden, wenn das Dach Strom liefert." },
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox Installation", text: "Kosten, Voraussetzungen und Anmeldung." },
    { href: "/rechner/dynamischer-stromtarif", titel: "Dynamischer Tarif", text: "Nachts günstig laden, wenn die Börse fällt." },
  ],
  "/rechner/dynamischer-stromtarif": [
    { href: "/energie-live", titel: "Strommarkt live", text: "Der aktuelle Börsenpreis im Verlauf." },
    { href: "/service/stromtarif", titel: "Dynamischer Stromtarif", text: "Wie der Tarif funktioniert und für wen er passt." },
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Die Voraussetzung für viertelstündliche Abrechnung." },
  ],
  "/foerdercheck": [
    { href: "/forderungen/landesforderungen", titel: "Landesförderungen", text: "Alle Programme nach Bundesland im Detail." },
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile", text: "0 % Mehrwertsteuer und Einkommensteuerbefreiung." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "KfW-Kredit 270 und Bankfinanzierung." },
  ],
  "/energie-live": [
    { href: "/rechner/dynamischer-stromtarif", titel: "Dynamischer-Tarif-Rechner", text: "Was die heutigen Preise für Ihre Stromrechnung bedeuten." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Günstigen Strom speichern, teure Stunden überbrücken." },
    { href: "/wissen/lexikon", titel: "Photovoltaik-Lexikon", text: "Day-Ahead, Merit-Order & Co. verständlich erklärt." },
  ],
  "/ratgeber": [
    { href: "/wissen/lexikon", titel: "Photovoltaik-Lexikon", text: "85 Fachbegriffe von Amortisation bis Wechselrichter." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Die Artikelwerte auf Ihr eigenes Dach übertragen." },
    { href: "/faqs", titel: "Häufige Fragen", text: "Kurze Antworten auf die wichtigsten Fragen." },
  ],
  "/kontakt": [
    { href: "/angebot", titel: "Angebot in 2 Minuten", text: "Dach und Verbrauch online erfassen." },
    { href: "/solarrechner", titel: "Solarertrag berechnen", text: "Ertrag und Ersparnis vorab abschätzen." },
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Anlagen aus dem Allgäu und Bayern." },
  ],
  "/wissen/lexikon": [
    { href: "/ratgeber", titel: "Ratgeber", text: "Ausführliche Artikel zu Kosten, Förderung und Technik." },
    { href: "/faqs", titel: "Häufige Fragen", text: "Die Fragen, die uns Kunden am häufigsten stellen." },
    { href: "/rechner", titel: "Rechner & Tools", text: "Das Wissen direkt auf Ihr Haus anwenden." },
  ],
};

/** Verweise fuer einen Pfad; leeres Array, wenn nichts hinterlegt ist. */
export function querverweiseFuer(pfad) {
  return QUERVERWEISE[pfad] ?? [];
}
