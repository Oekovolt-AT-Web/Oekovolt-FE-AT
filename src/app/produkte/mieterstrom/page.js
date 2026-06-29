// src/app/produkte/mieterstrom/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import MieterstromBanner from "@/components/Mieterstrom/banner";
import MieterstromSection from "@/components/Mieterstrom/second";
import MieterstromBenefits from "@/components/Mieterstrom/third";
import MieterstromThirdSection from "@/components/Mieterstrom/fourth";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.mieterstrom_page.api.get_mieterstrom_page_with_keywords`;

async function fetchMieterstromData() {
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
  const seoData = await fetchMieterstromData();

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Mieterstrom",
    "Quartiersstrom",
    "Solarstrom für Mieter",
    "Energieversorgung Mehrfamilienhaus",
    "Nachhaltige Wohnanlagen",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Mieterstrom & Quartierslösungen | Ökovolt Deutschland",
      description: "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser und Wohnanlagen. Profitieren Sie von günstigem Solarstrom direkt vom Dach.",
      keywords: defaultKeywords,
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/mieterstrom",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/mieterstrom",
        title: "Mieterstrom & Quartierslösungen | Ökovolt Deutschland",
        description: "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser und Wohnanlagen. Profitieren Sie von günstigem Solarstrom direkt vom Dach.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
    };
  }

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  const title = seoData?.title || "Mieterstrom & Quartierslösungen | Ökovolt Deutschland";
  const description = seoData?.description || "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser und Wohnanlagen. Profitieren Sie von günstigem Solarstrom direkt vom Dach.";
  const canonical = "https://www.oekovolt.de/produkte/mieterstrom";

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
      images: [
        {
          url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: "Ökovolt Deutschland",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
    },
  };
}

const MIETERSTROM_PAGE_URL = "https://www.oekovolt.de/produkte/mieterstrom";

export default async function MieterstromPage() {
  const data = await fetchMieterstromData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${MIETERSTROM_PAGE_URL}/#webpage`,
    url: MIETERSTROM_PAGE_URL,
    name: data?.title || "Mieterstrom & Quartierslösungen | Ökovolt Deutschland",
    description: data?.description || "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser und Wohnanlagen. Profitieren Sie von günstigem Solarstrom direkt vom Dach.",
    
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte" },
        { "@type": "ListItem", position: 3, name: "Mieterstrom", item: MIETERSTROM_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <MieterstromBanner data={data} />
      <MieterstromSection data={data} />
      <MieterstromBenefits data={data} />
      <MieterstromThirdSection data={data} />
      <EndSection />
    </div>
  );
}