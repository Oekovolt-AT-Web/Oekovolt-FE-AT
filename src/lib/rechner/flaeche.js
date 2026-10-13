// src/lib/rechner/flaeche.js – Geodätische Flächenberechnung für den Hallendach-Planer (Welle B, B05)
//
// Reine Funktionen ohne Abhängigkeiten (testbar mit node scripts/flaeche-polygon.test.mjs).
//
// Fläche eines Polygons aus WGS84-Koordinaten (lat/lon in Grad):
//   Sphärische Polygonformel nach Chamberlain & Duquette (NASA JPL 2007, „Some algorithms
//   for polygons on a sphere“): A = R²/2 · |Σ (λ₂ − λ₁) · (2 + sin φ₁ + sin φ₂)|.
//   Statt eines mittleren Erdradius setzen wir den Gauß'schen Krümmungsradius R = √(M·N) des
//   WGS84-Ellipsoids auf der mittleren Breite des Polygons an. Damit liegt die Abweichung zur
//   strengen Ellipsoidfläche für Dächer (bis einige Hektar) weit unter 0,1 % – die Sphäre mit
//   Mittelradius 6.371 km läge in Österreich (φ ≈ 47–49°) rund 0,3 % daneben.
//   Quelle Ellipsoid: WGS84 (NIMA TR8350.2): a = 6.378.137 m, f = 1/298,257223563.
//
// Alle Flächenangaben sind Richtwerte/Orientierung: Das Orthofoto zeigt die Dachfläche in der
// Projektion von oben; geneigte Dächer sind real um 1/cos(Neigung) größer (10° → +1,5 %,
// 25° → +10 %). Für Flachdächer und flach geneigte Hallendächer ist die Grundrissfläche maßgeblich.

export const WGS84 = { a: 6378137, f: 1 / 298.257223563 };
WGS84.b = WGS84.a * (1 - WGS84.f);
WGS84.e2 = 2 * WGS84.f - WGS84.f * WGS84.f;

const rad = (grad) => (grad * Math.PI) / 180;

/** Gauß'scher Krümmungsradius √(M·N) des WGS84-Ellipsoids auf Breite φ (Grad), in Metern. */
export function kruemmungsradius(latGrad) {
  const s = Math.sin(rad(latGrad));
  const w2 = 1 - WGS84.e2 * s * s;
  const N = WGS84.a / Math.sqrt(w2); // Querkrümmungsradius
  const M = (WGS84.a * (1 - WGS84.e2)) / Math.pow(w2, 1.5); // Meridiankrümmungsradius
  return Math.sqrt(M * N);
}

/** Eingabe normalisieren: akzeptiert {lat, lon}, {lat, lng} oder [lat, lon]. */
export function punktNormieren(p) {
  if (Array.isArray(p)) return { lat: Number(p[0]), lon: Number(p[1]) };
  if (p && typeof p === "object") return { lat: Number(p.lat), lon: Number(p.lon ?? p.lng) };
  return { lat: NaN, lon: NaN };
}

function gueltigePunkte(punkte) {
  const liste = (Array.isArray(punkte) ? punkte : []).map(punktNormieren).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon));
  // doppelten Schlusspunkt (geschlossener Ring) entfernen
  if (liste.length > 1) {
    const a = liste[0];
    const z = liste[liste.length - 1];
    if (a.lat === z.lat && a.lon === z.lon) liste.pop();
  }
  return liste;
}

/**
 * Fläche eines Polygons in m² (geodätisch, sphärische Polygonformel auf lokalem Krümmungsradius).
 * Die Reihenfolge der Punkte (Uhrzeigersinn oder gegen) spielt keine Rolle; bei weniger als drei
 * Punkten ist die Fläche 0. Sich selbst schneidende Polygone liefern die Differenzfläche.
 */
export function polygonFlaecheQm(punkte) {
  const pts = gueltigePunkte(punkte);
  const n = pts.length;
  if (n < 3) return 0;
  const mittelLat = pts.reduce((s, p) => s + p.lat, 0) / n;
  const R = kruemmungsradius(mittelLat);
  let summe = 0;
  for (let i = 0; i < n; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    summe += (rad(p2.lon) - rad(p1.lon)) * (2 + Math.sin(rad(p1.lat)) + Math.sin(rad(p2.lat)));
  }
  return Math.abs((summe * R * R) / 2);
}

/** Meridian- (M) und Querkrümmungsradius (N) des WGS84-Ellipsoids auf Breite φ (Grad). */
function radien(latGrad) {
  const s = Math.sin(rad(latGrad));
  const w2 = 1 - WGS84.e2 * s * s;
  return { N: WGS84.a / Math.sqrt(w2), M: (WGS84.a * (1 - WGS84.e2)) / Math.pow(w2, 1.5) };
}

/**
 * Entfernung zweier Punkte in Metern: lokale Ellipsoid-Näherung auf der mittleren Breite
 * (Nord-Süd über M, Ost-West über N·cos φ). Für Dachmaße praktisch exakt, bei einigen hundert
 * Kilometern (Ortszuordnung) unter 0,1 % – mehr braucht der Planer nicht.
 */
