// src/lib/marktindizes.js
//
// Eigene Marktindizes von Ökovolt Österreich – reine Rechenfunktionen ohne Imports,
// damit sie im Next-Bundle, im Erzeugungsskript (scripts/marktindizes.mjs) und im
// Node-Test (scripts/marktindizes.test.mjs) gleich laufen.
//
//   1. Speicher-Spread-Index: theoretischer Spread-Erlös eines Batteriespeichers mit
//      1 MWh nutzbarer Kapazität und 0,5 MW Leistung am Day-Ahead-Markt der Gebotszone AT,
//      ein Vollzyklus pro Tag, Round-Trip-Wirkungsgrad 88 %, perfekte Voraussicht.
//      Je Tag werden die günstigsten Viertelstunden zum Laden und die teuersten zum
//      Entladen gewählt – ohne Reihenfolge-Bedingung, ohne Netzentgelte, Abgaben,
//      Degradation oder Vermarktungsentgelt. Das ist bewusst eine OBERGRENZE, keine
//      Erlösprognose.
//   2. Solar-Marktwert: PV-gewichteter Monatspreis (Σ Preis × PV-Einspeisung / Σ PV-Einspeisung)
//      – eigene Schätzung von Ökovolt aus Day-Ahead-Preis und öffentlicher Netto-
//      Solarerzeugung Österreichs. Nicht der amtliche Referenzmarktwert der E-Control
//      (§ 13 EAG), der nach anderer Methode und mit anderen Mengen berechnet wird.
//
// Preise in €/MWh (Day-Ahead, netto), Zeitstempel in Millisekunden (UTC-Epoche),
// Kalender nach Europe/Vienna. Bis 30.09.2025 war der Day-Ahead-Markt stündlich; SMARD
// liefert diese Stunden als vier gleiche Viertelstundenwerte, womit die Rechnung über
// den ganzen Zeitraum in Viertelstunden laufen kann.

export const ZEITZONE = "Europe/Vienna";

/** Annahmen des Speicher-Spread-Index – offengelegt auf der Seite und in der CSV. */
export const SPEICHER = {
  kapazitaetMwh: 1,
  leistungMw: 0.5,
  roundTrip: 0.88,
  zyklenProTag: 1,
};

/** Tage mit weniger Datenabdeckung gelten als unvollständig (Sommer-/Winterzeittage haben 23 bzw. 25 h). */
export const MIN_ABDECKUNG_TAG = 0.9;
/** Mindestabdeckung eines Monats (Anteil der erwarteten Viertelstunden), sonst wird der Monat als lückenhaft markiert. */
export const MIN_ABDECKUNG_MONAT = 0.95;

const fmtTag = new Intl.DateTimeFormat("sv-SE", { timeZone: ZEITZONE });
const fmtMonatLang = new Intl.DateTimeFormat("de-AT", { month: "long", year: "numeric", timeZone: ZEITZONE });
const fmtMonatKurz = new Intl.DateTimeFormat("de-AT", { month: "short", year: "2-digit", timeZone: ZEITZONE });

/** YYYY-MM-DD in Wiener Ortszeit */
export const tagVon = (t) => fmtTag.format(new Date(t));
/** YYYY-MM in Wiener Ortszeit */
export const monatVon = (t) => tagVon(t).slice(0, 7);

/** „September 2026“ aus "2026-09" */
export const monatLabel = (monat) => fmtMonatLang.format(new Date(Date.UTC(Number(monat.slice(0, 4)), Number(monat.slice(5, 7)) - 1, 15)));
/** „Sep. 26“ aus "2026-09" */
export const monatKurz = (monat) => fmtMonatKurz.format(new Date(Date.UTC(Number(monat.slice(0, 4)), Number(monat.slice(5, 7)) - 1, 15)));

/** Tage im Monat (Kalender) */
export function tageImMonat(monat) {
  const j = Number(monat.slice(0, 4));
  const m = Number(monat.slice(5, 7));
  return new Date(Date.UTC(j, m, 0)).getUTCDate();
}

