import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import StromspeicherBanner from "@/components/stromspeicher/banner";
import LawyerSectionStromspeicher from "@/components/stromspeicher/first";
import HeroStromspeicher from "@/components/stromspeicher/first";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import StromSecondCardSection from "@/components/stromspeicher/second";
import StromThirdCardSection from "@/components/stromspeicher/third";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords`;

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
      title: "Stromspeicher Lösungen ",
      description:
        "Hochwertige Stromspeicher für Photovoltaikanlagen. Maximieren Sie Ihren Eigenverbrauch und werden Sie energieunabhängig mit unseren intelligenten Speicherlösungen.",
      keywords: [
        "Stromspeicher",
        "Batteriespeicher",
        "Solarstromspeicher",
        "Energiespeicher",
        "Photovoltaik Speicher",
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/stromspeicher",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/stromspeicher",
        title: "Stromspeicher Lösungen ",
        description: "Hochwertige Stromspeicher für Photovoltaikanlagen.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Stromspeicher",
        "Batteriespeicher",
        "Solarstromspeicher",
        "Energiespeicher",
        "Photovoltaik Speicher",
      ];

  return {
    title: seoData?.title || "Stromspeicher Lösungen ",
    description:
      seoData?.description ||
      "Hochwertige Stromspeicher für Photovoltaikanlagen. Maximieren Sie Ihren Eigenverbrauch und werden Sie energieunabhängig mit unseren intelligenten Speicherlösungen.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/produkte/stromspeicher",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/produkte/stromspeicher",
      title: seoData?.title || "Stromspeicher Lösungen ",
      description:
        seoData?.description ||
        "Hochwertige Stromspeicher für Photovoltaikanlagen. Maximieren Sie Ihren Eigenverbrauch und werden Sie energieunabhängig mit unseren intelligenten Speicherlösungen.",
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

export default async function StromspeicherPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch stromspeicher data", error);
  }

  const endd = {
    greentitle: "Solaranlage sichern",
    title: "Jetzt Kontakt aufnehmen & Solaranlage sichern",
    description:
      "Interessiert an einer maßgeschneiderten Photovoltaikanlage für Ihr Zuhause oder Unternehmen? Füllen Sie unser Kontaktformular aus oder rufen Sie uns direkt an! Unser Expertenteam berät Sie persönlich und individuell.",
  };

  return (
    <div>
      <StromspeicherBanner data={data} />
      <HeroStromspeicher data={data} />
      <FeaturedLogos data={data} />
      <StromSecondCardSection />
      <StromThirdCardSection data={data} />
      <EndSection data={endd} />
    </div>
  );
}
