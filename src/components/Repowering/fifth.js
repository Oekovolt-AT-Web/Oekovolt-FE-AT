import Image from "next/image";
import { Sun } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

export default function SystemExpansionSection({ data }) {
  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title with decorative elements */}
        <FadeInView
          direction="bottom"
          distance={20}
          duration={600}
          className="text-center mb-16 relative"
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#669933] to-transparent opacity-70"></div>
          <h2 className="text-3xl text-gray-900">
            {data?.second_section_title}
          </h2>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#669933] to-transparent opacity-70"></div>
        </FadeInView>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Image & Text */}
          <div className="space-y-8">
            {/* Image Container */}
            <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#669933]/10 to-transparent z-10"></div>
              <Image
                src={data?.second_sec_1st_card_image ? `/api/image?path=${data.second_sec_1st_card_image}` : "/Images/Jobs/jobs3.jpg"}
                alt={data?.second_sec_1st_card_alt_image || "System expansion"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
                sizes="100vw"
              />
            </div>

            {/* Text Content with Icon */}
            <div className="relative pl-16">
              <div className="absolute left-0 top-0 w-12 h-12 bg-[#669933] rounded-lg flex items-center justify-center text-white">
                <Sun className="text-xl" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-4">
                {data?.second_sec_1st_card_title}
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {data?.second_sec_1st_card_description}
              </p>
            </div>
          </div>

          {/* Right: Enhanced Card with gradient border */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#669933] to-[#8ab959] rounded-2xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 sm:p-10 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
              <div className="flex items-start mb-6">
                <h3 className="text-2xl text-gray-900">
                  {data?.second_sec_2nd_card_title}
                </h3>
              </div>

              <div className="relative w-full h-56 sm:h-64 rounded-lg overflow-hidden mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                <Image
                  src={data?.second_sec_2nd_card_image ? `/api/image?path=${data.second_sec_2nd_card_image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={data?.second_sec_2nd_card_alt_text || "System feature"}
                  fill
                  sizes="100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="space-y-5">
                <p className="text-gray-600 leading-relaxed">
                  {data?.second_sec_2nd_card_description}
                </p>
                <div className="bg-[#f9fcf4] p-4 rounded-lg border-l-4 border-[#669933]">
                  <p className="text-gray-800 font-medium">
                    {data?.second_sec_2nd_card_important_description}
                  </p>
                </div>
                <p className="text-[#669933]">
                  {data?.second_sec_2nd_card_bold_description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}