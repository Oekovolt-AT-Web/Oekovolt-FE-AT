// Tests für Paket C05 (Bestand & Service): src/data/stoerungen.js, src/data/betriebsfuehrung.js,
// src/components/Repowering/tarifRechnung.js, src/components/AnlagenCheck/auswertung.js
// Aufruf: node scripts/bestand-service.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DRINGLICHKEIT, HERSTELLER, HERSTELLER_SLUGS, STOERUNGEN, datumDe, freigegebeneStoerungen, stoerungFuer, stoerungStaticParams, stoerungZaehler } from "../src/data/stoerungen.js";
import { ABLAUF, ANFRAGE_VORHABEN, LEISTUNGSSTUFEN, freigegebeneStufen } from "../src/data/betriebsfuehrung.js";
import { TARIF_JAHRE, restText, tarifAuslauf } from "../src/components/Repowering/tarifRechnung.js";
import { AMPEL, BEISPIEL, BEISPIEL_MUSTER, ampelFuer, beispielAuswertung, bewerte, csvExport, ghiMonatsSummen, klimaGhiMonate, leseMonat, leseZahl, parseMonatswerte, sollMonate, wetterFaktoren } from "../src/components/AnlagenCheck/auswertung.js";

const pvgis = JSON.parse(readFileSync(new URL("../src/data/regionen-pvgis.json", import.meta.url), "utf8"));
const ORT = pvgis.orte.ostermiething;

let n = 0;
const test = (name, fn) => {
  fn();
  n++;
  console.log(`ok ${n} – ${name}`);
};
const nah = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `${a} ≠ ${b}`);

// ------------------------------------------------------------ Fehlercode-Hub
test("20–30 Einträge, nur Fronius und Huawei, Codes je Hersteller eindeutig", () => {
  assert.ok(STOERUNGEN.length >= 20 && STOERUNGEN.length <= 30, `Anzahl ${STOERUNGEN.length}`);
  assert.deepEqual(HERSTELLER_SLUGS.sort(), ["fronius", "huawei"]);
  const schluessel = new Set();
  for (const e of STOERUNGEN) {
    assert.ok(HERSTELLER[e.hersteller], `unbekannter Hersteller ${e.hersteller}`);
    const k = `${e.hersteller}/${e.code}`;
    assert.ok(!schluessel.has(k), `doppelt: ${k}`);
    schluessel.add(k);
  }
});

