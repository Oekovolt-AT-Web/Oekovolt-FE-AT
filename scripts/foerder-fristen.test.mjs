// Tests für die Förder-Aktualitätsmaschine (C01): src/lib/programmStatus.js,
// Datumsfelder in bund.js / bundeslaender.js / programme.js, Ticker, Fristen, ICS und RSS.
//
// Aufruf: node scripts/foerder-fristen.test.mjs
// Schlägt fehl, wenn ein Statustext „laufend“ bei vergangener Frist behauptet, ein
// Prüfdatum (geprueftAm) älter als 35 Tage ist oder ein Eintrag mit pruefen:true älter
// als 60 Tage. Prüfzeitpunkt ist die echte Uhr; FOERDER_TEST_JETZT=2026-10-11 setzt ihn fest.
// Ohne Abhängigkeiten (node:test, node:assert); Pfad-Aliase über scripts/lib/alias.mjs.

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { srcUrl } from "./lib/alias.mjs";

const S = await import(srcUrl("lib/programmStatus.js"));
const { programmStatus, tagEnde, tagStart, pruefungVeraltet, behauptetLaufend, naechsterTermin, alterTage } = S;
const bund = await import(srcUrl("components/Forderungen/Shared/bund.js"));
const { BUNDESLAENDER, STAND } = await import(srcUrl("data/bundeslaender.js"));
const BUND_MODUL = await import(srcUrl("components/Foerdercheck/programme.js"));
const { BUND, ermittleProgramme, laenderFuerCheck } = BUND_MODUL;
const ticker = await import(srcUrl("data/foerderTicker.js"));
const fristen = await import(srcUrl("data/foerderFristen.js"));
const ics = await import(srcUrl("app/forderungen/fristen.ics/route.js"));
const rssRoute = await import(srcUrl("app/forderungen/aktuell/rss.xml/route.js"));

const JETZT = process.env.FOERDER_TEST_JETZT ? Date.parse(`${process.env.FOERDER_TEST_JETZT}T12:00:00+02:00`) : Date.now();
const T = (s) => Date.parse(s);
const ISO = /^\d{4}-\d{2}-\d{2}$/;

/* ------------------------------------------------------------------ reine Logik */

test("tagStart/tagEnde: Kalendertage in Wien, Sommer- und Winterzeit", () => {
  assert.equal(tagStart("2026-10-22"), T("2026-10-22T00:00:00+02:00"));
  assert.equal(tagEnde("2026-10-22"), T("2026-10-23T00:00:00+02:00"));
  assert.equal(tagEnde("2026-12-31"), T("2027-01-01T00:00:00+01:00"));
  assert.equal(tagEnde("2026-10-25"), T("2026-10-26T00:00:00+01:00")); // Zeitumstellung 25.10.2026
  assert.ok(Number.isNaN(tagStart("")));
  assert.ok(Number.isNaN(tagStart("31.10.2026")));
});

test("programmStatus: Frist vorbei → abgelaufen, auch ohne Deploy (gesetztes Datum)", () => {
  const p = { fristIso: "2026-10-22", status: "laufend" };
  assert.equal(programmStatus(p, T("2026-10-22T23:59:00+02:00")), "bald");
  assert.equal(programmStatus(p, T("2026-10-23T00:00:00+02:00")), "abgelaufen");
  assert.equal(programmStatus(p, T("2027-05-01T00:00:00+02:00")), "abgelaufen");
  assert.equal(programmStatus({ gueltigBisIso: "2026-12-31" }, T("2027-01-01T00:00:00+01:00")), "abgelaufen");
  assert.equal(programmStatus({ gueltigBisIso: "2026-12-31" }, T("2026-12-31T23:00:00+01:00")), "bald");
});

