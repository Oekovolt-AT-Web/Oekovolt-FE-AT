// Gemeinsame Metadaten- und Schema-Helfer für die Technik-, Reststrom- und
// Tarifseiten. BreadcrumbList erzeugt <Breadcrumbs/> im PageHero, FAQPage die
// <Faq/>-Komponente – beides exakt aus dem sichtbaren Inhalt.

import { BASE_URL, FIRMA, SITE_NAME, LOCALE } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const OG_BILD = `${BASE_URL}/og-image.jpg`;

/**
 * Next-Metadaten nach Briefing: vollständiger Titel (Template ist „%s“),
 * Beschreibung 140–160 Zeichen, Canonical, de_AT, „Ökovolt Österreich“.
 * hreflang nur, wenn der Pfad auf .de und .com existiert (src/lib/hreflang.js);
 * robots bewusst nicht gesetzt, damit die Layout-Werte gelten (SEO-Plan M04).
 */
export function seitenMeta({ pfad, titel, beschreibung, keywords, bild }) {
  const url = `${BASE_URL}${pfad}`;
  const bildUrl = bild ? `${BASE_URL}${bild}` : OG_BILD;
  return {
    title: titel,
    description: beschreibung,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url, languages: hreflangLanguages(pfad) },
    openGraph: {
      type: "website",
      locale: LOCALE,
      url,
      siteName: SITE_NAME,
      title: titel,
      description: beschreibung,
      images: [{ url: bildUrl, width: 1200, height: 630, alt: titel.replace(/\s*\|\s*Ökovolt$/, "") }],
    },
    twitter: { card: "summary_large_image", title: titel, description: beschreibung, images: [bildUrl] },
  };
}

/**
 * JSON-LD-Graph aus WebPage und (optional) Service.
 * service: { name, serviceType, beschreibung, audience }
 */
export function seitenSchema({ pfad, name, beschreibung, service, stand = "2026-09-29" }) {
  const url = `${BASE_URL}${pfad}`;
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name,
      description: beschreibung,
      inLanguage: "de-AT",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: service ? { "@id": `${url}#service` } : { "@id": `${BASE_URL}/#organization` },
      publisher: { "@id": `${BASE_URL}/#organization` },
      dateModified: stand,
    },
  ];
  if (service) {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: service.name,
      serviceType: service.serviceType || service.name,
      description: service.beschreibung || beschreibung,
      url,
      provider: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: FIRMA.name,
        telephone: FIRMA.telefon,
        email: FIRMA.email,
      },
      areaServed: { "@type": "Country", name: "Österreich" },
      ...(service.audience ? { audience: { "@type": "BusinessAudience", audienceType: service.audience } } : {}),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** <script>-Baustein für JSON-LD */
export function JsonLd({ daten }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }} />;
}
