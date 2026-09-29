"use client";

// src/components/Team/Zeitreise.js
//
// Cinematische Unternehmensgeschichte für /uber-uns: vier Kapitel
// (2010 → 2012 → 2021 → Heute), scroll-gebunden. Ab lg bleibt eine Bühne
// (Bild, große Jahreszahl, Text) im Bild stehen, während die Seite weiter-
// scrollt; darunter eine gestapelte Fassung ohne Sticky-Effekt.
// Alle Texte stehen immer im DOM (SEO), inaktive Kapitel sind nur
// ausgeblendet. Inhalte: MEILENSTEINE aus @/data/unternehmen.

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MEILENSTEINE } from "@/data/unternehmen";

/** Kapitel = Hauptjahr + Nebenstationen aus derselben Etappe. */
const KAPITEL = [
  {
    jahr: "2010",
    ort: "Türkheim · Unterallgäu",
    neben: [],
    bild: { src: "/Images/Jobs/jobs1.jpg", alt: "Monteure tragen ein Photovoltaikmodul über ein Dach", pos: "50% 40%" },
  },
  {
    jahr: "2012",
    ort: "Ostermiething · Innviertel",
    neben: ["2013"],
    bild: { src: "/Images/AT/unternehmen-b/pfarrkirche-ostermiething.jpg", alt: "Ortskern von Ostermiething mit Pfarrkirche im Innviertel", pos: "30% 50%" },
  },
  {
    jahr: "2021",
    ort: "Österreich",
    neben: ["2020", "2022"],
    bild: { src: "/Images/Referenzen/Referenzkarte-1.jpg", alt: "Reihen einer Freiflächen-Photovoltaikanlage, Luftaufnahme", pos: "50% 50%" },
  },
  {
    jahr: "Heute",
    ort: "Alle neun Bundesländer",
    neben: ["2025"],
    bild: { src: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "Leitwarte mit Bildschirmen zur Überwachung von Energieanlagen", pos: "50% 40%" },
  },
];

const station = (jahr) => MEILENSTEINE.find((m) => m.jahr === jahr);
const DATEN = KAPITEL.map((k) => ({ ...k, m: station(k.jahr), nebenM: k.neben.map(station).filter(Boolean) }));

