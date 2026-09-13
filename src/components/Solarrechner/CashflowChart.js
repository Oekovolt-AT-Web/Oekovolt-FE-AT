"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Kumulierter Cashflow ueber die EEG-Laufzeit als Balkendiagramm (SVG).
 * Grau = Investition noch nicht zurueckverdient, Gruen = im Plus.
 * Hover/Touch zeigt die Werte des Jahres; eine sr-only-Tabelle liefert
 * dieselben Daten fuer Screenreader.
 */

const FARBE_MINUS = "#b9c2d0";
const FARBE_MINUS_AKTIV = "#8793a6";
const FARBE_PLUS = "#7fae4a";
const FARBE_PLUS_AKTIV = "#4f7f26";

const eur = (n) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("de-DE")} €`;

function schoeneSchritte(min, max) {
  const spanne = Math.max(max - min, 1);
  const roh = spanne / 4;
  const basis = Math.pow(10, Math.floor(Math.log10(roh)));
  const schritt = [1, 2, 2.5, 5, 10].map((m) => m * basis).find((s) => s >= roh) || roh;
  const unten = Math.floor(min / schritt) * schritt;
  const oben = Math.ceil(max / schritt) * schritt;
  const ticks = [];
  for (let v = unten; v <= oben + 1e-6; v += schritt) ticks.push(v);
  return { unten, oben, ticks };
}

export default function CashflowChart({ cashflow = [], amortisationJahre }) {
  const [hover, setHover] = useState(null);
  const box = useRef(null);
  // Echte Pixelbreite verwenden, damit Beschriftungen auf dem Handy nicht
  // mitschrumpfen (viewBox = tatsaechliche Breite).
  const [W, setW] = useState(720);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(Math.round(e.contentRect.width), 280)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const H = W < 520 ? 230 : 280;
  const PAD_L = W < 520 ? 48 : 66;
  const PAD_R = 12;
  const PAD_T = 34;
  const PAD_B = 30;

  const { unten, oben, ticks } = useMemo(() => {
    const werte = cashflow.map((c) => c.kumuliert);
    return schoeneSchritte(Math.min(0, ...werte), Math.max(0, ...werte));
  }, [cashflow]);

  const n = cashflow.length || 1;
  const spalte = (W - PAD_L - PAD_R) / n;
  const bw = Math.max(spalte * 0.62, 4);
  const y = (v) => PAD_T + (H - PAD_T - PAD_B) * (1 - (v - unten) / (oben - unten || 1));
  const x = (i) => PAD_L + i * spalte + spalte / 2;

  const aktiv = hover != null ? cashflow[hover] : null;
  const amortX = amortisationJahre != null && amortisationJahre <= n - 1 ? x(0) + amortisationJahre * spalte : null;
  const amortLabel = amortisationJahre != null ? `${amortisationJahre.toFixed(1).replace(".", ",")} J.` : "";

  return (
    <div ref={box} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-pan-y select-none"
        role="img"
        aria-label={`Kumulierter Cashflow über ${n - 1} Jahre: Start ${eur(cashflow[0]?.kumuliert || 0)}, nach ${n - 1} Jahren ${eur(cashflow[n - 1]?.kumuliert || 0)}${amortisationJahre != null ? `, Amortisation nach ${amortLabel}` : ""}`}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD_L} x2={W - PAD_R} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#151a24" : "#e8ebf0"} strokeWidth={t === 0 ? 1.25 : 1} />
            <text x={PAD_L - 10} y={y(t) + 4} textAnchor="end" className="fill-ink-400 text-[12px]" style={{ fontVariantNumeric: "tabular-nums" }}>
              {t === 0 ? "0 €" : `${t < 0 ? "−" : ""}${(Math.abs(t) / 1000).toLocaleString("de-DE")} T€`}
            </text>
          </g>
        ))}

        {cashflow.map((c, i) => {
          const plus = c.kumuliert >= 0;
          const y0 = y(0);
          const y1 = y(c.kumuliert);
          const oberkante = Math.min(y0, y1);
          const hoehe = Math.max(Math.abs(y1 - y0), 1.5);
          const ist = hover === i;
          return (
            <g key={c.jahr}>
              <rect
                x={x(i) - bw / 2}
                y={oberkante}
                width={bw}
                height={hoehe}
                rx={Math.min(4, bw / 3)}
                fill={plus ? (ist ? FARBE_PLUS_AKTIV : FARBE_PLUS) : ist ? FARBE_MINUS_AKTIV : FARBE_MINUS}
                style={{ transition: "y 450ms cubic-bezier(.22,1,.36,1), height 450ms cubic-bezier(.22,1,.36,1), fill 200ms" }}
              />
              {(i % (W < 520 ? 10 : 5) === 0 || (W >= 520 && i === n - 1)) && (
                <text x={x(i)} y={H - 9} textAnchor="middle" className="fill-ink-400 text-[12px]">
                  {i === 0 ? "Start" : `${c.jahr} J.`}
                </text>
              )}
              {/* Trefferflaeche fuer Maus und Touch */}
              <rect
                x={PAD_L + i * spalte}
                y={PAD_T}
                width={spalte}
                height={H - PAD_T - PAD_B}
                fill="transparent"
                onPointerEnter={() => setHover(i)}
                onPointerDown={() => setHover(i)}
              />
            </g>
          );
        })}

        {amortX != null && (
          <g pointerEvents="none">
            <line x1={amortX} x2={amortX} y1={PAD_T} y2={H - PAD_B} stroke="#003473" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={amortX} cy={y(0)} r="5" fill="#fff" stroke="#003473" strokeWidth="2" />
          </g>
        )}
      </svg>

      {amortX != null && (
        <span
          className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy-700 px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-md"
          style={{ left: `${(amortX / W) * 100}%` }}
        >
          Amortisiert · {amortLabel}
        </span>
      )}

      {aktiv && (
        <div
          className="pointer-events-none absolute z-10 w-[210px] rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl"
          style={{
            left: `${Math.min(Math.max((x(hover) / W) * 100, 16), 84)}%`,
            top: "18%",
            transform: "translateX(-50%)",
          }}
        >
          <p className="font-semibold">{aktiv.jahr === 0 ? "Investition" : `Nach ${aktiv.jahr} ${aktiv.jahr === 1 ? "Jahr" : "Jahren"}`}</p>
          <p className="mt-1 flex justify-between gap-3 text-white/70">
            Stand <span className={`ov-num font-semibold ${aktiv.kumuliert >= 0 ? "text-ov-300" : "text-white"}`}>{eur(aktiv.kumuliert)}</span>
          </p>
          {aktiv.jahr > 0 && (
            <>
              <p className="flex justify-between gap-3 text-white/70">Ersparnis <span className="ov-num text-white">{eur(aktiv.ersparnis)}</span></p>
              <p className="flex justify-between gap-3 text-white/70">Einspeisung <span className="ov-num text-white">{eur(aktiv.einspeisung)}</span></p>
              <p className="flex justify-between gap-3 text-white/70">Betrieb <span className="ov-num text-white">{eur(-aktiv.betrieb)}</span></p>
            </>
          )}
        </div>
      )}

      <table className="sr-only">
        <caption>Kumulierter Cashflow je Jahr</caption>
        <thead>
          <tr>
            <th scope="col">Jahr</th>
            <th scope="col">Nettonutzen im Jahr</th>
            <th scope="col">Kumuliert</th>
          </tr>
        </thead>
        <tbody>
          {cashflow.map((c) => (
            <tr key={c.jahr}>
              <th scope="row">{c.jahr}</th>
              <td>{eur(c.netto)}</td>
              <td>{eur(c.kumuliert)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
