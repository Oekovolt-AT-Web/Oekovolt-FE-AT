// src/components/ServiceAT/meta.js
//
// Gemeinsame Metadaten- und Schema-Bausteine der österreichischen Service-Seiten.
// Titel und Beschreibung werden je Seite vollständig gesetzt (Template ist "%s").

import { BASE_URL, FIRMA, LOCALE, SITE_NAME } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const OG_BILD = { url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 };

/**
 * Metadaten nach Briefing: Titel ≤ ~60 Zeichen mit „| Ökovolt“, Beschreibung
 * 140–160 Zeichen, Canonical, openGraph de_AT. hreflang nur, wenn der Pfad auf
 * .de und .com existiert (siehe src/lib/hreflang.js).
 */
export function serviceMetadata({ pfad, titel, beschreibung, keywords }) {
  const url = `${BASE_URL}${pfad}`;
  return {
    title: titel,
    description: beschreibung,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url, languages: hreflangLanguages(pfad) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: LOCALE,
      url,
      siteName: SITE_NAME,
      title: titel,
      description: beschreibung,
      images: [{ ...OG_BILD, alt: titel.replace(/\s*\|\s*Ökovolt$/, "") }],
    },
    twitter: { card: "summary_large_image", title: titel, description: beschreibung, images: [OG_BILD.url] },
  };
}

/**
 * Service- und WebPage-Schema als @graph. BreadcrumbList liefert PageHero
 * (Breadcrumbs), FAQPage liefert die Faq-Komponente – beide nicht doppeln.
 */
export function serviceSchema({ pfad, name, beschreibung, serviceType, anbieter, zielgruppe = "Unternehmen, Landwirtschaft, Gemeinden" }) {
  const url = `${BASE_URL}${pfad}`;
  const provider = anbieter
    ? { "@type": "Organization", name: anbieter.name, url: anbieter.web }
    : { "@id": `${BASE_URL}/#organization` };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description: beschreibung,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${url}#service` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType: serviceType || name,
        description: beschreibung,
        url,
        provider,
        ...(anbieter ? { broker: { "@id": `${BASE_URL}/#organization` } } : {}),
        areaServed: { "@type": "Country", name: "Österreich" },
        audience: { "@type": "BusinessAudience", audienceType: zielgruppe },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: url,
          servicePhone: FIRMA.telefon,
          availableLanguage: "de",
        },
      },
    ],
  };
}

/** JSON-LD als <script> – Server-Komponente. */
export function JsonLd({ daten }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }} />;
}
