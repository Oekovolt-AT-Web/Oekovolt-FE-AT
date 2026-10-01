import TvAnzeige from "@/components/Kanaele/TvAnzeige";
import { tvEintraege, tvSchauraumFolien } from "@/lib/kanaele/tv";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ökovolt Info-Bildschirm",
  robots: { index: false, follow: false },
};

/**
 * Info-Bildschirm für SCADA-Visualisierungen, Empfangs- und Kunden-TVs.
 *   /tv                     alle Meldungen ohne Standortbindung
 *   /tv?standort=Werk-Nord  zusätzlich Meldungen für diesen Standort
 *   &dauer=20               Standard-Anzeigedauer je Folie (Sekunden)
 *   &energie=0              Strommarkt-Leiste ausblenden
 *   &hell=1                 helles Farbschema
 *   &schauraum=0            Werbefolien für den Schauraum ausblenden (src/data/tvSchauraum.js)
 *   &folie=3                mit Folie 3 beginnen (Vorschau einzelner Folien)
 */
export default async function TvSeite({ searchParams }) {
  const p = await searchParams;
  const standort = String(p?.standort || "").slice(0, 60);
  const [start, schauraum] = await Promise.all([tvEintraege({ standort }), p?.schauraum === "0" ? [] : tvSchauraumFolien()]);
  return (
    <TvAnzeige
      start={start}
      schauraum={schauraum}
      startFolie={Math.max(0, (Number(p?.folie) || 1) - 1)}
      standort={standort}
      standardDauer={Math.min(120, Math.max(6, Number(p?.dauer) || 15))}
      energie={p?.energie !== "0"}
      hell={p?.hell === "1"}
    />
  );
}
