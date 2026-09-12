// uber-uns/jobs/page.js

import JobsInfo from "@/components/Jobs/jobs";
import JobListings from "@/components/Jobs/jobsposition";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import EndSection from "@/components/Reusable/end";
import JobsBannerSection from "@/components/Jobs/banner";
import JobsInfoSection from "@/components/Jobs/info";
import JobsBenefitsLayout from "@/components/Jobs/newsection";
import JobsTechnologySection from "@/components/Jobs/jobssection";
import JobsAnotherDesign from "@/components/Jobs/endsection";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const DATA_URL = `${API_BASE_URL}oekovoltdeutchland.primary_page.doctype.jobs_page.api.get_jobs_de`;
const JOBS_LIST_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`;
const JOBS_PAGE_URL = "https://www.oekovolt.de/uber-uns/jobs";

async function fetchJobsPageData() {
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

async function fetchJobsList() {
  if (!isApiConfigured()) {
    return [];
  }

  try {
    const headers = getApiHeaders();

    const response = await fetch(JOBS_LIST_URL, {
      method: 'GET',
      headers: headers,
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      console.error(`Jobs API returned ${response.status}`);
      return [];
    }

    const data = await response.json();
    if (Array.isArray(data?.message)) {
      return data.message;
    }
    return [];
  } catch (error) {
    console.error("Error fetching jobs list:", error);
    return [];
  }
}

export async function generateMetadata() {
  const seoData = await fetchJobsPageData();

  const defaultKeywords = [
    "Solar Jobs",
    "Photovoltaik Karriere",
    "Erneuerbare Energien Stellen",
    "Ökovolt Jobs",
    "Energiebranche Karriere",
  ];

  if (!seoData) {
    // Fallback metadata if API fails
    return {
      title: "Jobs & Karriere in der Photovoltaik | Ökovolt",
      description: "Arbeiten in der Solarbranche: Karrieremöglichkeiten bei Ökovolt in Türkheim – von Montage bis Projektplanung. Jetzt informieren und Teil des Teams werden!",
      keywords: defaultKeywords,
      alternates: { canonical: JOBS_PAGE_URL, languages: hreflangLanguages(JOBS_PAGE_URL) },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website",
        locale: "de_DE",
        url: JOBS_PAGE_URL,
        siteName: "Ökovolt Deutschland",
        title: "Jobs & Karriere in der Photovoltaik | Ökovolt",
        description: "Arbeiten in der Solarbranche: Karrieremöglichkeiten bei Ökovolt in Türkheim – von Montage bis Projektplanung. Jetzt informieren und Teil des Teams werden!",
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: "Ökovolt Jobs" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Jobs & Karriere in der Photovoltaik | Ökovolt",
        description: "Arbeiten in der Solarbranche: Karrieremöglichkeiten bei Ökovolt in Türkheim – von Montage bis Projektplanung. Jetzt informieren und Teil des Teams werden!",
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  }

  // Process keywords - combine API keywords with defaults if available
  const apiKeywords = seoData?.keywords
    ? [...new Set([...seoData.keywords.split(/,\s*/), ...defaultKeywords])]
    : defaultKeywords;

  const title = "Jobs & Karriere in der Photovoltaik | Ökovolt";
  const description = "Arbeiten in der Solarbranche: Karrieremöglichkeiten bei Ökovolt in Türkheim – von Montage bis Projektplanung. Jetzt informieren und Teil des Teams werden!";

  return {
    title,
    description,
    keywords: apiKeywords,
    alternates: { canonical: JOBS_PAGE_URL, languages: hreflangLanguages(JOBS_PAGE_URL) },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: JOBS_PAGE_URL,
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

export default async function JobsPage() {
  const [data, jobsList] = await Promise.all([
    fetchJobsPageData(),
    fetchJobsList(),
  ]);

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
      { "@type": "ListItem", position: 2, name: "Über Uns", item: "https://www.oekovolt.de/uber-uns" },
      { "@type": "ListItem", position: 3, name: "Jobs", item: JOBS_PAGE_URL },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${JOBS_PAGE_URL}/#webpage`,
    url: JOBS_PAGE_URL,
    name: data?.title || "Karriere bei Ökovolt | Jobs in der Solarbranche",
    description: data?.description || "Starten Sie Ihre Karriere in der Photovoltaik-Branche. Wir bieten spannende Jobs und Ausbildungsplätze im Bereich erneuerbare Energien.",

    isPartOf: { "@id": "https://www.oekovolt.de/#website" },
    about: { "@id": "https://www.oekovolt.de/#organization" },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    breadcrumb: breadcrumbSchema,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      {jobListingSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobListingSchema) }} />
      )}
      <JobsBannerSection data={data} />
      <JobsInfoSection data={data} />
      <JobListings data={data} />
      <JobsBenefitsLayout data={data} />
      <JobsTechnologySection data={data} />
      <JobsInfo data={data} />
      <JobsAnotherDesign data={data} />
      <Querverweise pfad="/uber-uns/jobs" />
      <EndSection />
    </div>
  );
}