test("programmStatus: bald (30 Tage), offen, wartet, redaktionelle Einordnung", () => {
  assert.equal(programmStatus({ fristIso: "2026-12-10" }, T("2026-10-11T12:00:00+02:00")), "offen");
  assert.equal(programmStatus({ fristIso: "2026-11-09" }, T("2026-10-11T12:00:00+02:00")), "bald");
  assert.equal(programmStatus({ startIso: "2026-11-01" }, T("2026-10-11T12:00:00+02:00")), "wartet");
  assert.equal(programmStatus({ startIso: "2026-11-01" }, T("2026-11-01T00:00:00+01:00")), "offen");
  assert.equal(programmStatus({ anzeigeStatus: "pausiert" }, JETZT), "wartet");
  assert.equal(programmStatus({ anzeigeStatus: "angekuendigt", gueltigBisIso: "2026-12-31" }, T("2026-10-11T12:00:00+02:00")), "wartet");
  assert.equal(programmStatus({ anzeigeStatus: "angekuendigt", gueltigBisIso: "2026-12-31" }, T("2027-01-02T12:00:00+01:00")), "abgelaufen");
  assert.equal(programmStatus({ anzeigeStatus: "beendet" }, JETZT), "abgelaufen");
  assert.equal(programmStatus({}, JETZT), "offen");
  assert.equal(programmStatus(null, JETZT), "offen");
  assert.equal(programmStatus({ fristIso: "2026-10-22" }, NaN), programmStatus({ fristIso: "2026-10-22" }));
});

test("naechsterTermin und pruefungVeraltet", () => {
  assert.deepEqual(naechsterTermin({ startIso: "2026-11-01", fristIso: "2027-03-10" }, T("2026-10-11T12:00:00+02:00")), { iso: "2026-11-01", art: "start" });
  assert.deepEqual(naechsterTermin({ startIso: "2026-10-01", fristIso: "2027-03-10" }, T("2026-10-11T12:00:00+02:00")), { iso: "2027-03-10", art: "frist" });
  assert.equal(naechsterTermin({}, JETZT), null);
  assert.equal(alterTage("2026-10-01", T("2026-10-11T12:00:00+02:00")), 10);
  assert.equal(pruefungVeraltet({ geprueftAm: "2026-10-01" }, T("2026-10-11T12:00:00+02:00")).ok, true);
  assert.equal(pruefungVeraltet({ geprueftAm: "2026-09-01" }, T("2026-10-11T12:00:00+02:00")).ok, false);
  assert.equal(pruefungVeraltet({ geprueftAm: "2026-09-20", pruefen: true }, T("2026-11-25T12:00:00+01:00")).ok, false);
  assert.equal(pruefungVeraltet({}, JETZT).ok, false);
  assert.equal(behauptetLaufend("laufend 2026"), true);
  assert.equal(behauptetLaufend("Einreichfrist endete am 30.09.2026"), false);
});

/* ------------------------------------------------------------------ Daten */

function alleProgramme() {
  const liste = [];
  for (const [key, land] of Object.entries(BUNDESLAENDER)) for (const p of land.programme) liste.push({ ort: `bundeslaender.${key}`, p });
  for (const p of bund.KPC_PROGRAMME) liste.push({ ort: `bund.KPC.${p.id}`, p });
  for (const c of bund.EAG_IZ.calls) liste.push({ ort: `bund.EAG_IZ.call${c.nr}`, p: c });
  for (const t of bund.MARKTPRAEMIE.termine) liste.push({ ort: `bund.MARKTPRAEMIE.${t.datum}`, p: t });
  liste.push({ ort: "bund.STEUER.ifb", p: bund.STEUER.ifb });
  for (const p of BUND) liste.push({ ort: `programme.BUND.${p.id}`, p });
  return liste;
}

test("Datumsfelder: ISO-Format, Start vor Frist, Felder nur übertragen", () => {
  for (const { ort, p } of alleProgramme()) {
    for (const k of ["startIso", "fristIso", "gueltigBisIso", "geprueftAm"]) if (p[k] !== undefined) assert.match(p[k], ISO, `${ort}.${k}`);
    if (p.startIso && p.fristIso) assert.ok(p.startIso <= p.fristIso, `${ort}: Start nach Frist`);
    if (p.startIso && p.gueltigBisIso) assert.ok(p.startIso <= p.gueltigBisIso, `${ort}: Start nach Laufzeitende`);
    if (p.anzeigeStatus) assert.ok(["pausiert", "angekuendigt", "beendet"].includes(p.anzeigeStatus), `${ort}: anzeigeStatus`);
  }
});

