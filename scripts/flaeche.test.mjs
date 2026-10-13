// Tests für src/lib/flaeche/* – Aufruf: node scripts/flaeche.test.mjs
import assert from "node:assert/strict";
import { pruefeFlaeche, pachtSpanne, PACHT_BELEG, WIDMUNGEN, AUSRICHTUNGEN, STUFEN } from "../src/lib/flaeche/check.js";
import { LAENDER, landFuerSlug, widmungsPfad, STAND } from "../src/lib/flaeche/laender.js";
import { CHECKLISTE } from "../src/lib/flaeche/checkliste.js";
import { zahl, euro, hektar } from "../src/lib/flaeche/format.js";
import fs from "node:fs";
import { haversineKm, naechstesUmspannwerk, netzVorschlag, netzSteckbriefText, umspannwerkListe, ODBL_HINWEIS } from "../src/lib/flaeche/netz.js";
import { KAPAZITAET_QUELLEN, KAPAZITAET_PFAD, KAPAZITAET_GATE, KAPAZITAET_JE_LAND, kapazitaetQuelleFuer, kapazitaetQuellenFuerLand, hatEigeneKapazitaetsQuelle } from "../src/data/netzkapazitaetQuellen.js";
import { hoechsteSpannung, aufbereiten } from "./umspannwerke-osm.mjs";

const UW = JSON.parse(fs.readFileSync(new URL("../src/data/umspannwerke-at.json", import.meta.url), "utf8"));

let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  process.stdout.write(`ok ${n} – ${name}\n`);
};

// ---------- Format (ohne Intl) ----------
test("Zahlformat mit Tausenderpunkt und Dezimalkomma", () => {
  assert.equal(zahl(0), "0");
  assert.equal(zahl(1234567), "1.234.567");
  assert.equal(zahl(1234.56, 1), "1.234,6");
  assert.equal(zahl(0.05, 1), "0,1");
  assert.equal(zahl(-2500), "−2.500");
  assert.equal(zahl(NaN), "–");
  assert.equal(euro(12345), "12.300 €");
  assert.equal(euro(12351, 1), "12.351 €");
  assert.equal(hektar(2.5), "2,5 ha");
  assert.equal(hektar(12), "12 ha");
});

