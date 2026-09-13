// Ratgeber: Stromspeicher Lebensdauer
// Zyklen- und Ersparniswerte aus dem Rechenkern des Stromspeicher-Rechners
// (src/lib/rechner/stromspeicher.js, stündliche Jahressimulation).

import { speicherReihen, speicherErgebnis } from "@/lib/rechner/stromspeicher";
import { SPEICHER, fmt, fmtEur } from "@/lib/rechner/annahmen";

const pct = (x) => `${Math.round(x * 100)} %`;

// Beispiel: 4.500 kWh, 10 kWp, 8 kWh Speicher
const KWP = 10;
const KAP = 8;
const BASIS = speicherReihen({ verbrauch: 4500, kwp: KWP });
const erg = (kap) => speicherErgebnis(BASIS, { kwp: KWP, speicher: kap });

// Vollzyklen je Jahr nach Speichergröße -> wie lange reichen garantierte Zyklen?
const ZYKLEN = [5, 8, 10, 15].map((kap) => ({ kap, zyklen: erg(kap).vollzyklen }));

// Ersparnis bei gealterter Kapazität (Restkapazität 100 / 80 / 60 %)
const REST = [1, 0.9, 0.8, 0.7, 0.6].map((anteil) => ({ anteil, ersparnis: erg(KAP * anteil).ersparnis }));
const ersparnisBei = (anteil) => {
  // lineare Interpolation zwischen den simulierten Stützstellen
  const a = Math.max(0.6, Math.min(1, anteil));
  for (let i = 0; i < REST.length - 1; i++) {
    const o = REST[i], u = REST[i + 1];
    if (a <= o.anteil && a >= u.anteil) return u.ersparnis + ((a - u.anteil) / (o.anteil - u.anteil)) * (o.ersparnis - u.ersparnis);
  }
  return REST[REST.length - 1].ersparnis;
};
const KOSTEN = erg(KAP).kosten;

/** Überschuss nach n Jahren bei jährlichem Kapazitätsverlust v (Strompreis +2 %/Jahr wie im Rechner) */
function ueberschuss(jahre, verlust) {
  let summe = 0;
  for (let t = 1; t <= jahre; t++) {
    const kapAnteil = 1 - verlust * (t - 1);
    summe += ersparnisBei(kapAnteil) * Math.pow(1 + SPEICHER.strompreisSteigerung, t - 1);
  }
  return summe - KOSTEN;
}
const SZENARIEN = [
  { label: "10 Jahre", jahre: 10 },
  { label: "15 Jahre", jahre: 15 },
  { label: "20 Jahre", jahre: 20 },
].map((s) => ({ ...s, v1: ueberschuss(s.jahre, 0.01), v2: ueberschuss(s.jahre, 0.02) }));
const Z8 = ZYKLEN.find((z) => z.kap === 8);

