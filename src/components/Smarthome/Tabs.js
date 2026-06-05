"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function Tabs({ data }) {
  const [activeComponent, setActiveComponent] = useState(
    data?.first_card_table?.[0]?.title?.toLowerCase().replace(/\s+/g, "") || ""
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabClick = (tabKey) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveComponent(tabKey);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="flex justify-center items-center px-6 md:px-12">
      <main className="flex flex-col lg:flex-row max-w-7xl w-full py-10 md:py-16 pl-0 pr-0 md:pr-10 md:pl-10">
        {/* Sidebar */}
        <div className="w-full lg:w-84 bg-white">
          <nav className="lg:p-4 border border-gray-200">
            <ul className="space-y-4">
              {data?.first_card_table?.map((tab) => {
                const tabKey = tab?.title?.toLowerCase().replace(/\s+/g, "");
                return (
                  <li key={tabKey}>
                    <button
                      onClick={() => handleTabClick(tabKey)}
                      className={`flex items-center w-full p-2 text-left rounded cursor-pointer text-[21px] ${
                        activeComponent === tabKey
                          ? "bg-gray-100 text-[#669933] font-medium"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="mr-3 w-5 h-5 relative">
                        <Image
                          src={tab?.icon ? `/api/image?path=${tab.icon}` : "/Images/Jobs/jobs3.jpg"}
                          alt={tab?.alt_text || tab?.title}
                          fill
                          sizes="20px"
                          className="object-contain"
                        />
                      </div>
                      {tab?.title}
                    </button>
                    
                    {/* Mobile Content */}
                    {activeComponent === tabKey && (
                      <div className="p-4 mt-2 border-b border-gray-200 lg:hidden animate-slide-down">
                        <TabContent tab={tab} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right Content (desktop only) */}
        <div className="hidden lg:flex flex-1 p-8 border border-gray-200">
          {data?.first_card_table?.map((tab) => {
            const tabKey = tab?.title?.toLowerCase().replace(/\s+/g, "");
            return (
              activeComponent === tabKey && (
                <div
                  key={`desktop-${tabKey}`}
                  className="w-full animate-slide-in-right"
                >
                  <TabContent tab={tab} />
                </div>
              )
            );
          })}
        </div>
      </main>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function TabContent({ tab }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-10 tracking-wide inline-block relative">
        {tab?.card_title}
      </h2>
      <hr className="w-70 h-1 bg-[#669933] text-[#669933] mt-[-30px] mb-5"></hr>

      {/* Image container */}
      <div className="relative w-full h-[400px] mb-6 flex justify-start">
        <Image
          src={tab?.card_image ? `/api/image?path=${tab.card_image}` : "/Images/Jobs/jobs3.jpg"}
          alt={tab?.card_alt_text || tab?.card_title}
          fill
          quality={100}
          loading="eager"
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>

      <div className="space-y-3">
        {tab?.card_description?.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-gray-800 text-[18px]">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}