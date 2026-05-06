export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import BannerSection from "@/components/Reusable/banner";
import ProjectDetailComponent from "@/components/ProjectItem/projectitem";
import BannerProject from "@/components/Reusable/bannerproject";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

// Consistent slug generation function
function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s–—]+/g, "-")
    .replace(/\//g, "-")
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`,
      { next: { revalidate: 3600 } }
    );
    
    const data = await res.json();
    
    // Find project by comparing slugs
    const project = data.message?.find(p => 
      generateSlug(p.title) === title || 
      generateSlug(p.name) === title
    );
    
    if (!project) return {
      title: 'Project Not Found',
      description: 'The requested project could not be found'
    };
    
    return {
      title: project.title || project.name,
      description: project.description || `Details about ${project.title || project.name} project`,
    };
    
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Project Error',
      description: 'Error loading project information'
    };
  }
}

export default async function ProjectDetailPage({ params }) {
  const { title } = await params;

  let project = null;
  let relatedProjects = [];

  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch projects");

    const data = await res.json();

    project = data.message?.find((p) => generateSlug(p.title || p.name) === title) ?? null;

    if (project) {
      const currentSlug = generateSlug(project.title || project.name);
      const filtered = data.message.filter(
        (item) => generateSlug(item.title || item.name) !== currentSlug
      );
      relatedProjects = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);
    }
  } catch (error) {
    console.error("Error loading project:", error);
  }

  if (!project) {
    notFound();
  }

  const bannerInfo = {
    title: project.title || project.name,
    img: `${API_IMG_URL}${project?.bild_anhagen?.[0]?.bild_anhagen}`,
  };

  return (
    <div>
      <BannerProject data={bannerInfo} />
      <ProjectDetailComponent
        project={project}
        related={relatedProjects}
      />
    </div>
  );
}