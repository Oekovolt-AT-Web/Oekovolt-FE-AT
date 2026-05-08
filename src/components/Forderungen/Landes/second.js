"use client"
import React, { useState, useEffect } from 'react';
import { ChevronRight, Loader2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { API_IMG_URL } from '@/lib/apiImgUrl';
import Image from 'next/image';
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const ForderungenSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulated API call - replace with your actual endpoint
        const response = await fetch(`${API_BASE_URL}oekovoltdeutchland.forderungen_pages.doctype.forderungen_lande.api.get_all_forderung_lande_pages`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData.message);
        if (jsonData.message && jsonData.message.length > 0) {
          setSelectedItem(jsonData.message[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center pt-9 md:pt-14">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#669933]" />
          <span className="text-xl font-medium text-gray-700">Laden...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Fehler beim Laden</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full">
     
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-9 md:mt-14 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-[#669933] to-[#7bb33f] p-6">
                <h2 className="text-xl text-white flex items-center">
                  <FileText className="mr-3 h-6 w-6" />
                  Förderungen
                </h2>
              </div>
              
              <div className="p-2 max-h-96 overflow-y-auto">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className={`group relative m-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedItem === item 
                        ? 'bg-gray-100 border-2 border-[#669933] shadow-lg' 
                        : 'hover:bg-gray-100 border-2 border-transparent hover:border-gray-100 hover:shadow-md'
                    }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm leading-relaxed transition-colors ${
                          selectedItem === item ? 'text-[#669933]' : 'text-gray-700 group-hover:text-gray-900'
                        }`}>
                          {item.firstcard_title}
                        </h3>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-all duration-300 ${
                        selectedItem === item 
                          ? 'text-[#669933] rotate-90' 
                          : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                    </div>
                    
                    
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            {selectedItem ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Hero Section */}
                <div className="relative">
                  {selectedItem.firstcard_image && (
                    <div className="relative w-full h-64 lg:h-80 overflow-hidden">
                      <Image 
                      fill
                        src={`${API_IMG_URL}${selectedItem.firstcard_image}`}
                        alt={selectedItem.firstcard_alt_image || selectedItem.firstcard_title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-3xl  text-white mb-2 drop-shadow-lg">
                          {selectedItem.firstcard_title}
                        </h2>
                      </div>
                    </div>
                  )}
                  
                  {!selectedItem.firstcard_image && (
                    <div className="bg-gradient-to-r from-[#669933] to-[#7bb33f] p-8">
                      <h2 className="text-2xl lg:text-3xl  text-white">
                        {selectedItem.firstcard_title}
                      </h2>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-3 pl-3 pb-3 pr-3 md:pt-8 md:pl-8 md:pr-8 space-y-8">
                  {/* Main Text Content */}
                  {selectedItem.forderungen_text && selectedItem.forderungen_text.map((text, idx) => (
                    <div key={idx} className="space-y-4">
                      {text.primary_paragraph && (
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                          <div className="w-1 h-6 bg-gradient-to-b from-[#669933] to-[#7bb33f] rounded-full mr-3"></div>
                          {text.primary_paragraph}
                        </h3>
                      )}
                      {text.secondary_paragraph && (
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line pl-4 border-l-2 border-gray-300">
                          {text.secondary_paragraph}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Detailed Content */}
                  {selectedItem.table_data_forderungen_content && (
                    <div className="space-y-6">
                      {/* <div className="flex items-center space-x-3 pb-4 border-b-2 border-gray-100">
                        <div className="p-2 bg-gradient-to-r from-[#669933] to-[#7bb33f] rounded-lg">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Detaillierte Informationen</h3>
                      </div> */}
                      
                      <div className="grid gap-6">
                        {selectedItem.table_data_forderungen_content.map((content, contentIdx) => (
                          <div key={contentIdx} className="bg-gray-100 p-6 rounded-xl border border-gray-200 hover:border-[#669933]/30 transition-colors duration-300">
                            {content.firstcard_subtitle && (
                              <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                                <div className="w-2 h-2 bg-[#669933] rounded-full mr-3"></div>
                                {content.firstcard_subtitle}
                              </h4>
                            )}
                            
                            {content.title_options && (
                              <h5 className="text-lg font-semibold text-[#669933] mb-3">
                                {content.title_options}
                              </h5>
                            )}
                            
                            <div className="space-y-3">
                              {content.first_card_description && (
                                <p className="text-gray-700 leading-relaxed">
                                  {content.first_card_description}
                                </p>
                              )}
                              {content.second_card_description && (
                                <p className="text-gray-700 leading-relaxed">
                                  {content.second_card_description}
                                </p>
                              )}
                            </div>
                            
                            {content.forderungen_text && content.forderungen_text.map((text, textIdx) => (
                              <div key={textIdx} className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
                                {text.primary_paragraph && (
                                  <h6 className="font-bold text-gray-800 mb-2">
                                    {text.primary_paragraph}
                                  </h6>
                                )}
                                {text.secondary_paragraph && (
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
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#669933] to-[#7bb33f] rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Wählen Sie eine Förderung aus
                  </h3>
                  <p className="text-gray-600">
                    Klicken Sie auf einen Eintrag links, um die Details anzuzeigen
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForderungenSection;