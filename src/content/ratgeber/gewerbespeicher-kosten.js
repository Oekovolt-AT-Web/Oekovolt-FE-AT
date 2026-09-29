// Ratgeber: Gewerbespeicher Kosten in Österreich 2026
// Marktdaten: BMWET/FH Technikum Wien "PV-Batteriespeichersysteme – Marktentwicklung 2024" (06/2025),
// BloombergNEF Batteriepreis-Erhebung (12/2025). Netzentgelte 2026: SNE-V 2018 idF BGBl. II Nr. 305/2025.
// Spannen je kWh für Gewerbespeicher sind redaktionelle Richtwerte (keine amtliche Statistik) – offengelegt.

const fmt = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const eur = (n) => `${n < 0 ? "−" : ""}${fmt(Math.abs(Math.round(n)))} €`;
const eur2 = (n) => `${fmt(n, 2)} €`;
const ctF = (n, d = 2) => `${fmt(n, d)} ct`;
const jahre = (x) => `${fmt(x, 1)} Jahre`;
const jahreD = (x) => `${fmt(x, 1)} Jahren`;

// Marktdaten
const HEIM_PREIS_2024 = 706; // €/kWh nutzbar exkl. USt, schlüsselfertig (Marktstatistik 2024)
const HEIM_EINKAUF_2024 = 516; // €/kWh Einkaufspreis Errichter
const BNEF_PACK_USD = 70; // $/kWh stationäre Packs 2025
const USD_JE_EUR = 1.17; // Annahme Wechselkurs
const PACK_EUR = BNEF_PACK_USD / USD_JE_EUR;

// Richtwertspannen €/kWh nutzbar, schlüsselfertig, exkl. USt (redaktionelle Annahme)
const KLASSEN = [
  { groesse: "30–100 kWh", bauform: "Wand- oder Schranksystem, Anschluss in der Hauptverteilung", von: 450, bis: 750 },
  { groesse: "100–500 kWh", bauform: "Outdoor-Schrank (Cabinet), modular erweiterbar", von: 300, bis: 550 },
  { groesse: "0,5–2 MWh", bauform: "Container, oft mit eigenem Trafo oder Anschluss an der Trafostation", von: 250, bis: 450 },
  { groesse: "über 2 MWh", bauform: "Containerpark mit Mittelspannungsanschluss", von: 200, bis: 350 },
];

// Beispiel: Betrieb auf NE 6, Netzbereich Salzburg
const LP = 66.6; // €/kW und Jahr, NE 6 Salzburg 2026
const AP = 2.86; // ct/kWh, NE 6 Salzburg 2026
const ELEKTRIZITAETSABGABE = 1.5; // ct/kWh, Regelsatz (Annahme)
const ENERGIEPREIS = 13.0; // ct/kWh, Annahme
const BEZUG = ENERGIEPREIS + AP + ELEKTRIZITAETSABGABE; // ohne Netzverlustentgelt (konservativ)
const EINSPEISUNG = 7.3; // ct/kWh, OeMAG-Marktpreis PV Ø Jänner–August 2026
const ETA = 0.9;
const KAP = 200; // kWh nutzbar
const LEISTUNG = 100; // kW
const C_RATE = LEISTUNG / KAP;
const PREIS_KWH = 400; // Richtwert
const BETRIEB_ANTEIL = 0.015;
const LAUFZEIT = 15;
const ZINS = 0.05;
const PS_KW = 60; // gesenkte Spitze im Monatsmittel (Annahme)
const PS_DURCHSATZ = 8000;
const EV_KWH = 30000; // kWh/Jahr aus PV-Überschuss entladen (Annahme)
const SPOT_TAGE = 100;
const SPOT_KWH = 100;
const SPREAD = 14.2; // ct/kWh, Ø zwei teuerste minus zwei billigste Stunden 2026 (Energy-Charts, eigene Auswertung)
const REALISIERUNG = 0.5;

const N_PS = PS_KW * LP - (PS_DURCHSATZ * (1 / ETA - 1) * BEZUG) / 100;
const N_EV = (EV_KWH * (BEZUG - EINSPEISUNG / ETA)) / 100;
const N_SPOT = (SPOT_TAGE * SPOT_KWH * (SPREAD * REALISIERUNG - (1 / ETA - 1) * BEZUG)) / 100;
const ZYKLEN = (EV_KWH + PS_DURCHSATZ + SPOT_TAGE * SPOT_KWH) / KAP;
const RBF = (1 - Math.pow(1 + ZINS, -LAUFZEIT)) / ZINS; // Rentenbarwertfaktor

