// Ratgeber: PV-Anlage – Größe berechnen
// Verbrauchswerte: Stromspiegel für Deutschland 2025 (co2online). Szenarien: Rechenkern des
// Solarrechners (berechne) mit den zentralen Annahmen. Rechtliche Schwellen: EEG, EStG, MsbG,
// Recherchestand September 2026.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { SPEICHER } from "@/lib/rechner/annahmen";
import { berechne } from "@/lib/solarrechner";

const n0 = (v) => Math.round(v).toLocaleString("de-DE");
const eur = (v) => `${n0(v)} €`;
const pct = (v) => `${Math.round(v * 100)} %`;
const jahre = (r) => (r.amortisationJahre ? `${r.amortisationJahre.toFixed(1).replace(".", ",")} J.` : "über 20 J.");

// Beispielhaushalt: 4 Personen im Einfamilienhaus (Stromspiegel 2025: 3.800 kWh ohne elektrische Warmwasserbereitung)
const HAUSHALT = 3800;
const KM = 12000;
const EAUTO = Math.round((KM * SPEICHER.eAutoVerbrauch) / 100 * SPEICHER.eAutoLadeanteilZuhause);
const WP = SPEICHER.wpStromKwh;
const GESAMT = HAUSHALT + WP + EAUTO;

const GROESSEN = [4, 6, 8, 10, 12, 15, 20];
const szenario = (verbrauch, speicherKwh) =>
  GROESSEN.map((kwp) => ({
    kwp,
    ohne: berechne({ kwp, ausrichtung: "sued", neigung: "mittel", verbrauch, speicherKwh: 0 }),
    mit: berechne({ kwp, ausrichtung: "sued", neigung: "mittel", verbrauch, speicherKwh }),
  }));
const A = szenario(HAUSHALT, 6);
const B = szenario(GESAMT, 10);
const bestIndex = (liste) => liste.reduce((best, x, i) => (x.ohne.ertrag20Jahre > liste[best].ohne.ertrag20Jahre ? i : best), 0);

