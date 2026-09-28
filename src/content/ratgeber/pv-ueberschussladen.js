// Ratgeber: PV-Überschussladen (Österreich) – Gewerbe, Hotellerie, Premium-Privat
// Quellen: TOR Verteilernetzanschluss NS V1.3.1 (Ladeeinrichtungen > 3,68 kVA: Drehstromanschluss,
// Unsymmetrie max. 16 A je Leiter, 1-phasig ladende Fahrzeuge an L1, offene Schnittstelle OCPP/EEBUS,
// Zufallsverzögerung 0–300 s), OeMAG-Marktpreise PV 2026, BMF-Strompreis 2026 (32,806 ct/kWh, Referenz Haushalt),
// IEC 61851-1 (Mindestladestrom 6 A). Rechenbeispiele mit offengelegten Annahmen.

const KM = 15000;
const VERBRAUCH = 18; // kWh/100 km inkl. Ladeverluste, Annahme
const BEDARF = (KM * VERBRAUCH) / 100;
const HH = 0.32806; // €/kWh brutto, BMF-Referenz Haushalt 2026
const GEW = 0.2; // €/kWh netto, Annahme Gewerbe
const MARKT = 0.068; // €/kWh, OeMAG-Sommermarktpreis PV 2026 gerundet
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const kosten = (q, preis) => eur(BEDARF * (1 - q) * preis + BEDARF * q * MARKT);

