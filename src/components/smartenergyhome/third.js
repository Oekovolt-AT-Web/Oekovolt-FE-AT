import Image from "next/image";
import { CheckCircle } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

const SmartEnergyFourthSection = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative bg-gradient-to-r from-gray-100 to-[#f8fafc] py-10 md:py-16 px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        {/* Left content */}
        <FadeInView
          direction="bottom"
          distance={40}
          duration={900}
          className="space-y-6"
        >
          <h2 className="text-4xl text-gray-900 leading-tight">
            {data?.fourth_title}
          </h2>

          <p className="text-gray-700">{data?.fourth_card_description}</p>

          <div className="space-y-4">
            {data?.third_card_text?.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="text-[#669933] text-xl mt-1 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  {item?.description}
                </p>
              </div>
            ))}
          </div>
        </FadeInView>

        {/* Right Image */}
        <FadeInView
          direction="right"
          distance={50}
          duration={900}
          className="relative rounded-xl overflow-hidden shadow-2xl h-[450px]"
        >
          <Image
            src={data?.fourth_card_image ? `/api/image?path=${data.fourth_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.fourth_image_alt_txt || "Smart energy"}
            fill
            className="object-cover w-full h-full"
            sizes="100vw"
          />

          {/* Bottom Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white text-sm px-6 py-5 backdrop-blur-md">
            <p className="font-medium leading-snug">
              {data?.fourth_card_image_description}
            </p>
          </div>
        </FadeInView>
      </div>

      {/* Decorative glow element */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#669933]/30 rounded-full blur-3xl z-0" />
    </section>
  );
};

export default SmartEnergyFourthSection;