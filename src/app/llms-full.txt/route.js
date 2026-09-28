// src/app/llms-full.txt/route.js
//
// Ausführliche Fassung der llms.txt: zusätzlich die Kernaussagen („Das
// Wichtigste in Kürze“) und FAQ jedes Ratgeber-Artikels – zitierfähig und mit
// Link auf die Quelle. So können KI-Antwortmaschinen korrekt und mit
// Quellenangabe auf Ökovolt verweisen.

import { alleArtikel, artikelPfad } from "@/lib/ratgeber";
import { klartext } from "@/components/Ratgeber/InlineText";
import { BASE_URL } from "@/lib/site";
import { kopf, seiten, regionen, fuss } from "@/lib/llms";

export const dynamic = "force-static";

function artikelBlock(a) {
  const url = `${BASE_URL}${artikelPfad(a.slug)}`;
  const teile = [`### ${a.title}`, `Quelle: ${url} · Stand: ${a.aktualisiert || a.veroeffentlicht || ""}`];
  if (a.description) teile.push(a.description);
  if (a.kurzFazit?.length) teile.push(a.kurzFazit.map((k) => `- ${klartext(k)}`).join("\n"));
  if (a.faq?.length) teile.push(a.faq.map((f) => `**${klartext(f.q)}** ${klartext(f.a)}`).join("\n\n"));
  return teile.join("\n\n");
}

export function GET() {
  const artikel = alleArtikel().map(artikelBlock).join("\n\n---\n\n");
  const text = [kopf(), seiten(), `## Fachwissen – Kernaussagen aller Ratgeber-Artikel\n\n${artikel}\n`, regionen(), fuss()].join("\n");
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
