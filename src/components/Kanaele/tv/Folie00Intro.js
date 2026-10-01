"use client";

import { useEffect, useState } from "react";
import { DISPLAY, GRUEN, GRUEN_HELL, SONNE, rd } from "./gemeinsam";

/* ================================================================== */
/* 0 · Intro: Markenmoment zum Start der Schleife (Vollbild)           */
/* ================================================================== */
//
// Sonnenaufgang über einem Modulfeld in Zentralperspektive. Der Fluchtpunkt liegt genau
// in der Sonne: Konstruktionslinien zeichnen sich, die Module legen sich Reihe für Reihe
// von hinten nach vorn ins Raster, Licht streift über das Glas, die Reihen zünden grün,
// Energie fließt entlang der Gassen zum Betrachter. Danach ruhiger, lebendiger Zustand.
// Illustration (Symbolbild), keine Anlagendaten.

/* ---------- Geometrie (deterministisch, gerundet) ---------- */

const B = 2000; // viewBox-Breite
const H = 1017; // viewBox-Höhe (Bühne 100 × 50,85 em)
const VX = 1520; // Fluchtpunkt = Sonne am Horizont
const VY = 560;
const KAM = 7; // Kamerahöhe
const F = 610; // Brennweite

const pt = (X, Y, Z) => [rd(VX + (X * F) / Z), rd(VY + ((KAM - Y) * F) / Z)];

const Y_VORN = 0.5; // Unterkante Tisch
const HUB = 1.44; // Höhe über die Tischtiefe (≈ 25° Neigung)
const TIEFE = 3.08;
const Z0 = 10;
const ABSTAND = 8;
const REIHEN = 13;
// Modulblöcke (X-Start, Anzahl Module), dazwischen Wartungsgassen
const BLOECKE = [
  [-45, 13],
  [-31, 13],
  [-17, 13],
  [-3, 13],
];
const LUECKE = 0.06;

/* Bergkette am Horizont (zwei Staffeln), zur Sonne hin abfallend */
const glatt = (t) => t * t * (3 - 2 * t);
function kamm(basis, amp, phase, tal) {
  let d = `M0 ${VY + 2}`;
  for (let x = 0; x <= B; x += 20) {
    const h = basis + amp[0] * Math.sin(x / 170 + phase) + amp[1] * Math.sin(x / 61 + phase * 2.3) + amp[2] * Math.sin(x / 23 + phase * 0.7);
    const v = (tal + (1 - tal) * glatt(Math.min(1, Math.abs(x - VX) / 520))) * (0.12 + 0.88 * glatt(Math.min(1, x / VX)));
    d += `L${x} ${rd(VY - Math.max(0, h) * v)}`;
  }
  return `${d}L${B} ${VY + 2}Z`;
}
const BERGE_FERN = kamm(32, [14, 8, 4], 0.6, 0.3);
const BERGE_NAH = kamm(16, [8, 6, 3], 2.4, 0.2);

