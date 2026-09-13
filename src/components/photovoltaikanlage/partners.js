"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getPartnersIcon } from "@/lib/api/partners/partners_icon";
import Marquee from "@/components/ui/Marquee";

/**
 * Laufband der Herstellerlogos (aus dem Backoffice).
 * Ruhige Graustufen, Farbe bei Hover; reserviert seine Höhe, damit beim
 * Nachladen nichts springt.
 */
const FeaturedLogos = ({ titel = "Wir verbauen Premium-Komponenten führender Hersteller", className = "" }) => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    getPartnersIcon()
      .then((json) => setLogos(json?.message || []))
      .catch((e) => console.error("Failed to fetch logos", e));
  }, []);

  return (
    <div className={`border-y border-ink-100 bg-white py-8 ${className}`}>
      <p className="ov-container mb-5 text-center text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">{titel}</p>
      <div className="min-h-14">
        {logos.length > 0 && (
          <Marquee speed={45}>
            {logos.map((logo, index) => (
              <div key={index} className="relative flex h-14 w-[120px] items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0">
                <Image
                  src={logo.logo_image ? `/api/image?path=${logo.logo_image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={logo.alt_logo_image || `Partner Logo ${index + 1}`}
                  width={120}
                  height={48}
                  className="h-auto max-h-12 w-auto object-contain"
                  sizes="120px"
                />
              </div>
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
};

export default FeaturedLogos;
