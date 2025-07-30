'use client';
import { motion } from 'framer-motion';
import { API_IMG_URL } from '@/lib/apiImgUrl';
import { FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';

const FlexibleBenefitsSection = ({ data }) => {
  return (
    <section className="bg-white py-10 md:py-16 px-6 md:px-12 ">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl text-center text-gray-900 mb-10"
        >
          {data.dynami_fifth_card_title}
        </motion.h2>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-xl my-10 relative"
        >
          <Image
            src={`${API_IMG_URL}${data.dynami_fifth_card_image}`}
            alt={data.dynami_fifth_card_alt_text}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.dynami_fifth_card_table.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border border-gray-100 rounded-2xl px-6 py-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Optional Icon */}
              <div className="flex justify-center mb-4">
                <FaCheckCircle className="text-[#669933] text-3xl group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="text-lg  text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlexibleBenefitsSection;
