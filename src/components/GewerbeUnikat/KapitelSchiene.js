"use client";

// src/components/GewerbeUnikat/KapitelSchiene.js
//
// Kapitel-Schiene (nur ab 1400 px): links fixiert, vertikal zentriert, acht Anker-Punkte für K1–K8.
// Aktives Kapitel per IntersectionObserver (Band in Bildschirmmitte), Labels bei Hover/Fokus, Kapitel der
// gewählten Rolle mit ov-Punkt „für Sie“, unten „Steckbrief n/7“ → #fahrplan. Sichtbar erst nach dem
// Hero. Die Farbe folgt dem Grund unter der Schiene (dunkle Bühne → hell, helle Bühne → navy).

import { useEffect, useState } from "react";
import { BAUSTEINE_GESAMT, bausteinZahl, useSteckbrief } from "./_steckbrief";
import { BREITE, KAPITEL, zahl } from "./_tokens";
import s from "./Hero.module.css";

const PUNKTE = KAPITEL.filter((k) => k.id !== "hero");

/** Helligkeit (0 … 1) der ersten deckenden Hintergrundfarbe an einem Punkt – ohne die Schiene selbst. */
function grundIstDunkel(x, y) {
  let el = document.elementFromPoint(x, y);
  while (el && el !== document.documentElement) {
    const bg = getComputedStyle(el).backgroundColor;
    const m = bg && bg.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const [r, g, b, a = 1] = m[1].split(/[\s,/]+/).filter(Boolean).map(Number);
      if (a > 0.5) {
        const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        return lum < 0.45;
      }
    }
    el = el.parentElement;
  }
  return false;
}

export default function KapitelSchiene() {
  const rolle = useSteckbrief((z) => z.rolle);
  const n = useSteckbrief((z) => bausteinZahl(z));
  const [breit, setBreit] = useState(false);
  const [nachHero, setNachHero] = useState(false);
  const [amEnde, setAmEnde] = useState(false);
  const [aktiv, setAktiv] = useState(null);
  const [dunkel, setDunkel] = useState(false);

  // Nur ab 1400 px überhaupt arbeiten
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREITE.schiene}px)`);
    const setzen = () => setBreit(mq.matches);
    setzen();
    mq.addEventListener?.("change", setzen);
    return () => mq.removeEventListener?.("change", setzen);
  }, []);

  useEffect(() => {
    if (!breit || !("IntersectionObserver" in window)) return undefined;
    const hero = document.getElementById("start");
    const footer = document.querySelector("footer");
    const kapitel = PUNKTE.map((k) => document.getElementById(k.anker)).filter(Boolean);

    const rand = new IntersectionObserver((eintraege) => {
      for (const e of eintraege) {
        if (e.target === hero) setNachHero(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === footer) setAmEnde(e.isIntersecting);
      }
    });
    if (hero) rand.observe(hero);
    else setNachHero(true);
    if (footer) rand.observe(footer);

    // Band in der Bildschirmmitte: das Kapitel, das es schneidet, ist aktiv
    const band = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) if (e.isIntersecting) setAktiv(e.target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" }
    );
    kapitel.forEach((el) => band.observe(el));

    // Grundfarbe unter der Schiene: höchstens einmal je Bild messen (ein elementFromPoint, wenige Stile)
    let raf = 0;
    const ton = () => {
      raf = 0;
      setDunkel(grundIstDunkel(8, window.innerHeight / 2));
    };
    const beimScrollen = () => {
      if (!raf) raf = requestAnimationFrame(ton);
    };
    ton();
    window.addEventListener("scroll", beimScrollen, { passive: true });
    window.addEventListener("resize", beimScrollen, { passive: true });
    // Nach dem Scroll-Ende noch einmal genau messen
    window.addEventListener("scrollend", ton);
    return () => {
      rand.disconnect();
      band.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", beimScrollen);
      window.removeEventListener("resize", beimScrollen);
      window.removeEventListener("scrollend", ton);
    };
  }, [breit]);

  const sichtbar = breit && nachHero && !amEnde;

  return (
    <nav
      aria-label="Kapitel dieser Seite"
      data-testid="kapitel-schiene"
      aria-hidden={!sichtbar}
      inert={!sichtbar}
      className={`${s.schiene} fixed left-6 top-1/2 hidden -translate-y-1/2 min-[1400px]:block ${dunkel ? "text-white" : "text-navy-950"}`}
      style={{ zIndex: 40, opacity: sichtbar ? 1 : 0, pointerEvents: sichtbar ? "auto" : "none" }}
    >
      <ol className="relative flex flex-col items-start">
        <span aria-hidden="true" className="absolute bottom-3.5 left-[13px] top-3.5 w-px bg-current opacity-15" />
        {PUNKTE.map((k, i) => {
          const istAktiv = aktiv === k.anker;
          const fuerSie = rolle && k.rollen.includes(rolle);
          const nummer = String(i + 1).padStart(2, "0");
          return (
            <li key={k.id} className="relative">
              <a
                href={`#${k.anker}`}
                aria-current={istAktiv ? "location" : undefined}
                className="group relative flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline-offset-2"
              >
                <span
                  aria-hidden="true"
                  className={`${s.schienePunkt} block rounded-full bg-current ${istAktiv ? "h-2.5 w-2.5 opacity-100" : "h-1.5 w-1.5 opacity-40 group-hover:opacity-80"}`}
                />
                {fuerSie && <span aria-hidden="true" className="absolute -left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-ov-400" />}
                <span
                  className={`pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-semibold opacity-0 shadow-[0_10px_24px_-12px_rgba(3,18,43,0.5)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    dunkel ? "bg-white text-navy-950" : "bg-navy-950 text-white"
                  }`}
                >
                  <span className="ov-num mr-1.5 opacity-60">{nummer}</span>
                  {k.kurz}
                  {fuerSie && <span className={`ml-1.5 ${dunkel ? "text-ov-700" : "text-ov-300"}`}>· für Sie</span>}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <a
        href="#fahrplan"
        className="group relative mt-3 flex h-8 w-8 -translate-x-0.5 items-center justify-center rounded-full focus-visible:outline-offset-2"
        aria-label={`Projektsteckbrief: ${zahl(n)} von ${BAUSTEINE_GESAMT} Bausteinen übernommen`}
      >
        <svg aria-hidden="true" viewBox="0 0 28 28" className="h-8 w-8 -rotate-90">
          <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" />
          <circle
            cx="14"
            cy="14"
            r="11"
            fill="none"
            stroke="#8cba58"
            strokeOpacity={n > 0 ? 1 : 0}
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength="1"
            strokeDasharray={`${n / BAUSTEINE_GESAMT} 1`}
            style={{ transition: "stroke-dasharray 420ms cubic-bezier(0.16,1,0.3,1)" }}
          />
        </svg>
        <span aria-hidden="true" className="ov-num absolute text-[8.5px] font-bold tracking-[-0.02em]">
          {n}/{BAUSTEINE_GESAMT}
        </span>
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-semibold opacity-0 shadow-[0_10px_24px_-12px_rgba(3,18,43,0.5)] transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
            dunkel ? "bg-white text-navy-950" : "bg-navy-950 text-white"
          }`}
        >
          Steckbrief <span className="ov-num">{n}/{BAUSTEINE_GESAMT}</span>
        </span>
      </a>
    </nav>
  );
}
