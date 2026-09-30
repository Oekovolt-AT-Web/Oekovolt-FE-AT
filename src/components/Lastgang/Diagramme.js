"use client";

import { useEffect, useRef, useState } from "react";
import { Tooltip, useBreite } from "@/components/Rechner/bausteine";
import { MONATE, MONATE_LANG, WOCHENTAGE, WOCHENTAGE_LANG, datum, prozent, uhrzeit, zahl } from "@/lib/lastgang/format";

/* ------------------------------------------------------------------
   SVG-Diagramme der Lastgang-Analyse (reine Darstellung, alle Werte
   kommen aus src/lib/lastgang/*). Farben wie in den Gewerbe-Rechnern.
   ------------------------------------------------------------------ */

export const FARBE = {
  werktag: "#669933",
  samstag: "#4a7cbd",
  sonntag: "#97a0b0",
  spitze: "#f5a70f",
  navy: "#03122b",
  raster: "#eef0f4",
  achse: "#6b7384",
};
const r1 = (v) => Math.round(v * 10) / 10;

/** „Schöne“ Achsenobergrenze und Schrittweite */
export function achse(max, teile = 4) {
  const roh = (max || 1) / teile;
  const p = Math.pow(10, Math.floor(Math.log10(roh)));
  const s = [1, 2, 2.5, 5, 10].map((f) => f * p).find((x) => x >= roh) || roh;
  return { schritt: s, max: Math.ceil((max || 1) / s) * s };
}

function Raster({ W, P, y, max, schritt, einheit }) {
  return (
    <>
      {Array.from({ length: Math.round(max / schritt) + 1 }, (_, i) => i * schritt).map((v) => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke={FARBE.raster} />
          <text x={P.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">
            {zahl(v, schritt < 1 ? 1 : 0)}
          </text>
        </g>
      ))}
      <text x={2} y={P.t - 9} className="fill-ink-500 text-[11px]">
        {einheit}
      </text>
    </>
  );
}

