// Ratgeber: Photovoltaik-Ertrag pro kWp in Österreich – alle Landeshauptstädte
// Ertragsdaten: eigene API-Abfragen EU JRC PVGIS 5.3 (re.jrc.ec.europa.eu/api/v5_3/PVcalc),
// Strahlungsdatenbank PVGIS-SARAH3, Zeitraum 2005–2023, 1 kWp kristallin, 14 % Systemverluste,
// Horizont aus Geländemodell, Koordinaten der Ortszentren, abgerufen am 28.09.2026.

// [Stadt, Bundesland, Seehöhe, opt. Neigung, E opt, H(i) opt, Süd 30°, Süd 10°, Ost 10°, West 10°, Süd 90°, Jahresschwankung SD]
const STAEDTE = [
  ["Wien", "W", 186, 38, 1176, 1476, 1166, 1069, 975, 975, 822, 46],
  ["St. Pölten", "NÖ", 275, 38, 1142, 1439, 1133, 1039, 945, 953, 799, 44],
  ["Linz", "OÖ", 270, 38, 1143, 1443, 1134, 1040, 946, 955, 801, 42],
  ["Salzburg", "S", 432, 37, 1074, 1369, 1066, 987, 896, 914, 743, 54],
  ["Innsbruck", "T", 580, 42, 1369, 1695, 1347, 1209, 1088, 1079, 1006, 51],
  ["Bregenz", "V", 407, 39, 1140, 1437, 1128, 1030, 927, 943, 802, 57],
  ["Klagenfurt", "K", 450, 39, 1252, 1576, 1240, 1133, 1027, 1035, 885, 57],
  ["Graz", "St", 365, 40, 1226, 1547, 1211, 1098, 998, 991, 881, 63],
  ["Eisenstadt", "B", 179, 38, 1200, 1508, 1190, 1090, 993, 995, 837, 45],
];

const f0 = (x) => Math.round(x).toLocaleString("de-DE");
const p1 = (x) => String(Math.round(x * 1000) / 10).replace(".", ",") + " %";

const LINZ = STAEDTE[2];
const OW_LINZ = (LINZ[8] + LINZ[9]) / 2;

