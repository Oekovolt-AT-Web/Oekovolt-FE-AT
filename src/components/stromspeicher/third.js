import Image from "next/image";
import { FiShield, FiSun, FiTrendingDown, FiZap } from "react-icons/fi";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const iconList = [FiShield, FiSun, FiTrendingDown, FiZap];

const StromThirdCardSection = ({ data }) => {
  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12 w-full">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={`${API_IMG_URL}${data.strom_third_card_image}`}
            alt={data.strom_third_card_image_alt || "Stromspeicher Bild"}
            fill
            className="object-cover rounded-2xl"
                    sizes=" 100vw"

          />
        </div>

        {/* Content */}
        <div>
          <h2 className="text-3xl  text-gray-900 mb-8">
            {data.strom_third_card_title}
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {data.storm_third_card_options?.map((item, index) => {
              const Icon = iconList[index % iconList.length];
              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <Icon className="text-[#669933] text-3xl mb-3" />
                  <h3 className="text-lg text-gray-800 mb-2">
                    {item.subtitle}
                  </h3>
                  <p className="text-sm text-gray-600">{item.paragraph}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StromThirdCardSection;
