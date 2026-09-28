import Link from "next/link";
import { ArrowRight, HandCoins, Home, MapPin } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { HEIMAT_SLUG, alleRegionen, pvgisQuelle, regionFuer, regionenNachLand } from "@/lib/regionen";
import { BASE_URL, LOCALE, SITE_NAME } from "@/lib/site";

const HUB = "Photovoltaik Österreich";
const TITEL = "Photovoltaik in Österreich: Standorte & Erträge | Ökovolt";
const BESCHREIBUNG =
  "PV-Anlagen für Gewerbe, Industrie und Gemeinden in allen neun Bundesländern: Standorte mit PVGIS-Ertrag, Netzbetreiber, Baurecht und Landesförderung.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: `${BASE_URL}/photovoltaik` },
  openGraph: { type: "website", locale: LOCALE, url: `${BASE_URL}/photovoltaik`, siteName: SITE_NAME, title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

const de = (n) => Number(n).toLocaleString("de-DE");
const winteranteil = (p) => Math.round(([0, 1, 10, 11].reduce((s, i) => s + p.monate_sued35[i], 0) / p.sued35_kwh_kwp) * 100);

export default function PhotovoltaikOesterreich() {
  const regionen = alleRegionen();
  const gruppen = regionenNachLand();
  const heimat = regionFuer(HEIMAT_SLUG);
  const { quelle, routeQuelle, abgerufen } = pvgisQuelle();
  const hauptstaedte = gruppen.map((g) => g.hauptstadt).filter(Boolean).sort((a, b) => b.pvgis.sued35_kwh_kwp - a.pvgis.sued35_kwh_kwp);
  const bester = regionen.reduce((a, b) => (b.pvgis.sued35_kwh_kwp > a.pvgis.sued35_kwh_kwp ? b : a));
  const schwaechster = regionen.reduce((a, b) => (b.pvgis.sued35_kwh_kwp < a.pvgis.sued35_kwh_kwp ? b : a));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ItemList",
                name: "Photovoltaik-Standorte von Ökovolt in Österreich",
                itemListElement: regionen.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: `Photovoltaik ${r.name}`, url: `${BASE_URL}/photovoltaik/${r.slug}` })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Startseite", item: BASE_URL },
                  { "@type": "ListItem", position: 2, name: HUB, item: `${BASE_URL}/photovoltaik` },
                ],
              },
            ],
          }),
        }}
      />
      <PageHero
        variant="dark"
        breadcrumbs={[{ name: HUB }]}
        eyebrow="Von Ostermiething aus – in allen neun Bundesländern"
        title={
          <>
            {"Photovoltaik in Österreich –"} <span className="ov-text-gradient-light">Standort für Standort.</span>
          </>
        }
        lead={`Für ${regionen.length} Städte und Wirtschaftsräume zeigen wir, was eine Anlage dort erzeugt, welcher Verteilnetzbetreiber zuständig ist, was das Landesbaurecht verlangt und welche Förderung greift. Den höchsten simulierten Ertrag hat ${bester.kurzname || bester.name} mit ${de(bester.pvgis.sued35_kwh_kwp)} kWh je kWp, den niedrigsten ${schwaechster.kurzname || schwaechster.name} mit ${de(schwaechster.pvgis.sued35_kwh_kwp)} kWh.`}
      />

      {heimat && (
        <Section tone="white" space="md">
          <Link
            href={`/photovoltaik/${heimat.slug}`}
            className="group flex flex-col gap-4 rounded-3xl bg-ov-50 p-6 ring-1 ring-ov-200 transition hover:ring-ov-400 md:flex-row md:items-center md:justify-between md:p-8"
          >
            <span className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-600 text-white">
                <Home aria-hidden="true" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-ov-700">Heimatstandort Innviertel</span>
                <span className="mt-1 block font-display text-[22px] font-bold text-ink-900">Photovoltaik Ostermiething</span>
                <span className="mt-1 block max-w-2xl text-[15px] leading-relaxed text-ink-700">
                  Firmensitz im Gewerbegebiet Ostermiething, an der Salzach zwischen Salzburg und Braunau. Von hier aus planen, bauen und betreuen wir Anlagen in ganz Österreich.
                </span>
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="h-6 w-6 shrink-0 text-ov-600 transition-transform group-hover:translate-x-1" />
          </Link>
        </Section>
      )}

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="PVGIS-Vergleich"
          title="Ertrag je Landeshauptstadt"
          lead={`Simulierter Jahresertrag je kWp installierter Leistung, sortiert nach Süddach-Ertrag. Vorn liegen ${hauptstaedte
            .slice(0, 3)
            .map((h) => h.kurzname || h.name)
            .join(", ")}, am Ende ${hauptstaedte
            .slice(-2)
            .map((h) => h.kurzname || h.name)
            .join(" und ")} – der Unterschied zwischen erstem und letztem Platz beträgt ${Math.round((hauptstaedte[0].pvgis.sued35_kwh_kwp / hauptstaedte[hauptstaedte.length - 1].pvgis.sued35_kwh_kwp - 1) * 100)} %.`}
          className="mb-8"
        />
        <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-ink-200/70">
          <table className="w-full min-w-[720px] text-left text-[14.5px]">
            <caption className="sr-only">Simulierter PV-Jahresertrag der neun Landeshauptstädte laut PVGIS</caption>
            <thead className="border-b border-ink-200 bg-sand-50 text-[13px] text-ink-600">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Landeshauptstadt</th>
                <th scope="col" className="px-5 py-3 font-semibold">Bundesland</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Süd, 35°</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Ost/West, 15°</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Flachdach, 10°</th>
                <th scope="col" className="px-5 py-3 text-right font-semibold">Nov–Feb</th>
                <th scope="col" className="px-5 py-3 font-semibold">Verteilnetzbetreiber</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {hauptstaedte.map((h) => (
                <tr key={h.slug}>
                  <th scope="row" className="px-5 py-3 font-semibold text-ink-900">
                    <Link href={`/photovoltaik/${h.slug}`} className="underline decoration-ov-300 underline-offset-4 hover:decoration-current">
                      {h.kurzname || h.name}
                    </Link>
                  </th>
                  <td className="px-5 py-3 text-ink-700">{h.bundesland}</td>
                  <td className="px-5 py-3 text-right font-semibold text-ink-900">{de(h.pvgis.sued35_kwh_kwp)} kWh</td>
                  <td className="px-5 py-3 text-right text-ink-700">{de(h.pvgis.ostwest15_kwh_kwp)} kWh</td>
                  <td className="px-5 py-3 text-right text-ink-700">{de(h.pvgis.flach10_kwh_kwp)} kWh</td>
                  <td className="px-5 py-3 text-right text-ink-700">{winteranteil(h.pvgis)} %</td>
                  <td className="px-5 py-3 text-ink-700">{h.fakten.netzbetreiber?.kurz || h.fakten.netzbetreiber?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-600">
          Werte je kWp und Jahr, Referenzpunkt Stadtzentrum, inklusive Geländehorizont. Quelle: {quelle}, abgerufen {new Date(abgerufen).toLocaleDateString("de-AT")}. „Nov–Feb“ = Anteil der Monate
          November bis Februar am Jahresertrag (Süd, 35°).
        </p>
      </Section>

      {gruppen.map((g, i) => (
        <Section key={g.land} tone={i % 2 ? "sand" : "white"} space="md">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={g.name} title={`PV-Anlagen für Gewerbe in ${g.name}`} />
            <Link href={g.foerderHref} className="inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
              <HandCoins aria-hidden="true" className="h-4 w-4" />
              Landesförderungen {g.name}
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.orte.map((r) => (
              <li key={r.slug}>
                <Link href={`/photovoltaik/${r.slug}`} className="group flex h-full items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/70 transition hover:ring-ov-400">
                  <span>
                    <span className="block font-display text-[18px] font-bold text-ink-900">Photovoltaik {r.kurzname || r.name}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 text-[13.5px] text-ink-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                        {r.heimat ? "Firmensitz" : `${r.km} km`} · {r.bezirk}
                      </span>
                      <span>{de(r.pvgis.sued35_kwh_kwp)} kWh/kWp</span>
                    </span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-ov-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      <Section tone="white" space="sm">
        <p className="text-[13px] leading-relaxed text-ink-600">
          Entfernungen als Luftlinie ab Firmensitz Ostermiething (Gewerbegebiet 10); Fahrstrecken auf den Ortsseiten laut {routeQuelle}. Erträge: simulierter Jahresertrag je kWp für ein Süddach mit
          35° Neigung, {quelle}. Verteilnetzbetreiber laut Netzbetreiber-Abfrage je Postleitzahl im E-Control-Tarifkalkulator.
        </p>
      </Section>

      <CtaBand
        title="Ihr Standort ist nicht dabei?"
        text="Die Liste zeigt Orte, für die wir eigene Standortdaten aufbereitet haben. Anlagen planen und bauen wir in ganz Österreich – schicken Sie uns Adresse und Lastgang, wir rechnen Ihren Standort durch."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "PV für Gewerbe", href: "/gewerbe" }}
      />
    </div>
  );
}
