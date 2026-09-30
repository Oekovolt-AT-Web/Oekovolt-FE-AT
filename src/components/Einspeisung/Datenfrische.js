import { ArrowUpRight, CircleAlert } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { NAECHSTE_VEROEFFENTLICHUNG, QUELLEN, STAND } from "@/data/oemag";
import { datenFrische, letzterMonat, monatLabel } from "@/lib/einspeisung";

/**
 * Datenfrische der Marktwerte: Prüfdatum, jüngster Monatswert, nächste Veröffentlichung.
 * Warnt, sobald das Prüfdatum länger als FRISCHE_GRENZE_TAGE (35) zurückliegt.
 * Server-Komponente – `jetzt` kommt von der Seite (stündlich neu gerendert), damit kein
 * Datumsunterschied zwischen Server und Browser entsteht.
 */
export default function Datenfrische({ jetzt, dark = false, kompakt = false, className }) {
  const { tage, veraltet, grenze } = datenFrische(STAND.geprueftAm, jetzt);
  const letzter = letzterMonat();
  const seit = tage === 0 ? "heute" : tage === 1 ? "vor 1 Tag" : `vor ${tage} Tagen`;

  return (
    <div
      className={cn(
        "rounded-2xl text-[13.5px] leading-relaxed",
        dark ? "ov-glass text-white/80" : "bg-white text-ink-600 ring-1 ring-ink-200/70",
        kompakt ? "px-4 py-3" : "p-5",
        className
      )}
    >
      <p className="flex items-center gap-2 font-semibold">
        <span aria-hidden="true" className={cn("relative flex h-2.5 w-2.5 shrink-0 rounded-full", veraltet ? "bg-sun-500" : "bg-ov-400")}>
          {!veraltet && <span className="absolute inset-0 rounded-full bg-ov-400 motion-safe:animate-ping" />}
        </span>
        <span className={dark ? "text-white" : "text-ink-900"}>
          Werte geprüft am {STAND.label}
          {Number.isFinite(tage) && tage >= 0 && <span className={cn("font-normal", dark ? "text-white/60" : "text-ink-500")}> ({seit})</span>}
        </span>
      </p>
      <p className="mt-1">
        Jüngster OeMAG-Wert: <strong className={dark ? "text-white" : "text-ink-900"}>{monatLabel(letzter.monat)}</strong>
        {!kompakt && <> · {NAECHSTE_VEROEFFENTLICHUNG.was} erwartet {NAECHSTE_VEROEFFENTLICHUNG.wann}</>}
      </p>
      {veraltet && (
        <p role="status" className={cn("mt-3 flex gap-2 rounded-xl p-3", dark ? "bg-sun-400/15 text-white" : "bg-sun-300/30 text-ink-800")}>
          <CircleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" />
          <span>
            Die Werte wurden seit mehr als {grenze} Tagen nicht geprüft – inzwischen sind wahrscheinlich neue Monatswerte erschienen.
            Maßgeblich ist die{" "}
            <a href={QUELLEN.oemag.url} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
              Veröffentlichung der OeMAG
              <ArrowUpRight aria-hidden="true" className="ml-0.5 inline h-3.5 w-3.5" />
              <span className="sr-only"> (externer Link, neues Fenster)</span>
            </a>
            .
          </span>
        </p>
      )}
    </div>
  );
}
