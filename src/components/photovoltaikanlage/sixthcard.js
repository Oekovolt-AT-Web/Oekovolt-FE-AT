"use client";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";

const PhotovoltaikSixthCardSection = ({ data }) => {
  if (!data) return null;

  const images = data.photovoltaik_sixth_table_images || [];
  const imageCount = images.length;

  return (
    <section className="w-full px-6 md:px-12 py-10 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center justify-between">
        {/* Images Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {imageCount === 1 && (
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src={`${API_IMG_URL}${images[0].image}`}
                alt={images[0].alt_image || "solar"}
                fill
                className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

              />
            </div>
          )}

          {imageCount === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md"
                >
                  <Image
                    src={`${API_IMG_URL}${img.image}`}
                    alt={img.alt_image || "solar"}
                    fill
                    className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                  />
                </div>
              ))}
            </div>
          )}

          {imageCount === 3 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.slice(0, 2).map((img, index) => (
                  <div
                    key={index}
                    className="relative w-full h-60 aspect-[4/3] rounded-xl overflow-hidden shadow-md"
                  >
                    <Image
                      src={`${API_IMG_URL}${img.image}`}
                      alt={img.alt_image || "solar"}
                      fill
                      className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                    />
                  </div>
                ))}
              </div>
              <div className="relative w-full h-60 aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                <Image
                  src={`${API_IMG_URL}${images[2].image}`}
                  alt={images[2].alt_image || "solar"}
                  fill
                  className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                />
              </div>
            </>
          )}

         {imageCount === 4 && (
  <div className="flex flex-col md:flex-row items-stretch gap-4">
    {/* Large image on the left */}
    <div className="w-full md:w-1/2">
      <div className="relative w-full h-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
        <Image
          src={`${API_IMG_URL}${images[0].image}`}
          alt={images[0].alt_image || "solar"}
          fill
          className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

        />
      </div>
    </div>

    {/* Three stacked smaller images on the right */}
    <div className="w-full md:w-1/2 h-120 flex flex-col gap-4">
      {images.slice(1, 4).map((img, index) => (
        <div
          key={index}
          className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md"
        >
          <Image
            src={`${API_IMG_URL}${img.image}`}
            alt={img.alt_image || "solar"}
            fill
            className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

          />
        </div>
      ))}
    </div>
  </div>
)}

        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-[#669933] uppercase tracking-wide"
          >
            {data.photovoltaik_title_sixth_card_first}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl leading-tight text-gray-900"
          >
            {data.photovoltaik_subtitle_sixth_card_first}
          </motion.h2>

          <p className="text-gray-800 text-lg whitespace-pre-line">
            {data.photovoltaik_description_sixth_card_alt_second}
          </p>

          <Link
            href="/kontakt"
            className="inline-flex items-center font-semibold gap-2 px-6 py-3 rounded-md text-white transition-colors hover:bg-[#558822] text-[14px] uppercase"
            style={{ backgroundColor: "#669933" }}
          >
            Jetzt Kontaktieren
            <FaChevronRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PhotovoltaikSixthCardSection;
