// Tests für Paket C08 (Regionen-SEO): Solarkataster je Land, Marktdaten je Land, Titel-Länge der
// Landesförderungs-Seiten, Programmstatus im Antwortblock und die „Weiter für <Stadt>“-Blöcke
// (keine identischen Blöcke: Jaccard der 5-Wort-Folgen < 0,35).
//
// Aufruf: node scripts/regionen-seo.test.mjs
// Ohne Abhängigkeiten (node:test, node:assert); Pfad-Aliase über scripts/lib/alias.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ROOT, srcUrl } from "./lib/alias.mjs";

const { SOLARKATASTER, SOLARKATASTER_STAND, SOLARKATASTER_STATUS, solarkatasterFuerLand } = await import(srcUrl("data/solarkataster.js"));
const { LAENDER } = await import(srcUrl("lib/bundesland/auswertung.js"));
const { LAENDER_SLUGS, BUNDESLAENDER } = await import(srcUrl("data/bundeslaender.js"));
const { BETREIBER_SLUGS } = await import(srcUrl("data/netzbetreiber.js"));
const { REGIONEN } = await import(srcUrl("data/regionen/index.js"));
const { regionFuer } = await import(srcUrl("lib/regionen.js"));
const { artikelNachSlug } = await import(srcUrl("lib/ratgeber.js"));
const M = await import(srcUrl("app/photovoltaik-bundesland/[land]/marktdaten.js"));
const A = await import(srcUrl("app/forderungen/landesforderungen/[name]/antwort.js"));
const W = await import(srcUrl("app/photovoltaik/[stadt]/weiter.js"));

const HEUTE = new Date();
const TAGE = (iso) => Math.round((HEUTE - new Date(`${iso}T00:00:00Z`)) / 86_400_000);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/* ------------------------------------------------------------------ Solarkataster */

