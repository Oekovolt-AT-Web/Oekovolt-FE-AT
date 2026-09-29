// Tests für den statischen Projekt-Fallback (src/data/projekte.js + src/components/Project/ladeProjekte.js).
//
// Aufruf: node scripts/projekte-fallback.test.mjs          (offline, Slugs aus dem Stand vom 30.09.2026)
//         node scripts/projekte-fallback.test.mjs --live   (zusätzlich: Slugs frisch aus https://www.oekovolt.com/sitemap.xml)
// Ohne Abhängigkeiten (node:test, node:assert, module.registerHooks für den Alias "@/").
//
// Geprüft wird:
//  - ohne API-Zugang (keine Env-Variablen) und mit API, die leer / fehlerhaft / nicht erreichbar ist,
//    liefert ladeProjekte() den statischen Stand;
//  - jeder bisherige Live-Slug löst wie auf der Detailseite auf, generateSlug(projekt_name) und
//    projektSlug() ergeben exakt den Slug, ladeProjektRoh() liefert das Projekt samt Bildern;
//  - liefert die API Projekte, gewinnt die API (statischer Stand wird ignoriert).

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const DIESE_DATEI = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(DIESE_DATEI), "..");
const SRC = path.join(ROOT, "src");

// "@/lib/x" -> src/lib/x.js (wie jsconfig paths), "./x" ohne Endung -> "./x.js" (wie der Next-Bundler)
registerHooks({
  resolve(spezifizierer, kontext, weiter) {
    if (spezifizierer.startsWith("@/")) {
      let ziel = path.join(SRC, spezifizierer.slice(2));
      if (!path.extname(ziel)) ziel += ".js";
      return weiter(pathToFileURL(ziel).href, kontext);
    }
    if (/^\.\.?\//.test(spezifizierer) && !path.extname(spezifizierer) && kontext.parentURL?.startsWith(pathToFileURL(SRC).href)) {
      return weiter(`${spezifizierer}.js`, kontext);
    }
    return weiter(spezifizierer, kontext);
  },
});

// Stand der Live-Sitemap vom 30.09.2026 (58 Projekt-URLs /referenzen/projekte/<slug>)
const LIVE_SLUGS = [
  "alpla-werke-alwin-lehner-gmbh-co-kg", "aumayr-gmbh", "andritz-fabrics-and-rolls-gmbh",
  "austria-card-plastikkarten-und-ausweissysteme-gmbh", "br-industrial-automation-gmbh",
  "dmh-dichtungs-maschinenhandel-gmbh-sampo-gmbh", "f-list-gmbh", "gs-altotec-gmbh",
  "haba-beton-johann-bartlechner-gmbh-co-kg", "herba-chemosan-apotheker-ag", "herbert-handlos-gmbh-pregarten",
  "herbert-handlos-gmbh-summerau", "holz-reisecker-gmbh", "nemetz-fleischhandels-gmbh", "neuschmied-holz-gmbh",
  "penn-gmbh", "saege-hobelwerk-soellinger-gesmbh", "sp-verpackungen-gmbh", "spar-ingrid-teufelberger",
  "sporthotel-brixen-gmbh-co-kg", "stahl-hacksteiner-metall-gmbh", "stallinger-holding-gmbh", "stauss-perlite-gmbh",
  "steinbacher-daemmstoff-gmbh", "thermoplastkreislauf-gmbh", "tomandl-gattinger-gesellschaft-mbh-cokg",
  "transdanubia-speditionsgesellschaft-mbh-pasching", "wieser-holz-gmbh", "wuerth-handelsgesmbh",
  "ziegler-stahlbau-gmbh", "sunpor-kunststoff-gmbh", "stein-co-gmbh", "spitzschuh-maschinenbau-gesellschaft-mbh",
  "hammerer-aluminium-industries-holding-gmbh", "gms-gourmet-gmbh", "gerhard-rauch-gmbh", "gebrueder-woerle-gesmbh",
  "gs-georg-stemeseder-gmbh", "g-eins-immobilien-gmbh", "fuschl-am-see-betriebs-gmbh", "franz-hauer-gmbh-co-kg",
  "fischer-parkett-gmbh-co-kg", "fill-gmbh", "felbermayer-fenster-tueren-erzeugungs-gmbh", "fs-agrar-gmbh",
  "dgt-duscher-galvanotechnik-gmbh", "destalles-autohandels-und-reparatur-gmbh", "campingwelt-brixen-im-thale",
  "braunegger-kg", "biomontan-produktions-und-handels-gmbh", "baumgartner-metallbau-gmbh",
  "baumaerkte-a-sochor-co-gmbh", "austyrol-daemmstoffe-gmbh", "aug-rath-jun-gmbh",
  "astral-handelsgesellschaft-gmbh", "ah-weichselbaumer-gmbh", "ac-auto-vertrieb-und-service-gmbh", "4you-store-gmbh",
];

