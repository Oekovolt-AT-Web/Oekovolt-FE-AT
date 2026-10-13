// Ratgeber (AT): Peer-to-Peer – Strom teilen nach ElWG: Unterschied zu EEG, BEG und GEA, Fristen,
// Lieferantenpflichten, Netzentgelte, Ablauf.
// Recherchestand 11.10.2026: ElWG BGBl. I Nr. 91/2025 (§ 6 Z 123/124/152, § 54, § 65, § 75a, § 188 Abs. 3,
// § 189 Abs. 17 – RIS-Ausdruck, konsolidierte Fassung 07.01.2026), RIS § 68 ElWG (Bundesrecht konsolidiert),
// Koordinationsstelle für Energiegemeinschaften (FAQs zum ElWG: Fristen 01.10./05.10.2026, April 2027,
// § 69 Schwellen 30/100 kW, § 70 Nahebereich, Verordnung E-Control), OeMAG-Marktpreis (Monatswerte 2026),
// E-Control SNE-G-V-Entwurf. Keine Imports – alle Werte hier definiert.

// OeMAG-Marktpreis PV 2026, ct/kWh netto (oem-ag.at/marktpreis, abgerufen 30.09.2026)
const OEMAG_2026 = { Jänner: 8.842, Februar: 8.457, März: 5.72, April: 6.772, Mai: 6.772, Juni: 6.772, Juli: 6.146, August: 8.997 };
const OEMAG_MITTEL_2026 = Object.values(OEMAG_2026).reduce((a, b) => a + b, 0) / Object.values(OEMAG_2026).length; // ≈ 7,31

// Rechenbeispiel: Tischlerei mit 60 kWp, Nachbarbetrieb als Abnehmer (Annahmen offengelegt)
const BSP = { ueberschuss: 30000, gleichzeitigkeit: 0.6, p2p: 10, energiepreis: 14 };
const BSP_GETEILT = BSP.ueberschuss * BSP.gleichzeitigkeit; // 18.000 kWh
const BSP_OEMAG = 7.3; // gerundetes Mittel Jänner–August 2026
const BSP_MEHRERLOES = (BSP_GETEILT * (BSP.p2p - BSP_OEMAG)) / 100; // 486 €
const BSP_ERSPARNIS = (BSP_GETEILT * (BSP.energiepreis - BSP.p2p)) / 100; // 720 €

