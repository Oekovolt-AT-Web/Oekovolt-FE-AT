// Ratgeber: Heizstab mit Photovoltaik
// Energiepreise aus @/lib/rechner/annahmen und @/data/solarrechner,
// Vergütung aus @/data/einspeiseverguetung.

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { WAERMEPUMPE as W } from "@/lib/rechner/annahmen";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const eur10 = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const komma = (n, s = 1) => n.toFixed(s).replace(".", ",");

const EINSP = VERGUETUNG.saetze[0].teileinspeisung; // ct/kWh
const STROM = ANNAHMEN.strompreis * 100; // ct/kWh
const GAS = W.heizungen.gas;
const OEL = W.heizungen.oel;
const JAZ_WW = 2.6; // Warmwasserbereitung mit Luft-Wasser-Wärmepumpe (co2online-Beispiel)
const JAZ_BWWP = 3; // Brauchwasser-Wärmepumpe, konservativ

// Kosten je kWh Wärme, die der Heizstab ersetzt (ct)
const waermeGas = GAS.preisStandard / GAS.nutzungsgrad;
const waermeOel = OEL.preisStandard / OEL.kwhJeLiter / OEL.nutzungsgrad;
const waermeStrom = STROM;
const waermeWp = W.wpTarifCt / JAZ_WW;

// Beispiel: 4 Personen, 45 l je Person und Tag, 10 → 60 °C
const LITER = 4 * 45;
const KWH_TAG = (LITER * 50 * 1.163) / 1000;
const KWH_JAHR = KWH_TAG * 365;
const SOLAR_WAERME = 2000; // kWh/Jahr per Heizstab (vorsichtig, ca. halber Bedarf)

const ersparnis = (waermeCt) => (SOLAR_WAERME * (waermeCt - EINSP)) / 100;

