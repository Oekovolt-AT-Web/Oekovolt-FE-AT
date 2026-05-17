import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import HerstellerBanner from "@/components/Hersteller/banner";
import HerstellerSection from "@/components/Hersteller/second";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.hersteller_page.api.get_hersteller_page_with_keywords`;

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
      title: "Photovoltaik Hersteller & Partner | Ökovolt Deutschland",
      description:
        "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen. Qualitätsprodukte führender Marken.",
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
        type: "website", locale: "de_DE",
        url: "https://www.oekovolt.de/produkte/hersteller",
        siteName: "Ökovolt Deutschland",
        title: "Photovoltaik Hersteller & Partner | Ökovolt Deutschland",
        description: "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Hersteller" }],
      },
      twitter: { card: "summary_large_image", title: "Photovoltaik Hersteller & Partner | Ökovolt Deutschland", description: "Unsere Partner und Hersteller für Photovoltaik-Komponenten.", images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
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

  const title = seoData?.title || "Photovoltaik Hersteller & Partner | Ökovolt Deutschland";
  const description = seoData?.description || "Unsere Partner und Hersteller hochwertiger Komponenten für Photovoltaik- und Energielösungen. Qualitätsprodukte führender Marken wie SMA, Fronius, SolarEdge und mehr.";
  const canonical = "https://www.oekovolt.de/produkte/hersteller";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: canonical, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Photovoltaik Hersteller" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
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