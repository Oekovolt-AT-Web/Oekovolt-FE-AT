import { Phone, Calculator, ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { cn } from "./cn";
import Button from "./Button";
import Reveal from "./Reveal";
import { FIRMA } from "@/lib/site";

/**
 * Abschluss-Handlungsaufruf für jede Seite. Dunkle, leuchtende Fläche mit
 * zwei Wegen: Online-Anfrage (niedrige Schwelle) und Telefon (direkt).
 */
export default function CtaBand({
  eyebrow = "Kostenlos & unverbindlich",
  title = "Ihr Dach kann mehr. Wir zeigen Ihnen, wie viel.",
  text = "Persönliche Beratung vom Elektrotechnik-Fachbetrieb aus Ostermiething – für Projekte in ganz Österreich, mit ehrlicher Wirtschaftlichkeitsrechnung und festem Ansprechpartner von der Planung bis zum Betrieb.",
  primary = { label: "Angebot in 2 Minuten anfragen", href: "/angebot" },
  secondary = { label: "Ertrag berechnen", href: "/solarrechner" },
  className,
}) {
  return (
    <section className={cn("relative px-4 py-16 md:px-8 md:py-24", className)}>
      <Reveal dir="scale" className="ov-noise relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy-950 px-6 py-14 text-white md:rounded-[2.5rem] md:px-16 md:py-20">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-24 -top-32 h-[460px] w-[460px] rounded-full bg-ov-500/35 blur-[110px]" />
        <div aria-hidden="true" className="absolute -bottom-40 left-1/4 h-[360px] w-[360px] rounded-full bg-sun-400/15 blur-[110px]" />

        {/* minmax(0, …): Spalten dürfen nicht über ihren Anteil wachsen – sonst schieben breite Buttons
            die rechte Box in den Innenabstand und overflow-hidden schneidet sie ab */}
        <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{eyebrow}</p>
            <h2 className="ov-h2 mt-4 text-white">{title}</h2>
            <p className="ov-lead mt-5 max-w-2xl text-white/70">{text}</p>
            {/* flex-wrap: bei wenig Platz rutscht der zweite Button in die nächste Zeile */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href={primary.href} size="lg" pfeil>
                {primary.label}
              </Button>
              {secondary && (
                <Button href={secondary.href} size="lg" variant="outlineLight" icon={secondary.icon === undefined ? Calculator : secondary.icon}>
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>

          <div className="ov-glass min-w-0 rounded-3xl p-6 md:p-8">
            <p className="text-[13px] font-medium text-white/60">Lieber direkt sprechen?</p>
            <a href={FIRMA.telefonHref} className="group mt-2 flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ov-500 transition-transform group-hover:scale-110">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0 font-display text-[22px] font-extrabold tracking-tight md:text-[26px]">{FIRMA.telefon}</span>
            </a>
            <p className="mt-2 text-[13.5px] text-white/55">{FIRMA.oeffnungszeiten.map((o) => `${o.tage} ${o.zeit}`).join(" · ")}</p>
            <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-[14.5px] text-white/80">
              <li className="flex items-start gap-2.5"><BadgeCheck aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-ov-300" /><span className="min-w-0">Seit 2012 in Österreich, Gruppe seit 2010</span></li>
              <li className="flex items-start gap-2.5"><ShieldCheck aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-ov-300" /><span className="min-w-0">Planung, Netzanschluss, Montage & Betrieb aus einer Hand</span></li>
              <li className="flex items-start gap-2.5"><Clock aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-ov-300" /><span className="min-w-0">Eigener Parkregler, Fernwartung & SCADA</span></li>
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
