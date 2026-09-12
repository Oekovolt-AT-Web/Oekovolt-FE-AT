import Link from "next/link";
import { AlertCircle, Building2, CheckCircle2, Info, MapPin, Sun } from "lucide-react";

import { bundeslandFuerSlug } from "@/data/bundeslaender";

const datum = (iso) =>
  new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Landesspezifischer Förderteil unter /forderungen/landesforderungen/<slug>.
 *
 * Die Seiten kamen aus dem Backoffice mit rund 480 Wörtern und wurden von
 * Google nicht indexiert. Dieser Block ergänzt das, was sich je Bundesland
 * WIRKLICH unterscheidet – kommunale Programme, regionale Beratungsstellen,
 * Standortbedingungen. Bewusst kein bundesweit identischer Textbaustein:
 * der würde 25 Near-Duplicates erzeugen und das Problem verschärfen.
 *
 * Rendert nichts, solange für einen Slug keine Daten hinterlegt sind.
 */
export default function LandesDetails({ slug }) {
  const land = bundeslandFuerSlug(slug);
  if (!land) return null;

  return (
    <section
      aria-labelledby="landesdetails-titel"
      className="border-t border-gray-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <h2
          id="landesdetails-titel"
          className="mb-3 text-[24px] font-semibold text-gray-900 md:text-[30px]"
        >
          Förderung in {land.name}: der aktuelle Stand
        </h2>
        <p className="mb-10 text-[13px] text-gray-500">
          Stand: {datum(land.stand)}. Kommunale Programme sind freiwillige
          Leistungen und können bei ausgeschöpftem Budget kurzfristig enden.
        </p>

        {/* Landesprogramm */}
        <div className="mb-10 flex items-start gap-4 rounded-xl border-l-4 border-[#669933] bg-gray-50 p-6">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#669933]" />
          <div>
            <h3 className="mb-2 text-[18px] font-semibold text-gray-900">
              {land.landesprogramm.kurz}
            </h3>
            <p className="ov-measure text-[16px] leading-relaxed text-gray-700">
              {land.landesprogramm.text}
            </p>
          </div>
        </div>

        {/* Kommunale Programme */}
        {land.kommunal?.length > 0 && (
          <div className="mb-10">
            <h3 className="mb-4 flex items-center gap-2 text-[20px] font-semibold text-gray-900">
              <Building2 aria-hidden="true" className="h-5 w-5 text-[#669933]" />
              Aktive kommunale Programme
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
                <caption className="sr-only">
                  Kommunale Photovoltaik-Förderprogramme in {land.name}
                </caption>
                <thead>
                  <tr className="bg-[#003473] text-white">
                    <th scope="col" className="px-4 py-3 font-semibold">Stadt</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Förderhöhe</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Was gefördert wird</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {land.kommunal.map((k, i) => (
                    <tr key={k.ort} className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                      <th scope="row" className="px-4 py-3 align-top font-medium text-gray-900">
                        {k.ort}
                        <span className="mt-0.5 block text-[13px] font-normal text-gray-500">
                          {k.programm}
                        </span>
                      </th>
                      <td className="px-4 py-3 align-top">
                        <span className="font-semibold text-[#669933]">{k.hoehe}</span>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-700">
                        {k.was}
                        {k.hinweis && (
                          <span className="mt-1 block text-[13px] text-gray-500">
                            {k.hinweis}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ausgelaufene Programme */}
        {land.ausgelaufen?.length > 0 && (
          <div className="mb-10">
            <h3 className="mb-3 text-[20px] font-semibold text-gray-900">
              Kürzlich ausgelaufene Programme
            </h3>
            <p className="ov-measure mb-4 text-[16px] leading-relaxed text-gray-600">
              Diese Programme werden noch häufig gesucht, sind aber beendet:
            </p>
            <ul className="space-y-2">
              {land.ausgelaufen.map((a) => (
                <li key={a.ort} className="flex gap-3 text-[15px] leading-relaxed text-gray-700">
                  <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <span>
                    <strong className="font-semibold text-gray-900">{a.ort}</strong> – {a.programm}:
                    {" "}{a.ende}. {a.grund}.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Regionaler Teil */}
        {land.region && (
          <div className="mb-10">
            <h3 className="mb-3 flex items-center gap-2 text-[20px] font-semibold text-gray-900">
              <MapPin aria-hidden="true" className="h-5 w-5 text-[#669933]" />
              {land.region.titel}
            </h3>
            <p className="ov-measure mb-5 text-[16px] leading-relaxed text-gray-600">
              {land.region.einleitung}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {land.region.punkte.map((pkt) => (
                <div
                  key={pkt.titel}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <h4 className="mb-1.5 text-[17px] font-semibold text-gray-900">
                    {pkt.titel}
                  </h4>
                  <p className="mb-2 text-[15px] leading-relaxed text-gray-600">
                    {pkt.text}
                  </p>
                  <p className="text-[13px] text-gray-400">{pkt.quelle}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Standortvorteil */}
        {land.standort && (
          <div className="mb-10 flex items-start gap-4 rounded-xl bg-[#f0f7e6] p-6">
            <Sun aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-[#669933]" />
            <div>
              <h3 className="mb-2 text-[18px] font-semibold text-gray-900">
                {land.standort.titel}
              </h3>
              <p className="ov-measure text-[16px] leading-relaxed text-gray-700">
                {land.standort.text}
              </p>
            </div>
          </div>
        )}

        {/* Weiterführend */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              href: "/ratgeber/einspeiseverguetung-2026",
              titel: "Einspeisevergütung 2026",
              text: "Die bundesweite Vergütung, die zu jeder Landesförderung dazukommt.",
            },
            {
              href: "/solarrechner",
              titel: "Solarrechner",
              text: `Was eine Anlage in ${land.name} an Ertrag und Ersparnis bringt.`,
            },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <p className="mb-1 flex items-center gap-2 text-[17px] font-semibold text-gray-900 transition-colors group-hover:text-[#669933]">
                <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#669933]" />
                {l.titel}
              </p>
              <p className="text-[15px] leading-relaxed text-gray-600">{l.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
