// Ratgeber: Freiflächen-Photovoltaik – Widmung und Zonierung je Bundesland
// Rechtsstand 28.09.2026, recherchiert im RIS (Landesrecht konsolidiert) und in Meldungen von PV Austria.
// EABG: BGBl. I Nr. 47/2026. EAG-Abschläge: § 33 und § 56 Abs. 8 EAG, § 6 EAG-IZ-VO Strom (Fassung 2026).

const artikel = {
  slug: "freiflaechen-photovoltaik-widmung",
  title: "Solarpark-Genehmigung in Österreich: Widmung, Ablauf und EABG ab 2027",
  seoTitle: "Solarpark genehmigen: Ablauf & EABG 2027 | Ökovolt",
  kurzTitel: "Freiflächen-PV Widmung",
  description:
    "Solarpark genehmigen in Österreich: wann eine Widmung nötig ist, Ablauf von der Fläche zur Genehmigung, EABG-Beschleunigungsgebiete ab 2027, Pacht und Netz.",
  excerpt:
    "Ob ein Solarpark gebaut werden darf, entscheidet in Österreich die Raumordnung des Landes: von 50 m² Modulfläche in Oberösterreich bis zu 116 PV-Zonen in Niederösterreich. Der Überblick mit Tabelle, Ablauf und Förderfolgen.",
  hauptKeyword: "solarpark genehmigung österreich",
  keywords: [
    "Freiflächen Photovoltaik Widmung",
    "PV Freifläche Raumordnung",
    "Grünland Photovoltaik Widmung",
    "Sektorales Raumordnungsprogramm Photovoltaik",
    "Photovoltaik Vorrangzonen Steiermark",
    "Eignungszonen Photovoltaik Burgenland",
    "Beschleunigungsgebiete Photovoltaik",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-30",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/AT/ratgeber/freiflaechen-photovoltaik-widmung.jpg",
  bildAlt: "Aufgeständerte Photovoltaikanlage auf einer Wiese vor einem Wohnhaus im Vorarlberger Rheintal im Winter",
  badge: { wert: "9 Länder", text: "neun verschiedene Widmungsregeln für Solarparks" },

  kurzFazit: [
    "**Eine Freiflächen-PV-Anlage braucht in Österreich fast immer eine eigene Widmung im Flächenwidmungsplan der Gemeinde – und ab einer bestimmten Größe eine Zone oder Vorrangfläche des Landes.** Die Schwellen sind je Bundesland verschieden.",
    "Die Spannweite ist groß: In **Oberösterreich** braucht jede freistehende Anlage über **50 m² Modulfläche** eine Sonderausweisung, in **Niederösterreich** ab **50 kW**, und über **2 ha** nur in einer der **116 Zonen** des Sektoralen Raumordnungsprogramms. Die **Steiermark** lässt über 10 ha nur in **36 Vorrangzonen** zu, **Kärnten** begrenzt Widmungsflächen grundsätzlich auf **4 ha**.",
    "Das **Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG, BGBl. I Nr. 47/2026)** bringt Beschleunigungsgebiete mit verkürzter Grobprüfung ab 2027; die Länder weisen sie gerade aus – etwa Salzburg entlang von A1 und A10.",
    "**Förderung:** Auf landwirtschaftlich genutzten Flächen und im Grünland sinkt der EAG-Investitionszuschuss um **25 %** – außer bei Agri-PV mit mindestens 75 % landwirtschaftlicher Nutzung und auf vorbelasteten oder versiegelten Flächen.",
    "Die Kriterien je Bundesland mit Quelle und Stand stehen im Überblick [Widmung für Freiflächen-PV](/freiflaechen-photovoltaik/widmung); dieser Ratgeber erklärt den Weg von der Fläche zur Genehmigung.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Brauche ich für eine PV-Freiflächenanlage eine Widmung?",
      tocLabel: "Widmung nötig?",
      bloecke: [
        {
          typ: "p",
          text: "**Ja – in allen Bundesländern ist für Photovoltaik auf Freiflächen über einer geringen Bagatellgrenze eine eigene [Widmung](/wissen/lexikon#freiflaechenwidmung) oder Sonderausweisung im Flächenwidmungsplan nötig.** Grünland ist für die Land- und Forstwirtschaft bestimmt; ein Solarpark ist dort ohne ausdrückliche Festlegung nicht zulässig. Zuständig für den Flächenwidmungsplan ist die Gemeinde, die Rahmenbedingungen setzt das Land mit Raumordnungsgesetz und überörtlichen Programmen.",
        },
        {
          typ: "p",
          text: "Dazu kommen je nach Projekt weitere Verfahren: die elektrizitätsrechtliche Bewilligung nach dem Landeselektrizitätsgesetz, eine naturschutzrechtliche Bewilligung, bei Gewässern eine wasserrechtliche Bewilligung und in manchen Ländern eine Baubewilligung für Unterkonstruktion und Trafostation. Wer eine Fläche verpachten oder selbst einen Solarpark errichten will, sollte deshalb zuerst die Raumordnung klären – erst dann lohnen sich Netzanfrage, Ertragsgutachten und Detailplanung. Wie wir Solarparks von der Flächenprüfung bis zum Betrieb umsetzen, zeigt die Seite [Freiflächenanlagen](/freiflaechen-photovoltaik).",
        },
      ],
    },
    {
      id: "bundeslaender",
      titel: "Widmung und Zonierung: Die Regeln der neun Bundesländer",
      tocLabel: "Tabelle Bundesländer",
      bloecke: [
        {
          typ: "p",
          text: "**Jedes Bundesland hat ein eigenes System: Manche arbeiten mit landesweiten Zonen, andere mit Punkteschemata oder reinen Einzelfallentscheidungen der Gemeinde.** Die Tabelle fasst den Rechtsstand September 2026 zusammen.",
        },
        {
          typ: "tabelle",
          caption: "Freiflächen-PV: Instrumente, Schwellenwerte und Zonen je Bundesland, Stand 09/2026",
          kopf: ["Bundesland", "Instrument", "Ab wann Widmung/Zone nötig", "Zonen, Vorrang- und Eignungsflächen"],
          zeilen: [
            ["Burgenland", "Bgld. Raumplanungsgesetz 2019 (§ 22d), Eignungszonenverordnung für PV- und Solar-Freiflächenanlagen (LGBl. Nr. 60/2021 i. d. g. F.)", "über 35 m² Modulfläche (auf Betriebs- und Industriegebiet über 200 m²) nur in Eignungszonen; unter 10 ha zusätzlich Widmung „Grünfläche“ mit gesonderter Ausweisung Photovoltaik", "Eignungszonen per Landesverordnung; zusätzlich Photovoltaikabgabe (Gemeindeanteil 700 € je MW und Jahr)"],
            ["Kärnten", "K-ROG 2021, Kärntner Photovoltaikanlagen-Verordnung 2024 (K-PhV 2024)", "Freiflächenanlagen grundsätzlich nur auf „Grünland – Photovoltaikanlage“ bzw. „Grünland – Agri-Photovoltaikanlage“; Ausnahmen u. a. auf Gebäuden, Parkplätzen, Infrastrukturflächen", "keine Landeszonen; Widmungsfläche höchstens 4 ha (vorbelastete Flächen und Pilotanlagen bis 10 ha), 1.000 m Mindestabstand zwischen Widmungsflächen"],
            ["Niederösterreich", "NÖ ROG 2014 (§ 20 Abs. 2 Z 21, Abs. 3c–3e), Sektorales Raumordnungsprogramm über Photovoltaikanlagen im Grünland", "Widmung „Grünland – Photovoltaikanlagen“ ab 50 kW Engpassleistung; über 2 ha nur in Zonen", "116 Zonen; Ausnahmen bis 10 ha im Umkreis von 500 m zum Betrieb (Eigenversorgung) sowie auf künstlichen Gewässern"],
            ["Oberösterreich", "Oö. ROG 1994 (§ 30a, Fassung LGBl. Nr. 62/2026)", "Sonderausweisung im Flächenwidmungsplan für jede freistehende Anlage im Grünland über 50 m² Modulfläche", "keine landesweit verordneten PV-Zonen; Beurteilung im Widmungsverfahren der Gemeinde"],
            ["Salzburg", "Sbg. ROG 2009 (§ 36 Abs. 7, § 39b, § 16a), Photovoltaik-Kennzeichnungsverordnung (LGBl. Nr. 73/2023)", "Kennzeichnung im Flächenwidmungsplan für freistehende Solaranlagen über 200 m² Kollektorfläche", "Punkteschema für unbelastetes Grünland (Boden, Lage, Agri-PV-Bonus); Beschleunigungsgebiete entlang A1/A10 in Vorbereitung"],
            ["Steiermark", "StROG 2010 (§ 33), Entwicklungsprogramm Sachbereich Erneuerbare Energie – Solarenergie (LGBl. Nr. 52/2023 i. d. g. F.)", "Sondernutzung im Freiland; bis 2 ha zur lokalen Versorgung, bis 10 ha an vorbelasteten Standorten; darüber nur in Vorrangzonen", "36 Vorrangzonen; Ausschlusszonen (u. a. Wald, Schutzgebiete, landwirtschaftliche Vorrangzonen außer Agri-PV); Beschleunigungsgebiete in Begutachtung"],
            ["Tirol", "TROG 2022 (Sonderflächen, § 43), Tiroler Naturschutzgesetz 2005, Tiroler Elektrizitätsgesetz 2012", "Sonderflächenwidmung mit Verwendungszweck Photovoltaik; Bagatellgrenzen im Einzelfall mit Gemeinde und Land klären", "keine landesweiten PV-Zonen; Beschleunigungsgebiete nach TEG vorgesehen"],
            ["Vorarlberg", "Raumplanungsgesetz (§ 18 Freifläche-Sondergebiet, § 9 Beschleunigungsgebiete)", "Freifläche-Sondergebiet für Anlagen zur Erzeugung erneuerbarer Energie", "Beschleunigungsgebiete über Landesraumplan vorgesehen"],
            ["Wien", "Bauordnung für Wien (Flächenwidmungs- und Bebauungsplan), WERUG 2020", "Freiflächen-PV im Grünland nur mit entsprechender Widmung; Fokus auf Dächer und Überbauungen", "keine eigenen PV-Zonen; beschleunigte Verfahren für Solaranlagen auf künstlichen Strukturen (§ 16a WERUG)"],
          ],
          minBreite: 900,
          fussnote: "Eigene Auswertung der konsolidierten Landesgesetze im RIS, Stand 28.09.2026; vereinfacht. Weitere Voraussetzungen (Naturschutz, Elektrizitätsrecht, Baurecht, Ortsbild) gelten zusätzlich. Die Rechtslage ändert sich laufend – vor Projektstart bei Gemeinde und Landesregierung prüfen. Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Zonen allein bauen noch keinen Solarpark",
          text: "Niederösterreich hat 2022 als erstes großes Bundesland ein Zonenprogramm mit 116 Flächen erlassen. Laut PV Austria (Mai 2026) wurden bisher aber nur in 11 dieser Zonen Anlagen realisiert. Gründe sind fehlende Netzkapazität, Grundeigentum, Naturschutzauflagen und Förderbedingungen. Eine Zone ist also eine Einladung, keine Garantie.",
        },
      ],
    },
    {
      id: "laender-details",
      titel: "Die wichtigsten Besonderheiten im Detail",
      tocLabel: "Länder im Detail",
      bloecke: [
        { typ: "h3", text: "Niederösterreich: 50 kW, 2 ha und 116 Zonen" },
        {
          typ: "p",
          text: "Das NÖ Raumordnungsgesetz verlangt die Widmung „Grünland – Photovoltaikanlagen“ für Anlagen mit mehr als 50 kW Engpassleistung, einschließlich Speicher bis zur doppelten Engpassleistung. Flächen mit weniger als 200 m Abstand werden zusammengerechnet. Über 2 ha ist die Widmung nur in den Zonen des Sektoralen Raumordnungsprogramms zulässig – mit zwei Ausnahmen: bis zu 10 ha im Umkreis von 500 m eines Betriebs im Bauland, wenn geeignete Dach- und Parkplatzflächen überwiegend genutzt werden und die Anlage höchstens den Jahresverbrauch des Betriebs deckt (bei über 20 GWh Verbrauch weitere 10 ha), sowie Anlagen auf künstlichen stehenden Gewässern.",
        },
        { typ: "h3", text: "Steiermark: 2 ha, 10 ha, Vorrangzone" },
        {
          typ: "p",
          text: "Das Sachprogramm Solarenergie staffelt nach Größe: Bis 2 ha dürfen Gemeinden Eignungszonen und Sondernutzungen zur lokalen Versorgung festlegen, bis 10 ha im Anschluss an Autobahnen, Bahnlinien, Umspannwerke, Kläranlagen, Gewerbegebiete oder auf Deponien und Materialgewinnungsstätten. Über 10 ha sind Freiflächenanlagen nur in den 36 Vorrangzonen erlaubt, Agri-PV ausgenommen. In Vorrangzonen gelten Gestaltungsvorgaben, etwa Sektoren von höchstens 10 ha und Heckenstreifen von mindestens 5 m Breite.",
        },
        { typ: "h3", text: "Kärnten: 4 ha und 1.000 m Abstand" },
        {
          typ: "p",
          text: "Die K-PhV 2024 begrenzt zusammenhängende Widmungsflächen auf 4 ha, auf vorbelasteten oder versiegelten Flächen und für Pilotanlagen auf 10 ha; zwischen Widmungsflächen sind 1.000 m Abstand einzuhalten. Agri-PV-Anlagen, die Obstbau, Geflügelhaltung oder Fischzucht schützen, brauchen keine eigene Widmung; Agri-PV auf Weiden mit mindestens 1,5 Großvieheinheiten je Hektar an 120 Tagen im Jahr benötigt die Widmung „Grünland – Agri-Photovoltaikanlage“.",
        },
        { typ: "h3", text: "Salzburg: Punkte für Boden, Lage und Agri-PV" },
        {
          typ: "p",
          text: "Auf unbelastetem Grünland entscheidet die Photovoltaik-Kennzeichnungsverordnung per Punkteschema: Je nach Bodenqualität sind 20, 30 oder 40 Punkte nötig. Punkte gibt es für die Nähe zu Autobahnen, Bahnlinien, Gewerbegebieten, Deponien oder Bergstationen sowie für Agri-PV (5 Punkte, innovative Agri-PV mit vertikalen oder mindestens 2 m hohen Modulen 10 Punkte) und hohe Flächeneffizienz. Im Februar 2026 hat Salzburg zudem die Grundlage für Beschleunigungsgebiete geschaffen; der Verordnungsentwurf sieht laut Salzburger Nachrichten rund 135 ha entlang der Autobahnen vor.",
        },
      ],
    },
    {
      id: "eabg",
      titel: "EABG und Beschleunigungsgebiete: Was sich ab 2027 ändert",
      tocLabel: "EABG",
      bloecke: [
        {
          typ: "p",
          text: "**Mit dem Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG, BGBl. I Nr. 47/2026) setzt Österreich die EU-Erneuerbaren-Richtlinie RED III um: In ausgewiesenen Beschleunigungsgebieten ersetzt eine Grobprüfung weite Teile der Umweltprüfung im Einzelverfahren.** Die Behörde entscheidet ab 1. Jänner 2027 binnen 45 Werktagen, bei Anlagen unter 150 kW und beim Repowering binnen 30 Werktagen, ob ein Projekt die festgelegten Minderungsmaßnahmen einhält.",
        },
        {
          typ: "p",
          text: "Das EABG definiert auch Agri-Solarenergieanlagen: landwirtschaftliche Hauptnutzung, gleichmäßige Verteilung der Module und mindestens 75 % der Projektfläche in landwirtschaftlicher Produktion. Und es legt je Bundesland Ausbauziele fest.",
        },
        {
          typ: "tabelle",
          caption: "Mindestens zusätzliche Stromerzeugung aus Photovoltaik bis 2030 gegenüber 2020 laut EABG, Anhang 3",
          kopf: ["Bundesland", "PV-Ziel bis 2030", "Bundesland", "PV-Ziel bis 2030"],
          zeilen: [
            ["Niederösterreich", "2,50 TWh", "Kärnten", "0,63 TWh"],
            ["Steiermark", "2,20 TWh", "Salzburg", "0,55 TWh"],
            ["Oberösterreich", "1,50 TWh", "Vorarlberg", "0,40 TWh"],
            ["Tirol", "1,20 TWh", "Wien", "0,37 TWh"],
            ["Burgenland", "1,15 TWh", "Österreich gesamt", "10,50 TWh"],
          ],
          fussnote: "Quelle: Erneuerbaren-Ausbau-Beschleunigungsgesetz, Anhang 3 (RIS, Fassung 02.07.2026).",
        },
        {
          typ: "p",
          text: "Laut PV Austria bringt das EABG zudem ab 2027 eine bundesweite Genehmigungsfreiheit für PV-Anlagen auf und an den meisten Gebäuden. Für Freiflächen bleibt die Raumordnung der Länder maßgeblich – die Beschleunigung greift nur dort, wo Länder Gebiete tatsächlich ausweisen. Die Details zu Genehmigungen am Gebäude erklärt der Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Ablauf: Von der Fläche zum genehmigten Solarpark",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Flächen-Check", "Widmung, Zonen, Ausschlusskriterien (Wald, Schutzgebiete, Gefahrenzonen), Bodenqualität und Hangneigung prüfen; Naturgefahren über HORA bzw. unseren [Standort-Check](/standort-check) abfragen."],
            ["Netzanfrage", "Beim Verteilernetzbetreiber die Anschlussmöglichkeit und Netzebene klären – ohne Netzkapazität ist die beste Fläche wertlos. Details im Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss)."],
            ["Gemeinde gewinnen", "Frühes Gespräch mit Bürgermeister und Gemeinderat; Umwidmung erfordert Änderung des örtlichen Entwicklungskonzepts bzw. Flächenwidmungsplans samt Auflage, Stellungnahmen und oft strategischer Umweltprüfung."],
            ["Fachgutachten", "Naturschutz (Arten, Biotope), Landschaftsbild und Blendung, Boden, Oberflächenwasser, bei Bedarf Ornithologie."],
            ["Bewilligungen", "Elektrizitätsrechtliche Bewilligung, Naturschutzbescheid, Bauverfahren für Trafostation und Zaun, bei Gewässern Wasserrecht."],
            ["Förderung und Vermarktung", "EAG-Investitionszuschuss (bis 1 MWp) oder Marktprämie, PPA oder Direktvermarktung festlegen."],
            ["Bau und Betrieb", "Errichtung, Netzanschluss mit Parkregler, Inbetriebnahme, Monitoring, Pflege- und Rückbaukonzept."],
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "UVP: Kein eigener PV-Tatbestand",
          text: "Das UVP-G 2000 enthält (Stand 09/2026) keinen eigenen Tatbestand für Photovoltaik-Freiflächenanlagen. Eine UVP-Pflicht kann sich im Einzelfall über andere Tatbestände ergeben, etwa über Rodungen oder Vorhaben in Schutzgebieten. Die naturschutz- und raumordnungsrechtlichen Prüfungen der Länder bleiben davon unberührt.",
        },
      ],
    },
    {
      id: "pacht-netz-foerderung",
      titel: "Pacht, Netz und Förderung: Die wirtschaftlichen Stellschrauben",
      tocLabel: "Pacht, Netz, Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Ob ein genehmigungsfähiger Solarpark auch wirtschaftlich ist, entscheiden Netzanschluss, Förderbedingungen und der Pachtvertrag.** Die Widmung ist die Eintrittskarte, nicht der Business-Case.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Netzanschluss", text: "Freiflächen ab etwa 1 MWp werden meist in der Mittelspannung (Netzebene 5) angeschlossen, große Parks über eigene Umspannwerke. Die Kosten für Leitung und Station können einen großen Teil der Investition ausmachen – Entfernung zum Einspeisepunkt früh klären. Für den Netzanschluss verlangen Netzbetreiber einen Parkregler; mehr dazu unter [Parkregler](/technik/parkregler)." },
            { titel: "Pacht", text: "Üblich sind Laufzeiten von 20 bis 30 Jahren mit Verlängerungsoption, Indexierung, Rückbauverpflichtung samt Sicherheit (z. B. Bankgarantie) und Regelungen zur Pflege. Pachthöhen variieren stark nach Region und Netznähe; Landwirtschaftskammern beraten Grundeigentümer." },
            { titel: "EAG-Abschlag", text: "Für PV auf landwirtschaftlich genutzten Flächen oder im Grünland sinken Investitionszuschuss und Marktprämie um 25 % (§ 33 und § 56 Abs. 8 EAG). Der Abschlag entfällt für Agri-PV mit mindestens 75 % landwirtschaftlicher Nutzung und für bestimmte vorbelastete oder versiegelte Flächen wie Deponien oder Bergbauflächen." },
          ],
        },
        {
          typ: "tabelle",
          caption: "EAG-Investitionszuschuss 2026 für Photovoltaik (Auszug), Stand 09/2026",
          kopf: ["Kategorie", "Leistung", "Fördersatz 2026", "Freifläche auf Grünland"],
          zeilen: [
            ["C", "über 20 bis 100 kWp", "bis 130 €/kWp (Gebot)", "−25 %, außer Agri-PV/vorbelastete Flächen"],
            ["D", "über 100 bis 1.000 kWp", "bis 120 €/kWp (Gebot)", "−25 %, außer Agri-PV/vorbelastete Flächen"],
            ["Zuschlag innovative PV", "z. B. schwimmende PV, vertikale oder hohe Agri-PV", "+30 %", "ohne Freiflächen-Abschlag"],
            ["Zuschlag europäische Wertschöpfung", "Module und/oder Wechselrichter aus EWR/Schweiz", "je +10 %, max. +20 %", "zusätzlich anwendbar"],
          ],
          fussnote: "Quelle: EAG-Investitionszuschüsseverordnung-Strom, §§ 5 und 6 (Fassung ab 17.01.2026). Fördercalls 2026 u. a. vom 8. bis 22. Oktober 2026. Förderung höchstens 30 % der Investitionskosten. Über 1 MWp erfolgt die Förderung über die Marktprämie.",
        },
        {
          typ: "p",
          text: "Die Fördermechanik im Detail beschreibt der Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss). Wie Strom aus einem Solarpark ohne Förderung vermarktet wird, zeigt [PPA in Österreich](/ratgeber/ppa-oesterreich). Freiflächen, die weiterhin landwirtschaftlich genutzt werden, behandelt der Ratgeber [Agri-PV in Österreich](/ratgeber/agri-pv-oesterreich).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Darf ich auf meinem Acker einfach eine PV-Anlage bauen?",
      a: "Nein. Ab einer geringen Größe – etwa 50 m² Modulfläche in Oberösterreich, 35 m² im Burgenland oder 200 m² in Salzburg – brauchen Sie eine eigene Widmung oder Kennzeichnung im Flächenwidmungsplan. Größere Anlagen sind in vielen Ländern nur in Zonen des Landes zulässig.",
    },
    {
      q: "Wer entscheidet über die Widmung?",
      a: "Der Gemeinderat ändert den Flächenwidmungsplan, die Landesregierung genehmigt ihn aufsichtsbehördlich. Überörtliche Zonen legt das Land per Verordnung fest. Ohne Zustimmung der Gemeinde gibt es in der Praxis keinen Solarpark.",
    },
    {
      q: "Wie viele PV-Zonen gibt es in Niederösterreich?",
      a: "Das Sektorale Raumordnungsprogramm über Photovoltaikanlagen im Grünland weist 116 Zonen aus. Laut PV Austria wurden bis Mai 2026 nur in 11 davon Anlagen errichtet – Netz, Grundstücke und Auflagen bremsen.",
    },
    {
      q: "Was sind Beschleunigungsgebiete?",
      a: "Gebiete, die das Land nach einer strategischen Umweltprüfung als besonders geeignet für erneuerbare Energie ausweist. Projekte dort durchlaufen nach dem EABG ab 2027 eine Grobprüfung mit Fristen von 30 bzw. 45 Werktagen statt einer vollen Einzelfallprüfung.",
    },
    {
      q: "Gibt es für Freiflächen-PV weniger Förderung?",
      a: "Ja. Auf landwirtschaftlich genutzten Flächen und im Grünland wird der EAG-Investitionszuschuss bzw. die Marktprämie um 25 % gekürzt. Der Abschlag entfällt für Agri-PV mit mindestens 75 % landwirtschaftlicher Nutzung und für vorbelastete Flächen wie Deponien.",
    },
    {
      q: "Wie lange dauert es bis zum genehmigten Solarpark?",
      a: "Meist ein bis drei Jahre, abhängig von Umwidmung, Gutachten und Netzanschluss. In Zonen und künftig in Beschleunigungsgebieten geht es schneller; ohne gesicherte Netzkapazität verzögern sich Projekte oft am stärksten.",
    },
  ],

  passend: [
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächenanlagen", text: "Solarparks von 500 kWp bis in den MW-Bereich." },
    { href: "/agri-pv", titel: "Agri-PV", text: "Doppelte Ernte auf derselben Fläche." },
    { href: "/ratgeber/agri-pv-oesterreich", titel: "Agri-PV in Österreich", text: "Konzepte, Kulturen, Förderzuschlag." },
    { href: "/freiflaechen-photovoltaik/widmung", titel: "Widmung je Bundesland", text: "Kriterien, Schwellen und Zonen der neun Länder." },
  ],

  quellen: [
    { titel: "RIS – NÖ Raumordnungsgesetz 2014, § 20 (Grünland-Photovoltaikanlagen)", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LNO40086867/LNO40086867.html", stand: "09/2026" },
    { titel: "RIS – Oö. Raumordnungsgesetz 1994, § 30a Sonderausweisung für Photovoltaik- und Windkraftanlagen", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LOO40027118/LOO40027118.html", stand: "09/2026" },
    { titel: "RIS – Steiermark: Entwicklungsprogramm für den Sachbereich Erneuerbare Energie – Solarenergie", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LST40035655/LST40035655.html", stand: "09/2026" },
    { titel: "RIS – Kärntner Photovoltaikanlagen-Verordnung 2024 (K-PhV 2024), § 5", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LKT40019770/LKT40019770.html", stand: "09/2026" },
    { titel: "RIS – Salzburger Photovoltaik-Kennzeichnungsverordnung, § 3", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LSB40027446/LSB40027446.html", stand: "09/2026" },
    { titel: "RIS – Burgenländisches Raumplanungsgesetz 2019, § 22d", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LBG40027528/LBG40027528.html", stand: "09/2026" },
    { titel: "RIS – Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG), BGBl. I Nr. 47/2026", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40278868/NOR40278868.html", stand: "09/2026" },
    { titel: "PV Austria – Schwerer Stand für große PV-Anlagen (NÖ-Zonen, 19.05.2026)", url: "https://pvbaustria.at/schwerer-stand-fuer-grosse-pv-anlagen/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Fläche für einen Solarpark?", text: "Wir prüfen Widmung, Netz und Wirtschaftlichkeit.", href: "/freiflaechen-photovoltaik", label: "Freifläche prüfen" },
  cta: {
    title: "Vom Grundstück zum Solarpark – mit klarer Genehmigungsstrategie.",
    text: "Wir prüfen Raumordnung, Netzanschluss und Förderung Ihrer Fläche und begleiten Widmung, Bewilligungen und Bau – gemeinsam mit unserer Beteiligung ÖkoInvest auch als Investor.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Freiflächenanlagen", href: "/freiflaechen-photovoltaik" },
  },
};

export default artikel;
