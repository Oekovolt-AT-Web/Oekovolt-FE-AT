// src/lib/rechner/eflotte.js
//
// E-Flotte-Rechner (Österreich, Unternehmen): Firmenflotte von Diesel/Benzin
// auf Elektro umstellen – Gesamtkosten (TCO) über die Nutzungsdauer, jährliche
// Ersparnis, CO₂, Ladeenergie inkl. PV-Anteil und eine erste Empfehlung für die
// Ladepunkte. Reine Funktionen ohne React/Next-Abhängigkeit (per Node testbar).
//
// Rechenbasis: NETTO aus Sicht eines vorsteuerabzugsberechtigten Betriebs.
// Österreich-Besonderheit, die das Ergebnis stark prägt:
//   - Verbrenner-Pkw/Kombi: KEIN Vorsteuerabzug (§ 12 Abs. 2 Z 2 lit. b UStG) –
//     Anschaffung, Kraftstoff und Wartung zählen brutto.
//   - E-Pkw (0 g CO₂): Vorsteuerabzug bis 40.000 € brutto voll, 40.000–80.000 €
//     höchstens 6.666,67 € (Eigenverbrauchsbesteuerung über der Luxustangente),
//     über 80.000 € keiner (UStG § 12 Abs. 2 Z 2a; WKO „Elektromobilität aus
//     steuerlicher Sicht“, EY Österreich „Steuervorteile von Elektroautos 2026“).
//   - Klein-Lkw/Transporter der Fiskal-Lkw-Liste und Lkw: Vorsteuerabzug für
//     Verbrenner UND E-Fahrzeug – beide netto.
// Recherchestand: 29.09.2026. Alle Werte sind Richtwerte, keine Angebote und
// keine Ökovolt-Preise.

import { WALLBOX, satzFuer } from "./annahmen.js";
import { ANNAHMEN as SOLAR } from "../../data/solarrechner.js";

export const FLOTTE_STAND = "September 2026";
const UST = 0.2;

/**
 * CO₂-Faktoren inkl. Vorkette (Well-to-Wheel), alle aus EINER Quelle, damit
 * Verbrenner und Strom methodisch gleich bewertet werden:
 * Umweltbundesamt, „Harmonisierte österreichische direkte und vorgelagerte
 * THG-Emissionsfaktoren“, REP-0948, Wien 2025 (Stand 10.02.2025):
 *  - Tab. 7: Diesel inkl. Beimengung 330 g CO₂e/kWh; 0,84 kg/l; 11,67 kWh/kg
 *            → 9,80 kWh/l → 3,23 kg CO₂e je Liter
 *            Benzin inkl. Beimengung 327 g CO₂e/kWh; 0,75 kg/l; 11,32 kWh/kg
 *            → 8,49 kWh/l → 2,78 kg CO₂e je Liter
 *  - Tab. 4: Stromaufbringung Österreich (inkl. Importe, 6 % Netzverluste)
 *            209 g CO₂e/kWh gesamt; Photovoltaik 40 g CO₂e/kWh (nur Vorkette).
 * Zum Vergleich: nur Verbrennung (Tank-to-Wheel) wären es 2,51 kg (Diesel)
 * bzw. 2,24 kg (Benzin) je Liter.
 */
export const CO2 = {
  diesel: 3.23, // kg CO₂e je Liter
  benzin: 2.78,
  strom: 0.209, // kg CO₂e je kWh, österreichische Stromaufbringung
  pv: 0.04, // kg CO₂e je kWh, eigener Solarstrom (Herstellung der Anlage)
  quelle: { name: "Umweltbundesamt, REP-0948 (2025)", url: "https://www.umweltbundesamt.at/fileadmin/site/publikationen/rep0948.pdf" },
};

/**
 * Fahrzeugklassen mit Standardwerten (Richtwerte, 09/2026):
 * - Verbrauch Verbrenner Pkw: wie E-Auto-Laderechner (WALLBOX) – realistische
 *   Alltagswerte, nicht WLTP.
 * - E-Verbrauch inkl. Ladeverluste: ADAC Ecotest (Stand 21.07.2026) – Mittelklasse
 *   17–21,5, SUV 18–27 kWh/100 km; Transporter/Vans 28–31 kWh/100 km
 *   (z. B. Citroën ë-Spacetourer 29,7). Lkw: Praxisdaten Verteiler-/Regional-
 *   verkehr 120–150 kWh/100 km (Designwerk-Kundenflotte 2024: Ø 147,5 kWh gegenüber
 *   40,7 l Diesel; KEA-BW „Faktencheck E-Lkw“ 2026).
 * - Preise und Wartung: Richtwerte für die Größenordnung – im Rechner anpassbar.
 *   Pkw-Preise BRUTTO (inkl. NoVA beim Verbrenner), sonst NETTO.
 */
