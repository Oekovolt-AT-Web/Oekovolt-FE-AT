import React from "react";
import { HandHelping, LeafyGreen, Sun } from "lucide-react";

const advantages = [
  {
    id: 1,
    title: "Einfachheit",
    description:
      "Wir kümmern uns um alles – von der Berechnung über die PV-Anlage Inspektion bis zur fachgerechten Umsetzung. Sie haben einen zentralen Ansprechpartner für alle Serviceleistungen.",
    icon: <HandHelping className="text-white text-2xl" />,
  },
  {
    id: 2,
    title: "Nachhaltigkeit",
    description:
      "Mit Ihrer Photovoltaikanlage erzeugen Sie saubere Energie direkt aus Sonnenlicht – 100 % erneuerbar, CO₂-frei und effizient.",
    icon: <LeafyGreen className="text-white text-2xl" />,
  },
  {
    id: 3,
    title: "Langlebigkeit",
    description:
      "Regelmäßige Wartung sorgt für maximale Lebensdauer Ihrer Anlage. Photovoltaikanlagen liefern zuverlässige Energie über Jahrzehnte – bei minimalem Wartungsaufwand.",
    icon: <Sun className="text-white text-2xl" />,
  },
];

const AdvantagesSection = () => {
  return (
    <section className="relative bg-[#f7f7f7] px-4 py-10 md:py-16">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-[#669933] uppercase font-semibold tracking-wide inline-block relative text-lg">
          Vorteile
          <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#669933] mt-1"></span>
        </h2>
        <h2 className="text-3xl font-bold text-gray-800 mt-6">
          Ihre Vorteile mit unserem Photovoltaik-Service
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {advantages.map((adv) => (
          <div
            key={adv.id}
            className="relative bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-[#669933] transition duration-300"
          >
            <div className="absolute -top-5 left-6 bg-[#669933] text-white rounded-full w-13 h-13 flex items-center justify-center shadow-md ring-4 ring-white text-sm font-bold z-10">
              {adv.icon}
            </div>

            <h4 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
              {adv.title}
            </h4>
            <p className="text-gray-600 leading-relaxed text-[15px]">
              {adv.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdvantagesSection;