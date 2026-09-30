// src/lib/schneelast/projektion.js
//
// Browser-taugliche Umrechnung WGS84 ⇄ EPSG:3416 (ETRS89 / Austria Lambert) und Bildpunkt ⇄
// Rasterkoordinate für die Schneelast-Karte auf /schneelast. Reine Funktionen, ohne fs – darf
// in Client-Komponenten verwendet werden (src/lib/standort/schneelastRaster.js liest Dateien
// und ist nur serverseitig nutzbar).
//
// Formeln: Lambert Conformal Conic 2SP auf dem Ellipsoid, EPSG Guidance Note 7-2
// (Methode 9802), vorwärts und rückwärts; Snyder, „Map Projections – A Working Manual“,
// Gl. 15-1 ff. und 7-9 (Iteration der Breite). Parameter EPSG:3416 laut EPSG-Registry.

export const AUSTRIA_LAMBERT = Object.freeze({
  a: 6378137,
  f: 1 / 298.257222101,
  lat1: 49,
  lat2: 46,
  lat0: 47.5,
  lon0: 13 + 1 / 3,
  x0: 400000,
  y0: 400000,
});

const GRAD = Math.PI / 180;

function konstanten({ a, f, lat1, lat2, lat0 }) {
  const e = Math.sqrt(2 * f - f * f);
  const m = (phi) => Math.cos(phi) / Math.sqrt(1 - e * e * Math.sin(phi) ** 2);
  const t = (phi) => {
    const es = e * Math.sin(phi);
    return Math.tan(Math.PI / 4 - phi / 2) / ((1 - es) / (1 + es)) ** (e / 2);
  };
  const p1 = lat1 * GRAD;
  const p2 = lat2 * GRAD;
  const n = (Math.log(m(p1)) - Math.log(m(p2))) / (Math.log(t(p1)) - Math.log(t(p2)));
  const F = m(p1) / (n * t(p1) ** n);
  const rho0 = a * F * t(lat0 * GRAD) ** n;
  return { e, t, n, F, rho0 };
}

/** Liefert { vorwaerts(lat, lon) → {x, y}, rueckwaerts(x, y) → {lat, lon} } für eine LCC-2SP-Projektion. */
export function lcc(parameter = AUSTRIA_LAMBERT) {
  const { a, lon0, x0, y0 } = parameter;
  const { e, t, n, F, rho0 } = konstanten(parameter);

  function vorwaerts(lat, lon) {
    const rho = a * F * t(Number(lat) * GRAD) ** n;
    const theta = n * (Number(lon) - lon0) * GRAD;
    return { x: x0 + rho * Math.sin(theta), y: y0 + rho0 - rho * Math.cos(theta) };
  }

  function rueckwaerts(x, y) {
    const dx = Number(x) - x0;
    const dy = rho0 - (Number(y) - y0);
    const rho = Math.sign(n) * Math.sqrt(dx * dx + dy * dy);
    const tt = (rho / (a * F)) ** (1 / n);
    const theta = Math.atan2(dx, dy);
    let phi = Math.PI / 2 - 2 * Math.atan(tt);
    for (let i = 0; i < 10; i++) {
      const es = e * Math.sin(phi);
      const neu = Math.PI / 2 - 2 * Math.atan(tt * ((1 - es) / (1 + es)) ** (e / 2));
      if (Math.abs(neu - phi) < 1e-12) {
        phi = neu;
        break;
      }
      phi = neu;
    }
    return { lat: phi / GRAD, lon: theta / n / GRAD + lon0 };
  }

  return { vorwaerts, rueckwaerts };
}

const austria = lcc(AUSTRIA_LAMBERT);

/** WGS84 (Grad) → EPSG:3416 (Meter). */
export const nachLambert = (lat, lon) => austria.vorwaerts(lat, lon);
/** EPSG:3416 (Meter) → WGS84 (Grad). */
export const nachWgs84 = (x, y) => austria.rueckwaerts(x, y);

/* ------------------------------------------------------------------ Bild ⇄ Raster */

// Das Kartenbild zeigt jede Rasterzelle als Quadrat, Norden oben. Zelle (spalte, zeile) hat den
// Mittelpunkt x0 + spalte · dx, y0 + zeile · dx; Zeile 0 liegt im Süden (unten im Bild).

/**
 * Relative Bildposition (u, v ∈ [0, 1], v von oben) → EPSG:3416-Koordinate.
 * meta: { nx, ny, x0, y0, dx } aus sk50-at.json.
 */
export function bildZuLambert(meta, u, v) {
  return {
    x: meta.x0 + (u * meta.nx - 0.5) * meta.dx,
    y: meta.y0 + (meta.ny - 0.5 - v * meta.ny) * meta.dx,
  };
}

/** EPSG:3416-Koordinate → relative Bildposition (u, v); außerhalb des Bildes Werte < 0 oder > 1. */
export function lambertZuBild(meta, x, y) {
  return {
    u: ((x - meta.x0) / meta.dx + 0.5) / meta.nx,
    v: (meta.ny - 0.5 - (y - meta.y0) / meta.dx) / meta.ny,
  };
}

/** WGS84 → relative Bildposition. */
export function wgs84ZuBild(meta, lat, lon) {
  const { x, y } = nachLambert(lat, lon);
  return lambertZuBild(meta, x, y);
}

/** Relative Bildposition → WGS84 (auf 5 Stellen gerundet, rund 1 m). */
export function bildZuWgs84(meta, u, v) {
  const { x, y } = bildZuLambert(meta, u, v);
  const { lat, lon } = nachWgs84(x, y);
  return { lat: Math.round(lat * 1e5) / 1e5, lon: Math.round(lon * 1e5) / 1e5 };
}
