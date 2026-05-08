"use client";

import Slider from "react-slick";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FiBox, FiCheckCircle } from "react-icons/fi"; // Ikonat e reja


function CustomPrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md p-2 rounded-full hover:bg-gray-100 transition"
      aria-label="Previous"
    >
      <ArrowLeft size={20} />
    </button>
  );
}

function CustomNextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 bg-white border border-gray-300 shadow-md p-2 rounded-full hover:bg-gray-100 transition"
      aria-label="Next"
    >
      <ArrowRight size={20} />
    </button>
  );
}

export default function HerstellerSlider({ products }) {
  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={index}>
            <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              {/* Image Left */}
              <div className="w-full md:w-1/2">
                {product.image && (
                  <Image
                    src={`${API_IMG_URL}${product.image}`}
                    alt={product.alt || product.name}
                    width={600}
                    height={400}
                    className="rounded-lg object-contain w-full max-h-[400px]"
                  />
                )}
              </div>

              {/* Text Right */}
              <div className="w-full md:w-1/2 text-gray-800">
                <h3 className="text-3xl font-semibold mb-4 flex items-center gap-2">
                  <FiBox className="text-primary" size={28} />
                  {product.name}
                </h3>
                <p className="text-gray-700 mb-4 whitespace-pre-line leading-relaxed">
                  {product.description}
                </p>
                {Array.isArray(product.options) && product.options.length > 0 && (
                  <ul className="space-y-2 text-gray-700">
                    {product.options.map((opt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500" size={18} />
                        {opt.options}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
