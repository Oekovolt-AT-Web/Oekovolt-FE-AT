import { CircleCheck } from "lucide-react";
import Image from 'next/image'
import FadeInView from '@/components/Reusable/FadeInView'

export default function ThirdCardSection({ data }) {
  return (
    <section className="">
      {/* White Section with Header + First Feature Row */}
      <div className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

          {/* Header section */}
          <FadeInView
            direction="top"
            distance={20}
            duration={600}
            className="text-center mb-16"
          >
            <h2 className="text-4xl text-gray-900 mb-4">
              <span className="text-[#669933]">{data?.third_sec_title?.split(' ')[0]}</span>{' '}
              {data?.third_sec_title?.split(' ').slice(1).join(' ')}
            </h2>
            <div className="w-24 h-1 bg-[#669933] mx-auto rounded-full"></div>
          </FadeInView>

          {/* First Feature Row */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={data?.third_sec_3rd_card_first_image ? `/api/image?path=${data.third_sec_3rd_card_first_image}` : "/Images/Jobs/jobs3.jpg"}
                alt={data?.third_sec_3rd_card_first_alt_text || "Image"}
                width={800}
                height={600}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl text-gray-900">
                  {data?.third_sec_3rd_card_first_title}
                </h3>
              </div>

              <ul className="space-y-4">
                {data?.third_sec_3rd_card_first_options_table?.map((item, index) => (
                  <FadeInView
                    key={index}
                    direction="left"
                    distance={10}
                    duration={400}
                    delay={index * 100}
                    className="flex items-start"
                  >
                    <CircleCheck className="text-[#669933] w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item?.option}</span>
                  </FadeInView>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width gray background reversed section */}
      <div className="w-full bg-gray-100 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2 relative rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={data?.third_sec_3rd_card_second_card ? `/api/image?path=${data.third_sec_3rd_card_second_card}` : "/Images/Jobs/jobs3.jpg"}
                alt={data?.third_sec_3rd_card_second_alt_text || "Image"}
                width={800}
                height={600}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            <div className="lg:w-1/2">
              <div className="flex items-stretch gap-4 mb-6">
                <h3 className="text-2xl text-gray-900">
                  {data?.third_sec_3rd_card_second_title}
                </h3>
              </div>

              <ul className="space-y-4">
                {data?.third_sec_3rd_card_second_options_table?.map((item, index) => (
                  <FadeInView
                    key={index}
                    direction="left"
                    distance={10}
                    duration={400}
                    delay={index * 100}
                    className="flex items-start"
                  >
                    <CircleCheck className="text-[#669933] w-6 h-6 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item?.option}</span>
                  </FadeInView>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}