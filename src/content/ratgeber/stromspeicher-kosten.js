// Ratgeber: Stromspeicher Kosten 2026 in Österreich (5–50 kWh, Premium-Privat und kleines Gewerbe)
// Marktdaten: BMWET/FH Technikum Wien "PV-Batteriespeichersysteme – Marktentwicklung 2024" (06/2025).
// Einspeiseerlös: OeMAG-Monatsmarktpreise PV 2026. Netzentgelte 2026: SNE-V 2018 idF BGBl. II Nr. 305/2025.
// Preismodell 2026, Zyklen, Wirkungsgrade und Bezugspreise sind offengelegte Annahmen.

const fmt = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (n) => `${fmt(Math.round(n))} €`;
const eur100 = (n) => `${fmt(Math.round(n / 100) * 100)} €`;
const ctF = (n, d = 1) => `${fmt(n, d)} ct`;
const jahre = (x) => `${fmt(x, 1)} Jahre`;
const jahreD = (x) => `${fmt(x, 1)} Jahren`;

// Marktstatistik (€/kWh nutzbar, exkl. USt)
const PREIS_2024 = 706;
const PREIS_2023 = 840;
const EINKAUF_2024 = 516;
const EINKAUF_2023 = 651;
const RUECKGANG = 1 - PREIS_2024 / PREIS_2023;
const ANTEIL_MIT_PV = 0.77;
const ANTEIL_DC = 0.95;
const GROESSE_2024 = 20; // kWh, durchschnittliche Speichergröße 2024

// Preismodell 2026 (Annahme): Fixanteil + Preis je nutzbarer kWh, exkl. USt, gemeinsam mit PV errichtet
const FIX = 2200;
const VAR = 400;
const USt = 0.2;
const NACHRUEST = 2000; // Aufpreis AC-Nachrüstung (Annahme)
const netto = (kwh) => FIX + VAR * kwh;
const jeKwh = (kwh) => netto(kwh) / kwh;
const GROESSEN = [5, 10, 15, 20, 30, 50];

// Einspeiseerlös und Bezugspreis
const OEMAG_MIN = 5.72; // März 2026
const OEMAG_MAX = 8.997; // August 2026
const OEMAG_MITTEL = 7.3; // Ø Jänner–August 2026
const ETA_DC = 0.9;
const ETA_AC = 0.85; // Annahme: zusätzliche Umwandlung bei AC-Kopplung
const DOD = 0.95;
const JAHRE = 15;
const BEZUG_SZENARIEN = [20, 25, 30]; // ct/kWh brutto, variabler Anteil (Annahme)
const EINSPEISE_SZENARIEN = [OEMAG_MIN, OEMAG_MITTEL, OEMAG_MAX];
const nutzenJeKwh = (bezug, einsp, eta = ETA_DC) => bezug - einsp / eta;

// Kosten je gespeicherter kWh: Investition / (Bruttokapazität × DoD × Vollzyklen × Wirkungsgrad)
const lcos = (invest, nutzbar, zyklenJahr, eta) => (invest / ((nutzbar / DOD) * DOD * zyklenJahr * JAHRE * eta)) * 100;
const VARIANTEN = [
  { name: "10 kWh, gemeinsam mit PV (DC)", kwh: 10, invest: netto(10), zyklen: 250, eta: ETA_DC, ust: true },
  { name: "10 kWh, nachgerüstet (AC)", kwh: 10, invest: netto(10) + NACHRUEST, zyklen: 250, eta: ETA_AC, ust: true },
  { name: "20 kWh, passend genutzt (Wärmepumpe, E-Auto)", kwh: 20, invest: netto(20), zyklen: 220, eta: ETA_DC, ust: true },
  { name: "20 kWh, überdimensioniert", kwh: 20, invest: netto(20), zyklen: 120, eta: ETA_DC, ust: true },
  { name: "40 kWh, kleiner Betrieb (Vorsteuerabzug)", kwh: 40, invest: netto(40), zyklen: 250, eta: ETA_DC, ust: false },
].map((v) => {
  const n = lcos(v.invest, v.kwh, v.zyklen, v.eta);
  return { ...v, lcosNetto: n, lcosEff: v.ust ? n * (1 + USt) : n };
});
const V10 = VARIANTEN[0];

