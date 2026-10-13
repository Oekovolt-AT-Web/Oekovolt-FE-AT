// scripts/redirects.test.mjs – prüft die Redirect-Liste aus next.config.mjs statisch:
// keine Ketten (ein Ziel darf nicht selbst wieder umgeleitet werden), keine Ziele ohne
// Seite, Quellen ohne abschließenden Slash, und die in Welle A01 verlangten Alt-URLs
// landen in genau einem Sprung auf einer existierenden Seite.
//
// Aufruf: node scripts/redirects.test.mjs
// Ohne Abhängigkeiten (node:test, node:assert); Pfad-Aliase über scripts/lib/alias.mjs.
// Host-Weiterleitungen (has: host) und externe Ziele (http…) werden nicht simuliert.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, srcUrl } from "./lib/alias.mjs";

const APP = path.join(ROOT, "src", "app");
const config = (await import(pathToFileURL(path.join(ROOT, "next.config.mjs")).href)).default;
const REDIRECTS = await config.redirects();
const { LAENDER_SLUGS } = await import(srcUrl("data/bundeslaender.js"));
const { INHALTS_ARTIKEL } = await import(srcUrl("lib/ratgeber.js"));

/* ---------------------------------------------------------- Quelle -> RegExp */

// Übersetzt eine Next-Redirect-Quelle (path-to-regexp-Syntax) in einen RegExp mit
// benannten Gruppen: ":name" ein Segment, ":name+" ein oder mehr, ":name*" null oder mehr.
export function quelleZuRegex(source) {
  let re = "^";
  const rest = source.replace(/\/:([A-Za-z0-9_]+)([*+?]?)|(\([^)]*\))|([^(/:]+|[/:])/g, (_, name, mod, gruppe, literal) => {
    if (name) {
      if (mod === "*") re += `(?<${name}>(?:/[^/]+)*)`;
      else if (mod === "+") re += `(?<${name}>(?:/[^/]+)+)`;
      else if (mod === "?") re += `(?<${name}>(?:/[^/]+)?)`;
      else re += `/(?<${name}>[^/]+)`;
    } else if (gruppe) re += gruppe;
    else re += literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return "";
  });
  assert.equal(rest, "", `Quelle nicht vollständig übersetzt: ${source}`);
  return new RegExp(`${re}$`);
}

/** Erster passender Redirect für einen Pfad (ohne host-Bedingung) oder null. */
export function loese(pfad) {
  for (const r of REDIRECTS) {
    if (r.has) continue;
    const m = quelleZuRegex(r.source).exec(pfad);
    if (!m) continue;
    // Gruppen für +/*/? enthalten den führenden Slash schon, die für ":name" nicht
    const ziel = r.destination.replace(/\/:([A-Za-z0-9_]+)([*+?]?)/g, (_, name, mod) => {
      const wert = m.groups?.[name] ?? "";
      return mod ? wert : `/${wert}`;
    });
    return { ziel: ziel || "/", eintrag: r };
  }
  return null;
}

/* ------------------------------------------------------------ Seite vorhanden? */

const SEITEN_DATEIEN = ["page.js", "page.jsx", "page.tsx", "route.js", "route.ts"];
const DYNAMISCHE_LISTEN = {
  "forderungen/landesforderungen": new Set(LAENDER_SLUGS.map((l) => l.slug)),
  ratgeber: new Set(INHALTS_ARTIKEL.map((a) => a.slug)),
};

const unterordner = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];

/**
 * Prüft, ob ein interner Pfad eine Seite oder Route unter src/app hat.
 * Dynamische Segmente ([slug]) werden gegen bekannte Slug-Listen geprüft; für unbekannte
 * dynamische Ordner gilt die Seite als vorhanden (Hinweis in der Rückgabe).
 * Rückgabe: { ok, hinweis }.
 */
export function seiteVorhanden(pfad) {
  const segmente = pfad.split("?")[0].split("#")[0].split("/").filter(Boolean);
  let dir = APP;
  const bisher = []; // URL-Segmente vor dem aktuellen (Schlüssel für DYNAMISCHE_LISTEN)
  for (const seg of segmente) {
    const kinder = unterordner(dir);
    // Routen-Gruppen "(gruppe)" sind im Pfad unsichtbar
    const gruppe = kinder.includes(seg) ? null : kinder.filter((k) => k.startsWith("(")).find((g) => unterordner(path.join(dir, g)).includes(seg));
    if (gruppe) dir = path.join(dir, gruppe);
    if (kinder.includes(seg) || gruppe) {
      dir = path.join(dir, seg);
    } else {
      const dynamisch = kinder.find((k) => k.startsWith("["));
      if (!dynamisch) return { ok: false, hinweis: `kein Ordner für „${seg}“ unter ${path.relative(ROOT, dir)}` };
      const liste = DYNAMISCHE_LISTEN[bisher.join("/")];
      if (liste && !liste.has(seg)) return { ok: false, hinweis: `Slug „${seg}“ fehlt in der Liste für ${bisher.join("/")}/${dynamisch}` };
      dir = path.join(dir, dynamisch);
    }
    bisher.push(seg);
  }
  const datei = SEITEN_DATEIEN.find((d) => fs.existsSync(path.join(dir, d)));
  return datei ? { ok: true, hinweis: path.relative(ROOT, path.join(dir, datei)) } : { ok: false, hinweis: `keine page.js/route.js in ${path.relative(ROOT, dir)}` };
}

