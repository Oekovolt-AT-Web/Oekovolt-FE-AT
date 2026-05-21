'use client'

import { BsCheckCircleFill, BsLightningCharge } from 'react-icons/bs'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ThirdCardSection({ data }) {
  return (
    <section className="">
      {/* White Section with Header + First Feature Row */}
      <div className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

          {/* Header section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl  text-gray-900 mb-4">
              <span className="text-[#669933]">{data.third_sec_title.split(' ')[0]}</span>{' '}
              {data.third_sec_title.split(' ').slice(1).join(' ')}
            </h2>
            <div className="w-24 h-1 bg-[#669933] mx-auto rounded-full"></div>
          </motion.div>

          {/* First Feature Row */}
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="lg:w-1/2 relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={data?.third_sec_3rd_card_first_image ? `/api/image?path=${data.third_sec_3rd_card_first_image}` : "/Images/Jobs/jobs3.jpg"}
                alt={data.third_sec_3rd_card_first_alt_text}
                width={800}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                {/* <div className="bg-[#f0f7e6] p-3 rounded-lg">
                  <FaLeaf className="text-2xl text-[#669933]" />
                </div> */}
                <h3 className="text-2xl  text-gray-900">
                  {data.third_sec_3rd_card_first_title}
                </h3>
              </div>

              <ul className="space-y-4">
                {data.third_sec_3rd_card_first_options_table.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <BsCheckCircleFill className="text-[#669933] w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 ">{item.option}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-width gray background reversed section */}
      <div className="w-full bg-gray-100 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            className="flex flex-col lg:flex-row-reverse items-center gap-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="lg:w-1/2 relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={data.third_sec_3rd_card_second_card ? `/api/image?path=${data.third_sec_3rd_card_second_card}` : "/Images/Jobs/jobs3.jpg"}
                alt={data.third_sec_3rd_card_second_alt_text}
                width={800}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            <div className="lg:w-1/2">
              <div className="flex items-stretch gap-4 mb-6">
                {/* <div className="bg-[#f0f7e6] p-3 rounded-lg">
                  <FaChartLine className="text-2xl text-[#669933]" />
                </div> */}
                <h3 className="text-2xl text-gray-900">
                  {data.third_sec_3rd_card_second_title}
                </h3>
              </div>

              <ul className="space-y-4">
                {data.third_sec_3rd_card_second_options_table.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <BsCheckCircleFill className="text-[#669933] w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item.option}</span>
                  </motion.li>
                ))}
              </ul>


            </div>
          </motion.div>
        </div>
      </div>


    </section>
  )
}
