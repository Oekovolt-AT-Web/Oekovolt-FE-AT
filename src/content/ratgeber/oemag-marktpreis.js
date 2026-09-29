// Ratgeber (AT): OeMAG-Marktpreis erklärt – § 41 ÖSG 2012, Quartalsmarktpreis vs. Monatswert PV
// Zahlenbasis: E-Control Marktpreis-Archiv, OeMAG (Marktpreis-Seite), Energy-Charts (eigene
// Auswertung Day-Ahead AT). Stand 28.09.2026. Keine Imports – alle Werte hier definiert.

// ---------------------------------------------------------------- Formatierung
const n = (x) => Math.round(x).toLocaleString("de-DE");
const eur = (x) => n(x) + " €";
const kwhFmt = (x) => n(x) + " kWh";
const z3 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const z2 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const z1 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pct = (x) => Math.round(x * 100) + " %";

// ---------------------------------------------------------------- Daten
// Quartalsmarktpreise E-Control nach § 41 Abs. 1 ÖSG 2012 (ct/kWh)
const QUARTAL = {
  2020: [4.51, 3.23, 4.0, 4.23],
  2021: [4.96, 5.73, 7.84, 12.66],
  2022: [25.86, 25.69, 30.73, 51.45],
  2023: [26.86, 14.46, 13.69, 12.46],
  2024: [9.626, 7.758, 8.899, 8.7],
  2025: [9.73, 9.759, 9.82, 9.167],
  2026: [9.25, 11.967, 10.923, null],
};

// OeMAG-Monatsmarktpreis PV nach § 41 Abs. 2a ÖSG 2012 (ct/kWh), nur belegte Monate
const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const MONAT_PV = [
  [2024, 7, 5.339],
  [2024, 8, 5.827],
  [2024, 9, 6.083],
  [2024, 10, 6.867],
  [2024, 11, 8.7],
  [2024, 12, 8.7],
  [2025, 1, 9.73],
  [2025, 2, 9.73],
  [2025, 3, 6.007],
  [2025, 4, 5.855],
  [2025, 5, 5.855],
  [2025, 6, 5.855],
  [2025, 7, 5.965],
  [2026, 1, 8.842],
  [2026, 2, 8.457],
  [2026, 3, 5.72],
  [2026, 4, 6.772],
  [2026, 5, 6.772],
  [2026, 6, 6.772],
  [2026, 7, 6.146],
  [2026, 8, 8.997],
];

// Ausgleichsenergie-Abzug PV ab 2026 (Basis: Durchschnitt 2025)
const AE = { 2024: 0, 2025: 0, 2026: 0.408 };
const AE_WIND_2026 = 0.454;

// Solar-Marktwert AT 2026 (eigene Auswertung Energy-Charts, €/MWh) – nur zum Vergleich
const SOLAR_MW_2026 = { 3: 59, 4: 16, 5: 36, 6: 55, 7: 67, 8: 94 };

// ---------------------------------------------------------------- Rechenfunktionen
const quartalVon = (monat) => Math.ceil(monat / 3) - 1;
const boden = (jahr, q) => 0.6 * QUARTAL[jahr][q] - AE[jahr];
const deckel = (jahr, q) => QUARTAL[jahr][q] - AE[jahr];
const jahresmittel = (jahr) => {
  const w = QUARTAL[jahr].filter((x) => x != null);
  return w.reduce((s, x) => s + x, 0) / w.length;
};
function lage(jahr, monat, wert) {
  const q = quartalVon(monat);
  if (Math.abs(wert - boden(jahr, q)) < 0.002) return "Untergrenze";
  if (Math.abs(wert - deckel(jahr, q)) < 0.002) return "Obergrenze";
  return "im Korridor";
}

// Beispiel Rechenweg
const Q2 = QUARTAL[2026][1];
const Q3 = QUARTAL[2026][2];
const AUG_WERT = 8.997;
const AUG_DA = AUG_WERT + AE[2026]; // rückgerechneter mengengewichteter Day-Ahead-Wert

