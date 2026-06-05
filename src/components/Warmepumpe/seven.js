'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image'; // <-- Import Image here
import {
  Cog,
  Zap,
  MapPin,
  ThumbsUp,
  Wrench,
  HandHelping,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const iconList = [
  Lightbulb,
  Zap,
  HandHelping,
  ThumbsUp,
  Cog,
  MapPin,
  Wrench,
];

export default function WaermepumpePartnerSection({ data }) {
  const title = data.waermepumpe_fifth_card_title;
  const image = data.waermepumpe_fifth_card_image;
  const imageAlt = data.waermepumpe_fifth_card_image_alt;
  const features = data.waermepumpe_fifth_card_options_table;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [transitionDirection, setTransitionDirection] = useState('right');

  const totalPairs = Math.ceil(features.length / 2);

  const nextPair = useCallback(() => {
    setTransitionDirection('right');
    setCurrentIndex((prev) => (prev + 1) % totalPairs);
  }, [totalPairs]);

  const prevPair = useCallback(() => {
    setTransitionDirection('left');
    setCurrentIndex((prev) => (prev - 1 + totalPairs) % totalPairs);
  }, [totalPairs]);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && totalPairs > 1) {
      interval = setInterval(() => {
        nextPair();
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextPair, totalPairs]);

  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getCurrentPairs = () => {
    const startIndex = currentIndex * 2;
    return features.slice(startIndex, startIndex + 2);
  };

  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12 ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl  text-center text-gray-800 mb-12">
          {title}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Image on the left */}
          {image && (
            <div className="w-full lg:w-1/2 h-auto min-h-[200px] md:min-h-[400px] relative rounded-xl overflow-hidden shadow">
              <Image
                src={`/api/image?path=${data.waermepumpe_fifth_card_image}` || "/Images/Jobs/jobs3.jpg"}
                alt={data.waermepumpe_fifth_card_image_alt}
                fill
                className="object-cover"
                loading="eager"
                sizes=" 100vw"

              />
            </div>
          )}

          {/* Carousel on the right */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div
              className="relative flex-grow overflow-hidden mb-4"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <div
                className={`flex flex-col gap-6 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] ${transitionDirection === 'right'
                    ? 'animate-slide-right'
                    : 'animate-slide-left'
                  }`}
                key={currentIndex}
              >
                {getCurrentPairs().map((item, pairIndex) => {
                  const featureIndex = currentIndex * 2 + pairIndex;
                  const Icon = iconList[featureIndex % iconList.length];

                  return (
                    <div
                      key={featureIndex}
                      className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      onClick={handleUserInteraction}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-100 text-[#669933] p-3 rounded-full text-xl">
                          <Icon />
                        </div>
                        <h3 className="text-lg  text-gray-800">
                          {item.primary_text}
                        </h3>
                      </div>
                      <p className="text-gray-600 ">
                        {item.secondary_text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation controls - now properly visible */}
            {features.length > 2 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => {
                    prevPair();
                    handleUserInteraction();
                  }}
                  className="p-3 rounded-full bg-white shadow hover:bg-gray-100 transition-transform hover:scale-110"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="text-gray-600" />
                </button>

                <div className="flex gap-2 mx-4">
                  {Array.from({ length: totalPairs }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        handleUserInteraction();
                        setTransitionDirection(idx > currentIndex ? 'right' : 'left');
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-[#669933] w-6' : 'bg-gray-400'
                        }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    nextPair();
                    handleUserInteraction();
                  }}
                  className="p-3 rounded-full bg-white shadow hover:bg-gray-100 transition-transform hover:scale-110"
                  aria-label="Next slide"
                >
                  <ChevronRight className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}