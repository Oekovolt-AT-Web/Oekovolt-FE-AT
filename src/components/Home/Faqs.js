// components/FaqSection.jsx
// FAQ-Akkordeon – Keywords: photovoltaikanlagen kosten (2.9K),
// solaranlage mit speicher (22.2K), photovoltaik wartung (170)

"use client";

import { useState } from "react";

const FAQ_ITEMS = [
    {
        question: "Was kostet eine Photovoltaikanlage mit Speicher?",
        answer:
            "Pauschal lässt sich das nicht beantworten – die Kosten hängen von der Anlagengröße, der Speicherkapazität, der Dachform und dem Montageaufwand ab. Deshalb kalkulieren wir jede Photovoltaikanlage mit Speicher individuell für Ihr Zuhause. Kontaktieren Sie uns einfach – wir erstellen Ihnen schnell eine genaue Einschätzung für Ihr Dach.",
    },
    {
        question: "Lohnt sich eine Solaranlage mit Speicher?",
        answer:
            "Ja – in den meisten Fällen deutlich. Ohne Speicher nutzen Sie nur etwa 30 % Ihres Solarstroms selbst, mit Speicher bis zu 80 %. Bei steigenden Strompreisen amortisiert sich eine Solaranlage mit Speicher typischerweise innerhalb von 10 bis 15 Jahren – bei einer Lebensdauer von 25 Jahren und mehr.",
    },
    {
        question: "Wie lange dauert die Installation?",
        answer:
            "Die Montage auf einem Einfamilienhaus dauert in der Regel 1 bis 3 Tage. Von der Auftragserteilung bis zur Inbetriebnahme – inklusive Netzanmeldung – vergehen je nach Region meist 6 bis 12 Wochen. Wir übernehmen den gesamten Prozess für Sie.",
    },
    {
        question: "Übernimmt Ökovolt auch Wartung und Service?",
        answer:
            "Ja. Mit unserem Service für Photovoltaik Wartung und dem KI-Monitoring Ökosys überwachen wir Ihre Anlage permanent, erkennen Fehler automatisch und beheben sie schnell – damit Ihre Anlage dauerhaft Höchstleistung bringt.",
    },
    {
        question: "Funktioniert der Speicher auch bei Stromausfall?",
        answer:
            "Mit unserer Notstrombox ja: Sie beziehen auch bei Netzstörungen Strom aus Ihrem Speicher und bleiben unabhängig versorgt. Eine Standard-Anlage ohne Notstromfunktion schaltet bei Netzausfall aus Sicherheitsgründen ab.",
    },
    {
        question: "Kann ich die Solaranlage mit einer Wärmepumpe kombinieren?",
        answer: "Ja – die Kombination aus Solaranlage und Wärmepumpe ist besonders effizient: Ihr eigener Solarstrom betreibt die Heizung, und Ihre Stromkosten sinken doppelt. Wir planen beide Systeme perfekt aufeinander abgestimmt. Mehr dazu auf unserer Wärmepumpen-Seite."
    }
];

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
