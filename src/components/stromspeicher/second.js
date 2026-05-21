"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { FiArrowRight } from "react-icons/fi";


const umlautMap = {
  ä: "a",
  ö: "o",
  ü: "u",
  ß: "ss"
};

const createSlug = (title) => {
  return title
    .toLowerCase()
    .split("")
    .map(char => umlautMap[char] || char)
    .join("")
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]/g, "");
};


const StromSecondCardSection = ({ data }) => {

  if (!data?.strom_second_card_table.length) return null;

  return (
    <section className="w-full bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data?.strom_second_card_table.map((item, index) => {
          const slug = createSlug(item.title);

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
            >
              {/* Banner Image */}
              <div className="relative w-full h-52">
                <Image
                  src={`/api/image?path=${item.banner_image}` || "/Images/Jobs/jobs3.jpg"}
                  alt={item.alt_banner_image || "Banner Image"}
                  fill
                  className="object-cover rounded-t-2xl"
                  sizes=" 100vw"

                />
              </div>

              {/* Content */}
              <div className="pl-6 pr-6 pb-6 flex flex-col grow">
                {/* Logo */}
                {item.logo_image && (
                  <div className="relative w-24 h-18 mb-2">
                    <Image
                      src={`/api/image?path=${item.logo_image}` || "/Images/Jobs/jobs3.jpg"}
                      alt={item.alt_logo_image || "Logo"}
                      fill
                      className="object-contain"
                      sizes=" 100vw"

                    />
                  </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#669933] transition">
                  {item.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-600 whitespace-pre-line mb-6 leading-relaxed">
                  {item.main_description}
                </p>

                {/* Button */}
                <Link
                  href={`/produkte/stromspeicher/${slug}`}
                  className="mt-auto inline-flex items-center gap-2 self-start bg-[#669933] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#557a26] transition"
                >
                  Mehr Informationen <FiArrowRight className="text-lg" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StromSecondCardSection;
