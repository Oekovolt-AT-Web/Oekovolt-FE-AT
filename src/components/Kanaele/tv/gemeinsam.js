// src/components/Kanaele/tv/gemeinsam.js
//
// Gemeinsame Farben, Helfer und Bausteine der Schauraum-Folien (/tv).
// Jede Folie liegt in einer eigenen Datei (FolieNN*.js) und darf eigene, mit ihrem Kürzel
// benannte Animationen mitbringen. Diese Datei nur für wirklich gemeinsame Dinge ändern.

export const GRUEN = "#8cba58";
export const GRUEN_HELL = "#aed083";
export const GRUEN_TIEF = "#669933";
export const SONNE = "#ffc53d";
export const BLAU = "#7fa7d6";
export const NAVY = "#03122b";
export const NAVY_TIEF = "#041d42";
export const MODUL = "#12408a";
export const DISPLAY = { fontFamily: "var(--font-display)" };

/** Koordinaten runden: Server und Browser rechnen Winkelfunktionen minimal verschieden (Hydration). */
export const rd = (v) => Math.round(v * 10) / 10;
export const kurzUrl = (u) => String(u || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/** Einblenden (Deckkraft) mit Verzögerung. */
export const auf = (aktiv, ms = 0) => ({ className: aktiv ? "tv-auf" : "opacity-0", style: aktiv ? { animationDelay: `${ms}ms` } : undefined });
/** Linie zeichnet sich (pathLength = 1). */
export const strich = (aktiv, ms = 0, dauer = 1400) => ({
  pathLength: 1,
  className: `tv-strich ${aktiv ? "tv-zeichnen" : ""}`,
  style: aktiv ? { animationDelay: `${ms}ms`, animationDuration: `${dauer}ms` } : undefined,
});

export function SvgIcon({ icon: Icon, x, y, s, farbe = "#fff", breite = 1.8 }) {
  return <Icon x={x - s / 2} y={y - s / 2} size={s} color={farbe} strokeWidth={breite} aria-hidden="true" />;
}

export function Modul({ x, y, w, h, spalten = 6, zeilen = 10, verlauf, rand = "rgba(255,255,255,0.22)", randBreite = 1 }) {
  let linien = "";
  for (let s = 1; s < spalten; s++) linien += `M${x + (s * w) / spalten} ${y}V${y + h}`;
  for (let z = 1; z < zeilen; z++) linien += `M${x} ${y + (z * h) / zeilen}H${x + w}`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={verlauf} />
      <path d={linien} stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
      <path d={`M${x} ${y + h * 0.55}L${x + w} ${y + h * 0.25}V${y + h * 0.4}L${x} ${y + h * 0.7}Z`} fill="#fff" opacity="0.06" />
      <rect x={x} y={y} width={w} height={h} rx="3" fill="none" stroke={rand} strokeWidth={randBreite} />
    </g>
  );
}

export function Sonne({ x, y, r = 24 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={SONNE} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return <line key={i} x1={rd(x + Math.cos(a) * (r + 10))} y1={rd(y + Math.sin(a) * (r + 10))} x2={rd(x + Math.cos(a) * (r + 22))} y2={rd(y + Math.sin(a) * (r + 22))} stroke={SONNE} strokeWidth="3" strokeLinecap="round" />;
      })}
    </g>
  );
}
