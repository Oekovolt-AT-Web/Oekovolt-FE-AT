// CSV-Download Solar-Marktwert (CC BY 4.0) – statischer Inhalt, frei ohne Lead-Gate.
// Erzeugt beim Build aus data/marktindizes/solar-marktwert.json (+ Referenzmarktwert E-Control als Vergleichsspalte).

import { solarCsv } from "../../_marktindizes/daten";

export const dynamic = "force-static";

export function GET() {
  return new Response(solarCsv(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="oekovolt-solar-marktwert.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
