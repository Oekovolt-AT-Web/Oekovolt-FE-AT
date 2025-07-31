"use client";

import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { motion } from "framer-motion";

export default function WarmepumpeSecondCardSection({ data }) {
  const {
    warmepumpe_second_card_title: title,
    warmepumpe_second_card_description: description,
    warmepumpe_second_card_image: image,
    warmepumpe_second_card_image_alt_text: imageAlt,
    warmepumpe_second_card_options_title: optionsTitle,
    warmepumpe_second_card_options_table: optionsTable,
  } = data;

  return (
    <div className="py-10 md:py-16 px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center mx-auto gap-10 max-w-7xl">
      
      {/* Text Section */}
      <motion.div
        className="w-full lg:w-1/2 space-y-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl text-gray-800">{title}</h2>
        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
          {description}
        </p>

        {optionsTitle && optionsTable?.length > 0 && (
          <motion.div
            className="mt-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <h3 className="text-xl text-green-700 mb-4">{optionsTitle}</h3>
            <ul className="space-y-3">
              {optionsTable.map((item, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-start text-gray-700"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span>{item.options}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="w-full lg:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Image
          src={`${API_IMG_URL}${image}`}
          alt={imageAlt}
          width={600}
          height={400}
          className="rounded-xl shadow-md object-cover w-full h-auto"
          quality={100}
        />
      </motion.div>
    </div>
  );
}
