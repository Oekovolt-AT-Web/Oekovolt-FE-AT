"use client";
import Image from "next/image";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";


const PhotovoltaikIntroSection = ({ data }) => {
  if (!data) return null;

  const images = data.photovoltaik_first_images_card || [];
  const imageCount = images.length;

  const getGridCols = () => {
    if (imageCount === 1) return "grid-cols-1";
    if (imageCount === 2) return "grid-cols-2";
    if (imageCount === 3) return "grid-cols-2 ";
    return "grid-cols-2 ";
  };

  return (
    <section className="w-full px-6 md:px-12 py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center justify-between">
        {/* Image grid */}
        {/* Image section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          {imageCount === 1 && (
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
              <Image
                src={images[0].image ? `/api/image?path=${images[0].image}` : "/Images/Jobs/jobs3.jpg"}
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
                    src={img.image ? `/api/image?path=${img.image}` : "/Images/Jobs/jobs3.jpg"}
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
                      src={img.image ? `/api/image?path=${img.image}` : "/Images/Jobs/jobs3.jpg"}
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
                  src={images[2].image ? `/api/image?path=${images[2].image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={images[2].alt_image || "solar"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                />
              </div>
            </>
          )}

          {imageCount > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md"
                >
                  <Image
                    src={img.image ? `/api/image?path=${img.image}` : "/Images/Jobs/jobs3.jpg"}
                    alt={img.alt_image || "solar"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                  />
                </div>
              ))}
            </div>
          )}
        </div>


        {/* Text content */}
        <div className="w-full lg:w-1/2 space-y-6">


          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-[#669933] uppercase tracking-wide"
          >
            {data.photovoltaik_first_title}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl leading-tight text-gray-900"
          >
            {data.photovoltaik_first_subtitle}
          </motion.h1>

          <p className="text-gray-800  text-lg">
            {data.photovoltaik_first_description}
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

export default PhotovoltaikIntroSection;
