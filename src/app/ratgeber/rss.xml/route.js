import { FEED_HEADERS, rss } from "@/lib/kanaele/feeds";
import { ratgeberEintraege } from "@/lib/kanaele/ratgeberEintraege";

export const dynamic = "force-static";

export function GET() {
  return new Response(
    rss({
      titel: "Ökovolt Ratgeber – Photovoltaik, Speicher & Energiewende",
      beschreibung: "Fundierte Fachartikel zu Photovoltaik, Stromspeicher, Wärmepumpe, E-Mobilität, Förderung und Recht.",
      pfad: "/ratgeber/rss.xml",
      eintraege: ratgeberEintraege(60),
    }),
    { headers: FEED_HEADERS.rss }
  );
}
