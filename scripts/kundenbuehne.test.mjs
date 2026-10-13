// Tests für src/lib/kundenbuehne.js (Kundenporträt, Projekt-Plakette, Social-Kit, Schätzung, Freigaben)
// sowie die Freigabe-Regeln der Welle A07 (kunden.js, Token-Seite, Plakettenroute, Award, Referenzkarte).
// Aufruf: node scripts/kundenbuehne.test.mjs
// projektDaten.js (Konstante ERTRAG_JE_KWP) nutzt den "@/"-Alias → über scripts/lib/alias.mjs geladen.

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { ROOT, srcUrl } from "./lib/alias.mjs";
import {
  CO2_G_PRO_KWH,
  CO2_KG_PRO_KWH,
  ERTRAG_JE_KWP,
  FREIGABE_FELDER,
  FREIGABE_LEER,
  HASHTAGS,
  PLAKETTE_FORMATE,
  PLAKETTE_VERBOTEN,
  datumAT,
  einbauCode,
  fmtCa,
  fmtKwp,
  freigabeNormalisieren,
  hatPortraet,
  kundeSchema,
  kundeZusammenfuehren,
  linkedinShareUrl,
  nameFrei,
  neutralerName,
  neutralerProjektName,
  normUrl,
  plaketteAlt,
  plaketteBildUrl,
  plaketteCo2Text,
  plaketteMasse,
  plaketteSvg,
  plaketteText,
  postVorschlaege,
  projektNeutralisieren,
  schaetzung,
  socialListe,
  umbrechen,
  urlKurz,
} from "../src/lib/kundenbuehne.js";
import { ANNAHMEN } from "../src/data/solarrechner.js";
import { KUNDEN } from "../src/data/kunden.js";
import { AWARD_KENNZEICHNUNG, JURY_KLAUSEL, TEILNAHME } from "../src/components/Award/awardDaten.js";
import { STANDORTE, bekannteKoordinaten } from "../src/components/Referenzkarte/standorte.js";

const projektDaten = await import(srcUrl("components/Project/projektDaten.js"));
const nahe = (ist, soll, tol) => assert.ok(Math.abs(ist - soll) <= tol, `${ist} ≠ ${soll} (±${tol})`);
const datei = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const projekteModul = await import(srcUrl("data/projekte.js"));

describe("Konstanten", () => {
  test("Ertrag und CO₂-Faktor wie Solarrechner und Projektdaten", () => {
    assert.equal(ERTRAG_JE_KWP, projektDaten.ERTRAG_JE_KWP);
    assert.equal(CO2_KG_PRO_KWH, ANNAHMEN.co2KgProKwh);
    assert.equal(CO2_G_PRO_KWH, 258.2);
  });
});

describe("Zahlformate", () => {
  test("fmtKwp: ab 100 ganzzahlig, darunter max. eine Nachkommastelle", () => {
    assert.equal(fmtKwp(0), "");
    assert.equal(fmtKwp(-3), "");
    assert.equal(fmtKwp(NaN), "");
    assert.equal(fmtKwp(12), "12");
    assert.equal(fmtKwp(12.34), "12,3");
    assert.equal(fmtKwp(9.96), "10");
    assert.equal(fmtKwp(99.97), "100");
    assert.equal(fmtKwp(150.4), "150");
    assert.equal(fmtKwp(1234.5), "1.235");
  });
  test("fmtCa: Rundungsstufen", () => {
    assert.equal(fmtCa(0), "0");
    assert.equal(fmtCa(-5), "0");
    assert.equal(fmtCa(NaN), "0");
    assert.equal(fmtCa(0.44), "0,4");
    assert.equal(fmtCa(0.96), "1");
    assert.equal(fmtCa(9.96), "10");
    assert.equal(fmtCa(12.6), "13");
    assert.equal(fmtCa(123), "125");
    assert.equal(fmtCa(999.9), "1.000");
    assert.equal(fmtCa(1234), "1.230");
  });
});

