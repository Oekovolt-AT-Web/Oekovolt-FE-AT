import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import StromspeicherBanner from "@/components/stromspeicher/banner";
import HeroStromspeicher from "@/components/stromspeicher/first";
import FeaturedLogos from "@/components/photovoltaikanlage/partners";
import StromSecondCardSection from "@/components/stromspeicher/second";
import StromThirdCardSection from "@/components/stromspeicher/third";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.stromspeicher_page.api.get_strom_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/stromspeicher";

export async function generateMetadata() {
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch {
    return {
      title: "Stromspeicher kaufen | Ökovolt Deutschland",
      description: "Hochwertige Stromspeicher für Photovoltaikanlagen. Maximieren Sie Ihren Eigenverbrauch und werden Sie energieunabhängig mit unseren intelligenten Speicherlösungen.",
      keywords: ["Stromspeicher", "Batteriespeicher", "Solarstromspeicher", "Energiespeicher", "Photovoltaik Speicher"],
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
        title: "Stromspeicher kaufen | Ökovolt Deutschland",
        description: "Hochwertige Stromspeicher für Photovoltaikanlagen.",
        images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Stromspeicher" }],
      },
      twitter: { card: "summary_large_image", title: "Stromspeicher kaufen | Ökovolt Deutschland", description: "Hochwertige Stromspeicher für Photovoltaikanlagen.", images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : ["Stromspeicher", "Batteriespeicher", "Solarstromspeicher", "Energiespeicher", "Photovoltaik Speicher"];
  const title = seoData?.title || "Stromspeicher kaufen | Ökovolt Deutschland";
  const description = seoData?.description || "Hochwertige Stromspeicher für Photovoltaikanlagen. Maximieren Sie Ihren Eigenverbrauch und werden Sie energieunabhängig mit unseren intelligenten Speicherlösungen.";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Stromspeicher" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

export default async function StromspeicherPage() {
  let data = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch stromspeicher data", error);
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Stromspeicher kaufen | Ökovolt Deutschland",
    description: data?.description || "Hochwertige Stromspeicher für Photovoltaikanlagen.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte/stromspeicher" },
        { "@type": "ListItem", position: 3, name: "Stromspeicher", item: PAGE_URL },
      ],
    },
  };

  const endd = {
    greentitle: "Solaranlage sichern",
    title: "Jetzt Kontakt aufnehmen & Solaranlage sichern",
    description: "Interessiert an einer maßgeschneiderten Photovoltaikanlage für Ihr Zuhause oder Unternehmen? Füllen Sie unser Kontaktformular aus oder rufen Sie uns direkt an! Unser Expertenteam berät Sie persönlich und individuell.",
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <StromspeicherBanner data={data} />
      <HeroStromspeicher data={data} />
      <FeaturedLogos data={data} />
      <StromSecondCardSection />
      <StromThirdCardSection data={data} />
      <EndSection data={endd} />
    </div>
  );
}