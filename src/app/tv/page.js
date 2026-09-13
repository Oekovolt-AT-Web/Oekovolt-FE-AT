import TvAnzeige from "@/components/Kanaele/TvAnzeige";
import { tvEintraege } from "@/lib/kanaele/tv";

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
 */
export default async function TvSeite({ searchParams }) {
  const p = await searchParams;
  const standort = String(p?.standort || "").slice(0, 60);
  const start = await tvEintraege({ standort });
  return (
    <TvAnzeige
      start={start}
      standort={standort}
      standardDauer={Math.min(120, Math.max(6, Number(p?.dauer) || 15))}
      energie={p?.energie !== "0"}
      hell={p?.hell === "1"}
    />
  );
}
