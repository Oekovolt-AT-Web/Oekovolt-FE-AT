"use client";

// Konzept-Umschalter Agri-PV (Präfix w25a): vertikal bifazial / hoch aufgeständert / nachgeführt.
// Gezeichnete Querschnitte im Stil der TV-Folie 07 (w25-AgriSzenen.js). Ein Tag läuft durch, solange
// die Bühne im Bild ist: Die Sonne zieht über die Bahn, vertikale Module leuchten morgens auf der
// Ost-, abends auf der Westseite, das hohe Moduldach leuchtet unter der Sonne, Tracker drehen mit.
// Über den Zeitregler lässt sich jede Tageszeit selbst einstellen; das schematische Tagesprofil
// zeigt dazu den aktuellen Punkt. Bei prefers-reduced-motion steht der Tag still (Regler bleibt).
// Pro Bild werden nur CSS-Variablen und wenige Attribute gesetzt – kein React-Render je Frame.

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpFromLine, Columns3, Pause, Play, Rotate3d } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { SzeneHoch, SzeneTracker, SzeneVertikal, W25A_BODEN, W25A_MODULE_HOCH, W25AgriDefs } from "../w25-AgriSzenen";
import { useW25ImBild, useW25Ruhig, useW25Sicht } from "../w25-hooks";

const ICONS = { vertikal: Columns3, hoch: ArrowUpFromLine, tracker: Rotate3d };
const SZENEN = { vertikal: SzeneVertikal, hoch: SzeneHoch, tracker: SzeneTracker };

const START_T = 9.5;
const TAG_S = 15; // Sekunden für 5–21 Uhr
const G = W25A_BODEN;
const BAHN = { cx: 500, rx: 455, ry: 300 };
const ZIEL = { vertikal: [500, 300], hoch: [500, 186], tracker: [500, 300] };
const VB_Y = 50;
const VB_H = 420;
const rd = (v) => Math.round(v * 10) / 10;
const r3 = (v) => Math.round(v * 1000) / 1000;

/* ---------- schematische Tagesprofile (5–21 Uhr), auf 1 normiert ---------- */
const glocke = (h, m, s) => Math.exp(-0.5 * ((h - m) / s) ** 2);
const sig = (v) => 1 / (1 + Math.exp(-v));
const ROH = {
  vertikal: (h) => 0.92 * glocke(h, 9, 1.7) + 0.92 * glocke(h, 17, 1.7) + 0.38 * glocke(h, 13, 1.6),
  hoch: (h) => glocke(h, 13, 2.6),
  tracker: (h) => sig((h - 7.6) * 1.7) * sig((18.4 - h) * 1.7),
};
const KW = 260;
const KH = 74;
const kx = (h) => ((h - 5) / 16) * KW;
const ky = (f) => KH - 6 - f * (KH - 16);
const PROFIL = Object.fromEntries(
  Object.entries(ROH).map(([id, fn]) => {
    const pts = Array.from({ length: 65 }, (_, k) => 5 + k * 0.25);
    const max = Math.max(...pts.map(fn));
    const f = (h) => fn(h) / max;
    const linie = pts.map((h, k) => `${k ? "L" : "M"}${rd(kx(h))} ${rd(ky(f(h)))}`).join("");
    return [id, { f, linie, flaeche: `${linie}L${KW} ${KH - 6}L0 ${KH - 6}Z` }];
  })
);

