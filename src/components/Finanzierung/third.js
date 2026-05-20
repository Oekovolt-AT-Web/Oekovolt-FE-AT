"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lightbulb, Euro, Home, Leaf } from "lucide-react";



const FinancingBenefitsSection = ({ data }) => {
  return (
    <section className="w-full">
      {data.finanzierung_second_card_table.map((item, index) => (
        <div
          key={index}
          className={`w-full ${
            index % 2 === 1 ? "bg-white" : "bg-gray-100"
          } py-10 md:py-16 px-6 md:px-12`}
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Alternate layout direction */}
            <div
              className={`flex flex-col-reverse w-full ${
                index % 2 === 0
                  ? "lg:flex-row"
                  : "lg:flex-row-reverse"
              } items-center gap-12`}
            >
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 h-[280px] sm:h-[400px] lg:h-[450px] relative overflow-hidden rounded-xl shadow-md"
              >
                <Image
                  src={item.image ? `/api/image?path=${item.image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={item.alt_text}
                  fill
                  className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </motion.div>

              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="w-full lg:w-1/2 space-y-5"
              >
                <div className="flex items-center gap-3">
                
                  <h3 className="text-2xl md:text-3xl text-[#0a1e35]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-700 text-base md:text-lg whitespace-pre-line">
                  {item.description}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FinancingBenefitsSection;
