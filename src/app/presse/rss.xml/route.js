import { FEED_HEADERS, rss } from "@/lib/kanaele/feeds";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";

export const revalidate = 300;

export async function GET() {
  const eintraege = await veroeffentlichungen({ kanal: "rss", limit: 50 });
  return new Response(
    rss({
      titel: "Ökovolt – Presse & Neuigkeiten",
      beschreibung: "Pressemitteilungen, Unternehmensnews und Projekte der Ökovolt Solartechnik GmbH (Österreich).",
      pfad: "/presse/rss.xml",
      eintraege,
    }),
    { headers: FEED_HEADERS.rss }
  );
}
