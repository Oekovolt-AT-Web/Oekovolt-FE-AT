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
      value: toNumber(data?.pv_kraftwerke, 5000),
      label: "PV-Kraftwerke",
    },
    {
      icon: <Factory className="text-[35px] text-[#669933]/90" />,
      value: toNumber(data?.leistung, 340000),
      suffix: "kWp",
      label: "Leistung",
    },
    {
      icon: <ChartLine className="text-[35px] text-[#669933]/90" />,
      value: toNumber(data?.co2_einsparung, 112000),
      suffix: "t",
      label: "Co2-Einsparung",
    },
  ], [data?.pv_kraftwerke, data?.leistung, data?.co2_einsparung]);

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
        <h2 className="text-2xl md:text-2xl lg:text-2xl font-[500] text-gray-900 mb-6">
          {data?.photovoltaiklösungen_title}
        </h2>
      </FadeInView>

      {/* Stats Section */}
      <div
        ref={countersRef}
        className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8 lg:mb-12 relative pb-10"
      >
        {stats.map((item, i) => (
          <FadeInView
            key={i}
            direction="bottom"
            distance={30}
            duration={800}
            delay={i * 200} // 0ms, 200ms, 400ms stagger effect
            className="text-center"
          >
            <div className="flex justify-center mb-2">{item.icon}</div>
            <div className="text-[40px] font-[500] text-[#669933] mb-2">
              {counters[i]?.toLocaleString()}
              {item.suffix && <span>{item.suffix}</span>}
            </div>
            <p className="text-black text-[18px]">{item.label}</p>
          </FadeInView>
        ))}
      </div>
    </div>
  );
}