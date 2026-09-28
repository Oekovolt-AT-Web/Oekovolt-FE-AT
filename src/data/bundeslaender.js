// src/data/bundeslaender.js
//
// Förder-, Rechts- und Standortdaten der neun österreichischen Bundesländer
// für /forderungen/landesforderungen, /forderungen/landesforderungen/<slug>,
// /forderungen/baurecht und den Förder-Check (/foerdercheck).
//
// Eine Quelle für alle Seiten – keine Backend-Abfrage. Jede Zahl trägt eine
// Quelle; was sich nicht an einer Primärquelle belegen ließ, ist mit
// `pruefen: true` markiert und wird auf der Seite als
// „Stand <Monat Jahr>, bitte bei der Förderstelle prüfen“ ausgewiesen.
//
// PFLEGE: Landesprogramme laufen oft nur bis zur Budgetausschöpfung.
// Mindestens vierteljährlich prüfen und dann STAND anpassen.
//
// Zielgruppen: unternehmen | landwirtschaft | gemeinde | privat | energiegemeinschaft
// Vorhaben:    pv-dach | freiflaeche | agri-pv | speicher | laden | waermepumpe

/** Zentrales Prüfdatum für alle Förder- und Rechtsseiten. */
export const STAND = { iso: "2026-09-29", label: "September 2026", kurz: "09/2026" };

/** Hinweistext für nicht an der Primärquelle belegte Werte. */
export const PRUEFEN_HINWEIS = `Stand ${STAND.label}, bitte bei der Förderstelle prüfen`;

export const ZIELGRUPPEN = [
  { id: "unternehmen", label: "Unternehmen", text: "Gewerbe, Industrie, Handel, Tourismus" },
  { id: "landwirtschaft", label: "Landwirtschaft", text: "Land- und Forstwirtschaft" },
  { id: "gemeinde", label: "Gemeinde", text: "Gemeinden, Verbände, öffentliche Hand" },
  { id: "privat", label: "Privat", text: "Eigenheim, Wohnhaus, Chalet" },
  { id: "energiegemeinschaft", label: "Energiegemeinschaft", text: "EEG, BEG, gemeinschaftliche Erzeugung" },
];

export const VORHABEN = [
  { id: "pv-dach", label: "PV auf dem Dach", text: "Dach, Fassade, Carport" },
  { id: "freiflaeche", label: "Freiflächen-PV", text: "Grünland, vorbelastete Flächen" },
  { id: "agri-pv", label: "Agri-PV", text: "PV mit landwirtschaftlicher Nutzung" },
  { id: "speicher", label: "Stromspeicher", text: "neu mit PV oder nachgerüstet" },
  { id: "laden", label: "Ladeinfrastruktur", text: "Firmenflotte, Kundenparkplatz, Wallbox" },
  { id: "waermepumpe", label: "Wärmepumpe", text: "Raum- und Prozesswärme" },
];

/** Einordnung der Landesförderung (Karte, Länderkarten, Förder-Check). */
export const FOERDERARTEN = {
  zuschuss: { label: "Breites Landesprogramm", kurz: "Landeszuschuss" },
  gezielt: { label: "Gezielte Landesprogramme", kurz: "Gezielt" },
  bund: { label: "Bundesförderung + Beratung", kurz: "Bund" },
};

// PVGIS-Werte (EU JRC, PVGIS 5.3): 1 kWp, optimale Neigung, Südausrichtung,
// 14 % Systemverluste. Abgefragt am 28.09.2026 für die jeweils genannten Orte.
// Reale Dachanlagen liegen je nach Ausrichtung, Neigung und Verschattung
// darunter (Ost-West-Anlagen typisch 10–20 % weniger).
const PVGIS_QUELLE = { label: "PVGIS 5.3, EU JRC (abgefragt 28.09.2026)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/" };

