"use client";
import { useKeenSlider } from "keen-slider/react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "keen-slider/keen-slider.min.css";

const FinancingSection = ({ data }) => {
  const sliderRef = useRef(null);

  const [sliderRefCallback, slider] = useKeenSlider({
    loop: true,
    duration: 1000,
    dragSpeed: 0.8,
    rubberband: false,
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: {
          perView: 1,
          spacing: 12,
        },
      },
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      slider.current?.next();
    }, 6000);
    return () => clearInterval(interval);
  }, [slider]);

  return (
    <section className="w-full py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight">
            {data.finanzierung_first_card_title}
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {data.finanzierung_first_card_description}
          </p>

          {/* Slider */}
          <div className="pt-2 relative">
            <div ref={sliderRefCallback} className="keen-slider">
              {data.finanzierung_first_card_table.map((item, index) => (
                <div
                  key={index}
                  className="keen-slider__slide bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500 ease-in-out"
                >
                  <h4 className="text-lg text-gray-800 mb-2">
                    {item.primary_paragraph}
                  </h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 -translate-y-1/2">
                 <button
              onClick={() => slider.current?.prev()}
              className="cursor-pointer absolute -left-5 top-1/2 transform -translate-y-1/2 bg-[#669933] text-white p-2 rounded-full shadow-lg hover:bg-[#557a29] transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => slider.current?.next()}
              className="cursor-pointer absolute -right-5 top-1/2 transform -translate-y-1/2 bg-[#669933] text-white p-2 rounded-full shadow-lg hover:bg-[#557a29] transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[5/3] relative">
          <Image
            src={`${API_IMG_URL}${data.finanzierung_first_card_image}`}
            alt={data.finanzierung_first_card_image_alt_text}
            fill
          sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;
