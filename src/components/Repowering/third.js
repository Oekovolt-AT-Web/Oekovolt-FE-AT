"use client";

import { motion } from "framer-motion";
import { CheckCircle2, BarChart3, MonitorSmartphone } from "lucide-react";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import Image from "next/image"; // ✅ Import Next.js Image

const icons = [BarChart3, MonitorSmartphone, CheckCircle2];

const PhotovoltaikOptimization = ({ data }) => {
  return (
    <section className="py-10 md:py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl text-gray-900"
        >
          {data.second_card_title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-gray-700 text-lg leading-relaxed mt-5"
        >
          {data.second_card_description}
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start mt-10">
        {/* Left Side: Image and Text */}
        <div className="w-full lg:w-1/2 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg relative"
          >
            <Image
              src={`${API_IMG_URL}${data.second_card_image}`}
              alt={data.second_card_alt_text || "Photovoltaik image"}
              fill
              className="object-cover object-center"
              priority
                    sizes=" 100vw"
            />
          </motion.div>
        </div>

        {/* Right Side: Feature Boxes */}
        <div className="w-full lg:w-1/2 space-y-6">
          {data.second_card_options.map((option, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start gap-4 bg-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="min-w-[48px] h-12 w-12 flex items-center justify-center rounded-full bg-[#669933]/10 text-[#669933] shadow-sm">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg text-[#333]">
                    {option.primary_paragraph}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    {option.secondary_paragraph}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhotovoltaikOptimization;
