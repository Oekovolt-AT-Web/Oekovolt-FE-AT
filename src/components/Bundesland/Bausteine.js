// Kleine Bausteine der Bundesland-Hubseiten (Server-Komponenten).

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/components/ui/cn";

/** Externer Link mit Hinweis für Screenreader. */
export function ExternerLink({ href, children, className, dunkel = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center gap-1 font-semibold underline underline-offset-2 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2",
        dunkel ? "text-ov-300 decoration-ov-300/50" : "text-ov-700 decoration-ov-300",
        className
      )}
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      <span className="sr-only">(öffnet neues Fenster)</span>
    </a>
  );
}

/** Interner Pfeil-Link (Querverweis). */
export function PfeilLink({ href, children, icon: Icon = ArrowRight, className, dunkel = false }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold underline underline-offset-4 hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2",
        dunkel ? "text-white decoration-white/40" : "text-ov-700 decoration-ov-300",
        className
      )}
    >
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      {children}
    </Link>
  );
}

/** Kleines Etikett (Zielgruppe, Status). */
export function Etikett({ children, ton = "hell" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold",
        ton === "hell" && "bg-sand-50 text-ink-700 ring-1 ring-ink-200",
        ton === "gruen" && "bg-ov-50 text-ov-800 ring-1 ring-ov-200",
        ton === "sonne" && "bg-sun-300/30 text-ink-800 ring-1 ring-sun-400/60"
      )}
    >
      {children}
    </span>
  );
}
