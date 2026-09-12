import Link from "next/link";
import { ArrowRight, MapPin, Sun } from "lucide-react";

import { REGION_ORTE } from "@/data/photovoltaik-seite";

/**
 * Regionaler Abschnitt "Photovoltaik im Allgäu".
 * Jeder genannte Ort ist mit einem echten Referenzprojekt verlinkt.
 */
export default function Region() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#669933]">
            Aus der Region, für die Region
          </p>
          <h2 className="mb-5 text-balance text-[26px] font-semibold leading-tight text-gray-900 md:text-[34px]">
            Photovoltaik im Allgäu – von Türkheim aus geplant und montiert
          </h2>
          <p className="ov-measure mb-4 text-[16px] leading-relaxed text-gray-600 md:text-[17px]">
            Unser Sitz ist in Türkheim, unsere Montageteams sind im Unterallgäu,
            Ostallgäu und in Schwaben unterwegs. Kurze Wege heißen für Sie:
            schnelle Termine vor Ort, ein Ansprechpartner, der Ihr Dach kennt,
            und ein Serviceteam, das im Störungsfall nicht erst anreisen muss.
          </p>
          <p className="ov-measure text-[16px] leading-relaxed text-gray-600 md:text-[17px]">
            Welche Zuschüsse es in Bayern aktuell gibt, haben wir in der{" "}
            <Link
              href="/forderungen/landesforderungen/landesfoerderungen-in-bayern"
              className="font-medium text-[#669933] underline underline-offset-2 hover:no-underline"
            >
              Übersicht zur Förderung in Bayern
            </Link>{" "}
            zusammengefasst.
          </p>

          <div className="mt-8 flex items-start gap-4 rounded-2xl bg-[#f0f7e6] p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
              <Sun aria-hidden="true" className="h-6 w-6 text-[#669933]" />
            </span>
            <div>
              <p className="mb-1 text-[17px] font-semibold text-gray-900">
                950–1.050 kWh je kWp
              </p>
              <p className="text-[15px] leading-relaxed text-gray-600">
                So viel Ertrag bringt eine gut ausgerichtete Anlage im Allgäu im
                Jahr – spürbar mehr als in Norddeutschland mit rund 800–900 kWh.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-[18px] font-semibold text-gray-900">
            Hier haben wir bereits gebaut
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {REGION_ORTE.map((o) => (
              <li key={o.ort}>
                <Link
                  href={o.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#669933] hover:shadow-md"
                >
                  <span className="flex items-center gap-3">
                    <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-[#669933]" />
                    <span>
                      <span className="block text-[16px] font-semibold text-gray-900">{o.ort}</span>
                      <span className="block text-[13px] text-gray-500">
                        {o.anzahl} {o.anzahl === 1 ? "Projekt" : "Projekte"}
                        {o.hinweis ? ` · ${o.hinweis}` : ""}
                      </span>
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[#669933]"
                  />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/referenzen/referenzkarte"
            className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-[#669933] hover:text-[#558822]"
          >
            Alle Anlagen auf der Karte ansehen
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
