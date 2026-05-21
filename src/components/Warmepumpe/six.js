'use client';
import Image from 'next/image';
import { FaClock, FaEuroSign, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

const iconMap = [FaClock, FaEuroSign, FaCheckCircle, FaRocket];

export default function WarmepumpeFinancingSection({ data }) {
  return (
    <section className="bg-white py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           {/* Right side - Image + Text */}
        <motion.div
          className="relative w-full "
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="w-full h-[300px] relative rounded-xl shadow-lg overflow-hidden mb-6">
            <Image
              src={`/api/image?path=${data.warmepumpe_fourth_card_image}` || "/Images/Jobs/jobs3.jpg"}
              alt={data.warmepumpe_fourth_card_image_alt}
              fill
              className="object-cover"
                    sizes=" 100vw"

            />
          </div>

          <h3 className="text-2xl text-gray-800 mb-4">
            {data.warmepumpe_fourth_card_title}
          </h3>

          <p className="text-gray-700">
            {data.warmepumpe_fourth_card_first_description}
          </p>
        </motion.div>
        {/* Left side - Options list */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl text-[#669933] mb-6">
            {data.warmepumpe_fourth_card_options_title}
          </h3>

          <motion.ul
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
          >
            {data.warmepumpe_fourth_card_options_table.map((item, index) => {
              const Icon = iconMap[index % iconMap.length];
              return (
                <motion.li
                  key={index}
                  className="flex gap-4 items-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Icon className="text-[#669933] text-xl mt-1" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {item.primary_text}
                    </h4>
                    <p className="text-sm text-gray-600">{item.secondary_text}</p>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>

     
      </div>
    </section>
  );
}
