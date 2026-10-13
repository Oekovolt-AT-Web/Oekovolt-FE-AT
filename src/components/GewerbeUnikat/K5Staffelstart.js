// src/components/GewerbeUnikat/K5Staffelstart.js
//
// K5 · Staffelstart (schematisch) – REINE Komponente (ohne Hooks): drei Verbraucher mit Anlaufspitze
// × 1,5 für eine Viertelstunde, „gleichzeitig um 06:00“ oder „gestaffelt 06:00/06:15/06:30“. Zeigt, dass
// sich die Summenspitze auch ohne Speicher senken lässt. Server (Platzhalter) und Client (motion über `k`).
// Werte sind schematische Beispielwerte (KENNZEICHNUNG.schematisch) – keine Messung.

import { scaleBand, scaleLinear } from "d3-scale";
import { FARBE, KENNZEICHNUNG, zahl } from "./_tokens";
import { Kennzeichnung } from "./_bausteine";
import { ani, STATISCH } from "./K5Grafik";
import { STAFFEL_SLOTS, STAFFEL_VERBRAUCHER } from "./K5Rechnen";

const FARBEN = [FARBE.navy400, FARBE.navy300, FARBE.navy200];
const r1 = (n) => Math.round(n * 10) / 10;

export const STAFFEL_OPTIONEN = [
  { id: "gleichzeitig", label: "gleichzeitig" },
  { id: "gestaffelt", label: "gestaffelt" },
];

