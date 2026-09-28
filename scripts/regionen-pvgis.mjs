// Erzeugt src/data/regionen-pvgis.json: standortgenaue Solarerträge je Ort aus PVGIS
// (Photovoltaic Geographical Information System der Europäischen Kommission, JRC),
// inkl. Geländehorizont (Berge/Täler), plus Luftlinie und Straßenroute ab Firmensitz Ostermiething.
//
// Aufruf: node scripts/regionen-pvgis.mjs
// Quellen:
//   PVGIS  https://re.jrc.ec.europa.eu/pvg_tools/de/ (API v5.3, Datenbank PVGIS-SARAH3, 2005–2023)
//          Die ältere API v5_2 (SARAH2, bis 2020) liefert ebenfalls Werte; v5_3 ist der aktuelle Stand
//          und deckt Österreich vollständig ab. Version über PVGIS_API umstellbar.
//   Route  OSRM-Demoserver (router.project-osrm.org) auf OpenStreetMap-Daten, schnellste Pkw-Route
//          ohne Verkehr – nur als Orientierung für die Anfahrt.
//
// Neuer Ort: Koordinaten (Ortszentrum) unten ergänzen, Skript ausführen, Ortsdatei in
// src/data/regionen/ anlegen und in src/data/regionen/index.js eintragen.

import fs from "node:fs";

const PVGIS_API = "v5_3";

// Firmensitz Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething (OpenStreetMap)
const FIRMENSITZ = [48.0428, 12.8417];

// Ortszentrum (Hauptplatz/Rathaus, OpenStreetMap-Nominatim, gerundet)
export const ORTE = {
  ostermiething: [48.0428, 12.8417],
  // Oberösterreich
  linz: [48.3058, 14.2865],
  wels: [48.157, 14.0252],
  steyr: [48.0382, 14.4185],
  braunau: [48.2577, 13.0352],
  "ried-im-innkreis": [48.2099, 13.4883],
  voecklabruck: [48.0079, 13.6542],
  gmunden: [47.9181, 13.7999],
  // Salzburg
  salzburg: [47.7985, 13.0462],
  hallein: [47.6822, 13.095],
  bischofshofen: [47.4172, 13.2194],
  "zell-am-see": [47.3234, 12.7982],
  // Tirol
  innsbruck: [47.2639, 11.3948],
  kufstein: [47.583, 12.1708],
  woergl: [47.4873, 12.0638],
  kitzbuehel: [47.4472, 12.3906],
  lienz: [46.8293, 12.7688],
  // Vorarlberg
  bregenz: [47.5046, 9.7463],
  dornbirn: [47.4137, 9.7437],
  feldkirch: [47.2378, 9.5985],
  // Kärnten
  klagenfurt: [46.6241, 14.3069],
  villach: [46.614, 13.8466],
  wolfsberg: [46.8391, 14.8452],
  // Steiermark
  graz: [47.0712, 15.438],
  leoben: [47.3805, 15.0947],
  kapfenberg: [47.4405, 15.2902],
  weiz: [47.2173, 15.6222],
  hartberg: [47.2809, 15.9693],
  // Burgenland
  eisenstadt: [47.8468, 16.5256],
  "neusiedl-am-see": [47.9493, 16.8415],
  // Wien
  wien: [48.2085, 16.372],
  // Niederösterreich
  "st-poelten": [48.2051, 15.6232],
  "wiener-neustadt": [47.8132, 16.2444],
  amstetten: [48.1236, 14.871],
  krems: [48.4096, 15.596],
  tulln: [48.3309, 16.0509],
  moedling: [48.0855, 16.2833],
};

export function luftlinieKm([lat1, lon1], [lat2, lon2]) {
  const r = (x) => (x * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

const warte = (ms) => new Promise((ok) => setTimeout(ok, ms));

async function holeJson(url) {
  for (let versuch = 0; versuch < 4; versuch++) {
    const r = await fetch(url, { headers: { "User-Agent": "oekovolt.com Regionalseiten (office@oekovolt.com)" } });
    if (r.ok) return r.json();
    await warte(1500 * (versuch + 1));
  }
  throw new Error(`Abruf fehlgeschlagen: ${url}`);
}

const pvgis = (lat, lon, angle, aspect) =>
  holeJson(`https://re.jrc.ec.europa.eu/api/${PVGIS_API}/PVcalc?lat=${lat}&lon=${lon}&peakpower=1&loss=14&angle=${angle}&aspect=${aspect}&usehorizon=1&outputformat=json`);

async function route([lat, lon]) {
  if (lat === FIRMENSITZ[0] && lon === FIRMENSITZ[1]) return { km: 0, min: 0 };
  try {
    const d = await holeJson(`https://router.project-osrm.org/route/v1/driving/${FIRMENSITZ[1]},${FIRMENSITZ[0]};${lon},${lat}?overview=false`);
    const r = d.routes?.[0];
    return r ? { km: Math.round(r.distance / 1000), min: Math.round(r.duration / 60 / 5) * 5 } : { km: null, min: null };
  } catch {
    return { km: null, min: null };
  }
}

const ergebnis = {
  quelle: "PVGIS v5.3 (EU JRC), Datenbank SARAH3 (2005–2023), 14 % Systemverluste, mit Geländehorizont",
  route_quelle: "OSRM auf OpenStreetMap-Daten, schnellste Pkw-Route ohne Verkehr",
  abgerufen: new Date().toISOString().slice(0, 10),
  firmensitz: { name: "Ostermiething", lat: FIRMENSITZ[0], lon: FIRMENSITZ[1] },
  orte: {},
};

for (const [slug, [lat, lon]] of Object.entries(ORTE)) {
  const sued = await pvgis(lat, lon, 35, 0);
  const ost = await pvgis(lat, lon, 15, -90);
  const west = await pvgis(lat, lon, 15, 90);
  const flach = await pvgis(lat, lon, 10, 0);
  const weg = await route([lat, lon]);
  ergebnis.orte[slug] = {
    lat,
    lon,
    hoehe_m: Math.round(sued.inputs.location.elevation),
    luftlinie_km: Math.round(luftlinieKm(FIRMENSITZ, [lat, lon])),
    strasse_km: weg.km,
    fahrzeit_min: weg.min,
    sued35_kwh_kwp: Math.round(sued.outputs.totals.fixed.E_y),
    ostwest15_kwh_kwp: Math.round((ost.outputs.totals.fixed.E_y + west.outputs.totals.fixed.E_y) / 2),
    flach10_kwh_kwp: Math.round(flach.outputs.totals.fixed.E_y),
    einstrahlung_kwh_m2: Math.round(sued.outputs.totals.fixed["H(i)_y"]),
    monate_sued35: sued.outputs.monthly.fixed.map((m) => Math.round(m.E_m)),
    schwankung_jahr_kwh: Math.round(sued.outputs.totals.fixed.SD_y),
  };
  console.log(slug, ergebnis.orte[slug].sued35_kwh_kwp, `${ergebnis.orte[slug].luftlinie_km} km Luftlinie`, `${weg.km} km Straße`);
  await warte(300);
}

fs.writeFileSync(new URL("../src/data/regionen-pvgis.json", import.meta.url), JSON.stringify(ergebnis, null, 1) + "\n");
