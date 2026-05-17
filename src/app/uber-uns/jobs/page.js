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
      description: "Starten Sie Ihre Karriere in der Photovoltaik-Branche. Wir bieten spannende Jobs und Ausbildungsplätze im Bereich erneuerbare Energien.",
      keywords: ["Solar Jobs", "Photovoltaik Karriere", "Erneuerbare Energien Stellen", "Ökovolt Jobs", "Energiebranche Karriere"],
      alternates: { canonical: "https://www.oekovolt.de/uber-uns/jobs" },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        locale: "de_DE",
        url: "https://www.oekovolt.de/uber-uns/jobs",
        siteName: "Ökovolt Deutschland",
        title: "Karriere bei Ökovolt | Jobs in der Solarbranche",
        description: "Starten Sie Ihre Karriere in der Photovoltaik-Branche bei Ökovolt.",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Jobs" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Karriere bei Ökovolt | Jobs in der Solarbranche",
        description: "Starten Sie Ihre Karriere in der Photovoltaik-Branche bei Ökovolt.",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
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

  const title = seoData?.title || "Karriere bei Ökovolt | Jobs in der Solarbranche";
  const description = seoData?.description || "Starten Sie Ihre Karriere in der Photovoltaik-Branche. Wir bieten spannende Jobs und Ausbildungsplätze im Bereich erneuerbare Energien.";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: "https://www.oekovolt.de/uber-uns/jobs" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: "https://www.oekovolt.de/uber-uns/jobs",
      siteName: "Ökovolt Deutschland",
      title,
      description,
      images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Jobs" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
    },
  };
}

const JOBS_LIST_URL = `https://backoffice.oekovolt.de/api/method/oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`;
const JOBS_PAGE_URL = "https://www.oekovolt.de/uber-uns/jobs";

export default async function JobsPage() {
  let data = null;
  let jobsList = [];

  try {
    const [pageRes, jobsRes] = await Promise.all([
      fetch(DATA_URL, { next: { revalidate: 60 } }),
      fetch(JOBS_LIST_URL, { next: { revalidate: 3600 } }),
    ]);
    data = (await pageRes.json()).message;
    const jobsData = await jobsRes.json();
    if (Array.isArray(jobsData?.message)) jobsList = jobsData.message;
  } catch (error) {
    console.error("Failed to fetch jobs data", error);
  }

  const jobListingSchema = jobsList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${JOBS_PAGE_URL}/#joblist`,
    name: "Stellenangebote bei Ökovolt Solartechnik",
    url: JOBS_PAGE_URL,
    numberOfItems: jobsList.length,
    itemListElement: jobsList.map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${JOBS_PAGE_URL}/${job.name?.toLowerCase().replace(/\s+/g, "-")}`,
      name: job.name,
    })),
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
      { "@type": "ListItem", position: 2, name: "Über Uns", item: "https://www.oekovolt.de/uber-uns/team" },
      { "@type": "ListItem", position: 3, name: "Jobs", item: JOBS_PAGE_URL },
    ],
  };

  return (
    <div>
      {jobListingSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListingSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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