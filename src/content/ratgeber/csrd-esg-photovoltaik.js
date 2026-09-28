// Ratgeber (R1): CSRD, ESG & Photovoltaik – Nachhaltigkeitsberichterstattung in Österreich
// Stand 09/2026: Omnibus I (RL (EU) 2026/470), Stop-the-Clock (RL (EU) 2025/794), NaBeG (BGBl. I Nr. 6/2026),
// Value Chain Cap § 243ba UGB, VSME (Empfehlung (EU) 2025/1710) – Quelle WKO.
// Emissionsfaktoren im Rechenbeispiel sind ausdrücklich als Rechenannahmen gekennzeichnet.

const artikel = {
  slug: "csrd-esg-photovoltaik",
  title: "CSRD, ESG & Photovoltaik: Was Unternehmen 2026 wissen müssen",
  seoTitle: "CSRD, ESG & Photovoltaik 2026 | Ökovolt",
  kurzTitel: "CSRD, ESG & Photovoltaik",
  description:
    "CSRD nach dem Omnibus-Paket, VSME für KMU und Scope 2: Wie eine eigene PV-Anlage Ihre Klimabilanz verbessert und was Kunden und Banken 2026 wirklich abfragen.",
  excerpt:
    "Die CSRD trifft nach dem Omnibus-Paket nur noch Großunternehmen – die Fragen von Kunden und Banken nach Ihrer Klimabilanz bleiben. Wie eigene Photovoltaik Scope 2 senkt und wie Sie das sauber belegen.",
  hauptKeyword: "csrd photovoltaik",
  keywords: [
    "CSRD Photovoltaik",
    "ESG Photovoltaik Unternehmen",
    "Scope 2 Photovoltaik",
    "VSME Standard KMU",
    "Nachhaltigkeitsbericht Österreich",
    "Omnibus CSRD Schwellenwerte",
    "CO2-Bilanz Unternehmen Strom",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
  bildAlt: "Luftaufnahme einer Photovoltaikanlage auf mehreren Dachflächen",
  badge: { wert: "> 1.000 AN", text: "und > 450 Mio. € Umsatz: neue CSRD-Schwelle" },

  kurzFazit: [
    "**Nach dem EU-Omnibus-Paket (Richtlinie (EU) 2026/470) müssen nur noch Unternehmen mit mehr als 1.000 Beschäftigten und mehr als 450 Mio. € Umsatz nach der CSRD berichten**, erstmals 2028 über das Geschäftsjahr 2027. In Österreich setzt das Nachhaltigkeitsberichtsgesetz (NaBeG, BGBl. I Nr. 6/2026) die CSRD zunächst für die bisher berichtspflichtigen Unternehmen um.",
    "Die meisten KMU sind **nicht direkt berichtspflichtig, werden aber von Kunden, Konzernen und Banken nach Energie- und Klimadaten gefragt**. Der Value Chain Cap (§ 243ba UGB) begrenzt diese Anfragen für Unternehmen bis 1.000 Beschäftigte auf den freiwilligen VSME-Standard.",
    "**Eigener Solarstrom senkt die Scope-2-Emissionen** – im standortbasierten Ansatz immer, im marktbasierten Ansatz nur, wenn Ihr bisheriger Liefervertrag nicht ohnehin 100 % erneuerbar gekennzeichnet ist.",
    "Beispiel: 250 kWp mit 70 % Eigenverbrauch ersetzen **175.000 kWh Netzstrom pro Jahr**; bei einem angenommenen Emissionsfaktor von 150 bis 250 g CO₂/kWh sind das **26 bis 44 Tonnen CO₂** weniger im standortbasierten Scope 2.",
    "Was zählt, sind **belastbare Daten**: Viertelstundenwerte von Erzeugung, Eigenverbrauch und Einspeisung aus Monitoring oder SCADA – nicht Marketingaussagen wie „klimaneutral“.",
  ],

  abschnitte: [
    {
      id: "wer-berichtet",
      titel: "Wer muss 2026 nach der CSRD berichten?",
      tocLabel: "Wer berichtet?",
      bloecke: [
        {
          typ: "p",
          text: "**Direkt berichtspflichtig sind künftig nur große Unternehmen mit durchschnittlich mehr als 1.000 Beschäftigten und mehr als 450 Mio. € Nettoumsatz; die Berichterstattung ist erstmals 2028 für das Geschäftsjahr 2027 vorgesehen.** Das ist das Ergebnis des Omnibus-I-Pakets der EU, das mit der Richtlinie (EU) 2026/470 die Nachhaltigkeitsberichterstattung (CSRD) und die Lieferketten-Sorgfaltspflichten (CSDDD) vereinfacht hat. Bereits davor hatte die „Stop-the-Clock“-Richtlinie (EU) 2025/794 den Start der sogenannten zweiten Welle verschoben.",
        },
        {
          typ: "p",
          text: "Österreich hat die CSRD mit dem Nachhaltigkeitsberichtsgesetz (NaBeG, BGBl. I Nr. 6/2026) zunächst nur für jene rund 100 Unternehmen umgesetzt, die schon nach dem Nachhaltigkeits- und Diversitätsverbesserungsgesetz (NaDiVeG) berichten mussten – große Unternehmen von öffentlichem Interesse mit mehr als 500 Beschäftigten. Eine weitere UGB-Novelle ist laut WKO nötig, um das Omnibus-Paket vollständig umzusetzen. Damit fallen Unternehmen mit 500 bis 1.000 Beschäftigten aus der Pflicht heraus.",
        },
        {
          typ: "tabelle",
          caption: "Nachhaltigkeitsberichterstattung in Österreich nach dem Omnibus-I-Paket, Stand September 2026",
          kopf: ["Unternehmen", "Pflicht", "Standard"],
          zeilen: [
            ["> 1.000 Beschäftigte und > 450 Mio. € Umsatz", "CSRD-Nachhaltigkeitsbericht im Lagebericht, extern geprüft (begrenzte Prüfsicherheit)", "ESRS (vereinfachte Fassung in Vorbereitung)"],
            ["Unternehmen von öffentlichem Interesse, bisher NaDiVeG-pflichtig, unter den neuen Schwellen", "übergangsweise weiter berichtspflichtig, Wahlrecht NaDiVeG oder CSRD/NaBeG", "bis zur UGB-Novelle"],
            ["Große Unternehmen unter den neuen Schwellen", "nach UGB-Novelle keine Nachhaltigkeitsberichtspflicht über § 243 Abs. 5 UGB hinaus", "freiwillig, z. B. VSME"],
            ["KMU (nicht börsennotiert)", "keine Berichtspflicht, aber Datenanfragen aus der Lieferkette", "VSME (Empfehlung (EU) 2025/1710)"],
            ["Kapitalmarktorientierte KMU", "aus dem Anwendungsbereich herausgenommen", "freiwillig"],
          ],
          minBreite: 720,
          fussnote: "Quelle: WKO, CSRD und ESG-Berichte (Stand 09/2026) und Omnibus-Paket. Schwellenwerte vereinfacht; Konzern- und Drittlandregeln nicht dargestellt. Keine Rechtsberatung – Berichtspflicht auf Einzel- und Konzernebene prüfen lassen.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "ESRS und Taxonomie werden schlanker",
          text: "Die EU-Kommission hat im Juli 2026 vereinfachte ESRS als delegierten Rechtsakt angenommen; laut Kommission sinkt die Zahl der verpflichtenden Datenpunkte um mehr als 60 %. Bei der EU-Taxonomie gilt mit der Delegierten Verordnung (EU) 2026/73 eine Wesentlichkeitsschwelle: Aktivitäten unter 10 % von Umsatz, CapEx und OpEx müssen nicht im Detail geprüft werden. Beides war zum Redaktionsschluss noch nicht vollständig in Kraft.",
        },
      ],
    },
    {
      id: "kmu",
      titel: "Warum Photovoltaik für nicht berichtspflichtige Betriebe trotzdem ein ESG-Thema ist",
      tocLabel: "Warum KMU betroffen sind",
      bloecke: [
        {
          typ: "p",
          text: "**Auch ohne eigene Berichtspflicht werden KMU nach ihren Energie- und Emissionsdaten gefragt – von Konzernkunden für deren Scope-3-Bilanz, von Banken bei der Kreditvergabe und von öffentlichen Auftraggebern.** Die WKO beschreibt diesen „Trickle-down-Effekt“ ausdrücklich: Häufig werden Informationen zu Umweltstandards und zum CO₂-Fußabdruck von Produkten angefragt.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Kunden & Konzerne", text: "Berichtspflichtige Abnehmer brauchen Daten ihrer Lieferanten. Wer seinen Strom zu einem großen Teil selbst erzeugt, kann niedrigere Emissionen je Produkt belegen." },
            { titel: "Banken & Finanzierung", text: "Kreditinstitute erheben ESG-Daten ihrer Firmenkunden. Eine eigene PV-Anlage ist ein messbarer Beitrag, der sich in Gesprächen über Konditionen dokumentieren lässt." },
            { titel: "Ausschreibungen", text: "Öffentliche und private Auftraggeber gewichten Nachhaltigkeitskriterien stärker. Belastbare Energiedaten sind dort ein Wettbewerbsvorteil." },
          ],
        },
        {
          typ: "h3",
          text: "Value Chain Cap: Was Kunden von Ihnen verlangen dürfen",
        },
        {
          typ: "p",
          text: "Das NaBeG schützt Unternehmen mit nicht mehr als 1.000 Beschäftigten: Ein berichtspflichtiges Unternehmen darf von ihnen für die Nachhaltigkeitsberichterstattung keine Informationen verlangen, die über den freiwilligen VSME-Standard hinausgehen (§ 243ba UGB). Fragt es trotzdem mehr an, muss es darauf hinweisen, dass Sie die Auskunft verweigern dürfen; widersprechende Vertragsklauseln sind nicht bindend. Für andere Zwecke – etwa Sorgfaltspflichten in der Lieferkette – gilt die Grenze laut WKO nicht.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "VSME: Energie und Emissionen sind Kernangaben",
          text: "Der VSME-Standard für KMU (Empfehlung (EU) 2025/1710) enthält im Basismodul Angaben zu Energieverbrauch und Treibhausgasemissionen. Die Wirtschaftskammern bieten Mitgliedern branchenspezifische VSME-Berichtsvorlagen mit Ausfüllanleitung an (Stand VSME 13.5.2026). Eine PV-Anlage liefert dafür genau die Zahlen, die gefragt sind: erzeugte, selbst genutzte und eingespeiste Kilowattstunden.",
        },
      ],
    },
    {
      id: "scope2",
      titel: "Scope 1, 2, 3: Wo eine eigene PV-Anlage in der Klimabilanz wirkt",
      tocLabel: "Scope 2 verstehen",
      bloecke: [
        {
          typ: "p",
          text: "**Eine eigene PV-Anlage senkt vor allem die Scope-2-Emissionen, also die indirekten Emissionen aus eingekauftem Strom: Jede selbst erzeugte und selbst verbrauchte Kilowattstunde ersetzt eine Kilowattstunde aus dem Netz.** Der Betrieb der Anlage selbst verursacht keine direkten Emissionen (Scope 1). Die Herstellung von Modulen und Wechselrichtern fällt in die vorgelagerte Lieferkette (Scope 3).",
        },
        {
          typ: "tabelle",
          caption: "Emissionskategorien nach GHG Protocol und die Rolle der Photovoltaik",
          kopf: ["Kategorie", "Was dazugehört", "Wirkung der eigenen PV-Anlage"],
          zeilen: [
            ["Scope 1", "Direkte Emissionen: Heizung mit Gas/Öl, Fuhrpark mit Verbrennern, Prozesse", "indirekt – erst über Elektrifizierung (Wärmepumpe, E-Flotte) mit Solarstrom"],
            ["Scope 2", "Eingekaufter Strom, Wärme, Kälte", "direkt – selbst verbrauchter Solarstrom ersetzt Netzbezug"],
            ["Scope 3", "Lieferkette, Produkte, Transporte, Anlagenherstellung", "Herstellungsemissionen der Anlage; bei Ihren Kunden sinkt deren Scope 3"],
          ],
          minBreite: 640,
          fussnote: "Vereinfachte Darstellung nach GHG Protocol Corporate Standard und Scope 2 Guidance.",
        },
        {
          typ: "h3",
          text: "Standortbasiert oder marktbasiert: der entscheidende Unterschied",
        },
        {
          typ: "p",
          text: "Das GHG Protocol verlangt für Scope 2 zwei Werte. Der **standortbasierte** Wert rechnet mit dem durchschnittlichen Emissionsfaktor des Stromnetzes; jede eingesparte Kilowattstunde Netzbezug senkt ihn. Der **marktbasierte** Wert rechnet mit dem Strommix Ihres Liefervertrags laut Stromkennzeichnung – also mit den Herkunftsnachweisen, die Ihr Lieferant vorlegt. Die E-Control überwacht die Stromkennzeichnung in Österreich und betreibt die Herkunftsnachweisdatenbank.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Ehrlich rechnen: Ökostromvertrag und eigene PV",
          text: "Beziehen Sie bereits Strom mit 100 % erneuerbarer Kennzeichnung, ist Ihr marktbasierter Scope-2-Wert für diesen Strom bereits nahe null – eigene PV senkt ihn dann kaum weiter. Der Nutzen liegt in diesem Fall im standortbasierten Wert, in niedrigeren Energiekosten und in der zusätzlichen Erzeugung („Additionalität“), die Sie glaubwürdig kommunizieren können. Ein Liefervertrag mit fossilem Anteil oder ohne Nachweise macht den Effekt eigener PV dagegen auch marktbasiert sichtbar.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Rechenbeispiel: So viel CO₂ spart eine 250-kWp-Anlage im Scope 2",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Betrieb mit 400.000 kWh Jahresverbrauch und einer 250-kWp-Anlage ersetzt bei 70 % Eigenverbrauch rund 175.000 kWh Netzstrom pro Jahr – je nach Emissionsfaktor sind das 26 bis 44 Tonnen CO₂ weniger im standortbasierten Scope 2.** Die Formel ist einfach: selbst verbrauchter Solarstrom in kWh × Emissionsfaktor des ersetzten Stroms.",
        },
        {
          typ: "tabelle",
          caption: "Scope-2-Wirkung einer 250-kWp-Anlage bei unterschiedlichen Emissionsfaktoren (Rechenannahmen)",
          kopf: ["Größe", "Wert", "Anmerkung"],
          zeilen: [
            ["Jahresertrag", "250.000 kWh", "1.000 kWh/kWp (Österreich-Mittel lt. BMWET-Marktstatistik)"],
            ["Eigenverbrauch 70 %", "175.000 kWh", "ersetzt Netzbezug"],
            ["Einspeisung 30 %", "75.000 kWh", "wird im eigenen Scope 2 nicht angerechnet"],
            ["Emissionsfaktor 150 g/kWh (Annahme)", "≈ 26 t CO₂ pro Jahr", "niedriger Netzmix-Faktor"],
            ["Emissionsfaktor 250 g/kWh (Annahme)", "≈ 44 t CO₂ pro Jahr", "höherer Netzmix- bzw. Graustrom-Faktor"],
            ["Anteil am Jahresverbrauch", "≈ 44 %", "175.000 von 400.000 kWh aus eigener Erzeugung"],
          ],
          hervorheben: 1,
          minBreite: 640,
          fussnote: "Die Emissionsfaktoren sind Rechenannahmen zur Veranschaulichung, keine amtlichen Werte. Für Ihren Bericht verwenden Sie standortbasiert einen anerkannten Netzfaktor für Österreich des Berichtsjahres und marktbasiert den Wert aus der Stromkennzeichnung Ihres Lieferanten. Herstellungsemissionen der Anlage (Scope 3) nicht berücksichtigt.",
        },
        {
          typ: "p",
          text: "Wirtschaftlich rechnet sich eine solche Anlage unabhängig von der Klimabilanz: Wie hoch Ersparnis, Amortisation und Rendite ausfallen, zeigen die Ratgeber [Photovoltaik für Unternehmen](/ratgeber/photovoltaik-gewerbe) und [Amortisation berechnen](/ratgeber/photovoltaik-amortisation). Wer zusätzlich Wärme oder Fuhrpark elektrifiziert, senkt auch Scope 1 – etwa mit einer Wärmepumpe oder einer [E-Flotte, die mit Solarstrom lädt](/ratgeber/e-flotte-laden-photovoltaik).",
        },
      ],
    },
    {
      id: "taxonomie",
      titel: "EU-Taxonomie, Banken und Förderung: Wo PV-Investitionen zählen",
      tocLabel: "Taxonomie & Banken",
      bloecke: [
        {
          typ: "p",
          text: "**Für berichtspflichtige Unternehmen ist eine PV-Investition typischerweise eine taxonomiefähige Klimaschutz-Investition – sie kann den ausgewiesenen Anteil „grüner“ Investitionsausgaben (CapEx) erhöhen.** Die Taxonomie-Verordnung (EU) 2020/852 enthält die Stromerzeugung mit Photovoltaik sowie die Installation von Technologien für erneuerbare Energien als Wirtschaftstätigkeiten. Ob die technischen Kriterien und die „Do no significant harm“-Anforderungen im Einzelfall erfüllt sind, prüft Ihre Berichterstattung.",
        },
        {
          typ: "liste",
          punkte: [
            "**Banken:** Kreditinstitute fragen ESG-Daten ab und bieten teils eigene Konditionen für Energieeffizienz- und Erneuerbaren-Investitionen. Bringen Sie Ertragsprognose, Eigenverbrauchsanteil und erwartete CO₂-Wirkung ins Finanzierungsgespräch mit – siehe [Finanzierung](/service/finanzierung).",
            "**Steuer:** PV-Anlagen gelten für den Investitionsfreibetrag als ökologische Wirtschaftsgüter – 2026 mit 22 % statt 10 %. Details im Ratgeber [Investitionsfreibetrag für Photovoltaik](/ratgeber/investitionsfreibetrag-photovoltaik).",
            "**Förderung:** Der EAG-Investitionszuschuss bringt 2026 bis zu 130 €/kWp (Kategorie C) bzw. 120 €/kWp (Kategorie D), mit Made-in-Europe-Zuschlag mehr – siehe [EAG-Investitionszuschuss 2026](/ratgeber/eag-investitionszuschuss).",
          ],
        },
      ],
    },
    {
      id: "daten",
      titel: "Daten, die eine Prüfung standhalten: Monitoring statt Schätzung",
      tocLabel: "Datenqualität",
      bloecke: [
        {
          typ: "p",
          text: "**Belastbar sind Nachhaltigkeitsangaben zur Photovoltaik nur, wenn Erzeugung, Eigenverbrauch und Einspeisung gemessen und lückenlos gespeichert werden – idealerweise in Viertelstundenwerten.** Berichte nach CSRD müssen extern geprüft werden; auch Kunden und Banken fragen zunehmend nach der Herkunft der Zahlen.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Erzeugungszähler bzw. Wechselrichterdaten mit Zeitstempel, zusätzlich Bezug und Einspeisung am Netzübergabepunkt (Smart-Meter-Viertelstundenwerte).",
            "Eigenverbrauch = Erzeugung − Einspeisung, getrennt nach Standorten, wenn mehrere Anlagen betrieben werden.",
            "Datenablage für mindestens die Berichtsperiode plus Prüfzeitraum, mit dokumentierten Ausfällen und Korrekturen.",
            "Klare Zuordnung, wenn Strom in eine Energiegemeinschaft geht oder an Mieter geliefert wird – dieser Anteil ist nicht Ihr Eigenverbrauch.",
            "Emissionsfaktoren mit Quelle und Jahr dokumentieren; standort- und marktbasierten Wert getrennt ausweisen.",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt betreibt eigene [Fernwartungs-](/technik/fernwartung) und [SCADA-Systeme](/technik/scada), die Erzeugungs- und Anlagendaten laufend erfassen. Daraus lassen sich Kennzahlen für VSME-Angaben, Kundenanfragen und Energieaudits ableiten. Wer seine Anlage zusätzlich in der Außenkommunikation zeigen möchte, findet Unterstützung beim [Nachhaltigkeitsmarketing](/service/nachhaltigkeitsmarketing).",
        },
      ],
    },
    {
      id: "kommunikation",
      titel: "Kommunikation ohne Greenwashing",
      tocLabel: "Kommunikation",
      bloecke: [
        {
          typ: "p",
          text: "**Kommunizieren Sie konkrete, überprüfbare Fakten – „Wir decken rund 44 % unseres Strombedarfs mit eigener Photovoltaik“ – statt pauschaler Aussagen wie „klimaneutral“ oder „grüner Betrieb“.** Die EU hat mit der Richtlinie (EU) 2024/825 die Regeln für Umweltaussagen gegenüber Verbrauchern verschärft; allgemeine Umweltaussagen ohne Nachweis und Aussagen, die auf Kompensation beruhen, sind heikel.",
        },
        {
          typ: "tabelle",
          caption: "Aussagen zur eigenen PV-Anlage: belastbar oder riskant",
          kopf: ["Belastbar (mit Daten belegt)", "Riskant (pauschal oder missverständlich)"],
          zeilen: [
            ["„Unsere 250-kWp-Anlage hat 2026 rund 250.000 kWh erzeugt.“", "„Wir produzieren klimaneutral.“"],
            ["„Rund 44 % unseres Stroms stammen aus eigener Photovoltaik.“", "„100 % Ökostrom“, wenn nur ein Teil selbst erzeugt ist"],
            ["„Standortbasiert sinken unsere Scope-2-Emissionen um rund X t CO₂.“", "„CO₂-frei“ ohne Angabe von Scope und Methode"],
            ["„Überschüsse speisen wir in die Energiegemeinschaft unserer Gemeinde ein.“", "Doppelzählung: Eingespeisten Strom zusätzlich als Eigenverbrauch ausweisen"],
          ],
          minBreite: 620,
          fussnote: "Orientierung, keine Rechtsberatung. Für Werbeaussagen gegenüber Verbrauchern gelten das UWG und die umgesetzten EU-Vorgaben.",
        },
        {
          typ: "p",
          text: "Wenn Überschüsse in eine [Energiegemeinschaft](/ratgeber/energiegemeinschaft-gewerbe) fließen, ist das eine gute Geschichte für Region und Belegschaft – achten Sie aber darauf, dass der geteilte Strom nicht doppelt gezählt wird.",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Schritt für Schritt: PV in die ESG-Strategie einbauen",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Pflichten klären", "Berichtspflicht nach NaBeG/UGB prüfen; bei KMU: Welche Kunden und Banken fragen welche Daten ab?"],
            ["Ausgangslage messen", "Stromverbrauch, Lastgang, Liefervertrag und dessen Stromkennzeichnung erheben – das ist die Basis für Scope 2."],
            ["Anlage planen", "Größe nach Lastgang, Dachflächen, Netzanschluss, Speicher und Elektrifizierung von Wärme und Fuhrpark gemeinsam betrachten."],
            ["Messkonzept festlegen", "Erzeugung, Eigenverbrauch und Einspeisung messbar machen, Datenablage und Zuständigkeit klären."],
            ["Berichten und kommunizieren", "VSME- bzw. ESRS-Angaben aus Messdaten ableiten, Emissionsfaktoren dokumentieren, konkrete Aussagen veröffentlichen."],
          ],
        },
        {
          typ: "p",
          text: "Für Betriebe mit großen Dächern oder Freiflächen lohnt es sich, die ESG-Frage mit der Wirtschaftlichkeit zu verbinden: Eine Anlage, die zum [Lastgang](/ratgeber/pv-anlage-groesse-berechnen) passt, senkt Kosten und Emissionen zugleich. Mehr zu unseren Leistungen für Unternehmen finden Sie unter [Photovoltaik für Gewerbe](/gewerbe).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Muss mein Unternehmen nach der CSRD berichten?",
      a: "Nach dem Omnibus-I-Paket nur, wenn es mehr als 1.000 Beschäftigte und mehr als 450 Mio. € Umsatz hat; die erste Berichterstattung ist 2028 über das Geschäftsjahr 2027 vorgesehen. Bisher nach NaDiVeG berichtspflichtige Unternehmen von öffentlichem Interesse bleiben übergangsweise berichtspflichtig. Die Details regeln NaBeG und eine noch ausstehende UGB-Novelle.",
    },
    {
      q: "Was ist der VSME-Standard?",
      a: "Der VSME ist ein freiwilliger Nachhaltigkeitsberichtsstandard für kleine und mittlere Unternehmen (Empfehlung (EU) 2025/1710). Er begrenzt über den Value Chain Cap, welche Daten berichtspflichtige Kunden von Unternehmen bis 1.000 Beschäftigte verlangen dürfen. Die Wirtschaftskammern stellen Mitgliedern branchenspezifische Vorlagen zur Verfügung.",
    },
    {
      q: "Senkt eine eigene PV-Anlage meine Scope-2-Emissionen?",
      a: "Ja, im standortbasierten Ansatz immer, weil selbst verbrauchter Solarstrom Netzbezug ersetzt. Im marktbasierten Ansatz hängt es vom Liefervertrag ab: Ist Ihr Strom bereits zu 100 % erneuerbar gekennzeichnet, ändert eigene PV diesen Wert kaum.",
    },
    {
      q: "Zählt eingespeister Solarstrom für meine CO₂-Bilanz?",
      a: "Nein, eingespeister Strom reduziert nicht Ihren eigenen Scope 2, weil er Ihren Verbrauch nicht ersetzt. Er kann in der Kommunikation als zusätzliche erneuerbare Erzeugung erwähnt werden, darf aber nicht als Eigenverbrauch doppelt gezählt werden.",
    },
    {
      q: "Welche Daten sollte eine PV-Anlage für ESG-Berichte liefern?",
      a: "Mindestens die erzeugte, selbst verbrauchte und eingespeiste Strommenge pro Jahr, idealerweise in Viertelstundenwerten, dazu Anlagengröße, Inbetriebnahmedatum und dokumentierte Ausfälle. Monitoring- und SCADA-Systeme liefern diese Werte automatisch.",
    },
    {
      q: "Darf ich meinen Betrieb mit eigener PV „klimaneutral“ nennen?",
      a: "Davon ist abzuraten. Pauschale Aussagen wie „klimaneutral“ sind ohne umfassenden Nachweis riskant, zumal die EU die Regeln für Umweltaussagen verschärft hat. Konkrete, messbare Aussagen – etwa der Anteil eigenen Solarstroms am Verbrauch – sind glaubwürdiger.",
    },
  ],

  passend: [
    { href: "/service/nachhaltigkeitsmarketing", titel: "Nachhaltigkeitsmarketing", text: "Ihre PV-Anlage glaubwürdig und belegt kommunizieren." },
    { href: "/technik/scada", titel: "SCADA & Anlagendaten", text: "Messdaten, die Kunden und Prüfern standhalten." },
    { href: "/ratgeber/photovoltaik-gewerbe", titel: "Photovoltaik für Unternehmen", text: "Wirtschaftlichkeit, Steuern und Planung." },
    { href: "/gewerbe", titel: "Photovoltaik für Betriebe", text: "Von der Lastganganalyse bis zur Inbetriebnahme." },
  ],

  quellen: [
    { titel: "WKO – CSRD und ESG-Berichte: Was Unternehmen wissen müssen (Omnibus I, NaBeG, Value Chain Cap)", url: "https://www.wko.at/nachhaltigkeit/csrd-faq-informationspflicht-nachhaltigkeitsaspekte", stand: "09/2026" },
    { titel: "WKO – Omnibus-Paket: Vereinfachung der Berichts- und Sorgfaltspflichten", url: "https://www.wko.at/nachhaltigkeit/omnibus-paket-berichts-sorgfaltspflichten-nachhaltigkeit", stand: "09/2026" },
    { titel: "WKO – VSME-Berichtsvorlage für Gewerbe, Industrie und Bau", url: "https://www.wko.at/nachhaltigkeit/vsme-berichtsvorlage-gewerbe-industrie-bau", stand: "09/2026" },
    { titel: "GHG Protocol – Scope 2 Guidance (standort- und marktbasierte Methode)", url: "https://ghgprotocol.org/scope-2-guidance", stand: "09/2026" },
    { titel: "E-Control – Stromkennzeichnung und Herkunftsnachweise", url: "https://www.e-control.at/industrie/oeko-energie/stromkennzeichnung", stand: "09/2026" },
    { titel: "BMWET/Technikum Wien – Marktentwicklung Photovoltaik 2024 (1.000 Volllaststunden)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "09/2026" },
    { titel: "WKO – Investitionsfreibetrag (Öko-IFB 22 % für 2026)", url: "https://www.wko.at/steuern/investitionsfreibetrag", stand: "09/2026" },
  ],

  seitenCta: { titel: "Klimadaten, die halten?", text: "PV-Anlage mit Messkonzept für Bericht und Kunden planen.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Weniger Scope 2, niedrigere Stromkosten – belegt mit Messdaten.",
    text: "Wir planen Ihre Anlage nach Lastgang, liefern über Fernwartung und SCADA die Daten für VSME, Kunden und Banken und unterstützen bei der Kommunikation. Ökovolt aus Ostermiething, seit 2012 in ganz Österreich.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Nachhaltigkeitsmarketing", href: "/service/nachhaltigkeitsmarketing" },
  },
};

export default artikel;
