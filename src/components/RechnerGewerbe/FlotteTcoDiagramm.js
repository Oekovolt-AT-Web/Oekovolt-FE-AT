"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";
import { Tooltip, useBreite } from "@/components/Rechner/bausteine";
import { useEinblenden, useReihenUebergang } from "./FlotteLadeBausteine";
import { fmt, fmtEur } from "@/lib/rechner/annahmen";

export const FARBEN = {
  verbrenner: "#97a0b0",
  e: "#669933",
  anschaffung: "#1f5aa1",
  kraftstoff: "#97a0b0",
  strom: "#669933",
  wartung: "#b2cbe9",
  maut: "#ffc53d",
  infra: "#aed083",
};

/** Kompakte Euro-Beschriftung für Achsen: 950 T€ · 1,2 Mio. € */
export const eurKurz = (v) => {
  const a = Math.abs(v);
  if (a >= 1e6) return `${fmt(v / 1e6, a >= 1e7 ? 0 : 1)} Mio. €`;
  if (a >= 1e4) return `${fmt(Math.round(v / 1000))} T€`;
  return fmtEur(v);
};

/** Achsbeschriftung ohne Währungszeichen (Einheit steht über der Achse) */
const achse = (v) => {
  const a = Math.abs(v);
  if (a >= 1e6) return `${fmt(v / 1e6, a % 1e6 === 0 ? 0 : 1)} Mio.`;
  if (a >= 1e3) return `${fmt(Math.round(v / 1000))} T`;
  return fmt(v);
};

function schoeneSkala(max) {
  const roh = max / 4;
  const p = Math.pow(10, Math.floor(Math.log10(Math.max(roh, 1))));
  const schritt = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= roh) || 10 * p;
  return { schritt, oben: Math.ceil(max / schritt) * schritt };
}

