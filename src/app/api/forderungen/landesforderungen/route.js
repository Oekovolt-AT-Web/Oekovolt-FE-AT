// src/app/api/forderungen/landesforderungen/route.js
//
// Liefert die Landesförderungen der neun österreichischen Bundesländer als JSON
// – aus den statischen Daten in @/data/bundeslaender (kein Backend-Aufruf).

import { NextResponse } from "next/server";
import { alleBundeslaender, STAND } from "@/data/bundeslaender";

export const dynamic = "force-static";

export function GET() {
  const laender = alleBundeslaender().map((l) => ({
    key: l.key,
    name: l.name,
    slug: l.slug,
    pfad: `/forderungen/landesforderungen/${l.slug}`,
    foerderart: l.foerderart,
    kurz: l.kurz,
    stand: l.stand,
    programme: l.programme.map(({ name, traeger, zielgruppen, themen, hoehe, status, url, pruefen }) => ({ name, traeger, zielgruppen, themen, hoehe, status, url, pruefen: Boolean(pruefen) })),
    netzbetreiber: l.netzbetreiber,
  }));

  return NextResponse.json(
    { stand: STAND, laender },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
  );
}
