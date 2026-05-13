// Page Component
import { notFound } from "next/navigation";
import BannerSection from "@/components/Reusable/banner";
import JobDetails from "@/components/JobDetails/jobdetail";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { generateJobSlug } from "@/lib/slugify";

// Function to generate static paths
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`
    );
    const data = await res.json();

    // Check if data.message exists and is an array
    if (!data || !data.message || !Array.isArray(data.message)) {
      console.error("Invalid data structure:", data);
      return [];
    }

    const paths = data.message.map((project) => ({
      title: generateJobSlug(project.name),
    }));

    return paths;
  } catch (error) {
    console.error("Error fetching paths:", error);
    return [];
  }
}

// Function to generate metadata for SEO
export async function generateMetadata({ params }) {
  const { title } = await params;
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`
    );
    const data = await res.json();

    // Check if data.message exists
    if (!data || !data.message || !Array.isArray(data.message)) {
      console.error("Invalid data structure in generateMetadata:", data);
      return {
        title: "Jobs Not Found",
        description: "Unable to load jobs data.",
      };
    }

    // Find the matching project based on slugified title
    const project = data.message.find((p) => generateJobSlug(p.name) === title);

    if (!project) notFound();

    return {
      title: `${project.name} | Karriere bei Ökovolt`,
      description: `Stellenangebot: ${project.name} bei Ökovolt Solartechnik. Bewerben Sie sich jetzt für einen Job in der Photovoltaik-Branche.`,
      alternates: {
        canonical: `https://www.oekovolt.de/uber-uns/jobs/${title}`,
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Project Not Found",
      description: "The project you are looking for does not exist.",
    };
  }
}

// Page Component
export default async function ProjectDetailPage({ params }) {
  const { title } = await params;
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobs.api.jobsde_data`
    );
    const data = await res.json();

    // Check if data.message exists
    if (!data || !data.message || !Array.isArray(data.message)) {
      console.error("Invalid data structure in page component:", data);
      return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">
          Error loading jobs data. Please try again later.
        </div>
      );
    }

    const project = data.message.find((p) => generateJobSlug(p.name) === title);

    if (!project) {
      notFound();
    }

    const bannerInfo = {
      title: project.title || project.name,
      img: `/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg`,
    };

    return (
      <div>
        <BannerSection data={bannerInfo} />
        <JobDetails jobData={project} />
        {/* <GreenFeatureSection data={end} /> */}
      </div>
    );
  } catch (error) {
    console.error("Error fetching project data:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-red-500">
        Error loading the project page. Please try again later.
      </div>
    );
  }
}
