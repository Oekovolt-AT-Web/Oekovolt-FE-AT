import { API_IMG_URL } from "@/lib/apiImgUrl";
import Image from "next/image";

const BannerSection = ({ data }) => {
  return (
    <section className="relative w-full h-auto lg:h-[500px] flex flex-col lg:flex-row overflow-hidden bg-[#0a1e35]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={`${API_IMG_URL}${data.finanzierung_image}`}
          alt={data.finanzierung_alt_text || "Banner Image"}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      </div>

      {/* Diagonal Layers (desktop only) */}
      <div className="absolute inset-0 z-10 overflow-hidden hidden lg:block">
        <div className="absolute left-[35%] top-0 w-[15%] h-full bg-[#669933] transform -skew-x-[25deg] origin-left opacity-80" />
        <div className="absolute left-[40%] top-0 w-[75%] h-full bg-[#003473] transform -skew-x-[25deg] origin-left opacity-70" />
        <div className="absolute left-[47%] top-0 w-[45%] h-full bg-gray-100 transform -skew-x-[25deg] origin-left opacity-95" />
      </div>

      {/* Content wrapper */}
      <div className="relative z-20 w-full flex flex-col lg:flex-row">
        {/* Image section on mobile/tablet, stays empty on desktop */}
        <div className="w-full lg:w-1/2 h-[250px] sm:h-[300px] lg:h-auto hidden relative">
          <Image
            src={`${API_IMG_URL}${data.finanzierung_image}`}
            alt={data.finanzierung_alt_text || "Banner Image"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>

        {/* Left blank on desktop (image behind diagonals) */}
        <div className="hidden lg:block lg:w-1/2" />

        {/* Text content */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-6 py-10 md:px-10 lg:pl-4 lg:pr-46 bg-white/80 lg:bg-transparent">
          <div className="max-w-xl space-y-2 text-center lg:text-left">
            <p className="text-md  text-[#669933] uppercase ">
              {data.finanzierung_subtitle}
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 drop-shadow-lg ">
              {data.finanzierung_title}
            </h2>
            <p className="text-base sm:text-lg lg:text-lg leading-relaxed text-gray-700 drop-shadow-lg">
              {data.finanzierung_description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
