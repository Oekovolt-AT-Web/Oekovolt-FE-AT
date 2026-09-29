// Ratgeber: Stromspeicher richtig dimensionieren (Österreich)
// Alle Tabellenwerte stammen aus einer einfachen, hier offengelegten Stundensimulation
// (8.760 Stunden, synthetische Last- und Erzeugungsprofile, siehe Annahmen unten).
// Marktdaten: BMWET/FH Technikum Wien "PV-Batteriespeichersysteme – Marktentwicklung 2024";
// Netzentgelte: SNE-V 2018 idF BGBl. II Nr. 305/2025; Reform 2027: ElWG + SNE-G-V-Entwurf.

const zahl = (n, st = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: st, maximumFractionDigits: st });
const eur = (n) => zahl(Math.round(n)) + " €";
const pct = (x) => zahl(x * 100) + " %";
const kwh = (n) => zahl(Math.round(n)) + " kWh";

// ---------------------------------------------------------------------------
// Annahmen der Stundensimulation (Beispiel, keine Messdaten)
// ---------------------------------------------------------------------------
const MONATE_TAGE = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
// Anteil des Jahresertrags je Monat in % (typische Verteilung Alpenvorland, Annahme)
const PV_MONAT = [3.5, 5, 8.5, 11, 12.5, 12.5, 13, 12, 9, 6.5, 3.5, 3];
// Taglänge in Stunden (gerundet, Mitteleuropa)
const TAGLAENGE = [8.5, 10, 12, 13.5, 15, 16, 15.5, 14, 12.5, 11, 9, 8];
const ERTRAG_PRO_KWP = 1050; // kWh/kWp und Jahr, Annahme
const ETA = 0.95; // Wirkungsgrad je Lade- bzw. Entladevorgang (≈ 90 % Round-Trip), Annahme
const C_RATE = 0.5; // Lade-/Entladeleistung = 0,5 × Kapazität

/** Reproduzierbarer Pseudozufall für sonnige und trübe Tage (fester Startwert). */
function zufall(seed) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

/** Stündliche PV-Erzeugung: Monatsertrag × Tagesfaktor (0,2–1,8) × Sinusform über die Taglänge. */
function pvReihe(kwp) {
  const rnd = zufall(2026);
  const reihe = [];
  MONATE_TAGE.forEach((tage, m) => {
    const ziel = (kwp * ERTRAG_PRO_KWP * PV_MONAT[m]) / 100;
    const faktoren = Array.from({ length: tage }, () => 0.2 + 1.6 * rnd());
    const fSumme = faktoren.reduce((a, b) => a + b, 0);
    const aufgang = 12.5 - TAGLAENGE[m] / 2;
    const form = Array.from({ length: 24 }, (_, h) => {
      const x = (h + 0.5 - aufgang) / TAGLAENGE[m];
      return x > 0 && x < 1 ? Math.sin(Math.PI * x) : 0;
    });
    const formSumme = form.reduce((a, b) => a + b, 0);
    faktoren.forEach((f) => {
      const tag = (ziel * f) / fSumme;
      form.forEach((v) => reihe.push((tag * v) / formSumme));
    });
  });
  return reihe;
}

/** Stündliche Last aus Tagesprofil (Werktag/Wochenende) × Monatsgewicht, skaliert auf den Jahresverbrauch. */
function lastReihe(jahr, monatsGewicht, werktag, wochenende) {
  const roh = [];
  let t = 0;
  MONATE_TAGE.forEach((tage, m) => {
    for (let d = 0; d < tage; d++) {
      const wt = (t + 3) % 7; // 0 = Montag; 1.1.2026 war ein Donnerstag
      (wt >= 5 ? wochenende : werktag).forEach((v) => roh.push(v * monatsGewicht[m]));
      t++;
    }
  });
  const s = roh.reduce((a, b) => a + b, 0);
  return roh.map((v) => (v * jahr) / s);
}

/** Eigenverbrauchsoptimierter Betrieb: laden aus Überschuss, entladen bei Bedarf, kein Netzladen. */
function simuliere(pv, last, kap) {
  const pMax = kap * C_RATE;
  let soc = kap / 2;
  let bezug = 0;
  let einsp = 0;
  let entl = 0;
  const entlMonat = Array(12).fill(0);
  let stunde = 0;
  MONATE_TAGE.forEach((tage, m) => {
    for (let h = 0; h < tage * 24; h++, stunde++) {
      const direkt = Math.min(pv[stunde], last[stunde]);
      let rest = pv[stunde] - direkt;
      let bedarf = last[stunde] - direkt;
      if (kap > 0 && rest > 0) {
        const lad = Math.min(rest, pMax, (kap - soc) / ETA);
        soc += lad * ETA;
        rest -= lad;
      }
      if (kap > 0 && bedarf > 0) {
        const aus = Math.min(bedarf, pMax, soc * ETA);
        soc -= aus / ETA;
        bedarf -= aus;
        entl += aus;
        entlMonat[m] += aus;
      }
      bezug += bedarf;
      einsp += rest;
    }
  });
  const pvS = pv.reduce((a, b) => a + b, 0);
  const lS = last.reduce((a, b) => a + b, 0);
  return { kap, evq: (pvS - einsp) / pvS, autarkie: (lS - bezug) / lS, zyklen: kap ? entl / kap : 0, bezug, einsp, entlMonat };
}

