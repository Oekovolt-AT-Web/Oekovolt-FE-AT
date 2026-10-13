// scripts/smartmeter.test.mjs
//
// Prüft src/data/smartmeter.js: Struktur je Netzbetreiber, belegte Quellen, Prüfzyklus,
// Neutralitätsregeln (nie „offizielles Portal“, keine Logos, kein Netzbetreiber-Anspruch),
// Hilfsfunktionen. Aufruf: node scripts/smartmeter.test.mjs

import assert from "node:assert/strict";
import {
  ALLGEMEINE_SCHRITTE,
  BETREIBER_SLUGS,
  FAQ,
  HINWEIS_KEIN_NETZBETREIBER,
  PRUEF_ZYKLUS_TAGE,
  RECHT,
  SMART_METER_BETREIBER,
  STAND,
  betreiberFaq,
  betreiberFuerSlug,
  betreiberHowTo,
  betreiberPfad,
  datumLabel,
  exportStatus,
  lastgangUrl,
  pruefungFaellig,
  tageSeit,
} from "../src/data/smartmeter.js";

let tests = 0;
const t = (name, fn) => {
  tests += 1;
  try {
    fn();
    console.log(`  ok  ${name}`);
  } catch (e) {
    console.error(`  FEHLER ${name}\n     ${e.message}`);
    process.exitCode = 1;
  }
};

const VERBOTEN = [/offizielle[sn]? portal/i, /\blogo\b/i, /ökovolt ist (ihr |der )?netzbetreiber/i, /bestes portal/i, /schnellste[sr]? portal/i];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;
const DE_RE = /^\d{2}\.\d{2}\.\d{4}$/;

const alleTexte = (obj) => {
  const out = [];
  const lauf = (v) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(lauf);
    else if (v && typeof v === "object") Object.values(v).forEach(lauf);
  };
  lauf(obj);
  return out;
};

console.log("smartmeter.js");

t("mindestens neun Netzbetreiber, eindeutige kebab-case-Slugs", () => {
  assert.ok(SMART_METER_BETREIBER.length >= 9, `nur ${SMART_METER_BETREIBER.length}`);
  assert.equal(new Set(BETREIBER_SLUGS).size, BETREIBER_SLUGS.length);
  for (const s of BETREIBER_SLUGS) assert.match(s, SLUG_RE, s);
});

t("die fünf bestehenden Slugs aus netzbetreiber.js sind enthalten", () => {
  for (const s of ["wiener-netze", "netz-niederoesterreich", "netz-oberoesterreich", "energienetze-steiermark", "salzburg-netz"]) assert.ok(BETREIBER_SLUGS.includes(s), s);
});

