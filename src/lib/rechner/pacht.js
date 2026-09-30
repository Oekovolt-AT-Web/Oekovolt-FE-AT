// src/lib/rechner/pacht.js
//
// Freiflächen- & Pacht-Rechner für Grundeigentümer (/rechner/freiflaeche-pacht).
// Reine Funktionen ohne React/Pfad-Aliase (per Node prüfbar). Stand: September 2026.
//
// Quellen/Annahmen (im UI offengelegt):
//  - Leistungsdichte je Konzept (kWp je Hektar Projektfläche):
//     Freifläche aufgeständert (Süd) ≈ 1.000 kWp/ha – eNu Energie- und Umweltagentur NÖ
//       („5 ha … ungefähr 5 MWp möglich“), energie-noe.at/agri-pv;
//     Agri-PV hoch aufgeständert ≈ 600 kWp/ha – Größenordnung Ackerbau mit größerem
//       Reihenabstand (Bauernzeitung „Welche Kulturen unter Agri-PV funktionieren“);
//     Agri-PV vertikal bifazial ≈ 400 kWp/ha bei 10 m Reihenabstand – Next2Sun, Agri-PV-FAQ.
//    Plausibilisiert mit BOKU Wien / Bundesanstalt für Agrarwirtschaft, „The techno-economic
//    potentials of agrivoltaic installations in Austria“, Renewable Energy 2026
//    (lt. pv magazine 16.03.2026): 1.173 MWh/ha Freifläche · 684 MWh/ha hoch aufgeständert ·
//    373 MWh/ha vertikal – deckt sich mit Dichte × PVGIS-Ertrag unten.
//  - Spezifischer Ertrag: PVGIS je Ort (src/data/regionen-pvgis.json, übergeben als
//    { sued35, ostwest15 }): Freifläche und hoch aufgeständert Süd 35°, vertikal Ost-West 15°
//    als Näherung (bifazialer Rückseitengewinn nicht gesondert angesetzt).
//  - Haushalte: Referenzhaushalt der E-Control mit 3.500 kWh/Jahr (Tarifkalkulator/Preismonitor).
//  - Pacht: KEINE Marktangabe. Der Betrag ist Ihre Annahme (Regler); Pachthöhen variieren
//    stark nach Region, Netznähe und Konzept – Landwirtschaftskammern beraten.

export const PACHT = {
  konzepte: [
    {
      id: "freiflaeche",
      label: "Freifläche",
      sub: "aufgeständert, Süd",
      kwpProHa: 1000,
      ertrag: (e) => e.sued35,
      landwirtschaft: "Unter und zwischen den Modulreihen ist Beweidung, z. B. mit Schafen, möglich.",
      eagAbschlag: true,
    },
    {
      id: "agri-hoch",
      label: "Agri-PV hoch",
      sub: "über Kulturen",
      kwpProHa: 600,
      ertrag: (e) => e.sued35,
      landwirtschaft: "Die Module überdachen Kulturen wie Obst, Beeren oder Gemüse und schützen vor Hagel und Hitze.",
      eagAbschlag: false,
    },
    {
      id: "agri-vertikal",
      label: "Agri-PV vertikal",
      sub: "bifazial, Ost-West",
      kwpProHa: 400,
      ertrag: (e) => e.ostwest15,
      landwirtschaft: "Zwischen den senkrechten Modulreihen bleibt der Großteil der Fläche maschinell bewirtschaftbar.",
      eagAbschlag: false,
    },
  ],
  haushaltKwh: 3500,
  pachtStandard: 1500, // €/ha und Jahr – BEISPIELWERT für den Regler, keine Marktangabe
  pachtMin: 0,
  pachtMax: 5000,
  indexStandard: 0.02, // Annahme Indexierung (z. B. VPI-gebunden)
  laufzeitStandard: 25, // üblich 20–30 Jahre (Ratgeber Freiflächen-PV Widmung)
  // Plausibilisierung (BOKU 2026) in MWh/ha
  bokuMwhProHa: { freiflaeche: 1173, "agri-hoch": 684, "agri-vertikal": 373 },
  co2KgProKwh: 0.2582, // Substitutionsfaktor PV (wie Solarrechner)
};