describe("schaetzung", () => {
  test("Richtwert 1.050 kWh/kWp × 258,2 g/kWh", () => {
    const s = schaetzung({ kwp: 100 });
    assert.equal(s.ertragKwh, 105000);
    assert.equal(s.mwh, 105);
    nahe(s.co2Kg, 105000 * 0.2582, 1e-9);
    nahe(s.co2T, 27.111, 1e-9);
    assert.equal(s.quelleErtrag, "richtwert");
    assert.equal(s.zeitraum, null);
    assert.equal(s.ertragJeKwp, 1050);
    assert.deepEqual(s.texte, { kwp: "100 kWp", mwh: "ca. 105 MWh", co2: "ca. 27 t CO₂" });
  });
  test("Anlagendaten aus dem Backoffice haben Vorrang, Zeitraum nur mit Messwert", () => {
    const s = schaetzung({ kwp: 100, ertragKwh: 98000, zeitraum: " 2025 " });
    assert.equal(s.quelleErtrag, "anlage");
    assert.equal(s.ertragJeKwp, 980);
    assert.equal(s.zeitraum, "2025");
    const nurErtrag = schaetzung({ ertragKwh: "50000" });
    assert.equal(nurErtrag.kwp, null);
    assert.equal(nurErtrag.ertragJeKwp, null);
    assert.equal(nurErtrag.texte.kwp, "");
    assert.equal(schaetzung({ kwp: 10, ertragKwh: -5, zeitraum: "2025" }).quelleErtrag, "richtwert");
    assert.equal(schaetzung({ kwp: 10, zeitraum: "2025" }).zeitraum, null);
  });
  test("keine Daten → null", () => {
    assert.equal(schaetzung(), null);
    assert.equal(schaetzung({ kwp: 0 }), null);
    assert.equal(schaetzung({ kwp: "abc" }), null);
    assert.equal(schaetzung({ kwp: -5, ertragKwh: 0 }), null);
    assert.equal(schaetzung({ kwp: null, ertragKwh: null }), null);
  });
  test("Plausibilität: mehr kWp → mehr Ertrag und CO₂", () => {
    assert.ok(schaetzung({ kwp: 200 }).co2Kg > schaetzung({ kwp: 100 }).co2Kg);
  });
});

describe("Adressen", () => {
  test("normUrl: nur http(s), www./Domain ergänzt, Rest leer", () => {
    assert.equal(normUrl("www.firma.at"), "https://www.firma.at/");
    assert.equal(normUrl("firma.at"), "https://firma.at/");
    assert.equal(normUrl("firma.at/team"), "https://firma.at/team");
    assert.equal(normUrl("  https://Firma.AT  "), "https://firma.at/");
    assert.equal(normUrl("http://firma.at/a?b=1"), "http://firma.at/a?b=1");
    for (const boese of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,<b>x</b>", "ftp://firma.at", "//firma.at", "mailto:a@b.at", "", "   ", null, 123, ["https://a.at"]]) {
      assert.equal(normUrl(boese), "", String(boese));
    }
  });
  test("urlKurz / linkedinShareUrl", () => {
    assert.equal(urlKurz("https://www.firma.at/"), "firma.at");
    assert.equal(urlKurz("http://firma.at/team"), "firma.at/team");
    assert.equal(urlKurz(null), "");
    assert.equal(linkedinShareUrl("https://www.oekovolt.com/a?b=1&c=2"), "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.oekovolt.com%2Fa%3Fb%3D1%26c%3D2");
  });
});

