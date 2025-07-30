import { API_IMG_URL } from "@/lib/apiImgUrl";
import Image from "next/image";

const RecommendationSection2 = ({ data }) => {
  return (
    <div className="w-full">
      {/* First Row - Text Right / Image Left */}
      {data.first_card_table[0] && (
        <section className="bg-white py-10 md:py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 md:px-12">
            {/* Text */}
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-3xl md:text-4xl text-gray-900">
                {data.first_card_table[1].title}
              </h2>
              <div className="w-20 h-1 bg-[#669933]" />
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {data.first_card_table[1].description}
              </p>
            </div>

            {/* Image */}
            <div className="relative w-full aspect-video lg:aspect-auto lg:min-h-[400px] rounded-xl overflow-hidden order-1 lg:order-2">
              <Image
                src={`${API_IMG_URL}${data.first_card_table[1].image}`}
                alt={data.first_card_table[1].alt_text || "Section image"}
                fill
                className="object-cover"
                priority
                                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

              />
            </div>
          </div>
        </section>
      )}

      {/* Second Row - Text Left / Image Right */}
      {data.first_card_table[1] && (
        <section className="bg-gray-100 py-10 md:py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-6 md:px-12">
            {/* Image */}
            <div className="relative w-full aspect-video lg:aspect-auto lg:min-h-[400px] rounded-xl overflow-hidden">
              <Image
                src={`${API_IMG_URL}${data.first_card_table[0].image}`}
                alt={data.first_card_table[0].alt_text || "Section image"}
                fill
                className="object-cover"
                priority
                                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

              />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl text-gray-900">
                {data.first_card_table[0].title}
              </h2>
              <div className="w-20 h-1 bg-[#669933]" />
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                {data.first_card_table[0].description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Third Row - Centered Overlay on Image */}
      {data.first_card_table[2] && (
        <section className="relative min-h-[500px] lg:min-h-[600px]">
          <div className="absolute inset-0">
            <Image
              src={`${API_IMG_URL}${data.first_card_table[2].image}`}
              alt={data.first_card_table[2].alt_text || "Section image"}
              fill
              className="object-cover"
              priority
                                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto flex items-center justify-center min-h-[500px] lg:min-h-[600px] px-6 text-center">
            <div className="space-y-6 text-white">
              <h2 className="text-3xl md:text-4xl">
                {data.first_card_table[2].title}
              </h2>
              <div className="w-20 h-1 bg-[#669933] mx-auto" />
              <p className="text-base md:text-lg leading-relaxed">
                {data.first_card_table[2].description}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecommendationSection2;
