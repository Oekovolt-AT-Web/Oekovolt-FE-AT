import { tvEintraege } from "@/lib/kanaele/tv";

export const dynamic = "force-dynamic";

/**
 * JSON für Info-Bildschirme / SCADA-Visualisierungen.
 * GET /tv/feed.json?standort=Werk-Nord
 */
export async function GET(request) {
  const standort = (new URL(request.url).searchParams.get("standort") || "").slice(0, 60);
  const eintraege = await tvEintraege({ standort });
  return Response.json(
    { version: 1, erzeugt: new Date().toISOString(), standort: standort || null, eintraege },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120", "Access-Control-Allow-Origin": "*" } }
  );
}
