// Ratgeber: Stromspeicher Kosten 2026
// Preise und Wirtschaftlichkeit kommen aus denselben Annahmen wie der
// Stromspeicher-Rechner (@/lib/rechner/annahmen, @/lib/rechner/stromspeicher).

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { SPEICHER } from "@/lib/rechner/annahmen";
import { speicherReihen, speicherErgebnis } from "@/lib/rechner/stromspeicher";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur100 = (n) => (Math.round(n / 100) * 100).toLocaleString("de-DE") + " €";
const pct = (x) => `${Math.round(x * 100)} %`;
const jahre = (x) => (x == null ? "über 15" : x.toFixed(1).replace(".", ","));
const ctStr = (n) => String(Math.round(n * 10) / 10).replace(".", ",");

const PREIS = ANNAHMEN.speicherPreisProKwh;
const AUFSCHLAG = SPEICHER.nachruestAufschlag;

// Beispielhaushalt: 10 kWp, 4.500 kWh
const BASIS = speicherReihen({ verbrauch: 4500, kwp: 10 });
const e = (kwh, nach = false) => speicherErgebnis(BASIS, { kwp: 10, speicher: kwh, nachruesten: nach });
const S5 = e(5);
const S8 = e(8);
const S10 = e(10);
const S15 = e(15);
const S8N = e(8, true);

// Haushalt mit E-Auto (12.000 km) und 12 kWp
const EAUTO = speicherReihen({ verbrauch: 4500, kwp: 12, eAuto: true, km: 12000 });
const EA10 = speicherErgebnis(EAUTO, { kwp: 12, speicher: 10 });
// Haushalt mit Wärmepumpe und 14 kWp
const WP = speicherReihen({ verbrauch: 4500, kwp: 14, waermepumpe: true });
const WP10 = speicherErgebnis(WP, { kwp: 14, speicher: 10 });

// Kosten je gespeicherter kWh über die Nutzungsdauer (nur Anschaffung)
const speicherCt = (r, kwh) => (r.kosten / (r.vollzyklen * kwh * SPEICHER.lebensdauerJahre)) * 100;
const CT8 = speicherCt(S8, 8);
const CT8N = speicherCt(S8N, 8);
const CT15 = speicherCt(S15, 15);

