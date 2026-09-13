// Ratgeber: Solarcarport
// PV-Werte aus dem Solarrechner (@/lib/solarrechner), Wallbox-Werte aus @/data/wallbox,
// E-Auto-Verbrauch aus @/lib/rechner/annahmen. Baurecht: BayBO, LBO BW, BauO NRW.

import { ANNAHMEN } from "@/data/solarrechner";
import { WALLBOX, spanne } from "@/data/wallbox";
import { SPEICHER } from "@/lib/rechner/annahmen";
import { berechne } from "@/lib/solarrechner";

const zahl = (n) => Math.round(n).toLocaleString("de-DE");
const zehner = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE");
const hundert = (n) => (Math.round(n / 100) * 100).toLocaleString("de-DE");
const jahre = (r) => (r.amortisationJahre ? r.amortisationJahre.toFixed(1).replace(".", ",") : "über 20");

// Flächen: Einzelcarport ca. 3 × 5 m, Doppelcarport ca. 6 × 5,5 m
const VARIANTEN = [
  { name: "Einzelcarport", flaeche: 15 },
  { name: "Doppelcarport", flaeche: 33 },
].map((v) => ({ ...v, kwp: Math.floor((v.flaeche / ANNAHMEN.qmProKwp) * 2) / 2 }));
const E = VARIANTEN[0];
const D = VARIANTEN[1];

const KM = 12000;
const EAUTO_KWH = (KM / 100) * SPEICHER.eAutoVerbrauch;
const HAUSHALT = 4500;

const R_E = berechne({ kwp: E.kwp, ausrichtung: "sued", neigung: "flach", verbrauch: HAUSHALT + EAUTO_KWH, speicherKwh: 0 });
const R_D = berechne({ kwp: D.kwp, ausrichtung: "sued", neigung: "flach", verbrauch: HAUSHALT + EAUTO_KWH, speicherKwh: 0 });
const kmAus = (kwh) => (kwh / SPEICHER.eAutoVerbrauch) * 100;
const carportWallbox = WALLBOX.gebaeude.find((g) => g.typ.includes("Carport"));

