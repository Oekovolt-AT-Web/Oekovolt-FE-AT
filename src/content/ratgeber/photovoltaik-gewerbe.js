// Ratgeber: Photovoltaik für Gewerbe und Unternehmen
// Beispielrechnung mit Preis- und Ertragsannahmen des Solarrechners,
// Strompreis KMU laut BDEW-Strompreisanalyse (2026), EEG-Sätze aus @/data/einspeiseverguetung.

import { ANNAHMEN, NEIGUNGEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { mischSatz } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwhFmt = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const pct = (x, st = 0) => (x * 100).toFixed(st).replace(".", ",") + " %";
const ctStr = (eurProKwh) => String(Math.round(eurProKwh * 1000) / 10).replace(".", ",");
const jahre = (x) => (x == null ? "über 20 Jahre" : x.toFixed(1).replace(".", ",") + " Jahre");

const jahreD = (x) => jahre(x).replace(/Jahre$/, "Jahren");

const KWP = 100;
const PREIS_BDEW = 0.172; // €/kWh netto, kleine bis mittlere Industriebetriebe 2026 (BDEW)
const PREIS_HOCH = 0.22; // Rechenvariante für Betriebe mit höherem Arbeitspreis
const FAKTOR_FLACH = NEIGUNGEN.find((n) => n.id === "flach")?.faktor ?? 0.9;
const INVEST = KWP * preisProKwp(KWP);
const ERTRAG = KWP * ANNAHMEN.ertragProKwpSued * FAKTOR_FLACH;
const SATZ = mischSatz(KWP, "teileinspeisung"); // ct/kWh

/** 20-Jahres-Rechnung vor Steuern: Eigenverbrauch spart Arbeitspreis, Rest wird vergütet. */
function gewerbe(evq, preis) {
  let kum = -INVEST;
  let amort = null;
  const cf = [-INVEST];
  for (let t = 1; t <= VERGUETUNG.garantieJahre; t++) {
    const d = Math.pow(1 - ANNAHMEN.degradationProJahr, t - 1);
    const netto =
      ERTRAG * d * evq * preis * Math.pow(1 + ANNAHMEN.strompreisSteigerung, t - 1) +
      ERTRAG * d * (1 - evq) * (SATZ / 100) -
      KWP * ANNAHMEN.betriebskostenProKwp * Math.pow(1 + ANNAHMEN.betriebskostenSteigerung, t - 1);
    const vorher = kum;
    kum += netto;
    cf.push(netto);
    if (amort === null && vorher < 0 && kum >= 0) amort = t - 1 + -vorher / netto;
  }
  let lo = -0.5;
  let hi = 0.5;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    const npv = cf.reduce((s, c, t) => s + c / Math.pow(1 + m, t), 0);
    if (npv > 0) lo = m;
    else hi = m;
  }
  return { jahr1: cf[1], amort, irr: (lo + hi) / 2, summe: kum };
}

const E30 = gewerbe(0.3, PREIS_BDEW);
const E50 = gewerbe(0.5, PREIS_BDEW);
const E70 = gewerbe(0.7, PREIS_BDEW);
const H50 = gewerbe(0.5, PREIS_HOCH);
const H70 = gewerbe(0.7, PREIS_HOCH);

