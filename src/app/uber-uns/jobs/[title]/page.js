// Page Component
import { notFound } from "next/navigation";
import BannerSection from "@/components/Reusable/banner";
import ProjectDetailComponent from "@/components/ProjectItem/projectitem";
import JobDetails from "@/components/JobDetails/jobdetail";
import GreenFeatureSection from "@/components/Reusable/contactInfo";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

// Function to slugify the title manually
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9-]/g, ""); // Remove other special characters
}

// Function to generate static paths
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobsde.api.jobsde_data`
    );
    const data = await res.json();

    // Check if data.message exists and is an array
    if (!data || !data.message || !Array.isArray(data.message)) {
      console.error("Invalid data structure:", data);
      return [];
    }

    const paths = data.message.map((project) => ({
      title: generateSlug(project.name),
    }));

    console.log("Generated Static Paths:", paths);

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
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobsde.api.jobsde_data`
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
    const project = data.message.find((p) => generateSlug(p.name) === title);

    if (!project) notFound();

    return {
      title: project.name,
      description: `Learn more about ${project.name} jobs`,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Project Not Found",
      description: "The project you are looking for does not exist.",
    };
  }
}

// ... keep your generateStaticParams and generateMetadata functions the same ...

// Page Component
export default async function ProjectDetailPage({ params }) {
  const { title } = await params;
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobsde.api.jobsde_data`
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

    const project = data.message.find((p) => generateSlug(p.name) === title);

    if (!project) {
      console.log("No match found!");
      notFound();
    }

    const bannerInfo = {
      title: project.title || project.name, // Use project.name if title is undefined
      img: `/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg`,
    };

    
  const end={
    greentitle:"Solaranlage sichern",
    title:"Jetzt Kontakt aufnehmen & Solaranlage sichern",
    description:"Interessiert an einer maßgeschneiderten Photovoltaikanlage für Ihr Zuhause oder Unternehmen? Füllen Sie unser Kontaktformular aus oder rufen Sie uns direkt an! Unser Expertenteam berät Sie persönlich und individuell."
  }

    return (
      <div>
        {/* Project Header */}
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
