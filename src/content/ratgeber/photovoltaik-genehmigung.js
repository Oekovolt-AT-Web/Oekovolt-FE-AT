// Ratgeber: Photovoltaik-Genehmigung in Österreich – Baurecht und Elektrizitätsrecht der Länder
// Recherchestand 28.09.2026, Gesetzestexte in geltender Fassung über jusline.at (Stand 29.09.2026) geprüft:
// BO für Wien §§ 60, 62a; NÖ BO 2014 §§ 15, 17; Oö. BauO 1994 § 26; Stmk. BauG §§ 19–21, 101b;
// Bgld. BauG §§ 1, 18c, 18d; Vbg. BauG; WElWG 2005; Oö. ElWOG 2006 § 5; Stmk. ElWOG 2005 §§ 5, 7;
// K-ElWOG §§ 6, 9; Bgld. ElWG 2006 §§ 5, 7; NÖ ElWG 2005 (§ 5 seit 13.06.2022 weggefallen).
// Salzburg, Tirol, Kärnten (Baurecht) nicht im Wortlaut geprüft – im Text als „im Einzelfall prüfen“ gekennzeichnet.

const artikel = {
  slug: "photovoltaik-genehmigung",
  title: "Photovoltaik-Genehmigung in Österreich: Bau- und Elektrizitätsrecht",
  seoTitle: "PV-Genehmigung Österreich: Bundesländer | Ökovolt",
  kurzTitel: "Photovoltaik-Genehmigung",
  description:
    "Photovoltaik-Genehmigung in Österreich: wann Bauanzeige, Baubewilligung oder elektrizitätsrechtliche Genehmigung nötig ist – Schwellenwerte je Bundesland 2026.",
  excerpt:
    "Dachanlagen sind in den meisten Ländern baurechtlich frei oder nur meldepflichtig. Für Gewerbe- und Freiflächenanlagen entscheiden Leistung, Widmung und das Elektrizitätsrecht des Landes – mit Schwellen zwischen 15 kW und 1 MW.",
  hauptKeyword: "photovoltaik genehmigung österreich",
  keywords: [
    "Photovoltaik Genehmigung Österreich",
    "PV-Anlage Baubewilligung",
    "PV Bauanzeige",
    "elektrizitätsrechtliche Genehmigung PV",
    "Photovoltaik Freifläche Genehmigung",
    "PV Genehmigung Bundesland",
    "Photovoltaik Betriebsanlage Genehmigung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Team/download-1.jpg",
  bildAlt: "Planungsunterlagen für eine Photovoltaikanlage auf einem Besprechungstisch",
  badge: { wert: "2 Rechtsbereiche", text: "Baurecht der Gemeinde und Elektrizitätsrecht des Landes" },

  kurzFazit: [
    "**In Österreich regeln die neun Bundesländer, ob eine PV-Anlage genehmigt werden muss – getrennt nach Baurecht und Elektrizitätsrecht.** Eine Dachanlage ist baurechtlich meist bewilligungsfrei oder nur meldepflichtig; Ausnahmen gelten in Schutzzonen und bei Denkmalschutz.",
    "Elektrizitätsrechtlich reichen die Schwellen von **15 kW** (Wien: darüber Anzeige) über **200 kW** (Steiermark: Genehmigung) und **500 kW** (Kärnten, Burgenland) bis **1.000 kW** (Oberösterreich: bis dahin bewilligungsfrei).",
    "Freiflächenanlagen brauchen fast immer eine passende **Widmung** sowie eine baurechtliche Bewilligung – in der Steiermark etwa ab **100 kWp** im vereinfachten Verfahren und ab **500 kWp** im Vollverfahren.",
    "Für Anlagen auf bestehenden Gebäuden gelten seit der EU-Richtlinie RED III verkürzte Entscheidungsfristen – z. B. **ein Monat** für Anlagen bis 100 kWp in der Steiermark und im Burgenland.",
  ],

  abschnitte: [
    {
      id: "grundsatz",
      titel: "Braucht eine PV-Anlage in Österreich eine Genehmigung?",
      tocLabel: "Grundsatz",
      bloecke: [
        {
          typ: "p",
          text: "**Ob eine PV-Anlage genehmigt werden muss, hängt vom Bundesland, vom Standort (Dach, Fassade oder Freifläche) und von der Leistung ab.** Es gibt keine bundesweit einheitliche Regel: Baurecht, Raumordnung und das Elektrizitätsrecht für Erzeugungsanlagen sind Landessache. Hinzu kommen Bundesrecht wie das Denkmalschutzgesetz und – bei Betrieben – das Gewerberecht. Mit dem Netzanschluss hat die Genehmigung nichts zu tun; den regelt der Netzbetreiber (siehe [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden)).",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Baurecht", text: "Bauordnung bzw. Baugesetz des Landes; zuständig ist die Gemeinde (Bürgermeister als Baubehörde). Formen: bewilligungsfrei, Meldung, Bauanzeige, vereinfachtes Verfahren, Baubewilligung." },
            { titel: "Elektrizitätsrecht", text: "Landes-Elektrizitätswirtschaftsgesetz; zuständig meist die Bezirksverwaltungsbehörde oder Landesregierung. Anzeige- oder Genehmigungspflicht ab einer bestimmten Engpassleistung." },
            { titel: "Sonstiges Recht", text: "Raumordnung (Widmung bei Freiflächen), Naturschutz, Ortsbild- und Denkmalschutz, Gewerberecht bei Betriebsanlagen, Luftfahrt (Blendung nahe Flughäfen), Wasserrecht." },
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Die Länder koordinieren ihre Regeln nicht",
          text: "PV Austria hat 2024 rund 36 verschiedene Gesetze in den neun Ländern gezählt, die für die Genehmigung von PV-Anlagen relevant sind. Die folgende Übersicht nennt die wichtigsten Schwellen, ersetzt aber nicht die Prüfung im Einzelfall – insbesondere bei Anlagen über 100 kWp und auf Freiflächen.",
        },
      ],
    },
    {
      id: "baurecht",
      titel: "Baurecht: Dachanlagen meist frei, Freiflächen bewilligungspflichtig",
      tocLabel: "Baurecht je Land",
      bloecke: [
        {
          typ: "p",
          text: "**Auf Dächern und Fassaden sind PV-Anlagen in den meisten Ländern bewilligungsfrei oder nur meldepflichtig; Freiflächenanlagen brauchen ab einer bestimmten Größe eine Baubewilligung.** Die Tabelle zeigt die im Gesetzestext geprüften Regeln (Stand 29. 9. 2026).",
        },
        {
          typ: "tabelle",
          caption: "Baurechtliche Behandlung von PV-Anlagen nach Bundesland, Stand September 2026",
          kopf: ["Bundesland", "Dach / Gebäude", "Freifläche und Sonderfälle", "Rechtsgrundlage"],
          zeilen: [
            ["Wien", "bewilligungsfrei, außer im Grünland-Schutzgebiet, bei Bausperre und in Schutzzonen", "über 15 kW bewilligungspflichtig, wenn keine elektrizitätsrechtliche Anzeige- oder Bewilligungspflicht besteht", "§ 60 Abs. 1 lit. j, § 62a Abs. 1 Z 24a BO für Wien"],
            ["Niederösterreich", "bewilligungs- und meldefrei; in Schutzzonen und Altortgebieten bei Einsehbarkeit vereinfachtes Verfahren", "über 100 kW im Grünland: vereinfachtes Verfahren (Widmungsprüfung)", "§ 15 Abs. 1 Z 8 und 13, § 17 Z 14 NÖ BO 2014"],
            ["Oberösterreich", "frei, wenn nach Oö. ElWOG nicht bewilligungspflichtig; Sonderregeln für hohe Aufständerungen (über 2 m frei stehend bzw. über 1,5 m über Dachfläche)", "Widmung erforderlich; Details im Oö. Leitfaden", "§ 26 Z 15 Oö. BauO 1994"],
            ["Steiermark", "meldepflichtig (Dach, Fassade, vorspringende Bauteile)", "bis 100 kWp meldepflichtig; über 100 kWp vereinfachtes Verfahren; über 500 kWp Baubewilligung; über 3,5 m Höhe vereinfachtes Verfahren", "§§ 19, 20, 21 Stmk. BauG"],
            ["Burgenland", "bis 20 kW bei Gebäudeklassen 1–3 und dachparalleler Montage (max. 15° Aufständerung, max. 30 cm Abstand) ausgenommen; sonst Baubewilligung", "Baubewilligung; Nachweis, dass die Anschlusskapazität reicht", "§ 1 Abs. 2 Z 7, § 18d Bgld. BauG"],
            ["Vorarlberg", "frei, wenn dach- oder wandparallel mit max. 0,30 m Abstand und Abstandsflächen eingehalten", "Bauverfahren nach BauG; beschleunigte Verfahren nach § 34d", "§ 20 Abs. 2 BauG (Vbg.)"],
            ["Kärnten", "PV auf gewerblichen Betriebsanlagen mit gewerberechtlicher Bewilligungspflicht vom Baurecht ausgenommen; sonst Landesrecht prüfen", "Widmung; Flächenbegrenzungen im Kärntner Raumordnungsrecht", "K-BO 1996, K-ROG 2021"],
            ["Salzburg, Tirol", "im Einzelfall prüfen (Leitfäden der Länder)", "Widmung und Bewilligung nach Landesrecht", "Landesbaurecht"],
          ],
          minBreite: 760,
          fussnote: "Vereinfachte Darstellung auf Basis der geltenden Gesetzestexte (jusline.at, Stand 29. 9. 2026). Für Salzburg, Tirol und Kärnten wurden die Bauordnungen nicht vollständig im Wortlaut geprüft. Gemeinden können über Bebauungspläne zusätzliche Vorgaben machen. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Die Pflicht, bei Neubauten PV-Anlagen zu errichten, ist ein eigenes Thema – dazu der Ratgeber [PV-Pflicht in den Bundesländern](/ratgeber/solarpflicht-bundeslaender). Eine Übersicht über baurechtliche Rahmenbedingungen bietet auch unsere Seite [Baurecht](/forderungen/baurecht).",
        },
      ],
    },
    {
      id: "elektrizitaetsrecht",
      titel: "Elektrizitätsrecht: Ab welcher Leistung braucht es eine Genehmigung?",
      tocLabel: "Elektrizitätsrecht",
      bloecke: [
        {
          typ: "p",
          text: "**Die Landes-Elektrizitätsgesetze verlangen für Erzeugungsanlagen ab einer bestimmten Engpassleistung eine Anzeige oder Genehmigung – die Schwellen unterscheiden sich stark.** Für Gewerbeanlagen zwischen 100 und 1.000 kWp ist das oft das entscheidende Verfahren, weil es Nachbarn, Sachverständige und Auflagen einbezieht.",
        },
        {
          typ: "tabelle",
          caption: "Elektrizitätsrechtliche Pflichten für PV-Anlagen nach Landesrecht, Stand September 2026",
          kopf: ["Land", "genehmigungsfrei", "Anzeige / vereinfacht", "Genehmigung", "Rechtsgrundlage"],
          zeilen: [
            ["Wien", "bis 15 kW", "Anzeige bis 50 kW; vereinfachtes Verfahren über 50 bis 250 kW", "über 250 kW", "§§ 6, 7, 8 WElWG 2005"],
            ["Oberösterreich", "bis 1.000 kW sowie PV auf bestehenden oder künftigen künstlichen Strukturen (außer Wasserflächen)", "–", "über 1.000 kW auf Freiflächen", "§ 5 Abs. 2 Z 1a Oö. ElWOG 2006"],
            ["Steiermark", "bis 200 kW", "vereinfachtes Verfahren auf Antrag bis 500 kW", "über 200 kW", "§§ 5, 7 Stmk. ElWOG 2005"],
            ["Kärnten", "bis 500 kW", "vereinfachtes Verfahren bis 1.000 kW", "über 500 kW", "§§ 6, 9 K-ElWOG"],
            ["Burgenland", "bis 100 kWp", "Anzeige über 100 bis 500 kWp (gilt nach drei Monaten ohne Zurückweisung als bewilligt)", "über 500 kWp", "§§ 5, 7 Bgld. ElWG 2006"],
            ["Niederösterreich", "allgemeine Genehmigungspflicht (§ 5 NÖ ElWG 2005) seit 13. 6. 2022 aufgehoben", "–", "Bau- und Raumordnungsrecht maßgeblich", "NÖ ElWG 2005"],
            ["Salzburg, Tirol, Vorarlberg", "im Einzelfall prüfen", "–", "–", "Landes-Elektrizitätsgesetze"],
          ],
          minBreite: 820,
          fussnote: "Schwellen beziehen sich auf die Engpassleistung der Erzeugungsanlage. Anlagen, die gewerbe-, berg- oder abfallrechtlich genehmigt werden, sind in mehreren Ländern vom Elektrizitätsrecht ausgenommen. Stand der Gesetzestexte: 29. 9. 2026. Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Konzentration bei Betriebsanlagen",
          text: "Mehrere Landesgesetze nehmen Erzeugungsanlagen vom Elektrizitätsrecht aus, wenn sie gewerberechtlichen Vorschriften unterliegen – etwa § 5 Abs. 2 Z 1 Stmk. ElWOG 2005 oder § 6 Abs. 2 K-ElWOG. Eine PV-Anlage auf einer genehmigten Betriebsanlage kann dann im Rahmen der Betriebsanlagengenehmigung nach der Gewerbeordnung zu behandeln sein. Ob eine Änderung der Betriebsanlage anzeige- oder genehmigungspflichtig ist, hängt vom Einzelfall ab – klären Sie das früh mit der Bezirkshauptmannschaft.",
        },
      ],
    },
    {
      id: "freiflaeche",
      titel: "Freiflächenanlagen: Widmung, Zonierung und Bewilligung",
      tocLabel: "Freiflächen",
      bloecke: [
        {
          typ: "p",
          text: "**Eine PV-Freiflächenanlage braucht in allen Ländern eine raumordnungsrechtliche Grundlage – meist eine eigene Widmung (z. B. Grünland-Photovoltaik) oder eine Eignungszone des Landes.** Ohne passende Widmung hilft auch eine elektrizitätsrechtliche Genehmigung nicht. Mehrere Länder haben Zonierungen für größere Anlagen erlassen; in Kärnten begrenzt das Raumordnungsrecht die Fläche einzelner Anlagen.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Flächenverfügbarkeit sichern", "Pacht- oder Kaufvertrag mit aufschiebender Bedingung (Widmung, Netzzusage), Dienstbarkeiten für Kabeltrassen."],
            ["Netzanfrage stellen", "Ohne Netzzusage ist eine Widmung wirtschaftlich wertlos – bei Anlagen über 1 MW meist Anschluss in der Mittelspannung oder am Umspannwerk."],
            ["Widmungsverfahren anstoßen", "Änderung des Flächenwidmungsplans durch die Gemeinde; Prüfung von Landschaftsbild, Naturschutz, Boden und Blendung. Dauer: mehrere Monate."],
            ["Bau- und elektrizitätsrechtliche Verfahren", "Je nach Land getrennte oder konzentrierte Verfahren; Gutachten zu Statik, Brandschutz (TRVB 162 N für Anlagen über 2 ha) und Netzrückwirkungen."],
            ["Förderung und Vermarktung", "EAG-Marktprämie über Ausschreibung oder Investitionszuschuss mit Abschlägen für Freiflächen; alternativ PPA."],
          ],
        },
        {
          typ: "p",
          text: "Details zu Widmung und Zonierung je Bundesland lesen Sie im Ratgeber [Freiflächen-Photovoltaik und Widmung](/ratgeber/freiflaechen-photovoltaik-widmung) und – für Doppelnutzung mit Landwirtschaft – [Agri-PV in Österreich](/ratgeber/agri-pv-oesterreich).",
        },
      ],
    },
    {
      id: "fristen",
      titel: "Wie schnell müssen Behörden entscheiden?",
      tocLabel: "Entscheidungsfristen",
      bloecke: [
        {
          typ: "p",
          text: "**Seit der Umsetzung der EU-Erneuerbaren-Richtlinie (RED III) gelten für Solaranlagen auf bestehenden Gebäuden und künstlichen Strukturen kurze Entscheidungsfristen.** Einige Beispiele aus den geprüften Landesgesetzen:",
        },
        {
          typ: "liste",
          punkte: [
            "**Steiermark:** Über Bewilligungen von PV-Anlagen über 3,50 m Höhe mit einer Leistung bis 100 kW entscheidet die Behörde binnen einem Monat (§ 101b Stmk. BauG); elektrizitätsrechtlich binnen drei Monaten ab Vollständigkeitsbestätigung für Anlagen auf künstlichen Strukturen.",
            "**Burgenland:** Baurechtliche Entscheidung über PV bis 100 kWpeak binnen einem Monat; ohne Entscheidung gilt die Genehmigung als erteilt (§ 18c Bgld. BauG).",
            "**Niederösterreich:** Vollständigkeitsbestätigung für Anlagen zur Erzeugung erneuerbarer Energie binnen 45 Tagen (§ 5 Abs. 2a NÖ BO 2014).",
            "**Kärnten:** Das elektrizitätsrechtliche Verfahren für Solaranlagen auf künstlichen Strukturen darf nicht länger als drei Monate dauern (K-ElWOG).",
            "**Vorarlberg:** Besondere Verfahrensbestimmungen für Solaranlagen nach § 34d BauG (Sammelgesetz LGBl. Nr. 21/2025).",
          ],
        },
      ],
    },
    {
      id: "sonderfaelle",
      titel: "Sonderfälle: Denkmalschutz, Ortsbild, Brandschutz, Blendung",
      tocLabel: "Sonderfälle",
      bloecke: [
        {
          typ: "p",
          text: "**Auch eine bewilligungsfreie Anlage muss alle bautechnischen Vorschriften einhalten – bewilligungsfrei heißt nicht regelfrei.** Die häufigsten Stolpersteine bei Gewerbe- und Gemeindeprojekten:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Denkmalschutz:** Veränderungen an denkmalgeschützten Gebäuden brauchen eine Bewilligung des Bundesdenkmalamts; Schutzzonen und Altortgebiete haben eigene Ortsbildregeln.",
            "**Brandschutz:** OIB-Richtlinie 2 bzw. 2.1 (Ausgabe 2023) verlangt u. a. 1 m Abstand zur Mitte brandabschnittsbildender Wände, 3 m zu Feuerwehr-Dachausstiegen und Modulfelder von höchstens 40 m – siehe [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz).",
            "**Statik:** Nachweis der Tragfähigkeit für Eigengewicht, Schnee (ÖNORM B 1991-1-3) und Wind (ÖNORM B 1991-1-4); bei Leichtdächern oft der limitierende Faktor.",
            "**Blendung:** Nahe Flughäfen, Bahnen und Straßen kann ein Blendgutachten verlangt werden.",
            "**Betriebsanlage:** Änderungen an genehmigten Betriebsanlagen mit der Bezirkshauptmannschaft abstimmen (Gewerbeordnung).",
            "**Nachbarrecht:** Abstandsflächen und Höhen bei aufgeständerten Anlagen und Carports beachten.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Unterlagen früh zusammenstellen",
          text: "Für Verfahren über 100 kWp brauchen Sie meist Lageplan, Belegungsplan, statischen Nachweis, Brandschutzkonzept, technischen Bericht mit Engpassleistung und Netzanschlusspunkt, Flächenwidmungsauszug und Eigentümerzustimmung. Wer diese Unterlagen parallel zur Netzanfrage erstellt, spart Monate. Unsere [Richtlinien-Übersicht](/forderungen/richtlinien) sammelt die relevanten Normen.",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Vorgehen für Betriebe und Gemeinden",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "p",
          text: "**Klären Sie Genehmigung, Netzanschluss und Förderung gemeinsam, weil jede Entscheidung die anderen beeinflusst.** Eine Anlage mit 250 kWp kann in Wien ein vereinfachtes elektrizitätsrechtliches Verfahren auslösen, in Oberösterreich dagegen elektrizitätsrechtlich frei sein; eine Aufteilung in mehrere Anlagen ändert daran in der Regel nichts, weil Anlagen hinter einem Netzanschlusspunkt als Einheit gelten.",
        },
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "Standort und Leistung grob festlegen (Dachflächen, Lastgang, Netzanschluss).",
            "Landesrecht prüfen: Baurecht, Elektrizitätsrecht, Raumordnung, Schutzzonen.",
            "Netzanfrage beim Netzbetreiber stellen – siehe [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss).",
            "Unterlagen für Bau- und Elektrizitätsrecht erstellen, bei Betrieben Gewerberecht klären.",
            "Förderansuchen einbringen, dann Verfahren abwickeln und Bescheide abwarten.",
            "Nach Fertigstellung Fertigstellungsanzeigen an Behörde (wo vorgesehen) und Netzbetreiber.",
          ],
        },
        {
          typ: "p",
          text: "Gemeinden haben zusätzlich Vergabe- und Beteiligungsfragen zu lösen – dazu der Ratgeber [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde) und unsere Seite für [Gemeinden](/kommunen).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Brauche ich für eine PV-Anlage auf dem Dach eine Baubewilligung?",
      a: "In den meisten Bundesländern nicht. Wien, Niederösterreich, Oberösterreich und Vorarlberg stellen dachparallele Anlagen weitgehend frei, die Steiermark verlangt eine Meldung. Ausnahmen gelten in Schutzzonen, bei Denkmalschutz, bei hohen Aufständerungen und im Burgenland für Anlagen über 20 kW.",
    },
    {
      q: "Ab wann braucht eine PV-Anlage eine elektrizitätsrechtliche Genehmigung?",
      a: "Das hängt vom Land ab: In Wien ist über 15 kW eine Anzeige und über 250 kW eine Genehmigung nötig, in der Steiermark über 200 kW, in Kärnten und im Burgenland über 500 kW. Oberösterreich stellt PV bis 1.000 kW und auf Gebäuden frei. In Niederösterreich wurde die allgemeine Genehmigungspflicht 2022 aufgehoben.",
    },
    {
      q: "Braucht eine Freiflächenanlage eine Widmung?",
      a: "Ja, praktisch immer. Freiflächenanlagen setzen eine passende Widmung im Flächenwidmungsplan oder eine Eignungszone des Landes voraus. Zusätzlich ist meist eine Baubewilligung nötig – in der Steiermark etwa ab 100 kWp im vereinfachten und ab 500 kWp im Vollverfahren.",
    },
    {
      q: "Wie lange dauert eine PV-Genehmigung?",
      a: "Meldungen und Anzeigen sind oft in wenigen Wochen erledigt. Für Anlagen auf Gebäuden gelten verkürzte Fristen, in der Steiermark und im Burgenland ein Monat für Anlagen bis 100 kWp. Freiflächenanlagen mit Widmungsänderung brauchen dagegen häufig mehrere Monate bis über ein Jahr.",
    },
    {
      q: "Gilt die Betriebsanlagengenehmigung auch für die PV-Anlage?",
      a: "Möglicherweise. Mehrere Landes-Elektrizitätsgesetze nehmen Anlagen aus, die dem Gewerberecht unterliegen. Ob die PV-Anlage eine anzeige- oder genehmigungspflichtige Änderung der Betriebsanlage ist, hängt von Ausführung und Auswirkungen ab – klären Sie das mit der Bezirkshauptmannschaft.",
    },
    {
      q: "Wer kümmert sich um die Genehmigung?",
      a: "Rechtlich ist der Anlagenbetreiber verantwortlich. In der Praxis erstellt der Errichter die technischen Unterlagen und bereitet Anzeigen und Anträge vor. Ökovolt übernimmt bei Gewerbe- und Gemeindeprojekten die Abstimmung mit Behörden und Netzbetreiber.",
    },
  ],

  passend: [
    { href: "/ratgeber/solarpflicht-bundeslaender", titel: "PV-Pflicht in den Bundesländern", text: "Wo Neubauten Photovoltaik brauchen." },
    { href: "/ratgeber/photovoltaik-brandschutz", titel: "Photovoltaik und Brandschutz", text: "OIB-RL 2, OVE R 11-1 und Feuerwehr." },
    { href: "/forderungen/baurecht", titel: "Baurecht im Überblick", text: "Rahmenbedingungen für PV nach Bundesland." },
    { href: "/ratgeber/freiflaechen-photovoltaik-widmung", titel: "Freiflächen & Widmung", text: "Zonierung, Pacht und Netz." },
  ],

  quellen: [
    { titel: "Bauordnung für Wien, §§ 60, 62a (geltende Fassung, jusline.at)", url: "https://www.jusline.at/gesetz/bo_fuer_wien/gesamt", stand: "09/2026" },
    { titel: "NÖ Bauordnung 2014, §§ 5, 15, 17 (geltende Fassung, jusline.at)", url: "https://www.jusline.at/gesetz/noe__bo_2014/gesamt", stand: "09/2026" },
    { titel: "Steiermärkisches Baugesetz, §§ 19–21, 101b (geltende Fassung, jusline.at)", url: "https://www.jusline.at/gesetz/stmk_baug/gesamt", stand: "09/2026" },
    { titel: "Burgenländisches Baugesetz 1997, §§ 1, 18c, 18d (geltende Fassung, jusline.at)", url: "https://www.jusline.at/gesetz/bgld_baug/gesamt", stand: "09/2026" },
    { titel: "Oö. Elektrizitätswirtschafts- und -organisationsgesetz 2006, § 5 (jusline.at)", url: "https://www.jusline.at/gesetz/ooe_elwog_2006/gesamt", stand: "09/2026" },
    { titel: "Wiener Elektrizitätswirtschaftsgesetz 2005 (jusline.at)", url: "https://www.jusline.at/gesetz/welwg_2005/gesamt", stand: "09/2026" },
    { titel: "Stmk. ElWOG 2005, K-ElWOG, Bgld. ElWG 2006 (jusline.at)", url: "https://www.jusline.at/gesetz/stmk_elwog_2005/gesamt", stand: "09/2026" },
    { titel: "PV Austria – 9 Länder, rund 36 Gesetze: Genehmigungs-Wirrwarr (OTS)", url: "https://www.ots.at/presseaussendung/OTS_20240526_OTS0007/9-laender-rund-36-verschiedene-gesetze-pv-austria-kritisiert-genehmigungs-wirrwarr-in-den-bundeslaendern", stand: "05/2024" },
  ],

  seitenCta: { titel: "Genehmigung klären?", text: "Wir prüfen Bau- und Elektrizitätsrecht für Ihren Standort.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Genehmigung, Netz und Förderung – sauber aufeinander abgestimmt.",
    text: "Ökovolt Solartechnik plant PV-Anlagen für Betriebe, Landwirtschaft und Gemeinden in allen neun Bundesländern und kennt die Unterschiede im Landesrecht.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Lösungen für Gemeinden", href: "/kommunen" },
  },
};

export default artikel;
