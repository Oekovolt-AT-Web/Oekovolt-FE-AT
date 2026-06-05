"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getCardContact } from "@/lib/api/contact/card_contact";
import FadeInView from "@/components/Reusable/FadeInView";

export default function EndWhite() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCardContact();
        setInfo(data?.message);
      } catch (err) {
        console.error("Failed to fetch contact section data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

  return (
    <FadeInView
      direction="bottom"
      distance={30}
      duration={800}
      className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 px-6 md:px-12 lg:py-20 py-10 max-w-7xl mx-auto rounded-2xl overflow-hidden"
    >
      {/* LEFT: Text Content */}
      <div className="w-full lg:w-1/2">
        <p className="uppercase text-sm tracking-wide text-[#669933] font-semibold mb-3 mt-3">
          {info?.title || "Grüner Titel"}
        </p>
        <h2 className="text-2xl lg:text-3xl md:text-3xl font-bold text-gray-900 mb-5 leading-tight">
          {info?.subtitle || "Titel hier"}
        </h2>
        <p className="text-gray-700 mb-6">
          {info?.description || "Beschreibung hier..."}
        </p>

        <Link
          href="/kontakt"
          className="inline-flex items-center font-semibold gap-2 px-6 py-3 rounded-md text-white transition-colors hover:bg-[#558822] text-[14px] uppercase"
          style={{ backgroundColor: "#669933" }}
        >
          Jetzt Kontaktieren
          <ChevronRight />
        </Link>
      </div>

      {/* RIGHT: Image with Floating Elements */}
      <div className="relative w-full lg:w-1/2 flex justify-center items-center group lg:mt-0">
        <div className="relative z-10 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden border-4 border-white shadow-xl">
          <Image
            src={info?.image ? `/api/image?path=${info?.image}` : "/Images/Home/contactImage.jpg"}
            alt={info?.alt_text || "Kontaktbild"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100px, 200px; (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Floating Box 1 */}
        <div className="absolute top-2 right-2 lg:top-10 lg:right-0 bg-gray-800 text-white rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg z-20 transition-all duration-1000 group-hover:lg:bottom-10 group-hover:lg:left-0 group-hover:lg:top-auto group-hover:lg:right-auto">
          <span className="text-[#a7e255]">{info?.first_percentage + "%" || "+20%"}</span>
          {info?.first_option_title || "Energieeinsparung"}
        </div>

        {/* Floating Box 2 */}
        <div className="absolute bottom-2 left-2 lg:bottom-10 lg:left-0 bg-[#669933] text-white rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg z-20 transition-all duration-1000 group-hover:lg:top-10 group-hover:lg:right-0 group-hover:lg:bottom-auto group-hover:lg:left-auto">
          <span className="text-gray-800">{info?.second_percentage + "%" || "100%"}</span>
          {info?.second_option_title || "Grüne Energie"}
        </div>

        {/* Background Circles */}
        <div className="hidden md:block absolute w-[340px] h-[340px] rounded-full bg-[#669933]/40 -z-10"></div>
        <div className="hidden md:block absolute w-[380px] h-[380px] rounded-full border border-[#669933] -z-20"></div>
      </div>
    </FadeInView>
  );
}