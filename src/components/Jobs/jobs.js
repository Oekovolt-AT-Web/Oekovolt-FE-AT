"use client";
import React from "react";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const JobsInfo = ({ data }) => {
  return (
    <section className=" py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Row: Image + Benefits Grid */}
        <div className="flex flex-col lg:flex-row gap-12 ">
          {/* Left Column - Image */}

          <div className="lg:w-1/2">
            <h2 className="text-[28px] md:text-[35px] font-bold text-[#669933] mb-8">{data.fourth_card_title}</h2>

            {data.fourth_card_description.map((desc, index) => (
              <p key={index} className="text-gray-700 mb-8  max-w-4xl mx-auto text-[16px]">
                {desc.option}
              </p>
            ))}
          </div>
          {/* Right Column - Benefits Grid */}
          <div className="lg:w-1/2">
            <div className="relative h-full w-full rounded-lg overflow-hidden shadow-lg min-h-[400px] ">
              <Image
                          src={`${API_IMG_URL}${data.fourth_card_image}`} // Replace with your image path
              
                alt={data.fourth_card_alt_text}
                fill
                priority
                className="object-cover rounded-lg"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsInfo;