// ---------- Länderdaten ----------
test("neun Bundesländer mit Quellen und Prüfregel", () => {
  assert.equal(LAENDER.length, 9);
  const slugs = LAENDER.map((l) => l.slug);
  assert.equal(new Set(slugs).size, 9);
  for (const l of LAENDER) {
    assert.ok(l.quellen.length >= 1, `${l.name}: Quelle fehlt`);
    for (const q of l.quellen) assert.match(q.url, /^https:\/\//, `${l.name}: URL`);
    assert.ok(l.regeln.length >= 2, `${l.name}: Regeln`);
    assert.ok(["widmung", "zonen", "staffel", "deckel", "keine"].includes(l.check.art), `${l.name}: check.art`);
    assert.ok(Array.isArray(l.offen), `${l.name}: offen`);
  }
  assert.equal(landFuerSlug("tirol").name, "Tirol");
  assert.equal(landFuerSlug("xy"), null);
  assert.equal(widmungsPfad("wien"), "/freiflaechen-photovoltaik/widmung/wien");
  assert.equal(STAND.iso, "2026-09-30");
});

// ---------- Pacht ----------
test("Pachtspanne nur für landwirtschaftliche Flächen belegt", () => {
  const p = pachtSpanne({ hektar: 4, widmung: "acker" });
  assert.equal(p.belegt, true);
  assert.equal(p.jahrVon, 4 * PACHT_BELEG.pvVon);
  assert.equal(p.jahrBis, 4 * PACHT_BELEG.pvBis);
  assert.equal(p.agrar, PACHT_BELEG.ackerland);
  assert.ok(p.quellen.length >= 2);
  const w = pachtSpanne({ hektar: 4, widmung: "wiese" });
  assert.equal(w.agrar, PACHT_BELEG.dauergruenland);
  for (const id of ["vorbelastet", "bauland", "wald"]) {
    const o = pachtSpanne({ hektar: 4, widmung: id });
    assert.equal(o.belegt, false, id);
    assert.match(o.hinweis, /Richtwert – Quelle offen/);
    assert.equal(o.jahrVon, undefined);
  }
  assert.equal(pachtSpanne({ hektar: -3, widmung: "acker" }).jahrVon, 0);
});

// ---------- Ampel ----------
const basis = { hektar: 3, widmung: "acker", netzKm: 0.5, neigung: 0, ausrichtung: "eben", bundesland: "oberoesterreich" };

test("Oberösterreich, 3 ha Acker, netznah, eben → grün", () => {
  const r = pruefeFlaeche(basis);
  assert.equal(r.ampel, "gruen");
  assert.equal(r.kwp, 3000);
  assert.equal(r.kriterien.length, 4);
  assert.equal(r.kriterien.find((k) => k.id === "widmung").stufe, "pruefen");
  assert.equal(r.eagAbschlag, true);
});

test("bestehende PV-Widmung → Widmung passt", () => {
  const r = pruefeFlaeche({ ...basis, widmung: "pv" });
  assert.equal(r.kriterien[0].stufe, "gut");
  assert.equal(r.ampel, "gruen");
});

test("Wald → rot", () => {
  assert.equal(pruefeFlaeche({ ...basis, widmung: "wald" }).ampel, "rot");
});

test("Kärnten: Deckel 4 ha, vorbelastet 10 ha", () => {
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 4 }).kriterien[0].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 6 }).ampel, "rot");
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 6, widmung: "vorbelastet" }).kriterien[0].stufe, "pruefen");
  const gross = pruefeFlaeche({ ...basis, bundesland: "kaernten", hektar: 12, widmung: "vorbelastet" });
  assert.equal(gross.kriterien[0].stufe, "erschwert");
  assert.notEqual(gross.ampel, "rot");
});

test("Niederösterreich: über 2 ha nur in Zonen → gelb", () => {
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "niederoesterreich", hektar: 2 }).ampel, "gruen");
  const r = pruefeFlaeche({ ...basis, bundesland: "niederoesterreich", hektar: 2.5 });
  assert.equal(r.kriterien[0].stufe, "erschwert");
  assert.equal(r.ampel, "gelb");
});

test("Steiermark: Staffel 2 / 10 ha", () => {
  const st = { ...basis, bundesland: "steiermark" };
  assert.equal(pruefeFlaeche({ ...st, hektar: 1.5 }).kriterien[0].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...st, hektar: 5 }).kriterien[0].stufe, "erschwert");
  assert.equal(pruefeFlaeche({ ...st, hektar: 5, widmung: "vorbelastet" }).kriterien[0].stufe, "pruefen");
  assert.match(pruefeFlaeche({ ...st, hektar: 15, widmung: "vorbelastet" }).kriterien[0].text, /Vorrangzone/);
});

test("Burgenland und Wien → mindestens gelb", () => {
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "burgenland" }).ampel, "gelb");
  assert.equal(pruefeFlaeche({ ...basis, bundesland: "wien" }).ampel, "gelb");
});

test("Größe: unter 0,2 ha erschwert, unter 0,5 ha prüfen", () => {
  assert.equal(pruefeFlaeche({ ...basis, hektar: 0.1 }).kriterien.find((k) => k.id === "groesse").stufe, "erschwert");
  assert.equal(pruefeFlaeche({ ...basis, hektar: 0.4 }).kriterien.find((k) => k.id === "groesse").stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, hektar: 0.5 }).kriterien.find((k) => k.id === "groesse").stufe, "gut");
});

