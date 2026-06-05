"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getPartners } from "@/lib/api/partners/partners_api";
import FadeInView from "@/components/Reusable/FadeInView";

export default function PartnersSection({ data }) {
  const [partners, setPartners] = useState([]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 468, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        setPartners(
          data?.message?.map((p) => ({
            name: p.name1,
            image: p.bild_anhagen,
          }))
        );
      } catch (error) {
        console.error("Fehler:", error);
      }
    };
    fetchPartners();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden pb-10">
      {/* Title Section */}
      <FadeInView
        direction="bottom"
        distance={50}
        duration={800}
        className="text-center mb-10"
      >
        <h2 className="text-2xl font-[500] text-gray-900 mb-6">
          {data?.photovoltaiklösungen_title}
        </h2>
      </FadeInView>

      {/* Partners Slider Section */}
      {partners.length > 0 && (
        <FadeInView
          direction="bottom"
          distance={30}
          duration={800}
        >
          <Slider {...sliderSettings}>
            {partners.map((partner, i) => (
              <div key={i} className="px-4">
                <div className="relative h-16 w-full">
                  <Image
                    src={partner?.image ? `/api/image?path=${partner?.image}` : "/Images/Jobs/jobs3.jpg"}
                    alt={partner?.name || "Partner"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 468px) 100vw, (max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </FadeInView>
      )}
    </div>
  );
}