// Ratgeber (AT): Reststromvermarktung – PV-Überschuss in Österreich verkaufen
// Zahlenbasis: OeMAG/E-Control (Marktpreis), Energy-Charts (eigene Auswertung Day-Ahead AT),
// Tarifvergleiche (Spannen, ohne Anbieternamen), ElWG (BGBl. I Nr. 91/2025). Stand 28.09.2026.
// Keine Imports – alle Werte hier definiert.

// ---------------------------------------------------------------- Formatierung
const n = (x) => Math.round(x).toLocaleString("de-DE");
const eur = (x) => n(x) + " €";
const kwhFmt = (x) => n(x) + " kWh";
const z3 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const z2 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const z1 = (x) => x.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pct = (x) => Math.round(x * 100) + " %";

// ---------------------------------------------------------------- Marktdaten
const MONATE = ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
// OeMAG-Monatsmarktpreis PV 2026 (ct/kWh)
const OEMAG_2026 = { 1: 8.842, 2: 8.457, 3: 5.72, 4: 6.772, 5: 6.772, 6: 6.772, 7: 6.146, 8: 8.997 };
// Solar-Marktwert AT 2026 (erzeugungsgewichteter Day-Ahead-Preis, €/MWh; eigene Auswertung Energy-Charts)
const SOLAR_MW_2026 = { 3: 59, 4: 16, 5: 36, 6: 55, 7: 67, 8: 94 };
// Jahreswerte Day-Ahead AT (eigene Auswertung Energy-Charts)
const MARKT = [
  { jahr: "2024", base: 81.9, solar: 53.0, negStd: 307, pvNeg: 0.14 },
  { jahr: "2025", base: 99.0, solar: 49.3, negStd: 378, pvNeg: 0.21 },
  { jahr: "2026 (bis 27.9.)", base: 121.3, solar: 62.1, negStd: 259, pvNeg: 0.16 },
];
const AE_PV_2026 = 0.408; // ct/kWh, Ausgleichsenergie-Abzug OeMAG
const VIB_MAX = 0.05; // ct/kWh, Versorgungsinfrastrukturbeitrag ab 2027 (Obergrenze)

// ---------------------------------------------------------------- Beispiel 400 kWp
const KWP = 400;
const UEBERSCHUSS = 180000; // kWh/Jahr
// Annahme: Verteilung des Überschusses über das Jahr (Summe 1)
const PROFIL = [0.02, 0.04, 0.08, 0.11, 0.13, 0.14, 0.14, 0.12, 0.09, 0.06, 0.04, 0.03];
const ENTGELT = 0.5; // ct/kWh Vermarktungsentgelt inkl. Ausgleichsenergie – Annahme
const FIX = 6.0; // ct/kWh Fixtarif – Annahme, kein Marktangebot
const BSP = [3, 4, 5, 6, 7, 8].map((m) => {
  const kwh = UEBERSCHUSS * PROFIL[m - 1];
  const spotCt = SOLAR_MW_2026[m] / 10 - ENTGELT;
  return {
    m,
    kwh,
    oemag: (kwh * OEMAG_2026[m]) / 100,
    spotCt,
    spot: (kwh * spotCt) / 100,
    fix: (kwh * FIX) / 100,
  };
});
const S = BSP.reduce(
  (a, x) => ({ kwh: a.kwh + x.kwh, oemag: a.oemag + x.oemag, spot: a.spot + x.spot, fix: a.fix + x.fix }),
  { kwh: 0, oemag: 0, spot: 0, fix: 0 }
);
const ct = (euro, kwh) => (euro / kwh) * 100;
const ANTEIL_BSP = S.kwh / UEBERSCHUSS;
// Hochrechnung aufs Jahr mit den mittleren ct/kWh des Zeitraums März–August
const JAHR = {
  oemag: (UEBERSCHUSS * ct(S.oemag, S.kwh)) / 100,
  spot: (UEBERSCHUSS * ct(S.spot, S.kwh)) / 100,
  fix: (UEBERSCHUSS * FIX) / 100,
};
const VIB_JAHR = (UEBERSCHUSS * VIB_MAX) / 100;

