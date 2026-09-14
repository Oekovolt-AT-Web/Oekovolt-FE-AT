// Erzeugt src/data/regionen-pvgis.json: standortgenaue Solarerträge je Stadt aus PVGIS
// (Photovoltaic Geographical Information System der Europäischen Kommission, JRC),
// inkl. Geländehorizont (Berge/Täler), plus Luftlinie ab Türkheim.
//
// Aufruf: node scripts/regionen-pvgis.mjs
// Quelle: https://re.jrc.ec.europa.eu/pvg_tools/de/ (API v5.3, Datenbank PVGIS-SARAH3)

import fs from "node:fs";

const TUERKHEIM = { lat: 48.064, lon: 10.641 };

// Stadtmitte (Rathaus/Marktplatz, gerundet)
export const ORTE = {
  tuerkheim: [48.064, 10.641],
  memmingen: [47.9867, 10.1806],
  augsburg: [48.3705, 10.8978],
  kempten: [47.7267, 10.3139],
  ulm: [48.3984, 9.9916],
  muenchen: [48.1374, 11.5755],
  "garmisch-partenkirchen": [47.4921, 11.0958],
  ingolstadt: [48.7665, 11.4258],
  friedrichshafen: [47.65, 9.48],
  rosenheim: [47.8561, 12.1289],
  konstanz: [47.6603, 9.1758],
  landshut: [48.5372, 12.1522],
  stuttgart: [48.7758, 9.1829],
  regensburg: [49.0134, 12.1016],
  nuernberg: [49.4521, 11.0767],
  heilbronn: [49.1427, 9.2109],
  fuerth: [49.4771, 10.9887],
  erlangen: [49.5897, 11.012],
  karlsruhe: [49.0069, 8.4037],
  wuerzburg: [49.7913, 9.9534],
  heidelberg: [49.3988, 8.6724],
  freiburg: [47.999, 7.8421],
  passau: [48.5667, 13.4319],
  mannheim: [49.4875, 8.466],
  frankfurt: [50.1109, 8.6821],
};

export function luftlinieKm([lat1, lon1], [lat2, lon2]) {
  const r = (x) => (x * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

async function pvgis(lat, lon, angle, aspect) {
  const url = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&angle=${angle}&aspect=${aspect}&usehorizon=1&outputformat=json`;
  for (let versuch = 0; versuch < 4; versuch++) {
    const r = await fetch(url);
    if (r.ok) return r.json();
    await new Promise((ok) => setTimeout(ok, 1500 * (versuch + 1)));
  }
  throw new Error(`PVGIS ${lat},${lon} fehlgeschlagen`);
}

const ergebnis = { quelle: "PVGIS v5.3 (EU JRC), Datenbank SARAH3, 14 % Systemverluste, mit Geländehorizont", abgerufen: new Date().toISOString().slice(0, 10), orte: {} };

for (const [slug, [lat, lon]] of Object.entries(ORTE)) {
  const sued = await pvgis(lat, lon, 35, 0);
  const ost = await pvgis(lat, lon, 15, -90);
  const west = await pvgis(lat, lon, 15, 90);
  const flach = await pvgis(lat, lon, 10, 0);
  ergebnis.orte[slug] = {
    lat,
    lon,
    hoehe_m: sued.inputs.location.elevation,
    luftlinie_km: Math.round(luftlinieKm([TUERKHEIM.lat, TUERKHEIM.lon], [lat, lon])),
    sued35_kwh_kwp: Math.round(sued.outputs.totals.fixed.E_y),
    ostwest15_kwh_kwp: Math.round((ost.outputs.totals.fixed.E_y + west.outputs.totals.fixed.E_y) / 2),
    flach10_kwh_kwp: Math.round(flach.outputs.totals.fixed.E_y),
    einstrahlung_kwh_m2: Math.round(sued.outputs.totals.fixed["H(i)_y"]),
    monate_sued35: sued.outputs.monthly.fixed.map((m) => Math.round(m.E_m)),
    schwankung_jahr_kwh: Math.round(sued.outputs.totals.fixed.SD_y),
  };
  console.log(slug, ergebnis.orte[slug].sued35_kwh_kwp, ergebnis.orte[slug].luftlinie_km + " km");
}

fs.writeFileSync(new URL("../src/data/regionen-pvgis.json", import.meta.url), JSON.stringify(ergebnis, null, 1) + "\n");
