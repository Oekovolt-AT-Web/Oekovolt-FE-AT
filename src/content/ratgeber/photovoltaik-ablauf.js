// Ratgeber: Ablauf eines Gewerbe-PV-Projekts in Österreich – vom Lastgang bis zur Inbetriebnahme
// Recherchestand 28.09.2026: TOR Stromerzeugungsanlagen Typ A/B V1.3 (E-Control), OIB-RL 2/2.1 (2023),
// Landes-ElWG (Lastprofilgrenzen), ElWG BGBl. I Nr. 91/2025, SNE-G-V-Entwurf 07/2026.
// Zeitangaben sind Erfahrungswerte/Richtwerte und als solche gekennzeichnet.

const artikel = {
  slug: "photovoltaik-ablauf",
  title: "Ablauf eines PV-Projekts im Betrieb: vom Lastgang bis zum Netz",
  seoTitle: "PV-Projekt Ablauf Gewerbe Österreich | Ökovolt",
  kurzTitel: "Ablauf PV-Projekt",
  description:
    "Ablauf eines Gewerbe-PV-Projekts in Österreich: Lastgang, Statik, Netzanfrage, Förderung, Genehmigung, Montage, Prüfung und Inbetriebnahme – mit Zeitplan.",
  excerpt:
    "Ein Gewerbeprojekt mit 100 bis 1.000 kWp durchläuft zehn Phasen – vom Lastgang über Netzanfrage und Förderung bis zur Fertigstellungsmeldung. Wo Zeit verloren geht und welche Unterlagen Sie wann brauchen.",
  hauptKeyword: "ablauf photovoltaik projekt gewerbe",
  keywords: [
    "Ablauf PV-Projekt Gewerbe",
    "Photovoltaik Projektablauf",
    "PV-Anlage Betrieb Zeitplan",
    "Photovoltaik Planung Unternehmen",
    "PV Inbetriebnahme Österreich",
    "Lastgang Photovoltaik",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Referenzen/projekteBanner.jpg",
  bildAlt: "Photovoltaikanlage auf einem Gewerbedach",
  badge: { wert: "10 Phasen", text: "vom Lastgang bis zum Wartungsvertrag" },

  kurzFazit: [
    "**Ein Gewerbe-PV-Projekt in Österreich dauert vom ersten Lastgang bis zur Inbetriebnahme typischerweise vier bis zwölf Monate** – die Montage selbst ist oft in wenigen Wochen erledigt. Den Zeitplan bestimmen Netzanfrage, Förderung und Genehmigungen.",
    "Die Anlagengröße ergibt sich aus dem **Lastgang in Viertelstundenwerten**, nicht aus der Dachfläche. Betriebe mit Lastprofilzähler (über 100.000 kWh Jahresverbrauch oder 50 kW Anschlussleistung) haben diese Daten beim Netzbetreiber.",
    "Ab **250 kW** gelten die TOR-Anforderungen für Typ B; im Mittelspannungsnetz kann bereits ab **100 kVA** (mit Mittelspannungsmessung) ein **Park- und Anlagenregler** verlangt werden.",
    "Die Netzanfrage gehört an den Anfang: Das Anschlusskonzept des Netzbetreibers gilt laut TOR mindestens **sechs Monate** – genug Zeit für Förderung und Genehmigung, wenn man früh startet.",
  ],

  abschnitte: [
    {
      id: "ueberblick",
      titel: "Wie läuft ein PV-Projekt im Betrieb ab?",
      tocLabel: "Überblick",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Gewerbe-PV-Projekt läuft in zehn Phasen ab: Datenaufnahme, Konzept, Netzanfrage, Förderung, Genehmigung, Ausschreibung und Vergabe, Beschaffung, Montage, Prüfung und Inbetriebnahme, Betrieb.** Anders als beim Einfamilienhaus sind Netz, Statik, Brandschutz und Förderung eigene Arbeitspakete mit Fristen. Wer sie parallel statt nacheinander abarbeitet, verkürzt das Projekt um Monate.",
        },
        {
          typ: "tabelle",
          caption: "Phasen eines Gewerbe-PV-Projekts (100–1.000 kWp Dachanlage), Richtwerte",
          kopf: ["Phase", "Inhalt", "Dauer (Richtwert)", "Ergebnis"],
          zeilen: [
            ["1. Datenaufnahme", "Lastgang, Dachpläne, Statik, Zählerschrank, Netzanschluss", "1–3 Wochen", "Datenbasis"],
            ["2. Konzept", "Simulation, Anlagengröße, Speicher, Wirtschaftlichkeit", "2–4 Wochen", "Grobkonzept und Budget"],
            ["3. Netzanfrage", "Netzzugangsantrag, Anschlusskonzept", "4–12 Wochen", "Netzanschlusspunkt, netzwirksame Leistung"],
            ["4. Förderung", "EAG-Investitionszuschuss, Landes- oder Umweltförderung", "je nach Fördercall", "Förderzusage"],
            ["5. Genehmigung", "Bau-, Elektrizitäts- und ggf. Gewerberecht", "0–6 Monate", "Meldung, Anzeige oder Bescheid"],
            ["6. Vergabe", "Leistungsverzeichnis, Angebote, Verhandlung", "2–6 Wochen", "Auftrag"],
            ["7. Beschaffung", "Module, Wechselrichter, Unterkonstruktion, Trafo", "2–12 Wochen", "Material auf Baustelle"],
            ["8. Montage", "Gerüst/Absturzsicherung, Unterkonstruktion, DC/AC, Übergabe", "1–6 Wochen", "fertige Anlage"],
            ["9. Prüfung & Inbetriebnahme", "Erstprüfung, Parametrierung, Fertigstellungsmeldung", "1–4 Wochen", "aktiver Einspeisezählpunkt"],
            ["10. Betrieb", "Monitoring, Wartung, Versicherung", "20–30 Jahre", "Ertrag"],
          ],
          minBreite: 720,
          fussnote: "Erfahrungswerte für Dachanlagen; Freiflächen mit Widmung, Trafostation oder Umspannwerksanschluss dauern deutlich länger. Lieferzeiten für Mittelspannungstrafos können mehrere Monate betragen.",
        },
      ],
    },
    {
      id: "daten",
      titel: "Phase 1 und 2: Lastgang und Konzept",
      tocLabel: "Lastgang & Konzept",
      bloecke: [
        {
          typ: "p",
          text: "**Die richtige Anlagengröße ergibt sich aus dem Lastgang – dem Stromverbrauch im Viertelstundenraster über mindestens ein Jahr.** Für Betriebe mit mehr als 100.000 kWh Jahresverbrauch oder über 50 kW Anschlussleistung verwenden Netzbetreiber keine standardisierten Lastprofile, sondern messen den Lastgang; die Daten stehen im Kundenportal des Netzbetreibers. Bei kleineren Betrieben liefert der Smart Meter Viertelstundenwerte, sofern diese freigeschaltet sind (siehe [Smart Meter](/ratgeber/smart-meter-pflicht)).",
        },
        {
          typ: "checkliste",
          punkte: [
            "12 Monate Lastgang (Viertelstundenwerte) und die letzten Stromrechnungen mit Arbeits- und Leistungspreis",
            "Dachpläne, Aufbau und Alter der Dachhaut, statische Unterlagen oder Tragwerksplaner-Kontakt",
            "Lage von Zählerschrank, Hauptverteilung und gegebenenfalls kundeneigener Trafostation",
            "Netzanschlussdaten: Netzebene, vereinbarte Anschlussleistung, Zählpunktbezeichnung",
            "Betriebszeiten, Betriebsurlaube, geplante Erweiterungen, E-Flotte, Wärmepumpen",
            "Brandschutz: Brandabschnitte, Rauch- und Wärmeabzug, Feuerwehrzugänge, Löschanlagen",
          ],
        },
        {
          typ: "p",
          text: "Im Konzept wird die Erzeugung je Viertelstunde gegen den Lastgang gelegt. Daraus ergeben sich Eigenverbrauchsquote, Überschuss und die Frage, ob ein Speicher für [Peak Shaving](/ratgeber/peak-shaving-leistungspreis) wirtschaftlich ist. Gleichzeitig wird die netzwirksame Leistung festgelegt – die Größe, die ab 2027 das Netzanschlussentgelt bestimmt. Wie Sie die Größe konkret ermitteln, zeigt der Ratgeber [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Überschuss mitdenken",
          text: "Ein Dach, das mehr kann als der eigene Verbrauch, muss nicht klein geplant werden: Überschüsse lassen sich an Stromhändler verkaufen, in eine Energiegemeinschaft einbringen oder über PPA vermarkten. Siehe [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe).",
        },
      ],
    },
    {
      id: "netz",
      titel: "Phase 3: Netzanfrage und Anschlusskonzept",
      tocLabel: "Netzanfrage",
      bloecke: [
        {
          typ: "p",
          text: "**Die Netzanfrage ist der kritische Pfad jedes Gewerbeprojekts – ohne Anschlusskonzept keine belastbare Planung.** Der Netzbetreiber prüft auf Basis des Netzzugangsantrags, ob der Anschluss am bestehenden Punkt möglich ist oder eine höhere [Netzebene](/wissen/lexikon#netzebene) nötig wird. Er legt Netzanschlusspunkt, Verknüpfungspunkt, netzwirksame Leistung und das Verfahren zur Blindleistungsbereitstellung fest.",
        },
        {
          typ: "p",
          text: "Kann die beantragte Leistung nicht vollständig aufgenommen werden, muss der Netzbetreiber laut TOR die mögliche Leistung und technische Alternativen nennen – etwa eine Begrenzung der netzwirksamen Leistung durch ein Regelungskonzept, einen anderen Anschlusspunkt oder netzseitige Maßnahmen. Seit dem [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz) ist zudem ein befristeter flexibler Netzzugang möglich (je nach Netzebene 12, 18 oder 24 Monate). Mehr dazu im Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss).",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Parkregler früh einplanen",
          text: "Speisen Anlagen gemeinsam in das Mittelspannungsnetz ein, kann der Netzbetreiber laut TOR einen Park- und Anlagenregler verlangen: mit Mittelspannungsmessung ab einer Summe der Engpassleistungen von über 100 kVA, ohne Mittelspannungsmessung ab über 400 kVA. Der Regler muss Wirk- und Blindleistung am Netzanschlusspunkt führen – siehe [EZA-Regler und Parkregler](/ratgeber/eza-regler-parkregler) und unseren [Ökovolt Parkregler](/technik/parkregler).",
        },
      ],
    },
    {
      id: "foerderung-genehmigung",
      titel: "Phase 4 und 5: Förderung und Genehmigung",
      tocLabel: "Förderung & Genehmigung",
      bloecke: [
        {
          typ: "p",
          text: "**Förderung und Genehmigung laufen parallel zur Netzanfrage – und beide haben eigene Stichtage.** Der EAG-Investitionszuschuss wird in Fördercalls über das EAG-Portal der OeMAG vergeben; das Ansuchen muss vor der Umsetzung gestellt werden. Details zu Kategorien, Fristen und Abrechnung im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss). Für Betriebe kommen der [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik) und Landesförderungen hinzu.",
        },
        {
          typ: "p",
          text: "Die Genehmigungspflichten unterscheiden sich stark nach Bundesland: Dachanlagen sind baurechtlich meist frei oder meldepflichtig, elektrizitätsrechtlich liegen die Schwellen zwischen 15 kW (Wien) und 1.000 kW (Oberösterreich). Bei genehmigten Betriebsanlagen ist zu prüfen, ob die PV-Anlage eine Änderung nach Gewerbeordnung darstellt. Die Übersicht je Land finden Sie im Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung). Bei Gemeinden kommen Gemeinderatsbeschlüsse, Budgetfreigaben und gegebenenfalls Vergabeverfahren nach Bundesvergabegesetz hinzu – diese Schritte gehören von Anfang an in den Zeitplan, weil Sitzungstermine oft nur quartalsweise stattfinden.",
        },
      ],
    },
    {
      id: "vergabe",
      titel: "Phase 6 und 7: Ausschreibung, Vergabe und Beschaffung",
      tocLabel: "Vergabe & Beschaffung",
      bloecke: [
        {
          typ: "p",
          text: "**Vergleichbare Angebote entstehen nur mit einem klaren Leistungsverzeichnis: Anlagengröße, Komponentenklassen, Unterkonstruktion, Netzanschluss, Regelung, Monitoring, Dokumentation und Wartung.** Unterschiede verstecken sich oft in Nebenleistungen – Absturzsicherung, Kabelwege, Brandschutzmaßnahmen, Parkregler, Trafostation, Netzbetreiberkosten. Eine Checkliste bietet der Ratgeber [Photovoltaik-Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen). Gemeinden vergeben nach Bundesvergabegesetz.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Module mit ausreichender Prüflast für Schnee und Wind am Standort, Hagelwiderstand nach Risiko",
            "Wechselrichter mit Nachweisen nach OVE-Richtlinie R 25 bzw. Ländereinstellung „Österreich“",
            "Unterkonstruktion mit statischem Nachweis nach ÖNORM B 1991-1-3 (Schnee) und B 1991-1-4 (Wind)",
            "Regelungstechnik: Einspeisebegrenzung, Parkregler, Fernwirkschnittstelle nach Netzbetreibervorgabe",
            "Monitoring mit Alarmierung, Datenzugang für den Betreiber",
            "Dokumentation nach ÖVE/ÖNORM EN 62446-1, Übersichtsplan für die Feuerwehr nach OVE R 11-1",
            "Wartungs- und Serviceangebot mit klaren Leistungen",
          ],
        },
      ],
    },
    {
      id: "montage",
      titel: "Phase 8: Montage im laufenden Betrieb",
      tocLabel: "Montage",
      bloecke: [
        {
          typ: "p",
          text: "**Die Montage einer Gewerbe-Dachanlage dauert je nach Größe ein bis sechs Wochen und lässt sich meist im laufenden Betrieb durchführen.** Entscheidend sind Baustellenlogistik (Kran, Lagerflächen), Arbeitssicherheit auf dem Dach und die Abstimmung von Abschaltzeiten für den Anschluss an die Hauptverteilung.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Baustelleneinrichtung", "Absturzsicherung, Kranstellung, Materiallager, Unterweisung; Sicherheits- und Gesundheitsschutzplan bei Bedarf."],
            ["Unterkonstruktion", "Ballastiertes oder befestigtes System laut Statik; Abstände zu Brandwänden, Lichtkuppeln und Dachausstiegen nach OIB-Richtlinie 2 bzw. 2.1."],
            ["Module und DC-Verkabelung", "Stringverkabelung, Leitungsführung im Gebäude nach Brandschutzkonzept, Kennzeichnung."],
            ["Wechselrichter und AC-Anschluss", "Montage, Überspannungsschutz, Anschluss an die Hauptverteilung bzw. Trafostation, Einbindung von Regler und Monitoring."],
            ["Übergabe an die Inbetriebnahme", "Sichtprüfung, Messungen, Beschriftung und Übersichtsplan."],
          ],
        },
      ],
    },
    {
      id: "inbetriebnahme",
      titel: "Phase 9: Prüfung, Fertigstellungsmeldung und Inbetriebnahme",
      tocLabel: "Inbetriebnahme",
      bloecke: [
        {
          typ: "p",
          text: "**Vor der ersten Einspeisung wird die Anlage geprüft, dokumentiert und beim Netzbetreiber fertiggemeldet; erst nach Freigabe darf parallel zum Netz betrieben werden.** Die Erstprüfung erfolgt nach ÖVE/ÖNORM E 8101, die PV-spezifischen Prüfungen und die Dokumentation nach ÖVE/ÖNORM EN 62446-1. Für Typ-B-Anlagen verlangen die TOR einen Prüfbericht des Netzentkupplungsschutzes und eine nach Bestandteilen aufgeschlüsselte Konformitätserklärung von Errichter und Betreiber.",
        },
        {
          typ: "liste",
          punkte: [
            "**Parametrierung:** Ländereinstellung „Österreich“, Blindleistungsverfahren und Kennlinien laut Anschlusskonzept, Einspeisebegrenzung, Parkregler-Sollwerte.",
            "**Nachweise:** Prüfbefund, Konformitätserklärung, Parameterauszug (maschinenlesbar), Schutzprüfprotokoll, auf Anforderung Prüfberichte nach OVE-Richtlinie R 25.",
            "**Netzbetreiber vor Ort:** Bei größeren Anlagen kann der Netzbetreiber bei der Prüfung der Schutzeinrichtungen, der Blindleistungs- und Spannungsregelung und der Zuschaltbedingungen anwesend sein.",
            "**Fertigstellungsmeldung:** Einreichung durch den Elektrotechniker; danach Aktivierung des Einspeisezählpunkts – siehe [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
          ],
        },
      ],
    },
    {
      id: "rollen",
      titel: "Wer ist wofür verantwortlich?",
      tocLabel: "Rollen",
      bloecke: [
        {
          typ: "p",
          text: "**In einem Gewerbeprojekt arbeiten sieben bis zehn Beteiligte zusammen; der Betreiber bleibt rechtlich verantwortlich, auch wenn der Errichter die meisten Schritte übernimmt.** Klare Zuständigkeiten im Vertrag verhindern, dass Meldungen, Nachweise oder Fristen zwischen den Beteiligten liegen bleiben.",
        },
        {
          typ: "tabelle",
          caption: "Rollen in einem Gewerbe-PV-Projekt in Österreich",
          kopf: ["Beteiligter", "Aufgaben"],
          zeilen: [
            ["Betreiber (Unternehmen, Gemeinde)", "Entscheidungen, Verträge, Förderansuchen, Eigentümerzustimmungen, Datenfreigaben; Verantwortung für den sicheren Betrieb"],
            ["Planer / Errichter", "Konzept, Netzzugangsantrag, Genehmigungsunterlagen, Ausschreibung, Bauleitung, Dokumentation"],
            ["Konzessionierter Elektrotechniker", "Elektroinstallation, Erstprüfung nach ÖVE/ÖNORM E 8101, Fertigstellungsmeldung"],
            ["Tragwerksplaner", "statischer Nachweis für Dach und Unterkonstruktion"],
            ["Netzbetreiber", "Anschlusskonzept, Netzzugangsvertrag, Zählpunkt, Messung, Vorgaben für Regelung und Schutz"],
            ["Behörden", "Meldung, Anzeige oder Bescheid nach Bau-, Elektrizitäts- und Gewerberecht"],
            ["Förderstelle (OeMAG, KPC, Land)", "Förderzusage, Abrechnung, Nachweisprüfung"],
            ["Versicherer, Feuerwehr", "Auflagen zu Prüfungen und Brandschutz, Übersichtsplan, Einsatzvorbereitung"],
          ],
          minBreite: 620,
        },
        {
          typ: "h3",
          text: "Wo Projekte am häufigsten ins Stocken geraten",
        },
        {
          typ: "liste",
          punkte: [
            "**Fehlende Statik:** Leichte Trapezblech- und Sandwichdächer haben oft wenig Lastreserve; der Nachweis dauert, wenn Bestandsunterlagen fehlen.",
            "**Netz am Limit:** Ist der Anschlusspunkt ausgelastet, verschiebt sich das Projekt auf eine höhere Netzebene oder es braucht einen flexiblen Netzzugang mit Begrenzung.",
            "**Förderfenster verpasst:** Fördercalls haben Stichtage; wer den Auftrag vor dem Ansuchen erteilt, verliert unter Umständen die Förderung.",
            "**Dachsanierung übersehen:** Muss das Dach innerhalb der nächsten zehn Jahre saniert werden, sollte das vor der PV-Montage passieren – Abbau und Wiederaufbau sind teuer.",
            "**Mietobjekte:** Bei gemieteten Hallen braucht es einen Gestattungs- oder Dachnutzungsvertrag mit dem Eigentümer, der die Laufzeit der Anlage abdeckt.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Beispiel-Zeitplan: 400 kWp auf einem Hallendach",
          text: "Ein realistischer Ablauf für eine 400-kWp-Dachanlage mit Anschluss an eine kundeneigene Trafostation: Datenaufnahme und Konzept im ersten Monat, Netzzugangsantrag im zweiten Monat, Anschlusskonzept und Förderansuchen im dritten bis vierten Monat, Vergabe und Bestellung im fünften Monat, Montage im sechsten bis siebten Monat, Inbetriebnahme im siebten bis achten Monat. Richtwert – abhängig von Netzbetreiber, Förderstichtagen und Lieferzeiten.",
        },
      ],
    },
    {
      id: "betrieb",
      titel: "Phase 10: Betrieb, Wartung und Versicherung",
      tocLabel: "Betrieb",
      bloecke: [
        {
          typ: "p",
          text: "**Mit der Inbetriebnahme beginnt eine Betriebsphase von 20 bis 30 Jahren, in der Monitoring und Wartung den Ertrag sichern.** Dazu gehören Fernüberwachung mit Alarmierung, wiederkehrende elektrische Prüfungen, Sichtkontrollen, Reinigung nach Bedarf und die Pflege der Dokumentation für Versicherung und Feuerwehr. Leistungsumfang und Kosten beschreibt der Ratgeber [Wartungsvertrag](/ratgeber/photovoltaik-wartungsvertrag); unsere Leistungen finden Sie unter [Wartung](/service/wartung) und [Fernwartung](/technik/fernwartung).",
        },
        {
          typ: "p",
          text: "Spätestens zur Inbetriebnahme sollte auch die Versicherung angepasst sein: Die Anlage muss in der Gebäude- bzw. Betriebsversicherung berücksichtigt werden, oft ergänzt um eine Elektronik- oder Ertragsausfallversicherung. Versicherer verlangen häufig einen aktuellen Prüfbefund, eine vollständige Dokumentation und den Übersichtsplan für die Feuerwehr. Welche Deckungen sinnvoll sind, erklärt der Ratgeber [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
        },
        {
          typ: "kennzahl",
          wert: "6 Monate",
          titel: "Mindestgültigkeit des Anschlusskonzepts",
          text: "So lange muss das Anschlusskonzept des Netzbetreibers laut TOR mindestens gültig sein – unter Berücksichtigung der voraussichtlichen Genehmigungsdauer.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie lange dauert ein Gewerbe-PV-Projekt von der Anfrage bis zur Inbetriebnahme?",
      a: "Typischerweise vier bis zwölf Monate. Die Montage dauert oft nur ein bis sechs Wochen; den Zeitplan bestimmen Netzanfrage, Förderung, Genehmigung und Lieferzeiten, etwa für Trafostationen.",
    },
    {
      q: "Welche Daten brauche ich für die Planung?",
      a: "Vor allem den Lastgang mit Viertelstundenwerten über ein Jahr, Dachpläne mit Statikunterlagen, Angaben zum Netzanschluss (Netzebene, Anschlussleistung, Zählpunkt) sowie Betriebszeiten und geplante Erweiterungen. Betriebe mit Lastprofilzähler finden den Lastgang im Portal des Netzbetreibers.",
    },
    {
      q: "Wann brauche ich einen Parkregler?",
      a: "Wenn der Netzbetreiber es im Anschlusskonzept verlangt – laut TOR möglich bei Anlagen im Mittelspannungsnetz ab einer Summe der Engpassleistungen von über 100 kVA mit Mittelspannungsmessung bzw. über 400 kVA ohne. Ab 1 MW sind Online-Sollwertvorgaben über eine Fernwirkschnittstelle üblich.",
    },
    {
      q: "Kann die Montage im laufenden Betrieb stattfinden?",
      a: "In den meisten Fällen ja. Kurze Abschaltungen sind nur für den Anschluss an die Hauptverteilung oder Trafostation nötig und werden vorab abgestimmt. Wichtig sind sichere Zugänge, Kranstellflächen und eine klare Baustellenlogistik.",
    },
    {
      q: "Wer meldet die Anlage beim Netzbetreiber an?",
      a: "Den Netzzugangsantrag stellt der Betreiber, meist vertreten durch den Errichter. Die Fertigstellungsmeldung reicht der konzessionierte Elektrotechniker mit Prüfbefund ein. Erst danach wird der Einspeisezählpunkt aktiviert.",
    },
    {
      q: "Was passiert nach der Inbetriebnahme?",
      a: "Die Anlage wird überwacht, regelmäßig gewartet und elektrisch geprüft. Ein Wartungsvertrag regelt Monitoring, Reaktion auf Störungen, Prüfungen und Reinigung und hilft, Versicherungsauflagen zu erfüllen.",
    },
  ],

  howTo: {
    name: "Gewerbe-PV-Projekt in Österreich umsetzen",
    schritte: [
      { name: "Daten aufnehmen", text: "Lastgang, Dachpläne, Statik und Netzanschlussdaten zusammentragen." },
      { name: "Konzept erstellen", text: "Erzeugung gegen Lastgang simulieren, Anlagengröße, Speicher und netzwirksame Leistung festlegen." },
      { name: "Netzanfrage stellen", text: "Netzzugangsantrag einreichen und Anschlusskonzept abwarten." },
      { name: "Förderung beantragen", text: "EAG-Investitionszuschuss und weitere Förderungen vor der Umsetzung beantragen." },
      { name: "Genehmigungen einholen", text: "Bau-, Elektrizitäts- und Gewerberecht nach Bundesland klären." },
      { name: "Vergeben und beschaffen", text: "Leistungsverzeichnis erstellen, Angebote vergleichen, Auftrag erteilen, Material bestellen." },
      { name: "Montieren", text: "Unterkonstruktion, Module, Wechselrichter, Regler und Monitoring installieren." },
      { name: "Prüfen und in Betrieb nehmen", text: "Erstprüfung, Parametrierung, Fertigstellungsmeldung, Aktivierung des Zählpunkts." },
      { name: "Betreiben", text: "Monitoring, Wartung, Prüfungen und Versicherung organisieren." },
    ],
  },

  passend: [
    { href: "/ratgeber/photovoltaik-anmelden", titel: "PV-Anlage anmelden", text: "Netzzugangsantrag und Fertigstellungsmeldung." },
    { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "TOR Erzeuger & Netzanschluss", text: "Typ A bis D und Netzebenen." },
    { href: "/gewerbe", titel: "Photovoltaik für Betriebe", text: "Von der Analyse bis zum Betrieb." },
    { href: "/service/wartung", titel: "Wartung", text: "Betrieb und Service nach der Inbetriebnahme." },
  ],

  quellen: [
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ B, Version 1.3", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", stand: "07/2024" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.3", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.3.pdf/ff57fdfb-99ec-7442-36f2-6de5f17601ad?t=1718018782590", stand: "07/2024" },
    { titel: "OIB – OIB-Richtlinie 2.1 Brandschutz bei Betriebsbauten, Ausgabe Mai 2023", url: "https://www.oib.or.at/wp-content/uploads/richtlinien/richtlinie_2023/oib-rl_2.1_ausgabe_mai_2023.pdf", stand: "05/2023" },
    { titel: "NÖ Elektrizitätswesengesetz 2005 – standardisierte Lastprofile (jusline.at)", url: "https://www.jusline.at/gesetz/noe_elwg_2005/gesamt", stand: "09/2026" },
    { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", stand: "09/2026" },
    { titel: "WKO – Information zum finalen Elektrizitätswirtschaftsgesetz", url: "https://www.wko.at/noe/transport-verkehr/spedition-logistik/elwg", stand: "09/2026" },
  ],

  seitenCta: { titel: "Projekt starten?", text: "Senden Sie uns Lastgang und Dachdaten – wir erstellen das Konzept.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Vom Lastgang zur laufenden Anlage – mit einem Ansprechpartner.",
    text: "Ökovolt Solartechnik plant, errichtet und betreut PV-Anlagen für Betriebe in ganz Österreich – mit eigenem Parkregler, eigener Fernwartung und SCADA.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Photovoltaik für Betriebe", href: "/gewerbe" },
  },
};

export default artikel;