/** Tabs: Kostenverlauf (kumuliert) | Zusammensetzung */
export default function FlotteTcoDiagramm({ r }) {
  const [ansicht, setAnsicht] = useState("verlauf");
  return (
    <div className="mt-7 rounded-3xl ring-1 ring-ink-200/70">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 md:px-6">
        <div>
          <h3 className="font-display text-[17px] font-bold text-ink-900">Gesamtkosten über {r.jahre} Jahre</h3>
          <p className="text-[12.5px] text-ink-500">Anschaffung, Energie, Wartung{r.summe.v.maut > 0 ? ", Maut" : ""} – netto aus Sicht des Betriebs</p>
        </div>
        <div role="tablist" aria-label="Ansicht" className="inline-flex rounded-full bg-ink-100 p-1">
          {[
            ["verlauf", "Verlauf"],
            ["zusammensetzung", "Zusammensetzung"],
          ].map(([id, l]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={ansicht === id}
              onClick={() => setAnsicht(id)}
              className={cn(
                "h-9 rounded-full px-3.5 text-[13px] font-semibold transition-all duration-200",
                ansicht === id ? "bg-white text-ink-900 shadow-[0_2px_8px_-2px_rgba(21,26,36,0.18)]" : "text-ink-600 hover:text-ink-900"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div key={ansicht} className="motion-safe:animate-[ov-tab-ein_260ms_ease-out_both]">
        {ansicht === "verlauf" ? <Verlauf r={r} /> : <Zusammensetzung r={r} />}
      </div>
    </div>
  );
}

function Verlauf({ r }) {
  const [ref, W] = useBreite(720);
  const [sichtRef, fortschritt] = useEinblenden();
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 250 : 300;
  const P = { l: schmal ? 50 : 60, r: schmal ? 12 : 20, t: 30, b: 34 };
  const J = r.jahre;
  const n = J + 1;
  const flach = useReihenUebergang([...r.reihe.map((x) => x.v), ...r.reihe.map((x) => x.e)]);
  const v = flach.slice(0, n);
  const e = flach.slice(n, 2 * n);
  // Achse beginnt knapp unter dem kleinsten Wert – so werden die Unterschiede sichtbar
  const lo = Math.min(...v, ...e);
  const hi = Math.max(...v, ...e, 1);
  const { schritt } = schoeneSkala(Math.max(hi - lo, hi * 0.2));
  const unten = Math.max(0, Math.floor((lo - (hi - lo) * 0.12) / schritt) * schritt);
  const oben = Math.ceil(hi / schritt) * schritt;
  const x = (t) => Math.round((P.l + (t / J) * (W - P.l - P.r)) * 10) / 10;
  const y = (w) => Math.round((P.t + (1 - (w - unten) / (oben - unten || 1)) * (H - P.t - P.b)) * 10) / 10;
  const linie = (arr) => arr.map((w, t) => `${t ? "L" : "M"}${x(t)},${y(w)}`).join(" ");
  // Fläche zwischen den Linien (Vorteil grün, Nachteil sonnengelb)
  const zwischen = `${linie(v)} ${e
    .map((w, t) => [t, w])
    .reverse()
    .map(([t, w]) => `L${x(t)},${y(w)}`)
    .join(" ")} Z`;
  const ticks = Array.from({ length: Math.round((oben - unten) / schritt) + 1 }, (_, i) => unten + i * schritt);
  const jahrTicks = schmal ? [0, Math.round(J / 2), J] : Array.from({ length: n }, (_, i) => i);
  const be = r.breakEven;
  const vorteil = r.tcoErsparnis >= 0;
  const clipId = "ov-flotte-clip";
  // x-Position der Kostengleichheit: davor Mehrkosten, danach Vorteil der E-Flotte
  const teilung = be == null ? (vorteil ? P.l : W) : x(Math.min(be, J));

  const ausZeiger = (ev) => {
    const box = ev.currentTarget.getBoundingClientRect();
    const px = ((ev.clientX - box.left) / box.width) * W;
    return Math.max(0, Math.min(J, Math.round(((px - P.l) / (W - P.l - P.r)) * J)));
  };
  const h = hover != null ? r.reihe[hover] : null;

  return (
    <div
      ref={(el) => {
        ref.current = el;
        sichtRef.current = el;
      }}
      className="relative px-2 pb-4 pt-2 md:px-3"
    >
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block touch-pan-y select-none"
        role="img"
        aria-label={`Kumulierte Kosten nach ${J} Jahren: Verbrenner ${fmtEur(r.tcoV)}, E-Flotte ${fmtEur(r.tcoE)}.${be != null ? ` Kostengleichheit nach ${fmt(be, 1)} Jahren.` : ""}`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width={P.l + (W - P.l) * fortschritt} height={H} />
          </clipPath>
          <linearGradient id="ov-flotte-plus" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#669933" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#669933" stopOpacity="0.07" />
          </linearGradient>
          <linearGradient id="ov-flotte-minus" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f5a70f" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#f5a70f" stopOpacity="0.06" />
          </linearGradient>
          {/* Fläche vor der Kostengleichheit sonnengelb, danach grün */}
          <clipPath id="ov-flotte-vor">
            <rect x="0" y="0" width={teilung} height={H} />
          </clipPath>
          <clipPath id="ov-flotte-nach">
            <rect x={teilung} y="0" width={Math.max(W - teilung, 0)} height={H} />
          </clipPath>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} stroke="#eef0f4" />
            <text x={P.l - 8} y={y(t) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">
              {achse(t)}
            </text>
          </g>
        ))}
        <text x={P.l - 8} y={y(oben) - 12} textAnchor="end" className="fill-ink-500 text-[10.5px] font-semibold">
          €
        </text>
        {jahrTicks.map((t) => (
          <text key={t} x={x(t)} y={H - 10} textAnchor={t === 0 ? "start" : t === J ? "end" : "middle"} className="fill-ink-500 text-[11px]">
            {t === 0 ? "Start" : t === J ? `${t} Jahre` : t}
          </text>
        ))}

        <g clipPath={`url(#${clipId})`}>
          <path d={zwischen} fill="url(#ov-flotte-minus)" clipPath="url(#ov-flotte-vor)" />
          <path d={zwischen} fill="url(#ov-flotte-plus)" clipPath="url(#ov-flotte-nach)" />
          <path d={linie(v)} fill="none" stroke={FARBEN.verbrenner} strokeWidth="2.5" strokeDasharray="6 5" strokeLinejoin="round" />
          <path d={linie(e)} fill="none" stroke={FARBEN.e} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
          {v.map((w, t) => (
            <circle key={`v${t}`} cx={x(t)} cy={y(w)} r={hover === t ? 5 : 3} fill="#fff" stroke={FARBEN.verbrenner} strokeWidth="2" />
          ))}
          {e.map((w, t) => (
            <circle key={`e${t}`} cx={x(t)} cy={y(w)} r={hover === t ? 5.5 : 3.5} fill={FARBEN.e} stroke="#fff" strokeWidth="2" />
          ))}
        </g>

        {be != null && be > 0 && be <= J && fortschritt > 0.95 && (
          <g className="motion-safe:animate-[ov-tab-ein_400ms_ease-out_both]">
            <line x1={x(be)} x2={x(be)} y1={P.t} y2={H - P.b} stroke="#151a24" strokeDasharray="3 4" />
            <rect x={Math.min(Math.max(x(be) - 62, P.l), W - P.r - 124)} y={2} width="124" height="22" rx="11" fill="#03122b" />
            <text x={Math.min(Math.max(x(be), P.l + 62), W - P.r - 62)} y={17} textAnchor="middle" className="fill-white text-[11.5px] font-semibold">
              {`Kostengleich · ${fmt(be, 1)} J.`}
            </text>
          </g>
        )}

        {h && <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H - P.b} stroke="#c4cad5" />}

        <rect x={0} y={0} width={W} height={H} fill="transparent" onPointerMove={(ev) => setHover(ausZeiger(ev))} onPointerLeave={() => setHover(null)} onClick={(ev) => setHover(ausZeiger(ev))} />
      </svg>

      {h && (
        <Tooltip x={x(hover)} y={Math.max(y(Math.max(h.v, h.e)) - 20, 0)} breite={W}>
          <p className="font-semibold">{hover === 0 ? "Anschaffung" : `Nach ${hover} ${hover === 1 ? "Jahr" : "Jahren"}`}</p>
          <p className="text-white/70">
            Verbrenner <span className="ov-num font-semibold text-white">{fmtEur(h.v)}</span>
          </p>
          <p className="text-white/70">
            E-Flotte <span className="ov-num font-semibold text-white">{fmtEur(h.e)}</span>
          </p>
          <p className={cn("ov-num font-semibold", h.v - h.e >= 0 ? "text-ov-300" : "text-sun-300")}>
            {h.v - h.e >= 0 ? "Vorteil E " : "Mehrkosten E "}
            {fmtEur(Math.abs(h.v - h.e))}
          </p>
        </Tooltip>
      )}

      <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 px-3 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2">
          <span className="h-[3px] w-5 rounded-full bg-ov-500" aria-hidden="true" />
          E-Flotte (kumuliert)
        </li>
        <li className="flex items-center gap-2">
          <span className="w-5 border-t-2 border-dashed border-ink-400" aria-hidden="true" />
          Verbrenner (kumuliert)
        </li>
        <li className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-[3px] bg-ov-100" aria-hidden="true" />
          Vorteil E-Flotte
        </li>
        {(be == null ? !vorteil : be > 0) && (
          <li className="flex items-center gap-2">
            <span className="h-3 w-4 rounded-[3px] bg-sun-300/40" aria-hidden="true" />
            Mehrkosten E-Flotte
          </li>
        )}
      </ul>
    </div>
  );
}

function Zusammensetzung({ r }) {
  const J = r.jahre;
  const s = r.summe;
  const reihen = [
    {
      id: "v",
      label: "Verbrenner",
      teile: [
        ["anschaffung", "Anschaffung", s.v.anschaffung],
        ["kraftstoff", "Kraftstoff", s.v.energie * J],
        ["wartung", "Wartung", s.v.wartung * J],
        ["maut", "Maut", s.v.maut * J],
      ],
      abzug: 0,
      summe: r.tcoV,
    },
    {
      id: "e",
      label: "E-Flotte",
      teile: [
        ["anschaffung", "Anschaffung", s.el.anschaffung],
        ["infra", "Ladeinfrastruktur", s.el.infra || 0],
        ["strom", "Strom", s.el.energie * J],
        ["wartung", "Wartung", s.el.wartung * J],
        ["maut", "Maut", s.el.maut * J],
      ],
      abzug: s.el.ifb + s.el.foerderung,
      summe: r.tcoE,
    },
  ];
  const max = Math.max(...reihen.map((z) => z.teile.reduce((a, t) => a + t[2], 0)), 1);
  const legende = [
    ["anschaffung", "Anschaffung (Pkw-Verbrenner brutto)"],
    ["kraftstoff", "Kraftstoff"],
    ["strom", "Strom (Betrieb, PV, öffentlich)"],
    ["wartung", "Wartung"],
    ...(s.v.maut > 0 ? [["maut", "GO-Maut"]] : []),
    ...(s.el.infra > 0 ? [["infra", "Ladeinfrastruktur"]] : []),
  ];

  return (
    <div className="space-y-6 px-5 pb-5 pt-5 md:px-6">
      {reihen.map((z) => (
        <div key={z.id}>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-[14px] font-semibold text-ink-800">{z.label}</span>
            <span className="ov-num text-[14px] font-bold text-ink-900">
              {fmtEur(z.summe)}
              {z.abzug > 0 && <span className="ml-2 text-[12.5px] font-semibold text-ov-700">inkl. − {fmtEur(z.abzug)} IFB{s.el.foerderung > 0 ? " & Förderung" : ""}</span>}
            </span>
          </div>
          <div
            className="flex h-9 w-full overflow-hidden rounded-xl bg-ink-100"
            role="img"
            aria-label={`${z.label}: ${z.teile
              .filter((t) => t[2] > 0)
              .map((t) => `${t[1]} ${fmtEur(t[2])}`)
              .join(", ")}`}
          >
            {z.teile.map(([k, l, w]) => (
              <div
                key={k}
                title={`${l}: ${fmtEur(w)}`}
                className="h-full border-r-2 border-white last:border-r-0 motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out"
                style={{ width: `${(Math.max(0, w) / max) * 100}%`, background: FARBEN[k] }}
              />
            ))}
          </div>
        </div>
      ))}
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-ink-600">
        {legende.map(([k, l]) => (
          <li key={k} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px]" style={{ background: FARBEN[k] }} aria-hidden="true" />
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
