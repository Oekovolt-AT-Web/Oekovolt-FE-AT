"use client";

import { useEffect, useRef } from "react";
import { GRUEN, GRUEN_HELL, GRUEN_TIEF, SONNE, BLAU, NAVY, DISPLAY, auf, strich } from "./gemeinsam";

/* ================================================================== */
/* 6 · Lastgang: Verbrauch, Solarerzeugung und Speicher (Schema)       */
/* ================================================================== */
//
// Erklärfilm in einer Grafik: Ein Zeit-Cursor läuft einmal zügig durch den Tag (0 bis 24 Uhr)
// und legt Kurven und Flächen frei. Der Gewerbespeicher rechts lädt synchron mit dem
// Solarüberschuss und gibt die Energie genau dann wieder ab, wenn die Lastspitze gekappt wird.
// Danach läuft der Tag ruhiger in Schleife weiter (Cursor, Speicher, Energiefluss), damit die
// Anzeige lebt. Alle Bewegungen sind CSS-Keyframes, die hier deterministisch aus denselben
// Kurven erzeugt werden (nur transform und opacity bzw. stroke-dashoffset).

const glocke = (h, m, s) => Math.exp(-(((h - m) / s) ** 2));
const glocke4 = (h, m, s) => Math.exp(-(((h - m) / s) ** 4));
const rampe = (h, a, b) => {
  const v = Math.min(1, Math.max(0, (h - a) / (b - a)));
  return v * v * (3 - 2 * v);
};
/** Schematischer Verbrauch: Grundlast, Arbeitstag, Mittagsdelle, Lastspitze am Nachmittag. */
const verbrauch = (h) => {
  const tag = rampe(h, 5.6, 7.4) * (1 - rampe(h, 17.4, 19.4));
  return 0.2 + tag * (0.44 + 0.05 * glocke(h, 7.7, 0.55) - 0.13 * glocke(h, 12.3, 0.6) + 0.33 * glocke4(h, 16.1, 1.05));
};
const solar = (h) => Math.max(0, 0.9 * glocke(h, 13, 3.3) - 0.03);
const KAPPE = 0.78;
const ueberschuss = (h) => Math.max(0, solar(h) - verbrauch(h));
const spitze = (h) => Math.max(0, verbrauch(h) - KAPPE);

/* Raster 1040 × 840 */
const L = 24;
const R = 760;
const T = 190;
const B = 620;
const x = (h) => L + (h / 24) * (R - L);
const y = (v) => B - v * (B - T);
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const klemme = (v) => Math.min(1, Math.max(0, v));

/* Speicher */
const SX = 922; // Mitte der Speichersäule
const ZELLE = { x: SX - 50, y: 214, w: 100, h: 318 };
const LADUNG_MIN = 0.3;
const LADUNG_MAX = 0.94;

/* Zeitachse der Animation */
const ERST_START = 700; // ms
const ERST_DAUER = 4200;
const SCHLEIFE_START = 5600;
const SCHLEIFE_DAUER = 10000;

/* ------------------------------------------------------------------ */
/* Stützstellen (Viertelstunden) und daraus alle Keyframes             */
/* ------------------------------------------------------------------ */

const STUNDEN = Array.from({ length: 97 }, (_, i) => i / 4);

// Tempo: Nacht zügig, Arbeitstag ruhiger, an der Lastspitze noch etwas langsamer.
const gewicht = (h) => 0.34 + 0.66 * rampe(h, 5, 7) * (1 - rampe(h, 18.5, 20.5)) + 0.9 * glocke(h, 16, 0.9);
const PROZENT = (() => {
  const summe = [0];
  for (let i = 1; i < STUNDEN.length; i++) summe.push(summe[i - 1] + (gewicht(STUNDEN[i - 1]) + gewicht(STUNDEN[i])) / 2);
  const ges = summe.at(-1);
  return summe.map((s) => r2((s / ges) * 100));
})();

