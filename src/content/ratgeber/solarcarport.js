// Ratgeber: Solarcarport für Gewerbe, Handel, Hotellerie und Gemeinden (Österreich)
// Quellen: OVE-Richtlinien (R 2000-7-7N90:2022 Garagen, überdachte Stellplätze, Parkdecks; R 11-1:2022
// Feuerwehr; R 11-3 „Blendung“ 2024 zurückgezogen – Blendung im Einzelfall bewerten), TOR Verteilernetzanschluss NS
// V1.3.1 (Ladeeinrichtungen), OeMAG („Welche PV-Anlage habe ich?“: Zu-/Abschläge bei besonderen Anbringungsarten),
// HORA (Naturgefahren/Schnee), ÖNORM B 1991-1-3 / -1-4 (Schnee, Wind). Keine Kostenzusagen; Beispielrechnung
// mit offengelegten Annahmen.

const STELLPLAETZE = 40;
const KWP_JE_PLATZ = 2.5; // kWp je Stellplatz, Annahme (ca. 12,5 m² Dachfläche je Platz)
const KWP = STELLPLAETZE * KWP_JE_PLATZ;
const ERTRAG = KWP * 1000; // kWh/Jahr, Annahme 1.000 kWh/kWp
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";

const artikel = {
  slug: "solarcarport",
  title: "Solarcarport für Betriebe und Gemeinden: Planung, Recht, Laden",
  seoTitle: "Solarcarport Gewerbe & Gemeinde Österreich | Ökovolt",
  kurzTitel: "Solarcarport",
  description:
    "Solarcarport für Kundenparkplatz, Betrieb und Gemeinde: Baurecht der Länder, Statik nach ÖNORM, Brandschutz, Ladeinfrastruktur, Förderung und Wirtschaftlichkeit.",
  excerpt:
    "Parkplätze sind die größten ungenutzten Flächen vieler Betriebe und Gemeinden. Wie Solarcarports geplant, genehmigt und mit Ladepunkten kombiniert werden – mit Statik, Brandschutz und Rechenbeispiel für 40 Stellplätze.",
  hauptKeyword: "solarcarport gewerbe",
  keywords: [
    "Solarcarport Gewerbe",
    "PV-Carport Parkplatz",
    "Solarcarport Österreich",
    "Photovoltaik Parkplatzüberdachung",
    "Solarcarport Gemeinde",
    "Solarcarport Ladestation",
    "Carport Photovoltaik Genehmigung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "E-Mobilität & Sektorkopplung",
  bild: "/Images/Ratgeber/solarcarport.jpg",
  bildAlt: "Parkplatzüberdachung mit Photovoltaikmodulen über Stellplätzen",
  badge: { wert: `${KWP} kWp`, text: `auf ${STELLPLAETZE} Stellplätzen – rund ${kwh(ERTRAG)} Solarstrom im Jahr (Beispiel)` },

  kurzFazit: [
    `**Ein Solarcarport macht aus Parkflächen ein Kraftwerk: Auf ${STELLPLAETZE} Stellplätzen lassen sich in unserem Beispiel rund ${KWP} kWp installieren, die etwa ${kwh(ERTRAG)} Strom im Jahr erzeugen.** Zusätzlich schützt die Überdachung Fahrzeuge vor Hagel, Schnee und Sonne.`,
    "**Rechtlich ist ein Solarcarport ein Bauwerk:** Ob Anzeige oder Baubewilligung nötig ist, regeln die Bauordnungen der neun Bundesländer – dazu kommen Stellplatzvorgaben, Abstände und Ortsbildschutz.",
    "**Statik ist der Kostentreiber:** Schneelasten nach ÖNORM B 1991-1-3 und Windlasten nach ÖNORM B 1991-1-4 bestimmen Stützen, Fundamente und Unterkonstruktion – in alpinen Lagen deutlich mehr als im Flachland.",
    "**Carport und Ladepunkte gehören zusammen geplant:** Leerrohre, Anschlussleistung und Lastmanagement kosten beim Bau wenig, nachträglich viel. Für Ladeeinrichtungen gelten die TOR des Netzbetreibers und für die Elektroinstallation in überdachten Stellplätzen die OVE-Richtlinie R 2000-7-7N90.",
  ],

  abschnitte: [
    {
      id: "warum",
      titel: "Warum ein Solarcarport für Betriebe und Gemeinden?",
      tocLabel: "Warum Solarcarport?",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Solarcarport nutzt versiegelte Fläche doppelt – als Parkplatz und als PV-Kraftwerk – und liefert Strom genau dort, wo Elektrofahrzeuge laden.** Für Handel, Hotellerie, Betriebe mit Mitarbeiterparkplatz und Gemeinden ist das oft die einzige Möglichkeit, zusätzliche PV-Leistung zu errichten, wenn Dächer statisch nicht geeignet oder bereits belegt sind.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Handel & Kundenparkplatz", text: "Schattige Stellplätze im Sommer, Ladepunkte als Service, sichtbares Nachhaltigkeitsprofil. Solarstrom deckt Kühlung und Beleuchtung im Markt." },
            { titel: "Betrieb & Mitarbeiterparkplatz", text: "Dienstwagen und private E-Autos laden tagsüber mit Überschuss; Laden am Arbeitsplatz ist für Mitarbeitende kein Sachbezug." },
            { titel: "Hotellerie & Tourismus", text: "Gäste laden über Nacht, Fahrzeuge sind vor Hagel und Schnee geschützt – ein Argument in alpinen Lagen. Mehr unter [Hotellerie & Tourismus](/hotellerie-tourismus)." },
            { titel: "Gemeinden", text: "Parkplätze bei Gemeindeamt, Schule, Freibad oder Bahnhof: Strom für Gemeindegebäude oder eine Energiegemeinschaft. Mehr unter [Gemeinden](/kommunen)." },
          ],
        },
      ],
    },
    {
      id: "recht",
      titel: "Brauche ich eine Baubewilligung für einen Solarcarport?",
      tocLabel: "Baurecht",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Solarcarport ist ein bauliche Anlage und fällt unter die Bauordnung des jeweiligen Bundeslands – je nach Größe, Lage und Widmung genügt eine Bauanzeige oder es ist eine Baubewilligung erforderlich.** Gewerbliche Parkplatzüberdachungen mit vielen Stellplätzen sind in der Regel bewilligungspflichtig. Hinzu kommen je nach Standort Vorgaben aus Flächenwidmung, Bebauungsplan, Ortsbildschutz und gegebenenfalls Denkmalschutz.",
        },
        {
          typ: "tabelle",
          caption: "Rechtliche Themen beim Solarcarport (Überblick)",
          kopf: ["Thema", "Worum es geht", "Wer ist zuständig?"],
          zeilen: [
            ["Bauordnung", "Anzeige oder Bewilligung, Abstände, Höhen, Stellplatzverpflichtung", "Baubehörde der Gemeinde (Bürgermeister)"],
            ["Raumordnung", "Widmung und Bebauungsplan des Grundstücks", "Gemeinde, Land"],
            ["Gewerberecht", "bei Betriebsanlagen ggf. Änderung der Betriebsanlagengenehmigung", "Bezirksverwaltungsbehörde"],
            ["Elektrotechnik", "Errichtung nach OVE E 8101, OVE R 2000-7-7N90 (überdachte Stellplätze), OVE R 11-1", "befugter Elektrotechniker"],
            ["Netzanschluss", "Anmeldung von PV und Ladepunkten nach TOR", "Netzbetreiber"],
            ["Blendung & Nachbarschaft", "Einzelfallbewertung von Reflexionen, z. B. zu Straßen und Fenstern", "Baubehörde, Gutachten bei Bedarf"],
          ],
          minBreite: 680,
          fussnote: "Überblick ohne Anspruch auf Vollständigkeit; die Regeln unterscheiden sich je Bundesland. Die OVE-Richtlinie R 11-3 zur Blendung wurde 2024 ersatzlos zurückgezogen – Blendung wird im Einzelfall bewertet. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Einige Bundesländer koppeln zudem PV-Pflichten an Neubauten oder Parkflächen – den aktuellen Stand fasst der Ratgeber [Solarpflicht nach Bundesländern](/ratgeber/solarpflicht-bundeslaender) zusammen. Wie das Genehmigungsverfahren für PV-Anlagen allgemein abläuft, erklärt [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
        },
      ],
    },
    {
      id: "statik",
      titel: "Statik: Schnee, Wind und Anprall",
      tocLabel: "Statik & Schnee",
      bloecke: [
        {
          typ: "p",
          text: "**Die Tragkonstruktion eines Solarcarports wird nach ÖNORM B 1991-1-3 für Schnee und ÖNORM B 1991-1-4 für Wind bemessen – und in Österreich entscheidet die Schneelastzone oft über Stützenraster, Profilstärken und Fundamente.** In alpinen Lagen liegen die charakteristischen Schneelasten ein Vielfaches über jenen im Flachland; Schneeverwehungen und Abrutschlasten kommen hinzu.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Schneelast** nach Standort, Seehöhe und Zone ermitteln – Grundlage ist ÖNORM B 1991-1-3; einen Überblick über Naturgefahren liefert [HORA](https://www.hora.gv.at/). Mehr im Ratgeber [Schneelast und Photovoltaik](/ratgeber/schneelast-photovoltaik).",
            "**Wind**: Sog und Druck auf die offene Konstruktion nach ÖNORM B 1991-1-4, besonders bei freistehenden Reihen.",
            "**Module**: Prüflasten des Herstellers für Schnee und Wind beachten; Glas-Glas-Module bieten Reserven und lassen Licht durch.",
            "**Anprallschutz**: Stützen gegen Fahrzeuganprall sichern (Poller, Anfahrschutz, verstärkte Fußpunkte).",
            "**Fundamente**: Bodengutachten, Leitungen im Untergrund, Frosttiefe; Einzelfundamente, Schraubfundamente oder Streifenfundamente.",
            "**Entwässerung**: Regen- und Schmelzwasser gezielt ableiten, Eisbildung auf Fahrwegen vermeiden.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Hagelschutz als Zusatznutzen",
          text: "In hagelgefährdeten Regionen schützt ein Solarcarport die Fahrzeuge – vorausgesetzt, die Module sind entsprechend hagelbeständig. Wie man Module nach Hagelwiderstand auswählt, erklärt der Ratgeber [Hagel und Photovoltaik](/ratgeber/hagel-photovoltaik).",
        },
      ],
    },
    {
      id: "brandschutz",
      titel: "Brandschutz und Elektroinstallation",
      tocLabel: "Brandschutz & Elektro",
      bloecke: [
        {
          typ: "p",
          text: "**Unter einem Solarcarport treffen Fahrzeuge, Gleichstromleitungen und Ladepunkte zusammen – deshalb sind Brandschutz, Leitungsführung und Feuerwehrzugang von Anfang an mitzuplanen.** Für die Elektroinstallation in Garagen, überdachten Stellplätzen und Parkdecks gibt es mit der OVE-Richtlinie R 2000-7-7N90 eigene Ergänzungen zur OVE E 8101; für den Schutz der Einsatzkräfte gilt die OVE-Richtlinie R 11-1.",
        },
        {
          typ: "liste",
          punkte: [
            "DC-Leitungen geschützt und möglichst kurz führen, Wechselrichter außerhalb des Fahrbereichs montieren.",
            "Kennzeichnung, Feuerwehrplan und Freischaltmöglichkeiten nach OVE R 11-1 vorsehen.",
            "Abstände zu Gebäuden und Brandabschnitten mit der Baubehörde klären.",
            "Ladepunkte und Leitungen vor mechanischer Beschädigung schützen.",
            "Beleuchtung und Videoüberwachung gleich mitplanen – Leerrohre sind günstiger als nachträgliche Grabungen.",
          ],
        },
        {
          typ: "p",
          text: "Details zu Feuerwehr, Abschaltung und Versicherungsauflagen beschreibt der Ratgeber [Brandschutz bei Photovoltaik](/ratgeber/photovoltaik-brandschutz).",
        },
      ],
    },
    {
      id: "laden",
      titel: "Ladeinfrastruktur unter dem Carport",
      tocLabel: "Ladepunkte",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Solarcarport ohne Ladeinfrastruktur verschenkt Potenzial – mit Ladepunkten und Überschussregelung fließt der Solarstrom direkt in die Fahrzeuge, die darunter stehen.** Auch wenn nicht sofort alle Stellplätze Ladepunkte bekommen: Leerrohre, Kabelwege und Anschlussleistung sollten für den Vollausbau ausgelegt sein.",
        },
        {
          typ: "tabelle",
          caption: "TOR-Regeln für Ladeeinrichtungen am Solarcarport (TOR Verteilernetzanschluss NS V1.3.1)",
          kopf: ["Regel", "Bedeutung"],
          zeilen: [
            ["Meldepflicht über 3,68 kVA", "jede übliche Wallbox bzw. Ladesäule ist dem Netzbetreiber zu melden"],
            ["Summenleistung ab 10 kVA", "Netzbetreiber kann den Anschluss zur Prüfung aussetzen – nicht, wenn ein Lastmanagement die vereinbarte Leistung einhält"],
            ["Steuerbarkeit", "offene Schnittstelle (z. B. OCPP, EEBUS), externe Leistungsbegrenzung"],
            ["Symmetrie", "Drehstromanschluss, max. 16 A Unsymmetrie je Leiter, Phasen je Ladepunkt zyklisch tauschen"],
            ["Ladeleistung über 250 kW", "Vereinbarung über Wirkleistungsvorgaben mit dem Netzbetreiber möglich"],
          ],
          minBreite: 600,
        },
        {
          typ: "p",
          text: "Wie der Überschuss auf viele Fahrzeuge verteilt wird, zeigt der Ratgeber [PV-Überschussladen](/ratgeber/pv-ueberschussladen); steuerliche Fragen für Mitarbeitende und Dienstwagen behandelt [E-Flotte laden mit Photovoltaik](/ratgeber/e-flotte-laden-photovoltaik). Ladeparks plant Ökovolt über den Bereich [Ladeinfrastruktur](/ladeinfrastruktur).",
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: `Rechenbeispiel: Solarcarport mit ${STELLPLAETZE} Stellplätzen`,
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Solarcarport ist teurer als eine Dachanlage gleicher Leistung, weil die Tragkonstruktion dazukommt – dafür liefert er zusätzlich Überdachung und Ladeplätze.** Die folgende Beispielrechnung zeigt den Wert des Solarstroms für ${STELLPLAETZE} Stellplätze mit rund ${KWP} kWp.`,
        },
        {
          typ: "tabelle",
          caption: `Wert des Solarstroms eines ${KWP}-kWp-Solarcarports pro Jahr (Beispielrechnung, Stand September 2026)`,
          kopf: ["Nutzung des Stroms", "Menge", "Bewertung", "Wert pro Jahr"],
          zeilen: [
            ["Eigenverbrauch Gebäude und Ladepunkte (60 %)", kwh(ERTRAG * 0.6), "20 ct/kWh netto (Annahme)", eur(ERTRAG * 0.6 * 0.2)],
            ["Überschusseinspeisung (40 %)", kwh(ERTRAG * 0.4), "6,8 ct/kWh (OeMAG-Sommermarktpreis 2026, gerundet)", eur(ERTRAG * 0.4 * 0.068)],
            ["Summe", kwh(ERTRAG), "", eur(ERTRAG * 0.6 * 0.2 + ERTRAG * 0.4 * 0.068)],
          ],
          hervorheben: 3,
          markierteZeile: 2,
          minBreite: 640,
          fussnote: `Annahmen: ${KWP_JE_PLATZ} kWp je Stellplatz, 1.000 kWh/kWp (flachere Neigung, teils Ost-West), 60 % Eigenverbrauch. Ohne Investitions-, Wartungs- und Finanzierungskosten, ohne Erlöse aus dem Verkauf von Ladestrom.`,
        },
        {
          typ: "p",
          text: "Ob sich das rechnet, hängt vor allem von der Investition für Unterkonstruktion und Fundamente, dem Eigenverbrauchsanteil und möglichen Erlösen aus Ladestrom ab. Für eine belastbare Aussage braucht es eine Kalkulation mit Standort, Statik und Lastgang – die Ausgangswerte zu PV-Kosten liefert der Ratgeber [Solaranlage Kosten](/ratgeber/solaranlage-kosten).",
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung für Solarcarports",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Der PV-Teil eines Solarcarports kann grundsätzlich über den EAG-Investitionszuschuss gefördert werden; für besondere Anbringungsarten sieht die OeMAG Zu- oder Abschläge vor.** Wie ein Carport im jeweiligen Fördercall eingestuft wird, ist vor dem Antrag zu prüfen. Die Bundesförderung für betriebliche Ladeinfrastruktur (eRide 2025) ist ausgeschöpft; eine Neuauflage ist angekündigt.",
        },
        {
          typ: "liste",
          punkte: [
            "EAG-Investitionszuschuss: Fördercalls, Kategorien und Fristen im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss).",
            "Landesförderungen für PV und Ladeinfrastruktur: [Landesförderungen](/forderungen/landesforderungen).",
            "Steuerlich: Abschreibung und gegebenenfalls Investitionsfreibetrag – mit der Steuerberatung klären.",
            "Aktueller Überblick für Ihr Projekt: [Förder-Check](/foerdercheck).",
          ],
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Ablauf: Vom Parkplatz zum Solarcarport",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Standort und Bedarf klären", "Stellplätze, Fahrzeugtypen (Pkw, Transporter, Busse), Ladebedarf, Lastgang, Anschlussleistung."],
            ["Vorentwurf und Statik", "Stützenraster, Höhe, Modulbelegung, Schnee- und Windlasten, Fundamente, Entwässerung."],
            ["Behörden und Netz", "Bauanzeige oder Bewilligung, ggf. Betriebsanlagenrecht, Netzanfrage für PV und Ladepunkte."],
            ["Förderung", "Förderfähigkeit prüfen und Antrag rechtzeitig vor Bestellung stellen."],
            ["Errichtung", "Fundamente, Tragwerk, Module, Elektroinstallation, Ladepunkte, Beleuchtung."],
            ["Inbetriebnahme", "Erstprüfung mit Prüfbefund, Fertigstellungsmeldung, Einweisung, Monitoring."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Braucht ein Solarcarport eine Baubewilligung?",
      a: "Das regelt die Bauordnung des jeweiligen Bundeslands. Kleine Carports sind teils nur anzeigepflichtig, gewerbliche Parkplatzüberdachungen mit vielen Stellplätzen in der Regel bewilligungspflichtig. Klären Sie das früh mit der Baubehörde der Gemeinde.",
    },
    {
      q: "Wie viel PV-Leistung passt auf einen Stellplatz?",
      a: `Je nach Stellplatzgröße und Modul etwa 2 bis 3 kWp. In unserem Beispiel rechnen wir mit ${String(KWP_JE_PLATZ).replace(".", ",")} kWp je Stellplatz, also rund ${KWP} kWp für ${STELLPLAETZE} Stellplätze.`,
    },
    {
      q: "Was kostet ein Solarcarport?",
      a: "Mehr als eine Dachanlage gleicher Leistung, weil Tragwerk und Fundamente dazukommen. Kostentreiber sind Schneelastzone, Spannweiten, Bodenverhältnisse und Ladeinfrastruktur. Eine belastbare Zahl liefert nur eine standortbezogene Planung.",
    },
    {
      q: "Welche Normen gelten für die Statik?",
      a: "Die Schneelast wird nach ÖNORM B 1991-1-3, die Windlast nach ÖNORM B 1991-1-4 bemessen. Zusätzlich sind die Prüflasten der Module, Anprallschutz und Fundamentierung zu berücksichtigen.",
    },
    {
      q: "Kann ich unter dem Carport E-Autos mit Solarstrom laden?",
      a: "Ja, das ist der ideale Anwendungsfall. Ladepunkte über 3,68 kVA sind beim Netzbetreiber zu melden, bei mehreren Ladepunkten braucht es ein Lastmanagement mit PV-Überschussregelung.",
    },
    {
      q: "Wird ein Solarcarport gefördert?",
      a: "Der PV-Teil kann grundsätzlich über den EAG-Investitionszuschuss gefördert werden; wie Carports im jeweiligen Call eingestuft werden, ist vorab zu prüfen. Dazu kommen je nach Bundesland Landesförderungen.",
    },
  ],

  passend: [
    { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur", text: "Ladeparks mit Lastmanagement." },
    { href: "/ratgeber/schneelast-photovoltaik", titel: "Schneelast und PV", text: "ÖNORM B 1991-1-3 und Zonen." },
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "PV-Genehmigung", text: "Bauordnungen der Länder." },
    { href: "/ratgeber/pv-ueberschussladen", titel: "PV-Überschussladen", text: "Solarstrom direkt ins Auto." },
  ],

  quellen: [
    { titel: "OVE – Richtlinien (R 2000-7-7N90 Garagen und überdachte Stellplätze, R 11-1 Feuerwehr, R 11-3 zurückgezogen)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
    { titel: "E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1", url: "https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985", stand: "03/2026" },
    { titel: "OeMAG – Welche PV-Anlage habe ich? (Anbringungsarten, Zu- und Abschläge)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/PVInvestitionzuschuesse/Welche_PV-Anlage_habe_ich.pdf", stand: "09/2026" },
    { titel: "OeMAG – Marktpreise 2026", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "HORA – Natural Hazard Overview & Risk Assessment Austria", url: "https://www.hora.gv.at/", stand: "09/2026" },
    { titel: "Umweltförderung (KPC) – E-Ladeinfrastruktur für Betriebe 2025 (eRide, Status)", url: "https://www.umweltfoerderung.at/betriebe/e-ladeinfrastruktur-betriebe-2025-eride", stand: "09/2026" },
  ],

  seitenCta: { titel: "Parkplatz mit Potenzial?", text: "Solarcarport mit Ladepunkten planen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Aus Parkplätzen werden Kraftwerke – mit Ladepunkten darunter.",
    text: "Ökovolt plant Solarcarports mit Statik, Netzanschluss und Ladeinfrastruktur für Handel, Betriebe, Hotels und Gemeinden in ganz Österreich.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Ladeinfrastruktur", href: "/ladeinfrastruktur" },
  },
};

export default artikel;
