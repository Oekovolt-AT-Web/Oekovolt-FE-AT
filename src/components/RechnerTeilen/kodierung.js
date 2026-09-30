// Reine Hilfsfunktionen für „Ergebnis teilen“ und den Druckbericht der Gewerbe-Rechner.
// Ohne React und ohne Pfad-Aliase – mit node testbar (scripts/rechner-teilen.test.mjs).
//
// Feldbeschreibung (Reihenfolge = Reihenfolge im Link):
//   { name: "flaeche", k: "f", typ: "zahl", min: 200, max: 20000, raster: 100, standard: 6000 }
//   { name: "dachart", k: "d", typ: "wahl", optionen: ["ost-west", "sued"], standard: "ost-west" }
//   { name: "eag",     k: "eg", typ: "bool", standard: true }
// `standard: null` bei Zahlen heißt „automatisch“ (z. B. Richtwert statt eigener Eingabe):
// null steht nicht im Link, jede Zahl schon. Ist der Standard eine Zahl und der Wert null,
// steht der Schlüssel leer im Link („k=“) und wird wieder zu null.
//
// Im Link stehen nur Werte, die vom Startzustand abweichen – der Link bleibt kurz.
// Keine Namen, keine Firmendaten, keine Ergebnisse: Die Seite rechnet beim Öffnen selbst.

const KEY = /^[a-z][a-z0-9]{0,3}$/;

/** Gleitkomma-Reste entfernen (0,1 × 3 = 0,30000000000000004). */
const glatt = (n) => Math.round(n * 1e4) / 1e4;

/** Zahl auf Raster und Grenzen bringen; ungültig → null. */
export function rasterZahl(roh, { min = -Infinity, max = Infinity, raster = 0 } = {}) {
  if (roh === null || roh === undefined || roh === "") return null;
  const n = typeof roh === "number" ? roh : Number(String(roh).replace(",", "."));
  if (!Number.isFinite(n)) return null;
  const r = raster > 0 ? Math.round(n / raster) * raster : n;
  return glatt(Math.min(max, Math.max(min, r)));
}

const gleich = (a, b) => (typeof a === "number" && typeof b === "number" ? Math.abs(a - b) < 1e-9 : a === b);

function alsText(feld, wert) {
  if (feld.typ === "bool") return wert ? "1" : "0";
  if (feld.typ === "zahl") return String(glatt(wert));
  return String(wert);
}

/** Prüft die Feldliste (Schlüssel eindeutig, kurz, klein). Wirft bei Fehlern – nur für Tests/Entwicklung. */
export function pruefeFelder(felder) {
  const gesehen = new Set();
  for (const f of felder) {
    if (!KEY.test(f.k)) throw new Error(`Ungültiger Schlüssel „${f.k}“`);
    if (gesehen.has(f.k)) throw new Error(`Schlüssel „${f.k}“ doppelt`);
    gesehen.add(f.k);
    if (!["zahl", "wahl", "bool"].includes(f.typ)) throw new Error(`Unbekannter Typ „${f.typ}“`);
  }
  return true;
}

/**
 * Eingaben → kurze Query (ohne „?“). Nur abweichende Werte.
 * @param {Array} felder  Feldbeschreibungen
 * @param {Object} werte  aktuelle Eingaben { name: wert }
 */
export function kodiere(felder, werte) {
  const q = new URLSearchParams();
  for (const f of felder) {
    const v = werte[f.name];
    if (v === undefined) continue;
    if (f.typ === "zahl") {
      if (v === null) {
        if (f.standard !== null && f.standard !== undefined) q.set(f.k, "");
        continue;
      }
      if (!Number.isFinite(v)) continue;
    }
    if (f.typ === "wahl" && !f.optionen.includes(v)) continue;
    const std = f.typ === "bool" ? Boolean(f.standard) : f.standard;
    const wert = f.typ === "bool" ? Boolean(v) : v;
    if (gleich(wert, std)) continue;
    q.set(f.k, alsText(f, wert));
  }
  return q.toString();
}

