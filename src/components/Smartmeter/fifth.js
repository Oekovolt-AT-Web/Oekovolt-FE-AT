"use client"
import Image from 'next/image';
import { API_IMG_URL } from '@/lib/apiImgUrl';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { FiCheck, FiZap, FiDollarSign, FiClock, FiShield } from 'react-icons/fi';

const SmartMeterCostSection = ({ data }) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute z-10 left-[-20px] top-1/2 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
  >
    <FiArrowLeft />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute z-10 right-[-20px] top-1/2 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
  >
    <FiArrowRight />
  </button>
);


  // Icon mapping for features
  const getIcon = (index) => {
    const icons = [<FiZap key="zap" />, <FiDollarSign key="dollar" />, 
                  <FiClock key="clock" />, <FiShield key="shield" />];
    return icons[index % icons.length];
  };

  return (
    <section className="py-10 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={container}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
        >
          {/* Image Section - Full Height */}
          <motion.div 
            variants={item}
            className="w-full lg:w-2/5 relative h-80 lg:h-auto"
          >
            <Image
              src={`${API_IMG_URL}${data.smart_meter_fourth_card_image}`}
              alt={data.smart_meter_fourth_card_alt_image || 'Smart Meter'}
              fill
              className="object-cover"
              priority
                    sizes=" 100vw"

            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-[#669933]/50 lg:bg-gradient-to-r" />
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white drop-shadow-lg"
              >
                {data.smart_meter_fourth_card_title}
              </motion.h2>
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="w-full lg:w-3/5 p-8 lg:p-12">
            {/* Description */}
            <motion.div
              variants={item}
              className="mb-10"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                {data.smart_meter_fourth_card_description}
              </p>
            </motion.div>

            {/* Pricing Tables */}
            <div className="space-y-12">
              {/* First Table */}
              <motion.div
                variants={container}
                className="bg-gray-50 rounded-xl p-6 shadow-inner"
              >
                <motion.h3 
                  variants={item}
                  className="text-2xl  text-gray-900 mb-6 flex items-center"
                >
                  <FiDollarSign className="mr-3 text-[#669933]" />
                  {data.smart_meter_fourth_card_first_table_title}
                </motion.h3>
                <ul className="space-y-4">
                  {data.smart_meter_fourth_card_first_table.map((item, index) => (
                    <motion.li
                      key={index}
                      variants={item}
                      className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="bg-[#669933]/80 p-2 rounded-full mr-4">
                        <FiCheck className="text-white" />
                      </div>
                      <span className="text-gray-700">{item.options}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Second Table */}
            
            </div>
          </div>
        </motion.div>
      </div >
{/* Redesigned Second Table */}
<motion.div
  variants={container}
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 md:pt-15"
>
  <motion.h3
    variants={item}
    className="text-3xl  text-gray-800 mb-6 flex items-center justify-center gap-3 text-center"
  >
    {/* <FiZap className="text-[#669933] text-4xl" /> */}
    {data.smart_meter_fourth_card_second_table_title}
  </motion.h3>

  <motion.p
    variants={item}
    className="text-gray-500 text-lg mb-8 leading-relaxed text-center"
  >
    {data.smart_meter_fourth_card_second_table_description}
  </motion.p>

 {/* Slider Section */}
<Slider
  dots={false}
  infinite={true}
  speed={500}
  autoplay
  autoplaySpeed={8000}
  slidesToShow={3}
  slidesToScroll={1}
  arrows
  prevArrow={<PrevArrow />}
  nextArrow={<NextArrow />}
  responsive={[
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
      },
    },
  ]}
  className="relative "
>
 {data.smart_meter_fourth_card_second_table_options.map((item, index) => (
    <div key={index} className="px-3 h-full"> 
      <motion.div
        variants={item}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group flex flex-col justify-between p-6 bg-white rounded-2xl transition-all h-full" // ✅ h-full and justify-between
      >
        <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 group-hover:bg-[#669933] transition-all rounded-full text-[#669933] group-hover:text-white text-xl">
          {getIcon(index)}
        </div>
        <span className="text-gray-800 text-base font-medium">
          {item.options}
        </span>
      </motion.div>
    </div>
  ))}
</Slider>

</motion.div>

    </section>
  );
};

export default SmartMeterCostSection;