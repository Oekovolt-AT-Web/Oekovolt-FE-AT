// Tests für den Zählpunkt-Prüfer (src/data/netzbetreiberKennungen.js, rein) und die
// Netzbetreiber-Daten (src/data/netzbetreiber.js): 9 Bundesländer, Quellen und
// Prüfdatum je Betreiber, neue Felder (Energiegemeinschaft, Peer-to-Peer,
// Kleinsterzeugung), E-Control-Zahlen, keine Logos.
//
// Aufruf: node scripts/zaehlpunkt.test.mjs
// Ohne Abhängigkeiten (node:test, node:assert); Pfad-Aliase über scripts/lib/alias.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ROOT, srcUrl } from "./lib/alias.mjs";

const K = await import(srcUrl("data/netzbetreiberKennungen.js"));
const N = await import(srcUrl("data/netzbetreiber.js"));

const BUNDESLAENDER = ["Burgenland", "Kärnten", "Niederösterreich", "Oberösterreich", "Salzburg", "Steiermark", "Tirol", "Vorarlberg", "Wien"];
const BEISPIEL = "AT.008100.08010.0O6G56M11SN51G21M24S"; // aus der TOR Stromzähler

/* ------------------------------------------------------------ Zählpunkt */

test("normalisiereZaehlpunkt: Groß, ohne Leerzeichen, Punkte, Striche", () => {
  assert.equal(K.normalisiereZaehlpunkt(" at 001000 01010 abc "), "AT00100001010ABC");
  assert.equal(K.normalisiereZaehlpunkt("AT-005000/06065_x.y"), "AT00500006065XY");
  assert.equal(K.normalisiereZaehlpunkt(null), "");
  assert.equal(K.normalisiereZaehlpunkt(undefined), "");
});

test("zerlegeZaehlpunkt: TOR-Beispiel ist gültig und wird in vier Teile zerlegt", () => {
  const r = K.zerlegeZaehlpunkt(BEISPIEL);
  assert.equal(r.status, "ok");
  assert.deepEqual(r.fehler, []);
  assert.equal(r.z.length, 33);
  assert.equal(r.teile.land, "AT");
  assert.equal(r.teile.netz, "008100");
  assert.equal(r.teile.plz, "08010");
  assert.equal(r.teile.nr, "0O6G56M11SN51G21M24S");
  assert.equal(r.teile.nr.length, 20);
  assert.equal(r.plz, "8010");
  assert.equal(r.betreiber?.kurz, "Stromnetz Graz");
});

test("zerlegeZaehlpunkt: leer, zu kurz, falsches Land, Buchstaben in Ziffernblöcken", () => {
  assert.equal(K.zerlegeZaehlpunkt("").status, "leer");
  const kurz = K.zerlegeZaehlpunkt("AT00500006065");
  assert.equal(kurz.status, "fehler");
  assert.ok(kurz.fehler.some((f) => f.includes("13 statt 33")));
  const de = K.zerlegeZaehlpunkt("DE" + "0".repeat(31));
  assert.ok(de.fehler.some((f) => f.includes("„AT“")));
  const buchst = K.zerlegeZaehlpunkt("ATAB1000" + "01010" + "A".repeat(20));
  assert.ok(buchst.fehler.some((f) => f.includes("Netzbetreibernummer")));
  const plz = K.zerlegeZaehlpunkt("AT001000" + "0A010" + "A".repeat(20));
  assert.ok(plz.fehler.some((f) => f.includes("Postleitzahl")));
  const sonder = K.zerlegeZaehlpunkt("AT001000" + "01010" + "A".repeat(19) + "ä");
  assert.ok(sonder.fehler.some((f) => f.includes("Großbuchstaben")));
});

test("zerlegeZaehlpunkt: Netzbetreiber wird auch bei falscher Länge erkannt, unbekannte Kennung ergibt null", () => {
  const r = K.zerlegeZaehlpunkt("AT006000 6900 X");
  assert.equal(r.betreiber?.slug, "vorarlberg-netz");
  assert.equal(K.zerlegeZaehlpunkt("AT999999" + "01010" + "A".repeat(20)).betreiber, null);
});

