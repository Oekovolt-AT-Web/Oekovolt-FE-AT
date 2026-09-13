import { AP_HEADERS, actorId, apBereit, kontoNach } from "@/lib/kanaele/activitypub";
import { kanal } from "@/lib/kanaele/frappe";

export const dynamic = "force-dynamic";

/** Nur die Anzahl – die Liste der Follower wird aus Datenschutzgründen nicht veröffentlicht. */
export async function GET(request, { params }) {
  const { name } = await params;
  if (!apBereit() || !kontoNach(name)) return new Response("Not found", { status: 404 });
  let anzahl = 0;
  try {
    anzahl = Number(await kanal("ap_follower_anzahl", { konto: name }, { revalidate: 600 })) || 0;
  } catch {
    /* Backend nicht erreichbar */
  }
  return Response.json(
    { "@context": "https://www.w3.org/ns/activitystreams", id: `${actorId(name)}/followers`, type: "OrderedCollection", totalItems: anzahl },
    { headers: AP_HEADERS }
  );
}
