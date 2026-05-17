import ProjekteBannerSection from "@/components/Project/banner";
import ProjekteAnotherDesign from "@/components/Project/endsection";
import ProjectsHero from "@/components/Project/info";
import ProjekteTechnologySection from "@/components/Project/newsection";
import ProjekteBenefitsLayout from "@/components/Project/second";
import Vorteil from "@/components/Project/vorteile";
import EndSection from "@/components/Reusable/end";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.referenzen_page.api.get_referenzen`;
const PAGE_URL = "https://www.oekovolt.de/referenzen/projekte";

export async function generateMetadata() {
  let seoData = null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    const json = await res.json();
    seoData = json.message;
  } catch {
    return {
      title: "Referenzprojekte | Ökovolt Deutschland",
      description: "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte. Entdecken Sie Referenzen unserer nachhaltigen Energielösungen.",
      keywords: ["Photovoltaik Referenzen", "Solarprojekte", "PV-Anlagen Beispiele", "Ökovolt Projekte", "Energielösungen Referenzen"],
      alternates: { canonical: PAGE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
        title: "Referenzprojekte | Ökovolt Deutschland",
        description: "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Referenzprojekte" }],
      },
      twitter: { card: "summary_large_image", title: "Referenzprojekte | Ökovolt Deutschland", description: "Unsere erfolgreichen Photovoltaik-Projekte.", images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
    };
  }

  const defaultKeywords = ["Photovoltaik Referenzen", "Solarprojekte", "PV-Anlagen Beispiele", "Ökovolt Projekte", "Energielösungen Referenzen"];
  const apiKeywords = seoData?.keywords ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])] : defaultKeywords;
  const title = seoData?.title || "Referenzprojekte | Ökovolt Deutschland";
  const description = seoData?.description || "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte. Entdecken Sie Referenzen unserer nachhaltigen Energielösungen.";

  return {
    title, description, keywords: apiKeywords,
    alternates: { canonical: PAGE_URL },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website", locale: "de_DE", url: PAGE_URL, siteName: "Ökovolt Deutschland",
      title, description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Referenzprojekte" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"] },
  };
}

const PROJECTS_API = `https://backoffice.oekovolt.de/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;

export default async function ProjektePage() {
  let data = null;
  let projectsList = [];

  try {
    const [pageRes, projRes] = await Promise.all([
      fetch(DATA_URL, { next: { revalidate: 60 } }),
      fetch(PROJECTS_API, { next: { revalidate: 3600 } }),
    ]);
    data = (await pageRes.json()).message;
    const projData = await projRes.json();
    if (Array.isArray(projData?.message)) projectsList = projData.message;
  } catch (error) {
    console.error("Failed to fetch projects data", error);
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#collectionpage`,
    url: PAGE_URL,
    name: data?.title || "Referenzprojekte – Ökovolt Deutschland",
    description: data?.description || "Unsere erfolgreichen Photovoltaik-Projekte für Gewerbe, Industrie und Privathaushalte.",
    inLanguage: "de-DE",
    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    ...(projectsList.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: projectsList.length,
        itemListElement: projectsList.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title || p.name,
          url: `${PAGE_URL}/${p.title?.toLowerCase().replace(/\s+/g, "-") || p.name}`,
        })),
      },
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
      { "@type": "ListItem", position: 2, name: "Referenzen", item: "https://www.oekovolt.de/referenzen/projekte" },
      { "@type": "ListItem", position: 3, name: "Projekte", item: PAGE_URL },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProjekteBannerSection data={data} />
      <ProjectsHero data={data} />
      <ProjekteTechnologySection data={data} />
      <ProjekteBenefitsLayout data={data} />
      <Vorteil data={data} />
      <ProjekteAnotherDesign data={data} />
      <EndSection />
    </div>
  );
}