export const KLASSEN = {
  pkw: {
    id: "pkw",
    label: "Pkw",
    lang: "Pkw & Kombi",
    sub: "Firmenwagen",
    km: 25000,
    liter: { diesel: WALLBOX.kraftstoffe.diesel.verbrauch, benzin: WALLBOX.kraftstoffe.benzin.verbrauch },
    kwh: 19,
    preis: 42000, // € brutto inkl. NoVA (Verbrenner, Kompakt-SUV/Kombi)
    mehrpreis: 2000, // € brutto: E-Variante – NoVA-frei, daher oft kaum teurer
    wartungV: 900, // € netto je Jahr (Service, Reifen, Verschleiß)
    wartungE: 600, // € netto je Jahr (kein Öl, weniger Bremsverschleiß)
    grenzen: { km: [5000, 60000, 1000], preis: [20000, 90000, 1000], mehrpreis: [-10000, 30000, 500], kwh: [13, 28, 0.5], liter: [3.5, 12, 0.1] },
  },
  transporter: {
    id: "transporter",
    label: "Transporter",
    lang: "Transporter & leichte Nfz",
    sub: "bis 3,5 t",
    km: 20000,
    liter: { diesel: 9.0 },
    kwh: 30,
    preis: 40000, // € netto (Kastenwagen ~3,5 t)
    mehrpreis: 12000, // € netto
    wartungV: 1400,
    wartungE: 950,
    grenzen: { km: [5000, 60000, 1000], preis: [20000, 90000, 1000], mehrpreis: [-5000, 40000, 500], kwh: [18, 45, 0.5], liter: [6, 16, 0.1] },
  },
  lkw: {
    id: "lkw",
    label: "Lkw",
    lang: "Lkw (Verteiler-/Regionalverkehr)",
    sub: "über 3,5 t",
    km: 60000,
    liter: { diesel: 30 },
    kwh: 125,
    preis: 120000, // € netto
    mehrpreis: 150000, // € netto
    wartungV: 9000,
    wartungE: 6000,
    mautAnteil: 50, // % der km auf mautpflichtigen Autobahnen/Schnellstraßen
    achsen: 2,
    grenzen: { km: [15000, 150000, 5000], preis: [60000, 250000, 5000], mehrpreis: [20000, 300000, 5000], kwh: [70, 180, 1], liter: [18, 45, 0.5] },
  },
};
export const KLASSEN_IDS = ["pkw", "transporter", "lkw"];

