import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

const EnergyOfferSection = ({ data }) => {
  if (!data) return null;

  return (
    <section className="py-10 md:py-16 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-12">
        {/* Image with green background layer */}
        <FadeInView
          direction="left"
          distance={50}
          duration={800}
          className="w-full md:w-1/2 relative flex justify-center h-[450px]"
        >
          {/* Green background box */}
          <div className="hidden lg:absolute bottom-19 right-56 w-[65%] h-[85%] bg-gradient-to-b from-[#669933] to-[#003473] rounded-xl z-10" />

          <Image
            src={data?.third_card_image ? `/api/image?path=${data.third_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.third_image_alt_txt || "Energy offer"}
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
          className="w-full md:w-1/2 space-y-6"
        >
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-snug">
            {data?.third_title}
          </h2>

          <p className="text-gray-500 leading-relaxed whitespace-pre-line">
            {data?.third_card_image_description}
          </p>
        </FadeInView>
      </div>
    </section>
  );
};

export default EnergyOfferSection;