test("jeder Eintrag vollständig: Felder, Quelle (Titel, URL, Version, Abrufdatum), Dringlichkeit", () => {
  for (const e of STOERUNGEN) {
    assert.ok(e.code && e.titel && e.bedeutung, `unvollständig: ${e.code}`);
    assert.ok(Array.isArray(e.ursachen) && e.ursachen.length >= 1);
    assert.ok(Array.isArray(e.darf_betreiber_pruefen) && e.darf_betreiber_pruefen.length >= 1);
    assert.equal(typeof e.elektrofachkraft_noetig, "boolean");
    assert.ok(DRINGLICHKEIT[e.dringlichkeit], `Dringlichkeit ${e.dringlichkeit}`);
    assert.ok(e.quelle?.titel && /^https:\/\//.test(e.quelle.url) && e.quelle.version && /^\d{4}-\d{2}-\d{2}$/.test(e.quelle.abgerufen), `Quelle fehlt: ${e.code}`);
  }
});

test("Freigabe-Flag: alle Einträge tragen freigabe_elektrofachkraft:false → keine Detailseite, keine Static Params", () => {
  for (const e of STOERUNGEN) assert.equal(e.freigabe_elektrofachkraft, false, `${e.code} ohne Freigabe-Flag false`);
  assert.deepEqual(stoerungStaticParams(), []);
  assert.deepEqual(freigegebeneStoerungen(), []);
  assert.equal(stoerungFuer("fronius", "102"), null);
  assert.equal(stoerungFuer("huawei", "2034"), null);
});

test("Freigabe-Mechanik: nur freigegebene Einträge liefern Route und Zähler", () => {
  const liste = STOERUNGEN.map((e, i) => (i === 0 ? { ...e, freigabe_elektrofachkraft: true } : e));
  const params = stoerungStaticParams(liste);
  assert.equal(params.length, 1);
  assert.deepEqual(params[0], { hersteller: liste[0].hersteller, code: liste[0].code });
  assert.equal(stoerungFuer(liste[0].hersteller, liste[0].code, liste)?.code, liste[0].code);
  assert.equal(stoerungFuer(liste[0].hersteller, liste[1].code, liste), null);
  const z = stoerungZaehler(liste).find((x) => x.hersteller === liste[0].hersteller);
  assert.equal(z.freigegeben, 1);
  // Wert "true" als String zählt nicht
  assert.deepEqual(stoerungStaticParams([{ ...STOERUNGEN[0], freigabe_elektrofachkraft: "true" }]), []);
});

test("keine DC-Arbeitsanleitungen in Betreiber-Prüfpunkten, keine Partnerschafts-Formulierungen", () => {
  const verboten = /abklemmen|abstecken|stecker (lösen|trennen|ziehen)|sicherung (tauschen|wechseln|ziehen)|gehäuse öffnen|deckel (öffnen|abnehmen)|dc-schalter (betätigen|umlegen)|leitung lösen/i;
  const partner = /partner|zertifiziert|autorisiert|offiziell|freigegeben vom hersteller/i;
  for (const e of STOERUNGEN) {
    for (const p of e.darf_betreiber_pruefen) assert.ok(!verboten.test(p), `DC-Anleitung in ${e.code}: ${p}`);
    assert.ok(!partner.test(e.bedeutung) && !partner.test(e.titel), `Partner-Formulierung in ${e.code}`);
  }
  for (const h of Object.values(HERSTELLER)) assert.ok(!partner.test(h.beschreibung), `Partner-Formulierung bei ${h.name}`);
});

test("Netzspannungs-Codes tragen qu:true (Q(U)-Erklärung)", () => {
  const qu = STOERUNGEN.filter((e) => e.qu === true).map((e) => `${e.hersteller}/${e.code}`);
  assert.ok(qu.includes("fronius/102") && qu.includes("huawei/2034"), qu.join(","));
});

// ------------------------------------------------------------ Betriebsführung
test("Leistungsstufen: ohne Freigabe nichts sichtbar, keine Preise und keine Reaktionszeiten hinterlegt", () => {
  assert.deepEqual(freigegebeneStufen(), []);
  for (const s of LEISTUNGSSTUFEN) {
    assert.equal(s.freigegeben, false);
    assert.equal(s.reaktionszeit, "", `SLA ohne Freigabe: ${s.id}`);
    assert.equal(s.preisHinweis, "", `Preis ohne Freigabe: ${s.id}`);
  }
  assert.equal(freigegebeneStufen([{ ...LEISTUNGSSTUFEN[0], freigegeben: true }]).length, 1);
  assert.equal(freigegebeneStufen([{ ...LEISTUNGSSTUFEN[0], freigegeben: "ja" }]).length, 0);
});

test("Ablauf: fünf Schritte in Auftragsreihenfolge, ohne Preise; Vorhaben-Kennung der Angebots-API", () => {
  assert.deepEqual(
    ABLAUF.map((s) => s.id),
    ["unterlagen", "e-check", "thermografie", "scada", "angebot"]
  );
  for (const s of ABLAUF) assert.ok(!/€|euro|werktag|stunden reaktions/i.test(`${s.text} ${s.kurz}`), `Preis/SLA im Ablauf: ${s.id}`);
  assert.deepEqual(ANFRAGE_VORHABEN, ["service"]);
});

test("keine Nennung einzelner Errichterfirmen in den Betriebsführungs-Daten", () => {
  const text = readFileSync(new URL("../src/data/betriebsfuehrung.js", import.meta.url), "utf8");
  assert.ok(!/GmbH(?!\))|insolven[a-z]* (Firma|Firmen) [A-Z]/i.test(text.replace(/Ökovolt Solartechnik GmbH/g, "")), "Firmenname in betriebsfuehrung.js");
});

