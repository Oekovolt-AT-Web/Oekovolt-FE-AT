import { Zap, Sun, Settings, TrendingDown } from "lucide-react";
import FadeInView from "@/components/Reusable/FadeInView";

const iconMap = {
  "Nachhaltig & klimafreundlich": Zap,
  "Komfort zu jeder Jahreszeit": Sun,
  "Unkomplizierte Montage": Settings,
  "Deutlich geringere Heizkosten": TrendingDown,
};

const WarmepumpeVorteileSection = ({ data }) => {
  const items = data?.warmepumpe_first_table;

  if (!Array.isArray(items)) return null;

  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {items?.map((item, index) => {
            const IconComponent = iconMap[item?.title] || Zap;

            return (
              <FadeInView
                key={index}
                direction="bottom"
                distance={40}
                duration={600}
                delay={index * 150}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition duration-300 text-center flex flex-col items-center"
              >
                <IconComponent className="text-[#669933] text-4xl mb-4" />
                <h3 className="text-xl text-gray-800 mb-3">{item?.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item?.description}</p>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WarmepumpeVorteileSection;