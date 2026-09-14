// src/data/bundeslaender.js
//
// Landesspezifische Förderdaten für die Seiten unter
// /forderungen/landesforderungen/<slug>.
//
// WARUM IM CODE: Die Seiten kamen aus dem Backoffice mit rund 480 Wörtern –
// zu dünn, um zu ranken, und untereinander zu ähnlich. Google indexiert sie
// deshalb nicht. Was fehlt, ist Inhalt, der sich je Bundesland UNTERSCHEIDET.
// Ein bundesweit identischer Textblock würde das Gegenteil bewirken (25 Seiten
// mit demselben Absatz = Near-Duplicates).
//
// PFLEGE: Kommunale Programme sind freiwillige Leistungen und werden oft ohne
// Vorankündigung geschlossen, wenn das Budget ausgeschöpft ist. Deshalb hat
// jeder Eintrag ein `stand`-Datum, das auf der Seite ausgewiesen wird.
// Mindestens vierteljährlich prüfen.

export const BUNDESLAENDER = {


  berlin: {
    name: "Berlin",
    slugs: ["landesfoerderungen-in-berlin"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: true,
      kurz: "Berlin hat mit SolarPLUS eines der stärksten Landesprogramme Deutschlands.",
      text:
        "SolarPLUS wurde zum 8. Januar 2026 mit neuer Struktur wieder für Anträge geöffnet. Das Programm teilt sich in SolarPLUS S für Ein- und Zweifamilienhäuser sowie Reihenhäuser und SolarPLUS L für größere Dächer wie Mehrfamilienhäuser, Gewerbehallen und Industriegebäude. Anders als in den meisten Bundesländern gibt es hier echte Zuschüsse, nicht nur zinsverbilligte Darlehen.",
    },
    kommunal: [
      { ort: "Berlin", programm: "SolarPLUS – PV mit Speicher", hoehe: "500 € (ab 2 kWp) bis 4.750 € (ab 19 kWp)", was: "Photovoltaikanlage in Kombination mit Batteriespeicher", hinweis: "Gestaffelt nach Anlagengröße." },
      { ort: "Berlin", programm: "SolarPLUS – Denkmalschutz", hoehe: "600 € bis 5.700 €", was: "Anlagen auf denkmalgeschützten Gebäuden", hinweis: "Höhere Sätze wegen des Mehraufwands bei der Ausführung." },
      { ort: "Berlin", programm: "SolarPLUS – Zählerschrank", hoehe: "750 € pauschal", was: "Erneuerung des Zählerschranks", hinweis: "Ab 1.160 € Sanierungskosten." },
    ],
    region: {
      titel: "Anlaufstellen in Berlin",
      einleitung: "SolarPLUS ist das eine – die Dachsituation in der Stadt das andere.",
      punkte: [
        { titel: "Investitionsbank Berlin (IBB)", text: "Wickelt SolarPLUS ab und veröffentlicht die jeweils gültigen Fördersätze und Antragsfristen.", quelle: "ibb.de" },
        { titel: "Solaratlas Berlin", text: "Zeigt für jedes Dach im Stadtgebiet die Eignung und den erwartbaren Ertrag – inklusive Verschattung durch Nachbarbebauung.", quelle: "Geoportal Berlin" },
        { titel: "Denkmalschutz mit eigenem Fördersatz", text: "Für geschützte Gebäude zahlt SolarPLUS höhere Sätze, weil Ausführung und Abstimmung aufwendiger sind. Die Genehmigung gehört vor die Bestellung.", quelle: "SolarPLUS-Richtlinie" },
      ],
    },
    standort: {
      titel: "Einstrahlung in Berlin",
      text: "Berlin und das Umland liegen bei etwa 950–1.020 kWh je kWp und damit über dem norddeutschen Durchschnitt. Die eigentliche Herausforderung in der Stadt ist selten die Sonne, sondern die Dachsituation: Verschattung durch Nachbarbebauung und Denkmalschutzauflagen. Für beides gibt es bei SolarPLUS eigene Fördersätze.",
    },
    portal: { name: "Investitionsbank Berlin (IBB)", text: "Wickelt SolarPLUS ab und veröffentlicht die jeweils gültigen Fördersätze." },
  },

  brandenburg: {
    name: "Brandenburg",
    slugs: ["landesfoerderungen-in-brandenburg"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Brandenburg hat 2026 kein Landesprogramm für private Photovoltaik.",
      text:
        "Für private Anlagen und Batteriespeicher gibt es derzeit keine landesweite Förderung. Wer in Brandenburg baut, kombiniert die Bundesförderung mit kommunalen Programmen – die allerdings dünn gesät sind. Die Landeshauptstadt Potsdam ist die bekannteste Ausnahme.",
    },
    kommunal: [
      { ort: "Potsdam", programm: "Städtisches Förderprogramm", hoehe: "rund 200 €/kWp", was: "Photovoltaikanlagen im Stadtgebiet", hinweis: "Konditionen und Budget vor Antragstellung bei der Stadt prüfen." },
    ],
    region: {
      titel: "Anlaufstellen in Brandenburg",
      einleitung: "Ein Landesprogramm fehlt, die Einstrahlung ist dafür eine der besten im Norden.",
      punkte: [
        { titel: "Energieagentur Brandenburg", text: "Neutrale Beratung und Überblick über die kommunalen Programme, die im Flächenland stark schwanken.", quelle: "energieagentur.brandenburg.de" },
        { titel: "Potsdam", text: "Die Landeshauptstadt ist die bekannteste Ausnahme mit einem eigenen Zuschuss je kWp. Budget und Konditionen vor der Bestellung prüfen.", quelle: "Stadt Potsdam" },
        { titel: "Weite, unverschattete Dachflächen", text: "Ausserhalb der Ballungsräume ist Verschattung selten ein Thema. In Kombination mit der hohen Einstrahlung ergeben sich Erträge auf süddeutschem Niveau.", quelle: "Deutscher Wetterdienst" },
      ],
    },
    standort: {
      titel: "Brandenburg liegt sonniger, als viele denken",
      text: "Mit rund 950–1.030 kWh je kWp gehört Brandenburg zu den einstrahlungsstärksten Regionen außerhalb Süddeutschlands – vergleichbar mit Teilen Bayerns. Die weiten, wenig verschatteten Dachflächen außerhalb der Ballungsräume kommen hinzu. Das gleicht das fehlende Landesprogramm wirtschaftlich weitgehend aus.",
    },
    portal: { name: "Energieagentur Brandenburg", text: "Erste Anlaufstelle für kommunale Programme und neutrale Beratung." },
  },

  bremen: {
    name: "Bremen",
    slugs: ["landesfoerderungen-in-bremen"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "In Bremen sind 2026 keine Landes- oder Stadtprogramme für Photovoltaik bekannt.",
      text:
        "Weder für Anlagen noch für Batteriespeicher gibt es im Land Bremen ein laufendes Zuschussprogramm. Die Wirtschaftlichkeit ruht damit vollständig auf den bundesweiten Instrumenten: Nullsteuersatz, Einkommensteuerbefreiung, EEG-Vergütung und den zinsverbilligten KfW-Krediten.",
    },
    region: {
      titel: "Anlaufstellen in Bremen",
      einleitung: "Ohne Zuschussprogramm zählt eine saubere Planung umso mehr. Diese Stellen beraten neutral.",
      punkte: [
        { titel: "Klimaschutzagentur energiekonsens", text: "Unabhängige Beratung für Bremen und Bremerhaven, auch zur Frage, ob sich ein Speicher am jeweiligen Standort rechnet.", quelle: "energiekonsens.de" },
        { titel: "Solarkataster Bremen", text: "Über das Geoportal lässt sich die Eignung der eigenen Dachfläche prüfen, bevor Angebote eingeholt werden.", quelle: "geo.bremen.de" },
        { titel: "Dichte Bebauung beachten", text: "Im Stadtgebiet ist Verschattung durch Nachbargebäude der häufigste Grund für Mindererträge. Eine Verschattungsanalyse gehört in jedes seriöse Angebot.", quelle: "Praxiserfahrung" },
      ],
    },
    standort: {
      titel: "Norddeutsche Einstrahlung – der Eigenverbrauch trägt die Rechnung",
      text: "Bremen liegt bei etwa 850–930 kWh je kWp und damit spürbar unter Süddeutschland. Für die Auslegung heißt das: Je geringer der Ertrag, desto wichtiger wird es, den erzeugten Strom im Haus zu verbrauchen statt ihn zum niedrigen Satz einzuspeisen. Eine Anlage, die auf den eigenen Verbrauch abgestimmt ist, rechnet sich auch hier.",
    },
    portal: { name: "Klimaschutzagentur energiekonsens", text: "Neutrale Energieberatung für Bremen und das Umland." },
  },

  hamburg: {
    name: "Hamburg",
    slugs: ["landesfoerderungen-in-hamburg"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: true,
      kurz: "Hamburg fördert nicht die Anlage selbst, sondern die Kombination mit Dachbegrünung.",
      text:
        "Ein allgemeiner Zuschuss für Photovoltaik existiert 2026 nicht. Gefördert wird stattdessen die Unterkonstruktion von Solaranlagen auf begrünten Dächern – ein Ansatz, der zwei Ziele verbindet: Gründächer kühlen im Sommer und erhöhen dadurch sogar den Modulwirkungsgrad. Wer ohnehin über eine Dachbegrünung nachdenkt, sollte beides zusammen planen.",
    },
    kommunal: [
      { ort: "Hamburg", programm: "Förderung Solar auf Gründach", hoehe: "bis 40 % der Kosten, höchstens 50 €/m²", was: "Unterkonstruktion für PV auf begrünten Dächern", hinweis: "Nur in Kombination mit einer Dachbegrünung." },
    ],
    region: {
      titel: "Anlaufstellen in Hamburg",
      einleitung: "Die Förderung ist an Dachbegrünung gekoppelt – wer das nicht plant, stützt sich auf die Bundesinstrumente.",
      punkte: [
        { titel: "Hamburger Energielotsen", text: "Kostenlose Erstberatung der Verbraucherzentrale zu Photovoltaik, Speicher und Förderung.", quelle: "energielotsen.hamburg" },
        { titel: "Gründach und Photovoltaik zusammen denken", text: "Die Begrünung kühlt das Dach im Sommer und hebt dadurch den Modulwirkungsgrad leicht an. In Hamburg kommt der Zuschuss für die Unterkonstruktion dazu.", quelle: "Förderrichtlinie Hamburg" },
        { titel: "Denkmalschutz in der Innenstadt", text: "In geschützten Ensembles gelten Auflagen zur Sichtbarkeit der Module. Die Abstimmung mit der Denkmalschutzbehörde gehört vor die Bestellung, nicht danach.", quelle: "Denkmalschutzamt Hamburg" },
      ],
    },
    standort: {
      titel: "Einstrahlung im Norden",
      text: "Hamburg liegt bei rund 850–930 kWh je kWp. Der Unterschied zu Süddeutschland ist kleiner, als oft angenommen – etwa 15 Prozent. Entscheidender für die Wirtschaftlichkeit sind Ausrichtung, Verschattung und die Frage, wie viel des Stroms im Haus bleibt.",
    },
    portal: { name: "Hamburger Energielotsen", text: "Kostenlose Erstberatung der Verbraucherzentrale Hamburg." },
  },

  hessen: {
    name: "Hessen",
    slugs: ["landesfoerderungen-in-hessen"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: true,
      kurz: "Hessen fördert über ein zinsverbilligtes Landesdarlehen, nicht über Zuschüsse.",
      text:
        "Das Land stellt Darlehen von mindestens 10.000 bis höchstens 50.000 € je Vorhaben bereit, gedeckelt auf 90 % der Gesamtinvestition. Einen landesweiten Pauschalzuschuss für Batteriespeicher gibt es dagegen nicht. Auf kommunaler Ebene ist Hessen vergleichsweise gut aufgestellt – Frankfurt am Main und Wiesbaden führen eigene Programme.",
    },
    kommunal: [
      { ort: "Frankfurt am Main", programm: "Städtisches Förderprogramm", hoehe: "rund 20 % Zuschuss", was: "Photovoltaikanlagen im Stadtgebiet", hinweis: "Anteilige Förderung der Investitionskosten." },
      { ort: "Wiesbaden", programm: "Kommunale Förderung", hoehe: "laufendes Programm, Konditionen bei der Stadt erfragen", was: "PV-Anlagen und ergänzende Maßnahmen", hinweis: "Budget begrenzt, frühzeitig beantragen." },
    ],
    region: {
      titel: "Anlaufstellen in Hessen",
      einleitung: "Das Land finanziert über Darlehen, die Städte teilweise über echte Zuschüsse.",
      punkte: [
        { titel: "LandesEnergieAgentur Hessen", text: "Neutrale Beratung und Überblick über Landes- und Kommunalprogramme.", quelle: "lea-hessen.de" },
        { titel: "Frankfurt am Main", text: "Mit rund 20 % Zuschuss auf die Investitionskosten eines der attraktiveren kommunalen Programme bundesweit.", quelle: "Stadt Frankfurt" },
        { titel: "Süd- gegen Nordhessen", text: "Die Bergstraße und der Rhein-Main-Raum erreichen deutlich höhere Erträge als die Mittelgebirgslagen im Norden. Für die Auslegung macht das einen spürbaren Unterschied.", quelle: "Deutscher Wetterdienst" },
      ],
    },
    standort: {
      titel: "Einstrahlung in Hessen",
      text: "Hessen liegt mit etwa 900–980 kWh je kWp im bundesweiten Mittelfeld. Die südhessischen Lagen um Darmstadt und die Bergstraße erreichen dabei deutlich bessere Werte als die Mittelgebirgslagen im Norden des Landes.",
    },
    portal: { name: "Wirtschafts- und Infrastrukturbank Hessen (WIBank)", text: "Wickelt die Landesdarlehen ab." },
  },

  "mecklenburg-vorpommern": {
    name: "Mecklenburg-Vorpommern",
    slugs: ["landesfoerderungen-in-mecklenburg-vorpommern"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Für Privathaushalte gibt es in Mecklenburg-Vorpommern kein Landesprogramm.",
      text:
        "Anlagen und Batteriespeicher auf privaten Wohngebäuden werden vom Land nicht bezuschusst. Anders sieht es bei Unternehmen, Vereinen und Kommunen aus: Für diese Gruppen bestehen Fördermöglichkeiten für Stromspeicher. Wer privat baut, ist auf die Bundesinstrumente angewiesen – Nullsteuersatz, EEG-Vergütung und KfW-Darlehen.",
    },
    region: {
      titel: "Anlaufstellen in Mecklenburg-Vorpommern",
      einleitung: "Ohne Privatförderung entscheidet die Auslegung – und an der Küste kommen besondere Anforderungen dazu.",
      punkte: [
        { titel: "Landesenergie- und Klimaschutzagentur MV", text: "Neutrale Beratung zu Auslegung, Netzanschluss und den Programmen, die Unternehmen und Kommunen offenstehen.", quelle: "lena-mv.de" },
        { titel: "Förderung für Unternehmen und Vereine", text: "Was Privathaushalten verwehrt bleibt, steht Betrieben, Vereinen und Kommunen offen: Für Stromspeicher bestehen Fördermöglichkeiten.", quelle: "Landesförderung MV" },
        { titel: "Windlast an der Ostseeküste", text: "Küstennahe Standorte liegen in hohen Windlastzonen. Die Modulbefestigung muss dafür ausgelegt sein – bei Billigangeboten wird genau hier gespart.", quelle: "DIN EN 1991-1-4" },
      ],
    },
    standort: {
      titel: "Küstenlage mit überraschend guten Werten",
      text: "Mecklenburg-Vorpommern erreicht rund 900–1.000 kWh je kWp. Die Ostseeküste gehört zu den einstrahlungsstärksten Gegenden Norddeutschlands – die klare Luft und die geringe Bebauungsdichte gleichen die nördliche Lage teilweise aus.",
    },
    portal: { name: "Landesenergie- und Klimaschutzagentur MV", text: "Beratung zu Förderung und Umsetzung im Land." },
  },

  niedersachsen: {
    name: "Niedersachsen",
    slugs: ["landesfoerderungen-in-niedersachsen"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Ein Landesprogramm für private Photovoltaik ist derzeit nicht antragsfähig.",
      text:
        "Anträge auf eine Landesförderung sind aktuell nicht möglich. Regional gibt es allerdings Ausnahmen – die Region Hannover führt eigene Programme für Anlagen und Speicher. Ausserhalb davon tragen die bundesweiten Instrumente die Wirtschaftlichkeit.",
    },
    kommunal: [
      { ort: "Region Hannover", programm: "Regionale Förderprogramme", hoehe: "laufende Programme, Konditionen bei der Region erfragen", was: "PV-Anlagen und Batteriespeicher", hinweis: "Gilt für das Gebiet der Region Hannover, nicht landesweit." },
    ],
    region: {
      titel: "Anlaufstellen in Niedersachsen",
      einleitung:
        "Ohne Landesprogramm kommt es auf regionale Angebote und eine saubere Auslegung an. Diese Stellen helfen beim Einstieg.",
      punkte: [
        { titel: "Klimaschutz- und Energieagentur Niedersachsen", text: "Neutrale Erstberatung und Überblick über die regional sehr unterschiedlichen Programme im Land.", quelle: "klimaschutz-niedersachsen.de" },
        { titel: "Region Hannover", text: "Die auffälligste Ausnahme im Land: eigene Förderprogramme für Anlagen und Speicher im Gebiet der Region.", quelle: "hannover.de" },
        { titel: "Landwirtschaftliche Dachflächen", text: "Niedersachsen hat überdurchschnittlich viele große, unverschattete Hallendächer. Dort relativiert die schiere Fläche die etwas geringere Einstrahlung.", quelle: "Praxiserfahrung" },
      ],
    },
    standort: {
      titel: "Einstrahlung in Niedersachsen",
      text: "Mit etwa 850–950 kWh je kWp liegt Niedersachsen im norddeutschen Bereich, wobei der Süden des Landes besser abschneidet als die Küstenregion. Große, unverschattete Dachflächen auf landwirtschaftlichen Gebäuden gleichen das vielerorts aus.",
    },
    portal: { name: "Klimaschutz- und Energieagentur Niedersachsen", text: "Neutrale Beratung und Übersicht über regionale Programme." },
  },

  "rheinland-pfalz": {
    name: "Rheinland-Pfalz",
    slugs: ["landesfoerderungen-in-rheinland-pfalz"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Rheinland-Pfalz hat 2026 keine eigene Landesförderung für private Photovoltaik.",
      text:
        "Landesweite Pauschalzuschüsse – auch für Batteriespeicher – sind derzeit ausgesetzt. Auf kommunaler Ebene gibt es dagegen aktive Programme, unter anderem in Mainz und Landau. Ergänzend greifen die bundesweiten Instrumente vom Nullsteuersatz bis zur EEG-Vergütung.",
    },
    kommunal: [
      { ort: "Landau in der Pfalz", programm: "Städtisches Förderprogramm", hoehe: "bis 1.000 €", was: "Photovoltaikanlagen im Stadtgebiet", hinweis: "Budget begrenzt." },
      { ort: "Mainz", programm: "Kommunale Förderung", hoehe: "laufendes Programm, Konditionen bei der Stadt erfragen", was: "PV-Anlagen und ergänzende Maßnahmen", hinweis: "Antrag vor Maßnahmenbeginn stellen." },
    ],
    region: {
      titel: "Anlaufstellen in Rheinland-Pfalz",
      einleitung: "Das Land fördert nicht, die Kommunen teilweise schon – und die Einstrahlung gehört zu den besten bundesweit.",
      punkte: [
        { titel: "Energieagentur Rheinland-Pfalz", text: "Führt das Solarkataster des Landes und gibt einen Überblick über die kommunalen Programme, die häufig wechseln.", quelle: "energieagentur.rlp.de" },
        { titel: "Mainz und Landau", text: "Zwei der aktiveren Städte im Land. Landau zahlt bis zu 1.000 € je Anlage; die Budgets sind begrenzt und meist im Frühjahr am schnellsten ausgeschöpft.", quelle: "Stadtverwaltungen" },
        { titel: "Weinbaulagen am Oberrhein", text: "Die Rheinebene um Landau, Speyer und Worms zählt zu den sonnenreichsten Gegenden Deutschlands – Erträge auf süddeutschem Niveau sind dort realistisch.", quelle: "Deutscher Wetterdienst" },
      ],
    },
    standort: {
      titel: "Der Oberrheingraben ist die Sonnenstube des Westens",
      text: "Rheinland-Pfalz erreicht rund 950–1.020 kWh je kWp, in der Rheinebene um Landau und Speyer sogar mehr. Damit liegen Teile des Landes auf süddeutschem Niveau – ein Standortvorteil, der jedes fehlende Landesprogramm mehr als aufwiegt.",
    },
    portal: { name: "Energieagentur Rheinland-Pfalz", text: "Übersicht über kommunale Programme und Solarkataster." },
  },

  saarland: {
    name: "Saarland",
    slugs: ["landesfoerderungen-in-saarland"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Im Saarland gibt es nach derzeitigem Stand keine Landesförderung für private Photovoltaik.",
      text:
        "Weder für Anlagen noch für Batteriespeicher besteht ein Landesprogramm. Damit bleiben die bundesweiten Instrumente: null Prozent Umsatzsteuer auf Anlage und Speicher, Einkommensteuerbefreiung bis 30 kWp, die EEG-Vergütung über 20 Jahre und der KfW-Kredit 270.",
    },
    region: {
      titel: "Anlaufstellen im Saarland",
      einleitung:
        "Ein Landesprogramm fehlt – die Beratungslandschaft ist dafür überschaubar und gut erreichbar.",
      punkte: [
        { titel: "Verbraucherzentrale Saarland", text: "Kostengünstige Energieberatung, auch als Eignungs-Check Solar vor Ort am Gebäude.", quelle: "verbraucherzentrale-saarland.de" },
        { titel: "Solarkataster Saarland", text: "Das Geoportal des Landes weist die Eignung einzelner Dachflächen und den erwartbaren Ertrag aus.", quelle: "geoportal.saarland.de" },
        { titel: "Kommunale Programme", text: "Einzelne Gemeinden legen zeitweise eigene Zuschüsse auf, oft für Steckersolargeräte. Nachfragen im Rathaus lohnt sich, weil solche Programme selten beworben werden.", quelle: "Gemeindeverwaltungen" },
      ],
    },
    standort: {
      titel: "Gute Einstrahlung im Südwesten",
      text: "Mit etwa 950–1.030 kWh je kWp gehört das Saarland zu den einstrahlungsstärksten Bundesländern – vergleichbar mit Südbayern. Für die Wirtschaftlichkeit einer Anlage zählt dieser Wert über 20 Jahre deutlich mehr als ein einmaliger Zuschuss.",
    },
    portal: { name: "Verbraucherzentrale Saarland", text: "Kostengünstige Energieberatung vor Ort." },
  },

  sachsen: {
    name: "Sachsen",
    slugs: ["landesfoerderungen-in-sachsen"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: true,
      kurz: "Sachsen fördert über die SAB mit einem Kredit, nicht mehr mit Speicherzuschüssen.",
      text:
        "Ein flächendeckendes Landesprogramm für private Heimspeicher gibt es nicht mehr. Die Sächsische Aufbaubank (SAB) bietet stattdessen den „Sachsenkredit Energie und Speicher“ mit vergünstigten Konditionen an. Für Steckersolargeräte zahlt das Land weiterhin einen Zuschuss.",
    },
    kommunal: [
      { ort: "Sachsen (landesweit)", programm: "Zuschuss Steckersolargeräte", hoehe: "300 €", was: "Balkonkraftwerke", hinweis: "Gilt nicht für fest installierte Dachanlagen." },
    ],
    region: {
      titel: "Anlaufstellen in Sachsen",
      einleitung:
        "Wer in Sachsen baut, findet vergleichsweise gut ausgebaute Beratungsstrukturen. Die folgenden Stellen sind unabhängig und kosten nichts oder wenig.",
      punkte: [
        { titel: "Sächsische Energieagentur (SAENA)", text: "Landeseigene Agentur mit neutraler Beratung zu Photovoltaik, Speichern und Förderung. Erste Adresse, bevor Angebote eingeholt werden.", quelle: "saena.de" },
        { titel: "Solarkataster Sachsen", text: "Das Geoportal des Landes zeigt für viele Kommunen die Dacheignung und den zu erwartenden Jahresertrag.", quelle: "geoportal.sachsen.de" },
        { titel: "Kommunale Programme in Dresden und Leipzig", text: "Beide Städte führen zeitweise eigene Programme, häufig für Speicher oder Steckersolargeräte. Da die Budgets begrenzt sind, lohnt die direkte Nachfrage.", quelle: "Stadtverwaltungen" },
        { titel: "Schneelast im Erzgebirge", text: "In den Kammlagen ist die Schneelastzone höher als im Tiefland. Unterkonstruktion und Statik müssen darauf ausgelegt sein – ein Punkt, den günstige Angebote gern übergehen.", quelle: "DIN EN 1991-1-3" },
      ],
    },
    standort: {
      titel: "Einstrahlung in Sachsen",
      text: "Sachsen erreicht etwa 950–1.020 kWh je kWp und liegt damit über dem Bundesdurchschnitt. Die Leipziger Tieflandsbucht schneidet dabei besser ab als die Kammlagen des Erzgebirges, wo Schneelasten zusätzlich in die Auslegung einfließen.",
    },
    portal: { name: "Sächsische Aufbaubank (SAB)", text: "Wickelt Kredit- und Zuschussprogramme des Landes ab." },
  },

  "sachsen-anhalt": {
    name: "Sachsen-Anhalt",
    slugs: ["landesfoerderungen-in-sachsen-anhalt"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Sachsen-Anhalt fördert private Photovoltaik 2026 nicht mehr.",
      text:
        "Eigene Landeszuschüsse für Anlagen oder Speicher bestehen nicht. Das frühere Programm „Sachsen-Anhalt SPEICHERT“ wurde eingestellt und nicht neu aufgelegt. Getragen wird die Wirtschaftlichkeit deshalb von der EEG-Vergütung über 20 Jahre, dem Nullsteuersatz und den KfW-Krediten.",
    },
    kommunal: [
      { ort: "Halle (Saale)", programm: "Kommunale Förderung", hoehe: "laufendes Programm, Konditionen bei der Stadt erfragen", was: "Batteriespeicher und Steckersolargeräte", hinweis: "Keine Förderung für die Dachanlage selbst." },
      { ort: "Magdeburg", programm: "Kommunale Förderung", hoehe: "laufendes Programm, Konditionen bei der Stadt erfragen", was: "Batteriespeicher und Steckersolargeräte", hinweis: "Budget begrenzt, frühzeitig beantragen." },
    ],
    ausgelaufen: [
      { ort: "Land Sachsen-Anhalt", programm: "Sachsen-Anhalt SPEICHERT", ende: "eingestellt", grund: "Ein Nachfolgeprogramm wurde nicht aufgelegt" },
    ],
    region: {
      titel: "Anlaufstellen in Sachsen-Anhalt",
      einleitung: "Das Land selbst fördert nicht mehr – die kommunale Ebene und die Beratung sind deshalb der sinnvolle Einstieg.",
      punkte: [
        { titel: "Landesenergieagentur LENA", text: "Unabhängige Beratung zu Photovoltaik, Speicher und Finanzierung, auch für Bestandsgebäude.", quelle: "lena.sachsen-anhalt.de" },
        { titel: "Halle und Magdeburg", text: "Beide Städte fördern Batteriespeicher und Steckersolargeräte – nicht aber die Dachanlage selbst. Wer beides plant, sollte die Reihenfolge der Anträge klären.", quelle: "Stadtverwaltungen" },
        { titel: "Große Dachflächen in der Börde", text: "Landwirtschaftliche Gebäude bieten hier überdurchschnittlich viel unverschattete Fläche. Die Anlagengröße relativiert die fehlende Landesförderung.", quelle: "Praxiserfahrung" },
      ],
    },
    standort: {
      titel: "Einstrahlung in Sachsen-Anhalt",
      text: "Mit rund 930–1.000 kWh je kWp liegt Sachsen-Anhalt leicht über dem Bundesdurchschnitt. Besonders die Börde und der Süden des Landes erreichen gute Werte bei gleichzeitig großen, unverschatteten Dachflächen.",
    },
    portal: { name: "Investitionsbank Sachsen-Anhalt", text: "Erste Adresse für Landesprogramme und Finanzierung." },
  },

  "schleswig-holstein": {
    name: "Schleswig-Holstein",
    slugs: ["landesfoerderungen-in-schleswig-holstein"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Schleswig-Holstein zahlt 2026 keinen Landeszuschuss für Photovoltaik.",
      text:
        "Das Programm „Klimaschutz für Bürgerinnen und Bürger“ wurde Ende 2023 eingestellt. Auch die beiden größten kommunalen Töpfe des Landes stehen derzeit nicht zur Verfügung. Als Finanzierungsweg bleibt das zinsverbilligte Darlehen der Investitionsbank Schleswig-Holstein (IB.SH), ergänzt um KfW 270, Nullsteuersatz und EEG-Vergütung.",
    },
    ausgelaufen: [
      { ort: "Land Schleswig-Holstein", programm: "Klimaschutz für Bürgerinnen und Bürger", ende: "eingestellt Ende 2023", grund: "Kein Nachfolgeprogramm aufgelegt" },
      { ort: "Kiel", programm: "Städtische Solarförderung", ende: "für das Haushaltsjahr ausgesetzt", grund: "Eine Wiederaufnahme ist offen" },
      { ort: "Elmshorn", programm: "Klimaschutzfonds", ende: "PV-Mittel verbraucht", grund: "Der Fonds wird jährlich neu dotiert" },
    ],
    region: {
      titel: "Anlaufstellen in Schleswig-Holstein",
      einleitung:
        "Ohne Landeszuschuss rücken Finanzierung und eine windlastgerechte Ausführung in den Vordergrund.",
      punkte: [
        { titel: "Verbraucherzentrale Schleswig-Holstein", text: "Unabhängige Energieberatung, auch als Vor-Ort-Termin am Gebäude.", quelle: "verbraucherzentrale.sh" },
        { titel: "IB.SH – Investitionsbank", text: "Vergibt die zinsverbilligten Landesdarlehen für Photovoltaik und Speicher.", quelle: "ib-sh.de" },
        { titel: "Windlast an der Küste", text: "In Küstennähe gelten die höchsten Windlastzonen Deutschlands. Die Modulbefestigung muss darauf ausgelegt sein – ein Punkt, an dem bei Billigangeboten regelmäßig gespart wird.", quelle: "DIN EN 1991-1-4" },
      ],
    },
    standort: {
      titel: "Küstenlage mit viel Wind und mehr Sonne als erwartet",
      text: "Schleswig-Holstein erreicht etwa 850–950 kWh je kWp, an den Küsten am oberen Ende dieser Spanne. Die klare Seeluft und geringe Verschattung gleichen die nördliche Lage teilweise aus. Kühle Umgebungstemperaturen wirken sich zudem günstig auf den Modulwirkungsgrad aus.",
    },
    portal: { name: "Investitionsbank Schleswig-Holstein (IB.SH)", text: "Vergibt die zinsverbilligten Landesdarlehen." },
  },

  thueringen: {
    name: "Thüringen",
    slugs: ["landesfoerderungen-in-thueringen"],
    stand: "2026-09-12",
    landesprogramm: {
      vorhanden: false,
      kurz: "Thüringens Programm SolarInvest ist seit Ende 2022 beendet.",
      text:
        "Die Thüringer Aufbaubank förderte mit „Solar Invest“ seit 2016 zahlreiche Projekte – zum 31. Dezember 2022 lief das Programm aus. Eine landesweite Förderung für private Anlagen oder Speicher gibt es seitdem nicht mehr. Einzelne Städte wie Erfurt und Jena führen eigene Programme; da sich der Stand häufig ändert, lohnt die Nachfrage im Rathaus.",
    },
    ausgelaufen: [
      { ort: "Land Thüringen", programm: "Solar Invest (Thüringer Aufbaubank)", ende: "ausgelaufen zum 31. Dezember 2022", grund: "Zuvor bis zu 900 €/kWp für kleine Anlagen mit Speicher" },
    ],
    region: {
      titel: "Anlaufstellen in Thüringen",
      einleitung:
        "Nach dem Auslaufen von Solar Invest ist die Beratung wichtiger geworden als die Förderrecherche.",
      punkte: [
        { titel: "ThEGA – Servicestelle Solarenergie", text: "Die Landesenergieagentur unterhält eine eigene Stelle für Solarfragen, von der Dacheignung bis zur Netzanmeldung.", quelle: "thega.de" },
        { titel: "Solarrechner Thüringen", text: "Über das Landesportal lässt sich die Eignung der eigenen Dachfläche prüfen, bevor Angebote eingeholt werden.", quelle: "thega.de" },
        { titel: "Erfurt und Jena", text: "Beide Städte haben zeitweise eigene Programme geführt. Der Stand wechselt häufig – eine kurze Nachfrage bei der Stadtverwaltung klärt das zuverlässiger als jede Übersichtsseite.", quelle: "Stadtverwaltungen" },
        { titel: "Höhenlagen im Thüringer Wald", text: "Dort gelten höhere Schneelastzonen. Die Unterkonstruktion muss entsprechend dimensioniert sein, sonst drohen Schäden im ersten strengen Winter.", quelle: "DIN EN 1991-1-3" },
      ],
    },
    standort: {
      titel: "Einstrahlung in Thüringen",
      text: "Thüringen liegt bei rund 930–1.000 kWh je kWp. Das Thüringer Becken erreicht dabei deutlich bessere Werte als die Höhenlagen des Thüringer Waldes, wo neben geringerer Einstrahlung auch Schneelasten in die Statik einfließen.",
    },
    portal: { name: "Thüringer Aufbaubank / ThEGA", text: "Landesförderbank und Energieagentur mit Servicestelle Solarenergie." },
  },

  "baden-wuerttemberg": {
    name: "Baden-Württemberg",
    slugs: ["landesfoerderungen-in-baden-wuerttemberg"],
    stand: "2026-09-12",

    landesprogramm: {
      vorhanden: true,
      kurz: "Baden-Württemberg fördert über zinsgünstige Darlehen, nicht über Zuschüsse.",
      text:
        "Einen direkten Landeszuschuss für Photovoltaik gibt es 2026 nicht. Stattdessen vergibt die L-Bank das Programm „Wohnen mit Zukunft: Photovoltaik“ – ein zinsverbilligtes Darlehen ab 5.000 € für Anlage, Batteriespeicher und zugehörige Investitionen auf selbst genutzten Wohngebäuden. Die früheren Landesprogramme für netzdienliche Speicher aus 2018/19 und 2021 sind ausgelaufen und wurden nicht neu aufgelegt.",
    },

    kommunal: [
      {
        ort: "Stuttgart",
        programm: "Solaroffensive",
        hoehe: "bis 50 %, max. 300 €/kWp (Dach) bzw. 400 €/kWp (Fassade, Gründach); Speicher 100 €/kWh",
        was: "Begleitmaßnahmen rund um die Anlage (Richtlinie ab 01.05.2026)",
        hinweis:
          "Gefördert werden ausdrücklich NICHT Module, Wechselrichter und Montagesysteme, sondern Zählerplatz, Elektroinstallation, Gerüst, Statik, Dacharbeiten und Blitzschutz. Mittel 2026 ausgeschöpft – Anträge weiter möglich, Auszahlung ab 2027.",
      },
      {
        ort: "Heidelberg",
        programm: "Städtisches Förderprogramm",
        hoehe: "100 €/kWp bis 100 kWp",
        was: "Klassische Dachanlagen",
        hinweis:
          "Unter den großen Städten des Landes der einzige reguläre kWp-Zuschuss für normale Dach-PV.",
      },
      {
        ort: "Ulm",
        programm: "Förderung gebäudeintegrierte PV",
        hoehe: "400 €/kWp",
        was: "Gebäudeintegrierte Photovoltaik (Fassade, Dachhaut)",
        hinweis: "Für aufgeständerte Dachanlagen gibt es keinen kWp-Zuschuss mehr.",
      },
      {
        ort: "Freiburg",
        programm: "Klimafreundlich Wohnen – Stromerzeugung erneuerbar",
        hoehe: "150 €/kWp, max. 1.500 € (plus Boni)",
        was: "PV-Dachvollbelegung auf Wohngebäuden",
        hinweis: "Mittel 2026 ausgeschöpft, neue Anträge ab 01.01.2027. Für Anlagen über 30 kWp fördert die Stadt zusätzlich die Netzanschlusserweiterung.",
      },
    ],

    region: {
      titel: "Oberschwaben und Bodenseeraum",
      einleitung:
        "Der Südosten Baden-Württembergs grenzt direkt an unser Einsatzgebiet – Anlagen wie unser Projekt in Ravensburg liegen für uns im normalen Radius. Bei der Einstrahlung ist die Region mit dem Allgäu vergleichbar.",
      punkte: [
        {
          titel: "Solarkataster Baden-Württemberg",
          text: "Das Energieatlas-Portal des Landes zeigt für jedes Dach die Eignung und den zu erwartenden Ertrag – ein sinnvoller erster Schritt vor der Angebotseinholung.",
          quelle: "energieatlas-bw.de",
        },
        {
          titel: "Regionale Energieagenturen",
          text: "In fast jedem Landkreis gibt es eine Energieagentur mit neutraler Erstberatung, unter anderem im Landkreis Ravensburg und im Bodenseekreis.",
          quelle: "Landkreis-Energieagenturen",
        },
      ],
    },

    standort: {
      titel: "Einstrahlung im Süden des Landes",
      text:
        "Oberschwaben und der Bodenseeraum liegen bei rund 950–1.050 kWh je kWp und damit auf dem Niveau Südbayerns. Im Norden des Landes fällt der Wert etwas ab. Für die Wirtschaftlichkeit heißt das: Die Ausrichtung des Dachs und der Eigenverbrauch wiegen schwerer als die Frage, welche Kommune gerade einen Zuschuss zahlt.",
    },

    portal: {
      name: "Energieatlas Baden-Württemberg",
      text: "Das Landesportal bündelt Solarkataster und Förderhinweise nach Standort.",
    },
  },

  "nordrhein-westfalen": {
    name: "Nordrhein-Westfalen",
    slugs: ["landesfoerderungen-in-nordrhein-westfalen"],
    stand: "2026-09-12",

    landesprogramm: {
      vorhanden: true,
      kurz: "progres.NRW läuft – aber in Teilen ausgesetzt. Vor dem Kauf unbedingt den aktuellen Stand prüfen.",
      text:
        "Das Landesprogramm progres.NRW ist nach der Förderrichtlinie vom 20. Mai 2025 bis zum 30. Juni 2027 befristet. Der Stand ist allerdings uneinheitlich: Die Speicherförderung für private Einfamilienhäuser wurde bereits 2022 beendet, und die Förderung von PV mit Batteriespeicher auf kommunalen Gebäuden ist seit dem 29. August 2026 ausgesetzt. Weil sich das kurzfristig ändern kann, sollte der Stand vor jeder Bestellung bei der Bezirksregierung Arnsberg erfragt werden – sie wickelt das Programm ab.",
    },

    kommunal: [
      {
        ort: "Köln",
        programm: "Städtisches Förderprogramm",
        hoehe: "1.500–2.500 € pauschal je nach Anlagengröße, zusätzlich 500–1.300 € für den Speicher",
        was: "Dachanlagen auf Eigenheimen mit und ohne Speicher",
        hinweis:
          "Gedeckelt auf 60 % der förderfähigen Kosten und höchstens 10.000 € je Gebäude und Kalenderjahr. Läuft nach aktuellem Stand bis 31.12.2026.",
      },
      {
        ort: "Münster",
        programm: "Städtische PV-Förderung",
        hoehe: "300 €/kWp neu installierter Leistung",
        was: "Dachanlagen",
        hinweis: "Nur für Erstantragsteller.",
      },
    ],

    ausgelaufen: [
      {
        ort: "Düsseldorf",
        programm: "Klimafreundliches Wohnen und Arbeiten",
        ende: "keine neuen Anträge seit Anfang 2026",
        grund: "Das Programm wird nach Angaben der Stadt überarbeitet",
      },
      {
        ort: "Bonn",
        programm: "Solares Bonn",
        ende: "Mittel 2026 ausgeschöpft",
        grund: "Eine Wiederaufnahme ist offen",
      },
    ],

    region: {
      titel: "Anlaufstellen in Nordrhein-Westfalen",
      einleitung: "Weil progres.NRW in Teilen ausgesetzt ist, lohnt die Prüfung des aktuellen Stands doppelt.",
      punkte: [
        { titel: "Bezirksregierung Arnsberg", text: "Wickelt progres.NRW ab und ist die verlässlichste Quelle dafür, welcher Programmteil gerade antragsfähig ist.", quelle: "bra.nrw.de" },
        { titel: "EnergieAgentur.NRW", text: "Neutrale Beratung und Überblick über die zahlreichen kommunalen Programme im bevölkerungsreichsten Bundesland.", quelle: "energieagentur.nrw" },
        { titel: "Solarkataster NRW", text: "Landesweites Kataster mit Ertragsprognose je Dachfläche – eine der vollständigsten Lösungen bundesweit.", quelle: "solarkataster.nrw" },
      ],
    },
    standort: {
      titel: "Weniger Sonne als im Süden – der Eigenverbrauch entscheidet",
      text:
        "Nordrhein-Westfalen liegt bei der Einstrahlung unter Süddeutschland: Statt der 950–1.050 kWh je kWp im Allgäu sind hier eher 900–950 kWh realistisch. Der Unterschied ist kleiner, als viele vermuten, verschiebt aber das Gewicht: Je niedriger der Ertrag, desto wichtiger wird es, den erzeugten Strom selbst zu verbrauchen statt ihn zum niedrigen Satz einzuspeisen.",
    },

    portal: {
      name: "progres.NRW / Bezirksregierung Arnsberg",
      text: "Abwicklungsstelle des Landesprogramms und erste Adresse für den aktuellen Antragsstand.",
    },
  },

  bayern: {
    name: "Bayern",
    // Slugs, unter denen die Seite im Backoffice geführt wird
    slugs: ["landesfoerderungen-in-bayern"],
    stand: "2026-09-12",

    landesprogramm: {
      vorhanden: false,
      kurz: "Bayern hat 2026 kein eigenes Landesförderprogramm für Photovoltaik.",
      text:
        "Das 10.000-Häuser-Programm des bayerischen Wirtschaftsministeriums lief von 2015 bis 2022. Der PV-Speicher-Baustein wurde am 24. April 2022 eingestellt, nachdem die letzten Antragskontingente ausgeschöpft waren. Ein Nachfolgeprogramm gibt es bis heute nicht. Wer in Bayern fördern lassen möchte, kombiniert deshalb Bundesförderung mit kommunalen Zuschüssen.",
    },

    // Kommunale Programme – der Teil, den kein überregionales Portal pflegt
    kommunal: [
      {
        ort: "Regensburg",
        programm: "Regensburg effizient",
        hoehe: "100 €/kWp, maximal 1.500 € je Gebäude",
        was: "PV-Dachanlagen, Fassade, Garagen und Carports",
        hinweis: "Zuschlag bei Fassadenanlagen und Denkmalschutz möglich.",
      },
      {
        ort: "Würzburg",
        programm: "Kommunales Förderprogramm Klimaschutz",
        hoehe: "bis 5.000 € je Anlage, je nach Baustein",
        was: "Fassaden-PV, Dachbegrünung mit PV, Mehrfamilienhäuser",
        hinweis:
          "Reine Standard-Dachanlagen werden seit 2026 nicht mehr gefördert.",
      },
    ],

    // Ausgelaufene Programme – bewusst genannt, weil viele danach suchen
    ausgelaufen: [
      {
        ort: "Augsburg",
        programm: "Solarförderprogramm",
        ende: "beendet am 15. Dezember 2025",
        grund: "Budget ausgeschöpft, kein Nachfolger angekündigt",
      },
      {
        ort: "München",
        programm: "Klimaneutrale Gebäude (PV-Baustein)",
        ende: "Antragsstopp seit 18. Dezember 2024",
        grund: "Die Beratungsförderung der Stadt läuft weiter",
      },
    ],

    // Regionaler Block – der eigentliche Standortvorteil von Ökovolt
    region: {
      titel: "Förderung und Beratung im Allgäu",
      einleitung:
        "Im Allgäu gibt es aktuell kein kommunales Zuschussprogramm für Photovoltaik. Dafür ist die Beratungslandschaft überdurchschnittlich gut ausgebaut – und der Standort selbst bringt einen Vorteil, der jeden Zuschuss überdauert.",
      punkte: [
        {
          titel: "Landkreis Oberallgäu – Solar-Offensive",
          text: "Kostenloses Solarkataster zur Prüfung der Dacheignung sowie ehrenamtliche Solarbotschafter: Bürger mit eigener PV-Erfahrung, die unabhängig beraten.",
          quelle: "allgaeu-klimaschutz.de",
        },
        {
          titel: "Landkreis Unterallgäu – Solaroffensive",
          text: "Solarkataster für den Landkreis und die Stadt Memmingen, dazu Energieberatungen in Zusammenarbeit mit eza! und der Verbraucherzentrale.",
          quelle: "landratsamt-unterallgaeu.de",
        },
        {
          titel: "Landkreis Ostallgäu",
          text: "Keine landkreisweite PV-Förderung, aber kostenlose Energieberatung. Einzelne Gemeinden fördern Kleinstanlagen – im Rathaus nachfragen lohnt sich.",
          quelle: "landkreis-ostallgaeu.de",
        },
        {
          titel: "eza! Energie- und Umweltzentrum Allgäu",
          text: "Unabhängige Energieberatung und Eignungs-Check Solar, gemeinsam mit der Verbraucherzentrale Bayern. Sitz in Kempten, Burgstraße 26.",
          quelle: "eza-allgaeu.de",
        },
      ],
    },

    standort: {
      titel: "Der Standortvorteil, den keine Förderung ersetzt",
      text:
        "Südbayern und das Allgäu liegen bei der Sonneneinstrahlung deutlich über dem Bundesdurchschnitt. Während eine Anlage in Norddeutschland mit rund 800–900 kWh je kWp rechnet, sind hier 950–1.050 kWh realistisch. Auf 20 Jahre gerechnet wiegt dieser Ertragsunterschied schwerer als die meisten kommunalen Zuschüsse.",
    },

    portal: {
      name: "Energie-Atlas Bayern",
      text: "Das Förderportal des Freistaats listet Programme nach Standort – der schnellste Weg zu prüfen, ob die eigene Gemeinde aktuell etwas anbietet.",
    },
  },
};

