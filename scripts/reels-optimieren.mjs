#!/usr/bin/env node
/**
 * Reels für die Mediathek aufbereiten (selbst gehostet, keine Verbindung zu Facebook).
 *
 *   node scripts/reels-optimieren.mjs          neue/geänderte Rohdateien verarbeiten
 *   node scripts/reels-optimieren.mjs --neu    alle Rohdateien neu kodieren
 *
 * MUSIKRECHTE: Musik aus der Facebook-/Instagram-Musikbibliothek ist nur auf Meta-Plattformen lizenziert –
 * solche Reels NICHT auf der Website verwenden (nur eigener Ton, Sprache oder lizenzfreie Musik mit Nachweis).
 *
 * Ablauf:
 *   1. Rohdateien (.mp4, .mov, .m4v) aus reels-roh/ (Projektstamm, nicht im Git) lesen –
 *      z. B. als Seitenadmin aus der Meta Business Suite heruntergeladen.
 *   2. Mit ffmpeg web-taugliche H.264-MP4 erzeugen: max. 720×1280, CRF 28, AAC 96 kbit/s, +faststart
 *      → public/videos/reels/<slug>.mp4
 *   3. Vorschaubild (Bild bei 1 s) → public/videos/reels/<slug>.jpg
 *   4. Optionale Untertitel reels-roh/<name>.vtt → public/videos/reels/<slug>.vtt
 *   5. Dauer per ffprobe ermitteln und src/data/reels.js (Block zwischen REELS-START/REELS-ENDE) aktualisieren:
 *      vorhandene Angaben (Titel, Beschreibung, Kategorie, Datum) bleiben erhalten, neue Videos bekommen den
 *      Dateinamen als Titel und das Änderungsdatum der Rohdatei als Datum.
 *
 * Voraussetzung: ffmpeg + ffprobe im PATH (Windows: winget install Gyan.FFmpeg).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const STAMM = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROH = path.join(STAMM, "reels-roh");
const ZIEL = path.join(STAMM, "public", "videos", "reels");
const DATEN = path.join(STAMM, "src", "data", "reels.js");
const WEB = "/videos/reels";
const ALLE_NEU = process.argv.includes("--neu");

function abbruch(text) {
  console.error(`\n✖ ${text}\n`);
  process.exit(1);
}

function werkzeugDa(name) {
  const r = spawnSync(name, ["-version"], { encoding: "utf8" });
  return !r.error && r.status === 0;
}

function lauf(befehl, args) {
  const r = spawnSync(befehl, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (r.error || r.status !== 0) {
    throw new Error(`${befehl} ${args.join(" ")}\n${(r.stderr || String(r.error)).split("\n").slice(-12).join("\n")}`);
  }
  return r.stdout;
}

/** „Agri-PV Montage Innviertel (1).MP4“ → „agri-pv-montage-innviertel-1“ */
function slugAus(name) {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titelAus(name) {
  const t = name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const isoDatum = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// ------------------------------------------------------------------ Daten lesen/schreiben

const START = "// REELS-START";
const ENDE = "// REELS-ENDE";

function datenLesen() {
  const quelle = fs.readFileSync(DATEN, "utf8");
  const a = quelle.indexOf(START);
  const e = quelle.indexOf(ENDE);
  if (a < 0 || e < a) abbruch(`Markierungen „${START}“ / „${ENDE}“ in src/data/reels.js nicht gefunden.`);
  const block = quelle.slice(a, e);
  const auf = block.indexOf("[");
  const zu = block.lastIndexOf("]");
  let liste = [];
  try {
    liste = new Function(`return ${block.slice(auf, zu + 1)};`)();
  } catch (err) {
    abbruch(`REELS in src/data/reels.js konnte nicht gelesen werden: ${err.message}`);
  }
  return { quelle, a, e, liste };
}

const FELDER = ["slug", "titel", "beschreibung", "kategorie", "datum", "dauerSek", "datei", "poster", "untertitel"];

function eintragJs(r) {
  const zeilen = FELDER.filter((f) => r[f] !== undefined && r[f] !== null).map((f) => `    ${f}: ${JSON.stringify(r[f])},`);
  return `  {\n${zeilen.join("\n")}\n  },`;
}

function datenSchreiben({ quelle, a, e }, liste) {
  const sortiert = [...liste].sort((x, y) => String(y.datum).localeCompare(String(x.datum)));
  const block = [
    `${START} – dieser Block wird von scripts/reels-optimieren.mjs aktualisiert`,
    "export const REELS = [",
    '  // { slug: "agri-pv-montage-innviertel", titel: "…", beschreibung: "…", kategorie: "Baustelle", datum: "2026-09-30", dauerSek: 42, datei: "/videos/reels/agri-pv-montage-innviertel.mp4", poster: "/videos/reels/agri-pv-montage-innviertel.jpg" },',
    ...sortiert.map(eintragJs),
    "];",
    "",
  ].join("\n");
  fs.writeFileSync(DATEN, quelle.slice(0, a) + block + quelle.slice(e), "utf8");
}

// ------------------------------------------------------------------ Ablauf

if (!werkzeugDa("ffmpeg") || !werkzeugDa("ffprobe")) {
  abbruch(
    [
      "ffmpeg/ffprobe wurde nicht gefunden.",
      "",
      "  Installation unter Windows (PowerShell):   winget install Gyan.FFmpeg",
      "  macOS: brew install ffmpeg  ·  Linux: sudo apt install ffmpeg",
      "",
      "Danach ein NEUES Terminal öffnen (damit PATH aktualisiert ist) und das Skript erneut starten:",
      "  node scripts/reels-optimieren.mjs",
    ].join("\n")
  );
}

if (!fs.existsSync(ROH)) {
  fs.mkdirSync(ROH, { recursive: true });
  abbruch(`Ordner reels-roh/ wurde angelegt (${ROH}). Rohdateien (.mp4/.mov) hineinlegen und erneut starten.`);
}
fs.mkdirSync(ZIEL, { recursive: true });

const rohdateien = fs
  .readdirSync(ROH)
  .filter((n) => /\.(mp4|mov|m4v)$/i.test(n))
  .sort();
if (rohdateien.length === 0) abbruch("In reels-roh/ liegen keine .mp4-/.mov-Dateien.");

const daten = datenLesen();
const nachSlug = new Map(daten.liste.map((r) => [r.slug, r]));
const bericht = [];

for (const datei of rohdateien) {
  const basis = datei.replace(/\.[^.]+$/, "");
  const slug = slugAus(basis);
  if (!slug) {
    console.warn(`⚠ Übersprungen (kein gültiger Name): ${datei}`);
    continue;
  }
  const quelle = path.join(ROH, datei);
  const mp4 = path.join(ZIEL, `${slug}.mp4`);
  const jpg = path.join(ZIEL, `${slug}.jpg`);
  const stat = fs.statSync(quelle);
  const aktuell = fs.existsSync(mp4) && fs.statSync(mp4).mtimeMs >= stat.mtimeMs && fs.existsSync(jpg);

  try {
    if (ALLE_NEU || !aktuell) {
      process.stdout.write(`▶ ${datei} → ${WEB}/${slug}.mp4 … `);
      lauf("ffmpeg", [
        "-y", "-hide_banner", "-loglevel", "error",
        "-i", quelle,
        "-map", "0:v:0", "-map", "0:a:0?",
        // in 720×1280 einpassen, nie hochskalieren, gerade Kantenlängen für H.264
        "-vf", "scale='min(720,iw)':'min(1280,ih)':force_original_aspect_ratio=decrease,scale=trunc(iw/2)*2:trunc(ih/2)*2",
        "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "96k", "-ac", "2",
        "-movflags", "+faststart",
        mp4,
      ]);
      try {
        lauf("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-ss", "1", "-i", mp4, "-frames:v", "1", "-q:v", "3", jpg]);
      } catch {
        /* Video kürzer als 1 s */
      }
      if (!fs.existsSync(jpg) || fs.statSync(jpg).size === 0) {
        lauf("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", mp4, "-frames:v", "1", "-q:v", "3", jpg]);
      }
      console.log("fertig");
    } else {
      console.log(`✓ ${datei} ist aktuell`);
    }

    const dauer = Number.parseFloat(lauf("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", mp4]).trim());

    const vttRoh = path.join(ROH, `${basis}.vtt`);
    let untertitel;
    if (fs.existsSync(vttRoh)) {
      fs.copyFileSync(vttRoh, path.join(ZIEL, `${slug}.vtt`));
      untertitel = `${WEB}/${slug}.vtt`;
    } else if (fs.existsSync(path.join(ZIEL, `${slug}.vtt`))) {
      untertitel = `${WEB}/${slug}.vtt`;
    }

    const alt = nachSlug.get(slug);
    const neu = {
      slug,
      titel: alt?.titel || titelAus(basis),
      beschreibung: alt?.beschreibung ?? "",
      kategorie: alt?.kategorie ?? "",
      datum: alt?.datum || isoDatum(stat.mtime),
      dauerSek: Number.isFinite(dauer) ? Math.round(dauer) : alt?.dauerSek,
      datei: `${WEB}/${slug}.mp4`,
      poster: `${WEB}/${slug}.jpg`,
      ...(untertitel ? { untertitel } : {}),
    };
    nachSlug.set(slug, { ...alt, ...neu });
    const mb = (fs.statSync(mp4).size / 1024 / 1024).toFixed(1);
    bericht.push(`${alt ? "aktualisiert" : "NEU"}  ${slug}  (${Math.round(dauer)} s, ${mb} MB)`);
  } catch (err) {
    console.error(`\n✖ Fehler bei ${datei}:\n${err.message}`);
  }
}

datenSchreiben(daten, [...nachSlug.values()]);

console.log(`\nsrc/data/reels.js aktualisiert:\n  ${bericht.join("\n  ")}`);
const offen = [...nachSlug.values()].filter((r) => !r.beschreibung || !r.kategorie);
if (offen.length) {
  console.log(`\nBitte ergänzen (Beschreibung/Kategorie – wichtig für die Google-Videosuche):\n  ${offen.map((r) => r.slug).join("\n  ")}`);
}
console.log("\nKategorien: Baustelle, Projekte, Technik, Team, Events");
