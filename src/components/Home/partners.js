"use client";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

export default function SolutionsPage({ data }) {
  const [partnersFrappe, setPartnersFrappe] = useState([]);

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

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden">
      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-2xl md:text-2xl lg:text-2xl font-[500] text-gray-900 mb-6">
          {data.photovoltaiklösungen_title}
        </h2>
      </motion.div>

    </div>
  );
}
