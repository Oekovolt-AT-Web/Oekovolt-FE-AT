// Regionalseiten /photovoltaik/[stadt]: redaktionelle Texte + recherchierte Fakten + PVGIS.

import pvgis from "@/data/regionen-pvgis.json";
import { REGIONEN } from "@/data/regionen";
import { normalisiereProjekt } from "@/components/Project/projektDaten";

export const TUERKHEIM = [48.064, 10.641];

// Koordinaten der Orte, an denen es Referenzprojekte gibt (Ortsmitte, gerundet)
const REFERENZ_ORTE = {
  "Türkheim": [48.064, 10.641],
  "Bad Wörishofen": [48.0067, 10.5972],
  "Buchloe": [48.0353, 10.7256],
  "Mindelheim": [48.0478, 10.4922],
  "Betzigau": [47.7322, 10.3831],
  "Mering": [48.2656, 10.9844],
  "Freilassing": [47.8406, 12.9811],
  "Ravensburg": [47.7818, 9.6122],
  "Salzburg": [47.8095, 13.055],
};

export function luftlinieKm([lat1, lon1], [lat2, lon2]) {
  const r = (x) => (x * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

export const ZONEN = {
  1: { label: "Regionales Einzugsgebiet", kurz: "bis 100 km" },
  2: { label: "Erweitertes Einzugsgebiet", kurz: "100 bis 200 km" },
  3: { label: "Überregional", kurz: "200 bis 300 km" },
};

export const zoneVon = (km) => (km <= 100 ? 1 : km <= 200 ? 2 : 3);

export function alleRegionen() {
  return Object.keys(REGIONEN)
    .map((slug) => regionFuer(slug))
    .filter(Boolean)
    .sort((a, b) => a.km - b.km);
}

export function regionFuer(slug) {
  const r = REGIONEN[slug];
  const p = pvgis.orte[slug];
  if (!r || !p) return null;
  const km = p.luftlinie_km;
  return { slug, ...r, fakten: r.fakten || {}, pvgis: p, km, zone: zoneVon(km), koord: [p.lat, p.lon] };
}

export const pvgisReferenz = () => pvgis.orte.tuerkheim;
export const pvgisQuelle = () => ({ quelle: pvgis.quelle, abgerufen: pvgis.abgerufen });

/** Nächstgelegene Städte (für interne Verlinkung) */
export function nachbarn(region, n = 4) {
  return alleRegionen()
    .filter((r) => r.slug !== region.slug)
    .map((r) => ({ ...r, abstand: Math.round(luftlinieKm(region.koord, r.koord)) }))
    .sort((a, b) => a.abstand - b.abstand)
    .slice(0, n);
}

/**
 * Echte Referenzprojekte nach Entfernung – es wird nichts erfunden: nur Projekte aus dem
 * Backoffice, deren Ort in REFERENZ_ORTE hinterlegt ist. Je Ort das größte Projekt.
 */
export function naechsteReferenzen(region, rohProjekte, n = 3) {
  const jeOrt = new Map();
  for (const roh of rohProjekte) {
    const p = normalisiereProjekt(roh);
    const koord = REFERENZ_ORTE[p.ort];
    if (!koord) continue;
    const alt = jeOrt.get(p.ort);
    if (!alt || (p.kwp || 0) > (alt.kwp || 0)) jeOrt.set(p.ort, { ...p, abstand: Math.round(luftlinieKm(region.koord, koord)) });
  }
  return [...jeOrt.values()].sort((a, b) => a.abstand - b.abstand).slice(0, n);
}
