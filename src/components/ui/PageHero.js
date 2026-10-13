import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "./cn";
import Breadcrumbs from "./Breadcrumbs";
import Button from "./Button";
import CountUp from "./CountUp";
import { Eyebrow } from "./SectionHeading";
import { w21Woerter } from "./w21-woerter";
import W21Bogen from "./w21-bogen";

/**
 * Einheitlicher Seitenkopf für alle Unterseiten.
 *
 * variant:
 *  - "split"      Text links, großes Bild rechts mit schwebender Kennzahl (Standard)
 *  - "immersive"  Vollflächiges Bild, dunkler Verlauf, Text unten links
 *  - "dark"       Navy-Fläche mit Raster und Lichtschein, ohne Bild (Tools, Wissen)
 *
 * props:
 *  breadcrumbs  [{ name, href }]
 *  eyebrow, title (string oder JSX), lead
 *  image { src, alt, position }  – bei split/immersive (LCP-Bild, priority)
 *  actions      [{ label, href, variant, icon }]
 *  points       ["Kurzer Vorteil", ...]
 *  stats        [{ value: 5000, suffix: "+", label: "Anlagen" }]
 *  badge        JSX – schwebendes Element auf dem Bild (split)
 *  signatur     false blendet den Tagesbogen aus (immersive/dark; optional, Standard: an)
 *  leadKuerzen  false: Lead mobil nie auf drei Zeilen kürzen (z. B. bei Pflichthinweisen); Standard: an
 *
 * Gestaltung (Präfix w21): die Bühne der Startseite, ruhiger. Beim Laden setzt sich das Foto, die
 * H1 steigt Wort für Wort aus ihrer Grundlinie, ein Lichtstreif zieht einmal über die Bühne und der
 * Tagesbogen (w21-bogen) zeichnet sich aus dem Horizont. Alles reines CSS: Inhalt steht ohne JS im
 * HTML, nur transform/opacity/stroke-dashoffset werden animiert, reduzierte Bewegung = Endzustand.
 * Struktur bleibt stabil: section > div.ov-container (Seiten setzen per className
 * `[&>div.ov-container]:pb-…`).
 *
 * Mobile Führung (< sm, Ziel: Primär-CTA bei 390 × 844 oberhalb von 700 px):
 *  - Die Actions stehen direkt unter der H1 (flex-col + order); Lead, Punkte und Kennzahlen folgen.
 *    Im DOM bleibt die Lesereihenfolge Titel → Lead → Actions.
 *  - Höchstens 2 Punkte; ein langer Text-Lead wird auf 3 Zeilen gekürzt und lässt sich per „mehr“
 *    auf- und per „weniger“ wieder zuklappen (<details>, ohne JS). Leads mit Pflichthinweisen (Stand, Angaben, Symbolbild …)
 *    und JSX-Leads werden nie gekürzt.
 *  - LCP: H1 ohne Startverzögerung, Actions nach 250 ms und nur per transform (immer sichtbar),
 *    übrige Einblendungen starten bei Deckkraft 0,01 (nie 0).
 */
