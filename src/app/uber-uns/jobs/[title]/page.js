import { notFound } from "next/navigation";
import BannerSection from "@/components/Reusable/banner";
import JobDetails from "@/components/JobDetails/jobdetail";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { generateJobSlug } from "@/lib/slugify";

const JOBS_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`;

export async function generateStaticParams() {
  try {
    const res = await fetch(JOBS_URL);
    const data = await res.json();
    if (!Array.isArray(data?.message)) return [];
    return data.message.map((job) => ({ title: generateJobSlug(job.name) }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { title } = await params;
  try {
    const res = await fetch(JOBS_URL);
    const data = await res.json();
    if (!Array.isArray(data?.message)) return { title: "Jobs | Ökovolt", robots: { index: false } };

    const job = data.message.find((p) => generateJobSlug(p.name) === title);
    if (!job) notFound();

    const canonical = `https://www.oekovolt.de/uber-uns/jobs/${title}`;
    const description = `Stellenangebot: ${job.name} bei Ökovolt Solartechnik. Bewerben Sie sich jetzt für einen Job in der Photovoltaik-Branche.`;

    return {
      title: `${job.name} | Karriere bei Ökovolt`,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        type: "website", locale: "de_DE", url: canonical, siteName: "Ökovolt Deutschland",
        title: `${job.name} | Karriere bei Ökovolt`,
        description,
        images: [{ url: "/Logo-Oekovolt-Gruen-mit-Weiss.webp", width: 1200, height: 630, alt: `${job.name} – Ökovolt` }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${job.name} | Karriere bei Ökovolt`,
        description,
        images: ["/Logo-Oekovolt-Gruen-mit-Weiss.webp"],
      },
    };
  } catch {
    return { title: "Job nicht gefunden | Ökovolt", robots: { index: false } };
  }
}

export default async function JobDetailPage({ params }) {
  const { title } = await params;
  try {
    const res = await fetch(JOBS_URL);
    const data = await res.json();
    if (!Array.isArray(data?.message)) {
      return <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">Fehler beim Laden der Stellenangebote.</div>;
    }

    const job = data.message.find((p) => generateJobSlug(p.name) === title);
    if (!job) notFound();

    const bannerInfo = {
      title: job.title || job.name,
      img: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg",
    };

    const canonicalUrl = `https://www.oekovolt.de/uber-uns/jobs/${title}`;

    const jobSchema = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "@id": `${canonicalUrl}/#jobposting`,
      title: job.title || job.name,
      description: job.description || `Stellenangebot bei Ökovolt Solartechnik: ${job.name}`,
      hiringOrganization: {
        "@type": "Organization",
        "@id": "https://www.oekovolt.de/#organization",
        name: "Ökovolt Deutschland",
        sameAs: "https://www.oekovolt.de",
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
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.oekovolt.de" },
        { "@type": "ListItem", position: 2, name: "Jobs", item: "https://www.oekovolt.de/uber-uns/jobs" },
        { "@type": "ListItem", position: 3, name: job.title || job.name, item: canonicalUrl },
      ],
    };

    return (
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <BannerSection data={bannerInfo} />
        <JobDetails jobData={job} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching job data:", error);
    return <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">Fehler beim Laden der Stellenanzeige.</div>;
  }
}