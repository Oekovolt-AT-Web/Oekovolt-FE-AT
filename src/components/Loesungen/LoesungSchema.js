import { BASE_URL, LANG } from "@/lib/site";

/**
 * Strukturierte Daten für eine Lösungsseite: Service + WebPage.
 * FAQPage liefert die Faq-Komponente, BreadcrumbList der PageHero (Breadcrumbs) –
 * hier bewusst NICHT doppelt ausgeben.
 *
 * props: pfad ("/gewerbe"), name, beschreibung, zielgruppe, leistungen [String]
 */
export default function LoesungSchema({ pfad, name, titel, beschreibung, zielgruppe, leistungen = [], bild }) {
  const url = `${BASE_URL}${pfad}`;
  const daten = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType: name,
        description: beschreibung,
        url,
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        audience: { "@type": "BusinessAudience", audienceType: zielgruppe },
        ...(leistungen.length
          ? {
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name,
                itemListElement: leistungen.map((l) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: l } })),
              },
            }
          : {}),
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: titel || name,
        description: beschreibung,
        inLanguage: LANG,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${url}#service` },
        ...(bild ? { primaryImageOfPage: { "@type": "ImageObject", url: `${BASE_URL}${bild}` } } : {}),
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(daten) }} />;
}