const REIHEN_DATEN = [];
let flaeche = "";
for (let r = REIHEN - 1; r >= 0; r--) {
  const zf = Z0 + r * ABSTAND;
  const zb = zf + TIEFE;
  const yb = Y_VORN + HUB;
  const rang = REIHEN - 1 - r; // 0 = hinterste Reihe
  const teile = [];
  let zellen = "";
  const unterteilung = r <= 1 ? 10 : r <= 3 ? 4 : 2; // Zellteilung entlang der Neigung
  const spalten = r <= 1 ? 3 : r <= 3 ? 2 : 0;
  for (const [x0, n] of BLOECKE) {
    for (let i = 0; i < n; i++) {
      const a = x0 + i + LUECKE / 2;
      const b = x0 + i + 1 - LUECKE / 2;
      const [x1, y1] = pt(a, Y_VORN, zf);
      const [x2] = pt(b, Y_VORN, zf);
      const [x3, y3] = pt(b, yb, zb);
      const [x4] = pt(a, yb, zb);
      const d = `M${x1} ${y1}L${x2} ${y1}L${x3} ${y3}L${x4} ${y3}Z`;
      flaeche += d;
      // Aufbau-Welle: von der Sonne (Fluchtpunkt) ausgehend, hinten zuerst
      const seitlich = Math.abs(a + 0.5);
      teile.push({ d, key: `${r}-${a}`, delay: Math.round(300 + rang * 80 + seitlich * 12) });
      for (let s = 1; s < spalten; s++) {
        const [cx1, cy1] = pt(a + s / spalten, Y_VORN, zf);
        const [cx2, cy2] = pt(a + s / spalten, yb, zb);
        zellen += `M${cx1} ${cy1}L${cx2} ${cy2}`;
      }
    }
  }
  const [xl, yv] = pt(BLOECKE[0][0], Y_VORN, zf);
  const [xr] = pt(BLOECKE[BLOECKE.length - 1][0] + BLOECKE[BLOECKE.length - 1][1], Y_VORN, zf);
  const [xlb, yh] = pt(BLOECKE[0][0], yb, zb);
  const [xrb] = pt(BLOECKE[BLOECKE.length - 1][0] + BLOECKE[BLOECKE.length - 1][1], yb, zb);
  for (let k = 1; k < unterteilung; k++) {
    const t = k / unterteilung;
    const [ql, qy] = pt(BLOECKE[0][0], Y_VORN + HUB * t, zf + TIEFE * t);
    const [qr] = pt(BLOECKE[BLOECKE.length - 1][0] + BLOECKE[BLOECKE.length - 1][1], Y_VORN + HUB * t, zf + TIEFE * t);
    zellen += `M${ql} ${qy}H${qr}`;
  }
  const massstab = F / zf / 68; // 1 = vorderste Reihe
  const rahmen = rd(Math.max(1.2, 0.14 * (F / zf)));
  REIHEN_DATEN.push({ r, rang, module: teile, zellen, xl, xr, yv, xlb, xrb, yh, massstab, rahmen });
}

// Konstruktionslinien: Strahlen aus dem Fluchtpunkt (Himmel) und Rasterkanten (Boden)
const STRAHLEN = Array.from({ length: 23 }, (_, i) => {
  const w = Math.PI + (i + 1) * (Math.PI / 24); // obere Halbebene
  const l = 2600;
  return { key: i, x2: rd(VX + Math.cos(w) * l), y2: rd(VY + Math.sin(w) * l), delay: 80 + Math.abs(i - 11) * 45 };
});
// Bodenraster (Konstruktion): Fluchtlinien und Tiefenlinien
const RASTER_X = [-96, -80, -64, -48, -32, -16, 0, 16, 32];
const KANTEN = RASTER_X.map((X, i) => {
  const [xe, ye] = pt(X, 0, 4);
  return { key: i, xe, ye, delay: 120 + Math.abs(X) * 4 };
});
const TIEFEN = [7, 8.5, 10.5, 13.5, 18, 25, 36, 55].map((Z, i) => ({ key: i, y: pt(0, 0, Z)[1], delay: 260 + (7 - i) * 60 }));

/** Titel ausgewogen auf zwei Zeilen verteilen. */
function zweiZeilen(text) {
  const w = String(text || "").split(" ");
  let best = [text, ""];
  let min = Infinity;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(" ");
    const b = w.slice(i).join(" ");
    const m = Math.max(a.length, b.length);
    if (m < min) {
      min = m;
      best = [a, b];
    }
  }
  return best.filter(Boolean);
}

/* ---------- Komponente ---------- */

