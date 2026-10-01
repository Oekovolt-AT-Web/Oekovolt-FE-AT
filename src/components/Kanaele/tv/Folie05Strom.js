"use client";

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import useLiveDaten from "@/components/EnergieLive/useLiveDaten";
import { preisTage, zeitfenster, ct, gw, uhr, achse, zahl, spanne } from "@/components/EnergieLive/berechnung";
import { GRUEN, GRUEN_HELL, GRUEN_TIEF, SONNE, BLAU, NAVY, DISPLAY, rd } from "./gemeinsam";

/* ================================================================== */
/* 5 · Strom live – Börsenpreis, Tagesverlauf, Erzeugungsmix           */
/* ================================================================== */
//
// Choreografie (ab `aktiv`):
//   0–0,4 s  Raster, Achsen, Kopfzeilen
//   0,3–1,9 s Preis zählt auf den Live-Wert hoch; Kurve zeichnet sich mit leuchtendem Kopf
//   0,7–2,1 s Fläche steigt auf; günstigste 3 Stunden werden mit einem Lichtstreif aufgedeckt
//   1,9–2,6 s „jetzt“-Lot fällt, Punkt setzt, Radar-Puls; Erneuerbar-Ring füllt sich, Mix-Balken wachsen
//   danach   Lichtfunken wandern die Kurve entlang, Radar pulsiert, Glanz und Teilchen im Mix-Balken
// Ohne `aktiv` bleibt der ruhende Endzustand stehen (keine Dauer-Animationen).

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const ZEICHNEN = "cubic-bezier(0.45, 0, 0.2, 1)";

function useStrom() {
  const { daten, jetzt } = useLiveDaten(null);
  const tage = useMemo(() => preisTage(daten.preis, jetzt), [daten.preis, jetzt]);
  const fenster = useMemo(() => (tage.heute ? zeitfenster(tage.heute.punkte, 180, tage.schrittMs).guenstig : null), [tage]);
  const { heute, aktuell } = tage;
  const lage = heute && aktuell && heute.max.eurMwh > heute.min.eurMwh ? (aktuell.eurMwh - heute.min.eurMwh) / (heute.max.eurMwh - heute.min.eurMwh) : null;
  return { daten, jetzt, tage, fenster, lage };
}

/** Bewegung reduziert? (nur im Browser) */
const ruhig = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Hochzählen 0 → 1 (ease-out) mit requestAnimationFrame, startet bei jedem Wechsel von `lauf` auf true.
 * Solange nichts läuft, ist der Fortschritt 1 – der Wert steht also immer exakt auf dem Live-Wert.
 */
function useFortschritt(lauf, verzoegerung = 0, dauer = 1500) {
  const [p, setP] = useState(1);
  // Layout-Effekt: der Startwert steht vor dem ersten Bild, kein Aufblitzen des Endwerts
  useLayoutEffect(() => {
    if (!lauf || ruhig()) return undefined;
    setP(0);
    let raf = 0;
    const start = performance.now() + verzoegerung;
    const schritt = (jetzt) => {
      const q = Math.min(1, Math.max(0, (jetzt - start) / dauer));
      setP(1 - (1 - q) ** 4);
      if (q < 1) raf = requestAnimationFrame(schritt);
    };
    raf = requestAnimationFrame(schritt);
    return () => {
      cancelAnimationFrame(raf);
      setP(1);
    };
  }, [lauf, verzoegerung, dauer]);
  return p;
}

/** Klassen nur, wenn aktiv – sonst ruhender Endzustand. */
const an = (aktiv, klasse, ms = 0, basis = "", extra) => ({
  className: `${basis} ${aktiv ? klasse : ""}`.trim() || undefined,
  style: aktiv ? { animationDelay: `${ms}ms`, ...extra } : extra,
});

/* ------------------------------------------------------------------ */
/* Stile (Präfix tv05)                                                 */
/* ------------------------------------------------------------------ */

