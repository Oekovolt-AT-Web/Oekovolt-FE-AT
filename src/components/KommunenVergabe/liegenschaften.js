// src/components/KommunenVergabe/liegenschaften.js
//
// Liegenschafts-Check für Gemeinden (Welle B, Paket B09): bis 15 Gebäude mit typisierten
// Lastprofilen → kWp aus der Dachfläche, Jahresertrag, Eigenverbrauch, Überschuss für eine
// Energiegemeinschaft und eine Rangfolge. Reine Funktionen ohne React, mit node testbar
// (scripts/kommunen-werkzeuge.test.mjs).
//
// GROBABSCHÄTZUNG MIT TYPISIERTEN PROFILEN – keine Messwerte. Ein echter Lastgang
// (Smart-Meter-Portal des Netzbetreibers) ersetzt die Profile. Alle Zahlen sind Richtwerte
// zur Orientierung.
//
// Annahmen und Quellen (Stand 11.10.2026):
//  - Tagesprofile: relative Stundenwerte je Gebäudetyp, abgeleitet aus den Veranschaulichungs-
//    profilen von /kommunen (src/app/kommunen/page.js, Welle A05) und um Verwaltung, Kindergarten,
//    Feuerwehr, Wasserversorgung, Sporthalle und Wohnbau ergänzt – Plausibilitätsannahmen, keine
//    Messdaten.
//  - PV-Monatsverteilung und Sonnenauf-/-untergang je Monat wie src/lib/rechner/profile.js
//    (Mitteleuropa, PVGIS-typische Verteilung).
//  - Flächenbedarf 7 m² je kWp (Flachdach Ost-West aufgeständert bzw. Mischung aus Schräg- und
//    Flachdächern; wie Gewerbe-PV-Rechner, src/lib/rechner/gewerbepv.js). Dachparallel auf
//    Schrägdach wären rund 5 m²/kWp, Süd aufgeständert rund 10 m²/kWp.
//  - Spezifischer Ertrag je Bundesland: PVGIS 5.3 (EU JRC, abgefragt 28.09.2026, siehe
//    src/data/bundeslaender.js) für 1 kWp, optimale Neigung, Süd, 14 % Systemverluste – für
//    reale Dächer (Ausrichtung, Neigung, Verschattung) mit Faktor 0,9 abgemindert.
//  - Netzebene 7: ab rund 100 kWp die Anschlussmöglichkeit vorab beim Netzbetreiber klären
//    (Praxis-Richtwert; verbindlich ist allein die Netzzugangsauskunft).
//  - Dachalter: über 20 Jahre Dachzustand prüfen, über 30 Jahre Sanierung vor PV wahrscheinlich
//    (Restnutzungsdauer sollte die PV-Laufzeit von 25–30 Jahren erreichen).

export const LIEGENSCHAFTEN_STAND = { iso: "2026-10-11", label: "11.10.2026" };

export const MAX_GEBAEUDE = 15;

/** Flächenbedarf je kWp (m²) – Richtwert, siehe Kopf. */
export const QM_PRO_KWP = 7;

/** Abminderung PVGIS-Optimalwert → reales Gemeindedach (Richtwert). */
export const DACH_FAKTOR = 0.9;

/** Ab dieser Leistung auf Netzebene 7 den Anschluss vorab klären (Praxis-Richtwert). */
export const NE7_PRUEFEN_AB_KWP = 100;

/** Dachalter-Schwellen (Jahre). */
export const DACHALTER_PRUEFEN = 20;
export const DACHALTER_SANIERUNG = 30;

export const NETZEBENEN = [
  { id: "7", label: "Netzebene 7", kurz: "NE 7", text: "Niederspannung, Hausanschluss" },
  { id: "6", label: "Netzebene 6", kurz: "NE 6", text: "eigene Trafostation" },
  { id: "5", label: "Netzebene 5", kurz: "NE 5", text: "Mittelspannung" },
];

/**
 * Spezifischer Ertrag je Bundesland (kWh je kWp und Jahr), PVGIS-Spanne laut
 * src/data/bundeslaender.js (optimal), hier Mittelwert × DACH_FAKTOR.
 */
