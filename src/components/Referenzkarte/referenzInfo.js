"use client";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaSolarPanel, FaIndustry, FaChartLine } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useMemo, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

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

export default function SolutionsPage({ data }) {
  const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const stats = useMemo(
    () => [
      {
        icon: <FaSolarPanel className="text-[35px] text-[#669933]/90" />,
        value: toNumber(data?.pv_kraftwerke, 5000),
        label: "PV-Kraftwerke",
      },
      {
        icon: <FaIndustry className="text-[35px] text-[#669933]/90" />,
        value: toNumber(data?.leistung, 340000),
        suffix: "kWp",
        label: "Leistung",
      },
      {
        icon: <FaChartLine className="text-[35px] text-[#669933]/90" />,
        value: toNumber(data?.co2_einsparung, 112000),
        suffix: "t",
        label: "Co2-Einsparung",
      },
    ],
    [data?.pv_kraftwerke, data?.leistung, data?.co2_einsparung],
  );

  const [counters, setCounters] = useState(stats.map(() => 0));
  const countersRef = useRef(null);
  const animationRef = useRef(null);
  const [partnersFrappe, setPartnersFrappe] = useState([]);
  const [projectFrappe, setProjectFrappe] = useState([]);

  useEffect(() => {
    const startCounters = () => {
      const duration = 3000;
      const startTime = performance.now();

      const animateCounters = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const newCounters = stats.map((stat, i) => {
          const value = stats[i].value;
          return Math.floor(progress * value);
        });

        setCounters(newCounters);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateCounters);
        }
      };

      animationRef.current = requestAnimationFrame(animateCounters);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stats]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnersRes, projectsRes] = await Promise.all([
          fetch(
            `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.partnersde.api.partnersde_data`,
          ),
          fetch(
            `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projektede.api.projektede_data`,
          ),
        ]);

        if (!partnersRes.ok || !projectsRes.ok)
          throw new Error("Fehler beim Laden der Daten");

        const partnersData = await partnersRes.json();
        const projectsData = await projectsRes.json();

        const formattedPartners = partnersData.message.map((marke) => ({
          name: marke.name1,
          image: marke.bild_anhagen,
          status: marke.status,
        }));

        const formattedProjects = projectsData.message
          .slice(0, 3)
          .map((projekt) => ({
            title: projekt.title,
            image: projekt.bild_anhagen[0]?.bild_anhagen,
            leistung: projekt.leistung,
            status: projekt.status,
          }));

        setPartnersFrappe(formattedPartners);
        setProjectFrappe(formattedProjects);
      } catch (error) {
        console.error("Fehler:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      {/* First Card Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-[18px]">
              {data.first_card_title}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
            </h2>
            <h2 className="text-3xl font-semibold text-gray-900 mt-10">
              {data.first_card_subtitle}
            </h2>
          </div>
          <div className="text-gray-700 space-y-4 text-center text-[17px] max-w-4xl mx-auto">
            {data.first_card_table?.map((item, key) => (
              <p key={key}>{item.option}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Slider Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-9 md:mb-17"
      >
        <Slider
          {...{
            dots: false,
            infinite: true,
            speed: 700,
            slidesToShow: 3,
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
          {projectFrappe.map((project, i) => (
            <div key={i} className="px-5">
              <Link
                href={`/referenzen/projekte/${project.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/\//g, "-")
                  .replace(/[ä]/g, "ae")
                  .replace(/[ö]/g, "oe")
                  .replace(/[ü]/g, "ue")
                  .replace(/[ß]/g, "ss")
                  .replace(/[^a-z0-9-]/g, "")}`}
                className="relative group overflow-hidden rounded-lg h-100 transform transition-all duration-700"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={`${API_IMG_URL}${project.image}`}
                    alt={project.title}
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 450px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="transition-all duration-500 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
                    <h3 className="text-white text-xl font-semibold">
                      {project.title}
                    </h3>
                    <div className="flex items-center text-white gap-2 mt-2 text-[16px]">
                      <FaSolarPanel className="text-[#ffde59]" />
                      <span>{project.leistung}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>

        <div className="text-center flex flex-row items-center justify-center mt-4">
          <Link
            href={"/referenzen/projekte"}
            className="flex items-center justify-center gap-2 bg-[#669933] hover:bg-[#669933]/90 text-white uppercase px-6 py-3 rounded-lg transition-colors duration-300 text-[14px]"
          >
            Weitere Projekte <FaAngleRight />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
