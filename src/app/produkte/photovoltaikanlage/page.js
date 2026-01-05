import PhotovoltaikBanner from "@/components/photovoltaikanlage/banner";
import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import BannerLegal from "@/components/photovoltaikanlage/test";
import SolvixBanner from "@/components/photovoltaikanlage/bannertwo";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import PhotovoltaikIntroSection from "@/components/photovoltaikanlage/firstcard";
import ReviewsPage from "@/components/photovoltaikanlage/reviews";
import PhotovoltaikStepsSection from "@/components/photovoltaikanlage/steps";
import PhotovoltaikRegionalNetzSection from "@/components/photovoltaikanlage/fourthcard";
import PhotovoltaikOverviewSection from "@/components/photovoltaikanlage/fifthcard";
import PhotovoltaikSixthCardSection from "@/components/photovoltaikanlage/sixthcard";
import PhotovoltaikComponentSection from "@/components/photovoltaikanlage/seventhcard";
import PhotovoltaikSliderSection from "@/components/photovoltaikanlage/seventhcard";
import FaqSection from "@/components/photovoltaikanlage/eightcard";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.photovoltaikanlage_page.api.get_photovoltaik_page_with_keywords`;


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
      title: "Photovoltaikanlagen | Ökovolt Solartechnik",
      description:
        "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe. Senken Sie Ihre Energiekosten und werden Sie unabhängig mit maßgeschneiderten Solar-Lösungen.",
      keywords: [
        "Photovoltaikanlage",
        "Solaranlage",
        "Photovoltaik",
        "Solarenergie",
        "PV-Anlage",
      ],
      openGraph: {
        title: "Photovoltaikanlagen | Ökovolt Solartechnik",
        description:
          "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe.",
        images: [{ url: "/images/photovoltaik-og.jpg" }],
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
    title: seoData?.title || "Photovoltaikanlagen | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Hochwertige Photovoltaikanlagen für Privathaushalte und Gewerbe. Senken Sie Ihre Energiekosten und werden Sie unabhängig mit maßgeschneiderten Solar-Lösungen.",
    keywords: apiKeywords,
    
  };
}

export default async function PhotovoltaikanlagePage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
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
      <ReviewsPage data={data} />
      <PhotovoltaikStepsSection data={data} />
      <PhotovoltaikRegionalNetzSection data={data} />
      <PhotovoltaikOverviewSection data={data} />
      <PhotovoltaikSixthCardSection data={data} />
      <PhotovoltaikComponentSection data={data} />
      <FaqSection data={data} />
    </div>
  );
}
