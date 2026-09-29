// Ratgeber: Photovoltaik Ost-West – Ertrag, Tagesprofil, Netzanschluss, Flachdach (Österreich)
// Daten: EU JRC PVGIS 5.3 – Jahreswerte (PVcalc) für alle Landeshauptstädte sowie Stundenreihen
// (seriescalc) für Linz 2019–2023, 14 % Systemverluste, eigene Auswertung vom 28.09.2026.

// [Stadt, Süd 30°, Ost 10°, West 10°]
const STAEDTE = [
  ["Wien", 1166, 975, 975],
  ["St. Pölten", 1133, 945, 953],
  ["Linz", 1134, 946, 955],
  ["Salzburg", 1066, 896, 914],
  ["Innsbruck", 1347, 1088, 1079],
  ["Bregenz", 1128, 927, 943],
  ["Klagenfurt", 1240, 1027, 1035],
  ["Graz", 1211, 998, 991],
  ["Eisenstadt", 1190, 993, 995],
];

// Mittleres Tagesprofil im Juni, Linz, Wh je kWp und Stunde (Ortszeit, Stunde beginnend)
const PROFIL = [
  [6, 19, 36],
  [7, 72, 115],
  [8, 193, 223],
  [9, 339, 345],
  [10, 460, 443],
  [11, 555, 519],
  [12, 593, 548],
  [13, 582, 537],
  [14, 560, 519],
  [15, 501, 472],
  [16, 414, 403],
  [17, 291, 304],
  [18, 168, 205],
  [19, 55, 106],
];

const f0 = (x) => Math.round(x).toLocaleString("de-DE");
const p1 = (x) => String(Math.round(x * 1000) / 10).replace(".", ",") + " %";