/** Widmungs-Kurzhinweise je Bundesland (Auszug aus dem Ratgeber, Rechtsstand 28.09.2026). */
export const WIDMUNG = {
  burgenland: "Über 35 m² Modulfläche nur in Eignungszonen per Landesverordnung (Bgld. RPG 2019, § 22d); zusätzlich Photovoltaikabgabe.",
  kaernten: "Widmung „Grünland – Photovoltaikanlage“ bzw. „– Agri-Photovoltaikanlage“; Widmungsfläche grundsätzlich höchstens 4 ha (K-PhV 2024), 1.000 m Abstand zwischen Widmungsflächen.",
  niederoesterreich: "Widmung „Grünland – Photovoltaikanlagen“ ab 50 kW; über 2 ha nur in einer der 116 Zonen des Sektoralen Raumordnungsprogramms.",
  oberoesterreich: "Sonderausweisung im Flächenwidmungsplan für jede freistehende Anlage im Grünland über 50 m² Modulfläche (Oö. ROG 1994, § 30a).",
  salzburg: "Kennzeichnung im Flächenwidmungsplan über 200 m² Kollektorfläche; Punkteschema für unbelastetes Grünland mit Bonus für Agri-PV.",
  steiermark: "Bis 2 ha zur lokalen Versorgung, bis 10 ha an vorbelasteten Standorten, darüber nur in den 36 Vorrangzonen (Agri-PV ausgenommen).",
  tirol: "Sonderflächenwidmung mit Verwendungszweck Photovoltaik (TROG 2022); keine landesweiten PV-Zonen.",
  vorarlberg: "Freifläche-Sondergebiet für Anlagen zur Erzeugung erneuerbarer Energie; Beschleunigungsgebiete über Landesraumplan vorgesehen.",
  wien: "Freiflächen-PV im Grünland nur mit entsprechender Widmung; Fokus auf Dächer und Überbauungen.",
};

const konzept = (id) => PACHT.konzepte.find((k) => k.id === id) || PACHT.konzepte[0];

/** Einschätzung der Netzanschluss-Entfernung (Faustregel für die Ersteinschätzung, keine Norm). */
export function netzEinschaetzung(abstandKm, kwp) {
  const mwp = Math.max(kwp / 1000, 0.1);
  const jeMwp = abstandKm / mwp;
  if (abstandKm <= 1 || jeMwp <= 0.5) return { stufe: "gut", text: "Kurzer Weg zum Netz – die Kabeltrasse fällt im Verhältnis zur Parkgröße kaum ins Gewicht." };
  if (jeMwp <= 1.5) return { stufe: "pruefen", text: "Die Trassenkosten sind spürbar. Entscheidend sind freie Kapazität am Anschlusspunkt und Dienstbarkeiten entlang der Leitung." };
  return { stufe: "kritisch", text: "Für diese Parkgröße ist der Weg zum Netz lang. Wirtschaftlich wird es meist nur mit größerer Fläche, Kooperation mit Nachbarflächen oder einem näheren Anschlusspunkt." };
}

/**
 * @param {object} e
 * @param {number} e.hektar
 * @param {object} e.standort   { sued35, ostwest15 } kWh/kWp (PVGIS)
 * @param {string} e.konzept    id aus PACHT.konzepte
 * @param {number} e.abstandKm  Entfernung zum möglichen Netzanschlusspunkt
 * @param {number} e.pachtEurHa Pacht je Hektar und Jahr (Annahme)
 * @param {number} e.index      jährliche Indexierung (0.02 = 2 %)
 * @param {number} e.laufzeit   Jahre
 */
export function rechnePacht({ hektar, standort, konzept: konzeptId = "freiflaeche", abstandKm = 1, pachtEurHa = PACHT.pachtStandard, index = PACHT.indexStandard, laufzeit = PACHT.laufzeitStandard }) {
  const k = konzept(konzeptId);
  const ha = Math.max(Number(hektar) || 0, 0);
  const kwp = ha * k.kwpProHa;
  const spez = k.ertrag(standort);
  const ertragKwh = kwp * spez;
  const haushalte = ertragKwh / PACHT.haushaltKwh;

  const jahre = Math.max(Math.round(laufzeit), 1);
  const reihe = [];
  let summe = 0;
  for (let t = 1; t <= jahre; t++) {
    const betrag = ha * pachtEurHa * Math.pow(1 + index, t - 1);
    summe += betrag;
    reihe.push({ jahr: t, betrag, kumuliert: summe });
  }

  const kw = kwp; // Maximalkapazität ≈ kWp (Näherung)
  const tor = kw < 250 ? "A" : kw < 35000 ? "B" : kw < 50000 ? "C" : "D";
  return {
    konzept: k,
    hektar: ha,
    kwp,
    spezifischerErtrag: spez,
    ertragKwh,
    mwhProHa: ha > 0 ? ertragKwh / 1000 / ha : 0,
    haushalte,
    co2Tonnen: (ertragKwh * PACHT.co2KgProKwh) / 1000,
    pachtJahr1: ha * pachtEurHa,
    pachtSumme: summe,
    pachtReihe: reihe,
    pachtJeKwp: kwp > 0 ? (ha * pachtEurHa) / kwp : 0,
    laufzeit: jahre,
    netz: netzEinschaetzung(abstandKm, kwp),
    tor,
    // EAG-Investitionszuschuss auch über 1.000 kWp – dann anteilig bis 1.000 kWp (EAG-AS FAQ 2026 Fragen 19/20)
    eagInvestitionszuschuss: kwp > 0,
    eagAnteilig: kwp > 1000,
    eagAbschlag: k.eagAbschlag,
  };
}
