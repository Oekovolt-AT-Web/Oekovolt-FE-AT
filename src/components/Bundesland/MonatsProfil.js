// Monatsprofil des Landesmittels (Süd, 35°) als SVG – Server-Komponente.
// Werte = Mittel der PVGIS-Monatswerte aller Standortseiten des Landes, je kWp.
// Die Balken wachsen beim Scrollen (Reveal), bei reduzierter Bewegung stehen sie sofort.

import Reveal from "@/components/ui/Reveal";
import { zahl } from "@/lib/bundesland/auswertung";

const MONATE = ["Jän", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export default function MonatsProfil({ monate, land, kwp = 100, id = "bl-monate" }) {
  if (!Array.isArray(monate) || monate.length !== 12) return null;
  const werte = monate.map((m) => m * kwp);
  const max = Math.max(...werte);
  const spitze = werte.indexOf(max);
  const B = 640;
  const H = 200;
  const O = 24;
  const breite = B / 12;

  return (
    <Reveal as="figure" className="min-w-0 rounded-3xl bg-white/[0.06] p-5 ring-1 ring-white/10 md:p-7">
      <figcaption className="mb-4 text-[15px] font-semibold text-white">
        Monatsertrag einer {zahl(kwp)}-kWp-Anlage im Landesmittel {land} (Süd, 35°)
      </figcaption>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${B} ${H + O + 28}`}
          className="h-auto w-full min-w-[420px]"
          role="img"
          aria-label={`Monatserträge in kWh: ${MONATE.map((m, i) => `${m} ${zahl(werte[i])}`).join(", ")}`}
        >
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8cba58" />
              <stop offset="1" stopColor="#558227" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1="0" x2={B} y1={O + H - H * f} y2={O + H - H * f} stroke="rgba(255,255,255,0.08)" />
          ))}
          {werte.map((w, i) => {
            const h = (w / max) * H;
            return (
              <g key={MONATE[i]}>
                <rect
                  x={i * breite + 7}
                  y={O + H - h}
                  width={breite - 14}
                  height={h}
                  rx="6"
                  fill={i === spitze ? "#ffc53d" : `url(#${id})`}
                  className="origin-bottom transition-transform duration-[1100ms] ease-out motion-safe:[.js-ready_.ov-reveal:not(.is-visible)_&]:scale-y-0"
                  style={{ transformBox: "fill-box", transitionDelay: `${i * 60}ms` }}
                />
                {i === spitze && (
                  <text x={i * breite + breite / 2} y={O + H - h - 8} textAnchor="middle" fill="#fff" className="text-[12px] font-bold">
                    {zahl(w)}
                  </text>
                )}
                <text x={i * breite + breite / 2} y={O + H + 20} textAnchor="middle" fill="rgba(255,255,255,0.7)" className="text-[12px]">
                  {MONATE[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Reveal>
  );
}
