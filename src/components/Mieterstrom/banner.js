"use client";
import Image from "next/image";


const MieterstromBanner = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative h-[360px] md:h-[400px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={data?.mieterstorm_banner_image ? `/api/image?path=${data.mieterstorm_banner_image}` : "/Images/Jobs/jobs3.jpg"}
          alt={data.mieterstorm_banner_alt_image || "Banner Background"}
          fill
          quality={100}
          className="object-cover w-full h-full"
          priority
          sizes="100vw"
        />
      </div>

      {/* Right shadow overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-l from-[#669933]/60 via-black/10 to-transparent"></div>

      {/* Left overlay with angled edge (hidden on mobile) */}
      <div className="absolute inset-y-0 left-0 w-full max-w-[1300px] bg-gray-100 z-20 clip-path-banner hidden md:block"></div>

      {/* Mobile simple overlay (no clip-path) */}
      <div className="absolute inset-0 bg-gray-100/90 z-20 lg:hidden"></div>

      {/* Text Content */}
      <div className="relative z-30 h-full flex items-center px-4  lg:px-[186px]">
        <div className="text-gray-800 max-w-2xl">
          <span className="uppercase text-sm tracking-widest text-[#669933] block mb-3">
            {data.mieterstorm_banner_title}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl  mb-3">
            {data.mieterstorm_banner_subtitle}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {data.mieterstorm_banner_description}
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .clip-path-banner {
            clip-path: polygon(0 0, 80% 0, 70% 100%, 0% 100%);
          }
        }
      `}</style>
    </section>
  );
};

export default MieterstromBanner;
