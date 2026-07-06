import React from "react";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import BannerSection from "@/components/Finanzierung/banner";
import FinancingSection from "@/components/Finanzierung/second";
import FinancingBenefitsSection from "@/components/Finanzierung/third";
import FinanzierungPartnerSection from "@/components/Finanzierung/fourth";
import FinanzierungFAQ from "@/components/Finanzierung/fifth";
import EndSection from "@/components/Reusable/end";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.finanzierung_service_page.api.get_finanzierung_page_with_keywords`;
const PAGE_URL = "https://www.oekovolt.de/service/finanzierung";

async function fetchFinanzierungData() {
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
  const seoData = await fetchFinanzierungData();

  const defaultKeywords = ["Photovoltaik Finanzierung", "Solar Förderungen", "PV-Anlage Finanzierung", "KfW Förderung", "Solarfinanzierung"];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Solaranlage & Wärmepumpe Finanzierung – ohne Eigenkapital | Ökovolt",
      description: "Wärmepumpe oder PV-Anlage ohne Eigenkapital finanzieren: faire Raten, feste Zinsen, KfW-Beratung inklusive – mit dem PSD SolarKredit. Jetzt beraten lassen!",
      keywords: defaultKeywords,
      alternates: { canonical: PAGE_URL, },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",

        url: PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Solaranlage & Wärmepumpe Finanzierung – ohne Eigenkapital | Ökovolt",
        description: "Wärmepumpe oder PV-Anlage ohne Eigenkapital finanzieren: faire Raten, feste Zinsen, KfW-Beratung inklusive – mit dem PSD SolarKredit. Jetzt beraten lassen!",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Finanzierung" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Solaranlage & Wärmepumpe Finanzierung – ohne Eigenkapital | Ökovolt",
        description: "Wärmepumpe oder PV-Anlage ohne Eigenkapital finanzieren: faire Raten, feste Zinsen, KfW-Beratung inklusive – mit dem PSD SolarKredit. Jetzt beraten lassen!",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
      },
    };
  }

  const apiKeywords = seoData?.keywords ? seoData.keywords.split(/,\s*/) : defaultKeywords;
  const title = "Solaranlage & Wärmepumpe Finanzierung – ohne Eigenkapital | Ökovolt";
  const description = "Wärmepumpe oder PV-Anlage ohne Eigenkapital finanzieren: faire Raten, feste Zinsen, KfW-Beratung inklusive – mit dem PSD SolarKredit. Jetzt beraten lassen!";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: PAGE_URL, },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",

      url: PAGE_URL,
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Finanzierung" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"]
    },
  };
}

export default async function FinanzierungPage() {
  const data = await fetchFinanzierungData();

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: data?.title || "Photovoltaik Finanzierung & Förderungen ",
    description: data?.description || "Attraktive Finanzierungsmöglichkeiten und Förderprogramme für Ihre Photovoltaikanlage. Finden Sie die passende Lösung für Ihre Solarinvestition.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Service", item: "https://www.oekovolt.de/service" },
        { "@type": "ListItem", position: 3, name: "Finanzierung", item: PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <BannerSection data={data} />
      <FinancingSection data={data} />
      <FinancingBenefitsSection data={data} />
      <FinanzierungPartnerSection data={data} />
      <FinanzierungFAQ data={data} />
      <EndSection />
    </div>
  );
}