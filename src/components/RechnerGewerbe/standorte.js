// Server-Helfer: kompakte Standortliste (PVGIS je Ort) für die Rechner Gewerbe-PV und
// Freifläche/Pacht. Wird in der page.js aufgerufen und als Prop übergeben, damit das
// Client-Bundle nur die nötigen Zahlen enthält.

import { regionenNachLand, pvgisQuelle } from "@/lib/regionen";

/** [{ land, name, orte: [{ slug, name, land, sued35, ostwest15, flach10, hoehe }] }] */
export function standortGruppen() {
  return regionenNachLand().map((g) => ({
    land: g.land,
    name: g.name,
    orte: g.orte
      .map((r) => ({
        slug: r.slug,
        name: r.kurzname || r.name,
        land: r.land,
        landName: g.name,
        sued35: r.pvgis.sued35_kwh_kwp,
        ostwest15: r.pvgis.ostwest15_kwh_kwp,
        flach10: r.pvgis.flach10_kwh_kwp,
        hoehe: r.pvgis.hoehe_m,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "de")),
  }));
}

export const pvgisStand = () => pvgisQuelle();
