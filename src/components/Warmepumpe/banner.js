import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const WarmepumpeBanner = ({data}) => {

      if (!data) return null;

  return (
    <section className="relative w-full bg-gray-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
        src={`${API_IMG_URL}${data.warmepumpe_banner_image}`}
          alt={data.warmepumpe_alt_text_image_banner || "Wärmepumpe Banner"}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black opacity-50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-lg  font-medium text-[#669933] mb-6 uppercase">
          {data.warmepumpe_title}
        </h1>
        <h2 className="text-2xl mb-6">
          {data.warmepumpe_subtitle}
        </h2>
        <p className="text-base mx-auto text-gray-200 leading-relaxed">
          {data.warmepumpe_description}
        </p>
      </div>
    </section>
  );
};

export default WarmepumpeBanner;
