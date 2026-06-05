"use client";
import Image from 'next/image';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight, Check, Zap, DollarSign, Clock, Shield } from "lucide-react";
import FadeInView from '@/components/Reusable/FadeInView';

const SmartMeterCostSection = ({ data }) => {
  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="cursor-pointer absolute z-10 left-[-20px] top-1/2 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
    >
      <ArrowLeft />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="cursor-pointer absolute z-10 right-[-20px] top-1/2 transform -translate-y-1/2 text-[#669933] bg-white rounded-full p-2 shadow hover:bg-[#669933] hover:text-white transition"
    >
      <ArrowRight />
    </button>
  );

  // Icon mapping for features
  const getIcon = (index) => {
    const icons = [<Zap key="zap" />, <DollarSign key="dollar" />, <Clock key="clock" />, <Shield key="shield" />];
    return icons[index % icons.length];
  };

  return (
    <section className="py-10 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="w-full lg:w-2/5 relative h-80 lg:h-auto">
            <Image
              src={data?.smart_meter_fourth_card_image ? `/api/image?path=${data.smart_meter_fourth_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.smart_meter_fourth_card_alt_image || 'Smart Meter'}
              fill
              className="object-cover"
              loading="eager"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-[#669933]/50 lg:bg-gradient-to-r" />
            <div className="absolute bottom-6 left-6 right-6 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
              <FadeInView
                direction="bottom"
                distance={20}
                duration={300}
                delay={300}
                className="text-3xl font-bold text-white drop-shadow-lg"
              >
                <h2>{data?.smart_meter_fourth_card_title}</h2>
              </FadeInView>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-3/5 p-8 lg:p-12">
            {/* Description */}
            <FadeInView
              direction="bottom"
              distance={20}
              duration={500}
              className="mb-10"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                {data?.smart_meter_fourth_card_description}
              </p>
            </FadeInView>

            {/* Pricing Tables */}
            <div className="space-y-12">
              {/* First Table */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                <FadeInView
                  direction="bottom"
                  distance={20}
                  duration={500}
                  className="text-2xl text-gray-900 mb-6 flex items-center"
                >
                  <h3 className="flex items-center">
                    <DollarSign className="mr-3 text-[#669933]" />
                    {data?.smart_meter_fourth_card_first_table_title}
                  </h3>
                </FadeInView>
                <ul className="space-y-4">
                  {data?.smart_meter_fourth_card_first_table?.map((item, index) => (
                    <FadeInView
                      key={index}
                      direction="bottom"
                      distance={10}
                      duration={400}
                      delay={index * 100}
                      className="flex items-start p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="bg-[#669933]/80 p-2 rounded-full mr-4">
                        <Check className="text-white" />
                      </div>
                      <span className="text-gray-700">{item?.options}</span>
                    </FadeInView>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Table Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-9 md:pt-15">
        <FadeInView
          direction="bottom"
          distance={20}
          duration={500}
          className="text-3xl text-gray-800 mb-6 flex items-center justify-center gap-3 text-center"
        >
          <h3>{data?.smart_meter_fourth_card_second_table_title}</h3>
        </FadeInView>

        <FadeInView
          direction="bottom"
          distance={20}
          duration={500}
          delay={100}
          className="text-gray-500 text-lg mb-8 leading-relaxed text-center"
        >
          <p>{data?.smart_meter_fourth_card_second_table_description}</p>
        </FadeInView>

        {/* Slider Section */}
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          autoplay
          autoplaySpeed={8000}
          slidesToShow={3}
          slidesToScroll={1}
          arrows
          prevArrow={<PrevArrow />}
          nextArrow={<NextArrow />}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
          ]}
          className="relative"
        >
          {data?.smart_meter_fourth_card_second_table_options?.map((item, index) => (
            <div key={index} className="px-3 h-full">
              <div
                className="group flex flex-col justify-between p-6 bg-white rounded-2xl transition-all duration-300 hover:scale-[1.02] h-full"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 group-hover:bg-[#669933] transition-all rounded-full text-[#669933] group-hover:text-white text-xl">
                  {getIcon(index)}
                </div>
                <span className="text-gray-800 text-base font-medium">
                  {item?.options}
                </span>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SmartMeterCostSection;