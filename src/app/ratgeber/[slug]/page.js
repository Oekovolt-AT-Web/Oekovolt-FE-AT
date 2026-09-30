// src/app/ratgeber/[slug]/page.js
//
// Rendert alle inhaltsgetriebenen Ratgeber-Artikel aus src/content/ratgeber
// (österreichische Inhalte, inLanguage de-AT, Canonical auf oekovolt.com).
// Die drei handgebauten Artikel haben eigene Ordner und haben Vorrang.

import { notFound } from "next/navigation";
import Link from "next/link";
import { BookOpen, ShieldCheck } from "lucide-react";

import ArtikelLayout from "@/components/Ratgeber/ArtikelLayout";
import ArtikelInhalt from "@/components/Ratgeber/ArtikelInhalt";
import { klartext } from "@/components/Ratgeber/InlineText";
import { INHALTS_ARTIKEL, artikelPfad } from "@/lib/ratgeber";
import { BASE_URL, SITE_NAME, LOCALE } from "@/lib/site";
import { fachprueferFuerArtikel, fachprueferPfad, fachprueferSchema } from "@/data/fachpruefer";

export const dynamicParams = false;

export function generateStaticParams() {
  return INHALTS_ARTIKEL.map((a) => ({ slug: a.slug }));
}

const finde = (slug) => INHALTS_ARTIKEL.find((a) => a.slug === slug);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = finde(slug);
  if (!a) return {};
  const url = `${BASE_URL}${artikelPfad(a.slug)}`;
  return {
    title: a.seoTitle || `${a.title} | Ökovolt`,
    description: a.description,
    keywords: a.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      locale: LOCALE,
      title: a.title,
      description: a.description,
      publishedTime: a.veroeffentlicht,
      modifiedTime: a.aktualisiert,
      section: a.kategorie,
      images: [{ url: `${BASE_URL}/og/ratgeber/${a.slug}.jpg`, width: 1200, height: 630, alt: a.bildAlt }],
    },
    twitter: { card: "summary_large_image", title: a.title, description: a.description, images: [`${BASE_URL}/og/ratgeber/${a.slug}.jpg`] },
    // Autorenzeile bei Link-Vorschauen in Mastodon, Verknüpfung zum Fediverse-Beitrag
    other: { "fediverse:creator": "@ratgeber@oekovolt.com" },
  };
}

export default async function RatgeberArtikelPage({ params }) {
  const { slug } = await params;
  const a = finde(slug);
  if (!a) notFound();

  const url = `${BASE_URL}${artikelPfad(a.slug)}`;
  // Fachprüfer nur mit schriftlicher Einwilligung (src/data/fachpruefer.js) – sonst weder Zeile noch Schema
  const pruefer = fachprueferFuerArtikel(a);

  const toc = [
    ...(a.kurzFazit?.length ? [{ id: "kurz", label: "Das Wichtigste in Kürze" }] : []),
    ...a.abschnitte.map((s) => ({ id: s.id, label: s.tocLabel || s.titel })),
    ...(a.faq?.length ? [{ id: "faq", label: "Häufige Fragen" }] : []),
  ];

  const graph = [
    {
      "@type": "Article",
      "@id": `${url}/#article`,
      headline: a.title,
      description: a.description,
      inLanguage: "de-AT",
      datePublished: a.veroeffentlicht,
      dateModified: a.aktualisiert,
      author: { "@id": `${BASE_URL}/#organization` },
      publisher: { "@id": `${BASE_URL}/#organization` },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
        ...(pruefer ? { reviewedBy: fachprueferSchema(pruefer), lastReviewed: a.aktualisiert } : {}),
      },
      image: [`${BASE_URL}${a.bild}`, `${BASE_URL}/og/ratgeber/${a.slug}.jpg`],
      articleSection: a.kategorie,
      keywords: (a.keywords || []).join(", "),
      wordCount: a.woerter,
      timeRequired: `PT${a.lesezeit}M`,
      abstract: (a.kurzFazit || []).map(klartext).join(" "),
      ...(a.quellen?.length ? { citation: a.quellen.map((q) => ({ "@type": "CreativeWork", name: q.titel, url: q.url })) } : {}),
    },
  ];

  if (a.howTo?.schritte?.length) {
    graph.push({
      "@type": "HowTo",
      "@id": `${url}/#howto`,
      name: a.howTo.name,
      inLanguage: "de-AT",
      step: a.howTo.schritte.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: klartext(s.text) })),
    });
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />
      <ArtikelLayout
        artikel={a}
        toc={toc}
        badge={
          a.badge && (
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
                <BookOpen aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">{a.badge.wert}</p>
                <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{a.badge.text}</p>
              </div>
            </div>
          )
        }
        seitenCta={a.seitenCta}
        cta={a.cta}
      >
        {pruefer && (
          <p className="mb-8 flex items-start gap-2.5 rounded-2xl bg-sand-50 px-4 py-3 text-[14px] leading-snug text-ink-600 ring-1 ring-ink-200/70">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
            <span>
              Fachlich geprüft von{" "}
              <Link href={fachprueferPfad(pruefer)} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                {pruefer.name}
              </Link>
              , {pruefer.rolle}
            </span>
          </p>
        )}
        <ArtikelInhalt artikel={a} />
      </ArtikelLayout>
    </>
  );
}
