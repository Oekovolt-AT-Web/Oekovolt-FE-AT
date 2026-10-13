import React from "react";

const ServiceSection = () => {
  return (
    <section className="py-10 md:py-16 px-4 max-w-7xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-[18px]">
          SERVICE
          <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
        </h2>
      </div>
      <h1 className="text-[28px] md:text-[35px] font-bold text-gray-900 mb-6 leading-tight text-center">
        Service aus einer Hand – Rundum sorglos mit Ökovolt
      </h1>
      <div className="prose prose-lg text-gray-600 space-y-4 text-center text-[18px]">
        <p>
          So zuverlässig, sauber und effizient Ihre Technik auch ist – regelmäßiger Service, Wartung und
          kontinuierliches Monitoring sind unerlässlich.
        </p>
        <p>
          Mit Oekovolt Photovoltaik Service Deutschland brauchen Sie sich um nichts zu kümmern: Als Generalunternehmer
          sind wir Ihr verlässlicher Full-Service-Partner für Solaranlagen.
        </p>
        <p>&bdquo;Rundum sorglos&quot; ist bei uns gelebte Realität.</p>
        <p>
          Ob Solaranlagen Wartung, Optimierung, Reinigung, Reparatur oder Instandhaltung nach Sturmschäden,
          Überspannung, Brand oder technischer Störung – Oekovolt bietet Ihnen alles aus einer Hand.
        </p>
        <p>
          Unsere erfahrenen Expert:innen übernehmen auch die professionelle Reinigung Ihrer PV-Anlage. Dabei verwenden
          wir Osmose-Wasser ohne Reinigungsmittel und Chemikalien. Mit speziell entwickelten
          Reinigungsgeräten werden die PV-Module gründlich und schonend von Schmutz, Staub und Ablagerungen befreit.
        </p>
      </div>
    </section>
  );
};

export default ServiceSection;
