// Ratgeber: Photovoltaik-Versicherung in Österreich (Gewerbe, Landwirtschaft, Gemeinden, Privat nachrangig)
// Quellen: VVO (Extremwetter 2023: > 1 Mrd. € versicherte Schäden; Deckung Sturm/Hagel/Schneedruck üblich,
// Hochwasser/Erdbeben begrenzt), Österreichische Hagelversicherung (Pressemeldung 09/2026; Produkte für
// Landwirtschaft), Hagelregister (VKF/EPZ), HORA, OVE-Richtlinien R 11-1 und R 6-2, ESV 2012.
// Keine Prämienangaben (keine belastbare Marktquelle). Ökovolt berät/vermittelt, bietet keine Versicherungsprodukte.

const artikel = {
  slug: "photovoltaik-versicherung",
  title: "Photovoltaik-Versicherung: Welche Deckung Betriebe wirklich brauchen",
  seoTitle: "Photovoltaik-Versicherung Österreich: Deckung | Ökovolt",
  kurzTitel: "Photovoltaik-Versicherung",
  description:
    "Photovoltaik-Versicherung in Österreich: Hagel, Sturm, Schneedruck, Elektronik, Ertragsausfall, Haftpflicht – welche Deckung Betriebe brauchen. Mit Checkliste.",
  excerpt:
    "Hagel, Sturm, Schneedruck, Überspannung, Marderbiss: Welche Risiken eine PV-Anlage in Österreich trägt, welche Versicherung sie abdeckt und welche Auflagen Versicherer stellen – mit Checkliste für den Vertrag.",
  hauptKeyword: "photovoltaik versicherung",
  keywords: [
    "Photovoltaik Versicherung Österreich",
    "PV-Anlage versichern Gewerbe",
    "Hagelschaden Photovoltaik",
    "Elektronikversicherung Photovoltaik",
    "Ertragsausfallversicherung PV",
    "Photovoltaik Betriebshaftpflicht",
    "PV-Anlage Sturmschaden",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/AT/wissen/pv-modul-pruefung.jpg",
  bildAlt: "Techniker in Warnjacke zeigt bei einer Kontrolle auf ein Solarmodul",
  badge: { wert: "> 1 Mrd. €", text: "versicherte Extremwetterschäden in Österreich 2023 (VVO)" },

  kurzFazit: [
    "**Eine PV-Anlage braucht drei Arten von Schutz: Sachschutz (Feuer, Sturm, Hagel, Schneedruck, Elektronik), Schutz vor Ertragsausfall und Haftpflicht.** Welche davon schon über Gebäude- oder Betriebsbündelversicherung laufen, muss im Einzelfall geprüft werden.",
    "**Das Wetterrisiko ist real:** Der Versicherungsverband Österreich (VVO) schätzte die versicherten Extremwetterschäden 2023 auf über 1 Mrd. €. Sturm, Hagel und Schneedruck sind in Gebäudepolizzen üblich, Hochwasser und Erdbeben nur begrenzt gedeckt.",
    "**Die Elektronik- bzw. Allgefahrenversicherung schließt die größten Lücken** – etwa Überspannung, Kurzschluss, Bedienfehler, Marderbiss und Diebstahl, die eine reine Feuer-/Sturmdeckung nicht erfasst.",
    "**Versicherer stellen Auflagen:** fachgerechte Errichtung, Prüfbefund, Brandschutz nach OVE-Richtlinie R 11-1, Blitz- und Überspannungsschutz sowie dokumentierte Wartung. Wer sie nicht erfüllt, riskiert Leistungskürzungen.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Braucht eine PV-Anlage eine eigene Versicherung?",
      tocLabel: "Eigene Versicherung?",
      bloecke: [
        {
          typ: "p",
          text: "**Eine eigene Polizze ist nicht immer nötig – eine bewusst geprüfte Deckung aber schon.** Bei Unternehmen und Gemeinden lässt sich die PV-Anlage oft in die bestehende Betriebsbündel- oder Gebäudeversicherung einschließen; entscheidend sind Versicherungssumme, versicherte Gefahren und Ausschlüsse. Eine PV-Anlage auf dem Dach ist ein technisch komplexes Wirtschaftsgut mit hohem Wert je Quadratmeter – eine Standard-Gebäudepolizze bildet das häufig nicht vollständig ab.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Sachschaden", text: "Zerstörung oder Beschädigung durch Feuer, Blitz, Sturm, Hagel, Schneedruck, Überspannung, Diebstahl, Tierbiss oder Bedienfehler." },
            { titel: "Ertragsausfall", text: "Entgangene Stromkostenersparnis und Einspeiseerlöse, bis die Anlage repariert ist – bei Gewerbeanlagen oft der größere Posten." },
            { titel: "Haftpflicht", text: "Schäden Dritter, etwa durch herabfallende Module, Brand auf Nachbargebäude oder Rückwirkungen auf das Netz." },
          ],
        },
      ],
    },
    {
      id: "risiken",
      titel: "Welche Risiken sind für PV-Anlagen in Österreich relevant?",
      tocLabel: "Risiken in Österreich",
      bloecke: [
        {
          typ: "p",
          text: "**In Österreich stehen Hagel, Sturm und Schneedruck an erster Stelle, gefolgt von Überspannung durch Blitz, Brand und Tierbiss.** Die Naturgefahren sind regional sehr unterschiedlich: Alpine Lagen tragen hohe Schneelasten, das Alpenvorland und die Südost-Steiermark sind hagelexponiert. Einen standortgenauen Überblick liefert die Naturgefahrenplattform [HORA](https://www.hora.gv.at/) des Bundes.",
        },
        {
          typ: "tabelle",
          caption: "Risiken einer PV-Anlage und typische Versicherungssparte",
          kopf: ["Risiko", "Typischer Schaden", "Meist gedeckt über"],
          zeilen: [
            ["Hagel", "Glasbruch, Zellrisse, Leistungsverlust", "Gebäude-/Sturmversicherung, Elektronikversicherung"],
            ["Sturm", "abgehobene Module, beschädigte Unterkonstruktion und Dachhaut", "Sturmversicherung (oft ab definierter Windgeschwindigkeit)"],
            ["Schneedruck", "verbogene Rahmen, gebrochene Module, Dachschäden", "Gebäude-/Sturmversicherung, Elektronikversicherung"],
            ["Blitz / Überspannung", "defekte Wechselrichter, Optimierer, Monitoring", "Elektronikversicherung; direkter Blitz auch Feuerversicherung"],
            ["Brand", "Anlage und Gebäude, Betriebsunterbrechung", "Feuerversicherung, Betriebsunterbrechung"],
            ["Tierbiss, Diebstahl, Vandalismus", "angefressene Leitungen, fehlende Module", "Elektronikversicherung (Allgefahren)"],
            ["Bedienfehler, Kurzschluss, Konstruktionsfehler", "Wechselrichter- und Speicherschäden", "Elektronik-/Maschinenbruchversicherung"],
            ["Hochwasser, Erdbeben", "Wechselrichter und Speicher im Keller", "nur begrenzt, Summen und Selbstbehalte prüfen"],
          ],
          minBreite: 700,
          fussnote: "Übliche Zuordnung; tatsächlicher Umfang ergibt sich aus Polizze und Bedingungen des jeweiligen Versicherers.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Hagel: Module mit Reserve wählen",
          text: "Die Modulnorm IEC 61215 prüft Hagelbeständigkeit mit 25-mm-Eiskugeln. In Österreich treten deutlich größere Körner auf. Das Hagelregister von VKF und Elementarschaden Präventionszentrum listet geprüfte Bauprodukte nach Hagelwiderstandsklassen (HW 1 bis HW 5, entsprechend Korndurchmessern von 1 bis 5 cm). Wie man Module und Neigung auf den Standort abstimmt, erklärt der Ratgeber [Hagel und Photovoltaik](/ratgeber/hagel-photovoltaik).",
        },
        {
          typ: "p",
          text: "Die Österreichische Hagelversicherung ist auf landwirtschaftliche Kulturen spezialisiert – für die PV-Anlage selbst sind Sach- und Elektronikversicherer zuständig. Relevant wird die Hagelversicherung bei [Agri-PV](/agri-pv): Dort sollten Anlage und darunter wachsende Kulturen getrennt und abgestimmt versichert werden. Allein Anfang September 2026 meldete die Hagelversicherung nach späten Unwettern landwirtschaftliche Schäden von rund 5 Mio. € in fünf Bundesländern.",
        },
      ],
    },
    {
      id: "sparten",
      titel: "Welche Versicherungen gibt es für PV-Anlagen?",
      tocLabel: "Versicherungsarten",
      bloecke: [
        {
          typ: "p",
          text: "**Für Gewerbe-PV-Anlagen kombiniert man üblicherweise fünf Bausteine: Montage-, Sach- bzw. Elektronik-, Betriebsunterbrechungs-, Haftpflicht- und – bei Finanzierung – eine Absicherung nach Vorgabe der Bank.** Die Tabelle zeigt, wofür welcher Baustein zuständig ist.",
        },
        {
          typ: "tabelle",
          caption: "Versicherungsbausteine für Photovoltaikanlagen im Überblick",
          kopf: ["Baustein", "Deckt", "Wichtig bei"],
          zeilen: [
            ["Montageversicherung", "Schäden während der Errichtung bis zur Abnahme (Diebstahl von Material, Sturm, Montagefehler)", "Errichter oder Bauherr – Zuständigkeit im Werkvertrag klären"],
            ["Feuer- / Gebäudeversicherung (inkl. Sturm, Hagel, Schneedruck)", "benannte Gefahren an Gebäude und mitversicherter Anlage", "Summenanpassung nach Errichtung, Einschluss ausdrücklich bestätigen"],
            ["Elektronik- / Allgefahrenversicherung", "alle nicht ausgeschlossenen Gefahren, inkl. Überspannung, Kurzschluss, Bedienfehler, Tierbiss, Diebstahl", "Kern der PV-Deckung für Betriebe"],
            ["Betriebsunterbrechung / Ertragsausfall", "entgangene Ersparnis und Erlöse bis zur Wiederherstellung", "hoher Eigenverbrauch, lange Lieferzeiten von Wechselrichtern"],
            ["Betriebshaftpflicht", "Personen- und Sachschäden Dritter", "Einschluss der Stromerzeugung und -einspeisung bestätigen lassen"],
          ],
          minBreite: 700,
        },
        {
          typ: "p",
          text: "Für Speicher gelten dieselben Überlegungen, oft mit zusätzlichen Auflagen zu Aufstellort, Brandabschnitt und Temperaturüberwachung – mehr im Ratgeber [Brandschutz bei Photovoltaik](/ratgeber/photovoltaik-brandschutz). Bei privaten Anlagen genügt häufig der Einschluss in die Eigenheimversicherung plus eine Elektronikdeckung; bei alpinen [Chalets](/chalets) mit hohen Schneelasten lohnt ein genauer Blick auf Schneedruck und Lawinengefahren.",
        },
      ],
    },
    {
      id: "auflagen",
      titel: "Welche Auflagen stellen Versicherer?",
      tocLabel: "Auflagen der Versicherer",
      bloecke: [
        {
          typ: "p",
          text: "**Versicherer verlangen den Nachweis, dass die Anlage fachgerecht errichtet, geprüft und instand gehalten wird.** Die konkreten Obliegenheiten stehen in den Bedingungen – werden sie verletzt, kann der Versicherer im Schadenfall die Leistung kürzen oder verweigern.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Errichtung durch befugten Elektrotechniker** mit Erstprüfungsprotokoll und Anlagendokumentation.",
            "**Prüfbefund:** Wiederkehrende Prüfung nach ESV 2012 bzw. im vom Versicherer verlangten Intervall – siehe [E-Check für PV-Anlagen](/ratgeber/e-check-photovoltaik).",
            "**Brandschutz:** Kennzeichnung, Feuerwehrplan und Maßnahmen nach OVE-Richtlinie R 11-1, Abstände zu Brandwänden.",
            "**Blitz- und Überspannungsschutz** nach OVE-Richtlinien R 6-2-1 und R 6-2-2 bzw. Blitzschutzkonzept des Gebäudes.",
            "**Wartung und Monitoring:** Nachweis regelmäßiger Kontrollen, Fehlermeldungen werden bearbeitet.",
            "**Statik:** Nachweis für Schnee- und Windlasten nach ÖNORM B 1991-1-3 und B 1991-1-4.",
            "**Meldung von Änderungen:** Erweiterungen, Speicher, Wechselrichtertausch und Summenänderungen dem Versicherer melden.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Unterversicherung vermeiden",
          text: "Wird eine PV-Anlage nachträglich auf ein versichertes Gebäude gebaut, ohne die Versicherungssumme anzupassen, droht Unterversicherung: Der Versicherer zahlt dann im Schadenfall nur anteilig – auch für Schäden am Gebäude. Melden Sie die Anlage mit dem Neuwert und lassen Sie sich den Einschluss schriftlich bestätigen.",
        },
      ],
    },
    {
      id: "ertragsausfall",
      titel: "Ertragsausfall: der unterschätzte Posten",
      tocLabel: "Ertragsausfall",
      bloecke: [
        {
          typ: "p",
          text: "**Bei Gewerbeanlagen ist der Ertragsausfall nach einem Schaden oft teurer als die Reparatur selbst, weil Ersatzteile Wochen brauchen und jede fehlende Kilowattstunde teuren Netzbezug auslöst.** Eine Betriebsunterbrechungs- oder Ertragsausfallversicherung ersetzt den entgangenen Wert für einen vereinbarten Zeitraum.",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: Wert eines zweimonatigen Totalausfalls im Sommer (Beispielrechnung)",
          kopf: ["Anlage", "Ertrag Juni + Juli (ca.)", "Wert bei 15 ct/kWh", "Wert bei 20 ct/kWh"],
          zeilen: [
            ["100 kWp", "27.000 kWh", "4.050 €", "5.400 €"],
            ["300 kWp", "81.000 kWh", "12.150 €", "16.200 €"],
            ["1.000 kWp", "270.000 kWh", "40.500 €", "54.000 €"],
          ],
          hervorheben: 3,
          minBreite: 600,
          fussnote: "Annahmen: rund 1.050 kWh/kWp im Jahr, davon etwa 13 % je Sommermonat; 15 ct als Mischwert aus Eigenverbrauch und Einspeisung, 20 ct bei überwiegendem Eigenverbrauch. Ohne Leistungspreiseffekte.",
        },
        {
          typ: "p",
          text: "Wichtig sind Haftzeit, Karenzzeit (die ersten Tage sind oft nicht gedeckt) und die Bewertungsgrundlage: Wird der Ertrag aus Monitoringdaten, aus einer Prognose oder aus dem Vorjahr abgeleitet? Ein gutes Monitoring ist deshalb auch Versicherungsvorsorge – siehe [Fernwartung](/technik/fernwartung). Wie hoch der Wert Ihres Eigenverbrauchs ist, zeigt der Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "zielgruppen",
      titel: "Besonderheiten für Landwirtschaft, Hotellerie und Gemeinden",
      tocLabel: "Branchen-Besonderheiten",
      bloecke: [
        {
          typ: "p",
          text: "**Je nach Branche verschieben sich die Schwerpunkte: In der Landwirtschaft zählen Brand- und Tierrisiken, in der Hotellerie Schnee und Betriebsunterbrechung, bei Gemeinden Haftung und Vergabe.** Ein Blick auf die typischen Konstellationen hilft, die Deckung passend zu wählen.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Landwirtschaft", text: "Anlagen auf Ställen, Scheunen und Maschinenhallen: Brandlast aus Heu und Stroh, Ammoniak, Marder und Nager. Feuerversicherung des Gebäudes und Elektronikdeckung der Anlage abstimmen; bei Agri-PV auch die Kulturversicherung. Mehr unter [Landwirtschaft](/landwirtschaft)." },
            { titel: "Hotellerie & Tourismus", text: "Hohe Schneelasten, Lawinen- und Murengefahr in alpinen Lagen, Betrieb in der Hochsaison. Ertragsausfall und Mehrkosten für Ersatzstrom einbeziehen, Zugang im Winter klären – siehe [Photovoltaik für Hotels](/ratgeber/photovoltaik-hotel)." },
            { titel: "Gemeinden", text: "Anlagen auf Schulen, Bauhöfen und Kläranlagen: Haftung gegenüber Nutzern, Einbindung in kommunale Sammelverträge, Vergabe der Versicherungsleistung nach Bundesvergabegesetz. Mehr im Ratgeber [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde)." },
          ],
        },
        {
          typ: "h3",
          text: "Neuwert oder Zeitwert – was passiert mit älteren Anlagen?",
        },
        {
          typ: "p",
          text: "Viele Elektronikpolizzen leisten in den ersten Jahren Neuwertersatz und wechseln danach auf den Zeitwert oder staffeln Abzüge nach Alter. Bei einer Anlage mit 25 Jahren Lebensdauer ist das ein erheblicher Unterschied. Prüfen Sie deshalb, ab welchem Anlagenalter Abzüge greifen, und passen Sie die Versicherungssumme an, wenn Module, Wechselrichter oder Speicher erneuert oder erweitert werden. Hinzu kommt ein praktisches Problem: Baugleiche Ersatzmodule sind nach einigen Jahren oft nicht mehr lieferbar. Gute Bedingungen regeln, dass bei Nichtverfügbarkeit gleichwertige Module eingesetzt und notwendige Anpassungen an Unterkonstruktion oder Stringplanung mitversichert sind – sonst bleibt der Betreiber auf Mehrkosten sitzen. Wie ein Weiterbetrieb älterer Anlagen wirtschaftlich gelingt, zeigt der Ratgeber [Photovoltaik nach 20 Jahren](/ratgeber/photovoltaik-nach-20-jahren).",
        },
      ],
    },
    {
      id: "schadenfall",
      titel: "Was tun im Schadenfall?",
      tocLabel: "Schadenfall",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Sicherheit herstellen", "Bei Brand, herabhängenden Modulen oder offenen Leitungen Bereich absperren; Anlage nur durch Fachkräfte freischalten lassen – DC-Leitungen stehen unter Spannung, solange Licht einfällt."],
            ["Schaden dokumentieren", "Fotos, Monitoringdaten (Ertragseinbruch mit Zeitstempel), Wetterdaten und Zeugen festhalten."],
            ["Versicherer sofort informieren", "Schadenmeldung innerhalb der vertraglichen Frist, Reparaturen erst nach Freigabe – außer Notmaßnahmen zur Schadensminderung."],
            ["Gutachten und Messungen", "Thermografie, Kennlinienmessung oder EL-Prüfung belegen verdeckte Schäden, etwa Mikrorisse nach Hagel."],
            ["Reparatur und Wiederinbetriebnahme", "Instandsetzung durch Fachbetrieb, Prüfung vor Wiederinbetriebnahme nach § 8 ESV 2012, Prüfbefund an den Versicherer."],
          ],
        },
        {
          typ: "p",
          text: "Gerade bei Hagel ist der Nachweis entscheidend: Zellrisse ohne sichtbaren Glasbruch zeigen sich oft erst Monate später als Leistungsverlust. Eine zeitnahe Inspektion – etwa per [Drohnen-Thermografie](/ratgeber/pv-thermografie-drohne) – sichert Ihre Ansprüche.",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Versicherungsvertrag für die PV-Anlage prüfen",
      tocLabel: "Checkliste Vertrag",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Ist die PV-Anlage (inkl. Speicher und Ladepunkte) ausdrücklich eingeschlossen und mit dem Neuwert versichert?",
            "Sind Hagel, Sturm, Schneedruck, Überspannung, Tierbiss, Diebstahl und Bedienfehler gedeckt?",
            "Wie hoch sind Selbstbehalte, und gelten sie je Schaden oder je Ereignis?",
            "Ist ein Ertragsausfall mit ausreichender Haftzeit versichert, und wie wird er berechnet?",
            "Deckt die Betriebshaftpflicht die Stromerzeugung und Einspeisung?",
            "Welche Obliegenheiten gelten (Prüfintervalle, Wartung, Brandschutz, Blitzschutz)?",
            "Sind Aufräum-, Demontage- und Wiedermontagekosten sowie Gerüst oder Hubsteiger mitversichert?",
            "Gilt Neuwert- oder Zeitwertersatz, und ab welchem Anlagenalter ändert sich das?",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Unabhängige Beratung einholen",
          text: "Ökovolt bietet keine eigenen Versicherungsprodukte an, unterstützt aber bei der [Versicherungsberatung](/service/versicherung): Wir liefern die technischen Unterlagen, die Versicherer brauchen, und erklären, welche Risiken Ihre Anlage konkret trägt. Die Polizze schließen Sie mit Ihrem Versicherer oder Makler ab.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Ist eine PV-Anlage in der Gebäudeversicherung mitversichert?",
      a: "Oft ja, aber nicht automatisch und meist nur gegen benannte Gefahren wie Feuer, Sturm, Hagel und Schneedruck. Melden Sie die Anlage mit dem Neuwert und lassen Sie sich den Einschluss bestätigen, sonst droht Unterversicherung. Schäden durch Überspannung, Kurzschluss oder Tierbiss deckt meist erst eine Elektronikversicherung.",
    },
    {
      q: "Zahlt die Versicherung Hagelschäden an Solarmodulen?",
      a: "Ja, wenn Hagel als Gefahr eingeschlossen ist – in Gebäude- und Elektronikpolizzen ist das üblich. Wichtig ist der Nachweis: Mikrorisse ohne Glasbruch werden oft erst durch Thermografie oder EL-Prüfung sichtbar. Melden Sie Schäden rasch und dokumentieren Sie sie.",
    },
    {
      q: "Was kostet eine Photovoltaik-Versicherung?",
      a: "Die Prämie hängt von Versicherungssumme, Standort (Hagel- und Schneelastzone), versicherten Gefahren, Selbstbehalt und Einschluss des Ertragsausfalls ab. Für Österreich gibt es keine allgemein gültige Preisstatistik – vergleichen Sie Angebote mit identischem Deckungsumfang.",
    },
    {
      q: "Brauche ich eine Haftpflichtversicherung für die PV-Anlage?",
      a: "Ja. Unternehmen sollten den Einschluss in die Betriebshaftpflicht bestätigen lassen, einschließlich Stromerzeugung und Einspeisung. Private Betreiber prüfen ihre Haushalts- bzw. Eigenheimhaftpflicht.",
    },
    {
      q: "Welche Auflagen stellen Versicherer an PV-Anlagen?",
      a: "Typisch sind fachgerechte Errichtung, Prüfbefund, Brandschutzmaßnahmen nach OVE-Richtlinie R 11-1, Blitz- und Überspannungsschutz, statischer Nachweis und dokumentierte Wartung. Die konkreten Obliegenheiten stehen in den Versicherungsbedingungen.",
    },
    {
      q: "Ist ein Ertragsausfall nach einem Schaden versichert?",
      a: "Nur wenn eine Betriebsunterbrechungs- oder Ertragsausfalldeckung vereinbart ist. Achten Sie auf Haftzeit, Karenzzeit und die Berechnungsgrundlage – Monitoringdaten erleichtern den Nachweis.",
    },
    {
      q: "Wer haftet, wenn ein Modul vom Dach fällt?",
      a: "Grundsätzlich der Betreiber bzw. Gebäudeeigentümer, der für den sicheren Zustand der Anlage verantwortlich ist. Gedeckt ist das über die Betriebs- oder Gebäudehaftpflicht, sofern die PV-Anlage eingeschlossen ist. Regelmäßige Kontrollen der Befestigung – besonders nach Stürmen – sind Teil der Sorgfaltspflicht.",
    },
    {
      q: "Muss ich die Versicherung informieren, wenn ich einen Speicher nachrüste?",
      a: "Ja. Ein Speicher erhöht den Versicherungswert und verändert das Brandrisiko. Melden Sie Nachrüstungen, Erweiterungen und Wechselrichtertausch, damit Summe und Obliegenheiten angepasst werden und keine Unterversicherung entsteht.",
    },
  ],

  passend: [
    { href: "/service/versicherung", titel: "Versicherungsberatung", text: "Technische Unterlagen und Risikoeinschätzung für Ihre Polizze." },
    { href: "/ratgeber/hagel-photovoltaik", titel: "Hagel und Photovoltaik", text: "Hagelwiderstand, Module und Standort." },
    { href: "/ratgeber/photovoltaik-brandschutz", titel: "Brandschutz bei PV", text: "OVE R 11-1, Feuerwehr, Speicher." },
    { href: "/ratgeber/e-check-photovoltaik", titel: "E-Check für PV-Anlagen", text: "Prüfbefund als Versicherungsnachweis." },
  ],

  quellen: [
    { titel: "VVO – Extremwetter: Erste Schätzungen für 2023 – über 1 Mrd. Euro Schäden", url: "https://www.vvo.at/presse-artikel/extremwetter-erste-schaetzungen-fuer-2023-ueber-1-mrd-euro-schaeden/", stand: "01/2024" },
    { titel: "Österreichische Hagelversicherung – Spätes Hagelunwetter 2026 (Presseaussendung)", url: "https://www.hagel.at/presseaussendungen/spaetes-hagelunwetter-2026/", stand: "09/2026" },
    { titel: "Hagelregister (VKF / Elementarschaden Präventionszentrum)", url: "https://www.hagelregister.at/", stand: "09/2026" },
    { titel: "HORA – Natural Hazard Overview & Risk Assessment Austria", url: "https://www.hora.gv.at/", stand: "09/2026" },
    { titel: "OVE – Richtlinien R 11-1 (Feuerwehr) und R 6-2 (Blitz- und Überspannungsschutz PV)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
    { titel: "RIS – Elektroschutzverordnung 2012 (ESV 2012)", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007835", stand: "09/2026" },
  ],

  seitenCta: { titel: "Richtig versichert?", text: "Technische Unterlagen und Risikoeinschätzung für Ihre Polizze.", href: "/service/versicherung", label: "Beratung anfragen" },
  cta: {
    title: "Ihre PV-Anlage richtig abgesichert – ohne Lücken.",
    text: "Wir liefern die technischen Nachweise, die Versicherer verlangen, und prüfen Ihre Anlage auf Risiken – für Betriebe und Gemeinden in ganz Österreich.",
    primary: { label: "Versicherungsberatung", href: "/service/versicherung" },
    secondary: { label: "E-Check anfragen", href: "/service/e-check" },
  },
};

export default artikel;
