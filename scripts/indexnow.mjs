// scripts/indexnow.mjs
//
// Meldet NEUE und GEÄNDERTE URLs der Live-Sitemap per IndexNow an Bing, Yandex, Seznam, Naver und Yep
// (DuckDuckGo, Ecosia, Yahoo und die ChatGPT-/Copilot-Suche nutzen den Bing-Index). Google nimmt nicht an
// IndexNow teil – dort genügt die Sitemap in der Search Console.
//
// „Geändert“ heißt: <lastmod> der Sitemap weicht vom zuletzt gemeldeten Stand ab. Der Stand liegt in einer
// Zustandsdatei (Standard: scripts/indexnow-zustand.json) und wird NUR für erfolgreich gemeldete URLs
// fortgeschrieben (HTTP 200/202). Vor jeder Meldung wird die Schlüsseldatei geprüft; 404 bricht ab.
// Logik und Statuscode-Behandlung (403/422/429 …): src/lib/indexnow.js.
//
// Aufruf nach jedem Deployment mit neuen oder geänderten Seiten (oder nach einer Presse-Veröffentlichung –
// /presse/<slug> steht mit dem Änderungsdatum aus dem Backoffice in der Sitemap):
//   node scripts/indexnow.mjs --trocken          zeigt nur, was gemeldet würde (keine Meldung, Zustand bleibt)
//   node scripts/indexnow.mjs                    meldet die Änderungen und schreibt den Zustand fort
//   node scripts/indexnow.mjs --nur-zustand      übernimmt den aktuellen Stand ohne Meldung (Ausgangsbasis)
//   node scripts/indexnow.mjs --alle             meldet alle URLs der Sitemap (z. B. nach einem Relaunch)
//   node scripts/indexnow.mjs --entfernte        meldet zusätzlich URLs, die nicht mehr in der Sitemap stehen
//   node scripts/indexnow.mjs https://www.oekovolt.com/schneelast …   nur diese URLs (ohne Zustandsvergleich)
// Weitere Schalter:
//   --sitemap=<url>        andere Sitemap lesen, z. B. http://localhost:3000/sitemap.xml (Trockenlauf lokal)
//   --zustand=<datei>      andere Zustandsdatei
//   --schluessel-url=<url> andere Schlüsseldatei prüfen (nur mit --trocken, zum Testen der Abbruchlogik)
// Exit-Code: 0 = ok, 1 = Abbruch (Schlüssel, 403/422/429, Netz), 2 = falscher Aufruf.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// src/lib/indexnow.js ist ein ES-Modul ohne "type": "module" in package.json (Next-Quelle) – Node lädt es
// korrekt, warnt aber jedes Mal. Nur diese eine Warnung ausblenden, alle anderen bleiben sichtbar.
process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (w?.code !== "MODULE_TYPELESS_PACKAGE_JSON") console.warn(`${w.name}: ${w.message}`);
});
const { INDEXNOW_HOST, INDEXNOW_KEY_LOCATION, IndexNowFehler, aenderungen, melde, nachHost, pruefeSchluessel } = await import("../src/lib/indexnow.js");

const ORDNER = path.dirname(fileURLToPath(import.meta.url));
const STANDARD_SITEMAP = `https://${INDEXNOW_HOST}/sitemap.xml`;
const STANDARD_ZUSTAND = path.join(ORDNER, "indexnow-zustand.json");

function argumente(argv) {
  const o = { schalter: new Set(), werte: {}, urls: [] };
  for (const a of argv) {
    const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
    if (m && m[2] !== undefined) o.werte[m[1]] = m[2];
    else if (m) o.schalter.add(m[1]);
    else o.urls.push(a);
  }
  return o;
}

function hilfeText() {
  const zeilen = fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split(/\r?\n/);
  const ende = zeilen.findIndex((z) => !z.startsWith("//"));
  return zeilen.slice(2, ende).map((z) => z.replace(/^\/\/ ?/, "")).join("\n");
}
const BEKANNT = new Set(["trocken", "dry-run", "nur-zustand", "alle", "entfernte", "hilfe", "help", "sitemap", "zustand", "schluessel-url"]);

const arg = argumente(process.argv.slice(2));
if (arg.schalter.has("hilfe") || arg.schalter.has("help")) {
  console.log(hilfeText());
  process.exit(0);
}
const unbekannt = [...arg.schalter, ...Object.keys(arg.werte)].filter((k) => !BEKANNT.has(k));
if (unbekannt.length) {
  console.error(`Unbekannte Option(en): ${unbekannt.map((k) => `--${k}`).join(", ")} – Hilfe: node scripts/indexnow.mjs --hilfe`);
  process.exit(2);
}

const trocken = arg.schalter.has("trocken") || arg.schalter.has("dry-run");
const nurZustand = arg.schalter.has("nur-zustand");
const alle = arg.schalter.has("alle");
const entfernteMelden = arg.schalter.has("entfernte");
const sitemapUrl = arg.werte.sitemap || STANDARD_SITEMAP;
const zustandsDatei = path.resolve(arg.werte.zustand || STANDARD_ZUSTAND);
const schluesselUrl = arg.werte["schluessel-url"] || INDEXNOW_KEY_LOCATION;

if (schluesselUrl !== INDEXNOW_KEY_LOCATION && !trocken) {
  console.error("--schluessel-url ist nur im Trockenlauf erlaubt – echte Meldungen prüfen immer die öffentliche Schlüsseldatei.");
  process.exit(2);
}

