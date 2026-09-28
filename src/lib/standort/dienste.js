// src/lib/standort/dienste.js
//
// Serverseitige Anbindung externer, frei nutzbarer Dienste für den Standort-Check.
// NUR in API-Routen verwenden (User-Agent, Drosselung und Cache gelten je Serverprozess).
//
//  - OpenStreetMap Nominatim (Adresssuche + Rückwärtssuche)
//    Nutzungsregeln: https://operations.osmfoundation.org/policies/nominatim/
//    max. 1 Anfrage/Sekunde, aussagekräftiger User-Agent, Ergebnisse cachen, KEINE
//    Autovervollständigung (Suche nur auf Knopfdruck), Attribution „© OpenStreetMap“ (ODbL).
//  - Open Topo Data, Datensatz EU-DEM 25 m (Seehöhe)
//    https://www.opentopodata.org/ – öffentliche API: max. 1 Anfrage/Sekunde, 1.000/Tag.
//    EU-DEM v1.1 © Copernicus Land Monitoring Service (frei nutzbar mit Quellenangabe).
//    Fallback: Seehöhe aus der PVGIS-Antwort (Gelände­modell des JRC).
//  - PVGIS 5.3 des Joint Research Centre der EU-Kommission (Ertrag)
//    https://joint-research-centre.ec.europa.eu/photovoltaic-geographical-information-system-pvgis_en
//    frei, ohne Schlüssel; Weiterverwendung mit Quellenangabe („PVGIS © Europäische Union“).
//    Limit laut JRC: 30 Anfragen/Sekunde je IP. Bei Fehlern Rückfall auf API-Version 5.2.
//
// Open-Meteo wird bewusst NICHT verwendet: Die kostenlose API ist laut Nutzungsbedingungen nur
// für nicht-kommerzielle Zwecke freigegeben.

import { BASE_URL, FIRMA } from "@/lib/site";

const USER_AGENT = `Oekovolt-Standortcheck/1.0 (+${BASE_URL}/standort-check; ${FIRMA.email})`;
const STUNDE = 60 * 60 * 1000;

/** Grober Rahmen um Österreich (inkl. kleiner Randzone). */
export const OESTERREICH = { latMin: 46.35, latMax: 49.05, lonMin: 9.5, lonMax: 17.2 };

export function inOesterreichRahmen(lat, lon) {
  return lat >= OESTERREICH.latMin && lat <= OESTERREICH.latMax && lon >= OESTERREICH.lonMin && lon <= OESTERREICH.lonMax;
}

/* ------------------------------------------------------------------ Cache */

const CACHE = new Map();
const CACHE_MAX = 800;

async function mitCache(schluessel, ttl, laden) {
  const eintrag = CACHE.get(schluessel);
  if (eintrag && eintrag.bis > Date.now()) return eintrag.wert;
  const wert = await laden();
  if (wert != null) {
    if (CACHE.size >= CACHE_MAX) CACHE.delete(CACHE.keys().next().value);
    CACHE.set(schluessel, { wert, bis: Date.now() + ttl });
  }
  return wert;
}

/* ------------------------------------------------------------------ Drosselung je Dienst */

const letzteAnfrage = new Map();
const warteschlange = new Map();

/** Stellt sicher, dass zwischen zwei Anfragen an denselben Dienst mindestens `abstand` ms liegen. */
function gedrosselt(dienst, abstand, fn) {
  const vorher = warteschlange.get(dienst) || Promise.resolve();
  const lauf = vorher
    .catch(() => {})
    .then(async () => {
      const warten = (letzteAnfrage.get(dienst) || 0) + abstand - Date.now();
      if (warten > 0) await new Promise((r) => setTimeout(r, warten));
      letzteAnfrage.set(dienst, Date.now());
      return fn();
    });
  warteschlange.set(dienst, lauf);
  return lauf;
}

async function holeJson(url, { timeout = 8000, headers = {} } = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json", "Accept-Language": "de-AT,de", ...headers },
    signal: AbortSignal.timeout(timeout),
    cache: "no-store",
  });
  if (!res.ok) {
    const fehler = new Error(`HTTP ${res.status}`);
    fehler.status = res.status;
    throw fehler;
  }
  return res.json();
}

/* ------------------------------------------------------------------ Nominatim */

function kurzLabel(a = {}, fallback = "") {
  const strasse = [a.road || a.pedestrian || a.footway || a.path || a.hamlet, a.house_number].filter(Boolean).join(" ");
  const ort = a.village || a.town || a.city || a.municipality || a.suburb || "";
  const plzOrt = [a.postcode, ort].filter(Boolean).join(" ");
  const teile = [strasse, plzOrt, a.state].filter(Boolean);
  return teile.length ? teile.join(", ") : fallback;
}

