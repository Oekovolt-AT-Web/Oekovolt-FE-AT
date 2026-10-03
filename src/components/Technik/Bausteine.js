import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowUpRight, ExternalLink, Info, MessageSquareQuote, MoveHorizontal, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

/*
 * Wiederkehrende Bausteine der Technik-Seiten (/technik/*) sowie der Seiten
 * Direktvermarktung und Stromtarif. Alles Server-Komponenten im Corporate
 * Design (Farbtokens ov-*, ink-*, sand-*, navy-*), keine neuen Bibliotheken.
 * Gestaltung (Welle 2): Lichtkanten statt harter Rahmen, ruhige Akzentlinien,
 * Hover-Zustände nur über transform/opacity/Farbe. Wurzelelemente tragen
 * `data-blk`, damit sie gezielt geprüft werden können.
 */

/** Feine Lichtkante oben an Karten (dekorativ). */
function Lichtkante({ dunkel = false, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent to-transparent", dunkel ? "via-white/35" : "via-white", className)}
    />
  );
}

/**
 * Zitierfähige Kurzantwort direkt unter dem Seitenkopf (GEO: erster Satz beantwortet die Frage).
 * frage: die implizite Suchfrage, antwort: 2–4 Sätze.
 */
export function Kurzantwort({ frage, children, className }) {
  return (
    <section data-blk="kurzantwort" aria-label="Kurz beantwortet" className={cn("border-b border-ink-200/70 bg-white", className)}>
      <div className="ov-container py-10 md:py-12">
        <Reveal className="relative grid gap-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-sand-50 to-white p-6 ring-1 ring-ink-200/60 md:grid-cols-[auto_1fr] md:gap-7 md:p-8">
          <Lichtkante />
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-ov-500 to-ov-700 text-white shadow-[0_10px_24px_-10px_rgba(85,130,39,0.7)]">
            <MessageSquareQuote aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[18px] font-bold leading-snug text-ink-900 md:text-[20px]">{frage}</h2>
            <div className="mt-2.5 max-w-[70ch] space-y-3 text-[16px] leading-relaxed text-ink-700 md:text-[16.5px]">{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const HINWEIS_TOENE = {
  info: {
    icon: Info,
    box: "bg-gradient-to-br from-ov-50 to-white ring-ov-200/80",
    ic: "bg-gradient-to-br from-ov-500 to-ov-700 text-white shadow-[0_10px_22px_-10px_rgba(85,130,39,0.75)]",
    akzent: "from-ov-400 to-ov-600",
  },
  norm: {
    icon: Scale,
    box: "bg-gradient-to-br from-sand-50 to-white ring-ink-200/80",
    ic: "bg-gradient-to-br from-navy-600 to-navy-800 text-white shadow-[0_10px_22px_-10px_rgba(0,52,115,0.6)]",
    akzent: "from-navy-400 to-navy-700",
  },
  achtung: {
    icon: AlertTriangle,
    box: "bg-gradient-to-br from-sand-100 to-sand-50 ring-sun-300",
    ic: "bg-gradient-to-br from-sun-300 to-sun-400 text-navy-950 shadow-[0_10px_22px_-10px_rgba(245,167,15,0.7)]",
    akzent: "from-sun-300 to-sun-500",
  },
  dunkel: {
    icon: Info,
    box: "bg-white/[0.05] ring-white/15 text-white",
    ic: "bg-gradient-to-br from-ov-400 to-ov-600 text-white shadow-[0_10px_24px_-10px_rgba(140,186,88,0.6)]",
    akzent: "from-ov-300 to-ov-500",
  },
};

/** Hervorgehobener Fach- oder Normhinweis. ton: info | norm | achtung | dunkel */
export function Hinweis({ ton = "info", titel, children, className }) {
  const t = HINWEIS_TOENE[ton] || HINWEIS_TOENE.info;
  const Icon = t.icon;
  const dunkel = ton === "dunkel";
  return (
    <Reveal
      data-blk="hinweis"
      className={cn("relative grid grid-cols-[auto_minmax(0,1fr)] content-start items-start gap-x-4 overflow-hidden rounded-3xl p-5 pl-6 ring-1 md:gap-x-5 md:p-6 md:pl-7", t.box, className)}
    >
      <span aria-hidden="true" className={cn("absolute left-0 top-5 h-10 w-[3px] rounded-r-full bg-gradient-to-b md:top-6", t.akzent)} />
      <Lichtkante dunkel={dunkel} />
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:row-span-2", t.ic)}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      {titel && <p className={cn("pt-2 font-display text-[16.5px] font-bold leading-snug sm:pt-1.5", dunkel ? "text-white" : "text-ink-900")}>{titel}</p>}
      <div
        className={cn(
          "col-span-2 min-w-0 space-y-2 text-[15px] leading-relaxed sm:col-span-1 sm:col-start-2",
          titel ? "mt-3 sm:mt-1.5" : "mt-3 sm:row-span-2 sm:row-start-1 sm:mt-0 sm:pt-1.5",
          dunkel ? "text-white/75" : "text-ink-700"
        )}
      >
        {children}
      </div>
    </Reveal>
  );
}

/**
 * Datentabelle – zitierfähig, mit echter <caption> und Zeilenköpfen.
 * kopf: ["Spalte", …], zeilen: [[zelle, …], …] (erste Zelle = Zeilenkopf)
 * hervor: Index einer hervorgehobenen Spalte, quelle: Fußnote
 * Breite Tabellen scrollen mobil seitlich; die Zeilenköpfe bleiben dabei stehen.
 */
export function Tabelle({ caption, kopf = [], zeilen = [], hervor, quelle, kompakt = false, minBreite = 680, className }) {
  const breit = minBreite > 420;
  return (
    <Reveal data-blk="tabelle" className={cn("min-w-0", className)}>
      <figure className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_48px_-32px_rgba(15,23,42,0.22)] ring-1 ring-ink-200/70">
        {caption && (
          <div className="flex items-center gap-3 border-b border-ink-200/70 bg-gradient-to-r from-sand-50 to-white px-5 py-4 md:px-6">
            <span aria-hidden="true" className="h-5 w-1 shrink-0 rounded-full bg-gradient-to-b from-ov-400 to-ov-600" />
            <p aria-hidden="true" className="font-display text-[16.5px] font-bold leading-snug text-ink-900">
              {caption}
            </p>
          </div>
        )}
        {breit && (
          <p aria-hidden="true" className="flex items-center gap-2 border-b border-ink-100 px-5 py-2 text-[12px] font-medium text-ink-500 md:hidden">
            <MoveHorizontal className="h-3.5 w-3.5 text-ov-600" />
            Seitlich wischen für alle Spalten
          </p>
        )}
        <div className="overflow-x-auto">
          <table className={cn("w-full border-collapse text-left", kompakt ? "text-[14px]" : "text-[15px]")} style={{ minWidth: minBreite }}>
            {caption && <caption className="sr-only">{caption}</caption>}
            {kopf.length > 0 && (
              <thead>
                <tr className="border-b border-ink-200/70">
                  {kopf.map((k, i) => (
                    <th
                      key={`${k}-${i}`}
                      scope="col"
                      className={cn(
                        "px-5 py-3.5 align-bottom text-[12px] font-semibold uppercase tracking-[0.1em] md:px-6",
                        i === hervor ? "relative bg-gradient-to-b from-navy-800 to-navy-950 text-white" : "bg-ink-50/70 text-ink-500",
                        i === 0 && breit && "sticky left-0 z-[1] max-md:shadow-[6px_0_12px_-8px_rgba(15,23,42,0.25)]"
                      )}
                    >
                      {i === hervor && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-ov-300 to-ov-500" />}
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {zeilen.map((z, zi) => (
                <tr key={zi} className="group/zeile border-b border-ink-100 transition-colors last:border-b-0 hover:bg-sand-50/70">
                  {z.map((zelle, i) =>
                    i === 0 ? (
                      <th
                        key={i}
                        scope="row"
                        className={cn(
                          "min-w-[7.5rem] px-5 py-4 align-top font-display text-[15px] font-bold leading-snug text-ink-900 md:px-6",
                          breit && "sticky left-0 z-[1] bg-white transition-colors group-hover/zeile:bg-sand-50 max-md:shadow-[6px_0_12px_-8px_rgba(15,23,42,0.25)]"
                        )}
                      >
                        {zelle}
                      </th>
                    ) : (
                      <td
                        key={i}
                        className={cn("px-5 py-4 align-top leading-relaxed md:px-6", i === hervor ? "bg-ov-50/70 font-medium text-ink-800" : "text-ink-700")}
                      >
                        {zelle}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {quelle && <figcaption className="border-t border-ink-200/70 bg-sand-50/50 px-5 py-3.5 text-[13px] leading-relaxed text-ink-500 md:px-6">{quelle}</figcaption>}
      </figure>
    </Reveal>
  );
}

/** Kompakte Definitionsliste für Kennwerte/Parameter (z. B. „Standardeinstellung nach TOR“). */
export function Kennwerte({ items = [], dunkel = false, className }) {
  return (
    <dl
      data-blk="kennwerte"
      className={cn("grid gap-px overflow-hidden rounded-[1.75rem] sm:grid-cols-2", dunkel ? "bg-white/10 ring-1 ring-white/10" : "bg-ink-200/70 ring-1 ring-ink-200/70", className)}
    >
      {items.map((k, i) => (
        <Reveal key={k.label} delay={(i % 4) * 60} className={cn("group relative p-5 transition-colors duration-500 md:p-6", dunkel ? "bg-navy-950 hover:bg-navy-900" : "bg-white hover:bg-sand-50/60")}>
          <span aria-hidden="true" className={cn("mb-3 block h-0.5 w-7 rounded-full transition-all duration-500 group-hover:w-12", dunkel ? "bg-ov-300" : "bg-ov-500")} />
          <dt className={cn("text-[12.5px] font-semibold uppercase tracking-[0.12em]", dunkel ? "text-white/55" : "text-ink-500")}>{k.label}</dt>
          <dd className={cn("mt-1.5 font-display text-[20px] font-extrabold leading-snug tracking-tight", dunkel ? "text-white" : "text-ink-900")}>{k.wert}</dd>
          {k.text && <dd className={cn("mt-1 text-[14px] leading-relaxed", dunkel ? "text-white/60" : "text-ink-600")}>{k.text}</dd>}
        </Reveal>
      ))}
    </dl>
  );
}

/** Aufzählung mit fachlichen Punkten (Titel + Text), optional mit Normbezug als Tag. */
export function Punkte({ items = [], dunkel = false, spalten = 2, className }) {
  return (
    <ul data-blk="punkte" className={cn("grid gap-4", spalten === 2 ? "md:grid-cols-2" : spalten === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "", className)}>
      {items.map((p, i) => (
        <Reveal
          as="li"
          key={p.titel}
          delay={(i % 4) * 60}
          className={cn(
            "group ov-card-hover relative overflow-hidden rounded-3xl p-6 ring-1 transition-colors duration-500",
            dunkel ? "bg-white/[0.04] ring-white/10 hover:bg-white/[0.07] hover:ring-ov-300/30" : "bg-white ring-ink-200/70 hover:ring-ov-300/70"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
              dunkel ? "via-ov-300" : "via-ov-500"
            )}
          />
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span aria-hidden="true" className={cn("ov-num mt-[3px] font-display text-[12.5px] font-extrabold tracking-wide", dunkel ? "text-ov-300" : "text-ov-600")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={cn("min-w-0 font-display text-[17.5px] font-bold leading-snug", dunkel ? "text-white" : "text-ink-900")}>{p.titel}</h3>
            </div>
            {p.tag && (
              <span className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold tracking-wide ring-1", dunkel ? "bg-white/[0.06] text-white/75 ring-white/10" : "bg-sand-50 text-ink-600 ring-ink-200/70")}>
                {p.tag}
              </span>
            )}
          </div>
          <div className={cn("mt-2.5 space-y-2 text-[15px] leading-relaxed sm:pl-[30px]", dunkel ? "text-white/65" : "text-ink-600")}>
            {Array.isArray(p.text) ? p.text.map((t, j) => <p key={j}>{t}</p>) : <p>{p.text}</p>}
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * Thematische Querverweise im Stil von Reusable/Querverweise – mit direkt
 * übergebenen Zielen (die zentrale Liste in @/data/verlinkung ist eine
 * gemeinsame Datei und wird hier bewusst nicht verändert).
 * items: [{ href, titel, text }]
 */
export function Verweise({ items = [], ueberschrift = "Weiterlesen" }) {
  if (!items.length) return null;
  return (
    <section data-blk="verweise" aria-labelledby="verweise-titel" className="bg-white">
      <div className="ov-container py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-ink-200 pb-6">
          <h2 id="verweise-titel" className="ov-h3 text-ink-900 md:text-[28px]">
            {ueberschrift}
          </h2>
          <span aria-hidden="true" className="ov-num hidden font-display text-[13px] font-bold tracking-[0.14em] text-ink-400 sm:block">
            {String(items.length).padStart(2, "0")} THEMEN
          </span>
        </div>
        <ul className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((v, i) => (
            <Reveal as="li" key={v.href} delay={i * 70} className="flex">
              <article className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 transition-colors duration-500 focus-within:ring-2 focus-within:ring-ov-500 hover:bg-white hover:ring-ov-300/70">
                <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ov-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="mb-6 flex items-center justify-between">
                  <span aria-hidden="true" className="ov-num font-display text-[12.5px] font-extrabold tracking-wide text-ov-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-400 ring-1 ring-ink-200 transition-all duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </div>
                <h3 className="font-display text-[18px] font-bold leading-snug text-ink-900">
                  <Link href={v.href} className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-['']">
                    {v.titel}
                  </Link>
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{v.text}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Quellen, Normen und Rechtsgrundlagen am Seitenende. items: [{ titel, href?, hinweis? }] */
export function Quellen({ items = [], stand = "September 2026", titel = "Quellen, Normen & Rechtsgrundlagen", bildnachweis }) {
  if (!items.length) return null;
  return (
    <Section tone="white" space="sm" aria-labelledby="quellen-titel" data-blk="quellen">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
        <Lichtkante />
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="quellen-titel" className="font-display text-[19px] font-bold text-ink-900">
            {titel}
          </h2>
          <p className="text-[13px] text-ink-500">Stand: {stand} · Angaben ohne Gewähr, keine Rechtsberatung</p>
        </div>
        <ol className="mt-5 grid gap-x-8 gap-y-2.5 text-[14.5px] leading-relaxed md:grid-cols-2">
          {items.map((q, i) => (
            <li key={q.href || q.titel} className="flex gap-2.5">
              <span className="ov-num mt-px shrink-0 font-semibold text-ov-700">[{i + 1}]</span>
              <span className="min-w-0">
                {q.href ? (
                  <a href={q.href} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-800 underline decoration-ink-300 underline-offset-2 hover:text-ov-700 hover:decoration-current">
                    {q.titel}
                    <ExternalLink aria-hidden="true" className="ml-1 inline h-3.5 w-3.5 align-[-2px] text-ink-400" />
                  </a>
                ) : (
                  <span className="font-medium text-ink-800">{q.titel}</span>
                )}
                {q.hinweis && <span className="text-ink-500"> – {q.hinweis}</span>}
              </span>
            </li>
          ))}
        </ol>
        {bildnachweis && <p className="mt-6 border-t border-ink-200/70 pt-4 text-[12.5px] leading-relaxed text-ink-500">Bildnachweis: {bildnachweis}</p>}
      </div>
    </Section>
  );
}

/** Gezeichneter Unterlagen-Stapel (dekorativ). */
function Unterlagen({ dunkel }) {
  const blatt = dunkel ? "#0b2a5c" : "#eef4fb";
  const rand = dunkel ? "rgba(255,255,255,0.28)" : "#b2cbe9";
  const linie = dunkel ? "rgba(255,255,255,0.32)" : "#7fa7d6";
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5" aria-hidden="true" fill="none">
      <rect x="16" y="6" width="36" height="46" rx="6" fill={blatt} stroke={rand} strokeWidth="1.5" transform="rotate(8 34 29)" />
      <rect x="12" y="10" width="36" height="46" rx="6" fill={blatt} stroke={rand} strokeWidth="1.5" />
      <path d="M19 21H35M19 27H41M19 33H38M19 39H31" stroke={linie} strokeWidth="2" strokeLinecap="round" />
      <circle cx="44" cy="48" r="9" fill="#669933" />
      <path d="M40 48.2l2.8 2.8L48 45.6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Kasten „Technische Unterlagen auf Anfrage“ – ohne erfundene Datenblattwerte. */
export function UnterlagenAufAnfrage({ titel = "Technische Datenblätter auf Anfrage", text, href = "/kontakt", linkText = "Unterlagen anfordern", dunkel = false }) {
  return (
    <Reveal
      data-blk="unterlagen"
      className={cn(
        "group relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6 ring-1 sm:flex-row sm:items-center sm:justify-between md:p-7",
        dunkel ? "bg-white/[0.05] ring-white/15" : "bg-gradient-to-br from-white to-sand-50 ring-ink-200/70"
      )}
    >
      <Lichtkante dunkel={dunkel} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center md:gap-5">
        <Unterlagen dunkel={dunkel} />
        <div>
          <p className={cn("font-display text-[17px] font-bold", dunkel ? "text-white" : "text-ink-900")}>{titel}</p>
          {text && <p className={cn("mt-1 max-w-2xl text-[14.5px] leading-relaxed", dunkel ? "text-white/65" : "text-ink-600")}>{text}</p>}
        </div>
      </div>
      <Link
        href={href}
        className={cn(
          "group/knopf inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2",
          dunkel ? "bg-white text-navy-900 hover:bg-ov-50 focus-visible:ring-offset-navy-950" : "bg-navy-700 text-white hover:bg-navy-800"
        )}
      >
        {linkText}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover/knopf:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}
