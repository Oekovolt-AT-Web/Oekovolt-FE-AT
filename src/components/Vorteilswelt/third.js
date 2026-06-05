import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

const ReferralStepsSection = ({ data }) => {
  return (
    <section className="w-full bg-gray-100 text-white pb-9 md:pb-15 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <FadeInView
          direction="bottom"
          distance={20}
          duration={600}
          className="text-3xl md:text-4xl text-gray-900 text-center mb-12"
        >
          <h2>{data?.second_card_title}</h2>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data?.second_card_table?.map((step, index) => (
            <FadeInView
              key={index}
              direction="bottom"
              distance={30}
              duration={400}
              delay={index * 200}
              className="bg-white text-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center"
            >
              {/* Icon Image */}
              <div className="relative w-14 h-14 mb-4">
                <Image
                  src={step?.image ? `/api/image?path=${step.image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={step?.alt_text || `Step ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>

              <h3 className="text-lg font-semibold">{step?.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step?.description}</p>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReferralStepsSection;