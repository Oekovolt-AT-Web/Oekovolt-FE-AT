// Ratgeber: Photovoltaik-Ertrag pro kWp – Regionen, Monate, Ausrichtung & Neigung
// Ertragsdaten: eigene Abfragen im EU-Tool PVGIS 5.3 (JRC), Datenbank PVGIS-SARAH3,
// Zeitraum 2005–2023, 1 kWp, 14 % Systemverluste, Neigung 35°, Süd, abgerufen 09/2026.
// Planungswerte des Solarrechners (ANNAHMEN) sind bewusst vorsichtiger und werden importiert.

import { ANNAHMEN, AUSRICHTUNGEN, NEIGUNGEN } from "@/data/solarrechner";

const n0 = (v) => Math.round(v).toLocaleString("de-DE");
const r10 = (v) => n0(Math.round(v / 10) * 10);
const pct = (v) => `${Math.round(v * 100)} %`;
const faktor = (liste, id) => liste.find((x) => x.id === id)?.faktor ?? 1;

// PVGIS 5.3: spezifischer Jahresertrag (kWh/kWp, Süd 35°) und horizontale Globalstrahlung (kWh/m²·a)
const STAEDTE = [
  ["Kiel", "Schleswig-Holstein", 956, 1039],
  ["Hamburg", "Hamburg", 955, 1047],
  ["Bremen", "Bremen", 963, 1058],
  ["Rostock", "Mecklenburg-Vorpommern", 997, 1078],
  ["Hannover", "Niedersachsen", 977, 1076],
  ["Berlin", "Berlin/Brandenburg", 1022, 1115],
  ["Münster", "NRW (Münsterland)", 989, 1090],
  ["Köln", "NRW (Rheinland)", 1003, 1106],
  ["Kassel", "Hessen (Nord)", 982, 1089],
  ["Leipzig", "Sachsen", 1041, 1142],
  ["Erfurt", "Thüringen", 1013, 1116],
  ["Frankfurt am Main", "Hessen (Süd)", 1043, 1167],
  ["Saarbrücken", "Saarland", 1046, 1176],
  ["Nürnberg", "Bayern (Franken)", 1032, 1158],
  ["Stuttgart", "Baden-Württemberg", 1090, 1208],
  ["Freiburg", "Baden-Württemberg (Süd)", 1077, 1190],
  ["München", "Bayern (Oberbayern)", 1097, 1211],
  ["Türkheim (Unterallgäu)", "Bayern (Schwaben)", 1107, 1230],
];

// PVGIS 5.3, Monatsertrag in kWh je kWp (Süd 35°)
const MONATE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const KIEL = [25, 41, 81, 118, 129, 127, 122, 111, 91, 62, 30, 19];
const KASSEL = [31, 50, 89, 115, 121, 122, 121, 112, 95, 65, 35, 26];
const TUERKHEIM = [44, 67, 100, 119, 121, 127, 130, 122, 104, 80, 50, 43];
const summe = (a) => a.reduce((x, y) => x + y, 0);
const winterAnteil = (a) => (a[10] + a[11] + a[0] + a[1]) / summe(a);
const sommerAnteil = (a) => summe(a.slice(3, 9)) / summe(a);

// PVGIS 5.3, Standort Kassel: relativer Jahresertrag zum Optimum (38° Süd = 100 %)
const AUSRICHTUNG_TAB = [
  ["0° (flach)", 85, 85, 85, 85, 85, 85],
  ["10°", 85, 90, 92, 90, 84, 77],
  ["20°", 83, 93, 97, 93, 83, 68],
  ["30°", 82, 94, 99, 94, 81, 59],
  ["40°", 79, 94, 100, 94, 78, 50],
  ["50°", 75, 92, 99, 92, 75, 41],
  ["60°", 71, 88, 95, 88, 70, 34],
  ["90° (Fassade)", 51, 67, 71, 66, 50, 20],
];

