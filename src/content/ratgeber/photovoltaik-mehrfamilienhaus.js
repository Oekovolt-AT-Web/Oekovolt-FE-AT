// Ratgeber: Photovoltaik im Mehrfamilienhaus – Gemeinschaftliche
// Gebäudeversorgung (§ 42b EnWG) vs. Mieterstrom, WEG-Beschluss, Messkonzept.
// Rechenbeispiel mit dem Rechenkern des Solarrechners (grobe Orientierung).

import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { WALLBOX } from "@/data/wallbox";
import { berechne, mischSatz } from "@/lib/solarrechner";

const eur = (n) => Math.round(n / 10) * 10 === 0 ? "0 €" : (Math.round(n / 10) * 10).toLocaleString("de-DE") + " €";
const kwh = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE") + " kWh";
const ctStr = (n) => n.toFixed(2).replace(".", ",");

// Mieterstromzuschlag für Inbetriebnahme ab 01.08.2026 (wie /produkte/mieterstrom)
const ZUSCHLAG = { bis10: 2.51, bis40: 2.33, bis1000: 1.57 };

// Beispielgebäude
const WE = 8;
const VERBRAUCH_WE = 2500;
const ALLGEMEIN = 2000;
const KWP = 30;
const PREIS_CT = 26; // Solarstrompreis im Haus (Beispiel, wie Rechenbeispiel auf /produkte/mieterstrom)
const VERBRAUCH = WE * VERBRAUCH_WE + ALLGEMEIN;

const HAUS = berechne({ kwp: KWP, ausrichtung: "sued", neigung: "mittel", verbrauch: VERBRAUCH, speicherKwh: 0 });
const NUR_ALLG = berechne({ kwp: KWP, ausrichtung: "sued", neigung: "mittel", verbrauch: ALLGEMEIN, speicherKwh: 0 });
const SATZ_TEIL = mischSatz(KWP, "teileinspeisung");
const SATZ_VOLL = mischSatz(KWP, "volleinspeisung");
const ZUSCHLAG_MIX = (10 * ZUSCHLAG.bis10 + (KWP - 10) * ZUSCHLAG.bis40) / KWP;

const einspeisung = (r) => ((r.jahresertrag - r.eigenverbrauch) * SATZ_TEIL) / 100;
const V_VOLL = (HAUS.jahresertrag * SATZ_VOLL) / 100;
const V_ALLG = NUR_ALLG.eigenverbrauch * ANNAHMEN.strompreis + einspeisung(NUR_ALLG);
const V_GGV = (HAUS.eigenverbrauch * PREIS_CT) / 100 + einspeisung(HAUS);
const V_MS = (HAUS.eigenverbrauch * (PREIS_CT + ZUSCHLAG_MIX)) / 100 + einspeisung(HAUS);
const MIETER_ERSPARNIS = ((HAUS.eigenverbrauch / VERBRAUCH) * VERBRAUCH_WE * (ANNAHMEN.strompreis * 100 - PREIS_CT)) / 100;

