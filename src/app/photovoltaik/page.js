import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandCoins, MapPin, Table2 } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import StandortKarteAT from "@/components/Photovoltaik/StandortKarteAT";
import ErtragBalken from "@/components/Region/ErtragBalken";
import FachAkkordeon, { FachTabelle } from "@/components/Produktdetail/FachAkkordeon";
import { INNVIERTEL_BILD, landesBild } from "@/components/Region/landesBilder";
import { HEIMAT_SLUG, alleRegionen, pvgisQuelle, regionFuer, regionenNachLand } from "@/lib/regionen";
import { BASE_URL, LOCALE, SITE_NAME } from "@/lib/site";
import { landPfad } from "@/lib/bundesland/auswertung";

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
const name = (r) => r.kurzname || r.name;

export default function PhotovoltaikOesterreich() {
  const regionen = alleRegionen();
  const gruppen = regionenNachLand();
  const heimat = regionFuer(HEIMAT_SLUG);
  const { quelle, routeQuelle, abgerufen } = pvgisQuelle();
  const hauptstaedte = gruppen.map((g) => g.hauptstadt).filter(Boolean).sort((a, b) => b.pvgis.sued35_kwh_kwp - a.pvgis.sued35_kwh_kwp);
  const bester = regionen.reduce((a, b) => (b.pvgis.sued35_kwh_kwp > a.pvgis.sued35_kwh_kwp ? b : a));
  const schwaechster = regionen.reduce((a, b) => (b.pvgis.sued35_kwh_kwp < a.pvgis.sued35_kwh_kwp ? b : a));

  const kartenOrte = regionen.map((r) => ({
    slug: r.slug,
    name: name(r),
    land: r.land,
    bundesland: r.bundesland,
    lat: r.pvgis.lat,
    lon: r.pvgis.lon,
    ertrag: r.pvgis.sued35_kwh_kwp,
    km: r.km,
    heimat: r.heimat,
  }));
  const kartenLaender = gruppen.map((g) => ({ land: g.land, name: g.name, anzahl: g.orte.length }));

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
            {"Photovoltaik in Österreich –"} <span className="ov-text-gradient-light">Standort für Standort.</span>
          </>
        }
        lead={`Für ${regionen.length} Städte und Wirtschaftsräume zeigen wir, was eine Anlage dort erzeugt, welcher Verteilnetzbetreiber zuständig ist, was das Landesbaurecht verlangt und welche Förderung greift. Den höchsten simulierten Ertrag hat ${name(bester)} mit ${de(bester.pvgis.sued35_kwh_kwp)} kWh je kWp, den niedrigsten ${name(schwaechster)} mit ${de(schwaechster.pvgis.sued35_kwh_kwp)} kWh.`}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Zur Ertragskarte", href: "#karte", icon: MapPin },
        ]}
        stats={[
          { value: regionen.length, label: "Standorte mit eigener Seite" },
          { value: gruppen.length, label: "Bundesländer" },
          { value: bester.pvgis.sued35_kwh_kwp, label: `kWh je kWp in ${name(bester)} (Süd, 35°)` },
        ]}
      />

      {/* Karte */}
      <section id="karte" className="relative isolate scroll-mt-20 overflow-hidden bg-navy-950 pb-20 text-white md:pb-28">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden="true" className="absolute left-1/3 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-ov-500/15 blur-[140px]" />
        <div aria-hidden="true" className="absolute -right-24 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-sun-400/10 blur-[140px]" />
        <div className="ov-container">
          <div className="mb-10 grid items-end gap-6 border-t border-white/10 pt-16 md:pt-20 lg:grid-cols-[1.2fr_1fr]">
            <SectionHeading
              dark
              eyebrow="Ertragskarte"
              title={
                <>
                  Wo die Sonne in Österreich <span className="ov-text-gradient-light">am meisten liefert</span>
                </>
              }
            />
            <p className="text-[15.5px] leading-relaxed text-white/65 lg:pb-1">
              Jeder Punkt ist ein Standort mit eigener Seite, gefärbt nach simuliertem Jahresertrag. Filtern Sie nach Bundesland oder wählen Sie einen Ort für Netzbetreiber, Baurecht und Förderung.
            </p>
          </div>
          <Reveal dir="scale">
            <StandortKarteAT orte={kartenOrte} laender={kartenLaender} quelle={quelle} />
          </Reveal>
        </div>
      </section>

      {/* Heimat */}
      {heimat && (
        <Section tone="white" space="lg">
          <SplitMedia
            eyebrow="Heimatstandort Innviertel"
            title="Photovoltaik Ostermiething – hier sitzen wir"
            text={[
              "Firmensitz im Gewerbegebiet Ostermiething, an der Salzach zwischen Salzburg und Braunau. Von hier aus planen, bauen und betreuen wir Anlagen in ganz Österreich.",
              `Alle Entfernungen auf den Standortseiten beziehen sich auf diesen Punkt; der PVGIS-Ertrag am Firmensitz beträgt ${de(heimat.pvgis.sued35_kwh_kwp)} kWh je kWp (Süd, 35°) und dient als Vergleichswert.`,
            ]}
            points={["Planung, Lager und Montage-Teams vor Ort", "Kurze Wege nach Salzburg, Braunau und ins Innviertel", "Fernüberwachung für Anlagen in allen Bundesländern"]}
            action={{ label: "Photovoltaik Ostermiething", href: `/photovoltaik/${heimat.slug}` }}
            image={{ src: INNVIERTEL_BILD.src, alt: INNVIERTEL_BILD.alt }}
          />
        </Section>
      )}

      {/* PVGIS-Vergleich */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="PVGIS-Vergleich"
            title="Ertrag je Landeshauptstadt"
            lead={`Simulierter Jahresertrag je kWp installierter Leistung, sortiert nach Süddach-Ertrag. Vorn liegen ${hauptstaedte
              .slice(0, 3)
              .map(name)
              .join(", ")}, am Ende ${hauptstaedte
              .slice(-2)
              .map(name)
              .join(" und ")} – der Unterschied zwischen erstem und letztem Platz beträgt ${Math.round((hauptstaedte[0].pvgis.sued35_kwh_kwp / hauptstaedte[hauptstaedte.length - 1].pvgis.sued35_kwh_kwp - 1) * 100)} %.`}
          />
          <div className="rounded-3xl bg-white p-5 shadow-xl ring-1 ring-ink-200/70 md:p-8">
            <ErtragBalken items={hauptstaedte.map((h, i) => ({ name: name(h), sub: h.bundesland, wert: h.pvgis.sued35_kwh_kwp, href: `/photovoltaik/${h.slug}`, hervor: i === 0 }))} />
          </div>
        </div>
        <FachAkkordeon
          className="mt-10"
          items={[
            {
              id: "pvgis-tabelle",
              icon: Table2,
              titel: "Für Technik & Einkauf: alle Ausrichtungen und Netzbetreiber",
              kurz: "Süd 35°, Ost/West 15°, Flachdach 10°, Winteranteil",
              inhalt: (
                <>
                  <FachTabelle
                    caption="Simulierter PV-Jahresertrag der neun Landeshauptstädte laut PVGIS"
                    minBreite={760}
                    kopf={["Landeshauptstadt", "Bundesland", "Süd, 35°", "Ost/West, 15°", "Flachdach, 10°", "Nov–Feb", "Verteilnetzbetreiber"]}
                    zeilen={hauptstaedte.map((h) => [
                      <Link key="l" href={`/photovoltaik/${h.slug}`} className="underline decoration-ov-300 underline-offset-4 hover:decoration-current">
                        {name(h)}
                      </Link>,
                      h.bundesland,
                      `${de(h.pvgis.sued35_kwh_kwp)} kWh`,
                      `${de(h.pvgis.ostwest15_kwh_kwp)} kWh`,
                      `${de(h.pvgis.flach10_kwh_kwp)} kWh`,
                      `${winteranteil(h.pvgis)} %`,
                      h.fakten.netzbetreiber?.kurz || h.fakten.netzbetreiber?.name || "–",
                    ])}
                  />
                  <p className="mt-4 text-[12.5px] leading-relaxed text-ink-600">
                    Werte je kWp und Jahr, Referenzpunkt Stadtzentrum, inklusive Geländehorizont. Quelle: {quelle}, abgerufen {new Date(abgerufen).toLocaleDateString("de-AT")}. „Nov–Feb“ = Anteil der
                    Monate November bis Februar am Jahresertrag (Süd, 35°).
                  </p>
                </>
              ),
            },
          ]}
        />
      </Section>

      {/* Bundesländer */}
      <Section tone="white" space="lg" id="bundeslaender">
        <SectionHeading
          eyebrow="Alle Standorte"
          title={
            <>
              PV-Anlagen für Gewerbe in <span className="ov-text-gradient">allen neun Bundesländern</span>
            </>
          }
          lead="Je Bundesland die Orte mit eigener Seite – mit Entfernung ab Ostermiething und simuliertem Ertrag. Baurecht und Landesförderung unterscheiden sich; den Überblick finden Sie jeweils auf der Länderseite."
          className="mb-12"
        />
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gruppen.map((g, i) => {
            const bild = landesBild(g.land);
            return (
              <Reveal as="li" key={g.land} delay={(i % 3) * 80} className="flex">
                <article className="flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 transition-shadow duration-300 hover:shadow-xl">
                  <div className="relative h-36 overflow-hidden bg-navy-900">
                    <Image src={bild.src} alt={bild.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover" style={{ objectPosition: bild.position || "50% 50%" }} />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent" />
                    <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3 text-white">
                      <h3 className="font-display text-[22px] font-extrabold leading-tight">{g.name}</h3>
                      <span className="ov-glass shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold">
                        {g.orte.length} {g.orte.length === 1 ? "Ort" : "Orte"}
                      </span>
                    </div>
                  </div>
                  <ul className="flex-1 divide-y divide-ink-100 px-2 py-2">
                    {g.orte.map((r) => (
                      <li key={r.slug}>
                        <Link href={`/photovoltaik/${r.slug}`} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-sand-50">
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-ink-900 group-hover:text-ov-700">Photovoltaik {name(r)}</span>
                            <span className="flex items-center gap-1 text-[12.5px] text-ink-500">
                              <MapPin aria-hidden="true" className="h-3 w-3 text-ov-600" />
                              {r.heimat ? "Firmensitz" : `${r.km} km`} · {r.bezirk}
                            </span>
                          </span>
                          <span className="ov-num shrink-0 text-[13px] font-semibold text-ink-700">{de(r.pvgis.sued35_kwh_kwp)} kWh</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={landPfad(g.land)} className="group flex min-h-12 items-center gap-2 border-t border-ink-100 px-5 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                    Photovoltaik {g.name} im Überblick
                    <ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href={g.foerderHref} className="group flex min-h-12 items-center gap-2 border-t border-ink-100 px-5 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                    <HandCoins aria-hidden="true" className="h-4 w-4" />
                    Landesförderungen {g.name}
                    <ArrowRight aria-hidden="true" className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-10 text-[13px] leading-relaxed text-ink-600">
          Entfernungen als Luftlinie ab Firmensitz Ostermiething (Gewerbegebiet 10); Fahrstrecken auf den Ortsseiten laut {routeQuelle}. Erträge: simulierter Jahresertrag je kWp für ein Süddach mit 35°
          Neigung, {quelle}. Verteilnetzbetreiber laut Netzbetreiber-Abfrage je Postleitzahl im E-Control-Tarifkalkulator. Landschaftsfotos: Wikimedia Commons, Nachweise unter{" "}
          <Link href="/bildnachweis" className="underline decoration-ink-300 underline-offset-2 hover:decoration-current">
            Bildnachweis
          </Link>
          .
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
