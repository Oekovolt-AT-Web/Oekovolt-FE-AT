// Ratgeber: Photovoltaik und Verschattung
// Sonnenstände berechnet für 48,06° N (Türkheim) und 53,55° N (Hamburg),
// Studienwerte ZHAW EFFPVSHADE (2021–2024).

const artikel = {
  slug: "photovoltaik-verschattung",
  title: "Photovoltaik und Verschattung: Was Schatten kostet und was hilft",
  seoTitle: "Photovoltaik Verschattung: Verluste & Lösungen | Ökovolt",
  kurzTitel: "PV-Verschattung",
  description:
    "Photovoltaik trotz Verschattung? So wirken Schatten auf Module und Strings, was Bypass-Dioden, Schattenmanagement, Optimierer und Mikrowechselrichter wirklich bringen.",
  excerpt:
    "Ein Schornstein, ein Baum, eine Gaube: Schon kleine Schatten können überproportional Ertrag kosten. Wie das technisch passiert, welche Gegenmaßnahme wann lohnt – und was Studien zu Optimierern sagen.",
  hauptKeyword: "photovoltaik verschattung",
  keywords: ["Photovoltaik Verschattung", "PV-Anlage Teilverschattung", "Verschattung Solarmodule Ertragsverlust", "Leistungsoptimierer sinnvoll", "Bypass-Dioden Solarmodul", "Schattenmanagement Wechselrichter", "Mikrowechselrichter Verschattung"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Ratgeber/photovoltaik-verschattung.jpg",
  bildAlt: "Huawei-Leistungsoptimierer SUN2000-450W-P2 für Solarmodule, Produktfoto",
  badge: { wert: "≤ 5 %", text: "Jahres-Mehrertrag durch Optimierer in den ZHAW-Laborfällen" },

  kurzFazit: [
    "**Verschattung kostet oft mehr Ertrag, als die Schattenfläche vermuten lässt**, weil Solarzellen in Reihe geschaltet sind: Die schwächste Zelle bremst ihre ganze Zellgruppe.",
    "**Bypass-Dioden** in jedem Modul begrenzen den Schaden – ein kleiner Schatten legt meist nur ein Drittel des Moduls lahm, nicht den ganzen Strang.",
    "**Die wirksamste Maßnahme ist die Planung:** Schattenfreie Flächen belegen, Strings nach Verschattung trennen und einen Wechselrichter mit gutem Schattenmanagement wählen.",
    "**Leistungsoptimierer und Mikrowechselrichter** lohnen sich vor allem bei mittlerer bis starker Teilverschattung oder vielen Ausrichtungen. Eine Laborstudie der ZHAW fand in den untersuchten Fällen höchstens rund 5 % Jahres-Mehrertrag.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie stark schadet Verschattung einer PV-Anlage?",
      tocLabel: "Kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Das hängt weniger von der Größe des Schattens ab als davon, wo er fällt, wie lange er bleibt und wie die Anlage verschaltet ist.** Ein Blatt auf einer einzelnen Zelle kann ein Drittel eines Moduls abschalten; ein Schornsteinschatten, der morgens über mehrere Module wandert, kostet über das Jahr dagegen oft nur wenige Prozent. Dauerhafter Schatten durch hohe Bäume oder Nachbargebäude kann eine Anlage dagegen unwirtschaftlich machen.",
        },
        {
          typ: "p",
          text: "Wichtig ist die Unterscheidung zwischen **Einstrahlungsverlust** (auf die verschattete Fläche fällt weniger Licht – unvermeidbar) und **Mismatch-Verlust** (verschattete Zellen bremsen unverschattete – durch Technik und Planung beeinflussbar). Nur gegen den zweiten helfen Optimierer, Mikrowechselrichter oder geschickte Verschaltung.",
        },
        {
          typ: "kennzahl",
          wert: "3×",
          titel: "so lang wie hoch ist ein Schatten mittags im Dezember",
          text: "In Süddeutschland steht die Sonne am 21. Dezember mittags nur rund 18,5 Grad hoch. Ein Baum, der 10 Meter über die Dachfläche ragt, wirft dann einen rund 30 Meter langen Schatten – im Juni sind es knapp 5 Meter.",
        },
      ],
    },
    {
      id: "technik",
      titel: "Warum kleine Schatten große Wirkung haben",
      tocLabel: "Technik: Zellen, Dioden, Strings",
      bloecke: [
        {
          typ: "p",
          text: "**Solarzellen sind in Reihe geschaltet, und in einer Reihenschaltung bestimmt das schwächste Glied den Strom.** Ein typisches Modul besteht aus 108 bis 144 Halbzellen, die elektrisch in drei Zellgruppen aufgeteilt sind. Mehrere Module bilden einen [String](/wissen/lexikon#string), der am [MPP-Tracker](/wissen/lexikon#mpp-tracker) des Wechselrichters angeschlossen ist.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Zelle verschattet", "Die Zelle erzeugt weniger Strom. Die übrigen Zellen der Gruppe drücken Strom durch sie hindurch – sie wird zum Verbraucher und erwärmt sich (Hotspot-Gefahr)."],
            ["Bypass-Diode schaltet", "Sobald die Zellgruppe genug bremst, leitet die Bypass-Diode in der Anschlussdose den Strom an ihr vorbei. Das Modul arbeitet mit zwei Dritteln weiter."],
            ["String arbeitet weiter", "Der String verliert die Spannung der überbrückten Gruppe, sein Strom bleibt aber hoch. Die Leistungskurve bekommt dadurch mehrere Spitzen."],
            ["Wechselrichter sucht das Maximum", "Ein guter MPP-Tracker scannt die gesamte Kennlinie und findet das globale Leistungsmaximum. Ein einfacher Tracker kann auf einer lokalen, niedrigeren Spitze hängen bleiben."],
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Rechenbeispiel: ein Schornsteinschatten",
          text: "Ein String aus 20 Modulen hat 60 Zellgruppen. Legt der Schatten eines Schornsteins bei einem Modul eine Zellgruppe lahm, fehlen dem String rechnerisch rund 1/60 seiner Leistung – knapp 2 % für die Dauer des Schattens. Ohne Bypass-Diode müsste der ganze String auf den Strom der verschatteten Zelle heruntergehen. Deshalb sind Dioden Pflichtausstattung jedes Moduls.",
        },
        {
          typ: "p",
          text: "Die Einbaulage spielt mit: Bei vielen [Halbzellenmodulen](/wissen/lexikon#halbzellen) sind obere und untere Modulhälfte innerhalb jeder Zellgruppe parallel geschaltet. Trifft ein Schatten nur die untere Modulkante, bleibt so oft rund die Hälfte der Leistung erhalten. Auf Flachdächern mit Reihenverschattung werden Module dagegen häufig quer montiert, damit der flache Schatten zuerst nur eine der drei Zellgruppen trifft. Mehr zu Zelltechnologien im [Solarmodule-Vergleich](/ratgeber/solarmodule-vergleich).",
        },
      ],
    },
    {
      id: "schattenquellen",
      titel: "Welche Schattenquellen gibt es?",
      tocLabel: "Schattenquellen",
      bloecke: [
        {
          typ: "tabelle",
          caption: "Arten der Verschattung und ihre typische Wirkung",
          kopf: ["Art", "Beispiele", "Typische Wirkung", "Was hilft"],
          zeilen: [
            ["Temporär", "Laub, Schnee, Vogelkot, Staub", "zeitweise, oft einzelne Zellen", "Neigung, Kontrolle über Monitoring, bei Bedarf Reinigung"],
            ["Gebäudeeigen", "Schornstein, Gaube, Satellitenschüssel, Lüfter, Blitzfangstange", "wandernder Schatten über wenige Module", "Belegung anpassen, Anbauteile versetzen, String-Aufteilung"],
            ["Umgebung", "Bäume, Nachbarhäuser, Masten, Berge", "saisonal, im Winter deutlich stärker", "Verschattungsanalyse, ggf. Flächen weglassen"],
            ["Eigenverschattung", "aufgeständerte Modulreihen auf dem Flachdach", "morgens, abends und im Winter", "Reihenabstand, flacher Winkel, Ost-West"],
          ],
          minBreite: 720,
        },
        {
          typ: "p",
          text: "Besonders tückisch ist die **saisonale Verschattung**: Bei der Besichtigung im Sommer ist das Dach frei, im Winter liegt es halb im Schatten. Wie tief die Sonne steht, zeigt die Tabelle. Auch **Baumwachstum** über 25 Jahre Anlagenlaufzeit und mögliche Neubauten laut Bebauungsplan gehören in die Planung.",
        },
        {
          typ: "tabelle",
          caption: "Sonnenhöhe mittags und Schattenlänge eines Hindernisses, das 10 m über die Dachfläche ragt",
          kopf: ["Datum", "Süddeutschland (48° N)", "Norddeutschland (53,5° N)"],
          zeilen: [
            ["21. Juni", "65° – Schatten 4,6 m", "60° – Schatten 5,8 m"],
            ["20. März / 22. September", "42° – Schatten 11 m", "36,5° – Schatten 13,5 m"],
            ["21. Dezember", "18,5° – Schatten 30 m", "13° – Schatten 43 m"],
          ],
          hervorheben: 1,
          minBreite: 520,
          fussnote: "Eigene Berechnung (12 Uhr Sonnenzeit). Morgens und abends ist der Schatten deutlich länger. Im Winter ist der Ertrag ohnehin gering, deshalb wiegt Winterschatten weniger schwer als Schatten im Frühjahr und Sommer.",
        },
      ],
    },
    {
      id: "massnahmen",
      titel: "Was hilft gegen Verschattung? Die Maßnahmen im Vergleich",
      tocLabel: "Maßnahmen im Vergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Die Reihenfolge lautet: erst vermeiden, dann klug verschalten, erst dann Zusatzelektronik.** Jede Stufe ist günstiger und robuster als die nächste.",
        },
        {
          typ: "tabelle",
          caption: "Maßnahmen gegen Verschattungsverluste",
          kopf: ["Maßnahme", "Wirkung", "Nachteile", "Sinnvoll bei"],
          zeilen: [
            ["Schattenfreie Belegung", "vermeidet Verluste vollständig", "weniger Module", "jedem Dach als erster Schritt"],
            ["Strings nach Verschattung trennen", "verschattete Module bremsen unverschattete nicht", "Wechselrichter mit mehreren MPP-Trackern nötig", "Teilflächen mit unterschiedlichem Schatten oder Ausrichtung"],
            ["Wechselrichter mit Schattenmanagement", "findet globales Leistungsmaximum bei mehreren Kennlinienspitzen", "hilft nicht gegen Mismatch innerhalb des Strings", "leichter bis mittlerer Verschattung – heute Standard vieler Geräte"],
            ["Leistungsoptimierer", "jedes Modul arbeitet im eigenen Optimum, Überwachung je Modul", "Mehrkosten, Eigenverbrauch der Geräte, mehr Bauteile auf dem Dach", "mittlerer bis starker Teilverschattung, vielen Teilflächen"],
            ["Mikrowechselrichter", "jedes Modul völlig unabhängig, keine DC-Hochspannung im String", "Mehrkosten, viele Geräte auf dem Dach, Speicheranbindung AC-seitig", "kleinen, stark zerklüfteten Dächern"],
          ],
          minBreite: 760,
        },
        { typ: "h3", text: "Wechselrichter mit Schattenmanagement" },
        {
          typ: "p",
          text: "Moderne [Wechselrichter](/wissen/lexikon#wechselrichter) tasten die Kennlinie jedes MPP-Trackers in regelmäßigen Abständen vollständig ab, um bei Teilverschattung das globale statt eines lokalen Maximums zu treffen – Fronius nennt die Funktion etwa Dynamic Peak Manager, andere Hersteller haben vergleichbare Verfahren. Solche Funktionen sind im Gerät integriert und kommen ohne zusätzliche Bauteile auf dem Dach aus. Was bei der Auswahl sonst zählt, lesen Sie im Ratgeber [Wechselrichter für Photovoltaik](/ratgeber/wechselrichter-photovoltaik).",
        },
        { typ: "h3", text: "Leistungsoptimierer" },
        {
          typ: "p",
          text: "[Leistungsoptimierer](/wissen/lexikon#leistungsoptimierer) sind kleine DC/DC-Wandler unter jedem Modul. Sie entkoppeln das Modul vom String, liefern Leistungsdaten je Modul und können die Modulspannung im Notfall abschalten. Bei einigen Systemen genügt es, nur die verschatteten Module auszustatten; andere Systeme brauchen einen Optimierer an jedem Modul – hier gelten die Freigaben des Wechselrichter-Herstellers.",
        },
        { typ: "h3", text: "Mikrowechselrichter" },
        {
          typ: "p",
          text: "Mikrowechselrichter wandeln den Strom schon am Modul in Wechselstrom. Das ist bei kleinen, stark verwinkelten Dächern mit vielen Ausrichtungen elegant, bedeutet aber viele Elektronikbauteile unter den Modulen. Soll später ein Speicher dazukommen, wird er wechselstromseitig angebunden ([AC-Kopplung](/wissen/lexikon#ac-kopplung)).",
        },
      ],
    },
    {
      id: "studien",
      titel: "Was bringen Optimierer wirklich? Das sagt die Forschung",
      tocLabel: "Studienlage",
      bloecke: [
        {
          typ: "p",
          text: "**Unabhängige Messungen zeigen deutlich kleinere Mehrerträge durch Optimierer, als Werbeaussagen und manche Planungsprogramme versprechen.** Die Zürcher Hochschule für Angewandte Wissenschaften (ZHAW) hat im Projekt EFFPVSHADE (2021 bis 2024) kommerzielle Optimierer und herkömmliche Wechselrichter im Labor vermessen und die Ergebnisse auf typische Verschattungssituationen von Wohndächern hochgerechnet.",
        },
        {
          typ: "checkliste",
          punkte: [
            "In allen untersuchten Fällen lag der **zusätzliche Jahresertrag durch Optimierer bei höchstens rund 5 %**.",
            "Für ein stark verschattetes Dach sagten die Planungsprogramme PVsyst und PV*SOL **+7,2 % bzw. +14,6 %** voraus – die ZHAW-Simulation auf Basis der Labormessungen ergab **+2,2 %**.",
            "Ursache: Datenblätter bilden lastabhängige Verluste der Optimierer nicht vollständig ab.",
            "**Sinnvoll** sind Optimierer laut Studie bei **mittlerer bis starker Verschattung** in Wohngebieten oder bei **kleinen Anlagen mit mehreren Ausrichtungen**.",
            "Bei **wenig oder keiner Verschattung** und höchstens zwei Ausrichtungen können sie wegen ihres Eigenverbrauchs sogar **weniger Ertrag** bringen.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Vorsicht bei „bis zu 25 % oder 30 % mehr Ertrag“",
          text: "Solche Werte beziehen sich auf ungünstige Einzelsituationen oder Vergleiche mit veralteter Technik, nicht auf ein typisches Jahr. Lassen Sie sich im Angebot zeigen, mit welchem Verschattungsmodell der Mehrertrag berechnet wurde.",
        },
        {
          typ: "p",
          text: "Optimierer haben neben dem Ertrag weitere Argumente: **Überwachung je Modul** erleichtert die Fehlersuche, und die **Abschaltung der Modulspannung** kann bei Arbeiten oder im Brandfall die Gleichspannung auf dem Dach reduzieren. In Deutschland ist das für Wohngebäude nicht vorgeschrieben, kann aber ein Kriterium sein. Wie Monitoring im Betrieb hilft, erklärt der Ratgeber [PV-Reinigung und Wartung](/ratgeber/photovoltaik-reinigung-wartung).",
        },
      ],
    },
    {
      id: "planung",
      titel: "So planen Sie eine Anlage auf einem teilverschatteten Dach",
      tocLabel: "Planung",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Schatten erfassen", "Vor Ort Hindernisse aufnehmen: Höhe, Abstand und Himmelsrichtung von Bäumen, Gebäuden, Schornsteinen und Anbauteilen. Fotos zu verschiedenen Tageszeiten helfen."],
            ["Simulieren", "Mit 3D-Planungssoftware oder einem Horizontprofil den Schattenverlauf über das ganze Jahr berechnen. PVGIS erlaubt einen einfachen Horizont-Check."],
            ["Belegung optimieren", "Dauerhaft verschattete Bereiche freilassen. Ein Modul weniger ist oft wirtschaftlicher als ein Modul, das den String bremst."],
            ["Verschaltung festlegen", "Module mit ähnlicher Verschattung und Ausrichtung auf denselben MPP-Tracker legen."],
            ["Elektronik gezielt einsetzen", "Nur dort Optimierer oder Mikrowechselrichter vorsehen, wo die Simulation einen klaren Mehrertrag zeigt."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Anbauteile verlegen",
          text: "Satellitenschüsseln, Antennen oder ungenutzte Schornsteinköpfe lassen sich oft günstig versetzen oder zurückbauen. Das bringt dauerhaft mehr als jede Elektronik. Auch ein Rückschnitt von Bäumen kann sich lohnen – bei geschützten Bäumen vorher die Baumschutzsatzung der Gemeinde prüfen.",
        },
        {
          typ: "p",
          text: "Liegt ein großer Teil des Daches im Schatten, lohnt der Blick auf andere Flächen: Ost- oder Westdächer, eine [Flachdach-Garage](/ratgeber/photovoltaik-flachdach) oder ein [Solarcarport](/ratgeber/solarcarport). Ob sich die Anlage insgesamt rechnet, prüfen Sie mit dem Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).",
        },
        { typ: "tool", href: "/solarrechner", titel: "Grobe Wirtschaftlichkeit prüfen", text: "Der Solarrechner rechnet ohne Verschattung – ziehen Sie für betroffene Flächen einen Abschlag ab oder lassen Sie das Dach simulieren.", label: "Zum Solarrechner" },
      ],
    },
    {
      id: "partner",
      titel: "Herstellerneutral planen",
      tocLabel: "Herstellerwahl",
      bloecke: [
        {
          typ: "p",
          text: "**Ob Schattenmanagement im Wechselrichter reicht oder Optimierer nötig sind, entscheidet das Dach – nicht die Marke.** Ökovolt ist Partner von Huawei, Fronius, Solis und Sigenergy und plant mit Wechselrichtern, Optimierern und Speichern verschiedener Hersteller. Grundlage ist immer die Verschattungsanalyse Ihrer Dachflächen.",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie viel Ertrag kostet Verschattung bei einer PV-Anlage?", a: "Das reicht von unter einem Prozent bei einem kurzen Schornsteinschatten bis zu einem Großteil des Ertrags bei dauerhaftem Schatten durch Bäume oder Gebäude. Eine pauschale Zahl gibt es nicht – belastbar ist nur eine Simulation mit den Hindernissen Ihres Daches." },
    { q: "Lohnt sich eine PV-Anlage bei Teilverschattung?", a: "Oft ja, wenn die verschatteten Bereiche frei bleiben oder der Schatten nur wenige Stunden am Tag auftritt. Kritisch wird es, wenn große Teile des Daches von Frühjahr bis Herbst im Schatten liegen." },
    { q: "Sind Leistungsoptimierer sinnvoll?", a: "Bei mittlerer bis starker Teilverschattung oder vielen Teilflächen können sie den Ertrag steigern. Die ZHAW fand in Laborfällen höchstens rund 5 % Jahres-Mehrertrag; bei unverschatteten Dächern können sie wegen ihres Eigenverbrauchs sogar schlechter abschneiden." },
    { q: "Was ist besser bei Verschattung: Optimierer oder Mikrowechselrichter?", a: "Beide entkoppeln die Module. Optimierer arbeiten mit einem zentralen Wechselrichter und lassen sich gut mit DC-gekoppelten Speichern kombinieren. Mikrowechselrichter eignen sich für kleine, verwinkelte Dächer; ein Speicher wird dann wechselstromseitig angebunden." },
    { q: "Was machen Bypass-Dioden im Solarmodul?", a: "Sie leiten den Strom an einer verschatteten oder defekten Zellgruppe vorbei. So fällt nur ein Teil des Moduls aus, und der String arbeitet weiter. Außerdem schützen sie verschattete Zellen vor Überhitzung." },
    { q: "Schadet Verschattung den Solarmodulen?", a: "Kurzzeitiger Schatten nicht. Dauerhaft verschattete Zellen können sich aber stark erwärmen (Hotspots), besonders wenn eine Bypass-Diode defekt ist. Auffällige Module lassen sich per Thermografie finden." },
    { q: "Hilft ein Stromspeicher gegen Verschattung?", a: "Nein. Ein Speicher verschiebt vorhandenen Solarstrom in den Abend, erzeugt aber keinen zusätzlichen. Gegen Verschattung helfen Belegung, Verschaltung und gegebenenfalls Modulelektronik." },
  ],

  passend: [
    { href: "/ratgeber/wechselrichter-photovoltaik", titel: "Wechselrichter für Photovoltaik", text: "String, Hybrid, Mikro – Auslegung und Kosten." },
    { href: "/ratgeber/solarmodule-vergleich", titel: "Solarmodule im Vergleich", text: "Zelltechnik, Halbzellen, Glas-Glas und Garantien." },
    { href: "/ratgeber/photovoltaik-flachdach", titel: "Photovoltaik auf dem Flachdach", text: "Aufständerung, Reihenabstand und Statik." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Mit Verschattungsanalyse Ihres Daches." },
  ],

  quellen: [
    { titel: "ZHAW – EFFPVSHADE: Effizienzanalyse von dezentraler Photovoltaik-Leistungselektronik bei Teilbeschattung", url: "https://www.zhaw.ch/de/forschung/projekt/72880", stand: "09/2026" },
    { titel: "1000 Sonnendächer – Was können Optimizer bei PV-Anlagen wirklich leisten? (Zusammenfassung der ZHAW-Ergebnisse)", url: "https://1000-sonnen-daecher.ch/Optimierer", stand: "09/2026" },
    { titel: "Fronius – Dynamic Peak Manager: Schattenmanagement im Wechselrichter", url: "https://www.fronius.com/de-de/germany/solarenergie/installateure-partner/produkte-loesungen/features/dynamic-peak-manager", stand: "09/2026" },
    { titel: "Huawei – SUN2000-450W-P2 Smart PV Optimizer, Produktseite", url: "https://solar.huawei.com/en/products/sun2000-450w-p2-600w-p/", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Photovoltaik: Was bei der Planung einer Solaranlage wichtig ist", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-bei-der-planung-einer-solaranlage-wichtig-ist-5574", stand: "09/2026" },
    { titel: "Joint Research Centre der EU-Kommission – PVGIS mit Horizontberücksichtigung", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Schatten auf dem Dach?", text: "Wir simulieren den Schattenverlauf übers Jahr.", href: "/angebot", label: "Angebot anfragen" },
  cta: {
    title: "Wir analysieren die Verschattung Ihres Daches.",
    text: "Vor-Ort-Aufnahme, Simulation übers ganze Jahr und eine Verschaltung, die zu Ihrem Dach passt – mit Optimierern nur dort, wo sie sich rechnen.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
