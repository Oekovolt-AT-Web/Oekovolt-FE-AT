import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck2, Compass, Factory, HandCoins, MapPin, MonitorCog, Route, Smartphone, Sun, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import ProjektKarte from "@/components/Project/ProjektKarte";
import RegionErtrag from "@/components/Region/RegionErtrag";
import RegionFakten from "@/components/Region/RegionFakten";
import { ladeProjekte } from "@/components/Project/ladeProjekte";
import { REGIONEN } from "@/data/regionen";
import { ZONEN, naechsteReferenzen, nachbarn, pvgisQuelle, pvgisReferenz, regionFuer } from "@/lib/regionen";
import { BASE_URL, LOCALE, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = false;

const HUB = "Photovoltaik Österreich";

export function generateStaticParams() {
  return Object.keys(REGIONEN).map((stadt) => ({ stadt }));
}

export async function generateMetadata({ params }) {
  const { stadt } = await params;
  const r = regionFuer(stadt);
  if (!r) return {};
  const url = `${BASE_URL}/photovoltaik/${r.slug}`;
  return {
    title: r.seoTitel,
    description: r.beschreibung,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: LOCALE, url, siteName: SITE_NAME, title: r.seoTitel, description: r.beschreibung, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
  };
}

// Leistungsumfang je Entfernung – bewusst ehrlich formuliert, keine Reaktionszeit-Zusagen
const UMFANG = {
  1: {
    titel: "So arbeiten wir in",
    punkte: [
      { icon: CalendarCheck2, title: "Begehung vor Ort", text: "Dach, Statikunterlagen, Trafo- und Zählerraum sehen wir uns bei Ihnen an – für Gewerbe, Landwirtschaft und Gemeinden ebenso wie für Wohnanlagen." },
      { icon: Wrench, title: "Montage aus Ostermiething", text: "Planung, Montage, Netzanschluss beim Verteilnetzbetreiber und Inbetriebnahme aus einer Hand – mit eigenen Teams aus dem Innviertel." },
      { icon: Route, title: "Service in der Heimatregion", text: "Wartung, E-Check und Störungsbehebung mit kurzen Wegen; auf Wunsch mit Wartungsvertrag und festem Ansprechpartner." },
    ],
  },
  2: {
    titel: "So arbeiten wir in",
    punkte: [
      { icon: Smartphone, title: "Vorplanung mit Ihren Daten", text: "Lastgang, Stromrechnung, Dachpläne und Fotos reichen für eine belastbare Vorplanung. Die Begehung vor Ort vereinbaren wir vor dem verbindlichen Angebot." },
      { icon: Factory, title: "Gewerbe, Industrie, Landwirtschaft", text: "Dach-, Carport- und Freiflächenanlagen inklusive Speicher, Ladeinfrastruktur und EZA-Regelung am Netzanschlusspunkt." },
      { icon: MonitorCog, title: "Überwachung aus der Ferne", text: "Eigene Fernwartungs- und SCADA-Systeme melden Abweichungen; Vor-Ort-Einsätze planen wir gebündelt und frühzeitig." },
    ],
  },
  3: {
    titel: "Unser Angebot für",
    punkte: [
      { icon: Sun, title: "Schwerpunkt größere Anlagen", text: "In dieser Entfernung bauen wir vor allem für Unternehmen, Industrie, Landwirtschaft und öffentliche Hand. Private Anfragen prüfen wir im Einzelfall." },
      { icon: Smartphone, title: "Digitale Vorplanung", text: "Lastgangdaten, Pläne und Fotos genügen für eine erste Auslegung und Wirtschaftlichkeitsrechnung – ohne dass jemand anreisen muss." },
      { icon: MonitorCog, title: "Betrieb mit Fernüberwachung", text: "Monitoring über eigene Fernwartung und SCADA; Service-Einsätze werden gebündelt und im Voraus geplant." },
    ],
  },
};

const BILD_STANDARD = { src: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", alt: "Luftaufnahme eines Gewerbegebäudes mit Photovoltaikanlagen auf den Flachdächern" };
const BILD_ALPIN = { src: "/Images/AT/chalets/pv-module-schnee.jpg", alt: "Photovoltaikmodule im Winter mit Schnee" };

export default async function RegionSeite({ params }) {
  const { stadt } = await params;
  const r = regionFuer(stadt);
  if (!r) notFound();

  const referenzen = naechsteReferenzen(r, await ladeProjekte());
  const umgebung = nachbarn(r);
  const { quelle, abgerufen } = pvgisQuelle();
  const url = `${BASE_URL}/photovoltaik/${r.slug}`;
  const umfang = UMFANG[r.zone];
  const name = r.kurzname || r.name;
  const bild = r.bild || (r.alpin ? BILD_ALPIN : BILD_STANDARD);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: `Photovoltaik für Gewerbe und Industrie in ${r.name}`,
                serviceType: "Planung, Errichtung und Betrieb von Photovoltaikanlagen",
                provider: { "@id": `${BASE_URL}/#organization` },
                areaServed: {
                  "@type": "City",
                  name: r.name,
                  containedInPlace: { "@type": "AdministrativeArea", name: r.bundesland, containedInPlace: { "@type": "Country", name: "Österreich" } },
                },
                url,
                description: r.beschreibung,
              },
              { "@type": "FAQPage", mainEntity: r.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Startseite", item: BASE_URL },
                  { "@type": "ListItem", position: 2, name: HUB, item: `${BASE_URL}/photovoltaik` },
                  { "@type": "ListItem", position: 3, name: r.name, item: url },
                ],
              },
            ],
          }),
        }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: HUB, href: "/photovoltaik" }, { name: r.name }]}
        eyebrow={r.eyebrow || `Photovoltaik in ${name}`}
        title={
          <>
            {r.titel.replace(/ –$/, " –")} <span className="ov-text-gradient-light">{r.akzent}</span>
          </>
        }
        lead={r.lead}
        image={bild}
        actions={[
          { label: r.zone === 3 ? "Projekt besprechen" : "Beratung vereinbaren", href: r.zone === 1 ? "/termin?art=vor-ort" : "/termin?art=video" },
          { label: "Ertrag berechnen", href: "/solarrechner", icon: Sun },
        ]}
        points={[
          r.heimat ? "Firmensitz Ostermiething" : `${r.km} km ab Ostermiething`,
          `${r.bezirk} · ${r.bundesland}`,
          r.fakten.netzbetreiber?.kurz || r.fakten.netzbetreiber?.name ? `Netz: ${r.fakten.netzbetreiber.kurz || r.fakten.netzbetreiber.name}` : null,
        ].filter(Boolean)}
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow={`Photovoltaik in ${name}`} title={r.einleitungTitel} />
            <div className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-700">
              {r.einleitung.map((absatz) => (
                <p key={absatz.slice(0, 40)}>{absatz}</p>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-4">
            {r.schwerpunkte.map((s) => (
              <div key={s.titel} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                <h3 className="font-display text-[19px] font-bold text-ink-900">{s.titel}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {r.wirtschaft && (
        <Section tone="sand" space="lg">
          <SectionHeading eyebrow="Wirtschaftsstandort" title={r.wirtschaft.titel} lead={r.wirtschaft.text} className="mb-10" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {r.wirtschaft.punkte.map((w) => (
              <div key={w.titel} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
                <h3 className="flex items-start gap-2 font-display text-[18px] font-bold text-ink-900">
                  <Factory aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
                  {w.titel}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{w.text}</p>
              </div>
            ))}
          </div>
          {r.wirtschaft.url && (
            <p className="mt-6 text-[12.5px] text-ink-600">
              Quelle:{" "}
              <a href={r.wirtschaft.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:decoration-current">
                {r.wirtschaft.quelle || "Wikipedia"}
              </a>
              . Genannte Unternehmen und Standorte beschreiben die regionale Wirtschaft – sie sind keine Referenzen von Ökovolt.
            </p>
          )}
        </Section>
      )}

      <Section tone={r.wirtschaft ? "white" : "sand"} space="lg">
        <SectionHeading eyebrow="Sonne in Zahlen" title={`So viel Solarstrom bringt ein Dach in ${name}`} className="mb-10" />
        <RegionErtrag name={name} ort={r.pvgis} referenz={pvgisReferenz()} istReferenz={r.heimat} quelle={quelle} abgerufen={abgerufen} />
      </Section>

      <Section tone={r.wirtschaft ? "sand" : "white"} space="lg">
        <SectionHeading
          eyebrow="Vor Ort"
          title={`Netz, Baurecht und Förderung in ${name}`}
          lead={`Recherchiert zum Stand ${r.fakten.stand ? new Date(r.fakten.stand).toLocaleDateString("de-AT") : "September 2026"} – jede Angabe mit Quelle. Förderungen und Netzbedingungen ändern sich; wir prüfen den aktuellen Stand im Angebot erneut.`}
          className="mb-10"
        />
        <RegionFakten region={r} />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow={ZONEN[r.zone].label} title={`${umfang.titel} ${name}`} className="mb-10" />
        <FeatureGrid cols={3} items={umfang.punkte} />
      </Section>

      {referenzen.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Referenzen"
            title={referenzen[0].abstand <= 30 ? `Unsere Projekte in der Nähe von ${name}` : "Unsere nächstgelegenen Projekte"}
            lead={referenzen[0].abstand <= 30 ? "Echte Anlagen aus unserem Portfolio – mit Entfernung zum Ortszentrum." : `Direkt in ${name} zeigen wir noch kein Projekt. Das sind die nächstgelegenen Anlagen aus unserem Portfolio.`}
            className="mb-10"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {referenzen.map((p) => (
              <div key={p.slug}>
                <ProjektKarte projekt={p} />
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-600">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                  rund {p.abstand} km von {name}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={`Photovoltaik in ${name}: gut zu wissen`} />
          <Faq items={r.faq} schema={false} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Weitere Standorte" title={`Photovoltaik rund um ${name}`} className="mb-8" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {umgebung.map((n) => (
            <li key={n.slug}>
              <Link href={`/photovoltaik/${n.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 hover:ring-ov-400">
                <span>
                  <span className="block font-semibold text-ink-900">Photovoltaik {n.kurzname || n.name}</span>
                  <span className="text-[13px] text-ink-600">
                    {n.abstand} km entfernt · {n.bundesland}
                  </span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/photovoltaik" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            <Compass aria-hidden="true" className="h-4 w-4" />
            Alle Standorte in Österreich
          </Link>
          <Link href={r.foerderHref} className="inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            <HandCoins aria-hidden="true" className="h-4 w-4" />
            PV-Förderung {r.bundesland}
          </Link>
          <Link href="/gewerbe" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            <Factory aria-hidden="true" className="h-4 w-4" />
            PV-Anlagen für Gewerbe &amp; Industrie
          </Link>
          {r.links?.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        title={r.cta.titel}
        text={r.cta.text}
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: r.zone === 1 ? "/termin?art=vor-ort" : "/termin?art=video", icon: CalendarCheck2 }}
      />
    </div>
  );
}
