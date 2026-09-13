import { KARTE_PFADE, KARTE_VIEWBOX, projiziere } from "@/components/Forderungen/Shared/kartePfade";
import { cn } from "@/components/ui/cn";

/**
 * Statische Deutschlandkarte (Server) mit hervorgehobenem Bundesland und
 * optionaler Ortsmarkierung – Orientierung auf den Detailseiten.
 */
export default function MiniKarte({ landKey, marker, markerLabel, className }) {
  const reihenfolge = Object.keys(KARTE_PFADE).sort((a, b) => (a === landKey ? 1 : b === landKey ? -1 : 0));
  const punkt = marker ? projiziere(marker[0], marker[1]) : null;
  const ziel = KARTE_PFADE[landKey];

  return (
    <svg viewBox={KARTE_VIEWBOX} className={cn("h-auto w-full", className)} role="img" aria-label={markerLabel ? `Lage von ${markerLabel} in Deutschland` : "Lage des Bundeslandes in Deutschland"}>
      {reihenfolge.map((key) => (
        <path
          key={key}
          d={KARTE_PFADE[key].d}
          fillRule="evenodd"
          strokeLinejoin="round"
          className={key === landKey ? "fill-ov-500 stroke-white" : "fill-ink-200/80 stroke-white"}
          strokeWidth={key === landKey ? 1.6 : 1}
        />
      ))}
      {punkt ? (
        <g>
          <circle cx={punkt[0]} cy={punkt[1]} r={18} className="fill-navy-700/15" />
          <circle cx={punkt[0]} cy={punkt[1]} r={7} className="fill-navy-700 stroke-white" strokeWidth={2.5} />
        </g>
      ) : (
        ziel && <circle cx={ziel.cx} cy={ziel.cy} r={5} className="fill-white stroke-ov-700" strokeWidth={2} />
      )}
    </svg>
  );
}
