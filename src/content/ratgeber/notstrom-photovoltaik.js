// Ratgeber: Notstrom mit Photovoltaik
// Monatswerte (PV-Ertrag, Heizstrom) aus dem gemeinsamen Energiemodell der Rechner
// (src/lib/rechner/profile.js), Wärmepumpenstrom aus src/lib/rechner/annahmen.js.

import { PV_MONAT, HEIZ_MONAT, TAGE_MONAT } from "@/lib/rechner/profile";
import { SPEICHER, ALLGEMEIN, fmt } from "@/lib/rechner/annahmen";

const KWP = 10;
const pvTag = (m) => (KWP * ALLGEMEIN.ertragProKwp * PV_MONAT[m]) / TAGE_MONAT[m];
const wpTag = (m) => (SPEICHER.wpStromKwh * (0.82 * HEIZ_MONAT[m] + 0.18 / 12)) / TAGE_MONAT[m];
const PV_JAN = pvTag(0);
const PV_JUN = pvTag(5);
const PV_APR = pvTag(3);
const WP_JAN = wpTag(0);
const SPEICHER_KWH = 8;
const NUTZBAR = SPEICHER_KWH * SPEICHER.nutzbarAnteil;

const artikel = {
  slug: "notstrom-photovoltaik",
  title: "Notstrom mit Photovoltaik: Ersatzstrom, Inselbetrieb & Kosten",
  seoTitle: "Notstrom Photovoltaik: Ersatzstrom & Kosten 2026 | Ökovolt",
  kurzTitel: "Notstrom mit Photovoltaik",
  description:
    "Notstrom mit Photovoltaik: Warum PV-Anlagen bei Stromausfall abschalten, wie Notstrom, Ersatzstrom und Inselbetrieb funktionieren, was sie kosten und leisten.",
  excerpt:
    "Bei einem Stromausfall schaltet eine normale PV-Anlage ab – auch bei strahlender Sonne. Welche Lösung wirklich weiterversorgt, wie lange der Speicher reicht und worauf Sie bei Planung und Kosten achten sollten.",
  hauptKeyword: "notstrom photovoltaik",
  keywords: [
    "Notstrom Photovoltaik",
    "Ersatzstrom PV-Anlage",
    "PV-Anlage bei Stromausfall",
    "Notstromfähiger Speicher",
    "Inselbetrieb Photovoltaik",
    "Notstrom Wechselrichter",
    "Ersatzstrom Kosten",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/notstrom-photovoltaik.jpg",
  bildAlt: "Einfamilienhaus mit Photovoltaikanlage und Sigenergy-Stromspeicher SigenStor bei Gewitter in der Nacht",
  badge: { wert: "11,7 Min.", text: "durchschnittliche Stromausfalldauer je Kunde 2024 (BNetzA)" },

  kurzFazit: [
    "**Eine normale PV-Anlage liefert bei Stromausfall keinen Strom.** Der Wechselrichter muss sich aus Sicherheitsgründen vom Netz trennen – auch bei Sonnenschein.",
    "**Notstrom** versorgt einzelne Steckdosen oder Stromkreise, **Ersatzstrom** das Hausnetz über eine Umschalteinrichtung, die es vom öffentlichen Netz trennt. Echter **Inselbetrieb** ohne Netzanschluss ist für Einfamilienhäuser fast nie sinnvoll.",
    `Ein ${SPEICHER_KWH}-kWh-Speicher reicht für die Grundversorgung (Kühlschrank, Heizungspumpe, Licht, Router) oft ein bis zwei Tage. Eine Wärmepumpe braucht im Januar allein rund ${fmt(WP_JAN)} kWh am Tag.`,
    "Stromausfälle sind in Deutschland selten und kurz – 2024 im Schnitt 11,7 Minuten je Kunde. Notstrom ist daher eine **Versicherung für seltene, dann aber lange Ausfälle**, keine Renditefrage.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Funktioniert eine PV-Anlage bei Stromausfall?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Nein – eine netzgekoppelte PV-Anlage ohne Notstromfunktion schaltet bei einem Stromausfall innerhalb von Sekunden ab.** Das schreibt die Anwendungsregel [VDE-AR-N 4105](/wissen/lexikon#vde-ar-n-4105) vor: Der Wechselrichter überwacht das Netz und trennt sich, sobald Spannung oder Frequenz wegfallen. So wird verhindert, dass Solarstrom in eine vermeintlich spannungsfreie Leitung zurückfließt, an der Netzmonteure arbeiten.",
        },
        {
          typ: "p",
          text: "Damit Ihr Haus trotzdem Strom bekommt, braucht es drei Dinge: einen **Wechselrichter, der selbst ein Netz aufbauen kann** (netzbildend), meist einen **Batteriespeicher** als stabile Energiequelle und eine **Umschalteinrichtung**, die das Haus allpolig vom öffentlichen Netz trennt. Wie viel davon Sie brauchen, hängt davon ab, ob einzelne Geräte oder das ganze Haus weiterlaufen sollen.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Nicht jeder „notstromfähige“ Speicher versorgt das ganze Haus",
          text: "Die Begriffe werden im Markt uneinheitlich verwendet. Fragen Sie konkret nach: Welche Stromkreise werden versorgt? Wie viel Leistung je Phase? Schaltet das System automatisch um, und wie lange dauert das? Lädt die PV-Anlage den Speicher während des Ausfalls nach?",
        },
      ],
    },
    {
      id: "varianten",
      titel: "Notstrom, Ersatzstrom, Inselbetrieb: die Unterschiede",
      tocLabel: "Die drei Varianten",
      bloecke: [
        {
          typ: "p",
          text: "**Notstrom meint meist eine separate Steckdose, Ersatzstrom die Versorgung des Hausnetzes, Inselbetrieb eine Anlage ganz ohne Netzanschluss.** Eine Norm, die diese Begriffe für Heimspeicher einheitlich festlegt, gibt es nicht – die folgende Einteilung entspricht dem üblichen Sprachgebrauch. Mehr dazu im Lexikon unter [Notstrom](/wissen/lexikon#notstrom), [Ersatzstrom](/wissen/lexikon#ersatzstrom) und [Inselanlage](/wissen/lexikon#inselanlage).",
        },
        {
          typ: "tabelle",
          caption: "Notstrom-Varianten für PV-Anlagen im Vergleich (Stand September 2026)",
          kopf: ["", "Notstrom-Steckdose", "Ersatzstrom (Hausnetz)", "Inselanlage"],
          zeilen: [
            ["Was läuft weiter?", "einzelne Geräte an einer Steckdose oder einem Stromkreis", "ausgewählte Stromkreise oder das ganze Haus", "alles – es gibt kein Netz"],
            ["Umschaltung", "meist manuell (Stecker umstecken)", "automatisch oder per Handschalter", "entfällt"],
            ["Unterbrechung", "Sekunden bis Minuten", "je nach System von Millisekunden bis rund 90 Sekunden", "keine"],
            ["Phasen / Leistung", "meist 1-phasig, oft 2–3 kW", "1- oder 3-phasig, oft 3–10 kW", "nach Auslegung"],
            ["Speicher nötig?", "je nach System nein (nur bei Sonne) oder ja", "ja", "ja, groß dimensioniert"],
            ["PV lädt nach?", "systemabhängig", "bei geeigneten Systemen ja", "ja"],
            ["Mehrkosten (Orientierung)", "wenige hundert Euro", "rund 1.000 bis 3.500 €", "vielfach höher, plus Generator"],
            ["Sinnvoll für", "Grundversorgung: Kühlschrank, Router, Heizungspumpe", "Komfort und längere Ausfälle", "Gebäude ohne Netzanschluss"],
          ],
          hervorheben: 2,
          minBreite: 720,
          fussnote: "Mehrkosten gegenüber einer Anlage ohne Notstromfunktion, abhängig von Hersteller, Zählerschrank und Anzahl der versorgten Stromkreise. Orientierungswerte aus Marktübersichten, keine Angebote.",
        },
        { typ: "h3", text: "Notstrom-Steckdose: einfach und günstig" },
        {
          typ: "p",
          text: "Viele Hybridwechselrichter haben einen eigenen Notstromausgang. Fällt das Netz aus, liefert er an einer fest installierten Steckdose Strom – aus dem Speicher oder, bei manchen Systemen, direkt von den Modulen. Ein Beispiel ist der „PV Point“ von Fronius: bis zu 3 kW einphasig, auch ohne Batterie, allerdings nur, solange die Sonne scheint. Für Kühlschrank, Router und Handyladegerät reicht das; für die Heizung nur, wenn deren Stromversorgung an diese Steckdose angeschlossen werden kann.",
        },
        { typ: "h3", text: "Ersatzstrom: Das Hausnetz läuft weiter" },
        {
          typ: "p",
          text: "Beim Ersatzstrom trennt eine Umschalteinrichtung im Zählerschrank das Haus vom Netz, und der Wechselrichter versorgt anschließend das Hausnetz oder einen abgesicherten Teil davon. Je nach Hersteller geschieht das automatisch oder per Handschalter; die Unterbrechung reicht von wenigen Millisekunden bis zu rund 90 Sekunden. Kommt das Netz zurück, synchronisiert sich das System und schaltet zurück.",
        },
        { typ: "h3", text: "Inselanlage: nur ohne Netzanschluss sinnvoll" },
        {
          typ: "p",
          text: "Eine Inselanlage muss auch im Dezember über Tage ohne Sonne auskommen. Das erfordert einen sehr großen Speicher, eine überdimensionierte PV-Anlage und meist einen Generator. Für Häuser mit Netzanschluss bietet Ersatzstrom praktisch denselben Schutz zu einem Bruchteil der Kosten.",
        },
      ],
    },
    {
      id: "technik",
      titel: "Was technisch dazugehört",
      tocLabel: "Technik & Normen",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Netzbildender Wechselrichter oder Batteriewechselrichter:** Er muss Spannung und Frequenz selbst vorgeben können. Ein reiner PV-Wechselrichter kann das nicht.",
            "**Allpolige Netztrennung:** Die Umschalteinrichtung trennt Außenleiter und Neutralleiter vom öffentlichen Netz, damit keine Rückspeisung möglich ist.",
            "**Schutzkonzept im Inselbetrieb:** Nach der Trennung muss das Hausnetz ein eigenes, funktionierendes Erdungs- und Schutzkonzept haben – sonst lösen Fehlerstrom-Schutzschalter im Fehlerfall nicht zuverlässig aus.",
            "**Leistung je Phase:** Viele Systeme liefern im Ersatzstrombetrieb weniger Leistung als im Normalbetrieb und begrenzen die Schieflast zwischen den Phasen. Dreiphasige Verbraucher brauchen ein dreiphasiges Ersatzstromsystem.",
            "**Nachladen durch PV:** Bei DC-gekoppelten Hybridsystemen lädt die Anlage den Speicher im Ausfall meist direkt nach. Bei AC-gekoppelten Systemen muss der PV-Wechselrichter über eine Leistungsregelung eingebunden sein.",
            "**Schwarzstartfähigkeit:** Ist der Speicher leer und die Sonne geht auf, sollte das System selbstständig wieder anlaufen können. Nicht alle können das.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Nur vom Elektrofachbetrieb",
          text: "Umschalteinrichtungen greifen in den Zählerschrank ein. Planung und Installation gehören in die Hand eines eingetragenen Elektrofachbetriebs, der die VDE-AR-N 4105 und die Technischen Anschlussbedingungen (TAB) Ihres Netzbetreibers kennt. Ob und in welcher Form die Ersatzstromversorgung dem Netzbetreiber gemeldet werden muss, regeln die TAB des jeweiligen Netzgebiets. Improvisierte Lösungen – etwa ein Wechselrichter, der per Stecker ins Hausnetz „einspeist“ – sind lebensgefährlich.",
        },
      ],
    },
    {
      id: "reichweite",
      titel: "Wie lange reicht der Speicher bei Stromausfall?",
      tocLabel: "Reichweite des Speichers",
      bloecke: [
        {
          typ: "p",
          text: `**Mit ${SPEICHER_KWH} kWh Speicher lassen sich die wichtigsten Geräte ohne Sonne typischerweise ein bis zwei Tage betreiben – ein ganzes Haus mit Wärmepumpe im Winter dagegen nur Stunden.** Von ${SPEICHER_KWH} kWh Nennkapazität sind rund ${fmt(NUTZBAR, 1)} kWh nutzbar. Wie weit das reicht, zeigt der Tagesbedarf typischer Verbraucher:`,
        },
        {
          typ: "tabelle",
          caption: "Tagesbedarf wichtiger Verbraucher im Stromausfall (Richtwerte)",
          kopf: ["Verbraucher", "Leistung", "Energie pro Tag", "Hinweis"],
          zeilen: [
            ["Kühl-Gefrier-Kombination", "50–150 W (taktend)", "0,5–1 kWh", "Türen geschlossen halten"],
            ["Gas- oder Ölheizung (Pumpe, Regelung, Brenner)", "50–150 W", "1–3 kWh im Winter", "muss am Ersatzstromkreis hängen"],
            ["Router, Telefon, Laptop, Handys", "20–80 W", "0,3–1 kWh", "Kommunikation sichern"],
            ["LED-Beleuchtung", "30–100 W", "0,2–0,5 kWh", "nur benötigte Räume"],
            ["Kochen (Herd, Wasserkocher)", "1.500–3.000 W", "1–2 kWh", "kurz, aber hohe Leistung"],
            ["Wärmepumpe (Beispiel Januar)", "1.500–4.000 W", `rund ${fmt(WP_JAN)} kWh`, "Anlaufstrom und Phasen beachten"],
            ["Brunnen- oder Hebeanlage", "500–1.500 W", "je nach Nutzung", "bei Starkregen wichtig"],
          ],
          hervorheben: 2,
          minBreite: 660,
          fussnote: `Richtwerte, Gerätedaten prüfen. Wärmepumpe: ${fmt(SPEICHER.wpStromKwh)} kWh Jahresstrom, Monatsverteilung nach Heizgradtagen wie in unseren Rechnern.`,
        },
        {
          typ: "kennzahl",
          wert: "3–5 kWh",
          titel: "Grundversorgung pro Tag",
          text: `Kühlschrank, Heizungssteuerung, Licht, Kommunikation und etwas Kochen. Ein ${SPEICHER_KWH}-kWh-Speicher (rund ${fmt(NUTZBAR, 1)} kWh nutzbar) überbrückt damit ohne Sonne etwa ein bis zwei Tage.`,
        },
        { typ: "h3", text: "Die PV-Anlage verlängert die Reichweite – im Sommer deutlich mehr als im Winter" },
        {
          typ: "p",
          text: `Lädt die Anlage im Ausfall nach, ändert sich das Bild. Eine 10-kWp-Anlage in Süddeutschland erzeugt nach unserem Energiemodell im Januar im Mittel rund ${fmt(PV_JAN)} kWh am Tag, im April etwa ${fmt(PV_APR)} kWh und im Juni rund ${fmt(PV_JUN)} kWh. Im Sommer kann ein Haus mit Ersatzstrom damit tagelang nahezu normal weiterlaufen. Im Winter reicht es für die Grundversorgung – an trüben Tagen oft nicht einmal dafür. Welche Erträge realistisch sind, lesen Sie im Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).`,
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Reserve im Speicher einstellen",
          text: "Die meisten Systeme erlauben eine Notstromreserve, etwa 20 bis 30 % der Kapazität, die im Alltag nicht entladen wird. Das kostet etwas Eigenverbrauch, stellt aber sicher, dass bei einem nächtlichen Ausfall Strom da ist. Wie sich die Reserve auf die sinnvolle Speichergröße auswirkt, erklärt der Ratgeber [Stromspeicher-Größe](/ratgeber/stromspeicher-groesse).",
        },
        { typ: "tool", href: "/rechner/stromspeicher", titel: "Speichergröße mit Reserve durchrechnen", text: "Verbrauch, Anlage, Wärmepumpe und E-Auto eingeben – der Rechner zeigt Autarkie und wirtschaftliche Speichergröße.", label: "Zum Stromspeicher-Rechner" },
      ],
    },
    {
      id: "lohnt",
      titel: "Lohnt sich Notstrom? Eine ehrliche Einordnung",
      tocLabel: "Lohnt sich das?",
      bloecke: [
        {
          typ: "p",
          text: "**Wirtschaftlich rechnet sich eine Notstromfunktion nicht – sie ist eine Absicherung.** Die Bundesnetzagentur weist für 2024 eine durchschnittliche Unterbrechungsdauer von 11,7 Minuten je Letztverbraucher aus (erfasst werden Unterbrechungen über drei Minuten); das deutsche Netz gehört zu den zuverlässigsten in Europa. Der Durchschnitt verdeckt aber seltene lange Ereignisse: Nach dem Brandanschlag auf das Berliner Stromnetz im Januar 2026 waren rund 45.000 Haushalte und über 2.200 Betriebe mehrere Tage ohne Strom – bei Winterwetter und mit ausgefallenen Heizungen.",
        },
        {
          typ: "karten",
          items: [
            { titel: "Eher sinnvoll", text: "Häuser mit Wärmepumpe oder Brunnen, Hebeanlage im Keller, medizinischen Geräten, Homeoffice oder Tierhaltung; Lagen mit Freileitungen und häufigeren Störungen; Menschen, denen Versorgungssicherheit wichtig ist." },
            { titel: "Eher verzichtbar", text: "Wohnungen und Häuser in städtischen Kabelnetzen, wenn Kühlschrank und Heizung einige Stunden Ausfall verkraften – hier genügt oft eine einfache Notstrom-Steckdose oder eine mobile Powerstation." },
          ],
        },
        {
          typ: "p",
          text: "Günstig ist es vor allem, **Notstrom gleich bei der Planung mitzudenken**. Ein späteres Nachrüsten kann einen anderen Wechselrichter, Arbeiten am [Zählerschrank](/wissen/lexikon#zaehlerschrank) und neue Stromkreise erfordern. Wer ohnehin einen [Stromspeicher](/produkte/stromspeicher) plant, sollte ein ersatzstromfähiges System wählen, auch wenn die Umschalteinrichtung erst später dazukommt. Was der Speicher selbst kostet, zeigt der Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten).",
        },
      ],
    },
    {
      id: "planung",
      titel: "So planen Sie Ihre Notstromversorgung",
      tocLabel: "Planung",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Ziel festlegen", "Welche Geräte müssen im Ausfall laufen – nur Kühlschrank und Router, die Heizung oder das ganze Haus?"],
            ["Leistung und Energie abschätzen", "Gleichzeitige Leistung (kW) und Tagesbedarf (kWh) der wichtigen Verbraucher zusammenstellen. Anlaufströme von Pumpen und Wärmepumpen berücksichtigen."],
            ["Stromkreise trennen", "Wichtige Verbraucher auf einen eigenen, abgesicherten Ersatzstromkreis legen. Das hält den Speicher länger voll."],
            ["System auswählen", "Ersatzstromleistung je Phase, Umschaltzeit, Nachladen durch PV und Schwarzstart vergleichen."],
            ["Installieren und testen", "Umschalteinrichtung vom Fachbetrieb einbauen lassen und den Ernstfall einmal gemeinsam durchspielen."],
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Herstellerneutral beraten",
          text: "Ökovolt ist Partner von Sigenergy, Fronius, Huawei, Solis, meteocontrol und BYD. Die Notstromkonzepte der Hersteller unterscheiden sich deutlich in Umschaltzeit, Leistung und Phasenzahl. Wir wählen die Lösung nach Ihrem Bedarf aus – vom Notstromausgang bis zur automatischen Ersatzstromversorgung des ganzen Hauses. Mehr zur [Photovoltaikanlage aus einer Hand](/produkte/photovoltaikanlage).",
        },
      ],
    },
  ],

  faq: [
    { q: "Hat meine PV-Anlage bei Stromausfall Strom?", a: "Nur, wenn sie ausdrücklich eine Notstrom- oder Ersatzstromfunktion hat. Normale netzgekoppelte Wechselrichter schalten bei Netzausfall nach VDE-AR-N 4105 ab, auch bei Sonnenschein." },
    { q: "Was ist der Unterschied zwischen Notstrom und Ersatzstrom?", a: "Notstrom versorgt meist einzelne Geräte über eine separate Steckdose, oft mit manueller Umschaltung. Ersatzstrom versorgt das Hausnetz oder ausgewählte Stromkreise über eine Umschalteinrichtung, die das Haus allpolig vom öffentlichen Netz trennt – häufig automatisch." },
    { q: "Was kostet Notstrom für die PV-Anlage?", a: "Eine Notstrom-Steckdose kostet meist nur wenige hundert Euro zusätzlich. Eine Ersatzstromversorgung mit Umschalteinrichtung liegt als Orientierung bei rund 1.000 bis 3.500 € Mehrkosten, abhängig von System, Zählerschrank und Anzahl der versorgten Stromkreise." },
    { q: "Funktioniert Notstrom ohne Batteriespeicher?", a: "Eingeschränkt: Einige Wechselrichter liefern über einen Notstromausgang auch ohne Batterie Strom, aber nur solange die Sonne scheint und mit schwankender Leistung. Für eine verlässliche Versorgung, auch nachts, ist ein Speicher nötig." },
    { q: "Kann die Wärmepumpe mit Notstrom laufen?", a: `Grundsätzlich ja, wenn das Ersatzstromsystem dreiphasig ist und genügend Leistung für den Anlauf liefert. Der Energiebedarf ist im Winter aber hoch – im Beispiel rund ${fmt(WP_JAN)} kWh pro Tag im Januar. Ein Heimspeicher überbrückt damit eher Stunden als Tage.` },
    { q: "Wie lange hält ein Stromspeicher bei Stromausfall?", a: `Das hängt vom Verbrauch ab. Für eine Grundversorgung mit 3 bis 5 kWh pro Tag reicht ein ${SPEICHER_KWH}-kWh-Speicher ohne Sonne etwa ein bis zwei Tage. Lädt die PV-Anlage nach, verlängert sich die Zeit – im Sommer deutlich.` },
    { q: "Kann man Notstrom nachrüsten?", a: "Oft ja, aber nicht immer günstig. Ist der vorhandene Wechselrichter nicht netzbildend, muss er ergänzt oder getauscht werden. Zusätzlich sind Arbeiten am Zählerschrank nötig. Bei Neuanlagen lohnt es sich, ein ersatzstromfähiges System gleich mitzuplanen." },
  ],

  passend: [
    { href: "/ratgeber/stromspeicher-groesse", titel: "Stromspeicher-Größe berechnen", text: "Faustregeln, Simulation und Notstromreserve." },
    { href: "/produkte/stromspeicher", titel: "Stromspeicher von Ökovolt", text: "Speicher mit Ersatzstromfunktion planen lassen." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Wie ein HEMS Speicher, Wärmepumpe und Wallbox steuert." },
  ],

  quellen: [
    { titel: "Bundesnetzagentur – Versorgungsunterbrechungen Strom 2024 (Pressemitteilung vom 09.10.2025)", url: "https://www.bundesnetzagentur.de/1075952", stand: "09/2026" },
    { titel: "Fronius – Notstromfunktion: PV Point und Full Backup", url: "https://www.fronius.com/de-de/germany/solarenergie/installateure-partner/produkte-loesungen/features/notstromfunktion", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Lohnen sich Batteriespeicher für Photovoltaikanlagen?", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/lohnen-sich-batteriespeicher-fuer-photovoltaikanlagen-24589", stand: "09/2026" },
    { titel: "HTW Berlin – Empfehlungen zur Auslegung von Solarstromspeichern (Ersatzstrom und Kapazitätsreserve)", url: "https://solar.htw-berlin.de/publikationen/auslegung-von-solarstromspeichern/", stand: "09/2026" },
    { titel: "VDE Verlag – VDE-AR-N 4105: Erzeugungsanlagen am Niederspannungsnetz", url: "https://www.vde-verlag.de/p/normen/vde-ar-n-4105-vde-ar-n-4105-anwendungsregel-2018-11/0100492-DE-PR", stand: "09/2026" },
    { titel: "Wikipedia – Brandanschlag auf das Berliner Stromnetz 2026", url: "https://de.wikipedia.org/wiki/Brandanschlag_auf_das_Berliner_Stromnetz_2026", stand: "09/2026" },
  ],

  seitenCta: { titel: "Speicher mit Ersatzstrom?", text: "Größe, Reserve und Wirtschaftlichkeit berechnen.", href: "/rechner/stromspeicher", label: "Speicher berechnen" },
  cta: {
    title: "Versorgt, wenn das Netz ausfällt.",
    text: "Wir planen Ihre Notstrom- oder Ersatzstromlösung passend zu Haus, Heizung und Speicher – und installieren die Umschalteinrichtung normgerecht.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },
};

export default artikel;
