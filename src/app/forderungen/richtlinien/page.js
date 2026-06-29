// src/app/forderungen/richtlinen/page.js

import RichtlinenBannerSection from "@/components/Forderungen/Richtlinen/banner";
import RichtlinienPV from "@/components/Forderungen/Richtlinen/second";
import EndSection from "@/components/Reusable/end";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import React from "react";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.richtlinen.api.get_richtlinen_data`;

async function fetchRichtlinenData() {
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
    return data;
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

// Generate metadata dynamically from fetched data
export async function generateMetadata() {
  const data = await fetchRichtlinenData();
  const bannerData = data?.message?.banner;

  const defaultTitle = "Technische Richtlinien für Photovoltaik | Ökovolt Deutschland";

  const defaultDescription = "Wesentliche technische Normen, Sicherheitsrichtlinien und Bauvorschriften für Photovoltaikanlagen in Deutschland – VDE-Normen und aktuelle Sicherheitsanforderungen."

  const defaultCanonical = "https://www.oekovolt.de/forderungen/richtlinien";


  if (!data) {
    // Fallback metadata if API fails
    return {
      title: defaultTitle,
      description: defaultDescription,
      keywords: [
        "Photovoltaik Richtlinien",
        "PV-Anlage Normen",
        "Sicherheitsrichtlinien Solar",
        "Technische Normen Photovoltaik",
        "VDE Richtlinien",
      ],
      alternates: {
        canonical: defaultCanonical,
      },
      openGraph: {
        type: "website",
        url: defaultCanonical,
        title: defaultTitle,
        description: defaultDescription,
        images: [
          {
            url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
            width: 1200,
            height: 630,
            alt: "Ökovolt",
          },
        ],
      },
    };
  }

  const title = bannerData?.title + " | Ökovolt Solartechnik Deutschland" || defaultTitle;
  const description = bannerData?.description || defaultDescription;

  return {
    title: title,
    description: description,
    keywords: [
      "Photovoltaik Richtlinien",
      "PV-Anlage Normen",
      "Sicherheitsrichtlinien Solar",
      "Technische Normen Photovoltaik",
      "VDE Richtlinien",
    ],
    alternates: {
      canonical: defaultCanonical,
    },
    openGraph: {
      type: "website",
      url: defaultCanonical,
      title: title,
      description: description,
      images: [
        {
          url: bannerData?.image || "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: bannerData?.alt_image || "Ökovolt",
        },
      ],
    },
  };
}

const RICHTLINEN_PAGE_URL = process.env.NEXT_PUBLIC_SITE === "de" || process.env.NEXT_PUBLIC_COUNTRY === "deutschland"
  ? "https://www.oekovolt.de/forderungen/richtlinien"
  : "https://www.oekovolt.com/forderungen/richtlinien";

export default async function Richtlinen() {
  const response = await fetchRichtlinenData();
  const data = response?.message;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${RICHTLINEN_PAGE_URL}/#webpage`,
    url: RICHTLINEN_PAGE_URL,
    name: data?.banner?.title || "Technische Richtlinien für Photovoltaik | Ökovolt",
    description: data?.banner?.description || "Wesentliche technische Normen, Sicherheitsrichtlinien und Bauvorschriften für Photovoltaikanlagen.",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Förderungen", item: "https://www.oekovolt.de/forderungen" },
        { "@type": "ListItem", position: 3, name: "Richtlinien", item: RICHTLINEN_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <RichtlinenBannerSection data={data?.banner} />
      <RichtlinienPV data={data?.body} />
      <EndSection />
    </div>
  );
}