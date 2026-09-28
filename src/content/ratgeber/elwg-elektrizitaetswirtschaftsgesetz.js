// Ratgeber: ElWG – Elektrizitätswirtschaftsgesetz: Was sich für PV-Betreiber, Betriebe und Energiegemeinschaften ändert
// Recherchestand 28.09.2026:
// - Beschluss Nationalrat 11.12.2025 (Zweidrittelmehrheit), Bundesrat danach; BGBl. I Nr. 91/2025 vom 23.12.2025,
//   Inkrafttreten 24.12.2025 mit gestaffelten Terminen (Parlament, RIS-Kundmachung laut Suchergebnis, e-steiermark).
// - Einspeiser-Regeln: WKO NÖ, BMWET-Factsheet Spitzenkappung, Energie NÖ, Schönherr, PV Austria Netzthemen.
// - Energiegemeinschaften: Koordinationsstelle (FAQs zum ElWG, Empfehlung v2 08/2026).
// - Netzentgelte 2027: E-Control SNE-G-V-Begutachtungsentwurf (07/2026), Wiener Stadtwerke Zusammenfassung.
// RIS war während der Recherche nicht direkt abrufbar (503); Paragrafenangaben stammen aus Sekundärquellen und sind
// im Text sparsam und nur dort verwendet, wo mehrere Quellen übereinstimmen.

