// src/app/referenzen/projekte/[title]/page.js

import { notFound } from "next/navigation";
import ProjectDetailComponent from "@/components/ProjectItem/projectitem";
import BannerProject from "@/components/Reusable/bannerproject";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { generateSlug } from "@/lib/slugify";

const PROJECTS_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;
const BASE_URL = "https://www.oekovolt.de";

// Helper function to fetch all projects
async function fetchAllProjects() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return [];
  }

  try {
    const headers = getApiHeaders();

    const res = await fetch(PROJECTS_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 3600 } // ISR: Revalidate every hour
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
    return data?.message || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Generate static params at build time - this enables static generation
export async function generateStaticParams() {
  try {
    const projects = await fetchAllProjects();

    if (!projects || projects.length === 0) {
      console.warn("⚠️ No projects found - returning empty params");
      return [];
    }

    const params = projects.map((project) => ({
      title: generateSlug(project.title || project.name)
    })).filter(param => param.title);

    console.log(`✅ Generated ${params.length} project params`);
    return params;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const projects = await fetchAllProjects();
    const project = projects.find(p => generateSlug(p.title) === title || generateSlug(p.name) === title);

    if (!project) {
      return {
        title: "Projekt nicht gefunden | Ökovolt",
        robots: { index: false }
      };
    }

    const projectTitle = project.title || project.name;
    const description = project.description || `Photovoltaik-Referenzprojekt: ${projectTitle} – realisiert von Ökovolt Solartechnik.`;
    const canonical = `${BASE_URL}/referenzen/projekte/${title}`;
    const imgUrl = project?.bild_anhagen?.[0]?.bild_anhagen
      ? `/api/image?path=${project.bild_anhagen[0].bild_anhagen}`
      : "/Logo-Oekovolt-Gruen-mit-Weiss.webp";

    return {
      title: `${projectTitle} | Referenzprojekt Ökovolt`,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        type: "article",
        locale: "de_DE",
        url: canonical,
        siteName: "Ökovolt Deutschland",
        title: `${projectTitle} | Referenzprojekt Ökovolt`,
        description,
        images: [{ url: imgUrl, width: 1200, height: 630, alt: projectTitle }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${projectTitle} | Referenzprojekt Ökovolt`,
        description,
        images: [imgUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Projekt nicht gefunden | Ökovolt",
      robots: { index: false }
    };
  }
}

export default async function ProjectDetailPage({ params }) {
  const { title } = await params;

  // Fetch all projects
  const projects = await fetchAllProjects();

  // Find the current project
  const project = projects.find((p) => generateSlug(p.title || p.name) === title) ?? null;

  // Handle related projects
  let relatedProjects = [];
  if (project) {
    const currentSlug = generateSlug(project.title || project.name);
    const filtered = projects.filter((item) => generateSlug(item.title || item.name) !== currentSlug);
    relatedProjects = [...filtered].slice(0, 3);
  }

  if (!project) notFound();

  const bannerInfo = {
    title: project.title || project.name,
    img: project?.bild_anhagen?.[0]?.bild_anhagen ? `/api/image?path=${project?.bild_anhagen?.[0]?.bild_anhagen}` : "/Images/Jobs/jobs3.jpg",
  };

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title || project.name,
    description: project.description || `Photovoltaik-Referenzprojekt von Ökovolt Solartechnik.`,
    url: `${BASE_URL}/referenzen/projekte/${generateSlug(title)}`,
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: project.modified || new Date().toISOString(),
    ...(project.bild_anhagen?.[0]?.bild_anhagen && {
      image: project?.bild_anhagen?.[0]?.bild_anhagen ? `/api/image?path=${project?.bild_anhagen?.[0]?.bild_anhagen}` : "/Images/Jobs/jobs3.jpg",

    }),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <BannerProject data={bannerInfo} />
      <ProjectDetailComponent project={project} related={relatedProjects} />
    </div>
  );
}