const artikel = {
  slug: "heizstab-photovoltaik",
  title: "Heizstab mit Photovoltaik: Warmwasser aus Solarüberschuss",
  seoTitle: "Heizstab Photovoltaik: Lohnt sich das? | Ökovolt",
  kurzTitel: "Heizstab mit Photovoltaik",
  description:
    "Heizstab Photovoltaik: Wann sich Warmwasser aus PV-Überschuss lohnt, Heizstab oder Brauchwasser-Wärmepumpe, Regelung, Legionellen und Rechenbeispiele 2026.",
  excerpt:
    "Ein Heizstab macht aus überschüssigem Solarstrom warmes Wasser. Wann das wirtschaftlich ist, warum er neben einer Wärmepumpe selten Sinn ergibt und was bei Regelung und Hygiene wichtig ist.",
  hauptKeyword: "heizstab photovoltaik",
  keywords: [
    "Heizstab Photovoltaik",
    "PV-Heizstab Warmwasser",
    "Heizstab mit PV-Überschuss",
    "Heizstab oder Brauchwasserwärmepumpe",
    "Heizstab Steuerung Photovoltaik",
    "Heizstab Legionellen",
    "Lohnt sich ein Heizstab",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Wärmepumpe & E-Mobilität",
  bild: "/Images/Ratgeber/heizstab-photovoltaik.jpg",
  bildAlt: "Fronius Ohmpilot an der Wand eines Heizungsraums neben einem Warmwasserspeicher, davor ein Mann mit Tablet",
  badge: { wert: `${komma(EINSP, 2)} ct`, text: "ist eine eingespeiste kWh wert – im Heizstab ersetzt sie Gas, Öl oder Strom" },

  kurzFazit: [
    "**Ein Heizstab mit Photovoltaik lohnt sich vor allem, wenn Warmwasser bisher elektrisch bereitet wird und im Sommer viel Überschuss anfällt.** Bei Gas oder Öl ist der Vorteil kleiner. Der Heizstab wandelt Solarstrom 1:1 in Wärme um.",
    `Jede Kilowattstunde im Heizstab ersetzt bei Gas rund ${komma(waermeGas)} ct, bei Strom-Boilern ${komma(waermeStrom)} ct – eingespeist brächte sie nur ${ct(EINSP)} ct.`,
    "**Mit Wärmepumpe ist ein Heizstab meist die schlechtere Wahl:** Die Wärmepumpe macht aus derselben Kilowattstunde zwei bis vier Kilowattstunden Wärme. Besser ist hier eine PV-geführte Steuerung über SG Ready.",
    "Eine **Brauchwasser-Wärmepumpe** nutzt Solarstrom etwa dreimal effizienter, kostet aber mehr und kühlt den Aufstellraum.",
    "Für die Hygiene empfiehlt das DVGW-Regelwerk 60 °C am Speicheraustritt. Ein Heizstab kann die regelmäßige Aufheizung übernehmen, wenn die Sonne scheint.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Lohnt sich ein Heizstab mit Photovoltaik?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Heizstab lohnt sich, wenn er Solarstrom nutzt, der sonst für ${ct(EINSP)} ct eingespeist würde, und dafür teurere Energie für Warmwasser ersetzt.** Er ist günstig in der Anschaffung, einfach nachzurüsten und erhöht den [Eigenverbrauch](/wissen/lexikon#eigenverbrauch), weil er Überschüsse stufenlos aufnehmen kann. Wie groß der Vorteil ausfällt, hängt fast nur davon ab, womit Sie heute Wasser erwärmen.`,
        },
        {
          typ: "tabelle",
          caption: `Vorteil je Kilowattstunde Solarstrom im Heizstab nach bisheriger Warmwasserbereitung, Stand September 2026`,
          kopf: ["Bisherige Warmwasserbereitung", "Kosten je kWh Wärme", "abzüglich Einspeisevergütung", "Vorteil je kWh"],
          zeilen: [
            [`Elektroboiler / Durchlauferhitzer (${komma(STROM)} ct/kWh)`, `${komma(waermeStrom)} ct`, `${ct(EINSP)} ct`, `**${komma(waermeStrom - EINSP)} ct**`],
            [`Gas-Brennwertkessel (${komma(GAS.preisStandard)} ct/kWh, ${Math.round(GAS.nutzungsgrad * 100)} %)`, `${komma(waermeGas)} ct`, `${ct(EINSP)} ct`, `${komma(waermeGas - EINSP)} ct`],
            [`Ölheizung (${OEL.preisStandard} €/100 l, ${Math.round(OEL.nutzungsgrad * 100)} %)`, `${komma(waermeOel)} ct`, `${ct(EINSP)} ct`, `${komma(waermeOel - EINSP)} ct`],
            [`Wärmepumpe (${W.wpTarifCt} ct/kWh, JAZ ${komma(JAZ_WW)} für Warmwasser)`, `${komma(waermeWp)} ct`, `${ct(EINSP)} ct`, `${komma(waermeWp - EINSP)} ct`],
          ],
          hervorheben: 3,
          markierteZeile: 0,
          minBreite: 640,
          fussnote: "Im Sommer arbeiten Gas- und Ölkessel für reines Warmwasser oft schlechter als angegeben – der Vorteil des Heizstabs ist dann eher höher. Bei der Wärmepumpe ist er rechnerisch klein, und die Wärmepumpe könnte denselben Solarstrom deutlich effizienter nutzen.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Negative Strompreise verändern die Rechnung",
          text: "Für neue Anlagen seit dem [Solarspitzengesetz](/ratgeber/solarspitzengesetz) (Februar 2025) gibt es in Stunden mit [negativen Strompreisen](/ratgeber/negative-strompreise) keine Einspeisevergütung; die Stunden werden am Ende der Förderdauer angehängt. Ohne Smart Meter ist die Einspeisung zudem auf 60 % der Modulleistung begrenzt. In solchen Zeiten ist selbst genutzter Strom sofort wertvoller – ein Heizstab ist ein einfacher Abnehmer.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Rechenbeispiel: Was spart ein PV-Heizstab im Jahr?",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Vier-Personen-Haushalt braucht für Warmwasser rechnerisch rund ${(Math.round(KWH_JAHR / 100) * 100).toLocaleString("de-DE")} kWh Wärme im Jahr – ein Heizstab kann davon realistisch etwa die Hälfte mit Solarüberschuss decken.** Grundlage: ${LITER} Liter am Tag (45 Liter je Person), von 10 auf 60 °C erwärmt, das sind etwa ${komma(KWH_TAG)} kWh täglich plus Speicherverluste. Von April bis September reicht der Überschuss einer typischen [PV-Anlage](/produkte/photovoltaikanlage) oft an den meisten Tagen, im Winter kaum.`,
        },
        {
          typ: "tabelle",
          caption: `Jährliche Ersparnis bei ${SOLAR_WAERME.toLocaleString("de-DE")} kWh Solarwärme aus dem Heizstab`,
          kopf: ["Bisher", "Ersparnis pro Jahr", "Heizstab-Set mit Regelung und Montage", "Einfache Amortisation"],
          zeilen: [
            ["Elektroboiler", `**${eur10(ersparnis(waermeStrom))}**`, "850–2.300 €", `${Math.max(1, Math.round(850 / ersparnis(waermeStrom)))}–${Math.round(2300 / ersparnis(waermeStrom))} Jahre`],
            ["Gasheizung", eur10(ersparnis(waermeGas)), "850–2.300 €", `${Math.round(850 / ersparnis(waermeGas))}–${Math.round(2300 / ersparnis(waermeGas))} Jahre`],
            ["Ölheizung", eur10(ersparnis(waermeOel)), "850–2.300 €", `${Math.round(850 / ersparnis(waermeOel))}–${Math.round(2300 / ersparnis(waermeOel))} Jahre`],
          ],
          hervorheben: 1,
          markierteZeile: 0,
          minBreite: 620,
          fussnote: "Kostenspanne laut Marktübersichten (einfacher Heizstab 150–400 €, stufenlos geregelte Geräte 650–850 €, Montage 100–300 €, komplette Nachrüstung 850–2.300 €). Ohne negative Preisstunden und Wartung. Orientierungswerte.",
        },
        {
          typ: "p",
          text: "Die Zahlen zeigen: Mit Elektroboiler oder Durchlauferhitzer ist der Heizstab eine der schnellsten Investitionen rund um die PV-Anlage. Bei Gas und Öl ist die reine Brennstoffersparnis überschaubar. Wirtschaftlich wird es hier vor allem mit einem günstigen Set und wenn der Kessel im Sommer ganz ausbleiben kann – das spart Brennerstarts und Bereitschaftsverluste, die in der einfachen Rechnung fehlen. Wer ohnehin einen Heizungstausch plant, sollte das Geld eher in die neue Heizung stecken.",
        },
        { typ: "tool", href: "/solarrechner", titel: "Wie viel Überschuss hat Ihre Anlage?", text: "Ertrag, Eigenverbrauch und Einspeisung Ihrer PV-Anlage berechnen – die Basis für jede Heizstab-Rechnung.", label: "Zum Solarrechner" },
      ],
    },
    {
      id: "vergleich",
      titel: "Heizstab oder Brauchwasser-Wärmepumpe?",
      tocLabel: "Heizstab vs. Brauchwasser-WP",
      bloecke: [
        {
          typ: "p",
          text: `**Eine Brauchwasser-Wärmepumpe erzeugt aus einer Kilowattstunde Strom rund drei Kilowattstunden Wärme, ein Heizstab nur eine.** Sie ist damit auch an trüben Tagen und im Winter sparsam. Dafür kostet sie mehr, braucht Platz und entzieht dem Aufstellraum Wärme. Ein Heizstab dagegen kann auch große Überschüsse von mehreren Kilowatt schnell aufnehmen.`,
        },
        {
          typ: "tabelle",
          caption: "Heizstab und Brauchwasser-Wärmepumpe im Vergleich",
          kopf: ["Kriterium", "PV-Heizstab mit Regler", "Brauchwasser-Wärmepumpe"],
          zeilen: [
            ["Wärme je kWh Strom", "1 kWh", `ca. ${JAZ_BWWP} kWh`],
            ["Anschaffung inkl. Montage", "ca. 850–2.300 €", "ca. 3.000–5.000 €"],
            ["Aufnahme von Überschuss", "stufenlos, oft bis 3 oder 9 kW", "meist feste, kleine Leistung (einige hundert Watt)"],
            ["Winterbetrieb", "kaum Solarstrom, Netzstrom teuer", "effizient auch mit Netzstrom"],
            ["Platz & Umgebung", "im vorhandenen Speicher", "eigener Aufstellraum, kühlt und entfeuchtet ihn"],
            ["Geräusch", "lautlos", "hörbar (Ventilator und Verdichter)"],
            ["Verschleiß", "Verkalkung bei hartem Wasser", "Wartung von Verdampfer und Filter"],
            [`Vorteil je kWh Solarstrom ggü. Gas`, `${komma(waermeGas - EINSP)} ct`, `${komma(JAZ_BWWP * waermeGas - EINSP)} ct`],
          ],
          hervorheben: 2,
          minBreite: 620,
          fussnote: "Kosten- und Leistungsangaben als Spannen aus Marktübersichten und Herstellerangaben; das konkrete Gerät kann abweichen.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Heizstab passt, wenn …", text: "… ein Warmwasserspeicher vorhanden ist, im Sommer viel Überschuss anfällt, das Budget klein ist und im Winter eine andere Heizung das Wasser erwärmt." },
            { titel: "Brauchwasser-WP passt, wenn …", text: "… ganzjährig viel Warmwasser gebraucht wird, ein kühler Kellerraum zur Verfügung steht oder der Warmwasserbedarf bisher elektrisch gedeckt wurde." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Heizstab und Wärmepumpe: selten eine gute Kombination",
          text: `Wer bereits mit Wärmepumpe heizt, sollte Solarüberschuss zuerst der Wärmepumpe geben – etwa über SG Ready, EEBus oder ein Energiemanagement. Der eingebaute Heizstab ist dort für Frostreserve und gelegentliche Hygieneschaltungen gedacht, nicht als Solarverwerter. Mehr dazu im Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).`,
        },
      ],
    },
    {
      id: "regelung",
      titel: "Regelung: So kommt nur Überschuss in den Heizstab",
      tocLabel: "Regelung & Technik",
      bloecke: [
        {
          typ: "p",
          text: "**Damit der Heizstab keinen Netzstrom zieht, braucht er eine Regelung, die den Überschuss am Hausanschluss misst und die Leistung anpasst.** Es gibt drei gängige Varianten:",
        },
        {
          typ: "tabelle",
          caption: "Regelungsarten für PV-Heizstäbe",
          kopf: ["Variante", "Funktionsweise", "Vorteil", "Nachteil"],
          zeilen: [
            ["Stufenschaltung (Relais)", "Schaltet feste Stufen, z. B. 1, 2 und 3 kW", "Günstig, einfach", "Nutzt kleine oder schwankende Überschüsse schlecht, zieht teils Netzstrom"],
            ["Stufenloser Regler (AC)", "Leistung wird z. B. per Pulsweitenmodulation kontinuierlich angepasst", "Nutzt auch wenige hundert Watt, kein Netzbezug", "Teurer, braucht Zähler oder Wechselrichter-Anbindung"],
            ["DC-Heizstab", "Eigene Module direkt am Heizstab, ohne Wechselrichter und Netz", "Keine Netzanmeldung, einfaches Prinzip", "Module fehlen der Hausversorgung, geringe Flexibilität"],
          ],
          minBreite: 680,
        },
        {
          typ: "p",
          text: "Stufenlose Regler gibt es als eigenständige Geräte oder integriert in Energiemanagementsysteme. Ein Beispiel ist der Fronius Ohmpilot, der laut Hersteller Heizstäbe stufenlos von 0 bis 3 bzw. 9 kW ansteuert. Ökovolt ist Partner von Fronius, Sigenergy, Huawei, Solis und meteocontrol; welche Lösung passt, hängt vor allem von Ihrem Wechselrichter und dem vorhandenen Speicher ab. Wie ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) Heizstab, Speicher und Wallbox priorisiert, lesen Sie dort; weitere Hebel zeigt der Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen).",
        },
        { typ: "h3", text: "Wie viel Leistung sollte der Heizstab haben?" },
        {
          typ: "p",
          text: `Für einen Einfamilienhaus-Speicher mit 200 bis 300 Litern reichen meist 2 bis 3 kW. Um 200 Liter um 50 Kelvin zu erwärmen, sind rund 11,6 kWh nötig – ein 3-kW-Heizstab schafft das in knapp vier Sonnenstunden. Größere Heizstäbe mit 6 oder 9 kW lohnen sich nur bei großen Pufferspeichern und entsprechend hohen Überschüssen. Wichtiger als die Maximalleistung ist, dass der Regler auch kleine Überschüsse von wenigen hundert Watt nutzt.`,
        },
        { typ: "h3", text: "Worauf es beim Einbau ankommt" },
        {
          typ: "checkliste",
          punkte: [
            "**Passende Muffe am Speicher:** Heizstäbe werden meist über ein 1½-Zoll-Gewinde eingeschraubt. Die Einbaulänge muss zum Speicher passen, der Heizstab sollte im unteren bis mittleren Bereich sitzen.",
            "**Sicherheitstemperaturbegrenzer:** Pflicht, damit der Speicher bei einem Reglerfehler nicht überhitzt.",
            "**Elektroanschluss durch Fachbetrieb:** Leitungsquerschnitt, Absicherung und bei höheren Leistungen die Abstimmung mit dem Netzbetreiber gehören in die Hand einer Elektrofachkraft.",
            "**Verbrühungsschutz:** Wird der Speicher bei Überschuss auf 70 °C oder mehr geladen, gehört ein thermostatischer Mischer an den Warmwasseraustritt.",
            "**Kalk beachten:** Bei hartem Wasser verkalken Heizstäbe schneller. Temperaturen dauerhaft über 60 °C beschleunigen das.",
          ],
        },
      ],
    },
    {
      id: "legionellen",
      titel: "Legionellen: Welche Temperatur braucht der Speicher?",
      tocLabel: "Legionellen",
      bloecke: [
        {
          typ: "p",
          text: "**Das DVGW-Arbeitsblatt W 551 empfiehlt, Trinkwasser am Austritt des Speichers auf 60 °C zu halten.** Legionellen vermehren sich vor allem zwischen etwa 25 und 45 °C, ab rund 60 °C sterben sie schnell ab. Für private Ein- und Zweifamilienhäuser mit kleinen Anlagen (bis 400 Liter Speicher und höchstens 3 Liter Leitungsinhalt) ist das keine gesetzliche Pflicht, eine Legionellenprüfung nach Trinkwasserverordnung ist dort nicht vorgeschrieben. Die Empfehlung ist trotzdem sinnvoll.",
        },
        {
          typ: "liste",
          punkte: [
            "**Solar-Hygieneschaltung:** Der Heizstab kann den Speicher an sonnigen Tagen über 60 °C laden – ohne Zusatzkosten.",
            "**Winter absichern:** Reicht die Sonne nicht, übernimmt die Hauptheizung oder eine zeitgesteuerte Aufheizung. Eine Wärmepumpe kann 60 °C oft nur mit schlechter Effizienz erreichen.",
            "**Frischwasserstation als Alternative:** Wird Trinkwasser erst im Durchfluss erwärmt, steht kein warmes Trinkwasser lange im Speicher – das Legionellenrisiko sinkt deutlich.",
            "**Mehrfamilienhaus:** Bei Großanlagen gelten 60 °C am Speicheraustritt als Regel der Technik, bei Vermietung sind regelmäßige Legionellenprüfungen Pflicht. Dann ist eine Fachplanung nötig.",
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
            ["Überschuss prüfen", "Im Monitoring Ihrer PV-Anlage nachsehen, wie viel Strom im Sommer eingespeist oder abgeregelt wird. Unter etwa 1.000 kWh Überschuss im Jahr bleibt der Nutzen klein."],
            ["Bisherige Warmwasserbereitung klären", "Strom, Gas, Öl oder Wärmepumpe? Das entscheidet über den Vorteil je kWh – siehe Tabelle oben."],
            ["Speicher und Anschluss prüfen", "Freie Muffe, Speichergröße, Wasserhärte und Platz für den Regler festhalten."],
            ["Regelung auswählen", "Kompatibel zum Wechselrichter oder Energiemanager, stufenlos, mit Hygienefunktion."],
            ["Fachgerecht installieren lassen", "Einbau mit Sicherheitstemperaturbegrenzer und ggf. Mischer; Einstellungen für Priorität gegenüber Speicher und Wallbox festlegen."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Lohnt sich ein Heizstab für Photovoltaik-Überschuss?", a: `Vor allem dann, wenn Warmwasser bisher elektrisch erzeugt wird und im Sommer viel Überschuss anfällt; bei Gas oder Öl ist der Vorteil kleiner. Mit Elektroboiler spart ein Heizstab im Beispiel rund ${eur10(ersparnis(waermeStrom))} im Jahr, mit Gasheizung rund ${eur10(ersparnis(waermeGas))}.` },
    { q: "Was kostet ein PV-Heizstab mit Steuerung?", a: "Einfache Heizstäbe gibt es ab etwa 150 €, stufenlos geregelte Geräte kosten rund 650 bis 850 €. Mit Montage liegt eine komplette Nachrüstung meist zwischen 850 und 2.300 €." },
    { q: "Heizstab oder Brauchwasserwärmepumpe – was ist besser?", a: "Die Brauchwasser-Wärmepumpe ist etwa dreimal so effizient und auch im Winter sparsam, kostet aber mehr und braucht einen geeigneten Aufstellraum. Der Heizstab ist günstiger, einfacher und kann große Überschüsse schnell aufnehmen." },
    { q: "Ist ein Heizstab neben einer Wärmepumpe sinnvoll?", a: "Als Solarverwerter meist nicht: Die Wärmepumpe macht aus derselben Kilowattstunde mehrfach so viel Wärme. Sinnvoller ist eine PV-geführte Ansteuerung der Wärmepumpe über SG Ready oder ein Energiemanagement." },
    { q: "Wie viel Warmwasser kann ein Heizstab mit PV erzeugen?", a: `Ein Vier-Personen-Haushalt braucht rechnerisch rund ${(Math.round(KWH_JAHR / 100) * 100).toLocaleString("de-DE")} kWh Wärme für Warmwasser im Jahr. Von April bis September lässt sich ein großer Teil mit Überschuss decken, im Winter nur wenig – übers Jahr ist etwa die Hälfte ein realistischer Richtwert.` },
    { q: "Muss ein PV-Heizstab angemeldet werden?", a: "Ein Heizstab ist ein Verbraucher und gehört fachgerecht angeschlossen. Ob der Netzbetreiber informiert werden muss, hängt von Leistung und technischen Anschlussbedingungen ab – das klärt die Elektrofachkraft. Ein DC-Heizstab ohne Netzverbindung ist davon nicht betroffen." },
    { q: "Welche Temperatur sollte der Warmwasserspeicher wegen Legionellen haben?", a: "Das DVGW-Regelwerk empfiehlt 60 °C am Speicheraustritt. Im Einfamilienhaus ist das keine Pflicht, aber empfehlenswert. Ein PV-Heizstab kann die Aufheizung an sonnigen Tagen kostenlos übernehmen." },
  ],

  passend: [
    { href: "/ratgeber/eigenverbrauch-erhoehen", titel: "Eigenverbrauch erhöhen", text: "Zehn Maßnahmen mit Wirkung in Prozent." },
    { href: "/ratgeber/waermepumpe-mit-photovoltaik", titel: "Wärmepumpe mit Photovoltaik", text: "Solarstrom effizient für die Heizung nutzen." },
    { href: "/produkte/smartenergyhome", titel: "Smart Energy Home", text: "PV, Speicher und Verbraucher intelligent steuern." },
  ],

  quellen: [
    { titel: "DVGW – Trinkwasser-Installation und Arbeitsblatt W 551", url: "https://www.dvgw.de/themen/wasser/trinkwasser-installation", stand: "09/2026" },
    { titel: "Fronius – Ohmpilot zur Warmwasseraufbereitung mit PV", url: "https://www.fronius.com/de-de/germany/solarenergie/eigenheim/produkte-und-loesungen/waerme-mit-pv/ohmpilot-zur-warmwasseraufbereitung-mit-pv", stand: "09/2026" },
    { titel: "co2online – Wärmepumpe: Kosten, Funktion und Arbeitszahl", url: "https://www.co2online.de/modernisieren-und-bauen/waermepumpe/", stand: "07/2026" },
    { titel: "Grünes Haus – Warmwasser mit Photovoltaik und Heizstab (Kosten)", url: "https://gruenes.haus/warmwasser-photovoltaik-heizstab/", stand: "06/2026" },
    { titel: "§ 51 EEG – Verringerung des Zahlungsanspruchs bei negativen Preisen", url: "https://www.gesetze-im-internet.de/eeg_2014/__51.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Vergütungssätze", url: VERGUETUNG.quelle.url, stand: "09/2026" },
  ],

  seitenCta: { titel: "Wie viel Überschuss hat Ihr Dach?", text: "Ertrag und Eigenverbrauch Ihrer Anlage berechnen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Solarüberschuss sinnvoll nutzen.",
    text: "Wir prüfen, ob Heizstab, Brauchwasser-Wärmepumpe oder eine Steuerung Ihrer Wärmepumpe für Ihr Haus am meisten bringt – und bauen die passende Lösung ein.",
    primary: { label: "Beratung anfragen", href: "/kontakt" },
    secondary: { label: "Überschuss berechnen", href: "/solarrechner" },
  },
};

export default artikel;
