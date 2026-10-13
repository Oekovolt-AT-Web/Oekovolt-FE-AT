// Referenzstandorte für die Karte (Österreich-Seite).
// Welle A07: Die früher hier geführten deutschen Orte (Ravensburg, Mering, Augsburg, Kempten …)
// sind entfernt – sie stammten aus der Karte der deutschen Schwestergesellschaft. Die Orte der
// echten Projekte kommen aus dem Backoffice (get_projekte/get_referenzkarte); fehlt eine
// Koordinate, sucht src/lib/referenzOrte.js serverseitig bei OpenStreetMap (bevorzugt Österreich).
// Die Einträge unten dienen nur als bekannte Koordinaten (Quelle: OpenStreetMap) für Orte,
// die auf der bisherigen Karte lagen.

// Firmensitz der Ökovolt Solartechnik GmbH, Gewerbegebiet 10, 5121 Ostermiething (Koordinaten: OpenStreetMap)
export const FIRMENSITZ = { id: "ostermiething", label: "Ostermiething", plz: "5121", lat: 48.0428, lng: 12.8417, land: "Österreich", sitz: true };

const ROH = [
  { lat: 47.7981346, lng: 13.0464806, label: "Salzburg", land: "Österreich" },
  // „Vorarlberg“ (ehemals doppelter Eintrag „Türkenfeld“ bei 47.49 / 9.69, liegt bei Hörbranz)
  { lat: 47.49489385, lng: 9.6919699, label: "Vorarlberg", land: "Österreich" },
  { lat: 47.520760499999994, lng: 9.768744127661652, label: "Lochau", land: "Österreich" },
  { lat: 47.426632749999996, lng: 9.671584195801643, label: "Lustenau", land: "Österreich" },
  { lat: 47.2692, lng: 11.4041, label: "Innsbruck", land: "Österreich" },
];

/** Ortsname vereinheitlichen, z. B. „Bergheim Neuburg an der Donau“ → „bergheim neuburg an der donau“ */
const ortSchluessel = (t) => String(t || "").toLowerCase().replace(/\s+/g, " ").trim();

/** Passt der Ort eines Projekts zu einem Kartenort? Gleicher Name oder Name mit Zusatz („Salzburg Stadt“). */
export function ortPasst(projektOrt, label) {
  const p = ortSchluessel(projektOrt);
  const l = ortSchluessel(label);
  return !!p && !!l && (p === l || p.startsWith(`${l} `) || p.startsWith(`${l},`));
}

/** Luftlinie in km (Haversine) */
export function entfernungKm(a, b) {
  const R = 6371;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Bekannte Koordinaten eines Ortsnamens oder null */
export function bekannteKoordinaten(ort) {
  const treffer = ROH.find((s) => ortPasst(ort, s.label));
  return treffer ? { label: treffer.label, lat: treffer.lat, lng: treffer.lng, land: treffer.land || "Österreich", plz: treffer.plz || "" } : null;
}

export const STANDORTE = ROH.map((s, i) => ({
  id: `s${i}`,
  land: "Österreich",
  ...s,
  km: Math.round(entfernungKm(FIRMENSITZ, s)),
})).sort((a, b) => a.km - b.km);
