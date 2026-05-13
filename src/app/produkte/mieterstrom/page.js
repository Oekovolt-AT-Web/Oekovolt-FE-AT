import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import MieterstromBanner from "@/components/Mieterstrom/banner";
import MieterstromSection from "@/components/Mieterstrom/second";
import MieterstromBenefits from "@/components/Mieterstrom/third";
import MieterstromThirdSection from "@/components/Mieterstrom/fourth";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.mieterstrom_page.api.get_mieterstrom_page_with_keywords`;

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
      title: "Mieterstrom & Quartierslösungen ",
      description:
        "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser und Wohnanlagen. Profitieren Sie von günstigem Solarstrom direkt vom Dach.",
      keywords: [
        "Mieterstrom",
        "Quartiersstrom",
        "Solarstrom für Mieter",
        "Energieversorgung Mehrfamilienhaus",
        "Nachhaltige Wohnanlagen",
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/mieterstrom",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/mieterstrom",
        title: "Mieterstrom & Quartierslösungen ",
        description: "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Mieterstrom",
    "Quartiersstrom",
    "Solarstrom für Mieter",
    "Energieversorgung Mehrfamilienhaus",
    "Nachhaltige Wohnanlagen",
  ];

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title:
      seoData?.title ||
      "Mieterstrom & Quartierslösungen ",
    description:
      seoData?.description ||
      "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser und Wohnanlagen. Profitieren Sie von günstigem Solarstrom direkt vom Dach.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/produkte/mieterstrom",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/produkte/mieterstrom",
      title: seoData?.title || "Mieterstrom & Quartierslösungen ",
      description:
        seoData?.description ||
        "Innovative Mieterstrom-Modelle für Mehrfamilienhäuser und Wohnanlagen. Profitieren Sie von günstigem Solarstrom direkt vom Dach.",
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

export default async function MieterstromPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch mieterstrom data", error);
  }

  return (
    <div>
      <MieterstromBanner data={data} />
      <MieterstromSection data={data} />
      <MieterstromBenefits data={data} />
      <MieterstromThirdSection data={data} />
      <EndSection />
    </div>
  );
}