const artikel = {
  slug: "photovoltaik-ost-west",
  title: "Photovoltaik Ost-West: Ertrag, Tagesprofil und Netzanschluss",
  seoTitle: "Photovoltaik Ost-West: Ertrag & Vorteile | Ökovolt",
  kurzTitel: "Photovoltaik Ost-West",
  description:
    "Photovoltaik Ost-West in Österreich: PVGIS-Ertrag aller Landeshauptstädte, mehr kWp pro Dach, breiteres Tagesprofil und niedrigere Einspeisespitzen erklärt.",
  excerpt:
    "Ost-West liefert je kWp rund 83 % einer Südanlage – passt aber deutlich mehr Leistung aufs Flachdach und schont den Netzanschluss. Die Zahlen aus PVGIS für alle Landeshauptstädte und ein Hallendach im Vergleich.",
  hauptKeyword: "photovoltaik ost west",
  keywords: [
    "Photovoltaik Ost-West",
    "Ost-West-Ausrichtung Ertrag",
    "PV Ost West Flachdach",
    "Ost-West oder Süd",
    "Ost-West Photovoltaik Gewerbe",
    "Einspeisespitze reduzieren",
    "Ost-West Satteldach Photovoltaik",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Home/download-2.jpg",
  bildAlt: "Aufgeständerte Modulreihen einer Photovoltaikanlage auf einem Flachdach",
  badge: { wert: "−13 %", text: "niedrigere Spitzenleistung als Süd 30° (Linz)" },

  kurzFazit: [
    "**Eine Ost-West-Anlage mit 10° Neigung liefert in Österreich je kWp rund 80 bis 86 % des Ertrags einer 30°-Südanlage** – in Linz 950 statt 1.134 kWh/kWp, in Graz 995 statt 1.211 kWh/kWp (PVGIS).",
    "Auf dem Flachdach gleicht die dichtere Belegung das mehr als aus: Ohne Reihenabstand passen oft **30 bis 60 % mehr kWp** aufs Dach, der Stromertrag je Quadratmeter Dach steigt.",
    "Die **Spitzenleistung** sinkt deutlich: In Linz erreicht Ost-West maximal 0,76 kW je kWp, Süd 30° 0,88 kW. Mit einem Wechselrichter von nur 70 % der Modulleistung gehen bei Ost-West praktisch **0 %** Ertrag verloren, bei Süd 30° rund 1,3 %.",
    "Das Tagesprofil wird breiter: Im Juni liefert Ost-West zwischen 7 und 8 Uhr **rund 60 % mehr** und zwischen 19 und 20 Uhr **fast doppelt so viel** wie Süd 30°. Bei flacher Neigung ist die Verschiebung aus der Mittagsspitze aber moderat.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich Ost-West statt Süd?",
      tocLabel: "Ost-West oder Süd?",
      bloecke: [
        {
          typ: "p",
          text: "**Auf Flachdächern ist Ost-West für Gewerbebetriebe oft die wirtschaftlichere Wahl, auf geneigten Süddächern bleibt Süd überlegen.** Der Grund: Je kWp liefert eine [Ost-West-Ausrichtung](/wissen/lexikon#ost-west-ausrichtung) rund ein Sechstel weniger Strom. Weil die Module aber Rücken an Rücken stehen und sich kaum gegenseitig verschatten, fällt der Reihenabstand weg – auf derselben Dachfläche lässt sich deutlich mehr Leistung installieren.",
        },
        {
          typ: "p",
          text: "Dazu kommen drei Vorteile, die in der Ertragstabelle nicht sichtbar sind: niedrigere Einspeisespitzen, die den Netzanschluss entlasten; ein breiteres Tagesprofil, das besser zu Betrieben mit Früh- oder Spätschicht passt; und eine geringere Windangriffsfläche, die mit weniger Ballast auskommt. Diese Punkte entscheiden bei Hallendächern häufiger über die Systemwahl als die reine Kilowattstunde pro kWp.",
        },
      ],
    },
    {
      id: "ertrag",
      titel: "Ertrag: Ost-West und Süd in allen Landeshauptstädten",
      tocLabel: "Ertrag je kWp",
      bloecke: [
        {
          typ: "p",
          text: "**Ost-West mit 10° Neigung erreicht in allen Landeshauptstädten zwischen 80 und 86 % des Ertrags einer 30°-Südanlage.** In sechs der neun Städte liefert die West-Hälfte etwas mehr als die Ost-Hälfte – ein Hinweis auf häufigere Morgennebel; in Graz und Innsbruck ist es umgekehrt.",
        },
        {
          typ: "tabelle",
          caption: "Spezifischer Ertrag in kWh/kWp: Süd 30° vs. Ost-West 10° (PVGIS 5.3, Mittel 2005–2023)",
          kopf: ["Stadt", "Süd 30°", "Ost 10°", "West 10°", "Ost-West gesamt", "Anteil an Süd 30°"],
          zeilen: STAEDTE.map(([s, sued, ost, west]) => [s, f0(sued), f0(ost), f0(west), f0((ost + west) / 2), p1((ost + west) / 2 / sued)]),
          hervorheben: 5,
          markierteZeile: 2,
          fussnote: "Quelle: EU JRC, PVGIS 5.3, eigene Abfragen vom 28.09.2026 (Ortszentren, 14 % Systemverluste, ohne Verschattung und Schnee). Ost-West gesamt = Mittel beider Dachhälften bei gleicher Leistung.",
        },
        {
          typ: "p",
          text: "Mit steigender Neigung verliert Ost-West weiter: In Linz liefern 20° Ost-West rund 934 kWh/kWp, 30° Ost-West rund 910 kWh/kWp. Für Satteldächer mit Ost-West-First, wie sie bei Maschinenhallen und Stallgebäuden häufig sind, ist das trotzdem ein solider Wert – rund 80 % einer Südanlage. Die vollständigen Standortwerte finden Sie im Ratgeber [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
      ],
    },
    {
      id: "flachdach",
      titel: "Auf dem Flachdach: Mehr kWp, mehr Strom pro Quadratmeter",
      tocLabel: "Flachdach-Vergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Auf einem Flachdach mit 1.000 m² nutzbarer Fläche erzeugt eine Ost-West-Anlage in Linz rund ein Drittel mehr Strom als eine nach Süden aufgeständerte.** Südreihen brauchen Abstand, damit sie sich im Winter nicht verschatten; Ost-West-Reihen stehen dicht an dicht.",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: 1.000 m² nutzbare Flachdachfläche bei Linz, Stand 09/2026",
          kopf: ["System", "installierbare Leistung (Richtwert)", "kWh/kWp", "Jahresertrag", "Ertrag je m² Dach"],
          zeilen: [
            ["Süd 10°, mit Reihenabstand", "ca. 110 kWp", "1.040", "ca. 114 MWh", "ca. 114 kWh"],
            ["Ost-West 10°, ohne Reihenabstand", "ca. 160 kWp", "950", "ca. 152 MWh", "ca. 152 kWh"],
          ],
          hervorheben: 3,
          fussnote: "Belegungsdichte als Richtwert für Module mit ca. 22–23 % Wirkungsgrad; tatsächlich abhängig von Randzonen, Aufbauten, Brandschutzabständen, Statik und Wartungswegen. Erträge: PVGIS 5.3, Linz.",
        },
        {
          typ: "p",
          text: "Mehr Leistung bedeutet allerdings auch mehr Investition, mehr Last auf dem Dach und mehr Überschuss. Ob sich die zusätzlichen kWp rechnen, entscheidet der Lastgang des Betriebs. Statik, Ballast und Befestigung auf Hallendächern behandelt der Ratgeber [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach), die Auslegung nach Verbrauch [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
      ],
    },
    {
      id: "tagesprofil",
      titel: "Tagesprofil: Wann Ost-West Strom liefert",
      tocLabel: "Tagesprofil",
      bloecke: [
        {
          typ: "p",
          text: "**Ost-West verteilt die Erzeugung gleichmäßiger über den Tag: morgens und abends mehr, mittags weniger als eine Südanlage.** Die Auswertung der PVGIS-Stundenwerte für Linz zeigt, wie groß der Effekt bei flacher Neigung tatsächlich ist.",
        },
        {
          typ: "tabelle",
          caption: "Mittlere Erzeugung im Juni in Wh je kWp und Stunde, Linz (PVGIS 5.3, 2019–2023)",
          kopf: ["Stunde (Ortszeit)", "Süd 30°", "Ost-West 10°", "Differenz"],
          zeilen: PROFIL.map(([h, s, ow]) => [`${h}:00–${h + 1}:00`, f0(s), f0(ow), `${ow - s > 0 ? "+" : ""}${f0(ow - s)}`]),
          fussnote: "Eigene Auswertung der PVGIS-Stundenreihen (seriescalc) für Linz, Juni 2019–2023, 14 % Verluste; Zeitangaben in Sommerzeit. Ost-West = Mittel aus 10° Ost und 10° West bei gleicher Leistung.",
        },
        {
          typ: "p",
          text: "In der Stunde ab 7 Uhr liefert Ost-West rund 60 % mehr, in der Stunde ab 19 Uhr fast doppelt so viel wie Süd 30°, zur Mittagszeit rund 8 % weniger. Übers Jahr fallen bei Ost-West 50 % des Ertrags zwischen 11 und 15 Uhr an, bei Süd 30° 52 %. Die Verschiebung aus der Mittagsspitze ist also real, aber moderat. Wer das Profil stärker verschieben will, braucht steilere Ost-West-Flächen, Fassaden oder vertikale bifaziale Module, wie sie in der [Agri-PV](/ratgeber/agri-pv-oesterreich) eingesetzt werden.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Mittagspreise und negative Strompreise",
          text: "An sonnigen Tagen fallen die Day-Ahead-Preise der Gebotszone Österreich zur Mittagszeit stark und werden an Wochenenden und Feiertagen immer öfter negativ. Jede Kilowattstunde am Morgen oder Abend ist dann mehr wert als eine zu Mittag. Für eingespeisten Überschuss verbessert Ost-West daher den Erlös leicht, für den Eigenverbrauch in Betrieben mit Schichtbeginn um 6 oder 7 Uhr passt das Profil besser. Mehr im Ratgeber [Negative Strompreise](/ratgeber/negative-strompreise).",
        },
      ],
    },
    {
      id: "netz",
      titel: "Netzanschluss und Wechselrichter: Der unterschätzte Vorteil",
      tocLabel: "Netz & Wechselrichter",
      bloecke: [
        {
          typ: "p",
          text: "**Ost-West-Anlagen erreichen nie die volle Modulleistung auf beiden Dachhälften gleichzeitig – deshalb kann der Wechselrichter deutlich kleiner sein als die Modulleistung, ohne nennenswert Ertrag zu verschenken.** Das spart Wechselrichterkosten und reduziert die maximale Einspeiseleistung, die der Netzbetreiber am Anschlusspunkt freigeben muss.",
        },
        {
          typ: "tabelle",
          caption: "Spitzenleistung und Verlust durch Wechselrichter-Begrenzung (Clipping), Linz",
          kopf: ["Kennwert", "Süd 30°", "Süd 10°", "Ost-West 10°"],
          zeilen: [
            ["Maximale Stundenleistung je kWp", "0,88 kW", "0,82 kW", "0,76 kW"],
            ["Ertragsverlust bei Wechselrichter = 80 % der Modulleistung", "0,1 %", "0,0 %", "0,0 %"],
            ["Ertragsverlust bei Wechselrichter = 70 % der Modulleistung", "1,3 %", "0,3 %", "0,0 %"],
            ["Ertragsverlust bei Wechselrichter = 60 % der Modulleistung", "5,4 %", "2,9 %", "1,3 %"],
          ],
          hervorheben: 3,
          fussnote: "Eigene Auswertung der PVGIS-Stundenwerte 2019–2023 (14 % Verluste). Stundenmittel glätten kurze Spitzen; reale Kurzzeitspitzen liegen etwas höher. Die Auslegung erfolgt mit Wechselrichterdaten und Netzvorgaben im Einzelfall.",
        },
        {
          typ: "p",
          text: "Ein [DC/AC-Verhältnis](/wissen/lexikon#wechselrichter) von 1,3 bis 1,4 ist bei Ost-West deshalb Standard. Wenn der Netzbetreiber die Einspeiseleistung begrenzt, ist Ost-West oft der Schlüssel, um trotzdem viel Modulleistung zu installieren. Wie Netzbetreiber Einspeisung und Blindleistung steuern und welche Regelung große Anlagen brauchen, erklären die Ratgeber [Wechselrichter](/ratgeber/wechselrichter-photovoltaik) und [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss) sowie unsere Seite zum [Parkregler](/technik/parkregler).",
        },
      ],
    },
    {
      id: "eigenverbrauch",
      titel: "Eigenverbrauch im Betrieb: Was Ost-West im Lastgang bringt",
      tocLabel: "Eigenverbrauch",
      bloecke: [
        {
          typ: "p",
          text: "**Bei gleicher installierter Leistung erzeugt Ost-West weniger Strom, erreicht aber eine höhere Eigenverbrauchsquote – die Autarkie bleibt nahezu gleich.** Das zeigt unsere Simulation für einen Produktionsbetrieb bei Linz mit rund 400 MWh Jahresverbrauch, 30 kW Grundlast und 75 kW werktags zwischen 6 und 18 Uhr.",
        },
        {
          typ: "tabelle",
          caption: "Modellrechnung 300 kWp, Betrieb mit ca. 400 MWh/a bei Linz",
          kopf: ["System", "PV-Ertrag", "Eigenverbrauchsquote", "Autarkie", "Einspeisung", "max. Einspeiseleistung"],
          zeilen: [
            ["Süd 10°, 300 kWp", "317 MWh", "52 %", "41 %", "151 MWh", "215 kW"],
            ["Ost-West 10°, 300 kWp", "289 MWh", "56 %", "41 %", "126 MWh", "197 kW"],
          ],
          fussnote: "Eigene Simulation mit PVGIS-Stundenwerten Linz 2019–2023 und synthetischem Lastprofil; Modellwerte, keine Prognose für einen konkreten Betrieb. Details im Ratgeber PV-Anlage Größe berechnen.",
        },
        {
          typ: "p",
          text: "Die rund 28 MWh, die Ost-West weniger erzeugt, wären im Modell fast vollständig eingespeist worden – der Betrieb deckt mit beiden Varianten 41 % seines Bedarfs. Wirtschaftlich zählt deshalb der Wert des Überschusses: Wird er nur zu niedrigen Mittagspreisen verkauft, verliert Ost-West kaum etwas; bringt er über ein PPA oder eine [Energiegemeinschaft](/energiegemeinschaften) gute Erlöse, spricht mehr für die höhere Erzeugung. Diese Rechnung sollte für jedes Hallendach mit dem echten Lastgang gemacht werden.",
        },
      ],
    },
    {
      id: "planung",
      titel: "Checkliste für Ost-West auf dem Hallendach",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Statik prüfen: Eigengewicht, Ballast, Schnee- und Windlast für die gesamte Belegung nachweisen lassen.",
            "Randzonen und Ecken freihalten oder mechanisch sichern – dort sind die Windsogkräfte am höchsten.",
            "Wartungsgassen und Brandschutzabstände vor der Belegungsplanung festlegen, nicht danach.",
            "Wechselrichter mit DC/AC-Verhältnis von etwa 1,3 bis 1,4 auslegen und Ost- und Westseite auf getrennte MPP-Tracker legen.",
            "Netzanfrage mit der tatsächlichen Wechselrichterleistung stellen; eine eventuelle Einspeisebegrenzung mit einplanen.",
            "Monitoring je String vorsehen, damit Verschmutzung und Schnee auf flachen Modulen früh auffallen.",
          ],
        },
      ],
    },
    {
      id: "grenzen",
      titel: "Grenzen: Schnee, Verschmutzung, Statik",
      tocLabel: "Grenzen",
      bloecke: [
        {
          typ: "liste",
          punkte: [
            "**Schnee:** Flache Ost-West-Systeme mit 10° bleiben nach Schneefall am längsten bedeckt. In schneereichen Lagen verlieren sie im Winter mehr Ertrag und die Schneelast liegt voll auf den Modulen – siehe [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik).",
            "**Verschmutzung:** Flache Module reinigen sich schlechter durch Regen. In der Nähe von Stallabluft, Mühlen oder Staub aus der Produktion kann eine regelmäßige [Reinigung](/service/reinigung) sinnvoll sein.",
            "**Statik:** Mehr Module bedeuten mehr Last. Ost-West-Systeme sind aerodynamisch günstig und kommen oft mit weniger Ballast je Modul aus, die Gesamtlast auf dem Dach steigt dennoch.",
            "**Wartungswege und Brandschutz:** Dichte Belegung darf Wartungsgassen, Rauchabzüge und Brandschutzabstände nicht verdrängen.",
            "**Verschattung durch Aufbauten:** Lichtkuppeln, Lüftungsanlagen und Attiken werfen morgens und abends lange Schatten auf flache Module – gerade dann, wenn Ost-West seinen Vorteil ausspielen soll. Mehr im Ratgeber [Verschattung](/ratgeber/photovoltaik-verschattung).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie viel weniger Ertrag bringt Ost-West?",
      a: "Mit 10° Neigung rund 14 bis 20 % weniger je kWp als eine 30°-Südanlage. In Linz sind es laut PVGIS 950 statt 1.134 kWh/kWp, in Wien 975 statt 1.166 kWh/kWp.",
    },
    {
      q: "Warum wird auf Flachdächern oft Ost-West gebaut?",
      a: "Weil ohne Reihenabstand deutlich mehr Module aufs Dach passen. Auf derselben Fläche erzeugt eine Ost-West-Anlage dadurch meist rund ein Drittel mehr Strom, obwohl jedes einzelne kWp weniger liefert.",
    },
    {
      q: "Verringert Ost-West die Mittagsspitze?",
      a: "Ja, aber bei 10° Neigung moderat: Die maximale Leistung liegt rund 13 % unter Süd 30°, der Anteil der Erzeugung zwischen 11 und 15 Uhr sinkt von 52 auf 50 %. Morgens und abends liefert Ost-West dafür deutlich mehr.",
    },
    {
      q: "Kann der Wechselrichter bei Ost-West kleiner sein?",
      a: "Ja. Ein Wechselrichter mit 70 % der Modulleistung verursacht bei Ost-West laut Stundenauswertung praktisch keinen Ertragsverlust, bei Süd 30° rund 1,3 %. Das spart Kosten und schont den Netzanschluss.",
    },
    {
      q: "Ist Ost-West auch für Satteldächer sinnvoll?",
      a: "Ja, bei Ost-West-Firstrichtung ist die Belegung beider Dachseiten üblich. Mit 20 bis 30° Neigung liefern die Flächen in Linz rund 910 bis 935 kWh/kWp – etwa 80 % einer Südanlage, bei doppelter Fläche.",
    },
    {
      q: "Brauche ich für Ost-West einen eigenen Wechselrichter je Dachseite?",
      a: "Nicht zwingend einen eigenen Wechselrichter, aber getrennte MPP-Tracker. Ost- und Westmodule arbeiten zu unterschiedlichen Tageszeiten im Leistungsmaximum; in einem gemeinsamen String würden sie sich gegenseitig ausbremsen. Moderne Gewerbewechselrichter haben dafür mehrere Tracker.",
    },
    {
      q: "Passt Ost-West zu meinem Betrieb?",
      a: "Besonders gut, wenn der Betrieb früh beginnt oder bis in den Abend arbeitet, wenn der Netzanschluss knapp ist oder das Flachdach möglichst dicht belegt werden soll. Die Entscheidung sollte auf einer Simulation mit dem eigenen Lastgang beruhen.",
    },
  ],

  passend: [
    { href: "/gewerbe", titel: "PV für Gewerbe & Industrie", text: "Planung nach Lastgang, Hallen- und Flachdächer." },
    { href: "/ratgeber/photovoltaik-flachdach", titel: "Photovoltaik auf dem Flachdach", text: "Ballast, Statik und Hallendächer." },
    { href: "/ratgeber/pv-anlage-groesse-berechnen", titel: "PV-Größe berechnen", text: "Dimensionierung nach Lastgang." },
    { href: "/technik/parkregler", titel: "Parkregler", text: "Einspeisung und Blindleistung nach TOR." },
  ],

  quellen: [
    { titel: "EU JRC – PVGIS 5.3, Jahres- und Stundenwerte (PVcalc, seriescalc)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "EU JRC – PVGIS API, Dokumentation", url: "https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis/getting-started-pvgis/api-non-interactive-service_en", stand: "09/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen (Netzanschluss, Version 1.4)", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Photovoltaics Report (Juli 2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
    { titel: "HORA – Schneelast und Wind je Standort", url: "https://hora.gv.at/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Ost-West oder Süd?", text: "Wir simulieren beide Varianten für Ihr Dach.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Ost-West oder Süd – wir rechnen beide Varianten.",
    text: "Mit Ihrem Lastgang, der Statik Ihres Dachs und der Netzkapazität am Anschlusspunkt ermitteln wir die wirtschaftlichste Belegung.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Gewerbe & Industrie", href: "/gewerbe" },
  },
};

export default artikel;