const artikel = {
  slug: "elwg-elektrizitaetswirtschaftsgesetz",
  title: "ElWG: Was das neue Elektrizitätswirtschaftsgesetz für PV bedeutet",
  seoTitle: "ElWG 2026: Was sich für PV-Betreiber ändert | Ökovolt",
  kurzTitel: "ElWG Elektrizitätswirtschaftsgesetz",
  description:
    "ElWG 2026 erklärt: Spitzenkappung 70 %, Einspeiseentgelt, Netzanschluss, Energiegemeinschaften, aktive Kunden und Speicher – was PV-Betreiber wissen müssen.",
  excerpt:
    "Das Elektrizitätswirtschaftsgesetz löst das ElWOG 2010 ab und ist seit 24. Dezember 2025 in Kraft. Die wichtigsten Termine und Änderungen für PV-Anlagen, Betriebe, Speicher und Energiegemeinschaften – und was noch offen ist.",
  hauptKeyword: "elwg",
  keywords: [
    "ElWG",
    "Elektrizitätswirtschaftsgesetz",
    "ElWG Photovoltaik",
    "Spitzenkappung PV 70 Prozent",
    "Versorgungsinfrastrukturbeitrag",
    "ElWG Energiegemeinschaften",
    "ElWG Netzanschlussentgelt",
    "ElWG aktive Kunden",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/AT/ratgeber/elwg-elektrizitaetswirtschaftsgesetz.jpg",
  bildAlt: "Umspannwerk Michelbeuern in Wien",
  badge: { wert: "24.12.2025", text: "Inkrafttreten des ElWG (BGBl. I Nr. 91/2025)" },

  kurzFazit: [
    "**Das Elektrizitätswirtschaftsgesetz (ElWG) wurde am 11. Dezember 2025 vom Nationalrat mit Zweidrittelmehrheit beschlossen, am 23. Dezember 2025 als BGBl. I Nr. 91/2025 kundgemacht und ist seit 24. Dezember 2025 in Kraft.** Es ersetzt das ElWOG 2010; viele Bestimmungen gelten gestaffelt ab 2026 und 2027.",
    "Für PV-Betreiber am wichtigsten: **Spitzenkappung** neuer oder erweiterter PV-Anlagen über 7 kW auf bis zu **70 %** der Modulspitzenleistung ab **1. 1. 2027**, **Steuerbarkeit** ab 3,68 kW und ein **Versorgungsinfrastrukturbeitrag** von höchstens **0,05 ct/kWh** für Einspeiser über 20 kW.",
    "Beim Netzanschluss sind Einspeiser bis **15 kW** vom Netzanschlussentgelt befreit; bei knappen Netzen ist ein **flexibler Netzzugang** für 12, 18 oder 24 Monate möglich.",
    "Seit **1. Oktober 2026** gelten neue Regeln für **Energiegemeinschaften** und die gemeinsame Energienutzung (Peer-to-Peer, Organisator, Lieferantenpflichten ab 30/100 kW). Die neue Netzentgeltstruktur mit Leistungspreis folgt am **1. Jänner 2027** – die Tarifverordnung dazu steht noch aus.",
  ],

  abschnitte: [
    {
      id: "stand",
      titel: "Ist das ElWG beschlossen und in Kraft?",
      tocLabel: "Gesetzesstand",
      bloecke: [
        {
          typ: "p",
          text: "**Ja. Das ElWG ist seit 24. Dezember 2025 in Kraft.** Der Nationalrat beschloss das Paket „Günstiger-Strom-Gesetz“ – bestehend aus dem Elektrizitätswirtschaftsgesetz, dem Energiearmuts-Definitions-Gesetz und einer Novelle des Energie-Control-Gesetzes – am 11. Dezember 2025 mit der nötigen Zweidrittelmehrheit; der Bundesrat stimmte zu. Kundgemacht wurde es am 23. Dezember 2025 im Bundesgesetzblatt (BGBl. I Nr. 91/2025). Das ElWG setzt die EU-Strombinnenmarktrichtlinie (EU) 2019/944 in der Fassung (EU) 2024/1711 um und löst das ElWOG 2010 ab.",
        },
        {
          typ: "p",
          text: "Wichtig für die Praxis: Nicht alles gilt sofort. Das Gesetz enthält gestaffelte Inkrafttretens- und Übergangsbestimmungen, und viele Details regeln erst Verordnungen – insbesondere die Systemnutzungsentgelte der E-Control. Die Landes-Ausführungsgesetze zum ElWOG, etwa für elektrizitätsrechtliche Genehmigungen, bestehen parallel weiter (siehe [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung)). Im Lexikon: [ElWG](/wissen/lexikon#elwg). Weil ElWG, Verordnungen und Marktprozesse ineinandergreifen, lohnt sich bei neuen Projekten ein kurzer Abgleich mit dem aktuellen Stand beim Netzbetreiber – gerade bei Anlagen, die rund um den 1. Jänner 2027 ans Netz gehen.",
        },
        {
          typ: "tabelle",
          caption: "Zeitplan des ElWG für PV-Betreiber, Betriebe und Energiegemeinschaften, Stand September 2026",
          kopf: ["Datum", "Was gilt"],
          zeilen: [
            ["24. 12. 2025", "Inkrafttreten des ElWG (grundsätzlich); einzelne Pflichten wie die Steuerbarkeit neuer Anlagen mit eigenen Übergangsbestimmungen"],
            ["1. 4. 2026", "Sozialtarif: 6 ct/kWh für bis zu 2.900 kWh Jahresverbrauch bei rund 284.000 begünstigten Haushalten"],
            ["1. 10. 2026", "neue Regeln für gemeinsame Energienutzung und Energiegemeinschaften, Lieferantenpflichten für aktive Kunden"],
            ["5. 10. 2026", "neue Bürgerenergie-Modelle zunächst mit Zählpunkten beim selben Netzbetreiber umsetzbar"],
            ["1. 1. 2027", "neue Systemnutzungsentgelte (Leistungspreis, zeitvariable Arbeitspreise), Spitzenkappung, Versorgungsinfrastrukturbeitrag, neues Netzanschlussentgelt"],
            ["ab April 2027 (voraussichtlich)", "netzübergreifende Energiegemeinschaften, erweiterter Standort- und Regionalbereich in der Praxis"],
            ["2028 (geplant)", "dynamische, netzzustandsabhängige Spitzenkappung"],
          ],
          minBreite: 640,
          fussnote: "Quellen: Parlament, E-Energie Steiermark, BMWET, WKO, Koordinationsstelle für Energiegemeinschaften. Termine für Verordnungen und Marktprozesse können sich verschieben.",
        },
      ],
    },
    {
      id: "pv",
      titel: "Was ändert sich für PV-Anlagen und Einspeiser?",
      tocLabel: "PV & Einspeiser",
      bloecke: [
        {
          typ: "p",
          text: "**Für PV-Betreiber bringt das ElWG drei Pflichten und eine Entlastung: Steuerbarkeit, Spitzenkappung, ein Einspeiseentgelt für größere Anlagen – und die Befreiung kleiner Anlagen vom Netzanschlussentgelt.**",
        },
        {
          typ: "tabelle",
          caption: "ElWG-Regeln für Stromerzeuger nach Leistungsklasse, Stand September 2026",
          kopf: ["Regel", "betroffen", "Inhalt", "ab"],
          zeilen: [
            ["Steuerbarkeit", "neue Anlagen ab 3,68 kW netzwirksam", "Netzbetreiber muss die Anlage bei Bedarf steuern können", "laut Übergangsbestimmungen"],
            ["Spitzenkappung PV", "neue oder erweiterte PV-Anlagen über 7 kW netzwirksam", "Begrenzung der Einspeisung auf bis zu 70 % der Modulspitzenleistung, ohne Entschädigung; Bestandsanlagen unverändert", "1. 1. 2027"],
            ["Spitzenkappung Wind", "Windkraftanlagen", "max. 1 % der Jahresenergie bzw. 15 % der netzwirksamen Leistung einer Referenzanlage", "1. 1. 2027"],
            ["Versorgungsinfrastrukturbeitrag", "Einspeiser über 20 kW netzwirksam", "höchstens 0,05 ct je eingespeister kWh, Höhe jährlich per Verordnung", "1. 1. 2027"],
            ["Netzanschlussentgelt", "Einspeiser über 15 kW netzwirksam", "aufwandsorientierter und pauschaler Anteil; bis 15 kW befreit", "1. 1. 2027"],
            ["Netzverlust- und Regelleistungsentgelt", "Einspeiser über 5 MW", "unverändert nur für große Einspeiser", "–"],
          ],
          minBreite: 780,
          fussnote: "Zusammenfassung nach WKO, BMWET, Energie NÖ, E-Energie Steiermark und PV Austria. Die Regierungsvorlage sah 60 % statt 70 % (PV), 2 % statt 1 % (Wind) und 7 kW statt 15 kW bei der Anschlussentgelt-Befreiung vor; die beschlossene Fassung ist großzügiger. Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Spitzenkappung: Was „70 % der Modulspitzenleistung“ bedeutet",
          text: "Bei einer 10-kWp-Anlage darf die Einspeiseleistung auf 7 kW begrenzt werden. Betroffen sind nur neu errichtete oder erweiterte PV-Anlagen, deren Netzanschluss neu hergestellt oder geändert wird oder deren befristet flexibler Netzzugang ausläuft; Anlagen bis 7 kW netzwirksamer Leistung sind ausgenommen. Laut Bundesministerium werden bei südorientierten Anlagen weniger als 1 von 100 erzeugten kWh abgeregelt, bei Ost-West-Anlagen wird die 70-%-Marke nur etwa eine Stunde pro Jahr überschritten. Mit Speicher und flexiblem Verbrauch sinkt der Verlust weiter.",
        },
        {
          typ: "p",
          text: "Technisch setzen Betriebe die Begrenzung über Wechselrichter-Einstellungen oder einen [Parkregler](/ratgeber/eza-regler-parkregler) um. Wer den Eigenverbrauch einbezieht, begrenzt nur die Einspeisung, nicht die Erzeugung. Die Verfahren beim Netzbetreiber beschreiben [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden) und [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss).",
        },
      ],
    },
    {
      id: "netzanschluss",
      titel: "Netzanschluss: flexibler Netzzugang, Kapazitäten, Direktleitungen",
      tocLabel: "Netzanschluss",
      bloecke: [
        {
          typ: "p",
          text: "**Das ElWG soll mehr Anlagen schneller ans Netz bringen – mit flexiblen Netzzugängen, mehr Transparenz über freie Kapazitäten und klaren Kostenregeln.** Die wichtigsten Instrumente:",
        },
        {
          typ: "liste",
          punkte: [
            "**Flexibler Netzzugang:** Reicht die Kapazität nicht, kann ein befristeter flexibler Zugang vereinbart werden – je nach Netzebene 12, 18 oder 24 Monate, nur im Verteilernetz. Die Einspeisung wird zeitweise begrenzt statt der Anschluss verweigert. Für dauerhaft flexible Anschlüsse ist ein Abschlag beim pauschalen Anschlussentgelt vorgesehen.",
            "**Kapazitätstransparenz:** Netzbetreiber veröffentlichen verfügbare, gebuchte und zulässige Anschlusskapazitäten – auf Netzebene 4 bereits, auf Netzebene 6 innerhalb von drei Jahren.",
            "**Reservierung:** Laut PV Austria kann Kapazität nach der Antwort des Netzbetreibers binnen eines Monats durch Anzahlung für zwölf Monate reserviert werden; gereiht wird nach Vorliegen aller Genehmigungen.",
            "**Direktleitungen:** Erzeuger dürfen eigene Direktleitungen zur direkten Stromlieferung oder Eigennutzung errichten.",
            "**Geschlossene Verteilernetze:** Neue Regeln treten zwei Jahre nach Gesetzesbeschluss in Kraft.",
          ],
        },
      ],
    },
    {
      id: "netzentgelte",
      titel: "Netzentgelte ab 2027: Leistungspreis und Zeitfenster",
      tocLabel: "Netzentgelte 2027",
      bloecke: [
        {
          typ: "p",
          text: "**Ab 1. Jänner 2027 gilt eine neue Netzentgeltstruktur mit deutlich höherem Leistungsanteil; die Grundsätze legt die E-Control in der Systemnutzungsentgelte-Grundsatzverordnung fest, die Beträge in der Tarifverordnung.** Der Begutachtungsentwurf vom Juli 2026 sieht vor:",
        },
        {
          typ: "liste",
          punkte: [
            "**Leistungspreis flächendeckend:** Ziel ist ein Verhältnis von rund 50 % Arbeits- zu 50 % Leistungsanteil über alle Netzebenen; auch auf Netzebene 7 wird die höchste Viertelstundenleistung je Kalendermonat verrechnet, mit niedrigerem Tarif bis 10 kW.",
            "**Zeitvariable Arbeitspreise:** österreichweit einheitliche Niedertarif-Fenster – Sommer (April–September) 10 bis 16 Uhr, Winter (Oktober–März) 22 bis 4 Uhr.",
            "**Flexible Entnahme:** Wer dem Netzbetreiber erlaubt, die Bezugsleistung zeitweise einzuschränken, erhält einen reduzierten Leistungspreis – interessant für Speicher und flexible Industrieprozesse.",
            "**Speicher:** Netznutzungs- und Netzverlustentgelt können für systemdienliche Speicher entfallen (u. a. mindestens 1 MW, Vertrag mit APG, Kontingent 5 GW, Inbetriebnahme bis Ende 2030); das ElWG sieht eine 20-jährige Befreiung ab Inbetriebnahme vor.",
            "**Gemeinsame Energienutzung:** Abschläge auf den Arbeitspreis je nach genutzter Netzinfrastruktur, für alle Modelle im Nahebereich einheitlich.",
          ],
        },
        {
          typ: "p",
          text: "Für Betriebe verschiebt sich damit der Hebel: Lastspitzen kosten mehr, Verbrauch zur Mittagszeit im Sommer weniger. PV, Speicher und Lastmanagement gewinnen an Wert – siehe [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis) und [Gewerbespeicher-Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "energiegemeinschaften",
      titel: "Energiegemeinschaften und aktive Kunden",
      tocLabel: "Energiegemeinschaften",
      bloecke: [
        {
          typ: "p",
          text: "**Seit 1. Oktober 2026 fasst das ElWG Energiegemeinschaften, gemeinschaftliche Erzeugungsanlagen und neue Modelle unter dem Begriff „gemeinsame Energienutzung“ zusammen.** Aktive Kunden dürfen Strom gemeinsam erzeugen, speichern, verbrauchen und verkaufen – auch ohne Verein, per Peer-to-Peer-Vertrag – und an allen Strommärkten teilnehmen, sofern das nicht ihre gewerbliche Haupttätigkeit ist.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Neue Modelle", text: "Peer-to-Peer-Verträge, Eigenversorgungsanlagen für mehrere Standorte einer Person, erweiterter Standortbereich für GEA über Sammelschienen, netzübergreifende EEG." },
            { titel: "Neue Pflichten", text: "Lieferantenpflichten nach § 69 ElWG für Anlagen über 30 kW (Haushalte) bzw. 100 kW (sonstige); 6-MW-Grenze für große Unternehmen; 10 % der Energie aus Gemeindeanlagen für schutzbedürftige Haushalte." },
            { titel: "Neue Rolle", text: "Der Organisator übernimmt Marktprozesse und Abrechnung für die Gemeinschaft und muss dabei Lieferantenpflichten erfüllen." },
            { titel: "Netzentgelte", text: "Bis Ende 2026 Reduktion nur für lokale und regionale EEG; ab 2027 für alle Modelle im Nahebereich. Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag entfallen weiterhin nur bei EEG." },
          ],
        },
        {
          typ: "p",
          text: "Details, Zeitplan und Gründung erklären die Ratgeber [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden), [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe) und [Gemeinschaftliche Erzeugungsanlage](/ratgeber/gemeinschaftliche-erzeugungsanlage).",
        },
      ],
    },
    {
      id: "kunden",
      titel: "Was ändert sich für Stromkunden und Betriebe?",
      tocLabel: "Stromkunden",
      bloecke: [
        {
          typ: "liste",
          punkte: [
            "**Tarifangebot:** Lieferanten müssen fixe und dynamische Tarife anbieten – siehe [Dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich).",
            "**Abrechnung:** Mit Smart Meter ist eine monatliche statt jährliche Abrechnung möglich.",
            "**Sozialtarif:** Seit 1. 4. 2026 gilt für begünstigte Haushalte ein gestützter Preis von 6 ct/kWh für bis zu 2.900 kWh im Jahr.",
            "**Smart Meter:** Der Rechtsrahmen für intelligente Messgeräte wurde übernommen; die neue Anforderungsverordnung IMA-V 2026 gilt seit 15. 7. 2026 – siehe [Smart Meter](/ratgeber/smart-meter-pflicht).",
          ],
        },
      ],
    },
    {
      id: "offen",
      titel: "Was ist noch offen?",
      tocLabel: "Offene Punkte",
      bloecke: [
        {
          typ: "p",
          text: "**Das Gesetz steht, viele Zahlen nicht: Die Höhe von Netzentgelten, Abschlägen und Beiträgen legen Verordnungen fest, die teils noch ausstehen.** Stand Ende September 2026 sind folgende Punkte offen oder nur als Entwurf bekannt:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Systemnutzungsentgelte-Grundsatzverordnung:** Begutachtung bis 24. 7. 2026; die Erlassung war laut E-Control bis Oktober 2026 geplant.",
            "**Tarifverordnung 2027:** konkrete Leistungs- und Arbeitspreise, Abschläge für gemeinsame Energienutzung, Kostensätze und Pauschalen des Netzanschlussentgelts.",
            "**Versorgungsinfrastrukturbeitrag:** Höhe (höchstens 0,05 ct/kWh) wird jährlich festgelegt.",
            "**Dynamische Spitzenkappung ab 2028:** Details zur netzzustandsabhängigen Begrenzung.",
            "**Marktprämie für EEG:** Das ElWG erlaubt für BEG-Anlagen 100 % statt 50 %; für EEG braucht es noch eine EAG-Änderung.",
            "**Speicher in Energiegemeinschaften:** Messkonzepte nach § 111 ElWG sind rechtlich angelegt, die Praxis ist laut Koordinationsstelle noch unklar.",
            "**Marktprozesse:** Netzbetreiber setzen neue Prozesse in Stufen um (ebUtilities-Konsultationen); netzübergreifende Modelle voraussichtlich ab April 2027.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Was PV-Betreiber jetzt tun sollten",
          text: "Planen Sie neue Anlagen mit einer Einspeisebegrenzungs-Option und prüfen Sie, ob ein Speicher Spitzenkappung und Leistungspreis gleichzeitig abfedert. Legen Sie die netzwirksame Leistung bewusst fest, weil sie ab 2027 das Anschlussentgelt bestimmt. Und prüfen Sie Energiegemeinschaften als Absatzkanal für Überschüsse – der Nahebereich entscheidet über den Netzentgeltvorteil.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Ist das ElWG schon in Kraft?",
      a: "Ja. Das ElWG wurde am 11. Dezember 2025 vom Nationalrat beschlossen, am 23. Dezember 2025 als BGBl. I Nr. 91/2025 kundgemacht und ist seit 24. Dezember 2025 in Kraft. Viele Bestimmungen gelten gestaffelt, etwa die Energiegemeinschaftsregeln ab 1. Oktober 2026 und die neuen Netzentgelte ab 1. Jänner 2027.",
    },
    {
      q: "Was bedeutet die Spitzenkappung für meine PV-Anlage?",
      a: "Ab 1. Jänner 2027 dürfen Netzbetreiber die Einspeisung neuer oder erweiterter PV-Anlagen über 7 kW auf bis zu 70 % der Modulspitzenleistung begrenzen – ohne Entschädigung. Bestehende, unveränderte Anlagen sind nicht betroffen. Laut Bundesministerium gehen bei Südanlagen weniger als 1 % der Erzeugung verloren.",
    },
    {
      q: "Muss ich ab 2027 für die Einspeisung zahlen?",
      a: "Einspeiser über 20 kW netzwirksamer Leistung zahlen ab 2027 einen Versorgungsinfrastrukturbeitrag von höchstens 0,05 ct je eingespeister kWh. Bei 100.000 kWh Einspeisung wären das höchstens 50 € im Jahr. Einspeiser bis 20 kW sind befreit.",
    },
    {
      q: "Was ändert das ElWG für Energiegemeinschaften?",
      a: "Seit 1. Oktober 2026 gibt es neue Modelle wie Peer-to-Peer-Verträge, den Organisator, Lieferantenpflichten ab 30 bzw. 100 kW und ab 2027 Netzentgeltabschläge für alle Modelle im Nahebereich. Bestehende Gemeinschaften werden automatisch übergeleitet.",
    },
    {
      q: "Was ist ein aktiver Kunde?",
      a: "Ein Endkunde oder eine Gruppe von Endkunden, die selbst erzeugten oder gemeinsam erzeugten Strom verbrauchen, speichern, verkaufen oder an Flexibilitätsprogrammen teilnehmen – sofern das nicht ihre gewerbliche oder berufliche Haupttätigkeit ist.",
    },
    {
      q: "Werden Stromspeicher durch das ElWG entlastet?",
      a: "Ja. Systemdienlich betriebene Speicher können für 20 Jahre ab Inbetriebnahme von Netznutzungs- und Netzverlustentgelten befreit werden. Laut Verordnungsentwurf gilt das u. a. ab 1 MW, mit APG-Vertrag und innerhalb eines Kontingents von 5 GW bis 2030. Zusätzlich reduziert ein flexibler Bezug den Leistungspreis.",
    },
    {
      q: "Gilt das ElWOG 2010 noch?",
      a: "Das ElWG löst das ElWOG 2010 als Bundesgesetz ab. Die Landes-Elektrizitätsgesetze, die auf dem ElWOG beruhen, gelten weiter, bis die Länder sie anpassen – etwa für elektrizitätsrechtliche Genehmigungen von Erzeugungsanlagen.",
    },
  ],

  passend: [
    { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "TOR Erzeuger & Netzanschluss", text: "Technik und Kosten des Netzanschlusses." },
    { href: "/ratgeber/energiegemeinschaft-gruenden", titel: "Energiegemeinschaft gründen", text: "Modelle und Netzentgelte nach ElWG." },
    { href: "/technik/parkregler", titel: "Parkregler", text: "Spitzenkappung und Einspeisebegrenzung umsetzen." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Leistungspreis und Spitzenkappung abfedern." },
  ],

  quellen: [
    { titel: "Parlament Österreich – Günstiger-Strom-Gesetz (ElWG, EnDG, E-ControlG-Novelle)", url: "https://www.parlament.gv.at/gegenstand/XXVIII/I/312", stand: "12/2025" },
    { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", stand: "12/2025" },
    { titel: "WKO – Information zum finalen Elektrizitätswirtschaftsgesetz", url: "https://www.wko.at/noe/transport-verkehr/spedition-logistik/elwg", stand: "09/2026" },
    { titel: "BMWET – Spitzenkappung (ElWG-Infos)", url: "https://www.bmwet.gv.at/Services/Infos-FAQ/elwg-infos/spitzenkappung.html", stand: "2026" },
    { titel: "Energie Steiermark – Das ElWG im Überblick", url: "https://www.e-steiermark.com/ueber-uns/impulse-blog/das-elwg-im-ueberblick", stand: "2026" },
    { titel: "Österreichische Koordinationsstelle für Energiegemeinschaften – FAQs zum ElWG", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/", stand: "09/2026" },
    { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "PV Austria – Netzthemen (ElWG, Netzanschluss, Entgelte)", url: "https://pvbaustria.at/netzthemen/", stand: "09/2026" },
  ],

  seitenCta: { titel: "ElWG-fit planen?", text: "Wir berücksichtigen Spitzenkappung, Anschlussentgelt und Speicher im Konzept.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Neue Regeln, klare Planung: PV-Anlagen nach ElWG.",
    text: "Ökovolt Solartechnik plant PV-Anlagen, Speicher und Regelungstechnik für Betriebe und Gemeinden so, dass sie zu den Netzregeln ab 2027 passen.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Parkregler", href: "/technik/parkregler" },
  },
};

export default artikel;