/** Allgemeine Annahmen des E-Flotte-Rechners */
export const FLOTTE = {
  // Kraftstoff an der Zapfsäule, brutto – EU Weekly Oil Bulletin (Österreich,
  // 21.09.2026): Diesel 2,238 €/l, Euro-Super 95 1,925 €/l (über annahmen.js).
  diesel: WALLBOX.kraftstoffe.diesel.preis,
  benzin: WALLBOX.kraftstoffe.benzin.preis,
  // Strom im Betrieb, vermeidbarer Arbeitspreis NETTO (Eurostat nrg_pc_205, AT,
  // 2. Hj. 2025, Band IB 20–499 MWh: 23,2 ct ohne USt; abzüglich Leistungspreis-
  // anteil ≈ 20 ct – siehe strompreisGewerbe in src/data/solarrechner.js).
  stromCt: 20,
  // Öffentliches Laden netto (Mischpreis AC/DC ad hoc; E-Auto-Laderechner rechnet
  // brutto 55 ct → netto ≈ 46 ct; mit Flottenkarten-Vertrag oft günstiger).
  oeffentlichCt: 45,
  ladeanteilBetrieb: 80, // % der Energie am Betriebsstandort (Depot)
  ertragProKwp: SOLAR.ertragProKwpSued, // 1.100 kWh/kWp
  // Anteil des PV-Jahresertrags, der realistisch in die Fahrzeuge fließen kann
  // (Rest: Gebäudeverbrauch, Zeiten ohne Fahrzeug am Standort, Wochenende).
  pvNutzbar: 0.5,
  pvAnteilMax: 0.7, // mehr als 70 % Solaranteil über das Jahr ist ohne großen Speicher unrealistisch
  jahre: 6, // typische Nutzungsdauer/Leasinglaufzeit im Fuhrpark
  // Investitionsfreibetrag (§ 11 EStG): Öko-IFB für emissionsfreie Fahrzeuge und
  // E-Ladestationen 15 %, befristet 22 % für Anschaffungen 01.11.2025–31.12.2026
  // (WKO „Investitionsfreibetrag“, USP). Fahrzeuge mit fossilem Antrieb sind
  // ausgeschlossen. Pkw: Bemessung höchstens bis zur Luxustangente (40.000 €).
  ifbSatz: 0.22,
  ifbPkwDeckel: 40000,
  steuersatz: 0.23, // Körperschaftsteuer
  // Ladeinfrastruktur (Richtwert-Spanne netto inkl. Montage, ohne Tiefbau und
  // Netzanschluss – Details im Ladeinfrastruktur-Planer): Mittelwerte
  kostenAc: 2500, // € je AC-Ladepunkt 11/22 kW inkl. Lastmanagement-Anteil
  kostenDc: 35000, // € je DC-Ladepunkt 50 kW
  kostenDcGross: 70000, // € je DC-Ladepunkt 150 kW
  // Betriebstage je Jahr für Tagesenergie und Ladeleistung
  betriebstage: 250,
  ladefensterH: 10, // Stunden Standzeit über Nacht (z. B. 18–6 Uhr, abzüglich Reserve)
  // Förderung: Bundesprogramm „E-Mobilität für Betriebe“ (eMove Austria) ist
  // derzeit ausgeschöpft → 0 € als Standard, frei eintragbar.
  foerderung: 0,
};

/**
 * Sachbezug für Mitarbeitende mit Privatnutzung (Info, keine Lohnverrechnung):
 * - E-Pkw 0 g CO₂: 2026 0 €; ab 01.01.2027 0,375 % der Anschaffungskosten
 *   (inkl. USt), höchstens 180 €/Monat; ab 2028 0,625 %, höchstens 300 €/Monat –
 *   Budgetbegleitgesetz 2027–2028, BGBl. I Nr. 62/2026 (NR 08.07.2026).
 * - Verbrenner (Erstzulassung 2026): 1,5 % (max. 720 €) bis 126 g CO₂/km WLTP,
 *   sonst 2 % (max. 960 €) – Sachbezugswerteverordnung § 4.
 */
export const SACHBEZUG = {
  e2026: { satz: 0, max: 0 },
  e2027: { satz: 0.00375, max: 180 },
  e2028: { satz: 0.00625, max: 300 },
  verbrenner: { satz: 0.02, max: 960 },
  verbrennerNiedrig: { satz: 0.015, max: 720, co2Grenze: 126 },
};

/**
 * GO-Maut (Autobahnen und Schnellstraßen, Kfz über 3,5 t) – ASFINAG,
 * „GO-Maut-Tarife 2026“, gültig ab 01.01.2026, € je km netto (Gesamttarif Lkw):
 * Diesel CO₂-Emissionsklasse 1 / EURO VI gegenüber CO₂-Klasse 5 (emissionsfrei).
 */
export const MAUT = {
  2: { diesel: 0.2724, e: 0.0587, label: "2 Achsen" },
  3: { diesel: 0.3788, e: 0.0806, label: "3 Achsen" },
  4: { diesel: 0.5625, e: 0.1189, label: "4+ Achsen" },
  quelle: { name: "ASFINAG – GO-Maut-Tarife 2026", url: "https://www.go-maut.at/media/c55axkil/go-maut-tarife-2026_de.pdf" },
};

/** Vorsteuer-Wirkung beim E-Pkw nach Bruttopreis (Luxustangente) */
export function vorsteuerEPkw(brutto) {
  if (!(brutto > 0)) return { vorsteuer: 0, stufe: "voll", netto: 0 };
  const voll = brutto - brutto / (1 + UST);
  if (brutto <= 40000) return { vorsteuer: voll, stufe: "voll", netto: brutto - voll };
  if (brutto <= 80000) {
    const v = Math.min(voll, 40000 - 40000 / (1 + UST)); // max. 6.666,67 €
    return { vorsteuer: v, stufe: "teilweise", netto: brutto - v };
  }
  return { vorsteuer: 0, stufe: "keine", netto: brutto };
}

