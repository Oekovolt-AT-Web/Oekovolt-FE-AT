"use client";
import React from "react";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const JobsTechnologySection = ({data}) => {
  return (
    <div className="bg-gray-100 w-full text-white py-10 md:py-16 px-6 md:px-12 flex flex-col lg:flex-row lg:items-center justify-center gap-10 relative overflow-hidden">
      <div className="max-w-xl lg:max-w-xl md:max-w-full z-10">
        <p className="text-[#669933] font-semibold uppercase mb-2">{data.third_card_title}</p>
        <h2 className="text-4xl text-gray-900 md:text-5xl font-bold leading-tight mb-6">{data.third_card_subtitle}</h2>
        <p className="text-gray-600 mb-6">{data.third_card_description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-gray-600">
          {data.third_card_table.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#669933]">✔</span>
              {item.option}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col gap-4 relative z-10">
        <div className="lg:w-120 lg:h-84 w-85 h-50 md:w-170 md:h-70 relative">
          {data.third_card_first_image && (
            <Image
            src={`${API_IMG_URL}${data.third_card_first_image}`} // Replace with your image path
              alt={data.third_card_fisrt_alt_text}
              fill
                sizes="100vw"

              className="rounded-md object-cover"
            />
          )}
        </div>
        <div className="w-120 h-84 relative -mt-28 ml-24 z-20 shadow-lg hidden lg:block">
          {data.third_card_second_image && (
            <Image
            src={`${API_IMG_URL}${data.third_card_second_image}`} // Replace with your image path
              alt={data.third_card_second_alt_text}
            fill
                sizes="100vw"

              className="rounded-md object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsTechnologySection;
