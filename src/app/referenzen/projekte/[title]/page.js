export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import BannerSection from "@/components/Reusable/banner";
import ProjectDetailComponent from "@/components/ProjectItem/projectitem";
import BannerProject from "@/components/Reusable/bannerproject";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

// Consistent slug generation function
export function generateSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // heq aksentet
    .replace(/[\s–—]+/g, "-") // hapësira dhe lloje të ndryshme të dash
    .replace(/\//g, "-")
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9-]/g, "") // largon karaktere të tjera
    .replace(/-+/g, "-") // bashkon `--` në një `-`
    .replace(/^-+|-+$/g, ""); // heq `-` nga fillimi ose fundi
}


export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projektede.api.projektede_data`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) throw new Error('Failed to fetch projects');
    
    const data = await res.json();
    
    if (!data?.message) return [];
    
    return data.message.map((project) => ({
      title: generateSlug(project.title || project.name)
    }));
    
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projektede.api.projektede_data`,
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
  
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projektede.api.projektede_data`,
      { next: { revalidate: 3600 } }
    );
    
    const data = await res.json();
    
 const project = data.message.find((p) => {
      const projectSlug = generateSlug(p.title || p.name);
      // console.log(`Comparing: ${projectSlug} === ${title}`);
      return projectSlug === title;
    });
    
    // if (!project) {
    //   console.log("No match found for title:", title);
    //   notFound();
    // }

// console.log("Param Title:", title);
// console.log("Available slugs:", data.message.map(p => generateSlug(p.title || p.name)));


    
     if (!project) {
      console.log("No match found");
      notFound();
    }
    // Get related projects
    const getRandomItems = (array, count, excludeSlug) => {
      const filtered = array.filter(item => 
        generateSlug(item.title) !== excludeSlug &&
        generateSlug(item.name) !== excludeSlug
      );
      return [...filtered]
        .sort(() => 0.5 - Math.random())
        .slice(0, count);
    };
    
    const currentSlug = generateSlug(project.title || project.name);
    const relatedProjects = getRandomItems(data.message, 3, currentSlug);
    
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
    
  } catch (error) {
    console.error('Error loading project:', error);
    notFound();
  }
}