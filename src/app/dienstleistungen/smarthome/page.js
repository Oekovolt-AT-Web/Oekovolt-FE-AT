import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";
import TeamBanner from "@/components/Reusable/teamBanner";
import SmarthomeBannerSection from "@/components/Smarthome/banner";
import VorteileSection from "@/components/Smarthome/Smarthomeloesung";
import Tabs from "@/components/Smarthome/Tabs";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.smarthome_page.api.get_smarthome_page`;

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
      title: "Smarthome Lösungen | Ökovolt Solartechnik",
      description:
        "Intelligente Smarthome-Lösungen für mehr Komfort, Sicherheit und Energieeffizienz in Ihrem Zuhause. Vernetzte Technologie für modernes Wohnen.",
      keywords: [
        "Smarthome",
        "Smart Home",
        "Hausautomation",
        "Energieeffizienz",
        "Vernetztes Wohnen",
      ],
    
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Smarthome",
        "Smart Home",
        "Hausautomation",
        "Energieeffizienz",
        "Vernetztes Wohnen",
      ];

  return {
    title: seoData?.title || "Smarthome Lösungen | Ökovolt Solartechnik",
    description:
      seoData?.description ||
      "Intelligente Smarthome-Lösungen für mehr Komfort, Sicherheit und Energieeffizienz in Ihrem Zuhause. Vernetzte Technologie für modernes Wohnen.",
    keywords: apiKeywords,
    // openGraph: {
    //   title: seoData?.title || "Smarthome Lösungen | Ökovolt Solartechnik",
    //   description:
    //     seoData?.description ||
    //     "Intelligente Smarthome-Lösungen für mehr Komfort, Sicherheit und Energieeffizienz.",
    //   url: "https://www.oekovolt.de/smarthome",
    //   siteName: "Ökovolt Solartechnik",
    //   images: [
    //     {
    //       url: seoData?.banner_image
    //         ? `${API_BASE_URL}${seoData.banner_image}`
    //         : "/images/smarthome-og.jpg",
    //       width: 1200,
    //       height: 630,
    //     },
    //   ],
    //   locale: "de_DE",
    //   type: "website",
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title: seoData?.title || "Smarthome Lösungen | Ökovolt Solartechnik",
    //   description:
    //     seoData?.description ||
    //     "Intelligente Smarthome-Lösungen für mehr Komfort, Sicherheit und Energieeffizienz.",
    //   images: [
    //     seoData?.banner_image
    //       ? `${API_BASE_URL}${seoData.banner_image}`
    //       : "/images/smarthome-og.jpg",
    //   ],
    // },
    // alternates: {
    //   canonical: "https://www.oekovolt.de/smarthome",
    // },
  };
}

export default async function Home() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch smarthome data", error);
  }

  return (
    <div>
      <SmarthomeBannerSection data={data} />
      <Tabs data={data} />
      <VorteileSection data={data} />
      <EndSection />
    </div>
  );
}
