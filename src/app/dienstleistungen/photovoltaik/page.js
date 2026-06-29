// dienstleistungen/photovoltaik/page.js
import React from "react";
import Tabs from "@/components/Photovoltaik/Tabs";
import AnlageSection from "@/components/Photovoltaik/Anlage";
import KomponentenSlider from "@/components/Photovoltaik/Slider";
import ProcessSteps from "@/components/Photovoltaik/Cards";
import PhotovoltaikanlageBannerSection from "@/components/Photovoltaik/banner";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.photovoltaikanlagen_primary_page.api.get_photovoltaikanlagen`;

async function fetchPhotovoltaikData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = await fetchPhotovoltaikData();

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Photovoltaik Dienstleistungen | Ökovolt Deutschland",
      description:
        "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft. Senken Sie Ihre Energiekosten mit nachhaltiger Solarenergie.",
      keywords: ["Photovoltaikanlage", "Solarenergie", "Energiekosten senken", "Photovoltaik Förderung", "Solaranlage"],
      alternates: { canonical: "https://www.oekovolt.de/dienstleistungen/photovoltaik",},
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        locale: "de_DE",
        url: "https://www.oekovolt.de/dienstleistungen/photovoltaik",
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaik Dienstleistungen | Ökovolt Deutschland",
        description: "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft.",
        images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Photovoltaik Dienstleistungen | Ökovolt Deutschland",
        description: "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft.",
        images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
      "Photovoltaikanlage",
      "Solarenergie",
      "Energiekosten senken",
      "Photovoltaik Förderung",
      "Solaranlage",
    ];

  const title = "Photovoltaik Dienstleistungen | Ökovolt Deutschland";
  const description = seoData?.description || "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft. Senken Sie Ihre Energiekosten mit nachhaltiger Solarenergie.";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: "https://www.oekovolt.de/dienstleistungen/photovoltaik",},
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: "https://www.oekovolt.de/dienstleistungen/photovoltaik",
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
    },
  };
}

const PV_PAGE_URL = "https://www.oekovolt.de/dienstleistungen/photovoltaik";

export default async function PhotovoltaikPage() {
  let data = await fetchPhotovoltaikData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PV_PAGE_URL}/#webpage`,
    url: PV_PAGE_URL,
    name: data?.title || "Photovoltaik Dienstleistungen | Ökovolt Deutschland",
    description: data?.description || "Maßgeschneiderte Photovoltaik-Lösungen für Privathaushalte, Gewerbe und Landwirtschaft.",
    
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Dienstleistungen", item: "https://www.oekovolt.de/dienstleistungen/photovoltaik" },
        { "@type": "ListItem", position: 3, name: "Photovoltaik", item: PV_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <PhotovoltaikanlageBannerSection data={data} />
      <Tabs data={data} />
      <AnlageSection data={data} />
      <KomponentenSlider data={data} />
      <ProcessSteps data={data} />
      <EndSection />
    </div>
  );
}