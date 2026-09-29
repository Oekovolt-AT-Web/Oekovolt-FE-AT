"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Kinoreifer „Showreel“-Rahmen aus Standbildern: Breitbild mit Letterbox,
 * Ken-Burns-Bewegung, Überblendung, Timecode und Filmstreifen-Navigation.
 * Standbilder sind Beispielmotive (freie Fotos), keine Kundenproduktionen.
 *
 * props: szenen [{ bild: { src, alt }, titel, text, einstellung }]
 */
const DAUER = 5200;
const pad = (n) => String(n).padStart(2, "0");

export default function Showreel({ szenen = [] }) {
  const [i, setI] = useState(0);
  const [laeuft, setLaeuft] = useState(true);
  const [sichtbar, setSichtbar] = useState(false);
  const [frames, setFrames] = useState(0);
  const ref = useRef(null);
  const reduziert = useRef(false);

  useEffect(() => {
    reduziert.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduziert.current) setLaeuft(false);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSichtbar(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!laeuft || !sichtbar || szenen.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % szenen.length), DAUER);
    return () => clearInterval(t);
  }, [laeuft, sichtbar, szenen.length, i]);

  // Timecode (25 fps) läuft mit, solange abgespielt wird
  useEffect(() => {
    if (!laeuft || !sichtbar) return;
    const t = setInterval(() => setFrames((f) => f + 1), 40);
    return () => clearInterval(t);
  }, [laeuft, sichtbar]);

  const tc = `${pad(Math.floor(frames / 90000) % 24)}:${pad(Math.floor(frames / 1500) % 60)}:${pad(Math.floor(frames / 25) % 60)}:${pad(frames % 25)}`;
  const s = szenen[i];
  if (!s) return null;

  return (
    <div ref={ref} className="min-w-0">
      <div className="relative overflow-hidden rounded-[1.75rem] bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
          {szenen.map((sz, k) => (
            <div key={sz.bild.src} className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-out", k === i ? "opacity-100" : "opacity-0")} aria-hidden={k !== i}>
              <Image
                src={sz.bild.src}
                alt={sz.bild.alt}
                fill
                priority={k === 0}
                sizes="(max-width: 1280px) 100vw, 1200px"
                className={cn("object-cover", k === i && laeuft && "sb-kenburns")}
                style={sz.bild.position ? { objectPosition: sz.bild.position } : undefined}
              />
            </div>
          ))}
          {/* Letterbox + Vignette */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[7%] bg-black" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[7%] bg-black" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[7%] h-1/2 bg-gradient-to-t from-black/85 to-transparent" />

          {/* Kamera-Overlay */}
          <div className="pointer-events-none absolute inset-x-[4%] top-[11%] flex items-center justify-between font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-[12px]">
            <span className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full bg-red-500", laeuft && "sb-blink")} />
              {laeuft ? "Rec" : "Pause"}
            </span>
            <span className="ov-num hidden sm:inline">{tc}</span>
            <span>
              Szene {pad(i + 1)}/{pad(szenen.length)}
            </span>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute left-[4%] top-[18%] hidden h-6 w-6 border-l-2 border-t-2 border-white/50 sm:block" />
          <div aria-hidden="true" className="pointer-events-none absolute right-[4%] top-[18%] hidden h-6 w-6 border-r-2 border-t-2 border-white/50 sm:block" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[12%] left-[4%] hidden h-6 w-6 border-b-2 border-l-2 border-white/50 sm:block" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-[12%] right-[4%] hidden h-6 w-6 border-b-2 border-r-2 border-white/50 sm:block" />

          {/* Untertitel */}
          <div key={i} className="sb-ein absolute inset-x-[6%] bottom-[12%] max-w-2xl" aria-live="polite">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-ov-300 sm:text-[12.5px]">{s.einstellung}</p>
            <p className="mt-1 font-display text-[20px] font-extrabold leading-tight tracking-tight text-white sm:text-[28px] lg:text-[34px]">{s.titel}</p>
            <p className="mt-1.5 hidden max-w-xl text-[14.5px] leading-relaxed text-white/75 sm:block">{s.text}</p>
          </div>
        </div>

        {/* Fortschritt */}
        <div className="absolute inset-x-0 bottom-0 flex gap-1 px-[4%] pb-[1.2%]" aria-hidden="true">
          {szenen.map((sz, k) => (
            <span key={sz.bild.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
              {k < i && <span className="block h-full w-full bg-white" />}
              {k === i && (
                <span
                  key={i}
                  className="block h-full bg-white"
                  style={{ animation: `sb-fortschritt ${DAUER}ms linear forwards`, animationPlayState: laeuft && sichtbar ? "running" : "paused" }}
                />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Steuerung + Filmstreifen */}
      <div className="mt-5 flex items-center gap-3">
        <button type="button" onClick={() => setI((x) => (x - 1 + szenen.length) % szenen.length)} aria-label="Vorherige Szene" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-white/20">
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => setLaeuft((l) => !l)} aria-label={laeuft ? "Showreel anhalten" : "Showreel abspielen"} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-navy-950 shadow-lg transition-transform hover:scale-105">
          {laeuft ? <Pause aria-hidden="true" className="h-5 w-5" /> : <Play aria-hidden="true" className="ml-0.5 h-5 w-5" />}
        </button>
        <button type="button" onClick={() => setI((x) => (x + 1) % szenen.length)} aria-label="Nächste Szene" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-white/20">
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
        <div className="ov-no-scrollbar min-w-0 flex-1 overflow-x-auto">
          <div className="relative flex w-max gap-2 rounded-xl bg-black/60 px-2 py-4 ring-1 ring-white/10">
            <div aria-hidden="true" className="sb-filmloecher pointer-events-none absolute inset-x-2 top-1 h-2" />
            <div aria-hidden="true" className="sb-filmloecher pointer-events-none absolute inset-x-2 bottom-1 h-2" />
            {szenen.map((sz, k) => (
              <button
                key={sz.bild.src}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Szene ${k + 1}: ${sz.titel}`}
                aria-current={k === i ? "true" : undefined}
                className={cn("relative h-12 w-20 shrink-0 overflow-hidden rounded-[4px] transition-all duration-300 sm:h-14 sm:w-24", k === i ? "ring-2 ring-ov-400" : "opacity-55 hover:opacity-100")}
              >
                <Image src={sz.bild.src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
