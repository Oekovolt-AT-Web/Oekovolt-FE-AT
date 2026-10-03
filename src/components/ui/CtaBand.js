import { Fragment } from "react";
import { Phone, Calculator, ShieldCheck, Clock, BadgeCheck } from "lucide-react";
import { cn } from "./cn";
import Button from "./Button";
import { FIRMA } from "@/lib/site";
import { w21Woerter } from "./w21-woerter";
import W21Sicht from "./w21-sicht";
import W21Aufgang from "./w21-aufgang";

const VERSPRECHEN = [
  { icon: BadgeCheck, text: "Seit 2012 in Österreich, Gruppe seit 2010" },
  { icon: ShieldCheck, text: "Planung, Netzanschluss, Montage & Betrieb aus einer Hand" },
  { icon: Clock, text: "Eigener Parkregler, Fernwartung & SCADA" },
];

/**
 * Abschluss-Handlungsaufruf für jede Seite. Dunkle Bühne mit zwei Wegen: Online-Anfrage
 * (niedrige Schwelle) und Telefon (direkt).
 *
 * Gestaltung (Präfix w21, im Geist des Startseiten-Finales): Über einem Modulfeld geht hinter der
 * Kontaktkarte die Sonne auf (w21-aufgang) und leuchtet weich durch deren Glas. Beim Eintritt
 * (einmal, w21-sicht): Horizont zieht von der Sonne nach außen, Bahnen und Strahlen zeichnen sich,
 * die Überschrift steigt Wort für Wort aus der Maske, danach Text, Wege und Karte; später laufen ein
 * paar Energie-Impulse über das Feld und kommen zur Ruhe. Ohne JS / reduzierte Bewegung: Endbild.
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
    <section data-blk="abschluss" className={cn("relative px-3 py-14 sm:px-4 md:px-8 md:py-24", className)}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <W21Sicht
        schwelle={0.22}
        className="w21-c ov-noise relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-navy-950 text-white md:rounded-[2.5rem]"
      >
        {/* Himmel: Nachtblau, über dem Horizont hinter der Karte zur Dämmerung aufgehellt */}
        <div aria-hidden="true" className="w21-c-himmel absolute inset-0 -z-20" />
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-20 opacity-40" />
        <div aria-hidden="true" className="w21-c-motiv pointer-events-none absolute bottom-0 -z-10">
          <W21Aufgang className="block h-full w-full" />
        </div>

        {/* minmax(0, …): Spalten dürfen nicht über ihren Anteil wachsen – sonst schieben breite Buttons
            die rechte Box in den Innenabstand und overflow-hidden schneidet sie ab */}
        <div className="relative grid items-center gap-10 px-5 pb-[9.5rem] pt-12 sm:px-8 md:px-14 md:pt-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14 lg:px-16 lg:pb-[10.5rem] lg:pt-20">
          <div className="min-w-0">
            <p className="w21-c-auf inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300" style={{ "--w21-d": "0ms" }}>
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-sun-400 shadow-[0_0_12px_2px_rgba(255,197,61,0.6)]" />
              {eyebrow}
            </p>
            <h2 className="ov-h2 w21-c-titel mt-4 text-white">{w21Woerter(title, { start: 80, schritt: 50, max: 520 })}</h2>
            <p className="w21-c-auf ov-lead mt-5 max-w-2xl text-white/70" style={{ "--w21-d": "620ms" }}>
              {text}
            </p>
            {/* flex-wrap: bei wenig Platz rutscht der zweite Button in die nächste Zeile */}
            <div className="w21-c-auf mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ "--w21-d": "760ms" }}>
              <Button href={primary.href} size="lg" variant="sun" pfeil className="w21-c-cta overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {primary.label}
              </Button>
              {secondary && (
                <Button
                  href={secondary.href}
                  size="lg"
                  variant="outlineLight"
                  icon={secondary.icon === undefined ? Calculator : secondary.icon}
                  className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>

          {/* Kontaktkarte auf Glas – die aufgehende Sonne leuchtet durch */}
          <div className="w21-c-auf w21-c-glas relative min-w-0 rounded-3xl p-6 md:p-8" style={{ "--w21-d": "900ms" }}>
            <span aria-hidden="true" className="w21-c-kante absolute inset-x-8 top-0 h-px" />
            <p className="text-[13px] font-medium text-white/60">Lieber direkt sprechen?</p>
            <a href={FIRMA.telefonHref} className="group mt-2 flex min-h-12 items-center gap-3 rounded-2xl outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ov-500 shadow-[0_8px_24px_-8px_rgba(102,153,51,0.8)] transition-transform duration-300 group-hover:scale-105">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="ov-num min-w-0 font-display text-[22px] font-extrabold tracking-[-0.02em] transition-colors group-hover:text-sun-300 md:text-[26px]">{FIRMA.telefon}</span>
            </a>
            <p className="mt-2 text-[13.5px] text-white/55">
              {FIRMA.oeffnungszeiten.map((o, i) => (
                <Fragment key={o.tage}>
                  {i > 0 && " · "}
                  <span className="whitespace-nowrap">
                    {o.tage} {o.zeit}
                  </span>
                </Fragment>
              ))}
            </p>
            <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-[14.5px] text-white/80">
              {VERSPRECHEN.map((v) => (
                <li key={v.text} className="flex items-start gap-2.5">
                  <v.icon aria-hidden="true" className="mt-[3px] h-4 w-4 shrink-0 text-ov-300" />
                  <span className="min-w-0">{v.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </W21Sicht>
    </section>
  );
}

const CSS = `
.w21-c{--w21-e:cubic-bezier(.22,1,.36,1)}
.w21-c-himmel{background:radial-gradient(85% 75% at 50% 100%,#0b3a78 0%,#041d42 48%,#03122b 82%)}
@media (min-width:1024px){.w21-c-himmel{background:radial-gradient(60% 85% at 76% 100%,#0b3a78 0%,#041d42 50%,#03122b 85%)}}
/* Motiv: feste Pixelgröße, Sonne mobil mittig, ab lg unter der Kontaktkarte */
.w21-c-motiv{width:2400px;height:520px;left:calc(50% - 1200px);transform:scale(.62);transform-origin:50% 100%}
@media (min-width:640px){.w21-c-motiv{transform:scale(.8)}}
@media (min-width:1024px){.w21-c-motiv{left:calc(76% - 1200px);transform:none;bottom:-40px}}
.w21-c-glas{background:linear-gradient(165deg,rgba(255,255,255,.12),rgba(255,255,255,.04) 45%,rgba(255,255,255,.07));background-color:rgba(6,26,56,.42);
  border:1px solid rgba(255,255,255,.14);-webkit-backdrop-filter:blur(20px) saturate(150%);backdrop-filter:blur(20px) saturate(150%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 50px 100px -50px rgba(0,0,0,.85),0 20px 44px -28px rgba(0,0,0,.55)}
.w21-c-kante{background:linear-gradient(90deg,transparent,rgba(255,255,255,.55) 35%,rgba(255,216,115,.6) 65%,transparent)}
.w21-c-titel{text-wrap:balance}
.w21-c-titel .w21-m{display:inline-block;padding-bottom:.12em;margin-bottom:-.12em;clip-path:inset(-.45em -.3em 0 -.3em)}
.w21-c-titel .w21-w{display:inline-block}
.w21-c-cta::after{content:"";position:absolute;top:0;bottom:0;left:-35%;width:35%;pointer-events:none;opacity:0;
  background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.55) 50%,rgba(255,255,255,0));transform:skewX(-14deg)}
.w21-c-strich{fill:none;stroke-dasharray:1;stroke-dashoffset:0}
.w21-c-sonne{transform-box:fill-box;transform-origin:50% 100%}
.w21-c-impuls{stroke-dasharray:.05 1.2;stroke-dashoffset:.05;opacity:0}
@media (hover:hover) and (prefers-reduced-motion:no-preference){
  .w21-c-cta:hover::after{opacity:1;transform:translate3d(420%,0,0) skewX(-14deg);transition:transform 900ms var(--w21-e),opacity 150ms}
}
@media (prefers-reduced-motion:no-preference){
  [data-w21-an] .w21-c-titel .w21-w{transition:transform 1100ms var(--w21-e) var(--w21-d,0ms)}
  [data-w21-an] .w21-c-auf{transition:opacity 900ms var(--w21-e) var(--w21-d,0ms),transform 900ms var(--w21-e) var(--w21-d,0ms)}
  [data-w21-an] .w21-c-horizont{transition:stroke-dashoffset 1500ms cubic-bezier(.65,0,.35,1) 150ms}
  [data-w21-an] .w21-c-bahn{transition:stroke-dashoffset 1900ms cubic-bezier(.65,0,.35,1) calc(300ms + var(--w21-k) * 110ms)}
  [data-w21-an] .w21-c-strahl{transition:stroke-dashoffset 1300ms var(--w21-e) calc(700ms + var(--w21-k) * 45ms)}
  [data-w21-an] .w21-c-sonne{transition:transform 1800ms var(--w21-e) 300ms,opacity 1200ms ease 300ms}
  [data-w21-an] .w21-c-hof{transition:opacity 2000ms ease 500ms}
  [data-w21-an] .w21-c-feld{transition:opacity 1400ms var(--w21-e) 550ms,transform 1600ms var(--w21-e) 550ms}

  [data-w21-bereit] .w21-c-titel .w21-w{transform:translate3d(0,125%,0)}
  [data-w21-bereit] .w21-c-auf{opacity:0;transform:translate3d(0,16px,0)}
  [data-w21-bereit] .w21-c-strich{stroke-dashoffset:1}
  [data-w21-bereit] .w21-c-sonne{transform:translate3d(0,46%,0);opacity:.4}
  [data-w21-bereit] .w21-c-hof{opacity:0}
  [data-w21-bereit] .w21-c-feld{opacity:0;transform:translate3d(0,20px,0)}

  [data-w21-an] .w21-c-impuls{animation:w21-c-impuls 7000ms cubic-bezier(.45,0,.55,1) 3;animation-delay:calc(2600ms + var(--w21-k) * 1500ms)}
}
@keyframes w21-c-impuls{
  0%{stroke-dashoffset:.05;opacity:0}
  4%{opacity:1}
  24%{stroke-dashoffset:-1;opacity:1}
  25%,100%{stroke-dashoffset:-1;opacity:0}
}
`;