// ------------------------------------------------------------ Tarifauslauf
test("Tarifauslauf: 13 Jahre, Phasen laeuft / bald / abgelaufen, Restlaufzeit-Text", () => {
  assert.equal(TARIF_JAHRE, 13);
  const jetzt = { jahr: 2026, monat: 10 };
  const a = tarifAuslauf({ jahr: 2012, monat: 6, kwp: 50, jetzt });
  assert.deepEqual(a.ende, { jahr: 2025, monat: 6 });
  assert.equal(a.phase, "abgelaufen");
  assert.equal(a.restMonate, -16);
  assert.equal(restText(a.restMonate), "seit 1 Jahr und 4 Monaten abgelaufen");

  const b = tarifAuslauf({ jahr: 2014, monat: 3, kwp: 50, jetzt });
  assert.deepEqual(b.ende, { jahr: 2027, monat: 3 });
  assert.equal(b.phase, "bald");
  assert.equal(restText(b.restMonate), "noch 5 Monate");
  assert.equal(restText(-3), "seit 3 Monaten abgelaufen");
  assert.equal(restText(-24), "seit 2 Jahren abgelaufen");
  assert.equal(restText(0), "seit wenigen Wochen abgelaufen");

  const c = tarifAuslauf({ jahr: 2020, monat: 1, kwp: 20, jetzt });
  assert.equal(c.phase, "laeuft");
  assert.equal(c.ende.jahr, 2033);
  assert.equal(restText(c.restMonate), "noch 6 Jahre und 3 Monate");
});

test("Tarifauslauf: Optionen nach Alter und Leistung, Ertrag mit Alterung begrenzt", () => {
  const jetzt = { jahr: 2026, monat: 10 };
  const alt = tarifAuslauf({ jahr: 2010, monat: 7, kwp: 600, jetzt });
  const o = Object.fromEntries(alt.optionen.map((x) => [x.id, x]));
  assert.equal(o.repowering.passt, "empfohlen");
  assert.equal(o.speicher.passt, "empfohlen");
  assert.equal(o.eigenverbrauch.passt, "empfohlen");
  assert.equal(o.direktvermarktung.passt, "empfohlen");
  assert.match(o.direktvermarktung.grund, /500 kWp/);
  assert.ok(alt.wrAlt);
  nah(alt.ertragRichtwert, 600 * 1000 * (1 - 0.005 * alt.alterJahre), 1e-6);

  const jung = tarifAuslauf({ jahr: 2024, monat: 7, kwp: 30, jetzt });
  const j = Object.fromEntries(jung.optionen.map((x) => [x.id, x]));
  assert.equal(j.repowering.passt, "bedingt");
  assert.equal(j.direktvermarktung.passt, "moeglich");
  assert.ok(!jung.wrAlt);
  // Alterungsfaktor nie unter 0,7 (ab rund 60 Jahren greift die Untergrenze)
  const uralt = tarifAuslauf({ jahr: 1960, monat: 1, kwp: 10, jetzt });
  nah(uralt.ertragRichtwert, 10 * 1000 * 0.7, 1e-6);
});

// ------------------------------------------------------------ Anlagen-Check
test("Zahlen und Monate lesen: Komma, Tausenderpunkt, kWh, Datumsformate, Monatsnamen", () => {
  assert.equal(leseZahl("1.234,5"), 1234.5);
  assert.equal(leseZahl("1,234.5"), 1234.5);
  assert.equal(leseZahl("412 kWh"), 412);
  assert.equal(leseZahl("abc"), null);
  assert.equal(leseZahl("-3"), null);
  assert.equal(leseMonat("2025-03"), 2);
  assert.equal(leseMonat("2025-03-01"), 2);
  assert.equal(leseMonat("03.2025"), 2);
  assert.equal(leseMonat("01.03.2025"), 2);
  assert.equal(leseMonat("3/2025"), 2);
  assert.equal(leseMonat("März"), 2);
  assert.equal(leseMonat("Jän"), 0);
  assert.equal(leseMonat("Dec"), 11);
  assert.equal(leseMonat("12"), 11);
  assert.equal(leseMonat("13"), -1);
  assert.equal(leseMonat("egal"), -1);
});

