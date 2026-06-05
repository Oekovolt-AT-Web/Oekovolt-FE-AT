"use client";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

// Custom Arrow Components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute z-10 left-[-20px] top-20 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
  >
    <ArrowLeft />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute z-10 right-[-20px] top-20 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
  >
    <ArrowRight />
  </button>
);

const SmartMeterCardSection = ({ data }) => {
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="relative py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="overflow-hidden flex flex-col lg:flex-row lg:gap-15">
          {/* Left Side - Content */}
          <div className="w-full lg:w-1/2 lg:p-8 flex flex-col justify-between">
            {/* Header */}
            <FadeInView
              direction="right"
              distance={20}
              duration={500}
              delay={200}
            >
              <h2 className="text-3xl text-gray-900">
                {data?.smart_meter_first_card_title}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {data?.smart_meter_first_card_description}
              </p>
            </FadeInView>

            {/* Slider Section */}
            <div className="mt-8">
              <FadeInView
                direction="bottom"
                distance={20}
                duration={500}
                delay={400}
              >
                <h3 className="text-2xl text-gray-900 mb-6">
                  {data?.smart_meter_first_card_title_table}
                </h3>
              </FadeInView>
              
              <Slider {...sliderSettings} className="relative">
                {data?.smart_meter_first_card_table?.map((item, index) => (
                  <div key={index} className="">
                    <div
                      className="flex items-start space-x-4 p-4 bg-gray-100 rounded-lg mb-9 md:mb-12 animate-fade-scale"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards',
                        opacity: 0
                      }}
                    >
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                          {item?.primary_paragraph}
                        </h4>
                        <p className="mt-1 text-gray-600">{item?.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="w-full lg:w-1/2 relative h-64 sm:h-80 lg:h-[600px]">
            <Image
              src={data?.smart_meter_first_card_image ? `/api/image?path=${data.smart_meter_first_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.smart_meter_first_card_alt_image || "Smart Meter"}
              fill
              sizes="100vw"
              className="object-cover object-center rounded-t-2xl lg:rounded-r-2xl lg:rounded-tl-none"
              loading="eager"
            />
            <div
              className="absolute inset-0 bg-[#669933]/20 rounded-t-2xl lg:rounded-r-2xl lg:rounded-tl-none animate-fade-in"
              style={{ animationDelay: "300ms", animationFillMode: 'forwards', opacity: 0 }}
            />
          </div>
        </div>
      </div>

      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#669933]/30 rounded-full blur-3xl z-0" />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-fade-scale {
          animation: fadeScale 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default SmartMeterCardSection;