describe("Freigaben", () => {
  test("FREIGABE_LEER: nichts freigegeben, alle Felder vorhanden", () => {
    for (const f of FREIGABE_FELDER) assert.equal(FREIGABE_LEER[f], false, f);
    assert.equal(FREIGABE_LEER.freigegebenAm, null);
    assert.equal(FREIGABE_LEER.beleg, null);
    assert.deepEqual(freigabeNormalisieren(null), { ...FREIGABE_LEER });
    assert.deepEqual(freigabeNormalisieren("kaputt"), { ...FREIGABE_LEER });
  });
  test("Backoffice-Datensatz (get_freigaben) → Website-Form; Zitattext nur mit Zitat-Freigabe", () => {
    const f = freigabeNormalisieren({
      freigabe_name: 1,
      freigabe_logo: 0,
      freigabe_zitat: 1,
      freigabe_fotos_anlage: "1",
      freigabe_plakette: true,
      freigabe_livedaten: 0,
      freigabe_messwerte: 1,
      zitat_text: "Läuft seit Tag eins.",
      zitat_person_funktion: "M. Muster, GF",
      freigegeben_am: "2026-10-11",
      text_version: "2026-10-11-v1",
    });
    assert.equal(f.name, true);
    assert.equal(f.logo, false);
    assert.equal(f.zitat, true);
    assert.equal(f.fotos, true);
    assert.equal(f.plakette, true);
    assert.equal(f.messwerte, true);
    assert.equal(f.zitatText, "Läuft seit Tag eins.");
    assert.equal(f.zitatPerson, "M. Muster, GF");
    assert.equal(f.freigegebenAm, "2026-10-11");
    assert.equal(f.beleg, "2026-10-11-v1");
    const ohneZitat = freigabeNormalisieren({ freigabe_zitat: 0, zitat_text: "Nicht freigegeben" });
    assert.equal(ohneZitat.zitat, false);
    assert.equal(ohneZitat.zitatText, undefined);
  });
  test("widerrufen → wie keine Freigabe", () => {
    const f = freigabeNormalisieren({ freigabe_name: 1, freigabe_plakette: 1, widerrufen_am: "2026-11-01 10:00:00" });
    assert.equal(f.name, false);
    assert.equal(f.plakette, false);
  });
  test("nameFrei / neutralerName", () => {
    const kunde = { firma: "Muster GmbH", branche: "Metallbau", ort: "Steyregg", freigabe: { ...FREIGABE_LEER } };
    assert.equal(nameFrei(kunde), false);
    assert.equal(nameFrei(null), false);
    assert.equal(neutralerName(kunde, "Projekt X"), "Metallbau, Steyregg");
    assert.equal(neutralerName({ firma: "X", freigabe: { ...FREIGABE_LEER } }, "Projekt X"), "Projekt X");
    assert.equal(neutralerName(null), "Referenzprojekt");
    assert.equal(neutralerName({ ...kunde, freigabe: { ...FREIGABE_LEER, name: true } }), "Muster GmbH");
  });
  test("src/data/kunden.js: kein Eintrag freigegeben, Schema vollständig", () => {
    const schluessel = Object.keys(KUNDEN);
    assert.ok(schluessel.length > 40);
    for (const s of schluessel) {
      const f = KUNDEN[s].freigabe;
      assert.ok(f && typeof f === "object", s);
      for (const feld of ["name", "zitat", "logo", "plakette", "livedaten", "messwerte"]) assert.equal(f[feld], false, `${s}.${feld}`);
      assert.equal(f.freigegebenAm, null, s);
      assert.equal(f.beleg, null, s);
      const k = kundeZusammenfuehren({ eintrag: KUNDEN[s] });
      assert.equal(k.zitat, null, s);
      assert.equal(k.logoUrl, "", s);
      assert.equal(k.freigabe.plakette, false, s);
      assert.equal(k.freigabe.name, false, s);
      assert.equal(kundeSchema(k), null, `${s}: kein Organisation-Schema ohne Namensfreigabe`);
    }
  });
});