const artikel = {
  slug: "solarcarport",
  title: "Solarcarport: Kosten, Ertrag, Genehmigung und Statik 2026",
  seoTitle: "Solarcarport 2026: Kosten, Ertrag & Genehmigung | Ökovolt",
  kurzTitel: "Solarcarport",
  description:
    "Solarcarport 2026: Was kostet ein Carport mit Photovoltaik, wie viel Strom liefert er fürs E-Auto, wann ist er genehmigungsfrei und worauf kommt es bei Statik und Dichtigkeit an?",
  excerpt:
    "Ein Solarcarport schützt das Auto und erzeugt den Strom dafür gleich mit. Was ein Einzel- oder Doppelcarport liefert, was er kostet und welche Regeln für Baurecht, Steuer und Statik gelten.",
  hauptKeyword: "solarcarport",
  keywords: ["Solarcarport", "Solarcarport Kosten", "Carport mit Photovoltaik", "Solarcarport Genehmigung", "Solarcarport mit Wallbox", "Doppelcarport Solar", "PV-Carport Ertrag"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Ratgeber/solarcarport.jpg",
  bildAlt: "Carport mit Solarmodulen als Dach, darunter ein geparktes Auto",
  badge: { wert: `~${zahl(kmAus(R_E.jahresertrag))} km`, text: `rechnerische Jahresfahrleistung aus einem Einzelcarport mit ${String(E.kwp).replace(".", ",")} kWp` },

  kurzFazit: [
    `**Ein Solarcarport ist ein Carport, dessen Dach ganz oder teilweise aus Solarmodulen besteht.** Ein Einzelcarport trägt rund ${String(E.kwp).replace(".", ",")} kWp, ein Doppelcarport etwa ${String(D.kwp).replace(".", ",")} kWp.`,
    `Bei flacher Südneigung liefert ein Einzelcarport rund **${hundert(R_E.jahresertrag)} kWh im Jahr** – rechnerisch genug für gut ${hundert(kmAus(R_E.jahresertrag))} km E-Auto-Fahrt. Wie viel davon tatsächlich im Auto landet, hängt vom Ladezeitpunkt ab.`,
    "**Carports sind in den meisten Bundesländern bis 30 bzw. 50 m² verfahrensfrei** (etwa Bayern und Baden-Württemberg 50 m², NRW 30 m²) – Abstandsflächen, Bebauungsplan und Statik gelten trotzdem.",
    "**Steuer:** Für die Photovoltaik-Komponenten gilt der Nullsteuersatz, die Carport-Unterkonstruktion wird regulär mit 19 % Umsatzsteuer berechnet.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Was ist ein Solarcarport und für wen lohnt er sich?",
      tocLabel: "Für wen lohnt er sich?",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Solarcarport lohnt sich vor allem, wenn ohnehin ein Carport gebaut werden soll, das Hausdach für Photovoltaik ungeeignet oder schon belegt ist oder ein E-Auto zu Hause geladen wird.** Die Module übernehmen die Funktion der Dacheindeckung, der Strom fließt ins Hausnetz, in einen Speicher oder direkt in die Wallbox.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Hausdach ungeeignet", text: "Verschattung, Nordausrichtung, Denkmalschutz oder eine anstehende Dachsanierung – der Carport ist die Ausweichfläche." },
            { titel: "Hausdach schon voll", text: "Mit Wärmepumpe oder E-Auto steigt der Bedarf. Der Carport erweitert eine bestehende Anlage." },
            { titel: "Neubau oder Umgestaltung", text: "Wer ohnehin einen Carport plant, zahlt für die Solarvariante vor allem die PV-Technik zusätzlich." },
          ],
        },
        {
          typ: "p",
          text: "Weniger sinnvoll ist ein Solarcarport, wenn er stark verschattet steht, etwa zwischen hohen Bäumen, oder wenn ein gut geeignetes, freies Hausdach vorhanden ist: Dort ist Photovoltaik je kWp in der Regel günstiger, weil keine eigene Tragkonstruktion nötig ist. Ob sich Photovoltaik grundsätzlich für Sie rechnet, zeigt der Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).",
        },
      ],
    },
    {
      id: "ertrag",
      titel: "Wie viel Strom liefert ein Solarcarport?",
      tocLabel: "Ertrag",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Einzelcarport mit rund ${String(E.kwp).replace(".", ",")} kWp erzeugt in Süddeutschland bei flacher Südneigung etwa ${hundert(R_E.jahresertrag)} kWh im Jahr, ein Doppelcarport mit ${String(D.kwp).replace(".", ",")} kWp etwa ${hundert(R_D.jahresertrag)} kWh.** Carportdächer sind meist nur 5 bis 15 Grad geneigt – das kostet gegenüber einem ideal geneigten Hausdach rund 10 % Ertrag.`,
        },
        {
          typ: "tabelle",
          caption: `Leistung und Ertrag typischer Solarcarports (Süddeutschland, Süd, flache Neigung)`,
          kopf: ["", E.name, D.name],
          zeilen: [
            ["Dachfläche (ca.)", `${E.flaeche} m²`, `${D.flaeche} m²`],
            ["Anlagenleistung", `${String(E.kwp).replace(".", ",")} kWp`, `${String(D.kwp).replace(".", ",")} kWp`],
            ["Jahresertrag", `${hundert(R_E.jahresertrag)} kWh`, `${hundert(R_D.jahresertrag)} kWh`],
            [`Rechnerisch E-Auto-Kilometer (${SPEICHER.eAutoVerbrauch} kWh/100 km)`, `${hundert(kmAus(R_E.jahresertrag))} km`, `${hundert(kmAus(R_D.jahresertrag))} km`],
            ["Richtpreis PV-Technik (ohne Carport)", `${hundert(R_E.investition)} €`, `${hundert(R_D.investition)} €`],
            [`Vorteil pro Jahr (Haushalt ${zahl(HAUSHALT)} kWh + E-Auto ${zahl(EAUTO_KWH)} kWh)`, `${zehner(R_E.nutzenProJahr)} €`, `${zehner(R_D.nutzenProJahr)} €`],
            ["Amortisation der PV-Technik", `${jahre(R_E)} Jahre`, `${jahre(R_D)} Jahre`],
          ],
          hervorheben: 2,
          minBreite: 620,
          fussnote: `Berechnet mit dem Rechenkern unseres Solarrechners (${ANNAHMEN.ertragProKwpSued} kWh/kWp × 0,9 für flache Neigung, ${ANNAHMEN.qmProKwp} m² je kWp, Strompreis und Einspeisevergütung Stand September 2026, ohne Speicher). Die Kosten der Carport-Konstruktion sind nicht enthalten, weil sie auch ohne Solardach anfallen würden. In Norddeutschland rund 10 % weniger Ertrag. Orientierungswerte, keine Angebote.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Rechnerisch ist nicht tatsächlich",
          text: `Das Auto steht tagsüber oft nicht unter dem Carport. Laut einer Auswertung der HTW Berlin von 730 Haushalten steigert **dynamisches Überschussladen** den Solaranteil an der Fahrzeugladung im Mittel um 25 Prozentpunkte, ein **Batteriespeicher** um 9 Prozentpunkte. Wie das Laden mit Solarüberschuss funktioniert, erklärt der Ratgeber [PV-Überschussladen](/ratgeber/pv-ueberschussladen).`,
        },
        {
          typ: "p",
          text: "**Bifaziale Glas-Glas-Module** sind auf Carports beliebt: Sie lassen etwas Licht durch, wirken optisch leichter und nutzen reflektiertes Licht von hellen Böden über die Rückseite. Der Mehrertrag ist bei dunklem Pflaster gering, bei hellem Kies oder Schnee etwas höher. Mehr zu Modultypen im [Solarmodule-Vergleich](/ratgeber/solarmodule-vergleich).",
        },
      ],
    },
    {
      id: "kosten",
      titel: "Was kostet ein Solarcarport?",
      tocLabel: "Kosten",
      bloecke: [
        {
          typ: "p",
          text: "**Marktübersichten nennen für einen kompletten Einzel-Solarcarport inklusive Montage grob 9.000 bis 18.000 €, für einen Doppelcarport etwa 12.000 bis 22.000 €; mit Speicher und Wallbox werden 15.000 bis 30.000 € genannt.** Die Spanne ist groß, weil Material, Fundamente, Dachausführung und Elektroarbeiten stark variieren. Sinnvoller als ein Pauschalpreis ist der Blick auf die einzelnen Posten.",
        },
        {
          typ: "tabelle",
          caption: "Kostenbestandteile eines Solarcarports",
          kopf: ["Posten", "Richtwert / Einflussfaktoren", "Umsatzsteuer"],
          zeilen: [
            ["Carport-Konstruktion", "Holz, Stahl oder Aluminium; Einzel- oder Doppelcarport; Bausatz oder Maßanfertigung", "19 %"],
            ["Fundamente und Erdarbeiten", "frostfreie Punkt- oder Streifenfundamente, Bodenbeschaffenheit, Zufahrt", "19 %"],
            ["Statik", "Typenstatik des Herstellers oder Einzelnachweis bei Sonderlösungen", "19 %"],
            ["Photovoltaik (Module, Wechselrichter, Montage)", `laut Solarrechner rund ${hundert(R_E.investition)} € für ${String(E.kwp).replace(".", ",")} kWp bzw. ${hundert(R_D.investition)} € für ${String(D.kwp).replace(".", ",")} kWp`, "0 %"],
            ["Elektroanschluss", "Erdkabel zum Haus, Grabung, Zählerschrank-Anpassung", "0 % für die PV-Leitung, 19 % für die Wallbox-Zuleitung"],
            ["Wallbox mit Installation am Carport", `${spanne(WALLBOX.varianten[1].gesamt)} (11 kW, Mittelklasse); Montage am Carport ${spanne(carportWallbox.kosten)}`, "19 %"],
            ["Optional: Speicher", "siehe [Stromspeicher-Kosten](/ratgeber/stromspeicher-kosten)", "0 %"],
          ],
          minBreite: 680,
          fussnote: "Gesamtspannen aus Marktübersichten 2026; PV- und Wallbox-Werte aus den zentralen Annahmen dieser Website. Welche Arbeiten dem Nullsteuersatz unterliegen, legt das BMF-Schreiben vom 30.11.2023 fest – im Zweifel steuerlich beraten lassen.",
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Nullsteuersatz: nur für die Photovoltaik",
          text: "Nach dem BMF-Schreiben vom 30. November 2023 bildet die Photovoltaikanlage bei Solarcarports ein eigenes Wirtschaftsgut. Module, Wechselrichter, Speicher und die dazugehörige Installation fallen unter den Nullsteuersatz nach § 12 Abs. 3 UStG, die Unterkonstruktion der Überdachung wird regulär mit 19 % besteuert. Ein seriöses Angebot weist beide Teile getrennt aus. Mehr im Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).",
        },
        {
          typ: "p",
          text: "Finanzieren lässt sich die Photovoltaik wie jede andere Anlage, etwa über den [KfW-Kredit 270](/ratgeber/kfw-kredit-270). Einnahmen aus Anlagen bis 30 kWp auf Einfamilienhäusern einschließlich Nebengebäuden sind nach § 3 Nr. 72 EStG einkommensteuerfrei. Regionale Zuschüsse prüfen Sie im [Förder-Check](/foerdercheck).",
        },
      ],
    },
    {
      id: "genehmigung",
      titel: "Braucht ein Solarcarport eine Baugenehmigung?",
      tocLabel: "Genehmigung",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Solarcarport ist baurechtlich ein Carport – und der ist in den meisten Bundesländern bis zu einer bestimmten Größe verfahrensfrei, außer im Außenbereich.** Die Solarmodule auf dem Dach ändern daran in der Regel nichts, weil Solaranlagen auf Dachflächen ebenfalls verfahrensfrei sind. Die Grenzen unterscheiden sich aber je nach Land.",
        },
        {
          typ: "tabelle",
          caption: "Verfahrensfreie Carports in drei großen Bundesländern (Stand September 2026)",
          kopf: ["Land", "Grenze", "Rechtsgrundlage", "Besonderheiten"],
          zeilen: [
            ["Bayern", "bis 50 m², außer im Außenbereich", "Art. 57 Abs. 1 Nr. 1 b BayBO", "an der Grundstücksgrenze mittlere Wandhöhe bis 3 m und höchstens 9 m Länge je Grenze (Art. 6 Abs. 7)"],
            ["Baden-Württemberg", "bis 50 m² Grundfläche, mittlere Wandhöhe bis 3 m, außer im Außenbereich", "Anhang zu § 50 Abs. 1 LBO", "Fassung der LBO von 2026; ältere Ratgeber nennen teils noch 30 m²"],
            ["Nordrhein-Westfalen", "bis 30 m² Brutto-Grundfläche insgesamt, mittlere Wandhöhe bis 3 m, außer im Außenbereich", "§ 62 Abs. 1 BauO NRW", "30 m² gelten für alle Garagen und überdachten Stellplätze des Grundstücks zusammen"],
          ],
          minBreite: 760,
          fussnote: "Andere Bundesländer haben eigene Grenzen, meist zwischen 30 und 50 m². Verfahrensfrei heißt nicht regelfrei: Bebauungsplan, Abstandsflächen, Grenzbebauung, Stellplatz- und Gestaltungssatzungen sowie Denkmalschutz gelten weiterhin.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Bebauungsplan** prüfen: Baugrenzen, Dachform, Nebenanlagen außerhalb des Baufensters.",
            "**Grenzbebauung** mit Nachbarn abstimmen – auch wenn keine Zustimmung vorgeschrieben ist, vermeidet das Streit.",
            "**Denkmalschutz oder Ensembleschutz** erfordert fast immer eine Erlaubnis.",
            "**Außenbereich** (§ 35 BauGB): Hier ist regelmäßig ein Bauantrag nötig.",
            "Im Zweifel eine **formlose Anfrage beim Bauamt** stellen. Mehr im Ratgeber [Photovoltaik-Genehmigung](/ratgeber/photovoltaik-genehmigung) und unter [Baurecht](/forderungen/baurecht).",
          ],
        },
        {
          typ: "p",
          text: "Für neue größere Parkplätze von Unternehmen und Kommunen schreiben mehrere Bundesländer inzwischen eine Photovoltaik-Überdachung vor. Welche Regeln wo gelten, zeigt der Ratgeber [Solarpflicht in den Bundesländern](/ratgeber/solarpflicht-bundeslaender).",
        },
      ],
    },
    {
      id: "statik-dichtigkeit",
      titel: "Statik, Dichtigkeit und Bauweise",
      tocLabel: "Statik & Bauweise",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Solarcarport muss Schnee- und Windlasten nach den Eurocodes für seinen Standort sicher abtragen – und das Gewicht der Module zusätzlich.** Bei Bausätzen gibt es dafür meist eine Typenstatik mit Angabe der zulässigen Schneelastzone. In schneereichen Regionen wie dem Allgäu oder im Mittelgebirge ist das der entscheidende Punkt.",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Schneelast", text: "Maßgeblich ist die Schneelastzone nach DIN EN 1991-1-3 und die Geländehöhe. Flach geneigte Carportdächer halten Schnee länger als steile Hausdächer." },
            { titel: "Windlast", text: "Offene Carports werden auch von unten angeströmt. Stützen, Verbindungen und Fundamente müssen Sog- und Hebekräfte aufnehmen." },
            { titel: "Nachrüsten", text: "Bestehende Holzcarports sind selten für zusätzliche 10 bis 15 kg/m² Modul- und Montagegewicht plus Schnee ausgelegt. Ohne statischen Nachweis nicht nachrüsten." },
            { titel: "Fundamente", text: "Frostfrei gegründete Fundamente nach Statik. Leerrohre für PV- und Wallbox-Kabel gleich mit einplanen." },
          ],
        },
        { typ: "h3", text: "Wird ein Solarcarport dicht?" },
        {
          typ: "p",
          text: "Normale Module mit Klemmen sind **nicht wasserdicht** verlegt – zwischen den Modulen tropft Regen durch. Es gibt drei Lösungen: ein geschlossenes Unterdach (etwa Trapezblech) mit aufgesetzter PV, wasserführende Montageprofile mit Dichtungen, oder Glas-Glas-Module in einem Dichtsystem, die selbst die Dachhaut bilden. Achten Sie auf eine definierte Entwässerung, sonst läuft das Wasser gebündelt an einer Kante ab.",
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Ausrichtung festlegen, bevor gebaut wird",
          text: "Ein Pultdach nach Süden bringt den höchsten Ertrag, nach Osten oder Westen geneigt verteilt es den Strom besser über den Tag. Etwa 10 Grad Neigung sind ein guter Kompromiss zwischen Ertrag, Selbstreinigung und Bauhöhe. Mehr dazu im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west).",
        },
      ],
    },
    {
      id: "wallbox-technik",
      titel: "Solarcarport mit Wallbox, Speicher und Hausanschluss",
      tocLabel: "Wallbox & Technik",
      bloecke: [
        {
          typ: "p",
          text: "**Am meisten bringt ein Solarcarport, wenn er mit dem Hausnetz, einer Wallbox mit Überschussladen und idealerweise einem Energiemanagement verbunden ist.** Elektrisch ist er eine normale Photovoltaikanlage: Die Leitung führt zum Wechselrichter, der Strom wird im Haus verbraucht, gespeichert oder eingespeist.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Anbindung klären", "Eigenständige Anlage mit eigenem Wechselrichter oder Erweiterung einer bestehenden Dachanlage? Bei Erweiterungen Freigaben des vorhandenen Wechselrichters und die Vergütungsregeln beachten."],
            ["Kabelweg planen", "Erdkabel für PV und Wallbox zum Zählerschrank, Leerrohre, Grabung und Hauseinführung."],
            ["Wallbox auswählen", `11 kW mit PV-Überschussladen, bei Bedarf steuerbar nach § 14a EnWG. Kosten und Installation im Ratgeber [Wallbox-Installation](/ratgeber/wallbox-installation).`],
            ["Anmelden", "Netzbetreiber und Marktstammdatenregister wie bei jeder PV-Anlage, Wallbox beim Netzbetreiber melden. Details unter [Photovoltaik anmelden](/ratgeber/photovoltaik-anmelden)."],
          ],
        },
        {
          typ: "p",
          text: "Ein Solarcarport kann nach der Definition des EEG ein Gebäude sein – eine überdeckte, betretbare bauliche Anlage, die dem Schutz von Sachen dient (§ 3 Nr. 23 EEG 2023). Dann gelten die Vergütungssätze für Gebäudeanlagen; klären Sie die Einordnung im Zweifel mit Ihrem Netzbetreiber. Die aktuellen Sätze finden Sie unter [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026).",
        },
        { typ: "tool", href: "/rechner/wallbox", titel: "Was spart das Laden mit Sonnenstrom?", text: "E-Auto-Kosten mit Wallbox, Solarstrom und öffentlichem Laden vergleichen.", label: "Zum E-Auto-Laderechner" },
      ],
    },
    {
      id: "checkliste",
      titel: "Checkliste vor dem Kauf",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "checkliste",
          punkte: [
            "Standort ohne nennenswerte Verschattung, Ausrichtung und Neigung festgelegt",
            "Baurecht geklärt: Größe, Grenzabstand, Bebauungsplan, gegebenenfalls Denkmalschutz",
            "Statik für die Schneelastzone des Standorts nachgewiesen (Typenstatik oder Einzelnachweis)",
            "Dachausführung geklärt: tropfdicht, wasserführend oder Unterdach",
            "Angebot trennt Carport-Konstruktion (19 % USt.) und Photovoltaik (0 % USt.)",
            "Kabelweg, Zählerschrank und Wallbox-Anschluss im Angebot enthalten",
            "Anmeldung bei Netzbetreiber und Marktstammdatenregister geregelt",
            "Leistung passend zum Bedarf – Hilfe gibt der Ratgeber [PV-Anlage Größe berechnen](/ratgeber/pv-anlage-groesse-berechnen)",
          ],
        },
      ],
    },
  ],

  faq: [
    { q: "Was kostet ein Solarcarport?", a: "Marktübersichten nennen für einen kompletten Einzel-Solarcarport grob 9.000 bis 18.000 €, für einen Doppelcarport etwa 12.000 bis 22.000 €, mit Speicher und Wallbox bis rund 30.000 €. Die Photovoltaik-Technik allein ist nur ein Teil davon; Carport, Fundamente, Elektroanschluss und Wallbox kommen hinzu." },
    { q: "Wie viel kWp passen auf einen Carport?", a: `Bei rund ${ANNAHMEN.qmProKwp} m² je kWp trägt ein Einzelcarport mit etwa ${E.flaeche} m² rund ${String(E.kwp).replace(".", ",")} kWp, ein Doppelcarport mit etwa ${D.flaeche} m² rund ${String(D.kwp).replace(".", ",")} kWp.` },
    { q: "Brauche ich für einen Solarcarport eine Baugenehmigung?", a: "Oft nicht: Carports sind in vielen Ländern bis 30 oder 50 m² verfahrensfrei, in Bayern und Baden-Württemberg bis 50 m², in NRW bis 30 m². Im Außenbereich, bei Denkmalschutz oder abweichenden Festsetzungen im Bebauungsplan ist meist ein Antrag nötig." },
    { q: "Gilt der Nullsteuersatz auch für den Solarcarport?", a: "Nur für die Photovoltaik-Komponenten und deren Installation. Die Unterkonstruktion des Carports wird laut BMF-Schreiben vom 30.11.2023 regulär mit 19 % Umsatzsteuer berechnet." },
    { q: "Reicht ein Solarcarport, um ein E-Auto zu laden?", a: `Rechnerisch ja: Ein Einzelcarport erzeugt Strom für rund ${hundert(kmAus(R_E.jahresertrag))} km im Jahr. Tatsächlich hängt der Solaranteil davon ab, ob das Auto tagsüber zu Hause steht. Überschussladen und ein Speicher erhöhen ihn deutlich; im Winter wird trotzdem Netzstrom nötig.` },
    { q: "Ist ein Solarcarport wasserdicht?", a: "Nur bei entsprechender Ausführung. Klemmend montierte Standardmodule lassen Wasser durch die Fugen. Dicht wird es mit Unterdach, wasserführenden Profilen mit Dichtungen oder Glas-Glas-Modulen in einem Dichtsystem." },
    { q: "Kann ich meinen bestehenden Carport mit Solarmodulen nachrüsten?", a: "Nur, wenn die Statik die zusätzlichen Lasten aus Modulen und Schnee trägt. Viele ältere Holzcarports sind dafür nicht ausgelegt. Lassen Sie das vor dem Kauf von Modulen prüfen." },
  ],

  passend: [
    { href: "/ratgeber/wallbox-installation", titel: "Wallbox-Installation", text: "Kosten, Anmeldung und § 14a EnWG." },
    { href: "/ratgeber/pv-ueberschussladen", titel: "PV-Überschussladen", text: "So lädt das E-Auto mit Sonnenstrom." },
    { href: "/ratgeber/photovoltaik-genehmigung", titel: "Photovoltaik-Genehmigung", text: "Wann das Bauamt mitreden darf." },
    { href: "/produkte/wallbox", titel: "Wallbox", text: "Ladelösungen für Zuhause." },
  ],

  quellen: [
    { titel: "Bayerische Bauordnung – Art. 57 Verfahrensfreie Bauvorhaben", url: "https://www.gesetze-bayern.de/Content/Document/BayBO-57", stand: "09/2026" },
    { titel: "Bauportal NRW – Verfahrensfreie Bauvorhaben nach § 62 BauO NRW 2018", url: "https://bauportal.nrw/verfahrensfreie-bauvorhaben-nach-ss-62-bauo-nrw-2018", stand: "09/2026" },
    { titel: "Landesbauordnung Baden-Württemberg – Anhang zu § 50 Abs. 1: Verfahrensfreie Vorhaben", url: "https://lxgesetze.de/lbo/AN-1", stand: "09/2026" },
    { titel: "pv magazine – Finanzverwaltung präzisiert Nullsteuersatz für Photovoltaik-Anlagen weiter (BMF-Schreiben vom 30.11.2023)", url: "https://www.pv-magazine.de/2023/12/08/finanzverwaltung-praezisiert-nullsteuersatz-fuer-photovoltaik-anlagen-weiter/", stand: "12/2023" },
    { titel: "§ 3 EEG 2023 – Begriffsbestimmungen (Nr. 23 Gebäude)", url: "https://www.gesetze-im-internet.de/eeg_2014/__3.html", stand: "09/2026" },
    { titel: "HTW Berlin – Solares Laden von Elektrofahrzeugen", url: "https://solar.htw-berlin.de/studien/solares-laden-von-elektrofahrzeugen/", stand: "09/2026" },
    { titel: "reduco.ai – Solarcarport 2026: Kosten, Leistung und Förderung (Marktübersicht)", url: "https://reduco.ai/blog/solar/solarcarport-kosten-foerderung", stand: "08/2026" },
  ],

  seitenCta: { titel: "Carport plus Wallbox?", text: "Ladekosten mit Solarstrom vergleichen.", href: "/rechner/wallbox", label: "Zum Laderechner" },
  cta: {
    title: "Solarcarport, Wallbox und Anmeldung aus einer Hand.",
    text: "Wir planen die Photovoltaik auf Ihrem Carport, binden sie mit Wallbox und Hausanschluss sauber ein und übernehmen die Anmeldung.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
