import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import HerstellerBanner from "@/components/Hersteller/banner";
import HerstellerSection from "@/components/Hersteller/second";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.products.api.get_hersteller_page_with_keywords`;

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    seoData = json.message;
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Hersteller & Partner | Ökovolt Solartechnik",
      description:
        "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen. Qualitätsprodukte führender Marken.",
      keywords: [
        "Photovoltaik Hersteller",
        "Solar Komponenten",
        "Energietechnik Partner",
        "Qualitätshersteller",
        "Solar Marken",
      ],
      openGraph: {
        title: "Hersteller & Partner | Ökovolt Solartechnik",
        description:
          "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen.",
        images: [{ url: "/images/hersteller-og.jpg" }],
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

  return {
    title: seoData?.title || "Hersteller & Partner | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen. Qualitätsprodukte führender Marken.",
    keywords: apiKeywords,
   
  };
}

export default async function HerstellerPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch hersteller data", error);
  }

  return (
    <div>
      <HerstellerBanner data={data} />
      <HerstellerSection data={data} />
      <EndSection />
    </div>
  );
}