/* ---------- Tageslauf → Werte ---------- */
function tag(t) {
  const phi = (Math.PI * (t - 5)) / 16;
  const s = Math.max(0, Math.sin(phi));
  const c = Math.cos(phi);
  const x = BAHN.cx - BAHN.rx * c;
  const y = G - BAHN.ry * Math.sqrt(s);
  const rand = Math.min(1, s * 3.2);
  return {
    phi,
    x,
    y,
    ost: Math.max(0, c) ** 0.8 * rand,
    west: Math.max(0, -c) ** 0.8 * rand,
    tag: rand * (0.35 + 0.65 * s),
    dreh: Math.max(-55, Math.min(55, -(90 - (phi * 180) / Math.PI))),
    schatten: c * 34,
    daemmer: (1 - s) ** 2,
    sonne: Math.min(1, s * 5),
  };
}
const uhr = (t) => {
  const m = Math.round(t * 4) * 15;
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
};
const varsVon = (w) => ({
  "--w25a-ost": r3(w.ost),
  "--w25a-west": r3(w.west),
  "--w25a-tag": r3(w.tag),
  "--w25a-dreh": `${rd(w.dreh)}deg`,
  "--w25a-schatten": rd(w.schatten),
  "--w25a-sx": rd(w.x),
  "--w25a-daemmer": r3(w.daemmer),
  "--w25a-sonne": r3(w.sonne),
});
const sonnenTransform = (w) => `translate(${rd(w.x)} ${rd(w.y)})`;
const kegelTransform = (w, id) => {
  const z = ZIEL[id] || ZIEL.vertikal;
  const a = (Math.atan2(z[1] - w.y, z[0] - w.x) * 180) / Math.PI;
  const d = Math.hypot(z[0] - w.x, z[1] - w.y);
  return `rotate(${rd(a)}) scale(${r3(d / 100)} 1)`;
};
const START = tag(START_T);

/* ---------- Beschriftungen im Bild (Koordinaten im 1000 × 470-Raster) ---------- */
const LABELS = {
  vertikal: [
    { x: 420, y: 452, t: "Gasse z. B. 10 m", mitte: true },
    { x: 330, y: 250, t: "Ost ◂ ▸ West", mitte: true },
  ],
  hoch: [
    { x: 248, y: 300, t: "≥ 2 m", mitte: true },
    { x: 508, y: 236, t: "Hagelnetz zusätzlich", mitte: true },
  ],
  tracker: [
    { x: 390, y: 188, t: "Schwenkbereich", mitte: true },
    { x: 500, y: 452, t: "einachsig nachgeführt", mitte: true },
  ],
};