// Beispiel Jahreserlös 50 kWp
const KWP = 50;
const ERTRAG_KWP = 1050; // kWh/kWp, Annahme
const EV_QUOTE = 0.4; // Eigenverbrauch, Annahme
const UEBERSCHUSS = KWP * ERTRAG_KWP * (1 - EV_QUOTE);
// Annahme: Verteilung der Überschusseinspeisung über das Jahr (Summe 1)
const PROFIL = [0.02, 0.04, 0.08, 0.11, 0.13, 0.14, 0.14, 0.12, 0.09, 0.06, 0.04, 0.03];
const WERTE_2026 = MONAT_PV.filter(([j]) => j === 2026).map(([, m, v]) => ({ m, v }));
const BSP = WERTE_2026.map(({ m, v }) => {
  const kwh = UEBERSCHUSS * PROFIL[m - 1];
  const mw = SOLAR_MW_2026[m];
  return { m, v, kwh, erloes: (kwh * v) / 100, marktwert: mw != null ? (kwh * mw) / 1000 : null };
});
const KWH_JA = BSP.reduce((s, x) => s + x.kwh, 0);
const ERL_JA = BSP.reduce((s, x) => s + x.erloes, 0);
const MITTEL_JA = (ERL_JA / KWH_JA) * 100; // ct/kWh, mengengewichtet
const KWH_REST = UEBERSCHUSS - KWH_JA;
const ERL_REST = (KWH_REST * MITTEL_JA) / 100;
const ERL_JAHR = ERL_JA + ERL_REST;
const MA = BSP.filter((x) => x.marktwert != null);
const MA_OEMAG = MA.reduce((s, x) => s + x.erloes, 0);
const MA_MW = MA.reduce((s, x) => s + x.marktwert, 0);
const MA_KWH = MA.reduce((s, x) => s + x.kwh, 0);
const SIMPEL_MITTEL = WERTE_2026.reduce((s, x) => s + x.v, 0) / WERTE_2026.length;

