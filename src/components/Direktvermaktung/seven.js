"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";


export default function SeventhhCardSection({ data }) {
  return (
    <section className="py-10 md:py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex-col items-center gap-4">
            <Image
              src={data?.sixth_card_logo ? `/api/image?path=${data?.sixth_card_logo}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.sixth_card_alt_text_logo}
              width={250}
              height={100}
              className="mb-4"
            />
            <h2 className="uppercase text-[#669933]">
              {data?.sixth_card_title}
            </h2>
          </div>

          <h3 className="text-xl  text-gray-800">
            {data?.sixth_card_subtitle}
          </h3>

          <p className="text-gray-600 whitespace-pre-line">
            {data?.sixth_card_description}
          </p>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Image
            src={data?.sixth_card_image ? `/api/image?path=${data?.sixth_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.sixth_card_alt_text_image}
            width={800}
            height={500}
            className="rounded-xl shadow-lg object-cover w-full"
          />
        </motion.div>
      </div>

      {/* Second Title + List */}
      <div className="max-w-5xl mx-auto mt-14 text-center">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl text-gray-800"
        >
          {data?.sixth_card_second_title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-[#669933] text-lg mt-2"
        >
          {data?.sixth_card_second_subtitle}
        </motion.p>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          viewport={{ once: true }}
          className="mt-8 text-left grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {data?.sixth_card_second_table_description?.map((item, idx) => (
            <motion.li
              key={idx}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 }
              }}
              className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <CheckCircle className="text-[#669933] mt-1" />
              <span className="text-gray-700">{item?.option}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