const PVGIS_SPANNE = {
  burgenland: [1200, 1230],
  kaernten: [1220, 1300],
  niederoesterreich: [1090, 1170],
  oberoesterreich: [1100, 1150],
  salzburg: [1080, 1230],
  steiermark: [1170, 1230],
  tirol: [1110, 1360],
  vorarlberg: [1130, 1170],
  wien: [1170, 1180],
};

export const BUNDESLAENDER = [
  { id: "burgenland", label: "Burgenland" },
  { id: "kaernten", label: "Kärnten" },
  { id: "niederoesterreich", label: "Niederösterreich" },
  { id: "oberoesterreich", label: "Oberösterreich" },
  { id: "salzburg", label: "Salzburg" },
  { id: "steiermark", label: "Steiermark" },
  { id: "tirol", label: "Tirol" },
  { id: "vorarlberg", label: "Vorarlberg" },
  { id: "wien", label: "Wien" },
].map((b) => {
  const [von, bis] = PVGIS_SPANNE[b.id];
  return { ...b, pvgis: [von, bis], ertrag: Math.round(((von + bis) / 2) * DACH_FAKTOR) };
});

export const ERTRAG_QUELLE = {
  label: "PVGIS 5.3, EU JRC (abgefragt 28.09.2026), optimale Neigung Süd, 14 % Systemverluste – für Gemeindedächer × 0,9",
  url: "https://re.jrc.ec.europa.eu/pvg_tools/de/",
};

export const spezifischerErtrag = (bundeslandId) => BUNDESLAENDER.find((b) => b.id === bundeslandId)?.ertrag ?? 1000;

// ---------------------------------------------------------------------------
// Typisierte Profile
// ---------------------------------------------------------------------------
const TAGE_MONAT = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const norm = (arr) => {
  const s = arr.reduce((a, b) => a + b, 0);
  return arr.map((v) => (s > 0 ? v / s : 0));
};

/** PV-Monatsverteilung (Summe 1), wie src/lib/rechner/profile.js. */
export const PV_MONAT = norm([0.03, 0.05, 0.085, 0.115, 0.13, 0.13, 0.135, 0.115, 0.085, 0.06, 0.035, 0.025]);

// Sonnenaufgang/-untergang je Monat (Stunden, MEZ, Mitteleuropa) – wie profile.js
const SONNE = [
  [8.0, 16.7], [7.4, 17.5], [6.6, 18.3], [6.6, 20.1], [5.7, 20.9], [5.3, 21.4],
  [5.5, 21.3], [6.2, 20.6], [7.0, 19.5], [7.8, 18.4], [7.4, 16.8], [8.0, 16.4],
];

/** PV-Tagesform eines Monats (24 Werte, Summe 1). */
export function pvTagesform(monat) {
  const [auf, unter] = SONNE[monat];
  const form = Array.from({ length: 24 }, (_, h) => {
    let s = 0;
    for (let q = 0; q < 4; q++) {
      const t = h + (q + 0.5) / 4;
      if (t > auf && t < unter) s += Math.pow(Math.sin((Math.PI * (t - auf)) / (unter - auf)), 1.35);
    }
    return s;
  });
  return norm(form);
}
const PV_FORM = Array.from({ length: 12 }, (_, m) => pvTagesform(m));

const FLACH = Array(12).fill(1);
const WINTER_LEICHT = [1.08, 1.05, 1.02, 0.98, 0.95, 0.93, 0.93, 0.93, 0.97, 1.02, 1.06, 1.08];

/**
 * Gebäudetypen mit typisiertem Werktagsprofil (24 relative Stundenwerte), Wochenendfaktor,
 * Monatsgewichten und Beispielwerten (nur zum schnellen Befüllen – durch eigene Zählerwerte ersetzen).
 */
