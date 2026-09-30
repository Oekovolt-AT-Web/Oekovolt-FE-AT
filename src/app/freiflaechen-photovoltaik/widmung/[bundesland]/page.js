// src/app/freiflaechen-photovoltaik/widmung/[bundesland]/page.js
//
// Rechtslage für Freiflächen-Photovoltaik je Bundesland (9 statische Seiten).
// Daten: src/lib/flaeche/laender.js – konsolidiertes Landesrecht im RIS,
// Stand 30.09.2026; Unsicheres steht unter „Noch offen oder unsicher“.

import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator, Map as KarteIcon, Rocket, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import Reveal from "@/components/ui/Reveal";
import { Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import { LaenderKacheln, OffenePunkte, Regeln } from "@/components/FlaechenCheck/Widmung";
import { ABLAUF } from "@/components/FlaechenCheck/ablauf";
import { BUNDESLAENDER } from "@/data/bundeslaender";
import { BUND_QUELLEN, LAENDER, STAND, landFuerSlug, widmungsPfad } from "@/lib/flaeche/laender";
import { BASE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LAENDER.map((l) => ({ bundesland: l.slug }));
}

const titelFuer = (name) => {
  const lang = `Freiflächen-PV Widmung ${name} 2026 | Ökovolt`;
  return lang.length <= 60 ? lang : `PV-Freifläche Widmung ${name} | Ökovolt`;
};

const beschreibungFuer = (land) => {
  const lang = `Solarpark ${land.im}: Widmung, Schwellen, Zonen und Beschleunigungsgebiete – Normen aus dem RIS, Stand ${STAND.label}, offene Punkte markiert.`;
  return lang.length <= 160 ? lang : `Freiflächen-Photovoltaik ${land.im}: Widmung, Zonen und Schwellen laut Landesrecht (RIS), Stand ${STAND.label} – mit offenen Punkten.`;
};

export async function generateMetadata({ params }) {
  const { bundesland } = await params;
  const land = landFuerSlug(bundesland);
  if (!land) notFound();
  const url = `${BASE_URL}${widmungsPfad(land.slug)}`;
  const title = titelFuer(land.name);
  const description = beschreibungFuer(land);
  const bild = BUNDESLAENDER[land.slug]?.bild;
  const ogBild = bild ? `${BASE_URL}${bild.src}` : `${BASE_URL}/og-image.jpg`;
  return {
    title,
    description,
    keywords: [`Freiflächen Photovoltaik Widmung ${land.name}`, `Solarpark ${land.name}`, `PV Freifläche ${land.name}`, `Photovoltaik Grünland ${land.name}`, "Flächenwidmung Photovoltaik", "Beschleunigungsgebiete Photovoltaik"],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { type: "article", url, siteName: "Ökovolt Österreich", locale: "de_AT", title, description, images: [{ url: ogBild, width: 1920, height: 1080, alt: bild?.alt || `Freiflächen-Photovoltaik ${land.im}` }] },
    twitter: { card: "summary_large_image", title, description, images: [ogBild] },
  };
}

function faqFuer(land) {
  return [
    {
      q: `Brauche ich ${land.im} für einen Solarpark eine Umwidmung?`,
      a: `${land.kurz} Maßgeblich ist ${land.gesetz}. Zusätzlich können naturschutz-, elektrizitäts- und baurechtliche Bewilligungen nötig sein.`,
    },
    {
      q: `Gibt es ${land.im} Zonen für Freiflächen-Photovoltaik?`,
      a: `${land.zonen.charAt(0).toUpperCase()}${land.zonen.slice(1)}. ${land.beschleunigung}`,
    },
    {
      q: "Wer entscheidet über die Widmung meiner Fläche?",
      a: "Der Gemeinderat ändert den Flächenwidmungsplan, die Landesregierung genehmigt die Änderung aufsichtsbehördlich; überörtliche Zonen legt das Land per Verordnung fest. Ohne Zustimmung der Gemeinde entsteht in der Praxis kein Solarpark.",
    },
    {
      q: "Ist diese Übersicht verbindlich?",
      a: `Nein. Sie fasst das konsolidierte Landesrecht im RIS mit Stand ${STAND.label} vereinfacht zusammen und ist keine Rechtsberatung. Offene oder unsichere Punkte sind auf der Seite markiert. Vor Projektstart klären Sie die Details mit Gemeinde und Landesregierung.`,
    },
  ];
}

export default async function WidmungLandPage({ params }) {
  const { bundesland } = await params;
  const land = landFuerSlug(bundesland);
  if (!land) notFound();
  const pfad = widmungsPfad(land.slug);
  const url = `${BASE_URL}${pfad}`;
  const bild = BUNDESLAENDER[land.slug]?.bild;
  const faq = faqFuer(land);
  const quellen = [...land.quellen, ...BUND_QUELLEN];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}/#article`,
    mainEntityOfPage: url,
    url,
    headline: `Freiflächen-Photovoltaik ${land.im}: Widmung und Zonen`,
    description: beschreibungFuer(land),
    inLanguage: "de-AT",
    dateModified: STAND.iso,
    datePublished: STAND.iso,
    author: { "@id": `${BASE_URL}/#organization` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    isPartOf: { "@id": `${BASE_URL}/#website` },
    ...(bild ? { image: `${BASE_URL}${bild.src}` } : {}),
    about: [
      { "@type": "Thing", name: "Flächenwidmung für Photovoltaik-Freiflächenanlagen" },
      { "@type": "State", name: land.name, containedInPlace: { "@type": "Country", name: "Österreich" } },
    ],
    citation: quellen.map((q) => ({ "@type": "CreativeWork", name: q.label, url: q.url })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[
          { name: "Freiflächen-Photovoltaik", href: "/freiflaechen-photovoltaik" },
          { name: "Widmung", href: "/freiflaechen-photovoltaik/widmung" },
          { name: land.name },
        ]}
        eyebrow={`Rechtslage ${land.name} · Stand ${STAND.label}`}
        title={
          <>
            Solarpark {land.im}: <span className="ov-text-gradient-light">Widmung & Zonen</span>
          </>
        }
        lead={land.kurz}
        image={bild ? { src: bild.src, alt: bild.alt, position: bild.position } : undefined}
        points={[`Schwelle: ${land.schwelle.split(" (")[0]}`, "Normen aus dem RIS", "Offenes markiert"]}
        actions={[
          { label: "Fläche prüfen", href: `/flaechen-check?land=${land.slug}`, icon: SearchCheck },
          { label: "Pacht-Rechner", href: "/rechner/freiflaeche-pacht", icon: Calculator },
        ]}
      />

      <Section tone="sand" space="lg">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Kurz gesagt" title={`Was ${land.im} gilt`} />
            <StandPille className="mt-6">Geprüft im RIS am {STAND.label}</StandPille>
            <dl className="mt-8 space-y-5">
              {[
                ["Rechtsgrundlage", land.gesetz],
                ["Schwelle", land.schwelle],
                ["Instrument", land.instrument],
                ["Zonen", land.zonen],
              ].map(([k, v]) => (
                <div key={k} className="border-l-2 border-ov-300 pl-4">
                  <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">{k}</dt>
                  <dd className="mt-1 text-[15.5px] leading-relaxed text-ink-800">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Regeln land={land} />
        </div>
      </Section>

      {/* Dunkle Kontrast-Sektion: Beschleunigung und Offenes */}
      <section className="ov-noise relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
        <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
        <div className="ov-container relative grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionHeading
              dark
              eyebrow="EABG & Beschleunigungsgebiete"
              title="Schneller genehmigen – wo das Land Gebiete ausweist."
              lead="Das Erneuerbaren-Ausbau-Beschleunigungsgesetz (BGBl. I Nr. 47/2026) bringt in Beschleunigungsgebieten eine Grobprüfung statt einer vollen Einzelfallprüfung. Die Gebiete legen die Länder fest."
            />
          </Reveal>
          <Reveal delay={120} className="space-y-4">
            <div className="ov-glass rounded-3xl p-6">
              <p className="flex items-center gap-2 font-display text-[18px] font-bold">
                <Rocket aria-hidden="true" className="h-5 w-5 text-ov-300" />
                Stand {land.im}
              </p>
              <p className="mt-2 text-[15.5px] leading-relaxed text-white/75">{land.beschleunigung}</p>
            </div>
            <div className="ov-glass rounded-3xl p-6">
              <p className="flex items-center gap-2 font-display text-[18px] font-bold">
                <KarteIcon aria-hidden="true" className="h-5 w-5 text-sun-300" />
                Zonen und Kulissen
              </p>
              <p className="mt-2 text-[15.5px] leading-relaxed text-white/75">
                {land.zonen.charAt(0).toUpperCase()}
                {land.zonen.slice(1)}.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="white" space="lg">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <OffenePunkte punkte={land.offen} />
          <Hinweis titel="Keine Rechtsberatung" className="self-start">
            Vereinfachte Zusammenfassung des Landesrechts. Naturschutz, Elektrizitätsrecht, Baurecht, Wasserrecht und Ortsbild können zusätzliche Verfahren auslösen. Verbindlich sind die Gesetze in der geltenden Fassung und die Auskunft von Gemeinde und Landesregierung.
          </Hinweis>
        </div>
        <div className="mt-16">
          <SectionHeading eyebrow="Ablauf" title="Von der Fläche zur Widmung" />
          <Steps items={ABLAUF} className="mt-12" />
        </div>
        <div className="mt-14 flex flex-col gap-4 rounded-3xl bg-ov-50 p-6 ring-1 ring-ov-100 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-2xl text-[15.5px] leading-relaxed text-ink-700">
            <strong className="text-ink-900">Eigene Fläche {land.im}?</strong> Der Flächen-Check bewertet Widmung, Größe, Netz und Gelände und zeigt die belegte Pachtspanne; Ertrag und Pacht über die Laufzeit rechnet der{" "}
            <Link href="/rechner/freiflaeche-pacht" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
              Freiflächen- &amp; Pacht-Rechner
            </Link>
            .
          </p>
          <Link
            href={`/flaechen-check?land=${land.slug}`}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800"
          >
            <SearchCheck aria-hidden="true" className="h-4 w-4" />
            Flächen-Check {land.name}
          </Link>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Andere Bundesländer" title="Die Regeln der Nachbarn im Vergleich" lead={<>Alle neun Länder in einer Tabelle finden Sie in der <Link href="/freiflaechen-photovoltaik/widmung" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Übersicht zur Widmung</Link>.</>} />
        <LaenderKacheln aktiv={land.slug} className="mt-10" />
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={`Solarpark ${land.im} – kurz beantwortet`} />
          <Faq items={faq} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={STAND.label}
          quellen={quellen}
          hinweis="Konsolidiertes Landesrecht im RIS (Open Government Data, CC BY 4.0) in der Fassung zum Prüfdatum, ergänzt um Unterlagen der Landesverwaltung. Paragrafenangaben beziehen sich auf die jeweils verlinkte Fassung."
        />
      </Section>

      <Querverweise pfad="/freiflaechen-photovoltaik/widmung" />
      <CtaBand
        eyebrow="Widmung, Netz, Bau"
        title={`Ihre Fläche ${land.im} – geprüft, bevor Sie unterschreiben.`}
        text="Wir prüfen Widmungschancen, Netzanschluss und Wirtschaftlichkeit und begleiten Gemeinde, Bewilligungen und Bau – in ganz Österreich."
        primary={{ label: "Fläche prüfen lassen", href: "/kontakt" }}
        secondary={{ label: "Freiflächenanlagen", href: "/freiflaechen-photovoltaik" }}
      />
      {bild && <Bildnachweis items={[{ motiv: bild.motiv, urheber: bild.urheber, lizenz: bild.lizenz, href: bild.href }]} />}
    </div>
  );
}
