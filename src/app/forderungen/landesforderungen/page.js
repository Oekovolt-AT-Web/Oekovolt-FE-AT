// src/app/forderungen/landesforderungen/page.js

import LandesBannerSection from "@/components/Forderungen/Landes/banner";
import ForderungenSection from "@/components/Forderungen/Landes/second";
import EndSection from "@/components/Reusable/end";
import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.forderungen_pages.doctype.forderungen_page.api.get_forderungen_page`;
const PAGE_URL = "https://www.oekovolt.de/forderungen/landesforderungen";

async function fetchLandesforderungenData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 3600 }
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
  const seoDataRaw = await fetchLandesforderungenData();
  const seoData = seoDataRaw?.[0]; // Assuming first item contains general metadata

  const defaultKeywords = [
    "Photovoltaik Förderung",
    "Landesförderprogramme",
    "Solarförderung",
    "Bundesländer Förderung",
    "Energie Förderungen",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Photovoltaik Landesförderungen 2025 | Ökovolt",
      description: "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher. Finden Sie die passende Förderung für Ihr Projekt.",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", 
        locale: "de_DE", 
        url: PAGE_URL, 
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaik Landesförderungen 2025 | Ökovolt",
        description: "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Förderungen" }],
      },
      twitter: { 
        card: "summary_large_image", 
        title: "Photovoltaik Landesförderungen 2025 | Ökovolt", 
        description: "Aktuelle Förderprogramme für Photovoltaik und Speicher.", 
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
      },
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  const title = seoData?.title || "Photovoltaik Landesförderungen 2025 | Ökovolt";
  const description = seoData?.description || "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher. Bis zu 30% Förderung sichern – jetzt Fördercheck machen!";
  const canonical = PAGE_URL;

  return {
    title, 
    description, 
    keywords: apiKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", 
      locale: "de_DE", 
      url: canonical, 
      siteName: "Ökovolt Deutschland",
      title, 
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik Förderungen" }],
    },
    twitter: { 
      card: "summary_large_image", 
      title, 
      description, 
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
    },
  };
}

export default async function Page() {
  const data = await fetchLandesforderungenData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.[0]?.title || "Photovoltaik Landesförderungen 2025 | Ökovolt",
    description: data?.[0]?.description || "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher. Finden Sie die passende Förderung für Ihr Projekt.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Förderungen", item: "https://www.oekovolt.de/forderungen" },
        { "@type": "ListItem", position: 3, name: "Landesförderungen", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <LandesBannerSection data={data} />
      <ForderungenSection />
      <EndSection />
    </div>
  );
}