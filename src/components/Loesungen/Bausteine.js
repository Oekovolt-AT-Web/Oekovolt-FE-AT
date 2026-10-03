import { CalendarClock, CircleAlert, Info, MoveHorizontal } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import W22Scroll from "./w22-scroll";

/**
 * Bausteine für die Lösungsseiten (Gewerbe, Freifläche, Agri-PV, Speicher …) – Präfix w22.
 * Bewusst eigenständig, damit die Seiten nicht von den Förder-Bausteinen abhängen.
 *
 * Gestaltung: ruhige, sehr gut lesbare Fachtypografie im Stil der Startseite – Tabellen mit
 * Lichtkante und Zeilen-Akzent, Hinweise mit Akzentbalken, Hebel-Karten mit Index und Hover-Licht.
 * Die Stile liegen einmalig im <head> (React-Stylesheet mit href/precedence, dedupliziert).
 */
function Stil() {
  return (
    <style href="w22-bausteine" precedence="w22">
      {CSS}
    </style>
  );
}

/** Stand-Hinweis als Pille. */
export function StandPille({ children, className }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full bg-white py-1 pl-1 pr-4 text-[13px] leading-snug text-ink-600",
        className
      )}
    >
      <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ov-50">
        <CalendarClock className="h-3.5 w-3.5 text-ov-600" />
      </span>
      {children}
    </p>
  );
}

/** Kompakte Tabellen (alle Werte kurze Texte/Zahlen) bleiben mobil eine echte, seitlich scrollbare Tabelle. */
function istKompakt(spalten, zeilen) {
  const rest = spalten.slice(1);
  return zeilen.every((z) =>
    rest.every((s) => {
      const v = z[s.key];
      if (v == null || v === "") return true;
      return (typeof v === "string" || typeof v === "number") && String(v).length <= 30;
    })
  );
}

/**
 * Tabelle: eine echte <table> für alle Breiten.
 * spalten: [{ key, label, breite?, className? }] – erste Spalte ist die Zeilenüberschrift.
 * zeilen:  [{ [key]: string | JSX, hervorheben?: boolean }]
 * fuss:    Quellen/Annahmen unter der Tabelle (JSX oder String)
 * mobil (optional): "karten" (Zeilen als Karten) | "scroll" (seitlich wischen, erste Spalte fixiert).
 *   Ohne Angabe: kurze Werte → "scroll", Fließtext-Zellen → "karten".
 */
