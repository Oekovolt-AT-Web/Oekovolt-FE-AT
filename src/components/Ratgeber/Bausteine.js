import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BadgeEuro,
  BatteryCharging,
  CalendarClock,
  Calculator,
  Car,
  Check,
  Clock,
  Gauge,
  Hash,
  Info,
  Leaf,
  Lightbulb,
  Mountain,
  PlugZap,
  Quote,
  Scale,
  Share2,
  ShieldAlert,
  Sun,
  Table2,
  Thermometer,
  Warehouse,
  Wrench,
} from "lucide-react";

import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import InlineText from "./InlineText";
import TabellenRahmen from "./TabellenRahmen";
import { artikelPfad, datumLang, passenderRechner, weitereArtikel } from "@/lib/ratgeber";
import { FIRMA } from "@/lib/site";

/* ------------------------------------------------------------------
   Redaktionelle Bausteine für Ratgeber-Artikel (Magazin-Look).
   Server-Komponenten – JavaScript im Browser nur für den Tabellenrahmen.
   ------------------------------------------------------------------ */

/** Abschnitt mit Anker: h2 mit Sprunglink, Abstand zur klebenden Navigation. */
export function Abschnitt({ id, titel, children, className }) {
  return (
    <section id={id} aria-labelledby={`${id}-titel`} className={cn("scroll-mt-28 pt-16 first:pt-0", className)}>
      <h2 id={`${id}-titel`} className="group font-display text-[clamp(1.5rem,1.2rem+1vw,2.05rem)] font-extrabold leading-[1.15] tracking-tight text-ink-900 [text-wrap:balance]">
        {titel}
        <a
          href={`#${id}`}
          aria-label={`Direktlink zu „${typeof titel === "string" ? titel : id}“`}
          className="ml-2 inline-flex translate-y-[-2px] align-middle text-ink-300 opacity-0 transition-opacity hover:text-ov-600 focus:opacity-100 group-hover:opacity-100"
        >
          <Hash aria-hidden="true" className="h-5 w-5" />
        </a>
      </h2>
      <div aria-hidden="true" className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-ov-500 to-ov-300" />
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Fließtext im Artikelstil (`ov-prose`). */
export function Prosa({ children, className }) {
  return <div className={cn("ov-prose max-w-[68ch]", className)}>{children}</div>;
}

/** Zwischenüberschrift h3 im Artikel. */
export function Zwischentitel({ children, className }) {
  return <h3 className={cn("mt-10 font-display text-[20px] font-bold leading-snug text-ink-900", className)}>{children}</h3>;
}

/** Interner Link im Fließtext. */
export function TextLink({ href, children }) {
  return (
    <Link href={href} className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-[3px] transition-colors hover:decoration-current">
      {children}
    </Link>
  );
}

/** „Das Wichtigste in Kürze“ – zitierfähige Kernaussagen oben im Artikel. */
export function KurzFazit({ punkte = [], id = "kurz", titel = "Das Wichtigste in Kürze" }) {
  return (
    <section id={id} aria-labelledby={`${id}-titel`} className="scroll-mt-28">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-ov-50 p-6 ring-1 ring-ov-100 md:p-8">
        <div aria-hidden="true" className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-ov-200/50 blur-3xl" />
        <h2 id={`${id}-titel`} className="relative flex items-center gap-2.5 font-display text-[19px] font-extrabold text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ov-500 text-white">
            <Lightbulb aria-hidden="true" className="h-4 w-4" />
          </span>
          {titel}
        </h2>
        <ul className="relative mt-5 space-y-3.5">
          {punkte.map((p, i) => (
            <li key={typeof p === "string" ? p : i} className="flex gap-3 text-[16px] leading-relaxed text-ink-700">
              <span className="ov-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[11.5px] font-bold text-ov-700 ring-1 ring-ov-200">{i + 1}</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const KASTEN = {
  info: { icon: Info, rahmen: "bg-navy-50/70 ring-navy-100", balken: "bg-navy-600", icon_c: "bg-navy-700 text-white", titel: "Gut zu wissen", label: "text-navy-700" },
  tipp: { icon: Lightbulb, rahmen: "bg-ov-50 ring-ov-100", balken: "bg-ov-500", icon_c: "bg-ov-500 text-white", titel: "Unser Tipp", label: "text-ov-700" },
  wichtig: { icon: AlertTriangle, rahmen: "bg-sun-300/20 ring-sun-300/60", balken: "bg-sun-400", icon_c: "bg-sun-400 text-navy-950", titel: "Wichtig", label: "text-[#8a5a00]" },
  recht: { icon: Scale, rahmen: "bg-sand-100 ring-ink-200/70", balken: "bg-ink-900", icon_c: "bg-ink-900 text-white", titel: "Rechtslage", label: "text-ink-600" },
  praxis: { icon: Wrench, rahmen: "bg-white ring-ink-200/80", balken: "bg-ov-600", icon_c: "bg-ov-600 text-white", titel: "Aus der Praxis", label: "text-ov-700" },
};
const KASTEN_LABEL = { info: "Info", tipp: "Tipp", wichtig: "Achtung", recht: "Recht", praxis: "Praxis" };

/**
 * Info-/Merkkasten. variant: info | tipp | wichtig | recht | praxis | zitat
 * (zitat: großes Zitat mit optionaler Quelle im Titel)
 */
export function Merkkasten({ variant = "info", titel, children, className }) {
  if (variant === "zitat") {
    return (
      <figure className={cn("relative my-10 overflow-hidden rounded-[1.75rem] bg-navy-950 px-6 py-8 text-white md:px-10 md:py-10", className)}>
        <div aria-hidden="true" className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-ov-500/30 blur-[70px]" />
        <Quote aria-hidden="true" className="relative h-8 w-8 text-ov-300" />
        <blockquote className="relative mt-4 font-display text-[clamp(1.2rem,1.05rem+0.6vw,1.5rem)] font-bold leading-snug [&_a]:text-ov-300 [&_a]:underline">{children}</blockquote>
        {titel && <figcaption className="relative mt-5 text-[14px] text-white/60">— {titel}</figcaption>}
      </figure>
    );
  }
  const k = KASTEN[variant] || KASTEN.info;
  const Icon = k.icon;
  return (
    // role="note" statt <aside>: Merkkästen stehen im Artikel, keine eigenständige Landmark
    <div role="note" className={cn("relative my-8 flex gap-4 overflow-hidden rounded-2xl p-5 pl-6 ring-1 md:p-6 md:pl-7", k.rahmen, className)}>
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1.5", k.balken)} />
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm", k.icon_c)}>
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <p className={cn("text-[11.5px] font-bold uppercase tracking-[0.14em]", k.label)}>{KASTEN_LABEL[variant] || "Info"}</p>
        <p className="mt-0.5 font-display text-[17px] font-bold leading-snug text-ink-900">{titel || k.titel}</p>
        <div className="mt-2 text-[15.5px] leading-relaxed text-ink-700 [&_a]:font-medium [&_a]:text-ov-700 [&_a]:underline [&_a]:decoration-ov-300 [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Große Kennzahl-Hervorhebung (dunkel). */
export function Kennzahlband({ icon: Icon, titel, text, wert }) {
  return (
    <div className="ov-noise relative my-10 overflow-hidden rounded-[1.75rem] bg-navy-950 p-6 text-white md:p-9">
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-ov-500/30 blur-[80px]" />
      <div aria-hidden="true" className="absolute -bottom-24 left-10 h-40 w-40 rounded-full bg-sun-400/15 blur-[70px]" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        {wert ? (
          <p className="ov-num shrink-0 bg-gradient-to-br from-ov-200 to-ov-400 bg-clip-text font-display text-[44px] font-extrabold leading-none tracking-tight text-transparent md:text-[56px]">{wert}</p>
        ) : (
          Icon && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-ov-300">
              <Icon aria-hidden="true" className="h-6 w-6" />
            </span>
          )
        )}
        <div className="sm:border-l sm:border-white/15 sm:pl-8">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-ov-300">Kennzahl</p>
          <p className="mt-1 font-display text-[18.5px] font-bold leading-snug">{titel}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{text}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Tabelle im Magazinstil. Echte <table> (Featured Snippets), horizontal
 * scrollbar mit Schatten-Hinweis; erste Spalte bleibt beim Wischen stehen.
 * kopf: ["Spalte", ...]; zeilen: [[th, td, td], ...]; hervorheben: Spaltenindex
 */
export function Tabelle({ caption, kopf = [], zeilen = [], hervorheben, fussnote, minBreite = 520, markierteZeile }) {
  const breit = kopf.length > 2 || (zeilen[0]?.length || 0) > 2;
  return (
    <figure className="my-9">
      {caption && (
        <p aria-hidden="true" className="mb-3 flex items-start gap-2 text-[13.5px] font-semibold leading-snug text-ink-700">
          <Table2 className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
          {caption}
        </p>
      )}
      <TabellenRahmen label={caption || "Tabelle"}>
        <table className="w-full border-collapse text-left text-[15px]" style={{ minWidth: minBreite }}>
          <caption className="sr-only">{caption}</caption>
          {kopf.length > 0 && (
            <thead>
              <tr className="bg-navy-950 text-white">
                {kopf.map((k, i) => (
                  <th
                    key={`${k}-${i}`}
                    scope="col"
                    className={cn(
                      "px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white/80",
                      i === 0 && breit && "sticky left-0 z-10 bg-navy-950",
                      hervorheben === i && "text-ov-300"
                    )}
                  >
                    {k || <span className="sr-only">Merkmal</span>}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-ink-100">
            {zeilen.map((z, i) => (
              <tr key={i} className={cn("transition-colors", markierteZeile === i ? "bg-ov-50" : "bg-white hover:bg-sand-50")}>
                {z.map((zelle, j) =>
                  j === 0 ? (
                    <th
                      key={j}
                      scope="row"
                      className={cn(
                        "px-5 py-3.5 font-semibold text-ink-900",
                        breit && "sticky left-0 z-10 bg-inherit shadow-[1px_0_0_rgba(15,23,42,0.06)]",
                        markierteZeile === i && "border-l-[3px] border-ov-500"
                      )}
                    >
                      {zelle}
                    </th>
                  ) : (
                    <td key={j} className={cn("ov-num px-5 py-3.5", hervorheben === j ? "bg-ov-50/60 font-bold text-ov-700" : "text-ink-700")}>
                      {zelle}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </TabellenRahmen>
      {fussnote && <figcaption className="mt-3 text-[13px] leading-relaxed text-ink-500">{typeof fussnote === "string" ? <InlineText text={fussnote} /> : fussnote}</figcaption>}
    </figure>
  );
}

/** Karten-Raster innerhalb des Artikels (z. B. Kostenbestandteile). */
export function KartenRaster({ items = [], cols = 2 }) {
  return (
    <div className={cn("my-8 grid gap-3", cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
      {items.map((it, i) => (
        <div key={it.titel} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/70 transition-shadow hover:shadow-[0_16px_36px_-24px_rgba(15,23,42,0.35)]">
          <p className="flex items-center gap-2.5 font-display text-[16.5px] font-bold text-ink-900">
            {it.icon ? (
              <it.icon aria-hidden="true" className="h-[18px] w-[18px] text-ov-600" />
            ) : (
              <span className="ov-num flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ov-50 text-[12px] font-bold text-ov-700">{i + 1}</span>
            )}
            {it.titel}
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{it.text}</p>
        </div>
      ))}
    </div>
  );
}

/** Checkliste ohne Aufzählungspunkte. */
export function Checkliste({ punkte = [] }) {
  return (
    <ul className="my-6 space-y-3 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60 md:p-6">
      {punkte.map((p, i) => (
        <li key={typeof p === "string" ? p : p.key || i} className="flex gap-3 text-[16px] leading-relaxed text-ink-700">
          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ov-500 text-white">
            <Check aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

/** Nummerierter Ablauf im Artikel mit Verbindungslinie. */
export function Ablauf({ schritte = [] }) {
  return (
    <ol className="relative my-8 space-y-6 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-gradient-to-b before:from-ov-300 before:to-ov-100">
      {schritte.map(([titel, text], i) => (
        <li key={titel} className="relative flex gap-5">
          <span className="ov-num relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-[15px] font-extrabold text-ov-700 ring-2 ring-ov-200">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="pt-1.5">
            <h3 className="font-display text-[17.5px] font-bold text-ink-900">{titel}</h3>
            <p className="mt-1.5 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-600">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Meta-Zeile für den Artikel-Hero: Autor, Datum, Lesezeit. */
export function ArtikelMeta({ artikel }) {
  return (
    <div className="ov-hero-in mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink-200 pt-7" style={{ "--ov-delay": "300ms" }}>
      <div className="flex items-center gap-3">
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 font-display text-[14px] font-extrabold text-white ring-2 ring-white">
          ÖV
          <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ov-500 ring-2 ring-white">
            <BadgeCheck aria-hidden="true" className="h-2.5 w-2.5" />
          </span>
        </span>
        <div className="leading-tight">
          <p className="text-[14.5px] font-semibold text-ink-900">Ökovolt-Redaktion Österreich</p>
          <p className="text-[12.5px] text-ink-500">Photovoltaik-Fachbetrieb aus {FIRMA.ort}</p>
        </div>
      </div>
      <p className="flex items-center gap-2 text-[14px] text-ink-600">
        <CalendarClock aria-hidden="true" className="h-4 w-4 text-ov-600" />
        Aktualisiert <time dateTime={artikel.aktualisiert}>{datumLang(artikel.aktualisiert)}</time>
      </p>
      <p className="flex items-center gap-2 text-[14px] text-ink-600">
        <Clock aria-hidden="true" className="h-4 w-4 text-ov-600" />
        {artikel.lesezeit} Min. Lesezeit
      </p>
    </div>
  );
}

/** Autorenbox am Artikelende (E-E-A-T): Redaktion, Prüfstand, Quellenlage. */
export function Autorenbox({ artikel }) {
  const quellen = artikel.quellen?.length || 0;
  const pruefpunkte = [
    <>
      Rechts- und Zahlenstand geprüft am <time dateTime={artikel.aktualisiert}>{datumLang(artikel.aktualisiert)}</time>
    </>,
    quellen > 0 ? `${quellen} ${quellen === 1 ? "Quelle" : "Quellen"} verlinkt – Behörden, Gesetze, Netzbetreiber` : "Zahlen mit Quellenangabe im Text",
    `Fachbetrieb für ${FIRMA.gewerbe.replace(/\s*\(.*\)$/, "")}, GISA ${FIRMA.gisa}`,
  ];
  return (
    <div className="mt-16 overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start md:p-8">
        <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-navy-950 font-display text-[20px] font-extrabold text-white">
          ÖV
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ov-500 ring-[3px] ring-white">
            <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
        </span>
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Über die Redaktion</p>
          <p className="mt-1.5 font-display text-[20px] font-extrabold text-ink-900">Ökovolt-Redaktion Österreich</p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
            Geschrieben von unseren Fachleuten aus Planung, Netzanschluss und Montage – {FIRMA.name} aus {FIRMA.ort} ({FIRMA.bundesland}), seit {FIRMA.gegruendet} in ganz
            Österreich tätig. Die Inhalte ersetzen keine Steuer- oder Rechtsberatung.
          </p>
        </div>
      </div>
      <ul className="grid gap-px border-t border-ink-100 bg-ink-100 sm:grid-cols-3">
        {pruefpunkte.map((p, i) => (
          <li key={i} className="flex items-start gap-2.5 bg-sand-50 px-6 py-4 text-[13.5px] leading-snug text-ink-700 md:px-8 sm:px-5">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" strokeWidth={3} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-100 px-6 py-4 text-[14px] md:px-8">
        <Link href="/uber-uns/team" className="font-semibold text-ov-700 hover:underline">
          Unser Team
        </Link>
        <Link href="/wissen/lexikon" className="font-semibold text-ov-700 hover:underline">
          Photovoltaik-Lexikon
        </Link>
        <a href={`mailto:${FIRMA.email}`} className="font-semibold text-ov-700 hover:underline">
          Fehler gefunden? Schreiben Sie uns
        </a>
      </p>
    </div>
  );
}

const RECHNER_ICONS = { Warehouse, Gauge, BatteryCharging, Share2, ShieldAlert, Leaf, Sun, Car, PlugZap, Activity, Thermometer, Mountain, BadgeEuro, Calculator };

/** „Passender Rechner“ – wird je Artikel automatisch nach Thema gewählt. */
export function RechnerKarte({ artikel, className }) {
  const r = passenderRechner(artikel);
  if (!r?.href) return null;
  const Icon = RECHNER_ICONS[r.icon] || Calculator;
  return (
    <Link
      href={r.href}
      className={cn(
        "group ov-noise relative my-12 flex flex-col gap-6 overflow-hidden rounded-[1.75rem] bg-navy-950 p-6 text-white shadow-[0_30px_60px_-30px_rgba(15,23,42,0.6)] sm:flex-row sm:items-center md:p-8",
        className
      )}
    >
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-ov-500/35 blur-[80px] transition-opacity duration-500 group-hover:opacity-80" />
      <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-ov-400 to-ov-600 text-white shadow-[0_16px_32px_-12px_rgba(102,153,51,0.7)]">
        <Icon aria-hidden="true" className="h-7 w-7" />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-[11.5px] font-bold uppercase tracking-[0.16em] text-ov-300">Passender Rechner</span>
        <span className="mt-1 block font-display text-[21px] font-extrabold leading-snug">{r.titel}</span>
        <span className="mt-1.5 block text-[15px] leading-relaxed text-white/70">{r.text}</span>
      </span>
      <span className="relative inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 text-[14.5px] font-semibold text-ink-900 transition-colors group-hover:bg-ov-500 group-hover:text-white sm:self-auto">
        {r.label}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/** Kleine Verweis-Karten („Passend dazu“). */
export function LinkKarten({ links = [] }) {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.href} className="flex">
          <Link href={l.href} className="group ov-card-hover flex w-full items-start justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/70 hover:ring-ov-200">
            <span>
              <span className="block font-display text-[16.5px] font-bold text-ink-900 transition-colors group-hover:text-ov-700">{l.titel}</span>
              <span className="mt-1 block text-[14.5px] leading-relaxed text-ink-600">{l.text}</span>
            </span>
            <ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-600" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Artikelkarte für Hub und „Weitere Artikel“. */
export function ArtikelKarte({ artikel, gross = false, delay = 0 }) {
  return (
    <Reveal as="article" delay={delay} className="flex w-full">
      <div className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 focus-within:ring-2 focus-within:ring-ov-500 hover:ring-ov-200">
        <div className={cn("relative overflow-hidden bg-ink-100", gross ? "aspect-[16/10] lg:aspect-auto lg:min-h-[320px] lg:flex-1" : "aspect-[16/10]")}>
          <Image
            src={artikel.bild}
            alt={artikel.bildAlt}
            fill
            sizes={gross ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-ink-800 shadow-sm backdrop-blur">{artikel.kategorie}</span>
        </div>
        <div className={cn("flex flex-col p-6", gross ? "md:p-8" : "flex-1")}>
          <h3 className={cn("font-display font-extrabold leading-snug tracking-tight text-ink-900 transition-colors group-hover:text-ov-700", gross ? "text-[clamp(1.4rem,1.1rem+1vw,1.9rem)]" : "text-[19px]")}>
            {/* Stretched Link: genau EIN Link je Karte */}
            <Link href={artikelPfad(artikel.slug)} className="outline-none after:absolute after:inset-0 after:content-['']">
              {artikel.title}
            </Link>
          </h3>
          <p className={cn("mt-3 text-ink-600", gross ? "text-[16.5px] leading-relaxed" : "line-clamp-3 text-[15px] leading-relaxed")}>{artikel.excerpt}</p>
          <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-[13px] text-ink-500">
            <span className="flex items-center gap-3">
              <time dateTime={artikel.aktualisiert}>{datumLang(artikel.aktualisiert)}</time>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink-300" />
              <span className="flex items-center gap-1.5">
                <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                {artikel.lesezeit} Min.
              </span>
            </span>
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition-all group-hover:bg-ov-500 group-hover:text-white">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** „Weiterlesen“-Raster am Artikelende. */
export function WeitereArtikel({ slug }) {
  const liste = weitereArtikel(slug, 3);
  if (liste.length === 0) return null;
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2", liste.length >= 3 && "lg:grid-cols-3")}>
      {liste.map((a, i) => (
        <div key={a.slug} className={cn("flex", i === 2 && "sm:col-span-2 lg:col-span-1")}>
          <ArtikelKarte artikel={a} delay={i * 80} />
        </div>
      ))}
    </div>
  );
}