test("Netz: lange Trasse bei kleiner Fläche erschwert", () => {
  const r = pruefeFlaeche({ ...basis, hektar: 1, netzKm: 5 });
  assert.equal(r.kriterien.find((k) => k.id === "netz").stufe, "erschwert");
  assert.equal(r.ampel, "gelb");
});

test("Gelände: Nordhang steil → rot, Südhang flach → gut", () => {
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "nord", neigung: 15 }).ampel, "rot");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "nord", neigung: 4 }).kriterien[3].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "sued", neigung: 12 }).kriterien[3].stufe, "gut");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "ostwest", neigung: 15 }).kriterien[3].stufe, "pruefen");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "sued", neigung: 30 }).kriterien[3].stufe, "erschwert");
  assert.equal(pruefeFlaeche({ ...basis, ausrichtung: "nord", neigung: 1 }).kriterien[3].stufe, "gut");
});

test("robuste Eingaben", () => {
  const r = pruefeFlaeche({ hektar: "abc", bundesland: "unbekannt" });
  assert.equal(r.kwp, 0);
  assert.equal(r.land.slug, LAENDER[0].slug);
  for (const w of WIDMUNGEN) for (const a of AUSRICHTUNGEN) {
    const x = pruefeFlaeche({ ...basis, widmung: w.id, ausrichtung: a.id, neigung: 10 });
    assert.ok(["gruen", "gelb", "rot"].includes(x.ampel));
    for (const k of x.kriterien) assert.ok(STUFEN[k.stufe], k.id);
  }
});

