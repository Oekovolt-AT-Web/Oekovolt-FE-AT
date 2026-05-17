import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";
import BannerSection from "@/components/Direktvermaktung/banner";
import HeroEnergy from "@/components/Direktvermaktung/second";
import SecondCardSection from "@/components/Direktvermaktung/third";
import ThirdCardSection from "@/components/Direktvermaktung/fourth";
import FifthCardSection from "@/components/Direktvermaktung/fifth";
import SixCardSection from "@/components/Direktvermaktung/six";
import DirektvermaktungFAQ from "@/components/Direktvermaktung/eight";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.direktvermarktung_service_page.api.get_photovoltaik_repowering_page_with_keywords`;

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
      title: "Solarstrom Direktvermarktung | Ökovolt Deutschland",
      alternates: { canonical: "https://www.oekovolt.de/service/direktvermaktung" },
      openGraph: { type: "website", locale: "de_DE", url: "https://www.oekovolt.de/service/direktvermaktung", siteName: "Ökovolt Deutschland", title: "Solarstrom Direktvermarktung | Ökovolt Deutschland", description: "Professionelle Direktvermarktung Ihres Solarstroms.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Direktvermarktung" }] },
      twitter: { card: "summary_large_image", title: "Solarstrom Direktvermarktung | Ökovolt Deutschland", description: "Professionelle Direktvermarktung Ihres Solarstroms.", images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
      description:
        "Professionelle Direktvermarktung Ihres Solarstroms. Maximieren Sie Ihre Erträge durch optimale Vermarktung Ihrer PV-Überschüsse.",
      keywords: [
        "Solarstrom Direktvermarktung",
        "Stromvermarktung PV-Anlage",
        "EEG-Vergütung",
        "Energie Direktvermarktung",
        "Solarstrom verkaufen",
      ],
      // openGraph: {
      //   title: "Direktvermarktung von Solarstrom ",
      //   description: "Professionelle Direktvermarktung Ihres Solarstroms.",
      //   images: [{ url: "/images/direktvermarktung-og.jpg" }],
      // },
    };
  }

  // Process keywords - use API keywords if available, otherwise fallback
  const apiKeywords = seoData?.keywords
    ? seoData.keywords.split(/,\s*/)
    : [
        "Solarstrom Direktvermarktung",
        "Stromvermarktung PV-Anlage",
        "EEG-Vergütung",
        "Energie Direktvermarktung",
        "Solarstrom verkaufen",
      ];

  const title = seoData?.title || "Solarstrom Direktvermarktung | Ökovolt Deutschland";
  const description = seoData?.description || "Professionelle Direktvermarktung Ihres Solarstroms. Maximieren Sie Ihre Erträge durch optimale Vermarktung Ihrer PV-Überschüsse.";
  const canonical = "https://www.oekovolt.de/service/direktvermaktung";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: canonical, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Direktvermarktung Solarstrom" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

const DV_PAGE_URL = "https://www.oekovolt.de/service/direktvermaktung";

export default async function DirektvermarktungPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch direktvermarktung data", error);
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${DV_PAGE_URL}/#webpage`,
    url: DV_PAGE_URL,
    name: data?.title || "Solarstrom Direktvermarktung | Ökovolt Deutschland",
    description: data?.description || "Professionelle Direktvermarktung Ihres Solarstroms. Maximieren Sie Ihre Erträge.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Service", item: "https://www.oekovolt.de/service/direktvermaktung" },
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
      <EndSection />
    </div>
  );
}