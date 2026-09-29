import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Tool-Karte für den Rechner-Hub (/rechner). Server-Komponente.
 * ton:   hell | sand | glas (auf dunklem Grund) | navy | gruen
 * form:  normal | gross (Titel größer, Vorschau unten) | breit (Text links, Vorschau rechts)
 * Fehlt das Tool (z. B. Route entsteht noch), rendert die Karte nichts.
 */
export default function HubKarte({ tool, ton = "hell", form = "normal", kennzahlen, mobilVorschau = false, children, className }) {
  if (!tool) return null;
  const Icon = tool.icon;
  const dunkel = ton === "glas" || ton === "navy" || ton === "gruen";
  const breit = form === "breit";
  const gross = form === "gross" || breit;
  const toene = {
    hell: "bg-white ring-1 ring-ink-200/70 shadow-[0_24px_48px_-32px_rgba(3,18,43,0.35)] hover:ring-ov-300",
    sand: "bg-sand-50 ring-1 ring-ink-200/70 shadow-[0_24px_48px_-32px_rgba(3,18,43,0.3)] hover:ring-ov-300",
    glas: "ov-glass text-white hover:bg-white/[0.11]",
    navy: "ov-noise bg-navy-900 text-white ring-1 ring-white/10 shadow-[0_24px_48px_-24px_rgba(3,18,43,0.6)]",
    gruen: "bg-gradient-to-br from-ov-500 to-ov-700 text-white shadow-[0_30px_60px_-30px_rgba(67,102,33,0.7)]",
  };
  return (
    <Link
      href={tool.href}
      className={cn(
        "group ov-card-hover relative flex h-full w-full overflow-hidden rounded-3xl p-6 md:p-7",
        breit ? "flex-col gap-7 lg:flex-row lg:items-stretch lg:gap-10" : "flex-col",
        toene[ton],
        className
      )}
    >
      <div className={cn("relative flex flex-col", breit && "lg:w-[38%] lg:shrink-0")}>
        <div className="flex items-start justify-between gap-4">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300",
              dunkel ? "bg-white/10 text-ov-300 ring-1 ring-white/15" : "bg-ov-50 text-ov-600 ring-1 ring-ov-100 group-hover:bg-ov-500 group-hover:text-white",
              ton === "gruen" && "text-white"
            )}
          >
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          {tool.tag && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
                tool.tag === "Live" ? "bg-sun-400 text-navy-950" : tool.tag === "Neu" ? (dunkel ? "bg-ov-400 text-navy-950" : "bg-ov-600 text-white") : dunkel ? "bg-white/10 text-white" : "bg-ink-900 text-white"
              )}
            >
              {tool.tag}
            </span>
          )}
        </div>
        <h3 className={cn("mt-5 font-display font-extrabold leading-tight tracking-tight", gross ? "text-[24px] md:text-[30px]" : "text-[20px]", dunkel ? "text-white" : "text-ink-900")}>{tool.titel}</h3>
        <p className={cn("mt-2 leading-relaxed", gross ? "text-[15.5px]" : "text-[14.5px]", dunkel ? "text-white/70" : "text-ink-600")}>{gross ? tool.text : tool.kurz}</p>
        {kennzahlen && (
          <dl className="mt-5 grid grid-cols-3 gap-2">
            {kennzahlen.map(([k, v]) => (
              <div key={k} className={cn("rounded-2xl p-3", dunkel ? "bg-white/5 ring-1 ring-white/10" : "bg-sand-50 ring-1 ring-ink-200/60")}>
                <dt className={cn("text-[11.5px] leading-tight", dunkel ? "text-white/60" : "text-ink-500")}>{k}</dt>
                <dd className={cn("ov-num mt-1 whitespace-nowrap font-display text-[15px] font-extrabold tracking-tight min-[400px]:text-[17px]", dunkel ? "text-white" : "text-ink-900")}>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {breit && <Oeffnen dunkel={dunkel} className="mt-auto hidden pt-6 lg:flex" />}
      </div>
      {children && (
        <div className={cn("relative", breit ? "flex min-w-0 flex-1 flex-col justify-center" : cn("mt-6 flex-1 flex-col justify-end", mobilVorschau ? "flex" : "hidden sm:flex"))}>{children}</div>
      )}
      <Oeffnen dunkel={dunkel} className={cn("flex", breit ? "lg:hidden" : "mt-5")} />
    </Link>
  );
}

function Oeffnen({ dunkel, className }) {
  return (
    <span className={cn("relative items-center gap-1.5 text-[14.5px] font-semibold", dunkel ? "text-ov-300" : "text-ov-700", className)}>
      Öffnen
      <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </span>
  );
}
