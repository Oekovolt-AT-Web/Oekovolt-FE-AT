// src/lib/prognose/geosphere.js
//
// Serverseitiger Abruf der Wettervorhersage für die PV-Prognose aus dem GeoSphere Austria Data Hub.
// NUR in API-Routen verwenden. Geprüft am 30.09.2026 per /metadata:
//
//  - nwp-v2-1h-1km  „Hochauflösendes Wettermodell für Österreich (C-LAEF AlpeAdria deterministisch)“
//      DOI 10.60669/rv80-9d61 · Lizenz CC BY 4.0 · 1 km · stündlich · Lauf alle 3 h · 60 h Vorhersage
//      Parameter: ssrd (surface global radiation, W m-2, dekumuliert = Mittel der Stunde VOR dem
//      Zeitstempel), 2t (2 m-Temperatur, °C)
//  - ensemble-v2-1h-1km  „Ensemblevorhersage für Österreich (C-LAEF AlpeAdria)“
//      DOI 10.60669/f21y-5007 · Lizenz CC BY 4.0 · 16 Member + Kontrolllauf · über die API nur
//      Perzentile 10/50/90 (ssrd_p10, ssrd_p50, ssrd_p90, 2t_p50)
//  - Die Vorgängerversionen (nwp-v1-1h-2500m, ensemble-v1-1h-2500m) werden am 04.11.2026 eingestellt
//    und deshalb nicht verwendet.
//  - Limits laut Antwort-Headern: 5 Abfragen/Sekunde, 240 Abfragen/Stunde (siehe budget.js).
//  - Pflicht-Quellenangabe laut Nutzungsbedingungen (https://data.hub.geosphere.at/legal):
//    „Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at“
//
// Schonung des Limits:
//  1. Cache je Rasterzelle (0,05°) UND Modelllauf: Eine Zelle wird je Lauf höchstens einmal geholt.
//  2. Den aktuellen Lauf erfahren wir über /metadata (höchstens alle 20 Minuten je Datensatz).
//  3. Zentraler Zähler mit eigenem Deckel unter dem GeoSphere-Limit, Auswertung von
//     X-RateLimit-Remaining-Hour, Mindestabstand zwischen Abrufen, Timeout 8 s.
//  4. Reicht das Budget nicht, antworten wir aus dem Cache (auch mit älterem Lauf, max. 12 h) –
//     das Ensemble (nur Unsicherheitsband) hat die niedrigere Priorität.

import { BASE_URL, FIRMA } from "../site.js";
import { neuesBudget } from "./budget.js";

export const API = "https://dataset.api.hub.geosphere.at/v1/timeseries/forecast";
export const DATENSATZ = {
  nwp: { id: "nwp-v2-1h-1km", parameter: ["ssrd", "2t"], doi: "https://doi.org/10.60669/rv80-9d61", seite: "https://data.hub.geosphere.at/dataset/nwp-v2-1h-1km" },
  ens: { id: "ensemble-v2-1h-1km", parameter: ["ssrd_p10", "ssrd_p50", "ssrd_p90", "2t_p50"], doi: "https://doi.org/10.60669/f21y-5007", seite: "https://data.hub.geosphere.at/dataset/ensemble-v2-1h-1km" },
};
export const QUELLENANGABE = "Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at";

const USER_AGENT = `Oekovolt-PV-Prognose/1.0 (+${BASE_URL}/pv-prognose; ${FIRMA.email})`;
const MINUTE = 60000;
const STUNDE = 60 * MINUTE;
const META_TTL = 20 * MINUTE;
const OHNE_META_TTL = 60 * MINUTE; // falls /metadata nicht erreichbar ist
const MAX_ALTER = 12 * STUNDE;
const ABSTAND_MS = 250; // ≤ 4 Abrufe je Sekunde
const ENSEMBLE_MIN_REST = 40; // Ensemble nur, solange genug Budget für Hauptdaten bleibt
const CACHE_MAX = 1500;

