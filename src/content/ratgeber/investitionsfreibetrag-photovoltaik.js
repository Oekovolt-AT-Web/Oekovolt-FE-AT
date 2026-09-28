// Ratgeber: Investitionsfreibetrag (IFB) für Photovoltaik – 22 % bis Ende 2026
// Rechtsstand 09/2026: § 11 EStG (befristete Erhöhung 1.11.2025–31.12.2026, NR-Beschluss 15.10.2025),
// Öko-IFB-VO BGBl. II Nr. 155/2023, BMF-Photovoltaikerlass BMF-AV Nr. 106/2025, USP/WKO/TPA.
// Rechenbeispiele: eigene Rechnung bzw. pvcalc.mjs (R1-Standardannahmen), gerundet. Keine Imports.

const artikel = {
  slug: "investitionsfreibetrag-photovoltaik",
  title: "Investitionsfreibetrag für Photovoltaik: 22 % bis Ende 2026",
  seoTitle: "Investitionsfreibetrag Photovoltaik 22 % | Ökovolt",
  kurzTitel: "Investitionsfreibetrag PV",
  description:
    "Investitionsfreibetrag für Photovoltaik: 22 % Öko-IFB bis 31.12.2026 – Voraussetzungen, Speicher, Zeitpunkt, EAG-Zuschuss, Leasing und Rechenbeispiele.",
  excerpt:
    "Bis Jahresende 2026 können Betriebe 22 % der Anschaffungskosten einer PV-Anlage zusätzlich zur Abschreibung absetzen. Was begünstigt ist, wann die Anlage fertig sein muss und was das in Euro bringt.",
  hauptKeyword: "investitionsfreibetrag photovoltaik",
  keywords: [
    "Investitionsfreibetrag Photovoltaik",
    "Öko-IFB 22 Prozent",
    "IFB PV-Anlage 2026",
    "Investitionsfreibetrag Stromspeicher",
    "IFB Gewinnfreibetrag Vergleich",
    "Investitionsfreibetrag Leasing",
    "Öko-IFB-Verordnung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Home/download.jpg",
  bildAlt: "Drohnenblick auf ein Blechdach mit schwarzen Photovoltaikmodulen",
  badge: { wert: "22 %", text: "Öko-IFB für Anschaffungen bis 31.12.2026" },

  kurzFazit: [
    "**Der Öko-Investitionsfreibetrag beträgt für Photovoltaik 22 % der Anschaffungs- oder Herstellungskosten, soweit diese zwischen 1. November 2025 und 31. Dezember 2026 anfallen – ab 2027 sind es wieder 15 %.** Er wird zusätzlich zur vollen Abschreibung gewährt.",
    "**Eine GmbH spart mit einer 100-kWp-Anlage um 75.000 € rund 3.800 € Körperschaftsteuer, mit 500 kWp um 300.000 € rund 15.200 €.** Bei einem Einzelunternehmer mit 48 % Grenzsteuersatz sind es rund 7.900 € bzw. 31.700 €.",
    "**Begünstigt sind neue PV-Anlagen, stationäre Stromspeicher und Ladestationen mit 100 % Ökostrom.** Ausgeschlossen sind pauschalierte Betriebe, gebrauchte Anlagen, Wirtschaftsgüter mit investitionsbedingtem Gewinnfreibetrag und reine Vermietung.",
    "**Ein EAG-Investitionszuschuss mindert die Bemessungsgrundlage;** die Behaltefrist beträgt vier Jahre, der Deckel 1 Mio. € Investition pro Wirtschaftsjahr.",
  ],

  abschnitte: [
    {
      id: "was-ist-der-ifb",
      titel: "Was ist der Investitionsfreibetrag für Photovoltaik?",
      tocLabel: "Was ist der IFB?",
      bloecke: [
        {
          typ: "p",
          text: "**Der Investitionsfreibetrag (IFB, § 11 EStG) ist eine zusätzliche Betriebsausgabe im Jahr der Anschaffung oder Herstellung: Für PV-Anlagen beträgt er 2026 22 % der Anschaffungskosten und kürzt die Abschreibungsbasis nicht.** Die Anlage wird also weiterhin zu 100 % über 20 Jahre abgeschrieben, und zusätzlich mindern 22 % den Gewinn des Investitionsjahres. In Summe werden damit 122 % der Anschaffungskosten gewinnmindernd – ein dauerhafter Steuervorteil, keine bloße Steuerstundung wie bei der degressiven AfA.",
        },
        {
          typ: "p",
          text: "Der IFB wurde 2023 eingeführt: 10 % für allgemeine Investitionen, 15 % für Wirtschaftsgüter aus dem Bereich Ökologisierung. Der Nationalrat hat am 15. Oktober 2025 eine befristete Erhöhung auf 20 % bzw. 22 % beschlossen. Sie gilt, soweit die Kosten nachweislich auf den Zeitraum 1. November 2025 bis 31. Dezember 2026 entfallen. Photovoltaik gehört nach der Öko-IFB-Verordnung (BGBl. II Nr. 155/2023) zu den ökologischen Wirtschaftsgütern. Die Kurzdefinition finden Sie im [Lexikon unter IFB](/wissen/lexikon#ifb), alle anderen Steuerfragen rund um die Anlage im Ratgeber [Photovoltaik & Steuern](/ratgeber/photovoltaik-steuern).",
        },
        {
          typ: "tabelle",
          caption: "IFB-Sätze nach Zeitpunkt der Anschaffung oder Herstellung",
          kopf: ["Zeitraum", "Allgemeiner IFB", "Öko-IFB (u. a. PV, Speicher)"],
          zeilen: [
            ["2023 bis 31.10.2025", "10 %", "15 %"],
            ["1.11.2025 bis 31.12.2026", "20 %", "22 %"],
            ["ab 1.1.2027 (nach derzeitiger Rechtslage)", "10 %", "15 %"],
          ],
          hervorheben: 2,
          markierteZeile: 1,
          minBreite: 520,
          fussnote: "Quelle: § 11 EStG, USP und WKO (Stand 01/2026). Bemessungsgrundlage höchstens 1 Mio. € Anschaffungs- oder Herstellungskosten pro Wirtschaftsjahr, bei Rumpfwirtschaftsjahren aliquot. Keine Steuerberatung.",
        },
      ],
    },
    {
      id: "voraussetzungen",
      titel: "Voraussetzungen und Ausschlüsse",
      tocLabel: "Voraussetzungen",
      bloecke: [
        {
          typ: "p",
          text: "**Den IFB erhalten Körperschaften und natürliche Personen mit betrieblichen Einkünften, die ihren Gewinn durch Bilanzierung oder Einnahmen-Ausgaben-Rechnung ermitteln – für neue Wirtschaftsgüter mit mindestens vier Jahren Nutzungsdauer, die einem inländischen Betrieb zuzurechnen sind.** Eine PV-Anlage mit 20 Jahren Nutzungsdauer erfüllt das Nutzungsdauer-Kriterium. Wird Strom ins Netz eingespeist, liegt nach dem Photovoltaikerlass insoweit ein Gewerbebetrieb vor – auch das Betriebserfordernis ist dann in der Regel erfüllt.",
        },
        {
          typ: "tabelle",
          caption: "IFB für PV-Anlagen: Was zählt, was nicht (Stand September 2026)",
          kopf: ["Kriterium", "Begünstigt", "Nicht begünstigt"],
          zeilen: [
            ["Wirtschaftsgut", "neue PV-Anlage inkl. Montage und Netzanschluss; stationärer Speicher; Ladestation mit 100 % Ökostrom", "gebrauchte Anlagen, sofort abgesetzte geringwertige Wirtschaftsgüter, fossil betriebene Anlagen"],
            ["Gewinnermittlung", "Bilanz, Einnahmen-Ausgaben-Rechnung", "jede Pauschalierung (Basis-, Kleinunternehmer-, LuF-Pauschalierung)"],
            ["Einkunftsart", "betriebliche Einkünfte (Gewerbe, selbständige Arbeit, Land- und Forstwirtschaft mit Gewinnermittlung)", "Vermietung und Verpachtung (§ 28 EStG)"],
            ["Kombination", "IFB zusätzlich zur linearen oder degressiven AfA", "gleiches Wirtschaftsgut mit investitionsbedingtem Gewinnfreibetrag"],
            ["Höhe", "bis 1 Mio. € Bemessungsgrundlage pro Wirtschaftsjahr", "Kosten darüber (kein Vortrag des Deckels)"],
          ],
          minBreite: 720,
          fussnote: "Quellen: USP „Investitionsfreibetrag“, WKO „Investitionsfreibetrag“, BMF-Photovoltaikerlass Rz 12. Keine Steuerberatung.",
        },
        { typ: "h3", text: "Speicher, Ladestationen, Wärmepumpen" },
        {
          typ: "p",
          text: "Die Öko-IFB-Verordnung zählt ausdrücklich auf: Wirtschaftsgüter zur Stromerzeugung aus erneuerbaren Quellen, stationäre Anlagen, die Strom aus erneuerbaren Quellen elektrochemisch speichern, sowie E-Ladestationen – letztere nur, wenn ausschließlich Strom aus erneuerbaren Energieträgern geladen wird. Ein [Gewerbespeicher](/produkte/stromspeicher) zur PV-Anlage erhält damit ebenfalls 22 %. Anders als beim EAG-Zuschuss muss der Speicher nicht gleichzeitig mit einer neuen PV-Anlage errichtet werden; auch die Nachrüstung ist begünstigt, solange er erneuerbaren Strom speichert.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Kleine Anlagen im Einzelunternehmen",
          text: "Bleibt eine Anlage unter 35 kWp und 25 kW Anschlussleistung, kann für bis zu 12.500 kWh Einspeisung die Steuerbefreiung greifen. Der Photovoltaikerlass (Rz 41, Beispiel 7 d) zeigt: Die Betriebsausgaben sind dann anteilig zu kürzen, der IFB steht aber von den vollen Anschaffungskosten zu.",
        },
      ],
    },
    {
      id: "zeitpunkt",
      titel: "Zeitpunkt: Wann die Anlage „angeschafft“ oder „hergestellt“ ist",
      tocLabel: "Zeitpunkt & Teilbeträge",
      bloecke: [
        {
          typ: "p",
          text: "**Der IFB steht im Wirtschaftsjahr der Anschaffung oder Herstellung zu: Bei Anschaffung zählt der Übergang der wirtschaftlichen Verfügungsmacht, bei Herstellung die Fertigstellung.** Eine Anzahlung oder eine unterschriebene Auftragsbestätigung reicht nicht. Erstreckt sich die Herstellung über mehrere Wirtschaftsjahre, kann der IFB bereits von den im jeweiligen Jahr aktivierten Teilbeträgen geltend gemacht werden. Der erhöhte Satz von 22 % gilt nur, soweit die Kosten nachweislich auf den Zeitraum bis 31. Dezember 2026 entfallen.",
        },
        {
          typ: "tabelle",
          caption: "Beispiel: 500-kWp-Dachanlage (300.000 €), Herstellung über den Jahreswechsel 2026/2027",
          kopf: ["Variante", "Kosten 2026", "Kosten 2027", "IFB gesamt", "KöSt-Ersparnis (23 %)"],
          zeilen: [
            ["Fertig bis 31.12.2026", "300.000 €", "–", "66.000 €", "15.180 €"],
            ["60 % bis 31.12.2026 aktiviert", "180.000 € × 22 %", "120.000 € × 15 %", "57.600 €", "13.248 €"],
            ["Komplett erst 2027", "–", "300.000 € × 15 %", "45.000 €", "10.350 €"],
          ],
          hervorheben: 4,
          markierteZeile: 0,
          minBreite: 680,
          fussnote: "Eigene Rechnung, Kalenderwirtschaftsjahr, keine Förderung. Ob Kosten als aktivierte Teilbeträge einer Herstellung gelten oder eine Anschaffung vorliegt, hängt von der Vertragsgestaltung ab (z. B. Generalunternehmervertrag mit Abnahme). Ob eine montierte, aber noch nicht ans Netz angeschlossene Anlage bereits fertiggestellt ist, bitte vorab mit der Steuerberatung klären. Keine Steuerberatung.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Timing im vierten Quartal 2026",
          text: "Für Projekte, die noch 2026 den 22-%-Satz erreichen sollen, zählt jede Woche: Netzanschlussbestätigung früh beim Netzbetreiber anfragen, Wechselrichter, Trafo und Unterkonstruktion mit fixen Lieferterminen bestellen, Montage vor Schneefall einplanen und Abnahme, Prüfprotokoll und Inbetriebnahme sauber dokumentieren. Wer zusätzlich den EAG-Zuschuss im Fördercall vom 8. bis 22. Oktober 2026 beantragt, muss den Antrag vor der Inbetriebnahme stellen – Bauen darf man schon vorher. Den Ablauf eines Gewerbeprojekts beschreibt der Ratgeber [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "eag-zuschuss-afa",
      titel: "Zusammenspiel mit EAG-Zuschuss und Abschreibung",
      tocLabel: "EAG-Zuschuss & AfA",
      bloecke: [
        {
          typ: "p",
          text: "**Ein steuerfreier EAG-Investitionszuschuss wird zuerst von den Anschaffungskosten abgezogen; IFB und AfA berechnen sich vom verbleibenden Betrag.** Das folgt aus § 6 Z 10 EStG und wird im Photovoltaikerlass bestätigt. Beide Instrumente lassen sich also kombinieren, der Zuschuss verkleinert aber die IFB-Basis. Ein Zuschuss von 13.000 € auf eine 100-kWp-Anlage kostet damit 2.860 € IFB oder rund 660 € Körperschaftsteuer-Vorteil – er bleibt klar im Plus. Wie Sie den Zuschuss beantragen und wie die Reihung funktioniert, zeigt der Ratgeber [EAG-Investitionszuschuss 2026](/ratgeber/eag-investitionszuschuss); einen Überblick über die Bundesförderung gibt die Seite [Bundesförderung](/forderungen/bundesfoerderung).",
        },
        {
          typ: "p",
          text: "Die Abschreibung läuft unabhängig vom IFB: linear mit 5 % oder degressiv mit bis zu 30 % vom Restbuchwert. Kombiniert eine GmbH für eine 100-kWp-Anlage die degressive AfA (22.500 €) mit dem IFB (16.500 €), mindert sie ihren Gewinn im ersten Jahr um 39.000 € – das entspricht rund 52 % der Investition. Entsteht dadurch ein Verlust, ist er nach Einschätzung der Steuerberatungskanzlei TPA in voller Höhe vortragbar.",
        },
      ],
    },
    {
      id: "rechenbeispiele",
      titel: "Rechenbeispiele: Was bringt der IFB in Euro?",
      tocLabel: "Rechenbeispiele",
      bloecke: [
        {
          typ: "p",
          text: "**Die Steuerersparnis aus dem IFB entspricht Anschaffungskosten × 22 % × Steuersatz.** Für eine GmbH mit 23 % Körperschaftsteuer sind das 5,06 % der Investition, für einen Einzelunternehmer mit 48 % Grenzsteuersatz 10,56 %. Die folgenden Beispiele verwenden unsere Standard-Richtwerte für Österreich 2026.",
        },
        {
          typ: "tabelle",
          caption: "Steuerersparnis aus dem IFB: 100 kWp und 500 kWp, GmbH und Einzelunternehmer",
          kopf: ["Anlage", "Bemessungsgrundlage", "IFB 22 %", "GmbH (23 %)", "Einzelunternehmer (48 %)", "zum Vergleich 15 % ab 2027, GmbH"],
          zeilen: [
            ["100 kWp, ohne Zuschuss", "75.000 €", "16.500 €", "3.795 €", "7.920 €", "2.588 €"],
            ["100 kWp, mit 13.000 € EAG-Zuschuss", "62.000 €", "13.640 €", "3.137 €", "6.547 €", "2.139 €"],
            ["500 kWp, ohne Zuschuss", "300.000 €", "66.000 €", "15.180 €", "31.680 €", "10.350 €"],
            ["500 kWp, mit 60.000 € EAG-Zuschuss", "240.000 €", "52.800 €", "12.144 €", "25.344 €", "8.280 €"],
          ],
          hervorheben: 3,
          markierteZeile: 0,
          minBreite: 760,
          fussnote: "Eigene Rechnung. Richtwerte netto: 100 kWp 750 €/kWp, 500 kWp 600 €/kWp (keine Ökovolt-Preise). Zuschuss: Kategorie C 130 €/kWp bzw. Kategorie D 120 €/kWp (Höchstsätze 2026). Grenzsteuersatz 48 % als Annahme; beim Einzelunternehmer mindert der IFB zusätzlich die Bemessungsgrundlage des Gewinnfreibetrags, was den Effekt leicht verringert. Ausreichender Gewinn unterstellt. Keine Steuerberatung.",
        },
        {
          typ: "p",
          text: "Auf die Wirtschaftlichkeit nach Steuern wirkt der IFB spürbar, aber nicht dramatisch: Für die 100-kWp-Anlage einer GmbH (60 % Eigenverbrauch, 18 ct/kWh vermeidbarer Strompreis) steigt die Rendite nach Steuern in unserem Rechenmodell von 13,5 % ohne IFB auf 14,1 % mit 22 % IFB; mit zusätzlichem EAG-Zuschuss sind es 17,0 %. Bei 500 kWp (50 % Eigenverbrauch, 15 ct/kWh) steigt sie von 13,2 % auf 13,8 %. Entscheidend bleibt der Eigenverbrauch – wie sich die Amortisation zusammensetzt, erklärt der Ratgeber [Photovoltaik-Amortisation](/ratgeber/photovoltaik-amortisation), die Investitionskosten nach Größenklassen der Ratgeber [Photovoltaik-Kosten Österreich](/ratgeber/solaranlage-kosten).",
        },
      ],
    },
    {
      id: "ifb-vs-gfb",
      titel: "IFB oder investitionsbedingter Gewinnfreibetrag?",
      tocLabel: "IFB vs. Gewinnfreibetrag",
      bloecke: [
        {
          typ: "p",
          text: "**Einzelunternehmer und Mitunternehmer müssen je Wirtschaftsgut zwischen IFB und investitionsbedingtem Gewinnfreibetrag wählen – für PV ist der IFB 2026 meist die bessere Wahl.** Der Gewinnfreibetrag besteht aus einem Grundfreibetrag von 15 % der ersten 33.000 € Gewinn (höchstens 4.950 €), der immer zusteht, und einem investitionsbedingten Teil, der vom Gewinn abhängt (13 % in der ersten Stufe) und durch Investitionen gedeckt sein muss. Der IFB bemisst sich dagegen an der Investition. Beide lassen sich kombinieren, wenn der Gewinnfreibetrag mit anderen Wirtschaftsgütern gedeckt wird.",
        },
        {
          typ: "tabelle",
          caption: "Einzelunternehmer 2026: Gewinn 150.000 €, PV-Investition 75.000 €",
          kopf: ["Variante", "Abzüge", "Summe Abzüge", "Ersparnis bei 48 %"],
          zeilen: [
            ["A: IFB für die PV-Anlage", "IFB 16.500 € + Grundfreibetrag 4.950 €", "21.450 €", "≈ 10.300 €"],
            ["B: investitionsbedingter GFB für die PV-Anlage", "13 % × 117.000 € = 15.210 € + 4.950 €", "20.160 €", "≈ 9.680 €"],
            ["C: IFB für PV + GFB mit anderen Investitionen gedeckt", "16.500 € + 4.950 € + 13 % × 100.500 € = 13.065 €", "34.515 €", "≈ 16.570 €"],
          ],
          hervorheben: 3,
          markierteZeile: 2,
          minBreite: 680,
          fussnote: "Eigene Rechnung nach dem Schema der WKO-Beispiele 2026. Variante C setzt zusätzliche begünstigte Investitionen von mindestens 13.065 € voraus (z. B. weitere Wirtschaftsgüter). Für beide Freibeträge gilt eine Behaltefrist von vier Jahren. Keine Steuerberatung.",
        },
      ],
    },
    {
      id: "leasing",
      titel: "Leasing, Mietkauf und Contracting: Wer bekommt den IFB?",
      tocLabel: "Leasing & Contracting",
      bloecke: [
        {
          typ: "p",
          text: "**Den IFB erhält, wem die Anlage steuerlich zuzurechnen ist – also der wirtschaftliche Eigentümer.** Beim klassischen Operating-Leasing ist das die Leasinggesellschaft: Sie kann den IFB nutzen, der Leasingnehmer setzt die Raten als Betriebsausgabe ab. Ob und wie sich der Vorteil in der Rate niederschlägt, ist Verhandlungssache. Nach den Einkommensteuerrichtlinien wird ein Vollamortisations-Leasinggut dagegen dem Leasingnehmer zugerechnet, wenn die Grundmietzeit weniger als 40 % oder mehr als 90 % der Nutzungsdauer beträgt – bei 20 Jahren also unter 8 oder über 18 Jahren –, bei günstigen Kaufoptionen oder bei Spezialleasing. Dann aktiviert der Leasingnehmer die Anlage und kann den IFB selbst geltend machen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Mietkauf:** Der Käufer ist wirtschaftlicher Eigentümer, schreibt ab und nutzt den IFB.",
            "**Contracting oder PPA mit Dritteigentum:** Der Contractor investiert und nutzt IFB und Abschreibung; Sie kaufen nur den Strom.",
            "**EAG-Förderung bei Leasing:** Rechnungen dürfen auf Leasing- oder Contracting-Geber lauten, wenn die Verträge der Förderstelle vorgelegt werden (§ 13 Abs. 8 EAG-IZV).",
          ],
        },
        {
          typ: "p",
          text: "Welches Modell für Ihre Bilanz und Liquidität passt, vergleicht der Ratgeber [Photovoltaik-Leasing](/ratgeber/photovoltaik-leasing). Finanzierungswege für Betriebe zeigt die Seite [Finanzierung](/service/finanzierung).",
        },
      ],
    },
    {
      id: "behaltefrist",
      titel: "Behaltefrist, Nachversteuerung und Dokumentation",
      tocLabel: "Behaltefrist",
      bloecke: [
        {
          typ: "p",
          text: "**Scheidet die Anlage innerhalb von vier Jahren (von Tag zu Tag gerechnet) aus dem Betriebsvermögen aus, wird der IFB im Jahr des Ausscheidens nachversteuert.** Das gilt auch bei dauerhafter Verbringung ins Ausland. Keine Nachversteuerung gibt es bei Ausscheiden durch höhere Gewalt oder behördlichen Eingriff – laut USP zählt dazu jedes Ausscheiden gegen den Willen des Unternehmers, etwa Zerstörung durch Hagel oder Brand. Bei einer Betriebsübertragung übernimmt der Rechtsnachfolger die Nachversteuerungspflicht.",
        },
        {
          typ: "checkliste",
          punkte: [
            "IFB in der Steuererklärung an der vorgesehenen Stelle ausweisen.",
            "Begünstigte Wirtschaftsgüter im Anlageverzeichnis kennzeichnen (Anlage, Speicher, Ladestationen getrennt).",
            "Lieferschein, Abnahmeprotokoll, Prüfprotokoll und Inbetriebnahmenachweis aufbewahren – sie belegen den Zeitpunkt.",
            "Zuschüsse und deren Höhe dokumentieren, weil sie die Bemessungsgrundlage kürzen.",
            "Verkauf, Übertragung oder Übersiedlung der Anlage in den ersten vier Jahren vorab steuerlich prüfen.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Keine Steuerberatung",
          text: "Dieser Ratgeber beschreibt die allgemeine Rechtslage in Österreich (Stand September 2026) und ersetzt keine Steuerberatung. Zeitpunkt, Zurechnung und Aufteilung bei gemischter Nutzung sind Einzelfallfragen – stimmen Sie Ihre Investition vor der Bestellung mit Ihrer Steuerberatung ab.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie hoch ist der Investitionsfreibetrag für eine PV-Anlage 2026?",
      a: "22 % der Anschaffungs- oder Herstellungskosten, soweit diese auf den Zeitraum 1. November 2025 bis 31. Dezember 2026 entfallen. Photovoltaik zählt nach der Öko-IFB-Verordnung zum Bereich Ökologisierung. Ab 1. Jänner 2027 gilt nach derzeitiger Rechtslage wieder der Öko-Satz von 15 %.",
    },
    {
      q: "Bekomme ich den IFB zusätzlich zur Abschreibung?",
      a: "Ja. Der IFB ist eine zusätzliche Betriebsausgabe und kürzt die AfA-Basis nicht. Die Anlage wird weiterhin vollständig über 20 Jahre abgeschrieben, linear oder degressiv mit bis zu 30 % vom Restbuchwert.",
    },
    {
      q: "Gilt der Investitionsfreibetrag auch für Stromspeicher?",
      a: "Ja, stationäre Speicher, die Strom aus erneuerbaren Quellen elektrochemisch speichern, sind laut Öko-IFB-Verordnung begünstigt. Anders als beim EAG-Zuschuss ist das nicht an die gleichzeitige Errichtung einer neuen PV-Anlage gebunden.",
    },
    {
      q: "Bis wann muss die PV-Anlage fertig sein, um 22 % IFB zu erhalten?",
      a: "Bei Anschaffung muss die wirtschaftliche Verfügungsmacht, bei Herstellung die Fertigstellung bis 31. Dezember 2026 vorliegen. Erstreckt sich die Herstellung über den Jahreswechsel, erhalten nur die bis dahin angefallenen und aktivierten Teilbeträge 22 %, der Rest 15 %.",
    },
    {
      q: "Kann ich IFB und EAG-Investitionszuschuss kombinieren?",
      a: "Ja. Der steuerfreie Zuschuss wird aber zuerst von den Anschaffungskosten abgezogen, IFB und AfA berechnen sich vom Restbetrag. Die Kombination bleibt trotzdem deutlich vorteilhafter als der IFB allein.",
    },
    {
      q: "Steht der IFB auch pauschalierten Landwirten zu?",
      a: "Nein, bei pauschaler Gewinnermittlung ist der IFB ausgeschlossen. Anders ist es, wenn die PV-Anlage einen eigenen Gewerbebetrieb mit Einnahmen-Ausgaben-Rechnung bildet – etwa bei Volleinspeisung. Die Zuordnung erklärt der Ratgeber [Photovoltaik & Steuern](/ratgeber/photovoltaik-steuern).",
    },
    {
      q: "Wer bekommt den IFB bei einer geleasten PV-Anlage?",
      a: "Der wirtschaftliche Eigentümer. Beim Operating-Leasing ist das meist die Leasinggesellschaft, bei Vollamortisationsverträgen mit sehr kurzer oder sehr langer Grundmietzeit, günstiger Kaufoption oder Spezialleasing der Leasingnehmer.",
    },
  ],

  passend: [
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile", text: "IFB, AfA und Gewinnfreibetrag im Überblick." },
    { href: "/ratgeber/eag-investitionszuschuss", titel: "EAG-Investitionszuschuss 2026", text: "Fördercall 8.–22. Oktober, Sätze und Ablauf." },
    { href: "/ratgeber/photovoltaik-leasing", titel: "Photovoltaik-Leasing", text: "Raten, Zurechnung und Vergleich mit dem Kauf." },
    { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Planung nach Lastgang, Montage und Netzanmeldung." },
  ],

  quellen: [
    { titel: "USP – Investitionsfreibetrag (inkl. befristeter Erhöhung 2025/2026)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "01/2026" },
    { titel: "WKO – Investitionsfreibetrag, Öko-IFB-Verordnung und Beispiele 2026", url: "https://www.wko.at/steuern/investitionsfreibetrag", stand: "09/2026" },
    { titel: "TPA – Investitionsfreibetrag für Ökologisierung (PV, Speicher, E-Ladestationen)", url: "https://www.tpa-group.at/news/investitionsfreibetrag-oekologisierung/", stand: "09/2026" },
    { titel: "BMF – Photovoltaikerlass, BMF-AV Nr. 106/2025 (PDF)", url: "https://findok.bmf.gv.at/findok/resources/pdf/0bc7d846-26b9-489a-8704-76550de8d199/83743.1.1.pdf", stand: "07/2025" },
    { titel: "USP – Gewinnfreibetrag", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/gewinnfreibetrag.html", stand: "09/2026" },
    { titel: "USP – Abschreibung (degressive AfA)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/abschreibung.html", stand: "01/2026" },
    { titel: "WKO – Ertragsteuerliche Behandlung von Leasing", url: "https://www.wko.at/steuern/ertragsteuer-leasing", stand: "09/2026" },
    { titel: "OeMAG – EAG-Investitionszuschüsseverordnung, Fassung vom 19.01.2026 (PDF)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf", stand: "01/2026" },
  ],

  seitenCta: {
    titel: "22 % IFB noch 2026 nutzen?",
    text: "Wir prüfen, ob Ihr Projekt bis Jahresende realistisch fertig wird.",
    href: "/angebot",
    label: "Projekt anfragen",
  },
  cta: {
    title: "Investieren, solange der Öko-IFB 22 % beträgt.",
    text: "Ökovolt Solartechnik plant, errichtet und meldet Gewerbe- und Landwirtschaftsanlagen in ganz Österreich – mit realistischem Zeitplan bis zur Inbetriebnahme und den Unterlagen, die Ihre Steuerberatung braucht.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Förder-Check starten", href: "/foerdercheck" },
  },
};

export default artikel;
