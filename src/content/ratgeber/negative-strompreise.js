// Ratgeber: Negative Strompreise in der Gebotszone Österreich
// Häufigkeiten, Solar-Marktwert und Beispielrechnung: eigene Auswertung der Day-Ahead-Preise
// (Gebotszone AT) und der Solarerzeugung Österreich aus der Energy-Charts-API
// (Fraunhofer ISE; Preisdaten CC BY 4.0), Abruf 28.09.2026. Stundenwerte = Mittel der
// Viertelstunden (Day-Ahead seit 01.10.2025 in 15-Minuten-Auflösung).
// Bewusst ohne Imports aus DE-Datenmodulen.

const NEG_STUNDEN = { 2023: 111, 2024: 307, 2025: 378, 2026: 259 }; // 2026: bis 27.09.
const NEG_TAGE = { 2024: 61, 2025: 80, 2026: 57 };
const TIEFST = { 2023: -500, 2024: -126, 2025: -253, 2026: -497 }; // €/MWh
const BASE = { 2023: 102.2, 2024: 81.9, 2025: 99.0, 2026: 121.3 }; // €/MWh Jahresmittel Day-Ahead AT
const SOLAR_MW = { 2024: 53.0, 2025: 49.3, 2026: 62.1 }; // €/MWh erzeugungsgewichtet
const SOLAR_ANTEIL_NEG = { 2024: 14, 2025: 21, 2026: 16 }; // % des PV-Stroms in Stunden mit negativem Preis
const SOLAR_MW_ABGEREGELT = { 2024: 55.6, 2025: 53.2, 2026: 66.7 }; // €/MWh je möglicher MWh, wenn in Negativstunden abgeregelt
const EREIGNISSE_6H = { 2024: 28, 2025: 31, 2026: 16 }; // Blöcke mit ≥ 6 aufeinanderfolgenden negativen Stunden
const MONATE = [
  ["Februar", 0, 4],
  ["März", 7, 14],
  ["April", 76, 83],
  ["Mai", 92, 69],
  ["Juni", 115, 50],
  ["Juli", 6, 23],
  ["August", 59, 6],
  ["September", 23, 10],
];
const MITTAG_ABEND = { 2025: [61.2, 139.2], 2026: [62.0, 171.7] }; // €/MWh 11–15 Uhr vs. 18–21 Uhr

// Beispiel Direktvermarktung
const KWP = 500;
const ERTRAG_KWP = 1050; // kWh/kWp, Annahme
const MWH = (KWP * ERTRAG_KWP) / 1000;

const de = (n, st = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: st, maximumFractionDigits: st });
const eur = (n) => de(Math.round(n)) + " €";
const ctv = (eurMwh) => de(eurMwh / 10, 2);
const spread = (y) => Math.round(MITTAG_ABEND[y][1] - MITTAG_ABEND[y][0]);

const erloesVoll = (y) => MWH * SOLAR_MW[y];
const erloesAbgeregelt = (y) => MWH * SOLAR_MW_ABGEREGELT[y];

