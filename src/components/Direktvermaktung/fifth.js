import { CheckCircle2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";


const FifthCardSection = ({ data }) => {
  const advantages = data?.fourth_card_1st_description || [];
  const challenges = data?.fourth_card_2nd_description || [];

  return (
    <section className="relative py-10 md:py-16 bg-gray-100 overflow-hidden">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#66993310] to-transparent"></div> */}
      {/* <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#f0f7e6] blur-3xl opacity-40 -mr-32 -mb-32"></div> */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <FadeInView
          direction="bottom"
          distance={30}
          duration={500}
          className="text-center mb-16"
        >
          <h2 className="text-4xl text-gray-900 mb-4">
            {data?.second_section_title}
          </h2>
          <div className="w-24 h-1 bg-[#669933] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {data?.second_section_description}
          </p>
        </FadeInView>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Advantages Card - Modern Design */}
          <FadeInView
            direction="bottom"
            distance={40}
            duration={600}
            className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#669933] to-[#8ab959]"></div>

            <div className="p-8 lg:p-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-[#f0f7e6] p-3 rounded-lg">
                  <CheckCircle2 className="text-[#669933] w-6 h-6" />
                </div>
                <h3 className="text-2xl text-gray-900">
                  {data?.fourth_card_1st_title}
                </h3>
              </div>

              <p className="text-gray-600 text-lg">
                {data?.fourth_card_1st_subtitle}
              </p>

              {data?.fourth_card_1st_image && (
                <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-md mt-4">
                  <Image
                    src={data?.fourth_card_1st_image ? `/api/image?path=${data?.fourth_card_1st_image}` : "/Images/Jobs/jobs3.jpg"}
                    alt={data?.fourth_card_1st_alt_image || "Vorteile"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              )}

              <ul className="space-y-6 mt-6">
                {advantages.map((item, index) => (
                  <FadeInView
                    key={index}
                    as="li"
                    direction="left"
                    distance={20}
                    duration={500}
                    delay={index * 100} // 0ms, 100ms, 200ms, etc.
                    className="flex items-start gap-4"
                  >
                    <div className="bg-[#669933] bg-opacity-10 p-1.5 rounded-full mt-1">
                      <CheckCircle2 className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item?.primary_paragraph}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {item?.secondary_paragraph}
                      </p>
                    </div>
                  </FadeInView>
                ))}
              </ul>
            </div>
          </FadeInView>

          {/* Challenges Card - Distinct Style */}
          <FadeInView
            direction="bottom"
            distance={40}
            duration={600}
            delay={200}  // 0.2 seconds delay
            className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-400 to-gray-300"></div>

            <div className="p-8 lg:p-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <AlertTriangle className="text-gray-600 w-6 h-6" />
                </div>
                <h3 className="text-2xl text-gray-900">
                  {data?.fourth_card_2nd_title}
                </h3>
              </div>

              <p className="text-gray-600 text-lg">
                {data?.fourth_card_2nd_subtitle}
              </p>

              {data?.fourth_card_2nd_image && (
                <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-md mt-4">
                  <Image
                    src={data?.fourth_card_2nd_image ? `/api/image?path=${data?.fourth_card_2nd_image}` : "/Images/Jobs/jobs3.jpg"}
                    alt={data?.fourth_card_2nd_alt_image || "Nachteile"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
              )}

              <ul className="space-y-6 mt-6">
                {challenges.map((item, index) => (
                  <FadeInView
                    key={index}
                    as="li"
                    direction="left"
                    distance={20}
                    duration={500}
                    delay={index * 100} // 0ms, 100ms, 200ms, etc.
                    className="flex items-start gap-4"
                  >
                    <div className="bg-gray-200 p-1.5 rounded-full mt-1">
                      <AlertTriangle className="text-gray-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item?.primary_paragraph}
                      </p>
                      <p className="text-gray-600 mt-1">
                        {item?.secondary_paragraph}
                      </p>
                    </div>
                  </FadeInView>
                ))}
              </ul>
            </div>
          </FadeInView>

        </div>

      </div>
    </section>
  );
};

export default FifthCardSection;