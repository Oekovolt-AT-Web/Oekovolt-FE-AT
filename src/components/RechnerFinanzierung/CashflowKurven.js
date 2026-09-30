"use client";

import { useMemo, useState } from "react";
import { useBreite } from "@/components/Rechner/bausteine";
import { cn } from "@/components/ui/cn";
import { euro, euroKurz } from "@/lib/rechner/finanzierung";

/* ------------------------------------------------------------------
   Cashflow-Kurven aller Finanzierungsmodelle (eigenes SVG, ohne Paket).
   Ansicht „kumuliert“ (Linien) oder „je Jahr“ (Linien der Jahreswerte).
   Legende blendet Modelle ein/aus; Hover/Tippen zeigt alle Werte des Jahres.
   Unterscheidung über Farbe UND Strichmuster; Datentabelle für Screenreader.
   ------------------------------------------------------------------ */

function schoeneSchritte(min, max) {
  const spanne = Math.max(max - min, 1);
  const roh = spanne / 4;
  const basis = Math.pow(10, Math.floor(Math.log10(roh)));
  const schritt = [1, 2, 2.5, 5, 10].map((m) => m * basis).find((s) => s >= roh) || roh;
  const unten = Math.floor(min / schritt) * schritt;
  const oben = Math.ceil(max / schritt) * schritt;
  const ticks = [];
  for (let v = unten; v <= oben + 1e-6; v += schritt) ticks.push(Math.round(v * 1e6) / 1e6);
  return { unten, oben, ticks };
}

const r1 = (v) => Math.round(v * 10) / 10;

export default function CashflowKurven({ modelle, ansicht = "kumuliert", sichtbar, onSichtbar }) {
  const [ref, W0] = useBreite(720);
  const W = Math.max(W0, 280);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 250 : 300;
  const P = { l: schmal ? 50 : 66, r: 14, t: 16, b: 30 };
  const feld = ansicht === "kumuliert" ? "kumuliert" : "netto";
  const aktive = modelle.filter((m) => sichtbar[m.id]);
  const n = modelle[0]?.reihe.length || 21;

  const { unten, oben, ticks } = useMemo(() => {
    const werte = aktive.flatMap((m) => m.reihe.map((r) => r[feld]));
    return schoeneSchritte(Math.min(0, ...werte), Math.max(0, ...werte));
  }, [aktive, feld]);

  const x = (i) => r1(P.l + (i / (n - 1)) * (W - P.l - P.r));
  const y = (v) => r1(P.t + (H - P.t - P.b) * (1 - (v - unten) / (oben - unten || 1)));
  const pfad = (m) => m.reihe.map((r, i) => `${i ? "L" : "M"}${x(i)} ${y(r[feld])}`).join(" ");
  const labelAlle = schmal ? 5 : 2;
  const spalte = (W - P.l - P.r) / (n - 1);
  const titel = ansicht === "kumuliert" ? "Kumulierter Vorteil gegenüber ohne PV" : "Vorteil je Jahr gegenüber ohne PV";

  return (
    <div>
      <div ref={ref} className="relative px-2 pt-2 md:px-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height={H}
          className="block touch-pan-y select-none"
          role="img"
          aria-label={`${titel} über 20 Jahre für ${aktive.map((m) => m.name).join(", ")}. Werte in der folgenden Tabelle.`}
          onPointerLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "#151a24" : "#e8ebf0"} strokeWidth={t === 0 ? 1.25 : 1} />
              <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-500 text-[11.5px]" style={{ fontVariantNumeric: "tabular-nums" }}>
                {t === 0 ? "0 €" : euroKurz(t)}
              </text>
            </g>
          ))}
          {modelle[0]?.reihe.map((r, i) =>
            i % labelAlle === 0 ? (
              <text key={r.jahr} x={x(i)} y={H - 9} textAnchor="middle" className="fill-ink-500 text-[11.5px]">
                {i === 0 ? "Start" : `${r.jahr} J.`}
              </text>
            ) : null
          )}
          {hover != null && <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H - P.b} stroke="#97a0b0" strokeWidth="1" strokeDasharray="3 3" />}
          {aktive.map((m) => (
            <path
              key={m.id}
              d={pfad(m)}
              fill="none"
              stroke={m.farbe}
              strokeWidth={m.id === "eigenkapital" || m.id === "leasing" ? 2.75 : 2.5}
              strokeDasharray={m.strich || undefined}
              strokeLinejoin="round"
              strokeLinecap="round"
              className="motion-safe:transition-[d] motion-safe:duration-500"
            />
          ))}
          {hover != null &&
            aktive.map((m) => <circle key={m.id} cx={x(hover)} cy={y(m.reihe[hover][feld])} r="4.5" fill="#fff" stroke={m.farbe} strokeWidth="2.25" />)}
          {modelle[0]?.reihe.map((r, i) => (
            <rect
              key={r.jahr}
              x={Math.max(P.l, x(i) - spalte / 2)}
              y={P.t}
              width={spalte}
              height={H - P.t - P.b}
              fill="transparent"
              onPointerEnter={() => setHover(i)}
              onPointerDown={() => setHover(i)}
            />
          ))}
        </svg>
        {hover != null && aktive.length > 0 && (
          <div
            role="status"
            className="pointer-events-none absolute z-10 w-[230px] rounded-xl bg-ink-900 px-4 py-3 text-[12.5px] text-white shadow-xl"
            style={{ top: 12, ...(x(hover) > W / 2 ? { right: W - x(hover) + 16 } : { left: x(hover) + 16 }) }}
          >
            <p className="font-semibold">{hover === 0 ? "Start (Jahr 0)" : `Jahr ${hover}`} · {ansicht === "kumuliert" ? "kumuliert" : "im Jahr"}</p>
            {aktive.map((m) => (
              <p key={m.id} className="mt-0.5 flex items-center justify-between gap-3 text-white/75">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: m.farbe === "#37521e" ? "#8cba58" : m.farbe }} />
                  {m.kurz}
                </span>
                <span className="ov-num font-semibold text-white">{euro(m.reihe[hover][feld])}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Legende = Ein/Aus-Schalter je Modell */}
      <ul className="flex flex-wrap gap-2 px-5 pb-5 pt-2 md:px-6" aria-label="Modelle im Diagramm ein- oder ausblenden">
        {modelle.map((m) => {
          const an = !!sichtbar[m.id];
          return (
            <li key={m.id}>
              <button
                type="button"
                aria-pressed={an}
                onClick={() => onSichtbar({ ...sichtbar, [m.id]: !an })}
                className={cn(
                  "inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-[13px] font-semibold ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500",
                  an ? "bg-white text-ink-800 ring-ink-200" : "bg-ink-50 text-ink-500 ring-ink-200/70 line-through decoration-ink-400"
                )}
              >
                <svg aria-hidden="true" width="22" height="8" viewBox="0 0 22 8">
                  <line x1="1" x2="21" y1="4" y2="4" stroke={an ? m.farbe : "#97a0b0"} strokeWidth="2.5" strokeDasharray={m.strich || undefined} strokeLinecap="round" />
                </svg>
                {m.name}
              </button>
            </li>
          );
        })}
      </ul>

      <table className="sr-only">
        <caption>{titel} in Euro, je Modell</caption>
        <thead>
          <tr>
            <th scope="col">Jahr</th>
            {modelle.map((m) => (
              <th key={m.id} scope="col">{m.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {modelle[0]?.reihe.map((r, i) => (
            <tr key={r.jahr}>
              <th scope="row">{r.jahr}</th>
              {modelle.map((m) => (
                <td key={m.id}>{euro(m.reihe[i][feld])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
