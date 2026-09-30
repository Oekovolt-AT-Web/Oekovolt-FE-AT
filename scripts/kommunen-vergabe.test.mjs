// Tests für src/lib/kommunen/vergabe.js – Aufruf: node scripts/kommunen-vergabe.test.mjs
import assert from "node:assert/strict";
import { betragLesen, euro, vergabeWege, SCHWELLEN, DREI_ANGEBOTE_AB } from "../src/lib/kommunen/vergabe.js";

const weg = (r, id) => r.wege.find((w) => w.id === id);

// Formatierung
assert.equal(euro(200000), "200.000 €");
assert.equal(euro(5404000), "5.404.000 €");
assert.equal(euro(999.6), "1.000 €");
assert.equal(euro(NaN), "–");

// Eingaben lesen
assert.equal(betragLesen("180.000"), 180000);
assert.equal(betragLesen("180000"), 180000);
assert.equal(betragLesen("180 000 €"), 180000);
assert.equal(betragLesen("1,2 Mio"), 1200000);
assert.equal(betragLesen("2 Millionen"), 2000000);
assert.equal(betragLesen("49.999,50"), 50000);
assert.equal(betragLesen("abc"), null);
assert.equal(betragLesen(""), null);
assert.equal(betragLesen(-5), null);
assert.equal(betragLesen(75000), 75000);

// Schwellenwerte laut Vergaberechtsgesetz 2026
assert.equal(SCHWELLEN.klassisch.bau.direkt, 200000);
assert.equal(SCHWELLEN.klassisch.lieferDl.direkt, 140000);
assert.equal(SCHWELLEN.klassisch.bau.direktBekanntmachung, 2000000);
assert.equal(SCHWELLEN.sektoren.lieferDl.direkt, 150000);
assert.equal(SCHWELLEN.sektoren.lieferDl.direktBekanntmachung, 200000);
assert.equal(DREI_ANGEBOTE_AB, 50000);

// Ungültig
assert.equal(vergabeWege({ wert: NaN }), null);
assert.equal(vergabeWege({ wert: -1 }), null);
assert.equal(vergabeWege({ art: "unbekannt", wert: 1000 }), null);

// Bau, 45.000 €: Direktvergabe ohne Drei-Angebote-Pflicht
let r = vergabeWege({ art: "bau", wert: 45000 });
assert.equal(r.bereich, "unterschwelle");
assert.equal(weg(r, "direkt").zulaessig, true);
assert.ok(!r.pflichten.some((p) => p.includes("drei Angebote")));
assert.match(r.kurz, /^Direktvergabe möglich/);

// Genau 50.000 €: „übersteigt“ ist noch nicht erfüllt
r = vergabeWege({ art: "bau", wert: 50000 });
assert.ok(!r.pflichten.some((p) => p.includes("drei Angebote")));
r = vergabeWege({ art: "bau", wert: 50001 });
assert.ok(r.pflichten.some((p) => p.includes("drei Angebote")));

// Bau 199.999 € ja, 200.000 € nicht mehr direkt („nicht erreicht“)
assert.equal(weg(vergabeWege({ art: "bau", wert: 199999 }), "direkt").zulaessig, true);
r = vergabeWege({ art: "bau", wert: 200000 });
assert.equal(weg(r, "direkt").zulaessig, false);
assert.equal(weg(r, "direktBekanntmachung").zulaessig, true);
assert.equal(weg(r, "nichtOffenOhne").zulaessig, true);
assert.match(r.kurz, /^Direktvergabe mit vorheriger Bekanntmachung möglich/);
assert.ok(!r.pflichten.some((p) => p.includes("drei Angebote")));

// Bau 2.000.000 €: nur noch Verfahren mit Bekanntmachung
r = vergabeWege({ art: "bau", wert: 2000000 });
assert.equal(weg(r, "direktBekanntmachung").zulaessig, false);
assert.equal(weg(r, "nichtOffenOhne").zulaessig, false);
assert.equal(r.bereich, "unterschwelle");
assert.equal(r.kurz, "Verfahren mit österreichweiter Bekanntmachung nötig.");

// Bau EU-Schwelle
r = vergabeWege({ art: "bau", wert: 5404000 });
assert.equal(r.bereich, "oberschwelle");
assert.match(r.kurz, /EU-weites Verfahren/);

// Lieferung klassisch: 139.999 direkt, 140.000 nicht; nicht offenes Verfahren ohne Bekanntmachung entfällt
r = vergabeWege({ art: "lieferDl", wert: 139999 });
assert.equal(weg(r, "direkt").zulaessig, true);
assert.equal(weg(r, "nichtOffenOhne").zulaessig, false);
r = vergabeWege({ art: "lieferDl", wert: 140000 });
assert.equal(weg(r, "direkt").zulaessig, false);
assert.equal(weg(r, "direktBekanntmachung").zulaessig, false);
assert.equal(r.bereich, "unterschwelle");
assert.equal(vergabeWege({ art: "lieferDl", wert: 216000 }).bereich, "oberschwelle");
assert.equal(vergabeWege({ art: "lieferDl", wert: 215999 }).bereich, "unterschwelle");

// Sektorenauftraggeber (Stadtwerke)
r = vergabeWege({ auftraggeber: "sektoren", art: "lieferDl", wert: 149999 });
assert.equal(weg(r, "direkt").zulaessig, true);
r = vergabeWege({ auftraggeber: "sektoren", art: "lieferDl", wert: 180000 });
assert.equal(weg(r, "direkt").zulaessig, false);
assert.equal(weg(r, "direktBekanntmachung").zulaessig, true);
assert.equal(weg(r, "nichtOffenOhne"), undefined, "Sektoren Liefer/DL: keine Zeile ohne belegte Wertgrenze");
assert.ok(!r.pflichten.some((p) => p.includes("§ 46")), "Sektoren: kein Verweis auf § 46 (klassischer Bereich)");
assert.ok(weg(vergabeWege({ auftraggeber: "sektoren", art: "bau", wert: 1000 }), "nichtOffenOhne").zulaessig);
assert.equal(vergabeWege({ auftraggeber: "sektoren", art: "lieferDl", wert: 432000 }).bereich, "oberschwelle");
assert.equal(vergabeWege({ auftraggeber: "sektoren", art: "lieferDl", wert: 300000 }).bereich, "unterschwelle");

// Immer: Verfahren mit Bekanntmachung zulässig, Pflicht zur Schätzung nach § 13
for (const art of ["bau", "lieferDl"]) {
  for (const wert of [0, 60000, 500000, 9000000]) {
    const x = vergabeWege({ art, wert });
    assert.equal(weg(x, "mitBekanntmachung").zulaessig, true);
    assert.ok(x.pflichten.some((p) => p.includes("§ 13")));
  }
}

console.log("kommunen-vergabe: alle Tests bestanden");