const artikel = {
  slug: "photovoltaik-ertrag-pro-kwp",
  title: "Photovoltaik-Ertrag pro kWp: Werte nach Region, Monat und Dach",
  seoTitle: "Photovoltaik Ertrag pro kWp 2026: Tabellen | Ökovolt",
  kurzTitel: "Ertrag pro kWp",
  description:
    "Photovoltaik-Ertrag pro kWp in Deutschland: 950 bis 1.100 kWh je kWp nach Region, Monatsverteilung und Ertragstabelle für Ausrichtung und Neigung – mit Rechenbeispielen.",
  excerpt:
    "Wie viel Strom erzeugt ein Kilowatt-Peak in Kiel, Kassel oder im Allgäu? Ertragswerte für 18 Standorte, die Verteilung über die Monate und eine Tabelle für jede Dachausrichtung.",
  hauptKeyword: "photovoltaik ertrag pro kwp",
  keywords: [
    "Photovoltaik Ertrag pro kWp",
    "kWh pro kWp Deutschland",
    "PV Ertrag pro Jahr",
    "Photovoltaik Ertrag pro Monat",
    "Spezifischer Ertrag Photovoltaik",
    "PV Ertrag Ausrichtung Neigung Tabelle",
    "Ertrag 10 kWp Anlage",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Kontakt/faqs.jpg",
  bildAlt: "Solarmodule vor blauem Himmel mit Wolken",
  badge: { wert: "950–1.100", text: "kWh je kWp pro Jahr auf einem Süddach in Deutschland (PVGIS)" },

  kurzFazit: [
    "**Ein Kilowatt-Peak (kWp) erzeugt in Deutschland auf einem gut ausgerichteten Dach rund 950 bis 1.100 kWh Strom im Jahr** – im Norden eher 950, im Süden bis 1.100 kWh.",
    `**Eine 10-kWp-Anlage liefert damit etwa 9.500 bis 11.000 kWh pro Jahr.** Unser Solarrechner plant vorsichtiger mit ${n0(ANNAHMEN.ertragProKwpSued)} kWh je kWp für ein Süddach.`,
    `**Ost- und Westdächer erreichen rund 80 bis 85 %** des Süd-Optimums, Norddächer mit 30° Neigung knapp 60 %. Die Neigung zwischen 20° und 50° ist fast egal.`,
    `**Rund 70 % des Jahresertrags entstehen von April bis September,** November bis Februar bringen zusammen nur etwa 15 %.`,
    "Einzelne Jahre schwanken wetterbedingt um etwa **±5 %** um den langjährigen Mittelwert.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie viel Ertrag bringt ein kWp in Deutschland?",
      tocLabel: "Kurzantwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein nach Süden ausgerichtetes, etwa 35° geneigtes und unverschattetes Hausdach erzeugt in Deutschland im langjährigen Mittel zwischen rund 950 kWh (Küste) und 1.100 kWh (Voralpenland) pro installiertem Kilowatt-Peak.** Das zeigen unsere Berechnungen mit dem EU-Werkzeug PVGIS für 18 Standorte. Diese Kennzahl heißt [spezifischer Ertrag](/wissen/lexikon#spezifischer-ertrag) oder Volllaststunden und ist die wichtigste Größe, um den Stromertrag einer Anlage abzuschätzen.",
        },
        {
          typ: "p",
          text: "Die Rechnung ist einfach: **Jahresertrag = Anlagenleistung in kWp × spezifischer Ertrag.** Eine 8-kWp-Anlage in Kassel mit rund 980 kWh je kWp erzeugt also etwa 7.850 kWh im Jahr. Über alle Dachanlagen in Deutschland – also auch schlecht ausgerichtete und verschattete – liegt der Durchschnitt niedriger: Laut Fraunhofer ISE kamen PV-Dachanlagen im Trendszenario der Übertragungsnetzbetreiber auf 922 Volllaststunden.",
        },
        {
          typ: "kennzahl",
          wert: `${n0(ANNAHMEN.ertragProKwpSued)} kWh/kWp`,
          titel: "Planungswert unseres Solarrechners (Süddach)",
          text: "Bewusst etwas unter den Simulationswerten für Süddeutschland: Verschmutzung, Schnee, kleine Verschattungen und Ausfallzeiten kosten in der Praxis einige Prozent. Für Norddeutschland sind rund 900 kWh je kWp eine vorsichtige Annahme.",
        },
      ],
    },
    {
      id: "regionen",
      titel: "Ertrag pro kWp nach Region: Tabelle für 18 Standorte",
      tocLabel: "Nach Region",
      bloecke: [
        {
          typ: "p",
          text: "**Je weiter südlich und je höher gelegen der Standort, desto höher ist der Ertrag.** Die [Globalstrahlung](/wissen/lexikon#globalstrahlung) – also die Sonnenenergie, die jährlich auf eine waagerechte Fläche trifft – liegt in Deutschland zwischen gut 1.000 und über 1.200 kWh je Quadratmeter. Der Unterschied zwischen Kiel und dem Allgäu beträgt beim Ertrag rund 15 %.",
        },
        {
          typ: "tabelle",
          caption: "Spezifischer Jahresertrag nach Standort, Süddach 35°, langjähriges Mittel 2005–2023",
          kopf: ["Standort", "Region", "Globalstrahlung (kWh/m²)", "Ertrag (kWh/kWp)", "10 kWp (kWh/Jahr)"],
          zeilen: STAEDTE.map(([stadt, region, ertrag, ghi]) => [stadt, region, r10(ghi), r10(ertrag), `ca. ${n0(Math.round(ertrag / 10) * 100)}`]),
          hervorheben: 3,
          minBreite: 680,
          fussnote: "Quelle: eigene Berechnung mit PVGIS 5.3 (Joint Research Centre der EU-Kommission), Strahlungsdatenbank SARAH-3, 14 % Systemverluste, Montage mit geringer Hinterlüftung, Horizontverschattung durch Gelände berücksichtigt. Gerundete Simulationswerte, keine Ertragsgarantie.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum nicht jedes sonnige Jahr gleich ist",
          text: "Laut PVGIS schwankt der Jahresertrag an einem Standort von Jahr zu Jahr mit einer Standardabweichung von etwa 4 bis 6 %. Ein Jahr mit 7 % weniger als im Mittel ist also kein Hinweis auf einen Defekt. Die Unterschiede zwischen den Regionen übertragen sich laut Fraunhofer ISE außerdem nicht 1:1 auf den Ertrag, weil Modultemperatur, Verschmutzung und Schneeauflage mitspielen.",
        },
      ],
    },
    {
      id: "monate",
      titel: "Wie verteilt sich der Ertrag über das Jahr?",
      tocLabel: "Nach Monat",
      bloecke: [
        {
          typ: "p",
          text: `**Von April bis September erzeugt eine Anlage in Deutschland rund ${pct(sommerAnteil(KASSEL))} ihres Jahresertrags, von November bis Februar nur etwa ${pct(winterAnteil(KASSEL))}.** Im Juni liefert ein kWp in Kassel rund ${KASSEL[5]} kWh, im Dezember nur ${KASSEL[11]} kWh – knapp ein Fünftel. Im Süden fällt der Winter etwas ertragreicher aus, weil die Sonne höher steht: In Türkheim bringt der Dezember mit ${TUERKHEIM[11]} kWh je kWp mehr als doppelt so viel wie in Kiel (${KIEL[11]} kWh).`,
        },
        {
          typ: "tabelle",
          caption: "Monatsertrag einer 10-kWp-Anlage (Süd, 35°) in kWh – Nord, Mitte und Süd im Vergleich",
          kopf: ["Monat", "Kiel", "Kassel", "Türkheim (Allgäu)", "Anteil am Jahr (Kassel)"],
          zeilen: [
            ...MONATE.map((m, i) => [m, n0(KIEL[i] * 10), n0(KASSEL[i] * 10), n0(TUERKHEIM[i] * 10), `${(Math.round((KASSEL[i] / summe(KASSEL)) * 1000) / 10).toLocaleString("de-DE")} %`]),
            ["**Jahr**", `**${n0(summe(KIEL) * 10)}**`, `**${n0(summe(KASSEL) * 10)}**`, `**${n0(summe(TUERKHEIM) * 10)}**`, "**100 %**"],
          ],
          hervorheben: 2,
          markierteZeile: 5,
          minBreite: 600,
          fussnote: "Quelle: eigene Berechnung mit PVGIS 5.3, Mittelwerte 2005–2023. Summen können durch Rundung der Monatswerte leicht abweichen.",
        },
        {
          typ: "p",
          text: "Für die Planung heißt das: Im Sommer entsteht fast immer ein Überschuss, im Winter reicht auch eine große Anlage nicht für den kompletten Bedarf. Wer eine [Wärmepumpe](/ratgeber/waermepumpe-mit-photovoltaik) betreibt, sollte das berücksichtigen – ihr Strombedarf ist im Winter am höchsten. Mehr zu den dunklen Monaten lesen Sie im Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).",
        },
      ],
    },
    {
      id: "ausrichtung",
      titel: "Ertrag nach Ausrichtung und Dachneigung",
      tocLabel: "Ausrichtung & Neigung",
      bloecke: [
        {
          typ: "p",
          text: "**Das Ertragsmaximum liegt in Deutschland bei Süd-Ausrichtung und etwa 35 bis 40° Neigung – es ist aber so flach, dass Abweichungen von 20 bis 30° kaum ins Gewicht fallen.** Ein Südost- oder Südwestdach erreicht über 90 %, ein Ost- oder Westdach mit üblicher Neigung rund 80 %. Die Tabelle zeigt den relativen Jahresertrag für einen Standort in der Mitte Deutschlands.",
        },
        {
          typ: "tabelle",
          caption: "Relativer Jahresertrag nach Dachneigung und Ausrichtung (Optimum = 100 %), Standort Kassel",
          kopf: ["Neigung", "Ost", "Südost", "Süd", "Südwest", "West", "Nord"],
          zeilen: AUSRICHTUNG_TAB.map(([neigung, ...werte]) => [neigung, ...werte.map((w) => `${w} %`)]),
          hervorheben: 3,
          markierteZeile: 3,
          minBreite: 560,
          fussnote: "Quelle: eigene Berechnung mit PVGIS 5.3, unverschattet. Optimum am Standort: 38° Süd mit rund 980 kWh/kWp. Weiter nördlich verschiebt sich das Optimum leicht zu steileren, weiter südlich zu flacheren Winkeln.",
        },
        {
          typ: "p",
          text: `Die Werte decken sich mit den Faktoren unseres [Solarrechners](/solarrechner): Er rechnet für Ost/West mit ${pct(faktor(AUSRICHTUNGEN, "ost-west"))}, für Südost/Südwest mit ${pct(faktor(AUSRICHTUNGEN, "suedost"))} und für Nord mit ${pct(faktor(AUSRICHTUNGEN, "nord"))} des Süd-Ertrags, bei flachen Dächern mit einem Abschlag auf ${pct(faktor(NEIGUNGEN, "flach"))} und bei sehr steilen Dächern auf ${pct(faktor(NEIGUNGEN, "steil"))}.`,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Weniger Ertrag heißt nicht weniger wirtschaftlich",
          text: "Ost-West-Anlagen erzeugen morgens und abends mehr Strom – genau dann, wenn viele Haushalte ihn brauchen. Ihre Mittagsspitze ist niedriger, sodass die 60-%-Einspeisegrenze kaum Ertrag kostet. Wann sich das rechnet, zeigt der Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
        },
      ],
    },
    {
      id: "einflussfaktoren",
      titel: "Was den Ertrag in der Praxis mindert",
      tocLabel: "Einflussfaktoren",
      bloecke: [
        {
          typ: "p",
          text: "**Neben Standort und Ausrichtung bestimmen Verschattung, Temperatur, Technik und Betrieb, wie viel von der Sonnenenergie tatsächlich als Strom ankommt.** Zusammengefasst werden diese Verluste in der [Performance Ratio](/wissen/lexikon#performance-ratio): Neue Anlagen erreichen laut Fraunhofer ISE im Jahresmittel 80 bis 90 %.",
        },
        {
          typ: "tabelle",
          caption: "Typische Einflussfaktoren auf den Jahresertrag",
          kopf: ["Faktor", "Typische Wirkung", "Was Sie tun können"],
          zeilen: [
            ["[Verschattung](/ratgeber/photovoltaik-verschattung) durch Bäume, Gauben, Kamine", "wenige bis über 20 %", "Module aussparen, Strings trennen, Optimierer an betroffenen Modulen"],
            ["Modultemperatur", "ca. 0,25–0,35 % Leistung je °C über 25 °C", "Hinterlüftung, Module mit niedrigem Temperaturkoeffizienten"],
            ["Verschmutzung, Schnee", "meist gering, bei flacher Neigung mehr", "Neigung über 15°, bei Bedarf Reinigung"],
            ["Wechselrichter & Kabel", "ca. 2–4 %", "effizienter Wechselrichter, kurze Leitungen"],
            ["Degradation der Module", "ca. 0,15–0,5 % pro Jahr", "Qualitätsmodule, Monitoring"],
            ["60-%-Einspeisegrenze", "je nach Ausrichtung und Eigenverbrauch ca. 1–9 %", "Eigenverbrauch mittags, Speicher, Smart Meter"],
            ["Ausfälle", "eine Woche Stillstand im Sommer kostet rund 3 % des Jahresertrags", "Monitoring mit Benachrichtigung"],
          ],
          minBreite: 680,
          fussnote: "Orientierungswerte. Degradation laut Fraunhofer ISE bei qualitätsgesicherten Anlagen im Mittel rund 0,15 % pro Jahr; unser Solarrechner rechnet vorsichtig mit 0,5 %. Abregelungsverluste nach HTW Berlin (Volleinspeisung ohne Speicher).",
        },
        {
          typ: "p",
          text: "Die Modultechnik selbst spielt eine kleinere Rolle als oft angenommen: Ein hoher Wirkungsgrad bringt vor allem mehr Leistung auf dieselbe Fläche. Unterschiede im Ertrag je kWp entstehen durch Temperatur- und Schwachlichtverhalten und liegen meist bei wenigen Prozent – mehr dazu im [Solarmodule-Vergleich](/ratgeber/solarmodule-vergleich).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Rechenbeispiel: Welchen Ertrag bringt meine Anlage?",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: "**So schätzen Sie den Ertrag Ihres Dachs in drei Schritten ab.** Beispiel: ein Einfamilienhaus bei Nürnberg mit Satteldach, eine Seite nach Südwest, 30° Neigung, Platz für 9 kWp.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Regionalwert wählen", "Aus der Standorttabelle: Nürnberg rund 1.030 kWh je kWp für ein optimales Süddach."],
            ["Dachfaktor ansetzen", "Südwest bei 30° Neigung: rund 94 % laut Ausrichtungstabelle – ergibt etwa 970 kWh je kWp."],
            ["Abschläge prüfen", "Keine nennenswerte Verschattung, gut hinterlüftet: kein zusätzlicher Abschlag. Bei einem Baum im Westen wären 3–5 % realistisch."],
            ["Hochrechnen", "9 kWp × 970 kWh/kWp ≈ 8.700 kWh im Jahr. Vorsichtig geplant (Solarrechner-Ansatz): 9 kWp × 1.000 × 95 % ≈ 8.550 kWh."],
          ],
        },
        {
          typ: "p",
          text: "Mit dem Ertrag allein ist die Wirtschaftlichkeit noch nicht beantwortet – entscheidend ist, wie viel davon Sie selbst verbrauchen. Welche Anlagengröße zu Ihrem Verbrauch passt, erklärt der Ratgeber [PV-Anlage: Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen); die finanzielle Seite beleuchtet [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).",
        },
        { typ: "tool", href: "/solarrechner", titel: "Ertrag und Ersparnis für Ihr Dach", text: "Anlagengröße, Ausrichtung, Neigung und Verbrauch eingeben – mit Autarkie und 20-Jahres-Cashflow.", label: "Zum Solarrechner" },
      ],
    },
    {
      id: "pruefen",
      titel: "Liefert meine Anlage genug? So prüfen Sie den Ertrag",
      tocLabel: "Ertrag prüfen",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Jahresertrag ablesen** (Wechselrichter-Portal oder Einspeise- plus Eigenverbrauchszähler) und durch die Modulleistung in kWp teilen.",
            "**Mit dem Erwartungswert vergleichen:** Regionalwert × Dachfaktor aus den Tabellen oben – oder eine eigene PVGIS-Berechnung.",
            "**Wetter berücksichtigen:** Abweichungen bis etwa ±7 % in einem einzelnen Jahr sind normal.",
            "**Monate vergleichen:** Liegt nur ein Monat stark darunter, deutet das auf einen Ausfall hin; liegen alle Monate darunter, eher auf Verschattung, Verschmutzung oder einen defekten String.",
            "**Liegt der Ertrag dauerhaft über 15 % unter der Erwartung,** sollte ein Fachbetrieb Strings, Wechselrichter und Module prüfen – etwa mit Kennlinienmessung oder Thermografie.",
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Wie viel kWh erzeugt 1 kWp im Jahr?", a: "In Deutschland auf einem gut ausgerichteten Dach etwa 950 bis 1.100 kWh. Im Norden sind es eher 950, in Süddeutschland bis 1.100 kWh. Ost-West-Dächer erreichen rund 80 bis 85 % davon." },
    { q: "Wie viel Strom erzeugt eine 10-kWp-Anlage pro Jahr?", a: "Bei Süd-Ausrichtung je nach Region etwa 9.500 bis 11.000 kWh, bei Ost-West rund 7.700 bis 9.300 kWh. Unser [Solarrechner](/solarrechner) rechnet vorsichtig mit 1.000 kWh je kWp für ein Süddach." },
    { q: "Wie viel Ertrag bringt eine PV-Anlage im Winter?", a: "Von November bis Februar entstehen zusammen nur rund 15 % des Jahresertrags. Im Dezember liefert ein kWp in der Mitte Deutschlands etwa 25 bis 30 kWh, im Juni rund 120 kWh." },
    { q: "Welche Dachneigung ist optimal für Photovoltaik?", a: "In Deutschland etwa 35 bis 40° bei Süd-Ausrichtung. Das Optimum ist flach: Zwischen 20 und 50° verliert ein Süddach höchstens rund 3 %." },
    { q: "Lohnt sich Photovoltaik auf einem Norddach?", a: "Bei flacher Neigung oft ja: Ein 10° geneigtes Norddach erreicht rund 77 % des Optimums, bei 30° sind es knapp 60 %. Ob sich das rechnet, hängt vor allem vom Eigenverbrauch ab." },
    { q: "Wie hoch ist die Performance Ratio einer guten PV-Anlage?", a: "Neue Anlagen erreichen laut Fraunhofer ISE im Jahresmittel eine Performance Ratio von 80 bis 90 %. Sie beschreibt, welcher Anteil der theoretisch möglichen Energie tatsächlich als Wechselstrom ankommt." },
    { q: "Warum weicht mein Ertrag von der Prognose ab?", a: "Häufige Gründe sind Wetterschwankungen (±5 % sind normal), Verschattung, Verschmutzung, Abregelung durch die Einspeisegrenze oder ein Ausfall. Ein Monatsvergleich im Monitoring zeigt meist schnell die Ursache." },
  ],

  passend: [
    { href: "/ratgeber/pv-anlage-groesse-berechnen", titel: "PV-Anlage: Größe berechnen", text: "Wie viel kWp Sie für Ihren Verbrauch brauchen." },
    { href: "/ratgeber/photovoltaik-ost-west", titel: "Photovoltaik Ost-West", text: "Weniger Ertrag, mehr Eigenverbrauch – wann es sich lohnt." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Ertrag und Wirtschaftlichkeit für Ihr Dach berechnen." },
    { href: "/energie-live", titel: "Energie live", text: "Aktuelle Solar- und Winderzeugung in Deutschland." },
  ],

  quellen: [
    { titel: "European Commission JRC – PVGIS 5.3 (Photovoltaic Geographical Information System)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland (Fassung 20.08.2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "08/2026" },
    { titel: "Deutscher Wetterdienst – Solarenergie und Globalstrahlung", url: "https://www.dwd.de/DE/leistungen/solarenergie/solarenergie.html", stand: "09/2026" },
    { titel: "Verbraucherzentrale Hamburg – Solarspitzen: Abregelungsverluste nach HTW Berlin", url: "https://www.vzhh.de/themen/bauen-immobilien-energie/erneuerbare-energien/solarspitzen-foerdergelder-neue-regeln-fuer-photovoltaikanlagen", stand: "09/2025" },
  ],

  seitenCta: { titel: "Wie viel bringt Ihr Dach?", text: "Ertrag, Autarkie und Amortisation mit Ihren Werten.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Wir berechnen den Ertrag für Ihr Dach – mit Verschattung.",
    text: "Tabellen geben eine gute Orientierung. Bäume, Gauben und Nachbargebäude erfasst erst die Planung vor Ort – daraus entsteht eine belastbare Ertragsprognose.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
