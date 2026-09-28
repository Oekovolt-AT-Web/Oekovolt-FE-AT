// Ratgeber: Photovoltaik auf dem Flachdach – Hallendach, Ballast, Statik (Österreich)
// Erträge: EU JRC PVGIS 5.3, eigene Abfragen 28.09.2026 (Süd 10°, Ost/West 10°), 14 % Systemverluste.
// Schneelast: eHORA (ÖNORM B 1991-1-3:2022), Beispielwerte Ortszentren. Wind: ÖNORM B 1991-1-4 (HORA).
// Sonnenhöhe 21.12. Mittag Linz: 90° − 48,3° − 23,44° ≈ 18,3°.

// [Stadt, Süd 10°, Ost-West 10°]
const ERTRAG = [
  ["Wien", 1069, 975],
  ["Linz", 1040, 950],
  ["Salzburg", 987, 905],
  ["Innsbruck", 1209, 1084],
  ["Graz", 1098, 995],
  ["Klagenfurt", 1133, 1031],
];

const f0 = (x) => Math.round(x).toLocaleString("de-AT");

const artikel = {
  slug: "photovoltaik-flachdach",
  title: "Photovoltaik auf dem Flachdach: Hallendach, Ballast und Statik",
  seoTitle: "Photovoltaik Flachdach: Ballast & Statik | Ökovolt",
  kurzTitel: "Photovoltaik Flachdach",
  description:
    "Photovoltaik auf Flach- und Hallendächern in Österreich: Süd oder Ost-West, Ballast oder Befestigung, Schnee- und Windlast, Brandschutz – mit Beispiel 500 kWp.",
  excerpt:
    "Gewerbehallen haben oft große, aber schwach tragfähige Flachdächer. Wie Sie Aufständerung, Ballast und Befestigung wählen, welche Lasten nach ÖNORM wirken und was ein 500-kWp-Hallendach bringt.",
  hauptKeyword: "photovoltaik flachdach",
  keywords: [
    "Photovoltaik Flachdach",
    "PV Hallendach",
    "Flachdach Aufständerung Ballast",
    "Photovoltaik Trapezblechdach",
    "PV Foliendach Befestigung",
    "Flachdach Statik Photovoltaik",
    "Ost-West Flachdach Gewerbe",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Technik & Planung",
  bild: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg",
  bildAlt: "Photovoltaikanlage auf einem großen Industrie-Flachdach in Dornbirn mit Bergen im Hintergrund",
  badge: { wert: "15–30 kg/m²", text: "typische Zusatzlast ballastierter Flachdachanlagen" },

  kurzFazit: [
    "**Auf Flach- und Hallendächern werden PV-Module mit 10 bis 15° aufgeständert – entweder nach Süden mit Reihenabstand oder Ost-West Rücken an Rücken.** Ost-West bringt je kWp weniger, auf derselben Fläche aber meist rund ein Drittel mehr Strom.",
    "In Linz liefert Süd 10° laut PVGIS **1.040 kWh/kWp**, Ost-West 10° **950 kWh/kWp**. Die Unterschiede zwischen den Landeshauptstädten sind größer als die zwischen den Systemen.",
    "Die Zusatzlast liegt bei ballastierten Systemen typischerweise bei **15 bis 30 kg/m²**, in Rand- und Eckbereichen mehr. Leichte Trapezblech- und Sandwichdächer haben dafür oft keine Reserve – dann braucht es mechanische Befestigung oder eine leichtere Auslegung.",
    "Maßgeblich sind **Schneelast (ÖNORM B 1991-1-3)**, **Windsog (ÖNORM B 1991-1-4)**, der Zustand der Dachabdichtung sowie **Brandschutz nach OVE R 11-1** – ein statischer Nachweis ist bei Hallendächern der Regelfall.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Eignet sich mein Flachdach für Photovoltaik?",
      tocLabel: "Eignung",
      bloecke: [
        {
          typ: "p",
          text: "**Fast jedes Flachdach eignet sich grundsätzlich für Photovoltaik – entscheidend sind Tragreserve, Zustand der Abdichtung und Windlast, nicht die Ausrichtung des Gebäudes.** Weil die Module auf einer eigenen Unterkonstruktion stehen, lässt sich die optimale Richtung unabhängig vom Grundriss wählen. Gerade Gewerbehallen, Logistikzentren, Supermärkte und landwirtschaftliche Gebäude bieten große, unverschattete Flächen direkt beim Verbraucher.",
        },
        {
          typ: "p",
          text: "Die Schwachstelle ist meist das Tragwerk. Viele Hallen der letzten Jahrzehnte wurden wirtschaftlich knapp auf Eigengewicht, Schnee und Wind bemessen, ohne Reserve für zusätzliche Lasten. Bevor über Module und Wechselrichter gesprochen wird, gehört deshalb die Statik auf den Tisch. Die gute Nachricht: Seit der ÖNORM B 1991-1-3:2022 sind die Schneelasten in vielen Tallagen niedriger als früher – das kann Reserven freimachen, die es nach alter Bemessung nicht gab.",
        },
      ],
    },
    {
      id: "systeme",
      titel: "Süd oder Ost-West: Die zwei Grundsysteme",
      tocLabel: "Süd oder Ost-West",
      bloecke: [
        {
          typ: "p",
          text: "**Süd-Aufständerung liefert mehr Ertrag je kWp, Ost-West mehr Ertrag je Quadratmeter Dach.** Die Wahl hängt davon ab, ob Fläche, Statik, Netzanschluss oder Investitionsbudget der Engpass ist.",
        },
        {
          typ: "tabelle",
          caption: "Spezifischer Ertrag auf dem Flachdach in kWh/kWp (PVGIS 5.3)",
          kopf: ["Stadt", "Süd 10°", "Ost-West 10°", "Ost-West in % von Süd 10°"],
          zeilen: ERTRAG.map(([s, sued, ow]) => [s, f0(sued), f0(ow), `${Math.round((ow / sued) * 100)} %`]),
          fussnote: "Quelle: EU JRC, PVGIS 5.3, eigene Abfragen vom 28.09.2026, 14 % Systemverluste, ohne Verschattung und Schnee. Werte aller Landeshauptstädte im Ratgeber Ertrag pro kWp.",
        },
        {
          typ: "tabelle",
          caption: "Süd- und Ost-West-Aufständerung im Vergleich",
          kopf: ["Kriterium", "Süd 10–15°", "Ost-West 10°"],
          zeilen: [
            ["Belegung", "Reihenabstand nötig, ca. 100–125 kWp je 1.000 m²", "dicht, ca. 150–170 kWp je 1.000 m²"],
            ["Ertrag je kWp", "höher (Linz 1.040 kWh)", "rund 9 % niedriger (Linz 950 kWh)"],
            ["Windangriff", "höher, einseitig offen", "geringer, aerodynamisch geschlossen"],
            ["Tagesprofil", "Mittagsspitze", "breiter, niedrigere Spitze"],
            ["Schnee", "rutscht bei 15° eher ab", "bleibt länger liegen"],
            ["Wartungszugang", "zwischen den Reihen gut", "eigene Wartungsgassen einplanen"],
          ],
          fussnote: "Richtwerte für Module mit ca. 22–23 % Wirkungsgrad; Belegungsdichte abhängig von Randzonen, Aufbauten und Brandschutz.",
        },
        {
          typ: "p",
          text: "Die ausführliche Gegenüberstellung mit Tagesprofil, Wechselrichterauslegung und Netzanschluss finden Sie im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west). Für die Frage, wie viel Leistung ein Betrieb überhaupt sinnvoll nutzen kann, hilft [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
        { typ: "h3", text: "Reihenabstand bei Süd-Aufständerung" },
        {
          typ: "p",
          text: "Damit sich Südreihen im Winter nicht verschatten, richtet sich der Abstand nach dem Sonnenstand am 21. Dezember. In Linz steht die Sonne dann zu Mittag nur rund 18° über dem Horizont. Eine Modulreihe mit 15° Neigung und 1,13 m Modulbreite braucht ohne Winterverschattung einen Reihenabstand von etwa 1,9 bis 2,0 m, also rund das 1,8-Fache ihrer Grundrisstiefe. In der Praxis wird oft etwas enger geplant und ein geringer Winterverlust in Kauf genommen – eine Abwägung, die sich mit einer Simulation beziffern lässt.",
        },
      ],
    },
    {
      id: "dachtypen",
      titel: "Dachaufbau: Trapezblech, Sandwich, Folie, Bitumen",
      tocLabel: "Dachtypen",
      bloecke: [
        {
          typ: "p",
          text: "**Wie die Anlage befestigt wird, hängt vom Dachaufbau ab – und jeder Aufbau hat eigene Risiken für Dichtheit und Tragfähigkeit.**",
        },
        {
          typ: "tabelle",
          caption: "Befestigung nach Dachtyp",
          kopf: ["Dachtyp", "Übliche Befestigung", "Worauf achten"],
          zeilen: [
            ["Trapezblech (Stahl- oder Alu-Hallen)", "Kurzschienen oder Klemmen direkt auf den Hochsicken, flache Aufständerung", "Blechdicke und Schraubenauszugswerte, Korrosionsschutz, Tragreserve der Pfetten"],
            ["Sandwichpaneele", "systemgeprüfte Klemmen oder Schienen auf den Hochsicken", "Freigabe des Paneelherstellers, Durchdringungen minimieren, Dämmkern nicht quetschen"],
            ["Folienabdichtung (PVC, FPO, EPDM)", "ballastiert auf Bautenschutzmatten oder mit angeschweißten Befestigungspunkten", "Materialverträglichkeit, Druckverteilung, Garantie des Dachdeckers"],
            ["Bitumen", "ballastiert oder mechanisch mit eingeklebten Stützen", "Weichwerden im Sommer, Schutzlage unter Auflagern"],
            ["Kies- und Betondach", "ballastiert, Kies teilweise als Ballast nutzbar", "hohe Eigenlast, aber oft große Tragreserve"],
            ["Gründach", "Solar-Gründach-Systeme mit Substrat als Ballast", "Bewuchs darf Module nicht verschatten, Pflegezugang"],
          ],
          minBreite: 680,
          fussnote: "Allgemeine Übersicht; maßgeblich sind die Freigaben der Hersteller von Dach, Paneel und Montagesystem sowie der statische Nachweis.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Dach zuerst sanieren – nicht danach",
          text: "Eine PV-Anlage bleibt 25 bis 30 Jahre auf dem Dach. Hat die Abdichtung nur noch zehn Jahre Restlebensdauer, muss die Anlage für die Sanierung ab- und wieder aufgebaut werden – das kostet oft mehr als eine vorgezogene Sanierung. Klären Sie außerdem, ob die Garantie des Dachdeckers durch die Anlage berührt wird, und lassen Sie Durchdringungen vom Dachdecker ausführen oder abnehmen.",
        },
      ],
    },
    {
      id: "lasten",
      titel: "Statik: Eigengewicht, Ballast, Schnee und Wind",
      tocLabel: "Statik & Lasten",
      bloecke: [
        {
          typ: "p",
          text: "**Auf ein Flachdach wirken durch die PV-Anlage drei Lasten zusätzlich: ihr Eigengewicht samt Ballast, veränderte Schneelasten und Windkräfte, die je nach Dachbereich drücken oder saugen.** Der Tragwerksplaner weist nach, dass Dach und Befestigung alle Kombinationen aufnehmen.",
        },
        {
          typ: "tabelle",
          caption: "Lastanteile einer Flachdach-PV-Anlage (Richtwerte)",
          kopf: ["Last", "Größenordnung", "Grundlage"],
          zeilen: [
            ["Module", "ca. 11–13 kg/m² Modulfläche (Glas-Glas eher mehr)", "Datenblatt"],
            ["Unterkonstruktion", "ca. 2–5 kg/m²", "Systemhersteller"],
            ["Ballast", "stark abhängig von Windzone, Gebäudehöhe und Dachbereich – im Innenbereich gering, an Rand und Ecken ein Vielfaches", "Ballastplan nach ÖNORM B 1991-1-4, oft mit Windkanalgutachten des Systems"],
            ["Schnee", "am Standort laut eHORA, z. B. Linz 0,6 kN/m², Salzburg 1,6 kN/m², Kitzbühel 4,2 kN/m² (Beispielwerte)", "ÖNORM B 1991-1-3:2022, Formbeiwert und Schneesäcke"],
            ["Wind", "Sog an Rand und Ecken maßgebend, Druck im Feld", "ÖNORM B 1991-1-4, Basiswindgeschwindigkeit laut HORA"],
          ],
          minBreite: 680,
          fussnote: "Typische ballastierte Systeme erzeugen zusammen etwa 15 bis 30 kg/m² Zusatzlast auf der belegten Fläche, in Rand- und Eckzonen mehr. 1 kN/m² ≈ 102 kg/m². Richtwerte, kein Ersatz für die Statik.",
        },
        {
          typ: "p",
          text: "Zwischen aufgeständerten Modulreihen bilden sich im Winter Schneeverwehungen, die lokal deutlich höhere Lasten erzeugen als die gleichmäßige Schneelast. An Attiken und Höhensprüngen gilt das ebenso. Welche Schneelast Ihr Standort hat und wie sie aufs Dach umgerechnet wird, erklärt der Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik); die Werte für Ihre Adresse zeigt der [Standort-Check](/standort-check).",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Ballastiert", text: "Keine Durchdringung der Abdichtung, schnelle Montage, rückbaubar. Braucht Tragreserve und reibungssichere Auflage; an Rand und Ecken oft zusätzliche Sicherung." },
            { titel: "Mechanisch befestigt", text: "Geringe Zusatzlast, auch auf leichten Dächern möglich. Jede Befestigung ist eine Durchdringung, die dauerhaft dicht sein muss – Ausführung mit dem Dachdecker abstimmen." },
          ],
        },
      ],
    },
    {
      id: "brandschutz",
      titel: "Brandschutz, Blitzschutz und Wartungswege",
      tocLabel: "Brand- & Blitzschutz",
      bloecke: [
        {
          typ: "p",
          text: "**Große Flachdachanlagen auf Gewerbehallen müssen den Brandschutz des Gebäudes respektieren: Brandwände, Rauch- und Wärmeabzugsanlagen und Zugänge für die Feuerwehr dürfen nicht überbaut werden.** Die OVE-Richtlinie R 11-1 regelt, wie PV-Anlagen brandschutztechnisch ausgeführt, gekennzeichnet und abgeschaltet werden; Versicherer und Behörden verlangen zunehmend die Einhaltung.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Abstände zu Brandwänden und über Brandabschnitte hinweg einhalten; Leitungen nicht ungeschützt über Brandwände führen.",
            "Lichtkuppeln und Rauchabzüge freihalten – sie sind oft Teil des Brandschutzkonzepts und verschatten zudem Module.",
            "Feuerwehrpläne um die PV-Anlage ergänzen, Freischaltstellen kennzeichnen.",
            "Blitzschutz nach ÖVE/ÖNORM EN 62305: Trennungsabstand zu Fangeinrichtungen einhalten oder die Anlage in den Blitzschutz einbinden; Überspannungsschutz im DC- und AC-Kreis.",
            "Wartungsgassen, Absturzsicherung und sichere Zugänge für Reinigung und Prüfung einplanen.",
          ],
        },
        {
          typ: "p",
          text: "Die Details zu OVE R 11-1, Feuerwehr und Versicherungsauflagen erklärt der Ratgeber [Photovoltaik und Brandschutz](/ratgeber/photovoltaik-brandschutz). Für wiederkehrende Prüfungen und Dokumentation nach ÖVE/ÖNORM EN 62446 bieten wir den [E-Check](/service/e-check) an.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Praxisbeispiel: 500 kWp auf einer Halle im Innviertel",
      tocLabel: "Beispiel 500 kWp",
      bloecke: [
        {
          typ: "p",
          text: "**Eine Produktionshalle mit 5.000 m² Trapezblechdach im Innviertel soll eine PV-Anlage mit rund 500 kWp erhalten – ein typisches Projekt für einen mittelständischen Betrieb.** Die Werte sind ein Modell zur Orientierung.",
        },
        {
          typ: "tabelle",
          caption: "Modellprojekt Hallendach, Ost-West 10°, Stand 09/2026",
          kopf: ["Position", "Wert"],
          zeilen: [
            ["Nutzbare Dachfläche nach Randzonen, Lichtbändern, Wegen", "ca. 3.300 m²"],
            ["Installierte Leistung (Ost-West, ca. 150 kWp/1.000 m²)", "ca. 500 kWp"],
            ["Spezifischer Ertrag (PVGIS, Salzburg/Linz als Spanne)", "ca. 905–950 kWh/kWp"],
            ["Jahresertrag", "ca. 450–475 MWh"],
            ["Zusätzliche Dachlast (inkl. Ballast, gemittelt)", "ca. 15–20 kg/m² belegte Fläche"],
            ["Schneelast am Standort (eHORA, Beispiel Ostermiething)", "0,7 kN/m²"],
            ["Netzanschluss", "Typ B nach TOR (ab 250 kW), meist Mittelspannung mit Parkregler"],
          ],
          fussnote: "Modellannahmen; Belegung, Lasten und Ertrag hängen vom konkreten Gebäude ab. Schneelast: eHORA-Beispielwert für das Ortszentrum Ostermiething.",
        },
        {
          typ: "p",
          text: "Bei 500 kWp liegt die Anlage deutlich über der Grenze von 250 kW, ab der die TOR Stromerzeugungsanlagen Typ B gelten. Netzbetreiber verlangen dann in der Regel eine zentrale Regelung für Wirk- und Blindleistung – Ökovolt setzt dafür einen eigenen [Parkregler](/technik/parkregler) ein. Wie der Überschuss einer solchen Anlage vermarktet wird, zeigt der Ratgeber [Reststromvermarktung](/ratgeber/reststromvermarktung).",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Ablauf: Vom Dach-Check bis zur Inbetriebnahme",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Dach-Check", "Pläne, Bestandsstatik, Dachaufbau und Zustand der Abdichtung erheben; Aufbauten, Lichtbänder und Brandabschnitte aufnehmen."],
            ["Lasten und Standort", "Schnee- und Windlast für die Adresse aus eHORA, Tragreserve durch Statik prüfen lassen."],
            ["System und Belegung", "Süd oder Ost-West, Ballast oder Befestigung, Wartungswege und Brandschutzabstände festlegen."],
            ["Netz und Genehmigung", "Netzanfrage, TOR-Typ, Anzeige oder Bewilligung nach Landesrecht – siehe [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung)."],
            ["Montage", "Schutzlagen, Ballastplan und Befestigungen exakt nach Statik; Dachdecker bei Durchdringungen einbinden."],
            ["Inbetriebnahme und Betrieb", "Erstprüfung, Dokumentation, Monitoring, Wartung und regelmäßige Sichtkontrolle nach Stürmen und Schneefällen."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie viel Gewicht bringt eine PV-Anlage auf das Flachdach?",
      a: "Module und Unterkonstruktion wiegen rund 13 bis 18 kg/m². Mit Ballast ergeben sich typischerweise 15 bis 30 kg/m² auf der belegten Fläche, an Rand und Ecken mehr. Mechanisch befestigte Systeme bleiben leichter, brauchen aber Durchdringungen der Dachhaut.",
    },
    {
      q: "Ist Ost-West oder Süd auf dem Flachdach besser?",
      a: "Süd liefert mehr je kWp (Linz 1.040 kWh), Ost-West mehr je Quadratmeter Dach, weil kein Reihenabstand nötig ist. Bei knapper Fläche und hoher Tagesabnahme im Betrieb ist Ost-West meist wirtschaftlicher.",
    },
    {
      q: "Kann ich PV auf ein Trapezblechdach montieren?",
      a: "Ja, meist mit Kurzschienen direkt auf den Hochsicken. Voraussetzung sind ausreichende Blechdicke, Tragreserve der Pfetten und Befestigungsmittel mit Nachweis. Ballast ist auf Trapezblech wegen der geringen Tragreserve selten die erste Wahl.",
    },
    {
      q: "Brauche ich für das Hallendach einen Statiker?",
      a: "In aller Regel ja. Hallendächer sind oft knapp bemessen, dazu kommen Schneesäcke zwischen Modulreihen und Windsog an Rand und Ecken. Ein statischer Nachweis schützt vor Schäden und ist häufig Voraussetzung für Genehmigung, Förderung und Versicherung.",
    },
    {
      q: "Welche Neigung ist auf dem Flachdach sinnvoll?",
      a: "Meist 10 bis 15°. Steilere Aufständerung bringt je kWp etwas mehr, erfordert aber größere Reihenabstände und erhöht die Windlast. In schneereichen Lagen hilft eine etwas steilere Neigung, damit Schnee abrutscht.",
    },
    {
      q: "Beschädigt eine PV-Anlage die Dachabdichtung?",
      a: "Nicht, wenn sie fachgerecht geplant wird: Schutzlagen unter Ballastsystemen, verträgliche Materialien und dichte, vom Dachdecker ausgeführte Durchdringungen. Wichtig ist, dass die Abdichtung die Lebensdauer der Anlage von 25 bis 30 Jahren erreicht.",
    },
  ],

  passend: [
    { href: "/gewerbe", titel: "PV für Gewerbe & Industrie", text: "Planung nach Lastgang, Hallen- und Flachdächer." },
    { href: "/ratgeber/photovoltaik-ost-west", titel: "Photovoltaik Ost-West", text: "Ertrag, Tagesprofil und Netzanschluss." },
    { href: "/ratgeber/schneelast-photovoltaik", titel: "Schneelast und Photovoltaik", text: "ÖNORM B 1991-1-3 und eHORA." },
    { href: "/standort-check", titel: "Standort-Check", text: "Schneelast, Wind, Hagel und Ertrag." },
  ],

  quellen: [
    { titel: "EU JRC – PVGIS 5.3 (Erträge Süd 10° und Ost-West 10°)", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "HORA – Schneelast (ÖNORM B 1991-1-3:2022) und Basiswindgeschwindigkeit (ÖNORM B 1991-1-4)", url: "https://hora.gv.at/", stand: "09/2026" },
    { titel: "Holzbau Austria – Neue Schneelastnorm veröffentlicht", url: "https://www.holzbauaustria.at/technik/2022/07/neue-schneelastnorm-veroeffentlicht.html", stand: "09/2026" },
    { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A–D (Version 1.4)", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "09/2026" },
    { titel: "OVE – Richtlinie R 11-1: Brandschutz bei Photovoltaikanlagen", url: "https://www.ove.at/", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Photovoltaics Report (Modulwirkungsgrade, Juli 2026)", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/photovoltaics-report.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Hallendach prüfen lassen?", text: "Statik, Belegung und Ertrag für Ihr Flachdach.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Ihr Hallendach als Kraftwerk – statisch sicher geplant.",
    text: "Wir prüfen Dachaufbau, Tragreserve und Brandschutz, wählen das passende System und bauen die Anlage mit Netzanschluss und Parkregler aus einer Hand.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Gewerbe & Industrie", href: "/gewerbe" },
  },
};

export default artikel;
