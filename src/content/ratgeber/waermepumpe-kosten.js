// Ratgeber: Wärmepumpe – Kosten 2026 (Österreich; Gewerbe und Premium-Privat)
// Investitionskosten: Österreichische Energieagentur (AEA), „KlimaHeizen 2024 – Transparenz“, Auswertung
// abgerechneter KPC-Förderfälle 01/2023–05/2024, Einfamilienhaus bis 15 kW, Bruttosystemkosten:
// Luft/Wasser Ø 30.689 € (18.500–42.779), Sole/Wasser Ø 55.758 € (37.715–100.265), Wasser/Wasser Ø 56.643 €
// (31.728–106.083, Indikation), Pellets Ø 29.929 €, Nah-/Fernwärme Ø 21.328 €, Kaminsanierung Ø 2.695 €,
// Öltankentsorgung Ø 1.900 €. Strompreis-Referenz: BMF-Erlass 24.10.2025, 32,806 ct/kWh (2026).
// Förderung: umweltfoerderung.at (Betriebe), sanierungsoffensive.gv.at (Private 2026 ausgeschöpft).
// Betriebskostenrechnung mit offengelegten Annahmen.

const PREIS_HH = 0.32806; // €/kWh brutto, BMF-Wert 2026 (Durchschnittspreis Haushalt)
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kosten = (waerme, jaz, preis) => eur((waerme / jaz) * preis);

