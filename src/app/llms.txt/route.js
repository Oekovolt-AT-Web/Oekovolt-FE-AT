// src/app/llms.txt/route.js
//
// llms.txt (https://llmstxt.org) für KI-Suchmaschinen – Inhalt aus @/lib/llms.
// Blöcke: Kopf mit „Stand:“, Werkzeuge & Daten, Förderung & Netz, Referenzen, Hersteller (nur belegt),
// Presse, weitere Seiten, Ratgeber, Regionen, Feeds & Rechtliches. Nur indexierbare Seiten.

import { llmsDaten, llmsText } from "@/lib/llms";

export const dynamic = "force-static";
// Projekte und Presse-Meldungen kommen aus dem Backoffice – stündlich neu erzeugen
export const revalidate = 3600;

export async function GET() {
  return new Response(llmsText(await llmsDaten()), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
