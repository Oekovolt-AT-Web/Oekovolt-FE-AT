// Ratgeber: PV-Angebote vergleichen – Checkliste für Betriebe in Österreich (Gruppe R1)
// Beispielangebote sind fiktiv, Annahmen in den Fußnoten offengelegt. Wirkungen auf die Amortisation
// mit dem gemeinsamen R1-Rechenkern (pvcalc.mjs) gerechnet (100 kWp, 750 €/kWp, 60 % EV, 18 ct, 6 ct Überschuss).
// Checkliste „PV-Firma prüfen“ (P4/M20, 30.09.2026): Anker #pv-firma-pruefen – wird von Hersteller-,
// Wechselrichter- und Ratgeberseiten verlinkt. Elektrotechnik als reglementiertes Gewerbe: § 94 Z 16 GewO 1994
// (JUSLINE, Stand 30.09.2026); Register: GISA, WKO Firmen A–Z, Ediktsdatei. Keine Namen von Mitbewerbern.

const artikel = {
  slug: "photovoltaik-angebot-vergleichen",
  title: "PV-Angebote vergleichen: Checkliste für Betriebe in Österreich",
  seoTitle: "PV-Angebote vergleichen: Checkliste für Betriebe | Ökovolt",
  kurzTitel: "PV-Angebote vergleichen",
  description:
    "PV-Angebote vergleichen: Checkliste für Betriebe mit €/kWp und €/kWh Jahresertrag, Ertragsprognose, Statik, TOR Erzeuger, Prüfung, Garantie und Warnsignalen.",
  excerpt:
    "Drei Angebote für dasselbe Hallendach, drei Preise, drei Leistungsumfänge: So machen Sie PV-Angebote für Ihren Betrieb vergleichbar – mit Beispielvergleich, Checklisten für Technik, Netz, Prüfung und Förderung sowie den typischen Warnsignalen.",
  hauptKeyword: "pv angebot vergleichen",
  keywords: [
    "PV-Angebot vergleichen",
    "Photovoltaik Angebot prüfen Gewerbe",
    "PV-Angebot Checkliste Österreich",
    "Preis pro kWp Photovoltaik Gewerbe",
    "Ertragsprognose Photovoltaik prüfen",
    "Photovoltaik Angebot Warnsignale",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-30",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/AT/wissen/pv-ingenieur-tablet.jpg",
  bildAlt: "Photovoltaik-Montage auf einem Dach",
  badge: { wert: "€/kWh", text: "Preis je kWh prognostiziertem Jahresertrag – die fairere Vergleichszahl" },

  kurzFazit: [
    "**PV-Angebote für Betriebe vergleichen Sie über zwei Kennzahlen: netto €/kWp und netto € je kWh prognostiziertem Jahresertrag – beides erst nach Bereinigung um fehlende Leistungen.**",
    "Richtwerte 2026 (netto): 100 kWp etwa 700–850 €/kWp, 250–500 kWp etwa 600–750 €/kWp, 1 MWp auf dem Dach etwa 550–700 €/kWp. Große Abweichungen nach unten haben fast immer einen Grund im Leistungsumfang.",
    "Eine um 150 kWh/kWp zu hohe Ertragsprognose verkürzt die Amortisation einer 100-kWp-Anlage auf dem Papier von 6,6 auf 5,6 Jahre – prüfen Sie jede Prognose mit PVGIS und Verschattungsanalyse.",
    "Ein vollständiges Gewerbeangebot enthält Statiknachweis, Netzzugangsantrag, TOR-Erzeuger-Nachweise, gegebenenfalls einen EZA-Regler, Prüfung nach ÖVE/ÖNORM E 8101 und EN 62446-1 sowie Monitoring.",
    "**Warnsignale:** hohe Anzahlung, „Komponenten gleichwertig“, Statik oder Netzanmeldung „bauseits“, Ertragsprognosen ohne Quelle und Wirtschaftlichkeitsrechnungen mit fixem Förderzuschuss.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie vergleicht man PV-Angebote für Betriebe richtig?",
      tocLabel: "Kurz erklärt",
      bloecke: [
        {
          typ: "p",
          text: "**PV-Angebote vergleichen Sie richtig, indem Sie sie zuerst auf denselben Leistungsumfang bringen und dann den Nettopreis je kWp und je kWh prognostiziertem Jahresertrag gegenüberstellen.** Der Endpreis allein sagt wenig: Fehlen Statiknachweis, Netzanmeldung oder Prüfbefund, kommen diese Kosten später dazu. Und eine Anlage mit weniger kWp, aber besserer Ausrichtung kann je erzeugter Kilowattstunde günstiger sein.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Gleiche Grundlage schaffen", "Allen Anbietern dieselben Daten geben: Lastgang, Dachpläne, Statikunterlagen, Netzanschluss, gewünschter Leistungsumfang."],
            ["Vollständigkeit prüfen", "Fehlende Positionen markieren und mit einem Schätzwert ergänzen – so entsteht ein bereinigter Preis."],
            ["Kennzahlen bilden", "Bereinigter Nettopreis ÷ kWp und bereinigter Nettopreis ÷ plausible Jahreserzeugung in kWh."],
            ["Technik und Nachweise vergleichen", "Komponenten, Statik, Netz, Brandschutz, Prüfung, Monitoring und Wartung."],
            ["Wirtschaftlichkeit gegenrechnen", "Annahmen des Anbieters mit eigenen, vorsichtigen Werten nachrechnen."],
          ],
        },
      ],
    },
    {
      id: "kennzahlen",
      titel: "Vergleichbar machen: €/kWp und €/kWh Jahresertrag",
      tocLabel: "€/kWp und €/kWh",
      bloecke: [
        {
          typ: "p",
          text: "**Der Preis je kWp zeigt, was die installierte Leistung kostet; der Preis je kWh Jahresertrag zeigt, was die Anlage für ihr Geld tatsächlich erzeugt.** Beide Kennzahlen immer netto und ohne Speicher, Ladestationen oder Dachsanierung bilden – diese Positionen getrennt bewerten.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Die zwei Formeln",
          text: "**€/kWp** = bereinigter Nettopreis ÷ Modulleistung in kWp. **€/kWh Jahresertrag** = bereinigter Nettopreis ÷ plausibel prognostizierte Erzeugung im ersten Jahr. Die zweite Zahl belohnt gute Ausrichtung und wenig Verschattung und bestraft überhöhte Prognosen, wenn Sie die Prognose vorher selbst prüfen.",
        },
        {
          typ: "tabelle",
          caption: "Richtwerte für Photovoltaik-Systempreise in Österreich 2026, netto",
          kopf: ["Anlagengröße", "Richtwert €/kWp", "Hinweis"],
          zeilen: [
            ["30–50 kWp", "750–950 €", "BMWET-Marktstatistik 2024: Ø 806 €/kWp"],
            ["100 kWp", "700–850 €", "Aufdach auf Gewerbehalle"],
            ["250–500 kWp", "600–750 €", "abhängig von Dachart und Netzanschluss"],
            ["1 MWp (Dach)", "550–700 €", "Trafostation meist gesondert"],
            ["Freifläche 1–5 MWp", "500–650 €", "zuzüglich Netzanschluss, Zaun, Pacht"],
          ],
          hervorheben: 1,
          minBreite: 560,
          fussnote: "Richtwerte auf Basis der BMWET-Marktstatistik 2024 und der Modulpreisentwicklung, keine Angebote und keine Preise von Ökovolt. Aufpreise entstehen etwa durch mechanische Befestigung statt Ballast, Blitzschutzanbindung, lange Kabelwege, Kran oder Trafostation. Kostenüberblick unter Photovoltaik Kosten 2026.",
        },
        {
          typ: "p",
          text: "Einen ausführlichen Kostenüberblick nach Größenklassen finden Sie unter [Photovoltaik Kosten 2026](/ratgeber/solaranlage-kosten). Speicher bewerten Sie getrennt in €/kWh nutzbarer Kapazität – Richtwerte stehen unter [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispiel: Drei Angebote für 100 kWp auf demselben Hallendach",
      tocLabel: "Beispielvergleich",
      bloecke: [
        {
          typ: "p",
          text: "**Erst nach Bereinigung um fehlende Leistungen und unrealistische Prognosen zeigt sich, welches Angebot wirklich günstig ist.** Das fiktive Beispiel: ein Flachdach mit Ost-West-Aufständerung, PVGIS-Simulation mit Verschattung rund 950 kWh/kWp, drei Anbieter.",
        },
        {
          typ: "tabelle",
          caption: "Fiktives Beispiel: drei PV-Angebote für eine Gewerbehalle, netto",
          kopf: ["Position", "Angebot A", "Angebot B", "Angebot C"],
          zeilen: [
            ["Modulleistung", "99,8 kWp", "104,5 kWp", "100,0 kWp"],
            ["Angebotspreis netto", "72.000 €", "66.000 €", "81.000 €"],
            ["€/kWp laut Angebot", "721 €", "632 €", "810 €"],
            ["Ertragsprognose", "960 kWh/kWp, PVGIS mit Verschattung", "1.100 kWh/kWp, ohne Quelle", "950 kWh/kWp, PVGIS"],
            ["Module", "Glas-Glas, Hersteller und Modell genannt", "„Tier-1 oder gleichwertig“", "Glas-Glas bifazial, genannt"],
            ["Hagelwiderstand", "HW-Klasse laut Hagelregister angegeben", "keine Angabe", "HW-Klasse angegeben"],
            ["Statiknachweis", "enthalten", "„bauseits“", "enthalten"],
            ["Netzzugangsantrag, TOR-Nachweise", "enthalten", "„bauseits“", "enthalten"],
            ["EZA-/Parkregler", "enthalten", "nicht enthalten", "enthalten"],
            ["Prüfung E 8101 / EN 62446-1, Anlagenbuch", "enthalten", "nicht erwähnt", "enthalten"],
            ["Monitoring / Wartung", "Portal, Wartung optional", "App", "Portal, Fernwartung, 2 Jahre Wartung"],
            ["Zahlungsplan", "10 / 60 / 30 %", "50 % bei Auftrag", "20 / 70 / 10 %"],
            ["Bereinigter Preis netto", "72.000 €", "78.000 €", "81.000 €"],
            ["€/kWp bereinigt", "721 €", "746 €", "810 €"],
            ["€/kWh Jahresertrag (950–960 kWh/kWp)", "0,75 €", "0,79 €", "0,85 €"],
          ],
          markierteZeile: 14,
          hervorheben: 1,
          minBreite: 760,
          fussnote: "Fiktives Beispiel mit angenommenen Werten. Bereinigung Angebot B: Schätzwerte für Statiknachweis 3.000 €, Netzzugangsantrag und TOR-Nachweise 2.500 €, EZA-Regler 5.000 €, Prüfung und Dokumentation 1.500 € (zusammen 12.000 €, Annahmen, keine Marktpreise von Ökovolt) sowie Prognose auf plausible 950 kWh/kWp korrigiert. Angebot C enthält zusätzlich zwei Jahre Wartung. Zahlungsplan: Auftrag / Lieferung bzw. Montage / Inbetriebnahme und Abnahme.",
        },
        {
          typ: "p",
          text: "Angebot B wirkt 6.000 € günstiger als A, ist nach Bereinigung aber teurer – und seine Prognose von 1.100 kWh/kWp ist für ein Ost-West-Flachdach nicht plausibel. Wie stark das auf die Rechnung durchschlägt, zeigt der R1-Rechenkern: Bei 750 €/kWp, 60 % Eigenverbrauch und 18 ct amortisiert sich eine 100-kWp-Anlage mit 950 kWh/kWp nach 6,6 Jahren, mit 1.100 kWh/kWp scheinbar nach 5,6 Jahren. Angebot C ist das teuerste, enthält aber Wartung und Fernwartung; ob Ihnen das den Aufpreis wert ist, entscheiden Sie mit dem Vergleich der Wartungsleistungen weiter unten.",
        },
      ],
    },
    {
      id: "lastgang",
      titel: "Lastgangauswertung und Eigenverbrauchssimulation einfordern",
      tocLabel: "Lastgang & Simulation",
      bloecke: [
        {
          typ: "p",
          text: "**Ein seriöses Gewerbeangebot beruht auf Ihrem Lastgang: zwölf Monate Viertelstundenwerte, gegen die die simulierte Erzeugung gelegt wird.** Nur so lässt sich die Eigenverbrauchsquote belegen, die über die Wirtschaftlichkeit entscheidet – 40 statt 60 % Eigenverbrauch verlängern die Amortisation in unserer Referenzrechnung von 6,2 auf 7,9 Jahre.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Welche Lastgangdaten wurden verwendet (Zeitraum, Zählpunkt, Viertelstundenwerte oder Monatswerte)?",
            "Wie hoch sind Eigenverbrauchsquote und Autarkiegrad – und für welche Anlagengröße?",
            "Wurden Wochenenden, Betriebsurlaub und geplante Verbraucher (E-Flotte, Wärmepumpe) berücksichtigt?",
            "Mit welchem vermeidbaren Strompreis wird gerechnet – nur arbeitsabhängige Teile oder der Durchschnittspreis inklusive Leistungspreis?",
            "Welcher Überschusserlös ist angesetzt, und stimmt er mit dem OeMAG-Marktpreis bzw. einem Vermarktungsangebot überein?",
          ],
        },
        {
          typ: "p",
          text: "Wie die richtige Anlagengröße aus dem Lastgang entsteht, erklärt [PV-Anlage richtig dimensionieren](/ratgeber/pv-anlage-groesse-berechnen); wie Sie die Wirtschaftlichkeit eines Angebots selbst nachrechnen, [Amortisation und Rendite berechnen](/ratgeber/photovoltaik-amortisation).",
        },
      ],
    },
    {
      id: "ertrag",
      titel: "Ertragsprognose prüfen: PVGIS, Verschattung und Degradation",
      tocLabel: "Ertragsprognose",
      bloecke: [
        {
          typ: "p",
          text: "**Eine belastbare Ertragsprognose nennt ihre Quelle, berücksichtigt Verschattung und Systemverluste und rechnet mit Moduldegradation.** Als unabhängige Gegenprobe eignet sich das kostenlose Simulationstool PVGIS der Gemeinsamen Forschungsstelle der EU-Kommission. Im österreichischen Mittel sind rund 1.000 kWh/kWp realistisch, auf Ost-West-Flachdächern eher 900 bis 950, in gut ausgerichteten alpinen oder südlichen Lagen bis etwa 1.200.",
        },
        {
          typ: "tabelle",
          caption: "Plausibilitätscheck für Ertragsprognosen",
          kopf: ["Prüfpunkt", "Plausibel", "Nachfragen, wenn …"],
          zeilen: [
            ["Spezifischer Ertrag", "900–1.200 kWh/kWp je nach Lage und Ausrichtung", "über 1.100 kWh/kWp auf Ost-West-Flachdach"],
            ["Quelle", "PVGIS oder Planungssoftware mit Standortdaten", "keine Quelle oder nur „Erfahrungswert“"],
            ["Verschattung", "Attika, Lichtkuppeln, Aufbauten, Nachbargebäude modelliert", "Verschattung nicht erwähnt"],
            ["Degradation", "0,4–0,5 % pro Jahr, im Rahmen der Leistungsgarantie", "gleicher Ertrag über 25 Jahre"],
            ["Verluste", "Kabel, Wechselrichter, Temperatur, Verschmutzung, Schnee", "Verluste nicht ausgewiesen"],
          ],
          minBreite: 640,
          fussnote: "Richtwerte, keine Garantie. Ertragswerte für Ihren Standort nennt der Ratgeber Ertrag pro kWp.",
        },
        {
          typ: "p",
          text: "Standortwerte je Bundesland stehen unter [Ertrag pro kWp in Österreich](/ratgeber/photovoltaik-ertrag-pro-kwp), Grundlagen zu Schattenverlusten unter [Photovoltaik und Verschattung](/ratgeber/photovoltaik-verschattung).",
        },
      ],
    },
    {
      id: "komponenten",
      titel: "Komponenten, Unterkonstruktion und Statik",
      tocLabel: "Komponenten & Statik",
      bloecke: [
        {
          typ: "p",
          text: "**Jede Komponente sollte mit Hersteller, Modell, Stückzahl und Datenblatt im Angebot stehen; Formulierungen wie „oder gleichwertig“ erlauben einen späteren Tausch gegen günstigere Produkte.** Bei Gewerbedächern entscheiden außerdem Unterkonstruktion und Statik über Sicherheit und Kosten.",
        },
        {
          typ: "tabelle",
          caption: "Komponenten im Gewerbeangebot: Pflichtangaben und Prüfpunkte",
          kopf: ["Komponente", "Pflichtangaben", "Worauf achten"],
          zeilen: [
            ["Module", "Hersteller, Modell, Wp, Stückzahl, Garantien", "Glas-Glas oder Glas-Folie, bifazial nur bei Nutzen (heller Untergrund, Aufständerung), Prüflast für Schnee"],
            ["Hagelwiderstand", "Hagelwiderstandsklasse (HW) laut Hagelregister", "in hagelgefährdeten Lagen hohe Klasse wählen und mit dem Versicherer abstimmen"],
            ["Schneelast", "Schneelastzone und Bemessung nach ÖNORM B 1991-1-3", "Modul-Prüflast passend zur Zone, Schneeverwehungen an Attika und Aufbauten"],
            ["Wechselrichter", "Hersteller, Modell, Anzahl, Nennleistung", "Verhältnis zur Modulleistung, Ersatzteil- und Servicezusagen, Kommunikation mit EZA-Regler"],
            ["Unterkonstruktion", "System, Ballast oder mechanische Befestigung, Windsog", "Ballastplan, Dachabdichtung, Rand- und Eckbereiche"],
            ["Statiknachweis", "wer erstellt ihn, was ist enthalten", "Nachweis durch befugten Tragwerksplaner vor Auftrag bzw. als Auftragsbedingung"],
          ],
          minBreite: 700,
        },
        {
          typ: "p",
          text: "Vertiefung: [Solarmodule im Vergleich](/ratgeber/solarmodule-vergleich), [Wechselrichter](/ratgeber/wechselrichter-photovoltaik), [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach), [Schneelast](/ratgeber/schneelast-photovoltaik) und [Hagelschutz](/ratgeber/hagel-photovoltaik). Was bifaziale Module sind, erklärt das [Lexikon](/wissen/lexikon#bifazial).",
        },
      ],
    },
    {
      id: "netz",
      titel: "Netzanschluss, TOR Erzeuger und ElWG-Pflichten im Angebot",
      tocLabel: "Netz & ElWG",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Gewerbeangebot muss klar sagen, wer den Netzzugangsantrag stellt, welche Nachweise nach den Technischen und Organisatorischen Regeln (TOR) Erzeuger erbracht werden und wie Einspeisebegrenzung und Ansteuerbarkeit umgesetzt sind.** Diese Punkte fehlen in günstigen Angeboten besonders häufig.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Netzzugangsantrag** und Kommunikation mit dem Netzbetreiber – inklusive Netzanschlussbestätigung, die auch für den EAG-Antrag nötig ist.",
            "**Anschlusspunkt und Netzebene:** Reicht der bestehende Anschluss, oder braucht es eine Verstärkung oder Trafostation? Wer trägt diese Kosten?",
            "**[TOR Erzeuger](/wissen/lexikon#tor-erzeuger):** Anlagentyp, Einheiten- und Anlagenzertifikate, Inbetriebnahmeprotokolle.",
            "**EZA-Regler bzw. Parkregler:** Regelung von Wirk- und Blindleistung am Netzanschlusspunkt, falls vom Netzbetreiber gefordert.",
            "**ElWG:** Umsetzung einer Einspeisebegrenzung auf bis zu 70 % der Modulleistung und der Ansteuerbarkeit neuer Anlagen ab 3,68 kW.",
            "**Fertigstellungsmeldung** und Zählpunkt für die Einspeisung, Abnahmevertrag mit OeMAG oder Vermarkter.",
          ],
        },
        {
          typ: "p",
          text: "Details: [TOR Erzeuger und Netzanschluss](/ratgeber/tor-erzeuger-netzanschluss), [EZA-Regler und Parkregler](/ratgeber/eza-regler-parkregler) sowie [PV-Anlage anmelden](/ratgeber/photovoltaik-anmelden). Ökovolt setzt dafür einen eigenen [Parkregler](/technik/parkregler) ein.",
        },
      ],
    },
    {
      id: "pruefung",
      titel: "Brandschutz, Prüfung und Dokumentation",
      tocLabel: "Brandschutz & Prüfung",
      bloecke: [
        {
          typ: "p",
          text: "**Zum Lieferumfang eines vollständigen Angebots gehören ein Brandschutzkonzept nach OVE-Richtlinie R 11-1, die Erstprüfung der elektrischen Anlage und eine vollständige Dokumentation.** Ohne Prüfprotokoll eines befugten Unternehmens gibt es auch keine Endabrechnung des EAG-Zuschusses.",
        },
        {
          typ: "liste",
          punkte: [
            "**Brandschutz:** Abstände zu Brandwänden, Freihaltung von Rauch- und Wärmeabzügen, Kennzeichnung für die Feuerwehr, Abschaltmöglichkeiten – oft ergänzt durch Auflagen des Versicherers. Mehr unter [Brandschutz bei PV-Anlagen](/ratgeber/photovoltaik-brandschutz).",
            "**Prüfung:** Errichtung und Erstprüfung nach ÖVE/ÖNORM E 8101, PV-spezifische Prüfungen und Dokumentation nach ÖVE/ÖNORM EN 62446-1 (u. a. Stringmessungen, Isolationswiderstand).",
            "**Dokumentation:** Stringplan, Datenblätter, Prüfprotokolle, Konformitätserklärungen und Eintrag ins Anlagenbuch des Betriebs – Grundlage für spätere wiederkehrende Prüfungen, siehe [E-Check](/ratgeber/e-check-photovoltaik).",
          ],
        },
      ],
    },
    {
      id: "betrieb",
      titel: "Monitoring, Fernwartung, Wartung und Versicherung",
      tocLabel: "Betrieb & Service",
      bloecke: [
        {
          typ: "p",
          text: "**Vergleichen Sie nicht nur den Errichtungspreis, sondern auch, wer die Anlage in den nächsten 25 Jahren überwacht, wartet und im Fehlerfall reagiert.** Eine unbemerkt ausgefallene Wechselrichtergruppe kostet schnell mehr als ein Wartungsvertrag.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Monitoring:** Portal mit Alarmierung, Datenhoheit beim Betreiber, Kosten nach der Inklusivphase.",
            "**Fernwartung:** Wer schaltet sich bei Störungen auf, und wie werden Zugänge abgesichert? Ökovolt betreibt eigene Systeme für [Fernwartung](/technik/fernwartung) und SCADA.",
            "**Wartung:** Leistungsumfang, Intervalle, Thermografie, Reinigung, Preis je Jahr – siehe [Wartungsvertrag](/ratgeber/photovoltaik-wartungsvertrag).",
            "**Versicherung:** Maschinen- bzw. Elektronikversicherung, Betriebsunterbrechung, Haftpflicht – siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
          ],
        },
      ],
    },
    {
      id: "garantie",
      titel: "Herstellergarantie und gesetzliche Gewährleistung",
      tocLabel: "Garantie & Gewährleistung",
      bloecke: [
        {
          typ: "p",
          text: "**Die gesetzliche Gewährleistung richtet sich gegen Ihren Vertragspartner, die Herstellergarantie gegen den Hersteller – beides sind verschiedene Ansprüche mit verschiedenen Fristen.** Produkt- und Leistungsgarantien der Modulhersteller laufen oft 12 bis 30 Jahre, gelten aber nur nach den jeweiligen Garantiebedingungen und nur, solange der Hersteller besteht.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Gewährleistung nach ABGB – vorsichtig einordnen",
          text: "Die Gewährleistung ist in §§ 922 ff. ABGB geregelt. Die Frist beträgt nach § 933 ABGB zwei Jahre bei beweglichen und drei Jahre bei unbeweglichen Sachen; wie eine Dachanlage im Einzelfall einzuordnen ist, kann strittig sein. Zwischen Unternehmern kann die Gewährleistung vertraglich eingeschränkt werden, und bei beiderseitigen Unternehmensgeschäften sind Rügeobliegenheiten nach dem UGB zu beachten. Lassen Sie Gewährleistungs-, Garantie- und Haftungsklauseln sowie einen Haftrücklass oder eine Bankgarantie vor der Unterschrift rechtlich prüfen.",
        },
      ],
    },
    {
      id: "foerderung-zahlung",
      titel: "Förderabwicklung, Vergaberecht und Zahlungsplan",
      tocLabel: "Förderung & Zahlung",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Angebot muss zur Förderabwicklung passen: Der EAG-Investitionszuschuss ist vor der Inbetriebnahme zu beantragen, und beim Antrag müssen Genehmigungen und Netzanschlussbestätigung vorliegen.** Gefördert wird nur die Errichtung durch einen befugten Unternehmer; nicht förderfähig sind u. a. Finanzierungskosten, Eigenleistungen, reine Materialrechnungen und Barzahlungen. Klären Sie, ob der Anbieter die Einreichung im Fördercall unterstützt – Details unter [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss), passende Programme zeigt der [Förder-Check](/foerdercheck).",
        },
        {
          typ: "p",
          text: "**Öffentliche Auftraggeber** – Gemeinden, Länder, ausgegliederte Gesellschaften – müssen das Vergaberecht einhalten; je nach Auftragswert ist eine Direktvergabe, ein nationales oder ein EU-weites Verfahren nötig. Das bestimmt, wie Angebote eingeholt und verglichen werden dürfen. Mehr unter [Photovoltaik für Gemeinden](/ratgeber/photovoltaik-gemeinde).",
        },
        {
          typ: "checkliste",
          punkte: [
            "Zahlungen an Meilensteine binden: Auftrag, Lieferung bzw. Montage, Inbetriebnahme und Abnahme.",
            "Anzahlung gering halten oder mit einer Anzahlungsgarantie absichern.",
            "Haftrücklass oder Bankgarantie für die Gewährleistungszeit vereinbaren.",
            "Fixtermine für Montage und Inbetriebnahme – wichtig für die Frist nach dem Fördervertrag.",
            "Alle Zahlungen unbar, mit Rechnungen, die für die EAG-Endabrechnung verwendbar sind.",
          ],
        },
      ],
    },
    {
      id: "pv-firma-pruefen",
      titel: "Checkliste: PV-Firma prüfen, bevor Sie unterschreiben",
      tocLabel: "PV-Firma prüfen",
      bloecke: [
        {
          typ: "p",
          text: "**Eine PV-Firma prüfen Sie über Gewerbeberechtigung, Firmen- und Insolvenzdaten, Referenzen, belegte Herstellerangaben und klare Zuständigkeiten im Angebot.** Vieles davon lässt sich kostenlos in öffentlichen Registern kontrollieren – in wenigen Minuten und ohne den Anbieter zu fragen.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Gewerbeberechtigung Elektrotechnik:** Elektrotechnik ist in Österreich ein reglementiertes Gewerbe (§ 94 Z 16 GewO 1994). Ob die Firma die Berechtigung hat, zeigt die kostenlose [GISA-Abfrage](https://www.gisa.gv.at/abfrage). Arbeitet ein Subunternehmer mit, lassen Sie sich auch dessen Berechtigung nennen.",
            "**Firmendaten abgleichen:** Firmenname, Rechtsform, Sitz, Firmenbuchnummer und UID-Nummer müssen auf Website, Angebot und Rechnung übereinstimmen. Eingetragene Betriebe finden Sie auch in [Firmen A–Z der WKO](https://firmen.wko.at/).",
            "**Insolvenz ausschließen:** Laufende Insolvenzverfahren veröffentlicht die [Ediktsdatei der Justiz](https://edikte.justiz.gv.at/). Eine insolvente Firma kann Gewährleistung und Garantieabwicklung nicht mehr sicherstellen.",
            "**Referenzen mit Ansprechperson:** Lassen Sie sich zwei bis drei Anlagen ähnlicher Größe nennen – mit einer Person, die Sie anrufen dürfen. Eine Anlage, die Sie besichtigen können, sagt mehr als Fotos.",
            "**Herstellerangaben belegen lassen:** Nennt sich ein Anbieter „Partner“ oder „zertifizierter Installateur“ eines Herstellers, fragen Sie nach der Urkunde und prüfen Sie den Eintrag in der Installateur-Suche des Herstellers. Klären Sie außerdem, ob eine Garantieverlängerung die Registrierung der Anlage durch den Installateur voraussetzt.",
            "**Datenblätter statt „gleichwertig“:** Jede Komponente mit Hersteller, Modell und Datenblatt – siehe [Komponenten & Statik](#komponenten). Neutrale Datenblattvergleiche finden Sie für [Solarmodule](/ratgeber/solarmodule-vergleich#hersteller-vergleich) sowie für [Wechselrichter und Speicher](/ratgeber/wechselrichter-photovoltaik#hersteller-vergleich).",
            "**Prüfung und Netz klar zugeordnet:** Wer führt die Erstprüfung nach ÖVE/ÖNORM E 8101 durch, wer stellt den Netzzugangsantrag, wer meldet die Fertigstellung? Siehe [Netz & ElWG](#netz) und [Brandschutz & Prüfung](#pruefung).",
            "**Montage und Störfall:** Klären Sie, wer montiert, wer elektrisch anschließt und wer bei einer Störung kommt – mit Reaktionszeit und Einsatzgebiet. Fragen Sie nach der Betriebshaftpflichtversicherung für Arbeiten auf Dächern.",
            "**Förderfähig abrechnen:** Für den EAG-Investitionszuschuss muss ein befugter Unternehmer errichten, und die Rechnungen müssen für die Endabrechnung verwendbar sein – siehe [Förderung & Zahlung](#foerderung-zahlung).",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Unsere Angaben zum Nachprüfen",
          text: "Firmenbuchnummer, UID-Nummer und Gewerbeberechtigung der Ökovolt Solartechnik GmbH stehen im [Impressum](/impressum). Welche Hersteller wir nachweislich verbauen, zeigt die Seite [Hersteller](/produkte/hersteller) – einen Partnerstatus nennen wir nur mit Urkunde.",
        },
      ],
    },
    {
      id: "warnsignale",
      titel: "Acht Warnsignale in PV-Angeboten für Betriebe",
      tocLabel: "Warnsignale",
      bloecke: [
        {
          typ: "p",
          text: "**Das deutlichste Warnsignal ist ein niedriger Preis, der durch ausgelassene Leistungen oder eine geschönte Prognose entsteht.** Achten Sie außerdem auf:",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Kein Lastgang, keine Begehung", text: "Angebote nur nach Luftbild übersehen Statik, Aufbauten, Kabelwege und Anschlusssituation." },
            { titel: "„Bauseits“ bei Statik und Netz", text: "Die teuersten Nebenleistungen werden auf Sie abgewälzt – oft mit Terminrisiko." },
            { titel: "„Gleichwertige“ Komponenten", text: "Ohne Hersteller und Modell können Sie Qualität und Garantien nicht bewerten." },
            { titel: "Prognose ohne Quelle", text: "Über 1.100 kWh/kWp ohne besonderen Standort sind ein Grund für eine PVGIS-Gegenprobe." },
            { titel: "Hohe Anzahlung", text: "50 % bei Auftrag ohne Absicherung sind für Gewerbeprojekte unüblich." },
            { titel: "Zuschuss fix eingerechnet", text: "Der EAG-Zuschuss ist 2026 ein Wettrennen um Sekunden – er gehört in eine Variante, nicht in die Basisrechnung." },
            { titel: "Kein Prüfbefund", text: "Ohne Prüfung nach E 8101 und EN 62446-1 fehlen Nachweise für Versicherung, Netzbetreiber und Förderstelle." },
            { titel: "Zeitdruck", text: "„Preis nur bis Freitag“ passt nicht zu einem Projekt, das Statik, Netz und Förderung klären muss." },
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie prüfe ich, ob eine PV-Firma seriös ist?",
      a: "Prüfen Sie die Gewerbeberechtigung Elektrotechnik in der kostenlosen GISA-Abfrage, gleichen Sie Firmenbuch- und UID-Nummer mit dem Angebot ab, schließen Sie ein Insolvenzverfahren über die Ediktsdatei aus und lassen Sie sich Referenzen mit Ansprechperson sowie Urkunden zu behaupteten Herstellerpartnerschaften zeigen. Die vollständige [Checkliste](#pv-firma-pruefen) steht oben.",
    },
    {
      q: "Wie viele Angebote sollte ein Betrieb für eine PV-Anlage einholen?",
      a: "Drei vergleichbare Angebote auf Basis derselben Unterlagen – Lastgang, Dachpläne, Statikunterlagen und gewünschter Leistungsumfang – sind ein guter Richtwert. Öffentliche Auftraggeber richten sich nach dem Vergaberecht.",
    },
    {
      q: "Was kostet eine Gewerbe-PV-Anlage pro kWp 2026?",
      a: "Als Richtwert netto etwa 700 bis 850 €/kWp bei 100 kWp, 600 bis 750 €/kWp bei 250 bis 500 kWp und 550 bis 700 €/kWp bei 1 MWp auf dem Dach. Trafostation, Speicher und Dachsanierung kommen gesondert dazu.",
    },
    {
      q: "Warum ist der Preis je kWh Jahresertrag aussagekräftiger als der Preis je kWp?",
      a: "Weil er berücksichtigt, wie viel Strom die Anlage tatsächlich erzeugt. Eine günstig wirkende Anlage mit schlechter Ausrichtung oder Verschattung kann je kWh teurer sein. Voraussetzung ist eine selbst geprüfte, plausible Ertragsprognose.",
    },
    {
      q: "Wie prüfe ich die Ertragsprognose eines Angebots?",
      a: "Mit einer eigenen Simulation im kostenlosen EU-Tool PVGIS für Standort, Neigung und Ausrichtung, ergänzt um die Verschattung durch Aufbauten. In Österreich sind rund 900 bis 1.200 kWh/kWp üblich; Abweichungen nach oben sollte der Anbieter begründen.",
    },
    {
      q: "Welche Prüfungen und Dokumente müssen im Angebot enthalten sein?",
      a: "Die Erstprüfung nach ÖVE/ÖNORM E 8101, PV-spezifische Prüfungen und Dokumentation nach ÖVE/ÖNORM EN 62446-1, TOR-Erzeuger-Nachweise für den Netzbetreiber und die Unterlagen für das Anlagenbuch. Das Prüfprotokoll brauchen Sie auch für die EAG-Endabrechnung.",
    },
    {
      q: "Wie lange gilt die Gewährleistung für eine PV-Anlage?",
      a: "Nach § 933 ABGB zwei Jahre bei beweglichen und drei Jahre bei unbeweglichen Sachen; die Einordnung einer Dachanlage hängt vom Einzelfall ab. Zwischen Unternehmern sind abweichende Vereinbarungen möglich. Herstellergarantien kommen zusätzlich und richten sich nach den Garantiebedingungen.",
    },
    {
      q: "Welche Anzahlung ist bei Gewerbe-PV-Anlagen angemessen?",
      a: "Üblich sind Zahlungen nach Meilensteinen mit einer geringen Anzahlung. Höhere Anzahlungen sollten über eine Anzahlungsgarantie abgesichert sein, für die Gewährleistungszeit empfiehlt sich ein Haftrücklass oder eine Bankgarantie.",
    },
  ],

  passend: [
    { href: "/ratgeber/solaranlage-kosten", titel: "Photovoltaik Kosten 2026", text: "Preise je kWp nach Größenklassen." },
    { href: "/ratgeber/photovoltaik-amortisation", titel: "Amortisation berechnen", text: "Angebote mit eigenen Annahmen nachrechnen." },
    { href: "/ratgeber/photovoltaik-ablauf", titel: "Ablauf eines Gewerbeprojekts", text: "Vom Lastgang bis zur Inbetriebnahme." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Vollständiges Angebot mit offenen Annahmen." },
  ],

  quellen: [
    { titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (PDF)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "2025" },
    { titel: "Europäische Kommission, JRC – PVGIS Photovoltaic Geographical Information System", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "OeMAG – EAG-Investitionszuschüsseverordnung-Strom, konsolidierte Fassung vom 19.01.2026 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "01/2026" },
    { titel: "PV&B Austria – ElWG: Das Wichtigste im Überblick für den PV- und Speicherbereich", url: "https://pvbaustria.at/elwg-das-wichtigste-im-uberblick-fur-den-pv-und-speicherbereich/", stand: "09/2026" },
    { titel: "Österreichisches Hagelregister – Hagelwiderstandsklassen", url: "https://www.hagelregister.at/", stand: "09/2026" },
    { titel: "WKO – Direktvergabe und Vergabeverfahren", url: "https://www.wko.at/wirtschaftsrecht/direktvergabe-vergabeverfahren", stand: "09/2026" },
    { titel: "GISA – Gewerbeinformationssystem Austria, öffentliche Abfrage", url: "https://www.gisa.gv.at/abfrage", stand: "09/2026" },
    { titel: "Gewerbeordnung 1994, § 94 (reglementierte Gewerbe, Z 16 Elektrotechnik) – JUSLINE", url: "https://www.jusline.at/gesetz/gewo/paragraf/94", stand: "09/2026" },
  ],

  seitenCta: { titel: "Angebot als Vergleichsbasis?", text: "Vollständiges Gewerbeangebot mit offenen Annahmen anfragen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Ein Angebot, das jeden Vergleich aushält.",
    text: "Ökovolt plant Gewerbeanlagen auf Basis Ihres Lastgangs – mit benannten Komponenten, Netzanmeldung, eigenem Parkregler und eigener Fernwartung aus einer Hand.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Kontakt", href: "/kontakt" },
  },
};

export default artikel;
