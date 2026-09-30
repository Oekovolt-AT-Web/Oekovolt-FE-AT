import Link from "next/link";
import { ArrowLeft, BadgeCheck, FileBarChart2, Share2 } from "lucide-react";
import { cn } from "@/components/ui/cn";

const PUNKTE = [
  { id: "siegel", label: "Solar-Siegel", icon: BadgeCheck },
  { id: "teilen", label: "Social-Media-Kit", icon: Share2 },
  { id: "esg", label: "ESG-Kurzbericht", icon: FileBarChart2 },
];

/** Umschalter zwischen den Kit-Seiten + Rückweg zur Projektseite */
export default function KitNavigation({ slug, aktiv, titel }) {
  const basis = `/referenzen/projekte/${slug}`;
  return (
    <nav aria-label="Solar-Kit" className="border-b border-ink-200/70 bg-white print:hidden">
      <div className="ov-container flex flex-wrap items-center justify-between gap-3 py-3">
        <Link href={basis} className="inline-flex items-center gap-2 text-[14px] font-semibold text-ink-600 hover:text-ink-900">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span className="max-w-[46ch] truncate">Zum Projekt {titel}</span>
        </Link>
        <ul className="-mx-1 flex gap-1 overflow-x-auto">
          {PUNKTE.map((p) => (
            <li key={p.id}>
              <Link
                href={`${basis}/${p.id}`}
                aria-current={aktiv === p.id ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-colors",
                  aktiv === p.id ? "bg-navy-950 text-white" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                )}
              >
                <p.icon aria-hidden="true" className="h-4 w-4" />
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
