"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";


const FlexiblePowerSection = ({ data }) => {
  const {
    dynami_third_card_title,
    dynami_third_card_description,
    dynami_third_card_table,
  } = data;

  return (
    <section className="bg-white py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full">
            <Image
              src={`/api/image?path=${data.dynami_third_card_image}` || "/Images/Jobs/jobs3.jpg"}
              alt={data.dynami_third_card_image_alt_text}
              width={600}
              height={400}
              className="rounded-2xl shadow-lg object-cover w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Text + List */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl  text-gray-900 mb-4">
            {dynami_third_card_title}
          </h2>
          <p className="text-gray-700 text-base sm:text-lg mb-6 whitespace-pre-line">
            {dynami_third_card_description}
          </p>

          <ul className="space-y-4">
            {dynami_third_card_table?.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="text-[#669933] w-5 h-5 mt-1 flex-shrink-0" />
                <span className="text-gray-800 text-base">{item.options}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default FlexiblePowerSection;
