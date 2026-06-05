import FadeInView from "@/components/Reusable/FadeInView";
import Image from "next/image";

const FinancingBenefitsSection = ({ data }) => {
  return (
    <section className="w-full">
      {data?.finanzierung_second_card_table?.map((item, index) => (
        <div
          key={index}
          className={`w-full ${
            index % 2 === 1 ? "bg-white" : "bg-gray-100"
          } py-10 md:py-16 px-6 md:px-12`}
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Alternate layout direction */}
            <div
              className={`flex flex-col-reverse w-full ${
                index % 2 === 0
                  ? "lg:flex-row"
                  : "lg:flex-row-reverse"
              } items-center gap-12`}
            >
              {/* Image - with scale effect */}
              <FadeInView
                direction="none"
                scale={0.95}
                duration={600}
                className="w-full lg:w-1/2 h-[280px] sm:h-[400px] lg:h-[450px] relative overflow-hidden rounded-xl shadow-md"
              >
                <Image
                  src={item?.image ? `/api/image?path=${item?.image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={item?.alt_text}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </FadeInView>

              {/* Text Content - with slide up effect */}
              <FadeInView
                direction="bottom"
                distance={30}
                duration={700}
                delay={200}
                className="w-full lg:w-1/2 space-y-5"
              >
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl md:text-3xl text-[#0a1e35]">
                    {item?.title}
                  </h3>
                </div>
                <p className="text-gray-700 text-base md:text-lg whitespace-pre-line">
                  {item?.description}
                </p>
              </FadeInView>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FinancingBenefitsSection;