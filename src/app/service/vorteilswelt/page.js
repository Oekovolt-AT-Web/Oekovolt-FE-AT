// service/vorteilswelt/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import VorteilsweltBanner from "@/components/Vorteilswelt/banner";
import RecommendationSection2 from "@/components/Vorteilswelt/second";
import ReferralStepsSection from "@/components/Vorteilswelt/third";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.oekovolt_vorteilswelt_service_page.api.get_vorteilswelt_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/service/vorteilswelt";

async function fetchVorteilsweltData() {
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
  const seoData = await fetchVorteilsweltData();

  const defaultKeywords = [
    "Ökovolt Vorteilswelt",
    "Kundenvorteile",
    "Energie-Services",
    "Exklusive Angebote",
    "Solar-Vorteile",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Vorteilswelt: 250 € Prämie für Ihre Empfehlung | Ökovolt",
      description: "Ökovolt weiterempfehlen und profitieren: 250 € Prämie für Sie und 250 € für die empfohlene Person – in 4 einfachen Schritten. Jetzt registrieren!",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL, },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        locale: "de_DE",
        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Vorteilswelt: 250 € Prämie für Ihre Empfehlung | Ökovolt",
        description: "Ökovolt weiterempfehlen und profitieren: 250 € Prämie für Sie und 250 € für die empfohlene Person – in 4 einfachen Schritten. Jetzt registrieren!",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Vorteilswelt: 250 € Prämie für Ihre Empfehlung | Ökovolt",
        description: "Ökovolt weiterempfehlen und profitieren: 250 € Prämie für Sie und 250 € für die empfohlene Person – in 4 einfachen Schritten. Jetzt registrieren!",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : defaultKeywords;

  const title = "Vorteilswelt: 250 € Prämie für Ihre Empfehlung | Ökovolt";
  const description = "Ökovolt weiterempfehlen und profitieren: 250 € Prämie für Sie und 250 € für die empfohlene Person – in 4 einfachen Schritten. Jetzt registrieren!";
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

export default async function VorteilsweltPage() {
  const data = await fetchVorteilsweltData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Vorteilswelt",
    description: data?.description || "Exklusive Vorteile und Services für unsere Kunden. Profitieren Sie von besonderen Konditionen und Services in unserer Ökovolt Vorteilswelt.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Service", item: "https://www.oekovolt.de/service" },
        { "@type": "ListItem", position: 3, name: "Vorteilswelt", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <VorteilsweltBanner data={data} />
      <RecommendationSection2 data={data} />
      <ReferralStepsSection data={data} />
      <EndSection />
    </div>
  );
}