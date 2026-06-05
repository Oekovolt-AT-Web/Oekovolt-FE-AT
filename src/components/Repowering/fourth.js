import Image from "next/image";
import { CheckCircle } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

export default function FourthCardSection({ data }) {
  return (
    <section className="max-w-7xl mx-auto py-10 md:py-16 bg-white">
      <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-stretch gap-10 lg:gap-15">
        {/* Left: Image and Text */}
        <FadeInView
          direction="left"
          distance={50}
          duration={600}
          className="lg:w-1/2"
        >
          <Image
            src={data?.fourth_card_image ? `/api/image?path=${data.fourth_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.fourth_card_alt_text || "Image"}
            width={800}
            height={600}
            className="rounded-2xl shadow-xl object-cover w-full h-full"
          />
        </FadeInView>

        {/* Right: Option Boxes */}
        <div className="lg:w-1/2 grid gap-6">
          <FadeInView
            direction="right"
            distance={50}
            duration={600}
          >
            <h2 className="text-3xl text-gray-900">
              {data?.fourth_card_title}
            </h2>
          </FadeInView>

          <FadeInView
            direction="right"
            distance={50}
            duration={600}
            delay={100}
          >
            <p className="text-gray-700 whitespace-pre-line">
              {data?.fourth_card_description}
            </p>
          </FadeInView>

          {data?.fourth_card_options?.map((item, index) => (
            <FadeInView
              key={index}
              direction="right"
              distance={30}
              duration={500}
              delay={150 + index * 100}
              className="flex items-start gap-4 bg-gray-100 p-5 rounded-xl border-l-4 border-[#669933] shadow-sm hover:shadow-md transition"
            >
              <CheckCircle size={28} className="text-[#669933] shrink-0 mt-1" />
              <p className="text-gray-800 text-base">{item?.option}</p>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}