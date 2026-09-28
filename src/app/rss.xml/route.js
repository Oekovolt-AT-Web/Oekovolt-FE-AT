import { FEED_HEADERS, rss } from "@/lib/kanaele/feeds";
import { ratgeberEintraege } from "@/lib/kanaele/ratgeberEintraege";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";

export const revalidate = 300;

/** Gesamtfeed: Presse/Neuigkeiten + Ratgeber, neueste zuerst. */
export async function GET() {
  const presse = await veroeffentlichungen({ kanal: "rss", limit: 30 });
  const eintraege = [...presse, ...ratgeberEintraege(30)].sort((a, b) => new Date(b.datum) - new Date(a.datum)).slice(0, 50);
  return new Response(
    rss({
      titel: "Ökovolt Österreich",
      beschreibung: "Neuigkeiten, Pressemitteilungen und Fachartikel von Ökovolt – Photovoltaik aus einer Hand.",
      pfad: "/rss.xml",
      eintraege,
    }),
    { headers: FEED_HEADERS.rss }
  );
}