function rechne(preisKwh) {
  const invest = KAP * preisKwh;
  const betrieb = invest * BETRIEB_ANTEIL;
  const netto = N_PS + N_EV + N_SPOT - betrieb;
  return { invest, betrieb, netto, amort: invest / netto, barwert: netto * RBF - invest };
}
const B = rechne(PREIS_KWH);
const PREISE = [250, 300, 400, 500];
const break_even = (N_PS + N_EV + N_SPOT) / (KAP * (1 / RBF + BETRIEB_ANTEIL)); // €/kWh mit Barwert 0

const artikel = {
  slug: "gewerbespeicher-kosten",
  title: "Gewerbespeicher Kosten 2026: Preise, Kostenblöcke und Rendite",
  seoTitle: "Gewerbespeicher Kosten 2026 in Österreich | Ökovolt",
  kurzTitel: "Gewerbespeicher Kosten",
  description:
    "Gewerbespeicher Kosten 2026: Richtwerte je kWh von 50 kWh bis MWh, Kostenblöcke, C-Rate, Erlösquellen in Österreich und eine Wirtschaftlichkeitsrechnung.",
  excerpt:
    "Was ein Batteriespeicher für Betrieb, Landwirtschaft oder Gemeinde 2026 kostet, woraus sich der Preis zusammensetzt und mit welchen gestapelten Nutzen er sich in Österreich rechnet.",
  hauptKeyword: "gewerbespeicher kosten",
  keywords: [
    "Gewerbespeicher Kosten",
    "Batteriespeicher Gewerbe Preis",
    "Industriespeicher Kosten pro kWh",
    "Stromspeicher Unternehmen Österreich",
    "Gewerbespeicher Wirtschaftlichkeit",
    "Batteriespeicher Peak Shaving Kosten",
    "C-Rate Batteriespeicher",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Kosten & Wirtschaftlichkeit",
  bild: "/Images/AT/ratgeber/batteriespeicher-anlage.jpg",
  bildAlt: "Eingezäunte Batteriespeicher-Anlage mit mehreren Speichercontainern und Trafostation",
  badge: { wert: `${fmt(BNEF_PACK_USD)} $`, text: "je kWh: Preis stationärer Batteriepacks 2025 (BNEF) – das System kostet ein Vielfaches" },

  kurzFazit: [
    `**Ein Gewerbespeicher kostet 2026 als Richtwert rund ${fmt(KLASSEN[3].von)} bis ${fmt(KLASSEN[0].bis)} € je nutzbarer kWh schlüsselfertig exkl. USt** – je größer, desto günstiger je kWh. Zum Vergleich: Heimspeicher kosteten 2024 im Mittel ${fmt(HEIM_PREIS_2024)} €/kWh (Marktstatistik).`,
    `Die Batteriepacks selbst machen nur einen kleinen Teil aus: Stationäre Packs kosteten 2025 laut BloombergNEF im Mittel ${fmt(BNEF_PACK_USD)} $/kWh (rund ${fmt(Math.round(PACK_EUR / 5) * 5)} €). Wechselrichter, Brandschutz, Netzanschluss, Montage und Steuerung bestimmen den Systempreis.`,
    `Im Beispiel (${fmt(KAP)} kWh / ${fmt(LEISTUNG)} kW, NE 6 Salzburg, ${fmt(PREIS_KWH)} €/kWh) bringen Peak Shaving, Eigenverbrauch und Spotpreis-Optimierung zusammen ${eur(B.netto)} netto im Jahr – Amortisation nach rund ${jahreD(B.amort)}.`,
    `Positiv wird der Barwert über ${fmt(LAUFZEIT)} Jahre bei ${fmt(ZINS * 100)} % Zins im Beispiel erst unter rund ${fmt(Math.floor(break_even / 10) * 10)} € je kWh. **Ein Speicher braucht in Österreich fast immer mehrere gestapelte Nutzen.**`,
    "Ab 2027 sind systemdienliche Speicher ab 1 MW laut ElWG bei der Netzentnahme für die Wiedereinspeisung von Netzentgelten befreit – für Speicher hinter dem Zähler eines Betriebs ändert sich dadurch wenig.",
  ],

  abschnitte: [
    {
      id: "preise",
      titel: "Was kostet ein Gewerbespeicher 2026?",
      tocLabel: "Preise 2026",
      bloecke: [
        {
          typ: "p",
          text: `**Ein Gewerbespeicher kostet 2026 schlüsselfertig als Richtwert zwischen ${fmt(KLASSEN[3].von)} € je kWh bei Containerlösungen im Megawattstunden-Bereich und ${fmt(KLASSEN[0].bis)} € je kWh bei kleinen Systemen um 50 kWh, jeweils ohne Umsatzsteuer.** Eine amtliche Preisstatistik für Gewerbespeicher gibt es in Österreich nicht: Die vom Wirtschaftsministerium (BMWET) veröffentlichte Marktstatistik erfasst vor allem Speicher bis 50 kWh. Für diese lag der mittlere Systempreis 2024 bei ${fmt(HEIM_PREIS_2024)} € je nutzbarer kWh, nach 840 € im Jahr 2023.`,
        },
        {
          typ: "tabelle",
          caption: "Gewerbespeicher: Richtwerte je nutzbarer kWh nach Größenklasse, schlüsselfertig exkl. USt, Stand September 2026",
          kopf: ["Größe (nutzbar)", "Typische Bauform", "Richtwert €/kWh", "Beispiel Investition"],
          zeilen: [
            ["5–50 kWh (Referenz)", "Heim- und Kleinspeicher, Mittelwert 2024 laut Marktstatistik", fmt(HEIM_PREIS_2024), `20 kWh: ${eur(20 * HEIM_PREIS_2024)}`],
            ...KLASSEN.map((k, i) => {
              const bsp = [80, 200, 1000, 4000][i];
              return [k.groesse, k.bauform, `${fmt(k.von)}–${fmt(k.bis)}`, `${fmt(bsp)} kWh: ${eur(bsp * k.von)}–${eur(bsp * k.bis)}`];
            }),
          ],
          markierteZeile: 2,
          hervorheben: 2,
          minBreite: 700,
          fussnote: "Referenzzeile: BMWET/FH Technikum Wien, Marktentwicklung 2024 (Mittelwert schlüsselfertig, exkl. USt). Alle anderen Spannen sind redaktionelle Richtwerte (Annahme) für einfache Aufstellung ohne Trafotausch, abgeleitet aus Marktstatistik, BNEF-Packpreisen und üblichen Zusatzkosten – keine Angebote. Netzanschluss auf höherer Ebene, Tiefbau, Gebäudeumbau und Notstromumschaltung kommen je nach Projekt hinzu.",
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Warum große Speicher je kWh günstiger sind",
          text: "Planung, Schutztechnik, Steuerung, Inbetriebnahme und Genehmigung kosten bei 100 kWh fast gleich viel wie bei 500 kWh. Mit wachsender Größe dominieren die Batteriemodule, deren Preis 2024 und 2025 stark gefallen ist. Umgekehrt sind kleine Gewerbespeicher je kWh oft kaum günstiger als Heimspeicher. Systeme für Betriebe stellt die Seite [Gewerbespeicher](/gewerbespeicher) vor.",
        },
      ],
    },
    {
      id: "kostenbloecke",
      titel: "Woraus sich die Kosten eines Gewerbespeichers zusammensetzen",
      tocLabel: "Kostenblöcke",
      bloecke: [
        {
          typ: "p",
          text: `**Die Batteriezellen sind im Gewerbespeicher nur ein Kostenblock von mehreren – bei einem ${fmt(KAP)}-kWh-System zu ${fmt(PREIS_KWH)} €/kWh machen reine Packpreise von rund ${fmt(Math.round(PACK_EUR / 5) * 5)} € je kWh nur etwa ${fmt((PACK_EUR / PREIS_KWH) * 100)} % aus.** BloombergNEF meldete für 2025 einen Rückgang der Preise stationärer Speicher-Packs um 45 % auf ${fmt(BNEF_PACK_USD)} $/kWh. Dieser Rückgang kommt im Systempreis nur gedämpft an, weil der Rest der Kette nicht im gleichen Tempo billiger wird.`,
        },
        {
          typ: "tabelle",
          caption: "Kostenblöcke eines Gewerbespeichers und ihre Treiber, Stand September 2026",
          kopf: ["Kostenblock", "Was enthalten ist", "Kostentreiber"],
          zeilen: [
            ["Zellen und Packs", "Batteriemodule, heute meist Lithium-Eisenphosphat (LFP)", "Kapazität, Zellqualität, Garantie-Durchsatz"],
            ["Leistungselektronik (PCS)", "Batteriewechselrichter bzw. Umrichter", "Leistung in kW, Inselnetzfähigkeit"],
            ["BMS und EMS", "Batteriemanagement, Energiemanagement, Schnittstellen", "Anzahl Nutzen, Prognose, Anbindung an Leitstand"],
            ["Brandschutz und Aufstellung", "Gehäuse, Klimatisierung, Löschtechnik, Fundament, Abstände", "Innen- oder Außenaufstellung, Auflagen"],
            ["Netzanschluss und Schutz", "Kabel, Schaltanlage, Messung, ggf. Trafo und Netzschutz", "Netzebene, Reserve im bestehenden Anschluss"],
            ["Planung und Montage", "Auslegung, Genehmigung, Elektroinstallation, Inbetriebnahme", "Projektgröße, Standort, Umbauten"],
            ["Betrieb", "Wartung, Fernüberwachung, Software, Versicherung", "Laufzeitverträge, Garantiebedingungen"],
          ],
          minBreite: 680,
          fussnote: `Packpreis umgerechnet mit ${fmt(USD_JE_EUR, 2)} $/€ (Annahme). Im Beispiel unten sind Betriebskosten mit ${fmt(BETRIEB_ANTEIL * 100, 1)} % der Investition pro Jahr angesetzt (Annahme).`,
        },
        {
          typ: "p",
          text: `Die Differenz zwischen Einkaufs- und Endpreis zeigt auch die Marktstatistik: Errichter kauften Heimspeicher 2024 im Mittel um ${fmt(HEIM_EINKAUF_2024)} €/kWh ein und verkauften sie um ${fmt(HEIM_PREIS_2024)} €/kWh – der Rest sind Montage, Planung, Gewährleistung und Marge. Bei Gewerbespeichern kommen Brandschutzkonzept, Schutztechnik und häufig Arbeiten am Netzanschluss hinzu. Hinweise dazu gibt der Ratgeber [Photovoltaik-Brandschutz](/ratgeber/photovoltaik-brandschutz); ob eine Aufstellung eine Änderung der Betriebsanlagengenehmigung erfordert, klären Sie früh mit der Behörde.`,
        },
      ],
    },
    {
      id: "c-rate",
      titel: "Leistung oder Kapazität: Welche C-Rate braucht Ihr Speicher?",
      tocLabel: "Leistung vs. Kapazität",
      bloecke: [
        {
          typ: "p",
          text: `**Die C-Rate beschreibt das Verhältnis von Leistung zu Kapazität – und sie bestimmt, welche Aufgabe ein Speicher wirtschaftlich erfüllen kann.** Ein Speicher mit ${fmt(KAP)} kWh und ${fmt(LEISTUNG)} kW hat eine C-Rate von ${fmt(C_RATE, 1)}: Er kann seine volle Leistung zwei Stunden lang abgeben. Leistung (Wechselrichter, Schutztechnik, Netzanschluss) und Kapazität (Batteriemodule) kosten getrennt – wer nur kurze Spitzen kappt, zahlt mit zu viel Kapazität für Energie, die er nie braucht. Mehr im Lexikon unter [C-Rate](/wissen/lexikon#c-rate).`,
        },
        {
          typ: "tabelle",
          caption: "Anwendungen und typische C-Raten von Gewerbespeichern (Richtwerte), Stand September 2026",
          kopf: ["Anwendung", "Typische C-Rate", "Worauf es ankommt"],
          zeilen: [
            ["Peak Shaving kurzer Spitzen", "0,5–1", "Leistung über der Schwelle, schnelle Regelung"],
            ["Eigenverbrauch PV", "0,25–0,5", "Kapazität für Abend und Nacht"],
            ["Spotpreis-Optimierung", "0,5", "2 bis 4 Stunden Entladedauer für die teuersten Stunden"],
            ["Regelreserve", "0,5–1", "Leistung, Präqualifikation, Verfügbarkeit"],
            ["Notstrom/Ersatzstrom", "nach Last", "Inselnetzfähigkeit, Überbrückungsdauer"],
          ],
          minBreite: 600,
          fussnote: "Richtwerte zur Orientierung; die richtige Auslegung ergibt sich aus Lastgang und Nutzenkombination.",
        },
        {
          typ: "p",
          text: `Heute sind nahezu alle stationären Speicher [LFP-Speicher](/wissen/lexikon#lfp): zyklenfest, thermisch stabil und ohne Kobalt. Wie viele Zyklen ein System tatsächlich schafft und was das für die Kosten bedeutet, erklärt der Ratgeber [Stromspeicher-Lebensdauer](/ratgeber/stromspeicher-lebensdauer).`,
        },
      ],
    },
    {
      id: "erloese",
      titel: "Womit ein Gewerbespeicher in Österreich Geld verdient",
      tocLabel: "Erlösquellen",
      bloecke: [
        {
          typ: "p",
          text: "**Ein Gewerbespeicher verdient in Österreich über fünf Hebel: mehr Eigenverbrauch, geringeren Leistungspreis, Spotpreis-Optimierung, Versorgungssicherheit und künftig Flexibilitätsmärkte.** Keiner davon trägt die Investition allein zuverlässig – die Kunst liegt im Kombinieren.",
        },
        {
          typ: "tabelle",
          caption: "Erlösquellen eines Gewerbespeichers und ihre Werttreiber in Österreich, Stand September 2026",
          kopf: ["Nutzen", "Werttreiber", "Größenordnung 2026"],
          zeilen: [
            ["Eigenverbrauch erhöhen", "Bezugspreis minus Einspeiseerlös", `OeMAG-Marktpreis PV 2026 monatlich 5,72–9,00 ct/kWh; im Beispiel ${ctF(BEZUG - EINSPEISUNG / ETA, 1)} Nutzen je entladener kWh`],
            ["Peak Shaving", "Leistungspreis je kW", "2026 zwischen 37,32 und 112,32 €/kW und Jahr je Netzbereich und Ebene"],
            ["Spotpreis-Optimierung", "Tagesspreizung am Day-Ahead-Markt", "Ø zwei teuerste minus zwei billigste Stunden 2026: 142 €/MWh"],
            ["Notstrom/Ersatzstrom", "vermiedene Ausfallkosten", "betriebsindividuell, nicht pauschal bezifferbar"],
            ["Flexibilität/Regelreserve", "Leistungspreise der APG-Auktionen", "Mindestgebot 1 MW, Pooling möglich; kleiner, volatiler Markt"],
          ],
          minBreite: 680,
          fussnote: "OeMAG-Monatsmarktpreise Jänner–August 2026; Leistungspreise aus BGBl. II Nr. 305/2025; Spreizung: eigene Auswertung der Day-Ahead-Preise Gebotszone AT auf Basis Energy-Charts (1.1.–27.9.2026).",
        },
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "Peak Shaving", text: "Jedes Monatsmaximum zählt zu einem Zwölftel; der Speicher muss also jeden Monat liefern. Rechnung und Beispiel im Ratgeber [Peak Shaving und Leistungspreis](/ratgeber/peak-shaving-leistungspreis)." },
            { titel: "Spotpreis", text: "2026 lag der Day-Ahead-Preis mittags (11–15 Uhr) im Mittel bei 62 €/MWh, abends (18–21 Uhr) bei 172 €/MWh. Nutzen lässt sich das mit spotpreisbasiertem Energievertrag oder bei eigener Vermarktung; aktuelle Preise zeigt [Energie live](/energie-live)." },
            { titel: "Notstrom", text: "Ersatzstrom braucht einen inselnetzfähigen Wechselrichter und eine Netztrennung – Mehrkosten, die sich über vermiedene Ausfälle rechnen müssen. Siehe [Blackout-Vorsorge für Unternehmen](/ratgeber/blackout-vorsorge-unternehmen)." },
            { titel: "Regelreserve", text: "APG beschafft 2026 rund ±75 MW FCR, ±225 MW aFRR und +255/−195 MW mFRR. Der Markt ist klein; Details im Ratgeber [Regelenergie und Flexibilität](/ratgeber/regelenergie-flexibilitaet)." },
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Netzladen bis Ende 2026 doppelt belastet",
          text: "Lädt ein Speicher Strom aus dem Netz, um ihn später wieder einzuspeisen, fallen bis Ende 2026 auf die Entnahme Netzentgelte an. Für Speicher hinter dem Zähler, die den eigenen Verbrauch bedienen, gilt das nicht in gleicher Weise: Der Strom wird ohnehin verbraucht und nur zeitlich verschoben.",
        },
      ],
    },
    {
      id: "beispiel",
      titel: `Beispielrechnung: ${fmt(KAP)} kWh / ${fmt(LEISTUNG)} kW in einem Salzburger Betrieb`,
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Ein ${fmt(KAP)}-kWh-Speicher mit ${fmt(LEISTUNG)} kW in einem Betrieb auf Netzebene 6 im Netzbereich Salzburg bringt im Beispiel ${eur(B.netto)} Nettonutzen im Jahr und amortisiert sich bei ${fmt(PREIS_KWH)} €/kWh nach rund ${jahreD(B.amort)}.** Angenommen ist ein Lebensmittelverarbeiter mit PV-Anlage, Wochenendüberschüssen und kurzen Lastspitzen beim Produktionsstart.`,
        },
        {
          typ: "tabelle",
          caption: `Gewerbespeicher ${fmt(KAP)} kWh / ${fmt(LEISTUNG)} kW, NE 6 Salzburg: Annahmen und Ergebnis, Stand September 2026`,
          kopf: ["Position", "Annahme", "Wert"],
          zeilen: [
            ["Investition", `${fmt(KAP)} kWh × ${fmt(PREIS_KWH)} €/kWh (Richtwert)`, eur(B.invest)],
            ["Peak Shaving", `${fmt(PS_KW)} kW im Monatsmittel × ${eur2(LP)}, abzügl. Ladeverluste`, eur(N_PS)],
            ["Eigenverbrauch", `${fmt(EV_KWH)} kWh × (${ctF(BEZUG)} − ${ctF(EINSPEISUNG, 1)} ÷ ${fmt(ETA, 1)})`, eur(N_EV)],
            ["Spotpreis-Optimierung", `${fmt(SPOT_TAGE)} Tage × ${fmt(SPOT_KWH)} kWh × ${ctF(SPREAD, 1)} × ${fmt(REALISIERUNG * 100)} %, abzügl. Verluste`, eur(N_SPOT)],
            ["Wartung, Versicherung, Software", `${fmt(BETRIEB_ANTEIL * 100, 1)} % der Investition`, `−${eur(B.betrieb)}`],
            ["Nettonutzen", `rund ${fmt(ZYKLEN)} Vollzyklen pro Jahr`, eur(B.netto)],
            ["Einfache Amortisation", "Investition ÷ Nettonutzen", jahre(B.amort)],
            ["Barwert", `${fmt(LAUFZEIT)} Jahre, ${fmt(ZINS * 100)} % Zins`, eur(B.barwert)],
          ],
          markierteZeile: 5,
          hervorheben: 2,
          minBreite: 680,
          fussnote: `Variable Bezugskosten ${ctF(BEZUG)}/kWh = Energie ${ctF(ENERGIEPREIS, 1)} (Annahme: Day-Ahead-Mittel 2026 rund 12,1 ct plus Aufschlag) + Netz-Arbeitspreis NE 6 Salzburg ${ctF(AP)} + Elektrizitätsabgabe ${ctF(ELEKTRIZITAETSABGABE, 1)} (Regelsatz); Netzverlustentgelt konservativ nicht angesetzt. Einspeiseerlös = OeMAG-Marktpreis PV Ø Jänner–August 2026. Wirkungsgrad ${fmt(ETA * 100)} %. Ohne Förderung, Steuerwirkung, Preissteigerung und Kapazitätsverlust.`,
        },
        {
          typ: "tabelle",
          caption: "Empfindlichkeit: Amortisation und Barwert nach Speicherpreis, gleiche Annahmen, Stand September 2026",
          kopf: ["Speicherpreis", "Investition", "Nettonutzen/Jahr", "Amortisation", `Barwert ${fmt(LAUFZEIT)} J.`],
          zeilen: PREISE.map((p) => {
            const r = rechne(p);
            return [`${fmt(p)} €/kWh`, eur(r.invest), eur(r.netto), jahre(r.amort), eur(r.barwert)];
          }),
          markierteZeile: 2,
          hervorheben: 4,
          minBreite: 620,
          fussnote: "Betriebskosten skalieren mit der Investition. Richtwerte, keine Angebote.",
        },
        {
          typ: "p",
          text: `Die Rechnung zeigt, worauf es ankommt: Systempreis je kWh und Zahl sinnvoller Zyklen. Eigene Werte für den Eigenverbrauch überschlagen Sie mit dem [Stromspeicher-Rechner](/rechner/stromspeicher). Mit rund ${fmt(ZYKLEN)} Vollzyklen pro Jahr wird der Speicher gut genutzt; ein reiner Peak-Shaving-Speicher käme auf einen Bruchteil davon. Förderungen verbessern das Bild: Der EAG-Investitionszuschuss fördert Speicher nur gemeinsam mit einer PV-Anlage, der dritte Fördercall 2026 läuft von 8. bis 22. Oktober – Details im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss). Ob und in welcher Höhe der [Investitionsfreibetrag](/ratgeber/investitionsfreibetrag-photovoltaik) greift, klären Sie mit Ihrer Steuerberatung; Landesprogramme finden Sie unter [Landesförderungen](/forderungen/landesforderungen).`,
        },
        {
          typ: "tool",
          href: "/rechner/stromspeicher",
          titel: "Speichernutzen überschlagen",
          text: "Mit dem Stromspeicher-Rechner schätzen Sie ab, wie viel Eigenverbrauch ein Speicher zusätzlich bringt – als Ausgangspunkt für die Detailplanung.",
          label: "Zum Stromspeicher-Rechner",
        },
      ],
    },
    {
      id: "netzentgelte-2027",
      titel: "Netzentgelte für Speicher ab 2027",
      tocLabel: "Speicher ab 2027",
      bloecke: [
        {
          typ: "p",
          text: "**Ab 1. Jänner 2027 sind systemdienliche Speicher laut ElWG (§ 127 Abs. 3) bei der Entnahme, die ausschließlich der Wiedereinspeisung dient, von Netznutzungs- und Netzverlustentgelt befreit.** Die Bedingungen im SNE-G-V-Entwurf sind eng und zielen auf netzgekoppelte Großspeicher, nicht auf Speicher im Betrieb:",
        },
        {
          typ: "checkliste",
          punkte: [
            "mindestens 1 MW (Aggregation von Anlagen ab 50 kW möglich)",
            "Anschluss ohne weiteren Netzausbau an einem Netzknoten mit hoher Trafoauslastung (in mindestens 20 % der Stunden über 80 % der Nennleistung)",
            "Flexibilitätsvertrag mit dem Regelzonenführer; der Netzbetreiber darf den Betriebsbereich unentgeltlich einschränken",
            "Deckel von 5 GW österreichweit, Befreiung höchstens 20 Jahre",
          ],
        },
        {
          typ: "p",
          text: "Für einen Betrieb bleibt der Speicher hinter dem Zähler daher meist ein Eigenverbrauchs- und Leistungsspeicher. Gleichzeitig steigt ab 2027 laut Branchenberichten das Gewicht des Leistungspreises; das kann Peak Shaving aufwerten. Speicher im Megawatt-Maßstab behandelt der Ratgeber [Großspeicher (BESS)](/ratgeber/grossspeicher-bess).",
        },
      ],
    },
    {
      id: "angebote",
      titel: "Checkliste: Angebote für Gewerbespeicher vergleichen",
      tocLabel: "Angebote vergleichen",
      bloecke: [
        {
          typ: "p",
          text: "**Speicherangebote sind nur vergleichbar, wenn Kapazität, Garantie und Lieferumfang auf dieselbe Basis gebracht werden.** Prüfen Sie mindestens diese Punkte:",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Nutzbare statt Brutto-kWh:** Preis je nutzbarer kWh rechnen – Bruttokapazität und Entladetiefe unterscheiden sich je Hersteller.",
            "**Leistung in kW** für Laden und Entladen, dauerhaft und kurzzeitig, passend zur Anwendung.",
            "**Garantie:** Jahre, zugesicherte Restkapazität und garantierter Energiedurchsatz in MWh – was zuerst erreicht wird, beendet die Garantie.",
            "**Zyklen und Betriebsweise:** Sind Peak Shaving, Spotpreis-Optimierung und Netzladen von der Garantie gedeckt?",
            "**Brandschutzkonzept:** Aufstellort, Abstände, Löschtechnik, Abstimmung mit Behörde, Feuerwehr und Versicherer.",
            "**EMS und Schnittstellen:** Messung am Hauptzählpunkt, offene Schnittstellen (z. B. Modbus), Anbindung an [SCADA und Fernüberwachung](/technik/scada), Direktvermarkter und Prognosen.",
            "**Netzanschluss:** Wer beantragt, wer zahlt Schutztechnik oder Trafo, und ist die vereinbarte Anschlussleistung ausreichend?",
            "**Service:** Wartungsumfang, Fernwartung, Ersatzteilverfügbarkeit, Reaktionszeiten und Software-Updates vertraglich geregelt.",
          ],
        },
        {
          typ: "kasten",
          variant: "tipp",
          titel: "Häufige Fehler",
          text: "Speicher nach Dachfläche oder Bauchgefühl dimensioniert, nur einen Nutzen gerechnet, Brutto- mit Nettokapazität verglichen, Netzanschluss und Brandschutz erst nach der Bestellung geklärt. Ohne Lastgang ist keine seriöse Auslegung möglich.",
        },
        {
          typ: "ablauf",
          schritte: [
            ["Lastgang und PV-Erzeugung auswerten", "12 Monate Viertelstundenwerte als Grundlage."],
            ["Nutzen festlegen und stapeln", "Peak Shaving, Eigenverbrauch, Spotpreis, Notstrom – mit Prioritäten."],
            ["Speicher auslegen", "Kapazität und Leistung aus der Nutzenkombination ableiten."],
            ["Angebote vergleichen", "mit der Checkliste oben, auf Basis nutzbarer kWh."],
            ["Förderung prüfen", "vor der Bestellung, da viele Programme das verlangen – etwa über den [Förder-Check](/foerdercheck)."],
          ],
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was kostet ein Gewerbespeicher pro kWh?",
      a: `Als Richtwert 2026 rund ${fmt(KLASSEN[0].von)} bis ${fmt(KLASSEN[0].bis)} € je nutzbarer kWh bei 30 bis 100 kWh und ${fmt(KLASSEN[1].von)} bis ${fmt(KLASSEN[1].bis)} € bei 100 bis 500 kWh, schlüsselfertig ohne Umsatzsteuer. Container im Megawattstunden-Bereich liegen darunter. Eine amtliche Statistik gibt es nur für Speicher bis 50 kWh (2024: ${fmt(HEIM_PREIS_2024)} €/kWh).`,
    },
    {
      q: "Was kostet ein 200-kWh-Speicher für einen Betrieb?",
      a: `Mit dem Richtwert von ${fmt(KLASSEN[1].von)} bis ${fmt(KLASSEN[1].bis)} € je kWh sind es rund ${eur(200 * KLASSEN[1].von)} bis ${eur(200 * KLASSEN[1].bis)} ohne Umsatzsteuer. Trafotausch, aufwendiger Brandschutz oder eine Ersatzstromumschaltung kommen gegebenenfalls hinzu.`,
    },
    {
      q: "Lohnt sich ein Gewerbespeicher?",
      a: `Meist nur mit mehreren gestapelten Nutzen. Im Beispiel (${fmt(KAP)} kWh, NE 6 Salzburg) bringen Peak Shaving, Eigenverbrauch und Spotpreis-Optimierung zusammen ${eur(B.netto)} im Jahr; die Amortisation liegt bei rund ${jahreD(B.amort)}, bei ${fmt(300)} €/kWh bei rund ${jahreD(rechne(300).amort)}.`,
    },
    {
      q: "Warum ist ein Speicher so viel teurer als die Batteriezellen?",
      a: `Stationäre Batteriepacks kosteten 2025 laut BloombergNEF im Mittel ${fmt(BNEF_PACK_USD)} $/kWh. Dazu kommen Wechselrichter, Batterie- und Energiemanagement, Gehäuse, Brandschutz, Netzanschluss, Schutztechnik, Planung, Montage und Marge – im Gewerbe oft ein Vielfaches des Packpreises.`,
    },
    {
      q: "Gibt es eine Förderung für Gewerbespeicher?",
      a: "Der EAG-Investitionszuschuss fördert Speicher nur gemeinsam mit einer PV-Anlage; der dritte Fördercall 2026 läuft von 8. bis 22. Oktober. Dazu kommen Landesprogramme und steuerliche Instrumente wie der Investitionsfreibetrag. Details im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss).",
    },
    {
      q: "Sind Speicher ab 2027 von Netzentgelten befreit?",
      a: "Nur systemdienliche Speicher ab 1 MW, und nur für Entnahmen, die ausschließlich der Wiedereinspeisung dienen. Voraussetzungen sind laut SNE-G-V-Entwurf unter anderem ein Netzknoten mit hoher Trafoauslastung und ein Flexibilitätsvertrag mit dem Regelzonenführer. Für Speicher hinter dem Zähler eines Betriebs ändert sich dadurch wenig.",
    },
  ],

  passend: [
    { href: "/gewerbespeicher", titel: "Gewerbespeicher", text: "Speicherlösungen für Betriebe, Landwirtschaft und Gemeinden." },
    { href: "/ratgeber/peak-shaving-leistungspreis", titel: "Peak Shaving und Leistungspreis", text: "Wie Lastspitzen abgerechnet werden und was Kappung bringt." },
    { href: "/ratgeber/grossspeicher-bess", titel: "Großspeicher (BESS)", text: "Speicher im Megawatt-Maßstab am Netz." },
    { href: "/technik/scada", titel: "SCADA und Fernüberwachung", text: "Speicher und PV zentral überwachen und steuern." },
  ],

  quellen: [
    { titel: "BMWET / FH Technikum Wien – PV-Batteriespeichersysteme: Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf", stand: "06/2025" },
    { titel: "BloombergNEF – Lithium-Ion Battery Pack Prices Fall to $108 per Kilowatt-Hour", url: "https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/", stand: "12/2025" },
    { titel: "RIS – BGBl. II Nr. 305/2025, Novelle der Systemnutzungsentgelte-Verordnung (Netzentgelte 2026)", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_II_305/BGBLA_2025_II_305.html", stand: "12/2025" },
    { titel: "E-Control – Begutachtungsentwurf SNE-G-V samt Erläuterungen", url: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf", stand: "07/2026" },
    { titel: "APG – Regelreserve (Balancing) in der Regelzone Österreich", url: "https://markt.apg.at/en/power-grid/balancing/", stand: "09/2026" },
    { titel: "OeMAG – Marktpreis für Ökostromanlagen", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "EAG-Abwicklungsstelle – Förderkalender", url: "https://www.eag-abwicklungsstelle.at/foerderkalender/", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Energy-Charts, Day-Ahead-Preise Gebotszone Österreich (eigene Auswertung)", url: "https://www.energy-charts.info", stand: "09/2026" },
  ],

  seitenCta: { titel: "Speicher für Ihren Betrieb?", text: "Nutzen stapeln, Größe aus dem Lastgang ableiten, Kosten ehrlich rechnen.", href: "/gewerbespeicher", label: "Gewerbespeicher ansehen" },
  cta: {
    title: "Gewerbespeicher, die sich rechnen müssen.",
    text: "Wir legen Speicher auf Basis Ihres Lastgangs aus, kombinieren Peak Shaving, Eigenverbrauch und Spotpreis und binden sie in eigene SCADA- und Fernwartungssysteme ein.",
    primary: { label: "Angebot anfragen", href: "/angebot" },
    secondary: { label: "Gewerbespeicher", href: "/gewerbespeicher" },
  },
};

export default artikel;
