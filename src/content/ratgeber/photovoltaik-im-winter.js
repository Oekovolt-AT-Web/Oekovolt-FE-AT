// Ratgeber: Photovoltaik im Winter
// Monatsverteilung aus PVGIS 5.3 (JRC) für Türkheim (48,06° N) und Hamburg (53,55° N),
// skaliert auf die Jahreserträge des Solarrechners (@/data/solarrechner).

import { ANNAHMEN, NEIGUNGEN, AUSRICHTUNGEN } from "@/data/solarrechner";
import { SPEICHER } from "@/lib/rechner/annahmen";

const KWP = 10;
const f = (liste, id) => liste.find((x) => x.id === id).faktor;
const zahl = (n) => (Math.round(n / 10) * 10).toLocaleString("de-DE");

// PVGIS-Monatswerte (kWh/kWp, Jan–Dez) als Verteilungsschlüssel
const PROFIL = {
  sued30: [43, 67, 102, 124, 128, 134, 138, 128, 107, 80, 49, 42],
  nord30: [25, 45, 82, 119, 129, 129, 127, 113, 94, 63, 31, 22],
  ow10: [24, 43, 78, 109, 125, 135, 136, 117, 87, 55, 29, 21],
  sued60: [52, 75, 104, 113, 108, 109, 114, 113, 105, 87, 57, 51],
};
const JAHR = {
  sued30: KWP * ANNAHMEN.ertragProKwpSued,
  nord30: KWP * 900, // Norddeutschland laut Kommentar in @/data/solarrechner
  ow10: KWP * ANNAHMEN.ertragProKwpSued * f(AUSRICHTUNGEN, "ost-west"),
  sued60: KWP * ANNAHMEN.ertragProKwpSued * f(NEIGUNGEN, "steil"),
};
const monat = (v, m) => (PROFIL[v][m] / PROFIL[v].reduce((a, b) => a + b, 0)) * JAHR[v];
const summe = (v, ms) => ms.reduce((s, m) => s + monat(v, m), 0);
const anteil = (v, ms) => Math.round((summe(v, ms) / JAHR[v]) * 100);
const NOV_FEB = [10, 11, 0, 1];
const zeile = (label, m) => [label, `${zahl(monat("sued30", m))} kWh`, `${zahl(monat("nord30", m))} kWh`, `${zahl(monat("ow10", m))} kWh`, `${zahl(monat("sued60", m))} kWh`];

