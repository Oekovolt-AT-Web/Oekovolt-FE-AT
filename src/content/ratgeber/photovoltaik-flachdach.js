// Ratgeber: Photovoltaik auf dem Flachdach
// Ertragsfaktoren aus dem Solarrechner (@/data/solarrechner), relative
// Neigungs-/Ausrichtungswerte aus PVGIS 5.3 (JRC), Standort Türkheim (48,06° N).

import { ANNAHMEN, AUSRICHTUNGEN, NEIGUNGEN, preisProKwp } from "@/data/solarrechner";

const zahl = (n) => Math.round(n).toLocaleString("de-DE");
const komma = (n, s = 1) => n.toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s });
const faktor = (liste, id) => liste.find((x) => x.id === id).faktor;

// Beispiel 100 m² Flachdach, davon rund 70 m² nach Rand- und Wartungsabständen belegbar,
// Beispielmodul 1,72 × 1,13 m mit 430 Wp, quer montiert.
const MODUL_WP = 430;
const SUED_MODULE = 20; // 15° Süd, Reihenabstand für 18,5° Sonnenhöhe (Mittag, 21. Dezember)
const OW_MODULE = 32; // 10° Ost-West, Doppelreihen mit 25 cm Wartungsgang
const SUED_KWP = (SUED_MODULE * MODUL_WP) / 1000;
const OW_KWP = (OW_MODULE * MODUL_WP) / 1000;
const SPEZ_SUED = ANNAHMEN.ertragProKwpSued * faktor(AUSRICHTUNGEN, "sued") * faktor(NEIGUNGEN, "flach");
const SPEZ_OW = ANNAHMEN.ertragProKwpSued * faktor(AUSRICHTUNGEN, "ost-west") * faktor(NEIGUNGEN, "flach");

