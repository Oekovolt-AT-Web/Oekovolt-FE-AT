// Ratgeber: Photovoltaik und Brandschutz in Österreich – OIB-RL 2/2.1, OVE R 11-1, TRVB, Feuerwehr, Versicherung
// Recherchestand 28.09.2026: OIB-Richtlinie 2 und 2.1, Ausgabe Mai 2023 (Pkt. 3.4.5, 3.5.14, 3.13 bzw. 3.9.7 ff., 3.11)
// samt Erläuterungen; OIB-Übersicht Inkrafttreten (Wien 23.02.2024, Kärnten 31.12.2024, NÖ 18.03.2025, OÖ 01.10.2025,
// Tirol 16.07.2026); Vbg. BTV verweist noch auf OIB-RL 2 Ausgabe 2019; ÖBFV-Info E-32 (03/2024) mit Auszügen aus
// OVE-Richtlinie R 11-1 und TRVB 121 O; ÖBFV: TRVB 162 N (04/2026); PV Austria: Brandschutztechnische Vorgaben.

const artikel = {
  slug: "photovoltaik-brandschutz",
  title: "Photovoltaik und Brandschutz: OIB-RL 2, OVE R 11-1 und Feuerwehr",
  seoTitle: "PV-Brandschutz: OIB-RL 2 & OVE R 11-1 | Ökovolt",
  kurzTitel: "Photovoltaik Brandschutz",
  description:
    "PV-Brandschutz in Österreich: Abstände nach OIB-Richtlinie 2 und 2.1, OVE R 11-1, Feuerwehrschalter, TRVB und was Betriebe und Versicherer verlangen.",
  excerpt:
    "PV-Anlagen brennen selten – aber auf Hallendächern und großen Gebäuden gelten klare Brandschutzregeln: 1 m zur Brandwand, 3 m zum Feuerwehr-Dachausstieg, Modulfelder höchstens 40 m. Was OIB, OVE und Feuerwehr verlangen.",
  hauptKeyword: "photovoltaik brandschutz",
  keywords: [
    "Photovoltaik Brandschutz",
    "OVE R 11-1",
    "OIB-Richtlinie 2 Photovoltaik",
    "PV Brandschutz Abstand Brandwand",
    "Feuerwehrschalter PV",
    "Photovoltaik Hallendach Brandschutz",
    "TRVB Photovoltaik",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/photovoltaik-brandschutz.jpg",
  bildAlt: "Schalttableau mit Schlüsselschaltern zur Feuerwehrabschaltung einer PV-Anlage an einer Schule in Vorarlberg",
  badge: { wert: "40 m", text: "maximale Ausdehnung eines Modulfelds auf Dächern nach OIB-RL 2" },

  kurzFazit: [
    "**Den baulichen Brandschutz von PV-Anlagen regeln in Österreich die OIB-Richtlinien 2 (allgemein) und 2.1 (Betriebsbauten) in der Ausgabe 2023, den Schutz der Einsatzkräfte die OVE-Richtlinie R 11-1.** Verbindlich wird die OIB-Richtlinie erst durch das jeweilige Landesrecht.",
    "Auf Dächern ab Gebäudeklasse 3 bzw. bei Betriebsbauten mit über **1.800 m²** Dachfläche gelten u. a.: **1 m** Abstand von der Mitte brandabschnittsbildender Wände, **3 m** zu Feuerwehr-Dachausstiegen, Modulfelder höchstens **40 m** lang mit **1 m** (A2-Dach) bzw. **2 m** Abstand.",
    "Die OVE R 11-1 verlangt u. a. eine **Kennzeichnung** am Hausanschluss bzw. Hauptverteiler und einen **Übersichtsplan** der PV-Anlage für die Feuerwehr; Schutzmaßnahmen gelten für DC-Leitungen ab Gebäudeeintritt bis zum Wechselrichter.",
    "Ein **Feuerwehrschalter** ist laut Österreichischem Bundesfeuerwehrverband **nicht verpflichtend**; die Module selbst lassen sich ohnehin nicht spannungsfrei schalten.",
  ],

  abschnitte: [
    {
      id: "grundlagen",
      titel: "Welche Brandschutzregeln gelten für PV-Anlagen in Österreich?",
      tocLabel: "Regelwerke",
      bloecke: [
        {
          typ: "p",
          text: "**Für PV-Anlagen gelten in Österreich drei Ebenen von Brandschutzregeln: die bautechnischen OIB-Richtlinien der Länder, die elektrotechnischen OVE-Richtlinien und die Technischen Richtlinien Vorbeugender Brandschutz (TRVB) der Feuerwehren.** Dazu kommen Auflagen aus Baubescheiden, Betriebsanlagengenehmigungen und Versicherungsverträgen.",
        },
        {
          typ: "tabelle",
          caption: "Brandschutz-Regelwerke für Photovoltaik in Österreich, Stand September 2026",
          kopf: ["Regelwerk", "Inhalt", "Verbindlichkeit"],
          zeilen: [
            ["OIB-Richtlinie 2 (Ausgabe 2023), Pkt. 3.5.14 und 3.13", "PV an Fassaden und auf Dächern der Gebäudeklassen 3 bis 5", "wenn im Landesrecht für verbindlich erklärt"],
            ["OIB-Richtlinie 2.1 (Ausgabe 2023), Pkt. 3.9 und 3.11", "PV an Fassaden und auf Dächern von Betriebsbauten", "wenn im Landesrecht für verbindlich erklärt"],
            ["OIB-Richtlinien 2.2 und 2.3", "Garagen und Parkdecks bzw. Gebäude mit Fluchtniveau über 22 m", "wie oben"],
            ["OVE-Richtlinie R 11-1", "PV-Anlagen – zusätzliche Sicherheitsanforderungen, Teil 1: Schutz von Einsatzkräften der Feuerwehr", "Stand der Technik; laut OIB-Erläuterungen heranziehbar"],
            ["TRVB 121 O (2024)", "Brandschutzpläne, einheitliche Symbole für PV-Übersichtspläne", "bei Brandschutzplänen"],
            ["TRVB 162 N (April 2026)", "Photovoltaik-Freiflächenanlagen mit mehr als 2 ha Modulfläche", "als Beurteilungsgrundlage"],
          ],
          minBreite: 720,
          fussnote: "Quellen: OIB, ÖBFV (Info E-32, TRVB 162 N), PV Austria. Die OVE-Richtlinie R 11-1 und die TRVB sind kostenpflichtig erhältlich; die Inhalte sind hier zusammengefasst, maßgeblich ist der Originaltext.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Welche OIB-Ausgabe gilt in Ihrem Bundesland?",
          text: "Die PV-Anforderungen stehen erst in der Ausgabe 2023 der OIB-Richtlinie 2. Laut OIB ist die Ausgabe 2023 in Wien seit 23. 2. 2024, in Kärnten seit 31. 12. 2024, in Niederösterreich seit 18. 3. 2025, in Oberösterreich seit 1. 10. 2025 und in Tirol seit 16. 7. 2026 verbindlich. Vorarlberg verweist (Stand September 2026) in der Bautechnikverordnung noch auf die Ausgabe 2019. In Ländern ohne Ausgabe 2023 gelten die Werte als Stand der Technik und werden von Sachverständigen und Versicherern häufig herangezogen.",
        },
      ],
    },
    {
      id: "dach",
      titel: "PV auf Dächern: Abstände, Modulfelder, Einbrand",
      tocLabel: "PV auf Dächern",
      bloecke: [
        {
          typ: "p",
          text: "**Auf Dächern von Gebäuden der Gebäudeklassen 3 bis 5 (OIB-RL 2, Pkt. 3.13) und auf Betriebsbauten mit mehr als 1.800 m² Dachfläche (OIB-RL 2.1, Pkt. 3.11) gelten konkrete Mindestabstände und Größenbegrenzungen.** Für Gebäudeklassen 1 und 2 stellt die OIB-Richtlinie wegen der kleinen Flächen keine PV-spezifischen Anforderungen.",
        },
        {
          typ: "tabelle",
          caption: "Anforderungen an Dach-PV nach OIB-Richtlinie 2 und 2.1, Ausgabe Mai 2023",
          kopf: ["Anforderung", "Wert"],
          zeilen: [
            ["Brandverhalten der Module", "BROOF(t1) – oder Moduloberseite aus Glas bzw. A2 mit A2-Rahmen"],
            ["Abstand zur Mitte brandabschnittsbildender Wände und zur Grundgrenze", "mindestens 1 m (sofern nicht gleichwertig begrenzt)"],
            ["Abstand zu Feuerwehr-Dachausstiegen (Standfläche)", "mindestens 3 m"],
            ["Ausdehnung eines Modulfelds", "höchstens 40 m"],
            ["Abstand zwischen Modulfeldern", "mindestens 1 m; 2 m, wenn die Dacheindeckung nicht A2 ist"],
            ["Abstand zu Lichtkuppeln und Rauch- und Wärmeabzug", "mindestens 1 m; 2 m bei nicht A2-Eindeckung; RWA-Wirkung darf nicht beeinträchtigt werden"],
            ["Generatoranschlusskasten, Wechselrichter", "nur auf mineralischen Unterkonstruktionen in A2"],
            ["Betriebsbauten zusätzlich", "Maßnahmen gegen Brandausbreitung über das Dach (z. B. nicht brennbare Dämmstreifen) nicht überbauen"],
          ],
          minBreite: 640,
          fussnote: "Quelle: OIB-Richtlinie 2, Pkt. 3.13.1, und OIB-Richtlinie 2.1, Pkt. 3.11.1, jeweils Ausgabe Mai 2023. Gebäudeklassen nach OIB-Richtlinie Begriffsbestimmungen.",
        },
        {
          typ: "h3",
          text: "Einbrand ins Gebäudeinnere verhindern",
        },
        {
          typ: "p",
          text: "Bei Gebäuden der Gebäudeklassen 3 und 4 mit jeweils mehr als 1.600 m² Dachfläche, bei Gebäudeklasse 5, bei Gebäuden, deren Nutzer sich nicht selbst retten können, und bei Gebäuden mit automatischer Löschanlage muss der Einbrand durch die PV-Anlage ins Gebäudeinnere wirksam eingeschränkt werden. Bei Betriebsbauten gilt das für Gebäude mit Löschanlage. Nachweisfrei erfüllt ist die Anforderung, wenn die Decke bzw. Tragkonstruktion samt Dämmung in A2 ausgeführt ist, die Decke die Leistungseigenschaften E und I erfüllt oder die Dacheindeckung mit 5 cm Kies (oder gleichwertig) ausgeführt ist. Hintergrund laut OIB: Mehrere gleichzeitige Brandherde durch eine brennende PV-Anlage könnten die Wirkfläche einer Sprinkleranlage überfordern.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Beispiel: Hallendach 100 × 60 m",
          text: "Auf einer 6.000 m² großen Halle mit einer Brandwand in der Mitte und einem Feuerwehr-Dachausstieg müssen die Module auf jeder Dachhälfte in mindestens zwei Felder geteilt werden (höchstens 40 m je Feld), 1 m von der Brandwandmitte und 3 m vom Dachausstieg entfernt bleiben und 1–2 m Abstand zu Lichtbändern halten. Die belegbare Fläche sinkt dadurch typischerweise um einige Prozent – ein Punkt, der bei der Ertragsplanung und im Angebot berücksichtigt werden muss.",
        },
      ],
    },
    {
      id: "fassade",
      titel: "PV an Fassaden und in Treppenhäusern",
      tocLabel: "Fassade & Innenräume",
      bloecke: [
        {
          typ: "p",
          text: "**PV-Module an Fassaden gelten brandschutztechnisch als Fassadenbekleidung und müssen die Anforderungen an deren Brandverhalten erfüllen.** Bei Gebäuden der Gebäudeklassen 4 und 5 ist zusätzlich die Brandweiterleitung über die Fassade und das Herabfallen großer Modulteile wirksam einzuschränken; entsteht ein Hinterlüftungsspalt, ist er geschoßweise abzuschotten. Rettungswege mit Geräten der Feuerwehr dürfen nicht eingeschränkt werden. Bei Betriebsbauten dürfen Fassaden-Modulfelder höchstens 40 m lang sein und müssen mindestens 2 m Abstand zueinander haben. Mehr zu Fassadenanlagen im Ratgeber [Photovoltaik an der Fassade (BIPV)](/ratgeber/photovoltaik-fassade-bipv).",
        },
        {
          typ: "p",
          text: "Wechselrichter in Treppenhäusern sind laut OIB-Richtlinie 2 (Pkt. 3.4.5) von Trennbauteilen zu begrenzen; Zugangsöffnungen brauchen Abschlüsse in EI2 30-S200 oder EI 30. Der Bundesfeuerwehrverband fasst das als Verbot der freien Aufstellung von Wechselrichtern in Treppenhäusern zusammen. Für stationäre Batteriespeicher enthält die OIB-Richtlinie 2 eigene Vorgaben zu Batterieräumen und Ausnahmen – siehe [Stromspeicher](/produkte/stromspeicher).",
        },
      ],
    },
    {
      id: "ove",
      titel: "OVE R 11-1: Schutz der Einsatzkräfte",
      tocLabel: "OVE R 11-1",
      bloecke: [
        {
          typ: "p",
          text: "**Die OVE-Richtlinie R 11-1 „PV-Anlagen – Zusätzliche Sicherheitsanforderungen – Teil 1: Anforderungen zum Schutz von Einsatzkräften der Feuerwehr“ regelt, wie PV-Anlagen an oder auf Gebäuden geplant und errichtet werden, damit die Feuerwehr gefahrlos löschen kann.** Sie enthält technische, bauliche und organisatorische Anforderungen und Hinweise zu wiederkehrenden Prüfungen. Im Lexikon: [OVE R 11-1](/wissen/lexikon#ove-r-11-1).",
        },
        {
          typ: "liste",
          punkte: [
            "**DC-Leitungen im Gebäude:** Schutzmaßnahmen ab der Eintrittsstelle der DC-Leitungen ins Gebäude bis zum Wechselrichter, damit auch bei Versagen der doppelten oder verstärkten Isolierung das Risiko für Einsatzkräfte möglichst gering bleibt.",
            "**Abstände und Zugänge:** Vorgaben zu Abständen gegenüber Rauch- und Wärmeabzugsanlagen, Dachrändern und brandabschnittsbildenden Bauteilen sowie zu Zugängen für Löschmaßnahmen.",
            "**Kennzeichnung:** Hinweisschild auf das Vorhandensein einer PV-Anlage (bzw. PV-Anlage mit Speicher) am Übergabepunkt der elektrischen Anlage, z. B. Hausanschlusskasten oder Gebäudehauptverteiler, auch an Verteilern verwendbar.",
            "**Übersichtsplan:** Am Übergabepunkt muss ein Übersichtsplan Auskunft über Art und Lage der PV-Komponenten geben; die TRVB 121 O (2024) regelt einheitliche Symbole dafür.",
          ],
        },
        {
          typ: "p",
          text: "Die Richtlinie ergänzt die Errichtungsbestimmungen für Niederspannungsanlagen (ÖVE/ÖNORM E 8101) und die Dokumentation nach ÖVE/ÖNORM EN 62446-1. Welche Normen bei der Planung zusammenspielen, zeigt unsere Seite [Normen und Richtlinien](/forderungen/richtlinien).",
        },
      ],
    },
    {
      id: "feuerwehr",
      titel: "Feuerwehrschalter und Abschaltung: Was ist Pflicht?",
      tocLabel: "Feuerwehrschalter",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Feuerwehrschalter (DC-Trennschalter nahe den Modulen) ist in Österreich laut Bundesfeuerwehrverband nicht verpflichtend – und er macht die Module selbst nicht spannungsfrei.** PV-Module erzeugen bei jedem Lichteinfall Spannung; mit Gleichspannungen bis 1.500 V ist die zulässige Berührungsspannung von 120 V DC in der Regel weit überschritten. Feuerwehren betrachten PV-Anlagen deshalb grundsätzlich als ständig unter Spannung.",
        },
        {
          typ: "tabelle",
          caption: "Möglichkeiten zur Reduktion der Gefährdung im Einsatzfall",
          kopf: ["Maßnahme", "Wirkung", "Grenzen"],
          zeilen: [
            ["AC-Freischaltung", "trennt Wechselrichter vom Netz; bei PV-Anlagen über 30 kWp ist eine frei zugängliche manuelle Freischaltstelle üblich", "DC-Seite bleibt unter Spannung"],
            ["Feuerwehr- bzw. DC-Trennschalter", "unterbricht die DC-Leitungen am Gebäudeeintritt oder nach den Modulen; Bedienstelle beim Feuerwehrzugang", "Leitungen bis zur Trennstelle und Module bleiben unter Spannung"],
            ["Abschaltung auf Modulebene", "Leistungsoptimierer bzw. Modul-Abschaltung senken die Spannung auf etwa 1 V je Modul, sobald das Wechselrichtersignal fehlt", "Mehrkosten, zusätzliche Elektronik am Dach"],
            ["Leitungsführung außen oder geschützt", "DC-Leitungen außerhalb des Gebäudes oder in geschützten Bereichen bis zum Wechselrichter", "abhängig von Gebäude und Wechselrichterstandort"],
          ],
          minBreite: 720,
          fussnote: "Quelle: ÖBFV-Info E-32 „Photovoltaikanlagen und deren Speicheranlagen“ (03/2024), abgestimmt mit AUVA und TÜV Austria.",
        },
        {
          typ: "p",
          text: "Der Bundesfeuerwehrverband empfiehlt eine Einschulung bzw. Begehung der Anlage mit der örtlichen Feuerwehr und eine entsprechende Dokumentation. Im Einsatz gelten u. a. mindestens 1 m Abstand zu potenziell spannungsführenden Teilen und die Sicherheitsabstände beim Einsatz von Strahlrohren; Schalthandlungen an beschädigten Anlagen soll nur Elektrofachpersonal vornehmen.",
        },
      ],
    },
    {
      id: "praevention",
      titel: "Brände vermeiden: Montage, Prüfung, Wartung",
      tocLabel: "Prävention",
      bloecke: [
        {
          typ: "p",
          text: "**PV-Anlagen brennen selten; wenn, dann meist wegen fehlerhafter Montage – etwa unsachgemäß verpresster oder nicht zueinander passender Steckverbinder, beschädigter Leitungen oder mangelhafter Leitungsführung.** Laut PV Austria sind fachgerechte Errichtung, hochwertige Komponenten und regelmäßige Wartung die wirksamsten Maßnahmen.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Steckverbinder desselben Herstellers und Typs verwenden, mit Herstellerwerkzeug verpressen",
            "Leitungen UV-beständig, scheuerfrei und ohne Zug verlegen; keine Leitungen in Wasserführungen",
            "Erstprüfung nach ÖVE/ÖNORM E 8101 und Dokumentation nach ÖVE/ÖNORM EN 62446-1",
            "wiederkehrende elektrische Prüfung (E-Check) und Sichtkontrolle nach Plan, z. B. nach Unwettern",
            "Thermografie per Drohne zur Erkennung von Hotspots und Steckerfehlern",
            "Monitoring mit Isolationsüberwachung und Alarmierung",
            "Übersichtsplan und Kennzeichnung aktuell halten, Feuerwehr einweisen",
          ],
        },
        {
          typ: "p",
          text: "Mehr dazu in den Ratgebern [E-Check für Photovoltaik](/ratgeber/e-check-photovoltaik) und [PV-Thermografie per Drohne](/ratgeber/pv-thermografie-drohne) sowie auf unseren Seiten [E-Check](/service/e-check) und [Drohneninspektion](/service/drohneninspektion).",
        },
      ],
    },
    {
      id: "versicherung",
      titel: "Was Versicherer und Behörden typischerweise verlangen",
      tocLabel: "Versicherung & Auflagen",
      bloecke: [
        {
          typ: "p",
          text: "**Versicherer und Behörden verlangen bei Gewerbeanlagen meist Nachweise, die über die Errichtungsnormen hinausgehen: Brandschutzkonzept, aktuelle Prüfbefunde, Übersichtspläne und eine Abstimmung mit der Feuerwehr.** Welche Auflagen konkret gelten, hängt von Polizze, Betriebsanlagengenehmigung und Baubescheid ab – klären Sie sie vor der Planung, nicht nach der Montage.",
        },
        {
          typ: "liste",
          punkte: [
            "**Vor Baubeginn:** Meldung der geplanten Anlage an den Gebäude- bzw. Betriebsversicherer, Abstimmung von Brandschutzkonzept und Leitungsführung, bei Sprinkleranlagen Klärung der Einbrandanforderung.",
            "**Bei Inbetriebnahme:** Prüfbefund, Anlagendokumentation, Übersichtsplan am Übergabepunkt, Kennzeichnung, Einweisung der Feuerwehr bzw. Betriebsfeuerwehr.",
            "**Im Betrieb:** wiederkehrende Prüfungen, Wartungsnachweise, Thermografie in vereinbarten Intervallen.",
            "**Freiflächen über 2 ha:** Brandschutz nach TRVB 162 N – Zufahrten, Löschwasser, Vegetationspflege, Kennzeichnung.",
          ],
        },
        {
          typ: "p",
          text: "Zur Absicherung der Anlage selbst siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung) und unsere [Versicherungsberatung](/service/versicherung). Genehmigungsfragen je Bundesland behandelt [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Welchen Abstand muss eine PV-Anlage zur Brandwand haben?",
      a: "Nach OIB-Richtlinie 2 und 2.1 (Ausgabe 2023) mindestens 1 m von der Mitte der brandabschnittsbildenden Wand, sofern die horizontale Brandübertragung nicht durch gleichwertige Maßnahmen begrenzt wird. Dieselbe Regel gilt zur Nachbargrundstücks- bzw. Bauplatzgrenze.",
    },
    {
      q: "Ist ein Feuerwehrschalter für PV-Anlagen in Österreich Pflicht?",
      a: "Nein. Laut Österreichischem Bundesfeuerwehrverband ist ein Feuerwehr- bzw. Not-Aus-Schalter nicht verpflichtend. Er trennt nur die Leitungen ab der Trennstelle; die Module selbst bleiben unter Spannung. Für größere Anlagen ist eine frei zugängliche AC-Freischaltstelle üblich.",
    },
    {
      q: "Was regelt die OVE-Richtlinie R 11-1?",
      a: "Sie legt zusätzliche Sicherheitsanforderungen für PV-Anlagen an und auf Gebäuden zum Schutz der Feuerwehr fest: Schutzmaßnahmen für DC-Leitungen ab Gebäudeeintritt bis zum Wechselrichter, Abstände und Zugänge, Kennzeichnung am Übergabepunkt und einen Übersichtsplan der Anlage.",
    },
    {
      q: "Wie groß darf ein Modulfeld auf dem Dach sein?",
      a: "Nach OIB-Richtlinie 2 und 2.1 höchstens 40 m in der Ausdehnung. Zwischen Modulfeldern sind mindestens 1 m Abstand einzuhalten, bei einer Dacheindeckung, die nicht A2 entspricht, 2 m.",
    },
    {
      q: "Gelten die OIB-Brandschutzregeln für PV in ganz Österreich?",
      a: "Nur dort, wo die Ausgabe 2023 der OIB-Richtlinie 2 im Landesrecht verbindlich ist – laut OIB in Wien, Kärnten, Niederösterreich, Oberösterreich und Tirol. In den anderen Ländern dienen die Werte als Stand der Technik und werden von Sachverständigen und Versicherern häufig herangezogen.",
    },
    {
      q: "Löscht die Feuerwehr brennende PV-Anlagen?",
      a: "Ja. Die Feuerwehr betrachtet PV-Anlagen als ständig unter Spannung und hält Sicherheitsabstände ein, etwa mindestens 1 m zu spannungsführenden Teilen und die Abstände für Strahlrohre. Übersichtsplan, Kennzeichnung und eine vorherige Begehung erleichtern den Einsatz erheblich.",
    },
  ],

  passend: [
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "Photovoltaik-Genehmigung", text: "Bau- und Elektrizitätsrecht je Land." },
    { href: "/service/e-check", titel: "E-Check", text: "Wiederkehrende Prüfung für PV-Anlagen." },
    { href: "/service/drohneninspektion", titel: "Drohneninspektion", text: "Thermografie gegen Hotspots und Steckerfehler." },
    { href: "/ratgeber/photovoltaik-versicherung", titel: "Photovoltaik-Versicherung", text: "Absicherung für Betriebe." },
  ],

  quellen: [
    { titel: "OIB – OIB-Richtlinie 2 Brandschutz, Ausgabe Mai 2023", url: "https://www.oib.or.at/wp-content/uploads/richtlinien/richtlinie_2023/oib-rl_2_ausgabe_mai_2023.pdf", stand: "05/2023" },
    { titel: "OIB – Erläuternde Bemerkungen zur OIB-Richtlinie 2, Ausgabe Mai 2023", url: "https://www.oib.or.at/wp-content/uploads/richtlinien/richtlinie_2023/erlaeuterungen_oib-rl_2_ausgabe_mai_2023.pdf", stand: "05/2023" },
    { titel: "OIB – OIB-Richtlinie 2.1 Brandschutz bei Betriebsbauten, Ausgabe Mai 2023", url: "https://www.oib.or.at/wp-content/uploads/richtlinien/richtlinie_2023/oib-rl_2.1_ausgabe_mai_2023.pdf", stand: "05/2023" },
    { titel: "OIB – OIB-Richtlinien: Inkrafttreten in den Bundesländern", url: "https://www.oib.or.at/kernaufgaben/oib-richtlinien/", stand: "09/2026" },
    { titel: "ÖBFV – Info E-32 Photovoltaikanlagen und deren Speicheranlagen", url: "https://www.bundesfeuerwehrverband.at/wp-content/uploads/2024/07/E-32-Info_2024.pdf", stand: "03/2024" },
    { titel: "ÖBFV – TRVB 162 N Photovoltaik-Freiflächenanlagen veröffentlicht", url: "https://www.bundesfeuerwehrverband.at/2026/04/17/trvb-162-n-photovoltaik-freiflaechenanlagen-pv-ffa-veroeffentlicht/", stand: "04/2026" },
    { titel: "PV Austria – Brandschutztechnische Vorgaben", url: "https://pvbaustria.at/brandschutztechnische-vorgaben/", stand: "09/2026" },
    { titel: "Bautechnikverordnung Vorarlberg (BTV), Verweis auf OIB-Richtlinien (jusline.at)", url: "https://www.jusline.at/gesetz/btv/gesamt", stand: "09/2026" },
  ],

  seitenCta: { titel: "Brandschutz früh planen?", text: "Wir planen Belegung, Leitungsführung und Übersichtsplan normgerecht.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Sichere PV-Anlagen – geplant mit Feuerwehr und Versicherer im Blick.",
    text: "Ökovolt Solartechnik plant Gewerbe- und Gemeindeanlagen nach OIB-Richtlinien und OVE R 11-1 und bietet E-Check, Thermografie und Wartung für den laufenden Betrieb.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "E-Check", href: "/service/e-check" },
  },
};

export default artikel;
