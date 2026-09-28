// Ratgeber: PV-Pflicht (Solarpflicht) in den österreichischen Bundesländern
// Recherchestand 28.09.2026, Gesetzestexte über jusline.at (Stand 29.09.2026) geprüft:
// § 118e BO für Wien; § 66a NÖ BO 2014 (in Kraft seit 29.05.2026); § 80b Stmk. BauG; §§ 33, 34 TBV 2016 (Tirol);
// Oö. BauTG 2013 (Solar-ready-Bestimmung); Sbg. BauTG 2015, Bgld. BauG, Vbg. BauG ohne PV-Mindestleistung.
// OIB-Richtlinie 6, Ausgabe September 2025 (Solargebot), OIB-Übersicht Inkrafttreten (Wien 15.07.2026, Tirol 16.07.2026).
// Kärntner Bauvorschriften nicht im Wortlaut geprüft – im Text gekennzeichnet.

const artikel = {
  slug: "solarpflicht-bundeslaender",
  title: "PV-Pflicht in Österreich: Was die Bundesländer bei Neubauten verlangen",
  seoTitle: "PV-Pflicht Österreich 2026: alle Bundesländer | Ökovolt",
  kurzTitel: "PV-Pflicht Bundesländer",
  description:
    "PV-Pflicht in Österreich 2026: Solarpflicht in Wien, NÖ, Steiermark und Tirol, das Solargebot der OIB-Richtlinie 6 und die EU-Fristen ab 2027 für Betriebe.",
  excerpt:
    "Wien, Niederösterreich, die Steiermark und Tirol schreiben bei Neubauten bereits Solaranlagen vor, ab 2027 folgt die EU-Gebäuderichtlinie. Was Betriebe, Gemeinden und Bauträger je Bundesland beachten müssen – mit Rechenbeispielen.",
  hauptKeyword: "pv pflicht österreich",
  keywords: [
    "PV-Pflicht Österreich",
    "Solarpflicht Bundesländer",
    "Photovoltaik Pflicht Neubau",
    "Solarpflicht Wien Bauordnung",
    "PV-Pflicht Niederösterreich",
    "Solargebot OIB-Richtlinie 6",
    "PV-Pflicht Gewerbe",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg",
  bildAlt: "Neubau mit Photovoltaikanlage auf dem Dach",
  badge: { wert: "1 kWp", text: "je 100 m² Brutto-Grundfläche bei Wiener Nicht-Wohnbauten" },

  kurzFazit: [
    "**Eine PV-Pflicht gibt es in Österreich nur auf Landesebene – derzeit mit konkreten Mindestgrößen in Wien, Niederösterreich, der Steiermark und Tirol.** In den übrigen Ländern besteht (Stand September 2026) keine landesgesetzliche PV-Mindestleistung.",
    "**Wien** verlangt bei Neubauten von Nicht-Wohngebäuden **1 kWp je 100 m²** konditionierter Brutto-Grundfläche; die **Steiermark** **6 m² PV-Fläche je angefangene 100 m²** Bruttogeschoßfläche bei Nicht-Wohngebäuden über 250 m².",
    "**Niederösterreich** schreibt seit 29. Mai 2026 Solaranlagen auf neuen Nicht-Wohngebäuden über 300 m² bebauter Fläche vor – ab **1. Jänner 2027** schon ab **250 m²** Nutzfläche; bei Klimaanlagen über 12 kW sind **2 m² Modulfläche je kW** Kühlleistung Pflicht.",
    "Die **EU-Gebäuderichtlinie** und das **Solargebot der OIB-Richtlinie 6 (2025)** bringen ab 2027 schrittweise Pflichten für neue Nicht-Wohngebäude, bestehende öffentliche Gebäude, größere Renovierungen (ab 2028) und überdachte Parkplätze (ab 2030).",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Gibt es in Österreich eine PV-Pflicht?",
      tocLabel: "Gibt es eine PV-Pflicht?",
      bloecke: [
        {
          typ: "p",
          text: "**Ja – aber nicht bundesweit, sondern in den Bauordnungen und bautechnischen Vorschriften einzelner Bundesländer.** Bauen und Energieeinsparung sind in Österreich Landessache. Deshalb unterscheiden sich Anwendungsbereich, Schwellen und Mindestgrößen erheblich. Harmonisierend wirkt das Österreichische Institut für Bautechnik (OIB): Seine Richtlinie 6 in der Ausgabe September 2025 enthält erstmals ein einheitliches Solargebot, das die Länder übernehmen können und das die Vorgaben der EU-Gebäuderichtlinie (EU) 2024/1275 umsetzt.",
        },
        {
          typ: "p",
          text: "Für Betriebe und Gemeinden ist die Pflicht vor allem bei Neubauten und größeren Renovierungen relevant. Wirtschaftlich liegt die sinnvolle Anlagengröße meist deutlich über dem gesetzlichen Minimum – die Pflicht ist eine Untergrenze, keine Planungsgröße. Wie Sie die passende Größe nach Lastgang bestimmen, zeigt der Ratgeber [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
      ],
    },
    {
      id: "uebersicht",
      titel: "PV-Pflicht nach Bundesland im Überblick",
      tocLabel: "Übersicht je Land",
      bloecke: [
        {
          typ: "tabelle",
          caption: "PV-Pflicht bei Neubauten in den Bundesländern, Stand September 2026",
          kopf: ["Bundesland", "Pflicht", "Mindestgröße", "Rechtsgrundlage"],
          zeilen: [
            ["Wien", "Neubauten und Zubauten aller Gebäudearten", "Nicht-Wohngebäude: 1 kWp je 100 m² konditionierter BGF; Wohngebäude: BGF ÷ (150 × charakteristische Länge) kWp", "§ 118e Abs. 3 BO für Wien"],
            ["Niederösterreich", "neue öffentliche und Nicht-Wohngebäude über 300 m² bebauter Fläche, ab 1. 1. 2027 über 250 m² Nutzfläche; neue Wohngebäude über 300 m², ab 2030 alle; bestehende öffentliche Gebäude ab 2028; überdachte Parkplätze ab 2030", "„geeignete Solarenergieanlagen“; zusätzlich Kühlbedarf- und Klimaanlagenregel (2 m² Modulfläche je kW)", "§ 66a NÖ BO 2014"],
            ["Steiermark", "Neubauten von Wohngebäuden über 100 m² und Nicht-Wohngebäuden über 250 m²; auch bei größeren Renovierungen bzw. Kesseltausch mit Dachsanierung", "Nicht-Wohn: 6 m² PV (oder 2 m² Solarthermie) je angefangene 100 m² BGF; Wohn: 3 m² PV je 100 m²", "§ 80b Abs. 2 Stmk. BauG"],
            ["Tirol", "OIB-Richtlinie 6 (Ausgabe September 2025) ist seit 16. 7. 2026 verbindlich", "Solargebot der OIB-RL 6; für Wohngebäude alternativ 7 kWp (1–2 Einheiten) bis mind. 20 kWp (ab 11 Einheiten)", "§§ 33, 34 TBV 2016"],
            ["Oberösterreich", "keine PV-Mindestleistung; Dächer von Hauptgebäuden „möglichst“ solartauglich planen, Bebauungsplan kann Vorgaben machen", "–", "Oö. BauTG 2013"],
            ["Salzburg, Burgenland, Vorarlberg", "keine landesgesetzliche PV-Mindestleistung festgestellt", "–", "Landesbaurecht"],
            ["Kärnten", "keine PV-Mindestleistung festgestellt; Bauvorschriften nicht im Wortlaut geprüft", "–", "Kärntner Bauvorschriften"],
          ],
          minBreite: 820,
          fussnote: "Eigene Durchsicht der geltenden Gesetzestexte (jusline.at, Stand 29. 9. 2026). Ausnahmen (z. B. Denkmalschutz, Schutzzonen, geringe Einstrahlung, unwirtschaftliche Netzanbindung) sind in den jeweiligen Bestimmungen geregelt. Die Umsetzung der EU-Gebäuderichtlinie ist in mehreren Ländern noch im Gange. Keine Rechtsberatung.",
        },
      ],
    },
    {
      id: "wien",
      titel: "Wien: 1 kWp je 100 m² Brutto-Grundfläche",
      tocLabel: "Wien",
      bloecke: [
        {
          typ: "p",
          text: "**Wien verpflichtet bei Neubauten und Zubauten zur Errichtung solarer Energieträger oder gleichwertiger Systeme mit einer Spitzennennleistung von mindestens 1 kWp auf der Liegenschaft.** Bei Nicht-Wohngebäuden ist je 100 m² konditionierter Brutto-Grundfläche (bei Zubauten: je neu geschaffener 100 m²) 1 kWp zu installieren. Bei Wohngebäuden gilt die Formel PPV = BGF ÷ (150 × lc), wobei lc die charakteristische Länge des Gebäudes ist. 1 kWp PV entspricht 1,40 m² Solarthermie- oder PVT-Kollektorfläche.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "§ 118e Abs. 3 Bauordnung für Wien",
          text: "Solare Energieträger oder andere technische Systeme zur Nutzung umweltschonender Energieträger mit gleicher Leistung sind mit einer Spitzen-Nennleistung von mindestens 1 kWp auf der Liegenschaft zum Einsatz zu bringen: bei Neubauten mit Ausnahme von Wohngebäuden für je 100 m² konditionierter Brutto-Grundfläche, bei Wohngebäuden pro charakteristischer Länge und je 150 m² konditionierter Brutto-Grundfläche. In den Einreichunterlagen sind Standort, Aufstellfläche und Leistung (kWp) darzustellen.",
        },
        {
          typ: "p",
          text: "Fehlt auf dem eigenen Dach Platz, bietet der Markt sogenannte Ersatzflächen an; ob und wie sie anerkannt werden, klärt die Baubehörde (MA 37) im Verfahren. Für Wiener Betriebe mit großen Dachflächen ist die Pflichtgröße meist schnell erreicht – die Frage ist eher, wie viel mehr wirtschaftlich sinnvoll ist.",
        },
      ],
    },
    {
      id: "niederoesterreich",
      titel: "Niederösterreich: Solarpflicht nach § 66a NÖ Bauordnung",
      tocLabel: "Niederösterreich",
      bloecke: [
        {
          typ: "p",
          text: "**Niederösterreich hat seine Solarpflicht mit 29. Mai 2026 an die EU-Gebäuderichtlinie angepasst und stuft sie zeitlich ab.** Geeignete Solarenergieanlagen sind zu errichten, sofern dies technisch geeignet sowie wirtschaftlich und funktional realisierbar ist:",
        },
        {
          typ: "liste",
          punkte: [
            "auf neuen öffentlichen Gebäuden und neuen Nicht-Wohngebäuden mit mehr als 300 m² bebauter Fläche, ab 1. Jänner 2027 (Antragstellung) ab mehr als 250 m² Gesamtnutzfläche,",
            "auf bestehenden öffentlichen Gebäuden über 2.000 m² Nutzfläche ab 2028, über 750 m² ab 2029 und über 250 m² ab 2031,",
            "auf bestehenden Nicht-Wohngebäuden über 500 m² bei größerer Renovierung oder bewilligungspflichtigen Arbeiten am Dach bzw. an der Gebäudetechnik ab 2028,",
            "auf neuen Wohngebäuden über 300 m² bebauter Fläche, ab 2030 auf allen neuen Wohngebäuden,",
            "auf neuen überdachten Parkplätzen mit mindestens drei Pkw-Stellplätzen, die an Gebäude angrenzen, ab 2030.",
          ],
        },
        {
          typ: "p",
          text: "Zwei Sonderregeln betreffen vor allem Betriebe: Weist der Energieausweis eines neuen Nicht-Wohngebäudes einen außeninduzierten Kühlbedarf aus, ist eine PV-Anlage mit mindestens KB*RK × Bruttovolumen × 0,01 m² Modulfläche zu errichten. Und wer auf einem Bauwerk Klimaanlagen mit jeweils mehr als 12 kW Nennleistung errichtet, muss eine PV-Anlage mit mindestens 2 m² Modulfläche je kW Kühlleistung bauen. Bereits bestehende Module werden angerechnet. Ausgenommen sind u. a. nicht konditionierte Gebäude, Bauwerke in Schutzzonen bei Widerspruch zum Schutzziel und Bauwerke vorübergehenden Bestandes.",
        },
      ],
    },
    {
      id: "steiermark",
      titel: "Steiermark: Flächenvorgabe je 100 m² Geschoßfläche",
      tocLabel: "Steiermark",
      bloecke: [
        {
          typ: "p",
          text: "**Die Steiermark verlangt solare Energiesysteme bei Neubauten von Wohngebäuden über 100 m² konditionierter BGF und Nicht-Wohngebäuden über 250 m² oberirdischer Bruttogeschoßfläche.** Bei Nicht-Wohngebäuden sind je angefangene 100 m² mindestens 6 m² Photovoltaik oder 2 m² Solarthermie anzubringen, bei Wohngebäuden 3 m² PV oder 1 m² Solarthermie. Dasselbe gilt bei größeren Renovierungen und beim Tausch einer Feuerungsanlage, wenn gleichzeitig Dach oder Fassade saniert werden. Für überdachte Bauwerke (etwa Carports) über 250 m² Dachfläche gelten ebenfalls 6 m² je 100 m².",
        },
        {
          typ: "p",
          text: "Die Pflicht entfällt, wenn eine Bewilligung nach Ortsbildgesetz oder Grazer Altstadterhaltungsgesetz nicht erteilt werden kann oder die Globalstrahlung am Standort unter 900 kWh/m² im Jahr liegt. Für die Pflicht nach Neubau-Regeln kann sie zusätzlich entfallen, wenn der Netzanschluss mehr als das Dreifache der PV-Kosten ausmachen würde oder das Gebäude mit qualitätsgesicherter Fernwärme versorgt wird.",
        },
      ],
    },
    {
      id: "tirol-oib",
      titel: "Tirol und das Solargebot der OIB-Richtlinie 6",
      tocLabel: "Tirol & OIB-RL 6",
      bloecke: [
        {
          typ: "p",
          text: "**Tirol hat die OIB-Richtlinie 6 in der Ausgabe September 2025 mit 16. Juli 2026 für verbindlich erklärt und damit als erstes Land neben Wien das neue Solargebot übernommen.** Die Richtlinie verlangt Solarenergieanlagen, sofern technisch geeignet sowie wirtschaftlich und funktional realisierbar, zu folgenden Zeitpunkten:",
        },
        {
          typ: "tabelle",
          caption: "Solargebot der OIB-Richtlinie 6, Ausgabe September 2025",
          kopf: ["Ab", "Gebäude", "Schwelle (Gesamtnutzfläche)"],
          zeilen: [
            ["1. 1. 2027", "neue öffentliche Gebäude, neue Nicht-Wohngebäude und sonstige konditionierte Gebäude", "über 250 m²"],
            ["1. 1. 2028", "bestehende öffentliche Gebäude", "über 2.000 m²"],
            ["1. 1. 2028", "bestehende Nicht-Wohngebäude bei größerer Renovierung oder genehmigungspflichtigen Arbeiten am Dach bzw. an der Gebäudetechnik", "über 500 m²"],
            ["1. 1. 2029", "bestehende öffentliche Gebäude", "über 750 m²"],
            ["1. 1. 2030", "alle neuen Wohngebäude und neue überdachte Parkplätze (mind. 3 Stellplätze, an Gebäude angrenzend)", "–"],
            ["1. 1. 2031", "bestehende öffentliche Gebäude", "über 250 m²"],
          ],
          minBreite: 640,
          fussnote: "Mindestleistung: PPV = BGF ÷ (charakteristische Länge × 150) kWp; bei Parkplätzen 1 kWp je Stellplatz auf der Ebene mit den meisten Stellplätzen. 1 kWp entspricht 1,40 m² Solarthermie.",
        },
        {
          typ: "p",
          text: "Die OIB-Formel ergibt bei kompakten Gebäuden eher kleine Pflichtgrößen: Eine Halle mit 3.000 m² BGF und einer charakteristischen Länge von 5 m käme rechnerisch auf 3.000 ÷ (5 × 150) = 4 kWp. Das Gebot ist damit vor allem ein Signal – die wirtschaftlich sinnvolle Anlage auf einem Hallendach liegt meist im Bereich mehrerer hundert kWp. Weitere Länder werden die OIB-Richtlinie 6:2025 voraussichtlich übernehmen; den aktuellen Stand veröffentlicht das OIB.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Rechenbeispiel: Gewerbeneubau mit 3.000 m² in drei Ländern",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: "**Dieselbe Halle führt je nach Bundesland zu sehr unterschiedlichen Mindestgrößen.** Annahmen: Neubau einer Produktions- und Lagerhalle mit 3.000 m² konditionierter Brutto-Grundfläche, eingeschoßig, eine Klimaanlage mit 40 kW Kühlleistung, charakteristische Länge 5 m.",
        },
        {
          typ: "tabelle",
          caption: "Mindest-PV für eine Gewerbehalle mit 3.000 m² BGF (Beispielrechnung), Stand September 2026",
          kopf: ["Land", "Rechenweg", "Mindestgröße"],
          zeilen: [
            ["Wien", "3.000 m² ÷ 100 m² × 1 kWp", "30 kWp"],
            ["Steiermark", "30 × 6 m² PV-Fläche", "180 m² Modulfläche, rund 35–40 kWp"],
            ["Niederösterreich", "Klimaanlage 40 kW × 2 m²; zusätzlich Solargebot nach § 66a Abs. 2", "mind. 80 m² Modulfläche, rund 16 kWp (plus ggf. Kühlbedarfsregel)"],
            ["Tirol (OIB-RL 6)", "3.000 ÷ (5 × 150)", "4 kWp"],
          ],
          markierteZeile: 0,
          minBreite: 600,
          fussnote: "Beispielrechnung mit angenommener Leistungsdichte von rund 0,2 kWp je m² Modulfläche. Maßgeblich sind die Nachweise im Energieausweis und in den Einreichunterlagen.",
        },
        {
          typ: "p",
          text: "Wirtschaftlich würde man auf diesem Dach meist 300 bis 500 kWp planen, wenn der Lastgang passt. Wie sich das rechnet, zeigen die Ratgeber [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe) und [Amortisation](/ratgeber/photovoltaik-amortisation).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Was Betriebe, Bauträger und Gemeinden jetzt tun sollten",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Pflicht früh im Entwurf prüfen:** Energieausweis, Dachstatik und Leitungswege so planen, dass die Anlage ohne Umbauten montiert werden kann.",
            "**Solar-ready bauen:** Auch ohne Pflicht verlangt etwa Oberösterreich, Dächer möglichst solartauglich auszuführen – Reserveflächen im Zählerschrank und Leerrohre kosten im Neubau wenig.",
            "**Brandschutz beachten:** Abstände zu Brandwänden, Rauchabzügen und Feuerwehrzugängen reduzieren die nutzbare Fläche – siehe [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz).",
            "**Netz rechtzeitig anfragen:** Größere Anlagen brauchen eine Netzanfrage, bevor die Pläne eingereicht werden – siehe [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
            "**Genehmigung klären:** Die Pflichtanlage ist Teil des Bauverfahrens; darüber hinausgehende Leistung kann elektrizitätsrechtlich relevant werden – siehe [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
            "**Öffentliche Gebäude:** Gemeinden sollten den Bestand ab 2028 systematisch erfassen – siehe [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Gibt es in Österreich eine bundesweite PV-Pflicht?",
      a: "Nein. PV-Pflichten regeln die Bundesländer in ihren Bauordnungen. Konkrete Mindestgrößen gibt es (Stand September 2026) in Wien, Niederösterreich, der Steiermark und – über die OIB-Richtlinie 6:2025 – in Tirol. Die EU-Gebäuderichtlinie verlangt ab 2027 schrittweise eine flächendeckende Umsetzung.",
    },
    {
      q: "Wie groß muss die PV-Anlage bei einem Neubau in Wien sein?",
      a: "Bei Nicht-Wohngebäuden mindestens 1 kWp je 100 m² konditionierter Brutto-Grundfläche, bei Wohngebäuden BGF ÷ (150 × charakteristische Länge) kWp, jeweils mindestens 1 kWp (§ 118e BO für Wien). Statt PV sind gleichwertige Systeme wie Solarthermie zulässig.",
    },
    {
      q: "Gilt die PV-Pflicht auch bei Sanierungen?",
      a: "Teilweise. Die Steiermark verlangt Solaranlagen auch bei größeren Renovierungen. Niederösterreich und das Solargebot der OIB-Richtlinie 6 erfassen ab 2028 bestehende Nicht-Wohngebäude über 500 m² bei größerer Renovierung oder genehmigungspflichtigen Arbeiten am Dach.",
    },
    {
      q: "Müssen Parkplätze mit PV überdacht werden?",
      a: "Ab 2030 gilt nach NÖ Bauordnung und OIB-Richtlinie 6 ein Solargebot für neue überdachte Parkplätze mit mindestens drei Stellplätzen, die an ein Gebäude angrenzen – 1 kWp je Stellplatz. Eine Pflicht, offene Parkplätze zu überdachen, besteht damit nicht.",
    },
    {
      q: "Welche Ausnahmen gibt es von der PV-Pflicht?",
      a: "Typisch sind Ausnahmen für denkmalgeschützte Gebäude und Schutzzonen, nicht konditionierte Gebäude, Bauwerke vorübergehenden Bestandes und Standorte, an denen die Anlage technisch oder wirtschaftlich nicht realisierbar ist – etwa bei geringer Einstrahlung oder unverhältnismäßigen Netzanschlusskosten.",
    },
    {
      q: "Zählt eine Solarthermieanlage für die Pflicht?",
      a: "In Wien, der Steiermark, Niederösterreich und nach der OIB-Richtlinie 6 ja. Die Umrechnung ist geregelt: 1 kWp PV entspricht 1,40 m² Kollektorfläche; in der Steiermark gelten 2 m² Solarthermie statt 6 m² PV bei Nicht-Wohngebäuden.",
    },
  ],

  passend: [
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "Photovoltaik-Genehmigung", text: "Bau- und Elektrizitätsrecht je Land." },
    { href: "/forderungen/baurecht", titel: "Baurecht", text: "PV im Bau- und Raumordnungsrecht." },
    { href: "/kommunen", titel: "PV für Gemeinden", text: "Öffentliche Gebäude und das Solargebot ab 2028." },
    { href: "/gewerbe", titel: "PV für Betriebe", text: "Neubau und Bestand wirtschaftlich planen." },
  ],

  quellen: [
    { titel: "Bauordnung für Wien, § 118e (geltende Fassung, jusline.at)", url: "https://www.jusline.at/gesetz/bo_fuer_wien/paragraf/118e", stand: "09/2026" },
    { titel: "NÖ Bauordnung 2014, § 66a Verpflichtung zur Errichtung von Solarenergieanlagen (jusline.at)", url: "https://www.jusline.at/gesetz/noe__bo_2014/paragraf/66a", stand: "09/2026" },
    { titel: "Steiermärkisches Baugesetz, § 80b (geltende Fassung, jusline.at)", url: "https://www.jusline.at/gesetz/stmk_baug/paragraf/80b", stand: "09/2026" },
    { titel: "Technische Bauvorschriften 2016 Tirol, §§ 33, 34 (jusline.at)", url: "https://www.jusline.at/gesetz/tbv_2016/gesamt", stand: "09/2026" },
    { titel: "OIB – OIB-Richtlinie 6, Ausgabe September 2025 (Solargebot)", url: "https://www.oib.or.at/wp-content/uploads/oib-rl_6_september_2025.pdf", stand: "09/2025" },
    { titel: "OIB – Übersicht OIB-Richtlinien und Inkrafttreten in den Ländern", url: "https://www.oib.or.at/kernaufgaben/oib-richtlinien/", stand: "09/2026" },
    { titel: "Richtlinie (EU) 2024/1275 über die Gesamtenergieeffizienz von Gebäuden, Art. 10", url: "https://eur-lex.europa.eu/eli/dir/2024/1275/oj", stand: "05/2024" },
    { titel: "Oö. Bautechnikgesetz 2013 (geltende Fassung, jusline.at)", url: "https://www.jusline.at/gesetz/ooe_bautg_2013/gesamt", stand: "09/2026" },
  ],

  seitenCta: { titel: "Neubau mit PV-Pflicht?", text: "Wir planen die Pflichtanlage – und prüfen, was wirtschaftlich mehr bringt.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Pflicht erfüllen – und die Dachfläche wirtschaftlich nutzen.",
    text: "Ökovolt Solartechnik plant PV-Anlagen für Neubauten und Bestand von Betrieben und Gemeinden in allen neun Bundesländern.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Baurecht im Überblick", href: "/forderungen/baurecht" },
  },
};

export default artikel;
