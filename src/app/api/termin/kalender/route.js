// src/app/api/termin/kalender/route.js
//
// Freie und belegte Zeiten einer Terminart für Komponenten im Browser (z. B. Rückruf-Widget).
// GET /api/termin/kalender?terminart=Telefonische%20Beratung&tage=7

import { NextResponse } from "next/server";
import { TERMIN_ARTEN } from "@/data/erreichbarkeit";
import { kalenderLaden } from "@/lib/terminKalender";

export const dynamic = "force-dynamic";

const iso = (d) => d.toISOString().split("T")[0];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const terminart = searchParams.get("terminart") || "";
  // Nur bekannte Terminarten weiterreichen
  if (!TERMIN_ARTEN.some((a) => a.titel === terminart)) {
    return NextResponse.json({ error: "Unbekannte Terminart" }, { status: 400 });
  }
  const tage = Math.min(30, Math.max(1, Number(searchParams.get("tage")) || 7));

  const heute = new Date();
  const ende = new Date(heute);
  ende.setDate(ende.getDate() + tage);

  const kalender = await kalenderLaden(terminart, iso(heute), iso(ende));
  return NextResponse.json({ kalender }, { headers: { "Cache-Control": "no-store" } });
}
