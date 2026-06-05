import Image from "next/image";
import { CheckCircle, Settings, Cpu, FileText } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

const MieterstromSection = ({ data }) => {
  if (!data) return null;

  const card = {
    title: data.mieterstorm_first_card_title,
    image: data.mieterstorm_first_card_image,
    alt: data.mieterstorm_first_card_alt_image,
    description: data.mieterstorm_first_card_description,
    tableTitle: data.mieterstorm_first_card_table_title,
    features: data.mieterstorm_first_card_table || [],
  };

  const icons = [FileText, Cpu, Settings, CheckCircle];

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        {/* Image */}
        <FadeInView
          direction="left"
          distance={30}
          duration={700}
          className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-lg"
        >
          <Image
            src={card.image ? `/api/image?path=${card.image}` : "/Images/Jobs/jobs3.jpg"}
            alt={card.alt || "Oekovolt Mieterstrom"}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </FadeInView>

        {/* Text Content */}
        <FadeInView
          direction="right"
          distance={30}
          duration={700}
          delay={200}
        >
          <FadeInView
            direction="bottom"
            distance={20}
            duration={600}
            className="text-sm mb-3 font-semibold text-[#669933] uppercase tracking-wide"
          >
            {card.title}
          </FadeInView>

          <h3 className="text-2xl md:text-3xl mb-4 text-gray-800">
            {card.tableTitle}
          </h3>
          <p className="text-gray-600 mb-6">{card.description}</p>

          <div className="space-y-5">
            {card.features.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="w-6 h-6 text-[#669933]" />
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-gray-800">
                      {item.primary_paragraph}
                    </h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default MieterstromSection;