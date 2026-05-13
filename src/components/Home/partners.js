"use client";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";

export default function PartnersSection({ data }) {
  const [partners, setPartners] = useState([]);

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
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 468, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.partners.api.partnersde_data`
        );
        if (!res.ok) throw new Error("Fehler beim Laden der Partnerdaten");
        const json = await res.json();
        setPartners(
          json.message.map((p) => ({
            name: p.name1,
            image: p.bild_anhagen,
          }))
        );
      } catch (error) {
        console.error("Fehler:", error);
      }
    };
    fetchPartners();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden pb-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-[500] text-gray-900 mb-6">
          {data?.photovoltaiklösungen_title}
        </h2>
      </motion.div>

      {partners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Slider {...sliderSettings}>
            {partners.map((partner, i) => (
              <div key={i} className="px-4">
                <div className="relative h-16 w-full">
                  <Image
                    src={`${API_IMG_URL}${partner.image}`}
                    alt={partner.name || "Partner"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 468px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </motion.div>
      )}
    </div>
  );
}