// Speicherstand über den Tag: lädt mit dem Überschuss, entlädt mit der gekappten Spitze.
const LADUNG = (() => {
  let su = 0;
  let sp = 0;
  const kumU = [0];
  const kumS = [0];
  for (let i = 1; i < STUNDEN.length; i++) {
    su += (ueberschuss(STUNDEN[i - 1]) + ueberschuss(STUNDEN[i])) / 2;
    sp += (spitze(STUNDEN[i - 1]) + spitze(STUNDEN[i])) / 2;
    kumU.push(su);
    kumS.push(sp);
  }
  const hub = LADUNG_MAX - LADUNG_MIN;
  return STUNDEN.map((_, i) => LADUNG_MIN + hub * (kumU[i] / su) - hub * (kumS[i] / sp));
})();

const laden = (h) => klemme(ueberschuss(h) / 0.06);
const entladen = (h) => klemme(spitze(h) / 0.05);
const tor = (v) => klemme((v - 0.5) * 2);
const cursorDeckkraft = (h) => klemme(Math.min(h / 0.5, (24 - h) / 0.5));

function keyframes(name, wert) {
  return `@keyframes ${name}{${STUNDEN.map((h, i) => `${PROZENT[i]}%{${wert(h, i)}}`).join("")}}`;
}

/** Deckkraft-Keyframes mit Zwischenschritt: ausblenden in der ersten, einblenden in der zweiten Hälfte. */
function keyframesNacheinander(name, wert) {
  const v = STUNDEN.map((h) => r2(wert(h)));
  const teile = [];
  v.forEach((w, i) => {
    teile.push(`${PROZENT[i]}%{opacity:${w}}`);
    if (i < v.length - 1 && v[i + 1] !== w) teile.push(`${r2((PROZENT[i] + PROZENT[i + 1]) / 2)}%{opacity:${Math.min(w, v[i + 1])}}`);
  });
  return `@keyframes ${name}{${teile.join("")}}`;
}

const CSS = [
  keyframes("tv06-cursor", (h) => `transform:translateX(${r1(x(h) - L)}px);opacity:${r2(cursorDeckkraft(h))}`),
  keyframes("tv06-sonnenpunkt", (h) => `transform:translate(${r1(x(h))}px,${r1(y(solar(h)))}px);opacity:${r2(cursorDeckkraft(h) * klemme(solar(h) / 0.04))}`),
  keyframes("tv06-lastpunkt", (h) => `transform:translate(${r1(x(h))}px,${r1(y(verbrauch(h)))}px);opacity:${r2(cursorDeckkraft(h))}`),
  keyframes("tv06-freilegen", (h) => `transform:translateX(${h >= 24 ? R + 40 : r1(x(h))}px)`),
  keyframes("tv06-pegel", (h, i) => `transform:translateY(${r1((1 - LADUNG[i]) * ZELLE.h)}px)`),
  keyframes("tv06-laden", (h) => `opacity:${r2(laden(h))}`),
  keyframes("tv06-entladen", (h) => `opacity:${r2(entladen(h))}`),
  // Statuszeilen wechseln ohne Überlappung: erst aus, dann ein.
  keyframesNacheinander("tv06-status-laden", (h) => tor(laden(h))),
  keyframesNacheinander("tv06-status-entladen", (h) => tor(entladen(h))),
  keyframesNacheinander("tv06-bereit", (h) => tor(1 - Math.max(laden(h), entladen(h)))),
].join("\n");

const lauf = (name) => `${name} ${ERST_DAUER}ms linear ${ERST_START}ms 1 both, ${name} ${SCHLEIFE_DAUER}ms linear ${SCHLEIFE_START}ms infinite`;

