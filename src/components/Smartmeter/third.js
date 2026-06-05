import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

const Smartmeter = ({ data }) => {
  if (!data) return null;

  return (
    <section className="py-10 md:py-16 px-6 md:px-12 bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 md:gap-12">
        {/* Image with green background layer */}
        <FadeInView
          direction="left"
          distance={50}
          duration={800}
          className="w-full lg:w-1/2 relative flex justify-center h-[450px]"
        >
          {/* Green background box */}
          <div className="hidden lg:absolute bottom-19 right-56 w-[65%] h-[85%] bg-gradient-to-b from-[#669933] to-[#003473] rounded-xl z-10" />

          <Image
            src={data?.smart_meter_second_card_image ? `/api/image?path=${data.smart_meter_second_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.smart_meter_second_card_alt_image || "Smart meter"}
            width={600}
            height={600}
            className="rounded-xl object-cover w-full h-full relative z-50"
            loading="eager"
          />
        </FadeInView>

        {/* Text */}
        <FadeInView
          direction="right"
          distance={50}
          duration={800}
          className="w-full lg:w-1/2 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-snug">
            {data?.smart_meter_second_card_title}
          </h2>

          {data?.smart_meter_second_card_description_table?.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 text-[#669933]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-600">{item?.description}</p>
            </div>
          ))}
        </FadeInView>
      </div>
    </section>
  );
};

export default Smartmeter;