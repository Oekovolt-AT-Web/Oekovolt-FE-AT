// Ratgeber (R1): Photovoltaik für Gemeinden – Vergabe, Finanzierung, Bürgerbeteiligung
// Stand 09/2026: Vergaberechtsgesetz 2026 (BGBl. I Nr. 8/2026), EU-Schwellenwerte ab 1.1.2026 (WKO),
// EAG-IZV (Vergaberecht als Fördervoraussetzung § 4 Abs. 1 Z 5), KPC-Programme.
// Rechenbeispiele mit Standardannahmen R1 (1.000 kWh/kWp, 0,4 % Degradation, +2 %/a); Annahmen in Fußnoten.

const artikel = {
  slug: "photovoltaik-gemeinde",
  title: "Photovoltaik für Gemeinden: Vergabe, Finanzierung, Bürgerbeteiligung",
  seoTitle: "Photovoltaik für Gemeinden: Vergabe & Förderung | Ökovolt",
  kurzTitel: "Photovoltaik für Gemeinden",
  description:
    "Photovoltaik für Gemeinden in Österreich: geeignete Objekte, Vergaberecht 2026 mit neuen Schwellenwerten, Förderung, Energiegemeinschaft und Bürgerbeteiligung.",
  excerpt:
    "Kläranlage, Schule, Bauhof: Wo sich Photovoltaik für Gemeinden am schnellsten rechnet, wie Sie nach dem Vergaberechtsgesetz 2026 beschaffen und wie Bürgerinnen und Bürger mitprofitieren.",
  hauptKeyword: "photovoltaik gemeinde",
  keywords: [
    "Photovoltaik Gemeinde",
    "PV-Anlage Gemeinde Österreich",
    "Photovoltaik Ausschreibung Gemeinde",
    "Direktvergabe Photovoltaik",
    "Bürgerbeteiligung Photovoltaik",
    "Energiegemeinschaft Gemeinde",
    "Photovoltaik Kläranlage",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/AT/ratgeber/photovoltaik-gemeinde.jpg",
  bildAlt: "Photovoltaikanlage auf dem Dach des Gemeindeamts Fresach in Kärnten",
  badge: { wert: "200.000 €", text: "Direktvergabe bei Bauaufträgen seit 1.3.2026" },

  kurzFazit: [
    "**Für Gemeinden rechnet sich Photovoltaik am schnellsten dort, wo tagsüber und ganzjährig Strom gebraucht wird: Kläranlage, Wasserversorgung, Bauhof, Amtsgebäude.** Eine 100-kWp-Anlage auf einer Kläranlage mit 85 % Eigenverbrauch amortisiert sich im Beispiel in rund 5 Jahren.",
    "Schulen sind wegen Sommerferien schwieriger: Eine 50-kWp-Anlage kommt bei 45 % Eigenverbrauch und brutto gerechnet auf rund 9 Jahre – mit Weitergabe des Überschusses über eine **Energiegemeinschaft** auf rund 7,5 Jahre.",
    "Seit dem **Vergaberechtsgesetz 2026** (in Kraft ab 1. März 2026) dürfen Gemeinden Bauaufträge bis **200.000 €** und Liefer-/Dienstleistungsaufträge bis **140.000 €** netto direkt vergeben; ab 50.000 € sind grundsätzlich drei Angebote oder Preisauskünfte einzuholen. EU-weit auszuschreiben ist ab 5.404.000 € (Bau) bzw. 216.000 € (Lieferung).",
    "Der **EAG-Investitionszuschuss** steht auch Gemeinden offen (bis 130 €/kWp in Kategorie C); das Vergaberecht einzuhalten ist Fördervoraussetzung.",
    "Bürgerinnen und Bürger profitieren am einfachsten über eine **Erneuerbare-Energie-Gemeinschaft**; finanzielle Beteiligungsmodelle brauchen eine rechtliche Prüfung.",
  ],

  abschnitte: [
    {
      id: "objekte",
      titel: "Welche Gemeindegebäude eignen sich für Photovoltaik?",
      tocLabel: "Geeignete Objekte",
      bloecke: [
        {
          typ: "p",
          text: "**Am wirtschaftlichsten sind Gemeindeobjekte mit hohem Tagesverbrauch über das ganze Jahr – Kläranlagen, Wasserversorgung, Bauhöfe und Amtsgebäude –, weil dort fast jede erzeugte Kilowattstunde selbst genutzt wird.** Schulen, Kindergärten und Sporthallen haben große Dächer, aber in den Sommerferien kaum Verbrauch; dort entscheidet die Verwertung des Überschusses über die Wirtschaftlichkeit.",
        },
        {
          typ: "tabelle",
          caption: "Gemeindeobjekte und ihre Eignung für Photovoltaik",
          kopf: ["Objekt", "Verbrauchsprofil", "Typischer Eigenverbrauch", "Hinweis"],
          zeilen: [
            ["Kläranlage, Abwasserpumpwerke", "rund um die Uhr, Belüftung und Pumpen", "hoch (70–90 %)", "oft Betrieb gewerblicher Art – Vorsteuerabzug möglich"],
            ["Wasserversorgung, Hochbehälter", "Pumpen, teils zeitlich steuerbar", "mittel bis hoch", "Pumpzeiten in die Mittagsstunden legen"],
            ["Bauhof, Altstoffsammelzentrum", "werktags, E-Fahrzeuge und Geräte", "mittel bis hoch", "Ladeinfrastruktur für den Fuhrpark mitplanen"],
            ["Gemeindeamt", "werktags Büro, IT, Klima", "mittel", "gut für Notstrom- und Krisenversorgung"],
            ["Schule, Kindergarten", "Schultage, Ferien fast null", "niedrig bis mittel (35–50 %)", "Überschuss über Energiegemeinschaft verwerten"],
            ["Sporthalle, Freibad", "saisonal, Freibad im Sommer ideal", "je nach Nutzung", "Freibad: Pumpen und Wärmepumpe passen zur Sonne"],
            ["Parkplätze (ab 10 Stellplätzen)", "–", "je nach Nutzung", "Parkplatzüberdachung: +30 % EAG-Zuschlag"],
          ],
          minBreite: 720,
          fussnote: "Eigenverbrauchsanteile als Richtwerte, abhängig von Anlagengröße und Lastgang. Die tatsächlichen Werte ergeben sich aus den Viertelstundenwerten des Smart Meters.",
        },
        {
          typ: "p",
          text: "Ein praktischer Einstieg ist eine Liste aller Gemeindeobjekte mit Jahresverbrauch, Dachfläche, Dachzustand und Zählpunkt. Daraus ergibt sich eine Rangfolge: zuerst die Objekte mit hohem Eigenverbrauch und intaktem Dach, dann die großen Dächer mit Überschuss, die über eine [Energiegemeinschaft](/ratgeber/energiegemeinschaft-gruenden) andere Gemeindeobjekte oder Haushalte versorgen. Für die Standortbewertung eignet sich unser [Standort-Check](/standort-check).",
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Rechnet sich Photovoltaik für die Gemeinde? Zwei Beispiele",
      tocLabel: "Wirtschaftlichkeit",
      bloecke: [
        {
          typ: "p",
          text: "**Ja – mit großen Unterschieden je nach Objekt: Die Kläranlage amortisiert ihre Anlage im Beispiel in rund 5 Jahren, die Schule in rund 9 Jahren.** Ein wichtiger Unterschied zu Unternehmen: Im Hoheitsbereich kann die Gemeinde keine Vorsteuer abziehen, dort zählen Investition und Stromkosten brutto.",
        },
        {
          typ: "tabelle",
          caption: "Wirtschaftlichkeit von PV-Anlagen auf Gemeindeobjekten (vor Steuern, Beispielrechnung)",
          kopf: ["Objekt / Variante", "Investition", "Vorteil Jahr 1", "Amortisation", "Rendite (IRR)", "Überschuss nach 25 J."],
          zeilen: [
            ["Kläranlage 100 kWp, 85 % Eigenverbrauch, netto", "75.000 €", "14.700 €", "≈ 5,0 Jahre", "≈ 21 %", "≈ 364.000 €"],
            ["Kläranlage wie oben, mit EAG-Zuschuss 130 €/kWp", "62.000 €", "14.700 €", "≈ 4,1 Jahre", "≈ 25 %", "≈ 377.000 €"],
            ["Volksschule 50 kWp, 45 % Eigenverbrauch, brutto", "51.000 €", "5.600 €", "≈ 8,8 Jahre", "≈ 11 %", "≈ 107.000 €"],
            ["Volksschule wie oben, Überschuss in Energiegemeinschaft", "51.000 €", "6.700 €", "≈ 7,4 Jahre", "≈ 13 %", "≈ 134.000 €"],
            ["Volksschule wie oben, mit EAG-Zuschuss", "44.500 €", "5.600 €", "≈ 7,7 Jahre", "≈ 13 %", "≈ 114.000 €"],
          ],
          markierteZeile: 0,
          hervorheben: 3,
          minBreite: 760,
          fussnote: "Annahmen: 1.000 kWh/kWp, 0,4 % Degradation, 25 Jahre, Strompreis +2 %/Jahr, Betriebskosten +2 %/Jahr. Kläranlage (Betrieb gewerblicher Art, netto): 750 €/kWp, vermiedener Arbeitspreis 18 ct/kWh, Überschuss 6 ct/kWh, Betriebskosten 15 €/kWp. Volksschule (Hoheitsbereich, brutto): 1.020 €/kWp (850 € netto + 20 % USt), vermiedener Arbeitspreis 21,6 ct/kWh brutto, Überschuss 6 ct/kWh bzw. 10 ct/kWh Wert innerhalb der Energiegemeinschaft (Annahme), Betriebskosten 18 €/kWp. EAG-Zuschuss nur mit Zuschlag im Fördercall. Keine Angebotspreise.",
        },
        {
          typ: "p",
          text: "Die Beispiele zeigen: Die Anlagengröße sollte zum Verbrauch des Objekts passen, und Überschüsse sollten nicht einfach zum Marktpreis ins Netz gehen, wenn sie in der Gemeinde mehr wert sind. Wie sich Eigenverbrauch und Strompreis auf die Amortisation auswirken, erklärt der Ratgeber [Amortisation berechnen](/ratgeber/photovoltaik-amortisation); Richtpreise nach Größenklasse stehen unter [Photovoltaik Kosten 2026](/ratgeber/solaranlage-kosten).",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Umsatzsteuer: Hoheitsbereich oder Betrieb gewerblicher Art?",
          text: "Im Hoheitsbereich (Schule, Amt) ist die Gemeinde nicht Unternehmerin und kann die 20 % Umsatzsteuer nicht als Vorsteuer abziehen. Für Betriebe gewerblicher Art – nach § 2 Abs. 3 UStG gelten etwa Wasserwerke sowie Einrichtungen zur Müll- und Abwasserentsorgung als solche – ist ein Vorsteuerabzug grundsätzlich möglich. Ob und in welchem Umfang die PV-Anlage einem Betrieb gewerblicher Art zuzuordnen ist und was für die Einspeisung gilt, klären Sie vorab mit Ihrer Steuerberatung. Keine Steuerberatung.",
        },
      ],
    },
    {
      id: "vergabe",
      titel: "Vergaberecht 2026: Wie Gemeinden PV-Anlagen beschaffen",
      tocLabel: "Vergaberecht 2026",
      bloecke: [
        {
          typ: "p",
          text: "**Gemeinden sind öffentliche Auftraggeber und müssen PV-Anlagen nach dem Bundesvergabegesetz beschaffen; seit dem Vergaberechtsgesetz 2026 (BGBl. I Nr. 8/2026, großteils in Kraft seit 1. März 2026) sind die Wertgrenzen dafür dauerhaft angehoben.** Die bisher befristete Schwellenwerteverordnung ist damit ausgelaufen, ihre Werte stehen nun direkt im Gesetz.",
        },
        {
          typ: "tabelle",
          caption: "Wesentliche Wertgrenzen für klassische öffentliche Auftraggeber (netto), Stand September 2026",
          kopf: ["Verfahren", "Bauaufträge", "Liefer- und Dienstleistungsaufträge"],
          zeilen: [
            ["Direktvergabe", "unter 200.000 €", "unter 140.000 €"],
            ["… davon: Pflicht, sich um 3 Angebote/Preisauskünfte zu bemühen", "ab 50.000 €", "ab 50.000 €"],
            ["Direktvergabe mit vorheriger Bekanntmachung", "unter 2.000.000 €", "unter 140.000 €"],
            ["Nicht offenes Verfahren ohne Bekanntmachung", "unter 2.000.000 €", "entfällt für klassische Auftraggeber"],
            ["EU-weite Ausschreibung (Oberschwellenbereich)", "ab 5.404.000 €", "ab 216.000 €"],
          ],
          hervorheben: 1,
          minBreite: 640,
          fussnote: "Quellen: WKO, Vergaberecht 2026 im Überblick, Schwellenwerteverordnung und Schwellenwerte für EU-weite Ausschreibungen (gültig 1.1.2026–31.12.2027). Sektorenauftraggeber haben teils abweichende Werte. Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Bauauftrag oder Lieferauftrag?",
          text: "Ob eine PV-Anlage mit Montage als Bau- oder als Lieferauftrag gilt, hängt vom Schwerpunkt der Leistung ab – und damit, ob 200.000 € oder 140.000 € als Direktvergabegrenze gelten. Legen Sie die Einordnung dokumentiert fest, bevor Sie das Verfahren wählen, und schätzen Sie den Auftragswert realistisch: Aufträge dürfen nicht künstlich geteilt werden, um unter einer Schwelle zu bleiben.",
        },
        {
          typ: "h3",
          text: "Was in eine gute Leistungsbeschreibung gehört",
        },
        {
          typ: "checkliste",
          punkte: [
            "Anlagengröße bzw. Dachfläche, Lastgangdaten des Objekts und Ziel (Eigenverbrauch, Energiegemeinschaft, Notstrom).",
            "Technische Mindestanforderungen: Module mit Schnee- und Hagelnachweis, Unterkonstruktion mit Statiknachweis, Wechselrichter, Monitoring.",
            "Netz: Netzzugangsantrag, Anforderungen aus TOR Erzeuger, Ansteuerbarkeit und Spitzenkappung nach ElWG, bei Bedarf EZA-/Parkregler.",
            "Brandschutz nach OVE R 11-1, Abstimmung mit der Feuerwehr, Dokumentation und Anlagenbuch nach ÖVE/ÖNORM EN 62446-1.",
            "Förderabwicklung: Wer stellt das EAG-Förderansuchen, wer haftet für Fristen?",
            "Wartung, Fernüberwachung und Reaktionsweg als eigener Leistungsteil oder Option.",
            "Zuschlagskriterien: neben dem Preis etwa Ertragsprognose (kWh pro Jahr), Wartungsumfang, Lieferzeit – nachvollziehbar gewichtet.",
          ],
        },
        {
          typ: "p",
          text: "Direktvergaben sind formfrei, aber nicht regellos: Gleichbehandlung, Preisangemessenheit und Dokumentation gelten auch hier. Die Dokumentation brauchen Sie zudem für die Förderung – beim EAG-Investitionszuschuss ist die Einhaltung der vergaberechtlichen Bestimmungen ausdrücklich Voraussetzung (§ 4 Abs. 1 Z 5 EAG-IZV). Checklisten für den Angebotsvergleich finden Sie im Ratgeber [PV-Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen).",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung für Gemeinde-PV: EAG, KPC und Länder",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Gemeinden können wie Unternehmen den EAG-Investitionszuschuss beantragen – 2026 bis 130 €/kWp für 20 bis 100 kWp und bis 120 €/kWp für 100 bis 1.000 kWp, dazu 150 € je kWh Speicher.** Der letzte Fördercall 2026 läuft vom 8. bis 22. Oktober; der Antrag muss vor der Inbetriebnahme eingebracht werden, Genehmigungen und die Anschlussbestätigung des Netzbetreibers müssen vorliegen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Kombination:** Anlagen der Kategorien A bis C dürfen mit Landes- und Gemeindeförderungen kombiniert werden (beihilferechtliche Grenzen beachten), Kategorie D nicht.",
            "**Zuschläge:** +30 % für innovative Anlagen wie Parkplatzüberdachungen ab 10 Stellplätzen oder gebäudeintegrierte PV, bis +20 % für Module und Wechselrichter aus europäischer Fertigung.",
            "**KPC/Klima- und Energiefonds:** In Klima- und Energie-Modellregionen wurden kommunale Notfallresilienzsysteme gefördert – neue PV im Netzparallelbetrieb mit Speicher und Notstromfunktion für krisenrelevante Infrastruktur, ab 5 kWp. Ob aktuell ein Call offen ist, prüfen Sie vor Projektstart.",
            "**Energiegemeinschaften:** Die KPC fördert 2026 die Weiterentwicklung bestehender Energiegemeinschaften (Einreichung bis 30. September 2026).",
          ],
        },
        {
          typ: "p",
          text: "Die Fördercalls sind stark überzeichnet – der Juni-Call 2026 war laut Branchenverband in 33 Sekunden vergeben. Planen Sie Gemeindeprojekte deshalb so, dass sie auch ohne Zuschuss im Budget darstellbar sind. Details im Ratgeber [EAG-Investitionszuschuss 2026](/ratgeber/eag-investitionszuschuss); welche Programme Ihr Projekt nutzen kann, zeigt der [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "energiegemeinschaft",
      titel: "Energiegemeinschaft und Bürgerbeteiligung: So profitiert die Bevölkerung",
      tocLabel: "Bürgerbeteiligung",
      bloecke: [
        {
          typ: "p",
          text: "**Der einfachste Weg, Bürgerinnen und Bürger am Gemeindestrom zu beteiligen, ist eine Erneuerbare-Energie-Gemeinschaft: Die Gemeinde speist Überschüsse ihrer Anlagen ein, Haushalte und Betriebe im Ort beziehen sie zu einem vereinbarten Preis und zahlen reduzierte Netzentgelte.** Gemeinden dürfen Mitglied einer Erneuerbare-Energie-Gemeinschaft sein; der Überschuss von Schule oder Sporthalle wird so vor Ort genutzt statt billig verkauft.",
        },
        {
          typ: "tabelle",
          caption: "Modelle der Bürgerbeteiligung an Gemeinde-PV",
          kopf: ["Modell", "Wie es funktioniert", "Aufwand / rechtlicher Rahmen"],
          zeilen: [
            ["Erneuerbare-Energie-Gemeinschaft", "Bürger beziehen lokal erzeugten Strom, Gemeinde verwertet Überschüsse", "Verein oder Genossenschaft, Verträge, Abrechnung; gut etabliert"],
            ["Genossenschaft", "Bürger zeichnen Anteile, die Genossenschaft errichtet und betreibt Anlagen", "Gründung, Revision, Organe; demokratische Mitbestimmung"],
            ["Beteiligungsmodell mit fester Verzinsung (z. B. Sale-and-lease-back einzelner Module)", "Bürger finanzieren Module mit, erhalten Rückzahlung plus Vergütung", "Bankwesen- und Kapitalmarktrecht (z. B. Alternativfinanzierungsgesetz) vorab prüfen"],
            ["Bürgerenergiegemeinschaft", "wie Energiegemeinschaft, auch über das Konzessionsgebiet hinaus", "keine Befreiung von der Elektrizitätsabgabe, weniger Netzentgeltvorteile"],
          ],
          minBreite: 720,
          fussnote: "Orientierung, keine Rechtsberatung. Finanzielle Beteiligungsangebote an die Öffentlichkeit können Prospekt- oder Konzessionspflichten auslösen.",
        },
        {
          typ: "p",
          text: "Die Befreiung von der Elektrizitätsabgabe für selbst erzeugten und verbrauchten erneuerbaren Strom gilt laut BMF auch für Erneuerbare-Energie-Gemeinschaften und gemeinschaftliche Erzeugungsanlagen, nicht aber für Bürgerenergiegemeinschaften. Wie Sie eine Energiegemeinschaft gründen, Rechtsform und Abrechnung wählen, erklärt der Ratgeber [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden); unsere Leistungen dazu finden Sie unter [Energiegemeinschaften](/energiegemeinschaften).",
        },
      ],
    },
    {
      id: "krise",
      titel: "Notstrom und Blackout-Vorsorge für kritische Gemeindeinfrastruktur",
      tocLabel: "Notstrom & Blackout",
      bloecke: [
        {
          typ: "p",
          text: "**Eine netzgekoppelte PV-Anlage liefert bei Stromausfall ohne Zusatztechnik keinen Strom – erst mit Speicher, notstromfähigem Wechselrichter und sicherer Netztrennung kann sie Gemeindeamt, Feuerwehrhaus oder Wasserversorgung im Krisenfall mitversorgen.** Für Gemeinden, die Krisenstab, Kommunikation und Trinkwasser absichern müssen, ist das ein zweiter Nutzen neben der Stromkostenersparnis.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Krisenrelevante Verbraucher festlegen und deren Leistung messen (Server, Funk, Beleuchtung, Pumpen, Heizungsregelung).",
            "Speichergröße nach Überbrückungsdauer auslegen – und klären, ob ein Notstromaggregat ergänzt werden soll.",
            "Notstromfähige Wechselrichter und Umschalteinrichtung nach den Vorgaben des Netzbetreibers vorsehen.",
            "Betrieb regelmäßig testen und im Krisenplan der Gemeinde verankern.",
          ],
        },
        {
          typ: "p",
          text: "Mehr dazu in den Ratgebern [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik) und [Blackout-Vorsorge](/ratgeber/blackout-vorsorge-unternehmen) sowie unter [Notstrom](/service/notstrom).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Vom Gemeinderatsbeschluss zur Inbetriebnahme",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Bestandsaufnahme", "Objektliste mit Verbrauch, Lastgang, Dachfläche, Dachzustand und Zählpunkten erstellen; Prioritäten festlegen."],
            ["Grobplanung und Budget", "Anlagengrößen, Investition, Wirtschaftlichkeit (brutto/netto), Finanzierung und Energiegemeinschaft skizzieren."],
            ["Beschluss und Vergabeweg", "Gemeinderatsbeschluss, Einordnung als Bau- oder Lieferauftrag, Auftragswert schätzen, Verfahren wählen."],
            ["Netz und Förderung", "Netzzugangsantrag, Klärung der Baurechtslage, EAG-Förderansuchen im offenen Fördercall vor Inbetriebnahme."],
            ["Vergabe und Errichtung", "Angebote einholen und dokumentieren, Zuschlag, Montage, Prüfung und Fertigstellungsmeldung an den Netzbetreiber."],
            ["Betrieb", "Monitoring, Wartung, Abrechnung in der Energiegemeinschaft, Kommunikation an die Bevölkerung."],
          ],
        },
        {
          typ: "p",
          text: "Die baurechtlichen Vorgaben unterscheiden sich je Bundesland; ab 2027 bringt das Erneuerbaren-Ausbau-Beschleunigungsgesetz eine bundesweite Genehmigungsfreiheit für PV auf den meisten Gebäuden. Details im Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung). Ökovolt aus Ostermiething plant und errichtet PV-Anlagen für Gemeinden in ganz Österreich – mit eigenem [Parkregler](/technik/parkregler), Fernwartung und SCADA. Mehr unter [Photovoltaik für Gemeinden](/kommunen).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Darf eine Gemeinde eine PV-Anlage direkt vergeben?",
      a: "Ja, wenn der geschätzte Auftragswert unter den Grenzen liegt: seit dem Vergaberechtsgesetz 2026 unter 200.000 € netto bei Bauaufträgen und unter 140.000 € bei Liefer- und Dienstleistungsaufträgen. Ab 50.000 € muss sich die Gemeinde grundsätzlich um drei Angebote oder Preisauskünfte bemühen und alles dokumentieren.",
    },
    {
      q: "Ab wann muss eine Gemeinde eine PV-Anlage EU-weit ausschreiben?",
      a: "Ab einem geschätzten Auftragswert von 5.404.000 € netto bei Bauaufträgen bzw. 216.000 € bei Liefer- und Dienstleistungsaufträgen klassischer öffentlicher Auftraggeber. Diese EU-Schwellenwerte gelten vom 1. Jänner 2026 bis 31. Dezember 2027.",
    },
    {
      q: "Kann eine Gemeinde die Umsatzsteuer auf die PV-Anlage zurückholen?",
      a: "Im Hoheitsbereich, etwa bei Schulen oder dem Gemeindeamt, grundsätzlich nicht – dort zählt der Bruttopreis. Bei Betrieben gewerblicher Art wie Wasser- oder Abwasserbetrieben ist ein Vorsteuerabzug grundsätzlich möglich. Die Zuordnung sollte vorab steuerlich geklärt werden.",
    },
    {
      q: "Bekommen Gemeinden den EAG-Investitionszuschuss?",
      a: "Ja. Gemeinden können wie andere juristische Personen Förderwerber sein; 2026 gibt es bis 130 €/kWp (20–100 kWp) bzw. 120 €/kWp (100–1.000 kWp). Voraussetzung ist unter anderem, dass das Vergaberecht eingehalten wurde und der Antrag vor der Inbetriebnahme eingebracht wird.",
    },
    {
      q: "Welche Gemeindegebäude sollten zuerst eine PV-Anlage bekommen?",
      a: "Jene mit hohem, gleichmäßigem Tagesverbrauch: Kläranlage, Wasserversorgung, Bauhof und Amtsgebäude. Schulen und Sporthallen folgen, wenn Überschüsse über eine Energiegemeinschaft oder an andere Gemeindeobjekte weitergegeben werden können.",
    },
    {
      q: "Wie können Bürger an der PV-Anlage der Gemeinde teilhaben?",
      a: "Am einfachsten über eine Erneuerbare-Energie-Gemeinschaft, in der die Gemeinde ihren Überschuss an Haushalte und Betriebe im Ort liefert. Finanzielle Beteiligungsmodelle wie Genossenschaften oder Modul-Beteiligungen sind möglich, brauchen aber eine rechtliche Prüfung.",
    },
    {
      q: "Liefert die PV-Anlage des Gemeindeamts bei einem Blackout Strom?",
      a: "Nur mit Speicher, notstromfähigem Wechselrichter und sicherer Netztrennung. Eine normale netzgekoppelte Anlage schaltet bei Netzausfall aus Sicherheitsgründen ab.",
    },
  ],

  passend: [
    { href: "/kommunen", titel: "Photovoltaik für Gemeinden", text: "Planung, Vergabeunterlagen und Umsetzung aus einer Hand." },
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "Gemeindestrom im Ort teilen." },
    { href: "/ratgeber/eag-investitionszuschuss", titel: "EAG-Investitionszuschuss 2026", text: "Fördercalls, Sätze und Fristen." },
    { href: "/service/notstrom", titel: "Notstrom & Blackout-Vorsorge", text: "Krisenrelevante Infrastruktur absichern." },
  ],

  quellen: [
    { titel: "WKO – Vergaberecht 2026 im Überblick (BGBl. I Nr. 8/2026)", url: "https://www.wko.at/wirtschaftsrecht/highlights-vergaberechtsgesetz-2026", stand: "09/2026" },
    { titel: "WKO – Schwellenwerteverordnung im Überblick (Wertgrenzen seit Vergaberechtsgesetz 2026)", url: "https://www.wko.at/wirtschaftsrecht/schwellenwerteverordnung-2023", stand: "09/2026" },
    { titel: "WKO – Schwellenwerte für EU-weite Ausschreibungen ab 1.1.2026", url: "https://www.wko.at/wirtschaftsrecht/schwellenwerte-eu-weite-ausschreibungen", stand: "09/2026" },
    { titel: "EAG-Investitionszuschüsseverordnung-Strom, konsolidierte Fassung vom 19.01.2026 (OeMAG)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "09/2026" },
    { titel: "Umweltförderung (KPC) – KEM kommunale Notfallresilienzsysteme", url: "https://www.umweltfoerderung.at/gemeinden/kem-kommunale-notfallresilienzsysteme", stand: "09/2026" },
    { titel: "Umweltförderung (KPC) – Energiegemeinschaften (Gemeinden)", url: "https://www.umweltfoerderung.at/gemeinden/energiegemeinschaften", stand: "09/2026" },
    { titel: "BMF – Erneuerbare-Energie-Gemeinschaften (Elektrizitätsabgabe, Umsatzsteuer)", url: "https://www.bmf.gv.at/themen/klimapolitik/steuerliche-aspekte-bei-photovoltaikanlagen-von-privatpersonen/erneuerbare-energie-gemeinschaften.html", stand: "09/2026" },
    { titel: "PV&B Austria – EABG-Beschluss: bundesweite Genehmigungsfreiheit für Gebäude-PV", url: "https://pvbaustria.at/eabg-beschluss-mutlose-ausbauziele-lichtblicke-bei-buerokratieabbau-und-speichern/", stand: "09/2026" },
  ],

  seitenCta: { titel: "PV für Ihre Gemeinde?", text: "Objektliste prüfen, Vergabeweg klären, Förderung sichern.", href: "/kommunen", label: "Zu den Gemeindelösungen" },
  cta: {
    title: "Photovoltaik für Ihre Gemeinde – vergaberechtssicher geplant.",
    text: "Wir bewerten Ihre Objekte, liefern die technischen Grundlagen für Leistungsbeschreibung und Förderansuchen und errichten die Anlagen mit Parkregler, Fernwartung und SCADA. Ökovolt aus Ostermiething, seit 2012 in ganz Österreich.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Photovoltaik für Gemeinden", href: "/kommunen" },
  },
};

export default artikel;
