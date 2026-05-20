"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaSolarPanel, FaPlug, FaLeaf } from "react-icons/fa";
import Image from "next/image";


export default function RotatingImageSection({ data = {} }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(240);
  const [iconSize, setIconSize] = useState(66);

  // Safely get data with defaults
  const message = data || {};
  const firstCardImages = message.first_card_images || [];
  const firstCardOptions = message.first_card_options || [];

  // Dynamic data from API with fallbacks
  const images = firstCardImages.length > 0
    ? firstCardImages.map(img => `/api/image?path=${img.image}`)
    : "/Images/Jobs/jobs3.jpg";

  const icons = [
    { icon: FaSolarPanel, color: "text-white" },
    { icon: FaPlug, color: "text-white" },
    { icon: FaLeaf, color: "text-white" },
  ];

  const items = firstCardOptions.length > 0
    ? firstCardOptions.map(item => ({
      name: item?.primary_paragraph || "",
      description: item?.secondary_paragraph || ""
    }))
    : [
      {
        name: "Individuelle Photovoltaikanlagen",
        description: "Perfekte Abstimmung auf Ihren Energiebedarf",
      },
      {
        name: "Alles aus einer Hand",
        description: "Von der Planung bis zur Inbetriebnahme Ihrer PV-Anlage",
      },
    ];

  const title = message.first_card_title || "WILLKOMMEN BEI ÖKOVOLT SOLARTECHNIK";
  const subtitle = message.first_card_subtitle || "Ihr Experte für Photovoltaik in Deutschland – seit über 15 Jahren.";
  const description = message.first_card_description || "Wir sind spezialisiert auf die Planung und Umsetzung leistungsstarker Photovoltaikanlagen für Gewerbe, Industrie, Kommunen und Privathaushalte. Unsere Lösungen bieten maximale Effizienz, höchste Qualität und Energieunabhängigkeit.";

  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadius(160);
        setIconSize(56);
      } else if (width < 1024) {
        setRadius(160);
        setIconSize(56);
      } else {
        setRadius(240);
        setIconSize(52);
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % icons.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [icons.length]);

  const getIconPosition = (index) => {
    const totalIcons = icons.length;
    const baseAngle = index * (360 / totalIcons);
    const rotationOffset = -activeIndex * (360 / totalIcons);
    const finalAngle = baseAngle + rotationOffset - 90;
    const angleRad = (finalAngle * Math.PI) / 180;

    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);
    return { x, y, zIndex: index === activeIndex ? 10 : 1 };
  };

  const containerSize = (radius + iconSize / 2) * 2 + 20;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-15 overflow-hidden" >
      <div className="flex flex-col lg:flex-row items-center gap-5">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex items-center justify-center mx-auto"
          style={{
            width: `${containerSize}px`,
            height: `${containerSize}px`,
            maxWidth: "100%",
          }}
        >
          {images.length > 0 && (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden border-[8px] border-gray-200 shadow-lg z-0"
              style={{
                width: radius * 1.7,
                height: radius * 1.7,
                maxWidth: "90vw",
                maxHeight: "90vw",
              }}
            >
              <Image
                fill
                src={images[activeIndex % images.length]}
                alt={firstCardImages[activeIndex % images.length]?.alt_text || "Solar Image"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
          <svg
            className="absolute top-0 left-0 w-full h-full z-[5]"
            viewBox={`0 0 ${containerSize} ${containerSize}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx={containerSize / 2}
              cy={containerSize / 2}
              r={radius}
              fill="none"
              stroke="#669933"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          {icons.map(({ icon: Icon }, index) => {
            const { x, y } = getIconPosition(index);
            const isActive = index === activeIndex;
            return (
              <motion.div
                key={index}
                className={`absolute top-1/2 z-[10] left-1/2 flex items-center justify-center rounded-full shadow-lg cursor-pointer border-2 
                ${isActive ? "bg-[#023a51] border-[#023a51]" : "bg-[#669933] border-[#669933]"}`}
                style={{
                  width: `${iconSize}px`,
                  height: `${iconSize}px`,
                  marginLeft: `-${iconSize / 2}px`,
                  marginTop: `-${iconSize / 2}px`,
                  zIndex: "10",
                }}
                onClick={() => setActiveIndex(index)}
                whileHover={{ scale: 1.15 }}
                animate={{
                  x,
                  y,
                  scale: isActive ? 1.1 : 1,
                  transition: {
                    x: { type: "tween", duration: 0.8, ease: "linear" },
                    y: { type: "tween", duration: 0.8, ease: "linear" },
                    scale: { type: "spring", stiffness: 200, damping: 15 },
                  },
                }}
              >
                <Icon className="text-white text-2xl" />
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-4 w-full lg:w-1/2"
        >
          <div>
            <h2 className="text-[#4d7a1a] text-lg font-semibold uppercase">
              {title}
            </h2>
            <div className="h-0.5 w-20 bg-[#4d7a1a] mt-1"></div>
          </div>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-[1.5]">
            {subtitle}
          </p>
          <p className="text-black text-[18px] leading-[1.7]">
            {description}
          </p>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8"
            >
              {items.map((item, i) => (
                <div key={i}>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 p-0 m-0 rounded-full bg-[#669933] flex items-center justify-center">
                      <FaCheck className="text-white text-[12px]" />
                    </div>
                    <span className="font-[500] text-[18px] leading-[1.7]">{item.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 pl-12 mt-3 text-[18px] leading-[1.7]">
                    {item.description}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}