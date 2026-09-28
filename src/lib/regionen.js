// Regionalseiten /photovoltaik/[stadt]: redaktionelle Texte + recherchierte Fakten + PVGIS.

import pvgis from "@/data/regionen-pvgis.json";
import { REGIONEN } from "@/data/regionen";
import { LAENDER, LAENDER_REIHENFOLGE, foerderLink } from "@/data/regionen/laender";
import { bekannteKoordinaten } from "@/components/Referenzkarte/standorte";

/** Firmensitz Ostermiething (Gewerbegebiet 10) – Bezugspunkt für Entfernungen */
export const FIRMENSITZ_KOORD = [pvgis.firmensitz.lat, pvgis.firmensitz.lon];
export const HEIMAT_SLUG = "ostermiething";

export function luftlinieKm([lat1, lon1], [lat2, lon2]) {
  const r = (x) => (x * Math.PI) / 180;
  const a = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

export const ZONEN = {
  1: { label: "Heimatregion", kurz: "bis 80 km ab Ostermiething" },
  2: { label: "Erweitertes Einsatzgebiet", kurz: "80 bis 200 km" },
  3: { label: "Überregionale Projekte", kurz: "über 200 km" },
};

export const zoneVon = (km) => (km <= 80 ? 1 : km <= 200 ? 2 : 3);

// Titel ≤ 60 Zeichen: längste Variante, die passt
function seoTitel(name, kurzname) {
  const varianten = [
    `Photovoltaik ${name}: PV für Gewerbe & Industrie | Ökovolt`,
    `Photovoltaik ${kurzname || name}: PV für Gewerbe & Industrie | Ökovolt`,
    `Photovoltaik ${kurzname || name}: PV für Gewerbe | Ökovolt`,
    `Photovoltaik ${kurzname || name} | Ökovolt`,
  ];
  return varianten.find((t) => t.length <= 60) || varianten[varianten.length - 1];
}

const de = (n) => Number(n).toLocaleString("de-DE");

/** Ertrags-FAQ aus den PVGIS-Daten – sichtbar und im Schema identisch */
function ertragsFrage(name, p) {
  const winter = [0, 1, 10, 11].reduce((s, i) => s + p.monate_sued35[i], 0);
  const gerundet = (kwh) => de(Math.round((kwh * 100) / 1000) * 1000);
  return {
    q: `Wie viel Strom erzeugt eine PV-Anlage in ${name}?`,
    a: `Laut PVGIS-Simulation der EU-Kommission (JRC) erzeugt 1 kWp in ${name} auf einem Süddach mit 35° Neigung rund ${de(p.sued35_kwh_kwp)} kWh im Jahr, in Ost-West-Aufstellung mit 15° rund ${de(p.ostwest15_kwh_kwp)} kWh. Eine Gewerbeanlage mit 100 kWp kommt damit rechnerisch auf etwa ${gerundet(p.sued35_kwh_kwp)} kWh (Süd) bzw. ${gerundet(p.ostwest15_kwh_kwp)} kWh (Ost-West). Auf die Monate November bis Februar entfallen rund ${de(Math.round((winter / p.sued35_kwh_kwp) * 100))} % des Jahresertrags.`,
  };
}

export function regionFuer(slug) {
  const r = REGIONEN[slug];
  const p = pvgis.orte[slug];
  if (!r || !p) return null;
  const km = p.luftlinie_km;
  return {
    slug,
    ...r,
    seoTitel: r.seoTitel || seoTitel(r.name, r.kurzname),
    faq: [...r.faq, ertragsFrage(r.kurzname || r.name, p)],
    fakten: r.fakten || {},
    landDaten: LAENDER[r.land] || null,
    foerderHref: foerderLink(r.land),
    heimat: slug === HEIMAT_SLUG,
    pvgis: p,
    km,
    zone: zoneVon(km),
    koord: [p.lat, p.lon],
  };
}

export function alleRegionen() {
  return Object.keys(REGIONEN)
    .map((slug) => regionFuer(slug))
    .filter(Boolean)
    .sort((a, b) => a.km - b.km);
}

/** Orte gruppiert nach Bundesland (Reihenfolge LAENDER_REIHENFOLGE), innerhalb nach Entfernung */
export function regionenNachLand() {
  const alle = alleRegionen();
  return LAENDER_REIHENFOLGE.map((land) => ({
    land,
    name: LAENDER[land].name,
    foerderHref: foerderLink(land),
    hauptstadt: regionFuer(LAENDER[land].hauptstadt),
    orte: alle.filter((r) => r.land === land),
  })).filter((g) => g.orte.length > 0);
}

export const pvgisReferenz = () => pvgis.orte[HEIMAT_SLUG];
export const pvgisQuelle = () => ({ quelle: pvgis.quelle, routeQuelle: pvgis.route_quelle, abgerufen: pvgis.abgerufen });

/** Nächstgelegene Orte (für interne Verlinkung) */
export function nachbarn(region, n = 4) {
  return alleRegionen()
    .filter((r) => r.slug !== region.slug)
    .map((r) => ({ ...r, abstand: Math.round(luftlinieKm(region.koord, r.koord)) }))
    .sort((a, b) => a.abstand - b.abstand)
    .slice(0, n);
}

/** Koordinaten eines Projektorts: zuerst Orte der Regionalseiten, dann bekannte Kartenorte */
function koordinatenVon(ort) {
  const name = String(ort || "").trim().toLowerCase();
  if (!name) return null;
  for (const [slug, r] of Object.entries(REGIONEN)) {
    const p = pvgis.orte[slug];
    if (p && [r.name, r.kurzname].filter(Boolean).some((n) => n.toLowerCase() === name)) return [p.lat, p.lon];
  }
  const k = bekannteKoordinaten(ort);
  return k ? [k.lat, k.lng] : null;
}

/**
 * Echte Referenzprojekte nach Entfernung – es wird nichts erfunden: nur Projekte aus dem
 * Backoffice, deren Ort sich einer Koordinate zuordnen lässt. Je Ort das größte Projekt.
 */
export function naechsteReferenzen(region, projekte, n = 3) {
  const jeOrt = new Map();
  for (const p of projekte || []) {
    const koord = koordinatenVon(p.ort);
    if (!koord) continue;
    const alt = jeOrt.get(p.ort);
    if (!alt || (p.kwp || 0) > (alt.kwp || 0)) jeOrt.set(p.ort, { ...p, abstand: Math.round(luftlinieKm(region.koord, koord)) });
  }
  return [...jeOrt.values()].sort((a, b) => a.abstand - b.abstand).slice(0, n);
}
