"use client";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Sun, Battery, Home, Plug, Bolt, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import FadeInView from "@/components/Reusable/FadeInView";

const PhotovoltaikSliderSection = ({ data }) => {
  const sliderRef = useRef();

  if (!data) return null;

  const title = data.photovoltaik_title_seventh_card_first;
  const subtitle = data.photovoltaik_subtitle_seventh_card_first;
  const items = data.photovoltaik_seventh_table_images || [];

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

  const getIcon = (title) => {
    const iconClass = "text-[#669933] w-8 h-8";
    const lower = title?.toLowerCase() || "";
    if (lower.includes("modul")) return <Sun className={iconClass} />;
    if (lower.includes("speicher")) return <Battery className={iconClass} />;
    if (lower.includes("wallbox")) return <Plug className={iconClass} />;
    if (lower.includes("wärmepumpe")) return <Home className={iconClass} />;
    return <Bolt className={iconClass} />;
  };

  return (
    <section className="w-full px-6 md:px-12 py-10 md:py-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-7 md:gap-12">
        <div className="md:flex-row lg:flex flex-col justify-between">
          <div className="flex-col">
            {/* title */}
            <FadeInView
              direction="bottom"
              distance={20}
              duration={600}
              className="text-sm mb-3 font-semibold text-[#669933] uppercase tracking-wide"
            >
              {title}
            </FadeInView>

            {/* Subtitle */}
            <FadeInView
              direction="bottom"
              distance={30}
              duration={600}
              className="text-3xl md:text-4xl text-gray-900"
            >
              {subtitle}
            </FadeInView>
          </div>

          {/* Arrows */}
          <div className="flex justify-end gap-4 lg:mb-4">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="cursor-pointer p-5 rounded-full bg-[#f1f1f1] hover:bg-[#e2e2e2] transition"
              aria-label="Zurück"
            >
              <ChevronLeft className="text-lg text-[#669933]" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="cursor-pointer p-5 rounded-full bg-[#f1f1f1] hover:bg-[#e2e2e2] transition"
              aria-label="Weiter"
            >
              <ChevronRight className="text-lg text-[#669933]" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, index) => (
            <div key={index} className="px-3 h-full">
              <FadeInView
                direction="bottom"
                distance={30}
                duration={500}
                delay={index * 100}
                className="bg-gray-100 rounded-2xl overflow-hidden flex flex-col h-[400px] transition duration-300"
              >
                {/* Image */}
                <div className="relative w-full h-52 shrink-0">
                  <Image
                    src={item?.image ? `/api/image?path=${item.image}` : "/Images/Jobs/jobs3.jpg"}
                    alt={item?.alt_text || "solar"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                      {getIcon(item?.title)}
                    </div>
                    <h3 className="text-normal font-semibold text-gray-900 line-clamp-2">
                      {item?.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-6">
                    {item?.description}
                  </p>
                </div>
              </FadeInView>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PhotovoltaikSliderSection;