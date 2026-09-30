// src/app/schneelast/karte.png/route.js
//
// Kartenbild der Schneelast-Richtwerte für /schneelast: PNG aus dem lokalen Raster
// data/schneelast/sk50-at.bin (eigene Auswertung GeoSphere Austria SNOWGRID-CL v2.1, CC BY 4.0).
// Wird zur Build-Zeit statisch erzeugt (force-static) – kein externer Abruf, HORA wird nicht
// abgefragt. Projektion EPSG:3416 (Austria Lambert), 1 Rasterzelle = 2 × 2 Pixel, Norden oben.

import { ladeRaster } from "@/lib/standort/schneelastRaster";
import { kartePng } from "@/lib/schneelast/karte";

export const dynamic = "force-static";
export const runtime = "nodejs";

export function GET() {
  const raster = ladeRaster();
  if (!raster) return new Response("Schneelast-Karte derzeit nicht verfügbar.", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const png = kartePng(raster, 2);
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
