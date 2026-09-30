// Solar-Siegel für Kunden-Websites.
//   /siegel/<projekt-slug>.svg   – das Siegel als SVG-Bild (Standard-Einbau per <img>)
//   /siegel/<projekt-slug>       – schlanke, eigenständige HTML-Ansicht des Siegels
// Parameter: ?stil=hell|dunkel & ?format=klein|breit
// Hinweis: Global gilt X-Frame-Options: DENY (next.config.mjs) – die HTML-Ansicht lässt sich daher
// nicht per <iframe> einbetten; der Einbau erfolgt bewusst als Bild-Link.
// Nicht indexieren (X-Robots-Tag noindex, follow), die Zahlen stehen auf der Projektseite.

import { ladeKundenbuehne } from "@/lib/kundenbuehneServer";
import { SIEGEL_FORMATE, SIEGEL_STILE, siegelAlt, siegelSvg } from "@/lib/kundenbuehne";

const KOPF = {
  "X-Robots-Tag": "noindex, follow",
  "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
  "Cross-Origin-Resource-Policy": "cross-origin",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(request, { params }) {
  const { slug: roh } = await params;
  const istSvg = roh.endsWith(".svg");
  const title = istSvg ? roh.slice(0, -4) : roh;
  const url = new URL(request.url);
  const stil = SIEGEL_STILE[url.searchParams.get("stil")] ? url.searchParams.get("stil") : "hell";
  const format = SIEGEL_FORMATE[url.searchParams.get("format")] ? url.searchParams.get("format") : "klein";

  const d = await ladeKundenbuehne(title);
  if (!d) {
    return new Response("Siegel nicht gefunden", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" } });
  }
  if (d.veraltet) {
    const ziel = new URL(`/siegel/${d.projekt.slug}${istSvg ? ".svg" : ""}${url.search}`, url);
    return Response.redirect(ziel, 308);
  }

  const svg = siegelSvg({ firma: d.firma, zahlen: d.zahlen, stil, format });
  if (istSvg) {
    return new Response(svg, { headers: { ...KOPF, "Content-Type": "image/svg+xml; charset=utf-8" } });
  }

  const projektUrl = `/referenzen/projekte/${d.projekt.slug}`;
  const html = `<!doctype html>
<html lang="de-AT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow">
<title>Solar-Siegel · ${esc(d.firma)}</title>
<link rel="canonical" href="https://www.oekovolt.com${projektUrl}">
<style>
  html,body{margin:0;height:100%}
  body{display:flex;align-items:center;justify-content:center;background:${stil === "dunkel" ? "#03122b" : "transparent"};font-family:system-ui,sans-serif}
  a{display:inline-block;line-height:0;max-width:100%}
  svg{max-width:100%;height:auto}
</style>
</head>
<body>
<a href="${projektUrl}" target="_blank" rel="noopener" aria-label="${esc(siegelAlt(d.firma, d.zahlen))}">${svg}</a>
</body>
</html>`;
  return new Response(html, { headers: { ...KOPF, "Content-Type": "text/html; charset=utf-8" } });
}
