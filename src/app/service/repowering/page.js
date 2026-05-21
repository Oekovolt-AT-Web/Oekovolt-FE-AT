// service/repowering/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Repowering/banner";
import EnhancedCardsSection from "@/components/Repowering/second";
import PhotovoltaikOptimization from "@/components/Repowering/third";
import InverterReplacementSection from "@/components/Repowering/fourth";
import SystemExpansionSection from "@/components/Repowering/fifth";
import SixSection from "@/components/Repowering/six";
import RepoweringSection from "@/components/Repowering/seven";
import ThirdCardSection from "@/components/Repowering/eight";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.photovoltaik_repowering_service_page.api.get_photovoltaik_repowering_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/service/repowering";

async function fetchRepoweringData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
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
  const seoData = await fetchRepoweringData();

  const defaultKeywords = [
    "Photovoltaik Repowering",
    "Solaranlage modernisieren",
    "PV-Anlage aufrüsten",
    "Wechselrichter Austausch",
    "Solaranlage optimieren",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Photovoltaik Repowering | Ökovolt Deutschland",
      description: "Modernisierung und Leistungssteigerung Ihrer bestehenden Solaranlage. Erhöhen Sie Effizienz und Ertrag durch professionelles Repowering.",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", 
        locale: "de_DE", 
        url: PAGE_URL, 
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaik Repowering | Ökovolt Deutschland",
        description: "Modernisierung und Leistungssteigerung Ihrer bestehenden Solaranlage.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Repowering" }],
      },
      twitter: { 
        card: "summary_large_image", 
        title: "Photovoltaik Repowering | Ökovolt Deutschland", 
        description: "Modernisierung und Leistungssteigerung Ihrer bestehenden Solaranlage.", 
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : defaultKeywords;

  const title = seoData?.title || "Photovoltaik Repowering | Ökovolt Deutschland";
  const description = seoData?.description || "Modernisierung und Leistungssteigerung Ihrer bestehenden Solaranlage. Erhöhen Sie Effizienz und Ertrag durch professionelles Repowering.";
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
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik Repowering" }],
    },
    twitter: { 
      card: "summary_large_image", 
      title, 
      description, 
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] 
    },
  };
}

export default async function RepoweringPage() {
  const data = await fetchRepoweringData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Photovoltaik Repowering | Ökovolt Deutschland",
    description: data?.description || "Modernisierung und Leistungssteigerung Ihrer bestehenden Solaranlage. Erhöhen Sie Effizienz und Ertrag durch professionelles Repowering.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Service", item: "https://www.oekovolt.de/service" },
        { "@type": "ListItem", position: 3, name: "Repowering", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <BannerSection data={data} />
      <PhotovoltaikOptimization data={data} />
      <EnhancedCardsSection data={data} />
      <InverterReplacementSection data={data} />
      <SystemExpansionSection data={data} />
      <SixSection data={data} />
      <RepoweringSection data={data} />
      <ThirdCardSection data={data} />
      <EndSection />
    </div>
  );
}