const artikel = {
  slug: "stromspeicher-kosten",
  title: "Stromspeicher Kosten 2026: Preise pro kWh und Wirtschaftlichkeit",
  seoTitle: "Stromspeicher Kosten 2026: Preise pro kWh | Ökovolt",
  kurzTitel: "Stromspeicher Kosten",
  description:
    "Stromspeicher Kosten 2026: Preise pro kWh nach Größe, Aufpreis für Nachrüstung, laufende Kosten und ehrliche Amortisation mit Beispielrechnungen.",
  excerpt:
    "Was ein Batteriespeicher 2026 wirklich kostet, warum der Preis je kWh allein wenig sagt und wann sich die Nachrüstung noch rechnet – mit Beispielen für Haushalt, E-Auto und Wärmepumpe.",
  hauptKeyword: "stromspeicher kosten",
  keywords: [
    "Stromspeicher Kosten",
    "Stromspeicher Preis pro kWh",
    "Batteriespeicher Kosten 2026",
    "Stromspeicher nachrüsten Kosten",
    "PV-Speicher Preis",
    "Stromspeicher 10 kWh Kosten",
    "Lohnt sich ein Stromspeicher",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Dienstleistungen/Smartphone/Stronspeicher.jpg",
  bildAlt: "Hybrid-Wechselrichter und modularer Batteriespeicher an einer Wand im Technikraum",
  badge: { wert: `~${PREIS} €`, text: "je kWh, gemeinsam mit der PV-Anlage installiert" },

  kurzFazit: [
    `**Ein Stromspeicher kostet 2026 gemeinsam mit der PV-Anlage installiert rund ${PREIS} € je kWh** – ein 8-kWh-Speicher also etwa ${eur(8 * PREIS)}, ein 10-kWh-Speicher etwa ${eur(10 * PREIS)}.`,
    `Wird der Speicher **später nachgerüstet**, kommen typischerweise rund ${eur(AUFSCHLAG)} für Batterie-Wechselrichter und zweiten Montagetermin hinzu.`,
    `Im Beispiel (10 kWp, 4.500 kWh) hebt ein 8-kWh-Speicher die Autarkie von ${pct(S8.ohne.autarkie)} auf ${pct(S8.mit.autarkie)} und spart rund **${eur(S8.ersparnis)} im Jahr** – Amortisation nach etwa ${jahre(S8.amortisation)} Jahren.`,
    `Entscheidend ist nicht der Preis je kWh, sondern **was eine gespeicherte Kilowattstunde kostet**: im Beispiel rund ${ctStr(CT8)} ct – bei einem überdimensionierten Speicher deutlich mehr.`,
    "Eine bundesweite Speicherförderung gibt es nicht; es gelten 0 % Umsatzsteuer, der KfW-Kredit 270 und einzelne Landes- oder Kommunalprogramme.",
  ],

  abschnitte: [
    {
      id: "preise",
      titel: "Was kostet ein Stromspeicher 2026?",
      tocLabel: "Preise 2026",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Batteriespeicher für ein Einfamilienhaus kostet 2026 gemeinsam mit der Photovoltaikanlage installiert rund ${PREIS} € je Kilowattstunde Kapazität, also meist ${eur100(5 * PREIS)} bis ${eur100(15 * PREIS)} für 5 bis 15 kWh.** Darin enthalten sind Batteriemodule, Montage, Verkabelung und Inbetriebnahme. Weil auf Wohngebäuden der [Nullsteuersatz](/wissen/lexikon#nullsteuersatz) gilt, sind das Endpreise ohne Umsatzsteuer.`,
        },
        {
          typ: "p",
          text: "Die Marktspanne ist groß. Die Verbraucherzentrale nennt für Speicher ab 5 kWh 300 bis 700 € je kWh (Stand Juli 2026). Am unteren Ende liegen große Speicher und reine Batteriepakete ohne Montage, am oberen Ende kleine Systeme mit eigenem Batterie-Wechselrichter, Ersatzstromfunktion oder aufwendiger Installation. Die Preise sind seit 2023 deutlich gefallen; die Kosten für Montage, Elektroarbeiten und Zählerschrank sinken aber kaum mit.",
        },
        {
          typ: "tabelle",
          caption: `Richtpreise für Stromspeicher nach Größe, Stand September 2026`,
          kopf: ["Speichergröße", "Passend für (Richtwert)", "Gemeinsam mit PV", "Nachgerüstet"],
          zeilen: [
            ["5 kWh", "1–2 Personen, ca. 2.500–3.500 kWh", eur(5 * PREIS), eur(5 * PREIS + AUFSCHLAG)],
            ["8 kWh", "3–4 Personen, ca. 4.000–5.000 kWh", eur(8 * PREIS), eur(8 * PREIS + AUFSCHLAG)],
            ["10 kWh", "Haushalt mit E-Auto, ca. 6.000–7.000 kWh", eur(10 * PREIS), eur(10 * PREIS + AUFSCHLAG)],
            ["15 kWh", "mit Wärmepumpe, ab ca. 8.000 kWh", eur(15 * PREIS), eur(15 * PREIS + AUFSCHLAG)],
          ],
          hervorheben: 2,
          markierteZeile: 1,
          minBreite: 620,
          fussnote: `Orientierungswerte inkl. Montage, 0 % USt, keine Angebote. Nachrüstung: Aufschlag von rund ${eur(AUFSCHLAG)} für einen eigenen Batterie-Wechselrichter (AC-Kopplung) und den zweiten Montagetermin. Ersatzstrom, Zählerschrank-Umbau und Energiemanagement sind nicht enthalten.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum große Speicher je kWh günstiger sind",
          text: "Wechselrichter, Batteriemanagement, Montage und Anmeldung kosten fast gleich viel, egal ob 5 oder 15 kWh angeschlossen werden. Jede zusätzliche Kilowattstunde kostet dann nur noch das Batteriemodul. Das verleitet dazu, zu groß zu kaufen – dazu mehr im Abschnitt zur Wirtschaftlichkeit.",
        },
      ],
    },
    {
      id: "zusammensetzung",
      titel: "Woraus sich der Speicherpreis zusammensetzt",
      tocLabel: "Kostenbestandteile",
      bloecke: [
        { typ: "p", text: "**Der Endpreis besteht aus Batterie, Leistungselektronik, Installation und optionalem Zubehör.** Wer Angebote vergleicht, sollte prüfen, welche dieser Positionen tatsächlich enthalten sind:" },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Batteriemodule", text: "Der größte Posten. Heute fast immer [Lithium-Eisenphosphat (LFP)](/wissen/lexikon#lfp): sicher, zyklenfest, ohne Kobalt. Achten Sie auf die **nutzbare** Kapazität, nicht nur die Nennkapazität." },
            { titel: "Wechselrichter", text: "Bei Neuanlagen übernimmt meist ein [Hybridwechselrichter](/wissen/lexikon#hybridwechselrichter) PV und Batterie. Beim Nachrüsten braucht es oft einen separaten Batterie-Wechselrichter." },
            { titel: "Installation & Elektrik", text: "Montage, Leitungen, Schutzeinrichtungen, Inbetriebnahme und Anmeldung. Ist der [Zählerschrank](/wissen/lexikon#zaehlerschrank) veraltet, kann ein Umbau mehrere tausend Euro zusätzlich kosten." },
            { titel: "Optionen", text: "Notstrom- oder Ersatzstromfunktion, [Energiemanagementsystem](/wissen/lexikon#energiemanagementsystem), Wallbox-Anbindung, Steuerung für dynamische Tarife. Diese Positionen treiben den Preis je kWh am stärksten." },
          ],
        },
        {
          typ: "tabelle",
          caption: "Häufige Zusatzkosten rund um den Speicher (Marktspannen, Stand 2026)",
          kopf: ["Position", "Typische Mehrkosten", "Wann nötig?"],
          zeilen: [
            ["Notstromsteckdose (einzelne Verbraucher)", "einige hundert Euro", "wenn bei Stromausfall z. B. Kühlschrank und Router laufen sollen"],
            ["Ersatzstrom fürs ganze Haus (Umschaltbox)", "ca. 1.000–2.500 €", "wenn Heizung, Licht und Steckdosen weiterlaufen sollen"],
            ["Zählerschrank-Erneuerung", "ca. 1.500–3.500 €, im Einzelfall mehr", "bei alten Schränken ohne Platz für neue Zähler und Schutztechnik"],
            ["Energiemanagement / Steuerung", "oft im System enthalten, sonst einige hundert Euro", "für Wallbox, Wärmepumpe oder dynamische Stromtarife"],
          ],
          minBreite: 620,
          fussnote: "Marktspannen aus Fachportalen und Anbieterangaben; der tatsächliche Aufwand hängt von Gebäude und vorhandener Technik ab.",
        },
        {
          typ: "p",
          text: "Wie viel Sie für Ausfallsicherheit wirklich brauchen, erklärt der Ratgeber [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik). Nicht jeder Haushalt braucht eine Umschaltung für das ganze Haus.",
        },
      ],
    },
    {
      id: "nachruesten",
      titel: "Nachrüsten oder gleich mitkaufen?",
      tocLabel: "Nachrüsten vs. gemeinsam",
      bloecke: [
        {
          typ: "p",
          text: `**Gemeinsam mit der PV-Anlage installiert ist ein Speicher fast immer günstiger als eine spätere Nachrüstung.** Der Hybridwechselrichter der Neuanlage kann die Batterie direkt ansteuern ([DC-Kopplung](/wissen/lexikon#dc-kopplung)), und Gerüst, Elektriker und Anmeldung fallen nur einmal an. Beim Nachrüsten an einer Anlage mit reinem PV-Wechselrichter wird meist ein eigener Batterie-Wechselrichter nötig ([AC-Kopplung](/wissen/lexikon#ac-kopplung)) – im Rechner kalkulieren wir dafür rund ${eur(AUFSCHLAG)} Aufschlag.`,
        },
        {
          typ: "tabelle",
          caption: "8-kWh-Speicher im Beispielhaushalt: gemeinsam installiert vs. nachgerüstet",
          kopf: ["", "Gemeinsam mit PV", "Später nachgerüstet"],
          zeilen: [
            ["Investition", eur(S8.kosten), eur(S8N.kosten)],
            ["Ersparnis pro Jahr (Jahr 1)", eur(S8.ersparnis), eur(S8N.ersparnis)],
            ["Amortisation", `${jahre(S8.amortisation)} Jahre`, `${jahre(S8N.amortisation)} Jahre`],
            [`Überschuss nach ${SPEICHER.lebensdauerJahre} Jahren`, eur(S8.ueberschuss), eur(S8N.ueberschuss)],
            ["Kosten je gespeicherter kWh", `${ctStr(CT8)} ct`, `${ctStr(CT8N)} ct`],
          ],
          hervorheben: 1,
          minBreite: 520,
          fussnote: `10 kWp, 4.500 kWh Jahresverbrauch, stündliche Simulation wie im Stromspeicher-Rechner, ${ctStr(ANNAHMEN.strompreis * 100)} ct Strompreis mit ${Math.round(SPEICHER.strompreisSteigerung * 100)} % Steigerung pro Jahr, entgangene Einspeisevergütung abgezogen, ${SPEICHER.lebensdauerJahre} Jahre Nutzungsdauer.`,
        },
        { typ: "h3", text: "Wann sich die Nachrüstung trotzdem lohnt" },
        {
          typ: "checkliste",
          punkte: [
            "**Die EEG-Vergütung Ihrer Altanlage endet** oder ist bereits ausgelaufen: Überschuss bringt dann kaum noch Geld, jede gespeicherte kWh zählt voll. Mehr dazu unter [Photovoltaik nach 20 Jahren](/ratgeber/photovoltaik-nach-20-jahren).",
            "**Ihr Verbrauch ist gestiegen**, etwa durch E-Auto oder Wärmepumpe, und der Strom wird abends und nachts gebraucht.",
            "**Der Wechselrichter muss ohnehin getauscht werden:** Dann kann direkt ein Hybridgerät eingebaut werden und der Nachrüstaufschlag entfällt weitgehend.",
            "**Ihre Anlage fällt unter das Solarspitzengesetz** (Inbetriebnahme ab 25. Februar 2025) und darf ohne Smart Meter nur 60 % der Modulleistung einspeisen – ein Speicher nimmt die Mittagsspitze auf. Details im Ratgeber [Solarspitzengesetz](/ratgeber/solarspitzengesetz).",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Steuer und Anmeldung beim Nachrüsten",
          text: "Der Nullsteuersatz nach § 12 Abs. 3 UStG gilt auch für einen später nachgerüsteten Speicher an einer PV-Anlage auf einem Wohngebäude. Der Speicher muss innerhalb eines Monats nach Inbetriebnahme im [Marktstammdatenregister](/wissen/lexikon#marktstammdatenregister) eingetragen und dem Netzbetreiber gemeldet werden. Die EEG-Vergütung der bestehenden Anlage bleibt erhalten.",
        },
      ],
    },
    {
      id: "wirtschaftlichkeit",
      titel: "Lohnt sich ein Stromspeicher finanziell?",
      tocLabel: "Wirtschaftlichkeit",
      bloecke: [
        {
          typ: "p",
          text: `**Ein passend dimensionierter Speicher rechnet sich 2026 in vielen Einfamilienhäusern innerhalb seiner Nutzungsdauer – ein zu großer oft nicht.** Der Speicher verdient Geld, indem er Solarstrom vom Mittag in den Abend verschiebt. Jede so genutzte Kilowattstunde spart rund ${ctStr(ANNAHMEN.strompreis * 100)} ct Netzstrom, verzichtet aber auf ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct [Einspeisevergütung](/ratgeber/einspeiseverguetung-2026) und verliert beim Laden und Entladen einen Teil der Energie.`,
        },
        {
          typ: "tabelle",
          caption: "Speichergröße und Wirtschaftlichkeit: 10 kWp, 4.500 kWh Jahresverbrauch, gemeinsam installiert",
          kopf: ["Speicher", "Kosten", "Autarkie", "Ersparnis/Jahr", "Amortisation", "Kosten je gesp. kWh"],
          zeilen: [
            ["ohne", "–", pct(S8.ohne.autarkie), "–", "–", "–"],
            ["5 kWh", eur(S5.kosten), pct(S5.mit.autarkie), eur(S5.ersparnis), `${jahre(S5.amortisation)} J.`, `${ctStr(speicherCt(S5, 5))} ct`],
            ["8 kWh", eur(S8.kosten), pct(S8.mit.autarkie), eur(S8.ersparnis), `${jahre(S8.amortisation)} J.`, `${ctStr(CT8)} ct`],
            ["10 kWh", eur(S10.kosten), pct(S10.mit.autarkie), eur(S10.ersparnis), `${jahre(S10.amortisation)} J.`, `${ctStr(speicherCt(S10, 10))} ct`],
            ["15 kWh", eur(S15.kosten), pct(S15.mit.autarkie), eur(S15.ersparnis), `${jahre(S15.amortisation)} J.`, `${ctStr(CT15)} ct`],
          ],
          markierteZeile: 2,
          hervorheben: 4,
          minBreite: 680,
          fussnote: `Stündliche Jahressimulation mit ${Math.round(SPEICHER.wirkungsgradJeRichtung * 100)} % Wirkungsgrad je Richtung und ${Math.round(SPEICHER.nutzbarAnteil * 100)} % nutzbarer Kapazität. Kosten je gespeicherter kWh = Anschaffung geteilt durch die über ${SPEICHER.lebensdauerJahre} Jahre entladene Energie, ohne entgangene Einspeisevergütung. Orientierungswerte.`,
        },
        {
          typ: "p",
          text: `Die Tabelle zeigt das typische Muster: Die ersten Kilowattstunden Speicher bringen viel, jede weitere immer weniger. Von 10 auf 15 kWh steigt die Autarkie nur noch um wenige Prozentpunkte, weil der größere Speicher an vielen Tagen – vor allem im Winter – gar nicht voll wird. Die Kosten je gespeicherter Kilowattstunde steigen dadurch von ${ctStr(CT8)} auf ${ctStr(CT15)} ct.`,
        },
        {
          typ: "kennzahl",
          wert: `${ctStr(CT8)} ct`,
          titel: "kostet im Beispiel jede Kilowattstunde aus dem 8-kWh-Speicher",
          text: `Dazu kommen rund ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct entgangene Einspeisevergütung plus Umwandlungsverluste. Solange die Summe unter Ihrem Strompreis liegt, verdient der Speicher Geld.`,
        },
        { typ: "h3", text: "Mit E-Auto oder Wärmepumpe steigt der Nutzen" },
        {
          typ: "p",
          text: `Wer mehr Strom am Abend braucht, nutzt den Speicher häufiger. Ein Haushalt mit E-Auto (12.000 km im Jahr, 12 kWp) spart mit 10 kWh rund ${eur(EA10.ersparnis)} im Jahr (Amortisation etwa ${jahre(EA10.amortisation)} Jahre), ein Haushalt mit Wärmepumpe (14 kWp) rund ${eur(WP10.ersparnis)} (etwa ${jahre(WP10.amortisation)} Jahre). Allerdings liefert die PV-Anlage im Winter, wenn die Wärmepumpe am meisten braucht, auch am wenigsten – der Speicher ersetzt keine Planung. Mehr dazu unter [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).`,
        },
        {
          typ: "tool",
          href: "/rechner/stromspeicher",
          titel: "Welche Speichergröße rechnet sich für Sie?",
          text: "Verbrauch, Anlagengröße, E-Auto und Wärmepumpe eingeben – der Rechner zeigt Autarkie-Kurve, wirtschaftliches Optimum und Amortisation.",
          label: "Zum Stromspeicher-Rechner",
        },
      ],
    },
    {
      id: "laufende-kosten",
      titel: "Laufende Kosten und versteckte Verluste",
      tocLabel: "Laufende Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Heimspeicher ist weitgehend wartungsfrei, verursacht aber indirekte Kosten durch Umwandlungs- und Bereitschaftsverluste.** Die Stromspeicher-Inspektion 2026 der HTW Berlin zeigt, wie groß die Unterschiede sind: Sehr effiziente Systeme brauchen im Bereitschaftsbetrieb rund 4 Watt, das schwächste getestete System 64 Watt. Zwischen dem effizientesten und dem ineffizientesten System im 10-kW-Vergleich liegen nach HTW-Angaben rund 200 € Unterschied pro Jahr.",
        },
        {
          typ: "liste",
          punkte: [
            "**Bereitschaftsverbrauch:** 20 Watt Dauerverbrauch entsprechen rund 175 kWh im Jahr – bei 33 ct also knapp 60 €.",
            "**Wirkungsgrad:** Ein Teil der gespeicherten Energie geht beim Laden und Entladen verloren. Die Verbraucherzentrale nennt Speicherverluste von etwa 20 %, gute Systeme liegen darunter.",
            "**Alterung:** Die nutzbare Kapazität sinkt über die Jahre. Hersteller garantieren meist eine Restkapazität nach 10 Jahren, die Bedingungen unterscheiden sich aber stark – die HTW Berlin empfiehlt, auf eine Kapazitätsgarantie von mindestens 80 % zu achten. Mehr im Ratgeber [Stromspeicher Lebensdauer](/ratgeber/stromspeicher-lebensdauer).",
            "**Versicherung:** Der Speicher sollte in der [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung) mitversichert sein – das kostet meist nur wenig Aufpreis.",
            "**Software und Gewährleistung:** Einige Hersteller knüpfen die Garantie an eine dauerhafte Internetverbindung oder regelmäßige Updates. Lesen Sie die Garantiebedingungen vor dem Kauf.",
          ],
        },
      ],
    },
    {
      id: "foerderung",
      titel: "Förderung: Was den Speicher günstiger macht",
      tocLabel: "Förderung",
      bloecke: [
        {
          typ: "p",
          text: "**Einen bundesweiten Zuschuss für Batteriespeicher gibt es 2026 nicht.** Drei Instrumente senken die Kosten trotzdem spürbar:",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "0 % Umsatzsteuer", text: "Speicher an PV-Anlagen auf Wohngebäuden sind nach § 12 Abs. 3 UStG von der Umsatzsteuer befreit – auch bei Nachrüstung. Details unter [steuerliche Vorteile](/forderungen/steuerlich)." },
            { titel: "KfW-Kredit 270", text: "Finanziert PV-Anlage und Speicher zinsgünstig; der Antrag läuft über die Hausbank vor Vertragsabschluss. Mehr im Ratgeber [KfW 270](/ratgeber/kfw-kredit-270)." },
            { titel: "Länder & Kommunen", text: "Zuschüsse gibt es nur vereinzelt, etwa SolarPLUS in Berlin oder Programme einzelner Städte – oft mit begrenzten Budgets. Aktuell prüfen im [Förder-Check](/foerdercheck)." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Förderung vor Auftrag beantragen",
          text: "Viele Landes- und Kommunalprogramme verlangen, dass der Antrag vor der Bestellung gestellt wird. Wer zuerst unterschreibt, verliert den Anspruch. Eine Übersicht nach Bundesland finden Sie unter [Landesförderungen](/forderungen/landesforderungen).",
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Dynamische Tarife und neue Regeln: Was sich 2026 ändert",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Neue Regeln könnten den Speicher künftig zusätzlich wertvoll machen, garantieren aber keine Mehrerträge.** Mit einem [dynamischen Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich) lässt sich der Speicher in günstigen Stunden aus dem Netz laden. Die Bundesnetzagentur hat mit der Festlegung „MiSpeL“ Regeln erarbeitet, wie Speicher Netzstrom und geförderten Solarstrom gemischt nutzen können, ohne Vergütungsansprüche zu verlieren. Nach dem Arbeitsstand vom August 2026 soll sie zum 1. Oktober 2026 wirksam werden, mit Übergangsregeln bis Ende September 2027.",
        },
        {
          typ: "p",
          text: "Die HTW Berlin rechnet vor: Bei 25 ct Ladepreis und 35 ct Entladepreis lohnt sich das Netzladen erst ab rund 71 % Systemwirkungsgrad – nicht jedes System erreicht das. Kalkulieren Sie den Speicher deshalb in erster Linie über den Eigenverbrauch und betrachten Sie Tarifgeschäfte als Bonus. Den möglichen Vorteil zeigt der [Rechner für dynamische Stromtarife](/rechner/dynamischer-stromtarif).",
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
            "**Nutzbare Kapazität** in kWh angegeben – nicht nur Nennkapazität.",
            "**Preis je nutzbarer kWh** berechnen, inklusive Montage und aller Zusatzpositionen.",
            "**Zelltechnologie** (LFP empfohlen), Zyklenzahl und Garantiebedingungen: Jahre, Restkapazität, Durchsatz.",
            "**Systemwirkungsgrad und Bereitschaftsverbrauch** – idealerweise mit Ergebnis der HTW-Stromspeicher-Inspektion.",
            "**Erweiterbarkeit:** Lassen sich später Module ergänzen, falls E-Auto oder Wärmepumpe dazukommen?",
            "**Notstrom/Ersatzstrom:** enthalten, optional oder gar nicht möglich?",
            "**Anmeldung, Marktstammdatenregister und Inbetriebnahme** im Preis enthalten.",
          ],
        },
        {
          typ: "p",
          text: "Weitere Warnsignale und typische Positionen erklärt der Ratgeber [Photovoltaik-Angebote vergleichen](/ratgeber/photovoltaik-angebot-vergleichen). Welche Speichergröße zu Ihrem Verbrauch passt, lesen Sie unter [Stromspeicher-Größe berechnen](/ratgeber/stromspeicher-groesse).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was kostet ein 10-kWh-Stromspeicher?",
      a: `Gemeinsam mit einer PV-Anlage installiert kostet ein 10-kWh-Speicher 2026 rund ${eur(10 * PREIS)}. Bei einer Nachrüstung mit eigenem Batterie-Wechselrichter liegen Sie eher bei ${eur(10 * PREIS + AUFSCHLAG)}. Ersatzstromfunktion oder ein Zählerschrank-Umbau kommen gegebenenfalls hinzu.`,
    },
    {
      q: "Wie viel kostet ein Stromspeicher pro kWh?",
      a: `Als Richtwert gelten rund ${PREIS} € je kWh installierter Kapazität, wenn der Speicher gemeinsam mit der PV-Anlage eingebaut wird. Die Marktspanne reicht laut Verbraucherzentrale von etwa 300 bis 700 € je kWh – kleine Speicher sind je kWh teurer als große.`,
    },
    {
      q: "Wann amortisiert sich ein Stromspeicher?",
      a: `Ein passend dimensionierter Speicher amortisiert sich typischerweise nach 8 bis 12 Jahren. In unserem Beispiel mit 8 kWh sind es rund ${jahre(S8.amortisation)} Jahre, nachgerüstet rund ${jahre(S8N.amortisation)} Jahre. Überdimensionierte Speicher brauchen deutlich länger, weil sie seltener voll geladen werden.`,
    },
    {
      q: "Lohnt es sich, einen Stromspeicher nachzurüsten?",
      a: "Oft ja – besonders wenn die EEG-Vergütung ausläuft, der Verbrauch durch E-Auto oder Wärmepumpe gestiegen ist oder der Wechselrichter ohnehin getauscht wird. Wegen des zusätzlichen Batterie-Wechselrichters ist die Nachrüstung aber teurer als der gemeinsame Einbau. Der [Stromspeicher-Rechner](/rechner/stromspeicher) hat dafür eine eigene Option.",
    },
    {
      q: "Wie lange hält ein Stromspeicher?",
      a: "Moderne LFP-Speicher sind auf mehrere tausend Vollzyklen ausgelegt; die Verbraucherzentrale nennt eine erwartete Lebensdauer von 10 bis 15 Jahren. Wir rechnen wirtschaftlich mit 15 Jahren. Details im Ratgeber [Stromspeicher Lebensdauer](/ratgeber/stromspeicher-lebensdauer).",
    },
    {
      q: "Gibt es 2026 eine Förderung für Stromspeicher?",
      a: "Bundesweit gibt es keinen Zuschuss, aber 0 % Umsatzsteuer und den KfW-Kredit 270. Zuschüsse zahlen nur einzelne Länder und Städte, etwa Berlin mit SolarPLUS. Welche Programme für Sie gelten, zeigt der [Förder-Check](/foerdercheck).",
    },
    {
      q: "Werden Stromspeicher noch günstiger?",
      a: "Die Preise sind seit 2023 deutlich gefallen, Fachportale erwarten eher moderate weitere Rückgänge. Weil Montage und Elektrik einen festen Anteil ausmachen, lohnt es sich selten, auf weiter sinkende Preise zu warten – jedes Jahr ohne Speicher kostet entgangene Ersparnis.",
    },
  ],

  passend: [
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Optimale Speichergröße mit stündlicher Simulation." },
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage 2026?", text: "Preise je kWp und was im Komplettpreis steckt." },
    { href: "/ratgeber/stromspeicher-groesse", titel: "Stromspeicher-Größe berechnen", text: "Faustregeln und warum größer nicht besser ist." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher von Ökovolt", text: "Planung und Einbau aus einer Hand." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale – Lohnen sich Batteriespeicher für Photovoltaikanlagen?", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/lohnen-sich-batteriespeicher-fuer-photovoltaikanlagen-24589", stand: "07/2026" },
    { titel: "HTW Berlin – Stromspeicher-Inspektion 2026", url: "https://solar.htw-berlin.de/studien/stromspeicher-inspektion-2026/", stand: "03/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
    { titel: "§ 12 Abs. 3 UStG – Nullsteuersatz für Photovoltaikanlagen und Speicher", url: "https://www.gesetze-im-internet.de/ustg_1980/__12.html", stand: "09/2026" },
    { titel: "Photon – BNetzA: MiSpeL-Festlegung soll zum 1. Oktober 2026 wirksam werden", url: "https://www.photon.info/news/bnetza-mispel-festlegung-soll-zum-1-oktober-2026-wirksam-werden/", stand: "08/2026" },
    { titel: "C.A.R.M.E.N. e. V. – Marktübersicht Batteriespeicher", url: "https://www.carmen-ev.de/service/marktueberblick-erneuerbare-energien/marktuebersicht-batteriespeicher/", stand: "07/2026" },
  ],

  seitenCta: { titel: "Welcher Speicher passt?", text: "Autarkie, Ersparnis und Amortisation für Ihren Verbrauch.", href: "/rechner/stromspeicher", label: "Speicher berechnen" },
  cta: {
    title: "Speicher passend statt maximal planen.",
    text: "Wir legen Anlage und Speicher auf Ihren Verbrauch aus – mit ehrlicher Rechnung, ob sich der Speicher bei Ihnen lohnt, und Einbau aus einer Hand.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Speicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
