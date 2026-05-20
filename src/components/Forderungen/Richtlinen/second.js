import React from "react";

const RichtlinienPV = async ({ data }) => {
  if (!data) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-9 md:pt-14 ">
        <p className="text-gray-700">Daten werden geladen...</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pt-9 md:pt-14 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {data?.title}
      </h1>

      <p className="text-gray-700 mb-6">
        {data?.description}
      </p>

      <div
        className="steuerlich-content"
        dangerouslySetInnerHTML={{ __html: data?.rules }}
      />
    </section>
  );
};

export default RichtlinienPV;
