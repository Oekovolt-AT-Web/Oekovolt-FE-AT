"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaChevronRight } from "react-icons/fa";

export default function GreenFeatureSection({data}) {
  return (
    <motion.div
      className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 px-6 max-w-7xl mx-auto rounded-2xl md:mt-12 lg:pt-12 lg:mt-12 md:mb-10 "
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true }}
    >
      {/* LEFT: Text Content */}
      <div className="w-full lg:w-1/2">
        <p className="uppercase text-sm tracking-wide text-[#669933] font-semibold mb-3 mt-3">
         {data?.greentitle}
        </p>
        <h2 className="text-2xl lg:text-3xl md:text-3xl font-bold text-gray-900 mb-5 leading-tight">
          {data?.title}
        </h2>
        <p className="text-gray-700 mb-6">
          {data?.description}
        </p>

       

        <Link
          href="/kontakt"
          className="inline-flex items-center font-semibold gap-2 px-6 mb-8 md:mb-0 lg:mb-0 py-3 rounded-md text-white transition-colors hover:bg-[#558822] text-[14px] uppercase"
          style={{ backgroundColor: "#669933" }}
        >
          Jetzt Kontaktieren
          <FaChevronRight />
        </Link>
      </div>

    {/* RIGHT: Image with Floating Elements */}
<div className="relative w-full lg:w-1/2 flex justify-center items-center group mt-8 lg:mt-0">
  <div className="relative z-10 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-4 border-white shadow-xl">
    <Image
      src="/Images/Home/contactImage.jpg"
      alt="Solaranlage auf einem Hausdach"
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100px, 200px; (max-width: 1024px) 50vw, 33vw"
    />
  </div>

  {/* Floating Box 1 */}
  <div className="absolute top-2 right-2 lg:top-10 lg:right-0 bg-gray-800 text-white rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg z-20 transition-all duration-1000 group-hover:lg:bottom-10 group-hover:lg:left-0 group-hover:lg:top-auto group-hover:lg:right-auto">
    <span className="text-[#a7e255]">+20%</span> Energieeinsparung
  </div>

  {/* Floating Box 2 */}
  <div className="absolute bottom-2 left-2 lg:bottom-10 lg:left-0 bg-[#669933] text-white rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg z-20 transition-all duration-1000 group-hover:lg:top-10 group-hover:lg:right-0 group-hover:lg:bottom-auto group-hover:lg:left-auto">
    <span className="text-gray-800">100%</span> Grüne Energie
  </div>

  {/* Background Circles */}
  <div className="hidden md:block absolute w-[340px] h-[340px] rounded-full bg-[#669933]/40 -z-10"></div>
  <div className="hidden md:block absolute w-[380px] h-[380px] rounded-full border border-[#669933] -z-20"></div>
</div>

    </motion.div>
  );
}
