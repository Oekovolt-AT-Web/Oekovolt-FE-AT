// Ratgeber: Batteriegroßspeicher (BESS) in Österreich – Zukunftsthema
// Arbitrage-Obergrenze: eigene Auswertung der Day-Ahead-Stundenpreise Gebotszone AT
// (Energy-Charts, Fraunhofer ISE) für einen 2-MW/4-MWh-Speicher, 1 Zyklus pro Tag,
// perfekte Voraussicht, Laden vor Entladen, Wirkungsgrad 88 % (Abruf 28.09.2026).
// Regelreserve-Volumina: APG. Netzentgelte 2026: SNE-V 2018 idF BGBl. II Nr. 305/2025.
// Rahmen ab 2027: ElWG (BGBl. I Nr. 91/2025), SNE-G-V-Entwurf der E-Control (Begutachtung 2026).

const SPREIZUNG = { 2024: 102, 2025: 119, 2026: 149 }; // €/MWh, Mittel teuerste minus billigste Stunde je Tag
const ARBITRAGE_2MW4MWH = { 2024: 126100, 2025: 149900, 2026: 196700 }; // € pro Jahr, 2026 hochgerechnet
const REGELRESERVE = [
  ["FCR (Primärregelung)", "30 Sekunden", "±75 MW (2026)", "täglich, 6 × 4 h, Einheitspreis", "nur Leistungspreis"],
  ["aFRR (Sekundärregelung)", "5 Minuten, automatisch", "±225 MW", "täglich (D-1), 6 × 4 h, Gebotspreis", "Leistung + Arbeit (15-min-Produkte)"],
  ["mFRR (Tertiärregelung)", "bis 12,5 Minuten, abgerufen", "+255 / −195 MW (ab 1.5.2026)", "täglich (D-1), 6 × 4 h, Gebotspreis", "Leistung + Arbeit (15-min-Produkte)"],
];

// Beispiel Netzentgelte 2026 ohne Befreiung, Netzebene 5, Netzbereich Oberösterreich
const LP_NE5_OOE = 57.72; // €/kW und Jahr
const AP_NE5_OOE = 1.29; // ct/kWh
const NV_NE5_OOE = 0.197; // ct/kWh Netzverlustentgelt
const LEISTUNG_KW = 2000;
const LADUNG_MWH_JAHR = (4 / 0.88) * 365; // Netzbezug bei 1 Vollzyklus pro Tag

const de = (n, st = 0) => n.toLocaleString("de-AT", { minimumFractionDigits: st, maximumFractionDigits: st });
const eur = (n) => de(Math.round(n / 100) * 100) + " €";
const netzLp = LEISTUNG_KW * LP_NE5_OOE;
const netzAp = LADUNG_MWH_JAHR * 1000 * ((AP_NE5_OOE + NV_NE5_OOE) / 100);

