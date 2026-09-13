import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileDown, MapPin } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Teilen from "@/components/ui/Teilen";
import KiZusammenfassen from "@/components/Ratgeber/KiZusammenfassen";
import FolgenBox from "@/components/Kanaele/FolgenBox";
import MeldungKarte, { datumDe } from "@/components/Kanaele/MeldungKarte";
import { noteId } from "@/lib/kanaele/activitypub";
import { BASE_URL, veroeffentlichung, veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await veroeffentlichungen({ kanal: "website", limit: 30 })).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const m = await veroeffentlichung(slug);
  if (!m || !m.kanaele.website) return { title: "Meldung nicht gefunden | Ökovolt", robots: { index: false } };
  const titel = `${m.titel} | Ökovolt`;
  return {
    title: titel,
    description: m.teaser.slice(0, 160),
    alternates: {
      canonical: m.url,
      ...(m.kanaele.fediverse ? { types: { "application/activity+json": noteId("oekovolt", m.slug) } } : {}),
    },
    openGraph: {
      type: "article",
      locale: "de_DE",
      url: m.url,
      siteName: "Ökovolt Deutschland",
      title: m.titel,
      description: m.teaser,
      publishedTime: m.datum,
      modifiedTime: m.aktualisiert,
      section: m.kategorie,
      tags: m.hashtags,
      images: m.bildAbsolut ? [{ url: m.bildAbsolut, alt: m.bildAlt }] : [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: m.titel, description: m.teaser },
    other: { "fediverse:creator": "@oekovolt@oekovolt.de" },
  };
}

export default async function MeldungPage({ params }) {
  const { slug } = await params;
  const m = await veroeffentlichung(slug);
  if (!m || !m.kanaele.website) notFound();

  const weitere = (await veroeffentlichungen({ kanal: "website", limit: 12 })).filter((x) => x.slug !== m.slug).slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": m.kategorie === "Pressemitteilung" ? "NewsArticle" : "Article",
    "@id": `${m.url}#artikel`,
    mainEntityOfPage: m.url,
    headline: m.titel,
    description: m.teaser,
    datePublished: m.datum,
    dateModified: m.aktualisiert,
    inLanguage: "de-DE",
    articleSection: m.kategorie,
    keywords: m.hashtags.join(", "),
    ...(m.bildAbsolut ? { image: [m.bildAbsolut] } : {}),
    author: { "@id": `${BASE_URL}/#organization` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    locationCreated: { "@type": "Place", name: m.ort },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 pb-16 pt-8 text-white md:pb-20 md:pt-12">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-[380px] w-[380px] rounded-full bg-ov-500/20 blur-[120px]" />
        <div className="ov-container">
          <Breadcrumbs dark items={[{ name: "Presse & Neuigkeiten", href: "/presse" }, { name: m.titel }]} className="ov-hero-in mb-10" />
          <div className="max-w-4xl">
            <p className="ov-hero-in flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-white/70" style={{ "--ov-delay": "60ms" }}>
              <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-white">{m.kategorie}</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="h-4 w-4 text-ov-300" />
                <time dateTime={m.datum}>{datumDe(m.datum)}</time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="h-4 w-4 text-ov-300" />
                {m.ort}
              </span>
            </p>
            <h1 className="ov-h1 ov-hero-in mt-6" style={{ "--ov-delay": "120ms" }}>
              {m.titel}
            </h1>
            {m.teaser && (
              <p className="ov-lead ov-hero-in mt-6 max-w-3xl text-white/75" style={{ "--ov-delay": "200ms" }}>
                {m.teaser}
              </p>
            )}
          </div>
        </div>
      </section>

      <Section tone="white" space="none" className="pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <article className="min-w-0 max-w-[52rem]">
            {m.bild && (
              <figure className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-sand-100">
                <Image src={m.bild} alt={m.bildAlt} fill priority sizes="(min-width:1024px) 830px, 100vw" className="object-cover" />
              </figure>
            )}
            <KiZusammenfassen url={m.url} titel={m.titel} art={m.kategorie === "Pressemitteilung" ? "Pressemitteilung" : "Beitrag"} className="mb-10 rounded-2xl bg-sand-50 px-4 py-3.5 ring-1 ring-ink-200/60 md:px-5" />
            <div className="ov-prose" dangerouslySetInnerHTML={{ __html: m.inhalt }} />

            {m.hashtags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2" aria-label="Schlagwörter">
                {m.hashtags.map((h) => (
                  <li key={h}>
                    <Link href={`/presse?tag=${encodeURIComponent(h)}`} className="inline-flex h-8 items-center rounded-full bg-sand-50 px-3 text-[13px] font-semibold text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300">
                      #{h}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {m.anhang && (
              <a href={m.anhang.url} className="mt-8 flex items-center gap-4 rounded-2xl bg-sand-50 p-5 ring-1 ring-ink-200/60 transition hover:bg-white hover:ring-ov-300">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                  <FileDown aria-hidden="true" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[15.5px] font-semibold text-ink-900">{m.anhang.name}</span>
                  <span className="block text-[13.5px] text-ink-600">Download</span>
                </span>
              </a>
            )}

            <div className="mt-12 flex flex-col gap-3 rounded-3xl border border-ink-200 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
              <p className="font-display text-[17px] font-bold text-ink-900">Beitrag teilen</p>
              <Teilen url={m.url} titel={m.titel} text={m.teaser} netze={["linkedin", "xing", "whatsapp", "facebook", "x", "telegram"]} kampagne="presse" kompakt />
            </div>

            <Link href="/presse" className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:underline">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Alle Neuigkeiten
            </Link>
          </article>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <FolgenBox konten={["oekovolt"]} pushThema="news" />
          </div>
        </div>
      </Section>

      {weitere.length > 0 && (
        <Section tone="sand" space="md">
          <SectionHeading eyebrow="Newsroom" title="Weitere Neuigkeiten" className="mb-8" />
          <div className="grid gap-5 md:grid-cols-3">
            {weitere.map((w) => (
              <MeldungKarte key={w.slug} m={w} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