// Die Fehler-Logs der Ladefunktionen sind in den Fehlerszenarien erwartet – nur mit DEBUG=1 anzeigen.
if (!process.env.DEBUG) console.error = () => {};

const MODUS = process.env.PROJEKTE_TEST_MODUS || "haupt"; // "haupt" = API konfiguriert (Fetch gestubbt), "ohne-env" = keine Zugangsdaten
if (MODUS === "haupt") {
  process.env.SERVER = "https://backoffice.test";
  process.env.API_KEY = "test";
  process.env.API_SECRET = "test";
} else {
  delete process.env.API_KEY;
  delete process.env.API_SECRET;
}

const { ladeProjekte, ladeProjekteRoh, ladeProjektRoh, ladeProjektListe } = await import(pathToFileURL(path.join(SRC, "components/Project/ladeProjekte.js")).href);
const { projektSlug, kennzahlen } = await import(pathToFileURL(path.join(SRC, "components/Project/projektDaten.js")).href);
const { generateSlug } = await import(pathToFileURL(path.join(SRC, "lib/slugify.js")).href);
const { PROJEKTE } = await import(pathToFileURL(path.join(SRC, "data/projekte.js")).href);

// erlaubte Bild-Hosts aus next.config.mjs (images.remotePatterns)
const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.mjs"), "utf8");
const ERLAUBTE_HOSTS = [...nextConfig.matchAll(/hostname:\s*["']([^"']+)["']/g)].map((m) => m[1]);

