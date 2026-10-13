// src/components/GewerbeUnikat/K2Sonne.js
//
// K2 · Dach-Labor: Sonnenstand und Klarhimmel-Tageskurve – REINE Funktionen (Server, Client, Node).
// Rechnet ausschließlich mit den Projektbibliotheken: sonnenstand() und klarhimmel() aus
// src/lib/lastgang/pv.js (NOAA-Näherung, Klarhimmel-Modell), wandZuUtc() aus src/lib/lastgang/parser.js
// (österreichische Ortszeit mit Sommerzeit). Die Kurve zeigt die LICHTFORM, keinen Ertrag
// (KENNZEICHNUNG.klarhimmel).

import { AUSRICHTUNGEN, klarhimmel, sonnenstand } from "../../lib/lastgang/pv.js";
import { wandZuUtc } from "../../lib/lastgang/parser.js";
import { SONNEN_TAGE, ZEIT } from "./K2Modell.js";

const JAHR = 2026;

/** Tag-Kennung → { m, d } */
export const sonnenTag = (id) => SONNEN_TAGE.find((t) => t.id === id) || SONNEN_TAGE[1];

/** UTC-ms für Tag und Wanduhr-Minuten. */
function utc(tagId, min) {
  const t = sonnenTag(tagId);
  return wandZuUtc(Date.UTC(JAHR, t.m, t.d, 0, min));
}

/**
 * Sonnenstand am gewählten Tag und zur gewählten Uhrzeit.
 * @returns {{ zenit:number, azimut:number, hoehe:number, ueber:boolean, tag:number }}
 */
export function sonneAm(tagId, min, lat, lon) {
  const s = sonnenstand(utc(tagId, min), lat, lon);
  return { zenit: s.zenit, azimut: s.azimut, hoehe: 90 - s.zenit, ueber: s.zenit < 90, tag: s.tag };
}

/** Ausrichtungen der Kurve in Anzeige-Reihenfolge (Ids wie AUSRICHTUNGEN in pv.js). */
export const KURVEN = [
  { id: "sued", label: "Süd 35°" },
  { id: "flach", label: "Süd 10°" }, // AUSRICHTUNGEN „Flachdach Süd, 10°“ – so heißt die Ertragsbasis auch im Rechenstreifen
  { id: "ostwest", label: "Ost-West 15°" },
];

/**
 * Klarhimmel-Lichtform für Süd 35°, Süd 10° (flach) und Ost-West 15° am gewählten Tag (15-min-Raster im
 * Bereich des Uhrzeit-Reglers), normiert auf das Maximum von Süd 35°. Dazu Auf- und Untergang.
 * @returns {{ punkte:{ min:number, sued:number, flach:number, ostwest:number }[], auf:number|null, unter:number|null, maxY:number }}
 */
export function tageskurve(tagId, lat, lon) {
  const fl = Object.fromEntries(AUSRICHTUNGEN.map((a) => [a.id, a.flaechen]));
  const roh = [];
  for (let min = ZEIT.min; min <= ZEIT.max; min += ZEIT.schritt) {
    const s = sonnenstand(utc(tagId, min), lat, lon);
    roh.push({
      min,
      sued: klarhimmel(s.zenit, s.azimut, s.tag, fl.sued),
      flach: klarhimmel(s.zenit, s.azimut, s.tag, fl.flach),
      ostwest: klarhimmel(s.zenit, s.azimut, s.tag, fl.ostwest),
    });
  }
  const maxSued = Math.max(1e-9, ...roh.map((p) => p.sued));
  const punkte = roh.map((p) => ({ min: p.min, sued: p.sued / maxSued, flach: p.flach / maxSued, ostwest: p.ostwest / maxSued }));
  const maxY = Math.max(1, ...punkte.map((p) => Math.max(p.sued, p.flach, p.ostwest)));

  // Auf- und Untergang (Zenit = 90°) minutengenau suchen
  const hoeheBei = (min) => 90 - sonnenstand(utc(tagId, min), lat, lon).zenit;
  let auf = null;
  let unter = null;
  for (let min = 0; min < 1440; min += 5) {
    const a = hoeheBei(min);
    const b = hoeheBei(min + 5);
    if (a < 0 && b >= 0 && auf == null) auf = min + (5 * -a) / (b - a);
    if (a >= 0 && b < 0) unter = min + (5 * a) / (a - b);
  }
  return { punkte, auf, unter, maxY };
}

/**
 * Sonnenbogen des Tages: Azimut (Grad von Nord) bei Auf- und Untergang – als Bogen auf dem Kompassring von
 * Modell und Iso-SVG. Juni: von Nordost bis Nordwest, Dezember: nur von Südost bis Südwest.
 * @returns {{ von:number, bis:number } | null}
 */
export function tagesBogen(tagId, lat, lon, kurve) {
  if (kurve?.auf == null || kurve?.unter == null) return null;
  return { von: sonneAm(tagId, kurve.auf, lat, lon).azimut, bis: sonneAm(tagId, kurve.unter, lat, lon).azimut };
}

/** Wert der Kurve einer Ausrichtung zur Minute (linear zwischen den 15-min-Punkten). */
export function kurveBei(kurve, id, min) {
  const p = kurve.punkte;
  const t = (min - p[0].min) / ZEIT.schritt;
  const i = Math.max(0, Math.min(p.length - 2, Math.floor(t)));
  const f = Math.max(0, Math.min(1, t - i));
  return p[i][id] * (1 - f) + p[i + 1][id] * f;
}
