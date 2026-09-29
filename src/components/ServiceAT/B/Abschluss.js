import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Kompakter Seitenabschluss: weiterführende Links als Chips (sprechender
 * Ankertext) und Quellen als eingeklappte Liste – server-gerendert, SEO bleibt,
 * die Seite wird aber nicht um zwei Bildschirmhöhen länger.
 *
 * props:
 *  links    [{ href, titel, art? }]
 *  quellen  [{ titel, href?, hinweis? }]
 *  stand    „September 2026“
 */
export default function Abschluss({ links = [], quellen = [], stand = "September 2026", linkTitel = "Weiterführend", quellenTitel = "Quellen & Rechtsgrundlagen", className }) {
  if (!links.length && !quellen.length) return null;
  return (
    <section className={cn("bg-white", className)} aria-label="Weiterführende Links und Quellen">
      <div className="ov-container grid gap-8 py-12 md:py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-12">
        {links.length > 0 && (
          <Reveal as="nav" aria-label={linkTitel} className="min-w-0">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              {linkTitel}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-sand-50 py-2 pl-4 pr-3 text-[14.5px] font-semibold text-ink-800 ring-1 ring-ink-200/70 transition-all hover:bg-white hover:text-ov-700 hover:ring-ov-300"
                  >
                    {l.art && <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 group-hover:text-ov-600">{l.art}</span>}
                    {l.titel}
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-ov-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        {quellen.length > 0 && (
          <Reveal delay={80} className="min-w-0">
            <details className="group rounded-3xl bg-sand-50 ring-1 ring-ink-200/60">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block font-display text-[17px] font-bold text-ink-900">
                    {quellenTitel} <span className="font-medium text-ink-400">({quellen.length})</span>
                  </span>
                  <span className="mt-0.5 block text-[13px] text-ink-500">Stand: {stand} · Angaben ohne Gewähr, keine Rechtsberatung</span>
                </span>
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[18px] text-ink-600 ring-1 ring-ink-200 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <ol className="space-y-2.5 px-5 pb-6 text-[14px] leading-relaxed md:px-6">
                {quellen.map((q, i) => (
                  <li key={q.href || q.titel} className="flex gap-2.5">
                    <span className="ov-num mt-px shrink-0 font-semibold text-ov-700">[{i + 1}]</span>
                    <span className="min-w-0">
                      {q.href ? (
                        <a href={q.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-800 underline decoration-ink-300 underline-offset-2 [overflow-wrap:anywhere] hover:text-ov-700 hover:decoration-current">
                          {q.titel}
                          <ExternalLink aria-hidden="true" className="ml-1 inline h-3.5 w-3.5 align-[-2px] text-ink-400" />
                        </a>
                      ) : (
                        <span className="font-medium text-ink-800">{q.titel}</span>
                      )}
                      {q.hinweis && <span className="text-ink-500"> – {q.hinweis}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </details>
          </Reveal>
        )}
      </div>
    </section>
  );
}