/** Bundesland-Datensatz zu einem Seiten-Slug; null, wenn (noch) keiner hinterlegt ist. */
export function bundeslandFuerSlug(slug) {
  if (!slug) return null;
  const treffer = Object.values(BUNDESLAENDER).find((b) =>
    b.slugs.includes(slug)
  );
  return treffer ?? null;
}

// ---------------------------------------------------------------------------
// KARTEN- UND FÖRDER-CHECK-PROFIL
//
// Verdichtete Einordnung je Land für die interaktive Deutschlandkarte und den
// Förder-Check (/foerdercheck). Die Werte leiten sich aus den Texten oben ab –
// bei jeder inhaltlichen Änderung eines Landes hier mitpflegen.
//
// foerderart:
//   "zuschuss"  Landesweiter Zuschuss für private Anlagen verfügbar
//   (Einordnung jeweils aus Sicht privater Eigenheimbesitzer)
//   "darlehen"  Land fördert über zinsverbilligte Darlehen
//   "kommunal"  Kein Landesprogramm, aber aktive kommunale Programme
//   "bund"      Nur Bundesinstrumente (Steuer, EEG, KfW)
// ertrag:       typischer spezifischer Jahresertrag in kWh je kWp [von, bis]
// themen:       Vorhaben, die das Landesprogramm abdeckt (pv, speicher)
// zielgruppen:  eigen = selbst genutztes Wohneigentum, vermieter = Vermieter/MFH/WEG,
//               gewerbe = Unternehmen, Landwirtschaft, Vereine
// ---------------------------------------------------------------------------

export const FOERDERARTEN = {
  zuschuss: { label: "Landeszuschuss", kurz: "Zuschuss" },
  darlehen: { label: "Landesdarlehen", kurz: "Darlehen" },
  kommunal: { label: "Kommunale Programme", kurz: "Kommunal" },
  bund: { label: "Nur Bundesförderung", kurz: "Bund" },
};

export const LAENDER_PROFIL = {
  "baden-wuerttemberg": { kuerzel: "BW", hauptstadt: "Stuttgart", foerderart: "darlehen", ertrag: [950, 1050], programm: { name: "L-Bank „Wohnen mit Zukunft: Photovoltaik“", art: "Darlehen", themen: ["pv", "speicher"], zielgruppen: ["eigen"] } },
  bayern: { kuerzel: "BY", hauptstadt: "München", foerderart: "kommunal", ertrag: [950, 1050], programm: null },
  berlin: { kuerzel: "BE", hauptstadt: "Berlin", foerderart: "zuschuss", ertrag: [950, 1020], programm: { name: "SolarPLUS (IBB)", art: "Zuschuss", themen: ["pv", "speicher"], zielgruppen: ["eigen", "vermieter", "gewerbe"] } },
  brandenburg: { kuerzel: "BB", hauptstadt: "Potsdam", foerderart: "kommunal", ertrag: [950, 1030], programm: null },
  bremen: { kuerzel: "HB", hauptstadt: "Bremen", foerderart: "bund", ertrag: [850, 930], programm: null },
  hamburg: { kuerzel: "HH", hauptstadt: "Hamburg", foerderart: "zuschuss", ertrag: [850, 930], programm: { name: "Förderung Solar auf Gründach", art: "Zuschuss", themen: ["pv"], zielgruppen: ["eigen", "vermieter", "gewerbe"] } },
  hessen: { kuerzel: "HE", hauptstadt: "Wiesbaden", foerderart: "darlehen", ertrag: [900, 980], programm: { name: "Landesdarlehen (WIBank)", art: "Darlehen", themen: ["pv", "speicher"], zielgruppen: ["eigen", "vermieter"] } },
  "mecklenburg-vorpommern": { kuerzel: "MV", hauptstadt: "Schwerin", foerderart: "bund", ertrag: [900, 1000], programm: { name: "Speicherförderung für Unternehmen, Vereine und Kommunen", art: "Zuschuss", themen: ["speicher"], zielgruppen: ["gewerbe"] } },
  niedersachsen: { kuerzel: "NI", hauptstadt: "Hannover", foerderart: "kommunal", ertrag: [850, 950], programm: null },
  "nordrhein-westfalen": { kuerzel: "NW", hauptstadt: "Düsseldorf", foerderart: "kommunal", ertrag: [900, 950], programm: { name: "progres.NRW (teilweise ausgesetzt)", art: "Zuschuss", themen: ["pv", "speicher"], zielgruppen: ["gewerbe", "vermieter"] } },
  "rheinland-pfalz": { kuerzel: "RP", hauptstadt: "Mainz", foerderart: "kommunal", ertrag: [950, 1020], programm: null },
  saarland: { kuerzel: "SL", hauptstadt: "Saarbrücken", foerderart: "bund", ertrag: [950, 1030], programm: null },
  sachsen: { kuerzel: "SN", hauptstadt: "Dresden", foerderart: "darlehen", ertrag: [950, 1020], programm: { name: "Sachsenkredit Energie und Speicher (SAB)", art: "Darlehen", themen: ["pv", "speicher"], zielgruppen: ["eigen", "vermieter", "gewerbe"] } },
  "sachsen-anhalt": { kuerzel: "ST", hauptstadt: "Magdeburg", foerderart: "kommunal", ertrag: [930, 1000], programm: null },
  "schleswig-holstein": { kuerzel: "SH", hauptstadt: "Kiel", foerderart: "darlehen", ertrag: [850, 950], programm: { name: "Zinsverbilligtes Darlehen (IB.SH)", art: "Darlehen", themen: ["pv", "speicher"], zielgruppen: ["eigen", "vermieter", "gewerbe"] } },
  thueringen: { kuerzel: "TH", hauptstadt: "Erfurt", foerderart: "bund", ertrag: [930, 1000], programm: null },
};

