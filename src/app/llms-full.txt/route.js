// src/app/llms-full.txt/route.js
//
// Ausführliche Fassung der llms.txt: statt der Ratgeber-Linkliste die Kernaussagen („Das
// Wichtigste in Kürze“) und FAQ jedes Ratgeber-Artikels – zitierfähig und mit Link auf die
// Quelle. So können KI-Antwortmaschinen korrekt und mit Quellenangabe auf Ökovolt verweisen.
// Alle übrigen Blöcke (inkl. „Stand:“) wie in /llms.txt, siehe @/lib/llms.

import { alleArtikel, artikelPfad } from "@/lib/ratgeber";
import { klartext } from "@/components/Ratgeber/InlineText";
import { BASE_URL } from "@/lib/site";
import { indexierbar, llmsDaten, llmsText } from "@/lib/llms";

export const dynamic = "force-static";
// Projekte und Presse-Meldungen kommen aus dem Backoffice – stündlich neu erzeugen
export const revalidate = 3600;

function artikelBlock(a) {
  const url = `${BASE_URL}${artikelPfad(a.slug)}`;
  const teile = [`### ${a.title}`, `Quelle: ${url} · Stand: ${a.aktualisiert || a.veroeffentlicht || ""}`];
  if (a.description) teile.push(a.description);
  if (a.kurzFazit?.length) teile.push(a.kurzFazit.map((k) => `- ${klartext(k)}`).join("\n"));
  if (a.faq?.length) teile.push(a.faq.map((f) => `**${klartext(f.q)}** ${klartext(f.a)}`).join("\n\n"));
  return teile.join("\n\n");
}

export async function GET() {
  const artikel = alleArtikel()
    .filter((a) => indexierbar(artikelPfad(a.slug)))
    .map(artikelBlock)
    .join("\n\n---\n\n");
  const text = llmsText({ ...(await llmsDaten()), mitte: `## Fachwissen – Kernaussagen aller Ratgeber-Artikel\n\n${artikel}\n` });
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
