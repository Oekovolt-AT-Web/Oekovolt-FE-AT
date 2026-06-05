"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

const SecondCardSection = ({ data }) => {
  const listItems = data?.second_card_description_table || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === listItems.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, listItems.length]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? listItems.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, listItems.length]);

  // Auto-play (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating, nextSlide]);

  return (
    <section className="relative py-10 md:py-16 bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col gap-20">
          {/* Top Section with Slider */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content - Header and Slider */}
            <FadeInView
              direction="bottom"
              distance={40}
              duration={600}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-4 mb-2">
                <div className="w-12 h-1 bg-[#669933]"></div>
                <span className="text-[#669933] font-medium">LÖSUNGEN</span>
              </div>

              <h2 className="text-4xl text-gray-900 leading-tight">
                <span className="text-[#669933]">
                  {data?.second_card_title?.split(" ")[0]}
                </span>{" "}
                {data?.second_card_title?.split(" ").slice(1).join(" ")}
              </h2>

              {/* Slider Container */}
              <div className="relative h-70 md:h-38 w-full overflow-hidden rounded-xl bg-white">
                <div
                  ref={sliderRef}
                  className="absolute inset-0 flex"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {listItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-full h-full p-14 flex items-center"
                    >
                      <div className="flex-col items-center justify-center gap-6 w-full">
                        <div
                          className="flex flex-col items-center justify-center text-center"
                          style={{
                            animation: currentIndex === index ? 'fadeSlideIn 0.4s ease-out' : 'none'
                          }}
                        >
                          <p className="text-gray-700 font-medium text-center">
                            {item.option}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  disabled={isAnimating}
                  className="cursor-pointer absolute left-[-4] top-1/2 -translate-y-1/2 p-2 z-10 disabled:opacity-50"
                >
                  <ChevronLeft className="text-[#669933] w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isAnimating}
                  className="cursor-pointer absolute right-[-4] top-1/2 -translate-y-1/2 p-2 z-10 disabled:opacity-50"
                >
                  <ChevronRight className="text-[#669933] w-6 h-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                  {listItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isAnimating) setCurrentIndex(index);
                      }}
                      className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
                        currentIndex === index ? "bg-[#669933] w-6" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </FadeInView>

            {/* Right Image */}
            <FadeInView
              direction="none"
              scale={0.95}
              duration={600}
              delay={200}
              className="relative rounded-2xl overflow-hidden shadow-2xl group"
            >
              <Image
                src={data?.second_card_image ? `/api/image?path=${data?.second_card_image}` : "/Images/Jobs/jobs3.jpg"}
                alt={data?.second_card_alt_text || "Solarstrom Direktvermarktung"}
                width={800}
                height={600}
                className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </FadeInView>
          </div>

          {/* Bottom Section */}
          <FadeInView
            direction="none"
            duration={600}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-full min-h-[400px]">
                <Image
                  src={data?.second_card_second_image ? `/api/image?path=${data?.second_card_second_image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={data?.second_card_second_alt_text || "SolarTalk"}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              <div className="p-10 lg:p-12 space-y-6">
                <h3 className="text-3xl text-gray-900">
                  {data?.second_card_second_title}
                </h3>
                <p className="text-gray-600 text-md leading-relaxed whitespace-pre-line">
                  {data?.second_card_second_description}
                </p>
              </div>
            </div>
          </FadeInView>
        </div>
      </div>

      {/* Add CSS animation for slider fade-in effect */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default SecondCardSection;