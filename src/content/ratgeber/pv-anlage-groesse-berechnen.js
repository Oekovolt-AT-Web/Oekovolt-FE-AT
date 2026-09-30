// Ratgeber: PV-Anlage – Größe berechnen (Schwerpunkt Gewerbe nach Lastgang, Österreich)
// Modellrechnung: eigene Simulation mit PVGIS-5.3-Stundenreihen (seriescalc, Linz, 2019–2023, 14 % Verluste)
// und synthetischem Gewerbe-Lastprofil (~400 MWh/a). Speicher: vereinfachtes Modell (92 % Ladewirkungsgrad, 0,5 C).
// Schwellen: TOR Stromerzeugungsanlagen (E-Control), EAG-IZ-VO Strom § 5 (2026).

const MODELL = [
  // [Variante, kWp, Speicher kWh, PV MWh, Eigenverbrauchsquote %, Autarkie %, Einspeisung MWh, max. Einspeiseleistung kW]
  ["Süd 10°", 100, 0, 106, 91, 24, 10, 52],
  ["Süd 10°", 200, 0, 211, 68, 36, 67, 133],
  ["Süd 10°", 300, 0, 317, 52, 41, 151, 215],
  ["Ost-West 10°", 300, 0, 289, 56, 41, 126, 197],
  ["Süd 10°", 500, 0, 528, 36, 47, 339, 379],
  ["Süd 10° + Speicher", 300, 200, 317, 68, 54, 98, 215],
  ["Süd 10° + Speicher", 500, 300, 528, 52, 68, 247, 379],
];

