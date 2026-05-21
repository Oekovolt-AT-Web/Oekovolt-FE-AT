"use client";
import React from "react";
import Image from "next/image";

const TechnologySection = ({ data = {} }) => {
  const {
    greenTitle = "",
    heading = "",
    description = "",
    bullets = [],
    image1 = "",
    image2 = "",
  } = data;

  return (
    <div className="bg-gray-100 w-full text-white py-10 md:py-16 px-4 md:px-10 flex flex-col lg:flex-row lg:items-center justify-center gap-10 relative overflow-hidden">
      <div className="max-w-xl lg:max-w-xl md:max-w-full z-10">
        <p className="text-[#669933] font-semibold uppercase mb-2">{greenTitle}</p>
        <h2 className="text-4xl text-gray-900 md:text-5xl font-bold leading-tight mb-6">{heading}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-semibold text-gray-600">
          {bullets.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-[#669933]">✔</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col gap-4 relative z-10">
        <div className="lg:w-120 lg:h-84 w-85 h-50 md:w-170 md:h-70 relative">
          {image1 && (
            <Image
              src={image1}
              alt="Image 1"
              fill
              sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
              className="obkect-cover rounded-md"
            />
          )}
        </div>
        <div className="w-120 h-84 relative -mt-28 ml-24 z-20 shadow-lg hidden lg:block">
          {image2 && (
            <Image
              src={image2}
              alt="Image 2"
              fill
              sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
              className="object-cover rounded-md"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnologySection;
