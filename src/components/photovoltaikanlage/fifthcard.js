"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const PhotovoltaikOverviewSlider = ({ data }) => {
  const sliderRef = useRef();

  if (
    !data ||
    !data.photovoltaik_title_fifth_card_first ||
    !data.photovoltaik_fifth_table ||
    data.photovoltaik_fifth_table.length === 0
  )
    return null;

  const title = data.photovoltaik_title_fifth_card_first;
  const subtitle = data.photovoltaik_subtitle_fifth_card_first;
  const items = data.photovoltaik_fifth_table;

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="bg-white py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <FadeInView
            direction="bottom"
            distance={20}
            duration={600}
            className="text-sm mb-3 font-semibold text-[#669933] uppercase tracking-wide"
          >
            {title}
          </FadeInView>

          <FadeInView
            direction="top"
            distance={20}
            duration={500}
            className="text-3xl md:text-4xl text-gray-900"
          >
            {subtitle}
          </FadeInView>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition"
              aria-label="Next slide"
            >
              <ChevronRight />
            </button>
          </div>

          <Slider ref={sliderRef} {...settings}>
            {items.map((item, index) => (
              <div key={index} className="px-3 h-full">
                <FadeInView
                  direction="bottom"
                  distance={20}
                  duration={500}
                  delay={index * 100}
                  className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-[450px] transition duration-300"
                >
                  <div className="relative w-full h-52 shrink-0">
                    <Image
                      src={item?.image ? `/api/image?path=${item.image}` : "/Images/Jobs/jobs3.jpg"}
                      alt={item?.alt_text || "Image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1 overflow-hidden">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {item?.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-8">
                      {item?.description}
                    </p>
                  </div>
                </FadeInView>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default PhotovoltaikOverviewSlider;