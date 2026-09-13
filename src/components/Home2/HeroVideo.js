"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Hintergrundvideo des Heros – erst nach dem Laden der Seite, nur ab md,
 * nicht bei Datensparmodus/langsamer Verbindung und nicht bei reduzierter
 * Bewegung. Das Standbild (next/image im Hero) trägt das LCP.
 * Barrierefreiheit (WCAG 2.2.2): Das Video lässt sich jederzeit anhalten.
 */
export default function HeroVideo({ src, poster }) {
  const [erlaubt, setErlaubt] = useState(false);
  const [bereit, setBereit] = useState(false);
  const [pausiert, setPausiert] = useState(false);
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

  const umschalten = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPausiert(false);
    } else {
      v.pause();
      setPausiert(true);
    }
  };

  if (!erlaubt) return null;

  return (
    <>
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
      <button
        type="button"
        onClick={umschalten}
        aria-label={pausiert ? "Hintergrundvideo abspielen" : "Hintergrundvideo pausieren"}
        title={pausiert ? "Video abspielen" : "Video pausieren"}
        className="ov-glass absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:text-white md:right-6 md:top-6"
      >
        {pausiert ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
      </button>
    </>
  );
}