export default function IntroGrafik({ f, aktiv }) {
  // Animationen starten bei jedem Aktivwerden neu; beim Ausblenden läuft der Endzustand
  // noch während der Überblendung weiter, damit nichts sichtbar zurückspringt.
  const [runde, setRunde] = useState(0);
  const [warAktiv, setWarAktiv] = useState(aktiv);
  const [nachlauf, setNachlauf] = useState(false);
  if (aktiv !== warAktiv) {
    setWarAktiv(aktiv);
    if (aktiv) setRunde((n) => n + 1);
    setNachlauf(!aktiv);
  }
  useEffect(() => {
    if (!nachlauf) return;
    const t = setTimeout(() => setNachlauf(false), 1300);
    return () => clearTimeout(t);
  }, [nachlauf]);
  const lauf = aktiv || nachlauf;
  const zeilen = zweiZeilen(f.titel);
  // „Ökovolt Österreich“: der Markenname steht schon im Logo, daneben nur das Land
  const ort = String(f.kategorie || "").replace(/^ökovolt\s*/i, "");

  return (
    <div key={runde} className={`tv00 absolute inset-0 overflow-hidden ${lauf ? "tv00-an" : ""}`}>
      <div className="tv00-kamera absolute inset-0" style={{ transformOrigin: `${(VX / B) * 100}% ${(VY / H) * 100}%` }}>
        <Szene />
      </div>

      {/* Lesbarkeit links: ruhiger Verlauf hinter dem Text */}
      <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[60%] w-[70%]" style={{ background: "radial-gradient(ellipse 70% 75% at 22% 38%, rgba(2,11,31,0.55), rgba(2,11,31,0) 70%)" }} />

      <div className="absolute left-[5em] top-[3.7em] max-w-[72em]">
        {/* Absender: Logo, feine Trennlinie, Land */}
        <div className="flex items-center gap-[1.3em]">
          <span className="tv00-maske-x block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-oekovolt-weiss.png" alt="Ökovolt Solartechnik" width="538" height="113" className="tv00-logo block h-[3.1em] w-auto" />
          </span>
          {ort && (
            <>
              <span className="tv00-trenner h-[2.4em] w-[2px] rounded-full bg-white/25" style={{ animationDelay: "900ms" }} />
              <span className="tv00-auf text-[1.6em] font-semibold tracking-[0.005em] text-white/80" style={{ animationDelay: "1000ms" }}>
                {ort}
              </span>
            </>
          )}
        </div>
        <h1 className="mt-[0.5em] font-display text-[5.5em] font-extrabold leading-[1.02] tracking-[-0.038em]" style={DISPLAY}>
          {zeilen.map((z, i) => (
            <span key={z} className="tv00-maske">
              <span className="tv00-zeile" style={{ animationDelay: `${650 + i * 190}ms` }}>
                {z}
              </span>
            </span>
          ))}
        </h1>
        <p className="tv00-auf mt-[0.85em] text-[1.75em] leading-[1.4] text-white/75" style={{ animationDelay: "1450ms" }}>
          {f.text}
        </p>
      </div>

      <style>{STIL}</style>
    </div>
  );
}