const STIL = `
.tv05-ein { animation: tv05-ein 900ms ${EASE} both; }
@keyframes tv05-ein { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
.tv05-hoch { animation: tv05-hoch 1000ms ${EASE} both; }
@keyframes tv05-hoch { from { opacity: 0; transform: translateY(0.7em); } to { opacity: 1; transform: none; } }
.tv05-blende { animation: tv05-blende 1100ms ${EASE} both; }
@keyframes tv05-blende { from { opacity: 0; } to { opacity: 1; } }
.tv05-linie { stroke-dasharray: 1 2; animation: tv05-linie 1500ms ${ZEICHNEN} both; }
@keyframes tv05-linie { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
.tv05-kopf { stroke-dasharray: 0.008 3; animation: tv05-kopf 1500ms ${ZEICHNEN} both, tv05-kopfblende 1500ms linear both; }
.tv05-kopf-weit { stroke-dasharray: 0.016 3; }
@keyframes tv05-kopf { from { stroke-dashoffset: var(--tv05-d, 0.008); } to { stroke-dashoffset: calc(var(--tv05-d, 0.008) - 1); } }
@keyframes tv05-kopfblende { 0% { opacity: 0; } 6% { opacity: 1; } 82% { opacity: 1; } 100% { opacity: 0; } }
.tv05-glanz { stroke-dasharray: 0.018 0.482; opacity: 0; animation: tv05-glanz 9s linear infinite, tv05-blende 1200ms ease both; }
@keyframes tv05-glanz { from { stroke-dashoffset: 0.018; } to { stroke-dashoffset: -0.482; } }
.tv05-steigen { transform-box: fill-box; transform-origin: 50% 100%; animation: tv05-steigen 1500ms ${EASE} both; }
@keyframes tv05-steigen { from { opacity: 0; transform: scaleY(0.05); } to { opacity: 1; transform: none; } }
.tv05-band { transform-box: fill-box; transform-origin: 0 50%; animation: tv05-band 900ms ${EASE} both; }
@keyframes tv05-band { from { transform: scaleX(0); } to { transform: none; } }
.tv05-kante { animation: tv05-kante 900ms ${EASE} both; }
@keyframes tv05-kante { 0% { opacity: 0; transform: none; } 12% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; transform: translateX(var(--tv05-w)); } }
.tv05-lot { transform-box: fill-box; transform-origin: 50% 0; animation: tv05-lot 800ms ${EASE} both; }
@keyframes tv05-lot { from { transform: scaleY(0); } to { transform: none; } }
.tv05-punkt { transform-box: fill-box; transform-origin: center; animation: tv05-punkt 700ms ${EASE} both; }
@keyframes tv05-punkt { from { opacity: 0; transform: scale(0.2); } to { opacity: 1; transform: none; } }
.tv05-radar { transform-box: fill-box; transform-origin: center; opacity: 0; animation: tv05-radar 3s cubic-bezier(0.2, 0.6, 0.35, 1) infinite; }
@keyframes tv05-radar { 0% { opacity: 0.75; transform: scale(1); } 100% { opacity: 0; transform: scale(4.6); } }
.tv05-atmen { transform-box: fill-box; transform-origin: center; animation: tv05-atmen 2.8s ease-in-out infinite; }
@keyframes tv05-atmen { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.45; transform: scale(0.72); } }
.tv05-ring { animation: tv05-ring 1500ms ${ZEICHNEN} both; }
@keyframes tv05-ring { from { stroke-dashoffset: var(--tv05-ee); } to { stroke-dashoffset: 0; } }
.tv05-segment { transform-origin: 0 50%; animation: tv05-segment 900ms ${EASE} both; }
@keyframes tv05-segment { from { transform: scaleX(0); } to { transform: none; } }
.tv05-sheen { animation: tv05-sheen 6.5s cubic-bezier(0.45, 0, 0.25, 1) infinite; }
@keyframes tv05-sheen { 0% { transform: translateX(-22%); } 55%, 100% { transform: translateX(100%); } }
.tv05-teilchen { animation: tv05-teilchen linear infinite; }
@keyframes tv05-teilchen { from { transform: translateX(0); } to { transform: translateX(calc(100% + 2.5em)); } }
.tv05-spur { transform-origin: 0 50%; animation: tv05-segment 1100ms ${EASE} both; }
.tv05-marker { animation: tv05-marker 1300ms ${EASE} both; }
@keyframes tv05-marker { from { transform: translateX(0); opacity: 0; } 20% { opacity: 1; } to { transform: translateX(var(--tv05-p)); opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  [class*="tv05-"] { animation: none !important; }
  .tv05-glanz, .tv05-kopf, .tv05-radar, .tv05-sheen, .tv05-teilchen { display: none; }
  .tv05-marker { transform: translateX(var(--tv05-p)); }
}
`;

/* ------------------------------------------------------------------ */
/* Linke Spalte: Preis jetzt                                           */
/* ------------------------------------------------------------------ */

