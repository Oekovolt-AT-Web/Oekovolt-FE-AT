'use client';
import { motion } from 'framer-motion';
import { FaSolarPanel, FaBolt, FaPlug, FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';
import { API_IMG_URL } from '@/lib/apiImgUrl';

const SixSection = ({ data }) => {
  return (
    <section className="relative bg-white py-10 md:py-16 px-6 md:px-12 overflow-hidden">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#669933] to-transparent opacity-10"></div> */}
      <div className="absolute bottom-20 right-0 w-64 h-64 rounded-full bg-[#f0f7e6] blur-3xl opacity-60 -mr-32"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern split layout with overlapping elements */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE: Image with floating info cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src={`${API_IMG_URL}${data.third_sec_1st_card_image}`}
                alt={data.third_sec_1st_card_alt_text}
                fill
                                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating info card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="hidden md:block absolute -bottom-8 -left-8 md:-left-2 bg-white p-6 rounded-xl shadow-lg w-3/4 border-l-4 border-[#669933]"
            >
              <h3 className="text-xl text-gray-900 mb-2">{data.third_sec_1st_card_first_title}</h3>
              <p className="text-gray-600">{data.third_sec_1st_card_first_description}</p>
            </motion.div>

           
          </motion.div>

          {/* RIGHT SIDE: Modern feature cards with animated icons */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="mb-10">
              <h2 className="text-4xl text-gray-900 mb-4">
                <span className="text-[#669933]">{data.third_sec_title.split(' ')[0]}</span> {data.third_sec_title.split(' ').slice(1).join(' ')}
              </h2>
              <div className="w-20 h-1 bg-[#669933] rounded-full"></div>
            </div>
               <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className=" bg-[#669933] p-6 rounded-xl shadow-lg  text-white"
            >
              <h3 className="text-xl mb-2">{data.third_sec_1st_card_second_title}</h3>
              <p>{data.third_sec_1st_card_second_description}</p>
            </motion.div>

            <div className="grid gap-6">
              {data.third_sec_1st_card_table_options?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex gap-5 items-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#669933] rounded-full opacity-10 animate-ping"></div>
                    <div className="relative w-8 h-8 p-2 bg-[#f0f7e6] rounded-full flex items-center justify-center text-[#669933]">
                      {index % 3 === 0 ? <FaPlug className="text-md" /> : 
                       index % 3 === 1 ? <FaSolarPanel className="text-md" /> : 
                       <FaBolt className="text-xl" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-gray-900 ">{item.option}</p>
                    {item.description && (
                      <p className="text-gray-600">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

         
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SixSection;