const n = (x) => Math.round(x).toLocaleString("de-DE");
const z1 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const z2 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const artikel = {
  slug: "peer-to-peer-strom-teilen",
  title: "Peer-to-Peer: Strom teilen ohne Verein – Regeln, Fristen, Erlös",
  seoTitle: "Peer-to-Peer Strom teilen Österreich | Ökovolt",
  kurzTitel: "Peer-to-Peer Strom teilen",
  description:
    "Peer-to-Peer-Strom nach ElWG: Unterschied zu EEG, BEG und GEA, Start 1.10.2026, netzübergreifend ab April 2027, Lieferantenpflichten ab 30/100 kW, Erlös.",
  excerpt:
    "Seit 1. Oktober 2026 dürfen Betriebe, Höfe, Gemeinden und Haushalte PV-Strom per Vertrag direkt an andere verkaufen – ohne Verein. Was Peer-to-Peer von EEG, BEG und GEA unterscheidet, welche Fristen gelten, wann Lieferantenpflichten greifen und was der Strom wert ist.",
  hauptKeyword: "peer-to-peer strom",
  keywords: [
    "Peer-to-Peer Strom Österreich",
    "Peer-to-Peer-Vertrag ElWG",
    "Strom an Nachbarn verkaufen",
    "gemeinsame Energienutzung ElWG",
    "Unterschied Energiegemeinschaft Peer-to-Peer",
    "Lieferantenpflichten 30 kW 100 kW",
    "Netzentgelt Nahebereich 2027",
  ],
  veroeffentlicht: "2026-10-11",
  aktualisiert: "2026-10-11",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/ratgeber/smart-meter-pflicht.jpg",
  bildAlt: "Digitaler Stromzähler (Smart Meter) mit Display – Voraussetzung für Peer-to-Peer-Verträge",
  badge: { wert: "1.10.2026", text: "Peer-to-Peer nach §§ 65–72 ElWG in Kraft" },

  kurzFazit: [
    "**Ein Peer-to-Peer-Vertrag ist nach § 6 Z 124 ElWG der Verkauf oder die Schenkung von erneuerbarem Strom zwischen Marktteilnehmern auf Basis eines Vertrags mit vorab festgelegten Bedingungen für die automatische Abwicklung und Abrechnung** – direkt oder über einen Dritten wie einen Aggregator. Anders als EEG und BEG braucht er keine eigene Rechtsperson.",
    "**Die Bestimmungen zur gemeinsamen Energienutzung (§ 65 Abs. 1 Z 6 und Abs. 2, §§ 66–72 ElWG) sind am 1. Oktober 2026 in Kraft getreten** (§ 188 Abs. 3). Laut Koordinationsstelle sind neue Modelle ab 5. Oktober 2026 zunächst nur mit Zählpunkten beim selben Netzbetreiber umsetzbar, netzübergreifend voraussichtlich ab April 2027.",
    "**Lieferantenpflichten nach § 69 ElWG treffen laut Koordinationsstelle Haushaltskunden mit Erzeugungsanlagen über 30 kW und sonstige aktive Kunden, EEG und BEG über 100 kW** – Allgemeine Lieferbedingungen, Informationsblatt, Änderungsmitteilung einen Monat vorab, transparente Rechnung, Wahlrecht zwischen monatlicher und jährlicher Abrechnung.",
    `**Reduzierte Netzentgelte für Peer-to-Peer im Nahebereich gibt es erst nach der Verordnung der E-Control (§ 70 ElWG)** – voraussichtlich mit der novellierten Systemnutzungsentgelte-Verordnung ab 1. Jänner 2027. Bis dahin profitieren nur Mitglieder lokaler und regionaler EEG. Der Vergleichswert für den Erzeuger ist der OeMAG-Marktpreis: im Mittel Jänner bis August 2026 rund ${z1(OEMAG_MITTEL_2026)} ct/kWh.`,
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist ein Peer-to-Peer-Stromvertrag nach dem ElWG?",
      tocLabel: "Definition",
      bloecke: [
        {
          typ: "p",
          text: "**Peer-to-Peer bedeutet: Zwei oder mehr Marktteilnehmer vereinbaren per Vertrag, dass erneuerbarer Strom des einen direkt an den anderen verkauft oder verschenkt wird – mit vorab festgelegten Bedingungen, die eine automatische Abwicklung und Abrechnung erlauben.** So definiert es § 6 Z 124 des [Elektrizitätswirtschaftsgesetzes (ElWG)](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz). Die Abwicklung kann direkt zwischen den Beteiligten laufen oder indirekt über einen dritten Marktteilnehmer, etwa einen Aggregator. Die Rechte und Pflichten der Beteiligten als Endkunden, Erzeuger, Lieferanten oder Aggregatoren bleiben davon unberührt.",
        },
        {
          typ: "p",
          text: "Das ElWG ordnet Peer-to-Peer der „gemeinsamen Energienutzung“ zu – dem Sammelbegriff für Energiegemeinschaften, [gemeinschaftliche Erzeugungsanlagen](/ratgeber/gemeinschaftliche-erzeugungsanlage), Eigenversorgungsanlagen an mehreren Standorten und eben Verträge zwischen einzelnen Personen. § 68 ElWG stellt klar: Jeder aktive Kunde darf zusätzlich zu seinem bestehenden Liefervertrag an der gemeinsamen Energienutzung teilnehmen, und zwar zwischen Netzbenutzern, die Mitglieder oder Gesellschafter derselben juristischen Person sind, oder zwischen Vertragspartnern – das sind die Peer-to-Peer-Verträge. Strom von Dritten, die nicht teilnehmen, zählt nicht dazu.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Zusätzlich zum Liefervertrag",
          text: "Ein P2P-Vertrag ersetzt den Stromlieferanten nicht. Der Abnehmer behält seinen Liefervertrag für den Reststrom; der Erzeuger behält seinen Abnahmevertrag (OeMAG oder Stromhändler) für den Überschuss, der nicht zeitgleich beim Partner verbraucht wird. Netzbetreiber und Lieferant sehen beide Mengen über die Viertelstundenwerte der [Smart Meter](/wissen/lexikon#smart-meter).",
        },
        { typ: "h3", text: "Der Organisator" },
        {
          typ: "p",
          text: "Neu ist die Rolle des Organisators (§ 6 Z 123, § 68 Abs. 2 ElWG): eine natürliche oder juristische Person, die per Vertrag oder Vollmacht die Kommunikation mit Netzbetreibern und anderen Marktteilnehmern übernimmt, Verträge abschließt und die Abrechnung mit den teilnehmenden Kunden erledigt. Laut Koordinationsstelle für Energiegemeinschaften kann der Organisator auch die Auswahl eines gemeinsamen Lieferanten übernehmen – die freie Lieferantenwahl jedes Teilnehmers bleibt aber erhalten. Für kleine Verträge zwischen zwei Betrieben ist kein Organisator nötig; sobald mehrere Abnehmer oder ein Dienstleister beteiligt sind, bündelt er die Arbeit.",
        },
      ],
    },
    {
      id: "unterschied",
      titel: "Worin unterscheidet sich Peer-to-Peer von EEG, BEG und GEA?",
      tocLabel: "P2P vs. EEG/BEG/GEA",
      bloecke: [
        {
          typ: "p",
          text: "**Der wichtigste Unterschied: Peer-to-Peer braucht keine eigene Rechtsperson.** Eine [Erneuerbare-Energie-Gemeinschaft (EEG)](/wissen/lexikon#eeg) und eine [Bürgerenergiegemeinschaft (BEG)](/wissen/lexikon#beg) sind Verein, Genossenschaft oder Gesellschaft mit Statuten, Mitgliedern und Organen. Die [gemeinschaftliche Erzeugungsanlage (GEA)](/wissen/lexikon#gea) ist an ein Gebäude bzw. einen Hausanschluss gebunden. Peer-to-Peer ist ein Vertrag – zwischen zwei Nachbarbetrieben, zwischen Hof und Ferienhaus, innerhalb einer Firmengruppe oder zwischen Gemeinde und Vereinsheim.",
        },
        {
          typ: "tabelle",
          caption: "Modelle der gemeinsamen Energienutzung nach ElWG im Vergleich, Stand Oktober 2026",
          kopf: ["Merkmal", "Peer-to-Peer", "EEG", "BEG", "GEA"],
          zeilen: [
            ["Rechtsform", "Vertrag, keine eigene Rechtsperson", "Verein, Genossenschaft o. Ä.", "Verein, Genossenschaft o. Ä.", "keine (Vereinbarung am Gebäude)"],
            ["Teilnehmer", "mindestens zwei Vertragspartner", "mindestens zwei Mitglieder", "mindestens zwei Mitglieder", "Netzbenutzer am selben Hausanschluss"],
            ["Energiequelle", "erneuerbar", "erneuerbar, im Nahebereich", "beliebig, österreichweit", "erneuerbar, im Standortbereich"],
            ["Reichweite", "Nahebereich bis österreichweit", "Lokal- oder Regionalbereich", "österreichweit", "Standortbereich (Sammelschiene)"],
            ["Große Unternehmen", "ja, bis 6 MW", "nein", "ja (bis 6 MW)", "nein"],
            ["Netzentgelt-Vorteil", "erst nach Verordnung (Nahebereich)", "2026: −57 % lokal, −28/−64 % regional", "erst nach Verordnung", "kein öffentliches Netz genutzt"],
            ["Elektrizitätsabgabe/Förderbeitrag", "fallen an", "entfallen (§ 75 Abs. 5 EAG)", "fallen an", "Abgabe entfällt (§ 2 Abs. 1 Z 4 ElAbgG)"],
            ["Lieferantenpflichten", "über 30 kW (Haushalt) bzw. 100 kW", "über 100 kW", "über 100 kW", "über 30/100 kW je Betreiber"],
          ],
          minBreite: 860,
          fussnote: "Eigene Zusammenstellung nach ElWG (§§ 65–72), EAG (§ 75 Abs. 5, § 79 Abs. 2) und den FAQs der Koordinationsstelle für Energiegemeinschaften (abgerufen 11.10.2026). Netzentgelt-Prozentsätze 2026 laut SNE-V 2018 § 5 Abs. 1a. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Für Betriebe ist die Spalte „Große Unternehmen“ entscheidend: Wer über 250 Beschäftigte und mehr als 50 Mio. € Umsatz bzw. 43 Mio. € Bilanzsumme hat, darf keiner EEG beitreten, aber Peer-to-Peer-Verträge in jedem Nahebereich oder österreichweit abschließen – bis 6 MW, innerhalb der Gebotszone (§ 68 ElWG, Koordinationsstelle). Für Gemeinden, Handwerksbetriebe und Höfe bleibt die [Energiegemeinschaft](/ratgeber/energiegemeinschaft-gruenden) wegen des Entfalls von Elektrizitätsabgabe und Förderbeitrag und der schon heute reduzierten Netzentgelte oft die wirtschaftlich stärkere Form – Peer-to-Peer ist der schnellere Weg ohne Gründung.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "P2P passt, wenn …", text: "zwei bis wenige Partner Strom teilen wollen, keine Vereinsgründung infrage kommt oder ein großes Unternehmen beteiligt ist." },
            { titel: "EEG passt, wenn …", text: "Gemeinde, Betriebe und Haushalte im selben Netzgebiet dauerhaft zusammenarbeiten und Abgabenbefreiung plus Netzentgelt-Reduktion nutzen wollen." },
            { titel: "GEA passt, wenn …", text: "der Strom im selben Gebäude bzw. an derselben Sammelschiene verteilt wird – klassisch im Mehrparteienhaus oder Gewerbeobjekt." },
          ],
        },
      ],
    },
    {
      id: "fristen",
      titel: "Welche Fristen gelten: 1. Oktober 2026, 5. Oktober 2026, April 2027?",
      tocLabel: "Fristen",
      bloecke: [
        {
          typ: "p",
          text: "**Die §§ 66 bis 72 ElWG sowie § 65 Abs. 1 Z 6 und Abs. 2 sind nach § 188 Abs. 3 ElWG mit 1. Oktober 2026 in Kraft getreten.** Bis dahin galten die alten Regeln des ElWOG 2010 (§§ 16a–16e), die mit 30. September 2026 außer Kraft traten. Bestehende gemeinschaftliche Erzeugungsanlagen und Energiegemeinschaften werden nach § 189 Abs. 17 ohne Zutun der Teilnehmer in die neuen Bestimmungen übergeführt.",
        },
        {
          typ: "tabelle",
          caption: "Zeitplan für Peer-to-Peer und gemeinsame Energienutzung in Österreich",
          kopf: ["Datum", "Was gilt", "Quelle"],
          zeilen: [
            ["24.12.2025", "ElWG in Kraft (BGBl. I Nr. 91/2025); Viertelstundenauslesung nach § 54 wird gesetzlicher Normalfall", "§ 188 Abs. 1 und 6 ElWG"],
            ["01.10.2026", "Gemeinsame Energienutzung inkl. Peer-to-Peer-Verträgen (§§ 66–72) in Kraft; ElWOG §§ 16a–16e außer Kraft", "§ 188 Abs. 3 ElWG"],
            ["05.10.2026", "Neue Modelle vorübergehend nur mit Zählpunkten beim selben Netzbetreiber umsetzbar", "Koordinationsstelle, FAQs zum ElWG"],
            ["31.12.2026", "Bis dahin reduzierte Netzentgelte nur für lokale und regionale EEG (SNE-V 2018 § 5 Abs. 1a)", "Koordinationsstelle; SNE-V"],
            ["01.01.2027 (voraussichtlich)", "Novellierte Systemnutzungsentgelte-Verordnung; Netzentgelt-Reduktion auch für BEG, Peer-to-Peer und Eigenversorgungsanlagen im Nahebereich", "Koordinationsstelle; § 188 Abs. 5 ElWG (§§ 128–133 ab 31.12.2026)"],
            ["01.01.2027", "Versorgungsinfrastrukturbeitrag für Einspeiser über 20 kW, höchstens 0,05 ct/kWh", "§ 75a ElWG"],
            ["April 2027 (voraussichtlich)", "Umsetzung über mehrere Netzgebiete bzw. österreichweit", "Koordinationsstelle, FAQs zum ElWG"],
          ],
          hervorheben: 1,
          minBreite: 760,
          fussnote: "Zeitpunkte „voraussichtlich“ laut Koordinationsstelle für Energiegemeinschaften (abgerufen 11.10.2026); die Verordnung der E-Control lag zum Prüfdatum nur als Begutachtungsentwurf vor.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Was die Frist 5. Oktober 2026 praktisch heißt",
          text: "Erzeuger und Abnehmer müssen bis voraussichtlich April 2027 am Netz desselben Verteilernetzbetreibers hängen – etwa beide bei Netz NÖ oder beide bei Salzburg Netz. Ein Vertrag zwischen einem Betrieb in Wien (Wiener Netze) und einem in Mödling (Netz NÖ) ist in dieser Übergangszeit noch nicht abwickelbar. Welcher Netzbetreiber zuständig ist, verrät die Netz- oder Stromrechnung – oder der [Smart-Meter-Hub](/smart-meter).",
        },
      ],
    },
    {
      id: "lieferantenpflichten",
      titel: "Ab wann gelten Lieferantenpflichten – 30 kW oder 100 kW?",
      tocLabel: "Lieferantenpflichten",
      bloecke: [
        {
          typ: "p",
          text: "**Wer im Rahmen der gemeinsamen Energienutzung Strom abgibt, wird ab bestimmten Anlagengrößen wie ein Lieferant behandelt.** § 69 ElWG knüpft die Pflichten an Schwellenwerte; laut Koordinationsstelle für Energiegemeinschaften betrifft das Haushaltskunden mit Erzeugungsanlagen über 30 kW sowie sonstige aktive Kunden, EEG und BEG mit Anlagen über 100 kW. Darunter bleibt es beim schlanken Vertrag.",
        },
        {
          typ: "checkliste",
          punkte: [
            "Allgemeine Lieferbedingungen für die Abgabe des Stroms",
            "Informationsblatt bei Haushalts- und Kleinunternehmenskunden",
            "Änderungen mindestens einen Monat vor Wirksamkeit mitteilen",
            "Transparente Rechnungen mit nachvollziehbaren Mengen und Preisen",
            "Wahlrecht des Abnehmers zwischen monatlicher und jährlicher Rechnung (§ 69 Abs. 1 Z 6 ElWG)",
          ],
        },
        {
          typ: "p",
          text: "Für die meisten Dachanlagen auf Einfamilienhäusern (bis 30 kWp) und viele Gewerbedächer (bis 100 kWp) greifen die Pflichten damit nicht. Eine 150-kWp-Anlage einer Tischlerei, die Strom an den Nachbarbetrieb verkauft, muss die Punkte dagegen erfüllen – spätestens dann lohnt sich ein Organisator oder ein Dienstleister, der Abrechnung und Dokumente übernimmt. Was zur Anlagengröße sonst zu beachten ist, steht im Ratgeber [PV-Anlage beim Netzbetreiber anmelden](/ratgeber/photovoltaik-anmelden).",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Keine Rechtsberatung",
          text: "Die Schwellen und Pflichten geben wir nach ElWG und Koordinationsstelle wieder. Ob Ihr Vertrag darunterfällt, hängt von Anlagenleistung, Teilnehmerkreis und Vertragsinhalt ab – das klärt eine Rechtsberatung oder die Koordinationsstelle für Energiegemeinschaften.",
        },
      ],
    },
    {
      id: "netzentgelte",
      titel: "Netzentgelte und Abgaben: Was Peer-to-Peer 2026 und ab 2027 spart",
      tocLabel: "Netzentgelte",
      bloecke: [
        {
          typ: "p",
          text: "**2026 spart ein Peer-to-Peer-Vertrag keine Netzentgelte.** Die reduzierten Netznutzungs-Arbeitspreise nach § 5 Abs. 1a SNE-V 2018 – 57 % weniger in lokalen, 28 % (Netzebene 6/7) bzw. 64 % (Netzebene 4/5) weniger in regionalen EEG – gelten bis 31. Dezember 2026 nur für Mitglieder lokaler und regionaler Erneuerbare-Energie-Gemeinschaften. § 70 ElWG sieht zwar für alle Modelle im Nahebereich reduzierte Entgelte vor, die Höhe legt aber die E-Control per Verordnung fest; laut Koordinationsstelle ist noch offen, ob sie ab 1. Oktober 2026 oder erst ab 1. Jänner 2027 gilt – wahrscheinlich mit der novellierten Systemnutzungsentgelte-Verordnung.",
        },
        {
          typ: "liste",
          punkte: [
            "**Nahebereich:** Je gemeinsamer Energienutzung gilt nur ein Nahebereich (§ 70 Abs. 6 ElWG) – Standortbereich (Sammelschiene im Hausanschlusskasten), Lokalbereich (Niederspannungs-Verteilernetz) oder Regionalbereich (über das Mittelspannungsnetz verbunden). Ob ein Standortbereich vorliegt, entscheidet der Verteilernetzbetreiber.",
            "**Österreichweit:** Peer-to-Peer über Netzgebiete hinweg ist möglich, bringt aber keinen Netzentgeltvorteil.",
            "**Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag:** entfallen nur in der EEG (§ 75 Abs. 5 EAG), nicht bei Peer-to-Peer.",
            "**Hinter dem Abrechnungspunkt:** Strom, der direkt in der eigenen Anlage verbraucht oder gespeichert wird, bleibt nach § 65 Abs. 4 ElWG netzentgeltfrei – das gilt unabhängig vom P2P-Vertrag.",
            "**Versorgungsinfrastrukturbeitrag:** Ab 1. Jänner 2027 zahlen Einspeiser über 20 kW höchstens 0,05 ct/kWh (§ 75a ElWG) – auch für Mengen, die per P2P verkauft werden, soweit sie ins Netz eingespeist werden.",
          ],
        },
        {
          typ: "p",
          text: "Wie das neue Netzentgeltsystem ab 2027 insgesamt aussieht – Leistungspreis auch auf Netzebene 7, günstigere Arbeitspreise im Sommer mittags – beschreibt der Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis). Erfundene Abschlagssätze für Peer-to-Peer finden Sie hier bewusst nicht: Unser [Peer-to-Peer-Rechner](/rechner/peer-to-peer) führt den Netzentgelt-Abschlag nur als Eingabefeld mit Standardwert 0.",
        },
      ],
    },
    {
      id: "erloes",
      titel: "Was ist der geteilte Strom wert? OeMAG-Marktpreis als Maßstab",
      tocLabel: "Erlös & Beispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Der Vergleichswert für den Erzeuger ist, was er ohne Vertrag bekäme: den OeMAG-Marktpreis für Photovoltaik.** Anlagen unter 500 kWp können ihren Überschuss zu diesem monatlich veröffentlichten Preis an die OeMAG abgeben. 2026 lag er zwischen ${z2(OEMAG_2026.März)} ct/kWh (März) und ${z2(OEMAG_2026.August)} ct/kWh (August), im Mittel Jänner bis August bei rund ${z1(OEMAG_MITTEL_2026)} ct/kWh – netto, nach Abzug von 0,408 ct/kWh Ausgleichsenergie. Für den Abnehmer ist der Maßstab der Energiepreis seines Lieferanten, also nur der Energieanteil ohne Netz, Abgaben und Umsatzsteuer.`,
        },
        {
          typ: "tabelle",
          caption: "OeMAG-Marktpreis Photovoltaik 2026, ct/kWh netto",
          kopf: ["Monat", "ct/kWh", "Grundlage"],
          zeilen: [
            ["Jänner", z2(OEMAG_2026.Jänner), "Obergrenze (100 % Quartalsmarktpreis)"],
            ["Februar", z2(OEMAG_2026.Februar), "Day-Ahead-Mittel"],
            ["März", z2(OEMAG_2026.März), "Day-Ahead-Mittel"],
            ["April–Juni", z2(OEMAG_2026.April), "Untergrenze (60 %)"],
            ["Juli", z2(OEMAG_2026.Juli), "Untergrenze (60 %)"],
            ["August", z2(OEMAG_2026.August), "Day-Ahead-Mittel"],
          ],
          hervorheben: 1,
          minBreite: 520,
          fussnote: "Quelle: OeMAG, Marktpreis-Tabelle 2026 (abgerufen 30.09.2026). Der Monatswert bewegt sich in einem Korridor von 60 bis 100 % des Quartalsmarktpreises nach § 41 ÖSG 2012.",
        },
        { typ: "h3", text: "Rechenbeispiel: Tischlerei verkauft an den Nachbarbetrieb" },
        {
          typ: "p",
          text: `Eine Tischlerei mit 60 kWp hat ${n(BSP.ueberschuss)} kWh Überschuss im Jahr. Der Nachbarbetrieb – ein Kühlhaus mit Dauerlast – verbraucht davon ${n(BSP.gleichzeitigkeit * 100)} % in denselben Viertelstunden, also ${n(BSP_GETEILT)} kWh. Vereinbart werden ${n(BSP.p2p)} ct/kWh netto; der Energiepreis des Kühlhauses beim Lieferanten liegt bei ${n(BSP.energiepreis)} ct/kWh, der OeMAG-Marktpreis bei rund ${z1(BSP_OEMAG)} ct/kWh.`,
        },
        {
          typ: "tabelle",
          caption: "Beispiel Peer-to-Peer zwischen zwei Betrieben, Jahreswerte netto",
          kopf: ["Position", "ohne P2P", "mit P2P"],
          zeilen: [
            ["Geteilte Menge", "0 kWh", `${n(BSP_GETEILT)} kWh`],
            ["Erlös Tischlerei", `${n((BSP.ueberschuss * BSP_OEMAG) / 100)} € (alles OeMAG)`, `${n((BSP_GETEILT * BSP.p2p) / 100 + ((BSP.ueberschuss - BSP_GETEILT) * BSP_OEMAG) / 100)} € (P2P + Rest OeMAG)`],
            ["Mehrerlös Tischlerei", "–", `+${n(BSP_MEHRERLOES)} €`],
            ["Ersparnis Kühlhaus (Energieanteil)", "–", `${n(BSP_ERSPARNIS)} €`],
            ["Netzentgelte, Abgaben, USt", "unverändert", "unverändert (Abschlag erst nach Verordnung)"],
          ],
          hervorheben: 2,
          minBreite: 640,
          fussnote: `Annahmen: Gleichzeitigkeit ${n(BSP.gleichzeitigkeit * 100)} % (Richtwert), OeMAG ${z1(BSP_OEMAG)} ct/kWh (gerundetes Mittel Jänner–August 2026), Energiepreis ${n(BSP.energiepreis)} ct/kWh netto (Rechenannahme). Abwicklungskosten, Messung und Ausgleichsenergie nicht enthalten. Richtwert, kein Angebot.`,
        },
        {
          typ: "p",
          text: `Der Vorteil ist mit zusammen rund ${n(BSP_MEHRERLOES + BSP_ERSPARNIS)} € im Jahr überschaubar – solange keine Netzentgelt-Reduktion gilt, entscheidet die Preisdifferenz zwischen OeMAG und Lieferant. Ein fairer Preis liegt in der Mitte dieser Spanne, dann teilen beide den Vorteil. Spannend wird Peer-to-Peer vor allem dort, wo die OeMAG-Alternative wegfällt (Anlagen ab 500 kWp, Reststrom in der [Direktvermarktung](/service/direktvermarktung)) oder wo der Abnehmer hohe Energiepreise zahlt. Für Anlagen mit EAG-Marktprämie gelten zusätzliche Bedingungen – siehe [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis).`,
        },
        {
          typ: "tool",
          href: "/rechner/peer-to-peer",
          titel: "Peer-to-Peer-Rechner",
          text: "Ihr Überschuss, Ihr P2P-Preis, der aktuelle OeMAG-Marktpreis und der Energiepreis des Abnehmers – Mehrerlös, Ersparnis und fairer Preis in Sekunden.",
          label: "Jetzt rechnen",
        },
      ],
    },
    {
      id: "voraussetzungen",
      titel: "Voraussetzungen: Smart Meter, Zählpunkte, Netzbetreiber",
      tocLabel: "Voraussetzungen",
      bloecke: [
        {
          typ: "p",
          text: "**Ohne Viertelstundenwerte kein Peer-to-Peer: Der Netzbetreiber ordnet die Mengen je Viertelstunde zu, deshalb müssen alle beteiligten Zählpunkte mit Smart Metern in Viertelstundenauslesung ausgestattet sein.** Nach § 54 Abs. 1 ElWG ist diese Auslesung der Normalfall; ein Widerspruch (Opt-out) ist bei Teilnahme an Modellen der gemeinsamen Energienutzung nach § 54 Abs. 2 ausgeschlossen. Wie Sie die Viertelstundenwerte bei Ihrem Netzbetreiber aktivieren und exportieren, zeigt der [Smart-Meter-Hub](/smart-meter) für jeden großen Netzbetreiber.",
        },
        {
          typ: "liste",
          punkte: [
            "**Zählpunkte:** Erzeuger und Abnehmer brauchen je einen eigenen [Zählpunkt](/wissen/lexikon#zaehlpunkt); bis voraussichtlich April 2027 beim selben Netzbetreiber.",
            "**Erneuerbare Erzeugung:** Peer-to-Peer gilt nur für erneuerbaren Strom – bei PV selbstverständlich.",
            "**Datenfreigabe:** Der Abnehmer stimmt der Weitergabe seiner Viertelstundenwerte an den Vertragspartner bzw. Organisator zu; die Netzbetreiber bieten dafür Freigaben im Kundenportal oder Formulare.",
            "**Lastgang beider Seiten:** Nur was zeitgleich verbraucht wird, lässt sich teilen – die [Lastgang-Analyse](/lastgang-analyse) zeigt vorab, wie gut Erzeugung und Verbrauch zusammenpassen.",
            "**Anlagengröße:** Über 30 kW (Haushalt) bzw. 100 kW gelten Lieferantenpflichten; ab 6 MW ist für große Unternehmen Schluss.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Dauerlast gesucht",
          text: "PV-Überschuss fällt mittags an. Abnehmer mit Dauerlast – Kühlung, Kläranlage, Mehrschichtbetrieb, Ladeinfrastruktur – erreichen hohe Gleichzeitigkeit und machen den Vertrag für beide wertvoll. Ein Speicher beim Erzeuger verschiebt Mengen in den Abend, ändert aber nichts an der Viertelstundenzuordnung durch den Netzbetreiber.",
        },
      ],
    },
    {
      id: "ablauf",
      titel: "Wie schließt man einen Peer-to-Peer-Vertrag ab?",
      tocLabel: "Ablauf",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Partner und Mengen klären", "Lastgänge beider Seiten vergleichen, Gleichzeitigkeit abschätzen, Netzbetreiber prüfen (bis April 2027 derselbe)."],
            ["Preis und Bedingungen festlegen", "Preis je kWh zwischen OeMAG-Marktpreis und Energiepreis des Abnehmers, Laufzeit, Kündigung, Abrechnungsrhythmus, Umgang mit Ausfällen – automatische Abwicklung und Abrechnung vorsehen (§ 6 Z 124 ElWG)."],
            ["Lieferantenpflichten prüfen", "Über 30 kW (Haushalt) bzw. 100 kW: Lieferbedingungen, Informationsblatt, Rechnungsform; gegebenenfalls Organisator oder Dienstleister einbinden."],
            ["Smart Meter und Freigaben", "Viertelstundenauslesung an allen Zählpunkten sicherstellen, Datenfreigaben im Kundenportal des Netzbetreibers erteilen."],
            ["Anmeldung beim Netzbetreiber", "Den Vertrag bzw. die gemeinsame Energienutzung nach dem Verfahren des Netzbetreibers melden; die Marktprozesse werden laut Koordinationsstelle stufenweise umgesetzt (netzübergreifend ab voraussichtlich April 2027)."],
            ["Abrechnung laufen lassen", "Der Netzbetreiber liefert die zugeordneten Mengen; abgerechnet wird nach Vertrag – monatlich oder jährlich, bei Lieferantenpflichten nach Wahl des Abnehmers."],
          ],
        },
        {
          typ: "p",
          text: "Bestehende Energiegemeinschaften müssen nichts tun – sie werden nach § 189 Abs. 17 ElWG automatisch übergeleitet. Wer eine Gemeinschaft neu gründen will, findet den Weg im Ratgeber [Energiegemeinschaft gründen](/ratgeber/energiegemeinschaft-gruenden); für Betriebe mit mehreren Standorten ist die Eigenversorgungsanlage an einem anderen Standort eine weitere ElWG-Neuerung. Die Netzanmeldung der PV-Anlage selbst bleibt davon unberührt – siehe [Netzanmeldung](/netzanmeldung).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Brauche ich für Peer-to-Peer einen Verein oder eine Genossenschaft?",
      a: "Nein. Peer-to-Peer ist ein Vertrag zwischen Marktteilnehmern (§ 6 Z 124, § 68 ElWG). Eine eigene Rechtsperson brauchen nur EEG und BEG. Große Unternehmen dürfen Peer-to-Peer-Verträge bis 6 MW abschließen – einer EEG dürfen sie nicht beitreten.",
    },
    {
      q: "Seit wann ist Peer-to-Peer in Österreich erlaubt?",
      a: "Die Bestimmungen zur gemeinsamen Energienutzung (§§ 66–72 ElWG) gelten seit 1. Oktober 2026 (§ 188 Abs. 3). Laut Koordinationsstelle sind neue Modelle ab 5. Oktober 2026 zunächst nur mit Zählpunkten beim selben Netzbetreiber umsetzbar, netzübergreifend voraussichtlich ab April 2027.",
    },
    {
      q: "Spart Peer-to-Peer Netzentgelte?",
      a: "2026 nicht. Reduzierte Netzentgelte für Peer-to-Peer im Nahebereich legt erst eine Verordnung der E-Control fest (§ 70 ElWG) – voraussichtlich ab 1. Jänner 2027. Bis Ende 2026 erhalten nur Mitglieder lokaler und regionaler EEG den reduzierten Netzarbeitspreis.",
    },
    {
      q: "Ab welcher Anlagengröße gelten Lieferantenpflichten?",
      a: "Laut Koordinationsstelle bei Haushaltskunden mit Erzeugungsanlagen über 30 kW, bei sonstigen aktiven Kunden, EEG und BEG über 100 kW (§ 69 ElWG). Dann braucht es Allgemeine Lieferbedingungen, ein Informationsblatt, Änderungsmitteilungen einen Monat vorab, transparente Rechnungen und ein Wahlrecht zwischen monatlicher und jährlicher Abrechnung.",
    },
    {
      q: "Welcher Preis ist bei Peer-to-Peer sinnvoll?",
      a: `Zwischen dem OeMAG-Marktpreis, den der Erzeuger sonst bekäme (2026 bisher rund ${z1(OEMAG_MITTEL_2026)} ct/kWh im Mittel), und dem Energiepreis, den der Abnehmer seinem Lieferanten zahlt. In der Mitte teilen sich beide den Vorteil. Der [Peer-to-Peer-Rechner](/rechner/peer-to-peer) rechnet mit den aktuellen OeMAG-Monatswerten.`,
    },
    {
      q: "Darf ich Strom auch verschenken?",
      a: "Ja. § 6 Z 124 ElWG nennt ausdrücklich Verkauf oder Schenkung erneuerbarer Elektrizität – etwa vom Hof an das Austraghaus oder zwischen Standorten einer Familie. Netzentgelte und Abgaben des Abnehmers fallen trotzdem an.",
    },
    {
      q: "Kann ich Peer-to-Peer mit einem Opt-out-Smart-Meter nutzen?",
      a: "Nein. Bei Teilnahme an Modellen der gemeinsamen Energienutzung ist der Widerspruch gegen die Viertelstundenauslesung nach § 54 Abs. 2 ElWG ausgeschlossen. Alle beteiligten Zählpunkte brauchen Viertelstundenwerte – wie Sie sie aktivieren, zeigt der Smart-Meter-Hub je Netzbetreiber.",
    },
  ],

  howTo: {
    name: "Peer-to-Peer-Stromvertrag in Österreich abschließen",
    schritte: [
      { name: "Partner, Netzbetreiber und Lastgänge prüfen", text: "Gleichzeitigkeit abschätzen; bis voraussichtlich April 2027 müssen beide Zählpunkte beim selben Netzbetreiber liegen." },
      { name: "Preis und Vertrag festlegen", text: "Preis zwischen OeMAG-Marktpreis und Energiepreis des Abnehmers; Bedingungen für automatische Abwicklung und Abrechnung vorab festlegen." },
      { name: "Lieferantenpflichten klären", text: "Über 30 kW (Haushalt) bzw. 100 kW: Lieferbedingungen, Informationsblatt, Rechnungsform – gegebenenfalls Organisator einbinden." },
      { name: "Smart Meter und Datenfreigaben", text: "Viertelstundenauslesung an allen Zählpunkten, Freigaben im Kundenportal des Netzbetreibers." },
      { name: "Beim Netzbetreiber anmelden und abrechnen", text: "Gemeinsame Energienutzung nach dem Verfahren des Netzbetreibers melden; Mengen werden je Viertelstunde zugeordnet und nach Vertrag abgerechnet." },
    ],
  },

  passend: [
    { href: "/rechner/peer-to-peer", titel: "Peer-to-Peer-Rechner", text: "Mehrerlös, Ersparnis und fairer Preis mit aktuellen OeMAG-Monatswerten." },
    { href: "/smart-meter", titel: "Smart-Meter-Hub je Netzbetreiber", text: "Viertelstundenwerte aktivieren, exportieren und ohne Upload auswerten." },
    { href: "/ratgeber/energiegemeinschaft-gruenden", titel: "Energiegemeinschaft gründen", text: "EEG, BEG und GEA nach ElWG – Rechtsform, Netzentgelte, Ablauf." },
    { href: "/ratgeber/oemag-marktpreis", titel: "OeMAG-Marktpreis", text: "Wie der Monatswert entsteht und was er für Ihren Überschuss bedeutet." },
  ],

  quellen: [
    { titel: "RIS – Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025 (§ 6 Z 123/124, § 54, § 65, § 75a, § 188, § 189)", url: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", stand: "10/2026" },
    { titel: "RIS – ElWG § 68, Bundesrecht konsolidiert (Teilnahme an der gemeinsamen Energienutzung, Peer-to-Peer-Verträge, Organisator)", url: "https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40273983/NOR40273983.html", stand: "10/2026" },
    { titel: "ElWG, konsolidierte Fassung vom 07.01.2026 (RIS-Ausdruck, bereitgestellt von Energienetze Steiermark)", url: "https://www.e-netze.at/downloads-data/pdf.aspx?pdf=ElWG_Fassung+vom+07012026.pdf", stand: "01/2026" },
    { titel: "Österreichische Koordinationsstelle für Energiegemeinschaften – FAQs zum ElWG (Fristen, § 69 Lieferantenpflichten, § 70 Nahebereich, Netzentgelte)", url: "https://energiegemeinschaften.gv.at/faqs-zum-elwg/", stand: "10/2026" },
    { titel: "OeMAG – Marktpreis Photovoltaik (Monatswerte 2026, Ausgleichsenergie)", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "E-Control – Systemnutzungsentgelte-Grundsatzverordnung, Begutachtungsentwurf samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "RIS – Erneuerbaren-Ausbau-Gesetz (EAG), § 75 Abs. 5 und § 79 Abs. 2", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20011619", stand: "10/2026" },
  ],

  seitenCta: { titel: "Lastgang vorab prüfen", text: "Wie viel Ihres Überschusses der Partner wirklich zeitgleich verbraucht, zeigt die Lastgang-Analyse – ohne Upload.", href: "/lastgang-analyse", label: "Lastgang auswerten" },
  cta: {
    title: "Strom teilen beginnt mit der richtigen Anlage.",
    text: "Wir planen PV-Anlagen für Betriebe, Höfe und Gemeinden so, dass Erzeugung und Abnehmer zusammenpassen – Lastgang-Auswertung, Netzanmeldung, Messung und Betrieb aus einer Hand, in ganz Österreich.",
    primary: { label: "Projekt anfragen", href: "/angebot?objekt=gewerbe" },
    secondary: { label: "Peer-to-Peer-Rechner", href: "/rechner/peer-to-peer" },
  },
};

export default artikel;
