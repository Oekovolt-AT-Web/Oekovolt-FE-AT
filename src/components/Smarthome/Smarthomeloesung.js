import React from 'react';
import Image from 'next/image';

function AnlageSection({ data }) {
    return (
        <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-lg">
                        {data.second_card_title}
                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
                    </h2>
                    <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold mt-6 text-gray-900 leading-[1.5]">
                        {data.second_card_subtitle}
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-15">
                    {data.second_card_table.map((card, index) => (
                        <div key={index} className="flex space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 relative">
                                    <Image
                                        src={`/api/image?path=${card.image}` || "/Images/Jobs/jobs3.jpg"}
                                        alt={card.alt_text}
                                        fill
                                        className="object-contain"
                                                  sizes="(max-width: 768px) 100vw, 768px"

                                    />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {card.title}
                                </h3>
                                <p className="text-gray-700 text-md">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AnlageSection;