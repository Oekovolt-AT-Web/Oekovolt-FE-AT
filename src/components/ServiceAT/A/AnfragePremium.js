import { Check, Mail, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FIRMA } from "@/lib/site";
import ServiceAnfrage from "@/components/ServiceAT/ServiceAnfrage";

/**
 * Prominente Anfrage-Sektion (#anfrage) auf dunklem Grund: links Nutzen,
 * Ablauf und direkter Kontakt, rechts das bestehende Service-Formular als
 * helle Karte. Gleiche Props wie ServiceAT/AnfrageSektion, plus `vorteile`.
 */
export default function AnfragePremium({ eyebrow = "Anfrage", titel, lead, schritte = [], schritteTitel, vorteile = [], formular, id = "anfrage" }) {
  return (
    <section id={id} className="ov-noise relative scroll-mt-24 overflow-hidden bg-navy-950 py-20 text-white md:py-28">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-ov-500/25 blur-[130px]" />
      <div aria-hidden="true" className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[130px]" />
      <div className="ov-container relative grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Eyebrow dark className="mb-4">{eyebrow}</Eyebrow>
            <h2 className="ov-h2 text-white">{titel}</h2>
            {lead && <p className="ov-lead mt-5 text-white/70">{lead}</p>}
          </Reveal>
          {vorteile.length > 0 && (
            <Reveal delay={80} as="ul" className="mt-7 grid gap-2.5">
              {vorteile.map((v) => (
                <li key={v} className="flex gap-3 text-[15.5px] leading-snug text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-500 text-white">
                    <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {v}
                </li>
              ))}
            </Reveal>
          )}
          {schritte.length > 0 && (
            <Reveal delay={140}>
              {schritteTitel && <h3 className="mt-9 font-display text-[18px] font-bold text-white">{schritteTitel}</h3>}
              <ol className={`relative space-y-5 border-l border-white/15 pl-6 ${schritteTitel ? "mt-5" : "mt-9"}`}>
                {schritte.map((s, i) => (
                  <li key={typeof s === "string" ? s : s.titel} className="relative text-[15px] leading-snug text-white/75">
                    <span className="absolute -left-[37px] top-[-2px] flex h-6 w-6 items-center justify-center rounded-full bg-navy-950 font-display text-[12px] font-bold text-ov-300 ring-1 ring-ov-400/60">{i + 1}</span>
                    {typeof s === "string" ? (
                      s
                    ) : (
                      <>
                        <strong className="block font-display text-[16px] text-white">{s.titel}</strong>
                        {s.text}
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
          <Reveal delay={200} className="ov-glass mt-9 rounded-3xl p-5">
            <p className="text-[13px] font-medium text-white/60">Lieber direkt?</p>
            <a href={FIRMA.telefonHref} className="mt-2 flex items-center gap-3 font-display text-[20px] font-extrabold tracking-tight hover:text-ov-200">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ov-500">
                <Phone aria-hidden="true" className="h-4 w-4" />
              </span>
              {FIRMA.telefon}
            </a>
            <a href={`mailto:${FIRMA.email}`} className="mt-3 flex min-h-11 items-center gap-2.5 text-[15px] text-white/75 hover:text-white">
              <Mail aria-hidden="true" className="h-4 w-4 text-ov-300" />
              {FIRMA.email}
            </a>
          </Reveal>
        </div>
        <Reveal dir="right" className="min-w-0 text-ink-900">
          <ServiceAnfrage {...formular} />
        </Reveal>
      </div>
    </section>
  );
}
