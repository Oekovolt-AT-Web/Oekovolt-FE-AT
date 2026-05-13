import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import SolvixBanner from "@/components/photovoltaikanlage/bannertwo";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import PhotovoltaikIntroSection from "@/components/photovoltaikanlage/firstcard";
import PhotovoltaikStepsSection from "@/components/photovoltaikanlage/steps";
import PhotovoltaikRegionalNetzSection from "@/components/photovoltaikanlage/fourthcard";
import PhotovoltaikOverviewSection from "@/components/photovoltaikanlage/fifthcard";
import PhotovoltaikSixthCardSection from "@/components/photovoltaikanlage/sixthcard";
import PhotovoltaikComponentSection from "@/components/photovoltaikanlage/seventhcard";
import FaqSection from "@/components/photovoltaikanlage/eightcard";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.photovoltaikanlage_page.api.get_photovoltaik_page_with_keywords`;

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Photovoltaikanlagen ",
      description:
        "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe. Senken Sie Ihre Energiekosten und werden Sie unabhängig mit maßgeschneiderten Solar-Lösungen.",
      keywords: [
        "Photovoltaikanlage",
        "Solaranlage",
        "Photovoltaik",
        "Solarenergie",
        "PV-Anlage",
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/photovoltaikanlage",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/photovoltaikanlage",
        title: "Photovoltaikanlagen ",
        description:
          "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Photovoltaikanlage",
        "Solaranlage",
        "Photovoltaik",
        "Solarenergie",
        "PV-Anlage",
      ];

  return {
    title: seoData?.title || "Photovoltaikanlagen ",
    description:
      seoData?.description ||
      "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe. Senken Sie Ihre Energiekosten und werden Sie unabhängig mit maßgeschneiderten Solar-Lösungen.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/produkte/photovoltaikanlage",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/produkte/photovoltaikanlage",
      title: seoData?.title || "Photovoltaikanlagen ",
      description:
        seoData?.description ||
        "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe. Senken Sie Ihre Energiekosten und werden Sie unabhängig mit maßgeschneiderten Solar-Lösungen.",
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

export default async function PhotovoltaikanlagePage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch photovoltaik data", error);
  }

  return (
    <div>
      <SolvixBanner data={data} />
      <FeaturedLogos data={data} />
      <PhotovoltaikIntroSection data={data} />
      <PhotovoltaikStepsSection data={data} />
      <PhotovoltaikRegionalNetzSection data={data} />
      <PhotovoltaikOverviewSection data={data} />
      <PhotovoltaikSixthCardSection data={data} />
      <PhotovoltaikComponentSection data={data} />
      <FaqSection data={data} />
    </div>
  );
}
