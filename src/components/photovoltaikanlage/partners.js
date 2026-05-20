"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getPartnersIcon } from "@/lib/api/partners/partners_icon";

const FeaturedLogos = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {

        const json = await getPartnersIcon();
        setLogos(json?.message || []);
      } catch (error) {
        console.error("Failed to fetch logos", error);
      }
    };

    fetchLogos();
  }, []);

  if (!logos.length) return null;

  const settings = {
    infinite: true,
    speed: 5000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    dots: false,
    pauseOnHover: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 480, settings: { slidesToShow: 3 } },
    ],
  };

  return (
    <div className="w-full bg-[#f5f5f5] py-3 overflow-hidden">
      <style jsx global>{`
        .slick-track {
          display: flex !important;
          align-items: center !important;
        }
        .slick-slide > div {
          margin: 0 10px;
        }
        .logo-slider-container {
          max-width: 80rem !important; /* max-w-7xl */
          margin: 0 auto !important;
          padding: 0 !important; /* px-4 */
        }
        @media (min-width: 768px) {
          .logo-slider-container {
            padding: 0 !important; /* md:px-12 */
          }
        }
      `}</style>

      <div className="logo-slider-container">
        <Slider {...settings}>
          {logos.map((logo, index) => (
            <div key={index} className="!flex justify-center items-center h-20 px-2">
              <div className="relative grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center">
                <Image
                  src={logo.logo_image ? `/api/image?path=${logo.logo_image}` : "/Images/Jobs/jobs3.jpg"}
                  alt={logo.alt_logo_image || `Partner Logo ${index + 1}`}
                  width={100}
                  height={38}
                  className="object-contain"
                  sizes="(max-width: 768px) 100px, 150px"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default FeaturedLogos;