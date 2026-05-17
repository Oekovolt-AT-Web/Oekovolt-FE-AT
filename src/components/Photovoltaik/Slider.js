"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";

export default function KomponentenSlider({data}) {

  const sliderSettings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 overflow-hidden">
      
      <div className="flex justify-center items-center flex-col">
            <h2 className="text-[#669933] text-lg font-semibold uppercase">{data.third_card_title}</h2>
            <div className="h-0.5 w-25 bg-[#669933] mt-1"></div>
          </div>
      <div
        className={` transition-all duration-700 ${
          hasMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >

        <p className="text-center text-black-600 mx-auto mt-6 mb-10 font-bold text-2xl md:text-3xl lg:text-3xl">
          {data.third_card_subtitle}
        </p>

        <Slider {...sliderSettings} className="">
          {data.third_card_component_table.map((komponent, index) => (
            <div key={index} className="px-4">
              <div className="pt-6 pr-6 pl-6 lg:h-80 md:h-50 flex flex-col items-center justify-end text-center">
                <div className="flex items-center justify-center mb-4">
                  <Image
                    width={300}
                    height={300}
                    quality={100}
                     src={`${API_IMG_URL}${komponent.image}`}
                    alt={komponent.alt_text}
                    className="h-auto object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{komponent.title}</h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}