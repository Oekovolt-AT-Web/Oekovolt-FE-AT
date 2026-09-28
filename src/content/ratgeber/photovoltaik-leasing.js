// Ratgeber (R1): Photovoltaik-Leasing für Unternehmen in Österreich
// Stand 09/2026. Zahlen direkt im Artikel (keine Imports), Rechenannahmen in den Fußnoten.
// Beispiel 100 kWp: 75.000 € netto, 1.000 kWh/kWp, 60 % Eigenverbrauch, 18 ct vermeidbarer Arbeitspreis,
// Überschuss 6 ct, Betriebskosten 15 €/kWp (+2 %/a), Strompreis +2 %/a, 0,4 % Degradation.
// Raten = Annuität (vereinfachte Vollamortisation ohne Gebühren/Restwert).

const artikel = {
  slug: "photovoltaik-leasing",
  title: "Photovoltaik-Leasing für Unternehmen: Raten, Steuer, Förderung",
  seoTitle: "Photovoltaik-Leasing für Betriebe 2026 | Ökovolt",
  kurzTitel: "Photovoltaik-Leasing",
  description:
    "Photovoltaik-Leasing für Unternehmen in Österreich: Wann sich Leasing statt Kauf rechnet, Beispielraten für 100 kWp, IFB, EAG-Förderung und Vertragsfallen.",
  excerpt:
    "Mit Leasing zahlt eine PV-Anlage ihre Rate oft ab dem ersten Jahr selbst. Was das kostet, wem Abschreibung und Investitionsfreibetrag zustehen und worauf Sie im Vertrag achten sollten.",
  hauptKeyword: "photovoltaik leasing",
  keywords: [
    "Photovoltaik Leasing",
    "PV-Anlage leasen Unternehmen",
    "Photovoltaik Leasing Österreich",
    "Leasing PV-Anlage Gewerbe",
    "Photovoltaik Leasingrate",
    "PV Leasing Steuer",
    "Photovoltaik Finanzierung Betrieb",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Referenzen/Projekte-1.jpg",
  bildAlt: "Photovoltaikmodule im Abendlicht, im Hintergrund Windkraftanlagen",
  badge: { wert: "≈ 850 €/Monat", text: "Leasingrate 100 kWp, 10 Jahre, 6 % (Beispiel)" },

  kurzFazit: [
    "**Beim Photovoltaik-Leasing finanziert eine Leasinggesellschaft die Anlage, Ihr Betrieb nutzt den Strom und zahlt eine monatliche Rate – ohne Eigenkapital und meist mit positivem Cashflow ab dem ersten Jahr.**",
    "Beispiel 100 kWp um 75.000 € netto: Bei 6 % Zins und 10 Jahren Laufzeit liegt die Rate bei rund **10.200 € im Jahr (≈ 850 € im Monat)**, die Anlage spart im ersten Jahr rund **11.700 €** an Stromkosten und Einspeiseerlösen.",
    "Leasing ist teurer als Kauf: Über 20 Jahre bleiben im Beispiel rund **160.000 €** Vorteil gegenüber rund **187.000 €** beim Kauf mit Eigenkapital – der Unterschied sind Zinsen und Marge.",
    "**Steuerlich zählt, wem die Anlage wirtschaftlich gehört.** Beim klassischen Leasing ist das die Leasinggesellschaft: Die Raten sind Betriebsausgaben, Abschreibung und Investitionsfreibetrag (2026: 22 %) stehen aber dem Leasinggeber zu.",
    "Vor dem Vertrag klären: Laufzeit im Verhältnis zur Nutzungsdauer (20 Jahre), Kaufoption am Ende, Versicherung, Wartung, EAG-Förderwerber und eine mögliche Bestandvertragsgebühr.",
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist Photovoltaik-Leasing?",
      tocLabel: "Was ist PV-Leasing?",
      bloecke: [
        {
          typ: "p",
          text: "**Photovoltaik-Leasing ist eine befristete, entgeltliche Überlassung einer PV-Anlage: Die Leasinggesellschaft kauft die Anlage und bleibt zivilrechtlich Eigentümerin, Ihr Betrieb nutzt sie gegen eine laufende Rate.** Der Leasingvertrag ist in Österreich nicht als eigener Vertragstyp geregelt; es gelten die Regeln ähnlicher Verträge wie Miete und Kauf. Beim üblichen Finanzierungsleasing trägt der Leasingnehmer in der Regel das wirtschaftliche Risiko – die Sachgefahr (Reparatur, Wartung, Versicherung) und die Preisgefahr: Geht die Anlage durch Zufall unter, laufen die Raten weiter.",
        },
        {
          typ: "p",
          text: "Für Betriebe ist Leasing vor allem eine Liquiditätsentscheidung. Statt 75.000 € für eine [100-kWp-Anlage](/ratgeber/photovoltaik-gewerbe) auf einmal zu bezahlen, verteilen Sie die Kosten auf die Jahre, in denen die Anlage Stromkosten spart. Eigenkapital und Kreditrahmen bei der Hausbank bleiben für das Kerngeschäft frei. Welche Alternativen es gibt – Kauf, Kredit, Contracting, Power Purchase Agreement – vergleicht der Ratgeber [Kauf, Leasing, Contracting oder PPA](/ratgeber/photovoltaik-mieten-oder-kaufen).",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Vollamortisation (Full-pay-out)", text: "Die Raten decken Anschaffung, Finanzierung und Marge des Leasinggebers vollständig. Am Ende steht meist eine Kauf- oder Verlängerungsoption. Im Mobilienleasing am häufigsten." },
            { titel: "Teilamortisation (Restwert)", text: "Ein kalkulierter Restwert bleibt am Ende offen – die Raten sind niedriger, der Restwert muss aber bezahlt, verlängert oder verwertet werden." },
            { titel: "Sale-and-lease-back", text: "Sie kaufen die Anlage, verkaufen sie an die Leasinggesellschaft und leasen sie zurück. Das setzt gebundenes Kapital nachträglich frei, steuerlich aber mit eigenen Regeln." },
          ],
        },
      ],
    },
    {
      id: "rate",
      titel: "Was kostet eine PV-Anlage im Leasing? Beispielraten",
      tocLabel: "Beispielraten",
      bloecke: [
        {
          typ: "p",
          text: "**Eine 100-kWp-Anlage um 75.000 € netto kostet im Leasing bei 6 % Zins und 10 Jahren rund 10.200 € im Jahr, bei 15 Jahren rund 7.700 €.** Die tatsächliche Rate hängt von Bonität, Laufzeit, Restwert, Anzahlung und den Konditionen der Leasinggesellschaft ab. Die folgende Tabelle zeigt vereinfachte Annuitäten ohne Bearbeitungsgebühr und Restwert.",
        },
        {
          typ: "tabelle",
          caption: "Beispielraten für eine PV-Anlage im Leasing (Annuität, netto, ohne Gebühren), Stand September 2026",
          kopf: ["Investition", "Laufzeit / Zins", "Rate pro Jahr", "Rate pro Monat (ca.)", "Summe der Raten"],
          zeilen: [
            ["75.000 € (100 kWp)", "10 J. / 5 %", "9.700 €", "810 €", "97.100 €"],
            ["75.000 € (100 kWp)", "10 J. / 6 %", "10.200 €", "850 €", "101.900 €"],
            ["75.000 € (100 kWp)", "15 J. / 6 %", "7.700 €", "640 €", "115.800 €"],
            ["300.000 € (500 kWp)", "10 J. / 6 %", "40.800 €", "3.400 €", "407.600 €"],
            ["300.000 € (500 kWp)", "15 J. / 6 %", "30.900 €", "2.570 €", "463.300 €"],
          ],
          hervorheben: 2,
          markierteZeile: 1,
          minBreite: 680,
          fussnote: "Annahmen: Annuität aus Investition, Zins und Laufzeit, jährlich nachschüssig; ohne Anzahlung, Restwert, Bearbeitungsgebühr, Versicherung und Umsatzsteuer (20 % USt auf die Raten, für vorsteuerabzugsberechtigte Betriebe durchlaufend). Investition als Richtwert 750 €/kWp (100 kWp) bzw. 600 €/kWp (500 kWp). Keine Konditionen einer bestimmten Leasinggesellschaft.",
        },
        {
          typ: "p",
          text: "Entscheidend ist der Vergleich mit dem, was die Anlage einbringt. Die 100-kWp-Anlage spart in unserem Standardbeispiel im ersten Jahr rund 11.700 € – rund 10.800 € durch selbst genutzten Strom (60 % von 100.000 kWh zu 18 ct) und rund 2.400 € aus dem Überschuss, abzüglich 1.500 € Betriebskosten. Bei 10 Jahren Laufzeit bleibt damit schon im ersten Jahr ein kleiner Überschuss von rund 1.500 €, bei 15 Jahren von rund 4.000 €. Nach dem Ende der Raten fließt der volle Vorteil in den Betrieb.",
        },
        {
          typ: "tabelle",
          caption: "Cashflow einer 100-kWp-Anlage im Leasing gegenüber dem Kauf, vor Steuern",
          kopf: ["Variante", "Jahr 1 (Vorteil − Rate)", "Jahre 11–20", "Summe nach 20 Jahren"],
          zeilen: [
            ["Kauf mit Eigenkapital", "−75.000 € Investition, dann +11.700 €", "+138.600 € (ohne Rate)", "≈ +187.000 €"],
            ["Kredit 10 J. / 5 %", "+2.000 €", "+138.600 €", "≈ +165.000 €"],
            ["Leasing 10 J. / 6 %, Übernahme zum Marktwert 5 %", "+1.500 €", "+138.600 €", "≈ +156.000 €"],
            ["Leasing 15 J. / 6 %", "+4.000 €", "Rate bis Jahr 15, danach frei", "≈ +146.000 €"],
          ],
          hervorheben: 3,
          minBreite: 680,
          fussnote: "Annahmen: 100 kWp, 75.000 € netto, 1.000 kWh/kWp, 0,4 % Degradation, 60 % Eigenverbrauch zu 18 ct/kWh (+2 %/Jahr), Überschuss 6 ct/kWh, Betriebskosten 15 €/kWp (+2 %/Jahr); Summe der Vorteile über 20 Jahre ≈ 261.800 €. Kaufoption bei Leasing 10 J. mit 5 % der Anschaffungskosten angenommen. Ohne Steuerwirkung, ohne EAG-Zuschuss, nicht abgezinst.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Laufzeit an den Cashflow anpassen",
          text: "Wählen Sie die Laufzeit so, dass die Rate unter der erwarteten Ersparnis liegt, aber nicht länger als nötig läuft. Bei hohem Eigenverbrauch reichen oft 10 Jahre; bei niedrigem Eigenverbrauch oder hohen Nebenkosten (Parkregler, Trafostation) sind 12 bis 15 Jahre realistischer. Wie sich Eigenverbrauch und Strompreis auf die Rechnung auswirken, zeigt die Sensitivitätsanalyse im Ratgeber [Amortisation berechnen](/ratgeber/photovoltaik-amortisation).",
        },
      ],
    },
    {
      id: "steuer",
      titel: "Wem gehört die Anlage steuerlich – und was folgt daraus?",
      tocLabel: "Steuer & Zurechnung",
      bloecke: [
        {
          typ: "p",
          text: "**Steuerlich entscheidet nicht das Eigentum laut Vertrag, sondern das wirtschaftliche Eigentum: Wer die Anlage wie ein Eigentümer beherrscht, aktiviert sie, schreibt sie ab und kann den Investitionsfreibetrag nutzen.** Die Einkommensteuerrichtlinien enthalten dafür Kriterien, die die WKO zusammenfasst. Bei einer Photovoltaikanlage mit einer betriebsgewöhnlichen Nutzungsdauer von 20 Jahren sind sie besonders relevant.",
        },
        {
          typ: "tabelle",
          caption: "Zurechnung beim Vollamortisations-Leasing nach den Einkommensteuerrichtlinien (vereinfacht, Nutzungsdauer PV 20 Jahre)",
          kopf: ["Situation", "Kriterium", "PV-Anlage (20 Jahre)", "Zurechnung"],
          zeilen: [
            ["Grundmietzeit sehr lang", "mehr als 90 % der Nutzungsdauer", "über 18 Jahre", "Leasingnehmer"],
            ["Grundmietzeit sehr kurz", "weniger als 40 % der Nutzungsdauer", "unter 8 Jahre", "Leasingnehmer"],
            ["Grundmietzeit dazwischen", "40–90 % der Nutzungsdauer", "8 bis 18 Jahre", "Leasinggeber – außer bei Kauf- oder Verlängerungsoption zu einem wirtschaftlich nicht angemessenen Betrag"],
            ["Spezialleasing", "nur beim Leasingnehmer sinnvoll verwendbar", "im Einzelfall prüfen", "Leasingnehmer"],
          ],
          minBreite: 720,
          fussnote: "Quelle: WKO, Ertragsteuerliche Behandlung von Leasing (Zurechnungsregeln der EStR, beispielhaft und nicht abschließend). Teilamortisationsverträge haben eigene Kriterien (Restwertrisiko, Kaufoption unter Verkehrswert). Keine Steuerberatung – Vertragsentwurf vorab prüfen lassen.",
        },
        {
          typ: "h3",
          text: "Zurechnung beim Leasinggeber: Raten als Betriebsausgabe",
        },
        {
          typ: "p",
          text: "Liegt das wirtschaftliche Eigentum bei der Leasinggesellschaft – der Normalfall bei 10 bis 15 Jahren Laufzeit und einer Kaufoption zum Marktwert –, sind die Leasingraten beim Betrieb laufende Betriebsausgaben. Die Anlage erscheint nicht in Ihrer Bilanz nach UGB. Im Gegenzug stehen Abschreibung und [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik) dem Leasinggeber zu. Das ist 2026 ein spürbarer Unterschied: Beim Kauf könnte eine GmbH für die 75.000-€-Anlage 22 % Öko-Investitionsfreibetrag, also 16.500 €, zusätzlich zur Abschreibung absetzen – bei 23 % Körperschaftsteuer rund 3.800 € Steuerersparnis. Fragen Sie deshalb, ob und wie die Leasinggesellschaft ihren Steuervorteil über die Rate weitergibt.",
        },
        {
          typ: "h3",
          text: "Zurechnung beim Leasingnehmer: wie ein Ratenkauf",
        },
        {
          typ: "p",
          text: "Wird die Anlage Ihrem Betrieb zugerechnet, behandelt das Steuerrecht das Leasing wie einen Kauf auf Raten: Sie aktivieren die Anlage mit den Anschaffungskosten, passivieren eine Verbindlichkeit gegenüber dem Leasinggeber und teilen die Raten in Tilgung und Zinsaufwand. Dann schreiben Sie selbst ab (linear 5 % oder degressiv bis 30 % vom Restbuchwert) und können – bei Anschaffung bis 31. Dezember 2026 – grundsätzlich den Investitionsfreibetrag geltend machen. Unternehmen, die nach IFRS bilanzieren, bilden Leasingverträge ohnehin weitgehend in der Bilanz ab.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Umsatzsteuer und Bestandvertragsgebühr",
          text: "Auf die Leasingraten fallen 20 % Umsatzsteuer an; vorsteuerabzugsberechtigte Betriebe erhalten sie zurück. Leasingverträge sind Bestandverträge – ob und in welcher Höhe die Bestandvertragsgebühr nach § 33 TP 5 Gebührengesetz (1 % der Bemessungsgrundlage) anfällt, hängt von der Vertragsgestaltung ab. Lassen Sie das vor Unterschrift klären; viele Leasinggesellschaften weisen die Gebühr im Angebot aus.",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung beim Leasing: Wer ist Förderwerber?",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Den EAG-Investitionszuschuss beantragt, wer die Investition setzt – beim Leasing muss deshalb vor dem Förderansuchen feststehen, ob Leasinggesellschaft oder Betrieb als Förderwerber auftritt.** Der Antrag ist vor der Inbetriebnahme einzubringen, Genehmigungen und die Bestätigung des Netzbetreibers über die Anschlussmöglichkeit müssen vorliegen. Kategorie C (20–100 kWp) bringt 2026 höchstens 130 €/kWp, Kategorie D (100–1.000 kWp) höchstens 120 €/kWp, jeweils maximal 30 % der förderfähigen Kosten.",
        },
        {
          typ: "liste",
          punkte: [
            "**Vertrag und Förderung abstimmen:** Klären Sie schriftlich, wer den Zuschuss erhält und wie er die Rate senkt (Einmalzahlung auf den Leasingbetrag oder Weitergabe über die Laufzeit).",
            "**Fristen im Blick:** Nach der Zusage muss die Anlage bis 100 kWp binnen 6 Monaten, darüber binnen 12 Monaten in Betrieb gehen. Leasingvertrag, Lieferung und Montage müssen in dieses Fenster passen.",
            "**Kumulierung:** Kategorie D darf nicht mit anderen Förderungen kombiniert werden; bei A bis C sind Landes- und Gemeindeförderungen im Rahmen der beihilferechtlichen Grenzen möglich.",
            "**Zuschuss als Bonus rechnen:** Der Juni-Call 2026 war nach Angaben von PV Austria in 33 Sekunden ausgeschöpft. Legen Sie die Leasingrate so aus, dass sie auch ohne Zuschuss trägt.",
          ],
        },
        {
          typ: "p",
          text: "Alle Details zu Fördercalls, Reihung und Fristen stehen im Ratgeber [EAG-Investitionszuschuss 2026](/ratgeber/eag-investitionszuschuss). Welche Programme für Ihr Projekt passen, prüft der [Förder-Check](/foerdercheck); einen Überblick bietet die Seite [Bundesförderung](/forderungen/bundesfoerderung).",
        },
      ],
    },
    {
      id: "vertrag",
      titel: "Worauf Sie im Leasingvertrag achten sollten",
      tocLabel: "Vertrags-Checkliste",
      bloecke: [
        {
          typ: "p",
          text: "**Ein PV-Leasingvertrag bindet Sie meist 10 bis 15 Jahre – prüfen Sie deshalb neben der Rate vor allem Risikoverteilung, Laufzeitende und Nebenpflichten.** Eine vorzeitige Kündigung ist bei Unternehmergeschäften in der Regel nur einvernehmlich möglich.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Gesamtkosten:** Summe aller Raten, Anzahlung, Bearbeitungsgebühr, Restwert oder Kaufoptionspreis, Gebühren – nicht nur die Monatsrate vergleichen.",
            "**Zins und Indexierung:** Fixzins über die gesamte Laufzeit oder variabel? Ist die Rate an einen Index gebunden?",
            "**Laufzeitende:** Kaufoption zu welchem Preis, Verlängerung, Rückgabe? Bei Rückgabe: Wer demontiert, wer stellt das Dach wieder her?",
            "**Sach- und Preisgefahr:** Wer versichert gegen Hagel, Sturm, Brand und Betriebsunterbrechung? Laufen die Raten bei Totalschaden weiter? Siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
            "**Wartung und Ertrag:** Wer wartet, wer überwacht den Ertrag, wer tauscht den Wechselrichter? Ein [Wartungsvertrag](/ratgeber/photovoltaik-wartungsvertrag) mit Fernüberwachung schützt Ihre Ersparnis.",
            "**Dach und Gebäude:** Dachsanierung während der Laufzeit, Verkauf der Immobilie, Mietende bei gemieteten Hallen – was passiert mit dem Vertrag?",
            "**Netz und Technik:** Wer ist Anlagenbetreiber gegenüber Netzbetreiber und OeMAG, wer erfüllt Pflichten aus TOR Erzeuger und ElWG (Ansteuerbarkeit, Spitzenkappung)?",
            "**Förderung und Steuer:** Förderwerber, Weitergabe des Zuschusses, Zurechnung, Bestandvertragsgebühr – schriftlich festhalten.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Leasing ersetzt keine gute Planung",
          text: "Ob Leasing, Kredit oder Kauf: Die Anlage muss zum Lastgang passen. Eine überdimensionierte Anlage mit viel Überschuss zu 6 ct/kWh trägt eine Leasingrate deutlich schlechter als eine Anlage, deren Strom zu 80 % im Betrieb bleibt. Wie Sie die Größe bestimmen, zeigt [PV-Anlage richtig dimensionieren](/ratgeber/pv-anlage-groesse-berechnen).",
        },
      ],
    },
    {
      id: "vergleich",
      titel: "Leasing, Kredit oder Kauf: Wann passt was?",
      tocLabel: "Leasing oder Kauf?",
      bloecke: [
        {
          typ: "p",
          text: "**Leasing lohnt sich vor allem, wenn Liquidität knapp oder anderweitig besser eingesetzt ist – wer genug Eigenkapital hat und den Investitionsfreibetrag nutzen kann, fährt mit dem Kauf meist günstiger.** Ein Investitionskredit liegt dazwischen: Die Anlage gehört Ihnen, Sie nutzen Abschreibung und Freibetrag, zahlen aber Zinsen.",
        },
        {
          typ: "tabelle",
          caption: "Leasing, Kredit und Kauf für Photovoltaik im Betrieb im Vergleich",
          kopf: ["Kriterium", "Kauf (Eigenkapital)", "Investitionskredit", "Leasing (Zurechnung Leasinggeber)"],
          zeilen: [
            ["Kapitalbedarf", "voll", "gering (Eigenmittelanteil der Bank)", "keiner bis gering"],
            ["Bilanz (UGB)", "Anlagevermögen", "Anlagevermögen + Verbindlichkeit", "nicht bilanziert, Raten als Aufwand"],
            ["Abschreibung / IFB 22 %", "ja / ja", "ja / ja", "beim Leasinggeber"],
            ["Kosten über 20 Jahre", "am niedrigsten", "+ Zinsen", "+ Zinsen und Marge"],
            ["Flexibilität", "hoch", "mittel", "gering (Vertragsbindung)"],
            ["Aufwand", "Planung, Förderung selbst", "plus Kreditprüfung", "plus Leasingprüfung, Vertrag"],
          ],
          minBreite: 720,
          fussnote: "Vereinfachte Gegenüberstellung. Bei Zurechnung an den Leasingnehmer gleicht Leasing steuerlich dem Kredit. Contracting und PPA siehe Ratgeber Kauf, Leasing, Contracting oder PPA.",
        },
        {
          typ: "p",
          text: "Wenn Sie weder investieren noch finanzieren möchten, kommen Modelle ohne Eigentum in Frage: Beim Contracting oder bei einem [Power Purchase Agreement](/ratgeber/ppa-oesterreich) baut und betreibt ein Dritter die Anlage, Ihr Betrieb kauft den Strom zu einem festen Preis. Für kleinere Betriebe kann auch die Teilnahme an einer [Energiegemeinschaft](/ratgeber/energiegemeinschaft-gewerbe) eine Alternative sein.",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "So läuft ein PV-Projekt mit Leasing ab",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Lastgang und Dach prüfen", "Viertelstundenwerte der letzten 12 Monate, Dachstatik, Netzanschluss – daraus ergeben sich Größe, Eigenverbrauch und Ersparnis."],
            ["Angebot und Wirtschaftlichkeit", "Anlage, Leistungsumfang und Ertragsprognose festlegen; Ersparnis pro Jahr als Basis für die tragbare Rate."],
            ["Leasinganfrage und Bonität", "Jahresabschlüsse, betriebswirtschaftliche Auswertung und Angebot an die Leasinggesellschaft; Konditionen vergleichen."],
            ["Förderung und Netz", "Netzzugangsantrag stellen, Förderwerber festlegen, EAG-Antrag vor Inbetriebnahme im offenen Fördercall einbringen."],
            ["Vertrag, Montage, Inbetriebnahme", "Leasingvertrag unterschreiben, Anlage errichten, Fertigstellungsmeldung an den Netzbetreiber, Abnahme und Übergabe."],
            ["Betrieb", "Monitoring, Wartung und Versicherung laufen über die gesamte Laufzeit; am Ende Kaufoption, Verlängerung oder Rückgabe."],
          ],
        },
        {
          typ: "p",
          text: "Ökovolt aus Ostermiething plant, errichtet und wartet PV-Anlagen für Betriebe in ganz Österreich und organisiert bzw. vermittelt die Finanzierung über Leasingpartner – ein eigenes Leasingprodukt bieten wir nicht an. Mehr dazu unter [Finanzierung](/service/finanzierung) und [Photovoltaik für Gewerbe](/gewerbe).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Lohnt sich Leasing für eine Photovoltaikanlage im Betrieb?",
      a: "Leasing lohnt sich, wenn die jährliche Ersparnis die Rate übersteigt und Sie Eigenkapital schonen möchten. Im Beispiel spart eine 100-kWp-Anlage im ersten Jahr rund 11.700 €, die Rate liegt bei 10 Jahren und 6 % bei rund 10.200 €. Über 20 Jahre ist der Kauf mit Eigenkapital aber um rund 30.000 € günstiger.",
    },
    {
      q: "Kann ich geleaste PV-Anlagen abschreiben?",
      a: "Nur wenn Ihnen die Anlage steuerlich zugerechnet wird, etwa bei sehr kurzer oder sehr langer Grundmietzeit oder einer Kaufoption weit unter dem Marktwert. Im Normalfall ist die Leasinggesellschaft wirtschaftliche Eigentümerin, und Sie setzen die Raten als Betriebsausgabe ab. Lassen Sie den Vertrag steuerlich prüfen.",
    },
    {
      q: "Bekomme ich den Investitionsfreibetrag auch beim Leasing?",
      a: "Den Investitionsfreibetrag – 2026 für PV 22 % – kann nur der wirtschaftliche Eigentümer geltend machen. Beim klassischen Leasing ist das die Leasinggesellschaft. Fragen Sie, ob sie den Vorteil über die Rate weitergibt, oder vergleichen Sie mit einem Kauf auf Kredit.",
    },
    {
      q: "Gibt es die EAG-Förderung auch für geleaste Anlagen?",
      a: "Ja, gefördert wird die Investition, nicht die Finanzierungsform. Vor dem Antrag muss aber feststehen, wer Förderwerber ist und wie der Zuschuss die Rate senkt. Der Antrag ist vor der Inbetriebnahme in einem offenen Fördercall einzubringen.",
    },
    {
      q: "Wie lange sollte ein PV-Leasingvertrag laufen?",
      a: "Üblich sind 10 bis 15 Jahre. Kürzere Laufzeiten bedeuten höhere Raten, längere mehr Zinsen. Bei einer Nutzungsdauer von 20 Jahren bleibt die Anlage bei 8 bis 18 Jahren Grundmietzeit steuerlich in der Regel dem Leasinggeber zugerechnet.",
    },
    {
      q: "Was passiert am Ende der Leasinglaufzeit?",
      a: "Meist können Sie die Anlage kaufen, den Vertrag verlängern oder sie zurückgeben. Da eine gut gewartete Anlage 25 bis 30 Jahre läuft, ist die Übernahme in der Regel wirtschaftlich; danach profitieren Sie ohne Rate vom vollen Stromkostenvorteil.",
    },
    {
      q: "Wer haftet, wenn die geleaste Anlage beschädigt wird?",
      a: "Beim Finanzierungsleasing trägt in der Regel der Leasingnehmer die Sach- und Preisgefahr: Reparaturen gehen zu seinen Lasten, und bei Zerstörung laufen die Raten weiter. Eine Photovoltaik- bzw. Elektronikversicherung mit Ertragsausfall ist deshalb Pflicht.",
    },
  ],

  passend: [
    { href: "/service/finanzierung", titel: "Finanzierung & Leasing", text: "Wir organisieren die passende Finanzierung für Ihr Projekt." },
    { href: "/ratgeber/photovoltaik-mieten-oder-kaufen", titel: "Kauf, Leasing, Contracting oder PPA?", text: "Alle Modelle im 20-Jahres-Vergleich." },
    { href: "/ratgeber/investitionsfreibetrag-photovoltaik", titel: "Investitionsfreibetrag 22 %", text: "Was der Kauf bis Ende 2026 steuerlich bringt." },
    { href: "/gewerbe", titel: "Photovoltaik für Betriebe", text: "Planung nach Lastgang aus einer Hand." },
  ],

  quellen: [
    { titel: "WKO – Ertragsteuerliche Behandlung von Leasing (Zurechnungskriterien der EStR)", url: "https://www.wko.at/steuern/ertragsteuer-leasing", stand: "09/2026" },
    { titel: "WKO – Was sind Leasingverträge? (Sach- und Preisgefahr, Kündigung)", url: "https://www.wko.at/vertragsrecht/was-sind-leasingvertraege", stand: "09/2026" },
    { titel: "USP – Investitionsfreibetrag (20 % / 22 % bis 31.12.2026)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "09/2026" },
    { titel: "USP – Abschreibung (lineare und degressive AfA)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/abschreibung.html", stand: "09/2026" },
    { titel: "EAG-Investitionszuschüsseverordnung-Strom, konsolidierte Fassung vom 19.01.2026 (OeMAG)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "09/2026" },
    { titel: "BMF – Erneuerbare-Energie-Gemeinschaften (u. a. Bestandvertragsgebühr § 33 TP 5 GebG)", url: "https://www.bmf.gv.at/themen/klimapolitik/steuerliche-aspekte-bei-photovoltaikanlagen-von-privatpersonen/erneuerbare-energie-gemeinschaften.html", stand: "09/2026" },
    { titel: "BMWET/Technikum Wien – Marktentwicklung Photovoltaik 2024 (Systempreise)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "09/2026" },
    { titel: "PV&B Austria – PV-Fördercall: 33 Sekunden entscheiden (13.07.2026)", url: "https://pvbaustria.at/pv-foerdercall-33-sekunden-entscheiden-ueber-zu-oder-absage-pv-austria-kritisiert-foerderlotterie-und-fordert-neustart/", stand: "09/2026" },
  ],

  seitenCta: { titel: "PV ohne Eigenkapital?", text: "Wir rechnen Rate und Ersparnis für Ihren Betrieb.", href: "/service/finanzierung", label: "Finanzierung anfragen" },
  cta: {
    title: "Rate und Ersparnis – für Ihren Betrieb durchgerechnet.",
    text: "Wir legen die Anlage auf Ihren Lastgang aus, rechnen Leasing, Kredit und Kauf nebeneinander und organisieren die Finanzierung mit unseren Partnern. Ökovolt aus Ostermiething, seit 2012 in ganz Österreich.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Zur Finanzierung", href: "/service/finanzierung" },
  },
};

export default artikel;
