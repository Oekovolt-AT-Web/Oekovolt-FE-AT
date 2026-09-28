// Ratgeber: TOR Erzeuger und Netzanschluss – Typ A/B/C/D, Netzebenen, Netzverträglichkeitsprüfung
// Recherchestand 28.09.2026: E-Control TOR Stromerzeugungsanlagen Typ A und Typ B, Version 1.3 (gültig ab 01.07.2024),
// Schwellenwerte laut RfG Schwellenwert-V (Typ A ≥ 0,8 kW, B ≥ 250 kW, C ≥ 35 MW, D ≥ 50 MW oder ≥ 110 kV),
// ElWG BGBl. I Nr. 91/2025 (WKO, PV Austria), SNE-G-V-Entwurf 07/2026 (§§ 14–18 Netzanschlussentgelt).

const artikel = {
  slug: "tor-erzeuger-netzanschluss",
  title: "TOR Erzeuger: Netzanschluss von PV-Anlagen nach Typ A, B, C und D",
  seoTitle: "TOR Erzeuger: PV-Netzanschluss Typ A–D | Ökovolt",
  kurzTitel: "TOR Erzeuger & Netzanschluss",
  description:
    "TOR Erzeuger erklärt: Typ A bis D, Netzebenen, Anschlusskonzept, Blindleistung, FRT und Fernsteuerung – was PV-Anlagen beim Netzanschluss erfüllen müssen.",
  excerpt:
    "Welche technischen Regeln für den Netzanschluss gelten, hängt von der Maximalkapazität ab: Typ A ab 0,8 kW, Typ B ab 250 kW. Was die TOR Stromerzeugungsanlagen verlangen, wie der Netzbetreiber prüft und was das ElWG ab 2027 ändert.",
  hauptKeyword: "tor erzeuger",
  keywords: [
    "TOR Erzeuger",
    "TOR Stromerzeugungsanlagen Typ B",
    "Netzanschluss PV Österreich",
    "Netzebene Photovoltaik",
    "RfG Schwellenwert Typ A B C D",
    "Netzverträglichkeitsprüfung PV",
    "Anschlusskonzept Netzbetreiber",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/tor-erzeuger-netzanschluss.jpg",
  bildAlt: "Umspannwerk mit Hochspannungsschaltanlagen in Kärnten",
  badge: { wert: "250 kW", text: "ab dieser Maximalkapazität gilt eine PV-Anlage als Typ B" },

  kurzFazit: [
    "**Die TOR Erzeuger – heute „TOR Stromerzeugungsanlagen“ der E-Control – legen fest, welche technischen Anforderungen eine Erzeugungsanlage für den Netzanschluss in Österreich erfüllen muss.** Sie setzen den EU-Netzkodex für Stromerzeuger (RfG, Verordnung (EU) 2016/631) national um; gültig ist Version 1.3 seit 1. Juli 2024.",
    "Die Einteilung erfolgt nach Maximalkapazität: **Typ A** ab 0,8 kW, **Typ B** ab 250 kW, **Typ C** ab 35 MW, **Typ D** ab 50 MW oder bei Anschluss ab 110 kV.",
    "Ab Typ B kommen **FRT-Fähigkeit**, Wirkleistungsvorgabe in Stufen (z. B. 100/60/30/0 %) innerhalb **einer Minute** und – ab **1 MW** – Online-Sollwerte über eine Fernwirkschnittstelle mit **30 Minuten** Notstromversorgung hinzu.",
    "Den Netzanschlusspunkt, die Netzebene und die netzwirksame Leistung legt der Netzbetreiber im **Anschlusskonzept** fest; es gilt mindestens **sechs Monate**. Ab 2027 kommen ElWG-Regeln wie Spitzenkappung und neues Netzanschlussentgelt hinzu.",
  ],

  abschnitte: [
    {
      id: "was",
      titel: "Was sind die TOR Erzeuger?",
      tocLabel: "Was sind die TOR?",
      bloecke: [
        {
          typ: "p",
          text: "**Die TOR (Technische und organisatorische Regeln für Betreiber und Benutzer von Netzen) sind das technische Regelwerk der E-Control für den Netzbetrieb in Österreich; der Teil „Stromerzeugungsanlagen“ regelt Anschluss und Parallelbetrieb von Erzeugungsanlagen.** Er ersetzte 2019 die frühere TOR D4 und setzt die EU-Verordnung „Requirements for Generators“ (RfG) um. Für Anlagen, die nicht unter die RfG fallen, gelten ergänzend die Vorgaben der Netzbetreiber und – bei Niederspannung – die TAEV. Im Lexikon: [TOR Erzeuger](/wissen/lexikon#tor-erzeuger).",
        },
        {
          typ: "p",
          text: "Die TOR gelten für neue Anlagen und für wesentliche Änderungen bestehender Anlagen. Sie definieren, wie sich eine Anlage bei Frequenz- und Spannungsabweichungen verhalten muss, welche Blindleistung sie bereitstellen muss, wie der Netzbetreiber die Wirkleistung begrenzen kann, welche Schutzeinrichtungen nötig sind und wie die Konformität nachgewiesen wird. Speicher werden in ihrer Gesamtwirkung mit der Erzeugungsanlage betrachtet.",
        },
      ],
    },
    {
      id: "typen",
      titel: "Typ A, B, C, D: Welche Anlage fällt in welche Klasse?",
      tocLabel: "Typ A bis D",
      bloecke: [
        {
          typ: "p",
          text: "**Die Einteilung in Typ A bis D richtet sich nach der Maximalkapazität der Anlage und der Spannung am Netzanschlusspunkt – nicht nach der netzwirksamen Leistung.** Mehrere Erzeugungseinheiten hinter einem gemeinsamen Netzanschlusspunkt gelten als eine Anlage; eine gezielte eigentumsrechtliche Aufteilung darf die Typeinteilung laut TOR nicht unterlaufen.",
        },
        {
          typ: "tabelle",
          caption: "Typen von Stromerzeugungsanlagen nach RfG Schwellenwert-V und TOR, Stand September 2026",
          kopf: ["Typ", "Maximalkapazität", "Netzanschluss", "Typische PV-Anlagen", "Kernanforderungen (Auszug)"],
          zeilen: [
            ["Kleinsterzeugung", "unter 0,8 kW", "Niederspannung", "Balkonkraftwerk", "vereinfachte Regeln"],
            ["Typ A", "0,8 kW bis unter 250 kW", "unter 110 kV", "Einfamilienhaus bis mittelgroßes Gewerbedach", "Frequenzbereiche, LFSM-O, Abschaltung über Eingangsport binnen 5 s, Blindleistungsverfahren"],
            ["Typ B", "250 kW bis unter 35 MW", "unter 110 kV", "große Hallendächer, Freiflächen, Solarparks", "zusätzlich FRT, Wirkleistungsvorgabe in Stufen, Blindleistungsbereich, Fernwirktechnik, Simulationsparameter auf Anforderung"],
            ["Typ C", "35 MW bis unter 50 MW", "unter 110 kV", "sehr große Solarparks", "zusätzlich u. a. frequenzabhängiger Modus, erweiterte Regelung und Modelle"],
            ["Typ D", "ab 50 MW oder Anschluss ab 110 kV", "Hochspannung", "Großkraftwerke, Parks am Übertragungsnetz", "vollständige RfG-Anforderungen, Abstimmung mit dem Übertragungsnetzbetreiber"],
          ],
          minBreite: 860,
          fussnote: "Quelle: E-Control, TOR Stromerzeugungsanlagen Typ A und B, Version 1.3. Die Maximalkapazität entspricht in der Regel der Netto-Engpassleistung bzw. Bemessungsleistung der Gesamtanordnung aus Erzeugung und Speicher.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Maximalkapazität und netzwirksame Leistung unterscheiden",
          text: "Eine Anlage mit 400 kW Wechselrichterleistung ist Typ B, auch wenn der Netzanschlussvertrag nur 200 kW Einspeisung erlaubt. Die netzwirksame Leistung bestimmt Netzebene, Netzanschlussentgelt und Regelungskonzept, die Maximalkapazität den Anforderungskatalog. Wer knapp über 250 kW plant, sollte den Mehraufwand für Typ B einpreisen.",
        },
      ],
    },
    {
      id: "netzebenen",
      titel: "Netzebenen: Wo wird eine PV-Anlage angeschlossen?",
      tocLabel: "Netzebenen",
      bloecke: [
        {
          typ: "p",
          text: "**Das österreichische Stromnetz ist in sieben Netzebenen gegliedert; PV-Anlagen werden je nach Größe und Netzsituation an Netzebene 7 (Niederspannung) bis Netzebene 3 (110 kV) angeschlossen.** Eine feste Leistungsgrenze je Ebene gibt es nicht: Laut TOR hängt die maximale Leistung von den Netzverhältnissen ab, insbesondere von der Kurzschlussleistung und dem Betriebskonzept. Mehr zu den Ebenen im [Lexikon](/wissen/lexikon#netzebene).",
        },
        {
          typ: "tabelle",
          caption: "Netzebenen in Österreich und ihre Bedeutung für PV-Anlagen",
          kopf: ["Netzebene", "Spannung / Anlage", "Bedeutung für PV"],
          zeilen: [
            ["7", "Niederspannung 400/230 V", "Haushalte, Landwirtschaft, kleinere Betriebe; Grenze meist durch Leitung und Trafo bestimmt"],
            ["6", "Umspannung Mittel- auf Niederspannung (Trafostation des Netzbetreibers)", "größere Gewerbeanlagen mit Anschluss direkt an der Trafostation"],
            ["5", "Mittelspannung (z. B. 10–30 kV)", "Betriebe mit eigener Trafostation, große Dachanlagen, Freiflächen; Park- und Anlagenregler möglich"],
            ["4", "Umspannung Hoch- auf Mittelspannung (Umspannwerk)", "große Freiflächen und Solarparks, Anschluss an der Mittelspannungs-Sammelschiene"],
            ["3", "Hochspannung 110 kV", "sehr große Parks; Typ D ab 110 kV"],
            ["1–2", "Höchstspannung und Umspannung (APG)", "Übertragungsnetz"],
          ],
          minBreite: 700,
        },
        {
          typ: "p",
          text: "Netzbetreiber veröffentlichen verfügbare Anschlusskapazitäten; laut ElWG für Netzebene 4 bereits heute und für Netzebene 6 innerhalb von drei Jahren. Die Plattform ebUtilities bündelt die Kapazitätsangaben der Netzbetreiber. Wie Netzebene und Energiegemeinschaften zusammenhängen, erklärt [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden).",
        },
      ],
    },
    {
      id: "pruefung",
      titel: "Wie prüft der Netzbetreiber den Anschluss?",
      tocLabel: "Netzprüfung",
      bloecke: [
        {
          typ: "p",
          text: "**Auf Basis des vollständigen Netzanschlussantrags beurteilt der Netzbetreiber die Netzrückwirkungen und erstellt ein Anschlusskonzept oder ein Angebot.** Grundlage ist die TOR D2 „Richtlinie zur Beurteilung von Netzrückwirkungen“. Geprüft werden unter anderem Spannungsanhebung, Kurzschlussleistung, Oberschwingungen, Unsymmetrie und Auswirkungen auf Rundsteueranlagen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Anschlusskonzept:** enthält Anschlussanlage, technisch geeigneten Anschlusspunkt (Netzebene), Zählpunktbezeichnung, Netzanschlusspunkt, Maximalkapazität, netzwirksame Leistung, Verknüpfungspunkt, zulässige Netzrückwirkungen, Nennspannung, in Mittel- und Hochspannung die minimale und maximale Kurzschlussleistung sowie das Verfahren zur Blindleistungsbereitstellung.",
            "**Gültigkeit:** mindestens sechs Monate, unter Berücksichtigung der voraussichtlichen Genehmigungsdauer.",
            "**Alternativen:** Kann die beantragte Leistung nicht vollständig eingespeist werden, schlägt der Netzbetreiber die mögliche netzwirksame Leistung und Alternativen vor – Begrenzung durch Regelungskonzept, anderer Anschlusspunkt, Spannungsregelung durch Netzbetriebsmittel oder Netzverstärkung.",
            "**Kurzschlussbeitrag:** Überschlägig wird bei Wechselrichteranlagen der Umrichter-Nennstrom angesetzt; übersteigt der Kurzschlussstrom die Bemessungswerte der Betriebsmittel, sind Maßnahmen zu vereinbaren.",
            "**Unsymmetrie:** Im Niederspannungsnetz dürfen Anlagen bis 3,68 kVA je Außenleiter einphasig angeschlossen werden, höchstens 3 × 3,68 kVA verteilt auf die drei Außenleiter.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Flexibler Netzzugang und Kapazitätsreservierung nach ElWG",
          text: "Reicht die Netzkapazität nicht aus, kann nach dem ElWG ein befristeter flexibler Netzzugang vereinbart werden – je nach Netzebene für 12, 18 oder 24 Monate, nur im Verteilernetz. Die Einspeisung wird dann zeitweise begrenzt statt verweigert; der Netzbetreiber muss das Netz nach Stand der Technik optimieren, verstärken und ausbauen. Kapazitäten können laut PV Austria nach Beantwortung des Antrags binnen eines Monats durch Anzahlung für zwölf Monate reserviert werden. Quellen: WKO, PV Austria.",
        },
      ],
    },
    {
      id: "anforderungen",
      titel: "Welche technischen Anforderungen gelten für Typ A und Typ B?",
      tocLabel: "Anforderungen",
      bloecke: [
        {
          typ: "p",
          text: "**Typ A verlangt vor allem korrektes Verhalten bei Frequenz- und Spannungsabweichungen und eine Abschaltmöglichkeit; Typ B zusätzlich die Fähigkeit, Netzfehler zu durchfahren, und eine abgestufte Wirkleistungssteuerung durch den Netzbetreiber.** Die wichtigsten Werte aus den TOR:",
        },
        {
          typ: "tabelle",
          caption: "Ausgewählte Anforderungen der TOR Stromerzeugungsanlagen (Version 1.3)",
          kopf: ["Anforderung", "Typ A", "Typ B"],
          zeilen: [
            ["Frequenzbereich ohne Trennung", "47,5–48,5 Hz 60 min, 48,5–49 Hz 90 min, 49–51 Hz unbegrenzt, 51–51,5 Hz 30 min", "wie Typ A"],
            ["Frequenzgradient", "Betrieb bis 2 Hz/s", "Betrieb bis 2 Hz/s"],
            ["Überfrequenz (LFSM-O)", "Schwelle 50,2–50,5 Hz und Statik 2–12 % einstellbar; Standard 50,2 Hz und 5 %", "wie Typ A; bei Umrichtern im Niederspannungsnetz standardmäßig aktiv"],
            ["Wirkleistungsvorgabe", "Beenden der Einspeisung binnen 5 s über Eingangsport", "Sollwerte in max. 4 Stufen (z. B. 100/60/30/0 %), Umrichteranlagen binnen 1 min"],
            ["Blindleistung", "Verfahren nach Vorgabe (cos φ fix, cos φ(P), Q(U), Q fix)", "Blindleistungsbereich II: cos φ 0,925 unter- bis übererregt bei Maximalkapazität"],
            ["Netzfehler (FRT)", "–", "Verbindung halten entlang Spannungs-Zeit-Profil, auch bei mehreren Fehlern"],
            ["Fernwirkschnittstelle", "Signal des Netzbetreibers (z. B. Rundsteuerempfänger)", "unter 1 MW potentialfreie Kontakte; ab 1 MW IEC 60870-5-101/104, Modbus oder Online-Sollwert"],
            ["Wiederzuschaltung", "Wartezeit empfohlen 60 s, Leistungsanstieg max. 10 % Pmax pro Minute", "wie Typ A, Abstimmung mit Netzbetreiber"],
          ],
          minBreite: 820,
          fussnote: "Auszug; vollständige Anforderungen, Kennlinien und Einstellwerte in den TOR Stromerzeugungsanlagen Typ A und B, Version 1.3. Netzbetreiber können im Netzanschlussvertrag abweichende Werte festlegen.",
        },
        {
          typ: "p",
          text: "Wie ein Park- oder EZA-Regler diese Anforderungen am Netzanschlusspunkt umsetzt – inklusive Q(U)-Kennlinie, Sollwertstufen und Rampen –, erklärt der Ratgeber [EZA-Regler und Parkregler](/ratgeber/eza-regler-parkregler). Unser eigener [Parkregler](/technik/parkregler) ist für die Anforderungen österreichischer Netzbetreiber entwickelt. Beim Blindleistungsbereich gilt grundsätzlich Bereich II; nur in lokal begrenzten, begründeten Ausnahmefällen darf der Netzbetreiber Bereich I (cos φ 0,95 untererregt bis 0,9 übererregt) oder Bereich III (0,9 untererregt bis 0,95 übererregt) verlangen. Eine Reduktion der Wirkleistung zugunsten der Blindleistung ist zulässig.",
        },
      ],
    },
    {
      id: "nachweise",
      titel: "Konformitätsnachweis: Welche Unterlagen verlangt der Netzbetreiber?",
      tocLabel: "Nachweise",
      bloecke: [
        {
          typ: "p",
          text: "**Im Betriebserlaubnisverfahren weist der Betreiber nach, dass die Anlage den TOR entspricht – mindestens mit einem Prüfbericht des Netzentkupplungsschutzes und einer nach Bestandteilen aufgeschlüsselten Konformitätserklärung von Errichter und Betreiber.** Auf Anforderung des Netzbetreibers kommen hinzu:",
        },
        {
          typ: "checkliste",
          punkte: [
            "Prüfberichte einer nach ÖVE/ÖNORM EN ISO/IEC 17025 akkreditierten Prüfstelle nach OVE-Richtlinie R 25 (anerkannt werden auch Berichte nach VDE-AR-N 4105, wenn Q(U) und P(U) zusätzlich geprüft wurden)",
            "Bestätigung, dass die Wechselrichter mit der Ländereinstellung „Österreich“ und den Vorgaben des Netzbetreibers parametriert wurden",
            "maschinenlesbarer Parameterauszug",
            "bei netzrelevanten Anlagen: Simulationsparameter für statische und dynamische Studien",
            "Konformitätstests und -simulationen nach den Richtlinien RKS-AT oder Betriebsmittelbescheinigungen einer nach ISO/IEC 17065 akkreditierten Zertifizierungsstelle",
          ],
        },
        {
          typ: "p",
          text: "Der Netzbetreiber kann bei der Prüfung der Schaltstelle, der Schutzeinrichtungen, der Zuschaltbedingungen, der Netzrückwirkungen sowie der Blindleistungs- und Spannungsregelung anwesend sein. Plant man diese Termine früh ein, verzögert sich die Inbetriebnahme nicht – den Gesamtablauf zeigt [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
        },
      ],
    },
    {
      id: "elwg",
      titel: "Was ändert das ElWG ab 2027 am Netzanschluss?",
      tocLabel: "ElWG ab 2027",
      bloecke: [
        {
          typ: "p",
          text: "**Das ElWG ergänzt die TOR um wirtschaftliche und betriebliche Regeln: neues Netzanschlussentgelt, Versorgungsinfrastrukturbeitrag, Spitzenkappung und Steuerbarkeit.** Die wichtigsten Punkte für Netzanschlüsse ab 1. Jänner 2027:",
        },
        {
          typ: "liste",
          punkte: [
            "**Netzanschlussentgelt:** aufwandsorientierter Anteil (Kostensätze je kW für Netzebenen 4 und 6, je Anschluss für Netzebene 7) plus pauschaler Anteil je kW netzwirksamer Leistung; Befreiung bis 15 kW; Abschlag für systemdienliche Standorte und dauerhaft flexible Anschlüsse.",
            "**Versorgungsinfrastrukturbeitrag:** höchstens 0,05 ct je eingespeister kWh für Einspeiser über 20 kW.",
            "**Spitzenkappung:** Netzbetreiber dürfen neue oder erweiterte PV-Anlagen über 7 kW auf bis zu 70 % der Modulspitzenleistung begrenzen, ohne Entschädigung; ab 2028 soll eine dynamische Variante folgen.",
            "**Steuerbarkeit:** Neue Anlagen ab 3,68 kW netzwirksamer Leistung müssen vom Netzbetreiber gesteuert werden können.",
          ],
        },
        {
          typ: "p",
          text: "Details und offene Punkte fasst der Ratgeber [ElWG – Elektrizitätswirtschaftsgesetz](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz) zusammen. Für Betriebe mit großen Anlagen lohnt sich die Frage, ob ein Speicher die Spitzenkappung und den Leistungspreis gleichzeitig entschärft – siehe [Gewerbespeicher](/gewerbespeicher).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist der Unterschied zwischen Typ A und Typ B?",
      a: "Typ A umfasst Anlagen von 0,8 kW bis unter 250 kW Maximalkapazität, Typ B Anlagen von 250 kW bis unter 35 MW (unter 110 kV). Typ B muss zusätzlich Netzfehler durchfahren (FRT), die Wirkleistung in Stufen nach Vorgabe des Netzbetreibers reduzieren und ab 1 MW Online-Sollwerte über eine Fernwirkschnittstelle verarbeiten.",
    },
    {
      q: "Ab welcher Größe wird eine PV-Anlage an die Mittelspannung angeschlossen?",
      a: "Eine feste Grenze gibt es nicht. Laut TOR hängt die mögliche Leistung je Netzebene von den Netzverhältnissen ab, etwa Kurzschlussleistung und Trafokapazität. Der Netzbetreiber legt die Netzebene im Anschlusskonzept fest; bei großen Dachanlagen und Freiflächen ist die Mittelspannung häufig.",
    },
    {
      q: "Wie lange gilt das Anschlusskonzept des Netzbetreibers?",
      a: "Laut TOR ist eine Frist zu vereinbaren, die die voraussichtliche Dauer des Genehmigungsverfahrens berücksichtigt – mindestens jedoch sechs Monate ab Übermittlung.",
    },
    {
      q: "Welche Nachweise brauche ich für die Inbetriebnahme?",
      a: "Mindestens einen Prüfbericht des Netzentkupplungsschutzes und eine Konformitätserklärung von Errichter und Betreiber. Auf Anforderung kommen Prüfberichte nach OVE-Richtlinie R 25, ein Parameterauszug mit Ländereinstellung „Österreich“ und bei größeren Anlagen Simulationsparameter hinzu.",
    },
    {
      q: "Darf ich eine große Anlage in mehrere kleine aufteilen, um unter Typ B zu bleiben?",
      a: "Nein. Mehrere Erzeugungseinheiten hinter einem gemeinsamen Netzanschlusspunkt gelten als eine Anlage, und gezielte eigentumsrechtliche Aufteilungen dürfen die Typeinteilung laut TOR nicht einschränken.",
    },
    {
      q: "Was passiert, wenn das Netz keine Kapazität hat?",
      a: "Der Netzbetreiber muss die mögliche Leistung und Alternativen nennen. Seit dem ElWG kann zudem ein befristeter flexibler Netzzugang vereinbart werden (12, 18 oder 24 Monate je nach Netzebene), bei dem die Einspeisung zeitweise begrenzt wird.",
    },
  ],

  passend: [
    { href: "/ratgeber/eza-regler-parkregler", titel: "EZA-Regler & Parkregler", text: "Regelung am Netzanschlusspunkt." },
    { href: "/technik/parkregler", titel: "Ökovolt Parkregler", text: "Eigenentwicklung für österreichische Netze." },
    { href: "/ratgeber/photovoltaik-anmelden", titel: "PV-Anlage anmelden", text: "Vom Netzzugangsantrag zum Zählpunkt." },
    { href: "/forderungen/richtlinien", titel: "Normen & Richtlinien", text: "TOR, OVE und ÖNORM im Überblick." },
  ],

  quellen: [
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.3", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.3.pdf/ff57fdfb-99ec-7442-36f2-6de5f17601ad?t=1718018782590", stand: "07/2024" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ B, Version 1.3", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", stand: "07/2024" },
    { titel: "Oesterreichs Energie – Erläuterungsdokument NC RfG / TOR Erzeuger", url: "https://oesterreichsenergie.at/publikationen/ueberblick/detailseite/erlaeuterungen-zur-tor-umsetzung", stand: "04/2023" },
    { titel: "Verordnung (EU) 2016/631 – Netzkodex mit Netzanschlussbestimmungen für Stromerzeuger (RfG)", url: "https://eur-lex.europa.eu/eli/reg/2016/631/oj", stand: "04/2016" },
    { titel: "WKO – Information zum finalen Elektrizitätswirtschaftsgesetz", url: "https://www.wko.at/noe/transport-verkehr/spedition-logistik/elwg", stand: "09/2026" },
    { titel: "PV Austria – Netzthemen", url: "https://pvbaustria.at/netzthemen/", stand: "09/2026" },
    { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf (§§ 14–18)", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
  ],

  seitenCta: { titel: "Netzanschluss für über 250 kW?", text: "Wir übernehmen Netzanfrage, Regelungskonzept und Nachweise.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Netzanschluss ohne Überraschungen – von der Anfrage bis zur Abnahme.",
    text: "Ökovolt Solartechnik plant PV-Anlagen bis in den Megawattbereich und liefert mit dem eigenen Parkregler die Regelungstechnik für österreichische Netzbetreiber.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Parkregler", href: "/technik/parkregler" },
  },
};

export default artikel;
