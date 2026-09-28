// Ratgeber: Lohnt sich Photovoltaik 2026 in Österreich? (Gruppe R1)
// Alle Szenarien mit dem gemeinsamen R1-Rechenkern (pvcalc.mjs) gerechnet und gerundet als Text eingetragen.
// Grundannahmen wie in photovoltaik-gewerbe und photovoltaik-amortisation: 1.000 kWh/kWp, 0,4 % Degradation,
// 25 Jahre, Strompreis +2 %/a, Überschuss 6 ct/kWh, Betriebskosten +2 %/a, Kalkulationszins 5 %.

const artikel = {
  slug: "photovoltaik-lohnt-sich",
  title: "Lohnt sich Photovoltaik 2026 in Österreich? Ehrliche Rechnung",
  seoTitle: "Lohnt sich Photovoltaik 2026 in Österreich? | Ökovolt",
  kurzTitel: "Lohnt sich Photovoltaik?",
  description:
    "Lohnt sich Photovoltaik 2026 in Österreich? Ehrliche Rechnung für Betriebe, Landwirtschaft, Gemeinden und Eigenheim – mit Szenarien, Grenzen und Förderlage.",
  excerpt:
    "Förderlotterie, schwankender Marktpreis, ElWG und das Ende des Nullsteuersatzes: Was 2026 für die Wirtschaftlichkeit zählt – mit sechs Szenarien für Betriebe, Landwirtschaft und Gemeinden und einer ehrlichen Rechnung fürs Eigenheim.",
  hauptKeyword: "lohnt sich photovoltaik österreich",
  keywords: [
    "Lohnt sich Photovoltaik 2026",
    "Lohnt sich Photovoltaik Österreich",
    "PV-Anlage Wirtschaftlichkeit Österreich",
    "Photovoltaik Rendite Betrieb",
    "Photovoltaik Landwirtschaft lohnt sich",
    "Photovoltaik Gemeinde Wirtschaftlichkeit",
    "Lohnt sich PV ohne Förderung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Home/download-2.jpg",
  bildAlt: "Aufgeständerte Photovoltaikmodule auf einem Flachdach mit Ballastschienen",
  badge: { wert: "6–9 J.", text: "Amortisation typischer Betriebsanlagen ohne Förderung, vor Steuern" },

  kurzFazit: [
    "**Ja – für die meisten Betriebe mit Tagverbrauch lohnt sich Photovoltaik 2026 auch ohne Förderung.** Unsere Szenarien für Gewerbe, Landwirtschaft, Gemeinde und Industrie amortisieren sich vor Steuern nach rund 6 bis 9 Jahren, bei 25 Jahren Laufzeit.",
    "Der wichtigste Hebel ist der **Eigenverbrauch**: Selbst genutzter Solarstrom ersetzt 15 bis 22 ct/kWh, Überschuss bringt am Markt 6 bis 9 ct (OeMAG-Marktpreis Jänner bis August 2026 im Schnitt ≈ 7,3 ct).",
    "Die **EAG-Förderung** ist 2026 eine Lotterie (Juni-Call nach 33 Sekunden ausgeschöpft). Sicher planbar ist dagegen der **Investitionsfreibetrag von 22 %** – aber nur für Anschaffungen bis 31.12.2026.",
    "**Nicht lohnend** sind Anlagen weit über dem Verbrauch, Dächer mit kurzer Restnutzungsdauer und Projekte, die nur mit Zuschuss und optimistischen Strompreisen aufgehen.",
    "**Im Eigenheim** dauert es länger: 10 kWp mit 20 % USt amortisieren sich bei 25 % Eigenverbrauch nach rund 15,5 Jahren, mit Wärmepumpe und E-Auto nach rund 13 Jahren.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich Photovoltaik 2026 in Österreich?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Photovoltaik lohnt sich 2026 in Österreich überall dort, wo ein großer Teil des Solarstroms zeitgleich selbst verbraucht wird – also vor allem in Betrieben, Landwirtschaft und öffentlichen Gebäuden mit Tagbetrieb.** Der Grund ist die Preisschere: Eine Kilowattstunde vom eigenen Dach kostet bei einer 100-kWp-Anlage rund 7,4 ct, Netzstrom kostet Nicht-Haushalte laut Eurostat (2. Halbjahr 2025, ohne USt) 23,2 ct bei 20 bis 500 MWh Jahresverbrauch, 19,9 ct bei 500 bis 2.000 MWh und 18,0 ct bei 2 bis 20 GWh.",
        },
        {
          typ: "kennzahl",
          wert: "7,4 ct",
          titel: "kostet eine Kilowattstunde vom eigenen Hallendach",
          text: "Stromgestehungskosten einer 100-kWp-Anlage für 75.000 € netto über 25 Jahre bei 5 % Kalkulationszins. Überschussstrom bringt am Markt derzeit 6 bis 9 ct/kWh.",
        },
        {
          typ: "p",
          text: "Anders als vor einigen Jahren trägt nicht mehr die Einspeisung die Rechnung, sondern die vermiedene Strombeschaffung. Eine Anlage, die auf den Lastgang ausgelegt ist, rechnet sich deutlich schneller als eine, die einfach das ganze Dach belegt. Wie das für Unternehmen im Detail aussieht – mit Beispielen für 100 und 500 kWp, Investitionsfreibetrag und AfA –, zeigt [Photovoltaik für Unternehmen](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "faktoren",
      titel: "Sechs Faktoren, die 2026 über die Wirtschaftlichkeit entscheiden",
      tocLabel: "Entscheidungsfaktoren",
      bloecke: [
        {
          typ: "p",
          text: "**Ob sich eine Anlage rechnet, entscheiden 2026 vor allem Eigenverbrauch, vermeidbarer Strompreis und Anschaffungspreis; Marktpreis, Förderung und ElWG verschieben das Ergebnis nur um einzelne Jahre.**",
        },
        {
          typ: "tabelle",
          caption: "Entscheidungsfaktoren für PV-Anlagen in Österreich, Stand September 2026",
          kopf: ["Faktor", "Lage 2026", "Wirkung auf die Rechnung"],
          zeilen: [
            ["Eigenverbrauch", "Betriebe mit Tagschicht 50–80 %, Lager oder Wochenendbetrieb deutlich weniger", "sehr hoch: 40 statt 60 % verlängern die Amortisation einer 100-kWp-Anlage von 6,2 auf 7,9 Jahre"],
            ["Strompreis", "Eurostat: 18,0–23,2 ct netto für Nicht-Haushalte, inkl. Leistungs- und Grundpreisen", "hoch: vermeidbar ist nur der arbeitsabhängige Teil"],
            ["Marktpreis für Überschuss", "OeMAG Jänner–August 2026 zwischen 5,7 und 9,0 ct/kWh", "mittel: 4 statt 6 ct kosten rund 0,4 Jahre"],
            ["EAG-Zuschuss", "Calls in Sekunden ausgeschöpft, Zukunft der PV-Förderung offen", "Bonus: rund 1 Jahr kürzere Amortisation, nicht planbar"],
            ["Investitionsfreibetrag", "22 % bis 31.12.2026, danach 15 %", "planbar: 3.795 € statt 2.588 € Steuerersparnis bei 75.000 € und 23 % KöSt"],
            ["ElWG", "70-%-Spitzenkappung, 0,05 ct/kWh Einspeisebeitrag ab 2027, Ansteuerbarkeit", "gering bei hohem Eigenverbrauch, spürbarer bei reinen Einspeiseanlagen"],
          ],
          minBreite: 720,
          fussnote: "Wirkungen am Beispiel einer 100-kWp-Anlage (750 €/kWp netto, 60 % Eigenverbrauch, 18 ct/kWh vermeidbarer Strompreis) mit den Grundannahmen dieses Artikels. Quellen: Eurostat nrg_pc_205, OeMAG, BMF/USP, PV&B Austria.",
        },
        {
          typ: "p",
          text: "Beim **Anschaffungspreis** zählt die Größe: Laut BMWET-Marktstatistik kosteten Anlagen mit 30 bis 50 kWp 2024 im Schnitt 806 €/kWp netto, Anlagen mit 5 kWp 1.551 €/kWp – fast doppelt so viel. Preise nach Größenklassen finden Sie unter [Photovoltaik Kosten 2026](/ratgeber/solaranlage-kosten). Wie der Marktpreis entsteht und warum er schwankt, erklären [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis) und [Negative Strompreise](/ratgeber/negative-strompreise).",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Und wenn die Strompreise wieder fallen?",
          text: "Auch dann trägt die Rechnung, solange der Eigenverbrauch stimmt: Bleibt der Strompreis 25 Jahre konstant, amortisiert sich die 100-kWp-Referenzanlage nach 6,5 statt 6,2 Jahren; bei 15 statt 18 ct vermeidbarem Preis nach 7,3 Jahren. Erst wenn niedriger Eigenverbrauch, niedriger Preis und schwacher Marktpreis zusammenkommen, wird es eng. Die vollständige Sensitivitätsanalyse steht unter [Amortisation und Rendite berechnen](/ratgeber/photovoltaik-amortisation#sensitivitaet).",
        },
      ],
    },
    {
      id: "szenarien",
      titel: "Beispiel-Szenarien: Gewerbe, Hotel, Landwirtschaft, Gemeinde, Industrie",
      tocLabel: "Beispiel-Szenarien",
      bloecke: [
        {
          typ: "p",
          text: "**Mit denselben Grundannahmen gerechnet, amortisieren sich typische Betriebsanlagen ohne Förderung nach 5,6 bis 9,9 Jahren – die Spanne erklärt sich fast vollständig durch den Eigenverbrauch.** Alle Werte vor Steuern, damit Gemeinden, pauschalierte Landwirte und Kapitalgesellschaften vergleichbar sind.",
        },
        {
          typ: "tabelle",
          caption: "Sechs Szenarien im Vergleich, ohne EAG-Zuschuss, vor Steuern, Stand September 2026",
          kopf: ["Szenario", "Anlage / Investition", "Eigenverbrauch / Strompreis", "Vorteil Jahr 1", "Amortisation", "IRR"],
          zeilen: [
            ["Produktionsbetrieb mit Tagschicht", "100 kWp / 75.000 €", "60 % / 18 ct", "11.700 €", "6,2 Jahre", "16,3 %"],
            ["Hotel mit Küche, Wäscherei, Wellness", "100 kWp / 75.000 €", "70 % / 18 ct", "12.900 €", "5,6 Jahre", "18,1 %"],
            ["Milchviehbetrieb (Melken, Kühlung)", "50 kWp / 42.500 €", "45 % / 18 ct", "4.950 €", "8,3 Jahre", "11,6 %"],
            ["Gemeinde: Schule und Bauhof, brutto", "50 kWp / 51.000 €", "45 % / 21,6 ct", "5.610 €", "8,8 Jahre", "10,9 %"],
            ["Industriebetrieb", "500 kWp / 300.000 €", "60 % / 15 ct", "51.000 €", "5,7 Jahre", "17,7 %"],
            ["Logistiklager, geringe Tageslast", "100 kWp / 75.000 €", "25 % / 18 ct", "7.500 €", "9,9 Jahre", "9,1 %"],
          ],
          markierteZeile: 0,
          hervorheben: 4,
          minBreite: 760,
          fussnote: "Beispielrechnungen, keine Angebote. Richtpreise netto: 750 €/kWp (100 kWp), 850 €/kWp (50 kWp), 600 €/kWp (500 kWp). Gemeinde ohne Vorsteuerabzug: 1.020 €/kWp brutto, Strompreis 18 ct + 20 % USt, Betriebskosten 18 €/kWp brutto. Betriebskosten sonst 15 €/kWp (500 kWp: 12 €/kWp). 1.000 kWh/kWp, 0,4 % Degradation, Strompreis +2 %/Jahr, Überschuss 6 ct/kWh, 25 Jahre, dynamische Amortisation.",
        },
        {
          typ: "p",
          text: "Mit einem EAG-Zuschuss der Kategorie C (Höchstsatz 130 €/kWp) verkürzt sich die Amortisation beim Milchviehbetrieb von 8,3 auf 7,1 Jahre, bei der Gemeinde von 8,8 auf 7,7 Jahre. Branchenspezifische Hinweise finden Sie unter [Photovoltaik in der Landwirtschaft](/landwirtschaft), [Photovoltaik für Hotellerie und Tourismus](/hotellerie-tourismus) und [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde).",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Besonderheiten bei Gemeinden und Landwirtschaft",
          text: "**Gemeinden** können die Umsatzsteuer nur abziehen, soweit die Anlage einem Betrieb gewerblicher Art dient – im hoheitlichen Bereich zählt der Bruttopreis. Außerdem gilt das Vergaberecht. **Pauschalierte Land- und Forstwirte** können keinen Investitionsfreibetrag nutzen; für Einspeiseumsätze gilt der Pauschalsteuersatz von 13 %. Für landwirtschaftliche Flächen sieht der EAG-Zuschuss einen Abschlag von 25 % vor, für [Agri-PV](/agri-pv) mit Mindestanforderungen dagegen einen Zuschlag.",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderlotterie und Investitionsfreibetrag: Was 2026 wirklich zählt",
      tocLabel: "Förderung & IFB",
      bloecke: [
        {
          typ: "p",
          text: "**Rechnen Sie jedes Projekt 2026 zuerst ohne EAG-Zuschuss – er ist ein Bonus, keine Planungsgröße.** Der Juni-Call 2026 war nach 33 Sekunden ausgeschöpft; PV&B Austria spricht von einer Förderlotterie. Staatssekretärin Elisabeth Zehetner hat im August 2026 angedeutet, dass künftig eher Speicher als PV gefördert werden könnten. Der letzte Call 2026 läuft von 8. bis 22. Oktober mit je 2 Mio. € pro Kategorie A bis D.",
        },
        {
          typ: "tabelle",
          caption: "Was Förderung und Steuer an einer 100-kWp-Anlage ändern (60 % Eigenverbrauch)",
          kopf: ["Variante", "Amortisation", "IRR"],
          zeilen: [
            ["Vor Steuern, ohne Zuschuss", "6,2 Jahre", "16,3 %"],
            ["Vor Steuern, mit EAG-Zuschuss 13.000 €", "5,2 Jahre", "19,7 %"],
            ["Nach 23 % KöSt, ohne IFB", "7,3 Jahre", "13,5 %"],
            ["Nach 23 % KöSt, mit IFB 22 %", "7,0 Jahre", "14,1 %"],
          ],
          hervorheben: 1,
          minBreite: 520,
          fussnote: "75.000 € netto, 18 ct/kWh, übrige Grundannahmen wie oben. Zuschuss: Kategorie C, Höchstsatz 130 €/kWp. Steuer: lineare AfA über 20 Jahre, Verlustverrechnung mit dem übrigen Betriebsgewinn unterstellt.",
        },
        {
          typ: "p",
          text: "Der [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik) ist dagegen planbar: 22 % für ökologische Wirtschaftsgüter mit Anschaffung oder Fertigstellung bis 31.12.2026, danach wieder 15 %. Bei 75.000 € und 23 % KöSt sind das 3.795 € statt 2.588 € Steuerersparnis. Ein Projekt deshalb unter Zeitdruck schlecht zu planen, kostet aber schnell mehr als die Differenz von rund 1.200 €. Details zu Calls und Nachweisen: [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss); welche Programme in Ihrem Fall in Frage kommen, zeigt der [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "nicht-lohnend",
      titel: "Wann sich Photovoltaik nicht lohnt",
      tocLabel: "Wann es sich nicht lohnt",
      bloecke: [
        {
          typ: "p",
          text: "**Photovoltaik lohnt sich nicht, wenn wenig Solarstrom selbst genutzt wird und gleichzeitig der vermeidbare Strompreis niedrig ist.** Ein Lager mit 25 % Eigenverbrauch, 15 ct Strompreis und ohne Preissteigerung braucht für 100 kWp rund 11,7 Jahre bis zur Amortisation, der interne Zinsfuß fällt auf 6,5 %, der Kapitalwert bei 5 % Kalkulationszins auf rund 11.000 €. Das ist kein Verlust, aber auch kein überzeugendes Investment.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Anlage weit über dem Bedarf:** Jede zusätzliche kWp, die nur einspeist, bringt 6 bis 9 ct statt 15 bis 22 ct – und ist nach ElWG in der Einspeiseleistung begrenzt.",
            "**Dach mit kurzer Restnutzungsdauer:** Demontage und Wiederaufbau nach wenigen Jahren fressen die Rendite. Erst sanieren, dann montieren.",
            "**Unklare Statik oder Asbestzement-Dach:** vorab klären; eine Ertüchtigung kann die Investition deutlich erhöhen.",
            "**Teurer Netzanschluss bei wenig Eigenverbrauch:** Braucht die Einspeisung eine neue Trafostation, verschlechtert das vor allem Anlagen mit hohem Überschussanteil.",
            "**Unsichere Nutzung:** gemietete Halle ohne langfristige Dachnutzungsvereinbarung oder geplante Betriebsaufgabe innerhalb der vierjährigen IFB-Behaltefrist.",
            "**Rechnung trägt nur mit Zuschuss:** Geht das Projekt nur mit EAG-Förderung und 4 % Strompreissteigerung auf, ist es zu knapp kalkuliert.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          text: "Ein niedriger Eigenverbrauch ist nicht immer endgültig: Tagsüber laufende Kälte, Wärmepumpen, eine E-Flotte oder ein Speicher mit Leistungspreis-Effekt können ihn heben. Ideen dazu sammelt [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "privat",
      titel: "Und im Eigenheim? 10 kWp mit 20 % Umsatzsteuer",
      tocLabel: "Eigenheim",
      bloecke: [
        {
          typ: "p",
          text: "**Im Einfamilienhaus lohnt sich Photovoltaik 2026 langsamer als im Betrieb: Eine 10-kWp-Anlage amortisiert sich bei durchschnittlichem Verbrauch nach rund 15,5 Jahren.** Der 0-%-Umsatzsteuersatz für PV-Module galt nur von 1.1.2024 bis 31.3.2025 (mit Übergang bis Ende 2025); 2026 fallen wieder 20 % an. Ob Private die Vorsteuer abziehen können, hängt vom Überwiegen der Einspeisung und vom Verzicht auf die Kleinunternehmerbefreiung ab; die Rechnung geht vom üblichen Fall ohne Vorsteuerabzug aus.",
        },
        {
          typ: "tabelle",
          caption: "10 kWp im Einfamilienhaus, brutto, Stand September 2026",
          kopf: ["Variante", "Investition nach Zuschuss", "Vorteil Jahr 1", "Amortisation", "IRR"],
          zeilen: [
            ["4.500 kWh Verbrauch, ohne Speicher (EV 25 %)", "14.100 €", "875 €", "15,5 Jahre", "4,2 %"],
            ["dasselbe ohne EAG-Zuschuss", "15.600 €", "875 €", "17,1 Jahre", "3,3 %"],
            ["4.500 kWh, mit 10-kWh-Speicher (EV 35 %)", "21.000 €", "995 €", "19,6 Jahre", "2,1 %"],
            ["8.000 kWh mit Wärmepumpe und E-Auto (EV 35 %)", "14.100 €", "1.045 €", "12,8 Jahre", "6,2 %"],
          ],
          hervorheben: 3,
          minBreite: 680,
          fussnote: "Beispielrechnung. 1.300 €/kWp netto + 20 % USt = 1.560 €/kWp; EAG-Zuschuss Kategorie A 150 €/kWp = 1.500 €. Speicher 700 €/kWh netto + USt = 8.400 €, Zuschuss 150 €/kWh = 1.500 €. Vermeidbarer Strompreis 23 ct/kWh brutto (Statistik Austria bewertete Eigenverbrauch 2024 mit 23,67 ct), +2 %/Jahr; Überschuss 6 ct/kWh; Betriebskosten 15 €/kWp, mit Speicher 20 €/kWp. EV = Anteil der Erzeugung, der selbst verbraucht wird.",
        },
        {
          typ: "p",
          text: "Einspeiseerlöse von Privatpersonen sind bis 12.500 kWh pro Jahr einkommensteuerfrei, wenn die Anlage höchstens 35 kWp Engpassleistung und 25 kW Anschlussleistung hat. Ein Speicher erhöht Autarkie und Notstromfähigkeit, verlängert im Beispiel aber die Amortisation. Für Premium-Objekte in alpiner Lage mit hohen Schneelasten gelten eigene Anforderungen – siehe [Photovoltaik für Chalets](/chalets). Ihre eigenen Werte rechnen Sie mit dem [Solarrechner](/solarrechner).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So prüfen Sie, ob es sich für Ihren Betrieb lohnt",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Lastgang besorgen", "Zwölf Monate Viertelstundenwerte beim Netzbetreiber anfordern und Grundlast, Wochenenden und Betriebsurlaub auswerten."],
            ["Dach und Netz prüfen", "Statik, Restnutzungsdauer, Brandschutz und Anschlusskapazität klären – der Netzzugangsantrag braucht Vorlauf."],
            ["Ohne Förderung rechnen", "Wirtschaftlichkeit mit vorsichtigen Annahmen: 0 bis 2 % Strompreissteigerung, 6 ct Überschusserlös, realistischer Eigenverbrauch."],
            ["Steuer und Förderung ergänzen", "IFB, AfA und gegebenenfalls EAG-Zuschuss mit der Steuerberatung einplanen – Antrag immer vor Inbetriebnahme."],
            ["Angebote vergleichen", "Gleiche Annahmen, gleiche Leistungsumfänge: die Checkliste [Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen) hilft."],
          ],
        },
        {
          typ: "p",
          text: "Wie Sie Amortisation, internen Zinsfuß und Kapitalwert selbst berechnen und welche Annahmen das Ergebnis am stärksten verschieben, erklärt [Amortisation und Rendite berechnen](/ratgeber/photovoltaik-amortisation).",
        },
        {
          typ: "tool",
          href: "/angebot",
          titel: "Wirtschaftlichkeit auf Basis Ihres Lastgangs",
          text: "Dachfläche, Jahresverbrauch und Betriebszeiten angeben – als Grundlage für Auslegung und Rechnung.",
          label: "Anfrage starten",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Lohnt sich Photovoltaik 2026 ohne Förderung?",
      a: "Für Betriebe mit Tagverbrauch ja. In unseren Szenarien amortisieren sich Anlagen ohne EAG-Zuschuss vor Steuern nach rund 6 bis 9 Jahren, bei 25 Jahren Laufzeit. Der Zuschuss verkürzt das um etwa ein Jahr, ist 2026 aber kaum planbar.",
    },
    {
      q: "Wie hoch ist die Rendite einer PV-Anlage im Betrieb?",
      a: "Der interne Zinsfuß vor Steuern liegt in unseren Szenarien zwischen rund 9 % (Lager mit 25 % Eigenverbrauch) und 18 % (Hotel mit 70 % Eigenverbrauch). Nach 23 % KöSt sinkt er um etwa 2 Prozentpunkte; der Investitionsfreibetrag federt das teilweise ab.",
    },
    {
      q: "Lohnt sich Photovoltaik für einen landwirtschaftlichen Betrieb?",
      a: "Meist ja, wenn tagsüber Melk-, Kühl- oder Lüftungstechnik läuft. Unser 50-kWp-Beispiel für einen Milchviehbetrieb amortisiert sich nach rund 8 Jahren ohne Zuschuss. Pauschalierte Betriebe können allerdings keinen Investitionsfreibetrag nutzen.",
    },
    {
      q: "Lohnt sich Photovoltaik für Gemeinden?",
      a: "Ja, vor allem auf Gebäuden mit Tagbetrieb wie Schulen, Bauhöfen oder Kläranlagen. Weil im hoheitlichen Bereich meist kein Vorsteuerabzug möglich ist, rechnen Gemeinden brutto; unser Beispiel amortisiert sich trotzdem nach knapp 9 Jahren. Sommerferien senken den Eigenverbrauch bei Schulen.",
    },
    {
      q: "Lohnt sich eine PV-Anlage im Einfamilienhaus 2026 noch?",
      a: "Ja, aber langsamer: Mit 20 % USt und 25 % Eigenverbrauch rechnen wir für 10 kWp mit rund 15,5 Jahren Amortisation. Mit Wärmepumpe und E-Auto sind es rund 13 Jahre. Ein Speicher verbessert die Rendite im Beispiel nicht.",
    },
    {
      q: "Sollte ich wegen des Investitionsfreibetrags noch 2026 bauen?",
      a: "Wenn das Projekt reif ist, ja: Der IFB sinkt am 1.1.2027 von 22 auf 15 %. Bei 75.000 € Investition und 23 % KöSt macht das rund 1.200 € Unterschied. Eine überhastete Planung mit falscher Dimensionierung kostet aber schnell mehr.",
    },
    {
      q: "Wann lohnt sich Photovoltaik nicht?",
      a: "Wenn wenig Solarstrom selbst verbraucht wird und der vermeidbare Strompreis niedrig ist, etwa bei Lagern mit geringer Tageslast. Auch Dächer, die bald saniert werden müssen, und Projekte, die nur mit Zuschuss aufgehen, sind kritisch.",
    },
  ],

  passend: [
    { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Anlagen für Betriebe, geplant nach Lastgang." },
    { href: "/landwirtschaft", titel: "Photovoltaik für die Landwirtschaft", text: "Stall-, Hallen- und Agri-PV." },
    { href: "/ratgeber/photovoltaik-amortisation", titel: "Amortisation berechnen", text: "IRR, Kapitalwert und Sensitivitäten." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Welche Förderungen für Ihr Projekt passen." },
  ],

  quellen: [
    { titel: "Eurostat – Strompreise für Nicht-Haushaltskunden (nrg_pc_205)", url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table", stand: "09/2026" },
    { titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (PDF)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "2025" },
    { titel: "OeMAG – Marktpreis für Ökostrom", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "WKO – EAG-Investitionszuschuss 2026 für Photovoltaik und Stromspeicher", url: "https://www.wko.at/foerderungen/eag-investitionszuschuss-2026-photovoltaik-stromspeicher", stand: "09/2026" },
    { titel: "PV&B Austria – PV-Fördercall: 33 Sekunden entscheiden über Zu- oder Absage", url: "https://pvbaustria.at/pv-foerdercall-33-sekunden-entscheiden-ueber-zu-oder-absage-pv-austria-kritisiert-foerderlotterie-und-fordert-neustart/", stand: "07/2026" },
    { titel: "WKO – Investitionsfreibetrag", url: "https://www.wko.at/steuern/investitionsfreibetrag", stand: "09/2026" },
    { titel: "BMF – Steuersatz für Photovoltaikmodule", url: "https://www.bmf.gv.at/themen/steuern/fuer-unternehmen/umsatzsteuer/informationen/steuersatz-fuer-photovoltaikmodule.html", stand: "09/2026" },
    { titel: "BMF – Überschusseinspeisung bei Photovoltaikanlagen von Privatpersonen", url: "https://www.bmf.gv.at/themen/klimapolitik/steuerliche-aspekte-bei-photovoltaikanlagen-von-privatpersonen/ueberschusseinspeisung.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Rechnet sich PV für Ihren Betrieb?", text: "Auslegung und Wirtschaftlichkeit auf Basis Ihres Lastgangs.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Wir rechnen Ihr Projekt ehrlich durch – ohne Förderung als Basis.",
    text: "Ökovolt plant, montiert und meldet PV-Anlagen für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich aus einer Hand.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Förder-Check", href: "/foerdercheck" },
  },
};

export default artikel;
