// Ratgeber: EZA-Regler und Parkregler – Regelung von PV-Anlagen am Netzanschlusspunkt in Österreich
// Recherchestand 28.09.2026: E-Control TOR Stromerzeugungsanlagen Typ A und B, Version 1.3 (Kap. 5.1.3, 5.3.3,
// 5.3.4, 5.3.6, 5.4.1, 6.2.1, 6.2.2, 8.1 und Anhang A3 Ländereinstellungen), ElWG BGBl. I Nr. 91/2025
// (Spitzenkappung, Steuerbarkeit; Zusammenfassungen BMWET, WKO, Energie NÖ), SNE-G-V-Entwurf 07/2026.

const artikel = {
  slug: "eza-regler-parkregler",
  title: "EZA-Regler erklärt: Wirkleistungsstufen, cos φ(P) und Q(U) am Netzanschluss",
  seoTitle: "EZA-Regler erklärt: Q(U), cos φ(P), Wirkleistung | Ökovolt",
  kurzTitel: "EZA-Regler & Parkregler",
  description:
    "EZA-Regler erklärt: wann der Netzbetreiber ihn verlangt, Wirkleistungsstufen, cos φ(P) und Q(U), Fernwirktechnik, Auswahl und Nachweise zur Inbetriebnahme.",
  excerpt:
    "Ab einer bestimmten Größe reicht es nicht, jeden Wechselrichter einzeln einzustellen: Ein Park- bzw. EZA-Regler führt Wirk- und Blindleistung am Netzanschlusspunkt. Wann er Pflicht ist, welche Funktionen er braucht und wie der Nachweis läuft.",
  hauptKeyword: "eza regler",
  keywords: [
    "Parkregler Photovoltaik",
    "EZA-Regler",
    "Q(U)-Regelung",
    "cos phi P Kennlinie",
    "Wirkleistungsbegrenzung PV",
    "Einspeisebegrenzung Netzanschlusspunkt",
    "Fernwirktechnik IEC 60870-5-104",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-30",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/eza-regler-parkregler.jpg",
  bildAlt: "Wechselrichter und DC-Überspannungsschutz einer PV-Anlage an einer Schule in Vorarlberg",
  badge: { wert: "1 Minute", text: "bis der Sollwert an der Messstelle erreicht sein muss (Typ B)" },

  kurzFazit: [
    "**Ein EZA-Regler (Erzeugungsanlagen-Regler) oder Parkregler misst Spannung, Wirk- und Blindleistung am Netzanschlusspunkt und steuert alle Wechselrichter so, dass die Vorgaben des Netzbetreibers dort eingehalten werden.** Einzelne Wechselrichter sehen nur ihre eigenen Klemmen – der Regler sieht die ganze Anlage.",
    "Laut TOR kann der Netzbetreiber im Mittelspannungsnetz einen **Park- und Anlagenregler** verlangen: mit Mittelspannungsmessung ab einer Summe der Engpassleistungen von **über 100 kVA**, ohne Mittelspannungsmessung ab **über 400 kVA**.",
    "Kernfunktionen: Wirkleistungsbegrenzung in Stufen (z. B. **100/60/30/0 %**) innerhalb **einer Minute**, Blindleistung nach **cos φ fix, cos φ(P), Q(U) oder Q fix**, Einspeisebegrenzung auf die netzwirksame Leistung und ab **1 MW** Online-Sollwerte über **IEC 60870-5-104** oder Modbus mit **30 Minuten** Notstromversorgung der Kommunikation.",
    "Mit dem ElWG wird der Regler noch wichtiger: Ab 2027 dürfen Netzbetreiber neue PV-Anlagen auf **70 %** der Modulspitzenleistung begrenzen, und flexible Netzanschlüsse setzen eine zuverlässige Leistungsbegrenzung voraus.",
    "Den eigenen Parkregler von Ökovolt – Funktionen, Schnittstellen und Einsatz – stellt die Seite [Ökovolt Parkregler](/technik/parkregler) vor; dieser Ratgeber erklärt die Regelungstechnik herstellerneutral.",
  ],

  abschnitte: [
    {
      id: "was",
      titel: "Was ist ein EZA-Regler bzw. Parkregler?",
      tocLabel: "Was ist ein EZA-Regler?",
      bloecke: [
        {
          typ: "p",
          text: "**Ein EZA-Regler ist die übergeordnete Regelung einer Erzeugungsanlage: Er vergleicht Messwerte am Netzanschlusspunkt mit den Sollwerten des Netzbetreibers und gibt jedem Wechselrichter die passende Wirk- und Blindleistung vor.** In Österreich spricht die TOR von „Park- und Anlagenregler“; in der Praxis sind auch „Parkregler“, „Power Plant Controller“ oder „Energiemanager“ gebräuchlich. Im Lexikon: [EZA-Regler](/wissen/lexikon#eza-regler).",
        },
        {
          typ: "p",
          text: "Warum reicht die Einstellung am Wechselrichter nicht? Weil die Anforderungen für den Netzanschlusspunkt gelten. Zwischen Wechselrichtern und Übergabestelle liegen Kabel, eventuell ein Transformator und Verbraucher des Betriebs. Ein Wechselrichter mit cos φ = 0,95 erzeugt an der Mittelspannungsseite eines Trafos nicht automatisch denselben Verschiebungsfaktor, und eine Einspeisebegrenzung auf 200 kW lässt sich nur einhalten, wenn jemand den aktuellen Verbrauch des Betriebs kennt. Genau das leistet der Regler. Er ist damit das Bindeglied zwischen den Anforderungen der [TOR Erzeuger](/ratgeber/tor-erzeuger-netzanschluss) und den einzelnen Geräten der Anlage – und bei Freiflächen- und Gewerbeanlagen im Mittelspannungsnetz meist Voraussetzung für die Freigabe durch den Netzbetreiber.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Messen", text: "Spannung, Strom, Wirk- und Blindleistung am Netzanschlusspunkt – je nach Anlage auf Mittel- oder Niederspannungsseite." },
            { titel: "Regeln", text: "Kennlinien und Sollwerte für Wirk- und Blindleistung berechnen, Grenzwerte und Rampen einhalten, Speicher und Verbraucher einbeziehen." },
            { titel: "Kommunizieren", text: "Sollwerte vom Netzbetreiber empfangen (Kontakte, IEC 60870-5-104, Modbus), Istwerte zurückmelden, an Monitoring und SCADA anbinden." },
          ],
        },
      ],
    },
    {
      id: "pflicht",
      titel: "Wann ist ein Parkregler Pflicht?",
      tocLabel: "Wann Pflicht?",
      bloecke: [
        {
          typ: "p",
          text: "**Einen Park- und Anlagenregler verlangt der Netzbetreiber im Anschlusskonzept, wenn die Messwerte für die Blindleistungsbereitstellung auf der Mittelspannungsseite abgegriffen werden müssen.** Die TOR Stromerzeugungsanlagen (Typ A und B) nennen dafür zwei Fälle bei Anlagen auf Netzebene 5 und 6:",
        },
        {
          typ: "tabelle",
          caption: "Wann die TOR einen Park- und Anlagenregler vorsehen (Netzebene 5 und 6)",
          kopf: ["Situation", "Schwelle (Summe der Engpassleistungen am Netzanschlusspunkt)", "Folge"],
          zeilen: [
            ["Mittelspannungsmessung vorhanden", "über 100 kVA", "Park- und Anlagenregler erforderlich"],
            ["keine Mittelspannungsmessung", "über 400 kVA", "Park- und Anlagenregler erforderlich"],
            ["alle anderen Anlagen auf NE 5/6", "–", "Messung auf der Niederspannungsseite möglich; Trafostufe vertraglich festlegen"],
            ["Anlagen ab 1 MW", "Maximalkapazität", "Online-Sollwertvorgabe und Umschaltung der Verfahren über Fernwirkschnittstelle möglich"],
          ],
          minBreite: 680,
          fussnote: "Quelle: TOR Stromerzeugungsanlagen Typ A/B, Version 1.3, Kap. 5.3.4. Führt die Anforderung zu unverhältnismäßigem Aufwand, kann in Abstimmung mit dem Netzbetreiber bis 400 kVA abgewichen werden.",
        },
        {
          typ: "p",
          text: "Unabhängig von der TOR-Pflicht ist ein Regler immer dann nötig, wenn die netzwirksame Leistung kleiner vereinbart wird als die installierte Leistung – etwa bei Einspeisebegrenzung, Nulleinspeisung, flexiblem Netzzugang oder der [Spitzenkappung](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz) nach ElWG. Auch Betriebe mit Speicher, Ladeinfrastruktur und mehreren Wechselrichtermarken profitieren von einer zentralen Regelung.",
        },
      ],
    },
    {
      id: "wirkleistung",
      titel: "Wirkleistung: Stufen, Begrenzung und Rampen",
      tocLabel: "Wirkleistung",
      bloecke: [
        {
          typ: "p",
          text: "**Jede Stromerzeugungsanlage muss eine Schnittstelle haben, über die der Netzbetreiber die Wirkleistung verringern kann; ab Typ B erfolgt das in bis zu vier Stufen innerhalb vorgegebener Zeiten.** Die TOR-Werte im Überblick:",
        },
        {
          typ: "liste",
          punkte: [
            "**Typ A:** Einspeisung muss über einen Eingangsport binnen 5 Sekunden beendet werden können; der Netzbetreiber gibt nur das Signal, die Umsetzung liegt beim Betreiber.",
            "**Typ B unter 1 MW:** Sollwerte als maximale Wirkleistung im Verhältnis zur Maximalkapazität, in höchstens vier Stufen (z. B. 100 %, 60 %, 30 %, 0 %), meist über potentialfreie Kontakte am Fernwirkgerät des Netzbetreibers.",
            "**Reaktionszeit:** Sollwert binnen 5 Minuten, bei reinen Umrichteranlagen binnen 1 Minute; wird er nicht erreicht, ist die Anlage abzuschalten.",
            "**Ab 1 MW:** Online-Sollwertvorgabe über einen gängigen Standard (IEC 60870-5-101/104, Modbus RTU/TCP) nach Wahl des Netzbetreibers.",
            "**Rampen:** Nach automatischer Wiederzuschaltung darf die Leistung höchstens um 10 % der Maximalkapazität pro Minute steigen; empfohlene Wartezeit 60 Sekunden.",
            "**Überfrequenz (LFSM-O):** Reduktion ab 50,2 Hz mit 5 % Statik als Standard, Anschwingzeit unter 2 Sekunden – diese Funktion liegt meist direkt im Wechselrichter.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Einspeisebegrenzung mit Eigenverbrauch kombinieren",
          text: "Ein Regler, der den Verbrauch des Betriebs kennt, begrenzt nicht die Erzeugung, sondern nur die Einspeisung. Eine 500-kWp-Anlage mit 250 kW netzwirksamer Leistung verliert dann nur in den Stunden Ertrag, in denen Erzeugung minus Verbrauch 250 kW übersteigt. Ein Speicher kann diese Spitzen zusätzlich aufnehmen – siehe [Gewerbespeicher](/gewerbespeicher).",
        },
      ],
    },
    {
      id: "blindleistung",
      titel: "Blindleistung: cos φ fix, cos φ(P) und Q(U)",
      tocLabel: "Blindleistung",
      bloecke: [
        {
          typ: "p",
          text: "**Mit der Blindleistung stützt eine PV-Anlage die Spannung im Netz; welches Verfahren gilt, legt der Netzbetreiber im Anschlusskonzept fest.** Zur Auswahl stehen ein fester Verschiebungsfaktor (cos φ fix), eine Kennlinie abhängig von der Wirkleistung (cos φ(P)), eine Kennlinie abhängig von der Spannung (Q(U)) und eine feste Blindleistung (Q fix). Ohne Vorgabe gilt cos φ = 1 bzw. Q = 0. Mehr zur Q(U)-Regelung im [Lexikon](/wissen/lexikon#q-u-regelung).",
        },
        {
          typ: "tabelle",
          caption: "Standardkennlinien der TOR Stromerzeugungsanlagen (Ländereinstellung Österreich), Version 1.3",
          kopf: ["Verfahren", "Stützpunkte (Standard)", "Dynamik"],
          zeilen: [
            ["cos φ(P)", "P/PEmax = 0 → cos φ 1; 0,5 → cos φ 1; 1,0 → cos φ 0,9 untererregt", "nach Vorgabe"],
            ["Q(U)", "0,92 Un → Qmax übererregt; 0,96 Un → 0; 1,05 Un → 0; 1,08 Un → Qmax untererregt; Qmax/Pmax = 0,436 (bis 3,68 kVA: 0,312)", "PT1-Filter, Zeitkonstante 3–60 s, Standard 5 s; 95 % in drei Zeitkonstanten; Anlaufverzögerung max. 1 s"],
            ["P(U)", "110 % Un → 100 % Pn; 112 % Un → 0 %", "PT1-Filter, Standard 5 s; Anlaufverzögerung max. 3 s"],
            ["Blindleistungsbereich (Typ B)", "Bereich II: Q/Pmax −0,411 bis +0,411 (cos φ 0,925 unter- bis übererregt)", "Sollwerte spätestens nach 1 min an der Messstelle"],
          ],
          minBreite: 760,
          fussnote: "Quelle: TOR Stromerzeugungsanlagen Typ B, Kap. 5.3.3, 5.3.4, 5.3.6 und Anhang A3. Die Stützpunkte müssen frei parametrierbar sein; Netzbetreiber können abweichende Werte vorgeben und das Verfahren später ändern (Umsetzung binnen 12 Monaten).",
        },
        {
          typ: "p",
          text: "Wird am Mittelspannungsnetz gemessen, rechnet der Regler die Wechselrichter-Sollwerte so um, dass die Vorgabe an der Übergabestelle stimmt – inklusive Trafo-Blindleistungsbedarf. Wird auf der Niederspannungsseite gemessen, muss die Trafostufenstellung vertraglich fixiert sein, damit die Kennlinien auf die Mittelspannung bezogen werden können. Der Netzbetreiber kann außerdem feste Blindleistungsstufen (z. B. 100/60/30/0 %) über die Fernwirkschnittstelle vorgeben.",
        },
      ],
    },
    {
      id: "kommunikation",
      titel: "Fernwirktechnik und Kommunikation",
      tocLabel: "Fernwirktechnik",
      bloecke: [
        {
          typ: "p",
          text: "**Die Schnittstelle zum Netzbetreiber ist unter 1 MW meist ein Satz potentialfreier Kontakte, ab 1 MW eine Protokollverbindung nach IEC 60870-5-104, IEC 60870-5-101 oder Modbus.** Welche Variante gilt, steht im Netzanschlussvertrag. Anlagen mit Online-Sollwertvorgabe müssen ihre Kommunikation bei Ausfall der externen Versorgung mindestens 30 Minuten aufrechterhalten; signifikante Netznutzer im Sinne des Netzkodex für Notzustand und Netzwiederaufbau sogar 24 Stunden.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Fernwirkgerät bzw. Rundsteuerempfänger des Netzbetreibers: Platz und Versorgung im Schaltschrank vorsehen",
            "Signalliste mit dem Netzbetreiber abstimmen (Sollwerte, Rückmeldungen, Messwerte, Störmeldungen)",
            "USV für Regler, Router und Fernwirktechnik (mindestens 30 Minuten bei Online-Sollwerten)",
            "IT-Sicherheit: getrennte Netze, Zugriffsschutz, Passwortschutz der Wechselrichtereinstellungen",
            "Anbindung an Monitoring und SCADA, damit Abregelungen dokumentiert und nachvollziehbar sind",
          ],
        },
        {
          typ: "p",
          text: "Bei Wechselrichtern im Niederspannungsnetz verlangt die TOR, dass Einstellungen vom Betreiber nicht verändert werden können und auch Softwareupdates sie nicht überschreiben – etwa durch einen Passwortschutz, dessen Passwort dem Nutzer nicht mitgeteilt wird. Unsere eigenen Systeme für [Fernwartung](/technik/fernwartung) und [SCADA](/technik/scada) sind darauf ausgelegt, Regelung, Monitoring und Dokumentation zusammenzuführen.",
        },
      ],
    },
    {
      id: "auswahl",
      titel: "Worauf es bei der Auswahl eines Parkreglers ankommt",
      tocLabel: "Auswahl",
      bloecke: [
        {
          typ: "p",
          text: "**Ein guter Parkregler ist herstellerunabhängig, schnell genug für die TOR-Reaktionszeiten und so dokumentiert, dass der Netzbetreiber die Funktion nachvollziehen kann.** Bei der Auswahl helfen folgende Fragen:",
        },
        {
          typ: "checkliste",
          punkte: [
            "Unterstützt der Regler alle vier Blindleistungsverfahren (cos φ fix, cos φ(P), Q(U), Q fix) mit frei parametrierbaren Stützpunkten und Umschaltung per Fernwirksignal?",
            "Kann er Wechselrichter verschiedener Hersteller, Speicher und steuerbare Verbraucher gemeinsam ansteuern?",
            "Werden Sollwerte zuverlässig innerhalb einer Minute an der Messstelle erreicht – auch bei Ausfall einzelner Wechselrichter?",
            "Welche Protokolle zum Netzbetreiber stehen zur Verfügung (Kontakte, IEC 60870-5-104, Modbus) und welche zum Monitoring?",
            "Gibt es eine lückenlose Aufzeichnung von Sollwerten, Istwerten und Abregelungen für Nachweise und Ertragsabrechnung?",
            "Wer betreut den Regler im Betrieb – Parameteränderungen, Updates, Störungen?",
          ],
        },
        {
          typ: "p",
          text: "Häufige Fehler in der Praxis: Messwandler an der falschen Stelle, nicht abgestimmte Signallisten, fehlende USV für die Kommunikation und Wechselrichter, deren Einstellungen nach einem Update zurückgesetzt werden. Grundlagen zu Verschiebungsfaktor und [Blindleistung](/wissen/lexikon#blindleistung) sowie zur Auswahl der Wechselrichter liefern das Lexikon und der Ratgeber [Wechselrichter für Photovoltaik](/ratgeber/wechselrichter-photovoltaik). Den Gesamtablauf vom Antrag bis zur Freigabe beschreibt [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
        },
      ],
    },
    {
      id: "nachweise",
      titel: "Inbetriebnahme und Nachweise",
      tocLabel: "Nachweise",
      bloecke: [
        {
          typ: "p",
          text: "**Die Regelung ist Teil des Konformitätsnachweises: Der Netzbetreiber kann bei der Inbetriebnahme die Blindleistungs- und Spannungsregelung prüfen und Parameterauszüge verlangen.** Ein strukturierter Ablauf vermeidet Nachtermine:",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Regelungskonzept abstimmen", "Messpunkt, Verfahren zur Blindleistung, Kennlinien, Sollwertstufen, netzwirksame Leistung und Kommunikationsweg mit dem Netzbetreiber festlegen."],
            ["Parametrieren", "Wechselrichter auf Ländereinstellung „Österreich“, Regler auf die Werte des Anschlusskonzepts; Einstellungen gegen Veränderung schützen."],
            ["Funktionstest", "Sollwertstufen, Blindleistungsvorgaben und Einspeisebegrenzung testen; Reaktionszeiten dokumentieren."],
            ["Nachweise einreichen", "Konformitätserklärung, Prüfbericht des Netzentkupplungsschutzes, maschinenlesbarer Parameterauszug, auf Anforderung Prüfberichte nach OVE-Richtlinie R 25 bzw. Tests nach RKS-AT."],
            ["Gemeinsame Prüfung", "Bei Bedarf Prüfung von Schutz, Zuschaltbedingungen und Regelung im Beisein des Netzbetreibers."],
            ["Betrieb überwachen", "Abregelungen, Blindleistung und Spannung laufend aufzeichnen; Änderungen nur in Abstimmung mit dem Netzbetreiber."],
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Spitzenkappung und Steuerbarkeit nach ElWG",
          text: "Ab 1. 1. 2027 dürfen Netzbetreiber die Einspeisung neuer oder erweiterter PV-Anlagen über 7 kW netzwirksamer Leistung auf bis zu 70 % der Modulspitzenleistung begrenzen – ohne Entschädigung; ab 2028 ist eine dynamische, netzzustandsabhängige Variante geplant. Neue Anlagen ab 3,68 kW müssen steuerbar sein. Laut Bundesministerium werden bei südorientierten Anlagen weniger als 1 von 100 kWh abgeregelt, bei Ost-West-Anlagen wird die 70-%-Marke kaum erreicht. Ein Regler mit Speicher- und Verbrauchereinbindung kann den Verlust weiter senken. Quellen: BMWET, Energie NÖ.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist der Unterschied zwischen Wechselrichter-Einstellung und Parkregler?",
      a: "Der Wechselrichter regelt nur an seinen eigenen Klemmen. Der Parkregler misst am Netzanschlusspunkt und gibt allen Wechselrichtern Sollwerte vor, sodass die Vorgaben des Netzbetreibers an der Übergabestelle eingehalten werden – inklusive Trafo, Leitungen, Verbraucher und Speicher.",
    },
    {
      q: "Ab welcher Anlagengröße brauche ich einen Parkregler?",
      a: "Laut TOR kann der Netzbetreiber im Mittelspannungsnetz einen Park- und Anlagenregler verlangen, wenn die Summe der Engpassleistungen mit Mittelspannungsmessung über 100 kVA bzw. ohne Mittelspannungsmessung über 400 kVA liegt. Unabhängig davon ist ein Regler nötig, wenn eine Einspeisebegrenzung einzuhalten ist.",
    },
    {
      q: "Was bedeutet Q(U)-Regelung?",
      a: "Die Anlage stellt Blindleistung abhängig von der gemessenen Spannung bereit: bei hoher Spannung untererregt (spannungssenkend), bei niedriger übererregt. Standard sind Stützpunkte bei 0,92, 0,96, 1,05 und 1,08 Un und eine Zeitkonstante von 5 Sekunden.",
    },
    {
      q: "Wie schnell muss eine PV-Anlage eine Leistungsvorgabe umsetzen?",
      a: "Typ-B-Anlagen mit Umrichtern müssen einen Wirkleistungssollwert binnen einer Minute erreichen, sonst sind sie abzuschalten. Typ-A-Anlagen müssen die Einspeisung über einen Eingangsport binnen fünf Sekunden beenden können.",
    },
    {
      q: "Welche Protokolle nutzen österreichische Netzbetreiber?",
      a: "Unter 1 MW meist potentialfreie Kontakte an einem Fernwirkgerät oder Rundsteuerempfänger. Ab 1 MW gibt der Netzbetreiber ein Protokoll wie IEC 60870-5-104, IEC 60870-5-101 oder Modbus RTU/TCP vor.",
    },
    {
      q: "Hilft ein Parkregler bei der Spitzenkappung?",
      a: "Ja. Er begrenzt die Einspeisung am Netzanschlusspunkt genau auf den erlaubten Wert und kann gleichzeitig Eigenverbrauch und Speicher nutzen, sodass möglichst wenig Erzeugung verloren geht.",
    },
  ],

  howTo: {
    name: "Parkregler für eine PV-Anlage in Betrieb nehmen",
    schritte: [
      { name: "Regelungskonzept abstimmen", text: "Messpunkt, Blindleistungsverfahren, Kennlinien, Sollwertstufen und Kommunikation mit dem Netzbetreiber festlegen." },
      { name: "Hardware installieren", text: "Messwandler, Regler, Fernwirkgerät und USV einbauen und mit den Wechselrichtern verbinden." },
      { name: "Parametrieren", text: "Wechselrichter und Regler nach Anschlusskonzept einstellen und gegen Änderungen schützen." },
      { name: "Funktion testen", text: "Sollwertstufen, Blindleistung und Einspeisebegrenzung prüfen und Reaktionszeiten dokumentieren." },
      { name: "Nachweise einreichen", text: "Konformitätserklärung, Schutzprüfbericht und Parameterauszug an den Netzbetreiber übermitteln." },
    ],
  },

  passend: [
    { href: "/technik/parkregler", titel: "Ökovolt Parkregler", text: "EZA-Regler für österreichische Netzbetreiber." },
    { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "TOR Erzeuger & Netzanschluss", text: "Typ A bis D und Anschlusskonzept." },
    { href: "/technik/scada", titel: "SCADA", text: "Überwachung und Steuerung großer Anlagen." },
    { href: "/technik/fernwartung", titel: "Fernwartung", text: "Störungen erkennen, bevor Ertrag verloren geht." },
  ],

  quellen: [
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ B, Version 1.3 (inkl. Anhang A3)", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", stand: "07/2024" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.3", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.3.pdf/ff57fdfb-99ec-7442-36f2-6de5f17601ad?t=1718018782590", stand: "07/2024" },
    { titel: "BMWET – Spitzenkappung: ein kleiner Verlust für PV-Einspeiser (ElWG-Factsheet)", url: "https://www.bmwet.gv.at/Services/Infos-FAQ/elwg-infos/spitzenkappung.html", stand: "2026" },
    { titel: "Energie in Niederösterreich – Das neue Elektrizitätswirtschaftsgesetz: Was sich ändert", url: "https://www.energie-noe.at/elektrizitaetswirtschaftsgesetz", stand: "2026" },
    { titel: "WKO – Information zum finalen Elektrizitätswirtschaftsgesetz", url: "https://www.wko.at/noe/transport-verkehr/spedition-logistik/elwg", stand: "09/2026" },
    { titel: "Oesterreichs Energie – Erläuterungsdokument NC RfG / TOR Erzeuger", url: "https://oesterreichsenergie.at/publikationen/ueberblick/detailseite/erlaeuterungen-zur-tor-umsetzung", stand: "04/2023" },
  ],

  seitenCta: { titel: "Parkregler gefordert?", text: "Unser EZA-Regler ist für österreichische Netzbetreiber entwickelt.", href: "/technik/parkregler", label: "Zum Parkregler" },
  cta: {
    title: "Regelung, Fernwirktechnik und Nachweise aus einer Hand.",
    text: "Ökovolt Solartechnik setzt bei Gewerbe- und Freiflächenanlagen den eigenen Parkregler ein – abgestimmt auf die TOR und die Vorgaben Ihres Netzbetreibers.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Parkregler ansehen", href: "/technik/parkregler" },
  },
};

export default artikel;
