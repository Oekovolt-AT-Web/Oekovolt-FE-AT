// Ratgeber: Energiemanagementsystem (HEMS) für Photovoltaik
// § 14a-Werte aus src/data/wallbox.js (zentrale Zahlen der Website).

import { WALLBOX } from "@/data/wallbox";
import { SOLAR } from "@/lib/rechner/annahmen";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";

const P14A = WALLBOX.paragraf14a;
const kw = (n) => `${n.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kW`;
const ctStr = (n) => String(Math.round(n * 1000) / 10).replace(".", ",");

// Gleichzeitigkeitsfaktoren nach BNetzA-Festlegung BK6-22-300 (Anlage 1)
const GZF = [
  { n: 2, f: 0.8 },
  { n: 3, f: 0.75 },
  { n: 4, f: 0.7 },
  { n: 5, f: 0.65 },
  { n: 6, f: 0.6 },
  { n: 7, f: 0.55 },
  { n: 8, f: 0.5 },
  { n: "9 und mehr", f: 0.45 },
];
const minLeistung = (n, f) => P14A.drosselungKw + (n - 1) * f * P14A.drosselungKw;

const artikel = {
  slug: "energiemanagementsystem",
  title: "Energiemanagementsystem für Photovoltaik: Funktionen & Standards",
  seoTitle: "Energiemanagementsystem Photovoltaik: HEMS erklärt | Ökovolt",
  kurzTitel: "Energiemanagementsystem",
  description:
    "Energiemanagementsystem für Photovoltaik: Was ein HEMS steuert, welche Standards zählen (SG Ready, EEBus, OCPP), was § 14a EnWG verlangt und was es kostet.",
  excerpt:
    "Speicher, Wallbox, Wärmepumpe und dynamischer Tarif – wer mehrere Verbraucher hat, braucht eine Steuerung, die sie koordiniert. Wie ein HEMS funktioniert, welche Schnittstellen 2026 wichtig sind und worauf Sie beim Kauf achten.",
  hauptKeyword: "energiemanagementsystem photovoltaik",
  keywords: [
    "Energiemanagementsystem Photovoltaik",
    "HEMS Photovoltaik",
    "Home Energy Management System",
    "Energiemanager PV-Anlage",
    "EMS § 14a EnWG",
    "SG Ready EEBus",
    "Energiemanagement Wärmepumpe Wallbox",
  ],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/energiemanagementsystem.jpg",
  bildAlt: "Schnittbild eines Hauses mit Energieflüssen zwischen Photovoltaik, Sigenergy-Speicher, Wallbox und Haushalt",
  badge: { wert: kw(P14A.drosselungKw), text: "Mindestleistung je steuerbarer Verbrauchseinrichtung nach § 14a EnWG" },

  kurzFazit: [
    "**Ein Energiemanagementsystem (HEMS) misst die Energieflüsse im Haus und steuert Speicher, Wallbox, Wärmepumpe und weitere Verbraucher so, dass möglichst viel Solarstrom selbst genutzt wird.**",
    "Sinnvoll wird es, sobald **mehr als ein großer flexibler Verbraucher** vorhanden ist – typischerweise PV mit Speicher plus E-Auto oder Wärmepumpe.",
    `Seit 2024 gilt § 14a EnWG: Neue Wärmepumpen und Wallboxen über ${kw(P14A.drosselungKw)} dürfen vom Netzbetreiber bei Engpässen gedimmt werden. Ein EMS kann mehrere Geräte **gemeinsam** steuern und die Mindestleistung sinnvoll verteilen.`,
    "Wichtige Schnittstellen 2026: **SG Ready** und zunehmend **EEBus** für Wärmepumpen, **OCPP** oder Herstellerprotokolle für Wallboxen, **Modbus/SunSpec** für Wechselrichter und Speicher.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist ein Energiemanagementsystem?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Energiemanagementsystem für Photovoltaik – kurz HEMS (Home Energy Management System) – ist die Steuerzentrale für Strom im Haus.** Es erfasst über Zähler und Wechselrichter, wie viel Solarstrom gerade erzeugt, verbraucht, gespeichert und eingespeist wird, und entscheidet laufend, welches Gerät den Überschuss bekommt: Speicher, E-Auto, Wärmepumpe oder Heizstab.",
        },
        {
          typ: "p",
          text: `Der wirtschaftliche Kern ist derselbe wie beim Eigenverbrauch insgesamt: Jede Kilowattstunde, die im Haus bleibt, spart rund ${ctStr(SOLAR.strompreis)} ct Netzstrom statt ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct Vergütung zu bringen. Ein HEMS macht daraus ein System, das nicht nur auf den Moment reagiert, sondern mit Wetterprognosen, Stromtarifen und Netzbetreibersignalen plant. Grundbegriffe erklärt das Lexikon unter [Energiemanagementsystem](/wissen/lexikon#energiemanagementsystem).`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Brauche ich überhaupt ein eigenes HEMS?",
          text: "Nicht immer. Wer nur PV und Speicher hat, ist mit dem Energiemanagement im Hybridwechselrichter gut versorgt. Wer eine Wallbox mit Überschussladen ergänzt, kommt oft mit deren eingebauter PV-Funktion aus. Ein übergreifendes HEMS lohnt sich, wenn **mehrere große Verbraucher** um den Überschuss konkurrieren, ein dynamischer Tarif genutzt oder die Steuerung nach § 14a EnWG gebündelt werden soll.",
        },
      ],
    },
    {
      id: "funktionen",
      titel: "Was ein HEMS 2026 können sollte",
      tocLabel: "Funktionen",
      bloecke: [
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Überschusssteuerung", text: "Verteilt Solarüberschuss nach Prioritäten, etwa: erst Haushalt, dann Wärmepumpe, dann Speicher, dann E-Auto – oder umgekehrt, je nach Tageszeit und Ladestand." },
            { titel: "Prognosen", text: "Nutzt Wetter- und Verbrauchsprognosen, damit der Speicher nicht vormittags voll ist und mittags abgeregelt werden muss." },
            { titel: "Dynamische Tarife", text: "Legt Netzbezug in günstige Stunden, zum Beispiel das Laden des E-Autos in der Nacht oder die Wärmepumpe in Preistäler." },
            { titel: "§ 14a EnWG", text: "Setzt Steuersignale des Netzbetreibers um und verteilt die zulässige Mindestleistung auf mehrere Geräte." },
            { titel: "Lastmanagement", text: "Verhindert, dass Wallbox, Wärmepumpe und Herd gleichzeitig den Hausanschluss überlasten." },
            { titel: "Monitoring", text: "Zeigt Erzeugung, Verbrauch und Einsparung übersichtlich an und meldet Störungen." },
          ],
        },
        {
          typ: "p",
          text: "Zusätzlich an Bedeutung gewonnen hat die **Einspeisebegrenzung**: Neue Anlagen unter 25 kW dürfen nach dem [Solarspitzengesetz](/ratgeber/solarspitzengesetz) ohne intelligentes Messsystem mit Steuerungseinrichtung nur 60 % ihrer Leistung einspeisen, und in Stunden mit negativen Börsenstrompreisen entfällt die Vergütung. Ein HEMS kann Speicher und Verbraucher gezielt in diese Stunden legen, statt Ertrag abzuregeln. Wie die Überschusssteuerung konkret beim E-Auto funktioniert, erklärt der Ratgeber [PV-Überschussladen](/ratgeber/pv-ueberschussladen).",
        },
      ],
    },
    {
      id: "arten",
      titel: "Welche Arten von Energiemanagementsystemen gibt es?",
      tocLabel: "Systemarten",
      bloecke: [
        {
          typ: "p",
          text: "**Grob unterscheiden sich HEMS danach, ob sie Teil eines Hersteller-Ökosystems sind oder Geräte verschiedener Marken verbinden.** Beides kann richtig sein – entscheidend ist, welche Geräte Sie haben und künftig anschaffen wollen.",
        },
        {
          typ: "tabelle",
          caption: "Arten von Energiemanagementsystemen im Überblick (Stand September 2026)",
          kopf: ["Art", "Stärken", "Grenzen", "Passt zu"],
          zeilen: [
            ["EMS im Wechselrichter/Speicher", "ohne Zusatzhardware, gut abgestimmt, App inklusive", "fremde Wallboxen und Wärmepumpen oft nur eingeschränkt", "Neuanlage mit Geräten eines Herstellers"],
            ["Herstellerunabhängige HEMS-Box", "breite Gerätelisten, zentrale Steuerung, oft § 14a-fähig", "Zusatzkosten, teils Abo; Kompatibilität je Gerät prüfen", "gemischte Bestandsanlagen, mehrere Verbraucher"],
            ["Open-Source- und Smart-Home-Lösungen", "flexibel, lokal betreibbar, geringe Lizenzkosten", "Einrichtung und Pflege erfordern Know-how, keine Herstellergarantie", "technisch versierte Nutzer"],
            ["Überschussfunktion einzelner Geräte", "einfach, oft bereits vorhanden", "keine Koordination mehrerer Verbraucher", "PV + ein großer Verbraucher"],
          ],
          minBreite: 680,
          fussnote: "Einordnung ohne Anspruch auf Vollständigkeit. Kompatibilität immer anhand der aktuellen Geräteliste des Anbieters prüfen.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Partner-Systeme, neutrale Auswahl",
          text: "Ökovolt ist Partner von Sigenergy, Huawei (FusionSolar), Fronius, Solis und meteocontrol – deren Systeme bringen eigene Energiemanagement- und Monitoringfunktionen mit. Welche Lösung passt, hängt davon ab, welche Wallbox und Wärmepumpe Sie haben oder planen. Wir prüfen die Kompatibilität vor dem Angebot. Mehr zum vernetzten [Smart Energy Home](/produkte/smartenergyhome).",
        },
      ],
    },
    {
      id: "standards",
      titel: "Schnittstellen und Standards: SG Ready, EEBus, OCPP & Co.",
      tocLabel: "Standards",
      bloecke: [
        {
          typ: "p",
          text: "**Ein HEMS ist nur so gut wie seine Verbindungen zu den Geräten.** Die wichtigsten Standards im Einfamilienhaus – Begriffe wie [OCPP](/wissen/lexikon#ocpp) oder [Steuerbox](/wissen/lexikon#steuerbox) erklärt auch unser Lexikon:",
        },
        {
          typ: "tabelle",
          caption: "Wichtige Schnittstellen für das Energiemanagement im Haus",
          kopf: ["Standard", "Wofür", "Wie es funktioniert", "Einordnung 2026"],
          zeilen: [
            ["SG Ready", "Wärmepumpe", "zwei Schaltkontakte, vier Betriebszustände (Sperre, Normal, Verstärkt, Anlaufbefehl)", "weit verbreitet, aber grob; für neue BEG-Förderung allein nicht mehr ausreichend"],
            ["EEBus", "Wärmepumpe, Wallbox, Steuerbox", "herstellerübergreifende digitale Kommunikation mit Leistungsvorgaben und Rückmeldungen", "wichtiger Standard für § 14a und künftige Förderanforderungen"],
            ["Modbus TCP / SunSpec", "Wechselrichter, Speicher, Zähler", "Messwerte auslesen, Lade- und Einspeiseleistung vorgeben", "Standard im PV-Bereich, Registerbelegung je Hersteller prüfen"],
            ["OCPP", "Wallbox", "offenes Protokoll zwischen Ladestation und Steuerung bzw. Backend", "verbreitet; nicht jede Wallbox erlaubt lokale Steuerung"],
            ["ISO 15118", "E-Auto ↔ Wallbox", "digitale Kommunikation mit dem Fahrzeug, Grundlage für bidirektionales Laden", "wachsende Bedeutung"],
            ["Herstellerprotokolle / Cloud-APIs", "alle Geräte", "Anbindung über Hersteller-Cloud oder lokale Schnittstellen", "funktioniert oft gut, macht aber abhängig vom Anbieter"],
          ],
          minBreite: 720,
          fussnote: "Stand September 2026. Welche Protokolle ein Gerät unterstützt, steht im Datenblatt oder in der Kompatibilitätsliste des HEMS-Anbieters.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Neu seit 21. Juli 2026: digitale Schnittstelle für geförderte Wärmepumpen",
          text: "Mit der überarbeiteten BEG-Richtlinie (Einzelmaßnahmen, KfW 458) müssen neu geförderte Wärmepumpen eine digitale Schnittstelle zur netzorientierten Steuerung und zur Anbindung an ein intelligentes Messsystem mit Steuerungseinrichtung haben. Eine reine SG-Ready-Relaisschnittstelle reicht dafür nicht mehr. Ab dem 1. Juli 2027 soll die Schnittstelle zudem dem europäischen Code of Conduct für Energy Smart Appliances entsprechen, etwa über EEBus. Details im Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
        },
      ],
    },
    {
      id: "paragraf-14a",
      titel: "§ 14a EnWG: Warum ein EMS bei mehreren Geräten Vorteile hat",
      tocLabel: "§ 14a EnWG",
      bloecke: [
        {
          typ: "p",
          text: `**Seit dem 1. Januar 2024 dürfen Netzbetreiber neue steuerbare Verbrauchseinrichtungen – Wärmepumpen, private Wallboxen, Klimaanlagen und Speicher mit mehr als ${kw(P14A.drosselungKw)} Anschlussleistung – bei drohender Netzüberlastung vorübergehend dimmen.** Abgeschaltet wird nicht: Jede Einrichtung behält mindestens ${kw(P14A.drosselungKw)}. Im Gegenzug sinken die Netzentgelte. Die Details erklärt der Ratgeber [§ 14a EnWG](/ratgeber/paragraf-14a-enwg).`,
        },
        {
          typ: "liste",
          punkte: [
            `**Modul 1:** pauschale Reduzierung des Netzentgelts, je nach Netzgebiet rund ${P14A.ersparnisVon} bis ${P14A.ersparnisBis} € pro Jahr.`,
            "**Modul 2:** reduzierter Arbeitspreis des Netzentgelts für separat gemessene Verbrauchseinrichtungen (eigener Zähler nötig).",
            "**Modul 3:** zeitvariable Netzentgelte seit April 2025, nur in Kombination mit Modul 1.",
          ],
        },
        {
          typ: "p",
          text: "Werden mehrere Geräte **direkt** gesteuert, darf jedes einzeln auf 4,2 kW gedimmt werden. Werden sie **über ein Energiemanagementsystem** gesteuert, gibt der Netzbetreiber eine gemeinsame Mindestleistung für den Netzanschluss vor, die das EMS frei verteilen kann. Sie berechnet sich nach der Festlegung der Bundesnetzagentur so: 4,2 kW + (Anzahl der Geräte − 1) × Gleichzeitigkeitsfaktor × 4,2 kW.",
        },
        {
          typ: "tabelle",
          caption: "Gemeinsame Mindestleistung bei Steuerung über ein EMS nach § 14a EnWG",
          kopf: ["Steuerbare Geräte", "Gleichzeitigkeitsfaktor", "Mindestleistung gesamt"],
          zeilen: GZF.map(({ n, f }) => [
            typeof n === "number" ? `${n} Geräte` : `${n} Geräte`,
            f.toLocaleString("de-DE", { minimumFractionDigits: 2 }),
            typeof n === "number" ? kw(minLeistung(n, f)) : "4,2 kW + (n − 1) × 0,45 × 4,2 kW",
          ]),
          hervorheben: 2,
          markierteZeile: 1,
          fussnote: "Nach BNetzA-Festlegung BK6-22-300. Bei Wärmepumpen und Klimaanlagen über 11 kW gilt statt 4,2 kW ein Wert von 40 % der Anschlussleistung. Maßgeblich sind die Vorgaben Ihres Netzbetreibers.",
        },
        {
          typ: "p",
          text: "Ein Beispiel: Wärmepumpe, Wallbox und Speicher im selben Haus ergeben bei EMS-Steuerung zusammen mindestens 10,5 kW. Das EMS kann im Dimmfall entscheiden, ob die Wärmepumpe weiterläuft und das Auto langsamer lädt – statt jedes Gerät starr auf 4,2 kW zu begrenzen. Voraussetzung für die Steuerung ist in der Regel ein [intelligentes Messsystem](/ratgeber/smart-meter-pflicht) mit Steuerbox.",
        },
      ],
    },
    {
      id: "tarife",
      titel: "Energiemanagement und dynamische Stromtarife",
      tocLabel: "Dynamische Tarife",
      bloecke: [
        {
          typ: "p",
          text: "**Seit dem 1. Januar 2025 müssen alle Stromlieferanten ihren Kunden mit intelligentem Messsystem einen dynamischen Tarif anbieten (§ 41a EnWG).** Der Preis folgt dann stündlich oder viertelstündlich der Strombörse. Ein HEMS kann das nutzen: E-Auto und Wärmepumpe laufen bevorzugt in günstigen Stunden, und im Winter kann der Speicher nachts preiswerten Netzstrom aufnehmen.",
        },
        {
          typ: "p",
          text: "Die HTW Berlin mahnt in der Stromspeicher-Inspektion 2026 zur Vorsicht beim Netzladen des Speichers: Bei einem Preisunterschied von 10 ct je kWh muss das System mindestens rund 71 % Wirkungsgrad für den Weg vom Netz über die Batterie ins Haus erreichen, sonst geht der Vorteil in Verlusten unter. Für E-Auto und Wärmepumpe gilt diese Einschränkung nicht, weil der Strom direkt genutzt wird.",
        },
        { typ: "tool", href: "/rechner/dynamischer-stromtarif", titel: "Lohnt sich ein dynamischer Tarif für Sie?", text: "Mit echten Börsenpreisen: Festpreis und dynamischer Tarif für Haushalt, E-Auto und Wärmepumpe im Vergleich.", label: "Zum Tarif-Rechner" },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet ein Energiemanagementsystem – und lohnt es sich?",
      tocLabel: "Kosten & Nutzen",
      bloecke: [
        {
          typ: "p",
          text: "**Die Verbraucherzentrale nennt für ein HEMS Kosten von einigen hundert bis über 1.000 Euro, gegebenenfalls zuzüglich laufender Gebühren für Cloud-Dienste.** Ist das Energiemanagement bereits im Wechselrichter oder Speicher enthalten, fallen oft nur Kosten für zusätzliche Zähler oder Lizenzen an. Hinzu kommt die Installation im Zählerschrank durch einen Elektrofachbetrieb.",
        },
        {
          typ: "p",
          text: "Der Nutzen hängt davon ab, wie viel flexibler Verbrauch vorhanden ist. In unserer Simulation im Ratgeber [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen) nutzt ein Haushalt mit E-Auto und Wärmepumpe durch koordinierte Steuerung einige hundert Kilowattstunden mehr Solarstrom selbst; zusammen mit einem Speicher sind es mehrere tausend. Hinzu kommen mögliche Ersparnisse durch dynamische Tarife und die Netzentgeltreduzierung nach § 14a.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Förderung prüfen",
          text: "Digitale Systeme zur energetischen Betriebs- und Verbrauchsoptimierung können im Rahmen der Bundesförderung für effiziente Gebäude (BAFA, Einzelmaßnahmen Anlagentechnik) förderfähig sein. Endgeräte wie Tablets sind ausgeschlossen, und der Antrag muss vor Vertragsabschluss gestellt werden. Die aktuellen Bedingungen zeigt der [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "auswahl",
      titel: "Checkliste: So wählen Sie das passende HEMS",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "**Kompatibilität:** Stehen Wechselrichter, Speicher, Wallbox und Wärmepumpe auf der Geräteliste – mit welchen Funktionen?",
            "**§ 14a-fähig:** Kann das System Steuersignale der Steuerbox umsetzen (Relais oder EEBus)?",
            "**Lokale Steuerung:** Funktioniert die Regelung auch bei Internetausfall, oder hängt alles an der Cloud?",
            "**Prognosen und Tarife:** Werden Wetterprognosen und dynamische Strompreise berücksichtigt?",
            "**Datenschutz:** Wo werden Daten verarbeitet? Die Verbraucherzentrale empfiehlt bei Cloud-Diensten Server in Deutschland oder der EU.",
            "**Offenheit:** Gibt es Schnittstellen oder Datenexport, falls später Geräte anderer Hersteller dazukommen?",
            "**Laufende Kosten und Updates:** Gibt es Abogebühren? Wie lange liefert der Anbieter Updates?",
          ],
        },
        {
          typ: "ablauf",
          schritte: [
            ["Bestand erfassen", "Welche Geräte sind vorhanden, welche geplant (E-Auto, Wärmepumpe, Speicher)? Welche Schnittstellen haben sie?"],
            ["Ziele festlegen", "Mehr Eigenverbrauch, günstiger Netzstrom über dynamischen Tarif, § 14a-Rabatt oder alles zusammen?"],
            ["System auswählen", "Hersteller-EMS oder herstellerunabhängige Lösung – anhand der Checkliste oben."],
            ["Installation und Einrichtung", "Zähler, Kommunikation und Prioritäten vom Fachbetrieb einrichten lassen und nach einigen Wochen anhand der Monitoringdaten nachjustieren."],
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Was macht ein Energiemanagementsystem bei Photovoltaik?", a: "Es misst Erzeugung, Verbrauch und Einspeisung und steuert flexible Verbraucher wie Speicher, Wallbox und Wärmepumpe so, dass möglichst viel Solarstrom im Haus genutzt wird. Moderne Systeme berücksichtigen dabei Wetterprognosen, dynamische Tarife und Steuersignale nach § 14a EnWG." },
    { q: "Brauche ich ein Energiemanagementsystem?", a: "Bei PV mit Speicher reicht meist das integrierte Energiemanagement des Wechselrichters. Ein eigenes HEMS lohnt sich, wenn mehrere große Verbraucher wie E-Auto und Wärmepumpe koordiniert werden sollen oder ein dynamischer Tarif genutzt wird." },
    { q: "Was kostet ein HEMS?", a: "Laut Verbraucherzentrale einige hundert bis über 1.000 Euro, eventuell zuzüglich Cloud-Gebühren. Ist die Funktion im Wechselrichter oder Speicher enthalten, sind die Zusatzkosten oft gering. Hinzu kommt die Installation durch einen Elektrofachbetrieb." },
    { q: "Was ist der Unterschied zwischen SG Ready und EEBus?", a: "SG Ready schaltet eine Wärmepumpe über zwei Kontakte in vier grobe Betriebszustände. EEBus ist ein digitales Protokoll, das Leistungsvorgaben und Rückmeldungen herstellerübergreifend austauscht. Für neu geförderte Wärmepumpen reicht SG Ready allein seit dem 21. Juli 2026 nicht mehr aus." },
    { q: "Ist ein Energiemanagementsystem für § 14a EnWG Pflicht?", a: `Nein. Der Netzbetreiber kann Geräte auch einzeln über die Steuerbox auf ${kw(P14A.drosselungKw)} dimmen. Ein EMS hat aber Vorteile: Bei mehreren Geräten gilt eine gemeinsame Mindestleistung, die das EMS flexibel verteilen kann.` },
    { q: "Funktioniert ein HEMS mit Geräten verschiedener Hersteller?", a: "Das hängt vom System ab. Herstellerunabhängige HEMS unterstützen viele Marken über Standards wie EEBus, Modbus, SunSpec oder OCPP. Prüfen Sie vor dem Kauf die aktuelle Kompatibilitätsliste – und welche Funktionen je Gerät tatsächlich unterstützt werden." },
  ],

  passend: [
    { href: "/ratgeber/eigenverbrauch-erhoehen", titel: "Eigenverbrauch erhöhen", text: "10 Maßnahmen mit simulierter Wirkung." },
    { href: "/ratgeber/paragraf-14a-enwg", titel: "§ 14a EnWG erklärt", text: "Module, Rabatte und Dimmung im Detail." },
    { href: "/produkte/smartenergyhome", titel: "Smart Energy Home", text: "PV, Speicher, Wallbox und Wärmepumpe vernetzt." },
    { href: "/rechner/dynamischer-stromtarif", titel: "Dynamischer-Tarif-Rechner", text: "Mit echten Börsenpreisen rechnen." },
  ],

  quellen: [
    { titel: "Verbraucherzentrale – Energiemanagementsystem für zu Hause", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/energiemanagementsystem-fuer-zu-hause-mehr-eigenen-strom-selber-nutzen-48095", stand: "09/2026" },
    { titel: "Bundesnetzagentur – Integration steuerbarer Verbrauchseinrichtungen (§ 14a EnWG)", url: "https://www.bundesnetzagentur.de/DE/Vportal/Energie/SteuerbareVBE/artikel.html", stand: "09/2026" },
    { titel: "Verbraucherzentrale Energieberatung – Steuerbare Verbrauchseinrichtung", url: "https://verbraucherzentrale-energieberatung.de/erneuerbare-energien/photovoltaik/steuerbare-verbrauchseinrichtung/", stand: "09/2026" },
    { titel: "§ 41a EnWG – Dynamische Stromtarife", url: "https://www.gesetze-im-internet.de/enwg_2005/__41a.html", stand: "09/2026" },
    { titel: "HTW Berlin – Stromspeicher-Inspektion 2026", url: "https://solar.htw-berlin.de/studien/stromspeicher-inspektion-2026/", stand: "09/2026" },
    { titel: "BWP – SG Ready-Label und Schnittstellenbeschreibung", url: "https://www.waermepumpe.de/normen-technik/sg-ready/", stand: "09/2026" },
    { titel: "ADAC – Neue Konditionen für die Wärmepumpen-Förderung seit 21. Juli 2026", url: "https://www.adac.de/rund-ums-haus/energie/versorgung/waermepumpe-foerderung/", stand: "09/2026" },
  ],

  seitenCta: { titel: "Welche Steuerung passt?", text: "Dynamischer Tarif, E-Auto und Wärmepumpe mit echten Preisen durchrechnen.", href: "/rechner/dynamischer-stromtarif", label: "Tarif-Rechner" },
  cta: {
    title: "Alle Geräte, eine Steuerung.",
    text: "Wir planen PV-Anlage, Speicher, Wallbox, Wärmepumpe und Energiemanagement so, dass sie zusammenarbeiten – kompatibel, § 14a-fähig und herstellerneutral beraten.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Smart Energy Home", href: "/produkte/smartenergyhome" },
  },
};

export default artikel;
