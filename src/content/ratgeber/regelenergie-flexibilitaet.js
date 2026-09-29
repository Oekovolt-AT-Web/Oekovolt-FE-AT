// Ratgeber: Regelreserve der APG und Flexibilitätsvermarktung für Unternehmen – Zukunftsthema
// Quellen: APG Marktinformationen Regelreserve (FCR/aFRR/mFRR), Modalitäten für
// Regelreserveanbieter V1.4; ElWG BGBl. I Nr. 91/2025; SNE-V 2018 idF BGBl. II Nr. 305/2025
// (regelbare Bezugsleistung NE 3/4); SNE-G-V-Entwurf der E-Control (2026).
// Bewusst keine Regelreserve-Preise: Werte schwanken stark, Abruf über APG-Transparenzdaten.

const FCR_MW = 75; // ± MW, Bedarf 2026
const AFRR_MW = 225; // ± MW seit 13.08.2024
const MFRR_POS = 255; // MW positiv ab 01.05.2026
const MFRR_NEG = 195; // MW negativ

const PRODUKTE = [
  ["FCR – Primärregelung", "30 Sekunden", `±${FCR_MW} MW (2026)`, "D-1, sechs 4-h-Produkte, Einheitspreis", "±1 MW", "nur Leistungspreis"],
  ["aFRR – Sekundärregelung", "5 Minuten, automatisch", `±${AFRR_MW} MW`, "D-1 (bis 9 Uhr), sechs 4-h-Blöcke, Gebotspreis", "1 MW", "Leistungspreis + Arbeitspreis je 15 min"],
  ["mFRR – Tertiärregelung", "bis 12,5 Minuten, abgerufen", `+${MFRR_POS} / −${MFRR_NEG} MW (ab 1.5.2026)`, "D-1 (bis 10 Uhr), sechs 4-h-Blöcke, Gebotspreis", "1 MW", "Leistungspreis + Arbeitspreis je 15 min"],
];

// Beispiel Kühlhaus im Pool – rein technisches Potenzial, keine Erlösangabe
const KUEHL = { leistungKw: 400, flexAnteil: 0.5, maxDauerMin: 60 };
const flexKw = KUEHL.leistungKw * KUEHL.flexAnteil;

// Beispiel flexible Entnahme ab 2027 (SNE-G-V-Entwurf, Erläuterungen): 25 % LP für flexiblen Anteil
const LP_NE6_SBG = 66.6; // €/kW und Jahr, NE 6 Netzbereich Salzburg 2026 (SNE-V 2018 idF BGBl. II Nr. 305/2025)
const FLEX_KW = 150;
const ABSCHLAG_BEISPIEL = 0.75; // Beispielwert aus den Erläuterungen (nur 25 % LP) – Tarifwerte 2027 noch offen

const de = (n, st = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: st, maximumFractionDigits: st });
const eur = (n) => de(Math.round(n)) + " €";