test("parseMonatswerte: zwölf Zahlen, Monat;kWh mit Kopfzeile, Summierung je Monat, Fehlerzeilen", () => {
  const a = parseMonatswerte("48 71 102 121 123 130 133 124 107 85 53 45");
  assert.equal(a.erkannt, "zahlen");
  assert.equal(a.werte[0], 48);
  assert.equal(a.werte[11], 45);

  const b = parseMonatswerte("Monat;kWh\n2025-01;412\n2025-02;690,5\n2025-02;9,5\nquatsch\n");
  assert.equal(b.erkannt, "monate");
  assert.equal(b.werte[0], 412);
  assert.equal(b.werte[1], 700);
  assert.equal(b.werte[2], null);
  assert.equal(b.fehler.length, 1);
  assert.match(b.fehler[0], /quatsch/);

  const c = parseMonatswerte("März\t1.234\nApril 1500");
  assert.equal(c.werte[2], 1234);
  assert.equal(c.werte[3], 1500);

  assert.equal(parseMonatswerte("").erkannt, "leer");
  assert.equal(parseMonatswerte("nur text").erkannt, "leer");
});

test("Soll-Werte: Süd = PVGIS-Monatswerte × kWp × Alterung; Wetterfaktor skaliert je Monat", () => {
  const soll = sollMonate({ ort: ORT, ausrichtung: "sued", kwp: 10, alterJahre: 0 });
  nah(soll[0], 480, 1e-9);
  nah(soll[6], 1330, 1e-9);
  const alt = sollMonate({ ort: ORT, ausrichtung: "sued", kwp: 10, alterJahre: 10 });
  nah(alt[0], 480 * 0.95, 1e-9);
  const f = Array(12).fill(null);
  f[0] = 1.2;
  const wetter = sollMonate({ ort: ORT, ausrichtung: "sued", kwp: 10, alterJahre: 0, faktoren: f });
  nah(wetter[0], 480 * 1.2, 1e-9);
  nah(wetter[1], 710, 1e-9);
  // Ost/West: Jahressumme entspricht dem PVGIS-Jahreswert der Ausrichtung
  const ow = sollMonate({ ort: ORT, ausrichtung: "ostwest", kwp: 1, alterJahre: 0 });
  nah(ow.reduce((x, y) => x + y, 0), ORT.ostwest15_kwh_kwp, 1e-6);
});

test("Wetterfaktoren: Klimamonate summieren zum PVGIS-Jahreswert, Faktor begrenzt 0,6–1,5, Monate ohne Messung null", () => {
  const klima = klimaGhiMonate(ORT);
  nah(klima.reduce((a, b) => a + b, 0), ORT.einstrahlung_kwh_m2, 1e-6);
  const mess = klima.map((k, m) => (m === 0 ? k * 0.3 : m === 1 ? k * 2 : m === 2 ? null : k * 1.1));
  const f = wetterFaktoren(ORT, mess);
  nah(f[0], 0.6);
  nah(f[1], 1.5);
  assert.equal(f[2], null);
  nah(f[3], 1.1);
  assert.equal(wetterFaktoren(ORT, null), null);
});

