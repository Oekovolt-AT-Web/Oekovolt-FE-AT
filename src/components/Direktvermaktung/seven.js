import FadeInView from "@/components/Reusable/FadeInView";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function SeventhhCardSection({ data }) {
  return (
    <section className="py-10 md:py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <FadeInView
          direction="bottom"
          distance={30}
          duration={600}
          className="space-y-6"
        >
          <div className="flex-col items-center gap-4">
            <Image
              src={data?.sixth_card_logo ? `/api/image?path=${data?.sixth_card_logo}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.sixth_card_alt_text_logo}
              width={250}
              height={100}
              className="mb-4"
            />
            <h2 className="uppercase text-[#669933]">
              {data?.sixth_card_title}
            </h2>
          </div>

          <h3 className="text-xl text-gray-800">
            {data?.sixth_card_subtitle}
          </h3>

          <p className="text-gray-600 whitespace-pre-line">
            {data?.sixth_card_description}
          </p>
        </FadeInView>

        {/* Right Image */}
        <FadeInView
          direction="none"
          scale={0.9}
          duration={600}
          delay={200}
        >
          <Image
            src={data?.sixth_card_image ? `/api/image?path=${data?.sixth_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.sixth_card_alt_text_image}
            width={800}
            height={500}
            className="rounded-xl shadow-lg object-cover w-full"
          />
        </FadeInView>
      </div>

      {/* Second Title + List */}
      <div className="max-w-5xl mx-auto mt-14 text-center">
        <FadeInView
          as="h3"
          direction="bottom"
          distance={20}
          duration={500}
          className="text-2xl text-gray-800"
        >
          {data?.sixth_card_second_title}
        </FadeInView>

        <FadeInView
          as="p"
          direction="bottom"
          distance={10}
          duration={500}
          delay={100}
          className="text-[#669933] text-lg mt-2"
        >
          {data?.sixth_card_second_subtitle}
        </FadeInView>

        {/* List with staggered children */}
        <div className="mt-8 text-left grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data?.sixth_card_second_table_description?.map((item, idx) => (
            <FadeInView
              key={idx}
              as="li"
              direction="left"
              distance={20}
              duration={500}
              delay={idx * 150} // 0ms, 150ms, 300ms, etc.
              className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <CheckCircle className="text-[#669933] mt-1" />
              <span className="text-gray-700">{item?.option}</span>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}