const CSS = `
.w25a-wachs{transform-box:fill-box;transform-origin:50% 100%;animation:w25a-wachs 900ms cubic-bezier(.22,1,.36,1) both}
@keyframes w25a-wachs{from{transform:scaleY(0)}to{transform:scaleY(1)}}
.w25a-quer{transform-box:fill-box;transform-origin:0 50%;animation:w25a-quer 1000ms cubic-bezier(.22,1,.36,1) both}
@keyframes w25a-quer{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.w25a-fall{animation:w25a-fall 850ms cubic-bezier(.22,1,.36,1) both}
@keyframes w25a-fall{from{opacity:0;transform:translateY(-22px)}to{opacity:1;transform:none}}
.w25a-hoch{animation:w25a-hoch 950ms cubic-bezier(.22,1,.36,1) both}
@keyframes w25a-hoch{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
.w25a-spross{transform-box:fill-box;transform-origin:50% 100%;animation:w25a-spross 1100ms cubic-bezier(.22,1,.36,1) both}
@keyframes w25a-spross{from{opacity:0;transform:scale(.55)}to{opacity:1;transform:scale(1)}}
.w25a-rein{animation:w25a-rein 800ms ease both}
@keyframes w25a-rein{from{opacity:0}to{opacity:1}}
.w25a-label{animation:w25a-label 700ms cubic-bezier(.22,1,.36,1) 900ms both}
@keyframes w25a-label{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.w25a-dreh{transform:rotate(var(--w25a-dreh))}
.w25a-funke{transform-box:fill-box;opacity:0;animation:w25a-funke 2300ms cubic-bezier(.3,.6,.5,1) infinite both}
@keyframes w25a-funke{0%{opacity:0;transform:translateY(0)}18%{opacity:1}100%{opacity:0;transform:translateY(-70px)}}
.w25a-wiegen{transform-box:fill-box;transform-origin:50% 100%;animation:w25a-wiegen 3800ms ease-in-out infinite alternate both}
@keyframes w25a-wiegen{from{transform:skewX(-4deg)}to{transform:skewX(4deg)}}
.w25a-atem{transform-box:fill-box;transform-origin:50% 100%;animation:w25a-atem 5200ms ease-in-out infinite alternate both}
@keyframes w25a-atem{from{transform:scale(1)}to{transform:scale(1.03)}}
[data-w25-bereit]:not([data-w25-an]) :is(.w25a-wachs,.w25a-quer,.w25a-fall,.w25a-hoch,.w25a-spross,.w25a-rein,.w25a-label,.w25a-bahn){animation-play-state:paused}
.w25a-bahn{stroke-dasharray:1;animation:w25a-bahn 1800ms cubic-bezier(.65,0,.35,1) 200ms both}
@keyframes w25a-bahn{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.w25a-range{-webkit-appearance:none;appearance:none;display:block;width:100%;height:44px;background:transparent;cursor:pointer;touch-action:pan-y}
.w25a-range::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:linear-gradient(90deg,rgba(255,216,115,.25),#ffd873) no-repeat 0 0/var(--f,28%) 100%,rgba(255,255,255,.14)}
.w25a-range::-moz-range-track{height:6px;border-radius:999px;background:rgba(255,255,255,.14)}
.w25a-range::-moz-range-progress{height:6px;border-radius:999px;background:#ffd873}
.w25a-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:24px;margin-top:-9px;border-radius:999px;background:radial-gradient(circle,#fff6d6 0 35%,#ffc53d 36%);border:0;box-shadow:0 0 0 6px rgba(255,197,61,.18),0 4px 12px rgba(0,0,0,.4)}
.w25a-range::-moz-range-thumb{width:24px;height:24px;border-radius:999px;background:#ffc53d;border:0;box-shadow:0 0 0 6px rgba(255,197,61,.18)}
.w25a-range:focus{outline:none}
.w25a-range:focus-visible{outline:3px solid #ffd873;outline-offset:4px;border-radius:10px}
@media (prefers-reduced-motion:reduce){
  .w25a-wachs,.w25a-quer,.w25a-fall,.w25a-hoch,.w25a-spross,.w25a-rein,.w25a-label,.w25a-bahn,.w25a-wiegen,.w25a-atem{animation:none}
  .w25a-funke{animation:none;opacity:0}
}
`;

/**
 * konzepte: [{ id: "vertikal"|"hoch"|"tracker", label, kurz, bild: {src, alt, position}, werte: [{ label, wert }], hinweis, profil }]
 * Die Illustration ist schematisch (nicht maßstäblich).
 */
