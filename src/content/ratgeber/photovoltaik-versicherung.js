// Ratgeber: Photovoltaik-Versicherung
// Beitragsspannen: Stiftung Warentest (Finanztest 04/2025). Ertragsbeispiel aus
// Solarrechner-Kern und Monatsverteilung der Rechner-Profile.

import { ANNAHMEN } from "@/data/solarrechner";
import { berechne } from "@/lib/solarrechner";
import { PV_MONAT } from "@/lib/rechner/profile";

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

const BSP = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const WERT_JAHR = BSP.ersparnis + BSP.einspeiseErloes; // wirtschaftlicher Wert des Jahresertrags
const ANTEIL_JUNI_JULI = PV_MONAT[5] + PV_MONAT[6];
const AUSFALL = WERT_JAHR * ANTEIL_JUNI_JULI;
const BETRIEB = 10 * ANNAHMEN.betriebskostenProKwp;

const artikel = {
  slug: "photovoltaik-versicherung",
  title: "Photovoltaik-Versicherung: Sinnvoller Schutz und Kosten 2026",
  seoTitle: "Photovoltaik-Versicherung 2026: Schutz & Kosten | Ökovolt",
  kurzTitel: "Photovoltaik-Versicherung",
  description:
    "Photovoltaik-Versicherung 2026: Wohngebäudeversicherung oder Allgefahrenschutz, Haftpflicht, Ertragsausfall und Speicher – mit Kosten, Checkliste und Praxistipps.",
  excerpt:
    "Reicht die Wohngebäudeversicherung für Ihre Solaranlage? Welche Schäden sie nicht abdeckt, was eine PV-Versicherung kostet und welche Leistungen wirklich zählen.",
  hauptKeyword: "photovoltaik versicherung",
  keywords: [
    "Photovoltaik Versicherung",
    "PV-Anlage Versicherung Kosten",
    "Photovoltaik Wohngebäudeversicherung",
    "Allgefahrenversicherung Photovoltaik",
    "Betreiberhaftpflicht Photovoltaik",
    "Stromspeicher versichern",
    "Ertragsausfallversicherung PV",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/Jobs/jobs2.jpg",
  bildAlt: "Fachkraft prüft Photovoltaikmodule auf einem Dach",
  badge: { wert: "65–137 €", text: "pro Jahr für eine separate PV-Versicherung (Stiftung Warentest)" },

  kurzFazit: [
    "**Eine Versicherungspflicht für private PV-Anlagen gibt es nicht – sinnvoll ist ein Schutz trotzdem**, weil Reparaturen schnell vierstellige Beträge kosten.",
    "**Mindestens** gehört die Anlage in die Wohngebäudeversicherung (Feuer, Blitz, Sturm, Hagel). Zusatzbausteine gibt es laut Stiftung Warentest ab rund 35 € im Jahr.",
    "**Umfassender** ist eine eigene Photovoltaik-Versicherung (Allgefahrenschutz): Sie deckt auch Überspannung, Marderbiss, Diebstahl, Bedienfehler, Schneelast und Ertragsausfall. Gute Tarife kosteten im Test 65 bis 137 € pro Jahr.",
    "**Haftpflicht** nicht vergessen: Fällt ein Modul vom Dach, haftet der Betreiber. Viele Privathaftpflicht-Tarife schließen PV-Anlagen ein – prüfen Sie die Bedingungen.",
  ],

  abschnitte: [
    {
      id: "noetig",
      titel: "Braucht eine PV-Anlage eine Versicherung?",
      tocLabel: "Pflicht oder sinnvoll?",
      bloecke: [
        {
          typ: "p",
          text: "**Gesetzlich vorgeschrieben ist eine Versicherung für private Photovoltaikanlagen nicht, empfehlenswert ist sie aber fast immer.** Eine Anlage kostet heute schnell 10.000 € und mehr, hängt jahrzehntelang Wind und Wetter aus und enthält empfindliche Elektronik. Bei Krediten oder Mietmodellen verlangen Bank oder Anbieter oft einen Versicherungsnachweis.",
        },
        {
          typ: "p",
          text: "Zwei Arten von Risiken sollten Sie unterscheiden: **Schäden an der eigenen Anlage** (Sachschäden und entgangener Ertrag) und **Schäden, die Ihre Anlage bei anderen verursacht** (Haftpflicht). Für beides gibt es unterschiedliche Versicherungen – und genau hier entstehen die meisten Lücken.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Anlage dem Versicherer melden",
          text: "Wer eine PV-Anlage installiert, verändert das versicherte Gebäude. Melden Sie die Anlage Ihrem Wohngebäudeversicherer – sonst drohen Streit über den Versicherungsschutz oder eine Unterversicherung. Gleiches gilt, wenn später ein [Stromspeicher](/ratgeber/stromspeicher-kosten) oder eine Wallbox dazukommt.",
        },
      ],
    },
    {
      id: "schutz-vergleich",
      titel: "Wohngebäudeversicherung oder Photovoltaik-Versicherung?",
      tocLabel: "Wohngebäude vs. PV-Versicherung",
      bloecke: [
        {
          typ: "p",
          text: "**Die Wohngebäudeversicherung schützt nur gegen die klassischen Gebäudegefahren, eine Photovoltaik-Versicherung als Allgefahrenschutz auch gegen die typischen Technikschäden.** Welcher Schutz passt, hängt vom Wert der Anlage und davon ab, wie viel Risiko Sie selbst tragen möchten.",
        },
        {
          typ: "tabelle",
          caption: "Welche Versicherung zahlt bei welchem Schaden? (typischer Leistungsumfang)",
          kopf: ["Schadenursache", "Wohngebäudeversicherung", "PV-Versicherung (Allgefahren)", "Haftpflicht"],
          zeilen: [
            ["Feuer, Blitzeinschlag", "ja", "ja", "–"],
            ["Sturm (ab Windstärke 8), Hagel", "ja", "ja", "–"],
            ["Überspannung durch Blitz in der Nähe", "nur mit Zusatzklausel", "ja", "–"],
            ["Marder- und Tierbiss an Kabeln", "meist nein", "ja", "–"],
            ["Diebstahl, Vandalismus", "meist nein", "ja", "–"],
            ["Bedien- und Konstruktionsfehler, Kurzschluss", "nein", "ja", "–"],
            ["Schneedruck", "nur mit Elementarschutz", "ja", "–"],
            ["Ertragsausfall nach einem Schaden", "nein", "ja (Dauer begrenzt)", "–"],
            ["Batteriespeicher", "je nach Tarif", "wenn eingeschlossen", "–"],
            ["Modul fällt auf Passanten oder Nachbarauto", "–", "–", "ja"],
          ],
          hervorheben: 2,
          minBreite: 680,
          fussnote: "Typische Bedingungen, keine Rechtsberatung. Der tatsächliche Umfang steht in den Versicherungsbedingungen Ihres Tarifs. Sturm gilt bei Versicherern in der Regel erst ab Windstärke 8 (Verbraucherzentrale).",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Einschluss in die Wohngebäudeversicherung", text: "Günstig und einfach: Die Anlage wird als Gebäudebestandteil mitversichert, ggf. mit Zusatzbaustein. Deckt Feuer, Blitzeinschlag, Sturm und Hagel. Technische Defekte, Überspannung ohne Klausel, Diebstahl oder Ertragsausfall sind meist nicht dabei." },
            { titel: "Photovoltaik-Versicherung (Allgefahren)", text: "Eigene Police nur für die Anlage, meist inklusive Wechselrichter, Verkabelung und optional Speicher. Versichert sind alle Gefahren, die nicht ausdrücklich ausgeschlossen sind – plus Ertragsausfall. Etwas teurer, aber deutlich umfassender." },
          ],
        },
        {
          typ: "p",
          text: "Die Verbraucherzentrale empfiehlt, die Anlage **wenigstens in die Wohngebäudeversicherung** einzuschließen und für größere oder teurere Anlagen eine spezielle [Photovoltaikversicherung](/wissen/lexikon#photovoltaikversicherung) abzuschließen. Manche Anbieter kalkulieren diese für die ersten ein bis drei Jahre bereits in den Anlagenpreis ein – fragen Sie danach und notieren Sie das Ablaufdatum.",
        },
      ],
    },
    {
      id: "haftpflicht",
      titel: "Betreiberhaftpflicht: Schäden bei anderen absichern",
      tocLabel: "Haftpflicht",
      bloecke: [
        {
          typ: "p",
          text: "**Als Betreiber haften Sie, wenn Ihre Anlage anderen einen Schaden zufügt – etwa wenn sich bei Sturm ein Modul löst und ein Auto oder eine Person trifft.** Eine Photovoltaik-Versicherung zahlt dafür nicht, zuständig ist die Haftpflichtversicherung. Stiftung Warentest bezeichnet die private Haftpflicht deshalb als unverzichtbar.",
        },
        {
          typ: "liste",
          punkte: [
            "**Private Haftpflicht:** Viele Tarife schließen PV-Anlagen auf dem selbst genutzten Haus ein, teils mit Grenzen bei Anlagengröße oder Einspeisung. Prüfen Sie die Bedingungen oder lassen Sie sich den Einschluss schriftlich bestätigen.",
            "**Haus- und Grundbesitzerhaftpflicht:** Nötig bei vermieteten Gebäuden, etwa beim Mehrfamilienhaus mit [Mieterstrom](/produkte/mieterstrom) oder gemeinschaftlicher Gebäudeversorgung.",
            "**Betriebshaftpflicht:** Für Unternehmen und Landwirte; die Anlage muss dort ausdrücklich als Risiko genannt sein. Mehr zu Anlagen im Betrieb im Ratgeber [Photovoltaik für Gewerbe](/ratgeber/photovoltaik-gewerbe).",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Während der Montage haftet der Installateur",
          text: "Bis zur Abnahme trägt beim Werkvertrag grundsätzlich der ausführende Betrieb die Gefahr für das Werk (§ 644 BGB). Schäden während der Montage sind Sache seiner Betriebshaftpflicht bzw. Montageversicherung. Ab der Abnahme sollte Ihr eigener Schutz stehen – schließen Sie die Versicherung also vor dem Inbetriebnahmetermin ab.",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet eine Photovoltaik-Versicherung?",
      tocLabel: "Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Eine eigene Photovoltaik-Versicherung mit gutem Mindestschutz kostete im Test der Stiftung Warentest 65 bis 137 € im Jahr, Zusatzbausteine zur Wohngebäudeversicherung gab es ab rund 35 €.** Von 95 geprüften Tarifen erfüllten 57 den empfohlenen Mindestschutz. Der Beitrag hängt vor allem von Anlagenwert, Selbstbeteiligung, Region und Leistungsumfang ab.",
        },
        {
          typ: "tabelle",
          caption: "Jahresbeiträge für Einfamilienhaus-Anlagen im Überblick",
          kopf: ["Absicherung", "Beitrag pro Jahr", "Quelle / Hinweis"],
          zeilen: [
            ["Zusatzbaustein in der Wohngebäudeversicherung", "ab ca. 35 €", "Stiftung Warentest, Finanztest 04/2025"],
            ["Separate PV-Versicherung mit Mindestschutz", "ca. 65–137 €", "Stiftung Warentest, Finanztest 04/2025"],
            ["Speicher-Einschluss", "je nach Tarif inklusive oder Aufpreis", "Speicherwert als Versicherungssumme angeben"],
            ["Private Haftpflicht mit PV-Einschluss", "oft ohne Mehrbeitrag", "Bedingungen prüfen"],
          ],
          hervorheben: 1,
          minBreite: 600,
        },
        {
          typ: "p",
          text: `Zum Vergleich: Für alle laufenden Kosten einer 10-kWp-Anlage – Versicherung, Zählermiete, Wartung und Rücklage für den Wechselrichter – kalkulieren wir im [Solarrechner](/solarrechner) rund ${ANNAHMEN.betriebskostenProKwp} € je kWp, also etwa ${eur(BETRIEB)} im Jahr. Die Versicherung ist davon ein überschaubarer Teil. Wie sich die Betriebskosten auf die Wirtschaftlichkeit auswirken, zeigt der Ratgeber [Amortisation Photovoltaik](/ratgeber/photovoltaik-amortisation).`,
        },
        {
          typ: "kennzahl",
          wert: eur(AUSFALL),
          titel: "Ertragsverlust, wenn eine 10-kWp-Anlage im Juni und Juli stillsteht",
          text: `In diesen zwei Monaten entstehen rund ${Math.round(ANTEIL_JUNI_JULI * 100)} % des Jahresertrags. Dazu kommen die Reparaturkosten – ein getauschter Wechselrichter oder mehrere Module mit Gerüst sind schnell vierstellig. Genau dafür ist die Ertragsausfall-Leistung gedacht.`,
        },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste: Darauf kommt es beim Tarif an",
      tocLabel: "Tarif-Checkliste",
      bloecke: [
        {
          typ: "p",
          text: "**Stiftung Warentest nennt sieben Leistungen als Mindestschutz.** Darüber hinaus lohnen sich einige Details, die im Schadensfall über Hunderte Euro entscheiden:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Ertragsausfall** nach einem versicherten Schaden – mit ausreichender Dauer und nachvollziehbarer Berechnung (Pauschale je kWp oder tatsächlicher Ertrag).",
            "**Tierbiss** (Marder, Nager) an Kabeln und Dämmung.",
            "**Diebstahl** von Modulen, Wechselrichter und Speicher.",
            "**Überspannung** durch Blitz, auch ohne direkten Einschlag.",
            "**Bedienungs- und Konstruktionsfehler** sowie Kurzschluss.",
            "**Schneelast** auf Modulen und Unterkonstruktion.",
            "**Batteriespeicher** mitversichert, inklusive Brandfolgeschäden.",
            "**Neuwertentschädigung** statt Zeitwert und ausreichende Versicherungssumme – sonst droht Unterversicherung.",
            "**Nebenkosten** wie Gerüst, Demontage, Entsorgung und Aufräumarbeiten eingeschlossen.",
            "**Grobe Fahrlässigkeit** mitversichert und eine Selbstbeteiligung, die zu Ihrem Budget passt.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Garantie ist keine Versicherung",
          text: "Hersteller- und Leistungsgarantien decken Produktionsfehler und übermäßigen Leistungsverlust – aber keine Sturm-, Hagel- oder Marderschäden. Eine gute Garantie senkt das Risiko, ersetzt den Versicherungsschutz jedoch nicht.",
        },
      ],
    },
    {
      id: "speicher-wallbox",
      titel: "Stromspeicher, Wallbox und Balkonkraftwerk mitversichern",
      tocLabel: "Speicher & Co.",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Batteriespeicher erhöht den Versicherungswert Ihrer Anlage um mehrere tausend Euro und sollte ausdrücklich eingeschlossen sein.** Viele PV-Tarife bieten ihn als Option an. Geben Sie beim Abschluss die Speicherkosten in der Versicherungssumme an und melden Sie eine spätere Nachrüstung. Die Verbraucherzentrale rät außerdem, Speicher nicht in hochwassergefährdeten Kellern aufzustellen.",
        },
        {
          typ: "liste",
          punkte: [
            "**Wallbox:** fest installiert meist Teil des Gebäudes und damit in der Wohngebäudeversicherung – bei Überspannung und Diebstahl lohnt der Blick in die Bedingungen. Hintergründe: [Wallbox-Installation](/ratgeber/wallbox-installation).",
            "**Balkonkraftwerk:** gilt meist als beweglicher Gegenstand und fällt eher unter die Hausratversicherung; die Haftpflicht sollte Steckersolargeräte ausdrücklich einschließen. Mehr im Ratgeber [Balkonkraftwerk](/ratgeber/balkonkraftwerk).",
            "**Energiemanagement und Smart Meter:** in der Regel über die Elektronik-Deckung der PV-Versicherung abgedeckt, sofern sie zur Anlage gehören.",
          ],
        },
      ],
    },
    {
      id: "vorbeugen",
      titel: "Schäden vorbeugen: Was Versicherer und Verbraucherschützer empfehlen",
      tocLabel: "Vorbeugen",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Überspannungsschutz", text: "Laut Verbraucherzentrale ist ein interner Blitzschutz bei PV-Anlagen seit 2018 Pflicht. Lassen Sie sich den [Überspannungsschutz](/wissen/lexikon#ueberspannungsschutz) im Übergabeprotokoll bestätigen." },
            { titel: "Hagelfeste Module", text: "Glas-Glas-Module gelten als widerstandsfähiger gegen Hagel als Glas-Folien-Module. Mehr dazu im [Solarmodule-Vergleich](/ratgeber/solarmodule-vergleich)." },
            { titel: "Monitoring", text: "Ein Ertragseinbruch fällt über die App schnell auf. Das begrenzt den Ertragsausfall – manche Versicherer setzen eine Überwachung sogar voraus. Tipps unter [Reinigung & Wartung](/ratgeber/photovoltaik-reinigung-wartung)." },
            { titel: "Regelmäßige Prüfung", text: "Die Verbraucherzentrale empfiehlt regelmäßige Sichtkontrollen und alle fünf Jahre eine Fachprüfung. Ein Prüfprotokoll hilft auch im Schadensfall." },
          ],
        },
      ],
    },
    {
      id: "schadensfall",
      titel: "Im Schadensfall richtig vorgehen",
      tocLabel: "Schadensfall",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Sicherheit zuerst", "Beschädigte Module und Kabel nicht berühren – auch bei Tageslicht liegt Gleichspannung an. Bei Brand die Feuerwehr auf die PV-Anlage hinweisen."],
            ["Anlage abschalten lassen", "Den Fachbetrieb informieren, der die Anlage sicher vom Netz trennt und den Schaden begutachtet."],
            ["Dokumentieren", "Fotos vom Schaden, Ertragsdaten aus dem Monitoring vor und nach dem Ereignis, Wetterdaten (z. B. Sturm- oder Hagelmeldung) sichern."],
            ["Schaden melden", "Den Versicherer unverzüglich informieren, Rechnungen, Anlagendaten und Kostenvoranschlag einreichen. Keine Reparatur ohne Absprache beauftragen, außer zur Schadensminderung."],
            ["Ertragsausfall belegen", "Für die Entschädigung Ertragsdaten des Vorjahres oder die Prognose aus der Planung bereithalten."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Ist eine PV-Anlage automatisch in der Wohngebäudeversicherung mitversichert?",
      a: "Nicht automatisch. Fest montierte Dachanlagen können als Gebäudebestandteil gelten, viele Versicherer verlangen aber eine Meldung oder einen Zusatzbaustein. Melden Sie die Anlage in jedem Fall, damit Versicherungssumme und Schutz passen.",
    },
    {
      q: "Was kostet eine Photovoltaik-Versicherung im Jahr?",
      a: "Separate PV-Versicherungen mit gutem Mindestschutz kosteten im Test der Stiftung Warentest (04/2025) 65 bis 137 € im Jahr. Zusatzbausteine zur Wohngebäudeversicherung gibt es ab rund 35 €.",
    },
    {
      q: "Brauche ich eine extra Haftpflicht für meine Solaranlage?",
      a: "Meist nicht, wenn Ihre private Haftpflicht PV-Anlagen auf dem selbst genutzten Haus einschließt. Das ist bei vielen Tarifen der Fall, aber nicht bei allen. Bei vermieteten oder gewerblich genutzten Gebäuden brauchen Sie eine Haus- und Grundbesitzer- oder Betriebshaftpflicht.",
    },
    {
      q: "Zahlt die Versicherung bei Hagelschaden an Solarmodulen?",
      a: "Ja, Hagel ist sowohl in der Wohngebäudeversicherung als auch in einer PV-Versicherung versichert. Nur die PV-Versicherung ersetzt aber in der Regel auch den Ertragsausfall bis zur Reparatur.",
    },
    {
      q: "Ist ein Stromspeicher in der PV-Versicherung enthalten?",
      a: "Nicht immer. Viele Tarife bieten den Speicher als Option an. Achten Sie darauf, dass der Speicherwert in der Versicherungssumme enthalten ist, und melden Sie einen nachgerüsteten Speicher.",
    },
    {
      q: "Lohnt sich eine Photovoltaik-Versicherung für kleine Anlagen?",
      a: "Bei kleinen Anlagen reicht oft der Einschluss in die Wohngebäudeversicherung plus Haftpflicht. Je teurer die Anlage und je höher der Eigenverbrauch, desto eher lohnt ein Allgefahrenschutz mit Ertragsausfall.",
    },
    {
      q: "Sind Marderschäden an der PV-Anlage versichert?",
      a: "In der Wohngebäudeversicherung meist nicht. Eine Photovoltaik-Versicherung mit Mindestschutz nach Stiftung Warentest deckt Tierbiss dagegen ab.",
    },
  ],

  passend: [
    { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und laufende Kosten." },
    { href: "/ratgeber/photovoltaik-reinigung-wartung", titel: "Reinigung & Wartung", text: "Prüfungen, Monitoring und Kosten." },
    { href: "/ratgeber/stromspeicher-kosten", titel: "Stromspeicher Kosten", text: "Preise, Nachrüstung und Wirtschaftlichkeit." },
    { href: "/angebot", titel: "Angebot anfragen", text: "Anlage mit sauberem Übergabeprotokoll." },
  ],

  quellen: [
    { titel: "Stiftung Warentest – Photovoltaikversicherung: Guten Schutz gibt es für unter 100 Euro im Jahr", url: "https://www.test.de/Photovoltaikversicherung-Guten-Schutz-gibt-es-fuer-unter-100-Euro-im-Jahr-5138152-0/", stand: "04/2025" },
    { titel: "Verbraucherzentrale – Photovoltaik: Was bei der Planung einer Solaranlage wichtig ist", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-was-bei-der-planung-einer-solaranlage-wichtig-ist-5574", stand: "08/2026" },
    { titel: "Verbraucherzentrale – Regen, Hagel, Sturm und Gewitter: Wofür haftet welche Versicherung?", url: "https://www.verbraucherzentrale.de/wissen/geld-versicherungen/weitere-versicherungen/regen-hagel-sturm-und-gewitter-wofuer-haftet-welche-versicherung-13903", stand: "08/2026" },
    { titel: "§ 644 BGB – Gefahrtragung beim Werkvertrag", url: "https://www.gesetze-im-internet.de/bgb/__644.html", stand: "09/2026" },
  ],

  seitenCta: { titel: "Alle Kosten im Blick", text: "Investition, Betriebskosten und Amortisation berechnen.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Gut geplant ist halb versichert.",
    text: "Planung, Montage und Anmeldung aus einer Hand – vom Fachbetrieb aus Türkheim mit über 15 Jahren Erfahrung. Fragen Sie uns auch nach den Anlagendaten für Ihren Versicherer.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Kontakt aufnehmen", href: "/kontakt" },
  },
};

export default artikel;