/** Ist die eigene Folie gerade sichtbar? Der Rahmen gibt `aktiv` nicht weiter – daher über aria-hidden der Folie. */
function useFolieAktiv(ref, aktivProp) {
  const [aktiv, setAktiv] = useState(false);
  useEffect(() => {
    if (aktivProp != null) return undefined;
    const sektion = ref.current?.closest("section");
    if (!sektion) return undefined;
    const pruefen = () => setAktiv(sektion.getAttribute("aria-hidden") !== "true");
    pruefen();
    const mo = new MutationObserver(pruefen);
    mo.observe(sektion, { attributes: true, attributeFilter: ["aria-hidden"] });
    return () => mo.disconnect();
  }, [ref, aktivProp]);
  return aktivProp ?? aktiv;
}

export function StromPreis({ aktiv: aktivProp } = {}) {
  const ref = useRef(null);
  const aktiv = useFolieAktiv(ref, aktivProp);
  const { tage, lage } = useStrom();
  const { aktuell, heute, morgen } = tage;
  const bereit = Boolean(aktuell);
  const p = useFortschritt(aktiv && bereit, 250, 1700);

  if (!bereit) {
    return (
      <div ref={ref} className="mt-[1.4em]">
        <p className="text-[1.15em] text-white/60">Börsenstrompreis jetzt</p>
        <div className="mt-[0.9em] flex items-end gap-[0.8em]">
          <span className="block h-[5.2em] w-[13em] rounded-[0.5em] bg-white/[0.06]" />
          <span className="font-display text-[2em] font-bold leading-none text-white/25">ct/kWh</span>
        </div>
        <p className="mt-[0.6em] text-[1.15em] text-white/50">Live-Daten werden geladen.</p>
      </div>
    );
  }

  const einordnung = lage == null ? null : lage < 0.33 ? "eher günstig" : lage > 0.66 ? "eher teuer" : "im Mittelfeld";
  const farbe = lage == null ? "#fff" : lage < 0.33 ? GRUEN_HELL : lage > 0.66 ? SONNE : "#fff";
  const stats = heute
    ? [
        { l: "Tagestief", w: ct(heute.min.eurMwh), z: `${uhr(heute.min.t)} Uhr`, a: "left" },
        morgen ? { l: "Mittel morgen", w: ct(morgen.avg), z: "je kWh", a: "center" } : { l: "Mittel heute", w: ct(heute.avg), z: "je kWh", a: "center" },
        { l: "Tageshoch", w: ct(heute.max.eurMwh), z: `${uhr(heute.max.t)} Uhr`, a: "right" },
      ]
    : [];

  return (
    <div ref={ref} className="mt-[1.3em]">
      <p {...an(aktiv, "tv05-hoch", 0, "text-[1.15em] text-white/60")}>
        Börsenstrompreis jetzt
      </p>
      <p className="font-display leading-none">
        <span className="text-[7.2em] font-extrabold tabular-nums tracking-[-0.045em]">{ct(aktuell.eurMwh * p)}</span>
        <span {...an(aktiv, "tv05-blende", 900, "ml-[0.25em] text-[2em] font-bold text-white/60")}>
          ct/kWh
        </span>
      </p>
      <p {...an(aktiv, "tv05-hoch", 700, "mt-[0.55em] text-[1.15em] leading-[1.45] text-white/60")}>
        Day-Ahead, netto, {uhr(aktuell.t)} bis {uhr(aktuell.t + tage.schrittMs)} Uhr.
        {einordnung && (
          <>
            {" "}Für heute{" "}
            <span className="font-bold" style={{ color: farbe }}>
              {einordnung}
            </span>
            .
          </>
        )}
      </p>

      {heute && (
        <div className="mt-[1.5em]">
          {/* Spanne Tagestief → Tageshoch mit Position des aktuellen Preises */}
          <div className="relative h-[1.2em]">
            <div className="absolute inset-x-0 top-1/2 h-[0.3em] -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
              <div {...an(aktiv, "tv05-spur", 900, "h-full w-full rounded-full", { background: `linear-gradient(90deg, ${GRUEN} 0%, rgba(255,255,255,0.55) 55%, ${SONNE} 100%)` })} />
            </div>
            {lage != null && (
              <div
                className={`absolute inset-0 ${aktiv ? "tv05-marker" : ""}`}
                style={{ "--tv05-p": `${(lage * 100).toFixed(2)}%`, transform: aktiv ? undefined : `translateX(${(lage * 100).toFixed(2)}%)`, animationDelay: aktiv ? "1100ms" : undefined }}
              >
                <span className="absolute left-0 top-1/2 block h-[1.2em] w-[1.2em] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.22em] bg-navy-950" style={{ borderColor: farbe }} />
              </div>
            )}
          </div>
          <dl className="mt-[0.8em] grid grid-cols-3 gap-[1em]">
            {stats.map((s, i) => (
              <div key={s.l} {...an(aktiv, "tv05-hoch", 1200 + i * 120, "", { textAlign: s.a })}>
                <dt className="text-[1.05em] text-white/55">{s.l}</dt>
                <dd className="font-display text-[1.9em] font-extrabold tabular-nums leading-[1.2]">
                  {s.w} <span className="text-[0.55em] text-white/55">ct</span>
                </dd>
                <dd className="text-[1em] text-white/45">{s.z}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rechte Fläche                                                       */
/* ------------------------------------------------------------------ */

const W = 1040;
const H = 530;
const L = 62;
const R = 1030;
const T = 66;
const B = 466;

export default function StromGrafik({ aktiv }) {
  const id = useId().replace(/:/g, "");
  const { daten, jetzt, tage, fenster } = useStrom();
  const e = daten.erzeugung || {};

  return (
    <div className="flex h-full flex-col">
      <style>{STIL}</style>
      <div {...an(aktiv, "tv05-blende", 0, "flex items-baseline justify-between")}>
        <p className="text-[1.2em] font-semibold text-white/75">Börsenstrompreis im Tagesverlauf, Cent je kWh netto</p>
        <p className="flex items-center gap-[0.55em] text-[1.1em] text-white/55">
          <span className={`inline-block h-[0.55em] w-[0.55em] rounded-full bg-ov-400 ${aktiv ? "tv05-atmen" : ""}`} />
          {tage.heute ? `Day-Ahead, ${tage.aufloesungMin}-Minuten-Preise` : "Live"}
        </p>
      </div>
      <Kurve id={id} aktiv={aktiv} jetzt={jetzt} tage={tage} fenster={fenster} />
      <Mix id={id} aktiv={aktiv} e={e} />
      <p {...an(aktiv, "tv05-blende", 1800, "mt-[0.9em] text-[1em] text-white/40")}>
        Quelle: Energy-Charts (Fraunhofer ISE), Gebotszone Österreich. Anteile an der Netzlast.
      </p>
    </div>
  );
}

/* ---------------------------- Preiskurve --------------------------- */

function Kurve({ id, aktiv, jetzt, tage, fenster }) {
  const { heute, morgen, aktuell, schrittMs } = tage;

  if (!heute) {
    // Ladezustand: gleiche Fläche, ruhiges Raster, kein Springen des Layouts
    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-[0.7em] w-full" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={L} x2={R} y1={T + (i * (B - T)) / 4} y2={T + (i * (B - T)) / 4} stroke={i === 4 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)"} strokeWidth="1.2" />
        ))}
        <text x={(L + R) / 2} y={T + (B - T) * 0.375 + 10} textAnchor="middle" fontSize="28" fontWeight="700" fill="rgba(255,255,255,0.55)" style={DISPLAY}>
          Live-Daten werden geladen.
        </text>
      </svg>
    );
  }

  const kette = [...heute.punkte, ...(morgen?.punkte || [])];
  const t0 = heute.start;
  const t1 = morgen ? morgen.ende : heute.ende;
  const werte = kette.map((p) => p.eurMwh / 10);
  const ax = achse(Math.min(0, ...werte), Math.max(...werte), 5);
  const x = (t) => L + ((t - t0) / (t1 - t0)) * (R - L);
  const y = (v) => T + (1 - (v - ax.von) / (ax.bis - ax.von)) * (B - T);
  const px = (p) => x(p.t + schrittMs / 2).toFixed(1);
  const py = (p) => y(p.eurMwh / 10).toFixed(1);
  const pfad = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${px(p)} ${py(p)}`).join("");
  const flaeche = (pts) => `${pfad(pts)}L${px(pts.at(-1))} ${y(ax.von).toFixed(1)}L${px(pts[0])} ${y(ax.von).toFixed(1)}Z`;

  const schrittStunden = morgen ? 6 : 3;
  const stunden = [];
  for (let t = t0; t <= t1 + 1; t += schrittStunden * 3600000) stunden.push(t);

  const jx = jetzt >= t0 && jetzt <= t1 ? rd(x(jetzt)) : null;
  const jy = aktuell ? rd(y(aktuell.eurMwh / 10)) : null;
  const pillText = aktuell ? `jetzt ${ct(aktuell.eurMwh)} ct` : "";
  const pillW = 40 + pillText.length * 12.5;
  const pillX = jx != null ? Math.min(Math.max(jx, L + pillW / 2), R - pillW / 2) : null;

  // Günstigstes Fenster
  const fx0 = fenster ? rd(x(fenster.start)) : null;
  const fw = fenster ? rd(x(fenster.ende) - x(fenster.start)) : 0;
  const fMitte = fenster ? Math.min(Math.max(fx0 + fw / 2, L + 120), R - 120) : null;

  // Beschriftung des Fensters nicht vom „jetzt“-Lot durchkreuzen lassen
  const fLabel = { x: fMitte, anker: "middle" };
  if (fenster && jx != null && Math.abs(jx - fMitte) < 140) {
    // auf die Seite des Lots, auf der das Band liegt – sofern dort Platz ist
    const links = fx0 + fw / 2 < jx ? jx - 16 - 256 >= L : jx + 16 + 256 > R;
    Object.assign(fLabel, links ? { x: jx - 16, anker: "end" } : { x: jx + 16, anker: "start" });
  }

  // Tageshoch: kleiner Hinweis am Kurvenpunkt, wenn Platz frei ist
  const hx = rd(x(heute.max.t + schrittMs / 2));
  const hy = rd(y(heute.max.eurMwh / 10));
  const hochLabel = (fMitte == null || Math.abs(hx - fMitte) > 250) && (jx == null || Math.abs(hx - jx) > 60);
  const hochX = Math.min(Math.max(hx, L + 90), R - 90);

  const dH = 250; // Beginn Kurve
  const dauerH = morgen ? 1250 : 1500;
  const dM = dH + dauerH;
  const dauerM = 1000;

  const tage2 = [{ pts: heute.punkte, farbe: "#fff", halo: GRUEN, grad: `${id}h`, d: dH, dauer: dauerH }];
  if (morgen) tage2.push({ pts: morgen.punkte, farbe: BLAU, halo: BLAU, grad: `${id}m`, d: dM, dauer: dauerM });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-[0.7em] w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}h`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.42" />
          <stop offset="0.7" stopColor={GRUEN} stopOpacity="0.08" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={BLAU} stopOpacity="0.32" />
          <stop offset="1" stopColor={BLAU} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={GRUEN} stopOpacity="0.3" />
          <stop offset="1" stopColor={GRUEN} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={`${id}j`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={SONNE} stopOpacity="0.95" />
          <stop offset="1" stopColor={SONNE} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={`${id}k`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Raster und Achsen */}
      <g {...an(aktiv, "tv05-blende", 0)}>
        {ax.ticks.map((v) => (
          <line key={v} x1={L} x2={R} y1={rd(y(v))} y2={rd(y(v))} stroke={v === 0 ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.07)"} strokeWidth={v === 0 ? 1.6 : 1.2} />
        ))}
        {stunden.map((t) => (
          <line key={t} x1={rd(x(t))} x2={rd(x(t))} y1={B} y2={B + 8} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
        ))}
      </g>
      {ax.ticks.map((v, i) => (
        <text key={v} x={L - 16} y={rd(y(v)) + 7} textAnchor="end" fontSize="21" fill="rgba(255,255,255,0.5)" style={DISPLAY} {...an(aktiv, "tv05-blende", 80 + i * 50)}>
          {zahl(v, 0)}
        </text>
      ))}
      {stunden.map((t, i) => (
        <text
          key={t}
          x={rd(x(t))}
          y={B + 42}
          textAnchor={i === 0 ? "start" : i === stunden.length - 1 ? "end" : "middle"}
          fontSize="21"
          fill="rgba(255,255,255,0.5)"
          style={DISPLAY}
          {...an(aktiv, "tv05-blende", 120 + i * 40)}
        >
          {uhr(t)}
        </text>
      ))}

      {/* Günstigste 3 Stunden: Band mit Lichtkante */}
      {fenster && (
        <g>
          <rect x={fx0} y={T} width={fw} height={B - T} fill={`url(#${id}f)`} {...an(aktiv, "tv05-band", 1500)} />
          <line x1={fx0} x2={fx0 + fw} y1={T} y2={T} stroke={GRUEN} strokeWidth="2.5" {...an(aktiv, "tv05-band", 1500)} />
          {aktiv && <rect x={fx0 - 30} y={T} width="30" height={B - T} fill={`url(#${id}k)`} className="tv05-kante" style={{ "--tv05-w": `${fw}px`, animationDelay: "1500ms" }} />}
        </g>
      )}

      {/* Flächen und Linien */}
      {tage2.map((s, i) => (
        <path key={`f${i}`} d={flaeche(s.pts)} fill={`url(#${s.grad})`} {...an(aktiv, "tv05-steigen", s.d + 450)} />
      ))}
      {morgen && (
        <g {...an(aktiv, "tv05-blende", dM)}>
          <line x1={rd(x(heute.ende))} x2={rd(x(heute.ende))} y1={T} y2={B} stroke="rgba(255,255,255,0.28)" strokeDasharray="4 7" strokeWidth="1.5" />
          <text x={rd(x(heute.ende)) - 12} y={B - 16} textAnchor="end" fontSize="21" fontWeight="700" fill="rgba(255,255,255,0.8)" style={DISPLAY}>
            heute
          </text>
          <text x={rd(x(heute.ende)) + 12} y={B - 16} fontSize="21" fontWeight="700" fill={BLAU} style={DISPLAY}>
            morgen
          </text>
        </g>
      )}
      {tage2.map((s, i) => {
        const d = pfad(s.pts);
        const zug = { animationDelay: `${s.d}ms`, animationDuration: `${s.dauer}ms` };
        return (
          <g key={`l${i}`}>
            {/* statischer Schein unter der Linie */}
            <path d={d} fill="none" stroke={s.halo} strokeOpacity="0.16" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round" pathLength="1" className={aktiv ? "tv05-linie" : undefined} style={aktiv ? zug : undefined} />
            <path d={d} fill="none" stroke={s.farbe} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" pathLength="1" className={aktiv ? "tv05-linie" : undefined} style={aktiv ? zug : undefined} />
            {aktiv && (
              <>
                {/* leuchtender Kopf während des Zeichnens */}
                <path d={d} fill="none" stroke={s.halo} strokeOpacity="0.5" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="tv05-kopf tv05-kopf-weit" style={{ ...zug, "--tv05-d": 0.016 }} />
                <path d={d} fill="none" stroke="#fff" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="tv05-kopf" style={zug} />
                {/* ruhige Lichtfunken entlang der Kurve */}
                <path d={d} fill="none" stroke={s.halo} strokeOpacity="0.5" strokeWidth="14" strokeLinecap="round" pathLength="1" className="tv05-glanz" style={{ animationDelay: `${2600 + i * 1500}ms, ${2600 + i * 1500}ms` }} />
                <path d={d} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" pathLength="1" className="tv05-glanz" style={{ animationDelay: `${2600 + i * 1500}ms, ${2600 + i * 1500}ms` }} />
              </>
            )}
          </g>
        );
      })}

      {/* Vergangene Zeit leicht abgedunkelt */}
      {jx != null && jx > L + 2 && <rect x={L} y={T - 4} width={jx - L} height={B - T + 4} fill={NAVY} fillOpacity="0.5" {...an(aktiv, "tv05-blende", 1900)} />}

      {fenster && (
        <g {...an(aktiv, "tv05-ein", 1900)}>
          <text x={fLabel.x} y={T + 32} textAnchor={fLabel.anker} fontSize="23" fontWeight="800" fill={GRUEN_HELL} style={DISPLAY}>
            Günstigste 3 Stunden
          </text>
          <text x={fLabel.x} y={T + 60} textAnchor={fLabel.anker} fontSize="21" fill="rgba(255,255,255,0.75)">
            {spanne(fenster.start, fenster.ende)}
          </text>
        </g>
      )}

      {/* Tageshoch */}
      {hochLabel && (
        <g {...an(aktiv, "tv05-ein", 1750)}>
          <circle cx={hx} cy={hy} r="6" fill={NAVY} stroke="#fff" strokeWidth="2.5" />
          <text x={hochX} y={hy - 20} textAnchor="middle" fontSize="21" fill="rgba(255,255,255,0.75)">
            Tageshoch <tspan fontWeight="800" fill="#fff" style={DISPLAY}>{ct(heute.max.eurMwh)}</tspan>
          </text>
        </g>
      )}

      {/* jetzt */}
      {jx != null && jy != null && (
        <g>
          <rect x={jx - 1.25} y={T - 16} width="2.5" height={B - T + 16} fill={`url(#${id}j)`} {...an(aktiv, "tv05-lot", 1850)} />
          {aktiv && (
            <>
              <circle cx={jx} cy={jy} r="9" fill="none" stroke={SONNE} strokeWidth="2" className="tv05-radar" style={{ animationDelay: "2500ms" }} />
              <circle cx={jx} cy={jy} r="9" fill="none" stroke={SONNE} strokeWidth="2" className="tv05-radar" style={{ animationDelay: "4000ms" }} />
            </>
          )}
          <circle cx={jx} cy={jy} r="10" fill={SONNE} stroke={NAVY} strokeWidth="3.5" {...an(aktiv, "tv05-punkt", 2250)} />
          <g {...an(aktiv, "tv05-ein", 2050)}>
            <rect x={rd(pillX - pillW / 2)} y={T - 60} width={rd(pillW)} height="44" rx="22" fill={SONNE} />
            <text x={pillX} y={T - 30} textAnchor="middle" fontSize="23" fontWeight="800" fill={NAVY} style={DISPLAY}>
              {pillText}
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}

/* ------------------------- Erzeugungsmix --------------------------- */

const TEILCHEN = [
  { y: 22, d: 9.5, v: -1.2, s: 0.22 },
  { y: 68, d: 12, v: -7.4, s: 0.18 },
  { y: 40, d: 10.5, v: -4.1, s: 0.26 },
  { y: 80, d: 14, v: -10.2, s: 0.16 },
  { y: 30, d: 11, v: -8.8, s: 0.2 },
  { y: 58, d: 13, v: -2.9, s: 0.24 },
  { y: 48, d: 8.5, v: -6.3, s: 0.18 },
];

function Ring({ id, aktiv, ee }) {
  const p = useFortschritt(aktiv && ee != null, 1400, 1500);
  const c = 110;
  const r = 86;
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2 - Math.PI / 2;
    const gross = i % 10 === 0;
    const r1 = 101;
    const r2 = gross ? 110 : 106;
    return { i, x1: rd(c + Math.cos(a) * r1), y1: rd(c + Math.sin(a) * r1), x2: rd(c + Math.cos(a) * r2), y2: rd(c + Math.sin(a) * r2), gross };
  });
  const wert = ee == null ? null : Math.max(0, Math.min(100, ee));
  const endA = wert == null ? 0 : (wert / 100) * Math.PI * 2 - Math.PI / 2;
  return (
    <svg viewBox="-4 -4 228 228" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}r`} x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor={GRUEN_TIEF} />
          <stop offset="1" stopColor={GRUEN_HELL} />
        </linearGradient>
      </defs>
      <g {...an(aktiv, "tv05-blende", 1200)}>
        {ticks.map((t) => (
          <line key={t.i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.gross ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.16)"} strokeWidth={t.gross ? 2.5 : 1.5} strokeLinecap="round" />
        ))}
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
      </g>
      {wert != null && (
        <>
          <circle
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={`url(#${id}r)`}
            strokeWidth="14"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray={`${wert} 200`}
            transform={`rotate(-90 ${c} ${c})`}
            className={aktiv ? "tv05-ring" : undefined}
            style={{ "--tv05-ee": wert, animationDelay: aktiv ? "1400ms" : undefined }}
          />
          <g {...an(aktiv, "tv05-punkt", 2800)}>
            <circle cx={rd(c + Math.cos(endA) * r)} cy={rd(c + Math.sin(endA) * r)} r="13" fill={GRUEN_HELL} fillOpacity="0.3" className={aktiv ? "tv05-atmen" : undefined} />
            <circle cx={rd(c + Math.cos(endA) * r)} cy={rd(c + Math.sin(endA) * r)} r="5" fill="#fff" />
          </g>
        </>
      )}
      <text x={c} y={c + 14} textAnchor="middle" fill="#fff" style={DISPLAY} fontWeight="800" {...an(aktiv, "tv05-blende", 1400)}>
        <tspan fontSize="58" letterSpacing="-2" fillOpacity={wert == null ? 0.3 : 1}>
          {wert == null ? "–" : Math.round(wert * p)}
        </tspan>
        {wert != null && (
          <tspan fontSize="30" dx="4" fill="rgba(255,255,255,0.65)">
            %
          </tspan>
        )}
      </text>
      <text x={c} y={c + 46} textAnchor="middle" fontSize="22" fill="rgba(255,255,255,0.65)" {...an(aktiv, "tv05-blende", 1600)}>
        erneuerbar
      </text>
    </svg>
  );
}

function Mix({ id, aktiv, e }) {
  const da = e.zeitpunkt != null;
  const last = e.lastMw || 0;
  const teile = [
    { l: "Wasserkraft", mw: e.wasserMw, farbe: BLAU, text: NAVY },
    { l: "Wind", mw: e.windMw, farbe: GRUEN_HELL, text: NAVY },
    { l: "Solar", mw: e.solarMw, farbe: SONNE, text: NAVY },
    { l: "Import", mw: Math.max(0, e.importMw || 0), farbe: "rgba(255,255,255,0.5)", text: NAVY },
  ].map((t) => ({ ...t, mw: Math.max(0, t.mw || 0) }));
  const summe = teile.reduce((s, t) => s + t.mw, 0);
  const uebrig = Math.max(0, last - summe);
  const gesamt = Math.max(last, summe) || 1;
  const balken = [...teile, { l: "Übrige Erzeugung", mw: uebrig, farbe: "rgba(255,255,255,0.16)", text: "#fff" }];
  let n = 0;

  return (
    <div className="mt-auto grid grid-cols-[10.4em_1fr] items-center gap-[2.4em]">
      <div className="h-[10.4em] w-[10.4em]">
        <Ring id={id} aktiv={aktiv} ee={da && e.eeAnteil != null ? e.eeAnteil : null} />
      </div>
      <div className="min-w-0">
        <div {...an(aktiv, "tv05-blende", 1200, "flex items-baseline justify-between")}>
          <p className="text-[1.2em] font-semibold text-white/75">Stromerzeugung in Österreich</p>
          {da && (
            <p className="text-[1.1em] text-white/55">
              Stand {uhr(e.zeitpunkt)} Uhr · Netzlast <span className="font-display font-extrabold text-white">{gw(last)} GW</span>
            </p>
          )}
        </div>
        <div className="relative mt-[0.7em] flex h-[2.6em] gap-[0.18em] overflow-hidden rounded-[0.5em] bg-white/[0.05]">
          {da &&
            balken.map((b) => {
              if (!(b.mw > 0)) return null;
              const anteil = (b.mw / gesamt) * 100;
              const k = n++;
              return (
                <div key={b.l} className="relative h-full min-w-0 overflow-hidden" style={{ flex: `${b.mw} 1 0` }}>
                  <div
                    className={`flex h-full w-full items-center pl-[0.6em] ${aktiv ? "tv05-segment" : ""}`}
                    style={{ background: b.farbe, animationDelay: aktiv ? `${1500 + k * 130}ms` : undefined }}
                  >
                    {anteil >= 9 && (
                      <span className="font-display text-[1.15em] font-extrabold tabular-nums" style={{ color: b.text }}>
                        {Math.round(anteil)} %
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          {da && aktiv && (
            <div className="tv05-blende pointer-events-none absolute inset-0" style={{ animationDelay: "2600ms" }}>
              <div className="tv05-sheen absolute inset-0" style={{ animationDelay: "2600ms" }}>
                <div className="absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
              {TEILCHEN.map((t, i) => (
                <div key={i} className="tv05-teilchen absolute inset-0" style={{ animationDuration: `${t.d}s`, animationDelay: `${t.v}s` }}>
                  <span
                    className="absolute left-0 block rounded-full"
                    style={{ top: `${t.y}%`, width: `${t.s * 9}em`, height: `${t.s * 0.6}em`, marginLeft: `-${t.s * 9}em`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75))" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <dl className="mt-[1em] flex justify-between gap-[1em]">
          {balken.map((b, i) => (
            <div key={b.l} className={aktiv ? "tv05-hoch" : undefined} style={{ animationDelay: aktiv ? `${1700 + i * 100}ms` : undefined }}>
              <dt className="flex items-center gap-[0.45em] whitespace-nowrap text-[1.1em] text-white/65">
                <span className="h-[0.75em] w-[0.75em] shrink-0 rounded-[0.18em]" style={{ background: b.farbe }} />
                {b.l}
              </dt>
              <dd className={`font-display text-[1.9em] font-extrabold tabular-nums leading-[1.2] ${da ? "" : "text-white/30"}`}>
                {da ? gw(b.mw) : "–"} <span className="text-[0.55em] text-white/55">GW</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
