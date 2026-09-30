// src/app/schneelast/richtwert/route.js
//
// Schneelast-Richtwert für einen Punkt in Österreich – leichtgewichtiger Abruf für das Werkzeug
// auf /schneelast (ohne PVGIS, ohne Rückwärtssuche; die Adresssuche läuft über /api/standort?q=).
//
// GET /schneelast/richtwert?lat=..&lon=..
//   → { lage, seehoehe, richtwert: { sk, … } | null, grund, hora }
//
// - Richtwert: lokale Rasterdatei data/schneelast/sk50-at.bin (eigene Auswertung GeoSphere Austria
//   SNOWGRID-CL v2.1, CC BY 4.0) über skRichtwert() – kein externer Abruf.
// - Seehöhe: EU-DEM 25 m über Open Topo Data (gedrosselt und gecacht in src/lib/standort/dienste.js),
//   nötig für die 2.000-m-Grenze: darüber geben wir keinen Richtwert aus.
// - HORA/eHORA wird NICHT abgefragt (Nutzungsbedingungen untersagen automatisierte Abrufe);
//   die Antwort enthält nur den Direktlink auf die Schneelastkarte am Punkt.
//
// Produktion: Die Rasterdateien müssen für diese Route mit ausgeliefert werden
// (outputFileTracingIncludes in next.config.mjs, Schlüssel "/schneelast/richtwert").

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { horaLink } from "@/lib/standort/hora";
import { inOesterreichRahmen, seehoehe } from "@/lib/standort/dienste";
import { skRichtwert } from "@/lib/standort/schneelastRaster";
import { MAX_SEEHOEHE } from "@/lib/schneelast/einordnung";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FENSTER_MS = 10 * 60 * 1000;
const LIMIT = 30;
const zugriffe = new Map();

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

function antwort(daten, status = 200, cache = "no-store") {
  return NextResponse.json(daten, { status, headers: { "Cache-Control": cache } });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!searchParams.get("lat") || !searchParams.get("lon") || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return antwort({ error: "Bitte wählen Sie einen Ort über die Suche oder in der Karte." }, 400);
  }
  if (!inOesterreichRahmen(lat, lon)) {
    return antwort({ error: "Der gewählte Punkt liegt außerhalb Österreichs." }, 422);
  }
  if (zuViele(ipAdresse(request))) {
    return antwort({ error: "Zu viele Abfragen in kurzer Zeit. Bitte warten Sie einige Minuten." }, 429);
  }

  let richtwert = null;
  try {
    richtwert = skRichtwert(lat, lon);
  } catch (e) {
    console.error("Schneelast-Seite: Richtwert fehlgeschlagen", e?.message);
  }
  if (!richtwert) {
    return antwort({ lage: { lat, lon }, seehoehe: null, richtwert: null, grund: "keinWert", hora: horaLink("schnee", lat, lon) }, 200, "private, max-age=3600");
  }

  const hoehe = await seehoehe(lat, lon); // null bei Fehlern – dann ohne Höhenprüfung, mit Hinweis
  const ueber2000 = hoehe?.m > MAX_SEEHOEHE;

  return antwort(
    {
      lage: { lat, lon },
      seehoehe: hoehe,
      richtwert: ueber2000 ? null : richtwert,
      grund: ueber2000 ? "ueber2000" : hoehe ? null : "hoeheUnbekannt",
      hora: horaLink("schnee", lat, lon),
    },
    200,
    hoehe ? "private, max-age=3600" : "no-store"
  );
}