describe("kundeZusammenfuehren", () => {
  const eintrag = {
    firma: "Muster Metall GmbH",
    website: "www.muster-metall.at",
    social: { linkedin: "https://www.linkedin.com/company/muster", instagram: "javascript:alert(1)" },
    branche: "Metallbau",
    ort: "Ostermiething",
    portraet: "Familienbetrieb.",
    quellen: [{ titel: "Firmenbuch", url: "https://www.justiz.gv.at" }],
    geprueftAm: "2026-09-30",
    freigabe: { name: false, zitat: false, logo: false, plakette: false, livedaten: false, messwerte: false, freigegebenAm: null, beleg: null },
    zitat: "Nicht freigegeben",
    logo: "https://muster-metall.at/logo.png",
  };
  const alleFalsch = { name: false, logo: false, zitat: false, fotos: false, plakette: false, livedaten: false, messwerte: false };

  test("nur kunden.js: normalisiert, ungültige Profile verworfen, ohne Freigabe kein Zitat/Logo/Plakette/Name", () => {
    const k = kundeZusammenfuehren({ eintrag });
    assert.equal(k.website, "https://www.muster-metall.at/");
    assert.deepEqual(Object.keys(k.social), ["linkedin"]);
    assert.equal(k.zitat, null);
    assert.equal(k.logoUrl, "");
    assert.deepEqual({ ...k.freigabe, freigegebenAm: undefined, beleg: undefined, quelle: undefined }, { ...alleFalsch, freigegebenAm: undefined, beleg: undefined, quelle: undefined });
    assert.equal(k.freigabe.quelle, "kunden.js");
    assert.deepEqual(k.quellen, [{ url: "https://www.justiz.gv.at/", titel: "Firmenbuch" }]);
  });
  test("Freigabe in kunden.js („ja“/1/true) gibt Zitat und Logo frei", () => {
    for (const ja of [true, 1, "1", "ja", " Yes "]) {
      const k = kundeZusammenfuehren({ eintrag: { ...eintrag, freigabe: { zitat: ja, logo: ja, name: ja, plakette: ja }, zitatPerson: "M. Muster" } });
      assert.deepEqual(k.zitat, { text: "Nicht freigegeben", person: "M. Muster" }, String(ja));
      assert.equal(k.logoUrl, "https://muster-metall.at/logo.png");
      assert.equal(k.freigabe.name, true);
      assert.equal(k.freigabe.plakette, true);
      assert.equal(k.freigabe.messwerte, false);
    }
    const nein = kundeZusammenfuehren({ eintrag: { ...eintrag, freigabe: { zitat: "nein", logo: 0 } } });
    assert.equal(nein.zitat, null);
    assert.equal(nein.logoUrl, "");
  });
  test("API-Felder gewinnen; API-Zitat gilt als freigegeben außer ausdrücklichem Nein (Altbestand ohne Freigabe-Datensatz)", () => {
    const api = { website_url: "https://api.muster.at", branche: "Stahlbau", zitat: "Top.", zitat_person: "GF", logo_url: "https://api.muster.at/l.svg", jahr: "2024", linkedin: "" };
    const k = kundeZusammenfuehren({ api, eintrag });
    assert.equal(k.website, "https://api.muster.at/");
    assert.equal(k.branche, "Stahlbau");
    assert.equal(k.social.linkedin, "https://www.linkedin.com/company/muster"); // leerer API-Wert → kunden.js
    assert.deepEqual(k.zitat, { text: "Top.", person: "GF" });
    assert.equal(k.logoUrl, "https://api.muster.at/l.svg");
    assert.equal(k.jahr, 2024);
    assert.equal(k.freigabe.name, false); // Name bleibt ohne Freigabe-Datensatz gesperrt
    const verboten = kundeZusammenfuehren({ api: { ...api, freigabe_zitat: "nein", freigabe_logo: false }, eintrag });
    assert.equal(verboten.zitat, null);
    assert.equal(verboten.logoUrl, "");
  });
  test("Backoffice-Freigabe (get_freigaben) gewinnt über kunden.js und Projektfelder", () => {
    const api = { zitat: "Top.", zitat_person: "GF", logo_url: "https://api.muster.at/l.svg" };
    const eintragFrei = { ...eintrag, freigabe: { zitat: true, logo: true, name: true, plakette: true } };
    // Datensatz sagt: nur Name und Plakette – Zitat und Logo trotz Projektfeldern/kunden.js gesperrt
    const nurName = kundeZusammenfuehren({ api, eintrag: eintragFrei, freigabe: { freigabe_name: 1, freigabe_plakette: 1, freigegeben_am: "2026-10-11" } });
    assert.equal(nurName.freigabe.name, true);
    assert.equal(nurName.freigabe.plakette, true);
    assert.equal(nurName.zitat, null);
    assert.equal(nurName.logoUrl, "");
    assert.equal(nurName.freigabe.zitat, false);
    assert.equal(nurName.freigabe.logo, false);
    assert.equal(nurName.freigabe.freigegebenAm, "2026-10-11");
    assert.equal(nurName.freigabe.quelle, "backoffice");
    // Datensatz mit Zitat: Wortlaut aus der Freigabe, Logo-Datei aus den Projektfeldern
    const mitZitat = kundeZusammenfuehren({ api, eintrag, freigabe: { freigabe_zitat: 1, zitat_text: "Aus der Freigabe.", zitat_person_funktion: "M. Muster, GF", freigabe_logo: 1 } });
    assert.deepEqual(mitZitat.zitat, { text: "Aus der Freigabe.", person: "M. Muster, GF" });
    assert.equal(mitZitat.logoUrl, "https://api.muster.at/l.svg");
    // widerrufener Datensatz → alles gesperrt, auch wenn kunden.js freigeben würde
    const widerrufen = kundeZusammenfuehren({ api, eintrag: eintragFrei, freigabe: { freigabe_name: 1, freigabe_zitat: 1, widerrufen_am: "2026-11-01" } });
    assert.equal(widerrufen.zitat, null);
    assert.equal(widerrufen.logoUrl, "");
    assert.equal(widerrufen.freigabe.name, false);
    assert.equal(widerrufen.freigabe.plakette, false);
    // Zitat freigegeben, aber ohne Wortlaut in der Freigabe → Text aus den Projektfeldern
    const ohneText = kundeZusammenfuehren({ api, eintrag, freigabe: { freigabe_zitat: 1 } });
    assert.deepEqual(ohneText.zitat, { text: "Top.", person: "GF" });
  });
  test("Quellen als Text/JSON aus dem Backoffice", () => {
    const text = kundeZusammenfuehren({ api: { firma: "X", portraet_quellen: "Firmenbuch | https://a.at\nwww.b.at;javascript:alert(1)" } });
    assert.deepEqual(text.quellen, [
      { url: "https://a.at/", titel: "Firmenbuch" },
      { url: "https://www.b.at/", titel: "b.at" },
    ]);
    const json = kundeZusammenfuehren({ api: { firma: "X", portraet_quellen: '["https://c.at/pfad"]' } });
    assert.deepEqual(json.quellen, [{ url: "https://c.at/pfad", titel: "c.at" }]);
  });
  test("keine Daten → null", () => {
    assert.equal(kundeZusammenfuehren(), null);
    assert.equal(kundeZusammenfuehren({ api: "kaputt", eintrag: 5 }), null);
    assert.equal(kundeZusammenfuehren({ eintrag: { ort: "Linz", geprueftAm: "2026-01-01" } }), null);
  });
  test("hatPortraet / socialListe / kundeSchema (Schema nur mit Namensfreigabe)", () => {
    const k = kundeZusammenfuehren({ eintrag: { ...eintrag, social: { youtube: "https://youtube.com/@m", linkedin: "https://linkedin.com/company/m" } } });
    assert.equal(hatPortraet(k), true);
    assert.equal(hatPortraet(null), false);
    assert.deepEqual(socialListe(k).map((s) => s.key), ["linkedin", "youtube"]); // feste Reihenfolge
    assert.equal(kundeSchema(k), null); // ohne Namensfreigabe kein Organisation-Schema
    const frei = { ...k, freigabe: { ...k.freigabe, name: true } };
    const schema = kundeSchema(frei);
    assert.equal(schema["@type"], "Organization");
    assert.equal(schema.name, "Muster Metall GmbH");
    assert.deepEqual(schema.sameAs, ["https://linkedin.com/company/m", "https://youtube.com/@m"]);
    assert.equal(schema.address.addressLocality, "Ostermiething");
    assert.equal(schema.logo, undefined); // kein freigegebenes Logo
    assert.equal(kundeSchema({ firma: "X", freigabe: { name: true } }), null);
    assert.equal(kundeSchema({ website: "https://x.at/" }), null);
  });
  test("datumAT", () => {
    assert.equal(datumAT("2026-09-30"), "30.09.2026");
    assert.equal(datumAT("2026-09-30T10:00:00Z"), "30.09.2026");
    assert.equal(datumAT("Sept. 2026"), "Sept. 2026");
    assert.equal(datumAT(null), "");
  });
});