test("ghiMonatsSummen: W/m² je Stunde → kWh/m² je Monat, nur Monate mit ≥ 20 Tagen", () => {
  const stunden = [];
  for (let tag = 1; tag <= 31; tag++) for (let h = 0; h < 24; h++) stunden.push({ zeit: Date.UTC(2025, 0, tag, h), gl: 100 });
  for (let tag = 1; tag <= 5; tag++) stunden.push({ zeit: Date.UTC(2025, 1, tag, 12), gl: 500 });
  stunden.push({ zeit: Date.UTC(2024, 0, 1, 12), gl: 9999 }); // anderes Jahr → ignoriert
  const s = ghiMonatsSummen(stunden, 2025);
  nah(s[0], 31 * 24 * 0.1, 1e-9);
  assert.equal(s[1], null);
});

test("Bewertung: Ampelgrenzen, Nullmonate, Winter-Muster, Sommer-Muster, einzelner Einbruch, ohne Daten", () => {
  assert.equal(ampelFuer(0.95), "gruen");
  assert.equal(ampelFuer(AMPEL.gruen), "gruen");
  assert.equal(ampelFuer(0.8), "gelb");
  assert.equal(ampelFuer(0.5), "rot");
  assert.equal(ampelFuer(null), "grau");

  const soll = sollMonate({ ort: ORT, ausrichtung: "sued", kwp: 10, alterJahre: 0 });
  const leer = bewerte({ ist: Array(12).fill(null), soll });
  assert.equal(leer.jahr.ampel, "grau");
  assert.equal(leer.pruefpunkte.length, 0);

  const gut = bewerte({ ist: soll.map((s) => s * 0.97), soll });
  assert.equal(gut.jahr.ampel, "gruen");
  assert.deepEqual(
    gut.pruefpunkte.map((p) => p.id),
    ["ok"]
  );

  const winter = bewerte({ ist: soll.map((s, m) => ([0, 1, 10, 11].includes(m) ? s * 0.4 : s * 0.98)), soll });
  assert.ok(winter.pruefpunkte.some((p) => p.id === "winter"));

  const sommer = bewerte({ ist: soll.map((s, m) => ([4, 5, 6, 7].includes(m) ? s * 0.6 : s * 0.98)), soll });
  assert.ok(sommer.pruefpunkte.some((p) => p.id === "sommer"));

  const nullMonat = bewerte({ ist: soll.map((s, m) => (m === 5 ? 0 : s)), soll });
  assert.ok(nullMonat.pruefpunkte.some((p) => p.id === "ausfall" && /Jun/.test(p.titel)));

  const einbruch = bewerte({ ist: soll.map((s, m) => (m === 3 ? s * 0.5 : s * 0.95)), soll });
  assert.ok(einbruch.pruefpunkte.some((p) => p.id === "einbruch-3"));

  const rot = bewerte({ ist: soll.map((s) => s * 0.5), soll });
  assert.equal(rot.jahr.ampel, "rot");
  assert.ok(rot.pruefpunkte.some((p) => p.id === "gesamt-rot"));

  // kein Urteil über den Errichter
  for (const e of [winter, sommer, nullMonat, einbruch, rot]) for (const p of e.pruefpunkte) assert.ok(!/errichter|installateur|pfusch|mangelhaft montiert/i.test(`${p.titel} ${p.text}`), p.id);
});

test("CSV-Export: Kopf, zwölf Monatszeilen, Jahreszeile, Richtwert-Hinweis", () => {
  const soll = sollMonate({ ort: ORT, ausrichtung: "sued", kwp: 10, alterJahre: 0 });
  const erg = bewerte({ ist: soll.map((s) => s * 0.9), soll });
  const csv = csvExport({ ergebnis: erg, meta: { stand: "11.10.2026", ort: "Ostermiething", kwp: 10, ausrichtung: "Süd, 35°", jahr: 2015, wetter: false } });
  const zeilen = csv.split("\n");
  assert.match(zeilen[0], /^Anlagen-Check Ökovolt;Stand 11\.10\.2026$/);
  assert.equal(zeilen.filter((z) => /^(Jän|Feb|Mär|Apr|Mai|Jun|Jul|Aug|Sep|Okt|Nov|Dez);/.test(z)).length, 12);
  assert.ok(zeilen.some((z) => z.startsWith("Jahr (12 Monate);")));
  assert.match(csv, /Richtwert zur Orientierung/);
  assert.match(csv, /Klimamittel/);
});

