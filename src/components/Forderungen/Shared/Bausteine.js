import { ArrowUpRight, Check, CircleAlert, CalendarClock, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

/**
 * Wiederverwendbare Bausteine für die Rechts- und Förderseiten
 * (Steuerlich, Baurecht, Richtlinien, Förder-Check).
 */

/** Stand-Hinweis als Pille. */
export function StandPille({ children, dark = false, className }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px]",
        dark ? "ov-glass text-white/80" : "bg-white text-ink-600",
        className
      )}
    >
      <CalendarClock aria-hidden="true" className={cn("h-4 w-4", dark ? "text-ov-300" : "text-ov-600")} />
      {children}
    </p>
  );
}

/**
 * Vergleichstabelle: auf Desktop echte <table>, mobil gestapelte Karten.
 * spalten: [{ key, label, breite?, className? }] – breite (w-[..]) gilt für Kopf und Zelle, className nur für Zellen – die erste Spalte ist die Zeilenüberschrift.
 * zeilen:  [{ [key]: string | JSX }]
 */
export function Tabelle({ caption, spalten, zeilen, className, dicht = false }) {
  const [erste, ...rest] = spalten;
  const pad = dicht ? "px-5 py-3.5" : "px-6 py-5";
  return (
    <div className={className}>
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
              <tr key={i} className="align-top transition-colors hover:bg-ov-50/40">
                <th scope="row" className={cn(pad, "font-semibold text-ink-900", erste.breite, erste.className)}>{z[erste.key]}</th>
                {rest.map((s) => (
                  <td key={s.key} className={cn(pad, "leading-relaxed text-ink-700", s.breite, s.className)}>{z[s.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden">
        {zeilen.map((z, i) => (
          <li key={i} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
            <p className="font-display text-[17px] font-bold text-ink-900">{z[erste.key]}</p>
            <dl className="mt-3 space-y-2.5">
              {rest.map((s) => (
                <div key={s.key}>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">{s.label}</dt>
                  <dd className="mt-0.5 text-[15px] leading-relaxed text-ink-700">{z[s.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Checkliste mit Haken (ja) oder Kreuz (nein). items: [string | { title, text }] */
export function Checkliste({ items = [], variante = "ja", className, dark = false }) {
  const ja = variante === "ja";
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((it, i) => {
        const titel = typeof it === "string" ? it : it.title;
        const text = typeof it === "string" ? null : it.text;
        return (
          <li key={i} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                ja ? (dark ? "bg-ov-500/20 text-ov-300" : "bg-ov-100 text-ov-700") : dark ? "bg-white/10 text-white/60" : "bg-ink-100 text-ink-600"
              )}
            >
              {ja ? <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} /> : <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />}
            </span>
            <span className={cn("text-[15.5px] leading-relaxed", dark ? "text-white/75" : "text-ink-700")}>
              {text ? (
                <>
                  <strong className={dark ? "text-white" : "text-ink-900"}>{titel}</strong> – {text}
                </>
              ) : (
                titel
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Hervorgehobener Hinweis (Info/Warnung). */
export function Hinweis({ titel, children, ton = "info", className }) {
  const warn = ton === "warn";
  return (
    <div
      className={cn(
        "flex gap-4 rounded-3xl p-5 md:p-6",
        warn ? "bg-sun-300/25 ring-1 ring-sun-400/50" : "bg-ov-50 ring-1 ring-ov-100",
        className
      )}
    >
      <CircleAlert aria-hidden="true" className={cn("mt-0.5 h-5 w-5 shrink-0", warn ? "text-sun-500" : "text-ov-600")} />
      <div className="text-[15px] leading-relaxed text-ink-700">
        {titel && <p className="mb-1 font-display text-[16.5px] font-bold text-ink-900">{titel}</p>}
        {children}
      </div>
    </div>
  );
}

/**
 * Anleitung in nummerierten Schritten inkl. HowTo-Schema.
 * schritte: [{ name, text, icon? }]
 */
export function HowTo({ name, beschreibung, schritte = [], dauer, className }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description: beschreibung,
    ...(dauer ? { totalTime: dauer } : {}),
    step: schritte.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
  };
  return (
    <div className={className}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ol className="relative space-y-4">
        <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-ov-300 via-ov-200 to-transparent" />
        {schritte.map((s, i) => {
          const Icon = s.icon;
          return (
            <Reveal as="li" key={s.name} delay={i * 70} className="relative flex gap-5">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white font-display text-[17px] font-extrabold text-ov-600 shadow-sm ring-1 ring-ov-200">
                {Icon ? <Icon aria-hidden="true" className="h-6 w-6" /> : String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-6">
                <p className="font-display text-[18px] font-bold leading-snug text-ink-900">
                  <span className="mr-2 text-[14px] text-ov-500">{String(i + 1).padStart(2, "0")}</span>
                  {s.name}
                </p>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{s.text}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

/** Kennzahlenleiste unter dem Hero. items: [{ wert, label }] */
export function Kennzahlen({ items = [] }) {
  return (
    <div className="border-b border-ink-200/70 bg-white">
      <dl className="ov-container grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
        {items.map((k) => (
          <div key={k.label} className="pr-3 md:border-l md:border-ink-200 md:px-6 md:first:border-l-0 md:first:pl-0">
            <dt className="sr-only">{k.label}</dt>
            <dd className="ov-num font-display text-[clamp(1.6rem,1.2rem+1.5vw,2.4rem)] font-extrabold leading-none tracking-tight text-ink-900">{k.wert}</dd>
            <dd className="mt-2 text-[13.5px] leading-snug text-ink-500">{k.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Kennzeichnung für Werte, die nicht an einer Primärquelle belegt sind. */
export function PruefenMarke({ stand = "", className }) {
  return (
    <span className={cn("mt-1 inline-flex items-center gap-1 rounded-full bg-sun-300/35 px-2 py-0.5 text-[11.5px] font-semibold text-ink-800", className)}>
      <CircleAlert aria-hidden="true" className="h-3 w-3 text-sun-500" />
      {stand ? `Stand ${stand}, ` : ""}bitte bei der Förderstelle prüfen
    </span>
  );
}

const AMPEL_TON = {
  frei: "bg-ov-100 text-ov-800 ring-ov-200",
  anzeige: "bg-sun-300/40 text-ink-900 ring-sun-400/50",
  bewilligung: "bg-navy-100 text-navy-800 ring-navy-200",
};

/** Kleiner Status-Chip für die Rechts-Ampel (frei / Anzeige / Bewilligung). */
export function AmpelChip({ wert, label, className }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1", AMPEL_TON[wert] || AMPEL_TON.anzeige, className)}>
      {label}
    </span>
  );
}

/**
 * Quellenblock mit Prüfdatum – am Ende jeder Förder- und Rechtsseite.
 * quellen: [{ label, url }]
 */
export function Quellen({ quellen = [], stand, titel = "Quellen und Stand", hinweis, className, klappbar = false }) {
  const eindeutig = quellen.filter((q, i, a) => q?.url && a.findIndex((x) => x.url === q.url) === i);
  if (!eindeutig.length) return null;
  const Wrapper = klappbar ? "details" : "div";
  const Kopf = klappbar ? "summary" : "div";
  return (
    <Wrapper className={cn("group rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8", className)}>
      <Kopf className={cn("flex flex-col justify-between gap-3 md:flex-row md:items-center", klappbar && "cursor-pointer list-none outline-none focus-visible:ring-2 focus-visible:ring-ov-500 [&::-webkit-details-marker]:hidden")}>
        <h2 className="font-display text-[20px] font-bold text-ink-900">
          {titel}
          {klappbar && <span className="ml-2 align-middle text-[14px] font-semibold text-ink-500">({eindeutig.length} Primärquellen)</span>}
        </h2>
        <span className="flex items-center gap-3">
          {stand && <StandPille>Prüfdatum {stand}</StandPille>}
          {klappbar && (
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[18px] text-ink-700 transition-transform duration-300 group-open:rotate-45">+</span>
          )}
        </span>
      </Kopf>
      {hinweis && <p className="mt-3 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">{hinweis}</p>}
      <ol className="mt-5 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
        {eindeutig.map((q, i) => (
          <li key={q.url} className="flex gap-3 text-[14px] leading-snug">
            <span className="ov-num w-6 shrink-0 text-right text-ink-400">{i + 1}.</span>
            <a href={q.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-1 text-ink-700 underline decoration-ink-200 underline-offset-2 hover:text-ov-700 hover:decoration-ov-300">
              {q.label}
              <ArrowUpRight aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400 group-hover:text-ov-600" />
              <span className="sr-only">(externer Link, neues Fenster)</span>
            </a>
          </li>
        ))}
      </ol>
    </Wrapper>
  );
}
