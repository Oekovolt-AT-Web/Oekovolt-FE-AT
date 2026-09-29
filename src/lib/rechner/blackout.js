// src/lib/rechner/blackout.js
//
// Blackout- & Ausfallkosten-Rechner – reine Funktionen, per Node prüfbar.
//
// Quellen (Stand September 2026):
//  - Gesellschaft für Krisenvorsorge (GfKV), Leitfaden für die Blackout-Vorsorge in
//    Unternehmen und Organisationen (03/2024): Stromausfall in Österreich bei einem
//    Blackout 10–48 Stunden erwartet, Telekommunikation und Versorgung danach noch Tage
//    gestört; Eigenvorsorge 14 Tage.
//  - Kraftstoffverbrauch Dieselaggregat: MagnaGen GmbH, „Anleitung zur Berechnung des
//    Kraftstoffverbrauchs von Notstromaggregaten“ (01/2020) mit Datenblattwerten Deutz
//    Baureihe 2011 (F3M: 303/240/228/237 g/kWh bei 25/50/75/100 % Last), Dichte
//    0,835 kg/l, Generatorwirkungsgrad 88 % (Beispielwert), cos φ 0,8;
//    Faustformel ≈ 20 l/h je 100 kVA.
//    https://notstromdiesel.com/storage/app/media/downloads/Verbrauch-Kraftstoff-Notstromaggregat.pdf
//  - PV-Tagesform und Monatsertrag: profile.js (PVGIS-kalibriert, Österreich).
//
// ALLE Branchenwerte (Lasten, Ausfallkosten, Warenwerte) sind BEISPIELWERTE zur
// Orientierung – keine Statistik. Nutzer ersetzen sie durch eigene Zahlen.

import { pvTagesform, PV_MONAT, TAGE_MONAT } from "./profile.js";
import { speicherPreisProKwh } from "../../data/solarrechner.js";

export const BO_ANNAHMEN = {
  ertragProKwp: 1000, // kWh/kWp (Hallen-/Gebäudedach, vorsichtig)
  dod: 0.9, // nutzbare Entladetiefe Notstromspeicher
  etaSpeicher: 0.95, // Wirkungsgrad je Richtung (Wechselrichter + Batterie)
  socStart: 0.7, // Ladezustand bei Ausfallbeginn (Notstromreserve + Alltagsbetrieb, Annahme)
  socMin: 0.1, // Untergrenze (Tiefentladeschutz)
  aggregatStartSoc: 0.2, // Aggregat startet unter diesem Ladezustand …
  aggregatStopSoc: 0.8, // … und lädt bis hierhin nach
  aggregatBestpunkt: 0.75, // Aggregat läuft mit 75 % Last (Verbrauchs-Bestpunkt lt. Datenblatt)
  cosPhi: 0.8,
  dichte: 0.835, // kg/l Diesel
  etaGenerator: 0.88,
  // spezifischer Verbrauch Motor (kg/kWh mechanisch) nach Lastanteil – Deutz F3M 2011
  spezVerbrauch: [
    { last: 0.25, kg: 0.303 },
    { last: 0.5, kg: 0.24 },
    { last: 0.75, kg: 0.228 },
    { last: 1, kg: 0.237 },
  ],
  aggregatGroessenKva: [10, 15, 20, 30, 40, 50, 60, 80, 100, 130, 150, 200, 250, 300, 400, 500, 630, 800, 1000, 1250],
};

export const SZENARIEN = [
  { id: "kurz", label: "Kurze Unterbrechung", sub: "30 Minuten", h: 0.5 },
  { id: "regional", label: "Regionaler Ausfall", sub: "8 Stunden, z. B. Sturm", h: 8 },
  { id: "blackout", label: "Blackout", sub: "48 Stunden (GfKV: 10–48 h)", h: 48 },
];

export const JAHRESZEITEN = [
  { id: "winter", label: "Winter", monat: 0 },
  { id: "uebergang", label: "Frühling", monat: 3 },
  { id: "sommer", label: "Sommer", monat: 6 },
];

