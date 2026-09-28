// Ratgeber: Photovoltaik für Hotels, Tourismus und Bergbahnen (Gruppe R1)
// Beispielrechnung 150 kWp mit dem gemeinsamen R1-Rechenkern (pvcalc.mjs), gerundet als Text eingetragen.
// Grundannahmen: 750 €/kWp netto, 1.000 kWh/kWp (Variante 1.100 alpin), 0,4 % Degradation, 18 ct/kWh (+2 %/a),
// Überschuss 6 ct/kWh, Betriebskosten 15 €/kWp (+2 %/a), 25 Jahre, Kalkulationszins 5 %.

const artikel = {
  slug: "photovoltaik-hotel",
  title: "Photovoltaik für Hotels, Tourismus und Bergbahnen in Österreich",
  seoTitle: "Photovoltaik für Hotels & Bergbahnen 2026 | Ökovolt",
  kurzTitel: "Photovoltaik für Hotels",
  description:
    "Photovoltaik für Hotels, Tourismus und Bergbahnen: Lastprofile, Saisonbetrieb, Beispiel 150 kWp, alpine Technik, EAG-Zuschlag für Parkplätze, IFB 22 %.",
  excerpt:
    "Wie sich Photovoltaik in Hotellerie, Tourismus und bei Bergbahnen rechnet: Lastprofile von Küche, Wellness und Liften, Zwei-Saison- gegenüber Winterbetrieb, Beispielrechnung für 150 kWp, alpine Technik, Förderung und glaubwürdige Gästekommunikation.",
  hauptKeyword: "photovoltaik hotel",
  keywords: [
    "Photovoltaik Hotel",
    "PV-Anlage Hotel Österreich",
    "Photovoltaik Tourismus",
    "Photovoltaik Bergbahn Seilbahn",
    "Photovoltaik Wellnesshotel",
    "Solarcarport Hotelparkplatz",
    "Photovoltaik Skigebiet",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/AT/ratgeber/photovoltaik-hotel.jpg",
  bildAlt: "Solar-Skilift in Tenna (Graubünden): Photovoltaikmodule über der Schlepplifttrasse",
  badge: { wert: "5,2 J.", text: "Amortisation 150 kWp im Ganzjahres-Hotel bei 80 % Eigenverbrauch" },

  kurzFazit: [
    "**Für Hotels mit Sommer- oder Ganzjahresbetrieb gehört Photovoltaik zu den wirtschaftlichsten Energieinvestitionen:** Küche, Kühlung, Wäscherei, Wellness und Klimatisierung verbrauchen den Solarstrom zeitgleich.",
    "Eine **150-kWp-Anlage** (112.500 € netto) amortisiert sich bei 80 % Eigenverbrauch nach rund **5 Jahren** vor Steuern, im reinen Winterbetrieb mit 50 % Eigenverbrauch nach rund 7 Jahren, mit nur 35 % nach gut 8 Jahren.",
    "Bei **Bergbahnen** fällt der größte Verbrauch – die Beschneiung – in Winternächte; Photovoltaik deckt eher Sommerbetrieb, Gastronomie und Werkstätten. PV an Tal- und Bergstationen soll künftig ohne aufwendige Genehmigung möglich sein.",
    "**Förderung und Steuer:** EAG-Zuschuss Kategorie C/D, +30 % Innovationszuschlag für Parkplatzüberdachungen ab 10 Stellplätzen, Öko-Investitionsfreibetrag 22 % bis Ende 2026.",
    "Alpine Standorte brauchen **Schneelast-, Hagel- und Windnachweise**; Glas-Glas- und bifaziale Module sowie Fassadenanlagen verbessern Winterertrag und Haltbarkeit.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich Photovoltaik für Hotels und Bergbahnen?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Photovoltaik lohnt sich für Hotels vor allem dann, wenn das Haus im Sommer geöffnet ist – dann fallen hoher Stromverbrauch und hoher Solarertrag zusammen.** Ein Zwei-Saison- oder Ganzjahresbetrieb erreicht leicht 70 bis 80 % Eigenverbrauch, weil Küche, Kältetechnik, Wäscherei, Wellness und Klimatisierung tagsüber laufen. Reine Winterbetriebe verbrauchen dagegen genau dann viel, wenn die Anlage wenig liefert, und speisen im Sommer den Großteil ein.",
        },
        {
          typ: "p",
          text: "Bei Bergbahnen ist die Lage differenzierter: Die Beschneiung braucht Strom vor allem im November und Dezember, häufig nachts. Photovoltaik trägt dort zu Sommerbetrieb, Gastronomie, Garagen und Werkstätten bei, und Überschüsse lassen sich über Speicher oder eine Energiegemeinschaft mit Hotels und Gemeinde nutzen. Lösungen für die Branche bündelt die Seite [Photovoltaik für Hotellerie und Tourismus](/hotellerie-tourismus).",
        },
      ],
    },
    {
      id: "lastprofile",
      titel: "Lastprofile in Hotellerie und Tourismus",
      tocLabel: "Lastprofile",
      bloecke: [
        {
          typ: "p",
          text: "**Wie gut Photovoltaik passt, entscheidet der Lastgang: Tagsüber laufende und verschiebbare Verbraucher erhöhen den Eigenverbrauch, nächtliche und winterliche Spitzen senken ihn.** Die Viertelstundenwerte der letzten zwölf Monate erhalten Sie vom Netzbetreiber.",
        },
        {
          typ: "tabelle",
          caption: "Typische Verbraucher in Hotels und Bergbahnen und ihre Passung zur PV-Erzeugung",
          kopf: ["Verbraucher", "Hauptlastzeit", "Passung zur PV"],
          zeilen: [
            ["Kühlung, Kältetechnik", "ganztägig, im Sommer höher", "sehr gut"],
            ["Klimatisierung", "Sommer, mittags und nachmittags", "sehr gut"],
            ["Wäscherei", "tagsüber, zeitlich verschiebbar", "sehr gut"],
            ["Küche", "Frühstück, Mittag, Abend", "mittel bis gut"],
            ["Wellness, Sauna, Pool", "ganztägig, Spitze am Nachmittag und Abend", "mittel, mit Speicher oder Wärmepumpe gut"],
            ["Wärmepumpe für Warmwasser und Pool", "steuerbar", "gut, wenn auf Mittag gelegt"],
            ["Ladestationen für Gäste", "Anreise nachmittags, Laden über Nacht", "mittel, mit Lastmanagement besser"],
            ["Lifte und Seilbahnen", "Winter tagsüber, teils Sommerbetrieb", "Winter gering, Sommer gut"],
            ["Beschneiung", "November bis Jänner, oft nachts", "schlecht"],
          ],
          minBreite: 620,
          fussnote: "Qualitative Einordnung; die tatsächliche Passung ergibt sich aus der Simulation mit Ihrem Lastgang.",
        },
      ],
    },
    {
      id: "saison",
      titel: "Zwei-Saison-Betrieb oder reiner Winterbetrieb: Der Eigenverbrauch entscheidet",
      tocLabel: "Saisonbetrieb",
      bloecke: [
        {
          typ: "p",
          text: "**Der größte Teil des Solarertrags fällt zwischen April und September an – ein Haus, das in dieser Zeit geschlossen ist, kann ihn nur zu einem kleinen Teil selbst nutzen.** Für einen reinen Winterbetrieb heißt das: Die Anlage eher kleiner und steiler auslegen, Fassadenflächen für die tiefstehende Wintersonne nutzen und den Sommerüberschuss vermarkten oder über eine Energiegemeinschaft weitergeben.",
        },
        {
          typ: "liste",
          punkte: [
            "**Zwei-Saison- und Ganzjahresbetrieb:** Anlage am Sommerlastgang ausrichten, Wärmepumpe, Pool und Wäscherei in die Mittagsstunden legen.",
            "**Winterbetrieb:** steile Modulneigung oder Fassade, bifaziale Module über Schnee, Überschuss über [Direktvermarktung](/service/direktvermarktung) oder Energiegemeinschaft verwerten.",
            "**Revisionszeiten:** Umbauten und Wartungsarbeiten in der Zwischensaison nutzen den Solarstrom zumindest teilweise.",
          ],
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: Hotel mit 150 kWp",
      tocLabel: "Beispiel 150 kWp",
      bloecke: [
        {
          typ: "p",
          text: "**Eine 150-kWp-Anlage für 112.500 € netto amortisiert sich bei 80 % Eigenverbrauch nach 5,2 Jahren, bei 50 % nach 6,9 Jahren und bei 35 % nach 8,4 Jahren – jeweils vor Steuern und ohne Förderung.** Die Anlage erzeugt im ersten Jahr rund 150.000 kWh, in guten alpinen Lagen rund 165.000 kWh.",
        },
        {
          typ: "tabelle",
          caption: "Hotel mit 150 kWp Photovoltaik: Szenarien über 25 Jahre, vor Steuern, Stand September 2026",
          kopf: ["Szenario", "Vorteil Jahr 1", "Amortisation", "IRR", "Kapitalwert (5 %)"],
          zeilen: [
            ["Ganzjahres- oder Zwei-Saison-Hotel, EV 80 %", "21.150 €", "5,2 Jahre", "19,9 %", "229.000 €"],
            ["Reiner Winterbetrieb, EV 50 %", "15.750 €", "6,9 Jahre", "14,4 %", "132.000 €"],
            ["Reiner Winterbetrieb, EV 35 %", "13.050 €", "8,4 Jahre", "11,3 %", "84.000 €"],
            ["Alpine Lage 1.100 kWh/kWp, EV 80 %", "23.490 €", "4,7 Jahre", "22,1 %", "267.000 €"],
            ["Alpine Lage 1.100 kWh/kWp, EV 50 %", "17.550 €", "6,2 Jahre", "16,1 %", "161.000 €"],
          ],
          markierteZeile: 0,
          hervorheben: 2,
          minBreite: 680,
          fussnote: "Beispielrechnung, kein Angebot. Annahmen: 750 €/kWp netto (Richtwert inkl. alpiner Anforderungen), 1.000 kWh/kWp (Variante 1.100), 0,4 % Degradation, vermeidbarer Strompreis 18 ct/kWh netto mit +2 %/Jahr, Überschuss 6 ct/kWh, Betriebskosten 15 €/kWp mit +2 %/Jahr, 25 Jahre, dynamische Amortisation. EV = Anteil der Erzeugung, der im Haus verbraucht wird.",
        },
        {
          typ: "p",
          text: "Mit EAG-Zuschuss der Kategorie D (Höchstsatz 120 €/kWp = 18.000 €) verkürzt sich die Amortisation auf 4,4 Jahre (EV 80 %) bzw. 5,9 Jahre (EV 50 %). Nach 23 % KöSt mit 22 % Investitionsfreibetrag liegt der interne Zinsfuß bei 17,2 % (EV 80 %) bzw. 12,5 % (EV 50 %). Bei Familienbetrieben als Einzelunternehmen oder Personengesellschaft gilt der progressive Einkommensteuertarif; der Steuereffekt ist dann individuell. Die Rechenmethode erklärt [Amortisation und Rendite berechnen](/ratgeber/photovoltaik-amortisation), die Steuerinstrumente [Photovoltaik für Unternehmen](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "speicher-laden-waerme",
      titel: "Speicher, Ladestationen für Gäste und Wärmepumpe",
      tocLabel: "Speicher, Laden, Wärme",
      bloecke: [
        {
          typ: "p",
          text: "**Speicher, Ladestationen und Wärmepumpen verschieben Verbrauch in die Sonnenstunden oder Solarstrom in den Abend – sie sind im Hotel oft wirksamer als eine größere Anlage.**",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Speicher", text: "Deckt Abendspitzen von Küche und Wellness, kann den Leistungspreis senken und – entsprechend ausgelegt – Ersatzstrom für Kühlung, Notbeleuchtung und IT liefern. Siehe [Gewerbespeicher](/gewerbespeicher) und [Blackout-Vorsorge](/ratgeber/blackout-vorsorge-unternehmen)." },
            { titel: "Ladestationen", text: "Laden für Gäste und Mitarbeitende mit Lastmanagement, bevorzugt tagsüber für Tagesgäste und Mitarbeitende. Planung unter [Ladeinfrastruktur](/ladeinfrastruktur) und [E-Flotte laden](/ratgeber/e-flotte-laden-photovoltaik)." },
            { titel: "Wärmepumpe und Pool", text: "Warmwasser und Beckenwasser sind gute thermische Speicher: Mittags aufheizen, abends nutzen. Mehr unter [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik)." },
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          text: "Stationäre Stromspeicher zählen zu den ökologischen Wirtschaftsgütern für den Investitionsfreibetrag; Ladestationen nur, wenn sie ausschließlich mit Strom aus erneuerbaren Quellen betrieben werden. Speicher werden gemeinsam mit neuer PV beim EAG-Investitionszuschuss mit 150 €/kWh gefördert (max. 50 kWh förderfähig).",
        },
      ],
    },
    {
      id: "alpin",
      titel: "Alpine Technik: Schnee, Hagel, Module und Fassade",
      tocLabel: "Alpine Technik",
      bloecke: [
        {
          typ: "p",
          text: "**In alpinen Lagen bestimmen Schneelast, Hagel und Wind die Technik – und damit Sicherheit, Versicherbarkeit und Kosten.** Gleichzeitig bieten Höhenlagen mehr Einstrahlung, niedrige Modultemperaturen und Reflexion vom Schnee.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Schneelast:** Bemessung nach ÖNORM B 1991-1-3; Schneelastzone und Seehöhe lassen sich über das Naturgefahrenportal HORA ermitteln. Modul-Prüflast und Unterkonstruktion müssen dazu passen – siehe [Schneelast](/ratgeber/schneelast-photovoltaik).",
            "**Dachlawinen:** Schneefang, Abstände zu Wegen und Eingängen und die Last auf darunterliegende Bauteile mitplanen.",
            "**Hagel:** Module mit hoher Hagelwiderstandsklasse laut Hagelregister wählen und mit dem Versicherer abstimmen – siehe [Hagelschutz](/ratgeber/hagel-photovoltaik).",
            "**Module:** Glas-Glas-Module sind robuster gegen mechanische Last und Feuchte; [bifaziale](/wissen/lexikon#bifazial) Module nutzen Schneereflexion auf der Rückseite.",
            "**Fassade:** Senkrechte Module liefern im Winter bei tiefstehender Sonne gut, bleiben schneefrei und prägen die Architektur.",
            "**Winterbetrieb der Anlage:** Ertragsverhalten und Schneeabrutsch erklärt [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).",
          ],
        },
      ],
    },
    {
      id: "bergbahnen",
      titel: "Bergbahnen: PV an Tal- und Bergstationen",
      tocLabel: "Bergbahnen",
      bloecke: [
        {
          typ: "p",
          text: "**PV-Anlagen im Bereich von Seilbahnen sollen nach dem Entbürokratisierungspaket des Bundes künftig einfacher und ohne aufwendige Genehmigungsverfahren errichtet werden können.** Laut PV&B Austria liegt der Schwerpunkt auf bestehenden Infrastrukturflächen – Tal- und Bergstationen, technischen Einrichtungen, Gebäuden und bereits versiegelten Flächen. Die Detailregelungen sollten Sie vor der Planung mit der zuständigen Behörde abklären.",
        },
        {
          typ: "p",
          text: "Wirtschaftlich zählt auch hier der Eigenverbrauch: Liftantriebe laufen im Winter tagsüber, wenn die Erzeugung gering ist, die Beschneiung vor allem nachts. Sommerbetrieb, Bergrestaurants, Werkstätten und Garagen passen besser. Das Titelbild zeigt ein Beispiel aus der Schweiz, bei dem die Module direkt über der Schlepplifttrasse montiert sind. Überschüsse lassen sich über eine [Energiegemeinschaft](/energiegemeinschaften) mit Hotels, Betrieben und Gemeinde im Tal nutzen – die Voraussetzungen erklärt [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe). Größere Anlagen brauchen einen Netzanschluss nach [TOR Erzeuger](/ratgeber/tor-erzeuger-netzanschluss).",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung und Steuern: EAG, Parkplatzüberdachung und IFB",
      tocLabel: "Förderung & Steuern",
      bloecke: [
        {
          typ: "p",
          text: "**Hotels und Bergbahnen nutzen dieselben Förderinstrumente wie andere Betriebe: EAG-Investitionszuschuss, Öko-Investitionsfreibetrag und AfA – mit einer Besonderheit für Gästeparkplätze.** Parkplatzüberdachungen ab 10 Stellplätzen, bei denen die Module die Überdachung bilden, gelten als innovative PV und erhalten beim EAG-Investitionszuschuss einen Zuschlag von 30 %.",
        },
        {
          typ: "tabelle",
          caption: "Förder- und Steuerinstrumente für PV in Hotellerie und Tourismus, Stand September 2026",
          kopf: ["Instrument", "Regel 2026", "Hinweis"],
          zeilen: [
            ["EAG Kategorie C", "> 20 bis 100 kWp, max. 130 €/kWp", "Gebot in €/kWp, mit Landesförderung kombinierbar"],
            ["EAG Kategorie D", "> 100 bis 1.000 kWp, max. 120 €/kWp", "nicht mit Landesförderung kombinierbar"],
            ["Innovative PV", "+30 % Zuschlag", "u. a. Parkplatzüberdachung ab 10 Stellplätzen, gebäudeintegrierte PV"],
            ["Made in Europe", "+10 % je für Module und Wechselrichter", "Nachweis über Herstellerliste"],
            ["Öko-IFB", "22 % bis 31.12.2026, danach 15 %", "zusätzlich zur AfA über 20 Jahre"],
          ],
          minBreite: 640,
          fussnote: "EAG-Investitionszuschüsseverordnung-Strom idF BGBl. II Nr. 12/2026: Antrag vor Inbetriebnahme, Genehmigungen und Netzanschlussbestätigung müssen vorliegen; max. 30 % der förderfähigen Kosten, mit Zuschlägen je nach Unternehmensgröße bis 65/55/45 %. Letzter Call 2026: 8.–22. Oktober. Keine Steuer- oder Förderberatung.",
        },
        {
          typ: "p",
          text: "Wie ein Solarcarport für den Gästeparkplatz geplant wird, zeigt [Solarcarport](/ratgeber/solarcarport). Ablauf und Fristen des Zuschusses erklärt [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss); welche Bundes- und Landesprogramme für Ihr Projekt in Frage kommen, klärt der [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "kommunikation",
      titel: "Nachhaltigkeit kommunizieren – ohne Greenwashing",
      tocLabel: "Gästekommunikation",
      bloecke: [
        {
          typ: "p",
          text: "**Glaubwürdig ist, was sich messen lässt: erzeugte Kilowattstunden, Anteil am Stromverbrauch des Hauses, geladene Kilowattstunden für Gäste.** Pauschale Aussagen wie „klimaneutrales Hotel“ sind riskant. Die EU-Richtlinie 2024/825 zur Stärkung der Verbraucher für den ökologischen Wandel schränkt allgemeine Umweltaussagen ein und ist ab 27. September 2026 anzuwenden.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Konkrete Zahlen aus dem Monitoring nennen, mit Zeitraum und Bezugsgröße.",
            "Eigenerzeugung und zugekauften Ökostrom getrennt darstellen.",
            "Keine Klimaneutralitätsaussagen, die nur auf Kompensation beruhen.",
            "Anlage sichtbar machen: Anzeige in der Lobby, Informationen in der Gäste-App, Führung für Gäste.",
          ],
        },
        {
          typ: "p",
          text: "Für Nachhaltigkeitsberichte, Scope-2-Emissionen und Anforderungen von Reiseveranstaltern und Firmenkunden siehe [CSRD, ESG und Photovoltaik](/ratgeber/csrd-esg-photovoltaik). Videos und Imagespots zur eigenen Anlage entstehen über das [Nachhaltigkeitsmarketing](/service/nachhaltigkeitsmarketing).",
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So gehen Hotels und Bergbahnen vor",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "p",
          text: "**Am besten planen Sie das Projekt in der Saison und bauen in der Zwischensaison – so stören Kran, Dacharbeiten und Stromabschaltungen den Gästebetrieb nicht.** Weil Netzzugang, Statik und gegebenenfalls Förderansuchen Vorlauf brauchen, sollte die Planung mindestens ein halbes Jahr vor dem gewünschten Montagefenster beginnen.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Lastgang und Saisonprofil auswerten", "Zwölf Monate Viertelstundenwerte, getrennt nach Saison, Zwischensaison und Schließzeiten."],
            ["Flächen prüfen", "Dächer, Fassaden, Parkplätze, Tal- und Bergstationen – inklusive Statik, Schneelast und Brandschutz."],
            ["Auslegung und Wirtschaftlichkeit", "Anlagengröße, Speicher, Ladepunkte und Überschussvermarktung ohne Förderung durchrechnen."],
            ["Netz und Förderung", "Netzzugangsantrag stellen, Genehmigungen einholen, EAG-Antrag vor Inbetriebnahme im offenen Call einbringen."],
            ["Montage in der Zwischensaison", "Montagefenster mit Revisionsarbeiten abstimmen, Inbetriebnahme vor der nächsten Saison."],
            ["Betrieb und Kommunikation", "Monitoring, Wartung, Versicherung – und die Zahlen für die Gästekommunikation."],
          ],
        },
      ],
    },
    {
      id: "chalets",
      titel: "Chalets und Premium-Objekte in alpiner Lage",
      tocLabel: "Chalets",
      bloecke: [
        {
          typ: "p",
          text: "**Bei Luxus-Chalets zählen neben der Wirtschaftlichkeit Architektur, Schneesicherheit und ein Betrieb ohne Aufwand für Eigentümer und Gäste.** Hohe Schneelasten verlangen passende Module und Unterkonstruktionen, Indach-Lösungen fügen sich in die Dachlandschaft ein, und eine Wartung mit Concierge-Service hält die Anlage über Jahre im Blick. Mehr unter [Photovoltaik für Chalets](/chalets).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Lohnt sich Photovoltaik für ein Hotel?",
      a: "Für Häuser mit Sommer- oder Ganzjahresbetrieb in der Regel sehr: Unser 150-kWp-Beispiel amortisiert sich bei 80 % Eigenverbrauch nach rund 5 Jahren vor Steuern. Reine Winterbetriebe brauchen bei 35 bis 50 % Eigenverbrauch etwa 7 bis 8,5 Jahre.",
    },
    {
      q: "Lohnt sich Photovoltaik für einen reinen Wintersaison-Betrieb?",
      a: "Ja, aber mit angepasster Planung: steile Neigung oder Fassade für die Wintersonne, eher kleinere Anlage und eine Lösung für den Sommerüberschuss, etwa Direktvermarktung oder Energiegemeinschaft. In unserem Beispiel liegt die Amortisation bei 50 % Eigenverbrauch bei rund 7 Jahren.",
    },
    {
      q: "Kann Photovoltaik die Beschneiung eines Skigebiets versorgen?",
      a: "Nur zu einem kleinen Teil. Beschneit wird vor allem im Frühwinter und oft nachts, wenn die Anlage wenig oder nichts erzeugt. Sinnvoller ist PV für Sommerbetrieb, Gastronomie und Werkstätten; Überschüsse können über Speicher oder Energiegemeinschaften genutzt werden.",
    },
    {
      q: "Gibt es eine höhere Förderung für einen Solarcarport am Hotelparkplatz?",
      a: "Ja. Parkplatzüberdachungen ab 10 Stellplätzen, bei denen die Module die Überdachung bilden, gelten beim EAG-Investitionszuschuss als innovative PV und erhalten einen Zuschlag von 30 %. Der Antrag ist vor der Inbetriebnahme in einem offenen Fördercall einzubringen.",
    },
    {
      q: "Welche Module eignen sich für alpine Hotels?",
      a: "Glas-Glas-Module mit hoher zulässiger Schneelast und hoher Hagelwiderstandsklasse; bifaziale Module können die Reflexion vom Schnee nutzen. Die Unterkonstruktion muss nach ÖNORM B 1991-1-3 für die örtliche Schneelast bemessen sein.",
    },
    {
      q: "Dürfen Hotels mit Solarstrom werben?",
      a: "Ja, mit konkreten, belegbaren Angaben wie erzeugten Kilowattstunden oder dem Anteil am Stromverbrauch. Pauschale Aussagen wie „klimaneutral“ sind riskant, zumal die EU-Regeln gegen Greenwashing ab 27. September 2026 anzuwenden sind.",
    },
  ],

  passend: [
    { href: "/hotellerie-tourismus", titel: "Hotellerie und Tourismus", text: "PV-Lösungen für Hotels, Gastronomie und Bergbahnen." },
    { href: "/chalets", titel: "Photovoltaik für Chalets", text: "Premium-Anlagen in alpiner Lage." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Abendspitzen decken, Leistungspreis senken." },
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur", text: "Laden für Gäste und Mitarbeitende." },
  ],

  quellen: [
    { titel: "OeMAG – EAG-Investitionszuschüsseverordnung-Strom, konsolidierte Fassung vom 19.01.2026 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "01/2026" },
    { titel: "PV&B Austria – PV-Ausbau bei Seilbahnen wird deutlich vereinfacht", url: "https://pvbaustria.at/boost-fuer-energiewende-pv-ausbau-bei-seilbahnen-wird-deutlich-vereinfacht/", stand: "04/2026" },
    { titel: "USP – Investitionsfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "09/2026" },
    { titel: "Eurostat – Strompreise für Nicht-Haushaltskunden (nrg_pc_205)", url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table", stand: "09/2026" },
    { titel: "HORA – Natural Hazard Overview & Risk Assessment Austria", url: "https://www.hora.gv.at/", stand: "09/2026" },
    { titel: "Österreichisches Hagelregister – Hagelwiderstandsklassen", url: "https://www.hagelregister.at/", stand: "09/2026" },
    { titel: "EUR-Lex – Richtlinie (EU) 2024/825 zur Stärkung der Verbraucher für den ökologischen Wandel", url: "https://eur-lex.europa.eu/eli/dir/2024/825/oj", stand: "09/2026" },
  ],

  seitenCta: { titel: "PV für Ihr Hotel?", text: "Anlage passend zu Saison, Lastgang und alpinem Standort planen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Solarstrom für Hotel, Bergbahn und Chalet.",
    text: "Ökovolt plant, montiert und meldet PV-Anlagen in ganz Österreich aus einer Hand – mit eigener Fernwartung und eigenem Parkregler für größere Anlagen.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Förder-Check", href: "/foerdercheck" },
  },
};

export default artikel;
