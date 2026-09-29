"use client";

import { useId, useState } from "react";
import { ChevronsLeftRight, Info, ScanSearch, Wrench } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Vorher/Nachher-Schieber: Luftbild ↔ Thermografie einer PV-Freifläche als
 * gestaltete Illustration (kein Messbild). Die acht typischen Fehlerbilder aus
 * der Tabelle „Fehlerbild → Ursache → Maßnahme“ sind im Wärmebild eingezeichnet
 * und lassen sich über die Galerie einzeln hervorheben.
 *
 * props: fehler [[Fehlerbild, Ursache, Maßnahme], …] – genau 8 Einträge
 */

const W = 960;
const H = 540;
const COLS = 12;
const ROWS = 6;
const MW = 64;
const MH = 44;
const GAP = 5;
const X0 = (W - (COLS * MW + (COLS - 1) * GAP)) / 2;
const Y0 = 62;
const PITCH = 78;

const mx = (c) => X0 + c * (MW + GAP);
const my = (r) => Y0 + r * PITCH;

// Position der Fehlerbilder in der Illustration (Reihe, Spalte)
const ORTE = [
  { r: 0, c: 3 }, // Hotspot
  { r: 1, c: 8 }, // Substring
  { r: 2, c: 1 }, // ganzes Modul
  { r: 3, c: 5, n: 6 }, // String
  { r: 4, c: 0, n: 6 }, // PID
  { r: 0, c: 10 }, // Steckverbinder
  { r: 2, c: 7 }, // unterste Zellreihe
  { r: 5, c: 3 }, // Streifen
];

// Ironbow-ähnliche Palette
const T = { kalt: "#1e1b4b", normal: "#4c1d95", normal2: "#5b21b6", warm: "#be185d", heiss: "#f97316", sehrheiss: "#fde68a" };

function Luftbild() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="tv-gras" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#566f3a" />
          <stop offset="0.5" stopColor="#4a6332" />
          <stop offset="1" stopColor="#5b7440" />
        </linearGradient>
        <filter id="tv-rauschen" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" />
          <feColorMatrix values="0 0 0 0 0.18  0 0 0 0 0.24  0 0 0 0 0.12  0 0 0 0.9 -0.2" />
        </filter>
        <radialGradient id="tv-vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <linearGradient id="tv-modul" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a3d63" />
          <stop offset="0.5" stopColor="#15223b" />
          <stop offset="1" stopColor="#314873" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#tv-gras)" />
      <rect width={W} height={H} filter="url(#tv-rauschen)" opacity="0.55" />
      <path d={`M0 ${H - 26} C 240 ${H - 48}, 560 ${H - 6}, ${W} ${H - 34} L${W} ${H} L0 ${H} Z`} fill="#8b8660" opacity="0.45" />
      {Array.from({ length: ROWS }, (_, r) => (
        <g key={r}>
          <rect x={X0 - 4} y={my(r) + MH + 2} width={COLS * (MW + GAP) + 3} height="14" fill="#233018" opacity="0.45" rx="2" />
          {Array.from({ length: COLS }, (_, c) => (
            <g key={c}>
              <rect x={mx(c)} y={my(r)} width={MW} height={MH} fill="url(#tv-modul)" stroke="#c7ced8" strokeWidth="1.5" rx="1.5" />
              <g stroke="#3b5480" strokeWidth="0.6" opacity="0.8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <line key={i} x1={mx(c) + (i * MW) / 6} x2={mx(c) + (i * MW) / 6} y1={my(r)} y2={my(r) + MH} />
                ))}
                <line x1={mx(c)} x2={mx(c) + MW} y1={my(r) + MH / 2} y2={my(r) + MH / 2} />
              </g>
              <path d={`M${mx(c) + 2} ${my(r) + 2} L${mx(c) + 26} ${my(r) + 2} L${mx(c) + 10} ${my(r) + MH - 2} L${mx(c) + 2} ${my(r) + MH - 2} Z`} fill="#fff" opacity="0.07" />
            </g>
          ))}
        </g>
      ))}
      {/* Vogelkot, Schmutzrand – im Luftbild kaum sichtbar */}
      <circle cx={mx(3) + 22} cy={my(0) + 14} r="3" fill="#eae6da" opacity="0.8" />
      <rect x={mx(7)} y={my(2) + MH - 6} width={MW} height="6" fill="#7b6a4a" opacity="0.55" />
      <rect width={W} height={H} fill="url(#tv-vignette)" />
    </svg>
  );
}

