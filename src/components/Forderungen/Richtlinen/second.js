import React from "react";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

// Fetch body data from API
async function getBodyData() {
  try {
    const res = await fetch(
      `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.richtlinen.api.get_richtlinen_data`,
      {
        cache: "no-store", // Use 'force-cache' for static data or add revalidate
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch body data");
    }

    const data = await res.json();
    return data.message?.body || null;
  } catch (error) {
    console.error("Error fetching body data:", error);
    return null;
  }
}

const RichtlinienPV = async () => {
  const bodyData = await getBodyData();

  if (!bodyData) {
    return (
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-9 md:pt-14 ">
        <p className="text-gray-700">Daten werden geladen...</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pt-9 md:pt-14 ">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {bodyData.title}
      </h1>

      <p className="text-gray-700 mb-6">
        {bodyData.description}
      </p>

      <div 
        className="steuerlich-content"
        dangerouslySetInnerHTML={{ __html: bodyData.rules }}
      />
    </section>
  );
};

export default RichtlinienPV;
