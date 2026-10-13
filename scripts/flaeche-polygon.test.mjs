// Tests für src/lib/rechner/flaeche.js (Hallendach-Planer, B05) – Aufruf: node scripts/flaeche-polygon.test.mjs
//
// Referenz: strenge Fläche eines Breiten-/Längenrechtecks auf dem WGS84-Ellipsoid
//   A = b²·Δλ/2 · [ sinφ/(1−e²sin²φ) + 1/(2e)·ln((1+e·sinφ)/(1−e·sinφ)) ]₍φ₁₎^(φ₂)
// (Standardformel für den Flächeninhalt eines Ellipsoid-Trapezes, z. B. in Snyder,
// „Map Projections – A Working Manual“, USGS 1987, Gl. 3-19/24-13). Abnahme: ±1 %.

import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  WGS84,
  DACH_ABZUEGE,
  QM_PRO_KWP_STANDARD,
  distanzM,
  kruemmungsradius,
  kwpAusNutzflaeche,
  naechsterOrt,
  nutzflaeche,
  polygonFlaecheQm,
  polygonMitte,
  polygonUmfangM,
  rechteckFlaecheQm,
  uebergabeQuery,
  verschieben,
} from "../src/lib/rechner/flaeche.js";

const rad = (g) => (g * Math.PI) / 180;

/** Strenge Ellipsoidfläche zwischen zwei Breiten (Grad) über eine Längendifferenz (Grad). */
function ellipsoidRechteck(lat1, lat2, dLonGrad) {
  const e = Math.sqrt(WGS84.e2);
  const F = (phi) => {
    const s = Math.sin(rad(phi));
    return s / (1 - WGS84.e2 * s * s) + Math.log((1 + e * s) / (1 - e * s)) / (2 * e);
  };
  return ((WGS84.b * WGS84.b * rad(dLonGrad)) / 2) * (F(lat2) - F(lat1));
}

const nahe = (ist, soll, toleranz, text) => {
  const abw = Math.abs(ist - soll) / Math.abs(soll);
  assert.ok(abw <= toleranz, `${text}: ist ${ist}, soll ${soll}, Abweichung ${(abw * 100).toFixed(3)} %`);
};

describe("Polygonfläche (sphärische Formel auf lokalem Krümmungsradius)", () => {
  test("Krümmungsradius liegt zwischen Polar- und Äquatorradius und wächst mit der Breite", () => {
    const r0 = kruemmungsradius(0);
    const r48 = kruemmungsradius(48);
    const r90 = kruemmungsradius(90);
    assert.ok(r0 > 6350000 && r0 < 6380000);
    assert.ok(r48 > r0 && r90 > r48);
    nahe(r48, 6380344, 0.0002, "√(M·N) bei 48°");
  });

  test("Hallendach in Linz: 120 m × 60 m aus Breiten-/Längenrechteck ±1 % (strenge Ellipsoidfläche)", () => {
    // Ecke A, dann 120 m nach Osten und 60 m nach Norden über das Ellipsoid verschoben
    const a = { lat: 48.3069, lon: 14.2858 };
    const b = verschieben(a, 120, 0);
    const c = verschieben(a, 120, 60);
    const d = verschieben(a, 0, 60);
    const ist = polygonFlaecheQm([a, b, c, d]);
    const soll = ellipsoidRechteck(a.lat, c.lat, c.lon - a.lon);
    nahe(ist, soll, 0.01, "Rechteck Linz gegen Ellipsoid");
    nahe(ist, 7200, 0.01, "Rechteck Linz gegen 7.200 m²");
    // deutlich genauer als die Abnahme verlangt
    nahe(ist, soll, 0.0005, "Rechteck Linz (eng)");
  });

  test("großes Rechteck 1° × 1° bei 47–48° Breite ±1 % gegen Ellipsoid", () => {
    const ist = polygonFlaecheQm([
      [47, 13],
      [47, 14],
      [48, 14],
      [48, 13],
    ]);
    const soll = ellipsoidRechteck(47, 48, 1);
    nahe(ist, soll, 0.01, "1°×1°");
  });

  test("Reihenfolge, geschlossener Ring und Eingabeformate ändern das Ergebnis nicht", () => {
    const a = { lat: 47.8, lon: 13.0 };
    const b = verschieben(a, 80, 0);
    const c = verschieben(a, 80, 40);
    const d = verschieben(a, 0, 40);
    const f1 = polygonFlaecheQm([a, b, c, d]);
    const f2 = polygonFlaecheQm([d, c, b, a]); // andere Umlaufrichtung
    const f3 = polygonFlaecheQm([a, b, c, d, a]); // geschlossener Ring
    const f4 = polygonFlaecheQm([[a.lat, a.lon], { lat: b.lat, lng: b.lon }, c, d]); // Mischformate
    nahe(f2, f1, 1e-9, "Umlaufrichtung");
    nahe(f3, f1, 1e-9, "geschlossener Ring");
    nahe(f4, f1, 1e-9, "Eingabeformate");
    nahe(f1, 3200, 0.001, "80 × 40 m");
  });

  test("Dreieck = halbes Rechteck; Fünfeck (L-Form) = Summe der Teilflächen", () => {
    const a = { lat: 48.2, lon: 16.37 };
    const b = verschieben(a, 100, 0);
    const c = verschieben(a, 100, 50);
    const d = verschieben(a, 0, 50);
    nahe(polygonFlaecheQm([a, b, c]), 2500, 0.001, "Dreieck");
    // L-Form: 100×50 minus 40×20 Ecke oben rechts
    const e1 = verschieben(a, 100, 30);
    const e2 = verschieben(a, 60, 30);
    const e3 = verschieben(a, 60, 50);
    nahe(polygonFlaecheQm([a, b, e1, e2, e3, d]), 5000 - 800, 0.001, "L-Form");
  });

  test("weniger als drei Punkte oder ungültige Eingaben ergeben 0", () => {
    assert.equal(polygonFlaecheQm([]), 0);
    assert.equal(polygonFlaecheQm([{ lat: 48, lon: 14 }]), 0);
    assert.equal(polygonFlaecheQm([{ lat: 48, lon: 14 }, { lat: 48.001, lon: 14 }]), 0);
    assert.equal(polygonFlaecheQm(null), 0);
    assert.equal(polygonFlaecheQm([{ lat: "x", lon: 14 }, { lat: 48, lon: 14 }, { lat: 48, lon: 14.1 }]), 0);
  });

  test("Umfang, Mitte und Distanz", () => {
    const a = { lat: 47.5, lon: 12.5 };
    const b = verschieben(a, 120, 0);
    const c = verschieben(a, 120, 60);
    const d = verschieben(a, 0, 60);
    nahe(polygonUmfangM([a, b, c, d]), 360, 0.001, "Umfang 120×60");
    nahe(distanzM(a, b), 120, 0.001, "Distanz 120 m Ost");
    nahe(distanzM(a, d), 60, 0.001, "Distanz 60 m Nord");
    const m = polygonMitte([a, b, c, d]);
    nahe(m.lat, (a.lat + c.lat) / 2, 1e-9, "Mitte lat");
    nahe(m.lon, (a.lon + c.lon) / 2, 1e-9, "Mitte lon");
    assert.equal(polygonMitte([]), null);
  });
});

