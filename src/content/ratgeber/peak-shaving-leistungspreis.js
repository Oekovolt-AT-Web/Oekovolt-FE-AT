// Ratgeber: Peak Shaving und Leistungspreis in Österreich
// Netzentgelte 2026 aus der SNE-V 2018 in der Fassung BGBl. II Nr. 305/2025,
// Regeln ab 2027 laut ElWG (BGBl. I Nr. 91/2025) und SNE-G-V-Begutachtungsentwurf der E-Control.
// Lastgang, Energiepreis, Speicherpreis und Betriebskosten sind offengelegte Annahmen (Beispiel).

const fmt = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (n) => `${fmt(Math.round(n))} €`;
const eur2 = (n) => `${fmt(n, 2)} €`;
const kw = (n) => `${fmt(Math.round(n))} kW`;
const ctF = (n, d = 2) => `${fmt(n, d)} ct`;
const jahre = (x) => `${fmt(x, 1)} Jahre`;
const jahreD = (x) => `${fmt(x, 1)} Jahren`;
const mittel = (arr) => arr.reduce((s, x) => s + x, 0) / arr.length;

// Netznutzungsentgelt 2026 je Netzbereich: [Leistungspreis €/kW und Jahr, Arbeitspreis ct/kWh]
const NETZ_2026 = [
  { bereich: "Burgenland", ne5: [100.56, 2.98], ne6: [87.96, 3.79], ne7: [76.56, 5.83] },
  { bereich: "Kärnten", ne5: [75.12, 2.1], ne6: [75.48, 2.33], ne7: [112.32, 5.47] },
  { bereich: "Klagenfurt", ne5: [78.36, 1.98], ne6: [84.6, 3.14], ne7: [95.16, 4.36] },
  { bereich: "Niederösterreich", ne5: [72.48, 1.5], ne6: [74.28, 2.56], ne7: [56.04, 6.65] },
  { bereich: "Oberösterreich", ne5: [57.72, 1.29], ne6: [65.88, 2.37], ne7: [52.56, 4.68] },
  { bereich: "Linz", ne5: [60.24, 1.45], ne6: [63.96, 2.74], ne7: [65.04, 3.26] },
  { bereich: "Salzburg", ne5: [64.2, 1.68], ne6: [66.6, 2.86], ne7: [71.64, 3.91] },
  { bereich: "Steiermark", ne5: [58.44, 1.89], ne6: [64.56, 2.77], ne7: [68.76, 6.78] },
  { bereich: "Graz", ne5: [39.96, 1.31], ne6: [38.64, 1.9], ne7: [46.92, 4.23] },
  { bereich: "Tirol", ne5: [66.48, 1.73], ne6: [72.12, 2.95], ne7: [70.92, 3.66] },
  { bereich: "Innsbruck", ne5: [43.44, 2.29], ne6: [54.24, 2.9], ne7: [84.12, 5.72] },
  { bereich: "Vorarlberg", ne5: [37.32, 1.54], ne6: [58.44, 2.42], ne7: [63.84, 2.84] },
  { bereich: "Wien", ne5: [55.32, 1.31], ne6: [59.52, 1.93], ne7: [82.92, 4.21] },
];
const OOE = NETZ_2026.find((b) => b.bereich === "Oberösterreich");
const LP = OOE.ne6[0]; // €/kW und Jahr
const AP = OOE.ne6[1]; // ct/kWh
const LP_MONAT = LP / 12;
const LP_NE7_KTN = NETZ_2026.find((b) => b.bereich === "Kärnten").ne7[0];
const LP_NE5_VBG = NETZ_2026.find((b) => b.bereich === "Vorarlberg").ne5[0];
const ALLE_LP = NETZ_2026.flatMap((b) => [b.ne5[0], b.ne6[0], b.ne7[0]]);
const LP_MIN = Math.min(...ALLE_LP);
const LP_MAX = Math.max(...ALLE_LP);

// Variable Bezugskosten je kWh (ohne USt) für das Beispiel
const NETZVERLUST = 0.454; // ct/kWh, NE 6 Oberösterreich 2026
const ELEKTRIZITAETSABGABE = 1.5; // ct/kWh, Regelsatz (Annahme, mit Steuerberatung prüfen)
const ENERGIEPREIS = 13.0; // ct/kWh, Annahme (Day-Ahead-Mittel 2026 rund 12,1 ct plus Beschaffungsaufschlag)
const BEZUG = ENERGIEPREIS + AP + NETZVERLUST + ELEKTRIZITAETSABGABE;
const EINSPEISUNG = 7.3; // ct/kWh, OeMAG-Marktpreis PV Ø Jänner–August 2026
const ETA = 0.9; // Wirkungsgrad Laden + Entladen (Annahme)

// Beispiel-Lastgang: monatliche Viertelstundenmaxima eines Betriebs auf NE 6 (Annahme)
const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const SPITZEN = [500, 495, 485, 475, 470, 475, 470, 440, 475, 480, 495, 500];
const SCHWELLE = 400;
const GEKAPPT = SPITZEN.map((s) => Math.min(s, SCHWELLE));
const OHNE = mittel(SPITZEN);
const MIT = mittel(GEKAPPT);
const SENKUNG = OHNE - MIT;
const MAX_UEBER = Math.max(...SPITZEN) - SCHWELLE;
const ERSPARNIS_LP = SENKUNG * LP;
const AUSREISSER = (MAX_UEBER / 12) * LP;

// Speicher abschätzen
const E_UEBER = 95; // kWh, größte Tagesenergie über der Schwelle (Annahme aus Lastgang)
const RESERVE = 1.25; // Zuschlag für Prognosefehler und Regelreserve
const SOH_ENDE = 0.8; // nutzbare Restkapazität am Ende der Nutzungsdauer
const KAP_MIN = (E_UEBER * RESERVE) / SOH_ENDE;
const KAP = 200; // kWh nutzbar
const LEISTUNG = 100; // kW
const PREIS_KWH = 400; // €/kWh nutzbar, Richtwert schlüsselfertig exkl. USt
const BETRIEB_ANTEIL = 0.015; // Wartung, Versicherung, Software pro Jahr (Annahme)
const INVEST = KAP * PREIS_KWH;

