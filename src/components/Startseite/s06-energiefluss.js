"use client";

// src/components/Startseite/s06-energiefluss.js
//
// Client-Insel für „Energie nutzen“ (S07): Energiefluss vom PV-Dach zu den vier Karten.
//   Desktop (lg+): gezeichnete Halle mit PV-Dach, Stamm, Verteilpunkt und vier Äste, die genau
//                  auf den Andockpunkten der Karten landen (Raster grid-cols-4 gap-5 → Breite gemessen).
//   Mobil (<lg):   senkrechte Leitung links an der Kartenliste mit Abzweig in jede Karte
//                  (Positionen aus dem DOM gemessen, rein dekorativ).
// Ablauf beim Hineinscrollen: Dach baut sich auf, Module leuchten, Linien zeichnen sich, Karten
// steigen auf, danach fließen Sonnen-Teilchen ruhig entlang der Leitungen (nur solange sichtbar).
// Hover/Fokus auf einer Karte hebt ihren Ast hervor (reines CSS über :has()).
// Die Karten kommen als children vom Server (SEO).

import { useEffect, useRef, useState } from "react";
import { Sun } from "lucide-react";
import { rd } from "./s06-daten";
import { useEintritt, useGroesse } from "./s06-bewegung";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const ZEICHNEN = "cubic-bezier(0.45, 0, 0.2, 1)";
const H = 188; // Höhe der Desktop-Grafik (px)
const LUECKE = 20; // gap-5 des Kartenrasters
const PERIODE = 96; // Abstand der Teilchen (px)

const STIL = `
.s06e[data-phase="ruhe"] .s06-a { animation: none !important; }
.s06e[data-phase="wartet"] :is(.s06-a, .s06-amb),
.s06e[data-sichtbar="nein"] .s06-amb { animation-play-state: paused !important; }
.s06e-hoch { animation: s06e-hoch 900ms ${EASE} both; }
@keyframes s06e-hoch { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.s06e-blende { animation: s06e-blende 900ms ease both; }
@keyframes s06e-blende { from { opacity: 0; } to { opacity: 1; } }
.s06e-linie { animation: s06e-linie 900ms ${ZEICHNEN} both; }
@keyframes s06e-linie { from { stroke-dasharray: 1 2; stroke-dashoffset: 1; } to { stroke-dasharray: 1 2; stroke-dashoffset: 0; } }
.s06e-modul { animation: s06e-modul 700ms ease both; }
@keyframes s06e-modul { from { opacity: 0.15; } to { opacity: 1; } }
.s06e-pop { transform-box: fill-box; transform-origin: center; animation: s06e-pop 600ms ${EASE} both; }
@keyframes s06e-pop { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: none; } }
.s06e-glanz { opacity: 0; animation: s06e-glanz 1300ms cubic-bezier(0.45, 0, 0.25, 1) both; }
@keyframes s06e-glanz { 0% { opacity: 1; transform: translateX(-60px); } 100% { opacity: 1; transform: translateX(260px); } }
.s06e-fluss { stroke-dasharray: 6 ${PERIODE - 6}; animation: s06e-fluss 1500ms linear infinite; }
@keyframes s06e-fluss { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -${PERIODE}; } }
.s06e-atmen { transform-box: fill-box; transform-origin: center; animation: s06e-atmen 3.2s ease-in-out infinite; }
@keyframes s06e-atmen { 0%, 100% { opacity: 0.55; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.5); } }

/* Karten: Auftritt (Verzögerung je Breakpoint passend zur Linienführung) */
.s06e-karte { animation: s06e-hoch 900ms ${EASE} both; }
${[0, 1, 2, 3].map((i) => `.s06e-karte:nth-child(${i + 1}) { animation-delay: ${250 + i * 140}ms; }`).join("\n")}
@media (min-width: 1024px) {
${[0, 1, 2, 3].map((i) => `  .s06e-karte:nth-child(${i + 1}) { animation-delay: ${1250 + i * 110}ms; }`).join("\n")}
}

/* Hover/Fokus: eigener Ast hell, andere zurück */
.s06e-ast { transition: opacity 300ms ease; }
.s06e-ast .s06e-basis { transition: stroke-opacity 300ms ease, stroke-width 300ms ease; }
${[0, 1, 2, 3]
  .map(
    (i) => `.s06e:has(li[data-ast="${i}"]:is(:hover, :focus-within)) .s06e-ast:not(.s06e-ast-${i}) { opacity: 0.22; }
