// Ratgeber: Floating-PV – schwimmende Photovoltaik in Österreich (Zukunftsthema)
// Projektdaten Grafenwörth: Liste österreichischer Kraftwerke (Wikipedia, Beleg meinbezirk.at 13.05.2023).
// Recht/Förderung: NÖ ROG 2014 § 20 Abs. 3e Z 2; EAG-IZ-VO Strom § 6 Abs. 4/5 (Fassung 2026).
// Ertrag Vergleich: PVGIS 5.3, Koordinaten Grafenwörth (48,405° N, 15,78° O), Abfrage 28.09.2026.

const artikel = {
  slug: "floating-pv",
  title: "Floating-PV: Schwimmende Photovoltaik auf Baggerseen in Österreich",
  seoTitle: "Floating-PV Österreich: Technik & Förderung | Ökovolt",
  kurzTitel: "Floating-PV",
  description:
    "Floating-PV in Österreich: schwimmende Photovoltaik auf Baggerseen und Speicherteichen – Technik, Ertrag, Ökologie, Genehmigung und 30 % EAG-Zuschlag erklärt.",
  excerpt:
    "Grafenwörth zeigt es seit 2023: 24,5 MWp schwimmen auf ehemaligen Schottergruben. Wie Floating-PV funktioniert, wo sie in Österreich Sinn ergibt und welche Genehmigungen und Förderungen gelten.",
  hauptKeyword: "floating pv",
  keywords: [
    "Floating-PV",
    "schwimmende Photovoltaik",
    "Floating PV Österreich",
    "Photovoltaik Baggersee",
    "Floating PV Grafenwörth",
    "schwimmende PV Genehmigung",
    "Floating PV Förderung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/floating-pv.jpg",
  bildAlt: "Schwimmende Photovoltaikanlage mit Modulreihen auf Schwimmkörpern auf der Wasseroberfläche eines Stausees",
  badge: { wert: "24,5 MWp", text: "Floating-PV Grafenwörth (NÖ), seit 2023" },

  kurzFazit: [
    "**Floating-PV sind Photovoltaikanlagen auf Schwimmkörpern, verankert auf künstlichen Gewässern wie Baggerseen, Schotterteichen oder Speicherbecken.** Sie nutzen Flächen, die weder landwirtschaftlich noch baulich verwertbar sind.",
    "Österreichs Vorzeigeprojekt liegt in **Grafenwörth (NÖ)**: **24,5 MWp** auf rund **14 ha** ehemaliger Schottergruben, seit 2023 in Betrieb, mit erwarteten **26,7 GWh** pro Jahr – die größte schwimmende PV-Anlage Mitteleuropas.",
    "Förderrechtlich gilt schwimmende PV auf künstlich geschaffenen Gewässern als **innovative Photovoltaik** mit **30 % Zuschlag** auf den EAG-Investitionszuschuss. In Niederösterreich ist sie über 2 ha auch **außerhalb der PV-Zonen** widmungsfähig.",
    "Die Technik ist aufwendiger als an Land: Verankerung bei schwankendem Wasserspiegel, Wind, Eisdruck im Winter und ökologische Auflagen bestimmen Kosten und Genehmigung.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist Floating-PV und wo ergibt sie Sinn?",
      tocLabel: "Was ist Floating-PV?",
      bloecke: [
        {
          typ: "p",
          text: "**Floating-PV (schwimmende Photovoltaik) sind Solaranlagen, deren Module auf Schwimmkörpern montiert und am Ufer oder Gewässergrund verankert werden.** Sie eignen sich vor allem für künstliche Gewässer: Baggerseen aus der Kies- und Schottergewinnung, Absetz- und Löschteiche von Industriebetrieben, Rückhalte- und Speicherbecken sowie Beschneiungsteiche in Skigebieten. Natürliche Seen kommen in Österreich aus ökologischen und touristischen Gründen praktisch nicht infrage.",
        },
        {
          typ: "p",
          text: "Der größte Vorteil ist die Fläche: Ein Baggersee lässt sich nach Ende der Gewinnung kaum anders wirtschaftlich nutzen, konkurriert nicht mit Äckern und liegt oft in der Nähe von Gewerbegebieten, die Strom verbrauchen. Österreich hat vor allem im Donauraum, im Tullnerfeld, im Wiener Becken, im Linzer Raum und im Grazer Feld zahlreiche solcher Gewässer. Dazu kommen Betriebe mit eigenen Teichen, deren Anlage direkt in die Verbrauchsanlage einspeisen kann.",
        },
      ],
    },
    {
      id: "grafenwoerth",
      titel: "Praxisbeispiel Grafenwörth: 24,5 MWp auf dem Wasser",
      tocLabel: "Beispiel Grafenwörth",
      bloecke: [
        {
          typ: "p",
          text: "**Die Floating-PV-Anlage in Grafenwörth im Bezirk Tulln ist mit 24,5 MWp die größte schwimmende Photovoltaikanlage Mitteleuropas.** Sie wurde 2023 auf ehemaligen Schottergruben eröffnet, belegt rund 14 ha Wasserfläche und soll jährlich rund 26,7 GWh Strom liefern. Betreiber ist die Ecowind Handels- & Wartungs-GmbH.",
        },
        {
          typ: "tabelle",
          caption: "Kennzahlen Floating-PV Grafenwörth und Vergleich mit PVGIS",
          kopf: ["Kennzahl", "Wert"],
          zeilen: [
            ["Installierte Leistung", "24,5 MWp"],
            ["Wasserfläche", "ca. 14 ha"],
            ["Erwarteter Jahresertrag", "ca. 26,7 GWh"],
            ["Spezifischer Ertrag (rechnerisch)", "ca. 1.090 kWh/kWp"],
            ["PVGIS-Vergleich: Land, Süd 12°, gleicher Standort", "ca. 1.050 kWh/kWp"],
            ["Leistung je Hektar Wasserfläche", "ca. 1,75 MWp/ha"],
            ["Inbetriebnahme", "2023"],
          ],
          fussnote: "Projektdaten: Liste österreichischer Kraftwerke (Wikipedia) mit Beleg meinbezirk.at, 13.05.2023. PVGIS-Vergleich: eigene Abfrage PVGIS 5.3 für 48,405° N / 15,78° O, 14 % Verluste. Der rechnerische Mehrertrag ist ein Indiz für den Kühleffekt des Wassers, hängt aber auch von Anlagendesign und Annahmen ab.",
        },
        {
          typ: "p",
          text: "Solche Anlagen zeigen, dass Floating-PV in Österreich über den Pilotstatus hinaus ist. Für die Wirtschaftlichkeit entscheidend sind die Größe (Fixkosten für Verankerung und Netzanschluss), die Nähe zum Einspeisepunkt und ob der Strom teilweise vor Ort verbraucht wird – etwa von einem Kieswerk, das den See weiter bewirtschaftet.",
        },
      ],
    },
    {
      id: "technik",
      titel: "Technik: Schwimmkörper, Verankerung, Eis",
      tocLabel: "Technik",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Floating-PV-Anlage besteht aus Schwimmkörpern aus UV-beständigem Kunststoff (meist HDPE), den darauf montierten Modulen, einem Verankerungssystem und schwimmenden oder am Grund verlegten Kabeln zum Ufer.** Wechselrichter und Trafostation stehen meist an Land. Die Module werden flach (etwa 10–15°) nach Süden oder in Ost-West-Anordnung montiert; es gibt auch vertikale bifaziale Systeme.",
        },
        {
          typ: "tabelle",
          caption: "Technische Herausforderungen und Lösungen bei Floating-PV",
          kopf: ["Thema", "Herausforderung", "Lösung"],
          zeilen: [
            ["Wasserspiegel", "Baggerseen schwanken mit dem Grundwasser oft um mehrere Meter", "elastische Verankerung, Ankerleinen mit Längenausgleich, Grundanker"],
            ["Wind", "große Angriffsfläche, Wellenbildung auf großen Seen", "Windlasten nach ÖNORM B 1991-1-4, niedrige Bauhöhe, Wellenbrecher am Rand"],
            ["Eis und Schnee", "Eisdruck auf Schwimmkörper und Anker, Schneelast auf Modulen", "Eisdruck in der Statik, Schneelast aus eHORA, robuste Schwimmkörper"],
            ["Elektrische Sicherheit", "Feuchtigkeit, Kondensat, Potenzialausgleich im Wasser", "geeignete Kabel und Steckverbinder, Isolationsüberwachung, Blitzschutzkonzept"],
            ["Wartung", "Zugang nur per Boot oder Laufsteg", "Wartungsstege, Fernüberwachung, Reinigung von Vogelkot"],
            ["Module", "hohe Luftfeuchte, Salz- oder Mineralablagerungen", "Glas-Glas-Module, PID-resistente Technik"],
          ],
          minBreite: 680,
          fussnote: "Allgemeine Planungsgrundsätze; die Auslegung im Einzelfall erfolgt durch Statik, Gewässergutachten und Hersteller.",
        },
        {
          typ: "p",
          text: "Die Kühlung durch das Wasser senkt die Modultemperatur, was den Wirkungsgrad hebt – der Effekt ist aber stark von Wind, Anlagendichte und Schwimmkörper abhängig und sollte in Ertragsprognosen vorsichtig angesetzt werden. Welche Module für feuchte Umgebungen geeignet sind, zeigt der Ratgeber [Solarmodule im Vergleich](/ratgeber/solarmodule-vergleich). Bei vertikalen Systemen kommen [bifaziale Module](/wissen/lexikon#bifazial) zum Einsatz, die auch Licht von der Wasseroberfläche nutzen.",
        },
      ],
    },
    {
      id: "oekologie",
      titel: "Ökologie: Was schwimmende PV mit einem Gewässer macht",
      tocLabel: "Ökologie",
      bloecke: [
        {
          typ: "p",
          text: "**Schwimmende Module beschatten das Wasser, verringern die Verdunstung und verändern Temperatur, Licht und Sauerstoff im Gewässer – wie stark, hängt vor allem vom Bedeckungsgrad ab.** Moderate Bedeckung kann Algenwachstum und Erwärmung im Sommer bremsen; eine zu dichte Bedeckung kann dagegen Photosynthese und Sauerstoffeintrag behindern und Lebensräume von Wasservögeln und Fischen beeinträchtigen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Bedeckungsgrad begrenzen:** Uferzonen und Flachwasserbereiche frei lassen, ausreichend offene Wasserfläche erhalten.",
            "**Uferabstand:** Röhricht und Laichzonen schonen, Zugänge für Erholung und Fischerei klären.",
            "**Monitoring:** Wassertemperatur, Sauerstoff und Artenbestand vor und nach dem Bau dokumentieren.",
            "**Materialien:** Schwimmkörper aus trinkwassergeeigneten Kunststoffen ohne auslaugende Zusätze, keine Reinigungsmittel.",
          ],
        },
        {
          typ: "p",
          text: "Gut geplant kann ein Projekt die ökologische Situation eines ehemaligen Abbaugewässers sogar verbessern: Flachwasserzonen und Uferbepflanzung lassen sich im Zuge des Projekts gestalten, Rückzugsräume für Amphibien und Vögel sichern und Freizeitnutzung gezielt lenken. Genehmigungsbehörden bewerten solche Ausgleichsmaßnahmen positiv – sie sollten deshalb von Anfang an Teil des Konzepts sein und nicht erst im Verfahren nachgereicht werden.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Österreich und Deutschland im Vergleich",
          text: "Deutschland begrenzt schwimmende PV auf künstlichen Gewässern gesetzlich auf 15 % der Wasserfläche und einen Mindestabstand von 40 m zum Ufer (§ 36 Wasserhaushaltsgesetz). Eine vergleichbare bundesweite Pauschalregel gibt es in Österreich nicht; hier beurteilen die Behörden Bedeckung und Abstände im wasser- und naturschutzrechtlichen Verfahren nach dem jeweiligen Gewässer. Das schafft Spielraum, aber auch Unsicherheit – ein gewässerökologisches Gutachten ist deshalb Pflicht.",
        },
      ],
    },
    {
      id: "genehmigung",
      titel: "Genehmigung in Österreich: Welche Verfahren anfallen",
      tocLabel: "Genehmigung",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Floating-PV-Anlage berührt mehrere Rechtsbereiche: Raumordnung, Wasserrecht, Naturschutz, Elektrizitätsrecht und bei aktiver Kiesgewinnung das Mineralrohstoffrecht.** Welche Verfahren im Einzelnen nötig sind, hängt vom Bundesland und vom Gewässer ab.",
        },
        {
          typ: "tabelle",
          caption: "Typische Verfahren für Floating-PV in Österreich, Stand 09/2026",
          kopf: ["Rechtsbereich", "Worum es geht", "Hinweis"],
          zeilen: [
            ["Raumordnung", "Widmung bzw. Sonderausweisung für PV", "NÖ: über 2 ha auch außerhalb der PV-Zonen auf künstlichen stehenden Gewässern zulässig (§ 20 Abs. 3e NÖ ROG)"],
            ["Wasserrecht (WRG 1959)", "Einbauten in Gewässer, Auswirkungen auf Grundwasser und Gewässerzustand", "wasserrechtliche Bewilligung bei der Bezirksverwaltungsbehörde bzw. dem Land"],
            ["Naturschutz", "Lebensräume, Vogelschutz, Landschaftsbild", "Artenschutzprüfung, ggf. Natura-2000-Verträglichkeit"],
            ["Elektrizitätsrecht", "Errichtung und Betrieb der Erzeugungsanlage", "Landeselektrizitätsgesetz; Netzanschluss nach TOR Stromerzeugungsanlagen"],
            ["Mineralrohstoffrecht", "Nutzung während aktiver Nassbaggerung", "Abstimmung mit dem Gewinnungsbetrieb und der Montanbehörde"],
            ["Zivilrecht", "Eigentum, Fischerei- und Wasserbenutzungsrechte", "Verträge mit Grundeigentümer und Fischereiberechtigten"],
          ],
          minBreite: 680,
          fussnote: "Überblick ohne Anspruch auf Vollständigkeit; keine Rechtsberatung. Die allgemeinen Widmungsregeln der Länder finden Sie im Ratgeber zur Freiflächen-Widmung.",
        },
        {
          typ: "p",
          text: "Wie die Bundesländer Freiflächen-PV generell regeln und welche Rolle die neuen Beschleunigungsgebiete nach dem EABG spielen, erklärt der Ratgeber [Freiflächen-PV: Widmung](/ratgeber/freiflaechen-photovoltaik-widmung). Für den Netzanschluss großer Anlagen in der Mittelspannung gelten die Anforderungen aus dem Ratgeber [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss).",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung und Wirtschaftlichkeit",
      tocLabel: "Förderung & Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Schwimmende PV auf künstlich geschaffenen Gewässern zählt nach der EAG-Investitionszuschüsseverordnung-Strom zu den innovativen Photovoltaikanlagen und erhält 30 % Zuschlag auf den Investitionszuschuss.** Den 25-%-Abschlag für Freiflächen auf Grünland gibt es für innovative Anlagen nicht. Bei der Kategorie D (über 100 bis 1.000 kWp) mit einem Höchstsatz von 120 €/kWp im Jahr 2026 wird aus einem Gebot von 110 €/kWp so ein Zuschuss von 143 €/kWp; europäische Module und Wechselrichter bringen je weitere 10 %.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Kosten", text: "Schwimmkörper, Verankerung, Kabel und Montage vom Wasser aus machen Floating-PV teurer als eine Freiflächenanlage an Land. Der Förderzuschlag und die Flächenverfügbarkeit gleichen einen Teil aus." },
            { titel: "Ertrag", text: "Grafenwörth rechnet mit rund 1.090 kWh/kWp, etwas über dem PVGIS-Wert einer vergleichbaren Landanlage. Planen Sie konservativ mit dem Landwert und betrachten Sie Kühlung als Reserve." },
            { titel: "Vermarktung", text: "Über 1 MWp erfolgt die Förderung über die Marktprämie; alternativ Eigenverbrauch des Kieswerks, [Reststromvermarktung](/ratgeber/reststromvermarktung) oder ein PPA mit Unternehmen der Region." },
          ],
        },
        {
          typ: "p",
          text: "Floating-PV ist eine von mehreren Möglichkeiten, Photovoltaik ohne Flächenkonkurrenz zur Landwirtschaft auszubauen – neben Dächern, Parkplatzüberdachungen und [Agri-PV](/ratgeber/agri-pv-oesterreich). Für Betriebe mit eigenem Teich lohnt der Vergleich mit einer Dachanlage: Oft ergänzen sich beide, weil die Dachfläche allein den Verbrauch nicht deckt.",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Vom Gewässer zum Projekt: So gehen Sie vor",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "p",
          text: "**Ob ein Baggersee oder Betriebsteich für Floating-PV taugt, lässt sich mit wenigen Grunddaten früh abschätzen – bevor teure Gutachten beauftragt werden.** Entscheidend sind Wasserfläche und Tiefe, Schwankung des Wasserspiegels, Nutzung (Gewinnung, Fischerei, Badebetrieb), Eigentumsverhältnisse und die Entfernung zum nächsten Einspeisepunkt.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Grunddaten erheben", "Fläche, Tiefenprofil, Pegelschwankungen der letzten Jahre, Ufer- und Zufahrtssituation, bestehende Rechte (Fischerei, Wasserbenutzung, Gewinnungsbewilligung)."],
            ["Netz und Verbrauch prüfen", "Netzanfrage beim Verteilernetzbetreiber; klären, ob ein Kieswerk oder Betrieb am Ufer Strom direkt abnehmen kann."],
            ["Vorprüfung mit Behörden", "Informelles Gespräch mit Gemeinde, Wasserrechts- und Naturschutzbehörde zu Bedeckungsgrad, Uferabständen und Gutachtenumfang."],
            ["Gutachten und Planung", "Gewässerökologie, Artenschutz, Statik für Wind, Eis und Verankerung, Ertragsprognose, Blendgutachten bei Verkehrswegen."],
            ["Bewilligungen und Förderung", "Widmung, wasser- und naturschutzrechtliche Bewilligung, Elektrizitätsrecht; Förderantrag im passenden Fördercall oder Marktprämie."],
            ["Bau und Betrieb", "Montage der Schwimmkörper an Land, Einschwimmen, Verankerung; danach Monitoring von Anlage und Gewässer, Wartung vom Boot oder Steg aus."],
          ],
        },
        {
          typ: "p",
          text: "Für die Überwachung von Erzeugung und Anlagenzustand nutzen wir eigene [Fernwartung](/technik/fernwartung) und [SCADA-Systeme](/technik/scada) – bei schwimmenden Anlagen besonders wertvoll, weil jeder Vor-Ort-Einsatz ein Boot erfordert.",
        },
      ],
    },
    {
      id: "zukunft",
      titel: "Ausblick: Speicherteiche, Speicherseen und Hybridkraftwerke",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Das größte ungenutzte Potenzial liegt neben Baggerseen in bestehenden Speicherbecken von Wasserkraftwerken und in Beschneiungsteichen der Skigebiete.** Dort ist bereits ein Netzanschluss vorhanden, die Kombination aus Wasserkraft und PV glättet die Erzeugung, und Winterstrom aus höheren Lagen ist besonders wertvoll. In der Schweiz werden schwimmende Anlagen auf alpinen Stauseen seit einigen Jahren erprobt.",
        },
        {
          typ: "p",
          text: "Für alpine Standorte gelten allerdings besondere Anforderungen: Eis bis zu einem halben Meter Dicke, schwankende Wasserstände im Speicherbetrieb, hohe Schneelasten und Lawinengefahr. Die Lastannahmen für Schnee und Wind liefern auch hier eHORA und der [Standort-Check](/standort-check); Grundlagen zur Schneelast erklärt der Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik). Für Seilbahn- und Tourismusbetriebe mit eigenen Teichen ist Floating-PV ein Baustein neben Dach- und Fassadenanlagen, wie sie die Seite [Hotellerie & Tourismus](/hotellerie-tourismus) beschreibt.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wo gibt es in Österreich Floating-PV?",
      a: "Das bekannteste Projekt ist Grafenwörth in Niederösterreich: 24,5 MWp auf ehemaligen Schottergruben, seit 2023 in Betrieb. Weitere Anlagen und Projekte entstehen vor allem auf Baggerseen und Betriebsteichen.",
    },
    {
      q: "Bringt schwimmende PV mehr Ertrag als eine Anlage an Land?",
      a: "Etwas, durch die Kühlung vom Wasser. Grafenwörth rechnet mit rund 1.090 kWh/kWp, PVGIS gibt für eine vergleichbare Landanlage am Standort rund 1.050 kWh/kWp an. Für Prognosen sollte man den Kühleffekt vorsichtig ansetzen.",
    },
    {
      q: "Welche Förderung gibt es für Floating-PV?",
      a: "Anlagen auf künstlich geschaffenen Gewässern gelten als innovative Photovoltaik und erhalten 30 % Zuschlag auf den EAG-Investitionszuschuss (bis 1 MWp). Über 1 MWp erfolgt die Förderung über die Marktprämie.",
    },
    {
      q: "Darf man auf jedem See eine schwimmende PV-Anlage bauen?",
      a: "Nein. Infrage kommen praktisch nur künstliche Gewässer wie Baggerseen, Teiche und Speicherbecken. Nötig sind in der Regel eine Widmung, eine wasserrechtliche und eine naturschutzrechtliche Bewilligung sowie die Zustimmung von Eigentümer und Fischereiberechtigten.",
    },
    {
      q: "Wie viel Wasserfläche darf bedeckt werden?",
      a: "In Österreich gibt es keine bundesweite Pauschalgrenze; die Behörden entscheiden im Einzelfall auf Basis eines gewässerökologischen Gutachtens. In Deutschland gelten 15 % der Wasserfläche und 40 m Uferabstand als gesetzliche Obergrenze.",
    },
    {
      q: "Wie lange hält eine schwimmende PV-Anlage?",
      a: "Module und Wechselrichter altern ähnlich wie an Land; die Schwimmkörper aus UV-stabilisiertem Kunststoff sind für Laufzeiten von 25 Jahren und mehr ausgelegt. Verankerung, Kabel und Verbinder brauchen regelmäßige Kontrolle, weil sie ständig in Bewegung sind.",
    },
    {
      q: "Was passiert im Winter mit einer schwimmenden Anlage?",
      a: "Das Gewässer friert zu, die Schwimmkörper werden eingeschlossen. Verankerung und Schwimmkörper müssen den Eisdruck aufnehmen, die Module die Schneelast des Standorts. Beides gehört in die Statik.",
    },
  ],

  passend: [
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächenanlagen", text: "Solarparks von 500 kWp bis in den MW-Bereich." },
    { href: "/ratgeber/freiflaechen-photovoltaik-widmung", titel: "Freiflächen-PV: Widmung", text: "Regeln aller neun Bundesländer." },
    { href: "/ratgeber/agri-pv-oesterreich", titel: "Agri-PV in Österreich", text: "Strom und Ernte auf derselben Fläche." },
    { href: "/technik/parkregler", titel: "Parkregler", text: "Netzanschluss großer Anlagen nach TOR." },
  ],

  quellen: [
    { titel: "Wikipedia – Liste österreichischer Kraftwerke, Solarkraftwerke (Floating-PV Grafenwörth)", url: "https://de.wikipedia.org/wiki/Liste_%C3%B6sterreichischer_Kraftwerke", stand: "09/2026" },
    { titel: "meinbezirk.at – Floating-Photovoltaikanlage: Leuchtturmprojekt in Grafenwörth eröffnet (13.05.2023)", url: "https://www.meinbezirk.at/tulln/c-wirtschaft/leuchtturmprojekt-in-grafenwoerth-eroeffnet_a6045759", stand: "09/2026" },
    { titel: "RIS – EAG-Investitionszuschüsseverordnung-Strom, § 6 (innovative Photovoltaikanlagen)", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40275221/NOR40275221.html", stand: "09/2026" },
    { titel: "RIS – NÖ Raumordnungsgesetz 2014, § 20 (Grünland-Photovoltaikanlagen, künstliche Gewässer)", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LNO40086867/LNO40086867.html", stand: "09/2026" },
    { titel: "Gesetze im Internet – § 36 Wasserhaushaltsgesetz (Deutschland), Solaranlagen auf Gewässern", url: "https://www.gesetze-im-internet.de/whg_2009/__36.html", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Schwimmende Photovoltaik (FPV)", url: "https://www.ise.fraunhofer.de/de/geschaeftsfelder/solarkraftwerke-und-integrierte-photovoltaik/integrierte-photovoltaik/schwimmende-photovoltaik-fpv.html", stand: "09/2026" },
    { titel: "EU JRC – PVGIS 5.3 (Ertragsvergleich Landanlage)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Baggersee oder Teich?", text: "Wir prüfen Potenzial, Genehmigung und Netz.", href: "/freiflaechen-photovoltaik", label: "Projekt anfragen" },
  cta: {
    title: "Schwimmende PV auf Ihrem Gewässer?",
    text: "Wir prüfen Wasserfläche, Genehmigungslage, Netzanschluss und Förderung – und planen die Anlage gemeinsam mit Gewässer- und Statikgutachtern.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Freiflächenanlagen", href: "/freiflaechen-photovoltaik" },
  },
};

export default artikel;
