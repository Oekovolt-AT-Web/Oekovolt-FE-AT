'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { BsQuestionCircleFill } from 'react-icons/bs';
import {motion} from 'framer-motion'

export default function FaqSection({ data }) {
  const [openIndex, setOpenIndex] = useState(null);

  const title = data.photovoltaik_title_eighth_card_first || 'Häufige Fragen';
  const subtitle = data.photovoltaik_subtitle_eighth_card_first || '';
  const questions = data.photovoltaik_eighth_table_images || [];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 mb-9 ">
      {/* Centered Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto mb-12">

         <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm mb-3 font-semibold text-[#669933] uppercase tracking-wide"
          >
            {title}
          </motion.p>

        {/* <h4 className="mt-4 text-2xl text-gray-600">{subtitle}</h4> */}
          <motion.h2
            className="text-3xl  mt-4  text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {subtitle}
          </motion.h2>
      </div>

      {/* Questions Below, Centered */}
      <div className="space-y-4 max-w-5xl mx-auto">
        {questions.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <button
              onClick={() => toggle(index)}
              className="cursor-pointer w-full flex justify-between items-center px-6 py-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <BsQuestionCircleFill className="text-green-600 w-5 h-5 shrink-0" />
                <span className="font-semibold text-gray-800">
                  {item.question_title}
                </span>
              </div>
              <FaChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50 text-gray-700 space-y-2 border-t">
                {item.first_pharagraph && <p>{item.first_pharagraph}</p>}
                {item.second_pharagraph && <p>{item.second_pharagraph}</p>}
                {item.third_pharagraph && <p>{item.third_pharagraph}</p>}
                {item.fourth_pharagraph && <p>{item.fourth_pharagraph}</p>}
                {item.fifth_pharagraph && <p>{item.fifth_pharagraph}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
