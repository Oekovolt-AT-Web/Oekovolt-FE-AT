// src/components/Startseite/S04Rechner.js
//
// Startseite – Abschnitt: Rechner & Tools (dunkel).
// Produkt-Schaufenster der kostenlosen Rechner – Karten mit gezeichneten Live-Vorschauen,
// siehe src/components/Home2/RechnerShowcase.js. Eingebunden in src/app/page.js.

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import RechnerShowcase from "@/components/Home2/RechnerShowcase";
import { TOOLS } from "@/components/Rechner/tools";

export default function StartRechner() {
  return (
    <>
      {/* ================= RECHNER & TOOLS ================= */}
      <Section data-start="rechner" tone="navy" space="md" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-70" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-ov-500/[0.16] blur-[140px]" />
        <div aria-hidden="true" className="absolute -right-32 top-1/3 h-[460px] w-[460px] rounded-full bg-navy-500/30 blur-[130px]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ov-300/30 to-transparent" />
        <div className="relative">
          <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-12 lg:items-end lg:gap-10">
            <SectionHeading
              dark
              className="lg:col-span-7"
              eyebrow="Rechner & Tools"
              title={
                <>
                  Rechnen Sie Ihr Projekt <span className="ov-text-gradient-light">selbst durch.</span>
                </>
              }
            />
            <Reveal delay={120} className="lg:col-span-5">
              <p className="max-w-[34rem] text-[16.5px] leading-relaxed text-white/65 md:text-[17.5px]">
                Kostenlose Werkzeuge für Ihren Betrieb – mit österreichischen Netzentgelten, Förderungen und Standortdaten. Ehrliche Zahlen, bevor Sie mit uns sprechen.
              </p>
              <div className="mt-6">
                <Button href="/rechner" variant="outlineLight" pfeil>
                  Alle {TOOLS.length} Rechner & Tools
                </Button>
              </div>
            </Reveal>
          </div>
          <RechnerShowcase />
        </div>
      </Section>
    </>
  );
}
