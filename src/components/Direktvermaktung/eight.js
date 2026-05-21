'use client';
import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';



export default function DirektvermaktungFAQ({data}) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
         <h2 className="uppercase text-[#669933]  text-center">
              {data?.seventh_card_subtitle}
            </h2>
        <h2 className="text-3xl text-center text-gray-900 mb-14">
         {data?.seventh_card_title}
        </h2>
        <div className="space-y-4">
          {data?.seventh_card_table?.map((item, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-full w-1 bg-[#669933] rounded-tr-lg rounded-br-lg" />

              <button
                onClick={() => toggleAccordion(index)}
                className="cursor-pointer w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="text-lg font-medium text-gray-900">{item?.question}</span>
                <FaChevronDown
                  className={`text-[#669933] transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-700">
                  {item?.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