const artikel = {
  slug: "photovoltaik-mehrfamilienhaus",
  title: "Photovoltaik im Mehrfamilienhaus: Mieterstrom oder Gebäudeversorgung?",
  seoTitle: "Photovoltaik Mehrfamilienhaus: GGV & Mieterstrom | Ökovolt",
  kurzTitel: "PV im Mehrfamilienhaus",
  description:
    "Photovoltaik im Mehrfamilienhaus 2026: Gebäudeversorgung nach § 42b EnWG vs. Mieterstrom, WEG-Beschluss, Messkonzept, Steuern und Rechenbeispiel.",
  excerpt:
    "Solarstrom für alle Parteien: Welches Modell passt zu Vermietern und Eigentümergemeinschaften, was muss gemessen werden, und was bleibt am Ende wirklich übrig?",
  hauptKeyword: "photovoltaik mehrfamilienhaus",
  keywords: ["PV-Anlage Mehrfamilienhaus", "Gemeinschaftliche Gebäudeversorgung", "§ 42b EnWG", "Mieterstrom 2026", "Photovoltaik WEG Beschluss", "Messkonzept Mehrfamilienhaus", "Solaranlage Mehrparteienhaus"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Förderung, Steuern & Recht",
  bild: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg",
  bildAlt: "Mehrparteienhäuser mit Photovoltaikmodulen auf den Dächern",
  badge: { wert: "§ 42b EnWG", text: "Solarstrom teilen ohne Pflicht zur Vollversorgung" },

  kurzFazit: [
    "**Für Mehrfamilienhäuser gibt es 2026 vier Wege:** Solarstrom nur für Allgemeinstrom nutzen, voll einspeisen, die gemeinschaftliche Gebäudeversorgung nach § 42b EnWG oder klassischen Mieterstrom.",
    "**Die gemeinschaftliche Gebäudeversorgung (GGV)** ist meist die schlankere Lösung: Solarstrom wird nach Schlüssel verteilt, den Reststrom kauft jeder Haushalt weiter bei seinem eigenen Lieferanten.",
    `**Mieterstrom** bringt zusätzlich den Mieterstromzuschlag (ab 08/2026 bis ${ctStr(ZUSCHLAG.bis10)} ct/kWh), verlangt aber Vollversorgung, eine Preisgrenze von 90 % des Grundversorgungstarifs und mehr Bürokratie.`,
    "Beide Modelle brauchen eine **viertelstündliche Messung** – in der Praxis intelligente Messsysteme für die teilnehmenden Wohnungen. In der Eigentümergemeinschaft genügt für die Anlage ein **Mehrheitsbeschluss**.",
  ],

  abschnitte: [
    {
      id: "modelle",
      titel: "Welche Modelle gibt es für Photovoltaik im Mehrfamilienhaus?",
      tocLabel: "Die vier Modelle",
      bloecke: [
        {
          typ: "p",
          text: "**Eine PV-Anlage auf dem Mehrfamilienhaus kann den Strom einspeisen, den Allgemeinstrom decken oder direkt an die Bewohner weitergeben – über die gemeinschaftliche Gebäudeversorgung oder über Mieterstrom.** Welches Modell passt, hängt von Gebäudegröße, Eigentümerstruktur und davon ab, wie viel Aufwand Sie für Messung und Abrechnung übernehmen wollen.",
        },
        {
          typ: "tabelle",
          caption: "Photovoltaik im Mehrfamilienhaus: die Modelle im Vergleich, Stand September 2026",
          kopf: ["", "Allgemeinstrom + Überschuss", "Volleinspeisung", "Gebäudeversorgung (§ 42b EnWG)", "Mieterstrom (§ 42a EnWG)"],
          zeilen: [
            ["Wer nutzt den Solarstrom?", "Treppenhaus, Aufzug, Heizung, Wallboxen der Gemeinschaft", "niemand im Haus", "teilnehmende Wohnungen nach Schlüssel", "teilnehmende Wohnungen"],
            ["Reststrom", "–", "–", "jeder Haushalt beim eigenen Lieferanten", "vom Mieterstromanbieter (Vollversorgung)"],
            ["Preis für Bewohner", "–", "–", "frei vereinbar, kein Preisdeckel", "höchstens 90 % des Grundversorgungstarifs"],
            ["Förderung", "EEG-Vergütung für Überschuss", "erhöhte EEG-Vergütung", "EEG-Vergütung für Überschuss", "EEG-Vergütung + Mieterstromzuschlag"],
            ["Lieferantenpflichten", "keine", "keine", "stark reduziert", "weitgehend wie ein Stromlieferant"],
            ["Messaufwand", "gering", "gering", "viertelstündlich je Teilnehmer", "viertelstündlich, Summenzähler-Konzept"],
            ["Passt für", "jedes MFH, Einstieg", "wenig Verbrauch im Haus", "kleine bis mittlere MFH, WEG", "größere Objekte, mit Dienstleister"],
          ],
          minBreite: 820,
          fussnote: "Vereinfachte Übersicht. Kombinationen sind möglich, etwa Allgemeinstrom plus Gebäudeversorgung. Die Pflichten im Einzelfall hängen vom Netzbetreiber und vom Messkonzept ab.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Einfachster Einstieg: der Allgemeinstrom",
          text: "Wer den Aufwand scheut, kann den Solarstrom zunächst für Treppenhauslicht, Aufzug, Pumpen und eine zentrale [Wärmepumpe](/produkte/warmepumpe) nutzen. Das ist wie beim Einfamilienhaus: ein Zähler, kein Vertrag mit den Bewohnern. Auch gemeinschaftliche Wallboxen in der Tiefgarage passen gut dazu – das Bundesprogramm „Laden im Mehrparteienhaus“ fördert sie noch bis zum " + WALLBOX.mfhProgramm.bis + ".",
        },
      ],
    },
    {
      id: "ggv",
      titel: "Gemeinschaftliche Gebäudeversorgung nach § 42b EnWG",
      tocLabel: "Gebäudeversorgung (GGV)",
      bloecke: [
        {
          typ: "p",
          text: "**Bei der gemeinschaftlichen Gebäudeversorgung wird der Solarstrom vom Dach nach einem vereinbarten Schlüssel auf die teilnehmenden Wohnungen verteilt, ohne dass der Betreiber zum Vollversorger wird.** Das Modell gibt es seit dem Solarpaket I (Mai 2024). Jeder Haushalt behält seinen normalen Stromvertrag für den Reststrom; der Betreiber muss nur informieren, dass der Solarstrom den Bedarf nicht vollständig deckt.",
        },
        { typ: "h3", text: "Voraussetzungen nach § 42b Abs. 1 EnWG" },
        {
          typ: "checkliste",
          punkte: [
            "**Gebäudestromanlage** auf, an oder in dem Gebäude bzw. seinen Nebenanlagen (z. B. Garage)",
            "**Keine Durchleitung durch das öffentliche Netz** – verbraucht wird im selben Gebäude, direkt oder nach Zwischenspeicherung",
            "**Viertelstündliche Messung** der Strombezugsmengen der Teilnehmer",
            "**Gebäudestromnutzungsvertrag** mit Aufteilungsschlüssel, Entgelt in ct/kWh sowie Regeln zu Betrieb und Wartung",
          ],
        },
        {
          typ: "p",
          text: "Der Aufteilungsschlüssel kann statisch (feste Anteile) oder dynamisch (nach tatsächlichem Verbrauch je Viertelstunde) sein. Ist nichts wirksam vereinbart, wird im Zweifel zu gleichen Teilen verteilt. Einen Preisdeckel für den Solarstrom gibt es bei der GGV nicht – damit Bewohner mitmachen, sollte er aber spürbar unter ihrem Haushaltstarif liegen. Überschüsse speist die Anlage ins Netz ein und erhält dafür die [Einspeisevergütung](/ratgeber/einspeiseverguetung-2026).",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Teilnahme ist freiwillig",
          text: "Niemand kann zur Teilnahme verpflichtet werden, und das Recht, den Reststrom bei einem Lieferanten der eigenen Wahl zu beziehen, darf der Vertrag nicht einschränken (§ 42b Abs. 3 EnWG). In Eigentümergemeinschaften kann die Nutzung nach § 42b Abs. 6 EnWG auch per Beschluss nach dem Wohnungseigentumsgesetz geregelt werden.",
        },
        {
          typ: "p",
          text: "Ehrlich gesagt ist die GGV in der Praxis noch jung: Die Verbraucherzentrale NRW stellte im September 2025 fest, dass frei verfügbare Dienstleistungen für Messung und Abrechnung am Markt erst entstehen. Wer heute plant, sollte früh mit Netzbetreiber und Messstellenbetreiber klären, welches Messkonzept akzeptiert wird.",
        },
      ],
    },
    {
      id: "mieterstrom",
      titel: "Mieterstrom: Mehr Förderung, mehr Pflichten",
      tocLabel: "Mieterstrom",
      bloecke: [
        {
          typ: "p",
          text: "**Beim Mieterstrom liefert der Anbieter den Solarstrom direkt an die Bewohner und übernimmt zusätzlich die Versorgung mit Reststrom – dafür gibt es den Mieterstromzuschlag nach § 21 Abs. 3 EEG.** Der Anbieter kann der Vermieter selbst oder ein spezialisierter Dienstleister sein. Die Regeln für Mieterstromverträge stehen in § 42a EnWG.",
        },
        {
          typ: "tabelle",
          caption: "Mieterstromzuschlag für Anlagen mit Inbetriebnahme ab 1. August 2026",
          kopf: ["Anlagenteil", "Zuschlag je gelieferter kWh", "Zum Vergleich: Einspeisevergütung (Teileinspeisung)"],
          zeilen: [
            ["bis 10 kWp", `${ctStr(ZUSCHLAG.bis10)} ct`, `${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct`],
            ["über 10 bis 40 kWp", `${ctStr(ZUSCHLAG.bis40)} ct`, `${ct(VERGUETUNG.saetze[1].teileinspeisung)} ct`],
            ["über 40 kWp bis 1 MW", `${ctStr(ZUSCHLAG.bis1000)} ct`, `${ct(VERGUETUNG.saetze[2].teileinspeisung)} ct (bis 100 kWp)`],
          ],
          hervorheben: 1,
          fussnote: "Sätze anteilig je Leistungsstufe, fest für 20 Jahre ab Inbetriebnahme; halbjährliche Degression. Quelle: Bundesnetzagentur. Der Zuschlag wird zusätzlich zum Strompreis für den im Haus gelieferten Solarstrom gezahlt.",
        },
        { typ: "h3", text: "Die wichtigsten Pflichten nach § 42a EnWG" },
        {
          typ: "liste",
          punkte: [
            "**Vollversorgung:** Der Vertrag muss die Belieferung auch für Zeiten ohne Solarstrom umfassen.",
            "**Preisobergrenze:** Mieter- und Reststrom zusammen dürfen höchstens 90 % des örtlichen Grundversorgungstarifs kosten.",
            "**Kopplungsverbot:** Der Stromvertrag darf nicht Teil des Wohnungsmietvertrags sein.",
            "**Laufzeit:** höchstens zwei Jahre Erstlaufzeit; der Vertrag endet automatisch mit dem Mietverhältnis.",
            "**Lieferantenpflichten:** Rechnungsstellung, Stromkennzeichnung und Meldungen wie bei einem Energieversorger.",
          ],
        },
        {
          typ: "p",
          text: "Wegen dieser Pflichten lohnt sich klassischer Mieterstrom vor allem bei größeren Objekten oder wenn ein Dienstleister Lieferung und Abrechnung vollständig übernimmt. Seit dem Solarpaket I kann der Zuschlag auch für Gewerbegebäude und Nebenanlagen genutzt werden, sofern der Strom ohne Netzdurchleitung verbraucht wird. Mehr zu beiden Varianten und unserem Projektablauf finden Sie auf der Seite [Mieterstrom](/produkte/mieterstrom).",
        },
      ],
    },
    {
      id: "rechenbeispiel",
      titel: "Rechenbeispiel: 8 Wohnungen, 30 kWp",
      tocLabel: "Rechenbeispiel",
      bloecke: [
        {
          typ: "p",
          text: `**Im Beispiel bringen Gebäudeversorgung und Mieterstrom vor Kosten für Messung und Abrechnung nur etwas mehr als die Volleinspeisung – der eigentliche Gewinn liegt bei den Bewohnern.** Angenommen ist ein Mehrfamilienhaus mit ${WE} Wohnungen à ${VERBRAUCH_WE.toLocaleString("de-DE")} kWh, ${ALLGEMEIN.toLocaleString("de-DE")} kWh Allgemeinstrom und einer ${KWP}-kWp-Anlage auf dem Süddach ohne Speicher. Der Solarstrom wird im Haus für ${PREIS_CT} ct/kWh abgegeben.`,
        },
        {
          typ: "tabelle",
          caption: `Jährliche Erlöse bzw. Einsparungen einer ${KWP}-kWp-Anlage je Modell (vor Mess- und Abrechnungskosten)`,
          kopf: ["Modell", "Im Haus genutzt", "Eingespeist", "Erlös/Vorteil pro Jahr"],
          zeilen: [
            ["Volleinspeisung", "0 kWh", kwh(HAUS.jahresertrag), eur(V_VOLL)],
            ["Allgemeinstrom + Überschuss", kwh(NUR_ALLG.eigenverbrauch), kwh(NUR_ALLG.jahresertrag - NUR_ALLG.eigenverbrauch), eur(V_ALLG)],
            ["Gebäudeversorgung", kwh(HAUS.eigenverbrauch), kwh(HAUS.jahresertrag - HAUS.eigenverbrauch), eur(V_GGV)],
            ["Mieterstrom", kwh(HAUS.eigenverbrauch), kwh(HAUS.jahresertrag - HAUS.eigenverbrauch), eur(V_MS)],
          ],
          hervorheben: 3,
          minBreite: 620,
          fussnote: `Erzeugung ${kwh(HAUS.jahresertrag)} (Süddeutschland). Im Haus genutzter Anteil nach dem Rechenkern des Solarrechners (${Math.round(HAUS.autarkie * 100)} % des Hausverbrauchs), grobe Orientierung. EEG-Sätze anteilig: Teileinspeisung ${ctStr(SATZ_TEIL)} ct, Volleinspeisung ${ctStr(SATZ_VOLL)} ct, Mieterstromzuschlag ${ctStr(ZUSCHLAG_MIX)} ct. Allgemeinstrom mit ${String(Math.round(ANNAHMEN.strompreis * 1000) / 10).replace(".", ",")} ct bewertet. Beim Mieterstrom kommen Einkauf und Marge des Reststroms hinzu, bei allen Modellen Betriebskosten.`,
        },
        {
          typ: "kennzahl",
          wert: `~${eur(MIETER_ERSPARNIS)}`,
          titel: "Ersparnis je Wohnung pro Jahr",
          text: `Jede teilnehmende Wohnung bezieht im Beispiel rund ${kwh((HAUS.eigenverbrauch / VERBRAUCH) * VERBRAUCH_WE)} Solarstrom für ${PREIS_CT} ct statt rund ${String(Math.round(ANNAHMEN.strompreis * 1000) / 10).replace(".", ",")} ct/kWh.`,
        },
        {
          typ: "p",
          text: "Was lässt sich daraus ableiten? Erstens: Je höher der Verbrauch im Haus – etwa durch eine zentrale Wärmepumpe, Wallboxen oder Gewerbe im Erdgeschoss –, desto stärker lohnt sich die Weitergabe gegenüber der Einspeisung. Zweitens: Die Kosten für intelligente Messsysteme und Abrechnung entscheiden über den Gewinn. Drittens: Volleinspeisung ist die bequemste Lösung, der Vermieter verzichtet aber auf den Mehrwert für die Mieter. Die geplante EEG-Novelle soll zudem die feste Vergütung für neue kleine Anlagen ab 2027 ablösen – das Gesetzgebungsverfahren läuft noch.",
        },
        {
          typ: "tool",
          href: "/solarrechner",
          titel: "Ertrag und Eigenverbrauch Ihres Gebäudes abschätzen",
          text: "Dachfläche, Ausrichtung und Gesamtverbrauch eingeben – als erste Orientierung vor der Detailplanung.",
          label: "Zum Solarrechner",
        },
      ],
    },
    {
      id: "messkonzept",
      titel: "Messkonzept: Was im Zählerschrank passieren muss",
      tocLabel: "Messkonzept",
      bloecke: [
        {
          typ: "p",
          text: "**Gebäudeversorgung und Mieterstrom brauchen ein Messkonzept, das Erzeugung und Verbrauch jeder teilnehmenden Wohnung viertelstündlich erfasst.** In der Praxis bedeutet das ein [intelligentes Messsystem](/wissen/lexikon#imsys) je teilnehmender Wohnung sowie eine Messung der Erzeugung. Das Messkonzept muss mit dem Netzbetreiber abgestimmt werden, bevor die Anlage in Betrieb geht.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Physischer Summenzähler", text: "Ein Zähler am Hausanschluss misst den Saldo des ganzen Gebäudes, die Wohnungszähler werden darunter verrechnet. Bewährt, aber mit Umbau im Zählerschrank verbunden. Netzbetreiber verlangen je nach Anlagengröße teils auch für nicht teilnehmende Wohnungen Smart Meter." },
            { titel: "Virtueller Summenzähler", text: "Die Summe wird aus den Viertelstundenwerten der intelligenten Messsysteme berechnet. Weniger Umbau, setzt aber voraus, dass alle relevanten Zählpunkte digital und fernauslesbar sind und der Netzbetreiber das Verfahren anbietet." },
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Früh mit dem Netzbetreiber sprechen",
          text: "Netzbetreiber setzen die Messkonzepte unterschiedlich um, einige verlangen einen Vorlauf von mindestens einem vollen Kalendermonat vor Inbetriebnahme. Klären Sie Messkonzept, Zählerplätze und Zuständigkeiten deshalb schon in der Planungsphase. Die Kosten intelligenter Messsysteme sind gesetzlich gedeckelt; mehr dazu unter [Smart Meter](/produkte/smartmeter).",
        },
      ],
    },
    {
      id: "weg",
      titel: "Photovoltaik in der Eigentümergemeinschaft: Beschluss und Kosten",
      tocLabel: "WEG-Beschluss",
      bloecke: [
        {
          typ: "p",
          text: "**Eine PV-Anlage auf dem gemeinschaftlichen Dach ist eine bauliche Veränderung, die die Eigentümerversammlung mit einfacher Mehrheit beschließen kann (§ 20 Abs. 1 WEG).** Einstimmigkeit ist seit der WEG-Reform 2020 nicht mehr nötig. Wer die Kosten trägt, regelt § 21 WEG:",
        },
        {
          typ: "tabelle",
          caption: "Kostenverteilung einer PV-Anlage in der WEG nach § 21 WEG",
          kopf: ["Beschluss", "Wer zahlt?", "Wer profitiert?"],
          zeilen: [
            ["Mehr als zwei Drittel der abgegebenen Stimmen und mehr als die Hälfte der Miteigentumsanteile", "alle Eigentümer nach Miteigentumsanteilen (Ausnahme: unverhältnismäßige Kosten)", "alle Eigentümer"],
            ["Anlage amortisiert sich in angemessenem Zeitraum", "alle Eigentümer nach Miteigentumsanteilen", "alle Eigentümer"],
            ["Einfache Mehrheit ohne diese Voraussetzungen", "nur die zustimmenden Eigentümer", "nur die zahlenden Eigentümer"],
            ["Einzelner Eigentümer verlangt ein Steckersolargerät", "der verlangende Eigentümer", "der verlangende Eigentümer"],
          ],
          minBreite: 640,
          fussnote: "Vereinfachte Darstellung von §§ 20, 21 WEG. Für die Umsetzung empfiehlt sich ein Beschlussantrag mit Angebot, Wirtschaftlichkeitsrechnung, Betreibermodell und Regelung zu Wartung und Versicherung.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Betreiber festlegen:** die Gemeinschaft selbst, einzelne Eigentümer oder ein Dienstleister",
            "**Nutzungsmodell beschließen:** Allgemeinstrom, Gebäudeversorgung oder Mieterstrom",
            "**Aufteilungsschlüssel und Solarstrompreis** festlegen, auch für vermietete Wohnungen",
            "**Instandhaltung, Versicherung und Rücklage** für den Wechselrichtertausch regeln",
            "**Statik und Dachzustand** vorab prüfen lassen – idealerweise vor einer anstehenden Dachsanierung",
          ],
        },
        {
          typ: "p",
          text: "Einzelne Eigentümer oder Mieter, die nicht auf eine Gemeinschaftsanlage warten wollen, haben seit Oktober 2024 einen Anspruch auf ein Steckersolargerät am Balkon. Was ein [Balkonkraftwerk](/ratgeber/balkonkraftwerk) leisten kann und wo seine Grenzen liegen, lesen Sie im eigenen Ratgeber.",
        },
      ],
    },
    {
      id: "steuern",
      titel: "Steuern: Worauf Vermieter und WEG achten müssen",
      tocLabel: "Steuern",
      bloecke: [
        {
          typ: "p",
          text: "**Einnahmen aus PV-Anlagen bis 30 kWp je Wohn- oder Gewerbeeinheit sind einkommensteuerfrei, insgesamt aber höchstens für 100 kWp pro Steuerpflichtigem (§ 3 Nr. 72 EStG).** Ein Mehrfamilienhaus mit acht Wohnungen kann damit auch eine größere Anlage steuerfrei betreiben. Beim Kauf gilt für Anlagen auf Wohngebäuden der Nullsteuersatz nach § 12 Abs. 3 UStG.",
        },
        {
          typ: "liste",
          punkte: [
            "**Umsatzsteuer:** Der Verkauf von Solarstrom an Bewohner ist grundsätzlich eine umsatzsteuerbare Leistung. Ob die Kleinunternehmerregelung greift, hängt von den Gesamtumsätzen ab.",
            "**Gewerbesteuer bei Wohnungsunternehmen:** Die erweiterte Kürzung bleibt erhalten, solange Einnahmen aus Stromlieferungen an Mieter 10 % der Mieteinnahmen nicht übersteigen.",
            "**Betriebskosten:** Solarstrom über GGV oder Mieterstrom wird separat abgerechnet, nicht über die Nebenkostenabrechnung.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          text: "Steuerliche Fragen hängen stark von Rechtsform und Vermietungsstruktur ab. Lassen Sie das Betreibermodell vor der Entscheidung von Ihrer Steuerberatung prüfen. Einen Überblick über die allgemeinen Regeln finden Sie unter [steuerliche Vorteile](/forderungen/steuerlich).",
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Ausblick: Energy Sharing und EEG-Novelle",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Seit dem 1. Juni 2026 ermöglicht § 42c EnWG das Energy Sharing: Solarstrom darf auch über das öffentliche Netz mit Nachbarn im selben Netzgebiet geteilt werden.** Für Mehrfamilienhäuser ist das eine Ergänzung, etwa um Überschüsse an ein benachbartes Gebäude weiterzugeben. Reduzierte Netzentgelte sind dafür nicht vorgesehen, und Beobachter rechnen 2026 vor allem mit Pilotprojekten. Innerhalb eines Gebäudes bleibt die Gebäudeversorgung wirtschaftlich meist die bessere Wahl, weil keine Netzentgelte anfallen.",
        },
      ],
    },
  ],

  faq: [
    { q: "Lohnt sich eine PV-Anlage auf einem Mehrfamilienhaus?", a: "Meist ja, besonders wenn der Strom im Haus genutzt wird. Dachflächen sind oft groß, die Preise je kWp sinken mit der Anlagengröße, und Bewohner profitieren von günstigem Solarstrom. Entscheidend sind Messkonzept und Abrechnungskosten." },
    { q: "Was ist der Unterschied zwischen Mieterstrom und gemeinschaftlicher Gebäudeversorgung?", a: "Beim Mieterstrom liefert der Anbieter Solar- und Reststrom komplett und erhält den Mieterstromzuschlag. Bei der Gebäudeversorgung wird nur der Solarstrom verteilt, den Reststrom kaufen die Bewohner selbst – ohne Zuschlag, aber mit deutlich weniger Pflichten." },
    { q: "Müssen alle Mieter beim Mieterstrom oder bei der GGV mitmachen?", a: "Nein, die Teilnahme ist in beiden Modellen freiwillig. Jeder Haushalt darf seinen Stromlieferanten frei wählen. Je mehr Wohnungen teilnehmen, desto mehr Solarstrom wird im Haus genutzt." },
    { q: "Welche Mehrheit braucht eine WEG für eine Photovoltaikanlage?", a: "Die einfache Mehrheit der abgegebenen Stimmen reicht (§ 20 Abs. 1 WEG). Ob alle Eigentümer die Kosten tragen, hängt von der Beschlussmehrheit und der Wirtschaftlichkeit ab (§ 21 WEG)." },
    { q: "Wie hoch ist der Mieterstromzuschlag 2026?", a: `Für Anlagen mit Inbetriebnahme ab 1. August 2026 beträgt er ${ctStr(ZUSCHLAG.bis10)} ct/kWh bis 10 kWp, ${ctStr(ZUSCHLAG.bis40)} ct/kWh bis 40 kWp und ${ctStr(ZUSCHLAG.bis1000)} ct/kWh bis 1 MW, jeweils anteilig.` },
    { q: "Braucht jede Wohnung einen Smart Meter?", a: "Jede teilnehmende Wohnung braucht eine viertelstündliche Messung, in der Praxis also ein intelligentes Messsystem. Je nach Messkonzept und Netzbetreiber können auch weitere Zählpunkte betroffen sein. Das sollte vor der Planung geklärt werden." },
    { q: "Kann ich als Vermieter den Solarstrom über die Nebenkosten abrechnen?", a: "Nein. Solarstrom aus Gebäudeversorgung oder Mieterstrom wird über einen eigenen Vertrag abgerechnet. Nur der Allgemeinstrom, etwa für Treppenhaus und Aufzug, läuft über die Betriebskosten." },
  ],

  passend: [
    { href: "/produkte/mieterstrom", titel: "Mieterstrom & Gebäudeversorgung", text: "Modelle, Rechenbeispiel und Projektablauf." },
    { href: "/ratgeber/balkonkraftwerk", titel: "Balkonkraftwerk", text: "Regeln für Mieter und Wohnungseigentümer." },
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Aktuelle Sätze für Überschuss und Volleinspeisung." },
    { href: "/kontakt", titel: "Projekt besprechen", text: "Wir rechnen Ihr Objekt durch." },
  ],

  quellen: [
    { titel: "§ 42b EnWG – Gemeinschaftliche Gebäudeversorgung", url: "https://www.gesetze-im-internet.de/enwg_2005/__42b.html", stand: "09/2026" },
    { titel: "§ 42a EnWG – Mieterstromverträge", url: "https://www.gesetze-im-internet.de/enwg_2005/__42a.html", stand: "09/2026" },
    { titel: "Bundesnetzagentur – EEG-Förderung und Fördersätze (Mieterstromzuschlag)", url: VERGUETUNG.quelle.url, stand: "09/2026" },
    { titel: "Verbraucherzentrale NRW – Gemeinschaftliche Gebäudeversorgung im Mehrfamilienhaus", url: "https://www.verbraucherzentrale.nrw/wissen/energie/erneuerbare-energien/gemeinschaftliche-gebaeudeversorgung-im-mehrfamilienhaus-solarstrom-vom-dach-nutzen-100786", stand: "09/2025" },
    { titel: "Netze BW – Mieterstrom und gemeinschaftliche Gebäudeversorgung (Messkonzepte)", url: "https://www.netze-bw.de/stromeinspeisung/mieterstrom-ggv", stand: "09/2026" },
    { titel: "§ 21 WEG – Kostentragung bei baulichen Veränderungen", url: "https://www.gesetze-im-internet.de/woeigg/__21.html", stand: "09/2026" },
    { titel: "§ 3 Nr. 72 EStG – Steuerbefreiung Photovoltaik", url: "https://www.gesetze-im-internet.de/estg/__3.html", stand: "09/2026" },
    { titel: "GÖRG – Energy Sharing nach § 42c EnWG ab 1. Juni 2026", url: "https://www.goerg.de/de/aktuelles/veroeffentlichungen/13-04-2026/bald-strom-mit-nachbarn-teilen-ein-ausblick-auf-das-ab-1-juni-2026-geltende-energy-sharing-gemaess-ss-42c-enwg-chancen-und-grenzen", stand: "04/2026" },
  ],

  seitenCta: { titel: "Welches Modell passt?", text: "Wir rechnen Gebäudeversorgung und Mieterstrom für Ihr Objekt durch.", href: "/produkte/mieterstrom", label: "Mieterstrom ansehen" },
  cta: {
    title: "Solarstrom für alle Parteien – sauber geplant.",
    text: "Von der Dachprüfung über das Messkonzept bis zur Abstimmung mit dem Netzbetreiber: Wir planen Ihre Anlage und rechnen die Modelle ehrlich gegeneinander.",
    primary: { label: "Projekt anfragen", href: "/kontakt" },
    secondary: { label: "Mieterstrom im Detail", href: "/produkte/mieterstrom" },
  },
};

export default artikel;
