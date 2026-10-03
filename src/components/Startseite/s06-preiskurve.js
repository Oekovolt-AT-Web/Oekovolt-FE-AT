"use client";

// src/components/Startseite/s06-preiskurve.js
//
// Preiskurve „Börsenstrompreis im Tagesverlauf“ für die Startseite (S06).
// Pixelgenaues SVG (Breite gemessen, Höhe aus CSS → kein Layout-Sprung), Linie zeichnet sich mit
// leuchtendem Kopf, günstigste 3 Stunden als Lichtband, „jetzt“-Lot mit Puls, Scrubben per
// Maus/Finger/Pfeiltasten mit Preis-Fähnchen. Datenhilfen aus @/components/EnergieLive/berechnung.

import { useId } from "react";
import { achse, ct, spanne, uhr, zahl } from "@/components/EnergieLive/berechnung";
import { S06_FARBEN as F, rd } from "./s06-daten";
import { auftritt, useGroesse } from "./s06-bewegung";

const STUNDE = 3600000;
const klemmen = (v, a, b) => Math.min(Math.max(v, a), Math.max(a, b));

export default function S06Preiskurve({ tage, fenster, jetzt, hover, setHover }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [ref, { w, h }] = useGroesse({ w: 780, h: 372 });
  const { heute, morgen, aktuell, schrittMs } = tage;
  const huelle = "relative h-[264px] sm:h-[320px] lg:h-[372px]";

  if (!heute) {
    return (
      <div ref={ref} className={`${huelle} flex items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/[0.06]`}>
        <p className="text-[14px] text-white/60">Die Preisdaten werden gerade aktualisiert.</p>
      </div>
    );
  }

  const kette = [...heute.punkte, ...(morgen?.punkte || [])];
  const schmal = w < 560;
  const L = schmal ? 28 : 40;
  const R = w - 2;
  const T = 48;
  const B = h - 30;
  const t0 = heute.start;
  const t1 = morgen ? morgen.ende : heute.ende;
  const werte = kette.map((p) => p.eurMwh / 10);
  const ax = achse(Math.min(0, ...werte), Math.max(...werte), schmal ? 4 : 5);
  const x = (t) => L + ((t - t0) / (t1 - t0)) * (R - L);
  const y = (v) => T + (1 - (v - ax.von) / (ax.bis - ax.von || 1)) * (B - T);
  const px = (p) => rd(x(p.t + schrittMs / 2));
  const py = (p) => rd(y(p.eurMwh / 10));
  const pfad = (pts) => pts.map((p, i) => `${i ? "L" : "M"}${px(p)} ${py(p)}`).join("");
  const flaeche = (pts) => `${pfad(pts)}L${px(pts.at(-1))} ${rd(y(ax.von))}L${px(pts[0])} ${rd(y(ax.von))}Z`;
  const prozent = (v) => `${((v / w) * 100).toFixed(3)}%`;

  // Stundenachse: so dicht wie lesbar
  const pxProStunde = (R - L) / ((t1 - t0) / STUNDE);
  const schrittStd = [3, 6, 12, 24].find((s) => s * pxProStunde >= (schmal ? 52 : 66)) || 24;
  const stunden = [];
  for (let t = t0; t <= t1 + 1; t += schrittStd * STUNDE) stunden.push(t);

  // jetzt
  const jx = jetzt >= t0 && jetzt <= t1 ? rd(x(jetzt)) : null;
  // Punkt genau auf der gezeichneten Linie unter dem Lot (zwischen den Viertelstunden-Mitten interpoliert)
  const jpx = jx;
  let jy = null;
  if (aktuell && jx != null) {
    const mitte = (p) => p.t + schrittMs / 2;
    const k = kette.findIndex((p) => mitte(p) >= jetzt);
    if (k < 0) jy = py(kette.at(-1));
    else if (k === 0) jy = py(kette[0]);
    else {
      const a = kette[k - 1];
      const b = kette[k];
      const q = (jetzt - mitte(a)) / (mitte(b) - mitte(a));
      jy = rd(y((a.eurMwh + (b.eurMwh - a.eurMwh) * q) / 10));
    }
  }

  // Günstigste 3 Stunden (heute)
  const fx0 = fenster ? rd(x(fenster.start)) : null;
  const fw = fenster ? rd(x(fenster.ende) - x(fenster.start)) : 0;
  const lblW = schmal ? 112 : 156;
  const fLabel = fenster ? { x: klemmen(fx0 + fw / 2, L + lblW / 2, R - lblW / 2), anker: "middle" } : null;
  if (fLabel && jx != null && Math.abs(jx - fLabel.x) < lblW / 2 + 12) {
    const linksFrei = jx - 12 - lblW >= L;
    const rechtsFrei = jx + 12 + lblW <= R;
    const bandLinks = fx0 + fw / 2 < jx;
    Object.assign(fLabel, (bandLinks && linksFrei) || !rechtsFrei ? { x: jx - 12, anker: "end" } : { x: jx + 12, anker: "start" });
  }
  const fMitteLabel = fLabel ? (fLabel.anker === "middle" ? fLabel.x : fLabel.anker === "end" ? fLabel.x - lblW / 2 : fLabel.x + lblW / 2) : null;

  // Tageshoch – kleiner Hinweis, wenn Platz frei ist
  const hx = px(heute.max);
  const hy = py(heute.max);
  const hochFrei = !schmal && (fMitteLabel == null || Math.abs(hx - fMitteLabel) > lblW) && (jx == null || Math.abs(hx - jx) > 70);

  // Scrubben
  const hoverX = hover ? px(hover) : null;
  const hoverY = hover ? py(hover) : null;
  const hoverMorgen = hover && morgen && hover.t >= morgen.start;

  const punktBei = (clientX, el) => {
    const r = el.getBoundingClientRect();
    const lx = ((clientX - r.left) / r.width) * w;
    const t = t0 + ((lx - L) / (R - L)) * (t1 - t0);
    const i = kette.findIndex((p) => t < p.t + schrittMs);
    return kette[i < 0 ? kette.length - 1 : i];
  };
  const tasten = (ev) => {
    const basis = hover || aktuell || kette[0];
    let i = kette.findIndex((p) => p.t === basis.t);
    const schritt = ev.shiftKey ? 4 : 1;
    if (ev.key === "ArrowRight" || ev.key === "ArrowUp") i += schritt;
    else if (ev.key === "ArrowLeft" || ev.key === "ArrowDown") i -= schritt;
    else if (ev.key === "Home") i = 0;
    else if (ev.key === "End") i = kette.length - 1;
    else if (ev.key === "Escape") return setHover(null);
    else return undefined;
    ev.preventDefault();
    return setHover(kette[klemmen(i, 0, kette.length - 1)]);
  };
  const aktivIdx = hover ? kette.findIndex((p) => p.t === hover.t) : aktuell ? kette.findIndex((p) => p.t === aktuell.t) : 0;
  const wertText = (p) => `${morgen && p.t >= morgen.start ? "morgen " : ""}${uhr(p.t)} Uhr, ${ct(p.eurMwh)} Cent je Kilowattstunde`;

  // Choreografie (ms ab Eintritt)
  const dLinie = 200;
  const dauerHeute = morgen ? 1200 : 1500;
  const dMorgen = dLinie + dauerHeute;
  const linien = [{ pts: heute.punkte, farbe: "#ffffff", halo: F.gruen, grad: `${id}h`, d: dLinie, dauer: dauerHeute }];
  if (morgen) linien.push({ pts: morgen.punkte, farbe: F.blau, halo: F.blau, grad: `${id}m`, d: dMorgen, dauer: 900 });

  return (
    <div
      ref={ref}
      className={`${huelle} cursor-crosshair touch-pan-y select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ov-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-navy-950`}
      tabIndex={0}
      role="slider"
      aria-label="Börsenstrompreis im Tagesverlauf – Zeitpunkt mit den Pfeiltasten wählen"
      aria-valuemin={0}
      aria-valuemax={kette.length - 1}
      aria-valuenow={Math.max(0, aktivIdx)}
      aria-valuetext={hover ? wertText(hover) : aktuell ? `jetzt: ${wertText(aktuell)}` : undefined}
      onPointerMove={(ev) => setHover(punktBei(ev.clientX, ev.currentTarget))}
      onPointerDown={(ev) => setHover(punktBei(ev.clientX, ev.currentTarget))}
      onPointerLeave={() => setHover(null)}
      onPointerCancel={() => setHover(null)}
      onKeyDown={tasten}
      onBlur={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}h`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={F.gruen} stopOpacity="0.4" />
            <stop offset="0.7" stopColor={F.gruen} stopOpacity="0.07" />
            <stop offset="1" stopColor={F.gruen} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}m`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={F.blau} stopOpacity="0.3" />
            <stop offset="1" stopColor={F.blau} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}f`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={F.gruen} stopOpacity="0.28" />
            <stop offset="1" stopColor={F.gruen} stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id={`${id}j`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={F.sonne} stopOpacity="0.95" />
            <stop offset="1" stopColor={F.sonne} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id={`${id}k`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Raster und Achsen */}
        <g {...auftritt("s06-blende", 0)}>
          {ax.ticks.map((v) => (
            <line key={v} x1={L} x2={R} y1={rd(y(v))} y2={rd(y(v))} stroke={v === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.07)"} strokeWidth="1" />
          ))}
          {stunden.map((t) => (
            <line key={t} x1={rd(x(t))} x2={rd(x(t))} y1={B} y2={B + 5} stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
          ))}
        </g>
        {ax.ticks.map((v, i) => (
          <text key={v} x={L - 8} y={rd(y(v)) + 4} textAnchor="end" fontSize="11.5" fill="rgba(255,255,255,0.45)" className="ov-num" {...auftritt("s06-blende", 60 + i * 40)}>
            {zahl(v, 0)}
          </text>
        ))}
        {stunden.map((t, i) => (
          <text
            key={t}
            x={rd(x(t))}
            y={B + 21}
            textAnchor={i === 0 ? "start" : i === stunden.length - 1 && x(t) > R - 20 ? "end" : "middle"}
            fontSize="11.5"
            fill="rgba(255,255,255,0.45)"
            className="ov-num"
            {...auftritt("s06-blende", 100 + i * 35)}
          >
            {uhr(t)}
          </text>
        ))}

        {/* Günstigste 3 Stunden: Band mit Lichtkante */}
        {fenster && (
          <g>
            <rect x={fx0} y={T} width={fw} height={B - T} fill={`url(#${id}f)`} {...auftritt("s06-band", 1350)} />
            <line x1={fx0} x2={fx0 + fw} y1={T} y2={T} stroke={F.gruen} strokeWidth="2" {...auftritt("s06-band", 1350)} />
            <rect x={fx0 - 26} y={T} width="26" height={B - T} fill={`url(#${id}k)`} {...auftritt("s06-kante", 1350, "", { "--s06-w": `${fw}px` })} />
          </g>
        )}

        {/* Flächen und Linien */}
        {linien.map((s, i) => (
          <path key={`f${i}`} d={flaeche(s.pts)} fill={`url(#${s.grad})`} {...auftritt("s06-steigen", s.d + 420)} />
        ))}
        {morgen && (
          <g {...auftritt("s06-blende", dMorgen)}>
            <line x1={rd(x(heute.ende))} x2={rd(x(heute.ende))} y1={T - 6} y2={B} stroke="rgba(255,255,255,0.26)" strokeDasharray="3 5" />
            <text x={rd(x(heute.ende)) - 8} y={B - 10} textAnchor="end" fontSize="11.5" fontWeight="700" fill="rgba(255,255,255,0.7)">
              heute
            </text>
            <text x={rd(x(heute.ende)) + 8} y={B - 10} fontSize="11.5" fontWeight="700" fill={F.blau}>
              morgen
            </text>
          </g>
        )}
        {linien.map((s, i) => {
          const d = pfad(s.pts);
          const zug = { animationDuration: `${s.dauer}ms` };
          return (
            <g key={`l${i}`}>
              <path d={d} fill="none" stroke={s.halo} strokeOpacity="0.16" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" pathLength="1" {...auftritt("s06-linie", s.d, "", zug)} />
              <path d={d} fill="none" stroke={s.farbe} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" pathLength="1" {...auftritt("s06-linie", s.d, "", zug)} />
              {/* leuchtender Kopf während des Zeichnens */}
              <path d={d} fill="none" stroke={s.halo} strokeOpacity="0.55" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" pathLength="1" {...auftritt("s06-kopf s06-kopf-weit", s.d, "", zug)} />
              <path d={d} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength="1" {...auftritt("s06-kopf", s.d, "", zug)} />
            </g>
          );
        })}

        {/* Vergangene Zeit leicht abgedunkelt */}
        {jx != null && jx > L + 2 && <rect x={L} y={T - 6} width={rd(jx - L)} height={B - T + 6} fill={F.navy} fillOpacity="0.5" {...auftritt("s06-blende", 1700)} />}

        {fenster && (
          <g {...auftritt("s06-hoch", 1750)}>
            <text x={fLabel.x} y={T + 19} textAnchor={fLabel.anker} fontSize={schmal ? 11.5 : 12.5} fontWeight="800" fill={F.gruenHell} style={{ fontFamily: "var(--font-display)" }}>
              {schmal ? "Günstigste 3 h" : "Günstigste 3 Stunden"}
            </text>
            <text x={fLabel.x} y={T + 35} textAnchor={fLabel.anker} fontSize={schmal ? 11 : 12} fill="rgba(255,255,255,0.72)" className="ov-num">
              {spanne(fenster.start, fenster.ende)}
            </text>
          </g>
        )}

        {hochFrei && (
          <g {...auftritt("s06-hoch", 1650)}>
            <circle cx={hx} cy={hy} r="4" fill={F.navy} stroke="#fff" strokeWidth="1.75" />
            <text x={klemmen(hx, L + 60, R - 60)} y={hy - 11} textAnchor="middle" fontSize="11.5" fill="rgba(255,255,255,0.7)">
              Tageshoch{" "}
              <tspan fontWeight="800" fill="#fff" className="ov-num">
                {ct(heute.max.eurMwh)}
              </tspan>
            </text>
          </g>
        )}

        {/* jetzt */}
        {jx != null && jy != null && (
          <g className={hover ? "opacity-40 transition-opacity" : "transition-opacity"}>
            <rect x={rd(jx - 1)} y={T - 14} width="2" height={B - T + 14} fill={`url(#${id}j)`} {...auftritt("s06-lot", 1700)} />
            <circle cx={jpx} cy={jy} r="7" fill="none" stroke={F.sonne} strokeWidth="1.5" className="s06-amb s06-radar" style={{ animationDelay: "2500ms" }} />
            <circle cx={jpx} cy={jy} r="7" fill="none" stroke={F.sonne} strokeWidth="1.5" className="s06-amb s06-radar" style={{ animationDelay: "4100ms" }} />
            <circle cx={jpx} cy={jy} r="6.5" fill={F.sonne} stroke={F.navy} strokeWidth="2.5" {...auftritt("s06-punkt", 2050)} />
          </g>
        )}

        {/* Scrubben */}
        {hover && (
          <g>
            <line x1={hoverX} x2={hoverX} y1={T - 14} y2={B} stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <circle cx={hoverX} cy={hoverY} r="11" fill="#fff" fillOpacity="0.14" />
            <circle cx={hoverX} cy={hoverY} r="5.5" fill="#fff" stroke={F.navy} strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {/* Fähnchen (HTML – Breite passt sich dem Text an) */}
      {jx != null && aktuell && (
        <div
          className={`pointer-events-none absolute top-0 -translate-x-1/2 transition-opacity duration-200 ${hover ? "opacity-0" : "opacity-100"}`}
          style={{ left: prozent(klemmen(jx, L + 52, R - 52)) }}
        >
          <span {...auftritt("s06-hoch", 1900, "block whitespace-nowrap rounded-full bg-sun-400 px-3 py-1.5 font-display text-[12.5px] font-extrabold leading-none text-navy-950 shadow-[0_6px_20px_-6px_rgba(255,197,61,0.7)]")}>
            jetzt <span className="ov-num">{ct(aktuell.eurMwh)}</span> ct
          </span>
        </div>
      )}
      {hover && (
        <div className="pointer-events-none absolute top-0 z-10 -translate-x-1/2" style={{ left: prozent(klemmen(hoverX, L + 78, R - 78)) }}>
          <span className="flex items-baseline gap-2 whitespace-nowrap rounded-full bg-white px-3 py-1.5 leading-none text-navy-950 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
            <span className="ov-num text-[12px] font-medium text-ink-500">
              {hoverMorgen ? "morgen " : ""}
              {uhr(hover.t)}–{uhr(hover.t + schrittMs)}
            </span>
            <span className="ov-num font-display text-[13px] font-extrabold">{ct(hover.eurMwh)} ct</span>
          </span>
        </div>
      )}
    </div>
  );
}
