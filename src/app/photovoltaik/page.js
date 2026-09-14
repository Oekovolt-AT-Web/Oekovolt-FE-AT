import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import { ZONEN, alleRegionen, pvgisQuelle } from "@/lib/regionen";

const BASE = "https://www.oekovolt.de";
const TITEL = "Einzugsgebiet: Photovoltaik in Süddeutschland, Stadt für Stadt | Ökovolt";
const BESCHREIBUNG =
  "Von Türkheim aus planen und bauen wir Photovoltaikanlagen in Bayern, Baden-Württemberg und bis Frankfurt – mit standortgenauen Ertragswerten, Netzbetreiber, Förderung und Anlaufstellen je Stadt.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: `${BASE}/photovoltaik` },
  openGraph: { type: "website", locale: "de_DE", url: `${BASE}/photovoltaik`, siteName: "Ökovolt Deutschland", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE}/og-image.jpg`, width: 1200, height: 630 }] },
};

const de = (n) => Number(n).toLocaleString("de-DE");

export default function Einzugsgebiet() {
  const regionen = alleRegionen();
  const { quelle } = pvgisQuelle();
  const zonen = [1, 2, 3].map((z) => ({ z, orte: regionen.filter((r) => r.zone === z) }));
  const besterErtrag = regionen.reduce((a, b) => (b.pvgis.sued35_kwh_kwp > a.pvgis.sued35_kwh_kwp ? b : a));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Photovoltaik-Einzugsgebiet von Ökovolt",
            itemListElement: regionen.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: `Photovoltaik ${r.name}`, url: `${BASE}/photovoltaik/${r.slug}` })),
          }),
        }}
      />
      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Einzugsgebiet" }]}
        eyebrow="Von Türkheim aus"
        title={
          <>
            {"Unser Einzugsgebiet\u00a0–"} <span className="ov-text-gradient-light">Stadt für Stadt.</span>
          </>
        }
        lead={`Für jede Stadt zeigen wir, was ein Dach dort erzeugt, wer das Stromnetz betreibt und welche Förderung und Beratung es vor Ort gibt. Den höchsten simulierten Ertrag in unserem Gebiet hat ${besterErtrag.name} mit ${de(besterErtrag.pvgis.sued35_kwh_kwp)} kWh je kWp.`}
      />

      {zonen.map(({ z, orte }) => (
        <Section key={z} tone={z === 2 ? "sand" : "white"} space="md">
          <SectionHeading eyebrow={ZONEN[z].kurz} title={ZONEN[z].label} className="mb-8" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {orte.map((r) => (
              <li key={r.slug}>
                <Link href={`/photovoltaik/${r.slug}`} className="group flex h-full items-center justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-ink-200/70 transition hover:ring-ov-400">
                  <span>
                    <span className="block font-display text-[18px] font-bold text-ink-900">Photovoltaik {r.name}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 text-[13.5px] text-ink-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                        {r.km} km · {r.bundesland}
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
          Entfernungen als Luftlinie ab Firmensitz Türkheim. Erträge: simulierter Jahresertrag je kWp für ein Süddach mit 35° Neigung, {quelle}.
        </p>
      </Section>

      <CtaBand
        title="Ihre Stadt ist nicht dabei?"
        text="Die Liste zeigt Städte, zu denen wir eigene Standortdaten aufbereitet haben. Anlagen planen wir auch in den Gemeinden dazwischen – fragen Sie uns einfach."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Solarrechner", href: "/solarrechner" }}
      />
    </div>
  );
}
