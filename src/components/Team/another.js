"use client";
import Image from "next/image";


export default function TeamAnotherDesign({ data }) {
  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col lg:flex-row items-center lg:gap-20 gap-5">
        {/* Left - Image with decorations */}
        <div className="relative w-full max-w-xl">
          <div className="relative z-10 rounded-lg overflow-hidden">
            <Image
                src={`/api/image?path=${data.third_card_image}` || "/Images/Jobs/jobs3.jpg"} // Replace with your image path
              alt={data.third_card_alt_text}
              width={600}
              height={800}
              className="rounded-xl lg:h-140 md:h-100 h-80 w-full lg:pl-10 object-cover"
            />
          </div>
        </div>

        {/* Right - Text */}
        <div className="w-full max-w-5xl text-center lg:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {data.third_card_title}
          </h2>
          <p className="text-gray-600 mb-6">{data.third_card_description}</p>

          <div className="card-container mb-6">
            <div className="animated-border"></div>
            <div className="card-content flex flex-col items-center lg:flex-row lg:items-start md:flex-row md:items-start gap-4">
              {data.third_card_card_image && (
                <Image
                    src={`/api/image?path=${data.third_card_card_image}` || "/Images/Jobs/jobs3.jpg"} // Replace with your image path
                  alt={data.third_card_card_alt_text}
                  width={150}
                  height={150}
                  className="hidden lg:block md:block rounded-md object-cover"
                />
              )}
              <p className="text-sm text-white">{data.third_card_card_description}</p>
            </div>
          </div>

          {/* Bullet points */}
          <ul className="space-y-2 text-gray-800 font-semibold lg:mb-6">
            {data.third_card_options_table?.map((item, index) => (
              <li key={index} className="flex items-center gap-2 md:justify-center">
                <span className="text-[#669933]">✔</span> {item.option}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
