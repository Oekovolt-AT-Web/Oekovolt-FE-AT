import { AP_HEADERS, apBereit, kontoNach, note } from "@/lib/kanaele/activitypub";
import { eintraegeFuer } from "@/lib/kanaele/apEintraege";
import { veroeffentlichung } from "@/lib/kanaele/veroeffentlichungen";
import { ratgeberEintraege } from "@/lib/kanaele/ratgeberEintraege";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { name, slug } = await params;
  if (!apBereit() || !kontoNach(name)) return new Response("Not found", { status: 404 });

  let eintrag = null;
  if (name === "ratgeber") eintrag = ratgeberEintraege(500).find((e) => e.slug === slug);
  else if (name === "oekovolt") {
    const v = await veroeffentlichung(slug);
    eintrag = v?.kanaele.fediverse ? v : (await eintraegeFuer(name, { limit: 50 })).find((e) => e.slug === slug);
  }
  if (!eintrag) return new Response("Not found", { status: 404 });

  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/html") && !accept.includes("json")) return Response.redirect(eintrag.url, 302);
  return Response.json({ "@context": "https://www.w3.org/ns/activitystreams", ...note(name, eintrag) }, { headers: AP_HEADERS });
}