/**
 * Query → gültige Eingaben. Nur Felder, die im Link stehen und gültig sind.
 * @param {Array} felder
 * @param {(k: string) => string|null} lesen  z. B. (k) => new URLSearchParams(location.search).get(k)
 * @returns {Object|null} { name: wert } oder null, wenn nichts Passendes im Link steht
 */
export function dekodiere(felder, lesen) {
  const out = {};
  let n = 0;
  for (const f of felder) {
    const roh = lesen(f.k);
    if (roh === null || roh === undefined) continue;
    let wert;
    if (f.typ === "zahl") {
      // leer = „automatisch“ (nur sinnvoll bei Feldern, die null annehmen können)
      if (roh === "") wert = null;
      else {
        wert = rasterZahl(roh, f);
        if (wert === null) continue;
      }
    } else if (f.typ === "bool") {
      if (roh !== "1" && roh !== "0") continue;
      wert = roh === "1";
    } else {
      const s = String(roh);
      if (!f.optionen.includes(s)) continue;
      wert = s;
    }
    out[f.name] = wert;
    n++;
  }
  return n > 0 ? out : null;
}

/** Vollständiger Link. Ohne Query nur der Pfad (= Startwerte). */
export function teilenLink(basis, pfad, query) {
  const b = String(basis || "").replace(/\/+$/, "");
  return query ? `${b}${pfad}?${query}` : `${b}${pfad}`;
}

const zwei = (n) => String(n).padStart(2, "0");

/** 30.09.2026 – ohne Intl, überall gleich. */
export function datumText(d = new Date()) {
  return `${zwei(d.getDate())}.${zwei(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/** 30.09.2026, 14:05 Uhr */
export function zeitpunktText(d = new Date()) {
  return `${datumText(d)}, ${zwei(d.getHours())}:${zwei(d.getMinutes())} Uhr`;
}

/** Dateiname-tauglicher Titel für den Druckdialog („Als PDF speichern“ übernimmt document.title). */
export function dokumentTitel(rechnerName, d = new Date()) {
  const name = String(rechnerName || "Rechner")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `Ökovolt ${name} – Ergebnis ${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;
}

/** Kennung des Teilen-Wegs für die Statistik aus Knopf-Beschriftung („Auf LinkedIn teilen“ → „linkedin“). */
export function wegAus(beschriftung) {
  const s = String(beschriftung || "")
    .toLowerCase()
    .replace(/^auf\s+|^per\s+/, "")
    .replace(/\s+teilen$/, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return s.slice(0, 30) || "unbekannt";
}

/**
 * Bericht bereinigen: leere Zeilen entfernen, Werte in Text wandeln.
 * Zeilen als [label, wert] oder [label, wert, zusatz]; falsy-Zeilen werden übersprungen.
 */
export function berichtBereinigen(b = {}) {
  const zeilen = (liste) =>
    (liste || [])
      .filter((z) => Array.isArray(z) && z[0] && z[1] !== undefined && z[1] !== null && z[1] !== "")
      .map(([l, w, z]) => [String(l), String(w), z ? String(z) : ""]);
  const gruppen = (liste) =>
    (liste || [])
      .filter(Boolean)
      .map((g) => ({ titel: g.titel ? String(g.titel) : "", zeilen: zeilen(g.zeilen) }))
      .filter((g) => g.zeilen.length > 0);
  return {
    rechner: String(b.rechner || ""),
    titel: String(b.titel || ""),
    untertitel: b.untertitel ? String(b.untertitel) : "",
    kennzahlen: zeilen(b.kennzahlen).slice(0, 4),
    eingaben: gruppen(b.eingaben),
    ergebnisse: gruppen(b.ergebnisse),
    annahmen: (b.annahmen || []).filter(Boolean).map(String),
    hinweise: (b.hinweise || []).filter(Boolean).map(String),
  };
}
