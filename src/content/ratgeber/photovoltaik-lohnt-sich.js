// Ratgeber: Lohnt sich Photovoltaik 2026?
// Referenzartikel für das Inhaltsformat (siehe README.md im selben Ordner).
// Zahlen kommen aus denselben Quellen wie Solarrechner und Preisartikel.

import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { berechne } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const ctStr = (n) => String(Math.round(n * 1000) / 10).replace(".", ",");

const OHNE = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const MIT = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 8 });
const OW = berechne({ kwp: 10, ausrichtung: "ost-west", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const jahre = (r) => (r.amortisationJahre ? r.amortisationJahre.toFixed(1).replace(".", ",") : "über 20");

const artikel = {
  slug: "photovoltaik-lohnt-sich",
  title: "Lohnt sich Photovoltaik 2026? Ehrliche Rechnung mit Beispielen",
  seoTitle: "Lohnt sich Photovoltaik 2026? Rechnung & Beispiele | Ökovolt",
  kurzTitel: "Lohnt sich Photovoltaik?",
  description:
    "Lohnt sich eine PV-Anlage 2026 noch? Ehrliche Wirtschaftlichkeitsrechnung mit und ohne Speicher, Amortisation, Rendite und die Fälle, in denen es sich nicht rechnet.",
  excerpt:
    "Die Einspeisevergütung sinkt, die Strompreise bleiben hoch – was heißt das für Ihre Rechnung? Drei Beispielrechnungen, typische Denkfehler und wann sich eine Anlage nicht lohnt.",
  hauptKeyword: "lohnt sich photovoltaik",
  keywords: ["Lohnt sich Photovoltaik", "Lohnt sich eine Solaranlage 2026", "Photovoltaik Rendite", "PV-Anlage Wirtschaftlichkeit", "Photovoltaik Amortisation", "Lohnt sich ein Stromspeicher"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Home/download-1.jpg",
  bildAlt: "Einfamilienhaus mit Photovoltaikanlage auf dem Satteldach",
  badge: { wert: `~${jahre(OHNE)} Jahre`, text: "Amortisation 10 kWp, Süddach, ohne Speicher" },

  kurzFazit: [
    `**Ja, in den meisten Einfamilienhäusern.** Jede selbst genutzte Kilowattstunde spart rund ${ctStr(ANNAHMEN.strompreis)} ct Netzstrom – eingespeist bringt sie nur ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct.`,
    `Eine 10-kWp-Anlage auf einem Süddach amortisiert sich in unserem Beispiel nach rund **${jahre(OHNE)} Jahren** – bei 25 bis 30 Jahren Lebensdauer.`,
    "Der Hebel ist heute der **Eigenverbrauch**, nicht mehr die Einspeisung. Anlagen sollten auf den Verbrauch geplant werden.",
    "Weniger lohnend wird es bei starker Verschattung, sehr niedrigem Verbrauch oder einem Dach, das in wenigen Jahren saniert werden muss.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Die kurze Antwort: Wann sich Photovoltaik lohnt",
      bloecke: [
        {
          typ: "p",
          text: `**Photovoltaik lohnt sich 2026, sobald ein nennenswerter Teil des Solarstroms im eigenen Haus verbraucht wird.** Der Grund ist die Preisschere: Netzstrom kostet Haushalte im Schnitt über 30 Cent je Kilowattstunde, die [Einspeisevergütung](/ratgeber/einspeiseverguetung-2026) für neue Anlagen bis 10 kWp liegt dagegen bei ${ct(VERGUETUNG.saetze[0].teileinspeisung)} Cent. Wer seinen Solarstrom selbst nutzt, spart also etwa das Vierfache dessen, was die Einspeisung bringt.`,
        },
        {
          typ: "p",
          text: "Früher war es umgekehrt: Hohe Vergütungen machten jede eingespeiste Kilowattstunde wertvoll. Heute entscheidet die Auslegung. Eine Anlage, die auf den Verbrauch des Haushalts, eine Wärmepumpe oder ein E-Auto abgestimmt ist, rechnet sich deutlich schneller als eine, die einfach das ganze Dach belegt.",
        },
        {
          typ: "kennzahl",
          wert: `${ctStr(ANNAHMEN.strompreis)} ct`,
          titel: "spart jede selbst genutzte Kilowattstunde",
          text: `Zum Vergleich: Für eingespeisten Strom erhalten neue Anlagen bis 10 kWp ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct je kWh (Inbetriebnahme ab ${VERGUETUNG.gueltigAbLabel}).`,
        },
      ],
    },
    {
      id: "beispiele",
      titel: "Drei Beispielrechnungen",
      tocLabel: "Beispielrechnungen",
      bloecke: [
        {
          typ: "p",
          text: `Die folgenden Werte stammen aus demselben Rechenkern wie unser [Solarrechner](/solarrechner): 10 kWp Anlagenleistung, ${(4500).toLocaleString("de-DE")} kWh Jahresverbrauch (typischer 4-Personen-Haushalt), ${ctStr(ANNAHMEN.strompreis)} ct Strompreis und Betriebskosten von ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr.`,
        },
        {
          typ: "tabelle",
          caption: "Wirtschaftlichkeit einer 10-kWp-Anlage in drei Varianten, Stand September 2026",
          kopf: ["", "Süd, ohne Speicher", "Süd, mit 8 kWh", "Ost/West, ohne Speicher"],
          zeilen: [
            ["Investition", eur(OHNE.investition), eur(MIT.investition), eur(OW.investition)],
            ["Jahresertrag", `${Math.round(OHNE.jahresertrag).toLocaleString("de-DE")} kWh`, `${Math.round(MIT.jahresertrag).toLocaleString("de-DE")} kWh`, `${Math.round(OW.jahresertrag).toLocaleString("de-DE")} kWh`],
            ["Autarkie", `${Math.round(OHNE.autarkie * 100)} %`, `${Math.round(MIT.autarkie * 100)} %`, `${Math.round(OW.autarkie * 100)} %`],
            ["Vorteil pro Jahr", eur(OHNE.nutzenProJahr), eur(MIT.nutzenProJahr), eur(OW.nutzenProJahr)],
            ["Amortisation", `${jahre(OHNE)} Jahre`, `${jahre(MIT)} Jahre`, `${jahre(OW)} Jahre`],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Orientierungswerte, keine Angebote. Der Vorteil pro Jahr enthält Stromersparnis und Einspeiseerlös abzüglich Betriebskosten. Die Amortisation berücksichtigt Moduldegradation und die im Solarrechner gewählte Strompreisentwicklung.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Der Speicher lohnt sich nur in der passenden Größe",
          text: "Im Beispiel verdoppelt ein 8-kWh-Speicher die Autarkie und verkürzt sogar die Amortisation – weil er zum Verbrauch passt. Ein deutlich zu großer Speicher kostet mehr, als er zusätzlich einspart, und verlängert die Amortisation. Wer abends viel Strom braucht, profitiert am meisten. Welche Größe sinnvoll ist, zeigt der [Stromspeicher-Rechner](/rechner/stromspeicher).",
        },
        { typ: "tool", href: "/solarrechner", titel: "Rechnen Sie Ihren eigenen Fall durch", text: "Anlagengröße, Verbrauch, Dach und Speicher eingeben – mit 20-Jahres-Cashflow.", label: "Zum Solarrechner" },
      ],
    },
    {
      id: "faktoren",
      titel: "Die fünf Faktoren, die über die Rendite entscheiden",
      tocLabel: "Einflussfaktoren",
      bloecke: [
        {
          typ: "karten",
          items: [
            { titel: "Eigenverbrauch", text: "Jede selbst genutzte Kilowattstunde ist rund viermal so viel wert wie eine eingespeiste. Tagsüber laufende Geräte, Wärmepumpe und E-Auto erhöhen den Anteil." },
            { titel: "Strompreis", text: "Je höher Ihr Tarif, desto mehr spart die Anlage. Steigen die Preise in Zukunft, verkürzt sich die Amortisation zusätzlich." },
            { titel: "Dach & Ausrichtung", text: "Süd bringt den höchsten Ertrag, Ost/West verteilt ihn besser über den Tag. Verschattung durch Bäume oder Gauben kostet spürbar Ertrag." },
            { titel: "Anschaffungspreis", text: "Größere Anlagen sind je kWp günstiger, weil Fixkosten wie Gerüst und Anmeldung sich verteilen. Details im [Kostenratgeber](/ratgeber/solaranlage-kosten)." },
          ],
        },
        {
          typ: "p",
          text: "Der fünfte Faktor wird oft unterschätzt: **die Lebensdauer.** Hochwertige Module sind auf 25 bis 30 Jahre ausgelegt und verlieren typischerweise nur rund 0,5 % Leistung pro Jahr. Die Amortisationszeit ist deshalb nur die halbe Wahrheit – entscheidend ist, was in den Jahren danach übrig bleibt.",
        },
      ],
    },
    {
      id: "nicht-lohnend",
      titel: "Wann sich Photovoltaik nicht lohnt",
      bloecke: [
        { typ: "p", text: "Ehrlich gesagt: nicht jedes Dach ist geeignet. In diesen Fällen raten wir von einer Anlage ab oder empfehlen zuerst andere Schritte:" },
        {
          typ: "checkliste",
          punkte: [
            "**Starke Verschattung** über große Teile des Tages, etwa durch hohe Bäume oder Nachbargebäude.",
            "**Dachsanierung in den nächsten Jahren:** Erst das Dach, dann die Anlage – eine spätere Demontage kostet mehrere tausend Euro.",
            "**Sehr geringer Stromverbrauch** (unter etwa 1.500 kWh im Jahr) und kein Plan für Wärmepumpe oder E-Auto.",
            "**Nordausrichtung mit steiler Neigung:** Hier liegt der Ertrag so niedrig, dass sich die Investition kaum trägt.",
            "**Unklare Statik oder Asbest** in der Dacheindeckung – das muss vorab geklärt werden.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          text: "Auch ein Norddach kann bei flacher Neigung sinnvoll sein, und selbst Teilverschattung lässt sich mit Leistungsoptimierern abmildern. Eine Vor-Ort-Prüfung klärt das schneller als jede Faustregel.",
        },
      ],
    },
    {
      id: "denkfehler",
      titel: "Typische Denkfehler bei der Wirtschaftlichkeit",
      bloecke: [
        { typ: "h3", text: "„Ohne hohe Einspeisevergütung lohnt es sich nicht mehr“" },
        { typ: "p", text: "Die Vergütung ist heute ein Zusatzerlös, nicht mehr das Geschäftsmodell. Der wirtschaftliche Kern ist die vermiedene Stromrechnung – und die wird durch sinkende Vergütungssätze nicht kleiner." },
        { typ: "h3", text: "„Je größer die Anlage, desto besser“" },
        { typ: "p", text: "Größer ist je kWp günstiger, aber zusätzlicher Überschuss wird nur zum niedrigen Einspeisesatz vergütet. Sinnvoll ist eine größere Anlage, wenn Wärmepumpe oder E-Auto dazukommen – oder in einigen Jahren geplant sind." },
        { typ: "h3", text: "„Mit Speicher bin ich unabhängig“" },
        { typ: "p", text: `Ein Speicher hebt die Autarkie im Beispiel von ${Math.round(OHNE.autarkie * 100)} auf ${Math.round(MIT.autarkie * 100)} %. Im Winter liefert jede Anlage aber deutlich weniger. Völlige Unabhängigkeit vom Netz ist für ein Einfamilienhaus wirtschaftlich nicht sinnvoll.` },
      ],
    },
    {
      id: "vorgehen",
      titel: "So finden Sie heraus, ob es sich für Sie lohnt",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Verbrauch ermitteln", "Jahresverbrauch der letzten Stromrechnung notieren und überlegen, ob Wärmepumpe oder E-Auto geplant sind."],
            ["Selbst rechnen", "Mit dem [Solarrechner](/solarrechner) eine erste Orientierung zu Ertrag, Autarkie und Amortisation gewinnen."],
            ["Förderung prüfen", "Mit dem [Förder-Check](/foerdercheck) klären, welche Programme im Bundesland gelten."],
            ["Dach prüfen lassen", "Verschattung, Statik und Zählerschrank vor Ort bewerten lassen – daraus entsteht ein belastbares Angebot."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Lohnt sich Photovoltaik ohne Speicher?", a: `Ja. Ohne Speicher amortisiert sich unsere 10-kWp-Beispielanlage nach rund ${jahre(OHNE)} Jahren. Ein Speicher erhöht vor allem die Unabhängigkeit; ob er die Rendite verbessert, hängt vom Verbrauchsprofil ab.` },
    { q: "Wie hoch ist die Rendite einer PV-Anlage?", a: "Gut geplante Anlagen im Einfamilienhaus erreichen über die Laufzeit typischerweise eine jährliche Rendite im mittleren einstelligen Prozentbereich. Entscheidend sind Eigenverbrauch, Strompreisentwicklung und Anschaffungspreis." },
    { q: "Lohnt sich Photovoltaik im Winter?", a: "Im Winter erzeugt eine Anlage deutlich weniger Strom. Die Wirtschaftlichkeit wird aber über das ganze Jahr gerechnet – der Großteil des Ertrags entsteht von März bis Oktober." },
    { q: "Lohnt sich eine Solaranlage für Rentner?", a: "Oft ja, weil tagsüber mehr Strom im Haus verbraucht wird und der Eigenverbrauch dadurch steigt. Bei der Planung sollte man die eigene Perspektive im Haus berücksichtigen; eine PV-Anlage steigert in der Regel auch den Immobilienwert." },
    { q: "Muss ich Steuern auf meine PV-Anlage zahlen?", a: "Für Anlagen auf Wohngebäuden fällt beim Kauf keine Umsatzsteuer an (§ 12 Abs. 3 UStG), und Erträge aus Anlagen bis 30 kWp je Einheit sind nach § 3 Nr. 72 EStG von der Einkommensteuer befreit. Mehr dazu unter [steuerliche Vorteile](/forderungen/steuerlich)." },
  ],

  passend: [
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage 2026?", text: "Preise je kWp und was im Komplettpreis steckt." },
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Die aktuellen Sätze in ct/kWh." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Welche Speichergröße sich für Sie rechnet." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Ihre Anlage in 2 Minuten konfigurieren." },
  ],

  quellen: [
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "09/2026" },
    { titel: "BDEW – Strompreisanalyse", url: "https://www.bdew.de/service/daten-und-grafiken/bdew-strompreisanalyse/", stand: "09/2026" },
    { titel: "§ 12 Abs. 3 UStG – Nullsteuersatz für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Lohnt es sich für Ihr Dach?", text: "Ertrag, Autarkie und Amortisation mit Ihren Werten.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Wir rechnen Ihr Dach ehrlich durch.",
    text: "Mit Vor-Ort-Prüfung von Dach, Verschattung und Zählerschrank – und einer Wirtschaftlichkeitsrechnung, die auch sagt, wann es sich nicht lohnt.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