const artikel = {
  slug: "photovoltaik-gewerbe",
  title: "Photovoltaik für Gewerbe: Wirtschaftlichkeit, Steuern und Planung",
  seoTitle: "Photovoltaik Gewerbe 2026: Rendite, AfA & IAB | Ökovolt",
  kurzTitel: "Photovoltaik Gewerbe",
  description:
    "Photovoltaik für Gewerbe 2026: Eigenverbrauch nach Lastgang, Rendite einer 100-kWp-Anlage, AfA, Investitionsabzugsbetrag, 100-kW-Grenze und Direktvermarktung.",
  excerpt:
    "Warum sich Solarstrom im Betrieb oft schneller rechnet als im Eigenheim, wie Lastgang, Abschreibung und EEG-Grenzen die Rendite bestimmen – mit Beispielrechnung für 100 kWp.",
  hauptKeyword: "photovoltaik gewerbe",
  keywords: [
    "Photovoltaik Gewerbe",
    "PV-Anlage Unternehmen",
    "Photovoltaik Firma Wirtschaftlichkeit",
    "Photovoltaik Abschreibung Gewerbe",
    "Investitionsabzugsbetrag Photovoltaik",
    "PV-Anlage Gewerbehalle",
    "Direktvermarktung 100 kWp",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg",
  bildAlt: "Luftaufnahme eines Gewerbegebiets mit Photovoltaikanlagen auf Hallendächern",
  badge: { wert: jahre(E50.amort).replace(" Jahre", " J."), text: `Amortisation 100 kWp bei 50 % Eigenverbrauch` },

  kurzFazit: [
    "**Photovoltaik rechnet sich im Gewerbe oft besonders gut, weil Betriebe tagsüber Strom verbrauchen – dann, wenn die Anlage erzeugt.** Entscheidend ist der Abgleich von Erzeugung und Lastgang.",
    `Eine 100-kWp-Dachanlage amortisiert sich in unserem Beispiel bei 50 % Eigenverbrauch und ${ctStr(PREIS_BDEW)} ct Arbeitspreis nach rund **${jahreD(E50.amort)}** (vor Steuern), bei 70 % nach ${jahreD(E70.amort)}.`,
    "**Steuerlich** ist die Anlage ein bewegliches Wirtschaftsgut: lineare AfA über 20 Jahre, für Anschaffungen bis Ende 2027 degressive AfA sowie – für kleinere Betriebe – Investitionsabzugsbetrag und 40 % Sonderabschreibung nach § 7g EStG.",
    "**Bei 100 kW** liegt eine wichtige Grenze: Darüber gibt es keine feste Einspeisevergütung mehr, der Überschuss muss direkt vermarktet werden. Ab 750 kW auf Gebäuden ist für eine Förderung ein Zuschlag in der Ausschreibung nötig.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich Photovoltaik für Unternehmen?",
      tocLabel: "Lohnt es sich?",
      bloecke: [
        {
          typ: "p",
          text: `**Für die meisten Betriebe mit Tagverbrauch lohnt sich eine eigene PV-Anlage – oft schneller als im Einfamilienhaus.** Produktion, Kühlung, Büro und Werkstatt verbrauchen Strom werktags zwischen 8 und 17 Uhr, also genau dann, wenn die Sonne scheint. Jede selbst genutzte Kilowattstunde ersetzt Netzstrom; für kleine bis mittlere Industriebetriebe nennt der BDEW 2026 einen durchschnittlichen Strompreis von ${ctStr(PREIS_BDEW)} ct/kWh. Eingespeister Strom bringt bei einer 100-kWp-Anlage dagegen im Mittel nur rund ${ct(SATZ)} ct.`,
        },
        {
          typ: "p",
          text: "Anders als im Privathaushalt kommen drei Hebel hinzu: Die Investition mindert über die Abschreibung den steuerpflichtigen Gewinn, die Umsatzsteuer ist als Vorsteuer abziehbar, und eine PV-Anlage sichert einen Teil der Energiekosten langfristig gegen Preissteigerungen ab. Dazu kommen weiche Faktoren wie Klimabilanz, Nachhaltigkeitsberichte und Anforderungen von Kunden.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Gut geeignet", text: "Produktion und Handwerk mit Tagschicht, Lebensmittelhandel und Kühlhäuser, Bürogebäude mit Klimatisierung, Landwirtschaft mit Melk- und Kühltechnik, Hotels mit Sommerbetrieb." },
            { titel: "Mit Planung geeignet", text: "Betriebe mit Mehrschicht- oder Wochenendbetrieb, Kfz-Betriebe mit E-Flotte – hier helfen Speicher, Lastmanagement und Ladesteuerung." },
            { titel: "Genau prüfen", text: "Lager mit sehr geringem Verbrauch, Hallen mit schwacher Dachstatik, gemietete Objekte ohne langfristigen Mietvertrag." },
          ],
        },
      ],
    },
    {
      id: "lastgang",
      titel: "Eigenverbrauch planen: Der Lastgang entscheidet",
      tocLabel: "Lastgang & Eigenverbrauch",
      bloecke: [
        {
          typ: "p",
          text: "**Die richtige Anlagengröße ergibt sich nicht aus der Dachfläche, sondern aus dem Lastgang – dem Stromverbrauch des Betriebs im Viertelstundenraster.** Betriebe mit mehr als 100.000 kWh Jahresverbrauch haben in der Regel eine registrierende Leistungsmessung (RLM). Der Netzbetreiber oder Messstellenbetreiber stellt diese Lastgangdaten auf Anfrage bereit, meist als Datei mit 35.040 Viertelstundenwerten für ein Jahr.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Lastgang anfordern", "12 Monate Viertelstundenwerte beim Netz- oder Messstellenbetreiber bzw. Energieversorger anfragen. Ohne RLM-Zähler helfen Monatsrechnungen und Betriebszeiten für eine erste Schätzung."],
            ["Grundlast und Tagesprofil auswerten", "Welche Leistung fließt werktags mittags mindestens? Diese Grundlast kann die Anlage fast vollständig decken."],
            ["Erzeugung simulieren", "Ertrag der möglichen Dachflächen je Viertelstunde gegen den Lastgang legen – daraus ergeben sich Eigenverbrauchsquote und Autarkie."],
            ["Wochenenden und Betriebsferien prüfen", "Stillstandszeiten im Sommer senken den Eigenverbrauch deutlich; hier entscheidet sich, ob Einspeisung oder Speicher sinnvoll ist."],
            ["Größe und Einspeisemodell festlegen", "Anlage auf hohen Eigenverbrauch oder bewusst größer mit Direktvermarktung auslegen – inklusive Blick auf die 100-kW-Grenze."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Leistungspreis: PV allein senkt Lastspitzen selten",
          text: "RLM-Kunden zahlen neben dem Arbeitspreis einen Leistungspreis für die höchste Viertelstunden-Last im Jahr. Diese Spitze tritt oft an Wintermorgen oder bei Schichtbeginn auf, wenn die Anlage wenig erzeugt. Für [Peak Shaving](/wissen/lexikon#peak-shaving) braucht es meist einen Speicher mit [Lastmanagement](/wissen/lexikon#lastmanagement) – rechnen Sie diesen Nutzen getrennt.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: 100 kWp auf dem Hallendach",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Wie stark der Eigenverbrauch die Wirtschaftlichkeit treibt, zeigt eine 100-kWp-Anlage auf einem Flachdach.** Annahmen: Investition ${eur(INVEST)} netto (${eur(preisProKwp(KWP))} je kWp), Ertrag ${kwhFmt(ERTRAG)} im Jahr, Einspeisevergütung anteilig ${ct(SATZ)} ct, Betriebskosten ${ANNAHMEN.betriebskostenProKwp} € je kWp, ${pct(ANNAHMEN.degradationProJahr, 1)} Degradation und ${Math.round(ANNAHMEN.strompreisSteigerung * 100)} % Strompreissteigerung pro Jahr.`,
        },
        {
          typ: "tabelle",
          caption: "100-kWp-Gewerbeanlage: Wirtschaftlichkeit vor Steuern über 20 Jahre, Stand September 2026",
          kopf: ["Eigenverbrauch / Arbeitspreis", "Vorteil Jahr 1", "Amortisation", "Rendite (IRR)", "Überschuss nach 20 J."],
          zeilen: [
            [`30 % / ${ctStr(PREIS_BDEW)} ct`, eur(E30.jahr1), jahre(E30.amort), pct(E30.irr, 1), eur(E30.summe)],
            [`50 % / ${ctStr(PREIS_BDEW)} ct`, eur(E50.jahr1), jahre(E50.amort), pct(E50.irr, 1), eur(E50.summe)],
            [`70 % / ${ctStr(PREIS_BDEW)} ct`, eur(E70.jahr1), jahre(E70.amort), pct(E70.irr, 1), eur(E70.summe)],
            [`50 % / ${ctStr(PREIS_HOCH)} ct`, eur(H50.jahr1), jahre(H50.amort), pct(H50.irr, 1), eur(H50.summe)],
            [`70 % / ${ctStr(PREIS_HOCH)} ct`, eur(H70.jahr1), jahre(H70.amort), pct(H70.irr, 1), eur(H70.summe)],
          ],
          markierteZeile: 1,
          hervorheben: 2,
          minBreite: 680,
          fussnote: `Orientierungswerte, keine Angebote. ${ctStr(PREIS_BDEW)} ct = BDEW-Durchschnitt 2026 für kleine bis mittlere Industriebetriebe; ${ctStr(PREIS_HOCH)} ct als Rechenvariante für Betriebe mit höherem Arbeitspreis. Spezifischer Ertrag ${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh/kWp × ${String(FAKTOR_FLACH).replace(".", ",")} (Flachdach) wie im Solarrechner. Ohne Steuerwirkung, Leistungspreis, Finanzierung und Speicher.`,
        },
        {
          typ: "p",
          text: `Das Muster ist eindeutig: Bei nur 30 % Eigenverbrauch dauert die Amortisation ${jahre(E30.amort)}, bei 70 % sind es ${jahre(E70.amort)}. Die Anlagengröße sollte sich deshalb am Verbrauch orientieren – oder der Überschuss muss über Direktvermarktung, Mieterstrom oder die Versorgung benachbarter Betriebsteile verwertet werden. Für ein Privatdach rechnen Sie mit dem [Solarrechner](/solarrechner); die Grundlagen der Rechnung erklärt der Ratgeber [Amortisation Photovoltaik](/ratgeber/photovoltaik-amortisation).`,
        },
        {
          typ: "tool",
          href: "/angebot",
          titel: "Gewerbeanlage auf Basis Ihres Lastgangs planen",
          text: "Dachfläche, Jahresverbrauch und Betriebszeiten angeben – die Grundlage für eine Auslegung passend zu Ihrem Verbrauch.",
          label: "Anfrage starten",
        },
      ],
    },
    {
      id: "steuern",
      titel: "Steuern: AfA, Investitionsabzugsbetrag und Umsatzsteuer",
      tocLabel: "Steuern & Abschreibung",
      bloecke: [
        {
          typ: "p",
          text: "**Im Betrieb ist die PV-Anlage ein abnutzbares bewegliches Wirtschaftsgut, dessen Kosten über die Abschreibung den Gewinn mindern.** Die Nutzungsdauer beträgt nach der amtlichen AfA-Tabelle 20 Jahre. Welche Variante sich lohnt, hängt von Gewinn, Steuersatz und Liquiditätsplanung ab – stimmen Sie die Entscheidung mit Ihrer Steuerberatung ab.",
        },
        {
          typ: "tabelle",
          caption: `Abschreibungsmöglichkeiten für eine gewerbliche PV-Anlage (Beispiel: ${eur(INVEST)} netto), Stand September 2026`,
          kopf: ["Instrument", "Regel", "Wirkung im ersten Jahr (Beispiel)"],
          zeilen: [
            ["Lineare AfA", "1/20 der Kosten pro Jahr (§ 7 Abs. 1 EStG)", eur(INVEST / 20)],
            ["Degressive AfA", "höchstens 3× linear und max. 30 % vom Restbuchwert – für Anschaffungen vom 1. Juli 2025 bis 31. Dezember 2027 (§ 7 Abs. 2 EStG); bei 20 Jahren also 15 %", eur(INVEST * 0.15)],
            ["Investitionsabzugsbetrag (IAB)", "bis 50 % der geplanten Kosten vorab gewinnmindernd, max. 200.000 € je Betrieb; Gewinn ohne IAB höchstens 200.000 € (§ 7g EStG)", `bis ${eur(INVEST * 0.5)} im Jahr vor der Investition`],
            ["Sonderabschreibung", "bis 40 % zusätzlich, verteilbar auf das Anschaffungsjahr und die vier Folgejahre; gleiche Gewinngrenze (§ 7g Abs. 5 EStG)", `bis ${eur(INVEST * 0.4)} (verteilbar)`],
          ],
          minBreite: 680,
          fussnote: "Vereinfachte Darstellung ohne Zeitanteil im Anschaffungsjahr und ohne Wechselwirkungen (ein genutzter IAB mindert die Bemessungsgrundlage der AfA). Keine Steuerberatung.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Kleine Anlagen sind steuerfrei – auch im Betrieb",
          text: "Nach § 3 Nr. 72 EStG sind Einnahmen aus PV-Anlagen bis 30 kWp je Wohn- oder Gewerbeeinheit und höchstens 100 kWp je Steuerpflichtigem oder Mitunternehmerschaft steuerfrei. Diese Befreiung gilt zwingend: Gewinne sind steuerfrei, im Gegenzug entfallen Abschreibung und Investitionsabzugsbetrag. Größere Anlagen unterliegen der normalen Besteuerung. Details im Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
        },
        { typ: "h3", text: "Umsatzsteuer: Vorsteuerabzug statt Nullsteuersatz" },
        {
          typ: "p",
          text: "Der [Nullsteuersatz](/wissen/lexikon#nullsteuersatz) nach § 12 Abs. 3 UStG gilt für Anlagen auf oder in der Nähe von Wohngebäuden sowie öffentlichen und gemeinwohlorientierten Gebäuden; bei Anlagen bis 30 kWp wird er vermutet. Eine größere Anlage auf einer Gewerbehalle wird dagegen in der Regel mit 19 % Umsatzsteuer abgerechnet. Unternehmen mit Vorsteuerabzug erhalten diese vom Finanzamt zurück – wirtschaftlich zählt der Nettopreis. Mehr unter [steuerliche Vorteile](/forderungen/steuerlich).",
        },
      ],
    },
    {
      id: "eeg-grenzen",
      titel: "100 kW, 750 kW, Solarspitzengesetz: Die EEG-Grenzen für Gewerbeanlagen",
      tocLabel: "EEG-Grenzen",
      bloecke: [
        {
          typ: "p",
          text: "**Mit der Anlagengröße ändern sich die Regeln für Vergütung, Technik und Vermarktung.** Die wichtigsten Schwellen im Überblick:",
        },
        {
          typ: "tabelle",
          caption: "Leistungsgrenzen für Dachanlagen nach EEG 2023, Stand September 2026",
          kopf: ["Installierte Leistung", "Vergütung / Vermarktung", "Technik & Pflichten"],
          zeilen: [
            ["bis 30 kWp", `feste Einspeisevergütung (${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct bis 10 kWp, ${ct(VERGUETUNG.saetze[1].teileinspeisung)} ct für den Anteil bis 40 kWp)`, "Steuerbefreiung nach § 3 Nr. 72 EStG je Einheit möglich"],
            ["bis 100 kWp", `feste Einspeisevergütung, anteilig gestaffelt (Anteil 40–100 kWp: ${ct(VERGUETUNG.saetze[2].teileinspeisung)} ct), Direktvermarktung freiwillig`, "ab 25 kW Fernsteuerbarkeit; ohne intelligentes Messsystem Begrenzung der Einspeisung nach § 9 EEG"],
            ["über 100 kWp", "keine feste Vergütung mehr: Pflicht zur Direktvermarktung, Förderung über die Marktprämie", "Fernsteuerbarkeit durch den Netzbetreiber und Direktvermarkter"],
            ["über 750 kWp (Gebäude)", "Marktprämie nur mit Zuschlag aus der Ausschreibung der Bundesnetzagentur (§ 22 EEG)", "Anschluss meist in der Mittelspannung"],
          ],
          minBreite: 680,
          fussnote: `Vergütungssätze für Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel} (Teileinspeisung). Neue Anlagen erhalten bei negativen Börsenstrompreisen keine Vergütung bzw. Marktprämie; der Zeitraum wird an das Förderende angehängt. Keine Rechtsberatung.`,
        },
        {
          typ: "p",
          text: "Knapp über 100 kWp zu planen, lohnt sich deshalb nur, wenn der Eigenverbrauch hoch ist oder die Direktvermarktung bewusst eingeplant wird – die Kosten des Direktvermarkters und der Messtechnik fallen bei kleinen Überschussmengen stärker ins Gewicht. Wie das funktioniert, erklärt unsere Seite zur [Direktvermarktung](/service/direktvermarktung). Die Folgen negativer Strompreise und der Einspeisebegrenzung beschreibt der Ratgeber [Solarspitzengesetz](/ratgeber/solarspitzengesetz).",
        },
      ],
    },
    {
      id: "planung",
      titel: "Dach, Statik, Netzanschluss: Was bei Gewerbeanlagen anders ist",
      tocLabel: "Planung & Technik",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Statik:** Leichte Trapezblech- und Sandwichdächer haben oft wenig Lastreserven. Ein Tragwerksplaner prüft, ob Ballast-Aufständerung möglich ist oder die Anlage mechanisch befestigt werden muss. Mehr im Ratgeber [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach).",
            "**Brandschutz:** Brandwände, Rettungswege und Abstände sind einzuhalten; bei Sonderbauten gelten zusätzliche Anforderungen. Die Feuerwehr sollte die Anlage kennen.",
            "**Netzanschluss:** Frühzeitig Netzverträglichkeit anfragen. Größere Anlagen werden oft über die Mittelspannung angeschlossen – dann gelten erweiterte technische Anschlussregeln und Nachweise.",
            "**Dachzustand und Mietverhältnis:** Das Dach sollte die Laufzeit der Anlage von 20 bis 30 Jahren überdauern. Bei gemieteten Hallen braucht es einen Gestattungsvertrag mit dem Eigentümer.",
            "**Solarpflicht:** Mehrere Bundesländer verlangen PV bei neuen Nichtwohngebäuden oder grundlegender Dachsanierung – siehe [Solarpflicht nach Bundesland](/ratgeber/solarpflicht-bundeslaender).",
            "**Genehmigung:** Dachanlagen sind meist verfahrensfrei, Ausnahmen gelten etwa beim Denkmalschutz. Details unter [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung).",
            "**Versicherung:** Betriebs- und Elektronikversicherung sowie Betriebshaftpflicht um die Anlage erweitern – siehe [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
          ],
        },
      ],
    },
    {
      id: "modelle",
      titel: "Finanzierung und Betreibermodelle für Unternehmen",
      tocLabel: "Betreibermodelle",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Eigeninvestition", text: "Höchste Rendite und volle Kontrolle. Finanzierbar über Eigenmittel, Hausbank oder den [KfW-Kredit 270](/ratgeber/kfw-kredit-270), der auch Unternehmen offensteht und bis zu 100 % der Investitionskosten finanziert." },
            { titel: "Leasing / Mietmodell", text: "Die Rate ist als Betriebsausgabe absetzbar, Eigenkapital bleibt frei. Gesamtkosten sind meist höher – die Überlegungen aus [Photovoltaik mieten oder kaufen](/ratgeber/photovoltaik-mieten-oder-kaufen) gelten sinngemäß." },
            { titel: "Dachpacht", text: "Ein Investor baut auf Ihrem Dach und zahlt Pacht. Sie erhalten keinen günstigen Eigenstrom, außer es wird zusätzlich ein Liefervertrag vereinbart. Sinnvoll vor allem bei großen Dächern mit geringem Eigenbedarf." },
            { titel: "Stromlieferung an Mieter", text: "Wer Solarstrom an gewerbliche Mieter oder Wohnungen im selben Gebäude liefert, übernimmt Pflichten eines Stromlieferanten. Modelle dafür zeigt die Seite [Mieterstrom](/produkte/mieterstrom)." },
          ],
        },
        {
          typ: "p",
          text: "Förderprogramme der Länder und Kommunen für Unternehmen ändern sich häufig; einige unterstützen Speicher oder Ladeinfrastruktur. Einen Überblick liefern [Landesförderungen](/forderungen/landesforderungen) und der [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "speicher-emobilitaet",
      titel: "Speicher, E-Flotte und Wärme: Eigenverbrauch im Betrieb erhöhen",
      tocLabel: "Eigenverbrauch erhöhen",
      bloecke: [
        {
          typ: "liste",
          punkte: [
            "**E-Flotte laden:** Dienstwagen und Transporter tagsüber mit Solarstrom zu laden, ist einer der wirksamsten Hebel. Voraussetzung ist ein Lastmanagement für die Ladepunkte – siehe [Wallbox](/produkte/wallbox) und [PV-Überschussladen](/ratgeber/pv-ueberschussladen).",
            "**Gewerbespeicher:** verschiebt Mittagsüberschüsse in Abend- und Nachtschichten und kann Lastspitzen kappen. Wirtschaftlich wird er meist erst durch die Kombination beider Effekte.",
            "**Wärme und Kälte:** Wärmepumpen, Kühlanlagen und Warmwasserbereitung lassen sich teils in die Mittagsstunden verlagern.",
            "**Energiemanagement:** Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) steuert Verbraucher, Speicher und Ladepunkte nach Erzeugung und Tarif.",
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie schnell amortisiert sich eine PV-Anlage im Gewerbe?",
      a: `Bei hohem Eigenverbrauch oft nach 8 bis 12 Jahren vor Steuern. In unserem Beispiel (100 kWp, ${ctStr(PREIS_BDEW)} ct Arbeitspreis) sind es bei 50 % Eigenverbrauch rund ${jahre(E50.amort)}, bei 70 % rund ${jahre(E70.amort)}. Die steuerliche Abschreibung verbessert die Liquidität zusätzlich.`,
    },
    {
      q: "Wie wird eine PV-Anlage im Betrieb abgeschrieben?",
      a: "Linear über 20 Jahre. Für Anschaffungen zwischen dem 1. Juli 2025 und dem 31. Dezember 2027 ist auch die degressive AfA mit bis zum Dreifachen des linearen Satzes (bei PV also 15 %) möglich. Kleinere Betriebe können zusätzlich Investitionsabzugsbetrag und Sonderabschreibung nach § 7g EStG nutzen.",
    },
    {
      q: "Kann ich für eine PV-Anlage einen Investitionsabzugsbetrag bilden?",
      a: "Ja, wenn der Gewinn ohne IAB höchstens 200.000 € beträgt und die Anlage fast ausschließlich betrieblich genutzt wird. Sie können bis zu 50 % der geplanten Kosten vorab abziehen. Für steuerfreie Anlagen nach § 3 Nr. 72 EStG ist das nicht möglich.",
    },
    {
      q: "Muss eine Gewerbe-PV-Anlage über 100 kWp direkt vermarktet werden?",
      a: "Ja. Nach § 21 EEG besteht der Anspruch auf feste Einspeisevergütung nur für Anlagen bis 100 kW. Größere Anlagen verkaufen ihren Überschuss über einen Direktvermarkter und erhalten die Marktprämie. Mehr dazu unter [Direktvermarktung](/service/direktvermarktung).",
    },
    {
      q: "Zahlt ein Unternehmen Umsatzsteuer auf die PV-Anlage?",
      a: "Auf Gewerbegebäuden wird eine Anlage über 30 kWp in der Regel mit 19 % Umsatzsteuer berechnet. Vorsteuerabzugsberechtigte Unternehmen bekommen sie erstattet, sodass wirtschaftlich der Nettopreis zählt. Der Nullsteuersatz gilt vor allem für Wohngebäude und gemeinwohlorientierte Gebäude.",
    },
    {
      q: "Welche Anlagengröße ist für mein Unternehmen richtig?",
      a: "Die Größe sollte sich am Lastgang orientieren: Die Anlage kann die werktägliche Grundlast mittags weitgehend decken. Überschüsse lohnen sich nur, wenn Einspeisung oder Direktvermarktung eingeplant sind oder E-Flotte und Speicher den Eigenverbrauch erhöhen.",
    },
    {
      q: "Gibt es eine Solarpflicht für Gewerbegebäude?",
      a: "In mehreren Bundesländern ja – meist bei Neubauten von Nichtwohngebäuden, teils auch bei Dachsanierungen oder großen Parkplätzen. Eine Übersicht bietet der Ratgeber [Solarpflicht](/ratgeber/solarpflicht-bundeslaender).",
    },
  ],

  passend: [
    { href: "/dienstleistungen/photovoltaik", titel: "Photovoltaik vom Fachbetrieb", text: "Planung, Montage und Anmeldung aus einer Hand." },
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Überschuss über 100 kWp vermarkten." },
    { href: "/ratgeber/photovoltaik-steuern", titel: "Photovoltaik und Steuern", text: "Nullsteuersatz, Steuerbefreiung und Gewerbe." },
    { href: "/ratgeber/photovoltaik-flachdach", titel: "Photovoltaik auf dem Flachdach", text: "Aufständerung, Ballast und Statik." },
  ],

  quellen: [
    { titel: "BDEW – Strompreisanalyse (Haushalte und Industrie)", url: "https://www.bdew.de/service/daten-und-grafiken/bdew-strompreisanalyse/", stand: "08/2026" },
    { titel: "§ 7g EStG – Investitionsabzugsbeträge und Sonderabschreibungen", url: "https://www.gesetze-im-internet.de/estg/__7g.html", stand: "09/2026" },
    { titel: "§ 7 EStG – Absetzung für Abnutzung (degressive AfA)", url: "https://www.gesetze-im-internet.de/estg/__7.html", stand: "09/2026" },
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung Photovoltaik", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
    { titel: "§ 21 EEG 2023 – Einspeisevergütung bis 100 kW", url: "https://www.gesetze-im-internet.de/eeg_2014/__21.html", stand: "09/2026" },
    { titel: "§ 22 EEG 2023 – Ausschreibungspflicht für Solaranlagen", url: "https://www.gesetze-im-internet.de/eeg_2014/__22.html", stand: "09/2026" },
    { titel: "§ 9 EEG 2023 – Technische Vorgaben", url: "https://www.gesetze-im-internet.de/eeg_2014/__9.html", stand: "09/2026" },
    { titel: "KfW – Erneuerbare Energien – Standard (270)", url: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Erneuerbare-Energien-Standard-(270)/", stand: "09/2026" },
  ],

  seitenCta: { titel: "PV für Ihren Betrieb?", text: "Anlage passend zu Verbrauch und Dach anfragen.", href: "/angebot", label: "Anfrage starten" },
  cta: {
    title: "Solarstrom für Ihren Betrieb – passend zum Lastgang.",
    text: "Planung, Montage und Anmeldung aus einer Hand – vom Fachbetrieb aus Türkheim mit über 15 Jahren Erfahrung.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },
};

export default artikel;