t("jeder Betreiber hat alle Pflichtfelder mit Inhalt", () => {
  for (const b of SMART_METER_BETREIBER) {
    for (const k of ["name", "kurz", "bundesland", "gebiet", "geprueftAm", "datenVerfuegbar"]) assert.ok(typeof b[k] === "string" && b[k].length > 2, `${b.slug}.${k}`);
    assert.match(b.portal.url, /^https:\/\//, `${b.slug} portal.url`);
    assert.ok(b.portal.name.length > 2, `${b.slug} portal.name`);
    assert.ok(b.login.text.length > 20 && b.login.angaben.length >= 1 && /^https:\/\//.test(b.login.url), `${b.slug} login`);
    assert.ok(b.viertelstundenAktivieren.standard.length > 20 && b.viertelstundenAktivieren.text.length > 20 && b.viertelstundenAktivieren.schritte.length >= 2, `${b.slug} viertelstundenAktivieren`);
    assert.ok(b.exportWeg.text.length > 20 && b.exportWeg.schritte.length >= 2 && b.exportWeg.zeitraum.length > 3, `${b.slug} exportWeg`);
    assert.ok(typeof b.dateiformat.belegt === "boolean" && b.dateiformat.text.length > 5, `${b.slug} dateiformat`);
    assert.ok(b.optOut.text.length > 20 && b.optOut.weg.length > 5 && b.optOut.folgen.length > 5, `${b.slug} optOut`);
    assert.ok(Array.isArray(b.offen), `${b.slug} offen`);
  }
});

t("Dateiformat nur als belegt markiert, wenn ein Format genannt ist – sonst unter „offen“", () => {
  for (const b of SMART_METER_BETREIBER) {
    if (b.dateiformat.belegt) assert.ok(b.dateiformat.format, `${b.slug}: belegt ohne Format`);
    else {
      assert.equal(b.dateiformat.format, null, `${b.slug}: Format ohne Beleg`);
      assert.ok(b.offen.some((o) => /format/i.test(o)), `${b.slug}: fehlendes Format nicht unter offen`);
    }
  }
});

t("mindestens drei Quellen je Betreiber, jede mit https-URL, Titel und Abrufdatum", () => {
  for (const b of SMART_METER_BETREIBER) {
    assert.ok(b.quellen.length >= 3, `${b.slug}: ${b.quellen.length} Quellen`);
    for (const q of b.quellen) {
      assert.match(q.url, /^https:\/\//, `${b.slug}: ${q.url}`);
      assert.ok(q.titel.length > 10, `${b.slug}: Titel`);
      assert.match(q.abgerufen, DE_RE, `${b.slug}: abgerufen ${q.abgerufen}`);
    }
    const urls = b.quellen.map((q) => q.url);
    assert.equal(new Set(urls).size, urls.length, `${b.slug}: doppelte Quelle`);
  }
});

t("Quellen stammen von der Domain des Netzbetreibers (keine Fremdportale als Beleg)", () => {
  const erlaubt = {
    "wiener-netze": ["wienernetze.at"],
    "netz-niederoesterreich": ["netz-noe.at"],
    "netz-oberoesterreich": ["netzooe.at"],
    "energienetze-steiermark": ["e-netze.at"],
    "salzburg-netz": ["salzburgnetz.at"],
    "kng-kaernten-netz": ["kaerntennetz.at"],
    "linz-netz": ["linznetz.at"],
    tinetz: ["tinetz.at"],
    "netz-burgenland": ["netzburgenland.at"],
    "vorarlberg-netz": ["vorarlbergnetz.at"],
  };
  for (const b of SMART_METER_BETREIBER) {
    const domains = erlaubt[b.slug];
    assert.ok(domains, `${b.slug}: keine Domain-Liste im Test`);
    for (const q of b.quellen) assert.ok(domains.some((d) => new URL(q.url).hostname.endsWith(d)), `${b.slug}: ${q.url}`);
  }
});

t("Neutralität: keine verbotenen Formulierungen, kein Logo-Feld", () => {
  for (const b of SMART_METER_BETREIBER) {
    assert.equal(b.logo, undefined, `${b.slug}: logo`);
    assert.equal(b.bild, undefined, `${b.slug}: bild`);
    for (const s of alleTexte(b)) for (const re of VERBOTEN) assert.ok(!re.test(s), `${b.slug}: „${s.slice(0, 60)}“ verstößt gegen ${re}`);
  }
  for (const s of [...alleTexte(RECHT), ...alleTexte(FAQ), ...alleTexte(ALLGEMEINE_SCHRITTE)]) for (const re of VERBOTEN) assert.ok(!re.test(s), s.slice(0, 60));
  assert.match(HINWEIS_KEIN_NETZBETREIBER, /kein Netzbetreiber/);
});

t("Prüfdaten: ISO-Format, nicht in der Zukunft, nicht älter als der Zyklus zum Stand", () => {
  assert.match(STAND.iso, ISO_RE);
  assert.equal(datumLabel(STAND.iso), STAND.label);
  const stand = Date.parse(`${STAND.iso}T00:00:00Z`);
  for (const b of SMART_METER_BETREIBER) {
    assert.match(b.geprueftAm, ISO_RE, b.slug);
    assert.ok(Date.parse(`${b.geprueftAm}T00:00:00Z`) <= stand, `${b.slug}: geprueftAm nach STAND`);
    assert.ok(!pruefungFaellig(b, stand), `${b.slug}: zum Stand bereits fällig`);
  }
  assert.equal(PRUEF_ZYKLUS_TAGE, 35);
});

t("tageSeit / pruefungFaellig rechnen korrekt", () => {
  const jetzt = Date.parse("2026-10-11T12:00:00Z");
  assert.equal(tageSeit("2026-10-11", jetzt), 0);
  assert.equal(tageSeit("2026-09-01", jetzt), 40);
  assert.equal(pruefungFaellig({ geprueftAm: "2026-09-06", slug: "x" }, jetzt), false);
  assert.equal(pruefungFaellig({ geprueftAm: "2026-09-05", slug: "x" }, jetzt), true);
  assert.equal(tageSeit("kein-datum", jetzt), Infinity);
});

t("Hilfsfunktionen: Slug-Suche, Pfade, Lastgang-URL, Exportstatus", () => {
  assert.equal(betreiberFuerSlug("wiener-netze").kurz, "Wiener Netze");
  assert.equal(betreiberFuerSlug("gibt-es-nicht"), null);
  assert.equal(betreiberPfad("tinetz"), "/smart-meter/tinetz");
  assert.equal(lastgangUrl("salzburg-netz"), "/lastgang-analyse?quelle=salzburg-netz");
  assert.equal(lastgangUrl(""), "/lastgang-analyse?quelle=unbekannt");
  assert.deepEqual(exportStatus(betreiberFuerSlug("netz-burgenland")), { label: "CSV", belegt: true });
  assert.equal(exportStatus(betreiberFuerSlug("tinetz")).belegt, false);
});

t("HowTo und FAQ je Betreiber sind vollständig und nennen das Portal", () => {
  for (const b of SMART_METER_BETREIBER) {
    const h = betreiberHowTo(b);
    assert.equal(h.schritte.length, 4, b.slug);
    assert.ok(h.schritte.every((s) => s.name && s.text.length > 20), b.slug);
    assert.ok(h.name.includes(b.kurz), b.slug);
    const f = betreiberFaq(b);
    assert.ok(f.length >= 5, b.slug);
    assert.ok(f[0].a.includes(b.portal.url), `${b.slug}: Portal-URL fehlt in FAQ`);
    assert.ok(f.some((x) => /kein Netzbetreiber/.test(x.a)), `${b.slug}: Neutralitätshinweis fehlt`);
    for (const x of f) assert.ok(x.q.endsWith("?") && x.a.length > 40, `${b.slug}: ${x.q}`);
  }
});

t("Rechtsrahmen nennt § 54 ElWG mit Quelle; allgemeine Schritte und FAQ vorhanden", () => {
  assert.ok(RECHT.punkte.length >= 3 && RECHT.punkte.every((p) => /§ 54/.test(p.norm)));
  assert.ok(RECHT.quellen.length >= 1 && RECHT.quellen.every((q) => /^https:\/\//.test(q.url)));
  assert.equal(ALLGEMEINE_SCHRITTE.length, 5);
  assert.ok(FAQ.length >= 5);
});

console.log(process.exitCode ? `\n${tests} Tests, Fehler siehe oben` : `\n${tests} Tests grün`);