const intern = (r) => r.destination.startsWith("/");
const statisch = (r) => intern(r) && !r.destination.includes(":");
const lokal = REDIRECTS.filter((r) => !r.has);

/* ------------------------------------------------------------------- Tests */

test("Quellen: führender Slash, kein abschließender Slash, keine Dubletten", () => {
  const gesehen = new Set();
  for (const r of lokal) {
    assert.ok(r.source.startsWith("/"), `Quelle ohne führenden Slash: ${r.source}`);
    assert.ok(r.source === "/" || !r.source.endsWith("/"), `Quelle mit abschließendem Slash greift nie (trailingSlash: false): ${r.source}`);
    assert.ok(!gesehen.has(r.source), `Quelle doppelt: ${r.source}`);
    gesehen.add(r.source);
  }
});

test("jeder Eintrag hat genau eine Statusangabe (permanent oder statusCode)", () => {
  for (const r of REDIRECTS) {
    const n = ("permanent" in r ? 1 : 0) + ("statusCode" in r ? 1 : 0);
    assert.equal(n, 1, `${r.source}: permanent/statusCode fehlt oder doppelt`);
  }
});

test("statische interne Ziele haben eine Seite", () => {
  for (const r of lokal.filter(statisch)) {
    const s = seiteVorhanden(r.destination);
    assert.ok(s.ok, `${r.source} -> ${r.destination}: ${s.hinweis}`);
  }
});

test("keine Ketten: kein statisches Ziel wird selbst wieder umgeleitet", () => {
  for (const r of lokal.filter(statisch)) {
    const weiter = loese(r.destination);
    assert.equal(weiter, null, `Kette: ${r.source} -> ${r.destination} -> ${weiter?.ziel} (${weiter?.eintrag.source})`);
  }
});

test("Welle A01: Alt-URLs landen in einem Sprung auf einer vorhandenen Seite", () => {
  const faelle = {
    "/referenzen": "/referenzen/projekte",
    "/foerderungen": "/foerdercheck",
    "/foerderungen/steuerlich": "/forderungen/steuerlich",
    "/foerderungen/landesforderungen": "/forderungen/landesforderungen",
    "/forderungen/landesforderungen/landesforderungen-in-oberosterreich": "/forderungen/landesforderungen/landesfoerderungen-in-oberoesterreich",
    "/foerderungen/landesforderungen/landesforderungen-in-oberosterreich": "/forderungen/landesforderungen/landesfoerderungen-in-oberoesterreich",
  };
  for (const [von, nach] of Object.entries(faelle)) {
    const erg = loese(von);
    assert.ok(erg, `${von}: kein Redirect`);
    assert.equal(erg.ziel, nach, `${von}: landet auf ${erg.ziel}`);
    assert.equal(erg.eintrag.permanent ?? erg.eintrag.statusCode === 301, true, `${von}: nicht permanent`);
    assert.equal(loese(nach), null, `${von}: Kette über ${nach}`);
    const s = seiteVorhanden(nach);
    assert.ok(s.ok, `${von} -> ${nach}: ${s.hinweis}`);
  }
});

test("/foerderungen/<jede Förder-Unterseite> trifft in einem Sprung die /forderungen-Seite", () => {
  const seiten = unterordner(path.join(APP, "forderungen")).filter((d) => !d.startsWith("[") && !d.startsWith("("));
  assert.ok(seiten.length >= 3, "zu wenige Förder-Unterseiten gefunden");
  for (const seite of seiten) {
    const erg = loese(`/foerderungen/${seite}`);
    assert.ok(erg, `/foerderungen/${seite}: kein Redirect`);
    assert.equal(erg.ziel, `/forderungen/${seite}`);
    assert.equal(loese(erg.ziel), null, `/foerderungen/${seite}: Kette über ${erg.ziel}`);
    assert.ok(seiteVorhanden(erg.ziel).ok, `${erg.ziel} hat keine Seite`);
  }
  for (const l of LAENDER_SLUGS) {
    const erg = loese(`/foerderungen/landesforderungen/${l.slug}`);
    assert.equal(erg?.ziel, l.pfad, `Landesseite ${l.slug}`);
    assert.ok(seiteVorhanden(l.pfad).ok, `${l.pfad} hat keine Seite`);
  }
});

test("Hilfsfunktion quelleZuRegex: *, + und einfache Parameter", () => {
  assert.match("/team", quelleZuRegex("/team/:member*"));
  assert.match("/team/a/b", quelleZuRegex("/team/:member*"));
  assert.doesNotMatch("/foerderungen", quelleZuRegex("/foerderungen/:path+"));
  assert.match("/foerderungen/x/y", quelleZuRegex("/foerderungen/:path+"));
  assert.match("/a/b", quelleZuRegex("/a/:x"));
  assert.doesNotMatch("/a/b/c", quelleZuRegex("/a/:x"));
  assert.doesNotMatch("/agri-pvx", quelleZuRegex("/agri-pv"));
});
