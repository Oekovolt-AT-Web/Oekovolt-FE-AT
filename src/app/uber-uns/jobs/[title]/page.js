// src/app/uber-uns/jobs/[title]/page.js

import { notFound } from "next/navigation";
import BannerSection from "@/components/Reusable/banner";
import JobDetails from "@/components/JobDetails/jobdetail";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { generateJobSlug } from "@/lib/slugify";

const JOBS_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`;
const BASE_URL = "https://www.oekovolt.de";

// Remove forced static - let Next.js handle it naturally with ISR

// Cache for data (optional, can be removed if not needed)
let cachedJobs = null;

async function fetchAllJobs() {
  if (cachedJobs) return cachedJobs;
  
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return [];
  }

  try {
    const headers = getApiHeaders();
    
    const res = await fetch(JOBS_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 } // ISR: Revalidate every hour
    });
    
    if (!res.ok) {
      let errorText = "";
      try {
        const errorData = await res.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await res.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${res.status}: ${errorText}`);
      return [];
    }
    
    const data = await res.json();
    cachedJobs = Array.isArray(data?.message) ? data.message : [];
    return cachedJobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const jobs = await fetchAllJobs();
    const job = jobs.find((p) => generateJobSlug(p.name) === title);

    if (!job) {
      return { 
        title: "Job nicht gefunden | Ökovolt", 
        robots: { index: false } 
      };
    }

    const canonical = `${BASE_URL}/uber-uns/jobs/${title}`;
    const description = `Stellenangebot: ${job.name} bei Ökovolt Solartechnik. Bewerben Sie sich jetzt für einen Job in der Photovoltaik-Branche.`;

    return {
      title: `${job.name} | Karriere bei Ökovolt`,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", 
         
        url: canonical, 
        siteName: "Ökovolt Deutschland",
        title: `${job.name} | Karriere bei Ökovolt`,
        description,
        images: [{ 
          url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", 
          width: 1200, 
          height: 630, 
          alt: `${job.name} – Ökovolt` 
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${job.name} | Karriere bei Ökovolt`,
        description,
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { 
      title: "Job nicht gefunden | Ökovolt", 
      robots: { index: false } 
    };
  }
}

export default async function JobDetailPage({ params }) {
  const { title } = await params;
  
  // Fetch all jobs
  const jobs = await fetchAllJobs();
  
  // Find the current job
  const job = jobs.find((p) => generateJobSlug(p.name) === title);
  
  if (!job) notFound();

  const bannerInfo = {
    title: job.title || job.name,
    img: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg",
  };

  const canonicalUrl = `${BASE_URL}/uber-uns/jobs/${title}`;

  const jobSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "@id": `${canonicalUrl}/#jobposting`,
    title: job.title || job.name,
    description: job.description || `Stellenangebot bei Ökovolt Solartechnik: ${job.name}`,
    hiringOrganization: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Ökovolt Deutschland",
      sameAs: BASE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Schlingener Str. 1a",
        addressLocality: "Türkheim",
        postalCode: "86842",
        addressRegion: "Bayern",
        addressCountry: "DE",
      },
    },
    url: canonicalUrl,
    datePosted: job.creation ? new Date(job.creation).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    employmentType: job.employment_type || "FULL_TIME",
    directApply: true,
    ...(job.salary && { 
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "EUR",
        value: {
          "@type": "QuantitativeValue",
          value: job.salary,
          unitText: "YEAR"
        }
      }
    }),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Jobs", item: `${BASE_URL}/uber-uns/jobs` },
      { "@type": "ListItem", position: 3, name: job.title || job.name, item: canonicalUrl },
    ],
  };

  return (
    <div>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} 
      />
      <BannerSection data={bannerInfo} />
      <JobDetails jobData={job} />
    </div>
  );
}