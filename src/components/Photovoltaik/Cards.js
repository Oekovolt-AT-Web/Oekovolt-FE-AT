import React from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaRulerCombined,
  FaFileAlt,
  FaTools,
  FaKey,
} from "react-icons/fa";
import Image from "next/image";


const ProcessSteps = ({ data }) => {
  return (
    <section className="relative bg-[#f7f7f7] px-6 md:px-12 py-10 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-lg">
          {data.fourth_card_title}
          <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
        </h2>
        <h2 className="text-3xl font-bold text-gray-800 mt-6">
          {data.fourth_card_subtitle}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {data.fourth_card_information_table.map((step) => (
          <div
            key={step.title}
            className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-[#669933] transition duration-300"
          >
            <div className="absolute -top-5 left-6 bg-[#669933] text-white rounded-full w-13 h-13 flex items-center justify-center shadow-md ring-4 ring-white text-sm font-bold z-10">
              <Image
                src={step.image ? `/api/image?path=${step.image}` : "/Images/Jobs/jobs3.jpg"}
                alt={step.alt_text}
                width={25}
                height={25}
                className="object-cover"
              />
            </div>

            {/* <div className="mb-5 mt-5">
              <div className="w-12 h-12 flex items-center justify-center bg-[#669933] rounded-xl shadow-lg">
                {step.icon}
              </div>
            </div> */}

            <h4 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
              {step.title}
            </h4>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProcessSteps;
