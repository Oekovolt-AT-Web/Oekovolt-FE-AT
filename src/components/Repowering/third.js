import { CheckCircle2, BarChart3, MonitorSmartphone } from "lucide-react";
import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

const icons = [BarChart3, MonitorSmartphone, CheckCircle2];

const PhotovoltaikOptimization = ({ data }) => {
  return (
    <section className="py-10 md:py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeInView
          direction="bottom"
          distance={20}
          duration={600}
          className="text-3xl text-gray-900"
        >
          <h2>{data?.second_card_title}</h2>
        </FadeInView>

        <FadeInView
          direction="bottom"
          distance={0}
          duration={600}
          delay={300}
          className="ov-measure text-gray-700 text-lg leading-relaxed mt-5"
        >
          <p>{data?.second_card_description}</p>
        </FadeInView>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start mt-10">
        {/* Left Side: Image and Text */}
        <div className="w-full lg:w-1/2 space-y-6">
          <FadeInView
            direction="none"
            scale={0.95}
            duration={600}
            className="w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg relative"
          >
            <Image
              src={data?.second_card_image ? `/api/image?path=${data.second_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.second_card_alt_text || "Photovoltaik image"}
              fill
              className="object-cover object-center"
              loading="eager"
              sizes="100vw"
            />
          </FadeInView>
        </div>

        {/* Right Side: Feature Boxes */}
        <div className="w-full lg:w-1/2 space-y-6">
          {data?.second_card_options?.map((option, index) => {
            const Icon = icons[index % icons.length];
            return (
              <FadeInView
                key={index}
                direction="right"
                distance={30}
                duration={500}
                delay={index * 200}
                className="flex items-start gap-4 bg-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="min-w-[48px] h-12 w-12 flex items-center justify-center rounded-full bg-[#669933]/10 text-[#669933] shadow-sm">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg text-[#333]">
                    {option?.primary_paragraph}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">
                    {option?.secondary_paragraph}
                  </p>
                </div>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PhotovoltaikOptimization;