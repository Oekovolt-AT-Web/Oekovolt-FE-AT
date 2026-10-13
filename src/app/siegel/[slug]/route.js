// Projekt-Plakette für Kunden-Websites (ehemals „Solar-Siegel“ – der Pfad /siegel bleibt aus
// Kompatibilitätsgründen, der Inhalt ist eine sachliche Projektangabe, siehe src/lib/kundenbuehne.js).
//   /siegel/<projekt-slug>.svg   – die Plakette als SVG-Bild (Standard-Einbau per <img>)
//   /siegel/<projekt-slug>       – schlanke, eigenständige HTML-Ansicht der Plakette
// Parameter: ?stil=hell|dunkel & ?format=klein|breit
// Ausgeliefert wird NUR mit Freigabe „Projekt-Plakette“ des Kunden (DocType Referenz Freigabe bzw.
// src/data/kunden.js) – sonst 404. Der Firmenname steht nur mit Namensfreigabe auf der Plakette.
// Hinweis: Global gilt X-Frame-Options: DENY (next.config.mjs) – die HTML-Ansicht lässt sich daher
// nicht per <iframe> einbetten; der Einbau erfolgt bewusst als Bild-Link.
// Nicht indexieren (X-Robots-Tag noindex, follow), die Zahlen stehen auf der Projektseite.

import { ladeKundenbuehne } from "@/lib/kundenbuehneServer";
import { PLAKETTE_FORMATE, PLAKETTE_STILE, plaketteAlt, plaketteSvg } from "@/lib/kundenbuehne";
import { BASE_URL } from "@/lib/site";

const KOPF = {
  "X-Robots-Tag": "noindex, follow",
  "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
  "Cross-Origin-Resource-Policy": "cross-origin",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const nichtGefunden = (text) =>
  new Response(text, {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex", "Cache-Control": "public, max-age=300" },
  });

export async function GET(request, { params }) {
  const { slug: roh } = await params;
  const istSvg = roh.endsWith(".svg");
  const title = istSvg ? roh.slice(0, -4) : roh;
  const url = new URL(request.url);
  const stil = PLAKETTE_STILE[url.searchParams.get("stil")] ? url.searchParams.get("stil") : "hell";
  const format = PLAKETTE_FORMATE[url.searchParams.get("format")] ? url.searchParams.get("format") : "klein";

  const d = await ladeKundenbuehne(title);
  if (!d) return nichtGefunden("Plakette nicht gefunden");
  // Ohne Freigabe des Kunden gibt es keine Plakette – auch nicht für alte Slugs
  if (!d.kit.plakette) return nichtGefunden("Für dieses Projekt liegt keine Freigabe für die Projekt-Plakette vor");
  if (d.veraltet) {
    const ziel = new URL(`/siegel/${d.projekt.slug}${istSvg ? ".svg" : ""}${url.search}`, url);
    return Response.redirect(ziel, 308);
  }

  const projektUrl = `/referenzen/projekte/${d.projekt.slug}`;
  const eingabe = { firma: d.firma, zahlen: d.zahlen, jahr: d.jahr, nameFrei: d.nameFrei, rechenwegUrl: `${BASE_URL}${projektUrl}/esg` };
  const svg = plaketteSvg({ ...eingabe, stil, format });
  if (istSvg) {
    return new Response(svg, { headers: { ...KOPF, "Content-Type": "image/svg+xml; charset=utf-8" } });
  }

  const alt = plaketteAlt(eingabe);
  const html = `<!doctype html>
<html lang="de-AT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>Projekt-Plakette · ${esc(d.firma)}</title>
<link rel="canonical" href="${BASE_URL}${projektUrl}">
<style>
  html,body{margin:0;height:100%}
  body{display:flex;align-items:center;justify-content:center;background:${stil === "dunkel" ? "#03122b" : "transparent"};font-family:system-ui,sans-serif}
  a{display:inline-block;line-height:0;max-width:100%}
  svg{max-width:100%;height:auto}
</style>
</head>
<body>
<a href="${projektUrl}" target="_blank" rel="noopener" aria-label="${esc(alt)}">${svg}</a>
</body>
</html>`;
  return new Response(html, { headers: { ...KOPF, "Content-Type": "text/html; charset=utf-8" } });
}
