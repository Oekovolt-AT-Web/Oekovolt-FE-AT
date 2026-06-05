"use client";
import Image from "next/image";
import { Leaf } from "lucide-react";
import Link from "next/link";
import FadeInView from "@/components/Reusable/FadeInView";

const PhotovoltaikRegionalNetzSection = ({ data }) => {
  if (
    !data ||
    !data.photovoltaik_title_fourth_card_first ||
    !data.photovoltaik_fourth_table
  )
    return null;

  return (
    <section className="w-full bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Left: Image or Map */}
        <FadeInView
          direction="left"
          distance={40}
          duration={600}
          className="w-full lg:w-1/2 relative aspect-[16/11] rounded-xl overflow-hidden shadow-md"
        >
          <Image
            src={data?.photovoltaik_image_fourth_card ? `/api/image?path=${data.photovoltaik_image_fourth_card}` : "/Images/Jobs/jobs3.jpg"}
            alt={data?.photovoltaik_image_fourth_card_alt || "Map"}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </FadeInView>

        {/* Right: Text */}
        <div className="w-full lg:w-1/2 space-y-6">
          <FadeInView
            direction="bottom"
            distance={20}
            duration={400}
            className="text-sm font-semibold uppercase text-[#669933]"
          >
            {data?.photovoltaik_title_fourth_card_first}
          </FadeInView>

          <FadeInView
            direction="bottom"
            distance={20}
            duration={500}
            className="text-3xl md:text-4xl text-gray-900"
          >
            {data?.photovoltaik_subtitle_fourth_card_first}
          </FadeInView>

          <ul className="space-y-3 mt-6">
            {data?.photovoltaik_fourth_table?.map((item, idx) => (
              <FadeInView
                key={idx}
                direction="right"
                distance={20}
                duration={400}
                delay={idx * 100}
                className="flex items-start gap-3 text-gray-700 text-[17px]"
              >
                <Leaf className="text-[#669933] mt-1 shrink-0" />
                <span>{item?.options}</span>
              </FadeInView>
            ))}
          </ul>

          <FadeInView
            direction="bottom"
            distance={20}
            duration={500}
            delay={300}
            className="pt-4"
          >
            <Link
              href="/kontakt"
              className="inline-block border border-[#669933] text-[#669933] px-6 py-3 rounded-md hover:bg-[#669933] hover:text-white transition text-md font-medium"
            >
              Fachbetrieb in deiner Nähe finden
            </Link>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default PhotovoltaikRegionalNetzSection;