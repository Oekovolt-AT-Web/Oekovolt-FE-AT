// src/app/api/pv-prognose/route.js
//
// PV-Prognose (/pv-prognose): Wettervorhersage (Globalstrahlung, Temperatur, Ensemble-Perzentile)
// für eine Rasterzelle in Österreich aus dem GeoSphere Austria Data Hub, dazu die Day-Ahead-Preise
// der Gebotszone AT aus der bestehenden Energie-live-Quelle (src/lib/energy.js).
// Die PV-Leistung rechnet der Browser (src/lib/prognose/modell.js) – so lösen Änderungen an kWp,
// Neigung oder Ausrichtung keine weiteren Abrufe aus.
//
// GET /api/pv-prognose?lat=..&lon=..
//   → { zelle, lauf, herkunft, ensemble, stunden: [{ ende, ghi, t2m, ghiP10, ghiP50, ghiP90 }],
//       preise: { quelle, punkte: [{ t, eurMwh }] }, quelle }
//
// Limits, Cache und Drosselung: src/lib/prognose/geosphere.js und budget.js.

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { getSpotPrices } from "@/lib/energy";
import { inOesterreichRahmen } from "@/lib/standort/dienste";
import { preiseJeStunde, zelle as zelleVon } from "@/lib/prognose/auswertung";
import { BudgetErschoepft, DATENSATZ, QUELLENANGABE, vorhersageFuerZelle } from "@/lib/prognose/geosphere";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const KONTAKT = "Bei Fragen erreichen Sie uns unter office@oekovolt.at oder +43 6278 71030.";

/* ------------------------------------------------------------------ einfache Ratenbegrenzung je IP */
const FENSTER_MS = 10 * 60 * 1000;
const LIMIT = 30;
const zugriffe = (globalThis.__ovPvPrognoseIp ??= new Map());

function zuViele(ip) {
  if (!ip) return false;
  const jetzt = Date.now();
  const liste = (zugriffe.get(ip) || []).filter((t) => jetzt - t < FENSTER_MS);
  liste.push(jetzt);
  zugriffe.set(ip, liste);
  if (zugriffe.size > 5000) {
    for (const [k, v] of zugriffe) if (!v.some((t) => jetzt - t < FENSTER_MS)) zugriffe.delete(k);
  }
  return liste.length > LIMIT;
}

function antwort(daten, status = 200, cache = "no-store", extra = {}) {
  return NextResponse.json(daten, { status, headers: { "Cache-Control": cache, ...extra } });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return antwort({ error: "Bitte geben Sie eine Adresse oder Koordinaten an." }, 400);
  }
  if (!inOesterreichRahmen(lat, lon)) {
    return antwort({ error: "Der Punkt liegt außerhalb Österreichs. Die PV-Prognose ist für Standorte in Österreich ausgelegt." }, 422);
  }
  if (zuViele(ipAdresse(request))) {
    return antwort({ error: "Zu viele Abfragen in kurzer Zeit. Bitte warten Sie einige Minuten." }, 429, "no-store", { "Retry-After": "300" });
  }

  const z = zelleVon(lat, lon);
  const [wetter, preise] = await Promise.allSettled([vorhersageFuerZelle(z), getSpotPrices()]);

  if (wetter.status === "rejected") {
    const e = wetter.reason;
    if (e instanceof BudgetErschoepft) {
      const sek = Math.max(60, Math.ceil(((e.bis || Date.now() + 600000) - Date.now()) / 1000));
      return antwort(
        { error: `Die Prognose ist gerade stark gefragt und das Abrufkontingent beim Wetterdienst ist ausgeschöpft. Bitte versuchen Sie es in etwa ${Math.ceil(sek / 60)} Minuten erneut. ${KONTAKT}` },
        503,
        "no-store",
        { "Retry-After": String(sek) }
      );
    }
    console.error("PV-Prognose: GeoSphere nicht erreichbar", e?.message);
    return antwort({ error: `Die Wettervorhersage von GeoSphere Austria ist gerade nicht erreichbar. Bitte versuchen Sie es später erneut. ${KONTAKT}` }, 502);
  }

  const w = wetter.value;
  if (!w.stunden.length) {
    return antwort({ error: `Für diesen Standort liegt gerade keine Vorhersage vor. Bitte versuchen Sie es später erneut. ${KONTAKT}` }, 502);
  }

  const von = w.stunden[0].ende - 3600000;
  const bis = w.stunden[w.stunden.length - 1].ende;
  const p = preise.status === "fulfilled" ? preise.value : { quelle: null, punkte: [] };
  const preisStunden = preiseJeStunde(p.punkte).filter((x) => x.t >= von && x.t < bis);

  return antwort(
    {
      zelle: { lat: z.lat, lon: z.lon, grad: z.grad },
      lauf: w.lauf,
      herkunft: w.herkunft,
      ensemble: w.ensemble,
      abgerufen: new Date().toISOString(),
      stunden: w.stunden,
      preise: { quelle: preisStunden.length ? p.quelle : null, punkte: preisStunden },
      quelle: {
        text: QUELLENANGABE,
        lizenz: "CC BY 4.0",
        datensaetze: [
          { name: "C-LAEF AlpeAdria deterministisch (nwp-v2-1h-1km)", url: DATENSATZ.nwp.seite, doi: DATENSATZ.nwp.doi },
          { name: "C-LAEF AlpeAdria Ensemble (ensemble-v2-1h-1km)", url: DATENSATZ.ens.seite, doi: DATENSATZ.ens.doi },
        ],
      },
    },
    200,
    w.herkunft === "veraltet" ? "no-store" : "public, max-age=300, s-maxage=600, stale-while-revalidate=1200"
  );
}