/** Standard-Fahrzeugdaten einer Klasse (für Eingaben) */
export function klasseStandard(id, anzahl = 0) {
  const k = KLASSEN[id];
  return {
    n: anzahl,
    km: k.km,
    liter: k.liter.diesel,
    kwh: k.kwh,
    preis: k.preis,
    mehrpreis: k.mehrpreis,
    wartungV: k.wartungV,
    wartungE: k.wartungE,
    ...(id === "lkw" ? { mautAnteil: k.mautAnteil, achsen: k.achsen } : {}),
  };
}

/** Standard-Eingaben des Rechners */
export function flotteStandard() {
  return {
    preset: "handwerk",
    pkw: klasseStandard("pkw", 1),
    transporter: klasseStandard("transporter", 5),
    lkw: klasseStandard("lkw", 0),
    pkwKraftstoff: "diesel",
    diesel: FLOTTE.diesel,
    benzin: FLOTTE.benzin,
    stromCt: FLOTTE.stromCt,
    oeffentlichCt: FLOTTE.oeffentlichCt,
    ladeanteil: FLOTTE.ladeanteilBetrieb,
    pv: true,
    kwp: 50,
    pvAnteil: 35,
    jahre: FLOTTE.jahre,
    foerderung: 0,
    ifb: true,
    steuersatz: 23,
    infra: true,
  };
}

/**
 * Zielgruppen-Presets. Nur die Werte, die vom Standard abweichen.
 * Fahrleistungen: Richtwerte je Einsatz (Außendienst deutlich höher als Handwerk).
 */
export const PRESETS = [
  {
    id: "handwerk",
    label: "Handwerk",
    kurz: "1 Pkw · 5 Transporter",
    text: "Elektro, Installateur, Bau: Transporter stehen nachts am Betrieb.",
    werte: { pkw: { n: 1, km: 20000 }, transporter: { n: 5, km: 20000 }, lkw: { n: 0 }, ladeanteil: 90, pv: true, kwp: 50, pvAnteil: 35 },
  },
  {
    id: "vertrieb",
    label: "Vertrieb & Außendienst",
    kurz: "20 Pkw · 35.000 km",
    text: "Viele Kilometer, tagsüber unterwegs – mehr öffentliches Laden.",
    werte: { pkw: { n: 20, km: 35000 }, transporter: { n: 0 }, lkw: { n: 0 }, ladeanteil: 65, pv: true, kwp: 100, pvAnteil: 15 },
  },
  {
    id: "logistik",
    label: "Logistik",
    kurz: "8 Transporter · 4 Lkw",
    text: "Depotladen über Nacht, planbare Touren, hohe Laufleistung.",
    werte: { pkw: { n: 0 }, transporter: { n: 8, km: 30000 }, lkw: { n: 4, km: 60000 }, ladeanteil: 95, pv: true, kwp: 250, pvAnteil: 25 },
  },
  {
    id: "pflege",
    label: "Soziale Dienste",
    kurz: "15 Pkw · 18.000 km",
    text: "Mobile Pflege und Dienste: kurze Touren, Kleinwagen.",
    werte: { pkw: { n: 15, km: 18000, kwh: 16, preis: 30000, mehrpreis: 1000 }, transporter: { n: 0 }, lkw: { n: 0 }, ladeanteil: 85, pv: true, kwp: 40, pvAnteil: 30 },
  },
  {
    id: "gemeinde",
    label: "Gemeinde & Bauhof",
    kurz: "5 Pkw · 3 Transporter",
    text: "Amtsfahrzeuge und Bauhof – laden am eigenen Standort, oft mit PV am Dach.",
    werte: { pkw: { n: 5, km: 15000, preis: 36000, mehrpreis: 1000 }, transporter: { n: 3, km: 15000 }, lkw: { n: 0 }, ladeanteil: 95, pv: true, kwp: 80, pvAnteil: 45 },
  },
];

/** Preset auf die Standard-Eingaben anwenden */
export function presetEingaben(id) {
  const basis = flotteStandard();
  const p = PRESETS.find((x) => x.id === id) || PRESETS[0];
  const out = { ...basis, preset: p.id };
  for (const [k, v] of Object.entries(p.werte)) {
    if (KLASSEN[k]) out[k] = { ...klasseStandard(k, 0), ...v };
    else out[k] = v;
  }
  return out;
}

