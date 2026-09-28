import { KARTE_PFADE, KARTE_VIEWBOX } from "@/components/Forderungen/Shared/kartePfade";
import { cn } from "@/components/ui/cn";

/**
 * Statische Österreichkarte (Server) mit hervorgehobenem Bundesland –
 * Orientierung auf den Landesseiten.
 */
export default function MiniKarte({ landKey, landName, className }) {
  const reihenfolge = Object.keys(KARTE_PFADE).sort((a, b) => (a === landKey ? 1 : b === landKey ? -1 : 0));
  const ziel = KARTE_PFADE[landKey];

  return (
    <svg viewBox={KARTE_VIEWBOX} className={cn("h-auto w-full", className)} role="img" aria-label={landName ? `Lage von ${landName} in Österreich` : "Lage des Bundeslandes in Österreich"}>
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
      {ziel && <circle cx={ziel.cx} cy={ziel.cy} r={4.5} className="fill-white stroke-ov-700" strokeWidth={2} />}
    </svg>
  );
}
