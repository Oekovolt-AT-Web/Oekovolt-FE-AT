import Image from "next/image";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/cn";
import W22Sicht from "../w22-sicht";

/**
 * Vollbreites Fotoband mit Aussage und Kennwerten – der redaktionelle Moment der Seite (Präfix w22z).
 * bild { src, alt, position? }, eyebrow, titel, text, fakten [{ icon?, titel, text }], children (z. B. Ablauf)
 *
 * Aufbau beim Eintritt: Lichtkante zieht über die obere Kante, das Foto setzt sich (dezente Parallaxe),
 * ein gezeichnetes Anführungszeichen erscheint, die Aussage steigt Wort für Wort aus der Maske,
 * danach Text und Kennwerte. Ohne JS / bei reduzierter Bewegung: Endzustand.
 */
function Woerter({ titel }) {
  if (typeof titel !== "string") return titel;
  const woerter = titel.split(" ").filter(Boolean);
  return woerter.map((w, i) => (
    <span key={`${w}-${i}`}>
      {i > 0 && " "}
      <span className="w22z-maske">
        <span className="w22z-wort" style={{ "--w22z-w": i }}>
          {w}
        </span>
      </span>
    </span>
  ));
}

export default function ZitatBand({ id, bild, eyebrow, titel, text, fakten = [], children }) {
  return (
    <section id={id} data-blk="zitat" className="w22z relative isolate scroll-mt-24 overflow-hidden bg-navy-950 text-white">
      <style href="w22-zitat" precedence="w22">{CSS}</style>
      <W22Sicht parallaxe={34} schwelle={0.18} className="relative">
        {/* Foto mit Parallaxe-Ebene und Aufbau-Skalierung */}
        <div data-w22-px="" aria-hidden={bild.alt ? undefined : "true"} className="absolute inset-x-0 -inset-y-10 -z-20">
          <div className="w22z-setzen absolute inset-0">
            <Image src={bild.src} alt={bild.alt || ""} fill sizes="100vw" className="object-cover" style={bild.position ? { objectPosition: bild.position } : undefined} />
          </div>
        </div>
        <div aria-hidden="true" className="w22z-licht absolute inset-0 -z-10" />
        <span aria-hidden="true" className="w22z-kante absolute inset-x-0 top-0 h-px" />

        <div className={cn("ov-container grid gap-12 pt-20 md:pt-28 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end lg:gap-20", children ? "pb-14 md:pb-16" : "pb-20 md:pb-28")}>
          <div>
            {eyebrow && (
              <div className="w22z-kopf mb-7 flex items-center gap-4">
                <Eyebrow dark>{eyebrow}</Eyebrow>
                <span aria-hidden="true" className="w22z-strich hidden h-px w-24 bg-gradient-to-r from-ov-300/60 to-transparent sm:block" />
              </div>
            )}
            <svg aria-hidden="true" viewBox="0 0 64 48" className="w22z-zeichen mb-3 h-8 w-11 md:mb-4 md:h-10 md:w-[3.4rem]">
              <defs>
                <linearGradient id="w22z-verlauf" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#cde3b1" />
                  <stop offset="0.55" stopColor="#8cba58" />
                  <stop offset="1" stopColor="#ffd873" />
                </linearGradient>
              </defs>
              <path
                fill="url(#w22z-verlauf)"
                d="M26 3C12.6 7.2 3 17.4 3 31c0 8.4 5 14 11.6 14C20.6 45 25 40.6 25 34.6c0-6-4.2-10.2-10-10.2-1 0-2 .1-2.8.4C13.8 17.6 19 12 27.6 8.4zM60 3C46.6 7.2 37 17.4 37 31c0 8.4 5 14 11.6 14C54.6 45 59 40.6 59 34.6c0-6-4.2-10.2-10-10.2-1 0-2 .1-2.8.4C47.8 17.6 53 12 61.6 8.4z"
              />
            </svg>
            <h2 className="w22z-titel font-display font-extrabold">
              <Woerter titel={titel} />
            </h2>
            {text && <p className="w22z-text ov-lead mt-7 max-w-[40rem] text-white/75">{text}</p>}
          </div>

          {fakten.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
              {fakten.map((f, i) => (
                <li key={f.titel} className="w22z-fakt relative flex items-start gap-4 overflow-hidden rounded-2xl p-5 md:p-6" style={{ "--w22z-f": i }}>
                  <span aria-hidden="true" className="w22z-fakt-linie absolute bottom-5 left-0 top-5 w-[2px] rounded-full" />
                  {f.icon && (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ov-500/20 text-ov-200 ring-1 ring-inset ring-ov-300/25">
                      <f.icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="font-display text-[17px] font-bold tracking-[-0.01em]">{f.titel}</p>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-white/72">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {children && <div className="w22z-kinder ov-container pb-20 md:pb-24">{children}</div>}
      </W22Sicht>
    </section>
  );
}

const CSS = `
.w22z{--w22z-e:cubic-bezier(.16,1,.3,1)}
.w22z-licht{background:
  radial-gradient(48% 60% at 0% 100%,rgba(102,153,51,.22),transparent 70%),
  linear-gradient(90deg,rgba(3,18,43,.95) 0%,rgba(3,18,43,.84) 40%,rgba(3,18,43,.5) 72%,rgba(3,18,43,.38) 100%),
  linear-gradient(180deg,rgba(3,18,43,.35) 0%,rgba(3,18,43,0) 30%,rgba(3,18,43,.25) 62%,rgba(3,18,43,.9) 100%)}
@media (max-width:1023px){.w22z-licht{background:
  radial-gradient(70% 40% at 0% 100%,rgba(102,153,51,.2),transparent 70%),
  linear-gradient(180deg,rgba(3,18,43,.78) 0%,rgba(3,18,43,.86) 45%,rgba(3,18,43,.94) 100%)}}
.w22z-kante{background:linear-gradient(90deg,transparent,rgba(174,208,131,.75) 22%,rgba(255,216,115,.8) 50%,rgba(174,208,131,.75) 78%,transparent);transform-origin:0 50%}
.w22z-titel{font-size:clamp(2.1rem,1.25rem + 2.9vw,3.75rem);line-height:1.04;letter-spacing:-.035em;max-width:18ch;text-wrap:balance}
.w22z-maske{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}
.w22z-wort{display:inline-block}
.w22z-fakt{background:linear-gradient(160deg,rgba(255,255,255,.1),rgba(255,255,255,.04));
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.13),0 30px 60px -40px rgba(0,0,0,.6);
  -webkit-backdrop-filter:blur(14px) saturate(140%);backdrop-filter:blur(14px) saturate(140%);
  transition:box-shadow 400ms,background-color 400ms}
.w22z-fakt-linie{background:linear-gradient(180deg,#aed083,#ffd873);transform-origin:50% 0}
@media (hover:hover){.w22z-fakt:hover{box-shadow:inset 0 0 0 1px rgba(174,208,131,.35),0 30px 60px -40px rgba(0,0,0,.6)}}

@media (prefers-reduced-motion:no-preference){
  [data-w22-an] .w22z-setzen{transition:transform 2200ms var(--w22z-e)}
  [data-w22-an] .w22z-kante{transition:transform 1600ms var(--w22z-e) 100ms}
  [data-w22-an] .w22z-kopf{transition:opacity 800ms var(--w22z-e) 150ms,transform 800ms var(--w22z-e) 150ms}
  [data-w22-an] .w22z-strich{transition:transform 1000ms var(--w22z-e) 450ms}
  [data-w22-an] .w22z-zeichen{transition:opacity 900ms var(--w22z-e) 250ms,transform 1100ms var(--w22z-e) 250ms}
  [data-w22-an] .w22z-wort{transition:transform 1050ms var(--w22z-e);transition-delay:calc(380ms + var(--w22z-w) * 55ms)}
  [data-w22-an] .w22z-text{transition:opacity 900ms var(--w22z-e) 900ms,transform 900ms var(--w22z-e) 900ms}
  [data-w22-an] .w22z-fakt{transition:opacity 800ms var(--w22z-e),transform 900ms var(--w22z-e),box-shadow 400ms;transition-delay:calc(800ms + var(--w22z-f) * 140ms),calc(800ms + var(--w22z-f) * 140ms),0ms}
  [data-w22-an] .w22z-fakt-linie{transition:transform 900ms var(--w22z-e) calc(1150ms + var(--w22z-f) * 140ms)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-setzen{transform:scale(1.08)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-kante{transform:scaleX(0)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-kopf{opacity:0;transform:translate3d(0,12px,0)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-strich{transform:scaleX(0)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-zeichen{opacity:0;transform:translate3d(0,14px,0) scale(.85)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-wort{transform:translate3d(0,108%,0)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-text{opacity:0;transform:translate3d(0,18px,0)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-fakt{opacity:0;transform:translate3d(28px,0,0)}
  [data-w22-bereit]:not([data-w22-an]) .w22z-fakt-linie{transform:scaleY(0)}
}
.w22z-strich{transform-origin:0 50%}
.w22z-zeichen{transform-origin:0 100%}
`;
