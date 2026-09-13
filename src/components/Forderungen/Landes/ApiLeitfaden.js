import { Check } from "lucide-react";
import Section from "@/components/ui/Section";
import Reveal from "@/components/ui/Reveal";
import { generateSlug } from "@/lib/slugify";

/**
 * Redaktioneller Leitfaden aus dem Backoffice (table_data_forderungen_content)
 * als gegliederter Artikel mit Inhaltsverzeichnis.
 *
 * Felder je Abschnitt: firstcard_subtitle (Überschrift), title_options,
 * first_card_description / second_card_description (Absätze),
 * forderungen_text [{ primary_paragraph, secondary_paragraph }] (Punkte).
 * Der Abschnitt „Die Komplettlösung von oekovolt.de“ wird ausgelassen –
 * dafür steht am Seitenende das CTA-Band.
 */
export default function ApiLeitfaden({ item, ortsname }) {
  const intro = item?.forderungen_text?.[0];
  const abschnitte = (item?.table_data_forderungen_content || []).filter(
    (c) => c && !/komplettlösung|oekovolt\.de/i.test(c.firstcard_subtitle || c.firstcard_title || "")
  );
  if (!abschnitte.length) return null;

  const mitId = abschnitte.map((c, i) => {
    const titel = (c.firstcard_subtitle || c.firstcard_title || `Abschnitt ${i + 1}`).replace(/:\s*$/, "");
    return { ...c, titel, id: `leitfaden-${generateSlug(titel).slice(0, 48) || i}` };
  });

  return (
    <Section tone="white" space="lg">
      <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16 xl:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
            Leitfaden {ortsname}
          </p>
          <nav aria-label="Inhalt des Leitfadens" className="mt-5">
            <ol className="space-y-1 border-l border-ink-200">
              {mitId.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="-ml-px block border-l-2 border-transparent py-2 pl-4 text-[14.5px] leading-snug text-ink-600 transition-colors hover:border-ov-500 hover:text-ink-900"
                  >
                    {c.titel.replace(/^\d+\.\s*/, "")}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0">
          {intro?.primary_paragraph && (
            <Reveal>
              <h2 className="ov-h2 text-ink-900">{intro.primary_paragraph}</h2>
            </Reveal>
          )}
          <div className="mt-10 space-y-12">
            {mitId.map((c, i) => (
              <Reveal as="section" key={c.id} id={c.id} className="scroll-mt-28" aria-labelledby={`${c.id}-h`}>
                <div className="flex items-baseline gap-4">
                  <span aria-hidden="true" className="ov-num font-display text-[15px] font-bold text-ov-500">{String(i + 1).padStart(2, "0")}</span>
                  <h3 id={`${c.id}-h`} className="font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-extrabold leading-tight tracking-tight text-ink-900">
                    {c.titel.replace(/^\d+\.\s*/, "")}
                  </h3>
                </div>
                <div className="mt-4 border-l border-ink-200 pl-6 md:ml-[11px] md:pl-9">
                  {c.title_options && <p className="font-semibold text-ov-700">{c.title_options}</p>}
                  {c.first_card_description && <p className="whitespace-pre-line text-[16.5px] leading-relaxed text-ink-600">{c.first_card_description}</p>}
                  {c.forderungen_text?.length > 0 && (
                    <ul className="mt-5 grid gap-3">
                      {c.forderungen_text.map((t, j) => (
                        <li key={j} className="flex gap-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-100 text-ov-700">
                            <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                          <div className="min-w-0">
                            {t.primary_paragraph && <p className="font-semibold text-ink-900">{t.primary_paragraph.replace(/:\s*$/, "")}</p>}
                            {t.secondary_paragraph && <p className="mt-1 whitespace-pre-line text-[15.5px] leading-relaxed text-ink-600">{t.secondary_paragraph}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.second_card_description && <p className="mt-5 whitespace-pre-line text-[16.5px] leading-relaxed text-ink-600">{c.second_card_description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
        </article>
      </div>
    </Section>
  );
}
