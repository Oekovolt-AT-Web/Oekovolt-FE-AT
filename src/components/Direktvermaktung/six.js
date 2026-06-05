'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import FadeInView from '@/components/Reusable/FadeInView';

export default function SixCardSection({ data }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);

  // Wrap nextSlide in useCallback to memoize it
  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => 
      prev === data?.fifth_card_description.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, data?.fifth_card_description?.length]);

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => 
      prev === 0 ? data?.fifth_card_description.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-play with proper dependencies
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating, nextSlide]); // Add nextSlide to dependencies

  return (
    <section className="relative pt-9 md:pt-15 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Header Section with FadeInView - scroll triggered animation */}
        <FadeInView
          direction="bottom"
          distance={40}
          duration={600}
          className="text-center"
        >
          {/* Section Header */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-1 bg-[#669933] mr-4"></div>
            <CheckCircle className="text-2xl text-[#669933]" />
            <div className="w-12 h-1 bg-[#669933] ml-4"></div>
          </div>
          <h2 className="text-4xl text-gray-900 mb-4">
            <span className="text-[#669933]">{data?.fifth_card_title?.split(' ')[0]}</span> {data?.fifth_card_title?.split(' ').slice(1).join(' ')}
          </h2>
          <div className="w-24 h-1 bg-[#669933] mx-auto rounded-full"></div>
        </FadeInView>

        {/* Slider Container - CSS transitions for slide changes */}
        <div className="relative h-80 md:h-60 lg:h-50 w-full overflow-hidden bg-white mt-8">
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
                <div
                  className="flex flex-col items-center text-center max-w-3xl mx-auto w-full"
                  style={{
                    animation: currentIndex === index ? 'slideIn 0.4s ease-out' : 'none'
                  }}
                >
                  <p className="text-lg font-medium text-gray-800">
                    {item.option}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            disabled={isAnimating}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="text-[#669933] w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={isAnimating}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <ChevronRight className="text-[#669933] w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
            {data?.fifth_card_description?.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index ? 'bg-[#669933] w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS animation for slide-in effect */}
      <style jsx>{`
        @keyframes slideIn {
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
}