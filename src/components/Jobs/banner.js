
import Image from "next/image";

const JobsBannerSection = ({ data }) => {
  return (
    <section className="relative h-[300px] w-full overflow-hidden lg:h-[400px]">
      <div className="absolute inset-0">
        <Image
          src={data.image ? `/api/image?path=${data.image}` : "/Images/Jobs/jobs3.jpg"}
          alt={data.alt_image}
          fill
          quality={100}
          className="object-cover object-center w-full h-full"
          sizes="100vw"
          loading="eager"
          style={{
            objectPosition: "center center",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/60 to-transparent w-2/3"></div>
      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          <div className=" text-white">
            <h1 className="max-w-[660px] text-[28px]  md:text-[40px] font-medium mb-4">{data?.title}</h1>
            <p className="max-w-[560px] text-[20px] font-medium mb-4">{data?.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobsBannerSection;
