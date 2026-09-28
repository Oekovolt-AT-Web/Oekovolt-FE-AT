// Ratgeber: Hagel und Photovoltaik in Österreich
// Hagelgefährdung: HORA-Hagelkarte (Wiederkehrperioden 10/20/30 Jahre), Einzelabfragen der Ortszentren
// vom 28.09.2026. Hagelwiderstandsklassen HW 1–5: Elementarschutzregister Hagel (VKF/EPZ, hagelregister.at).
// Modulprüfung: IEC 61215-2, MQT 17 (Hagelprüfung). Schadenmeldungen: Österreichische Hagelversicherung.

const joule = (masseG, v) => (0.5 * (masseG / 1000) * v * v).toFixed(1).replace(".", ",");

const artikel = {
  slug: "hagel-photovoltaik",
  title: "Hagel und Photovoltaik: Hagelwiderstandsklassen, Prüfung, Schutz",
  seoTitle: "Hagel & Photovoltaik: HW-Klassen, Schutz | Ökovolt",
  kurzTitel: "Hagel & Photovoltaik",
  description:
    "Hagel und Photovoltaik in Österreich: Hagelgefahr laut HORA, IEC 61215 vs. Hagelwiderstandsklassen HW 1–5, Modulwahl, Versicherung und Vorgehen nach Schaden.",
  excerpt:
    "Die Standardprüfung für Solarmodule arbeitet mit 25-mm-Eiskugeln – in weiten Teilen Österreichs fallen alle 30 Jahre 4 bis 5 cm große Körner. Was Hagelwiderstandsklassen bedeuten und wie Sie Ihre Anlage schützen.",
  hauptKeyword: "hagel photovoltaik",
  keywords: [
    "Hagel Photovoltaik",
    "Hagelwiderstandsklasse Solarmodule",
    "Hagelregister PV-Module",
    "IEC 61215 Hagelprüfung",
    "Hagelschaden PV-Anlage",
    "Hagelgefährdung Österreich HORA",
    "PV-Versicherung Hagel",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/Dienstleistungen/Photovoltaik/photovoltaikmodule.png",
  bildAlt: "Nahaufnahme kristalliner Solarmodule mit Glasoberfläche und Aluminiumrahmen",
  badge: { wert: "HW 4", text: "empfohlen, wo 4-cm-Hagel alle 30 Jahre fällt" },

  kurzFazit: [
    "**Hagel ist neben Schnee die größte Naturgefahr für PV-Anlagen in Österreich: Laut HORA fallen in Linz, St. Pölten, Graz und Klagenfurt statistisch alle 30 Jahre Hagelkörner von 4 bis 5 cm, in Villach über 5 cm.**",
    "Die Pflichtprüfung für Module nach IEC 61215 schießt mit **25-mm-Eiskugeln bei 23 m/s** – rund 2 Joule Aufprallenergie. Ein 4-cm-Korn (HW 4) bringt **11 Joule**, ein 5-cm-Korn (HW 5) **27 Joule**.",
    "Die **Hagelwiderstandsklassen HW 1 bis HW 5** des Elementarschutzregisters Hagel (hagelregister.at) zeigen, bis zu welcher Korngröße ein Bauteil schadenfrei bleibt. Für Gewerbeanlagen in Hagelregionen sind **HW 4 oder HW 5** sinnvoll.",
    "Nach einem Unwetter gilt: **nicht aufs Dach steigen**, dokumentieren, Anlage elektrisch prüfen lassen und die Versicherung informieren. Mikrorisse sind oft unsichtbar und zeigen sich erst in Thermografie oder Elektrolumineszenz.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie hagelfest sind Solarmodule?",
      tocLabel: "Wie hagelfest?",
      bloecke: [
        {
          typ: "p",
          text: "**Jedes in Europa zertifizierte Solarmodul hat eine Hagelprüfung bestanden – aber nur mit 25 mm großen Eiskugeln, die mit 23 m/s auftreffen.** Das entspricht einem mittleren Hagelschlag. Wie viel ein Modul darüber hinaus verträgt, hängt von Glasdicke, Aufbau (Glas-Folie oder [Glas-Glas](/wissen/lexikon#glas-glas-modul)), Rahmen, Einbausituation und Neigung ab. Verlässliche Aussagen darüber liefern freiwillige Prüfungen mit größeren Kugeln oder die Einstufung in eine [Hagelwiderstandsklasse](/wissen/lexikon#hagelwiderstandsklasse).",
        },
        {
          typ: "p",
          text: "Hagelschäden an Photovoltaikanlagen reichen von gebrochenem Glas über verbogene Rahmen bis zu unsichtbaren Mikrorissen in den Zellen, die den Ertrag über Jahre schleichend senken. Bei Gewerbe- und Freiflächenanlagen mit hunderten Modulen summiert sich ein einziges Ereignis schnell auf sechsstellige Beträge. Dass solche Ereignisse keine Theorie sind, zeigt der 2. September 2026: Laut Österreichischer Hagelversicherung entstand allein bei einem Gartenbaubetrieb in Stainz (Steiermark) durch „extrem große Hagelkörner“ ein Schaden von knapp 3 Millionen Euro an Gläsern, Schirmen, Einrichtungen und Kulturen.",
        },
      ],
    },
    {
      id: "gefaehrdung",
      titel: "Hagelgefährdung in Österreich: Was HORA zeigt",
      tocLabel: "Hagelgefahr laut HORA",
      bloecke: [
        {
          typ: "p",
          text: "**Die Hagelgefährdungskarte in HORA zeigt für jeden Standort bis 1.500 m Seehöhe, welche Korngröße statistisch alle 10, 20 und 30 Jahre erreicht wird.** Grundlage sind dreidimensionale Radarmessungen von 2009 bis 2022, kalibriert mit mehr als 5.000 Hagelmeldungen. Ein Vertrauensmaß von einem bis fünf Sternen zeigt, wie belastbar die Schätzung ist; im nordöstlichen Weinviertel und im westlichen Vorarlberg ist die Datenlage laut HORA dünn.",
        },
        {
          typ: "tabelle",
          caption: "Maximale Hagelkorngröße nach Wiederkehrperiode laut HORA (Ortszentren, Abfrage 28.09.2026)",
          kopf: ["Ort", "alle 10 Jahre", "alle 20 Jahre", "alle 30 Jahre", "Vertrauen"],
          zeilen: [
            ["Wien", "≤ 3 cm", "3–4 cm", "3–4 cm", "4 von 5"],
            ["St. Pölten", "3–4 cm", "4–5 cm", "4–5 cm", "4 von 5"],
            ["Linz", "3–4 cm", "3–4 cm", "4–5 cm", "1 von 5"],
            ["Ostermiething (Innviertel)", "3–4 cm", "3–4 cm", "3–4 cm", "5 von 5"],
            ["Salzburg", "3–4 cm", "3–4 cm", "3–4 cm", "5 von 5"],
            ["Innsbruck", "≤ 3 cm", "3–4 cm", "3–4 cm", "2 von 5"],
            ["Bregenz", "≤ 3 cm", "≤ 3 cm", "3–4 cm", "1 von 5"],
            ["Graz", "3–4 cm", "4–5 cm", "4–5 cm", "4 von 5"],
            ["Klagenfurt", "3–4 cm", "4–5 cm", "4–5 cm", "3 von 5"],
            ["Villach", "3–4 cm", "4–5 cm", "> 5 cm", "–"],
            ["Eisenstadt", "≤ 3 cm", "3–4 cm", "3–4 cm", "3 von 5"],
            ["Kitzbühel / Zell am See", "3–4 cm", "3–4 cm", "4–5 cm", "–"],
          ],
          hervorheben: 3,
          fussnote: "Quelle: HORA, Hagelgefährdung (Hagelkorngrößen der Wiederkehrperioden), Einzelabfragen der Ortszentren. „–“ = Vertrauensmaß nicht ausgewertet. Werte für die eigene Adresse unbedingt selbst abfragen; lokal treten deutliche Unterschiede auf.",
        },
        {
          typ: "p",
          text: "Auffällig ist, dass gerade Wirtschaftsräume wie das Grazer Becken, das Klagenfurter Becken, der Zentralraum St. Pölten und das Linzer Umland in der 30-jährlichen Betrachtung 4 bis 5 cm erreichen – also dort, wo viele große Gewerbedächer stehen. Wie sich Wetterextreme insgesamt entwickeln, zeigt die Bilanz der Österreichischen Hagelversicherung für 2026: Neben Rekord-Dürreschäden von rund 1 Milliarde Euro verursachten Frost, Hagel, Sturm und Überschwemmung in der Landwirtschaft bis August weitere rund 80 Millionen Euro Schaden.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Neu: Normen-Standortabfrage Hagel",
          text: "HORA bietet neben Schneelast (ÖNORM B 1991-1-3), Basiswindgeschwindigkeit (ÖNORM B 1991-1-4) und Erdbeben (ÖNORM B 1998-1) auch eine Normen-Standortabfrage „Hagel“ auf Basis der ÖNORM B 3663 (Ausgabe 2026-07-15) an – als PDF mit Lageplan für Planungsunterlagen. Unser [Standort-Check](/standort-check) zeigt Hagel, Schnee und Wind gemeinsam mit dem PV-Ertrag.",
        },
      ],
    },
    {
      id: "pruefung",
      titel: "IEC 61215 oder Hagelwiderstandsklasse: Was die Prüfungen aussagen",
      tocLabel: "Prüfungen & HW-Klassen",
      bloecke: [
        {
          typ: "p",
          text: "**Die IEC 61215 ist eine Mindestprüfung für die Typzulassung, die Hagelwiderstandsklasse eine Einstufung nach tatsächlicher Belastbarkeit.** Bei der Hagelprüfung MQT 17 der IEC 61215-2 wird ein Modul an elf Stellen mit Eiskugeln beschossen; Standard sind 25 mm bei 23,0 m/s. Die Norm erlaubt größere Kugeln bis 75 mm, viele Hersteller geben aber nur die Mindestprüfung an.",
        },
        {
          typ: "tabelle",
          caption: "Aufprallenergie im Vergleich: Modulprüfung nach IEC 61215 und Hagelwiderstandsklassen",
          kopf: ["Prüfung / Klasse", "Korndurchmesser", "Masse", "Geschwindigkeit", "Energie"],
          zeilen: [
            ["IEC 61215 MQT 17 (Standard)", "25 mm", "7,53 g", "23,0 m/s", `${joule(7.53, 23)} J`],
            ["IEC 61215 MQT 17 (optional)", "35 mm", "20,7 g", "27,2 m/s", `${joule(20.7, 27.2)} J`],
            ["IEC 61215 MQT 17 (optional)", "45 mm", "43,9 g", "30,7 m/s", `${joule(43.9, 30.7)} J`],
            ["HW 1", "10 mm", "0,5 g", "13,8 m/s", "0,04 J"],
            ["HW 2", "20 mm", "3,6 g", "19,5 m/s", "0,7 J"],
            ["HW 3", "30 mm", "12,3 g", "23,9 m/s", "3,5 J"],
            ["HW 4", "40 mm", "29,2 g", "27,5 m/s", "11,1 J"],
            ["HW 5", "50 mm", "56,9 g", "30,8 m/s", "27,0 J"],
          ],
          markierteZeile: 6,
          hervorheben: 4,
          fussnote: "IEC-Werte nach IEC 61215-2 (MQT 17), Energie selbst berechnet (E = ½ · m · v²). HW-Klassen laut Elementarschutzregister Hagel (VKF/EPZ): Die Klassengrenze gibt die Energie an, bei der ein Bauteil noch schadenfrei bleibt; angenommen wird eine Eisdichte von 870 kg/m³ und die natürliche Fallgeschwindigkeit des Korns.",
        },
        {
          typ: "p",
          text: "Die Zahlen machen den Abstand deutlich: Ein Modul, das nur den IEC-Standard nachweist, hat mit rund 2 Joule weniger als ein Fünftel der Energie eines 4-cm-Korns aufgenommen. Das heißt nicht, dass es bei größerem Hagel zwangsläufig bricht – viele Module halten deutlich mehr aus. Aber es ist nicht nachgewiesen.",
        },
        { typ: "h3", text: "Das Hagelregister: Wie Module eine HW-Klasse bekommen" },
        {
          typ: "p",
          text: "Das Elementarschutzregister Hagel wird in Österreich vom Elementarschaden Präventionszentrum (EPZ) gemeinsam mit der Schweizer Vereinigung Kantonaler Feuerversicherungen (VKF) geführt. Es umfasst alle Bauteile der Gebäudehülle, darunter die Gruppe „Energiesysteme“ mit Solarmodulen. Geprüft wird mit künstlichem Hageleis: fünf Proben, jeweils mit der Kugelgröße der angestrebten Klasse. Bleibt jede Probe in Funktion und Aussehen schadenfrei, erhält das Produkt die Klasse. Die Klassifikation gilt höchstens fünf Jahre.",
        },
        {
          typ: "liste",
          punkte: [
            "**Klasse mit Stern (*):** gilt für Kunststoffbauteile im Neuzustand – durch Alterung kann der Widerstand sinken.",
            "**„Materialprüfung“:** nur das Material wurde geprüft, nicht Befestigung, Ränder oder Einbausituation.",
            "**HW 5 mit Zusatzvermerk:** Einige Produkte wurden zusätzlich mit 6- oder 7-cm-Eiskugeln beschossen; das steht in den Bemerkungen.",
            "**Mehrere Funktionen:** Ein Bauteil kann für Dichtheit und Aussehen unterschiedliche Klassen haben – bei Modulen zählen Glasbruch und Funktion.",
          ],
        },
      ],
    },
    {
      id: "modulwahl",
      titel: "Module und Montage hagelsicher auswählen",
      tocLabel: "Modulwahl & Montage",
      bloecke: [
        {
          typ: "p",
          text: "**Die Hagelwiderstandsklasse sollte mindestens der Korngröße entsprechen, die HORA für den Standort alle 30 Jahre ausweist – bei 4 bis 5 cm also HW 4, bei über 5 cm HW 5.** Diese Faustregel orientiert sich an der Lebensdauer einer PV-Anlage von 25 bis 30 Jahren. Für Anlagen, bei denen ein Ausfall besonders teuer wäre – Produktionsbetriebe, Kühlhäuser, Freiflächen mit Finanzierung –, lohnt der Schritt zur nächsthöheren Klasse.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Nachweis verlangen:** Eintrag im Hagelregister oder Prüfbericht mit größeren Kugeln (35 mm, 45 mm) statt nur „IEC 61215 bestanden“.",
            "**Glasaufbau beachten:** Frontglasdicke und Aufbau (Glas-Folie, Glas-Glas) sind modellabhängig; entscheidend ist der Prüfnachweis für genau dieses Modell.",
            "**Großformate prüfen:** Große Module mit schmalen Rahmen biegen sich stärker durch – Klemmung und Unterkonstruktion müssen zur Prüfkonfiguration passen.",
            "**Neigung nutzen:** Steilere Module werden schräger getroffen; flache Ost-West-Systeme und Carports bekommen den senkrechten Aufprall ab.",
            "**Tracker mit Hagelposition:** Nachgeführte Freiflächenanlagen können bei Hagelwarnung in eine steile Schutzstellung fahren – nur mit zuverlässiger Unwetterwarnung und Steuerung.",
            "**Kabel und Stecker schützen:** Hagel beschädigt auch offene Leitungen und Anschlussdosen – Kabel geschützt führen.",
          ],
        },
        {
          typ: "p",
          text: "Welche Modultechnologien und Bauarten es gibt und wie sie sich bei Schnee- und Hagellast unterscheiden, erklärt der Ratgeber [Solarmodule im Vergleich](/ratgeber/solarmodule-vergleich). Im Obst- und Weinbau können PV-Module zugleich als Hagelschutz für die Kulturen dienen – Konzepte dazu im Ratgeber [Agri-PV in Österreich](/ratgeber/agri-pv-oesterreich).",
        },
      ],
    },
    {
      id: "nach-dem-hagel",
      titel: "Nach dem Unwetter: So gehen Sie bei Hagelschaden vor",
      tocLabel: "Nach dem Hagel",
      bloecke: [
        {
          typ: "p",
          text: "**Nach einem Hagelschlag ist die erste Regel: Sicherheit vor Ertrag.** Gebrochenes Modulglas kann Isolationsfehler verursachen; Wasser dringt ein, und im schlimmsten Fall entstehen Lichtbögen. Gleichzeitig gilt es, den Schaden sauber zu dokumentieren, damit die Versicherung ihn anerkennt.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Nicht aufs Dach steigen", "Beschädigte Module nicht betreten oder berühren. Bei sichtbarem Glasbruch den Elektrotechniker verständigen; die Anlage wird bei Bedarf fachgerecht freigeschaltet."],
            ["Dokumentieren", "Datum, Uhrzeit, Fotos vom Boden oder per Drohne, Hagelkörner mit Maßstab fotografieren, Monitoring-Daten vor und nach dem Ereignis sichern."],
            ["Versicherung informieren", "Schaden umgehend melden, Fristen der Polizze beachten, keine Reparatur ohne Rücksprache beauftragen."],
            ["Elektrisch prüfen", "Isolations- und Kennlinienmessung je String; Wechselrichter-Fehlermeldungen auswerten."],
            ["Unsichtbare Schäden finden", "Thermografie und bei Verdacht Elektrolumineszenz zeigen Mikrorisse und defekte Zellen, die mit freiem Auge nicht erkennbar sind."],
            ["Tauschen und nachweisen", "Module gleicher oder kompatibler Bauart einsetzen, Prüfprotokoll nach ÖVE/ÖNORM EN 62446 aktualisieren."],
          ],
        },
        {
          typ: "p",
          text: "Für die Schadenaufnahme bei großen Dachflächen bewährt sich die [Drohnen-Thermografie](/service/drohneninspektion); die anschließende Anlagenprüfung übernimmt ein [E-Check](/service/e-check). Welche Rolle die Überwachung dabei spielt, beschreibt die Seite [Fernwartung](/technik/fernwartung).",
        },
      ],
    },
    {
      id: "versicherung",
      titel: "Versicherung: Was bei Hagel gedeckt ist",
      tocLabel: "Versicherung",
      bloecke: [
        {
          typ: "p",
          text: "**Hagel an PV-Anlagen wird in Österreich in der Regel über die Gebäudeversicherung (Sturm und Hagel) oder eine eigene Photovoltaikversicherung abgedeckt – nicht über die Österreichische Hagelversicherung.** Diese versichert als landwirtschaftlicher Spezialversicherer Kulturen und Tiere gegen Wetterrisiken. Für Gewerbe- und Freiflächenanlagen ist eine Allgefahrendeckung mit Ertragsausfall üblich.",
        },
        {
          typ: "tabelle",
          caption: "Versicherungslösungen für PV-Anlagen und Hagel (Überblick)",
          kopf: ["Deckung", "Was sie leistet", "Worauf achten"],
          zeilen: [
            ["Gebäudeversicherung mit Sturm/Hagel", "Sachschaden an der Anlage als Gebäudebestandteil", "PV-Anlage ausdrücklich einschließen, Versicherungssumme anpassen"],
            ["Photovoltaik- bzw. Elektronikversicherung (Allgefahren)", "Hagel, Schnee, Überspannung, Diebstahl, Bedienfehler", "Selbstbehalt, Neuwert, Ausschlüsse bei mangelhafter Montage"],
            ["Ertragsausfall / Betriebsunterbrechung", "entgangener Stromertrag bzw. Mehrkosten für Netzbezug", "Haftzeit, Berechnungsbasis (Monitoringdaten)"],
            ["Landwirtschaftliche Kulturversicherung", "Schäden an Kulturen, etwa unter Agri-PV", "gesonderte Polizze, nicht für die PV-Technik"],
          ],
          fussnote: "Allgemeiner Überblick, keine Versicherungsberatung. Umfang und Bedingungen hängen vom jeweiligen Versicherer ab.",
        },
        {
          typ: "p",
          text: "Versicherer fragen zunehmend nach Nachweisen zur Hagelfestigkeit und zur fachgerechten Montage. Hagelklassifizierte Module können sich deshalb doppelt lohnen. Welche Deckungen für Ihre Anlage sinnvoll sind, klären wir gemeinsam mit Partnern – siehe [PV-Versicherung](/service/versicherung) und den Ratgeber [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung). Dass Schnee und Hagel oft gemeinsam geplant werden müssen, zeigt der Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie groß darf Hagel sein, damit Solarmodule nicht brechen?",
      a: "Nachgewiesen ist bei jedem zertifizierten Modul nur der IEC-Standard mit 25-mm-Eiskugeln. Module mit Hagelwiderstandsklasse HW 4 überstehen 4-cm-Körner, HW 5 5-cm-Körner schadenfrei. Ohne solchen Nachweis ist das Verhalten bei großem Hagel offen.",
    },
    {
      q: "Was bedeutet Hagelwiderstandsklasse HW 4?",
      a: "Das Bauteil bleibt beim Aufprall einer 40-mm-Eiskugel mit 27,5 m/s – das sind rund 11 Joule – ohne Schaden. Die Einstufung erfolgt nach den Prüfbestimmungen des Elementarschutzregisters Hagel und ist auf hagelregister.at abrufbar.",
    },
    {
      q: "Wo finde ich die Hagelgefahr für meine Adresse?",
      a: "In HORA auf hora.gv.at unter „Hagel“. Die Karte zeigt die maximale Korngröße für Wiederkehrperioden von 10, 20 und 30 Jahren sowie ein Vertrauensmaß. Unser Standort-Check fasst Hagel, Schnee, Wind und Ertrag zusammen.",
    },
    {
      q: "Sind Glas-Glas-Module hagelfester?",
      a: "Nicht automatisch. Glas-Glas-Module sind mechanisch steifer und langlebig, verwenden aber oft dünnere Einzelgläser. Entscheidend ist der Prüfnachweis für das konkrete Modell – idealerweise eine Hagelwiderstandsklasse oder Prüfung mit größeren Kugeln.",
    },
    {
      q: "Zahlt die Versicherung Hagelschäden an der PV-Anlage?",
      a: "Wenn die Anlage in der Gebäudeversicherung mit Sturm/Hagel eingeschlossen ist oder eine eigene PV-Versicherung besteht, ja. Prüfen Sie Versicherungssumme, Selbstbehalt und ob Ertragsausfall mitversichert ist. Die Österreichische Hagelversicherung deckt landwirtschaftliche Kulturen, nicht die PV-Technik.",
    },
    {
      q: "Welche PV-Anlagen sind besonders hagelgefährdet?",
      a: "Flache Anlagen, auf die Hagel nahezu senkrecht trifft: Ost-West-Systeme auf Flachdächern, Carports und flach aufgeständerte Freiflächen. Steile Dachanlagen und Fassaden werden schräger getroffen und nehmen weniger Energie auf. In exponierten Lagen lohnt deshalb der Blick auf die Hagelwiderstandsklasse besonders.",
    },
    {
      q: "Kann ich Hagelschäden selbst erkennen?",
      a: "Glasbruch ja, Mikrorisse nicht. Hinweise liefern Ertragseinbrüche einzelner Strings im Monitoring. Sicherheit bringen Thermografie, Elektrolumineszenz und elektrische Messungen durch Fachleute – betreten Sie beschädigte Module nicht.",
    },
  ],

  passend: [
    { href: "/service/versicherung", titel: "PV-Versicherung", text: "Allgefahren, Ertragsausfall, Haftpflicht." },
    { href: "/standort-check", titel: "Standort-Check", text: "Hagel, Schnee, Wind und Ertrag für Ihre Adresse." },
    { href: "/service/drohneninspektion", titel: "Drohnen-Thermografie", text: "Hotspots und Hagelschäden aus der Luft finden." },
    { href: "/ratgeber/solarmodule-vergleich", titel: "Solarmodule im Vergleich", text: "Glas-Glas, TOPCon, Prüflasten." },
  ],

  quellen: [
    { titel: "Elementarschaden Präventionszentrum / VKF – Hagelregister und Infothek", url: "https://www.hagelregister.at/infothek/", stand: "09/2026" },
    { titel: "VKF – Hagelwiderstand von Baumaterialien (Hagelwiderstandsklassen HW 1–5)", url: "https://www.hagelregister.at/wp-content/uploads/2018/03/Hagelwiderstand-Baumaterialien_d.pdf", stand: "09/2026" },
    { titel: "HORA – Hagelgefährdung, Wiederkehrperioden 10/20/30 Jahre", url: "https://hora.gv.at/#/chagel:y30", stand: "09/2026" },
    { titel: "Österreichische Hagelversicherung – Spätes Hagelunwetter trifft insbesondere die steirische Landwirtschaft (03.09.2026)", url: "https://www.hagel.at/presseaussendungen/spaetes-hagelunwetter-2026/", stand: "09/2026" },
    { titel: "Österreichische Hagelversicherung – Rekord-Dürreschäden in der Landwirtschaft (10.08.2026)", url: "https://www.hagel.at/presseaussendungen/duerreschaeden-2026/", stand: "09/2026" },
    { titel: "IEC 61215-2 – Terrestrial PV modules, Design qualification: Test procedures (MQT 17 Hail test)", url: "https://webstore.iec.ch/en/publication/61350", stand: "09/2026" },
    { titel: "Elementarschaden Präventionszentrum (EPZ)", url: "https://www.elementarschaden.at/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Hagelgefahr am Standort?", text: "HORA-Werte zu Hagel, Schnee und Wind plus Ertrag.", href: "/standort-check", label: "Standort prüfen" },
  cta: {
    title: "PV-Anlagen, die Unwetter aushalten.",
    text: "Wir wählen Module und Unterkonstruktion passend zur Hagel- und Schneegefährdung Ihres Standorts und unterstützen nach einem Schaden mit Prüfung, Dokumentation und Tausch.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "PV-Versicherung", href: "/service/versicherung" },
  },
};

export default artikel;