test("Beispielvorschau: frei gewähltes Muster, zwölf Monate, zeigt Prüfpunkte", () => {
  assert.equal(BEISPIEL_MUSTER.length, 12);
  assert.equal(beispielAuswertung(null), null);
  const b = beispielAuswertung(ORT);
  assert.equal(b.ergebnis.jahr.monate, 12);
  assert.ok(b.ergebnis.pruefpunkte.some((p) => p.id === "winter"), "Winter-Muster soll sichtbar sein");
  assert.equal(BEISPIEL.ortSlug, "ostermiething");
});

test("Lead-Gate Stufe 2: Anlagen-Check wertet erst nach Freischaltung aus, Gate sendet keine Monatswerte", () => {
  const q = readFileSync(new URL("../src/components/AnlagenCheck/AnlagenCheck.js", import.meta.url), "utf8");
  assert.match(q, /if \(!frei \|\| !ort\) return null;/, "eigene Auswertung nur nach Freischaltung");
  assert.match(q, /if \(!frei \|\| !eigen\) return;/, "Export nur nach Freischaltung");
  assert.match(q, /\/api\/lead-gate\/status/);
  assert.match(q, /aktion: "auswertung"/);
  assert.match(q, /bestaetigung: "email"/);
  assert.match(q, /ERNEUT_SEKUNDEN = 60/);
  assert.match(q, /Spam-Ordner/);
  assert.match(q, /Bitte E-Mail bestätigen/);
  assert.match(q, /ENTWICKLUNG && ohneBackoffice/, "Simulation nur in Entwicklung ohne Backoffice");
  assert.ok(!/ov-lead-frei/.test(q), "alte Export-Freischaltung entfernt");
  // Ergebnisansicht mit eigenen Werten nur im Zweig „frei && eigen“
  assert.match(q, /\{frei && eigen \? \(/);
  // An das Gate gehen nur Eckdaten der Anlage
  const start = q.indexOf("const gateKontext");
  const kontext = q.slice(start, q.indexOf("return (", start));
  assert.ok(!/\bwerte\b|\bist\b|\bsoll\b|quote|ergebnis\.jahr/.test(kontext), "keine Monatswerte/Ergebnisse im Gate-Kontext");
});

test("Lead-Gate Stufe 2: Serverstatus maßgeblich, kein Ersatzweg über create_contact, Quellen ohne Arbeitsvermerk", () => {
  const q = readFileSync(new URL("../src/components/AnlagenCheck/AnlagenCheck.js", import.meta.url), "utf8");
  assert.ok(!/\/api\/create_contact/.test(q), "kein Ersatzweg über /api/create_contact");
  assert.ok(!/einwilligung: 1/.test(q), "keine Einwilligung behaupten, die nicht abgefragt wird");
  // lokale Merkung nur im Entwicklungsmodus ohne Status-Route
  assert.match(q, /if \(ENTWICKLUNG && \(ausLink \|\| gateBestaetigt\(\)\)\) onFrei\(\);/);
  assert.equal((q.match(/(?<!function )gateBestaetigt\(\)/g) || []).length, 1, "gateBestaetigt nur im Entwicklungs-Rückfall");
  assert.match(q, /versand === "team"/, "ehrlicher Text, wenn das Team den Link schickt");
  for (const h of Object.values(HERSTELLER)) {
    assert.ok(!/vor Freigabe|prüfen\b/i.test(`${h.quelle.titel} ${h.quelle.version}`), `öffentlicher Arbeitsvermerk: ${h.slug}`);
  }
  assert.equal(datumDe("2026-10-12"), "12.10.2026");
});

console.log(`\n${n} Tests grün – bestand-service`);
