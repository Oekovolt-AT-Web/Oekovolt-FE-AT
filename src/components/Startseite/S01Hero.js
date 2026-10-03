// src/components/Startseite/S01Hero.js
//
// Startseite – Abschnitt: Hero mit Video, Claim, Gewerbe-Rechner und Kennzahlenband.
// Eingebunden in src/app/page.js.
//
// Idee „Ihr Betrieb. Ihr Kraftwerk.“: eine Bühne in drei Ebenen (Foto/Video mit Parallaxe,
// Lichtregie, Inhalt). Signatur ist die Sonnenbahn (s01-sonnenbahn): Beim Laden zieht die
// Sonne vom Horizont herauf und zeichnet ihren Weg als Lichtlinie – der Tagesbogen umrahmt
// den Rechner und leuchtet weich durch dessen Glas. Choreografie beim Laden (nur CSS, damit
// alles ohne JS sichtbar bleibt): Foto setzt sich, Claim steigt zeilenweise aus der Maske,
// Lichtstreif fährt über die Bühne, die Rechnerkarte setzt sich zusammen, Ergebnisse zählen.
// Am Fuß: Kennzahlenband als Datenmoment (Horizontlinie, Lichtimpuls, Knoten, Count-up).
// Bewegung nur über transform/opacity/stroke-dashoffset; reduzierte Bewegung = Endzustand.

import { MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { HOME_HERO, KERNFAKTEN } from "@/data/hero";
import { KENNZAHLEN_HINWEIS, KENNZAHLEN_STAND } from "@/data/kennzahlen";
import Button from "@/components/ui/Button";
import HeroVideo from "@/components/Home2/HeroVideo";
import HeroGewerbeRechner from "@/components/Home2/HeroGewerbeRechner";
import S01Buehne from "./s01-buehne";
import S01Sonnenbahn from "./s01-sonnenbahn";
import S01Band from "./s01-band";

const [STAND_JAHR, STAND_MONAT] = KENNZAHLEN_STAND.split("-");
const BAND_HINWEIS = `${KENNZAHLEN_HINWEIS} · Stand ${STAND_MONAT}/${STAND_JAHR}`;

const SIEGEL = [
  ["/Images/AT/siegel/wko-gutesiegel-meisterbetrieb.png", "Gütesiegel Meisterbetrieb der Wirtschaftskammer Österreich"],
  ["/Images/AT/siegel/wko-elektrotechnik.png", "Elektrotechnik – staatlich geprüft"],
];

const CSS = `
.s01{--s01-e:cubic-bezier(.16,1,.3,1)}
.s01-licht{background:
  radial-gradient(70% 38% at 70% 4%,rgba(255,197,61,.10),transparent 70%),
  radial-gradient(80% 40% at 0% 100%,rgba(102,153,51,.18),transparent 70%),
  linear-gradient(180deg,rgba(3,18,43,.5) 0,rgba(3,18,43,.7) 18rem,rgba(3,18,43,.9) 30rem,#03122b 44rem)}
@media (min-width:768px){.s01-licht{background:
  radial-gradient(30% 34% at 52% 4%,rgba(255,197,61,.2),transparent 70%),
  radial-gradient(40% 50% at 82% 50%,rgba(255,197,61,.07),transparent 70%),
  radial-gradient(42% 60% at 0% 96%,rgba(102,153,51,.20),transparent 70%),
  linear-gradient(90deg,rgba(3,18,43,.94) 0%,rgba(3,18,43,.82) 34%,rgba(3,18,43,.4) 60%,rgba(3,18,43,.22) 100%),
  linear-gradient(180deg,rgba(3,18,43,.5) 0%,rgba(3,18,43,0) 20%,rgba(3,18,43,0) 52%,#03122b 86%)}}
.s01-sweep{position:absolute;top:-10%;bottom:-10%;left:0;width:34%;pointer-events:none;opacity:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.045) 38%,rgba(255,230,163,.09) 50%,rgba(255,255,255,.045) 62%,transparent);
  transform:translate3d(-120%,0,0) skewX(-14deg)}
.s01-claim{font-size:clamp(3.3rem,1.6rem + 4.6vw,5.6rem);line-height:.98;letter-spacing:-.045em}
.s01-maske{display:block;overflow:hidden;padding-bottom:.12em;margin-bottom:-.12em}
.s01-zeile{display:block}
.s01-siegel{box-shadow:0 8px 22px -8px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.35),0 0 0 5px rgba(255,255,255,.06)}

/* Sonnenbahn: Geometrie je Breakpoint (Radius, Sonnenwinkel, zurückgelegter Anteil) */
.s01-bahn{--s01-r:230px;--s01-w:-30deg;--s01-f:.3333;z-index:0;width:calc(var(--s01-r) * 2);height:calc(var(--s01-r) * 2);left:calc(50% - var(--s01-r));top:calc(150px - var(--s01-r))}
.s01-bahn-glut{r:18px}.s01-bahn-kern{r:2.6px}.s01-bahn-ring{r:7px}
.s01-bahn-weg{stroke:url(#s01-weg-m)}.s01-bahn-linie{stroke:url(#s01-rest-m)}
@media (min-width:1024px){
  .s01-bahn{--s01-r:720px;--s01-w:0deg;--s01-f:.5;left:calc(-2rem - var(--s01-r));top:-14px}
  .s01-bahn-glut{r:13px}.s01-bahn-kern{r:1.2px}.s01-bahn-ring{r:2.6px}
  .s01-bahn-weg{stroke:url(#s01-weg-d)}.s01-bahn-linie{stroke:url(#s01-rest-d)}
}
.s01-bahn-weg{stroke-dasharray:var(--s01-f) 2}
.s01-bahn-sonne{transform-box:view-box;transform-origin:100px 100px;transform:rotate(var(--s01-w))}
.s01-bahn-glut{transform-box:fill-box;transform-origin:center}

/* Rechner-Glas */
.s01-glas{background:linear-gradient(165deg,rgba(255,255,255,.13),rgba(255,255,255,.04) 45%,rgba(255,255,255,.07));background-color:rgba(6,26,56,.4);
  border:1px solid rgba(255,255,255,.14);-webkit-backdrop-filter:blur(22px) saturate(150%);backdrop-filter:blur(22px) saturate(150%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 60px 110px -50px rgba(0,0,0,.85),0 24px 48px -28px rgba(0,0,0,.55)}
.s01-kante{background:linear-gradient(90deg,transparent,rgba(255,255,255,.6) 35%,rgba(255,216,115,.65) 65%,transparent)}
.s01-glanz{opacity:0;transition:opacity .5s;background:radial-gradient(380px circle at var(--s01-mx,85%) var(--s01-my,0%),rgba(174,208,131,.13),transparent 65%)}
@media (hover:hover){.s01-glas:hover .s01-glanz{opacity:1}}
.s01-ergebnis{background:linear-gradient(180deg,rgba(3,18,43,.6),rgba(3,18,43,.38))}
.s01-ergebnis-zahl{background:linear-gradient(100deg,#e9f6d6 0%,#aed083 58%,#ffd873 125%);-webkit-background-clip:text;background-clip:text;color:transparent}
.s01-schieber{width:calc((100% - .5rem) / 3);transition:transform 480ms var(--s01-e)}
.s01-eigen{transition:transform 700ms var(--s01-e)}
.ov-range.s01-range{height:40px;margin-top:2px;margin-bottom:-10px;background:linear-gradient(to right,#669933 0%,#aed083 var(--ov-fill,50%),rgba(255,255,255,.14) var(--ov-fill,50%),rgba(255,255,255,.14) 100%) center/100% 6px no-repeat;border-radius:9999px}
.ov-range.s01-range::-webkit-slider-thumb{box-shadow:0 0 0 6px rgba(140,186,88,.2),0 4px 14px rgba(0,0,0,.45)}

/* Kennzahlenband */
.s01-band{background:#03122b;padding-top:1.5rem}
.s01-band::before{content:"";position:absolute;left:0;right:0;bottom:100%;height:9rem;pointer-events:none;background:linear-gradient(180deg,rgba(3,18,43,0),#03122b)}
.s01-b-wert{font-size:clamp(2.75rem,1.8rem + 3.1vw,4.5rem)}
.s01-b-einheit{font-size:.4em;font-weight:700;letter-spacing:-.01em}
.s01-b-maske{padding-bottom:.08em;margin-bottom:-.08em}
.s01-b-schiene{background:linear-gradient(180deg,rgba(174,208,131,.55),rgba(255,255,255,.08));transform-origin:top}
.s01-b-horizont{left:calc(50% - 50vw);width:100vw;transform-origin:left;
  background:linear-gradient(90deg,rgba(255,255,255,.03),rgba(255,255,255,.16) 18%,rgba(255,255,255,.16) 82%,rgba(255,255,255,.03))}
.s01-b-impuls{left:calc(50% - 50vw);width:240px;height:3px;margin-top:-1px;border-radius:3px;opacity:0;pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(174,208,131,.9) 55%,#fff6dc 92%,transparent);box-shadow:0 0 18px 2px rgba(174,208,131,.4)}
.s01-b-knoten{width:11px;height:11px;border-radius:9999px;background:#03122b;left:-32px;top:20px;
  box-shadow:inset 0 0 0 1.5px #aed083,0 0 0 5px rgba(140,186,88,.1),0 0 18px rgba(174,208,131,.5)}
.s01-b-knoten::after{content:"";position:absolute;inset:3px;border-radius:inherit;background:#eaf6d8}
@media (min-width:768px){.s01-b-knoten{left:0;top:calc(-3rem - 5px)}}

@media (prefers-reduced-motion:no-preference){
  .s01-foto{animation:s01-setzen 2800ms var(--s01-e) both}
  .s01-auf{animation:s01-auf 900ms var(--s01-e) both;animation-delay:var(--s01-d,0ms)}
  .s01-zeile{animation:s01-zeile 1150ms var(--s01-e) both;animation-delay:var(--s01-d,0ms)}
  .s01-sweep{animation:s01-sweep 2400ms cubic-bezier(.45,0,.25,1) 1000ms both}
  .s01-karte{animation:s01-karte 1200ms var(--s01-e) 380ms both}
  .s01-teil{animation:s01-auf 850ms var(--s01-e) both;animation-delay:calc(620ms + var(--i,0) * 75ms)}
  .s01-kante{animation:s01-kante 1600ms var(--s01-e) 900ms both}
  .s01-bahn-weg{animation:s01-weg 2100ms cubic-bezier(.33,0,.12,1) 300ms both}
  .s01-bahn-sonne{animation:s01-sonne 2100ms cubic-bezier(.33,0,.12,1) 300ms both}
  .s01-bahn-glut{animation:s01-glut 1500ms var(--s01-e) 2250ms both}
  .s01-bahn-rest{animation:s01-ein 1400ms ease 1300ms both}

  .js-ready .s01-band:not(.s01-an) :is(.s01-b-knoten,.s01-b-wert,.s01-b-label,.s01-b-kopf){opacity:0}
  .js-ready .s01-band:not(.s01-an) .s01-b-horizont{transform:scaleX(0)}
  .js-ready .s01-band:not(.s01-an) .s01-b-schiene{transform:scaleY(0)}
  .s01-an .s01-b-kopf{animation:s01-auf 800ms var(--s01-e) both}
  .s01-an .s01-b-horizont{animation:s01-x 1400ms var(--s01-e) both}
  .s01-an .s01-b-schiene{animation:s01-y 1400ms var(--s01-e) both}
  .s01-an .s01-b-impuls{animation:s01-impuls 1700ms cubic-bezier(.45,.05,.55,.95) 120ms both}
  .s01-an .s01-b-knoten{animation:s01-knoten 900ms var(--s01-e) var(--s01-k) both}
  .s01-an .s01-b-wert{animation:s01-auf 900ms var(--s01-e) calc(var(--s01-k) - 100ms) both}
  .s01-an .s01-b-label{animation:s01-auf 900ms var(--s01-e) calc(var(--s01-k) + 80ms) both}
  .s01-an .s01-b-drei{animation:s01-zeile 1100ms var(--s01-e) calc(var(--s01-k) + 60ms) both}
}
@keyframes s01-setzen{from{transform:scale(1.07)}}
@keyframes s01-auf{from{opacity:0;transform:translate3d(0,18px,0)}}
@keyframes s01-zeile{from{transform:translate3d(0,112%,0)}}
@keyframes s01-karte{from{opacity:0;transform:translate3d(0,44px,0) scale(.965)}}
@keyframes s01-kante{from{opacity:0;transform:scaleX(.2)}}
@keyframes s01-sweep{0%{opacity:0;transform:translate3d(-120%,0,0) skewX(-14deg)}14%{opacity:1}86%{opacity:1}100%{opacity:0;transform:translate3d(330%,0,0) skewX(-14deg)}}
@keyframes s01-weg{from{stroke-dashoffset:var(--s01-f)}}
@keyframes s01-sonne{from{transform:rotate(-90deg)}}
@keyframes s01-glut{0%{transform:scale(1)}40%{transform:scale(1.7)}100%{transform:scale(1)}}
@keyframes s01-ein{from{opacity:0}}
@keyframes s01-x{from{transform:scaleX(0)}}
@keyframes s01-y{from{transform:scaleY(0)}}
@keyframes s01-knoten{0%{opacity:0;transform:scale(0)}55%{opacity:1;transform:scale(1.7)}100%{transform:scale(1)}}
@keyframes s01-impuls{0%{opacity:0;transform:translate3d(-240px,0,0)}10%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate3d(100vw,0,0)}}
`;

export default function StartHero() {
  return (
    <section data-start="hero" className="s01 ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <S01Buehne />

      {/* Ebene 1 – Foto (LCP, priority) und Video, mit Parallaxe. Mobil nur oben, darunter Navy. */}
      <div data-s01-tiefe="0.3" className="absolute inset-x-0 top-0 -z-30 h-[44rem] md:bottom-0 md:h-auto">
        <Image src={HOME_HERO.bild} alt={HOME_HERO.alt} fill priority sizes="100vw" className="s01-foto object-cover object-[60%_50%]" />
      </div>
      {HOME_HERO.video && <HeroVideo src={HOME_HERO.video} poster={HOME_HERO.bild} />}

      {/* Ebene 2 – Lichtregie: Abdunklung, warmes Sonnenlicht hinter dem Rechner, grüne Bodenglut, Lichtstreif */}
      <div aria-hidden="true" className="s01-licht absolute inset-0 -z-10" />
      <div aria-hidden="true" className="s01-sweep -z-10" />

      {/* Ebene 3 – Inhalt */}
      <div className="ov-container relative grid items-center gap-14 pb-20 pt-10 md:pt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-16">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="s01-auf ov-glass inline-flex min-h-9 items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/90" style={{ "--s01-d": "60ms" }}>
              <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
              <span>
                {HOME_HERO.kicker}
                <span className="hidden sm:inline"> · {HOME_HERO.kickerZusatz}</span>
              </span>
            </span>
            {/* WKO-Siegel: lokal gespeichert und unverändert; nur zu führen, solange die Berechtigung besteht */}
            <span className="s01-auf inline-flex items-center gap-2.5" style={{ "--s01-d": "140ms" }} title="Meisterbetrieb · Elektrotechnik staatlich geprüft">
              {SIEGEL.map(([src, alt]) => (
                <span key={src} className="s01-siegel grid h-11 w-11 place-items-center rounded-full bg-white p-0.5 md:h-12 md:w-12">
                  <Image src={src} alt={alt} width={56} height={56} priority className="h-full w-full" />
                </span>
              ))}
            </span>
          </div>

          {/* H1 mit Suchbegriff (M13); der Werbespruch bleibt als große Unterzeile sichtbar */}
          <h1 className="s01-auf mt-9 max-w-[30rem] font-display text-[clamp(1.05rem,0.96rem+0.45vw,1.28rem)] font-semibold leading-snug tracking-[-0.01em] text-ov-200" style={{ "--s01-d": "200ms" }}>
            Photovoltaik für Betriebe, Landwirtschaft und Gemeinden in Österreich
          </h1>
          <p className="ov-display s01-claim mt-4">
            <span className="s01-maske">
              <span className="s01-zeile" style={{ "--s01-d": "260ms" }}>Ihr Betrieb.</span>
            </span>
            <span className="s01-maske">
              <span className="s01-zeile" style={{ "--s01-d": "400ms" }}>
                Ihr <span className="ov-text-gradient-light">Kraftwerk.</span>
              </span>
            </span>
          </p>
          <p className="ov-lead s01-auf mt-7 max-w-[36rem] text-white/72" style={{ "--s01-d": "620ms" }}>
            {HOME_HERO.lead}
          </p>
          <div className="s01-auf mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--s01-d": "740ms" }}>
            <Button href="/angebot?objekt=gewerbe" size="lg" pfeil>Ersteinschätzung anfordern</Button>
            <Button href="/referenzen/projekte" size="lg" variant="outlineLight">Referenzen ansehen</Button>
          </div>
          <ul className="s01-auf mt-11 grid gap-x-6 gap-y-3 border-t border-white/10 pt-5 sm:grid-cols-3" style={{ "--s01-d": "860ms" }}>
            {HOME_HERO.punkte.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-[13.5px] leading-snug text-white/70">
                <ShieldCheck aria-hidden="true" className="mt-px h-4 w-4 shrink-0 text-ov-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Rechner auf der Sonnenbahn */}
        <div className="s01-buehne-karte relative isolate mt-10 lg:mt-0">
          <S01Sonnenbahn />
          <div className="relative z-10">
            <HeroGewerbeRechner />
          </div>
        </div>
      </div>

      {/* Kennzahlenband – Raster folgt der Anzahl der Kennzahlen (3 ohne, 4 mit CO₂-Kennzahl) */}
      <S01Band fakten={KERNFAKTEN} titel="Ökovolt Österreich in Zahlen" hinweis={BAND_HINWEIS} />
    </section>
  );
}
