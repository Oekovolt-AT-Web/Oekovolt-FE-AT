"use client";
import React, { useState, useEffect } from 'react';

const ForderungenSectionClient = ({ initialData, allData }) => {
    const [selectedItem, setSelectedItem] = useState(initialData);
    const [isHydrated, setIsHydrated] = useState(false);

    // Mark when component is hydrated on client
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Update when initialData changes (for client-side navigation)
    useEffect(() => {
        if (initialData && initialData.firstcard_title !== selectedItem?.firstcard_title) {
            setSelectedItem(initialData);
        }
    }, [initialData, selectedItem?.firstcard_title]);

    // During SSR and before hydration, use initialData
    // After hydration, use the state
    if (!selectedItem) {
        // Return a consistent structure that matches the actual content's layout
        return (
            <div className="w-full">
                <div className="max-w-7xl mx-auto px-6 md:px-12 mt-9 md:mt-14">
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="relative">
                                <div className="bg-gradient-to-r from-[#669933] to-[#7bb33f] p-8">
                                    <div className="h-8 w-48 bg-white/20 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="pt-3 pl-3 pb-3 pr-3 md:p-8 space-y-8">
                                <div className="animate-pulse space-y-4">
                                    <div className="h-32 bg-gray-200 rounded"></div>
                                    <div className="h-64 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-9 md:mt-14">
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Hero Section */}
                        <div className="relative">
                            <div className="bg-gradient-to-r from-[#669933] to-[#7bb33f] p-8">
                                <h1 className="text-2xl lg:text-3xl text-white">
                                    {selectedItem.firstcard_title}
                                </h1>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-3 pl-3 pb-3 pr-3 md:p-8 space-y-8">
                            {selectedItem?.forderungen_text?.length > 0 && selectedItem?.forderungen_text?.slice(1).map((text, idx) => (
                                <div key={idx} className="space-y-4">
                                    {text?.primary_paragraph && (
                                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                            <div className="w-1 h-6 bg-gradient-to-b from-[#669933] to-[#7bb33f] rounded-full mr-3"></div>
                                            {text.primary_paragraph}
                                        </h2>
                                    )}
                                    {text?.secondary_paragraph && (
                                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line pl-4 border-l-2 border-gray-300">
                                            {text.secondary_paragraph}
                                        </p>
                                    )}
                                </div>
                            ))}

                            {selectedItem?.table_data_forderungen_content?.map((content, contentIdx) => (
                                <div key={contentIdx} className="bg-gray-100 p-6 rounded-xl border border-gray-200 hover:border-[#669933]/30 transition-colors duration-300">
                                    {content?.firstcard_subtitle && (
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                                            <div className="w-2 h-2 bg-[#669933] rounded-full mr-3"></div>
                                            {content.firstcard_subtitle}
                                        </h3>
                                    )}

                                    {content?.title_options && (
                                        <h4 className="text-lg font-semibold text-[#669933] mb-3">
                                            {content.title_options}
                                        </h4>
                                    )}

                                    <div className="space-y-3">
                                        {content?.first_card_description && (
                                            <p className="text-gray-700 leading-relaxed">
                                                {content.first_card_description}
                                            </p>
                                        )}
                                        {content?.second_card_description && (
                                            <p className="text-gray-700 leading-relaxed">
                                                {content.second_card_description}
                                            </p>
                                        )}
                                    </div>

                                    {content?.forderungen_text?.map((text, textIdx) => (
                                        <div key={textIdx} className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
                                            {text?.primary_paragraph && (
                                                <h5 className="font-bold text-gray-800 mb-2">
                                                    {text.primary_paragraph}
                                                </h5>
                                            )}
                                            {text?.secondary_paragraph && (
                                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                                    {text.secondary_paragraph}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ForderungenSectionClient.displayName = 'ForderungenSectionClient';

export default ForderungenSectionClient;