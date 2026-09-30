// Ratgeber: EAG-Investitionszuschuss 2026 für Photovoltaik und Stromspeicher
// Rechtsstand 09/2026: § 56 EAG, EAG-IZV BGBl. II Nr. 64/2023 idF EAG-IZV-Novelle 2026 (BGBl. II Nr. 12/2026),
// konsolidierte Fassung 19.01.2026 (OeMAG-PDF), OeMAG/WKO/PV&B-Austria-Informationen, PV&B-Meldungen 07/2026 und 08/2026.
// Rechenbeispiele: eigene Rechnung und pvcalc.mjs (R1-Standardannahmen), gerundet. Keine Imports.

const artikel = {
  slug: "eag-investitionszuschuss",
  title: "EAG-Zuschuss beantragen: Förderbedarf bieten, Fristen, Rechenbeispiele",
  seoTitle: "EAG-Zuschuss beantragen: Schritte & Fehler | Ökovolt",
  kurzTitel: "EAG-Investitionszuschuss",
  description:
    "EAG-Zuschuss beantragen 2026: Förderbedarf in Kategorie C und D richtig bieten, Fristen, nicht förderfähige Kosten und Rechenbeispiele für 30 bis 500 kWp.",
  excerpt:
    "Die Bundesförderung für PV-Anlagen und Speicher in Österreich: welche Sätze 2026 gelten, wie Kategorie C und D gereiht werden, welche Zuschläge es gibt und warum Ihr Projekt auch ohne Zuschuss rechnen sollte.",
  hauptKeyword: "eag zuschuss beantragen",
  keywords: [
    "EAG Investitionszuschuss 2026",
    "OeMAG Fördercall Oktober 2026",
    "PV Förderung Österreich Gewerbe",
    "EAG Förderung Kategorie D",
    "Made in Europe Bonus Photovoltaik",
    "Stromspeicher Förderung EAG",
    "EAG-IZV Novelle 2026",
    "Förderbedarf pro kWp",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-30",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/AT/ratgeber/eag-investitionszuschuss.jpg",
  bildAlt: "Photovoltaikanlage am Spitalberg in Klagenfurt, Kärnten",
  badge: { wert: "8.–22.10.", text: "letzter EAG-Fördercall 2026 für PV und Speicher" },

  kurzFazit: [
    "**Der EAG-Investitionszuschuss ist die Bundesförderung für neue oder erweiterte PV-Anlagen bis 1.000 kWp und dazugehörige Stromspeicher.** 2026 gelten 150 €/kWp (Kategorie A), 140 €/kWp (B), höchstens 130 €/kWp (C) und höchstens 120 €/kWp (D), für Speicher 150 €/kWh.",
    "**Der letzte Fördercall 2026 läuft vom 8. bis 22. Oktober** – mit nur je 2 Mio. € pro Kategorie. In Kategorie C und D gewinnt, wer den niedrigsten Förderbedarf in €/kWp bietet.",
    "**Der Zuschuss ist auf 30 % der förderfähigen Nettokosten gedeckelt;** Made-in-Europe-Komponenten bringen bis zu +20 %, innovative Anlagen wie Parkplatzüberdachungen ab 10 Stellplätzen +30 %.",
    "**Planen Sie ohne Zuschuss:** Im Juni-Call entschieden 33 Sekunden über Zu- oder Absage. Eine 100-kWp-Anlage mit 60 % Eigenverbrauch amortisiert sich in unserem Beispiel auch ohne Förderung in rund 6 Jahren, mit 13.000 € Zuschuss in rund 5 Jahren.",
    "Kategorien, Sätze und alle Bundesprogramme im Überblick stehen auf der Seite [Bundesförderung für Photovoltaik](/forderungen/bundesfoerderung); dieser Ratgeber vertieft Antrag, Gebot und Fristen.",
  ],

  abschnitte: [
    {
      id: "ueberblick",
      titel: "Was ist der EAG-Investitionszuschuss?",
      tocLabel: "Überblick",
      bloecke: [
        {
          typ: "p",
          text: "**Der EAG-Investitionszuschuss ist ein einmaliger, nicht rückzahlbarer Zuschuss des Bundes für die Neuerrichtung oder Erweiterung von Photovoltaikanlagen bis 1.000 kWp sowie für gleichzeitig neu errichtete Stromspeicher.** Rechtsgrundlage sind § 56 des Erneuerbaren-Ausbau-Gesetzes ([EAG](/wissen/lexikon#eag)) und die EAG-Investitionszuschüsseverordnung Strom (EAG-IZV), zuletzt geändert durch die Novelle 2026 (BGBl. II Nr. 12/2026). Abgewickelt wird die Förderung von der [OeMAG](/wissen/lexikon#oemag) als EAG-Förderabwicklungsstelle, ausschließlich online und nur in festgelegten Zeitfenstern, den Fördercalls.",
        },
        {
          typ: "p",
          text: "Antragsberechtigt sind natürliche und juristische Personen – Unternehmen, Landwirte, Gemeinden und Private. Der Zuschuss wird nach Inbetriebnahme und geprüfter Endabrechnung ausbezahlt. Steuerlich mindert er die Anschaffungskosten und damit Abschreibung und [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik). Für größere Anlagen gibt es als zweite Schiene die Marktprämie aus Ausschreibungen; sie wird hier nicht behandelt.",
        },
      ],
    },
    {
      id: "kategorien-saetze",
      titel: "Kategorien und Fördersätze 2026",
      tocLabel: "Kategorien & Sätze",
      bloecke: [
        {
          typ: "p",
          text: "**Die Förderung ist nach Anlagengröße in vier Kategorien gestaffelt; 2026 sinken die Sätze gegenüber 2025 um je 10 €/kWp.** In Kategorie A und B gilt ein fixer Satz und die Reihung nach Einreichzeitpunkt, in C und D ein Höchstsatz, unter dem Sie Ihren Förderbedarf selbst angeben. Maßgeblich für die Kategorie ist die beantragte Leistung.",
        },
        {
          typ: "tabelle",
          caption: "Fördersätze EAG-Investitionszuschuss für PV und Speicher, 2026 im Vergleich zu 2025",
          kopf: ["Kategorie", "Leistung", "Satz 2026", "Satz 2025", "Reihung"],
          zeilen: [
            ["A", "bis 10 kWp", "150 €/kWp (fix)", "160 €/kWp", "Einreichzeitpunkt"],
            ["B", "über 10 bis 20 kWp", "140 €/kWp (fix)", "150 €/kWp", "Einreichzeitpunkt"],
            ["C", "über 20 bis 100 kWp", "max. 130 €/kWp", "max. 140 €/kWp", "Förderbedarf in €/kWp, dann Zeitpunkt"],
            ["D", "über 100 bis 1.000 kWp", "max. 120 €/kWp", "max. 130 €/kWp", "Förderbedarf in €/kWp, dann Zeitpunkt"],
            ["Speicher", "mit neuer/erweiterter PV, gefördert bis 50 kWh", "150 €/kWh (fix)", "–", "an den PV-Antrag gekoppelt"],
          ],
          hervorheben: 2,
          minBreite: 700,
          fussnote: "Quellen: EAG-IZV § 5 in der Fassung vom 19.01.2026, WKO und PV&B Austria. Allgemeine Obergrenze: 30 % der förderfähigen Nettokosten (§ 11 Abs. 1a EAG-IZV). Speicher: mindestens 0,5 kWh je kWp und höchstens 50 kWh je Anlage (§ 56 EAG), reine Speicher und Speichererweiterungen sind nicht förderbar (§ 3 Abs. 2 EAG-IZV).",
        },
      ],
    },
    {
      id: "foerdercalls",
      titel: "Fördercalls 2026: Termine und Budgets",
      tocLabel: "Fördercalls & Budgets",
      bloecke: [
        {
          typ: "p",
          text: "**Für PV und Speicher stehen 2026 drei Fördercalls mit insgesamt 60 Mio. € zur Verfügung; der dritte und letzte läuft vom 8. bis 22. Oktober 2026.** Mit je 2 Mio. € pro Kategorie ist er der kleinste des Jahres. Rechnerisch reichen die Mittel in Kategorie D bei Höchstsatz für rund 16,7 MWp, in Kategorie C für rund 15,4 MWp.",
        },
        {
          typ: "tabelle",
          caption: "Fördercalls und Budgets für Photovoltaik und Stromspeicher 2026",
          kopf: ["Fördercall", "Kategorie A", "Kategorie B", "Kategorie C", "Kategorie D"],
          zeilen: [
            ["23.4.–11.5.2026", "5 Mio. €", "5 Mio. €", "15 Mio. €", "15 Mio. €"],
            ["16.6.–30.6.2026", "2 Mio. €", "2 Mio. €", "4 Mio. €", "4 Mio. €"],
            ["8.10.–22.10.2026", "2 Mio. €", "2 Mio. €", "2 Mio. €", "2 Mio. €"],
          ],
          markierteZeile: 2,
          minBreite: 620,
          fussnote: "Quelle: § 5 Abs. 1 EAG-IZV idF BGBl. II Nr. 12/2026. Alle Kategorien starten im jeweiligen Call gleichzeitig. Ticketziehung am ersten Tag ab 17:00 Uhr, Antragseinreichung ab dem Folgetag 8:00 Uhr (OeMAG/PV&B Austria).",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Ticket am 8. Oktober ab 17:00 Uhr",
          text: "Am ersten Tag des Calls kann über die Vorschaltseite der OeMAG ein Ticket gezogen werden; es wird über die Zählpunktnummer der Einspeisung Ihrem Projekt zugeordnet und gilt als Einreichzeitpunkt. Der Antrag muss dann bis zum Ende desselben Calls eingereicht werden, sonst verfällt das Ticket. Halten Sie Zählpunktnummer, Anschlussbestätigung, Genehmigungen und Kostenaufstellung deshalb vor dem 8. Oktober bereit.",
        },
      ],
    },
    {
      id: "reihung",
      titel: "Kategorie C und D: Förderbedarf richtig bieten",
      tocLabel: "Reihung C/D",
      bloecke: [
        {
          typ: "p",
          text: "**In Kategorie C und D geben Sie im Antrag an, wie viele Euro pro kWp Sie brauchen – bis zum Höchstsatz. Gereiht wird aufsteigend nach diesem Förderbedarf, bei gleichem Wert nach dem Einreichzeitpunkt.** Die Branche spricht von einem umgekehrten Bieterverfahren. Wer 120 €/kWp beantragt, kommt nach allen, die weniger verlangen. Der angegebene Förderbedarf kann nach der Einreichung nicht mehr geändert werden.",
        },
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Wirtschaftlichkeit ohne Zuschuss rechnen.** Wenn das Projekt auch ohne Förderung trägt, ist jeder Euro Zuschuss ein Bonus – und Sie können niedrig bieten.",
            "**Zielrendite festlegen und Förderbedarf daraus ableiten.** Fehlen etwa 5.000 € zur gewünschten Amortisation einer 100-kWp-Anlage, entspricht das 50 €/kWp.",
            "**Nicht reflexartig den Höchstsatz beantragen.** Liegen viele Anträge auf dem Höchstsatz, wird ein Gebot knapp darunter vor all diesen gereiht – der Einreichzeitpunkt entscheidet erst bei Gleichstand.",
            "**Kategorie bewusst wählen.** Bis 100 kWp gilt Kategorie C mit höherem Satz, kürzerer Inbetriebnahmefrist und Kombinierbarkeit mit Landesförderungen. Wird mehr Leistung errichtet als beantragt, gibt es für die Mehrleistung keinen Zuschuss (§ 12 Abs. 3 EAG-IZV).",
            "**Kein Zuschlag heißt nicht Ende.** Laut PV&B Austria kann ein nicht bedeckter Antrag im nächsten Call erneut eingereicht werden; bei exakt gleichem Projekt bleibt der Anreizeffekt auch nach zwischenzeitlicher Inbetriebnahme erhalten.",
          ],
        },
      ],
    },
    {
      id: "zuschlaege",
      titel: "Zuschläge und Abschläge: Made in Europe, Innovation, Freifläche",
      tocLabel: "Zu- & Abschläge",
      bloecke: [
        {
          typ: "p",
          text: "**Der Grundzuschuss verändert sich durch drei Faktoren: bis zu +20 % für europäische PV-Komponenten, +30 % für innovative Anlagen und −25 % für Anlagen auf landwirtschaftlich genutzten Flächen oder im Grünland.** Zuerst wird ein Innovationszuschlag oder Flächenabschlag angewendet, auf das Ergebnis dann der Made-in-Europe-Zuschlag (§ 6 Abs. 9 EAG-IZV).",
        },
        {
          typ: "tabelle",
          caption: "Zu- und Abschläge nach § 6 EAG-IZV (Anträge ab 23.6.2025)",
          kopf: ["Merkmal", "Auswirkung", "Voraussetzung"],
          zeilen: [
            ["Module mit europäischer Wertschöpfung", "+10 %", "alle Fertigungsschritte laut Anlage 1 in EU/EWR/Schweiz; Hersteller auf der Liste der Förderstelle"],
            ["Wechselrichter mit europäischer Wertschöpfung", "+10 %", "wie oben; PV-Zuschlag insgesamt max. +20 %"],
            ["Speicher mit europäischer Wertschöpfung", "+10 % auf den Speicherzuschuss", "mindestens ein Fertigungsschritt in EU/EWR/Schweiz"],
            ["Innovative PV-Anlage", "+30 %", "gebäudeintegriert, schwimmend, Parkplatzüberdachung ab 10 Stellplätzen (Module bilden das Dach), Lärmschutzwand, Staumauer, Agri-PV vertikal oder ab 2 m Unterkante"],
            ["Landwirtschaftliche Fläche / Grünland", "−25 %", "entfällt u. a. auf Gebäuden (mind. 18 Monate vor Antrag fertiggestellt), Deponien, Bergbau- und Infrastrukturstandorten sowie bei Agri-PV mit mind. 75 % landwirtschaftlicher Nutzung"],
          ],
          minBreite: 720,
          fussnote: "Quelle: § 6 Abs. 1–10 EAG-IZV, Fassung vom 19.01.2026. Bei Zuschlägen gilt statt 30 % eine Förderobergrenze von 65 % (kleine), 55 % (mittlere) bzw. 45 % (große Unternehmen), für Speicher mit Zuschlag 50/40/30 % (§ 11 Abs. 2).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Parkplatzüberdachung: +30 % für den Kundenparkplatz",
          text: "Ein Solarcarport über mindestens 10 Pkw- oder Fahrradstellplätzen auf befestigter Fläche gilt als innovative Anlage, wenn die Module selbst die Überdachung bilden. Bei einer 100-kWp-Überdachung steigt der Zuschuss damit von höchstens 13.000 € auf 16.900 €, mit europäischen Modulen und Wechselrichtern auf 20.280 €. Planung, Statik und Ladeinfrastruktur erklärt der Ratgeber [Solarcarport](/ratgeber/solarcarport).",
        },
        {
          typ: "p",
          text: "Für Freiflächen- und Agri-PV-Projekte gelten zusätzlich Auflagen wie rückstandslose Rückbaubarkeit, mindestens 80 cm Modulunterkante, 2 m Reihenabstand und fünf von zehn Biodiversitätsmaßnahmen (§ 4 Abs. 2 EAG-IZV). Details zu Widmung und Förderung im Ratgeber [Agri-PV in Österreich](/ratgeber/agri-pv-oesterreich).",
        },
      ],
    },
    {
      id: "voraussetzungen",
      titel: "Voraussetzungen, Fristen und nicht förderfähige Kosten",
      tocLabel: "Voraussetzungen & Fristen",
      bloecke: [
        {
          typ: "p",
          text: "**Gefördert wird nur, wer den Antrag vor der Inbetriebnahme stellt und dabei alle Genehmigungen bzw. Anzeigen in erster Instanz sowie die Bestätigung der Anschlussmöglichkeit durch den Netzbetreiber vorlegt.** Mit dem Bau darf bereits vor dem Antrag begonnen werden, jedoch nicht vor dem 21. April 2022. Errichten muss ein befugter Fachbetrieb; öffentliche Auftraggeber haben das Vergaberecht einzuhalten, andere Förderwerber können zur Vorlage von zwei Vergleichsangeboten aufgefordert werden.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Netzzugangsantrag gestellt, Zählpunktnummer und Anschlussbestätigung vorhanden – Schritt für Schritt im Ratgeber [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden).",
            "Baubewilligung, Bauanzeige oder elektrizitätsrechtliche Genehmigung liegen in erster Instanz vor, soweit erforderlich.",
            "Technische Projektbeschreibung und Kostenaufstellung netto, bei C und D Förderbedarf in €/kWp.",
            "Inbetriebnahme bis 100 kWp binnen 6 Monaten ab Fördervertrag (zweimal um bis zu 9 Monate verlängerbar), darüber binnen 12 Monaten (einmal um bis zu 12 Monate).",
            "Endabrechnung spätestens 6 Monate nach Ende der Inbetriebnahmefrist, einmal um bis zu 6 Monate verlängerbar: Rechnungen, unbare Zahlungsnachweise, Inbetriebnahmenachweis, Prüfprotokoll, Netzanschlussnachweis.",
            "Registrierung in der Herkunftsnachweisdatenbank – übernimmt meist der Netzbetreiber oder Stromabnehmer.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Diese Kosten fördert der EAG-Zuschuss nicht",
          text: "Grundstückskosten und Pacht, Steuern und Gebühren, Netzausbau, Finanzierungskosten, Kostenüberschreitungen, Eigenleistungen, reine Materialrechnungen ohne Montage durch eine Fachfirma, Dacheindeckung, Skonti und Rabatte, Entsorgung, Displays sowie Ersatzteile und gebrauchte Anlagenteile (§ 10 Abs. 4 EAG-IZV). Die förderfähigen Kosten sind deshalb meist niedriger als die Angebotssumme.",
        },
        { typ: "h3", text: "Kombination mit anderen Förderungen" },
        {
          typ: "p",
          text: "Anlagen der Kategorien A, B und C sowie innovative Anlagen dürfen mit Bundes-, Landes- und Gemeindeförderungen kombiniert werden, solange die beihilferechtlichen Obergrenzen eingehalten werden. **Kategorie D ist dagegen nicht mit anderen Förderungen kombinierbar** (ausgenommen die frühere Investitionsprämie, § 3 Abs. 6 EAG-IZV). Andere beantragte Förderungen müssen Sie der OeMAG melden. Welche Landesprogramme es gibt, zeigt die Übersicht [Landesförderungen](/forderungen/landesforderungen); steuerliche Instrumente wie der Investitionsfreibetrag sind keine Förderung in diesem Sinn und bleiben nutzbar.",
        },
      ],
    },
    {
      id: "rechenbeispiele",
      titel: "Rechenbeispiele: Zuschuss für 30, 100 und 500 kWp",
      tocLabel: "Rechenbeispiele",
      bloecke: [
        {
          typ: "p",
          text: "**Wie hoch der Zuschuss ausfällt, hängt in Kategorie C und D vor allem vom eigenen Gebot ab.** Die Tabelle zeigt drei typische Gewerbeprojekte mit Höchstsatz, mit niedrigerem Gebot und mit Zuschlägen.",
        },
        {
          typ: "tabelle",
          caption: "EAG-Investitionszuschuss 2026: Beispielrechnungen für drei Anlagengrößen",
          kopf: ["Projekt", "Förderfähige Kosten (Annahme)", "Höchstsatz", "Niedrigeres Gebot", "Mit Zuschlägen"],
          zeilen: [
            ["30 kWp + 15 kWh Speicher (Kat. C)", "27.000 € PV + 9.750 € Speicher", "3.900 € + 2.250 € = 6.150 €", "100 €/kWp: 3.000 € + 2.250 € = 5.250 €", "EU-Module, -WR und -Speicher: 4.680 € + 2.475 € = 7.155 €"],
            ["100 kWp Hallendach (Kat. C)", "75.000 €", "13.000 € (17 %)", "100 €/kWp: 10.000 €", "EU-Module und -WR: 15.600 €"],
            ["100 kWp Parkplatzüberdachung (Kat. C, innovativ)", "je nach Ausführung", "16.900 €", "100 €/kWp: 13.000 €", "zusätzlich EU-Module und -WR: 20.280 €"],
            ["500 kWp Hallendach (Kat. D)", "300.000 €", "60.000 € (20 %)", "90 €/kWp: 45.000 €", "EU-Module: 66.000 €"],
            ["500 kWp auf Grünland (Kat. D)", "je nach Ausführung", "45.000 € (−25 %)", "90 €/kWp: 33.750 €", "EU-Module: 49.500 €"],
          ],
          markierteZeile: 1,
          minBreite: 820,
          fussnote: "Eigene Rechnung nach § 5, § 6 und § 11 EAG-IZV. Kostenannahmen netto (Richtwerte 2026, keine Ökovolt-Preise): 30 kWp 900 €/kWp, 100 kWp 750 €/kWp, 500 kWp 600 €/kWp, Speicher 650 €/kWh nutzbar. Die 30-%-Obergrenze greift in keinem Beispiel. Bei der Parkplatzüberdachung würde die 45-%-Grenze für große Unternehmen erst unter rund 450 €/kWp förderfähigen Kosten greifen. Ein 500-kWp-Projekt mit Speicher bräuchte mindestens 250 kWh, gefördert würden höchstens 50 kWh (7.500 €).",
        },
        {
          typ: "tool",
          href: "/foerdercheck",
          titel: "Welche Förderung passt zu Ihrem Projekt?",
          text: "Der Förder-Check fasst Bundesförderung, Landesprogramme und steuerliche Vorteile für Ihren Standort zusammen.",
          label: "Förder-Check starten",
        },
      ],
    },
    {
      id: "ohne-zuschuss",
      titel: "Förderlotterie und Ausblick: Warum Ihr Projekt ohne Zuschuss rechnen muss",
      tocLabel: "Ohne Zuschuss rechnen",
      bloecke: [
        {
          typ: "p",
          text: "**Der EAG-Zuschuss ist 2026 kein verlässlicher Baustein einer Investitionsrechnung mehr.** Beim Fördercall im Juni entschieden laut Bundesverband PV&B Austria gerade einmal 33 Sekunden darüber, welche Projekte eine Zusage erhielten. Der Verband sprach von einer Förderlotterie und forderte einen Neustart sowie steuerliche Investitionsanreize. Im August kündigte Staatssekretärin Elisabeth Zehetner in der ZIB2 an, dass es für Photovoltaik künftig möglicherweise keine Förderung mehr geben werde und stattdessen eher Speicher gefördert werden könnten – mit Verweis auf rund 90 % Kostenrückgang in zehn Jahren.",
        },
        {
          typ: "tabelle",
          caption: "Wirtschaftlichkeit mit und ohne EAG-Zuschuss (vor Steuern, 25 Jahre)",
          kopf: ["Projekt", "Investition", "Vorteil Jahr 1", "Amortisation", "Rendite (IRR)"],
          zeilen: [
            ["100 kWp ohne Zuschuss", "75.000 €", "11.700 €", "6,2 Jahre", "16,3 %"],
            ["100 kWp mit 13.000 € Zuschuss", "62.000 €", "11.700 €", "5,2 Jahre", "19,7 %"],
            ["500 kWp ohne Zuschuss", "300.000 €", "46.500 €", "6,3 Jahre", "16,0 %"],
            ["500 kWp mit 60.000 € Zuschuss", "240.000 €", "46.500 €", "5,1 Jahre", "20,1 %"],
          ],
          hervorheben: 3,
          minBreite: 640,
          fussnote: "Eigene Rechnung (R1-Rechenkern). 100 kWp: 750 €/kWp, 60 % Eigenverbrauch, 18 ct/kWh vermeidbarer Strompreis, Betriebskosten 15 €/kWp. 500 kWp: 600 €/kWp, 50 % Eigenverbrauch, 15 ct/kWh, 12 €/kWp. Jeweils 1.000 kWh/kWp, 0,4 % Degradation, Überschuss 6 ct/kWh, Strompreis +2 % pro Jahr. Ohne Steuerwirkung, Speicher und Finanzierung.",
        },
        {
          typ: "p",
          text: "Die Rechnung zeigt: Eine gut auf den Eigenverbrauch ausgelegte Gewerbeanlage amortisiert sich auch ohne Förderung in gut sechs Jahren. Der Zuschuss verkürzt das um rund ein Jahr – angenehm, aber nicht entscheidend. Wichtiger sind richtige Dimensionierung nach Lastgang, ein realistischer Überschusserlös (siehe [Einspeisetarif Österreich 2026](/ratgeber/einspeiseverguetung-2026)) und die Steuerwirkung, die der Ratgeber [Photovoltaik & Steuern](/ratgeber/photovoltaik-steuern) erklärt. Eine vollständige Amortisationsrechnung mit Varianten finden Sie im Ratgeber [Photovoltaik-Amortisation](/ratgeber/photovoltaik-amortisation).",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Was 2027 kommt, ist offen",
          text: "Stand September 2026 gibt es keine veröffentlichte Verordnung für die Investitionszuschüsse 2027. Ob PV weiter gefördert wird oder das Geld in eine Speicherförderung wandert, entscheidet sich politisch. Wir aktualisieren diesen Ratgeber, sobald die OeMAG neue Calls bekanntgibt.",
        },
      ],
    },
  ],

  howTo: {
    name: "EAG-Investitionszuschuss für eine PV-Anlage beantragen",
    schritte: [
      { name: "Wirtschaftlichkeit ohne Zuschuss prüfen", text: "Anlagengröße nach Lastgang festlegen und Amortisation ohne Förderung rechnen. Daraus den minimal nötigen Förderbedarf in €/kWp ableiten." },
      { name: "Netzzugang und Zählpunkt sichern", text: "Netzzugangsantrag beim Netzbetreiber stellen und Bestätigung der Anschlussmöglichkeit sowie Zählpunktnummer der Einspeisung einholen." },
      { name: "Genehmigungen einholen", text: "Baubewilligung, Bauanzeige oder elektrizitätsrechtliche Genehmigung in erster Instanz besorgen, soweit das Projekt sie braucht." },
      { name: "Angebote und Komponenten festlegen", text: "Angebot eines befugten Fachbetriebs mit nachvollziehbarer Kostenaufstellung einholen; bei Bedarf Vergleichsangebote bzw. Vergaberecht beachten und Made-in-Europe-Komponenten auf der Herstellerliste prüfen." },
      { name: "Projekt im EAG-Portal anlegen", text: "Projekt bei der OeMAG-Förderabwicklungsstelle erfassen und Unterlagen hochladen: Projektbeschreibung, Kosten, Anschlussbestätigung, Genehmigungsnachweise." },
      { name: "Ticket ziehen und Antrag einreichen", text: "Am 8. Oktober 2026 ab 17:00 Uhr Ticket ziehen, ab 9. Oktober 8:00 Uhr bis spätestens 22. Oktober den Antrag einreichen – bei Kategorie C und D mit Förderbedarf in €/kWp, jedenfalls vor Inbetriebnahme." },
      { name: "Fördervertrag abwarten und errichten", text: "Nach Annahme des Antrags kommt der Fördervertrag per E-Mail zustande. Anlage innerhalb von 6 Monaten (bis 100 kWp) bzw. 12 Monaten (über 100 kWp) in Betrieb nehmen; Änderungen vorab der Förderstelle melden." },
      { name: "Endabrechnung einreichen", text: "Spätestens 6 Monate nach Ende der Inbetriebnahmefrist Rechnungen, unbare Zahlungsnachweise, Inbetriebnahmenachweis, Prüfprotokoll und Netzanschlussnachweis hochladen. Danach wird der Zuschuss ausbezahlt." },
    ],
  },

  faq: [
    {
      q: "Wann ist der nächste EAG-Fördercall für Photovoltaik?",
      a: "Der letzte Call 2026 läuft vom 8. bis 22. Oktober 2026 für alle Kategorien gleichzeitig. Ein Ticket kann am 8. Oktober ab 17:00 Uhr gezogen werden, Anträge sind ab dem Folgetag 8:00 Uhr möglich. Termine für 2027 sind noch nicht veröffentlicht.",
    },
    {
      q: "Wie viel Förderung gibt es 2026 pro kWp?",
      a: "Kategorie A (bis 10 kWp) 150 €/kWp, Kategorie B (bis 20 kWp) 140 €/kWp, Kategorie C (bis 100 kWp) höchstens 130 €/kWp und Kategorie D (bis 1.000 kWp) höchstens 120 €/kWp. Der Zuschuss ist auf 30 % der förderfähigen Nettokosten begrenzt.",
    },
    {
      q: "Wird ein Stromspeicher über das EAG gefördert?",
      a: "Ja, mit 150 €/kWh, aber nur zusammen mit einer neu errichteten oder erweiterten PV-Anlage und bis höchstens 50 kWh. Reine Speicher und Speichererweiterungen sind nicht förderfähig. Mit europäischer Wertschöpfung gibt es 10 % Zuschlag.",
    },
    {
      q: "Darf ich schon vor dem Förderantrag mit dem Bau beginnen?",
      a: "Ja. Der Arbeitsbeginn darf nur nicht vor dem 21. April 2022 liegen. Entscheidend ist, dass die Anlage beim ersten Antrag noch nicht in Betrieb genommen wurde und alle Genehmigungen sowie die Anschlussbestätigung vorliegen.",
    },
    {
      q: "Was bedeutet Förderbedarf in Kategorie C und D?",
      a: "Sie geben an, wie viele Euro pro kWp Sie benötigen – höchstens 130 €/kWp in C und 120 €/kWp in D. Die Anträge werden nach diesem Wert aufsteigend gereiht, bei Gleichstand nach Einreichzeitpunkt. Nachträglich ändern lässt sich das Gebot nicht.",
    },
    {
      q: "Kann ich den EAG-Zuschuss mit einer Landesförderung kombinieren?",
      a: "In den Kategorien A, B und C sowie bei innovativen Anlagen ja, innerhalb der beihilferechtlichen Grenzen. Anlagen der Kategorie D dürfen keine weitere Förderung erhalten. Den Investitionsfreibetrag können Sie in allen Kategorien zusätzlich nutzen.",
    },
    {
      q: "Lohnt sich eine PV-Anlage ohne EAG-Förderung?",
      a: "Bei hohem Eigenverbrauch in der Regel ja. In unserem Beispiel amortisiert sich eine 100-kWp-Gewerbeanlage mit 60 % Eigenverbrauch ohne Zuschuss in rund 6,2 Jahren, mit Zuschuss in rund 5,2 Jahren. Details im Ratgeber [Photovoltaik-Amortisation](/ratgeber/photovoltaik-amortisation).",
    },
  ],

  passend: [
    { href: "/forderungen/bundesfoerderung", titel: "Bundesförderung im Überblick", text: "EAG-Investitionszuschuss und Marktprämie kompakt." },
    { href: "/ratgeber/investitionsfreibetrag-photovoltaik", titel: "Investitionsfreibetrag 22 %", text: "Steuervorteil zusätzlich zum Zuschuss nutzen." },
    { href: "/ratgeber/photovoltaik-gewerbe", titel: "Photovoltaik für Gewerbe", text: "Lastgang, Wirtschaftlichkeit und Planung." },
    { href: "/service/finanzierung", titel: "Finanzierung", text: "Kauf, Kredit oder Leasing für Ihr Projekt." },
  ],

  quellen: [
    { titel: "OeMAG – EAG-IZV-Novelle 2026, BGBl. II Nr. 12/2026 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/2026-01-16_EAG-IZV-Novelle_2026.pdf", stand: "01/2026" },
    { titel: "OeMAG – EAG-Investitionszuschüsseverordnung Strom, konsolidierte Fassung vom 19.01.2026 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "01/2026" },
    { titel: "OeMAG – Förderung (EAG-Förderabwicklungsstelle)", url: "https://www.oem-ag.at/foerderung", stand: "09/2026" },
    { titel: "WKO – EAG-Investitionszuschuss 2026 für Photovoltaik und Stromspeicher", url: "https://www.wko.at/foerderungen/eag-investitionszuschuss-2026-photovoltaik-stromspeicher", stand: "09/2026" },
    { titel: "PV&B Austria – PV-Fördercall: 33 Sekunden entscheiden über Zu- oder Absage", url: "https://pvbaustria.at/pv-foerdercall-33-sekunden-entscheiden-ueber-zu-oder-absage-pv-austria-kritisiert-foerderlotterie-und-fordert-neustart/", stand: "07/2026" },
    { titel: "PV&B Austria – Eher Speicher als PV: Zehetner skizziert neue Förderschiene", url: "https://pvbaustria.at/eher-speicher-als-pv-zehetner-skizziert-neue-foerderschiene/", stand: "08/2026" },
    { titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (PDF)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "2025" },
  ],

  seitenCta: {
    titel: "Unterlagen für den Oktober-Call bereit?",
    text: "Wir klären Netzanschluss, Genehmigung und Kosten – und rechnen Ihr Projekt auch ohne Zuschuss.",
    href: "/angebot",
    label: "Projekt anfragen",
  },
  cta: {
    title: "Förderung mitnehmen – aber nicht davon abhängig sein.",
    text: "Ökovolt Solartechnik plant, errichtet und meldet Photovoltaikanlagen in ganz Österreich, von der Netzanmeldung bis zur Inbetriebnahme. Wir bereiten die technischen Unterlagen für Ihr Förderansuchen vor und legen Anlagen so aus, dass sie sich auch ohne Zuschuss rechnen.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Förder-Check starten", href: "/foerdercheck" },
  },
};

export default artikel;