export const GEBAEUDE = [
  {
    id: "amt",
    label: "Gemeindeamt / Verwaltung",
    kurz: "Amt",
    werktag: [0.15, 0.15, 0.15, 0.15, 0.15, 0.18, 0.4, 0.8, 1, 1, 1, 0.95, 0.85, 0.95, 0.95, 0.9, 0.7, 0.4, 0.25, 0.2, 0.18, 0.16, 0.15, 0.15],
    wochenende: 0.2,
    monat: WINTER_LEICHT,
    beispiel: { verbrauch: 25000, dachflaeche: 300 },
    text: "Bürozeiten – Verbrauch tagsüber, gute Deckung mit der Solarkurve.",
  },
  {
    id: "schule",
    label: "Schule",
    kurz: "Schule",
    werktag: [0.15, 0.15, 0.15, 0.15, 0.15, 0.16, 0.3, 0.75, 0.95, 1, 1, 0.95, 0.9, 0.82, 0.7, 0.5, 0.3, 0.22, 0.2, 0.18, 0.17, 0.16, 0.15, 0.15],
    wochenende: 0.2,
    // Sommerferien Juli/August: nur Grundlast
    monat: [1.05, 1.05, 1.0, 0.95, 0.95, 0.85, 0.3, 0.3, 0.95, 1.0, 1.05, 1.05],
    beispiel: { verbrauch: 60000, dachflaeche: 1200 },
    text: "Große Dächer, Verbrauch am Vormittag – in Ferien und am Wochenende Überschuss.",
  },
  {
    id: "kindergarten",
    label: "Kindergarten / Hort",
    kurz: "Kiga",
    werktag: [0.15, 0.15, 0.15, 0.15, 0.15, 0.18, 0.45, 0.85, 1, 1, 1, 1, 0.9, 0.85, 0.75, 0.6, 0.35, 0.22, 0.2, 0.18, 0.17, 0.16, 0.15, 0.15],
    wochenende: 0.2,
    monat: [1.05, 1.05, 1.0, 0.98, 0.98, 0.95, 0.6, 0.6, 1.0, 1.0, 1.05, 1.05],
    beispiel: { verbrauch: 20000, dachflaeche: 400 },
    text: "Ganztags-Betreuung – längere Nutzung als die Schule, kürzere Sommerpause.",
  },
  {
    id: "bauhof",
    label: "Bauhof / Wirtschaftshof",
    kurz: "Bauhof",
    werktag: [0.18, 0.18, 0.18, 0.18, 0.2, 0.35, 0.8, 0.95, 1, 0.95, 0.9, 0.7, 0.8, 0.9, 0.85, 0.6, 0.45, 0.4, 0.3, 0.22, 0.2, 0.19, 0.18, 0.18],
    wochenende: 0.25,
    monat: WINTER_LEICHT,
    beispiel: { verbrauch: 30000, dachflaeche: 800 },
    text: "Werkstatt und E-Fuhrpark tagsüber – Ladepunkte verschieben Verbrauch in die Mittagsstunden.",
  },
  {
    id: "feuerwehr",
    label: "Feuerwehrhaus",
    kurz: "FF",
    werktag: [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.45, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.55, 0.7, 0.9, 1, 1, 0.9, 0.6, 0.45, 0.4],
    wochenende: 1,
    monat: WINTER_LEICHT,
    beispiel: { verbrauch: 8000, dachflaeche: 300 },
    text: "Geringer Verbrauch, Übungsabende – hoher Überschuss, dafür Notstrom-Nutzen mit Speicher.",
  },
  {
    id: "klaeranlage",
    label: "Kläranlage",
    kurz: "ARA",
    werktag: [0.78, 0.76, 0.75, 0.75, 0.76, 0.8, 0.86, 0.92, 0.96, 0.98, 1, 1, 0.98, 0.97, 0.96, 0.94, 0.92, 0.9, 0.9, 0.88, 0.85, 0.82, 0.8, 0.79],
    wochenende: 1,
    monat: FLACH,
    beispiel: { verbrauch: 250000, dachflaeche: 600 },
    text: "Grundlast rund um die Uhr – fast jede Kilowattstunde wird selbst genutzt.",
  },
  {
    id: "wasser",
    label: "Wasserversorgung / Pumpwerk",
    kurz: "Wasser",
    werktag: [0.7, 0.65, 0.6, 0.6, 0.65, 0.85, 1, 1, 0.9, 0.8, 0.8, 0.85, 0.85, 0.8, 0.8, 0.8, 0.85, 0.95, 1, 1, 0.9, 0.8, 0.75, 0.7],
    wochenende: 1,
    monat: [0.9, 0.9, 0.92, 0.95, 1.05, 1.12, 1.18, 1.15, 1.0, 0.92, 0.9, 0.9],
    beispiel: { verbrauch: 80000, dachflaeche: 150 },
    text: "Pumpen mit Grundlast, Spitzen morgens und abends – mit Lastmanagement in die Mittagszeit verschiebbar.",
  },
  {
    id: "freibad",
    label: "Freibad",
    kurz: "Bad",
    werktag: [0.5, 0.5, 0.5, 0.5, 0.5, 0.52, 0.6, 0.75, 0.88, 0.95, 1, 1, 1, 1, 1, 0.98, 0.95, 0.9, 0.82, 0.7, 0.6, 0.55, 0.52, 0.5],
    wochenende: 1.1,
    // Badesaison Mai–September, sonst Frostschutz/Grundlast
    monat: [0.05, 0.05, 0.05, 0.1, 0.7, 1, 1, 1, 0.6, 0.08, 0.05, 0.05],
    beispiel: { verbrauch: 120000, dachflaeche: 500 },
    text: "Umwälzung, Filter, Warmwasser im Sommer – genau zur Solarkurve; im Winter fast nichts.",
  },
  {
    id: "sporthalle",
    label: "Sporthalle / Veranstaltungssaal",
    kurz: "Halle",
    werktag: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.55, 0.7, 0.7, 0.7, 0.65, 0.6, 0.65, 0.7, 0.75, 0.9, 1, 1, 1, 0.9, 0.6, 0.3, 0.2],
    wochenende: 0.9,
    monat: [1.1, 1.08, 1.02, 0.95, 0.9, 0.85, 0.8, 0.8, 0.95, 1.05, 1.1, 1.1],
    beispiel: { verbrauch: 50000, dachflaeche: 1000 },
    text: "Großes Dach, Vereinsbetrieb am Abend – tagsüber Schulsport, Überschuss für die Energiegemeinschaft.",
  },
  {
    id: "wohnbau",
    label: "Gemeindewohnbau (Allgemeinstrom)",
    kurz: "Wohnbau",
    werktag: [0.35, 0.3, 0.3, 0.3, 0.3, 0.4, 0.7, 0.9, 0.7, 0.55, 0.5, 0.55, 0.6, 0.55, 0.5, 0.55, 0.7, 0.9, 1, 1, 0.9, 0.7, 0.5, 0.4],
    wochenende: 1.05,
    monat: WINTER_LEICHT,
    beispiel: { verbrauch: 15000, dachflaeche: 500 },
    text: "Stiegenhaus, Lift, Heizung – Mieterstrom bzw. gemeinschaftliche Erzeugung prüfen.",
  },
  {
    id: "sonstiges",
    label: "Sonstiges Gebäude",
    kurz: "Sonst.",
    werktag: [0.3, 0.3, 0.3, 0.3, 0.3, 0.35, 0.5, 0.75, 0.9, 1, 1, 1, 0.95, 0.95, 0.9, 0.85, 0.7, 0.55, 0.45, 0.4, 0.35, 0.32, 0.3, 0.3],
    wochenende: 0.5,
    monat: FLACH,
    beispiel: { verbrauch: 20000, dachflaeche: 300 },
    text: "Allgemeines Tagesprofil – für Musikheim, Friedhof, Recyclinghof, Vereinsgebäude.",
  },
];

