"use client";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { motion } from "framer-motion";
import { CheckCircle, Settings, Cpu, FileText } from "lucide-react";

const MieterstromSection = ({ data }) => {
  if (!data) return null;

  const card = {
    title: data.mieterstorm_first_card_title,
    image: data.mieterstorm_first_card_image,
    alt: data.mieterstorm_first_card_alt_image,
    description: data.mieterstorm_first_card_description,
    tableTitle: data.mieterstorm_first_card_table_title,
    features: data.mieterstorm_first_card_table || [],
  };

  const icons = [FileText, Cpu, Settings, CheckCircle];

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src={`${API_IMG_URL}${card.image}`}
            alt={card.alt || "Oekovolt Mieterstrom"}
            fill
            className="object-cover"
                    sizes=" 100vw"

          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm mb-3 font-semibold text-[#669933] uppercase tracking-wide"
          >
            {card.title}
          </motion.p>
        
          <h3 className="text-2xl md:text-3xl mb-4 text-gray-800">
            {card.tableTitle}
          </h3>
          <p className="text-gray-600 mb-6">{card.description}</p>

          <div className="space-y-5">
            {card.features.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="w-6 h-6 text-[#669933]" />
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-gray-800">
                      {item.primary_paragraph}
                    </h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MieterstromSection;
