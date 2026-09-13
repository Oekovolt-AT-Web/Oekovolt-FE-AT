import { BASE_URL } from "@/lib/kanaele/veroeffentlichungen";

/** /.well-known/nodeinfo */
export function GET() {
  return Response.json(
    { links: [{ rel: "http://nodeinfo.diaspora.software/ns/schema/2.1", href: `${BASE_URL}/api/ap/nodeinfo/2.1` }] },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=86400" } }
  );
}