const artikel = {
  slug: "reststromvermarktung",
  title: "Reststromvermarktung: PV-Überschuss in Österreich verkaufen",
  seoTitle: "Reststromvermarktung: PV-Überschuss verkaufen | Ökovolt",
  kurzTitel: "Reststromvermarktung",
  description:
    "Reststromvermarktung in Österreich: OeMAG, Einspeisetarif, Direktvermarktung, Marktprämie, Energiegemeinschaft und PPA im Vergleich – mit 400-kWp-Beispiel.",
  excerpt:
    "Welche Wege es gibt, den PV-Überschuss eines Betriebs, Hofs oder einer Gemeinde zu verkaufen, was Solarstrom am Markt wirklich wert ist und wie sich OeMAG, Spot und Fixtarif 2026 im Beispiel schlagen.",
  hauptKeyword: "reststromvermarktung",
  keywords: [
    "Reststromvermarktung",
    "PV-Überschuss verkaufen",
    "Direktvermarktung Photovoltaik Österreich",
    "Überschusseinspeisung Gewerbe",
    "Solar-Marktwert",
    "Einspeisetarif Stromhändler",
    "OeMAG oder Direktvermarktung",
  ],
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "Netz, Energiegemeinschaften & Markt",
  bild: "/Images/AT/wissen/reststromvermarktung-floating-pv.jpg",
  bildAlt: "Luftaufnahme einer großen Photovoltaikanlage mit zwei Technikern in Arbeitskleidung",
  badge: { wert: pct(MARKT[1].solar / MARKT[1].base), text: "Solar-Marktwert 2025 im Verhältnis zum Base-Preis" },

  kurzFazit: [
    "**Für PV-Überschuss gibt es in Österreich sechs Wege:** OeMAG-Marktpreis (unter 500 kWp), Einspeisetarif eines Stromhändlers, Direktvermarktung zum Spotpreis, Marktprämie nach EAG, Energiegemeinschaft und PPA.",
    `**Solarstrom ist am Großhandelsmarkt nur rund die Hälfte des Durchschnittspreises wert:** 2025 lag der Solar-Marktwert in Österreich bei ${z1(MARKT[1].solar)} €/MWh, der Base-Preis bei ${z1(MARKT[1].base)} €/MWh (${pct(MARKT[1].solar / MARKT[1].base)}); ${pct(MARKT[1].pvNeg)} des PV-Stroms fielen in Stunden mit negativem Preis.`,
    `**Im Beispiel einer 400-kWp-Gewerbeanlage mit ${kwhFmt(UEBERSCHUSS)} Überschuss** brachte der OeMAG-Marktpreis von März bis August 2026 im Mittel ${z2(ct(S.oemag, S.kwh))} ct/kWh, eine Spot-Direktvermarktung nach Entgelt rund ${z2(ct(S.spot, S.kwh))} ct/kWh.`,
    `**Ab 1.1.2027 zahlen Einspeiser laut ElWG einen Versorgungsinfrastrukturbeitrag von höchstens ${z2(VIB_MAX)} ct/kWh** – für ${kwhFmt(UEBERSCHUSS)} sind das maximal ${eur(VIB_JAHR)} im Jahr; Anlagen bis 20 kW sind befreit.`,
  ],

  abschnitte: [
    {
      id: "optionen",
      titel: "Welche Möglichkeiten gibt es, PV-Überschuss zu verkaufen?",
      tocLabel: "Optionen im Überblick",
      bloecke: [
        {
          typ: "p",
          text: "**Reststromvermarktung heißt: Der Strom, den Betrieb, Hof oder Gemeindegebäude nicht selbst verbrauchen, wird an einen Abnehmer verkauft – an die OeMAG, einen Stromhändler, einen Direktvermarkter, eine Energiegemeinschaft oder über einen PPA an einen Unternehmenskunden.** Welche Option passt, hängt vor allem von Anlagengröße, Überschussmenge, Risikobereitschaft und gewünschter Vertragsbindung ab.",
        },
        {
          typ: "tabelle",
          caption: "Optionen für PV-Überschuss in Österreich im Vergleich, Stand September 2026",
          kopf: ["Option", "Preisbasis", "Größe", "Vertragsbindung", "Preisrisiko"],
          zeilen: [
            ["OeMAG-Marktpreis", "Monatswert PV, Korridor 60–100 % des Quartalsmarktpreises", "unter 500 kWp", "längstens bis 31.12.2030, Kündigung nach 12 Monaten möglich", "gering bis mittel (Untergrenze)"],
            ["Einspeisetarif Stromhändler", "fix, gestaffelt oder an Index/Spot gekoppelt", "typ. 25–250 kWp je Tarif", "oft an Bezugsvertrag gebunden", "je nach Modell"],
            ["Direktvermarktung Spot", "Viertelstunden-Day-Ahead × Einspeisung minus Entgelt", "ab mittleren Anlagen sinnvoll, ab 500 kWp nötig", "meist ein bis mehrere Jahre", "hoch (Marktwert, negative Preise)"],
            ["Direktvermarktung Fixpreis", "fester ct/kWh-Wert für die Laufzeit", "wie oben", "Laufzeit fix", "beim Vermarkter; Volumenrisiko teils beim Betreiber"],
            ["Marktprämie (EAG)", "Marktwert plus Prämie bis zum Zuschlagswert", "Teilnahme an PV-Ausschreibung", "Förderdauer lt. EAG, Direktvermarktung Pflicht", "gering bis mittel"],
            ["Energiegemeinschaft (EEG/BEG)", "intern vereinbarter Preis", "lokal/regional (EEG) oder österreichweit (BEG)", "nach Statut der Gemeinschaft", "gering, aber Mengenrisiko"],
            ["PPA", "Pay-as-produced, Profil oder Fixpreis", "größere Mengen", "typ. 5–15 Jahre (Richtwert)", "vertraglich verteilt"],
          ],
          minBreite: 820,
          fussnote: "Eigene Zusammenstellung auf Basis OeMAG, E-Control, EAG und Tarifvergleichen. Größen und Laufzeiten sind Richtwerte; maßgeblich ist der konkrete Vertrag. Keine Rechtsberatung.",
        },
        {
          typ: "p",
          text: "Die Grundlagen der festen Abnahme erklärt der Ratgeber [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis), alle Vergütungsmodelle für kleinere Anlagen [Einspeisevergütung 2026](/ratgeber/einspeiseverguetung-2026). Begriffe: [Direktvermarktung](/wissen/lexikon#direktvermarktung) und [OeMAG](/wissen/lexikon#oemag) im Lexikon.",
        },
      ],
    },
    {
      id: "marktwert",
      titel: "Was ist PV-Überschuss am Markt wert? Solar-Marktwert gegenüber Base",
      tocLabel: "Solar-Marktwert",
      bloecke: [
        {
          typ: "p",
          text: `**Der Solar-Marktwert – der mit der PV-Erzeugung gewichtete Day-Ahead-Preis – lag in Österreich 2025 bei ${z1(MARKT[1].solar)} €/MWh und damit bei nur ${pct(MARKT[1].solar / MARKT[1].base)} des durchschnittlichen Base-Preises.** Der Grund: Alle PV-Anlagen erzeugen gleichzeitig zu Mittag und drücken genau dann die Preise. Dieses Verhältnis nennt man Capture-Rate; 2026 lag sie bis Ende September bei rund ${pct(MARKT[2].solar / MARKT[2].base)}.`,
        },
        {
          typ: "tabelle",
          caption: "Day-Ahead-Markt Österreich: Base-Preis, Solar-Marktwert und negative Preise, Stand September 2026",
          kopf: ["Jahr", "Base-Preis", "Solar-Marktwert", "Capture-Rate", "Stunden mit negativem Preis", "PV-Strom in negativen Stunden"],
          zeilen: MARKT.map((x) => [x.jahr, `${z1(x.base)} €/MWh`, `${z1(x.solar)} €/MWh`, pct(x.solar / x.base), n(x.negStd), pct(x.pvNeg)]),
          hervorheben: 3,
          minBreite: 760,
          fussnote: "Eigene Auswertung auf Basis Energy-Charts (Fraunhofer ISE), Gebotszone AT. Negative Stunden = Stundenmittel unter 0 €/MWh. 2026: 1. Jänner bis 27. September.",
        },
        { typ: "h3", text: "Negative Preise und Abregelung" },
        {
          typ: "p",
          text: "In Stunden mit negativem Preis zahlt, wer einspeist und am Spotpreis abrechnet, drauf. 2026 fiel der Tiefstwert in Österreich auf −497 €/MWh. Eine Direktvermarktung rechnet sich deshalb nur mit **Fernsteuerbarkeit:** Der Vermarkter regelt die Anlage in solchen Viertelstunden ab oder die Anlage deckt dann nur den Eigenverbrauch. Wie oft das vorkommt und was es für Speicher bedeutet, erklärt der Ratgeber [negative Strompreise](/ratgeber/negative-strompreise).",
        },
        { typ: "h3", text: "Ausgleichsenergie und Prognose" },
        {
          typ: "p",
          text: `Jede eingespeiste Viertelstunde muss vorab prognostiziert und in einer Bilanzgruppe angemeldet werden. Weicht die tatsächliche Einspeisung ab, fallen Ausgleichsenergiekosten an. Bei der OeMAG sind sie seit 2026 pauschal mit ${z3(AE_PV_2026)} ct/kWh eingepreist; ein Direktvermarkter kalkuliert sie in sein Entgelt oder gibt sie weiter. Gute Prognosen, aktuelle Anlagendaten und eine schnelle Störungsmeldung senken diese Kosten.`,
        },
      ],
    },
    {
      id: "wege",
      titel: "Die sechs Wege im Detail",
      tocLabel: "Wege im Detail",
      bloecke: [
        {
          typ: "karten",
          cols: 2,
          items: [
            { titel: "OeMAG-Marktpreis", text: "Abnahmepflicht für Anlagen unter 500 kW(p) mit Einspeisezählpunkt, kein Strombezugsvertrag nötig. Die Untergrenze von 60 % des Quartalsmarktpreises schützt im Frühjahr, die Obergrenze kappt Hochpreismonate. Details im Ratgeber [OeMAG-Marktpreis](/ratgeber/oemag-marktpreis)." },
            { titel: "Einspeisetarif eines Stromhändlers", text: "Tarifvergleiche zeigten im September 2026 Werte zwischen rund 2 und 11 ct/kWh. Modelle: monatlich schwimmend an einem Referenzwert mit Ab- oder Aufschlag, fixe Staffeltarife oder stündlich bzw. viertelstündlich an den Day-Ahead-Preis gekoppelt. Häufig nur mit Bezugsvertrag und bis zu einer Größengrenze." },
            { titel: "Direktvermarktung zum Spotpreis", text: "Der Direktvermarkter übernimmt Bilanzgruppe, Prognose und Handel und zahlt je Viertelstunde den Day-Ahead-Preis für die eingespeiste Menge abzüglich eines Entgelts. Alternativ bieten viele Vermarkter Fixpreise oder Mischmodelle an." },
            { titel: "Marktprämie nach EAG", text: "Für PV über die Ausschreibung der OeMAG (2. Ausschreibung 2026: 179.033 kWp Volumen, Höchstpreis 6,69 ct/kWh, Einreichung 27.5.–11.6., Zuschlag 10.7.). Die Anlage muss direkt vermarktet werden. Nach geltender Fassung entfällt die Prämie, wenn der Day-Ahead-Preis sechs aufeinanderfolgende Stunden negativ ist." },
            { titel: "Energiegemeinschaft (EEG/BEG)", text: "Überschuss wird an Mitglieder verkauft, der Preis ist intern frei vereinbar; lokale und regionale EEG erhalten reduzierte Netzentgelte. Mitglieder einer EEG können u. a. natürliche Personen, Gemeinden und KMU sein. Was die Gemeinschaft nicht abnimmt, braucht weiterhin einen Abnehmer – siehe [Energiegemeinschaft für Unternehmen](/ratgeber/energiegemeinschaft-gewerbe)." },
            { titel: "PPA", text: "Langfristiger Liefervertrag mit einem Unternehmen oder Händler – eher für große Dächer, Freiflächen und mehrere Anlagen. Preis, Menge und Risikoverteilung sind verhandelbar. Mehr im Ratgeber [PPA in Österreich](/ratgeber/ppa-oesterreich)." },
          ],
        },
        {
          typ: "kasten",
          variant: "recht",
          titel: "Förderung und Vermarktung zusammendenken",
          text: "Marktprämie und EAG-Investitionszuschuss sind für dieselbe Anlage in der Regel alternativ, nicht kumulativ. Klären Sie vor dem Förderansuchen, welche Vermarktung Sie planen – Details im Ratgeber [EAG-Investitionszuschuss](/ratgeber/eag-investitionszuschuss) und bei der EAG-Abwicklungsstelle.",
        },
      ],
    },
    {
      id: "voraussetzungen",
      titel: "Welche technischen Voraussetzungen braucht die Direktvermarktung?",
      tocLabel: "Voraussetzungen",
      bloecke: [
        {
          typ: "p",
          text: "**Für die Direktvermarktung braucht die Anlage einen eigenen Einspeisezählpunkt, eine viertelstündliche Messung und in der Regel eine Fernsteuerbarkeit, über die der Vermarkter die Leistung begrenzen kann.** Dazu kommen Datenschnittstellen für Prognose und Abrechnung.",
        },
        {
          typ: "checkliste",
          punkte: [
            "**Zählpunkt und Netzzugangsvertrag:** Einspeisezählpunkt beim Netzbetreiber, Zuordnung zur Bilanzgruppe des Vermarkters.",
            "**Viertelstundenmessung:** Smart Meter oder Lastprofilzähler; seit Oktober 2025 wird auch am Day-Ahead-Markt in 15-Minuten-Produkten gehandelt.",
            "**Fernsteuerbarkeit:** Sollwertvorgabe an Wechselrichter oder Parkregler, damit bei negativen Preisen oder auf Anforderung abgeregelt werden kann – siehe [Parkregler (EZA-Regler)](/technik/parkregler).",
            "**Monitoring und Datenanbindung:** Echtzeitwerte für Prognose, Störungserkennung und Nachweis – etwa über ein [SCADA-System](/technik/scada).",
            "**Einspeisebegrenzung beachten:** Laut ElWG darf eine vereinbarte Einspeisebegrenzung 70 % der Modulspitzenleistung nicht unterschreiten; das beeinflusst die vermarktbare Menge.",
            "**Vertragsdaten:** Anlagenstammdaten, Ausrichtung, Wechselrichterleistung und Eigenverbrauchsprofil für die Prognose bereitstellen.",
          ],
        },
        {
          typ: "kasten",
          variant: "wichtig",
          titel: "Neu ab 2027: Versorgungsinfrastrukturbeitrag",
          text: `Mit dem Elektrizitätswirtschaftsgesetz (ElWG, BGBl. I Nr. 91/2025) zahlen Einspeiser ab 1.1.2027 einen Beitrag auf die eingespeiste Jahresmenge, gedeckelt mit ${z2(VIB_MAX)} ct/kWh. Anlagen bis 20 kW sind befreit. Für ${kwhFmt(UEBERSCHUSS)} Überschuss sind das höchstens ${eur(VIB_JAHR)} pro Jahr. Mehr im Ratgeber [ElWG](/ratgeber/elwg-elektrizitaetswirtschaftsgesetz).`,
        },
        {
          typ: "p",
          text: "Ökovolt bietet Reststrom- und Direktvermarktung als Leistung an. Für die technische Anbindung stehen eigene Parkregler (EZA-Regler) und eigene SCADA- und Fernwartungssysteme zur Verfügung; Details zum Ablauf finden Sie auf der Seite [Direktvermarktung](/service/direktvermarktung).",
        },
      ],
    },
    {
      id: "beispiel",
      titel: `Beispielrechnung: 400 kWp Gewerbedach mit ${kwhFmt(UEBERSCHUSS)} Überschuss`,
      tocLabel: "Beispielrechnung",
      bloecke: [
        {
          typ: "p",
          text: `**Mit den Marktdaten 2026 schneidet der OeMAG-Marktpreis für eine 400-kWp-Anlage besser ab als eine Spot-Direktvermarktung – vor allem wegen der Untergrenze im Frühjahr.** Verglichen werden die Monate März bis August 2026, für die sowohl OeMAG-Monatswerte als auch Solar-Marktwerte vorliegen; sie umfassen im angenommenen Profil ${pct(ANTEIL_BSP)} des Jahresüberschusses. Annahmen: Vermarktungsentgelt ${z1(ENTGELT)} ct/kWh inkl. Ausgleichsenergie, Fixtarif ${z1(FIX)} ct/kWh – beides Rechenannahmen, keine Angebote.`,
        },
        {
          typ: "tabelle",
          caption: `400-kWp-Gewerbedach: Erlös aus ${kwhFmt(UEBERSCHUSS)} Überschuss, März bis August 2026, Stand September 2026`,
          kopf: ["Monat", "Überschuss", "OeMAG-Marktpreis", "Spot-Direktvermarktung", "Fixtarif (Annahme)"],
          zeilen: [
            ...BSP.map((x) => [
              MONATE[x.m - 1],
              kwhFmt(x.kwh),
              `${eur(x.oemag)} (${z3(OEMAG_2026[x.m])} ct)`,
              `${eur(x.spot)} (${z1(x.spotCt)} ct)`,
              eur(x.fix),
            ]),
            ["Summe März–August", kwhFmt(S.kwh), `${eur(S.oemag)} (${z2(ct(S.oemag, S.kwh))} ct)`, `${eur(S.spot)} (${z2(ct(S.spot, S.kwh))} ct)`, `${eur(S.fix)} (${z1(FIX)} ct)`],
            ["Hochrechnung Jahr", kwhFmt(UEBERSCHUSS), eur(JAHR.oemag), eur(JAHR.spot), eur(JAHR.fix)],
          ],
          hervorheben: 2,
          markierteZeile: BSP.length,
          minBreite: 760,
          fussnote: `Annahmen offengelegt: Monatsanteile des Überschusses (Jän–Dez) ${PROFIL.map((p) => Math.round(p * 100)).join("/")} %. OeMAG = veröffentlichte Monatswerte PV 2026. Spot = Solar-Marktwert AT (eigene Auswertung auf Basis Energy-Charts, erzeugungsgewichtet) minus ${z1(ENTGELT)} ct/kWh Entgelt; ohne Zusatzerlös durch Abregelung bei negativen Preisen. Hochrechnung = Mittelwert März–August × Jahresmenge, keine Prognose. Ohne Versorgungsinfrastrukturbeitrag (erst ab 2027).`,
        },
        {
          typ: "p",
          text: `Im April 2026 war Solarstrom am Markt im Mittel nur ${z1(SOLAR_MW_2026[4] / 10)} ct/kWh wert; die OeMAG vergütete ${z3(OEMAG_2026[4])} ct. Im August drehte sich das Bild fast: Mit ${SOLAR_MW_2026[8]} €/MWh lag der Spotwert nach Entgelt knapp unter dem OeMAG-Wert. Ein Fixtarif von ${z1(FIX)} ct hätte im Beispiel zwischen beiden gelegen – er tauscht Chancen gegen Planbarkeit.`,
        },
        {
          typ: "kasten",
          variant: "info",
          titel: "Grenzen der Rechnung",
          text: "Der Überschuss eines Gewerbedachs fällt überdurchschnittlich an Wochenenden und Feiertagen an – dann sind die Mittagspreise oft besonders niedrig. Der tatsächliche Spotwert Ihres Überschusses kann deshalb unter dem Solar-Marktwert der gesamten PV-Erzeugung liegen. Umgekehrt verbessert gezieltes Abregeln bei negativen Preisen den Spoterlös. Rechnen Sie mit Ihren eigenen Viertelstundenwerten nach.",
        },
      ],
    },
    {
      id: "wechsel",
      titel: "Wechsel und Kündigung: Was bei der OeMAG gilt",
      tocLabel: "Wechselregeln",
      bloecke: [
        {
          typ: "p",
          text: "**Ein OeMAG-Marktpreisvertrag kann nach einer Mindesteinspeisedauer von 12 Monaten schriftlich mit vier Wochen Frist zum Monatsletzten gekündigt werden; eine Rückkehr zur OeMAG ist nach einem Wechsel zu einem Stromhändler erst nach 12 Monaten möglich.** Ein Wechsel sollte deshalb nicht nach einem einzelnen guten Monat entschieden werden.",
        },
        {
          typ: "liste",
          punkte: [
            "**Saisonales Hin- und Herwechseln** funktioniert wegen der 12-Monats-Regeln nicht.",
            "**Laufzeitende:** Marktpreisverträge laufen längstens bis 31.12.2030 – Direktvermarktungs- oder PPA-Verträge sollten dazu passen.",
            "**Anlagen ab 500 kWp** fallen aus der OeMAG-Abnahme; Erweiterungen deshalb frühzeitig mit dem Vermarktungsmodell abstimmen.",
            "**Händlerverträge** prüfen auf Laufzeit, Kündigungsfrist, Bezugsvertragspflicht, Grundgebühr und Regeln bei negativen Preisen.",
          ],
        },
      ],
    },
    {
      id: "fehler",
      titel: "Typische Fehler bei der Reststromvermarktung",
      tocLabel: "Typische Fehler",
      bloecke: [
        {
          typ: "liste",
          punkte: [
            "**Einen Monatswert statt eines Jahres vergleichen:** Werbewerte zeigen oft Winter- oder Hochpreismonate. Entscheidend ist der Jahreserlös mit Ihrem Profil.",
            "**Base-Preis statt Solar-Marktwert ansetzen:** Wer mit dem Durchschnittspreis rechnet, überschätzt den Spoterlös um rund die Hälfte.",
            "**Negative Preise ignorieren:** Ohne Abregelung zahlen Spot-Einspeiser in solchen Viertelstunden drauf.",
            "**Überschuss überdimensionieren:** Jede Kilowattstunde Eigenverbrauch ersetzt Netzbezug mit Energiepreis, Netzentgelten und Abgaben – meist ein Vielfaches des Einspeiseerlöses. Ein [Gewerbespeicher](/gewerbespeicher) oder Lastverschiebung bringt oft mehr als ein besserer Tarif.",
            "**Bezugsvertrag übersehen:** Ein hoher Einspeisetarif kann an einen teuren Bezugsvertrag gekoppelt sein.",
          ],
        },
      ],
    },
    {
      id: "vorgehen",
      titel: "Entscheidungscheckliste: So wählen Sie die passende Vermarktung",
      tocLabel: "Checkliste",
      bloecke: [
        {
          typ: "ablauf",
          schritte: [
            ["Überschuss messen", "Zwölf Monate Viertelstundenwerte der Einspeisung auswerten: Menge, Monatsverteilung, Anteil an Wochenenden."],
            ["Größe und Status klären", "Unter 500 kWp? Bereits OeMAG-Vertrag? Förderung mit Marktprämie oder Investitionszuschuss?"],
            ["Eigenverbrauch zuerst", "Prüfen, ob Speicher, Lastverschiebung oder Energiegemeinschaft den Überschuss sinnvoll senken."],
            ["Angebote vergleichbar machen", "Alle Varianten mit derselben Jahresmenge und demselben Monatsprofil rechnen, inkl. Entgelten, Grundgebühren und Regeln bei negativen Preisen."],
            ["Technik vorbereiten", "Viertelstundenmessung, Fernsteuerbarkeit und Datenanbindung sicherstellen."],
            ["Laufzeiten abstimmen", "OeMAG-Kündigungsfristen, 12-Monats-Sperre und Vertragsende 2030 in die Planung aufnehmen."],
          ],
        },
        {
          typ: "tool",
          href: "/service/direktvermarktung",
          titel: "Direktvermarktung und Reststromvermarktung",
          text: "So läuft die Vermarktung Ihres Überschusses ab – von der Messung bis zur Abrechnung.",
          label: "Zur Leistung",
        },
      ],
    },
  ],

  faq: [
    {
      q: "Was bedeutet Reststromvermarktung?",
      a: "Reststromvermarktung ist der Verkauf des Stroms, den eine PV-Anlage erzeugt, aber vor Ort nicht verbraucht wird. Abnehmer können die OeMAG, ein Stromhändler, ein Direktvermarkter, eine Energiegemeinschaft oder ein PPA-Partner sein.",
    },
    {
      q: "Ab welcher Größe lohnt sich Direktvermarktung statt OeMAG?",
      a: `Anlagen ab 500 kWp können nicht an die OeMAG verkaufen und brauchen eine Direktvermarktung. Darunter hängt es vom Markt ab: 2026 lag der OeMAG-Marktpreis im Beispiel von März bis August bei ${z2(ct(S.oemag, S.kwh))} ct/kWh, der Spoterlös nach Entgelt bei ${z2(ct(S.spot, S.kwh))} ct/kWh.`,
    },
    {
      q: "Was ist der Solar-Marktwert?",
      a: `Der Solar-Marktwert ist der mit der PV-Erzeugung gewichtete Day-Ahead-Preis. In Österreich lag er 2025 bei ${z1(MARKT[1].solar)} €/MWh, das sind rund ${pct(MARKT[1].solar / MARKT[1].base)} des Base-Preises, weil PV-Strom überwiegend zu Mittag mit niedrigen Preisen anfällt.`,
    },
    {
      q: "Brauche ich für die Direktvermarktung einen Smart Meter?",
      a: "Ja, eine viertelstündliche Messung ist Voraussetzung, weil jede Viertelstunde zum jeweiligen Day-Ahead-Preis abgerechnet wird. Zusätzlich verlangen Direktvermarkter meist eine Fernsteuerbarkeit, etwa über einen [Parkregler](/technik/parkregler).",
    },
    {
      q: "Kann ich von der OeMAG zu einem Stromhändler und wieder zurück wechseln?",
      a: "Ja, aber nicht kurzfristig: Kündigung nach 12 Monaten Mindesteinspeisedauer mit vier Wochen Frist zum Monatsletzten, Rückkehr zur OeMAG frühestens 12 Monate nach dem Wechsel. Saisonales Wechseln ist damit nicht möglich.",
    },
    {
      q: "Was kostet der Versorgungsinfrastrukturbeitrag ab 2027?",
      a: `Laut ElWG höchstens ${z2(VIB_MAX)} ct je eingespeister kWh; Anlagen bis 20 kW sind befreit. Bei ${kwhFmt(UEBERSCHUSS)} Überschuss sind das maximal ${eur(VIB_JAHR)} im Jahr.`,
    },
    {
      q: "Bietet Ökovolt Reststromvermarktung an?",
      a: "Ja, Ökovolt bietet Reststrom- bzw. Direktvermarktung als Leistung an und bindet Anlagen mit eigenen Parkreglern und SCADA-Systemen an. Den Ablauf beschreibt die Seite [Direktvermarktung](/service/direktvermarktung).",
    },
  ],

  passend: [
    { href: "/service/direktvermarktung", titel: "Direktvermarktung", text: "Überschuss am Markt vermarkten lassen." },
    { href: "/ratgeber/oemag-marktpreis", titel: "OeMAG-Marktpreis", text: "Berechnung, Historie und Erlösbeispiel." },
    { href: "/ratgeber/ppa-oesterreich", titel: "PPA in Österreich", text: "Langfristige Stromabnahmeverträge erklärt." },
    { href: "/technik/parkregler", titel: "Parkregler (EZA-Regler)", text: "Fernsteuerbarkeit und Einspeiselimit." },
  ],

  quellen: [
    { titel: "OeMAG – Marktpreis (Voraussetzungen, Kündigung, Ausgleichsenergie)", url: "https://www.oem-ag.at/marktpreis", stand: "09/2026" },
    { titel: "E-Control – Marktpreis-Archiv nach § 41 ÖSG 2012", url: "https://www.e-control.at/marktteilnehmer/oeko-energie/marktpreis-archiv", stand: "09/2026" },
    { titel: "Fraunhofer ISE – Energy-Charts, Day-Ahead-Preise und PV-Erzeugung Österreich (eigene Auswertung)", url: "https://www.energy-charts.info", stand: "09/2026" },
    { titel: "photovoltaik-service.at – Einspeisetarif OeMAG, Wechsel und Rückkehr", url: "https://photovoltaik-service.at/wie-hoch-ist-der-einspeisetarif-bei-der-oemag", stand: "09/2026" },
    { titel: "stromliste.at – Einspeisetarife im Vergleich", url: "https://www.stromliste.at", stand: "15.09.2026" },
    { titel: "Elektrizitätswirtschaftsgesetz (ElWG), BGBl. I Nr. 91/2025 – RIS", url: "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2025_I_91/BGBLA_2025_I_91.html", stand: "09/2026" },
    { titel: "EAG-Abwicklungsstelle – Förderkalender (Ausschreibungen Marktprämie)", url: "https://www.eag-abwicklungsstelle.at/foerderkalender/", stand: "09/2026" },
  ],

  seitenCta: {
    titel: "Überschuss vermarkten?",
    text: "OeMAG, Händlertarif oder Direktvermarktung – mit Ihren Zählwerten gerechnet.",
    href: "/service/direktvermarktung",
    label: "Direktvermarktung ansehen",
  },
  cta: {
    title: "Ihr PV-Überschuss – sauber vermarktet.",
    text: "Wir werten Ihre Einspeisung aus, vergleichen die Vermarktungswege und sorgen für die technische Anbindung mit Parkregler und SCADA.",
    primary: { label: "Anfrage starten", href: "/angebot" },
    secondary: { label: "Direktvermarktung", href: "/service/direktvermarktung" },
  },
};

export default artikel;
