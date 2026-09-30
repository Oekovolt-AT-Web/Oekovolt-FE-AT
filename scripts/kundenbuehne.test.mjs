// Tests für src/lib/kundenbuehne.js (Kundenporträt, Solar-Siegel, Social-Kit, Schätzung).
// Aufruf: node scripts/kundenbuehne.test.mjs
// projektDaten.js (Konstante ERTRAG_JE_KWP) nutzt den "@/"-Alias → über scripts/lib/alias.mjs geladen.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { srcUrl } from "./lib/alias.mjs";
import {
  CO2_G_PRO_KWH,
  CO2_KG_PRO_KWH,
  ERTRAG_JE_KWP,
  HASHTAGS,
  SIEGEL_FORMATE,
  datumAT,
  einbauCode,
  fmtCa,
  fmtKwp,
  hatPortraet,
  kundeSchema,
  kundeZusammenfuehren,
  linkedinShareUrl,
  normUrl,
  postVorschlaege,
  schaetzung,
  siegelAlt,
  siegelBildUrl,
  siegelMasse,
  siegelSvg,
  socialListe,
  umbrechen,
  urlKurz,
} from "../src/lib/kundenbuehne.js";
import { ANNAHMEN } from "../src/data/solarrechner.js";

const projektDaten = await import(srcUrl("components/Project/projektDaten.js"));
const nahe = (ist, soll, tol) => assert.ok(Math.abs(ist - soll) <= tol, `${ist} ≠ ${soll} (±${tol})`);

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
    assert.equal(s.ertragJeKwp, 1050);
    assert.deepEqual(s.texte, { kwp: "100 kWp", mwh: "ca. 105 MWh", co2: "ca. 27 t CO₂" });
  });
  test("Anlagendaten aus dem Backoffice haben Vorrang", () => {
    const s = schaetzung({ kwp: 100, ertragKwh: 98000 });
    assert.equal(s.quelleErtrag, "anlage");
    assert.equal(s.ertragJeKwp, 980);
    const nurErtrag = schaetzung({ ertragKwh: "50000" });
    assert.equal(nurErtrag.kwp, null);
    assert.equal(nurErtrag.ertragJeKwp, null);
    assert.equal(nurErtrag.texte.kwp, "");
    assert.equal(schaetzung({ kwp: 10, ertragKwh: -5 }).quelleErtrag, "richtwert");
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
    freigabe: { zitat: false, logo: false },
    zitat: "Nicht freigegeben",
    logo: "https://muster-metall.at/logo.png",
  };

  test("nur kunden.js: normalisiert, ungültige Profile verworfen, ohne Freigabe kein Zitat/Logo", () => {
    const k = kundeZusammenfuehren({ eintrag });
    assert.equal(k.website, "https://www.muster-metall.at/");
    assert.deepEqual(Object.keys(k.social), ["linkedin"]);
    assert.equal(k.zitat, null);
    assert.equal(k.logoUrl, "");
    assert.deepEqual(k.freigabe, { zitat: false, logo: false });
    assert.deepEqual(k.quellen, [{ url: "https://www.justiz.gv.at/", titel: "Firmenbuch" }]);
  });
  test("Freigabe in kunden.js („ja“/1/true) gibt Zitat und Logo frei", () => {
    for (const ja of [true, 1, "1", "ja", " Yes "]) {
      const k = kundeZusammenfuehren({ eintrag: { ...eintrag, freigabe: { zitat: ja, logo: ja }, zitatPerson: "M. Muster" } });
      assert.deepEqual(k.zitat, { text: "Nicht freigegeben", person: "M. Muster" }, String(ja));
      assert.equal(k.logoUrl, "https://muster-metall.at/logo.png");
    }
    const nein = kundeZusammenfuehren({ eintrag: { ...eintrag, freigabe: { zitat: "nein", logo: 0 } } });
    assert.equal(nein.zitat, null);
    assert.equal(nein.logoUrl, "");
  });
  test("API-Felder gewinnen; API-Zitat gilt als freigegeben außer ausdrücklichem Nein", () => {
    const api = { website_url: "https://api.muster.at", branche: "Stahlbau", zitat: "Top.", zitat_person: "GF", logo_url: "https://api.muster.at/l.svg", jahr: "2024", linkedin: "" };
    const k = kundeZusammenfuehren({ api, eintrag });
    assert.equal(k.website, "https://api.muster.at/");
    assert.equal(k.branche, "Stahlbau");
    assert.equal(k.social.linkedin, "https://www.linkedin.com/company/muster"); // leerer API-Wert → kunden.js
    assert.deepEqual(k.zitat, { text: "Top.", person: "GF" });
    assert.equal(k.logoUrl, "https://api.muster.at/l.svg");
    assert.equal(k.jahr, 2024);
    const verboten = kundeZusammenfuehren({ api: { ...api, freigabe_zitat: "nein", freigabe_logo: false }, eintrag });
    assert.equal(verboten.zitat, null);
    assert.equal(verboten.logoUrl, "");
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
  test("hatPortraet / socialListe / kundeSchema", () => {
    const k = kundeZusammenfuehren({ eintrag: { ...eintrag, social: { youtube: "https://youtube.com/@m", linkedin: "https://linkedin.com/company/m" } } });
    assert.equal(hatPortraet(k), true);
    assert.equal(hatPortraet(null), false);
    assert.deepEqual(socialListe(k).map((s) => s.key), ["linkedin", "youtube"]); // feste Reihenfolge
    const schema = kundeSchema(k);
    assert.equal(schema["@type"], "Organization");
    assert.equal(schema.name, "Muster Metall GmbH");
    assert.deepEqual(schema.sameAs, ["https://linkedin.com/company/m", "https://youtube.com/@m"]);
    assert.equal(schema.address.addressLocality, "Ostermiething");
    assert.equal(schema.logo, undefined); // kein freigegebenes Logo
    assert.equal(kundeSchema({ firma: "X" }), null);
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

describe("Solar-Siegel", () => {
  const zahlen = schaetzung({ kwp: 100 });
  test("siegelMasse", () => {
    assert.deepEqual(siegelMasse("klein", zahlen), { breite: 340, hoehe: 176 });
    assert.deepEqual(siegelMasse("klein", null), { breite: 340, hoehe: 118 });
    assert.deepEqual(siegelMasse("breit", zahlen), { breite: 728, hoehe: 112 });
    assert.deepEqual(siegelMasse("riesig", zahlen), siegelMasse("klein", zahlen));
    assert.deepEqual(Object.keys(SIEGEL_FORMATE), ["klein", "breit"]);
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
  test("siegelSvg: gültige Maße, Kennzahlen, Texte maskiert (kein Markup aus dem Firmennamen)", () => {
    const svg = siegelSvg({ firma: 'A & B <script>alert("x")</script>', zahlen });
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="340" height="176"/);
    assert.ok(svg.endsWith("</svg>"));
    assert.ok(!svg.includes("<script"), "kein <script> im SVG");
    assert.ok(svg.includes("A &amp; B &lt;script&gt;"));
    assert.ok(svg.includes("ca. 105"));
    assert.equal((svg.match(/<text/g) || []).length, (svg.match(/<\/text>/g) || []).length);
    assert.doesNotMatch(svg, /NaN|undefined/);
  });
  test("siegelSvg: breit und dunkel, ohne Zahlen", () => {
    const breit = siegelSvg({ firma: "Muster", zahlen, stil: "dunkel", format: "breit" });
    assert.match(breit, /width="728" height="112"/);
    assert.ok(breit.includes("#03122b"));
    assert.ok(breit.includes("Schätzung · 1.050 kWh/kWp · 258,2 g CO₂/kWh"));
    const ohne = siegelSvg({ firma: "Muster", stil: "neon", format: "x" });
    assert.match(ohne, /width="340" height="118"/);
    assert.ok(ohne.includes("#ffffff"));
    assert.ok(!ohne.includes("kWp"));
    assert.equal(siegelAlt("Muster", null), "Muster erzeugt Sonnenstrom. Solaranlage: Ökovolt");
  });
  test("siegelBildUrl / einbauCode: nofollow, &amp; im Attribut, Maße", () => {
    assert.equal(siegelBildUrl({ slug: "muster" }), "/siegel/muster.svg");
    assert.equal(siegelBildUrl({ basis: "https://www.oekovolt.com", slug: "muster", stil: "dunkel", format: "breit" }), "https://www.oekovolt.com/siegel/muster.svg?stil=dunkel&format=breit");
    const code = einbauCode({ basis: "https://www.oekovolt.com", slug: "muster", firma: 'Muster "GmbH"', zahlen, stil: "dunkel", format: "breit" });
    assert.match(code, /rel="nofollow noopener"/);
    assert.match(code, /href="https:\/\/www\.oekovolt\.com\/referenzen\/projekte\/muster"/);
    assert.match(code, /\?stil=dunkel&amp;format=breit/);
    assert.match(code, /width="728" height="112"/);
    assert.match(code, /alt="Muster &quot;GmbH&quot; erzeugt Sonnenstrom/);
  });
});
