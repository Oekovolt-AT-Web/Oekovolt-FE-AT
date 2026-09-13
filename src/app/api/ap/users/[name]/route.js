import { AP_HEADERS, actor, apBereit } from "@/lib/kanaele/activitypub";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { name } = await params;
  const daten = apBereit() ? actor(name) : null;
  if (!daten) return new Response("Not found", { status: 404 });
  // Browser (HTML) auf die Profilseite der Website leiten
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/html") && !accept.includes("json")) return Response.redirect(daten.url, 302);
  return Response.json(daten, { headers: AP_HEADERS });
}