// ---------- Checkliste ----------
test("Checkliste mit eindeutigen IDs und gültigen Quellen", () => {
  assert.ok(CHECKLISTE.length >= 8);
  assert.equal(new Set(CHECKLISTE.map((c) => c.id)).size, CHECKLISTE.length);
  for (const c of CHECKLISTE) if (c.quelle) assert.match(c.quelle.url, /^https:\/\//);
});

// ---------- Netzschritt, Umspannwerke (OSM/ODbL) und Kapazitäts-Wegweiser (B06) ----------
test("Haversine: bekannte Strecken und Symmetrie", () => {
  // Wien Stephansplatz – Linz Hauptplatz ≈ 156 km Luftlinie
  const wien = { lat: 48.2085, lon: 16.3731 };
  const linz = { lat: 48.3059, lon: 14.2862 };
  const d = haversineKm(wien, linz);
  assert.ok(d > 153 && d < 157, `Wien–Linz ${d}`);
  assert.equal(haversineKm(wien, wien), 0);
  assert.ok(Math.abs(haversineKm(wien, linz) - haversineKm(linz, wien)) < 1e-9);
  // 1 Breitengrad ≈ 111,2 km
  const g = haversineKm({ lat: 47, lon: 13 }, { lat: 48, lon: 13 });
  assert.ok(Math.abs(g - 111.2) < 0.2, `1° = ${g}`);
});

test("nächstes Umspannwerk: Filter nach Spannung, Grobfilter ändert nichts", () => {
  const liste = [
    { n: "A", lat: 48.0, lon: 14.0, kv: 20 },
    { n: "B", lat: 48.05, lon: 14.0, kv: 110 },
    { n: null, lat: 48.5, lon: 14.0, kv: 380 },
    { n: "zu klein", lat: 48.001, lon: 14.0, kv: 10 },
  ];
  const p = { lat: 48.002, lon: 14.0 };
  assert.equal(naechstesUmspannwerk(p, liste).name, "A");
  assert.equal(naechstesUmspannwerk(p, { umspannwerke: liste }, { minKv: 110 }).name, "B");
  assert.equal(naechstesUmspannwerk(p, liste, { minKv: 220 }).name, null);
  assert.equal(naechstesUmspannwerk(null, liste), null);
  assert.equal(naechstesUmspannwerk(p, []), null);
  // Vergleich mit vollständiger Suche auf den echten Daten
  for (const q of [{ lat: 48.306, lon: 14.286 }, { lat: 47.07, lon: 15.44 }, { lat: 47.26, lon: 11.39 }, { lat: 46.62, lon: 14.31 }]) {
    const best = umspannwerkListe(UW).reduce((b, u) => {
      const km = haversineKm(q, u);
      return km < b.km ? { u, km } : b;
    }, { km: Infinity });
    assert.ok(Math.abs(naechstesUmspannwerk(q, UW).km - best.km) < 1e-9);
  }
});

test("netzVorschlag rundet auf 0,1 km und kappt am Reglerende", () => {
  const liste = [{ n: "Fern", lat: 48.2, lon: 14.0, kv: 110 }];
  const v = netzVorschlag({ lat: 48.0, lon: 14.0 }, liste);
  assert.equal(v.km, 10);
  assert.equal(v.gekappt, true);
  const nah = netzVorschlag({ lat: 48.19, lon: 14.0 }, liste);
  assert.equal(nah.km, Math.round(haversineKm({ lat: 48.19, lon: 14.0 }, liste[0]) * 10) / 10);
  assert.equal(nah.gekappt, false);
  assert.equal(nah.hoch.name, "Fern");
  assert.equal(netzVorschlag({ lat: 48, lon: 14 }, []), null);
});

test("Umspannwerk-Datei: ODbL-Kopf, plausible Werte, Download identisch", () => {
  assert.equal(UW._lizenz.hinweis, "© OpenStreetMap-Mitwirkende, ODbL");
  assert.equal(ODBL_HINWEIS, UW._lizenz.hinweis);
  assert.match(UW._lizenz.lizenzUrl, /opendatacommons\.org\/licenses\/odbl/);
  assert.match(UW.abruf, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(UW.anzahl, UW.umspannwerke.length);
  assert.ok(UW.anzahl > 500, "zu wenige Einträge");
  for (const u of UW.umspannwerke) {
    assert.ok(u.lat > 46.3 && u.lat < 49.1 && u.lon > 9.4 && u.lon < 17.2, `außerhalb AT: ${u.lat},${u.lon}`);
    assert.ok(u.kv >= 20 && u.kv <= 400, `Spannung ${u.kv}`);
    assert.equal(Math.round(u.lat * 1000) / 1000, u.lat);
    assert.equal(Math.round(u.lon * 1000) / 1000, u.lon);
    assert.ok(u.n === null || typeof u.n === "string");
    assert.equal(Object.keys(u).length, 4, "nur n/lat/lon/kv – keine Kapazitätsfelder");
  }
  const oeffentlich = fs.readFileSync(new URL("../public/daten/umspannwerke-at.json", import.meta.url), "utf8");
  const intern = fs.readFileSync(new URL("../src/data/umspannwerke-at.json", import.meta.url), "utf8");
  assert.equal(oeffentlich, intern, "Download muss der genutzten Datei entsprechen (Share-Alike)");
  const readme = fs.readFileSync(new URL("../public/daten/umspannwerke-at.README.txt", import.meta.url), "utf8");
  assert.match(readme, /© OpenStreetMap-Mitwirkende, ODbL/);
  assert.match(readme, /Open Database License/);
});

test("OSM-Skript: Spannung aus dem voltage-Tag", () => {
  assert.equal(hoechsteSpannung("110000;30000"), 110000);
  assert.equal(hoechsteSpannung("20000"), 20000);
  assert.equal(hoechsteSpannung("110 kV"), 110000);
  assert.equal(hoechsteSpannung("110"), 110000);
  assert.equal(hoechsteSpannung("30000000"), 0, "Tippfehler verwerfen");
  assert.equal(hoechsteSpannung(""), 0);
  assert.equal(hoechsteSpannung(undefined), 0);
  const j = aufbereiten(
    {
      elements: [
        { type: "node", lat: 48.12345, lon: 14.98765, tags: { voltage: "110000;20000", name: "UW Test" } },
        { type: "way", center: { lat: 47.5, lon: 13.5 }, tags: { voltage: "10000" } },
        { type: "way", center: { lat: 48.1234, lon: 14.9876 }, tags: { voltage: "110000" } },
      ],
    },
    "2026-10-12"
  );
  assert.equal(j.anzahl, 1, "Duplikat und < 20 kV entfernt");
  assert.deepEqual(j.umspannwerke[0], { n: "UW Test", lat: 48.123, lon: 14.988, kv: 110 });
  assert.equal(j._lizenz.hinweis, "© OpenStreetMap-Mitwirkende, ODbL");
});

test("Kapazitäts-Wegweiser: nur Links, Pflichtquellen vorhanden, keine Werte", () => {
  const slugs = KAPAZITAET_QUELLEN.map((q) => q.slug);
  for (const s of ["alle", "netz-niederoesterreich", "linz-netz", "salzburg-netz"]) assert.ok(slugs.includes(s), s);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(kapazitaetQuelleFuer("alle").url, "https://www.ebutilities.at/verfuegbare-netzanschlusskapazitaeten");
  for (const q of KAPAZITAET_QUELLEN) {
    assert.match(q.url, /^https:\/\//);
    assert.match(q.quelle.url, /^https:\/\//);
    assert.match(q.geprueftAm, /^\d{4}-\d{2}-\d{2}$/);
    for (const f of ["ebene", "aktualisierung", "format", "titel", "name"]) assert.ok(q[f], `${q.slug}: ${f}`);
    // keine Kapazitätswerte (MVA/MW/kVA-Zahlen) in den Daten
    assert.doesNotMatch(JSON.stringify(q), /\d+(?:[.,]\d+)?\s?(MVA|MW|kVA)\b/, `${q.slug}: Kapazitätswert?`);
  }
  assert.equal(kapazitaetQuelleFuer("wiener-netze").slug, "alle", "ohne eigene Seite → ebUtilities");
  assert.equal(hatEigeneKapazitaetsQuelle("linz-netz"), true);
  assert.equal(hatEigeneKapazitaetsQuelle("alle"), false);
  assert.equal(KAPAZITAET_PFAD, "/netzanmeldung/netzkapazitaet");
  assert.equal(KAPAZITAET_GATE, "netzkapazitaet");
  assert.deepEqual(kapazitaetQuellenFuerLand("salzburg").map((q) => q.slug), ["salzburg-netz", "alle"]);
  assert.deepEqual(kapazitaetQuellenFuerLand("tirol").map((q) => q.slug), ["alle"]);
  for (const land of Object.keys(KAPAZITAET_JE_LAND)) assert.ok(LAENDER.some((l) => l.slug === land), land);
});

test("Netz-Steckbrief: Punkt, Luftlinie, Links, Lizenz und Richtwert-Hinweis", () => {
  const vorschlag = netzVorschlag({ lat: 47.8, lon: 13.04 }, UW);
  const t = netzSteckbriefText({ punkt: { lat: 47.8, lon: 13.04 }, vorschlag, land: { slug: "salzburg", name: "Salzburg" }, datum: "12.10.2026", basisUrl: "https://www.oekovolt.com" });
  assert.match(t, /47\.80000, 13\.04000/);
  assert.match(t, /Richtwert\/Orientierung/);
  assert.match(t, /© OpenStreetMap-Mitwirkende, ODbL/);
  assert.match(t, /salzburgnetz\.at/);
  assert.match(t, /ebutilities\.at/);
  assert.match(t, /Luftlinie ist nicht gleich Trassenlänge/);
  assert.match(t, /https:\/\/www\.oekovolt\.com\/netzanmeldung\/netzkapazitaet/);
});

process.stdout.write(`\n${n} Tests bestanden.\n`);
