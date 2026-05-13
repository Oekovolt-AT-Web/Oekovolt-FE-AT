import JobsInfo from "@/components/Jobs/jobs";
import JobListings from "@/components/Jobs/jobsposition";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";
import JobsBannerSection from "@/components/Jobs/banner";
import JobsInfoSection from "@/components/Jobs/info";
import JobsBenefitsLayout from "@/components/Jobs/newsection";
import JobsTechnologySection from "@/components/Jobs/jobssection";
import JobsAnotherDesign from "@/components/Jobs/endsection";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.jobs_page.api.get_jobs_de`;

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
      title: "Karriere bei Ökovolt | Jobs in der Solarbranche",
      alternates: { canonical: "https://www.oekovolt.de/uber-uns/jobs" },
      openGraph: { type: "website", url: "https://www.oekovolt.de/uber-uns/jobs", title: "Karriere bei Ökovolt | Jobs in der Solarbranche", description: "Starten Sie Ihre Karriere in der Photovoltaik-Branche bei Ökovolt.", images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Deutschland" }] },
      description:
        "Starten Sie Ihre Karriere in der Photovoltaik-Branche. Wir bieten spannende Jobs und Ausbildungsplätze im Bereich erneuerbare Energien.",
      keywords: [
        "Solar Jobs",
        "Photovoltaik Karriere",
        "Erneuerbare Energien Stellen",
        "Ökovolt Jobs",
        "Energiebranche Karriere",
      ],
     
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const defaultKeywords = [
    "Solar Jobs",
    "Photovoltaik Karriere",
    "Erneuerbare Energien Stellen",
    "Ökovolt Jobs",
    "Energiebranche Karriere",
  ];

  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  return {
    title: seoData?.title || "Karriere bei Ökovolt | Jobs in der Solarbranche",
    description:
      seoData?.description ||
      "Starten Sie Ihre Karriere in der Photovoltaik-Branche. Wir bieten spannende Jobs und Ausbildungsplätze im Bereich erneuerbare Energien.",
    keywords: apiKeywords,
    alternates: {
      canonical: "https://www.oekovolt.de/uber-uns/jobs",
    },
    openGraph: {
      type: "website",
      url: "https://www.oekovolt.de/uber-uns/jobs",
      title: seoData?.title || "Karriere bei Ökovolt | Jobs in der Solarbranche",
      description:
        seoData?.description ||
        "Starten Sie Ihre Karriere in der Photovoltaik-Branche. Wir bieten spannende Jobs und Ausbildungsplätze im Bereich erneuerbare Energien.",
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

export default async function JobsPage() {
  let data = null;

  try {
    const res = await fetch(DATA_URL , { next: { revalidate: 60 } }) ;
    const json = await res.json();
    data = json.message;
  } catch (error) {
    console.error("Failed to fetch jobs data", error);
  }

  return (
    <div>
      <JobsBannerSection data={data} />
      <JobsInfoSection data={data} />
      <JobListings data={data} />
      <JobsBenefitsLayout data={data} />
      <JobsTechnologySection data={data} />
      <JobsInfo data={data} />
      <JobsAnotherDesign data={data} />
      <EndSection />
    </div>
  );
}
