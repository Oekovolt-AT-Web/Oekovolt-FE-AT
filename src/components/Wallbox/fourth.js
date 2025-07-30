"use client"
import Image from 'next/image';
import { API_IMG_URL } from '@/lib/apiImgUrl';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const WallboxThirdCard = ({ data }) => {
  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden relative max-w-7xl mx-auto ">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-15 items-center mb-[-25]">
          
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative h-80 lg:h-[500px] rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={`${API_IMG_URL}${data.wallbox_third_card_image}`}
              alt={data.wallbox_third_card_image_alt || 'Wallbox Vorteile'}
              fill
              className="rounded-xl object-cover"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#669933]/60 to-transparent" />
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl  text-gray-900 mb-6">
              {data.wallbox_third_card_title}
            </h2>

            <ul className="space-y-5">
              {data.wallbox_third_card_table.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <FaCheckCircle className="mt-1 text-[#669933] text-xl shrink-0" />
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {item.primary_text}
                    </p>
                    <p className="text-gray-600">{item.secondary_text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default WallboxThirdCard;
