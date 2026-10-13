// src/app/api/lead-gate/status/route.js
//
// Lead-Gate 2.0 (Welle A, Paket A09): Zustand der Freischaltung aus dem signierten Cookie „ov-lead-frei“.
//   GET    ?kennung=<kennung>  → { frei, freigegeben, kennung, bis }   (frei und freigegeben sind gleich –
//                                 die Übergangs-Gates anderer Pakete lesen das eine oder andere Feld)
//   DELETE                      → Freischaltung auf diesem Gerät entfernen (Cookie löschen)
// Keine Personendaten, kein Backoffice-Aufruf; Antworten werden nie zwischengespeichert.

import { NextResponse } from "next/server";
import { istLeadKennung } from "@/data/leadRechner";
import { FREISCHALT_COOKIE, cookieOptionen, freigabePruefen } from "@/lib/leadGateServer";

export const dynamic = "force-dynamic";

const KEIN_CACHE = { "Cache-Control": "no-store, private", Vary: "Cookie" };

export function GET(request) {
  const kennung = new URL(request.url).searchParams.get("kennung") || "";
  if (!istLeadKennung(kennung)) {
    return NextResponse.json({ frei: false, freigegeben: false, kennung, error: "Unbekannte Kennung", code: "kennung" }, { status: 422, headers: KEIN_CACHE });
  }
  const f = freigabePruefen(request, kennung);
  return NextResponse.json({ frei: f.frei, freigegeben: f.frei, kennung, bis: f.bis ? new Date(f.bis).toISOString() : null }, { headers: KEIN_CACHE });
}

export function DELETE() {
  const res = NextResponse.json({ frei: false, freigegeben: false, entfernt: true }, { headers: KEIN_CACHE });
  res.cookies.set(FREISCHALT_COOKIE, "", cookieOptionen(0));
  return res;
}
