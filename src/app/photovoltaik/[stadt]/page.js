import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck2, Compass, MapPin, Route, Smartphone, Sun, Wrench } from "lucide-react";

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

export const revalidate = 3600;
export const dynamicParams = false;

const BASE = "https://www.oekovolt.de";

export function generateStaticParams() {
  return Object.keys(REGIONEN).map((stadt) => ({ stadt }));
}

export async function generateMetadata({ params }) {
  const { stadt } = await params;
  const r = regionFuer(stadt);
  if (!r) return {};
  const url = `${BASE}/photovoltaik/${r.slug}`;
  return {
    title: r.seoTitel,
    description: r.beschreibung,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "de_DE", url, siteName: "Ökovolt Deutschland", title: r.seoTitel, description: r.beschreibung, images: [{ url: `${BASE}/og-image.jpg`, width: 1200, height: 630 }] },
  };
}

// Leistungsumfang je Entfernung – bewusst ehrlich formuliert
const UMFANG = {
  1: {
    titel: "So arbeiten wir in",
    punkte: [
      { icon: CalendarCheck2, title: "Beratung vor Ort", text: "Wir sehen uns Dach, Zählerschrank und Verschattung bei Ihnen an – oder starten per Video, wenn Sie das bevorzugen." },
      { icon: Wrench, title: "Montage von Türkheim aus", text: "Planung, Montage, Netzanmeldung und Inbetriebnahme aus einer Hand." },
      { icon: Route, title: "Kurze Wege im Service", text: "Wartung und Störungsbehebung aus dem regionalen Einzugsgebiet – Sie haben einen festen Ansprechpartner." },
    ],
  },
  2: {
    titel: "So arbeiten wir in",
    punkte: [
      { icon: Smartphone, title: "Start per Video oder Fotos", text: "Erstberatung per Video; Zähler, Rechnung und Dach schicken Sie bequem per Smartphone. Den Vor-Ort-Termin legen wir gemeinsam fest." },
      { icon: Wrench, title: "Planung und Montage", text: "Für Einfamilienhäuser, Gewerbe und Landwirtschaft – mit Vor-Ort-Termin zur Aufnahme von Dach und Zählerschrank vor der Montage." },
      { icon: Route, title: "Service geregelt", text: "Fernüberwachung der Anlage und abgestimmte Servicetermine; was vor Ort nötig ist, planen wir vorab." },
    ],
  },
  3: {
    titel: "Unser Angebot für",
    punkte: [
      { icon: Sun, title: "Schwerpunkt Gewerbe & größere Anlagen", text: "In dieser Entfernung planen und bauen wir vor allem Anlagen für Unternehmen, Landwirtschaft und Mehrfamilienhäuser. Private Anfragen prüfen wir gern im Einzelfall." },
      { icon: Smartphone, title: "Digitale Vorplanung", text: "Lastgang, Dachpläne und Fotos genügen für eine belastbare Vorplanung – ohne dass jemand anreisen muss." },
      { icon: Route, title: "Monitoring aus der Ferne", text: "Anlagen werden laufend überwacht; Vor-Ort-Einsätze werden gebündelt und frühzeitig geplant." },
    ],
  },
};

