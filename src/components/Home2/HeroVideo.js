"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/** Darf das Video überhaupt laden? Nur ab md, ohne reduzierte Bewegung, ohne Datensparmodus/langsame Verbindung. */
const videoErlaubt = () => {
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const c = navigator.connection;
  return !(c?.saveData === true || /2g|3g/.test(c?.effectiveType || ""));
};

/**
 * Hintergrundvideo des Heros – erst nach dem Laden der Seite, nur ab md,
 * nicht bei Datensparmodus/langsamer Verbindung und nicht bei reduzierter
 * Bewegung. Das Standbild (next/image im Hero) trägt das LCP.
 * Performance: preload="metadata" (nur Kopfdaten, kein Vorabladen der ganzen
 * Datei); abgespielt wird nur, solange der Hero im Sichtfeld und der Tab
 * sichtbar ist – sonst pausiert es und lädt nicht weiter.
 * Tiefe: `data-s01-tiefe` – die Startseiten-Parallaxe (Startseite/s01-buehne) bewegt das Video
 * synchron mit dem Standbild.
 * Barrierefreiheit (WCAG 2.2.2): Das Video lässt sich jederzeit anhalten; die
 * Wahl des Besuchers („pausiert“) wird vom automatischen Abspielen respektiert.
 */
export default function HeroVideo({ src, poster }) {
  const [erlaubt, setErlaubt] = useState(false);
  const [bereit, setBereit] = useState(false);
  const [pausiert, setPausiert] = useState(false);
  const ref = useRef(null);
  // Vom Besucher angehalten? Dann startet weder Sichtbarkeit noch Tab-Wechsel es erneut.
  const manuell = useRef(false);

  useEffect(() => {
    if (!videoErlaubt()) return undefined;

    let idle;
    let timer;
    const frei = () => setErlaubt(true);
    const planen = () => {
      if (window.requestIdleCallback) idle = window.requestIdleCallback(frei, { timeout: 3000 });
      else timer = setTimeout(frei, 1500);
    };
    if (document.readyState === "complete") planen();
    else window.addEventListener("load", planen, { once: true });

    // Stellt jemand während des Besuchs „Bewegung reduzieren“ ein, verschwindet das Video.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aendern = () => mq.matches && setErlaubt(false);
    mq.addEventListener?.("change", aendern);

    return () => {
      window.removeEventListener("load", planen);
      if (idle && window.cancelIdleCallback) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      mq.removeEventListener?.("change", aendern);
    };
  }, []);

  // Nur abspielen, solange der Hero sichtbar ist (IntersectionObserver) und der Tab im Vordergrund steht.
  useEffect(() => {
    const v = ref.current;
    if (!erlaubt || !v) return undefined;

    let imBild = false;
    const steuern = () => {
      if (manuell.current) return;
      if (imBild && document.visibilityState === "visible") v.play().catch(() => {});
      else v.pause();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        imBild = e.isIntersecting;
        steuern();
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    document.addEventListener("visibilitychange", steuern);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", steuern);
    };
  }, [erlaubt]);

  const umschalten = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      manuell.current = false;
      v.play().catch(() => {});
      setPausiert(false);
    } else {
      manuell.current = true;
      v.pause();
      setPausiert(true);
    }
  };

  if (!erlaubt) return null;

  return (
    <>
      <video
        ref={ref}
        data-s01-tiefe="0.3"
        className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 ${bereit ? "opacity-100" : "opacity-0"}`}
        muted
        loop
        playsInline
        preload="metadata"
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
        className="ov-glass absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ov-300 md:right-6 md:top-6"
      >
        {pausiert ? <Play aria-hidden="true" className="h-4 w-4" /> : <Pause aria-hidden="true" className="h-4 w-4" />}
      </button>
    </>
  );
}
