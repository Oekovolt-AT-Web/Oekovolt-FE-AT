// src/lib/flaeche/netz.js
//
// Netzschritt im Flächen-Check (Welle B, Paket B06): nächstes Umspannwerk per Haversine.
// Datenbasis: src/data/umspannwerke-at.json bzw. /daten/umspannwerke-at.json –
// abgeleitete Datenbank aus OpenStreetMap, © OpenStreetMap-Mitwirkende, ODbL 1.0
// (erzeugt einmalig mit scripts/umspannwerke-osm.mjs; Besucher lösen keinen OSM-Abruf aus).
//
// Wichtig für jede Anzeige:
//  - Luftlinie ist nicht gleich Trassenlänge (Kabel folgen Wegen, Grundstücksgrenzen, Dienstbarkeiten).
//  - Ob Kapazität frei ist, entscheidet der Netzbetreiber – die Datei enthält keine Kapazitäten.
//  - OSM ist unvollständig: Name und Spannung fehlen teils, kleine Stationen sind nicht alle erfasst.
// Reine Funktionen ohne React/Pfad-Aliase – per Node testbar (node scripts/flaeche.test.mjs).

import { zahl } from "./format.js";
import { KAPAZITAET_HINWEIS, KAPAZITAET_PFAD, KAPAZITAET_STAND, kapazitaetQuellenFuerLand } from "../../data/netzkapazitaetQuellen.js";

export const ODBL_HINWEIS = "© OpenStreetMap-Mitwirkende, ODbL";
export const ODBL_URL = "https://www.openstreetmap.org/copyright";
export const ODBL_LIZENZ_URL = "https://opendatacommons.org/licenses/odbl/1-0/";
export const DOWNLOAD_PFAD = "/daten/umspannwerke-at.json";
export const DOWNLOAD_README = "/daten/umspannwerke-at.README.txt";

export const LUFTLINIE_HINWEIS = "Luftlinie ist nicht gleich Trassenlänge; Kapazität entscheidet der Netzbetreiber.";

/** Mittlerer Erdradius in km (IUGG). */
export const ERDRADIUS_KM = 6371.0088;

/** Spannungsstufen für die Auswahl: alle ab 20 kV (Mittelspannung) bzw. ab 110 kV (Umspannwerk zur Hochspannung). */
export const STUFEN_KV = { mittelspannung: 20, hochspannung: 110 };

const rad = (g) => (g * Math.PI) / 180;

/**
 * Großkreisentfernung zweier WGS84-Punkte in km (Haversine-Formel, Kugelmodell).
 * Genauigkeit ±0,5 % gegenüber dem Ellipsoid – für eine Luftlinien-Orientierung ausreichend.
 */
export function haversineKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * ERDRADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Liste aus der JSON-Datei (Objekt mit umspannwerke[] oder direkt ein Array). */
export const umspannwerkListe = (daten) => (Array.isArray(daten) ? daten : daten?.umspannwerke || []);

/**
 * Nächstes Umspannwerk zu einem Punkt.
 * @param {{lat:number, lon:number}} punkt
 * @param {object|Array} daten   Inhalt von umspannwerke-at.json
 * @param {object} [opt]
 * @param {number} [opt.minKv=20] nur Stationen mit mindestens dieser Spannung
 * @returns {{ name:string|null, lat:number, lon:number, kv:number, km:number } | null}
 */
export function naechstesUmspannwerk(punkt, daten, { minKv = STUFEN_KV.mittelspannung } = {}) {
  if (!punkt || !Number.isFinite(punkt.lat) || !Number.isFinite(punkt.lon)) return null;
  let best = null;
  let bestKm = Infinity;
  // Grobfilter über Breitengrad: 1° ≈ 111 km – spart Rechenzeit bei rund 9.000 Einträgen
  for (const u of umspannwerkListe(daten)) {
    if (!(u.kv >= minKv)) continue;
    if (Math.abs(u.lat - punkt.lat) * 111 > bestKm) continue;
    const km = haversineKm(punkt, u);
    if (km < bestKm) {
      bestKm = km;
      best = u;
    }
  }
  return best ? { name: best.n ?? null, lat: best.lat, lon: best.lon, kv: best.kv, km: bestKm } : null;
}

