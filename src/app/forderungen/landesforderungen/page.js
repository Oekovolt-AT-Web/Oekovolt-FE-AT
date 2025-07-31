import LandesBannerSection from "@/components/Forderungen/Landes/banner";
import ForderungenSection from "@/components/Forderungen/Landes/second";
import LandesSection from "@/components/Forderungen/Landes/second";
import EndSection from "@/components/Reusable/end";
import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.forderungen_pages.doctype.forderungen_page.api.get_forderungen_page`;

export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 3600 } }) ;
    const json = await res.json();
    seoData = json.message?.[0]; // Assuming first item contains general metadata
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Landesförderungen | Ökovolt Solartechnik",
      description:
        "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher. Finden Sie die passende Förderung für Ihr Projekt.",
      keywords: [
        "Photovoltaik Förderung",
        "Landesförderprogramme",
        "Solarförderung",
        "Bundesländer Förderung",
        "Energie Förderungen",
      ],
     
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Photovoltaik Förderung",
    "Landesförderprogramme",
    "Solarförderung",
    "Bundesländer Förderung",
    "Energie Förderungen",
  ];

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title: seoData?.title || "Landesförderungen | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher. Finden Sie die passende Förderung für Ihr Projekt.",
    keywords: apiKeywords,
    // openGraph: {
    //   title: seoData?.title || "Landesförderungen | Ökovolt Solartechnik",
    //   description:
    //     seoData?.description ||
    //     "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher.",
    //   url: "https://www.oekovolt.de/foerderungen/landesfoerderungen",
    //   siteName: "Ökovolt Solartechnik",
    //   images: [
    //     {
    //       url: seoData?.banner_image
    //         ? `${API_BASE_URL}${seoData.banner_image}`
    //         : "/images/landesfoerderungen-og.jpg",
    //       width: 1200,
    //       height: 630,
    //     },
    //   ],
    //   locale: "de_DE",
    //   type: "website",
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title: seoData?.title || "Landesförderungen | Ökovolt Solartechnik",
    //   description:
    //     seoData?.description ||
    //     "Aktuelle Förderprogramme der Bundesländer für Photovoltaik und Speicher.",
    //   images: [
    //     seoData?.banner_image
    //       ? `${API_BASE_URL}${seoData.banner_image}`
    //       : "/images/landesfoerderungen-og.jpg",
    //   ],
    // },
    // alternates: {
    //   canonical: "https://www.oekovolt.de/foerderungen/landesfoerderungen",
    // },
  };
}

export default async function Page() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch funding data", error);
  }

  return (
    <div>
      <LandesBannerSection data={data} />
      <ForderungenSection data={data} />
      <EndSection />
    </div>
  );
}