let liveCache = null;
async function liveSlugs() {
  if (!process.argv.includes("--live")) return LIVE_SLUGS;
  if (!liveCache) {
    const xml = await (await fetch("https://www.oekovolt.com/sitemap.xml")).text();
    liveCache = [...xml.matchAll(/<loc>https:\/\/www\.oekovolt\.com\/referenzen\/projekte\/([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.ok(liveCache.length > 0, "Live-Sitemap ohne Projekt-URLs");
  }
  return liveCache;
}

// Fetch-Stub: antwortet für get_projekte / get_projekt nach Vorgabe
const echterFetch = globalThis.fetch;
function stubFetch(antwort) {
  globalThis.fetch = async (url, opt) => {
    const u = String(url);
    if (!u.includes("oekovolt_app.website_api.projekte.")) return echterFetch(url, opt);
    if (antwort === "netzfehler") throw new TypeError("fetch failed");
    if (typeof antwort === "number") return new Response("Fehler", { status: antwort });
    return new Response(JSON.stringify(antwort(u)), { status: 200, headers: { "Content-Type": "application/json" } });
  };
}

/** Auflösung wie in src/app/referenzen/projekte/[title]/page.js (ladeProjektFuerUrl) */
async function loese(slug) {
  const roh = await ladeProjekteRoh();
  const treffer = roh.find((p) => projektSlug(p) === slug) || roh.find((p) => p.projekt_website_name === slug);
  if (!treffer) return null;
  const detail = (await ladeProjektRoh(treffer.projekt_website_name)) || treffer;
  return { treffer, detail };
}

if (MODUS === "ohne-env") {
  test("ohne API-Zugangsdaten: statischer Stand, jeder Live-Slug löst auf", async () => {
    const liste = await ladeProjektListe();
    assert.equal(liste.quelle, "statisch");
    const slugs = await liveSlugs();
    for (const slug of slugs) {
      const r = await loese(slug);
      assert.ok(r, `Slug nicht auflösbar: ${slug}`);
      assert.equal(projektSlug(r.detail), slug);
    }
  });
} else {
  test("statische Daten: Slugs, Pflichtfelder, Bild-Hosts", () => {
    assert.ok(PROJEKTE.length > 0);
    const gesehen = new Set();
    for (const p of PROJEKTE) {
      const slug = generateSlug(p.projekt_name);
      assert.equal(slug, p.projekt_website_name, `generateSlug(${p.projekt_name}) ≠ projekt_website_name`);
      assert.equal(projektSlug(p), slug);
      assert.ok(!gesehen.has(slug), `doppelter Slug ${slug}`);
      gesehen.add(slug);
      assert.ok(p.leistung == null || (typeof p.leistung === "number" && p.leistung > 0), `${slug}: leistung`);
      assert.ok(["", "Gewerbe", "Landwirtschaft", "Einfamilienhaus"].includes(p.objekt), `${slug}: objekt`);
      assert.equal(p.modified, "2026-09-30");
      assert.ok(Array.isArray(p.bilder));
      for (const b of [{ bild_url: p.bild_url }, ...p.bilder].filter((b) => b.bild_url)) {
        const u = new URL(b.bild_url);
        assert.equal(u.protocol, "https:");
        assert.ok(ERLAUBTE_HOSTS.includes(u.hostname), `${slug}: Bild-Host ${u.hostname} nicht in remotePatterns`);
        assert.equal(encodeURI(decodeURI(b.bild_url)), encodeURI(b.bild_url), `${slug}: Bild-URL darf nicht vorab kodiert sein`);
      }
      if (p.bilder.length) assert.equal(p.bild_url, p.bilder[0].bild_url);
    }
  });

  test("jeder Live-Slug ist im statischen Stand enthalten (und umgekehrt)", async () => {
    const slugs = await liveSlugs();
    const statisch = new Set(PROJEKTE.map((p) => p.projekt_website_name));
    const fehlt = slugs.filter((s) => !statisch.has(s));
    assert.deepEqual(fehlt, [], `nicht auflösbar: ${fehlt.join(", ")}`);
    const zusaetzlich = [...statisch].filter((s) => !slugs.includes(s));
    assert.deepEqual(zusaetzlich, [], `nicht in der Live-Sitemap: ${zusaetzlich.join(", ")}`);
  });

  for (const [name, antwort] of [
    ["API liefert leere Liste", () => ({ message: { projekte: [], anzahl: 0, summe_kwp: 0 } })],
    ["API liefert message = []", () => ({ message: [] })],
    ["API antwortet mit HTTP 500", 500],
    ["API nicht erreichbar", "netzfehler"],
  ]) {
    test(`${name}: statischer Stand, jeder Live-Slug löst auf`, async () => {
      stubFetch(antwort);
      try {
        const liste = await ladeProjektListe();
        assert.equal(liste.quelle, "statisch");
        assert.equal(liste.anzahl, PROJEKTE.length);
        const normal = await ladeProjekte();
        assert.equal(normal.length, PROJEKTE.length);
        for (const slug of await liveSlugs()) {
          const r = await loese(slug);
          assert.ok(r, `Slug nicht auflösbar: ${slug}`);
          assert.equal(projektSlug(r.detail), slug, "Detailseite würde umleiten (veraltet)");
          assert.equal(generateSlug(r.detail.projekt_name), slug);
          assert.ok(normal.some((p) => p.slug === slug), `Liste/Sitemap ohne ${slug}`);
        }
      } finally {
        globalThis.fetch = echterFetch;
      }
    });
  }

  test("Kennzahlen: keine 0-kWp-Anlage, gleiche Leistung ohne Ort zählt doppelt", async () => {
    stubFetch(500);
    try {
      const normal = await ladeProjekte();
      assert.ok(normal.every((p) => p.kwp == null || p.kwp > 0));
      const k = kennzahlen(normal);
      const summe = PROJEKTE.reduce((s, p) => s + (p.leistung || 0), 0);
      assert.ok(Math.abs(k.summeKwp - summe) < 1e-6, `Summe ${k.summeKwp} ≠ ${summe}`);
      assert.ok(k.kleinste.kwp > 0);
    } finally {
      globalThis.fetch = echterFetch;
    }
  });

  test("API liefert Projekte: API gewinnt, statischer Stand wird ignoriert", async () => {
    const api = { projekt_name: "Mindelheim 2", projekt_website_name: "haydu-2", leistung: 314.5, leistung_label: "314,5 kWp", jahr: 2024, ort: "Salzburg", objekt: "Gewerbe", bild_url: "https://backoffice.oekovolt.com/files/x.jpg" };
    stubFetch((u) => (u.includes("get_projekte") ? { message: { projekte: [api], anzahl: 1, summe_kwp: 314.5 } } : { message: u.includes("projekt_website_name=haydu-2") ? { ...api, bilder: [{ bild_url: api.bild_url }] } : null }));
    try {
      const liste = await ladeProjektListe();
      assert.equal(liste.quelle, "api");
      const normal = await ladeProjekte();
      assert.deepEqual(normal.map((p) => p.slug), ["mindelheim-2"]);
      const detail = await ladeProjektRoh("haydu-2");
      assert.equal(detail.projekt_name, "Mindelheim 2");
      assert.equal(await ladeProjektRoh(LIVE_SLUGS[0]), null, "statischer Eintrag darf die API nicht ergänzen");
    } finally {
      globalThis.fetch = echterFetch;
    }
  });

  test("ohne API-Zugangsdaten (eigener Prozess)", () => {
    const env = { ...process.env, PROJEKTE_TEST_MODUS: "ohne-env" };
    delete env.API_KEY;
    delete env.API_SECRET;
    const r = spawnSync(process.execPath, ["--no-warnings", DIESE_DATEI, ...process.argv.slice(2)], { env, encoding: "utf8" });
    assert.equal(r.status, 0, r.stdout + r.stderr);
  });
}
