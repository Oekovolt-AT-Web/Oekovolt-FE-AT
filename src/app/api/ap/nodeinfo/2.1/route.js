import { FEDIVERSE_KONTEN } from "@/lib/kanaele/fediverseKonten";
import { BASE_URL } from "@/lib/kanaele/veroeffentlichungen";

export function GET() {
  return Response.json(
    {
      version: "2.1",
      software: { name: "oekovolt-website", version: "1.0.0", homepage: BASE_URL },
      protocols: ["activitypub"],
      services: { inbound: [], outbound: ["rss2.0"] },
      openRegistrations: false,
      usage: { users: { total: FEDIVERSE_KONTEN.length, activeMonth: FEDIVERSE_KONTEN.length, activeHalfyear: FEDIVERSE_KONTEN.length } },
      metadata: { nodeName: "Ökovolt Österreich", nodeDescription: "Neuigkeiten und Fachartikel der ÖKOVOLT GmbH Solartechnik" },
    },
    {
      headers: {
        "Content-Type": 'application/json; profile="http://nodeinfo.diaspora.software/ns/schema/2.1#"',
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    }
  );
}
