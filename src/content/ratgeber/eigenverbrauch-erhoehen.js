// Ratgeber: Eigenverbrauch erhöhen – Schwerpunkt Gewerbe, Landwirtschaft, Hotellerie, Gemeinden (Österreich)
// Quellen: OeMAG-Marktpreise PV 2026 (monatlich, Sommer 6,146–6,772 ct/kWh), E-Control (Elektrizitätsabgabe 2026:
// Haushalte 0,1 ct/kWh, Unternehmen 0,82 ct/kWh; Preiskomponenten), BMF-Erlass 24.10.2025 (Strompreis 2026 für
// Sachbezug 32,806 ct/kWh brutto als Referenz Haushaltspreis), TOR Verteilernetzanschluss NS V1.3.1 (Meldung von
// Wärmepumpen/Ladeeinrichtungen > 3,68 kVA), Energy-Charts (Börsenpreise AT).
// Rechenbeispiel mit offengelegten Annahmen (Bezugspreis 20 ct/kWh netto als Beispielwert).

const KWP = 150;
const ERTRAG = KWP * 1050; // kWh/Jahr, Annahme
const BEZUG = 0.2; // €/kWh netto, Annahme
const MARKT = 0.068; // €/kWh, gerundeter OeMAG-Sommermarktpreis PV 2026
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const wert = (q) => ERTRAG * q * BEZUG + ERTRAG * (1 - q) * MARKT;
const zeile = (q) => [`${Math.round(q * 100)} %`, kwh(ERTRAG * q), kwh(ERTRAG * (1 - q)), eur(wert(q)), eur(wert(q) - wert(0.3))];

