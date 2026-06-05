import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { generateSlug as createSlug } from "@/lib/slugify";
import FadeInView from "@/components/Reusable/FadeInView";

export default function WarmepumpeHerstellerList({ data }) {
  if (!data?.warmepumpe_third_card_options_table?.length) {
    return <p>Keine Herstellerdaten verfügbar.</p>;
  }

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <FadeInView
          direction="bottom"
          distance={20}
          duration={600}
          className="text-3xl text-center mb-9 md:mb-14"
        >
          <h2>{data?.warmepumpe_third_card_title || "Wärmepumpen Hersteller"}</h2>
        </FadeInView>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.warmepumpe_third_card_options_table.map((item, index) => {
            const slug = createSlug(item?.title);

            return (
              <FadeInView
                key={index}
                direction="bottom"
                distance={40}
                duration={600}
                delay={index * 100}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
              >
                {/* Banner Image */}
                {item?.banner_image && (
                  <div className="relative w-full h-52">
                    <Image
                      src={item?.banner_image ? `/api/image?path=${item.banner_image}` : "/Images/Jobs/jobs3.jpg"}
                      alt={item?.alt_banner_image || "Wärmepumpen Banner"}
                      fill
                      className="object-cover rounded-t-2xl"
                      sizes="100vw"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col grow pl-6 pr-6 pb-6">
                  {/* Logo */}
                  {item?.logo_image && (
                    <div className="relative w-24 h-18 mb-2">
                      <Image
                        src={item?.logo_image ? `/api/image?path=${item.logo_image}` : "/Images/Jobs/jobs3.jpg"}
                        alt={item?.alt_logo_image || "Logo"}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl text-gray-900 mb-2 group-hover:text-[#669933] transition">
                    {item?.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 whitespace-pre-line mb-6 leading-relaxed min-h-[120px]">
                    {item?.main_description}
                  </p>

                  {/* Button */}
                  <Link
                    href={`/produkte/warmepumpe/${slug}`}
                    className="mt-auto inline-flex items-center gap-2 self-start bg-[#669933] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#557a26] transition"
                  >
                    Mehr Informationen <ArrowRight className="text-lg" />
                  </Link>
                </div>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
}