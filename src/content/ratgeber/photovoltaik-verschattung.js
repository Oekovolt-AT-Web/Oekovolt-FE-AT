// Ratgeber: Photovoltaik und Verschattung – Hallendach, Alpenraum, Planung (Österreich)
// Horizontverschattung: PVGIS 5.3, Neigung 35° Süd, mit/ohne Geländehorizont (usehorizon=1/0), Abfrage 28.09.2026.
// Sonnenhöhe 21.12. Mittag Linz (48,3° N): 90° − 48,3° − 23,44° ≈ 18,3°; Schattenlänge = Höhe / tan(18,3°) ≈ 3,0 × Höhe.

const HORIZONT = [
  // [Ort, Jahr mit Horizont, Jahr ohne, Dez mit, Dez ohne]
  ["Linz", 1141, 1142, 39.1, 39.1],
  ["Innsbruck", 1361, 1383, 64.8, 71.2],
  ["Bad Gastein", 1072, 1205, 40.3, 62.1],
  ["Lech am Arlberg", 1067, 1196, 22.0, 49.0],
  ["Hallstatt", 926, 1099, 14.6, 53.7],
];

const verlust = (mit, ohne) => (ohne - mit <= 0.5 ? "0 %" : "−" + String(Math.round(((ohne - mit) / ohne) * 100)) + " %");
const f0 = (x) => Math.round(x).toLocaleString("de-AT");

