// Referenzstandorte für die Karte.
// Übernommen aus der bisherigen Karte (map.js). Zwei offensichtliche Geokodierfehler
// sind korrigiert und im Abschlussbericht dokumentiert:
//  - doppelter Eintrag „Türkenfeld" bei 47.49 / 9.69 liegt in Vorarlberg (Hörbranz) -> Label „Vorarlberg"
//  - „Innsbruck" lag bei 47.10 / 9.49 (Rheintal) -> Koordinaten von Innsbruck

export const FIRMENSITZ = { id: "tuerkheim", label: "Türkheim", lat: 48.0636, lng: 10.6395, land: "Deutschland", sitz: true };

const ROH = [
  { lat: 47.7811014, lng: 9.612468, label: "Ravensburg" },
  { lat: 47.7981346, lng: 13.0464806, label: "Salzburg", land: "Österreich" },
  { lat: 48.2678312, lng: 10.9868769, label: "Mering" },
  { lat: 48.0059852, lng: 10.5921263, label: "Bad Wörishofen" },
  { lat: 48.18524105, lng: 11.745541131739072, label: "Kirchheim" },
  { lat: 48.05630415, lng: 10.486669997131546, label: "Mindelheim" },
  { lat: 47.9875742, lng: 10.788535174270507, label: "Waal" },
  { lat: 48.3930137, lng: 10.856960528294799, label: "Augsburg" },
  { lat: 47.7828004, lng: 10.30596510988958, label: "Kempten" },
  { lat: 47.84388455, lng: 12.972250979244642, label: "Freilassing" },
  { lat: 47.57286685, lng: 9.686940863251925, label: "Lindau" },
  { lat: 47.927908200000005, lng: 12.898727934563036, label: "Laufen" },
  { lat: 50.18291155, lng: 9.048353069014173, label: "Langenselbold" },
  { lat: 47.54312925, lng: 11.273540406576913, label: "Wallgau" },
  { lat: 47.8979258, lng: 10.25525499438394, label: "Wolfertschwenden" },
  { lat: 48.0152801, lng: 11.083114541380102, label: "Utting" },
  { lat: 48.0301967, lng: 10.75377698202896, label: "Buchloe" },
  { lat: 48.1095402, lng: 11.093368268721145, label: "Türkenfeld" },
  { lat: 47.49489385, lng: 9.6919699, label: "Vorarlberg", land: "Österreich" },
  { lat: 47.520760499999994, lng: 9.768744127661652, label: "Lochau", land: "Österreich" },
  { lat: 47.426632749999996, lng: 9.671584195801643, label: "Lustenau", land: "Österreich" },
  { lat: 47.2692, lng: 11.4041, label: "Innsbruck", land: "Österreich" },
];

/** Luftlinie in km (Haversine) */
export function entfernungKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const STANDORTE = ROH.map((s, i) => ({
  id: `s${i}`,
  land: "Deutschland",
  ...s,
  km: Math.round(entfernungKm(FIRMENSITZ, s)),
})).sort((a, b) => a.km - b.km);
