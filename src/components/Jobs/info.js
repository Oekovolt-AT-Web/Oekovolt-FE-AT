import React from "react";

const JobsInfoSection = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      {/* Hero Section */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto max-w-7xl">
          <div className="">
            <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-[18px]">
              {data.first_card_title}
              <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
            </h2>
            <h2 className="text-3xl font-semibold text-gray-900 mt-6 mb-6">
              {data.first_card_subtitle}
            </h2>
          </div>
          <div className="prose prose-lg text-gray-600 text-[16px]">
            {data.first_card_table}
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobsInfoSection;
