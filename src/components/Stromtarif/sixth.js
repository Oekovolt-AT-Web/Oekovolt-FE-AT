import { CheckCircle } from "lucide-react";
import Image from 'next/image';
import FadeInView from '@/components/Reusable/FadeInView';

const FlexibleBenefitsSection = ({ data }) => {
  return (
    <section className="bg-white py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <FadeInView
          direction="bottom"
          distance={20}
          duration={600}
          className="text-3xl text-center text-gray-900 mb-10"
        >
          <h2>{data?.dynami_fifth_card_title}</h2>
        </FadeInView>

        {/* Image */}
        <FadeInView
          direction="none"
          scale={0.95}
          duration={600}
          className="w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-xl my-10 relative"
        >
          <Image
            src={data?.dynami_fifth_card_image ? `/api/image?path=${data.dynami_fifth_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.dynami_fifth_card_alt_text || "Benefits"}
            fill
            className="object-cover object-center"
            sizes="100vw"
            loading="eager"
          />
        </FadeInView>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data?.dynami_fifth_card_table?.map((item, index) => (
            <FadeInView
              key={index}
              direction="bottom"
              distance={40}
              duration={500}
              delay={index * 100}
              className="group border border-gray-100 rounded-2xl px-6 py-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Optional Icon */}
              <div className="flex justify-center mb-4">
                <CheckCircle className="text-[#669933] text-3xl group-hover:scale-110 transition-transform" />
              </div>

              <h3 className="text-lg text-gray-800 mb-2">
                {item?.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item?.description}
              </p>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlexibleBenefitsSection;