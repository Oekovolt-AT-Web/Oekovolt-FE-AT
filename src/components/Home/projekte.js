"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { generateSlug } from "@/lib/slugify";

const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-2 top-1/2 z-50 transform -translate-y-1/2 text-5xl text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md"
  >
    <FaAngleLeft />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 top-1/2 z-50 transform -translate-y-1/2 text-5xl text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md"
  >
    <FaAngleRight />
  </div>
);

export default function ProjectsSection({ data }) {
  const [projects, setProjects] = useState([]);
  const sliderContainerRef = useRef(null);

  useEffect(() => {
    if (projects.length === 0 || !sliderContainerRef.current) return;
    const container = sliderContainerRef.current;
    const applyTabIndex = () => {
      container
        .querySelectorAll('.slick-slide[aria-hidden="true"] a, .slick-slide[aria-hidden="true"] button')
        .forEach((el) => el.setAttribute('tabindex', '-1'));
      container
        .querySelectorAll('.slick-slide:not([aria-hidden="true"]) a, .slick-slide:not([aria-hidden="true"]) button')
        .forEach((el) => el.removeAttribute('tabindex'));
    };
    const observer = new MutationObserver(applyTabIndex);
    observer.observe(container, { subtree: true, attributes: true, attributeFilter: ['aria-hidden'] });
    applyTabIndex();
    return () => observer.disconnect();
  }, [projects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`,
        );
        if (!res.ok) throw new Error("Fehler beim Laden der Projekte");
        const json = await res.json();

        const formatted = json.message
          .filter((p) => p.status === "Aktiv")
          .map((projekt) => ({
            title: projekt.title,
            slug: generateSlug(projekt.title),
            image: projekt.bild_anhagen?.[0]?.bild_anhagen,
            leistung: projekt.leistung,
            status: projekt.status,
          }))
          .slice(0, 3);

        setProjects(formatted);
      } catch (error) {
        console.error("Fehler:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mb-9 md:mb-17 max-w-7xl mx-auto px-6 md:px-12 overflow-hidden"
    >
      <div className="text-center flex flex-col items-center justify-center">
        <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-lg">
          Projekte
          <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
        </h2>
        <p className="text-center text-black-500 mx-auto mb-6 md:mb-12 lg:text-[30px] text-2xl md:text-3xl font-bold mt-6">
          {data.projekte_title}
        </p>
      </div>

      <div ref={sliderContainerRef}>
        <Slider
          {...{
            dots: false,
            infinite: true,
            speed: 700,
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: true,
            nextArrow: <CustomNextArrow />,
            prevArrow: <CustomPrevArrow />,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 768, settings: { slidesToShow: 2 } },
              { breakpoint: 450, settings: { slidesToShow: 1 } },
            ],
          }}
          className="mb-12 relative"
        >
          {projects.map((project, i) => (
            <div key={i} className="px-5">
              <Link
                href={`/referenzen/projekte/${generateSlug(project.title)}`}
                className="relative block group overflow-hidden rounded-lg h-[320px] sm:h-[360px] md:h-[420px] lg:h-[460px] transform transition-all duration-700"
              >
                <div className="absolute inset-0">
                  <Image
                    src={`${API_IMG_URL}${project.image}`}
                    alt={`Referenzprojekt: ${project.title} – Photovoltaikanlage von Ökovolt${project.leistung ? ` (${project.leistung})` : ""}`}
                    fill
                    sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
                    className="object-cover rounded-lg"
                    priority={i === 0}
                    title={project.title}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="transition-all duration-500 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                    <h3 className="text-white text-lg font-semibold">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>

      <div className="text-center flex flex-row items-center justify-center mt-4">
        <Link
          href="/referenzen/projekte"
          className="flex items-center justify-center gap-2 bg-[#669933] hover:bg-[#669933]/90 text-white uppercase px-6 py-3 rounded-lg transition-colors duration-300 text-[14px]"
        >
          Weitere Projekte <FaAngleRight />
        </Link>
      </div>
    </motion.div>
  );
}
