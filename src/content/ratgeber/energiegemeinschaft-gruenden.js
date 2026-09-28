// Ratgeber: Energiegemeinschaft gründen – EEG, BEG, GEA, P2P nach ElWG (ab 01.10.2026)
// Recherchestand 28.09.2026: Österreichische Koordinationsstelle für Energiegemeinschaften (FAQs zum ElWG,
// Bürgerenergie-Modelle, Messung und Aufteilung, Lieferantenverpflichtungen, Empfehlung für bestehende EG v2 08/2026,
// Ratgeber Steuern & Abgaben 2026), SNE-G-V-Begutachtungsentwurf 07/2026 (§ 9 samt Erläuterungen),
// Netzentgeltreduktion bis 31.12.2026 laut SNE-V (57 % / 28 % / 64 %).

const artikel = {
  slug: "energiegemeinschaft-gruenden",
  title: "Energiegemeinschaft gründen: EEG, BEG und neue Modelle im ElWG",
  seoTitle: "Energiegemeinschaft gründen 2026: EEG & BEG | Ökovolt",
  kurzTitel: "Energiegemeinschaft gründen",
  description:
    "Energiegemeinschaft gründen in Österreich: EEG, BEG, GEA und Peer-to-Peer nach ElWG, Netzentgeltreduktion, Rechtsform, EDA, Steuern und Ablauf ab Oktober 2026.",
  excerpt:
    "Seit 1. Oktober 2026 regelt das ElWG die gemeinsame Energienutzung neu. Welches Modell passt, wie viel Netzentgelt Sie sparen, welche Rechtsform sinnvoll ist und wie die Gründung Schritt für Schritt abläuft.",
  hauptKeyword: "energiegemeinschaft gründen",
  keywords: [
    "Energiegemeinschaft gründen",
    "Erneuerbare-Energie-Gemeinschaft",
    "Bürgerenergiegemeinschaft",
    "EEG Netzentgeltreduktion",
    "Energiegemeinschaft ElWG 2026",
    "Energiegemeinschaft Verein Genossenschaft",
    "EDA Energiegemeinschaft",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/Referenzen/Projekte-1.jpg",
  bildAlt: "Photovoltaikmodule und Windräder im Abendlicht als Symbol für gemeinschaftlich erzeugten Ökostrom",
  badge: { wert: "57 %", text: "Netzentgeltreduktion (Arbeitspreis) für lokale EEG bis Ende 2026" },

  kurzFazit: [
    "**Eine Erneuerbare-Energie-Gemeinschaft (EEG) ist ein Zusammenschluss von mindestens zwei Teilnehmern in einer eigenen Rechtsform, der Strom aus erneuerbaren Quellen im Nahebereich gemeinsam erzeugt und nutzt.** Seit 1. Oktober 2026 regelt das ElWG diese „gemeinsame Energienutzung“ neu und ergänzt sie um Peer-to-Peer-Verträge und Eigenversorgungsanlagen.",
    "Bis Ende 2026 erhalten nur Mitglieder lokaler und regionaler EEG reduzierte Netzentgelte: **57 %** weniger Netznutzungs-Arbeitspreis lokal, **28 %** regional auf Netzebene 6/7 und **64 %** regional auf Netzebene 4/5. Ab **1. Jänner 2027** gelten neue Abschläge nach genutzter Netzinfrastruktur – dann auch für BEG und Peer-to-Peer im Nahebereich.",
    "Nur bei der **EEG** entfallen zusätzlich **Elektrizitätsabgabe** und **Erneuerbaren-Förderbeitrag** für den gemeinschaftlich bezogenen Strom.",
    "Voraussetzungen: Rechtsform (meist Verein oder Genossenschaft), Smart Meter mit **Opt-in** für Viertelstundenwerte bei allen Teilnehmern, Registrierung im **EDA**-Datenaustausch. Neue Modelle starten zunächst innerhalb eines Netzbetreibers; netzübergreifend voraussichtlich ab **April 2027**.",
  ],

  abschnitte: [
    {
      id: "was",
      titel: "Was ist eine Energiegemeinschaft – und was ändert das ElWG?",
      tocLabel: "Was ist eine EG?",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Energiegemeinschaft ermöglicht es mehreren Netzbenutzern, selbst erzeugten erneuerbaren Strom über das öffentliche Netz untereinander zu teilen – abgerechnet je Viertelstunde, zu selbst festgelegten Preisen.** Die Teilnehmer behalten ihren eigenen Stromliefervertrag für den Reststrom und ihre freie Lieferantenwahl. Der Netzbetreiber ordnet die gemeinschaftlich erzeugte Energie viertelstündlich den Verbrauchern zu und stellt die Daten zur Abrechnung bereit.",
        },
        {
          typ: "p",
          text: "Mit dem [Elektrizitätswirtschaftsgesetz (ElWG)](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz) sind die bisherigen Modelle – [EEG](/wissen/lexikon#eeg), [BEG](/wissen/lexikon#beg) und [GEA](/wissen/lexikon#gea) – ab 1. Oktober 2026 Teil der „gemeinsamen Energienutzung“ (§§ 65 ff. ElWG). Neu sind Peer-to-Peer-Verträge ohne eigene Rechtsperson, die Eigenversorgungsanlage für mehrere Standorte einer Person, die Marktrolle des Organisators, Lieferantenpflichten ab bestimmten Anlagengrößen und eine Teilnahmegrenze von 6 MW für große Unternehmen. Bestehende Gemeinschaften bestehen weiter; die Netzbetreiber überführen sie automatisch in das neue System.",
        },
        {
          typ: "tabelle",
          caption: "Modelle der gemeinsamen Energienutzung nach ElWG, Stand September 2026",
          kopf: ["Modell", "Teilnehmer", "Rechtsform", "Nahebereich", "Vorteil"],
          zeilen: [
            ["Erneuerbare-Energie-Gemeinschaft (EEG)", "natürliche Personen, Gemeinden, öffentliche Stellen, KMU – keine großen Unternehmen", "juristische Person (Verein, Genossenschaft …)", "lokal, regional, österreichweit", "reduzierte Netzentgelte im Nahebereich, keine Elektrizitätsabgabe, kein Erneuerbaren-Förderbeitrag"],
            ["Bürgerenergiegemeinschaft (BEG)", "wie EEG plus große Unternehmen (ohne Kontrolle)", "juristische Person", "Standort, lokal, regional, österreichweit", "reduzierte Netzentgelte im Nahebereich (ab 2027), Marktprämie bis 100 %"],
            ["Gemeinschaftliche Erzeugungsanlage (GEA)", "mind. zwei Personen am selben Standort", "keine juristische Person nötig", "Hauptleitung / Standortbereich", "kein öffentliches Netz, keine Elektrizitätsabgabe"],
            ["Peer-to-Peer (P2P)", "mind. zwei natürliche oder juristische Personen", "Vertrag", "Standort bis österreichweit", "reduzierte Netzentgelte im Nahebereich (ab 2027)"],
            ["Eigenversorgungsanlage (EVA)", "eine Person mit mehreren Standorten", "keine", "je nach Standort", "reduzierte Netzentgelte im Nahebereich (ab 2027)"],
          ],
          minBreite: 860,
          fussnote: "Quelle: Österreichische Koordinationsstelle für Energiegemeinschaften (energiegemeinschaften.gv.at), Stand 09/2026. Die gemeinsame Energienutzung ist auf Strom aus erneuerbaren Quellen beschränkt – das gilt de facto auch für BEG.",
        },
      ],
    },
    {
      id: "nahebereich",
      titel: "Nahebereich: lokal, regional oder österreichweit?",
      tocLabel: "Nahebereich",
      bloecke: [
        {
          typ: "p",
          text: "**Der Nahebereich bestimmt die Höhe der Netzentgeltreduktion – je weniger Netzebenen der geteilte Strom nutzt, desto größer der Rabatt.** Das ElWG unterscheidet in § 70 Abs. 6 vier Bereiche. Maßgeblich ist der Teilnehmer, der auf der am weitesten entfernten Netzebene liegt: Tritt einer lokalen Gemeinschaft ein Teilnehmer aus einem anderen Bundesland bei, verlieren alle den Nahebereichsvorteil.",
        },
        {
          typ: "tabelle",
          caption: "Nahebereiche der gemeinsamen Energienutzung nach ElWG",
          kopf: ["Bereich", "Genutzte Infrastruktur", "Typische Ausdehnung"],
          zeilen: [
            ["Standortbereich", "gemeinsame Hauptleitung oder Sammelschiene im Hausanschlusskasten bzw. Verteilerkasten", "ein Gebäude oder Gebäudekomplex"],
            ["Lokalbereich", "Niederspannungsnetz und Niederspannungsteil der Trafostation (Netzebenen 6/7)", "rund 1 km, dieselbe Trafostation"],
            ["Regionalbereich", "Mittelspannungsnetz und Mittelspannungs-Sammelschienen im Umspannwerk (Netzebenen 4/5)", "rund 30 km"],
            ["Österreichweit", "alle Netzebenen, netzübergreifend", "ganz Österreich – ohne Netzentgeltvorteil"],
          ],
          minBreite: 640,
          fussnote: "Ausdehnungen sind Richtwerte der Koordinationsstelle; entscheidend ist die tatsächliche Netztopologie. Welche Zählpunkte in denselben Bereich fallen, teilt der Netzbetreiber mit. Hintergrund zu Netzebenen im [Lexikon](/wissen/lexikon#netzebene).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Nahebereich vor der Gründung klären",
          text: "Der Nahebereich wird bei der Registrierung gewählt und lässt sich derzeit nur aufwendig ändern (Neuregistrierung, neuer Vertrag mit Netzbetreiber und EDA). Laut Koordinationsstelle soll ein Wechsel ab Oktober 2027 einfacher werden. Fragen Sie den Netzbetreiber vorab, welche Zählpunkte an derselben Trafostation bzw. demselben Umspannwerk hängen.",
        },
      ],
    },
    {
      id: "netzentgelte",
      titel: "Wie viel Netzentgelt und Abgaben spart eine Energiegemeinschaft?",
      tocLabel: "Netzentgelte & Abgaben",
      bloecke: [
        {
          typ: "p",
          text: "**Bis 31. Dezember 2026 reduziert sich für Mitglieder lokaler EEG der Arbeitspreis des Netznutzungsentgelts um 57 %, für regionale EEG um 28 % (Netzebenen 6/7) bzw. 64 % (Netzebenen 4/5) – jeweils für den aus der Gemeinschaft bezogenen Strom.** BEG erhielten bisher keine Reduktion. Ab 1. Jänner 2027 gilt die neue Systemnutzungsentgelte-Systematik: Für alle Formen der gemeinsamen Energienutzung im Nahebereich wird der Arbeitspreis abhängig von der genutzten Infrastruktur um einheitliche Prozentsätze reduziert; laut Erläuterungen zum Verordnungsentwurf kann der Rabatt bei Hauptleitung und Standortbereich 90 bzw. 100 % erreichen. Die konkreten Prozentsätze legt die Tarifverordnung fest, die noch aussteht.",
        },
        {
          typ: "tabelle",
          caption: "Netzentgeltreduktion und Abgaben für gemeinschaftlich bezogenen Strom",
          kopf: ["", "bis 31. 12. 2026", "ab 1. 1. 2027"],
          zeilen: [
            ["Lokale EEG", "−57 % Arbeitspreis Netznutzung", "Abschlag je genutzter Infrastruktur (Tarifverordnung)"],
            ["Regionale EEG", "−28 % (NE 6/7) bzw. −64 % (NE 4/5)", "Abschlag je genutzter Infrastruktur"],
            ["BEG, P2P, EVA im Nahebereich", "keine Reduktion", "Abschlag wie EEG im selben Nahebereich"],
            ["Österreichweit", "keine Reduktion", "keine Reduktion"],
            ["Elektrizitätsabgabe", "entfällt nur bei EEG (und bei GEA)", "unverändert: nur EEG und GEA"],
            ["Erneuerbaren-Förderbeitrag", "entfällt nur bei EEG", "unverändert: nur EEG"],
          ],
          hervorheben: 2,
          minBreite: 680,
          fussnote: "Quellen: Koordinationsstelle für Energiegemeinschaften, SNE-G-V-Begutachtungsentwurf der E-Control (07/2026). Der Leistungspreis wird bei Standort- und Hauptleitungsmodellen saldiert; bei lokalen und regionalen Modellen bleibt er unverändert. Keine Rechts- oder Steuerberatung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Übergangsphase Oktober bis Dezember 2026",
          text: "Die neuen Bestimmungen gelten seit 1. 10. 2026; neue Modelle sind ab 5. 10. 2026 zunächst nur mit Zählpunkten beim selben Netzbetreiber umsetzbar. Weil die novellierte Systemnutzungsentgelte-Verordnung erst am 1. 1. 2027 in Kraft tritt, können Netzbetreiber von Oktober bis Dezember 2026 nur Mitgliedern lokaler und regionaler EEG vergünstigte Netzentgelte verrechnen. Eine netzübergreifende und österreichweite Umsetzung ist voraussichtlich ab April 2027 möglich. Quelle: Koordinationsstelle für Energiegemeinschaften, FAQs zum ElWG.",
        },
      ],
    },
    {
      id: "rechtsform",
      titel: "Welche Rechtsform passt: Verein, Genossenschaft oder GmbH?",
      tocLabel: "Rechtsform",
      bloecke: [
        {
          typ: "p",
          text: "**EEG und BEG brauchen eine eigene Rechtsperson; in der Praxis werden überwiegend Vereine und Genossenschaften gewählt.** Der Hauptzweck darf nicht im finanziellen Gewinn liegen, sondern muss ökologische, wirtschaftliche oder sozialgemeinschaftliche Vorteile für Mitglieder oder das Gebiet verfolgen – das gehört in die Statuten.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Verein", text: "Schnell und günstig gegründet, keine Mindest-Körperschaftsteuer, Einnahmen-Ausgaben-Rechnung bis 1 Mio. € Einnahmen. Gut für kleine und mittlere Gemeinschaften mit Haushalten und Gemeinden." },
            { titel: "Genossenschaft", text: "Stabile Struktur für Investitionen in eigene Anlagen, Mitgliederbeteiligung über Geschäftsanteile, jährlicher Jahresabschluss. Häufig bei Gewerbeparks und größeren Gemeinschaften." },
            { titel: "GmbH", text: "Möglich, aber mit Mindest-Körperschaftsteuer und höherem Formalaufwand; der nicht gewinnorientierte Hauptzweck muss sich aus dem Gesellschaftsvertrag ergeben." },
          ],
        },
      ],
    },
    {
      id: "steuern",
      titel: "Steuern und Pflichten gegenüber dem Finanzamt",
      tocLabel: "Steuern",
      bloecke: [
        {
          typ: "p",
          text: "**Energiegemeinschaften sind in der Regel unternehmerisch tätig: Stromlieferungen an Mitglieder unterliegen der Umsatzsteuer von 20 %, Gewinne der Körperschaftsteuer von 23 %.** Laut Steuer-Ratgeber der Koordinationsstelle gelten folgende Eckpunkte:",
        },
        {
          typ: "liste",
          punkte: [
            "**Kleinunternehmerregelung:** Bis 55.000 € Jahresumsatz netto (Toleranz bis 60.500 €) ist keine Umsatzsteuer abzuführen – dann aber auch kein Vorsteuerabzug. Investiert die Gemeinschaft selbst in Anlagen, lohnt oft die Option zur Regelbesteuerung (bindend für fünf Jahre).",
            "**Vorsteuerberichtigung:** PV-Anlagen gelten meist als Gebäudebestandteil; der Berichtigungszeitraum beträgt dann 20 Jahre.",
            "**Mitgliedsbeiträge:** Beiträge, die eine konkrete Gegenleistung abgelten (z. B. vergünstigter Strom, Zählpunktpauschale), sind unechte Mitgliedsbeiträge und steuerbar.",
            "**Anmeldung:** Gründung binnen eines Monats beim Finanzamt melden (Formulare Verf 15a für Vereine, Verf 15 für Genossenschaften, U 12 für die Option, U 15 für die UID).",
            "**Elektrizitätsabgabe:** Die Befreiung für selbst erzeugten und in der EEG verbrauchten Strom (§ 2 Abs. 1 Z 4 ElAbgG) setzt eine Anzeige an das Finanzamt und Aufzeichnungen über erzeugte, verbrauchte und eingespeiste Mengen voraus.",
          ],
        },
        {
          typ: "p",
          text: "Steuerfragen der teilnehmenden Unternehmen – etwa Reverse Charge bei Lieferungen an die Gemeinschaft – behandelt der Ratgeber [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe). Zur Einkommensteuer von PV-Anlagen siehe [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
        },
      ],
    },
    {
      id: "gruendung",
      titel: "Energiegemeinschaft gründen: Schritt für Schritt",
      tocLabel: "Gründung",
      bloecke: [
        {
          typ: "p",
          text: "**Die Gründung dauert erfahrungsgemäß einige Wochen bis wenige Monate; der größte Aufwand liegt in der Abstimmung mit Netzbetreiber und Teilnehmern.** Die Koordinationsstelle stellt Mustervorlagen für Statuten, Verträge, Lieferbedingungen und Rechnungen bereit.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Kerngruppe und Ziel festlegen", "Wer erzeugt, wer verbraucht, welche Anlagen gibt es oder sollen gebaut werden? Passen Erzeugungs- und Verbrauchsprofile zusammen?"],
            ["Nahebereich und Modell wählen", "Mit dem Netzbetreiber klären, welche Zählpunkte lokal oder regional zusammenpassen; danach EEG, BEG, P2P oder GEA wählen."],
            ["Rechtsform gründen", "Statuten mit nicht gewinnorientiertem Hauptzweck, Vereinsanmeldung bzw. Genossenschaftsgründung, Meldung beim Finanzamt."],
            ["Beim Datenaustausch registrieren", "Registrierung über ebUtilities für den energiewirtschaftlichen Datenaustausch (EDA); Zuordnung einer Gemeinschafts- bzw. Nahebereichs-ID. Das EDA-Portal ist bis 50 Zählpunkte kostenfrei."],
            ["Vertrag mit dem Netzbetreiber", "Vereinbarung über die Teilnahme und die Aufteilungsmethode; neue Gemeinschaften arbeiten mit dynamischer Aufteilung je Viertelstunde."],
            ["Teilnehmer aufnehmen", "Beitrittsvertrag; jeder Teilnehmer braucht einen Smart Meter mit Opt-in und erteilt die Datenfreigabe (CCM) selbst im Portal seines Netzbetreibers."],
            ["Tarif und Abrechnung festlegen", "Interne Preise für Bezug und Einspeisung, Abrechnung auf Basis des täglichen EDA-Energiedatenreports; endgültige Zuordnung spätestens am 16. Kalendertag des Folgemonats."],
            ["Lieferantenpflichten prüfen", "Bringt ein Haushalt über 30 kW oder ein sonstiger Teilnehmer über 100 kW ein, gelten Allgemeine Lieferbedingungen, Informationsblatt und Rechnungsvorgaben (§ 69 ElWG)."],
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Organisator: neue Marktrolle für Dienstleister",
          text: "Eine Gemeinschaft kann einen Organisator bestellen – auch der Verein selbst kann diese Rolle übernehmen. Er wickelt An- und Abmeldungen und Kommunikation mit dem Netzbetreiber ab und muss die Lieferantenpflichten erfüllen. Pro gemeinsamer Energienutzung ist nur ein Organisator möglich, daneben beliebig viele Dienstleister. Die Datenfreigabe der Teilnehmer kann er nicht ersetzen.",
        },
      ],
    },
    {
      id: "sonderfragen",
      titel: "Gemeinden, Speicher, Mehrfachteilnahme und Marktprämie",
      tocLabel: "Sonderfragen",
      bloecke: [
        {
          typ: "liste",
          punkte: [
            "**Gemeinden:** Bringen Gebietskörperschaften eigene Anlagen ein, müssen seit 1. 10. 2026 mindestens 10 % der eingebrachten Energie für schutzbedürftige Haushalte zur Verfügung stehen – Preis und Form sind frei gestaltbar. Mehr unter [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde).",
            "**Speicher:** Speicher können eingebunden werden, wenn sie nur mit Strom aus der eigenen Erzeugungsanlage geladen werden. Speicher mit Netzbezug brauchen Messkonzepte (§ 111 ElWG, TOR Messwesen); die praktische Anwendung ist laut Koordinationsstelle noch rechtlich unsicher.",
            "**Mehrfachteilnahme:** Aktive Kunden dürfen an mehreren Modellen gleichzeitig teilnehmen.",
            "**Große Unternehmen:** In der EEG weiterhin ausgeschlossen; in BEG und P2P mit höchstens 6 MW je Anlage (Teilnahmefaktor möglich).",
            "**Marktprämie:** Für BEG-Anlagen kann die Marktprämie seit dem ElWG für 100 % der eingespeisten Menge gewährt werden (§ 67 Abs. 5 ElWG); für EEG bleibt es laut EAG vorerst bei 50 %.",
          ],
        },
        {
          typ: "p",
          text: "Wie die gemeinschaftliche Nutzung innerhalb eines Gebäudes oder Gewerbeparks funktioniert, erklärt der Ratgeber [Gemeinschaftliche Erzeugungsanlage](/ratgeber/gemeinschaftliche-erzeugungsanlage). Einen Überblick über unsere Leistungen für Gemeinschaften finden Sie auf der Seite [Energiegemeinschaften](/energiegemeinschaften).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie viele Mitglieder braucht eine Energiegemeinschaft?",
      a: "Mindestens zwei. EEG und BEG brauchen zusätzlich eine eigene Rechtsform wie Verein oder Genossenschaft. Für Peer-to-Peer-Verträge und gemeinschaftliche Erzeugungsanlagen ist keine juristische Person nötig.",
    },
    {
      q: "Wie viel spart man in einer Energiegemeinschaft?",
      a: "Bis Ende 2026 sinkt für lokale EEG der Arbeitspreis des Netznutzungsentgelts um 57 %, für regionale um 28 % bzw. 64 %; zusätzlich entfallen bei EEG Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag. Ab 2027 gelten neue Abschläge laut Tarifverordnung. Die Ersparnis bezieht sich nur auf den aus der Gemeinschaft bezogenen Strom.",
    },
    {
      q: "Was ist der Unterschied zwischen EEG und BEG?",
      a: "Die EEG ist auf erneuerbare Energie und den Nahebereich ausgerichtet und schließt große Unternehmen aus; nur sie ist von Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag befreit. Die BEG darf große Unternehmen (ohne Kontrollfunktion) aufnehmen und österreichweit tätig sein; ab 2027 erhält sie im Nahebereich ebenfalls Netzentgeltabschläge.",
    },
    {
      q: "Brauchen alle Teilnehmer einen Smart Meter?",
      a: "Ja. Jede teilnehmende Erzeugungs- und Verbrauchsanlage braucht einen Smart Meter mit Opt-in für Viertelstundenwerte. Fehlende Geräte baut der Netzbetreiber laut Koordinationsstelle kostenlos binnen zwei Monaten ein.",
    },
    {
      q: "Kann eine Energiegemeinschaft über mehrere Netzgebiete gehen?",
      a: "Seit dem ElWG ja, praktisch aber erst ab voraussichtlich April 2027. Ab 5. Oktober 2026 können neue Modelle zunächst nur mit Zählpunkten beim selben Netzbetreiber umgesetzt werden. Netzentgeltvorteile gibt es nur im Nahebereich.",
    },
    {
      q: "Müssen bestehende Energiegemeinschaften etwas ändern?",
      a: "Grundsätzlich nein – sie werden von den Netzbetreibern automatisch übergeleitet. Zu prüfen sind aber die Lieferantenpflichten ab 30 bzw. 100 kW, die 6-MW-Grenze bei großen Unternehmen und die 10-%-Regel bei Gemeinden. BEG, die nur lokal oder regional teilen wollten, mussten sich vor 1. 10. 2026 beim Netzbetreiber melden.",
    },
    {
      q: "Welche Steuern fallen in einer Energiegemeinschaft an?",
      a: "Stromlieferungen unterliegen 20 % Umsatzsteuer, sofern nicht die Kleinunternehmerregelung (bis 55.000 € Umsatz) genutzt wird; Gewinne unterliegen 23 % Körperschaftsteuer. Für die Befreiung von der Elektrizitätsabgabe sind Anzeige und Aufzeichnungen beim Finanzamt nötig.",
    },
  ],

  howTo: {
    name: "Energiegemeinschaft in Österreich gründen",
    schritte: [
      { name: "Kerngruppe bilden", text: "Erzeuger und Verbraucher zusammenbringen und das Ziel der Gemeinschaft festlegen." },
      { name: "Nahebereich klären", text: "Mit dem Netzbetreiber prüfen, welche Zählpunkte lokal oder regional zusammenpassen, und das Modell wählen." },
      { name: "Rechtsform gründen", text: "Verein oder Genossenschaft mit nicht gewinnorientiertem Hauptzweck gründen und beim Finanzamt melden." },
      { name: "Für den Datenaustausch registrieren", text: "Registrierung für EDA über ebUtilities und Vertrag mit dem Netzbetreiber abschließen." },
      { name: "Teilnehmer aufnehmen", text: "Beitrittsverträge abschließen; Teilnehmer aktivieren Opt-in und Datenfreigabe im Netzbetreiber-Portal." },
      { name: "Tarife und Abrechnung einrichten", text: "Interne Preise festlegen und die Abrechnung auf Basis der EDA-Daten organisieren; Lieferantenpflichten prüfen." },
    ],
  },

  passend: [
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften mit Ökovolt", text: "Anlagen, Beratung und Umsetzung." },
    { href: "/ratgeber/energiegemeinschaft-gewerbe", titel: "Energiegemeinschaft für Unternehmen", text: "KMU-Regeln, Abrechnung und Steuern." },
    { href: "/ratgeber/gemeinschaftliche-erzeugungsanlage", titel: "Gemeinschaftliche Erzeugungsanlage", text: "PV im Mehrparteienhaus und Gewerbepark." },
    { href: "/kommunen", titel: "Gemeinden", text: "Gemeinde-PV und Bürgerbeteiligung." },
  ],

  quellen: [
    { titel: "Österreichische Koordinationsstelle für Energiegemeinschaften – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/", stand: "09/2026" },
    { titel: "Koordinationsstelle – Bürgerenergie-Modelle (gemeinsame Energienutzung)", url: "https://energiegemeinschaften.gv.at/gemeinsame-energienutzung/", stand: "09/2026" },
    { titel: "Koordinationsstelle – Empfehlungen für bestehende Energiegemeinschaften (v2)", url: "https://energiegemeinschaften.gv.at/wp-content/uploads/sites/19/2026/08/Empfehlung-fuer-bestehende-Energiegemeinschaften_v2.pdf", stand: "08/2026" },
    { titel: "Koordinationsstelle – Messung und Aufteilung", url: "https://energiegemeinschaften.gv.at/messung-und-aufteilung/", stand: "09/2026" },
    { titel: "Koordinationsstelle – Ratgeber Erneuerbare-Energie-Gemeinschaften: Steuern & Abgaben", url: "https://energiegemeinschaften.gv.at/downloads/erneuerbare-energie-gemeinschaften-steuern-abgaben/", stand: "2026" },
    { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf samt Erläuterungen (§ 9)", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "E-Control – Energiegemeinschaften", url: "https://www.e-control.at/energiegemeinschaften", stand: "09/2026" },
    { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", stand: "09/2026" },
  ],

  seitenCta: { titel: "Energiegemeinschaft geplant?", text: "Wir planen und errichten die Erzeugungsanlagen – und beraten zur Struktur.", href: "/energiegemeinschaften", label: "Mehr erfahren" },
  cta: {
    title: "Strom teilen – mit der passenden Anlage und klarer Struktur.",
    text: "Ökovolt Solartechnik plant und errichtet PV-Anlagen für Energiegemeinschaften von Gemeinden, Betrieben und Landwirtschaft in ganz Österreich.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Energiegemeinschaften", href: "/energiegemeinschaften" },
  },
};

export default artikel;