// Beispielwerte je Branche (keine Statistik!)
//  last          kritische Last (kW, Spitze der gleichzeitig nötigen Verbraucher)
//  auslastung    mittlere Last ÷ kritische Last über den Tag
//  anlauf        Leistungsreserve für Anlaufströme (Motoren, Pumpen, Kompressoren)
//  ziel          gewünschte Überbrückung (h)
//  db            entgangener Deckungsbeitrag bzw. Ersatzkosten je Stunde (€)
//  personen/lohn Personal, dessen Kosten im Stillstand weiterlaufen (€/h je Person)
//  ware / verderb   gefährdeter Warenwert (€) und ab welcher Stunde er verloren ist
//  wiederanlauf  Stunden bis zum Normalbetrieb nach Stromrückkehr; wiederanlaufKosten €
//  weiterbetrieb Anteil der Wertschöpfung, der mit Ersatzstrom für die kritische Last weiterläuft
export const BRANCHEN = [
  {
    id: "produktion",
    label: "Produktion",
    kritisch: "Steuerungen, IT, Druckluft, Absaugung, Sicherheitsabschaltung",
    last: 120, auslastung: 0.6, anlauf: 1.5, ziel: 8, kwp: 300,
    db: 2500, personen: 40, lohn: 45, ware: 15000, verderb: 0.25, wiederanlauf: 4, wiederanlaufKosten: 5000, weiterbetrieb: 0.2,
    wareLabel: "Ausschuss laufender Aufträge",
    stillsetzen: true, // trägt der Ersatzstrom den Beginn, werden Anlagen geordnet stillgesetzt – kein Ausschuss
    check: ["Reihenfolge für sicheres Stillsetzen und Wiederanfahren der Anlagen festgelegt", "Datensicherung und USV für Steuerungen und Server geprüft"],
  },
  {
    id: "kuehlhaus",
    label: "Kühlhaus & Lebensmittel",
    kritisch: "Kühl- und Tiefkühlzellen, Temperaturüberwachung, Tore, Licht",
    last: 60, auslastung: 0.7, anlauf: 1.6, ziel: 24, kwp: 200,
    db: 400, personen: 8, lohn: 40, ware: 150000, verderb: 6, wiederanlauf: 2, wiederanlaufKosten: 1000, weiterbetrieb: 0.6,
    wareLabel: "Kühlware",
    check: ["Kühlstellen nach Warenwert und Temperaturgrenze priorisiert", "Temperaturprotokoll und Türdisziplin für den Ausfall geregelt"],
  },
  {
    id: "landwirtschaft",
    label: "Landwirtschaft · Milchvieh",
    kritisch: "Melkanlage, Milchkühlung, Tränke, Stalllüftung, Fütterung",
    last: 30, auslastung: 0.5, anlauf: 2, ziel: 48, kwp: 100,
    db: 60, personen: 2, lohn: 30, ware: 4000, verderb: 4, wiederanlauf: 1, wiederanlaufKosten: 500, weiterbetrieb: 0.9,
    wareLabel: "Milch im Tank",
    check: ["Melkzeiten und Milchkühlung mit Ersatzstrom abgesichert", "Tränke und Stalllüftung für 48 Stunden geplant"],
  },
  {
    id: "hotel",
    label: "Hotel & Gastronomie",
    kritisch: "Notbeleuchtung, Heizung, Küche (teilweise), Kühlung, Rezeption, Wasser",
    last: 80, auslastung: 0.55, anlauf: 1.4, ziel: 24, kwp: 150,
    db: 1500, personen: 25, lohn: 35, ware: 8000, verderb: 8, wiederanlauf: 2, wiederanlaufKosten: 2000, weiterbetrieb: 0.7,
    wareLabel: "Lebensmittel in Küche & Lager",
    check: ["Gästeinformation ohne Mobilfunk vorbereitet (Aushang, Lautsprecher)", "Aufzüge: Befreiung eingeschlossener Personen geregelt"],
  },
  {
    id: "gemeinde",
    label: "Gemeinde · Wasserversorgung",
    kritisch: "Brunnen- und Druckerhöhungspumpen, Hochbehälter, Anlaufstelle im Gemeindeamt",
    last: 45, auslastung: 0.6, anlauf: 1.8, ziel: 72, kwp: 80,
    db: 500, personen: 6, lohn: 40, ware: 0, verderb: 0, wiederanlauf: 2, wiederanlaufKosten: 3000, weiterbetrieb: 0.9,
    wareLabel: "gefährdete Güter",
    check: ["Überbrückungszeit der Hochbehälter bekannt, Pumpen mit Ersatzstrom", "Anlaufstelle für die Bevölkerung mit Licht, Wärme und Funk ausgestattet"],
  },
  {
    id: "buero",
    label: "Büro & Verwaltung",
    kritisch: "Server, Netzwerk, Notbeleuchtung, Zutritt, Heizungssteuerung",
    last: 15, auslastung: 0.6, anlauf: 1.25, ziel: 4, kwp: 50,
    db: 800, personen: 30, lohn: 45, ware: 0, verderb: 0, wiederanlauf: 1, wiederanlaufKosten: 500, weiterbetrieb: 0.5,
    wareLabel: "gefährdete Güter",
    check: ["USV für Server und Netzwerk mit geordnetem Herunterfahren", "Papierliste mit Notfallkontakten und Zuständigkeiten ausgedruckt"],
  },
];

