"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle } from "lucide-react";


export default function FourthCardSection({ data }) {

  return (
    <section className="max-w-7xl mx-auto py-10 md:py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-stretch gap-10 lg:gap-15">
        {/* Left: Image and Text */}
        <motion.div
          className="lg:w-1/2"
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={data.fourth_card_image ? `/api/image?path=${data.fourth_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data.fourth_card_alt_text}
            width={800}
            height={600}
            className="rounded-2xl shadow-xl object-cover w-full h-full"
          />

        </motion.div>

        {/* Right: Option Boxes */}
        <motion.div
          className="lg:w-1/2 grid gap-6"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl  text-gray-900 ">
            {data.fourth_card_title}
          </h2>
          <p className="text-gray-700  whitespace-pre-line">
            {data.fourth_card_description}
          </p>
          {data.fourth_card_options?.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-gray-100 p-5 rounded-xl border-l-4 border-[#669933] shadow-sm hover:shadow-md transition"
            >
              <CheckCircle size={28} className="text-[#669933] shrink-0 mt-1" />
              <p className="text-gray-800 text-base">{item.option}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
