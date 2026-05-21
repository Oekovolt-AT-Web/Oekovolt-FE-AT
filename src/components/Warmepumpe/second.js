"use client";

import {
  FiZap,
  FiSun,
  FiSettings,
  FiTrendingDown,
} from "react-icons/fi";
import { motion } from "framer-motion";

const iconMap = {
  "Nachhaltig & klimafreundlich": FiZap,
  "Komfort zu jeder Jahreszeit": FiSun,
  "Unkomplizierte Montage": FiSettings,
  "Deutlich geringere Heizkosten": FiTrendingDown,
};

const WarmepumpeVorteileSection = ({ data }) => {
  const items = data?.warmepumpe_first_table;

  if (!Array.isArray(items)) return null;

  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {items?.map((item, index) => {
            const IconComponent = iconMap[item.title] || FiZap;

            return (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 text-center flex flex-col items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <IconComponent className="text-[#669933] text-4xl mb-4" />
                <h3 className="text-xl text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WarmepumpeVorteileSection;
