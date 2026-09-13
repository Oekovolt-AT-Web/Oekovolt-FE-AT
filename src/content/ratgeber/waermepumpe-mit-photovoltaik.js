// Ratgeber: Wärmepumpe mit Photovoltaik
// Deckungsanteile und Heizkosten kommen aus demselben Rechenkern wie der
// Wärmepumpen-Rechner (@/lib/rechner/waermepumpe, stündliche Jahressimulation).

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { WALLBOX } from "@/data/wallbox";
import { WAERMEPUMPE as W } from "@/lib/rechner/annahmen";
import { rechneWaermepumpe } from "@/lib/rechner/waermepumpe";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur10 = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const kwh = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " kWh";
const pct = (x) => `${Math.round(x * 100)} %`;
const komma = (n, s = 1) => n.toFixed(s).replace(".", ",");

const FLAECHE = 150;
const GAS = W.heizungen.gas.preisStandard;
const std = (id) => W.standards.find((s) => s.id === id);

// Beispiel je Gebäudestandard: 10 kWp, ohne und mit 8-kWh-Speicher
const fall = (id, kwp = 10) => {
  const s = std(id);
  const basis = { flaeche: FLAECHE, standard: id, heizung: "gas", preis: GAS, jaz: s.jaz, kwp };
  return { s, ohne: rechneWaermepumpe({ ...basis, pv: "pv" }), mit: rechneWaermepumpe({ ...basis, pv: "pvSpeicher" }) };
};
const TEIL = fall("teilsaniert");
const MITTEL = fall("1995");
const SANIERT = fall("2010");
const NEU = fall("neubau");
const MITTEL15 = fall("1995", 15);

// Monatsverteilung für das mittlere Beispiel ohne Speicher
const MONATE = MITTEL.ohne.monate;
const monatZeile = (i) => {
  const m = MONATE[i];
  return [m.name, kwh(m.wp), kwh(m.solar), m.wp > 0 ? pct(m.solar / m.wp) : "–"];
};
const winter = [0, 1, 10, 11].reduce((a, i) => a + MONATE[i].solar, 0) / [0, 1, 10, 11].reduce((a, i) => a + MONATE[i].wp, 0);

const WERT_SOLAR = W.wpTarifCt - VERGUETUNG.saetze[0].teileinspeisung; // ct je selbst genutzter kWh