const artikel = {
  slug: "eigenverbrauch-erhoehen",
  title: "Eigenverbrauch erhöhen: So nutzen Betriebe mehr eigenen Solarstrom",
  seoTitle: "Eigenverbrauch erhöhen: PV im Betrieb nutzen | Ökovolt",
  kurzTitel: "Eigenverbrauch erhöhen",
  description:
    "Eigenverbrauch erhöhen im Betrieb: Lastgang, Lastverschiebung, Kälte, Wärme, E-Flotte, Speicher und Energiegemeinschaft – mit Rechenbeispiel Österreich 2026.",
  excerpt:
    "Solarstrom selbst zu nutzen ist in Österreich 2026 ein Vielfaches wert wie ihn einzuspeisen. Welche Hebel Gewerbe, Landwirtschaft, Hotels und Gemeinden haben – vom Lastgang über Kälte und Wärme bis zu Speicher und Energiegemeinschaft.",
  hauptKeyword: "eigenverbrauch erhöhen",
  keywords: [
    "Eigenverbrauch erhöhen",
    "Eigenverbrauch Photovoltaik Gewerbe",
    "Eigenverbrauchsquote Betrieb",
    "Lastverschiebung PV",
    "Photovoltaik Landwirtschaft Eigenverbrauch",
    "PV Überschuss nutzen Österreich",
    "Autarkiegrad Unternehmen",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/eigenverbrauch-erhoehen.jpg",
  bildAlt: "Energiefluss-Anzeige einer PV-Anlage mit Speicher in einer App",
  badge: { wert: "≈ 3×", text: "so viel ist eine selbst genutzte kWh wert wie der Sommer-Marktpreis 2026 (Beispiel)" },

  kurzFazit: [
    "**Eigenverbrauch ist 2026 der wichtigste Hebel der PV-Wirtschaftlichkeit:** Eine selbst genutzte Kilowattstunde ersetzt Energiepreis, Netzentgelte und Abgaben, während eingespeister Strom im Sommer 2026 nur rund 6,1 bis 6,8 ct/kWh OeMAG-Marktpreis brachte.",
    `**Rechenbeispiel ${KWP} kWp:** Steigt der Eigenverbrauch von 30 auf 60 %, wächst der jährliche Wert des Solarstroms in unserem Beispiel um rund ${eur(wert(0.6) - wert(0.3))} (Annahme: 20 ct/kWh Bezugspreis netto).`,
    "**Die günstigsten Hebel sind organisatorisch:** Prozesse, Kühlung, Warmwasser und Ladevorgänge in die Mittagsstunden verlegen. Erst danach folgen Speicher, Wärmepumpen und Energiemanagement.",
    "**Grundlage ist der Lastgang in Viertelstundenwerten** – ohne ihn wird die PV-Anlage zu groß oder zu klein geplant und Hebel werden falsch bewertet.",
  ],

  abschnitte: [
    {
      id: "begriffe",
      titel: "Eigenverbrauchsquote und Autarkiegrad: Was ist der Unterschied?",
      tocLabel: "Begriffe",
      bloecke: [
        {
          typ: "p",
          text: "**Die Eigenverbrauchsquote sagt, welcher Anteil des erzeugten Solarstroms im Betrieb selbst genutzt wird; der Autarkiegrad sagt, welcher Anteil des Strombedarfs aus der eigenen Anlage stammt.** Beide Kennzahlen hängen zusammen, verfolgen aber unterschiedliche Ziele: Eine kleine Anlage erreicht leicht 90 % Eigenverbrauch, deckt aber nur einen Bruchteil des Bedarfs; eine große Anlage deckt mehr Bedarf, speist aber auch mehr ein.",
        },
        {
          typ: "tabelle",
          caption: "Eigenverbrauchsquote und Autarkiegrad am Beispiel eines Betriebs mit 200.000 kWh Jahresverbrauch",
          kopf: ["Anlage", "Erzeugung", "davon selbst genutzt", "Eigenverbrauchsquote", "Autarkiegrad"],
          zeilen: [
            ["80 kWp", "84.000 kWh", "71.000 kWh", "85 %", "36 %"],
            ["150 kWp", "157.500 kWh", "102.000 kWh", "65 %", "51 %"],
            ["250 kWp", "262.500 kWh", "121.000 kWh", "46 %", "61 %"],
          ],
          minBreite: 640,
          fussnote: "Illustratives Beispiel für einen Betrieb mit Tagschicht an fünf Tagen; tatsächliche Werte ergeben sich nur aus einer Simulation mit dem eigenen Lastgang.",
        },
        {
          typ: "p",
          text: "Die Begriffe [Eigenverbrauchsquote](/wissen/lexikon#eigenverbrauchsquote) und [Autarkiegrad](/wissen/lexikon#autarkiegrad) sind im Lexikon erklärt. Für Unternehmen ist die Eigenverbrauchsquote meist die wirtschaftlich entscheidende Größe, für Gemeinden und Betriebe mit Versorgungssicherheits-Zielen oft zusätzlich der Autarkiegrad.",
        },
      ],
    },
    {
      id: "wert",
      titel: "Warum Eigenverbrauch in Österreich so viel wert ist",
      tocLabel: "Wert einer kWh",
      bloecke: [
        {
          typ: "p",
          text: "**Eine selbst genutzte Kilowattstunde spart den gesamten Bezugspreis – Energie, Netznutzungs- und Netzverlustentgelt, Elektrizitätsabgabe und Erneuerbaren-Förderkosten –, eine eingespeiste bringt nur den Marktwert der Energie.** Diese Lücke ist der Grund, warum Anlagen heute auf Eigenverbrauch ausgelegt werden.",
        },
        {
          typ: "tabelle",
          caption: "Bestandteile des Strombezugs, die Eigenverbrauch einspart, Stand September 2026",
          kopf: ["Bestandteil", "Spart Eigenverbrauch?", "Hinweis"],
          zeilen: [
            ["Energiepreis des Lieferanten", "ja", "je nach Vertrag fix, indexiert oder Spotpreis"],
            ["Netznutzungsentgelt (Arbeit)", "ja", "je nach Netzebene und Netzgebiet"],
            ["Netzverlustentgelt", "ja", "arbeitsabhängig"],
            ["Leistungsentgelt (bei Lastprofilmessung)", "nur wenn die Spitze sinkt", "PV allein senkt die Jahresspitze selten – Speicher/Lastmanagement nötig"],
            ["Elektrizitätsabgabe", "ja", "2026: 0,82 ct/kWh für Unternehmen, 0,1 ct/kWh für Haushalte"],
            ["Erneuerbaren-Förderbeitrag", "ja (arbeitsabhängiger Teil)", "Pauschale je Zählpunkt bleibt"],
            ["Umsatzsteuer", "nur für nicht vorsteuerabzugsberechtigte Kunden relevant", "Unternehmen rechnen netto"],
          ],
          minBreite: 640,
          fussnote: "Quelle Elektrizitätsabgabe: E-Control. Höhe der Netzentgelte je Netzgebiet laut Systemnutzungsentgelte-Verordnung; Energiepreise vertragsabhängig.",
        },
        {
          typ: "p",
          text: "Zum Vergleich: Der OeMAG-Marktpreis für Photovoltaik lag 2026 zwischen 5,72 ct/kWh im März und 8,997 ct/kWh im August, in den ertragsstarken Monaten April bis Juli bei 6,1 bis 6,8 ct/kWh. Als Referenz für Haushaltsstrom hat das Finanzministerium für 2026 einen Durchschnittspreis von 32,806 ct/kWh brutto festgelegt. Details zum Marktpreis erklärt der Ratgeber [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis); die Mittagsspitzen mit negativen Börsenpreisen beschreibt [Negative Strompreise](/ratgeber/negative-strompreise).",
        },
      ],
    },
    {
      id: "lastgang",
      titel: "Erster Schritt: den Lastgang verstehen",
      tocLabel: "Lastgang",
      bloecke: [
        {
          typ: "p",
          text: "**Wer den Eigenverbrauch erhöhen will, braucht den Lastgang – den Stromverbrauch im Viertelstundenraster über mindestens ein Jahr.** Großkunden mit Lastprofilzähler erhalten diese Daten vom Netzbetreiber; bei Smart Metern lassen sich Viertelstundenwerte über das Kundenportal des Netzbetreibers abrufen, sofern die Übermittlung aktiviert ist. Mehr dazu im Ratgeber [Smart Meter](/ratgeber/smart-meter-pflicht).",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Daten beschaffen", "12 Monate Viertelstundenwerte aus dem Netzbetreiber-Portal oder vom Lieferanten; ergänzend Betriebszeiten, Schichtpläne, Betriebsferien."],
            ["Grundlast bestimmen", "Welche Leistung fließt werktags mittags mindestens? Diese Last deckt die PV fast vollständig."],
            ["Flexible Verbraucher identifizieren", "Kühlung, Druckluft, Warmwasser, Ladepunkte, Pumpen, Trocknung – was lässt sich zeitlich verschieben?"],
            ["Erzeugung überlagern", "PV-Simulation je Viertelstunde gegen den Lastgang legen – daraus ergeben sich Eigenverbrauchsquote, Autarkiegrad und Überschüsse."],
            ["Maßnahmen bewerten", "Hebel nach Kosten und Wirkung reihen: erst organisatorisch, dann technisch."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Wochenende und Betriebsurlaub zählen mit",
          text: "Ein Betrieb mit Fünftagewoche verliert an Wochenenden rund zwei Siebtel der möglichen Eigennutzung – im Sommer mit Betriebsurlaub noch mehr. Genau hier helfen Speicher, Energiegemeinschaften oder ein zweiter Verbraucher (z. B. Kühlhaus, Ladepark), der auch am Wochenende Strom braucht.",
        },
      ],
    },
    {
      id: "hebel",
      titel: "Die wichtigsten Hebel für mehr Eigenverbrauch im Betrieb",
      tocLabel: "Hebel im Betrieb",
      bloecke: [
        {
          typ: "p",
          text: "**Die wirksamsten Hebel sind jene, die ohnehin vorhandene Verbraucher in die Sonnenstunden verlegen – sie kosten wenig und wirken sofort.** Technische Maßnahmen wie Speicher und Wärmepumpen folgen, wenn der Lastgang das hergibt.",
        },
        {
          typ: "tabelle",
          caption: "Hebel für mehr Eigenverbrauch – Aufwand und typische Wirkung",
          kopf: ["Hebel", "Beispiel", "Aufwand", "Wirkung"],
          zeilen: [
            ["Prozesse verschieben", "energieintensive Arbeitsschritte, Reinigung, Trocknung auf 10–15 Uhr legen", "gering (Organisation)", "hoch bei flexibler Produktion"],
            ["Kälte als Speicher", "Kühl- und Tiefkühlzellen mittags tiefer kühlen, abends ausfahren", "gering bis mittel (Regelung)", "hoch in Handel, Gastronomie, Landwirtschaft"],
            ["Warmwasser & Wärme", "Boiler, Pufferspeicher, Wärmepumpe tagsüber laden", "mittel", "mittel bis hoch, v. a. Hotel und Landwirtschaft"],
            ["Druckluft", "Speicherbehälter, Kompressorlauf mittags, Leckagen beheben", "gering bis mittel", "mittel"],
            ["E-Flotte & Ladepunkte", "Dienst- und Poolfahrzeuge tagsüber mit Überschuss laden", "mittel", "hoch bei Fahrzeugen, die tagsüber stehen"],
            ["Batteriespeicher", "Mittagsstrom für Abend und Nacht, zusätzlich Peak Shaving", "hoch", "mittel bis hoch, abhängig vom Lastgang"],
            ["Energiegemeinschaft", "Überschuss an Nachbarbetriebe, Gemeinde, Mitarbeitende", "mittel (Organisation)", "hoch für Wochenend- und Sommerüberschüsse"],
          ],
          minBreite: 720,
        },
        {
          typ: "p",
          text: "Wie Ladepunkte gesteuert werden, erklärt der Ratgeber [E-Flotte laden mit Photovoltaik](/ratgeber/e-flotte-laden-photovoltaik); die Kombination mit Heizung und Warmwasser beschreibt [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik). Wann ein Speicher sich rechnet, zeigt [Gewerbespeicher: Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: `Rechenbeispiel: ${KWP} kWp im Gewerbebetrieb`,
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Wie stark jeder Prozentpunkt Eigenverbrauch zählt, zeigt eine ${KWP}-kWp-Dachanlage mit rund ${kwh(ERTRAG)} Jahresertrag.** Die selbst genutzte Energie wird mit 20 ct/kWh netto bewertet, der Überschuss mit 6,8 ct/kWh (gerundeter OeMAG-Sommermarktpreis 2026).`,
        },
        {
          typ: "tabelle",
          caption: `Jährlicher Wert des Solarstroms einer ${KWP}-kWp-Anlage nach Eigenverbrauchsquote (Beispielrechnung, Stand September 2026)`,
          kopf: ["Eigenverbrauch", "selbst genutzt", "eingespeist", "Wert pro Jahr", "Mehrwert ggü. 30 %"],
          zeilen: [zeile(0.3), zeile(0.45), zeile(0.6), zeile(0.75)],
          hervorheben: 3,
          markierteZeile: 2,
          minBreite: 680,
          fussnote: "Annahmen: 1.050 kWh/kWp, Bezugspreis 20 ct/kWh netto (Energie, Netz, Abgaben – bitte eigenen Wert einsetzen), Einspeisung 6,8 ct/kWh. Ohne Investitionskosten der Maßnahmen, ohne Leistungspreiseffekte.",
        },
        {
          typ: "p",
          text: "Jeder zusätzliche Eigenverbrauchs-Prozentpunkt ist in diesem Beispiel rund 200 € im Jahr wert. Damit lässt sich rasch abschätzen, was eine Maßnahme kosten darf: Eine Regelung für die Kühlzellen, die den Eigenverbrauch um fünf Prozentpunkte hebt, bringt etwa 1.000 € pro Jahr. Die Grundlagen der Wirtschaftlichkeit erklärt der Ratgeber [Photovoltaik im Gewerbe](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "branchen",
      titel: "Branchenbeispiele aus Österreich",
      tocLabel: "Branchenbeispiele",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Milchviehbetrieb", text: "Melken und Milchkühlung morgens und abends, dazu Warmwasser, Lüftung und Futtermischung. Hebel: Milchkühlung mit Eisspeicher oder Vorkühlung tagsüber, Warmwasser mittags, Hoflader und Elektrofahrzeuge laden. Mehr unter [Landwirtschaft](/landwirtschaft)." },
            { titel: "Hotel und Gastronomie", text: "Hoher Warmwasser-, Küchen- und Kühlbedarf, Wellness, Wäscherei. Hebel: Warmwasser und Pool mittags aufheizen, Wäscherei in die Mittagszeit legen, Gäste-Ladepunkte mit Überschuss. Siehe [Photovoltaik für Hotels](/ratgeber/photovoltaik-hotel)." },
            { titel: "Lebensmittelhandel", text: "Kühlung läuft rund um die Uhr, Beleuchtung während der Öffnungszeiten. Hebel: Kälte als Speicher nutzen, Kundenparkplatz mit Ladepunkten, Energiemanagement für Kühlmöbel." },
            { titel: "Gemeinde", text: "Amtsgebäude, Schule, Bauhof und Kläranlage mit unterschiedlichen Lastprofilen. Hebel: Pumpen und Belüftung der Kläranlage tagsüber, Energiegemeinschaft zwischen Gebäuden. Siehe [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde)." },
          ],
        },
      ],
    },
    {
      id: "energiegemeinschaft",
      titel: "Wenn der Überschuss bleibt: Energiegemeinschaft statt Einspeisung",
      tocLabel: "Energiegemeinschaft",
      bloecke: [
        {
          typ: "p",
          text: "**Was im eigenen Betrieb nicht verbraucht werden kann, lässt sich über eine Energiegemeinschaft an Nachbarn, Gemeinde oder Mitarbeitende weitergeben – meist zu einem besseren Preis als der Marktpreis.** In lokalen und regionalen Erneuerbare-Energie-Gemeinschaften reduzieren sich zudem für die Abnehmer bestimmte Netzentgelte. Das ist besonders für Betriebe mit Wochenend- und Sommerüberschüssen interessant.",
        },
        {
          typ: "p",
          text: "Welche Formen es gibt und wie Unternehmen teilnehmen, erklären die Ratgeber [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe) und [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden) sowie die Seite [Energiegemeinschaften](/energiegemeinschaften).",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler beim Erhöhen des Eigenverbrauchs",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "p",
          text: "**Der häufigste Fehler ist, Eigenverbrauch zu erhöhen, ohne die Leistungsspitze im Blick zu behalten.** Wer viele Verbraucher gleichzeitig in die Mittagsstunden legt, erzeugt an bewölkten Tagen neue Lastspitzen – und zahlt bei Lastprofilmessung mit einem höheren Leistungsentgelt. Eine Steuerung muss deshalb immer beide Ziele verfolgen: Überschuss nutzen und die Bezugsspitze begrenzen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Speicher ohne Lastganganalyse gekauft:** zu groß, weil nach Jahresverbrauch statt nach Tagesüberschuss dimensioniert – die Kapazität wird im Winter kaum genutzt.",
            "**Steuerung nach Zeitplan statt nach Erzeugung:** Ein Timer für 11 bis 14 Uhr ignoriert Wolken und Jahreszeit; besser ist eine Regelung auf den Messwert am Netzanschlusspunkt.",
            "**Wärmepumpe mit Heizstab-Automatik:** Ein Heizstab, der Überschuss in Wärme verwandelt, nutzt die Kilowattstunde nur einfach, die Wärmepumpe drei- bis viermal – Reihenfolge der Verbraucher richtig festlegen.",
            "**Ladepunkte ohne Lastmanagement:** Mehrere E-Autos, die gleichzeitig nach Schichtbeginn anstecken, treiben die Spitze. Dynamisches Lastmanagement ist Pflicht – siehe [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
            "**Wirkung nicht gemessen:** Ohne Vorher-nachher-Vergleich im Monitoring bleibt offen, ob eine Maßnahme gewirkt hat. Kennzahlen monatlich auswerten.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Dynamische Tarife als Ergänzung",
          text: "Wer nach Ausschöpfen der PV-Hebel noch flexible Lasten hat, kann sie mit einem Spotpreis-Tarif zusätzlich in günstige Stunden verschieben – auch nachts und im Winter. Wann das passt, erklärt der Ratgeber [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich).",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Eigenverbrauch im Betrieb steigern",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Lastgang (Viertelstundenwerte, 12 Monate) beim Netzbetreiber anfordern oder im Portal freischalten.",
            "Grundlast, Mittagslast und Wochenendlast bestimmen; Betriebsurlaub berücksichtigen.",
            "Flexible Verbraucher mit Leistung und Verschiebepotenzial auflisten (Kälte, Wärme, Druckluft, Ladepunkte).",
            "Organisatorische Maßnahmen zuerst umsetzen und im Monitoring messen.",
            "Energiemanagement für automatische Steuerung prüfen – siehe [Energiemanagementsystem](/ratgeber/energiemanagementsystem).",
            "Speicher nur mit Lastgang-Simulation dimensionieren, Peak-Shaving-Nutzen getrennt bewerten.",
            "Neue Wärmepumpen und Ladeeinrichtungen über 3,68 kVA beim Netzbetreiber melden (TOR Verteilernetzanschluss).",
            "Für verbleibende Überschüsse Energiegemeinschaft oder Stromhändler prüfen.",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt plant PV-Anlagen für Betriebe auf Basis des Lastgangs und stimmt Speicher, Ladeinfrastruktur und Energiemanagement darauf ab. Für eine erste Einschätzung nutzen Sie die [Anfrage für Ihre Gewerbeanlage](/angebot) oder den [Speicherrechner](/rechner/stromspeicher).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie kann ein Betrieb seinen PV-Eigenverbrauch erhöhen?",
      a: "Zuerst organisatorisch: Prozesse, Kühlung, Warmwasser und Ladevorgänge in die Mittagsstunden verlegen. Danach technisch mit Energiemanagement, Wärmepumpen, Ladepunkten und – wenn der Lastgang es hergibt – einem Speicher. Überschüsse lassen sich über eine Energiegemeinschaft verwerten.",
    },
    {
      q: "Was ist eine gute Eigenverbrauchsquote?",
      a: "Das hängt von Anlagengröße und Lastgang ab. Kleine Anlagen erreichen leicht sehr hohe Quoten, decken aber wenig Bedarf. Wichtiger als ein Zielwert ist die Wirtschaftlichkeit: Die Anlage sollte so groß sein, dass der Mix aus Eigenverbrauch und Überschussverwertung die beste Rendite bringt.",
    },
    {
      q: "Wie viel ist eine selbst genutzte Kilowattstunde wert?",
      a: "Sie spart den gesamten arbeitsabhängigen Bezugspreis aus Energie, Netzentgelten und Abgaben – für Betriebe typischerweise ein Vielfaches des Marktpreises. Zum Vergleich: Der OeMAG-Marktpreis für PV lag im Sommer 2026 bei rund 6,1 bis 6,8 ct/kWh.",
    },
    {
      q: "Lohnt sich ein Speicher, um den Eigenverbrauch zu erhöhen?",
      a: "Oft erst dann, wenn er zusätzlich Lastspitzen kappt oder Notstrom liefert. Ob sich ein Speicher rechnet, zeigt nur eine Simulation mit Ihrem Lastgang. Details im Ratgeber [Gewerbespeicher: Kosten](/ratgeber/gewerbespeicher-kosten).",
    },
    {
      q: "Woher bekomme ich meinen Lastgang?",
      a: "Vom Netzbetreiber: Großkunden mit Lastprofilzähler erhalten die Viertelstundenwerte auf Anfrage, bei Smart Metern lassen sie sich im Kundenportal abrufen, wenn die Übermittlung von Viertelstundenwerten aktiviert ist.",
    },
    {
      q: "Was mache ich mit Überschüssen am Wochenende?",
      a: "Speichern, verkaufen oder teilen: Ein Speicher verschiebt einen Teil in die Woche, eine Energiegemeinschaft gibt den Strom an Nachbarn, Gemeinde oder Mitarbeitende weiter, der Rest geht zum Marktpreis ins Netz.",
    },
    {
      q: "Muss ich neue Verbraucher wie Wärmepumpen oder Wallboxen melden?",
      a: "Ja, Wärmepumpen, Klimageräte und Ladeeinrichtungen mit einer Bemessungsleistung über 3,68 kVA sind laut TOR Verteilernetzanschluss dem Netzbetreiber zu melden. Ab einer Summe von 10 kVA kann der Netzbetreiber den Anschluss zur weiteren Prüfung aussetzen – ein Energiemanagement, das die vereinbarte Leistung einhält, vermeidet das.",
    },
    {
      q: "Lohnt sich eine größere PV-Anlage, wenn der Eigenverbrauch sinkt?",
      a: "Oft ja, solange jede zusätzliche Kilowattstunde mehr einbringt als sie kostet. Weil der Überschuss nur zum Marktpreis vergütet wird, sollte die Größe aber mit einer Lastgang-Simulation und realistischen Einspeiseerlösen bestimmt werden.",
    },
  ],

  passend: [
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Eigenverbrauch und Peak Shaving mit Speicher." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Verbraucher automatisch steuern." },
    { href: "/ratgeber/energiegemeinschaft-gewerbe", titel: "Energiegemeinschaft für Unternehmen", text: "Überschüsse vor Ort teilen." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving", text: "Leistungspreis senken." },
  ],

  quellen: [
    { titel: "OeMAG – Marktpreise 2026 (monatlich)", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "E-Control – Steuern und Abgaben auf Strom (Elektrizitätsabgabe 2026)", url: "https://www.e-control.at/industrie/strom/strompreis/steuern", stand: "09/2026" },
    { titel: "EY Österreich – BMF: Strompreis 2026 für das Laden emissionsfreier Kfz (32,806 ct/kWh)", url: "https://www.ey.com/de_at/technical/steuernachrichten/bmf-strompreis-2026-laden", stand: "10/2025" },
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "Energy-Charts – Stromerzeugung und Börsenstrompreise Österreich", url: "https://www.energy-charts.info/?l=de&c=AT", stand: "09/2026" },
  ],

  seitenCta: { titel: "Mehr Solarstrom selbst nutzen?", text: "Anlage und Speicher passend zum Lastgang planen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Solarstrom dort nutzen, wo er am meisten wert ist – im eigenen Betrieb.",
    text: "Ökovolt plant PV, Speicher, Ladepunkte und Energiemanagement auf Basis Ihres Lastgangs – für Gewerbe, Landwirtschaft, Hotellerie und Gemeinden in ganz Österreich.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Gewerbespeicher", href: "/gewerbespeicher" },
  },
};

export default artikel;