const artikel = {
  slug: "photovoltaik-flachdach",
  title: "Photovoltaik auf dem Flachdach: Aufständerung, Statik, Ertrag",
  seoTitle: "Photovoltaik Flachdach: Aufständerung & Statik | Ökovolt",
  kurzTitel: "Photovoltaik Flachdach",
  description:
    "Photovoltaik auf dem Flachdach: Ost-West oder Süd, welcher Winkel, wie viel Ballast und Reihenabstand? Mit Rechenbeispiel, Statik-Checkliste und typischen Fehlern.",
  excerpt:
    "Auf dem Flachdach bestimmen Sie Ausrichtung und Neigung selbst – aber Statik, Windlast und Dachabdichtung entscheiden, was möglich ist. So planen Sie richtig.",
  hauptKeyword: "photovoltaik flachdach",
  keywords: ["Photovoltaik Flachdach", "PV-Anlage Flachdach Aufständerung", "Flachdach Ost-West oder Süd", "Solaranlage Flachdach Ballast", "Photovoltaik Flachdach Neigungswinkel", "Reihenabstand PV Flachdach", "Flachdach Statik Photovoltaik"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Home/download-2.jpg",
  bildAlt: "Aufgeständerte Modulreihen einer Photovoltaikanlage auf einem Flachdach",
  badge: { wert: `+${Math.round((OW_KWP / SUED_KWP - 1) * 100)} %`, text: "mehr Leistung auf gleicher Fläche mit Ost-West statt Süd" },

  kurzFazit: [
    "**Ein Flachdach eignet sich sehr gut für Photovoltaik**, weil Ausrichtung und Neigung frei wählbar sind. Die Module werden meist mit **10 bis 15 Grad** aufgeständert und mit Ballast statt Dachdurchdringungen gesichert.",
    `**Ost-West bringt mehr Leistung auf die Fläche:** Auf rund 70 m² belegbarer Fläche passen im Beispiel etwa ${komma(OW_KWP)} kWp Ost-West gegenüber ${komma(SUED_KWP)} kWp Süd – bei etwas geringerem Ertrag je kWp.`,
    "**Die Statik ist der Engpass:** Eine ballastierte Anlage bringt häufig 20 bis 35 kg/m² zusätzliche Last, in Rand- und Eckbereichen deutlich mehr. Ohne Prüfung der Tragreserven sollte nichts montiert werden.",
    "Die **Dachabdichtung** muss die Lebensdauer der Anlage (25 bis 30 Jahre) mitmachen. Ist eine Sanierung absehbar, gehört sie vor die Montage.",
  ],

  abschnitte: [
    {
      id: "eignung",
      titel: "Lohnt sich Photovoltaik auf dem Flachdach?",
      tocLabel: "Eignung",
      bloecke: [
        {
          typ: "p",
          text: "**Ja – ein Flachdach ist für Photovoltaik oft sogar besser planbar als ein Schrägdach.** Sie sind nicht an die Dachausrichtung gebunden, können die Modulreihen optimal stellen und kommen ohne Dachhaken durch die Eindeckung aus. Garagen, Anbauten, Bungalows, Mehrfamilienhäuser und Gewerbehallen haben häufig große, unverschattete Flachdachflächen.",
        },
        {
          typ: "p",
          text: "Die Kehrseite: Auf dem Flachdach sind **Windsog, Schneelast und Dachabdichtung** anspruchsvoller als auf dem geneigten Dach. Wirtschaftlich gilt dasselbe wie überall – entscheidend ist der [Eigenverbrauch](/wissen/lexikon#eigenverbrauch). Ob sich eine Anlage grundsätzlich rechnet, zeigt unser Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).",
        },
        {
          typ: "karten",
          items: [
            { titel: "Vorteile", text: "Freie Wahl von Ausrichtung und Neigung, keine Dachdurchdringung bei Ballastsystemen, gute Hinterlüftung, einfache Wartung, große zusammenhängende Flächen." },
            { titel: "Herausforderungen", text: "Tragfähigkeit für Ballast, Windsog an Rändern und Ecken, Schutz der Abdichtung, Entwässerung, Absturzsicherung bei der Montage und bei späteren Arbeiten." },
          ],
        },
      ],
    },
    {
      id: "ost-west-sued",
      titel: "Ost-West oder Süd: Welche Aufständerung ist besser?",
      tocLabel: "Ost-West oder Süd",
      bloecke: [
        {
          typ: "p",
          text: "**Für die meisten Eigenheime und Betriebe ist die Ost-West-Aufständerung mit rund 10 Grad die bessere Wahl, weil sie mehr Leistung auf dieselbe Fläche bringt und den Strom gleichmäßiger über den Tag verteilt.** Süd-Aufständerung liefert je kWp mehr Ertrag, braucht aber große Reihenabstände gegen gegenseitige Verschattung.",
        },
        {
          typ: "p",
          text: "Bei Ost-West stehen die Module Rücken an Rücken wie ein flaches Satteldach. Dadurch entsteht kaum Eigenverschattung, die Reihen können dicht an dicht liegen, und die geschlossene Form bietet dem Wind wenig Angriffsfläche – das spart Ballast. Mehr zur Ausrichtung selbst lesen Sie im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: 100 m² Flachdach, davon rund 70 m² belegbar – Süd- und Ost-West-Aufständerung im Vergleich",
          kopf: ["", "Süd, 15°", "Ost-West, 10°"],
          zeilen: [
            ["Module (430 Wp, quer)", `${SUED_MODULE}`, `${OW_MODULE}`],
            ["Anlagenleistung", `${komma(SUED_KWP)} kWp`, `${komma(OW_KWP)} kWp`],
            ["Ertrag je kWp (Solarrechner-Faktoren)", `${zahl(SPEZ_SUED)} kWh`, `${zahl(SPEZ_OW)} kWh`],
            ["Jahresertrag", `${zahl(SUED_KWP * SPEZ_SUED)} kWh`, `${zahl(OW_KWP * SPEZ_OW)} kWh`],
            ["Richtpreis Anlage", `${zahl(SUED_KWP * preisProKwp(SUED_KWP))} €`, `${zahl(OW_KWP * preisProKwp(OW_KWP))} €`],
            ["Erzeugungsprofil", "Spitze mittags", "breiter, morgens und abends mehr"],
            ["Ballastbedarf", "höher (offene Rückseite)", "geringer (geschlossene Form)"],
          ],
          hervorheben: 2,
          minBreite: 560,
          fussnote: `Vereinfachtes Rechenbeispiel, Süddeutschland. Reihenabstand Süd so gewählt, dass zur Mittagszeit am 21. Dezember (Sonnenhöhe rund 18,5° bei 48° nördlicher Breite) keine Verschattung entsteht; Ost-West mit 25 cm Wartungsgang je Doppelreihe. Ertrag nach den Faktoren unseres Solarrechners (${ANNAHMEN.ertragProKwpSued} kWh/kWp × Ausrichtung × Neigung), die für Ost-West auf dem Flachdach bewusst vorsichtig sind. Richtpreise aus dem Solarrechner ohne Flachdach-Aufschlag. Keine Angebote.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Wann Süd trotzdem sinnvoll ist",
          text: "Wenn die Fläche größer ist als der Bedarf, die Statik nur wenige Module zulässt oder Sie möglichst viel Ertrag im Winterhalbjahr möchten, kann eine Süd-Aufständerung mit 15 bis 20 Grad die bessere Lösung sein. Steilere Winkel erhöhen aber Windlast, Ballast und Reihenabstand spürbar.",
        },
      ],
    },
    {
      id: "neigung",
      titel: "Welcher Neigungswinkel ist auf dem Flachdach optimal?",
      tocLabel: "Neigungswinkel",
      bloecke: [
        {
          typ: "p",
          text: "**Der ertragsoptimale Winkel liegt in Deutschland bei rund 30 bis 35 Grad – auf dem Flachdach sind 10 bis 15 Grad trotzdem meist wirtschaftlicher.** Der Mehrertrag je Modul bei steiler Aufständerung ist kleiner, als viele erwarten, während Reihenabstand, Ballast und Windlast deutlich wachsen.",
        },
        {
          typ: "tabelle",
          caption: "Jahresertrag je kWp in Abhängigkeit von Neigung und Ausrichtung, relativ zum Optimum (PVGIS, Standort Schwaben)",
          kopf: ["Aufstellung", "Relativer Jahresertrag", "Einordnung"],
          zeilen: [
            ["Süd, 35°", "100 %", "Ertragsoptimum je Modul"],
            ["Süd, 30°", "99 %", "praktisch gleichwertig"],
            ["Süd, 15°", "94 %", "üblicher Kompromiss auf dem Flachdach"],
            ["Süd, 10°", "91 %", "geringer Reihenabstand"],
            ["Ost-West, 10°", "83 %", "dichteste Belegung, breites Tagesprofil"],
            ["Flach liegend, 0°", "84 %", "nicht empfehlenswert: Schmutz und Wasser bleiben liegen"],
          ],
          markierteZeile: 2,
          minBreite: 520,
          fussnote: "Eigene Auswertung mit PVGIS 5.3 (Joint Research Centre der EU-Kommission) für 48,06° N / 10,64° O, 14 % Systemverluste, ohne Verschattung und Schneebedeckung. In Norddeutschland sind die absoluten Erträge niedriger, die Verhältnisse ähnlich.",
        },
        {
          typ: "p",
          text: "Ein weiterer Grund gegen ganz flach liegende Module: Unter etwa 10 Grad reinigt Regen die Moduloberfläche schlecht, an der unteren Rahmenkante sammeln sich Schmutz und Moos. Viele Modulhersteller geben deshalb eine Mindestneigung vor. Wie sich Schmutz auf den Ertrag auswirkt, erklärt der Ratgeber [PV-Reinigung und Wartung](/ratgeber/photovoltaik-reinigung-wartung). Wie viel eine Anlage je nach Region insgesamt liefert, zeigt [Photovoltaik-Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
      ],
    },
    {
      id: "reihenabstand",
      titel: "Wie groß muss der Reihenabstand sein?",
      tocLabel: "Reihenabstand",
      bloecke: [
        {
          typ: "p",
          text: "**Als Faustregel gilt bei Süd-Aufständerung: Der freie Abstand zwischen zwei Reihen sollte rund das Dreifache der Aufstellhöhe betragen.** Das entspricht einer Sonnenhöhe von etwa 18 Grad – so hoch steht die Sonne in Süddeutschland am kürzesten Tag des Jahres mittags. In Norddeutschland steht sie nur rund 13 Grad hoch, dort sind größere Abstände nötig oder etwas Winterverschattung wird bewusst in Kauf genommen.",
        },
        {
          typ: "tabelle",
          caption: "Rechnerischer Reihenabstand für ein 1,13 m breites Modul (Querformat), Süd-Aufständerung",
          kopf: ["Neigung", "Aufstellhöhe", "Freier Abstand Süddeutschland (18,5°)", "Freier Abstand Norddeutschland (13°)"],
          zeilen: [
            ["10°", "0,20 m", "0,59 m", "0,85 m"],
            ["15°", "0,29 m", "0,87 m", "1,27 m"],
            ["20°", "0,39 m", "1,16 m", "1,67 m"],
            ["30°", "0,56 m", "1,69 m", "2,45 m"],
          ],
          hervorheben: 2,
          minBreite: 600,
          fussnote: "Aufstellhöhe = Modulbreite × sin(Neigung); freier Abstand = Aufstellhöhe ÷ tan(Sonnenhöhe am 21. Dezember, 12 Uhr Sonnenzeit). Hochkant montierte Module (1,72 m) brauchen etwa 1,5-mal so viel Abstand. Die tatsächliche Planung erfolgt mit Simulationssoftware.",
        },
        {
          typ: "p",
          text: "Die Rechnung zeigt, warum steile Winkel auf dem Flachdach selten lohnen: Von 15 auf 30 Grad verdoppelt sich der Abstand fast, während der Ertrag je Modul nur um rund 5 Prozent steigt. Unter dem Strich passt deutlich weniger Leistung aufs Dach. Wie Schatten auf einzelne Module wirkt, lesen Sie im Ratgeber [Photovoltaik und Verschattung](/ratgeber/photovoltaik-verschattung).",
        },
      ],
    },
    {
      id: "ballast-statik",
      titel: "Ballast, Windlast und Statik: Was hält das Dach aus?",
      tocLabel: "Ballast & Statik",
      bloecke: [
        {
          typ: "p",
          text: "**Flachdachanlagen werden meist mit Ballast – etwa Betonsteinen oder Kies – gegen Windsog gesichert, damit die Dachabdichtung nicht durchbohrt werden muss.** Wie viel Gewicht nötig ist, berechnet der Hersteller des Montagesystems nach DIN EN 1991-1-4 aus Windzone, Gebäudehöhe, Geländekategorie, Attikahöhe und Modulneigung.",
        },
        {
          typ: "tabelle",
          caption: "Typische Flächenlasten einer ballastierten Flachdachanlage (Richtwerte)",
          kopf: ["Bestandteil", "Last", "Hinweis"],
          zeilen: [
            ["Module", "ca. 10–12 kg/m²", "Glas-Glas-Module schwerer"],
            ["Unterkonstruktion", "ca. 1,5–3 kg/m²", "Aluminium, Bautenschutzmatten"],
            ["Ballast Dachmitte", "ca. 6–19 kg/m²", "abhängig von Windzone und Neigung"],
            ["Gesamt Dachmitte", "ca. 20–35 kg/m²", "Randbereich etwa doppelt, Ecken bis dreifach"],
          ],
          minBreite: 520,
          fussnote: "Richtwerte aus Herstellerangaben und Fachveröffentlichungen. Maßgeblich ist allein der projektbezogene Ballastplan des Montagesystems in Verbindung mit der Tragwerksprüfung.",
        },
        { typ: "h3", text: "Die drei Befestigungsarten" },
        {
          typ: "liste",
          punkte: [
            "**Ballastiert:** Keine Durchdringung der Abdichtung, schnell montiert. Voraussetzung sind ausreichende Tragreserven.",
            "**Mechanisch verankert:** Die Unterkonstruktion wird mit der Tragkonstruktion verbunden, jede Durchdringung fachgerecht eingedichtet. Sinnvoll bei geringer Tragfähigkeit, etwa bei Leichtbauhallen.",
            "**Hybrid oder verklebt:** Weniger Ballast durch punktuelle Verankerung oder Systeme, die mit der Dachbahn verbunden werden. Nur mit freigegebener Kombination aus Dachbahn und Montagesystem.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Schnee nicht vergessen",
          text: "Zwischen den Modulreihen kann sich Schnee anhäufen. Die Schneelast nach DIN EN 1991-1-3 steigt dort örtlich an – in schneereichen Regionen wie dem Allgäu ist das oft der maßgebliche Lastfall. Wie Anlagen im Winter reagieren, erklärt der Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).",
        },
        {
          typ: "p",
          text: "Bei gedämmten Warmdächern kommt die **Druckfestigkeit der Dämmung** hinzu: Ballaststeine und Auflagepunkte erzeugen Punktlasten, die weiche Dämmstoffe dauerhaft eindrücken können. Lastverteilende Schienen oder Matten schaffen Abhilfe. Bei Leichtbau- und Trapezblechdächern muss eine Tragwerksplanerin oder ein Tragwerksplaner die Reserven rechnerisch nachweisen.",
        },
      ],
    },
    {
      id: "abdichtung-brandschutz",
      titel: "Dachabdichtung, Gründach, Blitz- und Brandschutz",
      tocLabel: "Abdichtung & Brandschutz",
      bloecke: [
        {
          typ: "p",
          text: "**Die Photovoltaikanlage liegt 25 bis 30 Jahre auf dem Dach – die Abdichtung darunter sollte mindestens so lange halten.** Eine spätere Sanierung bedeutet Demontage, Zwischenlagerung und Neumontage aller Module. Prüfen Sie deshalb vorab Alter und Zustand der Dachbahnen.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Materialverträglichkeit:** Bautenschutzmatten und Auflager müssen zur Dachbahn passen (zum Beispiel Kunststoffbahnen, Bitumen, EPDM), sonst drohen Versprödung oder Weichmacherwanderung.",
            "**Entwässerung:** Gullys, Notüberläufe und Wasserwege bleiben frei und zugänglich, Ballast darf keine Wasserstaus verursachen.",
            "**Wartungswege:** Genug Platz, um Dachbahnen, Abläufe und Module zu inspizieren.",
            "**Blitzschutz:** Ist eine äußere Blitzschutzanlage vorhanden, müssen die Trennungsabstände zu Modulen und Gestell eingehalten werden.",
            "**Brandwände:** An Reihen- und Doppelhäusern gelten landesrechtliche Abstände zu Brandwänden. Die Musterbauordnung wurde 2022 und 2024 gelockert, die Länder setzen das unterschiedlich um.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Solargründach: Begrünung und PV kombinieren",
          text: "Extensive Begrünung dient zugleich als Ballast, hält Regenwasser zurück und kühlt die Umgebung – die Verbraucherzentrale NRW nennt Leistungssteigerungen von bis zu 4 % im Jahresmittel. Die Pflanzen dürfen die Modulunterkante nicht erreichen, deshalb höher aufständern und etwas größere Abstände planen.",
        },
      ],
    },
    {
      id: "genehmigung-kosten",
      titel: "Genehmigung und Kosten einer Flachdachanlage",
      tocLabel: "Genehmigung & Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Solaranlagen auf Dachflächen sind in allen Bundesländern grundsätzlich verfahrensfrei, auch aufgeständert.** In Bayern etwa regelt das Art. 57 Abs. 1 Nr. 3 BayBO. Ausnahmen sind Denkmalschutz, besondere Festsetzungen im Bebauungsplan oder Gestaltungssatzungen. Einzelheiten stehen im Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung) und unter [Baurecht](/forderungen/baurecht).",
        },
        {
          typ: "p",
          text: `Preislich liegen Flachdachanlagen meist etwas über vergleichbaren Schrägdachanlagen. Fachportale nennen für schlüsselfertige Anlagen rund 15 bis 25 Prozent Mehrkosten – für das Aufständerungssystem, Ballast, Kran oder Materialaufzug, Absturzsicherung und gegebenenfalls eine statische Prüfung. Große Flächen gleichen das teilweise aus, weil der Preis je kWp mit der Anlagengröße sinkt: Unser Solarrechner rechnet mit rund ${zahl(preisProKwp(10))} € je kWp bei 10 kWp und ${zahl(preisProKwp(20))} € bei 20 kWp. Die Aufschlüsselung finden Sie im Ratgeber [Solaranlage Kosten](/ratgeber/solaranlage-kosten).`,
        },
        {
          typ: "tabelle",
          caption: "Kostenpunkte, die bei Flachdachanlagen zusätzlich anfallen können",
          kopf: ["Posten", "Wann nötig", "Worauf achten"],
          zeilen: [
            ["Statische Prüfung", "bei unklaren Reserven, Leichtbau, Warmdach", "schriftlicher Nachweis inkl. Ballastplan"],
            ["Aufständerungssystem & Ballast", "immer", "Ballastplan zur Windzone, Schutzmatten"],
            ["Kran / Materialaufzug", "ab größeren Anlagen oder hohen Gebäuden", "im Angebot ausgewiesen?"],
            ["Absturzsicherung", "Montage und spätere Wartung", "Seitenschutz oder Anschlagpunkte dauerhaft?"],
            ["Dachsanierung vorab", "Abdichtung älter oder schadhaft", "zeitlich mit PV-Montage koordinieren"],
          ],
          minBreite: 600,
        },
        { typ: "tool", href: "/solarrechner", titel: "Ertrag und Amortisation für Ihr Dach", text: "Wählen Sie „Flachdach“ und Ost/West oder Süd – mit Speicher und 20-Jahres-Cashflow.", label: "Zum Solarrechner" },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler bei Flachdach-Photovoltaik",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Statik „nach Gefühl“:** Ballast wird nach Faustwert verteilt, ohne Ballastplan und Tragwerksnachweis.",
            "**Zu steil aufgeständert:** Mehr Ertrag je Modul, aber weniger Module, mehr Ballast und Verschattung im Winter.",
            "**Alte Abdichtung überbaut:** Nach wenigen Jahren muss die Anlage für die Dachsanierung wieder herunter.",
            "**Rand- und Eckzonen ignoriert:** Dort wirkt der stärkste Windsog – zu wenig Ballast oder zu geringe Randabstände sind ein Sicherheitsrisiko.",
            "**Abläufe zugestellt:** Stehendes Wasser belastet Dach und Unterkonstruktion.",
            "**Keine Wartungswege:** Module und Dachbahn lassen sich später nicht mehr kontrollieren.",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So gehen Sie bei der Planung vor",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Dach dokumentieren", "Baujahr, Dachaufbau, Abdichtung, letzte Sanierung und vorhandene Statik-Unterlagen zusammentragen."],
            ["Bedarf klären", "Stromverbrauch sowie geplante Wärmepumpe oder E-Auto festhalten. Hilfe gibt der Ratgeber [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen)."],
            ["Vor-Ort-Prüfung", "Fachbetrieb prüft Tragreserven, Rand- und Eckzonen, Verschattung, Blitzschutz und Zählerschrank."],
            ["Belegung und Ballastplan", "Simulation von Ost-West- und Süd-Variante, Ballastplan des Montagesystems, bei Bedarf statischer Nachweis."],
            ["Angebot vergleichen", "Auf ausgewiesenen Ballast, Schutzmatten, Kran und Absturzsicherung achten – mehr dazu unter [Photovoltaik-Angebot vergleichen](/ratgeber/photovoltaik-angebot-vergleichen)."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Welcher Winkel ist bei Photovoltaik auf dem Flachdach am besten?", a: "Wirtschaftlich meist 10 bis 15 Grad. Steilere Winkel bringen je Modul nur wenige Prozent mehr Ertrag, erfordern aber größere Reihenabstände und mehr Ballast. Ost-West-Systeme werden typischerweise mit rund 10 Grad montiert." },
    { q: "Wie viel kWp passen auf 100 m² Flachdach?", a: `Das hängt von Rand- und Wartungsabständen ab. Im Beispiel mit rund 70 m² belegbarer Fläche passen etwa ${komma(SUED_KWP)} kWp bei Süd-Aufständerung mit 15 Grad oder ${komma(OW_KWP)} kWp bei Ost-West mit 10 Grad.` },
    { q: "Wie viel Ballast braucht eine PV-Anlage auf dem Flachdach?", a: "In der Dachmitte liegen die Gesamtlasten inklusive Modulen oft bei 20 bis 35 kg/m², an Rändern und Ecken deutlich höher. Die genaue Menge ergibt sich aus dem Ballastplan des Montagesystems nach Windzone, Gebäudehöhe und Neigung." },
    { q: "Kann man Solarmodule flach auf das Flachdach legen?", a: "Technisch ja, empfehlenswert ist es selten. Ohne Neigung bleiben Schmutz, Laub und Wasser liegen, der Ertrag sinkt, und viele Modulhersteller schreiben eine Mindestneigung vor. Eine leichte Aufständerung von etwa 10 Grad ist fast immer die bessere Lösung." },
    { q: "Braucht man für PV auf dem Flachdach eine Baugenehmigung?", a: "In der Regel nicht: Solaranlagen auf Dächern sind nach den Landesbauordnungen verfahrensfrei. Prüfen sollten Sie Denkmalschutz, Bebauungsplan und bei Reihenhäusern die Abstände zu Brandwänden. Mehr im Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung)." },
    { q: "Hält meine Garage eine Solaranlage aus?", a: "Massivgaragen haben häufig Reserven, Fertiggaragen und Holzkonstruktionen oft nicht. Entscheidend sind Herstellerangaben oder ein statischer Nachweis. Eine leichte, verankerte Unterkonstruktion kann helfen, wenn Ballast nicht möglich ist." },
    { q: "Ist eine Flachdachanlage teurer als eine Anlage auf dem Schrägdach?", a: "Meist etwas, weil Aufständerung, Ballast, Materialtransport und Absturzsicherung hinzukommen. Fachportale nennen rund 15 bis 25 Prozent Mehrkosten. Bei großen Flächen relativiert sich das durch den niedrigeren Preis je kWp." },
  ],

  howTo: {
    name: "Photovoltaik auf dem Flachdach planen",
    schritte: [
      { name: "Dach dokumentieren", text: "Dachaufbau, Alter der Abdichtung und Statik-Unterlagen zusammentragen." },
      { name: "Bedarf klären", text: "Stromverbrauch und geplante Verbraucher wie Wärmepumpe oder E-Auto festhalten." },
      { name: "Vor-Ort-Prüfung", text: "Tragreserven, Rand- und Eckzonen, Verschattung und Blitzschutz prüfen lassen." },
      { name: "Belegung und Ballastplan", text: "Ost-West- und Süd-Variante simulieren und Ballastplan erstellen lassen." },
      { name: "Angebote vergleichen", text: "Ballast, Schutzmatten, Kran und Absturzsicherung im Angebot prüfen." },
    ],
  },

  passend: [
    { href: "/ratgeber/photovoltaik-ost-west", titel: "Photovoltaik Ost-West", text: "Ertrag und Eigenverbrauch im Vergleich zu Süd." },
    { href: "/ratgeber/photovoltaik-verschattung", titel: "Photovoltaik und Verschattung", text: "Was Schatten kostet und was dagegen hilft." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und was im Komplettpreis steckt." },
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik vom Fachbetrieb", text: "Planung, Montage und Anmeldung aus einer Hand." },
  ],

  quellen: [
    { titel: "Joint Research Centre der EU-Kommission – PVGIS Photovoltaic Geographical Information System (Version 5.3)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "Bayerische Bauordnung – Art. 57 Verfahrensfreie Bauvorhaben", url: "https://www.gesetze-bayern.de/Content/Document/BayBO-57", stand: "09/2026" },
    { titel: "Solarenergie-Förderverein Deutschland – Abstände für PV-Anlagen auf Reihenhäusern (Änderung der Musterbauordnung)", url: "https://www.sfv.de/abstaende-fuer-pv-anlagen-auf-reihenhaeusern", stand: "09/2026" },
    { titel: "Verbraucherzentrale NRW – Solargründach: Photovoltaik und Dachbegrünung kombinieren", url: "https://www.verbraucherzentrale.nrw/mehrgruen-solargruendach", stand: "09/2026" },
    { titel: "photovoltaik.info – Installation auf dem Flachdach: Aufständerung und Ballastierung", url: "https://www.photovoltaik.info/installation-flachdach-aufstaenderung-ballastierung/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Ost-West oder Süd?", text: "Beide Varianten für Ihr Flachdach durchrechnen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Wir prüfen Ihr Flachdach vor Ort.",
    text: "Tragreserven, Abdichtung, Rand- und Eckzonen und Verschattung – daraus entsteht eine Belegung mit Ballastplan und ein nachvollziehbares Angebot.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