// Nutzen
const PS_DURCHSATZ = 10000; // kWh/Jahr, die für Peak Shaving ein- und ausgespeichert werden (Annahme)
const PS_VERLUST = (PS_DURCHSATZ * (1 / ETA - 1) * BEZUG) / 100;
const EV_KWH = 25000; // kWh/Jahr aus PV-Überschuss entladen (Annahme)
const EV_NUTZEN = (EV_KWH * (BEZUG - EINSPEISUNG / ETA)) / 100;
const SPOT_TAGE = 100;
const SPOT_KWH = 100;
const SPREAD = 14.2; // ct/kWh, Ø 2 teuerste minus 2 billigste Stunden AT 2026 (eigene Auswertung Energy-Charts)
const REALISIERUNG = 0.5;
const SPOT_NUTZEN = (SPOT_TAGE * SPOT_KWH * (SPREAD * REALISIERUNG - (1 / ETA - 1) * BEZUG)) / 100;

function variante(preisKwh, mitEv, mitSpot) {
  const invest = KAP * preisKwh;
  const netto = ERSPARNIS_LP - PS_VERLUST - invest * BETRIEB_ANTEIL + (mitEv ? EV_NUTZEN : 0) + (mitSpot ? SPOT_NUTZEN : 0);
  return { invest, netto, amort: invest / netto };
}
const V_PS = variante(PREIS_KWH, false, false);
const V_EV = variante(PREIS_KWH, true, false);
const V_ALLE = variante(PREIS_KWH, true, true);
const PREISE = [300, 400, 500];

// Lastmanagement ohne Speicher und E-Flotte
const ANLAUF_KW = 40;
const LADEPUNKTE = 10;
const LADELEISTUNG = 11;
const FLOTTE_KW = LADEPUNKTE * LADELEISTUNG;

