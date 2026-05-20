"use client";
import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";

import { ChevronLeft, ChevronRight } from "lucide-react";

const FinancingSection = ({ data }) => {
  const sliderRef = useRef(null);

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
  };

  return (
    <section className="w-full py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight">
            {data.finanzierung_first_card_title}
          </h2>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            {data.finanzierung_first_card_description}
          </p>

          <div className="pt-2 relative">
            <Slider ref={sliderRef} {...settings}>
              {data.finanzierung_first_card_table.map((item, index) => (
                <div key={index} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500 ease-in-out">
                  <h4 className="text-lg text-gray-800 mb-2">
                    {item.primary_paragraph}
                  </h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </Slider>

            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="cursor-pointer absolute -left-5 top-1/2 transform -translate-y-1/2 bg-[#669933] text-white p-2 rounded-full shadow-lg hover:bg-[#557a29] transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="cursor-pointer absolute -right-5 top-1/2 transform -translate-y-1/2 bg-[#669933] text-white p-2 rounded-full shadow-lg hover:bg-[#557a29] transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 rounded-xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[5/3] relative">
          <Image
            src={data.finanzierung_first_card_image ? `/api/image?path=${data.finanzierung_first_card_image}` : "/Images/Jobs/jobs3.jpg"}
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
