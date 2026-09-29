// Ratgeber: Agri-PV in Österreich – Konzepte, Kulturen, Förderung, Raumordnung
// Rechtsstand 28.09.2026: EABG § 5 Z 1 (BGBl. I Nr. 47/2026), EAG § 56 Abs. 8/10,
// EAG-IZ-VO Strom §§ 5, 6 und 9 (Fassung 2026), K-PhV 2024, Sbg. PV-Kennzeichnungsverordnung,
// Stmk. Sachprogramm Solarenergie und StROG § 33. Forschung: Fraunhofer ISE / APV-RESOLA, Laub et al. 2022.

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

// Beispiel Investitionszuschuss 500 kWp, Kategorie D, Gebot 110 €/kWp (Höchstsatz 2026: 120 €/kWp)
const KWP = 500;
const GEBOT = 110;
const BASIS = KWP * GEBOT;

const artikel = {
  slug: "agri-pv-oesterreich",
  title: "Agri-PV in Österreich: Konzepte, Kulturen, Förderung und Recht",
  seoTitle: "Agri-PV Österreich: Förderung, Kulturen | Ökovolt",
  kurzTitel: "Agri-PV in Österreich",
  description:
    "Agri-PV in Österreich: vertikale, hoch aufgeständerte und Weide-Systeme, geeignete Kulturen, 75-%-Regel, EAG-Zuschlag von 30 % und Raumordnung der Länder.",
  excerpt:
    "Strom und Ernte auf derselben Fläche: Welche Agri-PV-Konzepte es gibt, welche Kulturen profitieren, wie die 75-%-Regel funktioniert und warum innovative Agri-PV 30 % mehr Investitionszuschuss bekommt.",
  hauptKeyword: "agri pv österreich",
  keywords: [
    "Agri-PV Österreich",
    "Agri-Photovoltaik Förderung",
    "Agri-PV Investitionszuschuss Zuschlag",
    "vertikale Agri-PV bifazial",
    "Agri-PV Obstbau Hagelschutz",
    "Agri-PV Schafe Weide",
    "Agri-PV Raumordnung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/agri-pv-oesterreich.jpg",
  bildAlt: "Hoch aufgeständerte Agri-PV-Forschungsanlage über einem Acker am Hofgut Heggelbach in Süddeutschland",
  badge: { wert: "+30 %", text: "EAG-Zuschlag für vertikale oder hohe Agri-PV" },

  kurzFazit: [
    "**Agri-PV ist in Österreich rechtlich klar definiert: Landwirtschaft bleibt Hauptnutzung, mindestens 75 % der Fläche werden weiter bewirtschaftet, die Module sind gleichmäßig verteilt** – so steht es im EABG und in der EAG-Investitionszuschüsseverordnung.",
    "Wer diese Kriterien erfüllt, entgeht dem **25-%-Abschlag** für Freiflächen. **Vertikale Agri-PV und Anlagen mit mindestens 2 m hoher Modulunterkante** gelten als innovativ und erhalten **30 % Zuschlag** auf den Investitionszuschuss.",
    "Unterkonstruktion und Anlageninfrastruktur dürfen höchstens **7 % der Gesamtfläche** beanspruchen; verlangt wird ein landwirtschaftliches Nutzungskonzept für **zehn Jahre** nach Inbetriebnahme.",
    "Am besten passen **Beeren, Kern- und Steinobst, Blattgemüse und Grünland**; Mais und Körnerleguminosen reagieren empfindlich auf Schatten. In trockenen Jahren kann Agri-PV Erträge sogar stabilisieren.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist Agri-PV – und was verlangt das österreichische Recht?",
      tocLabel: "Definition & Recht",
      bloecke: [
        {
          typ: "p",
          text: "**[Agri-PV](/wissen/lexikon#agri-pv) bezeichnet Photovoltaikanlagen auf landwirtschaftlichen Flächen, bei denen die Lebensmittel- oder Futterproduktion die Hauptnutzung bleibt und Strom als Zweitnutzung hinzukommt.** Das unterscheidet sie von einer klassischen Freiflächenanlage, bei der die Stromerzeugung im Vordergrund steht und darunter allenfalls gemäht oder beweidet wird.",
        },
        {
          typ: "p",
          text: "Österreich hat die Anforderungen seit 2024 schrittweise konkretisiert. Das Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG, BGBl. I Nr. 47/2026) definiert „Agri-Solarenergieanlagen“ über drei Kriterien, die fast wortgleich in der EAG-Investitionszuschüsseverordnung-Strom stehen:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Landwirtschaftliche Hauptnutzung:** Pflanzliche oder tierische Produktion auf derselben Fläche, Strom als Sekundärnutzung.",
            "**Gleichmäßige Verteilung der Module** über die Projektfläche – Ausnahmen nur zum Erhalt bestehender Biotopstrukturen.",
            "**Mindestens 75 % der Fläche** werden für die landwirtschaftliche Produktion genutzt.",
          ],
        },
        {
          typ: "p",
          text: "Für den Investitionszuschuss kommen weitere Vorgaben hinzu: Unterkonstruktion und Anlageninfrastruktur dürfen höchstens 7 % der Gesamtfläche beanspruchen, die restliche nicht bewirtschaftete Fläche ist für Biodiversität zu nutzen, geschottert wird nur mit Schotterrasen. Dem Förderantrag liegt ein landwirtschaftliches Nutzungskonzept bei, das die Bewirtschaftung für die ersten zehn Jahre beschreibt – samt Bearbeitbarkeit mit Maschinen, Wasserverteilung unter den Modulen und Schutz vor Erosion an Tropfkanten.",
        },
      ],
    },
    {
      id: "konzepte",
      titel: "Agri-PV-Konzepte im Vergleich",
      tocLabel: "Konzepte",
      bloecke: [
        {
          typ: "p",
          text: "**Es gibt nicht die eine Agri-PV-Anlage – die Bauform richtet sich nach Kultur, Maschinen und Bewirtschaftung.** In Österreich haben sich vier Grundtypen etabliert.",
        },
        {
          typ: "tabelle",
          caption: "Agri-PV-Grundtypen: Aufbau, Eignung und Förderstatus, Stand 09/2026",
          kopf: ["Konzept", "Aufbau", "Geeignet für", "EAG-Status"],
          zeilen: [
            ["Vertikal, bifazial (Ost-West)", "senkrechte Modulreihen, Reihenabstand meist 8–12 m, Bewirtschaftung dazwischen", "Ackerbau, Grünland, Mahd; Windschutz auf exponierten Flächen", "innovativ: +30 % Zuschlag"],
            ["Hoch aufgeständert (≥ 2 m)", "Modultische als Überdachung, Maschinen fahren darunter", "Obst, Beeren, Wein, Gemüse; Hagel- und Sonnenschutz", "innovativ: +30 % Zuschlag"],
            ["Bodennah geneigt mit Tierhaltung", "klassische Tische, Unterkante typ. 0,8–1,2 m", "Schafweide, Geflügelauslauf", "kein Abschlag, wenn 75-%-Regel erfüllt"],
            ["Nachgeführt (Tracker)", "einachsige Nachführung, Module lassen sich für Pflanzen „öffnen“", "Ackerbau und Sonderkulturen", "abhängig von Höhe und Nutzung"],
          ],
          minBreite: 700,
          fussnote: "Einordnung nach § 6 EAG-IZ-VO Strom: innovative Agri-PV = Anlagen, die die Agri-PV-Kriterien erfüllen und vertikal montiert sind oder eine Modultischunterkante von mindestens 2 m über ebenem Boden haben.",
        },
        {
          typ: "p",
          text: "Vertikale Systeme mit [bifazialen Modulen](/wissen/lexikon#bifazial) erzeugen morgens und nachmittags am meisten Strom – ein Profil, das die Mittagsspitze entlastet und oft höhere Marktpreise erzielt. Die Ertragscharakteristik ähnelt einer Ost-West-Dachanlage, wie sie der Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west) beschreibt. Hoch aufgeständerte Anlagen sind teurer im Stahlbau, bieten aber im Obstbau einen Zusatznutzen: Sie ersetzen oder ergänzen Hagelnetze und schützen vor Sonnenbrand und Starkregen – ein Thema, das auch im Ratgeber [Hagel und Photovoltaik](/ratgeber/hagel-photovoltaik) eine Rolle spielt.",
        },
      ],
    },
    {
      id: "kulturen",
      titel: "Welche Kulturen passen zu Agri-PV?",
      tocLabel: "Kulturen",
      bloecke: [
        {
          typ: "p",
          text: "**Am besten eignen sich schattentolerante Kulturen: Beeren, Kern- und Steinobst, Blattgemüse, Kräuter sowie Grünland.** Eine Metaanalyse von Laub et al. (2022) zeigt, dass die meisten Kulturpflanzen eine Verringerung der Einstrahlung um bis zu 15 % tolerieren; Beeren, Obst und Gemüse profitieren teils sogar von bis zu 30 % Beschattung. Mais und Körnerleguminosen reagieren dagegen mit deutlichen Ertragseinbußen.",
        },
        {
          typ: "tabelle",
          caption: "Eignung ausgewählter Kulturen für Agri-PV (Richtwerte aus Forschung und Praxis)",
          kopf: ["Kultur", "Eignung", "Begründung"],
          zeilen: [
            ["Beeren (Himbeere, Heidelbeere)", "sehr gut", "schattentolerant, Schutz vor Hagel, Starkregen und Sonnenbrand"],
            ["Kern- und Steinobst (Apfel, Kirsche, Marille)", "sehr gut", "Überdachung ersetzt Hagelnetz, weniger Sonnenbrand; in Kärnten ohne eigene Widmung zulässig"],
            ["Wein", "gut", "Hitzeschutz, späterer Reifebeginn; Maschinenbreiten beachten"],
            ["Blattgemüse, Kräuter", "gut", "profitieren von moderater Beschattung und geringerer Verdunstung"],
            ["Grünland, Futterbau, Beweidung", "gut", "Mahd zwischen vertikalen Reihen; Schafe und Geflügel unter Modultischen"],
            ["Winterweizen, Kartoffel", "bedingt", "in Trockenjahren teils Mehrertrag, in nassen Jahren bis zu 20 % Minderertrag"],
            ["Mais, Körnerleguminosen (Soja)", "schwierig", "hoher Lichtbedarf, deutliche Einbußen bei Beschattung"],
          ],
          fussnote: "Quellen: Laub et al., Agronomy for Sustainable Development 42 (2022); Ergebnisse der Forschungsanlage Heggelbach (Fraunhofer ISE, APV-RESOLA). Standortbedingungen, Sorte und Anlagendesign verändern die Ergebnisse erheblich.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Landnutzungseffizienz: 1 + 1 > 1",
          text: "Die Forschungsanlage Heggelbach am Bodensee (194 kWp, hoch aufgeständert) erreichte in den Jahren 2017 und 2018 eine um bis zu 86 % höhere Landnutzungseffizienz als die getrennte Nutzung derselben Fläche für Ackerbau oder Solarstrom. Im Hitzejahr 2018 lagen Winterweizen, Kartoffeln und Sellerie unter den Modulen sogar über der Referenzfläche. In Österreich ziehen die Versuchsflächen „Sonnenfeld“ in Bruck an der Leitha und das „Öko-Solar-Biotop“ in Pöchlarn laut PV Austria ebenfalls eine positive Bilanz.",
        },
        {
          typ: "p",
          text: "Mit dem Klimawandel gewinnt dieser Effekt an Bedeutung: Die Österreichische Hagelversicherung beziffert allein die Dürreschäden in der Landwirtschaft 2026 mit rund 1 Milliarde Euro. Teilbeschattung senkt Verdunstung und Hitzestress – für Grünland und Sonderkulturen kann Agri-PV damit zur Klimaanpassung beitragen. Für Betriebe mit eigener Produktion lohnt zusätzlich der Blick auf den Strombedarf von Stall, Kühlung und Trocknung; Lösungen dafür zeigt die Seite [Photovoltaik für die Landwirtschaft](/landwirtschaft).",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung: Kein Abschlag, 30 % Zuschlag",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Agri-PV ist die einzige Form der Freiflächen-PV auf landwirtschaftlichem Grund, die ohne Förderabschlag auskommt – und in innovativer Bauform sogar einen Zuschlag erhält.** Für normale Freiflächenanlagen auf landwirtschaftlich genutzten Flächen oder im Grünland sinkt der EAG-Investitionszuschuss um 25 % (§ 56 Abs. 8 EAG). Erfüllt die Anlage die Agri-PV-Kriterien, entfällt dieser Abschlag. Vertikale Anlagen oder Anlagen mit mindestens 2 m hoher Modulunterkante gelten zusätzlich als innovative Photovoltaik mit 30 % Zuschlag.",
        },
        {
          typ: "tabelle",
          caption: `Beispiel: Investitionszuschuss für ${KWP} kWp (Kategorie D), Gebot ${GEBOT} €/kWp, Stand 09/2026`,
          kopf: ["Anlagentyp", "Regel", "Zuschuss (Beispiel)"],
          zeilen: [
            ["Freiflächenanlage auf Acker oder Grünland", "−25 % Abschlag", eur(BASIS * 0.75)],
            ["Agri-PV bodennah (75-%-Regel erfüllt)", "kein Abschlag", eur(BASIS)],
            ["Innovative Agri-PV (vertikal oder ≥ 2 m)", "+30 % Zuschlag", eur(BASIS * 1.3)],
            ["Innovative Agri-PV mit europäischen Modulen und Wechselrichtern", "+30 %, danach bis +20 %", eur(BASIS * 1.3 * 1.2)],
          ],
          markierteZeile: 2,
          hervorheben: 2,
          fussnote: "Modellrechnung nach §§ 5 und 6 EAG-IZ-VO Strom (Fassung ab 17.01.2026): Kategorie D (über 100 bis 1.000 kWp) mit Höchstsatz 120 €/kWp; Förderhöhe ergibt sich aus dem eigenen Gebot, gereiht nach dem niedrigsten Förderbedarf. Deckel: höchstens 30 % der Investitionskosten. Der Zuschlag für europäische Wertschöpfung beträgt je 10 % für Module und Wechselrichter und wird nach dem Agri-PV-Zuschlag angewendet. Ob und wann ein Förderantrag zum Zug kommt, hängt vom jeweiligen Fördercall ab.",
        },
        {
          typ: "p",
          text: "Anlagen über 1 MWp werden nicht über den Investitionszuschuss, sondern über die Marktprämie gefördert; auch dort sieht § 33 EAG den 25-%-Abschlag für Grünland vor, der für Agri-PV entfällt. Wie Fördercalls ablaufen, erklärt der Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss). Offen bleibt für viele Betriebe die Frage der Agrarförderung: Ob eine Agri-PV-Fläche weiter für Direktzahlungen und ÖPUL beihilfefähig ist, entscheidet die AMA nach den GAP-Regeln – klären Sie das vor der Planung mit Ihrer Bezirksbauernkammer.",
        },
      ],
    },
    {
      id: "raumordnung",
      titel: "Raumordnung: Wie die Länder Agri-PV behandeln",
      tocLabel: "Raumordnung",
      bloecke: [
        {
          typ: "p",
          text: "**Auch Agri-PV braucht in den meisten Bundesländern eine Widmung – mehrere Länder behandeln sie aber bevorzugt.** Die allgemeinen Regeln für Freiflächen erklärt der Ratgeber [Freiflächen-PV: Widmung](/ratgeber/freiflaechen-photovoltaik-widmung); für Agri-PV gelten folgende Besonderheiten:",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Steiermark", text: "Agri-PV über 0,5 ha bewirtschafteter Fläche ist als Sondernutzung im Freiland festzulegen. Anders als klassische Freiflächen ist sie auch in landwirtschaftlichen Vorrangzonen zulässig und über 10 ha nicht an die 36 PV-Vorrangzonen gebunden." },
            { titel: "Kärnten", text: "Agri-PV, die Intensivobstbau, Geflügelhaltung oder Fischzucht schützt, braucht keine eigene Widmung. Agri-PV auf Weiden mit mindestens 1,5 Großvieheinheiten je Hektar an 120 Tagen benötigt die Widmung „Grünland – Agri-Photovoltaikanlage“; alle fünf Jahre ist ein Nachweis vorzulegen." },
            { titel: "Salzburg", text: "Die Photovoltaik-Kennzeichnungsverordnung definiert Agri-PV mit mindestens 80 cm Modulunterkante und 75 % landwirtschaftlicher Nutzung. Agri-PV bringt im Punkteschema 5, innovative Agri-PV (vertikal oder ab 2 m) 10 Punkte." },
            { titel: "Niederösterreich und Burgenland", text: "Hier gelten die allgemeinen Freiflächenregeln (Widmung ab 50 kW bzw. Eignungszonen). Agri-PV verbessert die Chancen im Widmungsverfahren, ersetzt aber keine Zone." },
          ],
        },
      ],
    },
    {
      id: "modelle",
      titel: "Eigenbetrieb, Verpachtung oder Beteiligung?",
      tocLabel: "Betreibermodelle",
      bloecke: [
        {
          typ: "p",
          text: "**Landwirtinnen und Landwirte haben bei Agri-PV drei Wege: selbst investieren, die Fläche an einen Betreiber verpachten oder sich an einem gemeinsamen Projekt beteiligen.** Welcher Weg passt, hängt von Eigenkapital, Risikobereitschaft, Stromverbrauch am Hof und Netzanschluss ab.",
        },
        {
          typ: "tabelle",
          caption: "Betreibermodelle für Agri-PV im Vergleich",
          kopf: ["Modell", "Vorteile", "Nachteile"],
          zeilen: [
            ["Eigenbetrieb", "volle Stromerlöse, Eigenverbrauch für Stall, Kühlung, Trocknung; Förderung direkt", "hohe Investition, Betriebs- und Vermarktungsrisiko, Buchhaltung und Steuern"],
            ["Verpachtung an Betreiber", "planbare Pacht über 20–30 Jahre, kein Investitionsrisiko", "keine Stromerlöse, Bewirtschaftungsauflagen, Bindung der Fläche"],
            ["Beteiligung / Gemeinschaftsprojekt", "Risikoteilung, Einbindung von Gemeinde und Nachbarn, Energiegemeinschaft möglich", "komplexere Verträge, Abstimmungsaufwand"],
          ],
          fussnote: "Allgemeine Einordnung; steuerliche Folgen (Land- und Forstwirtschaft vs. Gewerbebetrieb) mit der Steuerberatung klären.",
        },
        {
          typ: "p",
          text: "Wer den Strom nicht selbst braucht, kann ihn über die [Reststromvermarktung](/ratgeber/reststromvermarktung), einen [Power Purchase Agreement](/ratgeber/ppa-oesterreich) mit einem Unternehmen in der Region oder eine Energiegemeinschaft verwerten. Leasing- und Finanzierungsmodelle für Investitionen im landwirtschaftlichen Betrieb vermitteln wir über unsere [Finanzierungspartner](/service/finanzierung).",
        },
      ],
    },
    {
      id: "planung",
      titel: "Planung in der Praxis: Worauf es ankommt",
      tocLabel: "Planung",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Maschinen zuerst:** Reihenabstand und Durchfahrtshöhe nach Arbeitsbreite von Traktor, Mähwerk, Spritze und Erntemaschine auslegen.",
            "**Tierwohl:** Keine scharfen Kanten, geschützte Kabel, stabile Pfosten. Für PV-Systeme in der Tierhaltung vergibt die Fachstelle für tiergerechte Tierhaltung und Tierschutz (FTT) ein Tierschutz-Kennzeichen.",
            "**Wasser und Boden:** Tropfkanten und Rinnen so planen, dass Niederschlag gleichmäßig verteilt wird und keine Erosionsrinnen entstehen.",
            "**Netz früh klären:** Landwirtschaftliche Flächen liegen oft weit vom nächsten Einspeisepunkt – Netzanfrage vor der Detailplanung.",
            "**Verträge:** Bei Verpachtung an Investoren Bewirtschaftungspflichten, Zugänge, Haftung, Rückbau und Förderauflagen (zehnjähriges Nutzungskonzept) klar regeln.",
            "**Monitoring:** Strom- und Ernteerträge dokumentieren – das dient Förderung, Kontrolle und der eigenen Optimierung.",
          ],
        },
        {
          typ: "p",
          text: "Ökovolt plant und errichtet Agri-PV-Anlagen und ist an der ÖkoInvest GmbH beteiligt, die sich unter anderem mit Freiflächen- und Agri-PV-Projekten befasst. Mehr zu unserem Angebot auf der Seite [Agri-PV](/agri-pv). Für den späteren Betrieb mit Netzanschluss in der Mittelspannung setzen wir unseren eigenen [Parkregler](/technik/parkregler) ein.",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was gilt in Österreich als Agri-PV?",
      a: "Eine PV-Anlage auf landwirtschaftlicher Fläche, bei der die Landwirtschaft Hauptnutzung bleibt, die Module gleichmäßig verteilt sind und mindestens 75 % der Fläche landwirtschaftlich genutzt werden. So definieren es das EABG und die EAG-Investitionszuschüsseverordnung-Strom.",
    },
    {
      q: "Welche Förderung gibt es für Agri-PV?",
      a: "Den EAG-Investitionszuschuss bis 1 MWp ohne den 25-%-Abschlag für Freiflächen. Vertikale Agri-PV und Anlagen mit mindestens 2 m hoher Modulunterkante erhalten als innovative Anlagen 30 % Zuschlag, europäische Module und Wechselrichter bringen je weitere 10 %.",
    },
    {
      q: "Wie viel Fläche darf die Anlage verbrauchen?",
      a: "Für den Investitionszuschuss dürfen Unterkonstruktion und Anlageninfrastruktur höchstens 7 % der Gesamtfläche beanspruchen, und mindestens 75 % müssen landwirtschaftlich genutzt werden. Die übrige Fläche ist für Biodiversitätsmaßnahmen vorgesehen.",
    },
    {
      q: "Welche Kulturen eignen sich für Agri-PV?",
      a: "Besonders Beeren, Kern- und Steinobst, Wein, Blattgemüse und Grünland. Getreide und Kartoffeln sind bedingt geeignet, Mais und Körnerleguminosen reagieren empfindlich auf Schatten.",
    },
    {
      q: "Braucht Agri-PV eine Umwidmung?",
      a: "In den meisten Bundesländern ja. Kärnten nimmt Agri-PV über Obstbau, Geflügel und Fischzucht von der Widmungspflicht aus; die Steiermark verlangt eine Sondernutzung ab 0,5 ha, erlaubt Agri-PV aber auch in landwirtschaftlichen Vorrangzonen.",
    },
    {
      q: "Bleibt die Fläche für die Agrarförderung beihilfefähig?",
      a: "Das entscheidet die AMA nach den GAP-Regeln und hängt von der Nutzung ab. Klären Sie das vor Projektbeginn mit der Bezirksbauernkammer, damit weder Direktzahlungen noch ÖPUL-Prämien gefährdet werden.",
    },
    {
      q: "Lohnt sich Agri-PV für Landwirte?",
      a: "Oft ja, wenn Netzanschluss, Kultur und Anlagendesign zusammenpassen. Die höheren Kosten der Unterkonstruktion werden teils durch den Förderzuschlag, Zusatznutzen wie Hagelschutz und stabilere Erträge in Trockenjahren ausgeglichen. Alternativ ist die Verpachtung an einen Betreiber möglich.",
    },
  ],

  passend: [
    { href: "/agri-pv", titel: "Agri-PV von Ökovolt", text: "Doppelte Ernte auf derselben Fläche." },
    { href: "/landwirtschaft", titel: "PV für die Landwirtschaft", text: "Stall, Scheune, Maschinenhalle." },
    { href: "/ratgeber/freiflaechen-photovoltaik-widmung", titel: "Freiflächen-PV: Widmung", text: "Regeln aller neun Bundesländer." },
    { href: "/freiflaechen-photovoltaik", titel: "Freiflächenanlagen", text: "Solarparks von 500 kWp bis in den MW-Bereich." },
  ],

  quellen: [
    { titel: "RIS – EAG-Investitionszuschüsseverordnung-Strom, § 6 Ab- und Zuschläge (Fassung 2026)", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40275221/NOR40275221.html", stand: "09/2026" },
    { titel: "RIS – EAG-Investitionszuschüsseverordnung-Strom, § 9 Förderanträge (Agri-PV-Nutzungskonzept)", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40260898/NOR40260898.html", stand: "09/2026" },
    { titel: "RIS – Erneuerbaren-Ausbau-Beschleunigungsgesetz, § 5 Begriffsbestimmungen", url: "https://ogd.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40278863/NOR40278863.html", stand: "09/2026" },
    { titel: "RIS – Kärntner Photovoltaikanlagen-Verordnung 2024, § 3 Agri-Photovoltaikanlagen", url: "https://ogd.ris.bka.gv.at/Dokumente/Landesnormen/LKT40019768/LKT40019768.html", stand: "09/2026" },
    { titel: "PV Austria – Photovoltaik in der Landschaft und Agri-Photovoltaik", url: "https://pvbaustria.at/pvlandschaft/", stand: "09/2026" },
    { titel: "PV Austria – NÖ: Agri-PV-Versuchsflächen ziehen positive Bilanz", url: "https://pvbaustria.at/noe-agri-pv-versuchsflaechen-ziehen-positiv-bilanz/", stand: "09/2026" },
    { titel: "Laub et al. (2022): Contrasting yield responses at varying levels of shade, Agronomy for Sustainable Development 42", url: "https://doi.org/10.1007/s13593-022-00783-7", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Agri-Photovoltaik: Chance für Landwirtschaft und Energiewende (Leitfaden)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/agri-photovoltaik-chance-fuer-landwirtschaft-und-energiewende.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Agri-PV auf Ihrer Fläche?", text: "Kultur, Konzept, Förderung und Netz prüfen.", href: "/agri-pv", label: "Agri-PV anfragen" },
  cta: {
    title: "Agri-PV, die zur Landwirtschaft passt – nicht umgekehrt.",
    text: "Wir planen Agri-PV-Anlagen nach Kultur und Maschinen, klären Widmung, Förderung und Netz und begleiten Bau und Betrieb.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Agri-PV", href: "/agri-pv" },
  },
};

export default artikel;