const artikel = {
  slug: "photovoltaik-verschattung",
  title: "Photovoltaik und Verschattung: Ursachen, Verluste, Lösungen",
  seoTitle: "PV-Verschattung: Verluste & Lösungen | Ökovolt",
  kurzTitel: "PV-Verschattung",
  description:
    "Verschattung bei Photovoltaik: Berge, Lichtkuppeln, Kamine und Modulreihen – Horizontverluste von Linz bis Hallstatt, Bypassdioden, Strings und Optimierer.",
  excerpt:
    "Ein Kamin, eine Lichtkuppel oder ein Berg im Süden: Verschattung kostet mehr Ertrag, als ihre Fläche vermuten lässt. Wie Sie Verluste beziffern und durch Planung, Stringaufteilung und Leistungselektronik begrenzen.",
  hauptKeyword: "photovoltaik verschattung",
  keywords: [
    "Photovoltaik Verschattung",
    "Teilverschattung Solarmodul",
    "Bypassdiode Verschattung",
    "Horizontverschattung Berge Photovoltaik",
    "Leistungsoptimierer Verschattung",
    "Verschattungsanalyse PV",
    "Lichtkuppel Verschattung Hallendach",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Ratgeber/photovoltaik-verschattung.jpg",
  bildAlt: "Huawei-Leistungsoptimierer SUN2000-450W-P2 für Solarmodule, Produktfoto",
  badge: { wert: "−55 %", text: "Dezember-Ertrag in Lech durch Bergschatten (PVGIS)" },

  kurzFazit: [
    "**Verschattung senkt den Ertrag einer PV-Anlage oft überproportional: Schon ein beschatteter Zellbereich kann über die Bypassdiode ein Drittel eines Moduls abschalten und in schlecht geplanten Strings weitere Module ausbremsen.**",
    "Im Alpenraum ist der **Berghorizont** der größte Faktor: Laut PVGIS verliert eine Südanlage in Hallstatt **16 %** des Jahresertrags durch die umliegenden Berge, in Lech und Bad Gastein **11 %**. Im Dezember sind es in Lech **55 %**, in Hallstatt **73 %**.",
    "Auf Hallendächern verschatten **Lichtkuppeln, Lüftungsanlagen, Attiken und Nachbarreihen**. In Linz ist ein Hindernis am 21. Dezember zu Mittag etwa **dreimal so lang im Schatten wie hoch**.",
    "Die wirksamsten Gegenmittel sind **Planung und Stringaufteilung**; Leistungsoptimierer oder Mikrowechselrichter helfen gezielt bei unvermeidbarer Teilverschattung – vorgeschrieben sind sie in Österreich nicht generell.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie stark mindert Verschattung den PV-Ertrag?",
      tocLabel: "Wie stark?",
      bloecke: [
        {
          typ: "p",
          text: "**[Verschattung](/wissen/lexikon#verschattung) kostet je nach Art, Dauer und Anlagenplanung zwischen wenigen Prozent und einem Großteil des Ertrags – entscheidend ist weniger die beschattete Fläche als die Frage, welche Zellen, Module und Strings betroffen sind.** Solarzellen eines Moduls sind in Reihe geschaltet: Liefert eine Zelle weniger Strom, begrenzt sie die ganze Kette. Damit ein Modul nicht komplett ausfällt, überbrücken Bypassdioden den betroffenen Abschnitt – meist ein Drittel des Moduls.",
        },
        {
          typ: "p",
          text: "Bei Gewerbeanlagen kommt die Verschaltung hinzu. Module werden zu [Strings](/wissen/lexikon#string) zusammengefasst, die ein [MPP-Tracker](/wissen/lexikon#mpp-tracker) im Wechselrichter gemeinsam regelt. Ist ein Teil des Strings verschattet, muss der Tracker einen Kompromiss finden – und der kostet auch die unverschatteten Module Leistung. Gute Planung trennt deshalb verschattete und unverschattete Bereiche konsequent.",
        },
      ],
    },
    {
      id: "horizont",
      titel: "Berge als Schattenwerfer: Horizontverschattung im Alpenraum",
      tocLabel: "Berghorizont",
      bloecke: [
        {
          typ: "p",
          text: "**In inneralpinen Tälern verschattet der Horizont eine PV-Anlage oft stundenlang, besonders im Winter bei tiefem Sonnenstand.** PVGIS berechnet diesen Effekt aus einem digitalen Geländemodell. Die folgende Tabelle vergleicht den Ertrag mit und ohne Horizont für dieselbe Südanlage mit 35° Neigung.",
        },
        {
          typ: "tabelle",
          caption: "Ertrag in kWh/kWp mit und ohne Geländehorizont (PVGIS 5.3, Süd 35°)",
          kopf: ["Ort", "Jahr ohne Horizont", "Jahr mit Horizont", "Verlust Jahr", "Dezember ohne", "Dezember mit", "Verlust Dezember"],
          zeilen: HORIZONT.map(([o, jm, jo, dm, dop]) => [o, f0(jo), f0(jm), verlust(jm, jo), f0(dop), f0(dm), verlust(dm, dop)]),
          hervorheben: 6,
          minBreite: 760,
          fussnote: "Quelle: EU JRC, PVGIS 5.3, eigene Abfragen vom 28.09.2026 für die Ortszentren, 14 % Systemverluste, Horizont aus dem Geländemodell (Auflösung begrenzt). Gebäude, Bäume und nahe Hindernisse sind nicht enthalten – ein Horizontfoto vom Dach ist genauer.",
        },
        {
          typ: "p",
          text: "Die Verluste konzentrieren sich auf den Winter: Im Sommer steht die Sonne hoch genug über den Bergen. Für Chalets, Hotels und Betriebe in Tallagen heißt das: Der Jahresertrag bleibt oft solide, der Winterstrom aber fällt deutlich geringer aus als im Flachland. Wie Sie den Winterertrag trotzdem steigern – etwa mit Fassadenmodulen oder steilerer Neigung – erklärt der Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter). Werte für Ihre Adresse liefert der [Standort-Check](/standort-check).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Horizont selbst erfassen",
          text: "Für eine präzise Planung wird der Horizont vom geplanten Modulstandort aufgenommen – mit einem Horizontfoto (Fischaugenobjektiv mit Kompass), einer App oder aus einem Drohnen-3D-Modell. Die Horizontlinie lässt sich in PVGIS hochladen oder in Planungsprogramme übernehmen. Gerade in Tälern weicht der tatsächliche Horizont vom groben Geländemodell deutlich ab.",
        },
      ],
    },
    {
      id: "ursachen",
      titel: "Typische Schattenquellen auf Gewerbe- und Hallendächern",
      tocLabel: "Schattenquellen",
      bloecke: [
        {
          typ: "p",
          text: "**Auf Hallendächern entstehen die meisten Ertragsverluste nicht durch Nachbargebäude, sondern durch Aufbauten auf dem eigenen Dach.** Weil die Module flach stehen und die Sonne im Winter tief, werfen selbst niedrige Hindernisse lange Schatten.",
        },
        {
          typ: "tabelle",
          caption: "Schattenquellen und wie man mit ihnen umgeht",
          kopf: ["Schattenquelle", "Wann kritisch", "Planungslösung"],
          zeilen: [
            ["Lichtkuppeln und Lichtbänder", "ganzjährig morgens und abends, im Winter mittags", "Abstand halten, Module nicht direkt nördlich davon; Strings parallel zu Lichtbändern führen"],
            ["Lüftungs- und Klimageräte, RWA", "je nach Höhe ganztags", "Schattenbereich freihalten oder mit eigenem String bzw. Optimierern belegen"],
            ["Attika, Brüstung, Absturzsicherung", "Randreihen, vor allem im Winter", "erste Reihe mit Abstand zur Attika planen"],
            ["Eigene Modulreihen (Süd-Aufständerung)", "Winterhalbjahr", "Reihenabstand nach Sonnenstand am 21. Dezember"],
            ["Kamine, Blitzschutzfangstangen, Antennen", "wandernder Punktschatten", "Module aussparen oder Fangstangen versetzen (Trennungsabstand beachten)"],
            ["Bäume und Nachbargebäude", "Winter, Randbereiche", "Verschattungsanalyse mit 3D-Modell; Wuchshöhe in 20 Jahren bedenken"],
            ["Verschmutzung und Schnee", "flache Neigung, Stallabluft, Winter", "Reinigung, steilere Neigung, Monitoring"],
          ],
          minBreite: 700,
          fussnote: "Allgemeine Planungshinweise; die Auswirkung im Einzelfall zeigt eine Verschattungssimulation.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Faustregel für Linz: Schatten dreimal so lang wie das Hindernis hoch",
          text: "Am 21. Dezember steht die Sonne in Linz zu Mittag nur rund 18° hoch. Ein 1 m hohes Lüftungsgerät wirft dann einen etwa 3 m langen Schatten nach Norden, morgens und nachmittags noch längere nach Nordwest bzw. Nordost. In Graz steht die Sonne rund 1°, in Klagenfurt knapp 2° höher, in Salzburg und Bregenz knapp 1° höher. Für Süd-Aufständerungen ergibt sich daraus der Reihenabstand – mehr im Ratgeber [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach).",
        },
      ],
    },
    {
      id: "technik",
      titel: "Was im Modul passiert: Bypassdioden, Halbzellen, Hotspots",
      tocLabel: "Technik im Modul",
      bloecke: [
        {
          typ: "p",
          text: "**Moderne Module enthalten meist drei Bypassdioden, die je ein Drittel der Zellen überbrücken, wenn diese verschattet sind.** Das verhindert den Totalausfall, kostet aber pro überbrücktem Abschnitt rund ein Drittel der Modulleistung. [Halbzellen-Module](/wissen/lexikon#halbzellen) sind in zwei parallel geschaltete Hälften geteilt; wird nur die untere Hälfte verschattet, etwa durch Schnee am unteren Rand oder die Nachbarreihe, arbeitet die obere weiter.",
        },
        {
          typ: "liste",
          punkte: [
            "**Querformat oder Hochformat:** Bei Reihenverschattung von unten ist die Ausrichtung entscheidend, ob ein oder mehrere Bypass-Abschnitte ausfallen – das sollte zur Verschaltung passen.",
            "**Hotspots:** Dauerhaft verschattete oder verschmutzte Zellen können sich stark erhitzen. Das beschleunigt die Alterung und kann das Modul beschädigen. Eine [Drohnen-Thermografie](/service/drohneninspektion) findet solche Stellen zuverlässig.",
            "**Defekte Bypassdioden:** Nach Überspannung oder Alterung können Dioden ausfallen – im Monitoring sichtbar als dauerhaft um ein Drittel reduzierte Modul- oder Stringleistung.",
          ],
        },
      ],
    },
    {
      id: "loesungen",
      titel: "Gegenmaßnahmen: Planung, Stringaufteilung, Leistungselektronik",
      tocLabel: "Lösungen",
      bloecke: [
        {
          typ: "p",
          text: "**Die wirksamste Maßnahme gegen Verschattung ist, sie gar nicht erst entstehen zu lassen – danach kommen Stringplanung und erst dann Modulleistungselektronik.** Jede Stufe kostet mehr als die vorherige und bringt weniger.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Belegung optimieren", "Schattenzonen aus der Simulation freihalten; lieber einige Module weniger als dauerhaft verschattete Module."],
            ["Strings sinnvoll aufteilen", "Module mit gleichem Schattenverlauf in eigene Strings, jeden Bereich auf einen eigenen MPP-Tracker; Ost- und Westflächen getrennt."],
            ["Wechselrichter mit mehreren Trackern", "Gewerbewechselrichter bieten oft sechs bis zwölf Tracker – das erlaubt feine Aufteilung ohne Zusatzkomponenten. Mehr im Ratgeber [Wechselrichter](/ratgeber/wechselrichter-photovoltaik)."],
            ["Leistungsoptimierer gezielt einsetzen", "Nur für Module mit unvermeidbarer Teilverschattung, etwa neben Aufbauten oder bei Fassaden – nicht flächendeckend ohne Grund."],
            ["Monitoring und Kontrolle", "Stringüberwachung zeigt, ob die Verschattungsprognose stimmt und ob neue Hindernisse (Bäume, Aufbauten) dazugekommen sind."],
          ],
        },
        {
          typ: "tabelle",
          caption: "Leistungselektronik bei Verschattung im Vergleich",
          kopf: ["Lösung", "Wirkung", "Einsatz im Gewerbe"],
          zeilen: [
            ["String-Wechselrichter mit mehreren MPP-Trackern", "trennt Bereiche mit unterschiedlicher Einstrahlung", "Standard; ausreichend bei guter Planung"],
            ["Leistungsoptimierer (DC/DC am Modul)", "jedes Modul arbeitet im eigenen Optimum, Modulmonitoring", "gezielt bei Teilverschattung, Fassaden, komplexen Dächern"],
            ["Mikrowechselrichter", "jedes Modul mit eigenem Wechselrichter", "eher kleine Anlagen und Fassadenabschnitte"],
          ],
          fussnote: "Modulleistungselektronik ist in Österreich nicht generell vorgeschrieben. Ob sie im Rahmen eines Brandschutzkonzepts nach OVE R 11-1 eingesetzt wird, entscheidet die Planung im Einzelfall. Jede zusätzliche Komponente auf dem Dach ist auch eine zusätzliche Fehlerquelle.",
        },
        {
          typ: "p",
          text: "Wie [Leistungsoptimierer](/wissen/lexikon#leistungsoptimierer) funktionieren, erklärt das Lexikon. Für die Brandschutzfragen rund um die DC-Seite ist der Ratgeber [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz) die richtige Anlaufstelle.",
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Wann ein Modul weniger mehr bringt",
      tocLabel: "Wirtschaftlichkeit",
      bloecke: [
        {
          typ: "p",
          text: "**Ein dauerhaft verschattetes Modul kostet gleich viel wie ein unverschattetes, liefert aber weniger – und kann im schlechtesten Fall seinen ganzen String ausbremsen.** Deshalb lohnt der nüchterne Blick auf die Kosten je erzeugter Kilowattstunde, statt das Dach bis zum letzten Quadratmeter zu füllen.",
        },
        {
          typ: "tabelle",
          caption: "Rechenbeispiel: Ertrag und Kosten je kWh bei unterschiedlicher Verschattung (Linz, Süd 10°)",
          kopf: ["Modulposition", "Ertrag je kWp und Jahr", "relative Kosten je kWh"],
          zeilen: [
            ["unverschattet", "ca. 1.040 kWh", "100 %"],
            ["leicht verschattet (−10 %)", "ca. 940 kWh", "ca. 111 %"],
            ["deutlich verschattet (−30 %)", "ca. 730 kWh", "ca. 143 %"],
            ["stark verschattet (−50 %)", "ca. 520 kWh", "ca. 200 %"],
          ],
          fussnote: "Vereinfachte Rechnung bei gleichen Investitionskosten je Modul; Ertrag unverschattet laut PVGIS 5.3 für Linz. Nicht enthalten sind Folgeverluste im String, wenn Verschattung nicht durch eigene MPP-Tracker oder Optimierer abgefangen wird.",
        },
        {
          typ: "p",
          text: "Die Rechnung zeigt: Module, die ein Drittel ihres Ertrags durch Schatten verlieren, erzeugen Strom deutlich teurer als der Rest der Anlage. Solche Positionen werden entweder ausgespart oder bewusst mit eigener Verschaltung belegt – etwa wenn die Dachfläche knapp ist und jede Kilowattstunde im Betrieb selbst verbraucht wird. Wie viel Strom Ihr Betrieb tatsächlich nutzen kann, zeigt der Ratgeber [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
      ],
    },
    {
      id: "analyse",
      titel: "Verschattungsanalyse: So wird der Verlust beziffert",
      tocLabel: "Analyse",
      bloecke: [
        {
          typ: "p",
          text: "**Eine professionelle Verschattungsanalyse bildet Gebäude, Aufbauten und Umgebung in 3D nach und simuliert den Sonnenlauf über ein ganzes Jahr.** Ergebnis ist der Verlust je Modul und String – die Grundlage für Belegung, Stringplan und Ertragsprognose.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Dachaufmaß mit allen Aufbauten und Höhen, idealerweise per Drohnenbefliegung oder aus Plänen.",
            "Umgebung erfassen: Nachbargebäude, Bäume (mit künftiger Wuchshöhe), Berghorizont.",
            "Simulation mit Planungssoftware wie PV*SOL oder PVsyst; Ergebnis je Modul prüfen.",
            "Varianten vergleichen: mehr Module mit Verschattung oder weniger Module ohne Verschattung.",
            "Ertragsprognose mit Verschattungsverlust ausweisen – wichtig für Finanzierung und Wartungsvertrag.",
            "Nach Inbetriebnahme gegenprüfen: Stimmen die gemessenen Stringerträge mit der Simulation überein, war die Analyse richtig – sonst Ursachen suchen.",
          ],
        },
        {
          typ: "p",
          text: "Für Gewerbedächer ist die Analyse Teil unserer Planung – siehe [Photovoltaik für Gewerbe & Industrie](/gewerbe). Wie sich Verschattung in den Jahresertrag übersetzt und welche Werte ohne Verschattung erreichbar sind, zeigt der Ratgeber [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie viel Ertrag kostet ein Kamin auf dem Dach?",
      a: "Das hängt von Lage, Höhe und Verschaltung ab – von kaum messbar bis zu einigen Prozent der Anlage. Kritisch wird es, wenn der Schatten über den Tag mehrere Module in verschiedenen Strings streift. Mit angepasster Belegung und Stringaufteilung lässt sich der Verlust meist gering halten.",
    },
    {
      q: "Lohnt sich PV in einem schattigen Alpental?",
      a: "Oft ja, weil der Sommer kaum betroffen ist. Laut PVGIS verlieren Lech und Bad Gastein durch den Berghorizont rund 11 % des Jahresertrags, Hallstatt rund 16 %. Der Winterertrag sinkt aber stark – das muss in Eigenverbrauch und Wirtschaftlichkeit eingerechnet werden.",
    },
    {
      q: "Brauche ich Leistungsoptimierer?",
      a: "Nur bei unvermeidbarer Teilverschattung einzelner Module oder bei komplexen Dächern und Fassaden. Bei guter Planung und Wechselrichtern mit mehreren MPP-Trackern sind sie im Gewerbe meist nicht nötig. Eine generelle Pflicht gibt es in Österreich nicht.",
    },
    {
      q: "Was ist eine Bypassdiode?",
      a: "Ein Bauteil in der Anschlussdose, das einen verschatteten Zellabschnitt überbrückt. So fällt bei Teilverschattung nur etwa ein Drittel des Moduls aus statt des ganzen Moduls oder Strings. Übliche Module haben drei Bypassdioden.",
    },
    {
      q: "Wie finde ich heraus, ob meine Anlage durch Schatten Ertrag verliert?",
      a: "Über Stringmonitoring: Strings mit Schatten zeigen typische Einbrüche zu bestimmten Tageszeiten. Vergleichen Sie Strings gleicher Ausrichtung und prüfen Sie Auffälligkeiten mit Thermografie. Neue Hindernisse wie gewachsene Bäume sind eine häufige Ursache für sinkende Erträge.",
    },
    {
      q: "Kann Verschattung die Module beschädigen?",
      a: "Dauerhafte Teilverschattung oder Verschmutzung einzelner Zellen kann Hotspots erzeugen, die das Modul lokal stark erhitzen und schneller altern lassen. Bypassdioden begrenzen das Risiko, beseitigen es aber nicht. Hersteller schließen Schäden durch unsachgemäße Montage oder dauerhafte Verschattung teils von der Garantie aus – ein Grund mehr, Schattenzonen zu meiden.",
    },
    {
      q: "Verschatten sich Modulreihen auf dem Flachdach gegenseitig?",
      a: "Bei Süd-Aufständerung im Winter ja, wenn der Reihenabstand zu klein ist. In Linz steht die Sonne am 21. Dezember zu Mittag nur rund 18° hoch. Ost-West-Systeme mit 10° Neigung verschatten sich kaum, weil sie flach und Rücken an Rücken stehen.",
    },
  ],

  passend: [
    { href: "/gewerbe", titel: "PV für Gewerbe & Industrie", text: "Planung mit 3D-Verschattungsanalyse." },
    { href: "/service/drohneninspektion", titel: "Drohnen-Thermografie", text: "Hotspots und Schattenschäden finden." },
    { href: "/ratgeber/photovoltaik-flachdach", titel: "Photovoltaik auf dem Flachdach", text: "Reihenabstand, Ballast, Statik." },
    { href: "/standort-check", titel: "Standort-Check", text: "Ertrag und Naturgefahren für Ihre Adresse." },
  ],

  quellen: [
    { titel: "EU JRC – PVGIS 5.3 (Ertrag mit und ohne Horizont)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "EU JRC – PVGIS: Horizon and shading, Methodik", url: "https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/pvgis-user-manual_en", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Photovoltaics Report (Juli 2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen (Version 1.4)", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
    { titel: "OVE – Richtlinie R 11-1: Brandschutz bei Photovoltaikanlagen", url: "https://www.ove.at/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Schatten auf dem Dach?", text: "Wir simulieren Verluste und optimieren die Belegung.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Mehr Ertrag durch bessere Planung – nicht durch mehr Technik.",
    text: "Wir analysieren Dach, Aufbauten und Horizont in 3D und planen Belegung und Strings so, dass Schatten möglichst wenig kostet.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Drohnen-Thermografie", href: "/service/drohneninspektion" },
  },
};

export default artikel;
