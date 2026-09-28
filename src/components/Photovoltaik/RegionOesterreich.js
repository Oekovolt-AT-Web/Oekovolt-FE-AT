import Link from "next/link";
import { ArrowRight, ArrowUpRight, Map, MapPin, Sun } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { HEIMAT_SLUG, pvgisQuelle, regionFuer, regionenNachLand } from "@/lib/regionen";
import { FIRMA } from "@/lib/site";

/**
 * Regionaler Abschnitt „Einzugsgebiet Österreich“: aus Ostermiething in alle
 * neun Bundesländer. Je Bundesland die Landeshauptstadt mit PVGIS-Ertrag
 * (Süd, 35° Neigung) und Link auf die Regionalseite /photovoltaik/[ort].
 * Daten: @/lib/regionen (PVGIS v5.3, EU JRC).
 */
const de = (n) => Number(n).toLocaleString("de-DE");

export default function RegionOesterreich() {
  const laender = regionenNachLand()
    .map((g) => ({ ...g, ref: g.hauptstadt || g.orte[0] }))
    .filter((g) => g.ref?.pvgis);
  const heimat = regionFuer(HEIMAT_SLUG);
  const { quelle } = pvgisQuelle();
  const ertraege = laender.map((g) => g.ref.pvgis.sued35_kwh_kwp);
  const min = Math.min(...ertraege);
  const max = Math.max(...ertraege);

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
      <Reveal>
        <Eyebrow className="mb-4">Einzugsgebiet Österreich</Eyebrow>
        <h2 className="ov-h2 text-ink-900">
          Photovoltaik in ganz Österreich – <span className="ov-text-gradient">aus {FIRMA.ort}</span> geplant und errichtet
        </h2>
        <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">
          Unser Sitz ist in {FIRMA.ort} im Innviertel ({FIRMA.bundesland}), direkt an der Grenze zu Salzburg. Von hier aus planen und errichten wir Anlagen in allen neun
          Bundesländern – mit Projektleitung aus einer Hand und Fernüberwachung, die nicht an der Landesgrenze endet.
        </p>
        <p className="mt-4 text-[16.5px] leading-relaxed text-ink-600">
          Baurecht, Netzbetreiber und Förderungen unterscheiden sich je Bundesland. Die Details finden Sie in der{" "}
          <Link href="/forderungen/landesforderungen" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
            Übersicht der Landesförderungen
          </Link>{" "}
          und auf den Seiten der einzelnen Standorte.
        </p>

        <div className="mt-8 flex items-start gap-4 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sun-300/30 text-ink-900">
            <Sun aria-hidden="true" className="h-6 w-6 text-sun-500" />
          </span>
          <div>
            <p className="font-display text-[22px] font-extrabold leading-tight text-ink-900">
              {de(min)}–{de(max)} <span className="text-[15px] font-semibold text-ink-500">kWh je kWp im Jahr</span>
            </p>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">
              So viel erzeugt eine nach Süden ausgerichtete Anlage mit 35° Neigung in den Landeshauptstädten
              {heimat?.pvgis ? `, am Firmensitz ${FIRMA.ort} rund ${de(heimat.pvgis.sued35_kwh_kwp)} kWh` : ""}. Quelle: {quelle}.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-ink-200/70 md:p-8">
        <div aria-hidden="true" className="ov-grid-bg-light pointer-events-none absolute inset-0" />
        <div className="relative">
          <div className="flex items-end justify-between gap-4 border-b border-ink-100 pb-5">
            <div>
              <h3 className="font-display text-[20px] font-bold text-ink-900">Ertrag je Bundesland</h3>
              <p className="mt-1 text-[14px] text-ink-500">Landeshauptstadt, PVGIS, Süd 35°</p>
            </div>
            <p className="shrink-0 text-right">
              <span className="ov-num block font-display text-[30px] font-extrabold leading-none text-ov-600">{laender.length}</span>
              <span className="text-[12px] text-ink-500">Bundesländer</span>
            </p>
          </div>

          <ul className="mt-2 divide-y divide-ink-100">
            {laender.map((g) => {
              const wert = g.ref.pvgis.sued35_kwh_kwp;
              return (
                <li key={g.land}>
                  <Link href={`/photovoltaik/${g.ref.slug}`} className="group -mx-3 flex min-h-[60px] items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-ov-50/70">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ov-50 text-ov-600 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                      <MapPin aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="truncate text-[16px] font-semibold text-ink-900">
                          {g.name}
                          <span className="ml-2 text-[13px] font-normal text-ink-500">{g.ref.kurzname || g.ref.name}</span>
                        </span>
                        <span className="ov-num shrink-0 text-[13px] text-ink-500">{de(wert)} kWh/kWp</span>
                      </span>
                      <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <span className="block h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600" style={{ width: `${(wert / max) * 100}%` }} />
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-600" />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/photovoltaik" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              <Map aria-hidden="true" className="h-4 w-4" />
              Alle Standorte in Österreich
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/referenzen/projekte" className="text-[14px] font-medium text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink-800">
              Projekte ansehen
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