describe("Nutzfläche, Leistung, Ortswahl, Übergabe", () => {
  test("Abzüge: Standard 10 % Rand, dann 15 % Hindernisse auf den Rest", () => {
    const n = nutzflaeche(10000);
    assert.equal(n.brutto, 10000);
    assert.equal(n.rand, 1000);
    assert.equal(n.hindernisse, 1350);
    assert.equal(n.netto, 7650);
    assert.equal(DACH_ABZUEGE.rand.standard, 10);
    assert.equal(DACH_ABZUEGE.hindernisse.standard, 15);
    // Grenzen
    assert.equal(nutzflaeche(1000, { randPct: 200, hindernisPct: -5 }).netto, 0);
    assert.equal(nutzflaeche(-5).netto, 0);
    assert.equal(nutzflaeche(1000, { randPct: 0, hindernisPct: 0 }).netto, 1000);
  });

  test("7 m² je kWp als Standard (Ost-West aufgeständert), andere Dacharten einstellbar", () => {
    assert.equal(QM_PRO_KWP_STANDARD, 7);
    assert.equal(kwpAusNutzflaeche(7000), 1000);
    assert.equal(kwpAusNutzflaeche(7000, 10), 700);
    assert.equal(kwpAusNutzflaeche(7000, 5), 1400);
    assert.equal(kwpAusNutzflaeche(7000, 0), 0);
    assert.equal(kwpAusNutzflaeche(-1), 0);
  });

  test("Rechteck ohne Karte", () => {
    assert.equal(rechteckFlaecheQm(120, 60), 7200);
    assert.equal(rechteckFlaecheQm("120", "60"), 7200);
    assert.equal(rechteckFlaecheQm(0, 60), 0);
    assert.equal(rechteckFlaecheQm(-1, 60), 0);
    assert.equal(rechteckFlaecheQm("abc", 60), 0);
  });

  test("nächster Ort zur Dachmitte", () => {
    const orte = [
      { slug: "linz", lat: 48.3069, lon: 14.2858 },
      { slug: "wien", lat: 48.2082, lon: 16.3738 },
      { slug: "salzburg", lat: 47.8095, lon: 13.055 },
    ];
    assert.equal(naechsterOrt({ lat: 48.25, lon: 14.4 }, orte).slug, "linz");
    assert.equal(naechsterOrt({ lat: 48.0, lon: 13.0 }, orte).slug, "salzburg");
    assert.equal(naechsterOrt({ lat: 48.0, lon: 13.0 }, []), null);
    assert.ok(naechsterOrt({ lat: 48.3069, lon: 14.2858 }, orte).distanzKm === 0);
  });

  test("Übergabe-Query für den Gewerbe-PV-Rechner (Vertrag mit B03)", () => {
    assert.equal(uebergabeQuery({ flaecheQm: 7654, dachart: "ost-west", ort: "linz" }), "flaeche=7650&dachart=ost-west&ort=linz");
    assert.equal(uebergabeQuery({ flaecheQm: 12 }), "flaeche=100&dachart=ost-west"); // Untergrenze des Rechners
    assert.equal(uebergabeQuery({ flaecheQm: 99999, dachart: "sued" }), "flaeche=50000&dachart=sued");
    assert.equal(uebergabeQuery({ flaecheQm: 0, dachart: "" }), "");
  });
});
