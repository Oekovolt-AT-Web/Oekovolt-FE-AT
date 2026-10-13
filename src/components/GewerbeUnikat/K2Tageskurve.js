// src/components/GewerbeUnikat/K2Tageskurve.js
//
// K2 · Dach-Labor: Klarhimmel-Tageskurve unter der Szene – REINE Komponente (Server und Client).
// Drei Lichtformen (Süd 35°, Süd 10°, Ost-West 15°) am gewählten Tag, normiert auf das Maximum von
// Süd 35°. Die Kurve(n) der Ertragsbasis der Dachart sind fett, darunter ihre Fläche (Trapezblech: Mittel
// aus Süd 10° und Ost-West 15° – beide fett), ein Cursor folgt der Uhrzeit.
// Die Zeichenfläche ist um den halben Regler-Griff (14 px) eingerückt: So steht der Cursor exakt über
// dem Griff des Uhrzeit-Reglers darunter. Linien mit vector-effect, Beschriftungen als HTML (scharf).

import { area, curveMonotoneX, line } from "d3-shape";
import { KURVEN, kurveBei } from "./K2Sonne.js";
import { ZEIT } from "./K2Modell.js";
import { FARBE } from "./_tokens.js";

const BREITE = 1000;
const HOEHE = 100;
const OBEN = 18; // Platz für Beschriftungen über dem Maximum

const xVon = (min) => ((min - ZEIT.min) / (ZEIT.max - ZEIT.min)) * BREITE;
const prozent = (min) => `${((min - ZEIT.min) / (ZEIT.max - ZEIT.min)) * 100}%`;

/** Beschriftungs-Stelle je Kurve, damit sich die drei Etiketten nicht stapeln. */
function etikettStelle(kurve, id) {
  const p = kurve.punkte;
  if (id === "sued") return p.reduce((b, q) => (q.sued > b.sued ? q : b), p[0]).min;
  const auf = kurve.auf ?? ZEIT.min;
  const unter = kurve.unter ?? ZEIT.max;
  const tag = unter - auf;
  if (id === "ostwest") return Math.round((auf + tag * 0.24) / 15) * 15;
  return Math.round((auf + tag * 0.74) / 15) * 15;
}

/**
 * @param {{ kurve: ReturnType<import("./K2Sonne.js").tageskurve>, aktiv: ("sued"|"flach"|"ostwest")[], zeitMin: number, ueber: boolean }} props
 */
export default function K2Tageskurve({ kurve, aktiv: aktivRoh, zeitMin, ueber }) {
  const aktiv = Array.isArray(aktivRoh) ? aktivRoh : [aktivRoh];
  const istAktiv = (id) => aktiv.includes(id);
  const mittel = (d) => aktiv.reduce((s, id) => s + d[id], 0) / aktiv.length;
  const yVon = (v) => OBEN + (1 - v / kurve.maxY) * (HOEHE - OBEN);
  const x = (d) => xVon(d.min);
  const pfade = Object.fromEntries(
    KURVEN.map((k) => [
      k.id,
      line()
        .x(x)
        .y((d) => yVon(d[k.id]))
        .curve(curveMonotoneX)
        .digits(1)(kurve.punkte),
    ]),
  );
  const flaeche = area()
    .x(x)
    .y0(HOEHE)
    .y1((d) => yVon(mittel(d)))
    .curve(curveMonotoneX)
    .digits(1)(kurve.punkte);
  const wert = aktiv.reduce((s, id) => s + kurveBei(kurve, id, zeitMin), 0) / aktiv.length;
  const yCursor = yVon(wert);
  const nachtL = kurve.auf != null ? Math.max(0, xVon(kurve.auf)) : 0;
  const nachtR = kurve.unter != null ? Math.min(BREITE, xVon(kurve.unter)) : BREITE;

  return (
    <div className="relative px-[14px]" aria-hidden="true">
      <div className="relative h-[100px]">
        <svg viewBox={`0 0 ${BREITE} ${HOEHE}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {nachtL > 0 && <rect x="0" y="0" width={nachtL} height={HOEHE} fill={FARBE.ink900} fillOpacity="0.035" />}
          {nachtR < BREITE && <rect x={nachtR} y="0" width={BREITE - nachtR} height={HOEHE} fill={FARBE.ink900} fillOpacity="0.035" />}
          {[6, 9, 12, 15, 18, 21].map((h) => (
            <line
              key={h}
              x1={xVon(h * 60)}
              x2={xVon(h * 60)}
              y1={OBEN - 6}
              y2={HOEHE}
              stroke={FARBE.ink900}
              strokeOpacity="0.08"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={flaeche} fill={FARBE.sun400} fillOpacity="0.38" />
          {KURVEN.filter((k) => !istAktiv(k.id)).map((k) => (
            <path key={k.id} d={pfade[k.id]} fill="none" stroke={FARBE.ink400} strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
          ))}
          {aktiv.map((id) => (
            <path key={id} d={pfade[id]} fill="none" stroke={FARBE.ink900} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          ))}
          <line x1="0" x2={BREITE} y1={HOEHE} y2={HOEHE} stroke={FARBE.ink900} strokeOpacity="0.18" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Direktbeschriftung an den Kurven */}
        {KURVEN.map((k) => {
          const min = etikettStelle(kurve, k.id);
          const v = kurveBei(kurve, k.id, min);
          // Ost-West links oben an der steigenden Flanke, Flach rechts oben an der fallenden, Süd über dem Gipfel
          const lage = k.id === "ostwest" ? "translate(calc(-100% - 6px), -100%)" : k.id === "flach" ? "translate(6px, -100%)" : "translate(-50%, calc(-100% - 4px))";
          return (
            <span
              key={k.id}
              className={`absolute whitespace-nowrap rounded bg-sand-50/85 px-1 py-0.5 text-[11.5px] leading-none ${istAktiv(k.id) ? "font-bold text-ink-900" : "font-medium text-ink-500"}`}
              style={{ left: prozent(min), top: `${yVon(v)}px`, transform: lage }}
            >
              {k.label}
            </span>
          );
        })}
        {/* Cursor zur Uhrzeit */}
        <span className="absolute bottom-0 top-0 w-px -translate-x-1/2 bg-ink-900/70" style={{ left: prozent(zeitMin) }} />
        {ueber && (
          <span
            className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy-950 shadow-[0_0_0_3px_#fff]"
            style={{ left: prozent(zeitMin), top: `${yCursor}px` }}
          />
        )}
      </div>
      {/* Zeitachse */}
      <div className="relative mt-1.5 h-4 text-[11.5px] text-ink-500">
        {[6, 9, 12, 15, 18, 21].map((h) => (
          <span key={h} className="ov-num absolute -translate-x-1/2" style={{ left: prozent(h * 60) }}>
            {String(h).padStart(2, "0")}:00
          </span>
        ))}
      </div>
    </div>
  );
}
