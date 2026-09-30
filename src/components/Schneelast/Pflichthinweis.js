import { AlertTriangle } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Pflichthinweis zu jedem angezeigten Schneelast-Richtwert (/schneelast, /schneelast/[bundesland]).
 * Wortlaut bewusst fest: Richtwert aus GeoSphere SNOWGRID-CL, kein Normwert, keine Statik, Normwert in eHORA.
 */
export default function Pflichthinweis({ className, dunkel = false }) {
  return (
    <p
      className={cn(
        "flex gap-2.5 rounded-2xl px-4 py-3 text-[13px] leading-relaxed",
        dunkel ? "bg-white/[0.06] text-white/75 ring-1 ring-white/15" : "bg-sun-300/15 text-ink-800 ring-1 ring-sun-400/45",
        className
      )}
    >
      <AlertTriangle aria-hidden="true" className={cn("mt-0.5 h-4 w-4 shrink-0", dunkel ? "text-sun-300" : "text-sun-500")} />
      <span>
        <strong className={dunkel ? "text-white" : "text-ink-900"}>Richtwert, kein Normwert:</strong> Richtwert aus GeoSphere SNOWGRID-CL (CC BY 4.0), kein Normwert nach ÖNORM B 1991-1-3, ersetzt keine Statik.
        Den Normwert finden Sie in{" "}
        <a
          href="https://hora.gv.at/#/cschneelast"
          target="_blank"
          rel="noopener noreferrer"
          className={cn("font-semibold underline underline-offset-2", dunkel ? "text-white decoration-white/40 hover:decoration-white" : "text-ink-900 decoration-ink-300 hover:decoration-ink-700")}
        >
          eHORA<span className="sr-only"> (öffnet hora.gv.at in neuem Tab)</span>
        </a>
        .
      </span>
    </p>
  );
}
