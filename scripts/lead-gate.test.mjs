// scripts/lead-gate.test.mjs – Lead-Gate 2.0 (Welle A, Paket A09)
//
// Prüft: Gate-Kennungen (src/data/leadRechner.js), Prüfregeln (src/lib/rechnerLead.js: Pflicht nur Name + E-Mail,
// Telefon optional nach kontakt_ok, PLZ), Token/Cookie (src/lib/leadGateServer.js), die Routen /api/rechner_lead
// (unbekannte Kennung → 422, Honigtopf, Drossel zählt keine abgelehnten Anfragen, Entwicklungs-Fallback),
// /api/lead-gate/bestaetigen (einmal verwendbar, Cookie) und /api/lead-gate/status, die Entscheider-Mappe
// (src/data/argumentarien.js) sowie statische Inhalte ohne Gate.
// Aufruf: node scripts/lead-gate.test.mjs

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { registerHooks } from "node:module";
import { ROOT, srcUrl } from "./lib/alias.mjs";

// Die Routen importieren „next/server“ ohne Endung (der Bundler ergänzt sie) – hier wie der Bundler auflösen
registerHooks({
  resolve(spezifizierer, kontext, weiter) {
    if (spezifizierer === "next/server") return weiter("next/server.js", kontext);
    return weiter(spezifizierer, kontext);
  },
});

delete process.env.SERVER;
delete process.env.API_KEY;
delete process.env.API_SECRET;
delete process.env.LEAD_GATE_SECRET;
process.env.NODE_ENV = "test";

const { LEAD_RECHNER, LEAD_KENNUNGEN, SEGMENTE, KENNUNG_FORMAT, istLeadKennung, segmentFuer, stufeFuer } = await import(srcUrl("data/leadRechner.js"));
const { rechnerLeadPruefen, formularPruefen, pfadSicher, ergebnisBereinigen, honigtopfGefuellt, HONIGTOPF, PFLICHTFELDER } = await import(srcUrl("lib/rechnerLead.js"));
const srv = await import(srcUrl("lib/leadGateServer.js"));
const { mappeKapitel, mappeBereinigen, standardRollen, MAPPE_ROLLEN_IDS } = await import(srcUrl("data/argumentarien.js"));
const leadRoute = await import(srcUrl("app/api/rechner_lead/route.js"));
const bestaetigenRoute = await import(srcUrl("app/api/lead-gate/bestaetigen/route.js"));
const statusRoute = await import(srcUrl("app/api/lead-gate/status/route.js"));

const lesen = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const basis = { kennung: "gewerbe-pv", vorname: "Anna", nachname: "Muster", email: "anna@example.at" };

