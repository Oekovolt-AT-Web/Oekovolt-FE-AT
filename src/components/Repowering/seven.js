import { Sun, ArrowRight, BatteryFull } from "lucide-react";
import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

export default function RepoweringSection({ data }) {
  return (
    <section className="w-full px-6 md:px-12 py-10 md:py-16 bg-gray-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#f0f7e6] rounded-full blur-3xl opacity-40 -mr-32 -mt-32"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern split layout with visual contrast */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left Side - Enhanced media gallery */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First feature card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#f0f7e6] p-3 rounded-lg">
                    <Sun className="text-2xl text-[#669933]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {data?.third_sec_2nd_card_first_table_title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {data?.third_sec_2nd_card_first_table?.map((item, idx) => (
                    <FadeInView
                      key={idx}
                      direction="right"
                      distance={10}
                      duration={400}
                      delay={idx * 100}
                      className="flex items-start gap-3"
                    >
                      <div className="bg-[#669933] bg-opacity-10 p-1 rounded-full mt-1">
                        <ArrowRight className="text-white text-xs" />
                      </div>
                      <span className="text-gray-700 text-lg">{item?.option}</span>
                    </FadeInView>
                  ))}
                </ul>
              </div>

              {/* Second feature card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#f0f7e6] p-3 rounded-lg">
                    <BatteryFull className="text-2xl text-[#669933]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {data?.third_sec_2nd_card_second_table_title}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {data?.third_sec_2nd_card_second_table?.map((item, idx) => (
                    <FadeInView
                      key={idx}
                      direction="right"
                      distance={10}
                      duration={400}
                      delay={idx * 100}
                      className="flex items-start gap-3"
                    >
                      <div className="bg-[#669933] bg-opacity-10 p-1 rounded-full mt-1">
                        <BatteryFull className="text-white text-xs" />
                      </div>
                      <span className="text-gray-700 text-lg">{item?.option}</span>
                    </FadeInView>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Modern comparison cards */}
          <div className="w-full lg:w-1/2 space-y-8">
            <FadeInView
              direction="bottom"
              distance={40}
              duration={700}
            >
              <div className="space-y-6">
                <h2 className="text-4xl text-gray-900">
                  <span className="text-[#669933]">{data?.third_sec_2nd_card_title?.split(' ')[0]}</span> {data?.third_sec_2nd_card_title?.split(' ').slice(1).join(' ')}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                  {data?.third_sec_2nd_card_description}
                </p>
              </div>
            </FadeInView>

            <div className="grid grid-cols-2 gap-6">
              {/* First image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl group hover:scale-[1.01] transition-transform duration-300">
                <Image
                  src={data?.third_sec_2nd_card_first_image ? `/api/image?path=${data.third_sec_2nd_card_first_image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={data?.third_sec_2nd_card_first_alt_text || "Before"}
                  width={800}
                  height={450}
                  className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Second image */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl group hover:scale-[1.01] transition-transform duration-300">
                <Image
                  src={data?.third_sec_2nd_card_second_image ? `/api/image?path=${data.third_sec_2nd_card_second_image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={data?.third_sec_2nd_card_second_alt_image || "After"}
                  width={800}
                  height={450}
                  className="w-full h-auto aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}