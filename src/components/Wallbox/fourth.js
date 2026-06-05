import Image from 'next/image';
import { CheckCircle } from "lucide-react";
import FadeInView from '@/components/Reusable/FadeInView';

const WallboxThirdCard = ({ data }) => {
  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden relative max-w-7xl mx-auto">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-15 items-center mb-[-25]">
          {/* Image Section */}
          <FadeInView
            direction="left"
            distance={40}
            duration={700}
            className="relative h-80 lg:h-[500px] rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src={data?.wallbox_third_card_image ? `/api/image?path=${data.wallbox_third_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.wallbox_third_card_image_alt || 'Wallbox Vorteile'}
              fill
              className="rounded-xl object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#669933]/60 to-transparent" />
          </FadeInView>

          {/* Content Section */}
          <FadeInView
            direction="bottom"
            distance={40}
            duration={600}
          >
            <h2 className="text-3xl text-gray-900 mb-6">
              {data?.wallbox_third_card_title}
            </h2>

            <ul className="space-y-5">
              {data?.wallbox_third_card_table?.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <CheckCircle className="mt-1 text-[#669933] text-xl shrink-0" />
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {item?.primary_text}
                    </p>
                    <p className="text-gray-600">{item?.secondary_text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default WallboxThirdCard;