/* ------------------------------------------------------------------ Prozessweiter Zustand */
// Auf globalThis, damit Hot Reload im Entwicklungsmodus Zähler und Cache nicht zurücksetzt.
const Z = (globalThis.__ovPvPrognose ??= {
  budget: neuesBudget({ proStunde: 200, reserve: 20 }),
  cache: new Map(), // `${ds}|${zelle}` → { lauf, daten, abgerufen }
  meta: new Map(), // ds → { lauf, geprueft }
  laufend: new Map(), // Schlüssel → Promise (gleichzeitige Anfragen bündeln)
  kette: Promise.resolve(),
  letzter: 0,
});

export class BudgetErschoepft extends Error {
  constructor(bis) {
    super("GeoSphere-Abrufbudget erschöpft");
    this.bis = bis;
  }
}

/* ------------------------------------------------------------------ Reine Hilfsfunktionen (getestet) */

/** GeoJSON-Antwort der Timeseries-API → { referenz, zeiten: ms[], werte: { name: number|null[] } } */
export function antwortLesen(json, namen) {
  const zeiten = (json?.timestamps || []).map((t) => Date.parse(t));
  const param = json?.features?.[0]?.properties?.parameters || {};
  const werte = {};
  for (const n of namen) {
    const daten = param[n]?.data || [];
    werte[n] = zeiten.map((_, i) => (Number.isFinite(daten[i]) ? daten[i] : null));
  }
  return { referenz: json?.reference_time || null, zeiten, werte };
}

/**
 * Deterministischen Lauf und Ensemble zu Stunden zusammenführen (Zuordnung über den Zeitstempel).
 * Rückgabe: [{ ende, ghi, t2m, ghiP10, ghiP50, ghiP90 }] – Strahlung auf ≥ 0 begrenzt.
 */
export function reihenVerbinden(nwp, ens) {
  const ensIndex = new Map((ens?.zeiten || []).map((t, i) => [t, i]));
  const plus = (x) => (Number.isFinite(x) ? Math.max(0, x) : null);
  const stunden = [];
  (nwp?.zeiten || []).forEach((t, i) => {
    const ghi = plus(nwp.werte.ssrd?.[i]);
    if (ghi == null) return;
    const j = ensIndex.get(t);
    const e = (n) => (j == null ? null : ens.werte[n]?.[j] ?? null);
    stunden.push({
      ende: t,
      ghi,
      t2m: Number.isFinite(nwp.werte["2t"]?.[i]) ? nwp.werte["2t"][i] : e("2t_p50"),
      ghiP10: plus(e("ssrd_p10")),
      ghiP50: plus(e("ssrd_p50")),
      ghiP90: plus(e("ssrd_p90")),
    });
  });
  return stunden;
}

/* ------------------------------------------------------------------ Abruf */

function gedrosselt(fn) {
  const lauf = Z.kette
    .catch(() => {})
    .then(async () => {
      const warten = Z.letzter + ABSTAND_MS - Date.now();
      if (warten > 0) await new Promise((r) => setTimeout(r, warten));
      Z.letzter = Date.now();
      return fn();
    });
  Z.kette = lauf;
  return lauf;
}

async function abruf(url) {
  if (!Z.budget.darf(Date.now())) throw new BudgetErschoepft(Z.budget.gesperrtBis());
  Z.budget.buchen(Date.now());
  return gedrosselt(async () => {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    Z.budget.headerMelden(res.headers.get("x-ratelimit-remaining-hour"), Date.now());
    if (res.status === 429) {
      Z.budget.zuVieleMelden(Date.now(), res.headers.get("retry-after"));
      throw new BudgetErschoepft(Z.budget.gesperrtBis());
    }
    if (!res.ok) throw new Error(`GeoSphere HTTP ${res.status}`);
    return res.json();
  });
}

/** Letzter verfügbarer Modelllauf eines Datensatzes (ISO) oder null; höchstens alle 20 min abgefragt. */
async function aktuellerLauf(ds) {
  const m = Z.meta.get(ds);
  if (m && Date.now() - m.geprueft < META_TTL) return m.lauf;
  // Metadaten nur abfragen, wenn genug Budget für Daten bleibt.
  if (!Z.budget.darf(Date.now(), 10)) return m?.lauf ?? null;
  try {
    const j = await abruf(`${API}/${DATENSATZ[ds].id}/metadata`);
    const lauf = j?.last_forecast_reftime || null;
    Z.meta.set(ds, { lauf, geprueft: Date.now() });
    return lauf;
  } catch {
    Z.meta.set(ds, { lauf: m?.lauf ?? null, geprueft: Date.now() - META_TTL + 5 * MINUTE });
    return m?.lauf ?? null;
  }
}

