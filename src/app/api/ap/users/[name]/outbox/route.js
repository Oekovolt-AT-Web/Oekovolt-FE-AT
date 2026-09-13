import { AP_HEADERS, actorId, apBereit, create, kontoNach } from "@/lib/kanaele/activitypub";
import { eintraegeFuer } from "@/lib/kanaele/apEintraege";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { name } = await params;
  if (!apBereit() || !kontoNach(name)) return new Response("Not found", { status: 404 });
  const eintraege = await eintraegeFuer(name, { limit: 20 });
  const id = `${actorId(name)}/outbox`;
  const seite = new URL(request.url).searchParams.get("page");
  const items = eintraege.map((e) => create(name, e));

  if (!seite) {
    return Response.json(
      { "@context": "https://www.w3.org/ns/activitystreams", id, type: "OrderedCollection", totalItems: items.length, first: `${id}?page=true`, last: `${id}?page=true` },
      { headers: AP_HEADERS }
    );
  }
  return Response.json(
    { "@context": "https://www.w3.org/ns/activitystreams", id: `${id}?page=true`, type: "OrderedCollectionPage", partOf: id, orderedItems: items },
    { headers: AP_HEADERS }
  );
}
