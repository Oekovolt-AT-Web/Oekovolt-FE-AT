import { BASE_URL } from "@/lib/kanaele/veroeffentlichungen";

/** /.well-known/host-meta – für ältere Fediverse-Software */
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link rel="lrdd" template="${BASE_URL}/.well-known/webfinger?resource={uri}"/>
</XRD>`,
    { headers: { "Content-Type": "application/xrd+xml; charset=utf-8", "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=86400" } }
  );
}
