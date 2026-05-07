import WallboxBanner from "@/components/Wallbox/banner";
import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import WallboxFeatures2 from "@/components/Wallbox/third";
import WallboxSecondCard2 from "@/components/Wallbox/second";
import WallboxThirdCard from "@/components/Wallbox/fourth";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.wallbox_page.api.get_wallbox_page_with_keywords`;

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
      title: "Wallbox & Ladestationen | Ökovolt Solartechnik",
      description:
        "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge. Schnelles und sicheres Laden mit intelligenten Ladelösungen für Zuhause und Gewerbe.",
      keywords: [
        "Wallbox",
        "Ladestation",
        "E-Auto laden",
        "Elektroauto Ladestation",
        "Wallbox Installation",
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/produkte/wallbox",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/produkte/wallbox",
        title: "Wallbox & Ladestationen | Ökovolt Solartechnik",
        description:
          "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Wallbox",
        "Ladestation",
        "E-Auto laden",
        "Elektroauto Ladestation",
        "Wallbox Installation",
      ];

  return {
    title: seoData?.title || "Wallbox & Ladestationen | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge. Schnelles und sicheres Laden mit intelligenten Ladelösungen für Zuhause und Gewerbe.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/produkte/wallbox",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/produkte/wallbox",
      title: seoData?.title || "Wallbox & Ladestationen | Ökovolt Solartechnik",
      description:
        seoData?.description ||
        "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge. Schnelles und sicheres Laden mit intelligenten Ladelösungen für Zuhause und Gewerbe.",
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

export default async function WallboxPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch wallbox data", error);
  }

  return (
    <div>
      <WallboxBanner data={data} />
      <WallboxSecondCard2 data={data} />
      <WallboxFeatures2 data={data} />
      <WallboxThirdCard data={data} />
      <EndSection />
    </div>
  );
}