/** Ersparnis ggü. „ohne Speicher“ und Grenznutzen je zusätzlicher kWh gegenüber der vorigen Stufe. */
function reihe(pv, last, groessen, preisBezug, preisEinsp) {
  const ohne = simuliere(pv, last, 0);
  let vorher = { kap: 0, ersparnis: 0 };
  return groessen.map((kap) => {
    const r = simuliere(pv, last, kap);
    const ersparnis = (ohne.bezug - r.bezug) * preisBezug - (ohne.einsp - r.einsp) * preisEinsp;
    const grenz = kap > 0 ? (ersparnis - vorher.ersparnis) / (kap - vorher.kap) : 0;
    vorher = { kap, ersparnis };
    return { ...r, ersparnis, grenz };
  });
}

// Beispiel A: Gewerbebetrieb, 150 MWh/Jahr, Einschichtbetrieb Mo–Fr, 150 kWp
const G_WERKTAG = [0.3, 0.3, 0.3, 0.3, 0.3, 0.35, 0.7, 1, 1, 1, 1, 1, 0.9, 1, 1, 1, 0.9, 0.7, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3];
const G_WOCHENENDE = Array(24).fill(0.3);
const G_MONAT = [1.1, 1.08, 1.03, 0.97, 0.94, 0.92, 0.93, 0.9, 0.95, 1, 1.07, 1.1];
const G = { verbrauch: 150000, kwp: 150, bezug: 0.18, einsp: 0.07 };
const G_PV = pvReihe(G.kwp);
const G_LAST = lastReihe(G.verbrauch, G_MONAT, G_WERKTAG, G_WOCHENENDE);
const G_GROESSEN = [0, 50, 100, 150, 200, 300, 400];
const GEWERBE = reihe(G_PV, G_LAST, G_GROESSEN, G.bezug, G.einsp);
const g = (kap) => GEWERBE.find((z) => z.kap === kap);

// Beispiel B: Premium-Einfamilienhaus / Chalet mit Wärmepumpe, 10 MWh/Jahr, 15 kWp
const P_TAG = [0.45, 0.4, 0.4, 0.4, 0.4, 0.5, 0.9, 1.3, 1.1, 0.8, 0.7, 0.7, 0.8, 0.7, 0.7, 0.7, 0.8, 1.1, 1.5, 1.6, 1.4, 1.1, 0.8, 0.6];
const P_MONAT = [1.55, 1.4, 1.15, 0.9, 0.7, 0.6, 0.6, 0.6, 0.7, 0.95, 1.3, 1.55];
const P = { verbrauch: 10000, kwp: 15, bezug: 0.26, einsp: 0.07 };
const P_PV = pvReihe(P.kwp);
const P_LAST = lastReihe(P.verbrauch, P_MONAT, P_TAG, P_TAG);
const P_GROESSEN = [0, 5, 10, 15, 20, 25, 30];
const PRIVAT = reihe(P_PV, P_LAST, P_GROESSEN, P.bezug, P.einsp);
const p = (kap) => PRIVAT.find((z) => z.kap === kap);

// Faustregeln
const AT_KWH_JE_KWP = 1.01; // Marktschnitt 2024 (EAG-Förderdaten)
const HTW_MAX = 1.5; // kWh je kWp bzw. je 1.000 kWh Jahresverbrauch (HTW Berlin)
const regel = (x) => ({
  at: x.kwp * AT_KWH_JE_KWP,
  htw: Math.min((x.verbrauch / 1000) * HTW_MAX, x.kwp * HTW_MAX),
});
const P_REGEL = regel(P);
const G_REGEL = regel(G);

// Saisonalität: 15-kWh-Speicher im Beispielhaus – Vollzyklen je Monat
const P15 = p(15);
const zyklenMonat = (m) => P15.entlMonat[m] / 15 / MONATE_TAGE[m];

// Peak Shaving: Beispiel für die Dimensionierung nach Leistung
const PS = {
  spitze: 260, // kW, höchster Viertelstundenwert im Monat
  ziel: 200, // kW, angestrebte Kappungsgrenze
  dauer: 0.75, // h, längste zusammenhängende Überschreitung
  mittelUeber: 40, // kW, mittlere Überschreitung in dieser Zeit
  reserve: 1.5, // Faktor für Prognosefehler, Wirkungsgrad, Mindestladestand
  lpNe6Ooe: 65.88, // €/kW/Jahr, NE 6 Netz Oberösterreich 2026
};
const PS_KW = PS.spitze - PS.ziel;
const PS_KWH = PS.dauer * PS.mittelUeber * PS.reserve;
const PS_ERSPARNIS = PS_KW * PS.lpNe6Ooe;

