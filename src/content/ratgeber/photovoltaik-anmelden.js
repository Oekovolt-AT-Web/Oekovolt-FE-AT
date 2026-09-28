// Ratgeber: PV-Anlage in Österreich anmelden (Gewerbe-Fokus)
// Recherchestand 28.09.2026: TOR Stromerzeugungsanlagen Typ A/B V1.3 (E-Control, gültig ab 01.07.2024),
// ElWG BGBl. I Nr. 91/2025 (Zusammenfassungen WKO, BMWET, PV Austria), SNE-G-V-Begutachtungsentwurf 07/2026,
// Landes-ElWG (standardisierte Lastprofile), OeMAG-Marktpreis August 2026, ÖBFV-Info E-32.

const artikel = {
  slug: "photovoltaik-anmelden",
  title: "PV-Anlage anmelden in Österreich: Netzbetreiber, Zählpunkt, Fristen",
  seoTitle: "PV-Anlage anmelden Österreich 2026 | Ökovolt",
  kurzTitel: "PV-Anlage anmelden",
  description:
    "PV-Anlage anmelden in Österreich: Netzzugangsantrag, Anschlusskonzept, Fertigstellungsmeldung, Zählpunkt und Stromabnahme – Ablauf und ElWG-Neuerungen 2027.",
  excerpt:
    "Wer in Österreich eine PV-Anlage ans Netz bringt, braucht vor der Montage einen Netzzugangsantrag und danach eine Fertigstellungsmeldung. Was Betriebe dabei beachten müssen – inklusive der ElWG-Änderungen ab 2027.",
  hauptKeyword: "pv anlage anmelden österreich",
  keywords: [
    "PV-Anlage anmelden Österreich",
    "Netzzugangsantrag Photovoltaik",
    "Fertigstellungsmeldung PV",
    "Einspeisezählpunkt",
    "Photovoltaik Netzbetreiber Anmeldung",
    "PV Anmeldung Gewerbe",
    "Netzanschlussentgelt PV 2027",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/Dienstleistungen/Service/solar-panel-7518786_1280.jpg",
  bildAlt: "Photovoltaikmodule auf einem Dach vor blauem Himmel",
  badge: { wert: "2 Meldungen", text: "Netzzugangsantrag vor, Fertigstellungsmeldung nach der Montage" },

  kurzFazit: [
    "**Eine PV-Anlage wird in Österreich beim zuständigen Verteilernetzbetreiber angemeldet – in zwei Schritten:** Netzzugangsantrag vor der Montage, Fertigstellungsmeldung samt Prüfbefund nach der Montage. Erst danach wird der Einspeisezählpunkt aktiviert.",
    "Ab einer Maximalkapazität von **0,8 kW** gilt eine Anlage als Stromerzeugungsanlage **Typ A** nach den TOR, ab **250 kW** als **Typ B** – mit deutlich mehr Technik- und Nachweispflichten.",
    "Mit dem **ElWG** gilt ab 1. Jänner 2027: Einspeiser bis **15 kW** netzwirksamer Leistung zahlen kein Netzanschlussentgelt, bis **20 kW** keinen Versorgungsinfrastrukturbeitrag (darüber höchstens 0,05 ct/kWh). Neue PV-Anlagen über 7 kW können auf **70 %** der Modulleistung begrenzt werden.",
    "Den Überschuss nimmt ein Stromhändler oder die **OeMAG** zum Marktpreis ab – im August 2026 lag dieser für Photovoltaik bei **8,997 ct/kWh**.",
  ],

  abschnitte: [
    {
      id: "ueberblick",
      titel: "Wie meldet man eine PV-Anlage in Österreich an?",
      tocLabel: "Überblick",
      bloecke: [
        {
          typ: "p",
          text: "**Eine PV-Anlage wird in Österreich beim Verteilernetzbetreiber angemeldet, an dessen Netz der Standort hängt – nicht beim Stromlieferanten.** Der Betreiber (bzw. sein Elektrotechniker) stellt vor Baubeginn einen [Netzzugangsantrag](/wissen/lexikon#netzzugangsantrag) für die Einspeisung, erhält ein Anschlusskonzept oder Angebot und schließt den Netzzugangsvertrag ab. Nach der Montage meldet der konzessionierte Elektrotechniker die Fertigstellung, der Netzbetreiber parametriert den Zähler und aktiviert den [Einspeisezählpunkt](/wissen/lexikon#zaehlpunkt).",
        },
        {
          typ: "p",
          text: "Getrennt davon laufen drei weitere Stränge: die baurechtliche und gegebenenfalls elektrizitätsrechtliche Genehmigung nach Landesrecht (siehe [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung)), die Förderung – etwa der [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss), der vor der Umsetzung beantragt werden muss – und der Vertrag über die Abnahme des Überschussstroms. Wer diese Stränge nicht parallel plant, verliert Wochen.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Netzbetreiber", text: "Netzzugangsantrag, Anschlusskonzept, Netzzugangsvertrag, Zählpunkt, Messung und Fertigstellungsmeldung. Zuständig ist z. B. Netz Oberösterreich, Salzburg Netz, Wiener Netze oder Netz NÖ." },
            { titel: "Behörden", text: "Bauanzeige oder Baubewilligung (Gemeinde), elektrizitätsrechtliche Anzeige oder Genehmigung (Land) ab bestimmten Leistungen, bei Betrieben gegebenenfalls Gewerberecht." },
            { titel: "Markt & Förderung", text: "Abnahmevertrag mit Stromhändler oder OeMAG, EAG-Förderung über das EAG-Portal, Herkunftsnachweise, Meldungen an das Finanzamt zur Elektrizitätsabgabe." },
          ],
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Ablauf der Anmeldung Schritt für Schritt",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "p",
          text: "**Die Anmeldung beginnt vor der Bestellung der Komponenten – nicht nach der Montage.** Bei Gewerbeanlagen entscheidet die Antwort des Netzbetreibers darüber, auf welcher [Netzebene](/wissen/lexikon#netzebene) angeschlossen wird, ob eine Trafostation nötig ist und welche Regelungstechnik verlangt wird. Die folgende Reihenfolge hat sich bewährt:",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Netzkapazität vorab prüfen", "Netzbetreiber veröffentlichen verfügbare Netzanschlusskapazitäten (Netzebene 4 bereits heute, Netzebene 6 laut ElWG innerhalb von drei Jahren). Eine informelle Netzanfrage klärt früh, ob der Wunschpunkt die Leistung aufnehmen kann."],
            ["Netzzugangsantrag stellen", "Über Portal oder Formular des Netzbetreibers: Anschrift, Zählpunkt des Bezugs, gewünschter Einspeisebeginn, netzwirksame Leistung am Netzanschlusspunkt, Engpassleistung, bei PV zusätzlich die Modulspitzenleistung, Betriebsart (Voll- oder Überschusseinspeisung), prognostizierte Jahresenergie, Datenblätter und einpoliges Schaltbild."],
            ["Anschlusskonzept prüfen", "Der Netzbetreiber beurteilt Netzrückwirkungen und legt Netzanschlusspunkt, Netzebene, netzwirksame Leistung und das Verfahren zur Blindleistungsbereitstellung fest. Das Anschlusskonzept gilt laut TOR mindestens sechs Monate."],
            ["Netzzugangsvertrag abschließen", "Annahme des Angebots; bei Bedarf Anzahlung zur Reservierung der Kapazität. Laut PV Austria ist die Reservierung innerhalb eines Monats nach der Beantwortung möglich und läuft zwölf Monate."],
            ["Genehmigungen und Förderung", "Bau- und elektrizitätsrechtliche Verfahren nach Landesrecht, EAG-Förderansuchen im laufenden Fördercall, bei Betrieben Klärung der Betriebsanlagengenehmigung."],
            ["Montage und Erstprüfung", "Errichtung durch den konzessionierten Elektrotechniker, Erstprüfung nach ÖVE/ÖNORM E 8101, Dokumentation nach ÖVE/ÖNORM EN 62446-1, Parametrierung der Wechselrichter auf die Ländereinstellung „Österreich“ und die Vorgaben des Netzbetreibers."],
            ["Fertigstellungsmeldung", "Der Elektrotechniker meldet die Fertigstellung mit Prüfbefund, Konformitätserklärung und – je nach Anforderung – Parameterauszug, Prüfbericht des Netzentkupplungsschutzes und Nachweisen nach OVE-Richtlinie R 25."],
            ["Zählpunkt aktivieren", "Der Netzbetreiber stellt die Messung auf Zweirichtung um (in der Regel über den vorhandenen Smart Meter) und aktiviert den Einspeisezählpunkt. Ab jetzt darf eingespeist werden."],
            ["Stromabnahme und Registrierung", "Abnahmevertrag mit Stromhändler, OeMAG oder Energiegemeinschaft; Registrierung der Anlage für Herkunftsnachweise; Meldungen an das Finanzamt, wenn Befreiungen der Elektrizitätsabgabe genutzt werden."],
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Erst einspeisen, wenn der Zählpunkt aktiv ist",
          text: "Eine Anlage darf erst parallel zum Netz betrieben werden, wenn der Netzbetreiber die Inbetriebnahme freigegeben hat. Bis dahin bleiben die Wechselrichter vom Netz getrennt oder laufen – falls technisch vorgesehen und mit dem Netzbetreiber abgestimmt – in Nulleinspeisung. Wer vorher einspeist, riskiert Beanstandungen und Verzögerungen bei der Förderabrechnung.",
        },
      ],
    },
    {
      id: "leistungsklassen",
      titel: "Welche Regeln gelten je nach Anlagengröße?",
      tocLabel: "Leistungsklassen",
      bloecke: [
        {
          typ: "p",
          text: "**Maßgeblich für die technischen Anforderungen ist die Maximalkapazität der Anlage, für Entgelte und Netzanschluss die netzwirksame Leistung am Netzanschlusspunkt.** Die TOR stellen klar: Mehrere Erzeugungseinheiten hinter einem gemeinsamen Netzanschlusspunkt gelten als eine Anlage; PV und Speicher werden in ihrer Gesamtwirkung betrachtet. Die netzwirksame Leistung kann durch ein Regelungskonzept kleiner sein als die installierte Leistung – etwa bei [Einspeisebegrenzung](/wissen/lexikon#einspeisebegrenzung).",
        },
        {
          typ: "tabelle",
          caption: "Schwellenwerte bei der Anmeldung von PV-Anlagen in Österreich, Stand September 2026",
          kopf: ["Leistung", "Was gilt", "Rechtsgrundlage"],
          zeilen: [
            ["unter 0,8 kW", "Kleinsterzeugungsanlage, vereinfachte Behandlung", "Landes-ElWG, TOR"],
            ["ab 3,68 kW netzwirksam", "neue Anlagen müssen vom Netzbetreiber steuerbar sein", "ElWG"],
            ["über 7 kW netzwirksam", "Spitzenkappung auf bis zu 70 % der Modulspitzenleistung bei neuen oder erweiterten PV-Anlagen, ohne Entschädigung, ab 1. 1. 2027", "ElWG"],
            ["bis 15 kW netzwirksam", "kein Netzanschlussentgelt (Regierungsvorlage sah 7 kW vor)", "ElWG, SNE-Verordnung ab 2027"],
            ["bis 20 kW netzwirksam", "kein Versorgungsinfrastrukturbeitrag; darüber höchstens 0,05 ct/kWh eingespeister Energie", "ElWG, ab 1. 1. 2027"],
            ["über 30 kWp", "frei zugängliche manuelle Freischaltstelle üblich", "Netzbetreibervorgaben, ÖBFV-Info E-32"],
            ["0,8 kW bis unter 250 kW", "Stromerzeugungsanlage Typ A", "TOR Stromerzeugungsanlagen Typ A"],
            ["250 kW bis unter 35 MW (unter 110 kV)", "Typ B: FRT-Fähigkeit, Wirkleistungsvorgabe in Stufen, ab 1 MW Online-Sollwerte", "TOR Stromerzeugungsanlagen Typ B"],
            ["über 5 MW netzwirksam", "Netzverlust- und Regelleistungsentgelt für Einspeiser", "SNE-Verordnung"],
          ],
          minBreite: 680,
          fussnote: "Vereinfachte Übersicht; Übergangsbestimmungen und abweichende Netzbetreibervorgaben beachten. Die Höhe der Entgelte legt die Tarifverordnung der E-Control fest, die für 2027 noch aussteht. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Für Betriebe ist vor allem die Grenze bei 250 kW relevant: Ab dort gelten die Anforderungen an Stromerzeugungsanlagen Typ B, und im Mittelspannungsnetz kann ein Park- und Anlagenregler verlangt werden. Was das konkret bedeutet, erklären die Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss) und [EZA-Regler und Parkregler](/ratgeber/eza-regler-parkregler).",
        },
      ],
    },
    {
      id: "unterlagen",
      titel: "Welche Unterlagen braucht der Netzbetreiber?",
      tocLabel: "Unterlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Für den Netzzugangsantrag reichen bei kleinen Anlagen ein Formular und Datenblätter; bei Gewerbeanlagen verlangt der Netzbetreiber zusätzlich Unterlagen zu Schutz, Kurzschlussbeitrag und Regelung.** Die TOR Typ B nennen als Mindestangaben Kontaktdaten und Standort, gewünschten Einspeisebeginn, netzwirksame Leistung, Engpassleistung, Modulspitzenleistung, Betriebsart und prognostizierte Jahresenergie. Je nach Anforderung kommen hinzu:",
        },
        {
          typ: "checkliste",
          punkte: [
            "einpolige Darstellung der elektrischen Anlage mit technischen Daten der Betriebsmittel",
            "Nennstrom oder Nennscheinleistung der Anlage und Kurzschlussstrombeitrag (bei Wechselrichtern überschlägig der Umrichter-Nennstrom)",
            "Beschreibung des Schutzkonzepts mit Schutzfunktionen und Einstellwerten (Netzentkupplungsschutz)",
            "Datenblätter und Zertifikate der Wechselrichter, Nachweise nach OVE-Richtlinie R 25 bzw. anerkannte Prüfberichte mit Ländereinstellung „Österreich“",
            "bei Speichern: Kapazität, Leistung, Kopplungsart (AC/DC) und Betriebskonzept, etwa ob der Speicher aus dem Netz laden darf",
            "Regelungskonzept, wenn die netzwirksame Leistung unter der installierten Leistung liegt (Einspeisebegrenzung, Parkregler)",
            "bei gemeinschaftlichen Anlagen oder Energiegemeinschaften: Angaben zu den teilnehmenden Zählpunkten",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Netzwirksame Leistung bewusst festlegen",
          text: "Die netzwirksame Leistung ist ab 2027 die Grundlage für das Netzanschlussentgelt. Wer 300 kWp installiert, aber dank Eigenverbrauch und Regelung nur 150 kW einspeisen muss, kann mit einem sauberen Regelungskonzept Kosten sparen. Voraussetzung ist ein Regler, der die vereinbarte Grenze zuverlässig einhält – siehe [Parkregler](/technik/parkregler).",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet die Anmeldung? Netzanschlussentgelt ab 2027",
      tocLabel: "Kosten & Entgelte",
      bloecke: [
        {
          typ: "p",
          text: "**Die Anmeldung selbst ist beim Netzbetreiber in der Regel kostenlos; Kosten entstehen durch das Netzanschlussentgelt und notwendige Änderungen der Anschlussanlage.** Mit dem [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz) und der neuen Systematik der Systemnutzungsentgelte ab 1. Jänner 2027 besteht das Netzanschlussentgelt aus einem aufwandsorientierten Anteil (Kosten der Anschlussanlage, für die Netzebenen 4, 6 und 7 als Kostensätze pauschaliert) und einem pauschalen Anteil in Euro je kW netzwirksamer Leistung.",
        },
        {
          typ: "liste",
          punkte: [
            "**Befreiung bis 15 kW:** Einspeiser bis 15 kW netzwirksamer Leistung sind vom Netzanschlussentgelt befreit; PV-Anlagen bis 15 kW können an bestehende Bezugsanschlüsse ohne zusätzliches Entgelt angeschlossen werden.",
            "**Anrechnung bestehender Leistung:** Laut Begutachtungsentwurf der E-Control wird beim erstmaligen Netzzugang in Einspeiserichtung die Bemessungsgrundlage des pauschalen Anteils um 25 % der bestehenden Bezugsleistung reduziert.",
            "**Abschlag für systemdienliche Standorte und flexible Anschlüsse:** Für Anlagen an geeigneten Standorten oder mit dauerhaft flexiblem Netzzugang ist ein prozentueller Abschlag auf den pauschalen Anteil vorgesehen; PV Austria nennt bis zu 30 %.",
            "**Mehrkosten über 25 %:** Übersteigen die tatsächlichen Anschlusskosten die Kostensätze um mehr als 25 %, darf der Netzbetreiber den übersteigenden Betrag gesondert verrechnen.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Entgelte für Einspeiser nach ElWG und SNE-Grundsatzverordnung (Entwurf)",
          text: "Ab 1. 1. 2027 zahlen Einspeiser über 20 kW netzwirksamer Leistung einen jährlichen Versorgungsinfrastrukturbeitrag von höchstens 0,05 ct je eingespeister kWh; die genaue Höhe wird jährlich durch Verordnung festgelegt. Netzverlust- und Regelleistungsentgelt fallen weiterhin nur für Einspeiser über 5 MW an (§§ 12, 13 SNE-G-V-Entwurf). Die Grundsatzverordnung war bis 24. 7. 2026 in Begutachtung; die konkreten Beträge folgen in der Tarifverordnung. Quellen: E-Control, WKO, PV Austria.",
        },
      ],
    },
    {
      id: "zaehlpunkt",
      titel: "Zählpunkt, Messung und Lastprofil",
      tocLabel: "Zählpunkt & Messung",
      bloecke: [
        {
          typ: "p",
          text: "**Jede Einspeisung braucht einen Zählpunkt, über den Netzbetreiber, Stromhändler und gegebenenfalls Energiegemeinschaft die Energiemengen abrechnen.** Die Zählpunktbezeichnung beginnt mit „AT“ und ist 33 Stellen lang. Bei Überschusseinspeisung misst in der Regel derselbe Smart Meter Bezug und Einspeisung; bei Volleinspeisung oder mehreren Anlagen kann eine eigene Messung nötig sein.",
        },
        {
          typ: "p",
          text: "Für Einspeiser mit weniger als 100.000 kWh jährlicher Einspeisung oder weniger als 50 kW Anschlussleistung sehen die Landes-Elektrizitätsgesetze standardisierte Lastprofile vor. Größere Einspeiser werden mit Lastprofilzähler bzw. Viertelstundenmessung abgerechnet. Mehr zu Messgeräten, Viertelstundenwerten und Datenfreigabe lesen Sie im Ratgeber [Smart Meter](/ratgeber/smart-meter-pflicht) und auf der Seite [Smart Meter & Messung](/produkte/smartmeter).",
        },
      ],
    },
    {
      id: "stromabnahme",
      titel: "Wer nimmt den Überschussstrom ab?",
      tocLabel: "Stromabnahme",
      bloecke: [
        {
          typ: "p",
          text: "**Den eingespeisten Strom kaufen Stromhändler, die OeMAG oder – innerhalb einer Energiegemeinschaft – andere Teilnehmer; der Netzbetreiber selbst kauft keinen Strom.** Ohne Abnahmevertrag ist der Einspeisezählpunkt keiner Bilanzgruppe zugeordnet. Die OeMAG veröffentlicht monatlich den Marktpreis nach § 41 Ökostromgesetz 2012; für August 2026 betrug er 8,997 ct/kWh für Photovoltaik.",
        },
        {
          typ: "tabelle",
          caption: "Optionen für die Abnahme von PV-Überschussstrom, Stand September 2026",
          kopf: ["Option", "Preisbildung", "Geeignet für"],
          zeilen: [
            ["Stromhändler / Energieversorger", "Fixpreis, Marktpreis-Indexierung oder Spotpreis minus Abschlag", "alle Größen, oft gemeinsam mit dem Bezugsvertrag"],
            ["OeMAG zum Marktpreis", "monatlicher Marktpreis nach § 41 ÖSG 2012", "Anlagen ohne individuellen Händlervertrag; Bedingungen auf oem-ag.at prüfen"],
            ["Direktvermarktung / PPA", "Spotpreis, Pay-as-produced oder Festpreis", "größere Gewerbe- und Freiflächenanlagen"],
            ["Energiegemeinschaft (EEG, BEG, GEA)", "intern vereinbarter Preis, Netzentgeltvorteil im Nahebereich", "Betriebe mit Überschuss und Nachbarn mit Bedarf"],
          ],
          minBreite: 640,
        },
        {
          typ: "p",
          text: "Welche Variante sich rechnet, hängt von Menge, Einspeiseprofil und Risikobereitschaft ab. Einen Überblick geben die Ratgeber [Reststromvermarktung](/ratgeber/reststromvermarktung), [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis) und [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden).",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler bei der Anmeldung von Gewerbeanlagen",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Module bestellt, bevor die Netzantwort vorliegt.** Wird ein Anschluss erst auf der nächsthöheren Netzebene möglich, ändern sich Kosten, Zeitplan und Technik grundlegend.",
            "**Netzwirksame Leistung zu hoch beantragt.** Das treibt ab 2027 das Netzanschlussentgelt; ein Regelungskonzept mit Einspeisebegrenzung ist oft günstiger.",
            "**Förderung nach Auftragsvergabe beantragt.** Beim EAG-Investitionszuschuss zählt der Zeitpunkt des Förderansuchens; Details im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss).",
            "**Wechselrichter nicht auf Ländereinstellung „Österreich“ parametriert** oder ohne passende Nachweise nach OVE-Richtlinie R 25 – das führt zu Nachforderungen bei der Fertigstellungsmeldung.",
            "**Speicher nicht mitgemeldet.** Speicher verändern Maximalkapazität und Betriebskonzept und müssen im Antrag angegeben werden.",
            "**Abnahmevertrag vergessen.** Ohne Vertrag wird der Überschuss nicht vergütet, obwohl der Zählpunkt aktiv ist.",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wo melde ich eine PV-Anlage in Österreich an?",
      a: "Beim Verteilernetzbetreiber, an dessen Netz Ihr Standort angeschlossen ist – etwa Netz Oberösterreich, Salzburg Netz oder Wiener Netze. Vor der Montage stellen Sie den Netzzugangsantrag, danach meldet Ihr Elektrotechniker die Fertigstellung. Bau- und elektrizitätsrechtliche Pflichten nach Landesrecht kommen gegebenenfalls hinzu.",
    },
    {
      q: "Wie lange dauert die Anmeldung beim Netzbetreiber?",
      a: "Bei Kleinanlagen oft wenige Wochen, bei Gewerbeanlagen mit Netzprüfung deutlich länger. Das Anschlusskonzept gilt laut TOR mindestens sechs Monate; eine Kapazitätsreservierung läuft laut PV Austria zwölf Monate. Planen Sie die Netzanfrage deshalb vor der Bestellung der Komponenten ein.",
    },
    {
      q: "Muss ich für die Einspeisung ab 2027 Netzentgelte zahlen?",
      a: "Einspeiser über 20 kW netzwirksamer Leistung zahlen ab 1. Jänner 2027 einen Versorgungsinfrastrukturbeitrag von höchstens 0,05 ct/kWh. Bis 15 kW entfällt außerdem das Netzanschlussentgelt. Netzverlust- und Regelleistungsentgelt betreffen nur Einspeiser über 5 MW. Details im Ratgeber [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
    },
    {
      q: "Was ist die Fertigstellungsmeldung?",
      a: "Mit der Fertigstellungsmeldung bestätigt der konzessionierte Elektrotechniker dem Netzbetreiber, dass die Anlage normgerecht errichtet und geprüft wurde. Beigelegt werden Prüfbefund, Konformitätserklärung und je nach Netzbetreiber Parameterauszug und Schutzprüfbericht. Danach wird der Einspeisezählpunkt aktiviert.",
    },
    {
      q: "Brauche ich für die PV-Anlage einen neuen Zähler?",
      a: "Meist nicht. Der vorhandene Smart Meter misst Bezug und Einspeisung und wird vom Netzbetreiber auf Zweirichtung parametriert. Bei Volleinspeisung, mehreren Anlagen oder größeren Leistungen kann eine eigene Messung oder ein Lastprofilzähler nötig sein.",
    },
    {
      q: "Darf der Netzbetreiber meine Einspeisung begrenzen?",
      a: "Ja. Neue Anlagen ab 3,68 kW müssen steuerbar sein, und ab 1. Jänner 2027 darf der Netzbetreiber neue oder erweiterte PV-Anlagen über 7 kW bei Bedarf auf bis zu 70 % der Modulspitzenleistung begrenzen – ohne Entschädigung. Bestehende, unveränderte Anlagen sind davon nicht betroffen.",
    },
  ],

  howTo: {
    name: "PV-Anlage in Österreich beim Netzbetreiber anmelden",
    schritte: [
      { name: "Netzkapazität prüfen", text: "Verfügbare Anschlusskapazität beim Netzbetreiber anfragen oder in der veröffentlichten Kapazitätskarte prüfen." },
      { name: "Netzzugangsantrag stellen", text: "Leistungsdaten, Modulspitzenleistung, Betriebsart, Jahresenergie und technische Unterlagen über das Portal des Netzbetreibers einreichen." },
      { name: "Anschlusskonzept annehmen", text: "Netzanschlusspunkt, netzwirksame Leistung und Blindleistungsverfahren prüfen und den Netzzugangsvertrag abschließen." },
      { name: "Genehmigungen und Förderung einholen", text: "Bau- und elektrizitätsrechtliche Verfahren nach Landesrecht klären und das Förderansuchen rechtzeitig stellen." },
      { name: "Anlage errichten und prüfen", text: "Montage durch den Elektrotechniker, Erstprüfung nach ÖVE/ÖNORM E 8101 und Parametrierung nach Netzbetreibervorgaben." },
      { name: "Fertigstellung melden", text: "Fertigstellungsmeldung mit Prüfbefund und Nachweisen einreichen; der Netzbetreiber aktiviert den Einspeisezählpunkt." },
      { name: "Stromabnahme regeln", text: "Abnahmevertrag mit Stromhändler, OeMAG oder Energiegemeinschaft abschließen." },
    ],
  },

  passend: [
    { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "TOR Erzeuger & Netzanschluss", text: "Typ A bis D, Netzebenen und Netzprüfung." },
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "Photovoltaik-Genehmigung", text: "Bau- und Elektrizitätsrecht in den neun Ländern." },
    { href: "/technik/parkregler", titel: "Ökovolt Parkregler", text: "EZA-Regler für Anlagen im Mittelspannungsnetz." },
    { href: "/gewerbe", titel: "Photovoltaik für Betriebe", text: "Planung, Anmeldung und Bau aus einer Hand." },
  ],

  quellen: [
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.3", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.3.pdf/ff57fdfb-99ec-7442-36f2-6de5f17601ad?t=1718018782590", stand: "07/2024" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ B, Version 1.3", url: "https://www.e-control.at/documents/1785851/0/TOR+Stromerzeugungsanlagen+Typ+B+Version+1.3.pdf/90369a06-566e-1344-f9ad-167ec4731d57?t=1718018823128", stand: "07/2024" },
    { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", stand: "09/2026" },
    { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "WKO – Information zum finalen Elektrizitätswirtschaftsgesetz", url: "https://www.wko.at/noe/transport-verkehr/spedition-logistik/elwg", stand: "09/2026" },
    { titel: "PV Austria – Netzthemen (Netzanschluss, Kapazitäten, Entgelte)", url: "https://pvbaustria.at/netzthemen/", stand: "09/2026" },
    { titel: "OeMAG – Marktpreis Photovoltaik", url: "https://www.oem-ag.at/", stand: "09/2026" },
    { titel: "ÖBFV – Info E-32 Photovoltaikanlagen und deren Speicheranlagen", url: "https://www.bundesfeuerwehrverband.at/wp-content/uploads/2024/07/E-32-Info_2024.pdf", stand: "03/2024" },
  ],

  seitenCta: { titel: "Anmeldung übernehmen lassen?", text: "Wir stellen Netzzugangsantrag und Fertigstellungsmeldung für Ihre Anlage.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Netzanfrage, Anmeldung, Inbetriebnahme – aus einer Hand.",
    text: "Ökovolt Solartechnik aus Ostermiething plant und errichtet PV-Anlagen für Betriebe und Gemeinden in ganz Österreich – inklusive Abstimmung mit dem Netzbetreiber.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Photovoltaik für Betriebe", href: "/gewerbe" },
  },
};

export default artikel;
