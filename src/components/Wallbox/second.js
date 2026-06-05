import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

const WallboxSecondCard2 = ({ data }) => {
  if (!data) return null;

  return (
    <section className="w-full py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Left: Image or Map */}
        <FadeInView
          direction="left"
          distance={40}
          duration={600}
          className="w-full lg:w-1/2 relative aspect-[16/11] rounded-xl overflow-hidden shadow-md"
        >
          <Image
            src={data?.wallbox_second_card_image ? `/api/image?path=${data.wallbox_second_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.wallbox_second_card_image_alt || "Map"}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </FadeInView>

        {/* Right: Text */}
        <div className="w-full lg:w-1/2 space-y-6">
          <FadeInView
            direction="bottom"
            distance={20}
            duration={400}
            className="text-sm font-semibold uppercase text-[#669933]"
          >
            {data?.wallbox_second_card_subtitle}
          </FadeInView>

          <FadeInView
            direction="bottom"
            distance={20}
            duration={500}
            className="text-3xl text-gray-900"
          >
            <h3>{data?.wallbox_second_card_title}</h3>
          </FadeInView>

          <FadeInView
            direction="bottom"
            distance={20}
            duration={500}
            className="text-lg text-gray-900"
          >
            <p>{data?.wallbox_second_card_description}</p>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default WallboxSecondCard2;