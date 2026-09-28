import Link from "next/link";
import { AlertTriangle, ArrowUpRight, ExternalLink, FileText, Info, MessageSquareQuote, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";

/*
 * Wiederkehrende Bausteine der Technik-Seiten (/technik/*) sowie der Seiten
 * Reststromvermarktung und Stromtarif. Alles Server-Komponenten im Corporate
 * Design (Farbtokens ov-*, ink-*, sand-*, navy-*), keine neuen Bibliotheken.
 */

/**
 * Zitierfähige Kurzantwort direkt unter dem Seitenkopf (GEO: erster Satz beantwortet die Frage).
 * frage: die implizite Suchfrage, antwort: 2–4 Sätze.
 */
export function Kurzantwort({ frage, children, className }) {
  return (
    <section aria-label="Kurz beantwortet" className={cn("border-b border-ink-200/70 bg-white", className)}>
      <div className="ov-container py-10 md:py-12">
        <Reveal className="grid gap-5 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:grid-cols-[auto_1fr] md:gap-7 md:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-600 text-white">
            <MessageSquareQuote aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[18px] font-bold leading-snug text-ink-900 md:text-[20px]">{frage}</h2>
            <div className="mt-2.5 space-y-3 text-[16px] leading-relaxed text-ink-700 md:text-[16.5px]">{children}</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const HINWEIS_TOENE = {
  info: { icon: Info, box: "bg-ov-50 ring-ov-200/80", ic: "bg-ov-600 text-white" },
  norm: { icon: Scale, box: "bg-sand-50 ring-ink-200/80", ic: "bg-navy-700 text-white" },
  achtung: { icon: AlertTriangle, box: "bg-sand-100 ring-sun-300", ic: "bg-sun-400 text-navy-950" },
  dunkel: { icon: Info, box: "bg-white/[0.05] ring-white/15 text-white", ic: "bg-ov-500 text-white" },
};

/** Hervorgehobener Fach- oder Normhinweis. ton: info | norm | achtung | dunkel */
export function Hinweis({ ton = "info", titel, children, className }) {
  const t = HINWEIS_TOENE[ton] || HINWEIS_TOENE.info;
  const Icon = t.icon;
  const dunkel = ton === "dunkel";
  return (
    <Reveal className={cn("flex gap-4 rounded-3xl p-5 ring-1 md:p-6", t.box, className)}>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", t.ic)}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className={cn("min-w-0 text-[15px] leading-relaxed", dunkel ? "text-white/75" : "text-ink-700")}>
        {titel && <p className={cn("font-display text-[16.5px] font-bold", dunkel ? "text-white" : "text-ink-900")}>{titel}</p>}
        <div className={titel ? "mt-1.5 space-y-2" : "space-y-2"}>{children}</div>
      </div>
    </Reveal>
  );
}

/**
 * Datentabelle – zitierfähig, mit echter <caption> und Zeilenköpfen.
 * kopf: ["Spalte", …], zeilen: [[zelle, …], …] (erste Zelle = Zeilenkopf)
 * hervor: Index einer hervorgehobenen Spalte, quelle: Fußnote
 */
export function Tabelle({ caption, kopf = [], zeilen = [], hervor, quelle, kompakt = false, minBreite = 680, className }) {
  return (
    <Reveal className={cn("min-w-0", className)}>
      <figure className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
        <div className="overflow-x-auto">
          <table className={cn("w-full border-collapse text-left", kompakt ? "text-[14px]" : "text-[15px]")} style={{ minWidth: minBreite }}>
            {caption && (
              <caption className="border-b border-ink-200/70 bg-sand-50 px-5 py-4 text-left font-display text-[16.5px] font-bold text-ink-900 md:px-6">
                {caption}
              </caption>
            )}
            {kopf.length > 0 && (
              <thead>
                <tr className="border-b border-ink-200/70">
                  {kopf.map((k, i) => (
                    <th
                      key={`${k}-${i}`}
                      scope="col"
                      className={cn(
                        "px-5 py-3.5 align-bottom text-[12px] font-semibold uppercase tracking-[0.1em] md:px-6",
                        i === hervor ? "bg-navy-950 text-white" : "text-ink-500"
                      )}
                    >
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {zeilen.map((z, zi) => (
                <tr key={zi} className="border-b border-ink-100 last:border-b-0">
                  {z.map((zelle, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-5 py-4 align-top font-display text-[15px] font-bold leading-snug text-ink-900 md:px-6">
                        {zelle}
                      </th>
                    ) : (
                      <td
                        key={i}
                        className={cn("px-5 py-4 align-top leading-relaxed md:px-6", i === hervor ? "bg-ov-50/60 text-ink-800" : "text-ink-700")}
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
        {quelle && <figcaption className="border-t border-ink-200/70 px-5 py-3.5 text-[13px] leading-relaxed text-ink-500 md:px-6">{quelle}</figcaption>}
      </figure>
    </Reveal>
  );
}

/** Kompakte Definitionsliste für Kennwerte/Parameter (z. B. „Standardeinstellung nach TOR“). */
export function Kennwerte({ items = [], dunkel = false, className }) {
  return (
    <dl className={cn("grid gap-px overflow-hidden rounded-3xl sm:grid-cols-2", dunkel ? "bg-white/10 ring-1 ring-white/10" : "bg-ink-200/70 ring-1 ring-ink-200/70", className)}>
      {items.map((k) => (
        <div key={k.label} className={cn("p-5 md:p-6", dunkel ? "bg-navy-950" : "bg-white")}>
          <dt className={cn("text-[12.5px] font-semibold uppercase tracking-[0.12em]", dunkel ? "text-white/55" : "text-ink-500")}>{k.label}</dt>
          <dd className={cn("mt-1.5 font-display text-[19px] font-extrabold leading-snug tracking-tight", dunkel ? "text-white" : "text-ink-900")}>{k.wert}</dd>
          {k.text && <dd className={cn("mt-1 text-[14px] leading-relaxed", dunkel ? "text-white/60" : "text-ink-600")}>{k.text}</dd>}
        </div>
      ))}
    </dl>
  );
}

/** Aufzählung mit fachlichen Punkten (Titel + Text), optional mit Normbezug als Tag. */
export function Punkte({ items = [], dunkel = false, spalten = 2, className }) {
  return (
    <ul className={cn("grid gap-4", spalten === 2 ? "md:grid-cols-2" : spalten === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "", className)}>
      {items.map((p, i) => (
        <Reveal as="li" key={p.titel} delay={(i % 4) * 60} className={cn("rounded-3xl p-6 ring-1", dunkel ? "bg-white/[0.04] ring-white/10" : "bg-white ring-ink-200/70")}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className={cn("font-display text-[17.5px] font-bold leading-snug", dunkel ? "text-white" : "text-ink-900")}>{p.titel}</h3>
            {p.tag && (
              <span className={cn("rounded-full px-2.5 py-1 text-[11.5px] font-semibold tracking-wide", dunkel ? "bg-white/10 text-white/75" : "bg-ink-100 text-ink-600")}>{p.tag}</span>
            )}
          </div>
          <div className={cn("mt-2.5 space-y-2 text-[15px] leading-relaxed", dunkel ? "text-white/65" : "text-ink-600")}>
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
    <section aria-labelledby="verweise-titel" className="bg-white">
      <div className="ov-container py-16 md:py-20">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-ink-200 pb-6">
          <h2 id="verweise-titel" className="ov-h3 text-ink-900 md:text-[28px]">
            {ueberschrift}
          </h2>
        </div>
        <ul className={`grid gap-4 sm:grid-cols-2 ${items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {items.map((v, i) => (
            <Reveal as="li" key={v.href} delay={i * 70} className="flex">
              <article className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 focus-within:ring-2 focus-within:ring-ov-500 hover:bg-white">
                <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-400 ring-1 ring-ink-200 transition-all duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
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
    <Section tone="white" space="sm" aria-labelledby="quellen-titel">
      <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-8">
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

/** Kasten „Technische Unterlagen auf Anfrage“ – ohne erfundene Datenblattwerte. */
export function UnterlagenAufAnfrage({ titel = "Technische Datenblätter auf Anfrage", text, href = "/kontakt", linkText = "Unterlagen anfordern", dunkel = false }) {
  return (
    <Reveal className={cn("flex flex-col gap-5 rounded-3xl p-6 ring-1 sm:flex-row sm:items-center sm:justify-between md:p-7", dunkel ? "bg-white/[0.05] ring-white/15" : "bg-white ring-ink-200/70")}>
      <div className="flex gap-4">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", dunkel ? "bg-white/10 text-ov-300" : "bg-ov-50 text-ov-600")}>
          <FileText aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className={cn("font-display text-[17px] font-bold", dunkel ? "text-white" : "text-ink-900")}>{titel}</p>
          {text && <p className={cn("mt-1 max-w-2xl text-[14.5px] leading-relaxed", dunkel ? "text-white/65" : "text-ink-600")}>{text}</p>}
        </div>
      </div>
      <Link
        href={href}
        className={cn(
          "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-all",
          dunkel ? "bg-white text-navy-900 hover:bg-ov-50" : "bg-navy-700 text-white hover:bg-navy-800"
        )}
      >
        {linkText}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </Reveal>
  );
}
