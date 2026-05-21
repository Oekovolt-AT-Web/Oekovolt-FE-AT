"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaChevronRight, FaCheckCircle, FaSolarPanel } from "react-icons/fa";
import Link from "next/link";
import { motion } from "framer-motion";


// Counter hook
const useCounter = (target, speed = 50) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCount(current);
    }, speed);
    return () => clearInterval(interval);
  }, [target, speed]);
  return count;
};

const SolvixBanner = ({ data }) => {
  if (!data) return null;

  return (
    <section className="w-full px-4 md:px-12 py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 space-y-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-[#669933] uppercase tracking-wide"
          >
            {data.photovoltaik_description || ""}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl leading-tight text-gray-900"
          >
            {data.photovoltaik_title || ""}
          </motion.h1>

          <div className="space-y-4">
            {data.photovoltaik_options?.map((opt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex gap-3 items-start"
              >
                <FaCheckCircle className="text-[#669933] w-5 h-5 mt-1" />
                <p className="text-gray-700 text-lg leading-relaxed">
                  {opt.first_header_options || ""}{" "}
                  {opt.second_text_paragraph || ""}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-[#f5fce9] rounded-xl p-6 mt-8 grid md:grid-cols-3 gap-6 text-center text-[#003473]"
          >
            <motion.div whileHover={{ scale: 1.05 }}>
              <h3 className="text-3xl font-semibold text-[#669933]">
                {data?.first_statistic_value?.toLocaleString("de-DE")}
                {data?.first_value_suffix || ""}
              </h3>
              <p>{data.first_statistic_title || ""}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <h3 className="text-3xl font-semibold text-[#669933]">
                {data?.second_statistic_value?.toLocaleString("de-DE")}
                {data?.second_value_suffix || ""}
              </h3>
              <p>{data?.second_statistic_title || ""}</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <h3 className="text-3xl font-semibold text-[#669933]">
                {data?.third_statistic_value?.toLocaleString("de-DE")}{" "}
                {data?.third_value_suffix || ""}
              </h3>
              <p>{data?.third_statistic_title || ""}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 relative lg:h-[520px] h-80"
        >
          <Image
            src={data?.photovoltaik_banner_image ? `/api/image?path=${data?.photovoltaik_banner_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.photovoltaik_alt_banner_image || "Photovoltaik"}
            fill
            className="rounded-2xl object-cover"
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <motion.div
            className="hidden md:flex absolute bottom-4 left-0 bg-white rounded-lg shadow-xl p-4 w-64  items-center gap-4 moving-box"
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            animate={{ x: ["130%", "150%", "130%"] }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <div className="flex items-center justify-center rounded-full text-white">
              <FaSolarPanel className="text-xl text-[#669933] w-10 h-10" />
            </div>
            <p className="text-sm text-gray-800 font-medium">
              Entdecken Sie die Kraft der Solartechnologie.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Inline animation style */}
      <style jsx>{`
        .moving-box {
          animation: slideX 4s ease-in-out infinite;
        }

        @keyframes slideX {
          0% {
            transform: translateX(130%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(130%);
          }
        }
      `}</style>
    </section>
  );
};

export default SolvixBanner;
