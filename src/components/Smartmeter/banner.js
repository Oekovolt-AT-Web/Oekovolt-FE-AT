import Image from 'next/image';
import { API_IMG_URL } from '@/lib/apiImgUrl';
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

const SmartmeterBanner = ({ data }) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 overflow-hidden  shadow-xl">
      <div className="mx-auto">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 ">
             {/* Image Section - Right Side (50%) */}
          <div className="hidden lg:block relative h-64 sm:h-80 md:h-96 lg:h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-l from-[#669933]/20 to-transparent" />
            <Image
              src={`${API_IMG_URL}${data.smart_meter_image}`}
              alt={data.smart_meter_alt_image || "Wallbox installation"}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

            />
            {/* Mobile gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-l from-[#003473]/40 to-[#669933]/80 " />
          </div> 
          {/* Text Content - Left Side (50%) */}
          <div className="flex flex-col justify-end px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-16 lg:pl-26 lg:pr-36 lg:pt-16 lg:pb-16">
            <div className="max-w-xl mx-auto text-center lg:text-left lg:mx-0">
              <h1 className="text-2xl sm:text-3xl text-gray-900 leading-snug sm:leading-tight">
                {data.smart_meter_title}
              </h1>

              <h2 className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 font-medium">
                {data.smart_meter_subtitle}
              </h2>

              <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                {data.smart_meter_description}
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center font-semibold gap-2 px-6 py-3 rounded-md text-white transition-colors hover:bg-[#558822] text-sm uppercase"
                  style={{ backgroundColor: "#669933" }}
                >
                  Kontaktieren
                  <FaChevronRight />
                </Link>
              </div>
            </div>
          </div>


        
        </div>
      </div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#669933]" />
            <div className="absolute top-0 left-0 w-full h-2 bg-[#669933]" />

    </div>
  );
};

export default SmartmeterBanner;