export const gebaeudeTyp = (id) => GEBAEUDE.find((g) => g.id === id) || GEBAEUDE[GEBAEUDE.length - 1];

// ---------------------------------------------------------------------------
// Rechnung
// ---------------------------------------------------------------------------
const zahl = (v, standard = 0) => {
  const n = typeof v === "string" ? Number(String(v).replace(/\./g, "").replace(",", ".")) : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : standard;
};

/** kWp aus der Dachfläche (m²), auf ganze kWp gerundet, mindestens 1 kWp bei Fläche > 0. */
export function kwpAusDachflaeche(qm) {
  const f = zahl(qm);
  if (f <= 0) return 0;
  return Math.max(1, Math.round(f / QM_PRO_KWP));
}

/**
 * Eigenverbrauch (kWh/Jahr) aus Jahresverbrauch, kWp und Gebäudetyp – Stundenrechnung je Monat
 * mit Werktag/Wochenende.
 */
export function eigenverbrauchKwh({ verbrauch, kwp, typId, ertragProKwp = 1000 }) {
  const g = gebaeudeTyp(typId);
  const kwh = zahl(verbrauch);
  const p = zahl(kwp);
  if (kwh <= 0 || p <= 0) return 0;
  const monat = norm(g.monat);
  const form = norm(g.werktag);
  let ev = 0;
  for (let m = 0; m < 12; m++) {
    const tage = TAGE_MONAT[m];
    const werktage = (tage * 5) / 7;
    const wochenende = tage - werktage;
    const kwhMonat = kwh * monat[m];
    // Tagessumme Werktag so, dass Werktage + Wochenende × Faktor den Monatsverbrauch ergeben
    const tagWerk = kwhMonat / (werktage + wochenende * g.wochenende);
    const tagWe = tagWerk * g.wochenende;
    const pvTag = (p * ertragProKwp * PV_MONAT[m]) / tage;
    for (let h = 0; h < 24; h++) {
      const pv = pvTag * PV_FORM[m][h];
      ev += Math.min(tagWerk * form[h], pv) * werktage + Math.min(tagWe * form[h], pv) * wochenende;
    }
  }
  return Math.min(ev, kwh, p * ertragProKwp);
}

/** Ziel-Eigenverbrauchsquote für die Auslegung „eigenverbrauch“ (Richtwert). */
export const ZIEL_QUOTE = 0.5;

/** Auslegungsarten: Dach voll belegen oder auf eine Eigenverbrauchsquote begrenzen. */
export const AUSLEGUNGEN = [
  { id: "dach", label: "Dach voll belegen", text: "Maximale Leistung aus der Dachfläche – Überschuss für Energiegemeinschaft oder Einspeisung." },
  { id: "eigenverbrauch", label: "Auf Eigenverbrauch auslegen", text: `Leistung so begrenzen, dass mindestens ${Math.round(ZIEL_QUOTE * 100)} % des Solarstroms im Gebäude bleiben (Richtwert).` },
];

/**
 * Größte Leistung (ganze kWp, höchstens kwpMax), bei der die Eigenverbrauchsquote die Zielquote
 * noch erreicht. 0, wenn schon 1 kWp darunter liegt.
 */
export function kwpFuerQuote({ verbrauch, typId, ertragProKwp = 1000, kwpMax, ziel = ZIEL_QUOTE }) {
  const max = Math.max(0, Math.round(zahl(kwpMax)));
  if (max === 0 || zahl(verbrauch) <= 0) return 0;
  const quote = (p) => eigenverbrauchKwh({ verbrauch, kwp: p, typId, ertragProKwp }) / (p * ertragProKwp);
  if (quote(1) < ziel) return 0;
  let lo = 1;
  let hi = max;
  while (lo < hi) {
    const mitte = Math.ceil((lo + hi) / 2);
    if (quote(mitte) >= ziel) lo = mitte;
    else hi = mitte - 1;
  }
  return lo;
}

/**
 * Ein Gebäude durchrechnen.
 * @param {{ name?, typ, verbrauch, dachflaeche, netzebene?, dachalter?, kwpWunsch? }} e
 * @param {{ ertragProKwp?: number, auslegung?: "dach"|"eigenverbrauch" }} o
 */