test("formatiereZaehlpunkt gruppiert, verändert aber keinen Inhalt", () => {
  const f = K.formatiereZaehlpunkt(BEISPIEL);
  assert.equal(f, "AT 008100 08010 0O6G56M11SN51G21M24S");
  assert.equal(f.replace(/ /g, ""), K.normalisiereZaehlpunkt(BEISPIEL));
});

test("KENNUNGEN: sechs Ziffern, eindeutig, mit Beleg und Quelle; jeder Slug existiert", () => {
  const gesehen = new Set();
  for (const k of K.KENNUNGEN) {
    assert.match(k.kennung, /^\d{6}$/, k.name);
    assert.ok(!gesehen.has(k.kennung), `Kennung doppelt: ${k.kennung}`);
    gesehen.add(k.kennung);
    assert.ok(["primaer", "sekundaer"].includes(k.beleg), k.name);
    assert.ok(k.quellen.length > 0 && k.quellen.every((q) => q.url.startsWith("https://")), k.name);
    if (k.slug) assert.ok(N.BETREIBER_SLUGS.includes(k.slug), `Slug ohne Seite: ${k.slug}`);
  }
  // Alle zehn Betreiberseiten haben eine Kennung
  for (const slug of N.BETREIBER_SLUGS) assert.ok(K.KENNUNGEN.some((k) => k.slug === slug), `Keine Kennung für ${slug}`);
  // Primär belegt: TINETZ (eigene Seite) und vorarlberg netz (Kontaktdatenblatt)
  assert.equal(K.kennungFuer("005000").beleg, "primaer");
  assert.equal(K.kennungFuer("006000").beleg, "primaer");
  assert.equal(K.kennungFuer("12"), null);
});

test("Prüfer schreibt nichts in URL, Storage, Konsole oder Analytics", () => {
  const quelle = fs.readFileSync(path.join(ROOT, "src/components/Netzanmeldung/ZaehlpunktPruefer.js"), "utf8");
  assert.ok(quelle.startsWith('"use client"'));
  for (const verboten of ["console.", "localStorage", "sessionStorage", "fetch(", "history.", "searchParams", "gtag(", "dataLayer", "plausible", "window.location"]) {
    assert.ok(!quelle.includes(verboten), `ZaehlpunktPruefer enthält ${verboten}`);
  }
  const lib = fs.readFileSync(path.join(ROOT, "src/data/netzbetreiberKennungen.js"), "utf8");
  assert.ok(!lib.includes("console."));
});

/* ------------------------------------------------------------ Netzbetreiber */

test("NETZBETREIBER: alle neun Bundesländer abgedeckt, Slugs eindeutig, Rangliste nach Zählpunkten", () => {
  const laender = new Set(N.NETZBETREIBER.map((b) => b.bundesland));
  for (const l of BUNDESLAENDER) assert.ok(laender.has(l), `Bundesland fehlt: ${l}`);
  assert.equal(new Set(N.BETREIBER_SLUGS).size, N.BETREIBER_SLUGS.length);
  assert.equal(N.NETZBETREIBER.length, 10);
  for (let i = 1; i < N.NETZBETREIBER.length; i++) assert.ok(N.NETZBETREIBER[i - 1].zaehlpunkte >= N.NETZBETREIBER[i].zaehlpunkte, "Reihenfolge nach Zählpunkten");
  for (const r of N.AUSWAHL.rangliste) assert.ok(N.BETREIBER_SLUGS.includes(r.slug), `Rangliste ohne Seite: ${r.name}`);
  assert.deepEqual(
    N.BUNDESLAENDER_NETZ.map((b) => b.land).sort(),
    [...BUNDESLAENDER].sort()
  );
  for (const b of N.BUNDESLAENDER_NETZ) assert.ok(N.betreiberFuerBundesland(b.land).length >= 1, b.land);
});

