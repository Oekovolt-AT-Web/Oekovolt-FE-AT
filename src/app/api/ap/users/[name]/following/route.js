import { AP_HEADERS, actorId, apBereit, kontoNach } from "@/lib/kanaele/activitypub";

export async function GET(request, { params }) {
  const { name } = await params;
  if (!apBereit() || !kontoNach(name)) return new Response("Not found", { status: 404 });
  return Response.json(
    { "@context": "https://www.w3.org/ns/activitystreams", id: `${actorId(name)}/following`, type: "OrderedCollection", totalItems: 0, orderedItems: [] },
    { headers: AP_HEADERS }
  );
}