/**
 * Vorschlag für den Regler „Entfernung zum Netzanschluss“ im Flächen-Check:
 * Luftlinie zum nächsten Umspannwerk ≥ 20 kV, auf 0,1 km gerundet und auf den Reglerbereich begrenzt.
 * @returns {{ km:number, gekappt:boolean, mittel:object|null, hoch:object|null } | null}
 */
export function netzVorschlag(punkt, daten, { maxKm = 10 } = {}) {
  const mittel = naechstesUmspannwerk(punkt, daten, { minKv: STUFEN_KV.mittelspannung });
  if (!mittel) return null;
  const hoch = naechstesUmspannwerk(punkt, daten, { minKv: STUFEN_KV.hochspannung });
  const km = Math.round(mittel.km * 10) / 10;
  return { km: Math.min(km, maxKm), gekappt: km > maxKm, mittel, hoch };
}

/** Anzeigename einer Station – OSM-Namen fehlen oft. */
export const stationsName = (u) => (u?.name ? u.name : `Station ohne Namen in OSM (${u?.kv ?? "?"} kV)`);

const km1 = (km) => `${zahl(km, 1)} km`;

/**
 * Inhalt des „Netz-Steckbriefs“ (Textdatei, Export über das Lead-Gate „netzkapazitaet“).
 * Enthält nur den markierten Punkt, die Luftlinien und Links – keine Kapazitätswerte.
 * @param {{ punkt:{lat:number,lon:number}, vorschlag:object, land?:{slug:string,name:string}, datum:string, basisUrl?:string }} e
 */
export function netzSteckbriefText({ punkt, vorschlag, land, datum, basisUrl = "" }) {
  const quellen = kapazitaetQuellenFuerLand(land?.slug);
  const z = [];
  z.push("NETZ-STECKBRIEF – Vorbereitung der Netzanfrage");
  z.push(`Erstellt am ${datum} mit dem Netzkapazitäts-Lotsen von Ökovolt Österreich`);
  z.push("");
  z.push(`Bundesland: ${land?.name || "–"}`);
  z.push(`Markierter Punkt (WGS84): ${punkt.lat.toFixed(5)}, ${punkt.lon.toFixed(5)}`);
  z.push("");
  z.push("Nächste Stationen laut OpenStreetMap (Luftlinie, Richtwert/Orientierung):");
  z.push(`- ab 20 kV: ${stationsName(vorschlag.mittel)}, ${vorschlag.mittel.kv} kV, ≈ ${km1(vorschlag.mittel.km)}`);
  if (vorschlag.hoch) z.push(`- ab 110 kV: ${stationsName(vorschlag.hoch)}, ${vorschlag.hoch.kv} kV, ≈ ${km1(vorschlag.hoch.km)}`);
  z.push(`Hinweis: ${LUFTLINIE_HINWEIS}`);
  z.push("");
  z.push("Freie Netzkapazität prüfen (Veröffentlichungen der Netzbetreiber):");
  for (const q of quellen) z.push(`- ${q.name}${q.slug !== "alle" ? ` (${q.gebiet})` : ""}: ${q.url}`);
  z.push("");
  z.push(KAPAZITAET_HINWEIS);
  z.push("");
  z.push(`Umspannwerk-Daten: ${ODBL_HINWEIS} – Lizenz ODbL 1.0 (${ODBL_LIZENZ_URL}). Links geprüft am ${KAPAZITAET_STAND.label}.`);
  z.push(`Mehr: ${basisUrl}${KAPAZITAET_PFAD}`);
  z.push("Unverbindliche Orientierung, keine Zusage über Netzanschluss oder Kapazität.");
  return z.join("\r\n") + "\r\n";
}