let ipZaehler = 0;
const neueIp = () => `10.9.${Math.floor(++ipZaehler / 250)}.${ipZaehler % 250}`;
function anfrage(url, { body, ip = neueIp(), cookie, method = "POST" } = {}) {
  const headers = { "content-type": "application/json", "x-forwarded-for": ip };
  if (cookie) headers.cookie = cookie;
  return new Request(`http://127.0.0.1:3001${url}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
}
const cookieAus = (res) => {
  const roh = res.headers.get("set-cookie") || "";
  const m = roh.match(/ov-lead-frei=([^;]*)/);
  return m ? `ov-lead-frei=${m[1]}` : "";
};

/* ------------------------------------------------------------ Kennungen */

test("Kennungen: Format, eindeutig, Segment und Stufe gültig", () => {
  assert.equal(new Set(LEAD_KENNUNGEN).size, LEAD_KENNUNGEN.length, "doppelte Kennung");
  for (const r of LEAD_RECHNER) {
    assert.match(r.kennung, KENNUNG_FORMAT, r.kennung);
    assert.ok(Object.hasOwn(SEGMENTE, r.segment), `${r.kennung}: Segment ${r.segment}`);
    assert.ok([1, 2].includes(r.stufe), `${r.kennung}: Stufe`);
    assert.ok(r.pfad.startsWith("/"), `${r.kennung}: Pfad`);
    assert.ok(r.name.length > 3);
  }
});

test("Kennungen: Gewerbe-Rechner (RechnerTeilen) und Werkzeuge der Übergangs-Gates sind gelistet", () => {
  for (const k of ["gewerbe-pv", "peak-shaving", "co2-esg", "energiegemeinschaft", "e-flotte", "freiflaeche-pacht", "blackout", "ladeinfrastruktur"]) assert.ok(istLeadKennung(k), k);
  for (const k of ["dossier", "investitionsantrag", "anlagen-check", "angebot-pruefen", "hallendach-planer", "fachplaner-paket", "gemeinderat-vorlage", "liegenschafts-check", "peer-to-peer"]) assert.ok(istLeadKennung(k), k);
  assert.equal(stufeFuer("lastgang-analyse"), 2);
  assert.equal(stufeFuer("gewerbe-pv"), 1);
  assert.equal(segmentFuer("freiflaeche-pacht"), "landwirtschaft");
  assert.equal(segmentFuer("liegenschafts-check"), "gemeinde");
  assert.equal(segmentFuer("gibt-es-nicht"), "sonstiges");
});

test("Statische Inhalte haben keine Gate-Kennung (Entscheidung des Inhabers)", () => {
  for (const k of ["netzanmeldung-checkliste", "gemeinderat-checkliste", "muster-lv", "beispiel-csv"]) assert.equal(istLeadKennung(k), false, k);
});

/* --------------------------------------------------------- Prüfregeln */

test("Pflicht sind nur Vorname, Nachname und E-Mail – keine Einwilligung nötig", () => {
  assert.deepEqual(PFLICHTFELDER, ["vorname", "nachname", "email"]);
  const p = rechnerLeadPruefen(basis);
  assert.equal(p.ok, true, JSON.stringify(p.fehler));
  assert.equal(p.daten.kontakt_ok, 0);
  assert.equal(p.daten.telefon, "");
  assert.equal(p.daten.einwilligung_id, "leadgate-info");
  assert.ok(p.daten.einwilligung_version);
  for (const feld of ["vorname", "nachname", "email"]) {
    const q = rechnerLeadPruefen({ ...basis, [feld]: "" });
    assert.equal(q.ok, false);
    assert.equal(q.code, "validierung");
    assert.ok(q.fehler[feld], feld);
  }
  assert.equal(rechnerLeadPruefen({ ...basis, email: "anna@" }).ok, false);
});

test("Telefon optional: ohne kontakt_ok verworfen, mit kontakt_ok nur geprüft, wenn ausgefüllt", () => {
  const ohne = rechnerLeadPruefen({ ...basis, telefon: "0664 1234567" });
  assert.equal(ohne.ok, true);
  assert.equal(ohne.daten.telefon, "", "Nummer ohne Häkchen wird nicht übernommen");
  const leer = rechnerLeadPruefen({ ...basis, kontakt_ok: 1, telefon: "" });
  assert.equal(leer.ok, true);
  assert.equal(leer.daten.kontakt_ok, 1);
  assert.equal(leer.daten.kontakt_einwilligung_id, "leadgate-kontakt");
  const gut = rechnerLeadPruefen({ ...basis, kontakt_ok: 1, telefon: "0664 1234567" });
  assert.equal(gut.daten.telefon, "+436641234567");
  for (const schlecht of ["------", "123", "+1 555 1234567", "abc"]) {
    const s = rechnerLeadPruefen({ ...basis, kontakt_ok: 1, telefon: schlecht });
    assert.equal(s.ok, false, schlecht);
    assert.ok(s.fehler.telefon, schlecht);
  }
  assert.ok(formularPruefen({ ...basis, kontakt_ok: true, telefon: "------" }).fehler.telefon);
});

test("PLZ optional, nur vierstellig (AT)", () => {
  assert.equal(rechnerLeadPruefen({ ...basis, plz: "5121" }).daten.plz, "5121");
  assert.equal(rechnerLeadPruefen({ ...basis, plz: "" }).ok, true);
  for (const p of ["51210", "51a1", "12"]) assert.ok(rechnerLeadPruefen({ ...basis, plz: p }).fehler?.plz, p);
});

test("Kennung nur aus leadRechner.js, Segment daraus abgeleitet; Rollen, Pfade und Ergebnis bereinigt", () => {
  const u = rechnerLeadPruefen({ ...basis, kennung: "irgendwas" });
  assert.equal(u.ok, false);
  assert.equal(u.code, "kennung");
  const p = rechnerLeadPruefen({ ...basis, kennung: "freiflaeche-pacht", segment: "quatsch", mappe_rollen: ["bank", "hacker", "gf", "bank"], rueckkehr: "https://boese.example/rechner/x?a=1#k" });
  assert.equal(p.daten.segment, "landwirtschaft");
  assert.equal(p.daten.segment_name, SEGMENTE.landwirtschaft);
  assert.deepEqual(p.daten.mappe_rollen, ["gf", "bank"]);
  assert.equal(p.daten.rueckkehr, "/rechner/x?a=1#k", "Domain aus dem Formular wird verworfen");
  assert.equal(rechnerLeadPruefen({ ...basis, segment: "gemeinde" }).daten.segment, "gemeinde");
  assert.equal(pfadSicher("//boese.example/x"), "");
  assert.equal(pfadSicher("javascript:alert(1)"), "");
  assert.equal(pfadSicher("/rechner/gewerbe-pv?f=6000"), "/rechner/gewerbe-pv?f=6000");
  const e = ergebnisBereinigen({ a: 1, b: "x".repeat(500), c: { tief: 1 }, d: [1, 2, 3], e: NaN, f: true });
  assert.deepEqual(Object.keys(e).sort(), ["a", "b", "d", "f"]);
  assert.equal(e.b.length, 200);
});

test("Honigtopf: Feldname ohne Bedeutung, alte Namen gelten weiter", () => {
  assert.doesNotMatch(HONIGTOPF, /website|firma|name|mail|telefon/i);
  assert.equal(honigtopfGefuellt({ [HONIGTOPF]: "x" }), true);
  assert.equal(honigtopfGefuellt({ website: "http://spam" }), true);
  assert.equal(honigtopfGefuellt({ website: "" }), false);
});

/* ------------------------------------------------------- Token & Cookie */

test("Token: signiert, ohne E-Mail, 24 h gültig, Manipulation erkannt", () => {
  const jetzt = Date.now();
  const t = srv.tokenErzeugen({ kennung: "peak-shaving", rueckkehr: "/rechner/peak-shaving?x=1", jetzt });
  assert.doesNotMatch(Buffer.from(t.split(".")[0], "base64url").toString(), /@/);
  const ok = srv.tokenPruefen(t, jetzt + 1000);
  assert.equal(ok.ok, true);
  assert.equal(ok.kennung, "peak-shaving");
  assert.equal(ok.rueckkehr, "/rechner/peak-shaving?x=1");
  assert.equal(srv.tokenPruefen(t, jetzt + 25 * 3600_000).grund, "abgelaufen");
  const [nutz, sig] = t.split(".");
  assert.equal(srv.tokenPruefen(`${nutz}.${sig.replace(/^./, (c) => (c === "a" ? "b" : "a"))}`).grund, "signatur");
  assert.equal(srv.tokenPruefen("quatsch").ok, false);
  assert.equal(srv.einmalVerbrauchen(ok.nonce, ok.ablauf), true);
  assert.equal(srv.einmalVerbrauchen(ok.nonce, ok.ablauf), false);
});

test("Cookie: Stufe 1 schaltet alle Rechner frei, Stufe 2 nur die eigene Kennung; Format wie src/lib/dossier/freigabe.js", () => {
  const ohne = new Request("http://x/");
  const wert = srv.cookieNachBestaetigung(ohne, "gewerbe-pv");
  const mit = new Request("http://x/", { headers: { cookie: `ov-lead-frei=${encodeURIComponent(wert)}` } });
  assert.equal(srv.freigabePruefen(mit, "gewerbe-pv").frei, true);
  assert.equal(srv.freigabePruefen(mit, "co2-esg").frei, true, "andere Stufe-1-Kennung");
  assert.equal(srv.freigabePruefen(mit, "lastgang-analyse").frei, false, "Stufe 2 braucht eigene Bestätigung");
  assert.equal(srv.freigabePruefen(ohne, "gewerbe-pv").frei, false);
  const [nutz, sig] = wert.split(".");
  assert.match(sig, /^[0-9a-f]{64}$/);
  const inhalt = JSON.parse(Buffer.from(nutz, "base64url").toString());
  assert.ok(inhalt.bis > Date.now() + 29 * 86400_000);
  assert.ok(inhalt.kennungen.includes("gewerbe-pv"));
  assert.doesNotMatch(JSON.stringify(inhalt), /@/, "keine Personendaten im Cookie");
  const zwei = srv.cookieNachBestaetigung(mit, "lastgang-analyse");
  const mit2 = new Request("http://x/", { headers: { cookie: `ov-lead-frei=${encodeURIComponent(zwei)}` } });
  assert.equal(srv.freigabePruefen(mit2, "lastgang-analyse").frei, true);
  assert.equal(srv.freigabePruefen(mit2, "gewerbe-pv").frei, true, "bisherige Freischaltung bleibt");
  assert.equal(srv.freigabePruefen(mit, "gewerbe-pv", Date.now() + 31 * 86400_000).frei, false, "nach 30 Tagen abgelaufen");
});

test("Link in Mails: in production feste Domain, nie aus dem Host-Header", () => {
  const quelle = lesen("src/lib/leadGateServer.js");
  assert.match(quelle, /if \(PRODUKTION\) return BASE_URL;/);
});

/* -------------------------------------------------------------- Routen */

test("POST /api/rechner_lead: nur Name + E-Mail → Entwicklungs-Fallback mit Bestätigungslink", async () => {
  const res = await leadRoute.POST(anfrage("/api/rechner_lead", { body: { ...basis, email: "a1@example.at" } }));
  assert.equal(res.status, 200);
  const j = await res.json();
  assert.equal(j.success, true);
  assert.equal(j.bestaetigung, "entwicklung");
  assert.match(j.entwicklung_link, /^http:\/\/127\.0\.0\.1:3001\/freischalten\?token=/);
});

test("POST /api/rechner_lead: unbekannte Kennung → 422", async () => {
  const res = await leadRoute.POST(anfrage("/api/rechner_lead", { body: { ...basis, kennung: "erfunden" } }));
  assert.equal(res.status, 422);
  assert.equal((await res.json()).code, "kennung");
});

test("POST /api/rechner_lead: Honigtopf → scheinbarer Erfolg ohne Link", async () => {
  const res = await leadRoute.POST(anfrage("/api/rechner_lead", { body: { ...basis, [HONIGTOPF]: "bot" } }));
  assert.equal(res.status, 200);
  const j = await res.json();
  assert.equal(j.success, true);
  assert.equal(j.entwicklung_link, undefined);
});

test("Drossel zählt keine abgelehnten Anfragen; je E-Mail höchstens 4 in 10 Minuten", async () => {
  const ip = "10.77.0.1";
  for (let i = 0; i < 25; i++) {
    const r = await leadRoute.POST(anfrage("/api/rechner_lead", { ip, body: { ...basis, email: "drossel@example.at", vorname: "" } }));
    assert.equal(r.status, 422);
  }
  for (let i = 0; i < 4; i++) {
    const r = await leadRoute.POST(anfrage("/api/rechner_lead", { ip, body: { ...basis, email: "drossel@example.at" } }));
    assert.equal(r.status, 200, `gültige Anfrage ${i + 1} trotz 25 abgelehnter`);
  }
  const fuenfte = await leadRoute.POST(anfrage("/api/rechner_lead", { ip: neueIp(), body: { ...basis, email: "drossel@example.at" } }));
  assert.equal(fuenfte.status, 429, "fünfte gültige Anfrage derselben Adresse (auch von anderer IP)");
  const andere = await leadRoute.POST(anfrage("/api/rechner_lead", { ip, body: { ...basis, email: "kollegin@example.at" } }));
  assert.equal(andere.status, 200, "Kollegin hinter derselben Firmen-IP");
});

test("Aktion „senden“ (Lastgang-Kennzahlen) braucht keine Bestätigung", async () => {
  const res = await leadRoute.POST(anfrage("/api/rechner_lead", { body: { ...basis, kennung: "lastgang-analyse", aktion: "senden", email: "s@example.at", ergebnis: { "Jahresverbrauch (kWh)": 812000 } } }));
  const j = await res.json();
  assert.equal(j.bestaetigung, "keine");
  assert.equal(j.entwicklung_link, undefined);
});

test("Bestätigen: Cookie setzen, einmal verwendbar, Status meldet frei; DELETE entfernt", async () => {
  const res = await leadRoute.POST(anfrage("/api/rechner_lead", { body: { ...basis, email: "b@example.at", kennung: "peak-shaving", rueckkehr: "/rechner/peak-shaving?s=1#ergebnis" } }));
  const token = new URL((await res.json()).entwicklung_link).searchParams.get("token");

  const vorher = await statusRoute.GET(anfrage("/api/lead-gate/status?kennung=peak-shaving", { method: "GET" }));
  assert.equal((await vorher.json()).frei, false);

  const b = await bestaetigenRoute.POST(anfrage("/api/lead-gate/bestaetigen", { body: { token } }));
  assert.equal(b.status, 200);
  const jb = await b.json();
  assert.equal(jb.ok, true);
  assert.equal(jb.ziel, "/rechner/peak-shaving?s=1&lead-frei=peak-shaving#ergebnis");
  const cookie = cookieAus(b);
  assert.ok(cookie, "Set-Cookie fehlt");
  assert.match(b.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(b.headers.get("set-cookie"), /Max-Age=2592000/);

  const nochmal = await bestaetigenRoute.POST(anfrage("/api/lead-gate/bestaetigen", { body: { token } }));
  assert.equal(nochmal.status, 409, "Token nur einmal verwendbar");

  const s = await statusRoute.GET(anfrage("/api/lead-gate/status?kennung=gewerbe-pv", { method: "GET", cookie }));
  const js = await s.json();
  assert.equal(js.frei, true);
  assert.equal(js.freigegeben, true);
  assert.match(s.headers.get("cache-control"), /no-store/);

  const unbekannt = await statusRoute.GET(anfrage("/api/lead-gate/status?kennung=xyz", { method: "GET", cookie }));
  assert.equal(unbekannt.status, 422);

  const weg = await statusRoute.DELETE();
  assert.match(weg.headers.get("set-cookie"), /ov-lead-frei=;.*Max-Age=0/i);
});

test("GET auf den Bestätigungslink verbraucht nichts (Mail-Scanner) – nur Weiterleitung auf /freischalten", async () => {
  const r = await bestaetigenRoute.GET(anfrage("/api/lead-gate/bestaetigen?token=abc", { method: "GET" }));
  assert.equal(r.status, 303);
  assert.match(r.headers.get("location"), /\/freischalten\?token=abc$/);
});

/* ------------------------------------------------------ Entscheider-Mappe */

test("Entscheider-Mappe: Kapitel je Rolle, nur gelieferte Zahlen, Stresstest nur wenn vorhanden", () => {
  const mappe = mappeBereinigen({ investition: 480000, amortisation: 7.4, jahre: 25, irr: 0.112, irrOhneIfb: 0.098, ifbAktiv: true, cashflow: [60000, 61000, 62000], torTyp: "B", netzebene: "6", co2TonnenJahr: 210.4, unbekannt: 5, stresstest: [{ szenario: "Strompreis −30 %", irr: 0.07, amortisation: 10.2 }] });
  assert.equal(mappe.unbekannt, undefined);
  const k = mappeKapitel(["esg", "gf", "cfo", "technik", "bank"], { mappe, name: "Gewerbe-PV-Rechner" });
  assert.deepEqual(k.map((x) => x.id), ["gf", "cfo", "technik", "bank", "esg"], "feste Reihenfolge");
  const gf = k[0].absaetze.join(" ");
  assert.match(gf, /Kapitalbindung 480\s000 €/);
  assert.match(gf, /Amortisation 7,4 Jahre/);
  assert.match(gf, /Stresstest/);
  const cfo = k[1];
  assert.equal(cfo.tabelle.reihen.length, 3);
  assert.equal(cfo.stresstest.reihen[0][0], "Strompreis −30 %");
  assert.ok(cfo.punkte.some((p) => /Steuerberatung/.test(p)));
  assert.ok(k[2].punkte.some((p) => /Solensa/.test(p)), "Parkregler-Satz aus marke.js");
  assert.ok(!k[2].punkte.some((p) => /eigene[rnm]? Parkregler/i.test(p)));
  assert.ok(k[2].punkte.some((p) => /ESV 2012/.test(p)));
  assert.ok(k[3].punkte.some((p) => /Jahresabschl/.test(p)));
  assert.match(k[4].absaetze[0], /je Betriebsjahr/, "CO₂ nur mit Zeitraum");
  assert.ok(k[4].punkte.some((p) => /VSME/.test(p)));

  const leer = mappeKapitel(["gf", "cfo"], { mappe: {} });
  assert.doesNotMatch(leer[0].absaetze[0], /Kapitalbindung/, "ohne Zahl kein Satz mit Zahl");
  assert.equal(leer[1].tabelle, null);
  assert.equal(leer[1].stresstest, null, "ohne Stresstest kein Abschnitt");

  const gemeinde = mappeKapitel(standardRollen("gemeinde"), { mappe });
  assert.ok(gemeinde.find((x) => x.id === "gemeinderat").punkte.some((p) => /Vergabestelle/.test(p)));
  assert.deepEqual(standardRollen("gewerbe"), ["gf", "cfo", "technik", "bank", "esg"]);
  for (const id of standardRollen("gemeinde")) assert.ok(MAPPE_ROLLEN_IDS.includes(id));
});

/* -------------------------------------------- Einbau in Komponenten (Quelltext) */

test("Dialog: Telefon erst nach Kontakt-Häkchen, kein vorangekreuztes Häkchen, keine Pflicht-Einwilligung, Fußzeile", () => {
  const d = lesen("src/components/LeadGate/LeadGateDialog.js");
  assert.match(d, /\{f\.kontakt && <div className="mt-4">\{feld\("telefon"/);
  assert.match(d, /kontakt: false/);
  assert.doesNotMatch(d, /defaultChecked|checked=\{true\}/);
  assert.doesNotMatch(d, /einwilligung:\s*1/);
  assert.match(d, /Verschlüsselte Übertragung · \* Pflichtfeld/);
  assert.doesNotMatch(d, /Kostenlos · SSL/);
  assert.match(d, /tabIndex=\{-1\} autoComplete="off"/);
  assert.match(d, /Erneut senden/);
  assert.match(d, /Spam-Ordner/);
  assert.match(d, /Freischaltung auf diesem Gerät entfernen/);
  assert.match(d, /oeffneRueckruf/);
});

test("Gate an den richtigen Stellen: Rechner-Export, CO₂-Text, Lastgang (Stufe 2) – statische Inhalte frei", () => {
  const rt = lesen("src/components/RechnerTeilen/RechnerTeilen.js");
  assert.match(rt, /gate\.ausfuehren\("pdf"/);
  assert.match(rt, /gate\.ausfuehren\("link"/);
  assert.match(rt, /Freischaltung einmalig mit Name und E-Mail/);
  const co2 = lesen("src/components/RechnerGewerbe/CO2Rechner.js");
  assert.match(co2, /gate\.ausfuehren\("export", kopierenFrei/);
  const lg = lesen("src/components/Lastgang/LastgangAnalyse.js");
  assert.match(lg, /modus: "auswertung"/);
  assert.match(lg, /<a href=\{BEISPIEL\} download/, "Beispiel-CSV als normaler Download");
  for (const frei of ["src/components/Netzanmeldung/DruckenKnopf.js", "src/components/KommunenVergabe/GemeinderatCheckliste.js"]) {
    assert.doesNotMatch(lesen(frei), /LeadGate|useLeadGate|rechner_lead/, `${frei} ohne Gate`);
  }
  assert.match(lesen("src/components/KommunenVergabe/GemeinderatCheckliste.js"), /es wird nichts an Ökovolt übertragen/);
});

test("Datenschutzerklärung beschreibt Export, Cookie, Vertrieb, Referenz-Freigabe und Lastgang-Kennzahlen", () => {
  const ds = lesen("src/components/Datenschutz/datenschutz.js");
  for (const id of ["rechner-export", "vertrieb", "referenz-freigabe"]) assert.match(ds, new RegExp(`\\["${id}", "`), id);
  assert.match(ds, /ov-lead-frei/);
  assert.match(ds, /Art\. 22 DSGVO/);
  assert.match(ds, /ohne Personendaten|keine Namen, Adressen/);
  assert.match(ds, /zwölf Monate nach Eingang/);
  assert.match(ds, /SMARD/);
  assert.doesNotMatch(ds, /aWATTar/);
  assert.doesNotMatch(ds, /RECHTLICH PRÜFEN/);
});