function Thermo({ aktiv }) {
  const farbeModul = (r, c) => {
    // Grundrauschen
    const v = ((r * 7 + c * 13) % 5) / 5;
    return v > 0.6 ? T.normal2 : T.normal;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="tv-hot">
          <stop offset="0" stopColor="#fffbeb" />
          <stop offset="0.35" stopColor={T.sehrheiss} />
          <stop offset="0.7" stopColor={T.heiss} />
          <stop offset="1" stopColor={T.warm} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tv-skala" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={T.kalt} />
          <stop offset="0.35" stopColor={T.normal} />
          <stop offset="0.6" stopColor={T.warm} />
          <stop offset="0.85" stopColor={T.heiss} />
          <stop offset="1" stopColor={T.sehrheiss} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#0f0a24" />
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => <rect key={`${r}-${c}`} x={mx(c)} y={my(r)} width={MW} height={MH} fill={farbeModul(r, c)} stroke="#2a1760" strokeWidth="1.5" rx="1.5" />)
      )}

      {/* 1 Hotspot */}
      <circle cx={mx(3) + 22} cy={my(0) + 14} r="11" fill="url(#tv-hot)" />
      {/* 2 Substring (ein Drittel) */}
      <rect x={mx(8)} y={my(1)} width={MW / 3} height={MH} fill={T.warm} />
      <rect x={mx(8) + 3} y={my(1) + 4} width={MW / 3 - 6} height={MH - 8} fill={T.heiss} opacity="0.55" />
      {/* 3 Ganzes Modul */}
      <rect x={mx(1)} y={my(2)} width={MW} height={MH} fill={T.warm} />
      <rect x={mx(1) + 6} y={my(2) + 6} width={MW - 12} height={MH - 12} fill={T.heiss} opacity="0.35" />
      {/* 4 Ganzer String */}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`s${i}`} x={mx(5 + i)} y={my(3)} width={MW} height={MH} fill={T.warm} opacity="0.85" />
      ))}
      {/* 5 PID – Schachbrett, stärker am Minuspol (links) */}
      {Array.from({ length: 6 }, (_, i) =>
        Array.from({ length: 6 }, (_, zc) =>
          Array.from({ length: 2 }, (_, zr) =>
            (zc + zr + i) % 2 === 0 ? (
              <rect key={`p${i}-${zc}-${zr}`} x={mx(i) + (zc * MW) / 6} y={my(4) + (zr * MH) / 2} width={MW / 6} height={MH / 2} fill={i < 2 ? T.heiss : i < 4 ? T.warm : "#7e22ce"} opacity={1 - i * 0.12} />
            ) : null
          )
        )
      )}
      {/* 6 Heiße Anschlussdose / Steckverbinder */}
      <rect x={mx(10) + MW / 2 - 7} y={my(0) - 3} width="14" height="8" rx="2" fill={T.sehrheiss} />
      <circle cx={mx(10) + MW / 2} cy={my(0) + 1} r="10" fill="url(#tv-hot)" />
      {/* 7 Unterste Zellreihe */}
      <rect x={mx(7)} y={my(2) + MH - 9} width={MW} height="9" fill={T.heiss} opacity="0.9" />
      {/* 8 Streifen / Punkte */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`st${i}`} x={mx(3) + 6 + i * 15} y={my(5) + 4} width="4" height={MH - 8} fill={T.warm} />
      ))}
      <circle cx={mx(3) + 50} cy={my(5) + 30} r="3" fill={T.heiss} />

      {/* Markierungen */}
      {ORTE.map((o, i) => {
        const n = o.n || 1;
        const an = aktiv === i;
        const x = mx(o.c) - 6;
        const y = my(o.r) - 6;
        const w = n * MW + (n - 1) * GAP + 12;
        return (
          <g key={i} style={{ opacity: aktiv == null || an ? 1 : 0.35, transition: "opacity 300ms" }}>
            <rect x={x} y={y} width={w} height={MH + 12} rx="6" fill="none" stroke={an ? "#ffffff" : "rgba(255,255,255,0.55)"} strokeWidth={an ? 2.5 : 1.2} strokeDasharray={an ? "0" : "5 4"} />
            <circle cx={x + w} cy={y} r="11" fill={an ? "#669933" : "#0f0a24"} stroke="#fff" strokeWidth="1.5" />
            <text x={x + w} y={y + 4.5} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#fff">
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Temperaturskala */}
      <g transform={`translate(${W - 230} 30)`}>
        <rect width="200" height="8" rx="4" fill="url(#tv-skala)" />
        <text x="0" y="-6" fontSize="11" fill="rgba(255,255,255,0.7)">
          kühl
        </text>
        <text x="200" y="-6" textAnchor="end" fontSize="11" fill="rgba(255,255,255,0.7)">
          heiß
        </text>
      </g>
    </svg>
  );
}

export default function ThermoVergleich({ fehler = [] }) {
  const id = useId();
  const [pos, setPos] = useState(55);
  const [aktiv, setAktiv] = useState(null);
  const f = aktiv != null ? fehler[aktiv] : null;

  const waehle = (i) => {
    setAktiv(i === aktiv ? null : i);
    setPos((p) => Math.min(p, 18));
  };

  return (
    <div className="overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-2xl ring-1 ring-white/10">
      <div className="grid xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* Bildvergleich */}
        <div className="p-3 md:p-5">
          <div className="relative aspect-[4/3] select-none sm:aspect-[16/9] overflow-hidden rounded-3xl bg-navy-900 focus-within:ring-4 focus-within:ring-ov-500/40">
            <Thermo aktiv={aktiv} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Luftbild />
            </div>
            <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-ink-800 shadow md:bottom-4 md:left-4">Luftbild</span>
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-[12px] font-semibold text-white shadow backdrop-blur md:bottom-4 md:right-4">Thermografie</span>
            <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }} aria-hidden="true">
              <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
              <div className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-800 shadow-xl ring-1 ring-ink-200">
                <ChevronsLeftRight className="h-5 w-5" />
              </div>
            </div>
            <label htmlFor={`${id}-pos`} className="sr-only">
              Zwischen Luftbild und Wärmebild wechseln
            </label>
            <input id={`${id}-pos`} type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0" />
          </div>
          <p className="mt-3 flex items-center justify-center gap-2 text-[12.5px] text-white/50">
            <ChevronsLeftRight aria-hidden="true" className="h-4 w-4" />
            Regler ziehen: Luftbild ↔ Wärmebild · gestaltete Illustration, kein Messbild
          </p>
        </div>

        {/* Galerie + Detail */}
        <div className="flex flex-col gap-4 border-t border-white/10 p-5 md:p-7 xl:border-l xl:border-t-0">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Fehlerbild wählen</p>
          <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Fehlerbilder">
            {fehler.map((z, i) => (
              <button
                key={z[0]}
                type="button"
                aria-pressed={aktiv === i}
                onClick={() => waehle(i)}
                className={cn(
                  "flex min-h-11 items-start gap-2 rounded-xl px-2.5 py-2 text-left text-[12.5px] font-semibold leading-snug ring-1 transition-colors",
                  aktiv === i ? "bg-white text-navy-950 ring-white" : "text-white/75 ring-white/12 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]", aktiv === i ? "bg-ov-500 text-white" : "bg-white/10 text-white/80")}>{i + 1}</span>
                <span className="line-clamp-2">{z[0]}</span>
              </button>
            ))}
          </div>
          <div aria-live="polite" className="mt-1 flex-1 rounded-2xl bg-white/[0.05] p-4 ring-1 ring-white/10">
            {f ? (
              <div key={aktiv} className="ov-tab-panel">
                <p className="font-display text-[16.5px] font-bold leading-snug">{f[0]}</p>
                <p className="mt-3 flex gap-2 text-[13.5px] leading-relaxed text-white/75">
                  <ScanSearch aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" />
                  <span>
                    <strong className="text-white">Wahrscheinliche Ursache: </strong>
                    {f[1]}
                  </span>
                </p>
                <p className="mt-2 flex gap-2 text-[13.5px] leading-relaxed text-white/75">
                  <Wrench aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
                  <span>
                    <strong className="text-white">Maßnahme: </strong>
                    {f[2]}
                  </span>
                </p>
              </div>
            ) : (
              <p className="flex gap-2 text-[13.5px] leading-relaxed text-white/60">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                Wählen Sie ein Fehlerbild: Es wird im Wärmebild hervorgehoben, darunter stehen wahrscheinliche Ursache und Maßnahme.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