/** Folgemonat als "YYYY-MM" */
export function naechsterMonat(monat) {
  const j = Number(monat.slice(0, 4));
  const m = Number(monat.slice(5, 7));
  return m === 12 ? `${j + 1}-01` : `${j}-${String(m + 1).padStart(2, "0")}`;
}

/** Liste aller Monate von..bis (einschließlich) */
export function monateZwischen(von, bis) {
  const liste = [];
  for (let m = von; m <= bis; m = naechsterMonat(m)) liste.push(m);
  return liste;
}

/** Punkte nach Schlüssel gruppieren (Map, Einfügereihenfolge = Zeitreihenfolge). */
export function gruppiere(punkte, schluessel) {
  const map = new Map();
  for (const p of punkte) {
    const k = schluessel(p.t);
    const g = map.get(k);
    if (g) g.push(p);
    else map.set(k, [p]);
  }
  return map;
}

/** Schrittweite in Minuten aus einer sortierten Punktliste (kleinster Abstand), Standard 15. */
export function schrittMinuten(punkte) {
  let min = Infinity;
  for (let i = 1; i < punkte.length; i++) {
    const d = punkte[i].t - punkte[i - 1].t;
    if (d > 0 && d < min) min = d;
  }
  return Number.isFinite(min) ? Math.round(min / 60000) : 15;
}

const runde = (x, stellen = 2) => (x == null || Number.isNaN(x) ? null : Math.round(x * 10 ** stellen) / 10 ** stellen);

/**
 * Theoretischer Spread-Erlös eines Tages (perfekte Voraussicht, Obergrenze).
 *
 * punkte: [{ t, eurMwh }] eines Kalendertags (beliebige Reihenfolge, Lücken erlaubt)
 * Rückgabe: { erloesEur, ladeMittel, entladeMittel, schritte, ladeFenster, entladeFenster } oder null,
 *           wenn der Tag unvollständig ist oder nicht genug Viertelstunden für Laden UND Entladen hat.
 */
export function tagesSpread(punkte, speicher = SPEICHER, schrittMin) {
  const werte = punkte.filter((p) => typeof p.eurMwh === "number" && Number.isFinite(p.eurMwh)).sort((a, b) => a.t - b.t);
  if (!werte.length) return null;
  const schritt = schrittMin || schrittMinuten(werte);
  const schrittH = schritt / 60;
  const erwartet = Math.round((24 * 60) / schritt);
  // Vollständigkeit: 23-h- und 25-h-Tage der Zeitumstellung zählen als vollständig
  if (werte.length < erwartet * MIN_ABDECKUNG_TAG) return null;

  const energieProSchritt = speicher.leistungMw * schrittH; // MWh je Viertelstunde bei voller Leistung
  const schritte = Math.ceil(speicher.kapazitaetMwh / energieProSchritt - 1e-9); // z. B. 1 MWh / 0,125 MWh = 8
  if (werte.length < 2 * schritte) return null;

  const sortiert = [...werte].sort((a, b) => a.eurMwh - b.eurMwh);
  const laden = sortiert.slice(0, schritte);
  const entladen = sortiert.slice(-schritte);
  const ladeMittel = laden.reduce((s, p) => s + p.eurMwh, 0) / schritte;
  const entladeMittel = entladen.reduce((s, p) => s + p.eurMwh, 0) / schritte;

  // Geladen wird die volle nutzbare Kapazität, zurück ins Netz geht sie abzüglich Round-Trip-Verlust
  const kosten = ladeMittel * speicher.kapazitaetMwh;
  const erloes = entladeMittel * speicher.kapazitaetMwh * speicher.roundTrip;
  const spread = (erloes - kosten) * (speicher.zyklenProTag || 1);

  return {
    erloesEur: runde(spread, 2),
    ladeMittel: runde(ladeMittel, 2),
    entladeMittel: runde(entladeMittel, 2),
    schritte,
    ladeFenster: laden.map((p) => p.t).sort((a, b) => a - b),
    entladeFenster: entladen.map((p) => p.t).sort((a, b) => a - b),
  };
}

