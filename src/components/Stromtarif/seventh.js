'use client';
import { motion } from 'framer-motion';
import { FaPlug, FaWifi } from 'react-icons/fa';
import Image from 'next/image';

const icons = [<FaPlug key="plug" />, <FaWifi key="wifi" />];

const RequirementsSection = ({ data }) => {
  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* LEFT SIDE: Title, Description, Image */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl text-gray-900 mb-4"
          >
            {data.dynami_sixth_card_title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-lg text-gray-700 mb-8 max-w-xl"
          >
            {data.dynami_sixth_card_description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-lg relative w-full h-80"
          >
            <Image
              src={`/api/image?path=${data.dynami_sixth_card_image}` || "/Images/Jobs/jobs3.jpg"}
              alt={data.dynami_sixth_card_alt_image}
              fill
              className="object-cover object-center"
              sizes=" 100vw"
              loading="eager"
            />
          </motion.div>
        </div>

        {/* RIGHT SIDE: Boxes */}
        <div className="space-y-8">
          {data.dynami_sixth_card_table.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-gray-100 border border-[#d8f0c2] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[#669933] text-2xl">{icons[index]}</div>
                <h3 className="text-xl text-[#404040]">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