export function distanzM(a, b) {
  const p = punktNormieren(a);
  const q = punktNormieren(b);
  const mittel = (p.lat + q.lat) / 2;
  const { M, N } = radien(mittel);
  const dy = M * rad(q.lat - p.lat);
  const dx = N * Math.cos(rad(mittel)) * rad(q.lon - p.lon);
  return Math.sqrt(dx * dx + dy * dy);
}

/** Umfang eines Polygons in Metern. */
export function polygonUmfangM(punkte) {
  const pts = gueltigePunkte(punkte);
  if (pts.length < 2) return 0;
  let u = 0;
  for (let i = 0; i < pts.length; i++) u += distanzM(pts[i], pts[(i + 1) % pts.length]);
  return u;
}

/** Schwerpunkt (Mittel der Eckpunkte) – reicht für Ortszuordnung und Kartenzentrierung. */
export function polygonMitte(punkte) {
  const pts = gueltigePunkte(punkte);
  if (!pts.length) return null;
  return { lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length, lon: pts.reduce((s, p) => s + p.lon, 0) / pts.length };
}

/**
 * Punkt um dx (Ost, m) und dy (Nord, m) verschieben – für Tastatureingabe und Tests.
 * Kleine Verschiebungen (Dachmaßstab) auf dem lokalen Ellipsoid, Fehler vernachlässigbar.
 */
export function verschieben(p, dxOst, dyNord) {
  const q = punktNormieren(p);
  const { M, N } = radien(q.lat);
  return {
    lat: q.lat + (dyNord / M) * (180 / Math.PI),
    lon: q.lon + (dxOst / (N * Math.cos(rad(q.lat)))) * (180 / Math.PI),
  };
}

/** Nächstgelegener Ort aus einer Liste [{ slug, lat, lon, … }] zu einem Punkt; null bei leerer Liste. */
export function naechsterOrt(punkt, orte) {
  const p = punktNormieren(punkt);
  if (!Number.isFinite(p.lat) || !Array.isArray(orte) || !orte.length) return null;
  let bester = null;
  let best = Infinity;
  for (const o of orte) {
    const d = distanzM(p, o);
    if (d < best) {
      best = d;
      bester = o;
    }
  }
  return bester ? { ...bester, distanzKm: Math.round(best / 100) / 10 } : null;
}

/* ------------------------------------------------------------------ Nutzfläche und Leistung */

// Abzüge vom Bruttodach – Richtwerte/Orientierung (Annahme Ökovolt Österreich, Stand 10/2026),
// im Planer per Regler einstellbar und offengelegt:
//  - Rand: Randstreifen für Brandschutz/Wartung (OVE R 11-1: Abstände zu Dachrand, Brandwänden,
//    Lichtkuppeln – projektabhängig) und Attika-Verschattung → Standard 10 % der Bruttofläche
//  - Hindernisse: Lichtkuppeln, RWA, Lüftungsgeräte, Kamine, Wartungswege → Standard 15 %
export const DACH_ABZUEGE = {
  rand: { standard: 10, min: 0, max: 30 },
  hindernisse: { standard: 15, min: 0, max: 50 },
  stand: "2026-10",
};

/** Standard-Flächenbedarf: 7 m² je kWp für aufgeständerte Ost-West-Anlagen auf dem Flachdach. */
export const QM_PRO_KWP_STANDARD = 7;

/**
 * Nutzbare Modulfläche aus Bruttofläche und prozentualen Abzügen.
 * @returns {{ brutto, rand, hindernisse, netto }} alle in m²
 */
export function nutzflaeche(bruttoQm, { randPct = DACH_ABZUEGE.rand.standard, hindernisPct = DACH_ABZUEGE.hindernisse.standard } = {}) {
  const brutto = Math.max(0, Number(bruttoQm) || 0);
  const rand = (brutto * Math.min(100, Math.max(0, randPct))) / 100;
  const hindernisse = ((brutto - rand) * Math.min(100, Math.max(0, hindernisPct))) / 100;
  return { brutto, rand, hindernisse, netto: Math.max(0, brutto - rand - hindernisse) };
}

/** Anlagenleistung in kWp aus der Nutzfläche (Standard 7 m²/kWp, Ost-West aufgeständert). */
export function kwpAusNutzflaeche(nettoQm, qmProKwp = QM_PRO_KWP_STANDARD) {
  const f = Number(qmProKwp);
  if (!(f > 0)) return 0;
  return Math.max(0, Number(nettoQm) || 0) / f;
}

/** Rechteck-Alternative ohne Karte: Länge × Breite in Metern. */
export function rechteckFlaecheQm(laengeM, breiteM) {
  const l = Number(laengeM);
  const b = Number(breiteM);
  if (!(l > 0) || !(b > 0)) return 0;
  return l * b;
}

/** Parameter für die Übergabe an den Gewerbe-PV-Rechner (Vertrag mit B03): ?flaeche=…&dachart=…&ort=… */
export function uebergabeQuery({ flaecheQm, dachart = "ost-west", ort }) {
  const q = new URLSearchParams();
  const f = Math.round(Number(flaecheQm) || 0);
  if (f > 0) q.set("flaeche", String(Math.min(50000, Math.max(100, Math.round(f / 10) * 10))));
  if (dachart) q.set("dachart", String(dachart));
  if (ort) q.set("ort", String(ort));
  return q.toString();
}
