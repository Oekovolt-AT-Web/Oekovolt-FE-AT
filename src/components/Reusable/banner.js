import React from "react";
import Image from "next/image";

const BannerSection = ({ data }) => {
  return (
    <section className="h-[300px] w-full overflow-hidden lg:h-[400px] relative">
      {/* Background Image */}
      <div className="absolute inset-0 ">
        <Image
          src={`${data?.img}`}
          alt="Banner Background"
          fill
          quality={80}
          sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
          className="object-cover w-full h-full object-center"
          loading="eager"
          style={{
            objectPosition: "center center",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/60 to-transparent w-2/3"></div>
      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4">
        <div>
          <div className="max-w-xl text-white">
            <h1 className="max-w-[660px] text-[28px]  md:text-[40px] font-medium mb-4">{data?.title}</h1>
            <p className="max-w-[560px] text-[20px] font-medium mb-4">{data?.subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