// Beispiele Amortisation
const BEZUG_HAUS = 28; // ct/kWh brutto (Annahme)
const E10 = { invest: netto(10) * (1 + USt), kwh: 10 * 250 * ETA_DC, nutzen: nutzenJeKwh(BEZUG_HAUS, OEMAG_MITTEL) };
E10.jahr = (E10.kwh * E10.nutzen) / 100;
E10.amort = E10.invest / E10.jahr;
const E20 = { invest: netto(20) * (1 + USt), kwh: 20 * 220 * ETA_DC, nutzen: nutzenJeKwh(BEZUG_HAUS, OEMAG_MITTEL) };
E20.jahr = (E20.kwh * E20.nutzen) / 100;
E20.amort = E20.invest / E20.jahr;
// Kleiner Betrieb auf NE 7 mit Leistungsmessung, Netzbereich Oberösterreich (netto)
const BEZUG_BETRIEB = 13.0 + 4.68 + 0.528 + 1.5; // Energie (Annahme) + AP NE 7 gem. + Netzverlust NE 7 + Elektrizitätsabgabe
const LP_NE7_OOE = 52.56;
const KAPPUNG = 10; // kW im Monatsmittel (Annahme)
const G40 = { invest: netto(40), kwh: 40 * 250 * ETA_DC, nutzen: nutzenJeKwh(BEZUG_BETRIEB, OEMAG_MITTEL) };
G40.lp = KAPPUNG * LP_NE7_OOE;
G40.jahr = (G40.kwh * G40.nutzen) / 100 + G40.lp;
G40.amort = G40.invest / G40.jahr;

