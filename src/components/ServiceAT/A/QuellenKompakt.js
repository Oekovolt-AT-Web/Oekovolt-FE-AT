import { BookOpen, ChevronDown, ExternalLink } from "lucide-react";

/**
 * Quellen & Rechtsgrundlagen als einklappbarer Block am Seitenende. Inhalt ist
 * server-gerendert im DOM (zitierfähig), visuell eingeklappt; der Bildnachweis
 * bleibt immer sichtbar (Namensnennung CC BY).
 *
 * items: [{ titel, href?, hinweis? }]
 */
export default function QuellenKompakt({ items = [], stand = "September 2026", titel = "Quellen, Normen & Rechtsgrundlagen", bildnachweis }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="quellen-titel" className="bg-white">
      <div className="ov-container py-10 md:py-12">
        <details className="group rounded-3xl bg-sand-50 ring-1 ring-ink-200/60 open:bg-white open:shadow-lg">
          <summary className="flex cursor-pointer list-none items-center gap-4 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200/70">
              <BookOpen aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <h2 id="quellen-titel" className="font-display text-[17px] font-bold text-ink-900 md:text-[18px]">
                {titel} <span className="ov-num font-semibold text-ink-400">({items.length})</span>
              </h2>
              <span className="block text-[13px] text-ink-500">Stand: {stand} · Angaben ohne Gewähr, keine Rechtsberatung</span>
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-ink-200 transition-transform duration-300 group-open:rotate-180">
              <ChevronDown aria-hidden="true" className="h-4 w-4" />
            </span>
          </summary>
          <ol className="grid gap-x-8 gap-y-2.5 border-t border-ink-200/70 px-5 pb-6 pt-5 text-[14.5px] leading-relaxed md:grid-cols-2 md:px-6">
            {items.map((q, i) => (
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
        {bildnachweis && <p className="mt-4 px-1 text-[12.5px] leading-relaxed text-ink-500">Bildnachweis: {bildnachweis}</p>}
      </div>
    </section>
  );
}
