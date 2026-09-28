"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getPartnersIcon } from "@/lib/api/partners/partners_icon";
import Marquee from "@/components/ui/Marquee";

// Österreich: nur Hersteller mit belegter Zusammenarbeit zeigen (Stand 09/2026).
// Die Logo-Liste kommt aus dem Backoffice der deutschen Seite und kann weitere
// Marken enthalten – diese werden ausgeblendet (keine Markenlogos ohne Freigabe).
const BELEGT = ["fronius", "huawei", "solis", "byd", "sigenergy", "meteocontrol"];
const istBelegt = (logo) => {
  const name = [logo?.title, logo?.name, logo?.alt_logo_image, logo?.logo_image].filter(Boolean).join(" ").toLowerCase();
  return BELEGT.some((b) => name.includes(b));
};

/**
 * Laufband der Herstellerlogos (aus dem Backoffice).
 * Ruhige Graustufen, Farbe bei Hover; reserviert seine Höhe, damit beim
 * Nachladen nichts springt.
 */
const FeaturedLogos = ({ titel = "Komponenten von Herstellern, mit denen wir zusammenarbeiten", className = "" }) => {
  const [logos, setLogos] = useState([]);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    getPartnersIcon()
      .then((json) => setLogos((json?.message || []).filter(istBelegt)))
      .catch((e) => console.error("Failed to fetch logos", e))
      .finally(() => setGeladen(true));
  }, []);

  // Keine passenden Logos: Band ganz ausblenden statt leerer Überschrift
  if (geladen && logos.length === 0) return null;

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
