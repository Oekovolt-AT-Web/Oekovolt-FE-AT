import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Redaktionelle Links im Inhalt (Technik, Lösungen, Ratgeber) mit sprechendem
 * Ankertext. Ergänzt die kuratierten Querverweise am Seitenende.
 * items: [{ href, titel, text, art? }]  art: "Technik" | "Ratgeber" | "Lösung" | "Service"
 */
export default function Weiterlesen({ titel = "Weiterführend", items = [], className }) {
  if (!items.length) return null;
  return (
    <nav aria-label={titel} className={cn("min-w-0", className)}>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">{titel}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it, i) => (
          <Reveal as="li" key={it.href} delay={i * 50} className="flex">
            <Link
              href={it.href}
              className="group flex w-full items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 transition-all hover:ring-ov-300"
            >
              <span className="min-w-0 flex-1">
                {it.art && <span className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-500">{it.art}</span>}
                <span className="block font-display text-[16px] font-bold leading-snug text-ink-900 group-hover:text-ov-700">{it.titel}</span>
                {it.text && <span className="mt-1 block text-[14px] leading-relaxed text-ink-600">{it.text}</span>}
              </span>
              <ArrowRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ov-600" />
            </Link>
          </Reveal>
        ))}
      </ul>
    </nav>
  );
}
