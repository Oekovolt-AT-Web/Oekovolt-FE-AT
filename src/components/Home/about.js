"use client"
import React from "react";
import Image from "next/image";

const ServicesBanner = ({ data }) => {
  return (
    <div className="bg-white px-6 md:px-12  z-16 ">
      <div className="max-w-7xl mx-auto ">
        <div className="relative z-20 bg-white mt-[-24px] md:mt-[-100px] shadow-[0px_20px_20px_-10px_rgba(0,0,0,0.5)] p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-3  md:grid-cols-1 gap-10 animate-fadeInUp">
            {data.cards.map((card, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-start  md:flex-row md:items-start justify-center items-center gap-4"
              >
                <div className="w-18 h-18 rounded-full bg-[#669933] flex items-center justify-center text-white shrink-0 pulse-hover transition-all">
                  <Image
                    src={card.image ? `/api/image?path=${card.image}` : "/Images/Jobs/jobs3.jpg"}
                    alt={card.alt_text}
                    width={30}
                    height={30}
                    className="object-cover"
                  />
                </div>
                <style jsx>{`
                  @keyframes pulseblue {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(30, 64, 175, 0.6); /* blu */
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(30, 64, 175, 0);
  }
}

.pulse-hover:hover {
  animation: pulseblue 1.7s infinite;
  background-color: #023a51 !important; /* blu në hover */
}
                `}</style>
                <div>
                  <h2 className="text-2xl font-[540] text-black mb-2 text-center sm:text-start leading-[1.7]">
                    {card.title}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed text-center sm:text-start">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesBanner;
