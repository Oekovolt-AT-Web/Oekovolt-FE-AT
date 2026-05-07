import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import VorteilsweltBanner from "@/components/Vorteilswelt/banner";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import RecommendationSection2 from "@/components/Vorteilswelt/second";
import ReferralStepsSection from "@/components/Vorteilswelt/third";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.oekovolt_vorteilswelt_service_page.api.get_vorteilswelt_page_with_keywords`;

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 3600 } }) ;
    const json = await res.json();
    seoData = json.message;
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Vorteilswelt | Ökovolt Solartechnik",
      alternates: { canonical: "https://www.oekovolt.de/service/vorteilswelt" },
      openGraph: { type: "website", url: "https://www.oekovolt.de/service/vorteilswelt", title: "Vorteilswelt | Ökovolt Solartechnik", description: "Exklusive Vorteile und Services für unsere Ökovolt Kunden.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }] },
      description:
        "Exklusive Vorteile und Services für unsere Kunden. Profitieren Sie von besonderen Konditionen und Services in unserer Ökovolt Vorteilswelt.",
      keywords: [
        "Ökovolt Vorteilswelt",
        "Kundenvorteile",
        "Energie-Services",
        "Exklusive Angebote",
        "Solar-Vorteile",
      ],
     
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Ökovolt Vorteilswelt",
        "Kundenvorteile",
        "Energie-Services",
        "Exklusive Angebote",
        "Solar-Vorteile",
      ];

  return {
    title: seoData?.title || "Vorteilswelt | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Exklusive Vorteile und Services für unsere Kunden. Profitieren Sie von besonderen Konditionen und Services in unserer Ökovolt Vorteilswelt.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/service/vorteilswelt",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/service/vorteilswelt",
      title: seoData?.title || "Vorteilswelt | Ökovolt Solartechnik",
      description:
        seoData?.description ||
        "Exklusive Vorteile und Services für unsere Kunden. Profitieren Sie von besonderen Konditionen und Services in unserer Ökovolt Vorteilswelt.",
      images: [
        {
          url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: "Ökovolt Deutschland",
        },
      ],
    },
  };
}

export default async function VorteilsweltPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch vorteilswelt data", error);
  }

  return (
    <div>
      <VorteilsweltBanner data={data} />
      <RecommendationSection2 data={data} />
      <ReferralStepsSection data={data} />
      <EndSection />
    </div>
  );
}