/** Realistisch erreichbarer PV-Anteil am Laden im Betrieb (0…1) */
export function pvAnteilMoeglich({ kwp, betriebKwh }) {
  if (!(kwp > 0) || !(betriebKwh > 0)) return 0;
  const nutzbar = kwp * FLOTTE.ertragProKwp * FLOTTE.pvNutzbar;
  return Math.min(FLOTTE.pvAnteilMax, nutzbar / betriebKwh);
}

/** Empfohlene Ladeleistung je Fahrzeug über Nacht (kW) */
function ladeleistungNoetig(kwhTag) {
  return kwhTag / FLOTTE.ladefensterH;
}

/**
 * Ladepunkt-Empfehlung für das Depot (Betriebsstandort).
 * Pkw/Transporter: 1 AC-Ladepunkt je Fahrzeug (11 kW; 22 kW, wenn die
 * Tagesenergie in 10 h Standzeit nicht in 11 kW passt). Lkw: 1 DC-Ladepunkt je
 * Fahrzeug (50 kW oder 150 kW je nach Tagesenergie).
 */
export function ladepunkteEmpfehlung(e, klassenErgebnis) {
  let ac11 = 0;
  let ac22 = 0;
  let dc50 = 0;
  let dc150 = 0;
  let energieTag = 0;
  for (const id of KLASSEN_IDS) {
    const r = klassenErgebnis[id];
    if (!r || r.n <= 0) continue;
    const kwhTagFz = r.kwhBetrieb / r.n / FLOTTE.betriebstage;
    energieTag += r.kwhBetrieb / FLOTTE.betriebstage;
    const p = ladeleistungNoetig(kwhTagFz);
    if (id === "lkw") {
      if (p <= 40) dc50 += r.n;
      else dc150 += r.n;
    } else if (p <= 9.5) ac11 += r.n;
    else if (p <= 20) ac22 += r.n;
    else dc50 += r.n;
  }
  const installiert = ac11 * 11 + ac22 * 22 + dc50 * 50 + dc150 * 150;
  // Mit dynamischem Lastmanagement genügt die mittlere Leistung über das
  // Nachtfenster plus 25 % Reserve (Ankunftszeiten, Winterverbrauch).
  const mitLm = Math.min(installiert, Math.ceil(((energieTag / FLOTTE.ladefensterH) * 1.25) / 5) * 5);
  const kosten = (ac11 + ac22) * FLOTTE.kostenAc + dc50 * FLOTTE.kostenDc + dc150 * FLOTTE.kostenDcGross;
  return { ac11, ac22, dc50, dc150, punkte: ac11 + ac22 + dc50 + dc150, installiert, mitLm, energieTag, kosten };
}

/**
 * Hauptberechnung.
 * @param {object} e Eingaben wie flotteStandard()
 */
