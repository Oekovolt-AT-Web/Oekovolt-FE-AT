'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SixCardSection({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === data?.fifth_card_description.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? data?.fifth_card_description.length - 1 : prev - 1
    );
  };

  return (
    <section className="relative pt-9 md:pt-15 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Section Header */}
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-1 bg-[#669933] mr-4"></div>
              <CheckCircle className="text-2xl text-[#669933]" />
              <div className="w-12 h-1 bg-[#669933] ml-4"></div>
            </div>
            <h2 className="text-4xl text-gray-900 mb-4">
              <span className="text-[#669933]">{data?.fifth_card_title.split(' ')[0]}</span> {data?.fifth_card_title.split(' ').slice(1).join(' ')}
            </h2>
            <div className="w-24 h-1 bg-[#669933] mx-auto rounded-full"></div>
      
          {/* Slider Container */}
          <div className="relative h-80 md:h-60 lg:h-50 w-full overflow-hidden  bg-white">
            <div 
              ref={sliderRef}
              className="absolute inset-0 flex"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {data?.fifth_card_description?.map((item, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-full h-full flex items-center justify-center p-4"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center text-center max-w-3xl mx-auto"
                    >
                      <p className="text-lg font-medium text-gray-800">
                        {item.option}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="text-[#669933] w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="text-[#669933] w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {data?.fifth_card_description?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-[#669933]' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>


        </motion.div>
      </div>
    </section>
  );
}