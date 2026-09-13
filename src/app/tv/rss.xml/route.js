import { FEED_HEADERS, rss } from "@/lib/kanaele/feeds";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";

export const dynamic = "force-dynamic";

/** RSS nur mit Bildschirm-Meldungen – für SCADA-/Signage-Systeme, die RSS-Ticker lesen. */
export async function GET(request) {
  const standort = (new URL(request.url).searchParams.get("standort") || "").toLowerCase();
  const jetzt = Date.now();
  const eintraege = (await veroeffentlichungen({ kanal: "tv", limit: 60, revalidate: 60 }))
    .filter((e) => !e.tv.bis || new Date(e.tv.bis).getTime() >= jetzt)
    .filter((e) => !e.tv.standorte.length || e.tv.standorte.some((s) => s.toLowerCase() === standort))
    .map((e) => ({ ...e, inhalt: "" }));
  return new Response(
    rss({ titel: "Ökovolt – Info-Bildschirm", beschreibung: "Aktuelle Meldungen für Info-Bildschirme.", pfad: "/tv/rss.xml", eintraege }),
    { headers: { ...FEED_HEADERS.rss, "Cache-Control": "public, s-maxage=60" } }
  );
}
