import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import WarmepumpeBanner from "../../../components/Warmepumpe/banner";
import WarmepumpeVorteileSection from "@/components/Warmepumpe/second";
import WarmepumpeSecondCardSection from "@/components/Warmepumpe/third";
import WarmepumpeManufacturerSection from "@/components/Warmepumpe/fourth";
import KontaktFormular from "@/components/Warmepumpe/fifth";
import WarmepumpeFinancingSection from "@/components/Warmepumpe/six";
import WaermepumpePartnerSection from "@/components/Warmepumpe/seven";
import WarmeBanner from "@/components/Warmepumpe/bannertwo";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.waermepumpe_page.api.get_waermepumpe_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/produkte/warmepumpe";

export async function generateMetadata() {
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch {
    return {
      title: "Wärmepumpe kaufen | Ökovolt Deutschland",
      description: "Effiziente Wärmepumpen für umweltfreundliche Heizlösungen. Senken Sie Ihre Heizkosten und CO₂-Emissionen mit moderner Wärmepumpentechnologie.",
      keywords: ["Wärmepumpe", "Heizung", "Wärmepumpenheizung", "Umweltfreundliche Heizung", "Energieeffiziente Heizung"],
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
        title: "Wärmepumpe kaufen | Ökovolt Deutschland",
        description: "Effiziente Wärmepumpen für umweltfreundliche Heizlösungen.",
        images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wärmepumpe" }],
      },
      twitter: { card: "summary_large_image", title: "Wärmepumpe kaufen | Ökovolt Deutschland", description: "Effiziente Wärmepumpen für umweltfreundliche Heizlösungen.", images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : ["Wärmepumpe", "Heizung", "Wärmepumpenheizung", "Umweltfreundliche Heizung", "Energieeffiziente Heizung"];
  const title = seoData?.title || "Wärmepumpe kaufen | Ökovolt Deutschland";
  const description = seoData?.description || "Effiziente Wärmepumpen für umweltfreundliche Heizlösungen. Senken Sie Ihre Heizkosten und CO₂-Emissionen mit moderner Wärmepumpentechnologie.";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Wärmepumpe" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["https://www.oekovolt.de/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

export default async function WarmepumpePage() {
  let data = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 60 } });
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch waermepumpe data", error);
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Wärmepumpe kaufen | Ökovolt Deutschland",
    description: data?.description || "Effiziente Wärmepumpen für umweltfreundliche Heizlösungen.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Produkte", item: "https://www.oekovolt.de/produkte/warmepumpe" },
        { "@type": "ListItem", position: 3, name: "Wärmepumpe", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <WarmeBanner data={data} />
      <WarmepumpeSecondCardSection data={data} />
      <WarmepumpeVorteileSection data={data} />
      <WarmepumpeManufacturerSection data={data} />
      <KontaktFormular />
      <WarmepumpeFinancingSection data={data} />
      <WaermepumpePartnerSection data={data} />
      <EndSection />
    </div>
  );
}