const artikel = {
  slug: "negative-strompreise",
  title: "Negative Strompreise in Österreich: Ursachen, Zahlen und Folgen",
  seoTitle: "Negative Strompreise Österreich 2026 | Ökovolt",
  kurzTitel: "Negative Strompreise",
  description:
    "Negative Strompreise in Österreich: 378 Stunden 2025, bis Ende September 2026 bereits 259. Ursachen, Folgen für OeMAG, Direktvermarktung und Marktprämie.",
  excerpt:
    "Wie oft der Börsenpreis in der Gebotszone Österreich unter null fällt, warum das fast immer mittags passiert und was das für Betreiber von PV-Anlagen je Vermarktungsmodell bedeutet.",
  hauptKeyword: "negative strompreise österreich",
  keywords: [
    "negative Strompreise Österreich",
    "negative Strompreise 2026",
    "negative Strompreise Photovoltaik",
    "Gebotszone Österreich Day-Ahead",
    "negative Strompreise Marktprämie",
    "PV abregeln negative Preise",
    "negative Strompreise Direktvermarktung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/Kontakt/download-2.jpg",
  bildAlt: "Solarmodule im Vordergrund, Windräder im Abendlicht dahinter",
  badge: { wert: `${NEG_STUNDEN[2025]} h`, text: "mit negativem Day-Ahead-Preis in Österreich 2025" },

  kurzFazit: [
    `**Negative Strompreise sind in Österreich kein Ausnahmefall mehr:** In der Gebotszone AT war der Day-Ahead-Preis 2023 in ${NEG_STUNDEN[2023]} Stunden negativ, 2024 in ${NEG_STUNDEN[2024]}, 2025 in ${NEG_STUNDEN[2025]} und 2026 bis Ende September in ${NEG_STUNDEN[2026]} Stunden.`,
    "Über 90 % der negativen Stunden 2025 und 2026 lagen zwischen 10 und 17 Uhr – ausgelöst durch gleichzeitige PV-Mittagsspitzen in ganz Mitteleuropa.",
    `**Rund ${SOLAR_ANTEIL_NEG[2025]} % des österreichischen PV-Stroms wurden 2025 in Stunden mit negativem Preis erzeugt.** Der Marktwert von Solarstrom lag mit ${ctv(SOLAR_MW[2025])} ct/kWh nur bei etwa der Hälfte des mittleren Börsenpreises.`,
    "Wie stark eine Anlage betroffen ist, hängt vom Vermarktungsweg ab: Beim OeMAG-Marktpreis dämpft die 60-%-Untergrenze, in der Direktvermarktung lohnt Abregeln, die EAG-Marktprämie entfällt ab sechs negativen Stunden in Folge.",
    `In unserem Beispiel hätte das Abregeln in negativen Stunden einer 500-kWp-Anlage in der Direktvermarktung 2025 rund ${eur(erloesAbgeregelt(2025) - erloesVoll(2025))} Mehrerlös gebracht.`,
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was bedeutet ein negativer Strompreis?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein negativer Strompreis bedeutet, dass Verkäufer an der Strombörse für die Abnahme ihres Stroms bezahlen.** Gemeint ist der Großhandelspreis am Day-Ahead-Markt, auf dem Strom für den Folgetag gehandelt wird – für Österreich an der EPEX SPOT im europäischen Market Coupling und an der Wiener Börse EXAA. Österreich bildet seit 1. Oktober 2018 eine eigene [Gebotszone](/wissen/lexikon#gebotszone-at), getrennt von Deutschland, ist aber über starke Leitungen eng mit den Nachbarmärkten verbunden.",
        },
        {
          typ: "p",
          text: "Seit 1. Oktober 2025 wird der Day-Ahead-Markt in Viertelstunden abgerechnet. Negative Preise treten dadurch noch feiner aufgelöst auf: 2026 waren bis Ende September rund 1.000 Viertelstunden negativ. Für Unternehmen mit PV-Anlage ist das doppelt relevant – als Erzeuger sinkt der Wert des eingespeisten Stroms, als Verbraucher mit flexiblen Lasten eröffnen sich Chancen. Grundlagen zum Begriff finden Sie im [Lexikon](/wissen/lexikon#negative-strompreise).",
        },
        {
          typ: "kennzahl",
          wert: `${de((NEG_STUNDEN[2025] / 8760) * 100, 1)} %`,
          titel: "aller Stunden 2025 hatten in Österreich einen negativen Day-Ahead-Preis",
          text: `Das waren ${NEG_STUNDEN[2025]} Stunden an ${NEG_TAGE[2025]} Tagen. Der tiefste Stundenpreis lag bei ${de(TIEFST[2025])} €/MWh.`,
        },
      ],
    },
    {
      id: "zahlen",
      titel: "Wie oft gibt es negative Strompreise in Österreich?",
      tocLabel: "Zahlen 2023–2026",
      bloecke: [
        {
          typ: "p",
          text: `**Die Zahl der negativen Stunden hat sich in Österreich von ${NEG_STUNDEN[2023]} (2023) auf ${NEG_STUNDEN[2025]} (2025) mehr als verdreifacht.** 2026 lag der Wert bis Ende September bei ${NEG_STUNDEN[2026]} Stunden – weniger als im Vorjahr, weil das Preisniveau 2026 insgesamt höher war (Mittel bisher ${de(BASE[2026], 1)} €/MWh gegenüber ${de(BASE[2025], 1)} €/MWh im Jahr 2025).`,
        },
        {
          typ: "tabelle",
          caption: "Negative Day-Ahead-Preise in der Gebotszone Österreich, Stand September 2026",
          kopf: ["Jahr", "Stunden < 0 €/MWh", "Tage mit negativen Stunden", "Tiefster Preis", "Mittlerer Börsenpreis"],
          zeilen: [
            ["2023", String(NEG_STUNDEN[2023]), "–", `${de(TIEFST[2023])} €/MWh`, `${de(BASE[2023], 1)} €/MWh`],
            ["2024", String(NEG_STUNDEN[2024]), String(NEG_TAGE[2024]), `${de(TIEFST[2024])} €/MWh`, `${de(BASE[2024], 1)} €/MWh`],
            ["2025", String(NEG_STUNDEN[2025]), String(NEG_TAGE[2025]), `${de(TIEFST[2025])} €/MWh`, `${de(BASE[2025], 1)} €/MWh`],
            ["2026 (bis 27.9.)", String(NEG_STUNDEN[2026]), String(NEG_TAGE[2026]), `${de(TIEFST[2026])} €/MWh`, `${de(BASE[2026], 1)} €/MWh`],
          ],
          markierteZeile: 2,
          hervorheben: 1,
          minBreite: 640,
          fussnote: "Eigene Auswertung auf Basis Energy-Charts (Fraunhofer ISE), Day-Ahead-Preise Gebotszone AT. Stundenwert = Mittel der Viertelstundenpreise; gezählt sind Stunden mit Mittel unter 0 €/MWh. Die Tiefstwerte 2023 und 2026 liegen nahe der technischen Preisuntergrenze von −500 €/MWh.",
        },
        { typ: "h3", text: "Wann im Jahr negative Preise auftreten" },
        {
          typ: "p",
          text: "Negative Preise konzentrieren sich auf April bis Juni, wenn die Sonne hoch steht, Laufkraftwerke durch die Schneeschmelze viel Wasser führen und der Heizbedarf wegfällt. 2025 war der Juni der Spitzenmonat, 2026 der April.",
        },
        {
          typ: "tabelle",
          caption: "Stunden mit negativem Day-Ahead-Preis in Österreich nach Monaten, 2025 und 2026, Stand September 2026",
          kopf: ["Monat", "2025", "2026"],
          zeilen: MONATE.map(([m, a, b]) => [m, String(a), String(b)]),
          minBreite: 420,
          fussnote: "Eigene Auswertung auf Basis Energy-Charts. In den übrigen Monaten gab es 2025 und 2026 keine Stunde mit negativem Stundenmittel. 2026: Werte bis 27. September.",
        },
        {
          typ: "p",
          text: "Auch der Wochentag spielt mit: 2025 fielen rund 60 % der negativen Stunden auf Samstage und Sonntage, 2026 bisher rund 70 %. An Werktagen verbraucht die Industrie den Mittagsstrom, am Wochenende fehlt diese Last. Für Betriebe mit Wochenendstillstand heißt das: Gerade dann, wenn die eigene PV-Anlage am meisten überschüssig einspeist, ist der Strom an der Börse am wenigsten wert.",
        },
      ],
    },
    {
      id: "ursachen",
      titel: "Warum wird der Strompreis negativ?",
      tocLabel: "Ursachen",
      bloecke: [
        {
          typ: "p",
          text: "**Negative Preise entstehen, wenn das Stromangebot kurzfristig größer ist als Nachfrage, Speicher- und Exportmöglichkeiten – und ein Teil der Erzeuger trotzdem weiterproduziert.** In Österreich kommen mehrere Faktoren zusammen:",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "PV-Spitzen europaweit gleichzeitig", text: "Wenn in Österreich, Deutschland, Tschechien und Norditalien zugleich die Sonne scheint, sind auch die Nachbarmärkte überversorgt. Export entlastet dann kaum." },
            { titel: "Laufwasser im Frühsommer", text: "Die Schneeschmelze bringt viel Wasser, das Laufkraftwerke nicht speichern können. Diese Erzeugung trifft zeitlich mit dem PV-Maximum zusammen." },
            { titel: "Ost-West-Gefälle", text: "Ein großer Teil der PV-Leistung steht im Osten, die großen Pumpspeicher liegen im Westen. Leitungskapazitäten begrenzen, wie viel Überschuss dorthin fließen kann." },
            { titel: "Fehlende Preisreaktion", text: "Viele kleinere Anlagen speisen unabhängig vom Börsenpreis ein, weil ihr Vertrag keine Abregelung vorsieht oder die Technik fehlt. Auch manche Kraftwerke laufen aus technischen oder vertraglichen Gründen weiter." },
          ],
        },
        {
          typ: "p",
          text: "Die E-Control nennt in ihren Analysen dieselben Treiber: den Überschuss aus Wind und Sonne, unflexible Grundlastkraftwerke, begrenzte Speicherkapazitäten und Exportgrenzen. Mehr [Batteriegroßspeicher](/ratgeber/grossspeicher-bess), flexible Verbraucher und dynamische Tarife sind die naheliegenden Gegenmittel – sie wirken aber erst, wenn sie in relevanter Größe am Markt sind.",
        },
      ],
    },
    {
      id: "marktwert",
      titel: "Was negative Preise mit dem Wert von Solarstrom machen",
      tocLabel: "Solar-Marktwert",
      bloecke: [
        {
          typ: "p",
          text: `**Negative und sehr niedrige Mittagspreise drücken den Marktwert von Solarstrom auf rund die Hälfte des durchschnittlichen Börsenpreises.** 2025 erzielte PV-Strom in Österreich erzeugungsgewichtet ${de(SOLAR_MW[2025], 1)} €/MWh, der Durchschnittspreis aller Stunden lag bei ${de(BASE[2025], 1)} €/MWh. Fachleute nennen diesen Effekt Kannibalisierung: Je mehr PV gleichzeitig einspeist, desto weniger ist die einzelne Kilowattstunde wert.`,
        },
        {
          typ: "tabelle",
          caption: "Solar-Marktwert und Anteil des PV-Stroms in negativen Stunden, Gebotszone Österreich, Stand September 2026",
          kopf: ["Jahr", "Mittlerer Börsenpreis", "Solar-Marktwert", "Verhältnis", "PV-Strom in Negativstunden"],
          zeilen: [2024, 2025, 2026].map((y) => [
            y === 2026 ? "2026 (bis 27.9.)" : String(y),
            `${de(BASE[y], 1)} €/MWh`,
            `${de(SOLAR_MW[y], 1)} €/MWh`,
            `${de((SOLAR_MW[y] / BASE[y]) * 100)} %`,
            `${SOLAR_ANTEIL_NEG[y]} %`,
          ]),
          markierteZeile: 1,
          hervorheben: 2,
          minBreite: 640,
          fussnote: "Eigene Auswertung auf Basis Energy-Charts: Day-Ahead-Preise AT gewichtet mit der stündlichen Solarerzeugung Österreichs. Der Solar-Marktwert ist der Durchschnittserlös, den eine typische PV-Anlage bei vollständiger Einspeisung zum Spotpreis erzielt hätte.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum 2026 weniger negative Stunden hatte",
          text: "2026 lag das allgemeine Preisniveau deutlich höher als 2025, im August und September im Monatsmittel bei rund 148 bzw. 174 €/MWh. Ein höheres Preisniveau am Abend und in der Nacht erhöht den Wert von Flexibilität: Pumpspeicher und Batterien nehmen den billigen Mittagsstrom stärker auf. Die Zahl der Stunden allein sagt deshalb wenig über die Zukunft – das Mittagstief bleibt bestehen.",
        },
      ],
    },
    {
      id: "folgen",
      titel: "Folgen für PV-Betreiber: Es kommt auf den Vermarktungsweg an",
      tocLabel: "Folgen für Betreiber",
      bloecke: [
        {
          typ: "p",
          text: "**Wie stark negative Preise eine PV-Anlage treffen, hängt davon ab, wie der Überschuss verkauft wird.** Selbst verbrauchter Strom ist nie betroffen – er ersetzt Netzbezug zum vollen Preis. Beim eingespeisten Strom unterscheiden sich die Modelle deutlich:",
        },
        {
          typ: "tabelle",
          caption: "Wirkung negativer Day-Ahead-Preise je Vermarktungsweg in Österreich, Stand September 2026",
          kopf: ["Vermarktungsweg", "Was bei negativen Preisen passiert", "Was Sie tun können"],
          zeilen: [
            ["Eigenverbrauch", "nicht betroffen", "Verbrauch in die Mittagsstunden verlagern"],
            ["OeMAG-Marktpreis (< 500 kWp)", "Monatsmittel sinkt, aber Untergrenze von 60 % des Quartalsmarktpreises greift", "nichts nötig; die Untergrenze wirkte 2025 und 2026 im Sommer"],
            ["Einspeisetarif Stromhändler", "je Vertrag: fixer Preis, Nullvergütung oder negative Vergütung", "Vertragsklausel zu negativen Preisen prüfen"],
            ["Direktvermarktung (Spot)", "Einspeisung kostet Geld", "Anlage in negativen Viertelstunden abregeln"],
            ["EAG-Marktprämie", "keine Prämie für Zeiträume ab 6 aufeinanderfolgenden negativen Stunden", "abregeln, Speicher laden, Verbrauch verschieben"],
          ],
          minBreite: 720,
          fussnote: "Regel zur Marktprämie nach § 15 EAG in der zum Stand geltenden Fassung; eine Verschärfung wird politisch diskutiert. Keine Rechtsberatung – Vertragsdetails beim Abnehmer prüfen.",
        },
        {
          typ: "p",
          text: `Die Sechs-Stunden-Regel ist praktisch relevant: 2025 gab es in Österreich ${EREIGNISSE_6H[2025]} Blöcke mit mindestens sechs negativen Stunden in Folge, 2024 waren es ${EREIGNISSE_6H[2024]}, 2026 bisher ${EREIGNISSE_6H[2026]}. Die OeMAG-Untergrenze hat dagegen kleineren Anlagen in den Sommermonaten 2025 und 2026 einen stabilen Wert gesichert – Details im Ratgeber [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis). Einen Überblick über alle Wege, Überschuss zu verkaufen, bietet [Einspeisung für Betriebe](/einspeisung-gewerbe).`,
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Anders als in Deutschland",
          text: "In Deutschland entfällt für neue Anlagen seit 2025 die feste Einspeisevergütung in Zeiten mit negativem Preis. In Österreich gibt es für neue PV-Anlagen ohnehin keinen gesetzlich fixen Einspeisetarif; die Folgen negativer Preise ergeben sich aus dem OeMAG-Mechanismus, dem Händlervertrag oder den EAG-Regeln zur Marktprämie. Aktuelle Werte zeigt der Ratgeber [Einspeisetarif 2026](/ratgeber/einspeiseverguetung-2026).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: Abregeln lohnt sich in der Direktvermarktung",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Eine ${KWP}-kWp-Anlage in der Direktvermarktung hätte 2025 durch konsequentes Abregeln in negativen Stunden rund ${eur(erloesAbgeregelt(2025) - erloesVoll(2025))} mehr erlöst als bei durchgehender Einspeisung.** Die Rechnung vergleicht zwei Fahrweisen mit dem Erzeugungsprofil aller österreichischen PV-Anlagen und den tatsächlichen Day-Ahead-Preisen.`,
        },
        {
          typ: "tabelle",
          caption: `Beispiel ${KWP} kWp, Volleinspeisung in der Direktvermarktung: Erlös mit und ohne Abregelung, Stand September 2026`,
          kopf: ["Jahr", "Einspeisung immer", "Abregeln bei Preis < 0", "Unterschied"],
          zeilen: [2024, 2025, 2026].map((y) => [
            y === 2026 ? "2026 (bis 27.9., auf ein Jahr hochgerechnet)" : String(y),
            eur(erloesVoll(y)),
            eur(erloesAbgeregelt(y)),
            `+ ${eur(erloesAbgeregelt(y) - erloesVoll(y))}`,
          ]),
          markierteZeile: 1,
          hervorheben: 3,
          minBreite: 620,
          fussnote: `Annahmen: ${KWP} kWp × ${de(ERTRAG_KWP)} kWh/kWp = ${de(MWH)} MWh möglicher Jahresertrag, Erzeugungsprofil wie die gesamte österreichische PV-Erzeugung (Energy-Charts). Erlös = Spotpreis je Stunde, ohne Vermarktungsentgelt, Ausgleichsenergie und Steuern; 2026 mit dem bisherigen Mittel auf ein Jahr hochgerechnet. Abregelung in allen Stunden mit negativem Preis, Stundenwerte statt Viertelstunden (vereinfacht).`,
        },
        {
          typ: "p",
          text: "Der Mehrerlös klingt überschaubar, er entsteht aber ohne Investition, sofern die Anlage technisch steuerbar ist. Bei Eigenverbrauchsanlagen mit Überschusseinspeisung ist der Effekt kleiner, weil nur der Überschuss betroffen ist. Voraussetzung für das automatische Abregeln ist eine Fernsteuerung durch den Direktvermarkter oder ein lokaler [Parkregler](/technik/parkregler), der Sollwerte umsetzt und die Wirkleistungsvorgaben des Netzbetreibers einhält.",
        },
      ],
    },
    {
      id: "chancen",
      titel: "Chancen: Wie Unternehmen von negativen Preisen profitieren",
      tocLabel: "Chancen nutzen",
      bloecke: [
        {
          typ: "p",
          text: "**Unternehmen mit flexiblen Verbrauchern können negative und niedrige Mittagspreise als günstige Strombeschaffung nutzen.** Voraussetzung ist ein Stromvertrag, der die Börsenpreise weitergibt – etwa ein [dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich) oder eine spotbasierte Beschaffung – und eine Viertelstundenmessung.",
        },
        {
          typ: "liste",
          punkte: [
            `**Batteriespeicher:** mittags aus dem Netz oder der eigenen Anlage laden, abends entladen. Die mittlere Differenz zwischen Mittags- (11–15 Uhr) und Abendpreisen (18–21 Uhr) lag 2025 bei rund ${spread(2025)} €/MWh, 2026 bisher bei rund ${spread(2026)} €/MWh.`,
            "**Wärme und Kälte:** Wärmepumpen, Elektrokessel, Kühlhäuser und Warmwasserspeicher in die Mittagsstunden verschieben.",
            "**E-Flotte:** Firmenfahrzeuge mittags laden – siehe [PV-Überschussladen](/ratgeber/pv-ueberschussladen).",
            "**Prozesse:** verschiebbare Produktionsschritte wie Pumpen, Druckluft auf Vorrat oder Chargenprozesse.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Netzentgelte fallen trotzdem an",
          text: "Auch bei negativem Börsenpreis zahlen Sie für Netzbezug Netznutzungs- und Netzverlustentgelt, Abgaben und Umsatzsteuer. Gratis wird Strom daher nicht. Auf Netzebene 7 senkt der Sommer-Nieder-Arbeitspreis (1. April bis 30. September, 10 bis 16 Uhr) seit 2026 den Netz-Arbeitspreis um 20 %. Beim Laden von Speichern aus dem Netz sollten Sie außerdem den Leistungspreis im Blick behalten – siehe [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
        },
        {
          typ: "tool",
          href: "/rechner/dynamischer-stromtarif",
          titel: "Rechnet sich ein dynamischer Tarif für Sie?",
          text: "Verbrauch und flexible Lasten eingeben und abschätzen, was spotbasierte Preise bringen können.",
          label: "Zum Tarif-Rechner",
        },
      ],
    },
    {
      id: "technik",
      titel: "Technik: Was eine Anlage für negative Preise braucht",
      tocLabel: "Technik & Steuerung",
      bloecke: [
        {
          typ: "p",
          text: "**Damit eine PV-Anlage auf Preissignale reagieren kann, braucht sie Viertelstundenmessung, eine Fernsteuerschnittstelle und eine Regelung, die Vorgaben von Netzbetreiber und Vermarkter sauber priorisiert.** Bei Gewerbe- und Freiflächenanlagen übernimmt das meist ein Parkregler, der Wirkleistung, Blindleistung und Einspeisebegrenzungen am Netzanschlusspunkt steuert.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Smart Meter bzw. Lastprofilzähler mit Viertelstundenwerten am Zählpunkt",
            "Steuerbare Wechselrichter oder Parkregler mit Schnittstelle für Sollwerte des Direktvermarkters",
            "Priorisierung: Vorgaben des Netzbetreibers (Spitzenkappung, Wirkleistungsbegrenzung) vor Marktsignalen",
            "Eigenverbrauch hat Vorrang – abgeregelt wird nur die Einspeisung, nicht die Versorgung des Betriebs",
            "Monitoring, das Abregelzeiten und entgangene Erträge dokumentiert – etwa über [Energie Live](/energie-live) oder ein [SCADA-System](/technik/scada)",
          ],
        },
        {
          typ: "p",
          text: "Mit dem ElWG kommt zusätzlich eine gesetzliche Spitzenkappung: Netzbetreiber dürfen die Einspeisung begrenzen, jedoch nicht unter 70 % der Modulspitzenleistung. Auch diese Vorgabe muss die Anlagensteuerung umsetzen können. Mehr zu den technischen Anschlussregeln im Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss).",
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Ausblick: Werden negative Preise wieder seltener?",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Solange der PV-Ausbau schneller wächst als Speicher und flexible Nachfrage, bleiben negative Mittagspreise ein fester Bestandteil des Strommarkts.** Österreich hat 2024 rund 2,5 GWp PV zugebaut; der Bestand lag Ende 2024 bei rund 9,4 GWp. Gleichzeitig wachsen die dämpfenden Kräfte:",
        },
        {
          typ: "liste",
          punkte: [
            "Batteriespeicher im Heim-, Gewerbe- und Netzmaßstab – Ende 2024 waren in Österreich bereits rund 2,2 GWh nutzbare PV-Speicherkapazität installiert.",
            "Neue Netzentgelte ab 2027 mit Leistungspreis und zeitvariablen Arbeitspreisen, die Verbrauch in die Mittagsstunden lenken.",
            "Mehr steuerbare PV-Anlagen, die bei negativen Preisen automatisch abregeln.",
            "Der Viertelstundenmarkt, der Flexibilität feiner bewertet.",
          ],
        },
        {
          typ: "p",
          text: "Für die Planung einer neuen Anlage heißt das: Rechnen Sie mit einem Solar-Marktwert, der deutlich unter dem durchschnittlichen Börsenpreis liegt, und planen Sie Eigenverbrauch, Speicher und Steuerbarkeit von Anfang an mit. Überschüsse vermarkten wir auf Wunsch über unsere [Direktvermarktung](/service/direktvermarktung).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie oft gab es 2025 negative Strompreise in Österreich?",
      a: `Nach unserer Auswertung der Day-Ahead-Preise war der Strompreis in der Gebotszone Österreich 2025 in ${NEG_STUNDEN[2025]} Stunden an ${NEG_TAGE[2025]} Tagen negativ. 2024 waren es ${NEG_STUNDEN[2024]} Stunden, 2026 bis Ende September ${NEG_STUNDEN[2026]} Stunden.`,
    },
    {
      q: "Zu welcher Tageszeit sind Strompreise negativ?",
      a: "Fast ausschließlich mittags: 2025 lagen 96 % der negativen Stunden zwischen 10 und 17 Uhr. Besonders häufig sind sie an sonnigen Wochenenden und Feiertagen von April bis Juni.",
    },
    {
      q: "Bekomme ich bei negativen Strompreisen weniger Geld von der OeMAG?",
      a: "Negative Stunden senken den Monatsdurchschnitt, aus dem die OeMAG ihren Marktpreis berechnet. Der Wert darf aber nicht unter 60 % des Quartalsmarktpreises fallen (abzüglich des Ausgleichsenergie-Abzugs). Diese Untergrenze griff 2026 von April bis Juli.",
    },
    {
      q: "Muss ich meine PV-Anlage bei negativen Preisen abschalten?",
      a: "Eine allgemeine Pflicht gibt es nicht. In der Direktvermarktung ist Abregeln wirtschaftlich sinnvoll und oft vertraglich vorgesehen, bei der EAG-Marktprämie entfällt die Prämie ab sechs negativen Stunden in Folge. Unabhängig davon dürfen Netzbetreiber die Einspeisung nach dem ElWG begrenzen, jedoch nicht unter 70 % der Modulleistung.",
    },
    {
      q: "Wird Strom für Unternehmen bei negativen Preisen gratis?",
      a: "Nein. Auch bei negativem Börsenpreis fallen Netzentgelte, Abgaben und Umsatzsteuer an. Mit spotbasierter Beschaffung und flexiblen Verbrauchern sinken die Energiekosten in diesen Stunden aber deutlich.",
    },
    {
      q: "Lohnt sich ein Batteriespeicher wegen negativer Strompreise?",
      a: `Negative Preise allein tragen einen Speicher selten. Wirtschaftlich wird er meist durch die Kombination aus höherem Eigenverbrauch, Peak Shaving und Preisdifferenzen zwischen Mittag und Abend; diese lag 2025 im Mittel bei rund ${spread(2025)} €/MWh. Details im Ratgeber [Gewerbespeicher: Kosten](/ratgeber/gewerbespeicher-kosten).`,
    },
    {
      q: "Warum gab es 2026 weniger negative Stunden als 2025?",
      a: "Das allgemeine Preisniveau lag 2026 deutlich höher, und flexible Anlagen haben den Mittagsstrom stärker aufgenommen. Am Grundmuster ändert das nichts: Mittags ist Strom an sonnigen Tagen weiterhin am günstigsten.",
    },
  ],

  passend: [
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Überschuss steuerbar und marktgerecht verkaufen." },
    { href: "/technik/parkregler", titel: "Parkregler", text: "Einspeisung nach Netz- und Marktvorgaben steuern." },
    { href: "/ratgeber/oemag-marktpreis", titel: "OeMAG-Marktpreis", text: "Wie der Monatswert berechnet wird." },
    { href: "/ratgeber/grossspeicher-bess", titel: "Batteriegroßspeicher", text: "Wie Speicher den Mittagsüberschuss aufnehmen." },
  ],

  quellen: [
    { titel: "Energy-Charts (Fraunhofer ISE) – Day-Ahead-Preise Gebotszone Österreich (eigene Auswertung)", url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=AT", stand: "27.09.2026" },
    { titel: "Energy-Charts – Öffentliche Nettostromerzeugung Österreich, Solar (eigene Auswertung)", url: "https://www.energy-charts.info/charts/power/chart.htm?l=de&c=AT", stand: "27.09.2026" },
    { titel: "E-Control (Gastbeitrag bei Wiener Stadtwerke) – Entwicklung negativer Preise", url: "https://positionen.wienerstadtwerke.at/aktuelles/gastbeitrag-e-control-entwicklung-negativer-preise", stand: "abgerufen 09/2026" },
    { titel: "Oesterreichs Energie – Negative Strompreise", url: "https://oesterreichsenergie.at/aktuelles/neuigkeiten/detailseite/negative-strompreise", stand: "2024" },
    { titel: "OeMAG – Marktpreis (Monatswerte, Korridor)", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "09/2026" },
    { titel: "BMWET / FH Technikum Wien – PV-Batteriespeichersysteme, Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf", stand: "06/2025" },
  ],

  seitenCta: { titel: "Überschuss steuerbar machen?", text: "Direktvermarktung und Abregelung bei negativen Preisen aus einer Hand.", href: "/service/direktvermarktung", label: "Zur Direktvermarktung" },
  cta: {
    title: "Negative Preise einplanen statt hinnehmen.",
    text: "Wir planen PV-Anlagen mit Eigenverbrauch, Speicher und steuerbarer Einspeisung – inklusive Parkregler, Monitoring und Vermarktung des Überschusses.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Energie Live ansehen", href: "/energie-live" },
  },
};

export default artikel;
