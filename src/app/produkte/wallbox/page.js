import WallboxBanner from "@/components/Wallbox/banner";
import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import WallboxFeatures2 from "@/components/Wallbox/third";
import WallboxSecondCard2 from "@/components/Wallbox/second";
import WallboxThirdCard from "@/components/Wallbox/fourth";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.wallbox_page.api.get_wallbox_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/wallbox";

export async function generateMetadata() {
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch {
    return {
      title: "Wallbox & Ladestationen | Ökovolt Deutschland",
      description: "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge. Schnelles und sicheres Laden mit intelligenten Ladelösungen für Zuhause und Gewerbe.",
      keywords: ["Wallbox", "Ladestation", "E-Auto laden", "Elektroauto Ladestation", "Wallbox Installation"],
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
        title: "Wallbox & Ladestationen | Ökovolt Deutschland",
        description: "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge.",
        images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wallbox" }],
      },
      twitter: { card: "summary_large_image", title: "Wallbox & Ladestationen | Ökovolt Deutschland", description: "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge.", images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : ["Wallbox", "Ladestation", "E-Auto laden", "Elektroauto Ladestation", "Wallbox Installation"];
  const title = seoData?.title || "Wallbox & Ladestationen | Ökovolt Deutschland";
  const description = seoData?.description || "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge. Schnelles und sicheres Laden mit intelligenten Ladelösungen für Zuhause und Gewerbe.";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wallbox" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

export default async function WallboxPage() {
  let data = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch wallbox data", error);
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Wallbox & Ladestationen | Ökovolt Deutschland",
    description: data?.description || "Hochwertige Wallboxen und Ladestationen für Elektrofahrzeuge.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte/wallbox" },
        { "@type": "ListItem", position: 3, name: "Wallbox", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <WallboxBanner data={data} />
      <WallboxSecondCard2 data={data} />
      <WallboxFeatures2 data={data} />
      <WallboxThirdCard data={data} />
      <EndSection />
    </div>
  );
}