"use client"
import React from "react";

const RichtlinienPV = ({ data }) => {
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

      <style jsx> {`
        .steuerlich-content {
  margin-bottom: 2rem;
}

.steuerlich-content h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.steuerlich-content h2:first-child {
  margin-top: 0;
}

.steuerlich-content h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #1f2937;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.steuerlich-content ol,
.steuerlich-content ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 2rem;
}

.steuerlich-content li {
  color: #374151;
  margin-bottom: 0.5rem;
}

.steuerlich-content strong {
  font-weight: 600;
  color: #374151;
}

.steuerlich-content p {
  color: #374151;
  margin-top: 1rem;
}

.steuerlich-content em {
  font-style: italic;
  color: #374151;
}

.steuerlich-content .ql-ui {
  display: none;
}
      `}</style>
    </section>
  );
};

export default RichtlinienPV;
