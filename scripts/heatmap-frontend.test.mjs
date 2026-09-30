// Tests für die Klick-/Scroll-Heatmap:
//   src/lib/heatmap.js (gemeinsame Regeln Browser/Server) und die reinen Teile des Sammlers
//   src/components/Statistik/HeatmapSammler.js (Einwilligung, CSS-Selektor) mit einem Mini-DOM.
// Aufruf: node scripts/heatmap-frontend.test.mjs
// HeatmapSammler.js importiert "@/lib/heatmap" → über scripts/lib/alias.mjs geladen.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { srcUrl } from "./lib/alias.mjs";
import {
  HEATMAP_GERAETE,
  HEATMAP_MAX_PFAD,
  HEATMAP_MAX_SEL,
  geraetFuerBreite,
  heatmapAusgenommen,
  pfadGueltig,
  runden05,
  runden10,
  selektorGueltig,
} from "../src/lib/heatmap.js";

describe("lib/heatmap – Regeln", () => {
  test("heatmapAusgenommen: Token-Seiten, TV, Hinweisgebersystem, Zugangscodes", () => {
    for (const p of ["/scan", "/scan/abc", "/fortsetzen/xyz", "/tv", "/tv/halle", "/hinweisgebersystem", "/Hinweisgebersystem/meldung", "/angebot/AbCdEf1234567890xy", "/x/0123456789abcdef01234567"]) {
      assert.equal(heatmapAusgenommen(p), true, p);
    }
    for (const p of ["/", "/scanner", "/photovoltaik-gewerbe", "/ratgeber/photovoltaik-foerderung-2026-oberoesterreich", "/referenzen/projekte/alpla-werke-alwin-lehner-gmbh-co-kg", "/x/0123456789abcdef"]) {
      assert.equal(heatmapAusgenommen(p), false, p);
    }
    for (const kein of [null, undefined, 5, {}]) assert.equal(heatmapAusgenommen(kein), true);
  });
  test("geraetFuerBreite: Grenzen 768 / 1200 px", () => {
    assert.equal(geraetFuerBreite(0), "mobil");
    assert.equal(geraetFuerBreite(767), "mobil");
    assert.equal(geraetFuerBreite(768), "tablet");
    assert.equal(geraetFuerBreite(1199), "tablet");
    assert.equal(geraetFuerBreite(1200), "desktop");
    assert.ok(HEATMAP_GERAETE.includes(geraetFuerBreite(NaN)));
  });
  test("runden05: 0..1 auf 0,05, geklemmt, Unsinn → 0", () => {
    assert.equal(runden05(0), 0);
    assert.equal(runden05(0.024), 0);
    assert.equal(runden05(0.026), 0.05);
    assert.equal(runden05(0.33), 0.35);
    assert.equal(runden05(0.5), 0.5);
    assert.equal(runden05(1.2), 1);
    assert.equal(runden05(-1), 0);
    assert.equal(runden05("abc"), 0);
    assert.equal(runden05(undefined), 0);
    // keine Gleitkomma-Reste (z. B. 0.15000000000000002)
    for (let i = 0; i <= 100; i++) {
      const v = runden05(i / 100);
      assert.equal(String(v).length <= 4, true, String(v));
    }
  });
  test("runden10: 0..100 auf 10", () => {
    assert.equal(runden10(0), 0);
    assert.equal(runden10(44), 40);
    assert.equal(runden10(55), 60);
    assert.equal(runden10(101), 100);
    assert.equal(runden10(-5), 0);
    assert.equal(runden10("x"), 0);
  });
  test("pfadGueltig: nur saubere Pfade", () => {
    assert.equal(pfadGueltig("/"), true);
    assert.equal(pfadGueltig("/rechner/gewerbe-pv"), true);
    assert.equal(pfadGueltig("/" + "a".repeat(HEATMAP_MAX_PFAD - 1)), true);
    for (const p of ["", "rechner", "/" + "a".repeat(HEATMAP_MAX_PFAD), "/a?b=1", "/a#x", "/a b", "/a\tb", "/<script>", '/a"b', "/a'b", "/a\\b", "/a\u0000", "/a\u007f", null, 5]) {
      assert.equal(pfadGueltig(p), false, JSON.stringify(p));
    }
  });
  test("selektorGueltig: Länge und keine Markup-/CSS-Blöcke", () => {
    assert.equal(selektorGueltig('main > section:nth-of-type(2) > a[data-heatmap="cta"]'), true);
    assert.equal(selektorGueltig("#kontakt"), true);
    assert.equal(selektorGueltig("a".repeat(HEATMAP_MAX_SEL)), true);
    for (const s of ["", "a".repeat(HEATMAP_MAX_SEL + 1), "a{color:red}", "a;b", "<img>", "a\nb", null, 1]) assert.equal(selektorGueltig(s), false, JSON.stringify(s));
  });
});

// ---------------------------------------------------------------------------
// Mini-DOM: nur das, was selektorFuer() braucht (tagName, id, getAttribute, parentElement,
// children, closest) und document.querySelectorAll für die dort gebauten Attribut-Selektoren.

class El {
  constructor(tag, attrs = {}, kinder = []) {
    this.tagName = tag.toUpperCase();
    this.attrs = attrs;
    this.children = [];
    this.parentElement = null;
    for (const k of kinder) this.append(k);
  }
  append(k) {
    k.parentElement = this;
    this.children.push(k);
    return k;
  }
  get id() {
    return this.attrs.id || "";
  }
  getAttribute(a) {
    return a in this.attrs ? this.attrs[a] : null;
  }
  *alle() {
    yield this;
    for (const k of this.children) yield* k.alle();
  }
}

