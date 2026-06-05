

import { Zap, Leaf, Recycle, Wrench } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

// Icon mapping
const iconMap = {
  Zukunftssicher: <Recycle className="text-[#669933] text-3xl" />,
  Umweltfreundlich: <Leaf className="text-[#669933] text-3xl" />,
  Kostenersparnis: <Zap className="text-[#669933] text-3xl" />,
  "Einfache Installation": <Wrench className="text-[#669933] text-3xl" />,
};

const WallboxFeatures2 = ({ data }) => {
  const features = data?.wallbox_first_card_options || [];

  return (
    <section className="py-10 md:py-16 bg-gray-100">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <FadeInView
          direction="bottom"
          distance={30}
          duration={600}
          className="text-4xl text-center mb-14 text-gray-800"
        >
          <h2>
            {data?.wallbox_first_card_title?.split("Ökovolt").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="text-[#669933]">Ökovolt</span>
                )}
              </span>
            ))}
          </h2>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FadeInView
              key={feature?.title || index}
              direction="bottom"
              distance={30}
              duration={500}
              delay={index * 200}
              className="relative bg-white border border-gray-200 p-6 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#669933]/10 rounded-full flex items-center justify-center shadow-md">
                {iconMap[feature?.title] || <Zap className="text-[#669933] text-2xl" />}
              </div>

              <div className="mt-10 text-center">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#669933] transition-colors duration-200">
                  {feature?.title}
                </h3>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                  {feature?.description}
                </p>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WallboxFeatures2;