/**
 * Solar-Marktwert (PV-gewichteter Preis) über zusammengehörige Zeitpunkte.
 * preise: [{ t, eurMwh }], pv: [{ t, mw }] (gleiche Zeitstempel). Rückgabe €/MWh oder null.
 */
export function solarMarktwert(preise, pv) {
  const pvMap = new Map();
  for (const p of pv) if (typeof p.mw === "number" && p.mw > 0) pvMap.set(p.t, p.mw);
  let zaehler = 0;
  let nenner = 0;
  let treffer = 0;
  for (const p of preise) {
    const g = pvMap.get(p.t);
    if (g == null || typeof p.eurMwh !== "number") continue;
    zaehler += p.eurMwh * g;
    nenner += g;
    treffer++;
  }
  if (!treffer || nenner <= 0) return null;
  return zaehler / nenner;
}

/** Erwartete Viertelstunden eines Monats (Sommerzeitwechsel ausgeglichen: ±4 je nach Monat). */
export function erwarteteSchritte(monat, schrittMin = 15) {
  const tage = tageImMonat(monat);
  let minuten = tage * 24 * 60;
  const m = Number(monat.slice(5, 7));
  if (m === 3) minuten -= 60; // letzter Sonntag im März: 23 Stunden
  if (m === 10) minuten += 60; // letzter Sonntag im Oktober: 25 Stunden
  return Math.round(minuten / schrittMin);
}

/**
 * Kennzahlen eines Monats.
 *
 * punkte:  Day-Ahead-Preise des Monats [{ t, eurMwh }]
 * pv:      optional PV-Einspeisung [{ t, mw }] für den Solar-Marktwert
 * Rückgabe { monat, viertelstunden, abdeckung, mittel, min, max, negativ, negativStunden,
 *            spreadErloesEur, spreadTage, spreadProTag, spreadJeKwh, solarMarktwert, marktwertfaktor }
 */
export function monatsIndex(monat, punkte, pv, speicher = SPEICHER) {
  const werte = punkte.filter((p) => typeof p.eurMwh === "number" && Number.isFinite(p.eurMwh) && monatVon(p.t) === monat).sort((a, b) => a.t - b.t);
  if (!werte.length) return null;
  const schritt = schrittMinuten(werte);
  const erwartet = erwarteteSchritte(monat, schritt);

  let summe = 0;
  let min = Infinity;
  let max = -Infinity;
  let negativ = 0;
  for (const p of werte) {
    summe += p.eurMwh;
    if (p.eurMwh < min) min = p.eurMwh;
    if (p.eurMwh > max) max = p.eurMwh;
    if (p.eurMwh < 0) negativ++;
  }

  // Spread je Tag, nur vollständige Tage zählen
  let spread = 0;
  let spreadTage = 0;
  for (const [, tag] of gruppiere(werte, tagVon)) {
    const s = tagesSpread(tag, speicher, schritt);
    if (!s) continue;
    spread += s.erloesEur;
    spreadTage++;
  }
  const tage = tageImMonat(monat);
  // Hochrechnung auf den Kalendermonat, falls einzelne Tage fehlen (als Hinweis in `abdeckung` erkennbar)
  const spreadMonat = spreadTage ? (spread / spreadTage) * tage : null;

  const mittel = summe / werte.length;
  const smw = pv?.length ? solarMarktwert(werte, pv) : null;

  return {
    monat,
    viertelstunden: werte.length,
    abdeckung: runde(werte.length / erwartet, 3),
    schrittMin: schritt,
    mittel: runde(mittel, 2),
    min: runde(min, 2),
    max: runde(max, 2),
    negativ,
    negativStunden: runde((negativ * schritt) / 60, 2),
    spreadErloesEur: runde(spreadMonat, 0),
    spreadTage,
    spreadProTag: spreadTage ? runde(spread / spreadTage, 2) : null,
    // Je kWh nutzbarer Kapazität und Monat – für den Vergleich mit anderen Speichergrößen
    spreadJeKwh: spreadTage ? runde(spreadMonat / (speicher.kapazitaetMwh * 1000), 3) : null,
    solarMarktwert: smw == null ? null : runde(smw, 2),
    marktwertfaktor: smw == null || !mittel ? null : runde(smw / mittel, 3),
  };
}

