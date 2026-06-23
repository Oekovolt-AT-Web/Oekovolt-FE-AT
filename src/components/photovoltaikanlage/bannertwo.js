"use client";
import Image from "next/image";
import { CheckCircle, Sun } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

const SolvixBanner = ({ data }) => {
  if (!data) return null;

  return (
    <section className="w-full px-4 md:px-12 py-10 md:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* LEFT CONTENT */}
        <div className="w-full lg:w-1/2 space-y-2">
          <FadeInView
            direction="bottom"
            distance={20}
            duration={600}
            className="text-sm font-semibold text-[#669933] uppercase tracking-wide"
          >
            {data?.photovoltaik_description || ""}
          </FadeInView>
          <h1>
            <FadeInView
              direction="bottom"
              distance={30}
              duration={800}
              className="text-4xl leading-tight text-gray-900"
            >
              {data?.photovoltaik_title || ""}
            </FadeInView>
          </h1>


          <div className="space-y-4">
            {data?.photovoltaik_options?.map((opt, index) => (
              <FadeInView
                key={index}
                direction="left"
                distance={20}
                duration={500}
                delay={index * 150}
                className="flex gap-3 items-start"
              >
                <CheckCircle className="text-[#669933] w-5 h-5 mt-1" />
                <p className="text-gray-700 text-lg leading-relaxed">
                  {opt?.first_header_options || ""}{" "}
                  {opt?.second_text_paragraph || ""}
                </p>
              </FadeInView>
            ))}
          </div>

          {/* Statistics Cards */}
          <FadeInView
            direction="none"
            scale={0.9}
            duration={800}
            delay={300}
            className="bg-[#f5fce9] rounded-xl p-6 mt-8 grid md:grid-cols-3 gap-6 text-center text-[#003473]"
          >
            <div className="transition-transform duration-300 hover:scale-105">
              <h3 className="text-3xl font-semibold text-[#669933]">
                {data?.first_statistic_value?.toLocaleString("de-DE")}
                {data?.first_value_suffix || ""}
              </h3>
              <p>{data?.first_statistic_title || ""}</p>
            </div>
            <div className="transition-transform duration-300 hover:scale-105">
              <h3 className="text-3xl font-semibold text-[#669933]">
                {data?.second_statistic_value?.toLocaleString("de-DE")}
                {data?.second_value_suffix || ""}
              </h3>
              <p>{data?.second_statistic_title || ""}</p>
            </div>
            <div className="transition-transform duration-300 hover:scale-105">
              <h3 className="text-3xl font-semibold text-[#669933]">
                {data?.third_statistic_value?.toLocaleString("de-DE")}{" "}
                {data?.third_value_suffix || ""}
              </h3>
              <p>{data?.third_statistic_title || ""}</p>
            </div>
          </FadeInView>
        </div>

        {/* RIGHT IMAGE */}
        <FadeInView
          direction="none"
          scale={0.95}
          duration={700}
          delay={300}
          className="w-full lg:w-1/2 relative lg:h-[520px] h-80"
        >
          <Image
            src={data?.photovoltaik_banner_image ? `/api/image?path=${data?.photovoltaik_banner_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.photovoltaik_alt_banner_image || "Photovoltaik"}
            fill
            className="rounded-2xl object-cover"
            loading="eager"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Animated moving box - pure CSS animation */}
          <div className="hidden md:flex absolute bottom-4 left-0 bg-white rounded-lg shadow-xl p-4 w-64 items-center gap-4 animate-slide-x">
            <div className="flex items-center justify-center rounded-full text-white">
              <Sun className="text-xl text-[#669933] w-10 h-10" />
            </div>
            <p className="text-sm text-gray-800 font-medium">
              Entdecken Sie die Kraft der Solartechnologie.
            </p>
          </div>
        </FadeInView>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes slideX {
          0% {
            transform: translateX(130%);
          }
          50% {
            transform: translateX(150%);
          }
          100% {
            transform: translateX(130%);
          }
        }
        
        .animate-slide-x {
          animation: slideX 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default SolvixBanner;