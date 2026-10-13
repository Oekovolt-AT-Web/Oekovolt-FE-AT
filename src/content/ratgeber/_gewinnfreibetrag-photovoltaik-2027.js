// Ratgeber: Gewinnfreibetrag und Photovoltaik ab 2027 – nur noch Sachinvestitionen
// Rechtsstand 10/2026: § 10 EStG idF Budgetbegleitgesetz 2027–2028 (BGBl. I Nr. 62/2026,
// Inhalt laut BMF-Rechtsnews und Regierungsvorlage), § 11 EStG (IFB), PV-Erlass BMF 30.07.2025.
// Rechenbeispiel: eigene Rechnung mit offengelegten Annahmen, gerundet. Keine Imports.
//
// ENTWURF (12.10.2026, QA C02): Der Unterstrich nimmt die Datei aus src/content/ratgeber/index.js –
// damit ist der Artikel bis zur Freigabe weder erreichbar (dynamicParams=false → 404) noch in
// Sitemap, llms.txt, RSS oder Übersicht. FREIGABE: pruefen:true – vor Veröffentlichung Steuerberatung
// gegenlesen; danach Datei ohne Unterstrich umbenennen, node scripts/ratgeber-index.mjs ausführen,
// OG-Bild public/og/ratgeber/gewinnfreibetrag-photovoltaik-2027.jpg anlegen und den Link auf
// /forderungen/steuerlich (Karte „Gewinnfreibetrag“) wieder setzen. Feld `noindex` bleibt als Merker.

