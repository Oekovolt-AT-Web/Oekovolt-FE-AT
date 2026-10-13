// scripts/umspannwerke-osm.mjs
//
// Erzeugt die Umspannwerk-Datenbank für den Netzkapazitäts-Lotsen (Welle B, Paket B06).
// EINMALIGER Abruf über die Overpass-API (eine Anfrage, eigener User-Agent) – Besucher der
// Website lösen nie einen Live-Abruf aus. Ergebnis:
//   src/data/umspannwerke-at.json      (wird vom Flächen-Check importiert)
//   public/daten/umspannwerke-at.json  (öffentlicher Download, gleiche Datei – ODbL Share-Alike)
//
// Inhalt: alle OSM-Objekte power=substation in Österreich mit einer Spannung ≥ 20 kV
// (höchster Wert aus dem Tag „voltage“, z. B. „110000;30000“ → 110 kV).
// Je Eintrag: Name (falls getaggt), Koordinate auf 3 Nachkommastellen gerundet (≈ 100 m), Spannung in kV.
//
// Lizenz: Die Datei ist eine abgeleitete Datenbank aus OpenStreetMap und steht wie das Original
// unter der Open Database License (ODbL) 1.0 – Attribution „© OpenStreetMap-Mitwirkende, ODbL“
// überall sichtbar, wo die Daten genutzt werden.
//
// Aufruf (nur bei Bedarf, z. B. einmal im Jahr):  node scripts/umspannwerke-osm.mjs
// Trockenlauf mit gespeicherter Antwort:           node scripts/umspannwerke-osm.mjs --aus=<datei.json>

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ZIEL_SRC = path.join(root, "src", "data", "umspannwerke-at.json");
const ZIEL_PUBLIC = path.join(root, "public", "daten", "umspannwerke-at.json");

const OVERPASS = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "Oekovolt-Oesterreich-Website/1.0 (einmaliger Datenexport Umspannwerke; office@oekovolt.at)";
const MIN_VOLT = 20000;
const MAX_VOLT = 400000;

// Eine Anfrage: alle Umspannwerke (Knoten, Wege, Relationen) im Staatsgebiet, Mittelpunkt + Tags
const ABFRAGE = `[out:json][timeout:180];
area["ISO3166-1"="AT"][admin_level=2]->.at;
nwr["power"="substation"](area.at);
out center tags;`;

/** Höchste Spannung in Volt aus dem OSM-Tag voltage („110000;30000“, „20000“, „20 kV“ …). */
export function hoechsteSpannung(tag) {
  if (!tag) return 0;
  let max = 0;
  for (const teil of String(tag).split(/[;,/]/)) {
    const t = teil.trim().toLowerCase();
    let v = parseFloat(t.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(v)) continue;
    if (/kv/.test(t) || v < 1000) v *= 1000; // „110 kV“ oder einheitenlos „110“ → Volt
    if (v > MAX_VOLT) continue; // Tippfehler wie „30000000“ verwerfen (höchste Ebene in AT: 380 kV)
    if (v > max) max = v;
  }
  return max;
}

const rund3 = (x) => Math.round(x * 1000) / 1000;

export function aufbereiten(antwort, abrufDatum) {
  const liste = [];
  for (const e of antwort.elements || []) {
    const lat = e.lat ?? e.center?.lat;
    const lon = e.lon ?? e.center?.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const volt = hoechsteSpannung(e.tags?.voltage);
    if (volt < MIN_VOLT) continue;
    const name = (e.tags?.name || "").trim();
    liste.push({ n: name || null, lat: rund3(lat), lon: rund3(lon), kv: Math.round(volt / 1000) });
  }
  // Doppelte (gleiche gerundete Koordinate + Spannung) zusammenfassen, Name bevorzugen
  const nachSchluessel = new Map();
  for (const u of liste) {
    const k = `${u.lat}|${u.lon}|${u.kv}`;
    const alt = nachSchluessel.get(k);
    if (!alt || (!alt.n && u.n)) nachSchluessel.set(k, u);
  }
  const daten = [...nachSchluessel.values()].sort((a, b) => b.kv - a.kv || a.lat - b.lat || a.lon - b.lon);
  return {
    _lizenz: {
      hinweis: "© OpenStreetMap-Mitwirkende, ODbL",
      lizenz: "Open Database License (ODbL) 1.0",
      lizenzUrl: "https://opendatacommons.org/licenses/odbl/1-0/",
      quelle: "OpenStreetMap, https://www.openstreetmap.org/copyright",
      abgeleitet: "Abgeleitete Datenbank: power=substation in Österreich mit Spannung ≥ 20 kV, Koordinaten auf 3 Nachkommastellen gerundet, Spannung = höchster Wert aus dem Tag voltage. Erzeugt von Ökovolt Österreich mit scripts/umspannwerke-osm.mjs.",
      shareAlike: "Weitergabe und Bearbeitung nur unter der ODbL 1.0. Download: /daten/umspannwerke-at.json",
      hinweisNutzung: "Orientierung für die Luftlinie zum nächsten Umspannwerk. Keine Aussage über freie Netzkapazität; diese entscheidet der Netzbetreiber. OSM-Daten können unvollständig sein.",
    },
    abruf: abrufDatum,
    felder: { n: "Name laut OSM (null = nicht getaggt)", lat: "Breite WGS84, 3 Stellen", lon: "Länge WGS84, 3 Stellen", kv: "höchste Spannung in kV" },
    anzahl: daten.length,
    umspannwerke: daten,
  };
}

async function main() {
  const arg = process.argv.find((a) => a.startsWith("--aus="));
  let antwort;
  if (arg) {
    antwort = JSON.parse(fs.readFileSync(arg.slice(6), "utf8"));
  } else {
    const r = await fetch(OVERPASS, {
      method: "POST",
      headers: { "User-Agent": USER_AGENT, "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(ABFRAGE),
    });
    if (!r.ok) throw new Error(`Overpass antwortet mit ${r.status}`);
    antwort = await r.json();
  }
  const heute = new Date().toISOString().slice(0, 10);
  const json = aufbereiten(antwort, heute);
  const text = JSON.stringify(json, null, 0).replace(/\},\{/g, "},\n{") + "\n";
  fs.mkdirSync(path.dirname(ZIEL_PUBLIC), { recursive: true });
  fs.writeFileSync(ZIEL_SRC, text);
  fs.writeFileSync(ZIEL_PUBLIC, text);
  console.log(`umspannwerke-at.json: ${json.anzahl} Umspannwerke ≥ 20 kV (Abruf ${heute})`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
