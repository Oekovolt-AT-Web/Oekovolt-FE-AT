import { FEED_HEADERS, rss } from "@/lib/kanaele/feeds";
import { ratgeberEintraege } from "@/lib/kanaele/ratgeberEintraege";

export const dynamic = "force-static";

export function GET() {
  return new Response(
    rss({
      titel: "Ökovolt Ratgeber Österreich – Photovoltaik für Betriebe, Gemeinden & Landwirtschaft",
      beschreibung: "Fachartikel nach österreichischer Rechtslage: Wirtschaftlichkeit, EAG-Förderung, Steuern, Netzanschluss, Speicher, Energiegemeinschaften und E-Mobilität.",
      pfad: "/ratgeber/rss.xml",
      eintraege: ratgeberEintraege(60),
    }),
    { headers: FEED_HEADERS.rss }
  );
}