export function liegenschaftBerechnen(e, { ertragProKwp = 1000, auslegung = "dach" } = {}) {
  const typ = gebaeudeTyp(e?.typ);
  const verbrauch = zahl(e?.verbrauch);
  const dachflaeche = zahl(e?.dachflaeche);
  const dachalter = zahl(e?.dachalter);
  const netzebene = String(e?.netzebene || "7");
  const kwpDach = kwpAusDachflaeche(dachflaeche);
  const wunsch = zahl(e?.kwpWunsch);
  let kwp = wunsch > 0 ? Math.min(Math.round(wunsch), kwpDach || Math.round(wunsch)) : kwpDach;
  if (auslegung === "eigenverbrauch" && wunsch <= 0) kwp = kwpFuerQuote({ verbrauch, typId: typ.id, ertragProKwp, kwpMax: kwpDach });
  const ertrag = Math.round(kwp * ertragProKwp);
  const eigenverbrauch = Math.round(eigenverbrauchKwh({ verbrauch, kwp, typId: typ.id, ertragProKwp }));
  const ueberschuss = Math.max(ertrag - eigenverbrauch, 0);
  const netzbezug = Math.max(verbrauch - eigenverbrauch, 0);
  const evQuote = ertrag > 0 ? eigenverbrauch / ertrag : 0;
  const autarkie = verbrauch > 0 ? eigenverbrauch / verbrauch : 0;

  const hinweise = [];
  let faktor = 1;
  if (dachalter >= DACHALTER_SANIERUNG) {
    hinweise.push({ id: "dach-sanierung", text: `Dach über ${DACHALTER_SANIERUNG} Jahre: Sanierung vor der PV wahrscheinlich – Restnutzungsdauer prüfen.` });
    faktor *= 0.75;
  } else if (dachalter >= DACHALTER_PRUEFEN) {
    hinweise.push({ id: "dach-pruefen", text: `Dach über ${DACHALTER_PRUEFEN} Jahre: Zustand und Statik vor der Planung prüfen.` });
    faktor *= 0.9;
  }
  if (netzebene === "7" && kwp >= NE7_PRUEFEN_AB_KWP) {
    hinweise.push({ id: "netz-ne7", text: `Rund ${NE7_PRUEFEN_AB_KWP} kWp und mehr auf Netzebene 7: Anschlussmöglichkeit vorab beim Netzbetreiber klären (ggf. Trafostation).` });
    faktor *= 0.9;
  }
  if (kwp > 0 && evQuote < 0.3) {
    hinweise.push({ id: "ev-niedrig", text: "Eigenverbrauchsquote unter 30 %: Anlage kleiner planen oder Überschuss in der Energiegemeinschaft nutzen." });
  }
  if (kwp > 0 && evQuote >= 0.7) {
    hinweise.push({ id: "ev-hoch", text: "Hoher Eigenverbrauch: das Dach könnte auch mehr Leistung tragen, falls Fläche frei ist." });
  }
  if (kwp === 0) hinweise.push({ id: "keine-flaeche", text: "Keine Dachfläche angegeben." });

  return {
    name: String(e?.name || "").trim() || typ.label,
    typ: typ.id,
    typLabel: typ.label,
    verbrauch,
    dachflaeche,
    dachalter,
    netzebene,
    kwp,
    kwpDach,
    ertrag,
    eigenverbrauch,
    ueberschuss,
    netzbezug,
    evQuote,
    autarkie,
    hinweise,
    // Reihungs-Kennzahl: selbst genutzte kWh, gemindert um Dach- und Netzrisiken
    score: Math.round(eigenverbrauch * faktor),
  };
}

/**
 * Alle Gebäude durchrechnen, Rangfolge (1 = zuerst angehen) und Summen bilden.
 * Mehr als MAX_GEBAEUDE Zeilen werden abgeschnitten.
 */