const artikel = {
  slug: "grossspeicher-bess",
  title: "Batteriegroßspeicher (BESS) in Österreich: Erlöse, Regeln, Grenzen",
  seoTitle: "Batteriegroßspeicher BESS Österreich 2026 | Ökovolt",
  kurzTitel: "Batteriegroßspeicher",
  description:
    "Batteriegroßspeicher in Österreich: Arbitrage, Regelreserve, Co-Location mit PV, Netzentgelte und ElWG-Befreiung ab 2027 – Beispielrechnung 2 MW / 4 MWh.",
  excerpt:
    "Wie Batteriegroßspeicher ab einem Megawatt in Österreich Geld verdienen, welche Regeln ab 2027 gelten und wo die Grenzen liegen – nüchtern gerechnet mit echten Marktdaten.",
  hauptKeyword: "batteriegroßspeicher österreich",
  keywords: [
    "Batteriegroßspeicher Österreich",
    "BESS Österreich",
    "Großspeicher Photovoltaik",
    "Batteriespeicher Arbitrage",
    "Speicher Netzentgelt ElWG",
    "systemdienlicher Speicher",
    "Co-Location PV Speicher",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/grossspeicher-bess.jpg",
  bildAlt: "Batteriegroßspeicher mit vielen Speichercontainern und Umspannanlage, Luftaufnahme",
  badge: { wert: `${SPREIZUNG[2025]} €/MWh`, text: "mittlere Tages-Preisspreizung Day-Ahead AT 2025" },

  kurzFazit: [
    "**Ein Batteriegroßspeicher (BESS) ist ein netzgekoppelter Speicher ab etwa 1 MW Leistung, der Strom zu günstigen Zeiten aufnimmt und zu teuren abgibt oder Regelreserve für die Netzfrequenz bereitstellt.**",
    `Die mittlere tägliche Spreizung zwischen teuerster und billigster Stunde lag in der Gebotszone Österreich 2024 bei ${SPREIZUNG[2024]} €/MWh, 2025 bei ${SPREIZUNG[2025]} €/MWh und 2026 bisher bei ${SPREIZUNG[2026]} €/MWh.`,
    `Ein 2-MW/4-MWh-Speicher hätte 2025 mit einem Zyklus pro Tag am Day-Ahead-Markt theoretisch rund ${eur(ARBITRAGE_2MW4MWH[2025])} erlöst – eine Obergrenze bei perfekter Voraussicht, vor Netzentgelten, Degradation und Betriebskosten.`,
    "Der österreichische Regelreservebedarf ist mit einigen hundert Megawatt klein; bei starkem Speicherzubau sinken die Preise. Erlöse müssen deshalb aus mehreren Quellen kommen.",
    "Ab 2027 sollen systemdienliche Speicher ab 1 MW laut ElWG bis zu 20 Jahre vom Netznutzungs- und Netzverlustentgelt für den Bezug befreit werden – gedeckelt auf 5 GW österreichweit (Entwurf der E-Control).",
  ],

  abschnitte: [
    {
      id: "definition",
      titel: "Was ist ein Batteriegroßspeicher?",
      tocLabel: "Definition & Aufbau",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Batteriegroßspeicher – international Battery Energy Storage System, kurz [BESS](/wissen/lexikon#bess) – ist eine Anlage aus vielen Batteriemodulen, Leistungselektronik und Netzanschluss, die elektrische Energie im Megawattstunden-Maßstab speichert.** Typische Projekte haben eine Leistung von 1 bis 100 MW und eine Speicherdauer von ein bis vier Stunden. Als Zellchemie hat sich Lithium-Eisenphosphat ([LFP](/wissen/lexikon#lfp)) durchgesetzt – robust, zyklenfest und ohne Kobalt.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Batteriecontainer", text: "Vorkonfektionierte Einheiten mit Modulen, Batteriemanagement (BMS), Klimatisierung und Brandschutz, meist 3 bis 5 MWh je 20-Fuß-Container." },
            { titel: "Umrichter und Trafo", text: "Power Conversion Systems (PCS) wandeln Gleich- in Wechselstrom; ein Transformator bindet den Speicher in Mittel- oder Hochspannung ein." },
            { titel: "Steuerung", text: "Energiemanagement, SCADA und Parkregler setzen Fahrpläne, Regelreserve-Abrufe und Vorgaben des Netzbetreibers um – sekundengenau und dokumentiert." },
          ],
        },
        {
          typ: "p",
          text: "Vom Gewerbespeicher im Betrieb unterscheidet sich der Großspeicher vor allem im Geschäftsmodell: Er dient nicht in erster Linie dem Eigenverbrauch eines Standorts, sondern handelt am Strommarkt, stellt Systemdienstleistungen bereit oder verschiebt die Einspeisung eines Solarparks. Die Grenze ist fließend – ein großer [Gewerbespeicher](/gewerbespeicher) kann ebenfalls vermarktet werden.",
        },
      ],
    },
    {
      id: "erloese",
      titel: "Womit verdient ein Batteriegroßspeicher Geld?",
      tocLabel: "Erlösquellen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Großspeicher verdient Geld mit Preisunterschieden am Strommarkt (Arbitrage), mit Regelreserve für den Übertragungsnetzbetreiber APG, mit der Verschiebung von PV-Strom und künftig mit Flexibilitätsleistungen für Netzbetreiber.** Wirtschaftlich tragfähig sind Projekte meist nur, wenn sie mehrere dieser Quellen kombinieren – Fachleute sprechen von Revenue Stacking.",
        },
        {
          typ: "tabelle",
          caption: "Erlösquellen eines Batteriegroßspeichers in Österreich, Stand September 2026",
          kopf: ["Erlösquelle", "Prinzip", "Treiber", "Risiko"],
          zeilen: [
            ["Day-Ahead-Arbitrage", "billig laden (Mittag, Nacht), teuer entladen (Abend)", "Preisspreizung, Zahl der Zyklen", "sinkende Spreizung bei mehr Speichern"],
            ["Intraday-Handel", "Prognoseabweichungen im Viertelstundenmarkt ausgleichen", "Volatilität, Handelssoftware", "Prognosequalität, Handelskosten"],
            ["Regelreserve (FCR, aFRR, mFRR)", "Leistung vorhalten, bei Abruf liefern oder aufnehmen", "Leistungs- und Arbeitspreise", "kleiner Markt, Preisverfall"],
            ["Co-Location mit PV", "Mittagsstrom des Solarparks in den Abend verschieben", "Solar-Marktwert vs. Abendpreis", "Netzanschluss- und Vertragsgestaltung"],
            ["Netzdienlichkeit", "Engpässe entlasten, Einschränkungen des Netzbetreibers akzeptieren", "Netzentgeltbefreiung ab 2027, Flex-Verträge", "Regeln erst im Entstehen"],
            ["Peak Shaving (Industrie)", "Leistungsspitzen am Standort kappen", "Leistungspreis", "standortgebunden"],
          ],
          minBreite: 760,
          fussnote: "Überblick; die Gewichtung hängt von Standort, Netzebene, Anschlussvertrag und Vermarkter ab. Keine Ertragszusage.",
        },
        { typ: "h3", text: "Arbitrage: Was die Preisspreizung hergibt" },
        {
          typ: "p",
          text: `Die tägliche Spreizung ist der wichtigste Indikator für Arbitrage. In Österreich lag der Abstand zwischen teuerster und billigster Stunde eines Tages 2024 im Mittel bei ${SPREIZUNG[2024]} €/MWh, 2025 bei ${SPREIZUNG[2025]} €/MWh und 2026 bis Ende September bei ${SPREIZUNG[2026]} €/MWh. Treiber sind billige PV-Mittage – bis hin zu [negativen Strompreisen](/ratgeber/negative-strompreise) – und teure Abendstunden, in denen Gaskraftwerke den Preis setzen.`,
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: 2 MW / 4 MWh am Day-Ahead-Markt",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Speicher mit 2 MW Leistung und 4 MWh Kapazität hätte 2025 mit einem Vollzyklus pro Tag am österreichischen Day-Ahead-Markt maximal rund ${eur(ARBITRAGE_2MW4MWH[2025])} brutto erlöst.** Die Zahl ist bewusst als Obergrenze gerechnet: Sie unterstellt, dass der Speicher jeden Tag die günstigsten zwei Stunden zum Laden und die teuersten zwei Stunden danach zum Entladen trifft.`,
        },
        {
          typ: "tabelle",
          caption: "Arbitrage-Obergrenze 2 MW / 4 MWh, ein Zyklus pro Tag, Gebotszone Österreich, Stand September 2026",
          kopf: ["Jahr", "Mittlere Tagesspreizung", "Bruttoerlös pro Jahr", "je MW Leistung"],
          zeilen: [2024, 2025, 2026].map((y) => [
            y === 2026 ? "2026 (bis 27.9., hochgerechnet)" : String(y),
            `${SPREIZUNG[y]} €/MWh`,
            eur(ARBITRAGE_2MW4MWH[y]),
            eur(ARBITRAGE_2MW4MWH[y] / 2),
          ]),
          markierteZeile: 1,
          hervorheben: 2,
          minBreite: 620,
          fussnote: "Eigene Auswertung auf Basis Energy-Charts (Day-Ahead-Stundenpreise AT). Annahmen: je Tag bestes 2-Stunden-Ladefenster vor dem besten 2-Stunden-Entladefenster, perfekte Voraussicht, Wirkungsgrad 88 % (Laden 4,55 MWh, Entladen 4 MWh), keine Viertelstunden-Optimierung, kein Intraday, keine Regelreserve. Vor Netzentgelten, Vermarktungskosten, Degradation, Wartung, Versicherung und Steuern.",
        },
        {
          typ: "p",
          text: "In der Praxis erreichen Vermarkter nur einen Teil dieser Obergrenze, weil Preise vorab prognostiziert werden müssen. Umgekehrt kommen Erlöse aus Intraday-Handel und Regelreserve hinzu, und ein zweiter Zyklus an Tagen mit Morgen- und Abendspitze kann sich lohnen – auf Kosten der Lebensdauer. Wer ein Projekt bewertet, sollte mehrere Preisszenarien rechnen, nicht nur das Rekordjahr.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Netzentgelte können den Erlös halbieren",
          text: `Ein eigenständiger Speicher gilt beim Laden bis Ende 2026 grundsätzlich als Entnehmer. Auf Netzebene 5 im Netzbereich Oberösterreich hieße das 2026 für 2 MW Bezugsleistung rund ${eur(netzLp)} Leistungspreis pro Jahr (57,72 €/kW) plus rund ${eur(netzAp)} Arbeitspreis und Netzverlustentgelt für etwa ${de(LADUNG_MWH_JAHR)} MWh Ladestrom (1,29 + 0,197 ct/kWh). Vereinfachte Rechnung ohne Sonderverträge wie regelbare Bezugsleistung. Genau diese Doppelbelastung soll die Befreiung systemdienlicher Speicher ab 2027 beseitigen.`,
        },
      ],
    },
    {
      id: "regelreserve",
      titel: "Regelreserve: Was die APG ausschreibt",
      tocLabel: "Regelreserve",
      bloecke: [
        {
          typ: "p",
          text: "**Die Austrian Power Grid (APG) beschafft als Regelzonenführer drei Arten von Regelreserve, um die Netzfrequenz bei 50 Hertz zu halten: FCR, aFRR und mFRR.** Batteriespeicher eignen sich technisch sehr gut, weil sie in Sekundenbruchteilen reagieren. Das Mindestgebot liegt bei 1 MW; kleinere Anlagen können über einen Pool eines Aggregators teilnehmen.",
        },
        {
          typ: "tabelle",
          caption: "Regelreserve in der Regelzone Österreich, Stand September 2026",
          kopf: ["Produkt", "Volle Aktivierung", "Bedarf Österreich", "Ausschreibung", "Vergütung"],
          zeilen: REGELRESERVE,
          minBreite: 760,
          fussnote: "Quelle: APG, Marktinformationen Regelreserve. FCR wird in der internationalen FCR-Kooperation gemeinsam beschafft, aFRR-Energie über die europäische Plattform PICASSO, mFRR-Energie über MARI. Aktivierungszeit mFRR nach europäischem Standardprodukt.",
        },
        {
          typ: "p",
          text: "Der gesamte österreichische Bedarf liegt damit bei einigen hundert Megawatt je Richtung. Schon wenige große Speicherprojekte könnten ihn rechnerisch decken. Wie sich das auf die Preise auswirkt, zeigen Erfahrungen aus Nachbarmärkten: Mit wachsender Speicherkapazität fallen die Leistungspreise für FCR und aFRR deutlich. Mehr zur Funktionsweise und zur Teilnahme kleinerer Anlagen im Ratgeber [Regelenergie und Flexibilität](/ratgeber/regelenergie-flexibilitaet).",
        },
      ],
    },
    {
      id: "rahmen",
      titel: "Rechtsrahmen: Was sich mit dem ElWG ab 2027 ändert",
      tocLabel: "ElWG & Netzentgelte",
      bloecke: [
        {
          typ: "p",
          text: "**Mit dem Elektrizitätswirtschaftsgesetz (ElWG) können systemdienliche Speicher ab 2027 für den Strombezug vom Netznutzungs- und Netzverlustentgelt befreit werden (§ 127 Abs. 3 ElWG).** Welche Speicher als systemdienlich gelten, regelt die Systemnutzungsentgelte-Grundsatzverordnung der E-Control, die 2026 im Entwurf begutachtet wurde.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Engpassleistung mindestens 1 MW; Aggregatoren dürfen Speicher ab je 50 kW bündeln",
            "Anschluss ohne zusätzlichen Netzausbau über die Anschlussanlage hinaus",
            "Standort an einem stark ausgelasteten Netzknoten (Transformatoren in mindestens 20 % der Stunden über 80 % Auslastung)",
            "Vertrag über Flexibilitätsleistungen mit dem Regelzonenführer (§ 140 ElWG)",
            "Netzbetreiber darf den Betrieb in beide Richtungen unentgeltlich innerhalb definierter Grenzen einschränken; tägliche Vorgabe bis 6 Uhr des Vortags",
            "Speicher wird ausschließlich zur Wiedereinspeisung betrieben; Befreiung höchstens 20 Jahre, insgesamt bis 5 GW in Österreich",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Stand: Entwurf",
          text: "Die Kriterien stammen aus dem Begutachtungsentwurf der SNE-G-V (Systemnutzungsentgelte-Grundsatzverordnung, geplante Erlassung bis Oktober 2026, Inkrafttreten 1. Jänner 2027). Die konkreten Tarife legt die Tarifverordnung fest, die Ende 2026 erwartet wird. Planen Sie Projekte mit Szenarien für und gegen die Befreiung. Einen Überblick über das Gesetz gibt der Ratgeber [ElWG für PV-Betreiber](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
        },
        {
          typ: "p",
          text: "Daneben gilt für Speicher mit einer Entladedauer über 24 Stunden künftig ein österreichweit einheitlicher Netztarif, und für den Bezug können Netzbenutzer flexible Leistungsanteile vereinbaren, die der Netzbetreiber zeitweise einschränken darf – dafür sinkt der Leistungspreis für diesen Anteil. Für Einspeiser über 20 kW kommt ab 2027 ein Versorgungsinfrastrukturbeitrag von höchstens 0,05 ct/kWh hinzu.",
        },
      ],
    },
    {
      id: "co-location",
      titel: "Co-Location: Großspeicher am Solarpark",
      tocLabel: "Speicher am Solarpark",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Speicher am selben Netzanschluss wie ein Solarpark verschiebt Mittagsstrom in die Abendstunden und nutzt den vorhandenen Netzanschluss besser aus.** Das ist in Österreich besonders interessant, weil Netzanschlusskapazität knapp ist und der Solar-Marktwert 2025 bei nur rund der Hälfte des durchschnittlichen Börsenpreises lag.",
        },
        {
          typ: "liste",
          punkte: [
            "**Überbauung des Netzanschlusses:** Mehr PV-Leistung als Anschlussleistung installieren und Spitzen in den Speicher laden statt abregeln.",
            "**DC- oder AC-Kopplung:** DC-gekoppelte Speicher teilen sich Wechselrichter mit der PV und vermeiden Umwandlungsverluste, AC-gekoppelte sind flexibler in der Vermarktung.",
            "**Vermarktung aus einer Hand:** Direktvermarkter optimieren PV und Speicher gemeinsam; die Steuerung muss Netzvorgaben (Spitzenkappung, Blindleistung) jederzeit einhalten.",
            "**Förder- und Vertragsfragen:** Bei Anlagen mit EAG-Marktprämie oder PPA muss geklärt sein, wie gespeicherter und aus dem Netz geladener Strom bilanziert wird.",
          ],
        },
        {
          typ: "p",
          text: "Für Planung und Betrieb solcher Kombinationen setzen wir auf eigene [Parkregler](/technik/parkregler) und [SCADA-Systeme](/technik/scada), die Netzbetreiber-Vorgaben, Vermarkter-Fahrpläne und Anlagengrenzen in einer Regelung zusammenführen. Grundlagen zur Freifläche finden Sie unter [Freiflächen-Photovoltaik](/freiflaechen-photovoltaik).",
        },
      ],
    },
    {
      id: "risiken",
      titel: "Grenzen und Risiken – nüchtern betrachtet",
      tocLabel: "Grenzen & Risiken",
      bloecke: [
        {
          typ: "p",
          text: "**Großspeicher sind kein Selbstläufer: Erlöse schwanken, Märkte sättigen sich, und Netzanschluss, Genehmigung und Brandschutz bestimmen den Zeitplan.** Die wichtigsten Risiken:",
        },
        {
          typ: "tabelle",
          caption: "Risiken bei Batteriegroßspeichern und Gegenmaßnahmen, Stand September 2026",
          kopf: ["Risiko", "Worum es geht", "Gegenmaßnahme"],
          zeilen: [
            ["Kannibalisierung", "mehr Speicher glätten Preisspitzen und drücken Regelreservepreise", "konservative Preisszenarien, mehrere Erlösquellen"],
            ["Netzanschluss", "Kapazität am Netzknoten knapp, lange Wartezeiten", "früh anfragen, flexible Anschlussverträge prüfen"],
            ["Regulierung", "Netzentgelte und Befreiungskriterien ab 2027 erst im Entwurf", "Szenarien mit und ohne Befreiung"],
            ["Degradation", "Kapazität sinkt mit Zyklen und Zeit", "Zyklenbudget, Garantie auf Durchsatz, Augmentation einplanen"],
            ["Brandschutz & Genehmigung", "Bau- und Elektrizitätsrecht der Länder, Abstände, Löschkonzept", "Brandschutzkonzept mit Feuerwehr, Container mit Detektion und Löschung"],
            ["Vermarktung", "Qualität von Prognose und Handel entscheidet über Erlös", "erfahrenen Vermarkter wählen, Erlösbeteiligung vs. Fixvergütung vergleichen"],
          ],
          minBreite: 720,
        },
        {
          typ: "p",
          text: "Zur Einordnung der Investition: Laut BloombergNEF fielen die Preise für stationäre Batteriepacks 2025 auf rund 70 US-Dollar je kWh. Die Kosten eines schlüsselfertigen Großspeichers liegen wegen Umrichter, Transformator, Netzanschluss, Brandschutz, Bau und Projektentwicklung deutlich darüber und hängen stark vom Standort ab. Wie sich Speicherkosten zusammensetzen, zeigt der Ratgeber [Gewerbespeicher: Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Vom Standort zum Betrieb: So läuft ein Speicherprojekt",
      tocLabel: "Projektablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Standort und Netz prüfen", "Netzebene, freie Anschlusskapazität und Auslastung des Netzknotens klären; Anfrage beim Netzbetreiber stellen. Siehe [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss)."],
            ["Geschäftsmodell festlegen", "Arbitrage, Regelreserve, Co-Location oder Peak Shaving – daraus folgen Leistung, Kapazität und Speicherdauer."],
            ["Wirtschaftlichkeit mit Szenarien", "Erlöse konservativ, mittel und optimistisch rechnen; Netzentgelte mit und ohne Befreiung; Degradation und Ersatzinvestitionen berücksichtigen."],
            ["Genehmigungen und Brandschutz", "Bau- und elektrizitätsrechtliche Verfahren nach Landesrecht, Brandschutzkonzept, Lärm (Klimatisierung), Zufahrt."],
            ["Technik und Vermarktung", "Speicher, Umrichter, Trafo, Schutztechnik; EMS/SCADA mit Schnittstelle zu Vermarkter, Netzbetreiber und APG; Präqualifikation für Regelreserve."],
            ["Inbetriebnahme und Monitoring", "Abnahme, Netzbetreiber-Tests, laufende Überwachung von Ladezustand, Temperatur und Erlösen."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Ab wann spricht man von einem Batteriegroßspeicher?",
      a: "Eine feste Grenze gibt es nicht. Üblich ist der Begriff ab etwa 1 MW Leistung; diese Schwelle nennt auch der Entwurf der E-Control für die Netzentgeltbefreiung systemdienlicher Speicher. Darunter spricht man meist von Gewerbe- oder Industriespeichern.",
    },
    {
      q: "Wie viel verdient ein Batteriegroßspeicher in Österreich?",
      a: `Das hängt stark von Vermarktung, Netzentgelten und Marktentwicklung ab. Als Obergrenze hätte ein 2-MW/4-MWh-Speicher 2025 mit einem Zyklus pro Tag am Day-Ahead-Markt rund ${eur(ARBITRAGE_2MW4MWH[2025])} brutto erlöst. Realistische Erlöse liegen darunter, können aber durch Intraday-Handel und Regelreserve ergänzt werden.`,
    },
    {
      q: "Zahlen Batteriespeicher in Österreich Netzentgelte?",
      a: "Bis Ende 2026 zahlt ein eigenständiger Speicher für den Strombezug grundsätzlich wie ein Verbraucher. Ab 2027 sollen systemdienliche Speicher ab 1 MW nach § 127 Abs. 3 ElWG bis zu 20 Jahre vom Netznutzungs- und Netzverlustentgelt befreit werden, wenn sie die Kriterien der E-Control erfüllen.",
    },
    {
      q: "Kann ein Batteriespeicher Regelenergie für die APG liefern?",
      a: "Ja, nach erfolgreicher Präqualifikation bei der APG für das jeweilige Produkt (FCR, aFRR oder mFRR). Das Mindestgebot liegt bei 1 MW; kleinere Speicher können über einen Pool eines Aggregators teilnehmen.",
    },
    {
      q: "Lohnt sich ein Großspeicher neben einer PV-Freifläche?",
      a: "Oft ja, weil er den günstigen Mittagsstrom in teurere Abendstunden verschiebt und den Netzanschluss besser ausnutzt. Entscheidend sind die Kosten, die Netzanschlussbedingungen und die Frage, wie Förderung oder PPA mit dem Speicher zusammenspielen.",
    },
    {
      q: "Welche Genehmigungen braucht ein Batteriegroßspeicher?",
      a: "Das richtet sich nach Bau- und Elektrizitätsrecht des jeweiligen Bundeslandes sowie nach Raumordnung, Brandschutz und Lärmschutz. Frühzeitige Abstimmung mit Gemeinde, Behörde und Feuerwehr verkürzt das Verfahren.",
    },
  ],

  passend: [
    { href: "/technik/scada", titel: "SCADA-Systeme", text: "Speicher, PV und Netzvorgaben in einer Leitwarte." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Speicherlösungen für Betriebe und Industrie." },
    { href: "/ratgeber/regelenergie-flexibilitaet", titel: "Regelenergie & Flexibilität", text: "Wie Anlagen an den APG-Märkten teilnehmen." },
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächen-Photovoltaik", text: "Solarparks mit Speicher planen." },
  ],

  quellen: [
    { titel: "Energy-Charts (Fraunhofer ISE) – Day-Ahead-Preise Gebotszone Österreich (eigene Auswertung)", url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=AT", stand: "27.09.2026" },
    { titel: "APG – Regelreserve: Primär-, Sekundär- und Tertiärregelung", url: "https://markt.apg.at/en/power-grid/balancing/", stand: "09/2026" },
    { titel: "E-Control – Entwurf Systemnutzungsentgelte-Grundsatzverordnung (SNE-G-V) samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "2026" },
    { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "09/2026" },
    { titel: "SNE-V 2018 – Novelle 2026, BGBl. II Nr. 305/2025", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "09/2026" },
    { titel: "BloombergNEF – Lithium-ion battery pack prices fall to $108/kWh", url: "https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/", stand: "12/2025" },
  ],

  seitenCta: { titel: "Speicherprojekt prüfen?", text: "Standort, Netzanschluss und Erlösszenarien für Ihren Speicher.", href: "/gewerbespeicher", label: "Zu den Speicherlösungen" },
  cta: {
    title: "Großspeicher planen – mit eigener Regelungstechnik.",
    text: "Wir prüfen Standort und Netzanschluss, rechnen Erlösszenarien und integrieren Speicher mit Parkregler und SCADA in Ihre PV-Anlage.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "SCADA-Systeme", href: "/technik/scada" },
  },
};

export default artikel;
