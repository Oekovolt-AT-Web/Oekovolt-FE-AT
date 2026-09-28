// components/FaqSection.jsx
// FAQ-Akkordeon (derzeit nicht eingebunden)

"use client";

import { useState } from "react";
import { FAQ_KATEGORIEN } from "@/data/faqs";

// Österreich: Inhalte aus der zentralen FAQ-Datenquelle (Gewerbe & Wirtschaftlichkeit)
const FAQ_ITEMS = (FAQ_KATEGORIEN.find((k) => k.id === "gewerbe")?.items || []).slice(0, 6).map((it) => ({ question: it.q, answer: it.a }));

const FaqItem = ({ item, isOpen, onToggle, panelId }) => {
    return (
        <div className="transition-all duration-200">
            <button
                onClick={onToggle}
                className="w-full flex items-center space-x-4 py-4 text-left focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={panelId}
            >
                <span className="text-2xl text-white mt-0.5 bg-ov-600 px-2 rounded min-w-[28px] flex items-center justify-center">
                    {isOpen ? "−" : "+"}
                </span>
                <h3 className="text-[18px] font-medium text-gray-900 flex-1">
                    {item.question}
                </h3>
            </button>

            <div
                id={panelId}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                style={{ transitionProperty: "max-height, opacity" }}
            >
                <div className="ov-measure pl-9 pb-5 pr-4 text-gray-600 text-[16px]">
                    <p>{item.answer}</p>
                </div>
            </div>
        </div>
    );
};

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const handleToggle = (index) => {
        setOpenIndex((current) => (current === index ? -1 : index));
    };

    return (
        <section>
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <h2 className="text-2xl font-semibold text-[#669933] tracking-wide inline-block relative">
                    Häufige Fragen zur Solaranlage mit Speicher
                </h2>
                <hr className="w-70 h-1 bg-[#669933] text-[#669933] mt-[10px] mb-5" />

                <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                    {FAQ_ITEMS.map((item, index) => (
                        <FaqItem
                            key={item.question}
                            item={item}
                            panelId={`panel-faq-${index}`}
                            isOpen={openIndex === index}
                            onToggle={() => handleToggle(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
