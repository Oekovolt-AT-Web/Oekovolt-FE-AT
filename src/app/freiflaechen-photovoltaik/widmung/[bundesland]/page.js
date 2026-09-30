// src/app/freiflaechen-photovoltaik/widmung/[bundesland]/page.js
//
// Rechtslage für Freiflächen-Photovoltaik je Bundesland (9 statische Seiten).
// Daten: src/lib/flaeche/laender.js – konsolidiertes Landesrecht im RIS,
// Stand 30.09.2026; Unsicheres steht unter „Noch offen oder unsicher“.
//
// SEO-Plan M26/E9 (30.09.2026): Die Landesseiten bleiben eigenständig, weil sich die Rechtslage je Land
// tatsächlich unterscheidet. Damit sie nicht als Doorway-Varianten gelten, trägt jede Seite nur noch
// landesspezifischen Inhalt (Kriterien-Tabelle mit Norm, Quelle und Stand, offene Punkte, FAQ aus den
// Landesdaten); Ablauf, Länderkacheln und allgemeine Texte stehen nur im Hub
// /freiflaechen-photovoltaik/widmung. Messung 5-Wort-Überschneidung: vorher max. 0,55, Ziel < 0,35.

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import { OffenePunkte } from "@/components/FlaechenCheck/Widmung";
import { BUNDESLAENDER } from "@/data/bundeslaender";
import { BUND_QUELLEN, LAENDER, STAND, landFuerSlug, widmungsPfad } from "@/lib/flaeche/laender";
import { BASE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LAENDER.map((l) => ({ bundesland: l.slug }));
}

const titelFuer = (land) => {
  const name = land.titelName || land.name;
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
  const title = titelFuer(land);
  const description = beschreibungFuer(land);
  const bild = BUNDESLAENDER[land.slug]?.bild;
  const ogBild = bild ? `${BASE_URL}${bild.src}` : `${BASE_URL}/og-image.jpg`;
  return {
    title,
    description,
    keywords: [`Freiflächen Photovoltaik Widmung ${land.name}`, `Solarpark ${land.name}`, `PV Freifläche ${land.name}`, `Photovoltaik Grünland ${land.name}`, "Flächenwidmung Photovoltaik", "Beschleunigungsgebiete Photovoltaik"],
    alternates: { canonical: url },
    openGraph: { type: "article", url, siteName: "Ökovolt Österreich", locale: "de_AT", title, description, images: [{ url: ogBild, width: 1920, height: 1080, alt: bild?.alt || `Freiflächen-Photovoltaik ${land.im}` }] },
    twitter: { card: "summary_large_image", title, description, images: [ogBild] },
  };
}

/** Quelle zu einer Norm: erste Landesquelle, deren Bezeichnung den ersten Paragrafen der Norm enthält. */
function quelleFuer(land, norm) {
  const para = /§\s*\d+[a-z]?/.exec(norm || "")?.[0]?.replace(/\s+/, " ");
  const passt = (label) => para && new RegExp(`${para.replace(" ", "\\s*")}(?![0-9a-z])`).test(label);
  return land.quellen.find((q) => passt(q.label)) || land.quellen[0];
}

/** Kriterien-Tabelle: Eckdaten des Landes plus jede Regel mit Norm und Quelle – nur Landesdaten. */
function kriterienFuer(land) {
  const gross = (t) => `${t.charAt(0).toUpperCase()}${t.slice(1)}`;
  return [
    { kriterium: "Rechtsgrundlage", regel: land.gesetz, norm: null, quelle: land.quellen[0] },
    { kriterium: "Ab welcher Größe", regel: gross(land.schwelle), norm: null, quelle: land.quellen[0] },
    { kriterium: "Instrument", regel: gross(land.instrument), norm: null, quelle: land.quellen[0] },
    { kriterium: "Zonen und Kulissen", regel: gross(land.zonen), norm: null, quelle: land.quellen[0] },
    ...land.regeln.map((r) => ({ kriterium: r.titel, regel: r.text, norm: r.norm, quelle: quelleFuer(land, r.norm) })),
    { kriterium: "Beschleunigungsgebiete (EABG)", regel: land.beschleunigung, norm: "EABG, BGBl. I Nr. 47/2026", quelle: BUND_QUELLEN[0] },
  ];
}

