// src/app/api/standort/route.js
//
// Standort-Check (/standort-check): Adresssuche, Seehöhe und PV-Ertrag für einen Punkt in
// Österreich. Alle externen Dienste werden serverseitig mit Timeout, Cache und Drosselung
// abgefragt (Details und Nutzungsbedingungen in src/lib/standort/dienste.js).
// HORA/eHORA wird weiterhin NICHT abgefragt: HORA untersagt das automatisierte Abrufen seiner
// Daten. Die Normwerte für Schneelast, Wind und Hagel übernimmt der Nutzer aus eHORA (Direktlink
// mit Koordinaten). Zusätzlich liefern wir einen Schneelast-RICHTWERT aus eigener Auswertung
// offener GeoSphere-Daten (SNOWGRID-CL, CC BY 4.0) – aus einer lokalen Rasterdatei, ohne
// externen Abruf (src/lib/standort/schneelastRaster.js). Er ersetzt den eHORA-Normwert nicht.
//
// GET /api/standort?q=<Adresse>                                  → { treffer: [...] }
// GET /api/standort?lat=..&lon=..&neigung=..&azimut=..&montage=..  → Standortdaten + Ertrag
//     + schneelastRichtwert ({ sk, quelle, zeitraum, methode, stand, … } oder null)
//     optional: nur=ertrag (nur PVGIS für die gewählte Ausrichtung)

import { NextResponse } from "next/server";
import { ipAdresse } from "@/lib/ipAdresse";
import { horaLinks } from "@/lib/standort/hora";
import { skRichtwert } from "@/lib/standort/schneelastRaster";
import { inOesterreichRahmen, ortZuKoordinate, pvgisErtrag, seehoehe, sucheAdresse } from "@/lib/standort/dienste";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FEHLER_KONTAKT = "Bitte versuchen Sie es in einigen Minuten erneut oder schreiben Sie uns an office@oekovolt.com bzw. rufen Sie +43 6278 71030 an.";

/* ------------------------------------------------------------------ einfache Ratenbegrenzung je IP */

const FENSTER_MS = 10 * 60 * 1000;
const LIMITS = { suche: 20, analyse: 40 };
const zugriffe = new Map();

function zuViele(ip, art) {
  if (!ip) return false;
  const jetzt = Date.now();
  const schluessel = `${art}:${ip}`;
  const liste = (zugriffe.get(schluessel) || []).filter((t) => jetzt - t < FENSTER_MS);
  liste.push(jetzt);
  zugriffe.set(schluessel, liste);
  if (zugriffe.size > 5000) {
    for (const [k, v] of zugriffe) if (!v.some((t) => jetzt - t < FENSTER_MS)) zugriffe.delete(k);
  }
  return liste.length > LIMITS[art];
}

function antwort(daten, status = 200, cache = "no-store") {
  return NextResponse.json(daten, { status, headers: { "Cache-Control": cache } });
}

/* ------------------------------------------------------------------ Handler */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ip = ipAdresse(request);

  // --- Adresssuche -------------------------------------------------------
  if (searchParams.has("q")) {
    const q = searchParams.get("q")?.trim() || "";
    if (q.length < 3) return antwort({ error: "Bitte geben Sie mindestens drei Zeichen ein." }, 400);
    if (zuViele(ip, "suche")) return antwort({ error: "Zu viele Suchanfragen in kurzer Zeit. Bitte warten Sie einige Minuten." }, 429);
    try {
      const treffer = await sucheAdresse(q);
      return antwort({ treffer }, 200, "private, max-age=3600");
    } catch (e) {
      console.error("Standort-Check: Adresssuche fehlgeschlagen", e?.message);
      return antwort({ error: `Die Adresssuche ist gerade nicht erreichbar. Sie können den Standort auch direkt in der Karte anklicken. ${FEHLER_KONTAKT}` }, 502);
    }
  }

  // --- Standortanalyse --------------------------------------------------
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return antwort({ error: "Bitte geben Sie eine Adresse ein oder wählen Sie einen Punkt in der Karte." }, 400);
  }
  if (!inOesterreichRahmen(lat, lon)) {
    return antwort({ error: "Der gewählte Punkt liegt außerhalb Österreichs. Der Standort-Check ist für Standorte in Österreich ausgelegt." }, 422);
  }
  if (zuViele(ip, "analyse")) {
    return antwort({ error: "Zu viele Abfragen in kurzer Zeit. Bitte warten Sie einige Minuten." }, 429);
  }

  const neigung = Math.max(0, Math.min(90, Number(searchParams.get("neigung") ?? 30) || 0));
  const azimut = Math.max(-180, Math.min(180, Number(searchParams.get("azimut") ?? 0) || 0));
  const montage = searchParams.get("montage") === "building" ? "building" : "free";
  const nurErtrag = searchParams.get("nur") === "ertrag";

  const [ort, hoehe, optimal, gewaehlt] = await Promise.allSettled([
    nurErtrag ? Promise.resolve(null) : ortZuKoordinate(lat, lon),
    nurErtrag ? Promise.resolve(null) : seehoehe(lat, lon),
    nurErtrag ? Promise.resolve(null) : pvgisErtrag({ lat, lon, montage, optimal: true }),
    pvgisErtrag({ lat, lon, neigung, azimut, montage }),
  ]);

  const ortWert = ort.status === "fulfilled" ? ort.value : null;
  if (ortWert?.land && ortWert.land !== "at") {
    return antwort({ error: "Der gewählte Punkt liegt nicht in Österreich. Bitte wählen Sie einen Standort in Österreich." }, 422);
  }

  const optimalWert = optimal.status === "fulfilled" ? optimal.value : null;
  const gewaehltWert = gewaehlt.status === "fulfilled" ? gewaehlt.value : null;
  if (gewaehlt.status === "rejected") console.error("Standort-Check: PVGIS fehlgeschlagen", gewaehlt.reason?.message);

  let hoeheWert = hoehe.status === "fulfilled" ? hoehe.value : null;
  if (!hoeheWert && !nurErtrag) {
    const pvgisHoehe = gewaehltWert?.seehoehe ?? optimalWert?.seehoehe;
    if (Number.isFinite(pvgisHoehe)) hoeheWert = { m: pvgisHoehe, quelle: "Geländemodell von PVGIS (JRC)" };
  }

  // Nur lokale Datei, kein externer Abruf; fehlt sie, bleibt der Wert null.
  // Über 2.000 m kein Richtwert: Laut Schneelast.Reform-Endbericht ist die Modellierung erst bis
  // 2.000 m verlässlich, darüber stehen im 1-km-Raster Hochgebirgswerte, die für Dächer nichts aussagen.
  let schneelastRichtwert = null;
  if (!nurErtrag && !(hoeheWert?.m > 2000)) {
    try {
      schneelastRichtwert = skRichtwert(lat, lon);
    } catch (e) {
      console.error("Standort-Check: Schneelast-Richtwert fehlgeschlagen", e?.message);
    }
  }

  return antwort(
    {
      lage: { lat, lon, adresse: ortWert?.label || null },
      seehoehe: hoeheWert,
      schneelastRichtwert,
      ertrag: {
        optimal: optimalWert,
        gewaehlt: gewaehltWert,
        parameter: { neigung, azimut, montage },
        fehler: gewaehltWert ? null : `Die Ertragsberechnung (PVGIS) ist gerade nicht erreichbar. ${FEHLER_KONTAKT}`,
      },
      hora: horaLinks(lat, lon),
    },
    200,
    gewaehltWert ? "private, max-age=3600" : "no-store"
  );
}