export const CHECKLISTE_BASIS = [
  "Blackout-Szenario durchgedacht: erste Stunde, erster Tag, erste Woche",
  "Krisenstab, Vertretungen und Treffpunkt festgelegt, Ablaufplan auf Papier",
  "Mitarbeitende über Eigenvorsorge für 14 Tage informiert",
  "Kritische Prozesse und Verbraucher mit Leistung und zulässiger Ausfallzeit gelistet",
  "Sicheres Herunterfahren und Reihenfolge des Wiederhochfahrens dokumentiert",
  "Ersatzstrom vorhanden, getestet und lokal (ohne Internet) bedienbar",
  "Treibstoffvorrat für Aggregat und Fahrzeuge, brandschutzgerecht gelagert",
  "Wasser, Taschenlampen, batteriebetriebenes Radio, Bargeld und Erste Hilfe vorrätig",
  "Absprachen mit Gemeinde, Nachbarbetrieben, Lieferanten und Kunden getroffen",
  "Jährliche Übung und Aktualisierung des Plans dokumentiert",
];

export const branche = (id) => BRANCHEN.find((b) => b.id === id) || BRANCHEN[0];

/** Ausfallkosten je Stunde aus der Hilfsrechnung. */
export const kostenJeStunde = (e) => (e.db || 0) + (e.personen || 0) * (e.lohn || 0);

/**
 * Kosten eines Szenarios ohne und mit Ersatzstrom für die kritische Last.
 * Mit Ersatzstrom laufen während der gedeckten Zeit nur (1 − weiterbetrieb) der
 * Stundenkosten weiter; Ware bleibt erhalten, solange die ungedeckte Zeit unter der
 * Verderbnisgrenze bleibt; Wiederanlaufkosten entfallen, wenn nichts ungedeckt blieb.
 */
export function szenarioKosten(e, h, deckungH) {
  const k = kostenJeStunde(e);
  const wareOhne = e.ware > 0 && h >= e.verderb ? e.ware : 0;
  const ohne = (h + e.wiederanlauf) * k + wareOhne + e.wiederanlaufKosten;
  const gedeckt = Math.min(h, Math.max(0, deckungH));
  const offen = h - gedeckt;
  const rest = 1 - e.weiterbetrieb;
  // Ware geht verloren, wenn die ungedeckte Zeit die Grenze erreicht – außer der Betrieb
  // kann in der gedeckten Zeit geordnet stillsetzen (z. B. laufende Aufträge in der Produktion)
  const geordnet = e.stillsetzen && gedeckt >= Math.min(h, 0.5);
  const wareMit = e.ware > 0 && offen > 0 && offen >= e.verderb && !geordnet ? e.ware : 0;
  const mit = gedeckt * k * rest + offen * k + (offen > 0 ? e.wiederanlauf * k + e.wiederanlaufKosten : e.wiederanlauf * k * rest) + wareMit;
  return { h, ohne, mit, vermieden: ohne - mit, gedeckt, offen, wareOhne, wareMit, stillstand: (h + e.wiederanlauf) * k };
}

/** Liter Diesel je kWh elektrisch bei Lastanteil (0–1) des Aggregats. */
export function literJeKwh(lastanteil) {
  const A = BO_ANNAHMEN;
  const t = A.spezVerbrauch;
  const x = Math.min(1, Math.max(t[0].last, lastanteil));
  let kg = t[t.length - 1].kg;
  for (let i = 0; i < t.length - 1; i++) {
    if (x >= t[i].last && x <= t[i + 1].last) {
      kg = t[i].kg + ((x - t[i].last) / (t[i + 1].last - t[i].last)) * (t[i + 1].kg - t[i].kg);
      break;
    }
  }
  return kg / (A.dichte * A.etaGenerator);
}

