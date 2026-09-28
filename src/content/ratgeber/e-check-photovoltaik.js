// Ratgeber: „E-Check“ für PV-Anlagen in Österreich – Erstprüfung, wiederkehrende Prüfung, Prüfbefund
// Quellen: ESV 2012 §§ 7–11 (Gesetzestext via RIS/JUSLINE), OVE E 8101:2025 (Teil 6 Prüfung, Teil 7 PV),
// ÖVE/ÖNORM EN 62446-1 (Dokumentation, Inbetriebnahmeprüfung PV), IEC TS 62446-3 (Thermografie),
// OVE-Richtlinien R 11-1:2022 (Feuerwehr) und R 30:2025 (Ladeeinrichtungen). Keine Preisangaben.

const artikel = {
  slug: "e-check-photovoltaik",
  title: "E-Check für PV-Anlagen: Prüfpflicht, Ablauf und Prüfbefund",
  seoTitle: "E-Check Photovoltaik Österreich: Prüfpflicht | Ökovolt",
  kurzTitel: "E-Check Photovoltaik",
  description:
    "E-Check für PV-Anlagen in Österreich: Erstprüfung und wiederkehrende Prüfung nach ESV 2012, Messungen nach OVE E 8101 und EN 62446, Prüfbefund und Fristen.",
  excerpt:
    "„E-Check“ ist in Österreich kein Rechtsbegriff – gemeint ist die Prüfung elektrischer Anlagen mit Prüfbefund. Wann sie Pflicht ist, was bei PV-Anlagen gemessen wird und welche Unterlagen Sie brauchen.",
  hauptKeyword: "e-check photovoltaik",
  keywords: [
    "E-Check Photovoltaik",
    "PV-Anlage Prüfung Österreich",
    "Prüfbefund elektrische Anlage",
    "ESV 2012 Prüffrist",
    "wiederkehrende Prüfung PV-Anlage",
    "EN 62446 Prüfung",
    "Anlagenbuch Elektro",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Smartphone/smart-guard-scaled.jpg",
  bildAlt: "Geöffneter Elektroverteiler mit Schutzschaltern an einer Gebäudewand",
  badge: { wert: "§ 9 ESV", text: "wiederkehrende Prüfung in Arbeitsstätten: längstens alle 5 Jahre" },

  kurzFazit: [
    "**„E-Check“ ist in Österreich kein gesetzlicher Begriff – gemeint ist die Erstprüfung und die wiederkehrende Überprüfung einer elektrischen Anlage durch eine Elektrofachkraft, dokumentiert in einem Prüfbefund.**",
    "**Für Arbeitgeber ist die Prüfung Pflicht:** Nach § 8 ESV 2012 vor Inbetriebnahme und nach wesentlichen Änderungen, nach § 9 wiederkehrend in Abständen von längstens fünf Jahren – bei geringer Belastung (Büro, Handel) bis zehn Jahre, in Ex-Bereichen drei Jahre, auf Baustellen ein Jahr.",
    "**Bei PV-Anlagen kommen DC-spezifische Messungen hinzu:** Isolationswiderstand, Leerlaufspannung und Kurzschlussstrom je String nach ÖVE/ÖNORM EN 62446-1, bei Bedarf I-U-Kennlinie und Thermografie nach IEC TS 62446-3.",
    "**Der Prüfbefund muss Datum, Prüfer, Umfang, Ergebnis und Schutzmaßnahmen enthalten** und aufbewahrt werden – bei Intervallen über drei Jahre zumindest der letzte, sonst die letzten beiden (§ 11 ESV 2012).",
  ],

  abschnitte: [
    {
      id: "begriff",
      titel: "Was bedeutet „E-Check“ in Österreich?",
      tocLabel: "Begriff E-Check",
      bloecke: [
        {
          typ: "p",
          text: "**„E-Check“ ist ein Marketingbegriff aus Deutschland; in Österreich spricht das Recht von der Prüfung elektrischer Anlagen – vor Inbetriebnahme (Erstprüfung) und wiederkehrend – mit einem schriftlichen Prüfbefund.** Die Pflicht ergibt sich für Arbeitgeber aus der Elektroschutzverordnung 2012 (ESV 2012), einer Verordnung zum ArbeitnehmerInnenschutzgesetz. Wie geprüft wird, beschreiben die elektrotechnischen Normen, allen voran die OVE E 8101 (Errichtungsbestimmungen für Niederspannungsanlagen, Teil 6: Prüfung) und für PV-Anlagen die ÖVE/ÖNORM EN 62446-1.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Erstprüfung", text: "Vor Inbetriebnahme, nach Errichtung, wesentlicher Änderung, Erweiterung oder Instandsetzung (§ 8 ESV 2012)." },
            { titel: "Wiederkehrende Prüfung", text: "In festen Höchstabständen während des Betriebs (§ 9 ESV 2012) – die eigentliche „E-Check“-Pflicht." },
            { titel: "Kontrollen", text: "Laufende Kontrollen durch unterwiesene Personen, etwa die Prüftaste des Fehlerstromschutzschalters (§ 7 ESV 2012)." },
          ],
        },
        {
          typ: "p",
          text: "Die Prüfung ist nicht mit der Wartung zu verwechseln: Die Prüfung stellt fest, ob die Anlage sicher ist; die Wartung erhält die Funktion und den Ertrag. Beides lässt sich kombinieren – wie, beschreibt der Ratgeber [Reinigung und Wartung](/ratgeber/photovoltaik-reinigung-wartung). Der Begriff [Prüfbefund](/wissen/lexikon#pruefbefund) ist im Lexikon erklärt.",
        },
      ],
    },
    {
      id: "pflicht",
      titel: "Wer muss seine PV-Anlage prüfen lassen?",
      tocLabel: "Wer ist verpflichtet?",
      bloecke: [
        {
          typ: "p",
          text: "**Prüfpflichtig nach ESV 2012 sind alle Arbeitgeber für die elektrischen Anlagen in ihren Arbeitsstätten – dazu zählt die PV-Anlage auf dem Betriebsgebäude samt Wechselrichtern, Verteilern und Speicher.** Das betrifft Gewerbe- und Industriebetriebe ebenso wie landwirtschaftliche Betriebe mit Beschäftigten, Hotels und Gemeinden als Dienstgeber.",
        },
        {
          typ: "tabelle",
          caption: "Prüfpflichten nach Betreibergruppe (Übersicht, Stand September 2026)",
          kopf: ["Betreiber", "Rechtsgrundlage", "Praxis"],
          zeilen: [
            ["Unternehmen mit Arbeitnehmern", "ESV 2012 (§§ 7–11), ArbeitnehmerInnenschutzgesetz", "Erstprüfung + wiederkehrend ≤ 5 Jahre (Regelfall), Prüfbefund aufbewahren"],
            ["Gemeinden, öffentliche Gebäude", "ESV 2012 bzw. Bedienstetenschutzrecht der Länder; Vorgaben des Gebäudebetriebs", "wie Unternehmen; zusätzlich Auflagen aus Bau- und Veranstaltungsrecht möglich"],
            ["Landwirtschaft mit Beschäftigten", "ESV 2012 bzw. Land- und forstwirtschaftliches Arbeitnehmerschutzrecht", "Stall- und Feuchträume: kürzere Fristen können vorgeschrieben werden"],
            ["Privat ohne Arbeitnehmer", "keine ESV-Pflicht", "Erstprüfung durch Errichter; wiederkehrende Prüfung empfehlenswert und oft Versicherungsauflage"],
          ],
          minBreite: 700,
          fussnote: "Vereinfachte Übersicht; für Gemeinden und land- und forstwirtschaftliche Betriebe gelten teils Landesregelungen. Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Prüffristen nach § 9 Abs. 2 ESV 2012",
          text: "Wiederkehrende Prüfungen: längstens **5 Jahre**. Abweichend: längstens **10 Jahre** bei geringer Belastung (insbesondere Büros, Handels- und Dienstleistungsbetriebe ohne besondere Einflüsse), längstens **3 Jahre** in explosionsgefährdeten Bereichen, längstens **1 Jahr** in Ex-Bereichen mit außergewöhnlicher Beanspruchung, auf Baustellen und in obertägigen Gewinnungsbetrieben, **6 Monate** im Untertagebau. Die Behörde kann bei Feuchtigkeit, extremen Temperaturen, korrosiven Stoffen oder Staub kürzere Fristen vorschreiben.",
        },
        {
          typ: "p",
          text: "Für die Einstufung einer PV-Anlage zählt der Bereich, in dem ihre Komponenten installiert sind: Ein Wechselrichter im Heizraum eines Bürogebäudes ist anders zu bewerten als eine Anlage über einem Schweinestall mit Ammoniakbelastung. Im Zweifel ist die kürzere Frist die sichere Wahl – Versicherer und Brandschutzbehörden verlangen häufig ohnehin engere Intervalle.",
        },
      ],
    },
    {
      id: "wer-prueft",
      titel: "Wer darf die Prüfung durchführen?",
      tocLabel: "Wer darf prüfen?",
      bloecke: [
        {
          typ: "p",
          text: "**Prüfungen nach §§ 8 und 9 ESV 2012 dürfen nur Elektrofachkräfte durchführen, die Kenntnisse durch die Prüfung vergleichbarer Anlagen haben.** Für PV-Anlagen heißt das: Der Prüfer muss die Besonderheiten von Gleichstromkreisen, Wechselrichtern, Speichern und Netzkupplung kennen und über geeignete Messgeräte verfügen – ein gewöhnliches Installationsmessgerät für Wechselstromkreise reicht für die DC-Seite nicht.",
        },
        {
          typ: "liste",
          punkte: [
            "**Gewerbeberechtigung:** Elektrotechnik-Unternehmen mit Gewerbeberechtigung; bei größeren Anlagen oft Zusatzqualifikation im Bereich Photovoltaik.",
            "**Messtechnik:** PV-Prüfgerät für Isolationsmessung bis zur maximalen Systemspannung, Leerlaufspannung, Kurzschlussstrom, idealerweise I-U-Kennlinienmessung mit Einstrahlungssensor.",
            "**Unabhängigkeit:** Die Erstprüfung macht in der Regel der Errichter. Für wiederkehrende Prüfungen kann ein zweiter Betrieb sinnvoll sein – ein unabhängiger Blick findet mehr.",
            "**Kontrollen im Alltag:** Das Betätigen der Prüftaste von Fehlerstromschutzschaltern darf eine elektrotechnisch unterwiesene Person übernehmen – laut § 7 ESV 2012 nach Herstellerangabe, ohne Angabe mindestens halbjährlich.",
          ],
        },
      ],
    },
    {
      id: "messungen",
      titel: "Was wird bei einer PV-Anlage geprüft und gemessen?",
      tocLabel: "Prüfumfang & Messungen",
      bloecke: [
        {
          typ: "p",
          text: "**Der Mindestinhalt jeder Prüfung ist in § 10 ESV 2012 festgelegt: Sichtprüfung, Basisschutz, Fehlerschutz, gegebenenfalls Zusatzschutz und die Erfassung des thermischen Zustands.** Für PV-Anlagen konkretisiert die ÖVE/ÖNORM EN 62446-1 die DC-seitigen Prüfungen und die Dokumentation. Die folgende Tabelle zeigt den typischen Umfang.",
        },
        {
          typ: "tabelle",
          caption: "Prüfumfang einer PV-Anlage (AC- und DC-Seite)",
          kopf: ["Prüfschritt", "Inhalt", "Grundlage"],
          zeilen: [
            ["Sichtprüfung", "Module, Stecker, Leitungsführung, Kennzeichnung, Zugänglichkeit, Brandabschnitte, Schutzarten", "§ 10 ESV 2012, OVE E 8101"],
            ["Schutzleiter & Potentialausgleich", "Durchgängigkeit, Anschluss von Gestell und Rahmen, Erdung", "OVE E 8101 Teil 6"],
            ["Isolationswiderstand DC", "Messung je String bzw. Teilgenerator gegen Erde", "ÖVE/ÖNORM EN 62446-1"],
            ["Leerlaufspannung & Kurzschlussstrom", "je String, Vergleich mit Erwartungswert und Nachbarsträngen", "ÖVE/ÖNORM EN 62446-1"],
            ["AC-Seite", "Schleifenimpedanz, Abschaltbedingungen, Fehlerstromschutzschalter (Auslösezeit/-strom)", "OVE E 8101 Teil 6"],
            ["Funktion", "Wechselrichter, Netz- und Anlagenschutz, Freischaltstelle, Not-Aus/Feuerwehrschalter", "OVE E 8101, TOR, OVE R 11-1"],
            ["Thermischer Zustand", "Thermografie von Verteilern, Anschlüssen und Modulfeld", "§ 10 ESV 2012, IEC TS 62446-3"],
            ["Optional: I-U-Kennlinie", "Leistungsbestimmung je String bei Einstrahlung, erkennt Degradation und Zellschäden", "ÖVE/ÖNORM EN 62446-1 (Kategorie 2)"],
          ],
          minBreite: 720,
        },
        {
          typ: "p",
          text: "Die Thermografie ist bei PV-Anlagen besonders aussagekräftig, weil sie Fehler findet, die elektrisch noch unauffällig sind – etwa überhitzte Steckverbinder oder Zellen mit beginnender [potentialinduzierter Degradation](/wissen/lexikon#pid). Aus der Luft geht das bei großen Dachflächen schnell und ohne Dachbegehung, wie der Ratgeber [PV-Thermografie mit Drohne](/ratgeber/pv-thermografie-drohne) zeigt. Ergänzend kann eine [Elektrolumineszenz-Prüfung](/wissen/lexikon#el-pruefung) Mikrorisse sichtbar machen.",
        },
      ],
    },
    {
      id: "pruefbefund",
      titel: "Was muss im Prüfbefund stehen – und wie lange aufbewahren?",
      tocLabel: "Prüfbefund & Aufbewahrung",
      bloecke: [
        {
          typ: "p",
          text: "**Nach § 11 ESV 2012 enthält der Prüfbefund mindestens Datum der Prüfung, Name und Anschrift des Prüfers, Unterschrift, Umfang und Ergebnis der Prüfung sowie die festgelegten Schutzmaßnahmen.** Schaltpläne und Unterlagen der elektrischen Anlage sind bis zur Außerbetriebnahme aufzubewahren, von den wiederkehrenden Prüfungen zumindest die letzten beiden Prüfbefunde – bei Prüfintervallen über drei Jahren genügt der letzte. Die Befunde müssen in der Arbeitsstätte bzw. auf der Baustelle zugänglich sein.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Anlagendokumentation: Übersichtsschaltplan, Stringplan, Modul- und Wechselrichter-Datenblätter, Leitungsquerschnitte, Schutzorgane.",
            "Erstprüfungsprotokoll mit Messwerten je String (Isolationswiderstand, Leerlaufspannung, Kurzschlussstrom).",
            "Letzte(r) wiederkehrende(r) Prüfbefund(e) mit Mängelliste und Nachweis der Behebung.",
            "Feuerwehrplan und Kennzeichnung nach OVE-Richtlinie R 11-1, Lage von Freischaltstelle und DC-Leitungen.",
            "Netzbetreiber-Unterlagen: Fertigstellungsmeldung, Einstellwerte des Netz- und Anlagenschutzes, ggf. Parkregler-Parameter.",
            "Thermografie- und Monitoringberichte als Nachweis des Zustands (für Versicherung und Garantie).",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Anlagenbuch digital und am Verteiler",
          text: "Bewährt hat sich ein Anlagenbuch in zwei Formen: digital beim Betreiber und Wartungspartner, und als Papierordner beim Hauptverteiler bzw. im Wechselrichterraum. So findet die Feuerwehr im Einsatz den Plan, und der Prüfer hat beim nächsten Termin alle Vorwerte. Die OVE E 8101:2025 hat die Anforderungen an die Dokumentation elektrischer Anlagen überarbeitet – lassen Sie Altunterlagen bei der nächsten Prüfung ergänzen.",
        },
      ],
    },
    {
      id: "maengel",
      titel: "Typische Mängel bei der Prüfung von PV-Anlagen",
      tocLabel: "Typische Mängel",
      bloecke: [
        {
          typ: "p",
          text: "**Die häufigsten Befunde betreffen Steckverbinder, Leitungsführung und Dokumentation – nicht die Module selbst.** Viele Mängel sind einfach zu beheben, können aber unentdeckt zu Lichtbögen und Bränden führen.",
        },
        {
          typ: "tabelle",
          caption: "Häufige Mängel und ihre Folgen",
          kopf: ["Mangel", "Risiko", "Behebung"],
          zeilen: [
            ["Mischverbindung von Steckern verschiedener Hersteller", "erhöhter Übergangswiderstand, Erwärmung, Lichtbogen", "Tausch gegen kompatible Stecker, Crimpen mit Originalwerkzeug"],
            ["Leitungen auf dem Dach scheuernd oder hängend", "Isolationsschäden, Erdschluss", "Neuverlegung in Kabelkanälen, UV-beständige Befestigung"],
            ["Niedriger Isolationswiderstand eines Strings", "Wechselrichter schaltet ab, Personengefährdung", "Fehlerortung, Tausch von Modul/Leitung"],
            ["Fehlende oder unleserliche Kennzeichnung", "Gefährdung der Feuerwehr, Mangel nach OVE R 11-1", "Kennzeichnung und Feuerwehrplan erneuern"],
            ["Überspannungsschutz ausgelöst/defekt", "kein Schutz bei nächstem Gewitter", "Ableiter tauschen, Blitzschutzkonzept prüfen"],
            ["Unvollständige Dokumentation", "Prüfung nicht nachvollziehbar, Probleme im Schadensfall", "Bestandsaufnahme und Nachdokumentation"],
          ],
          minBreite: 680,
        },
        {
          typ: "p",
          text: "Wie Brandschutz, Feuerwehrschalter und Kennzeichnung zusammenspielen, erklärt der Ratgeber [Brandschutz bei Photovoltaik](/ratgeber/photovoltaik-brandschutz). Mängel aus dem Prüfbefund sind oft auch für den Versicherungsschutz relevant – siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Ablauf: So läuft die Prüfung einer Gewerbe-PV-Anlage",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Unterlagen bereitstellen", "Anlagendokumentation, letzter Prüfbefund, Monitoring-Zugang und Zutrittsregelung an den Prüfer übermitteln."],
            ["Termin mit Einstrahlung planen", "DC-Messungen und Thermografie brauchen ausreichend Sonne; Kennlinienmessungen idealerweise bei hoher, stabiler Einstrahlung."],
            ["Sichtprüfung und Messungen", "Dach, Leitungswege, Verteiler, Wechselrichter; Messungen DC je String, AC-Schutzmaßnahmen, Funktion der Schutzorgane."],
            ["Thermografie", "Verteiler und Anschlüsse, bei Bedarf Modulfeld per Drohne oder Handkamera."],
            ["Prüfbefund und Mängelliste", "Schriftlicher Befund mit Ergebnis, Messwerten, Mängeln nach Dringlichkeit und Empfehlung für die nächste Prüfung."],
            ["Mängel beheben und nachweisen", "Behebung beauftragen, dokumentieren und bei sicherheitsrelevanten Mängeln nachprüfen lassen."],
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Ladeinfrastruktur gleich mitprüfen",
          text: "Wallboxen und Ladestationen im Betrieb sind Teil der elektrischen Anlage. Für den sicheren Betrieb und die wiederkehrende Prüfung von Ladeeinrichtungen gibt es die OVE-Richtlinie R 30 (Ausgabe 2025-03-01). Wer PV und Ladepunkte gemeinsam prüfen lässt, spart Anfahrt und Abschaltzeiten – mehr unter [Ladeinfrastruktur](/ladeinfrastruktur).",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was beeinflusst die Kosten der Prüfung?",
      tocLabel: "Kostenfaktoren",
      bloecke: [
        {
          typ: "p",
          text: "**Die Kosten hängen vor allem von der Anzahl der Strings und Wechselrichter, der Zugänglichkeit und dem Zustand der Dokumentation ab – nicht allein von der kWp-Zahl.** Eine gut dokumentierte Anlage mit wenigen, gut erreichbaren Wechselrichtern ist schneller geprüft als eine gleich große Anlage mit vielen Kleinwechselrichtern, fehlendem Stringplan und schwierigem Dachzugang.",
        },
        {
          typ: "liste",
          punkte: [
            "Anzahl Strings und Messpunkte, Art der Wechselrichter (String- oder Zentralwechselrichter, Optimierer)",
            "Zugang: Hubarbeitsbühne, Absturzsicherung, Abstimmung mit dem laufenden Betrieb",
            "Umfang: nur Pflichtprüfung oder zusätzlich I-U-Kennlinie, Drohnen-Thermografie, EL-Prüfung",
            "Dokumentationsaufwand bei fehlenden oder veralteten Unterlagen",
            "Kombination mit Wartung, Reinigung oder Prüfung weiterer Anlagenteile (Ladepunkte, Speicher)",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt bietet den [E-Check mit Prüfbefund](/service/e-check) für PV-Anlagen, Speicher und Ladepunkte in ganz Österreich an – auf Wunsch als Teil eines [Wartungsvertrags](/ratgeber/photovoltaik-wartungsvertrag), bei dem wir die Fristen für Sie überwachen.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Ist der E-Check für PV-Anlagen in Österreich Pflicht?",
      a: "Für Arbeitgeber ja: Die ESV 2012 verlangt eine Prüfung vor Inbetriebnahme und wiederkehrende Prüfungen der elektrischen Anlagen in Arbeitsstätten. Der Begriff „E-Check“ selbst kommt im österreichischen Recht nicht vor. Für private Betreiber ohne Arbeitnehmer gibt es keine ESV-Pflicht, Versicherer verlangen aber oft Nachweise.",
    },
    {
      q: "Wie oft muss eine PV-Anlage im Betrieb geprüft werden?",
      a: "Im Regelfall längstens alle fünf Jahre. Bei geringer Belastung wie in Büros oder im Handel sind bis zu zehn Jahre zulässig, in explosionsgefährdeten Bereichen drei Jahre, auf Baustellen ein Jahr. Die Behörde kann kürzere Fristen vorschreiben.",
    },
    {
      q: "Was steht in einem Prüfbefund?",
      a: "Datum, Name und Anschrift des Prüfers, Unterschrift, Umfang und Ergebnis der Prüfung sowie die festgelegten Schutzmaßnahmen (§ 11 ESV 2012). Bei PV-Anlagen gehören Messwerte je String und eine Mängelliste mit Dringlichkeit dazu.",
    },
    {
      q: "Welche Messungen gehören zur Prüfung einer PV-Anlage?",
      a: "Auf der DC-Seite Isolationswiderstand, Leerlaufspannung und Kurzschlussstrom je String nach ÖVE/ÖNORM EN 62446-1, auf der AC-Seite Schutzleiter, Schleifenimpedanz und Fehlerstromschutz nach OVE E 8101. Ergänzend sind I-U-Kennlinien und Thermografie sinnvoll.",
    },
    {
      q: "Wer darf die wiederkehrende Prüfung durchführen?",
      a: "Elektrofachkräfte, die Kenntnisse durch die Prüfung vergleichbarer Anlagen haben (§ 7 ESV 2012). Für PV-Anlagen braucht es Erfahrung mit Gleichstromkreisen und ein geeignetes PV-Prüfgerät.",
    },
    {
      q: "Wie lange muss ich Prüfbefunde aufbewahren?",
      a: "Schaltpläne und Anlagenunterlagen bis zur Außerbetriebnahme, von den wiederkehrenden Prüfungen zumindest die letzten beiden Befunde. Liegt das Prüfintervall über drei Jahren, genügt der letzte Prüfbefund.",
    },
    {
      q: "Muss auch die Wallbox im Betrieb geprüft werden?",
      a: "Ja, Ladeeinrichtungen sind Teil der elektrischen Anlage. Für den sicheren Betrieb und die wiederkehrende Prüfung von Ladeeinrichtungen gibt die OVE-Richtlinie R 30 den Rahmen vor. Mehr im Ratgeber [Wallbox Installation](/ratgeber/wallbox-installation).",
    },
  ],

  howTo: {
    name: "Wiederkehrende Prüfung einer Gewerbe-PV-Anlage vorbereiten und durchführen lassen",
    schritte: [
      { name: "Unterlagen bereitstellen", text: "Anlagendokumentation, Stringplan, letzten Prüfbefund und Monitoring-Zugang an die prüfende Elektrofachkraft übermitteln." },
      { name: "Termin bei guter Einstrahlung planen", text: "DC-Messungen und Thermografie an einem sonnigen Tag ansetzen und mit dem Betrieb abstimmen." },
      { name: "Sichtprüfung und Messungen", text: "Sichtprüfung, Isolationswiderstand, Leerlaufspannung und Kurzschlussstrom je String sowie AC-Schutzmaßnahmen prüfen lassen." },
      { name: "Thermischen Zustand erfassen", text: "Verteiler, Anschlüsse und Modulfeld thermografieren lassen, bei großen Dächern per Drohne." },
      { name: "Prüfbefund erhalten", text: "Schriftlichen Prüfbefund mit Messwerten, Ergebnis und Mängelliste entgegennehmen und im Anlagenbuch ablegen." },
      { name: "Mängel beheben", text: "Mängel nach Dringlichkeit beheben lassen, dokumentieren und die nächste Prüfung terminieren." },
    ],
  },

  passend: [
    { href: "/service/e-check", titel: "E-Check mit Prüfbefund", text: "Prüfung von PV-Anlagen, Speichern und Ladepunkten." },
    { href: "/ratgeber/photovoltaik-wartungsvertrag", titel: "Wartungsvertrag", text: "Prüffristen im Vertrag mitüberwachen lassen." },
    { href: "/ratgeber/photovoltaik-brandschutz", titel: "Brandschutz bei PV", text: "OVE R 11-1, Feuerwehr und Kennzeichnung." },
    { href: "/ratgeber/pv-thermografie-drohne", titel: "Thermografie mit Drohne", text: "Hotspots aus der Luft finden." },
  ],

  quellen: [
    { titel: "RIS – Elektroschutzverordnung 2012 (ESV 2012), geltende Fassung", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007835", stand: "09/2026" },
    { titel: "JUSLINE – § 9 ESV 2012, Wiederkehrende Prüfungen", url: "https://www.jusline.at/gesetz/esv_2012/paragraf/9", stand: "09/2026" },
    { titel: "JUSLINE – § 11 ESV 2012, Prüfbefunde", url: "https://www.jusline.at/gesetz/esv_2012/paragraf/11", stand: "09/2026" },
    { titel: "OVE – OVE E 8101:2025, Struktur und Neuerungen (Teil 6 Prüfung, Teil 7 PV)", url: "https://www.ove.at/ove-standardization/normen-produkte/ove-e-8101/", stand: "09/2026" },
    { titel: "OVE – Richtlinien R 11-1:2022 (Feuerwehr) und R 30:2025 (Ladeeinrichtungen)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
    { titel: "IEC – IEC TS 62446-3:2017, Outdoor infrared thermography of PV modules and plants", url: "https://webstore.iec.ch/en/publication/28628", stand: "09/2026" },
  ],

  seitenCta: { titel: "Prüfung fällig?", text: "E-Check mit Prüfbefund für PV, Speicher und Ladepunkte.", href: "/service/e-check", label: "E-Check anfragen" },
  cta: {
    title: "Prüfbefund aktuell? Wir prüfen Ihre PV-Anlage.",
    text: "Erstprüfung, wiederkehrende Prüfung und Thermografie für Gewerbe, Landwirtschaft und Gemeinden – von Ökovolt aus Ostermiething (OÖ), in ganz Österreich.",
    primary: { label: "E-Check anfragen", href: "/service/e-check" },
    secondary: { label: "Wartung & Service", href: "/service/wartung" },
  },
};

export default artikel;
