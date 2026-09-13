"use client";
import React, { useState } from "react";

const SolarInfoAccordion = ({ data }) => {
  const [activeIndexes, setActiveIndexes] = useState({
    solar: null,
    finanzierung: null,
    installation: null,
    support: null,
  });

  const toggleAccordion = (section, index) => {
    setActiveIndexes((prev) => ({
      ...prev,
      [section]: prev[section] === index ? null : index,
    }));
  };

  const sections = [
    {
      title: "Informationen über Solarsysteme",
      key: "solar",
      dataKey: "table_first_question",
    },
    {
      title: "Finanzierung und Einsparungen",
      key: "finanzierung",
      dataKey: "table_second_question",
    },
    {
      title: "Installationsprozess",
      key: "installation",
      dataKey: "table_third_question",
    },
    {
      title: "Kundensupport und Service",
      key: "support",
      dataKey: "table_fourth_question",
    },
  ];

  return (
    <section className="">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
        {sections.map((section) => {
          const questions = data[section.dataKey] || [];

          return (
            <div key={section.key}>
              <h2 className="text-2xl font-semibold text-[#669933] tracking-wide inline-block relative">
                {section.title}
              </h2>
              <hr className="w-70 h-1 bg-[#669933] text-[#669933] mt-[10px] mb-5"></hr>

              <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {questions.map((item, index) => {
                  const isActive = activeIndexes[section.key] === index;
                  const panelId = `panel-${section.key}-${index}`;

                  return (
                    <div key={index} className="transition-all duration-200">
                      <button
                        onClick={() => toggleAccordion(section.key, index)}
                        className="w-full flex items-center space-x-4 py-4 text-left focus:outline-none"
                        aria-expanded={isActive}
                        aria-controls={panelId}
                      >
                        <span className="text-2xl text-white mt-0.5 bg-ov-600 px-2 rounded min-w-[28px] flex items-center justify-center">
                          {isActive ? "−" : "+"}
                        </span>
                        <h3 className="text-[18px] font-medium text-gray-900 flex-1">
                          {item.question}
                        </h3>
                      </button>

                      <div
                        id={panelId}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isActive ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                        style={{ transitionProperty: "max-height, opacity" }}
                      >
                        <div className="ov-measure pl-9 pb-5 pr-4 text-gray-600 text-[16px]">
                          <p>{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SolarInfoAccordion;