const STIL = `
${CSS}
.tv06-cursor{opacity:0}
.tv06-punkt{opacity:0}
.tv06-freilegen{transform:translateX(${L}px)}
.tv06-pegel{transform:translateY(${r1((1 - LADUNG_MIN) * ZELLE.h)}px)}
.tv06-laden,.tv06-entladen,.tv06-status-laden,.tv06-status-entladen{opacity:0}
.tv06-bereit{opacity:1}
.tv06-fluss{stroke-dasharray:0 0.05;stroke-dashoffset:0}
.tv06-an .tv06-cursor{animation:${lauf("tv06-cursor")}}
.tv06-an .tv06-sonnenpunkt{animation:${lauf("tv06-sonnenpunkt")}}
.tv06-an .tv06-lastpunkt{animation:${lauf("tv06-lastpunkt")}}
.tv06-an .tv06-freilegen{animation:tv06-freilegen ${ERST_DAUER}ms linear ${ERST_START}ms 1 both}
.tv06-an .tv06-pegel{animation:${lauf("tv06-pegel")}}
.tv06-an .tv06-laden{animation:${lauf("tv06-laden")}}
.tv06-an .tv06-entladen{animation:${lauf("tv06-entladen")}}
.tv06-an .tv06-bereit{animation:${lauf("tv06-bereit")}}
.tv06-an .tv06-status-laden{animation:${lauf("tv06-status-laden")}}
.tv06-an .tv06-status-entladen{animation:${lauf("tv06-status-entladen")}}
.tv06-an .tv06-fluss{animation:tv06-fluss 1.1s linear infinite}
@keyframes tv06-fluss{to{stroke-dashoffset:-0.1}}
.tv06-an .tv06-glanz{animation:tv06-glanz 4.2s cubic-bezier(0.45,0,0.25,1) 1.2s infinite both}
.tv06-glanz{opacity:0}
@keyframes tv06-glanz{0%{transform:translateY(0);opacity:0}15%{opacity:1}70%{opacity:1}100%{transform:translateY(-${ZELLE.h + 80}px);opacity:0}}
@media (prefers-reduced-motion: reduce){
  .tv06-an .tv06-cursor,.tv06-an .tv06-sonnenpunkt,.tv06-an .tv06-lastpunkt,.tv06-an .tv06-freilegen,.tv06-an .tv06-pegel,
  .tv06-an .tv06-laden,.tv06-an .tv06-entladen,.tv06-an .tv06-bereit,.tv06-an .tv06-status-laden,.tv06-an .tv06-status-entladen,.tv06-an .tv06-fluss,.tv06-an .tv06-glanz{animation:none}
  .tv06-freilegen{transform:translateX(${R + 40}px)}
  .tv06-pegel{transform:translateY(${r1((1 - LADUNG_MAX) * ZELLE.h)}px)}
}
`;

/** Uhrzeit des Cursors aus der verstrichenen Zeit (gleiche Stützstellen wie die Keyframes). */
function stundeZu(ms) {
  let anteil;
  if (ms < ERST_START) return 0;
  if (ms < ERST_START + ERST_DAUER) anteil = (ms - ERST_START) / ERST_DAUER;
  else if (ms < SCHLEIFE_START) return 24;
  else anteil = ((ms - SCHLEIFE_START) % SCHLEIFE_DAUER) / SCHLEIFE_DAUER;
  const p = anteil * 100;
  let i = 0;
  while (i < PROZENT.length - 2 && PROZENT[i + 1] < p) i++;
  const f = klemme((p - PROZENT[i]) / (PROZENT[i + 1] - PROZENT[i] || 1));
  return STUNDEN[i] + f * 0.25;
}
const uhrzeit = (h) => {
  const v = Math.min(96, Math.floor(h * 4 + 1e-6));
  return `${String(Math.floor(v / 4)).padStart(2, "0")}:${String((v % 4) * 15).padStart(2, "0")}`;
};

/* ------------------------------------------------------------------ */
/* Pfade                                                               */
/* ------------------------------------------------------------------ */

const FEIN = Array.from({ length: 193 }, (_, i) => i / 8);
const linie = (fn) => FEIN.map((h, i) => `${i ? "L" : "M"}${r1(x(h))} ${r1(y(fn(h)))}`).join("");
const flaeche = (fn) => `${linie(fn)}L${x(24)} ${y(0)}L${x(0)} ${y(0)}Z`;
const SPITZE_FLAECHE = (() => {
  const hs = Array.from({ length: 81 }, (_, i) => 14 + i * 0.05);
  return `M${r1(x(14))} ${r1(y(KAPPE))}${hs.map((h) => `L${r1(x(h))} ${r1(y(Math.max(KAPPE, verbrauch(h))))}`).join("")}L${r1(x(18))} ${r1(y(KAPPE))}Z`;
})();

// Energiefluss: Überschuss → Speicher (über die Spitze hinweg), Speicher → Lastspitze.
const U0 = { x: r1(x(12.6)), y: r1(y(solar(12.6)) - 10) };
const FLUSS_LADEN = `M${U0.x} ${U0.y}C${U0.x + 30} 104 ${SX - 300} 100 ${ZELLE.x - 14} ${ZELLE.y + 96}`;
const S0 = { x: r1(x(16.55)), y: r1(y(KAPPE + 0.07)) };
const FLUSS_ENTLADEN = `M${ZELLE.x - 12} ${ZELLE.y + 200}C${SX - 170} ${ZELLE.y + 200} ${S0.x + 90} ${S0.y} ${S0.x} ${S0.y}`;

const LEGENDE = [
  { art: "linie", farbe: "#fff", l: "Verbrauch", sp: 0 },
  { art: "linie", farbe: SONNE, l: "Solarerzeugung", sp: 1 },
  { art: "flaeche", farbe: GRUEN, l: "Solarstrom direkt genutzt", sp: 2 },
  { art: "flaeche", farbe: "rgba(255,255,255,0.16)", l: "Bezug aus dem Netz", sp: 0, rand: true },
  { art: "flaeche", farbe: SONNE, l: "Überschuss für den Speicher", sp: 1 },
  { art: "flaeche", farbe: BLAU, l: "Spitze aus dem Speicher", sp: 2 },
];
const LEGENDE_X = [0, 290, 690];

const STATUS = [
  { k: "tv06-bereit", farbe: "#fff", a: "Bereit", b: "für die nächste Spitze" },
  { k: "tv06-status-laden", farbe: SONNE, a: "Lädt", b: "mit Solarüberschuss" },
  { k: "tv06-status-entladen", farbe: BLAU, a: "Kappt die Spitze", b: "statt Netzbezug" },
];

