// Ratgeber: Photovoltaik für Unternehmen in Österreich (Gruppe R1)
// Alle Beispielzahlen mit dem gemeinsamen R1-Rechenkern (pvcalc.mjs) ermittelt und gerundet als Text eingetragen.
// Grundannahmen (identisch in photovoltaik-lohnt-sich und photovoltaik-amortisation): 1.000 kWh/kWp, 0,4 % Degradation,
// 25 Jahre, Strompreis +2 %/a, Überschuss 6 ct/kWh, Betriebskosten 15 €/kWp (100 kWp) bzw. 12 €/kWp (500 kWp) +2 %/a.

const artikel = {
  slug: "photovoltaik-gewerbe",
  title: "Photovoltaik für Unternehmen in Österreich: Wirtschaftlichkeit 2026",
  seoTitle: "Photovoltaik für Unternehmen 2026: IFB & Rendite | Ökovolt",
  kurzTitel: "Photovoltaik für Unternehmen",
  description:
    "Photovoltaik für Unternehmen in Österreich: Lastgang, Eigenverbrauch, Rechnung für 100 und 500 kWp, Investitionsfreibetrag 22 %, AfA, EAG-Zuschuss und ElWG.",
  excerpt:
    "Wie sich eine PV-Anlage im österreichischen Betrieb rechnet: vom Lastgang über Leistungspreis und Netzebene bis zu Investitionsfreibetrag, EAG-Zuschuss, OeMAG-Marktpreis und den neuen ElWG-Regeln – mit Beispielrechnung für 100 und 500 kWp.",
  hauptKeyword: "photovoltaik unternehmen österreich",
  keywords: [
    "Photovoltaik Unternehmen Österreich",
    "PV-Anlage Gewerbe Österreich",
    "Photovoltaik Firma Wirtschaftlichkeit",
    "Investitionsfreibetrag Photovoltaik 2026",
    "Photovoltaik Abschreibung Österreich",
    "Elektrizitätsabgabe Eigenverbrauch",
    "PV-Anlage 500 kWp Kosten",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
  bildAlt: "Luftbild eines Gewerbegebiets mit Photovoltaikanlagen auf mehreren Hallendächern",
  badge: { wert: "6,2 J.", text: "Amortisation 100 kWp bei 60 % Eigenverbrauch, vor Steuern" },

  kurzFazit: [
    "**Photovoltaik rechnet sich in österreichischen Betrieben vor allem über den Eigenverbrauch:** Jede selbst genutzte Kilowattstunde ersetzt Netzstrom um rund 15 bis 18 ct netto, eingespeister Überschuss bringt derzeit etwa 6 bis 9 ct.",
    "Eine **100-kWp-Dachanlage** (75.000 € netto) amortisiert sich bei 60 % Eigenverbrauch nach rund **6 Jahren** vor Steuern (interner Zinsfuß ≈ 16 %), bei 40 % Eigenverbrauch nach knapp 8 Jahren.",
    "Steuerlich wirken 2026 der **Öko-Investitionsfreibetrag von 22 %** (Anschaffung oder Herstellung bis 31.12.2026), die AfA über 20 Jahre oder degressiv bis 30 % und die **Befreiung des Eigenstroms von der Elektrizitätsabgabe**.",
    "Der **EAG-Investitionszuschuss** (Kategorie C max. 130 €/kWp, D max. 120 €/kWp) ist 2026 ein Bonus mit Losglück – das Projekt sollte auch ohne Zuschuss tragen.",
    "Das **ElWG** begrenzt bei neuen Anlagen die Einspeisung auf bis zu 70 % der Modulleistung und bringt ab 2027 einen Einspeisebeitrag von 0,05 ct/kWh – bei hohem Eigenverbrauch kostet beides wenig.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich Photovoltaik für Unternehmen in Österreich?",
      tocLabel: "Lohnt es sich?",
      bloecke: [
        {
          typ: "p",
          text: "**Für Betriebe mit Stromverbrauch am Tag lohnt sich eine eigene PV-Anlage 2026 in aller Regel – auch ohne Förderung.** Produktion, Kühlung und Büro brauchen Strom dann, wenn die Anlage erzeugt. Eine Kilowattstunde vom eigenen Hallendach kostet bei einer 100-kWp-Anlage über 25 Jahre rund 7,4 ct (Stromgestehungskosten), Netzstrom kostet Nicht-Haushalte in Österreich laut Eurostat im zweiten Halbjahr 2025 zwischen 18,0 und 23,2 ct netto.",
        },
        {
          typ: "p",
          text: "Die Eurostat-Durchschnitte enthalten allerdings auch Leistungs- und Grundpreise, die Solarstrom nicht oder nur teilweise ersetzt. Wir rechnen deshalb vorsichtig mit einem **vermeidbaren Strompreis** von 18 ct/kWh (Betriebe mit 20 bis 500 MWh Jahresverbrauch) bzw. 15 ct/kWh (500 bis 2.000 MWh). Wie sich das im Vergleich zu Landwirtschaft, Gemeinden und Eigenheim darstellt, zeigt der Überblick [Lohnt sich Photovoltaik 2026?](/ratgeber/photovoltaik-lohnt-sich). Branchenlösungen finden Sie unter [Photovoltaik für Gewerbe](/gewerbe).",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Gut geeignet", text: "Produktion mit Tagschicht, Lebensmittelhandel, Kühlhäuser, Bürogebäude mit Klimatisierung, Hotels mit Küche und Wellness, Milchvieh- und Geflügelbetriebe." },
            { titel: "Mit Planung geeignet", text: "Betriebe mit Wochenend- oder Nachtlast, Werkstätten mit E-Flotte, saisonale Betriebe – hier helfen Speicher, Lastverschiebung und Ladesteuerung." },
            { titel: "Genau prüfen", text: "Lagerhallen mit sehr geringem Verbrauch, Leichtbaudächer ohne Lastreserve, gemietete Hallen ohne langfristige Dachnutzungsvereinbarung." },
          ],
        },
      ],
    },
    {
      id: "lastgang",
      titel: "Lastgang und Viertelstundenwerte: So finden Sie die richtige Anlagengröße",
      tocLabel: "Lastgang & Eigenverbrauch",
      bloecke: [
        {
          typ: "p",
          text: "**Die passende Anlagengröße ergibt sich aus dem Lastgang – dem Stromverbrauch des Betriebs in 35.040 Viertelstundenwerten pro Jahr –, nicht aus der verfügbaren Dachfläche.** Leistungsgemessene Kunden (in der Regel ab 100.000 kWh Jahresverbrauch oder 50 kW Anschlussleistung) haben diese Daten beim Netzbetreiber. Bei Smart Metern werden Viertelstundenwerte nach Zustimmung ausgelesen und im Webportal des Netzbetreibers bereitgestellt.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Lastgang anfordern", "Zwölf Monate Viertelstundenwerte beim Netzbetreiber abrufen. Fehlen sie, helfen Monatsrechnungen, Betriebszeiten und eine Messung an den größten Verbrauchern."],
            ["Grundlast und Tagesprofil auswerten", "Welche Leistung fließt werktags mittags mindestens? Diese Grundlast kann die Anlage nahezu vollständig decken."],
            ["Erzeugung simulieren", "Den Ertrag der Dachflächen je Viertelstunde gegen den Lastgang legen – daraus folgen Eigenverbrauchsquote und Autarkiegrad."],
                        ["Größe und Überschussmodell festlegen", "Auf hohen Eigenverbrauch auslegen oder bewusst größer bauen und den Überschuss vermarkten – inklusive Blick auf die Einspeisegrenzen des Netzbetreibers."],
          ],
        },
        {
          typ: "p",
          text: "Wie Sie aus dem Lastgang eine konkrete kWp-Zahl ableiten, erklärt der Ratgeber [PV-Anlage richtig dimensionieren](/ratgeber/pv-anlage-groesse-berechnen). Maßnahmen, die den Eigenverbrauch nachträglich anheben, sammelt [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "leistungspreis",
      titel: "Leistungspreis und Netzebene: Was PV an der Netzrechnung ändert",
      tocLabel: "Leistungspreis & Netzebene",
      bloecke: [
        {
          typ: "p",
          text: "**Photovoltaik senkt vor allem die arbeitsabhängigen Teile der Stromrechnung; den [Leistungspreis](/wissen/lexikon#leistungspreis) senkt sie nur, wenn die Lastspitze zeitlich mit der Erzeugung zusammenfällt.** Leistungsgemessene Betriebe zahlen neben dem Arbeitspreis ein Entgelt für die gemessene Spitzenleistung. Diese Spitzen treten oft an Wintermorgen auf, wenn die Anlage wenig liefert.",
        },
        {
          typ: "tabelle",
          caption: "Welche Teile der Stromrechnung Eigenverbrauch ersetzt, Stand September 2026",
          kopf: ["Bestandteil", "Durch Eigenverbrauch vermieden?", "Hinweis"],
          zeilen: [
            ["Energiepreis (Lieferant)", "ja", "größter Posten, abhängig vom Liefervertrag"],
            ["Netznutzungsentgelt, Arbeitspreis", "ja", "Höhe je Netzebene und Netzbereich"],
            ["Netzverlustentgelt", "ja", "arbeitsabhängig"],
            ["Netznutzungsentgelt, Leistungspreis", "nur teilweise", "nur wenn die Spitze mittags liegt oder ein Speicher sie kappt"],
            ["Elektrizitätsabgabe", "ja", "Eigenstrom aus Erneuerbaren ist befreit (2026: 0,82 ct/kWh, ab 2027 wieder 1,5 ct/kWh)"],
            ["Grund- und Messentgelte", "nein", "fix je Zählpunkt"],
          ],
          minBreite: 620,
          fussnote: "Vereinfachte Darstellung. Die Netzentgelte legt die E-Control je Netzebene und Netzbereich fest. Seit 1.4.2026 gilt für Haushalte und kleine Betriebe zusätzlich der Sommer-Nieder-Arbeitspreis (1.4.–30.9., 10–16 Uhr, −20 % auf den Netz-Arbeitspreis) – das senkt den Wert von Mittags-Eigenverbrauch dort leicht.",
        },
        {
          typ: "p",
          text: "Die [Netzebene](/wissen/lexikon#netzebene) bestimmt die Höhe der Netzentgelte: Die meisten Gewerbebetriebe hängen an Netzebene 7 (Niederspannung), größere Betriebe direkt an einer Umspannstation (Netzebene 6) oder mit eigener Trafostation an der Mittelspannung (Netzebene 5). Je höher die Netzebene, desto niedriger sind in der Regel die Entgelte je kWh – und desto niedriger der vermeidbare Strompreis. Ob ein Speicher Ihre Spitze wirtschaftlich kappen kann, klärt der Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
        },
      ],
    },
    {
      id: "beispiel-100",
      titel: "Beispielrechnung 100 kWp: 40, 60 oder 80 % Eigenverbrauch",
      tocLabel: "Beispiel 100 kWp",
      bloecke: [
        {
          typ: "p",
          text: "**Eine 100-kWp-Dachanlage für 75.000 € netto amortisiert sich vor Steuern je nach Eigenverbrauch nach 5 bis 8 Jahren.** Die Anlage erzeugt im ersten Jahr rund 100.000 kWh. Bei 60 % Eigenverbrauch ersetzen 60.000 kWh Netzstrom zu 18 ct (10.800 €), 40.000 kWh Überschuss bringen zu 6 ct 2.400 €, abzüglich 1.500 € Betriebskosten bleiben 11.700 € Vorteil im ersten Jahr.",
        },
        {
          typ: "tabelle",
          caption: "100 kWp auf dem Hallendach: Wirtschaftlichkeit über 25 Jahre, Stand September 2026",
          kopf: ["Eigenverbrauch", "Vorteil Jahr 1", "Amortisation vor Steuern", "IRR vor Steuern", "Amortisation mit EAG-Zuschuss", "IRR nach KöSt mit IFB 22 %"],
          zeilen: [
            ["40 %", "9.300 €", "7,9 Jahre", "12,4 %", "6,5 Jahre", "10,8 %"],
            ["60 %", "11.700 €", "6,2 Jahre", "16,3 %", "5,2 Jahre", "14,1 %"],
            ["80 %", "14.100 €", "5,2 Jahre", "19,9 %", "4,3 Jahre", "17,2 %"],
          ],
          markierteZeile: 1,
          hervorheben: 2,
          minBreite: 720,
          fussnote: "Beispielrechnung, kein Angebot. Annahmen: 750 €/kWp netto (Richtwert 2026 für 100 kWp auf Basis der BMWET-Marktstatistik), 1.000 kWh/kWp, 0,4 % Degradation/Jahr, vermeidbarer Strompreis 18 ct/kWh netto mit +2 %/Jahr, Überschuss 6 ct/kWh konstant, Betriebskosten 15 €/kWp mit +2 %/Jahr, 25 Jahre, dynamische Amortisation. EAG-Zuschuss: Kategorie C mit Höchstsatz 130 €/kWp = 13.000 €. Steuerspalte: 23 % KöSt, lineare AfA 20 Jahre, Öko-IFB 22 % im ersten Jahr, Verlustverrechnung mit dem übrigen Betriebsgewinn unterstellt, ohne Zuschuss.",
        },
        {
          typ: "p",
          text: "Nach Steuern sinkt die Rendite, weil die Ersparnis den Gewinn erhöht und mit 23 % KöSt belastet wird. Der Investitionsfreibetrag federt das ab: Bei 60 % Eigenverbrauch steigt der interne Zinsfuß nach Steuern von 13,5 % ohne IFB auf 14,1 % mit 22 % IFB. Der Kapitalwert bei 5 % Kalkulationszins liegt vor Steuern bei rund 67.000 € (40 %), 110.000 € (60 %) und 153.000 € (80 %). Methoden und Sensitivitäten: [Amortisation und Rendite berechnen](/ratgeber/photovoltaik-amortisation).",
        },
      ],
    },
    {
      id: "beispiel-500",
      titel: "Beispielrechnung 500 kWp: mit und ohne Zuschuss, vor und nach Steuern",
      tocLabel: "Beispiel 500 kWp",
      bloecke: [
        {
          typ: "p",
          text: "**Eine 500-kWp-Anlage für 300.000 € netto amortisiert sich bei 60 % Eigenverbrauch und 15 ct vermeidbarem Strompreis nach rund 5,7 Jahren vor Steuern.** Die Anlage ist je kWp günstiger, dafür ist der vermeidbare Strompreis in dieser Verbrauchsklasse niedriger.",
        },
        {
          typ: "tabelle",
          caption: "500 kWp Gewerbe- oder Industriedach: Varianten im Vergleich, Stand September 2026",
          kopf: ["Variante", "Investition netto", "Amortisation", "IRR", "Kapitalwert (5 %)"],
          zeilen: [
            ["EV 60 %, vor Steuern, ohne Zuschuss", "300.000 €", "5,7 Jahre", "17,7 %", "501.000 €"],
            ["EV 60 %, vor Steuern, mit EAG-Zuschuss", "240.000 €", "4,6 Jahre", "22,2 %", "561.000 €"],
            ["EV 60 %, nach KöSt + IFB 22 %, ohne Zuschuss", "300.000 €", "6,5 Jahre", "15,3 %", "375.000 €"],
            ["EV 60 %, nach KöSt + IFB 22 %, mit Zuschuss", "240.000 €", "5,3 Jahre", "19,0 %", "423.000 €"],
            ["EV 40 %, vor Steuern, ohne Zuschuss", "300.000 €", "7,0 Jahre", "14,1 %", "336.000 €"],
            ["EV 80 %, vor Steuern, ohne Zuschuss", "300.000 €", "4,9 Jahre", "21,1 %", "667.000 €"],
          ],
          markierteZeile: 0,
          hervorheben: 2,
          minBreite: 680,
          fussnote: "Beispielrechnung, kein Angebot. Annahmen: 600 €/kWp netto (Richtwert 2026 für 250–500 kWp), 1.000 kWh/kWp, 0,4 % Degradation, vermeidbarer Strompreis 15 ct/kWh netto mit +2 %/Jahr, Überschuss 6 ct/kWh, Betriebskosten 12 €/kWp mit +2 %/Jahr, 25 Jahre. EAG-Zuschuss Kategorie D mit Höchstsatz 120 €/kWp = 60.000 €; der Zuschuss mindert die Bemessungsgrundlage für AfA und IFB. Steuer: 23 % KöSt, lineare AfA 20 Jahre, Öko-IFB 22 %.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Was sich bei 500 kWp ändert",
          text: "Die Abnahme zum OeMAG-Marktpreis steht nur Anlagen unter 500 kWp offen – ab 500 kWp brauchen Sie einen Stromhändler oder Direktvermarkter. Ein Zuschuss der Kategorie D ist nicht mit Landes- oder Gemeindeförderungen kombinierbar. Und der Netzanschluss erfolgt in dieser Größe häufig über eine Trafostation; deren Kosten und die technischen Nachweise nach [TOR Erzeuger](/ratgeber/tor-erzeuger-netzanschluss) gehören von Anfang an in die Kalkulation.",
        },
      ],
    },
    {
      id: "steuern",
      titel: "Investitionsfreibetrag, AfA und Elektrizitätsabgabe",
      tocLabel: "Steuern & Abgaben",
      bloecke: [
        {
          typ: "p",
          text: "**Eine betriebliche PV-Anlage ist ein abnutzbares Wirtschaftsgut mit 20 Jahren Nutzungsdauer; zusätzlich zur AfA können Unternehmen für Anschaffungen bis 31.12.2026 einen Öko-[Investitionsfreibetrag](/wissen/lexikon#ifb) von 22 % geltend machen.** Der IFB kürzt die AfA-Basis nicht, er ist ein echter zusätzlicher Steuervorteil. Ab 1.1.2027 gilt wieder der Satz von 15 %. Die Bemessungsgrundlage ist mit 1 Mio. € je Wirtschaftsjahr gedeckelt.",
        },
        {
          typ: "tabelle",
          caption: "Steuerliche Instrumente am Beispiel 100 und 500 kWp, Stand September 2026",
          kopf: ["Instrument", "Regel", "100 kWp (75.000 €)", "500 kWp (300.000 €)"],
          zeilen: [
            ["Öko-IFB 22 %", "Anschaffung/Herstellung 1.11.2025–31.12.2026 (§ 11 EStG)", "16.500 € Freibetrag = 3.795 € KöSt", "66.000 € = 15.180 € KöSt"],
            ["Öko-IFB 15 %", "ab 1.1.2027", "11.250 € = 2.588 € KöSt", "45.000 € = 10.350 € KöSt"],
            ["Lineare AfA", "5 % pro Jahr über 20 Jahre", "3.750 €/Jahr = 863 € KöSt", "15.000 €/Jahr = 3.450 € KöSt"],
            ["Degressive AfA", "bis 30 % vom Restbuchwert (§ 7 Abs. 1a EStG)", "22.500 € im 1. Jahr = 5.175 € KöSt", "90.000 € im 1. Jahr = 20.700 € KöSt"],
            ["Elektrizitätsabgabe", "Eigenstrom aus Erneuerbaren befreit, ohne Mengengrenze", "60.000 kWh: 492 € (2026), 900 €/Jahr ab 2027", "300.000 kWh: 2.460 € (2026), 4.500 €/Jahr ab 2027"],
          ],
          minBreite: 760,
          fussnote: "Steuerwirkung bei 23 % KöSt, ohne EAG-Zuschuss (ein Zuschuss mindert die Anschaffungskosten und damit AfA und IFB). Degressive AfA: Halbjahres-AfA bei Inbetriebnahme im zweiten Halbjahr; sie verschiebt Steuern nur zeitlich, die Summe der AfA bleibt gleich. Elektrizitätsabgabe bei 60 % Eigenverbrauch; die Befreiung ist im vermeidbaren Strompreis der Beispielrechnungen bereits enthalten. Keine Steuerberatung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Voraussetzungen für den Investitionsfreibetrag",
          text: "Das Wirtschaftsgut muss ungebraucht sein, mindestens vier Jahre Nutzungsdauer haben und einem inländischen Betrieb vier Jahre lang dienen (Behaltefrist, sonst Nachversteuerung). Ausgeschlossen sind u. a. pauschalierte Gewinnermittlungen und Wirtschaftsgüter, für die ein investitionsbedingter Gewinnfreibetrag geltend gemacht wird. Maßgeblich ist der Zeitpunkt der Anschaffung bzw. Fertigstellung – bei Projekten über den Jahreswechsel sollte die Steuerberatung die Zuordnung prüfen. Details: [Investitionsfreibetrag für PV-Anlagen](/ratgeber/investitionsfreibetrag-photovoltaik).",
        },
        {
          typ: "p",
          text: "Umsatzsteuerlich rechnen vorsteuerabzugsberechtigte Unternehmen netto: Die 20 % USt auf die Anlage kommen als Vorsteuer zurück. Liefert der Betrieb Überschussstrom an einen Energieversorger, gilt das Reverse-Charge-System. Alle Steuerfragen für Unternehmen, Land- und Forstwirtschaft und Private bündelt [Photovoltaik und Steuern in Österreich](/ratgeber/photovoltaik-steuern); einen Überblick bietet [steuerliche Förderungen](/forderungen/steuerlich).",
        },
      ],
    },
    {
      id: "eag-zuschuss",
      titel: "EAG-Investitionszuschuss 2026: Kategorien C und D",
      tocLabel: "EAG-Zuschuss",
      bloecke: [
        {
          typ: "p",
          text: "**Gewerbeanlagen fallen beim [EAG](/wissen/lexikon#eag)-Investitionszuschuss meist in Kategorie C (über 20 bis 100 kWp, max. 130 €/kWp) oder D (über 100 bis 1.000 kWp, max. 120 €/kWp); gefördert wird, wer den niedrigsten Förderbedarf je kWp bietet.** Der Zuschuss ist mit 30 % der förderfähigen Nettokosten gedeckelt und muss vor der Inbetriebnahme beantragt werden.",
        },
        {
          typ: "tabelle",
          caption: "EAG-Investitionszuschuss für Unternehmen, Fördersätze 2026",
          kopf: ["Kategorie", "Leistung", "Fördersatz 2026", "Vergabe", "Kombination mit Landesförderung"],
          zeilen: [
            ["C", "> 20 bis 100 kWp", "max. 130 €/kWp", "Reihung nach gebotenem €/kWp", "möglich (Beihilfegrenzen)"],
            ["D", "> 100 bis 1.000 kWp", "max. 120 €/kWp", "Reihung nach gebotenem €/kWp", "nicht möglich (außer Investitionsprämie)"],
            ["Speicher", "mit neuer oder erweiterter PV", "150 €/kWh", "gemeinsam mit PV-Antrag", "wie PV-Kategorie"],
          ],
          minBreite: 720,
          fussnote: "EAG-Investitionszuschüsseverordnung-Strom idF BGBl. II Nr. 12/2026. Speicher: mind. 0,5 kWh je kWp, max. 50 kWh förderfähig. Zuschläge: Made in Europe +10 % je für Module und Wechselrichter, innovative PV (z. B. Parkplatzüberdachung ab 10 Stellplätzen) +30 %; Abschlag −25 % auf landwirtschaftlich genutzten Flächen mit Ausnahmen.",
        },
        {
          typ: "p",
          text: "Beim Antrag müssen alle Genehmigungen bzw. Anzeigen und die Netzanschlussbestätigung vorliegen. Nach dem Fördervertrag bleiben bis 100 kWp sechs Monate, darüber zwölf Monate bis zur Inbetriebnahme. Der Juni-Call 2026 war nach 33 Sekunden ausgeschöpft; der letzte Call des Jahres läuft von 8. bis 22. Oktober 2026 mit je 2 Mio. € für die Kategorien C und D. Ablauf, Fristen und Nachweise erklärt der Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss), alle Programme zeigt die [Bundesförderung](/forderungen/bundesfoerderung).",
        },
      ],
    },
    {
      id: "ueberschuss",
      titel: "Überschuss verkaufen: OeMAG-Marktpreis oder Direktvermarktung",
      tocLabel: "Überschuss & Marktpreis",
      bloecke: [
        {
          typ: "p",
          text: "**Anlagen unter 500 kWp können ihren Überschuss an die [OeMAG](/wissen/lexikon#oemag) zum monatlich nachträglich veröffentlichten Marktpreis verkaufen; größere Anlagen oder Betreiber mit anderen Zielen vermarkten direkt.** Der OeMAG-Vertrag läuft mindestens zwölf Monate.",
        },
        {
          typ: "tabelle",
          caption: "OeMAG-Marktpreis für PV-Überschussstrom 2026 in ct/kWh",
          kopf: ["Monat", "Jän.", "Feb.", "März", "Apr.–Juni", "Juli", "Aug."],
          zeilen: [["Marktpreis", "8,842", "8,457", "5,720", "je 6,772", "6,146", "8,997"]],
          minBreite: 560,
          fussnote: "Quelle: OeMAG, Stand September 2026. April bis Juni griff die Untergrenze von 60 % des Quartalsmarktpreises. Durchschnitt Jänner–August ≈ 7,3 ct/kWh; abgezogen werden 0,408 ct/kWh Ausgleichsenergie. Die Beispielrechnungen setzen vorsichtig 6 ct/kWh an.",
        },
        {
          typ: "p",
          text: "Mittags drückt der hohe PV-Anteil die Börsenpreise: Am 1. Mai 2026 fielen sie bis −500 €/MWh, im heißen Sommer 2026 gab es dagegen keine negativen Preise. Wer mehr als den Marktpreis erzielen oder Preisrisiken absichern will, nutzt die [Direktvermarktung](/service/direktvermarktung) oder einen Liefervertrag an einen Abnehmer ([PPA](/ratgeber/ppa-oesterreich)). Die Optionen vergleicht [Einspeisung für Betriebe](/einspeisung-gewerbe), die Preisbildung erklärt [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis).",
        },
      ],
    },
    {
      id: "elwg",
      titel: "ElWG: Spitzenkappung, Einspeisebeitrag und Ansteuerbarkeit",
      tocLabel: "ElWG",
      bloecke: [
        {
          typ: "p",
          text: "**Das Elektrizitätswirtschaftsgesetz (ElWG), beschlossen im Dezember 2025, löst das ElWOG 2010 ab und bringt für neue Gewerbeanlagen drei wirtschaftlich relevante Regeln.**",
        },
        {
          typ: "liste",
          punkte: [
            "**Spitzenkappung (§ 101):** Die Einspeiseleistung neuer Anlagen kann auf bis zu 70 % der Modulleistung begrenzt werden, statisch oder dynamisch. Eigenverbrauch und Speicherung bleiben unberührt; Anlagen bis 7 kW netzwirksamer Leistung sind ausgenommen.",
            "**Versorgungsinfrastrukturbeitrag (§ 75a):** Ab 2027 zahlen Anlagen über 20 kW 0,05 ct je eingespeister kWh. Bei 100 kWp und 40.000 kWh Überschuss sind das rund 20 € im Jahr, bei 500 kWp und 200.000 kWh rund 100 €.",
            "**Ansteuerbarkeit (§§ 76, 103):** Seit Juni 2026 müssen neue Anlagen ab 3,68 kW ansteuerbar sein; ein flexibler Netzzugang mit vorab reduzierter Einspeisung ist möglich.",
            "**Einspeiserecht:** Unter 15 kW darf im Ausmaß der Bezugsleistung eingespeist werden, darüber bis 70 % der Bezugsleistung; für mehr Einspeiseleistung fällt eine Netzanschlussentgelt-Pauschale an.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Einspeisebegrenzung technisch lösen",
          text: "Eine Begrenzung am Netzanschlusspunkt setzt ein [EZA-Regler](/wissen/lexikon#eza-regler) um: Er misst am Übergabepunkt und regelt die Wechselrichter so, dass Eigenverbrauch Vorrang hat. Ökovolt entwickelt dafür einen eigenen [Parkregler](/technik/parkregler). Alle Änderungen im Überblick: [ElWG für PV-Betreiber](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
        },
      ],
    },
    {
      id: "planung",
      titel: "Dach, Statik, Brandschutz und Genehmigung",
      tocLabel: "Dach & Planung",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Statik:** Trapezblech- und Sandwichdächer haben oft wenig Lastreserve. Ballast, Schneelast nach ÖNORM B 1991-1-3 und Wind prüft ein Tragwerksplaner – siehe [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach) und [Schneelast](/ratgeber/schneelast-photovoltaik).",
            "**Brandschutz:** Die OVE-Richtlinie R 11-1 regelt Abstände, Brandabschnitte und Kennzeichnung; Versicherer stellen oft zusätzliche Auflagen. Mehr unter [Brandschutz bei PV-Anlagen](/ratgeber/photovoltaik-brandschutz).",
            "**Dachzustand:** Das Dach sollte die 25 bis 30 Jahre Laufzeit der Anlage mitmachen. Erst sanieren, dann montieren.",
            "**Genehmigung:** Je nach Bundesland Anzeige oder Bewilligung; mit dem EABG soll PV auf den meisten Gebäuden ab 2027 bundesweit genehmigungsfrei werden. Details: [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
            "**Netz:** Netzzugangsantrag früh stellen – die Netzanschlussbestätigung ist auch Voraussetzung für den EAG-Antrag. Ablauf unter [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
          ],
        },
      ],
    },
    {
      id: "betreibermodelle",
      titel: "Kauf, Leasing, Contracting oder PPA?",
      tocLabel: "Betreibermodelle",
      bloecke: [
        {
          typ: "p",
          text: "**Den höchsten Ertrag bringt der Kauf, Liquidität schonen Leasing, Contracting und PPA – auf Kosten von Rendite und Steuervorteilen.** Den Investitionsfreibetrag und die AfA nutzt, wer wirtschaftlicher Eigentümer der Anlage ist.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Kauf", text: "Volle Kontrolle, IFB und AfA beim Betrieb, höchste Rendite. Finanzierung über Eigenmittel oder Bankkredit; Finanzierungskosten sind nicht förderfähig." },
            { titel: "Leasing", text: "Rate als Betriebsausgabe, Eigenkapital bleibt frei. Der IFB steht dem wirtschaftlichen Eigentümer zu – das ist beim Leasing oft der Leasinggeber. Mehr unter [Photovoltaik-Leasing](/ratgeber/photovoltaik-leasing)." },
            { titel: "Contracting", text: "Ein Dritter baut und betreibt, Sie kaufen den Strom zu einem vereinbarten Preis. Bestand- und Nutzungsverträge können der Bestandvertragsgebühr von 1 % unterliegen." },
            { titel: "PPA", text: "Langfristiger Stromliefervertrag, on-site oder off-site. Gut für planbare Energiekosten ohne eigene Investition – siehe [PPA in Österreich](/ratgeber/ppa-oesterreich)." },
          ],
        },
        {
          typ: "p",
          text: "Die Modelle stellt [Photovoltaik kaufen, leasen oder mieten](/ratgeber/photovoltaik-mieten-oder-kaufen) gegenüber; Finanzierungsmöglichkeiten zeigt die Seite [Finanzierung](/service/finanzierung).",
        },
      ],
    },
    {
      id: "speicher-flotte",
      titel: "Speicher und E-Flotte: Eigenverbrauch gezielt erhöhen",
      tocLabel: "Speicher & E-Flotte",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Gewerbespeicher rechnet sich meist erst, wenn er neben mehr Eigenverbrauch auch die Leistungsspitze senkt; eine E-Flotte ist dagegen oft der günstigste Hebel für mehr Eigenverbrauch.** In unserer Rechnung verlängert ein 100-kWh-Speicher zur 100-kWp-Anlage die Amortisation auf rund 10 Jahre, solange er nur den Eigenverbrauch hebt. Mit Leistungspreis-Einsparung sieht das anders aus – die Zahlen stehen im Ratgeber [Amortisation](/ratgeber/photovoltaik-amortisation#speicher), Preise unter [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
        {
          typ: "liste",
          punkte: [
            "**E-Flotte:** Dienstwagen und Transporter tagsüber laden, mit Lastmanagement für die Ladepunkte – siehe [E-Flotte laden mit PV](/ratgeber/e-flotte-laden-photovoltaik) und [Ladeinfrastruktur](/ladeinfrastruktur).",
            "**Speicher:** stationäre Speicher fallen unter den Öko-IFB und werden gemeinsam mit neuer PV mit 150 €/kWh gefördert. Lösungen unter [Gewerbespeicher](/gewerbespeicher).",
            "**Energiemanagement:** Kälte, Wärme und Ladepunkte nach Erzeugung steuern – mehr unter [Energiemanagementsystem](/ratgeber/energiemanagementsystem).",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie schnell amortisiert sich eine PV-Anlage in einem österreichischen Betrieb?",
      a: "Bei 40 bis 80 % Eigenverbrauch in unserem Beispiel nach 5 bis 8 Jahren vor Steuern (100 kWp, 75.000 € netto, 18 ct vermeidbarer Strompreis). Mit EAG-Zuschuss geht es rund ein Jahr schneller. Nach Steuern verlängert sich die Amortisation leicht, weil die Ersparnis den Gewinn erhöht.",
    },
    {
      q: "Gilt der Investitionsfreibetrag von 22 % für PV-Anlagen?",
      a: "Ja. PV-Anlagen zählen zu den ökologischen Wirtschaftsgütern, für die bei Anschaffung oder Herstellung von 1.11.2025 bis 31.12.2026 ein IFB von 22 % gilt, danach 15 %. Er wird zusätzlich zur AfA geltend gemacht und ist auf 1 Mio. € Bemessungsgrundlage je Wirtschaftsjahr begrenzt.",
    },
    {
      q: "Wie lange wird eine PV-Anlage in Österreich abgeschrieben?",
      a: "Die betriebsgewöhnliche Nutzungsdauer beträgt 20 Jahre, linear also 5 % pro Jahr. Alternativ ist eine degressive AfA von bis zu 30 % vom Restbuchwert möglich; ein späterer Wechsel zur linearen AfA ist erlaubt, umgekehrt nicht.",
    },
    {
      q: "Muss ich auf selbst verbrauchten Solarstrom Elektrizitätsabgabe zahlen?",
      a: "Nein. Selbst erzeugter und selbst verbrauchter Strom aus erneuerbaren Quellen ist ohne Mengengrenze von der Elektrizitätsabgabe befreit. 2026 beträgt die Abgabe für Unternehmen 0,82 ct/kWh, ab 2027 voraussichtlich wieder 1,5 ct/kWh – so viel spart jede selbst genutzte Kilowattstunde zusätzlich.",
    },
    {
      q: "Welche Förderkategorie gilt für eine 100-kWp-Anlage?",
      a: "Eine Anlage mit genau 100 kWp fällt in Kategorie C (über 20 bis 100 kWp, max. 130 €/kWp), jede größere Anlage bis 1.000 kWp in Kategorie D (max. 120 €/kWp). In beiden Kategorien bieten Sie Ihren Förderbedarf je kWp, und die niedrigsten Gebote werden zuerst gefördert. Kategorie D ist nicht mit Landesförderungen kombinierbar.",
    },
    {
      q: "Was bedeutet die 70-%-Spitzenkappung des ElWG für meinen Betrieb?",
      a: "Neue Anlagen dürfen je nach Vorgabe des Netzbetreibers nur bis 70 % der Modulleistung ins Netz einspeisen. Was Sie selbst verbrauchen oder speichern, ist davon nicht betroffen. Bei hohem Eigenverbrauch gehen daher nur wenige Kilowattstunden an sonnigen Mittagen verloren.",
    },
    {
      q: "Kann eine Anlage über 500 kWp an die OeMAG verkaufen?",
      a: "Nein, die Abnahme zum OeMAG-Marktpreis gilt nur für Anlagen unter 500 kWp. Größere Anlagen verkaufen ihren Überschuss über einen Stromhändler, Direktvermarkter oder per PPA. Mehr dazu unter [Direktvermarktung](/service/direktvermarktung).",
    },
  ],

  passend: [
    { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Planung, Montage und Netzanmeldung aus einer Hand." },
    { href: "/ratgeber/photovoltaik-amortisation", titel: "Amortisation berechnen", text: "IRR, Kapitalwert und Sensitivitäten Schritt für Schritt." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Eigenverbrauch erhöhen und Lastspitzen kappen." },
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Überschussstrom vermarkten statt nur einspeisen." },
  ],

  quellen: [
    { titel: "USP – Investitionsfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "09/2026" },
    { titel: "USP – Abschreibung (AfA)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/abschreibung.html", stand: "09/2026" },
    { titel: "USP – Elektrizitätsabgabe", url: "https://www.usp.gv.at/themen/steuern-finanzen/weitere-steuern-und-abgaben/verbrauchsteuern_und_energieabgaben/elektrizitaetsabgabe.html", stand: "09/2026" },
    { titel: "OeMAG – EAG-Investitionszuschüsseverordnung-Strom, konsolidierte Fassung vom 19.01.2026 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "01/2026" },
    { titel: "OeMAG – Marktpreis für Ökostrom", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "PV&B Austria – ElWG: Das Wichtigste im Überblick für den PV- und Speicherbereich", url: "https://pvbaustria.at/elwg-das-wichtigste-im-uberblick-fur-den-pv-und-speicherbereich/", stand: "09/2026" },
    { titel: "Eurostat – Strompreise für Nicht-Haushaltskunden (nrg_pc_205)", url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table", stand: "09/2026" },
    { titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (PDF)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "2025" },
  ],

  seitenCta: { titel: "PV für Ihren Betrieb?", text: "Anlage passend zu Lastgang, Dach und Netzanschluss planen lassen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Solarstrom für Ihren Betrieb – ausgelegt auf Ihren Lastgang.",
    text: "Ökovolt plant, montiert und meldet Gewerbeanlagen in ganz Österreich aus einer Hand – mit eigenem Parkregler, eigener Fernwartung und eigenem SCADA.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Förder-Check", href: "/foerdercheck" },
  },
};

export default artikel;
