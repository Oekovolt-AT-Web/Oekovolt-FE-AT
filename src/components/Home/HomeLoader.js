
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function HomeLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [svgSrc, setSvgSrc] = useState("");

  useEffect(() => {
    // Add timestamp to force fresh load
    setSvgSrc(`/Images/Home/loading.svg?t=${Date.now()}`);
    
    const fadeTimer = setTimeout(() => setFadeOut(true), 1000);
    const hideTimer = setTimeout(() => setVisible(false), 1200);
    
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src={svgSrc || "/Images/Home/loading.svg"}
        alt="Ökovolt lädt..."
        width={120}
        height={120}
        priority
      />
    </div>
  );
}