describe("Social-Media-Texte", () => {
  const zahlen = schaetzung({ kwp: 250 });
  test("mit Kennzahlen: drei Vorschläge, Schätzung, Hashtags, Link", () => {
    const t = postVorschlaege({ firma: "Muster GmbH", ort: "Ostermiething", jahr: 2024, zahlen, url: "https://www.oekovolt.com/referenzen/projekte/muster" });
    assert.equal(t.length, 3);
    assert.match(t[0].text, /Muster GmbH betreibt in Ostermiething eine Photovoltaikanlage mit 250 kWp \(in Betrieb seit 2024\)/);
    assert.match(t[0].text, /Mehr zum Projekt: https:\/\/www\.oekovolt\.com/);
    assert.match(t[1].text, /\(Schätzung\)/);
    for (const x of t) {
      assert.ok(x.text.includes(HASHTAGS));
      assert.doesNotMatch(x.text, /undefined|NaN|null/);
    }
  });
  test("ohne Kennzahlen: zwei Vorschläge ohne Zahlen", () => {
    const t = postVorschlaege({ firma: "Muster GmbH" });
    assert.equal(t.length, 2);
    assert.doesNotMatch(t.map((x) => x.text).join(" "), /kWp|MWh|undefined/);
  });
});

describe("Projekt-Plakette", () => {
  const zahlen = schaetzung({ kwp: 100 });
  const gemessen = schaetzung({ kwp: 100, ertragKwh: 98000, zeitraum: "2025" });
  const verbotenRe = new RegExp(PLAKETTE_VERBOTEN.join("|"), "i");
  const sichtbarerText = (svg) => svg.replace(/<[^>]+>/g, " ");

  test("plaketteMasse", () => {
    assert.deepEqual(plaketteMasse("klein", zahlen), { breite: 340, hoehe: 150 });
    assert.deepEqual(plaketteMasse("klein", null), { breite: 340, hoehe: 112 });
    assert.deepEqual(plaketteMasse("breit", zahlen), { breite: 728, hoehe: 96 });
    assert.deepEqual(plaketteMasse("riesig", zahlen), plaketteMasse("klein", zahlen));
    assert.deepEqual(Object.keys(PLAKETTE_FORMATE), ["klein", "breit"]);
  });
  test("umbrechen: Zeilenlänge und Kürzung", () => {
    const z = umbrechen("Muster Metallbau und Anlagentechnik Gesellschaft m.b.H. & Co KG", 29, 2);
    assert.equal(z.length, 2);
    assert.ok(z.every((x) => x.length <= 29), JSON.stringify(z));
    assert.ok(z[1].endsWith("…"));
    assert.deepEqual(umbrechen("Kurz", 29), ["Kurz"]);
    const lang = umbrechen("A".repeat(40), 29);
    assert.equal(lang.length, 1);
    assert.equal(lang[0].length, 29);
    assert.deepEqual(umbrechen("", 10), []);
  });
  test("Kernsatz und Alternativtext: sachlich, Jahr/kWp nur wenn bekannt, Name nur mit Freigabe", () => {
    assert.equal(plaketteText({ jahr: 2024, zahlen }), "Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH · 2024 · 100 kWp");
    assert.equal(plaketteText({}), "Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH");
    assert.equal(plaketteAlt({ firma: "Muster", jahr: 2024, zahlen }), "Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH · 2024 · 100 kWp");
    assert.equal(plaketteAlt({ firma: "Muster", jahr: 2024, zahlen, nameFrei: true }), "Muster: Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH · 2024 · 100 kWp");
  });
  test("plaketteSvg: gültige Maße, Texte maskiert (kein Markup aus dem Firmennamen), kein Siegel-Vokabular", () => {
    const svg = plaketteSvg({ firma: 'A & B <script>alert("x")</script>', zahlen, jahr: 2024, nameFrei: true });
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="340" height="150"/);
    assert.ok(svg.endsWith("</svg>"));
    assert.ok(!svg.includes("<script"), "kein <script> im SVG");
    assert.ok(svg.includes("A &amp; B &lt;script&gt;"));
    assert.ok(svg.includes("Photovoltaikanlage errichtet von Ökovolt Solartechnik GmbH"));
    assert.ok(svg.includes("Inbetriebnahme 2024"));
    assert.equal((svg.match(/<text/g) || []).length, (svg.match(/<\/text>/g) || []).length);
    assert.doesNotMatch(svg, /NaN|undefined/);
    for (const variante of [
      plaketteSvg({ firma: "Muster", zahlen, jahr: 2024, nameFrei: true }),
      plaketteSvg({ firma: "Muster", zahlen: gemessen, jahr: 2024, format: "breit", stil: "dunkel", nameFrei: true, rechenwegUrl: "https://www.oekovolt.com/referenzen/projekte/muster/esg" }),
      plaketteSvg({ firma: "Muster" }),
      plaketteSvg({ firma: "Muster", zahlen: gemessen, rechenwegUrl: "https://www.oekovolt.com/referenzen/projekte/muster/esg" }),
    ]) {
      assert.doesNotMatch(sichtbarerText(variante), verbotenRe, variante);
      assert.doesNotMatch(variante, /<circle|<polygon|<path/, "kein Rosetten-/Prüfzeichen-Look");
    }
  });
  test("Firmenname nur mit Namensfreigabe", () => {
    assert.ok(!plaketteSvg({ firma: "Geheim GmbH", zahlen, jahr: 2024 }).includes("Geheim GmbH"));
    assert.ok(plaketteSvg({ firma: "Geheim GmbH", zahlen, jahr: 2024, nameFrei: true }).includes("Geheim GmbH"));
    assert.ok(!plaketteSvg({ firma: "Geheim GmbH", zahlen, format: "breit" }).includes("Geheim GmbH"));
  });
  test("CO₂ nur mit Messwert (quelleErtrag anlage) und Zeitraum – mit Rechenweg", () => {
    assert.equal(plaketteCo2Text(zahlen), "");
    assert.equal(plaketteCo2Text(schaetzung({ kwp: 100, ertragKwh: 98000 })), "");
    assert.match(plaketteCo2Text(gemessen), /^Ertrag 2025: 98\.000 kWh gemessen · vermiedene Emissionen ca\. 25 t CO₂ \(258,2 g CO₂\/kWh\)$/);
    const ohne = plaketteSvg({ firma: "M", zahlen, jahr: 2024, format: "breit" });
    assert.ok(!ohne.includes("CO₂"), "Richtwert: keine CO₂-Angabe");
    assert.ok(ohne.includes("Richtwert 1.050 kWh/kWp"));
    const mit = plaketteSvg({ firma: "M", zahlen: gemessen, jahr: 2024, format: "breit", rechenwegUrl: "https://www.oekovolt.com/referenzen/projekte/m/esg" });
    assert.ok(mit.includes("Ertrag 2025: 98.000 kWh gemessen"));
    assert.ok(mit.includes("Rechenweg: oekovolt.com/referenzen/projekte/m/esg"));
    const klein = plaketteSvg({ firma: "M", zahlen: gemessen, jahr: 2024 });
    assert.ok(klein.includes("(2025, Messwert)"));
    const dunkel = plaketteSvg({ firma: "Muster", zahlen, stil: "dunkel", format: "breit" });
    assert.match(dunkel, /width="728" height="96"/);
    assert.ok(dunkel.includes("#03122b"));
    const leer = plaketteSvg({ firma: "Muster", stil: "neon", format: "x" });
    assert.match(leer, /width="340" height="112"/);
    assert.ok(leer.includes("#ffffff"));
    assert.ok(!leer.includes("kWp"));
  });
  test("plaketteBildUrl / einbauCode: nofollow, &amp; im Attribut, Maße, Name nur mit Freigabe", () => {
    assert.equal(plaketteBildUrl({ slug: "muster" }), "/siegel/muster.svg");
    assert.equal(plaketteBildUrl({ basis: "https://www.oekovolt.com", slug: "muster", stil: "dunkel", format: "breit" }), "https://www.oekovolt.com/siegel/muster.svg?stil=dunkel&format=breit");
    const code = einbauCode({ basis: "https://www.oekovolt.com", slug: "muster", firma: 'Muster "GmbH"', zahlen, jahr: 2024, stil: "dunkel", format: "breit", nameFrei: true });
    assert.match(code, /rel="nofollow noopener"/);
    assert.match(code, /href="https:\/\/www\.oekovolt\.com\/referenzen\/projekte\/muster"/);
    assert.match(code, /\?stil=dunkel&amp;format=breit/);
    assert.match(code, /width="728" height="96"/);
    assert.match(code, /alt="Muster &quot;GmbH&quot;: Photovoltaikanlage errichtet von/);
    assert.ok(!einbauCode({ basis: "https://www.oekovolt.com", slug: "muster", firma: "Geheim", zahlen }).includes("Geheim"));
  });
});