const artikel = {
  slug: "photovoltaik-ertrag-pro-kwp",
  title: "Photovoltaik-Ertrag pro kWp in Österreich: Werte der Landeshauptstädte",
  seoTitle: "PV-Ertrag pro kWp Österreich: PVGIS-Werte | Ökovolt",
  kurzTitel: "Ertrag pro kWp",
  description:
    "Photovoltaik-Ertrag pro kWp in Österreich: PVGIS-Werte für alle neun Landeshauptstädte, Süd, Ost-West und Fassade, Einflussfaktoren und Beispiel Gewerbedach.",
  excerpt:
    "Zwischen 1.070 und 1.370 kWh pro kWp und Jahr – je nach Landeshauptstadt, Ausrichtung und Neigung. Echte PVGIS-Werte für Wien bis Bregenz, dazu Ost-West, Flachdach und Fassade im Vergleich.",
  hauptKeyword: "photovoltaik ertrag pro kwp",
  keywords: [
    "Photovoltaik Ertrag pro kWp",
    "PV Ertrag Österreich",
    "spezifischer Ertrag Photovoltaik",
    "kWh pro kWp Wien Linz Graz",
    "PVGIS Österreich",
    "Ertrag Ost-West Photovoltaik",
    "Solarertrag Bundesland",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Kontakt/faqs.jpg",
  bildAlt: "Solarmodule vor blauem Himmel mit Wolken",
  badge: { wert: "1.143", text: "kWh/kWp in Linz, optimal nach Süden (PVGIS)" },

  kurzFazit: [
    "**Eine optimal nach Süden geneigte PV-Anlage erzeugt in Österreichs Landeshauptstädten zwischen 1.074 kWh/kWp (Salzburg) und 1.369 kWh/kWp (Innsbruck) pro Jahr** – laut EU-Tool PVGIS 5.3 bei 14 % Systemverlusten.",
    "Wien, Linz, St. Pölten und Bregenz liegen mit rund 1.140 bis 1.180 kWh/kWp im Mittelfeld; der Süden (Graz 1.226, Klagenfurt 1.252) und Eisenstadt (1.200) liefern 5 bis 10 % mehr.",
    "**Ost-West mit 10° Neigung** bringt rund **83 % des Ertrags einer 30°-Südanlage** je kWp, eine flache Südaufständerung mit 10° rund 91 %. Auf Flachdächern passt bei Ost-West aber deutlich mehr Leistung aufs Dach.",
    "Die Jahreswerte schwanken um rund **4 bis 5 %** (Standardabweichung). Für Finanzierung und Wirtschaftlichkeit sollte man deshalb mit dem langjährigen Mittel und einem Sicherheitsabschlag rechnen.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie viel Ertrag bringt 1 kWp in Österreich?",
      tocLabel: "Ertrag je kWp",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Kilowatt-Peak Photovoltaikleistung erzeugt in Österreich bei optimaler Südausrichtung rund 1.070 bis 1.370 kWh Strom pro Jahr.** Dieser Wert heißt [spezifischer Ertrag](/wissen/lexikon#spezifischer-ertrag) und ist die wichtigste Kennzahl für die Wirtschaftlichkeit: Er gibt an, wie viele Kilowattstunden jedes installierte kWp liefert – unabhängig von der Anlagengröße. Eine 100-kWp-Anlage in Linz kommt damit auf rund 114.000 kWh, in Graz auf rund 123.000 kWh.",
        },
        {
          typ: "p",
          text: "Die folgenden Werte haben wir direkt über die Schnittstelle von PVGIS abgefragt, dem Photovoltaik-Informationssystem der Gemeinsamen Forschungsstelle der EU-Kommission. PVGIS kombiniert Satellitendaten der Jahre 2005 bis 2023 mit einem Geländemodell, das den Horizont – also Berge – berücksichtigt. Als [Systemverluste](/wissen/lexikon#performance-ratio) sind die PVGIS-Standardwerte von 14 % für Kabel, Wechselrichter, Verschmutzung und Alterung angesetzt.",
        },
      ],
    },
    {
      id: "landeshauptstaedte",
      titel: "PVGIS-Werte für alle neun Landeshauptstädte",
      tocLabel: "Tabelle Landeshauptstädte",
      bloecke: [
        {
          typ: "p",
          text: "**Innsbruck führt die Tabelle an, Salzburg bildet das Schlusslicht – der Unterschied beträgt 27 %.** Innsbruck profitiert von vielen Sonnenstunden, Föhnlagen und einem sonnigen Winter; Salzburg liegt am Alpennordrand im Stau feuchter Luftmassen. Die optimale Neigung liegt überall zwischen 37° und 42°, der Mehrertrag gegenüber 30° ist mit etwa 1 % aber gering.",
        },
        {
          typ: "tabelle",
          caption: "Spezifischer Jahresertrag in kWh/kWp je Landeshauptstadt und Ausrichtung (PVGIS 5.3, Mittel 2005–2023)",
          kopf: ["Stadt", "Seehöhe", "optimal (Neigung)", "Süd 30°", "Süd 10°", "Ost-West 10°", "Südfassade 90°", "Einstrahlung opt. (kWh/m²)"],
          zeilen: STAEDTE.map((s) => [
            `${s[0]} (${s[1]})`,
            `${f0(s[2])} m`,
            `${f0(s[4])} (${s[3]}°)`,
            f0(s[6]),
            f0(s[7]),
            f0((s[8] + s[9]) / 2),
            f0(s[10]),
            f0(s[5]),
          ]),
          hervorheben: 2,
          markierteZeile: 2,
          minBreite: 780,
          fussnote: "Quelle: EU JRC, PVGIS 5.3 (PVGIS-SARAH3), eigene API-Abfragen vom 28.09.2026 für die Koordinaten der Ortszentren. 1 kWp kristalline Module, 14 % Systemverluste, freistehend montiert, Geländehorizont berücksichtigt. Ost-West = Mittel aus je 10° Ost und 10° West. Satellitendaten in Gebirgstälern (z. B. Innsbruck) haben eine höhere Unsicherheit.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Was die Einstrahlung verrät",
          text: "Die letzte Spalte zeigt die Sonnenenergie, die jährlich auf einen Quadratmeter optimal geneigte Fläche trifft. Das Verhältnis von Ertrag zu Einstrahlung liegt überall bei rund 0,79 bis 0,81 – das ist die Performance Ratio der Modellanlage. Moderne, gut geplante Gewerbeanlagen erreichen im Betrieb oft 0,80 bis 0,85; liegt Ihre Anlage deutlich darunter, lohnt ein Blick auf Verschattung, Verschmutzung und Wechselrichter.",
        },
        {
          typ: "p",
          text: "Für die Wirtschaftlichkeitsrechnung eines Betriebs sind die Unterschiede zwischen den Bundesländern spürbar, aber nicht entscheidend: Ein Unterschied von 10 % im Ertrag wiegt weniger schwer als die Frage, wie viel Strom der Betrieb selbst nutzt. Wie der Ertrag in Amortisation übersetzt wird, zeigt der Ratgeber [Amortisation](/ratgeber/photovoltaik-amortisation).",
        },
      ],
    },
    {
      id: "ausrichtung",
      titel: "Ausrichtung und Neigung: Wie viel kostet Ost-West?",
      tocLabel: "Ausrichtung & Neigung",
      bloecke: [
        {
          typ: "p",
          text: `**Je kWp liefert Ost-West weniger als Süd – in Linz ${f0(OW_LINZ)} statt ${f0(LINZ[6])} kWh bei 30°-Süd, also ${p1(OW_LINZ / LINZ[6])}.** Auf dem Flachdach ist das aber nur die halbe Wahrheit: Ost-West-Systeme stehen Rücken an Rücken ohne Reihenabstand und bringen dadurch auf derselben Dachfläche oft 30 bis 60 % mehr Modulleistung unter. Der Ertrag pro Quadratmeter Dach ist dann höher, der Ertrag pro kWp niedriger.`,
        },
        {
          typ: "tabelle",
          caption: `Relativer Ertrag nach Ausrichtung und Neigung am Beispiel Linz (PVGIS 5.3), Süd 30° = 100 %`,
          kopf: ["Ausrichtung / Neigung", "kWh/kWp", "relativ zu Süd 30°", "Typische Anwendung"],
          zeilen: [
            [`Süd, optimal (${LINZ[3]}°)`, f0(LINZ[4]), p1(LINZ[4] / LINZ[6]), "Freifläche, Steildach"],
            ["Süd 30°", f0(LINZ[6]), "100 %", "Satteldach, Scheune"],
            ["Süd 10°", f0(LINZ[7]), p1(LINZ[7] / LINZ[6]), "Flachdach, flache Aufständerung"],
            ["West 10°", f0(LINZ[9]), p1(LINZ[9] / LINZ[6]), "Ost-West-Flachdach (West-Teil)"],
            ["Ost 10°", f0(LINZ[8]), p1(LINZ[8] / LINZ[6]), "Ost-West-Flachdach (Ost-Teil)"],
            ["Süd 90° (Fassade)", f0(LINZ[10]), p1(LINZ[10] / LINZ[6]), "Fassade, Brüstung, Lärmschutzwand"],
          ],
          hervorheben: 2,
          fussnote: "Quelle: EU JRC, PVGIS 5.3, Linz Zentrum, eigene Abfrage 28.09.2026. Die Relationen sind in allen Landeshauptstädten ähnlich (Ost-West 10° zwischen 80 und 86 % von Süd 30°).",
        },
        {
          typ: "p",
          text: "Welche Variante für ein Hallendach wirtschaftlicher ist, hängt von Statik, Lastgang und Netzanschluss ab. Ost-West verteilt die Erzeugung auf Vormittag und Nachmittag, senkt die Mittagsspitze und passt oft besser zum Verbrauch eines Betriebs. Die Details erklärt der Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west); Aufständerung, Ballast und Reihenabstände behandelt [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach).",
        },
      ],
    },
    {
      id: "einflussfaktoren",
      titel: "Was den realen Ertrag bestimmt",
      tocLabel: "Einflussfaktoren",
      bloecke: [
        {
          typ: "p",
          text: "**PVGIS liefert einen soliden Planungswert – der reale Ertrag einer Anlage weicht davon um einige Prozent nach oben oder unten ab.** Die wichtigsten Stellschrauben kennen Sie vor der Investition und können sie beeinflussen.",
        },
        {
          typ: "tabelle",
          caption: "Einflussfaktoren auf den spezifischen Ertrag",
          kopf: ["Faktor", "Typische Wirkung", "Hinweis"],
          zeilen: [
            ["Verschattung (Kamine, Lichtkuppeln, Nachbargebäude, Berge)", "wenige bis über 20 %", "mit 3D-Planung und passender Stringaufteilung minimieren – siehe [Verschattung](/ratgeber/photovoltaik-verschattung)"],
            ["Modultemperatur", "im Sommer −5 bis −13 % Leistung", "hinterlüftete Montage, Module mit kleinem Temperaturkoeffizienten"],
            ["Verschmutzung (Staub, Pollen, Stallabluft)", "1–5 %, bei Landwirtschaft mehr", "flache Neigungen verschmutzen stärker; Reinigung nach Bedarf"],
            ["Schnee", "im Winter zeitweise 100 %", "PVGIS enthält keine Schneeverluste – siehe [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter)"],
            ["Degradation", "ca. 0,3–0,5 % pro Jahr", "Leistungsgarantie des Herstellers prüfen"],
            ["Wechselrichter-Begrenzung (Clipping)", "bei hoher DC/AC-Überbelegung 0–3 %", "bewusst eingeplant oft wirtschaftlich"],
            ["Einspeisebegrenzung des Netzbetreibers", "standortabhängig", "bei begrenzter Netzkapazität Eigenverbrauch oder Speicher mitplanen"],
            ["Bifaziale Module auf hellem Untergrund", "Mehrertrag einige Prozent", "Freifläche, helle Dachbahnen, Schnee"],
          ],
          minBreite: 680,
          fussnote: "Richtwerte aus Planungspraxis und Literatur; im Einzelfall durch Simulation zu bestimmen.",
        },
        {
          typ: "p",
          text: "Die Degradation hängt von der Modultechnologie ab. Moderne [TOPCon-](/wissen/lexikon#topcon) und Heterojunction-Module altern laut Herstellergarantien langsamer als ältere PERC-Module; bifaziale Glas-Glas-Module nutzen zusätzlich Licht von der Rückseite. Einen Überblick gibt der Ratgeber [Solarmodule im Vergleich](/ratgeber/solarmodule-vergleich).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Rechenbeispiel: 500 kWp auf einem Hallendach in Oberösterreich",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Auf einer 6.000 m² großen Halle bei Linz lassen sich je nach System rund 450 bis 700 kWp installieren – und der Jahresertrag unterscheidet sich weniger, als der spezifische Ertrag vermuten lässt.** Annahme: 470-Wp-Module mit rund 2,0 m² Fläche, nutzbare Dachfläche nach Abzug von Randabständen, Lichtkuppeln und Wartungswegen 4.500 m².`,
        },
        {
          typ: "tabelle",
          caption: "Modellrechnung: Hallendach bei Linz, 4.500 m² nutzbare Fläche, Stand 09/2026",
          kopf: ["System", "Belegung (Richtwert)", "installierbare Leistung", "kWh/kWp (PVGIS)", "Jahresertrag"],
          zeilen: [
            ["Süd 10°, mit Reihenabstand", "ca. 50 % der Fläche", "ca. 530 kWp", f0(LINZ[7]), `ca. ${f0(530 * LINZ[7] / 1000)} MWh`],
            ["Ost-West 10°, ohne Reihenabstand", "ca. 75 % der Fläche", "ca. 790 kWp", f0(OW_LINZ), `ca. ${f0(790 * OW_LINZ / 1000)} MWh`],
          ],
          fussnote: "Belegungsgrade sind Richtwerte und hängen stark von Dachform, Statik, Brandschutzabständen und Windzonen ab. Ertrag ohne Verschattung und Schneeverluste. Die installierbare Leistung wird in der Praxis oft durch Statik oder Netzanschluss begrenzt, nicht durch die Fläche.",
        },
        {
          typ: "p",
          text: "Das Ost-West-System liefert trotz niedrigerem spezifischem Ertrag rund 35 % mehr Strom, braucht aber mehr Modulfläche, mehr Wechselrichterleistung und einen stärkeren Netzanschluss. Ob sich das rechnet, entscheidet der Lastgang: Wie viel davon kann der Betrieb selbst nutzen, wie viel wird zum Marktpreis eingespeist? Die Methode dazu erklärt der Ratgeber [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen); für die Vermarktung des Überschusses siehe [Reststromvermarktung](/ratgeber/reststromvermarktung).",
        },
        {
          typ: "tool",
          href: "/standort-check",
          titel: "Ertrag, Schneelast und Hagel für Ihre Adresse",
          text: "Der Standort-Check verbindet den PVGIS-Ertrag mit Schneelast, Wind und Hagelgefährdung aus eHORA – als Grundlage für Planung und Angebot.",
          label: "Standort prüfen",
        },
      ],
    },
    {
      id: "pruefen",
      titel: "So prüfen Sie den Ertrag Ihrer bestehenden Anlage",
      tocLabel: "Ertrag prüfen",
      bloecke: [
        {
          typ: "p",
          text: "**Ob eine Anlage „gut“ läuft, zeigt nicht der absolute Jahresertrag, sondern das Verhältnis zur tatsächlichen Einstrahlung – die Performance Ratio (PR).** Sie berechnet sich als Jahresertrag geteilt durch das Produkt aus installierter Leistung und Einstrahlung auf die Modulebene (in kWh/m², bezogen auf 1 kW/m²). Ein schwaches Sonnenjahr senkt den Ertrag, aber nicht die PR – ein technisches Problem dagegen schon.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Beispiel: 200-kWp-Anlage in Graz",
          text: "Die Anlage liefert 232.000 kWh im Jahr, also 1.160 kWh/kWp. Auf die geneigte Modulfläche trafen laut Messung 1.550 kWh/m². PR = 1.160 / 1.550 = 0,75. Das liegt unter den 0,80, die PVGIS für die Modellanlage ansetzt – Anlass, Verschattung, Verschmutzung, Stringausfälle und Wechselrichter-Logs zu prüfen. Eine [Drohnen-Thermografie](/service/drohneninspektion) findet defekte Module und Hotspots oft in wenigen Stunden.",
        },
        {
          typ: "p",
          text: "Für die Einstrahlung vor Ort eignen sich ein Referenzsensor an der Anlage oder Satellitendaten für den jeweiligen Monat. Wer keinen Sensor hat, vergleicht mit baugleichen Anlagen in der Nähe oder mit den PVGIS-Monatswerten – grobe Abweichungen von mehr als 10 % über mehrere Monate sind ein klares Signal für eine technische Prüfung, etwa im Rahmen des [E-Checks](/service/e-check).",
        },
      ],
    },
    {
      id: "prognose",
      titel: "Vom Planungswert zur Ertragsprognose für Bank und Investor",
      tocLabel: "Ertragsprognose",
      bloecke: [
        {
          typ: "p",
          text: "**Für Finanzierungen reicht ein Durchschnittswert nicht – Banken und Investoren fragen nach Wahrscheinlichkeiten.** Üblich sind P50- und P90-Werte: P50 ist der Ertrag, der im langjährigen Mittel erreicht wird, P90 jener Wert, der mit 90 % Wahrscheinlichkeit mindestens erreicht wird. Grundlage sind die Schwankungen der Einstrahlung von Jahr zu Jahr – in den PVGIS-Daten für Österreichs Landeshauptstädte rund 42 bis 63 kWh/kWp (Standardabweichung) – sowie die Unsicherheiten von Datenbasis und Simulation.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Standortdaten erheben", "Koordinaten, Dachflächen, Neigung, Horizont und Verschattungsobjekte aufnehmen."],
            ["Simulation erstellen", "Ertrag mit Modul- und Wechselrichterdaten simulieren, inklusive Verschattung, Temperatur und Verkabelung."],
            ["Mehrere Datenquellen vergleichen", "PVGIS, Meteonorm oder Solargis gegenüberstellen; bei großen Projekten Messdaten naher Anlagen einbeziehen."],
            ["P50/P90 ableiten", "Unsicherheiten zusammenführen und den Ertrag mit Sicherheitsabschlag ausweisen."],
            ["Im Betrieb überprüfen", "Ertrag monatlich mit Einstrahlung vergleichen, Abweichungen per Monitoring früh erkennen."],
          ],
        },
        {
          typ: "p",
          text: "Im Betrieb überwachen wir Gewerbe- und Freiflächenanlagen mit eigener [Fernwartung](/technik/fernwartung) und [SCADA-Leitwarte](/technik/scada) – dort fällt auf, wenn der spezifische Ertrag hinter der Prognose zurückbleibt.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie viel kWh bringt 1 kWp in Österreich?",
      a: "Bei optimaler Südausrichtung laut PVGIS zwischen 1.074 kWh (Salzburg) und 1.369 kWh (Innsbruck) pro Jahr. Wien, Linz und St. Pölten liegen bei rund 1.140 bis 1.180 kWh, Graz und Klagenfurt bei 1.226 bzw. 1.252 kWh.",
    },
    {
      q: "Welcher Ertrag ist bei Ost-West realistisch?",
      a: "Mit 10° Neigung rund 900 bis 1.080 kWh/kWp, also etwa 83 % einer 30°-Südanlage. Auf Flachdächern gleicht die dichtere Belegung das oft aus – pro Quadratmeter Dach wird mehr Strom erzeugt.",
    },
    {
      q: "Wie genau ist PVGIS?",
      a: "PVGIS basiert auf Satellitendaten und ist für die Vorplanung gut geeignet. In Gebirgstälern und bei starker Nebelbildung ist die Unsicherheit höher. Für größere Projekte empfehlen sich eine detaillierte Simulation und der Vergleich mehrerer Datenquellen.",
    },
    {
      q: "Welcher Ertrag ist für eine Gewerbeanlage gut?",
      a: "Eine gut geplante Anlage sollte die PVGIS-Werte für ihre Ausrichtung im langjährigen Mittel erreichen. Liegt die Performance Ratio dauerhaft unter etwa 0,75, deutet das auf Verschattung, Verschmutzung, defekte Strings oder Wechselrichterprobleme hin.",
    },
    {
      q: "Wie stark schwankt der Ertrag von Jahr zu Jahr?",
      a: "Die Standardabweichung der Jahreserträge liegt in den PVGIS-Daten bei rund 4 bis 5 %. Einzelne Jahre können stärker abweichen – für Finanzierungen wird deshalb mit P90-Werten gerechnet.",
    },
    {
      q: "Liefert eine Fassadenanlage genug Ertrag?",
      a: "Eine Südfassade liefert übers Jahr rund 70 % einer optimal geneigten Anlage, in den Wintermonaten aber praktisch gleich viel. Für Gebäude mit hohem Winterverbrauch ist sie deshalb interessant – siehe Ratgeber Fassade und BIPV.",
    },
  ],

  passend: [
    { href: "/standort-check", titel: "Standort-Check", text: "Ertrag, Schneelast, Wind und Hagel für Ihre Adresse." },
    { href: "/ratgeber/photovoltaik-ost-west", titel: "Photovoltaik Ost-West", text: "Ertrag, Lastgang und Flachdach." },
    { href: "/gewerbe", titel: "PV für Gewerbe & Industrie", text: "Planung nach Lastgang, Hallen- und Flachdächer." },
    { href: "/ratgeber/photovoltaik-im-winter", titel: "Photovoltaik im Winter", text: "Monatswerte, Schnee und Kälte." },
  ],

  quellen: [
    { titel: "EU JRC – PVGIS 5.3 Photovoltaic Geographical Information System", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "EU JRC – PVGIS API (PVcalc), Dokumentation", url: "https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/api-non-interactive-service_en", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Photovoltaics Report (Juli 2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
    { titel: "GeoSphere Austria – Klimadaten und Globalstrahlung", url: "https://www.geosphere.at/", stand: "09/2026" },
    { titel: "HORA – Naturgefahren und Normwerte je Standort", url: "https://hora.gv.at/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Ertrag für Ihre Adresse?", text: "PVGIS-Ertrag plus Schneelast und Hagel in einer Abfrage.", href: "/standort-check", label: "Standort prüfen" },
  cta: {
    title: "Ertragsprognose, auf die Sie bauen können.",
    text: "Wir simulieren den Ertrag Ihres Dachs oder Ihrer Fläche mit Verschattung, Ausrichtung und Lastgang – und überwachen ihn später im Betrieb.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Standort-Check", href: "/standort-check" },
  },
};

export default artikel;
