// Ratgeber: Amortisation & Rendite einer PV-Anlage berechnen (Gruppe R1)
// Alle Zahlen mit dem gemeinsamen R1-Rechenkern (pvcalc.mjs) ermittelt und gerundet als Text eingetragen.
// Referenzfall wie in photovoltaik-gewerbe: 100 kWp, 750 €/kWp netto, 60 % Eigenverbrauch, 18 ct/kWh,
// 1.000 kWh/kWp, 0,4 % Degradation, +2 %/a Strompreis, 6 ct/kWh Überschuss, 15 €/kWp Betriebskosten +2 %/a,
// 25 Jahre, Kalkulationszins 5 %.

const artikel = {
  slug: "photovoltaik-amortisation",
  title: "Amortisation und Rendite einer PV-Anlage berechnen: Methoden 2026",
  seoTitle: "PV-Amortisation & Rendite berechnen 2026 | Ökovolt",
  kurzTitel: "Amortisation & Rendite",
  description:
    "Amortisation einer PV-Anlage berechnen: statisch und dynamisch, IRR, Kapitalwert, Stromgestehungskosten, Sensitivitäten, Steuereffekt und typische Rechenfehler.",
  excerpt:
    "Wie Sie Amortisation, internen Zinsfuß, Kapitalwert und Stromgestehungskosten einer PV-Anlage korrekt berechnen – mit Referenzfall 100 kWp, Sensitivitätstabelle, Steuer- und Speichereffekt und den häufigsten Fehlern in Angeboten.",
  hauptKeyword: "amortisation pv-anlage berechnen",
  keywords: [
    "Amortisation PV-Anlage berechnen",
    "Photovoltaik Rendite berechnen",
    "PV-Anlage IRR",
    "Stromgestehungskosten Photovoltaik",
    "Kapitalwert Photovoltaik",
    "Amortisation Photovoltaik Gewerbe",
    "Amortisation PV mit Speicher",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Referenzen/Projekte-2.jpg",
  bildAlt: "Nahaufnahme eines Photovoltaik-Modulfelds im Gegenlicht",
  badge: { wert: "7,4 ct", text: "Stromgestehungskosten je kWh, 100-kWp-Dachanlage" },

  kurzFazit: [
    "**Die statische Amortisation berechnen Sie als Investition ÷ jährlicher Vorteil; genauer ist die dynamische Rechnung Jahr für Jahr mit Degradation, Preisentwicklung und steigenden Betriebskosten.**",
    "Referenzfall 100 kWp, 75.000 € netto, 60 % Eigenverbrauch, 18 ct/kWh: **statisch 6,4 Jahre, dynamisch 6,2 Jahre**, interner Zinsfuß ≈ 16 %, Kapitalwert (5 %) ≈ 110.000 €, Stromgestehungskosten ≈ 7,4 ct/kWh.",
    "Am stärksten wirken **Eigenverbrauch, vermeidbarer Strompreis und Investition**: 40 statt 60 % Eigenverbrauch verlängern die Amortisation auf 7,9 Jahre, eine ungünstige Kombination mehrerer Annahmen auf 11,4 Jahre.",
    "Nach 23 % KöSt sinkt der interne Zinsfuß auf 13,5 %, mit **Investitionsfreibetrag 22 %** auf 14,1 %. Ein Speicher, der nur den Eigenverbrauch erhöht, verlängert die Amortisation auf rund 10 Jahre.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie berechnet man die Amortisation einer PV-Anlage?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Die Amortisation einer PV-Anlage ist erreicht, wenn die kumulierten jährlichen Vorteile – Stromersparnis plus Überschusserlös minus Betriebskosten – die Investition decken.** Die einfache Formel teilt die Investition durch den Vorteil des ersten Jahres. Für Investitionsentscheidungen im Betrieb reicht das nicht: Dort zählen zusätzlich Rendite, Kapitalwert und Stromgestehungskosten.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Die fünf Kennzahlen auf einen Blick",
          text: "**Statische Amortisation** = Investition ÷ Vorteil Jahr 1. **Dynamische Amortisation** = Jahr, in dem der kumulierte Cashflow null erreicht. **Interner Zinsfuß (IRR)** = Zinssatz, bei dem der Barwert aller Cashflows null ist. **Kapitalwert (NPV)** = Summe aller abgezinsten Cashflows minus Investition. **Stromgestehungskosten (LCOE)** = (Investition + Barwert der Betriebskosten) ÷ Barwert der Erzeugung.",
        },
        {
          typ: "p",
          text: "Ob sich Photovoltaik für Ihren Betriebstyp grundsätzlich lohnt, beantwortet [Lohnt sich Photovoltaik 2026?](/ratgeber/photovoltaik-lohnt-sich). Hier geht es um die Methode: welche Kennzahl was aussagt, welche Annahme wie stark wirkt und wo Angebote häufig schönrechnen.",
        },
      ],
    },
    {
      id: "statisch-dynamisch",
      titel: "Statische und dynamische Amortisation im Vergleich",
      tocLabel: "Statisch vs. dynamisch",
      bloecke: [
        {
          typ: "p",
          text: "**Die statische Amortisation unterstellt, dass jedes Jahr gleich ist; die dynamische rechnet Jahr für Jahr mit sinkendem Modulertrag, steigenden Strompreisen und steigenden Betriebskosten.** Im Referenzfall liegen beide nah beieinander, weil sich Degradation und Preissteigerung teilweise aufheben.",
        },
        {
          typ: "tabelle",
          caption: "Referenzfall 100 kWp: Rechenweg der statischen Amortisation, Stand September 2026",
          kopf: ["Schritt", "Rechnung", "Ergebnis"],
          zeilen: [
            ["Investition", "100 kWp × 750 €/kWp netto", "75.000 €"],
            ["Jahresertrag", "100 kWp × 1.000 kWh/kWp", "100.000 kWh"],
            ["Stromersparnis", "60.000 kWh Eigenverbrauch × 18 ct", "10.800 €"],
            ["Überschusserlös", "40.000 kWh × 6 ct", "2.400 €"],
            ["Betriebskosten", "100 kWp × 15 €", "− 1.500 €"],
            ["Vorteil Jahr 1", "Summe", "11.700 €"],
            ["Statische Amortisation", "75.000 € ÷ 11.700 €", "6,4 Jahre"],
            ["Dynamische Amortisation", "Jahr für Jahr, siehe Fußnote", "6,2 Jahre"],
          ],
          markierteZeile: 7,
          hervorheben: 2,
          minBreite: 560,
          fussnote: "Beispielrechnung, kein Angebot. 750 €/kWp = Richtwert 2026 für 100 kWp auf Basis der BMWET-Marktstatistik; 1.000 kWh/kWp = österreichisches Mittel (Ost-West-Flachdach eher 900–950). Dynamisch: 0,4 % Degradation/Jahr, vermeidbarer Strompreis +2 %/Jahr, Überschusserlös konstant, Betriebskosten (Wartung, Versicherung, Monitoring, Rücklage Wechselrichtertausch) +2 %/Jahr.",
        },
        {
          typ: "p",
          text: "Bleibt der Strompreis dagegen 25 Jahre konstant, dreht sich das Verhältnis: Die dynamische Amortisation steigt auf 6,5 Jahre und liegt damit über der statischen. Welcher spezifische Ertrag an Ihrem Standort realistisch ist, zeigt [Ertrag pro kWp in Österreich](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
      ],
    },
    {
      id: "rendite",
      titel: "IRR, Kapitalwert und Stromgestehungskosten: die aussagekräftigeren Kennzahlen",
      tocLabel: "IRR, Kapitalwert, LCOE",
      bloecke: [
        {
          typ: "p",
          text: "**Die Amortisationszeit misst nur, wann das Geld zurück ist; Rendite und Kapitalwert messen, wie viel die Anlage über ihre gesamte Laufzeit verdient.** Zwei Anlagen mit 7 Jahren Amortisation können sehr unterschiedlich rentabel sein, je nachdem, wie hoch die Überschüsse danach ausfallen.",
        },
        {
          typ: "tabelle",
          caption: "Kennzahlen des Referenzfalls 100 kWp bei unterschiedlichen Kalkulationszinsen",
          kopf: ["Kennzahl", "Beantwortet die Frage", "3 %", "5 %", "7 %"],
          zeilen: [
            ["Interner Zinsfuß (IRR), 25 Jahre", "Wie verzinst sich das eingesetzte Kapital?", "16,3 %", "16,3 %", "16,3 %"],
            ["Kapitalwert (NPV)", "Wie viel Mehrwert entsteht über dem Kalkulationszins?", "156.000 €", "110.000 €", "76.000 €"],
            ["Stromgestehungskosten (LCOE)", "Was kostet eine kWh vom eigenen Dach?", "6,4 ct", "7,4 ct", "8,5 ct"],
          ],
          hervorheben: 3,
          minBreite: 640,
          fussnote: "Annahmen wie im Referenzfall. Der IRR ist unabhängig vom Kalkulationszins; Kapitalwert und Stromgestehungskosten hängen davon ab. Über 20 statt 25 Jahre gerechnet sinkt der IRR auf 15,7 %, der Kapitalwert (5 %) auf 85.000 €. Zum Vergleich: 500 kWp für 600 €/kWp und 12 €/kWp Betriebskosten kommen auf 5,9 ct/kWh.",
        },
        {
          typ: "p",
          text: "Als **Kalkulationszins** setzen Unternehmen ihre Kapitalkosten an – den gewichteten Zins aus Fremd- und Eigenkapital. Ist der IRR deutlich höher, lohnt sich die Investition auch bei Kreditfinanzierung. Die **Stromgestehungskosten** sind der direkteste Vergleich zum Einkauf: Solange sie unter dem vermeidbaren Strompreis liegen, verdient jede selbst genutzte Kilowattstunde. Liegen sie über dem Marktpreis für Überschuss (derzeit 6 bis 9 ct), verliert jede nur eingespeiste Kilowattstunde leicht – ein starkes Argument, Anlagen am Eigenverbrauch auszurichten. Finanzierungswege zeigt die Seite [Finanzierung](/service/finanzierung).",
        },
      ],
    },
    {
      id: "sensitivitaet",
      titel: "Sensitivitätsanalyse: Welche Annahme wie stark wirkt",
      tocLabel: "Sensitivitäten",
      bloecke: [
        {
          typ: "p",
          text: "**Eigenverbrauch, vermeidbarer Strompreis und Investition verschieben die Amortisation am stärksten; Marktpreis und Kalkulationszins wirken deutlich schwächer.** Die Tabelle verändert jeweils eine Annahme des Referenzfalls, die letzte Zeile kombiniert mehrere ungünstige.",
        },
        {
          typ: "tabelle",
          caption: "Sensitivitäten für den Referenzfall 100 kWp, vor Steuern, Stand September 2026",
          kopf: ["Annahme", "Variante", "Amortisation", "IRR", "Kapitalwert (5 %)"],
          zeilen: [
            ["Referenzfall", "750 €/kWp, 60 %, 18 ct, +2 %, 6 ct", "6,2 Jahre", "16,3 %", "110.000 €"],
            ["Investition", "650 €/kWp", "5,4 Jahre", "18,8 %", "120.000 €"],
            ["Investition", "850 €/kWp", "7,0 Jahre", "14,3 %", "100.000 €"],
            ["Eigenverbrauch", "40 %", "7,9 Jahre", "12,4 %", "67.000 €"],
            ["Eigenverbrauch", "80 %", "5,2 Jahre", "19,9 %", "153.000 €"],
            ["Vermeidbarer Strompreis", "15 ct/kWh", "7,3 Jahre", "13,6 %", "80.000 €"],
            ["Vermeidbarer Strompreis", "21 ct/kWh", "5,4 Jahre", "18,9 %", "139.000 €"],
            ["Strompreisentwicklung", "0 % pro Jahr", "6,5 Jahre", "14,4 %", "78.000 €"],
            ["Strompreisentwicklung", "+4 % pro Jahr", "5,9 Jahre", "18,2 %", "151.000 €"],
            ["Marktpreis Überschuss", "4 ct/kWh", "6,6 Jahre", "15,2 %", "99.000 €"],
            ["Marktpreis Überschuss", "8 ct/kWh", "5,8 Jahre", "17,3 %", "121.000 €"],
            ["Spezifischer Ertrag", "900 kWh/kWp", "7,0 Jahre", "14,3 %", "89.000 €"],
            ["Spezifischer Ertrag", "1.100 kWh/kWp", "5,6 Jahre", "18,2 %", "131.000 €"],
            ["Betriebskosten", "25 €/kWp", "6,8 Jahre", "14,7 %", "93.000 €"],
            ["Ungünstige Kombination", "40 %, 15 ct, 0 %, 4 ct", "11,4 Jahre", "6,8 %", "13.000 €"],
          ],
          markierteZeile: 0,
          hervorheben: 2,
          minBreite: 680,
          fussnote: "Alle Werte mit demselben Rechenkern, dynamische Amortisation über 25 Jahre, vor Steuern, ohne Zuschuss. Kalkulationszins 3 % bzw. 7 % ändert nur den Kapitalwert (156.000 € bzw. 76.000 €), nicht Amortisation und IRR.",
        },
        {
          typ: "p",
          text: "Die ungünstige Kombination zeigt, warum ein belastbarer Lastgang wichtiger ist als jede Förderung: Wer 60 % Eigenverbrauch annimmt, aber nur 40 % erreicht, und gleichzeitig mit zu hohem Strompreis rechnet, verdoppelt die Amortisationszeit fast. Wie Sie den Eigenverbrauch nachträglich anheben, beschreibt [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen); wie sich der Überschusserlös zusammensetzt, [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis).",
        },
      ],
    },
    {
      id: "steuereffekt",
      titel: "Steuereffekt: Investitionsfreibetrag und AfA richtig einrechnen",
      tocLabel: "Steuereffekt",
      bloecke: [
        {
          typ: "p",
          text: "**Nach Steuern ist die Rendite niedriger als vor Steuern, weil die Stromersparnis den Gewinn erhöht; AfA und [Investitionsfreibetrag](/wissen/lexikon#ifb) mindern diese Belastung.** Der Cashflow nach Steuern ergibt sich aus dem Vorteil vor Steuern minus Steuersatz × (Vorteil − AfA − IFB). Der IFB wirkt einmalig im Jahr der Anschaffung, kürzt die AfA-Basis aber nicht.",
        },
        {
          typ: "tabelle",
          caption: "Referenzfall 100 kWp nach 23 % KöSt, Stand September 2026",
          kopf: ["Variante", "Amortisation", "IRR", "Kapitalwert (5 %)"],
          zeilen: [
            ["Vor Steuern", "6,2 Jahre", "16,3 %", "110.000 €"],
            ["Nach KöSt, ohne IFB", "7,3 Jahre", "13,5 %", "78.000 €"],
            ["Nach KöSt, IFB 15 % (ab 2027)", "7,1 Jahre", "13,9 %", "80.500 €"],
            ["Nach KöSt, IFB 22 % (bis 31.12.2026)", "7,0 Jahre", "14,1 %", "81.700 €"],
            ["Nach KöSt, IFB 22 %, EAG-Zuschuss 13.000 €", "5,9 Jahre", "17,0 %", "92.200 €"],
          ],
          markierteZeile: 3,
          hervorheben: 2,
          minBreite: 560,
          fussnote: "Lineare AfA über 20 Jahre, 23 % KöSt, Verlustverrechnung mit dem übrigen Betriebsgewinn unterstellt. Der Zuschuss (Kategorie C, Höchstsatz 130 €/kWp) mindert die Anschaffungskosten und damit AfA- und IFB-Basis. Bei Einzelunternehmen gilt der progressive ESt-Tarif bis 55 % – der Steuereffekt ist dann individuell. Keine Steuerberatung.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Vorsicht bei der statischen Amortisation nach Steuern",
          text: "Setzt man den IFB-Effekt in den Vorteil des ersten Jahres, ergibt die statische Formel 75.000 € ÷ 13.667 € = 5,5 Jahre – ein geschönter Wert, weil der Einmaleffekt auf alle Jahre hochgerechnet wird. Richtig ist die dynamische Rechnung mit 7,0 Jahren. Eine degressive AfA (bis 30 %, im ersten Jahr 22.500 € statt 3.750 €) verschiebt Steuern nach vorne und verbessert die Liquidität, ändert die Summe der Abschreibungen aber nicht.",
        },
        {
          typ: "p",
          text: "Die Regeln im Detail erklären [Investitionsfreibetrag für PV-Anlagen](/ratgeber/investitionsfreibetrag-photovoltaik) und [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern); die Wirkung auf 100 und 500 kWp zeigt [Photovoltaik für Unternehmen](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "speicher",
      titel: "Speicher-Effekt: Wann ein Batteriespeicher die Amortisation verkürzt",
      tocLabel: "Speicher-Effekt",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Gewerbespeicher verkürzt die Amortisation nur dann, wenn er neben dem höheren Eigenverbrauch einen zweiten Nutzen bringt – meist die Senkung des Leistungspreises.** Erhöht er nur den Eigenverbrauch, verteuert er jede zusätzlich selbst genutzte Kilowattstunde erheblich.",
        },
        {
          typ: "tabelle",
          caption: "100 kWp mit und ohne 100-kWh-Speicher, vor Steuern, Stand September 2026",
          kopf: ["Variante", "Investition", "Eigenverbrauch", "Amortisation", "IRR"],
          zeilen: [
            ["Nur PV (Referenzfall)", "75.000 €", "60 %", "6,2 Jahre", "16,3 %"],
            ["PV + Speicher", "135.000 €", "75 %", "10,2 Jahre", "9,1 %"],
            ["PV + Speicher, 7.500 € Speicherzuschuss", "127.500 €", "75 %", "9,6 Jahre", "9,8 %"],
            ["PV + Speicher, 2.000 €/Jahr Leistungspreis-Einsparung", "135.000 €", "75 %", "8,8 Jahre", "11,0 %"],
          ],
          hervorheben: 3,
          minBreite: 640,
          fussnote: "Speicher 100 kWh nutzbar zu 600 €/kWh netto (Richtwert gewerblich 450–750 €/kWh; BMWET-Speicherstatistik 2024: Ø 706 €/kWh für Heimspeicher). Betriebskosten gesamt 25 €/kWp. Zuschuss 150 €/kWh für max. 50 kWh. Leistungspreis-Einsparung als Annahme, steigt mit 2 %/Jahr. Die Rechnung unterstellt 25 Jahre ohne Speichertausch – je nach Zyklen realistisch sind eher 15 bis 20 Jahre, das Ergebnis ist also optimistisch.",
        },
        {
          typ: "p",
          text: "Wie viel Leistungspreis Sie tatsächlich sparen, ergibt sich aus Ihrer Netzrechnung und dem Lastgang – siehe [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis). Aktuelle Preise und Größen vergleicht [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten); Lösungen finden Sie unter [Gewerbespeicher](/gewerbespeicher). Für kleinere Anlagen hilft der [Stromspeicher-Rechner](/rechner/stromspeicher).",
        },
      ],
    },
    {
      id: "rechenfehler",
      titel: "Typische Rechenfehler in PV-Angeboten",
      tocLabel: "Rechenfehler",
      bloecke: [
        {
          typ: "p",
          text: "**Die meisten geschönten Wirtschaftlichkeitsrechnungen setzen einen zu hohen Strompreis oder Eigenverbrauch an – beides lässt sich mit Netzrechnung und Lastgang leicht prüfen.**",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Durchschnittspreis statt vermeidbarer Preis:** Eurostat-Werte oder die Gesamtrechnung geteilt durch kWh enthalten Leistungs-, Grund- und Messentgelte, die PV nicht ersetzt.",
            "**Eigenverbrauch ohne Lastgang:** 70 % oder mehr ohne Simulation gegen Viertelstundenwerte sind eine Behauptung, keine Rechnung.",
            "**Zu hohe Strompreissteigerung:** Mit 4 bis 5 % pro Jahr über 25 Jahre wird jede Anlage rentabel. Vorsichtig sind 0 bis 2 %.",
            "**Marktpreis aus dem besten Monat:** Der OeMAG-Marktpreis schwankte 2026 zwischen 5,7 und 9,0 ct/kWh – rechnen Sie mit einem vorsichtigen Jahresmittel.",
            "**Keine Degradation, keine Betriebskosten:** Wartung, Versicherung, Monitoring und Wechselrichtertausch fehlen oft ganz.",
            "**Zuschuss fix eingerechnet:** Der EAG-Zuschuss ist 2026 ein Wettrennen um Sekunden; er darf nur als Variante erscheinen und mindert AfA- und IFB-Basis.",
            "**ElWG ignoriert:** Neue Anlagen können auf 70 % Einspeiseleistung begrenzt werden; ab 2027 fällt ein Einspeisebeitrag von 0,05 ct/kWh an – mehr unter [ElWG für PV-Betreiber](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
            "**Netto und brutto vermischt:** Gemeinden ohne Vorsteuerabzug und Private müssen Investition und Strompreis brutto ansetzen.",
          ],
        },
        {
          typ: "p",
          text: "Eine vollständige Checkliste für den Angebotsvergleich finden Sie unter [PV-Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen).",
        },
      ],
    },
    {
      id: "anleitung",
      titel: "Schritt für Schritt: So rechnen Sie Ihre eigene Anlage",
      tocLabel: "Anleitung",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Vermeidbaren Strompreis ermitteln", "Aus der Netz- und Energierechnung nur die arbeitsabhängigen Teile netto zusammenzählen: Energiepreis, Netz-Arbeitspreis, Netzverlustentgelt, Elektrizitätsabgabe."],
            ["Ertrag ansetzen", "Anlagengröße × spezifischer Ertrag, in Österreich meist 900 bis 1.200 kWh/kWp je nach Lage und Ausrichtung."],
            ["Eigenverbrauch simulieren", "Erzeugung gegen zwölf Monate Viertelstundenwerte legen; ohne Lastgang lieber vorsichtig schätzen."],
            ["Jährlichen Vorteil berechnen", "Eigenverbrauch × vermeidbarer Preis + Überschuss × Marktpreis − Betriebskosten."],
            ["Dynamisch rechnen", "Jahr für Jahr mit Degradation, Preis- und Kostenentwicklung über 25 Jahre; daraus Amortisation, IRR und Kapitalwert."],
            ["Varianten und Steuer ergänzen", "Sensitivitäten für Eigenverbrauch, Strompreis und Investition rechnen, dann IFB, AfA und gegebenenfalls Zuschuss mit der Steuerberatung einbauen."],
          ],
        },
        {
          typ: "tool",
          href: "/rechner",
          titel: "Erste Orientierung mit unseren Rechnern",
          text: "Ertrag, Eigenverbrauch und Speichergröße überschlagen – für Betriebe als Vorbereitung auf eine Lastgang-Auswertung.",
          label: "Zu den Rechnern",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Nach wie vielen Jahren amortisiert sich eine PV-Anlage im Betrieb?",
      a: "Mit unseren Grundannahmen nach 5 bis 8 Jahren vor Steuern, je nach Eigenverbrauch; der Referenzfall (100 kWp, 60 % Eigenverbrauch, 18 ct) nach 6,2 Jahren. Bei ungünstigen Annahmen können es über 11 Jahre werden.",
    },
    {
      q: "Was ist der Unterschied zwischen statischer und dynamischer Amortisation?",
      a: "Die statische Amortisation teilt die Investition durch den Vorteil des ersten Jahres. Die dynamische rechnet Jahr für Jahr mit sinkendem Ertrag, steigenden Strompreisen und Betriebskosten. Für Betriebe ist die dynamische Rechnung aussagekräftiger.",
    },
    {
      q: "Welche Rendite (IRR) ist bei einer PV-Anlage realistisch?",
      a: "Für Gewerbeanlagen mit 40 bis 80 % Eigenverbrauch errechnen wir vor Steuern rund 12 bis 20 % über 25 Jahre. Nach 23 % KöSt und mit IFB liegt der Wert etwa 1,5 bis 3 Prozentpunkte niedriger. In unseren Eigenheim-Szenarien sind es 2 bis 6 %.",
    },
    {
      q: "Was sind Stromgestehungskosten und wie hoch sind sie?",
      a: "Stromgestehungskosten sind die Kosten je erzeugter Kilowattstunde über die Laufzeit, inklusive Betriebskosten und Kapitalverzinsung. Bei 100 kWp und 750 €/kWp liegen sie bei 5 % Kalkulationszins bei rund 7,4 ct/kWh, bei 500 kWp und 600 €/kWp bei rund 5,9 ct/kWh.",
    },
    {
      q: "Verkürzt ein Speicher die Amortisation?",
      a: "Nur, wenn er einen zweiten Nutzen hat. Erhöht ein 100-kWh-Speicher lediglich den Eigenverbrauch von 60 auf 75 %, verlängert sich die Amortisation im Beispiel von 6,2 auf rund 10 Jahre. Mit 2.000 € jährlicher Leistungspreis-Einsparung sind es 8,8 Jahre.",
    },
    {
      q: "Wie rechne ich den Investitionsfreibetrag in die Amortisation ein?",
      a: "Als einmalige Steuerersparnis im Anschaffungsjahr: 22 % der Anschaffungskosten × Steuersatz, bei 75.000 € und 23 % KöSt also 3.795 €. Rechnen Sie dynamisch, nicht statisch – sonst wird der Einmaleffekt auf alle Jahre hochgerechnet.",
    },
  ],

  howTo: {
    name: "Amortisation und Rendite einer PV-Anlage berechnen",
    schritte: [
      { name: "Vermeidbaren Strompreis ermitteln", text: "Nur arbeitsabhängige Teile der Strom- und Netzrechnung netto zusammenzählen." },
      { name: "Ertrag ansetzen", text: "Anlagengröße mit dem spezifischen Ertrag multiplizieren, in Österreich meist 900 bis 1.200 kWh/kWp." },
      { name: "Eigenverbrauch simulieren", text: "Erzeugung gegen die Viertelstundenwerte des Lastgangs legen." },
      { name: "Jährlichen Vorteil berechnen", text: "Eigenverbrauch × Strompreis + Überschuss × Marktpreis − Betriebskosten." },
      { name: "Dynamisch rechnen", text: "Über 25 Jahre mit Degradation und Preisentwicklung Amortisation, IRR und Kapitalwert ermitteln." },
      { name: "Varianten und Steuer ergänzen", text: "Sensitivitäten rechnen und IFB, AfA sowie Zuschuss mit der Steuerberatung einbauen." },
    ],
  },

  passend: [
    { href: "/ratgeber/photovoltaik-gewerbe", titel: "Photovoltaik für Unternehmen", text: "Beispiele 100 und 500 kWp, IFB, AfA, ElWG." },
    { href: "/ratgeber/photovoltaik-lohnt-sich", titel: "Lohnt sich Photovoltaik 2026?", text: "Szenarien für Betriebe, Gemeinden und Eigenheim." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "Kauf, Kredit oder Leasing für Ihre Anlage." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Eigenverbrauch erhöhen, Leistungsspitzen senken." },
  ],

  quellen: [
    { titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (PDF)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "2025" },
    { titel: "BMWET – PV-Speichersysteme, Marktentwicklung 2024 (PDF)", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf", stand: "2025" },
    { titel: "Eurostat – Strompreise für Nicht-Haushaltskunden (nrg_pc_205)", url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table", stand: "09/2026" },
    { titel: "OeMAG – Marktpreis für Ökostrom", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "USP – Abschreibung (AfA)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/abschreibung.html", stand: "09/2026" },
    { titel: "USP – Investitionsfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "09/2026" },
    { titel: "PV&B Austria – ElWG: Das Wichtigste im Überblick für den PV- und Speicherbereich", url: "https://pvbaustria.at/elwg-das-wichtigste-im-uberblick-fur-den-pv-und-speicherbereich/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Ihre Anlage durchrechnen lassen?", text: "Wirtschaftlichkeit auf Basis Ihres Lastgangs und Ihrer Netzrechnung.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Eine Rechnung, die auch ohne Förderung trägt.",
    text: "Ökovolt plant PV-Anlagen für Betriebe in ganz Österreich auf Basis von Lastgang, Dach und Netzanschluss – und legt die Annahmen offen.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Finanzierung", href: "/service/finanzierung" },
  },
};

export default artikel;