const artikel = {
  slug: "regelenergie-flexibilitaet",
  title: "Regelenergie und Flexibilität: So verdienen Betriebe am Netz mit",
  seoTitle: "Regelenergie & Flexibilität Österreich | Ökovolt",
  kurzTitel: "Regelenergie & Flexibilität",
  description:
    "Regelenergie in Österreich: FCR, aFRR und mFRR der APG, Präqualifikation, Pooling und neue Flexibilitätsmodelle im ElWG – was Speicher und Betriebe beitragen.",
  excerpt:
    "Wie die APG die Netzfrequenz stabil hält, welche Anlagen Regelreserve liefern können und welche neuen Wege das ElWG für flexible Betriebe öffnet – sachlich und ohne Renditeversprechen.",
  hauptKeyword: "regelenergie österreich",
  keywords: [
    "Regelenergie Österreich",
    "Regelreserve APG",
    "aFRR mFRR FCR",
    "Flexibilitätsvermarktung",
    "Batteriespeicher Regelenergie",
    "Präqualifikation APG",
    "flexible Netznutzung ElWG",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/hochspannungsleitung-weitendorf.jpg",
  bildAlt: "Hochspannungsleitungen über einem abgeernteten Feld bei Weitendorf in der Steiermark",
  badge: { wert: "50 Hz", text: "Sollfrequenz, die die APG mit Regelreserve hält" },

  kurzFazit: [
    "**Regelenergie ist Leistung, die der Übertragungsnetzbetreiber APG kurzfristig abruft, um Erzeugung und Verbrauch im Gleichgewicht und die Netzfrequenz bei 50 Hertz zu halten.**",
    `Die APG beschafft drei Produkte: FCR (±${FCR_MW} MW 2026), aFRR (±${AFRR_MW} MW) und mFRR (+${MFRR_POS}/−${MFRR_NEG} MW ab Mai 2026). Das Mindestgebot liegt jeweils bei 1 MW.`,
    "Unternehmen können über einen Aggregator teilnehmen: Batteriespeicher, Kühlhäuser, Elektrokessel oder Pumpen werden gebündelt, präqualifiziert und gemeinsam vermarktet.",
    "Der österreichische Regelreservemarkt ist klein; mit jedem großen Speicher steigt der Wettbewerb. Erlöse schwanken stark und lassen sich nicht seriös für Jahre vorhersagen.",
    "Neu ab 2027: Das ElWG und die Netzentgeltreform belohnen netzdienliche Flexibilität direkt – etwa mit reduziertem Leistungspreis für flexibel vereinbarte Bezugsleistung.",
  ],

  abschnitte: [
    {
      id: "grundlagen",
      titel: "Was ist Regelenergie?",
      tocLabel: "Grundlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Regelenergie – in Österreich meist Regelreserve genannt – gleicht kurzfristige Abweichungen zwischen Stromerzeugung und -verbrauch aus, damit die Netzfrequenz stabil bei 50 Hertz bleibt.** Weicht die Frequenz ab, weil etwa ein Kraftwerk ausfällt oder die PV-Erzeugung anders kommt als prognostiziert, aktiviert der Regelzonenführer zusätzliche Leistung oder reduziert sie. In Österreich ist das die Austrian Power Grid AG (APG). Begriffe erklärt das [Lexikon](/wissen/lexikon#regelreserve).",
        },
        {
          typ: "p",
          text: "Regelreserve wird in Stufen eingesetzt: Zuerst stabilisiert die Primärregelung die Frequenz binnen Sekunden, dann löst die automatische Sekundärregelung sie ab und führt die Frequenz zurück, schließlich übernimmt die manuell bzw. automatisiert abgerufene Tertiärregelung länger andauernde Abweichungen. Die Anbieter werden für das Vorhalten der Leistung bezahlt, bei aFRR und mFRR zusätzlich für die tatsächlich gelieferte Energie.",
        },
        {
          typ: "kennzahl",
          wert: "1 MW",
          titel: "Mindestgebot für alle drei Regelreserveprodukte der APG",
          text: "Kleinere Anlagen erreichen diese Schwelle über einen Pool: Ein Aggregator bündelt Speicher und flexible Verbraucher mehrerer Standorte und bietet sie gemeinsam an.",
        },
      ],
    },
    {
      id: "produkte",
      titel: "FCR, aFRR und mFRR: die drei Produkte im Vergleich",
      tocLabel: "FCR, aFRR, mFRR",
      bloecke: [
        {
          typ: "p",
          text: "**Die drei Regelreserveprodukte unterscheiden sich vor allem darin, wie schnell sie voll aktiviert sein müssen, wie sie ausgeschrieben und wie sie vergütet werden.** Die folgende Übersicht zeigt die Regeln in der Regelzone Österreich:",
        },
        {
          typ: "tabelle",
          caption: "Regelreserveprodukte der APG, Stand September 2026",
          kopf: ["Produkt", "Volle Aktivierung", "Bedarf Österreich", "Ausschreibung", "Mindestgebot", "Vergütung"],
          zeilen: PRODUKTE,
          minBreite: 820,
          fussnote: "Quelle: APG, Marktinformationen Regelreserve. FCR: volle Aktivierung bei Frequenzabweichung ab 200 mHz, Erbringung mindestens 30 Minuten; Beschaffung in der internationalen FCR-Kooperation. aFRR: Energieaustausch über PICASSO, Leistungsaustausch mit Deutschland über ALPACA (bis 80 MW). mFRR: Energiegebote bis 25 Minuten vor Lieferung, Abruf über die europäische Plattform MARI; Aktivierungszeit laut europäischem Standardprodukt.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "FCR", text: "Symmetrisch: Wer anbietet, muss positiv und negativ gleichermaßen liefern können. Ideal für Batteriespeicher, weil schnelle, kleine Ausgleichsbewegungen über den Tag den Energieinhalt kaum verändern." },
            { titel: "aFRR", text: "Positiv und negativ getrennt. Folgt einem Sollwertsignal der APG im Sekundentakt. Neben Speichern auch für steuerbare Wasserkraft, Gasmotoren oder große Elektrokessel geeignet." },
            { titel: "mFRR", text: "Längere Abrufe, seltener. Geeignet für Anlagen, die ihre Leistung für einige Zeit verschieben können – etwa Pumpen, Kühlhäuser, Notstromaggregate oder Prozesse mit Puffer." },
          ],
        },
      ],
    },
    {
      id: "teilnahme",
      titel: "Wie nimmt ein Unternehmen am Regelreservemarkt teil?",
      tocLabel: "Teilnahme & Präqualifikation",
      bloecke: [
        {
          typ: "p",
          text: "**Wer Regelreserve anbieten will, braucht eine technische Präqualifikation der APG für das jeweilige Produkt und einen Rahmenvertrag – in der Praxis übernimmt das für kleinere Anlagen ein Aggregator.** Die Präqualifikation gilt drei Jahre und wird danach per Selbstauskunft bestätigt. Pooling mehrerer Anlagen ist ausdrücklich vorgesehen.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Potenzial erheben", "Welche Leistung lässt sich wie schnell, wie lange und wie oft verschieben, ohne den Betrieb zu stören? Grundlage sind Lastgang und Prozesskenntnis."],
            ["Aggregator wählen", "Der Aggregator bündelt Anlagen, übernimmt Präqualifikation, Gebote und Abrechnung und trägt einen Teil des Risikos. Vergleichen Sie Erlösbeteiligung, Mindestlaufzeit und Haftung bei Nichterfüllung."],
            ["Technik nachrüsten", "Fernwirkanbindung mit gesicherter Kommunikation, Messung in hoher Auflösung, Steuerbarkeit der Anlage. Bei Speichern: Energiemanagement mit Reserve für den Regelzustand."],
            ["Präqualifikation", "Nachweis der technischen Fähigkeit gegenüber der APG, etwa über Testabrufe; getrennt für FCR, aFRR und mFRR."],
            ["Netzentgelt klären", "Auf Antrag kann für die durch Regelreserve-Aktivierung verursachte Arbeit und Leistung ein eigenes Netznutzungsentgelt verrechnet werden; auf Netzebene 5 bis 7 frühestens nach der Präqualifikation."],
            ["Betrieb und Monitoring", "Abrufe dokumentieren, Verfügbarkeit sicherstellen, Erlöse mit dem Aggregator abgleichen."],
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "IT-Sicherheit ist Pflicht, nicht Kür",
          text: "Wer Anlagen fernsteuern lässt, öffnet eine Schnittstelle in die Betriebstechnik. Getrennte Netze, verschlüsselte Verbindungen, Rechtekonzepte und Protokollierung gehören dazu. Unsere eigenen [SCADA-Systeme](/technik/scada) und [Fernwartung](/technik/fernwartung) entstehen gemeinsam mit einem Partner für Digitalisierung und IT-Security.",
        },
      ],
    },
    {
      id: "anlagen",
      titel: "Welche Anlagen eignen sich für Regelreserve?",
      tocLabel: "Geeignete Anlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Geeignet sind Anlagen, die ihre Leistung schnell, zuverlässig und wiederholbar ändern können – allen voran Batteriespeicher, aber auch flexible Verbraucher mit Puffer.** Photovoltaik kann nur eingeschränkt beitragen, weil sie ohne Speicher nur nach unten regeln kann und von der Sonne abhängt.",
        },
        {
          typ: "tabelle",
          caption: "Eignung typischer Anlagen in Betrieben für Regelreserve, Stand September 2026",
          kopf: ["Anlage", "Richtung", "Geeignete Produkte", "Worauf es ankommt"],
          zeilen: [
            ["Batteriespeicher", "positiv und negativ", "FCR, aFRR, mFRR", "Ladezustand managen, Zyklen und Garantie beachten"],
            ["Kühlhäuser, Tiefkühllager", "vor allem positiv (Leistung reduzieren)", "mFRR, teils aFRR", "Temperaturband, Warenschutz, Dauer der Abrufe"],
            ["Elektrokessel / Power-to-Heat", "vor allem negativ (Leistung erhöhen)", "aFRR, mFRR", "Wärmeabnahme oder Speicher vorhanden"],
            ["Pumpen, Druckluft, Wasserwirtschaft", "positiv und negativ", "mFRR", "Speicherbecken oder Druckpuffer"],
            ["Notstromaggregate", "positiv", "mFRR", "Emissionsauflagen, Genehmigung, Betriebsstunden"],
            ["PV-Anlage ohne Speicher", "nur negativ (abregeln)", "eingeschränkt, v. a. mFRR negativ", "wetterabhängige Verfügbarkeit"],
          ],
          minBreite: 760,
          fussnote: "Allgemeine Einordnung; ob eine konkrete Anlage präqualifiziert werden kann, prüfen Aggregator und APG im Einzelfall.",
        },
        {
          typ: "p",
          text: "Für Batteriespeicher ist die Regelreserve oft einer von mehreren Erlöswegen – neben Eigenverbrauch, [Peak Shaving](/ratgeber/peak-shaving-leistungspreis) und Arbitrage. Wie sich Erlösquellen bei größeren Anlagen kombinieren lassen, beschreibt der Ratgeber [Batteriegroßspeicher](/ratgeber/grossspeicher-bess). Für Speicher im Betrieb siehe [Gewerbespeicher](/gewerbespeicher).",
        },
      ],
    },
    {
      id: "erloese",
      titel: "Was bringt Regelreserve – und was nicht?",
      tocLabel: "Erlöse realistisch",
      bloecke: [
        {
          typ: "p",
          text: "**Regelreserve-Erlöse sind stark schwankend und in Österreich durch einen kleinen Markt begrenzt; wer sie in eine Investitionsrechnung aufnimmt, sollte vorsichtig kalkulieren.** Die APG beschafft je Richtung nur einige hundert Megawatt. Zum Vergleich: Der Entwurf der E-Control sieht eine Netzentgeltbefreiung für systemdienliche Speicher mit bis zu 5 GW vor – ein Vielfaches des Regelreservebedarfs.",
        },
        {
          typ: "liste",
          punkte: [
            "**Leistungspreise sinken mit dem Angebot:** In Nachbarmärkten sind FCR- und aFRR-Preise nach starkem Speicherzubau deutlich gefallen. Dieselbe Entwicklung ist in Österreich zu erwarten.",
            "**Arbeitspreise sind unregelmäßig:** Bei aFRR und mFRR entstehen Erlöse nur bei tatsächlichen Abrufen, deren Häufigkeit von Prognosefehlern und Ereignissen abhängt.",
            "**Aggregatoren teilen:** Üblich sind Erlösbeteiligungen oder feste Vergütungen je MW – beides mit Vor- und Nachteilen.",
            "**Opportunitätskosten:** Ein Speicher, der für Regelreserve reserviert ist, fehlt für Eigenverbrauch oder Peak Shaving. Die Optimierung muss alle Nutzungen gemeinsam betrachten.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Wo Sie aktuelle Preise finden",
          text: "Die APG veröffentlicht Ausschreibungsergebnisse für FCR, aFRR und mFRR auf ihrer Transparenz- und Marktplattform. Für eine Bewertung sollten Sie Zeitreihen über mehrere Jahre betrachten – Einzelmonate mit Spitzenpreisen sind kein Maßstab. Eine Erlösprognose für Ihre Anlage erstellt ein Aggregator auf Basis Ihrer Daten.",
        },
      ],
    },
    {
      id: "netzflex",
      titel: "Neu mit dem ElWG: Flexibilität für den Netzbetreiber",
      tocLabel: "Flexibilität im ElWG",
      bloecke: [
        {
          typ: "p",
          text: "**Neben der Regelreserve für die Frequenz entsteht mit dem Elektrizitätswirtschaftsgesetz (ElWG) ein zweiter Markt: Flexibilität für Verteilernetzbetreiber, die Engpässe vermeiden wollen.** Das ElWG sieht marktgestützte Beschaffung von Flexibilitätsleistungen und Verträge mit dem Regelzonenführer vor (§§ 139, 140 ElWG) und erlaubt aktiven Kunden sowie Aggregatoren die Teilnahme an allen Strommärkten.",
        },
        {
          typ: "tabelle",
          caption: "Instrumente für netzdienliche Flexibilität in Österreich, Stand September 2026",
          kopf: ["Instrument", "Seit / ab", "Prinzip", "Vorteil für den Betrieb"],
          zeilen: [
            ["Regelbare Bezugsleistung (NE 3 und 4)", "2026 (SNE-V-Novelle)", "Netzbetreiber darf eine variable Leistungszone bis 6 Uhr des Vortags für 2 × 2 h je Tag einschränken", "nur 25 % des Leistungspreises für die variable Zone"],
            ["Flexible Entnahme (NE 1 bis 7)", "2027 (SNE-G-V-Entwurf)", "vereinbarter Leistungsanteil darf bis 2 × täglich um bis zu 100 % eingeschränkt werden (NE 5–7: je bis zu 4 h)", "prozentueller Abschlag auf den Leistungspreis; Zuschlag bei Verstoß"],
            ["Systemdienliche Speicher", "2027 (ElWG § 127 Abs. 3)", "Speicher ab 1 MW an ausgelasteten Netzknoten mit Flex-Vertrag", "Befreiung von Netznutzungs- und Netzverlustentgelt"],
            ["Zeitvariable Arbeitspreise (NE 7)", "SNAP seit 4/2026, WiNAP ab 2027 (Entwurf)", "günstigerer Netz-Arbeitspreis im Sommer 10–16 Uhr bzw. Winternacht 22–4 Uhr", "Lastverschiebung wird billiger"],
          ],
          minBreite: 780,
          fussnote: "Quellen: SNE-V 2018 idF BGBl. II Nr. 305/2025; E-Control, Entwurf SNE-G-V samt Erläuterungen (2026); ElWG BGBl. I Nr. 91/2025. Tarifwerte ab 2027 legt die Tarifverordnung fest (erwartet Ende 2026).",
        },
        { typ: "h3", text: "Beispiel: flexible Entnahme ab 2027" },
        {
          typ: "p",
          text: `Die Erläuterungen der E-Control beschreiben ein Beispiel, in dem für den flexiblen Leistungsanteil nur 25 % des Leistungspreises zu bezahlen sind. Überträgt man das auf einen Betrieb auf Netzebene 6 im Netzbereich Salzburg (Leistungspreis 2026: ${de(LP_NE6_SBG, 2)} €/kW und Jahr) mit ${FLEX_KW} kW flexibel vereinbarter Leistung, ergäbe sich eine Entlastung von rund ${eur(FLEX_KW * LP_NE6_SBG * ABSCHLAG_BEISPIEL)} pro Jahr – vorausgesetzt, der Betrieb hält die Einschränkungen zuverlässig ein. Die tatsächlichen Abschläge und Leistungspreise ab 2027 stehen erst mit der Tarifverordnung fest.`,
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Rechtsstand",
          text: "Das ElWG (BGBl. I Nr. 91/2025) wurde am 11. Dezember 2025 im Nationalrat beschlossen. Die Verordnungen zu den Netzentgelten ab 2027 waren im September 2026 teils noch im Entwurf. Einen Überblick über das Gesetz bietet der Ratgeber [ElWG für PV-Betreiber](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Praxisbeispiel: Kühlhaus als flexible Last",
      tocLabel: "Praxisbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Kühlhaus mit ${KUEHL.leistungKw} kW Kälteleistung kann – je nach Ware und Temperaturband – einen Teil seiner Leistung für kurze Zeit reduzieren, ohne die Kühlkette zu gefährden.** Nimmt man an, dass die Hälfte der Leistung für bis zu ${KUEHL.maxDauerMin} Minuten verschiebbar ist, stünden rund ${de(flexKw)} kW Flexibilität zur Verfügung – zu wenig für ein eigenes Gebot, aber ein sinnvoller Baustein in einem Pool.`,
        },
        {
          typ: "tabelle",
          caption: "Kühlhaus als flexible Last: technisches Potenzial und Nutzungswege (Beispiel), Stand September 2026",
          kopf: ["Nutzungsweg", "Was die Anlage tut", "Voraussetzung", "Einordnung"],
          zeilen: [
            ["Eigenverbrauch PV", "Vorkühlen mittags mit Solarstrom", "Energiemanagement", "meist der größte und sicherste Nutzen"],
            ["Peak Shaving", "Kompressoren bei drohender Monatsspitze kurz drosseln", "Lastgangmessung, Prognose", "senkt Leistungspreis dauerhaft"],
            ["Dynamischer Tarif", "Kälte in günstige Viertelstunden legen", "spotbasierter Liefervertrag", "abhängig von Preisspreizung"],
            ["mFRR im Pool", `bis ${de(flexKw)} kW für bis zu ${KUEHL.maxDauerMin} min reduzieren`, "Aggregator, Präqualifikation, Fernsteuerung", "Zusatzerlös, schwankend"],
            ["Flexible Entnahme ab 2027", "Einschränkung durch den Netzbetreiber akzeptieren", "Vertrag mit dem Netzbetreiber", "Abschlag auf den Leistungspreis"],
          ],
          minBreite: 760,
          fussnote: `Annahmen: ${KUEHL.leistungKw} kW elektrische Kälteleistung, ${Math.round(KUEHL.flexAnteil * 100)} % davon für bis zu ${KUEHL.maxDauerMin} Minuten verschiebbar. Rein technisches Beispiel ohne Erlösangabe; die Wirtschaftlichkeit hängt von Pool, Aggregatorvertrag und Marktpreisen ab.`,
        },
        {
          typ: "p",
          text: "Die Reihenfolge ist typisch: Zuerst lohnen sich Eigenverbrauch und Leistungsspitzen, weil die Einsparung sicher ist. Regelreserve und Netzflexibilität kommen dazu, wenn Messung und Steuerung ohnehin vorhanden sind. Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) ist dafür die gemeinsame Basis; laufende Werte lassen sich über [Energie Live](/energie-live) verfolgen.",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler bei der Flexibilitätsvermarktung",
      tocLabel: "Fehler vermeiden",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Betrieb zuerst:** Keine Flexibilität zusagen, die im Ernstfall die Produktion, die Kühlkette oder die Notstromfähigkeit gefährdet.",
            "**Verfügbarkeit ehrlich angeben:** Nichterfüllung kostet Pönalen und kann die Präqualifikation gefährden.",
            "**Doppelvermarktung vermeiden:** Dieselbe Leistung kann nicht gleichzeitig dem Netzbetreiber, der APG und dem Eigenverbrauch fest zugesagt werden.",
            "**Speicherzyklen einrechnen:** Zusätzliche Zyklen verkürzen die Lebensdauer; Garantiebedingungen prüfen – siehe [Stromspeicher-Lebensdauer](/ratgeber/stromspeicher-lebensdauer).",
            "**Verträge vergleichen:** Laufzeit, Erlösanteil, Haftung, Datenhoheit und Kündigung beim Aggregator klären.",
            "**Leistungspreis beachten:** Ein Speicher, der für Regelreserve aus dem Netz lädt, darf keine neue Monatsspitze erzeugen.",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist der Unterschied zwischen Regelenergie und Regelreserve?",
      a: "Regelreserve ist die vorgehaltene Leistung, die der Übertragungsnetzbetreiber bei Bedarf abrufen kann. Regelenergie ist die tatsächlich gelieferte oder aufgenommene Energie bei einem Abruf. Im Alltag werden beide Begriffe oft synonym verwendet.",
    },
    {
      q: "Wie viel Regelreserve braucht Österreich?",
      a: `Die APG schreibt 2026 rund ±${FCR_MW} MW FCR, ±${AFRR_MW} MW aFRR und seit Mai 2026 +${MFRR_POS}/−${MFRR_NEG} MW mFRR aus. Der Bedarf wird regelmäßig überprüft und kann angepasst werden.`,
    },
    {
      q: "Kann mein Betrieb Regelenergie anbieten?",
      a: "Ja, wenn Anlagen ihre Leistung schnell und zuverlässig ändern können, etwa Batteriespeicher, Kühlhäuser, Elektrokessel oder Pumpen. Kleinere Betriebe nehmen über einen Aggregator teil, der Anlagen bündelt und die Präqualifikation bei der APG übernimmt.",
    },
    {
      q: "Wie hoch sind die Erlöse aus Regelreserve?",
      a: "Das lässt sich nicht pauschal sagen. Leistungs- und Arbeitspreise schwanken stark und sinken, wenn viele Speicher auf den Markt kommen. Seriöse Aussagen sind nur mit Anlagendaten und aktuellen Ausschreibungsergebnissen der APG möglich.",
    },
    {
      q: "Eignet sich eine PV-Anlage für Regelenergie?",
      a: "Nur eingeschränkt. Ohne Speicher kann eine PV-Anlage lediglich abregeln, also negative Regelreserve liefern, und das nur, wenn die Sonne scheint. In Kombination mit einem Batteriespeicher wird die Anlage deutlich flexibler.",
    },
    {
      q: "Was bringt die flexible Netznutzung ab 2027?",
      a: "Nach dem Entwurf der E-Control können Netzbenutzer einen Teil ihrer Bezugsleistung als flexibel vereinbaren, den der Netzbetreiber zeitweise einschränken darf. Für diesen Anteil gilt ein reduzierter Leistungspreis; die genauen Abschläge legt die Tarifverordnung fest.",
    },
    {
      q: "Welche Technik braucht man für Regelreserve?",
      a: "Eine sichere Fernwirkanbindung, Messung in hoher zeitlicher Auflösung, steuerbare Anlagen und ein Energiemanagement, das Regelreserve mit dem Betrieb abstimmt. IT-Sicherheit ist dabei zentral.",
    },
  ],

  passend: [
    { href: "/technik/scada", titel: "SCADA-Systeme", text: "Anlagen sicher überwachen und steuern." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Speicher für Eigenverbrauch, Peak Shaving und Flexibilität." },
    { href: "/ratgeber/grossspeicher-bess", titel: "Batteriegroßspeicher", text: "Erlösquellen und Regeln für Speicher ab 1 MW." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving", text: "Leistungsspitzen senken, Netzentgelte sparen." },
  ],

  quellen: [
    { titel: "APG – Balancing: Regelreserve in Österreich", url: "https://markt.apg.at/en/power-grid/balancing/", stand: "09/2026" },
    { titel: "APG – Primärregelung (FCR)", url: "https://markt.apg.at/en/power-grid/balancing/primary-control/", stand: "09/2026" },
    { titel: "APG – Sekundärregelung (aFRR)", url: "https://markt.apg.at/en/power-grid/balancing/secondary-control/", stand: "09/2026" },
    { titel: "APG – Tertiärregelung (mFRR)", url: "https://markt.apg.at/en/power-grid/balancing/tertiary-control/", stand: "09/2026" },
    { titel: "APG – Modalitäten für Regelreserveanbieter in Österreich, Version 1.4", url: "https://pb1-medien.apg.at/im/dl/pboxx-pixelboxx-20442/f,p/TC_EBGL_V1.4_clean.pdf", stand: "09/2026" },
    { titel: "E-Control – Entwurf SNE-G-V samt Erläuterungen (flexible Entnahme, systemdienliche Speicher, Regelreserve)", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "2026" },
    { titel: "SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025 (regelbare Bezugsleistung)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "09/2026" },
    { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Flexibilität im Betrieb?", text: "Wir erheben Ihr Potenzial aus Lastgang und Anlagen.", href: "/energie-live", label: "Energie Live ansehen" },
  cta: {
    title: "Flexibilität erkennen, bevor sie vermarktet wird.",
    text: "Wir analysieren Lastgang, Speicher und Anlagen, planen Steuerung und Messtechnik und binden Ihre Anlagen sicher über SCADA und Fernwartung an.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "SCADA-Systeme", href: "/technik/scada" },
  },
};

export default artikel;