describe("Welle A07 – Dateien", () => {
  test("Freigabeseite: noindex, kein Cache, kein Referrer, nichts vorangekreuzt, Vertretungsbefugnis Pflicht", () => {
    const seite = datei("src/app/referenzen/freigabe/[token]/page.js");
    assert.match(seite, /robots: \{ index: false, follow: false/);
    assert.match(seite, /export const dynamic = "force-dynamic"/);
    assert.match(seite, /referrer: "no-referrer"/);
    const form = datei("src/app/referenzen/freigabe/[token]/FreigabeFormular.js");
    assert.match(form, /vertretungsbefugnis_bestaetigt: false/);
    assert.match(form, /Ich bin berechtigt, diese Erklärung für das Unternehmen abzugeben/);
    assert.match(form, /erkennbaren Personen veröffentlichen wir nur mit deren eigener Einwilligung/);
    assert.match(form, /Keine Gegenleistung/);
    assert.match(form, /widerrufen/i);
    for (const feld of ["name", "logo", "zitat", "fotos_anlage", "plakette", "livedaten", "messwerte"]) {
      assert.match(form, new RegExp(`^\\s*${feld}: false,`, "m"), `${feld} standardmäßig aus`);
    }
    assert.doesNotMatch(form, /defaultChecked|checked=\{true\}/);
  });
  test("Proxy-Route: nur POST, JSON-Limit, Herkunft, Drosselung, Vertretungsbefugnis Pflicht", () => {
    const route = datei("src/app/api/referenz-freigabe/route.js");
    assert.match(route, /export async function POST/);
    assert.doesNotMatch(route, /export async function GET/);
    assert.match(route, /herkunftAbgelehnt\(request\)/);
    assert.match(route, /gedrosselt\(request, "referenz-freigabe"\)/);
    assert.match(route, /leseJson\(request\)/);
    assert.match(route, /vertretungsbefugnis_bestaetigt, "vertretungsbefugnis_bestaetigt"/);
    assert.match(datei("src/lib/api/uber-uns/anfrageWeiterleiten.js"), /MAX_BYTES = 24_000/);
  });
  test("/siegel/<slug>: 404 ohne Freigabe „Plakette“, Name nur mit Namensfreigabe", () => {
    const route = datei("src/app/siegel/[slug]/route.js");
    assert.match(route, /if \(!d\.kit\.plakette\) return nichtGefunden/);
    assert.match(route, /status: 404/);
    assert.match(route, /nameFrei: d\.nameFrei/);
    assert.doesNotMatch(route.replace(/^\/\/.*$/gm, ""), /Solar-Siegel/);
  });
  test("Server: Messwerte nur mit Freigabe, Freigaben-Ladefehler → nichts freigegeben", () => {
    const server = datei("src/lib/kundenbuehneServer.js");
    assert.match(server, /freigabe\.messwerte \? Number\(roh\?\.ertrag\)/);
    assert.match(server, /catch \(error\) \{[^}]*return \{\};/);
    assert.match(server, /!\("email" in f\)/);
  });
  test("PV-Award: ohne „Rechtsweg ausgeschlossen“, Veröffentlichung getrennt einwilligbar, Kennzeichnung", () => {
    assert.ok(!TEILNAHME.some((t) => /Rechtsweg/.test(t)));
    assert.ok(TEILNAHME.some((t) => t.includes(JURY_KLAUSEL)));
    assert.equal(JURY_KLAUSEL, "Die Jury entscheidet nach den veröffentlichten Kriterien; ein Anspruch auf Auszeichnung besteht nicht.");
    assert.equal(AWARD_KENNZEICHNUNG, "Unternehmenspreis der Ökovolt Solartechnik GmbH für ihre Kundinnen und Kunden");
    const api = datei("src/app/api/award/route.js");
    assert.doesNotMatch(api, /p\.wenn\(!d\.veroeffentlichung/);
    assert.match(api, /AWARD_KENNZEICHNUNG/);
    const form = datei("src/components/Award/AwardEinreichung.js");
    assert.doesNotMatch(form, /if \(!w\.veroeffentlichung\)/);
    assert.match(form, /AWARD_KENNZEICHNUNG/);
    const seite = datei("src/app/pv-award/page.js");
    assert.match(seite, /AWARD_STATUS !== "konzept" && TERMINE\.fix/);
    for (const d of [api, form, seite, datei("src/components/Award/AwardKriterien.js"), datei("src/components/Award/awardDaten.js")]) {
      assert.doesNotMatch(d.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*\*.*?\*\//gs, ""), /Rechtsweg/);
    }
  });
  test("Referenzkarte: keine deutschen Orte mehr", () => {
    assert.ok(STANDORTE.length > 0);
    for (const s of STANDORTE) assert.equal(s.land, "Österreich", s.label);
    for (const ort of ["Augsburg", "Kempten", "Mering", "Ravensburg", "Lindau", "Oberegg", "Bergheim"]) assert.equal(bekannteKoordinaten(ort), null, ort);
    assert.equal(bekannteKoordinaten("Salzburg").land, "Österreich");
    assert.doesNotMatch(datei("src/components/Referenzkarte/standorte.js"), /land: "Deutschland"/);
  });
});

describe("Projektliste ohne Kundennamen (QA-Befund A07)", () => {
  const { PROJEKTE } = projekteModul;
  test("neutralerProjektName: Branche + Bundesland, sonst Referenzanlage mit Leistung – nie die Firma", () => {
    assert.equal(neutralerProjektName({ firma: "ALPLA", branche: "Kunststoffverpackungen", ort: "Hard, Vorarlberg" }), "Kunststoffverpackungen, Vorarlberg");
    assert.equal(neutralerProjektName({ branche: "Autohaus und Werkstätte (Ford-Partner)", ort: "Tragwein, Oberösterreich (Firmensitz)" }), "Autohaus und Werkstätte, Oberösterreich");
    assert.equal(neutralerProjektName(null, { leistung: 409.2, leistung_label: "409,2 kWp" }), "Referenzanlage 409,2 kWp");
    assert.equal(neutralerProjektName(null, {}), "Referenzanlage");
  });
  test("projektNeutralisieren: Name, Alt-Texte und Slug ohne Firmennamen; alter Slug bleibt als Schlüssel", () => {
    for (const roh of PROJEKTE) {
      const kunde = KUNDEN[roh.projekt_website_name];
      const n = projektNeutralisieren(roh, neutralerProjektName(kunde, roh));
      assert.equal(n.projekt_anonym, true);
      assert.equal(n.projekt_website_name, roh.projekt_website_name);
      const sichtbar = [n.projekt_name, n.bild_alt, ...(n.bilder || []).map((b) => b.bild_alt)].join(" | ");
      assert.ok(!sichtbar.includes(roh.projekt_name), `${roh.projekt_name} → ${sichtbar}`);
      if (kunde?.firma) assert.ok(!sichtbar.toLowerCase().includes(kunde.firma.toLowerCase()), kunde.firma);
    }
  });
  test("ladeProjekte und Sitemap neutralisieren zentral (projekteNeutralisieren), fail closed", () => {
    const lade = datei("src/components/Project/ladeProjekte.js");
    assert.match(lade, /projekteNeutralisieren\(liste\.projekte/);
    assert.match(lade, /projektNeutralisieren\(p, eintrag\.projekt_name\)/);
    assert.match(datei("src/app/sitemap.js"), /projekteNeutralisieren\(PROJEKTE/);
    const server = datei("src/lib/kundenbuehneServer.js");
    assert.match(server, /export async function projekteNeutralisieren/);
    assert.match(server, /if \(nameFrei\(kunde\)\) return \{ roh, name: null \}/);
  });
});