/** Auslegung: Leistung, Aggregatgröße, Energie und reiner Speicherbedarf. */
export function auslegung(e) {
  const A = BO_ANNAHMEN;
  const leistung = e.last * e.anlauf; // kW inkl. Anlaufreserve
  const kvaRoh = leistung / A.cosPhi;
  const kva = A.aggregatGroessenKva.find((g) => g >= kvaRoh) || Math.ceil(kvaRoh / 50) * 50;
  const mittlereLast = e.last * e.auslastung;
  const energie = mittlereLast * e.ziel;
  const speicherNur = energie / (A.dod * A.etaSpeicher);
  return { leistung, kvaRoh, kva, aggregatKw: kva * A.cosPhi, mittlereLast, energie, speicherNur, dieselNurAggregat: energie * literJeKwh(mittlereLast / (kva * A.cosPhi)) };
}

/** Tagesverlauf der kritischen Last (Faktor je Stunde, Mittel 1): tagsüber etwas höher. */
function lastFaktor(stunde) {
  return stunde >= 7 && stunde < 19 ? 1.15 : 0.85;
}

/**
 * Stundensimulation PV + Speicher + Aggregat über die Überbrückungsdauer.
 * @param {object} e  Eingaben inkl. kwp, speicher (kWh), aggregat (bool), jahreszeit, startStunde
 */
export function simuliereAusfall(e) {
  const A = BO_ANNAHMEN;
  const aus = auslegung(e);
  const monat = (JAHRESZEITEN.find((j) => j.id === e.jahreszeit) || JAHRESZEITEN[0]).monat;
  const form = pvTagesform(monat);
  const pvTag = ((e.kwp || 0) * A.ertragProKwp * PV_MONAT[monat]) / TAGE_MONAT[monat];
  const kap = Math.max(0, e.speicher || 0);
  const nutzbar = kap * A.dod;
  const pAgg = e.aggregat ? aus.aggregatKw : 0;
  const pWr = Math.max(aus.leistung, kap * 0.5); // Wechselrichterleistung (mind. kritische Last inkl. Anlauf)
  let soc = nutzbar * A.socStart;
  let aggAn = false;
  const dauer = Math.max(1, Math.ceil(e.ziel));
  const verlauf = [];
  let sPv = 0, sSpeicher = 0, sAgg = 0, sOffen = 0, liter = 0, laufzeit = 0, ersteLuecke = null;
  for (let t = 0; t < dauer; t++) {
    const stunde = ((e.startStunde ?? 8) + t) % 24;
    const last = aus.mittlereLast * lastFaktor(stunde);
    const pv = pvTag * form[stunde];
    let rest = last;
    const pvDirekt = Math.min(pv, rest);
    rest -= pvDirekt;
    let pvUeber = pv - pvDirekt;
    // Überschuss in den Speicher
    if (pvUeber > 0 && nutzbar > 0) {
      const lad = Math.min(pvUeber, pWr, (nutzbar - soc) / A.etaSpeicher);
      soc += lad * A.etaSpeicher;
      pvUeber -= lad;
    }
    // Aggregat-Hysterese: läuft ab niedrigem Ladezustand, bis der Speicher wieder voll genug ist
    if (aggAn && nutzbar > 0 && soc >= nutzbar * A.aggregatStopSoc) aggAn = false;
    if (!aggAn && pAgg > 0 && nutzbar > 0 && soc <= nutzbar * A.aggregatStartSoc && rest > 0) aggAn = true;
    // Speicher entlädt, solange das Aggregat nicht läuft
    let ent = 0;
    if (!aggAn && rest > 0 && soc > 0) {
      ent = Math.min(rest, pWr, soc * A.etaSpeicher);
      soc -= ent / A.etaSpeicher;
      rest -= ent;
    }
    // Reicht der Speicher nicht, springt das Aggregat ein (lastfolgend bzw. im Bestpunkt)
    if (!aggAn && pAgg > 0 && rest > 1e-9) aggAn = true;
    let agg = 0;
    let aggDeckt = 0;
    if (aggAn && pAgg > 0) {
      const ziel = nutzbar > 0 ? Math.max(rest, pAgg * A.aggregatBestpunkt) : rest;
      agg = Math.min(pAgg, ziel);
      aggDeckt = Math.min(agg, rest);
      rest -= aggDeckt;
      let lad = 0;
      if (agg > aggDeckt && nutzbar > 0) {
        lad = Math.min(agg - aggDeckt, pWr, (nutzbar - soc) / A.etaSpeicher);
        soc += lad * A.etaSpeicher;
      }
      agg = aggDeckt + lad;
      if (agg > 0) {
        liter += agg * literJeKwh(agg / pAgg);
        laufzeit += 1;
      }
      if (nutzbar <= 0) aggAn = false; // ohne Speicher rein lastfolgend
    }
    if (rest > 1e-6 && ersteLuecke == null) ersteLuecke = t;
    sPv += pvDirekt;
    sSpeicher += ent;
    sAgg += aggDeckt;
    sOffen += rest;
    verlauf.push({ t, stunde, last, pv: pvDirekt, speicher: ent, aggregat: aggDeckt, offen: rest, soc: nutzbar > 0 ? soc / nutzbar : 0, aggregatAn: agg > 0 });
  }
  const gesamt = sPv + sSpeicher + sAgg + sOffen;
  const nurAggregatLiter = verlauf.reduce((s, v) => s + v.last * literJeKwh(v.last / Math.max(aus.aggregatKw, 1e-9)), 0);
  return {
    auslegung: aus,
    verlauf,
    dauer,
    ueberbrueckt: ersteLuecke == null ? dauer : ersteLuecke,
    vollGedeckt: ersteLuecke == null,
    anteile: { pv: sPv / gesamt, speicher: sSpeicher / gesamt, aggregat: sAgg / gesamt, offen: sOffen / gesamt },
    energie: { pv: sPv, speicher: sSpeicher, aggregat: sAgg, offen: sOffen, last: gesamt },
    liter,
    laufzeit,
    nurAggregatLiter,
    ersparnisLiter: e.aggregat ? Math.max(0, nurAggregatLiter - liter) : 0,
    speicherInvest: kap > 0 ? kap * speicherPreisProKwh(kap, "gewerbe") : 0,
  };
}

