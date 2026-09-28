import { CircleAlert, CalendarClock } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Bausteine für die Lösungsseiten (Gewerbe, Freifläche, Agri-PV, Speicher …).
 * Bewusst eigenständig, damit die Seiten nicht von den Förder-Bausteinen abhängen –
 * Optik identisch mit src/components/Forderungen/Shared/Bausteine.js.
 */

/** Stand-Hinweis als Pille. */
export function StandPille({ children, className }) {
  return (
    <p className={cn("inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] text-ink-600 ring-1 ring-ink-200", className)}>
      <CalendarClock aria-hidden="true" className="h-4 w-4 text-ov-600" />
      {children}
    </p>
  );
}

/**
 * Tabelle: auf Desktop echte <table>, mobil gestapelte Karten.
 * spalten: [{ key, label, breite?, className? }] – erste Spalte ist die Zeilenüberschrift.
 * zeilen:  [{ [key]: string | JSX, hervorheben?: boolean }]
 * fuss:    Quellen/Annahmen unter der Tabelle (JSX oder String)
 */
export function Tabelle({ caption, spalten, zeilen, fuss, className, dicht = false }) {
  const [erste, ...rest] = spalten;
  const pad = dicht ? "px-5 py-3.5" : "px-6 py-4";
  return (
    <figure className={className}>
      <div className="hidden overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 md:block">
        <table className="w-full border-collapse text-left text-[15px]">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="bg-navy-950 text-white">
              {spalten.map((s) => (
                <th key={s.key} scope="col" className={cn(dicht ? "px-5 py-3.5" : "px-6 py-4", "text-[12.5px] font-semibold uppercase tracking-wider", s.breite)}>
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {zeilen.map((z, i) => (
              <tr key={i} className={cn("align-top transition-colors", z.hervorheben ? "bg-ov-50 font-semibold" : "hover:bg-ov-50/40")}>
                <th scope="row" className={cn(pad, "font-semibold text-ink-900", erste.breite, erste.className)}>{z[erste.key]}</th>
                {rest.map((s) => (
                  <td key={s.key} className={cn(pad, "ov-num leading-relaxed text-ink-700", s.breite, s.className)}>{z[s.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden">
        {zeilen.map((z, i) => (
          <li key={i} className={cn("rounded-3xl p-5 ring-1", z.hervorheben ? "bg-ov-50 ring-ov-200" : "bg-white ring-ink-200/70")}>
            <p className="font-display text-[17px] font-bold text-ink-900">{z[erste.key]}</p>
            <dl className="mt-3 space-y-2.5">
              {rest.map((s) => (
                <div key={s.key}>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">{s.label}</dt>
                  <dd className="ov-num mt-0.5 text-[15px] leading-relaxed text-ink-700">{z[s.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      {fuss && <figcaption className="mt-4 text-[13.5px] leading-relaxed text-ink-500">{fuss}</figcaption>}
    </figure>
  );
}

/** Hervorgehobener Hinweis (Info/Warnung). */
export function Hinweis({ titel, children, ton = "info", className }) {
  const warn = ton === "warn";
  return (
    <div className={cn("flex gap-4 rounded-3xl p-5 md:p-6", warn ? "bg-sun-300/25 ring-1 ring-sun-400/50" : "bg-ov-50 ring-1 ring-ov-100", className)}>
      <CircleAlert aria-hidden="true" className={cn("mt-0.5 h-5 w-5 shrink-0", warn ? "text-sun-500" : "text-ov-600")} />
      <div className="text-[15px] leading-relaxed text-ink-700">
        {titel && <p className="mb-1 font-display text-[16.5px] font-bold text-ink-900">{titel}</p>}
        {children}
      </div>
    </div>
  );
}

/** Kennzahlenleiste unter dem Hero. items: [{ wert, label }] */
export function Kennzahlen({ items = [], quelle }) {
  return (
    <div className="border-b border-ink-200/70 bg-white">
      <div className="ov-container py-8 md:py-10">
        <dl className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
          {items.map((k) => (
            <div key={k.label} className="pr-3 md:border-l md:border-ink-200 md:px-6 md:first:border-l-0 md:first:pl-0">
              <dt className="sr-only">{k.label}</dt>
              <dd className="ov-num font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] font-extrabold leading-none tracking-tight text-ink-900">{k.wert}</dd>
              <dd className="mt-2 text-[13.5px] leading-snug text-ink-500">{k.label}</dd>
            </div>
          ))}
        </dl>
        {quelle && <p className="mt-6 text-[12.5px] leading-relaxed text-ink-400">{quelle}</p>}
      </div>
    </div>
  );
}

/**
 * Fachabschnitt: Überschrift links, Inhalt (Fließtext, Tabellen) rechts.
 * Der erste Absatz im Inhalt soll die Frage des Abschnitts direkt beantworten.
 */
export function Fachabschnitt({ id, eyebrow, title, lead, children, aside, className }) {
  return (
    <div id={id} className={cn("grid scroll-mt-24 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16", className)}>
      <div>
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
  return <div className={cn("ov-prose", className)}>{children}</div>;
}

/** Kleine Kartenreihe für Kennzahlen/Hebel mit Icon. items: [{ icon, titel, text }] */
export function Hebel({ items = [], cols = 3, className }) {
  const spalten = cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-3";
  return (
    <div className={cn("grid gap-4", spalten, className)}>
      {items.map((k) => (
        <div key={k.titel} className="rounded-2xl border border-ov-100 bg-white p-6">
          {k.icon && <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />}
          <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{k.titel}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{k.text}</p>
        </div>
      ))}
    </div>
  );
}

/** Bildnachweis für CC-Lizenzen. items: [{ motiv, urheber, lizenz, href }] */
export function Bildnachweis({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="bg-white">
      <p className="ov-container pb-6 text-[12px] leading-relaxed text-ink-400">
        Bildnachweis:{" "}
        {items.map((b, i) => (
          <span key={b.href}>
            {i > 0 && " · "}
            {b.motiv}: {b.urheber},{" "}
            <a href={b.href} target="_blank" rel="noopener noreferrer license" className="underline decoration-ink-300 hover:text-ink-600">
              {b.lizenz}
            </a>
          </span>
        ))}
      </p>
    </div>
  );
}