function dokument(body) {
  const html = new El("html", {}, [body]);
  const alle = () => [...html.alle()];
  return {
    body,
    documentElement: html,
    cookie: "",
    getElementsByTagName: (t) => alle().filter((e) => e.tagName === t.toUpperCase()),
    querySelectorAll(sel) {
      let m = sel.match(/^\[id="([^"]+)"\]$/);
      if (m) return alle().filter((e) => e.id === m[1]);
      m = sel.match(/^([a-z0-9]+)\[([\w-]+)="([^"]+)"\]$/);
      if (m) return alle().filter((e) => e.tagName === m[1].toUpperCase() && e.getAttribute(m[2]) === m[3]);
      throw new Error(`Mini-DOM: Selektor nicht unterstützt: ${sel}`);
    },
    querySelector(sel) {
      return this.querySelectorAll(sel)[0] || null;
    },
  };
}

const { heatmapErlaubt, selektorFuer } = await import(srcUrl("components/Statistik/HeatmapSammler.js"));

describe("HeatmapSammler – Einwilligung", () => {
  test("heatmapErlaubt: nur mit statistics === true im Cookie „cookieConsent“", () => {
    const vorher = globalThis.document;
    try {
      delete globalThis.document;
      assert.equal(heatmapErlaubt(), false); // Server / kein DOM
      const setze = (c) => (globalThis.document = { cookie: c });
      const wert = (o) => `cookieConsent=${encodeURIComponent(JSON.stringify(o))}`;
      setze(`a=1; ${wert({ statistics: true, marketing: false })}; b=2`);
      assert.equal(heatmapErlaubt(), true);
      setze(wert({ statistics: false }));
      assert.equal(heatmapErlaubt(), false);
      setze(wert({ statistics: "true" }));
      assert.equal(heatmapErlaubt(), false);
      setze("cookieConsent=%7Bkaputt");
      assert.equal(heatmapErlaubt(), false);
      setze("andereConsent=" + encodeURIComponent('{"statistics":true}'));
      assert.equal(heatmapErlaubt(), false);
      setze("");
      assert.equal(heatmapErlaubt(), false);
    } finally {
      if (vorher === undefined) delete globalThis.document;
      else globalThis.document = vorher;
    }
  });
});

describe("HeatmapSammler – selektorFuer (Mini-DOM)", () => {
  const mitDom = (body, fn) => {
    const vorher = globalThis.document;
    globalThis.document = dokument(body);
    try {
      return fn();
    } finally {
      if (vorher === undefined) delete globalThis.document;
      else globalThis.document = vorher;
    }
  };

  test("stabile id gewinnt, automatisch erzeugte ids werden ignoriert", () => {
    const btn = new El("button", { id: "kontakt-senden" });
    const auto = new El("button", { id: "radix-12" });
    const zahlen = new El("button", { id: "b12345" });
    const main = new El("main", {}, [new El("div", {}, [btn, auto, zahlen])]);
    mitDom(new El("body", {}, [main]), () => {
      assert.equal(selektorFuer(btn), "#kontakt-senden");
      assert.equal(selektorFuer(auto), "main > div > button:nth-of-type(2)");
      assert.equal(selektorFuer(zahlen), "main > div > button:nth-of-type(3)");
    });
  });
  test("data-heatmap und name nur mit „sprechendem“ Wert – nie Texte", () => {
    const cta = new El("a", { "data-heatmap": "cta-hero" });
    const text = new El("a", { "data-heatmap": "Jetzt Angebot anfordern!" });
    const feld = new El("input", { name: "email", value: "max@firma.at" });
    const section = new El("section", {}, [cta, text, new El("form", {}, [feld])]);
    mitDom(new El("body", {}, [new El("div", {}, [section])]), () => {
      assert.equal(selektorFuer(cta), 'a[data-heatmap="cta-hero"]');
      const s = selektorFuer(text);
      assert.equal(s, "body > div > section > a:nth-of-type(2)");
      assert.ok(!s.includes("Angebot"));
      const f = selektorFuer(feld);
      assert.equal(f, 'input[name="email"]');
      assert.ok(!f.includes("max@"));
    });
  });
  test("mehrdeutige Attribute fallen auf Tag-Pfad zurück; Anker header/footer/nav", () => {
    const a1 = new El("a", { "data-heatmap": "mehr" });
    const a2 = new El("a", { "data-heatmap": "mehr" });
    const nav = new El("nav", {}, [new El("ul", {}, [new El("li", {}, [a1]), new El("li", {}, [a2])])]);
    const footer = new El("footer", {}, [new El("p", {}, [new El("span")])]);
    mitDom(new El("body", {}, [nav, footer]), () => {
      assert.equal(selektorFuer(a2), "nav > ul > li:nth-of-type(2) > a");
      assert.equal(selektorFuer(footer.children[0].children[0]), "footer > p > span");
    });
  });
  test("Ergebnis besteht die Server-Prüfung selektorGueltig()", () => {
    const tief = new El("span");
    let e = tief;
    for (let i = 0; i < 4; i++) e = new El("div", {}, [e]);
    mitDom(new El("body", {}, [new El("main", {}, [e])]), () => {
      const s = selektorFuer(tief);
      assert.equal(s, "main > div > div > div > div > span");
      assert.equal(selektorGueltig(s), true);
      assert.equal(selektorFuer(globalThis.document.body), "body");
    });
  });
});