/**
 * Index über alle Monate: punkte (Preise) und pv werden nach Monat gruppiert.
 * Rückgabe: Array von monatsIndex(), nach Monat sortiert.
 */
export function indexAus(punkte, pv = [], speicher = SPEICHER) {
  const preiseJeMonat = gruppiere(
    punkte.filter((p) => typeof p.eurMwh === "number").sort((a, b) => a.t - b.t),
    monatVon
  );
  const pvJeMonat = gruppiere(pv, monatVon);
  return [...preiseJeMonat.keys()].sort().map((m) => monatsIndex(m, preiseJeMonat.get(m), pvJeMonat.get(m) || [], speicher)).filter(Boolean);
}

/** Summe der letzten n Monate eines Feldes (null, wenn weniger Monate vorliegen). */
export function summeLetzte(monate, feld, n = 12) {
  const letzte = monate.slice(-n);
  if (letzte.length < n || letzte.some((m) => m[feld] == null)) return null;
  return letzte.reduce((s, m) => s + m[feld], 0);
}

/* ------------------------------------------------------------------ */
/* CSV (CC BY 4.0) – Trennzeichen Semikolon, Dezimalpunkt, UTF-8       */
/* ------------------------------------------------------------------ */

const CSV_ZELLE = (v) => {
  if (v == null) return "";
  const s = String(v);
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * CSV-Text aus Spaltendefinition und Zeilen; Kommentarzeilen (#) mit Quelle, Lizenz und Stand voran.
 * spalten: [{ key, label }], kommentare: string[]
 */
export function csvText({ spalten, zeilen, kommentare = [] }) {
  const kopf = spalten.map((s) => CSV_ZELLE(s.label)).join(";");
  const body = zeilen.map((z) => spalten.map((s) => CSV_ZELLE(z[s.key])).join(";"));
  return [...kommentare.map((k) => `# ${k}`), kopf, ...body].join("\n") + "\n";
}

export const SPALTEN_SPEICHER = [
  { key: "monat", label: "monat" },
  { key: "spreadErloesEur", label: "spread_erloes_eur_je_monat" },
  { key: "spreadProTag", label: "spread_erloes_eur_je_tag" },
  { key: "spreadJeKwh", label: "spread_erloes_eur_je_kwh_kapazitaet" },
  { key: "spreadTage", label: "tage_mit_daten" },
  { key: "mittel", label: "monatsmittel_eur_mwh" },
  { key: "min", label: "minimum_eur_mwh" },
  { key: "max", label: "maximum_eur_mwh" },
  { key: "negativ", label: "negative_viertelstunden" },
  { key: "negativStunden", label: "negative_stunden" },
  { key: "abdeckung", label: "datenabdeckung" },
];

export const SPALTEN_SOLAR = [
  { key: "monat", label: "monat" },
  { key: "solarMarktwert", label: "solar_marktwert_eur_mwh_oekovolt" },
  { key: "mittel", label: "monatsmittel_eur_mwh" },
  { key: "marktwertfaktor", label: "marktwertfaktor" },
  { key: "referenzmarktwertCt", label: "referenzmarktwert_pv_ct_kwh_e_control" },
  { key: "negativ", label: "negative_viertelstunden" },
  { key: "abdeckung", label: "datenabdeckung" },
];

/** €/MWh → ct/kWh */
export const ctKwh = (eurMwh) => (eurMwh == null ? null : eurMwh / 10);
