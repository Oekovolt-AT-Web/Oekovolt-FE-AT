"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hintergrundvideo des Heros – erst nach dem Laden der Seite, nur ab md,
 * nicht bei Datensparmodus/langsamer Verbindung und nicht bei reduzierter
 * Bewegung. Das Standbild (next/image im Hero) trägt das LCP.
 */
export default function HeroVideo({ src, poster }) {
  const [erlaubt, setErlaubt] = useState(false);
  const [bereit, setBereit] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reduziert = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const c = navigator.connection;
    const sparsam = c?.saveData === true || /2g|3g/.test(c?.effectiveType || "");
    if (!mq.matches || reduziert || sparsam) return;

    const frei = () => setErlaubt(true);
    const planen = () => (window.requestIdleCallback ? window.requestIdleCallback(frei, { timeout: 3000 }) : setTimeout(frei, 1500));
    if (document.readyState === "complete") planen();
    else window.addEventListener("load", planen, { once: true });
  }, []);

  useEffect(() => {
    if (erlaubt) ref.current?.play().catch(() => {});
  }, [erlaubt]);

  if (!erlaubt) return null;

  return (
    <video
      ref={ref}
      className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ${bereit ? "opacity-100" : "opacity-0"}`}
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      onCanPlay={() => setBereit(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
