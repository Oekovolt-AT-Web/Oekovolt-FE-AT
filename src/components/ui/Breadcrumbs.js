import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "./cn";

const BASE = "https://www.oekovolt.com";

/**
 * Brotkrumen – sichtbar UND als BreadcrumbList-Schema.
 * items: [{ name, href }] – der letzte Eintrag ist die aktuelle Seite.
 */
export default function Breadcrumbs({ items = [], dark = false, className, schema = true }) {
  const alle = [{ name: "Startseite", href: "/" }, ...items];
  // Schema: Google verlangt `item` für jeden Eintrag außer dem letzten. Reine
  // Gliederungsstufen ohne eigene Seite (z. B. „Service“) bleiben deshalb nur
  // sichtbar und fehlen im Schema; die Positionen werden fortlaufend neu gezählt.
  const imSchema = alle.filter((it, i) => it.href || i === alle.length - 1);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: imSchema.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.href ? { item: `${BASE}${it.href === "/" ? "" : it.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Brotkrumen" className={cn("text-[13px]", className)}>
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ol className="flex flex-wrap items-center gap-1.5">
        {alle.map((it, i) => {
          const letzte = i === alle.length - 1;
          return (
            <li key={`${it.name}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight aria-hidden="true" className={cn("h-3.5 w-3.5", dark ? "text-white/35" : "text-ink-300")} />
              )}
              {letzte || !it.href ? (
                <span aria-current={letzte ? "page" : undefined} className={dark ? "text-white/90" : "text-ink-800 font-medium"}>
                  {it.name}
                </span>
              ) : (
                <Link
                  href={it.href}
                  className={cn(
                    "transition-colors",
                    dark ? "text-white/60 hover:text-white" : "text-ink-500 hover:text-ov-600"
                  )}
                >
                  {it.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
