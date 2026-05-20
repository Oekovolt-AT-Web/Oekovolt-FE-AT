"use client";
import { motion } from "framer-motion";

const EnhancedCardsSection = ({ data }) => {
  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl text-center text-gray-900 mb-10"
        >
          {data.photovoltaik_second_card_title || ""}
        </motion.h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data.cards.map((item, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-gray-100 bg-white border rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="text-xl text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EnhancedCardsSection;
