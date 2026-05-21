"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { MdBolt, MdCheckCircle } from "react-icons/md";


const SmartEnergySection = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative bg-gradient-to-r from-gray-100 to-[#f8fafc] py-10 md:py-16 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        {/* Left data */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <MdBolt className="text-[#669933] text-3xl" />
            <span className="text-[#669933] text-sm font-semibold uppercase tracking-widest">
              {data.second_title}
            </span>
          </div>

          <h2 className="text-4xl text-gray-900 leading-tight">
            {data.second_subtitle}
          </h2>

          <div className="space-y-4">
            {data.second_card_text?.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <MdCheckCircle className="text-[#669933] text-xl mt-1 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image section */}
        <motion.div
          className="relative rounded-xl overflow-hidden shadow-2xl h-[300px] sm:h-[400px] lg:h-[450px]"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          <Image
            src={`/api/image?path=${data.second_card_image}` || "/Images/Jobs/jobs3.jpg"}
            alt={data.second_image_alt_txt}
            fill
            className="object-cover w-full h-full"
          sizes="100vw"

          />

          {/* Bottom Overlay */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white text-sm px-6 py-5 backdrop-blur-md">
            <p className="font-medium leading-snug">
              {data.second_card_image_descripiton}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative glow element */}
      <div className="hidden md:block absolute -top-20 -right-20 w-[300px] h-[300px] bg-[#669933]/30 rounded-full blur-3xl z-0" />
    </section>
  );
};

export default SmartEnergySection;
