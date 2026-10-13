// CSV-Download Speicher-Spread-Index (CC BY 4.0) – statischer Inhalt, frei ohne Lead-Gate.
// Erzeugt beim Build aus data/marktindizes/speicher-spread-index.json.

import { speicherCsv } from "../../_marktindizes/daten";

export const dynamic = "force-static";

export function GET() {
  return new Response(speicherCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="oekovolt-speicher-spread-index.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
