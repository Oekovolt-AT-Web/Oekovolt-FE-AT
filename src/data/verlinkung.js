// src/data/verlinkung.js
//
// Kuratierte Querverweise je Seite.
//
// Hintergrund: Eine Crawl-Analyse ergab, dass 16 von 16 geprueften Seiten
// NULL redaktionelle Eingangslinks hatten – erreichbar war jede Seite nur
// ueber das Menue. Damit ist die Site ein Navigationsbaum, kein Linknetz:
// keine Seite gibt einer anderen Relevanz weiter, und fuer Google sind es
// 90 isolierte Einzelseiten.
//
// Viele Inhalte kamen frueher aus dem Backoffice, deshalb lassen sich Links nicht in
// den Fliesstext setzen. Diese Liste ist die Alternative: pro Seite zwei bis
// drei THEMATISCH passende Ziele mit sprechendem Ankertext.
//
// Regeln beim Ergaenzen:
//   - Ankertext beschreibt das Ziel, nie "hier" oder "mehr erfahren".
//   - Nur verlinken, was inhaltlich wirklich zusammenhaengt.
//   - Nicht auf die eigene Seite verlinken.

export const QUERVERWEISE = {
  "/gewerbe": [
    { href: "/gewerbespeicher", titel: "Gewerbespeicher & Peak Shaving", text: "Leistungspreis nach österreichischer Mechanik: Mittel der zwölf Monatsspitzen." },
    { href: "/ratgeber/investitionsfreibetrag-photovoltaik", titel: "Investitionsfreibetrag für PV", text: "22 % Öko-IFB für Anschaffungen bis 31.12.2026." },
    { href: "/service/direktvermarktung", titel: "Reststromvermarktung", text: "Überschuss über OeMAG, Stromhändler oder PPA verkaufen." },
    { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "TOR Erzeuger & Netzanschluss", text: "Netzebenen 7 bis 5, Typ A/B und Nachweise." },
  ],
  "/landwirtschaft": [
    { href: "/agri-pv", titel: "Agri-PV in Österreich", text: "Vertikal oder hoch aufgeständert – mit 30 % Förderzuschlag." },
    { href: "/ratgeber/photovoltaik-steuern", titel: "Photovoltaik und Steuern", text: "Nebenbetrieb, Pauschalierung, 12.500-kWh-Befreiung." },
    { href: "/service/notstrom", titel: "Notstrom für den Hof", text: "Melken, Kühlen und Lüften auch bei Stromausfall." },
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaft", text: "Hofüberschuss an Nachbarn und Gemeinde weitergeben." },
  ],
  "/kommunen": [
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaft der Gemeinde", text: "EEG, BEG, GEA – und die 10-%-Regel für Gemeinden." },
    { href: "/ratgeber/photovoltaik-gemeinde", titel: "Photovoltaik für Gemeinden", text: "Vergabe nach BVergG 2026 und Bürgerbeteiligung." },
    { href: "/freiflaechen-photovoltaik", titel: "Solarparks auf Gemeindegrund", text: "Widmung, Netzanschluss und Pacht." },
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur", text: "Fuhrpark, Bauhof und Ladepunkte für die Bevölkerung." },
  ],
  "/freiflaechen-photovoltaik": [
    { href: "/ratgeber/freiflaechen-photovoltaik-widmung", titel: "Widmung je Bundesland", text: "Zonen, Sonderwidmung und Beschleunigungsgebiete." },
    { href: "/ratgeber/ppa-oesterreich", titel: "PPA in Österreich", text: "Stromliefervertrag statt Marktprämie." },
    { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "Blindleistung und Einspeiselimit am Netzverknüpfungspunkt." },
    { href: "/agri-pv", titel: "Agri-PV statt Freifläche", text: "30 % Zuschlag statt 25 % Abschlag auf Agrarflächen." },
  ],
  "/agri-pv": [
    { href: "/ratgeber/agri-pv-oesterreich", titel: "Ratgeber Agri-PV", text: "Konzepte, Förderkriterien und Kulturen im Detail." },
    { href: "/landwirtschaft", titel: "PV für die Landwirtschaft", text: "Stall, Scheune, Speicher und Pauschalierung." },
    { href: "/ratgeber/hagel-photovoltaik", titel: "Hagel und Photovoltaik", text: "Hagelwiderstand, Netze und Versicherung." },
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächen-Photovoltaik", text: "Wenn Stromerzeugung im Vordergrund steht." },
  ],
  "/hotellerie-tourismus": [
    { href: "/ratgeber/photovoltaik-hotel", titel: "Ratgeber PV für Hotels", text: "Lastprofile, Saison und Wirtschaftlichkeit." },
    { href: "/ratgeber/schneelast-photovoltaik", titel: "Schneelast & Photovoltaik", text: "ÖNORM B 1991-1-3, Schneelastkarte und Modulprüflasten." },
    { href: "/service/nachhaltigkeitsmarketing", titel: "Nachhaltigkeitsmarketing", text: "Video und Imagespot zur Anlage mit Solensa." },
    { href: "/chalets", titel: "Luxus-Chalets & Alpin", text: "Indach, Schneelast und Concierge-Wartung." },
  ],
  "/gewerbespeicher": [
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving & Leistungspreis", text: "Wie Monatsspitzen den Netzpreis bestimmen." },
    { href: "/ratgeber/gewerbespeicher-kosten", titel: "Gewerbespeicher-Kosten", text: "Preise, Größen und Förderung." },
    { href: "/service/notstrom", titel: "Notstrom & Blackout-Vorsorge", text: "Ersatzstrom für kritische Verbraucher." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Erste Orientierung zur Speichergröße." },
  ],
  "/ladeinfrastruktur": [
    { href: "/ratgeber/e-flotte-laden-photovoltaik", titel: "E-Flotte mit PV laden", text: "Lastmanagement, Sachbezug und Überschussladen." },
    { href: "/ratgeber/solarcarport", titel: "Solarcarport", text: "Parkplatz als Kraftwerk – mit 30 % EAG-Zuschlag." },
    { href: "/gewerbespeicher", titel: "Speicher als Ladepuffer", text: "DC-Laden ohne teure Anschlusserhöhung." },
    { href: "/produkte/wallbox", titel: "Wallbox", text: "Laden zu Hause für Dienstwagen." },
  ],
  "/energiegemeinschaften": [
    { href: "/ratgeber/energiegemeinschaft-gruenden", titel: "Energiegemeinschaft gründen", text: "Rechtsform, Nahbereich und Registrierung." },
    { href: "/ratgeber/energiegemeinschaft-gewerbe", titel: "Energiegemeinschaften für Gewerbe", text: "Unternehmen als Erzeuger und Abnehmer." },
    { href: "/ratgeber/elwg-elektrizitaetswirtschaftsgesetz", titel: "ElWG im Überblick", text: "Was sich für Betreiber ändert." },
    { href: "/kommunen", titel: "Gemeinden & Stadtwerke", text: "Die Gemeinde als Initiatorin." },
  ],
  "/technik": [
    { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "Regelung am Netzanschlusspunkt nach TOR Erzeuger." },
    { href: "/technik/scada", titel: "SCADA & Leitwarte", text: "Portfolio-Monitoring, PR und Verfügbarkeit nach IEC 61724." },
    { href: "/technik/fernwartung", titel: "Fernwartung & IT-Security", text: "Sichere Zugriffe nach NISG 2026 und IEC 62443." },
  ],
  "/technik/parkregler": [
    { href: "/technik/scada", titel: "SCADA & Leitwarte", text: "Sollwerte und Ereignisse im Monitoring." },
    { href: "/service/direktvermarktung", titel: "Reststromvermarktung", text: "Abregelung bei negativen Preisen." },
    { href: "/ratgeber/eza-regler-parkregler", titel: "EZA-Regler erklärt", text: "Regelfunktionen, Nachweise, Inbetriebnahme." },
  ],
  "/technik/fernwartung": [
    { href: "/service/wartung", titel: "Wartungsvertrag", text: "Service-Level mit Fernwartung als Basis." },
    { href: "/technik/scada", titel: "SCADA & Leitwarte", text: "Vom Alarm zur Behebung." },
    { href: "/service/drohneninspektion", titel: "Drohnen-Thermografie", text: "Fehler aus der Luft lokalisieren." },
  ],
  "/technik/scada": [
    { href: "/technik/parkregler", titel: "Parkregler", text: "Regelung am Netzanschlusspunkt." },
    { href: "/energie-live", titel: "Strommarkt Österreich live", text: "Day-Ahead-Preis Gebotszone AT." },
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächenanlagen", text: "Solarparks planen, bauen, betreiben." },
  ],
  "/service/direktvermarktung": [
    { href: "/energie-live", titel: "Strompreis Österreich live", text: "Spotpreis AT und negative Preise." },
    { href: "/ratgeber/ppa-oesterreich", titel: "PPA in Österreich", text: "On-site, Off-site, Laufzeiten." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Überschüsse speichern statt verschenken." },
  ],
  "/service/stromtarif": [
    { href: "/energie-live", titel: "Börsenstrompreis Österreich live", text: "Die Preise, nach denen dynamische Tarife abrechnen." },
    { href: "/rechner/dynamischer-stromtarif", titel: "Tarif-Rechner", text: "Ob sich ein dynamischer Tarif lohnt." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Günstig laden, Abendspitzen decken." },
  ],
  "/energie-live": [
    { href: "/service/stromtarif", titel: "Dynamischer Stromtarif Österreich", text: "§ 22 ElWG und Lastverschiebung." },
    { href: "/service/direktvermarktung", titel: "Reststromvermarktung", text: "Was negative Preise für Ihren Überschuss bedeuten." },
    { href: "/ratgeber/negative-strompreise", titel: "Negative Strompreise", text: "Ursachen und Folgen für Betreiber." },
  ],
  "/service/wartung": [
    { href: "/service/e-check", titel: "E-Check & Anlagenprüfung", text: "Wiederkehrende Prüfung nach OVE E 8101 mit Prüfbefund." },
    { href: "/technik/fernwartung", titel: "Fernwartung", text: "Laufende Überwachung und Alarmierung." },
    { href: "/ratgeber/photovoltaik-wartungsvertrag", titel: "Wartungsvertrag erklärt", text: "Leistungsumfang, SLA und Kostenfaktoren." },
  ],
  "/service/e-check": [
    { href: "/service/wartung", titel: "Wartungsvertrag", text: "Prüfung, Monitoring und Störungsbehebung im Paket." },
    { href: "/ratgeber/e-check-photovoltaik", titel: "E-Check Photovoltaik", text: "Fristen, Anlagenbuch und Prüfumfang ausführlich." },
    { href: "/ratgeber/photovoltaik-brandschutz", titel: "Brandschutz bei PV", text: "OVE R 11-1 und Feuerwehr." },
  ],
  "/service/reinigung": [
    { href: "/service/wartung", titel: "Reinigung mit Wartung kombinieren", text: "Anfahrt und Absturzsicherung nur einmal." },
    { href: "/ratgeber/photovoltaik-reinigung-wartung", titel: "Reinigung & Wartung", text: "Was wirklich nötig ist." },
    { href: "/landwirtschaft", titel: "PV in der Landwirtschaft", text: "Stall, Scheune, Maschinenhalle." },
  ],
  "/service/drohneninspektion": [
    { href: "/service/e-check", titel: "Elektrische Prüfung", text: "Thermografie ergänzt den Prüfbefund." },
    { href: "/ratgeber/pv-thermografie-drohne", titel: "PV-Thermografie mit Drohne", text: "Normen, Fehlerbilder, Kosten." },
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächenanlagen", text: "Solarparks planen und betreiben." },
  ],
  "/service/versicherung": [
    { href: "/ratgeber/photovoltaik-versicherung", titel: "Photovoltaik-Versicherung", text: "Deckungen und Ausschlüsse in Österreich." },
    { href: "/ratgeber/hagel-photovoltaik", titel: "Hagel & Photovoltaik", text: "Hagelwiderstandsklassen und Hagelregister." },
    { href: "/standort-check", titel: "Standort-Check mit eHORA", text: "Schnee-, Wind- und Hagelrisiko Ihrer Adresse." },
  ],
  "/service/energieberatung": [
    { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Anlagenplanung nach Lastgang." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving & Leistungspreis", text: "Lastspitzen gezielt kappen." },
    { href: "/ratgeber/csrd-esg-photovoltaik", titel: "CSRD, ESG & PV", text: "Scope 2 und Nachhaltigkeitsbericht." },
  ],
  "/service/notstrom": [
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Peak Shaving, Eigenverbrauch und Ersatzstrom." },
    { href: "/ratgeber/blackout-vorsorge-unternehmen", titel: "Blackout-Vorsorge für Unternehmen", text: "Krisenplan, Notstrom, Zivilschutz." },
    { href: "/kommunen", titel: "Gemeinden & Länder", text: "Wasserversorgung und Krisenstab absichern." },
  ],
  "/service/nachhaltigkeitsmarketing": [
    { href: "/pv-award", titel: "Ökovolt PV Award", text: "Die besten Anlagen des Jahres." },
    { href: "/ratgeber/csrd-esg-photovoltaik", titel: "CSRD, ESG & Photovoltaik", text: "Kennzahlen für den Nachhaltigkeitsbericht." },
    { href: "/hotellerie-tourismus", titel: "Hotellerie & Tourismus", text: "Nachhaltigkeit, die Gäste sehen." },
  ],
  "/service/finanzierung": [
    { href: "/ratgeber/photovoltaik-leasing", titel: "Photovoltaik-Leasing", text: "Bilanz, Steuer und Vertragsformen." },
    { href: "/ratgeber/investitionsfreibetrag-photovoltaik", titel: "Investitionsfreibetrag für PV", text: "Öko-IFB, Höchstbetrag, Behaltefrist." },
    { href: "/forderungen/bundesfoerderung", titel: "Bundesförderung (EAG & KPC)", text: "Zuschüsse senken den Finanzierungsbedarf." },
  ],
  "/service/repowering": [
    { href: "/ratgeber/photovoltaik-nach-20-jahren", titel: "PV nach Tarifende", text: "Weiterbetrieb, Marktpreis, Repowering." },
    { href: "/ratgeber/eag-investitionszuschuss", titel: "EAG-Investitionszuschuss", text: "Auch für Erweiterungen bestehender Anlagen." },
    { href: "/gewerbespeicher", titel: "Speicher nachrüsten", text: "Überschuss verschieben, Spitzen kappen." },
  ],
  "/service/vorteilswelt": [
    { href: "/pv-award", titel: "Ökovolt PV Award", text: "Die besten Anlagen und Nachhaltigkeitsinvestitionen." },
    { href: "/partner", titel: "Elektro-Partner werden", text: "Als Subunternehmer mitarbeiten." },
    { href: "/angebot", titel: "Selbst Angebot anfragen", text: "Fundierte Ersteinschätzung für Ihr Projekt." },
  ],
  "/dienstleistungen/photovoltaik": [
    { href: "/ratgeber/solaranlage-kosten", titel: "Photovoltaik Kosten 2026", text: "Preise je kWp von 5 kWp bis zum Solarpark." },
    { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "Netzanschluss nach TOR Erzeuger", text: "Netzebenen, Anlagentypen und Nachweise." },
    { href: "/referenzen/projekte", titel: "Referenzen in Österreich", text: "Anlagen für Industrie, Handel, Holz und Tourismus." },
    { href: "/service/wartung", titel: "Wartungsvertrag", text: "Betrieb und Prüfung über die ganze Lebensdauer." },
  ],
  "/dienstleistungen/smarthome": [
    { href: "/produkte/smartenergyhome", titel: "Smart Energy Home", text: "Erzeugung, Speicher und Verbrauch in einem System." },
    { href: "/rechner/dynamischer-stromtarif", titel: "Dynamischer Stromtarif", text: "Lohnt sich Laden in günstigen Stunden?" },
    { href: "/chalets", titel: "Premium-Objekte & Chalets", text: "Energiemanagement für Wellness, Pool und E-Fahrzeuge." },
  ],
  "/produkte/photovoltaikanlage": [
    { href: "/standort-check", titel: "Standort-Check mit eHORA", text: "Schneelast, Wind, Hagel und Ertrag Ihrer Adresse." },
    { href: "/ratgeber/solarmodule-vergleich", titel: "Solarmodule im Vergleich", text: "Glas-Glas, bifazial, TOPCon – was wofür passt." },
    { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Auslegung nach Lastgang statt nach Dachfläche." },
    { href: "/forderungen/bundesfoerderung", titel: "EAG-Investitionszuschuss", text: "Fördersätze und Fördercalls 2026." },
  ],
  "/produkte/stromspeicher": [
    { href: "/gewerbespeicher", titel: "Gewerbespeicher & Peak Shaving", text: "Leistungspreis senken, Eigenverbrauch erhöhen." },
    { href: "/ratgeber/stromspeicher-kosten", titel: "Stromspeicher Kosten 2026", text: "Preise pro kWh in Österreich." },
    { href: "/service/notstrom", titel: "Notstrom & Blackout-Vorsorge", text: "Ersatzstrom aus dem Speicher." },
  ],
  "/produkte/warmepumpe": [
    { href: "/ratgeber/waermepumpe-mit-photovoltaik", titel: "Wärmepumpe mit PV", text: "Wie viel Heizstrom die Sonne liefert." },
    { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Heizkosten mit und ohne eigenen Solarstrom vergleichen." },
    { href: "/hotellerie-tourismus", titel: "Hotellerie & Tourismus", text: "Wärme für Wellness, Küche und Zimmer." },
  ],
  "/produkte/wallbox": [
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur für Betriebe", text: "Flotte, Kundenparkplatz, Lastmanagement." },
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox Installation", text: "Kosten, Netzbetreiber-Meldung und Ablauf in Österreich." },
    { href: "/rechner/wallbox", titel: "E-Auto-Laderechner", text: "Was Solarladen gegenüber Tanken spart." },
  ],
  "/produkte/smartmeter": [
    { href: "/ratgeber/smart-meter-pflicht", titel: "Smart Meter in Österreich", text: "Rollout, Opt-out und Viertelstundenwerte." },
    { href: "/energie-live", titel: "Strompreis live", text: "Day-Ahead-Preis der Gebotszone AT." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Messen, steuern, optimieren." },
  ],
  "/produkte/smartenergyhome": [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Die Komponente, die den Eigenverbrauch am stärksten hebt." },
    { href: "/produkte/smartmeter", titel: "Smart Meter & EMS", text: "Die Messtechnik hinter Tarif und Steuerung." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Autarkie und Amortisation durchrechnen." },
  ],
  "/produkte/mieterstrom": [
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "EEG, BEG und GEA im Vergleich." },
    { href: "/ratgeber/gemeinschaftliche-erzeugungsanlage", titel: "Gemeinschaftliche Erzeugungsanlage", text: "Solarstrom im Mehrparteienhaus und Gewerbepark teilen." },
    { href: "/produkte/smartmeter", titel: "Smart Meter", text: "Viertelstundenwerte als Grundlage der Aufteilung." },
  ],
  "/produkte/stromspeicher/[slug]": [
    { href: "/produkte/hersteller", titel: "Hersteller im Überblick", text: "Alle Marken, die wir verbauen." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Die passende Kapazität für Ihren Verbrauch." },
  ],
  "/produkte/warmepumpe/[slug]": [
    { href: "/produkte/hersteller", titel: "Hersteller im Überblick", text: "Alle Marken, die wir verbauen." },
    { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Heizkosten mit und ohne Solarstrom vergleichen." },
  ],
  "/produkte/hersteller": [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Welcher Speicher zu welcher Anlagengröße passt." },
    { href: "/technik/parkregler", titel: "Eigener Parkregler", text: "Herstellerübergreifende Regelung am Netzanschlusspunkt." },
  ],

  "/referenzen/projekte": [
    { href: "/referenzen/referenzkarte", titel: "Referenzkarte", text: "Unsere Anlagen in Österreich auf der Karte." },
    { href: "/pv-award", titel: "Ökovolt PV Award", text: "Die besten Anlagen unserer Kunden." },
    { href: "/service/vorteilswelt", titel: "Ökovolt weiterempfehlen", text: "Prämie laut Teilnahmebedingungen." },
  ],
  "/referenzen/referenzkarte": [
    { href: "/angebot", titel: "Projekt in Ihrer Nähe anfragen", text: "Ersteinschätzung vom Fachbetrieb aus Ostermiething." },
    { href: "/referenzen/projekte", titel: "Projekte im Detail", text: "Einzelne Anlagen mit Bildern und Eckdaten." },
    { href: "/photovoltaik", titel: "Einzugsgebiet Österreich", text: "37 Standorte mit Ertrag und Netzbetreiber." },
  ],

  "/forderungen/landesforderungen": [
    { href: "/forderungen/bundesfoerderung", titel: "Bundesförderung (EAG & KPC)", text: "Der Zuschuss, der zu jeder Landesförderung dazukommt." },
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile", text: "Investitionsfreibetrag und Elektrizitätsabgabe." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "In 30 Sekunden passende Programme finden." },
  ],
  "/forderungen/bundesfoerderung": [
    { href: "/ratgeber/eag-investitionszuschuss", titel: "EAG-Investitionszuschuss erklärt", text: "Kategorien, Sätze, Ablauf und typische Fehler." },
    { href: "/forderungen/landesforderungen", titel: "Landesförderungen", text: "Alle neun Bundesländer im Detail." },
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "Netzentgelte senken, Strom gemeinsam nutzen." },
    { href: "/service/finanzierung", titel: "Finanzierung & Leasing", text: "Den Eigenanteil clever finanzieren." },
  ],
  "/forderungen/steuerlich": [
    { href: "/ratgeber/investitionsfreibetrag-photovoltaik", titel: "Investitionsfreibetrag für PV", text: "22 % Öko-IFB bis Ende 2026." },
    { href: "/ratgeber/photovoltaik-steuern", titel: "Photovoltaik & Steuern", text: "Unternehmen, Land- und Forstwirtschaft, Privat." },
    { href: "/forderungen/bundesfoerderung", titel: "Bundesförderung", text: "Zuschüsse zusätzlich zu den Steuervorteilen." },
  ],
  "/forderungen/baurecht": [
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "Photovoltaik-Genehmigung", text: "Anzeige oder Bewilligung – je Bundesland." },
    { href: "/forderungen/richtlinien", titel: "Richtlinien & Netzanschluss", text: "Die technischen Vorgaben neben dem Baurecht." },
    { href: "/ratgeber/freiflaechen-photovoltaik-widmung", titel: "Widmung für Freiflächen", text: "Zonen und Sonderwidmung je Bundesland." },
  ],
  "/forderungen/richtlinien": [
    { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "TOR-konforme Regelung am Netzanschlusspunkt." },
    { href: "/ratgeber/photovoltaik-brandschutz", titel: "Brandschutz nach OVE R 11-1", text: "Feuerwehr, Abschaltung, Versicherung." },
    { href: "/forderungen/baurecht", titel: "Baurecht", text: "Wann eine PV-Anlage bewilligungspflichtig ist." },
  ],

  "/faqs": [
    { href: "/ratgeber", titel: "Ratgeber", text: "Ausführliche Fachartikel für Österreich." },
    { href: "/wissen/lexikon", titel: "Photovoltaik-Lexikon", text: "142 Fachbegriffe von AfA bis Zählpunkt." },
    { href: "/standort-check", titel: "Standort-Check", text: "Schneelast, Wind, Hagel und Ertrag Ihrer Adresse." },
  ],
  "/uber-uns": [
    { href: "/uber-uns/team", titel: "Das Team", text: "Die Menschen hinter Ökovolt." },
    { href: "/technik", titel: "Eigene Technik", text: "Parkregler, Fernwartung und SCADA." },
    { href: "/referenzen/projekte", titel: "Referenzen", text: "Anlagen für Industrie, Handel und Tourismus." },
  ],
  "/uber-uns/team": [
    { href: "/uber-uns", titel: "Über Ökovolt", text: "Geschichte, Gesellschafter und Haltung." },
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Woran dieses Team gearbeitet hat." },
    { href: "/uber-uns/jobs", titel: "Offene Stellen", text: "Wir suchen Verstärkung in Österreich." },
  ],
  "/uber-uns/jobs": [
    { href: "/uber-uns/team", titel: "Das Team", text: "Mit wem Sie zusammenarbeiten würden." },
    { href: "/partner", titel: "Elektro-Partner werden", text: "Als Betrieb mit uns die Energiewende bauen." },
  ],
  "/pv-award": [
    { href: "/service/nachhaltigkeitsmarketing", titel: "Nachhaltigkeitsmarketing", text: "Die eigene Anlage mit Solensa sichtbar machen." },
    { href: "/referenzen/projekte", titel: "Referenzen", text: "Anlagen, die bereits laufen." },
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "Kategorie Energiegemeinschaft des Jahres." },
  ],
  "/sponsoring": [
    { href: "/kommunen", titel: "Gemeinden & Länder", text: "Photovoltaik für die öffentliche Hand." },
    { href: "/energiegemeinschaften", titel: "Energiegemeinschaften", text: "Vereine und Gemeinden als Energiegemeinschaft." },
    { href: "/uber-uns", titel: "Über Ökovolt", text: "Wer hinter dem Engagement steht." },
  ],
  "/partner": [
    { href: "/technik/parkregler", titel: "Parkregler", text: "Technik-Support für Ihre Projekte." },
    { href: "/technik/scada", titel: "SCADA & Leitwarte", text: "Monitoring für die Anlagen, die Sie bauen." },
    { href: "/uber-uns/jobs", titel: "Jobs bei Ökovolt", text: "Lieber angestellt? Offene Stellen." },
  ],
  "/chalets": [
    { href: "/standort-check", titel: "Standort-Check mit eHORA", text: "Schneelast für Ihre Adresse bestimmen." },
    { href: "/service/wartung", titel: "Concierge-Wartung", text: "Saisonservice und 24/7-Monitoring." },
    { href: "/service/notstrom", titel: "Autarkie & Blackout-Vorsorge", text: "Ersatzstrom für abgelegene Lagen." },
    { href: "/ratgeber/schneelast-photovoltaik", titel: "Schneelast & Photovoltaik", text: "ÖNORM B 1991-1-3 und Modulprüflasten." },
  ],
  "/standort-check": [
    { href: "/ratgeber/schneelast-photovoltaik", titel: "Schneelast & Photovoltaik", text: "Die Norm und ihre Rechenwege im Detail." },
    { href: "/ratgeber/hagel-photovoltaik", titel: "Hagel & Photovoltaik", text: "Hagelwiderstandsklassen und Hagelregister." },
    { href: "/chalets", titel: "Luxus-Chalets & Alpin", text: "Photovoltaik für hohe Schneelasten." },
    { href: "/service/versicherung", titel: "PV-Versicherung", text: "Naturgefahren richtig absichern." },
  ],

  "/solarrechner": [
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Die wirtschaftlich sinnvolle Speichergröße finden." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Photovoltaik Kosten 2026", text: "Woher die Preisannahmen des Rechners stammen." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Zuschüsse, die Ihre Amortisation verkürzen." },
  ],
  "/rechner": [
    { href: "/standort-check", titel: "Standort-Check", text: "Schneelast, Wind, Hagel und Ertrag Ihrer Adresse." },
    { href: "/angebot", titel: "Angebots-Konfigurator", text: "Aus den Rechenwerten eine persönliche Einschätzung machen." },
    { href: "/wissen/lexikon", titel: "Photovoltaik-Lexikon", text: "Alle Fachbegriffe der Rechner kurz erklärt." },
  ],
  "/rechner/stromspeicher": [
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Peak Shaving und Ersatzstrom für Betriebe." },
    { href: "/solarrechner", titel: "Solarrechner", text: "Die ganze Anlage inklusive Ertrag durchrechnen." },
    { href: "/ratgeber/stromspeicher-groesse", titel: "Speichergröße richtig wählen", text: "Faustregeln und Beispiele." },
  ],
  "/rechner/waermepumpe": [
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe mit PV", text: "Planung und Installation aus einer Hand." },
    { href: "/foerdercheck", titel: "Förder-Check", text: "Zuschüsse für den Heizungstausch prüfen." },
    { href: "/ratgeber/waermepumpe-kosten", titel: "Wärmepumpe Kosten", text: "Anschaffung, Einbau und Betrieb in Österreich." },
  ],
  "/rechner/wallbox": [
    { href: "/produkte/wallbox", titel: "Wallbox mit Überschussladen", text: "Laden, wenn das Dach Strom liefert." },
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur für Betriebe", text: "Flotte und Kundenparkplatz." },
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox Installation", text: "Kosten, Voraussetzungen und Meldung." },
  ],
  "/rechner/dynamischer-stromtarif": [
    { href: "/energie-live", titel: "Strommarkt live", text: "Der aktuelle Börsenpreis der Gebotszone AT." },
    { href: "/service/stromtarif", titel: "Dynamischer Stromtarif", text: "Wie der Tarif funktioniert und für wen er passt." },
    { href: "/ratgeber/dynamischer-stromtarif-lohnt-sich", titel: "Lohnt sich ein dynamischer Tarif?", text: "Rechenbeispiele für Österreich." },
  ],
  "/foerdercheck": [
    { href: "/forderungen/bundesfoerderung", titel: "Bundesförderung", text: "EAG-Investitionszuschuss und KPC-Programme." },
    { href: "/forderungen/landesforderungen", titel: "Landesförderungen", text: "Alle Programme nach Bundesland im Detail." },
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile", text: "Investitionsfreibetrag und Elektrizitätsabgabe." },
  ],
  "/ratgeber": [
    { href: "/wissen/lexikon", titel: "Photovoltaik-Lexikon", text: "142 Fachbegriffe für Österreich." },
    { href: "/standort-check", titel: "Standort-Check", text: "Die Theorie auf Ihren Standort anwenden." },
    { href: "/faqs", titel: "Häufige Fragen", text: "Kurze Antworten auf die wichtigsten Fragen." },
  ],
  "/kontakt": [
    { href: "/angebot", titel: "Angebot in 2 Minuten", text: "Projekt und Verbrauch online erfassen." },
    { href: "/termin", titel: "Termin buchen", text: "Telefon, Video oder vor Ort." },
    { href: "/referenzen/projekte", titel: "Unsere Projekte", text: "Anlagen in ganz Österreich." },
  ],
  "/wissen/lexikon": [
    { href: "/ratgeber", titel: "Ratgeber", text: "Ausführliche Artikel zu Kosten, Förderung und Technik." },
    { href: "/faqs", titel: "Häufige Fragen", text: "Die Fragen, die uns Kunden am häufigsten stellen." },
    { href: "/rechner", titel: "Rechner & Tools", text: "Das Wissen direkt auf Ihr Projekt anwenden." },
  ],
};

/** Verweise fuer einen Pfad; leeres Array, wenn nichts hinterlegt ist. */
export function querverweiseFuer(pfad) {
  return QUERVERWEISE[pfad] ?? [];
}
