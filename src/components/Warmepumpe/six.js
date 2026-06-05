import Image from 'next/image';
import { Clock, Euro, CheckCircle, Rocket } from "lucide-react";
import FadeInView from '@/components/Reusable/FadeInView';

const iconMap = [Clock, Euro, CheckCircle, Rocket];

export default function WarmepumpeFinancingSection({ data }) {
  return (
    <section className="bg-white py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Right side - Image + Text */}
        <FadeInView
          direction="right"
          distance={50}
          duration={700}
          delay={100}
          className="relative w-full"
        >
          <div className="w-full h-[300px] relative rounded-xl shadow-lg overflow-hidden mb-6">
            <Image
              src={data?.warmepumpe_fourth_card_image ? `/api/image?path=${data.warmepumpe_fourth_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.warmepumpe_fourth_card_image_alt || "Financing"}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <h3 className="text-2xl text-gray-800 mb-4">
            {data?.warmepumpe_fourth_card_title}
          </h3>

          <p className="text-gray-700">
            {data?.warmepumpe_fourth_card_first_description}
          </p>
        </FadeInView>

        {/* Left side - Options list */}
        <div>
          <FadeInView
            direction="left"
            distance={50}
            duration={700}
            className="text-2xl text-[#669933] mb-6"
          >
            <h3>{data?.warmepumpe_fourth_card_options_title}</h3>
          </FadeInView>

          <div className="space-y-6">
            {data?.warmepumpe_fourth_card_options_table?.map((item, index) => {
              const Icon = iconMap[index % iconMap.length];
              return (
                <FadeInView
                  key={index}
                  direction="bottom"
                  distance={20}
                  duration={500}
                  delay={index * 100}
                  className="flex gap-4 items-start"
                >
                  <Icon className="text-[#669933] text-xl mt-1" />
                  <div>
                    <h4 className="text-lg font-medium text-gray-800">
                      {item?.primary_text}
                    </h4>
                    <p className="text-sm text-gray-600">{item?.secondary_text}</p>
                  </div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}