/** Alle Länder als sortierte Liste mit Schlüssel, Stammdaten und Profil. */
export function alleBundeslaender() {
  return Object.entries(BUNDESLAENDER)
    .map(([key, land]) => ({ key, ...land, ...LAENDER_PROFIL[key], slug: land.slugs[0] }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
}

/** Themen eines kommunalen Programms aus dem Freitext ableiten (pv, speicher, balkon). */
export function themenFuerProgramm(k) {
  const t = `${k.programm} ${k.was}`.toLowerCase();
  const themen = [];
  const nurBalkon = /steckersolar|balkon/.test(t) && !/dach|photovoltaikanlage|pv-anlage|pv-dach|fassade|anlagen im/.test(t);
  if (/speicher/.test(t)) themen.push("speicher");
  if (/steckersolar|balkon/.test(t)) themen.push("balkon");
  if (!nurBalkon && /photovoltaik|pv|dach|solar|fassade|anlage|zählerschrank|begleitmaßnahmen/.test(t.replace(/steckersolargeräte/g, ""))) themen.push("pv");
  return themen;
}

// Regionale Unterseiten (Landkreis / Gemeinde) – im Backoffice als eigene
// Einträge geführt. Sie gehören zu einem Land, haben aber keinen eigenen
// Landesdatensatz. `landkreis` steuert, welche regionalen Anlaufstellen passen,
// `geo` [Länge, Breite] die Markierung auf der Mini-Karte.
export const REGIONALSEITEN = {
  "landesfoerderungen-in-bayern-landkreis-ostallgaeu": { name: "Landkreis Ostallgäu", geo: [10.62, 47.78], land: "bayern", landkreis: "Ostallgäu", plz: ["86807", "87616", "87629", "87645"] },
  "landesfoerderungen-in-tuerkheim": { name: "Türkheim", geo: [10.64, 48.06], land: "bayern", landkreis: "Unterallgäu", plz: ["86842"] },
  "landesfoerderungen-in-buchloe": { name: "Buchloe", geo: [10.72, 48.03], land: "bayern", landkreis: "Ostallgäu", plz: ["86807"] },
  "landesfoerderungen-in-bad-woerishofen": { name: "Bad Wörishofen", geo: [10.6, 48.01], land: "bayern", landkreis: "Unterallgäu", plz: ["86825"] },
  "landesfoerderungen-in-landsberg-am-lech": { name: "Landsberg am Lech", geo: [10.88, 48.05], land: "bayern", landkreis: "Landsberg am Lech", plz: ["86899"] },
};

/**
 * Seite zu einem Slug auflösen: Landesseite ODER Regionalseite.
 * { typ: "land" | "region", key, land, region? } – null, wenn unbekannt.
 */
export function seiteFuerSlug(slug) {
  const land = bundeslandFuerSlug(slug);
  if (land) {
    const key = Object.keys(BUNDESLAENDER).find((k) => BUNDESLAENDER[k] === land);
    return { typ: "land", key, land, profil: LAENDER_PROFIL[key] };
  }
  const region = REGIONALSEITEN[slug];
  if (region) {
    return { typ: "region", key: region.land, land: BUNDESLAENDER[region.land], profil: LAENDER_PROFIL[region.land], region };
  }
  return null;
}

/** Angrenzende Bundesländer – für „Förderung in den Nachbarländern“. */
export const NACHBARN = {
  "baden-wuerttemberg": ["bayern", "hessen", "rheinland-pfalz"],
  bayern: ["baden-wuerttemberg", "hessen", "thueringen", "sachsen"],
  berlin: ["brandenburg"],
  brandenburg: ["berlin", "mecklenburg-vorpommern", "niedersachsen", "sachsen-anhalt", "sachsen"],
  bremen: ["niedersachsen"],
  hamburg: ["schleswig-holstein", "niedersachsen"],
  hessen: ["nordrhein-westfalen", "niedersachsen", "thueringen", "bayern", "baden-wuerttemberg", "rheinland-pfalz"],
  "mecklenburg-vorpommern": ["schleswig-holstein", "niedersachsen", "brandenburg"],
  niedersachsen: ["schleswig-holstein", "hamburg", "bremen", "mecklenburg-vorpommern", "brandenburg", "sachsen-anhalt", "thueringen", "hessen", "nordrhein-westfalen"],
  "nordrhein-westfalen": ["niedersachsen", "hessen", "rheinland-pfalz"],
  "rheinland-pfalz": ["nordrhein-westfalen", "hessen", "baden-wuerttemberg", "saarland"],
  saarland: ["rheinland-pfalz"],
  sachsen: ["brandenburg", "sachsen-anhalt", "thueringen", "bayern"],
  "sachsen-anhalt": ["niedersachsen", "brandenburg", "sachsen", "thueringen"],
  "schleswig-holstein": ["hamburg", "niedersachsen", "mecklenburg-vorpommern"],
  thueringen: ["niedersachsen", "sachsen-anhalt", "sachsen", "bayern", "hessen"],
};
