// src/components/Startseite/s04-stil.js
//
// Gemeinsame Aufbau-Bausteine der Abschnitte Mannschaft, Rechner & Tools und Warum Ökovolt.
// Gesteuert von <S04Buehne/> (Klassen s04-bereit → s04-an). Verzögerung je Element über
// die CSS-Variable --s04-d. Animiert werden nur transform, opacity und stroke-dashoffset.
// Übergänge sind nur unter `.s04-an` aktiv – das „Scharfschalten“ (s04-bereit) springt ohne
// Bewegung in den Ausgangszustand.

export const S04_BASIS = `
.s04-wachsen{transform-box:fill-box;transform-origin:50% 100%}
.s04-skx{transform-box:fill-box;transform-origin:0 50%}
.s04-sky{transform-box:fill-box;transform-origin:50% 0}
.s04-pop{transform-box:fill-box;transform-origin:50% 50%}
.s04-bereit:not(.s04-an) .s04-auf{opacity:0}
.s04-bereit:not(.s04-an) .s04-hoch{opacity:0;transform:translate3d(0,22px,0)}
.s04-bereit:not(.s04-an) .s04-links{opacity:0;transform:translate3d(-22px,0,0)}
.s04-bereit:not(.s04-an) .s04-zeile{transform:translate3d(0,108%,0)}
.s04-bereit:not(.s04-an) .s04-zeichne{stroke-dashoffset:1}
.s04-bereit:not(.s04-an) .s04-wachsen{transform:scaleY(.06)}
.s04-bereit:not(.s04-an) .s04-skx{transform:scaleX(0)}
.s04-bereit:not(.s04-an) .s04-sky{transform:scaleY(0)}
.s04-bereit:not(.s04-an) .s04-pop{opacity:0;transform:scale(.35)}
.s04-bereit:not(.s04-an) .s04-zoom{transform:scale(1.12)}
.s04-zeichne{stroke-dasharray:1}
.s04-an .s04-auf{transition:opacity .8s cubic-bezier(.22,1,.36,1) var(--s04-d,0ms)}
.s04-an .s04-hoch,.s04-an .s04-links{transition:opacity .9s cubic-bezier(.22,1,.36,1) var(--s04-d,0ms),transform .9s cubic-bezier(.22,1,.36,1) var(--s04-d,0ms)}
.s04-an .s04-zeile{transition:transform 1s cubic-bezier(.16,1,.3,1) var(--s04-d,0ms)}
.s04-an .s04-zeichne{transition:stroke-dashoffset var(--s04-t,1.6s) cubic-bezier(.65,0,.35,1) var(--s04-d,0ms)}
.s04-an .s04-wachsen{transition:transform 1.1s cubic-bezier(.22,1,.36,1) var(--s04-d,0ms)}
.s04-an .s04-skx,.s04-an .s04-sky{transition:transform var(--s04-t,1.4s) cubic-bezier(.65,0,.35,1) var(--s04-d,0ms)}
.s04-an .s04-pop{transition:opacity .5s ease-out var(--s04-d,0ms),transform .7s cubic-bezier(.34,1.56,.64,1) var(--s04-d,0ms)}
.s04-an .s04-zoom{transition:transform 2.2s cubic-bezier(.16,1,.3,1) var(--s04-d,0ms)}
@media (prefers-reduced-motion:reduce){
  .s04-bereit:not(.s04-an) *{transition:none!important}
}
`;

/** Verzögerung als Style-Objekt (ms). */
export const d = (ms, extra) => ({ "--s04-d": `${ms}ms`, ...extra });

/** Koordinaten runden (Hydration-sicher). */
export const rd = (v) => Math.round(v * 10) / 10;

/** Weiche Kurve (Catmull-Rom → kubische Bézier) durch Punkte [[x,y], …]. */
export function glatt(p, k = 1 / 6) {
  let pfad = `M${rd(p[0][0])},${rd(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    pfad += ` C${rd(p1[0] + (p2[0] - p0[0]) * k)},${rd(p1[1] + (p2[1] - p0[1]) * k)} ${rd(p2[0] - (p3[0] - p1[0]) * k)},${rd(p2[1] - (p3[1] - p1[1]) * k)} ${rd(p2[0])},${rd(p2[1])}`;
  }
  return pfad;
}
