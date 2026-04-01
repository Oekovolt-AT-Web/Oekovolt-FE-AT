"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaSolarPanel } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

// Slug function inside same file
function generateSlug(title) {
  if (!title) return "";
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

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/referenzen/projekte/${generateSlug(project.location)}`}
      className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full ">
        <Image
          src={`${API_IMG_URL}${project?.image}`}
          alt={`Project - ${project?.location}`}
          fill
          className={`transition-all duration-500 object-cover object-center ${
            isHovered ? "scale-110 blur-[1px]" : "scale-100 blur-0"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div
          className={`transition-all duration-500 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h3 className="text-white text-lg font-semibold">{project?.location}</h3>
        </div>
      </div>
    </Link>
  );
};

const ProjectsSection = ({ data }) => {
  const [marken, setMarken] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  const totalPages = Math.ceil(marken.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = marken.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const element = document.getElementById("projects-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Pagination range helper — returns an array of page numbers and 'DOTS' placeholders
  const getPaginationRange = (total, current, siblingCount = 1) => {
    const DOTS = "DOTS";
    // Only show all pages when there are 5 or fewer; otherwise always use dots
    const threshold = siblingCount * 2 + 3; // = 5 with default siblingCount

    if (total <= threshold) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(current - siblingCount, 2);
    const rightSiblingIndex = Math.min(current + siblingCount, total - 1);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < total - 1;

    const pages = [];

    pages.push(1);

    if (shouldShowLeftDots) pages.push(DOTS);

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    if (shouldShowRightDots) pages.push(DOTS);

    pages.push(total);

    return pages;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`
        );
        if (!response.ok) throw new Error("Gabim gjate marrjes se te dhenave");
        const data = await response.json();
        const formattedEvents = data.message.slice().map((marke) => ({
          location: marke?.title,
          image: marke?.bild_anhagen[0]?.bild_anhagen,
          status: marke?.status,
          capacity: marke?.leistung,
        }));
        setMarken(formattedEvents);
      } catch (error) {
        console.error("Gabim gjate marrjes se ngjarjeve:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12" id="projects-section">
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-6">
            <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-[18px]">
              {data.first_card_title}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
            </h2>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-6">
              {data.first_card_subtitle}
            </h2>
          </div>
          <div className="prose prose-lg text-gray-600 space-y-4 text-center text-[18px]">
            {data.first_card_table?.map((item, key) => (
              <p key={key}>{item.option}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 mb-9 md:mb-17">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center gap-1.5" aria-label="Pagination">
              {/* Previous */}
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 px-4 rounded-md border border-gray-300 bg-white text-gray-600 text-sm font-medium transition-colors duration-150 hover:border-[#669933] hover:text-[#669933] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 cursor-pointer select-none"
                aria-label="Previous page"
              >
                Previous
              </button>

              {/* Page numbers */}
              {getPaginationRange(totalPages, currentPage).map((item, idx) => {
                if (item === "DOTS") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="flex items-center justify-center w-9 h-9 text-gray-400 text-sm select-none"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={item}
                    onClick={() => paginate(item)}
                    aria-current={currentPage === item ? "page" : undefined}
                    className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#669933] ${
                      currentPage === item
                        ? "bg-[#669933] text-white border border-[#669933]"
                        : "bg-white border border-gray-300 text-gray-600 hover:border-[#669933] hover:text-[#669933]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 px-4 rounded-md border border-gray-300 bg-white text-gray-600 text-sm font-medium transition-colors duration-150 hover:border-[#669933] hover:text-[#669933] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 cursor-pointer select-none"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsSection;