const artikel = {
  slug: "stromspeicher-groesse",
  title: "Stromspeicher-Größe: richtig dimensionieren für Betrieb und Haus",
  seoTitle: "Stromspeicher Größe richtig dimensionieren | Ökovolt",
  kurzTitel: "Stromspeicher-Größe",
  description:
    "Stromspeicher-Größe in Österreich richtig dimensionieren: Faustregeln, Lastgang, kW vs. kWh, Peak Shaving und Leistungspreis 2027 – mit Stundensimulation.",
  excerpt:
    "Wie viele Kilowattstunden und wie viel Leistung braucht Ihr Speicher? Faustregeln im Check, eine offengelegte Stundensimulation für Betrieb und Premium-Haus und warum im Gewerbe das Ziel die Größe bestimmt.",
  hauptKeyword: "stromspeicher größe",
  keywords: [
    "Stromspeicher Größe",
    "Stromspeicher dimensionieren",
    "Speichergröße Gewerbe",
    "Batteriespeicher Größe berechnen",
    "Stromspeicher kWh pro kWp",
    "Gewerbespeicher Auslegung Lastgang",
    "Speicher Peak Shaving Größe",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Speicher & Eigenverbrauch",
  bild: "/Images/Ratgeber/stromspeicher-groesse.jpg",
  bildAlt: "Modularer Sigenergy-Stromspeicher SigenStor mit mehreren gestapelten Batteriemodulen",
  badge: { wert: "1,01 kWh", text: "Speicher je kWp – Marktschnitt Österreich 2024" },

  kurzFazit: [
    "**In Österreich wurden 2024 im Schnitt rund 20 kWh Speicher je System und 1,01 kWh je kWp PV-Leistung installiert** (BMWET-Marktstatistik). Das ist ein Marktschnitt, keine Auslegungsregel.",
    `**Jede zusätzliche Kilowattstunde bringt weniger:** Im simulierten Betrieb (${kwh(G.verbrauch)}, ${G.kwp} kWp) spart die erste 50-kWh-Stufe rund ${eur(g(50).grenz)} je kWh und Jahr, die Stufe von 300 auf 400 kWh nur noch rund ${eur(g(400).grenz)}.`,
    `**Im Gewerbe greifen Haushalts-Faustregeln zu kurz:** Die Regel „1,5 kWh je 1.000 kWh Verbrauch“ ergäbe im Beispielbetrieb ${kwh(G_REGEL.htw)}; die Simulation zeigt schon ab 100 bis 150 kWh deutlich sinkende Zyklenzahlen.`,
    `**Leistung (kW) und Kapazität (kWh) getrennt auslegen:** Für Peak Shaving zählt die Leistung – im Beispiel kappen ${PS_KW} kW mit rund ${zahl(Math.round(PS_KWH / 5) * 5)} kWh eine Spitze und sparen auf Netzebene 6 in Oberösterreich rund ${eur(PS_ERSPARNIS)} Leistungspreis im Jahr.`,
    "**Ab 2027 kommt der Leistungspreis auch auf Netzebene 7** (monatlich höchste Viertelstunde laut ElWG und Verordnungsentwurf) – dann wird die Speicherleistung auch für kleinere Betriebe und Haushalte relevant.",
  ],

  abschnitte: [
    {
      id: "antwort",
      titel: "Wie groß sollte ein Stromspeicher sein?",
      tocLabel: "Die kurze Antwort",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Stromspeicher sollte so groß sein, dass er den regelmäßigen Überschuss eines Tages in die Abend- und Nachtstunden verschiebt – nicht größer.** Im Einfamilienhaus heißt das: Kapazität grob in Höhe des Abend- und Nachtverbrauchs eines durchschnittlichen Frühlings- oder Herbsttags. Im Betrieb entscheidet zuerst das Ziel – Eigenverbrauch, Lastspitzen kappen, Notstrom oder Handel am Spotmarkt –, danach der Lastgang.",
        },
        {
          typ: "p",
          text: "Die Logik dahinter ist wirtschaftlich: Ein Speicher verdient nur dann Geld, wenn er häufig voll geladen und wieder entladen wird. Jede gespeicherte Kilowattstunde ersetzt teuren Netzbezug statt günstig eingespeist zu werden. Ist der Speicher größer als der tägliche Überschuss oder der nächtliche Bedarf, bleibt Kapazität an den meisten Tagen ungenutzt – Sie bezahlen dann für Kilowattstunden, die kaum arbeiten.",
        },
        {
          typ: "kennzahl",
          wert: "20 kWh",
          titel: "durchschnittliche Speichergröße in Österreich 2024",
          text: "2023 waren es 13,5 kWh. Neu installiert wurden 2024 rund 70.900 PV-Speicher mit 928 MWh nutzbarer Kapazität; 95 % DC-gekoppelt (BMWET, Marktentwicklung 2024).",
        },
      ],
    },
    {
      id: "faustregeln",
      titel: "Faustregeln: was sie leisten und wo sie versagen",
      tocLabel: "Faustregeln",
      bloecke: [
        {
          typ: "p",
          text: "**Faustregeln liefern einen Startkorridor für Haushalte, aber keine Auslegung für Betriebe.** Die gängigsten Werte stammen aus Simulationen für Einfamilienhäuser – dort sind Lastprofile ähnlich, der Verbrauch fällt vor allem morgens und abends an. Der österreichische Marktschnitt von 1,01 kWh je kWp beschreibt, was gekauft wurde, nicht was optimal ist.",
        },
        {
          typ: "tabelle",
          caption: "Faustregeln zur Speichergröße angewendet auf zwei Beispiele, Stand September 2026",
          kopf: ["Faustregel", "Herkunft", `Premium-Haus (${kwh(P.verbrauch)}, ${P.kwp} kWp)`, `Betrieb (${kwh(G.verbrauch)}, ${G.kwp} kWp)`],
          zeilen: [
            ["1,01 kWh je kWp", "Marktschnitt AT 2024 (EAG-Förderdaten)", kwh(P_REGEL.at), kwh(G_REGEL.at)],
            ["max. 1,5 kWh je 1.000 kWh Jahresverbrauch und je kWp (kleinerer Wert)", "HTW Berlin, Auslegung von Solarstromspeichern", kwh(P_REGEL.htw), kwh(G_REGEL.htw)],
            ["Abend- und Nachtverbrauch eines Übergangstags", "Planungspraxis", "abhängig vom Lastgang", "abhängig vom Lastgang"],
            ["Wirtschaftlicher Knick in der Simulation", "eigene Stundensimulation (unten)", "ca. 10–15 kWh", "ca. 100–150 kWh"],
          ],
          hervorheben: 3,
          minBreite: 680,
          fussnote: "Faustregeln beziehen sich auf die nutzbare Kapazität. Der Marktschnitt 1,01 kWh/kWp stammt aus den EAG-Förderdaten (dort Ø 12,51 kWh); die Durchschnittsgröße aller erhobenen Systeme lag 2024 bei rund 20 kWh. Erhebung vor allem für Speicher bis 50 kWh – Gewerbespeicher sind nur teilweise erfasst.",
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Warum Haushaltsregeln im Betrieb zu große Speicher ergeben",
          text: "Ein Betrieb mit Tagschicht verbraucht den Solarstrom zu einem großen Teil direkt. Der Speicher bekommt nur den Überschuss aus Mittagsspitzen, Wochenenden und Betriebsferien – und entlädt nur in die Abend- und Nachtlast. Eine Regel auf Basis des Jahresverbrauchs ignoriert beides. Maßgeblich ist das [Lastprofil](/wissen/lexikon#lastprofil) in Viertelstundenwerten, das Betriebe mit Leistungsmessung beim Netzbetreiber anfordern können.",
        },
      ],
    },
    {
      id: "simulation",
      titel: "Simulation: Was bringt jede zusätzliche Kilowattstunde?",
      tocLabel: "Grenznutzen",
      bloecke: [
        {
          typ: "p",
          text: `**Der Nutzen eines Speichers steigt mit der Größe, aber jede weitere Kilowattstunde bringt weniger – das ist der abnehmende Grenznutzen.** Um das greifbar zu machen, haben wir zwei Beispielprofile Stunde für Stunde über ein Jahr gerechnet. Betrieb: ${kwh(G.verbrauch)} Jahresverbrauch, Einschichtbetrieb Montag bis Freitag, ${G.kwp} kWp PV. Bewertet wird vermiedener Netzbezug mit ${zahl(G.bezug * 100)} ct/kWh netto abzüglich entgangener Einspeisung mit ${zahl(G.einsp * 100)} ct/kWh.`,
        },
        {
          typ: "tabelle",
          caption: `Beispielbetrieb ${kwh(G.verbrauch)}/Jahr, ${G.kwp} kWp: Eigenverbrauch und Autarkie nach Speichergröße (Simulation, Stand September 2026)`,
          kopf: ["Speicher", "Eigenverbrauchsquote", "Autarkiegrad", "Vollzyklen/Jahr", "Ersparnis/Jahr", "Grenznutzen je kWh"],
          zeilen: GEWERBE.map((z) => [
            z.kap ? kwh(z.kap) : "ohne",
            pct(z.evq),
            pct(z.autarkie),
            z.kap ? zahl(z.zyklen) : "–",
            z.kap ? eur(z.ersparnis) : "–",
            z.kap ? eur(z.grenz) : "–",
          ]),
          hervorheben: 5,
          minBreite: 680,
          fussnote: `Beispielrechnung, keine Auslegung. Annahmen: synthetisches Lastprofil (werktags 6–18 Uhr Volllast, abends abnehmend, Grundlast 30 %, Wochenende nur Grundlast, Winter ca. 10 % über dem Mittel); PV ${zahl(ERTRAG_PRO_KWP)} kWh/kWp mit typischer Monatsverteilung und reproduzierbar zufälligen Tagesfaktoren (0,2–1,8); Speicherleistung ${zahl(C_RATE, 1)} C, ${zahl(ETA * ETA * 100)} % Round-Trip-Wirkungsgrad, kein Netzladen. ${zahl(G.bezug * 100)} ct/kWh = angenommener variabler Arbeitspreis inkl. Netz und Abgaben, ${zahl(G.einsp * 100)} ct/kWh = angenommener Einspeiseerlös. Grenznutzen = Mehrersparnis je zusätzlicher kWh gegenüber der vorigen Zeile. Ohne Leistungspreiseffekt.`,
        },
        {
          typ: "p",
          text: `Das Muster ist typisch: Die ersten 50 kWh durchlaufen rund ${zahl(g(50).zyklen)} Vollzyklen im Jahr, bei 200 kWh sind es nur noch ${zahl(g(200).zyklen)}, bei 400 kWh ${zahl(g(400).zyklen)}. Die Eigenverbrauchsquote steigt von ${pct(g(0).evq)} auf ${pct(g(150).evq)} mit 150 kWh – danach bringt eine Verdopplung auf 300 kWh nur noch ${zahl((g(300).evq - g(150).evq) * 100)} Prozentpunkte. Auffällig ist auch die absolute Höhe: Selbst die erste Stufe erwirtschaftet mit Eigenverbrauch allein rund ${eur(g(50).grenz)} je kWh und Jahr, über 20 Jahre also rund ${eur(g(50).grenz * 20)} je kWh – ohne Zinsen und Alterung. Gewerbespeicher rechnen sich deshalb meist erst, wenn weitere Nutzen wie Peak Shaving dazukommen. Ob sich eine Stufe rechnet, zeigt der Vergleich des Grenznutzens mit den Kosten je kWh über die Lebensdauer; aktuelle Preise finden Sie im Ratgeber [Gewerbespeicher Kosten](/ratgeber/gewerbespeicher-kosten).`,
        },
        { typ: "h3", text: "Premium-Einfamilienhaus oder Chalet mit Wärmepumpe" },
        {
          typ: "tabelle",
          caption: `Premium-Haus ${kwh(P.verbrauch)}/Jahr inkl. Wärmepumpe, ${P.kwp} kWp: Speichergröße im Vergleich (Simulation, Stand September 2026)`,
          kopf: ["Speicher", "Eigenverbrauchsquote", "Autarkiegrad", "Vollzyklen/Jahr", "Ersparnis/Jahr", "Grenznutzen je kWh"],
          zeilen: PRIVAT.map((z) => [
            z.kap ? kwh(z.kap) : "ohne",
            pct(z.evq),
            pct(z.autarkie),
            z.kap ? zahl(z.zyklen) : "–",
            z.kap ? eur(z.ersparnis) : "–",
            z.kap ? eur(z.grenz) : "–",
          ]),
          hervorheben: 2,
          minBreite: 680,
          fussnote: `Beispielrechnung. Annahmen: Tagesprofil mit Morgen- und Abendspitze, Monatsgewichte winterlastig (Jänner/Dezember 2,6-mal so hoch wie Juni–August) wegen Wärmepumpe; PV und Speicherparameter wie oben. ${zahl(P.bezug * 100)} ct/kWh = angenommener Bruttoarbeitspreis inkl. Netz und Abgaben, ${zahl(P.einsp * 100)} ct/kWh ≈ mittlerer OeMAG-Marktpreis PV Jänner–August 2026 (rund 7,3 ct).`,
        },
        {
          typ: "p",
          text: `Im Haus steigt der [Autarkiegrad](/wissen/lexikon#autarkiegrad) von ${pct(p(0).autarkie)} auf ${pct(p(10).autarkie)} mit 10 kWh und ${pct(p(15).autarkie)} mit 15 kWh. Von 20 auf 30 kWh kommen nur noch ${zahl((p(30).autarkie - p(20).autarkie) * 100)} Prozentpunkte dazu, der Grenznutzen fällt auf rund ${eur(p(30).grenz)} je kWh und Jahr. Mit einer Stundensimulation für Ihre eigenen Werte rechnet der [Stromspeicher-Rechner](/rechner/stromspeicher).`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Autarkie ist eine legitime, aber teure Entscheidung",
          text: "Wer im Chalet oder Premium-Haus maximale Unabhängigkeit möchte, darf größer planen. Die Entscheidung sollte bewusst fallen: Die letzten Prozentpunkte Autarkie kosten ein Vielfaches der ersten. 100 % erreicht ein Gebäude mit Wärmepumpe und Netzanschluss wirtschaftlich nicht, weil der Speicher Stunden verschiebt, keine Monate.",
        },
        { typ: "tool", href: "/rechner/stromspeicher", titel: "Speichergröße mit eigenen Werten simulieren", text: "Verbrauch, Anlagengröße, E-Auto und Wärmepumpe eingeben – der Rechner zeigt Autarkie und Nutzen für verschiedene Speichergrößen.", label: "Zum Stromspeicher-Rechner" },
      ],
    },
    {
      id: "saison",
      titel: "Lastgang und Jahreszeit: warum der Winter die Größe nicht bestimmt",
      tocLabel: "Winter & alpine Lagen",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Speicher arbeitet am meisten in den Übergangsmonaten – im Winter fehlt der Überschuss zum Laden, im Sommer oft die Abendlast zum Entladen.** Im Beispielhaus mit 15 kWh schafft der Speicher im März rechnerisch ${zahl(zyklenMonat(2), 2)} und im Oktober ${zahl(zyklenMonat(9), 2)} Vollzyklen pro Tag, im Juni nur ${zahl(zyklenMonat(5), 2)} und im Dezember ${zahl(zyklenMonat(11), 2)}. Eine Größe, die auf den Winterbedarf eines Hauses mit Wärmepumpe zielt, bleibt deshalb die meiste Zeit halb leer.`,
        },
        {
          typ: "tabelle",
          caption: "Beispielhaus mit 15-kWh-Speicher: mittlere Vollzyklen pro Tag nach Monat (Simulation, Stand September 2026)",
          kopf: MONATE,
          zeilen: [MONATE.map((_, m) => zahl(zyklenMonat(m), 2))],
          minBreite: 680,
          fussnote: "Vollzyklen pro Tag = entladene Energie ÷ Kapazität ÷ Tage im Monat. Annahmen wie in der Tabelle zum Premium-Haus. Werte unter 1 bedeuten, dass der Speicher im Monatsmittel nicht täglich vollständig ge- und entladen wird.",
        },
        {
          typ: "p",
          text: "In alpinen Lagen sieht das Bild etwas anders aus: Oberhalb der Nebelgrenze, mit steil geneigten oder Fassadenmodulen und Reflexion durch Schnee erzeugen Anlagen im Winter mehr als im Flachland. Gleichzeitig steigt der Verbrauch in der Skisaison durch Heizung, Warmwasser, Sauna oder Ladebetrieb. Ein Chalet kann deshalb auch im Winter tägliche Überschüsse haben – ob das zutrifft, zeigt eine standortbezogene Ertragsprognose, nicht die Faustregel. Mehr dazu im Ratgeber [Photovoltaik im Winter](/ratgeber/photovoltaik-im-winter).",
        },
        {
          typ: "p",
          text: "Im Betrieb lohnt der Blick auf drei Muster im Lastgang: die Abend- und Nachtlast an Werktagen (sie bestimmt, wie viel der Speicher täglich abgeben kann), den Überschuss an Wochenenden und in Betriebsferien (er bestimmt, wie oft der Speicher voll wird) und die Lastspitzen (sie bestimmen die nötige Leistung). Wie Anlagen- und Speichergröße zusammenhängen, erklärt der Ratgeber [PV-Anlagengröße berechnen](/ratgeber/pv-anlage-groesse-berechnen).",
        },
      ],
    },
    {
      id: "leistung",
      titel: "Leistung (kW) vs. Kapazität (kWh): die C-Rate",
      tocLabel: "kW vs. kWh",
      bloecke: [
        {
          typ: "p",
          text: "**Die Kapazität in kWh bestimmt, wie viel Energie ein Speicher verschieben kann; die Leistung in kW bestimmt, wie schnell.** Das Verhältnis beider heißt [C-Rate](/wissen/lexikon#c-rate): 0,5 C bedeutet, dass ein 100-kWh-Speicher mit 50 kW lädt und entlädt, also in zwei Stunden voll oder leer ist. Für die Verschiebung von Solarstrom in den Abend genügen niedrige C-Raten; für das Kappen kurzer Lastspitzen braucht es hohe Leistung bei vergleichsweise kleiner Kapazität.",
        },
        {
          typ: "tabelle",
          caption: "Speicherziele im Gewerbe und ihre Auslegungsgröße, Richtwerte Stand September 2026",
          kopf: ["Ziel", "Bestimmt die Größe", "Typische C-Rate (Richtwert)", "Zyklen/Jahr (Richtwert)"],
          zeilen: [
            ["Eigenverbrauch erhöhen", "Überschuss am Tag und Abend-/Nachtlast", "0,3–0,5 C", "150–300"],
            ["Peak Shaving (Leistungspreis)", "Höhe und Dauer der Lastspitzen über der Kappungsgrenze", "0,5–1 C und mehr", "wenige Dutzend Spitzeneinsätze"],
            ["Notstrom / Ersatzstrom", "kritische Last × gewünschte Überbrückungszeit", "nach Anlaufströmen", "kaum Zyklen, Reserve dauerhaft gebunden"],
            ["Spotpreis-Optimierung", "tägliche Preisspreizung, Netzentgelte beim Netzladen", "0,5–1 C", "bis ca. 365 und mehr"],
          ],
          hervorheben: 1,
          minBreite: 680,
          fussnote: "Richtwerte zur Orientierung, abhängig von Lastgang, Tarif und Betriebsstrategie. Kombinationen sind möglich, konkurrieren aber um dieselbe Kapazität: Was für Notstrom reserviert ist, steht für Eigenverbrauch oder Handel nicht zur Verfügung.",
        },
        { typ: "h3", text: "Beispiel: Speicher für Peak Shaving auslegen" },
        {
          typ: "p",
          text: `Ein Betrieb auf Netzebene 6 erreicht in einem Monat eine Viertelstundenspitze von ${PS.spitze} kW, soll aber ${PS.ziel} kW nicht überschreiten. Die längste Überschreitung dauert ${zahl(PS.dauer * 60)} Minuten mit im Mittel ${PS.mittelUeber} kW über der Grenze. Der Speicher braucht also mindestens ${PS_KW} kW Entladeleistung, aber nur rund ${zahl(PS.dauer * PS.mittelUeber)} kWh Energie – mit Reserve für Prognosefehler, Wirkungsgrad und Mindestladestand rund ${zahl(Math.round(PS_KWH / 5) * 5)} kWh. Das entspricht über 1 C. Bei einem Leistungspreis von ${zahl(PS.lpNe6Ooe, 2)} € je kW und Jahr (NE 6, Netz Oberösterreich 2026) sind ${PS_KW} kW weniger rund ${eur(PS_ERSPARNIS)} pro Jahr – vorausgesetzt, die Kappung gelingt in jedem Monat.`,
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Österreich: Mittel der Monatsspitzen, nicht Jahresspitze",
          text: "Bei leistungsgemessenen Kunden wird bis Ende 2026 das arithmetische Mittel der monatlich höchsten Viertelstundenleistung verrechnet (§ 52 ElWOG 2010, SNE-V 2018). Eine einzelne verpasste Spitze wirkt daher nur mit einem Zwölftel aufs Jahr – anders als in Deutschland, wo meist die Jahreshöchstleistung zählt. Die Details zu Tarifen und Strategie beschreibt der Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis).",
        },
      ],
    },
    {
      id: "netztarife",
      titel: "Neue Netztarife: SNAP und Leistungspreis auf Netzebene 7 ab 2027",
      tocLabel: "Netztarife 2026/2027",
      bloecke: [
        {
          typ: "p",
          text: "**Mit der Netzentgeltreform ab 1. Jänner 2027 wird die Speicherleistung auch für Haushalte und Kleingewerbe auf Netzebene 7 relevant.** Laut Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025) und dem Begutachtungsentwurf der Systemnutzungsentgelte-Verordnung der E-Control soll es einen Leistungspreis auf allen Netzebenen geben, abgerechnet monatlich nach dem höchsten Viertelstundenwert am Zählpunkt – mit einer Mindestbemessung von 2 kW. Die Tarifwerte 2027 standen Ende September 2026 noch nicht fest.",
        },
        {
          typ: "liste",
          punkte: [
            "**Leistungspreis NE 7 ab 2027:** Kurze Spitzen aus Wallbox, Wärmepumpe, Sauna und Herd kosten künftig direkt Geld. Ein Speicher mit ausreichender Entladeleistung (kW) kann diese Spitzen abfedern – Kapazität allein hilft nicht.",
            "**Sommer-Nieder-Arbeitspreis (SNAP) seit 1. April 2026:** Auf Netzebene 7 ist der Netz-Arbeitspreis von 1. April bis 30. September zwischen 10 und 16 Uhr um 20 % niedriger (z. B. Oberösterreich, gemessene Leistung: 3,74 statt 4,68 ct/kWh). Netzbezug mittags wird etwas günstiger – ein Grund mehr, den Speicher nicht in diesen Stunden zu entladen, sondern für den Abend aufzuheben.",
            "**Winter-Nieder-Arbeitspreis (WiNAP) laut Entwurf:** 1. Oktober bis 31. März, 22 bis 4 Uhr. Für Speicher, die im Winter nachts aus dem Netz laden, ist das ein zusätzlicher Anreiz – sofern der Energiepreis in diesen Stunden ebenfalls günstig ist.",
            "**Netzladen bis Ende 2026 doppelt belastet:** Netzbezug in den Speicher und späterer Verbrauch zahlen Netzentgelte; Befreiungen ab 2027 betreffen nur systemdienliche Speicher ab 1 MW, die ausschließlich wieder einspeisen.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Für die Größenwahl heißt das",
          text: "Wer 2026 plant, sollte bei gleicher Kapazität die Variante mit höherer Wechselrichter- und Batterieleistung bevorzugen und ein Energiemanagement vorsehen, das Lastspitzen erkennt. Die Kapazität sollte sich weiterhin am Überschuss orientieren – der Leistungspreis rechtfertigt keinen doppelt so großen Speicher, aber einen, der schnell genug reagiert.",
        },
      ],
    },
    {
      id: "fehler",
      titel: "Überdimensionierung vermeiden und modular planen",
      tocLabel: "Fehler & Erweiterbarkeit",
      bloecke: [
        {
          typ: "p",
          text: "**Ein etwas zu kleiner, erweiterbarer Speicher ist wirtschaftlich meist besser als ein zu großer.** Überdimensionierte Speicher laufen wenige Vollzyklen, altern aber kalendarisch trotzdem – ungenutzte Kapazität verliert Wert, ohne zu verdienen. Wie lange Speicher halten, beschreibt der Ratgeber [Stromspeicher Lebensdauer](/ratgeber/stromspeicher-lebensdauer).",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Überdimensioniert", text: "Hohe Investition, wenige Zyklen, lange Amortisation. Im Winter bleibt ein großer Teil leer. Bei Gewerbespeichern zusätzlich: mehr Fläche, Brandschutzaufwand und Versicherungsprämie." },
            { titel: "Unterdimensioniert", text: "Mittags schnell voll, abends früh leer. Die Ersparnis je kWh ist hoch, die absolute Ersparnis begrenzt. Problematisch nur, wenn sich später keine Module nachrüsten lassen." },
          ],
        },
        {
          typ: "checkliste",
          punkte: [
            "**Kapazität nach Überschuss und Abendlast wählen,** nicht nach Dachfläche oder Jahresverbrauch allein. Hilfe dazu bietet [Eigenverbrauch erhöhen](/ratgeber/eigenverbrauch-erhoehen) – oft sind verschiebbare Verbraucher günstiger als zusätzliche kWh.",
            "**Nutzbare statt Nennkapazität vergleichen.** Datenblätter nennen oft die Bruttokapazität; eine fest eingestellte Notstromreserve verkleinert die nutzbare Kapazität zusätzlich.",
            "**Leistung passend zu Spitzen und Wechselrichter wählen.** Für Haushalte mit Wärmepumpe und Wallbox sind unter 5 kW Entladeleistung oft zu wenig; im Gewerbe die kW nach dem Lastgang bestimmen.",
            "**Erweiterbarkeit schriftlich klären:** Bis wann gibt es Module derselben Generation, wie wirkt sich die Erweiterung auf die Garantie aus, und können neue und gealterte Module gemeinsam voll genutzt werden?",
            "**Pläne der nächsten Jahre einrechnen:** E-Flotte, Wärmepumpe, Kälteanlage oder zweite Schicht verändern den Lastgang stärker als jede Faustregel.",
            "**Förderung und Preise prüfen:** Speicher werden über den EAG-Investitionszuschuss nur gemeinsam mit PV gefördert; Details und Kosten im Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten).",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "In sechs Schritten zur passenden Speichergröße",
      tocLabel: "Vorgehen",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Ziel festlegen", "Eigenverbrauch, Peak Shaving, Notstrom oder Spotpreis-Optimierung – oder eine Kombination mit klarer Priorität."],
            ["Daten besorgen", "Betriebe: 12 Monate Viertelstundenwerte vom Netzbetreiber. Haushalte: Smart-Meter-Daten, mindestens Tageswerte; Viertelstundenwerte sind genauer."],
            ["Erzeugung simulieren", "PV-Ertrag je Viertelstunde oder Stunde gegen den Lastgang legen; Überschuss und Abendlast je Tag auswerten."],
            ["Kapazität und Leistung getrennt bestimmen", "Kapazität aus Überschuss und Abendlast, Leistung aus Spitzen und Ladeanforderungen; Grenznutzen je Größenstufe prüfen."],
            ["Tarife einrechnen", "Leistungspreis heute (gemessene Kunden) und ab 2027 (alle Netzebenen), SNAP, Einspeiseerlöse."],
            ["System wählen", "Nutzbare Kapazität, Dauerleistung, Erweiterbarkeit, Garantie (Jahre, Durchsatz, Restkapazität), Aufstellort und Brandschutz. Für Betriebe siehe [Gewerbespeicher](/gewerbespeicher), für Haus und Chalet [Stromspeicher](/produkte/stromspeicher)."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie viel kWh Speicher pro kWp sind sinnvoll?",
      a: "In Österreich wurden 2024 im Schnitt 1,01 kWh je kWp installiert. Als Obergrenze für Haushalte gilt häufig 1,5 kWh je kWp und je 1.000 kWh Jahresverbrauch (kleinerer Wert). Im Gewerbe ergibt eine Simulation des Lastgangs meist deutlich kleinere Werte je kWp.",
    },
    {
      q: "Wie groß sollte ein Gewerbespeicher sein?",
      a: `Das hängt vom Ziel ab. Für Eigenverbrauch bestimmen Überschuss und Abendlast die Kapazität – im Beispielbetrieb mit ${kwh(G.verbrauch)} und ${G.kwp} kWp flacht der Nutzen ab etwa 100 bis 150 kWh deutlich ab. Für Peak Shaving zählt vor allem die Leistung in kW. Einen Überblick gibt die Seite [Gewerbespeicher](/gewerbespeicher).`,
    },
    {
      q: "Was ist wichtiger: kW oder kWh?",
      a: "Für die Verschiebung von Solarstrom in den Abend ist die Kapazität in kWh entscheidend, eine Leistung von 0,3 bis 0,5 C reicht meist. Für das Kappen von Lastspitzen zählt die Leistung in kW; hier sind 1 C und mehr üblich. Ab 2027 wird die Leistung durch den Leistungspreis auf Netzebene 7 auch im Haushalt wichtiger.",
    },
    {
      q: "Ist ein 20-kWh-Speicher für ein Einfamilienhaus zu groß?",
      a: `Für reinen Haushaltsstrom meist ja. In unserem Beispiel eines Premium-Hauses mit Wärmepumpe (${kwh(P.verbrauch)}, ${P.kwp} kWp) bringt der Schritt von 15 auf 20 kWh nur noch ${zahl((p(20).autarkie - p(15).autarkie) * 100)} Prozentpunkte Autarkie. Mit E-Auto, hohem Abendverbrauch oder Notstromreserve kann er passen.`,
    },
    {
      q: "Soll ich den Speicher größer planen, weil 2027 der Leistungspreis kommt?",
      a: "Nicht unbedingt größer, aber leistungsstärker. Der Leistungspreis bewertet die höchste Viertelstunde im Monat; dafür braucht es ausreichend kW und eine Steuerung, die Spitzen erkennt. Die Tarifwerte 2027 legt die E-Control erst mit der Tarifverordnung Ende 2026 fest.",
    },
    {
      q: "Kann ich einen Stromspeicher später erweitern?",
      a: "Bei vielen modularen Systemen ja, meist innerhalb einer vom Hersteller vorgegebenen Frist und mit Modulen derselben Generation. Klären Sie vor dem Kauf schriftlich, ob die Erweiterung die Garantie berührt und ob neue und gealterte Module gemeinsam voll genutzt werden.",
    },
    {
      q: "Wie viel Kapazität brauche ich für Notstrom?",
      a: "Kritische Last in kW mal gewünschte Überbrückungszeit in Stunden, plus Reserve. Diese Kapazität ist dauerhaft gebunden und steht für den Eigenverbrauch nicht zur Verfügung. Mehr im Ratgeber [Notstrom mit Photovoltaik](/ratgeber/notstrom-photovoltaik).",
    },
  ],

  passend: [
    { href: "/rechner/stromspeicher", titel: "Stromspeicher-Rechner", text: "Speichergröße mit eigenen Werten simulieren." },
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Speicher für Eigenverbrauch, Peak Shaving und Notstrom." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving und Leistungspreis", text: "Lastspitzen kappen, Netzentgelte senken." },
    { href: "/ratgeber/stromspeicher-kosten", titel: "Stromspeicher Kosten", text: "Preise je kWh und Wirtschaftlichkeit." },
  ],

  quellen: [
    { titel: "BMWET / FH Technikum Wien – PV-Batteriespeichersysteme: Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf", stand: "06/2025" },
    { titel: "nachhaltigwirtschaften.at – Marktentwicklung Energietechnologien (Schriftenreihe 2025-23)", url: "https://nachhaltigwirtschaften.at/de/publikationen/schriftenreihe-2025-23-marktentwicklung-energietechnologien.php", stand: "09/2026" },
    { titel: "HTW Berlin – Empfehlungen zur Auslegung von Solarstromspeichern", url: "https://solar.htw-berlin.de/publikationen/auslegung-von-solarstromspeichern/", stand: "09/2026" },
    { titel: "RIS – SNE-V 2018, Novelle 2026 (BGBl. II Nr. 305/2025)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "12/2025" },
    { titel: "RIS – Elektrizitätswirtschaftsgesetz ElWG (BGBl. I Nr. 91/2025)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "12/2025" },
    { titel: "E-Control – SNE-G-V Begutachtungsentwurf samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
  ],

  seitenCta: { titel: "Welche Größe passt?", text: "Speichergröße mit Ihrem Verbrauch simulieren – als Startpunkt für die Planung.", href: "/rechner/stromspeicher", label: "Speicher berechnen" },
  cta: {
    title: "Speicher nach Lastgang statt nach Faustregel auslegen.",
    text: "Senden Sie uns Ihre Viertelstundenwerte oder Ihren Jahresverbrauch – wir prüfen Ziel, Kapazität und Leistung für Betrieb, Haus oder Chalet.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Gewerbespeicher", href: "/gewerbespeicher" },
  },
};

export default artikel;
