// Ratgeber: Amortisation Photovoltaik
// Alle Beispielrechnungen laufen über den Rechenkern des Solarrechners.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { berechne } from "@/lib/solarrechner";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE") + " kWh";
const pct = (x, st = 0) => (x * 100).toFixed(st).replace(".", ",") + " %";
const j = (r) => (r.amortisationJahre ? r.amortisationJahre.toFixed(1).replace(".", ",") + " Jahre" : "über 20 Jahre");
const jD = (r) => j(r).replace(/Jahre$/, "Jahren");
const statisch = (r) => (r.investition / r.nutzenProJahr).toFixed(1).replace(".", ",");
const ctStr = (eurProKwh) => String(Math.round(eurProKwh * 1000) / 10).replace(".", ",");

/** Interner Zinsfuß (IRR) über die 20-jährige Cashflow-Reihe des Solarrechners, per Bisektion. */
function irr(r) {
  const cf = r.cashflow.map((c) => c.netto);
  let lo = -0.5;
  let hi = 0.5;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    const npv = cf.reduce((s, c, t) => s + c / Math.pow(1 + m, t), 0);
    if (npv > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const B = { kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 };
const BASIS = berechne(B);
const SP = berechne({ ...B, speicherKwh: 8 });
const OW = berechne({ ...B, ausrichtung: "ost-west" });
const NORD = berechne({ ...B, ausrichtung: "nord" });
const ST0 = berechne({ ...B, preissteigerung: 0 });
const ST4 = berechne({ ...B, preissteigerung: 0.04 });
const V3 = berechne({ ...B, verbrauch: 3000 });
const V6 = berechne({ ...B, verbrauch: 6000 });
const WP = berechne({ ...B, kwp: 14, verbrauch: 8000 });
const K5 = berechne({ ...B, kwp: 5, verbrauch: 3000 });

const satz = BASIS.satzCt;

const artikel = {
  slug: "photovoltaik-amortisation",
  title: "Amortisation Photovoltaik: Formel, Beispiele und echte Rendite",
  seoTitle: "Amortisation Photovoltaik: Formel & Beispiele | Ökovolt",
  kurzTitel: "Amortisation Photovoltaik",
  description:
    "Amortisation Photovoltaik 2026: Nach wie vielen Jahren sich eine PV-Anlage bezahlt macht – mit Formel, Rechenbeispielen, Einflussfaktoren und Rendite (IRR).",
  excerpt:
    "Wann hat sich die Solaranlage bezahlt gemacht? Schritt-für-Schritt-Rechnung mit echten Zahlen, zehn Szenarien im Vergleich und die Rendite verständlich erklärt.",
  hauptKeyword: "amortisation photovoltaik",
  keywords: [
    "Amortisation Photovoltaik",
    "PV-Anlage Amortisation berechnen",
    "Wann amortisiert sich eine PV-Anlage",
    "Amortisationszeit Solaranlage",
    "Photovoltaik Rendite",
    "PV-Anlage Amortisation mit Speicher",
    "Amortisation Photovoltaik Formel",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg",
  bildAlt: "Reihenhäuser mit Photovoltaikmodulen auf den Dächern",
  badge: { wert: j(BASIS).replace(" Jahre", " J."), text: "Amortisation 10 kWp, Süddach, ohne Speicher" },

  kurzFazit: [
    `**Eine PV-Anlage im Einfamilienhaus amortisiert sich 2026 typischerweise nach 10 bis 15 Jahren.** Unsere 10-kWp-Beispielanlage auf einem Süddach braucht rund ${j(BASIS)}.`,
    "**Faustformel:** Amortisationszeit = Investition ÷ jährlicher Vorteil. Der Vorteil ist Stromersparnis plus Einspeiseerlös minus Betriebskosten.",
    `Die Anlage läuft 25 bis 30 Jahre. Über die 20-jährige EEG-Laufzeit erreicht das Beispiel eine **Rendite (interner Zinsfuß) von rund ${pct(irr(BASIS), 1)} pro Jahr** – ohne die Jahre danach.`,
    "Den größten Einfluss haben **Eigenverbrauch, Anschaffungspreis und Strompreisentwicklung** – nicht die Einspeisevergütung.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Nach wie vielen Jahren amortisiert sich eine PV-Anlage?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: `**Eine gut geplante Photovoltaikanlage auf einem Einfamilienhaus hat sich 2026 meist nach 10 bis 15 Jahren bezahlt gemacht.** In unserem Rechenbeispiel – 10 kWp, Süddach, ${kwh(4500)} Jahresverbrauch, ohne Speicher – sind es ${j(BASIS)}. Weil moderne Module 25 Jahre und länger Strom liefern, bleiben danach viele Jahre, in denen die Anlage praktisch nur noch Gewinn abwirft.`,
        },
        {
          typ: "p",
          text: `Die [Amortisationszeit](/wissen/lexikon#amortisation) ist die Zahl der Jahre, bis die Summe aller Ersparnisse und Erlöse die Anschaffungskosten erreicht. Sie ist eine anschauliche Kennzahl für das Risiko: Je kürzer, desto schneller ist das eingesetzte Geld zurück. Über die tatsächliche Wirtschaftlichkeit sagt sie allein aber wenig – dafür braucht es die Rendite. Beides erklären wir unten.`,
        },
        {
          typ: "kennzahl",
          wert: `${ctStr(ANNAHMEN.strompreis)} ct`,
          titel: "spart jede selbst verbrauchte Kilowattstunde",
          text: `Für eingespeisten Strom erhalten neue Anlagen bis 10 kWp nur ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct (ab ${VERGUETUNG.gueltigAbLabel}). Deshalb bestimmt der Eigenverbrauch die Amortisation stärker als jeder andere Faktor.`,
        },
      ],
    },
    {
      id: "formel",
      titel: "Die Formel: Amortisation selbst berechnen",
      tocLabel: "Formel & Rechenweg",
      bloecke: [
        {
          typ: "p",
          text: "**Die einfache (statische) Amortisation berechnen Sie, indem Sie die Investition durch den jährlichen Vorteil teilen.** Der jährliche Vorteil setzt sich aus drei Teilen zusammen:",
        },
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Stromersparnis** = selbst verbrauchter Solarstrom (kWh) × Ihr Strompreis (€/kWh)",
            "**Einspeiseerlös** = eingespeister Strom (kWh) × Einspeisevergütung (€/kWh)",
            "**Betriebskosten** = Versicherung, Zählermiete, Wartung und Rücklage für den Wechselrichter",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Formel",
          text: "**Amortisationszeit (Jahre) = Investition ÷ (Stromersparnis + Einspeiseerlös − Betriebskosten)**",
        },
        { typ: "h3", text: "Rechenbeispiel Schritt für Schritt" },
        {
          typ: "tabelle",
          caption: "Statische Amortisation einer 10-kWp-Anlage (Süd, 4.500 kWh Verbrauch, ohne Speicher)",
          kopf: ["Schritt", "Rechnung", "Ergebnis"],
          zeilen: [
            ["Investition", `10 kWp schlüsselfertig, 0 % USt`, eur(BASIS.investition)],
            ["Jahresertrag", `10 kWp × ${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh/kWp`, kwh(BASIS.jahresertrag)],
            ["Eigenverbrauch", `${pct(BASIS.autarkie)} von ${kwh(4500)} Verbrauch`, kwh(BASIS.eigenverbrauch)],
            ["Stromersparnis", `${kwh(BASIS.eigenverbrauch)} × ${ctStr(ANNAHMEN.strompreis)} ct`, eur(BASIS.ersparnis)],
            ["Einspeiseerlös", `${kwh(BASIS.eingespeist)} × ${ct(satz)} ct`, eur(BASIS.einspeiseErloes)],
            ["Betriebskosten", `10 kWp × ${ANNAHMEN.betriebskostenProKwp} €`, `− ${eur(BASIS.betriebskosten)}`],
            ["Jährlicher Vorteil", "Summe", eur(BASIS.nutzenProJahr)],
            ["Amortisation (statisch)", `${eur(BASIS.investition)} ÷ ${eur(BASIS.nutzenProJahr)}`, `${statisch(BASIS)} Jahre`],
          ],
          markierteZeile: 7,
          hervorheben: 2,
          minBreite: 560,
          fussnote: "Richtwerte aus dem Solarrechner, Stand September 2026. Keine Angebote; tatsächliche Preise und Erträge hängen von Dach, Region und Verbrauch ab.",
        },
        {
          typ: "p",
          text: `Die statische Rechnung ist ein guter Überschlag, vernachlässigt aber zwei gegenläufige Effekte: Die Module verlieren jedes Jahr etwas Leistung ([Degradation](/wissen/lexikon#degradation), rund ${pct(ANNAHMEN.degradationProJahr, 1)} pro Jahr), und der ersetzte Netzstrom wird voraussichtlich teurer. Unser [Solarrechner](/solarrechner) rechnet deshalb Jahr für Jahr (dynamisch) und kommt im Beispiel auf ${j(BASIS)}. Gerechnet ist mit ${Math.round(ANNAHMEN.strompreisSteigerung * 100)} % Strompreissteigerung pro Jahr – bei konstantem Strompreis wären es ${j(ST0)}.`,
        },
      ],
    },
    {
      id: "szenarien",
      titel: "Amortisation im Vergleich: zehn typische Fälle",
      tocLabel: "Szenarien",
      bloecke: [
        {
          typ: "p",
          text: "**Ob sich eine Anlage nach 11 oder nach 20 Jahren bezahlt macht, entscheiden vor allem Dachausrichtung, Verbrauch und Speicher.** Die Tabelle zeigt, wie stark einzelne Stellschrauben wirken – jeweils ausgehend vom Basisfall.",
        },
        {
          typ: "tabelle",
          caption: "Dynamische Amortisation und Rendite (IRR über 20 Jahre) in zehn Szenarien, Stand September 2026",
          kopf: ["Szenario", "Investition", "Vorteil Jahr 1", "Amortisation", "Rendite (IRR)"],
          zeilen: [
            ["Basis: 10 kWp Süd, 4.500 kWh", eur(BASIS.investition), eur(BASIS.nutzenProJahr), j(BASIS), pct(irr(BASIS), 1)],
            ["+ 8-kWh-Speicher", eur(SP.investition), eur(SP.nutzenProJahr), j(SP), pct(irr(SP), 1)],
            ["Ost/West statt Süd", eur(OW.investition), eur(OW.nutzenProJahr), j(OW), pct(irr(OW), 1)],
            ["Norddach", eur(NORD.investition), eur(NORD.nutzenProJahr), j(NORD), pct(irr(NORD), 1)],
            ["Verbrauch nur 3.000 kWh", eur(V3.investition), eur(V3.nutzenProJahr), j(V3), pct(irr(V3), 1)],
            ["Verbrauch 6.000 kWh", eur(V6.investition), eur(V6.nutzenProJahr), j(V6), pct(irr(V6), 1)],
            ["14 kWp mit Wärmepumpe, 8.000 kWh", eur(WP.investition), eur(WP.nutzenProJahr), j(WP), pct(irr(WP), 1)],
            ["5 kWp, 3.000 kWh", eur(K5.investition), eur(K5.nutzenProJahr), j(K5), pct(irr(K5), 1)],
            ["Strompreis bleibt konstant", eur(ST0.investition), eur(ST0.nutzenProJahr), j(ST0), pct(irr(ST0), 1)],
            ["Strompreis +4 % pro Jahr", eur(ST4.investition), eur(ST4.nutzenProJahr), j(ST4), pct(irr(ST4), 1)],
          ],
          markierteZeile: 0,
          hervorheben: 3,
          minBreite: 680,
          fussnote: `Rechenkern des Solarrechners: ${ctStr(ANNAHMEN.strompreis)} ct Strompreis, Basis ${Math.round(ANNAHMEN.strompreisSteigerung * 100)} % Strompreissteigerung pro Jahr, ${pct(ANNAHMEN.degradationProJahr, 1)} Degradation, Betriebskosten ${ANNAHMEN.betriebskostenProKwp} €/kWp mit ${Math.round(ANNAHMEN.betriebskostenSteigerung * 100)} % Kostensteigerung, EEG-Vergütung nach Anlagengröße. IRR ohne Restwert nach Jahr 20 – die tatsächliche Rendite liegt bei längerer Nutzung höher.`,
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Eigenverbrauch schlägt Größe", text: `Bei nur 3.000 kWh Verbrauch dauert es mit derselben Anlage ${j(V3)}, bei 6.000 kWh nur ${j(V6)}. Wärmepumpe oder E-Auto machen die Anlage schneller rentabel.` },
            { titel: "Speicher: mehr Autarkie", text: `Im Solarrechner verkürzt der 8-kWh-Speicher die Amortisation auf ${j(SP)}. Das hängt aber stark von Speicherpreis und Lastprofil ab – mehr im Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten).` },
            { titel: "Strompreis als Joker", text: `Bleibt der Strompreis konstant, verlängert sich die Amortisation auf ${j(ST0)}; steigt er um 4 % im Jahr, sinkt sie auf ${j(ST4)}. Das Risiko liegt also eher auf der Chancenseite.` },
          ],
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Ihre persönliche Amortisation berechnen",
          text: "Anlagengröße, Dach, Verbrauch, Speicher und Strompreisentwicklung eingeben – mit 20-Jahres-Cashflow und Amortisationsjahr.",
          label: "Zum Solarrechner",
        },
      ],
    },
    {
      id: "rendite",
      titel: "Amortisation oder Rendite: Was sagt mehr aus?",
      tocLabel: "Rendite & IRR",
      bloecke: [
        {
          typ: "p",
          text: "**Die Amortisationszeit sagt, wann das Geld zurück ist – die Rendite sagt, wie gut es sich verzinst hat.** Zwei Anlagen können sich nach 12 Jahren amortisieren, aber sehr unterschiedliche Renditen bringen, je nachdem, wie lange sie danach noch laufen und wie hoch die Überschüsse ausfallen.",
        },
        { typ: "h3", text: "Einfache Rendite" },
        {
          typ: "p",
          text: `Die einfache Rendite teilt den durchschnittlichen jährlichen Überschuss durch die Investition. Im Basisfall bleiben nach 20 Jahren ${eur(BASIS.ertrag20Jahre)} Überschuss; verteilt auf 20 Jahre sind das ${pct(BASIS.renditeProJahr, 1)} pro Jahr bezogen auf die Investition. Diese Kennzahl ist leicht zu verstehen, berücksichtigt aber nicht, dass Geld früher mehr wert ist als später.`,
        },
        { typ: "h3", text: "Interner Zinsfuß (IRR) – die ehrlichere Kennzahl" },
        {
          typ: "p",
          text: `Der interne Zinsfuß beantwortet die Frage: **Zu welchem Zinssatz müssten Sie Ihr Geld anlegen, um am Ende genauso dazustehen wie mit der PV-Anlage?** Im Basisfall sind das rund ${pct(irr(BASIS), 1)} pro Jahr – gerechnet nur über 20 Jahre und ohne Restwert. Mit Speicher sind es im Solarrechner ${pct(irr(SP), 1)}. Die Werte sind mit der Verzinsung einer Geldanlage vergleichbar, allerdings mit einem wichtigen Unterschied: Die Erträge sind an den Betrieb der Anlage und die künftige Strompreisentwicklung gebunden.`,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Die Jahre nach der Amortisation zählen doppelt",
          text: `Nach 20 Jahren endet die [EEG-Vergütung](/ratgeber/einspeiseverguetung-2026), nicht die Anlage. Wer den Solarstrom weiter selbst nutzt, spart in den Jahren 21 bis 30 weiter – bei heutigem Verbrauch mehrere hundert Euro jährlich. Was dann gilt, erklärt [Photovoltaik nach 20 Jahren](/ratgeber/photovoltaik-nach-20-jahren).`,
        },
      ],
    },
    {
      id: "faktoren",
      titel: "Die sieben Faktoren, die die Amortisation bestimmen",
      tocLabel: "Einflussfaktoren",
      bloecke: [
        {
          typ: "tabelle",
          caption: "Einflussfaktoren auf die Amortisationszeit",
          kopf: ["Faktor", "Wirkung", "Was Sie tun können"],
          zeilen: [
            ["Eigenverbrauchsanteil", "sehr hoch", "Verbraucher in die Mittagszeit legen, Wärmepumpe/E-Auto mit PV koppeln, ggf. Speicher"],
            ["Anschaffungspreis je kWp", "sehr hoch", "Mehrere Angebote vergleichen, Fixkosten durch passende Anlagengröße verteilen"],
            ["Strompreis", "hoch", "Je höher Ihr Tarif, desto mehr spart jede selbst genutzte kWh"],
            ["Ausrichtung & Verschattung", "hoch", "Süd/Südwest ideal, Ost/West gut für Eigenverbrauch; Verschattung vermeiden"],
            ["Einspeisevergütung", "mittel", "Überschuss wird nur mit wenigen Cent vergütet – nicht auf Einspeisung optimieren"],
            ["Betriebskosten", "mittel", "Versicherung und Wartung vergleichen, Monitoring nutzen"],
            ["Finanzierung", "mittel", "Zinsen verlängern die Amortisation; Eigenkapital oder günstiger Kredit verkürzen sie"],
          ],
          minBreite: 620,
        },
        {
          typ: "p",
          text: `Wie stark die Ausrichtung wirkt, zeigt der Vergleich: Ein Norddach liefert im Rechner nur rund 60 % des Süd-Ertrags und kommt innerhalb von 20 Jahren nicht auf null. Ost/West-Dächer erzeugen weniger, verteilen den Strom aber besser über den Tag – Details im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west). Und wer verschattete Flächen belegt, verliert überproportional: [Photovoltaik und Verschattung](/ratgeber/photovoltaik-verschattung).`,
        },
      ],
    },
    {
      id: "steuern-finanzierung",
      titel: "Steuern, Förderung und Kredit: Was die Rechnung verändert",
      tocLabel: "Steuern & Finanzierung",
      bloecke: [
        {
          typ: "p",
          text: "**Für private Anlagen auf Wohngebäuden verbessern zwei Steuerregeln die Amortisation direkt:** Seit 2023 fällt beim Kauf keine Umsatzsteuer an (§ 12 Abs. 3 UStG), und Einnahmen aus Anlagen bis 30 kWp je Wohn- oder Gewerbeeinheit sind nach § 3 Nr. 72 EStG einkommensteuerfrei. Die Einspeisevergütung fließt also ungeschmälert in die Rechnung. Details finden Sie unter [steuerliche Vorteile](/forderungen/steuerlich).",
        },
        {
          typ: "p",
          text: "Bei einer **Kreditfinanzierung** verlängern die Zinsen die Amortisationszeit. Umgekehrt kann eine Finanzierung sinnvoll sein, wenn die jährliche Ersparnis die Rate weitgehend deckt. Der [KfW-Kredit 270](/ratgeber/kfw-kredit-270) finanziert PV-Anlage und Speicher; die Konditionen ändern sich regelmäßig. Ob sich Kauf, Kredit oder Miete für Sie mehr rechnen, zeigt der Vergleich [Photovoltaik mieten oder kaufen](/ratgeber/photovoltaik-mieten-oder-kaufen).",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Gewerbliche Anlagen rechnen anders",
          text: "Größere Anlagen oder Anlagen von Unternehmen können abgeschrieben werden (AfA, ggf. Investitionsabzugsbetrag). Das verändert die Nach-Steuer-Rendite erheblich. Mehr dazu im Ratgeber [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe).",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Rechenfehler bei der Amortisation",
      tocLabel: "Rechenfehler",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Eigenverbrauch zu hoch angesetzt:** Ohne Speicher nutzen Haushalte meist nur 25 bis 35 % ihres Verbrauchs aus der Anlage. Angebote mit 60 % ohne Speicher sind unrealistisch.",
            "**Betriebskosten vergessen:** Versicherung, Zählermiete und der Wechselrichtertausch nach 12 bis 15 Jahren kosten Geld. Wir rechnen mit rund 25 € je kWp und Jahr.",
            "**Strompreissteigerung zu optimistisch:** Mit 5 % oder mehr pro Jahr lässt sich jede Anlage schönrechnen. Vorsichtiger sind 0 bis 2 %.",
            "**Degradation ignoriert:** Module verlieren jährlich etwas Leistung – über 20 Jahre summiert sich das auf mehrere Prozent.",
            "**Einspeisevergütung falsch gerechnet:** Die Sätze gelten gestaffelt nach Anlagenteil und sind für 20 Jahre fest. Neue Anlagen erhalten bei negativen Börsenpreisen keine Vergütung – siehe [Solarspitzengesetz](/ratgeber/solarspitzengesetz).",
            "**Nur Amortisation betrachtet:** Eine Anlage, die 30 Jahre läuft, ist auch mit 14 Jahren Amortisationszeit eine gute Investition.",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So berechnen Sie Ihre eigene Amortisationszeit",
      tocLabel: "Anleitung",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Verbrauch und Strompreis notieren", "Jahresverbrauch und Arbeitspreis stehen auf der letzten Stromrechnung. Geplante Wärmepumpe oder E-Auto dazurechnen."],
            ["Ertrag abschätzen", "In Süddeutschland rund 1.000 kWh je kWp bei Südausrichtung, im Norden eher 900. Mehr dazu im Ratgeber [Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp)."],
            ["Eigenverbrauch realistisch ansetzen", "Ohne Speicher ca. 30 % Autarkie, mit passendem Speicher 60 bis 75 % – der [Stromspeicher-Rechner](/rechner/stromspeicher) simuliert es stündlich."],
            ["Jährlichen Vorteil berechnen", "Stromersparnis + Einspeiseerlös − Betriebskosten."],
            ["Investition teilen", "Angebotspreis ÷ jährlicher Vorteil = statische Amortisation. Für die dynamische Rechnung den [Solarrechner](/solarrechner) nutzen."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie lange dauert es, bis sich eine PV-Anlage amortisiert?",
      a: `Typisch sind 10 bis 15 Jahre. Unsere 10-kWp-Beispielanlage auf einem Süddach mit 4.500 kWh Verbrauch amortisiert sich nach rund ${jD(BASIS)}, mit 8-kWh-Speicher nach ${jD(SP)}. Bei hohem Eigenverbrauch geht es schneller, bei Nord- oder Schattendächern deutlich langsamer.`,
    },
    {
      q: "Amortisiert sich eine PV-Anlage mit Speicher schneller?",
      a: "Nicht automatisch. Der Speicher erhöht den Eigenverbrauch, kostet aber zusätzlich. Bei passender Größe und hohem Abendverbrauch verkürzt er die Amortisation, ein zu großer Speicher verlängert sie. Den Einzelfall prüft der [Stromspeicher-Rechner](/rechner/stromspeicher).",
    },
    {
      q: "Wie berechnet man die Amortisation einer Solaranlage?",
      a: "Teilen Sie die Investition durch den jährlichen Vorteil. Der Vorteil ist die Stromersparnis durch Eigenverbrauch plus die Einspeisevergütung abzüglich der Betriebskosten. Für eine genauere Rechnung berücksichtigen Sie Degradation und Strompreisentwicklung Jahr für Jahr.",
    },
    {
      q: "Welche Rendite bringt eine PV-Anlage?",
      a: `Gut geplante Anlagen erreichen über 20 Jahre typischerweise eine Rendite im mittleren einstelligen Prozentbereich. Unser Basisbeispiel kommt auf einen internen Zinsfuß von rund ${pct(irr(BASIS), 1)} – ohne die Betriebsjahre nach Ablauf der EEG-Vergütung.`,
    },
    {
      q: "Lohnt sich eine PV-Anlage noch, wenn man 65 oder älter ist?",
      a: "Oft ja: Rentnerhaushalte verbrauchen tagsüber mehr Strom, was den Eigenverbrauch erhöht. Außerdem steigert eine PV-Anlage in der Regel den Wert der Immobilie, sodass die Investition nicht verloren ist, wenn das Haus vor der Amortisation vererbt oder verkauft wird.",
    },
    {
      q: "Wie lange hält eine PV-Anlage nach der Amortisation noch?",
      a: "Hochwertige Module sind auf 25 bis 30 Jahre ausgelegt, viele Hersteller geben Leistungsgarantien über 25 Jahre oder mehr. Der Wechselrichter muss meist einmal getauscht werden. Nach der Amortisation bleiben daher oft 10 bis 15 Jahre mit reinem Überschuss.",
    },
    {
      q: "Verlängert das Solarspitzengesetz die Amortisation?",
      a: "Nur geringfügig. Neue Anlagen erhalten bei negativen Strompreisen keine Vergütung, der Zeitraum wird aber am Ende der Förderdauer angehängt. Wer viel selbst verbraucht oder einen Speicher nutzt, ist kaum betroffen. Mehr im Ratgeber [Solarspitzengesetz](/ratgeber/solarspitzengesetz).",
    },
  ],

  howTo: {
    name: "Amortisationszeit einer Photovoltaikanlage berechnen",
    schritte: [
      { name: "Verbrauch und Strompreis ermitteln", text: "Jahresverbrauch und Arbeitspreis von der Stromrechnung ablesen, geplante Verbraucher ergänzen." },
      { name: "Jahresertrag schätzen", text: "Anlagengröße in kWp mit dem spezifischen Ertrag (ca. 900–1.000 kWh/kWp bei Süd) multiplizieren." },
      { name: "Eigenverbrauch ansetzen", text: "Ohne Speicher etwa 30 % des Verbrauchs, mit Speicher 60–75 %; Rest wird eingespeist." },
      { name: "Jährlichen Vorteil berechnen", text: "Eigenverbrauch × Strompreis + Einspeisung × Vergütung − Betriebskosten." },
      { name: "Amortisation ermitteln", text: "Investition durch den jährlichen Vorteil teilen; für Genauigkeit Degradation und Preisentwicklung jährlich einrechnen." },
    ],
  },

  passend: [
    { href: "/solarrechner", titel: "Solarrechner", text: "Amortisation und 20-Jahres-Cashflow für Ihr Dach." },
    { href: "/ratgeber/photovoltaik-lohnt-sich", titel: "Lohnt sich Photovoltaik 2026?", text: "Ehrliche Rechnung und wann es sich nicht lohnt." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und Kostenbestandteile." },
    { href: "/ratgeber/photovoltaik-mieten-oder-kaufen", titel: "Mieten oder kaufen?", text: "Gesamtkosten über 20 Jahre im Vergleich." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale – Photovoltaik: Was bei der Planung einer Solaranlage wichtig ist", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-bei-der-planung-einer-solaranlage-wichtig-ist-5574", stand: "08/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "09/2026" },
    { titel: "BDEW – Strompreisanalyse", url: "https://www.bdew.de/service/daten-und-grafiken/bdew-strompreisanalyse/", stand: "09/2026" },
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung für kleine Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
    { titel: "§ 12 Abs. 3 UStG – Nullsteuersatz für Photovoltaikanlagen", url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wann rechnet sich Ihr Dach?", text: "Amortisation und Rendite mit Ihren Werten.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Wir rechnen Ihre Amortisation ehrlich durch.",
    text: "Mit Vor-Ort-Prüfung von Dach und Zählerschrank und einer Wirtschaftlichkeitsrechnung mit realistischen Annahmen – auch wenn das Ergebnis gegen einen Speicher spricht.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
