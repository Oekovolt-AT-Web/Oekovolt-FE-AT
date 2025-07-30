"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { Bolt, Home, Settings } from "lucide-react";

const icons = [Home, Settings, Bolt];

const MieterstromThirdSection = ({ data }) => {
  if (!data?.mieterstorm_third_card_table?.length) return null;

  return (
    <section className="w-full">
      {data.mieterstorm_third_card_table.map((item, index) => {
        const isEven = index % 2 === 0;
        const Icon = icons[index % icons.length];

        return (
          <div
            key={index}
            className={`w-full py-10 md:py-16 ${isEven ? "bg-white" : "bg-gray-100"}`}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className={`${
                  isEven
                    ? "order-2 md:order-1"
                    : "order-2 md:order-2"
                } flex flex-col gap-5`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#669933] text-white p-2 rounded-full">
                    <Icon className="w-6 h-6" />
                  </div>
               
                     
          
                </div>
                <h3 className="text-2xl md:text-3xl text-gray-800">
            {item.title}
          </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {item.description}
                </p>
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`${
                  isEven
                    ? "order-1 md:order-2"
                    : "order-1 md:order-1"
                } relative w-full h-[300px] md:h-[420px] rounded-xl overflow-hidden shadow-md`}
              >
                <Image
                  src={`${API_IMG_URL}${item.image}`}
                  alt={item.alt_text || item.title}
                  fill
                  className="object-cover"
                               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                />
              </motion.div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default MieterstromThirdSection;