export const BUNDESLAENDER = {
  wien: {
    name: "Wien",
    kuerzel: "W",
    hauptstadt: "Wien",
    slugs: ["landesfoerderungen-in-wien"],
    stand: STAND.iso,
    foerderart: "gezielt",
    ertrag: [1170, 1180],
    ertragOrte: [["Wien", 1177]],
    kurz: "Wien fördert seit Mai 2026 gezielt PV auf mehrgeschoßigen Wohnbauten und Sonderformen wie Gründach-, Flugdach- und Fassaden-PV – die Standard-Dachanlage nicht mehr.",
    text:
      "Das Förderpaket der Stadt (7 Mio. € seit 01.05.2026) richtet sich an natürliche und juristische Personen – also auch an Unternehmen, Bauträger und Hausverwaltungen. Für Betriebsgebäude ohne Wohnnutzung bleibt vor allem der EAG-Investitionszuschuss des Bundes. Eine eigene Speicherförderung gibt es in Wien nicht mehr. Wer neu baut, muss seit 15.07.2026 die verschärfte Solarpflicht nach § 118e Bauordnung für Wien beachten.",
    ueberblick: {
      unternehmen: "Wohnbau-Programm auch für juristische Personen; Betriebsgebäude: Bund (EAG)",
      landwirtschaft: "kein eigenes Landesprogramm",
      gemeinde: "–",
      privat: "Mehrgeschoßiger Wohnbau, PV-Sonderformen",
      speicher: "keine städtische Speicherförderung",
      energiegemeinschaft: "Bundesstelle, Wiener Netze",
    },
    programme: [
      {
        name: "PV-Förderung mehrgeschoßiger Wohnbau",
        traeger: "Stadt Wien",
        zielgruppen: ["unternehmen", "privat"],
        themen: ["pv-dach"],
        hoehe: "max. 30 % der Kosten, gestaffelt 400 €/kWp (bis 50 kWp), 300 €/kWp (50–100 kWp), 250 €/kWp (100–1.000 kWp) – der niedrigere Betrag gilt",
        was: "PV auf Bestandswohnbauten mit mindestens 3 Wohneinheiten und mindestens 50 % Wohnnutzung",
        status: "laufend, solange Mittel reichen – Antrag vor der Bestellung",
        url: "https://www.wien.gv.at/amtswege/oekostromanlagen-photovoltaik-anlagen-foerderantrag",
        quelle: "wien.gv.at",
      },
      {
        name: "PV-Sonderformen: Gründach, Flugdach, Fassade, Dachgarten",
        traeger: "Stadt Wien",
        zielgruppen: ["unternehmen", "privat"],
        themen: ["pv-dach"],
        hoehe: "Fördersätze je Sonderform laut Stadt Wien",
        was: "Gründach-PV, Flugdach-PV, PV-Fassaden sowie PV-Dachgärten und Verschattungen auf begehbaren Dächern",
        status: "seit 01.05.2026",
        pruefen: true,
        hinweis: "Ob eine Kombination mit dem EAG-Investitionszuschuss möglich ist, geben Sekundärquellen unterschiedlich an – vor dem Antrag klären.",
        url: "https://www.wien.gv.at/umwelt/photovoltaik-foerderpaket-ab-mai-2026",
        quelle: "wien.gv.at",
      },
    ],
    ausgelaufen: [
      { programm: "Standard-Dach-PV und Stromspeicher (Einfamilienhaus, Betriebsdach)", ende: "seit dem Förderpaket 05/2026 nicht mehr gefördert", url: "https://sonnenstrom.wien.gv.at/foerderungen" },
    ],
    energiegemeinschaften: {
      stelle: "Österreichische Koordinationsstelle für Energiegemeinschaften",
      url: "https://energiegemeinschaften.gv.at",
      text: "In Wien sind die Wiener Netze technischer Ansprechpartner (Zählpunkte, Datenaustausch). Die Bundesstelle berät zu Rechtsform, Statuten und den neuen ElWG-Modellen ab 01.10.2026.",
    },
    beratung: [
      { name: "Sonnenstrom Wien – PV-Fördersprechstunde", url: "https://sonnenstrom.wien.gv.at/foerderungen", text: "Kostenlose Förderberatung der Stadt Wien." },
    ],
    netzbetreiber: [{ name: "Wiener Netze", url: "https://www.wienernetze.at" }],
    recht: {
      bauordnung: "Bauordnung für Wien (BO)",
      dach: "bewilligungsfrei nach § 62a Abs. 1 Z 24a BO, außer in den Fällen des § 60 Abs. 1 lit. j (Grünland-Schutzgebiet, Bausperre, Schutzzonen, über 15 kW ohne elektrizitätsrechtliches Verfahren)",
      freiflaeche: "Bewilligungspflicht nach § 60 Abs. 1 lit. j BO je nach Lage; Widmung beachten",
      elektrizitaet: "Wiener ElWG 2005: bis 15 kW frei, über 15–50 kW Anzeige (§ 6a), über 50 kW Genehmigung der MA 64 (§ 5), 50–250 kW vereinfachtes Verfahren",
      raumordnung: "Freiflächen nur mit passender Widmung (Flächenwidmungs- und Bebauungsplan)",
      ortsbild: "Schutzzonen nach BO; Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "§ 118e BO (seit 15.07.2026): Nichtwohn-Neubau 1 kWp je 100 m² konditionierter Brutto-Grundfläche, Wohnbau nach Formel BGF/(150 × lc); Ersatzflächen im Stadtgebiet möglich",
      ampel: { dach: "frei", freiflaeche: "bewilligung", elektrizitaet: "anzeige" },
      quellen: [
        { label: "RIS – Bauordnung für Wien", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=LrW&Gesetzesnummer=20000006" },
        { label: "wien.gv.at – PV bis 50 kW (Anzeige)", url: "https://www.wien.gv.at/amtswege/errichtung-betrieb-photovoltaikanlage-bis-50-kw-anzeige" },
        { label: "wien.gv.at – PV über 50 kW (Genehmigung)", url: "https://www.wien.gv.at/amtswege/errichtung-betrieb-photovoltaikanlage-ueber-50-kw-genehmigung" },
      ],
    },
    gemeinden: "Wien ist Land und Gemeinde zugleich – zusätzliche Gemeindeprogramme gibt es nicht.",
    standort: {
      titel: "Pannonisch geprägt, dicht bebaut",
      text: "Wien liegt nach PVGIS bei rund 1.180 kWh je kWp (optimal geneigt). Der begrenzende Faktor ist selten die Sonne, sondern Dachfläche, Verschattung und Statik im Bestand. Große Betriebsdächer im Süden und Osten der Stadt erreichen Erträge wie im Burgenland.",
    },
    quellen: [
      { label: "Stadt Wien – Photovoltaik-Förderpaket ab Mai 2026", url: "https://www.wien.gv.at/umwelt/photovoltaik-foerderpaket-ab-mai-2026" },
      { label: "Sonnenstrom Wien – Förderungen", url: "https://sonnenstrom.wien.gv.at/foerderungen" },
      PVGIS_QUELLE,
    ],
  },

  niederoesterreich: {
    name: "Niederösterreich",
    kuerzel: "NÖ",
    hauptstadt: "St. Pölten",
    slugs: ["landesfoerderungen-in-niederoesterreich"],
    stand: STAND.iso,
    foerderart: "bund",
    ertrag: [1090, 1170],
    ertragOrte: [["St. Pölten", 1142], ["Zwettl", 1092], ["Wiener Neustadt", 1170], ["Mistelbach", 1170]],
    kurz: "Niederösterreich hat 2026 keinen laufenden €/kWp-Zuschuss für Betriebe – dafür ein sehr liberales Anlagenrecht: PV bis 1 MWp braucht keine elektrizitätsrechtliche Genehmigung.",
    text:
      "Der Landes-Call für PV-Überdachungen von Parkplätzen (bis 45 % der umweltrelevanten Mehrkosten) hatte seinen einzigen Stichtag am 30.06.2026. Private erhalten PV und Speicher über Zusatzpunkte in der Wohnbauförderung. Für Unternehmen, Landwirtschaft und Gemeinden trägt daher der EAG-Investitionszuschuss. Bei Freiflächen ist Niederösterreich mit dem Sektoralen Raumordnungsprogramm und festen Zonen das am klarsten geregelte Land.",
    ueberblick: {
      unternehmen: "Parkplatz-PV-Call (Stichtag 30.06.2026 vorbei); sonst Bund",
      landwirtschaft: "kein eigenes Landesprogramm; Freifläche über PV-Zonen",
      gemeinde: "Parkplatz-PV-Call; eNu-Beratungspaket",
      privat: "Zusatzpunkte Wohnbauförderung",
      speicher: "nur über Wohnbauförderung (Punkte)",
      energiegemeinschaft: "eNu – Anlaufstelle Energiegemeinschaften",
    },
    programme: [
      {
        name: "PV-Überdachung von Parkplätzen",
        traeger: "Land Niederösterreich",
        zielgruppen: ["unternehmen", "gemeinde"],
        themen: ["pv-dach", "speicher", "laden"],
        hoehe: "max. 45 % der umweltrelevanten Mehrkosten, Bonuspunkte für Speicher und E-Ladestellen",
        was: "PV als Parkplatzüberdachung für Betriebe, Gemeinden und Vereine; Budget 2 Mio. €",
        status: "einziger Stichtag 30.06.2026 – derzeit keine Einreichung; neuen Call abwarten",
        url: "https://www.noe.gv.at/noe/Energie/PV-Ueberdachung_Parkplaetze.html",
        quelle: "noe.gv.at",
      },
      {
        name: "Wohnbauförderung: Zusatzpunkte für PV und Speicher",
        traeger: "Land Niederösterreich",
        zielgruppen: ["privat"],
        themen: ["pv-dach", "speicher"],
        hoehe: "Punkte im Förderungsmodell Eigenheim (Neubau und Sanierung)",
        was: "PV und – seit der Novelle 11/2025 – Stromspeicher im Punktesystem der Wohnbauförderung",
        status: "laufend",
        pruefen: true,
        url: "https://www.energie-noe.at/foerderung-fuer-photovoltaik",
        quelle: "energie-noe.at",
      },
      {
        name: "Beratungspaket Energiegemeinschaften",
        traeger: "Energie- und Umweltagentur NÖ (eNu)",
        zielgruppen: ["gemeinde", "energiegemeinschaft"],
        themen: ["pv-dach", "freiflaeche"],
        hoehe: "Vor-Ort-Paket 100 €, telefonische Erstberatung kostenlos",
        was: "Beratung für Gemeinden und KEM-Regionen zur Gründung und zum Betrieb von Energiegemeinschaften",
        status: "laufend",
        url: "https://www.energie-noe.at/gemeinde-energiegemeinschaften",
        quelle: "energie-noe.at",
      },
    ],
    ausgelaufen: [],
    energiegemeinschaften: {
      stelle: "eNu – Anlaufstelle für Energiegemeinschaften in NÖ",
      url: "https://www.energie-noe.at/gemeinde-energiegemeinschaften",
      text: "Die eNu ist in Niederösterreich die unabhängige Anlaufstelle für Erneuerbare-Energie-Gemeinschaften. Technisch zuständig ist der jeweilige Netzbetreiber, meist Netz Niederösterreich.",
    },
    beratung: [
      { name: "Energieberatung NÖ (eNu)", url: "https://www.energie-noe.at", text: "Hotline 02742 22 144 – neutral, auch für Betriebe und Gemeinden." },
    ],
    netzbetreiber: [
      { name: "Netz Niederösterreich", url: "https://www.netz-noe.at" },
      { name: "Wiener Netze (Teile Niederösterreichs)", url: "https://www.wienernetze.at" },
    ],
    recht: {
      bauordnung: "NÖ Bauordnung 2014",
      dach: "bewilligungs- und anzeigefrei (§ 17 Z 14); in Schutzzonen bzw. zum Ortsbildschutz anzeigepflichtig (§ 15 Abs. 1 Z 13 lit. b)",
      freiflaeche: "im Grünland über 100 kW Bauanzeige zur Prüfung der Widmung (§ 15 Abs. 1 Z 8)",
      elektrizitaet: "NÖ ElWG 2005 § 5 Abs. 2 Z 3: PV bis 1 MWp samt Speicher genehmigungsfrei, wenn ein befugtes Unternehmen errichtet",
      raumordnung: "NÖ ROG 2014 § 20 Abs. 2 Z 21: im Grünland über 50 kW Widmung „Grünland-Photovoltaikanlagen“; außerhalb der Zonen des Sektoralen Raumordnungsprogramms höchstens 2 ha, in den Zonen bis 5 + 5 ha",
      ortsbild: "Ortsbildschutz nach § 56 BO, Schutzzonen im Bebauungsplan; Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "Vorgaben für Neubauten in der NÖ Bauordnung",
      pvPflichtPruefen: true,
      ampel: { dach: "frei", freiflaeche: "anzeige", elektrizitaet: "frei" },
      quellen: [
        { label: "RIS – NÖ Bauordnung 2014", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=LrNO&Gesetzesnummer=20001079" },
        { label: "RIS – NÖ Elektrizitätswesengesetz 2005 § 5", url: "https://www.ris.bka.gv.at/Dokumente/LrNO/LNO40061571/LNO40061571.html" },
        { label: "Land NÖ – FAQ Photovoltaik Raumordnung (05/2025)", url: "https://www.raumordnung-noe.at/fileadmin/root_raumordnung/land/ueberoertliche_raumordnung/FAQs_Photovoltaik_20250523.pdf" },
      ],
    },
    gemeinden: "Viele niederösterreichische Gemeinden fördern PV und Speicher zusätzlich – eine zentrale Datenbank gibt es nicht. Fragen Sie beim Gemeindeamt nach, bevor Sie bestellen.",
    standort: {
      titel: "Weinviertel und Industrieviertel mit Spitzenwerten",
      text: "Nach PVGIS reicht die Spanne in Niederösterreich von rund 1.090 kWh je kWp im Waldviertel (Zwettl) bis 1.170 kWh im Weinviertel und um Wiener Neustadt. Dazu kommen große Hallen- und Freiflächen – und mit den festgelegten PV-Zonen Planungssicherheit für Freiflächenprojekte.",
    },
    quellen: [
      { label: "Land NÖ – PV-Überdachung von Parkplätzen", url: "https://www.noe.gv.at/noe/Energie/PV-Ueberdachung_Parkplaetze.html" },
      { label: "eNu – Förderung für Photovoltaik", url: "https://www.energie-noe.at/foerderung-fuer-photovoltaik" },
      PVGIS_QUELLE,
    ],
  },

  oberoesterreich: {
    name: "Oberösterreich",
    kuerzel: "OÖ",
    hauptstadt: "Linz",
    slugs: ["landesfoerderungen-in-oberoesterreich"],
    stand: STAND.iso,
    foerderart: "bund",
    ertrag: [1100, 1150],
    ertragOrte: [["Linz", 1143], ["Ostermiething", 1145], ["Freistadt", 1103], ["Bad Ischl", 1106]],
    kurz: "Oberösterreich fördert PV 2026 nicht mit einem eigenen Landeszuschuss – die Speicher-Nachrüstung ist seit 01.07.2026 ausgeschöpft. Maßgeblich sind EAG-Zuschuss und KPC.",
    text:
      "Der Landesleitfaden 2026 verweist für PV und Speicher auf den EAG-Investitionszuschuss und die Umweltförderung. Für Betriebe legt das Land bei „Energiesparen in Betrieben“ einen Aufschlag auf die Bundesförderung drauf – für Effizienz, Abwärme und Wärmepumpen, nicht für PV. Baurechtlich ist Oberösterreich einfach: PV ist bewilligungs- und anzeigefrei, elektrizitätsrechtlich bis 1.000 kW ohne Bewilligung. Heikel wird es bei Freiflächen über 50 m² Modulfläche im Grünland.",
    ueberblick: {
      unternehmen: "Landesaufschlag „Energiesparen in Betrieben“ (ohne PV)",
      landwirtschaft: "kein Landesprogramm; Kriterienkatalog für PV-Freiflächen",
      gemeinde: "Unterstützung über den Energiesparverband",
      privat: "Speicher-Nachrüstung ausgeschöpft",
      speicher: "eingestellt per 01.07.2026",
      energiegemeinschaft: "OÖ Energiesparverband – Anlaufstelle",
    },
    programme: [
      {
        name: "Energiesparen in Betrieben (Landesaufschlag)",
        traeger: "Land Oberösterreich",
        zielgruppen: ["unternehmen"],
        themen: ["waermepumpe"],
        hoehe: "25 % der Bundesförderung als Aufschlag, KMU-Zuschlag 20 bzw. 30 %",
        was: "Prozesseffizienz, Abwärmenutzung, Wärmepumpen für Niedertemperatur-Abwärme – PV ist nicht Gegenstand",
        status: "bis 31.12.2026, Einreichung über den UFI-Prozess der KPC",
        url: "https://www.land-oberoesterreich.gv.at/183291.htm",
        quelle: "land-oberoesterreich.gv.at",
      },
    ],
    ausgelaufen: [
      { programm: "Stromspeicher-Nachrüstung (150 €/kWh, max. 15 kWh)", ende: "eingestellt per 01.07.2026 – Mittel ausgeschöpft", url: "https://www.land-oberoesterreich.gv.at/554598.htm" },
    ],
    energiegemeinschaften: {
      stelle: "OÖ Energiesparverband",
      url: "https://www.energiesparverband.at/energie-gemeinschaften",
      text: "Der Energiesparverband ist die Landes-Anlaufstelle für GEA, EEG, BEG sowie die neuen ElWG-Modelle Peer-to-Peer und Eigenversorgungsanlage (Tel. 0732 7720-14380).",
    },
    beratung: [
      { name: "OÖ Energiesparverband", url: "https://www.energiesparverband.at/foerderassistent", text: "Neutrale Energieberatung mit Förder-Assistent für Betriebe, Gemeinden und Private." },
    ],
    netzbetreiber: [
      { name: "Netz Oberösterreich", url: "https://www.netzooe.at" },
      { name: "Linz Netz", url: "https://www.linznetz.at" },
    ],
    recht: {
      bauordnung: "Oö. Bauordnung 1994",
      dach: "bewilligungs- und anzeigefrei (§ 26 Z 15); bau- und raumordnungsrechtliche Vorgaben gelten trotzdem",
      freiflaeche: "baurechtlich frei; Naturschutz im Grünland außerhalb geschlossener Ortschaften: 2–500 m² Anzeige, über 500 m² Bewilligung (Oö. NSchG 2001 §§ 5, 6)",
      elektrizitaet: "Oö. ElWOG 2006 § 6 Abs. 2 Z 1a: bis 1.000 kW bewilligungsfrei, auf Dächern und Parkplätzen unabhängig von der Leistung",
      raumordnung: "Oö. ROG 1994: freistehend über 50 m² Modulfläche im Grünland nur mit Sonderwidmung (§ 30a Abs. 3); Ausnahme landwirtschaftlicher Eigenbedarf; Ausschluss- und Beschleunigungszonen 2026 in Ausarbeitung",
      ortsbild: "Orts- und Landschaftsbild nach Bauordnung und Bebauungsplan; Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "Angaben widersprüchlich",
      pvPflichtPruefen: true,
      ampel: { dach: "frei", freiflaeche: "bewilligung", elektrizitaet: "frei" },
      quellen: [
        { label: "Land OÖ – Leitfaden 2026 Photovoltaik (Stand Juni 2026)", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf" },
        { label: "Land OÖ – Kriterienkatalog PV-Freiflächen", url: "https://www.land-oberoesterreich.gv.at/259165.htm" },
      ],
    },
    gemeinden: "Einzelne oberösterreichische Gemeinden fördern PV oder Speicher. Der Förder-Assistent des Energiesparverbands hilft bei der Suche.",
    standort: {
      titel: "Solide Einstrahlung, starke Industrie",
      text: "Von Linz bis ins Innviertel liefert PVGIS rund 1.140–1.150 kWh je kWp, im Mühlviertel und Salzkammergut etwa 1.100 kWh. Entscheidend ist in Oberösterreich meist nicht die Sonne, sondern der hohe Tageslastgang der Industrie – ideal für hohen Eigenverbrauch. Unser Firmensitz in Ostermiething liegt im Innviertel.",
    },
    quellen: [
      { label: "Land OÖ – Leitfaden 2026 Photovoltaik", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf" },
      { label: "Land OÖ – Stromspeicher-Nachrüstung", url: "https://www.land-oberoesterreich.gv.at/554598.htm" },
      PVGIS_QUELLE,
    ],
  },

  salzburg: {
    name: "Salzburg",
    kuerzel: "S",
    hauptstadt: "Salzburg",
    slugs: ["landesfoerderungen-in-salzburg"],
    stand: STAND.iso,
    foerderart: "gezielt",
    ertrag: [1080, 1230],
    ertragOrte: [["Salzburg", 1079], ["Zell am See", 1174], ["Tamsweg", 1227]],
    kurz: "Salzburg hat die PV-Förderung für Private mit 31.12.2025 beendet. Betriebe, Landwirtschaft und gemeinnützige Vereine erhalten laut Förderseite weiter eine Pauschale.",
    text:
      "Die Landesmittel fließen 2026 vorrangig in den Kesseltausch. Auch die Stadt Salzburg hat ihre PV-Förderung mit 01.01.2026 eingestellt. Für Unternehmen bleibt ein pauschaler Landeszuschuss je PV-Anlage und je Speicher. Anlagenrechtlich ist Salzburg das einfachste Land: Errichtet ein befugtes Unternehmen, braucht PV unabhängig von der Leistung keine elektrizitätsrechtliche Anzeige oder Bewilligung.",
    ueberblick: {
      unternehmen: "Pauschale je PV-Anlage bzw. Speicher",
      landwirtschaft: "Pauschale je PV-Anlage bzw. Speicher",
      gemeinde: "–",
      privat: "ausgelaufen mit 31.12.2025",
      speicher: "Pauschale für Betriebe",
      energiegemeinschaft: "Bundesstelle, Salzburg Netz",
    },
    programme: [
      {
        name: "Landesförderung PV und Stromspeicher für Betriebe",
        traeger: "Land Salzburg",
        zielgruppen: ["unternehmen", "landwirtschaft"],
        themen: ["pv-dach", "speicher"],
        hoehe: "1.000 € pauschal je PV-Anlage (ab 5 kWp) bzw. je Speicher (ab 5 kWh), max. 40 % der Kosten",
        was: "Betriebe, land- und forstwirtschaftliche Betriebe, gemeinnützige Vereine",
        status: "laut Sekundärquellen laufend",
        pruefen: true,
        url: "https://www.salzburg.gv.at/energiefoerderung/photovoltaikanlagen-und-stromspeicher",
        quelle: "salzburg.gv.at",
      },
    ],
    ausgelaufen: [
      { programm: "Landesförderung PV und Speicher für Private", ende: "ausgelaufen mit 31.12.2025", url: "https://www.salzburg.gv.at/energiefoerderung" },
      { programm: "Photovoltaikförderung der Stadt Salzburg", ende: "eingestellt ab 01.01.2026", url: "https://www.stadt-salzburg.at/photovoltaikfoerderung" },
    ],
    energiegemeinschaften: {
      stelle: "Österreichische Koordinationsstelle für Energiegemeinschaften",
      url: "https://energiegemeinschaften.gv.at",
      text: "Salzburg Netz veröffentlicht die geltenden Netzentgelt-Reduktionen und die technischen Abläufe für Energiegemeinschaften im Netzgebiet.",
    },
    beratung: [
      { name: "Anlaufstelle „Erneuerbare Energie“ des Landes", url: "https://www.salzburg.gv.at/fileadmin/Dateien/Energie/Erneuerbare_Energien/Leitfaden_Photovoltaik.pdf", text: "Juristische und technische Unterstützung im Genehmigungsverfahren (anlaufstelle-energie@salzburg.gv.at)." },
      { name: "Energieberatung Land Salzburg", url: "https://www.salzburg.gv.at/themen/energie/energieberatung", text: "Neutrale Energieberatung des Landes." },
    ],
    netzbetreiber: [{ name: "Salzburg Netz", url: "https://www.salzburgnetz.at" }],
    recht: {
      bauordnung: "Salzburger Baupolizeigesetz 1997",
      dach: "bewilligungsfrei nach § 2 Abs. 4: integriert oder max. 30 cm Abstand zur Dachhaut unter der Firsthöhe; Flachdach mind. 1 m zurückversetzt und max. 1 m hoch",
      freiflaeche: "bewilligungsfrei bis 200 m² Kollektorfläche (45°-Linie ab 1 m zur Grundgrenze) oder mit Kennzeichnung bzw. Widmung „Grünland-Solaranlagen“",
      elektrizitaet: "LEG 1999 § 45 Abs. 3: PV unabhängig von der Leistung anzeige- und bewilligungsfrei, wenn ein befugtes Unternehmen errichtet (sonst unter 150 kW frei, 150–500 kW Anzeige, über 500 kW Bewilligung)",
      raumordnung: "ROG 2009 § 36 Abs. 7: freistehend über 200 m² im Grünland nur mit Kennzeichnung nach § 39b; Photovoltaik-Kennzeichnungsverordnung 2023 (Bodenpunkte)",
      ortsbild: "Freistellung gilt nicht im Schutzgebiet des Altstadterhaltungsgesetzes 1980 und in Ortsbildschutzgebieten",
      pvPflicht: "Angaben widersprüchlich",
      pvPflichtPruefen: true,
      ampel: { dach: "frei", freiflaeche: "bewilligung", elektrizitaet: "frei" },
      quellen: [
        { label: "Land Salzburg – Photovoltaik-Leitfaden (Stand 03/2025)", url: "https://www.salzburg.gv.at/fileadmin/Dateien/Energie/Erneuerbare_Energien/Leitfaden_Photovoltaik.pdf" },
      ],
    },
    gemeinden: "Einzelne Salzburger Gemeinden, vor allem e5-Gemeinden, fördern Energiemaßnahmen – beim Gemeindeamt nachfragen.",
    standort: {
      titel: "Vom Flachgau bis in den Lungau",
      text: "In der Stadt Salzburg rechnet PVGIS mit knapp 1.080 kWh je kWp, im Pinzgau (Zell am See) mit rund 1.170 und im Lungau (Tamsweg) mit über 1.220 kWh – Höhenlage, klare Luft und Schneereflexion im Winter machen den Unterschied. Im Gebirge gehören Schneelast und Modulprüflasten in jede Planung.",
    },
    quellen: [
      { label: "Land Salzburg – Energieförderung", url: "https://www.salzburg.gv.at/energiefoerderung" },
      { label: "Land Salzburg – Photovoltaik-Leitfaden", url: "https://www.salzburg.gv.at/fileadmin/Dateien/Energie/Erneuerbare_Energien/Leitfaden_Photovoltaik.pdf" },
      PVGIS_QUELLE,
    ],
  },

  tirol: {
    name: "Tirol",
    kuerzel: "T",
    hauptstadt: "Innsbruck",
    slugs: ["landesfoerderungen-in-tirol"],
    stand: STAND.iso,
    foerderart: "gezielt",
    ertrag: [1110, 1360],
    ertragOrte: [["Innsbruck", 1363], ["Lienz", 1320], ["Landeck", 1195], ["Kufstein", 1114]],
    kurz: "Tirol fördert 2026 gezielt die Nachrüstung netzdienlicher Stromspeicher – auch für Unternehmen – und PV auf Gemeindeobjekten über den Tiroler Energiefonds.",
    text:
      "Die Speicherförderung gilt für natürliche und juristische Personen, der Antrag folgt nach der Inbetriebnahme. Private PV läuft über die Wohnhaussanierung. Gemeinden können über den Tiroler Energiefonds (2025–2028) PV, Wärmepumpen, Wärmenetze und Ladeinfrastruktur für E-Carsharing finanzieren. Seit 14.10.2025 gelten neue Sonderregeln für Solaranlagen in der Tiroler Bauordnung.",
    ueberblick: {
      unternehmen: "Speicher-Nachrüstung (auch juristische Personen)",
      landwirtschaft: "Speicher-Nachrüstung",
      gemeinde: "Tiroler Energiefonds (PV bis 2028)",
      privat: "Wohnhaussanierung, Speicher",
      speicher: "100 €/kWh, max. 1.000 €",
      energiegemeinschaft: "Energieagentur Tirol",
    },
    programme: [
      {
        name: "Nachrüstung netzdienlicher Stromspeicher 2026",
        traeger: "Land Tirol",
        zielgruppen: ["unternehmen", "landwirtschaft", "privat"],
        themen: ["speicher"],
        hoehe: "100 €/kWh, max. 10 kWh bzw. 1.000 €",
        was: "Nachrüstung oder Erweiterung von Speichern, Inbetriebnahme ab 01.01.2026; Budget rund 1 Mio. €",
        status: "bis zur Ausschöpfung – Antrag nach Inbetriebnahme",
        url: "https://www.tirol.gv.at/presse/meldungen/meldung/land-tirol-foerdert-2026-nachruestung-von-pv-anlagen-mit-stromspeichern/",
        quelle: "tirol.gv.at",
      },
      {
        name: "Tiroler Energiefonds (TEF) 2025–2028",
        traeger: "Land Tirol",
        zielgruppen: ["gemeinde"],
        themen: ["pv-dach", "waermepumpe", "laden"],
        hoehe: "Fördersätze laut Richtlinie",
        was: "PV auf Gemeindeobjekten (bis 31.12.2028), Wärmepumpen, Wärmenetze, Ladeinfrastruktur für E-Carsharing (bis 31.12.2030)",
        status: "laufend",
        pruefen: true,
        url: "https://www.energieagentur.tirol/fuer-gemeinden/foerderuebersicht/",
        quelle: "energieagentur.tirol",
      },
      {
        name: "Wohnhaussanierung – Photovoltaik",
        traeger: "Land Tirol",
        zielgruppen: ["privat"],
        themen: ["pv-dach"],
        hoehe: "50 % der Kosten, max. 125 €/kWp",
        was: "PV im Rahmen der Wohnhaussanierung; Teile der Sanierungsoffensive 2026 sind ausgeschöpft",
        status: "laut Sekundärquellen seit 01.01.2026 halbierter Satz",
        pruefen: true,
        url: "https://www.energieagentur.tirol/fuer-private/foerderuebersicht/",
        quelle: "energieagentur.tirol",
      },
    ],
    ausgelaufen: [],
    energiegemeinschaften: {
      stelle: "Energieagentur Tirol",
      url: "https://www.energieagentur.tirol",
      text: "Die Energieagentur Tirol informiert zu Energiegemeinschaften; technischer Partner ist der Netzbetreiber, meist TINETZ oder die IKB.",
    },
    beratung: [
      { name: "Energieagentur Tirol", url: "https://www.energieagentur.tirol", text: "Neutrale Energieberatung, Tel. 0512 250015." },
      { name: "Anlaufstelle für Erzeugungsanlagen erneuerbarer Energie", url: "https://www.tirol.gv.at/umwelt/wasser-forst-und-energierecht/erzeugungsanlagen-von-erneuerbarer-energie/", text: "Zentrale Stelle des Landes für Anzeigen und Bewilligungen." },
    ],
    netzbetreiber: [
      { name: "TINETZ", url: "https://www.tinetz.at" },
      { name: "Innsbrucker Kommunalbetriebe (IKB)", url: "https://www.ikb.at" },
    ],
    recht: {
      bauordnung: "Tiroler Bauordnung 2022",
      dach: "§ 52c (seit 14.10.2025): bis 100 m² frei (integriert oder max. 30 cm Abstand, Flachdach max. 15°), über 100 m² Bauanzeige, Bewilligung bei wesentlichen bautechnischen Fragen; Fertigstellung ist der Behörde zu melden (Weiterleitung an die Feuerwehr)",
      freiflaeche: "freistehend bis 100 m² frei (max. 30 cm über Gelände, eben bis 15°), darüber Anzeige oder Bewilligung; Naturschutz: außerhalb geschlossener Ortschaften über 2.500 m² bewilligungspflichtig",
      elektrizitaet: "TEG 2012: über 100 kW Anzeige (§ 7), über 250 kW Bewilligung (§ 6)",
      raumordnung: "TROG 2022: Sonderflächen für Solarenergieanlagen (§ 43); Freiflächen restriktiv wegen Grünzonen und Landwirtschaft",
      ortsbild: "Ortsbild- und Stadtkernschutz; Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "keine allgemeine Pflicht im Wohnbau bekannt",
      pvPflichtPruefen: true,
      ampel: { dach: "anzeige", freiflaeche: "bewilligung", elektrizitaet: "anzeige" },
      quellen: [
        { label: "RIS – Tiroler Bauordnung 2022 § 52c", url: "https://www.ris.bka.gv.at/Dokumente/LrT/LTI40053250/LTI40053250.html" },
        { label: "Land Tirol – Anlaufstelle Erzeugungsanlagen", url: "https://www.tirol.gv.at/umwelt/wasser-forst-und-energierecht/erzeugungsanlagen-von-erneuerbarer-energie/" },
      ],
    },
    gemeinden: "Zahlreiche Tiroler Gemeinden und Klima- und Energie-Modellregionen fördern zusätzlich – beim Gemeindeamt oder bei der KEM nachfragen.",
    standort: {
      titel: "Die höchsten Erträge Österreichs",
      text: "Innsbruck erreicht nach PVGIS über 1.360 kWh je kWp, Lienz in Osttirol rund 1.320 – Spitzenwerte in Österreich. Im Unterland (Kufstein) sind es etwa 1.110 kWh. Alpine Anlagen brauchen eine Auslegung auf Schneelast nach ÖNORM B 1991-1-3 und Module mit hohen Prüflasten.",
    },
    quellen: [
      { label: "Land Tirol – Speichernachrüstung 2026", url: "https://www.tirol.gv.at/presse/meldungen/meldung/land-tirol-foerdert-2026-nachruestung-von-pv-anlagen-mit-stromspeichern/" },
      { label: "Energieagentur Tirol – Förderübersicht Gemeinden", url: "https://www.energieagentur.tirol/fuer-gemeinden/foerderuebersicht/" },
      PVGIS_QUELLE,
    ],
  },

  vorarlberg: {
    name: "Vorarlberg",
    kuerzel: "V",
    hauptstadt: "Bregenz",
    slugs: ["landesfoerderungen-in-vorarlberg"],
    stand: STAND.iso,
    foerderart: "gezielt",
    ertrag: [1130, 1170],
    ertragOrte: [["Bregenz", 1141], ["Feldkirch", 1134], ["Bludenz", 1170]],
    kurz: "Vorarlberg fördert 2026 PV auf bereits versiegelten Flächen wie Carports und Parkplätzen – für Private und Unternehmen. Normale Dachanlagen fördert das Land nicht.",
    text:
      "Die Förderhöhe für PV auf versiegelten Flächen wird in Sekundärquellen unterschiedlich angegeben, deshalb nennen wir sie nicht. Speicher fördert das Land nicht; der Energieversorger VKW gewährt Einspeisekunden einen Speicherbonus. Besonders gut ist Vorarlberg bei Gemeindeförderungen aufgestellt: Der Förderkompass des Energieinstituts listet rund 150 Programme der Gemeinden.",
    ueberblick: {
      unternehmen: "PV auf versiegelten Flächen (Carport, Parkplatz)",
      landwirtschaft: "kein eigenes Landesprogramm",
      gemeinde: "PV auf versiegelten Flächen",
      privat: "PV auf versiegelten Flächen",
      speicher: "kein Landesprogramm (VKW-Bonus)",
      energiegemeinschaft: "Energieinstitut Vorarlberg",
    },
    programme: [
      {
        name: "PV auf versiegelten Flächen",
        traeger: "Land Vorarlberg",
        zielgruppen: ["unternehmen", "gemeinde", "privat"],
        themen: ["pv-dach"],
        hoehe: "Fördersatz laut aktueller Richtlinie",
        was: "PV-Überdachung von Carports, Parkplätzen und anderen versiegelten Flächen",
        status: "laut Sekundärquellen bis 31.12.2026",
        pruefen: true,
        url: "https://formulare.vorarlberg.gv.at/",
        quelle: "vorarlberg.gv.at",
      },
    ],
    ausgelaufen: [],
    energiegemeinschaften: {
      stelle: "Energieinstitut Vorarlberg",
      url: "https://www.energieinstitut.at",
      text: "Das Energieinstitut berät zu Energiegemeinschaften und Bürgerbeteiligung. Technischer Partner sind die Vorarlberger Energienetze oder das örtliche Stadt- bzw. Gemeindewerk.",
    },
    beratung: [
      { name: "Energieinstitut Vorarlberg", url: "https://www.energieinstitut.at/privatpersonen/foerderkompass", text: "Förderkompass mit rund 150 Gemeindeförderungen; Tel. 05572 31 202-112." },
    ],
    netzbetreiber: [
      { name: "Vorarlberger Energienetze", url: "https://www.vorarlbergnetz.at" },
      { name: "Stadtwerke und E-Werke (z. B. Frastanz)", url: "https://www.ewerke.at" },
    ],
    recht: {
      bauordnung: "Vorarlberger Baugesetz",
      dach: "frei nach § 20 Abs. 2 an bestehenden Bauwerken: integriert oder max. 0,30 m parallel, Abstandsflächen eingehalten; Sonderregel Flachdach; Gemeinden können die Freistellung per Verordnung ausschließen (§ 17)",
      freiflaeche: "Bauanzeige oder Bewilligung je nach Größe; Widmung und Landesgrünzone beachten",
      freiflaechePruefen: true,
      elektrizitaet: "Vbg. Elektrizitätswirtschaftsgesetz § 5: Bewilligung für PV über 500 kWp",
      raumordnung: "Raumplanungsgesetz: Freiflächen nur mit passender Widmung; Landesgrünzone restriktiv",
      ortsbild: "Ortsbildschutz über Gemeindeverordnungen (§ 17 Baugesetz); Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "Raumplanungsgesetz § 15 Abs. 8 lit. e: PV-Pflicht für Einkaufszentren und Handelsbetriebe (bei sonstigen Handelsbetrieben ab 600 m² Verkaufsfläche)",
      ampel: { dach: "frei", freiflaeche: "bewilligung", elektrizitaet: "frei" },
      quellen: [
        { label: "RIS – Vorarlberger Baugesetz § 20", url: "https://www.ris.bka.gv.at/Dokumente/LrVbg/LVB40045020/LVB40045020.html" },
        { label: "RIS – Vbg. Elektrizitätswirtschaftsgesetz § 5", url: "https://www.ris.bka.gv.at/Dokumente/LrVbg/LVB40044973/LVB40044973.html" },
      ],
    },
    gemeinden: "Vorarlberg hat die dichteste Landschaft an Gemeindeförderungen – der Förderkompass des Energieinstituts filtert sie nach Wohnort.",
    standort: {
      titel: "Rheintal, Walgau und Bregenzerwald",
      text: "PVGIS liefert für Bregenz, Feldkirch und Bludenz 1.130–1.170 kWh je kWp. Nebel am Bodensee und Verschattung in engen Tälern drücken den Ertrag lokal, Höhenlagen heben ihn. Eine standortgenaue Ertragsprognose ist hier wichtiger als ein Landesdurchschnitt.",
    },
    quellen: [
      { label: "Energieinstitut Vorarlberg – Förderkompass", url: "https://www.energieinstitut.at/privatpersonen/foerderkompass" },
      PVGIS_QUELLE,
    ],
  },

  kaernten: {
    name: "Kärnten",
    kuerzel: "K",
    hauptstadt: "Klagenfurt",
    slugs: ["landesfoerderungen-in-kaernten"],
    stand: STAND.iso,
    foerderart: "zuschuss",
    ertrag: [1220, 1300],
    ertragOrte: [["Klagenfurt", 1252], ["Villach", 1301], ["Spittal an der Drau", 1223], ["Wolfsberg", 1238]],
    kurz: "Kärnten hat 2026 das breiteste Landesprogramm Österreichs: Zuschüsse für Betriebe (bis 200 €/kWp), Gemeinden und Private – zusätzlich zum EAG-Zuschuss.",
    text:
      "Für Betriebe fördert das Land Eigenverbrauchs-PV mit bis zu 200 €/kWp, höchstens 45 % der Kosten und 500.000 € je Standort; die förderbare Größe richtet sich nach dem Jahresstromverbrauch. Private erhalten eine Pauschale für PV mit Speicher. Die Landesförderung ist „on top“ zum EAG-Zuschuss gedacht, der Antrag folgt erst nach Fertigstellung. Bei Freiflächen setzt die Kärntner Photovoltaikanlagen-Verordnung 2024 enge Grenzen.",
    ueberblick: {
      unternehmen: "bis 200 €/kWp, max. 45 %, max. 500.000 € je Standort",
      landwirtschaft: "Einordnung bei der Förderstelle klären",
      gemeinde: "kommunale PV bis 45 %",
      privat: "3.000 € für PV mit Speicher",
      speicher: "Nachrüstung 1.000 € (Private)",
      energiegemeinschaft: "Bundesstelle, KNG-Kärnten Netz",
    },
    programme: [
      {
        name: "Eigenverbrauchs-PV für Betriebe",
        traeger: "Land Kärnten",
        zielgruppen: ["unternehmen"],
        themen: ["pv-dach"],
        hoehe: "bis 200 €/kWp, max. 45 % der Kosten, max. 500.000 € je Standort",
        was: "Förderbare Anlagengröße nach Jahresstromverbrauch; kombinierbar mit dem EAG-Zuschuss (Formular WT-L48)",
        status: "laufend 2026 – Antrag nach Fertigstellung",
        pruefen: true,
        url: "https://ktn.lko.at/photovoltaik-neuer-f%C3%B6rdercall-gestartet+2400+4411646",
        quelle: "LK Kärnten",
      },
      {
        name: "Kommunale PV-Anlagen",
        traeger: "Land Kärnten",
        zielgruppen: ["gemeinde"],
        themen: ["pv-dach"],
        hoehe: "bis 45 % der Kosten, gestaffelt nach Größe",
        was: "PV auf Gemeindegebäuden und kommunaler Infrastruktur (Formular WT-L47)",
        status: "laufend 2026",
        pruefen: true,
        url: "https://www.ktn.gv.at",
        quelle: "ktn.gv.at",
      },
      {
        name: "PV mit Speicher für Private",
        traeger: "Land Kärnten",
        zielgruppen: ["privat"],
        themen: ["pv-dach", "speicher"],
        hoehe: "3.000 € pauschal (PV ab 5 kWp mit Speicher ab 5 kWh); Mehrparteienhaus +1.500 € je Wohneinheit; Speicher-Nachrüstung 1.000 €",
        was: "Rechnungen ab 01.01.2026, Antrag online nach Fertigstellung",
        status: "Call ab 15.04.2026 – Einreichfrist wird unterschiedlich angegeben",
        pruefen: true,
        url: "https://www.kelag.at/blog/artikel/photovoltaik/22/pv-foerderung-oesterreich-kaernten-aktuelle-foerderungen-im-ueberblick",
        quelle: "LK Kärnten, Kelag",
      },
    ],
    ausgelaufen: [],
    energiegemeinschaften: {
      stelle: "Österreichische Koordinationsstelle für Energiegemeinschaften",
      url: "https://energiegemeinschaften.gv.at",
      text: "Technischer Ansprechpartner für Energiegemeinschaften ist in weiten Teilen Kärntens die KNG-Kärnten Netz.",
    },
    beratung: [
      { name: "Land Kärnten – Energiewirtschaft", url: "https://www.ktn.gv.at", text: "Förderabwicklung und Energieinformation des Landes (Formulare WT-L47, WT-L48)." },
    ],
    netzbetreiber: [{ name: "KNG-Kärnten Netz", url: "https://www.kaerntennetz.at" }],
    recht: {
      bauordnung: "Kärntner Bauordnung 1996 und Kärntner Bauvorschriften",
      dach: "kein eigener PV-Tatbestand in der K-BO 1996; Gemeinden melden PV-Vorhaben der Landesregierung (K-BV § 44i Abs. 2) – Einordnung bei der Baubehörde klären",
      dachPruefen: true,
      freiflaeche: "nur mit Widmung „Grünland – Photovoltaikanlage“ bzw. „Grünland – Agri-Photovoltaikanlage“ (K-PhV 2024 § 5)",
      elektrizitaet: "K-ElWOG 2011 § 6: Genehmigung über 500 kW; PV auf bestehenden baulichen Anlagen ausgenommen; vereinfachtes Verfahren bis 1.000 kW",
      raumordnung: "K-PhV 2024: zusammenhängend max. 4 ha (vorbelastete Flächen bis 10 ha), 1.000 m Mindestabstand zwischen Widmungsflächen; ohne Widmung zulässig u. a. auf Gebäuden, Parkplatzüberdachungen und Agri-PV im Obstbau, bei Geflügelhaltung und Fischzucht",
      ortsbild: "Ortsbild über Bebauungsplan und Gemeinde; Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "keine allgemeine Pflicht im Wohnbau bekannt",
      pvPflichtPruefen: true,
      ampel: { dach: "frei", freiflaeche: "bewilligung", elektrizitaet: "frei" },
      quellen: [
        { label: "RIS – Kärntner Photovoltaikanlagen-Verordnung 2024", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=LrK&Gesetzesnummer=20000941" },
        { label: "RIS – K-ElWOG 2011 § 6", url: "https://www.ris.bka.gv.at/Dokumente/LrK/LKT40019724/LKT40019724.html" },
      ],
    },
    gemeinden: "Einige Kärntner Gemeinden ergänzen die Landesförderung – beim Gemeindeamt nachfragen.",
    standort: {
      titel: "Südlich des Alpenhauptkamms",
      text: "Kärnten liegt nach PVGIS bei 1.220–1.300 kWh je kWp – Villach mit rund 1.300 kWh unter den besten Standorten Österreichs. Viele Sonnenstunden und nebelarme Hochlagen gleichen die kalten Winter aus. Klagenfurter Becken und Lavanttal haben im Winter allerdings häufig Inversionsnebel.",
    },
    quellen: [
      { label: "LK Kärnten – PV-Fördercall 2026", url: "https://ktn.lko.at/photovoltaik-neuer-f%C3%B6rdercall-gestartet+2400+4411646" },
      { label: "ORF Kärnten – Energieförderung 2026", url: "https://kaernten.orf.at/stories/3334737/" },
      PVGIS_QUELLE,
    ],
  },

  steiermark: {
    name: "Steiermark",
    kuerzel: "ST",
    hauptstadt: "Graz",
    slugs: ["landesfoerderungen-in-steiermark"],
    stand: STAND.iso,
    foerderart: "gezielt",
    ertrag: [1170, 1230],
    ertragOrte: [["Graz", 1226], ["Leibnitz", 1218], ["Liezen", 1225], ["Leoben", 1169]],
    kurz: "Die Steiermark fördert 2026 vor allem innovative PV-Doppelnutzung über den Ökofonds – für Betriebe, Gemeinden und Energiegemeinschaften. Der Sanierungsbonus für Private ist ausgeschöpft.",
    text:
      "Der Ökofonds unterstützt PV-Anlagen mit Doppelnutzung ab 20 kWp. Für KMU in der Produktion gibt es über die SFG „Green!Invest“, ohne eigene PV-Schiene. Rechtlich ist die Steiermark klar: PV auf Dach und Fassade ist bewilligungsfrei, auf Freiflächen bis 100 kWp ebenfalls. Große Freiflächen lenkt das Sachprogramm Solarenergie in 36 Vorrangzonen.",
    ueberblick: {
      unternehmen: "Ökofonds: innovative PV-Doppelnutzung; SFG Green!Invest",
      landwirtschaft: "Agri-PV in Vorrangzonen; Ökofonds (Doppelnutzung)",
      gemeinde: "Ökofonds: innovative PV-Doppelnutzung",
      privat: "Sanierungsbonus 2026 ausgeschöpft",
      speicher: "Ökofonds-Speichercall 2026 abgelaufen",
      energiegemeinschaft: "Ökofonds, Landes-Energieberatung",
    },
    programme: [
      {
        name: "Ökofonds: innovative PV-Doppelnutzung",
        traeger: "Land Steiermark",
        zielgruppen: ["unternehmen", "gemeinde", "energiegemeinschaft", "landwirtschaft"],
        themen: ["pv-dach", "agri-pv"],
        hoehe: "bis 30 %, max. 250.000 €, plus Boni",
        was: "PV mit Doppelnutzung ab 20 kWp (z. B. Parkplatz, Agri-PV, Lärmschutz)",
        status: "laut Sekundärquellen bis 31.12.2026",
        pruefen: true,
        url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/",
        quelle: "technik.steiermark.at",
      },
      {
        name: "Green!Invest (SFG)",
        traeger: "Steirische Wirtschaftsförderung SFG",
        zielgruppen: ["unternehmen"],
        themen: ["waermepumpe"],
        hoehe: "max. 35 % der Kosten",
        was: "Investitionen von KMU in Klimaneutralität und Produktion – keine eigene PV-Schiene",
        status: "laufend",
        url: "https://www.sfg.at/f/klimaneutralitaet-die-steirische-investition-in-den-green-deal/",
        quelle: "sfg.at",
      },
    ],
    ausgelaufen: [
      { programm: "Steirischer Sanierungsbonus 2026 (Private)", ende: "laut Sekundärquellen am 22.04.2026 ausgeschöpft", url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/" },
      { programm: "Ökofonds: innovative Energiespeicher", ende: "Einreichfristen 15.01. und 30.04.2026 abgelaufen", url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/" },
    ],
    energiegemeinschaften: {
      stelle: "Energieberatung Land Steiermark",
      url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/",
      text: "Energiegemeinschaften sind beim Ökofonds antragsberechtigt. Technische Partner sind die Energienetze Steiermark bzw. Stromnetz Graz.",
    },
    beratung: [
      { name: "Energieberatung des Landes Steiermark", url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/", text: "Förderübersicht, Ökofonds und Energieberatung." },
    ],
    netzbetreiber: [
      { name: "Energienetze Steiermark", url: "https://www.e-netze.at" },
      { name: "Stromnetz Graz", url: "https://www.stromnetz-graz.at" },
    ],
    recht: {
      bauordnung: "Steiermärkisches Baugesetz",
      dach: "bewilligungsfrei nach § 21 Abs. 1 Z 2 lit. o (Dach, Fassade, vorspringende Bauteile; Höhe max. 3,50 m)",
      freiflaeche: "bis 100 kWp frei (§ 21), über 100 kWp Anzeigeverfahren (§ 20), über 500 kWp Baubewilligung (§ 19)",
      elektrizitaet: "Stmk. ElWOG 2005 § 5 Abs. 2 Z 5: PV samt Speicher bis 1.000 kW genehmigungsfrei",
      raumordnung: "Sachprogramm Solarenergie (LGBl. 52/2023 idF 12/2026): 36 Vorrangzonen; Gemeinden bis 2 ha, in bestimmten Bereichen bis 10 ha; über 10 ha nur in Vorrangzonen (außer Agri-PV); Ausschlusszonen z. B. landwirtschaftliche Vorrangzonen",
      ortsbild: "Grazer Altstadterhaltungsgesetz und Ortsbildschutz; Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "Vorgaben für Neubauten laut Baurecht",
      pvPflichtPruefen: true,
      ampel: { dach: "frei", freiflaeche: "anzeige", elektrizitaet: "frei" },
      quellen: [
        { label: "RIS – Steiermärkisches Baugesetz § 21", url: "https://www.ris.bka.gv.at/Dokumente/LrStmk/LST40035841/LST40035841.html" },
        { label: "RIS – Sachprogramm Erneuerbare Energie – Solarenergie § 3", url: "https://www.ris.bka.gv.at/Dokumente/LrStmk/LST40035653/LST40035653.html" },
        { label: "Land Steiermark – Verfahrenshandbuch PV (08/2025)", url: "https://www.verwaltung.steiermark.at/cms/dokumente/12898224_173036325/f51050a9/Verfahrenshandbuch%20Erneuerbare%20Energie%20PV%20und%20Solaranlagen.pdf" },
      ],
    },
    gemeinden: "Graz fördert Gemeinschaftsanlagen auf Mehrparteienhäusern; weitere steirische Gemeinden haben eigene Programme – beim Gemeindeamt nachfragen.",
    standort: {
      titel: "Sonniger Süden, alpiner Norden",
      text: "Graz und die Südsteiermark liegen nach PVGIS bei gut 1.220 kWh je kWp, auch das Ennstal (Liezen) erreicht diesen Wert. In der Mur-Mürz-Furche (Leoben) sind es rund 1.170 kWh. Hagel ist in der Süd- und Oststeiermark ein Thema – Modulwahl und Versicherung entsprechend planen.",
    },
    quellen: [
      { label: "Land Steiermark – Energieförderungen", url: "https://www.technik.steiermark.at/cms/ziel/58813567/DE/" },
      { label: "SFG – Green!Invest", url: "https://www.sfg.at/f/klimaneutralitaet-die-steirische-investition-in-den-green-deal/" },
      PVGIS_QUELLE,
    ],
  },

  burgenland: {
    name: "Burgenland",
    kuerzel: "B",
    hauptstadt: "Eisenstadt",
    slugs: ["landesfoerderungen-in-burgenland"],
    stand: STAND.iso,
    foerderart: "gezielt",
    ertrag: [1200, 1230],
    ertragOrte: [["Eisenstadt", 1200], ["Neusiedl am See", 1214], ["Oberwart", 1214], ["Jennersdorf", 1230]],
    kurz: "Das Burgenland fördert 2026 private Stromspeicher. Für Betriebe ist derzeit kein Energieprogramm der Wirtschaftsagentur offen – hier trägt der EAG-Zuschuss.",
    text:
      "Die Speicherförderung folgt dem Grundsatz „Bund vor Land“ und wird bis sechs Monate nach Rechnungsdatum beantragt. Die Wirtschaftsagentur Burgenland nimmt für Energie- und Umweltmaßnahmen aktuell keine Anträge an. Bei Freiflächen verlangt das Raumplanungsgesetz Eignungszonen und eine Widmung; das Land erhebt auf große Anlagen eine jährliche Photovoltaikabgabe.",
    ueberblick: {
      unternehmen: "Wirtschaftsagentur: derzeit keine Energie-Einreichung",
      landwirtschaft: "kein eigenes Landesprogramm",
      gemeinde: "–",
      privat: "Stromspeicher",
      speicher: "30 %, max. 100 €/kWh, bis 20 kWh",
      energiegemeinschaft: "Bundesstelle, Netz Burgenland",
    },
    programme: [
      {
        name: "Stromspeicher-Förderung",
        traeger: "Land Burgenland",
        zielgruppen: ["privat"],
        themen: ["speicher"],
        hoehe: "30 % der Kosten, max. 100 €/kWh, bis 20 kWh (max. 2.000 €)",
        was: "Stromspeicher für Private; Grundsatz „Bund vor Land“",
        status: "laut Sekundärquellen bis 31.12.2026, Antrag bis 6 Monate nach Rechnung",
        pruefen: true,
        url: "https://www.burgenland.at/themen/bauen/wohnen/energie-neu/",
        quelle: "burgenland.at",
      },
    ],
    ausgelaufen: [
      { programm: "Wirtschaftsagentur Burgenland: UmweltFit, Energie- und Umweltmaßnahmen", ende: "derzeit keine Antragstellung möglich", url: "https://wirtschaftsagentur-burgenland.at/foerderungen/energieeffizienz/" },
    ],
    energiegemeinschaften: {
      stelle: "Österreichische Koordinationsstelle für Energiegemeinschaften",
      url: "https://energiegemeinschaften.gv.at",
      text: "Freiflächenanlagen von Energiegemeinschaften gelten im Burgenland raumplanerisch als „qualifizierte Nutzung“ und werden bei Eignungszonen besonders berücksichtigt (§ 22d Bgld. RPG 2019).",
    },
    beratung: [
      { name: "Energieberatung Burgenland", url: "https://www.burgenland.at/themen/bauen/wohnen/energie-neu/", text: "Tel. 02682 23 322; Förderhotline Wohnbau 057600/2801." },
    ],
    netzbetreiber: [{ name: "Netz Burgenland", url: "https://www.netzburgenland.at" }],
    recht: {
      bauordnung: "Burgenländisches Baugesetz 1997",
      dach: "vom Baugesetz ausgenommen: PV bis 20 kWp an Gebäuden der Gebäudeklassen 1–3 (parallel oder bis 15° aufgeständert, max. 30 cm) sowie Speicher bis 20 kWh (§ 1 Abs. 3 Z 7); darüber Verfahren, bis 100 kWp Entscheidung binnen einem Monat (§ 18b Abs. 4)",
      freiflaeche: "ohne Eignungszone nur als Hausgartenanlage bis 35 m² (Betriebsgebiet 200 m²); darüber nur in Eignungszonen mit Widmung (§ 22d Bgld. RPG 2019)",
      elektrizitaet: "Bgld. ElWG 2006: Anzeige für PV von 100–500 kWp (§ 7), Genehmigung über 500 kWp (§ 5)",
      raumordnung: "Eignungszonenverordnung für PV-Freiflächen; Photovoltaikabgabe 1.400 € je MW und Jahr (§ 22e Bgld. RPG 2019, Bemessungsgrundlagenverordnung)",
      ortsbild: "Ortsbild über Baugesetz und Bebauungsplan; Denkmalschutz über das Bundesdenkmalamt",
      pvPflicht: "Pflicht für neue Gewerbegebäude laut Sekundärquelle",
      pvPflichtPruefen: true,
      ampel: { dach: "anzeige", freiflaeche: "bewilligung", elektrizitaet: "anzeige" },
      quellen: [
        { label: "RIS – Bgld. Baugesetz 1997 § 1", url: "https://www.ris.bka.gv.at/Dokumente/LrBgld/LBG40027879/LBG40027879.html" },
        { label: "RIS – Bgld. Raumplanungsgesetz 2019 § 22d", url: "https://www.ris.bka.gv.at/Dokumente/LrBgld/LBG40027528/LBG40027528.html" },
      ],
    },
    gemeinden: "Burgenländische Gemeinden erhalten aus der Photovoltaikabgabe 700 € je MW und Jahr. Eigene Gemeindeförderungen für PV gibt es vereinzelt – beim Gemeindeamt nachfragen.",
    standort: {
      titel: "Österreichs Sonnenland im Osten",
      text: "Das Burgenland erreicht nach PVGIS flächendeckend 1.200–1.230 kWh je kWp, vom Neusiedler See bis Jennersdorf. Wenig Relief, wenig Verschattung und große Flächen – dafür eine restriktive Raumplanung, die Freiflächen in Eignungszonen bündelt.",
    },
    quellen: [
      { label: "Land Burgenland – Energie und Förderungen", url: "https://www.burgenland.at/themen/bauen/wohnen/energie-neu/" },
      { label: "Wirtschaftsagentur Burgenland – Energieeffizienz", url: "https://wirtschaftsagentur-burgenland.at/foerderungen/energieeffizienz/" },
      PVGIS_QUELLE,
    ],
  },
};

/** Amtliche Reihenfolge der Bundesländer (Burgenland = 1 … Wien = 9). */
const REIHENFOLGE = ["burgenland", "kaernten", "niederoesterreich", "oberoesterreich", "salzburg", "steiermark", "tirol", "vorarlberg", "wien"];

/** Slug der Landesseite zu einem Länderschlüssel (z. B. "tirol" -> "landesfoerderungen-in-tirol"). */
export function landesSlug(key) {
  return BUNDESLAENDER[key]?.slugs[0] ?? null;
}

/** Pfad der Landesseite zu einem Länderschlüssel. */
export function landesPfad(key) {
  const slug = landesSlug(key);
  return slug ? `/forderungen/landesforderungen/${slug}` : "/forderungen/landesforderungen";
}

/** Alle neun Landesseiten – für generateStaticParams, Sitemap und Verlinkung aus anderen Bereichen. */
export const LAENDER_SLUGS = REIHENFOLGE.map((key) => ({ key, name: BUNDESLAENDER[key].name, slug: landesSlug(key), pfad: landesPfad(key) }));

/** Bundesland-Datensatz zu einem Seiten-Slug; null, wenn unbekannt. */
export function bundeslandFuerSlug(slug) {
  if (!slug) return null;
  return Object.values(BUNDESLAENDER).find((b) => b.slugs.includes(slug)) ?? null;
}

/** Alle Länder als Liste mit Schlüssel und Slug (amtliche Reihenfolge). */
export function alleBundeslaender() {
  return REIHENFOLGE.map((key) => ({ key, ...BUNDESLAENDER[key], slug: landesSlug(key) }));
}

// Kompatibilität: Die deutsche Seite kannte Regionalseiten (Landkreise).
// In Österreich gibt es je Bundesland genau eine Seite.
export const REGIONALSEITEN = {};

/** Seite zu einem Slug auflösen: { typ: "land", key, land } – null, wenn unbekannt. */
export function seiteFuerSlug(slug) {
  const land = bundeslandFuerSlug(slug);
  if (!land) return null;
  const key = Object.keys(BUNDESLAENDER).find((k) => BUNDESLAENDER[k] === land);
  return { typ: "land", key, land };
}

/** Angrenzende Bundesländer – für „Förderung in den Nachbarländern“. */
export const NACHBARN = {
  wien: ["niederoesterreich"],
  niederoesterreich: ["wien", "oberoesterreich", "steiermark", "burgenland"],
  oberoesterreich: ["niederoesterreich", "salzburg", "steiermark"],
  salzburg: ["oberoesterreich", "tirol", "kaernten", "steiermark"],
  tirol: ["vorarlberg", "salzburg", "kaernten"],
  vorarlberg: ["tirol"],
  kaernten: ["tirol", "salzburg", "steiermark"],
  steiermark: ["niederoesterreich", "oberoesterreich", "salzburg", "kaernten", "burgenland"],
  burgenland: ["niederoesterreich", "steiermark"],
};

/** Beschriftung der Rechts-Ampel (Baurecht-Tabelle, Landesseiten). */
export const AMPEL = {
  frei: { label: "frei", lang: "im Regelfall bewilligungs- und anzeigefrei" },
  anzeige: { label: "Anzeige", lang: "ab Schwelle anzeigepflichtig" },
  bewilligung: { label: "Widmung/Bewilligung", lang: "ab Schwelle Widmung bzw. Bewilligung nötig" },
};