export default function Zeitreise() {
  const buehne = useRef(null);
  const [fortschritt, setFortschritt] = useState(0);
  const n = DATEN.length;
  const aktiv = Math.min(n - 1, Math.floor(fortschritt * n * 0.999));

  useEffect(() => {
    let raf = 0;
    const messen = () => {
      raf = 0;
      const el = buehne.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const weg = r.height - window.innerHeight;
      if (weg <= 0) return;
      setFortschritt(Math.min(1, Math.max(0, -r.top / weg)));
    };
    const plan = () => {
      if (!raf) raf = requestAnimationFrame(messen);
    };
    messen();
    window.addEventListener("scroll", plan, { passive: true });
    window.addEventListener("resize", plan);
    return () => {
      window.removeEventListener("scroll", plan);
      window.removeEventListener("resize", plan);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const springe = (i) => {
    const el = buehne.current;
    if (!el) return;
    const weg = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + weg * ((i + 0.5) / n);
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <>
      {/* ---------- Desktop: scroll-gebundene Bühne ---------- */}
      <div ref={buehne} className="relative hidden lg:block" style={{ height: `${n * 60 + 20}vh` }}>
        <div className="sticky top-0 flex h-screen min-h-[640px] items-center overflow-hidden">
          {/* Bilder */}
          {DATEN.map((k, i) => (
            <div
              key={k.jahr}
              aria-hidden="true"
              className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                i === aktiv ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
              }`}
            >
              <Image src={k.bild.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: k.bild.pos }} />
            </div>
          ))}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />

          <div className="ov-container relative grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-16 pb-16 pt-16">
            {/* Jahreszahl */}
            <div className="relative h-[26rem]">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-ov-300">Unsere Geschichte</p>
              {DATEN.map((k, i) => (
                <div
                  key={k.jahr}
                  aria-hidden={i !== aktiv}
                  className={`absolute inset-x-0 top-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    i === aktiv ? "translate-y-0 opacity-100" : i < aktiv ? "-translate-y-8 opacity-0" : "translate-y-8 opacity-0"
                  }`}
                >
                  <p className="ov-num font-display text-[clamp(6rem,4rem+6vw,10.5rem)] font-extrabold leading-[0.85] tracking-[-0.04em] text-white">
                    {k.jahr === "Heute" ? <span className="ov-text-gradient-light">Heute</span> : k.jahr}
                  </p>
                  <p className="mt-6 flex items-center gap-3 text-[15px] font-semibold text-white/70">
                    <span aria-hidden="true" className="h-px w-10 bg-ov-400" />
                    {k.ort}
                  </p>
                  {k.nebenM.length > 0 && (
                    <ul className="mt-8 max-w-md space-y-3">
                      {k.nebenM.map((s) => (
                        <li key={s.jahr} className="flex gap-4 rounded-2xl bg-white/[0.06] p-3.5 ring-1 ring-white/10 backdrop-blur-sm">
                          <span className="ov-num w-11 shrink-0 font-display text-[15px] font-extrabold text-sun-300">{s.jahr}</span>
                          <span className="text-[13.5px] leading-snug text-white/70">
                            <strong className="block font-semibold text-white">{s.titel}</strong>
                            <span className="line-clamp-2">{s.text[0]}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Text */}
            <div className="relative min-h-[26rem]">
              {DATEN.map((k, i) => (
                <article
                  key={k.jahr}
                  aria-hidden={i !== aktiv}
                  className={`absolute inset-x-0 top-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    i === aktiv ? "pointer-events-auto -translate-y-1/2 opacity-100" : "pointer-events-none -translate-y-[45%] opacity-0"
                  }`}
                >
                  <div className="ov-glass rounded-[2rem] p-8 shadow-2xl xl:p-10">
                    <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">
                      Kapitel {i + 1} von {n}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(1.6rem,1.2rem+1vw,2.1rem)] font-extrabold leading-tight tracking-tight text-white">
                      {k.m?.titel}
                    </h3>
                    <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-white/75">
                      {(k.m?.text || []).map((t, j) => (
                        <p key={j}>{t}</p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Fortschrittsleiste */}
          <nav aria-label="Kapitel der Unternehmensgeschichte" className="absolute inset-x-0 bottom-8">
            <div className="ov-container">
              <div className="relative">
                <div aria-hidden="true" className="absolute left-0 right-0 top-[7px] h-px bg-white/15" />
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-[7px] h-px bg-gradient-to-r from-ov-400 to-sun-300"
                  style={{ width: `${fortschritt * 100}%` }}
                />
                <ol className="relative flex justify-between">
                  {DATEN.map((k, i) => (
                    <li key={k.jahr}>
                      <button
                        type="button"
                        onClick={() => springe(i)}
                        aria-current={i === aktiv ? "step" : undefined}
                        className="group flex flex-col items-center gap-2 first:items-start"
                      >
                        <span
                          className={`h-[15px] w-[15px] rounded-full ring-4 transition-colors ${
                            i <= aktiv ? "bg-ov-400 ring-ov-400/25" : "bg-navy-900 ring-white/15"
                          }`}
                        />
                        <span className={`ov-num text-[13px] font-bold transition-colors ${i === aktiv ? "text-white" : "text-white/45 group-hover:text-white/80"}`}>
                          {k.jahr}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* ---------- Mobil / Tablet: gestapelte Kapitel ---------- */}
      <ol className="ov-container relative space-y-6 pb-16 md:pb-24 lg:hidden">
        {DATEN.map((k) => (
          <li key={k.jahr} className="overflow-hidden rounded-[2rem] bg-white/[0.04] ring-1 ring-white/10">
            <div className="relative aspect-[16/9]">
              <Image src={k.bild.src} alt={k.bild.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" style={{ objectPosition: k.bild.pos }} />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
              <p className="ov-num absolute bottom-4 left-5 font-display text-[3.4rem] font-extrabold leading-none tracking-tight text-white">{k.jahr}</p>
            </div>
            <div className="p-5 sm:p-7">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">{k.ort}</p>
              <h3 className="mt-2 font-display text-[20px] font-extrabold leading-snug text-white">{k.m?.titel}</h3>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-white/70">
                {(k.m?.text || []).map((t, j) => (
                  <p key={j}>{t}</p>
                ))}
              </div>
              {k.nebenM.length > 0 && (
                <details className="group mt-5 border-t border-white/10 pt-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[13.5px] font-semibold text-sun-300 [&::-webkit-details-marker]:hidden">
                    Weitere Stationen: {k.nebenM.map((x) => x.jahr).join(", ")}
                    <span aria-hidden="true" className="transition-transform group-open:rotate-45">+</span>
                  </summary>
                <ul className="mt-3 space-y-3">
                  {k.nebenM.map((s) => (
                    <li key={s.jahr} className="flex gap-3">
                      <span className="ov-num w-11 shrink-0 font-display text-[14.5px] font-extrabold text-sun-300">{s.jahr}</span>
                      <span className="text-[14px] leading-snug text-white/65">
                        <strong className="font-semibold text-white">{s.titel}.</strong> {s.text[0]}
                      </span>
                    </li>
                  ))}
                </ul>
                </details>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
