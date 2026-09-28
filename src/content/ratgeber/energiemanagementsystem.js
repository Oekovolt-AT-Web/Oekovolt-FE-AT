// Ratgeber: Energiemanagementsystem (EMS) für PV im Gewerbe – Österreich
// Quellen: TOR Verteilernetzanschluss NS V1.3.1 (Ladeeinrichtungen > 3,68 kVA: bidirektionale Schnittstelle,
// offenes Protokoll wie OCPP/EEBUS, externe Leistungsbeschränkung; Summenleistung ≥ 10 kVA: VNB kann aussetzen,
// außer EMS verhindert Überschreitung der vereinbarten Leistung; > 250 kW Ladeleistung: Wirkleistungsvorgaben),
// TOR Stromerzeugungsanlagen Typ A V1.4, OeMAG-Marktpreise 2026, ISO 50001 (Managementsystem-Norm),
// Energy-Charts (Day-Ahead-Preise AT). Keine Produkt- oder Preiszusagen.

const artikel = {
  slug: "energiemanagementsystem",
  title: "Energiemanagementsystem für Betriebe: PV, Speicher und Lasten steuern",
  seoTitle: "Energiemanagementsystem (EMS) für Betriebe | Ökovolt",
  kurzTitel: "Energiemanagementsystem",
  description:
    "Energiemanagementsystem für Gewerbe: PV-Überschuss, Peak Shaving, Ladepunkte, Wärmepumpen, Spotpreise, Schnittstellen und TOR-Anforderungen in Österreich.",
  excerpt:
    "Ein Energiemanagementsystem verteilt Solarstrom, Speicherladung und Netzbezug in Echtzeit – und hält die Anschlussleistung ein. Was ein EMS im Betrieb leisten muss, welche Schnittstellen zählen und wie Sie das richtige System auswählen.",
  hauptKeyword: "energiemanagementsystem",
  keywords: [
    "Energiemanagementsystem Gewerbe",
    "EMS Photovoltaik",
    "Energiemanagement PV Speicher",
    "Lastmanagement Ladepunkte",
    "Peak Shaving EMS",
    "Energiemanagementsystem Österreich",
    "OCPP EEBus Modbus",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/energiemanagementsystem.jpg",
  bildAlt: "Energiemanagement-Gateway einer Photovoltaikanlage mit Speicher",
  badge: { wert: "> 3,68 kVA", text: "ab dieser Leistung brauchen Ladeeinrichtungen laut TOR eine offene, steuerbare Schnittstelle" },

  kurzFazit: [
    "**Ein Energiemanagementsystem (EMS) misst Erzeugung, Verbrauch und Netzbezug in Echtzeit und steuert PV, Speicher, Ladepunkte, Wärmepumpen und flexible Lasten so, dass möglichst viel Solarstrom selbst genutzt und die vereinbarte Anschlussleistung nicht überschritten wird.**",
    "**Die TOR machen Steuerbarkeit zur Pflicht:** Ladeeinrichtungen über 3,68 kVA müssen über ein offenes Protokoll (etwa OCPP oder EEBUS) ansteuerbar sein; ab 10 kVA Summenleistung kann ein EMS, das die vereinbarte Leistung einhält, ein Aussetzen des Anschlusses durch den Netzbetreiber vermeiden.",
    "**Im Gewerbe verdient ein EMS dreifach:** mehr Eigenverbrauch (Solarstrom statt Netzbezug), niedrigerer Leistungspreis durch Peak Shaving und – mit Speicher oder flexiblen Lasten – günstigere Stunden bei Spotpreis-Tarifen.",
    "**Entscheidend sind offene Schnittstellen und IT-Sicherheit:** Modbus TCP, SunSpec, OCPP, EEBUS, SG-Ready und OPC UA verhindern Herstellerbindung; Fernzugriffe gehören abgesichert und dokumentiert.",
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist ein Energiemanagementsystem?",
      tocLabel: "Was ist ein EMS?",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Energiemanagementsystem ist eine Steuerung, die Energieflüsse im Gebäude oder Betrieb misst und aktiv regelt – im Sekunden- bis Minutentakt.** Die zentrale Messgröße ist die Leistung am Netzanschlusspunkt: Fließt Strom ins Netz, schaltet das EMS Verbraucher zu oder lädt den Speicher; droht eine Lastspitze, drosselt es Ladepunkte oder entlädt den Speicher. Der Begriff [Energiemanagementsystem](/wissen/lexikon#energiemanagementsystem) ist im Lexikon erklärt.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Messen", text: "Zähler am Netzanschlusspunkt, Unterzähler für große Verbraucher, Wechselrichter- und Speicherdaten, Wetterprognose." },
            { titel: "Entscheiden", text: "Regeln und Prognosen: Überschuss verteilen, Lastspitze begrenzen, günstige Spotpreis-Stunden nutzen, Prioritäten einhalten." },
            { titel: "Steuern", text: "Sollwerte an Speicher, Ladepunkte, Wärmepumpen, Heizstäbe, Kältetechnik und Wechselrichter über offene Schnittstellen." },
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Nicht verwechseln: EMS und Energiemanagement nach ISO 50001",
          text: "Die ISO 50001 beschreibt ein Managementsystem – also Organisation, Ziele, Messkonzepte und kontinuierliche Verbesserung des Energieeinsatzes. Große Unternehmen in Österreich müssen nach dem Bundes-Energieeffizienzgesetz regelmäßig Energieaudits durchführen oder ein anerkanntes Managementsystem betreiben. Das technische EMS liefert dafür Messdaten und setzt Maßnahmen automatisch um – es ersetzt das Managementsystem aber nicht.",
        },
      ],
    },
    {
      id: "funktionen",
      titel: "Welche Funktionen braucht ein EMS im Betrieb?",
      tocLabel: "Funktionen",
      bloecke: [
        {
          typ: "p",
          text: "**Im Gewerbe muss ein EMS mindestens vier Aufgaben beherrschen: Überschussnutzung, Lastspitzenbegrenzung, Ladepunkt-Management und die Einhaltung von Netzvorgaben.** Je nach Betrieb kommen Wärme- und Kältesteuerung, dynamische Tarife und Notstrombetrieb hinzu.",
        },
        {
          typ: "tabelle",
          caption: "Funktionen eines gewerblichen Energiemanagementsystems",
          kopf: ["Funktion", "Was sie tut", "Nutzen"],
          zeilen: [
            ["PV-Überschusssteuerung", "Verbraucher und Speicher nach Überschuss am Netzanschlusspunkt zuschalten", "höherer Eigenverbrauch"],
            ["Peak Shaving", "Bezugsleistung auf einen Grenzwert begrenzen (Speicher entladen, Lasten drosseln)", "niedrigerer Leistungspreis bei Lastprofilmessung"],
            ["Dynamisches Lastmanagement Ladepunkte", "verfügbare Leistung auf Ladepunkte verteilen, Prioritäten je Fahrzeug", "Anschlussleistung einhalten, Flotte zuverlässig laden"],
            ["Wärme- und Kältesteuerung", "Wärmepumpen (SG-Ready/EEBUS), Pufferspeicher, Kühlzellen nach Überschuss und Preis", "thermische Speicher als günstige Batterie"],
            ["Spotpreis-Optimierung", "flexible Lasten und Speicher in günstige Day-Ahead-Stunden verschieben", "niedrigere Energiekosten bei dynamischem Tarif"],
            ["Einspeisebegrenzung", "Wirkleistung an Vorgaben des Netzbetreibers oder negative Preise anpassen", "Netzkonformität, keine Einspeisung bei negativen Preisen"],
            ["Ersatzstrom-Logik", "Prioritäten und Lastabwurf im Inselbetrieb", "Versorgung kritischer Lasten"],
            ["Monitoring & Reporting", "Kennzahlen, Lastgänge, Berichte, Alarme", "Nachweise für Audit, ESG-Bericht, Wartung"],
          ],
          minBreite: 700,
        },
        {
          typ: "p",
          text: "Wie viel das Kappen der Lastspitze bringt, erklärt der Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis); die Verschiebung in günstige Stunden behandelt [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich). Die Grundlagen der Eigenverbrauchsoptimierung finden Sie unter [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "tor",
      titel: "Was die TOR für Steuerbarkeit und Lastmanagement verlangen",
      tocLabel: "TOR & Netzbetreiber",
      bloecke: [
        {
          typ: "p",
          text: "**Die TOR Verteilernetzanschluss (Niederspannung, Version 1.3.1) verlangen, dass Ladeeinrichtungen über 3,68 kVA über eine bidirektionale digitale Schnittstelle mit einem offenen Standardprotokoll – genannt werden OCPP und EEBUS – mit anderen Komponenten kommunizieren und eine externe Leistungsbeschränkung erlauben.** Die Fähigkeit kann auch über ein dauerhaft verbundenes Lade- oder Energiemanagementsystem erfüllt werden.",
        },
        {
          typ: "tabelle",
          caption: "EMS-relevante Regelungen der TOR Verteilernetzanschluss Niederspannung V1.3.1",
          kopf: ["Regelung", "Inhalt", "Rolle des EMS"],
          zeilen: [
            ["Meldepflicht", "Ladeeinrichtungen, Wärmepumpen und Klimageräte über 3,68 kVA sind dem Netzbetreiber zu melden", "EMS-Konzept bei der Meldung beschreiben"],
            ["Summenleistung ≥ 10 kVA", "Netzbetreiber kann den Anschluss bei mangelnder Netzkapazität vorübergehend zur Prüfung aussetzen", "Kein Aussetzen, wenn ein EMS sicherstellt, dass die vereinbarte Leistung nicht überschritten wird"],
            ["Kommunikation & Steuerbarkeit", "offenes Protokoll, externe Begrenzung der Ladeleistung, Ladeprogramme mit Zeitsteuerung", "EMS übernimmt Steuerung und Priorisierung"],
            ["Zufallsverzögerung", "zeitgesteuerter Ladestart mit zufälliger Verzögerung von 0 bis 300 Sekunden", "verhindert synchrone Lastsprünge"],
            ["Ladeleistung > 250 kW", "Vereinbarung über Wirkleistungsvorgaben mit dem Netzbetreiber möglich; Anlage muss Sollwerte umsetzen können", "EMS setzt Vorgaben um, ggf. über Speicher oder Erzeugung"],
          ],
          minBreite: 720,
          fussnote: "Zusammenfassung; maßgeblich ist der Originaltext der TOR (E-Control) und die Vorgaben des Netzbetreibers. Die TOR begründen laut eigener Anmerkung keine allgemeine Pflicht zur Datenübermittlung an den Netzbetreiber.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "EMS und Parkregler sind nicht dasselbe",
          text: "Der Parkregler (EZA-Regler) setzt die Vorgaben des Netzbetreibers für die Erzeugungsanlage um – Blindleistung, Wirkleistungsbegrenzung, Fernsteuerung – und ist bei größeren Anlagen Teil des Netzanschlusses. Das EMS optimiert den Betrieb hinter dem Zähler. Beide müssen zusammenarbeiten, der Parkregler hat Vorrang. Mehr unter [Parkregler](/technik/parkregler) und im Ratgeber [EZA-Regler und Parkregler](/ratgeber/eza-regler-parkregler).",
        },
      ],
    },
    {
      id: "schnittstellen",
      titel: "Welche Schnittstellen sind wichtig?",
      tocLabel: "Schnittstellen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein EMS ist nur so gut wie die Geräte, die es ansprechen kann – offene, dokumentierte Schnittstellen sind deshalb das wichtigste Auswahlkriterium.** Proprietäre Cloud-Lösungen eines einzelnen Herstellers funktionieren oft gut, binden aber an ein Ökosystem und fallen bei Internetausfall aus.",
        },
        {
          typ: "tabelle",
          caption: "Gängige Schnittstellen und Protokolle im Energiemanagement",
          kopf: ["Schnittstelle", "Einsatz", "Hinweis"],
          zeilen: [
            ["Modbus TCP / RTU", "Wechselrichter, Speicher, Zähler, Wärmepumpen", "weit verbreitet; Registerbelegung je Hersteller"],
            ["SunSpec (Modbus-Profil)", "standardisierte Datenmodelle für Wechselrichter und Speicher", "erleichtert Herstellerwechsel"],
            ["OCPP (1.6 / 2.0.1)", "Ladepunkte zu Backend bzw. Lastmanagement", "in den TOR als Beispiel für ein offenes Protokoll genannt"],
            ["EEBUS", "Kommunikation zwischen Ladepunkten, Wärmepumpen und EMS", "ebenfalls in den TOR genannt"],
            ["SG-Ready", "einfache Schaltsignale für Wärmepumpen (Betriebszustände)", "robust, aber nur grob steuerbar"],
            ["OPC UA / MQTT", "Anbindung an Leittechnik, SCADA und Industrie-IT", "Standard in Produktion und Gebäudeleittechnik"],
            ["KNX / BACnet", "Gebäudeautomation (Licht, Lüftung, Heizung)", "Integration über Gateways"],
          ],
          minBreite: 640,
        },
        {
          typ: "p",
          text: "Für größere Anlagen setzt Ökovolt eigene [SCADA-Systeme](/technik/scada) und [Fernwartung](/technik/fernwartung) ein, die mit Parkregler, Speicher und Ladeinfrastruktur zusammenarbeiten. Die Digitalisierung und IT-Security entwickeln wir gemeinsam mit der Solensa GmbH.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Praxisbeispiel: Wie ein EMS im Betrieb entscheidet",
      tocLabel: "Praxisbeispiel",
      bloecke: [
        {
          typ: "p",
          text: "**Ein EMS arbeitet mit einer Prioritätenliste, die für jede Situation festlegt, wohin der Strom fließt.** Das folgende Beispiel zeigt einen Handwerksbetrieb mit 120 kWp PV, 100 kWh Speicher, sechs Ladepunkten für die Dienstflotte und einer Wärmepumpe.",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: Prioritäten eines EMS über den Tag (vereinfacht)",
          kopf: ["Situation", "Entscheidung des EMS"],
          zeilen: [
            ["7 Uhr, Schichtbeginn, wenig PV", "Ladepunkte auf Mindestleistung, Speicher kappt die Anlaufspitze der Maschinen"],
            ["11 Uhr, hoher Überschuss", "Dienstfahrzeuge mit Überschuss laden, Wärmepumpe lädt Pufferspeicher, Speicher lädt"],
            ["13 Uhr, Speicher voll, weiter Überschuss", "Warmwasser und Kühlzelle auf Vorrat, Rest zum Marktpreis einspeisen"],
            ["13 Uhr, negativer Börsenpreis", "Einspeisung reduzieren, zusätzliche Lasten zuschalten (bei passender Vermarktung)"],
            ["17 Uhr, Fahrzeuge müssen voll sein", "Priorität auf Ladeziel, Netzbezug innerhalb des Leistungslimits"],
            ["Nacht", "Speicher reserviert Energie für die Morgenspitze; bei Spotpreis-Tarif Laden in günstigen Stunden"],
          ],
          minBreite: 600,
        },
        {
          typ: "p",
          text: "Die Regeln wirken simpel, die Kunst liegt in Prognose und Parametrierung: Wie viel Speicher muss für die Morgenspitze reserviert bleiben? Welches Fahrzeug muss bis wann geladen sein? Wie viel Wärme verträgt der Puffer? Gute Systeme lernen aus Lastgang und Wetterprognose und lassen sich vom Betrieb verständlich einstellen. Wie Ladepunkte in der Flotte priorisiert werden, zeigt der Ratgeber [E-Flotte laden mit Photovoltaik](/ratgeber/e-flotte-laden-photovoltaik).",
        },
      ],
    },
    {
      id: "einfuehrung",
      titel: "Einführung in fünf Schritten – und was sie wirtschaftlich bringt",
      tocLabel: "Einführung & Nutzen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein EMS rechnet sich über drei Effekte: mehr Eigenverbrauch, niedrigere Lastspitzen und vermiedene Netzausbaukosten beim Anschluss neuer Ladepunkte oder Wärmepumpen.** Der dritte Effekt wird oft übersehen: Wenn der Netzbetreiber für zusätzliche Leistung ein Netzbereitstellungsentgelt oder einen Anschlussausbau verlangt, kann eine intelligente Begrenzung diese Kosten vermeiden oder verschieben.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Ist-Analyse", "Lastgang, Anschlussleistung, vorhandene Zähler und steuerbare Geräte erfassen; Ziele und Prioritäten mit Geschäftsführung, Technik und Einkauf festlegen."],
            ["Messkonzept", "Zähler am Netzanschlusspunkt und Unterzähler für große Verbraucher (Ladepunkte, Kälte, Wärmepumpe) definieren."],
            ["Systemauswahl", "EMS mit offenen Schnittstellen wählen, TOR-Konformität und Netzbetreiber-Meldung klären, IT-Sicherheit planen."],
            ["Inbetriebnahme", "Grenzwerte, Prioritäten und Reservekapazitäten parametrieren, Funktion unter realen Bedingungen testen."],
            ["Betrieb & Optimierung", "Kennzahlen monatlich auswerten, Parameter anpassen, neue Verbraucher einbinden."],
          ],
        },
        {
          typ: "p",
          text: "Wie hoch der Nutzen ausfällt, hängt stark vom Betrieb ab. Faustregel: Je mehr flexible Verbraucher (Ladepunkte, Kälte, Wärme) und je ausgeprägter die Lastspitzen, desto mehr bringt die Steuerung. Die Wertigkeit einer selbst genutzten Kilowattstunde zeigt der Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen), die Speicherseite [Gewerbespeicher: Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "it-sicherheit",
      titel: "IT-Sicherheit: Worauf Betriebe achten müssen",
      tocLabel: "IT-Sicherheit",
      bloecke: [
        {
          typ: "p",
          text: "**Ein EMS greift in die Energieversorgung ein – ein ungeschützter Fernzugriff ist deshalb ein Betriebsrisiko.** Mit der EU-NIS-2-Richtlinie steigen die Anforderungen an Cybersicherheit für viele Unternehmen, insbesondere im Energiesektor und in kritischen Lieferketten. Ob Ihr Betrieb direkt betroffen ist, klären Sie anhand der österreichischen Umsetzung – gute Praxis ist es in jedem Fall.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Eigenes Netzwerksegment (VLAN) für Energietechnik, keine offenen Ports ins Internet.",
            "Fernzugriff nur über abgesicherte Verbindungen (VPN) mit persönlichen Zugängen und Protokollierung.",
            "Standardpasswörter ändern, Rollen und Rechte vergeben, Zugänge beim Personalwechsel entziehen.",
            "Updates von EMS, Wechselrichtern und Ladepunkten geplant einspielen und dokumentieren.",
            "Lokale Rückfallebene: Bei Ausfall von Internet oder Cloud müssen Anlage und Leistungsbegrenzung sicher weiterlaufen.",
            "Datenhoheit vertraglich regeln: Wem gehören die Mess- und Betriebsdaten, wo werden sie gespeichert?",
          ],
        },
      ],
    },
    {
      id: "auswahl",
      titel: "Checkliste: Das richtige EMS auswählen",
      tocLabel: "Auswahl-Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Welche Ziele hat der Betrieb (Eigenverbrauch, Peak Shaving, Ladepunkte, Spotpreis, Notstrom) – und in welcher Priorität?",
            "Welche Geräte müssen eingebunden werden – heute und in fünf Jahren (Speicher, weitere Ladepunkte, Wärmepumpe)?",
            "Offene Schnittstellen (Modbus/SunSpec, OCPP, EEBUS, SG-Ready, OPC UA) statt reiner Herstellerbindung?",
            "Messung am Netzanschlusspunkt in ausreichender Auflösung und Genauigkeit?",
            "Funktioniert die Leistungsbegrenzung lokal auch ohne Internet?",
            "Erfüllt das Konzept die TOR-Anforderungen und ist es in der Netzbetreiber-Meldung beschrieben?",
            "Wer parametriert, wartet und passt an – und ist das im Wartungsvertrag geregelt?",
            "Reporting für Energieaudit, ISO 50001 oder Nachhaltigkeitsbericht verfügbar?",
          ],
        },
        {
          typ: "p",
          text: "Speicher, Ladeinfrastruktur und EMS planen wir als Gesamtsystem – mehr auf den Seiten [Gewerbespeicher](/gewerbespeicher) und [Ladeinfrastruktur](/ladeinfrastruktur).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was macht ein Energiemanagementsystem?",
      a: "Es misst Erzeugung, Verbrauch und Netzbezug in Echtzeit und steuert Speicher, Ladepunkte, Wärmepumpen und andere Verbraucher so, dass möglichst viel Solarstrom selbst genutzt wird und die Anschlussleistung nicht überschritten wird.",
    },
    {
      q: "Brauche ich für Ladepunkte im Betrieb ein Lastmanagement?",
      a: "Bei mehreren Ladepunkten praktisch immer. Die TOR verlangen für Ladeeinrichtungen über 3,68 kVA eine offene, steuerbare Schnittstelle. Ab 10 kVA Summenleistung kann der Netzbetreiber den Anschluss zur Prüfung aussetzen – außer ein EMS stellt sicher, dass die vereinbarte Leistung eingehalten wird.",
    },
    {
      q: "Welche Schnittstellen sollte ein EMS unterstützen?",
      a: "Mindestens Modbus TCP bzw. SunSpec für Wechselrichter und Speicher, OCPP oder EEBUS für Ladepunkte und SG-Ready oder EEBUS für Wärmepumpen. In Industriebetrieben kommt OPC UA für die Anbindung an Leittechnik hinzu.",
    },
    {
      q: "Kann ein EMS den Leistungspreis senken?",
      a: "Ja, wenn es Lastspitzen erkennt und über Speicher oder Lastabwurf begrenzt. PV allein senkt die Jahresspitze selten, weil sie oft an trüben Wintertagen oder zu Schichtbeginn auftritt.",
    },
    {
      q: "Was ist der Unterschied zwischen EMS und ISO 50001?",
      a: "Das EMS ist Technik, die Energieflüsse steuert. Die ISO 50001 beschreibt ein Managementsystem mit Zielen, Verantwortlichkeiten und kontinuierlicher Verbesserung. Das EMS liefert Daten und setzt Maßnahmen um, ersetzt das Managementsystem aber nicht.",
    },
    {
      q: "Funktioniert ein EMS ohne Internet?",
      a: "Gute Systeme ja: Messung, Leistungsbegrenzung und Grundregeln laufen lokal. Cloud-Funktionen wie Wetterprognose, Spotpreise und Fernzugriff fallen dann aus. Achten Sie bei der Auswahl auf diese Rückfallebene.",
    },
    {
      q: "Kann ein EMS teuren Netzausbau vermeiden?",
      a: "Oft ja. Wenn neue Ladepunkte oder Wärmepumpen die vereinbarte Anschlussleistung überschreiten würden, begrenzt ein EMS die Summenleistung dynamisch. Laut TOR entfällt dann ein Aussetzen des Anschlusses durch den Netzbetreiber, und zusätzliche Netzbereitstellungsentgelte lassen sich häufig vermeiden oder verschieben.",
    },
    {
      q: "Wer stellt das EMS ein und wartet es?",
      a: "Idealerweise der Errichter der Anlage, der PV, Speicher und Ladepunkte kennt. Parametrierung, Updates und Anpassungen bei neuen Verbrauchern sollten im Wartungsvertrag geregelt sein – siehe [Wartungsvertrag](/ratgeber/photovoltaik-wartungsvertrag).",
    },
  ],

  passend: [
    { href: "/technik/scada", titel: "SCADA-Systeme", text: "Leittechnik für größere Anlagen." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Speicher für Eigenverbrauch und Peak Shaving." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving", text: "Leistungspreis senken." },
    { href: "/ratgeber/e-flotte-laden-photovoltaik", titel: "E-Flotte laden", text: "Lastmanagement für Ladepunkte." },
  ],

  quellen: [
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.4", url: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+%287%29.pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", stand: "06/2026" },
    { titel: "E-Control – Übersicht TOR", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
    { titel: "OeMAG – Marktpreise 2026", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "Energy-Charts – Börsenstrompreise und Erzeugung Österreich", url: "https://www.energy-charts.info/?l=de&c=AT", stand: "09/2026" },
    { titel: "OVE – Richtlinie R 37:2024 (Prüfanforderungen an Ladestationen hinsichtlich TOR)", url: "https://www.ove.at/ove-news/details/elektromobilitaet-aktualisierte-und-neue-ove-richtlinien/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Energie im Betrieb steuern?", text: "EMS, Speicher und Ladepunkte als Gesamtsystem.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "PV, Speicher und Ladepunkte, die zusammenarbeiten.",
    text: "Ökovolt plant Energiemanagement mit offenen Schnittstellen, eigenem Parkregler und SCADA – für Gewerbe, Landwirtschaft, Hotellerie und Gemeinden in ganz Österreich.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Technik ansehen", href: "/technik" },
  },
};

export default artikel;
