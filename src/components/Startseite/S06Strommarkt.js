// src/components/Startseite/S06Strommarkt.js
//
// Startseite – Abschnitt: Strommarkt Österreich live.
// Eingebunden in src/app/page.js. Erhält den serverseitigen Energie-Snapshot als `energie`
// (src/lib/energy.js); ohne Preisdaten wird nichts gerendert.
// Die Live-Grafik (HomeLive) ist eine Client-Insel; Überschrift, Text und Quellenangabe bleiben
// Server-HTML. Der Erzeugungsmix wird hier aus den Zeitreihen berechnet, damit der Browser die
// schweren Reihen beim ersten Laden nicht mitgeschickt bekommt.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import HomeLive from "@/components/Home2/HomeLive";
import { erzeugungsMix } from "@/components/Startseite/s06-daten";

export default function StartStrommarkt({ energie }) {
  if (!energie?.preis?.punkte?.length) return null;
  const { zeiten, serien, ...erzeugung } = energie.erzeugung || {};
  const initial = {
    stand: energie.stand,
    preis: energie.preis,
    erzeugung,
    mix: erzeugungsMix(energie.erzeugung),
  };
  const quellePreis = energie.preis.quelle || "Energy-Charts (Fraunhofer ISE)";
  const quelleErzeugung = energie.erzeugung?.quelle;

  return (
    <>
      {/* ================= STROMMARKT ÖSTERREICH LIVE ================= */}
      <Section data-start="strommarkt" tone="navy" space="lg" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-70" />
        <div aria-hidden="true" className="absolute -right-40 -top-24 h-[520px] w-[520px] rounded-full bg-ov-500/[0.16] blur-[140px]" />
        <div aria-hidden="true" className="absolute -bottom-48 left-[12%] h-[420px] w-[420px] rounded-full bg-sun-400/[0.08] blur-[130px]" />
        <div className="relative">
          <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
            <SectionHeading
              dark
              eyebrow="Strommarkt Österreich live"
              title={
                <>
                  Wann Strom billig ist, <span className="ov-text-gradient-light">sehen Sie hier.</span>
                </>
              }
            />
            <Reveal delay={120}>
              <p className="ov-lead max-w-[34rem] text-white/65">
                Der Day-Ahead-Preis der Gebotszone AT wechselt jede Viertelstunde – mittags drückt Solarstrom ihn oft tief nach unten. Wer Speicher, E-Flotte und
                flexible Lasten danach steuert, kauft günstiger ein.
              </p>
            </Reveal>
          </div>

          <HomeLive initial={initial} />

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <p className="max-w-3xl text-[12px] leading-relaxed text-white/40">
              Quelle: {quellePreis}
              {quelleErzeugung && quelleErzeugung !== quellePreis ? `, Erzeugung: ${quelleErzeugung}` : ""}, Gebotszone Österreich. Energy-Charts-Daten unter CC BY 4.0.
              Börsenpreise netto, ohne Netzentgelte, Abgaben und Steuern. „Sonstige“ umfasst u. a. Pumpspeicher und Abfall.
            </p>
            <Link
              href="/energie-live"
              className="group inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2.5 self-start rounded-full bg-white px-6 text-[14.5px] font-semibold text-navy-950 transition-colors hover:bg-ov-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ov-300 sm:self-auto"
            >
              Alle Live-Daten im Dashboard
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