export function rechneFlotte(e) {
  const jahre = Math.max(1, Math.round(e.jahre || FLOTTE.jahre));
  const strom = (e.stromCt ?? FLOTTE.stromCt) / 100;
  const oeff = (e.oeffentlichCt ?? FLOTTE.oeffentlichCt) / 100;
  const ladeanteil = Math.min(1, Math.max(0, (e.ladeanteil ?? FLOTTE.ladeanteilBetrieb) / 100));
  const steuersatz = (e.steuersatz ?? 23) / 100;
  const pvKostenCt = satzFuer(e.kwp || 50, "teileinspeisung"); // entgangener Einspeiseerlös
  const pvKosten = pvKostenCt / 100;

  // --- Energie je Klasse (vor PV-Aufteilung) ---
  const roh = {};
  let betriebKwhSumme = 0;
  for (const id of KLASSEN_IDS) {
    const f = e[id] || klasseStandard(id, 0);
    const n = Math.max(0, Math.round(f.n || 0));
    const km = n * (f.km || 0);
    const kwh = (km * (f.kwh || KLASSEN[id].kwh)) / 100;
    const kwhBetrieb = kwh * ladeanteil;
    betriebKwhSumme += kwhBetrieb;
    roh[id] = { f, n, km, kwh, kwhBetrieb };
  }

  const pvMax = e.pv ? pvAnteilMoeglich({ kwp: e.kwp, betriebKwh: betriebKwhSumme }) : 0;
  const pvAnteil = e.pv ? Math.min((e.pvAnteil ?? 0) / 100, pvMax) : 0;

  const klassen = {};
  const summe = {
    n: 0,
    km: 0,
    liter: 0,
    kwh: 0,
    kwhBetrieb: 0,
    kwhPv: 0,
    kwhNetz: 0,
    kwhOeffentlich: 0,
    v: { anschaffung: 0, energie: 0, wartung: 0, maut: 0 },
    el: { anschaffung: 0, energie: 0, wartung: 0, maut: 0, foerderung: 0, ifb: 0 },
    co2V: 0,
    co2E: 0,
  };

  for (const id of KLASSEN_IDS) {
    const { f, n, km, kwh, kwhBetrieb } = roh[id];
    if (n <= 0) {
      klassen[id] = { n: 0, km: 0, kwh: 0, kwhBetrieb: 0 };
      continue;
    }
    const pkw = id === "pkw";
    const kraftstoff = pkw ? e.pkwKraftstoff || "diesel" : "diesel";
    const preisL = kraftstoff === "benzin" ? e.benzin ?? FLOTTE.benzin : e.diesel ?? FLOTTE.diesel;
    // Verbrenner-Pkw: keine Vorsteuer → brutto; sonst netto
    const faktorV = pkw ? 1 : 1 / (1 + UST);
    const ustV = pkw ? 1 + UST : 1;

    const liter = (km * (f.liter || KLASSEN[id].liter.diesel)) / 100;
    const v = {
      anschaffung: n * (pkw ? f.preis : f.preis), // Pkw brutto (keine VSt), sonst netto
      energie: liter * preisL * faktorV,
      wartung: n * f.wartungV * ustV,
      maut: 0,
      co2: liter * CO2[kraftstoff],
    };
    let mautE = 0;
    if (id === "lkw") {
      const m = MAUT[f.achsen] || MAUT[2];
      const mautKm = km * Math.min(1, Math.max(0, (f.mautAnteil ?? 50) / 100));
      v.maut = mautKm * m.diesel;
      mautE = mautKm * m.e;
    }

    // E-Fahrzeug
    const kwhPv = kwhBetrieb * pvAnteil;
    const kwhNetz = kwhBetrieb - kwhPv;
    const kwhOeff = kwh - kwhBetrieb;
    let anschaffungE;
    let vst = null;
    if (pkw) {
      const brutto = f.preis + f.mehrpreis;
      vst = vorsteuerEPkw(brutto);
      anschaffungE = n * vst.netto;
    } else {
      anschaffungE = n * (f.preis + f.mehrpreis);
    }
    const foerderung = n * Math.max(0, e.foerderung || 0);
    const ifbBasis = pkw ? Math.min(anschaffungE / n, FLOTTE.ifbPkwDeckel) * n : anschaffungE;
    const ifb = e.ifb ? Math.max(0, ifbBasis - foerderung) * FLOTTE.ifbSatz * steuersatz : 0;
    const el = {
      anschaffung: anschaffungE,
      energie: kwhNetz * strom + kwhPv * pvKosten + kwhOeff * oeff,
      wartung: n * f.wartungE,
      maut: mautE,
      foerderung,
      ifb,
      co2: (kwhNetz + kwhOeff) * CO2.strom + kwhPv * CO2.pv,
    };

    klassen[id] = { n, km, liter, kwh, kwhBetrieb, kwhPv, kwhNetz, kwhOeff, kraftstoff, v, el, vst };

    summe.n += n;
    summe.km += km;
    summe.liter += liter;
    summe.kwh += kwh;
    summe.kwhBetrieb += kwhBetrieb;
    summe.kwhPv += kwhPv;
    summe.kwhNetz += kwhNetz;
    summe.kwhOeffentlich += kwhOeff;
    summe.v.anschaffung += v.anschaffung;
    summe.v.energie += v.energie;
    summe.v.wartung += v.wartung;
    summe.v.maut += v.maut;
    summe.el.anschaffung += el.anschaffung;
    summe.el.energie += el.energie;
    summe.el.wartung += el.wartung;
    summe.el.maut += el.maut;
    summe.el.foerderung += el.foerderung;
    summe.el.ifb += el.ifb;
    summe.co2V += v.co2;
    summe.co2E += el.co2;
  }

  // --- Ladeinfrastruktur ---
  const lade = ladepunkteEmpfehlung(e, klassen);
  const infra = e.infra ? lade.kosten : 0;
  const infraIfb = e.infra && e.ifb ? infra * FLOTTE.ifbSatz * steuersatz : 0;
  summe.el.infra = infra;
  summe.el.ifb += infraIfb;

  // --- Laufende Kosten und TCO ---
  const laufendV = summe.v.energie + summe.v.wartung + summe.v.maut;
  const laufendE = summe.el.energie + summe.el.wartung + summe.el.maut;
  const startV = summe.v.anschaffung;
  const startE = summe.el.anschaffung + infra - summe.el.foerderung;
  // IFB wirkt mit der Steuerveranlagung des ersten Jahres
  const reihe = [];
  for (let t = 0; t <= jahre; t++) {
    reihe.push({
      jahr: t,
      v: startV + laufendV * t,
      e: startE + laufendE * t - (t >= 1 ? summe.el.ifb : 0),
    });
  }
  const tcoV = reihe[jahre].v;
  const tcoE = reihe[jahre].e;

  // Break-even (linear zwischen den Jahren interpoliert)
  let breakEven = null;
  if (reihe[0].e <= reihe[0].v) breakEven = 0;
  else {
    for (let t = 1; t <= jahre; t++) {
      const d0 = reihe[t - 1].e - reihe[t - 1].v;
      const d1 = reihe[t].e - reihe[t].v;
      if (d1 <= 0) {
        breakEven = t - 1 + d0 / (d0 - d1);
        break;
      }
    }
  }
  // Außerhalb der Nutzungsdauer: einfache Schätzung
  const ersparnisJahr = laufendV - laufendE;
  const mehrinvest = startE - summe.el.ifb - startV;
  const amortisation = breakEven ?? (ersparnisJahr > 0 && mehrinvest > 0 ? mehrinvest / ersparnisJahr : null);

  // Zusatz-Ersparnis mit eigener PV, wenn keine gewählt ist (Anreiz)
  let pvVorschlag = null;
  if (!e.pv && summe.kwhBetrieb > 0) {
    const kwp = Math.min(500, Math.max(20, Math.round((0.35 * summe.kwhBetrieb) / (FLOTTE.ertragProKwp * FLOTTE.pvNutzbar) / 10) * 10));
    const anteil = pvAnteilMoeglich({ kwp, betriebKwh: summe.kwhBetrieb });
    pvVorschlag = { kwp, anteil, ersparnis: summe.kwhBetrieb * anteil * (strom - satzFuer(kwp, "teileinspeisung") / 100) };
  }

  return {
    jahre,
    klassen,
    summe,
    pvMax,
    pvAnteil,
    pvKostenCt,
    lade,
    laufendV,
    laufendE,
    ersparnisJahr,
    tcoV,
    tcoE,
    tcoErsparnis: tcoV - tcoE,
    breakEven,
    amortisation,
    reihe,
    co2Ersparnis: summe.co2V - summe.co2E, // kg je Jahr
    je100: {
      v: summe.km > 0 ? ((laufendV + startV / jahre) / summe.km) * 100 : 0,
      e: summe.km > 0 ? ((laufendE + (startE - summe.el.ifb) / jahre) / summe.km) * 100 : 0,
    },
    pvVorschlag,
  };
}

