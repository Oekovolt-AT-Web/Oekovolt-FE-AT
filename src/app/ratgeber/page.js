// src/app/ratgeber/page.js

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import Breadcrumbs from "@/components/Ratgeber/Breadcrumbs";
import EndSection from "@/components/Reusable/end";
import { alleArtikel, artikelPfad, datumLang } from "@/lib/ratgeber";

const BASE_URL = "https://www.oekovolt.de";
const PAGE_URL = `${BASE_URL}/ratgeber`;

// Deutschlandspezifischer Content -> kein hreflang, nur Canonical.
export const metadata = {
  title: "Photovoltaik-Ratgeber: Kosten, Förderung & Technik | Ökovolt",
  description:
    "Verständliche Antworten rund um Photovoltaik: Einspeisevergütung, Kosten, Förderung und Stromspeicher – von den Fachleuten aus dem Allgäu.",
  keywords: [
    "Photovoltaik Ratgeber",
    "Solaranlage Ratgeber",
    "Einspeisevergütung",
    "Photovoltaik Kosten",
    "Photovoltaik Förderung",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Deutschland",
    title: "Photovoltaik-Ratgeber | Ökovolt",
    description:
      "Verständliche Antworten rund um Photovoltaik: Einspeisevergütung, Kosten, Förderung und Stromspeicher.",
    images: [
      {
        url: `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp`,
        width: 1200,
        height: 630,
        alt: "Ökovolt Photovoltaik-Ratgeber",
      },
    ],
  },
};

export default function RatgeberPage() {
  const artikel = alleArtikel();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}/#collection`,
        name: "Photovoltaik-Ratgeber",
        description:
          "Verständliche Antworten rund um Photovoltaik: Einspeisevergütung, Kosten, Förderung und Stromspeicher.",
        inLanguage: "de-DE",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Ratgeber", item: PAGE_URL },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}/#list`,
        itemListElement: artikel.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.title,
          url: `${BASE_URL}${artikelPfad(a.slug)}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-gray-200 bg-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-14">
          <Breadcrumbs
            className="mb-6"
            items={[{ name: "Startseite", href: "/" }, { name: "Ratgeber" }]}
          />
          <h2 className="mb-3 inline-block text-[13px] font-semibold uppercase tracking-wide text-[#669933]">
            Wissen
          </h2>
          <h1 className="max-w-[20ch] text-[30px] font-semibold leading-tight text-gray-900 md:text-[44px]">
            Photovoltaik-Ratgeber
          </h1>
          <p className="mt-5 max-w-[65ch] text-[18px] leading-relaxed text-gray-600">
            Was kostet eine Anlage, wie viel bringt die Einspeisung, welche
            Förderung gibt es? Hier beantworten wir die Fragen, die uns in der
            Beratung am häufigsten gestellt werden – ohne Fachchinesisch.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        {artikel.length === 0 ? (
          <p className="text-[16px] text-gray-600">
            Die ersten Beiträge erscheinen in Kürze.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artikel.map((a) => (
              <article
                key={a.slug}
                className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-[#669933] focus-within:ring-offset-2"
              >
                <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#669933]">
                  {a.kategorie}
                </p>
                <h2 className="mb-3 text-[20px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-[#669933]">
                  {/* Stretched Link: deckt die ganze Karte ab, damit pro Karte
                      nur EIN Link auf die Ziel-URL zeigt. */}
                  <Link
                    href={artikelPfad(a.slug)}
                    className="outline-none after:absolute after:inset-0 after:content-['']"
                  >
                    {a.title}
                  </Link>
                </h2>
                <p className="mb-6 flex-1 text-[15px] leading-relaxed text-gray-600">
                  {a.excerpt}
                </p>
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-gray-500">
                  <time dateTime={a.aktualisiert}>{datumLang(a.aktualisiert)}</time>
                  <span className="flex items-center gap-1.5">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    {a.lesezeit} Min.
                  </span>
                </div>
                {/* Rein visuelle Affordance – der Link liegt bereits ueber der
                    gesamten Karte, ein zweiter waere ein doppelter Treffer. */}
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold uppercase tracking-wide text-[#669933]"
                >
                  Weiterlesen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </article>
            ))}
          </div>
        )}
      </div>

      <EndSection />
    </>
  );
}
