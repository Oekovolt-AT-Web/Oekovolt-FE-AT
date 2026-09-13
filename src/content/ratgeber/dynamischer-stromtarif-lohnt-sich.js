// Ratgeber: Dynamischer Stromtarif – wie er funktioniert, für wen er sich
// lohnt, Rechenbeispiele mit echten Börsenpreisen.
//
// Datengrundlage der Beispiele: Day-Ahead-Preise DE-LU von 01.09.2025 bis
// 31.08.2026 (Energy-Charts / Bundesnetzagentur SMARD, CC BY 4.0), gerechnet
// mit dem Modell des Tarif-Rechners (src/lib/rechner/dynamischerTarif.js,
// Profile PROFILE, Verschiebbarkeit 0 bzw. 100 %) und TARIF_ANNAHMEN aus
// src/lib/energy.js (Aufschlag 19,5 ct netto, 19 % USt, Festpreis 36 ct).
// Ändern sich diese Annahmen, die Jahreswerte unten neu berechnen.

import { TARIF_ANNAHMEN } from "@/lib/energy";

const T = TARIF_ANNAHMEN;
const brutto = (eurMwh) => (eurMwh / 10 + T.aufschlagCt) * (1 + T.mwst);
const ctFmt = (n) => (Math.round(n * 10) / 10).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

// Auswertung Energy-Charts 09/2025–08/2026 (€/MWh)
const BOERSE = {
  mittel: 99.0,
  negativStunden: 537,
  tagesSpanne: 158,
  guenstigsteStunde: { h: "13–14 Uhr", wert: 47 },
  teuersteStunde: { h: "19–20 Uhr", wert: 151 },
  nachts: { h: "3–4 Uhr", wert: 93 },
  minimum: { wann: "1. Mai 2026, mittags", wert: -500 },
  maximum: { wann: "24. Juni 2026, abends", wert: 747 },
};

// Jahreskosten in € (Modell Tarif-Rechner, Festpreis T.festpreisCt)
const FALL = [
  { id: "haushalt", name: "Haushalt ohne große Verbraucher", kwh: 4000, fest: 1440, ohne: 1416, mit: 1369 },
  { id: "eauto", name: "Haushalt + E-Auto (15.000 km)", kwh: 6700, fest: 2412, ohne: 2418, mit: 2104 },
  { id: "wp", name: "Haushalt + Wärmepumpe (4.000 kWh)", kwh: 8000, fest: 2880, ohne: 2813, mit: 2647 },
  { id: "beide", name: "Haushalt + E-Auto + Wärmepumpe", kwh: 10700, fest: 3852, ohne: 3815, mit: 3382 },
];
// Effektiver Preis der Wärmepumpe mit voller Verschiebung je Monat (ct/kWh)
const WP_MONAT = { jan: 35.2, apr: 28.8 };

