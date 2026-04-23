"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const SecondCardSection = ({ data }) => {
  const listItems = data?.second_card_description_table || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === listItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? listItems.length - 1 : prev - 1));
  };

  return (
    <section className="relative py-10 md:py-16 bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col gap-20">
          {/* Top Section with Slider */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-4 mb-2">
                <div className="w-12 h-1 bg-[#669933]"></div>
                <span className="text-[#669933] font-medium">LÖSUNGEN</span>
              </div>

              <h2 className="text-4xl text-gray-900 leading-tight">
                <span className="text-[#669933]">
                  {data.second_card_title.split(" ")[0]}
                </span>{" "}
                {data.second_card_title.split(" ").slice(1).join(" ")}
              </h2>

              {/* Slider Container */}
              <div className="relative h-70 md:h-38 w-full overflow-hidden rounded-xl bg-white">
                {/* Logo at top-right */}

                <div
                  ref={sliderRef}
                  className="absolute inset-0 flex"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: "transform 0.5s ease-in-out",
                  }}
                >
                  {listItems.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-full h-full p-14 flex items-center"
                    >
                      <div className="flex-col items-center justify-center gap-6">
                        <p className="text-gray-700 font-medium text-center">
                          {item.option}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="cursor-pointer absolute left-[-4] top-1/2 -translate-y-1/2 p-2 z-10"
                >
                  <ChevronLeft className="text-[#669933] w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="cursor-pointer absolute right-[-4] top-1/2 -translate-y-1/2 p-2 z-10"
                >
                  <ChevronRight className="text-[#669933] w-6 h-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {listItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`cursor-pointer w-3 h-3 rounded-full transition-colors ${
                        currentIndex === index ? "bg-[#669933]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl group"
            >
              <Image
                src={`${API_IMG_URL}${data.second_card_image}`}
                alt={
                  data.second_card_alt_text || "Solarstrom Direktvermarktung"
                }
                width={800}
                height={600}
                className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-full min-h-[400px]">
                <Image
                  src={`${API_IMG_URL}${data.second_card_second_image}`}
                  alt={data.second_card_second_alt_text || "SolarTalk"}
                  fill
                  priority
                  className="object-cover"
                  sizes=" 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="p-10 lg:p-12 space-y-6">
                <h3 className="text-3xl text-gray-900">
                  {data.second_card_second_title}
                </h3>
                <p className="text-gray-600 text-md leading-relaxed whitespace-pre-line">
                  {data.second_card_second_description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecondCardSection;
