import { Plug, Wifi } from "lucide-react";
import Image from 'next/image';
import FadeInView from '@/components/Reusable/FadeInView';

const icons = [<Plug key="plug" />, <Wifi key="wifi" />];

const RequirementsSection = ({ data }) => {
  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT SIDE: Title, Description, Image */}
        <div>
          <FadeInView
            direction="bottom"
            distance={30}
            duration={600}
            className="text-4xl text-gray-900 mb-4"
          >
            <h2>{data?.dynami_sixth_card_title}</h2>
          </FadeInView>

          <FadeInView
            direction="bottom"
            distance={20}
            duration={600}
            className="text-lg text-gray-700 mb-8 max-w-xl"
          >
            <p>{data?.dynami_sixth_card_description}</p>
          </FadeInView>

          <FadeInView
            direction="none"
            scale={0.95}
            duration={600}
            className="rounded-xl overflow-hidden shadow-lg relative w-full h-80"
          >
            <Image
              src={data?.dynami_sixth_card_image ? `/api/image?path=${data.dynami_sixth_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.dynami_sixth_card_alt_image || "Requirements"}
              fill
              className="object-cover object-center"
              sizes="100vw"
              loading="eager"
            />
          </FadeInView>
        </div>

        {/* RIGHT SIDE: Boxes */}
        <div className="space-y-8">
          {data?.dynami_sixth_card_table?.map((item, index) => (
            <FadeInView
              key={index}
              direction="right"
              distance={50}
              duration={500}
              delay={index * 150}
              className="bg-gray-100 border border-[#d8f0c2] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-[#669933] text-2xl">{icons[index % icons.length]}</div>
                <h3 className="text-xl text-[#404040]">
                  {item?.title}
                </h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{item?.description}</p>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;