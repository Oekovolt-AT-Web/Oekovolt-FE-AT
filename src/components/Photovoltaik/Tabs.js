"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";

export default function Tabs({ data }) {
  const [activeComponent, setActiveComponent] = useState(
    data.first_card_table[0].title.toLowerCase().replace(/\s+/g, "")
  );

  return (
    <div className="flex justify-center items-center px-6 md:px-12 overflow-hidden">
      <main className="flex flex-col lg:flex-row max-w-7xl w-full py-10 md:py-16 pl-0 pr-0 md:pr-10 md:pl-10">
        {/* Sidebar */}
        <div className="w-full lg:w-84 bg-white">
          <nav className="lg:p-4 border border-gray-200">
            <ul className="space-y-4">
              {data.first_card_table.map((tab) => {
                const tabKey = tab.title.toLowerCase().replace(/\s+/g, "");
                return (
                  <li key={tabKey}>
                    <button
                      onClick={() => setActiveComponent(tabKey)} // Simplified - no toggle logic
                      className={`flex items-center w-full p-2 text-left rounded cursor-pointer text-[21px] ${
                        activeComponent === tabKey
                          ? "bg-gray-100 text-[#669933] font-medium"
                          : "hover:bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="mr-3 w-5 h-5 relative">
                        <Image
                          src={`${API_IMG_URL}${tab.icon}`}
                          alt={tab.alt_text}
                          fill
  sizes="100vw"
                          className="object-contain"
                          priority
                        />
                      </div>

                      {tab.title}
                    </button>
                    <AnimatePresence mode="wait">
                      {activeComponent === tabKey && (
                        <motion.div
                          key={tabKey}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 mt-2 border-b border-gray-200 lg:hidden"
                        >
                          <TabContent tab={tab} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right Content (desktop only) */}
        <div className="hidden lg:flex flex-1 p-8 border border-gray-200">
          <AnimatePresence mode="wait">
            {data.first_card_table.map((tab) => {
              const tabKey = tab.title.toLowerCase().replace(/\s+/g, "");
              return (
                activeComponent === tabKey && (
                  <motion.div
                    key={`desktop-${tabKey}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TabContent tab={tab} />
                  </motion.div>
                )
              );
            })}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Dynamic content component (updated TabContent)
function TabContent({ tab }) {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-10 tracking-wide inline-block relative">
        {tab.card_title}
      </h2>
      <hr className="w-70 h-1 bg-[#669933] text-[#669933] mt-[-30px] mb-5"></hr>

      {/* Image container: relative with fixed height */}
      <div className="relative w-full h-[400px] mb-6 flex justify-start">
        <Image
          src={`${API_IMG_URL}${tab.card_image}`}
          alt={tab.card_alt_text}
          fill
  sizes="100vw"
          quality={100}
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="space-y-3">
        {tab.card_description.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-gray-800 text-[18px]">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