const artikel = {
  slug: "waermepumpe-kosten",
  title: "Wärmepumpe Kosten 2026: Investition, Betrieb und Förderung in Österreich",
  seoTitle: "Wärmepumpe Kosten 2026 Österreich | Ökovolt",
  kurzTitel: "Wärmepumpe Kosten",
  description:
    "Wärmepumpe Kosten 2026 in Österreich: echte Systempreise laut Energieagentur, Betriebskosten nach JAZ, Gewerbe-Großwärmepumpen, Förderung und Wasserrecht.",
  excerpt:
    "Was eine Wärmepumpe in Österreich tatsächlich kostet – auf Basis abgerechneter Förderfälle –, wie Jahresarbeitszahl und Strompreis die Betriebskosten bestimmen und welche Förderungen 2026 noch offen sind.",
  hauptKeyword: "wärmepumpe kosten",
  keywords: [
    "Wärmepumpe Kosten Österreich",
    "Luftwärmepumpe Kosten 2026",
    "Erdwärmepumpe Kosten",
    "Wärmepumpe Betriebskosten",
    "Großwärmepumpe Kosten Gewerbe",
    "Wärmepumpe Förderung 2026 Österreich",
    "Wärmepumpe Tiefenbohrung Bewilligung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "E-Mobilität & Sektorkopplung",
  bild: "/Images/Ratgeber/waermepumpe-kosten.jpg",
  bildAlt: "Moderne Wärmepumpe im Außenbereich eines Gebäudes",
  badge: { wert: "Ø 30.689 €", text: "Systemkosten Luftwärmepumpe im Einfamilienhaus, brutto (AEA-Auswertung)" },

  kurzFazit: [
    "**Eine Luft-Wasser-Wärmepumpe kostete im Einfamilienhaus laut Auswertung der Österreichischen Energieagentur im Mittel rund 30.700 € brutto (18.500 bis 42.800 €), eine Sole-Wasser-Wärmepumpe mit Tiefenbohrung rund 55.800 € (37.700 bis 100.300 €).** Grundlage sind abgerechnete Förderfälle aus 2023/24.",
    "**Die Betriebskosten bestimmt die Jahresarbeitszahl (JAZ):** Bei 20.000 kWh Wärmebedarf und dem BMF-Referenzstrompreis 2026 von 32,806 ct/kWh kostet der Strom bei JAZ 3 rund 2.190 €, bei JAZ 4 rund 1.640 € im Jahr.",
    "**Im Gewerbe zählen Abwärmequellen und Temperaturniveau mehr als der Gerätepreis:** Wer Abwärme aus Kälte, Druckluft oder Abwasser nutzt, erreicht deutlich bessere Arbeitszahlen.",
    "**Förderung 2026:** Private Bundesprogramme (Kesseltausch, Sanierungsbonus) sind ausgeschöpft; Betriebe, Gemeinden und Vereine können über die Umweltförderung im Inland ansuchen, Länder fördern zusätzlich.",
  ],

  abschnitte: [
    {
      id: "investition",
      titel: "Was kostet eine Wärmepumpe in Österreich?",
      tocLabel: "Investitionskosten",
      bloecke: [
        {
          typ: "p",
          text: "**Die belastbarste Quelle für Wärmepumpenpreise in Österreich ist die Auswertung abgerechneter Förderfälle durch die Österreichische Energieagentur (AEA): Luft-Wasser-Systeme kosteten im Einfamilienhaus im Mittel rund 30.700 €, Sole-Wasser-Systeme rund 55.800 € und Wasser-Wasser-Systeme rund 56.600 € brutto.** Enthalten sind das Gesamtsystem inklusive Wärmequelle, Speicher, Hydraulik, Montage und Inbetriebnahme – nicht nur das Gerät.",
        },
        {
          typ: "tabelle",
          caption: "Bruttosystemkosten klimafreundlicher Heizungen im Einfamilienhaus (bis 15 bzw. 20 kW), abgerechnete Förderfälle 01/2023–05/2024",
          kopf: ["Heizsystem", "Minimum", "Mittelwert", "Maximum", "Ø Leistung"],
          zeilen: [
            ["Luft-Wasser-Wärmepumpe", "18.500 €", "30.689 €", "42.779 €", "11,2 kW"],
            ["Sole-Wasser-Wärmepumpe (inkl. Tiefenbohrung/Kollektor)", "37.715 €", "55.758 €", "100.265 €", "10,8 kW"],
            ["Wasser-Wasser-Wärmepumpe (Indikation)", "31.728 €", "56.643 €", "106.083 €", "11,3 kW"],
            ["Pelletszentralheizung (Vergleich)", "22.568 €", "29.929 €", "46.231 €", "15,7 kW"],
            ["Nah-/Fernwärmeanschluss (Vergleich)", "8.202 €", "21.328 €", "45.914 €", "12,8 kW"],
          ],
          hervorheben: 2,
          markierteZeile: 0,
          minBreite: 680,
          fussnote: "Quelle: Österreichische Energieagentur, KlimaHeizen 2024 – Transparenz (Oktober 2024), Auswertung von KPC-Förderabrechnungen. Wasser-Wasser nur Indikation (geringe Fallzahl). Preise seither nicht erneut erhoben; Angebote 2026 können abweichen.",
        },
        {
          typ: "p",
          text: "Dazu kommen je nach Ausgangslage Nebenkosten: Bei einem Umstieg von Öl lag die Öltankentsorgung laut AEA im Mittel bei rund 1.900 €, eine Kaminsanierung bei rund 2.700 €. Nicht enthalten sind oft Anpassungen an Heizflächen, Elektroinstallation oder eine Erhöhung der Anschlussleistung beim Netzbetreiber. Wie eine Wärmepumpe mit der eigenen PV-Anlage zusammenspielt, erklärt der Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
        },
      ],
    },
    {
      id: "systeme",
      titel: "Luft, Sole oder Wasser: Welche Wärmepumpe passt?",
      tocLabel: "Systemwahl",
      bloecke: [
        {
          typ: "p",
          text: "**Die Wahl der Wärmequelle ist eine Abwägung zwischen Investition und Effizienz: Luft ist am günstigsten zu erschließen, Erdreich und Grundwasser liefern im Winter wärmere Quelltemperaturen und damit bessere Arbeitszahlen.** Welche Variante sich rechnet, hängt vom Wärmebedarf und der Nutzungsdauer ab – je höher der Bedarf, desto eher lohnt die teurere Quelle.",
        },
        {
          typ: "tabelle",
          caption: "Wärmequellen im Vergleich",
          kopf: ["System", "Investition (AEA, Ø EFH)", "Effizienz im Winter", "Geeignet für"],
          zeilen: [
            ["Luft-Wasser", "rund 30.700 €", "sinkt bei tiefen Außentemperaturen", "sanierte Gebäude, Flächenheizung, begrenztes Budget"],
            ["Sole-Wasser (Tiefenbohrung, Kollektor)", "rund 55.800 €", "stabil, gute JAZ", "hoher Wärmebedarf, lange Nutzung, Kühlung im Sommer"],
            ["Wasser-Wasser (Brunnen)", "rund 56.600 € (Indikation)", "sehr gut bei geeignetem Grundwasser", "Standorte mit ergiebigem Grundwasser, wasserrechtliche Bewilligung"],
            ["Abwärme (Gewerbe)", "projektspezifisch", "sehr gut, wenn Quelle ganzjährig verfügbar", "Betriebe mit Kälte-, Druckluft- oder Prozessabwärme"],
          ],
          minBreite: 680,
        },
      ],
    },
    {
      id: "kostenfaktoren",
      titel: "Was treibt die Kosten nach oben?",
      tocLabel: "Kostenfaktoren",
      bloecke: [
        {
          typ: "p",
          text: "**Die Bandbreite der Preise erklärt sich vor allem durch die Wärmequelle, das Temperaturniveau des Heizsystems und den Umbauaufwand im Bestand.** Die Wärmepumpe selbst ist oft der kleinere Teil der Gesamtkosten.",
        },
        {
          typ: "tabelle",
          caption: "Kostentreiber bei Wärmepumpen",
          kopf: ["Faktor", "Wirkung", "Hinweis"],
          zeilen: [
            ["Wärmequelle", "Tiefenbohrung oder Brunnen verteuern stark, verbessern aber die JAZ", "Luft ist am günstigsten, im Winter aber weniger effizient"],
            ["Vorlauftemperatur", "Radiatoren mit hohen Temperaturen verlangen größere Geräte oder Heizflächentausch", "Flächenheizung und Bauteilaktivierung sind ideal"],
            ["Speicher & Hydraulik", "Puffer- und Warmwasserspeicher, hydraulischer Abgleich", "größere Speicher ermöglichen PV-Überschussnutzung"],
            ["Elektroinstallation", "eigener Stromkreis, ggf. Zählerschrank, höhere Anschlussleistung", "Meldung beim Netzbetreiber über 3,68 kVA"],
            ["Aufstellung & Schall", "Fundament, Schallschutz, Abstände zur Nachbarschaft", "Bauordnung und Lärmvorgaben der Länder beachten"],
            ["Genehmigungen", "wasserrechtliche Bewilligung für Brunnen, ggf. Tiefenbohrung", "Zeit- und Kostenpuffer einplanen"],
          ],
          minBreite: 660,
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Wasserrecht bei Erdwärme und Grundwasser",
          text: "Grundwasser-Wärmepumpen (Brunnenanlagen) brauchen in Österreich in der Regel eine wasserrechtliche Bewilligung der Bezirksverwaltungsbehörde. Für Erdwärmesonden gelten je nach Bundesland und Gebiet (z. B. Schutz- und Schongebiete) Anzeige- oder Bewilligungspflichten. Klären Sie das vor der Bestellung – Bohrfirmen und Geologen kennen die regionalen Vorgaben.",
        },
      ],
    },
    {
      id: "betrieb",
      titel: "Wie hoch sind die Betriebskosten?",
      tocLabel: "Betriebskosten",
      bloecke: [
        {
          typ: "p",
          text: "**Die jährlichen Stromkosten einer Wärmepumpe ergeben sich aus Wärmebedarf geteilt durch Jahresarbeitszahl mal Strompreis.** Eine JAZ von 4 bedeutet: Aus einer Kilowattstunde Strom werden im Jahresmittel vier Kilowattstunden Wärme. Die folgende Tabelle rechnet mit dem vom Finanzministerium für 2026 festgelegten Referenz-Strompreis von 32,806 ct/kWh (brutto, Durchschnitt Haushalt).",
        },
        {
          typ: "tabelle",
          caption: "Jährliche Stromkosten einer Wärmepumpe nach Wärmebedarf und JAZ (Strompreis 32,806 ct/kWh brutto)",
          kopf: ["Wärmebedarf pro Jahr", "JAZ 3,0", "JAZ 3,5", "JAZ 4,0", "JAZ 4,5"],
          zeilen: [
            ["12.000 kWh (sanierter Altbau)", kosten(12000, 3, PREIS_HH), kosten(12000, 3.5, PREIS_HH), kosten(12000, 4, PREIS_HH), kosten(12000, 4.5, PREIS_HH)],
            ["20.000 kWh (größeres Wohnhaus)", kosten(20000, 3, PREIS_HH), kosten(20000, 3.5, PREIS_HH), kosten(20000, 4, PREIS_HH), kosten(20000, 4.5, PREIS_HH)],
            ["35.000 kWh (Chalet, kleines Gästehaus)", kosten(35000, 3, PREIS_HH), kosten(35000, 3.5, PREIS_HH), kosten(35000, 4, PREIS_HH), kosten(35000, 4.5, PREIS_HH)],
          ],
          hervorheben: 3,
          minBreite: 640,
          fussnote: "Rechenwerte ohne Grundgebühren, Wartung und Eigenstromanteil. Der BMF-Wert 2026 bildet einen durchschnittlichen Haushaltsstrompreis ab; Ihr Tarif kann davon abweichen. Wärmepumpentarife und dynamische Tarife können günstiger sein.",
        },
        {
          typ: "p",
          text: "Für Betriebe gilt dieselbe Logik mit Nettopreisen und oft deutlich größeren Mengen. Beispiel: Ein Betrieb mit 150.000 kWh Wärmebedarf braucht bei JAZ 3,5 rund 42.900 kWh Strom – bei 20 ct/kWh netto etwa 8.600 € im Jahr, bei JAZ 4,5 nur noch rund 6.700 €. Die Differenz über 20 Jahre übersteigt häufig den Mehrpreis einer effizienteren Wärmequelle. Wie viel davon die eigene PV-Anlage beitragen kann, zeigt der Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
      ],
    },
    {
      id: "gewerbe",
      titel: "Kosten von Großwärmepumpen im Gewerbe",
      tocLabel: "Gewerbe & Großanlagen",
      bloecke: [
        {
          typ: "p",
          text: "**Für gewerbliche Großwärmepumpen gibt es keine allgemein gültigen Preise pro kW – die Kosten hängen stärker als im Wohnbau von Wärmequelle, Temperaturniveau, Integration in bestehende Systeme und Kältemittel ab.** Mit steigender Leistung sinken die spezifischen Gerätekosten, während Planung, Hydraulik und Einbindung einen größeren Anteil ausmachen.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Abwärme nutzen", text: "Kälteanlagen, Druckluft, Prozesskühlung, Abwasser: warme Quellen verbessern die JAZ und senken Betriebskosten – oft der wichtigste wirtschaftliche Hebel." },
            { titel: "Temperaturniveau senken", text: "Jedes Grad weniger Vorlauf verbessert die Effizienz. Prozesse und Heizflächen prüfen, bevor die Wärmepumpe dimensioniert wird." },
            { titel: "Kältemittel", text: "Natürliche Kältemittel (Propan, CO₂, Ammoniak) sind zukunftssicher; für die Förderung ab 100 kW verlangt die KPC ab 2026 ein GWP unter 750." },
            { titel: "Hybride Lösungen", text: "Wärmepumpe für die Grundlast, bestehender Kessel oder Biomasse für Spitzen – senkt Investition und Anschlussleistung." },
          ],
        },
        {
          typ: "p",
          text: "Für Hotels, Landwirtschaft und Gemeinden lohnt ein Blick auf die Gesamtenergie: Kühlung, Wärme, Warmwasser und Mobilität teilen sich Anschluss und PV-Anlage. Mehr dazu unter [Hotellerie & Tourismus](/hotellerie-tourismus), [Landwirtschaft](/landwirtschaft) und [Gemeinden](/kommunen).",
        },
      ],
    },
    {
      id: "netz",
      titel: "Versteckte Kosten: Anschlussleistung, Netz und Wartung",
      tocLabel: "Netz & Wartung",
      bloecke: [
        {
          typ: "p",
          text: "**Neben Gerät und Installation können eine höhere Anschlussleistung beim Netzbetreiber, Anpassungen am Zählerschrank und die laufende Wartung spürbare Kosten verursachen.** Sie fehlen in vielen Angeboten und sollten vorab geklärt werden.",
        },
        {
          typ: "tabelle",
          caption: "Beispiele: Netzbereitstellungsentgelt für zusätzliche Anschlussleistung (Netzebene 7), Stand September 2026",
          kopf: ["Netzbetreiber", "Entgelt je zusätzlichem kW", "Hinweis"],
          zeilen: [
            ["LINZ NETZ", "226,63 € (exkl. USt.)", "zusätzlich ggf. Netzzutrittsentgelt bei größeren Leistungen"],
            ["Salzburg Netz", "352,36 € (inkl. USt.)", "Prüfung, ob Anschlussleistung reicht, bei der Meldung"],
          ],
          minBreite: 560,
          fussnote: "Quellen: Websites der Netzbetreiber (Seiten zu E-Ladeeinrichtungen bzw. E-Mobilität, die das Entgelt allgemein für zusätzliche Anschlussleistung ausweisen). Andere Netzgebiete haben eigene Sätze.",
        },
        {
          typ: "liste",
          punkte: [
            "**Anschlussleistung:** Wärmepumpe, Wallbox und Warmwasser gleichzeitig können die vereinbarte Leistung überschreiten. Ein Energiemanagement, das Lasten staffelt, kann eine Erhöhung vermeiden – siehe [Energiemanagementsystem](/ratgeber/energiemanagementsystem).",
            "**Meldung:** Wärmepumpen über 3,68 kVA sind laut TOR Verteilernetzanschluss dem Netzbetreiber zu melden; die Meldung übernimmt der Elektrotechniker.",
            "**Wartung:** Regelmäßige Kontrolle von Kältekreis, Filtern, Hydraulik und Regelung sichert die Effizienz; bei F-Gas-Anlagen ab bestimmten Füllmengen sind Dichtheitskontrollen vorgeschrieben.",
            "**Stromtarif:** Wärmepumpen- und dynamische Tarife können die Betriebskosten senken, erfordern aber teils eigene Zählung oder Steuerbarkeit – mehr im Ratgeber [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich).",
          ],
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Welche Förderungen gibt es 2026?",
      tocLabel: "Förderung 2026",
      bloecke: [
        {
          typ: "p",
          text: "**2026 sind die Bundesförderungen für den privaten Heizungstausch ausgeschöpft; für Betriebe, Gemeinden und Vereine gibt es die Umweltförderung im Inland, dazu Programme der Länder.** Die Sanierungsoffensive des Bundes meldet für Kesseltausch und Sanierungsbonus ein ausgeschöpftes Budget von 360 Mio. € für 2026 – neue Registrierungen sind nicht möglich.",
        },
        {
          typ: "tabelle",
          caption: "Förderlandschaft Wärmepumpe, Stand September 2026",
          kopf: ["Programm", "Zielgruppe", "Stand / Bedingungen"],
          zeilen: [
            ["Kesseltausch (Sanierungsoffensive)", "Private (Ein-/Zweifamilienhaus, Reihenhaus, Mehrgeschoß)", "Budget 2026 ausgeschöpft, keine Neuanträge"],
            ["Sanierungsbonus", "Private", "seit 2. Februar 2026 ausgeschöpft"],
            ["Umweltförderung – Wärmepumpe unter 100 kW", "Betriebe", "Ersatz fossiler Heizung, Antrag nach Umsetzung (bis 6 Monate nach Rechnung)"],
            ["Umweltförderung – Wärmepumpe ab 100 kW", "Betriebe, Gemeinden, Vereine", "JAZ ≥ 3,8, GWP < 750, Antrag vor verbindlicher Bestellung"],
            ["Länder und Gemeinden", "Private und Betriebe", "je nach Bundesland; laufend prüfen"],
          ],
          minBreite: 660,
          fussnote: "Quellen: sanierungsoffensive.gv.at, umweltfoerderung.at. Keine Förderzusage; Bedingungen vor Bestellung prüfen.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Reihenfolge beachten",
          text: "Viele Förderungen verlangen den Antrag vor der ersten verbindlichen Bestellung. Wer zuerst bestellt und dann einreicht, verliert den Anspruch. Klären Sie die Förderfähigkeit mit dem [Förder-Check](/foerdercheck) oder über die Seite [Landesförderungen](/forderungen/landesforderungen), bevor Sie unterschreiben.",
        },
      ],
    },
    {
      id: "vergleich",
      titel: "Wärmepumpe im Vollkostenvergleich",
      tocLabel: "Vollkosten",
      bloecke: [
        {
          typ: "p",
          text: "**Ob sich eine Wärmepumpe rechnet, zeigt nur ein Vollkostenvergleich über die Nutzungsdauer: Investition, Förderung, Energie, Wartung und – bei Betrieben – Steuerwirkung.** Die Investition einer Luft-Wasser-Wärmepumpe liegt laut AEA im Mittel in einer ähnlichen Größenordnung wie eine Pelletsheizung, die Energiekosten hängen vom Strom- bzw. Brennstoffpreis ab.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Wärmebedarf aus Verbrauchsdaten der letzten Jahre ableiten, nicht aus Faustformeln.",
            "Angebote auf Gesamtsystem (Quelle, Speicher, Hydraulik, Elektro, Inbetriebnahme) vergleichen – die AEA-Werte helfen bei der Einordnung.",
            "JAZ-Prognose des Planers verlangen und nach der ersten Heizsaison mit Messdaten prüfen.",
            "Stromtarif prüfen: Wärmepumpentarif, dynamischer Tarif oder Eigenstrom aus PV.",
            "Wartung und Lebensdauer einrechnen, bei Betrieben Abschreibung und Investitionsfreibetrag mit der Steuerberatung klären.",
            "Förderung vor Bestellung beantragen, Meldung beim Netzbetreiber einplanen.",
          ],
        },
        {
          typ: "p",
          text: "Für Betriebe kann die Investition steuerlich über AfA und gegebenenfalls den Investitionsfreibetrag wirken – Hintergründe im Ratgeber [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik). Ökovolt plant Wärmepumpe, PV und Speicher gemeinsam; mehr auf der Seite [Wärmepumpe](/produkte/warmepumpe).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was kostet eine Luftwärmepumpe in Österreich?",
      a: "Laut Auswertung abgerechneter Förderfälle durch die Österreichische Energieagentur kostete ein Luft-Wasser-System im Einfamilienhaus 2023/24 im Mittel rund 30.700 € brutto, bei einer Spanne von 18.500 bis 42.800 €. Enthalten ist das Gesamtsystem inklusive Montage.",
    },
    {
      q: "Was kostet eine Erdwärmepumpe mit Tiefenbohrung?",
      a: "Sole-Wasser-Systeme inklusive Tiefenbohrung oder Kollektor kosteten laut AEA im Mittel rund 55.800 € brutto, mit einer Spanne von 37.700 bis 100.300 €. Die höheren Kosten stehen einer besseren Jahresarbeitszahl gegenüber.",
    },
    {
      q: "Wie hoch sind die Stromkosten einer Wärmepumpe?",
      a: "Wärmebedarf geteilt durch JAZ mal Strompreis. Bei 20.000 kWh Wärme, JAZ 4 und 32,806 ct/kWh sind das rund 1.640 € im Jahr, bei JAZ 3 rund 2.190 €. Eigenstrom aus PV und günstige Tarife senken die Kosten.",
    },
    {
      q: "Gibt es 2026 noch eine Förderung für Wärmepumpen?",
      a: "Für Private sind Kesseltausch und Sanierungsbonus des Bundes 2026 ausgeschöpft; Landesförderungen prüfen. Betriebe, Gemeinden und Vereine können über die Umweltförderung im Inland ansuchen, bei Anlagen ab 100 kW mit JAZ ≥ 3,8 und Kältemittel unter GWP 750.",
    },
    {
      q: "Brauche ich für eine Erdwärmepumpe eine Bewilligung?",
      a: "Für Grundwasser-Wärmepumpen ist in der Regel eine wasserrechtliche Bewilligung nötig. Bei Erdwärmesonden hängen Anzeige- oder Bewilligungspflicht von Bundesland und Gebiet ab. Klären Sie das vor der Bestellung.",
    },
    {
      q: "Lohnt sich eine Wärmepumpe im Gewerbe?",
      a: "Besonders dann, wenn Abwärme genutzt werden kann, das Temperaturniveau moderat ist und eine PV-Anlage vorhanden ist. Entscheidend ist ein Vollkostenvergleich über die Nutzungsdauer inklusive Förderung und Steuerwirkung.",
    },
    {
      q: "Welche Nebenkosten fallen beim Umstieg von Öl auf Wärmepumpe an?",
      a: "Typisch sind Öltankentsorgung (laut AEA im Mittel rund 1.900 €), gegebenenfalls Kaminsanierung (rund 2.700 €), Anpassungen an Heizflächen und Elektroinstallation sowie – je nach Netzgebiet – ein Entgelt für zusätzliche Anschlussleistung.",
    },
    {
      q: "Ist eine Wärmepumpe teurer als eine Pelletsheizung?",
      a: "In der Anschaffung liegt eine Luft-Wasser-Wärmepumpe laut AEA-Auswertung mit rund 30.700 € im Mittel in derselben Größenordnung wie eine Pelletsheizung mit rund 29.900 €. Unterschiede entstehen bei Energie-, Wartungs- und Platzkosten – ein Vollkostenvergleich über 20 Jahre ist aussagekräftiger.",
    },
  ],

  passend: [
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe", text: "Planung und Einbindung in PV und Speicher." },
    { href: "/ratgeber/waermepumpe-mit-photovoltaik", titel: "Wärmepumpe mit PV", text: "Realistische Deckung und Steuerung." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Aktuelle Programme für Ihr Projekt." },
  ],

  quellen: [
    { titel: "Österreichische Energieagentur – KlimaHeizen 2024: Transparenz der Anschaffungskosten (Ergebniszusammenfassung)", url: "https://www.energyagency.at/fileadmin/1_energyagency/fakten-service/kostencheck_klimaheizen2024_ergebniszusammenfassung_final.pdf", stand: "10/2024" },
    { titel: "Österreichische Energieagentur – AEA-Kostencheck", url: "https://www.energyagency.at/fakten/aea-kostencheck", stand: "09/2026" },
    { titel: "Sanierungsoffensive – Kesseltausch und Sanierungsbonus 2026 (Status)", url: "https://www.sanierungsoffensive.gv.at/", stand: "09/2026" },
    { titel: "Umweltförderung (KPC) – Wärmepumpe ab 100 kW", url: "https://www.umweltfoerderung.at/betriebe/waermepumpe-100-kw-1/unterkategorie-waerme-aus-erneuerbaren-ressourcen", stand: "09/2026" },
    { titel: "Umweltförderung (KPC) – Wärmepumpe unter 100 kW", url: "https://www.umweltfoerderung.at/betriebe/waermepumpe-100-kw/unterkategorie-waerme-aus-erneuerbaren-ressourcen", stand: "09/2026" },
    { titel: "EY Österreich – BMF: Strompreis 2026 (32,806 ct/kWh)", url: "https://www.ey.com/de_at/technical/steuernachrichten/bmf-strompreis-2026-laden", stand: "10/2025" },
  ],

  seitenCta: { titel: "Wärmepumpe geplant?", text: "Gemeinsam mit PV und Speicher auslegen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Wärmepumpe mit Plan – und mit eigenem Solarstrom.",
    text: "Ökovolt aus Ostermiething (OÖ) plant Wärmepumpe, Photovoltaik und Speicher als Gesamtsystem für Betriebe, Hotels, Landwirtschaft und anspruchsvolle Privatobjekte in ganz Österreich.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Wärmepumpe", href: "/produkte/warmepumpe" },
  },
};

export default artikel;