const artikel = {
  slug: "pv-anlage-groesse-berechnen",
  title: "PV-Anlage: Größe berechnen – so viel kWp brauchen Sie wirklich",
  seoTitle: "PV-Anlage Größe berechnen: kWp richtig planen | Ökovolt",
  kurzTitel: "PV-Größe berechnen",
  description:
    "PV-Anlage Größe berechnen: Faustregeln, Verbrauch nach Haushaltsgröße, Dachfläche je kWp, Wärmepumpe und E-Auto – mit Beispielrechnungen und den wichtigen Grenzen 2026.",
  excerpt:
    "Wie viel kWp passen zu Ihrem Haushalt – und wann lohnt es sich, das Dach voll zu belegen? Faustregeln, Verbrauchstabellen und zwei durchgerechnete Beispiele mit und ohne Wärmepumpe.",
  hauptKeyword: "pv anlage größe berechnen",
  keywords: [
    "PV-Anlage Größe berechnen",
    "Wie viel kWp brauche ich",
    "Photovoltaik Größe Einfamilienhaus",
    "PV-Anlage Dimensionierung",
    "kWp pro Quadratmeter Dachfläche",
    "PV-Anlage Größe Wärmepumpe E-Auto",
    "Faustregel Photovoltaik Größe",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Home/download.jpg",
  bildAlt: "Luftbild eines Hausdachs mit Photovoltaikmodulen",
  badge: { wert: `~${ANNAHMEN.qmProKwp} m²`, text: "Dachfläche je kWp Anlagenleistung" },

  kurzFazit: [
    "**Faustregel: Planen Sie mindestens 1 bis 1,5 kWp je 1.000 kWh Jahresverbrauch – und belegen Sie das Dach eher großzügig.** Für einen typischen Haushalt sind das 6 bis 12 kWp.",
    `**Mit Wärmepumpe und E-Auto** steigt der Verbrauch schnell auf rund ${n0(GESAMT)} kWh. Dann sind 12 bis 20 kWp sinnvoll, soweit das Dach Platz bietet.`,
    `**Je kWp brauchen Sie rund ${ANNAHMEN.qmProKwp} m² Dachfläche.** Ein 50 m² großes, freies Süddach trägt also etwa 10 kWp.`,
    "Größer heißt nicht automatisch unwirtschaftlich: Der Preis je kWp sinkt mit der Anlagengröße, und künftige Verbraucher lassen sich später kaum günstig nachrüsten.",
    "Wichtige Schwellen sind **7 kW** (Smart-Meter-Pflicht), **25 kW** (Fernsteuerbarkeit) und **30 kWp** (Steuerbefreiung je Einheit).",
  ],

  abschnitte: [
    {
      id: "faustregeln",
      titel: "Wie groß sollte eine PV-Anlage sein? Die Faustregeln",
      tocLabel: "Faustregeln",
      bloecke: [
        {
          typ: "p",
          text: "**Die passende Größe ergibt sich aus drei Grenzen: Ihrem Stromverbrauch (heute und künftig), der nutzbaren Dachfläche und Ihrem Budget.** Weil die [Einspeisevergütung](/ratgeber/einspeiseverguetung-2026) niedrig ist, zählt heute vor allem der selbst genutzte Solarstrom. Trotzdem wäre es ein Fehler, die Anlage nur auf den heutigen Verbrauch zuzuschneiden – im Winter liefert jede Anlage zu wenig, im Sommer fast immer zu viel.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Nach Verbrauch", text: "Mindestens 1 bis 1,5 kWp je 1.000 kWh Jahresverbrauch. Bei 4.000 kWh also 4 bis 6 kWp – eher die Untergrenze." },
            { titel: "Nach Dachfläche", text: `Nutzbare Dachfläche geteilt durch rund ${ANNAHMEN.qmProKwp} m² je kWp. Belegen Sie wirtschaftlich sinnvolle Flächen möglichst vollständig.` },
            { titel: "Nach Zukunft", text: "Wärmepumpe, E-Auto oder Klimagerät geplant? Dann jetzt größer bauen – ein zweites Gerüst und eine Erweiterung kosten später deutlich mehr." },
          ],
        },
        {
          typ: "kennzahl",
          wert: "6–12 kWp",
          titel: "typische Größe für ein Einfamilienhaus ohne Wärmepumpe",
          text: `Mit Wärmepumpe und E-Auto sind 12 bis 20 kWp üblich. Die Werte setzen ein geeignetes Dach voraus; unser Solarrechner rechnet mit ${n0(ANNAHMEN.ertragProKwpSued)} kWh Ertrag je kWp auf einem Süddach.`,
        },
      ],
    },
    {
      id: "verbrauch",
      titel: "Schritt 1: Den eigenen Stromverbrauch ermitteln",
      tocLabel: "Verbrauch ermitteln",
      bloecke: [
        {
          typ: "p",
          text: "**Am genauesten ist der Jahresverbrauch von Ihren letzten Stromrechnungen.** Liegt keine Abrechnung vor – etwa im Neubau – helfen die Vergleichswerte des Stromspiegels 2025. Ein Einfamilienhaus verbraucht bei gleicher Personenzahl deutlich mehr als eine Wohnung, weil Heizungspumpe, Außenbeleuchtung und Geräte in Keller und Garage dazukommen.",
        },
        {
          typ: "tabelle",
          caption: "Durchschnittlicher Stromverbrauch im Einfamilienhaus nach Personenzahl (Stromspiegel 2025)",
          kopf: ["Personen", "Warmwasser nicht elektrisch", "Warmwasser elektrisch", "Richtwert PV-Größe (Haushalt)"],
          zeilen: [
            ["1", "ca. 1.800 kWh", "ca. 2.100 kWh", "4–5 kWp"],
            ["2", "2.700 kWh", "3.200 kWh", "5–7 kWp"],
            ["3", "3.500 kWh", "4.100 kWh", "6–9 kWp"],
            ["4", "3.800 kWh", "4.700 kWh", "7–10 kWp"],
            ["5", "4.500 kWh", "6.000 kWh", "8–12 kWp"],
          ],
          hervorheben: 3,
          fussnote: "Verbrauchswerte: Stromspiegel für Deutschland 2025 (co2online), Einfamilien- bzw. Zweifamilienhaus. Die PV-Richtwerte sind Orientierungen für den reinen Haushaltsstrom; kleine Anlagen sind je kWp teurer, daher die Untergrenze von rund 4 kWp.",
        },
        { typ: "h3", text: "Künftige Verbraucher addieren" },
        {
          typ: "tabelle",
          caption: "Zusätzlicher Strombedarf durch Wärmepumpe, E-Auto und Co.",
          kopf: ["Verbraucher", "Zusätzlicher Bedarf pro Jahr", "Rechenweg"],
          zeilen: [
            ["Wärmepumpe (Einfamilienhaus)", `ca. 3.000–5.000 kWh, typisch ${n0(WP)} kWh`, "Wärmebedarf ÷ Jahresarbeitszahl"],
            ["E-Auto", `ca. ${n0(EAUTO)} kWh bei ${n0(KM)} km`, `${n0(KM)} km × ${SPEICHER.eAutoVerbrauch} kWh/100 km × ${pct(SPEICHER.eAutoLadeanteilZuhause)} Ladeanteil zu Hause`],
            ["Elektrische Warmwasserbereitung", "ca. 300 kWh je Person", "co2online: im Schnitt rund 305 kWh je Person"],
            ["Klimagerät, Pool, Sauna", "je nach Nutzung 300–2.000 kWh", "Leistung × Betriebsstunden"],
          ],
          minBreite: 620,
          fussnote: "E-Auto und Wärmepumpe mit den Annahmen unserer Rechner (18 kWh/100 km inkl. Ladeverlusten, 80 % Laden zu Hause). Den Strombedarf einer Wärmepumpe für Ihr Haus schätzt der Wärmepumpen-Rechner.",
        },
        {
          typ: "p",
          text: "Wie viel Strom eine Wärmepumpe in Ihrem Gebäude braucht, hängt vor allem von Wärmebedarf und Jahresarbeitszahl ab – eine erste Schätzung liefert der [Wärmepumpen-Rechner](/rechner/waermepumpe). Für das E-Auto zählt, wie oft es tagsüber zu Hause steht; nur dann kann es Solarstrom laden. Mehr dazu im Ratgeber [PV-Überschussladen](/ratgeber/pv-ueberschussladen).",
        },
      ],
    },
    {
      id: "dachflaeche",
      titel: "Schritt 2: Wie viel kWp passen auf Ihr Dach?",
      tocLabel: "Dachfläche",
      bloecke: [
        {
          typ: "p",
          text: `**Rechnen Sie mit etwa ${ANNAHMEN.qmProKwp} m² Dachfläche je kWp.** Ein aktuelles Modul mit rund 450 Wp misst etwa 1,7 × 1,1 m; dazu kommen Klemmbereiche, Fugen und Abstände zu Dachrand, First und Kaminen. Die belegbare Fläche ist deshalb kleiner als die Dachfläche – bei Satteldächern mit Fenstern oder Gauben oft nur 60 bis 80 %.`,
        },
        {
          typ: "tabelle",
          caption: "Dachfläche und mögliche Anlagenleistung (Orientierung)",
          kopf: ["Belegbare Dachfläche", "Anzahl Module (ca. 450 Wp)", "Anlagenleistung", "Jahresertrag Süd (ca.)"],
          zeilen: [20, 30, 40, 50, 60, 80, 100].map((qm) => {
            const kwp = qm / ANNAHMEN.qmProKwp;
            return [`${qm} m²`, `${Math.floor((kwp * 1000) / 450)}`, `${n0(kwp)} kWp`, `${n0(kwp * ANNAHMEN.ertragProKwpSued)} kWh`];
          }),
          minBreite: 560,
          fussnote: `Belegbare Fläche nach Abzug von Randabständen, Fenstern und Aufbauten. Ertrag mit dem vorsichtigen Planungswert von ${n0(ANNAHMEN.ertragProKwpSued)} kWh je kWp; Region, Ausrichtung und Neigung verändern den Wert (siehe Ratgeber „Ertrag pro kWp“).`,
        },
        {
          typ: "p",
          text: "Ost- und Westdächer lassen sich beidseitig belegen und bringen so oft mehr Gesamtleistung als eine einzelne Südseite – bei rund 15 % weniger Ertrag je kWp. Auf Flachdächern hängt die Leistung stark von der Aufständerung ab: Ost-West-Systeme belegen die Fläche deutlich dichter als nach Süden aufgeständerte Reihen. Details im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
        },
      ],
    },
    {
      id: "beispiele",
      titel: "Schritt 3: Größen vergleichen – zwei Beispielrechnungen",
      tocLabel: "Beispielrechnungen",
      bloecke: [
        {
          typ: "p",
          text: `**Die folgenden Tabellen zeigen, was mehr Leistung bringt.** Gerechnet mit dem Rechenkern unseres [Solarrechners](/solarrechner): Süddach, ${n0(ANNAHMEN.ertragProKwpSued)} kWh je kWp, ${String(ANNAHMEN.strompreis * 100).replace(".", ",")} ct Strompreis, ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct Einspeisevergütung bis 10 kWp, Anlagenpreise je kWp nach Größe gestaffelt, Speicher ${eur(ANNAHMEN.speicherPreisProKwh)} je kWh.`,
        },
        { typ: "h3", text: `Beispiel A: 4-Personen-Haushalt, ${n0(HAUSHALT)} kWh, ohne Wärmepumpe` },
        {
          typ: "tabelle",
          caption: `Anlagengröße im Vergleich bei ${n0(HAUSHALT)} kWh Jahresverbrauch (Süddach)`,
          kopf: ["Anlage", "Investition", "Autarkie ohne Speicher", "Autarkie mit 6 kWh", "Amortisation ohne Speicher", "Überschuss nach 20 Jahren"],
          zeilen: A.map(({ kwp, ohne, mit }) => [`**${kwp} kWp**`, eur(ohne.investition), pct(ohne.autarkie), pct(mit.autarkie), jahre(ohne), eur(ohne.ertrag20Jahre)]),
          hervorheben: 5,
          markierteZeile: bestIndex(A),
          minBreite: 780,
          fussnote: "Orientierungswerte, keine Angebote. Überschuss nach 20 Jahren = Summe aus Stromersparnis und Einspeiseerlös abzüglich Betriebskosten und Investition, ohne Speicher. Nach 20 Jahren arbeitet eine Anlage in der Regel weiter; dieser Zusatznutzen ist nicht enthalten.",
        },
        {
          typ: "p",
          text: `Das Ergebnis: Ohne Speicher steigt die Autarkie ab etwa 8 kWp kaum noch – sie bleibt bei rund ${pct(A[3].ohne.autarkie)}, weil abends und nachts niemand Solarstrom liefert. Der größte Überschuss nach 20 Jahren entsteht in diesem Beispiel bei **${A[bestIndex(A)].kwp} kWp**. Größere Anlagen amortisieren sich etwas langsamer, bleiben aber wirtschaftlich positiv – und schaffen Reserve für spätere Verbraucher.`,
        },
        { typ: "h3", text: `Beispiel B: derselbe Haushalt mit Wärmepumpe und E-Auto, ${n0(GESAMT)} kWh` },
        {
          typ: "tabelle",
          caption: `Anlagengröße im Vergleich bei ${n0(GESAMT)} kWh Jahresverbrauch (Süddach)`,
          kopf: ["Anlage", "Investition", "Autarkie ohne Speicher", "Autarkie mit 10 kWh", "Amortisation ohne Speicher", "Überschuss nach 20 Jahren"],
          zeilen: B.map(({ kwp, ohne, mit }) => [`**${kwp} kWp**`, eur(ohne.investition), pct(ohne.autarkie), pct(mit.autarkie), jahre(ohne), eur(ohne.ertrag20Jahre)]),
          hervorheben: 5,
          markierteZeile: bestIndex(B),
          minBreite: 780,
          fussnote: `Haushalt ${n0(HAUSHALT)} kWh + Wärmepumpe ${n0(WP)} kWh + E-Auto ${n0(EAUTO)} kWh. Vereinfachte Jahresbetrachtung; der hohe Winterbedarf der Wärmepumpe wird über die Autarkiekurve des Solarrechners näherungsweise berücksichtigt.`,
        },
        {
          typ: "p",
          text: `Mit Wärmepumpe und E-Auto verschiebt sich das Optimum deutlich nach oben: Hier wächst der Überschuss bis ${B[B.length - 1].kwp} kWp weiter, die Amortisation bleibt bei rund ${B[3].ohne.amortisationJahre ? Math.round(B[3].ohne.amortisationJahre) : "10"} bis ${B[B.length - 1].ohne.amortisationJahre ? Math.round(B[B.length - 1].ohne.amortisationJahre) : "12"} Jahren. Wie viel Solarstrom eine Wärmepumpe tatsächlich nutzen kann, erklärt der Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).`,
        },
        { typ: "tool", href: "/solarrechner", titel: "Ihre Größe selbst durchrechnen", text: "Verbrauch, Dachausrichtung und Speicher eingeben – Autarkie, Amortisation und 20-Jahres-Cashflow sofort sehen.", label: "Zum Solarrechner" },
      ],
    },
    {
      id: "grenzen",
      titel: "Welche Größengrenzen sind wichtig?",
      tocLabel: "Wichtige Grenzen",
      bloecke: [
        {
          typ: "p",
          text: "**Für Hausanlagen sind vor allem die Schwellen bei 7 kW, 25 kW und 30 kWp relevant.** Die oft zitierte 10-kWp-Grenze ist dagegen keine Hürde mehr: Die Vergütung wird anteilig berechnet, sodass eine 12-kWp-Anlage nur für die letzten 2 kWp den etwas niedrigeren Satz erhält.",
        },
        {
          typ: "tabelle",
          caption: "Rechtliche und technische Schwellen nach Anlagengröße, Stand September 2026",
          kopf: ["Schwelle", "Was sich ändert", "Rechtsgrundlage"],
          zeilen: [
            ["unter 25 kW", "Bis zum Einbau eines intelligenten Messsystems höchstens 60 % der installierten Leistung einspeisen (Neuanlagen; Steckersolar bis 2 kW/800 VA ausgenommen)", "§ 9 Abs. 2 EEG"],
            ["über 7 kW", "Pflichteinbau eines intelligenten Messsystems mit Steuerungseinrichtung durch den Messstellenbetreiber; jährliche Kosten gesetzlich gedeckelt", "§ 29, § 30 MsbG"],
            ["10 kWp", `Vergütung sinkt anteilig: ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct bis 10 kWp, ${ct(VERGUETUNG.saetze[1].teileinspeisung)} ct für den Teil darüber`, "§ 48 EEG"],
            ["25 bis 100 kW", "Zusätzlich fernsteuerbar für den Netzbetreiber; bis zum Smart Meter gilt auch hier die 60-%-Begrenzung", "§ 9 Abs. 2 EEG"],
            ["30 kWp", "Einnahmen steuerfrei bis 30 kWp je Wohn- oder Gewerbeeinheit (max. 100 kWp je Person); Nullsteuersatz beim Kauf gilt als erfüllt", "§ 3 Nr. 72 EStG, § 12 Abs. 3 UStG"],
            ["30 kVA", "Zentraler Netz- und Anlagenschutz am Zählerplatz erforderlich", "VDE-AR-N 4105"],
            ["100 kWp", "Pflicht zur Direktvermarktung statt fester Einspeisevergütung", "§ 21 EEG"],
          ],
          minBreite: 700,
          fussnote: "Vereinfachte Übersicht, keine Rechts- oder Steuerberatung. Mehrere Anlagen auf einem Grundstück, die innerhalb von zwölf Monaten in Betrieb gehen, gelten nach § 9 Abs. 3 EEG als eine Anlage.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Smart Meter ist kein Grund, unter 7 kW zu bleiben",
          text: "Das intelligente Messsystem kostet jährlich eine gedeckelte Gebühr, hebt aber die feste 60-%-Einspeisegrenze auf und ist Voraussetzung für dynamische Stromtarife und die Netzentgeltreduzierung nach § 14a EnWG. Mehr dazu im Ratgeber [Smart-Meter-Pflicht](/ratgeber/smart-meter-pflicht) und zu den Steuerfragen unter [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
        },
      ],
    },
    {
      id: "speicher",
      titel: "Und wie groß sollte der Speicher sein?",
      tocLabel: "Speichergröße",
      bloecke: [
        {
          typ: "p",
          text: "**Die HTW Berlin empfiehlt als Obergrenze rund 1,5 kWh nutzbare Speicherkapazität je 1.000 kWh Jahresverbrauch – und nicht mehr als 1,5 kWh je kWp Anlagenleistung.** Für einen Haushalt mit 4.000 kWh wären das höchstens etwa 6 kWh. Größere Speicher werden in vielen Nächten nicht mehr leer und in vielen Wintertagen nicht mehr voll.",
        },
        {
          typ: "p",
          text: `Ein Speicher erhöht die Autarkie im Beispiel A bei 10 kWp von ${pct(A[3].ohne.autarkie)} auf ${pct(A[3].mit.autarkie)}. Ob sich das rechnet, hängt vom Preis und Ihrem Abendverbrauch ab. Details liefern der Ratgeber [Stromspeicher-Größe berechnen](/ratgeber/stromspeicher-groesse) und der [Stromspeicher-Rechner](/rechner/stromspeicher).`,
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler bei der Größenplanung",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Nur auf den heutigen Verbrauch planen:** Wärmepumpe oder E-Auto kommen oft wenige Jahre später – eine Erweiterung kostet dann Gerüst, Anfahrt und oft einen zweiten Wechselrichter.",
            "**Aus Angst vor der 10-kWp-Grenze kleiner bauen:** Die Vergütung ist anteilig, der Preis je kWp sinkt mit der Größe.",
            "**Unwirtschaftliche Flächen mitbelegen:** Stark verschattete Dachteile oder steile Norddächer senken den Ertrag je investiertem Euro.",
            "**Wechselrichter und Hausanschluss vergessen:** Die Größe muss zum [Wechselrichter](/ratgeber/wechselrichter-photovoltaik), zum Zählerschrank und zu den Vorgaben des Netzbetreibers passen.",
            "**Dach nicht vorher prüfen:** Steht eine Dachsanierung an, erst sanieren – eine spätere Demontage kostet mehrere tausend Euro.",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "In 5 Schritten zur richtigen Anlagengröße",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Verbrauch notieren", "Jahresverbrauch der letzten Stromrechnungen, bei Neubau Stromspiegel-Wert ansetzen."],
            ["Zukunft addieren", `Wärmepumpe (ca. ${n0(WP)} kWh), E-Auto (ca. ${n0(EAUTO)} kWh bei ${n0(KM)} km) und weitere Verbraucher für die nächsten 10 Jahre einrechnen.`],
            ["Dachfläche prüfen", `Belegbare, unverschattete Flächen ausmessen und durch ${ANNAHMEN.qmProKwp} m² je kWp teilen – das ist die Obergrenze.`],
            ["Varianten rechnen", "Zwei bis drei Größen mit dem [Solarrechner](/solarrechner) vergleichen, mit und ohne Speicher."],
            ["Vor Ort planen lassen", "Statik, Verschattung, Zählerschrank und Netzanschluss prüfen lassen – daraus entsteht die endgültige Modulbelegung und ein belastbares [Angebot](/angebot)."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Wie viel kWp brauche ich für 4.000 kWh Verbrauch?", a: "Mindestens 4 bis 6 kWp; wirtschaftlich sinnvoll sind oft 8 bis 10 kWp, wenn das Dach Platz bietet. Ohne Speicher deckt die Anlage dann rund ein Drittel des Verbrauchs, mit Speicher etwa zwei Drittel." },
    { q: "Wie groß sollte eine PV-Anlage für ein Einfamilienhaus sein?", a: "Ohne Wärmepumpe und E-Auto meist 6 bis 12 kWp, mit beiden eher 12 bis 20 kWp. Maßgeblich sind Verbrauch, nutzbare Dachfläche und Budget." },
    { q: "Wie viel Dachfläche braucht 1 kWp?", a: `Rund ${ANNAHMEN.qmProKwp} m² Dachfläche, inklusive Abständen und Fugen. Die reine Modulfläche liegt bei aktuellen Modulen mit etwa 23 % Wirkungsgrad bei gut 4 m² je kWp.` },
    { q: "Welche PV-Größe brauche ich mit Wärmepumpe?", a: "Rechnen Sie den Strombedarf der Wärmepumpe (typisch 3.000 bis 5.000 kWh) zum Haushaltsstrom hinzu und planen Sie rund 1 bis 1,5 kWp je 1.000 kWh Gesamtverbrauch. Beachten Sie, dass die Wärmepumpe vor allem im Winter Strom braucht, wenn die PV-Anlage wenig liefert." },
    { q: "Ist eine PV-Anlage über 10 kWp noch sinnvoll?", a: `Ja. Die Vergütung wird anteilig berechnet: ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct für die ersten 10 kWp, ${ct(VERGUETUNG.saetze[1].teileinspeisung)} ct für den Rest. Steuerlich bleiben Anlagen bis 30 kWp je Wohneinheit begünstigt.` },
    { q: "Kann eine PV-Anlage zu groß sein?", a: "Wirtschaftlich ja, wenn viel Strom zu niedriger Vergütung eingespeist wird und der Preis je kWp nicht mehr sinkt. Technisch begrenzen Dachfläche, Hausanschluss und Vorgaben des Netzbetreibers die Größe. Unsere Beispielrechnung zeigt, dass ohne Zusatzverbraucher der Überschuss ab einer gewissen Größe wieder sinkt." },
    { q: "Kann ich meine PV-Anlage später erweitern?", a: "Grundsätzlich ja, meist als zweite Anlage mit eigenem Inbetriebnahmedatum. Das ist aber teurer als von Anfang an größer zu bauen: Gerüst, Anmeldung, oft ein zusätzlicher Wechselrichter und die Abstimmung mit dem Netzbetreiber fallen erneut an." },
  ],

  howTo: {
    name: "PV-Anlagengröße berechnen",
    schritte: [
      { name: "Stromverbrauch ermitteln", text: "Jahresverbrauch aus den letzten Stromrechnungen ablesen oder Stromspiegel-Werte nutzen." },
      { name: "Künftige Verbraucher addieren", text: "Strombedarf von Wärmepumpe, E-Auto und weiteren Verbrauchern für die nächsten Jahre hinzurechnen." },
      { name: "Dachfläche prüfen", text: "Belegbare Dachfläche ermitteln und durch rund 5 m² je kWp teilen." },
      { name: "Größen vergleichen", text: "Mehrere Anlagengrößen mit und ohne Speicher im Solarrechner vergleichen." },
      { name: "Vor Ort planen lassen", text: "Statik, Verschattung, Zählerschrank und Netzanschluss durch einen Fachbetrieb prüfen lassen." },
    ],
  },

  passend: [
    { href: "/ratgeber/photovoltaik-ertrag-pro-kwp", titel: "Ertrag pro kWp", text: "Ertragswerte nach Region, Monat und Dachausrichtung." },
    { href: "/ratgeber/stromspeicher-groesse", titel: "Stromspeicher-Größe berechnen", text: "Wie viel Kapazität zu Ihrer Anlage passt." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp nach Anlagengröße." },
    { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Strombedarf und Kosten Ihrer Wärmepumpe abschätzen." },
  ],

  quellen: [
    { titel: "Stromspiegel für Deutschland 2025 (co2online) – Stromverbrauch nach Haushaltsgröße", url: "https://www.stromspiegel.de/stromverbrauch-verstehen/stromverbrauch-4-personen-haushalt/", stand: "05/2025" },
    { titel: "HTW Berlin – FAQ zum Unabhängigkeitsrechner (Speicherdimensionierung)", url: "https://solar.htw-berlin.de/faq-unabhaengigkeitsrechner/", stand: "09/2026" },
    { titel: "§ 9 EEG 2023 – Technische Vorgaben (Steuerbarkeit, 60-%-Begrenzung)", url: "https://www.gesetze-im-internet.de/eeg_2014/__9.html", stand: "09/2026" },
    { titel: "§ 29 MsbG – Ausstattung von Messstellen mit intelligenten Messsystemen", url: "https://www.gesetze-im-internet.de/messbg/__29.html", stand: "09/2026" },
    { titel: "§ 30 MsbG – Preisobergrenzen", url: "https://www.gesetze-im-internet.de/messbg/__30.html", stand: "09/2026" },
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
  ],

  seitenCta: { titel: "Wie viel kWp passen zu Ihnen?", text: "Verbrauch und Dach eingeben – Größen in Sekunden vergleichen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Wir planen die Größe, die zu Ihrem Haus passt.",
    text: "Mit Blick auf heutigen und künftigen Verbrauch, Dachfläche, Statik und Zählerschrank – und einer Wirtschaftlichkeitsrechnung für mehrere Varianten.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
