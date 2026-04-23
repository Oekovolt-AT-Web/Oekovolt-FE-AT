"use client";

import { motion } from "framer-motion";
import {
  FaBolt,
  FaLeaf,
  FaRecycle,
  FaTools,
} from "react-icons/fa";

// Replace Tailwind's `text-primary` with your custom hex (#669933)
const iconMap = {
  Zukunftssicher: <FaRecycle className="text-[#669933] text-3xl" />,
  Umweltfreundlich: <FaLeaf className="text-[#669933] text-3xl" />,
  Kostenersparnis: <FaBolt className="text-[#669933] text-3xl" />,
  "Einfache Installation": <FaTools className="text-[#669933] text-3xl" />,
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
};

const WallboxFeatures2 = ({ data }) => {
  const features = data.wallbox_first_card_options || [];

  return (
    <section className="py-10 md:py-16 bg-gray-100">
      <div className="container mx-auto px-6 md:px-12  max-w-7xl">
        <h2 className="text-4xl text-center mb-14 text-gray-800">
          {data.wallbox_first_card_title?.split("Ökovolt").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="text-[#669933]">Ökovolt</span>
              )}
            </span>
          ))}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="relative bg-white border border-gray-200 p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#669933]/10 rounded-full flex items-center justify-center shadow-md">
                {iconMap[feature.title] || (
                  <FaBolt className="text-[#669933] text-2xl" />
                )}
              </div>

              <div className="mt-10 text-center">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#669933] transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WallboxFeatures2;