/** Gestapelte Viertelstunden 05:45–07:00 mit Summenspitze. */
export function StaffelBild({ v, k = STATISCH, breite, mobil }) {
  const hoehe = mobil ? 168 : 190;
  const rechts = mobil ? 8 : 96;
  const links = 4;
  const oben = 26;
  const unten = 22;
  const x = scaleBand().domain(STAFFEL_SLOTS).range([links, breite - rechts]).paddingInner(0.3).paddingOuter(0.1);
  const y = scaleLinear().domain([0, 220]).range([hoehe - unten, oben]);
  const bw = x.bandwidth();
  const R = k.Rect;
  const L = k.Line;
  const { spalten, spitze } = v.staffel;
  const andere = v.staffelAndere.spitze;
  const fs = mobil ? 9.5 : 10.5;
  const letzte = spalten[spalten.length - 1];
  const ys = r1(y(spitze));
  return (
    <svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`} className="block h-auto max-w-full overflow-visible" aria-hidden="true" focusable="false">
      <line x1={links} x2={breite - rechts} y1={y(0)} y2={y(0)} stroke="#fff" strokeOpacity={0.22} />
      {v.staffelModus === "gestaffelt" && (
        <g>
          <line x1={links} x2={breite - rechts} y1={r1(y(andere))} y2={r1(y(andere))} stroke="#fff" strokeOpacity={0.25} strokeDasharray="2 4" />
          <text x={links} y={r1(y(andere)) - 6} fontSize={fs} fill="#fff" fillOpacity={0.5} className="ov-num">
            gleichzeitig {zahl(andere, 1)} kW
          </text>
        </g>
      )}
      {spalten.map((sp, s) => {
        const sx = r1(x(STAFFEL_SLOTS[s]));
        let basis = 0;
        const bloecke = sp.basis.map((kw, j) => {
          const y1 = y(basis + kw);
          const y0 = y(basis);
          basis += kw;
          return <R key={`b-${s}-${j}`} {...ani(k, { y: r1(y1), height: Math.max(0, r1(y0 - y1)) })} x={sx} width={r1(bw)} fill={FARBEN[j]} fillOpacity={0.92} />;
        });
        const anlauf = sp.anlauf.reduce((a, b) => a + b, 0);
        const ya1 = y(basis + anlauf);
        const ya0 = y(basis);
        return (
          <g key={`s-${s}`}>
            {bloecke}
            <R {...ani(k, { y: r1(ya1), height: Math.max(0, r1(ya0 - ya1)) })} x={sx} width={r1(bw)} fill={FARBE.sun500} />
            <text x={r1(sx + bw / 2)} y={hoehe - 6} textAnchor="middle" fontSize={fs} fill="#fff" fillOpacity={0.5} className="ov-num">
              {STAFFEL_SLOTS[s]}
            </text>
          </g>
        );
      })}
      {/* Summenspitze */}
      <L {...ani(k, { y1: ys, y2: ys })} x1={links} x2={breite - rechts} stroke="#fff" strokeOpacity={0.9} strokeWidth={1.25} strokeDasharray="5 3" />
      <text x={links} y={ys - 6} fontSize={fs + 0.5} fontWeight="700" fill="#fff" className="ov-num">
        Summenspitze <tspan fill={FARBE.sun500}>{zahl(spitze, 1)} kW</tspan>
      </text>
      {/* Direktbeschriftung der Verbraucher an der letzten Spalte */}
      {!mobil &&
        STAFFEL_VERBRAUCHER.map((vb, j) => {
          const unter = letzte.basis.slice(0, j).reduce((a, b) => a + b, 0);
          const mitte = y(unter + vb.kw / 2);
          const sx = x(STAFFEL_SLOTS[STAFFEL_SLOTS.length - 1]) + bw;
          return (
            <text key={`v-${vb.id}`} x={r1(sx + 8)} y={r1(mitte)} dy="0.34em" fontSize={fs - 0.5} fill="#fff" fillOpacity={0.6}>
              {vb.label} {vb.kw}
            </text>
          );
        })}
    </svg>
  );
}

/**
 * Staffelstart-Feld: Text, Umschalter (Segment) und Grafik. Bis lg einspaltig – die Grafik behält ihre
 * Pixelbreite (500 px, mobil die gemessene Spaltenbreite), damit die Beschriftung nicht schrumpft.
 */
export default function K5Staffelstart({ v, k, setModus, mobil, breite, statisch = false }) {
  const S = k.Segment;
  const delta = v.staffelAndere.spitze - v.staffel.spitze;
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300 max-lg:hidden">Ohne Speicher</p>
        <h3 className="mt-2 font-display max-lg:sr-only text-[20px] font-extrabold leading-snug tracking-[-0.02em] text-white md:text-[23px]">Anläufe staffeln senkt die Spitze</h3>
        <p className="max-w-[52ch] text-[14.5px] leading-relaxed text-white/68 lg:mt-2 md:text-[15px]">
          Kompressor 45 kW, Presse 60 kW, Lüftung 30 kW – jede Maschine zieht beim Anlauf eine Viertelstunde lang das 1,5-Fache. Starten alle um 06:00, addieren sich die Anläufe – gestaffelt um je eine Viertelstunde (06:00, 06:15, 06:30) nicht.
        </p>
        <S name="k5-staffel" wert={v.staffelModus} setWert={setModus} optionen={STAFFEL_OPTIONEN} dunkel klein className="mt-4" label="Maschinenstart" />
      </div>
      <div className="min-w-0">
        {statisch ? (
          <StaffelBild v={v} k={k} breite={500} mobil={false} />
        ) : (
          <StaffelBild v={v} k={k} breite={mobil ? Math.max(260, Math.min(420, breite || 330)) : 500} mobil={mobil} />
        )}
        <ul aria-hidden="true" className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-white/60 md:hidden">
          {STAFFEL_VERBRAUCHER.map((vb, j) => (
            <li key={vb.id} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: FARBEN[j] }} />
              {vb.label}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-sun-500" />
            Anlauf
          </li>
        </ul>
        <p className="mt-2 text-[13px] leading-snug text-white/60">
          {v.staffelModus === "gestaffelt" ? (
            <>
              Gestaffelt: Summenspitze <span className="ov-num font-semibold text-white">{zahl(v.staffel.spitze, 1)} kW</span> statt {zahl(v.staffelAndere.spitze, 1)} kW –{" "}
              <span className="ov-num font-semibold text-white">−{zahl(delta < 0 ? -delta : delta, 1)} kW</span> ohne Speicher.
            </>
          ) : (
            <>
              Gleichzeitig: Summenspitze <span className="ov-num font-semibold text-white">{zahl(v.staffel.spitze, 1)} kW</span>. Schalten Sie auf „gestaffelt“.
            </>
          )}
        </p>
        <Kennzeichnung dunkel className="mt-2">
          {KENNZEICHNUNG.schematisch} · schematische Beispielwerte
        </Kennzeichnung>
      </div>
    </div>
  );
}
