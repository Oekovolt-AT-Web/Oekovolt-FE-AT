"use client";
import { Sun, Factory, ChartLine } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import FadeInView from "@/components/Reusable/FadeInView";

export default function SolutionsPage({ data }) {
  const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  const stats = useMemo(() => [
    {
      icon: <Sun className="text-[35px] text-[#669933]/90" />,
      value: toNumber(data?.pv_kraftwerke, 0),
      label: "PV-Kraftwerke",
    },
    {
      icon: <Factory className="text-[35px] text-[#669933]/90" />,
      value: toNumber(data?.leistung, 0),
      suffix: "kWp",
      label: "Leistung",
    },
    {
      icon: <ChartLine className="text-[35px] text-[#669933]/90" />,
      value: toNumber(data?.co2_einsparung, 0),
      suffix: "t",
      label: "Co2-Einsparung",
    },
  // Keine Rückfallwerte: Gruppen-Kennzahlen der DE-Website gelten nicht für Österreich.
  ].filter((s) => s.value > 0), [data?.pv_kraftwerke, data?.leistung, data?.co2_einsparung]);

  const [counters, setCounters] = useState(stats.map(() => 0));
  const countersRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const startCounters = () => {
      const duration = 3000;
      const startTime = performance.now();

      const animateCounters = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        setCounters(stats.map((stat) => Math.floor(progress * stat.value)));
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateCounters);
        }
      };

      animationRef.current = requestAnimationFrame(animateCounters);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (countersRef.current) {
      observer.observe(countersRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stats]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-hidden">
      {/* Title Section */}
      <FadeInView
        direction="bottom"
        distance={50}
        duration={800}
        className="text-center mb-16"
      >
        <h2 className="text-2xl md:text-2xl lg:text-2xl font-medium text-gray-900 mb-6">
          {data?.photovoltaiklösungen_title}
        </h2>
      </FadeInView>

      {/* Stats Section */}
      {/* Zahlenband. Das ist der stärkste Vertrauensbeleg der Startseite und
          war bisher der visuell schwächste Block: nackte Zahlen auf Weiss.
          Jetzt als eigenes Band mit Trennern und Icon-Badges.
          Behoben: toLocaleString() lief ohne Locale und gab "4,081" statt
          "4.081" aus; die Einheit klebte ohne Abstand am Wert. */}
      <div
        ref={countersRef}
        className="relative mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:mb-12"
      >
        <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((item, i) => (
            <FadeInView
              key={i}
              direction="bottom"
              distance={24}
              duration={700}
              delay={i * 150}
              className="px-6 py-8 text-center md:py-10"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f7e6]">
                {item.icon}
              </span>
              <div className="mb-1 text-[34px] font-semibold leading-none tabular-nums text-[#669933] md:text-[42px]">
                {counters[i]?.toLocaleString("de-AT")}
                {item.suffix && (
                  <span className="ml-1 text-[20px] font-medium md:text-[24px]">
                    {item.suffix}
                  </span>
                )}
              </div>
              <p className="text-[15px] text-gray-600 md:text-[16px]">{item.label}</p>
            </FadeInView>
          ))}
        </div>
      </div>
    </div>
  );
}