/** Sachbezug je Monat für einen E-Pkw bzw. vergleichbaren Verbrenner (Info) */
export function sachbezug(bruttoE, bruttoV) {
  const s = (satz, max, b) => Math.min(satz * b, max);
  return {
    e2026: 0,
    e2027: s(SACHBEZUG.e2027.satz, SACHBEZUG.e2027.max, bruttoE),
    e2028: s(SACHBEZUG.e2028.satz, SACHBEZUG.e2028.max, bruttoE),
    verbrenner: s(SACHBEZUG.verbrenner.satz, SACHBEZUG.verbrenner.max, bruttoV),
  };
}

// ---------------------------------------------------------------------------
// Teilen-Link: Eingaben <-> URL (nur Rechner-Eingaben, keine persönlichen Daten)
// ---------------------------------------------------------------------------
const KURZ = { pkw: "p", transporter: "t", lkw: "l" };
const FELDER = ["n", "km", "liter", "kwh", "preis", "mehrpreis", "wartungV", "wartungE", "mautAnteil", "achsen"];
const FELD_KURZ = { n: "n", km: "k", liter: "v", kwh: "e", preis: "a", mehrpreis: "m", wartungV: "w", wartungE: "x", mautAnteil: "u", achsen: "y" };

const eins = (v) => (Array.isArray(v) ? v[0] : v);
const zahl = (v, min, max, standard) => {
  const n = Number(eins(v));
  if (v == null || v === "" || !Number.isFinite(n)) return standard;
  return Math.min(max, Math.max(min, n));
};