const artikel = {
  slug: "pv-ueberschussladen",
  title: "PV-Überschussladen: E-Autos mit eigenem Solarstrom laden",
  seoTitle: "PV-Überschussladen: E-Auto mit Solarstrom | Ökovolt",
  kurzTitel: "PV-Überschussladen",
  description:
    "PV-Überschussladen erklärt: Funktionsweise, 6-A-Mindeststrom, Phasenumschaltung, TOR-Regeln in Österreich, Steuerung und Rechenbeispiel für Betrieb und Privat.",
  excerpt:
    "Beim Überschussladen fließt nur der Solarstrom ins Auto, den das Gebäude gerade nicht braucht. Wie das technisch funktioniert, welche Regeln der Netzbetreiber setzt und was es im Betrieb und zu Hause bringt.",
  hauptKeyword: "pv überschussladen",
  keywords: [
    "PV-Überschussladen",
    "Überschussladen Wallbox",
    "E-Auto mit Solarstrom laden",
    "Phasenumschaltung Wallbox",
    "Überschussladen Firmenparkplatz",
    "Wallbox PV-Überschuss Österreich",
    "Solarstrom laden Kosten",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "E-Mobilität & Sektorkopplung",
  bild: "/Images/Ratgeber/pv-ueberschussladen.jpg",
  bildAlt: "Wallbox für das Laden mit Photovoltaik-Überschuss an einer Hauswand",
  badge: { wert: "1,4 kW", text: "Mindestleistung beim einphasigen Laden mit 6 A – dreiphasig rund 4,1 kW" },

  kurzFazit: [
    "**Beim PV-Überschussladen regelt die Wallbox den Ladestrom laufend so, dass nur Solarstrom ins Auto fließt, der sonst ins Netz ginge.** Voraussetzung sind eine steuerbare Wallbox, eine Messung am Netzanschlusspunkt und ein Energiemanagement.",
    "**Die technische Untergrenze liegt bei 6 A:** einphasig rund 1,4 kW, dreiphasig rund 4,1 kW. Wallboxen mit automatischer Phasenumschaltung nutzen kleine Überschüsse deutlich besser.",
    `**Rechenbeispiel:** Ein Auto mit ${KM.toLocaleString("de-DE")} km im Jahr braucht rund ${kwh(BEDARF)}. Zu 100 % mit Haushaltsstrom (BMF-Referenzwert 2026: 32,806 ct/kWh) kostet das rund ${eur(BEDARF * HH)}, mit 60 % Solarstrom rund ${kosten(0.6, HH)} – der Solarstrom ist dabei mit der entgangenen Einspeisung bewertet.`,
    "**In Österreich gelten die TOR:** Ladeeinrichtungen über 3,68 kVA sind meldepflichtig, grundsätzlich dreiphasig anzuschließen und dürfen höchstens 16 A Unsymmetrie je Leiter verursachen.",
  ],

  abschnitte: [
    {
      id: "funktion",
      titel: "Wie funktioniert PV-Überschussladen?",
      tocLabel: "Funktionsweise",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Energiemanagement misst am Netzanschlusspunkt, wie viel Strom gerade ins Netz fließt, und gibt der Wallbox diesen Überschuss als Ladeleistung vor – Sekunde für Sekunde.** Zieht im Gebäude die Last an oder schiebt sich eine Wolke vor die Sonne, reduziert die Wallbox den Ladestrom; kommt die Sonne zurück, erhöht sie ihn wieder. Der Begriff [Überschussladen](/wissen/lexikon#ueberschussladen) ist im Lexikon erklärt.",
        },
        {
          typ: "tabelle",
          caption: "Lademodi einer PV-fähigen Wallbox",
          kopf: ["Modus", "Verhalten", "Einsatz"],
          zeilen: [
            ["Nur Überschuss", "lädt ausschließlich mit PV-Überschuss, pausiert sonst", "Fahrzeuge mit langen Standzeiten"],
            ["Mindestladung + Überschuss", "lädt immer mit Mindestleistung, Überschuss obendrauf", "wenn bis zu einer Uhrzeit ein Mindestladestand nötig ist"],
            ["Zielladung", "erreicht einen Ladestand bis zu einer Uhrzeit, nutzt so viel PV wie möglich", "Poolfahrzeuge, Schichtbetrieb"],
            ["Sofortladen", "volle Leistung unabhängig von PV", "wenn das Auto dringend gebraucht wird"],
          ],
          minBreite: 600,
        },
        {
          typ: "p",
          text: "Wichtig ist die Messung am richtigen Punkt: Die Regelung braucht den Saldo am Netzanschluss, nicht nur die PV-Erzeugung. Nur so berücksichtigt sie, dass gleichzeitig Kühlung, Maschinen oder eine Wärmepumpe laufen. In Betrieben übernimmt das ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem), das mehrere Ladepunkte und andere Verbraucher koordiniert.",
        },
      ],
    },
    {
      id: "technik",
      titel: "6 A, Phasenumschaltung und Schieflast: die technischen Grenzen",
      tocLabel: "Technik & Grenzen",
      bloecke: [
        {
          typ: "p",
          text: "**Elektroautos laden mit Wechselstrom erst ab einem Mindeststrom von 6 A; darunter pausiert die Ladung.** Einphasig entspricht das rund 1,4 kW, dreiphasig rund 4,1 kW. Ohne Phasenumschaltung bleibt ein Überschuss unter rund 4 kW bei dreiphasigem Laden also ungenutzt – an wechselhaften Tagen und in der Übergangszeit ein großer Teil.",
        },
        {
          typ: "tabelle",
          caption: "Ladeleistung nach Phasen und Strom (230/400 V)",
          kopf: ["Anschluss", "6 A (Minimum)", "10 A", "16 A (Maximum 11-kW-Box)"],
          zeilen: [
            ["einphasig", "1,4 kW", "2,3 kW", "3,7 kW"],
            ["dreiphasig", "4,1 kW", "6,9 kW", "11 kW"],
          ],
          hervorheben: 1,
          minBreite: 520,
          fussnote: "Gerundete Werte; die tatsächliche Leistung hängt vom Onboard-Lader des Fahrzeugs ab. Manche Fahrzeuge laden nur ein- oder zweiphasig.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Was die TOR in Österreich vorgeben",
          text: "Laut TOR Verteilernetzanschluss (Niederspannung, V1.3.1) sind Ladeeinrichtungen über 3,68 kVA grundsätzlich über einen Drehstromanschluss anzuschließen, und die Unsymmetrie der Leiterströme ist auf höchstens 16 A je Leiter zu begrenzen. Einphasig ladende Fahrzeuge werden standardmäßig an L1 betrieben – bei mehreren Ladepunkten sind die Phasen deshalb zyklisch zu tauschen. Zudem muss die Wallbox über eine offene Schnittstelle (z. B. OCPP oder EEBUS) steuerbar sein.",
        },
        {
          typ: "p",
          text: "Eine Wallbox mit automatischer Umschaltung zwischen ein- und dreiphasigem Laden nutzt kleine Überschüsse einphasig ab 1,4 kW und schaltet bei mehr Sonne auf drei Phasen. Das erhöht den Solaranteil spürbar, besonders im Frühjahr und Herbst. Die Meldung beim Netzbetreiber und die Anschlussbedingungen beschreibt der Ratgeber [Wallbox Installation](/ratgeber/wallbox-installation).",
        },
      ],
    },
    {
      id: "rechnung",
      titel: "Was bringt Überschussladen? Rechenbeispiel",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Solarstrom im Auto ist so viel wert wie der Netzstrom, den er ersetzt, abzüglich der Einspeisevergütung, auf die Sie verzichten.** Beispiel: Ein Fahrzeug mit ${KM.toLocaleString("de-DE")} km im Jahr und ${VERBRAUCH} kWh/100 km inklusive Ladeverlusten braucht rund ${kwh(BEDARF)}.`,
        },
        {
          typ: "tabelle",
          caption: `Jährliche Ladekosten eines Fahrzeugs (${KM.toLocaleString("de-DE")} km) nach Solaranteil (Beispielrechnung, Stand September 2026)`,
          kopf: ["Solaranteil", "Privat (32,806 ct/kWh brutto)", "Betrieb (20 ct/kWh netto)"],
          zeilen: [
            ["0 %", kosten(0, HH), kosten(0, GEW)],
            ["30 %", kosten(0.3, HH), kosten(0.3, GEW)],
            ["60 %", kosten(0.6, HH), kosten(0.6, GEW)],
            ["80 %", kosten(0.8, HH), kosten(0.8, GEW)],
          ],
          hervorheben: 1,
          markierteZeile: 2,
          minBreite: 560,
          fussnote: "Annahmen: Privat mit dem BMF-Referenzstrompreis 2026 (Durchschnittswert Haushalt), Betrieb mit 20 ct/kWh netto als Beispielwert; Solarstrom bewertet mit 6,8 ct/kWh entgangener Einspeisung (gerundeter OeMAG-Sommermarktpreis PV 2026). Ohne Wallbox- und Installationskosten.",
        },
        {
          typ: "p",
          text: "Wie hoch der Solaranteil tatsächlich wird, hängt vor allem von den Standzeiten ab: Ein Auto, das tagsüber am Betriebsparkplatz oder zu Hause steht, erreicht übers Jahr einen hohen Anteil; eines, das nur abends ansteckt, braucht einen Speicher. Die Bewertung des Solarstroms mit dem Marktpreis zeigt auch, warum Überschussladen im Sommer besonders attraktiv ist: Der OeMAG-Marktpreis lag von April bis Juli 2026 nur bei rund 6,1 bis 6,8 ct/kWh.",
        },
        {
          typ: "p",
          text: "Für Betriebe kommt ein steuerlicher Aspekt hinzu: Laden Mitarbeitende ihre Dienstwagen kostenlos am Betriebsgelände, ist das kein Sachbezug. Wird dagegen zu Hause geladen, kann der Arbeitgeber 2026 bis zu 32,806 ct/kWh steuerfrei ersetzen – aber nur mit fahrzeugbezogenem Nachweis. Solarstrom am Firmenparkplatz ist damit doppelt attraktiv: günstiger für den Betrieb und einfacher in der Lohnverrechnung.",
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Überschussladen im Betrieb, Hotel und bei Gemeinden",
      tocLabel: "Gewerbe & Hotel",
      bloecke: [
        {
          typ: "p",
          text: "**Im Betrieb wirkt Überschussladen am stärksten, weil viele Fahrzeuge gleichzeitig lange stehen – die Flotte wird zum flexiblen Verbraucher, der Mittagsspitzen aufnimmt.** Entscheidend ist ein Lastmanagement, das PV-Überschuss, Gebäudelast und Prioritäten der Fahrzeuge zusammenführt.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Dienst- und Poolfahrzeuge", text: "Standzeiten über den Tag, Ladeziel am Nachmittag. Laden am Betrieb ist für Mitarbeitende kein Sachbezug. Mehr im Ratgeber [E-Flotte laden](/ratgeber/e-flotte-laden-photovoltaik)." },
            { titel: "Hotellerie & Tourismus", text: "Gäste laden über Nacht oder während Ausflügen; Solarstrom tagsüber für Hotelfahrzeuge und Tagesgäste. Mehr unter [Hotellerie & Tourismus](/hotellerie-tourismus)." },
            { titel: "Gemeinden", text: "Bauhof- und Gemeindefahrzeuge, Carsharing, Ladepunkte an Gemeindegebäuden – oft kombiniert mit einer Energiegemeinschaft. Siehe [Gemeinden](/kommunen)." },
          ],
        },
        {
          typ: "p",
          text: "Wer Parkplätze überdacht, gewinnt zusätzliche PV-Fläche direkt über den Ladepunkten – mehr im Ratgeber [Solarcarport](/ratgeber/solarcarport). Die Planung von Ladeparks übernimmt Ökovolt im Bereich [Ladeinfrastruktur](/ladeinfrastruktur).",
        },
      ],
    },
    {
      id: "steuerung",
      titel: "Welche Wallbox und welche Steuerung?",
      tocLabel: "Wallbox & Steuerung",
      bloecke: [
        {
          typ: "p",
          text: "**Für Überschussladen braucht es eine Wallbox, die sich extern über ein offenes Protokoll regeln lässt, und eine Instanz, die den Überschuss kennt.** Das kann der Wechselrichter mit integrierter Wallbox-Steuerung sein, ein eigenständiges Energiemanagement oder – bei Ladeparks – ein OCPP-Backend mit lokalem Lastmanagement.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Offene Schnittstelle: Modbus TCP, OCPP oder EEBUS – in den TOR für Ladeeinrichtungen über 3,68 kVA ohnehin gefordert.",
            "Automatische Phasenumschaltung für kleine Überschüsse.",
            "Messung am Netzanschlusspunkt (Smart Meter-Schnittstelle oder eigener Zähler), nicht nur PV-Erzeugung.",
            "Prioritäten zwischen Wallbox, Speicher und Wärmepumpe einstellbar.",
            "Lokale Funktion auch ohne Cloud; Zugriff abgesichert.",
            "Für Firmenwagen: fahrzeugbezogene Erfassung der Lademenge (Nachweis für Kostenersatz und Kennzahlen).",
            "Prüfbericht nach OVE-Richtlinie R 37 für die Netzkonformität (ab 15.12.2026 verpflichtend).",
          ],
        },
        {
          typ: "p",
          text: "Welche Geräte wir einsetzen, zeigt die Seite [Wallbox](/produkte/wallbox). Speicher und Wallbox konkurrieren um denselben Überschuss – wie man die Reihenfolge festlegt, erklärt der Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "ladepark",
      titel: "Beispiel: Firmenparkplatz mit 20 Ladepunkten",
      tocLabel: "Beispiel Ladepark",
      bloecke: [
        {
          typ: "p",
          text: "**Auf einem Firmenparkplatz verteilt das Lastmanagement den PV-Überschuss auf alle angesteckten Fahrzeuge – so laden viele Autos gleichzeitig mit kleiner Leistung, statt wenige mit voller.** Das nutzt den Überschuss fast vollständig und hält die Anschlussleistung ein.",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: Verteilung von 60 kW PV-Überschuss auf 20 Ladepunkte (vereinfacht)",
          kopf: ["Situation", "Verteilung", "Ergebnis"],
          zeilen: [
            ["20 Fahrzeuge, 60 kW Überschuss", "je 3 kW – einphasig mit rund 13 A", "alle laden, kein Netzbezug"],
            ["20 Fahrzeuge, 25 kW Überschuss", "17 Fahrzeuge einphasig mit 6 A (je rund 1,4 kW), 3 pausieren im Wechsel", "Überschuss vollständig genutzt"],
            ["Poolfahrzeug muss um 14 Uhr voll sein", "Priorität: 11 kW für dieses Fahrzeug, Rest verteilt", "Ladeziel erreicht, übrige laden langsamer"],
            ["Wolke, Überschuss fällt auf 5 kW", "Mindestladung nur für priorisierte Fahrzeuge, übrige pausieren", "keine Lastspitze aus dem Netz"],
          ],
          minBreite: 640,
          fussnote: "Illustratives Beispiel. Bei vielen einphasig ladenden Fahrzeugen müssen die Phasen je Ladepunkt zyklisch getauscht werden, damit die Unsymmetrie laut TOR 16 A je Leiter nicht überschreitet.",
        },
        {
          typ: "p",
          text: "Ein solcher Ladepark braucht ein lokales Lastmanagement mit Messung am Netzanschlusspunkt und ein OCPP-Backend für Zugang, Abrechnung und Auswertung. Ab einer Summenleistung von 10 kVA prüft der Netzbetreiber den Anschluss genauer – ein Lastmanagement, das die vereinbarte Leistung einhält, ist hier das stärkste Argument. Welche Leistung in welchen Fällen sinnvoll ist, zeigt der Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler beim Überschussladen",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "liste",
          punkte: [
            "**Regelung auf PV-Erzeugung statt auf Netzsaldo:** Die Wallbox lädt dann mit Strom, den das Gebäude selbst braucht – und zieht Netzstrom nach.",
            "**Keine Phasenumschaltung:** Dreiphasiges Laden startet erst ab rund 4,1 kW Überschuss; an wechselhaften Tagen bleibt viel ungenutzt.",
            "**Zu träge oder zu hektische Regelung:** Ständiges Ein- und Ausschalten belastet Fahrzeug und Wallbox; gute Systeme glätten kurzfristige Schwankungen.",
            "**Keine Prioritäten:** Speicher, Wärmepumpe und Wallbox kämpfen um denselben Überschuss – die Reihenfolge muss festgelegt sein.",
            "**Fahrzeugseitige Grenzen ignoriert:** Manche Fahrzeuge laden nur ein- oder zweiphasig oder brechen bei häufigen Stromänderungen ab – vorab testen.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Premium-Privat und Chalets",
          text: "Bei alpinen Chalets und Zweitwohnsitzen steht das Fahrzeug oft tagelang – ideal für Überschussladen, wenn Gäste- und Eigentümerfahrzeuge über eine Wallbox mit Zugangskontrolle laden. In Kombination mit Speicher und Wärmepumpe lohnt ein gemeinsames Energiemanagement. Mehr unter [Chalets](/chalets).",
        },
      ],
    },
    {
      id: "winter",
      titel: "Überschussladen im Winter und bei Schlechtwetter",
      tocLabel: "Winter",
      bloecke: [
        {
          typ: "p",
          text: "**Im Winter reicht der Überschuss selten für nennenswerte Ladungen – dann übernimmt der Netzbezug, idealerweise in günstigen Stunden.** Ein Mindestladestrom oder eine Zielladung stellt sicher, dass das Fahrzeug trotzdem einsatzbereit ist. Mit einem dynamischen Tarif lassen sich Ladevorgänge zusätzlich in günstige Nachtstunden legen – mehr im Ratgeber [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Speicher nicht ins Auto entladen",
          text: "Ein Hausspeicher, der abends das Auto lädt, verschiebt nur Energie von einer Batterie in die andere – mit Verlusten. Sinnvoller ist meist, das Auto direkt mit Überschuss zu laden und den Speicher für Abend- und Nachtlasten im Gebäude zu reservieren.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist PV-Überschussladen?",
      a: "Die Wallbox lädt das E-Auto nur mit dem Solarstrom, der gerade nicht im Gebäude verbraucht wird und sonst ins Netz fließen würde. Ein Energiemanagement misst dazu am Netzanschlusspunkt und regelt den Ladestrom laufend nach.",
    },
    {
      q: "Ab wie viel Überschuss lädt das Auto?",
      a: "Ab 6 A Ladestrom: einphasig rund 1,4 kW, dreiphasig rund 4,1 kW. Wallboxen mit automatischer Phasenumschaltung nutzen auch kleine Überschüsse, indem sie bei wenig Sonne einphasig laden.",
    },
    {
      q: "Darf ich in Österreich einphasig laden?",
      a: "Ladeeinrichtungen über 3,68 kVA sind laut TOR grundsätzlich dreiphasig anzuschließen, die Unsymmetrie ist auf 16 A je Leiter begrenzt. Einphasiges Laden bis 16 A ist damit möglich; bei mehreren Ladepunkten sind die Phasen zyklisch zu tauschen.",
    },
    {
      q: "Wie viel spart Überschussladen?",
      a: `Im Beispiel mit ${KM.toLocaleString("de-DE")} km und dem BMF-Referenzstrompreis 2026 sinken die jährlichen Ladekosten von rund ${eur(BEDARF * HH)} bei reinem Netzstrom auf rund ${kosten(0.6, HH)} bei 60 % Solaranteil. Im Betrieb mit niedrigeren Nettopreisen ist die Ersparnis kleiner, aber bei vielen Fahrzeugen erheblich.`,
    },
    {
      q: "Brauche ich für Überschussladen einen Speicher?",
      a: "Nein. Überschussladen funktioniert ohne Speicher, wenn das Fahrzeug tagsüber steht. Ein Speicher ist sinnvoll für Abendlasten im Gebäude – das Auto direkt mit Überschuss zu laden ist effizienter als über den Speicher.",
    },
    {
      q: "Muss ich die Wallbox beim Netzbetreiber melden?",
      a: "Ja, Ladeeinrichtungen über 3,68 kVA sind meldepflichtig. Die Meldung übernimmt der Elektrotechniker über Datenblatt oder Online-Portal des Netzbetreibers. Details im Ratgeber [Wallbox Installation](/ratgeber/wallbox-installation).",
    },
    {
      q: "Funktioniert Überschussladen mit jedem E-Auto?",
      a: "Grundsätzlich ja, weil die Wallbox den Ladestrom über das Ladesignal vorgibt. Einschränkungen gibt es bei Fahrzeugen, die nur ein- oder zweiphasig laden oder auf häufige Stromänderungen empfindlich reagieren. Ein Test mit dem eigenen Fahrzeug klärt das rasch.",
    },
    {
      q: "Wie viele Ladepunkte kann ich mit Überschuss betreiben?",
      a: "So viele, wie Anschluss und Lastmanagement erlauben. Entscheidend ist, dass das Lastmanagement die verfügbare Leistung dynamisch verteilt und die vereinbarte Anschlussleistung einhält. Bei vielen Ladepunkten plant man ein OCPP-Backend mit lokalem Lastmanagement.",
    },
  ],

  passend: [
    { href: "/produkte/wallbox", titel: "Wallbox", text: "Steuerbare Wallboxen für Überschussladen." },
    { href: "/ratgeber/e-flotte-laden-photovoltaik", titel: "E-Flotte laden", text: "Flotte, Sachbezug und Lastmanagement." },
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox Installation", text: "Kosten, Meldung und TOR." },
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur", text: "Ladeparks für Betriebe." },
  ],

  quellen: [
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1 (Kap. 4.2.1 und 5.9)", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "OeMAG – Marktpreise 2026", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "EY Österreich – BMF: Strompreis 2026 (32,806 ct/kWh)", url: "https://www.ey.com/de_at/technical/steuernachrichten/bmf-strompreis-2026-laden", stand: "10/2025" },
    { titel: "Netz Niederösterreich – Meldepflichtige Geräte (Ladeeinrichtungen)", url: "https://netz-noe.at/strom/meldepflichtige-geraete", stand: "09/2026" },
    { titel: "OVE – Elektromobilität: aktualisierte und neue OVE-Richtlinien (R 30, R 37)", url: "https://www.ove.at/ove-news/details/elektromobilitaet-aktualisierte-und-neue-ove-richtlinien/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Mit Sonne laden?", text: "Wallbox mit Überschussregelung planen.", href: "/produkte/wallbox", label: "Wallbox ansehen" },
  cta: {
    title: "Tanken Sie Sonne – mit Überschussladen vom eigenen Dach.",
    text: "Ökovolt plant Wallboxen und Ladeparks mit PV-Überschussregelung und Lastmanagement für Betriebe, Hotels, Gemeinden und Premium-Privatobjekte in ganz Österreich.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Ladeinfrastruktur", href: "/ladeinfrastruktur" },
  },
};

export default artikel;
