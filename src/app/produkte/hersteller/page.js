// src/app/produkte/hersteller/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import HerstellerBanner from "@/components/Hersteller/banner";
import HerstellerSection from "@/components/Hersteller/second";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller_page.api.get_hersteller_page_with_keywords`;

async function fetchHerstellerData() {
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
  const seoData = await fetchHerstellerData();

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Photovoltaik Hersteller & Partner ",
      description: "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen. Qualitätsprodukte führender Marken.",
      keywords: [
        "Photovoltaik Hersteller",
        "Solar Komponenten",
        "Energietechnik Partner",
        "Qualitätshersteller",
        "Solar Marken",
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/hersteller",
      },
      openGraph: {
        type: "website",
       
        url: "https://www.oekovolt.de/produkte/hersteller",
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaik Hersteller & Partner ",
        description: "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Hersteller" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Photovoltaik Hersteller & Partner ",
        description: "Unsere Partner und Hersteller für Photovoltaik-Komponenten.",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
      "Photovoltaik Hersteller",
      "Solar Komponenten",
      "Energietechnik Partner",
      "Qualitätshersteller",
      "Solar Marken",
    ];

  const title = "Photovoltaik Hersteller & Partner ";
  const description = seoData?.hersteller_description || "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen. Qualitätsprodukte führender Marken wie SMA, Fronius, SolarEdge und mehr.";
  const canonical = "https://www.oekovolt.de/produkte/hersteller";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik Hersteller" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

const HERSTELLER_PAGE_URL = "https://www.oekovolt.de/produkte/hersteller";

export default async function HerstellerPage() {
  const data = await fetchHerstellerData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${HERSTELLER_PAGE_URL}/#webpage`,
    url: HERSTELLER_PAGE_URL,
    name: data?.title || "Photovoltaik Hersteller & Partner ",
    description: data?.description || "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen.",
    
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte" },
        { "@type": "ListItem", position: 3, name: "Hersteller", item: HERSTELLER_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <HerstellerBanner data={data} />
      <HerstellerSection data={data} />
      <EndSection />
    </div>
  );
}