const artikel = {
  slug: "stromspeicher-kosten",
  title: "Stromspeicher Kosten 2026: Preise pro kWh in Österreich",
  seoTitle: "Stromspeicher Kosten 2026 in Österreich | Ökovolt",
  kurzTitel: "Stromspeicher Kosten",
  description:
    "Stromspeicher Kosten 2026 in Österreich: Preis je kWh laut Marktstatistik, Nachrüstung vs. gemeinsam mit PV, Kosten je gespeicherter kWh und Wirtschaftlichkeit.",
  excerpt:
    "Was ein Batteriespeicher von 5 bis 50 kWh in Österreich kostet, warum der Preis je kWh wenig über die Wirtschaftlichkeit sagt und wie Einspeisetarif, Leistungspreis ab 2027 und Notstrom die Rechnung verändern.",
  hauptKeyword: "stromspeicher kosten",
  keywords: [
    "Stromspeicher Kosten",
    "Stromspeicher Preis pro kWh",
    "Batteriespeicher Kosten Österreich",
    "Stromspeicher nachrüsten Kosten",
    "PV-Speicher Preis 2026",
    "Kosten je gespeicherter kWh",
    "Lohnt sich ein Stromspeicher",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg",
  bildAlt: "Hybrid-Wechselrichter und modularer Batteriespeicher an einer Wand im Technikraum",
  badge: { wert: `${fmt(PREIS_2024)} €`, text: "je kWh nutzbar: mittlerer Systempreis 2024 in Österreich, exkl. USt" },

  kurzFazit: [
    `**PV-Stromspeicher kosteten in Österreich 2024 schlüsselfertig im Mittel ${fmt(PREIS_2024)} € je nutzbarer kWh ohne USt** – ${fmt(RUECKGANG * 100)} % weniger als 2023 (${fmt(PREIS_2023)} €). Für 2026 rechnen wir mit einem Richtwert von rund ${eur100(netto(10))} netto für 10 kWh und ${eur100(netto(20))} für 20 kWh.`,
    `${fmt(ANTEIL_MIT_PV * 100)} % der Speicher wurden 2024 gemeinsam mit der PV-Anlage errichtet, ${fmt(ANTEIL_DC * 100)} % sind DC-gekoppelt. Nachrüsten ist meist teurer, weil oft ein eigener Batteriewechselrichter nötig ist.`,
    `Entscheidend sind die **Kosten je gespeicherter kWh**: Ein passend genutzter 10-kWh-Speicher kommt im Beispiel auf ${ctF(V10.lcosEff)} je kWh inkl. USt, ein überdimensionierter 20-kWh-Speicher auf ${ctF(VARIANTEN[3].lcosEff)}.`,
    `Jede gespeicherte kWh spart den Bezugspreis, kostet aber den Einspeiseerlös – 2026 zahlte die OeMAG für PV-Strom monatlich ${ctF(OEMAG_MIN, 2)} bis ${ctF(OEMAG_MAX, 2)}. Rein finanziell amortisiert sich ein Heimspeicher im Beispiel erst nach rund ${jahreD(E10.amort)}.`,
    "**Ab 2027** soll laut ElWG und Verordnungsentwurf ein Leistungspreis auch auf Netzebene 7 gelten – dann kann ein Speicher zusätzlich Leistungsspitzen im Haushalt senken.",
  ],

  abschnitte: [
    {
      id: "preise",
      titel: "Was kostet ein Stromspeicher 2026 in Österreich?",
      tocLabel: "Preise 2026",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Stromspeicher kostete 2024 in Österreich schlüsselfertig im Mittel ${fmt(PREIS_2024)} € je nutzbarer kWh ohne Umsatzsteuer; 2026 liegt ein 10-kWh-Speicher gemeinsam mit der PV-Anlage als Richtwert bei rund ${eur100(netto(10))} netto.** Die Zahl für 2024 stammt aus der jährlichen Marktstatistik, die die FH Technikum Wien für das Wirtschaftsministerium (BMWET) erstellt. Der Einkaufspreis der Errichter sank im selben Zeitraum von ${fmt(EINKAUF_2023)} auf ${fmt(EINKAUF_2024)} € je kWh. Die Auswertung für 2025 war Ende September 2026 noch nicht veröffentlicht.`,
        },
        {
          typ: "tabelle",
          caption: "Stromspeicher-Kosten nach Größe, gemeinsam mit PV errichtet – Richtwerte 2026, Stand September 2026",
          kopf: ["Nutzbare Kapazität", "€ je kWh (netto)", "Investition netto", "inkl. 20 % USt", "nachgerüstet inkl. USt"],
          zeilen: GROESSEN.map((k) => [`${fmt(k)} kWh`, fmt(jeKwh(k)), eur(netto(k)), eur(netto(k) * (1 + USt)), eur((netto(k) + NACHRUEST) * (1 + USt))]),
          markierteZeile: 1,
          hervorheben: 3,
          minBreite: 640,
          fussnote: `Rechenmodell (Annahme): ${eur(FIX)} Fixanteil (Wechselrichteranteil, Elektrik, Inbetriebnahme) plus ${fmt(VAR)} € je nutzbarer kWh, exkl. USt. Abgeleitet aus der Marktstatistik 2024 (${fmt(PREIS_2024)} €/kWh bei durchschnittlich ${fmt(GROESSE_2024)} kWh) mit angenommenem Rückgang von rund 15 % je Jahr 2025 und 2026 – ähnlich wie von 2023 auf 2024. Nachrüstung: ${eur(NACHRUEST)} Aufpreis netto für AC-Batteriewechselrichter und eigenen Montagetermin (Annahme). Ohne Notstrom, Zählerschrank-Umbau und Förderung. Keine Angebote.`,
        },
        {
          typ: "p",
          text: `Das Modell zeigt den wichtigsten Preiseffekt: Kleine Speicher sind je kWh deutlich teurer, weil Wechselrichter, Elektrik und Inbetriebnahme fast unabhängig von der Größe anfallen. Die durchschnittliche Speichergröße ist deshalb gestiegen – von 13,5 kWh (2023) auf rund ${fmt(GROESSE_2024)} kWh (2024). Größer ist aber nicht automatisch wirtschaftlicher, wie der Abschnitt zu den Kosten je gespeicherter kWh zeigt. Welche [Speicherkapazität](/wissen/lexikon#speicherkapazitaet) zu Ihrem Verbrauch passt, erklärt der Ratgeber [Stromspeicher-Größe](/ratgeber/stromspeicher-groesse).`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Umsatzsteuer: 20 % für Privat, netto für Betriebe",
          text: "Privatkunden zahlen auf Speicher und Montage 20 % Umsatzsteuer. Unternehmen mit Vorsteuerabzug rechnen netto – für sie zählen die Werte ohne USt. Erträge aus eingespeistem Strom sind für Privatpersonen unter bestimmten Grenzen einkommensteuerfrei (Engpassleistung bis 25 kW, Modulleistung bis 35 kWp, höchstens 12.500 kWh Einspeisung im Jahr).",
        },
      ],
    },
    {
      id: "zusammensetzung",
      titel: "Woraus sich der Speicherpreis zusammensetzt",
      tocLabel: "Kostenbestandteile",
      bloecke: [
        {
          typ: "p",
          text: `**Der Endpreis besteht aus Batteriemodulen, Leistungselektronik, Installation und Optionen – die Differenz zwischen Einkaufs- und Endpreis betrug 2024 im Mittel ${fmt(PREIS_2024 - EINKAUF_2024)} € je kWh.** Dieser Anteil deckt Planung, Montage, Elektroarbeiten, Anmeldung beim Netzbetreiber, Gewährleistung und Marge.`,
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Batteriemodule", text: "Der größte Einzelposten, heute fast immer [Lithium-Eisenphosphat (LFP)](/wissen/lexikon#lfp). Vergleichen Sie immer die nutzbare, nicht die Bruttokapazität." },
            { titel: "Wechselrichter", text: "Bei Neuanlagen steuert meist ein Hybridwechselrichter PV und Batterie gemeinsam. Beim Nachrüsten ist oft ein eigener Batteriewechselrichter nötig." },
            { titel: "Installation und Elektrik", text: "Montage, Leitungen, Schutzeinrichtungen, Inbetriebnahme. Ein veralteter Zählerschrank kann den Preis deutlich erhöhen." },
            { titel: "Optionen", text: "Notstrom- oder Ersatzstromfunktion, Energiemanagement, Anbindung von Wallbox und Wärmepumpe. Diese Positionen treiben den Preis je kWh am stärksten." },
          ],
        },
      ],
    },
    {
      id: "nachruesten",
      titel: "Gemeinsam mit PV oder nachrüsten? DC oder AC?",
      tocLabel: "Nachrüsten, DC oder AC",
      bloecke: [
        {
          typ: "p",
          text: `**Gemeinsam mit der PV-Anlage errichtet ist ein Speicher fast immer günstiger als nachgerüstet – das ist auch der Marktstandard: ${fmt(ANTEIL_MIT_PV * 100)} % der 2024 in Österreich installierten Speicher entstanden gemeinsam mit der Anlage, ${fmt((1 - ANTEIL_MIT_PV) * 100)} % wurden nachgerüstet.** Bei der [DC-Kopplung](/wissen/lexikon#dc-kopplung) hängt die Batterie am Gleichstromkreis des Hybridwechselrichters; ${fmt(ANTEIL_DC * 100)} % der Speicher 2024 waren so angebunden. Die [AC-Kopplung](/wissen/lexikon#ac-kopplung) mit eigenem Batteriewechselrichter ist die typische Lösung beim Nachrüsten.`,
        },
        {
          typ: "tabelle",
          caption: "DC- und AC-gekoppelte Speicher im Vergleich, Stand September 2026",
          kopf: ["", "DC-gekoppelt (mit PV)", "AC-gekoppelt (Nachrüstung)"],
          zeilen: [
            ["Wechselrichter", "ein Hybridgerät für PV und Batterie", "zusätzlicher Batteriewechselrichter"],
            ["Mehrkosten (Annahme)", "–", `rund ${eur(NACHRUEST)} netto`],
            ["Wirkungsgrad Laden + Entladen (Annahme)", `${fmt(ETA_DC * 100)} %`, `${fmt(ETA_AC * 100)} %`],
            ["Marktanteil 2024", `${fmt(ANTEIL_DC * 100)} %`, `${fmt((1 - ANTEIL_DC) * 100)} %`],
            ["Geeignet für", "Neuanlage oder Wechselrichtertausch", "bestehende Anlage mit funktionierendem Wechselrichter"],
          ],
          hervorheben: 1,
          minBreite: 560,
          fussnote: "Marktanteile: BMWET/FH Technikum Wien, Marktentwicklung 2024. Mehrkosten und Wirkungsgrade sind Annahmen; sie variieren je Produkt.",
        },
        {
          typ: "p",
          text: "Nachrüsten lohnt sich besonders, wenn der alte Wechselrichter ohnehin getauscht werden muss (dann kann direkt ein Hybridgerät kommen), wenn der Verbrauch am Abend durch Wärmepumpe oder E-Auto gestiegen ist oder wenn der Einspeiseerlös deutlich gesunken ist.",
        },
      ],
    },
    {
      id: "kosten-je-kwh",
      titel: "Was kostet eine gespeicherte Kilowattstunde?",
      tocLabel: "Kosten je gespeicherter kWh",
      bloecke: [
        {
          typ: "p",
          text: "**Die Kosten je gespeicherter kWh (Levelized Cost of Storage) ergeben sich aus Investition ÷ (Bruttokapazität × Entladetiefe × Vollzyklen × Wirkungsgrad) – und sie sagen mehr über die Wirtschaftlichkeit als der Preis je kWh Kapazität.** Ein günstiger, aber zu großer Speicher, der im Winter selten voll wird, liefert teure Kilowattstunden; ein passend dimensionierter, täglich genutzter Speicher günstige.",
        },
        {
          typ: "tabelle",
          caption: `Kosten je gespeicherter kWh über ${fmt(JAHRE)} Jahre – Beispielvarianten, Stand September 2026`,
          kopf: ["Variante", "Investition netto", "Vollzyklen/Jahr", "Wirkungsgrad", "ct/kWh netto", "ct/kWh effektiv"],
          zeilen: VARIANTEN.map((v) => [v.name, eur(v.invest), fmt(v.zyklen), `${fmt(v.eta * 100)} %`, fmt(v.lcosNetto, 1), fmt(v.lcosEff, 1)]),
          markierteZeile: 0,
          hervorheben: 5,
          minBreite: 720,
          fussnote: `Nutzungsdauer ${fmt(JAHRE)} Jahre, Entladetiefe ${fmt(DOD * 100)} % (Bruttokapazität × Entladetiefe = nutzbare Kapazität), Vollzyklen und Wirkungsgrade als Annahme. „Effektiv“ = inkl. 20 % USt für Privatkunden, beim Betrieb netto. Nur Anschaffung – ohne Kapazitätsverlust durch Alterung, Zinsen und entgangenen Einspeiseerlös. Preise nach dem Rechenmodell oben.`,
        },
        {
          typ: "p",
          text: `Die Tabelle zeigt drei Muster: Nachrüstung verteuert die gespeicherte kWh durch Aufpreis und Umwandlungsverluste. Ein überdimensionierter Speicher mit wenigen Zyklen kostet je kWh fast doppelt so viel wie ein passend genutzter. Und Betriebe profitieren vom Vorsteuerabzug. Wie viele Zyklen ein Speicher über die Jahre schafft, erklärt der Ratgeber [Stromspeicher-Lebensdauer](/ratgeber/stromspeicher-lebensdauer).`,
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Rechnet sich ein Stromspeicher in Österreich?",
      tocLabel: "Wirtschaftlichkeit",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Stromspeicher rechnet sich, wenn die Differenz zwischen Bezugspreis und Einspeiseerlös – geteilt durch den Wirkungsgrad – größer ist als seine Kosten je gespeicherter kWh.** Jede gespeicherte kWh ersetzt Netzstrom, wird aber nicht mehr eingespeist. 2026 lag der OeMAG-Marktpreis für PV monatlich zwischen ${ctF(OEMAG_MIN, 2)} (März) und ${ctF(OEMAG_MAX, 2)} (August), im Mittel Jänner bis August bei rund ${ctF(OEMAG_MITTEL)}. Einspeisetarife von Energieversorgern bewegten sich laut Tarifvergleichen überwiegend zwischen etwa 2 und 11 ct. Hintergründe im Ratgeber [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis).`,
        },
        {
          typ: "tabelle",
          caption: "Nutzen je aus dem Speicher entladener kWh (DC, 90 % Wirkungsgrad), Stand September 2026",
          kopf: ["Bezugspreis (brutto, variabel)", `Einspeisung ${ctF(OEMAG_MIN, 2)}`, `Einspeisung ${ctF(OEMAG_MITTEL)}`, `Einspeisung ${ctF(OEMAG_MAX, 2)}`],
          zeilen: BEZUG_SZENARIEN.map((b) => [`${fmt(b)} ct/kWh`, ...EINSPEISE_SZENARIEN.map((e) => ctF(nutzenJeKwh(b, e)))]),
          markierteZeile: 1,
          hervorheben: 2,
          minBreite: 600,
          fussnote: `Nutzen = Bezugspreis − Einspeiseerlös ÷ Wirkungsgrad. Bezugspreise sind Rechenszenarien (Annahme) für den variablen Anteil aus Energie, Netz-Arbeitspreis, Abgaben und USt; Ihren Wert finden Sie auf der Stromrechnung. Einspeisewerte: OeMAG-Monatsmarktpreise PV 2026 (niedrigster, Mittel Jänner–August, höchster).`,
        },
        {
          typ: "p",
          text: `Vergleicht man diese Werte mit den Kosten je gespeicherter kWh (${ctF(V10.lcosEff)} brutto für den passend genutzten 10-kWh-Speicher), wird klar: Erst bei rund 30 ct Bezugspreis erreicht der Nutzen je kWh diese Kosten; bei 25 ct und durchschnittlichem OeMAG-Erlös bleibt er deutlich darunter. Die Beispiele zeigen, was das für die Amortisation heißt:`,
        },
        {
          typ: "tabelle",
          caption: "Beispiele: einfache Amortisation von Stromspeichern, Stand September 2026",
          kopf: ["Fall", "Investition", "Entladene kWh/Jahr", "Nutzen/Jahr", "Amortisation"],
          zeilen: [
            ["Einfamilienhaus, 10 kWh (inkl. USt)", eur(E10.invest), fmt(E10.kwh), eur(E10.jahr), jahre(E10.amort)],
            ["Premium-Haus mit Wärmepumpe und E-Auto, 20 kWh (inkl. USt)", eur(E20.invest), fmt(E20.kwh), eur(E20.jahr), jahre(E20.amort)],
            [`Kleiner Betrieb NE 7 OÖ, 40 kWh (netto, ${fmt(KAPPUNG)} kW Spitzenkappung)`, eur(G40.invest), fmt(G40.kwh), eur(G40.jahr), jahre(G40.amort)],
          ],
          hervorheben: 4,
          minBreite: 680,
          fussnote: `Entladene kWh = nutzbare Kapazität × Vollzyklen × ${fmt(ETA_DC * 100)} % Wirkungsgrad (wie in der Tabelle zu den Kosten je gespeicherter kWh). Haushalt: Bezugspreis ${fmt(BEZUG_HAUS)} ct/kWh brutto (Annahme), Einspeisung ${ctF(OEMAG_MITTEL)} (OeMAG Ø 2026). Betrieb: variable Bezugskosten ${ctF(BEZUG_BETRIEB, 2)} netto (Energie 13,0 ct als Annahme, Netz-Arbeitspreis NE 7 gemessen OÖ 4,68 ct, Netzverlust 0,528 ct, Elektrizitätsabgabe 1,5 ct) plus ${fmt(KAPPUNG)} kW × ${fmt(LP_NE7_OOE, 2)} € Leistungspreis 2026. Ohne Förderung, Preissteigerung, Alterung und Betriebskosten.`,
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Warum der Speicher trotzdem gekauft wird",
          text: "Die Marktstatistik stellt fest, dass PV-Speicher in Österreich fast ausschließlich eigenverbrauchsoptimiert betrieben werden. Käufer gewichten neben der Rendite auch Unabhängigkeit, Notstrom und Schutz vor steigenden Preisen. Rechnen Sie diese Werte bewusst getrennt – und dimensionieren Sie nicht größer, als Ihr Verbrauch am Abend und in der Nacht hergibt. Eine erste Abschätzung liefert der [Stromspeicher-Rechner](/rechner/stromspeicher).",
        },
      ],
    },
    {
      id: "netzentgelte",
      titel: "Sommer-Niedertarif und Leistungspreis ab 2027: Was sich für Haushalte ändert",
      tocLabel: "SNAP & Leistungspreis 2027",
      bloecke: [
        {
          typ: "p",
          text: "**Die Netzentgelte werden zeitabhängiger und leistungsbezogener – das kann den Wert eines Speichers in Zukunft erhöhen.** Seit 1. April 2026 gilt auf Netzebene 7 der Sommer-Nieder-Arbeitspreis (SNAP): von 1. April bis 30. September zwischen 10 und 16 Uhr ist der Netz-Arbeitspreis um 20 % niedriger, im Netzbereich Oberösterreich für nicht leistungsgemessene Kunden also rund 5,03 statt 6,29 ct/kWh. Wer in dieser Zeit ohnehin Solarstrom erzeugt, profitiert davon kaum; relevant wird der SNAP beim Laden aus dem Netz, etwa mit einem dynamischen Tarif.",
        },
        {
          typ: "liste",
          punkte: [
            "**Leistungspreis auf NE 7 ab 2027:** Laut ElWG und SNE-G-V-Entwurf wird der höchste Viertelstundenwert jedes Monats verrechnet, mit zwei Preisstufen bis 10 kW und darüber, mindestens 2 kW. Heute zahlen nicht gemessene Kunden eine Pauschale von 54 € im Jahr.",
            "**Speicher als Spitzenkappung:** Wenn Wallbox, Herd und Wärmepumpe gleichzeitig laufen, kann ein Speicher mit Energiemanagement die Viertelstundenspitze senken. Wie viel das wert ist, hängt von den Tarifwerten 2027 ab, die erst mit der SNE-T-V feststehen.",
            "**Winter-Nieder-Arbeitspreis ab 2027:** Laut Entwurf von 1. Oktober bis 31. März zwischen 22 und 4 Uhr – interessant, um den Speicher im Winter nachts günstig vorzuladen.",
          ],
        },
        {
          typ: "p",
          text: "Wie Leistungspreise funktionieren und warum jede Monatsspitze zählt, erklärt der Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis). Ob ein spotpreisbasierter Tarif mit Speicher für Sie passt, zeigt der [Rechner für dynamische Stromtarife](/rechner/dynamischer-stromtarif).",
        },
      ],
    },
    {
      id: "notstrom-foerderung",
      titel: "Notstrom, Förderung und laufende Kosten",
      tocLabel: "Notstrom & Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Notstrom kostet extra, Förderung gibt es nur in Verbindung mit PV, und im Betrieb fallen kaum laufende Kosten an.** Die wichtigsten Punkte im Überblick:",
        },
        {
          typ: "tabelle",
          caption: "Zusatzkosten und Förderwege rund um den Stromspeicher, Stand September 2026",
          kopf: ["Position", "Richtwert / Regel", "Hinweis"],
          zeilen: [
            ["Notstromsteckdose", "einige hundert € (Annahme)", "einzelne Verbraucher bei Netzausfall"],
            ["Ersatzstrom für das ganze Haus", "rund 1.000–2.500 € (Annahme)", "Netztrennung, inselnetzfähiger Wechselrichter"],
            ["Zählerschrank-Anpassung", "projektabhängig", "bei alten Verteilern ohne Platz für Schutztechnik"],
            ["EAG-Investitionszuschuss", "Speicher nur mit PV; 3. Call 8.–22.10.2026", "Förderansuchen vor Bestellung stellen"],
            ["Landesförderungen", "je Bundesland verschieden", "Budgets oft begrenzt"],
          ],
          minBreite: 620,
          fussnote: "Richtwerte für Notstrom sind Annahmen; der Aufwand hängt vom Gebäude ab. Fördersätze werden hier bewusst nicht genannt – maßgeblich sind die Bedingungen des jeweiligen Calls.",
        },
        {
          typ: "p",
          text: "Welche Notstromlösung Sie wirklich brauchen, erklärt der Ratgeber [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik). Den aktuellen Stand der Bundesförderung finden Sie im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss), Landesprogramme unter [Landesförderungen](/forderungen/landesforderungen). Für Betriebe mit Speichern ab etwa 50 kWh gelten eigene Kostenstrukturen – siehe [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten).",
        },
      ],
    },
    {
      id: "angebot",
      titel: "Checkliste: Speicherangebote richtig vergleichen",
      tocLabel: "Angebote vergleichen",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Nutzbare Kapazität** in kWh angegeben – und daraus den Preis je nutzbarer kWh inkl. Montage berechnen.",
            "**Kopplung:** DC mit Hybridwechselrichter oder AC mit eigenem Batteriewechselrichter – und warum.",
            "**Garantie:** Jahre, Restkapazität und garantierter Energiedurchsatz; Bedingungen wie Internetverbindung oder Updates.",
            "**Wirkungsgrad und Bereitschaftsverbrauch** laut Datenblatt.",
            "**Erweiterbarkeit:** Lassen sich Module ergänzen, wenn E-Auto oder Wärmepumpe dazukommen?",
            "**Notstrom oder Ersatzstrom:** enthalten, optional oder nicht möglich?",
            "**Steuerung:** Kann das System dynamische Tarife, SNAP-Zeiten und ab 2027 Leistungsspitzen berücksichtigen?",
            "**Förderung:** Ist das Förderansuchen vor der Bestellung gestellt?",
          ],
        },
        {
          typ: "tool",
          href: "/produkte/stromspeicher",
          titel: "Stromspeicher passend planen",
          text: "Speichergröße, Kopplung und Notstrom auf Ihren Verbrauch abgestimmt – mit ehrlicher Rechnung, ob sich der Speicher bei Ihnen lohnt.",
          label: "Zu den Stromspeichern",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was kostet ein 10-kWh-Stromspeicher in Österreich?",
      a: `Als Richtwert 2026 rund ${eur100(netto(10))} netto bzw. ${eur100(netto(10) * (1 + USt))} inkl. 20 % USt, wenn er gemeinsam mit der PV-Anlage errichtet wird. Nachgerüstet mit eigenem Batteriewechselrichter liegen Sie eher bei ${eur100((netto(10) + NACHRUEST) * (1 + USt))} brutto. Notstrom und Zählerschrank-Umbau kommen gegebenenfalls hinzu.`,
    },
    {
      q: "Wie viel kostet ein Stromspeicher pro kWh?",
      a: `Laut Marktstatistik kosteten Speicher 2024 in Österreich im Mittel ${fmt(PREIS_2024)} € je nutzbarer kWh schlüsselfertig ohne USt, 2023 waren es ${fmt(PREIS_2023)} €. Kleine Speicher sind je kWh teurer als große, weil Wechselrichter und Installation fast gleich viel kosten.`,
    },
    {
      q: "Lohnt sich ein Stromspeicher in Österreich?",
      a: `Rein finanziell oft nur knapp oder nicht innerhalb der Nutzungsdauer. Im Beispiel (10 kWh, ${fmt(BEZUG_HAUS)} ct Bezugspreis, OeMAG-Mittel ${ctF(OEMAG_MITTEL)}) amortisiert sich der Speicher nach rund ${jahreD(E10.amort)}. Günstiger wird es bei hohem Abendverbrauch, niedrigem Einspeiseerlös, Förderung und künftig durch den Leistungspreis auf Netzebene 7.`,
    },
    {
      q: "Was kostet eine gespeicherte Kilowattstunde?",
      a: `Die Kosten je gespeicherter kWh ergeben sich aus Investition ÷ (Kapazität × Entladetiefe × Vollzyklen × Wirkungsgrad). Ein passend genutzter 10-kWh-Speicher kommt im Beispiel auf rund ${ctF(V10.lcosEff)} inkl. USt, ein überdimensionierter 20-kWh-Speicher auf ${ctF(VARIANTEN[3].lcosEff)}.`,
    },
    {
      q: "Ist Nachrüsten teurer als der gemeinsame Einbau?",
      a: `Meist ja: Beim Nachrüsten ist oft ein eigener Batteriewechselrichter nötig (AC-Kopplung), dazu ein zweiter Montagetermin – im Rechenmodell rund ${eur(NACHRUEST)} netto Aufpreis. 2024 wurden ${fmt(ANTEIL_MIT_PV * 100)} % der Speicher gemeinsam mit der PV-Anlage errichtet.`,
    },
    {
      q: "Gibt es 2026 eine Förderung für Stromspeicher?",
      a: "Der EAG-Investitionszuschuss fördert Speicher nur in Verbindung mit einer PV-Anlage; der dritte Fördercall 2026 läuft von 8. bis 22. Oktober. Zusätzlich gibt es Programme einzelner Bundesländer. Details im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss).",
    },
    {
      q: "Wie lange hält ein Stromspeicher?",
      a: "Moderne LFP-Speicher sind auf mehrere tausend Vollzyklen ausgelegt; wirtschaftlich rechnen wir hier mit 15 Jahren. Entscheidend sind Garantiebedingungen, Temperatur und Betriebsweise. Details im Ratgeber [Stromspeicher-Lebensdauer](/ratgeber/stromspeicher-lebensdauer).",
    },
  ],

  passend: [
    { href: "/produkte/stromspeicher", titel: "Stromspeicher", text: "Speicher planen und einbauen lassen." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Speichergröße und Nutzen abschätzen." },
    { href: "/ratgeber/stromspeicher-groesse", titel: "Stromspeicher-Größe", text: "Welche Kapazität zu Ihrem Verbrauch passt." },
    { href: "/ratgeber/gewerbespeicher-kosten", titel: "Gewerbespeicher Kosten", text: "Speicher ab 50 kWh für Betriebe." },
  ],

  quellen: [
    { titel: "BMWET / FH Technikum Wien – PV-Batteriespeichersysteme: Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf", stand: "06/2025" },
    { titel: "nachhaltigwirtschaften.at – Schriftenreihe 2025-23: Marktentwicklung Energietechnologien", url: "https://nachhaltigwirtschaften.at/de/publikationen/schriftenreihe-2025-23-marktentwicklung-energietechnologien.php", stand: "06/2025" },
    { titel: "OeMAG – Marktpreis für Ökostromanlagen", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "RIS – BGBl. II Nr. 305/2025, Novelle der Systemnutzungsentgelte-Verordnung (Netzentgelte 2026)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "12/2025" },
    { titel: "E-Control – Begutachtungsentwurf SNE-G-V samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "EAG-Abwicklungsstelle – Förderkalender", url: "https://www.eag-abwicklungsstelle.at/foerderkalender/", stand: "09/2026" },
    { titel: "BloombergNEF – Lithium-Ion Battery Pack Prices Fall to $108 per Kilowatt-Hour", url: "https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/", stand: "12/2025" },
  ],

  seitenCta: { titel: "Welcher Speicher passt?", text: "Speichergröße und Nutzen für Ihren Verbrauch abschätzen.", href: "/rechner/stromspeicher", label: "Speicher berechnen" },
  cta: {
    title: "Speicher passend statt maximal planen.",
    text: "Wir legen Anlage und Speicher auf Ihren Verbrauch aus – mit ehrlicher Rechnung, ob sich der Speicher bei Ihnen lohnt.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Speicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
