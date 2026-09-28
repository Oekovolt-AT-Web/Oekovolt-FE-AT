// Ratgeber: Bidirektionales Laden (V2H, V2B, V2G) – Stand September 2026, Österreich
// Quellen: TOR Verteilernetzanschluss NS V1.3.1 (Einspeisemodus von Ladeeinrichtungen unterliegt den TOR
// Stromerzeugungsanlagen; Typeneinteilung nach vereinbarter Einspeisekapazität; Entkupplungsschutz bei V2G),
// TOR Stromerzeugungsanlagen Typ A V1.4 (Konformität, ersatzstromfähige Umrichter), OVE R 37 (Prüfanforderungen
// Ladestationen), OeMAG-FAQ (Rückeinspeisung von Speichern derzeit nicht vorgesehen), OeMAG-Marktpreise 2026,
// BMF-Strompreis 2026, ISO 15118-20. Rechenbeispiel mit offengelegten Annahmen.

const HH = 0.32806; // €/kWh brutto, BMF-Referenz Haushalt 2026
const MARKT = 0.068; // €/kWh, gerundeter OeMAG-Sommermarktpreis PV 2026
const TAGE = 200;
const KWH_TAG = 10;
const WIRKUNGSGRAD = 0.85; // Annahme Lade-/Entladeverluste gesamt
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const v2hWert = TAGE * KWH_TAG * (HH * WIRKUNGSGRAD - MARKT);

