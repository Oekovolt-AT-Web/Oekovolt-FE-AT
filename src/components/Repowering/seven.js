"use client";

import { motion } from "framer-motion";
import { FaSolarPanel, FaArrowRight, FaBatteryFull, FaChartLine } from "react-icons/fa";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";

export default function RepoweringSection({ data }) {
  return (
    <section className="w-full px-6 md:px-12 py-10 md:py-16 bg-gray-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0f7e6] rounded-full blur-3xl opacity-40 -mr-32 -mt-32"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern split layout with visual contrast */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
          {/* Left Side - Enhanced media gallery */}
                  <motion.div
            className="w-full lg:w-1/2 space-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First feature card */}
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#f0f7e6] p-3 rounded-lg">
                    <FaSolarPanel className="text-2xl text-[#669933]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {data.third_sec_2nd_card_first_table_title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {data.third_sec_2nd_card_first_table.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                    >
                      <div className="bg-[#669933] bg-opacity-10 p-1 rounded-full mt-1">
                        <FaArrowRight className="text-white text-xs" />
                      </div>
                      <span className="text-gray-700 text-lg">{item.option}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Second feature card */}
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#f0f7e6] p-3 rounded-lg">
                    <FaBatteryFull className="text-2xl text-[#669933]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {data.third_sec_2nd_card_second_table_title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {data.third_sec_2nd_card_second_table.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                    >
                      <div className="bg-[#669933] bg-opacity-10 p-1 rounded-full mt-1">
                        <FaArrowRight className="text-white text-xs" />
                      </div>
                      <span className="text-gray-700 text-lg">{item.option}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

          </motion.div>
        

          {/* Right Side - Modern comparison cards */}
    <motion.div
            className="w-full lg:w-1/2 space-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-6">
              <h2 className="text-4xl text-gray-900">
                <span className="text-[#669933]">{data.third_sec_2nd_card_title.split(' ')[0]}</span> {data.third_sec_2nd_card_title.split(' ').slice(1).join(' ')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {data.third_sec_2nd_card_description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* First image with floating badge */}
              <motion.div 
                className="relative rounded-2xl overflow-hidden shadow-xl group"
                whileHover={{ scale: 1.01 }}
              >
                {/* <div className="absolute top-4 left-4 bg-[#669933] text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  Before
                </div> */}
                <Image
                  src={`${API_IMG_URL}${data.third_sec_2nd_card_first_image}`}
                  alt={data.third_sec_2nd_card_first_alt_text}
                  width={800}
                  height={450}
                  className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>

              {/* Second image with floating badge */}
              <motion.div 
                className="relative rounded-2xl overflow-hidden shadow-xl group"
                whileHover={{ scale: 1.01 }}
              >
                {/* <div className="absolute top-4 left-4 bg-[#669933] text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                  After
                </div> */}
                <Image
                  src={`${API_IMG_URL}${data.third_sec_2nd_card_second_image}`}
                  alt={data.third_sec_2nd_card_second_alt_image}
                  width={800}
                  height={450}
                  className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}