export function Tabelle({ caption, spalten, zeilen, fuss, className, dicht = false, mobil }) {
  const [erste, ...rest] = spalten;
  const modus = mobil || (istKompakt(spalten, zeilen) ? "scroll" : "karten");
  const tabelle = (
    <table role="table" className={cn("w22t-tab", dicht && "w22t-dicht")} style={{ "--w22t-n": spalten.length }}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead role="rowgroup">
        <tr role="row">
          {spalten.map((s) => (
            <th key={s.key} scope="col" role="columnheader" className={s.breite}>
              {s.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody role="rowgroup">
        {zeilen.map((z, i) => (
          <tr key={i} role="row" className={z.hervorheben ? "w22t-hervor" : undefined}>
            <th scope="row" role="rowheader" className={cn(erste.breite, erste.className)}>
              {z[erste.key]}
            </th>
            {rest.map((s) => (
              <td key={s.key} role="cell" data-label={s.label} className={cn("ov-num", s.breite, s.className)}>
                {z[s.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <figure data-blk="tabelle" className={className}>
      <Stil />
      {modus === "scroll" ? (
        <W22Scroll className="w22t-huelle relative">
          <div data-w22-scroller="" tabIndex={0} role="region" aria-label={caption ? `${caption} (seitlich scrollbar)` : "Tabelle (seitlich scrollbar)"} className="w22t-rahmen w22t-scroll">
            {tabelle}
          </div>
          <span aria-hidden="true" className="w22t-fade" />
          <p aria-hidden="true" className="w22t-wisch mt-2.5 items-center gap-1.5 text-[12px] font-medium text-ink-500">
            <MoveHorizontal className="h-3.5 w-3.5 text-ov-600" /> Seitlich wischen für alle Spalten
          </p>
        </W22Scroll>
      ) : (
        <div className="w22t-rahmen w22t-karten">{tabelle}</div>
      )}
      {fuss && (
        <figcaption className="mt-4 flex gap-2.5 text-[13px] leading-relaxed text-ink-500">
          <span aria-hidden="true" className="mt-[0.6em] h-px w-4 shrink-0 bg-ink-300" />
          <span className="min-w-0">{fuss}</span>
        </figcaption>
      )}
    </figure>
  );
}

/** Hervorgehobener Hinweis (Info/Warnung). */
export function Hinweis({ titel, children, ton = "info", className }) {
  const warn = ton === "warn";
  const Icon = warn ? CircleAlert : Info;
  return (
    <div data-blk="hinweis" className={cn("w22h relative flex gap-4 overflow-hidden rounded-[1.5rem] p-5 pl-6 md:gap-5 md:p-6 md:pl-7", warn ? "w22h-warn" : "w22h-info", className)}>
      <Stil />
      <span aria-hidden="true" className="w22h-balken absolute bottom-0 left-0 top-0 w-[3px]" />
      <span aria-hidden="true" className="w22h-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 pt-0.5 text-[15px] leading-relaxed text-ink-700 [text-wrap:pretty]">
        {titel && <p className="mb-1.5 font-display text-[16.5px] font-bold leading-snug tracking-[-0.01em] text-ink-900">{titel}</p>}
        {children}
      </div>
    </div>
  );
}

/** Kennzahlenleiste unter dem Hero (helle Variante, statische Werte). items: [{ wert, label }] */
export function Kennzahlen({ items = [], quelle }) {
  return (
    <div data-blk="kennzahlen-hell" className="border-b border-ink-200/70 bg-white">
      <div className="ov-container py-9 md:py-11">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-0">
          {items.map((k) => (
            <div key={k.label} className="relative flex flex-col-reverse justify-end border-t border-ink-200 pt-5 md:mr-8">
              <span aria-hidden="true" className="absolute -top-px left-0 h-[2px] w-10 bg-linear-to-r from-ov-500 to-ov-300" />
              <dt className="mt-2.5 text-[13.5px] leading-snug text-ink-500">{k.label}</dt>
              <dd className="ov-num font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] font-extrabold leading-none tracking-[-0.035em] text-ink-900">{k.wert}</dd>
            </div>
          ))}
        </dl>
        {quelle && <p className="mt-7 text-[12.5px] leading-relaxed text-ink-400">{quelle}</p>}
      </div>
    </div>
  );
}

/**
 * Fachabschnitt: Überschrift links (ab lg mitlaufend), Inhalt (Fließtext, Tabellen) rechts.
 * Der erste Absatz im Inhalt soll die Frage des Abschnitts direkt beantworten.
 */
export function Fachabschnitt({ id, eyebrow, title, lead, children, aside, className }) {
  return (
    <div id={id} className={cn("grid scroll-mt-24 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16", className)}>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        {aside && <div className="mt-8">{aside}</div>}
      </div>
      <Reveal delay={100} className="min-w-0">
        {children}
      </Reveal>
    </div>
  );
}

/** Fließtext mit einheitlicher Typografie (Links, Listen, Zwischenüberschriften). */
export function Prosa({ children, className }) {
  return (
    <div className={cn("ov-prose w22p", className)}>
      <Stil />
      {children}
    </div>
  );
}

/** Kartenreihe für Kennzahlen/Hebel mit Icon. items: [{ icon, titel, text }] */
export function Hebel({ items = [], cols = 3, className }) {
  const spalten = cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-3";
  return (
    <div data-blk="hebel" className={cn("grid gap-4 md:gap-5", spalten, className)}>
      <Stil />
      {items.map((k, i) => (
        <Reveal key={k.titel} delay={i * 90} className="h-full">
          <div className="w22e group relative h-full overflow-hidden rounded-[1.5rem] bg-linear-to-b from-sand-50 to-white p-6 md:p-7">
            <span aria-hidden="true" className="w22e-kante absolute inset-x-6 top-0 h-[2px] rounded-b-full" />
            <div className="flex items-start justify-between gap-4">
              {k.icon ? (
                <span aria-hidden="true" className="w22e-icon flex h-12 w-12 items-center justify-center rounded-2xl">
                  <k.icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </span>
              ) : (
                <span />
              )}
              <span aria-hidden="true" className="ov-num pt-1 font-display text-[12px] font-bold tracking-[0.08em] text-ink-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-5 font-display text-[18px] font-bold leading-snug tracking-[-0.015em] text-ink-900 md:text-[19px]">{k.titel}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600 [text-wrap:pretty]">{k.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Bildnachweis für CC-Lizenzen. items: [{ motiv, urheber, lizenz, href }] */
export function Bildnachweis({ items = [] }) {
  if (!items.length) return null;
  return (
    <div data-blk="bildnachweis" className="bg-white">
      <p className="ov-container pb-7 pt-1 text-[12px] leading-relaxed text-ink-400">
        <span className="font-semibold text-ink-500">Bildnachweis:</span>{" "}
        {items.map((b, i) => (
          <span key={b.href}>
            {i > 0 && <span aria-hidden="true" className="px-1 text-ink-300">·</span>}
            {i > 0 && " "}
            {b.motiv}: {b.urheber},{" "}
            <a
              href={b.href}
              target="_blank"
              rel="noopener noreferrer license"
              className="rounded-sm underline decoration-ink-300 underline-offset-2 transition-colors hover:text-ov-700 hover:decoration-ov-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-500"
            >
              {b.lizenz}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}

const CSS = `
/* ===== Tabelle ===== */
.w22t-rahmen{position:relative;border-radius:1.5rem;background:#fff;
  box-shadow:0 0 0 1px rgba(223,227,234,.85),0 24px 48px -36px rgba(3,18,43,.35)}
.w22t-karten::before,.w22t-huelle::before{content:"";position:absolute;left:0;right:0;top:0;height:1.5px;z-index:3;pointer-events:none;
  background:linear-gradient(90deg,transparent,#8cba58 14%,#aed083 45%,#ffd873 72%,transparent 92%)}
.w22t-tab{width:100%;border-collapse:separate;border-spacing:0;text-align:left;font-size:15px}
.w22t-tab thead th{background:var(--color-navy-950);color:rgba(255,255,255,.82);font-size:11.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;
  padding:17px 24px 15px;vertical-align:bottom}
.w22t-tab thead th:first-child{border-top-left-radius:1.5rem;color:#fff}
.w22t-tab thead th:last-child{border-top-right-radius:1.5rem}
.w22t-tab tbody th,.w22t-tab tbody td{padding:16px 24px;vertical-align:top;border-top:1px solid var(--color-ink-100);background:#fff;transition:background-color 250ms}
.w22t-tab tbody tr:first-child > *{border-top:0}
.w22t-tab tbody th{position:relative;font-weight:600;color:var(--color-ink-900);line-height:1.45}
.w22t-tab tbody td{color:var(--color-ink-700);line-height:1.6}
.w22t-tab tbody tr:last-child th{border-bottom-left-radius:1.5rem}
.w22t-tab tbody tr:last-child td:last-child{border-bottom-right-radius:1.5rem}
.w22t-dicht thead th{padding:15px 20px 13px}
.w22t-dicht tbody th,.w22t-dicht tbody td{padding:14px 20px}
.w22t-tab tbody th::before{content:"";position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:0 3px 3px 0;
  background:linear-gradient(180deg,#8cba58,#669933);transform:scaleY(0);transform-origin:50% 50%;transition:transform 350ms cubic-bezier(.22,1,.36,1)}
@media (hover:hover){
  .w22t-tab tbody tr:hover > *{background:#f8fbf4}
  .w22t-tab tbody tr:hover th::before{transform:scaleY(1)}
}
.w22t-tab tbody tr.w22t-hervor > *{background:var(--color-ov-50);font-weight:600;color:var(--color-ink-900)}
.w22t-tab tbody tr.w22t-hervor th::before{transform:scaleY(1)}

/* Seitlich scrollbar (kompakte Tabellen) – erste Spalte bleibt stehen.
   contain:inline-size: die breite Tabelle zählt nicht zur Mindestbreite des umgebenden Rasters. */
.w22t-huelle{contain:inline-size}
.w22t-scroll{overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:thin;scrollbar-color:var(--color-ink-300) transparent}
.w22t-scroll:focus-visible{outline:2px solid var(--color-ov-500);outline-offset:3px}
.w22t-scroll .w22t-tab tbody th,.w22t-scroll .w22t-tab thead th:first-child{position:sticky;left:0;z-index:2}
.w22t-scroll .w22t-tab tbody th{min-width:8.5rem}
.w22t-scroll .w22t-tab tbody th::after{content:"";position:absolute;top:0;bottom:0;right:-14px;width:14px;pointer-events:none;opacity:0;transition:opacity 250ms;
  background:linear-gradient(90deg,rgba(3,18,43,.08),transparent)}
[data-w22-links] .w22t-scroll .w22t-tab tbody th::after{opacity:1}
.w22t-fade{position:absolute;top:2px;right:0;bottom:0;width:44px;pointer-events:none;border-radius:0 1.5rem 1.5rem 0;opacity:0;transition:opacity 250ms;
  background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.95))}
.w22t-huelle[data-w22-rechts] .w22t-fade{opacity:1}
.w22t-huelle:has(.w22t-wisch) .w22t-fade{bottom:calc(12px + 1.15rem + .625rem)}
.w22t-wisch{display:none}
@media (max-width:767px){
  .w22t-huelle[data-w22-scrollbar] .w22t-wisch{display:flex}
  .w22t-scroll .w22t-tab tbody td,.w22t-scroll .w22t-tab thead th{white-space:nowrap}
  .w22t-scroll .w22t-tab{font-size:14.5px}
  .w22t-scroll .w22t-tab thead th{padding:14px 16px 12px}
  .w22t-scroll .w22t-tab tbody th,.w22t-scroll .w22t-tab tbody td{padding:13px 16px}
  .w22t-scroll .w22t-tab tbody th{min-width:7.5rem;max-width:10rem}
}
@media (min-width:768px){.w22t-huelle .w22t-fade{bottom:0}}

/* Mobil: Fließtext-Tabellen als Karten (gleiche Tabelle, nur anders gesetzt) */
@media (max-width:767px){
  .w22t-karten{background:transparent;box-shadow:none;border-radius:0}
  .w22t-karten::before{display:none}
  .w22t-karten .w22t-tab,.w22t-karten .w22t-tab tbody,.w22t-karten .w22t-tab tr,.w22t-karten .w22t-tab th,.w22t-karten .w22t-tab td{display:block;width:auto!important}
  .w22t-karten .w22t-tab thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
  .w22t-karten .w22t-tab tbody{display:grid;gap:12px}
  .w22t-karten .w22t-tab tbody tr{position:relative;overflow:hidden;border-radius:1.25rem;background:#fff;padding:18px 20px 12px;
    box-shadow:0 0 0 1px rgba(223,227,234,.9),0 18px 36px -30px rgba(3,18,43,.35)}
  .w22t-karten .w22t-tab tbody tr::before{content:"";position:absolute;left:0;right:0;top:0;height:2px;background:linear-gradient(90deg,#8cba58,#aed083 60%,transparent)}
  .w22t-karten .w22t-tab tbody tr > *{background:transparent!important;border:0;border-radius:0!important;padding:0}
  .w22t-karten .w22t-tab tbody th{font-family:var(--font-display);font-size:17px;font-weight:700;letter-spacing:-.01em;line-height:1.3;
    padding-bottom:12px;margin-bottom:10px;border-bottom:1px solid var(--color-ink-100)}
  .w22t-karten .w22t-tab tbody th::before{display:none}
  .w22t-karten .w22t-tab tbody td{padding:7px 0 9px;font-size:15px;line-height:1.55}
  .w22t-karten .w22t-tab tbody td + td{border-top:1px dashed var(--color-ink-100)}
  .w22t-karten .w22t-tab tbody td::before{content:attr(data-label);display:block;margin-bottom:3px;font-size:11px;font-weight:600;letter-spacing:.11em;text-transform:uppercase;color:var(--color-ink-500)}
  .w22t-karten .w22t-tab tbody tr.w22t-hervor{background:var(--color-ov-50);box-shadow:0 0 0 1px var(--color-ov-200),0 18px 36px -30px rgba(3,18,43,.35)}
}

/* ===== Hinweis ===== */
.w22h-info{background:linear-gradient(120deg,var(--color-ov-50),#fff 85%);box-shadow:inset 0 0 0 1px var(--color-ov-100)}
.w22h-info .w22h-balken{background:linear-gradient(180deg,#8cba58,#558227)}
.w22h-info .w22h-icon{background:#fff;color:var(--color-ov-600);box-shadow:inset 0 0 0 1px var(--color-ov-200),0 6px 14px -8px rgba(85,130,39,.4)}
.w22h-warn{background:linear-gradient(120deg,rgba(255,216,115,.2),#fffdf6 85%);box-shadow:inset 0 0 0 1px rgba(255,197,61,.45)}
.w22h-warn .w22h-balken{background:linear-gradient(180deg,#ffc53d,#f5a70f)}
.w22h-warn .w22h-icon{background:#fff;color:#b87500;box-shadow:inset 0 0 0 1px rgba(255,197,61,.55),0 6px 14px -8px rgba(245,167,15,.45)}
.w22h a{color:var(--color-ov-700);text-decoration:underline;text-decoration-color:var(--color-ov-300);text-underline-offset:3px}
.w22h a:hover{text-decoration-color:currentColor}

/* ===== Prosa ===== */
.w22p :where(p,li){text-wrap:pretty}
.w22p a{text-decoration-thickness:1px;text-underline-offset:3px;transition:color 200ms,text-decoration-color 200ms}
.w22p a:hover{color:var(--color-ov-800);text-decoration-color:var(--color-ov-500)}
.w22p a:focus-visible{outline:2px solid var(--color-ov-500);outline-offset:2px;border-radius:3px}
.w22p strong{font-weight:650}
.w22p :where(h2,h3,h4){font-family:var(--font-display);letter-spacing:-.015em}
.w22p ul{list-style:none;padding-left:0}
.w22p ul > li{position:relative;padding-left:1.5em}
.w22p ul > li::before{content:"";position:absolute;left:.2em;top:calc(.875em - 3px);width:6px;height:6px;border-radius:999px;
  background:var(--color-ov-500);box-shadow:0 0 0 3px var(--color-ov-100)}
.w22p ul:not([class*="grid"]) > li + li,.w22p ol > li + li{margin-top:.5em}
.w22p ol{list-style:none;padding-left:0;counter-reset:w22p}
.w22p ol > li{position:relative;padding-left:2.1em;counter-increment:w22p}
.w22p ol > li::before{content:counter(w22p);position:absolute;left:0;top:calc(.875em - 11px);width:22px;height:22px;border-radius:999px;
  font-family:var(--font-display);font-size:11.5px;font-weight:800;line-height:22px;text-align:center;
  color:var(--color-ov-700);background:var(--color-ov-50);box-shadow:inset 0 0 0 1px var(--color-ov-200)}

/* ===== Hebel ===== */
.w22e{box-shadow:0 0 0 1px var(--color-ink-200),0 1px 2px rgba(3,18,43,.04);transition:transform 450ms cubic-bezier(.22,1,.36,1),box-shadow 450ms cubic-bezier(.22,1,.36,1)}
.w22e-kante{background:linear-gradient(90deg,#8cba58,#669933 45%,#ffc53d);transform:scaleX(.18);transform-origin:0 50%;transition:transform 700ms cubic-bezier(.22,1,.36,1)}
.w22e-icon{color:var(--color-ov-600);background:var(--color-ov-50);box-shadow:inset 0 0 0 1px var(--color-ov-100);transition:background-color 350ms,color 350ms,box-shadow 350ms}
@media (hover:hover){
  .w22e:hover{box-shadow:0 0 0 1px var(--color-ov-200),0 2px 6px -2px rgba(3,18,43,.06),0 26px 50px -26px rgba(3,18,43,.28)}
  .w22e:hover .w22e-kante{transform:scaleX(1)}
  .w22e:hover .w22e-icon{background:var(--color-ov-500);color:#fff;box-shadow:0 10px 22px -10px rgba(102,153,51,.7)}
}
@media (hover:hover) and (prefers-reduced-motion:no-preference){.w22e:hover{transform:translate3d(0,-3px,0)}}
`;
