import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

export default function GreenFeatureSection2() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20 animate-fadeInUp">
      <div className="flex flex-col md:flex-row items-center gap-8 pb-[20px]">
        
        {/* Left Content */}
        <FadeInView
          direction="left"
          distance={50}
          duration={800}
          className="w-full md:w-3/4 space-y-6"
        >
          <h2 className="lg:text-[30px] text-2xl md:text-3xl font-[500]" style={{ color: "#2e8400" }}>
            Nachhaltige Energie für Ihr Zuhause
          </h2>

          <p className="text-[18px] text-gray-800">
            Entdecken Sie unsere maßgeschneiderten Photovoltaik-Lösungen, die Ihnen helfen, Energie zu sparen und
            gleichzeitig die Umwelt zu schonen. Unsere Experten beraten Sie gerne zu den besten Optionen für Ihr
            Zuhause.
          </p>

          <Link
            href="/kontakt"
            className="inline-flex items-center font-[550] gap-2 px-6 py-3 rounded-md text-white transition-colors hover:bg-[#558822] text-[14px] uppercase"
            style={{ backgroundColor: "#669933" }}
          >
            Jetzt Kontaktieren
            <ChevronRight />
          </Link>
        </FadeInView>

        {/* Right Image */}
        <FadeInView
          direction="right"
          distance={50}
          duration={800}
          delay={200}
          className="w-full md:w-1/4 flex justify-center"
        >
          <div className="relative aspect-square w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden">
            <Image
              src="/Images/Home/contactImage.jpg"
              alt="Solaranlage auf einem Hausdach"
              fill
              loading="eager"
              className="object-cover"
              sizes="(max-width: 768px) 100px, 200px; (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </FadeInView>
      </div>
    </div>
  );
}