/** Legende unter einem Diagramm */
export function Legende({ eintraege }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 px-5 pb-5 text-[12.5px] text-ink-600 md:px-6">
      {eintraege.map((e) => (
        <li key={e.label} className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-2.5 w-5 rounded-full" style={{ background: e.farbe, opacity: e.blass ? 0.5 : 1 }} />
          {e.label}
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Tagesgang ---------------- */

export function Tagesgang({ tagesgang, sichtbar }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 240 : 290;
  const P = { l: schmal ? 44 : 52, r: 14, t: 24, b: 32 };
  const S = tagesgang.slots;
  const reihen = [
    { k: "werktag", label: "Werktag", farbe: FARBE.werktag, w: tagesgang.werktag },
    { k: "samstag", label: "Samstag", farbe: FARBE.samstag, w: tagesgang.samstag },
    { k: "sonntag", label: "Sonn-/Feiertag", farbe: FARBE.sonntag, w: tagesgang.sonntag },
  ].filter((r) => sichtbar.includes(r.k) && r.w.some(Number.isFinite));
  const maxWert = Math.max(1, ...reihen.flatMap((r) => r.w.filter(Number.isFinite)), ...(sichtbar.includes("max") ? tagesgang.werktagMax : []));
  const { schritt, max } = achse(maxWert * 1.05);
  const x = (q) => r1(P.l + (q / S) * (W - P.l - P.r));
  const y = (v) => r1(P.t + (1 - v / max) * (H - P.t - P.b));
  const linie = (w) =>
    w
      .map((v, q) => (Number.isFinite(v) ? `${q && Number.isFinite(w[q - 1]) ? "L" : "M"}${x(q + 0.5)},${y(v)}` : ""))
      .join(" ");
  const proStunde = S / 24;
  const ausZeiger = (e) => {
    const box = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * W;
    return Math.max(0, Math.min(S - 1, Math.floor(((px - P.l) / (W - P.l - P.r)) * S)));
  };
  const werktagMax = Math.max(...tagesgang.werktag.filter(Number.isFinite));
  const qMax = tagesgang.werktag.indexOf(werktagMax);
  return (
    <div ref={ref} className="relative px-2 pb-2 md:px-3">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block touch-pan-y select-none"
        role="img"
        aria-label={`Mittlerer Tagesgang: werktags höchstens ${zahl(werktagMax)} Kilowatt um ${uhrzeit(qMax, proStunde)} Uhr.`}
        onPointerMove={(e) => setHover(ausZeiger(e))}
        onPointerLeave={() => setHover(null)}
      >
        <Raster W={W} P={P} y={y} max={max} schritt={schritt} einheit="kW" />
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].filter((h) => !schmal || h % 6 === 0).map((h) => (
          <text key={h} x={x(h * proStunde)} y={H - P.b + 20} textAnchor={h === 24 ? "end" : h === 0 ? "start" : "middle"} className="fill-ink-500 text-[11px]">
            {h === 24 ? "24 Uhr" : h}
          </text>
        ))}
        {sichtbar.includes("max") && (
          <path d={linie(tagesgang.werktagMax)} fill="none" stroke={FARBE.spitze} strokeWidth="1.25" strokeDasharray="3 3" />
        )}
        {reihen.map((r) => (
          <path key={r.k} d={linie(r.w)} pathLength="1" fill="none" stroke={r.farbe} strokeWidth={r.k === "werktag" ? 2.75 : 2} strokeLinejoin="round" className="rg-zeichnen" />
        ))}
        {hover != null && (
          <g pointerEvents="none">
            <line x1={x(hover + 0.5)} x2={x(hover + 0.5)} y1={P.t} y2={H - P.b} stroke="#97a0b0" strokeDasharray="2 3" />
            {reihen.map((r) => Number.isFinite(r.w[hover]) && <circle key={r.k} cx={x(hover + 0.5)} cy={y(r.w[hover])} r="4" fill="#fff" stroke={r.farbe} strokeWidth="2" />)}
          </g>
        )}
      </svg>
      {hover != null && (
        <Tooltip x={x(hover + 0.5)} y={20} breite={W}>
          <p className="font-semibold">{uhrzeit(hover, proStunde)} Uhr</p>
          {reihen.map((r) => (
            <p key={r.k} className="flex justify-between gap-4">
              <span className="text-white/70">{r.label}</span>
              <span className="ov-num font-semibold">{Number.isFinite(r.w[hover]) ? `${zahl(r.w[hover])} kW` : "–"}</span>
            </p>
          ))}
          {sichtbar.includes("max") && (
            <p className="flex justify-between gap-4">
              <span className="text-white/70">Werktag max.</span>
              <span className="ov-num font-semibold">{zahl(tagesgang.werktagMax[hover])} kW</span>
            </p>
          )}
        </Tooltip>
      )}
    </div>
  );
}

/* ---------------- Wochentage ---------------- */

export function Wochentage({ wochentage }) {
  const [ref, W] = useBreite(520);
  const H = W < 520 ? 230 : 290;
  const P = { l: 52, r: 10, t: 26, b: 30 };
  const werte = wochentage.map((w) => w.kwhProTag);
  const { schritt, max } = achse(Math.max(1, ...werte.filter(Number.isFinite)) * 1.08);
  const y = (v) => r1(P.t + (1 - v / max) * (H - P.t - P.b));
  const bw = (W - P.l - P.r) / 7;
  return (
    <div ref={ref} className="px-2 pb-4 md:px-3">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-label={`Mittlerer Tagesverbrauch je Wochentag: ${wochentage.map((w) => `${WOCHENTAGE_LANG[w.tag]} ${zahl(w.kwhProTag)} kWh`).join(", ")}.`}>
        <Raster W={W} P={P} y={y} max={max} schritt={schritt} einheit="kWh/Tag" />
        {wochentage.map((w, i) => {
          const v = Number.isFinite(w.kwhProTag) ? w.kwhProTag : 0;
          const bx = P.l + i * bw + bw * 0.18;
          const breite = bw * 0.64;
          return (
            <g key={w.tag}>
              <rect x={r1(bx)} y={y(v)} width={r1(breite)} height={r1(y(0) - y(v))} rx="6" fill={i < 5 ? FARBE.werktag : i === 5 ? FARBE.samstag : FARBE.sonntag} className="rg-balken" />
              <text x={r1(bx + breite / 2)} y={H - P.b + 19} textAnchor="middle" className="fill-ink-600 text-[11.5px] font-semibold">
                {WOCHENTAGE[i]}
              </text>
              {W > 420 && (
                <text x={r1(bx + breite / 2)} y={y(v) - 6} textAnchor="middle" className="fill-ink-700 text-[10.5px]">
                  {v >= 10000 ? `${zahl(v / 1000, 1)} MWh` : zahl(v)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ---------------- Monate ---------------- */

export function Monate({ monate }) {
  const [ref, W] = useBreite(720);
  const [hover, setHover] = useState(null);
  const schmal = W < 520;
  const H = schmal ? 240 : 280;
  const P = { l: schmal ? 46 : 56, r: schmal ? 40 : 52, t: 26, b: 34 };
  const n = monate.length;
  const mwh = monate.map((m) => m.kwh / 1000);
  const { schritt, max } = achse(Math.max(0.1, ...mwh) * 1.08);
  const ak = achse(Math.max(1, ...monate.map((m) => m.spitzeKw)) * 1.08);
  const y = (v) => r1(P.t + (1 - v / max) * (H - P.t - P.b));
  const y2 = (v) => r1(P.t + (1 - v / ak.max) * (H - P.t - P.b));
  const bw = (W - P.l - P.r) / n;
  const mitJahr = new Set(monate.map((m) => m.jahr)).size > 1;
  const cx = (i) => r1(P.l + i * bw + bw / 2);
  return (
    <div ref={ref} className="relative px-2 pb-2 md:px-3">
      <svg
        width="100%"
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block select-none"
        role="img"
        aria-label={`Verbrauch und Spitzenlast je Monat, ${n} Monate. Höchste Monatsspitze ${zahl(Math.max(...monate.map((m) => m.spitzeKw)))} Kilowatt.`}
        onPointerLeave={() => setHover(null)}
      >
        <Raster W={W} P={P} y={y} max={max} schritt={schritt} einheit="MWh" />
        {Array.from({ length: Math.round(ak.max / ak.schritt) + 1 }, (_, i) => i * ak.schritt).map((v) => (
          <text key={v} x={W - P.r + 8} y={y2(v) + 4} className="fill-ink-500 text-[11px]" style={{ fill: "#b7791f" }}>
            {zahl(v)}
          </text>
        ))}
        <text x={W - P.r + 8} y={P.t - 9} className="text-[11px]" style={{ fill: "#b7791f" }}>
          kW
        </text>
        {monate.map((m, i) => {
          const v = m.kwh / 1000;
          const breite = bw * 0.62;
          return (
            <g key={`${m.jahr}-${m.monat}`} onPointerEnter={() => setHover(i)}>
              <rect x={r1(P.l + i * bw)} y={P.t} width={r1(bw)} height={H - P.t - P.b} fill="transparent" />
              <rect
                x={r1(cx(i) - breite / 2)}
                y={y(v)}
                width={r1(breite)}
                height={r1(y(0) - y(v))}
                rx="5"
                fill={FARBE.werktag}
                fillOpacity={m.abdeckung < 0.9 ? 0.45 : hover === i ? 1 : 0.85}
                className="rg-balken"
              />
              <text x={cx(i)} y={H - P.b + 19} textAnchor="middle" className="fill-ink-600 text-[11px]">
                {schmal ? MONATE[m.monat].slice(0, 1) : MONATE[m.monat]}
                {mitJahr && !schmal && (m.monat === 0 || i === 0) ? ` ${String(m.jahr).slice(2)}` : ""}
              </text>
            </g>
          );
        })}
        <path d={monate.map((m, i) => `${i ? "L" : "M"}${cx(i)},${y2(m.spitzeKw)}`).join(" ")} fill="none" stroke={FARBE.spitze} strokeWidth="2" pathLength="1" className="rg-zeichnen" />
        {monate.map((m, i) => (
          <circle key={i} cx={cx(i)} cy={y2(m.spitzeKw)} r={hover === i ? 5.5 : 4} fill="#fff" stroke={FARBE.spitze} strokeWidth="2.25" pointerEvents="none" />
        ))}
      </svg>
      {hover != null && (
        <Tooltip x={cx(hover)} y={20} breite={W}>
          <p className="font-semibold">
            {MONATE_LANG[monate[hover].monat]} {monate[hover].jahr}
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-white/70">Verbrauch</span>
            <span className="ov-num font-semibold">{zahl(monate[hover].kwh)} kWh</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-white/70">Spitze</span>
            <span className="ov-num font-semibold">{zahl(monate[hover].spitzeKw)} kW</span>
          </p>
          <p className="text-white/60">{datum(monate[hover].spitzeT)}</p>
          {monate[hover].abdeckung < 0.9 && <p className="text-sun-300">nur {prozent(monate[hover].abdeckung)} der Werte</p>}
        </Tooltip>
      )}
      <table className="sr-only">
        <caption>Verbrauch und Spitzenlast je Monat</caption>
        <thead>
          <tr>
            <th scope="col">Monat</th>
            <th scope="col">Verbrauch in kWh</th>
            <th scope="col">Spitze in kW</th>
          </tr>
        </thead>
        <tbody>
          {monate.map((m) => (
            <tr key={`${m.jahr}-${m.monat}`}>
              <th scope="row">
                {MONATE_LANG[m.monat]} {m.jahr}
              </th>
              <td>{zahl(m.kwh)}</td>
              <td>{zahl(m.spitzeKw)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Jahresdauerlinie mit Zielspitze ---------------- */

export function Dauerlinie({ dauerlinie, schwelle, stundenJahr }) {
  const [ref, W] = useBreite(640);
  const schmal = W < 520;
  const H = schmal ? 220 : 260;
  const P = { l: schmal ? 44 : 52, r: 14, t: 24, b: 34 };
  const spitze = dauerlinie[0].kw;
  const { schritt, max } = achse(spitze * 1.06);
  const x = (a) => r1(P.l + a * (W - P.l - P.r));
  const y = (v) => r1(P.t + (1 - v / max) * (H - P.t - P.b));
  const linie = dauerlinie.map((p, i) => `${i ? "L" : "M"}${x(p.anteil)},${y(p.kw)}`).join(" ");
  const flaeche = `${linie} L${x(1)},${y(0)} L${x(0)},${y(0)} Z`;
  // Fläche über der Schwelle
  const ueber = dauerlinie.filter((p) => p.kw > schwelle);
  const kappe = ueber.length
    ? `M${x(0)},${y(schwelle)} ${ueber.map((p) => `L${x(p.anteil)},${y(p.kw)}`).join(" ")} L${x(ueber[ueber.length - 1].anteil)},${y(schwelle)} Z`
    : "";
  const beschriftung = schmal ? 104 : 124;
  return (
    <div ref={ref} className="px-2 pb-2 md:px-3">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-label={`Jahresdauerlinie: Spitze ${zahl(spitze)} Kilowatt, Zielspitze ${zahl(schwelle)} Kilowatt.`}>
        <defs>
          <linearGradient id="lg-dauer" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={FARBE.werktag} stopOpacity="0.3" />
            <stop offset="100%" stopColor={FARBE.werktag} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <Raster W={W} P={P} y={y} max={max} schritt={schritt} einheit="kW" />
        {[0, 0.25, 0.5, 0.75, 1].map((a) => (
          <text key={a} x={x(a)} y={H - P.b + 20} textAnchor={a === 0 ? "start" : a === 1 ? "end" : "middle"} className="fill-ink-500 text-[11px]">
            {a === 1 ? `${zahl(stundenJahr)} h` : zahl(stundenJahr * a)}
          </text>
        ))}
        <path d={flaeche} fill="url(#lg-dauer)" />
        <path d={linie} fill="none" stroke={FARBE.werktag} strokeWidth="2.25" />
        {kappe && <path d={kappe} fill={FARBE.spitze} fillOpacity="0.55" className="rg-pfad" />}
        <line x1={P.l} x2={W - P.r} y1={y(schwelle)} y2={y(schwelle)} stroke={FARBE.navy} strokeWidth="1.25" strokeDasharray="6 5" />
        <g transform={`translate(${W - P.r - beschriftung}, ${Math.max(y(schwelle) - 24, 2)})`}>
          <rect width={beschriftung} height="20" rx="10" fill={FARBE.navy} />
          <text x={beschriftung / 2} y="14" textAnchor="middle" className="fill-white text-[11px] font-semibold">
            {`Ziel ${zahl(schwelle)} kW`}
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ---------------- PV: Eigenverbrauch und Autarkie über der Anlagengröße ---------------- */

export function PvKurve({ punkte, kwp, ziel }) {
  const [ref, W] = useBreite(640);
  const schmal = W < 520;
  const H = schmal ? 220 : 250;
  const P = { l: 46, r: 16, t: 20, b: 34 };
  const kwpMax = punkte[punkte.length - 1].kwp;
  const x = (k) => r1(P.l + (k / kwpMax) * (W - P.l - P.r));
  const y = (a) => r1(P.t + (1 - a) * (H - P.t - P.b));
  const ax = achse(kwpMax, schmal ? 3 : 5);
  const pfad = (key) => [{ kwp: 0, evQuote: 1, autarkie: 0 }, ...punkte].map((p, i) => `${i ? "L" : "M"}${x(p.kwp)},${y(p[key])}`).join(" ");
  // Wert an der gewählten Größe (linear interpoliert)
  const bei = (key) => {
    const liste = [{ kwp: 0, evQuote: 1, autarkie: 0 }, ...punkte];
    const j = liste.findIndex((p) => p.kwp >= kwp);
    if (j <= 0) return liste[liste.length - 1][key];
    const a = liste[j - 1];
    const b = liste[j];
    return a[key] + ((b[key] - a[key]) * (kwp - a.kwp)) / (b.kwp - a.kwp || 1);
  };
  return (
    <div ref={ref} className="px-2 pb-2 md:px-3">
      <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-label={`Eigenverbrauchsanteil und Autarkiegrad abhängig von der Anlagengröße; bei ${zahl(kwp)} kWp ${prozent(bei("evQuote"))} Eigenverbrauch und ${prozent(bei("autarkie"))} Autarkie.`}>
        {[0, 0.25, 0.5, 0.75, 1].map((a) => (
          <g key={a}>
            <line x1={P.l} x2={W - P.r} y1={y(a)} y2={y(a)} stroke={FARBE.raster} />
            <text x={P.l - 8} y={y(a) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">
              {zahl(a * 100)} %
            </text>
          </g>
        ))}
        {Array.from({ length: Math.floor(kwpMax / ax.schritt) + 1 }, (_, i) => i * ax.schritt).map((k) => (
          <text key={k} x={x(k)} y={H - P.b + 20} textAnchor={k === 0 ? "start" : "middle"} className="fill-ink-500 text-[11px]">
            {zahl(k)}
          </text>
        ))}
        <text x={W - P.r} y={H - P.b + 20} textAnchor="end" className="fill-ink-500 text-[11px]">
          kWp
        </text>
        <line x1={P.l} x2={W - P.r} y1={y(ziel)} y2={y(ziel)} stroke={FARBE.werktag} strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
        <path d={pfad("evQuote")} fill="none" stroke={FARBE.werktag} strokeWidth="2.75" />
        <path d={pfad("autarkie")} fill="none" stroke={FARBE.samstag} strokeWidth="2.75" />
        <line x1={x(kwp)} x2={x(kwp)} y1={P.t} y2={H - P.b} stroke={FARBE.navy} strokeWidth="1.25" strokeDasharray="5 4" />
        <circle cx={x(kwp)} cy={y(bei("evQuote"))} r="5" fill="#fff" stroke={FARBE.werktag} strokeWidth="2.5" />
        <circle cx={x(kwp)} cy={y(bei("autarkie"))} r="5" fill="#fff" stroke={FARBE.samstag} strokeWidth="2.5" />
      </svg>
    </div>
  );
}

/* ---------------- Heatmap (Canvas): jeder Tag eine Spalte, jede Viertelstunde eine Zeile ---------------- */

function farbe(anteil) {
  // hell (niedrig) → grün → gelb → orange (hoch)
  const stops = [
    [0, [244, 246, 249]],
    [0.25, [196, 222, 160]],
    [0.5, [102, 153, 51]],
    [0.75, [245, 199, 15]],
    [1, [224, 110, 20]],
  ];
  const a = Math.max(0, Math.min(1, anteil));
  for (let i = 1; i < stops.length; i++) {
    if (a <= stops[i][0]) {
      const [a0, c0] = stops[i - 1];
      const [a1, c1] = stops[i];
      const t = (a - a0) / (a1 - a0);
      return c0.map((c, k) => Math.round(c + (c1[k] - c) * t));
    }
  }
  return stops[stops.length - 1][1];
}

export function Heatmap({ heat }) {
  const canvasRef = useRef(null);
  const [ref, W] = useBreite(900);
  const H = W < 520 ? 200 : 260;
  const L = 40;
  const B = 24;
  const { tage, slots, werte, max } = heat;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const bw = W - L;
    const bh = H - B;
    c.width = Math.round(bw * dpr);
    c.height = Math.round(bh * dpr);
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(tage.length, slots);
    for (let d = 0; d < tage.length; d++) {
      for (let s = 0; s < slots; s++) {
        const v = werte[d * slots + s];
        const o = (s * tage.length + d) * 4;
        if (Number.isNaN(v)) {
          img.data[o + 3] = 0;
          continue;
        }
        const [r, g, b] = farbe(v / max);
        img.data[o] = r;
        img.data[o + 1] = g;
        img.data[o + 2] = b;
        img.data[o + 3] = 255;
      }
    }
    // Bild in Originalauflösung erzeugen, dann ohne Glättung skalieren
    const tmp = document.createElement("canvas");
    tmp.width = tage.length;
    tmp.height = slots;
    tmp.getContext("2d").putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(tmp, 0, 0, c.width, c.height);
  }, [W, H, tage, slots, werte, max]);

  // Monatsbeschriftungen
  const monatsStarts = tage
    .map((t, i) => ({ i, d: new Date(t) }))
    .filter(({ i, d }) => i === 0 || d.getUTCDate() === 1);
  return (
    <div ref={ref} className="px-4 pb-4 md:px-6">
      <div className="relative" style={{ height: H }}>
        <canvas
          ref={canvasRef}
          className="absolute rounded-lg"
          style={{ left: L, top: 0, width: W - L, height: H - B }}
          role="img"
          aria-label={`Lastgang-Heatmap: ${tage.length} Tage als Spalten, Uhrzeit von oben (0 Uhr) nach unten (24 Uhr); dunkle, orange Felder zeigen hohe Last bis ${zahl(max)} Kilowatt.`}
        />
        {[0, 6, 12, 18, 24].map((h) => (
          <span key={h} className="absolute text-[11px] text-ink-500" style={{ left: 0, top: Math.min(H - B - 8, ((H - B) * h) / 24 - 7), width: L - 8, textAlign: "right" }}>
            {h === 24 ? "24" : `${h}`}
            {h === 0 ? " Uhr" : ""}
          </span>
        ))}
        {monatsStarts
          .filter((_, k, arr) => W > 520 || k % 2 === 0 || arr.length < 7)
          .map(({ i, d }) => (
            <span key={i} className="absolute text-[11px] text-ink-500" style={{ left: L + ((W - L) * i) / tage.length, top: H - B + 6 }}>
              {MONATE[d.getUTCMonth()]}
            </span>
          ))}
      </div>
      <div className="mt-3 flex items-center gap-3 pl-10 text-[12px] text-ink-500">
        <span>0 kW</span>
        <span aria-hidden="true" className="h-2.5 w-40 rounded-full" style={{ background: "linear-gradient(90deg, rgb(244,246,249), rgb(196,222,160), rgb(102,153,51), rgb(245,199,15), rgb(224,110,20))" }} />
        <span>{zahl(max)} kW</span>
      </div>
    </div>
  );
}