/** url -> lastmod aus einer Sitemap (folgt auch einem Sitemap-Index). */
async function sitemapLesen(url, tiefe = 0) {
  const res = await fetch(url, { headers: { "User-Agent": "oekovolt.com IndexNow" } });
  if (!res.ok) throw new IndexNowFehler(`Sitemap nicht erreichbar: ${url} → HTTP ${res.status}`, { status: res.status });
  const xml = await res.text();
  const eintraege = {};
  if (/<sitemapindex[\s>]/.test(xml) && tiefe < 2) {
    for (const m of xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/g)) Object.assign(eintraege, await sitemapLesen(m[1].trim(), tiefe + 1));
    return eintraege;
  }
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim().replace(/&amp;/g, "&");
    if (!loc) continue;
    eintraege[loc] = m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() || "";
  }
  return eintraege;
}

function zustandLesen() {
  try {
    const z = JSON.parse(fs.readFileSync(zustandsDatei, "utf8"));
    return z && typeof z.urls === "object" ? z : { urls: {} };
  } catch (e) {
    if (e.code !== "ENOENT") console.warn(`Zustandsdatei unlesbar (${e.message}) – behandle alle URLs als neu.`);
    return { urls: {} };
  }
}

function zustandSchreiben(urls) {
  const sortiert = Object.fromEntries(Object.entries(urls).sort(([a], [b]) => a.localeCompare(b)));
  const inhalt = { version: 1, host: INDEXNOW_HOST, sitemap: sitemapUrl, aktualisiert: new Date().toISOString(), urls: sortiert };
  fs.writeFileSync(zustandsDatei, `${JSON.stringify(inhalt, null, 1)}\n`);
}

const liste = (titel, urls, max = 40) => {
  if (!urls.length) return;
  console.log(`${titel} (${urls.length}):`);
  for (const u of urls.slice(0, max)) console.log(`  ${u}`);
  if (urls.length > max) console.log(`  … und ${urls.length - max} weitere`);
};

try {
  const zustand = zustandLesen();
  const vorher = { ...zustand.urls };
  let aktuell = {};
  let zuMelden;

  if (arg.urls.length) {
    // Einzelne URLs: ohne Zustandsvergleich; lastmod aus der Sitemap übernehmen, falls erreichbar
    const sm = await sitemapLesen(sitemapUrl).catch(() => ({}));
    zuMelden = arg.urls;
    aktuell = Object.fromEntries(arg.urls.map((u) => [u, sm[u] ?? vorher[u] ?? ""]));
    console.log(`Einzelmeldung: ${zuMelden.length} URL(s)`);
  } else {
    aktuell = await sitemapLesen(sitemapUrl);
    const d = aenderungen(aktuell, vorher);
    console.log(`Sitemap ${sitemapUrl}: ${Object.keys(aktuell).length} URLs · Zustand: ${Object.keys(vorher).length} URLs${fs.existsSync(zustandsDatei) ? "" : " (keine Zustandsdatei – erster Lauf)"}`);
    liste("Neu", d.neu);
    liste("Geändert (lastmod)", d.geaendert);
    liste(entfernteMelden ? "Entfernt (wird gemeldet)" : "Nicht mehr in der Sitemap (nicht gemeldet, Zustand bleibt – melden mit --entfernte)", d.entfernt, 20);
    zuMelden = alle ? Object.keys(aktuell) : [...d.neu, ...d.geaendert, ...(entfernteMelden ? d.entfernt : [])];
  }

  const { gueltig, fremd } = nachHost(zuMelden);
  liste(`Nicht ${INDEXNOW_HOST} (übersprungen)`, fremd, 10);

  if (nurZustand) {
    if (trocken) {
      console.log(`Trockenlauf: Zustand würde auf ${Object.keys(aktuell).length} URLs gesetzt, nichts gemeldet.`);
    } else {
      zustandSchreiben({ ...vorher, ...aktuell });
      console.log(`Zustand gespeichert (${zustandsDatei}), nichts gemeldet.`);
    }
    process.exit(0);
  }

  if (!gueltig.length) {
    console.log("Keine Änderungen – nichts zu melden.");
    process.exit(0);
  }

  // Schlüssel auch im Trockenlauf prüfen (nur lesend) – bricht bei 404/falschem Inhalt ab
  const k = await pruefeSchluessel({ url: schluesselUrl });
  console.log(`Schlüsseldatei ok: ${k.url} (HTTP ${k.status})`);

  if (trocken) {
    console.log(`Trockenlauf: ${gueltig.length} URL(s) würden gemeldet. Keine Meldung, Zustand unverändert.`);
    process.exit(0);
  }

  let gemeldet = [];
  try {
    ({ gemeldet } = await melde(gueltig, { log: (t) => console.log(t) }));
  } catch (e) {
    gemeldet = e.gemeldet || [];
    throw e;
  } finally {
    if (gemeldet.length) {
      const neu = { ...vorher };
      for (const u of gemeldet) {
        if (u in aktuell) neu[u] = aktuell[u];
        else delete neu[u]; // gemeldete entfernte URL
      }
      zustandSchreiben(neu);
      console.log(`Zustand fortgeschrieben: ${gemeldet.length} URL(s) (${zustandsDatei})`);
    }
  }
  console.log(`Fertig: ${gemeldet.length} URL(s) gemeldet.`);
} catch (e) {
  console.error(e instanceof IndexNowFehler ? e.message : `Fehler: ${e?.stack || e}`);
  process.exit(1);
}
