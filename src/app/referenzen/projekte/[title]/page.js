import { notFound } from "next/navigation";
import ProjectDetailComponent from "@/components/ProjectItem/projectitem";
import BannerProject from "@/components/Reusable/bannerproject";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { generateSlug } from "@/lib/slugify";

const PROJECTS_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const res = await fetch(PROJECTS_URL, { next: { revalidate: 3600 } });
    const data = await res.json();
    const project = data.message?.find(p => generateSlug(p.title) === title || generateSlug(p.name) === title);

    if (!project) return { title: "Projekt nicht gefunden | Ökovolt", robots: { index: false } };

    const projectTitle = project.title || project.name;
    const description = project.description || `Photovoltaik-Referenzprojekt: ${projectTitle} – realisiert von Ökovolt Solartechnik.`;
    const canonical = `https://www.oekovolt.de/referenzen/projekte/${title}`;
    const imgUrl = project?.bild_anhagen?.[0]?.bild_anhagen
      ? `${API_IMG_URL}${project.bild_anhagen[0].bild_anhagen}`
      : "/Logo-Oekovolt-Gruen-mit-Weiss.webp";

    return {
      title: `${projectTitle} | Referenzprojekt Ökovolt`,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        type: "article", locale: "de_DE", url: canonical, siteName: "Ökovolt Deutschland",
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
  } catch {
    return { title: "Projekt nicht gefunden | Ökovolt", robots: { index: false } };
  }
}

export default async function ProjectDetailPage({ params }) {
  const { title } = await params;
  let project = null;
  let relatedProjects = [];

  try {
    const res = await fetch(PROJECTS_URL, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    project = data.message?.find((p) => generateSlug(p.title || p.name) === title) ?? null;

    if (project) {
      const currentSlug = generateSlug(project.title || project.name);
      const filtered = data.message.filter((item) => generateSlug(item.title || item.name) !== currentSlug);
      relatedProjects = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 3);
    }
  } catch (error) {
    console.error("Error loading project:", error);
  }

  if (!project) notFound();

  const bannerInfo = {
    title: project.title || project.name,
    img: `${API_IMG_URL}${project?.bild_anhagen?.[0]?.bild_anhagen}`,
  };

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title || project.name,
    description: project.description || `Photovoltaik-Referenzprojekt von Ökovolt Solartechnik.`,
    url: `https://www.oekovolt.de/referenzen/projekte/${title}`,
    publisher: { "@id": "https://www.oekovolt.de/#organization" },
    dateModified: project.modified || new Date().toISOString(),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }} />
      <BannerProject data={bannerInfo} />
      <ProjectDetailComponent project={project} related={relatedProjects} />
    </div>
  );
}