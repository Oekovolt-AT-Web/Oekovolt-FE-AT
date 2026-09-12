"use client";
import React from "react";
import Image from "next/image";
import GoogleReviewsCarousel from "./googlereview";
import FadeInView from "@/components/Reusable/FadeInView";

const ReviewsPage = ({ data }) => {
  if (!data) return null;

  return (
    <div className="py-10 md:py-16 bg-gray-100">
      <div className="flex-col max-w-7xl mx-auto space-y-10 px-6 md:px-12">
        {/* Top Section - Image and Text */}
        <div className="sm:flex-col md:flex-row lg:flex items-center justify-between w-full gap-16">
          {/* Left Content */}
          <FadeInView
            direction="left"
            distance={30}
            duration={600}
            delay={200}
            className="lg:w-1/2 space-y-4"
          >
            <FadeInView
              direction="bottom"
              distance={20}
              duration={600}
              className="text-sm font-semibold text-[#669933] uppercase tracking-wide"
            >
              {data?.photovoltaik_title_second_card}
            </FadeInView>
            <h3 className="text-4xl md:mb-5 lg:mb-0">
              {data?.photovoltaik_subtitle_second_card}
            </h3>
          </FadeInView>

          {/* Right Image */}
          <FadeInView
            direction="right"
            distance={30}
            duration={600}
            delay={200}
            className="lg:w-1/2 mt-10 md:mt-0"
          >
            <Image
              src={data?.photovoltaik_image_second_card ? `/api/image?path=${data?.photovoltaik_image_second_card}` : "/Images/Jobs/jobs3.jpg"}
              width={600}
              height={300}
              quality={80}
              alt={data?.photovoltaik_image_second_card_alt || "Reviews"}
              className="object-cover object-center rounded-xl"
            />
          </FadeInView>
        </div>

        {/* Google Reviews Carousel Section */}
        <FadeInView
          direction="bottom"
          distance={40}
          duration={600}
          delay={300}
        >
          <GoogleReviewsCarousel />
        </FadeInView>
      </div>
    </div>
  );
};

export default ReviewsPage;