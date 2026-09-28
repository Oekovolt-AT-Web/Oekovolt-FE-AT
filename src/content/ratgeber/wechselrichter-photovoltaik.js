// Ratgeber: Wechselrichter für Photovoltaik – Gewerbe, TOR-Konformität, Auslegung (Österreich)
// Recherchestand 28.09.2026. TOR Stromerzeugungsanlagen Typ A–D Version 1.4 (E-Control; Typ A V1.4 gilt seit 01.06.2026,
// Kapitel 5.4 Ansteuerbarkeit gemäß § 76 ElWG); Wechselrichterliste.at (Oesterreichs Energie);
// Clipping-Werte: eigene Auswertung PVGIS-5.3-Stundenreihen Linz 2019–2023; EAG-IZ-VO Strom § 6 (EU-Wertschöpfung).

const artikel = {
  slug: "wechselrichter-photovoltaik",
  title: "Wechselrichter für Photovoltaik: String, Zentral und TOR-Konformität",
  seoTitle: "Wechselrichter Photovoltaik: Gewerbe & TOR | Ökovolt",
  kurzTitel: "Wechselrichter",
  description:
    "Wechselrichter für Gewerbe-PV in Österreich: String oder Zentral, DC/AC-Verhältnis, MPP-Tracker, TOR-Konformität, Wechselrichterliste, Monitoring und Tausch.",
  excerpt:
    "Der Wechselrichter ist das Herz der PV-Anlage und die Schnittstelle zum Netz. Wie Betriebe String- oder Zentralwechselrichter wählen, richtig dimensionieren und die österreichischen Netzanforderungen erfüllen.",
  hauptKeyword: "wechselrichter photovoltaik",
  keywords: [
    "Wechselrichter Photovoltaik",
    "Stringwechselrichter Gewerbe",
    "Zentralwechselrichter",
    "DC/AC-Verhältnis Überdimensionierung",
    "TOR Stromerzeugungsanlagen Wechselrichter",
    "Wechselrichterliste Österreich",
    "Wechselrichter Lebensdauer",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Dienstleistungen/Photovoltaik/welschelrichter.webp",
  bildAlt: "Wechselrichter einer Photovoltaikanlage an einer Wand montiert",
  badge: { wert: "250 kW", text: "ab hier gilt Typ B nach TOR Stromerzeugungsanlagen" },

  kurzFazit: [
    "**Für Gewerbeanlagen bis in den Megawattbereich sind heute String-Wechselrichter mit 50 bis über 300 kW Standard; Zentralwechselrichter lohnen sich vor allem in großen Freiflächenanlagen.** String-Geräte bieten mehr MPP-Tracker, einfachere Redundanz und leichteren Tausch.",
    "In Österreich muss jeder Wechselrichter die **TOR Stromerzeugungsanlagen** erfüllen. Geprüfte Geräte sind auf **wechselrichterliste.at** gelistet, auf die alle 122 Verteilernetzbetreiber zugreifen. Seit **1. Juni 2026** gilt die Version 1.4 der TOR Typ A mit neuen Regeln zur **Ansteuerbarkeit nach § 76 ElWG**.",
    "Ab **250 kW** Maximalkapazität gilt eine Anlage als **Typ B** – mit erweiterten Anforderungen an Blindleistung, Fernsteuerung und Nachweise; häufig ist dann ein **Parkregler** nötig.",
    "Ein **DC/AC-Verhältnis von 1,2 bis 1,4** ist üblich: Bei Ost-West verliert ein Wechselrichter mit 70 % der Modulleistung laut PVGIS-Stundenauswertung praktisch keinen Ertrag, bei Süd 30° rund 1,3 %.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Welcher Wechselrichter passt zu einer Gewerbeanlage?",
      tocLabel: "Welcher Wechselrichter?",
      bloecke: [
        {
          typ: "p",
          text: "**Der [Wechselrichter](/wissen/lexikon#wechselrichter) wandelt den Gleichstrom der Module in netzkonformen Wechselstrom, sucht laufend den optimalen Arbeitspunkt der Module und setzt die Vorgaben des Netzbetreibers um.** Für Gewerbedächer von 30 kWp bis mehrere Megawatt werden heute fast ausschließlich String-Wechselrichter eingesetzt, die dezentral nahe den Modulfeldern oder gebündelt in einem Technikraum montiert werden.",
        },
        {
          typ: "tabelle",
          caption: "String- und Zentralwechselrichter im Vergleich",
          kopf: ["Kriterium", "String-Wechselrichter", "Zentralwechselrichter"],
          zeilen: [
            ["Leistung je Gerät", "ca. 10 bis über 300 kW", "ca. 1 bis mehrere MW"],
            ["MPP-Tracker", "mehrere je Gerät (oft 4–12)", "wenige, große Modulfelder"],
            ["Ausfallwirkung", "nur ein Teil der Anlage betroffen", "großer Teil der Anlage steht"],
            ["Tausch und Service", "Gerätetausch durch Elektrofachbetrieb", "Service durch Hersteller, Ersatzteilhaltung"],
            ["Typischer Einsatz", "Dächer, Carports, Freiflächen bis in den MW-Bereich", "große Freiflächenanlagen mit einheitlichen Feldern"],
            ["Aufstellung", "dezentral am Dach oder zentral im Technikraum", "Container oder Betriebsgebäude mit Trafo"],
          ],
          fussnote: "Allgemeine Einordnung; die Grenze verschiebt sich, weil String-Geräte immer leistungsstärker werden.",
        },
        {
          typ: "p",
          text: "Bei Anlagen mit Stromspeicher kommen Hybrid-Wechselrichter oder eigene Batteriewechselrichter hinzu. Hybridgeräte binden den Speicher auf der Gleichstromseite an, separate Batteriewechselrichter arbeiten auf der Wechselstromseite und lassen sich unabhängig von der PV-Anlage nachrüsten. Für Gewerbespeicher mit Peak Shaving ist die AC-Kopplung verbreitet – mehr auf der Seite [Gewerbespeicher](/gewerbespeicher).",
        },
      ],
    },
    {
      id: "auslegung",
      titel: "Auslegung: DC/AC-Verhältnis, MPP-Tracker, Spannung",
      tocLabel: "Auslegung",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Wechselrichter wird in der Regel kleiner dimensioniert als die Modulleistung, weil Module ihre Nennleistung in Österreich nur selten erreichen.** Das DC/AC-Verhältnis (Modulleistung zu Wechselrichterleistung) liegt bei Gewerbeanlagen meist zwischen 1,2 und 1,4. Wie viel Ertrag die Begrenzung („Clipping“) kostet, zeigt unsere Auswertung stündlicher PVGIS-Daten für Linz.",
        },
        {
          typ: "tabelle",
          caption: "Ertragsverlust durch Wechselrichter-Begrenzung, Linz (PVGIS 5.3, Stundenwerte 2019–2023)",
          kopf: ["Wechselrichter in % der Modulleistung", "DC/AC-Verhältnis", "Süd 30°", "Süd 10°", "Ost-West 10°"],
          zeilen: [
            ["80 %", "1,25", "0,1 %", "0,0 %", "0,0 %"],
            ["70 %", "1,43", "1,3 %", "0,3 %", "0,0 %"],
            ["60 %", "1,67", "5,4 %", "2,9 %", "1,3 %"],
          ],
          hervorheben: 4,
          fussnote: "Eigene Auswertung; Stundenmittel glätten kurze Leistungsspitzen, reale Verluste liegen etwas höher. Die Auslegung erfolgt im Einzelfall mit Wechselrichterdaten, Temperaturverhalten und Netzvorgaben.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**MPP-Tracker:** Unterschiedlich ausgerichtete oder verschattete Flächen auf eigene Tracker legen – etwa Ost- und Westseite getrennt. Details im Ratgeber [Verschattung](/ratgeber/photovoltaik-verschattung).",
            "**Maximale DC-Spannung:** Gewerbegeräte arbeiten meist mit 1.100 V, große Anlagen mit 1.500 V. Die Stringlänge muss auch bei Frost darunter bleiben – bei −15 °C bis −25 °C steigt die Modulspannung deutlich.",
            "**Minimale MPP-Spannung:** An heißen Sommertagen sinkt die Spannung; zu kurze Strings fallen dann aus dem Arbeitsbereich.",
            "**Stromstärke je Eingang:** Moderne großflächige Module liefern hohe Ströme – der zulässige Eingangsstrom je Tracker muss dazu passen.",
            "**Einspeisebegrenzung:** Gibt der Netzbetreiber nur eine begrenzte Einspeiseleistung frei, kann der Wechselrichter oder ein übergeordneter Regler die Einspeisung dynamisch begrenzen.",
          ],
        },
        {
          typ: "p",
          text: "Warum Ost-West-Anlagen besonders gut zu hohen DC/AC-Verhältnissen passen, erklärt der Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west). Wie der [MPP-Tracker](/wissen/lexikon#mpp-tracker) arbeitet, steht im Lexikon.",
        },
      ],
    },
    {
      id: "netz",
      titel: "Netzanforderungen in Österreich: TOR, Wechselrichterliste, ElWG",
      tocLabel: "TOR & Netz",
      bloecke: [
        {
          typ: "p",
          text: "**In Österreich dürfen nur Wechselrichter ans Netz, die die Technischen und organisatorischen Regeln (TOR) für Stromerzeugungsanlagen erfüllen – nachgewiesen über Prüfberichte oder Konformitätserklärungen.** Die TOR setzen den EU-Netzkodex für Stromerzeuger (Verordnung (EU) 2016/631) um und werden von E-Control und Oesterreichs Energie erarbeitet.",
        },
        {
          typ: "tabelle",
          caption: "Typen nach TOR Stromerzeugungsanlagen (Version 1.4)",
          kopf: ["Typ", "Maximalkapazität", "Typische PV-Anwendung"],
          zeilen: [
            ["Typ A", "unter 250 kW (Nennspannung unter 110 kV)", "Dächer von Betrieben, Landwirtschaft, Gemeindegebäude"],
            ["Typ B", "250 kW bis unter 35 MW", "große Hallendächer, Freiflächen"],
            ["Typ C", "35 MW bis unter 50 MW", "sehr große Solarparks"],
            ["Typ D", "ab 50 MW oder ab 110 kV", "Großkraftwerke am Übertragungs- oder Hochspannungsnetz"],
          ],
          fussnote: "Quelle: E-Control, TOR Stromerzeugungsanlagen Typ A bis D, Version 1.4. Die Anforderungen an Netzstützung, Kommunikation und Nachweise steigen mit dem Typ.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Wechselrichterliste.at", text: "Oesterreichs Energie führt mit wechselrichterliste.at eine zentrale Liste von Geräten, die die Anforderungen der TOR Stromerzeugungsanlagen auf Basis vorgelegter Prüfberichte erfüllen. Alle 122 Verteilernetzbetreiber greifen darauf zu – das beschleunigt die Netzanmeldung." },
            { titel: "Blindleistung und Spannung", text: "Wechselrichter müssen Blindleistung nach Kennlinien wie Q(U) oder cos φ(P) bereitstellen und sich bei Netzfehlern definiert verhalten. Welche Kennlinie gilt, legt der Netzbetreiber fest." },
            { titel: "Ansteuerbarkeit (ElWG § 76)", text: "Mit der TOR Typ A Version 1.4, gültig seit 1. Juni 2026, wurde das Kapitel zur Ansteuerbarkeit von Erzeugungsanlagen an § 76 Elektrizitätswirtschaftsgesetz (ElWG) angepasst. Anlagen müssen Steuersignale des Netzbetreibers umsetzen können." },
            { titel: "Netz- und Anlagenschutz", text: "Je nach Anlagengröße und Vorgabe des Netzbetreibers reicht der im Wechselrichter integrierte Schutz, oder es ist ein zentraler Netz- und Anlagenschutz mit Kuppelschalter erforderlich." },
          ],
        },
        {
          typ: "p",
          text: "Bei Anlagen ab Typ B oder mit mehreren Wechselrichtern an einem Netzanschlusspunkt übernimmt meist ein übergeordneter Regler die Vorgaben für Wirk- und Blindleistung am Netzanschlusspunkt. Ökovolt setzt dafür einen selbst entwickelten [Parkregler](/technik/parkregler) ein. Den Weg zum Netzanschluss beschreiben die Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss) und [EZA-Regler und Parkregler](/ratgeber/eza-regler-parkregler); was das neue ElWG für Betreiber bedeutet, erklärt der Ratgeber [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispiel: Wechselrichterkonzept für 400 kWp Ost-West",
      tocLabel: "Beispiel 400 kWp",
      bloecke: [
        {
          typ: "p",
          text: "**Wie die Bausteine zusammenspielen, zeigt ein typisches Hallendach mit 400 kWp in Ost-West-Aufständerung.** Die Werte sind ein Modell zur Orientierung, keine Auslegung für ein konkretes Projekt.",
        },
        {
          typ: "tabelle",
          caption: "Modell: Wechselrichterkonzept Hallendach 400 kWp Ost-West 10°",
          kopf: ["Baustein", "Auslegung", "Begründung"],
          zeilen: [
            ["Wechselrichterleistung", "ca. 300 kW AC (DC/AC ≈ 1,33)", "Ost-West erreicht laut PVGIS nur rund 0,76 kW je kWp Spitze"],
            ["Aufteilung", "3 Geräte à ca. 100 kW mit je mehreren MPP-Trackern", "Ost- und Westseite getrennt, Teilausfall statt Totalausfall"],
            ["Stringspannung", "Auslegung auf 1.100 V bei −15 °C Modultemperatur", "Frostspannung darf die Maximalspannung nicht überschreiten"],
            ["TOR-Typ", "Typ B (Maximalkapazität ≥ 250 kW)", "erweiterte Netzanforderungen, Konformitätsnachweise"],
            ["Regelung", "Parkregler am Netzanschlusspunkt", "Blindleistung, Wirkleistungsbegrenzung, Signale des Netzbetreibers"],
            ["Überwachung", "Stringmonitoring und Fernwartung", "Fehler, Schnee und Verschattung früh erkennen"],
          ],
          minBreite: 700,
          fussnote: "Modellannahmen; Geräteanzahl, Leistung und Spannung hängen von Modultyp, Dachgeometrie, Netzvorgaben und Herstellerdaten ab.",
        },
        {
          typ: "p",
          text: "Mit 300 kW Wechselrichterleistung liegt die Maximalkapazität über der 250-kW-Grenze – die Anlage fällt damit unter Typ B. Würde man die Wechselrichterleistung auf unter 250 kW begrenzen (DC/AC ≈ 1,6), bliebe sie Typ A und verlöre bei Ost-West laut PVGIS-Stundenauswertung knapp 1 % Ertrag – ob die eingesparten Typ-B-Anforderungen das aufwiegen, ist eine Rechenfrage. Solche Abwägungen gehören an den Anfang der Planung, zusammen mit der Netzanfrage und der Dimensionierung nach Lastgang – siehe [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
      ],
    },
    {
      id: "aufstellung",
      titel: "Aufstellung, Temperatur und Brandschutz",
      tocLabel: "Aufstellung",
      bloecke: [
        {
          typ: "p",
          text: "**Wechselrichter arbeiten am effizientesten und längsten, wenn sie kühl, trocken, schattig und gut zugänglich montiert sind.** Bei hohen Umgebungstemperaturen reduzieren sie ihre Leistung (Derating), um die Elektronik zu schützen – auf einem schwarzen Blechdach in praller Sonne kann das im Hochsommer Ertrag kosten.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Montage an einer beschatteten Stelle oder unter einer Abdeckung; Lüftungsabstände laut Hersteller einhalten.",
            "Schutzart für Außenmontage (meist IP65 oder IP66) und Korrosionsschutz bei Stallabluft oder Industrieatmosphäre prüfen.",
            "Brandschutz nach OVE R 11-1 beachten: Aufstellort, Leitungswege und Kennzeichnung mit dem Brandschutzkonzept abstimmen – siehe [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz).",
            "Zugang für Service und Tausch ohne Gerüst oder Hubsteiger planen, wenn möglich.",
            "Überspannungsschutz auf DC- und AC-Seite sowie Einbindung in den Blitzschutz vorsehen.",
          ],
        },
      ],
    },
    {
      id: "betrieb",
      titel: "Wirkungsgrad, Lebensdauer und Tausch",
      tocLabel: "Lebensdauer & Tausch",
      bloecke: [
        {
          typ: "p",
          text: "**Moderne String-Wechselrichter erreichen europäische Wirkungsgrade von rund 98 bis knapp 99 % – der Unterschied zwischen guten Geräten ist klein, der Unterschied bei Zuverlässigkeit und Service groß.** Der europäische Wirkungsgrad gewichtet den Wirkungsgrad bei verschiedenen Teillasten und ist aussagekräftiger als der Spitzenwert.",
        },
        {
          typ: "tabelle",
          caption: "Worauf es im Betrieb ankommt",
          kopf: ["Thema", "Richtwert", "Hinweis"],
          zeilen: [
            ["Europäischer Wirkungsgrad", "ca. 98–99 %", "Datenblatt; Teillastverhalten beachten"],
            ["Lebensdauer", "meist 10–15 Jahre, oft länger", "in der Wirtschaftlichkeit einen Tausch während der Anlagenlaufzeit einplanen"],
            ["Herstellergarantie", "typisch 5–10 Jahre, erweiterbar", "Bedingungen für Vor-Ort-Tausch und Ersatzgeräte prüfen"],
            ["Ersatzteile und Service", "Verfügbarkeit über 10+ Jahre", "Servicenetz in Österreich, Reaktionswege im Garantiefall"],
          ],
          fussnote: "Typische Marktangaben; Garantien und Lebensdauer variieren je Hersteller und Einsatzbedingungen.",
        },
        {
          typ: "p",
          text: "Der Tausch eines Wechselrichters ist eine Gelegenheit: Neue Geräte haben mehr Tracker, bessere Netzfunktionen und oft eine Speicherschnittstelle. Bei älteren Anlagen lohnt sich die Prüfung, ob gleich ein [Repowering](/service/repowering) der ganzen Anlage sinnvoll ist. Im Rahmen eines [Wartungsvertrags](/service/wartung) sichern wir Tausch und Ersatzteile planbar ab.",
        },
      ],
    },
    {
      id: "monitoring",
      titel: "Monitoring, Fernwartung und IT-Sicherheit",
      tocLabel: "Monitoring & IT",
      bloecke: [
        {
          typ: "p",
          text: "**Wechselrichter sind heute vernetzte Geräte: Sie liefern Betriebsdaten, empfangen Steuerbefehle und erhalten Software-Updates – das macht sie zu einem Thema für die IT-Sicherheit.** Für Betriebe ist wichtig, wer auf die Anlage zugreifen kann und wie Fernzugriffe abgesichert sind.",
        },
        {
          typ: "liste",
          punkte: [
            "**Monitoring:** String- und Geräteüberwachung zeigt Ausfälle, Verschattung, Isolationsfehler und Ertragsabweichungen. Ohne Monitoring bleiben Fehler oft monatelang unbemerkt.",
            "**Netzsegmentierung:** Wechselrichter und Datenlogger gehören nicht ins Büronetz, sondern in ein eigenes, abgesichertes Netzsegment mit kontrollierten Fernzugriffen.",
            "**Herstellerzugriff:** Klären Sie, ob und wie der Hersteller über die Cloud auf Parameter zugreifen kann, und dokumentieren Sie Updates.",
            "**Regulatorik:** Der EU Cyber Resilience Act (Verordnung (EU) 2024/2847) verpflichtet Hersteller vernetzter Produkte schrittweise zu Sicherheitsanforderungen; für Betreiber kritischer Einrichtungen kommen die NIS-2-Vorgaben hinzu.",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt betreibt eigene [Fernwartungs-](/technik/fernwartung) und [SCADA-Systeme](/technik/scada), die Anlagen unterschiedlicher Hersteller in einer abgesicherten Infrastruktur zusammenführen – entwickelt gemeinsam mit dem IT-Security-Partner Solensa.",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung: 10 % Zuschlag für europäische Wechselrichter",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Beim EAG-Investitionszuschuss erhöht sich die Förderung um 10 %, wenn die Wechselrichter nachweislich in der EU, im EWR oder in der Schweiz gefertigt wurden; zusammen mit europäischen Modulen sind bis zu 20 % Zuschlag möglich.** Der Nachweis erfolgt über eine Konformitätsbewertungsstelle, die EAG-Abwicklungsstelle führt eine Liste der eingetragenen Hersteller. 2026 liegt der Höchstsatz für Anlagen über 100 bis 1.000 kWp bei 120 €/kWp, für 20 bis 100 kWp bei 130 €/kWp.",
        },
        {
          typ: "p",
          text: "Ob sich ein europäischer Wechselrichter rechnet, hängt vom Preisunterschied und der Anlagengröße ab – bei großen Anlagen kann der Zuschlag einen spürbaren Teil der Mehrkosten decken. Die Förderung im Detail erklärt der Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss). Welche Hersteller wir einsetzen, zeigt die Seite [Hersteller](/produkte/hersteller).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "String- oder Zentralwechselrichter – was ist besser?",
      a: "Für Dachanlagen und die meisten Freiflächen bis in den Megawattbereich String-Wechselrichter: mehr MPP-Tracker, geringere Ausfallwirkung, einfacher Tausch. Zentralwechselrichter lohnen sich vor allem bei sehr großen, einheitlichen Freiflächenanlagen.",
    },
    {
      q: "Wie groß muss der Wechselrichter im Verhältnis zur PV-Leistung sein?",
      a: "Meist 70 bis 85 % der Modulleistung, also ein DC/AC-Verhältnis von 1,2 bis 1,4. Bei Ost-West-Anlagen kostet ein Verhältnis von 1,43 laut PVGIS-Stundenauswertung praktisch keinen Ertrag, bei Süd 30° rund 1,3 %.",
    },
    {
      q: "Welche Wechselrichter sind in Österreich zugelassen?",
      a: "Geräte, die die TOR Stromerzeugungsanlagen erfüllen. Eine zentrale Übersicht bietet wechselrichterliste.at, auf die alle Verteilernetzbetreiber zugreifen. Der Errichter weist die Konformität bei der Netzanmeldung nach.",
    },
    {
      q: "Was ändert sich ab 250 kW?",
      a: "Die Anlage gilt nach den TOR als Typ B. Dann gelten erweiterte Anforderungen an Netzstützung, Kommunikation mit dem Netzbetreiber und Nachweise; häufig wird ein Parkregler am Netzanschlusspunkt eingesetzt.",
    },
    {
      q: "Wie lange hält ein Wechselrichter?",
      a: "Meist 10 bis 15 Jahre, gute Geräte auch länger. Da PV-Module 25 bis 30 Jahre halten, sollte in der Wirtschaftlichkeitsrechnung ein Tausch eingeplant werden – idealerweise abgesichert über Garantieverlängerung oder Wartungsvertrag.",
    },
    {
      q: "Brauche ich einen Hybrid-Wechselrichter für einen Speicher?",
      a: "Nicht zwingend. Hybrid-Wechselrichter koppeln den Speicher auf der Gleichstromseite, separate Batteriewechselrichter auf der Wechselstromseite. Im Gewerbe ist die AC-Kopplung verbreitet, weil sie unabhängig von der PV-Anlage geplant und nachgerüstet werden kann.",
    },
  ],

  passend: [
    { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "TOR-konform, Blindleistung & Einspeiselimit." },
    { href: "/technik/fernwartung", titel: "Fernwartung", text: "Sichere Fernzugriffe, 24/7-Überwachung." },
    { href: "/produkte/photovoltaikanlage", titel: "Photovoltaikanlage", text: "Module, Wechselrichter, Unterkonstruktion." },
    { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "TOR Erzeuger & Netzanschluss", text: "Typ A bis D, Netzebenen, Nachweise." },
  ],

  quellen: [
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A bis D (Version 1.4)", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
    { titel: "Oesterreichs Energie – Wechselrichterliste und TOR-Neuigkeiten", url: "https://oesterreichsenergie.at/downloads/publikationsdatenbank/detailseite/wechselrichterliste-tor-erzeuger-typ-a", stand: "09/2026" },
    { titel: "Wechselrichterliste.at – Nachweis der Netzkonformität", url: "https://www.wechselrichterliste.at/", stand: "09/2026" },
    { titel: "RIS – EAG-Investitionszuschüsseverordnung-Strom, §§ 5 und 6", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40275221/NOR40275221.html", stand: "09/2026" },
    { titel: "EU JRC – PVGIS 5.3, Stundenreihen (Clipping-Auswertung)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "EUR-Lex – Verordnung (EU) 2024/2847 (Cyber Resilience Act)", url: "https://eur-lex.europa.eu/eli/reg/2024/2847/oj", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wechselrichter für Ihre Anlage?", text: "TOR-konform ausgelegt, mit Parkregler und Monitoring.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Wechselrichter, Parkregler und Monitoring aus einer Hand.",
    text: "Wir legen Wechselrichter passend zu Dach, Lastgang und Netzanschluss aus, erfüllen die TOR-Anforderungen und überwachen die Anlage mit eigener Fernwartung.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Parkregler", href: "/technik/parkregler" },
  },
};

export default artikel;
