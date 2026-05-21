"use client";
import Image from "next/image";

import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Custom Arrow Components to Handle Props
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute z-10 left-[-20px] top-20 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
  >
    <FiArrowLeft />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute z-10 right-[-20px] top-20 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
  >
    <FiArrowRight />
  </button>
);

const SmartMeterCardSection = ({ data }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="relative py-10 md:py-16  ">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className=" overflow-hidden flex flex-col lg:flex-row lg:gap-15"
        >
          {/* left Side - Content (Stretched) */}
          <div className="w-full lg:w-1/2 lg:p-8  flex flex-col justify-between ">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-3xl  text-gray-900">
                {data.smart_meter_first_card_title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {data.smart_meter_first_card_description}
              </p>
            </motion.div>

            {/* Slider */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-2xl text-gray-900 mb-6">
                {data.smart_meter_first_card_title_table}
              </h3>
              <Slider {...sliderSettings} className="relative">
                {data.smart_meter_first_card_table.map((item, index) => (
                  <div key={index} className="">
                    <motion.div
                      className="flex items-start space-x-4 p-4 bg-gray-100 rounded-lg mb-9 md:mb-12"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                          {item.primary_paragraph}
                        </h4>
                        <p className="mt-1 text-gray-600">{item.description}</p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </Slider>
            </motion.div>
          </div>

          {/* right Side - Image (Stretched) */}
          <div className="w-full lg:w-1/2 relative h-64 sm:h-80 lg:h-[600px]">
            <Image
              src={`/api/image?path=${data.smart_meter_first_card_image}` || "/Images/Jobs/jobs3.jpg"}
              alt={data.smart_meter_first_card_alt_image || "Smart Meter"}
              fill
              sizes=" 100vw"
              className="object-cover object-center rounded-t-2xl lg:rounded-r-2xl lg:rounded-tl-none "
              loading="eager"
            />
            <motion.div
              className="absolute inset-0 bg-[#669933]/20 rounded-t-2xl lg:rounded-r-2xl lg:rounded-tl-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#669933]/30 rounded-full blur-3xl z-0" />
    </section>
  );
};

export default SmartMeterCardSection;
