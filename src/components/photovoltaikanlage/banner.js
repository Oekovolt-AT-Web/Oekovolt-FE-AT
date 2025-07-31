"use client";
import Image from "next/image";
import { FaChevronRight, FaCheckCircle, FaPlay } from "react-icons/fa";
import Link from "next/link";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const PhotovoltaikBanner = ({ data }) => {
  if (!data) return null;

  return (
    <section className="w-full px-6 md:px-12 py-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
        {/* Left Side Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <p className="text-sm font-semibold text-[#669933] uppercase tracking-wide">
            Photovoltaik Lösung
          </p>

          <h1 className="text-4xl md:text-5xl leading-tight text-gray-900">
            {data.photovoltaik_title}
          </h1>

          <div className="space-y-4">
            {data.photovoltaik_options?.map((opt, index) => (
              <div key={index} className="flex gap-3 items-start">
                <FaCheckCircle className="text-[#669933] w-5 h-5 mt-1" />
                <p className="text-gray-700 text-base leading-relaxed">
                  <strong>{opt.first_header_options}</strong>{" "}
                  {opt.second_text_paragraph}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/kontakt"
            className="inline-flex items-center font-semibold gap-2 px-6 py-3 rounded-full text-white transition hover:bg-[#558822] text-sm mt-4"
            style={{ backgroundColor: "#669933" }}
          >
            Jetzt Kontaktieren <FaChevronRight />
          </Link>

          {/* Optional Static Stats */}
          <div className="bg-[#f5fce9] rounded-xl p-6 mt-8 grid grid-cols-3 gap-6 text-center text-[#003473] font-semibold text-sm">
            <div>
              <h3 className="text-2xl font-bold text-[#669933]">100+</h3>
              <p>Standorte</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#669933]">50.000+</h3>
              <p>Installationen</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#669933]">17 Jahre</h3>
              <p>Erfahrung</p>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:w-1/2 relative h-[420px]">
          <Image
            src={`${API_IMG_URL}${data.photovoltaik_banner_image}`}
            alt={data.photovoltaik_alt_banner_image || "Photovoltaik"}
            fill
            className="rounded-2xl object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Play Button Overlay (optional) */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-4 w-64 flex items-center gap-4">
            <div className="bg-[#669933] w-10 h-10 flex items-center justify-center rounded-full text-white">
              <FaPlay className="text-sm" />
            </div>
            <p className="text-sm text-gray-800 font-medium">
              Entdecken Sie die Kraft der Solartechnologie.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotovoltaikBanner;
