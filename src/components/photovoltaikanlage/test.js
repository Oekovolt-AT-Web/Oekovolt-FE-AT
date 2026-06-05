import Image from "next/image";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

import Link from "next/link";
import { ChevronRight, CheckCircle } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

const BannerLegal = ({ data }) => {
  if (!data) return null;

  return (
    <section className="relative bg-[#edf3f8] w-full py-16 px-6 overflow-hidden">
      {/* Decorative background dots (top right & bottom center) */}
      <div className="absolute top-10 right-70 w-20 h-20 bg-[url('/Images/Home/dots.png')] opacity-100" />
      <div className="absolute bottom-10 left-250 transform -translate-x-1/2 w-20 h-20 bg-[url('/Images/Home/dots.png')] opacity-40" />

      {/* Social Icons */}
      <div className="absolute left-26 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-10">
        <a
          href="#"
          className="bg-white border-2 border-[#669933] p-3 rounded-full shadow-md hover:scale-105 transition"
        >
          <FaFacebookF className="text-gray-700" />
        </a>
        <a
          href="#"
          className="bg-white border-2 border-[#669933] p-3 rounded-full shadow-md hover:scale-105 transition"
        >
          <FaTwitter className="text-gray-700" />
        </a>
        <a
          href="#"
          className="bg-white border-2 border-[#669933] p-3 rounded-full shadow-md hover:scale-105 transition"
        >
          <FaLinkedinIn className="text-gray-700" />
        </a>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Text Left */}
        <div className="text-center lg:text-left space-y-9 max-w-xl z-10">
          <FadeInView
            direction="bottom"
            distance={30}
            duration={600}
            className="text-4xl text-gray-900 leading-tight"
          >
            <h1>{data.photovoltaik_title}</h1>
          </FadeInView>

          <div className="space-y-6">
            {data.photovoltaik_options?.map((opt, index) => (
              <FadeInView
                key={index}
                direction="left"
                distance={20}
                duration={500}
                delay={index * 100}
                className="flex items-center gap-3"
              >
                <CheckCircle className="text-[#669933] text-lg mt-1 w-10 h-10" />
                <p className="text-gray-800 text-lg leading-relaxed">
                  {opt?.first_header_options} {opt?.second_text_paragraph}
                </p>
              </FadeInView>
            ))}
          </div>

          <FadeInView
            direction="bottom"
            distance={20}
            duration={600}
            delay={300}
          >
            <Link
              href="/kontakt"
              className="inline-flex items-center font-semibold gap-2 px-6 py-3 rounded-md text-white transition-colors hover:bg-[#558822] text-[14px] uppercase"
              style={{ backgroundColor: "#669933" }}
            >
              Jetzt Kontaktieren
              <ChevronRight />
            </Link>
          </FadeInView>
        </div>

        {/* Image Right */}
        <FadeInView
          direction="right"
          distance={40}
          duration={700}
          delay={200}
          className="relative w-150 h-[500px] z-10"
        >
          <Image
            src={data?.photovoltaik_banner_image ? `/api/image?path=${data.photovoltaik_banner_image}` : "/Images/Jobs/jobs3.jpg"}
            alt="Expert Lawyer"
            fill
            sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
            className="object-cover rounded-tr-[80px] rounded-bl-[80px]"
            loading="eager"
          />
        </FadeInView>
      </div>
    </section>
  );
};

export default BannerLegal;