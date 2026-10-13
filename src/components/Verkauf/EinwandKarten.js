// src/components/Verkauf/EinwandKarten.js
//
// Einwand-Akkordeon (Welle A, Paket A03) – Server-Komponente auf <details>-Basis (ohne JavaScript
// bedienbar, Antworten vollständig im HTML). Je Einwand: Antwort, Beleg und nächster Schritt.
// Dazu FAQPage-JSON-LD, dessen Text exakt dem sichtbaren Text entspricht (einwandAntwortText).
//
// Props: { gruppe: "gewerbe"|"landwirtschaft"|"kommunen"|"freiflaeche", ids?: string[], mitSchema = true,
//          titel?: string | false, rahmen?: true | Ton }
// titel: Standard je Gruppe (EINWAND_TITEL); titel={false} lässt Eyebrow und Überschrift weg, wenn die
// Seite schon eine eigene SectionHeading darüber setzt (sonst doppelte Überschrift).
// rahmen: eigener Seitenabschnitt mit ov-container – für Seiten ohne umgebende <Section>.
// Seiten mit eigener FAQ setzen mitSchema={false}, damit nur EIN FAQPage-Schema je Seite entsteht.
// Ohne Treffer: null.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EINWAND_TITEL, einwaendeFuer, einwaendeSchema } from "@/data/einwaende";
import { cn } from "@/components/ui/cn";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";

const extern = (href) => /^https?:/.test(String(href || ""));

function Verweis({ href, className, children }) {
  if (extern(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function EinwandKarten({ gruppe, ids, mitSchema = true, titel, rahmen, className, headingAs: H = "h2" }) {
  const liste = einwaendeFuer(gruppe, ids);
  if (!liste.length) return null;
  const schema = mitSchema ? einwaendeSchema(liste) : null;
  const gruppeName = `einwaende-${gruppe || "alle"}`;
  const kopf = titel !== false;
  const titelText = titel || EINWAND_TITEL[gruppe] || EINWAND_TITEL.gewerbe;

  const inhalt = (
    <section aria-labelledby={kopf ? `${gruppeName}-titel` : undefined} aria-label={kopf ? undefined : "Einwände und Antworten"} className={cn("relative", className)}>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      {kopf && (
        <div className="mb-8 max-w-3xl">
          <Eyebrow className="mb-4">Einwände</Eyebrow>
          <H id={`${gruppeName}-titel`} className="ov-h2 text-ink-900">
            {titelText}
          </H>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {liste.map((e, i) => (
          <details key={e.id} id={`einwand-${e.id}`} name={gruppeName} open={i === 0} className="group rounded-[1.35rem] bg-white ring-1 ring-ink-200/70 open:shadow-[0_22px_48px_-26px_rgba(15,23,42,0.24)] open:ring-ov-300/70">
            <summary className="flex min-h-11 cursor-pointer list-none items-start gap-4 rounded-[1.35rem] px-5 py-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-600 md:px-6 [&::-webkit-details-marker]:hidden">
              <span className="ov-num mt-[3px] w-6 shrink-0 font-display text-[13px] font-bold tracking-[0.04em] text-ink-500 group-open:text-ov-700">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 font-display text-[16.5px] font-bold leading-snug tracking-[-0.015em] text-ink-900 md:text-[18px]">„{e.einwand}“</span>
              <span aria-hidden="true" className="relative -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-inset ring-ink-200 group-open:bg-ov-600 group-open:text-white group-open:ring-ov-600">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M3 8h10" />
                  <path className="group-open:hidden" d="M8 3v10" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-6 text-[15.5px] leading-[1.7] text-ink-600 sm:pl-[3.75rem] md:pb-7 md:pl-[4.25rem] md:pr-16 md:text-[16px]">
              <div className="max-w-[64ch]">
                <p>{e.antwort}</p>
                <p className="mt-3 text-[14px] text-ink-500">
                  <span className="font-semibold text-ink-700">Beleg:</span>{" "}
                  {e.belegHref ? (
                    <Verweis href={e.belegHref} className="underline decoration-ov-300 underline-offset-2 hover:text-ov-700">
                      {e.beleg}
                    </Verweis>
                  ) : (
                    e.beleg
                  )}
                </p>
                <p className="mt-3">
                  <span className="font-semibold text-ink-700">Nächster Schritt:</span>{" "}
                  <Verweis href={e.schritt.href} className="inline-flex items-center gap-1 font-semibold text-ov-700 underline-offset-2 hover:underline">
                    {e.schritt.label}
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Verweis>
                  .
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );

  if (!rahmen) return inhalt;
  return (
    <Section as="div" tone={typeof rahmen === "string" ? rahmen : "white"} space="md" id={`einwaende-${gruppe || "alle"}-abschnitt`} className="scroll-mt-24">
      {inhalt}
    </Section>
  );
}