test("Solarkataster: genau ein Eintrag je Bundesland, https, Prüfdatum, Betreiber, bekannter Status", () => {
  assert.equal(SOLARKATASTER.length, 9);
  for (const l of LAENDER) {
    const s = solarkatasterFuerLand(l.slug);
    assert.ok(s, `Solarkataster fehlt für ${l.slug}`);
    assert.match(s.url, /^https:\/\//, `${l.slug}: URL muss https sein`);
    assert.match(s.geprueft, ISO, `${l.slug}: geprueft als ISO-Datum`);
    assert.ok(TAGE(s.geprueft) >= 0 && TAGE(s.geprueft) <= 120, `${l.slug}: Prüfdatum älter als 120 Tage – neu prüfen`);
    assert.ok(s.betreiber && s.betreiber.length > 5, `${l.slug}: Betreiber fehlt`);
    assert.ok(SOLARKATASTER_STATUS[s.status], `${l.slug}: unbekannter Status ${s.status}`);
    assert.ok(s.name && s.hinweis, `${l.slug}: Name und Hinweis nötig`);
    if (s.dokumentation) assert.match(s.dokumentation, /^https:\/\//);
  }
  assert.match(SOLARKATASTER_STAND.iso, ISO);
});

test("Solarkataster: keine Werbeaussagen („offiziell“) und keine doppelten URLs", () => {
  const urls = new Set();
  for (const s of SOLARKATASTER) {
    assert.doesNotMatch(`${s.name} ${s.hinweis}`, /offiziell/i, `${s.land}: „offiziell“ ist nicht erlaubt`);
    assert.ok(!urls.has(s.url), `${s.land}: URL doppelt`);
    urls.add(s.url);
  }
  for (const st of Object.values(SOLARKATASTER_STATUS)) assert.doesNotMatch(st.label, /offiziell/i);
});

/* ------------------------------------------------------------------ Marktdaten */

test("Marktdaten: je Land Erfüllungsgrad 0–100 mit Stichtag, ÖNIP-Ziel null oder positiv, Dashboard-Link https", () => {
  for (const l of LAENDER) {
    const m = M.marktdatenFuerLand(l.slug);
    assert.ok(m, `Marktdaten fehlen für ${l.slug}`);
    assert.ok(Number.isInteger(m.erfuellungProzent) && m.erfuellungProzent >= 0 && m.erfuellungProzent <= 100, `${l.slug}: Erfüllungsgrad`);
    assert.ok(m.erfuellungStichtag, `${l.slug}: Stichtag fehlt`);
    assert.ok(m.oenipZiel2030Mw === null || (Number.isFinite(m.oenipZiel2030Mw) && m.oenipZiel2030Mw > 0), `${l.slug}: ÖNIP-Ziel`);
    assert.match(m.dashboardUrl, /^https:\/\/pvbaustria\.at\/dashboard\//);
    assert.ok(m.landeszielHinweis, `${l.slug}: Landesziel-Hinweis`);
  }
  assert.equal(M.marktdatenFuerLand("bayern"), null);
  for (const q of Object.values(M.MARKT_QUELLEN)) assert.match(q.url, /^https:\/\//);
  assert.match(M.MARKTDATEN_STAND.iso, ISO);
});

test("Marktdaten: belegte Beispiele (NÖ 5.600 MWp, 36 %) und offener Bedarf", () => {
  const noe = M.marktdatenFuerLand("niederoesterreich");
  assert.equal(noe.oenipZiel2030Mw, 5600);
  assert.equal(noe.erfuellungProzent, 36);
  assert.equal(M.offenerBedarfMw(noe), 3584);
  assert.equal(M.offenerBedarfMw(M.marktdatenFuerLand("wien")), null);
  assert.equal(M.offenerBedarfMw(null), null);
  const summe = ["niederoesterreich", "oberoesterreich", "steiermark"].reduce((s, k) => s + M.MARKTDATEN[k].oenipZiel2030Mw, 0);
  assert.ok(summe < M.MARKT_OESTERREICH.oenipZiel2030Mw, "Landesziele dürfen das Österreich-Ziel nicht übersteigen");
});

/* ------------------------------------------------------------------ Landesförderung: Titel und Status */

test("Landesförderung: Title ≤ 60 Zeichen für alle neun Länder, H1 mit 2026/2027 und Zielgruppen", () => {
  for (const l of LAENDER_SLUGS) {
    const t = A.titelFuer(l.name);
    assert.ok(t.length <= 60, `${l.name}: Title ${t.length} Zeichen – ${t}`);
    assert.match(t, /Förderung/);
    assert.match(t, /2026\/2027/);
    const h1 = A.h1Fuer(l.name);
    assert.ok(h1.includes(l.name) && h1.includes("Betriebe, Landwirtschaft und Gemeinden"));
    const d = A.beschreibungFuer(l.name);
    assert.ok(d.length <= 160, `${l.name}: Description ${d.length} Zeichen`);
  }
});

test("Antwortblock-Status: über programmStatus (C01), Beschriftung für jeden Status, Frist-Spalte", () => {
  const jetzt = Date.UTC(2026, 9, 11, 12);
  for (const st of ["offen", "bald", "abgelaufen", "wartet"]) assert.ok(A.STATUS_TEXT[st], `Beschriftung für ${st} fehlt`);
  const land = { programme: [
    { name: "A", zielgruppen: ["unternehmen"], hoehe: "x", fristIso: "2026-10-10" },
    { name: "B", zielgruppen: ["gemeinde"], hoehe: "x", startIso: "2027-01-01" },
    { name: "C", zielgruppen: ["landwirtschaft"], hoehe: "x", gueltigBisIso: "2026-12-31" },
    { name: "D", zielgruppen: ["privat"], hoehe: "x" },
  ] };
  const z = A.antwortZeilen(land, jetzt);
  assert.deepEqual(z.map((x) => [x.programm, x.status]), [["A", "abgelaufen"], ["B", "wartet"], ["C", "offen"]]);
  assert.equal(A.fristText({ fristIso: "2026-10-31" }), "bis 31.10.2026");
  assert.equal(A.fristText({ gueltigBisIso: "2026-12-31" }), "gültig bis 31.12.2026");
  assert.equal(A.fristText({ status: "laufend" }), "laufend");
  assert.equal(A.gemeindeProgramme(land).length, 1);
});

test("Antwortblock: nur Programme für Betriebe, Landwirtschaft, Gemeinden – mit Quelle", () => {
  for (const [key, land] of Object.entries(BUNDESLAENDER)) {
    const zeilen = A.antwortZeilen(land, Date.UTC(2026, 9, 11));
    for (const z of zeilen) {
      assert.ok(z.programm && z.zielgruppe && z.frist, `${key}: Zeile unvollständig`);
      assert.ok(z.hoehe.length <= 90, `${key}: Höhe zu lang`);
      assert.doesNotMatch(z.zielgruppe, /^Privat$/);
      assert.ok(["offen", "bald", "abgelaufen", "wartet"].includes(z.status));
    }
    const privat = (land.programme || []).filter((p) => p.zielgruppen.length === 1 && p.zielgruppen[0] === "privat");
    assert.equal(zeilen.length, (land.programme || []).length - privat.length, `${key}: reine Privatprogramme bleiben draußen`);
  }
});

/* ------------------------------------------------------------------ Stadtseiten: „Weiter für <Stadt>“ */

const titel = (slug) => artikelNachSlug(slug)?.title || null;
const BLOECKE = Object.keys(REGIONEN).map((slug) => {
  const r = regionFuer(slug);
  const b = W.weiterFuerStadt(r, { titelFuer: titel });
  return { slug, r, b, text: W.blockText(b) };
});

test("Weiter-Block: Netzschritt mit existierendem Leitfaden oder Hub, zwei Ratgeber mit echten Artikeln", () => {
  assert.equal(BLOECKE.length, 37);
  for (const { slug, b } of BLOECKE) {
    const netz = b.schritte.find((s) => s.id === "netz");
    assert.ok(netz, `${slug}: Netzschritt fehlt`);
    if (b.leitfaden) {
      assert.ok(BETREIBER_SLUGS.includes(b.leitfaden), `${slug}: Leitfaden ${b.leitfaden} existiert nicht`);
      assert.equal(netz.href, `/netzanmeldung/${b.leitfaden}`);
    } else {
      assert.equal(netz.href, "/netzanmeldung");
    }
    assert.equal(b.themen.length, 2, `${slug}: genau zwei thematische Ratgeber`);
    for (const t of b.themen) {
      assert.ok(artikelNachSlug(t.slug), `${slug}: Ratgeber ${t.slug} fehlt`);
      assert.notEqual(t.slug, W.SCHNEELAST_RATGEBER);
      assert.equal(t.href, `/ratgeber/${t.slug}`);
      assert.notEqual(t.titel, t.slug, `${slug}: Titel für ${t.slug} nicht aufgelöst`);
    }
    assert.notEqual(b.themen[0].slug, b.themen[1].slug, `${slug}: Ratgeber doppelt`);
    assert.ok(b.ueberschrift.startsWith("Weiter für "), `${slug}: Überschrift`);
  }
});

test("Weiter-Block: alpine Orte verweisen auf /schneelast und den Schneelast-Ratgeber, Flachland nicht", () => {
  for (const { slug, r, b } of BLOECKE) {
    const schnee = b.schritte.find((s) => s.id === "schnee");
    if (r.alpin) {
      assert.ok(schnee, `${slug}: alpin ohne Schneelast-Schritt`);
      assert.equal(schnee.href, "/schneelast");
      assert.equal(schnee.ratgeber.slug, "schneelast-photovoltaik");
      assert.ok(artikelNachSlug(schnee.ratgeber.slug));
    } else {
      assert.equal(schnee, undefined, `${slug}: Flachland mit Schneelast-Schritt`);
    }
  }
  assert.ok(BLOECKE.filter((x) => x.r.alpin).length >= 10, "alpine Orte vorhanden");
});

test("Weiter-Block: keine identischen Blöcke – Jaccard der 5-Wort-Folgen < 0,35 für alle Paare", () => {
  let max = 0;
  let paar = null;
  for (let i = 0; i < BLOECKE.length; i++) {
    for (let j = i + 1; j < BLOECKE.length; j++) {
      const v = W.jaccard5(BLOECKE[i].text, BLOECKE[j].text);
      if (v > max) {
        max = v;
        paar = [BLOECKE[i].slug, BLOECKE[j].slug];
      }
      assert.ok(v < 0.35, `${BLOECKE[i].slug} / ${BLOECKE[j].slug}: Jaccard ${v.toFixed(2)} ≥ 0,35`);
    }
  }
  assert.ok(paar, `höchste Ähnlichkeit ${max.toFixed(2)}`);
  assert.equal(W.jaccard5("a b c d e f", "a b c d e f"), 1);
  assert.equal(W.jaccard5("a b c d e f", "x y z w v u"), 0);
});

test("Netz-Slugs: Doppelnennungen und unbekannte Stadtwerke", () => {
  assert.deepEqual(W.netzSlugsFuer({ kurz: "Netz NÖ / Wiener Netze" }), ["wiener-netze", "netz-niederoesterreich"]);
  assert.deepEqual(W.netzSlugsFuer({ kurz: "eww", name: "eww ag" }), []);
  assert.deepEqual(W.netzSlugsFuer({ kurz: "KNG-Kärnten Netz" }), ["kng-kaernten-netz"]);
  assert.deepEqual(W.netzSlugsFuer({ kurz: "Vorarlberger Energienetze" }), ["vorarlberg-netz"]);
  for (const s of ["wiener-netze", "netz-niederoesterreich", "netz-oberoesterreich", "energienetze-steiermark", "salzburg-netz", "kng-kaernten-netz", "linz-netz", "tinetz", "netz-burgenland", "vorarlberg-netz"]) {
    assert.ok(BETREIBER_SLUGS.includes(s), `Leitfaden ${s} fehlt in netzbetreiber.js`);
  }
  const b = W.weiterFuerStadt(regionFuer("villach"), { vorhandeneSlugs: [] });
  assert.equal(b.leitfaden, null);
  assert.deepEqual(b.fehlendeLeitfaeden, ["kng-kaernten-netz"]);
  const c = W.weiterFuerStadt(regionFuer("villach"), { vorhandeneSlugs: ["kng-kaernten-netz"] });
  assert.equal(c.leitfaden, "kng-kaernten-netz");
});

/* ------------------------------------------------------------------ Keine neuen URLs je Gemeinde */

test("Routen: keine neuen Gemeinde-/PLZ-Seiten – nur 9 Landesseiten, 9 Hubs, 37 Standortseiten", () => {
  assert.equal(LAENDER_SLUGS.length, 9);
  assert.equal(LAENDER.length, 9);
  assert.equal(Object.keys(REGIONEN).length, 37);
  for (const dir of ["src/app/forderungen/landesforderungen/[name]", "src/app/photovoltaik-bundesland/[land]", "src/app/photovoltaik/[stadt]"]) {
    const eintraege = fs.readdirSync(path.join(ROOT, dir));
    assert.ok(eintraege.every((e) => e.endsWith(".js")), `${dir}: keine Unterordner (keine neuen Routen)`);
  }
});

/* ------------------------------------------------------------------ QA-Nachbesserung C08 (12.10.2026) */

test("Weiter-Block: „Passend zu …“ nennt den Schwerpunkt, der den Ratgeber ausgelöst hat", () => {
  for (const { slug, r, b } of BLOECKE) {
    const anlass = W.themenRatgeberMitAnlass(r, 2);
    assert.deepEqual(anlass.map((a) => a.slug), W.themenRatgeber(r, 2));
    b.themen.forEach((t, i) => {
      const sp = anlass[i].schwerpunkt;
      if (sp) {
        assert.ok((r.schwerpunkte || []).some((s) => s.titel === sp), `${slug}: Anlass ${sp} ist kein Schwerpunkt`);
        assert.ok(t.text.startsWith(`Passend zu ${sp}:`), `${slug}: Ratgeber ${t.slug} mit falschem Anlass`);
      } else {
        assert.doesNotMatch(t.text, /^Passend zu/, `${slug}: Standard-Ratgeber ohne Anlass`);
      }
    });
  }
  const zell = BLOECKE.find((x) => x.slug === "zell-am-see");
  if (zell) for (const t of zell.b.themen) if (t.slug === "photovoltaik-gewerbe") assert.doesNotMatch(t.text, /Dächer unter Schnee/);
});

test("Weiter-Block: Schneelast-Text beginnt nie mit einem bezugslosen „Zusätzlich“/„Neben der Schneelast“", () => {
  for (const { slug, b } of BLOECKE) {
    const schnee = b.schritte.find((s) => s.id === "schnee");
    if (schnee) assert.doesNotMatch(schnee.text, /^(Zusätzlich|Neben der Schneelast)/, `${slug}: Schneelast-Text`);
  }
});

test("Solarkataster: nur bestätigte Einträge heißen „Solarkataster“, kein Prüfjargon öffentlich", () => {
  for (const s of SOLARKATASTER) {
    const st = SOLARKATASTER_STATUS[s.status];
    assert.equal(typeof st.ueberschrift, "function");
    assert.ok(st.link && st.geprueft, `${s.land}: Linktext/Prüfsatz fehlt`);
    if (s.status === "unbestaetigt" || s.status === "keiner") {
      assert.doesNotMatch(st.ueberschrift("X"), /Solarkataster/);
      assert.doesNotMatch(st.link, /Solarkataster/);
    }
    for (const t of [st.label, s.hinweis]) assert.doesNotMatch(t, /Suchindex|Prüfverbindung|abgewiesen/i, `${s.land}: Prüfjargon`);
  }
});

test("Landesförderung: kein toter Titel-Code, keine veraltete USt-Aussage", () => {
  const titelVarianten = LAENDER_SLUGS.map((l) => A.titelFuer(l.name));
  for (const t of titelVarianten) assert.ok(t.length <= A.TITEL_MAX);
  const seite = fs.readFileSync(path.join(ROOT, "src/app/forderungen/landesforderungen/[name]/page.js"), "utf8");
  assert.doesNotMatch(seite, /Umsatzsteuer-Befreiung/);
  assert.doesNotMatch(seite, /zuletzt geändert/);
});
