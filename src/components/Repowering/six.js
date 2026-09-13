'use client';
import { Sun, Zap, Plug } from 'lucide-react';
import Image from 'next/image';
import FadeInView from '@/components/Reusable/FadeInView';

const SixSection = ({ data }) => {
  return (
    <section className="relative bg-white py-10 md:py-16 px-6 md:px-12 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute bottom-20 right-0 w-64 h-64 rounded-full bg-[#f0f7e6] blur-3xl opacity-60 -mr-32"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern split layout with overlapping elements */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT SIDE: Image with floating info cards */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src={data?.third_sec_1st_card_image ? `/api/image?path=${data.third_sec_1st_card_image}` : "/Images/Jobs/jobs3.jpg"}
                alt={data?.third_sec_1st_card_alt_text || "Image"}
                fill
                sizes="100vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating info card 1 */}
            <div className="hidden md:block absolute -bottom-8 -left-8 md:-left-2 bg-white p-6 rounded-xl shadow-lg w-3/4 border-l-4 border-[#669933] animate-slide-up">
              <h3 className="text-xl text-gray-900 mb-2">{data?.third_sec_1st_card_first_title}</h3>
              <p className="text-gray-600">{data?.third_sec_1st_card_first_description}</p>
            </div>
          </div>

          {/* RIGHT SIDE: Modern feature cards with animated icons */}
          <div className="space-y-8">
            <FadeInView
              direction="right"
              distance={40}
              duration={800}
            >
              <div className="mb-10">
                <h2 className="text-4xl text-gray-900 mb-4">
                  <span className="text-[#669933]">{data?.third_sec_title?.split(' ')[0]}</span> {data?.third_sec_title?.split(' ').slice(1).join(' ')}
                </h2>
                <div className="w-20 h-1 bg-[#669933] rounded-full"></div>
              </div>
            </FadeInView>

            <FadeInView
              direction="bottom"
              distance={20}
              duration={600}
              delay={600}
              className="bg-ov-600 p-6 rounded-xl shadow-lg text-white"
            >
              <h3 className="text-xl mb-2">{data?.third_sec_1st_card_second_title}</h3>
              <p>{data?.third_sec_1st_card_second_description}</p>
            </FadeInView>

            <div className="grid gap-6">
              {data?.third_sec_1st_card_table_options?.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 flex gap-5 items-center group hover:-translate-y-1"
                  style={{
                    animation: `slideUp 0.5s ease-out ${0.1 * index}s forwards`,
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#669933] rounded-full opacity-10 animate-ping"></div>
                    <div className="relative w-8 h-8 p-2 bg-[#f0f7e6] rounded-full flex items-center justify-center text-[#669933]">
                      {index % 3 === 0 ? <Plug className="text-md" /> :
                        index % 3 === 1 ? <Sun className="text-md" /> :
                          <Zap className="text-xl" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-lg text-gray-900">{item?.option}</p>
                    {item?.description && (
                      <p className="text-gray-600">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUpFloating {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slideUpFloating 0.6s ease-out 0.4s forwards;
          opacity: 0;
          transform: translateY(20px);
        }
      `}</style>
    </section>
  );
};

export default SixSection;