/** Deckungsdauer, die für die Szenariokosten angesetzt wird (h). */
export function deckungsdauer(sim) {
  return sim.vollGedeckt ? Infinity : sim.ueberbrueckt;
}

/** Alle drei Szenarien mit der gewählten Ersatzstromlösung. */
export function szenarien(e, sim) {
  const dh = e.ersatzstrom === false ? 0 : sim.vollGedeckt ? Math.max(e.ziel, 0) : sim.ueberbrueckt;
  return SZENARIEN.map((s) => ({ ...s, ...szenarioKosten(e, s.h, dh) }));
}

// ---------------------------------------------------------------------------
// Teilen-Link
// ---------------------------------------------------------------------------
const FELDER = [
  ["b", "branche"], ["l", "last"], ["z", "ziel"], ["db", "db"], ["pe", "personen"], ["lo", "lohn"], ["w", "ware"], ["vd", "verderb"],
  ["wa", "wiederanlauf"], ["wk", "wiederanlaufKosten"], ["pv", "kwp"], ["sp", "speicher"], ["ag", "aggregat"], ["j", "jahreszeit"], ["st", "startStunde"],
];

export function boParams(e) {
  const q = new URLSearchParams();
  for (const [k, f] of FELDER) {
    const v = e[f];
    q.set(k, typeof v === "boolean" ? (v ? "1" : "0") : String(v));
  }
  return q.toString();
}

export function boAusParams(get) {
  if (!get("b")) return null;
  const b = branche(get("b"));
  const z = (k, min, max, std) => {
    const n = Number(get(k));
    return get(k) != null && Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : std;
  };
  return {
    branche: b.id,
    last: z("l", 1, 5000, b.last),
    ziel: z("z", 1, 72, b.ziel),
    db: z("db", 0, 1000000, b.db),
    personen: z("pe", 0, 5000, b.personen),
    lohn: z("lo", 0, 500, b.lohn),
    ware: z("w", 0, 50000000, b.ware),
    verderb: z("vd", 0, 72, b.verderb),
    wiederanlauf: z("wa", 0, 72, b.wiederanlauf),
    wiederanlaufKosten: z("wk", 0, 10000000, b.wiederanlaufKosten),
    kwp: z("pv", 0, 5000, b.kwp),
    speicher: z("sp", 0, 10000, 0),
    aggregat: get("ag") !== "0",
    jahreszeit: JAHRESZEITEN.some((j) => j.id === get("j")) ? get("j") : "winter",
    startStunde: [2, 8, 18].includes(Number(get("st"))) ? Number(get("st")) : 8,
  };
}

/**
 * Speicher-Vorschlag für die Kombination: zwei Stunden mittlere kritische Last
 * (überbrückt den Aggregatstart und die Nacht-Spitzen, lädt tagsüber aus PV nach).
 */
export function speicherVorschlag(e) {
  const kwh = (e.last * e.auslastung * 2) / (BO_ANNAHMEN.dod * BO_ANNAHMEN.etaSpeicher);
  const r = kwh < 50 ? 5 : kwh < 200 ? 10 : 20;
  return Math.max(5, Math.ceil(kwh / r) * r);
}
