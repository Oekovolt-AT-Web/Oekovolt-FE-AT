import Image from "next/image";

const HeroEnergy = ({ data }) => {

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row items-center gap-10 px-6 md:px-12 py-10 md:py-16 bg-white">

      {/* Image section */}
      <div className="w-full lg:w-1/2 relative px-6">
        {/* Gradient box - hidden on mobile */}
        <div className="hidden lg:block absolute -top-1.75 left-4.25 w-72 h-72 bg-linear-to-b from-[#669933] to-[#003473] rounded-tl-[145px] z-0" />

        <div className="relative z-10">
          <Image
            src={data?.first_card_image ? `/api/image?path=${data?.first_card_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.first_card_alt_text}
            className="rounded-tl-[140px] w-full h-auto"
            width={570}
            height={300}
            quality={80}

          />
        </div>
      </div>

      {/* Text section */}
      <div className="w-full lg:w-1/2 text-gray-800 space-y-6 px-6">
        <h2 className="text-3xl">{data?.first_card_title}</h2>
        <h4>{data?.first_card_subtitle}</h4>

        <div className="relative pl-4 text-gray-600">
          <div className="absolute top-0 left-0 h-full w-1 bg-linear-to-b from-[#669933] to-[#003473]" />
          <div className="pl-4">

            <p className="text-gray-700  whitespace-pre-line">
              {data?.first_card_description}
            </p>

          </div>
        </div>
      </div>

      {/* Decorative solar icon - bottom right */}
      <div className="hidden xlg:block absolute bottom-4 right-4 lg:-bottom-5 lg:-right-50 z-0">
        <div className="relative w-20 lg:w-62.5 aspect-square">
          <Image
            src="/Images/Jobs/solar.png"
            alt="Solar Icon"
            fill
            quality={80}

            className="object-contain"
            sizes=" 100vw"

          />
        </div>
      </div>
    </div>
  );
};

export default HeroEnergy;
