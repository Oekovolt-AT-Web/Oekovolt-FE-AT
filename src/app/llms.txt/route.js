// src/app/llms.txt/route.js
//
// llms.txt (https://llmstxt.org) für KI-Suchmaschinen – Inhalt aus @/lib/llms.

import { kopf, seiten, ratgeber, regionen, fuss } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  const text = [kopf(), seiten(), ratgeber(), regionen(), fuss()].join("\n");
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
