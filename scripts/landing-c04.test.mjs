// Tests für die Landingpages aus Welle C, Paket C04:
// /gewerbe/handel-logistik, /gewerbe/autohaus, /solarcarport.
// Geprüft wird der Quelltext (Server-Seiten mit JSX lassen sich ohne Build nicht importieren):
// keine Firmennamen ohne Freigabe, keine Logos, keine unbelegten Werbeaussagen, Lastprofile als
// Beispiel markiert, kWp-Werte der Autohäuser = projekte.js, EABG-Vorbehalt solange keine Kundmachung
// eingetragen ist, Konfigurator-Vorbelegung nur per Link.
//
// Aufruf: node scripts/landing-c04.test.mjs

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { ROOT, srcUrl } from "./lib/alias.mjs";

const lies = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const SEITEN = {
  handel: "src/app/gewerbe/handel-logistik/page.js",
  autohaus: "src/app/gewerbe/autohaus/page.js",
  carport: "src/app/solarcarport/page.js",
};
const QUELLE = Object.fromEntries(Object.entries(SEITEN).map(([k, p]) => [k, lies(p)]));

const zuordnung = await import(srcUrl("data/branchenZuordnung.js"));
const zielgruppen = await import(srcUrl("data/zielgruppen.js"));
const { KUNDEN } = await import(srcUrl("data/kunden.js"));
const projekteModul = await import(srcUrl("data/projekte.js"));

/** Sichtbarer Text grob: Kommentare entfernen (Belegnotizen dürfen Namen nennen). */
const ohneKommentare = (s) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

describe("C04 – Kundennamen und Logos", () => {
  const namen = ["TRANSDANUBIA", "Transdanubia", "Sochor", "Würth", "Wuerth", "Destalles", "Weichselbaumer", "AC Auto", "4you"];
  for (const [k, s] of Object.entries(QUELLE)) {
    test(`${k}: keine Firmennamen im sichtbaren Quelltext`, () => {
      const t = ohneKommentare(s);
      for (const n of namen) assert.ok(!t.includes(n), `${SEITEN[k]} nennt „${n}“`);
    });
    test(`${k}: keine Logos`, () => {
      assert.ok(!/logo/i.test(ohneKommentare(s).replace(/Logos? (zeigen wir|gar nicht|keine)/gi, "")), `${SEITEN[k]} verweist auf ein Logo`);
    });
    test(`${k}: keine unbelegten Werbeaussagen`, () => {
      const t = ohneKommentare(s);
      for (const w of ["TOP 3", "Top 3", "Marktführer", "Meisterbetrieb", "eigener Parkregler", "eigenen Parkregler", "unser Parkregler"]) {
        assert.ok(!t.includes(w), `${SEITEN[k]} enthält „${w}“`);
      }
    });
    test(`${k}: Salzburg AG nicht erwähnt (nur neutral an zentraler Stelle)`, () => {
      assert.ok(!ohneKommentare(s).includes("Salzburg AG"));
    });
  }
  test("Marke Ford nur als Kundenbezeichnung im Autohaus-Text", () => {
    const t = ohneKommentare(QUELLE.autohaus);
    assert.ok(t.includes("Ford-Partnerbetriebe"));
    assert.ok(!/ford\.(at|com)|ford-logo/i.test(t));
  });
});

describe("C04 – Referenzen belegt", () => {
  test("Handel & Logistik: Transdanubia, Sochor, Würth sind der Zielgruppe zugeordnet", () => {
    const slugs = zuordnung.slugsFuerZielgruppe("handel-logistik");
    for (const s of ["transdanubia-speditionsgesellschaft-mbh-pasching", "baumaerkte-a-sochor-co-gmbh", "wuerth-handelsgesmbh"]) {
      assert.ok(slugs.includes(s), `${s} fehlt in handel-logistik`);
    }
  });
  test("Autohaus: vier Ford-Partner zugeordnet, kWp-Werte stimmen mit projekte.js", () => {
    const slugs = zuordnung.slugsFuerZielgruppe("autohaus");
    assert.equal(slugs.length, 4);
    for (const s of slugs) assert.match(KUNDEN[s].branche, /Ford-Partner/);
    const liste = Object.values(projekteModul).find((v) => Array.isArray(v) && v.some((p) => p?.projekt_website_name));
    assert.ok(liste, "Projektliste in projekte.js nicht gefunden");
    const kwp = slugs.map((s) => liste.find((p) => p.projekt_website_name === s)?.leistung).sort((a, b) => b - a);
    const m = QUELLE.autohaus.match(/AUTOHAUS_KWP = \[([^\]]+)\]/);
    assert.ok(m, "AUTOHAUS_KWP fehlt");
    const seite = m[1].split(",").map(Number).sort((a, b) => b - a);
    assert.deepEqual(seite, kwp);
  });
  test("Autohaus-Kennzahlen tragen den Hinweis „Angaben Ökovolt Österreich · Stand …“", () => {
    assert.ok(QUELLE.autohaus.includes("KENNZAHLEN_HINWEIS_STAND"));
  });
});

