// Ratgeber: Fassaden-PV und BIPV (gebäudeintegrierte Photovoltaik) – Zukunftsthema
// Ertragsdaten: PVGIS 5.3, API-Abfragen vom 28.09.2026 (Linz: Süd/Ost/West 90°, Süd 15°; Landeshauptstädte Süd 90°).
// Förderung: EAG-IZ-VO Strom § 6 Abs. 4/5 (innovative PV, gebäudeintegriert), Fassung 2026.
// Normen: ÖVE EN 50583-1/-2, IEC 63092-1/-2, OIB-Richtlinien 2 und 4, ÖNORM B 3716, OVE R 11-1.

const artikel = {
  slug: "photovoltaik-fassade-bipv",
  title: "Fassaden-PV und BIPV: Gebäudeintegrierte Photovoltaik in Österreich",
  seoTitle: "Fassaden-PV & BIPV: Normen, Ertrag | Ökovolt",
  kurzTitel: "Fassaden-PV & BIPV",
  description:
    "Gebäudeintegrierte Photovoltaik (BIPV) in Österreich: Fassade, Indach, Brüstung und Glasdach – Ertrag laut PVGIS, Normen, OIB-Richtlinien und 30 % EAG-Zuschlag.",
  excerpt:
    "Module, die Fassade, Dachhaut oder Geländer ersetzen: Was BIPV von aufgesetzten Anlagen unterscheidet, wie viel eine Südfassade liefert, welche Normen gelten und warum der Winterertrag überrascht.",
  hauptKeyword: "fassaden pv bipv",
  keywords: [
    "Fassaden-PV",
    "BIPV",
    "gebäudeintegrierte Photovoltaik",
    "Photovoltaik Fassade Ertrag",
    "Indach Photovoltaik",
    "PV-Glas Überkopfverglasung",
    "EN 50583",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/photovoltaik-fassade-bipv.jpg",
  bildAlt: "An der Giebelfassade eines Wohnhauses montierte, geneigte Photovoltaikmodule",
  badge: { wert: "+30 %", text: "EAG-Zuschlag für gebäudeintegrierte PV" },

  kurzFazit: [
    "**Gebäudeintegrierte Photovoltaik (BIPV) ersetzt Bauteile der Gebäudehülle – Fassadenplatten, Dachdeckung, Verglasung oder Geländer – und übernimmt deren Funktion.** Aufgesetzte Module auf Dach oder Wand gelten dagegen als gebäudeangebaut (BAPV).",
    "Eine **Südfassade** liefert in Linz laut PVGIS **801 kWh/kWp** im Jahr, rund **70 %** eines optimal geneigten Daches – **Ost- und Westfassaden** etwa 530 bis 565 kWh/kWp. Im **Dezember** übertrifft die Südfassade eine flache 15°-Dachanlage aber um rund 50 %.",
    "Förderrechtlich zählt BIPV als **innovative Photovoltaik**: Der EAG-Investitionszuschuss steigt um **30 %**, wenn die Module eine Funktion der Gebäudehülle erfüllen.",
    "Für die Planung gelten **Bau- und Elektronormen zugleich**: EN 50583 und IEC 63092 für BIPV, OIB-Richtlinie 2 für Brandschutz, OIB-Richtlinie 4 und ÖNORM B 3716 für Glas, OVE R 11-1 für den Brandschutz der PV.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist BIPV – und was unterscheidet sie von Fassaden-PV?",
      tocLabel: "Was ist BIPV?",
      bloecke: [
        {
          typ: "p",
          text: "**Von gebäudeintegrierter Photovoltaik (BIPV) spricht man, wenn das PV-Modul ein Bauprodukt ersetzt und dessen Aufgabe übernimmt – würde man es entfernen, fehlte dem Gebäude ein funktionaler Teil.** Das kann Wetterschutz sein (Dachhaut, Fassadenbekleidung), Tageslicht und Wärmedämmung (Isolierglas mit Solarzellen), Absturzsicherung (Brüstung, Geländer) oder Sonnenschutz (Lamellen, Vordächer). Wird dagegen ein Standardmodul mit einer Unterkonstruktion vor eine bestehende Wand oder auf ein Dach gesetzt, heißt das gebäudeangebaute Photovoltaik (BAPV).",
        },
        {
          typ: "p",
          text: "Die Unterscheidung ist nicht nur akademisch: Ein BIPV-Element ist gleichzeitig Bauprodukt und elektrisches Betriebsmittel. Es muss daher sowohl baurechtliche Anforderungen (Standsicherheit, Brandschutz, Glassicherheit, Schlagregendichtheit) als auch elektrotechnische Normen erfüllen. Und es wird anders gefördert: Die EAG-Investitionszuschüsseverordnung-Strom behandelt gebäudeintegrierte Anlagen als innovative Photovoltaik mit Zuschlag.",
        },
        {
          typ: "tabelle",
          caption: "BIPV-Anwendungen und ihre Gebäudefunktion",
          kopf: ["Anwendung", "Ersetzt", "Gebäudefunktion"],
          zeilen: [
            ["Indach-System / Solardachziegel", "Dachdeckung", "Wetterschutz, Regensicherheit"],
            ["Kaltfassade (vorgehängt, hinterlüftet)", "Fassadenplatten aus Glas, Faserzement, Metall", "Wetterschutz, Gestaltung"],
            ["Warmfassade / Pfosten-Riegel", "Isolierverglasung, Paneele", "Wärmedämmung, Tageslicht, Raumabschluss"],
            ["Brüstung, Balkongeländer", "Glas- oder Blechfüllung", "Absturzsicherung"],
            ["Überkopfverglasung, Vordach, Atrium", "Glasdach", "Wetterschutz, Tageslicht, Beschattung"],
            ["Sonnenschutzlamellen", "außenliegender Sonnenschutz", "Beschattung, Blendschutz"],
          ],
          fussnote: "Funktionen der Gebäudehülle angelehnt an ÖVE EN 50583 und die Liste in § 6 Abs. 5 EAG-IZ-VO Strom (mechanische Steifigkeit, Wetterschutz, Beschattung/Tageslicht/Wärmedämmung, Brandschutz, Lärmschutz, Trennung innen/außen, Schutz und Sicherheit).",
        },
      ],
    },
    {
      id: "ertrag",
      titel: "Wie viel Strom liefert eine Fassade?",
      tocLabel: "Ertrag",
      bloecke: [
        {
          typ: "p",
          text: "**Eine senkrechte Südfassade erzeugt übers Jahr rund 70 % des Ertrags einer optimal geneigten Anlage, Ost- und Westfassaden etwa 45 bis 50 %.** Das klingt nach wenig – doch die Fassade liefert ihren Strom zu anderen Zeiten: morgens, abends und vor allem im Winter, wenn die Sonne tief steht und auf Dächern Schnee liegt.",
        },
        {
          typ: "tabelle",
          caption: "Ertrag in Linz nach Ausrichtung in kWh/kWp (PVGIS 5.3)",
          kopf: ["Fläche", "Jahr", "Juni", "Dezember"],
          zeilen: [
            ["Dach, optimal geneigt (38°, Süd)", "1.143", "129", "40"],
            ["Dach, flach (15°, Süd)", "1.073", "137", "29"],
            ["Fassade Süd (90°)", "801", "63", "43"],
            ["Fassade West (90°)", "565", "73", "14"],
            ["Fassade Ost (90°)", "533", "69", "13"],
          ],
          markierteZeile: 2,
          fussnote: "Quelle: EU JRC, PVGIS 5.3, eigene Abfragen vom 28.09.2026 für Linz, 14 % Systemverluste, ohne Verschattung durch Nachbargebäude, Vordächer oder Balkone und ohne Schneeverluste. Hinterlüftung beeinflusst die Modultemperatur und damit den Ertrag.",
        },
        {
          typ: "p",
          text: "Im Dezember liegt die Südfassade damit rund 50 % über der flachen Dachanlage, von November bis Februar erreicht sie praktisch den Ertrag des optimal geneigten Daches. Die Werte für alle Landeshauptstädte und die Winterbilanz zeigt der Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter); die Jahreserträge nach Ausrichtung finden Sie unter [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Verschattung ist an der Fassade der größte Ertragsfeind",
          text: "Balkone, Vordächer, Nachbargebäude und Bäume werfen auf Fassaden viel längere Schatten als auf Dächer. Planen Sie aktive Fassadenflächen dort, wo über den Tag möglichst durchgehend Sonne ankommt, und fassen Sie gleich verschattete Module in eigenen Strings zusammen – mehr dazu im Ratgeber [Verschattung](/ratgeber/photovoltaik-verschattung).",
        },
      ],
    },
    {
      id: "normen",
      titel: "Normen und Bauvorschriften in Österreich",
      tocLabel: "Normen & OIB",
      bloecke: [
        {
          typ: "p",
          text: "**BIPV muss zwei Welten gleichzeitig genügen: dem Baurecht der Länder mit den OIB-Richtlinien und den elektrotechnischen Normen für PV-Anlagen.** Die OIB-Richtlinien sind in allen Bundesländern über die Bautechnikverordnungen bzw. Bauordnungen verbindlich; ihre Anwendung auf PV-Elemente erfordert oft Nachweise, die Hersteller von Standardmodulen nicht liefern.",
        },
        {
          typ: "tabelle",
          caption: "Wichtige Regelwerke für gebäudeintegrierte Photovoltaik, Stand 09/2026",
          kopf: ["Regelwerk", "Inhalt", "Relevanz für BIPV"],
          zeilen: [
            ["ÖVE EN 50583-1 und -2", "Photovoltaik im Bauwesen: BIPV-Module und BIPV-Systeme", "Grundnorm für Anforderungen an BIPV als Bauprodukt und Anlage"],
            ["IEC 63092-1 und -2", "Building-integrated photovoltaics: Module und Systeme", "internationale Nachfolge- und Ergänzungsnorm"],
            ["IEC 61215 / IEC 61730", "Bauartzulassung und Sicherheit von PV-Modulen", "elektrische und mechanische Grundprüfung, Schutzklasse"],
            ["OIB-Richtlinie 2", "Brandschutz", "Brandverhalten und Brandweiterleitung von Fassaden, v. a. ab Gebäudeklasse 4"],
            ["OIB-Richtlinie 4", "Nutzungssicherheit und Barrierefreiheit", "Glas in absturzsichernden und Überkopf-Anwendungen"],
            ["ÖNORM B 3716 (Teile 1–5)", "Glas im Bauwesen – konstruktiver Glasbau", "Bemessung von Verglasungen, Absturzsicherung, Überkopfverglasung"],
            ["ÖNORM B 1991-1-3 / B 1991-1-4", "Schnee- und Windlasten", "Lastannahmen für Glasdächer, Vordächer und Fassaden"],
            ["OVE R 11-1", "Brandschutz bei PV-Anlagen", "Leitungsführung, Abschaltung, Kennzeichnung für die Feuerwehr"],
            ["ÖVE/ÖNORM E 8101 und EN 62446", "Errichtung und Prüfung elektrischer Anlagen", "Installation, Erstprüfung, Dokumentation"],
          ],
          minBreite: 720,
          fussnote: "Überblick ohne Anspruch auf Vollständigkeit; maßgeblich sind die jeweils in Ihrem Bundesland verbindlich erklärten Ausgaben. Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Brandschutz an hohen Fassaden",
          text: "Bei höheren Gebäuden verlangt die OIB-Richtlinie 2, dass eine Brandweiterleitung über die Fassade wirksam eingeschränkt wird. Für PV-Fassaden bedeutet das: Brandverhalten der Module und der Unterkonstruktion nachweisen, Brandabschottungen in der Hinterlüftungsebene vorsehen und die Feuerwehrzugänglichkeit mitplanen. Die PV-spezifischen Anforderungen der OVE R 11-1 erklärt der Ratgeber [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz).",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung: 30 % Zuschlag für gebäudeintegrierte Anlagen",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Gebäudeintegrierte PV-Anlagen, die mindestens eine Funktion der Gebäudehülle erfüllen, erhalten beim EAG-Investitionszuschuss 30 % Zuschlag.** Die Verordnung nennt als Funktionen mechanische Steifigkeit oder strukturelle Integrität, primären Wetterschutz, Beschattung, Tageslicht oder Wärmedämmung, Brandschutz, Lärmschutz, Trennung zwischen Innen- und Außenbereich sowie Schutz oder Sicherheit. Zusätzlich sind je 10 % Zuschlag für Module und Wechselrichter mit europäischer Wertschöpfung möglich.",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: BIPV-Fassade mit 80 kWp (Kategorie C), Stand 09/2026",
          kopf: ["Posten", "Wert"],
          zeilen: [
            ["Höchstsatz Kategorie C (über 20 bis 100 kWp) 2026", "130 €/kWp"],
            ["Beispielgebot", "120 €/kWp"],
            ["Zuschuss ohne Zuschlag", "9.600 €"],
            ["Zuschuss mit 30 % BIPV-Zuschlag", "12.480 €"],
            ["mit europäischen Modulen (+10 %)", "13.728 €"],
          ],
          fussnote: "Modellrechnung nach §§ 5 und 6 EAG-IZ-VO Strom. Die Förderung ist mit 30 % der Investitionskosten gedeckelt; Anträge der Kategorien C und D werden nach dem niedrigsten Förderbedarf je kWp gereiht. Fördercall 2026 unter anderem vom 8. bis 22. Oktober. Landesförderungen können zusätzlich möglich sein.",
        },
        {
          typ: "p",
          text: "Wirtschaftlich rechnet sich BIPV anders als eine Dachanlage: Die Kosten je kWp sind höher, dafür ersetzt das PV-Element ein ohnehin nötiges Fassaden- oder Glasbauteil. Relevant sind daher die Mehrkosten gegenüber der konventionellen Fassade – bei hochwertigen Glas- oder Metallfassaden fallen sie deutlich geringer aus als bei einfachem Putz. Einen Überblick über Programme gibt die Seite [Bundesförderung](/forderungen/bundesfoerderung), die Fördercalls erklärt der Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss).",
        },
      ],
    },
    {
      id: "gestaltung",
      titel: "Gestaltung: Farbe, Glas und Format",
      tocLabel: "Gestaltung",
      bloecke: [
        {
          typ: "p",
          text: "**BIPV-Elemente gibt es heute in vielen Farben, Oberflächen und Formaten – jede Abweichung vom dunklen Standardmodul kostet aber Wirkungsgrad.** Farbige, bedruckte oder satinierte Gläser reflektieren einen Teil des Lichts, bevor es die Zelle erreicht. Je heller und deckender die Optik, desto geringer der Ertrag.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Standard dunkel", text: "Höchster Ertrag, günstigster Preis. Mit rahmenlosen Glas-Glas-Elementen und verdeckter Befestigung trotzdem architektonisch hochwertig." },
            { titel: "Farbige Gläser", text: "Farbschichten oder Keramikdruck passen das Modul an Fassade oder Dach an. Ertragsverlust je nach Farbe und Technik – vom Hersteller Messwerte verlangen." },
            { titel: "Semitransparent", text: "Zellen mit Abstand oder Dünnschicht in Isolierglas lassen Tageslicht durch – geeignet für Atrien, Vordächer und Wintergärten." },
            { titel: "Sonderformate", text: "Zugeschnittene Elemente für Giebel, Dachgauben oder Brüstungen erhöhen die Kosten; ein Modulraster, das früh mit der Architektur abgestimmt wird, spart Geld." },
          ],
        },
        {
          typ: "p",
          text: "Welche Zelltechnologien und Glasaufbauten sich für Fassaden eignen, erklärt der Ratgeber [Solarmodule im Vergleich](/ratgeber/solarmodule-vergleich). Robuste [Glas-Glas-Module](/wissen/lexikon#glas-glas-modul) sind in Fassaden und Überkopfanwendungen meist gesetzt, weil sie die Anforderungen an Bruchverhalten und Dauerhaftigkeit leichter erfüllen.",
        },
      ],
    },
    {
      id: "planung",
      titel: "Planung und Ausführung: Worauf es bei BIPV ankommt",
      tocLabel: "Planung",
      bloecke: [
        {
          typ: "p",
          text: "**Bei gebäudeintegrierter PV treffen Fassadenbau, Glasbau und Elektrotechnik aufeinander – die meisten Probleme entstehen an diesen Schnittstellen, nicht an den Modulen selbst.** Deshalb sollte die PV-Planung spätestens mit dem Entwurf beginnen, nicht erst mit der Ausführungsplanung.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Modulraster früh festlegen:** Fassadenraster, Fensterachsen und Modulformate aufeinander abstimmen; Passstücke als inaktive Blindelemente in gleicher Optik vorsehen.",
            "**Hinterlüftung:** Ausreichender Luftspalt senkt die Modultemperatur und damit Ertragsverluste; bei Warmfassaden Temperaturverhalten des Isolierglases prüfen.",
            "**Kabelführung und Anschlussdosen:** Zugänglich, UV- und witterungsgeschützt, mit Brandabschottung in der Fassadenebene; Leitungswege gemäß OVE R 11-1 planen.",
            "**Tausch im Schadensfall:** Einzelne Elemente müssen ohne Demontage der halben Fassade ersetzbar sein – Ersatzmodule gleicher Optik bevorraten.",
            "**Gewährleistung klären:** Wer haftet für Dichtheit, Glasbruch und elektrische Funktion? Klare Leistungsgrenzen zwischen Fassadenbauer, Glaser und Elektrotechniker vereinbaren.",
            "**Wartung und Reinigung:** Zugang über Hubsteiger oder Befahranlage einplanen; Fassaden verschmutzen weniger als flache Dächer, Glasdächer dagegen stärker.",
          ],
        },
        {
          typ: "p",
          text: "Die elektrische Auslegung folgt denselben Grundsätzen wie bei Dachanlagen, mit einer Besonderheit: Fassadenflächen sind unterschiedlich ausgerichtet und oft teilverschattet. Mehrere MPP-Tracker oder Modulleistungselektronik helfen, Ertragsverluste zu begrenzen – mehr im Ratgeber [Wechselrichter](/ratgeber/wechselrichter-photovoltaik).",
        },
      ],
    },
    {
      id: "alpin",
      titel: "Indach und Fassade in alpinen Lagen",
      tocLabel: "Alpin",
      bloecke: [
        {
          typ: "p",
          text: "**In schneereichen Lagen spielen Indach-Systeme und Fassaden ihre Stärken aus: Die Fassade bleibt schneefrei, und Indach-Lösungen lassen sich gezielt auf hohe Schneelasten auslegen.** Für Chalets, Hotels und Bergbahnstationen verbindet gebäudeintegrierte PV Architektur, Winterertrag und Tragwerk.",
        },
        {
          typ: "liste",
          punkte: [
            "**Schneelast:** Indach-Elemente tragen die Schneelast des Standorts selbst – in Kitzbühel 4,2 kN/m², in Lech 10,3 kN/m² laut eHORA (Beispielwerte). Grundlagen im Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik).",
            "**Schneeabgang:** Glatte Indach-Flächen begünstigen Dachlawinen – Schneefänge und Schutz von Wegen einplanen.",
            "**Albedo:** Schnee vor der Fassade erhöht den Winterertrag, besonders bei bifazialen Brüstungselementen.",
            "**Denkmal- und Ortsbildschutz:** In Ortskernen und Schutzzonen sind unauffällige Indach- und Farblösungen oft die einzige genehmigungsfähige Variante.",
          ],
        },
        {
          typ: "p",
          text: "Für Premiumobjekte im Alpenraum planen wir Indach-Lösungen und Fassaden-PV gemeinsam mit Architektur und Statik – siehe [Photovoltaik für Chalets](/chalets). Für Betriebe mit großen Fassaden lohnt die Kombination mit einer Dachanlage; die Grundlagen dazu finden Sie auf der Seite [Gewerbe & Industrie](/gewerbe).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was ist der Unterschied zwischen BIPV und BAPV?",
      a: "BIPV-Module ersetzen ein Bauteil der Gebäudehülle und übernehmen dessen Funktion, etwa Wetterschutz, Wärmedämmung oder Absturzsicherung. BAPV sind Standardmodule, die auf oder vor ein bestehendes Bauteil montiert werden. Nur BIPV erhält den 30-%-Zuschlag beim EAG-Investitionszuschuss.",
    },
    {
      q: "Wie viel Strom liefert eine Photovoltaik-Fassade?",
      a: "Eine Südfassade in Linz laut PVGIS rund 800 kWh je kWp und Jahr, also etwa 70 % eines optimal geneigten Daches. Ost- und Westfassaden liegen bei rund 530 bis 565 kWh/kWp. Im Winter liefert die Südfassade so viel wie ein optimal geneigtes Dach.",
    },
    {
      q: "Welche Normen gelten für gebäudeintegrierte PV?",
      a: "Für die BIPV-Elemente vor allem EN 50583 und IEC 63092, für die Module IEC 61215 und IEC 61730. Baurechtlich sind die OIB-Richtlinien 2 (Brandschutz) und 4 (Nutzungssicherheit) sowie für Glas die ÖNORM B 3716 maßgeblich, elektrotechnisch ÖVE/ÖNORM E 8101 und OVE R 11-1.",
    },
    {
      q: "Gibt es eine Förderung für Fassaden-PV?",
      a: "Ja. Gebäudeintegrierte Anlagen gelten als innovative Photovoltaik und erhalten 30 % Zuschlag auf den EAG-Investitionszuschuss. Zusätzlich sind je 10 % für europäische Module und Wechselrichter möglich. Landesförderungen können dazukommen.",
    },
    {
      q: "Ist eine PV-Fassade brandgefährlicher als eine normale Fassade?",
      a: "Nicht zwingend, aber sie muss die Anforderungen der OIB-Richtlinie 2 erfüllen wie jede andere Fassade. Entscheidend sind Brandverhalten der Module und Unterkonstruktion, Brandabschottungen in der Hinterlüftung sowie eine Leitungsführung und Abschaltung nach OVE R 11-1.",
    },
    {
      q: "Kann ich eine bestehende Fassade mit PV nachrüsten?",
      a: "Ja, meist als vorgehängte, hinterlüftete Fassade vor der bestehenden Wand. Sinnvoll ist das vor allem, wenn die Fassade ohnehin saniert oder gedämmt wird – dann ersetzen die PV-Elemente die neue Bekleidung und die Mehrkosten sinken. Tragfähigkeit der Wand, Brandschutz und Verankerung sind vorab zu prüfen.",
    },
    {
      q: "Braucht eine PV-Fassade eine Baubewilligung?",
      a: "Das hängt vom Bundesland, von der Gebäudeklasse und vom Umfang ab. Fassadenänderungen sind häufiger bewilligungs- oder anzeigepflichtig als Dachanlagen, besonders in Schutzzonen. Laut PV Austria soll das EABG ab 2027 für PV an den meisten Gebäuden Genehmigungsfreiheit bringen – Details im Ratgeber zur Genehmigung.",
    },
  ],

  passend: [
    { href: "/chalets", titel: "PV für Chalets & alpin", text: "Indach, Schneelast, Concierge-Wartung." },
    { href: "/ratgeber/photovoltaik-im-winter", titel: "Photovoltaik im Winter", text: "Warum die Fassade im Winter punktet." },
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "Photovoltaik-Genehmigung", text: "Bauordnungen und Verfahren der Länder." },
    { href: "/produkte/photovoltaikanlage", titel: "Photovoltaikanlage", text: "Module, Wechselrichter, Unterkonstruktion." },
  ],

  quellen: [
    { titel: "RIS – EAG-Investitionszuschüsseverordnung-Strom, § 6 (innovative Photovoltaikanlagen, gebäudeintegriert)", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40275221/NOR40275221.html", stand: "09/2026" },
    { titel: "OIB – Richtlinien 2023 (u. a. OIB-RL 2 Brandschutz, OIB-RL 4 Nutzungssicherheit)", url: "https://www.oib.or.at/de/oib-richtlinien/richtlinien/2023", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Bauwerkintegrierte Photovoltaik (BIPV)", url: "https://www.ise.fraunhofer.de/de/leitthemen/integrierte-photovoltaik/bauwerkintegrierte-photovoltaik-bipv.html", stand: "09/2026" },
    { titel: "Austrian Standards – ÖNORM B 3716 Glas im Bauwesen, konstruktiver Glasbau", url: "https://www.austrian-standards.at/de/shop?q=B%203716", stand: "09/2026" },
    { titel: "EU JRC – PVGIS 5.3 (Ertrag Fassade Süd/Ost/West)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Photovoltaics Report (Juli 2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Fassade oder Indach?", text: "Wir planen BIPV mit Architektur und Statik.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Photovoltaik, die Architektur ist.",
    text: "Von der Indach-Lösung am Chalet bis zur Glasfassade im Gewerbebau: Wir planen gebäudeintegrierte PV mit Normen, Förderung und Ertrag im Blick.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Chalets & alpin", href: "/chalets" },
  },
};

export default artikel;
