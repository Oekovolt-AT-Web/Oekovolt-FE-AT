'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DynamicInfoSection({data}) {
  return (
    <section className="w-full bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-15">
        {/* Green line accent and content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="relative w-full lg:w-1/2"
        >
          <div className="absolute left-0 top-0 h-full w-1 bg-[#669933]" />
          <div className="pl-6">
            <h2 className="text-3xl text-gray-800 mb-4">{data.dynami_second_card_title}</h2>
            <p className="text-gray-600 whitespace-pre-line">{data.dynami_second_card_description}</p>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-md"
        >
          <Image
            src={`/api/image?path=${data.dynami_second_card_image}` || "/Images/Jobs/jobs3.jpg"}
            alt={data.dynami_second_card_image_alt_text}
            width={800}
            height={600}
            className="rounded-xl object-cover w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