function merken(schluessel, wert) {
  if (Z.cache.size >= CACHE_MAX) Z.cache.delete(Z.cache.keys().next().value);
  Z.cache.set(schluessel, wert);
}

/**
 * Daten eines Datensatzes für eine Zelle – aus dem Cache, solange der Lauf aktuell ist.
 * Rückgabe: { daten, lauf, herkunft: "live" | "cache" | "veraltet" } oder wirft (kein Cache).
 */
async function datensatzFuerZelle(ds, zelle) {
  const schluessel = `${ds}|${zelle.schluessel}`;
  const eintrag = Z.cache.get(schluessel);
  const lauf = await aktuellerLauf(ds);
  const jetzt = Date.now();
  if (eintrag) {
    const gleicherLauf = lauf && eintrag.lauf === lauf;
    const jungOhneMeta = !lauf && jetzt - eintrag.abgerufen < OHNE_META_TTL;
    if (gleicherLauf || jungOhneMeta) return { ...eintrag, herkunft: "cache" };
  }
  const nochAltVerwendbar = eintrag && jetzt - eintrag.abgerufen < MAX_ALTER;
  if (ds === "ens" && Z.budget.rest(jetzt) < ENSEMBLE_MIN_REST) {
    if (nochAltVerwendbar) return { ...eintrag, herkunft: "veraltet" };
    throw new BudgetErschoepft(Z.budget.gesperrtBis());
  }

  if (Z.laufend.has(schluessel)) return Z.laufend.get(schluessel);
  const p = (async () => {
    try {
      const params = new URLSearchParams({ lat_lon: `${zelle.lat},${zelle.lon}`, output_format: "geojson" });
      for (const n of DATENSATZ[ds].parameter) params.append("parameters", n);
      const json = await abruf(`${API}/${DATENSATZ[ds].id}?${params}`);
      const daten = antwortLesen(json, DATENSATZ[ds].parameter);
      if (!daten.zeiten.length) throw new Error("GeoSphere: leere Antwort");
      const neu = { lauf: daten.referenz, daten, abgerufen: Date.now() };
      merken(schluessel, neu);
      return { ...neu, herkunft: "live" };
    } catch (e) {
      if (nochAltVerwendbar) return { ...eintrag, herkunft: "veraltet" };
      throw e;
    } finally {
      Z.laufend.delete(schluessel);
    }
  })();
  Z.laufend.set(schluessel, p);
  return p;
}

/**
 * Stündliche Vorhersage für eine Rasterzelle (siehe zelle() in auswertung.js).
 * Rückgabe: { stunden, lauf: { nwp, ens }, herkunft, ensemble: boolean }
 * Wirft BudgetErschoepft oder Error, wenn weder frische noch zwischengespeicherte Daten vorliegen.
 */
export async function vorhersageFuerZelle(zelle) {
  const nwp = await datensatzFuerZelle("nwp", zelle);
  let ens = null;
  try {
    ens = await datensatzFuerZelle("ens", zelle);
  } catch {
    ens = null; // Band ist optional
  }
  const jetzt = Date.now();
  const stunden = reihenVerbinden(nwp.daten, ens?.daten).filter((s) => s.ende > jetzt);
  const herkunft = nwp.herkunft === "veraltet" ? "veraltet" : nwp.herkunft;
  return {
    stunden,
    lauf: { nwp: nwp.lauf, ens: ens?.lauf ?? null },
    herkunft,
    ensemble: stunden.some((s) => s.ghiP10 != null),
  };
}

/** Nur für Diagnose/Tests: aktueller Zählerstand. */
export function budgetStand() {
  const jetzt = Date.now();
  return { genutzt: Z.budget.anzahl(jetzt), rest: Z.budget.rest(jetzt), gesperrtBis: Z.budget.gesperrtBis() || null };
}
