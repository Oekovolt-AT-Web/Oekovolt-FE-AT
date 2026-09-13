import Link from "next/link";
import { ArrowRight, ArrowUpRight, Map, MapPin, Sun } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { REGION_ORTE } from "@/data/photovoltaik-seite";

/**
 * Regionaler Abschnitt „Photovoltaik im Allgäu" im Design-System 2026.
 * Jeder genannte Ort ist mit einem echten Referenzprojekt verlinkt
 * (REGION_ORTE). Die Balken zeigen die Zahl der dort gezeigten Projekte.
 */
export default function RegionAllgaeu() {
  const max = Math.max(...REGION_ORTE.map((o) => o.anzahl));
  const summe = REGION_ORTE.reduce((a, o) => a + o.anzahl, 0);

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
      <Reveal>
        <Eyebrow className="mb-4">Aus der Region, für die Region</Eyebrow>
        <h2 className="ov-h2 text-ink-900">
          Photovoltaik im Allgäu – <span className="ov-text-gradient">von Türkheim aus</span> geplant und montiert
        </h2>
        <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">
          Unser Sitz ist in Türkheim, unsere Montageteams sind im Unterallgäu, Ostallgäu und in Schwaben unterwegs. Kurze
          Wege heißen für Sie: schnelle Termine vor Ort, ein Ansprechpartner, der Ihr Dach kennt, und ein Serviceteam, das
          im Störungsfall nicht erst anreisen muss.
        </p>
        <p className="mt-4 text-[16.5px] leading-relaxed text-ink-600">
          Welche Zuschüsse es in Bayern aktuell gibt, lesen Sie in der{" "}
          <Link
            href="/forderungen/landesforderungen/landesfoerderungen-in-bayern"
            className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current"
          >
            Übersicht zur Förderung in Bayern
          </Link>
          .
        </p>

        <div className="mt-8 flex items-start gap-4 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun-300/30 text-ink-900">
            <Sun aria-hidden="true" className="h-6 w-6 text-sun-500" />
          </span>
          <div>
            <p className="font-display text-[22px] font-extrabold leading-tight text-ink-900">
              950–1.050 <span className="text-[15px] font-semibold text-ink-500">kWh je kWp im Jahr</span>
            </p>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">
              So viel Ertrag bringt eine gut ausgerichtete Anlage im Allgäu – spürbar mehr als in Norddeutschland mit rund
              800–900 kWh (Orientierung).
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-ink-200/70 md:p-8">
        <div aria-hidden="true" className="ov-grid-bg-light pointer-events-none absolute inset-0" />
        <div className="relative">
          <div className="flex items-end justify-between gap-4 border-b border-ink-100 pb-5">
            <div>
              <h3 className="font-display text-[20px] font-bold text-ink-900">Hier haben wir bereits gebaut</h3>
              <p className="mt-1 text-[14px] text-ink-500">Referenzprojekte mit Bildern und Eckdaten</p>
            </div>
            <p className="shrink-0 text-right">
              <span className="ov-num block font-display text-[30px] font-extrabold leading-none text-ov-600">{summe}</span>
              <span className="text-[12px] text-ink-500">Projekte in diesen Orten</span>
            </p>
          </div>

          <ul className="mt-2 divide-y divide-ink-100">
            {REGION_ORTE.map((o) => (
              <li key={o.ort}>
                <Link href={o.href} className="group -mx-3 flex min-h-[60px] items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-ov-50/70">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                    <MapPin aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[16px] font-semibold text-ink-900">
                        {o.ort}
                        {o.hinweis && (
                          <span className="ml-2 hidden rounded-full bg-navy-50 sm:inline px-2 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-wider text-navy-700">
                            {o.hinweis}
                          </span>
                        )}
                      </span>
                      <span className="ov-num shrink-0 text-[13px] text-ink-500">
                        {o.anzahl} {o.anzahl === 1 ? "Projekt" : "Projekte"}
                        {o.hinweis && <span className="sm:hidden"> · Sitz</span>}
                      </span>
                    </span>
                    <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink-100">
                      <span className="block h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600" style={{ width: `${(o.anzahl / max) * 100}%` }} />
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-600" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/referenzen/referenzkarte" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              <Map aria-hidden="true" className="h-4 w-4" />
              Alle Anlagen auf der Karte
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/referenzen/projekte" className="text-[14px] font-medium text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink-800">
              Alle Projekte ansehen
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