test("Kein Statustext behauptet „laufend“ bei vergangener Frist", () => {
  const fehler = [];
  for (const { ort, p } of alleProgramme()) {
    const st = programmStatus(p, JETZT);
    if (st === "abgelaufen" && behauptetLaufend(p.status)) fehler.push(`${ort}: „${p.status}“ – Frist ${p.fristIso || p.gueltigBisIso} ist vorbei`);
  }
  assert.deepEqual(fehler, []);
});

test("Jedes Programm trägt geprueftAm; keines älter als 35 Tage, pruefen:true keines älter als 60 Tage", () => {
  const fehler = [];
  for (const { ort, p } of alleProgramme()) {
    const r = pruefungVeraltet(p, JETZT);
    if (!r.ok) fehler.push(`${ort}: ${r.grund} (Grenze ${r.grenze} Tage, geprüft ${p.geprueftAm || "nie"})`);
  }
  assert.deepEqual(fehler, [], "Prüfdaten erneuern: Quellen abrufen, Werte vergleichen, geprueftAm setzen");
});

test("Sofort-Welle bleibt maßgeblich: STAND und bekannte Korrekturen unverändert", () => {
  assert.equal(STAND.iso, "2026-09-29");
  assert.equal(bund.EAG_IZ.naechsterCall.zeitraum, "08.10.–22.10.2026");
  assert.equal(bund.STEUER.ifb.gueltigBisIso, "2026-12-31");
  assert.equal(BUNDESLAENDER.niederoesterreich.programme[0].anzeigeStatus, "pausiert");
  assert.equal(bund.OEMAG_MARKTPREIS.werte.at(-1)[1], "10,168");
});

test("Förder-Check: Status wird zur Laufzeit je Programm berechnet (jetzt-Parameter)", () => {
  const land = laenderFuerCheck().find((l) => l.key === "steiermark");
  const vor = ermittleProgramme({ land, vorhaben: ["pv-dach", "speicher"], zielgruppe: "unternehmen", jetzt: T("2026-10-11T12:00:00+02:00") });
  const nach = ermittleProgramme({ land, vorhaben: ["pv-dach", "speicher"], zielgruppe: "unternehmen", jetzt: T("2026-10-23T12:00:00+02:00") });
  const eag = (e) => e.bund.find((p) => p.id === "eag-iz");
  assert.equal(eag(vor).status, "bald");
  assert.equal(eag(nach).status, "abgelaufen");
  assert.match(eag(nach).bedingungen[0], /abgelaufen/);
  assert.ok(nach.abgelaufen >= 1);
  const speicher = vor.land.find((p) => /Innovative Energiespeicher 2026/.test(p.name));
  assert.ok(speicher, "Steiermark Speicher 2026 im Förder-Check");
  assert.equal(speicher.status, "offen");
});

/* ------------------------------------------------------------------ Ticker */

