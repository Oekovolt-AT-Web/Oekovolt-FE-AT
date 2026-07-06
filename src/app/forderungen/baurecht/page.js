// src/app/forderungen/baurecht/page.js

import BaurechtBannerSection from "@/components/Forderungen/Baurecht/banner";
import BaurechtPV from "@/components/Forderungen/Baurecht/second";
import EndSection from "@/components/Reusable/end";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import React from "react";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.baurecht.api.get_baurecht_data`;

async function fetchBaurechtData() {
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
  const data = await fetchBaurechtData();
  const bannerData = data?.message?.banner;

  if (!data) {
    // Fallback metadata if API fails
    return {
      title: "Normen & Richtlinien für Photovoltaikanlagen | Ökovolt",
      description: "Braucht Ihre PV-Anlage eine Genehmigung? Baurecht für Photovoltaik nach Bundesland erklärt – von der Dachanlage bis zum Balkonkraftwerk. Jetzt informieren!",
      keywords: [
        "Photovoltaik Baurecht",
        "PV-Anlage Genehmigung",
        "Bauvorschriften Photovoltaik",
        "Solarpflicht",
        "Balkonkraftwerk Anmeldung",
        "Photovoltaik genehmigungsfrei",
        "Photovoltaik Vorschriften Bundesländer",
        "Ökovolt"
      ],
      alternates: {
        canonical: "https://www.oekovolt.de/forderungen/baurecht",
      },
      openGraph: {
        type: "website",
        url: "https://www.oekovolt.de/forderungen/baurecht",
        title: "Normen & Richtlinien für Photovoltaikanlagen | Ökovolt",
        description: "Braucht Ihre PV-Anlage eine Genehmigung? Baurecht für Photovoltaik nach Bundesland erklärt – von der Dachanlage bis zum Balkonkraftwerk. Jetzt informieren!",
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

  const title = "Normen & Richtlinien für Photovoltaikanlagen | Ökovolt";
  const description = "Braucht Ihre PV-Anlage eine Genehmigung? Baurecht für Photovoltaik nach Bundesland erklärt – von der Dachanlage bis zum Balkonkraftwerk. Jetzt informieren!";

  return {
    title: title,
    description: description,
    keywords: [
      "Photovoltaik Baurecht",
      "PV-Anlage Genehmigung",
      "Bauvorschriften Photovoltaik",
      "Solarpflicht",
      "Balkonkraftwerk Anmeldung",
      "Photovoltaik genehmigungsfrei",
      "Photovoltaik Vorschriften Bundesländer",
      "Ökovolt"
    ],
    alternates: {
      canonical: "https://www.oekovolt.de/forderungen/baurecht",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/forderungen/baurecht",
      title: title,
      description: description,
      images: [
        {
          url: bannerData?.image || "/Logo-Oekovolt-Gruen-mit-Weiss.webp",
          width: 1200,
          height: 630,
          alt: bannerData?.alt_image || "Ökovolt Deutschland",
        },
      ],
    },
  };
}

const BAURECHT_PAGE_URL = "https://www.oekovolt.de/forderungen/baurecht";

export default async function Baurecht() {
  const response = await fetchBaurechtData();
  const data = response?.message;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BAURECHT_PAGE_URL}/#webpage`,
    url: BAURECHT_PAGE_URL,
    name: data?.banner?.title || "Baurecht für Photovoltaik | Ökovolt Deutschland",
    description: data?.banner?.description || "Überblick über die baurechtlichen Vorschriften für Photovoltaikanlagen in Deutschland – Genehmigungspflichten, Bauvorschriften und Abstandsregelungen verständlich erklärt.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Förderungen", item: "https://www.oekovolt.de/forderungen" },
        { "@type": "ListItem", position: 3, name: "Baurecht", item: BAURECHT_PAGE_URL },
      ],
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <BaurechtBannerSection data={data?.banner} />
      <BaurechtPV data={data?.body} />
      <EndSection />
    </div>
  );
}