const artikel = {
  slug: "gewinnfreibetrag-photovoltaik-2027",
  title: "Gewinnfreibetrag 2027: Photovoltaik statt Wertpapiere",
  seoTitle: "Gewinnfreibetrag 2027 & Photovoltaik | Ökovolt",
  kurzTitel: "Gewinnfreibetrag 2027",
  description:
    "Gewinnfreibetrag ab 2027 nur noch für Sachinvestitionen: Was das Budgetbegleitgesetz ändert, wie eine PV-Anlage den investitionsbedingten GFB deckt – mit Freiberufler-Beispiel.",
  excerpt:
    "Ab Wirtschaftsjahren, die 2027 beginnen, zählen Wertpapiere nicht mehr für den investitionsbedingten Gewinnfreibetrag. Was das für Freiberufler und Einzelunternehmer heißt – und warum eine PV-Anlage auf dem Betriebsgebäude die Lücke füllen kann.",
  hauptKeyword: "gewinnfreibetrag 2027 photovoltaik",
  keywords: [
    "Gewinnfreibetrag 2027",
    "Gewinnfreibetrag Sachinvestitionen",
    "Gewinnfreibetrag Wertpapiere 2027",
    "investitionsbedingter Gewinnfreibetrag Photovoltaik",
    "Gewinnfreibetrag Freiberufler PV-Anlage",
    "Budgetbegleitgesetz 2027 Gewinnfreibetrag",
    "Gewinnfreibetrag oder Investitionsfreibetrag",
  ],
  veroeffentlicht: "2026-10-11",
  aktualisiert: "2026-10-11",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
  bildAlt: "Luftbild von Gewerbehallen mit Photovoltaikanlagen auf den Dächern",
  badge: { wert: "13 %", text: "investitionsbedingter GFB für Gewinnteile über 33.000 €" },

  // Redaktionsstatus (vom Renderer ignoriert, vom Generator übernommen)
  pruefen: true,
  pruefHinweis: "vor Veröffentlichung Steuerberatung gegenlesen",
  noindex: true,

  kurzFazit: [
    "**Für Wirtschaftsjahre, die nach dem 31.12.2026 und vor dem 01.01.2030 beginnen, steht der investitionsbedingte Gewinnfreibetrag nur noch für Realinvestitionen zu – Wertpapiere scheiden aus** (Budgetbegleitgesetz 2027–2028, BGBl. I Nr. 62/2026; Inhalt laut BMF und Regierungsvorlage, zu prüfen).",
    "**Der Grundfreibetrag von 15 % auf die ersten 33.000 € Gewinn (max. 4.950 €) bleibt ohne Investition.** Darüber braucht es begünstigte Wirtschaftsgüter: 13 % bis 178.000 € Gewinn, insgesamt höchstens 46.400 € je Jahr (§ 10 EStG).",
    "**Eine PV-Anlage auf dem Betriebsgebäude ist eine Sachinvestition mit 20 Jahren Nutzungsdauer und erfüllt damit die Voraussetzungen** – sofern sie dem Betrieb zugeordnet ist und vier Jahre gehalten wird.",
    "**Beispiel Freiberuflerin mit 150.000 € Gewinn: investitionsbedingter GFB 15.210 €; eine PV-Anlage um 22.000 € netto deckt ihn vollständig – Steuerersparnis rund 7.300 € bei 48 % Grenzsteuersatz** (Annahmen offengelegt, keine Steuerberatung).",
    "**Gewinnfreibetrag und Investitionsfreibetrag schließen sich für dasselbe Wirtschaftsgut aus.** Für Einzelunternehmer mit hohem Gewinn ist der GFB ab 2027 oft die stärkere Variante, weil der IFB auf 15 % zurückfällt.",
  ],

  abschnitte: [
    {
      id: "was-aendert-sich",
      titel: "Was ändert sich 2027 beim Gewinnfreibetrag?",
      tocLabel: "Was ändert sich 2027?",
      bloecke: [
        {
          typ: "p",
          text: "**Ab Wirtschaftsjahren, die nach dem 31. Dezember 2026 beginnen, können nur noch Realinvestitionen den investitionsbedingten Gewinnfreibetrag decken – Wertpapiere nach § 14 Abs. 7 Z 4 EStG zählen bis einschließlich 2029 nicht mehr.** So sieht es das Budgetbegleitgesetz 2027–2028 vor, das der Nationalrat im Sommer 2026 beschlossen hat (BGBl. I Nr. 62/2026). Ausgenommen sind Ersatzanschaffungen für Wertpapiere, die bereits für einen früheren Gewinnfreibetrag gewidmet wurden. Für Wirtschaftsjahre, die nach dem 31. Dezember 2029 beginnen, sollen Wertpapiere wieder möglich sein.",
        },
        {
          typ: "p",
          text: "Damit fällt für viele Freiberufler und Einzelunternehmer der bequemste Weg weg: Bisher reichte es, zum Jahresende begünstigte Wertpapiere im Depot zu parken. Ab 2027 muss echtes Anlagevermögen angeschafft werden – Maschinen, Betriebsausstattung, Gebäudeinvestitionen oder eben eine [Photovoltaikanlage](/gewerbe) auf dem Betriebsgebäude. Was im Lexikon unter [Gewinnfreibetrag](/wissen/lexikon#gewinnfreibetrag) kurz erklärt ist, bekommt dadurch ab 2027 eine neue Bedeutung für die Investitionsplanung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Zu prüfen vor Veröffentlichung",
          text: "Die Einschränkung auf Realinvestitionen ist in den BMF-Rechtsnews zum Budgetbegleitgesetz 2027 und 2028 (BGBl. I Nr. 62/2026) als beschlossene Maßnahme angeführt; Zeitraum und Ausnahmen entnehmen wir der Regierungsvorlage (KPMG, Deloitte 06/2026). Den Wortlaut der Kundmachung im RIS vor jeder Entscheidung gegenlesen. Dieser Artikel ist keine Steuerberatung.",
        },
      ],
    },
    {
      id: "so-funktioniert-der-gfb",
      titel: "So funktioniert der Gewinnfreibetrag nach § 10 EStG",
      tocLabel: "So funktioniert der GFB",
      bloecke: [
        {
          typ: "p",
          text: "**Der Gewinnfreibetrag steht natürlichen Personen mit betrieblichen Einkünften zu – also Einzelunternehmern, Freiberuflern und Mitunternehmern, nicht aber Kapitalgesellschaften.** Er besteht aus zwei Teilen: dem Grundfreibetrag, der automatisch zusteht, und dem investitionsbedingten Gewinnfreibetrag, der nur in Höhe der Anschaffungskosten begünstigter Wirtschaftsgüter wirkt.",
        },
        {
          typ: "tabelle",
          caption: "Gewinnfreibetrag nach Gewinnstufen (§ 10 EStG, Rechtsstand 10/2026)",
          kopf: ["Gewinnanteil", "Satz", "Investition nötig?"],
          zeilen: [
            ["bis 33.000 €", "15 % (Grundfreibetrag, max. 4.950 €)", "nein"],
            ["33.000 € bis 178.000 €", "13 %", "ja – begünstigte Wirtschaftsgüter"],
            ["178.000 € bis 353.000 €", "7 %", "ja"],
            ["353.000 € bis 583.000 €", "4,5 %", "ja"],
            ["Summe je Veranlagungsjahr", "max. 46.400 €", ""],
          ],
          hervorheben: 1,
          markierteZeile: 1,
          minBreite: 520,
          fussnote: "Quelle: § 10 EStG, USP.gv.at (Stand 10/2026). Bei Pauschalierung (z. B. Basispauschalierung) steht nur der Grundfreibetrag zu. Keine Steuerberatung.",
        },
        {
          typ: "h3",
          text: "Welche Wirtschaftsgüter sind ab 2027 begünstigt?",
        },
        {
          typ: "checkliste",
          punkte: [
            "abnutzbare körperliche Wirtschaftsgüter des Anlagevermögens mit mindestens vier Jahren Nutzungsdauer – neu, nicht gebraucht",
            "Zuordnung zu einem inländischen Betrieb oder einer inländischen Betriebsstätte",
            "Behaltefrist vier Jahre; vorzeitiges Ausscheiden führt zur Nachversteuerung",
            "PV-Anlage, Stromspeicher und Ladestation erfüllen das, wenn sie zum Betriebsvermögen gehören",
          ],
        },
        {
          typ: "liste",
          punkte: [
            "**Nicht begünstigt:** Pkw und Kombi (außer Fahrschulfahrzeuge und Taxis), geringwertige Wirtschaftsgüter, die sofort abgesetzt werden, gebrauchte Anlagen, Wirtschaftsgüter mit Forschungsprämie",
            "**Nicht mehr begünstigt 2027–2029:** Wertpapiere nach § 14 Abs. 7 Z 4 EStG (Ausnahme: Ersatzanschaffung für bereits gewidmete Wertpapiere)",
            "**Nicht gleichzeitig:** Für ein Wirtschaftsgut, für das der [Investitionsfreibetrag](/wissen/lexikon#ifb) geltend gemacht wird, steht kein investitionsbedingter Gewinnfreibetrag zu – und umgekehrt",
          ],
        },
      ],
    },
    {
      id: "pv-als-sachinvestition",
      titel: "Warum eine PV-Anlage den investitionsbedingten GFB decken kann",
      tocLabel: "PV als Sachinvestition",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Photovoltaikanlage ist ein abnutzbares körperliches Wirtschaftsgut mit 20 Jahren Nutzungsdauer – sie erfüllt die Voraussetzungen des investitionsbedingten Gewinnfreibetrags, sobald sie dem Betrieb zugeordnet ist.** Das ist bei einer Anlage auf dem Praxis-, Kanzlei- oder Werkstattgebäude der Regelfall, wenn der Strom überwiegend im Betrieb verbraucht wird. Wird dagegen mehr Strom eingespeist als betrieblich genutzt, kann nach dem PV-Erlass des BMF ein eigener Gewerbebetrieb vorliegen – die Zuordnung sollte vorab mit der Steuerberatung geklärt werden.",
        },
        {
          typ: "p",
          text: "Der Charme liegt in der Kombination: Die Anlage senkt laufend die Stromkosten, der Eigenverbrauch ist von der [Elektrizitätsabgabe](/forderungen/steuerlich#elektrizitaetsabgabe) befreit, die Anschaffung wird über 20 Jahre abgeschrieben – und zusätzlich mindert der Gewinnfreibetrag im Jahr der Anschaffung den steuerpflichtigen Gewinn. Was der Zuschuss des Bundes dazu beiträgt, steht im Ratgeber zum [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss); ein steuerfreier Zuschuss kürzt allerdings die Anschaffungskosten und damit die Bemessungsgrundlage.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Betriebsgebäude", text: "PV auf Praxis, Kanzlei, Werkstatt oder Halle: Anlage im Betriebsvermögen, Strom überwiegend für den Betrieb – der klare Fall für den GFB." },
            { titel: "Gemischt genutztes Gebäude", text: "Wohnen und Betrieb unter einem Dach: Zuordnung nach dem betrieblichen Anteil, Eigenverbrauch und Einspeisung sauber aufzeichnen – vorher abstimmen." },
            { titel: "Volleinspeisung", text: "Wer alles einspeist, betreibt nach dem PV-Erlass einen eigenen Gewerbebetrieb. Dort steht der GFB ebenfalls zu, aber mit eigener Gewinnermittlung." },
          ],
        },
      ],
    },
    {
      id: "beispiel-freiberuflerin",
      titel: "Rechenbeispiel: Freiberuflerin mit 150.000 € Gewinn",
      tocLabel: "Beispiel Freiberuflerin",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Ärztin mit eigener Ordination erzielt 2027 einen Gewinn von 150.000 € (Einnahmen-Ausgaben-Rechnung, keine Pauschalierung). Ihr investitionsbedingter Gewinnfreibetrag beträgt 13 % von 117.000 € = 15.210 €. Um ihn auszuschöpfen, braucht sie 2027 Sachinvestitionen von mindestens 15.210 € – Wertpapiere zählen nicht mehr.**",
        },
        {
          typ: "tabelle",
          caption: "Gewinnfreibetrag 2027 mit und ohne PV-Anlage (Beispiel, gerundet)",
          kopf: ["Position", "ohne Investition", "mit PV-Anlage 15 kWp"],
          zeilen: [
            ["Gewinn vor Freibetrag", "150.000 €", "150.000 €"],
            ["Grundfreibetrag 15 % von 33.000 €", "4.950 €", "4.950 €"],
            ["Investitionsbedingter GFB 13 % von 117.000 €", "0 € (keine Sachinvestition)", "15.210 €"],
            ["Anschaffungskosten PV (Richtwert, netto)", "–", "22.000 €"],
            ["davon für den GFB gewidmet", "–", "15.210 €"],
            ["Gewinnminderung durch GFB gesamt", "4.950 €", "20.160 €"],
            ["Steuerersparnis bei 48 % Grenzsteuersatz", "2.376 €", "9.677 €"],
            ["Mehrersparnis durch die PV-Anlage", "", "rund 7.300 €"],
          ],
          hervorheben: 2,
          markierteZeile: 7,
          minBreite: 600,
          fussnote:
            "Annahmen: Gewinn 150.000 €, Grenzsteuersatz 48 % (Einkommensteuertarif 2027 in dieser Stufe, ohne Sozialversicherung und Sonderausgaben), PV-Anlage 15 kWp um 22.000 € netto als Marktrichtwert (kein Ökovolt-Preis), ohne EAG-Zuschuss. Zusätzlich wirken AfA (5 % jährlich) und Stromkostenersparnis. Rechenbeispiel zur Veranschaulichung, keine Steuerberatung.",
        },
        {
          typ: "p",
          text: "Der Rest der Anschaffungskosten (6.790 €) geht nicht verloren: Er wird wie die gesamte Anlage über 20 Jahre abgeschrieben. Die Ersparnis von rund 7.300 € kommt also zusätzlich zur Abschreibung und zur Stromkostenersparnis – ein Teil der Anlage finanziert sich im ersten Jahr über die Steuer. Wie sich die Anlage insgesamt rechnet, zeigt der Ratgeber [Photovoltaik-Amortisation](/ratgeber/photovoltaik-amortisation).",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "GFB oder IFB – nicht beides",
          text: "Für dieselbe Anlage steht entweder der investitionsbedingte Gewinnfreibetrag oder der Investitionsfreibetrag zu. 2027 beträgt der Öko-IFB 15 % der Anschaffungskosten (22.000 € × 15 % = 3.300 € Betriebsausgabe, rund 1.600 € Steuer bei 48 %). Der GFB deckt im Beispiel 15.210 € – also die deutlich stärkere Variante. Bis 31.12.2026 liegt der IFB noch bei 22 %; wer heuer anschafft, rechnet beide Wege durch.",
        },
      ],
    },
    {
      id: "gfb-oder-ifb",
      titel: "Gewinnfreibetrag oder Investitionsfreibetrag: Was passt wann?",
      tocLabel: "GFB oder IFB?",
      bloecke: [
        {
          typ: "p",
          text: "**Faustregel ab 2027: Je höher der Gewinn im Verhältnis zur Investition, desto eher lohnt der Gewinnfreibetrag; je größer die Anlage im Verhältnis zum Gewinn, desto eher der Investitionsfreibetrag.** Der GFB ist durch die Gewinnstufen begrenzt (13 % über 33.000 €, maximal 46.400 €), der IFB durch die Anschaffungskosten (15 % bis 1 Mio. €).",
        },
        {
          typ: "tabelle",
          caption: "Gewinnfreibetrag und Investitionsfreibetrag im Vergleich (Rechtsstand 10/2026, ab 2027)",
          kopf: ["Merkmal", "Investitionsbedingter GFB", "Öko-IFB"],
          zeilen: [
            ["Wer", "natürliche Personen mit betrieblichen Einkünften", "alle Betriebe inkl. GmbH"],
            ["Höhe 2027", "13 % / 7 % / 4,5 % des Gewinns über 33.000 €, max. 46.400 €", "15 % der Anschaffungskosten (bis 1 Mio. € je Jahr)"],
            ["Begrenzt durch", "Gewinn", "Investitionssumme"],
            ["Begünstigte Güter ab 2027", "nur Sachinvestitionen (Wertpapiere bis 2029 ausgeschlossen)", "Öko-Wirtschaftsgüter laut Öko-IFB-VO, u. a. PV, Speicher, Ladestation"],
            ["Behaltefrist", "4 Jahre", "4 Jahre"],
            ["Pauschalierung", "nur Grundfreibetrag", "kein IFB"],
            ["Kombination", "nicht für dasselbe Wirtschaftsgut", "nicht für dasselbe Wirtschaftsgut"],
          ],
          minBreite: 640,
          fussnote: "Quellen: § 10 und § 11 EStG, USP.gv.at, BMF-Rechtsnews Budgetbegleitgesetz 2027/2028. Keine Steuerberatung.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Gewinnprognose 2027", "Voraussichtlichen Gewinn und damit den maximalen investitionsbedingten GFB ermitteln (13 % des Gewinns über 33.000 €)."],
            ["Investition dimensionieren", "PV-Anlage nach Strombedarf planen – nicht nach dem Freibetrag. Der [PV-Größenrechner](/ratgeber/pv-anlage-groesse-berechnen) hilft bei der Einordnung."],
            ["GFB und IFB vergleichen", "Beide Varianten mit der Steuerberatung durchrechnen; bei Anschaffung noch 2026 den 22-%-IFB einbeziehen."],
            ["Anschaffung im richtigen Wirtschaftsjahr", "Maßgeblich ist die Übergabe bzw. Fertigstellung, nicht die Bestellung – Bauzeit und Netzanmeldung einplanen."],
            ["Dokumentation", "Anlagenverzeichnis, Zuordnung zum Betrieb, Aufzeichnung von Eigenverbrauch und Einspeisung, Anzeige der Elektrizitätsabgaben-Befreiung beim Finanzamt."],
          ],
        },
      ],
    },
    {
      id: "fehler-vermeiden",
      titel: "Typische Fehler beim Gewinnfreibetrag mit PV",
      tocLabel: "Fehler vermeiden",
      bloecke: [
        {
          typ: "liste",
          punkte: [
            "**Anlage im Privatvermögen:** PV auf dem Wohnhaus ohne betriebliche Nutzung zählt nicht – der GFB setzt Betriebsvermögen voraus.",
            "**Zu spät geliefert:** Bestellt im Dezember, montiert im Februar – der GFB fällt ins Folgejahr. Bei Teilherstellung zählen nur die im Jahr angefallenen Herstellungskosten.",
            "**Doppelt beansprucht:** IFB und investitionsbedingter GFB für dieselbe Anlage sind ausgeschlossen; die Wahl ist je Wirtschaftsgut zu treffen.",
            "**Zuschuss vergessen:** Ein steuerfreier EAG-Zuschuss kürzt die Anschaffungskosten und damit die GFB-Basis.",
            "**Behaltefrist verletzt:** Verkauf, Betriebsaufgabe oder Verbringung ins Ausland innerhalb von vier Jahren löst die Nachversteuerung aus.",
            "**Pauschalierung übersehen:** Bei Basispauschalierung oder Branchenpauschalierung steht nur der Grundfreibetrag zu.",
          ],
        },
        {
          typ: "tool",
          href: "/forderungen/steuerlich#ifb-rechner",
          titel: "IFB-Rechner und Steuerüberblick",
          text: "Investitionsfreibetrag, Abschreibung und Steuerwirkung im ersten Jahr – mit dem Vergleich 2026 zu 2027.",
          label: "Zum Steuerüberblick",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Gilt die Einschränkung auf Sachinvestitionen schon für 2026?",
      a: "Nein. Sie betrifft Wirtschaftsjahre, die nach dem 31.12.2026 beginnen – bei Kalenderjahr-Betrieben also erstmals 2027. Für 2026 können Wertpapiere nach § 14 Abs. 7 Z 4 EStG noch für den investitionsbedingten Gewinnfreibetrag gewidmet werden. Die Regelung beruht auf dem Budgetbegleitgesetz 2027–2028 (BGBl. I Nr. 62/2026) – Wortlaut im RIS prüfen.",
    },
    {
      q: "Können auch GmbHs den Gewinnfreibetrag nutzen?",
      a: "Nein. Der Gewinnfreibetrag steht nur natürlichen Personen mit betrieblichen Einkünften zu – Einzelunternehmern, Freiberuflern und Mitunternehmern. Kapitalgesellschaften nutzen stattdessen den [Investitionsfreibetrag](/forderungen/steuerlich), 2027 mit 15 % für PV, Speicher und Ladestationen.",
    },
    {
      q: "Zählt ein Stromspeicher oder eine Wallbox für den Gewinnfreibetrag?",
      a: "Ja, als abnutzbare körperliche Wirtschaftsgüter mit mindestens vier Jahren Nutzungsdauer – sofern sie dem Betrieb zugeordnet sind. Speicher und Ladestation gehören auch zu den Öko-Wirtschaftsgütern des IFB; für jedes Wirtschaftsgut ist eines von beiden zu wählen.",
    },
    {
      q: "Was passiert, wenn die Anlage erst im Jänner fertig wird?",
      a: "Dann fällt die Anschaffung ins neue Wirtschaftsjahr, und der Gewinnfreibetrag wirkt erst dort. Maßgeblich ist die Übergabe bzw. Fertigstellung (Erlangen der wirtschaftlichen Verfügungsmacht), nicht die Bestellung. Bei Teilherstellung über den Jahreswechsel zählen die bis zum Bilanzstichtag angefallenen Herstellungskosten.",
    },
    {
      q: "Wie wirkt sich der EAG-Investitionszuschuss aus?",
      a: "Steuerfreie Zuschüsse aus öffentlichen Mitteln kürzen die Anschaffungskosten. Für den Gewinnfreibetrag zählt nur der verbleibende Betrag – ebenso für die Abschreibung. Ob ein Zuschuss beantragt wird, ist trotzdem fast immer sinnvoll; den Zuschuss berechnet der [EAG-Rechner](/forderungen/bundesfoerderung#rechner).",
    },
    {
      q: "Ist der Gewinnfreibetrag ein dauerhafter Vorteil oder nur eine Stundung?",
      a: "Ein dauerhafter Vorteil: Der Gewinnfreibetrag mindert den Gewinn zusätzlich zur vollen Abschreibung der Anlage. Anders als bei der degressiven AfA wird nichts später nachgeholt – vorausgesetzt, die Behaltefrist von vier Jahren wird eingehalten.",
    },
  ],

  passend: [
    { href: "/ratgeber/investitionsfreibetrag-photovoltaik", titel: "Investitionsfreibetrag für Photovoltaik", text: "22 % bis Ende 2026, danach 15 % – Voraussetzungen und Rechenbeispiele." },
    { href: "/ratgeber/photovoltaik-steuern", titel: "Photovoltaik und Steuern", text: "USt, Einkommensteuer, Elektrizitätsabgabe und Landwirtschaft im Überblick." },
    { href: "/forderungen/steuerlich", titel: "Steuerliche Vorteile 2026 und Ausblick 2027", text: "IFB-Rechner, Elektrizitätsabgabe-Rechner und was sich 2027 ändert." },
    { href: "/ratgeber/eag-investitionszuschuss", titel: "EAG-Investitionszuschuss", text: "Fördercalls, Sätze und der Einfluss auf die steuerliche Bemessungsgrundlage." },
  ],

  quellen: [
    { titel: "BMF – Budgetbegleitgesetz 2027 und 2028, Teil Steuern (BGBl. I Nr. 62/2026)", url: "https://www.bmf.gv.at/rechtsnews/steuern-rechtsnews/neue-gesetze/2026/budgetbegleitgesetz-2027-und-2028-teil-steuern.html", stand: "10/2026" },
    { titel: "KPMG Austria – Steuerliche Maßnahmen Doppelbudget 2027/2028 (Regierungsvorlage)", url: "https://kpmg.com/at/de/media/newsletter/tax-news/2026/06/tf-steuerliche-massnahmen-doppelbudget-2027-2028.html", stand: "06/2026" },
    { titel: "Deloitte Österreich – Breaking News Budgetbegleitgesetz 2027–2028", url: "https://www.deloitte.com/at/de/services/tax/blogs/2026/breaking-news-budgetbegleitgesetz-2027-2028.html", stand: "06/2026" },
    { titel: "USP – Gewinnfreibetrag (§ 10 EStG)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/gewinnfreibetrag.html", stand: "10/2026" },
    { titel: "USP – Investitionsfreibetrag (§ 11 EStG)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "10/2026" },
    { titel: "BMF – Photovoltaik-Erlass vom 30.07.2025", url: "https://findok.bmf.gv.at/findok/iwg/83/83743/83743.1.pdf", stand: "07/2025" },
    { titel: "RIS – Einkommensteuergesetz 1988, § 10 Gewinnfreibetrag", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10004570", stand: "10/2026" },
  ],

  seitenCta: { titel: "Anlage für 2027 planen", text: "Größe nach Strombedarf, Fertigstellung im richtigen Wirtschaftsjahr – wir liefern die Unterlagen für Ihre Steuerberatung.", href: "/angebot", label: "Projekt anfragen" },
  cta: {
    title: "Sachinvestition mit Rendite: PV auf dem Betriebsgebäude",
    text: "Wir planen Anlage, Netzanmeldung und Bauzeit so, dass Übergabe und Gewinnfreibetrag ins richtige Jahr fallen – und rechnen Förderung und Steuerwirkung transparent vor.",
    primary: { label: "Projekt anfragen", href: "/angebot" },
    secondary: { label: "Steuerliche Vorteile ansehen", href: "/forderungen/steuerlich" },
  },
};

export default artikel;
