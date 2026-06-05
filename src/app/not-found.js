import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

export default function NotFound() {
  return (
    <div className="bg-white flex flex-col">
      <div className="w-full h-2 bg-[#669933]" />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-5xl mx-auto w-full">
        {/* 404 number */}
        <FadeInView
          direction="none"
          scale={0.8}
          duration={600}
          className="relative mb-6"
        >
          <span
            className="text-[140px] md:text-[200px] font-extrabold leading-none select-none"
            style={{ color: "#003473", opacity: 0.08 }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[80px] md:text-[120px] font-extrabold leading-none"
              style={{ color: "#003473" }}
            >
              404
            </span>
          </div>
        </FadeInView>
        <FadeInView
          scaleX={0}
          duration={500}
          delay={300}
          className="w-20 h-1 bg-[#669933] rounded-full mb-8"
        >
          <div className="w-full h-full" /> {/* Empty div as children */}
        </FadeInView>
        <FadeInView
          as="h1"
          direction="bottom"
          distance={20}
          duration={500}
          delay={400}
          className="text-2xl md:text-4xl font-bold text-center mb-4"
          style={{ color: "#003473" }}
        >
          Seite nicht gefunden
        </FadeInView>
        <FadeInView
          as="p"
          direction="bottom"
          distance={20}
          duration={500}
          delay={500}
          className="text-gray-600 text-center text-base md:text-lg max-w-lg mb-10"
        >
          Die gesuchte Seite existiert leider nicht oder wurde verschoben.
          Kehren Sie zur Startseite zurück oder nutzen Sie einen der folgenden Links.
        </FadeInView>
        <FadeInView
          direction="bottom"
          distance={20}
          duration={500}
          delay={600}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-white font-semibold text-sm uppercase tracking-wide transition-colors hover:bg-[#558822]"
            style={{ backgroundColor: "#669933" }}
          >
            <Home className="text-2xs " />
            Zur Startseite
            <ChevronRight className="text-xs" />
          </Link>
        </FadeInView>
      </div>
    </div>
  );
}
