"use client";
import React, { useState, useEffect } from 'react';
import { Loader2, Image as ImageIcon } from 'lucide-react';

import Image from 'next/image';
import { generateSlug } from '@/lib/slugify';
import Link from 'next/link';
import { getLandesforderungen } from '@/lib/api/forderungen/landesforderungen_api';

// Sub-component for individual card to handle local hover state
const ForderungCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/forderungen/landesforderungen/${generateSlug(item.firstcard_title)}`}
      className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        {item.firstcard_image ? (
          <Image
            fill
            src={item.firstcard_image ? `/api/image?path=${item.firstcard_image}` : "/Images/Jobs/jobs3.jpg"}
            alt={item.firstcard_title}
            className={`transition-all duration-500 object-cover object-center ${isHovered ? "scale-110" : "scale-100"
              }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-100">
            <ImageIcon className="text-slate-300 h-8 w-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="transition-all duration-500 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <h3 className="text-white text-lg font-semibold">{item.firstcard_title}</h3>
        </div>
      </div>
    </Link>
  );
};

const CompactForderungen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = await getLandesforderungen();
        setData(jsonData?.message || []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const element = document.getElementById("forderungen-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPaginationRange = (total, current, siblingCount = 1) => {
    const DOTS = "DOTS";
    const threshold = siblingCount * 2 + 3;
    if (total <= threshold) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(current - siblingCount, 2);
    const rightSiblingIndex = Math.min(current + siblingCount, total - 1);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < total - 1;
    const pages = [];
    pages.push(1);
    if (shouldShowLeftDots) pages.push(DOTS);
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }
    if (shouldShowRightDots) pages.push(DOTS);
    pages.push(total);
    return pages;
  };

  if (loading) return (
    <div className="h-40 flex justify-center items-center">
      <Loader2 className="h-6 w-6 animate-spin text-[#669933]" />
    </div>
  );

  return (
    <section className="py-10 px-4 bg-white" id="forderungen-grid">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header */}
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Förderprogramme <span className="text-[#669933] text-sm font-medium ml-2">({data?.length} Regionen)</span>
            </h2>
          </div>
        </div>

        {/* Dense Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((item, index) => (
            <ForderungCard key={index} item={item} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-1.5" aria-label="Pagination">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-9 px-4 rounded-md border border-gray-300 bg-white text-gray-600 text-sm font-medium transition-colors duration-150 hover:border-[#669933] hover:text-[#669933] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none"
              >
                Previous
              </button>

              {getPaginationRange(totalPages, currentPage).map((item, idx) => {
                if (item === "DOTS") {
                  return (
                    <span key={`dots-${idx}`} className="flex items-center justify-center w-9 h-9 text-gray-400 text-sm select-none">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={item}
                    onClick={() => paginate(item)}
                    className={`flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors duration-150 cursor-pointer select-none focus:outline-none ${currentPage === item
                      ? "bg-[#669933] text-white border border-[#669933]"
                      : "bg-white border border-gray-300 text-gray-600 hover:border-[#669933] hover:text-[#669933]"
                      }`}
                  >
                    {item}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-9 px-4 rounded-md border border-gray-300 bg-white text-gray-600 text-sm font-medium transition-colors duration-150 hover:border-[#669933] hover:text-[#669933] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};

export default CompactForderungen;