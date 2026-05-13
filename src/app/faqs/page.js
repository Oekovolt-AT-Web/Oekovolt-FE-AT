import BannerSection from "@/components/Faqs/banner";
import SolarInfoAccordion from "@/components/Faqs/faqs";
import FAQInfoSection from "@/components/Faqs/info";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import EndSection from "@/components/Reusable/end";
import InfoSection from "@/components/Reusable/info";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.faqs_page.api.get_faqs_page`;



export async function generateMetadata() {
  // Fetch data for metadata
  let seoData = null;
  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 3600 } }) ;
    const json = await res.json();
    seoData = json.message;
  } catch (error) {
    console.error("Failed to fetch SEO data", error);
    // Fallback metadata if API fails
    return {
      title: "Häufige Fragen (FAQ) ",
      alternates: { canonical: "https://www.oekovolt.de/faqs" },
      openGraph: { type: "website", url: "https://www.oekovolt.de/faqs", title: "Häufige Fragen (FAQ) ", description: "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik, Solaranlagen und Förderungen.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }] },
      description:
        "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik, Solaranlagen und Förderungen. Unser FAQ-Bereich klärt alle Themen rund um Solarenergie.",
      keywords: [
        "Photovoltaik FAQ",
        "Solaranlagen Fragen",
        "PV-Anlage Antworten",
        "Solarenergie Fragen",
        "Solar Förderung FAQ",
      ],
      // openGraph: {
      //   title: "Häufige Fragen (FAQ) ",
      //   description:
      //     "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik und Solaranlagen.",
      //   images: [{ url: "/images/faqs-og.jpg" }],
      // },
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Photovoltaik FAQ",
    "Solaranlagen Fragen",
    "PV-Anlage Antworten",
    "Solarenergie Fragen",
    "Solar Förderung FAQ",
  ];

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title: seoData?.title || "Häufige Fragen (FAQ) ",
    description:
      seoData?.description ||
      "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik, Solaranlagen und Förderungen. Unser FAQ-Bereich klärt alle Themen rund um Solarenergie.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/faqs",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/faqs",
      title: seoData?.title || "Häufige Fragen (FAQ) ",
      description:
        seoData?.description ||
        "Antworten auf Ihre wichtigsten Fragen zu Photovoltaik, Solaranlagen und Förderungen. Unser FAQ-Bereich klärt alle Themen rund um Solarenergie.",
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

export default async function FaqsPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch FAQs data", error);
  }

  const infoData = {
    title: "Photovoltaik FAQs – Antworten auf Ihre wichtigsten Fragen",
    subtitle: "",
    img: "/Images/Referenzen/projekteBanner.jpg",
    description: [
      "Alles, was Sie über Solaranlagen wissen müssen – Finden Sie Antworten auf die häufigsten Fragen rund um unsere Photovoltaik-Lösungen. Unser Team bietet Ihnen detaillierte Informationen zu Installation, Kosten, Förderung und mehr – klar, verständlich und transparent.",
    ],
  };

  return (
    <div>
      <BannerSection data={data} />
      <FAQInfoSection data={data} />
      <SolarInfoAccordion data={data} />
      <EndSection />
    </div>
  );
}
