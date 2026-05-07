import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import SmartmeterBanner from "@/components/Smartmeter/banner";
import SmartMeterCardSection from "@/components/Smartmeter/second";
import Smartmeter from "@/components/Smartmeter/third";
import Smartmetersectionfour from "@/components/Smartmeter/fourth";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import SmartMeterCostSection from "@/components/Smartmeter/fifth";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.smart_meter_page.api.get_smart_meter_page_with_keywords`;

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
      title: "Smart Meter & Zähler | Ökovolt Solartechnik",
      description:
        "Moderne Smart Meter für intelligentes Energiemanagement. Optimieren Sie Ihren Energieverbrauch mit digitalen Zählern und Echtzeit-Monitoring.",
      keywords: [
        "Smart Meter",
        "Digitaler Zähler",
        "Energiemanagement",
        "Stromzähler",
        "Intelligente Messsysteme",
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/smartmeter",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/smartmeter",
        title: "Smart Meter & Zähler | Ökovolt Solartechnik",
        description: "Moderne Smart Meter für intelligentes Energiemanagement.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Smart Meter",
        "Digitaler Zähler",
        "Energiemanagement",
        "Stromzähler",
        "Intelligente Messsysteme",
      ];

  return {
    title: seoData?.title || "Smart Meter & Zähler | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Moderne Smart Meter für intelligentes Energiemanagement. Optimieren Sie Ihren Energieverbrauch mit digitalen Zählern und Echtzeit-Monitoring.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/produkte/smartmeter",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/produkte/smartmeter",
      title: seoData?.title || "Smart Meter & Zähler | Ökovolt Solartechnik",
      description:
        seoData?.description ||
        "Moderne Smart Meter für intelligentes Energiemanagement. Optimieren Sie Ihren Energieverbrauch mit digitalen Zählern und Echtzeit-Monitoring.",
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

export default async function SmartmeterPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch smartmeter data", error);
  }

  return (
    <div>
      <SmartmeterBanner data={data} />
      <SmartMeterCardSection data={data} />
      <Smartmeter data={data} />
      <Smartmetersectionfour data={data} />
      <SmartMeterCostSection data={data} />
      <EndSection />
    </div>
  );
}
