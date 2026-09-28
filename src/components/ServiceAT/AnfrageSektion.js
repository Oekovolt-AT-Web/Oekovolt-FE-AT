import { Mail, Phone } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { FIRMA } from "@/lib/site";
import ServiceAnfrage from "./ServiceAnfrage";

/**
 * Conversion-Abschnitt mit Anker #anfrage: links Nutzenversprechen und
 * nächste Schritte, rechts das Anfrageformular.
 */
export default function AnfrageSektion({ eyebrow = "Anfrage", titel, lead, schritte = [], formular, id = "anfrage", tone = "sand" }) {
  return (
    <Section id={id} tone={tone} space="lg" className="scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={eyebrow} title={titel} lead={lead} />
          {schritte.length > 0 && (
            <Reveal delay={100}>
              <ol className="mt-8 space-y-3">
                {schritte.map((s, i) => (
                  <li key={s} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-ink-200/60">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ov-600 font-display text-[14px] font-bold text-white">{i + 1}</span>
                    <span className="text-[15px] leading-snug text-ink-700">{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          )}
          <Reveal delay={160} className="mt-8 space-y-2 text-[15px] text-ink-700">
            <p className="font-semibold text-ink-900">Lieber direkt?</p>
            <a href={FIRMA.telefonHref} className="flex items-center gap-2.5 hover:text-ov-700">
              <Phone aria-hidden="true" className="h-4 w-4 text-ov-600" />
              {FIRMA.telefon}
            </a>
            <a href={`mailto:${FIRMA.email}`} className="flex items-center gap-2.5 hover:text-ov-700">
              <Mail aria-hidden="true" className="h-4 w-4 text-ov-600" />
              {FIRMA.email}
            </a>
          </Reveal>
        </div>
        <Reveal dir="right" className="min-w-0">
          <ServiceAnfrage {...formular} />
        </Reveal>
      </div>
    </Section>
  );
}