export default function AgriKonzepte({ konzepte = [], link, className }) {
  const [aktivId, setAktivId] = useState(konzepte[0]?.id);
  const k = konzepte.find((x) => x.id === aktivId) || konzepte[0];
  const [laeuft, setLaeuft] = useState(true);
  const ruhig = useW25Ruhig();
  const buehne = useRef(null);
  const phase = useW25Sicht(buehne, { schwelle: 0.3 });
  const imBild = useW25ImBild(buehne);

  const zeit = useRef(START_T);
  const aktivRef = useRef(k?.id);
  aktivRef.current = k?.id;
  const sonneRef = useRef(null);
  const kegelRef = useRef(null);
  const cursorRef = useRef(null);
  const reglerRef = useRef(null);
  const uhrRef = useRef(null);
  const modulRefs = useRef([]);

  const zeichne = useCallback((t) => {
    const el = buehne.current;
    if (!el) return;
    const w = tag(t);
    for (const [n, v] of Object.entries(varsVon(w))) el.style.setProperty(n, String(v));
    sonneRef.current?.setAttribute("transform", sonnenTransform(w));
    kegelRef.current?.setAttribute("transform", kegelTransform(w, aktivRef.current));
    if (aktivRef.current === "hoch") {
      W25A_MODULE_HOCH.forEach((mx, i) => {
        const m = modulRefs.current[i];
        if (m) m.style.opacity = String(r3(Math.max(0, 1 - Math.abs(w.x - mx) / 105) * w.sonne));
      });
    }
    const p = PROFIL[aktivRef.current];
    if (p && cursorRef.current) cursorRef.current.setAttribute("transform", `translate(${rd(kx(t))} ${rd(ky(p.f(t)))})`);
    const r = reglerRef.current;
    if (r) {
      if (Number(r.value) !== t) r.value = String(Math.round(t * 4) / 4);
      r.style.setProperty("--f", `${rd(((t - 5) / 16) * 100)}%`);
      r.setAttribute("aria-valuetext", `${uhr(t)} Uhr`);
    }
    if (uhrRef.current) uhrRef.current.textContent = uhr(t);
  }, []);

  // Nach jedem Konzeptwechsel Licht, Module und Profilpunkt neu setzen
  useEffect(() => {
    zeichne(zeit.current);
  }, [aktivId, zeichne]);

  // Bei reduzierter Bewegung startet der Tag nicht von selbst
  useEffect(() => {
    if (ruhig) setLaeuft(false);
  }, [ruhig]);

  // Tageslauf, nur solange die Bühne sichtbar ist
  useEffect(() => {
    if (!laeuft || !imBild || phase === "warten") return;
    let raf;
    let vorher = performance.now();
    const schleife = (jetzt) => {
      const dt = Math.min(jetzt - vorher, 64);
      vorher = jetzt;
      let t = zeit.current + (dt / 1000) * (16 / TAG_S);
      if (t > 21) t = 5;
      zeit.current = t;
      zeichne(t);
      raf = requestAnimationFrame(schleife);
    };
    raf = requestAnimationFrame(schleife);
    return () => cancelAnimationFrame(raf);
  }, [laeuft, imBild, phase, zeichne]);

  if (!k) return null;
  const Szene = SZENEN[k.id] || SzeneVertikal;
  const profil = PROFIL[k.id] || PROFIL.vertikal;

  return (
    <div data-blk="agrikonzepte" className={cn("overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_90px_-40px_rgba(3,18,43,0.5)] ring-1 ring-ink-200/70 md:rounded-[2.5rem]", className)}>
      <style>{CSS}</style>

      {/* ================= dunkle Bühne ================= */}
      <div className="relative overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Konzeptwahl */}
        <div className="relative z-10 flex flex-col gap-4 px-4 pt-4 md:flex-row md:items-center md:justify-between md:px-8 md:pt-7">
          <div role="group" aria-label="Agri-PV-Konzept wählen" className="grid grid-cols-3 gap-1 rounded-2xl bg-white/[0.05] p-1 ring-1 ring-white/10 md:inline-grid md:w-auto">
            {konzepte.map((x) => {
              const Icon = ICONS[x.id];
              const an = x.id === k.id;
              return (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={an}
                  onClick={() => setAktivId(x.id)}
                  className={cn(
                    "flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition-[background-color,color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-300 sm:flex-row sm:gap-2.5 md:px-4",
                    an ? "bg-white text-navy-950 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)]" : "text-white/65 hover:bg-white/[0.07] hover:text-white"
                  )}
                >
                  {Icon && (
                    <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-300", an ? "bg-ov-500 text-white" : "bg-white/[0.08] text-ov-300")}>
                      <Icon aria-hidden="true" className="h-4 w-4" />
                    </span>
                  )}
                  <span className="font-display text-[12.5px] font-bold leading-tight sm:text-[14.5px]">{x.label}</span>
                </button>
              );
            })}
          </div>
          <ul aria-hidden="true" className="hidden items-center gap-5 text-[13px] font-semibold md:flex">
            <li className="flex items-center gap-2 text-sun-300">
              <span className="h-2.5 w-2.5 rounded-full bg-sun-300 shadow-[0_0_0_4px_rgba(255,197,61,0.2)]" />
              oben Solarstrom
            </li>
            <li className="flex items-center gap-2 text-ov-300">
              <span className="h-2.5 w-2.5 rounded-full bg-ov-300 shadow-[0_0_0_4px_rgba(174,208,131,0.2)]" />
              darunter Ernte
            </li>
          </ul>
        </div>

        {/* Bühne */}
        <div ref={buehne} className="relative mt-2 md:mt-0" style={varsVon(START)}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(60% 90% at 50% 100%, rgba(140,186,88,0.12), transparent 70%)" }} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ opacity: "calc(var(--w25a-daemmer) * 0.9)", background: "radial-gradient(70% 70% at 50% 92%, rgba(245,140,60,0.22), transparent 70%)" }}
          />
          <div className="relative aspect-[500/420] overflow-hidden md:aspect-[1000/420]">
            <div className="absolute inset-y-0 left-[-40%] w-[200%] md:left-0 md:w-full">
              <svg viewBox={`0 ${VB_Y} 1000 ${VB_H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
                <W25AgriDefs />
                <ellipse cx="500" cy={G} rx="520" ry="150" fill="url(#w25a-horizont)" clipPath="url(#w25a-himmel)" />
                <path
                  className="w25a-bahn"
                  pathLength="1"
                  d={`M${BAHN.cx - BAHN.rx} ${G}A${BAHN.rx} ${BAHN.ry} 0 0 1 ${BAHN.cx + BAHN.rx} ${G}`}
                  fill="none"
                  stroke="url(#w25a-bahn)"
                  strokeWidth="1.5"
                />
                <g clipPath="url(#w25a-himmel)">
                  <g ref={sonneRef} transform={sonnenTransform(START)} style={{ opacity: "var(--w25a-sonne)" }}>
                    <g ref={kegelRef} transform={kegelTransform(START, k.id)}>
                      <polygon points="0,-7 100,-50 100,50 0,7" fill="url(#w25a-kegel)" />
                    </g>
                    <circle r="74" fill="url(#w25a-hof)" />
                    <circle r="31" fill="none" stroke="#ffc53d" strokeOpacity="0.35" strokeWidth="1.5" />
                    <circle r="20" fill="#ffc53d" />
                    <circle r="11" fill="#ffe7a3" />
                  </g>
                </g>
                {/* Boden */}
                <polygon points={`20,${G} 980,${G} 980,${G - 20} 44,${G - 20}`} fill="rgba(140,186,88,0.05)" />
                <line x1="44" x2="980" y1={G - 20} y2={G - 20} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                <rect x="20" y={G} width="960" height="24" fill="url(#w25a-erde)" />
                <g key={k.id}>
                  <Szene modulRefs={modulRefs} />
                </g>
                <line x1="20" x2="980" y1={G} y2={G} stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
              </svg>
              <div key={`l-${k.id}`} aria-hidden="true">
                {(LABELS[k.id] || []).map((l) => (
                  <span
                    key={l.t}
                    className="absolute"
                    style={{ left: `${l.x / 10}%`, top: `${rd(((l.y - VB_Y) / VB_H) * 100)}%`, transform: l.mitte ? "translate(-50%, -50%)" : "translateY(-50%)" }}
                  >
                    <span className="w25a-label block whitespace-nowrap rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15 md:text-[13px]">{l.t}</span>
                  </span>
                ))}
              </div>
            </div>
            <span aria-hidden="true" className="absolute bottom-2 left-4 text-[11px] font-semibold text-white/60 md:bottom-3 md:left-8 md:text-[13px]">
              Ost · Morgen
            </span>
            <span aria-hidden="true" className="absolute bottom-2 right-4 text-[11px] font-semibold text-white/60 md:bottom-3 md:right-8 md:text-[13px]">
              West · Abend
            </span>
          </div>
          <p className="sr-only">
            Schematische Darstellung: {k.label} – {k.kurz} Tagesprofil: {k.profil}
          </p>
        </div>

        {/* Tageslauf & Tagesprofil */}
        <div className="relative grid gap-4 border-t border-white/10 px-4 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:px-8 md:py-5">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => setLaeuft((v) => !v)}
              aria-label={laeuft ? "Tageslauf anhalten" : "Tageslauf abspielen"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-white ring-1 ring-white/15 transition-colors hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun-300"
            >
              {laeuft ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="ml-0.5 h-4 w-4" />}
            </button>
            <div className="w-[52px] shrink-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">Uhrzeit</p>
              <p ref={uhrRef} className="ov-num font-display text-[18px] font-extrabold leading-tight text-white">
                {uhr(START_T)}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <input
                ref={reglerRef}
                type="range"
                min={5}
                max={21}
                step={0.25}
                defaultValue={START_T}
                aria-label="Tageszeit"
                aria-valuetext={`${uhr(START_T)} Uhr`}
                onChange={(e) => {
                  setLaeuft(false);
                  zeit.current = Number(e.target.value);
                  zeichne(zeit.current);
                }}
                className="w25a-range"
                style={{ "--f": `${rd(((START_T - 5) / 16) * 100)}%` }}
              />
              <div aria-hidden="true" className="-mt-1 flex justify-between text-[11px] text-white/40">
                <span>5 Uhr</span>
                <span>13 Uhr</span>
                <span>21 Uhr</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <svg viewBox={`-6 0 ${KW + 12} ${KH}`} className="h-[62px] w-[150px] shrink-0 md:h-[74px] md:w-[200px]" aria-hidden="true">
              <line x1="0" x2={KW} y1={KH - 6} y2={KH - 6} stroke="rgba(255,255,255,0.18)" />
              <path key={k.id} d={profil.flaeche} fill="rgba(255,197,61,0.16)" className="w25a-rein" />
              <path d={profil.linie} fill="none" stroke="#ffc53d" strokeWidth="2.2" strokeLinejoin="round" />
              <g ref={cursorRef} transform={`translate(${rd(kx(START_T))} ${rd(ky(profil.f(START_T)))})`}>
                <line x1="0" x2="0" y1="0" y2={KH} stroke="#fff" strokeOpacity="0.25" strokeDasharray="2 3" />
                <circle r="7" fill="#ffc53d" opacity="0.3" />
                <circle r="3.6" fill="#fff6d6" />
              </g>
            </svg>
            <p className="max-w-[17rem] text-[13px] leading-snug text-white/65">
              <span className="font-semibold text-white">Tagesprofil (schematisch):</span> {k.profil}
            </p>
          </div>
        </div>
      </div>

      {/* ================= Details ================= */}
      <div key={k.id} className="ov-tab-panel grid gap-8 p-5 md:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 lg:p-10">
        <div>
          <h3 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink-900 md:text-[28px]">{k.label}</h3>
          <p className="mt-3 max-w-[38rem] text-[15.5px] leading-relaxed text-ink-600">{k.kurz}</p>
          <dl className="mt-6 divide-y divide-ink-100 border-y border-ink-100">
            {k.werte.map((w) => (
              <div key={w.label} className="grid grid-cols-[112px_1fr] gap-4 py-3.5 text-[14.5px] leading-snug md:grid-cols-[150px_1fr]">
                <dt className="font-semibold text-ink-500">{w.label}</dt>
                <dd className="text-ink-800">{w.wert}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-col">
          {k.bild?.src && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-100 ring-1 ring-ink-200/70">
              <Image src={k.bild.src} alt={k.bild.alt || ""} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" style={k.bild.position ? { objectPosition: k.bild.position } : undefined} />
              <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/70 px-3 py-1 text-[11.5px] font-semibold text-white backdrop-blur">Beispielanlage</span>
            </div>
          )}
          {k.hinweis && <p className="mt-4 text-[13.5px] leading-relaxed text-ink-500">{k.hinweis}</p>}
          {link && (
            <Link href={link.href} className="group mt-auto inline-flex min-h-[44px] items-center gap-2 pt-5 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              {link.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