const artikel = {
  slug: "waermepumpe-mit-photovoltaik",
  title: "Wärmepumpe mit Photovoltaik: Wie viel Heizstrom liefert die Sonne?",
  seoTitle: "Wärmepumpe mit Photovoltaik: Anteil & Nutzen | Ökovolt",
  kurzTitel: "Wärmepumpe mit Photovoltaik",
  description:
    "Wärmepumpe mit Photovoltaik: realistischer Solaranteil am Heizstrom, SG Ready, Speicher, Auslegung und Rechenbeispiele für vier Gebäudetypen – Stand 2026.",
  excerpt:
    "Solarstrom für die Heizung klingt ideal – doch geheizt wird vor allem im Winter. Welcher Anteil realistisch ist, wie Steuerung und Speicher helfen und wann sich die Kombination rechnet.",
  hauptKeyword: "wärmepumpe mit photovoltaik",
  keywords: [
    "Wärmepumpe mit Photovoltaik",
    "Wärmepumpe und PV-Anlage kombinieren",
    "Wärmepumpe Solarstrom Anteil",
    "PV-Anlage für Wärmepumpe Größe",
    "SG Ready Photovoltaik",
    "Wärmepumpe Photovoltaik Speicher",
    "Wärmepumpenstrom oder Haushaltsstrom mit PV",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Wärmepumpe & E-Mobilität",
  bild: "/Images/Ratgeber/waermepumpe-mit-photovoltaik.jpg",
  bildAlt: "Außeneinheit einer Luft-Wasser-Wärmepumpe neben dem Hauseingang eines Einfamilienhauses",
  badge: { wert: `${pct(MITTEL.ohne.solar.anteil)}–${pct(MITTEL.mit.solar.anteil)}`, text: "Solaranteil am Wärmepumpenstrom, 10 kWp, ohne/mit Speicher" },

  kurzFazit: [
    `**Ja, die Kombination ist sinnvoll – aber die Sonne heizt nicht allein.** Ohne Speicher deckt eine PV-Anlage im Einfamilienhaus etwa ein Fünftel bis ein Viertel des Wärmepumpenstroms, mit Batteriespeicher rund 35 bis 45 %.`,
    `In unserem Beispielhaus (${FLAECHE} m², Baujahr 1995–2009, 10 kWp) sind es **${pct(MITTEL.ohne.solar.anteil)} ohne und ${pct(MITTEL.mit.solar.anteil)} mit 8-kWh-Speicher** – im Dezember und Januar nur ein kleiner Bruchteil.`,
    `Jede Kilowattstunde Solarstrom in der Wärmepumpe ersetzt rund ${W.wpTarifCt} ct Netzstrom statt ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct Einspeisevergütung – der Vorteil liegt bei gut **${Math.round(WERT_SOLAR)} ct je kWh**.`,
    "Den größten Hebel haben ein effizient laufendes Heizsystem (niedrige Vorlauftemperatur), eine PV-geführte Warmwasserbereitung über **SG Ready** oder ein Energiemanagement und eine eher große PV-Anlage.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich eine Wärmepumpe mit Photovoltaik?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: `**Eine Wärmepumpe mit Photovoltaik lohnt sich in den meisten Einfamilienhäusern, weil der Solarstrom teuren Netzstrom ersetzt und die Anlage deutlich mehr Strom selbst nutzt.** Realistisch ist aber nicht, dass die [PV-Anlage](/produkte/photovoltaikanlage) die Heizung „kostenlos“ betreibt: Rund drei Viertel des Raumwärmebedarfs fallen von November bis März an, also genau dann, wenn die Module am wenigsten liefern.`,
        },
        {
          typ: "p",
          text: "Die Verbraucherzentrale nennt für Einfamilienhäuser ohne Batteriespeicher eine Eigenversorgung von etwa 20 bis 30 % des gesamten Strombedarfs aus Haushalt und Wärmepumpe, mit Speicher rund 40 %. Eine Feldmessung des Fraunhofer ISE an einem Bestandsgebäude aus den 1960er-Jahren mit Erdwärmepumpe, 12,3 kWp und 11,7-kWh-Speicher kam auf rund 36 % des Wärmepumpenstroms aus der eigenen PV-Anlage. Unsere Simulation liegt in derselben Größenordnung.",
        },
        {
          typ: "kennzahl",
          wert: `${Math.round(WERT_SOLAR)} ct`,
          titel: "Vorteil je Kilowattstunde Solarstrom in der Wärmepumpe",
          text: `Gerechnet mit ${W.wpTarifCt} ct/kWh Strompreis für die Wärmepumpe (übliche Spanne 21–28 ct, inkl. § 14a-Rabatt) abzüglich der entgangenen Einspeisevergütung von ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct (Anlagen bis 10 kWp ab ${VERGUETUNG.gueltigAbLabel}).`,
        },
      ],
    },
    {
      id: "deckungsanteil",
      titel: "Wie viel Wärmepumpenstrom kommt realistisch vom Dach?",
      tocLabel: "Realistischer Solaranteil",
      bloecke: [
        {
          typ: "p",
          text: `**Der Solaranteil hängt vor allem vom Gebäude ab: Je weniger Heizstrom die Wärmepumpe braucht, desto größer ist der Anteil, den die PV-Anlage übernimmt.** Die Tabelle zeigt Ergebnisse unserer stündlichen Jahressimulation für ein Haus mit ${FLAECHE} m² Wohnfläche, ${(W.haushaltKwh).toLocaleString("de-DE")} kWh Haushaltsstrom und einer 10-kWp-Anlage auf einem Süddach in Süddeutschland (${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp).`,
        },
        {
          typ: "tabelle",
          caption: `Solaranteil am Wärmepumpenstrom nach Gebäudestandard, ${FLAECHE} m², 10 kWp, Stand September 2026`,
          kopf: ["Gebäude", "Jahresarbeitszahl", "Strombedarf Wärmepumpe", "Solaranteil ohne Speicher", "Solaranteil mit 8 kWh"],
          zeilen: [TEIL, MITTEL, SANIERT, NEU].map((f) => [f.s.label, komma(f.s.jaz), kwh(f.ohne.wpStrom), pct(f.ohne.solar.anteil), pct(f.mit.solar.anteil)]),
          hervorheben: 3,
          markierteZeile: 1,
          minBreite: 640,
          fussnote: "Simulation mit typischen Last- und Wetterprofilen (8.760 Stunden), ohne PV-geführte Steuerung. Mit SG Ready oder Energiemanagement lässt sich der Anteil um einige Prozentpunkte erhöhen. Orientierungswerte, keine Ertragsgarantie.",
        },
        {
          typ: "p",
          text: `Auffällig: Der Anteil steigt im gut gedämmten Neubau zwar prozentual, die eingesparte Strommenge ist im unsanierten Altbau aber am größten. Eine größere Anlage hilft nur begrenzt – mit 15 statt 10 kWp steigt der Solaranteil im Beispielhaus von ${pct(MITTEL.ohne.solar.anteil)} auf ${pct(MITTEL15.ohne.solar.anteil)}, mit Speicher von ${pct(MITTEL.mit.solar.anteil)} auf ${pct(MITTEL15.mit.solar.anteil)}. Der zusätzliche Ertrag fällt vor allem im Sommer an, wenn die Wärmepumpe nur Warmwasser bereitet.`,
        },
        { typ: "h3", text: "Warum der Winter die Grenze setzt" },
        {
          typ: "p",
          text: `Die Monatswerte zeigen das Grundproblem: Im Januar braucht die Wärmepumpe im Beispiel rund ${Math.round(MONATE[0].wp / MONATE[6].wp)}-mal so viel Strom wie im Juli, die PV-Anlage liefert aber nur einen Bruchteil ihres Sommerertrags. Von November bis Februar kommen deshalb nur rund **${pct(winter)} des Wärmepumpenstroms** vom Dach. Mehr zu Erträgen in der dunklen Jahreszeit lesen Sie im Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).`,
        },
        {
          typ: "tabelle",
          caption: `Wärmepumpenstrom und Solaranteil je Monat – Beispielhaus ${FLAECHE} m², Baujahr 1995–2009, 10 kWp ohne Speicher`,
          kopf: ["Monat", "Strom Wärmepumpe", "davon Solarstrom", "Anteil"],
          zeilen: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(monatZeile),
          hervorheben: 3,
          minBreite: 480,
          fussnote: "Monatswerte gerundet. Im Sommer ist der Anteil nicht 100 %, weil die Wärmepumpe auch nachts und am frühen Morgen läuft.",
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Was bringt der Solarstrom finanziell?",
      tocLabel: "Wirtschaftlichkeit",
      bloecke: [
        {
          typ: "p",
          text: `**Im Beispielhaus spart der Solarstrom gegenüber einer Wärmepumpe mit reinem Netzstrom rund ${eur10(MITTEL.ohne.netz.summe - MITTEL.ohne.solar.summe)} im Jahr ohne und rund ${eur10(MITTEL.ohne.netz.summe - MITTEL.mit.solar.summe)} mit Speicher.** Das klingt überschaubar – der eigentliche Gewinn der PV-Anlage entsteht zusätzlich beim Haushaltsstrom. Zusammen verbessert die Wärmepumpe aber die Auslastung der Anlage: Mehr Solarstrom wird selbst genutzt statt für ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct eingespeist.`,
        },
        {
          typ: "tabelle",
          caption: `Jährliche Heizkosten im Beispielhaus (${FLAECHE} m², Baujahr 1995–2009, ${kwh(MITTEL.ohne.bedarf)} Wärmebedarf)`,
          kopf: ["Variante", "Energiekosten", "Wartung & Nebenkosten", "Summe pro Jahr"],
          zeilen: [
            [`Gasheizung (${komma(GAS)} ct/kWh)`, eur10(MITTEL.ohne.fossil.brennstoff), eur(MITTEL.ohne.fossil.nebenkosten), eur10(MITTEL.ohne.fossil.summe)],
            [`Wärmepumpe, Netzstrom (${W.wpTarifCt} ct/kWh)`, eur10(MITTEL.ohne.netz.strom), eur(MITTEL.ohne.netz.nebenkosten), eur10(MITTEL.ohne.netz.summe)],
            ["Wärmepumpe + 10 kWp PV", eur10(MITTEL.ohne.solar.strom), eur(MITTEL.ohne.solar.nebenkosten), eur10(MITTEL.ohne.solar.summe)],
            ["Wärmepumpe + 10 kWp PV + 8 kWh Speicher", eur10(MITTEL.mit.solar.strom), eur(MITTEL.mit.solar.nebenkosten), eur10(MITTEL.mit.solar.summe)],
          ],
          hervorheben: 3,
          markierteZeile: 2,
          minBreite: 620,
          fussnote: `Solarstrom ist mit der entgangenen Einspeisevergütung bewertet. Gas inkl. Grundpreis, Wartung und Schornsteinfeger (${eur(W.heizungen.gas.nebenkosten)}/Jahr), Wärmepumpe mit ${eur(W.wpNebenkosten)} Wartung. Ohne Investitionskosten und Förderung.`,
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Eigener Wärmepumpenzähler oder ein gemeinsamer Zähler?",
          text: `Viele Versorger bieten günstigere Wärmepumpentarife mit separatem Zähler an; über § 14a EnWG gibt es alternativ 60 % Rabatt auf den Netzentgelt-Arbeitspreis (Modul 2, eigener Zählpunkt nötig). Hängt die Wärmepumpe an einem getrennten Zähler, kann sie Solarstrom aber nur nutzen, wenn der Netzbetreiber ein passendes Messkonzept (z. B. Kaskadenschaltung) zulässt. Mit PV-Anlage ist deshalb oft ein **gemeinsamer Zähler mit pauschalem Netzentgelt-Rabatt** (Modul 1, rund ${WALLBOX.paragraf14a.ersparnisVon}–${WALLBOX.paragraf14a.ersparnisBis} € pro Jahr) die einfachere Lösung. Details im Ratgeber [§ 14a EnWG](/ratgeber/paragraf-14a-enwg).`,
        },
        { typ: "tool", href: "/rechner/waermepumpe", titel: "Heizkosten mit Ihrer PV-Anlage berechnen", text: "Wohnfläche, Baujahr, bisherige Heizung und Anlagengröße eingeben – mit Monatsverlauf und Solaranteil.", label: "Zum Wärmepumpen-Rechner" },
      ],
    },
    {
      id: "steuerung",
      titel: "SG Ready und Energiemanagement: So nutzt die Wärmepumpe mehr Solarstrom",
      tocLabel: "SG Ready & Steuerung",
      bloecke: [
        {
          typ: "p",
          text: "**Ohne Steuerung läuft die Wärmepumpe, wenn das Haus Wärme braucht – nicht, wenn die Sonne scheint.** Eine PV-geführte Regelung verschiebt einen Teil der Laufzeit in die Mittagsstunden und nutzt Warmwasserspeicher, Pufferspeicher und die Gebäudemasse als Wärmespeicher. Das ist deutlich günstiger als eine Batterie.",
        },
        {
          typ: "tabelle",
          caption: "Die vier Betriebszustände der SG-Ready-Schnittstelle",
          kopf: ["Zustand", "Signal", "Was die Wärmepumpe macht"],
          zeilen: [
            ["1", "Sperre", "Betrieb wird unterbrochen (früher EVU-Sperre, heute über § 14a-Steuerung geregelt)"],
            ["2", "Normalbetrieb", "Regelt nach Heizkurve und Warmwasser-Solltemperatur"],
            ["3", "Einschaltempfehlung", "Verstärkter Betrieb: z. B. Warmwasser einige Grad höher laden, Puffer füllen"],
            ["4", "Einschaltbefehl", "Maximaler Betrieb im Rahmen der eingestellten Grenzen"],
          ],
          minBreite: 560,
        },
        {
          typ: "p",
          text: "Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) oder der Wechselrichter schaltet die Zustände 3 und 4, sobald ein bestimmter Überschuss anliegt. Modernere Geräte lassen sich auch über Modbus oder EEBus direkt mit einer Leistungsvorgabe ansteuern, was feiner regelt als die zwei Kontakte von SG Ready.",
        },
        { typ: "h3", text: "Was Sie realistisch erwarten können" },
        {
          typ: "liste",
          punkte: [
            "**Warmwasser mittags laden:** Der einfachste Schritt. Ein 300-Liter-Speicher, der bei Überschuss auf 55 statt 48 °C geladen wird, speichert rund 2,5 kWh zusätzliche Wärme für den Abend.",
            "**Raumtemperatur leicht anheben:** Bei Überschuss 0,5 bis 1 °C mehr – Fußbodenheizung und massive Bauteile geben die Wärme über Stunden ab.",
            "**Effizienz im Blick behalten:** Höhere Temperaturen senken die Arbeitszahl. Im Fraunhofer-Feldtest verringerte die PV-optimierte Betriebsweise die Effizienz je nach Modus um 4 bis knapp 6 %.",
            "**Heizstab nur als Ausnahme:** Ein elektrischer Heizstab macht aus 1 kWh Strom nur 1 kWh Wärme, die Wärmepumpe drei bis vier. Er ist Notlösung, kein Solarverwerter. Mehr dazu unter [Heizstab mit Photovoltaik](/ratgeber/heizstab-photovoltaik).",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          text: "Achten Sie beim Kauf der Wärmepumpe auf eine SG-Ready-Schnittstelle oder eine offene Modbus-/EEBus-Anbindung und darauf, dass Ihr Wechselrichter oder Energiemanager das Gerät unterstützt. Nachträglich ist die Kopplung oft nur mit Zusatzmodulen möglich.",
        },
      ],
    },
    {
      id: "auslegung",
      titel: "PV-Anlage und Speicher für die Wärmepumpe richtig auslegen",
      tocLabel: "Auslegung",
      bloecke: [
        {
          typ: "p",
          text: `**Mit Wärmepumpe darf die PV-Anlage größer ausfallen als für den Haushalt allein – ein Speicher lohnt sich vor allem für den Abend- und Übergangszeitbedarf.** Als Faustregel gilt: Planen Sie den Gesamtstrombedarf aus Haushalt und Wärmepumpe (im Beispiel rund ${kwh(W.haushaltKwh + MITTEL.ohne.wpStrom)}) ein und belegen Sie das Dach eher großzügig. Wie die Größe genau ermittelt wird, zeigt der Ratgeber [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen).`,
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Modulfläche", text: "Für die Wärmepumpe zählt jede zusätzliche Kilowattstunde im Frühjahr und Herbst. Ost-West-Dächer liefern morgens und abends mehr, steilere Süddächer mehr bei tief stehender Sonne." },
            { titel: "Speichergröße", text: "Der Speicher sollte den Nachtbedarf abdecken, aber nicht deutlich größer sein. Für Haushalt plus Wärmepumpe sind oft 8 bis 12 kWh sinnvoll – der [Stromspeicher-Rechner](/rechner/stromspeicher) zeigt Ihren Fall." },
            { titel: "Wärmepumpe", text: "Eine gut geplante Wärmepumpe mit niedriger Vorlauftemperatur senkt den Strombedarf stärker als jede PV-Erweiterung. Hydraulischer Abgleich und passende Heizkörper sind Pflicht für eine gute Jahresarbeitszahl." },
            { titel: "Zählerschrank & § 14a", text: "Wärmepumpen über 4,2 kW gelten als steuerbare Verbrauchseinrichtung. Planen Sie Platz für Steuerbox und ggf. zusätzlichen Zählerplatz gleich mit ein." },
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Reihenfolge bei der Sanierung",
          text: "Wer beides plant, spart Doppelarbeit: Zählerschrank, Leitungswege und Energiemanagement werden einmal gemeinsam geplant. Die Wärmepumpe wird über die KfW gefördert, für die PV-Anlage gilt der Nullsteuersatz – beides lässt sich kombinieren. Prüfen Sie Ihre Möglichkeiten im [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler bei der Kombination",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Mit Jahresbilanz rechnen:** Eine 10-kWp-Anlage erzeugt übers Jahr mehr Strom, als die Wärmepumpe braucht – im Januar reicht sie trotzdem bei Weitem nicht.",
            "**Vorlauftemperatur ignorieren:** Wer für mehr Solarnutzung dauerhaft heißer fährt, verliert mehr Effizienz, als der Solarstrom bringt.",
            "**Speicher zu groß wählen:** Im Winter wird er kaum voll, im Sommer braucht die Wärmepumpe wenig. Zu große Speicher verlängern die Amortisation.",
            "**Messkonzept vergessen:** Ein separater Wärmepumpenzähler ohne passende Schaltung schließt den Solarstrom aus.",
            "**Schnittstellen nicht prüfen:** Wärmepumpe, Wechselrichter und Energiemanager müssen zusammenpassen.",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So gehen Sie vor",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Wärmebedarf ermitteln", "Verbrauch der bisherigen Heizung der letzten Jahre notieren (kWh Gas oder Liter Öl) und Baujahr, Dämmung und Heizkörper festhalten."],
            ["Heizkosten vergleichen", "Mit dem [Wärmepumpen-Rechner](/rechner/waermepumpe) Kosten und Solaranteil mit und ohne PV durchspielen."],
            ["Gesamtsystem planen", "PV-Größe, Speicher, Messkonzept und Steuerung (SG Ready, EEBus, Modbus) gemeinsam festlegen – nicht getrennt von zwei Gewerken."],
            ["Förderung sichern", "Den KfW-Zuschuss für die Wärmepumpe vor der Auftragsvergabe beantragen; Liefervertrag mit aufschiebender oder auflösender Bedingung abschließen."],
            ["Nach einem Jahr optimieren", "Laufzeiten, Arbeitszahl und Solaranteil im Monitoring auswerten und Schwellen der Überschussregelung anpassen."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Wie viel Prozent des Wärmepumpenstroms kann eine PV-Anlage decken?", a: `Ohne Batteriespeicher meist etwa 20 bis 25 %, mit Speicher rund 35 bis 45 %. In unserer Beispielrechnung (${FLAECHE} m², 10 kWp) sind es ${pct(MITTEL.ohne.solar.anteil)} beziehungsweise ${pct(MITTEL.mit.solar.anteil)}. In gut gedämmten Häusern mit großer Anlage kann der Anteil höher liegen.` },
    { q: "Wie groß sollte die PV-Anlage für eine Wärmepumpe sein?", a: "Rechnen Sie Haushalts- und Wärmepumpenstrom zusammen und belegen Sie das Dach eher großzügig; im Einfamilienhaus sind 10 bis 15 kWp üblich. Größer bringt vor allem im Frühjahr und Herbst Vorteile. Den eigenen Bedarf zeigt der [Solarrechner](/solarrechner)." },
    { q: "Kann eine Wärmepumpe im Winter mit Solarstrom laufen?", a: `Nur zu einem kleinen Teil. Von November bis Februar liefert die Anlage im Beispiel rund ${pct(winter)} des Wärmepumpenstroms. Der Rest kommt aus dem Netz – deshalb ist ein günstiger Stromtarif mit § 14a-Rabatt weiterhin wichtig.` },
    { q: "Brauche ich einen Stromspeicher für die Wärmepumpe?", a: "Nicht zwingend. Ein Speicher erhöht den Solaranteil deutlich, lohnt sich aber vor allem durch den abendlichen Haushaltsstrom. Günstiger ist es, zuerst Warmwasser- und Pufferspeicher PV-geführt zu laden." },
    { q: "Was bedeutet SG Ready bei Wärmepumpen?", a: "SG Ready ist eine Schnittstelle mit vier Betriebszuständen, über die ein Energiemanager oder Wechselrichter die Wärmepumpe bei Solarüberschuss in einen verstärkten Betrieb schalten kann – etwa um Warmwasser höher aufzuheizen." },
    { q: "Wärmepumpentarif oder Haushaltsstrom mit PV – was ist besser?", a: `Das hängt vom Messkonzept ab. Ein separater Wärmepumpenzähler ist günstiger je kWh, schließt aber ohne passende Schaltung den Solarstrom aus. Mit PV-Anlage ist ein gemeinsamer Zähler mit pauschalem § 14a-Rabatt oft einfacher. Ein Vergleich lohnt sich beim [Stromtarif](/service/stromtarif).` },
    { q: "Wird die Kombination von Wärmepumpe und PV gefördert?", a: "Die Wärmepumpe wird über die KfW-Heizungsförderung (Programm 458) bezuschusst, die PV-Anlage profitiert vom Nullsteuersatz und kann über den KfW-Kredit 270 finanziert werden. Einen gemeinsamen Zuschuss für beide gibt es auf Bundesebene nicht; einzelne Länder und Kommunen fördern zusätzlich." },
  ],

  passend: [
    { href: "/ratgeber/waermepumpe-kosten", titel: "Wärmepumpe Kosten 2026", text: "Anschaffung, Einbau, Betrieb und KfW-Förderung." },
    { href: "/rechner/waermepumpe", titel: "Wärmepumpen-Rechner", text: "Heizkosten und Solaranteil für Ihr Haus berechnen." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Wie PV, Speicher, Wärmepumpe und Wallbox zusammenspielen." },
    { href: "/produkte/warmepumpe", titel: "Wärmepumpe von Ökovolt", text: "Planung und Einbau aus einer Hand." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale – Solarstrom für Wärmepumpen", url: "https://verbraucherzentrale-energieberatung.de/erneuerbare-energien/waermepumpen/solarstrom-fuer-waermepumpen/", stand: "09/2026" },
    { titel: "pv magazine – Fraunhofer ISE: Wärmepumpe mit Photovoltaik und Speicher im Feldtest", url: "https://www.pv-magazine.de/2024/04/03/waermepumpen-fuer-wohngebaeude-in-verbindung-mit-photovoltaik-plus-speicher-erreichen-hoehere-jahresarbeitszahl/", stand: "04/2024" },
    { titel: "HTW Berlin – PV, Wärmepumpe und E-Mobilität", url: "https://solar.htw-berlin.de/themen/pv-waermepumpe-und-e-mobilitaet/", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Steuerbare Verbrauchseinrichtungen nach § 14a EnWG", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/start.html", stand: "09/2026" },
    { titel: "KfW – Heizungsförderung für Privatpersonen (458)", url: "https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/F%C3%B6rderprodukte/Heizungsf%C3%B6rderung-f%C3%BCr-Privatpersonen-Wohngeb%C3%A4ude-(458)/", stand: "07/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
  ],

  seitenCta: { titel: "Wie viel Heizstrom liefert Ihr Dach?", text: "Heizkosten und Solaranteil mit Ihren Werten.", href: "/rechner/waermepumpe", label: "Zum Wärmepumpen-Rechner" },
  cta: {
    title: "Wärmepumpe und PV aus einer Hand planen.",
    text: "Wir prüfen Heizlast, Dach, Zählerschrank und Messkonzept gemeinsam – damit Wärmepumpe, Speicher und Photovoltaik sauber zusammenarbeiten.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Heizkosten berechnen", href: "/rechner/waermepumpe" },
  },
};

export default artikel;
