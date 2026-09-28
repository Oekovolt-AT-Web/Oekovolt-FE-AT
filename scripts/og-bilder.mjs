// Erzeugt Social-Media-Vorschaubilder (1200×630, < 200 KB) für
//   – alle ganzjährigen Stellen  -> public/og/jobs/<slug>.jpg
//   – alle Ratgeber-Artikel      -> public/og/ratgeber/<slug>.jpg
// Aufruf: node scripts/og-bilder.mjs
// Nach neuen Stellen oder Artikeln (bzw. geänderten Titeln/Bildern) neu ausführen.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const B = 1200;
const H = 630;
const GRUEN = "#8cc152";
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function umbrechen(text, max) {
  const zeilen = [];
  let z = "";
  for (const wort of text.split(" ")) {
    if ((z + " " + wort).trim().length > max && z) {
      zeilen.push(z);
      z = wort;
    } else z = (z + " " + wort).trim();
  }
  if (z) zeilen.push(z);
  return zeilen;
}

const cache = new Map();
async function hintergrund(rel) {
  if (!cache.has(rel)) {
    cache.set(rel, await sharp(path.join(ROOT, "public", decodeURI(rel.replace(/^\//, "")))).resize(B, H, { fit: "cover", position: "attention" }).toBuffer());
  }
  return cache.get(rel);
}

const logo = await sharp(path.join(ROOT, "public/Logo-Oekovolt-Gruen-mit-Weiss.webp")).resize({ height: 58 }).png().toBuffer();

async function karte({ bild, eyebrow, titel, unterzeile, fussLinks, fussRechts, datei }) {
  let groesse = 68;
  let zeilen = umbrechen(titel, 23);
  if (zeilen.length > 3) {
    groesse = 54;
    zeilen = umbrechen(titel, 30);
  }
  if (zeilen.length > 3) zeilen = [...zeilen.slice(0, 2), zeilen.slice(2).join(" ").replace(/^(.{0,27}).*$/, "$1…")];
  const zh = Math.round(groesse * 1.14);
  const start = 262 + (3 - zeilen.length) * 26;

  const svg = `<svg width="${B}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="v" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#020b1f" stop-opacity="0.97"/>
      <stop offset="0.55" stop-color="#020b1f" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#020b1f" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="${B}" height="${H}" fill="url(#v)"/>
  <rect x="0" y="${H - 10}" width="${B}" height="10" fill="#669933"/>
  <g font-family="${FONT}">
    <rect x="72" y="168" width="14" height="14" rx="7" fill="${GRUEN}"/>
    <text x="98" y="181" font-size="22" font-weight="700" letter-spacing="3.5" fill="${GRUEN}">${esc(eyebrow.toUpperCase())}</text>
    ${zeilen.map((z, i) => `<text x="70" y="${start + i * zh}" font-size="${groesse}" font-weight="800" fill="#ffffff">${esc(z)}</text>`).join("\n    ")}
    ${unterzeile ? `<text x="72" y="${H - 108}" font-size="28" font-weight="600" fill="#ffffff" fill-opacity="0.82">${esc(unterzeile)}</text>` : ""}
    <text x="72" y="${H - 62}" font-size="24" font-weight="600" fill="${GRUEN}">${esc(fussLinks)}</text>
    <text x="${B - 72}" y="${H - 62}" font-size="22" font-weight="600" text-anchor="end" fill="#ffffff" fill-opacity="0.7">${esc(fussRechts)}</text>
  </g>
</svg>`;

  await sharp(await hintergrund(bild))
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: logo, top: 64, left: 70 },
    ])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(datei);
}

// ---------- Stellen ----------
const { STELLEN } = await import(pathToFileURL(path.join(ROOT, "src/data/stellen.js")).href);
const MOTIV = {
  "Planung & Engineering": "/Images/Team/in-diverse-workspace-project-manager-presents-eco-2025-01-08-23-29-22-utc-1.jpg",
  "Elektrotechnik & Meister": "/Images/Jobs/jobs2.jpg",
  "Automatisierung & Software": "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg",
  "IT-Sicherheit, Daten & KI": "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-02-11-14-15-57-utc.jpg",
  "Energiehandel & Klima": "/Images/Jobs/download.jpg",
  "Recht & Compliance": "/Images/Team/download.jpg",
  Finanzen: "/Images/Team/download.jpg",
  "Montage & Service": "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg",
  Vertrieb: "/Images/Jobs/jobs1.jpg",
};
fs.mkdirSync(path.join(ROOT, "public/og/jobs"), { recursive: true });
for (const s of STELLEN) {
  await karte({
    bild: MOTIV[s.bereich] || "/Images/Jobs/jobs4.jpg",
    eyebrow: "Wir suchen · ganzjährig",
    titel: `${s.kurz} (m/w/d)`,
    unterzeile: [s.ort, s.anstellung].filter(Boolean).join("  ·  "),
    fussLinks: "oekovolt.com/jobs",
    fussRechts: s.bereich,
    datei: path.join(ROOT, "public/og/jobs", `${s.slug}.jpg`),
  });
}

// ---------- Ratgeber ----------
// Artikel-Module nutzen @/-Importe und lassen sich nicht direkt laden – Kopfdaten per Regex.
const feld = (t, k, einzug = "  ") => (t.match(new RegExp(`\\n${einzug}${k}:\\s*"([^"]+)"`)) || [])[1] || "";
const artikel = [];
const dir = path.join(ROOT, "src/content/ratgeber");
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".js") && f !== "index.js" && !f.startsWith("_"))) {
  const t = fs.readFileSync(path.join(dir, f), "utf8");
  artikel.push({ slug: f.slice(0, -3), title: feld(t, "title"), kategorie: feld(t, "kategorie"), bild: feld(t, "bild") });
}
const lib = fs.readFileSync(path.join(ROOT, "src/lib/ratgeber.js"), "utf8");
for (const block of lib.split(/\n  \{/).slice(1)) {
  const slug = feld(block, "slug", "    ");
  if (slug && feld(block, "bild", "    ")) {
    artikel.push({ slug, title: feld(block, "title", "    "), kategorie: feld(block, "kategorie", "    "), bild: feld(block, "bild", "    ") });
  }
}
fs.mkdirSync(path.join(ROOT, "public/og/ratgeber"), { recursive: true });
for (const a of artikel) {
  if (!a.title || !a.bild) {
    console.warn("übersprungen (Titel/Bild fehlt):", a.slug);
    continue;
  }
  await karte({
    bild: a.bild,
    eyebrow: `Ratgeber · ${a.kategorie}`,
    titel: a.title,
    fussLinks: "oekovolt.com/ratgeber",
    fussRechts: "Fachbetrieb für Photovoltaik",
    datei: path.join(ROOT, "public/og/ratgeber", `${a.slug}.jpg`),
  });
}

console.log(`${STELLEN.length} Stellen- und ${artikel.length} Ratgeber-Vorschaubilder erzeugt (public/og/).`);
