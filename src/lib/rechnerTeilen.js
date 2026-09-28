// Geteilte Solarrechner-Ergebnisse: Eingaben <-> URL.
//
// In der URL stehen ausschließlich die Rechner-Eingaben (keine Namen, keine PLZ, keine
// Ergebnisse). Bild und Seite rechnen serverseitig selbst nach – manipulierte Zahlen
// in einem geteilten Link sind so nicht möglich.
//
// Seit 09/2026 (AT) mit Zielgruppe (z), Betriebstagen (t) und Schichten (sch).
// Alte Links ohne diese Parameter werden als „privat“ gelesen.

import { ANNAHMEN, AUSRICHTUNGEN, NEIGUNGEN, ZIELGRUPPEN, zielgruppeGrenzen } from "@/data/solarrechner";

export const STANDARD = {
  zielgruppe: "privat",
  kwp: 10,
  verbrauch: 4500,
  ausrichtung: "sued",
  neigung: "mittel",
  speicher: 8,
  steigerung: ANNAHMEN.strompreisSteigerung,
  betriebstage: 5,
  schichten: 1,
};

/** Startwerte je Zielgruppe (beim Umschalten im Rechner). */
export function standardFuer(zielgruppe) {
  const g = zielgruppeGrenzen(zielgruppe);
  return { ...STANDARD, zielgruppe: g.id, kwp: g.kwp.standard, verbrauch: g.verbrauch.standard, speicher: g.speicher.standard, neigung: g.neigungStandard };
}

const eins = (v) => (Array.isArray(v) ? v[0] : v);
const zahl = (v, min, max, raster, standard) => {
  const n = Number(eins(v));
  if (!Number.isFinite(n)) return standard;
  return Math.min(max, Math.max(min, Math.round(n / raster) * raster));
};

/** Aus searchParams (Objekt oder URLSearchParams) gültige Eingaben machen. */
export function eingabenAusParams(p = {}) {
  const get = (k) => (typeof p.get === "function" ? p.get(k) : p[k]);
  const zRoh = eins(get("z"));
  const zielgruppe = ZIELGRUPPEN.some((z) => z.id === zRoh) ? zRoh : "privat";
  const g = zielgruppeGrenzen(zielgruppe);
  const ausrichtung = eins(get("a"));
  const neigung = eins(get("n"));
  const steigerung = Number(eins(get("p")));
  return {
    zielgruppe,
    kwp: zahl(get("k"), g.kwp.min, g.kwp.max, g.kwp.raster, g.kwp.standard),
    verbrauch: zahl(get("v"), g.verbrauch.min, g.verbrauch.max, g.verbrauch.raster, g.verbrauch.standard),
    ausrichtung: AUSRICHTUNGEN.some((x) => x.id === ausrichtung) ? ausrichtung : STANDARD.ausrichtung,
    neigung: NEIGUNGEN.some((x) => x.id === neigung) ? neigung : g.neigungStandard,
    speicher: zahl(get("s"), 0, g.speicher.max, g.speicher.raster, g.speicher.standard),
    steigerung: ANNAHMEN.strompreisSteigerungOptionen.includes(steigerung) ? steigerung : STANDARD.steigerung,
    betriebstage: zahl(get("t"), 5, 7, 1, STANDARD.betriebstage),
    schichten: zahl(get("sch"), 1, 3, 1, STANDARD.schichten),
  };
}

/** Kurze Query für geteilte Links und Bild-URLs. */
export function teilenQuery(e) {
  const q = { k: String(e.kwp), v: String(e.verbrauch), a: e.ausrichtung, n: e.neigung, s: String(e.speicher), p: String(e.steigerung) };
  if (e.zielgruppe && e.zielgruppe !== "privat") {
    q.z = e.zielgruppe;
    if (e.zielgruppe === "gewerbe") {
      q.t = String(e.betriebstage ?? STANDARD.betriebstage);
      q.sch = String(e.schichten ?? STANDARD.schichten);
    }
  }
  return new URLSearchParams(q).toString();
}

/** Parameter für berechne() */
export const alsBerechnung = (e) => ({
  kwp: e.kwp,
  ausrichtung: e.ausrichtung,
  neigung: e.neigung,
  verbrauch: e.verbrauch,
  speicherKwh: e.speicher,
  preissteigerung: e.steigerung,
  zielgruppe: e.zielgruppe || "privat",
  betriebstage: e.betriebstage ?? STANDARD.betriebstage,
  schichten: e.schichten ?? STANDARD.schichten,
});