test("Ticker: jeder Eintrag mit amtlicher https-Quelle, Status, Typ, Datum, Seiten, Prüfdatum", () => {
  const ids = new Set();
  assert.ok(ticker.FOERDER_TICKER.length >= 8);
  for (const e of ticker.FOERDER_TICKER) {
    assert.ok(!ids.has(e.id), `doppelte id ${e.id}`);
    ids.add(e.id);
    assert.match(e.datum, ISO, e.id);
    assert.match(e.geprueftAm, ISO, e.id);
    assert.ok(Object.keys(ticker.TICKER_TYPEN).includes(e.typ), `${e.id}: typ`);
    assert.ok(Object.keys(ticker.TICKER_STATUS).includes(e.status), `${e.id}: status`);
    assert.match(e.quelle?.url || "", /^https:\/\//, `${e.id}: quelle.url`);
    assert.ok(e.quelle.label.length > 8, `${e.id}: quelle.label`);
    assert.ok(e.titel.length >= 20 && e.kurz.length >= 60, `${e.id}: Titel/Kurztext`);
    assert.ok(Array.isArray(e.seiten) && e.seiten.every((s) => s.startsWith("/")), `${e.id}: seiten`);
    assert.ok(e.zielgruppen.every((z) => ticker.TICKER_ZIELGRUPPEN.includes(z)), `${e.id}: zielgruppen`);
    assert.ok(e.bundesland === "bund" || BUNDESLAENDER[e.bundesland], `${e.id}: bundesland`);
    assert.ok(pruefungVeraltet(e, JETZT).ok, `${e.id}: Prüfdatum veraltet`);
    // Angekündigtes darf keine Prozentsätze als Fakt tragen
    if (e.status === "angekuendigt") assert.doesNotMatch(e.kurz, /\b\d{1,2} ?% (Zuschuss|Bonus)\b/, `${e.id}: Prozentsatz in Ankündigung`);
  }
  const sortiert = ticker.tickerEintraege();
  for (let i = 1; i < sortiert.length; i += 1) assert.ok(sortiert[i - 1].datum >= sortiert[i].datum, "Sortierung neueste zuerst");
  assert.ok(ticker.tickerEintraege({ bundesland: "steiermark" }).some((e) => e.bundesland === "steiermark"));
  assert.ok(ticker.tickerEintraege({ bundesland: "steiermark" }).every((e) => e.bundesland === "bund" || e.bundesland === "steiermark"));
  assert.equal(ticker.tickerEintraege({ typ: "korrektur" }).length >= 1, true);
});

/* ------------------------------------------------------------------ Fristen + Kalender */

test("Fristen: stabile ids, ISO-Daten, Quellen, Zielgruppen; gleitendes Fenster −2/+10", () => {
  const ids = new Set();
  for (const f of fristen.FOERDER_FRISTEN) {
    assert.ok(!ids.has(f.id), `doppelte id ${f.id}`);
    ids.add(f.id);
    assert.match(f.id, /^[a-z0-9-]+$/, f.id);
    assert.match(f.datum, ISO, f.id);
    if (f.bis) assert.ok(f.bis >= f.datum, f.id);
    assert.match(f.quelle?.url || "", /^https:\/\//, f.id);
    assert.ok(Object.keys(fristen.FRISTEN_ARTEN).includes(f.art), `${f.id}: art`);
    assert.ok(f.zielgruppen.length > 0, f.id);
    assert.ok(pruefungVeraltet(f, JETZT).ok, `${f.id}: Prüfdatum veraltet`);
  }
  const fenster = fristen.fristenImFenster({ heuteIso: "2026-10-11" });
  assert.ok(fenster.every((f) => f.datum >= "2026-08-11" && f.datum <= "2027-08-11"));
  assert.ok(fenster.some((f) => f.id === "ifb-22-prozent-2026-12-31"));
  assert.ok(fenster.some((f) => f.id === "steiermark-speicher-2026-modul2"));
  assert.ok(!fristen.fristenImFenster({ heuteIso: "2027-11-01" }).some((f) => f.id === "eag-call-2026-3-ende"), "alte Termine verlassen das Fenster");
  assert.ok(fristen.fristenImFenster({ heuteIso: "2026-10-11", zielgruppe: "privat" }).every((f) => f.zielgruppen.includes("privat")));
  assert.equal(fristen.monateAb("2026-12-31", 2), "2027-03-03"); // Kalenderarithmetik (Überlauf)
  // Die im Auftrag genannten Termine sind enthalten
  const d = (id) => fristen.FOERDER_FRISTEN.find((f) => f.id === id)?.datum;
  assert.equal(d("ifb-22-prozent-2026-12-31"), "2026-12-31");
  assert.equal(d("elwg-netzentgelte-2027-01-01"), "2027-01-01");
  assert.equal(d("steiermark-speicher-2026-modul1"), "2026-10-31");
  assert.equal(d("steiermark-speicher-2026-modul2"), "2027-07-31");
  assert.equal(d("klimafonds-ge-2026-ende"), "2027-03-10");
  assert.equal(d("klimafonds-flex-2027-04-15"), "2027-04-15");
  assert.equal(d("kaernten-landesfoerderung-2026-12-31"), "2026-12-31");
  assert.equal(d("burgenland-speicher-2026-12-31"), "2026-12-31");
  assert.ok(fristen.FOERDER_FRISTEN.find((f) => f.id === "kaernten-landesfoerderung-start-2026").voraussichtlich);
});

test("ICS: RFC 5545 – Struktur, stabile UIDs, Zeilen ≤ 75 Oktette, CRLF, Zielgruppenfilter", async () => {
  const antwort = ics.GET(new Request("https://www.oekovolt.com/forderungen/fristen.ics?zielgruppe=betrieb"));
  assert.equal(antwort.headers.get("Content-Type"), "text/calendar; charset=utf-8");
  const body = await antwort.text();
  assert.ok(body.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:"));
  assert.ok(body.endsWith("END:VCALENDAR\r\n"));
  assert.ok(!/[^\r]\n/.test(body), "nur CRLF");
  const enc = new TextEncoder();
  for (const zeile of body.split("\r\n")) assert.ok(enc.encode(zeile).length <= 75, `Zeile zu lang: ${zeile.slice(0, 40)}`);
  const events = body.split("BEGIN:VEVENT").slice(1);
  assert.ok(events.length >= 10);
  const uids = events.map((e) => e.match(/UID:(.+)/)[1]);
  assert.equal(new Set(uids).size, uids.length, "UIDs eindeutig");
  assert.ok(uids.every((u) => /^foerderfrist-[a-z0-9-]+@oekovolt\.com$/.test(u)));
  for (const e of events) {
    for (const feld of ["DTSTAMP:", "DTSTART;VALUE=DATE:", "DTEND;VALUE=DATE:", "SUMMARY:", "DESCRIPTION:", "URL:", "END:VEVENT"]) assert.ok(e.includes(feld), `${feld} fehlt`);
    const [, s] = e.match(/DTSTART;VALUE=DATE:(\d{8})/);
    const [, en] = e.match(/DTEND;VALUE=DATE:(\d{8})/);
    assert.ok(en > s, "DTEND exklusiv nach DTSTART");
  }
  // Betrieb: keine reinen Privat-Termine
  assert.ok(!body.includes("foerderfrist-burgenland-speicher-2026-12-31@"));
  // Stabilität: gleicher Eintrag → gleiche UID, unabhängig von der Zielgruppe
  const alle = await ics.GET(new Request("https://www.oekovolt.com/forderungen/fristen.ics")).text();
  assert.ok(alle.includes("UID:foerderfrist-ifb-22-prozent-2026-12-31@oekovolt.com"));
  assert.ok(body.includes("UID:foerderfrist-ifb-22-prozent-2026-12-31@oekovolt.com"));
  assert.equal(ics.text("a,b;c\\d\nx"), "a\\,b\\;c\\\\d\\nx");
  // Ungültige Zielgruppe → alle Termine, keine Fehlermeldung
  const falsch = await ics.GET(new Request("https://www.oekovolt.com/forderungen/fristen.ics?zielgruppe=x")).text();
  assert.equal(falsch.split("BEGIN:VEVENT").length, alle.split("BEGIN:VEVENT").length);
});

test("RSS: Feed mit allen Ticker-Einträgen, Quelle im Inhalt", async () => {
  const body = await rssRoute.GET().text();
  assert.ok(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.equal((body.match(/<item>/g) || []).length, ticker.FOERDER_TICKER.length);
  assert.ok(body.includes("/forderungen/aktuell/rss.xml"));
  assert.ok(body.includes("Quelle:"));
  assert.ok(body.includes("oem-ag.at/marktpreis"));
});

/* ------------------------------------------------------------------ QA-Nacharbeit 12.10.2026 */

test("heuteWienIso: Kalendertag in Wien statt UTC (kurz nach Mitternacht)", () => {
  assert.equal(S.heuteWienIso(T("2026-10-11T22:30:00Z")), "2026-10-12"); // 00:30 MESZ
  assert.equal(S.heuteWienIso(T("2026-12-31T23:30:00Z")), "2027-01-01"); // 00:30 MEZ
  assert.equal(S.heuteWienIso(T("2026-10-12T10:00:00Z")), "2026-10-12");
});

test("Voraussichtlicher Start: Prüftermin gesetzt und nicht überschritten", () => {
  const fehler = [];
  for (const { ort, p } of alleProgramme()) {
    if (!p.startVoraussichtlich) continue;
    if (!ISO.test(p.naechstePruefungIso || "")) fehler.push(`${ort}: startVoraussichtlich ohne naechstePruefungIso`);
    else if (S.alterTage(p.naechstePruefungIso, JETZT) > 0) fehler.push(`${ort}: Prüftermin ${p.naechstePruefungIso} überschritten – Portalstart bestätigen und startVoraussichtlich entfernen`);
  }
  assert.deepEqual(fehler, []);
});

test("Kärnten: Status wechselt allein über das Datum (kein festes anzeigeStatus mehr)", () => {
  const ktn = BUNDESLAENDER.kaernten.programme;
  const betriebe = ktn.find((p) => /Betriebe/.test(p.name));
  const privat = ktn.find((p) => /Private/.test(p.name));
  for (const p of [betriebe, privat]) {
    assert.equal(p.anzeigeStatus, undefined, `${p.name}: anzeigeStatus`);
    assert.equal(programmStatus(p, T("2026-10-12T12:00:00+02:00")), "wartet");
    assert.equal(programmStatus(p, T("2026-10-16T12:00:00+02:00")), "offen");
    assert.equal(programmStatus(p, T("2027-01-05T12:00:00+01:00")), "abgelaufen");
  }
  assert.doesNotMatch(privat.status, /Call ab 15\.04\.2026;/);
  // Gemeinde-Programm springt am 01.01.2027 ebenfalls um
  const gemeinde = ktn.find((p) => p.zielgruppen.includes("gemeinde"));
  assert.equal(programmStatus(gemeinde, T("2027-01-05T12:00:00+01:00")), "abgelaufen");
});

test("Förder-Check: erreichter, aber unbestätigter Start wird nicht als „offen“ gemeldet", () => {
  const { statusFuer } = BUND_MODUL;
  const p = { startIso: "2026-10-15", startVoraussichtlich: true, gueltigBisIso: "2026-12-31" };
  assert.match(statusFuer(p, T("2026-10-12T12:00:00+02:00")).label, /voraussichtlich ab 15\.10\.2026/);
  assert.match(statusFuer(p, T("2026-10-16T12:00:00+02:00")).label, /Start erwartet ab 15\.10\.2026 – bitte/);
});

test("Ticker: OeMAG-Marktpreis als Kennzahl, keine Selbstverlinkung", () => {
  const e = ticker.FOERDER_TICKER.find((x) => x.id === "oemag-marktpreis-2026-09");
  assert.equal(e.typ, "kennzahl");
  for (const x of ticker.FOERDER_TICKER) {
    assert.ok(!(x.seiten || []).some((s) => s.replace(/#.*$/, "") === "/forderungen/aktuell"), `${x.id}: verlinkt den Ticker selbst`);
  }
});

test("Fristen: kommende Termine einheitlich (istKommend), Zeitfenster zählt bis zum Ende", () => {
  assert.equal(fristen.istKommend({ datum: "2026-10-08", bis: "2026-10-22" }, "2026-10-12"), true);
  assert.equal(fristen.istKommend({ datum: "2026-10-01" }, "2026-10-12"), false);
  assert.equal(fristen.istKommend({ datum: "2026-10-12" }, "2026-10-12"), true);
});

test("Fristen-Seite: JSON-LD ohne Event-Auszeichnung, FAQ ohne feste Termine im Text", () => {
  const quelle = readFileSync(fileURLToPath(srcUrl("app/forderungen/fristen/page.js")), "utf8");
  assert.doesNotMatch(quelle, /"@type":\s*"Event"/);
  assert.doesNotMatch(quelle, /EventScheduled|VirtualLocation|eventAttendanceMode/);
  assert.doesNotMatch(quelle, /am 22\.10\.2026/);
  assert.doesNotMatch(quelle, /toISOString\(\)\.slice\(0, 10\)/);
  const aktuell = readFileSync(fileURLToPath(srcUrl("app/forderungen/aktuell/page.js")), "utf8");
  assert.doesNotMatch(aktuell, /toISOString\(\)\.slice\(0, 10\)/);
});
