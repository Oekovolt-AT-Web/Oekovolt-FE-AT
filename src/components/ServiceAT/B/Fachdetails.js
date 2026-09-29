import { ChevronDown } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * „Für Technik & Einkauf“: Detailtabellen und Normtexte bleiben server-gerendert
 * im DOM (SEO), sind aber visuell eingeklappt. <details> funktioniert ohne JS.
 *
 * items: [{ titel, kurz?, icon? (Lucide-Komponente), inhalt (JSX), offen? }]
 */
export default function Fachdetails({ items = [], dunkel = false, className }) {
  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <Reveal key={it.titel} delay={(i % 5) * 60}>
            <details
              open={it.offen || undefined}
              className={cn(
                "group overflow-hidden rounded-3xl ring-1 transition-shadow duration-300",
                dunkel ? "bg-white/[0.04] ring-white/10 open:bg-white/[0.06]" : "bg-white ring-ink-200/70 open:shadow-xl"
              )}
            >
              <summary className={cn("flex cursor-pointer list-none items-center gap-4 p-5 md:px-7 md:py-6 [&::-webkit-details-marker]:hidden", dunkel ? "hover:bg-white/[0.04]" : "hover:bg-sand-50")}>
                {Icon && (
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", dunkel ? "bg-white/10 text-ov-300" : "bg-ov-50 text-ov-600")}>
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className={cn("block font-display text-[17px] font-bold leading-snug md:text-[18px]", dunkel ? "text-white" : "text-ink-900")}>{it.titel}</span>
                  {it.kurz && <span className={cn("mt-0.5 block text-[14px] leading-snug", dunkel ? "text-white/55" : "text-ink-500")}>{it.kurz}</span>}
                </span>
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-open:rotate-180",
                    dunkel ? "bg-white/10 text-white" : "bg-ink-100 text-ink-700 group-open:bg-ov-500 group-open:text-white"
                  )}
                >
                  <ChevronDown aria-hidden="true" className="h-4 w-4" />
                </span>
              </summary>
              <div className={cn("border-t px-5 pb-6 pt-5 md:px-7 md:pb-7", dunkel ? "border-white/10" : "border-ink-100")}>{it.inhalt}</div>
            </details>
          </Reveal>
        );
      })}
    </div>
  );
}