export function liegenschaftenAuswerten(zeilen = [], { ertragProKwp = 1000, auslegung = "dach" } = {}) {
  const liste = (Array.isArray(zeilen) ? zeilen : []).slice(0, MAX_GEBAEUDE).map((z, i) => ({ index: i, ...liegenschaftBerechnen(z, { ertragProKwp, auslegung }) }));
  const reihung = [...liste].sort((a, b) => b.score - a.score || b.eigenverbrauch - a.eigenverbrauch || a.index - b.index);
  reihung.forEach((r, i) => {
    r.rang = i + 1;
  });
  const summe = (k) => liste.reduce((s, x) => s + (x[k] || 0), 0);
  const gesamt = {
    gebaeude: liste.length,
    kwp: summe("kwp"),
    verbrauch: summe("verbrauch"),
    ertrag: summe("ertrag"),
    eigenverbrauch: summe("eigenverbrauch"),
    ueberschuss: summe("ueberschuss"),
    netzbezug: summe("netzbezug"),
  };
  gesamt.evQuote = gesamt.ertrag > 0 ? gesamt.eigenverbrauch / gesamt.ertrag : 0;
  gesamt.autarkie = gesamt.verbrauch > 0 ? gesamt.eigenverbrauch / gesamt.verbrauch : 0;
  return { liste, reihung, gesamt, ertragProKwp, auslegung };
}

/** Neue Zeile mit Beispielwerten des Typs (zum Befüllen – nicht als Ergebnis verwenden). */
export function neueZeile(typId = "amt", name = "") {
  const g = gebaeudeTyp(typId);
  return { name, typ: g.id, verbrauch: String(g.beispiel.verbrauch), dachflaeche: String(g.beispiel.dachflaeche), netzebene: "7", dachalter: "10", kwpWunsch: "", beispiel: true };
}

/** Startzeilen für die Seite (klar als Beispiel gekennzeichnet). */
export const BEISPIEL_ZEILEN = [
  neueZeile("amt", "Gemeindeamt"),
  neueZeile("schule", "Volksschule"),
  neueZeile("bauhof", "Bauhof"),
  neueZeile("klaeranlage", "Kläranlage"),
];

const deZahl = (n, stellen = 0) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "";
  const [ganz, dez] = x.toFixed(stellen).split(".");
  const g = ganz.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dez ? `${g},${dez}` : g;
};

/** CSV (Semikolon, deutsche Zahlen) für den Export – Rangfolge zuerst. */
export function csvExport(auswertung) {
  const kopf = ["Rang", "Liegenschaft", "Gebäudetyp", "Jahresverbrauch kWh", "Dachfläche m²", "Netzebene", "Dachalter Jahre", "kWp", "Jahresertrag kWh", "Eigenverbrauch kWh", "Überschuss kWh", "Eigenverbrauchsquote %", "Autarkie %", "Hinweise"];
  const zeilen = auswertung.reihung.map((r) =>
    [
      r.rang,
      r.name,
      r.typLabel,
      deZahl(r.verbrauch),
      deZahl(r.dachflaeche),
      `NE ${r.netzebene}`,
      deZahl(r.dachalter),
      deZahl(r.kwp),
      deZahl(r.ertrag),
      deZahl(r.eigenverbrauch),
      deZahl(r.ueberschuss),
      deZahl(r.evQuote * 100),
      deZahl(r.autarkie * 100),
      r.hinweise.map((h) => h.text).join(" | "),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(";")
  );
  const g = auswertung.gesamt;
  const fuss = ["", "Summe", "", deZahl(g.verbrauch), "", "", "", deZahl(g.kwp), deZahl(g.ertrag), deZahl(g.eigenverbrauch), deZahl(g.ueberschuss), deZahl(g.evQuote * 100), deZahl(g.autarkie * 100), `Grobabschätzung mit typisierten Profilen, ${auswertung.ertragProKwp} kWh/kWp, Auslegung: ${AUSLEGUNGEN.find((a) => a.id === auswertung.auslegung)?.label || "Dach voll belegen"}, Stand ${LIEGENSCHAFTEN_STAND.label}`]
    .map((v) => `"${String(v).replace(/"/g, '""')}"`)
    .join(";");
  return "﻿" + [kopf.join(";"), ...zeilen, fuss].join("\r\n");
}

export const QUELLEN = [
  ERTRAG_QUELLE,
  { label: "Österreichische Koordinationsstelle für Energiegemeinschaften – Modelle der gemeinsamen Energienutzung", url: "https://energiegemeinschaften.gv.at/gemeinsame-energienutzung/" },
  { label: "E-Control – Netzebenen und Netzzugang (Erzeuger)", url: "https://www.e-control.at/" },
];