const artikel = {
  slug: "pv-anlage-groesse-berechnen",
  title: "PV-Anlage Größe berechnen: So dimensionieren Betriebe nach Lastgang",
  seoTitle: "PV-Anlage Größe berechnen: Gewerbe | Ökovolt",
  kurzTitel: "PV-Größe berechnen",
  description:
    "PV-Anlage richtig dimensionieren: Lastgang auswerten, Grundlast bestimmen, Eigenverbrauch simulieren – Modell 100 bis 500 kWp und Schwellen in Österreich.",
  excerpt:
    "Nicht die Dachfläche, sondern der Lastgang bestimmt die richtige Anlagengröße. Wie Betriebe ihre Viertelstundenwerte auswerten, welche Größen sich rechnen und welche Schwellen in Österreich gelten – mit Simulation für einen 400-MWh-Betrieb.",
  hauptKeyword: "pv anlage größe berechnen",
  keywords: [
    "PV-Anlage Größe berechnen",
    "Photovoltaik dimensionieren Gewerbe",
    "Lastgang Photovoltaik",
    "Eigenverbrauchsquote berechnen",
    "wie viel kWp Betrieb",
    "Lastprofilzähler Viertelstundenwerte",
    "PV Anlagengröße Unternehmen",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
  bildAlt: "Luftaufnahme eines Gewerbegebiets mit Photovoltaikanlagen auf Hallendächern",
  badge: { wert: "91 %", text: "Eigenverbrauch bei 100 kWp und 400 MWh Bedarf (Modell)" },

  kurzFazit: [
    "**Die richtige Größe einer Gewerbe-PV-Anlage ergibt sich aus dem Lastgang – den Viertelstundenwerten des Stromverbrauchs –, nicht aus der verfügbaren Dachfläche.** Maßgeblich ist, wie viel Leistung der Betrieb tagsüber dauerhaft abnimmt.",
    "In unserer Modellrechnung für einen Betrieb mit **400 MWh Jahresverbrauch** und rund **75 kW Tageslast** verbraucht eine **100-kWp-Anlage 91 %** ihres Stroms selbst, deckt aber nur 24 % des Bedarfs. Mit **300 kWp** sinkt die Eigenverbrauchsquote auf **52 %**, die Autarkie steigt auf **41 %**.",
    "Ein **Speicher** verschiebt die Grenze: 300 kWp mit 200 kWh erreichen im Modell 68 % Eigenverbrauch und 54 % Autarkie.",
    "Wichtige Schwellen in Österreich: **250 kW** (Typ B nach TOR Stromerzeugungsanlagen), **100 kWp** und **1.000 kWp** beim EAG-Investitionszuschuss sowie die verfügbare **Netzkapazität** am Anschlusspunkt.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie groß sollte die PV-Anlage für einen Betrieb sein?",
      tocLabel: "Die richtige Größe",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Gewerbe-PV-Anlage ist dann richtig dimensioniert, wenn sie die werktägliche Grundlast weitgehend deckt und der Überschuss sinnvoll verwertet werden kann – durch Speicher, Energiegemeinschaft, Vermarktung oder neue Verbraucher.** Als erste Orientierung gilt: Die Anlagenleistung in kWp entspricht etwa dem 1- bis 1,5-Fachen der Leistung, die der Betrieb an Werktagen zwischen 9 und 16 Uhr mindestens abnimmt. Dann liegt die [Eigenverbrauchsquote](/wissen/lexikon#eigenverbrauchsquote) meist über 70 %.",
        },
        {
          typ: "p",
          text: "Größer zu bauen kann sich trotzdem lohnen – etwa weil der Preis pro kWp mit der Anlagengröße sinkt, weil künftig eine E-Flotte oder Wärmepumpe dazukommt oder weil der Überschuss über ein PPA oder eine Energiegemeinschaft gut verkauft werden kann. Die Entscheidung sollte aber auf Zahlen beruhen, nicht auf der Dachgröße. Wie sich Eigenverbrauch und Einspeisung auf die Rendite auswirken, zeigt der Ratgeber [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "lastgang",
      titel: "Schritt 1: Den Lastgang beschaffen",
      tocLabel: "Lastgang beschaffen",
      bloecke: [
        {
          typ: "p",
          text: "**Der Lastgang ist die Zeitreihe des Strombezugs in Viertelstunden – 35.040 Werte pro Jahr.** Betriebe mit einem Jahresverbrauch über 100.000 kWh oder einer Anschlussleistung über 50 kW werden in Österreich in der Regel mit einem Lastprofilzähler gemessen, der genau diese Werte aufzeichnet. Darunter wird der Verbrauch über standardisierte Lastprofile abgerechnet; ein [Smart Meter](/ratgeber/smart-meter-pflicht) kann Viertelstundenwerte aber ebenfalls liefern, wenn die Viertelstundenauslesung aktiviert ist.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Datenquelle:** Viertelstundenwerte stellt der Netzbetreiber bereit – meist im Kundenportal zum Download (CSV/Excel), sonst auf Anfrage. Auch der Stromlieferant hat die Daten häufig.",
            "**Zeitraum:** Mindestens 12 Monate, besser 24, um Saisoneffekte und Ausnahmejahre zu erkennen.",
            "**Mehrere Zählpunkte:** Bei mehreren Gebäuden oder Anschlüssen jeden Zählpunkt einzeln auswerten – die PV-Anlage speist nur in einen ein.",
            "**Veränderungen einplanen:** Neue Maschinen, E-Flotte, Wärmepumpe oder Schichtmodell verändern den Lastgang; diese Pläne gehören in die Auslegung.",
            "**Ohne Lastgang:** Monatsrechnungen, Betriebszeiten und Leistungen großer Verbraucher erlauben eine grobe Schätzung – für Anlagen über 100 kWp reicht das nicht.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Der Lastgang zeigt mehr als die PV-Größe",
          text: "Aus denselben Daten lassen sich Lastspitzen, der Leistungspreis und Einsparpotenziale ablesen. Wer ohnehin den Lastgang analysiert, sollte Peak Shaving und Lastverschiebung gleich mitprüfen – siehe [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis) und unsere [Energieberatung](/service/energieberatung).",
        },
      ],
    },
    {
      id: "auswertung",
      titel: "Schritt 2: Grundlast und Tagesprofil auswerten",
      tocLabel: "Grundlast auswerten",
      bloecke: [
        {
          typ: "p",
          text: "**Entscheidend ist nicht der Jahresverbrauch, sondern die Leistung, die tagsüber verlässlich abgenommen wird.** Zwei Betriebe mit je 400 MWh können völlig unterschiedliche Anlagen brauchen: ein Kühlhaus mit gleichmäßig hoher Last rund um die Uhr, ein Tischlereibetrieb mit hoher Last nur werktags von 6 bis 15 Uhr.",
        },
        {
          typ: "tabelle",
          caption: "Kennwerte aus dem Lastgang und ihre Bedeutung für die PV-Auslegung",
          kopf: ["Kennwert", "Wie ermitteln", "Bedeutung"],
          zeilen: [
            ["Grundlast Werktag mittags", "Minimum der Viertelstundenleistung Mo–Fr, 10–15 Uhr, Sommerhalbjahr", "Leistung, die PV fast vollständig abnehmen kann"],
            ["Wochenend- und Nachtlast", "Mittelwert Sa/So bzw. 22–6 Uhr", "bestimmt Überschuss am Wochenende und Speichernutzen"],
            ["Betriebsferien", "Kalenderwochen mit deutlich reduzierter Last", "Sommer-Stillstand senkt den Eigenverbrauch stark"],
            ["Jahreshöchstlast", "höchster Viertelstundenwert", "Leistungspreis; PV senkt ihn selten allein"],
            ["Tagesenergie Sommer", "kWh je Werktag Juni/Juli", "Vergleich mit PV-Tagesertrag (ca. 5–6 kWh je kWp an klaren Tagen)"],
          ],
          minBreite: 680,
          fussnote: "Richtwerte; die Auswertung erfolgt am besten mit einer Simulation, die Viertelstunden-Lastgang und stündlichen PV-Ertrag überlagert.",
        },
        {
          typ: "p",
          text: "Den PV-Ertrag je Stunde liefert eine Simulation mit Standortdaten, etwa aus PVGIS. Die Jahreswerte je Landeshauptstadt und Ausrichtung zeigt der Ratgeber [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp); wie sich Süd- und Ost-West-Aufständerung im Tagesverlauf unterscheiden, erklärt [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
        },
      ],
    },
    {
      id: "modell",
      titel: "Modellrechnung: 400 MWh Verbrauch, 100 bis 500 kWp",
      tocLabel: "Modellrechnung",
      bloecke: [
        {
          typ: "p",
          text: "**Mit wachsender Anlagengröße steigt der Anteil des selbst erzeugten Stroms am Verbrauch (Autarkie) immer langsamer, während der selbst genutzte Anteil der Erzeugung (Eigenverbrauchsquote) deutlich fällt.** Das zeigt unsere Simulation für einen typischen Produktionsbetrieb in Oberösterreich: 30 kW Grundlast rund um die Uhr, werktags von 6 bis 18 Uhr 75 kW, samstags vormittags 45 kW, zwei Wochen Betriebsurlaub im August und über Weihnachten – zusammen rund 400 MWh im Jahr.",
        },
        {
          typ: "tabelle",
          caption: "Modellrechnung Eigenverbrauch und Autarkie, Betrieb bei Linz mit ca. 400 MWh/a, Stand 09/2026",
          kopf: ["Variante", "Leistung", "Speicher", "PV-Ertrag", "Eigenverbrauchsquote", "Autarkie", "Einspeisung", "max. Einspeiseleistung"],
          zeilen: MODELL.map(([v, kwp, sp, pv, evq, aut, ein, maxE]) => [
            v,
            `${kwp} kWp`,
            sp ? `${sp} kWh` : "–",
            `${pv} MWh`,
            `${evq} %`,
            `${aut} %`,
            `${ein} MWh`,
            `${maxE} kW`,
          ]),
          markierteZeile: 2,
          hervorheben: 4,
          minBreite: 820,
          fussnote: "Eigene Simulation: PVGIS-5.3-Stundenwerte Linz 2019–2023 (Neigung 10°, 14 % Verluste), synthetisches Lastprofil, Mittelwerte je Jahr. Speicher vereinfacht mit 92 % Wirkungsgrad und 0,5 C Lade-/Entladeleistung. Modellwerte, keine Prognose für einen konkreten Betrieb.",
        },
        {
          typ: "p",
          text: "Die Ergebnisse zeigen die typische Abwägung: Bis etwa 100 kWp wird fast jede Kilowattstunde selbst genutzt – der wirtschaftlich stärkste Bereich. Zwischen 200 und 300 kWp wächst der Überschuss deutlich; hier entscheidet der Wert der eingespeisten Kilowattstunde, ob die größere Anlage rentabler ist. Ab 500 kWp wird mehr als die Hälfte eingespeist. Ost-West bringt bei gleicher Leistung etwas weniger Ertrag, aber eine höhere Eigenverbrauchsquote und niedrigere Einspeisespitzen.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Was ein Speicher im Modell bewirkt",
          text: "Ein 200-kWh-Speicher zur 300-kWp-Anlage hebt die Eigenverbrauchsquote von 52 auf 68 % und die Autarkie von 41 auf 54 %. Der Grund: Der Betrieb braucht auch nachts 30 kW – der Speicher verschiebt Mittagsüberschuss in den Abend. Ob sich das rechnet, hängt von Speicherpreis, Strompreis und einem möglichen Zusatznutzen beim Leistungspreis ab. Mehr im Ratgeber [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "schwellen",
      titel: "Schritt 3: Schwellenwerte in Österreich berücksichtigen",
      tocLabel: "Schwellen in Österreich",
      bloecke: [
        {
          typ: "p",
          text: "**Neben dem Lastgang bestimmen technische und förderrechtliche Schwellen die sinnvolle Größe – knapp über einer Grenze zu planen, kann teurer sein als knapp darunter.**",
        },
        {
          typ: "tabelle",
          caption: "Wichtige Leistungsgrenzen für PV-Anlagen in Österreich, Stand 09/2026",
          kopf: ["Grenze", "Regel", "Folge für die Planung"],
          zeilen: [
            ["20 kWp / 100 kWp", "EAG-Investitionszuschuss: Kategorie C (über 20 bis 100 kWp, bis 130 €/kWp) und D (über 100 bis 1.000 kWp, bis 120 €/kWp)", "Förderung per Gebot; Kategorie bestimmt Höchstsatz und Fördertopf"],
            ["250 kW", "TOR Stromerzeugungsanlagen: ab 250 kW Maximalkapazität Typ B statt Typ A", "erweiterte Anforderungen an Netzstützung, Fernsteuerbarkeit und Nachweise; häufig Parkregler"],
            ["1.000 kWp", "Obergrenze des Investitionszuschusses", "darüber Marktprämie über Ausschreibung oder ungeförderter Betrieb mit PPA"],
            ["Netzebene", "Anschluss in Niederspannung (Netzebene 7/6) oder Mittelspannung (Netzebene 5)", "größere Anlagen brauchen oft eigene Trafostation; Netzbetreiber prüft Netzverträglichkeit"],
            ["Einspeiseleistung", "vom Netzbetreiber zugestandene Einspeiseleistung am Anschlusspunkt", "bei knapper Netzkapazität Einspeisebegrenzung, Speicher oder Ost-West-Auslegung"],
          ],
          minBreite: 720,
          fussnote: "Quellen: TOR Stromerzeugungsanlagen Typ A/B (E-Control, Version 1.4), EAG-IZ-VO Strom § 5 (Fassung 2026). Vereinfachte Darstellung; Details zum Netzanschluss im Ratgeber TOR Erzeuger und Netzanschluss.",
        },
        {
          typ: "p",
          text: "Die Anforderungen nach Anlagentyp und Netzebene erklärt der Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss); die Förderung der [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss). Für Anlagen ab dem Typ B übernimmt ein [Parkregler](/technik/parkregler) die Blindleistungs- und Wirkleistungsvorgaben des Netzbetreibers.",
        },
      ],
    },
    {
      id: "flaeche",
      titel: "Schritt 4: Dach, Statik und Fläche prüfen",
      tocLabel: "Dach & Fläche",
      bloecke: [
        {
          typ: "p",
          text: "**Die Dachfläche begrenzt die Größe nach oben – oft ist aber die Statik der eigentliche Engpass.** Moderne Module mit rund 22 bis 23 % Wirkungsgrad benötigen etwa 4,5 bis 5 m² Modulfläche je kWp. Auf dem Flachdach kommen Reihenabstände, Randzonen, Brandschutzabstände und Wartungswege dazu.",
        },
        {
          typ: "tabelle",
          caption: "Flächenbedarf je kWp nach Montageart (Richtwerte)",
          kopf: ["Montageart", "Dachfläche je kWp", "kWp je 1.000 m² nutzbarer Fläche"],
          zeilen: [
            ["Schrägdach, parallel zur Dachfläche", "ca. 5 m²", "ca. 200 kWp"],
            ["Flachdach Ost-West, 10°", "ca. 6–7 m²", "ca. 150–170 kWp"],
            ["Flachdach Süd, 10–15° mit Reihenabstand", "ca. 8–10 m²", "ca. 100–125 kWp"],
            ["Freifläche Süd, 20–25°", "ca. 10–15 m² Grundstück", "ca. 70–100 kWp"],
          ],
          fussnote: "Richtwerte für Module mit ca. 22–23 % Wirkungsgrad; tatsächliche Belegung hängt von Dachform, Aufbauten, Statik, Windzonen und Brandschutz ab.",
        },
        {
          typ: "p",
          text: "Bei Hallendächern aus Trapezblech oder Sandwichpaneelen entscheidet die Tragreserve über das Montagesystem. Ballastierte Systeme erhöhen die Last, mechanisch befestigte Systeme brauchen Durchdringungen. Hinzu kommt die Schneelast des Standorts – in schneereichen Lagen oft der begrenzende Faktor. Details in den Ratgebern [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach) und [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik).",
        },
      ],
    },
    {
      id: "ueberschuss",
      titel: "Schritt 5: Den Überschuss verwerten",
      tocLabel: "Überschuss verwerten",
      bloecke: [
        {
          typ: "p",
          text: "**Jede Kilowattstunde, die nicht selbst verbraucht wird, braucht einen Abnehmer – und dessen Preis entscheidet, ob eine größere Anlage sinnvoll ist.** In Österreich gibt es dafür mehrere Wege, die sich auch kombinieren lassen.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Vermarktung", text: "Einspeisung zum Marktpreis über einen Stromhändler, OeMAG-Marktpreis oder Direktvermarktung – siehe [Einspeisung für Betriebe](/einspeisung-gewerbe)." },
            { titel: "Energiegemeinschaft", text: "Überschuss an Mitglieder in der Region liefern und reduzierte Netzentgelte nutzen – siehe [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe)." },
            { titel: "Neue Verbraucher", text: "E-Flotte tagsüber laden, Wärmepumpe oder Prozesswärme in die Mittagsstunden legen – das erhöht den Eigenverbrauch ohne Speicher." },
            { titel: "Speicher", text: "Mittagsüberschuss in Abend- und Nachtstunden verschieben, zusätzlich Lastspitzen kappen. Wirtschaftlich meist erst bei Kombination beider Effekte." },
          ],
        },
      ],
    },
    {
      id: "privat",
      titel: "Faustformel für Einfamilienhaus und Chalet",
      tocLabel: "Privat: Faustformel",
      bloecke: [
        {
          typ: "p",
          text: "**Für Privathaushalte gilt als grobe Faustformel: 1 kWp je 1.000 kWh Jahresverbrauch, bei Wärmepumpe und E-Auto eher 1,5 kWp.** Ein Haushalt mit 4.500 kWh Verbrauch landet damit bei 5 bis 7 kWp, mit Wärmepumpe und E-Auto bei 10 bis 15 kWp. Für Chalets und Premiumobjekte mit Pool, Wellness und Ladeinfrastruktur lohnt dagegen – wie im Betrieb – ein Blick auf den tatsächlichen Verbrauchsverlauf; siehe [Photovoltaik für Chalets](/chalets).",
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Größe und Ertrag grob berechnen",
          text: "Der Solarrechner schätzt Ertrag, Eigenverbrauch und Amortisation für Ihr Dach – als erster Anhaltspunkt vor der Detailplanung.",
          label: "Zum Solarrechner",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie berechne ich die richtige PV-Größe für meinen Betrieb?",
      a: "Mit dem Lastgang: Viertelstundenwerte eines Jahres beim Netzbetreiber anfordern, die werktägliche Mittagslast bestimmen und die stündliche PV-Erzeugung dagegen simulieren. Als Faustregel ergibt das 1- bis 1,5-Fache der Tagesgrundlast in kW eine Eigenverbrauchsquote über 70 %.",
    },
    {
      q: "Woher bekomme ich meinen Lastgang?",
      a: "Vom Netzbetreiber, meist über dessen Kundenportal. Betriebe mit mehr als 100.000 kWh Jahresverbrauch oder über 50 kW Anschlussleistung haben in der Regel einen Lastprofilzähler; bei Smart Metern können Viertelstundenwerte aktiviert werden.",
    },
    {
      q: "Welche Eigenverbrauchsquote ist gut?",
      a: "Im Gewerbe sind 60 bis 90 % üblich und wirtschaftlich attraktiv. Niedrigere Quoten können sich lohnen, wenn der Überschuss über PPA, Energiegemeinschaft oder Vermarktung gut verkauft wird oder die Anlage bewusst für künftige Verbraucher dimensioniert ist.",
    },
    {
      q: "Lohnt es sich, das ganze Dach zu belegen?",
      a: "Nicht automatisch. In unserem Modell steigt die Autarkie von 300 auf 500 kWp nur von 41 auf 47 %, während sich die Einspeisung mehr als verdoppelt. Ob das rentabel ist, hängt vom erzielbaren Preis für den Überschuss und den Kosten je kWp ab.",
    },
    {
      q: "Warum ist die Grenze von 250 kW wichtig?",
      a: "Ab 250 kW Maximalkapazität gilt eine Anlage nach den TOR Stromerzeugungsanlagen als Typ B. Dann steigen die Anforderungen an Netzstützung, Kommunikation und Nachweise – oft ist ein Parkregler nötig. Knapp über 250 kW zu planen, verursacht daher Mehrkosten.",
    },
    {
      q: "Brauche ich einen Speicher?",
      a: "Nicht zwingend. Bei hoher Tageslast reicht die PV-Anlage allein. Ein Speicher lohnt sich vor allem bei Nacht- oder Abendlast, Wochenendbetrieb und wenn er zusätzlich Lastspitzen senkt. Im Modell hob ein 200-kWh-Speicher die Autarkie einer 300-kWp-Anlage von 41 auf 54 %.",
    },
  ],

  howTo: {
    name: "PV-Anlage für einen Betrieb nach Lastgang dimensionieren",
    schritte: [
      { name: "Lastgang beschaffen", text: "Viertelstundenwerte von mindestens 12 Monaten beim Netzbetreiber herunterladen oder anfordern." },
      { name: "Grundlast auswerten", text: "Werktägliche Mittagslast, Wochenend- und Nachtlast sowie Betriebsferien bestimmen." },
      { name: "Erzeugung simulieren", text: "Stündlichen PV-Ertrag für mögliche Dachflächen und Ausrichtungen berechnen und mit dem Lastgang überlagern." },
      { name: "Schwellen prüfen", text: "Förderkategorien, TOR-Typ und Netzkapazität am Anschlusspunkt berücksichtigen." },
      { name: "Fläche und Statik klären", text: "Belegbare Dachfläche, Tragreserven und Schneelast prüfen lassen." },
      { name: "Überschuss planen", text: "Vermarktung, Energiegemeinschaft, Speicher oder neue Verbraucher festlegen und die Größe final wählen." },
    ],
  },

  passend: [
    { href: "/gewerbe", titel: "PV für Gewerbe & Industrie", text: "Planung nach Lastgang, Hallen- und Flachdächer." },
    { href: "/service/energieberatung", titel: "Energieberatung", text: "Lastganganalyse und Energieaudit." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Peak Shaving, Eigenverbrauch, Notstrom." },
    { href: "/ratgeber/photovoltaik-gewerbe", titel: "Photovoltaik für Gewerbe", text: "Wirtschaftlichkeit, Steuern, Planung." },
  ],

  quellen: [
    { titel: "EU JRC – PVGIS 5.3, stündliche Zeitreihen (seriescalc)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A bis D (Version 1.4)", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
    { titel: "RIS – EAG-Investitionszuschüsseverordnung-Strom, § 5 Fördercalls und Fördersätze 2026", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40275220/NOR40275220.html", stand: "09/2026" },
    { titel: "Oesterreichs Energie – Wechselrichterliste und TOR-Neuigkeiten", url: "https://oesterreichsenergie.at/downloads/publikationsdatenbank/detailseite/wechselrichterliste-tor-erzeuger-typ-a", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Photovoltaics Report (Modulwirkungsgrade, Juli 2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Lastgang auswerten lassen?", text: "Wir simulieren Größe, Eigenverbrauch und Speicher.", href: "/service/energieberatung", label: "Energieberatung" },
  cta: {
    title: "Die richtige Anlagengröße – berechnet aus Ihrem Lastgang.",
    text: "Schicken Sie uns Ihre Viertelstundenwerte: Wir simulieren Varianten mit und ohne Speicher und zeigen, welche Größe sich für Ihren Betrieb rechnet.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Energieberatung", href: "/service/energieberatung" },
  },
};

export default artikel;