/** FAQ ausschließlich aus den Landesdaten. */
function faqFuer(land) {
  const f = [
    {
      q: `Brauche ich ${land.im} für einen Solarpark eine Umwidmung?`,
      a: `${land.kurz} Maßgeblich ist ${land.gesetz}.`,
    },
    {
      q: `Ab welcher Größe gilt ${land.im} eine eigene Regel für Freiflächen-PV?`,
      a: `${land.schwelle.charAt(0).toUpperCase()}${land.schwelle.slice(1)}. Instrument: ${land.instrument}.`,
    },
    {
      q: `Gibt es ${land.im} Zonen für Freiflächen-Photovoltaik?`,
      a: `${land.zonen.charAt(0).toUpperCase()}${land.zonen.slice(1)}. ${land.beschleunigung}`,
    },
  ];
  if (land.offen?.length) {
    f.push({ q: `Was ist ${land.im} noch offen?`, a: `Stand ${STAND.label}: ${land.offen.join(" ")}` });
  }
  return f;
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
  const kriterien = kriterienFuer(land);
  const andere = LAENDER.filter((l) => l.slug !== land.slug);

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
        points={[`Schwelle: ${land.schwelle.split(" (")[0]}`, `${land.regeln.length} Regeln mit Norm`, `Stand ${STAND.label}`]}
        actions={[
          { label: "Fläche prüfen", href: `/flaechen-check?land=${land.slug}`, icon: SearchCheck },
          { label: "Pacht-Rechner", href: "/rechner/freiflaeche-pacht", icon: Calculator },
        ]}
      />

      <Section tone="sand" space="lg" id="kriterien">
        <SectionHeading eyebrow="Kriterien" title={`Was ${land.im} für Solarparks gilt`} lead={land.kurz} />
        <StandPille className="mt-6">Geprüft im RIS am {STAND.label}</StandPille>
        <Reveal className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[14.5px] md:min-w-[720px]">
              <caption className="px-5 pt-5 text-left font-display text-[17px] font-bold text-ink-900">
                Kriterien für Freiflächen-Photovoltaik {land.im}, Stand {STAND.label}
              </caption>
              <thead>
                <tr className="border-b border-ink-200 text-[12px] uppercase tracking-wider text-ink-500 max-md:hidden">
                  <th scope="col" className="w-[20%] px-5 py-3 font-semibold">Kriterium</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Regel</th>
                  <th scope="col" className="w-[26%] px-5 py-3 font-semibold">Norm und Quelle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 max-md:block">
                {kriterien.map((k) => (
                  <tr key={k.kriterium} className="align-top max-md:block max-md:py-3">
                    <th scope="row" className="px-5 py-4 font-semibold text-ink-900 max-md:block max-md:py-1">{k.kriterium}</th>
                    <td className="px-5 py-4 leading-relaxed text-ink-700 max-md:block max-md:py-1">{k.regel}</td>
                    <td className="px-5 py-4 text-[13.5px] leading-relaxed text-ink-600 max-md:block max-md:py-1">
                      {k.norm && <span className="block font-semibold text-ink-800">{k.norm}</span>}
                      {k.quelle && (
                        <a href={k.quelle.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                          {k.quelle.label.replace(/^RIS – /, "RIS: ")}
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <OffenePunkte punkte={land.offen} />
          <Hinweis titel="Keine Rechtsberatung" className="self-start">
            Vereinfachte Zusammenfassung mit Stand {STAND.label}. Verbindlich sind die Gesetze in der geltenden Fassung und die Auskunft von Gemeinde und Landesregierung.
          </Hinweis>
        </div>
      </Section>

      <Section tone="white" space="md">
        <div className="flex flex-col gap-4 rounded-3xl bg-ov-50 p-6 ring-1 ring-ov-100 md:flex-row md:items-center md:justify-between md:p-8">
          <p className="max-w-2xl text-[15.5px] leading-relaxed text-ink-700">
            <strong className="text-ink-900">Eigene Fläche {land.im}?</strong> Der Flächen-Check bewertet sie mit der Regel {land.im}; wie es von der Fläche zur Widmung geht, zeigt der{" "}
            <Link href="/freiflaechen-photovoltaik/widmung#ablauf" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
              Ablauf in der Übersicht
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
        <nav aria-label="Widmung in anderen Bundesländern" className="mt-10">
          <h2 className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Andere Bundesländer</h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            <li>
              <Link href="/freiflaechen-photovoltaik/widmung" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-950 px-4 text-[14px] font-semibold text-white">
                Alle neun im Vergleich <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
            {andere.map((l) => (
              <li key={l.slug}>
                <Link href={widmungsPfad(l.slug)} className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 text-[14px] font-semibold text-ink-900 ring-1 ring-ink-200 hover:bg-ov-50 hover:ring-ov-300">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
          hinweis={`Landesrecht im RIS (CC BY 4.0), Fassung vom ${STAND.label}.`}
        />
      </Section>

      <CtaBand
        eyebrow={`Solarpark ${land.name}`}
        title={`Ihre Fläche ${land.im} – geprüft, bevor Sie unterschreiben.`}
        text={`Wir klären Widmung nach ${land.gesetz}, Netzanschluss und Wirtschaftlichkeit.`}
        primary={{ label: "Fläche prüfen lassen", href: "/kontakt" }}
        secondary={{ label: "Freiflächenanlagen", href: "/freiflaechen-photovoltaik" }}
      />
      {bild && <Bildnachweis items={[{ motiv: bild.motiv, urheber: bild.urheber, lizenz: bild.lizenz, href: bild.href }]} />}
    </div>
  );
}
