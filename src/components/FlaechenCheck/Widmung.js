import Link from "next/link";
import { ArrowUpRight, CircleAlert, Gavel } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";
import { LAENDER, widmungsPfad } from "@/lib/flaeche/laender";

/**
 * Server-Bausteine für den Flächen-Check und die Widmungsseiten
 * /freiflaechen-photovoltaik/widmung/<bundesland>.
 */

/** Neun Länderkacheln mit Kernregel; aktiv = aktuelles Land (nicht verlinkt). */
export function LaenderKacheln({ aktiv, className }) {
  const liste = LAENDER.filter((l) => l.slug !== aktiv);
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {liste.map((l, i) => (
        <Reveal as="li" key={l.slug} delay={(i % 3) * 70} className="flex">
          <article className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 focus-within:ring-2 focus-within:ring-ov-500">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-[19px] font-bold leading-snug text-ink-900">
                <Link href={widmungsPfad(l.slug)} className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-['']">
                  {l.name}
                </Link>
              </h3>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-50 text-ink-400 ring-1 ring-ink-200 transition-all duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 self-start rounded-full bg-ov-50 px-3 py-1 text-[12.5px] font-semibold text-ov-800 ring-1 ring-ov-100">Schwelle: {l.schwelle}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{l.kurz}</p>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

/** Regeln eines Landes als nummerierte Karten mit Norm. */
export function Regeln({ land }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {land.regeln.map((r, i) => (
        <Reveal as="li" key={r.titel} delay={i * 70} className={cn("flex", land.regeln.length % 2 === 1 && i === land.regeln.length - 1 && "md:col-span-2")}>
          <article className="flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ov-700">
              <Gavel aria-hidden="true" className="h-4 w-4" />
              {r.norm}
            </p>
            <h3 className="mt-3 font-display text-[20px] font-bold leading-snug text-ink-900">
              <span className="mr-2 text-[15px] text-ov-500">{String(i + 1).padStart(2, "0")}</span>
              {r.titel}
            </h3>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{r.text}</p>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}

/** Liste der offenen bzw. unsicheren Punkte. */
export function OffenePunkte({ punkte = [], className }) {
  if (!punkte.length) return null;
  return (
    <div className={cn("rounded-3xl bg-sun-300/25 p-6 ring-1 ring-sun-400/50 md:p-7", className)}>
      <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
        <CircleAlert aria-hidden="true" className="h-5 w-5 text-sun-500" />
        Noch offen oder unsicher
      </p>
      <ul className="mt-3 space-y-2">
        {punkte.map((p) => (
          <li key={p} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-700">
            <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sun-500" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Kompakte Übersichtstabelle aller Länder (mobil als Karten). */
export function LaenderTabelle() {
  return (
    <div>
      <div className="hidden overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 lg:block">
        <table className="w-full border-collapse text-left text-[14.5px]">
          <caption className="sr-only">Freiflächen-Photovoltaik: Schwelle, Instrument und Zonen je Bundesland</caption>
          <thead>
            <tr className="bg-navy-950 text-white">
              {["Bundesland", "Schwelle", "Instrument", "Zonen"].map((k) => (
                <th key={k} scope="col" className="px-5 py-3.5 text-[12.5px] font-semibold uppercase tracking-wider">
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {LAENDER.map((l) => (
              <tr key={l.slug} className="align-top transition-colors hover:bg-ov-50/40">
                <th scope="row" className="w-[15%] px-5 py-4 font-semibold text-ink-900">
                  <Link href={widmungsPfad(l.slug)} className="text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                    {l.name}
                  </Link>
                </th>
                <td className="w-[22%] px-5 py-4 leading-relaxed text-ink-700">{l.schwelle}</td>
                <td className="w-[30%] px-5 py-4 leading-relaxed text-ink-700">{l.instrument}</td>
                <td className="px-5 py-4 leading-relaxed text-ink-700">{l.zonen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 lg:hidden">
        {LAENDER.map((l) => (
          <li key={l.slug} className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
            <Link href={widmungsPfad(l.slug)} className="font-display text-[17px] font-bold text-ov-700 underline decoration-ov-300 underline-offset-2">
              {l.name}
            </Link>
            <dl className="mt-3 space-y-2.5">
              {[
                ["Schwelle", l.schwelle],
                ["Instrument", l.instrument],
                ["Zonen", l.zonen],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">{k}</dt>
                  <dd className="mt-0.5 text-[15px] leading-relaxed text-ink-700">{v}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
