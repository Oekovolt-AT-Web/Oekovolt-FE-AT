import { FEED_HEADERS, jsonFeed } from "@/lib/kanaele/feeds";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";

export const revalidate = 300;

export async function GET() {
  const eintraege = await veroeffentlichungen({ kanal: "rss", limit: 50 });
  return Response.json(
    jsonFeed({
      titel: "Ökovolt – Presse & Neuigkeiten",
      beschreibung: "Pressemitteilungen, Unternehmensnews und Projekte der ÖKOVOLT GmbH Solartechnik.",
      pfad: "/presse/feed.json",
      homePfad: "/presse",
      eintraege,
    }),
    { headers: FEED_HEADERS.json }
  );
}