const artikel = {
  slug: "peak-shaving-leistungspreis",
  title: "Peak Shaving und Leistungspreis: Lastspitzen im Betrieb senken",
  seoTitle: "Peak Shaving & Leistungspreis in Österreich | Ökovolt",
  kurzTitel: "Peak Shaving & Leistungspreis",
  description:
    "Peak Shaving senkt den Leistungspreis: wie Österreich Lastspitzen abrechnet, Netzentgelte 2026 je Netzebene, Neuerungen ab 2027 und eine Beispielrechnung.",
  excerpt:
    "Wie der Leistungspreis in Österreich berechnet wird, was eine Lastspitze kostet, wann Lastmanagement reicht und ab wann sich ein Batteriespeicher für Peak Shaving rechnet – mit Netzentgelten 2026 und Beispiel aus Oberösterreich.",
  hauptKeyword: "peak shaving",
  keywords: [
    "Peak Shaving",
    "Leistungspreis Österreich",
    "Lastspitzen senken",
    "Leistungspreis Strom Gewerbe",
    "Netznutzungsentgelt Leistungskomponente",
    "Lastmanagement Betrieb",
    "Leistungspreis 2027",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/AT/ratgeber/hochspannungsleitung-molln.jpg",
  bildAlt: "Hochspannungsleitung über einer Wiese bei Molln in Oberösterreich",
  badge: { wert: `${fmt(LP, 2)} €`, text: "je kW und Jahr: Leistungspreis NE 6, Netzbereich Oberösterreich 2026" },

  kurzFazit: [
    `**Leistungsgemessene Betriebe zahlen in Österreich 2026 einen Leistungspreis auf den Mittelwert ihrer zwölf monatlichen Viertelstundenmaxima** – auf Netzebene 6 im Netzbereich Oberösterreich ${eur2(LP)} je kW und Jahr.`,
    `Jede Monatsspitze zählt nur zu einem Zwölftel: Ein einzelner Ausreißer um ${kw(MAX_UEBER)} kostet im Beispiel rund ${eur(AUSREISSER)} im Jahr, eine dauerhaft um ${kw(SENKUNG)} gesenkte Spitze spart ${eur(ERSPARNIS_LP)}.`,
    "**Ab 1. Jänner 2027** wird laut ElWG und SNE-G-V-Entwurf monatlich abgerechnet (höchster Viertelstundenwert × Monatsleistungspreis) und der Leistungspreis gilt auch auf Netzebene 7 – also auch für kleinere Betriebe.",
    `Peak Shaving mit Speicher allein amortisiert sich im Beispiel (${fmt(KAP)} kWh, ${eur(INVEST)}) erst nach rund ${jahreD(V_PS.amort)}; kombiniert mit Eigenverbrauch und Spotpreis-Optimierung nach rund ${jahreD(V_ALLE.amort)}.`,
    "**Lastmanagement kommt zuerst:** Gestaffelte Anläufe, gesteuertes Laden und verschobene Prozesse senken Spitzen oft ohne nennenswerte Investition.",
  ],

  abschnitte: [
    {
      id: "leistungspreis",
      titel: "Wie wird der Leistungspreis in Österreich berechnet?",
      tocLabel: "Leistungspreis erklärt",
      bloecke: [
        {
          typ: "p",
          text: "**Das Netznutzungsentgelt besteht in Österreich aus einer Arbeitskomponente in Cent je kWh und – für leistungsgemessene Kunden – einer Leistungskomponente in Euro je kW, abgerechnet auf den Mittelwert der monatlich gemessenen höchsten Viertelstundenleistung.** Die Tarife legt die E-Control per Verordnung fest (SNE-V 2018, für 2026 geändert mit BGBl. II Nr. 305/2025); verrechnet werden sie vom Netzbetreiber.",
        },
        {
          typ: "p",
          text: "Eine Leistungsmessung mit Lastprofilzähler ist Pflicht, wenn ein Zählpunkt mehr als 100.000 kWh im Jahr bezieht oder mehr als 50 kW Anschlussleistung hat. Darunter gilt ein standardisiertes Lastprofil; auf Netzebene 7 ohne Leistungsmessung wird 2026 statt eines Leistungspreises eine Pauschale von 54 € im Jahr verrechnet. Welche Kennzahlen dabei zählen, erklärt das Lexikon unter [Leistungspreis](/wissen/lexikon#leistungspreis) und [Lastprofil](/wissen/lexikon#lastprofil).",
        },
        {
          typ: "tabelle",
          caption: "So wird die Leistungskomponente abgerechnet – bis Ende 2026 und ab 2027, Stand September 2026",
          kopf: ["", "Bis 31.12.2026 (SNE-V 2018)", "Ab 1.1.2027 (ElWG, SNE-G-V-Entwurf)"],
          zeilen: [
            ["Messgröße", "höchste Viertelstundenleistung je Monat", "höchste Viertelstundenleistung je Monat am Hauptzählpunkt"],
            ["Verrechnung", "Mittelwert der 12 Monatsmaxima × Jahresleistungspreis", "Monatsmaximum × Monatsleistungspreis, jeden Monat"],
            ["Netzebene 7", "nur bei Leistungsmessung; sonst Pauschale 54 €/Jahr", "Leistungspreis für alle, zwei Preisstufen (bis 10 kW und darüber)"],
            ["Untergrenze", "–", "mind. 20 % der vereinbarten netzwirksamen Leistung, mind. 2 kW"],
            ["Flexibilität", "–", "flexible Entnahme: vereinbarter Leistungsanteil mit Abschlag auf den Leistungspreis"],
          ],
          minBreite: 640,
          fussnote: "Regeln ab 2027 laut ElWG (BGBl. I Nr. 91/2025) und Begutachtungsentwurf der SNE-G-V; die Tarifwerte 2027 folgen in der SNE-T-V (Entwurf voraussichtlich Oktober, final Dezember 2026). Keine Rechtsberatung.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Anders als in Deutschland: Jede Spitze zählt nur ein Zwölftel",
          text: `In Deutschland bestimmt meist die höchste Viertelstunde des Jahres den Leistungspreis, in Österreich fließt jedes Monatsmaximum nur zu einem Zwölftel ein. Ein Kilowatt weniger Spitze in einem einzigen Monat ist auf Netzebene 6 in Oberösterreich also ${eur2(LP_MONAT)} wert, ein Kilowatt weniger in allen zwölf Monaten ${eur2(LP)}. Daraus folgt: Peak Shaving muss **jeden Monat** funktionieren. Ein einzelner Ausreißer ist weniger teuer als in Deutschland, regelmäßige Spitzen aber kosten voll.`,
        },
      ],
    },
    {
      id: "netzebenen",
      titel: "Leistungspreise 2026 nach Netzebene und Netzbereich",
      tocLabel: "Netzentgelte 2026",
      bloecke: [
        {
          typ: "p",
          text: `**2026 liegt der Leistungspreis für leistungsgemessene Betriebe je nach Netzbereich und Netzebene zwischen ${eur2(LP_MIN)} und ${eur2(LP_MAX)} je kW und Jahr.** Entscheidend ist, wo Ihr Betrieb angeschlossen ist: Netzebene 7 ist die Niederspannung bis 1 kV, Netzebene 6 die Umspannung von Mittel- auf Niederspannung (Anschluss direkt an der Trafostation) und Netzebene 5 die Mittelspannung über 1 kV bis 36 kV, meist mit eigener Trafostation. Details zu den Ebenen erklärt das Lexikon unter [Netzebene](/wissen/lexikon#netzebene).`,
        },
        {
          typ: "tabelle",
          caption: "Netznutzungsentgelt 2026: Leistungspreis (€/kW und Jahr) und Arbeitspreis NE 6, Stand September 2026",
          kopf: ["Netzbereich", "LP NE 5", "LP NE 6", "LP NE 7 (gemessen)", "AP NE 6 (ct/kWh)"],
          zeilen: NETZ_2026.map((b) => [b.bereich, fmt(b.ne5[0], 2), fmt(b.ne6[0], 2), fmt(b.ne7[0], 2), fmt(b.ne6[1], 2)]),
          hervorheben: 2,
          markierteZeile: 4,
          minBreite: 640,
          fussnote: "Quelle: SNE-V 2018 idF BGBl. II Nr. 305/2025 (gültig 1.1.–31.12.2026). Nur Netznutzungsentgelt, ohne Netzverlustentgelt, Messentgelt, Energiepreis, Abgaben und USt. In der Verordnung sind die Leistungspreise in Cent je kW und Jahr angegeben. Städtische Netzbereiche (z. B. Linz, Graz, Innsbruck, Klagenfurt) haben eigene Tarife.",
        },
        {
          typ: "p",
          text: `Die Spannweite ist beträchtlich: Ein Betrieb, der auf Netzebene 7 mit Leistungsmessung in Kärnten angeschlossen ist, zahlt ${eur2(LP_NE7_KTN)} je kW und Jahr – rund ${fmt(LP_NE7_KTN / LP_NE5_VBG)}-mal so viel wie ein Betrieb auf Netzebene 5 in Vorarlberg (${eur2(LP_NE5_VBG)}). Bei einem Wechsel der Anschlussebene, etwa mit eigener Trafostation, zählen Leistungs- und Arbeitspreis gemeinsam mit den Trafokosten.`,
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Was Peak Shaving nicht beeinflusst",
          text: "Netzverlustentgelt, Elektrizitätsabgabe und Energiepreis werden je kWh verrechnet und sinken durch eine gekappte Spitze nicht. Ladeverluste des Speichers erhöhen den Bezug sogar leicht – die Beispielrechnung berücksichtigt das.",
        },
      ],
    },
    {
      id: "ab-2027",
      titel: "Was sich ab 2027 beim Leistungspreis ändert",
      tocLabel: "Neu ab 2027",
      bloecke: [
        {
          typ: "p",
          text: "**Ab 1. Jänner 2027 wird der Leistungspreis laut ElWG und dem Verordnungsentwurf der E-Control monatlich abgerechnet und auf alle Netzebenen ausgedehnt, auch auf die Niederspannung.** Das Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025) löst das ElWOG 2010 ab; der Netzentgelte-Teil gilt ab 2027. Die Systematik legt die Systemnutzungsentgelte-Grundsätze-Verordnung (SNE-G-V) fest, deren Entwurf im Sommer 2026 in Begutachtung war.",
        },
        {
          typ: "liste",
          punkte: [
            "**Monatliche Abrechnung:** höchster Viertelstundenwert des Monats am Hauptzählpunkt × Monatsleistungspreis. Jeder Monat zählt weiterhin für sich.",
            "**Leistungspreis auch auf Netzebene 7:** laut Entwurf mit zwei Preisstufen (bis 10 kW und darüber). Lastspitzen werden damit auch für Handwerk, Büros und Landwirtschaft ohne Lastprofilzähler zum Kostenfaktor.",
            "**Mindestbemessung:** mindestens 20 % der vereinbarten netzwirksamen Leistung, mindestens 2 kW. Spitzen darunter zu drücken, bringt nichts.",
            "**Mehr Gewicht auf der Leistung:** Laut Branchenberichten soll sich das Verhältnis von Leistungs- zu Arbeitsanteil schrittweise von etwa 30/70 Richtung 50/50 verschieben. Tarifwerte 2027 stehen erst mit der SNE-T-V fest.",
            "**Flexible Entnahme:** Darf der Netzbetreiber einen vereinbarten Leistungsanteil bis 6 Uhr des Vortags bis zu zweimal täglich für je bis zu 4 Stunden (NE 5–7) einschränken, wird dafür nur ein prozentueller Teil des Leistungspreises verrechnet (Erläuterungen: beispielhaft 25 %). Die Vereinbarung läuft grundsätzlich 10 Jahre.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Stand der Rechtslage",
          text: "Die SNE-G-V sollte bis Oktober 2026 erlassen werden, die Tarifwerte folgen in der SNE-T-V (Entwurf voraussichtlich Oktober, Verordnung voraussichtlich Dezember 2026). Bis dahin sind alle Aussagen zu 2027 Entwurfsstand. Planen Sie Investitionen mit den Werten 2026 und behandeln Sie 2027 als Szenario. Einen Überblick zum neuen Gesetz gibt der Ratgeber [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).",
        },
      ],
    },
    {
      id: "lastspitzen",
      titel: "Lastspitzen erkennen: Den Lastgang richtig auswerten",
      tocLabel: "Lastspitzen erkennen",
      bloecke: [
        {
          typ: "p",
          text: "**Wo Ihre Spitzen entstehen, zeigt nur der Lastgang: ein Jahr Viertelstundenwerte, also 35.040 Messwerte am Hauptzählpunkt.** Leistungsgemessene Kunden erhalten diese Daten vom Netzbetreiber, meist über dessen Kundenportal als Datei. Die Rechnung nennt nur das Monatsmaximum, nicht wann und wodurch es entstand.",
        },
        {
          typ: "tabelle",
          caption: "Typische Ursachen von Lastspitzen im Betrieb und passende Gegenmaßnahmen, Stand September 2026",
          kopf: ["Ursache", "Typisches Muster im Lastgang", "Erste Gegenmaßnahme"],
          zeilen: [
            ["Schichtbeginn", "steiler Anstieg Montag früh oder nach Pausen, wenn alle Anlagen gleichzeitig starten", "Anlaufreihenfolge festlegen, Maschinen zeitversetzt zuschalten"],
            ["Kompressoren, Pumpen", "kurze, hohe Spitzen durch gleichzeitigen Anlauf mehrerer Aggregate", "Verbundsteuerung, Sanftanlauf oder Frequenzumrichter"],
            ["Öfen, Trockner, Härterei", "hohe Dauerlast über Stunden beim Aufheizen", "Aufheizphasen verschieben oder staffeln, Leistung begrenzen"],
            ["E-Flotte laden", "Spitze bei Schichtende, wenn alle Fahrzeuge angesteckt werden", "Lademanagement mit Leistungsobergrenze"],
            ["Wärmepumpen, Heizstäbe", "Winterspitzen am Morgen, oft gemeinsam mit Produktionsstart", "Vorheizen in der Nacht, Sperrzeiten zur Spitzenzeit"],
            ["Kälte und Klima", "Sommerspitzen am Nachmittag", "Kältespeicher, Sollwerte zeitlich verschieben"],
          ],
          minBreite: 680,
          fussnote: "Allgemeine Erfahrungswerte, keine Messdaten eines bestimmten Betriebs.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Monatsmaxima markieren", "Je Monat die höchste Viertelstunde mit Datum und Uhrzeit notieren."],
            ["Spitzenbreite messen", "Wie viele Viertelstunden und wie viele kWh liegen über einer möglichen Schwelle? Das entscheidet zwischen Lastmanagement und Speicher."],
            ["Ursachen zuordnen", "Zeitpunkte mit Schichtplan, Maschinenlaufzeiten und Ladevorgängen abgleichen, bei Bedarf mit Unterzählern."],
          ],
        },
        {
          typ: "p",
          text: "Für die erste Auswertung genügt oft eine Tabellenkalkulation. Wie stark Preise und Erzeugung im Tagesverlauf schwanken, zeigt die Seite [Energie live](/energie-live).",
        },
      ],
    },
    {
      id: "ohne-speicher",
      titel: "Spitzen senken ohne Speicher: Lastmanagement zuerst",
      tocLabel: "Lastmanagement",
      bloecke: [
        {
          typ: "p",
          text: `**Das günstigste Kilowatt Spitze ist das, das gar nicht entsteht – deshalb steht Lastmanagement vor jeder Speicherinvestition.** Lassen sich etwa zwei Kompressoren und ein Ofen so staffeln, dass zum Schichtbeginn ${kw(ANLAUF_KW)} weniger gleichzeitig anlaufen, und gelingt das in jedem Monat, spart das auf Netzebene 6 in Oberösterreich rund ${eur(ANLAUF_KW * LP)} im Jahr – oft nur mit einer geänderten Steuerung.`,
        },
        {
          typ: "liste",
          punkte: [
            "**Anlaufstaffelung:** Große Verbraucher mit einigen Minuten Abstand starten, damit nicht alles in derselben Viertelstunde anläuft.",
            "**Lastabwurf:** Heizstäbe, Lüftungen, gepufferte Kälte oder Ladepunkte nahe der Schwelle kurz drosseln – siehe [Lastmanagement](/wissen/lexikon#lastmanagement).",
            `**Lademanagement für die E-Flotte:** ${fmt(LADEPUNKTE)} Ladepunkte zu je ${fmt(LADELEISTUNG)} kW ergeben ${kw(FLOTTE_KW)} Gleichzeitigkeitslast – fällt sie jeden Monat in die Spitze, bis zu ${eur(FLOTTE_KW * LP)} Leistungspreis im Jahr (NE 6 Oberösterreich). Steuerung erklärt der Ratgeber [E-Flotte mit PV laden](/ratgeber/e-flotte-laden-photovoltaik).`,
            "**Prozesse verschieben:** Aufheizen, Chargen oder Reinigung in Zeiten niedriger Grundlast legen.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Warum die PV-Anlage allein kaum hilft",
          text: "Eine Photovoltaikanlage senkt den Arbeitsbezug, aber selten das Monatsmaximum. Die Spitze tritt oft an Wintermorgen, vor Sonnenaufgang oder an trüben Tagen auf, wenn die Anlage kaum liefert – ein einziger solcher Tag je Monat genügt. Für eine verlässliche Kappung braucht es Steuerung oder Speicher.",
        },
      ],
    },
    {
      id: "speicher",
      titel: "Peak Shaving mit Batteriespeicher: So funktioniert es",
      tocLabel: "Peak Shaving mit Speicher",
      bloecke: [
        {
          typ: "p",
          text: "**Beim Peak Shaving entlädt ein Batteriespeicher genau dann, wenn die Leistung am Hauptzählpunkt eine festgelegte Schwelle überschreitet, sodass das Netz nur noch die Schwelle liefern muss.** Das Energiemanagementsystem misst dazu laufend die Leistung am Netzanschluss und regelt den Speicher im Sekundenbereich nach. Siehe auch [Peak Shaving](/wissen/lexikon#peak-shaving) im Lexikon.",
        },
        {
          typ: "p",
          text: `Für die Auslegung zählen zwei Größen: Die **Leistung** des Speichers muss mindestens die größte Überschreitung der Schwelle abdecken, die **Kapazität** die Energie über der Schwelle am schlimmsten Tag – plus Reserve für Prognosefehler und Alterung. Im Beispiel unten ergibt das: größte Überschreitung ${kw(MAX_UEBER)}, Energie über der Schwelle am ungünstigsten Tag ${fmt(E_UEBER)} kWh, mit ${fmt((RESERVE - 1) * 100)} % Reserve und ${fmt(SOH_ENDE * 100)} % Restkapazität am Lebensende mindestens ${fmt(Math.ceil(KAP_MIN))} kWh nutzbar.`,
        },
        {
          typ: "tabelle",
          caption: "Speichergröße für Peak Shaving abschätzen – Beispielbetrieb, Stand September 2026",
          kopf: ["Größe", "Ansatz", "Wert im Beispiel"],
          zeilen: [
            ["Schwelle (Zielspitze)", "aus Lastgang, so dass sie jeden Monat haltbar ist", kw(SCHWELLE)],
            ["Größte Überschreitung", "höchstes Monatsmaximum minus Schwelle", kw(MAX_UEBER)],
            ["Mindest-Entladeleistung", "≥ größte Überschreitung", kw(MAX_UEBER)],
            ["Energie über Schwelle", "Summe über der Schwelle am ungünstigsten Tag", `${fmt(E_UEBER)} kWh`],
            ["Mindestkapazität nutzbar", `× ${fmt(RESERVE, 2)} Reserve ÷ ${fmt(SOH_ENDE, 1)} Restkapazität`, `${fmt(Math.ceil(KAP_MIN))} kWh`],
            ["Gewählt", "größer, um zusätzlich PV-Überschuss zu speichern", `${fmt(KAP)} kWh / ${fmt(LEISTUNG)} kW`],
          ],
          hervorheben: 2,
          minBreite: 620,
          fussnote: "Energie über der Schwelle und Reservefaktor sind Annahmen für das Beispiel.",
        },
        {
          typ: "p",
          text: "Entscheidend ist die Form Ihrer Spitzen: Kurze Anlaufspitzen lassen sich mit wenig Kapazität und viel Leistung kappen, mehrstündige Plateaus kaum. Was ein Speicher dieser Größe kostet, zeigt der Ratgeber [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten); Systeme stellt die Seite [Gewerbespeicher](/gewerbespeicher) vor.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: `Beispielrechnung: ${kw(SENKUNG)} weniger Spitze in Oberösterreich`,
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Betrieb auf Netzebene 6 im Netzbereich Oberösterreich, der seine Monatsmaxima jeden Monat auf ${kw(SCHWELLE)} kappt, senkt die verrechnete Leistung im Beispiel um ${kw(SENKUNG)} und spart ${eur(ERSPARNIS_LP)} Leistungspreis im Jahr.** Der Betrieb ist ein angenommener Metallverarbeiter mit Zweischichtbetrieb, eigener PV-Anlage und Monatsspitzen zwischen ${kw(Math.min(...SPITZEN))} und ${kw(Math.max(...SPITZEN))}.`,
        },
        {
          typ: "tabelle",
          caption: `Monatliche Viertelstundenmaxima vor und nach Peak Shaving (Schwelle ${kw(SCHWELLE)}), Beispielbetrieb NE 6 Oberösterreich, Stand September 2026`,
          kopf: ["Monat", "Maximum ohne Speicher (kW)", "mit Speicher (kW)", "Senkung (kW)", "Wert der Senkung"],
          zeilen: [
            ...MONATE.map((m, i) => [m, fmt(SPITZEN[i]), fmt(GEKAPPT[i]), fmt(SPITZEN[i] - GEKAPPT[i]), eur((SPITZEN[i] - GEKAPPT[i]) * LP_MONAT)]),
            ["Mittelwert / Summe", fmt(OHNE), fmt(MIT), fmt(SENKUNG), eur(ERSPARNIS_LP)],
          ],
          markierteZeile: 12,
          hervorheben: 4,
          minBreite: 640,
          fussnote: `Angenommener Lastgang. Wert der Senkung = Senkung × ${eur2(LP)} ÷ 12 (Leistungspreis NE 6 Oberösterreich 2026, Mittelwert der Monatsmaxima). Verpasst der Speicher im Jänner die Spitze, steigt der Jahresmittelwert um ${fmt(MAX_UEBER / 12, 1)} kW – das kostet rund ${eur(AUSREISSER)}.`,
        },
        {
          typ: "p",
          text: `Dem stehen die Kosten des Speichers gegenüber. Angenommen sind ${fmt(KAP)} kWh nutzbar und ${fmt(LEISTUNG)} kW zu einem Richtwert von ${fmt(PREIS_KWH)} € je kWh schlüsselfertig, also ${eur(INVEST)} netto, dazu ${fmt(BETRIEB_ANTEIL * 100, 1)} % der Investition pro Jahr für Wartung, Versicherung und Software. Weil ein reiner Peak-Shaving-Speicher meist wenig arbeitet, rechnen wir zwei gestapelte Nutzen dazu: PV-Überschuss für den Eigenverbrauch und Spotpreis-Optimierung im Winter.`,
        },
        {
          typ: "tabelle",
          caption: `Wirtschaftlichkeit ${fmt(KAP)} kWh / ${fmt(LEISTUNG)} kW, NE 6 Oberösterreich, vor Steuern, Stand September 2026`,
          kopf: ["Position pro Jahr", "Nur Peak Shaving", "+ Eigenverbrauch", "+ Spotpreis"],
          zeilen: [
            ["Ersparnis Leistungspreis", eur(ERSPARNIS_LP), eur(ERSPARNIS_LP), eur(ERSPARNIS_LP)],
            ["Ladeverluste Peak Shaving", `−${eur(PS_VERLUST)}`, `−${eur(PS_VERLUST)}`, `−${eur(PS_VERLUST)}`],
            ["Wartung, Versicherung, Software", `−${eur(INVEST * BETRIEB_ANTEIL)}`, `−${eur(INVEST * BETRIEB_ANTEIL)}`, `−${eur(INVEST * BETRIEB_ANTEIL)}`],
            ["PV-Überschuss selbst genutzt", "–", eur(EV_NUTZEN), eur(EV_NUTZEN)],
            ["Spotpreis-Optimierung", "–", "–", eur(SPOT_NUTZEN)],
            ["Nettonutzen", eur(V_PS.netto), eur(V_EV.netto), eur(V_ALLE.netto)],
            ["Einfache Amortisation", jahre(V_PS.amort), jahre(V_EV.amort), jahre(V_ALLE.amort)],
          ],
          markierteZeile: 6,
          hervorheben: 3,
          minBreite: 640,
          fussnote: `Annahmen: variable Bezugskosten ${ctF(BEZUG)} je kWh (Energie ${ctF(ENERGIEPREIS, 1)} als Annahme, Netz-Arbeitspreis ${ctF(AP)}, Netzverlust ${ctF(NETZVERLUST, 3)}, Elektrizitätsabgabe ${ctF(ELEKTRIZITAETSABGABE, 1)}), alternativ Einspeisung zum OeMAG-Marktpreis Ø Jänner–August 2026 von ${ctF(EINSPEISUNG, 1)}, Wirkungsgrad ${fmt(ETA * 100)} %. Durchsatz Peak Shaving ${fmt(PS_DURCHSATZ)} kWh, Eigenverbrauch ${fmt(EV_KWH)} kWh; Spot: ${fmt(SPOT_TAGE)} Tage × ${fmt(SPOT_KWH)} kWh × ${ctF(SPREAD, 1)} (Ø zwei teuerste minus zwei billigste Stunden 2026, eigene Auswertung Energy-Charts) × ${fmt(REALISIERUNG * 100)} % Realisierung. Speicherpreis = Richtwert. Ohne Förderung, Steuern, Preissteigerung, Alterung.`,
        },
        {
          typ: "tabelle",
          caption: "Einfache Amortisation nach Speicherpreis – gleicher Beispielbetrieb, Stand September 2026",
          kopf: ["Speicherpreis (Richtwert)", "Investition", "Nur Peak Shaving", "Peak Shaving + Eigenverbrauch + Spot"],
          zeilen: PREISE.map((p) => {
            const a = variante(p, false, false);
            const b = variante(p, true, true);
            return [`${fmt(p)} €/kWh`, eur(a.invest), jahre(a.amort), jahre(b.amort)];
          }),
          markierteZeile: 1,
          hervorheben: 3,
          minBreite: 600,
          fussnote: "Gleiche Annahmen wie oben; Betriebskosten jeweils 1,5 % der Investition. Übliche Nutzungsdauern von Lithium-Eisenphosphat-Speichern liegen im Bereich von 10 bis 20 Jahren, abhängig von Zyklen und Betriebsweise.",
        },
        {
          typ: "kennzahl",
          wert: `${eur(INVEST / SENKUNG)}`,
          titel: "Speicherinvestition je Kilowatt gekappter Spitze im Beispiel",
          text: `Bei ${eur2(LP)} Leistungspreis je kW und Jahr dauert die Refinanzierung allein darüber mehr als ${fmt(Math.floor(INVEST / SENKUNG / LP))} Jahre.`,
        },
        {
          typ: "p",
          text: `Das Ergebnis ist typisch für Österreich: Bei Leistungspreisen um 60 bis 70 € je kW und Jahr auf Netzebene 5 und 6 trägt Peak Shaving einen Speicher selten allein. Es wird wirtschaftlich, wenn der Speicher zusätzlich Solarstrom verschiebt oder eine sonst nötige Erhöhung der Anschlussleistung vermeidet, etwa beim Ausbau der E-Flotte. Dann entfallen ein [Netzbereitstellungsentgelt](/wissen/lexikon#netzbereitstellungsentgelt) für die Mehrleistung und womöglich ein Trafotausch. Den Speichernutzen für Ihren Verbrauch können Sie mit dem [Stromspeicher-Rechner](/rechner/stromspeicher) überschlagen.`,
        },
      ],
    },
    {
      id: "stacking",
      titel: "Stacking: Peak Shaving mit Eigenverbrauch und Spotpreis kombinieren",
      tocLabel: "Nutzen kombinieren",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Speicher kann mehrere Aufgaben erfüllen, solange die Betriebsstrategie festlegt, wie viel Kapazität jederzeit für die nächste Spitze reserviert bleibt.** Dieses Stapeln von Nutzen heißt Stacking. Peak Shaving hat Vorrang, weil eine verpasste Spitze einen ganzen Monat teuer macht. Wie ein [Energiemanagementsystem](/ratgeber/energiemanagementsystem) die Strategien verbindet, erklärt der eigene Ratgeber.",
        },
        {
          typ: "karten",
          cols: 3,
          items: [
            { titel: "Reserve für die Spitze", text: "Vor bekannten Spitzenzeiten, etwa ab 5 Uhr vor Schichtbeginn, wird ein Mindest-Ladezustand gehalten. Im Winter lädt der Speicher dafür nachts aus dem Netz." },
            { titel: "Eigenverbrauch darüber", text: "Kapazität über der Reserve nimmt Mittagsüberschüsse der PV-Anlage auf und gibt sie abends ab – im Beispiel der größte Zusatznutzen." },
            { titel: "Spotpreis im Rest", text: "Mit spotpreisbasiertem Energievertrag lädt der Speicher billig und entlädt teuer. 2026 lag der Day-Ahead-Preis mittags (11–15 Uhr) im Mittel bei 62, abends (18–21 Uhr) bei 172 €/MWh (eigene Auswertung auf Basis Energy-Charts)." },
          ],
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler beim Peak Shaving",
      tocLabel: "Fehler & Grenzen",
      bloecke: [
        {
          typ: "p",
          text: "**Die meisten Peak-Shaving-Projekte scheitern nicht an der Batterie, sondern an Betriebsstrategie, Prognose und Messung.** Diese Punkte sollten Sie vor der Beauftragung klären:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Speicher leer zur Spitze:** Wird mittags für den Eigenverbrauch und abends für den Spotmarkt entladen, fehlt am Morgen die Reserve. Mindest-Ladezustand und Nachladen vor Spitzenzeiten gehören fest in die Regelung.",
            "**Schwelle zu ehrgeizig:** Eine Schwelle, die in einem Monat reißt, kostet dort die volle Überschreitung. Besser eine Schwelle, die jeden Monat hält.",
            "**Prognose fehlt:** Ohne Schichtplan, Wetter und Sonderproduktion reagiert der Speicher nur – eine einfache Tagesprognose hilft deutlich.",
            "**Messung falsch angebunden:** Die Regelung muss die Leistung am Hauptzählpunkt sehen, mit richtigem Wandlerverhältnis, Vorzeichen und schneller Abtastung. Ein falsch parametrierter Stromwandler macht die Steuerung wertlos.",
            "**Leistung zu klein oder Spitzen zu breit:** Übersteigt die Überschreitung die Entladeleistung oder dauert sie Stunden, bleibt ein Rest der Spitze – und der zählt voll.",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Vorgehen: In fünf Schritten zum Peak-Shaving-Konzept",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Rechnung und Lastgang prüfen", "Netzebene, Leistungspreis und Monatsmaxima ablesen, 12 Monate Lastgang anfordern."],
            ["Ursachen analysieren", "Spitzen nach Uhrzeit, Wochentag und Verbrauchern zuordnen."],
            ["Maßnahmen ohne Speicher umsetzen", "Anlaufstaffelung, Lademanagement, Prozessverschiebung – danach neu messen."],
            ["Speicher auslegen", "Schwelle, Leistung und Kapazität aus dem verbleibenden Lastgang ableiten, gestapelte Nutzen einrechnen."],
            ["Regelung abnehmen", "Messpunkt, Reservestrategie und Überwachung testen; erste Monatsmaxima gegen die Planung prüfen."],
          ],
        },
        {
          typ: "tool",
          href: "/gewerbespeicher",
          titel: "Gewerbespeicher für Ihren Lastgang",
          text: "Wir werten Ihren Lastgang aus und prüfen, ob Lastmanagement reicht oder ein Speicher mit Peak Shaving, Eigenverbrauch und Spotpreis-Optimierung sinnvoll ist.",
          label: "Zum Gewerbespeicher",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie wird der Leistungspreis in Österreich berechnet?",
      a: `Bis Ende 2026 wird für leistungsgemessene Kunden der Mittelwert der zwölf monatlichen Viertelstundenmaxima mit dem Jahresleistungspreis multipliziert. Auf Netzebene 6 im Netzbereich Oberösterreich sind das 2026 ${eur2(LP)} je kW und Jahr. Ab 2027 wird laut ElWG und SNE-G-V-Entwurf jeder Monat einzeln mit einem Monatsleistungspreis abgerechnet.`,
    },
    {
      q: "Ab wann zahlt ein Betrieb einen Leistungspreis?",
      a: "Bis Ende 2026 dann, wenn die Leistung gemessen wird – Pflicht ab mehr als 100.000 kWh Jahresverbrauch oder mehr als 50 kW Anschlussleistung. Kleinere Kunden auf Netzebene 7 zahlen eine Pauschale von 54 € im Jahr. Ab 2027 soll laut Entwurf ein Leistungspreis auf allen Netzebenen gelten, auf Netzebene 7 mit zwei Preisstufen.",
    },
    {
      q: "Lohnt sich ein Batteriespeicher nur für Peak Shaving?",
      a: `Selten. Im Beispiel mit ${fmt(KAP)} kWh und ${eur(INVEST)} Investition amortisiert sich reines Peak Shaving erst nach rund ${jahreD(V_PS.amort)}. Mit Eigenverbrauch und Spotpreis-Optimierung sind es rund ${jahre(V_ALLE.amort)}. Details zu den Kosten stehen im Ratgeber [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten).`,
    },
    {
      q: "Senkt eine Photovoltaikanlage den Leistungspreis?",
      a: "Kaum. Die Monatsspitze entsteht oft an Wintermorgen, bei Schichtbeginn oder an trüben Tagen, wenn die Anlage wenig erzeugt. Weil jeder Monat zählt, bleibt das Maximum meist gleich. Eine verlässliche Kappung braucht Lastmanagement oder einen Speicher.",
    },
    {
      q: "Wie groß muss ein Speicher für Peak Shaving sein?",
      a: "Die Entladeleistung muss die größte Überschreitung der Schwelle abdecken, die Kapazität die Energie über der Schwelle am ungünstigsten Tag plus Reserve für Prognosefehler und Alterung. Kurze Anlaufspitzen brauchen wenig Kapazität, mehrstündige Plateaus sehr viel. Grundlage ist immer der Lastgang mit 35.040 Viertelstundenwerten.",
    },
    {
      q: "Was ist die flexible Entnahme ab 2027?",
      a: "Laut SNE-G-V-Entwurf können Kunden vereinbaren, dass der Netzbetreiber einen Teil ihrer Leistung bis zu zweimal täglich für je bis zu 4 Stunden (NE 5–7) einschränken darf. Für diesen Anteil wird nur ein prozentueller Teil des Leistungspreises verrechnet. Das eignet sich für verschiebbare Lasten wie Ladepunkte oder Wärmeerzeuger.",
    },
  ],

  passend: [
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Speicher für Peak Shaving, Eigenverbrauch und Notstrom." },
    { href: "/ratgeber/gewerbespeicher-kosten", titel: "Gewerbespeicher Kosten", text: "Kostenblöcke, Richtwerte je kWh und Wirtschaftlichkeit." },
    { href: "/ratgeber/energiemanagementsystem", titel: "Energiemanagementsystem", text: "Verbraucher, Speicher und Ladepunkte steuern." },
    { href: "/energie-live", titel: "Energie live", text: "Aktuelle Strompreise und Erzeugung in Österreich." },
  ],

  quellen: [
    { titel: "RIS – BGBl. II Nr. 305/2025, Novelle der Systemnutzungsentgelte-Verordnung (Netzentgelte 2026)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "12/2025" },
    { titel: "RIS – Elektrizitätswirtschafts- und -organisationsgesetz 2010 (ElWOG 2010), §§ 17 und 52", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007045", stand: "09/2026" },
    { titel: "RIS – BGBl. I Nr. 91/2025, Elektrizitätswirtschaftsgesetz (ElWG)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "12/2025" },
    { titel: "E-Control – Begutachtungsentwurf SNE-G-V samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "Schönherr – ElWG: Startpunkt für umfassende Strommarktreform", url: "https://www.schoenherr.eu/content/elektrizitatswirtschaftsgesetz-elwg-startpunkt-fur-umfassende-strommarktreform", stand: "12/2025" },
    { titel: "bestconnect – Leistungstarif 2027 in Österreich", url: "https://www.bestconnect.info/blog/leistungstarif-2027-oesterreich/", stand: "09/2026" },
    { titel: "OeMAG – Marktpreis für Ökostromanlagen", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Energy-Charts, Day-Ahead-Preise Gebotszone Österreich (eigene Auswertung)", url: "https://www.energy-charts.info", stand: "09/2026" },
  ],

  seitenCta: { titel: "Lastspitzen im Griff?", text: "Lastgang auswerten und Speicher für Peak Shaving prüfen lassen.", href: "/gewerbespeicher", label: "Gewerbespeicher ansehen" },
  cta: {
    title: "Leistungspreis senken – mit Plan statt Bauchgefühl.",
    text: "Wir werten Ihren Lastgang aus, zeigen Lastmanagement-Potenziale und rechnen ehrlich, ob sich ein Speicher für Peak Shaving bei Ihnen lohnt.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Stromspeicher berechnen", href: "/rechner/stromspeicher" },
  },
};

export default artikel;
