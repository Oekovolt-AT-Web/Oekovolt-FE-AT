// Ratgeber: Blackout-Vorsorge für Unternehmen und Gemeinden (Österreich)
// Quellen: GfKV-Leitfaden Blackout-Vorsorge in Unternehmen (03/2024: Definition, 3 Phasen, Stromausfall in
// Österreich 10–48 h erwartet, 14 Tage Selbstversorgung), saurugg.net, KFV (Blackout-Umfrage, 2 Wochen Vorsorge),
// Zivilschutzverband Steiermark (Blackout-Vorsorgeplan Gemeinde), ENTSO-E (Systemauftrennung 08.01.2021;
// Iberischer Blackout 28.04.2025, Final Report 20.03.2026), TOR Stromerzeugungsanlagen Typ A V1.4 (Ersatzstrom).

const artikel = {
  slug: "blackout-vorsorge-unternehmen",
  title: "Blackout-Vorsorge für Unternehmen und Gemeinden: Plan und Checkliste",
  seoTitle: "Blackout-Vorsorge Unternehmen & Gemeinden | Ökovolt",
  kurzTitel: "Blackout-Vorsorge",
  description:
    "Blackout-Vorsorge für Unternehmen und Gemeinden in Österreich: Phasen eines Blackouts, Krisenplan, Notstrom mit PV und Speicher, Treibstoff und Checkliste.",
  excerpt:
    "Ein Blackout ist mehr als ein langer Stromausfall: Telekommunikation, Logistik und Versorgung fallen tagelang aus. Wie Betriebe und Gemeinden sich vorbereiten – organisatorisch und technisch, mit PV, Speicher und Ersatzstrom.",
  hauptKeyword: "blackout vorsorge unternehmen",
  keywords: [
    "Blackout Vorsorge Unternehmen",
    "Blackout Österreich",
    "Blackout Gemeinde Vorsorgeplan",
    "Krisenplan Stromausfall Betrieb",
    "Notstrom Blackout Photovoltaik",
    "Blackout Landwirtschaft",
    "Business Continuity Stromausfall",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/blackout-vorsorge-unternehmen.jpg",
  bildAlt: "Mobiles Notstromaggregat im Container vor einem Gebäude bei Nacht",
  badge: { wert: "10–48 h", text: "erwartete Dauer des Stromausfalls in Österreich bei einem Blackout (GfKV)" },

  kurzFazit: [
    "**Ein Blackout ist ein plötzlicher, überregionaler und länger andauernder Strom-, Infrastruktur- und Versorgungsausfall – kein gewöhnlicher Stromausfall.** Telekommunikation, Zahlungsverkehr, Treibstoff- und Lebensmittellogistik fallen mit aus und brauchen länger als der Strom, um wieder zu funktionieren.",
    "**Für Österreich rechnet die Gesellschaft für Krisenvorsorge mit 10 bis 48 Stunden Stromausfall** – die Versorgung mit Gütern und Kommunikation kann danach noch Tage gestört sein. Empfohlen wird, dass sich Mitarbeitende mindestens 14 Tage selbst versorgen können.",
    "**Dass das europäische Netz verwundbar ist, zeigen reale Ereignisse:** die Systemauftrennung Kontinentaleuropas am 8. Jänner 2021 und der Blackout auf der Iberischen Halbinsel am 28. April 2025, laut ENTSO-E das schwerste Ereignis im europäischen Stromsystem seit über 20 Jahren.",
    "**Technisch hilft PV im Blackout nur mit Ersatzstromfähigkeit:** netzbildender Speicher, automatische Netztrennung, Schwarzstart – und für Winter und Nächte ein Aggregat. Organisatorisch zählen Krisenstab, Kommunikation ohne Handy und klare Abläufe.",
  ],

  abschnitte: [
    {
      id: "definition",
      titel: "Was ist ein Blackout – und was unterscheidet ihn vom Stromausfall?",
      tocLabel: "Definition",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Blackout ist ein großflächiger Ausfall, der mehrere Staaten oder große Teile eines Staatsgebiets betrifft und bei dem Hilfe von außen kaum zu erwarten ist, weil alle im Umfeld selbst betroffen sind.** Der regionale Stromausfall nach einem Sturm dauert dagegen meist Minuten bis Stunden, die Nachbarregionen funktionieren, und Einsatzkräfte können von außen helfen. Der Begriff [Blackout](/wissen/lexikon#blackout) ist im Lexikon erklärt.",
        },
        {
          typ: "tabelle",
          caption: "Regionaler Stromausfall und Blackout im Vergleich",
          kopf: ["Merkmal", "Regionaler Stromausfall", "Blackout"],
          zeilen: [
            ["Ausdehnung", "Ortsnetz, Bezirk, Region", "mehrere Staaten bzw. großer Teil des Staatsgebiets"],
            ["Dauer Strom", "Minuten bis Stunden", "in Österreich erwartet 10–48 h, regional länger"],
            ["Telekommunikation", "Mobilfunk teils mit Batteriepufferung verfügbar", "fällt innerhalb kurzer Zeit weitgehend aus, Wiederanlauf dauert länger als beim Strom"],
            ["Hilfe von außen", "möglich", "kaum, alle sind betroffen"],
            ["Folgen", "lokal begrenzt", "Logistik, Zahlungsverkehr, Treibstoff, Wasser/Abwasser, Gesundheit"],
          ],
          minBreite: 620,
          fussnote: "Quelle: Gesellschaft für Krisenvorsorge (GfKV), Leitfaden für die Blackout-Vorsorge in Unternehmen und Organisationen, Stand März 2024.",
        },
        {
          typ: "p",
          text: "Die Netzbetreiber, allen voran der österreichische Übertragungsnetzbetreiber APG, halten Pläne zum Netzwiederaufbau mit schwarzstartfähigen Kraftwerken vor. Österreich ist mit seinen Speicher- und Pumpspeicherkraftwerken dafür gut aufgestellt – dennoch dauert es, bis Netze, Verbraucher und Kommunikation stabil wieder am Netz sind.",
        },
      ],
    },
    {
      id: "risiko",
      titel: "Wie realistisch ist ein Blackout in Österreich?",
      tocLabel: "Wie realistisch?",
      bloecke: [
        {
          typ: "p",
          text: "**Niemand hält einen Blackout für unmöglich, und mehrere Ereignisse der letzten Jahre zeigen, wie nah das europäische Verbundnetz an kritischen Situationen war.** Entscheidend für die Vorsorge ist nicht die geringe Eintrittswahrscheinlichkeit, sondern der sehr hohe Schaden, wenn es passiert – ähnlich wie bei einer Versicherung.",
        },
        {
          typ: "tabelle",
          caption: "Reale Großstörungen im europäischen Stromnetz",
          kopf: ["Datum", "Ereignis", "Kennzahlen (ENTSO-E)"],
          zeilen: [
            ["8. Jänner 2021", "Systemauftrennung Kontinentaleuropas, ausgelöst in einem Umspannwerk in Kroatien", "Frequenz im Nordwesten fiel binnen 15 Sekunden auf 49,74 Hz; rund 1,7 GW unterbrechbare Lasten in Frankreich und Italien abgeschaltet; Resynchronisation nach rund 62 Minuten"],
            ["28. April 2025", "Blackout in Spanien und Portugal", "Beginn 12:33 Uhr; laut ENTSO-E schwerstes Ereignis im europäischen Stromsystem seit über 20 Jahren; Spannungsanstieg und kaskadierende Erzeugungsabschaltungen; Abschlussbericht 20. März 2026"],
          ],
          minBreite: 680,
        },
        {
          typ: "p",
          text: "Die Gesellschaft für Krisenvorsorge nennt als Treiber steigender Risiken eine nicht systemisch vorangetriebene Energiewende, zunehmende Extremwetterereignisse sowie die steigende Vernetzung und Digitalisierung mit Cyberrisiken. Das Kuratorium für Verkehrssicherheit (KFV) kam in einer Befragung zum Schluss, dass die meisten Menschen unzureichend vorbereitet sind – ein Drittel kannte den Begriff Blackout nicht. Für Unternehmen heißt das: Auch Mitarbeitende, Lieferanten und Kunden sind im Ernstfall mit sich selbst beschäftigt.",
        },
      ],
    },
    {
      id: "phasen",
      titel: "Die drei Phasen eines Blackouts",
      tocLabel: "Drei Phasen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Blackout verläuft in drei Phasen: Stromausfall und Stillstand, anhaltender Ausfall der Telekommunikation, und ein langer Wiederanlauf der Versorgung.** Viele Pläne konzentrieren sich nur auf Phase 1 – das greift zu kurz, weil gerade Phase 2 und 3 über die Handlungsfähigkeit eines Betriebs entscheiden.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Phase 1: Stromausfall", text: "In Österreich 10 bis 48 Stunden erwartet, regional länger. Produktion, Kühlung, Heizung, Pumpen, IT und Zutrittssysteme stehen – sofern keine Ersatzstromversorgung vorhanden ist." },
            { titel: "Phase 2: keine Kommunikation", text: "Mobilfunk, Festnetz und Internet sind nach Rückkehr des Stroms noch Tage gestört. Bestellungen, Zahlungen, Fernwartung und Logistik funktionieren nicht." },
            { titel: "Phase 3: Wiederanlauf", text: "Lieferketten, Treibstoff- und Lebensmittelversorgung normalisieren sich schrittweise. Anlagen sollten erst bei stabilem Netz wieder hochgefahren werden." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Erst stabil, dann hochfahren",
          text: "Beim Netzwiederaufbau schwanken Spannung und Frequenz. Wer Maschinen, Kälteanlagen und IT sofort wieder einschaltet, riskiert Schäden und belastet das Netz zusätzlich. Legen Sie eine Reihenfolge für das Wiederhochfahren fest und schalten Sie große Verbraucher vor dem Ausfall-Ende gezielt ab.",
        },
      ],
    },
    {
      id: "unternehmen",
      titel: "Krisenplan für Unternehmen: Was vorbereitet sein muss",
      tocLabel: "Krisenplan Unternehmen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Blackout-Vorsorgeplan beantwortet vorab die Fragen, die im Ernstfall ohne Telefon und Internet niemand mehr klären kann: Wer entscheidet, wer kommt in den Betrieb, was wird sicher abgeschaltet, was muss weiterlaufen?** Grundlage ist die persönliche Vorsorge der Mitarbeitenden – wer die eigene Familie versorgt weiß, kommt eher zur Arbeit.",
        },
        {
          typ: "tabelle",
          caption: "Bausteine eines Blackout-Vorsorgeplans für Betriebe",
          kopf: ["Baustein", "Inhalt"],
          zeilen: [
            ["Alarmierung & Erkennen", "Wie wird ein Blackout erkannt (eigene Versorgung, Umgebung, Erreichbarkeit, Radio)? Batteriebetriebenes Radio bereithalten."],
            ["Krisenstab", "Wer entscheidet vor Ort, Vertretungen, Treffpunkt, Schichtregelung; Aushang mit Abläufen."],
            ["Personal", "Wer kommt ohne Aufforderung in den Betrieb (Schlüsselfunktionen), wer bleibt zu Hause; Eigenvorsorge der Mitarbeitenden für 14 Tage fördern."],
            ["Sicheres Herunterfahren", "Prozesse, die definiert gestoppt werden müssen (Öfen, Chemie, Lebensmittel, IT), Reihenfolge und Zuständige."],
            ["Kritische Versorgung", "Kühlketten, Tiere, Sicherheitseinrichtungen, Zutritt, Brandmeldeanlage – mit Ersatzstrom oder organisatorisch."],
            ["Kommunikation", "Informationswege ohne Mobilfunk: Aushänge, Anlaufstellen, ggf. Funk; Absprachen mit Gemeinde und Nachbarbetrieben."],
            ["Ressourcen", "Treibstoff für Aggregat und Fahrzeuge, Wasser, Taschenlampen, Bargeld für Notfälle, Erste Hilfe, Papierunterlagen."],
            ["Wiederanlauf", "Reihenfolge der Inbetriebnahme, Prüfung von Anlagen, Kontakt mit Kunden und Lieferanten."],
          ],
          minBreite: 640,
        },
        {
          typ: "p",
          text: "Die Gesellschaft für Krisenvorsorge stellt einen frei nutzbaren Leitfaden für Unternehmen bereit, der sich nach dem 80:20-Prinzip rasch umsetzen lässt. Betriebe mit komplexen Produktionsprozessen brauchen zusätzliche, anlagenspezifische Abklärungen – etwa mit Sicherheitsfachkraft, Versicherung und Anlagenhersteller.",
        },
      ],
    },
    {
      id: "gemeinden",
      titel: "Blackout-Vorsorge für Gemeinden",
      tocLabel: "Gemeinden",
      bloecke: [
        {
          typ: "p",
          text: "**Gemeinden sind im Blackout die erste Anlaufstelle für die Bevölkerung – ohne Telefon kommen die Menschen zum Gemeindeamt, zur Feuerwehr oder zu vorbereiteten Anlaufstellen.** Die Zivilschutzverbände der Länder stellen Vorlagen für Blackout-Vorsorgepläne von Gemeinden bereit; etwa der Zivilschutzverband Steiermark mit einem Gemeinde-Vorsorgeplan.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Krisenstab der Gemeinde** mit Bürgermeister, Amtsleitung, Feuerwehr, Bauhof, Ärzten und Pflege; Treffpunkt und Vertretungen festlegen.",
            "**Anlaufstellen (Selbsthilfe-Basen)** in Feuerwehrhaus, Gemeindeamt oder Schule – mit Ersatzstrom für Licht, Heizung, Funk und Ladestationen.",
            "**Wasserversorgung und Abwasser:** Pumpen, Hochbehälter, Kläranlage – Überbrückungszeiten kennen, Aggregate oder Ersatzstrom vorsehen.",
            "**Pflegeheime, betreutes Wohnen, Heimbeatmete:** Verzeichnis und Abläufe für vulnerable Personen.",
            "**Landwirtschaft:** Tierhaltende Betriebe erfassen, Aggregate und Treibstoff koordinieren.",
            "**Treibstoff:** Vorrat und Verteilung für Einsatzfahrzeuge und Aggregate; Tankstellen funktionieren ohne Strom nicht.",
            "**Information der Bevölkerung:** Aushänge, Lautsprecherdurchsagen, vorbereitete Informationsblätter.",
          ],
        },
        {
          typ: "p",
          text: "PV-Anlagen auf Gemeindegebäuden können hier doppelt nutzen: Im Alltag senken sie die Energiekosten, im Krisenfall versorgen sie – mit Speicher und Ersatzstromfunktion – Anlaufstellen und Feuerwehrhäuser. Mehr unter [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde) und auf der Seite [Kommunen](/kommunen).",
        },
      ],
    },
    {
      id: "technik",
      titel: "Welche Rolle spielen PV, Speicher und Aggregat?",
      tocLabel: "PV, Speicher, Aggregat",
      bloecke: [
        {
          typ: "p",
          text: "**PV und Speicher helfen im Blackout nur, wenn sie ersatzstromfähig geplant sind – also bei Netzausfall automatisch vom Netz trennen, ein eigenes Inselnetz bilden und aus dem stromlosen Zustand starten können.** Eine gewöhnliche netzgekoppelte PV-Anlage schaltet bei Netzausfall ab. Wie eine normgerechte Ersatzstromversorgung nach TOR und OVE E 8101 aufgebaut ist, beschreibt der Ratgeber [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik).",
        },
        {
          typ: "tabelle",
          caption: "Technische Optionen für die Blackout-Vorsorge im Vergleich",
          kopf: ["Lösung", "Stärken", "Grenzen"],
          zeilen: [
            ["USV (Batterie vor Einzelverbrauchern)", "unterbrechungsfrei für IT und Steuerungen", "kurze Überbrückung, keine großen Lasten"],
            ["PV + Speicher mit Ersatzstrom", "leise, emissionsfrei, lädt tagsüber nach, im Alltag wirtschaftlich (Eigenverbrauch, Peak Shaving)", "im Winter und nachts begrenzt; Leistung für Anlaufströme planen"],
            ["Notstromaggregat", "hohe Leistung, unabhängig vom Wetter", "Treibstofflogistik, Wartung, Lärm und Abgase; im Alltag ungenutzt"],
            ["Kombination PV + Speicher + Aggregat", "robust über Tage, Aggregat läuft kürzer, spart Treibstoff", "abgestimmte Regelung und Verriegelung nötig"],
          ],
          minBreite: 640,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Ohne Kommunikation keine Fernwartung",
          text: "Im Blackout fällt auch das Internet aus. Systeme, die nur über Cloud oder App bedienbar sind, müssen vor Ort manuell steuerbar sein. Legen Sie fest, wer die Ersatzstromanlage lokal bedienen darf, und halten Sie Anleitungen in Papierform bereit. Unsere [Fernwartung](/technik/fernwartung) ist für den Alltag gedacht – für den Krisenfall braucht es zusätzlich lokale Bedienbarkeit.",
        },
        {
          typ: "p",
          text: "Für Betriebe mit Tierhaltung, Kühlung oder sicherheitsrelevanten Prozessen ist die Kombination aus [Gewerbespeicher](/gewerbespeicher), PV und Aggregat meist die robusteste Lösung. Der Speicher überbrückt die ersten Minuten bis Stunden unterbrechungsarm, das Aggregat übernimmt bei Bedarf, und die PV reduziert tagsüber den Treibstoffverbrauch. Mehr zur Landwirtschaft unter [Photovoltaik für die Landwirtschaft](/landwirtschaft).",
        },
      ],
    },
    {
      id: "branchen",
      titel: "Branchenbeispiele: Wo der Blackout am teuersten wird",
      tocLabel: "Branchenbeispiele",
      bloecke: [
        {
          typ: "p",
          text: "**Am verwundbarsten sind Betriebe, bei denen ein Ausfall nach wenigen Stunden irreversible Schäden verursacht – Tiere, Kühlware, laufende Prozesse und Gäste.** Hier lohnt sich eine technische Ersatzstromlösung fast immer; bei reinen Bürobetrieben genügt oft ein organisatorischer Plan mit USV für die IT.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Landwirtschaft", text: "Stalllüftung, Tränke, Melken und Milchkühlung dulden kaum Aufschub. Aggregat mit Zapfwelle oder fest installiert, kombiniert mit PV und Speicher, dazu Treibstoffvorrat und geübte Abläufe." },
            { titel: "Lebensmittelhandel & Gastronomie", text: "Kühl- und Tiefkühlzellen halten geschlossen einige Stunden. Temperaturprotokoll, Türdisziplin und Priorisierung der Kühlstellen entscheiden, wie viel Ware gerettet wird." },
            { titel: "Hotellerie & Bergbahnen", text: "Gäste brauchen Licht, Wärme, Wasser und Information; Aufzüge und Seilbahnen müssen sicher evakuiert werden. Notbeleuchtung und Evakuierungskonzepte sind gesetzlich geregelt – Ersatzstrom für den Weiterbetrieb ist eine zusätzliche Entscheidung. Mehr unter [Hotellerie & Tourismus](/hotellerie-tourismus)." },
            { titel: "Produktion", text: "Ziel ist meist nicht Weiterproduzieren, sondern sicheres Stillsetzen: Öfen, Chemie, Druckluft und Steuerungen definiert herunterfahren, Daten sichern, Anlagen vor dem Wiederanlauf prüfen." },
          ],
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Blackout-Vorsorge im Betrieb",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Blackout-Szenario im Betrieb durchgedacht: Was passiert in der ersten Stunde, am ersten Tag, in der ersten Woche?",
            "Krisenstab, Vertretungen und Treffpunkt festgelegt, Ablaufplan als Papierausdruck an bekannten Stellen.",
            "Mitarbeitende über Eigenvorsorge informiert (Wasser, Lebensmittel, Medikamente, Licht, Radio für 14 Tage).",
            "Liste kritischer Prozesse und Verbraucher mit Priorität, Leistung und zulässiger Ausfallzeit.",
            "Sicheres Herunterfahren und Reihenfolge für das Wiederhochfahren dokumentiert.",
            "Ersatzstromversorgung vorhanden und getestet (Speicher, Umschalter, Aggregat), lokal bedienbar.",
            "Treibstoffvorrat für Aggregat und Fahrzeuge, Lagerung nach Brandschutzvorgaben.",
            "Kühlketten, Tierversorgung, Wasser und Abwasser im Betrieb abgesichert.",
            "Absprachen mit Gemeinde, Nachbarbetrieben, Lieferanten und Schlüsselkunden getroffen.",
            "Jährliche Übung und Aktualisierung des Plans, Ergebnisse dokumentiert.",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt unterstützt Betriebe und Gemeinden bei der technischen Seite der [Notstrom- und Blackout-Vorsorge](/service/notstrom): Lastanalyse, Speicher- und Ersatzstromkonzept, Abstimmung mit dem Netzbetreiber, Errichtung und Test. Das organisatorische Krisenkonzept bleibt Aufgabe des Betriebs – idealerweise mit Unterstützung des Zivilschutzverbands Ihres Bundeslands.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie lange dauert ein Blackout in Österreich?",
      a: "Die Gesellschaft für Krisenvorsorge rechnet in Österreich mit einem Stromausfall zwischen 10 und 48 Stunden, regional auch länger. Telekommunikation und Versorgung mit Gütern können danach noch mehrere Tage gestört sein.",
    },
    {
      q: "Was ist der Unterschied zwischen Blackout und Stromausfall?",
      a: "Ein Stromausfall ist regional und meist in Minuten bis Stunden behoben, Hilfe von außen ist möglich. Ein Blackout betrifft große Teile Europas, dauert länger und legt auch Kommunikation, Logistik und Zahlungsverkehr lahm.",
    },
    {
      q: "Hilft eine PV-Anlage bei einem Blackout?",
      a: "Nur mit Ersatzstromfunktion: Speicher mit netzbildendem Wechselrichter, automatischer Netztrennung und Schwarzstartfähigkeit. Eine normale netzgekoppelte Anlage schaltet bei Netzausfall ab. Für Nächte und den Winter ist meist zusätzlich ein Aggregat nötig.",
    },
    {
      q: "Wie viel Vorrat sollten Mitarbeitende zu Hause haben?",
      a: "Die Gesellschaft für Krisenvorsorge empfiehlt, dass sich möglichst viele Menschen mindestens 14 Tage selbst versorgen können – mit Trinkwasser, Lebensmitteln, Medikamenten, Licht und einem batteriebetriebenen Radio.",
    },
    {
      q: "Was muss eine Gemeinde für einen Blackout vorbereiten?",
      a: "Einen Krisenstab, Anlaufstellen mit Ersatzstrom, die Absicherung von Wasserversorgung und Abwasser, Abläufe für vulnerable Personen, Treibstoffreserven und Wege zur Information der Bevölkerung. Die Zivilschutzverbände der Länder bieten Vorlagen für Vorsorgepläne.",
    },
    {
      q: "Kann die Fernwartung im Blackout helfen?",
      a: "Nein, weil Internet und Mobilfunk ausfallen. Ersatzstromanlagen müssen daher lokal bedienbar sein, und die zuständigen Personen brauchen Anleitungen in Papierform.",
    },
  ],

  passend: [
    { href: "/service/notstrom", titel: "Notstrom & Blackout-Vorsorge", text: "Ersatzstromkonzepte mit PV, Speicher und Aggregat." },
    { href: "/ratgeber/notstrom-photovoltaik", titel: "Notstrom mit Photovoltaik", text: "Technik, TOR und Dimensionierung." },
    { href: "/kommunen", titel: "Lösungen für Gemeinden", text: "PV und Speicher auf kommunalen Gebäuden." },
    { href: "/landwirtschaft", titel: "Landwirtschaft", text: "Energieversorgung für Stall, Kühlung und Hof." },
  ],

  quellen: [
    { titel: "Gesellschaft für Krisenvorsorge – Leitfaden für die Blackout-Vorsorge in Unternehmen und Organisationen", url: "https://gfkv.org/wp-content/uploads/2024/03/GfKV-Leitfaden-fuer-die-Blackout-Vorsorge-in-Unternehmen-und-Organisationen.pdf", stand: "03/2024" },
    { titel: "Herbert Saurugg – Blackout- und Krisenvorsorge (Leitfäden für Gemeinden und Unternehmen)", url: "https://www.saurugg.net/", stand: "09/2026" },
    { titel: "KFV – Blackout: Science-Fiction oder baldige Realität?", url: "https://www.kfv.at/blackout/", stand: "10/2020" },
    { titel: "Zivilschutzverband Steiermark – Thema Blackout (inkl. Vorsorgeplan Gemeinde)", url: "https://www.zivilschutz.steiermark.at/thema/blackout/", stand: "09/2026" },
    { titel: "ENTSO-E – System separation in the Continental Europe Synchronous Area on 8 January 2021", url: "https://www.entsoe.eu/news/2021/01/26/system-separation-in-the-continental-europe-synchronous-area-on-8-january-2021-2nd-update/", stand: "01/2021" },
    { titel: "ENTSO-E – 28 April 2025 Iberian Blackout (Factual und Final Report)", url: "https://www.entsoe.eu/publications/blackout/28-april-2025-iberian-blackout/", stand: "03/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A, Version 1.4", url: "https://www.e-control.at/documents/1785851/1811582/TOR+Stromerzeugungsanlagen+Typ+A+Version+1.4+%287%29.pdf/093752f5-e220-0731-b8a8-bfa85ccb7287?t=1780897058735", stand: "06/2026" },
  ],

  seitenCta: { titel: "Ersatzstrom für den Ernstfall?", text: "Konzept mit PV, Speicher und Aggregat.", href: "/service/notstrom", label: "Beratung anfragen" },
  cta: {
    title: "Handlungsfähig bleiben, wenn das Netz ausfällt.",
    text: "Ökovolt plant Ersatzstromlösungen mit PV und Speicher für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich – von der Lastanalyse bis zum Test unter realer Last.",
    primary: { label: "Notstrom anfragen", href: "/service/notstrom" },
    secondary: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },
};

export default artikel;
