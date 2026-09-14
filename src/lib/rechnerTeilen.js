// Geteilte Solarrechner-Ergebnisse: Eingaben <-> URL.
//
// In der URL stehen ausschließlich die Rechner-Eingaben (keine Namen, keine PLZ, keine
// Ergebnisse). Bild und Seite rechnen serverseitig selbst nach – manipulierte Zahlen
// in einem geteilten Link sind so nicht möglich.

import { ANNAHMEN, AUSRICHTUNGEN, NEIGUNGEN } from "@/data/solarrechner";

export const STANDARD = { kwp: 10, verbrauch: 4500, ausrichtung: "sued", neigung: "mittel", speicher: 8, steigerung: ANNAHMEN.strompreisSteigerung };

const eins = (v) => (Array.isArray(v) ? v[0] : v);
const zahl = (v, min, max, raster, standard) => {
  const n = Number(eins(v));
  if (!Number.isFinite(n)) return standard;
  return Math.min(max, Math.max(min, Math.round(n / raster) * raster));
};

/** Aus searchParams (Objekt oder URLSearchParams) gültige Eingaben machen. */
export function eingabenAusParams(p = {}) {
  const get = (k) => (typeof p.get === "function" ? p.get(k) : p[k]);
  const ausrichtung = eins(get("a"));
  const neigung = eins(get("n"));
  const steigerung = Number(eins(get("p")));
  return {
    kwp: zahl(get("k"), 3, 30, 0.5, STANDARD.kwp),
    verbrauch: zahl(get("v"), 1500, 20000, 250, STANDARD.verbrauch),
    ausrichtung: AUSRICHTUNGEN.some((x) => x.id === ausrichtung) ? ausrichtung : STANDARD.ausrichtung,
    neigung: NEIGUNGEN.some((x) => x.id === neigung) ? neigung : STANDARD.neigung,
    speicher: zahl(get("s"), 0, 20, 1, STANDARD.speicher),
    steigerung: ANNAHMEN.strompreisSteigerungOptionen.includes(steigerung) ? steigerung : STANDARD.steigerung,
  };
}

/** Kurze Query für geteilte Links und Bild-URLs. */
export function teilenQuery(e) {
  return new URLSearchParams({ k: String(e.kwp), v: String(e.verbrauch), a: e.ausrichtung, n: e.neigung, s: String(e.speicher), p: String(e.steigerung) }).toString();
}

/** Parameter für berechne() */
export const alsBerechnung = (e) => ({ kwp: e.kwp, ausrichtung: e.ausrichtung, neigung: e.neigung, verbrauch: e.verbrauch, speicherKwh: e.speicher, preissteigerung: e.steigerung });