.s06e:has(li[data-ast="${i}"]:is(:hover, :focus-within)) .s06e-ast-${i} .s06e-basis { stroke-opacity: 0.95; stroke-width: 2.5px; }`
  )
  .join("\n")}
.s06e-port { transition: background-color 300ms ease, box-shadow 300ms ease; }
.s06e li:is(:hover, :focus-within) .s06e-port { background: #669933; box-shadow: 0 0 0 6px rgba(140, 186, 88, 0.22); }

@media (prefers-reduced-motion: reduce) {
  .s06e [class*="s06"] { animation: none !important; }
  .s06e .s06e-teilchen { display: none; }
}
`;

/** Auftritts-Props (Klasse + Verzögerung), wirken nur in Phase wartet/laeuft. */
const an = (klasse, ms = 0, extra) => ({ className: `s06-a ${klasse}`, style: { animationDelay: `${ms}ms`, ...extra } });

/* ------------------------------------------------------------------ */

export default function S06Energiefluss({ anzahl = 4, children }) {
  const wurzel = useRef(null);
  const liste = useRef(null);
  const { phase, sichtbar } = useEintritt(wurzel);
  const [dRef, { w }] = useGroesse({ w: 1216, h: H });
  const mobil = useMobilGeometrie(liste);

  return (
    <div ref={wurzel} data-phase={phase} data-sichtbar={sichtbar ? "ja" : "nein"} className="s06e relative">
      <style>{STIL}</style>

      {/* Desktop: Dach → Verteilpunkt → vier Äste */}
      <div ref={dRef} aria-hidden="true" className="relative hidden lg:block" style={{ height: H }}>
        <DachFluss w={w} anzahl={anzahl} />
      </div>

      <div ref={liste} className="relative">
        {/* Mobil: Quelle oben an der Leitung */}
        <div aria-hidden="true" className="mb-5 flex items-center gap-3 lg:hidden">
          <span data-s06e-quelle="" className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-sun-400 text-navy-950 shadow-[0_0_0_6px_rgba(255,197,61,0.18)]">
            <Sun className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-600">Solarstrom vom eigenen Dach</span>
        </div>
        {mobil && <MobilFluss g={mobil} />}
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop                                                              */
/* ------------------------------------------------------------------ */

function DachFluss({ w, anzahl }) {
  const cx = rd(w / 2);
  const cw = (w - (anzahl - 1) * LUECKE) / anzahl;
  const ports = Array.from({ length: anzahl }, (_, i) => rd(i * (cw + LUECKE) + cw / 2));
  const yDach = 82; // Unterkante Halle
  const yKnoten = 120;
  const bogen = 18;

  // Halle: Front 140 × 30, Dach als geschertes Rechteck (Pultdach in Schrägsicht)
  const ox = rd(cx - 70 - 16); // Frontmitte genau über cx
  const oy = 6;
  const dach = (u, v) => [rd(ox + 4 + u * 140 + v * 32), rd(oy + 46 - v * 36)];
  const zellen = [];
  const SP = 7;
  const ZE = 2;
  for (let z = 0; z < ZE; z++) {
    for (let s = 0; s < SP; s++) {
      const g = 0.012;
      const u0 = s / SP + g;
      const u1 = (s + 1) / SP - g;
      const v0 = 0.1 + (z / ZE) * 0.82 + 0.02;
      const v1 = 0.1 + ((z + 1) / ZE) * 0.82 - 0.02;
      const pts = [dach(u0, v0), dach(u1, v0), dach(u1, v1), dach(u0, v1)];
      zellen.push({ k: `${z}-${s}`, d: `M${pts.map((p) => p.join(" ")).join("L")}Z`, i: z * SP + s });
    }
  }
  const dachUmriss = [dach(0, 0), dach(1, 0), dach(1, 1), dach(0, 1)].map((p) => p.join(" ")).join(" ");
  const front = { x: rd(ox + 4), y: rd(oy + 46), w: 140, h: 30 };
  const seite = [dach(1, 0), dach(1, 1), [dach(1, 1)[0], rd(oy + 46 - 36 + 30)], [front.x + 140, front.y + 30]].map((p) => p.join(" ")).join(" ");
  const sonne = { x: rd(ox - 34), y: rd(oy + 14) };
  // Orthogonale Führung mit runden Ecken: Verteilschiene auf Höhe des Knotens, dann senkrecht in die Karte
  const aeste = ports.map((px, i) => {
    const r = Math.sign(px - cx) * bogen;
    const weg = `H${rd(px - r)}Q${px} ${yKnoten} ${px} ${yKnoten + bogen}V${H}`;
    return { i, px, d: `M${cx} ${yKnoten}${weg}`, voll: `M${cx} ${yDach}V${yKnoten}${weg}` };
  });

  return (
    <svg viewBox={`0 0 ${w} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id="s06e-modul" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#1f5aa1" />
          <stop offset="1" stopColor="#03285a" />
        </linearGradient>
        <linearGradient id="s06e-glanz" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="s06e-schein">
          <stop offset="0" stopColor="#ffc53d" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffc53d" stopOpacity="0" />
        </radialGradient>
        <clipPath id="s06e-dachclip">
          <polygon points={dachUmriss} />
        </clipPath>
      </defs>

      {/* warmer Schein hinter der Halle */}
      <ellipse cx={cx} cy={oy + 40} rx="190" ry="78" fill="url(#s06e-schein)" {...an("s06e-blende", 0)} />

      {/* Sonne */}
      <g {...an("s06e-pop", 0)}>
        <circle cx={sonne.x} cy={sonne.y} r="9" fill="#ffc53d" />
        <circle cx={sonne.x} cy={sonne.y} r="15" fill="#ffc53d" fillOpacity="0.18" />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k * Math.PI) / 4;
          return (
            <line
              key={k}
              x1={rd(sonne.x + Math.cos(a) * 19)}
              y1={rd(sonne.y + Math.sin(a) * 19)}
              x2={rd(sonne.x + Math.cos(a) * 24)}
              y2={rd(sonne.y + Math.sin(a) * 24)}
              stroke="#f5a70f"
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Halle mit PV-Dach */}
      <g {...an("s06e-hoch", 80)}>
        <polygon points={seite} fill="#dfe3ea" stroke="#c4cad5" strokeWidth="1.25" strokeLinejoin="round" />
        <rect x={front.x} y={front.y} width={front.w} height={front.h} fill="#fff" stroke="#c4cad5" strokeWidth="1.25" />
        {[0, 1, 2, 3].map((k) => (
          <rect key={k} x={front.x + 14 + k * 30} y={front.y + 10} width="20" height="9" rx="1.5" fill="#eef0f4" stroke="#c4cad5" strokeWidth="1" />
        ))}
        <polygon points={dachUmriss} fill="#97a0b0" stroke="#6b7486" strokeWidth="1.25" strokeLinejoin="round" />
      </g>
      {zellen.map((m) => (
        <path key={m.k} d={m.d} fill="url(#s06e-modul)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.75" {...an("s06e-modul", 300 + m.i * 35)} />
      ))}
      <g clipPath="url(#s06e-dachclip)">
        <g transform={`translate(${ox} ${oy}) skewX(-24)`}>
          <rect x="-30" y="-4" width="40" height="60" fill="url(#s06e-glanz)" {...an("s06e-glanz", 850)} />
        </g>
      </g>

      {/* Beschriftung */}
      <g {...an("s06e-hoch", 400)}>
        <text x={rd(ox + 196)} y={oy + 36} fontSize="13.5" fontWeight="700" fill="#151a24" style={{ fontFamily: "var(--font-display)" }}>
          Solarstrom vom eigenen Dach
        </text>
        <text x={rd(ox + 196)} y={oy + 54} fontSize="12.5" fill="#6b7486">
          zuerst Eigenverbrauch im Betrieb
        </text>
      </g>
      <g {...an("s06e-hoch", 1000)}>
        <text x={cx + 18} y={yKnoten - 10} fontSize="12.5" fill="#6b7486">
          Was übrig bleibt
        </text>
      </g>

      {/* Stamm */}
      <path d={`M${cx} ${yDach}V${yKnoten}`} pathLength="1" fill="none" stroke="#669933" strokeOpacity="0.5" strokeWidth="1.75" strokeLinecap="round" {...an("s06e-linie", 650, { animationDuration: "400ms" })} />

      {/* Äste */}
      {aeste.map((a) => (
        <g key={a.i} className={`s06e-ast s06e-ast-${a.i}`}>
          <path
            d={a.d}
            pathLength="1"
            fill="none"
            stroke="#669933"
            strokeOpacity="0.45"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="s06e-basis s06-a s06e-linie"
            style={{ animationDelay: `${1000 + Math.abs(a.i - (anzahl - 1) / 2) * 90}ms` }}
          />
        </g>
      ))}

      {/* Teilchen (nach dem Zeichnen, ruhiger Dauerfluss) */}
      <g {...an("s06e-teilchen s06e-blende", 2000)}>
                {aeste.map((a) => (
          <g key={a.i} className={`s06e-ast s06e-ast-${a.i}`}>
            <Teilchen d={a.voll} />
          </g>
        ))}
      </g>

      {/* Verteilpunkt */}
      <circle cx={cx} cy={yKnoten} r="12" fill="#8cba58" className="s06-amb s06e-atmen" />
      <circle cx={cx} cy={yKnoten} r="5.5" fill="#669933" stroke="#fff" strokeWidth="2" {...an("s06e-pop", 950)} />
    </svg>
  );
}

function Teilchen({ d }) {
  // Alle Äste starten am Dach mit gleichem Muster → auf gemeinsamen Strecken liegen die Teilchen deckungsgleich
  return (
    <>
      <path d={d} fill="none" stroke="#fde7ad" strokeWidth="10" strokeLinecap="round" className="s06-amb s06e-fluss" />
      <path d={d} fill="none" stroke="#f5a70f" strokeWidth="4.5" strokeLinecap="round" className="s06-amb s06e-fluss" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Mobil                                                                */
/* ------------------------------------------------------------------ */

/** Positionen von Quelle und Karten relativ zur Liste (offset*-Werte, unabhängig von Transforms). */
function useMobilGeometrie(ref) {
  const [g, setG] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const messen = () => {
      const quelle = el.querySelector("[data-s06e-quelle]");
      const ul = el.querySelector("ul");
      const lis = ul ? [...ul.querySelectorAll(":scope > li")] : [];
      if (!quelle || !quelle.offsetHeight || !lis.length) {
        setG(null);
        return;
      }
      const relativ = (n) => {
        let x = 0;
        let y = 0;
        let k = n;
        while (k && k !== el) {
          x += k.offsetLeft;
          y += k.offsetTop;
          k = k.offsetParent;
        }
        return { x, y };
      };
      const q = relativ(quelle);
      const punkte = lis.map((li) => {
        const p = relativ(li);
        return { x: rd(p.x), y: rd(p.y + li.offsetHeight / 2) };
      });
      const neu = { w: el.offsetWidth, h: el.offsetHeight, x0: rd(q.x + quelle.offsetWidth / 2), y0: rd(q.y + quelle.offsetHeight / 2), punkte };
      setG((alt) => (alt && JSON.stringify(alt) === JSON.stringify(neu) ? alt : neu));
    };
    messen();
    const ro = new ResizeObserver(messen);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return g;
}

function MobilFluss({ g }) {
  const { w, h, x0, y0, punkte } = g;
  const yEnde = punkte.at(-1).y;
  const stamm = `M${x0} ${y0 + 15}V${yEnde - 10}Q${x0} ${yEnde} ${x0 + 10} ${yEnde}H${punkte.at(-1).x}`;
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible lg:hidden">
      <path d={stamm} pathLength="1" fill="none" stroke="#669933" strokeOpacity="0.45" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...an("s06e-linie", 150, { animationDuration: "1300ms" })} />
      {punkte.slice(0, -1).map((p, i) => (
        <g key={i} className={`s06e-ast s06e-ast-${i}`}>
          <path d={`M${x0} ${p.y}H${p.x}`} pathLength="1" fill="none" stroke="#669933" strokeOpacity="0.45" strokeWidth="1.75" strokeLinecap="round" className="s06e-basis s06-a s06e-linie" style={{ animationDelay: `${450 + i * 260}ms` }} />
          <circle cx={x0} cy={p.y} r="4" fill="#669933" stroke="#fbfaf6" strokeWidth="2" {...an("s06e-pop", 400 + i * 260)} />
        </g>
      ))}
      <g {...an("s06e-teilchen s06e-blende", 1500)}>
        <Teilchen d={stamm} />
      </g>
    </svg>
  );
}