function Szene() {
  return (
    <svg viewBox={`0 0 ${B} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="tv00-himmel" x1="0" y1="0" x2="0" y2={VY} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#020a1c" />
          <stop offset="0.55" stopColor="#03122b" />
          <stop offset="0.88" stopColor="#0a2753" />
          <stop offset="1" stopColor="#173f78" />
        </linearGradient>
        <radialGradient id="tv00-glut" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4cc" stopOpacity="0.95" />
          <stop offset="0.07" stopColor={SONNE} stopOpacity="0.7" />
          <stop offset="0.22" stopColor="#e9a13a" stopOpacity="0.26" />
          <stop offset="0.5" stopColor="#7fa7d6" stopOpacity="0.08" />
          <stop offset="1" stopColor="#7fa7d6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv00-scheibe" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffdf2" />
          <stop offset="0.55" stopColor="#ffe9a8" />
          <stop offset="1" stopColor={SONNE} />
        </radialGradient>
        <radialGradient id="tv00-hof" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.55" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tv00-boden" x1="0" y1={VY} x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0a2149" />
          <stop offset="0.2" stopColor="#061938" />
          <stop offset="1" stopColor="#020b1f" />
        </linearGradient>
        <linearGradient id="tv00-horizont" x1="0" y1="0" x2={B} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SONNE} stopOpacity="0" />
          <stop offset={VX / B - 0.2} stopColor={SONNE} stopOpacity="0.35" />
          <stop offset={VX / B} stopColor="#fff6d6" stopOpacity="1" />
          <stop offset={VX / B + 0.15} stopColor={SONNE} stopOpacity="0.35" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tv00-glas" cx={VX} cy={VY} r="1500" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6d8fc4" />
          <stop offset="0.14" stopColor="#2f5c9f" />
          <stop offset="0.42" stopColor="#15428a" />
          <stop offset="1" stopColor="#0a2658" />
        </radialGradient>
        <radialGradient id="tv00-glanz" cx={VX} cy={VY} r="1100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.7" />
          <stop offset="0.3" stopColor={SONNE} stopOpacity="0.2" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tv00-kante" x1="0" y1="0" x2={B} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffe3a0" stopOpacity="0.12" />
          <stop offset={VX / B} stopColor="#fff1c8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffe3a0" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="tv00-grat" x1="0" y1="0" x2={B} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset={VX / B - 0.32} stopColor="#ffe3a0" stopOpacity="0" />
          <stop offset={VX / B} stopColor="#fff1c8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffe3a0" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="tv00-dunst" x1="0" y1={VY} x2="0" y2={VY + 110} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#173a6c" stopOpacity="0.6" />
          <stop offset="1" stopColor="#173a6c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tv00-streif" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.42" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tv00-raster" cx={VX} cy={VY} r="1300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9fc0ea" stopOpacity="0.05" />
          <stop offset="0.5" stopColor="#9fc0ea" stopOpacity="0.2" />
          <stop offset="1" stopColor="#9fc0ea" stopOpacity="0.12" />
        </radialGradient>
        <radialGradient id="tv00-strahl" cx={VX} cy={VY} r="1500" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv00-punkt" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={GRUEN_HELL} stopOpacity="0.9" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv00-vignette" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.6" stopColor="#020b1f" stopOpacity="0" />
          <stop offset="1" stopColor="#020b1f" stopOpacity="0.7" />
        </radialGradient>
        <path id="tv00-flaeche" d={flaeche} />
        <clipPath id="tv00-clip">
          <use href="#tv00-flaeche" />
        </clipPath>
      </defs>

      {/* Himmel */}
      <rect width={B} height={H} fill="url(#tv00-himmel)" />
      <g className="tv00-strahlen">
        {STRAHLEN.map((s) => (
          <line key={s.key} x1={VX} y1={VY} x2={s.x2} y2={s.y2} pathLength="1" stroke="url(#tv00-strahl)" strokeWidth="1.2" className="tv00-strich" style={{ animationDelay: `${s.delay}ms` }} />
        ))}
      </g>
      <g className="tv00-glut" style={{ transformOrigin: `${VX}px ${VY}px` }}>
        <g className="tv00-atem">
          <ellipse cx={VX} cy={VY} rx="1250" ry="620" fill="url(#tv00-glut)" />
        </g>
      </g>
      <g className="tv00-sonne">
        <circle cx={VX} cy={VY - 40} r="160" fill="url(#tv00-hof)" />
        <circle cx={VX} cy={VY - 40} r="54" fill="url(#tv00-scheibe)" />
      </g>

      {/* Bergkette am Horizont */}
      <path d={BERGE_FERN} fill="#123363" />
      <path d={BERGE_FERN} fill="none" stroke="url(#tv00-grat)" strokeWidth="1.6" className="tv00-auf-svg" style={{ animationDelay: "1200ms" }} />
      <path d={BERGE_NAH} fill="#0a2248" />

      {/* Boden */}
      <rect y={VY} width={B} height={H - VY} fill="url(#tv00-boden)" />
      <g className="tv00-glut" style={{ transformOrigin: `${VX}px ${VY}px` }}>
        <ellipse cx={VX} cy={VY + 4} rx="1000" ry="120" fill="url(#tv00-glut)" opacity="0.55" />
      </g>
      <g className="tv00-kanten">
        {KANTEN.map((k) => (
          <line key={k.key} x1={VX} y1={VY} x2={k.xe} y2={k.ye} pathLength="1" stroke="url(#tv00-raster)" strokeWidth="1.1" className="tv00-strich" style={{ animationDelay: `${k.delay}ms` }} />
        ))}
        {TIEFEN.map((t) => (
          <line key={`t${t.key}`} x1={B} y1={t.y} x2="0" y2={t.y} pathLength="1" stroke="#9fc0ea" strokeOpacity="0.14" strokeWidth="1" className="tv00-strich" style={{ animationDelay: `${t.delay}ms` }} />
        ))}
      </g>

      {/* Modulreihen, hinten zuerst */}
      {REIHEN_DATEN.map((R) => (
        <g key={R.r}>
          {/* Rahmen / Stirnseite */}
          <rect x={R.xl} y={R.yv} width={rd(R.xr - R.xl)} height={R.rahmen} fill="#041330" className="tv00-auf-svg" style={{ animationDelay: `${300 + R.rang * 80}ms` }} />
          {R.module.map((m) => (
            <path key={m.key} d={m.d} fill="url(#tv00-glas)" stroke="#a9c6ee" strokeOpacity={R.r <= 2 ? 0.34 : 0.22} strokeWidth={R.r <= 2 ? 1 : 0.7} className="tv00-modul" style={{ animationDelay: `${m.delay}ms`, "--tv00-dy": `${rd(-26 * R.massstab)}px` }} />
          ))}
          <path d={R.zellen} stroke="#cfe0ff" strokeOpacity={R.r <= 1 ? 0.1 : 0.14} strokeWidth="0.8" fill="none" className="tv00-auf-svg" style={{ animationDelay: `${800 + R.rang * 80}ms` }} />
          {/* Gegenlicht auf der Oberkante */}
          <path d={`M${R.xlb} ${R.yh}H${R.xrb}`} stroke="url(#tv00-kante)" strokeWidth={rd(Math.max(1, 1.8 * R.massstab))} className="tv00-auf-svg" style={{ animationDelay: `${1000 + R.rang * 80}ms` }} />
        </g>
      ))}

      {/* Sonnenglanz auf dem Glas */}
      <use href="#tv00-flaeche" fill="url(#tv00-glanz)" className="tv00-glanz" />

      {/* Lichtstreif über das Feld */}
      <g clipPath="url(#tv00-clip)">
        <g className="tv00-streif">
          <rect x="-160" y={VY - 40} width="320" height={H - VY + 80} fill="url(#tv00-streif)" transform={`skewX(-24)`} />
        </g>
      </g>

      {/* Stromschienen der Reihen: zünden von hinten nach vorn */}
      {REIHEN_DATEN.map((R) => {
        const d = `M${R.xr} ${R.yv}H${R.xl}`;
        const breite = rd(Math.max(1, 3 * R.massstab));
        return (
          <g key={`s${R.r}`}>
            <path d={d} pathLength="1" stroke={GRUEN} strokeOpacity="0.45" strokeWidth={rd(breite * 4)} className="tv00-strich" style={{ animationDelay: `${1300 + R.rang * 70}ms`, animationDuration: "1100ms" }} />
            <path d={d} pathLength="1" stroke={GRUEN_HELL} strokeWidth={breite} className="tv00-strich" style={{ animationDelay: `${1300 + R.rang * 70}ms`, animationDuration: "1100ms" }} />
            <path d={d} stroke="#f4ffe6" strokeWidth={rd(breite * 1.4)} className="tv00-welle" style={{ animationDelay: `${3000 + R.rang * 140}ms` }} />
            {/* Energie läuft die Reihe entlang */}
            <path d={d} pathLength="1" stroke={GRUEN_HELL} strokeOpacity="0.45" strokeWidth={rd(breite * 4)} strokeLinecap="round" className="tv00-fluss" style={{ animationDelay: `${2400 + ((R.r * 7) % 5) * 520}ms`, animationDuration: `${3600 + ((R.r * 3) % 4) * 500}ms` }} />
            <path d={d} pathLength="1" stroke="#f6ffe9" strokeWidth={rd(breite * 1.6)} strokeLinecap="round" className="tv00-fluss" style={{ animationDelay: `${2400 + ((R.r * 7) % 5) * 520}ms`, animationDuration: `${3600 + ((R.r * 3) % 4) * 500}ms` }} />
          </g>
        );
      })}

      {/* Dunst am Horizont */}
      <rect y={VY - 2} width={B} height="112" fill="url(#tv00-dunst)" />
      <rect y={VY - 1.2} width={B} height="2.4" fill="url(#tv00-horizont)" className="tv00-horizont" style={{ transformOrigin: `${VX}px ${VY}px` }} />

      <rect width={B} height={H} fill="url(#tv00-vignette)" />
    </svg>
  );
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const STIL = `
  .tv00-kamera { will-change: transform; }
  .tv00-an .tv00-kamera { animation: tv00-kamera 13s cubic-bezier(0.33, 0, 0.3, 1) forwards; }
  @keyframes tv00-kamera { from { transform: scale(1); } to { transform: scale(1.045); } }

  /* Text */
  .tv00-auf { opacity: 0; transform: translateY(0.5em); }
  .tv00-an .tv00-auf { animation: tv00-auf 1100ms ${EASE} forwards; }
  @keyframes tv00-auf { to { opacity: 1; transform: none; } }
  .tv00-balken { transform: scaleX(0); transform-origin: left center; }
  .tv00-an .tv00-balken { animation: tv00-balken 1000ms ${EASE} forwards; }
  @keyframes tv00-balken { to { transform: none; } }
  .tv00-maske { display: block; overflow: hidden; padding: 0.08em 0 0.1em; margin: -0.08em 0 -0.1em; }
  .tv00-zeile { display: block; transform: translateY(135%); }
  .tv00-an .tv00-zeile { animation: tv00-zeile 1250ms ${EASE} forwards; }
  @keyframes tv00-zeile { to { transform: none; } }
  .tv00-maske-x { overflow: hidden; transform: translateX(-101%); }
  .tv00-logo { transform: translateX(101%); }
  .tv00-an .tv00-maske-x, .tv00-an .tv00-logo { animation: tv00-zeile 1400ms ${EASE} 300ms forwards; }
  .tv00-trenner { transform: scaleY(0); }
  .tv00-an .tv00-trenner { animation: tv00-balken 900ms ${EASE} forwards; }

  /* Szene */
  .tv00-strich { fill: none; stroke-dasharray: 1; stroke-dashoffset: 1; }
  .tv00-an .tv00-strich { animation: tv00-zeichnen 1400ms cubic-bezier(0.65, 0, 0.35, 1) forwards; }
  @keyframes tv00-zeichnen { to { stroke-dashoffset: 0; } }
  .tv00-glut { opacity: 0; transform: scale(0.55); }
  .tv00-an .tv00-glut { animation: tv00-glut 2800ms ${EASE} 200ms forwards; }
  @keyframes tv00-glut { to { opacity: 1; transform: none; } }
  .tv00-an .tv00-atem { animation: tv00-atem 5.5s ease-in-out 3s infinite alternate; }
  @keyframes tv00-atem { to { opacity: 0.78; } }
  .tv00-sonne { transform: translateY(130px); }
  .tv00-an .tv00-sonne { animation: tv00-sonne 2600ms ${EASE} 150ms forwards; }
  @keyframes tv00-sonne { to { transform: none; } }
  .tv00-horizont { transform: scaleX(0); }
  .tv00-an .tv00-horizont { animation: tv00-balken 1800ms ${EASE} 250ms forwards; }
  .tv00-strahlen { opacity: 0.9; }
  .tv00-an .tv00-strahlen { animation: tv00-strahlen 2400ms ease 1600ms forwards; }
  @keyframes tv00-strahlen { to { opacity: 0.45; } }
  .tv00-kanten { opacity: 1; }
  .tv00-an .tv00-kanten { animation: tv00-strahlen 1600ms ease 1800ms forwards; }
  .tv00-modul { opacity: 0; transform: translateY(var(--tv00-dy, -20px)); }
  .tv00-an .tv00-modul { animation: tv00-auf 900ms ${EASE} forwards; }
  .tv00-auf-svg { opacity: 0; }
  .tv00-an .tv00-auf-svg { animation: tv00-auf 900ms ${EASE} forwards; }
  .tv00-glanz { opacity: 0; }
  .tv00-an .tv00-glanz { animation: tv00-auf 2200ms ease 900ms forwards; }
  .tv00-streif { transform: translateX(2900px); }
  .tv00-an .tv00-streif { animation: tv00-streif 6200ms cubic-bezier(0.45, 0, 0.25, 1) 1250ms infinite; }
  @keyframes tv00-streif { 0% { transform: translateX(2900px); } 42% { transform: translateX(-500px); } 100% { transform: translateX(-500px); } }
  .tv00-welle { fill: none; opacity: 0; }
  .tv00-an .tv00-welle { animation: tv00-welle 4200ms ease-in-out infinite; }
  @keyframes tv00-welle { 0% { opacity: 0; } 10% { opacity: 0.85; } 32% { opacity: 0; } 100% { opacity: 0; } }
  .tv00-fluss { fill: none; stroke-dasharray: 0.07 1; stroke-dashoffset: 0.07; opacity: 0; }
  .tv00-an .tv00-fluss { animation-name: tv00-fluss; animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); animation-iteration-count: infinite; }
  @keyframes tv00-fluss { 0% { stroke-dashoffset: 0.07; opacity: 0; } 8% { opacity: 1; } 85% { opacity: 1; } 100% { stroke-dashoffset: -1; opacity: 0; } }

  @media (prefers-reduced-motion: reduce) {
    .tv00 *, .tv00-an * { animation: none !important; }
    .tv00-auf, .tv00-modul, .tv00-auf-svg, .tv00-glanz, .tv00-glut { opacity: 1; transform: none; }
    .tv00-zeile, .tv00-balken, .tv00-trenner, .tv00-logo, .tv00-maske-x, .tv00-sonne, .tv00-horizont, .tv00-kamera { transform: none; }
    .tv00-strich { stroke-dashoffset: 0; }
    .tv00-strahlen, .tv00-kanten { opacity: 0.45; }
    .tv00-fluss, .tv00-welle { opacity: 0; }
  }
`;