test("NETZBETREIBER: jede Angabe mit Quelle, geprueftAm und neuen Feldern; keine Logos", () => {
  for (const b of N.NETZBETREIBER) {
    assert.match(b.geprueftAm, /^\d{4}-\d{2}-\d{2}$/, b.slug);
    assert.ok(b.quellen.length >= 5, `${b.slug}: zu wenige Quellen`);
    for (const q of b.quellen) assert.ok(q.titel && q.url.startsWith("https://"), `${b.slug}: Quelle ohne Titel/URL`);
    assert.ok(b.portalUrl.startsWith("https://"), b.slug);
    assert.ok(b.schritte.length >= 5 && b.unterlagen.length >= 3 && b.fristen.length >= 2 && b.kosten.length >= 2, `${b.slug}: Struktur`);
    assert.ok(b.sonderfaelle.length >= 3 && b.kontakt.length >= 2, `${b.slug}: Sonderfälle/Kontakt`);
    // C06-Felder
    assert.ok(b.energiegemeinschaft?.datenfreigabe && b.energiegemeinschaft.quelle?.url, `${b.slug}: energiegemeinschaft`);
    assert.ok(b.energiegemeinschaft.formular?.url, `${b.slug}: Formular Datenfreigabe`);
    assert.ok(b.p2p?.anmeldeweg && b.p2p.quelle?.url, `${b.slug}: p2p`);
    assert.ok(b.kleinsterzeugung?.text && b.kleinsterzeugung.quelle?.url && b.kleinsterzeugung.formular?.url, `${b.slug}: kleinsterzeugung`);
    assert.ok(/800\s?W|0,8\s?k(W|VA)/.test(b.kleinsterzeugung.text), `${b.slug}: 800-W-Grenze fehlt`);
    // Keine Logos: Bild ist ein Regionsfoto mit Lizenznachweis
    assert.ok(!/logo/i.test(b.bild.src) && !/logo/i.test(b.bild.alt), `${b.slug}: Logo`);
    assert.ok(b.bild.urheber && b.bild.lizenz && b.bild.href, `${b.slug}: Bildnachweis`);
    assert.ok(fs.existsSync(path.join(ROOT, "public", b.bild.src)), `${b.slug}: Bild fehlt ${b.bild.src}`);
    // Neutralität: keine Wertungen
    const text = JSON.stringify(b);
    assert.ok(!/schnellste|beste Netzbetreiber|unkompliziertest/i.test(text), `${b.slug}: Wertung`);
  }
});

test("betreiberFaq und eegAnmeldewege liefern für jeden Betreiber vollständige Einträge", () => {
  for (const b of N.NETZBETREIBER) {
    const faq = N.betreiberFaq(b);
    assert.ok(faq.length >= 8, b.slug);
    assert.ok(faq.every((f) => f.q && f.a), b.slug);
  }
  const wege = N.eegAnmeldewege();
  assert.equal(wege.length, 10);
  for (const w of wege) assert.ok(w.datenfreigabe !== "nicht veröffentlicht" && w.p2p !== "nicht veröffentlicht", w.slug);
  assert.ok(wege.some((w) => w.p2pOffen), "offen-Kennzeichnung vorhanden (OÖ, Burgenland)");
});

test("E-Control-Zahlen: Netzanschluss-Realität und EEG je Bundesland mit Quelle und Stichtag", () => {
  const r = N.NETZANSCHLUSS_REALITAET;
  assert.equal(r.berichtsjahr, 2024);
  assert.deepEqual(r.dauer.map((d) => d.tage), [6.6, 11.4, 20.2]);
  assert.deepEqual(r.spanne, { min: 1, max: 89 });
  assert.equal(r.eingeschraenkt.anteil, 54);
  assert.equal(r.eingeschraenkt.land, "Oberösterreich");
  assert.equal(r.antraege, 120188);
  assert.ok(r.quelle.url.includes("e-control.at") && r.stand.iso === "2025-03-03");

  const e = N.EEG_JE_BUNDESLAND;
  assert.equal(e.zeilen.length, 9);
  assert.deepEqual(e.zeilen.map((z) => z.land).sort(), [...BUNDESLAENDER].sort());
  assert.equal(e.zeilen.reduce((s, z) => s + z.eeg, 0), e.gesamt);
  assert.equal(e.gesamt, 5999);
  assert.equal(e.stichtag.iso, "2026-06-30");
  assert.ok(e.quelle.url.includes("e-control.at"));
});

test("Pfade: Zählpunkt-Route und Kapazitäts-Wegweiser (B06) als Konstanten", () => {
  assert.equal(N.ZAEHLPUNKT_PFAD, "/netzanmeldung/zaehlpunkt");
  assert.equal(N.KAPAZITAET_PFAD, "/netzanmeldung/netzkapazitaet");
  assert.ok(fs.existsSync(path.join(ROOT, "src/app/netzanmeldung/zaehlpunkt/page.js")));
});
