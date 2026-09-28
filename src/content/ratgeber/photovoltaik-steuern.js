// Ratgeber: Photovoltaik & Steuern in Österreich 2026 (Unternehmen, Land- und Forstwirtschaft, Privat)
// Rechtsstand 09/2026. Grundlagen: BMF-Photovoltaikerlass (BMF-AV Nr. 106/2025, GZ 2025-0.461.257 vom 30.07.2025),
// § 3 Abs. 1 Z 39, §§ 7, 10, 11 EStG, UStBBKV, § 22 UStG, ElAbgG idF BGBl. I Nr. 95/2025, USP- und BMF-Informationsseiten.
// Beispielzahlen: eigene Rechnung (AfA-Tabelle, Elektrizitätsabgabe, Privatbeispiel), gerundet. Keine Imports.

const artikel = {
  slug: "photovoltaik-steuern",
  title: "Photovoltaik & Steuern in Österreich 2026",
  seoTitle: "Photovoltaik & Steuern Österreich 2026 | Ökovolt",
  kurzTitel: "Photovoltaik & Steuern",
  description:
    "Photovoltaik & Steuern in Österreich 2026: AfA, 22 % Öko-IFB, Umsatzsteuer, Elektrizitätsabgabe – für Unternehmen, Landwirtschaft und Private mit Beispielen.",
  excerpt:
    "Wie eine PV-Anlage 2026 in Österreich besteuert wird – getrennt nach GmbH und Einzelunternehmen, land- und forstwirtschaftlichen Betrieben und Privatpersonen, mit Tabellen und Rechenbeispielen.",
  hauptKeyword: "photovoltaik steuern österreich",
  keywords: [
    "Photovoltaik Steuern Österreich",
    "PV-Anlage Abschreibung 20 Jahre",
    "Photovoltaikerlass 2025",
    "Photovoltaik Landwirtschaft Pauschalierung",
    "PV Einspeisung steuerfrei 12.500 kWh",
    "Elektrizitätsabgabe Eigenverbrauch",
    "Reverse Charge Stromlieferung",
    "Umsatzsteuer PV-Anlage 2026",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Referenzen/Projekte-3.jpg",
  bildAlt: "Photovoltaik-Modulfeld frontal aufgenommen",
  badge: { wert: "22 %", text: "Öko-Investitionsfreibetrag für PV bis 31.12.2026" },

  kurzFazit: [
    "**Im Unternehmen ist die PV-Anlage ein abnutzbares Wirtschaftsgut:** Abschreibung über 20 Jahre (linear 5 % oder degressiv bis 30 % vom Restbuchwert), dazu 2026 ein Öko-Investitionsfreibetrag von 22 % der Anschaffungskosten.",
    "**Der Eigenverbrauch von Solarstrom ist von der Elektrizitätsabgabe befreit – ohne Mengengrenze.** Bei 60.000 kWh Eigenverbrauch entfallen 2026 rund 490 € Abgabe (Satz 0,82 ct/kWh), ab 2027 beim Regelsatz 1,5 ct rund 900 € pro Jahr.",
    "**Land- und Forstwirte:** Wird mehr als die Hälfte des Stroms im eigenen Betrieb verbraucht, gehört die Überschusseinspeisung als Nebenbetrieb zur Landwirtschaft (Umsatzsteuer-Pauschalsatz 13 %). Sonst entsteht ein eigener Gewerbebetrieb; Volleinspeisung ist immer gewerblich.",
    "**Privatpersonen:** Einkünfte aus der Einspeisung von bis zu 12.500 kWh pro Jahr sind steuerfrei, wenn die Anlage höchstens 35 kWp und 25 kW Anschlussleistung hat. Der 0-%-Umsatzsteuersatz für Module ist ausgelaufen – 2026 gelten 20 %.",
  ],

  abschnitte: [
    {
      id: "ueberblick",
      titel: "Welche Steuern betreffen eine PV-Anlage in Österreich?",
      tocLabel: "Überblick",
      bloecke: [
        {
          typ: "p",
          text: "**Eine PV-Anlage berührt in Österreich vier Steuerbereiche: Einkommen- bzw. Körperschaftsteuer, Umsatzsteuer, Elektrizitätsabgabe und – bei Pacht- oder Nutzungsverträgen – die Bestandvertragsgebühr.** Wie sie jeweils greifen, hängt davon ab, wer die Anlage betreibt und wie der Strom verwendet wird: selbst verbraucht, ins Netz eingespeist oder an eine Energiegemeinschaft geliefert. Maßgebliche Verwaltungsauffassung ist der Photovoltaikerlass des Finanzministeriums (BMF-AV Nr. 106/2025) vom 30. Juli 2025.",
        },
        {
          typ: "tabelle",
          caption: "Steuerliche Behandlung von PV-Anlagen nach Betreiber, Rechtsstand September 2026",
          kopf: ["Steuer", "GmbH / Einzelunternehmen", "Land- und Forstwirtschaft", "Privatperson"],
          zeilen: [
            ["Ertragsteuer", "Betriebsvermögen, AfA 20 Jahre, IFB 22 % (2026)", "Nebenbetrieb oder eigener Gewerbebetrieb – je nach Stromverwendung", "Einspeisung bis 12.500 kWh steuerfrei, darüber Gewerbebetrieb"],
            ["Umsatzsteuer beim Kauf", "20 %, als Vorsteuer abziehbar", "bei Pauschalierung und Nebenbetrieb abpauschaliert", "20 %, meist kein Vorsteuerabzug (Kleinunternehmer)"],
            ["Umsatzsteuer auf Stromverkauf", "20 %, Reverse Charge an Energieversorger", "Nebenbetrieb: Pauschalsteuersatz 13 %", "Kleinunternehmer bis 55.000 € Umsatz befreit"],
            ["Elektrizitätsabgabe Eigenverbrauch", "befreit (erneuerbar, ohne Mengengrenze)", "befreit", "befreit"],
          ],
          minBreite: 720,
          fussnote: "Vereinfachte Übersicht auf Basis des BMF-Photovoltaikerlasses (BMF-AV Nr. 106/2025), der USP-Informationen zu AfA, IFB und Elektrizitätsabgabe sowie § 3 Abs. 1 Z 39 EStG. Keine Steuerberatung – Einzelfälle bitte mit Ihrer Steuerberatung klären.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Keine Steuerberatung",
          text: "Dieser Ratgeber erklärt die allgemeine Rechtslage in Österreich (Stand September 2026) und ersetzt keine Steuer- oder Rechtsberatung. Gerade bei gemischter Nutzung, land- und forstwirtschaftlichen Betrieben, Mitunternehmerschaften und Energiegemeinschaften hängt das Ergebnis von Details ab. Ökovolt plant und errichtet Anlagen, berät aber nicht steuerlich.",
        },
      ],
    },
    {
      id: "unternehmen",
      titel: "Unternehmen: Betriebsvermögen, AfA und Investitionsfreibetrag",
      tocLabel: "Unternehmen: AfA & IFB",
      bloecke: [
        {
          typ: "p",
          text: "**Betreibt eine GmbH oder ein Einzelunternehmen die PV-Anlage, gehört sie zum Betriebsvermögen und wird über eine betriebsgewöhnliche Nutzungsdauer von 20 Jahren abgeschrieben.** Der Photovoltaikerlass bestätigt diese Dauer ausdrücklich. Zu den Anschaffungskosten zählen Module, Wechselrichter, Unterkonstruktion, Montage und Netzanschluss; ein steuerfreier Investitionszuschuss – etwa der [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss) – wird vorher abgezogen (§ 6 Z 10 EStG).",
        },
        {
          typ: "p",
          text: "Seit 1. Juli 2020 dürfen Sie statt der linearen AfA (5 % pro Jahr) eine degressive AfA von bis zu 30 % des jeweiligen Restbuchwerts wählen. Ein späterer Wechsel von degressiv auf linear ist zu Beginn eines Wirtschaftsjahres erlaubt, umgekehrt nicht. Geht die Anlage im zweiten Halbjahr in Betrieb, steht im ersten Jahr nur die halbe Jahres-AfA zu.",
        },
        {
          typ: "tabelle",
          caption: "AfA einer 100-kWp-Anlage mit 75.000 € Anschaffungskosten: linear vs. degressiv (Inbetriebnahme im 1. Halbjahr)",
          kopf: ["Jahr", "Lineare AfA (5 %)", "Degressive AfA (30 % vom Restbuchwert)", "Restbuchwert degressiv"],
          zeilen: [
            ["1", "3.750 €", "22.500 €", "52.500 €"],
            ["2", "3.750 €", "15.750 €", "36.750 €"],
            ["3", "3.750 €", "11.025 €", "25.725 €"],
            ["4", "3.750 €", "7.718 €", "18.008 €"],
            ["5", "3.750 €", "5.402 €", "12.605 €"],
            ["Summe Jahr 1–5", "18.750 €", "62.395 €", "–"],
          ],
          hervorheben: 2,
          markierteZeile: 5,
          minBreite: 640,
          fussnote: "Eigene Rechnung. Anschaffungskosten 750 €/kWp netto (Richtwert 2026 für 100 kWp, keine Ökovolt-Preise), ohne Zuschuss. Bei Inbetriebnahme im 2. Halbjahr halbiert sich die AfA des ersten Jahres (linear 1.875 €, degressiv 11.250 €). Die degressive AfA verschiebt Steuern nur zeitlich – über 20 Jahre wird in Summe gleich viel abgeschrieben.",
        },
        { typ: "h3", text: "Investitionsfreibetrag und Gewinnfreibetrag" },
        {
          typ: "p",
          text: "Zusätzlich zur AfA können Sie für die Anlage einen **Öko-Investitionsfreibetrag** geltend machen: 22 % der Anschaffungskosten, soweit diese auf den Zeitraum 1. November 2025 bis 31. Dezember 2026 entfallen, danach wieder 15 %. Die AfA-Basis wird dadurch nicht gekürzt – der Freibetrag ist ein echter, dauerhafter Steuervorteil. Er steht bei pauschaler Gewinnermittlung nicht zu und ist an eine Behaltefrist von vier Jahren gebunden. Rechenbeispiele, Zeitpunkt-Fragen und Leasing erklärt der eigene Ratgeber [Investitionsfreibetrag für Photovoltaik](/ratgeber/investitionsfreibetrag-photovoltaik); die Kurzdefinition finden Sie im [Lexikon unter IFB](/wissen/lexikon#ifb).",
        },
        {
          typ: "p",
          text: "Natürliche Personen (Einzelunternehmer, Mitunternehmer) erhalten außerdem den Gewinnfreibetrag: 15 % Grundfreibetrag auf Gewinne bis 33.000 €, darüber einen investitionsbedingten Teil. Für dieselbe Anlage dürfen Sie aber nur IFB **oder** investitionsbedingten Gewinnfreibetrag nutzen. GmbHs zahlen 23 % Körperschaftsteuer und haben keinen Gewinnfreibetrag.",
        },
        { typ: "h3", text: "Stromspeicher, Ladestationen und Nebenkosten" },
        {
          typ: "liste",
          punkte: [
            "**Stromspeicher:** Stationäre Batteriespeicher, die Strom aus erneuerbaren Quellen aufnehmen, fallen laut Öko-IFB-Verordnung ebenfalls unter den 22-%-Freibetrag. Die Nutzungsdauer ist gesondert festzulegen; der PV&B-Austria-Steuerratgeber (9. Auflage, September 2026) widmet Speichern ein eigenes Kapitel. Wirtschaftliche Grundlagen im Ratgeber [Gewerbespeicher-Kosten](/ratgeber/gewerbespeicher-kosten).",
            "**E-Ladestationen:** begünstigt nach der Öko-IFB-Verordnung, wenn ausschließlich Strom aus erneuerbaren Energieträgern geladen wird.",
            "**Dachpacht, Leasing, Contracting:** Bestandverträge können der Bestandvertragsgebühr nach § 33 TP 5 Gebührengesetz (1 %) unterliegen. Lassen Sie Vertragsentwürfe vor der Unterschrift prüfen – Hintergründe im Ratgeber [Photovoltaik-Leasing](/ratgeber/photovoltaik-leasing).",
          ],
        },
      ],
    },
    {
      id: "umsatzsteuer",
      titel: "Umsatzsteuer: Vorsteuerabzug und Reverse Charge beim Stromverkauf",
      tocLabel: "Umsatzsteuer",
      bloecke: [
        {
          typ: "p",
          text: "**Unternehmen mit Vorsteuerabzug zahlen auf die PV-Anlage 20 % Umsatzsteuer und holen sie vollständig als Vorsteuer zurück – wirtschaftlich zählt der Nettopreis.** Der befristete Nullsteuersatz für Module bis 35 kWp auf Wohn- und bestimmten öffentlichen Gebäuden galt nur für Lieferungen vom 1. Jänner 2024 bis 31. März 2025 (Übergang für Verträge vor dem 7. März 2025 bis Jahresende 2025). 2026 gilt für alle PV-Anlagen der Normalsteuersatz von 20 %.",
        },
        {
          typ: "p",
          text: "Verkauft der Betrieb Überschussstrom an einen Energieversorger oder Stromhändler, geht die Steuerschuld auf den Käufer über (Reverse Charge nach der Umsatzsteuer-Betrugsbekämpfungsverordnung, UStBBKV). Der Käufer rechnet per Gutschrift netto ab und führt die Umsatzsteuer selbst ab; der Anlagenbetreiber haftet aber für deren Abfuhr. Voraussetzung ist, dass der Käufer den Strom überwiegend weiterliefert. Liefern Sie an Endkunden, etwa an Mieter im selben Gebäude, stellen Sie selbst 20 % Umsatzsteuer in Rechnung. Wie Sie den Überschuss am besten verkaufen, zeigen die Ratgeber [Einspeisetarif Österreich 2026](/ratgeber/einspeiseverguetung-2026) und [Reststromvermarktung](/ratgeber/reststromvermarktung).",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Energiegemeinschaften: Umsatzsteuer genau prüfen",
          text: "Liefert ein umsatzsteuerpflichtiger Betrieb Strom an eine Erneuerbare-Energie-Gemeinschaft, schuldet unter den Voraussetzungen der UStBBKV die Gemeinschaft die Steuer. Ist diese Kleinunternehmerin, wird die übergehende Umsatzsteuer für sie zum Kostenfaktor. Die Details erklärt der Ratgeber [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe).",
        },
      ],
    },
    {
      id: "elektrizitaetsabgabe",
      titel: "Elektrizitätsabgabe: Eigenstrom ist befreit",
      tocLabel: "Elektrizitätsabgabe",
      bloecke: [
        {
          typ: "p",
          text: "**Selbst erzeugter und selbst verbrauchter Strom aus erneuerbaren Energieträgern ist in Österreich von der Elektrizitätsabgabe befreit – unabhängig von der Menge.** Das gilt für Unternehmen und Private und auch für gemeinschaftliche Erzeugungsanlagen und Erneuerbare-Energie-Gemeinschaften (§ 2 Abs. 1 Z 4 ElAbgG). Die Aufnahme des Betriebs ist nach der Elektrizitätsabgabe-Eigenstrombefreiungsverordnung anzuzeigen. Die Einspeisung ins öffentliche Netz ist nicht steuerbar. Laut Photovoltaikerlass schadet auch eine Zwischenspeicherung im Batteriespeicher der Befreiung nicht.",
        },
        {
          typ: "p",
          text: "Für Netzstrom gilt 2026 ein befristet gesenkter Satz von 0,82 ct/kWh für Unternehmen (0,1 ct/kWh für bestimmte Haushalte nach dem Stromkostenzuschussgesetz); regulär sind es 1,5 ct/kWh. Beispiel: Ein Betrieb verbraucht 60.000 kWh Solarstrom aus einer 100-kWp-Anlage selbst. 2026 entfallen dadurch rund 490 € Elektrizitätsabgabe, beim Regelsatz rund 900 € pro Jahr. In unseren Wirtschaftlichkeitsrechnungen – etwa im Ratgeber [Photovoltaik-Amortisation](/ratgeber/photovoltaik-amortisation) – steckt dieser Effekt bereits im vermeidbaren Strompreis.",
        },
      ],
    },
    {
      id: "landwirtschaft",
      titel: "Land- und Forstwirtschaft: Nebenbetrieb oder Gewerbebetrieb?",
      tocLabel: "Land- & Forstwirtschaft",
      bloecke: [
        {
          typ: "p",
          text: "**Stromerzeugung ist steuerlich keine land- und forstwirtschaftliche Tätigkeit – die Überschusseinspeisung wird aber als Nebenbetrieb der Landwirtschaft zugeordnet, wenn mehr als die Hälfte des erzeugten Stroms unmittelbar im eigenen land- und forstwirtschaftlichen Betrieb verbraucht wird.** So regelt es der Photovoltaikerlass (Rz 42). Verglichen wird die im Betrieb genutzte Strommenge mit allem anderen: Privatverbrauch, Verbrauch in anderen Betrieben (etwa einer gewerblichen Mast oder einem Heurigen) und Einspeisung. Überwiegt der landwirtschaftliche Verbrauch nicht, ist die Einspeisung ein eigener Gewerbebetrieb. Volleinspeiser sind laut Erlass immer gewerblich – auch auf dem Dach einer Maschinenhalle.",
        },
        { typ: "h3", text: "Was die Pauschalierung abdeckt – und was nicht" },
        {
          typ: "liste",
          punkte: [
            "**Einkommensteuer:** Bei pauschalierten Betrieben sind Einkünfte aus dem Nebenbetrieb nicht in die 55.000-€-Grenze des § 7 LuF-PauschVO 2015 einzubeziehen, sondern gesondert zu erfassen – soweit sie nicht ohnehin steuerfrei sind. Der Anteil der AfA, der auf den landwirtschaftlichen Eigenverbrauch entfällt, ist durch die Pauschalierung abgegolten und nicht zusätzlich absetzbar.",
            "**Steuerbefreiung:** Die 12.500-kWh-Befreiung für Anlagen bis 35 kWp und 25 kW Anschlussleistung gilt ausdrücklich auch für Einkünfte aus Land- und Forstwirtschaft.",
            "**Umsatzsteuer:** Ist die gesamte Anlage einem Nebenbetrieb eines umsatzsteuerlich pauschalierten Betriebs zuzurechnen (§ 22 UStG), sind die Vorsteuern abpauschaliert und die Einspeisung unterliegt dem Pauschalsteuersatz von 13 %. Reverse Charge kommt dann nicht zur Anwendung. Liegt kein Nebenbetrieb vor, sind die Vorsteuern aufzuteilen, und für die Einspeisung gilt der Normalsteuersatz.",
            "**Investitionsfreibetrag:** Bei pauschaler Gewinnermittlung ausgeschlossen. Wer Einnahmen-Ausgaben-Rechnung führt oder bilanziert, kann AfA und IFB voll nutzen. Ein Wechsel aus der Pauschalierung ist an Bindungsfristen geknüpft – vor der Investition prüfen.",
          ],
        },
        {
          typ: "tabelle",
          caption: "Drei typische Fälle aus der Landwirtschaft nach dem Photovoltaikerlass (Beispielwerte)",
          kopf: ["Fall", "Stromverwendung", "Zuordnung", "Folgen"],
          zeilen: [
            ["A: 30 kWp am Milchviehstall, 25 kW Anschluss, 30.000 kWh", "55 % Stall und Melktechnik, 15 % Wohnhaus, 30 % Einspeisung (9.000 kWh)", "Nebenbetrieb der Landwirtschaft", "Einspeisung steuerfrei (unter 12.500 kWh); bei USt-Pauschalierung 13 % Pauschalsteuersatz; AfA-Anteil Landwirtschaft pauschal abgegolten"],
            ["B: 60 kWp auf dem Maschinenhallendach, 60.000 kWh", "40 % Betrieb, 10 % Wohnhaus, 50 % Einspeisung (30.000 kWh)", "eigener Gewerbebetrieb (60 % außerhalb der Landwirtschaft)", "Einspeisung voll steuerpflichtig (über 35 kWp); 50 % der AfA im Gewerbebetrieb absetzbar; 20 % USt, Reverse Charge; Vorsteuern aufteilen"],
            ["C: 200 kWp Volleinspeisung auf Hallen", "100 % Einspeisung", "immer Gewerbebetrieb", "eigene Gewinnermittlung mit AfA und IFB; 20 % USt, Reverse Charge; voller Vorsteuerabzug"],
          ],
          minBreite: 760,
          fussnote: "Beispielwerte nach den Kriterien des Photovoltaikerlasses (Rz 10, 36, 42–43 und 60, Beispiele 9–11 und 20–22). In Fall B ergibt sich bei 7 ct/kWh Erlös und 54.000 € Anschaffungskosten (900 €/kWp) ein Gewinn vor IFB von rund 750 € (2.100 € Erlös minus 1.350 € anteilige AfA). Wie ein IFB bei gemischter Nutzung aufzuteilen ist, sollten Sie mit Ihrer Steuerberatung klären. Keine Steuerberatung.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Anlagengröße und Verbrauch zusammen planen",
          text: "Die Zuordnung hängt an der Strommenge, nicht an der Leistung. Wer Kühlung, Melktechnik, Trocknung oder Lüftung in die Mittagsstunden legt, erhöht den landwirtschaftlichen Anteil. Planung, Lastprofile und Förderwege für Höfe finden Sie auf unserer Seite [Photovoltaik für die Landwirtschaft](/landwirtschaft). Die Verpachtung von Flächen an einen fremden PV-Betreiber ist steuerlich gesondert zu beurteilen (EStR 2000 Rz 5190 ff).",
        },
      ],
    },
    {
      id: "privat",
      titel: "Privatpersonen: 12.500 kWh steuerfrei, 730-€-Freibetrag, Kleinunternehmer",
      tocLabel: "Privat",
      bloecke: [
        {
          typ: "p",
          text: "**Natürliche Personen versteuern Einkünfte aus der Einspeisung von bis zu 12.500 kWh pro Jahr nicht, wenn die Anlage höchstens 35 kWp Engpassleistung und 25 kW Anschlussleistung hat (§ 3 Abs. 1 Z 39 EStG).** Die Grenzen gelten je Anlage, die 12.500 kWh aber nur einmal je Person – auch wenn sie mehrere Anlagen betreibt. Für Körperschaften wie Vereine oder GmbHs gilt die Befreiung nicht.",
        },
        {
          typ: "p",
          text: "Was darüber hinaus eingespeist wird, sind Einkünfte aus Gewerbebetrieb. Hat die Person auch lohnsteuerpflichtige Einkünfte, bleiben Gewinne bis 730 € pro Jahr über den Veranlagungsfreibetrag steuerfrei. Statt einer Einnahmen-Ausgaben-Rechnung ist die Kleinunternehmerpauschalierung möglich: 45 % der Einnahmen gelten als Betriebsausgaben, weitere Kosten oder Investitionsbegünstigungen sind dann ausgeschlossen, der Grundfreibetrag von 15 % bleibt.",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: 30-kWp-Anlage auf einem Chalet (25 kW Anschlussleistung), Steuerjahr 2026",
          kopf: ["Position", "Wert"],
          zeilen: [
            ["Erzeugung (1.000 kWh/kWp)", "30.000 kWh"],
            ["Eigenverbrauch 25 %", "7.500 kWh"],
            ["Einspeisung", "22.500 kWh"],
            ["davon steuerfrei", "12.500 kWh"],
            ["steuerpflichtige Einspeisung × 7 ct", "10.000 kWh = 700 €"],
            ["− 45 % pauschale Betriebsausgaben", "− 315 €"],
            ["− 15 % Grundfreibetrag", "− 58 €"],
            ["Gewinn", "≈ 327 € – unter 730 €, keine Erklärung nötig"],
          ],
          hervorheben: 1,
          markierteZeile: 7,
          minBreite: 480,
          fussnote: "Eigene Rechnung nach dem Muster des BMF (Seite „Überschusseinspeisung“). Erlös 7 ct/kWh als Annahme knapp unter dem OeMAG-Marktpreis-Durchschnitt Jänner–August 2026 von rund 7,3 ct/kWh. Der Veranlagungsfreibetrag setzt lohnsteuerpflichtige Einkünfte voraus. Keine Steuerberatung.",
        },
        {
          typ: "p",
          text: "Umsatzsteuerlich sind private Überschusseinspeiser Unternehmer, bei Gesamtumsätzen bis 55.000 € aber als Kleinunternehmer befreit – dann gibt es auch keinen Vorsteuerabzug. Wer freiwillig zur Regelbesteuerung optiert, ist für das laufende und mindestens vier weitere Jahre gebunden. Zusätzlich greift ein Überwiegensprinzip: Übersteigt der Privatverbrauch die entgeltlich eingespeiste Strommenge, ist der Vorsteuerabzug für die Anlage zur Gänze ausgeschlossen (§ 12 Abs. 2 Z 2 lit. a UStG). Was eine Privatanlage 2026 kostet, zeigt der Ratgeber [Photovoltaik-Kosten Österreich](/ratgeber/solaranlage-kosten).",
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Steuerlich sauber planen und betreiben",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Betreiber festlegen:** GmbH, Einzelunternehmen, landwirtschaftlicher Betrieb oder Privatperson – das entscheidet über IFB, Gewinnfreibetrag und Umsatzsteuer.",
            "**Stromverwendung schätzen und dokumentieren:** Eigenverbrauch Betrieb, Privatverbrauch und Einspeisung getrennt messen oder begründet schätzen – wichtig für Landwirtschaft und gemischte Nutzung.",
            "**Zuschuss vor IFB abziehen:** Ein EAG-Investitionszuschuss mindert die Anschaffungskosten und damit AfA und Freibetrag.",
            "**Zeitpunkt beachten:** Für 22 % IFB müssen die Anschaffungs- oder Herstellungskosten auf den Zeitraum bis 31. Dezember 2026 entfallen.",
            "**Elektrizitätsabgabe-Befreiung anzeigen** und Aufzeichnungen nach der Eigenstrombefreiungsverordnung führen.",
            "**Gutschriften prüfen:** Reverse-Charge-Hinweis bei Lieferung an Energieversorger, 13 % bei pauschalierten Landwirten.",
            "**Anlageverzeichnis führen:** IFB und Behaltefrist von vier Jahren nachweisbar dokumentieren.",
          ],
        },
        {
          typ: "tool",
          href: "/foerdercheck",
          titel: "Förderung und Steuervorteile für Ihr Projekt prüfen",
          text: "Der Förder-Check zeigt, welche Bundes- und Landesförderungen sowie steuerlichen Instrumente für Ihre Anlage in Frage kommen.",
          label: "Zum Förder-Check",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Über wie viele Jahre wird eine PV-Anlage in Österreich abgeschrieben?",
      a: "Über 20 Jahre. Der Photovoltaikerlass des BMF legt diese betriebsgewöhnliche Nutzungsdauer zugrunde. Statt linear 5 % pro Jahr ist auch eine degressive AfA von bis zu 30 % des Restbuchwerts möglich.",
    },
    {
      q: "Wie hoch ist der Investitionsfreibetrag für Photovoltaik 2026?",
      a: "22 % der Anschaffungs- oder Herstellungskosten, soweit diese auf den Zeitraum 1. November 2025 bis 31. Dezember 2026 entfallen; ab 2027 wieder 15 %. Die Bemessungsgrundlage ist mit 1 Mio. € pro Wirtschaftsjahr gedeckelt. Details im Ratgeber [Investitionsfreibetrag für Photovoltaik](/ratgeber/investitionsfreibetrag-photovoltaik).",
    },
    {
      q: "Muss ich auf selbst verbrauchten Solarstrom Elektrizitätsabgabe zahlen?",
      a: "Nein. Selbst erzeugter und selbst verbrauchter Strom aus erneuerbaren Energieträgern ist ohne Mengengrenze befreit, auch in gemeinschaftlichen Erzeugungsanlagen und Erneuerbare-Energie-Gemeinschaften. Die Aufnahme des Betriebs ist nach der Eigenstrombefreiungsverordnung anzuzeigen.",
    },
    {
      q: "Gibt es 2026 noch 0 % Umsatzsteuer auf PV-Module?",
      a: "Nein. Der Nullsteuersatz galt für Lieferungen vom 1. Jänner 2024 bis 31. März 2025, mit Übergangsregel für Verträge vor dem 7. März 2025 bis Jahresende 2025. 2026 gilt der Normalsteuersatz von 20 %; Unternehmen mit Vorsteuerabzug holen ihn zurück.",
    },
    {
      q: "Ist die PV-Anlage eines Landwirts Teil des land- und forstwirtschaftlichen Betriebs?",
      a: "Nur wenn mehr als die Hälfte des erzeugten Stroms unmittelbar im eigenen land- und forstwirtschaftlichen Betrieb verbraucht wird. Dann ist die Überschusseinspeisung ein Nebenbetrieb, bei pauschalierten Betrieben gilt für die Einspeisung der Umsatzsteuer-Pauschalsatz von 13 %. Andernfalls – und bei Volleinspeisung immer – entsteht ein eigener Gewerbebetrieb.",
    },
    {
      q: "Wann muss ich als Privatperson Einkünfte aus meiner PV-Anlage erklären?",
      a: "Wenn Sie mehr als 12.500 kWh im Jahr einspeisen oder die Anlage 35 kWp bzw. 25 kW Anschlussleistung übersteigt und der Gewinn über dem Veranlagungsfreibetrag von 730 € liegt. Dieser Freibetrag setzt voraus, dass Sie auch lohnsteuerpflichtige Einkünfte beziehen. Die Gewinnermittlung ist mit der Kleinunternehmerpauschalierung einfach möglich.",
    },
    {
      q: "Wer zahlt die Umsatzsteuer, wenn mein Betrieb Strom an einen Energieversorger verkauft?",
      a: "Der Energieversorger, sofern er den Strom überwiegend weiterliefert (Reverse Charge nach der UStBBKV). Er rechnet per Gutschrift netto ab; Sie als Anlagenbetreiber haften aber für die Abfuhr. Pauschalierte Landwirte mit Nebenbetrieb stellen dagegen 13 % Umsatzsteuer in Rechnung.",
    },
  ],

  passend: [
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile im Überblick", text: "IFB, AfA, Gewinnfreibetrag und Elektrizitätsabgabe kompakt." },
    { href: "/ratgeber/investitionsfreibetrag-photovoltaik", titel: "Investitionsfreibetrag für Photovoltaik", text: "22 % bis Ende 2026 – mit Rechenbeispielen." },
    { href: "/ratgeber/eag-investitionszuschuss", titel: "EAG-Investitionszuschuss 2026", text: "Fördercalls, Sätze und Ablauf der Bundesförderung." },
    { href: "/landwirtschaft", titel: "Photovoltaik für die Landwirtschaft", text: "Stall, Halle und Hofstelle mit Solarstrom versorgen." },
  ],

  quellen: [
    { titel: "BMF – Photovoltaikerlass, BMF-AV Nr. 106/2025 (GZ 2025-0.461.257, PDF)", url: "https://findok.bmf.gv.at/findok/resources/pdf/0bc7d846-26b9-489a-8704-76550de8d199/83743.1.1.pdf", stand: "07/2025" },
    { titel: "BMF – Steuerliche Aspekte bei Photovoltaikanlagen: Überschusseinspeisung", url: "https://www.bmf.gv.at/themen/klimapolitik/steuerliche-aspekte-bei-photovoltaikanlagen-von-privatpersonen/ueberschusseinspeisung.html", stand: "08/2025" },
    { titel: "BMF – Steuerliche Aspekte bei Photovoltaikanlagen: Erneuerbare-Energie-Gemeinschaften", url: "https://www.bmf.gv.at/themen/klimapolitik/steuerliche-aspekte-bei-photovoltaikanlagen-von-privatpersonen/erneuerbare-energie-gemeinschaften.html", stand: "08/2025" },
    { titel: "USP – Abschreibung (lineare und degressive AfA)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/abschreibung.html", stand: "01/2026" },
    { titel: "USP – Investitionsfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "01/2026" },
    { titel: "USP – Elektrizitätsabgabe (Sätze 2026, Befreiungen)", url: "https://www.usp.gv.at/themen/steuern-finanzen/weitere-steuern-und-abgaben/verbrauchsteuern_und_energieabgaben/elektrizitaetsabgabe.html", stand: "01/2026" },
    { titel: "BMF – Steuersatz für Photovoltaikmodule (Nullsteuersatz 2024/2025)", url: "https://www.bmf.gv.at/themen/steuern/fuer-unternehmen/umsatzsteuer/informationen/steuersatz-fuer-photovoltaikmodule.html", stand: "09/2026" },
    { titel: "PV&B Austria – Steuerratgeber, 9. Auflage inkl. Batteriespeicher", url: "https://pvbaustria.at/neuauflage-steuerratgeber-erweiterung-um-steuerrechtliche-vorgaben-zum-betrieb-von-batteriespeichern/", stand: "09/2026" },
  ],

  seitenCta: {
    titel: "Förderung und Steuern früh mitplanen",
    text: "Wir legen Anlage, Speicher und Zeitplan so aus, dass Zuschuss und Freibetrag nutzbar bleiben.",
    href: "/foerdercheck",
    label: "Förder-Check starten",
  },
  cta: {
    title: "Ihre PV-Anlage – technisch und wirtschaftlich durchdacht.",
    text: "Ökovolt Solartechnik aus Ostermiething plant, errichtet und meldet Photovoltaikanlagen für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich. Die steuerliche Beurteilung übernimmt Ihre Steuerberatung – wir liefern die Zahlen dafür.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Steuerliche Vorteile ansehen", href: "/forderungen/steuerlich" },
  },
};

export default artikel;
