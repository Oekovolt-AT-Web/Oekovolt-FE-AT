import { ExternalLink } from "lucide-react";
import Section from "@/components/ui/Section";

/**
 * Quellen- und Rechtsgrundlagen-Liste am Seitenende.
 * items: [{ titel, href, hinweis? }]
 * stand: z. B. "September 2026"
 */
export default function Quellen({ items = [], stand = "September 2026", titel = "Quellen & Rechtsgrundlagen" }) {
  if (!items.length) return null;
  return (
    <Section tone="white" space="sm" aria-labelledby="quellen-titel">
      <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="quellen-titel" className="font-display text-[19px] font-bold text-ink-900">
            {titel}
          </h2>
          <p className="text-[13px] text-ink-500">Stand: {stand} · Angaben ohne Gewähr, keine Rechtsberatung</p>
        </div>
        <ol className="mt-5 grid gap-x-8 gap-y-2.5 text-[14.5px] leading-relaxed md:grid-cols-2">
          {items.map((q, i) => (
            <li key={q.href || q.titel} className="flex gap-2.5">
              <span className="ov-num mt-px shrink-0 font-semibold text-ov-700">[{i + 1}]</span>
              <span className="min-w-0">
                {q.href ? (
                  <a href={q.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-800 underline decoration-ink-300 underline-offset-2 hover:text-ov-700 hover:decoration-current">
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
      </div>
    </Section>
  );
}
