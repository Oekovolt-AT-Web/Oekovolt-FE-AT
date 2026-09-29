import { ChevronDown } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * „Für Technik & Einkauf“: Fachdetails (Tabellen, Normen) eingeklappt, aber
 * vollständig im Server-HTML (SEO). Natives <details> – ohne JavaScript bedienbar.
 * items: [{ id, icon?, titel, kurz?, inhalt (JSX), offen? }]
 */
export default function FachAkkordeon({ items = [], dunkel = false, className }) {
  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <details
            key={it.id || it.titel}
            id={it.id}
            open={it.offen}
            className={cn(
              "group scroll-mt-28 overflow-hidden rounded-3xl transition-shadow duration-300",
              dunkel ? "bg-white/[0.04] ring-1 ring-white/10 open:bg-white/[0.06]" : "bg-white ring-1 ring-ink-200/70 open:shadow-xl"
            )}
          >
            <summary className="flex min-h-[72px] cursor-pointer list-none items-center gap-4 px-5 py-4 md:px-7 [&::-webkit-details-marker]:hidden">
              {Icon && (
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", dunkel ? "bg-ov-500/15 text-ov-300" : "bg-ov-50 text-ov-600")}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className={cn("block font-display text-[17px] font-bold leading-snug md:text-[18px]", dunkel ? "text-white" : "text-ink-900")}>{it.titel}</span>
                {it.kurz && <span className={cn("mt-0.5 block text-[13.5px] leading-snug", dunkel ? "text-white/55" : "text-ink-500")}>{it.kurz}</span>}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-open:rotate-180",
                  dunkel ? "bg-white/10 text-white" : "bg-ink-50 text-ink-700 ring-1 ring-ink-200"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </summary>
            <div className={cn("px-5 pb-6 md:px-7 md:pb-8", dunkel ? "text-white/80" : "text-ink-700")}>{it.inhalt}</div>
          </details>
        );
      })}
    </div>
  );
}

/** Kompakte Tabelle für Akkordeon-Inhalte – auf Mobil horizontal scrollbar. */
export function FachTabelle({ kopf = [], zeilen = [], caption, minBreite = 620 }) {
  return (
    <div tabIndex={0} role="region" aria-label={caption} className="overflow-x-auto rounded-2xl ring-1 ring-ink-200/70">
      <table className="w-full border-collapse text-left text-[14.5px]" style={{ minWidth: minBreite }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-navy-950 text-white">
            {kopf.map((k) => (
              <th key={k} scope="col" className="px-4 py-3 font-semibold">
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 bg-white">
          {zeilen.map((z, zi) => (
            <tr key={typeof z[0] === "string" ? z[0] : zi}>
              {z.map((zelle, j) =>
                j === 0 ? (
                  <th key={j} scope="row" className="px-4 py-3 align-top font-semibold text-ink-900">
                    {zelle}
                  </th>
                ) : (
                  <td key={j} className="px-4 py-3 align-top leading-relaxed text-ink-600">
                    {zelle}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