describe("C04 – Lastprofile als Beispiel markiert", () => {
  for (const k of ["handel", "autohaus"]) {
    test(`${k}: jedes Profil ist als Beispielprofil betitelt, Hinweis „keine Messwerte“`, () => {
      const s = QUELLE[k];
      const titel = [...s.matchAll(/titel: "([^"]+)",\n\s+last:/g)].map((m) => m[1]);
      assert.ok(titel.length >= 2, "Profile nicht gefunden");
      for (const t of titel) assert.match(t, /Beispielprofil/);
      assert.match(s, /hinweis="Typisierte Beispielprofile[^"]*keine Messwerte/);
    });
  }
  test("Handel: Profile Kühlhaus, Verteilzentrum, Markt", () => {
    for (const id of ["kuehlhaus", "verteilzentrum", "markt"]) assert.ok(QUELLE.handel.includes(`id: "${id}"`), id);
  });
  test("Profile haben 24 Stundenwerte zwischen 0 und 1", () => {
    for (const k of ["handel", "autohaus"]) {
      for (const m of QUELLE[k].matchAll(/(?:last|uebergang|winter): \[([^\]]+)\]/g)) {
        const w = m[1].split(",").map(Number);
        assert.equal(w.length, 24, `${k}: ${m[0].slice(0, 30)}`);
        assert.ok(w.every((x) => x >= 0 && x <= 1));
      }
    }
  });
});

describe("C04 – Inhalte und Links", () => {
  test("Variante „handel“ existiert in zielgruppen.js", () => {
    assert.ok(zielgruppen.ZIELGRUPPEN.gewerbe.varianten.some((v) => v.schluessel[0] === "handel"));
  });
  test("Konfigurator-Vorbelegung nur per Link", () => {
    assert.ok(QUELLE.handel.includes('"/angebot?objekt=gewerbe&branche=handel"'));
    assert.ok(QUELLE.autohaus.includes("/angebot?objekt=gewerbe&branche="));
    assert.ok(QUELLE.carport.includes("/angebot?objekt=gewerbe&branche="));
  });
  test("Handel: Statik-, Brandschutz-, AFIR- und Mieter-Abschnitt vorhanden", () => {
    for (const s of ["/schneelast", "/ratgeber/photovoltaik-flachdach", "OVE R 11-1", "AFIR", "öffentlich zugängliche", "Mieter"]) {
      assert.ok(QUELLE.handel.includes(s), s);
    }
  });
  test("Autohaus verlinkt /ladeinfrastruktur", () => assert.ok(QUELLE.autohaus.includes('"/ladeinfrastruktur"')));
  test("Solarcarport: EABG-Vorbehalt solange keine Kundmachung eingetragen", () => {
    const s = QUELLE.carport;
    assert.ok(s.includes("const EABG_KUNDMACHUNG = null"), "Kundmachung eingetragen? Dann diesen Test anpassen");
    assert.ok(s.includes("Kundmachung ausstehend"));
    assert.ok(s.includes("Laut Parlamentsbeschluss"));
    assert.ok(s.includes("parlament.gv.at/aktuelles/pk/jahr_2026/pk0542"));
  });
  test("Jede Seite hat Quellen mit Stand und Prüfdatum", () => {
    for (const [k, s] of Object.entries(QUELLE)) {
      assert.match(s, /Quellen & Stand/, k);
      assert.match(s, /const STAND = "\d{2}\.\d{2}\.\d{4}"/, k);
      for (const m of s.matchAll(/\{ titel: [^}]*\}/g)) {
        if (m[0].includes("url:")) assert.match(m[0], /stand: "/, `${k}: Quelle ohne Stand – ${m[0].slice(0, 60)}`);
      }
    }
  });
  test("Kontrastregel: keine text-ink-400, kein text-white/30–45", () => {
    for (const [k, s] of Object.entries(QUELLE)) {
      assert.ok(!/\btext-ink-400\b/.test(s), k);
      assert.ok(!/text-white\/(30|35|40|45)\b/.test(s), k);
    }
  });
});