const artikel = {
  slug: "photovoltaik-im-winter",
  title: "Photovoltaik im Winter: Ertrag, Schnee und Kälte im Faktencheck",
  seoTitle: "Photovoltaik im Winter: Ertrag, Schnee & Kälte | Ökovolt",
  kurzTitel: "Photovoltaik im Winter",
  description:
    "Photovoltaik im Winter: Wie viel Strom liefert eine PV-Anlage von November bis Februar? Monatswerte für Nord und Süd, Schnee, Kälte-Effekt, Speicher und Wärmepumpe.",
  excerpt:
    "Kurze Tage, tiefe Sonne, Schnee auf dem Dach: Im Winter liefert jede Anlage deutlich weniger. Wie viel genau, warum Kälte sogar hilft und was Sie mit Speicher und Wärmepumpe realistisch erwarten können.",
  hauptKeyword: "photovoltaik im winter",
  keywords: ["Photovoltaik im Winter", "PV-Anlage Ertrag Winter", "Solaranlage Schnee", "Photovoltaik Ertrag Dezember", "Solarmodule Kälte Wirkungsgrad", "Photovoltaik Wärmepumpe Winter", "Stromspeicher im Winter"],
  veroeffentlicht: "2026-09-13",
  aktualisiert: "2026-09-13",
  kategorie: "Technik & Planung",
  bild: "/Images/Ratgeber/photovoltaik-im-winter.jpg",
  bildAlt: "Luftaufnahme einer Photovoltaikanlage, deren Module teilweise mit Schnee bedeckt sind",
  badge: { wert: `~${anteil("sued30", NOV_FEB)} %`, text: "des Jahresertrags von November bis Februar (Süddeutschland, Süddach)" },

  kurzFazit: [
    `**Ja, Photovoltaik funktioniert im Winter – aber auf deutlich niedrigerem Niveau.** Von November bis Februar erzeugt ein Süddach in Süddeutschland rund ${anteil("sued30", NOV_FEB)} % des Jahresertrags, in Norddeutschland etwa ${anteil("nord30", NOV_FEB)} %.`,
    `Eine ${KWP}-kWp-Anlage liefert im Dezember im Süden rund **${zahl(monat("sued30", 11))} kWh**, im Norden etwa **${zahl(monat("nord30", 11))} kWh** – im Juni sind es jeweils rund dreimal bis sechsmal so viel.`,
    "**Kälte ist gut für Solarmodule:** Je kühler die Zellen, desto höher der Wirkungsgrad. Das Problem im Winter ist das fehlende Licht, nicht die Temperatur.",
    "**Schnee rutscht bei geneigten Dächern meist von selbst ab.** Räumen Sie Module nicht selbst – Absturzgefahr und Beschädigungen stehen in keinem Verhältnis zum Mehrertrag.",
    "Speicher und Wärmepumpe profitieren im Winter wenig vom Solarstrom. Die Wirtschaftlichkeit einer Anlage wird **über das ganze Jahr** gerechnet.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie viel Strom erzeugt eine PV-Anlage im Winter?",
      tocLabel: "Ertrag im Winter",
      bloecke: [
        {
          typ: "p",
          text: `**Eine Photovoltaikanlage erzeugt im Winter Strom, allerdings nur einen kleinen Teil ihres Jahresertrags: Dezember und Januar zusammen liefern im Süden Deutschlands rund ${anteil("sued30", [11, 0])} %, im Norden rund ${anteil("nord30", [11, 0])} %.** Der Grund ist die Kombination aus kurzen Tagen, tief stehender Sonne, häufiger Bewölkung und gelegentlicher Schneebedeckung.`,
        },
        {
          typ: "p",
          text: `Die Tabelle zeigt, was eine ${KWP}-kWp-Anlage in den Wintermonaten realistisch liefert. Die Monatsverteilung stammt aus dem Strahlungsdatensatz von PVGIS, die Jahressummen aus unserem [Solarrechner](/solarrechner) (${ANNAHMEN.ertragProKwpSued.toLocaleString("de-DE")} kWh je kWp im Süden, rund 900 kWh im Norden). Wie stark sich Regionen unterscheiden, zeigt der Ratgeber [Photovoltaik-Ertrag pro kWp](/ratgeber/photovoltaik-ertrag-pro-kwp).`,
        },
        {
          typ: "tabelle",
          caption: `Monatsertrag einer ${KWP}-kWp-Anlage im Winterhalbjahr nach Region und Aufstellung`,
          kopf: ["Monat", "Süd 30°, Süddeutschland", "Süd 30°, Norddeutschland", "Ost-West 10°, Süddeutschland", "Süd 60° (steil), Süddeutschland"],
          zeilen: [
            zeile("Oktober", 9),
            zeile("November", 10),
            zeile("Dezember", 11),
            zeile("Januar", 0),
            zeile("Februar", 1),
            zeile("März", 2),
            ["Nov.–Feb. gesamt", `${zahl(summe("sued30", NOV_FEB))} kWh (${anteil("sued30", NOV_FEB)} %)`, `${zahl(summe("nord30", NOV_FEB))} kWh (${anteil("nord30", NOV_FEB)} %)`, `${zahl(summe("ow10", NOV_FEB))} kWh (${anteil("ow10", NOV_FEB)} %)`, `${zahl(summe("sued60", NOV_FEB))} kWh (${anteil("sued60", NOV_FEB)} %)`],
            ["Juni (Vergleich)",`${zahl(monat("sued30", 5))} kWh`, `${zahl(monat("nord30", 5))} kWh`, `${zahl(monat("ow10", 5))} kWh`, `${zahl(monat("sued60", 5))} kWh`],
            ["Jahr", `${zahl(JAHR.sued30)} kWh`, `${zahl(JAHR.nord30)} kWh`, `${zahl(JAHR.ow10)} kWh`, `${zahl(JAHR.sued60)} kWh`],
          ],
          hervorheben: 1,
          markierteZeile: 6,
          minBreite: 760,
          fussnote: "Monatsverteilung: PVGIS 5.3 (Joint Research Centre der EU-Kommission), Standorte Türkheim/Schwaben und Hamburg, langjähriges Mittel. Jahressummen nach den Faktoren des Solarrechners, auf 10 kWh gerundet. PVGIS berücksichtigt keine Schneebedeckung – in schneereichen Lagen liegen Dezember bis Februar tatsächlich niedriger. Einzelne Jahre weichen deutlich ab.",
        },
        {
          typ: "kennzahl",
          wert: `~${Math.round(monat("sued30", 11) / 31)} kWh`,
          titel: `am Tag liefert eine ${KWP}-kWp-Anlage im Dezember im Schnitt (Süddeutschland)`,
          text: "Ein Mittelwert: An klaren Frosttagen kann es ein Vielfaches sein, an trüben Hochnebel- oder Schneetagen fast nichts.",
        },
      ],
    },
    {
      id: "gruende",
      titel: "Warum der Ertrag im Winter so stark sinkt",
      tocLabel: "Gründe",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Tiefe Sonne", text: "Mittags steht die Sonne am 21. Dezember in Süddeutschland nur rund 18,5 Grad hoch, in Hamburg 13 Grad. Das Licht trifft flach auf und legt einen langen Weg durch die Atmosphäre zurück." },
            { titel: "Kurze Tage", text: "Statt rund 16 Stunden im Juni ist es im Dezember nur etwa 8 Stunden hell – und in den Randstunden reicht das Licht kaum für nennenswerte Leistung." },
            { titel: "Wolken und Nebel", text: "Der Winter ist die trübste Jahreszeit. Hochnebellagen können tagelang anhalten; in Höhenlagen scheint dann oft die Sonne, im Tal nicht." },
            { titel: "Schatten und Schnee", text: "Tiefe Sonne verlängert Schatten von Bäumen und Nachbarhäusern um ein Vielfaches. Schnee auf den Modulen blockiert das Licht, bis er abrutscht oder taut." },
          ],
        },
        {
          typ: "p",
          text: "Die tiefe Wintersonne erklärt auch, warum **steil montierte Module** im Winter mehr liefern: In der Tabelle erzeugt ein 60-Grad-Dach im Dezember rund ein Fünftel mehr als ein 30-Grad-Dach, verliert aber im Sommer. Ost-West-Anlagen mit flacher Neigung sind im Winter am schwächsten, gleichen das im Sommer aus. Mehr dazu im Ratgeber [Photovoltaik Ost-West](/ratgeber/photovoltaik-ost-west). Wie sich Winterschatten konkret auswirkt, beschreibt [Photovoltaik und Verschattung](/ratgeber/photovoltaik-verschattung).",
        },
      ],
    },
    {
      id: "kaelte",
      titel: "Arbeiten Solarmodule bei Kälte besser?",
      tocLabel: "Kälte-Effekt",
      bloecke: [
        {
          typ: "p",
          text: "**Ja: Kristalline Solarmodule verlieren je Grad Zelltemperatur über 25 °C rund 0,3 bis 0,4 % Leistung – und gewinnen im gleichen Maß, wenn es kälter ist.** Datenblätter nennen dafür den Temperaturkoeffizienten der Leistung (Pmax). Moderne TOPCon- und Heterojunction-Zellen liegen am unteren Ende dieser Spanne.",
        },
        {
          typ: "tabelle",
          caption: "Leistung eines Moduls in Abhängigkeit von der Zelltemperatur (Temperaturkoeffizient −0,30 %/K, gleiche Einstrahlung)",
          kopf: ["Zelltemperatur", "Typische Situation", "Leistung relativ zur Nennleistung"],
          zeilen: [
            ["65 °C", "heißer Sommertag, Modul in voller Sonne", "88 %"],
            ["25 °C", "Standard-Testbedingungen (STC)", "100 %"],
            ["5 °C", "sonniger Wintertag, Modul erwärmt", "106 %"],
            ["−5 °C", "klarer Frostmorgen", "109 %"],
          ],
          hervorheben: 2,
          minBreite: 520,
          fussnote: "Rechenbeispiel. Die tatsächliche Leistung hängt vor allem von der Einstrahlung ab, die im Winter deutlich geringer ist. Die Zellen erwärmen sich in der Sonne auch bei Frost um einige bis viele Grad über die Lufttemperatur.",
        },
        {
          typ: "p",
          text: "Der Kälteeffekt ist deshalb eher eine Randnotiz für den Ertrag: Er verbessert die Ausbeute der wenigen Sonnenstunden, gleicht aber das fehlende Licht nicht aus. Für die **Planung** ist Kälte dagegen wichtig: Bei tiefen Temperaturen steigt die Leerlaufspannung der Module. Die Strings müssen so ausgelegt sein, dass die maximale Eingangsspannung des [Wechselrichters](/ratgeber/wechselrichter-photovoltaik) auch an einem klaren Frostmorgen nicht überschritten wird.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Schnee kann auch helfen",
          text: "Liegt Schnee um die Anlage herum, reflektiert er Licht. Davon profitieren vor allem [bifaziale Module](/wissen/lexikon#bifazial), die auch über die Rückseite Strom erzeugen – etwa auf aufgeständerten Flachdachanlagen oder Carports mit Abstand zum Boden.",
        },
      ],
    },
    {
      id: "schnee",
      titel: "Schnee auf der Solaranlage: Räumen oder liegen lassen?",
      tocLabel: "Schnee",
      bloecke: [
        {
          typ: "p",
          text: "**Lassen Sie den Schnee in aller Regel liegen.** Auf geneigten Dächern rutscht er meist innerhalb weniger Tage ab, weil die glatten Glasflächen sich in der Sonne erwärmen und das Tauwasser eine Gleitschicht bildet. Der Ertrag, der in dieser Zeit verloren geht, ist klein – im Dezember erzeugt die Anlage ohnehin nur einen Bruchteil ihres Jahresertrags.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Nicht aufs Dach steigen:** Schnee und Eis machen Dächer lebensgefährlich. Arbeiten gehören in die Hände von Fachleuten mit Absturzsicherung.",
            "**Keine Schaufeln, Schaber oder Hochdruckreiniger:** Sie zerkratzen das Glas und können unsichtbare Mikrorisse in den Zellen verursachen.",
            "**Kein heißes Wasser:** Temperaturschocks belasten Glas und Zellen.",
            "**Nur vom Boden aus und nur mit weichen Teleskopbesen** – und nur, wenn Sie sicher stehen und keine Leitungen in der Nähe sind.",
            "**Vorsicht vor Dachlawinen:** Rutscht Schnee von der glatten Modulfläche, kann er Wege, Eingänge oder Autos treffen. Schneefanggitter an der Traufe schützen darunterliegende Bereiche.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Schneelast: Wann es kritisch wird",
          text: "Solarmodule werden nach IEC 61215 mechanisch geprüft, viele Hersteller geben Belastbarkeiten von 5.400 Pa auf der Vorderseite an. Entscheidend ist aber die Statik des Daches und der Unterkonstruktion, die in schneereichen Regionen nach der Schneelastzone (DIN EN 1991-1-3) ausgelegt sein muss. Auf Flachdächern sammelt sich Schnee zwischen den Modulreihen – mehr dazu im Ratgeber [Photovoltaik auf dem Flachdach](/ratgeber/photovoltaik-flachdach).",
        },
        {
          typ: "p",
          text: "Schneedruck ist in einer guten Photovoltaik- oder Allgefahrenversicherung meist mitversichert, in der Wohngebäudeversicherung nicht immer. Schäden durch unsachgemäßes Räumen sind dagegen oft ausgeschlossen. Was eine gute Police abdecken sollte, lesen Sie im Ratgeber [Photovoltaik-Versicherung](/ratgeber/photovoltaik-versicherung).",
        },
      ],
    },
    {
      id: "speicher-waermepumpe",
      titel: "Stromspeicher und Wärmepumpe im Winter",
      tocLabel: "Speicher & Wärmepumpe",
      bloecke: [
        {
          typ: "p",
          text: `**Im Winter wird ein Stromspeicher an vielen Tagen nicht voll, und eine Wärmepumpe läuft überwiegend mit Netzstrom.** Das ist kein Planungsfehler, sondern Physik: Ein Haushalt mit 4.500 kWh Jahresverbrauch braucht im Monatsschnitt rund 375 kWh, im Winter eher mehr. Eine Wärmepumpe im Einfamilienhaus benötigt zusätzlich typischerweise rund ${SPEICHER.wpStromKwh.toLocaleString("de-DE")} kWh im Jahr, den größten Teil davon zwischen November und März.`,
        },
        { typ: "h3", text: "Was Messungen zeigen" },
        {
          typ: "liste",
          punkte: [
            "Im Feldtest des **Fraunhofer ISE** an einem sanierten Einfamilienhaus aus den 1960er-Jahren mit 12,3 kWp, Speicher und Erdwärmepumpe stammten übers Jahr rund **36 % des Wärmepumpenstroms** direkt aus der PV-Anlage. Im Winter wurde der wenige Solarstrom nahezu vollständig selbst genutzt, im Sommer floss trotz Speicher Überschuss ins Netz.",
            "Die **HTW Berlin** hat Messdaten von 730 Haushalten ausgewertet: Voll elektrifizierte Häuser mit PV, Speicher, E-Auto und Wärmepumpe decken im Mittel **59 % ihres jährlichen Strombedarfs** mit eigenem Solarstrom – im Winter reicht er für Haushalt, Auto und Heizung in der Regel nicht aus.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Speicher richtig aufstellen",
          text: "Lithium-Speicher mögen es kühl, aber nicht frostig. In unbeheizten Garagen drosseln viele Geräte bei Kälte die Ladeleistung oder heizen sich selbst. Ideal ist ein frostfreier, trockener Raum. Welche Speicherchemie wie altert, erklärt der Ratgeber [Stromspeicher-Lebensdauer](/ratgeber/stromspeicher-lebensdauer).",
        },
        {
          typ: "p",
          text: "Wer Wärmepumpe und PV kombiniert, sollte deshalb nicht auf maximale Winterautarkie planen, sondern auf ein gutes Gesamtjahr: Die Wärmepumpe profitiert in der Übergangszeit und bei der Warmwasserbereitung im Sommer, im Hochwinter helfen ein günstiger Wärmepumpentarif, die Netzentgeltreduzierung nach [§ 14a EnWG](/ratgeber/paragraf-14a-enwg) oder ein [dynamischer Stromtarif](/ratgeber/dynamischer-stromtarif-lohnt-sich). Details im Ratgeber [Wärmepumpe mit Photovoltaik](/ratgeber/waermepumpe-mit-photovoltaik).",
        },
        { typ: "tool", href: "/rechner/waermepumpe", titel: "Wärmepumpe mit PV durchrechnen", text: "Heizkosten, Stromverbrauch und Solaranteil für Ihr Haus – mit und ohne Speicher.", label: "Zum Wärmepumpen-Rechner" },
      ],
    },
    {
      id: "tipps",
      titel: "So holen Sie im Winter mehr aus Ihrer Anlage",
      tocLabel: "Tipps",
      bloecke: [
        {
          typ: "liste",
          nummeriert: true,
          punkte: [
            "**Verbrauch in die Mittagsstunden legen:** Waschmaschine, Spülmaschine und Trockner an sonnigen Wintertagen zwischen 11 und 14 Uhr starten.",
            "**Warmwasser mittags bereiten:** Die Wärmepumpe über SG-Ready oder ein Energiemanagement bei Sonnenschein anheben lassen.",
            "**E-Auto gezielt laden:** An klaren Tagen mittags per Überschussladen, sonst in günstigen Stunden eines dynamischen Tarifs. Mehr unter [PV-Überschussladen](/ratgeber/pv-ueberschussladen).",
            "**Monitoring im Blick behalten:** Liefert die Anlage nach Schneeschmelze oder an klaren Tagen auffällig wenig, kann eine Störung dahinterstecken.",
            "**Verschattung im Winter prüfen:** Neue Äste oder Bauten fallen bei tiefer Sonne zuerst ins Gewicht.",
            "**Bei der Planung an den Winter denken:** Steile Süd- oder Fassadenflächen erhöhen den Winteranteil, Ost-West-Flächen den Sommer- und Tagesrandanteil.",
          ],
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Lohnt sich Photovoltaik trotzdem?",
          text: "Ja – die geringeren Wintererträge sind in jeder seriösen Wirtschaftlichkeitsrechnung bereits enthalten, denn gerechnet wird mit dem Jahresertrag. Rund zwei Drittel bis drei Viertel des Stroms entstehen von April bis September. Die Gesamtrechnung finden Sie im Ratgeber [Lohnt sich Photovoltaik?](/ratgeber/photovoltaik-lohnt-sich).",
        },
      ],
    },
  ],

  faq: [
    { q: "Wie viel Strom produziert eine 10-kWp-Anlage im Winter?", a: `Von November bis Februar in Süddeutschland rund ${zahl(summe("sued30", NOV_FEB))} kWh bei einem Süddach, in Norddeutschland etwa ${zahl(summe("nord30", NOV_FEB))} kWh. Im Dezember sind es im Süden rund ${zahl(monat("sued30", 11))} kWh, im Norden rund ${zahl(monat("nord30", 11))} kWh.` },
    { q: "Produziert eine Solaranlage bei bewölktem Himmel Strom?", a: "Ja, auch diffuses Licht wird genutzt. Die Leistung sinkt bei dichter Bewölkung aber auf einen kleinen Bruchteil der Nennleistung. An trüben Wintertagen erzeugt eine Anlage deshalb oft nur sehr wenig." },
    { q: "Muss ich Schnee von der PV-Anlage entfernen?", a: "In der Regel nicht. Auf geneigten Dächern rutscht Schnee meist von selbst ab. Steigen Sie wegen der Absturzgefahr nicht aufs Dach und verwenden Sie keine harten Werkzeuge – das Risiko für Mensch und Module ist größer als der Ertragsgewinn." },
    { q: "Sind Solarmodule bei Kälte effizienter?", a: "Ja. Kristalline Module gewinnen je Grad unter 25 °C Zelltemperatur rund 0,3 bis 0,4 % Leistung. Im Winter überwiegt aber der Nachteil der geringen Einstrahlung." },
    { q: "Welcher Neigungswinkel ist für den Winter am besten?", a: "Im Winter bringen steile Neigungen von 60 Grad und mehr den höchsten Ertrag, weil die Sonne tief steht. Übers Jahr gerechnet sind 30 bis 35 Grad optimal. Fassadenmodule sind eine Option, wenn gezielt Winterstrom gewünscht ist." },
    { q: "Lohnt sich ein Stromspeicher im Winter?", a: "Im Hochwinter wird ein Speicher an vielen Tagen nicht voll. Seinen Nutzen entfaltet er vor allem von März bis Oktober. Die Größe sollte deshalb nicht auf den Winter, sondern auf das Jahresprofil ausgelegt werden – der [Stromspeicher-Rechner](/rechner/stromspeicher) hilft dabei." },
    { q: "Deckt Photovoltaik im Winter den Strom für die Wärmepumpe?", a: "Nur zu einem kleinen Teil. Übers Jahr kann eine PV-Anlage in Messungen etwa ein Drittel des Wärmepumpenstroms liefern, im Hochwinter deutlich weniger. Günstige Wärmepumpentarife oder dynamische Tarife ergänzen die Anlage sinnvoll." },
  ],

  passend: [
    { href: "/ratgeber/waermepumpe-mit-photovoltaik", titel: "Wärmepumpe mit Photovoltaik", text: "Realistischer Solaranteil und Auslegung." },
    { href: "/ratgeber/photovoltaik-ertrag-pro-kwp", titel: "Photovoltaik-Ertrag pro kWp", text: "Erträge nach Region, Ausrichtung und Neigung." },
    { href: "/ratgeber/photovoltaik-reinigung-wartung", titel: "PV-Reinigung und Wartung", text: "Was nötig ist und was Sie sich sparen können." },
    { href: "/energie-live", titel: "Energie live", text: "Aktuelle Solarerzeugung in Deutschland." },
  ],

  quellen: [
    { titel: "Joint Research Centre der EU-Kommission – PVGIS 5.3, Monatserträge für Türkheim und Hamburg", url: "https://re.jrc.ec.europa.eu/pvg_tools/de/", stand: "09/2026" },
    { titel: "pv magazine – Fraunhofer ISE: Wärmepumpen in Verbindung mit Photovoltaik plus Speicher erreichen höhere Jahresarbeitszahl", url: "https://www.pv-magazine.de/2024/04/03/waermepumpen-fuer-wohngebaeude-in-verbindung-mit-photovoltaik-plus-speicher-erreichen-hoehere-jahresarbeitszahl/", stand: "04/2024" },
    { titel: "HTW Berlin – Solares Laden von Elektrofahrzeugen (Auswertung von 730 Haushalten)", url: "https://solar.htw-berlin.de/studien/solares-laden-von-elektrofahrzeugen/", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Aktuelle Fakten zur Photovoltaik in Deutschland", url: "https://www.ise.fraunhofer.de/de/veroeffentlichungen/studien/aktuelle-fakten-zur-photovoltaik-in-deutschland.html", stand: "09/2026" },
    { titel: "Verbraucherzentrale – Photovoltaik: Garantie- und Versicherungsbedingungen genau lesen", url: "https://www.verbraucherzentrale.de/wissen/energie/erneuerbare-energien/photovoltaik-garantie-und-versicherungsbedingungen-genau-lesen-6700", stand: "11/2024" },
  ],

  seitenCta: { titel: "Ganzjährig gerechnet", text: "Ertrag, Autarkie und Amortisation übers Jahr.", href: "/solarrechner", label: "Zum Solarrechner" },
  cta: {
    title: "Wir planen Ihre Anlage fürs ganze Jahr.",
    text: "Mit realistischen Monatswerten, passender Speichergröße und einem Blick auf Wärmepumpe und E-Auto – statt Versprechen für den Sommer.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Selbst rechnen", href: "/solarrechner" },
  },
};

export default artikel;