export default async function RegionSeite({ params }) {
  const { stadt } = await params;
  const r = regionFuer(stadt);
  if (!r) notFound();

  const referenzen = naechsteReferenzen(r, await ladeProjekte());
  const umgebung = nachbarn(r);
  const { quelle, abgerufen } = pvgisQuelle();
  const url = `${BASE}/photovoltaik/${r.slug}`;
  const umfang = UMFANG[r.zone];

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
                name: `Photovoltaik in ${r.name}`,
                serviceType: "Planung und Montage von Photovoltaikanlagen",
                provider: { "@id": `${BASE}/#organization` },
                areaServed: { "@type": "City", name: r.name, containedInPlace: { "@type": "State", name: r.bundesland } },
                url,
                description: r.beschreibung,
              },
              { "@type": "FAQPage", mainEntity: r.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Startseite", item: BASE },
                  { "@type": "ListItem", position: 2, name: "Einzugsgebiet", item: `${BASE}/photovoltaik` },
                  { "@type": "ListItem", position: 3, name: r.name, item: url },
                ],
              },
            ],
          }),
        }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Einzugsgebiet", href: "/photovoltaik" }, { name: r.name }]}
        eyebrow={`Photovoltaik in ${r.kurzname || r.name}`}
        title={
          <>
            {r.titel.replace(/ –$/, "\u00a0–")} <span className="ov-text-gradient-light">{r.akzent}</span>
          </>
        }
        lead={r.lead}
        image={{ src: r.bild?.src || "/Images/Dienstleistungen/Photovoltaik/download-2.jpg", alt: r.bild?.alt || "Photovoltaikanlagen auf Hausdächern", position: r.bild?.position }}
        actions={[
          { label: r.zone === 3 ? "Projekt besprechen" : "Beratung vereinbaren", href: r.zone === 1 ? "/termin?art=vor-ort" : "/termin?art=video" },
          { label: "Ertrag berechnen", href: "/solarrechner", icon: Sun },
        ]}
        points={[`${r.km} km Luftlinie ab Türkheim`, ZONEN[r.zone].label, r.fakten.netzbetreiber?.name ? `Netz: ${r.fakten.netzbetreiber.name}` : r.bundesland].filter(Boolean)}
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow={`Photovoltaik in ${r.name}`} title={r.einleitungTitel} />
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

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Sonne in Zahlen" title={`So viel Solarstrom bringt ein Dach in ${r.name}`} className="mb-10" />
        <RegionErtrag name={r.name} ort={r.pvgis} referenz={pvgisReferenz()} quelle={quelle} abgerufen={abgerufen} />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vor Ort"
          title={`Netz, Förderung und Anlaufstellen in ${r.name}`}
          lead={`Recherchiert zum Stand ${r.fakten.stand ? new Date(r.fakten.stand).toLocaleDateString("de-DE") : "September 2026"} – jede Angabe mit Quelle. Förderprogramme ändern sich häufig; wir prüfen den aktuellen Stand im Angebot erneut.`}
          className="mb-10"
        />
        <RegionFakten region={r} />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow={ZONEN[r.zone].label} title={`${umfang.titel} ${r.name}`} className="mb-10" />
        <FeatureGrid cols={3} items={umfang.punkte} />
      </Section>

      {referenzen.length > 0 && (
        <Section tone="white" space="lg">
          <SectionHeading
            eyebrow="Referenzen"
            title={referenzen[0].abstand <= 30 ? `Unsere Projekte in der Nähe von ${r.name}` : `Unsere nächstgelegenen Projekte`}
            lead={referenzen[0].abstand <= 30 ? "Echte Anlagen aus unserem Portfolio – mit Entfernung zur Stadtmitte." : `Direkt in ${r.name} zeigen wir noch kein Projekt. Das sind die nächstgelegenen Anlagen aus unserem Portfolio.`}
            className="mb-10"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {referenzen.map((p) => (
              <div key={p.slug}>
                <ProjektKarte projekt={p} />
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-600">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                  rund {p.abstand} km von {r.name}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={`Photovoltaik in ${r.name}: gut zu wissen`} />
          <Faq items={r.faq} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Einzugsgebiet" title="Weitere Städte in der Umgebung" className="mb-8" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {umgebung.map((n) => (
            <li key={n.slug}>
              <Link href={`/photovoltaik/${n.slug}`} className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 hover:ring-ov-400">
                <span>
                  <span className="block font-semibold text-ink-900">Photovoltaik {n.name}</span>
                  <span className="text-[13px] text-ink-600">{n.abstand} km entfernt</span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/photovoltaik" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
          <Compass aria-hidden="true" className="h-4 w-4" />
          Alle Städte im Einzugsgebiet
        </Link>
      </Section>

      <CtaBand title={r.cta.titel} text={r.cta.text} primary={{ label: r.zone === 3 ? "Projekt anfragen" : "Angebot anfragen", href: r.zone === 3 ? "/gewerbe" : "/angebot" }} secondary={{ label: "Termin buchen", href: "/termin?art=video", icon: CalendarCheck2 }} />
    </div>
  );
}