const artikel = {
  slug: "stromspeicher-lebensdauer",
  title: "Stromspeicher Lebensdauer: Wie lange hält ein PV-Speicher?",
  seoTitle: "Stromspeicher Lebensdauer: Zyklen, Garantie, LFP | Ökovolt",
  kurzTitel: "Stromspeicher Lebensdauer",
  description:
    "Stromspeicher Lebensdauer: Wie lange halten LFP- und NMC-Speicher wirklich? Zyklen, Kapazitätsverlust aus Feldstudien, Garantiebedingungen und Tipps.",
  excerpt:
    "Hersteller versprechen 6.000 Zyklen und mehr – doch im Einfamilienhaus altert ein Speicher vor allem mit den Jahren. Was Feldmessungen zeigen, worauf es bei der Garantie ankommt und wie Sie die Lebensdauer verlängern.",
  hauptKeyword: "stromspeicher lebensdauer",
  keywords: [
    "Stromspeicher Lebensdauer",
    "Wie lange hält ein Stromspeicher",
    "PV-Speicher Lebensdauer",
    "Batteriespeicher Ladezyklen",
    "LFP Speicher Lebensdauer",
    "Stromspeicher Garantie",
    "Stromspeicher Kapazitätsverlust",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/stromspeicher-lebensdauer.jpg",
  bildAlt: "Huawei-Stromspeicher LUNA2000 an der Außenwand eines Einfamilienhauses im Winter",
  badge: { wert: "15–20 J.", text: "realistische Lebensdauer eines LFP-Heimspeichers" },

  kurzFazit: [
    "**Ein moderner LFP-Stromspeicher hält bei guter Aufstellung realistisch 15 bis 20 Jahre.** Die Verbraucherzentrale rechnet vorsichtiger mit 10 bis 15 Jahren.",
    `**Zyklen sind selten der Engpass:** Ein ${fmt(8)}-kWh-Speicher kommt im Einfamilienhaus auf rund ${fmt(Z8.zyklen)} Vollzyklen im Jahr. 6.000 Zyklen reichen damit rechnerisch für über ${fmt(Math.floor(6000 / Z8.zyklen))} Jahre – begrenzend ist die kalendarische Alterung.`,
    "Eine Feldstudie der RWTH Aachen über acht Jahre ergab einen Kapazitätsverlust von **rund 2 bis 3 Prozentpunkten pro Jahr** – gemessen an Speichern der ersten Produktgeneration.",
    "Garantien laufen meist **10 Jahre**. Die HTW Berlin fand 2026 große Unterschiede: garantiert werden **60 bis 85 % Restkapazität**, teils mit Durchsatzgrenzen, die früher greifen.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie lange hält ein Stromspeicher?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Lithium-Eisenphosphat-Speicher (LFP) hält im Einfamilienhaus typischerweise 15 bis 20 Jahre, bevor seine Kapazität so weit gesunken ist, dass sich ein Tausch lohnt.** Die Verbraucherzentrale nennt vorsichtiger 10 bis 15 Jahre. Das ist deutlich kürzer als die Lebensdauer der Solarmodule, die bei 25 bis 30 Jahren liegt – ein Speichertausch während der Anlagenlaufzeit ist also einzuplanen.",
        },
        {
          typ: "p",
          text: "Wichtig für die Erwartung: **Ein Speicher geht nicht plötzlich kaputt.** Er verliert Jahr für Jahr etwas Kapazität. Ein Gerät, das nach 15 Jahren noch 70 % seiner ursprünglichen Kapazität hat, funktioniert weiter – es speichert nur weniger. Ob sich dann ein Tausch lohnt, ist eine wirtschaftliche Frage, keine technische.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Kalendarische Alterung", text: "Zellen altern auch ohne Nutzung – beschleunigt durch Wärme und dauerhaft hohen Ladestand. Im Einfamilienhaus der wichtigste Faktor." },
            { titel: "Zyklische Alterung", text: "Jeder Lade- und Entladevorgang belastet das Material. LFP-Zellen sind hier sehr robust; 6.000 und mehr Vollzyklen sind Stand der Technik." },
            { titel: "Elektronik", text: "Wechselrichter, Batteriemanagement und Lüfter haben eigene Lebensdauern. Ein Hybridwechselrichter muss oft vor den Batteriezellen getauscht werden." },
          ],
        },
      ],
    },
    {
      id: "zyklen",
      titel: "Ladezyklen: Warum 6.000 Zyklen im Haus fast nie erreicht werden",
      tocLabel: "Ladezyklen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Vollzyklus entspricht einer kompletten Ladung und Entladung der Nennkapazität** – zwei halbe Ladungen ergeben also einen Vollzyklus. Hersteller geben für LFP-Heimspeicher häufig 6.000 bis 10.000 Zyklen an. Im Haushalt sind das mehr, als ein Speicher je leisten muss. Das zeigt die Jahressimulation unseres [Stromspeicher-Rechners](/rechner/stromspeicher) für einen Haushalt mit 4.500 kWh und 10 kWp:",
        },
        {
          typ: "tabelle",
          caption: "Vollzyklen pro Jahr und rechnerische Zyklen-Lebensdauer nach Speichergröße (4.500 kWh, 10 kWp)",
          kopf: ["Speichergröße", "Vollzyklen pro Jahr", "Jahre bis 6.000 Zyklen", "Jahre bis 4.000 Zyklen"],
          zeilen: ZYKLEN.map((z) => [`${fmt(z.kap)} kWh`, fmt(z.zyklen), `${fmt(6000 / z.zyklen)} Jahre`, `${fmt(4000 / z.zyklen)} Jahre`]),
          hervorheben: 2,
          markierteZeile: 1,
          fussnote: "Simulation mit stündlicher Auflösung über ein Jahr, Speicherverluste und Standby berücksichtigt. Mit dynamischem Stromtarif und Netzladung im Winter steigt die Zyklenzahl.",
        },
        {
          typ: "p",
          text: "Die Rechnung zeigt: Selbst kleine, fleißig genutzte Speicher erreichen 6.000 Zyklen erst nach mehr als 20 Jahren. **Im Haus begrenzt deshalb vor allem die Zeit die Lebensdauer** – also die kalendarische Alterung durch Temperatur und Ladestand. Größer ausgelegte Speicher machen weniger Zyklen, altern kalendarisch aber genauso. Auch deshalb lohnt es sich nicht, „auf Vorrat“ zu groß zu kaufen; mehr dazu im Ratgeber zur [Stromspeicher-Größe](/ratgeber/stromspeicher-groesse).",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Ausnahme: dynamischer Tarif und Netzladen",
          text: "Wer den Speicher mit einem [dynamischen Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich) auch nachts aus dem Netz lädt, erhöht die Zyklenzahl vor allem im Winter. Das ist bei LFP unkritisch, kann aber Garantiegrenzen für den Energiedurchsatz schneller erreichen. Prüfen Sie die Bedingungen vorher.",
        },
      ],
    },
    {
      id: "lfp-nmc",
      titel: "LFP oder NMC: Welche Zellchemie hält länger?",
      tocLabel: "LFP vs. NMC",
      bloecke: [
        {
          typ: "p",
          text: "**Lithium-Eisenphosphat (LFP) hat Nickel-Mangan-Cobalt (NMC) bei Heimspeichern weitgehend abgelöst – vor allem wegen der höheren Zyklenfestigkeit und der besseren thermischen Stabilität.** NMC speichert mehr Energie auf gleichem Raum, was im Auto zählt, im Keller aber kaum.",
        },
        {
          typ: "tabelle",
          caption: "LFP- und NMC-Heimspeicher im Vergleich (typische Herstellerangaben, Stand 2026)",
          kopf: ["Merkmal", "LFP (Lithium-Eisenphosphat)", "NMC (Nickel-Mangan-Cobalt)"],
          zeilen: [
            ["Vollzyklen laut Datenblatt", "meist 6.000–10.000", "meist 3.000–6.000"],
            ["Thermische Stabilität", "sehr hoch, kein Sauerstoff-Freisetzen bei Überhitzung", "geringer, höherer Aufwand beim Batteriemanagement"],
            ["Empfindlichkeit für hohen Ladestand", "gering", "höher – dauerhaft 100 % beschleunigt Alterung"],
            ["Energiedichte", "niedriger (größer, schwerer)", "höher (kompakter)"],
            ["Rohstoffe", "ohne Nickel und Cobalt", "enthält Nickel und Cobalt"],
            ["Marktbedeutung bei neuen Heimspeichern", "Standard", "vor allem in älteren Anlagen"],
          ],
          hervorheben: 1,
          minBreite: 620,
          fussnote: "Datenblattangaben sind unter Laborbedingungen ermittelt (meist 25 °C, definierte Entladetiefe). Die reale Lebensdauer hängt stärker von Temperatur und Betriebsweise ab.",
        },
        {
          typ: "p",
          text: "Die Feldstudie der RWTH Aachen, 2024 in Nature Energy veröffentlicht, fand dagegen keine eindeutige Überlegenheit einer Chemie: Über acht Jahre verloren die 21 gemessenen Speicher mit LFP-, NMC- und Mischzellen im Mittel etwa 2 bis 3 Prozentpunkte nutzbare Kapazität pro Jahr. Einzelne Systeme erreichten bereits nach fünf bis sieben Jahren 80 % Restkapazität, andere alterten langsamer. Die untersuchten Geräte stammten allerdings aus der ersten Produktgeneration; heutige Systeme dürften im Schnitt besser abschneiden. Grundbegriffe erklärt das Lexikon unter [LFP](/wissen/lexikon#lfp) und [Zyklenfestigkeit](/wissen/lexikon#zyklenfestigkeit).",
        },
      ],
    },
    {
      id: "kapazitaetsverlust",
      titel: "Kapazitätsverlust: Was nach 10, 15 und 20 Jahren übrig bleibt",
      tocLabel: "Kapazitätsverlust",
      bloecke: [
        {
          typ: "p",
          text: "**Rechnen Sie mit 1 bis 3 % Kapazitätsverlust pro Jahr** – 1 % bei modernen LFP-Systemen in kühlen Räumen, 2 bis 3 % nach den Feldmessungen an älteren Systemen. Die folgende Tabelle zeigt, welche Restkapazität daraus folgt:",
        },
        {
          typ: "tabelle",
          caption: "Restkapazität bei gleichmäßigem Kapazitätsverlust (vereinfacht linear)",
          kopf: ["Nach …", "1 % pro Jahr", "2 % pro Jahr", "3 % pro Jahr"],
          zeilen: [5, 10, 15, 20].map((j) => [`${j} Jahren`, pct(1 - 0.01 * j), pct(1 - 0.02 * j), pct(Math.max(0, 1 - 0.03 * j))]),
          hervorheben: 2,
          fussnote: "In der Praxis verläuft die Alterung nicht exakt linear: Anfangs sinkt die Kapazität oft etwas schneller, danach flacher. Viele Hersteller planen zudem eine Alterungsreserve ein, die zunächst nicht freigegeben ist.",
        },
        {
          typ: "p",
          text: `Wirtschaftlich wirkt sich der Verlust schwächer aus, als die Prozentzahlen vermuten lassen. Ein gealterter Speicher wird häufiger ganz voll und ganz leer – seine verbliebene Kapazität wird also intensiver genutzt. In unserer Simulation spart ein ${fmt(KAP)}-kWh-Speicher neu rund ${fmtEur(REST[0].ersparnis)} pro Jahr, mit 80 % Restkapazität noch ${fmtEur(REST[2].ersparnis)} und mit 60 % noch ${fmtEur(REST[4].ersparnis)}.`,
        },
        {
          typ: "tabelle",
          caption: `Überschuss eines ${KAP}-kWh-Speichers (${fmtEur(KOSTEN)}) nach Nutzungsdauer und Alterung`,
          kopf: ["Nutzungsdauer", "Überschuss bei 1 % Verlust/Jahr", "Überschuss bei 2 % Verlust/Jahr"],
          zeilen: SZENARIEN.map((s) => [s.label, fmtEur(s.v1), fmtEur(s.v2)]),
          hervorheben: 1,
          markierteZeile: 1,
          fussnote: `Haushalt mit 4.500 kWh, 10 kWp, Speicher gemeinsam mit der PV-Anlage installiert (${fmtEur(SPEICHER.preisProKwh)}/kWh). Ersparnis abzüglich entgangener Einspeisevergütung, Strompreissteigerung ${Math.round(SPEICHER.strompreisSteigerung * 100)} % pro Jahr, ohne Kapitalkosten und ohne Wechselrichtertausch. Orientierungswerte, keine Angebote.`,
        },
        {
          typ: "p",
          text: "Die Tabelle macht deutlich, warum die Lebensdauer über die Wirtschaftlichkeit entscheidet: Die ersten zehn Jahre bezahlen im Wesentlichen die Anschaffung, die Jahre danach bringen den Gewinn. Was ein Speicher heute kostet, lesen Sie im Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten).",
        },
      ],
    },
    {
      id: "garantie",
      titel: "Garantie verstehen: Jahre, Restkapazität und Energiedurchsatz",
      tocLabel: "Garantie",
      bloecke: [
        {
          typ: "p",
          text: "**Die meisten Hersteller geben 10 Jahre Garantie auf die Batterie – entscheidend ist aber, welche Restkapazität garantiert wird und welche Grenzen gelten.** Die HTW Berlin hat die Garantiebedingungen in der Stromspeicher-Inspektion 2026 erstmals verglichen: Zugesichert werden zwischen 60 und 85 % der Anfangskapazität. Einige Bedingungen enthalten zusätzlich eine Obergrenze für den Energiedurchsatz, bei deren Erreichen die Garantie vor Ablauf der Jahre endet.",
        },
        {
          typ: "tabelle",
          caption: "Worauf Sie in den Garantiebedingungen achten sollten",
          kopf: ["Punkt", "Was gut ist", "Worauf achten"],
          zeilen: [
            ["Laufzeit", "10 Jahre, teils optional verlängerbar", "Beginn ab Inbetriebnahme oder ab Kaufdatum?"],
            ["Restkapazität", "70–80 % nach 10 Jahren", "Bezug auf Nenn- oder nutzbare Kapazität?"],
            ["Energiedurchsatz", "keine oder hohe Grenze (MWh)", "Grenze kann bei Netzladung früh erreicht sein"],
            ["Bedingungen", "klar definierter Temperaturbereich", "Onlinepflicht fürs Monitoring, Registrierungsfristen"],
            ["Wechselrichter", "eigene Garantie, oft 10 Jahre", "separat prüfen, ist häufig kürzer als die Batteriegarantie"],
            ["Abwicklung", "Garantiegeber mit Sitz in der EU", "Wer tauscht aus, wer trägt Montage- und Transportkosten?"],
          ],
          minBreite: 640,
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Garantie ist nicht Gewährleistung",
          text: "Die gesetzliche Gewährleistung Ihres Installateurs beträgt mindestens zwei Jahre; je nach Vertrag und Einbausituation kann eine längere Frist gelten. Die Herstellergarantie ist eine freiwillige Zusage mit eigenen Bedingungen. Bewahren Sie Rechnung, Inbetriebnahmeprotokoll und Registrierungsbestätigung auf.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Partner-Hersteller, neutrale Beratung",
          text: "Ökovolt ist Partner von Sigenergy, Huawei, Fronius, Solis, meteocontrol und beim Speicher von BYD. Welche Garantiebedingungen im Einzelfall gelten, steht im jeweils aktuellen Garantiedokument des Herstellers – wir legen es Ihnen mit dem Angebot vor, damit Sie Systeme sachlich vergleichen können.",
        },
      ],
    },
    {
      id: "einfluss",
      titel: "Was die Lebensdauer verkürzt – und was sie verlängert",
      tocLabel: "Einflussfaktoren",
      bloecke: [
        {
          typ: "tabelle",
          caption: "Einflussfaktoren auf die Alterung von Heimspeichern",
          kopf: ["Faktor", "Wirkung", "Empfehlung"],
          zeilen: [
            ["Temperatur über 30 °C", "chemische Alterung beschleunigt deutlich", "nicht auf dem Dachboden oder in praller Sonne aufstellen"],
            ["Frost", "Laden unter 0 °C schädigt Zellen; BMS drosselt oder sperrt", "frostfreier Raum oder Gerät mit Heizung/Freigabe für außen"],
            ["Dauerhaft 100 % Ladestand", "fördert kalendarische Alterung, besonders bei NMC", "prognosebasiertes Laden aktivieren"],
            ["Tiefentladung", "Zellschäden möglich; BMS verhindert sie meist", "Mindestladestand nicht auf 0 % stellen"],
            ["Hohe Lade-/Entladeströme", "zusätzliche Erwärmung", "Leistung passend zur Kapazität wählen"],
            ["Längere Stillstände", "Selbstentladung bis zur Abschaltung", "bei Abwesenheit nicht leer stehen lassen"],
          ],
          minBreite: 620,
          fussnote: "Optimal sind etwa 15 bis 25 °C. Genaue Grenzwerte stehen im Datenblatt Ihres Speichers.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Kühler, trockener, frostfreier Aufstellort** – ideal sind Keller oder Hauswirtschaftsraum.",
            "**Prognosebasiertes Laden einschalten:** Der Speicher wird dann erst am Nachmittag voll, statt stundenlang bei 100 % zu stehen. Das entlastet zugleich das Netz zur Mittagsspitze.",
            "**Monitoring regelmäßig ansehen:** Sinkt die nutzbare Kapazität auffällig schnell, frühzeitig reklamieren – solange die Garantie läuft.",
            "**Firmware-Updates zulassen:** Hersteller verbessern darüber Batteriemanagement und Ladestrategie.",
            "**Belüftungsabstände einhalten** und Lüftungsöffnungen frei halten.",
            "**Energiemanagement nutzen:** Ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) verteilt Überschüsse sinnvoll und vermeidet unnötige Zyklen.",
          ],
        },
      ],
    },
    {
      id: "ende",
      titel: "Was passiert am Ende der Lebensdauer?",
      tocLabel: "Tausch & Entsorgung",
      bloecke: [
        {
          typ: "p",
          text: "**Am Ende steht meist kein Totalausfall, sondern eine Abwägung:** Reicht die Restkapazität noch für den Abendverbrauch, kann der Speicher weiterlaufen. Sinkt sie deutlich, kommen drei Wege infrage:",
        },
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Batteriemodule tauschen oder ergänzen**, sofern der Hersteller kompatible Module noch liefert. Das ist nach 10 bis 15 Jahren nicht garantiert.",
            "**Kompletten Speicher ersetzen** – oft zusammen mit dem Hybridwechselrichter, dessen Lebensdauer ähnlich ist. Details im Ratgeber [Wechselrichter](/ratgeber/wechselrichter-photovoltaik).",
            "**Ohne Speicher weiterbetreiben** und den Eigenverbrauch mit anderen Mitteln hochhalten, etwa über [Lastverschiebung und Überschussnutzung](/ratgeber/eigenverbrauch-erhoehen).",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Rücknahme und Batteriepass",
          text: "Seit dem 7. Oktober 2025 gilt das Batterierecht-Durchführungsgesetz (BattDG). Hersteller von Industriebatterien – dazu zählen Heimspeicher – sind zur kostenlosen Rücknahme verpflichtet. Nach der EU-Batterieverordnung 2023/1542 wird zudem ab dem 18. Februar 2027 ein digitaler Batteriepass für Industriebatterien über 2 kWh Pflicht, der unter anderem Angaben zu Gesundheitszustand und erwarteter Lebensdauer enthält.",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie lange hält ein Stromspeicher für Photovoltaik?", a: "Moderne LFP-Speicher halten bei guter Aufstellung 15 bis 20 Jahre, die Verbraucherzentrale rechnet vorsichtig mit 10 bis 15 Jahren. Danach funktionieren sie meist weiter, speichern aber spürbar weniger." },
    { q: "Wie viele Ladezyklen hat ein Stromspeicher?", a: `LFP-Heimspeicher sind laut Datenblatt meist für 6.000 bis 10.000 Vollzyklen ausgelegt, NMC-Speicher für 3.000 bis 6.000. Im Einfamilienhaus fallen je nach Größe nur rund ${fmt(ZYKLEN[ZYKLEN.length - 1].zyklen)} bis ${fmt(ZYKLEN[0].zyklen)} Vollzyklen pro Jahr an.` },
    { q: "Wie viel Kapazität verliert ein Stromspeicher pro Jahr?", a: "Feldmessungen der RWTH Aachen an Speichern der ersten Generation ergaben 2 bis 3 Prozentpunkte pro Jahr. Moderne LFP-Systeme in kühlen Räumen liegen häufig darunter, etwa bei 1 bis 2 %." },
    { q: "Was ist besser: LFP oder NMC?", a: "Für Heimspeicher ist LFP heute Standard: höhere Zyklenfestigkeit, bessere thermische Stabilität und unempfindlicher gegenüber hohem Ladestand. NMC ist kompakter, dieser Vorteil spielt im Haus aber kaum eine Rolle." },
    { q: "Welche Garantie gibt es auf Stromspeicher?", a: "Üblich sind 10 Jahre auf die Batterie mit einer zugesicherten Restkapazität zwischen 60 und 85 %. Achten Sie auf Durchsatzgrenzen, den Bezug der Prozentangabe und die separate Garantie des Wechselrichters." },
    { q: "Kann ein Stromspeicher in der Garage stehen?", a: "Nur, wenn sie frostfrei und im Sommer nicht zu heiß ist oder das Gerät ausdrücklich dafür freigegeben ist. Ideal sind 15 bis 25 °C. Unter 0 °C drosseln oder sperren viele Speicher das Laden." },
    { q: "Lohnt sich ein Stromspeicher, wenn er nur 15 Jahre hält?", a: `In unserer Beispielrechnung ja: Ein ${fmt(KAP)}-kWh-Speicher erwirtschaftet über 15 Jahre bei 2 % Kapazitätsverlust pro Jahr einen Überschuss von rund ${fmtEur(SZENARIEN[1].v2)}. Entscheidend sind Anschaffungspreis und ein passend kleiner Speicher.` },
  ],

  passend: [
    { href: "/ratgeber/stromspeicher-groesse", titel: "Stromspeicher-Größe berechnen", text: "Faustregeln und Simulation für Ihren Haushalt." },
    { href: "/ratgeber/stromspeicher-kosten", titel: "Stromspeicher Kosten 2026", text: "Preise je kWh und Wirtschaftlichkeit." },
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Autarkie, Zyklen und Amortisation berechnen." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher von Ökovolt", text: "Planung, Montage und Anmeldung aus einer Hand." },
  ],

  quellen: [
    { titel: "Figgener et al. (RWTH Aachen) – Multi-year field measurements of home storage systems, Nature Energy 2024", url: "https://www.nature.com/articles/s41560-024-01620-9", stand: "09/2026" },
    { titel: "pv magazine – Die meisten Photovoltaik-Heimspeicher erfüllen die Garantieansprüche", url: "https://www.pv-magazine.de/2024/09/18/forschung-die-meisten-photovoltaik-heimspeicher-erfuellen-die-garantieansprueche/", stand: "09/2026" },
    { titel: "HTW Berlin – Stromspeicher-Inspektion 2026", url: "https://solar.htw-berlin.de/studien/stromspeicher-inspektion-2026/", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Lohnen sich Batteriespeicher für Photovoltaikanlagen?", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/lohnen-sich-batteriespeicher-fuer-photovoltaikanlagen-24589", stand: "09/2026" },
    { titel: "Batterierecht-Durchführungsgesetz (BattDG)", url: "https://www.gesetze-im-internet.de/battdg/BJNR0E90B0025.html", stand: "09/2026" },
    { titel: "BMUKN – Europäische Batterieverordnung (EU) 2023/1542", url: "https://www.bundesumweltministerium.de/themen/kreislaufwirtschaft/abfallarten-und-abfallstroeme/altbatterien/europaeische-batterieverordnung-eu-2023/1542", stand: "09/2026" },
  ],

  seitenCta: { titel: "Wie viel Speicher lohnt sich?", text: "Autarkie, Zyklen und Amortisation mit Ihren Werten.", href: "/rechner/stromspeicher", label: "Speicher berechnen" },
  cta: {
    title: "Ein Speicher, der zu Ihrem Haus passt – und lange hält.",
    text: "Wir planen Größe, Aufstellort und Ladestrategie so, dass Ihr Speicher möglichst viele Jahre wirtschaftlich arbeitet.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Speicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
