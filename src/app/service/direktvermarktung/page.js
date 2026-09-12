// service/direktvermarktung/page.js

import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";
import BannerSection from "@/components/Direktvermaktung/banner";
import HeroEnergy from "@/components/Direktvermaktung/second";
import SecondCardSection from "@/components/Direktvermaktung/third";
import ThirdCardSection from "@/components/Direktvermaktung/fourth";
import FifthCardSection from "@/components/Direktvermaktung/fifth";
import SixCardSection from "@/components/Direktvermaktung/six";
import DirektvermaktungFAQ from "@/components/Direktvermaktung/eight";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.direktvermarktung_service_page.api.get_photovoltaik_repowering_page_with_keywords`;
const DV_PAGE_URL = "https://www.oekovolt.de/service/direktvermarktung";

async function fetchDirektvermarktungData() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing FRAPPE_API_KEY or FRAPPE_API_SECRET in environment variables");
    return null;
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(DATA_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      let errorText = "";
      try {
        const errorData = await response.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await response.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${response.status}: ${errorText}`);
      return null;
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await fetchDirektvermarktungData();

  const defaultKeywords = [
    "Solarstrom Direktvermarktung",
    "Stromvermarktung PV-Anlage",
    "EEG-Vergütung",
    "Energie Direktvermarktung",
    "Solarstrom verkaufen",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Direktvermarktung von Solarstrom – mit Marktprämie | Ökovolt",
      description: "Direktvermarktung für PV-Anlagen bis 100 kWp: höhere Erlöse an der Strombörse, abgesichert durch die Marktprämie – komplette Abwicklung durch Ökovolt!",
      keywords: defaultKeywords,
      alternates: { canonical: DV_PAGE_URL, languages: hreflangLanguages(DV_PAGE_URL) },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: DV_PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Direktvermarktung von Solarstrom – mit Marktprämie | Ökovolt",
        description: "Direktvermarktung für PV-Anlagen bis 100 kWp: höhere Erlöse an der Strombörse, abgesichert durch die Marktprämie – komplette Abwicklung durch Ökovolt!",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Direktvermarktung" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Direktvermarktung von Solarstrom – mit Marktprämie | Ökovolt",
        description: "Direktvermarktung für PV-Anlagen bis 100 kWp: höhere Erlöse an der Strombörse, abgesichert durch die Marktprämie – komplette Abwicklung durch Ökovolt!",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : defaultKeywords;

  const title = "Direktvermarktung von Solarstrom – mit Marktprämie | Ökovolt";
  const description = "Direktvermarktung für PV-Anlagen bis 100 kWp: höhere Erlöse an der Strombörse, abgesichert durch die Marktprämie – komplette Abwicklung durch Ökovolt!";
  const canonical = DV_PAGE_URL;

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical, languages: hreflangLanguages(canonical) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",

      url: canonical,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Direktvermarktung Solarstrom" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

export default async function DirektvermarktungPage() {
  const data = await fetchDirektvermarktungData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${DV_PAGE_URL}/#webpage`,
    url: DV_PAGE_URL,
    name: data?.title || "Solarstrom Direktvermarktung | Ökovolt Deutschland",
    description: data?.description || "Professionelle Direktvermarktung Ihres Solarstroms. Maximieren Sie Ihre Erträge durch optimale Vermarktung Ihrer PV-Überschüsse.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Service", item: "https://www.oekovolt.de/service" },
        { "@type": "ListItem", position: 3, name: "Direktvermarktung", item: DV_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <BannerSection data={data} />
      <HeroEnergy data={data} />
      <SecondCardSection data={data} />
      <ThirdCardSection data={data} />
      <FifthCardSection data={data} />
      <SixCardSection data={data} />
      <DirektvermaktungFAQ data={data} />
      <Querverweise pfad="/service/direktvermarktung" />
      <EndSection />
    </div>
  );
}