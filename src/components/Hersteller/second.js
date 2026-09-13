"use client";
import { useState } from "react";
import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";
import { ArrowRight } from "lucide-react";

const HerstellerSection = ({ data }) => {
  const { hersteller_title, hersteller_description, hersteller_data_table } = data;
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCategory = hersteller_data_table?.[activeIndex];

  return (
    <section className="py-10 md:py-16 lg:mb-[-60] mb-[-40]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <FadeInView
            direction="left"
            distance={50}
            duration={500}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-6">
              <h3 className="text-2xl text-gray-900 mb-6">Kategorien</h3>
              <ul className="space-y-3">
                {hersteller_data_table?.map((cat, i) => (
                  <li
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`cursor-pointer group flex justify-between items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${i === activeIndex
                      ? "bg-ov-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <span className="font-medium text-lg">
                      {cat?.hersteller_category}
                    </span>
                    <ArrowRight
                      className={`text-2xl transition-transform duration-300 ${i === activeIndex
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-2 opacity-0 group-hover:opacity-80"
                        }`}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </FadeInView>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeCategory?.hersteller_list?.map((item, i) => {
              const isEven = i % 2 === 1;
              return (
                <FadeInView
                  key={i}
                  direction="bottom"
                  distance={50}
                  duration={500}
                  delay={i * 200} // 0ms, 200ms, 400ms, etc.
                  className={`bg-white flex flex-col lg:flex-row ${isEven ? "lg:flex-row-reverse" : ""
                    } gap-10 p-5 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100`}
                >
                  {/* Image (banner) */}
                  {item?.banner_image && (
                    <div className="lg:w-1/2 relative">
                      <Image
                        src={item?.banner_image ? `/api/image?path=${item?.banner_image}` : "/Images/Jobs/jobs3.jpg"}
                        alt={item?.alt_banner_image || "Banner"}
                        width={1500}
                        height={500}
                        className="rounded-2xl object-cover w-full h-full"
                      />

                      {item?.logo_image && (
                        <div className="absolute top-4 left-4 p-2 z-10 max-w-[120px] bg-white/80 rounded-xl">
                          <div className="relative w-[100px] h-[30px]">
                            <Image
                              src={item?.logo_image ? `/api/image?path=${item?.logo_image}` : "/Images/Jobs/jobs3.jpg"}
                              alt={item?.alt_logo_image || item?.title}
                              fill
                              className="object-contain"
                              sizes="100vw"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Text and logo */}
                  <div className="flex flex-col gap-3 justify-center lg:w-1/2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-2xl md:text-3xl text-[#669933]">
                          {item?.title}
                        </h4>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {item?.main_description}
                    </p>
                  </div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HerstellerSection;