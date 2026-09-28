// src/lib/referenzOrte.js
//
// Kartenorte für die Referenzkarte aus den echten Projekten (projekte.get_projekte).
// Die Projekte liefern nur den Ortsnamen („ort“) – die Koordinaten kommen aus
//   1. bekannten Orten (src/components/Referenzkarte/standorte.js) oder
//   2. einer Ortssuche bei OpenStreetMap (Nominatim), serverseitig und 30 Tage zwischengespeichert.
// Nur serverseitig verwenden.

import { bekannteKoordinaten, entfernungKm, ortPasst } from "@/components/Referenzkarte/standorte";

const DREISSIG_TAGE = 30 * 24 * 3600;

/** Ort bei OpenStreetMap suchen – bevorzugt in Österreich (Suchfenster Österreich, Treffer auch in DE/CH möglich). */
async function ortSuchen(ort) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=at,de,ch" +
    `&viewbox=9.5,49.05,17.2,46.35&bounded=0&q=${encodeURIComponent(ort)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "oekovolt.com Referenzkarte (office@oekovolt.com)", "Accept-Language": "de" },
      next: { revalidate: DREISSIG_TAGE },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const [t] = await res.json();
    const lat = Number(t?.lat);
    const lng = Number(t?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    const land = /Österreich/.test(t.display_name || "") ? "Österreich" : /Schweiz/.test(t.display_name || "") ? "Schweiz" : "Deutschland";
    return { label: ort, lat, lng, land, plz: "" };
  } catch {
    return null;
  }
}

/**
 * Projekte nach Ort gruppieren und mit Koordinaten versehen.
 * projekte: [{ slug, titel, ort, ... }]  – Rückgabe: { orte: [Standort], amFirmensitz: [Projekt], ohneKoordinaten: [Ortsname] }
 * Standort: { id, label, plz, lat, lng, land, km, anzahl, projekte }
 */
export async function orteAusProjekten(projekte, firmensitz) {
  const amFirmensitz = projekte.filter((p) => ortPasst(p.ort, firmensitz.label));
  const gruppen = new Map();
  for (const p of projekte) {
    const ort = String(p.ort || "").trim();
    if (!ort || amFirmensitz.includes(p)) continue;
    if (!gruppen.has(ort)) gruppen.set(ort, []);
    gruppen.get(ort).push(p);
  }

  const ohneKoordinaten = [];
  const orte = await Promise.all(
    [...gruppen.entries()].map(async ([ort, liste]) => {
      const k = bekannteKoordinaten(ort) || (await ortSuchen(ort));
      if (!k) {
        ohneKoordinaten.push(ort);
        return null;
      }
      return {
        id: `ort-${ort}`.toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-"),
        label: k.label,
        plz: k.plz,
        lat: k.lat,
        lng: k.lng,
        land: k.land,
        km: Math.round(entfernungKm(firmensitz, k)),
        anzahl: liste.length,
        projekte: liste,
      };
    })
  );

  // Gleicher Kartenort für mehrere Schreibweisen → zusammenführen
  const nachLabel = new Map();
  for (const o of orte.filter(Boolean)) {
    const vorhanden = nachLabel.get(o.label);
    if (vorhanden) {
      vorhanden.projekte.push(...o.projekte);
      vorhanden.anzahl = vorhanden.projekte.length;
    } else nachLabel.set(o.label, o);
  }

  return {
    orte: [...nachLabel.values()].sort((a, b) => a.km - b.km),
    amFirmensitz,
    ohneKoordinaten,
  };
}