const artikel = {
  slug: "oemag-marktpreis",
  title: "OeMAG-Marktpreis erklärt: Berechnung, Historie und Erlös 2026",
  seoTitle: "OeMAG-Marktpreis 2026: Berechnung & Historie | Ökovolt",
  kurzTitel: "OeMAG-Marktpreis",
  description:
    "OeMAG-Marktpreis 2026 erklärt: § 41 ÖSG, Korridor 60–100 %, Ausgleichsenergie-Abzug, alle Quartals- und Monatswerte seit 2020 und ein Erlösbeispiel.",
  excerpt:
    "Wie die OeMAG den Monatswert für PV-Überschussstrom berechnet, warum im Frühjahr oft die Untergrenze greift und was eine 50-kWp-Anlage 2026 damit erlöst – mit allen belegten Werten.",
  hauptKeyword: "oemag marktpreis",
  keywords: [
    "OeMAG Marktpreis",
    "OeMAG Marktpreis 2026",
    "Marktpreis Photovoltaik Österreich",
    "Quartalsmarktpreis E-Control",
    "OeMAG Einspeisetarif",
    "§ 41 ÖSG Marktpreis",
    "OeMAG Monatswert PV",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/Home/download.jpg",
  bildAlt: "Photovoltaikanlage auf einem Blechdach, Luftaufnahme von oben",
  badge: { wert: `${z3(AUG_WERT)} ct`, text: "OeMAG-Marktpreis PV August 2026" },

  kurzFazit: [
    `**Der OeMAG-Marktpreis für Photovoltaik wird seit 2024 monatlich und rückwirkend festgelegt:** mengengewichteter Day-Ahead-Preis, begrenzt auf 60 bis 100 % des Quartalsmarktpreises der E-Control, seit 2026 abzüglich ${z3(AE[2026])} ct/kWh Ausgleichsenergie.`,
    `**2026 lagen die Monatswerte zwischen ${z3(5.72)} ct (März) und ${z3(AUG_WERT)} ct (August);** der einfache Durchschnitt Jänner bis August beträgt rund ${z1(SIMPEL_MITTEL)} ct/kWh. Von April bis Juli griff durchgehend die Untergrenze.`,
    `**Die Untergrenze wirkt als Schutz:** Im April 2026 war Solarstrom am Day-Ahead-Markt im Mittel nur ${z1(SOLAR_MW_2026[4] / 10)} ct/kWh wert, die OeMAG vergütete ${z3(6.772)} ct.`,
    `**Anspruch haben Anlagen unter 500 kWp mit Einspeisezählpunkt,** ohne Strombezugsvertrag; die Verträge laufen längstens bis 31.12.2030. Eine 50-kWp-Anlage mit ${kwhFmt(UEBERSCHUSS)} Überschuss erlöst 2026 hochgerechnet rund ${eur(ERL_JAHR)}.`,
    `**Der Quartalsmarktpreis für Q4/2026 wird von der E-Control Ende September veröffentlicht** – zum Stand dieses Artikels (28.09.2026) lag er noch nicht vor.`,
  ],

  abschnitte: [
    {
      id: "was-ist",
      titel: "Was ist der OeMAG-Marktpreis?",
      tocLabel: "Was ist der Marktpreis?",
      bloecke: [
        {
          typ: "p",
          text: "**Der OeMAG-Marktpreis ist der Preis, zu dem die Ökostromabwicklungsstelle OeMAG Überschussstrom aus Photovoltaikanlagen unter 500 kWp abnimmt – ohne Förderung, aber mit gesetzlicher Abnahmepflicht.** Er ist für viele Gewerbebetriebe, Landwirte und Gemeinden die Standardlösung für die Überschusseinspeisung: Die Anlage wird vom Netzbetreiber bei der OeMAG angemeldet, der eingespeiste Strom landet in der Marktpreis-Bilanzgruppe, die OeMAG verkauft ihn am Großhandelsmarkt und schreibt dem Betreiber den Monatswert gut.",
        },
        {
          typ: "p",
          text: "Wichtig ist die Unterscheidung zweier Größen, die oft verwechselt werden: Der **Quartalsmarktpreis** der E-Control ist eine Terminmarktgröße und dient als Referenz. Der **Monatswert PV** der OeMAG ist der Betrag, der tatsächlich vergütet wird. Seit 1. Jänner 2024 ist Letzterer für Photovoltaik maßgeblich; der Quartalspreis bestimmt nur noch den Korridor. Begriffe zum Nachschlagen: [OeMAG](/wissen/lexikon#oemag) und [Marktpreis](/wissen/lexikon#marktpreis) im Lexikon.",
        },
        {
          typ: "tabelle",
          caption: "Quartalsmarktpreis und OeMAG-Monatswert im Vergleich, Stand September 2026",
          kopf: ["Merkmal", "Quartalsmarktpreis (E-Control)", "Monatswert PV (OeMAG)"],
          zeilen: [
            ["Rechtsgrundlage", "§ 41 Abs. 1 ÖSG 2012", "§ 41 Abs. 2a ÖSG 2012"],
            ["Datenbasis", "EEX-Futures: Mittel der vier folgenden Base-Quartalsprodukte Österreich, letzte fünf Handelstage des Vorquartals", "Day-Ahead-Preise, mengengewichtet mit der PV-Einspeisung (stündlich, seit 10/2025 viertelstündlich)"],
            ["Zeitpunkt", "Ende jedes Quartals für das Folgequartal (im Voraus)", "Anfang des Folgemonats (rückwirkend)"],
            ["Funktion", "Referenz, Ober- und Untergrenze", "tatsächlich vergüteter Preis"],
            ["Ausgleichsenergie", "nicht enthalten", `seit 2026 Abzug ${z3(AE[2026])} ct/kWh (PV)`],
          ],
          minBreite: 680,
          fussnote: "Quellen: § 41 ÖSG 2012, OeMAG Marktpreis-Seite, E-Control Marktpreis-Archiv. Für Windkraft gilt weiterhin ein eigenes Regime; der Abzug für Wind beträgt 2026 " + z3(AE_WIND_2026) + " ct/kWh.",
        },
      ],
    },
    {
      id: "rechenweg",
      titel: "Wie wird der Monatswert berechnet? Rechenweg Schritt für Schritt",
      tocLabel: "Rechenweg",
      bloecke: [
        {
          typ: "p",
          text: `**Der Monatswert ergibt sich aus dem mengengewichteten Day-Ahead-Preis des Monats, der auf einen Korridor von 60 bis 100 % des Quartalsmarktpreises begrenzt und um den Ausgleichsenergie-Aufwand vermindert wird.** Obergrenze ist der Quartalsmarktpreis abzüglich Ausgleichsenergie, Untergrenze sind 60 % des Quartalsmarktpreises abzüglich Ausgleichsenergie. Der Abzug von ${z3(AE[2026])} ct/kWh für PV beruht auf den durchschnittlichen Ausgleichsenergiekosten 2025; 2024 und 2025 galt der Korridor noch ohne Abzug.`,
        },
        {
          typ: "ablauf",
          schritte: [
            ["Quartalsmarktpreis nachschlagen", `Für das dritte Quartal 2026 hat die E-Control ${z3(Q3)} ct/kWh veröffentlicht (Q2/2026: ${z3(Q2)} ct).`],
            ["Korridor bilden", `Untergrenze 60 % × ${z3(Q3)} = ${z3(0.6 * Q3)} ct; Obergrenze 100 % = ${z3(Q3)} ct.`],
            ["Ausgleichsenergie abziehen", `Beide Grenzen minus ${z3(AE[2026])} ct: Untergrenze ${z3(boden(2026, 2))} ct, Obergrenze ${z3(deckel(2026, 2))} ct/kWh.`],
            ["Monatlichen PV-Marktwert ermitteln", "Die OeMAG bildet nach Monatsende den Durchschnitt der Day-Ahead-Preise, gewichtet mit den eingespeisten PV-Mengen je Stunde bzw. Viertelstunde."],
            ["Begrenzen und vergüten", `Liegt der Wert nach Abzug unter der Untergrenze, gilt die Untergrenze (Juli 2026: ${z3(6.146)} ct). Liegt er darüber, gilt er selbst (August 2026: ${z3(AUG_WERT)} ct). Über der Obergrenze wird gekappt.`],
          ],
        },
        {
          typ: "tabelle",
          caption: "Rechenbeispiele 2026: Korridor und vergüteter Monatswert, Stand September 2026",
          kopf: ["Monat", "Quartalspreis", "Untergrenze", "Obergrenze", "Monatswert PV", "Ergebnis"],
          zeilen: [4, 7, 8].map((m) => {
            const q = quartalVon(m);
            const w = WERTE_2026.find((x) => x.m === m).v;
            return [`${MONATE[m - 1]} 2026`, `${z3(QUARTAL[2026][q])} ct`, `${z3(boden(2026, q))} ct`, `${z3(deckel(2026, q))} ct`, `${z3(w)} ct`, lage(2026, m, w)];
          }),
          hervorheben: 4,
          minBreite: 720,
          fussnote: `Untergrenze = 0,6 × Quartalspreis − ${z3(AE[2026])} ct; Obergrenze = Quartalspreis − ${z3(AE[2026])} ct. Rückgerechnet entspricht der August-Wert einem mengengewichteten Day-Ahead-Preis von rund ${z2(AUG_DA)} ct/kWh; eine eigene Auswertung auf Basis Energy-Charts ergibt für August 2026 einen Solar-Marktwert von ${z1(SOLAR_MW_2026[8] / 10)} ct/kWh.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum im Frühjahr fast immer die Untergrenze greift",
          text: `Zu Mittag speisen tausende PV-Anlagen gleichzeitig ein, die Day-Ahead-Preise fallen in diesen Stunden stark, teils unter null. Der mengengewichtete Solar-Marktwert lag laut eigener Auswertung auf Basis Energy-Charts im April 2026 bei ${SOLAR_MW_2026[4]} €/MWh und im Mai bei ${SOLAR_MW_2026[5]} €/MWh – weit unter der Untergrenze von ${z3(boden(2026, 1))} ct/kWh. Hintergründe im Ratgeber [negative Strompreise](/ratgeber/negative-strompreise).`,
        },
      ],
    },
    {
      id: "historie",
      titel: "Historie: Quartalsmarktpreise 2020 bis 2026",
      tocLabel: "Historie Quartale",
      bloecke: [
        {
          typ: "p",
          text: `**Der Quartalsmarktpreis schwankte seit 2020 zwischen ${z2(3.23)} ct (Q2/2020) und ${z2(51.45)} ct/kWh (Q4/2022).** 2026 liegen die Werte mit ${z3(QUARTAL[2026][0])} bis ${z3(QUARTAL[2026][1])} ct wieder über dem Niveau von 2024; Q2/2026 war der höchste Quartalswert seit dem vierten Quartal 2023.`,
        },
        {
          typ: "tabelle",
          caption: "Quartalsmarktpreise nach § 41 Abs. 1 ÖSG 2012 in ct/kWh, Stand September 2026",
          kopf: ["Jahr", "Q1", "Q2", "Q3", "Q4", "Mittel"],
          zeilen: Object.keys(QUARTAL).map((j) => [
            j,
            ...QUARTAL[j].map((x) => (x == null ? "noch offen" : Number(j) < 2024 ? z2(x) : z3(x))),
            z2(jahresmittel(j)) + (QUARTAL[j].includes(null) ? " (Q1–Q3)" : ""),
          ]),
          hervorheben: 5,
          markierteZeile: 6,
          minBreite: 640,
          fussnote: "Quelle: E-Control Marktpreis-Archiv; Werte 2020–2023 auf zwei Nachkommastellen veröffentlicht. Mittel = einfacher Durchschnitt der Quartale. Q4/2026 wird Ende September 2026 veröffentlicht und war zum Redaktionsschluss noch nicht bekannt.",
        },
        { typ: "h3", text: "Einordnung: Energiekrise 2022, Normalisierung, Anstieg 2026" },
        {
          typ: "liste",
          punkte: [
            `**2020/2021:** niedrige Großhandelspreise; ab Herbst 2021 steigen die Futures stark (Q4/2021: ${z2(12.66)} ct).`,
            `**2022:** Gaskrise – der Quartalspreis erreicht im vierten Quartal ${z2(51.45)} ct/kWh. Bis Ende 2023 galt für PV der Quartalspreis direkt als Vergütung, Überschusseinspeiser profitierten daher stark.`,
            `**2023/2024:** Normalisierung bis auf ${z3(7.758)} ct in Q2/2024. Mit der monatlichen Berechnung ab 2024 bildet die Vergütung nun ab, dass Solarstrom zu Mittag weniger wert ist.`,
            `**2025/2026:** Quartalspreise um 9 bis 12 ct; die Monatswerte im Sommer liegen trotzdem meist an der Untergrenze, weil der Solar-Marktwert nur rund die Hälfte des Base-Preises erreicht (2025: rund 50 %, laut eigener Auswertung auf Basis Energy-Charts).`,
          ],
        },
      ],
    },
    {
      id: "monatswerte",
      titel: "Monatswerte PV 2024 bis 2026 im Überblick",
      tocLabel: "Monatswerte",
      bloecke: [
        {
          typ: "p",
          text: "**Die belegten OeMAG-Monatswerte für Photovoltaik liegen seit Juli 2024 zwischen rund 5,3 und 9,7 ct/kWh.** Die Tabelle zeigt nur Monate, deren Werte in den Quellen veröffentlicht sind; die Monate August bis Dezember 2025 sind hier bewusst nicht angeführt. Die Spalte „Lage“ zeigt, ob der Wert an einer Korridorgrenze liegt.",
        },
        {
          typ: "tabelle",
          caption: "OeMAG-Monatsmarktpreis Photovoltaik in ct/kWh (rückwirkend), Stand September 2026",
          kopf: ["Monat", "Monatswert PV", "Quartalspreis", "Lage im Korridor"],
          zeilen: MONAT_PV.map(([j, m, v]) => [`${MONATE[m - 1]} ${j}`, `${z3(v)} ct`, `${z3(QUARTAL[j][quartalVon(m)])} ct`, lage(j, m, v)]),
          hervorheben: 1,
          minBreite: 560,
          fussnote: `Quellen: OeMAG, photovoltaik-service.at, energyfamily.at. 2024 und 2025 Korridor ohne Ausgleichsenergie-Abzug, ab 2026 mit ${z3(AE[2026])} ct/kWh. Einfacher Durchschnitt Jänner–August 2026: ${z2(SIMPEL_MITTEL)} ct/kWh.`,
        },
        {
          typ: "p",
          text: "Aktuelle Großhandelspreise und den Tagesverlauf der Gebotszone Österreich sehen Sie auf [Energie live](/energie-live). Wer den Monatswert nicht abwarten will, kann den Überschuss auch selbst vermarkten lassen – welche Alternativen es gibt, beschreibt der Ratgeber [Reststromvermarktung](/ratgeber/reststromvermarktung).",
        },
      ],
    },
    {
      id: "anspruch",
      titel: "Wer bekommt den OeMAG-Marktpreis – und wie lange?",
      tocLabel: "Voraussetzungen",
      bloecke: [
        {
          typ: "p",
          text: "**Den Marktpreis erhalten Betreiber von Photovoltaikanlagen mit einer Engpassleistung unter 500 kW(p), die eine Netzzusage mit Einspeisezählpunkt haben.** Ein Strombezugsvertrag bei einem bestimmten Lieferanten ist nicht erforderlich – das ist der wichtigste Unterschied zu vielen Einspeisetarifen der Energieversorger.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Netzzusage mit Einspeisezählpunkt** des zuständigen Netzbetreibers.",
            "**Engpassleistung unter 500 kW(p)** – bei PV zählt die Modulspitzenleistung.",
            "**Alle nötigen Anzeigen und Bewilligungen** liegen vor.",
            "**Anmeldung durch den Netzbetreiber:** Die Vergütung beginnt ab dem Stichtag, zu dem der Netzbetreiber die Anlage per Belieferungswunsch bei der OeMAG anmeldet.",
            "**Laufzeit:** Marktpreisverträge werden nach geltender Rechtslage längstens bis 31.12.2030 ausgestellt.",
            "**Kündigung:** nach einer Mindesteinspeisedauer von 12 Monaten schriftlich mit vier Wochen Frist zum Monatsletzten.",
            "**Rückkehr:** Wer zu einem Stromhändler wechselt, kann frühestens nach 12 Monaten wieder zur OeMAG zurück.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Die 500-kWp-Grenze bei Erweiterungen",
          text: "Die Abnahmepflicht gilt nur für Anlagen unter 500 kW(p). Wer eine bestehende Anlage erweitert oder repowert, sollte vorab mit Netzbetreiber und OeMAG klären, ob die Anlage danach noch unter diese Grenze fällt. Größere Anlagen brauchen eine [Direktvermarktung](/service/direktvermarktung) oder einen Abnahmevertrag mit einem Stromhändler.",
        },
      ],
    },
    {
      id: "abrechnung",
      titel: "Abrechnung und Gutschrift: So kommt das Geld",
      tocLabel: "Abrechnung",
      bloecke: [
        {
          typ: "p",
          text: "**Die OeMAG schreibt die eingespeiste Menge im Folgemonat der Ablesung gut; auf der Gutschrift stehen Einspeisemenge und Tarif.** Die Zählwerte liefert der Netzbetreiber – je nach Zählerkonfiguration monatlich oder jährlich. Weil der Monatswert erst Anfang des Folgemonats feststeht, kennen Sie den Preis für eine Kilowattstunde immer erst im Nachhinein.",
        },
        {
          typ: "liste",
          punkte: [
            "**Liquiditätsplanung:** Mit monatlicher Ablesung kommen die Gutschriften laufend, bei jährlicher Übermittlung gesammelt. Ein Smart Meter mit Viertelstundenwerten ist ohnehin die Voraussetzung für viele Alternativen.",
            "**Plausibilisieren:** Menge × Monatswert der OeMAG-Veröffentlichung – Abweichungen kommen meist von Zählerständen, nicht vom Preis.",
            "**Buchhaltung:** Im Betrieb sind die Gutschriften Erlöse – ordnen Sie sie monatsgenau zu, damit Soll-Ist-Vergleiche mit der Ertragsprognose möglich sind.",
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Steuerliche Randnotiz",
          text: `Für Privatpersonen sind Einspeiseerlöse nach § 3 Abs. 1 Z 39 EStG steuerfrei, wenn gleichzeitig die Engpassleistung höchstens 25 kW, die Modulleistung höchstens 35 kWp und die eingespeiste Menge höchstens ${n(12500)} kWh im Jahr beträgt. Im Betrieb sind Einspeiseerlöse normal steuerpflichtig. Umsatzsteuerliche Fragen klären Sie mit Ihrer Steuerberatung; einen Überblick gibt der Ratgeber [Photovoltaik und Steuern](/ratgeber/photovoltaik-steuern).`,
        },
      ],
    },
    {
      id: "beispiel",
      titel: "Beispielrechnung: Jahreserlös einer 50-kWp-Anlage 2026",
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Eine 50-kWp-Anlage mit ${kwhFmt(UEBERSCHUSS)} Überschuss erlöst mit den OeMAG-Monatswerten 2026 hochgerechnet rund ${eur(ERL_JAHR)} im Jahr – das sind im Mittel ${z2((ERL_JAHR / UEBERSCHUSS) * 100)} ct/kWh.** Annahmen: spezifischer Ertrag ${n(ERTRAG_KWP)} kWh/kWp, ${pct(EV_QUOTE)} Eigenverbrauch, Verteilung des Überschusses über das Jahr nach einem typischen Einspeiseprofil. Für Jänner bis August gelten die veröffentlichten Monatswerte, September bis Dezember werden mit deren mengengewichtetem Mittel hochgerechnet.`,
        },
        {
          typ: "tabelle",
          caption: "50-kWp-Anlage: Erlös aus Überschusseinspeisung mit OeMAG-Monatswerten 2026, Stand September 2026",
          kopf: ["Monat", "Überschuss", "Monatswert PV", "Erlös OeMAG", "Zum Vergleich: Solar-Marktwert"],
          zeilen: [
            ...BSP.map((x) => [MONATE[x.m - 1], kwhFmt(x.kwh), `${z3(x.v)} ct`, eur(x.erloes), x.marktwert != null ? eur(x.marktwert) : "–"]),
            ["Jänner–August", kwhFmt(KWH_JA), `${z2(MITTEL_JA)} ct (Mittel)`, eur(ERL_JA), "–"],
            ["September–Dezember (Hochrechnung)", kwhFmt(KWH_REST), `${z2(MITTEL_JA)} ct (Annahme)`, eur(ERL_REST), "–"],
            ["Jahr 2026 (hochgerechnet)", kwhFmt(UEBERSCHUSS), `${z2((ERL_JAHR / UEBERSCHUSS) * 100)} ct`, eur(ERL_JAHR), "–"],
          ],
          hervorheben: 3,
          markierteZeile: BSP.length + 2,
          minBreite: 720,
          fussnote: `Annahmen offengelegt: ${KWP} kWp × ${n(ERTRAG_KWP)} kWh/kWp, ${pct(EV_QUOTE)} Eigenverbrauch; Monatsanteile des Überschusses (Jän–Dez) ${PROFIL.map((p) => Math.round(p * 100)).join("/")} %. Solar-Marktwert = eigene Auswertung auf Basis Energy-Charts (erzeugungsgewichteter Day-Ahead-Preis AT, ohne Ausgleichsenergie), nur für März–August angegeben; einzelne Monate können über dem OeMAG-Wert liegen, weil die OeMAG mit ihren eigenen Einspeisemengen gewichtet und Ausgleichsenergie abzieht. Hochrechnung September–Dezember ist keine Prognose.`,
        },
        {
          typ: "p",
          text: `Die Vergleichsspalte zeigt den Effekt der Untergrenze: Von März bis August hätte der reine Solar-Marktwert rund ${eur(MA_MW)} ergeben, die OeMAG vergütete ${eur(MA_OEMAG)} für dieselben ${kwhFmt(MA_KWH)}. Wie viel ein Speicher gegenüber dieser Einspeisevergütung bringt, rechnet der Ratgeber [Stromspeicher Kosten](/ratgeber/stromspeicher-kosten) vor – jede eingespeicherte Kilowattstunde ersetzt Netzbezug, der ein Vielfaches des Monatswerts kostet.`,
        },
      ],
    },
    {
      id: "vergleich",
      titel: "OeMAG oder Einspeisetarif eines Stromhändlers?",
      tocLabel: "Vergleich Händlertarife",
      bloecke: [
        {
          typ: "p",
          text: "**Einspeisetarife der Energieversorger lagen laut Tarifvergleichen im September 2026 überwiegend zwischen rund 2 und 11 ct/kWh – ob sie besser sind als der OeMAG-Marktpreis, hängt vom Modell und den Bedingungen ab.** Ein direkter Vergleich muss die gesamte Jahresmenge mit ihrem Monatsprofil betrachten, nicht den Werbewert eines Monats.",
        },
        {
          typ: "tabelle",
          caption: "Vergütungsmodelle für Überschussstrom im Vergleich, Stand September 2026",
          kopf: ["Modell", "Preisbasis", "Typische Bedingungen", "Worauf achten"],
          zeilen: [
            ["OeMAG-Marktpreis", "Monatswert PV, Korridor 60–100 % des Quartalspreises", "unter 500 kWp, kein Bezugsvertrag, bis 31.12.2030", "Untergrenze schützt im Frühjahr, Obergrenze kappt Spitzen"],
            ["Händler, monatlich schwimmend", "Referenzwert (z. B. Strompreisindex oder OeMAG-Wert) mit Ab- oder Aufschlag", "oft Bezugsvertrag beim selben Versorger, Größengrenzen typ. 25–250 kWp", "Referenz und Abschlag genau lesen"],
            ["Händler, Fix- oder Staffeltarif", "fester Satz, teils gestaffelt nach Menge", "Laufzeit, teils Grundgebühr", "Staffel senkt den Mittelwert bei großen Mengen"],
            ["Händler, Spot-gekoppelt", "stündlicher bzw. viertelstündlicher Day-Ahead-Preis, teils mit prozentualem Abschlag", "Smart Meter mit Viertelstundenwerten", "negative Preise und Mittagstief direkt im Erlös"],
          ],
          minBreite: 760,
          fussnote: "Spannen laut Tarifvergleichen (stromliste.at, Stand 15.09.2026; stromrechner.at). Bewusst ohne Anbieternamen; Bedingungen ändern sich häufig.",
        },
        {
          typ: "p",
          text: "Ab einer gewissen Überschussmenge lohnt ein Blick auf die Direktvermarktung mit Viertelstundenabrechnung. Für Anlagen ab 500 kWp ist sie ohnehin nötig; alle Optionen im Vergleich zeigt der Ratgeber [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026).",
        },
      ],
    },
    {
      id: "ausblick",
      titel: "Ausblick: Was ist für Q4/2026 und danach zu erwarten?",
      tocLabel: "Ausblick",
      bloecke: [
        {
          typ: "p",
          text: "**Der Quartalsmarktpreis für Q4/2026 wird von der E-Control Ende September 2026 veröffentlicht und war am 28.09.2026 noch nicht bekannt – wir nennen deshalb keinen Wert.** Er ergibt sich aus den Futures der letzten fünf Handelstage im September und bestimmt Ober- und Untergrenze für Oktober bis Dezember.",
        },
        {
          typ: "liste",
          punkte: [
            "**Herbst und Winter:** Die PV-Einspeisung ist gering, die Day-Ahead-Preise zu Mittag liegen näher am Tagesdurchschnitt. In diesen Monaten lag der Monatswert zuletzt häufig im Korridor oder an der Obergrenze (Nov./Dez. 2024, Jän./Feb. 2025, Jänner 2026).",
            "**Frühjahr und Sommer:** Solange viele Anlagen gleichzeitig einspeisen, ist mit Werten an der Untergrenze zu rechnen.",
            "**Vertragsende 2030:** Nach geltender Rechtslage enden die Marktpreisverträge spätestens am 31.12.2030. Prüfen Sie rechtzeitig vor diesem Datum, welche Abnahmeform dann gilt.",
            "**Ab 2027:** Einspeiser zahlen laut ElWG einen Versorgungsinfrastrukturbeitrag von höchstens 0,05 ct/kWh; Anlagen bis 20 kW sind befreit.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Was Sie jetzt tun können",
          text: "Prüfen Sie die tatsächliche Monatsverteilung Ihres Überschusses aus den Zählwerten. Liegt der Großteil im April bis Juli, bestimmt die Untergrenze Ihren Erlös – dann bringen Eigenverbrauchssteigerung, Speicher oder Verbrauchsverlagerung meist mehr als ein Tarifwechsel. Wie Sie den Überschuss sonst vermarkten, zeigt unsere Seite zur [Direktvermarktung](/service/direktvermarktung).",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Wie hoch ist der OeMAG-Marktpreis aktuell?",
      a: `Der zuletzt veröffentlichte Monatswert für Photovoltaik beträgt ${z3(AUG_WERT)} ct/kWh für August 2026. Im Juli 2026 lag er an der Untergrenze bei ${z3(6.146)} ct. Der einfache Durchschnitt Jänner bis August 2026 beträgt rund ${z1(SIMPEL_MITTEL)} ct/kWh.`,
    },
    {
      q: "Wie wird der OeMAG-Marktpreis berechnet?",
      a: `Die OeMAG bildet nach Monatsende den mit der PV-Einspeisung gewichteten Day-Ahead-Preis. Dieser wird auf 60 bis 100 % des Quartalsmarktpreises der E-Control begrenzt; seit 2026 werden beide Grenzen um ${z3(AE[2026])} ct/kWh Ausgleichsenergie vermindert. Rechtsgrundlage ist § 41 Abs. 2a ÖSG 2012.`,
    },
    {
      q: "Was ist der Unterschied zwischen Quartalsmarktpreis und Monatswert?",
      a: "Der Quartalsmarktpreis wird von der E-Control im Voraus aus EEX-Futures ermittelt und dient als Referenz. Der Monatswert ist der tatsächlich vergütete Preis für PV-Strom und wird rückwirkend aus den Day-Ahead-Preisen berechnet.",
    },
    {
      q: "Wer kann an die OeMAG zum Marktpreis verkaufen?",
      a: "Betreiber von PV-Anlagen mit einer Engpassleistung unter 500 kW(p), einer Netzzusage mit Einspeisezählpunkt und allen nötigen Anzeigen und Bewilligungen. Ein Strombezugsvertrag bei einem bestimmten Versorger ist nicht nötig.",
    },
    {
      q: "Wie lange läuft der Vertrag und wie kann ich kündigen?",
      a: "Marktpreisverträge werden längstens bis 31.12.2030 ausgestellt. Nach 12 Monaten Mindesteinspeisedauer können Sie schriftlich mit vier Wochen Frist zum Monatsletzten kündigen. Nach einem Wechsel zu einem Stromhändler ist eine Rückkehr zur OeMAG erst nach 12 Monaten möglich.",
    },
    {
      q: "Wann bekomme ich das Geld von der OeMAG?",
      a: "Sie erhalten im Folgemonat der Ablesung eine Gutschrift mit Einspeisemenge und Tarif. Ob monatlich oder jährlich abgelesen wird, hängt von der Zählerkonfiguration beim Netzbetreiber ab.",
    },
    {
      q: "Wie hoch wird der Marktpreis im vierten Quartal 2026?",
      a: "Das ist zum Stand 28.09.2026 noch nicht bekannt. Die E-Control veröffentlicht den Quartalsmarktpreis für Q4 Ende September; daraus ergeben sich Ober- und Untergrenze für Oktober bis Dezember, die Monatswerte selbst folgen jeweils rückwirkend.",
    },
    {
      q: "Ist ein Einspeisetarif eines Stromhändlers besser als die OeMAG?",
      a: "Das hängt vom Modell ab: Tarifvergleiche zeigen Einspeisetarife zwischen rund 2 und 11 ct/kWh, oft gekoppelt an einen Strombezugsvertrag. Vergleichen Sie den Jahreserlös für Ihr Einspeiseprofil – siehe [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026).",
    },
  ],

  passend: [
    { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Alle Vergütungsmodelle für Überschussstrom." },
    { href: "/ratgeber/reststromvermarktung", titel: "Reststromvermarktung", text: "OeMAG, Händler, Direktvermarktung, PPA im Vergleich." },
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Überschuss am Markt vermarkten lassen." },
    { href: "/energie-live", titel: "Energie live", text: "Aktuelle Day-Ahead-Preise der Gebotszone Österreich." },
  ],

  quellen: [
    { titel: "OeMAG – Marktpreis (Berechnung, Voraussetzungen, Kündigung, Gutschrift)", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "E-Control – Marktpreis-Archiv nach § 41 ÖSG 2012", url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis-archiv", stand: "09/2026" },
    { titel: "Ökostromgesetz 2012 (ÖSG 2012), § 41 – RIS", url: "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20007386", stand: "09/2026" },
    { titel: "photovoltaik-service.at – Wie hoch ist der Einspeisetarif bei der OeMAG?", url: "https://photovoltaik-service.at/wie-hoch-ist-der-einspeisetarif-bei-der-oemag", stand: "09/2026" },
    { titel: "energyfamily.at – OeMAG-Marktpreis", url: "https://www.energyfamily.at/oemag-marktpreis", stand: "09/2026" },
    { titel: "smartmeter-portal.at – Marktpreis E-Control aktuell", url: "https://www.smartmeter-portal.at/marktpreis-e-control-aktuell/", stand: "07/2026" },
    { titel: "Fraunhofer ISE – Energy-Charts, Day-Ahead-Preise und Erzeugung Österreich (eigene Auswertung)", url: "https://www.energy-charts.info", stand: "09/2026" },
  ],

  seitenCta: {
    titel: "Überschuss besser verwerten?",
    text: "OeMAG, Händlertarif oder Direktvermarktung – wir prüfen Ihr Einspeiseprofil.",
    href: "/service/direktvermarktung",
    label: "Direktvermarktung ansehen",
  },
  cta: {
    title: "Was ist Ihr Überschussstrom wirklich wert?",
    text: "Wir werten Ihre Zählwerte aus und zeigen, ob OeMAG, Einspeisetarif, Speicher oder Direktvermarktung für Ihre Anlage am meisten bringt.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Direktvermarktung", href: "/service/direktvermarktung" },
  },
};

export default artikel;
