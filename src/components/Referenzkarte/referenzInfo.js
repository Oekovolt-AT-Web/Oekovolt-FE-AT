"use client";
import Slider from "react-slick";
import { Sun, Factory, ChartLine, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FadeInView from "@/components/Reusable/FadeInView";

import { getPartners } from "@/lib/api/partners/partners_api";
import { getProjectItem } from "@/lib/api/referenzen/project_item_api";

const CustomPrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute left-2 top-1/2 z-50 transform -translate-y-1/2 text-5xl text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md"
  >
    <ChevronLeft />
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    className="absolute right-2 top-1/2 z-50 transform -translate-y-1/2 text-5xl text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-md"
  >
    <ChevronRight />
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
        icon: <Sun className="text-[35px] text-[#669933]/90" />,
        value: toNumber(data?.pv_kraftwerke, 5000),
        label: "PV-Kraftwerke",
      },
      {
        icon: <Factory className="text-[35px] text-[#669933]/90" />,
        value: toNumber(data?.leistung, 340000),
        suffix: "kWp",
        label: "Leistung",
      },
      {
        icon: <ChartLine className="text-[35px] text-[#669933]/90" />,
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
  const sliderContainerRef = useRef(null);

  useEffect(() => {
    if (projectFrappe.length === 0 || !sliderContainerRef.current) return;
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
  }, [projectFrappe]);

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
          getPartners(),
          getProjectItem(),
        ]);

        const formattedPartners = (partnersRes?.message || []).map(
          (marke) => ({
            name: marke?.name1 || "",
            image: marke?.bild_anhagen || "",
            status: marke?.status || "",
          })
        );

        const formattedProjects = (projectsRes?.message || [])
          .slice(0, 3)
          .map((projekt) => ({
            title: projekt?.title || "",
            image: projekt?.bild_anhagen?.[0]?.bild_anhagen || "",
            leistung: projekt?.leistung || "",
            status: projekt?.status || "",
          }));

        setPartnersFrappe(formattedPartners);
        setProjectFrappe(formattedProjects);
      } catch (error) {
        console.error("Fehler:", error);
        setPartnersFrappe([]);
        setProjectFrappe([]);
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
              {data?.first_card_title}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
            </h2>
            <h2 className="text-3xl font-semibold text-gray-900 mt-10">
              {data?.first_card_subtitle}
            </h2>
          </div>
          <div className="text-gray-700 space-y-4 text-center text-[17px] max-w-4xl mx-auto">
            {data?.first_card_table?.map((item, key) => (
              <p key={key}>{item?.option}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Counter */}
      <div ref={countersRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-[#669933]">
              {counters[idx].toLocaleString()}
              {stat.suffix}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Projects Slider Section */}
      <FadeInView
        direction="bottom"
        distance={50}
        duration={800}
        className="mb-9 md:mb-17"
      >
        <div ref={sliderContainerRef}>
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
                      src={project?.image ? `/api/image?path=${project.image}` : "/Images/Jobs/jobs3.jpg"}
                      alt={project.title}
                      fill
                      className="rounded-lg object-cover"
                      sizes="(max-width: 450px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            href={"/referenzen/projekte"}
            className="flex items-center justify-center gap-2 bg-[#669933] hover:bg-[#669933]/90 text-white uppercase px-6 py-3 rounded-lg transition-colors duration-300 text-[14px]"
          >
            Weitere Projekte <ChevronRight />
          </Link>
        </div>
      </FadeInView>
    </div>
  );
}