
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

export default function WarmepumpeSecondCardSection({ data }) {
  const {
    warmepumpe_second_card_title: title,
    warmepumpe_second_card_description: description,
    warmepumpe_second_card_image: image,
    warmepumpe_second_card_image_alt_text: imageAlt,
    warmepumpe_second_card_options_title: optionsTitle,
    warmepumpe_second_card_options_table: optionsTable,
  } = data || {};

  return (
    <div className="py-10 md:py-16 px-6 md:px-12 flex flex-col-reverse lg:flex-row items-center mx-auto gap-10 max-w-7xl">
      {/* Text Section */}
      <div className="w-full lg:w-1/2 space-y-6">
        <FadeInView
          direction="bottom"
          distance={40}
          duration={600}
          className="text-3xl text-gray-800"
        >
          <h2>{title}</h2>
        </FadeInView>

        <FadeInView
          direction="bottom"
          distance={20}
          duration={600}
          className="text-gray-600 text-lg leading-relaxed whitespace-pre-line"
        >
          <p>{description}</p>
        </FadeInView>

        {optionsTitle && optionsTable?.length > 0 && (
          <div className="mt-6">
            <FadeInView
              direction="bottom"
              distance={20}
              duration={500}
              className="text-xl text-green-700 mb-4"
            >
              <h3>{optionsTitle}</h3>
            </FadeInView>
            <ul className="space-y-3">
              {optionsTable.map((item, idx) => (
                <FadeInView
                  key={idx}
                  direction="left"
                  distance={20}
                  duration={400}
                  delay={idx * 100}
                  className="flex items-start text-gray-700"
                >
                  <CheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                  <span>{item?.options}</span>
                </FadeInView>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Image Section */}
      <FadeInView
        direction="right"
        distance={50}
        duration={600}
        className="w-full lg:w-1/2"
      >
        <Image
          src={image ? `/api/image?path=${image}` : "/Images/Jobs/jobs3.jpg"}
          alt={imageAlt || "Heat pump"}
          width={600}
          height={400}
          className="rounded-xl shadow-md object-cover w-full h-auto"
          quality={100}
        />
      </FadeInView>
    </div>
  );
}