const artikel = {
  slug: "dynamischer-stromtarif-lohnt-sich",
  title: "Dynamischer Stromtarif: Lohnt er sich? Rechenbeispiele 2026",
  seoTitle: "Dynamischer Stromtarif: Lohnt sich das 2026? | Ökovolt",
  kurzTitel: "Dynamischer Stromtarif",
  description:
    "Dynamischer Stromtarif 2026: So funktioniert er, für wen er sich lohnt und was er kostet – Rechenbeispiele mit echten Börsenpreisen und alle Risiken.",
  excerpt:
    "Börsenpreis statt Festpreis: Wir haben ein ganzes Jahr echter Strompreise durchgerechnet – für Haushalt, E-Auto und Wärmepumpe. Das Ergebnis ist eindeutiger, als viele Werbeversprechen vermuten lassen.",
  hauptKeyword: "dynamischer stromtarif",
  keywords: ["Dynamischer Stromtarif lohnt sich", "Dynamischer Stromtarif Wärmepumpe", "Dynamischer Stromtarif E-Auto", "Dynamischer Stromtarif Smart Meter", "Dynamischer Stromtarif Photovoltaik", "Börsenstrompreis Tarif", "Dynamischer Stromtarif Nachteile"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Dienstleistungen/Smartphone/smart-home-3920905_1280.jpg",
  bildAlt: "Tablet mit Energiemanagement-App vor einem Einfamilienhaus",
  badge: { wert: `bis ${eur(FALL[3].fest - FALL[3].mit)}`, text: "Ersparnis pro Jahr im Beispiel mit E-Auto und Wärmepumpe" },

  kurzFazit: [
    "**Ein dynamischer Stromtarif lohnt sich vor allem, wenn Sie große Verbraucher wie E-Auto, Wärmepumpe oder Speicher gezielt in günstige Stunden verschieben.** Für normale Haushalte ist der Vorteil klein oder negativ.",
    `In unserer Jahresrechnung mit echten Börsenpreisen spart ein Haushalt mit E-Auto durch Verschieben rund **${eur(FALL[1].fest - FALL[1].mit)}**, mit E-Auto und Wärmepumpe rund **${eur(FALL[3].fest - FALL[3].mit)}** – ohne Verschieben praktisch nichts.`,
    "Voraussetzung ist ein **intelligentes Messsystem** (Smart Meter). Seit 2025 muss jeder Stromlieferant einen dynamischen Tarif anbieten.",
    `Das Risiko sind **Preisspitzen**: Am ${BOERSE.maximum.wann} kostete Strom an der Börse ${BOERSE.maximum.wert} €/MWh – für Endkunden rechnerisch über ${Math.floor(brutto(BOERSE.maximum.wert) / 10) * 10} ct/kWh.`,
  ],

  abschnitte: [
    {
      id: "funktion",
      titel: "Wie funktioniert ein dynamischer Stromtarif?",
      tocLabel: "So funktioniert er",
      bloecke: [
        {
          typ: "p",
          text: "**Bei einem dynamischen Stromtarif ändert sich der Arbeitspreis viertelstündlich mit dem Börsenstrompreis am Day-Ahead-Markt.** Die Preise für den nächsten Tag stehen jeweils mittags fest, sodass Sie oder Ihr [Energiemanagementsystem](/wissen/lexikon#energiemanagementsystem) Verbraucher gezielt planen können. Seit Oktober 2025 wird am Day-Ahead-Markt in Viertelstunden gehandelt.",
        },
        {
          typ: "p",
          text: "Nur ein Teil Ihres Strompreises schwankt: der Börsenpreis. Netzentgelte, Stromsteuer, Umlagen, Konzessionsabgabe und die Marge des Anbieters bleiben fest und machen den größten Teil des Arbeitspreises aus. Der Tarif-Rechner auf dieser Website rechnet deshalb mit einem festen Aufschlag von rund " + ctFmt(T.aufschlagCt) + " ct netto plus Umsatzsteuer auf den Börsenpreis – als Orientierung, denn Netzentgelte unterscheiden sich je nach Region deutlich.",
        },
        {
          typ: "tabelle",
          caption: "Vom Börsenpreis zum Endkundenpreis: typische Stunden 09/2025–08/2026",
          kopf: ["Zeitpunkt", "Börsenpreis Ø", "Endkundenpreis dynamisch (brutto)"],
          zeilen: [
            [`Jahresmittel`, `${BOERSE.mittel.toLocaleString("de-DE")} €/MWh`, `ca. ${ctFmt(brutto(BOERSE.mittel))} ct/kWh`],
            [`Günstigste Stunde (${BOERSE.guenstigsteStunde.h})`, `${BOERSE.guenstigsteStunde.wert} €/MWh`, `ca. ${ctFmt(brutto(BOERSE.guenstigsteStunde.wert))} ct/kWh`],
            [`Nachts (${BOERSE.nachts.h})`, `${BOERSE.nachts.wert} €/MWh`, `ca. ${ctFmt(brutto(BOERSE.nachts.wert))} ct/kWh`],
            [`Teuerste Stunde (${BOERSE.teuersteStunde.h})`, `${BOERSE.teuersteStunde.wert} €/MWh`, `ca. ${ctFmt(brutto(BOERSE.teuersteStunde.wert))} ct/kWh`],
            [`Tiefstwert (${BOERSE.minimum.wann})`, `${BOERSE.minimum.wert} €/MWh`, "rechnerisch negativ"],
            [`Höchstwert (${BOERSE.maximum.wann})`, `${BOERSE.maximum.wert} €/MWh`, `ca. ${ctFmt(brutto(BOERSE.maximum.wert))} ct/kWh`],
          ],
          hervorheben: 2,
          minBreite: 600,
          fussnote: `Stundenmittel über zwölf Monate, Day-Ahead DE-LU (Energy-Charts/SMARD). Endkundenpreis = (Börsenpreis + ${ctFmt(T.aufschlagCt)} ct Aufschlag) × ${String(Math.round((1 + T.mwst) * 100) / 100).replace(".", ",")} – Orientierung, ohne Grundpreis. Ob negative Preise weitergegeben werden, regelt Ihr Vertrag.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Der typische Tagesverlauf",
          text: `Über das Jahr gemittelt ist Strom mittags am günstigsten, wenn viel Solarstrom im Netz ist, und abends zwischen 18 und 21 Uhr am teuersten. Nachts liegt der Preis meist nahe dem Tagesmittel. Im Schnitt lagen zwischen dem günstigsten und dem teuersten Börsenpreis eines Tages ${BOERSE.tagesSpanne} €/MWh, also rund ${ctFmt((BOERSE.tagesSpanne / 10) * (1 + T.mwst))} ct/kWh brutto. Wie es heute aussieht, zeigt [Energie live](/energie-live).`,
        },
      ],
    },
    {
      id: "rechenbeispiele",
      titel: "Rechenbeispiele: Was spart ein dynamischer Tarif wirklich?",
      tocLabel: "Rechenbeispiele",
      bloecke: [
        {
          typ: "p",
          text: "**Ohne Verschieben des Verbrauchs spart ein dynamischer Tarif praktisch nichts – der Vorteil entsteht fast vollständig durch Laden und Heizen in günstigen Stunden.** Das zeigt unsere Jahresrechnung mit allen Viertelstundenpreisen von September 2025 bis August 2026. Verglichen wird mit einem Festpreis von " + T.festpreisCt + " ct/kWh.",
        },
        {
          typ: "tabelle",
          caption: `Jährliche Stromkosten (Arbeitspreis) Festpreis vs. dynamischer Tarif, Börsenpreise 09/2025–08/2026`,
          kopf: ["Haushalt", "Verbrauch", `Festpreis ${T.festpreisCt} ct`, "Dynamisch, ohne Verschieben", "Dynamisch, mit Verschieben", "Vorteil pro Jahr"],
          zeilen: FALL.map((f) => [f.name, `${f.kwh.toLocaleString("de-DE")} kWh`, eur(f.fest), eur(f.ohne), eur(f.mit), eur(f.fest - f.mit)]),
          hervorheben: 5,
          markierteZeile: 3,
          minBreite: 760,
          fussnote: `Modell des Ökovolt-Tarif-Rechners: typische Lastprofile; „mit Verschieben“ = E-Auto vollständig, Wärmepumpe zur Hälfte, Haushalt zu 15 % in die günstigsten Slots (11 kW Ladeleistung). Ohne Grundpreise und ohne Kosten für das intelligente Messsystem. Endkundenaufschlag ${ctFmt(T.aufschlagCt)} ct netto – regional abweichend.`,
        },
        {
          typ: "p",
          text: `Drei Erkenntnisse aus der Tabelle: **Erstens** bringt der reine Wechsel ohne Verhaltensänderung zwischen minus 6 und plus 67 Euro – das deckt kaum die Kosten für den Smart Meter. **Zweitens** ist das E-Auto der größte Hebel, weil es viel Strom in kurzer Zeit zieht und meist über Nacht oder am Wochenende flexibel laden kann. **Drittens** hängt alles am Vergleichspreis: Jeder Cent, den Ihr Festpreis günstiger ist, kostet den dynamischen Tarif im Beispiel mit E-Auto und Wärmepumpe rund ${eur(FALL[3].kwh / 100)} Vorsprung.`,
        },
        {
          typ: "kennzahl",
          wert: `${ctFmt(WP_MONAT.jan)} ct`,
          titel: "effektiver Wärmepumpenstrom im Januar",
          text: `Trotz Verschieben – im April waren es ${ctFmt(WP_MONAT.apr)} ct. Gerade in den Wintermonaten, in denen die Wärmepumpe am meisten läuft, sind die Tagesschwankungen am kleinsten.`,
        },
        {
          typ: "tool",
          href: "/rechner/dynamischer-stromtarif",
          titel: "Rechnen Sie mit den Börsenpreisen von heute",
          text: "Profil wählen, Verschiebbarkeit und Festpreis einstellen – der Rechner zeigt Tageskosten und die günstigsten Zeitfenster.",
          label: "Zum Tarif-Rechner",
        },
      ],
    },
    {
      id: "fuer-wen",
      titel: "Für wen lohnt sich ein dynamischer Stromtarif?",
      tocLabel: "Für wen?",
      bloecke: [
        {
          typ: "p",
          text: "**Ein dynamischer Tarif lohnt sich für Haushalte mit hohem, zeitlich flexiblem Verbrauch – und nur, wenn die Steuerung automatisch passiert.** Diese Einschätzung teilen Verbraucherzentralen und Vergleichsportale: Für normale Haushaltskunden ohne große Verbraucher ist er in der Regel nicht empfehlenswert.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Lohnt sich meist", text: "E-Auto mit Wallbox zu Hause, das nicht jeden Abend sofort voll sein muss. Wärmepumpe mit Pufferspeicher oder gut gedämmtem Haus. Batteriespeicher mit Energiemanagement. Jahresverbrauch deutlich über 5.000 kWh." },
            { titel: "Lohnt sich eher nicht", text: "Haushalt ohne große Verbraucher. Verbrauch überwiegend abends zwischen 17 und 21 Uhr. Kein Smart Meter vorhanden und hohe Kosten für den Einbau. Wunsch nach planbaren monatlichen Kosten." },
          ],
        },
        { typ: "h3", text: "Mit Photovoltaikanlage: Weniger Hebel, aber sinnvolle Ergänzung" },
        {
          typ: "p",
          text: "Wer eine [Photovoltaikanlage](/produkte/photovoltaikanlage) hat, verbraucht mittags ohnehin eigenen Solarstrom – genau dann, wenn der Börsenpreis am niedrigsten ist. Der dynamische Tarif wirkt deshalb vor allem im Winterhalbjahr und nachts, etwa beim Laden des E-Autos. Mit einem [Stromspeicher](/produkte/stromspeicher) lässt sich an trüben Tagen auch günstiger Netzstrom zwischenspeichern. Für Anlagen mit EEG-Vergütung war das bisher rechtlich heikel; die Bundesnetzagentur plant mit der sogenannten MiSpeL-Festlegung ab dem 1. Oktober 2026 klarere Regeln (Stand August 2026: noch nicht endgültig beschlossen).",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Automatisch statt von Hand",
          text: "Niemand stellt dauerhaft den Wecker, um um 3 Uhr die Waschmaschine zu starten. Den Vorteil holt ein Energiemanagement, das Wallbox, Wärmepumpe und Speicher anhand der Preisprognose steuert – etwa über das [Smart Energy Home](/produkte/smartenergyhome). Viele Wallboxen und Wechselrichter können Preissignale inzwischen direkt verarbeiten.",
        },
      ],
    },
    {
      id: "voraussetzungen",
      titel: "Voraussetzungen und Kosten",
      tocLabel: "Voraussetzungen",
      bloecke: [
        {
          typ: "p",
          text: "**Für einen dynamischen Stromtarif brauchen Sie ein intelligentes Messsystem, also einen digitalen Zähler mit Smart-Meter-Gateway.** Nur damit kann Ihr Verbrauch viertelstündlich abgerechnet werden. Seit dem 1. Januar 2025 müssen alle Stromlieferanten Kunden mit intelligentem Messsystem einen dynamischen Tarif anbieten (§ 41a EnWG).",
        },
        {
          typ: "tabelle",
          caption: "Kosten des intelligenten Messsystems für Haushalte (gesetzliche Preisobergrenzen, Stand 2026)",
          kopf: ["Fall", "Jährliches Entgelt für Sie (brutto, höchstens)", "Einmalig"],
          zeilen: [
            ["Einbau auf Wunsch (optionaler Einbau)", "30 €", "bis 100 € bei vorzeitigem Einbau auf Verlangen"],
            ["Jahresverbrauch 6.001–10.000 kWh (Pflichteinbau)", "40 €", "–"],
            ["Wärmepumpe/Wallbox nach § 14a EnWG oder PV 7–15 kW", "50 €", "–"],
            ["Jahresverbrauch 10.001–20.000 kWh", "50 €", "–"],
          ],
          hervorheben: 1,
          minBreite: 600,
          fussnote: "Nach §§ 30 und 35 MsbG für den grundzuständigen Messstellenbetreiber; zusätzlich zahlt der Netzbetreiber einen gedeckelten Anteil. Eine Steuerbox kann weitere Entgelte auslösen. Beim vorzeitigen Einbau auf Verlangen muss der Messstellenbetreiber innerhalb von vier Monaten liefern.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Intelligentes Messsystem** beim Messstellenbetreiber beauftragen oder vorhandenes nutzen – mehr unter [Smart Meter](/produkte/smartmeter)",
            "**Tarife vergleichen:** monatliche Grundgebühr, Aufschlag je kWh und ob negative Preise weitergegeben werden",
            "**Kurze Laufzeit** wählen, idealerweise monatlich kündbar",
            "**Steuerbare Verbraucher** mit Energiemanagement, Wallbox-App oder Wärmepumpen-Schnittstelle vorbereiten",
            "**Zeitvariable Netzentgelte prüfen:** Wer eine Wallbox oder Wärmepumpe nach [§ 14a EnWG](/wissen/lexikon#paragraf-14a-enwg) angemeldet hat, kann zusätzlich Modul 3 wählen",
          ],
        },
      ],
    },
    {
      id: "risiken",
      titel: "Risiken und Nachteile eines dynamischen Tarifs",
      tocLabel: "Risiken",
      bloecke: [
        {
          typ: "p",
          text: "**Das größte Risiko sind Preisspitzen in Stunden, in denen Sie nicht ausweichen können.** Wer im Winter abends kocht, heizt und das Auto lädt, zahlt dann deutlich mehr als mit einem Festpreis. Die Verbraucherzentrale weist darauf hin, dass Kunden das volle Preisrisiko der Börse tragen und die monatlichen Kosten nicht mehr planbar sind.",
        },
        {
          typ: "liste",
          punkte: [
            `**Extreme Einzelwerte:** Am ${BOERSE.maximum.wann} erreichte der Börsenpreis ${BOERSE.maximum.wert} €/MWh. Mit Aufschlag entspricht das rund ${ctFmt(brutto(BOERSE.maximum.wert))} ct/kWh.`,
            "**Winter:** Von November bis Februar sind die Tagesschwankungen kleiner und das Preisniveau höher – genau dann, wenn Wärmepumpen am meisten Strom brauchen.",
            "**Marktentwicklung:** Steigen Gas- oder CO₂-Preise, steigt der Börsenstrompreis direkt mit. Einen Preisschutz wie beim Festpreisvertrag gibt es nicht.",
            "**Aufwand:** Ohne Automatisierung bleibt der Vorteil klein. Energiemanagement und kompatible Geräte kosten zusätzlich.",
            "**Vergleichbarkeit:** Grundgebühren und Aufschläge unterscheiden sich stark, die Angebote sind schwer zu vergleichen.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Negative Preise sind kein Geschenk",
          text: `An ${BOERSE.negativStunden} Stunden im Betrachtungsjahr lag der Börsenpreis unter null, am tiefsten bei ${BOERSE.minimum.wert} €/MWh (${BOERSE.minimum.wann}). Weil Netzentgelte, Steuern und Umlagen bleiben, wird Strom für Endkunden dadurch meist nur sehr günstig, selten wirklich kostenlos. Und diese Stunden liegen fast immer mittags an sonnigen Wochenenden und Feiertagen. Hintergründe im Lexikon unter [negative Strompreise](/wissen/lexikon#negative-strompreise).`,
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "So finden Sie heraus, ob sich der Wechsel lohnt",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Verbrauch aufschlüsseln", "Wie viel entfällt auf E-Auto, Wärmepumpe und Haushalt? Wann wird geladen und geheizt?"],
            ["Festpreis prüfen", "Den eigenen Arbeitspreis mit aktuellen Festpreisangeboten vergleichen – ein günstiger Festpreis ist die Messlatte."],
            ["Mit echten Preisen rechnen", "Im [Tarif-Rechner](/rechner/dynamischer-stromtarif) Profil und Verschiebbarkeit einstellen."],
            ["Smart Meter klären", "Ist ein intelligentes Messsystem vorhanden? Falls nicht: Kosten und Einbauzeit beim Messstellenbetreiber erfragen."],
            ["Automatisierung sicherstellen", "Wallbox, Wärmepumpe und Speicher mit Preissignal steuern – sonst bleibt der Vorteil theoretisch."],
          ],
        },
        {
          typ: "p",
          text: "Wenn Sie ohnehin über eine PV-Anlage, einen Speicher oder eine Wallbox nachdenken, lohnt es sich, den Tarif gleich mitzuplanen. Informationen zum Tarifwechsel mit Ökovolt finden Sie unter [dynamischer Stromtarif](/service/stromtarif); wie viel Eigenverbrauch eine Wallbox mit Solarstrom bringt, zeigt der [Wallbox-Rechner](/rechner/wallbox).",
        },
      ],
    },
  ],

  faq: [
    { q: "Lohnt sich ein dynamischer Stromtarif für einen normalen Haushalt?", a: `Meist nicht. In unserer Jahresrechnung spart ein Haushalt mit ${FALL[0].kwh.toLocaleString("de-DE")} kWh ohne große Verbraucher selbst mit Verschieben nur rund ${eur(FALL[0].fest - FALL[0].mit)} gegenüber ${T.festpreisCt} ct Festpreis – vor Kosten für den Smart Meter.` },
    { q: "Brauche ich für einen dynamischen Stromtarif einen Smart Meter?", a: "Ja. Ohne intelligentes Messsystem kann der Verbrauch nicht viertelstündlich abgerechnet werden. Den Einbau können Sie beim Messstellenbetreiber beantragen; die Kosten sind gesetzlich gedeckelt." },
    { q: "Lohnt sich ein dynamischer Stromtarif mit Wärmepumpe?", a: `Etwas. Im Beispiel mit 4.000 kWh Wärmepumpenstrom sind es rund ${eur(FALL[2].fest - FALL[2].mit)} im Jahr. Der Hebel ist kleiner als beim E-Auto, weil die Wärmepumpe im Winter läuft, wenn die Preisunterschiede gering sind. Ein Pufferspeicher erhöht die Flexibilität.` },
    { q: "Lohnt sich ein dynamischer Stromtarif mit E-Auto?", a: `Ja, wenn das Auto flexibel geladen werden kann. Im Beispiel mit 15.000 km Fahrleistung spart das gezielte Laden in günstigen Stunden rund ${eur(FALL[1].fest - FALL[1].mit)} pro Jahr.` },
    { q: "Muss jeder Stromanbieter einen dynamischen Tarif anbieten?", a: "Ja. Seit dem 1. Januar 2025 sind alle Stromlieferanten nach § 41a EnWG verpflichtet, Kunden mit intelligentem Messsystem einen dynamischen Tarif anzubieten. Grundgebühr und Aufschlag unterscheiden sich aber deutlich." },
    { q: "Passt ein dynamischer Stromtarif zu einer PV-Anlage?", a: "Ja, als Ergänzung. Mittags nutzen Sie eigenen Solarstrom, der dynamische Tarif hilft vor allem nachts und im Winter. Mit Speicher und Energiemanagement lässt sich zusätzlich günstiger Netzstrom nutzen." },
    { q: "Wann ist Strom am günstigsten?", a: `Im Jahresmittel mittags zwischen 12 und 15 Uhr, besonders an sonnigen Wochenenden. Am teuersten ist er abends zwischen 18 und 21 Uhr. Die aktuellen Preise zeigt [Energie live](/energie-live).` },
  ],

  passend: [
    { href: "/rechner/dynamischer-stromtarif", titel: "Tarif-Rechner", text: "Festpreis und dynamischen Tarif mit echten Börsenpreisen vergleichen." },
    { href: "/ratgeber/negative-strompreise", titel: "Negative Strompreise", text: "Ursachen, Häufigkeit und Folgen für PV-Besitzer." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Wie Wallbox, Wärmepumpe und Speicher automatisch reagieren." },
    { href: "/service/stromtarif", titel: "Dynamischer Stromtarif", text: "Börsenpreis live und Tarifinformationen." },
  ],

  quellen: [
    { titel: "Energy-Charts (Fraunhofer ISE) – Day-Ahead-Börsenstrompreise DE-LU, Daten Bundesnetzagentur/SMARD", url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=de&c=DE", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Dynamische Stromtarife: Für wen es sich lohnt", url: "https://www.verbraucherzentrale.de/wissen/energie/preise-tarife-anbieterwechsel/dynamische-stromtarife-fuer-wen-es-sich-lohnt-und-worauf-sie-achten-sollten-97836", stand: "10/2025" },
    { titel: "§ 41a EnWG – Lastvariable, tageszeitabhängige oder dynamische Stromtarife", url: "https://www.gesetze-im-internet.de/enwg_2005/__41a.html", stand: "09/2026" },
    { titel: "§ 30 MsbG – Preisobergrenzen intelligenter Messsysteme", url: "https://www.gesetze-im-internet.de/messbg/__30.html", stand: "09/2026" },
    { titel: "§ 35 MsbG – Entgelt für den vorzeitigen Einbau auf Verlangen", url: "https://www.gesetze-im-internet.de/messbg/__35.html", stand: "09/2026" },
    { titel: "FfE – Deutsche Strompreise an der Börse EPEX Spot 2025", url: "https://www.ffe.de/en/publications/german-electricity-prices-on-the-epex-spot-exchange-in-2025/", stand: "01/2026" },
    { titel: "pv magazine – MiSpeL-Festlegung soll zum 1. Oktober in Kraft treten", url: "https://www.pv-magazine.de/2026/08/05/bundesnetzagentur-mispel-festlegung-soll-zum-1-oktober-in-kraft-treten/", stand: "08/2026" },
  ],

  seitenCta: { titel: "Lohnt es sich bei Ihnen?", text: "Mit den Börsenpreisen von heute und Ihrem Profil rechnen.", href: "/rechner/dynamischer-stromtarif", label: "Zum Tarif-Rechner" },
  cta: {
    title: "Solarstrom, Speicher und Börsenpreis clever kombinieren.",
    text: "Wir planen PV-Anlage, Speicher, Wallbox und Energiemanagement so, dass Sie Eigenverbrauch und günstige Börsenstunden automatisch nutzen.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Tarif-Rechner", href: "/rechner/dynamischer-stromtarif" },
  },
};

export default artikel;