/** Adresssuche in Österreich (Nominatim, countrycodes=at). */
export async function sucheAdresse(q) {
  const text = String(q || "").trim().replace(/\s+/g, " ").slice(0, 160);
  if (text.length < 3) return [];
  return mitCache(`suche:${text.toLowerCase()}`, 24 * STUNDE, () =>
    gedrosselt("nominatim", 1100, async () => {
      const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
        q: text,
        countrycodes: "at",
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
        "accept-language": "de",
      })}`;
      const daten = await holeJson(url, { timeout: 8000 });
      return (Array.isArray(daten) ? daten : [])
        .map((d) => ({
          label: kurzLabel(d.address, d.display_name),
          voll: d.display_name,
          lat: Number(d.lat),
          lon: Number(d.lon),
        }))
        .filter((d) => Number.isFinite(d.lat) && Number.isFinite(d.lon));
    })
  );
}

/** Rückwärtssuche: Adresse und Land zu Koordinaten (Nominatim). Liefert null bei Fehlern. */
export async function ortZuKoordinate(lat, lon) {
  const schluessel = `rev:${lat.toFixed(4)},${lon.toFixed(4)}`;
  try {
    return await mitCache(schluessel, 24 * STUNDE, () =>
      gedrosselt("nominatim", 1100, async () => {
        const url = `https://nominatim.openstreetmap.org/reverse?${new URLSearchParams({
          lat: String(lat),
          lon: String(lon),
          format: "jsonv2",
          zoom: "18",
          addressdetails: "1",
          "accept-language": "de",
        })}`;
        const d = await holeJson(url, { timeout: 8000 });
        if (!d || d.error) return { label: null, land: null };
        return { label: kurzLabel(d.address, d.display_name), land: d.address?.country_code || null };
      })
    );
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ Seehöhe */

/** Seehöhe in m aus EU-DEM 25 m (Open Topo Data). Liefert null bei Fehlern. */
export async function seehoehe(lat, lon) {
  const schluessel = `hoehe:${lat.toFixed(4)},${lon.toFixed(4)}`;
  try {
    return await mitCache(schluessel, 30 * 24 * STUNDE, () =>
      gedrosselt("opentopodata", 1100, async () => {
        const url = `https://api.opentopodata.org/v1/eudem25m?locations=${lat.toFixed(5)},${lon.toFixed(5)}`;
        const d = await holeJson(url, { timeout: 7000 });
        const m = d?.results?.[0]?.elevation;
        return Number.isFinite(m) ? { m: Math.round(m), quelle: "EU-DEM 25 m (Copernicus) über Open Topo Data" } : null;
      })
    );
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ PVGIS */

const PVGIS_VERSIONEN = ["v5_3", "v5_2"];

function pvgisAuswerten(d) {
  const fest = d?.outputs?.totals?.fixed;
  const monate = d?.outputs?.monthly?.fixed;
  const montage = d?.inputs?.mounting_system?.fixed;
  if (!fest || !Array.isArray(monate)) return null;
  return {
    ertrag: Math.round(fest.E_y),
    einstrahlung: Math.round(fest["H(i)_y"]),
    monate: monate.map((m) => Math.round(m.E_m * 10) / 10),
    neigung: montage?.slope?.value ?? null,
    azimut: montage?.azimuth?.value ?? null,
    seehoehe: Number.isFinite(d?.inputs?.location?.elevation) ? Math.round(d.inputs.location.elevation) : null,
    datenbank: d?.inputs?.meteo_data?.radiation_db || null,
    zeitraum: d?.inputs?.meteo_data ? `${d.inputs.meteo_data.year_min}–${d.inputs.meteo_data.year_max}` : null,
    horizont: Boolean(d?.inputs?.meteo_data?.use_horizon),
  };
}

/**
 * Spezifischer Jahresertrag (kWh/kWp) mit PVGIS für 1 kWp, 14 % Systemverluste.
 * optimal = true → PVGIS wählt Neigung und Azimut selbst (optimalangles=1).
 * azimut: PVGIS-Konvention, 0 = Süd, −90 = Ost, 90 = West. montage: "free" | "building".
 */
export async function pvgisErtrag({ lat, lon, neigung = 30, azimut = 0, montage = "free", optimal = false }) {
  const params = {
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
    peakpower: "1",
    loss: "14",
    mountingplace: montage === "building" ? "building" : "free",
    outputformat: "json",
    ...(optimal ? { optimalangles: "1" } : { angle: String(Math.round(neigung)), aspect: String(Math.round(azimut)) }),
  };
  const schluessel = `pvgis:${new URLSearchParams(params)}`;
  return mitCache(schluessel, 7 * 24 * STUNDE, async () => {
    let letzterFehler;
    for (const version of PVGIS_VERSIONEN) {
      try {
        const d = await gedrosselt("pvgis", 150, () =>
          holeJson(`https://re.jrc.ec.europa.eu/api/${version}/PVcalc?${new URLSearchParams(params)}`, { timeout: 15000 })
        );
        const ergebnis = pvgisAuswerten(d);
        if (ergebnis) return { ...ergebnis, version };
      } catch (e) {
        letzterFehler = e;
        // 4xx (z. B. Punkt ohne Daten) nicht mit älterer Version wiederholen
        if (e?.status >= 400 && e?.status < 500 && e.status !== 429) break;
      }
    }
    throw letzterFehler || new Error("PVGIS ohne Ergebnis");
  });
}
