"use client";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaSolarPanel,
  FaIndustry,
  FaChartLine,
} from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

export default function Partners({ data }) {
   const stats = useMemo(() => [
    {
      icon: <FaSolarPanel className="text-[35px] text-[#669933]/90" />,
      value: 5000,
      label: "PV-Kraftwerke",
    },
    {
      icon: <FaIndustry className="text-[35px] text-[#669933]/90" />,
      value: 340000,
      suffix: "kWp",
      label: "Leistung",
    },
    {
      icon: <FaChartLine className="text-[35px] text-[#669933]/90" />,
      value: 112000,
      suffix: "t",
      label: "Co2-Einsparung",
    },
  ], []);

  const [counters, setCounters] = useState(stats.map(() => 0));
  const countersRef = useRef(null);
  const animationRef = useRef(null);
  const [partnersFrappe, setPartnersFrappe] = useState([]);

  useEffect(() => {
    const startCounters = () => {
      const duration = 3000;
      const startTime = performance.now();

      const animateCounters = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        const newCounters = stats.map((stat, i) => {
          const value = stat.value;
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
      { threshold: 0.1 }
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
        const partnersRes = await fetch(
          `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.partnersde.api.partnersde_data`
        );

        if (!partnersRes.ok)
          throw new Error("Fehler beim Laden der Partnerdaten");

        const partnersData = await partnersRes.json();

        const formattedPartners = partnersData.message.map((marke) => ({
          name: marke.name1,
          image: marke.bild_anhagen,
          status: marke.status,
        }));

        setPartnersFrappe(formattedPartners);
      } catch (error) {
        console.error("Fehler:", error);
      }
    };

    fetchData();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, autoplay: true } },
      { breakpoint: 768, settings: { slidesToShow: 2, autoplay: true } },
      { breakpoint: 468, settings: { slidesToShow: 1, autoplay: true } },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden">
      {/* Partners Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-6">
          <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-lg">
            PARTNERS
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
          </h2>
          <p className="text-center text-black-500 mx-auto lg:text-[30px] text-2xl md:text-3xl font-bold mb-6 mt-6">
            {data.partners_title}
          </p>
        </div>

        <Slider {...sliderSettings} className="mt-6">
          {partnersFrappe.map((partner, index) => (
            <div key={index} className="px-2">
              <div className="flex items-center justify-center h-40 transition-transform duration-500 hover:scale-105">
                <Image
                  src={`${API_IMG_URL}${partner.image}`}
                  alt={partner.name}
                  width={200}
                  height={160}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </Slider>
      </motion.div>
    </div>
  );
}