const artikel = {
  slug: "bidirektionales-laden",
  title: "Bidirektionales Laden: V2H, V2B und V2G in Österreich 2026",
  seoTitle: "Bidirektionales Laden 2026: V2H, V2B, V2G | Ökovolt",
  kurzTitel: "Bidirektionales Laden",
  description:
    "Bidirektionales Laden 2026: Stand von V2H, V2B und V2G in Österreich, TOR-Regeln für Rückspeisung, Normen, Fahrzeuge, Garantie und Nutzen für Betriebe.",
  excerpt:
    "Das E-Auto als Speicher für Haus, Betrieb und Netz: Was bidirektionales Laden 2026 in Österreich technisch und rechtlich kann, welche Regeln der Netzbetreiber setzt und wann es sich für Flotten lohnen wird.",
  hauptKeyword: "bidirektionales laden",
  keywords: [
    "bidirektionales Laden",
    "Vehicle to Home Österreich",
    "Vehicle to Grid",
    "V2B Flotte",
    "bidirektionale Wallbox",
    "ISO 15118-20",
    "E-Auto als Stromspeicher",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "E-Mobilität & Sektorkopplung",
  bild: "/Images/Ratgeber/bidirektionales-laden.jpg",
  bildAlt: "Heimspeichersystem mit DC-Lademodul für ein Elektroauto",
  badge: { wert: "TOR", text: "Im Einspeisemodus gilt die Ladeeinrichtung als Stromerzeugungsanlage" },

  kurzFazit: [
    "**Bidirektionales Laden macht die Fahrzeugbatterie zum Speicher: fürs Haus (V2H), für den Betrieb (V2B) oder fürs Netz (V2G).** 2026 ist V2H mit ausgewählten Fahrzeugen und DC-Wallboxen verfügbar, V2B im Pilotstadium, V2G am Strommarkt noch die Ausnahme.",
    "**In Österreich gilt eine rückspeisefähige Ladeeinrichtung im Einspeisemodus als Stromerzeugungsanlage:** Die TOR Verteilernetzanschluss verweisen auf die TOR Stromerzeugungsanlagen; bei V2G ist ein Entkupplungsschutz vorzusehen. Die Anmeldung erfolgt wie bei einem Speicher.",
    `**Der Nutzen ist real, aber begrenzt:** Verschiebt ein Haushalt an ${TAGE} Tagen je ${KWH_TAG} kWh Solarstrom über das Auto in den Abend, bringt das in unserem Beispiel rund ${eur(v2hWert)} im Jahr – vor Kosten der teureren Wallbox.`,
    "**Für Betriebe liegt das Potenzial bei Flotten, die planbar stehen:** Fahrzeugbatterien könnten Lastspitzen kappen und Solarstrom verschieben. Voraussetzung sind kompatible Fahrzeuge, Herstellerfreigaben für die Garantie und ein Energiemanagement.",
  ],

  abschnitte: [
    {
      id: "begriffe",
      titel: "Was ist bidirektionales Laden?",
      tocLabel: "Begriffe",
      bloecke: [
        {
          typ: "p",
          text: "**Bidirektional heißt: Strom fließt nicht nur ins Auto, sondern auch wieder heraus – ins Gebäude, in den Betrieb oder ins öffentliche Netz.** Die Fahrzeugbatterie ist mit oft 50 bis 100 kWh um ein Vielfaches größer als ein typischer Hausspeicher und steht bei vielen Fahrzeugen den Großteil des Tages ungenutzt. Die Begriffe [bidirektionales Laden](/wissen/lexikon#bidirektionales-laden) und [V2G](/wissen/lexikon#v2g) sind im Lexikon erklärt.",
        },
        {
          typ: "tabelle",
          caption: "Formen des bidirektionalen Ladens",
          kopf: ["Begriff", "Wohin fließt der Strom?", "Nutzen", "Stand 2026"],
          zeilen: [
            ["V2L (Vehicle to Load)", "direkt an Geräte über Steckdose am Auto", "Werkzeug, Camping, Notstrom für Einzelgeräte", "bei vielen Modellen serienmäßig"],
            ["V2H (Vehicle to Home)", "ins Hausnetz hinter dem Zähler", "Eigenverbrauch erhöhen, Notstrom", "mit ausgewählten Fahrzeugen und DC-Wallboxen verfügbar"],
            ["V2B (Vehicle to Building)", "ins Betriebsnetz", "Peak Shaving, Eigenverbrauch, Ersatzstrom", "Pilotprojekte, erste Produkte"],
            ["V2G (Vehicle to Grid)", "ins öffentliche Netz / an den Strommarkt", "Flexibilität, Regelenergie, Handel", "Einzelfälle, regulatorisch und technisch anspruchsvoll"],
          ],
          minBreite: 680,
        },
      ],
    },
    {
      id: "technik",
      titel: "Wie funktioniert bidirektionales Laden technisch?",
      tocLabel: "Technik & Normen",
      bloecke: [
        {
          typ: "p",
          text: "**Für bidirektionales Laden müssen Fahrzeug, Ladeeinrichtung und Kommunikation zusammenpassen – und der Wechselrichter, der Gleich- in Wechselstrom umwandelt, muss die Netzanschlussregeln erfüllen.** Bei DC-bidirektionalen Wallboxen sitzt dieser Wechselrichter in der Wallbox, bei AC-bidirektionalen Lösungen im Fahrzeug.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "DC-bidirektional", text: "Die Wallbox wandelt Strom in beide Richtungen und ist als Erzeugungsanlage zertifizierbar. Heute der übliche Weg für V2H und V2B – teurer als AC-Wallboxen." },
            { titel: "AC-bidirektional", text: "Der Onboard-Lader des Fahrzeugs speist zurück. Günstigere Wallbox, aber das Fahrzeug selbst muss die Netzanforderungen erfüllen – das ist regulatorisch noch nicht breit gelöst." },
            { titel: "Kommunikation", text: "ISO 15118-20 regelt die bidirektionale Kommunikation für CCS-Fahrzeuge; CHAdeMO unterstützt V2H seit Längerem. Die Ladeeinrichtung braucht zudem eine offene Schnittstelle zum Energiemanagement." },
            { titel: "Energiemanagement", text: "Entscheidet, wann geladen und entladen wird – unter Beachtung von Mindestladestand, Abfahrtszeit und Leistungsgrenzen." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Fahrzeug- und Garantiefreigabe prüfen",
          text: "Nicht jedes Fahrzeug erlaubt das Entladen über den Ladeanschluss, und manche Hersteller begrenzen die zulässige Energiemenge für bidirektionale Nutzung in den Garantiebedingungen. Klären Sie vor dem Kauf, ob Fahrzeug, Wallbox und Nutzung vom Fahrzeughersteller freigegeben sind.",
        },
      ],
    },
    {
      id: "recht",
      titel: "Was gilt in Österreich rechtlich und beim Netzbetreiber?",
      tocLabel: "TOR & Netzbetreiber",
      bloecke: [
        {
          typ: "p",
          text: "**Laut TOR Verteilernetzanschluss (Niederspannung, Version 1.3.1) gelten für einspeisefähige Ladeeinrichtungen im Einspeisemodus – also „vehicle to grid“ bzw. „vehicle to home“ – die Anforderungen der TOR Stromerzeugungsanlagen.** Für die Typeneinteilung zählt die vereinbarte maximale Einspeisekapazität am Netzanschlusspunkt. Im Lademodus gelten weiter die Regeln für Ladeeinrichtungen.",
        },
        {
          typ: "tabelle",
          caption: "Regeln für bidirektionale Ladeeinrichtungen in Österreich, Stand September 2026",
          kopf: ["Thema", "Regel", "Praxis"],
          zeilen: [
            ["Einstufung", "Einspeisemodus nach TOR Stromerzeugungsanlagen (bei < 250 kW Typ A)", "Anmeldung wie Erzeugungsanlage/Speicher über den Elektrotechniker"],
            ["Netzschutz", "Entkupplungsschutz ist vorzusehen, wenn über die Ladeeinrichtung Energie ins Netz eingespeist wird", "zertifizierte Geräte mit Ländereinstellung Österreich"],
            ["Blindleistung & Netzstützung", "im Entlademodus nach TOR Stromerzeugungsanlagen", "Parametrierung laut Netzbetreiber"],
            ["Konformität", "Prüfberichte akkreditierter Prüfstellen; für Ladestationen OVE-Richtlinie R 37", "Nachweise bei der Meldung vorlegen"],
            ["Einspeisevergütung", "OeMAG: Rückeinspeisung aus Energiespeichern derzeit nicht vorgesehen", "V2H hinter dem Zähler statt Einspeisung ins Netz"],
          ],
          minBreite: 680,
          fussnote: "Quellen: E-Control (TOR), OVE, OeMAG. Wie Netzentgelte und Abgaben bei der Rückspeisung aus Fahrzeugbatterien künftig behandelt werden, hängt vom neuen Elektrizitätsrecht ab – aktuellen Stand prüfen.",
        },
        {
          typ: "p",
          text: "Die Grundlagen der Netzanschlussregeln beschreibt der Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss); was das neue Elektrizitätswirtschaftsgesetz für Speicher und Prosumer ändert, erklärt [ElWG – das neue Elektrizitätswirtschaftsgesetz](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
        },
      ],
    },
    {
      id: "nutzen",
      titel: "Was bringt bidirektionales Laden wirtschaftlich?",
      tocLabel: "Wirtschaftlichkeit",
      bloecke: [
        {
          typ: "p",
          text: "**Der wirtschaftliche Nutzen entsteht dadurch, dass günstiger Solarstrom vom Tag in den teuren Abend verschoben wird – ähnlich wie bei einem stationären Speicher, aber ohne dessen Anschaffungskosten.** Dem stehen die Mehrkosten einer bidirektionalen Wallbox, Umwandlungsverluste und mögliche Garantiebeschränkungen gegenüber.",
        },
        {
          typ: "tabelle",
          caption: "Beispielrechnung V2H: Solarstrom über das Auto in den Abend verschieben",
          kopf: ["Größe", "Annahme", "Ergebnis"],
          zeilen: [
            ["verschobene Energie", `${KWH_TAG} kWh an ${TAGE} Tagen`, `${(TAGE * KWH_TAG).toLocaleString("de-DE")} kWh pro Jahr`],
            ["Wert je kWh im Haus", "32,806 ct/kWh (BMF-Referenz 2026) × 85 % Wirkungsgrad", `${(HH * WIRKUNGSGRAD * 100).toFixed(1).replace(".", ",")} ct/kWh`],
            ["entgangene Einspeisung", "6,8 ct/kWh (OeMAG-Sommermarktpreis 2026, gerundet)", "6,8 ct/kWh"],
            ["Vorteil pro Jahr", "vor Mehrkosten der Wallbox", eur(v2hWert)],
          ],
          hervorheben: 2,
          minBreite: 600,
          fussnote: "Annahmen: Privathaushalt mit PV-Überschuss, Auto abends zu Hause, 85 % Gesamtwirkungsgrad für Laden und Entladen. Ohne Batterieverschleiß und Wallbox-Mehrkosten.",
        },
        {
          typ: "p",
          text: "Für Betriebe kann der Nutzen größer sein, wenn Fahrzeugbatterien Lastspitzen senken: Wer den Leistungspreis zahlt, spart mit jedem Kilowatt weniger Spitze. Das setzt aber voraus, dass die Fahrzeuge zu den Spitzenzeiten angesteckt sind und genügend Ladung übrig haben. Für viele Betriebe ist deshalb heute ein stationärer [Gewerbespeicher](/gewerbespeicher) die verlässlichere Lösung – die Flotte kann ihn künftig ergänzen. Mehr im Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
        },
      ],
    },
    {
      id: "flotte",
      titel: "V2B: Die Firmenflotte als Speicher",
      tocLabel: "V2B im Betrieb",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Flotte mit planbaren Standzeiten ist ein großer, verteilter Speicher: Zehn Fahrzeuge mit je 20 kWh freigegebener Reserve entsprechen 200 kWh Speicherkapazität.** Die Herausforderung liegt in der Organisation: Jedes Fahrzeug muss zur Abfahrt ausreichend geladen sein, und die Entladung darf die Batteriegarantie nicht gefährden.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Fahrprofile auswerten: Welche Fahrzeuge stehen wann zuverlässig am Betrieb?",
            "Mindestladestand und Abfahrtszeiten je Fahrzeug festlegen.",
            "Fahrzeug- und Garantiefreigaben für bidirektionale Nutzung prüfen.",
            "DC-bidirektionale Ladepunkte mit TOR-konformer Zertifizierung wählen.",
            "Energiemanagement mit Prioritäten für Ladung, Entladung, Peak Shaving und PV-Überschuss einplanen.",
            "Anmeldung beim Netzbetreiber als Erzeugungsanlage bzw. Speicher.",
            "Mit einem stationären Speicher vergleichen: Was ist verlässlicher, was günstiger?",
          ],
        },
        {
          typ: "p",
          text: "Wie eine Flotte heute mit Solarstrom geladen und steuerlich richtig behandelt wird, beschreibt der Ratgeber [E-Flotte laden mit Photovoltaik](/ratgeber/e-flotte-laden-photovoltaik). Die Einbindung in Ladeparks übernimmt Ökovolt über den Bereich [Ladeinfrastruktur](/ladeinfrastruktur).",
        },
      ],
    },
    {
      id: "notstrom",
      titel: "Notstrom aus dem E-Auto",
      tocLabel: "Notstrom",
      bloecke: [
        {
          typ: "p",
          text: "**Mit V2H und einer Netztrennung kann das E-Auto bei Stromausfall das Haus oder einzelne Stromkreise versorgen – eine volle Batterie reicht für einen sparsamen Haushalt mehrere Tage.** Dafür muss die Anlage wie jede Ersatzstromversorgung automatisch und allpolig vom Netz trennen und darf nach Netzwiederkehr nicht asynchron zuschalten. Wie das normgerecht umgesetzt wird, erklärt der Ratgeber [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "V2L als einfache Lösung",
          text: "Viele E-Autos bieten eine Steckdose (V2L), an die sich einzelne Geräte anschließen lassen – etwa Kühlschrank, Router oder Werkzeug. Das ersetzt keine Ersatzstromanlage, hilft aber bei kurzen Ausfällen. Ins Hausnetz einspeisen darf man darüber nicht.",
        },
      ],
    },
    {
      id: "vergleich",
      titel: "Fahrzeugbatterie oder stationärer Speicher?",
      tocLabel: "Auto vs. Speicher",
      bloecke: [
        {
          typ: "p",
          text: "**Ein stationärer Speicher ist immer da, wenn er gebraucht wird – die Fahrzeugbatterie nur, wenn das Auto angesteckt ist und genug Ladung übrig hat.** Dafür ist die Fahrzeugbatterie ohnehin bezahlt und deutlich größer. Welche Lösung besser passt, hängt vom Nutzungsprofil ab.",
        },
        {
          typ: "tabelle",
          caption: "Fahrzeugbatterie (V2H/V2B) und stationärer Speicher im Vergleich",
          kopf: ["Kriterium", "Fahrzeugbatterie (bidirektional)", "Stationärer Speicher"],
          zeilen: [
            ["Verfügbarkeit", "nur bei angestecktem Fahrzeug", "ständig"],
            ["Kapazität", "groß (oft 50–100 kWh), davon nur ein Teil freigegeben", "nach Bedarf dimensioniert"],
            ["Zusatzkosten", "bidirektionale Wallbox, kompatibles Fahrzeug", "Speicher und Wechselrichter"],
            ["Garantie", "Fahrzeughersteller-Bedingungen beachten", "Speicherhersteller-Garantie"],
            ["Peak Shaving im Betrieb", "nur bei planbaren Standzeiten verlässlich", "verlässlich planbar"],
            ["Notstrom", "möglich, wenn Auto zu Hause", "möglich, jederzeit"],
            ["Regelwerk", "Einspeisemodus nach TOR Stromerzeugungsanlagen", "Speicher nach TOR Stromerzeugungsanlagen"],
          ],
          minBreite: 640,
        },
        {
          typ: "p",
          text: "In der Praxis ergänzen sich beide: Ein kleiner stationärer Speicher deckt die Grundlast am Abend und die Morgenspitze, das Auto übernimmt an Tagen, an denen es zu Hause oder am Betrieb steht, zusätzliche Mengen. Kosten und Dimensionierung stationärer Speicher behandeln die Ratgeber [Stromspeicher: Kosten](/ratgeber/stromspeicher-kosten) und [Gewerbespeicher: Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "zielgruppen",
      titel: "Für wen lohnt sich bidirektionales Laden zuerst?",
      tocLabel: "Zielgruppen",
      bloecke: [
        {
          typ: "p",
          text: "**Am ehesten lohnt sich bidirektionales Laden dort, wo Fahrzeuge verlässlich zu bekannten Zeiten stehen und teurer Abend- oder Spitzenstrom ersetzt werden kann.** Vier Konstellationen stechen heraus:",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Premium-Privat & Chalets", text: "Große PV-Anlage, Fahrzeug oft zu Hause, Wunsch nach Notstrom – V2H ist hier schon heute umsetzbar. Mehr unter [Chalets](/chalets)." },
            { titel: "Kleine Betriebe mit Poolfahrzeugen", text: "Fahrzeuge stehen nachmittags und abends am Betrieb und können Abendlasten übernehmen." },
            { titel: "Gemeinden", text: "Gemeindefahrzeuge und Carsharing an Gemeindegebäuden – Kombination mit Energiegemeinschaft und Blackout-Vorsorge denkbar." },
            { titel: "Hotels & Tourismus", text: "Shuttle- und Servicefahrzeuge mit planbaren Einsatzzeiten als Ergänzung zum stationären Speicher." },
          ],
        },
      ],
    },
    {
      id: "vorbereiten",
      titel: "Heute schon vorbereiten: Ladeinfrastruktur für morgen",
      tocLabel: "Vorbereiten",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Anschlussleistung und Leerrohre planen", "Leitungsquerschnitte und Leerrohre so dimensionieren, dass DC-bidirektionale Ladepunkte nachrüstbar sind."],
            ["Offene Schnittstellen wählen", "Ladepunkte und Energiemanagement mit OCPP bzw. EEBUS, idealerweise mit Unterstützung für ISO 15118."],
            ["Netzanschlusspunkt vorbereiten", "Messkonzept und Platz für Netz- und Anlagenschutz vorsehen, falls später eingespeist werden soll."],
            ["Fahrzeugbeschaffung abstimmen", "Bei neuen Fahrzeugen auf bidirektionale Fähigkeit und Herstellerfreigabe achten."],
          ],
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Ausblick: Wann wird bidirektionales Laden Standard?",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Bidirektionales Laden wird in den nächsten Jahren schrittweise alltagstauglich – getrieben von Fahrzeugen mit ISO-15118-20-Unterstützung, günstigeren Wallboxen und neuen Regeln für Speicher und Flexibilität im Elektrizitätsrecht.** Für Investitionen heute gilt: Ladeinfrastruktur mit Leerrohren, ausreichender Anschlussleistung und offenen Schnittstellen planen, damit bidirektionale Ladepunkte später ohne großen Umbau nachgerüstet werden können.",
        },
        {
          typ: "liste",
          punkte: [
            "**Kurzfristig:** V2H mit ausgewählten Fahrzeugen, Notstrom, Eigenverbrauch – für Premium-Privat und kleine Betriebe.",
            "**Mittelfristig:** V2B für Flotten mit Peak Shaving, sobald mehr Fahrzeuge und Garantiefreigaben verfügbar sind.",
            "**Langfristig:** V2G mit Vermarktung von Flexibilität und Regelenergie – mehr dazu im Ratgeber [Regelenergie und Flexibilität](/ratgeber/regelenergie-flexibilitaet).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Welche E-Autos können bidirektional laden?",
      a: "2026 eine wachsende Zahl von Modellen, teils nur über CHAdeMO oder mit bestimmten DC-Wallboxen und oft mit Einschränkungen in den Garantiebedingungen. Prüfen Sie vor dem Kauf die Freigabe des Fahrzeugherstellers für V2H oder V2B.",
    },
    {
      q: "Darf ich in Österreich mit dem E-Auto ins Netz einspeisen?",
      a: "Nur mit einer Ladeeinrichtung, die als Stromerzeugungsanlage die TOR erfüllt, und nach Anmeldung beim Netzbetreiber. Laut TOR Verteilernetzanschluss gelten im Einspeisemodus die TOR Stromerzeugungsanlagen, bei V2G ist ein Entkupplungsschutz vorzusehen.",
    },
    {
      q: "Bekomme ich für Strom aus dem Auto eine Einspeisevergütung?",
      a: "Die OeMAG sieht eine Rückeinspeisung aus Energiespeichern derzeit nicht vor. Wirtschaftlich sinnvoll ist heute vor allem V2H: den Strom im eigenen Gebäude verbrauchen statt einspeisen.",
    },
    {
      q: "Schadet bidirektionales Laden der Autobatterie?",
      a: "Jeder zusätzliche Zyklus trägt zur Alterung bei, moderne Batterien sind aber auf viele Zyklen ausgelegt. Relevanter sind die Garantiebedingungen: Manche Hersteller begrenzen die für bidirektionale Nutzung zulässige Energiemenge.",
    },
    {
      q: "Kann das E-Auto bei Stromausfall mein Haus versorgen?",
      a: "Ja, mit V2H-fähigem Fahrzeug, bidirektionaler Wallbox und einer normgerechten Netztrennung. Eine volle Batterie reicht für einen sparsamen Haushalt mehrere Tage. Ohne Netztrennung ist das unzulässig und gefährlich.",
    },
    {
      q: "Lohnt sich V2B für meine Firmenflotte schon?",
      a: "Für viele Betriebe ist es 2026 noch ein Pilotthema. Wer heute Ladeinfrastruktur plant, sollte sie für bidirektionale Ladepunkte vorbereiten. Für verlässliches Peak Shaving ist ein stationärer Speicher derzeit meist die bessere Wahl.",
    },
    {
      q: "Was kostet eine bidirektionale Wallbox?",
      a: "DC-bidirektionale Wallboxen sind deutlich teurer als gewöhnliche AC-Wallboxen, weil sie einen eigenen Wechselrichter enthalten. Die Preise sinken, variieren aber stark nach Leistung und Hersteller – holen Sie Angebote inklusive Installation, Netz- und Anlagenschutz und Anmeldung ein.",
    },
    {
      q: "Brauche ich für V2H einen eigenen Zähler?",
      a: "Nicht zwingend, aber die Anlage muss beim Netzbetreiber gemeldet und das Messkonzept abgestimmt sein. Wird nur hinter dem Zähler im eigenen Gebäude verbraucht, genügt meist der bestehende Zweirichtungszähler; für eine spätere Vermarktung von Flexibilität können zusätzliche Messungen nötig werden.",
    },
  ],

  passend: [
    { href: "/ratgeber/e-flotte-laden-photovoltaik", titel: "E-Flotte laden", text: "Flotte, Sachbezug und Lastmanagement." },
    { href: "/ratgeber/notstrom-photovoltaik", titel: "Notstrom mit PV", text: "Ersatzstrom und Inselbetrieb." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Die stationäre Alternative für Peak Shaving." },
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur", text: "Zukunftssichere Ladeparks." },
  ],

  quellen: [
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1 (Ladeeinrichtungen, Einspeisemodus)", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.4", url: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+%287%29.pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", stand: "06/2026" },
    { titel: "OVE – Elektromobilität: aktualisierte und neue OVE-Richtlinien (R 37)", url: "https://www.ove.at/ove-news/details/elektromobilitaet-aktualisierte-und-neue-ove-richtlinien/", stand: "09/2026" },
    { titel: "OeMAG – FAQ (Einspeisung mit Energiespeicher)", url: "https://www.oem-ag.at/service/faqs", stand: "09/2026" },
    { titel: "OeMAG – Marktpreise 2026", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "EY Österreich – BMF: Strompreis 2026 (32,806 ct/kWh)", url: "https://www.ey.com/de_at/technical/steuernachrichten/bmf-strompreis-2026-laden", stand: "10/2025" },
  ],

  seitenCta: { titel: "Ladeinfrastruktur zukunftssicher?", text: "Vorbereitet für bidirektionale Ladepunkte.", href: "/ladeinfrastruktur", label: "Ladeinfrastruktur planen" },
  cta: {
    title: "Heute laden, morgen speichern – Ladeinfrastruktur mit Weitblick.",
    text: "Ökovolt plant PV, Speicher und Ladepunkte mit offenen Schnittstellen, damit bidirektionales Laden später ohne Umbau möglich ist – in ganz Österreich.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Wallbox", href: "/produkte/wallbox" },
  },
};

export default artikel;