export default function PageHero({
  variant = "split",
  breadcrumbs,
  eyebrow,
  title,
  lead,
  image,
  actions = [],
  points = [],
  stats = [],
  badge,
  signatur = true,
  leadKuerzen = true,
  children,
  className,
}) {
  if (variant === "immersive") return <Immersive {...{ breadcrumbs, eyebrow, title, lead, image, actions, points, stats, signatur, leadKuerzen, children, className }} />;
  if (variant === "dark") return <Dark {...{ breadcrumbs, eyebrow, title, lead, actions, points, stats, signatur, leadKuerzen, children, className }} />;

  return (
    <section data-blk="seitenkopf" data-variante="split" className={cn("w21-k w21-k-hell relative isolate overflow-hidden bg-sand-50", className)}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden="true" className="ov-grid-bg-light pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="w21-k-hof-hell pointer-events-none absolute inset-0 -z-10" />
      <div className="ov-container relative grid items-center gap-12 pb-16 pt-8 md:pb-24 md:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex min-w-0 flex-col">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="w21-auf mb-6 sm:mb-8" />}
          {eyebrow && (
            <div className="w21-auf" style={{ "--w21-d": "60ms" }}>
              <Eyebrow className="mb-4 sm:mb-5">{eyebrow}</Eyebrow>
            </div>
          )}
          <Titel className="text-ink-900">{title}</Titel>
          <Lead
            lead={lead}
            kuerzen={leadKuerzen}
            klasse={cn("max-w-xl text-ink-600", typeof lead === "string" && lead.length > 260 ? "text-[16px] leading-relaxed" : "ov-lead")}
          />
          {points.length > 0 && (
            <ul className="mt-7 grid gap-3 max-sm:order-1 sm:grid-cols-2">
              {points.map((p, i) => (
                <li
                  key={p}
                  className={cn("w21-auf flex items-start gap-2.5 text-[15px] text-ink-700", i >= MOBIL_PUNKTE && "max-sm:hidden")}
                  style={{ "--w21-d": `${600 + i * 60}ms` }}
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-600 text-white">
                    <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          )}
          <Actions actions={actions} dark={false} />
          {stats.length > 0 && (
            <dl className="w21-auf mt-12 grid grid-cols-3 gap-4 border-t border-ink-200 pt-8 max-sm:order-1" style={{ "--w21-d": "860ms" }}>
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-extrabold leading-none tracking-tight text-ink-900">
                    <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} prefix={s.prefix} />
                  </dd>
                  <dd className="mt-2 text-[13px] leading-snug text-ink-500">{s.label}</dd>
                </div>
              ))}
            </dl>
          )}
          {children && <div className="max-sm:order-1">{children}</div>}
        </div>

        {image?.src && (
          <div className="relative">
            <div className="w21-k-karte relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-ink-100 shadow-[0_2px_6px_rgba(15,23,42,0.06),0_40px_80px_-40px_rgba(3,18,43,0.55)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={image.src}
                alt={image.alt || ""}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="w21-k-foto object-cover"
                style={image.position ? { objectPosition: image.position } : undefined}
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-navy-950/0 to-transparent" />
              <div aria-hidden="true" className="w21-k-sweep" />
              <div aria-hidden="true" className="w21-k-kante absolute inset-x-10 top-0 h-px" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />
            </div>
            {badge && (
              <div className="absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs md:-left-8 md:right-auto">
                <div className="w21-auf" style={{ "--w21-d": "900ms" }}>
                  <div className="animate-ov-float rounded-2xl bg-white/95 p-5 shadow-2xl ring-1 ring-ink-100 backdrop-blur">{badge}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/** Mobil (< sm) sichtbare Punkte – der Rest erscheint ab sm. */
const MOBIL_PUNKTE = 2;

// Leads mit Pflicht- oder Quellenhinweisen werden nie gekürzt.
const PFLICHT_HINWEIS = /\b(Stand|Angaben|Symbolbild|Quelle|Hinweis|ohne Gewähr|inkl\.|zzgl\.|exkl\.)/i;
const KUERZEN_AB = 140; // Zeichen – bei 390 px etwa drei Zeilen ov-lead

/** H1: Wort für Wort aus der Maske (siehe w21-woerter). Erstes Wort ohne Verzögerung (LCP). */
function Titel({ children, className }) {
  return <h1 className={cn("ov-h1 w21-k-titel", className)}>{w21Woerter(children, { start: 0, schritt: 45, max: 360 })}</h1>;
}

/**
 * Lead – mobil bei langen Texten auf drei Zeilen gekürzt, per „mehr“ aufklappbar (CSS :has, ohne JS).
 * Screenreader lesen immer den ganzen Text (line-clamp kürzt nur die Darstellung).
 */
function Lead({ lead, klasse, kuerzen = true }) {
  if (!lead) return null;
  const kurz = kuerzen && typeof lead === "string" && lead.length > KUERZEN_AB && !PFLICHT_HINWEIS.test(lead);
  return (
    <div className={cn("w21-auf mt-6 max-sm:order-1", kurz && "w21-k-lead")} style={{ "--w21-d": "480ms" }}>
      <p className={cn(klasse, kurz && "max-sm:line-clamp-3")}>{lead}</p>
      {kurz && (
        <details className="w21-k-mehr sm:hidden">
          {/* Bleibt aufgeklappt sichtbar („weniger“) – der Tastaturfokus sitzt nie auf einem ausgeblendeten Element */}
          <summary className="inline-flex min-h-11 cursor-pointer items-center text-[15px] font-semibold underline underline-offset-4">
            <span className="w21-k-zu">mehr</span>
            <span className="w21-k-auf-text">weniger</span>
          </summary>
        </details>
      )}
    </div>
  );
}

function Kopfzeilen({ breadcrumbs, eyebrow, title, lead, points, actions, stats, leadKlasse = "text-white/75", breadcrumbKlasse, leadKuerzen }) {
  return (
    <>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} dark className={cn("w21-auf", breadcrumbKlasse)} />}
      <div className="flex max-w-3xl flex-col">
        {eyebrow && (
          <div className="w21-auf" style={{ "--w21-d": "60ms" }}>
            <Eyebrow dark className="mb-4 sm:mb-5">{eyebrow}</Eyebrow>
          </div>
        )}
        <Titel>{title}</Titel>
        <Lead lead={lead} kuerzen={leadKuerzen} klasse={cn("ov-lead max-w-2xl", leadKlasse)} />
        {/* Actions vor den Punkten: am Desktop steht der Primär-CTA auch bei langem Lead im ersten Bildschirm */}
        <Actions actions={actions} />
        <Punkte points={points} />
        <StatsDark stats={stats} />
      </div>
    </>
  );
}

function Punkte({ points }) {
  if (!points.length) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-2 max-sm:order-1 sm:mt-7">
      {points.map((p, i) => (
        <li
          key={p}
          className={cn(
            // Flächenfarbe statt Rahmen (keine harten Rahmen um Pillen)
            "w21-auf inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[13.5px] text-white/90 backdrop-blur-md",
            i >= MOBIL_PUNKTE && "max-sm:hidden"
          )}
          style={{ "--w21-d": `${600 + i * 60}ms` }}
        >
          <Check aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" strokeWidth={3} />
          {p}
        </li>
      ))}
    </ul>
  );
}

/** Handlungsaufrufe: mobil direkt unter der H1, nur per transform eingeblendet (nie unsichtbar). */
function Actions({ actions, dark = true }) {
  if (!actions.length) return null;
  return (
    <div className="w21-auf-t mt-5 flex flex-col gap-3 sm:mt-9 sm:flex-row" style={{ "--w21-d": "250ms" }}>
      {actions.map((a, i) => (
        <Button
          key={a.label}
          href={a.href}
          variant={a.variant || (i === 0 ? "primary" : dark ? "outlineLight" : "secondary")}
          size="lg"
          pfeil={i === 0}
          icon={a.icon}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
}

function StatsDark({ stats }) {
  if (!stats.length) return null;
  return (
    <dl className="w21-auf w21-k-stats relative mt-12 grid max-w-2xl grid-cols-3 gap-6 pt-8 max-sm:order-1" style={{ "--w21-d": "880ms" }}>
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] font-extrabold leading-none tracking-tight text-white">
            <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} prefix={s.prefix} />
          </dd>
          <dd className="mt-2 text-[13px] leading-snug text-white/60">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Horizontlinie am Fuß des Seitenkopfs mit einem einmaligen Lichtimpuls. */
function Horizont() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-px">
      <div className="w21-k-horizont absolute inset-0" />
      <div className="w21-k-impuls absolute left-0 top-0" />
    </div>
  );
}

function Immersive({ breadcrumbs, eyebrow, title, lead, image, actions, points, stats, signatur, leadKuerzen, children, className }) {
  return (
    <section data-blk="seitenkopf" data-variante="immersive" className={cn("w21-k ov-noise relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {image?.src && (
        <div className="absolute inset-0 -z-30">
          <Image
            src={image.src}
            alt={image.alt || ""}
            fill
            priority
            sizes="100vw"
            className="w21-k-foto object-cover"
            style={image.position ? { objectPosition: image.position } : undefined}
          />
        </div>
      )}
      <div aria-hidden="true" className="w21-k-licht absolute inset-0 -z-20" />
      <div aria-hidden="true" className="w21-k-sweep -z-10" />
      <div className="ov-container relative flex min-h-[560px] flex-col justify-end pb-16 pt-6 sm:pt-10 md:min-h-[640px] md:pb-20">
        {signatur && <W21Bogen id="w21-k-im" />}
        <Kopfzeilen {...{ breadcrumbs, eyebrow, title, lead, points, actions, stats, leadKuerzen }} breadcrumbKlasse="mb-auto pb-6 sm:pb-10" />
        {children && <div className="max-w-3xl">{children}</div>}
      </div>
      <Horizont />
    </section>
  );
}

function Dark({ breadcrumbs, eyebrow, title, lead, actions, points, stats, signatur, leadKuerzen, children, className }) {
  return (
    <section data-blk="seitenkopf" data-variante="dark" className={cn("w21-k ov-noise relative isolate overflow-hidden bg-navy-950 text-white", className)}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-20" />
      <div aria-hidden="true" className="w21-k-licht-dunkel absolute inset-0 -z-20" />
      <div aria-hidden="true" className="w21-k-sweep -z-10" />
      <div className="ov-container pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="relative">
          {signatur && <W21Bogen id="w21-k-dk" />}
          <Kopfzeilen {...{ breadcrumbs, eyebrow, title, lead, points, actions, stats, leadKuerzen }} leadKlasse="text-white/70" breadcrumbKlasse="mb-6 sm:mb-10" />
        </div>
        {children}
      </div>
      <Horizont />
    </section>
  );
}

const CSS = `
.w21-k{--w21-e:cubic-bezier(.16,1,.3,1)}
.w21-k-titel{text-wrap:balance}
.w21-k-titel .w21-m{display:inline-block;padding-bottom:.14em;margin-bottom:-.14em;clip-path:inset(-.45em -.3em 0 -.3em)}
.w21-k-titel .w21-w{display:inline-block}

/* Lead „mehr“: aufgeklappt volle Länge, der Knopf bleibt als „weniger“ stehen */
.w21-k-lead:has(> details[open]) > p{display:block;-webkit-line-clamp:unset;line-clamp:unset;overflow:visible}
.w21-k-mehr .w21-k-auf-text,.w21-k-mehr[open] .w21-k-zu{display:none}
.w21-k-mehr[open] .w21-k-auf-text{display:inline}
.w21-k-mehr > summary{list-style:none}
.w21-k-mehr > summary::-webkit-details-marker{display:none}

/* Lichtregie über dem Foto: Abdunklung zum Text, warmes Licht oben rechts, grüne Bodenglut */
.w21-k-licht{background:
  radial-gradient(70% 34% at 85% 0%,rgba(255,197,61,.12),transparent 70%),
  radial-gradient(90% 40% at 0% 100%,rgba(102,153,51,.2),transparent 70%),
  linear-gradient(180deg,rgba(3,18,43,.62) 0%,rgba(3,18,43,.7) 35%,rgba(3,18,43,.86) 70%,#03122b 100%)}
@media (min-width:768px){.w21-k-licht{background:
  radial-gradient(34% 42% at 84% 6%,rgba(255,197,61,.16),transparent 70%),
  radial-gradient(42% 62% at 0% 100%,rgba(102,153,51,.22),transparent 70%),
  linear-gradient(90deg,rgba(3,18,43,.95) 0%,rgba(3,18,43,.84) 30%,rgba(3,18,43,.46) 60%,rgba(3,18,43,.2) 100%),
  linear-gradient(180deg,rgba(3,18,43,.55) 0%,rgba(3,18,43,0) 22%,rgba(3,18,43,0) 58%,rgba(3,18,43,.92) 100%)}}
.w21-k-licht-dunkel{background:
  radial-gradient(38% 55% at 0% 70%,rgba(102,153,51,.22),transparent 70%),
  radial-gradient(34% 46% at 92% 0%,rgba(74,124,189,.3),transparent 70%),
  radial-gradient(30% 40% at 78% 92%,rgba(255,197,61,.08),transparent 70%)}
.w21-k-hof-hell{background:
  radial-gradient(40% 50% at 92% 0%,rgba(205,227,177,.55),transparent 70%),
  radial-gradient(30% 40% at 80% 100%,rgba(255,216,115,.16),transparent 70%)}

/* Lichtstreif – zieht einmal schräg über die Bühne */
.w21-k-sweep{position:absolute;top:-10%;bottom:-10%;left:0;width:30%;pointer-events:none;opacity:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.04) 38%,rgba(255,230,163,.08) 50%,rgba(255,255,255,.04) 62%,transparent);
  transform:translate3d(-120%,0,0) skewX(-14deg)}
.w21-k-hell .w21-k-sweep{width:45%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.1) 40%,rgba(255,240,200,.22) 50%,rgba(255,255,255,.1) 60%,transparent)}
.w21-k-kante{background:linear-gradient(90deg,transparent,rgba(255,255,255,.7) 35%,rgba(255,216,115,.75) 65%,transparent)}

/* Tagesbogen: Lage je Breakpoint; Basis auf dem Fuß des Inhaltsblocks */
.w21-k-bogen{--w21-r:150px;width:calc(var(--w21-r) * 2);height:var(--w21-r);bottom:0;left:calc(100% - var(--w21-r) * 1.1);z-index:-10;display:none}
@media (min-width:768px){.w21-k-bogen{display:block;--w21-r:clamp(240px,27vw,400px);left:calc(79% - var(--w21-r))}
  [data-variante=dark] .w21-k-bogen{--w21-r:clamp(220px,23vw,340px);left:calc(82% - var(--w21-r))}}
.w21-k-weg{stroke-dasharray:.6 2}
.w21-k-sonne{transform-box:view-box;transform-origin:100px 100px;transform:rotate(18deg)}
.w21-k-glut{transform-box:fill-box;transform-origin:center}

/* Horizont am Fuß */
.w21-k-horizont{transform-origin:left;background:linear-gradient(90deg,rgba(255,255,255,.02),rgba(255,255,255,.14) 20%,rgba(255,255,255,.14) 80%,rgba(255,255,255,.02))}
.w21-k-impuls{width:220px;height:3px;margin-top:-1px;border-radius:3px;opacity:0;
  background:linear-gradient(90deg,transparent,rgba(174,208,131,.85) 55%,#fff6dc 92%,transparent);box-shadow:0 0 16px 2px rgba(174,208,131,.35)}
.w21-k-stats::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;transform-origin:left;
  background:linear-gradient(90deg,rgba(174,208,131,.55),rgba(255,255,255,.15) 40%,rgba(255,255,255,.04))}

@media (prefers-reduced-motion:no-preference){
  .w21-k-foto{animation:w21-k-setzen 2600ms var(--w21-e) both}
  .w21-k .w21-auf{animation:w21-k-auf 900ms var(--w21-e) both;animation-delay:var(--w21-d,0ms)}
  .w21-k .w21-auf-t{animation:w21-k-hoch 700ms var(--w21-e) both;animation-delay:var(--w21-d,0ms)}
  .w21-k-titel .w21-w{animation:w21-k-wort 1050ms var(--w21-e) both;animation-delay:var(--w21-d,0ms)}
  .w21-k-sweep{animation:w21-k-sweep 2300ms cubic-bezier(.45,0,.25,1) 950ms both}
  .w21-k-kante{animation:w21-k-kante 1500ms var(--w21-e) 700ms both}
  .w21-k-karte{animation:w21-k-karte 1300ms var(--w21-e) 120ms both}
  .w21-k-weg{animation:w21-k-weg 1900ms cubic-bezier(.33,0,.12,1) 450ms both}
  .w21-k-sonne{animation:w21-k-sonne 1900ms cubic-bezier(.33,0,.12,1) 450ms both}
  .w21-k-glut{animation:w21-k-glut 1400ms var(--w21-e) 2300ms both}
  .w21-k-rest{animation:w21-k-ein 1400ms ease 1100ms both}
  .w21-k-horizont{animation:w21-k-x 1600ms var(--w21-e) 250ms both}
  .w21-k-impuls{animation:w21-k-impuls 2000ms cubic-bezier(.45,.05,.55,.95) 1300ms both}
  .w21-k-stats::before{animation:w21-k-x 1400ms var(--w21-e) 950ms both}
}
@keyframes w21-k-setzen{from{transform:scale(1.06)}}
@keyframes w21-k-auf{from{opacity:.01;transform:translate3d(0,16px,0)}}
@keyframes w21-k-hoch{from{transform:translate3d(0,12px,0)}}
@keyframes w21-k-wort{from{transform:translate3d(0,125%,0)}}
@keyframes w21-k-karte{from{transform:translate3d(0,28px,0) scale(.98)}}
@keyframes w21-k-kante{from{opacity:0;transform:scaleX(.2)}}
@keyframes w21-k-sweep{0%{opacity:0;transform:translate3d(-120%,0,0) skewX(-14deg)}15%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate3d(360%,0,0) skewX(-14deg)}}
@keyframes w21-k-weg{from{stroke-dashoffset:.6}}
@keyframes w21-k-sonne{from{transform:rotate(-90deg)}}
@keyframes w21-k-glut{0%{transform:scale(1)}40%{transform:scale(1.6)}100%{transform:scale(1)}}
@keyframes w21-k-ein{from{opacity:.01}}
@keyframes w21-k-x{from{transform:scaleX(0)}}
@keyframes w21-k-impuls{0%{opacity:0;transform:translate3d(-220px,0,0)}10%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate3d(100vw,0,0)}}
`;