export default function LastgangGrafik({ aktiv }) {
  const uhrRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const el = uhrRef.current;
    if (!el) return undefined;
    if (!aktiv || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = "00:00";
      return undefined;
    }
    // Ein schlanker Takt genügt: der Text wechselt nur alle Viertelstunden der Schema-Uhr.
    // Die Zeit kommt bevorzugt direkt aus der CSS-Animation des Cursors, damit Uhr und Bild synchron bleiben.
    let zuletzt = "";
    const t0 = performance.now();
    const zeit = () => {
      // Die Schleifen-Animation (unendlich) startet zeitgleich mit dem ersten Durchlauf und läuft weiter.
      const t = Math.max(-1, ...(cursorRef.current?.getAnimations?.() ?? []).map((a) => Number(a.currentTime) || 0));
      return t > 0 ? t : performance.now() - t0;
    };
    const schritt = () => {
      const text = uhrzeit(stundeZu(zeit()));
      if (text !== zuletzt) {
        el.textContent = text;
        zuletzt = text;
      }
    };
    schritt();
    const takt = setInterval(schritt, 40);
    return () => clearInterval(takt);
  }, [aktiv]);

  const kopf = auf(aktiv, 0);
  const achse = auf(aktiv, 250);
  const kappe = auf(aktiv, 500);
  const speicher = auf(aktiv, 350);

  return (
    <svg viewBox="0 0 1040 840" className={`h-full w-full ${aktiv ? "tv06-an" : ""}`} aria-hidden="true">
      <style>{STIL}</style>
      <defs>
        <linearGradient id="tv06-gruen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GRUEN} />
          <stop offset="1" stopColor={GRUEN_TIEF} />
        </linearGradient>
        <linearGradient id="tv06-sonne" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SONNE} />
          <stop offset="1" stopColor="#f0a92a" />
        </linearGradient>
        <linearGradient id="tv06-netz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="tv06-licht" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tv06-cursorlinie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="tv06-zelle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={GRUEN_HELL} />
          <stop offset="0.35" stopColor={GRUEN} />
          <stop offset="1" stopColor={GRUEN_TIEF} />
        </linearGradient>
        <linearGradient id="tv06-glanzverlauf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="tv06-halo-sonne" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.32" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv06-halo-blau" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={BLAU} stopOpacity="0.36" />
          <stop offset="1" stopColor={BLAU} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tv06-tageslicht" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.1" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0" />
        </radialGradient>
        <clipPath id="tv06-freilegen">
          <rect className="tv06-freilegen" x={-(R + 60)} y="0" width={R + 60} height="840" />
        </clipPath>
        <clipPath id="tv06-zellform">
          <rect x={ZELLE.x} y={ZELLE.y} width={ZELLE.w} height={ZELLE.h} rx="10" />
        </clipPath>
      </defs>

      {/* Kopf */}
      <g className={kopf.className} style={kopf.style}>
        <text x="0" y="44" fontSize="32" fontWeight="800" fill="#fff" letterSpacing="-0.5" style={DISPLAY}>
          Ein Werktag im Betrieb
        </text>
        <text x="0" y="82" fontSize="22" fill="rgba(255,255,255,0.5)">
          Schematische Darstellung, keine Messwerte
        </text>
      </g>

      {/* Achsen und Raster */}
      <g className={achse.className} style={achse.style}>
        <ellipse cx={x(13)} cy={y(0.45)} rx="300" ry="260" fill="url(#tv06-tageslicht)" />
        {[0.25, 0.5, 0.75, 1].map((v) => (
          <line key={v} x1={L} x2={R} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        ))}
        {[6, 12, 18].map((h) => (
          <line key={h} x1={x(h)} x2={x(h)} y1={T - 6} y2={B} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
        ))}
        {[0, 6, 12, 18, 24].map((h) => (
          <text key={h} x={x(h)} y={B + 40} textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} fontSize="22" fill="rgba(255,255,255,0.55)">
            {h} Uhr
          </text>
        ))}
      </g>

      {/* Flächen und Kurven, vom Cursor freigelegt */}
      <g clipPath="url(#tv06-freilegen)">
        <path d={flaeche(verbrauch)} fill="url(#tv06-netz)" />
        <path d={flaeche(solar)} fill="url(#tv06-sonne)" />
        <path d={flaeche((h) => Math.min(verbrauch(h), solar(h)))} fill="url(#tv06-gruen)" />
        <path d={SPITZE_FLAECHE} fill={BLAU} />
        <path d={linie(solar)} fill="none" stroke={SONNE} strokeWidth="10" strokeOpacity="0.16" strokeLinejoin="round" />
        <path d={linie(solar)} fill="none" stroke={SONNE} strokeWidth="3.5" strokeLinejoin="round" />
        <path d={linie(verbrauch)} fill="none" stroke="#fff" strokeWidth="10" strokeOpacity="0.08" strokeLinejoin="round" />
        <path d={linie(verbrauch)} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinejoin="round" />
      </g>
      <line x1={L} x2={R} y1={B} y2={B} stroke="rgba(255,255,255,0.35)" strokeWidth="2" {...strich(aktiv, 150, 1100)} />

      {/* Kappungsgrenze */}
      <g className={kappe.className} style={kappe.style}>
        <line x1={L} x2={R} y1={y(KAPPE)} y2={y(KAPPE)} stroke={BLAU} strokeWidth="2.5" strokeDasharray="10 9" opacity="0.9" />
        <text x={L} y={y(KAPPE) - 14} fontSize="22" fontWeight="600" fill={BLAU}>
          Kappungsgrenze
        </text>
      </g>

      {/* Energiefluss */}
      <g className="tv06-laden">
        <path d={FLUSS_LADEN} fill="none" stroke={SONNE} strokeWidth="2" strokeOpacity="0.28" />
        <path d={FLUSS_LADEN} pathLength="1" className="tv06-fluss" fill="none" stroke={SONNE} strokeWidth="8" strokeLinecap="round" />
      </g>
      <g className="tv06-entladen">
        <path d={FLUSS_ENTLADEN} fill="none" stroke={BLAU} strokeWidth="2" strokeOpacity="0.3" />
        <path d={FLUSS_ENTLADEN} pathLength="1" className="tv06-fluss" fill="none" stroke={BLAU} strokeWidth="8" strokeLinecap="round" />
      </g>

      {/* Zeit-Cursor */}
      <g ref={cursorRef} className="tv06-cursor">
        <rect x={L - 70} y={T - 20} width="140" height={B - T + 20} fill="url(#tv06-licht)" />
        <line x1={L} x2={L} y1={T - 12} y2={B} stroke="url(#tv06-cursorlinie)" strokeWidth="2" />
        <rect x={L - 46} y={T - 58} width="92" height="40" rx="20" fill={NAVY} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <text ref={uhrRef} x={L} y={T - 30} textAnchor="middle" fontSize="23" fontWeight="800" fill="#fff" style={{ ...DISPLAY, fontVariantNumeric: "tabular-nums" }}>
          00:00
        </text>
      </g>
      <g className="tv06-punkt tv06-lastpunkt">
        <circle r="15" fill="#fff" opacity="0.18" />
        <circle r="7" fill="#fff" />
      </g>
      <g className="tv06-punkt tv06-sonnenpunkt">
        <circle r="17" fill={SONNE} opacity="0.25" />
        <circle r="8" fill={SONNE} stroke={NAVY} strokeWidth="2" />
      </g>

      {/* Gewerbespeicher */}
      <g className={speicher.className} style={speicher.style}>
        <ellipse className="tv06-laden" cx={SX} cy={ZELLE.y + ZELLE.h / 2} rx="150" ry="230" fill="url(#tv06-halo-sonne)" />
        <ellipse className="tv06-entladen" cx={SX} cy={ZELLE.y + ZELLE.h / 2} rx="150" ry="230" fill="url(#tv06-halo-blau)" />
        <text x={SX} y={T - 30} textAnchor="middle" fontSize="24" fontWeight="700" fill="#fff" style={DISPLAY}>
          Gewerbespeicher
        </text>
        <rect x={SX - 22} y={ZELLE.y - 22} width="44" height="12" rx="4" fill="rgba(255,255,255,0.35)" />
        <rect x={ZELLE.x - 10} y={ZELLE.y - 10} width={ZELLE.w + 20} height={ZELLE.h + 20} rx="18" fill="#0b1a33" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        <g clipPath="url(#tv06-zellform)">
          <rect x={ZELLE.x} y={ZELLE.y} width={ZELLE.w} height={ZELLE.h} fill="rgba(255,255,255,0.04)" />
          <g className="tv06-pegel">
            <rect x={ZELLE.x} y={ZELLE.y} width={ZELLE.w} height={ZELLE.h} fill="url(#tv06-zelle)" />
            <rect x={ZELLE.x} y={ZELLE.y} width={ZELLE.w} height="4" fill="#fff" opacity="0.55" />
            <rect className="tv06-laden" x={ZELLE.x} y={ZELLE.y - 2} width={ZELLE.w} height="6" fill={SONNE} />
            <rect className="tv06-entladen" x={ZELLE.x} y={ZELLE.y - 2} width={ZELLE.w} height="6" fill={BLAU} />
          </g>
          <rect className="tv06-glanz" x={ZELLE.x} y={ZELLE.y + ZELLE.h} width={ZELLE.w} height="80" fill="url(#tv06-glanzverlauf)" />
          {Array.from({ length: 7 }, (_, i) => (
            <line key={i} x1={ZELLE.x} x2={ZELLE.x + ZELLE.w} y1={r1(ZELLE.y + ((i + 1) * ZELLE.h) / 8)} y2={r1(ZELLE.y + ((i + 1) * ZELLE.h) / 8)} stroke={NAVY} strokeWidth="4" />
          ))}
        </g>
        {STATUS.map((s) => (
          <g key={s.k} className={s.k}>
            <text x={SX} y={B - 22} textAnchor="middle" fontSize="26" fontWeight="800" fill={s.farbe} style={DISPLAY}>
              {s.a}
            </text>
            <text x={SX} y={B + 10} textAnchor="middle" fontSize="21" fill="rgba(255,255,255,0.6)">
              {s.b}
            </text>
          </g>
        ))}
      </g>

      {/* Legende */}
      {LEGENDE.map((g, i) => {
        const lx = LEGENDE_X[g.sp];
        const ly = 730 + Math.floor(i / 3) * 50;
        const a = auf(aktiv, 1600 + i * 110);
        return (
          <g key={g.l} className={a.className} style={a.style}>
            {g.art === "linie" ? (
              <line x1={lx + 2} x2={lx + 28} y1={ly - 8} y2={ly - 8} stroke={g.farbe} strokeWidth="5" strokeLinecap="round" />
            ) : (
              <rect x={lx} y={ly - 20} width="28" height="24" rx="6" fill={g.farbe} stroke={g.rand ? "rgba(255,255,255,0.35)" : "none"} strokeWidth="1.5" />
            )}
            <text x={lx + 42} y={ly} fontSize="23" fill="rgba(255,255,255,0.82)">
              {g.l}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