/** Kurze Query für geteilte Links */
export function flotteQuery(e) {
  const q = new URLSearchParams();
  for (const id of KLASSEN_IDS) {
    const f = e[id];
    if (!f || !(f.n > 0)) continue;
    const std = klasseStandard(id);
    for (const feld of FELDER) {
      if (f[feld] === undefined) continue;
      if (feld === "n" || f[feld] !== std[feld]) q.set(`${KURZ[id]}${FELD_KURZ[feld]}`, String(f[feld]));
    }
  }
  const s = flotteStandard();
  // Schlüssel dürfen nicht mit p/t/l beginnen (Präfixe der Fahrzeugklassen)
  const flach = { pkwKraftstoff: "kf", diesel: "d", benzin: "b", stromCt: "s", oeffentlichCt: "o", ladeanteil: "ql", kwp: "kw", pvAnteil: "qp", jahre: "j", foerderung: "f", steuersatz: "st" };
  for (const [k, kurz] of Object.entries(flach)) if (e[k] !== s[k]) q.set(kurz, String(e[k]));
  for (const [k, kurz] of Object.entries({ pv: "so", ifb: "ifb", infra: "ci" })) if (Boolean(e[k]) !== Boolean(s[k])) q.set(kurz, e[k] ? "1" : "0");
  if (e.preset) q.set("z", e.preset);
  return q.toString();
}

/** Aus URLSearchParams / Objekt gültige Eingaben machen (Werte werden begrenzt) */
export function flotteAusParams(p = {}) {
  const get = (k) => (typeof p.get === "function" ? p.get(k) : p[k]);
  const hat = KLASSEN_IDS.some((id) => get(`${KURZ[id]}n`) != null);
  if (!hat) return null;
  const s = flotteStandard();
  const out = { ...s, preset: String(eins(get("z")) || "individuell") };
  if (!PRESETS.some((x) => x.id === out.preset)) out.preset = "individuell";
  for (const id of KLASSEN_IDS) {
    const g = KLASSEN[id].grenzen;
    const std = klasseStandard(id, 0);
    const c = KURZ[id];
    out[id] = {
      n: Math.round(zahl(get(`${c}n`), 0, 500, 0)),
      km: zahl(get(`${c}k`), g.km[0], g.km[1], std.km),
      liter: zahl(get(`${c}v`), g.liter[0], g.liter[1], std.liter),
      kwh: zahl(get(`${c}e`), g.kwh[0], g.kwh[1], std.kwh),
      preis: zahl(get(`${c}a`), g.preis[0], g.preis[1], std.preis),
      mehrpreis: zahl(get(`${c}m`), g.mehrpreis[0], g.mehrpreis[1], std.mehrpreis),
      wartungV: zahl(get(`${c}w`), 0, 30000, std.wartungV),
      wartungE: zahl(get(`${c}x`), 0, 30000, std.wartungE),
    };
    if (id === "lkw") {
      out.lkw.mautAnteil = zahl(get("lu"), 0, 100, std.mautAnteil);
      out.lkw.achsen = [2, 3, 4].includes(Number(eins(get("ly")))) ? Number(eins(get("ly"))) : std.achsen;
    }
  }
  const pk = eins(get("kf"));
  out.pkwKraftstoff = pk === "benzin" ? "benzin" : "diesel";
  out.diesel = zahl(get("d"), 1.2, 3.0, s.diesel);
  out.benzin = zahl(get("b"), 1.2, 3.0, s.benzin);
  out.stromCt = zahl(get("s"), 8, 40, s.stromCt);
  out.oeffentlichCt = zahl(get("o"), 20, 80, s.oeffentlichCt);
  out.ladeanteil = zahl(get("ql"), 0, 100, s.ladeanteil);
  out.kwp = zahl(get("kw"), 0, 1000, s.kwp);
  out.pvAnteil = zahl(get("qp"), 0, 70, s.pvAnteil);
  out.jahre = Math.round(zahl(get("j"), 3, 12, s.jahre));
  out.foerderung = zahl(get("f"), 0, 50000, 0);
  out.steuersatz = [23, 40, 50].includes(Number(eins(get("st")))) ? Number(eins(get("st"))) : s.steuersatz;
  const bool = (k, std) => {
    const v = eins(get(k));
    return v == null ? std : v === "1";
  };
  out.pv = bool("so", s.pv);
  out.ifb = bool("ifb", s.ifb);
  out.infra = bool("ci", s.infra);
  return out;
}
